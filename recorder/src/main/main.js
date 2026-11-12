'use strict';
const path = require('path');
const { app, BrowserWindow, ipcMain, desktopCapturer, screen, dialog, shell, globalShortcut, Menu, systemPreferences } = require('electron');
const settings = require('./settings');
const ffmpeg = require('./ffmpeg');
const { RawRecording, sweepOldRaw } = require('./recording-files');
const windows = require('./windows');
const { clampRegionToDisplay } = require('./region');
const Shapes = require('../shared/shapes');
const EventEmitter = require('events');
const dbHandlers = require('./ipc/db-handlers');
const transcriptionHandlers = require('./ipc/transcription-handlers');
const editHandlers = require('./ipc/edit-handlers');
const productionHandlers = require('./ipc/production-handlers');
const voiceHandlers = require('./ipc/voice-handlers');
const syncHandlers  = require('./ipc/sync-handlers');
const db = require('./db/sqlite');
const { reconcileOrphanedRecordings } = require('./db/reconcile');
const portability = require('./db/portability');
const { getDeviceId } = require('./identity');
const { recordingKey } = require('./r2/key');
const { loadEdl, remapTimestamp } = require('./edl');
const crypto = require('crypto');
const logger = require('./logger');

/** Internal event bus (used by the headless smoke test). */
const bus = new EventEmitter();

// Test harnesses get a throwaway profile so runs never inherit stale settings.
if (process.env.MOB_SHOT || process.env.MOB_SMOKE) {
  app.setPath('userData', require('path').join(app.getPath('temp'), 'mob-recorder-testprofile-' + process.pid));
}

// #69: console.* in a packaged app goes nowhere — every existing
// console.error/warn call across the main process (identity.js, settings.js,
// production.js, this file) already describes a real failure but none of it
// was ever written anywhere a user could find after the fact. Wrapping the
// two functions once, here, turns all of them into persisted log lines with
// no per-call-site changes; logger.write() itself no-ops safely before
// logger.init() runs (below, once app.getPath('userData') is available).
const _origConsoleError = console.error.bind(console);
const _origConsoleWarn  = console.warn.bind(console);
console.error = (...args) => { _origConsoleError(...args); logger.error(args.map(String).join(' ')); };
console.warn  = (...args) => { _origConsoleWarn(...args);  logger.warn(args.map(String).join(' ')); };

// Minimum viable crash reporting (task #69): an uncaught exception or
// rejection in the main process used to vanish with the process — nothing
// else in this file handles them. Logged, not swallowed into a silent exit:
// Electron's own default (print to stderr and often keep running in an
// undefined state) is worse than knowing it happened.
process.on('uncaughtException', (err) => {
  logger.error('uncaughtException: ' + (err && err.stack || err));
});
process.on('unhandledRejection', (reason) => {
  logger.error('unhandledRejection: ' + (reason && reason.stack || reason));
});

// #69: every ipcMain.handle call anywhere in the app (db-handlers.js,
// edit-handlers.js, sync-handlers.js, transcription-handlers.js, ...) is
// wrapped once, here, before any of those modules register their handlers
// below. A thrown error already propagates back to the renderer as a
// rejected invoke() promise; this additionally logs the channel name and
// message — which, for an ffmpeg-backed handler like edit:studioSound or
// edit:renderOutput, already contains the ffmpeg stderr tail (ffmpeg.js's
// own reject() messages embed it), so this one wrapper covers both the
// "IPC errors" and "ffmpeg stderr tails" parts of the task with no changes
// to ffmpeg.js or any individual handler file.
const _origIpcHandle = ipcMain.handle.bind(ipcMain);
ipcMain.handle = (channel, listener) => _origIpcHandle(channel, async (...args) => {
  try {
    return await listener(...args);
  } catch (err) {
    logger.error('IPC "' + channel + '" failed: ' + (err && err.message || err));
    throw err;
  }
});

if (!app.requestSingleInstanceLock()) app.quit();
app.setAppUserModelId('com.mob.recorder');

let control = null;
let bubble = null;
let recorder = null;
let recorderReady = null;   // resolves once the recorder window has loaded

/** Recording state machine: idle -> arming -> countdown -> recording <-> paused -> finalizing -> idle */
const rec = {
  state: 'idle',
  raw: null,
  startedAt: 0,
  pausedTotal: 0,
  pausedAt: 0,
  micEnabled: true,
  message: '',
  warnings: [],
  // Task #56: markers dropped live (chapter / retake) — collected here
  // because no recordings row exists yet to attach them to; persisted to
  // the markers table once finalize gives this take a real recording_id.
  markers: []
};

// ---------------------------------------------------------------- helpers

function broadcast(channel, payload) {
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) w.webContents.send(channel, payload);
  }
}

function sendControl(channel, payload) {
  if (control && !control.isDestroyed()) control.webContents.send(channel, payload);
}

function sendRecorder(channel, payload) {
  if (recorder && !recorder.isDestroyed()) recorder.webContents.send(channel, payload);
}

/**
 * The recorder window holds no media until a take starts, but an idle
 * renderer process still costs around 90 MB. It is created on first use
 * instead, which folds invisibly into the arm phase that already waits on
 * the camera.
 */
function ensureRecorder() {
  if (recorderReady) return recorderReady;
  recorder = windows.createRecorderWindow();
  if (process.env.MOB_SHOT || process.env.MOB_SMOKE) attachTestHooks(recorder, 'recorder');
  // loadFile() is asynchronous, so isLoading() can still be false here and
  // resolving on it would send the arm message into a page whose scripts have
  // not run. Wait for the load to actually finish.
  recorderReady = new Promise((resolve, reject) => {
    const win = recorder;
    win.webContents.once('did-finish-load', () => resolve());
    win.webContents.once('did-fail-load', (_e, code, desc) => {
      recorderReady = null;
      reject(new Error(`recorder window failed to load: ${code} ${desc}`));
    });
  });
  // There was no handler for this anywhere outside the test harness. A
  // renderer crash during recording/stop used to leave the state machine
  // stuck in its current state forever — start/stop/pause all guard on
  // rec.state and became permanent no-ops until the app was restarted.
  recorder.webContents.on('render-process-gone', (_e, details) => {
    console.error('[mob] recorder window renderer gone:', details.reason);
    recoverFromRecorderLoss('Recording engine crashed (' + details.reason + '). Please try again.');
  });
  recorder.on('closed', () => {
    recorderReady = null;
    recorder = null;
    if (!app.__quitting && rec.state !== 'idle') {
      recoverFromRecorderLoss('Recording engine window closed unexpectedly.');
    }
  });
  return recorderReady;
}

/** Resets the state machine after the recorder window dies or hangs mid-take. */
function recoverFromRecorderLoss(message) {
  if (finalizeTimeoutTimer) { clearTimeout(finalizeTimeoutTimer); finalizeTimeoutTimer = null; }
  if (rec.raw) { try { rec.raw.end(); } catch (_) {} rec.raw = null; }
  rec.state = 'idle';
  rec.startedAt = 0;
  rec.message = message;
  rec.markers = []; // the take is lost entirely — nothing to attach these to
  setCompact(false);
  publishState();
}

// Test harnesses attach console/crash listeners to every window; a lazily
// created one has to get them too.
let attachTestHooks = () => {};
function setTestHookAttacher(fn) { attachTestHooks = fn; }

// #58, part 1: a full disk crashes the main process mid-take (task #19) —
// RawRecording already tracks this.bytes, and nothing ever told the user
// how much had been written or that free space was running low until the
// crash itself did. 500MB is generous for the few seconds it takes someone
// to notice the warning and stop.
const LOW_DISK_BYTES = 500 * 1024 * 1024;

function publishState(extra) {
  const s = settings.get();
  let bytes = null, freeBytes = null, lowDisk = false;
  if (rec.raw) {
    bytes = rec.raw.bytes;
    try {
      const st = require('fs').statfsSync(s.recording.saveDir);
      freeBytes = st.bavail * st.bsize;
      lowDisk = freeBytes < LOW_DISK_BYTES;
    } catch (_) { /* statfs unsupported for this path/platform — skip rather than crash the state publish */ }
  }
  const payload = Object.assign({
    state: rec.state,
    micEnabled: rec.micEnabled,
    elapsedMs: elapsedMs(),
    message: rec.message,
    warnings: rec.warnings,
    bubbleVisible: s.bubble.visible,
    bytes, freeBytes, lowDisk,
  }, extra || {});
  sendControl('recording:state', payload);
  bus.emit('state', payload);
}

function elapsedMs() {
  if (!rec.startedAt) return 0;
  const pausedNow = rec.state === 'paused' && rec.pausedAt ? Date.now() - rec.pausedAt : 0;
  return Date.now() - rec.startedAt - rec.pausedTotal - pausedNow;
}

function overlayPayload() {
  const s = settings.get();
  const b = bubble && !bubble.isDestroyed() ? bubble.getBounds() : windows.bubbleBoundsFor(s, null);
  return {
    bounds: b,
    shape: s.bubble.shape,
    mirror: s.bubble.mirror,
    flipV: s.bubble.flipV,
    visible: s.bubble.visible,
    border: s.bubble.border
  };
}

let finalizeTimeoutTimer = null;
const FINALIZE_TIMEOUT_MS = 10 * 60 * 1000; // generous — a long recording genuinely takes a while to encode

/**
 * Bounds a promise so a hung ffmpeg/encode step can't strand the UI in
 * 'finalizing' forever. `onTimeout`, when given, actually kills the
 * underlying process (via an AbortSignal at the call site) — without it,
 * timing out here only abandons the promise while ffmpeg keeps running
 * and writing to the output file in the background.
 */
function withTimeout(promise, ms, message, onTimeout) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => { if (onTimeout) onTimeout(); reject(new Error(message)); }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

let overlayTimer = null;
function pushOverlay() {
  if (overlayTimer) return;
  overlayTimer = setTimeout(() => {
    overlayTimer = null;
    if (rec.state === 'recording' || rec.state === 'paused' || rec.state === 'countdown') {
      sendRecorder('recorder:updateOverlay', overlayPayload());
    }
  }, 16);
}

/** Apply bubble settings to the live window (shape/size/visibility/etc). */
function applyBubbleSettings(patch) {
  if (!bubble || bubble.isDestroyed()) return;
  const s = settings.get();
  if (patch && patch.bubble && ('shape' in patch.bubble || 'size' in patch.bubble)) {
    const next = windows.bubbleBoundsFor(s, bubble.getBounds());
    bubble.setBounds(next);
  }
  if (patch && patch.bubble && 'visible' in patch.bubble) {
    if (s.bubble.visible) bubble.showInactive(); else bubble.hide();
  }
  if (patch && patch.bubble && 'excludeFromCapture' in patch.bubble) {
    bubble.setContentProtection(!!s.bubble.excludeFromCapture);
  }
  pushOverlay();
}

function persistBubblePosition() {
  if (!bubble || bubble.isDestroyed()) return;
  const b = bubble.getBounds();
  settings.set({ bubble: { x: b.x, y: b.y } });
}

function persistControlPosition() {
  if (!control || control.isDestroyed()) return;
  if (rec.state === 'recording' || rec.state === 'paused' || rec.state === 'countdown') return;
  const b = control.getBounds();
  settings.set({ window: { x: b.x, y: b.y, width: b.width, height: b.height } });
}

async function listSources() {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 320, height: 180 },
    fetchWindowIcons: true
  });
  const displays = screen.getAllDisplays();
  const primaryId = String(screen.getPrimaryDisplay().id);
  return sources
    .filter((s) => !/^MOB Recorder$|^Camera$/.test(s.name)) // hide our own windows
    .map((s) => {
      const isScreen = s.id.startsWith('screen:');
      const display = isScreen ? displays.find((d) => String(d.id) === String(s.display_id)) : null;
      return {
        id: s.id,
        name: isScreen && display
          ? `Display ${displays.indexOf(display) + 1}${String(display.id) === primaryId ? ' (primary)' : ''}`
          : s.name,
        detail: isScreen && display ? `${display.size.width}×${display.size.height}` : null,
        kind: isScreen ? 'screen' : 'window',
        displayId: s.display_id || null,
        thumbnail: s.thumbnail && !s.thumbnail.isEmpty() ? s.thumbnail.toDataURL() : null,
        appIcon: s.appIcon && !s.appIcon.isEmpty() ? s.appIcon.toDataURL() : null
      };
    });
}

async function resolveSource() {
  const s = settings.get();
  const all = await listSources();
  let chosen = s.source.id ? all.find((x) => x.id === s.source.id) : null;
  if (!chosen && s.source.kind === 'screen' && s.source.displayId) {
    chosen = all.find((x) => x.kind === 'screen' && String(x.displayId) === String(s.source.displayId));
  }
  if (!chosen) {
    const primaryId = String(screen.getPrimaryDisplay().id);
    chosen = all.find((x) => x.kind === 'screen' && String(x.displayId) === primaryId) || all.find((x) => x.kind === 'screen');
  }
  if (!chosen) throw new Error('No screen available to record.');
  settings.set({ source: { id: chosen.id, name: chosen.name, kind: chosen.kind, displayId: chosen.displayId } });
  return chosen;
}

function displayBoundsFor(source) {
  if (source.kind !== 'screen') return null;
  const d = screen.getAllDisplays().find((x) => String(x.id) === String(source.displayId));
  return d ? d.bounds : screen.getPrimaryDisplay().bounds;
}

// ---------------------------------------------------------------- recording

async function startRecording() {
  if (rec.state !== 'idle') return;
  const s = settings.get();
  const captureMode = s.recording.captureMode || 'screenCam';
  // Task #62: camOnly/audioOnly capture no desktop source at all —
  // resolveSource() requires a screen to exist and throws otherwise, which
  // is correct for the default mode but would wrongly block every take in
  // these two (e.g. a laptop with no screen-capture permission granted yet,
  // but a perfectly good camera).
  // Task #77: region needs a real screen source too (it crops a sub-rect of
  // one), so it shares screenCam's resolveSource() call.
  let source = null;
  if (captureMode === 'screenCam' || captureMode === 'region') {
    try {
      source = await resolveSource();
    } catch (err) {
      rec.message = err.message;
      publishState();
      return;
    }
  }
  if (captureMode === 'region' && !s.recording.region) {
    rec.message = 'No region selected yet — use "Select region" below.';
    publishState();
    return;
  }

  rec.state = 'arming';
  rec.message = '';
  rec.warnings = [];
  rec.markers = [];
  publishState();

  try {
    await ensureRecorder();
  } catch (err) {
    rec.state = 'idle';
    rec.message = err.message;
    publishState();
    return;
  }
  if (rec.state !== 'arming') return;  // cancelled while the window came up

  rec.raw = new RawRecording();
  rec.micEnabled = s.mic.enabled;
  rec.pausedTotal = 0;
  rec.pausedAt = 0;

  // Phase 1. Opening the camera, screen and mic can take up to a couple of
  // seconds on Windows. This has to complete BEFORE the countdown, otherwise
  // the countdown hits zero, the user starts talking, and the encoder is not
  // running yet.
  sendRecorder('recorder:arm', {
    captureMode,
    sourceId: source && source.id,
    sourceKind: source && source.kind,
    displayBounds: source ? displayBoundsFor(source) : null,
    region: captureMode === 'region' ? s.recording.region : null,
    overlay: overlayPayload(),
    cameraDeviceId: s.camera.deviceId,
    cameraHint: Math.max(160, s.bubble.size),
    micDeviceId: s.mic.deviceId,
    micEnabled: rec.micEnabled,
    fps: s.recording.fps,
    maxHeight: s.recording.maxHeight,
    targetFormat: s.recording.format,
    quality: s.recording.quality,
    // H.265 and AV1 cannot be remuxed from an H.264 capture.
    wantsTranscode: s.recording.format === 'mp4' && s.recording.codec !== 'h264'
  });
}

/** Phase 2, once devices are open: count down, then start encoding. */
async function runCountdownAndGo() {
  const s = settings.get();
  rec.state = 'countdown';
  publishState();

  for (let n = s.recording.countdown; n > 0; n--) {
    broadcast('ui:countdown', n);
    await new Promise((r) => setTimeout(r, 1000));
    if (rec.state !== 'countdown') return; // cancelled
  }
  broadcast('ui:countdown', 0);
  if (rec.state !== 'countdown') return;
  sendRecorder('recorder:go');
}

function stopRecording() {
  if (rec.state === 'countdown' || rec.state === 'arming') {
    rec.state = 'idle';
    broadcast('ui:countdown', 0);
    sendRecorder('recorder:stop');
    // Nothing has been written yet at this point — go() (and therefore the
    // first chunk) hasn't run — so the raw file is empty and safe to remove
    // immediately instead of leaving an orphan for the 2-day sweep.
    if (rec.raw) {
      const rawPath = rec.raw.path;
      rec.raw.end().then(() => require('fs').promises.unlink(rawPath)).catch(() => {});
      rec.raw = null;
    }
    publishState();
    return;
  }
  if (rec.state !== 'recording' && rec.state !== 'paused') return;
  // Stopping directly from 'paused' used to skip folding the open pause
  // interval into pausedTotal (elapsedMs()'s pausedNow term only applies in
  // the 'paused' state, which this leaves immediately) — the elapsed time
  // shown during finalizing would jump by the length of the last pause.
  if (rec.state === 'paused' && rec.pausedAt) {
    rec.pausedTotal += Date.now() - rec.pausedAt;
    rec.pausedAt = 0;
  }
  rec.state = 'finalizing';
  publishState({ progress: 0 });
  sendRecorder('recorder:stop');
}

function togglePause() {
  if (rec.state === 'recording') {
    rec.state = 'paused';
    rec.pausedAt = Date.now();
    sendRecorder('recorder:pause');
  } else if (rec.state === 'paused') {
    rec.state = 'recording';
    rec.pausedTotal += Date.now() - rec.pausedAt;
    rec.pausedAt = 0;
    sendRecorder('recorder:resume');
  }
  publishState();
}

function setMic(enabled) {
  rec.micEnabled = !!enabled;
  settings.set({ mic: { enabled: rec.micEnabled } });
  sendRecorder('recorder:setMic', rec.micEnabled);
  publishState();
}

function toggleBubble() {
  const s = settings.get();
  settings.set({ bubble: { visible: !s.bubble.visible } });
}

function setCompact(on) {
  if (!control || control.isDestroyed()) return;
  const s = settings.get();
  if (on && !s.recording.compactWhileRecording) return;
  if (on) {
    control.__restoreBounds = control.getBounds();
    const wa = screen.getDisplayMatching(control.getBounds()).workArea;
    const { width, height } = windows.COMPACT_SIZE;
    control.setMinimumSize(width, height);
    control.setBounds({ x: Math.round(wa.x + wa.width / 2 - width / 2), y: wa.y + wa.height - height - 16, width, height });
    control.setAlwaysOnTop(true, 'screen-saver');
    control.setContentProtection(true);
    control.setSkipTaskbar(false);
  } else {
    control.setAlwaysOnTop(false);
    control.setContentProtection(false);
    control.setMinimumSize(380, 480);
    if (control.__restoreBounds) control.setBounds(control.__restoreBounds);
  }
  sendControl('ui:compact', !!on);
}

// Returns { id, warning }. warning is non-null on failure, null on success.
// The caller folds warning into the single finalize:done it sends — this
// used to send its own finalize:done on failure and the caller sent a
// second one right after, so the second always clobbered the first and the
// warning never reached the user even though it was built correctly.
function persistRecordingRow(filePath, durationMs, format, codec) {
  const id = crypto.randomUUID();
  try {
    const deviceId = getDeviceId();
    const r2Key = recordingKey(id, format);
    db.run(
      `INSERT INTO recordings (id, device_id, path, duration_ms, codec, status, r2_key, created_at)
       VALUES (?, ?, ?, ?, ?, 'ready', ?, datetime('now'))`,
      [id, deviceId, filePath, durationMs, codec, r2Key]
    );
    return { id, warning: null };
  } catch (e) {
    // The file IS saved — only the DB row write failed. Return a non-fatal
    // warning rather than treating this as finalize:error, so the user
    // isn't told the save failed when the video is actually fine on disk.
    console.error('[mob] Failed to persist recording row:', e.message);
    return { id, warning: 'Recording saved but not indexed: ' + e.message };
  }
}

// Task #56: rec.markers only exists in main-process memory until a take is
// finalized and gets a real recording_id (see rec.markers' own comment).
// Called once right after persistRecordingRow() on every finalize path —
// success and the H.264 retry — then the in-memory buffer is drained so a
// second finalize (there isn't one today, but nothing enforces that) can't
// double-insert the same markers against a different recording_id.
function persistMarkers(recordingId) {
  if (!rec.markers.length) return;
  for (const m of rec.markers) {
    try {
      db.run(
        `INSERT INTO markers (recording_id, type, at_ms, created_at) VALUES (?, ?, ?, datetime('now'))`,
        [recordingId, m.type, m.atMs]
      );
    } catch (e) {
      console.error('[mob] Failed to persist marker:', e.message);
    }
  }
  rec.markers = [];
}

/**
 * The recordings.thumb column and the UI's thumbnail slot both existed with
 * nothing ever writing it. Runs after finalize (fire-and-forget — thumbnail
 * generation shouldn't delay telling the user the save succeeded).
 */
function generateThumbnailFor(recordingId, videoPath) {
  const thumbDir = path.join(app.getPath('userData'), 'thumbs');
  try { require('fs').mkdirSync(thumbDir, { recursive: true }); } catch (_) {}
  const thumbPath = path.join(thumbDir, recordingId + '.jpg');
  ffmpeg.extractThumbnail(videoPath, thumbPath, 0.5)
    .then(() => {
      db.run('UPDATE recordings SET thumb = ? WHERE id = ?', [thumbPath, recordingId]);
      sendControl('recording:thumbReady', { recordingId, thumb: thumbPath });
    })
    .catch((err) => {
      console.error('[mob] thumbnail generation failed for', recordingId, ':', err.message);
    });
}

async function finalizeRecording(durationMs, rawVideoCodec) {
  const s = settings.get();
  const raw = rec.raw;
  rec.raw = null;
  if (!raw) { rec.state = 'idle'; publishState(); return; }

  const format = s.recording.format === 'webm' ? 'webm' : 'mp4';
  let outputPath = path.join(s.recording.saveDir, raw.suggestedName(format));

  if (s.recording.askWhereToSave) {
    setCompact(false);
    const res = await dialog.showSaveDialog(control, {
      title: 'Save recording',
      defaultPath: outputPath,
      filters: format === 'mp4' ? [{ name: 'MP4 video', extensions: ['mp4'] }] : [{ name: 'WebM video', extensions: ['webm'] }]
    });
    if (!res.canceled && res.filePath) outputPath = res.filePath;
  }

  const finalizeAbort = new AbortController();
  try {
    const result = await withTimeout(
      raw.finalize(outputPath, {
        format,
        codec: s.recording.codec,
        quality: s.recording.quality,
        fps: s.recording.fps,
        durationMs,
        rawVideoCodec
      }, (p) => sendControl('finalize:progress', p), finalizeAbort.signal),
      FINALIZE_TIMEOUT_MS,
      'Finalize timed out — the encoder may be stuck.',
      () => finalizeAbort.abort()
    );
    rec.state = 'idle';
    rec.startedAt = 0;
    setCompact(false);
    publishState();
    const { id: newRecId, warning: dbWarning } = persistRecordingRow(result.output, durationMs, format, s.recording.codec);
    persistMarkers(newRecId);
    // Durability: this INSERT is the only record a finished take exists.
    // Force it to disk now rather than leaving it to the 1s debounce — a
    // crash or forced quit inside that window otherwise leaves a complete
    // video file with no row, invisible to the app forever.
    await db.flush();
    sendControl('finalize:done', { path: result.output, durationMs, format, dbWarning });
    bus.emit('finalized', { path: result.output, durationMs });
    if (!dbWarning) generateThumbnailFor(newRecId, result.output);
  } catch (caughtErr) {
    // A plain local, not the exception parameter itself — the retry below
    // needs to replace it with the retry's own failure on top of the
    // original, which reassigning a catch binding directly (no-ex-assign)
    // works but obscures.
    let err = caughtErr;
    // Hardware encoder missing/failing? Retry once with libx264.
    if (format === 'mp4' && s.recording.codec !== 'h264') {
      try {
        const retryRaw = raw; // raw file still exists because finalize failed before unlink
        const retryAbort = new AbortController();
        const result = await withTimeout(
          ffmpeg.finalize(retryRaw.path, outputPath, {
            format, codec: 'h264', quality: s.recording.quality, fps: s.recording.fps, durationMs, rawVideoCodec
          }, (p) => sendControl('finalize:progress', p), retryAbort.signal),
          FINALIZE_TIMEOUT_MS,
          'Finalize timed out — the encoder may be stuck.',
          () => retryAbort.abort()
        );
        try { require('fs').unlinkSync(retryRaw.path); } catch (_) { /* ignore */ }
        rec.state = 'idle';
        rec.startedAt = 0;
        setCompact(false);
        publishState({ message: `Encoder "${s.recording.codec}" failed, saved with H.264 instead.` });
        const { id: retryRecId, warning: dbWarning } = persistRecordingRow(result.output, durationMs, format, 'h264');
        persistMarkers(retryRecId);
        await db.flush();
        sendControl('finalize:done', { path: result.output, durationMs, format, note: `Encoder "${s.recording.codec}" failed, saved with H.264 instead.`, dbWarning });
        bus.emit('finalized', { path: result.output, durationMs });
        if (!dbWarning) generateThumbnailFor(retryRecId, result.output);
        return;
      } catch (err2) {
        err = err2;
      }
    }
    rec.state = 'idle';
    rec.startedAt = 0;
    setCompact(false);
    rec.message = 'Saving failed: ' + err.message + `\nRaw recording kept at: ${raw.path}`;
    rec.markers = []; // finalize failed with no recording_id to attach them to
    publishState();
    sendControl('finalize:error', { message: err.message, rawPath: raw.path });
    bus.emit('finalize-error', err);
  }
}

// ---------------------------------------------------------------- bubble UI

function showBubbleMenu() {
  const s = settings.get();
  // A native menu popup is a separate OS window, so bubble.setContentProtection
  // does not cover it and it composites straight into the recording. Suppress
  // it while live; the hotkeys and the compact bar cover what's needed there.
  if (rec.state === 'recording' || rec.state === 'paused' || rec.state === 'countdown') {
    if (bubble && !bubble.isDestroyed()) bubble.webContents.send('bubble:menuBlocked');
    return;
  }
  const shapeItems = Shapes.ORDER.map((id) => ({
    label: Shapes.SHAPES[id].label, type: 'radio', checked: s.bubble.shape === id,
    click: () => settings.set({ bubble: { shape: id } })
  }));
  const sizeItems = Object.entries(Shapes.SIZES).map(([k, v]) => ({
    label: `${k[0].toUpperCase()}${k.slice(1)} (${v}px)`, type: 'radio', checked: s.bubble.size === v,
    click: () => settings.set({ bubble: { size: v } })
  }));
  const corners = ['Top left', 'Top right', 'Bottom left', 'Bottom right'].map((label, i) => ({
    label,
    click: () => {
      if (!bubble) return;
      const b = bubble.getBounds();
      const wa = screen.getDisplayMatching(b).workArea;
      const m = 32;
      const x = i % 2 === 0 ? wa.x + m : wa.x + wa.width - b.width - m;
      const y = i < 2 ? wa.y + m : wa.y + wa.height - b.height - m;
      bubble.setBounds({ x, y, width: b.width, height: b.height });
      persistBubblePosition();
    }
  }));
  const recording = rec.state === 'recording' || rec.state === 'paused';
  const menu = Menu.buildFromTemplate([
    { label: recording ? 'Stop recording' : 'Start recording', click: () => (recording ? stopRecording() : startRecording()) },
    { label: rec.state === 'paused' ? 'Resume' : 'Pause', enabled: recording, click: togglePause },
    { label: rec.micEnabled ? 'Mute mic' : 'Unmute mic', click: () => setMic(!rec.micEnabled) },
    { type: 'separator' },
    { label: 'Shape', submenu: shapeItems },
    { label: 'Size', submenu: sizeItems },
    { label: 'Snap to corner', submenu: corners },
    { label: 'Mirror left-right', type: 'checkbox', checked: s.bubble.mirror, click: () => settings.set({ bubble: { mirror: !s.bubble.mirror } }) },
    { label: 'Flip upside down', type: 'checkbox', checked: s.bubble.flipV, click: () => settings.set({ bubble: { flipV: !s.bubble.flipV } }) },
    { label: 'Border ring', type: 'checkbox', checked: s.bubble.border, click: () => settings.set({ bubble: { border: !s.bubble.border } }) },
    { type: 'separator' },
    { label: 'Hide bubble  (Ctrl+Shift+H)', click: toggleBubble },
    { label: 'Show control panel', click: () => { if (control) { control.show(); control.focus(); } } }
  ]);
  menu.popup({ window: bubble });
}

// Manual resize: the bubble sends pointer positions from its corner grip.
let resizeStart = null;
function handleBubbleResize(ev) {
  if (!bubble || bubble.isDestroyed()) return;
  const s = settings.get();
  const shape = Shapes.SHAPES[s.bubble.shape] || Shapes.SHAPES.circle;
  if (ev.phase === 'start') {
    resizeStart = { bounds: bubble.getBounds(), size: s.bubble.size, px: ev.screenX, py: ev.screenY };
    bubble.webContents.send('bubble:resizing', true);
    return;
  }
  if (!resizeStart) return;
  const dx = ev.screenX - resizeStart.px;
  const dy = ev.screenY - resizeStart.py;
  // Grow along whichever axis moved more, measured in "shorter side" units.
  const delta = shape.aspect >= 1 ? Math.max(dx / shape.aspect, dy) : Math.max(dx, dy * shape.aspect);
  const size = Math.round(Math.max(96, Math.min(720, resizeStart.size + delta)));
  const dim = Shapes.dimensions(s.bubble.shape, size);
  bubble.setBounds({ x: resizeStart.bounds.x, y: resizeStart.bounds.y, width: dim.width, height: dim.height });
  if (ev.phase === 'end') {
    resizeStart = null;
    bubble.webContents.send('bubble:resizing', false);
    settings.set({ bubble: { size } });
  }
  pushOverlay();
}

// ---------------------------------------------------------------- IPC

// Strip the Cloudflare API token before sending settings to any renderer.
// cf:getConfig is the designated channel — it returns tokenStored: boolean.
function safeSettings(s) {
  if (!s || !s.cloudflare || !s.cloudflare.apiToken) return s;
  const cf = Object.assign({}, s.cloudflare);
  delete cf.apiToken;
  return Object.assign({}, s, { cloudflare: cf });
}

ipcMain.handle('settings:get', () => safeSettings(settings.get()));
ipcMain.handle('settings:set', (_e, patch) => {
  const result = safeSettings(settings.set(patch));
  if (patch.hotkeys) registerShortcuts();
  return result;
});
ipcMain.handle('hotkeys:getConflicts', () => registerShortcuts());
ipcMain.handle('state:get', () => ({
  state: rec.state, micEnabled: rec.micEnabled, elapsedMs: elapsedMs(), message: rec.message,
  bubbleVisible: settings.get().bubble.visible
}));
ipcMain.handle('sources:list', () => listSources());
// Task #77: region capture. Opens a transparent, always-on-top overlay
// spanning every display, lets the user drag a rectangle, and resolves with
// the absolute DIP rect plus the screen source it landed on — storing that
// screen as settings.source is what lets resolveSource()/startRecording()'s
// existing screenCam resolution path work unmodified for region mode too;
// only the crop in recorder.js's drawFrame() is new.
let regionPicker = null;
ipcMain.handle('region:pick', async () => {
  if (regionPicker && !regionPicker.isDestroyed()) return { ok: false, reason: 'already picking' };
  const pickerBounds = windows.regionPickerBounds();
  return new Promise((resolve) => {
    regionPicker = windows.createRegionPickerWindow();
    let settled = false;
    const onCancelled = () => finish({ ok: false, reason: 'cancelled' });
    const onSelected = (_e, localRect) => handleSelected(localRect);
    const finish = (result) => {
      if (settled) return;
      settled = true;
      // ipcMain.once auto-removes whichever of these two actually fired, but
      // not the other one — without this, a pick that resolves via the
      // window's 'closed' event (no message sent) leaks a listener on every
      // call, and over enough region picks the stale ones start firing
      // against an already-settled (harmless) or, worse, a FUTURE pick's
      // promise.
      ipcMain.removeListener('region:cancelled', onCancelled);
      ipcMain.removeListener('region:selected', onSelected);
      if (regionPicker && !regionPicker.isDestroyed()) regionPicker.close();
      regionPicker = null;
      resolve(result);
    };
    ipcMain.once('region:cancelled', onCancelled);
    ipcMain.once('region:selected', onSelected);
    async function handleSelected(localRect) {
      // The overlay's own bounds are the origin for its mouse coordinates —
      // regionPickerBounds() is the union of every display, not any one
      // display's own origin, so this is NOT the same as displayBoundsFor().
      const absRect = {
        x: pickerBounds.x + localRect.x,
        y: pickerBounds.y + localRect.y,
        width: localRect.width,
        height: localRect.height,
      };
      const centerPoint = { x: Math.round(absRect.x + absRect.width / 2), y: Math.round(absRect.y + absRect.height / 2) };
      const display = screen.getDisplayNearestPoint(centerPoint);
      // Clamp to the matched display — a drag that spilled onto a second
      // monitor still has to crop from exactly one desktop-capture stream.
      const relRect = clampRegionToDisplay(absRect, display);
      const all = await listSources();
      const screenSource = all.find((s) => s.kind === 'screen' && String(s.displayId) === String(display.id));
      if (!screenSource) { finish({ ok: false, reason: 'no matching screen source' }); return; }
      settings.set({
        source: { id: screenSource.id, name: screenSource.name, kind: 'screen', displayId: screenSource.displayId },
        recording: { region: relRect }
      });
      finish({ ok: true, region: relRect, displayName: screenSource.name });
    }
    regionPicker.on('closed', () => finish({ ok: false, reason: 'window closed' }));
  });
});
ipcMain.handle('codecs:list', () => ffmpeg.codecOptions());
ipcMain.handle('shapes:list', () => ({ order: Shapes.ORDER, labels: Object.fromEntries(Shapes.ORDER.map((k) => [k, Shapes.SHAPES[k].label])), sizes: Shapes.SIZES }));
ipcMain.handle('recording:start', () => startRecording());
ipcMain.handle('recording:stop', () => stopRecording());
ipcMain.handle('recording:togglePause', () => togglePause());
// Task #56: "chapter here" / "scratch that" markers. Live, during
// recording, so timestamped against elapsedMs() — no recordings row exists
// yet to attach them to (see rec.markers' own comment above); collected
// here and persisted once finalize gives this take a real recording_id.
// Shared by the IPC handler (compact-bar buttons) and the global hotkeys below.
function dropMarker(type) {
  if (rec.state !== 'recording' && rec.state !== 'paused') return { ok: false, reason: 'not recording' };
  if (type !== 'chapter' && type !== 'retake') return { ok: false, reason: 'unknown marker type: ' + type };
  const atMs = elapsedMs();
  rec.markers.push({ type, atMs });
  // One-shot confirmation via publishState's extra-payload override, not a
  // rec.message assignment — rec.message is the STICKY status (device loss,
  // low disk, failure reasons) that's meant to still read correctly after
  // the take ends. Writing straight to it left "Retake marked at 00:00:03"
  // showing as the idle-state message once the take finished, well past
  // when it meant anything.
  publishState({ message: (type === 'chapter' ? 'Chapter marker dropped at ' : 'Retake marked at ') + toSrtTime(atMs).slice(0, 8) });
  return { ok: true, atMs };
}
ipcMain.handle('recording:dropMarker', (_e, { type }) => dropMarker(type));
ipcMain.handle('mic:set', (_e, on) => setMic(on));
ipcMain.handle('bubble:toggle', () => toggleBubble());
ipcMain.handle('bubble:contextMenu', () => showBubbleMenu());
ipcMain.on('bubble:resize', (_e, ev) => handleBubbleResize(ev));
ipcMain.handle('dialog:chooseSaveDir', async () => {
  const res = await dialog.showOpenDialog(control, { properties: ['openDirectory', 'createDirectory'], defaultPath: settings.get().recording.saveDir });
  if (res.canceled || !res.filePaths[0]) return null;
  settings.set({ recording: { saveDir: res.filePaths[0] } });
  return res.filePaths[0];
});
/**
 * Windows 10 has no per-app camera prompt for desktop apps: access is governed
 * by one global "Allow desktop apps to access your camera" switch. When it is
 * off, getUserMedia fails with no explanation, so we read the real status and
 * can deep-link straight to the right Settings page.
 */
ipcMain.handle('permissions:get', () => {
  const read = (kind) => {
    try { return systemPreferences.getMediaAccessStatus(kind); } catch (_) { return 'unknown'; }
  };
  return { camera: read('camera'), microphone: read('microphone'), platform: process.platform };
});

ipcMain.handle('permissions:openSettings', (_e, kind) => {
  if (process.platform === 'win32') {
    return shell.openExternal(kind === 'microphone' ? 'ms-settings:privacy-microphone' : 'ms-settings:privacy-webcam');
  }
  if (process.platform === 'darwin') {
    const node = kind === 'microphone' ? 'Privacy_Microphone' : 'Privacy_Camera';
    return shell.openExternal('x-apple.systempreferences:com.apple.preference.security?' + node);
  }
  return null;
});

ipcMain.handle('shell:openPath', (_e, p) => shell.openPath(p));
ipcMain.handle('shell:showItemInFolder', (_e, p) => shell.showItemInFolder(p));
ipcMain.handle('window:minimize', () => control && control.minimize());
ipcMain.handle('window:close', () => app.quit());

ipcMain.handle('waveform:load', async (_e, filePath) => {
  if (!filePath) throw new Error('waveform:load: no path');
  // Allow userData (raw recordings) or any path already persisted in the DB
  const allowedBase = path.resolve(app.getPath('userData')) + path.sep;
  const inUserData = path.resolve(filePath).startsWith(allowedBase);
  const inDb = inUserData ? true : (() => {
    const row = db.get('SELECT id FROM recordings WHERE path = ?', [filePath]);
    return !!row;
  })();
  if (!inDb) throw new Error('waveform:load: path not in recordings');
  try {
    // Decode server-side and return a small peaks array instead of reading
    // the whole video file into memory and shipping it over IPC for the
    // renderer to decode with Web Audio — see ffmpeg.extractPeaks.
    return await ffmpeg.extractPeaks(filePath, 1000);
  } catch (err) {
    throw new Error('waveform:load failed: ' + err.message);
  }
});

function toSrtTime(ms) {
  // A NaN or negative value (e.g. from a bad EDL remap) used to produce an
  // unplayable "NaN:NaN:NaN,NaN" cue instead of a clamped, valid timestamp.
  ms = Number.isFinite(ms) && ms > 0 ? Math.round(ms) : 0;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const f = ms % 1000;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(f).padStart(3,'0')}`;
}
function toVttTime(ms) { return toSrtTime(ms).replace(',', '.'); }

ipcMain.handle('captions:export', async (_e, { recordingId, format = 'srt' }) => {
  const transcript = db.get(
    'SELECT id FROM transcripts WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1',
    [recordingId]
  );
  if (!transcript) throw new Error('No transcript for recording ' + recordingId);
  const segs = db.all(
    "SELECT start_ms, end_ms, text FROM segments WHERE transcript_id = ? AND type = 'speech' ORDER BY seq",
    [transcript.id]
  );
  if (!segs.length) throw new Error('No caption segments found');

  // Remap through the EDL so exported captions match what the user actually
  // cut, not the original recording. remapTimestamp() returns null for a
  // timestamp inside a cut; a segment whose start maps to null was removed
  // entirely and is dropped, and an end that lands inside a cut is pulled
  // back to just before it (sourceMs - 1) so a partially-cut segment is
  // clipped to what survived rather than thrown away outright.
  const edlEntries = loadEdl(recordingId);
  const remapped = edlEntries.length
    ? segs.map(seg => {
        const start = remapTimestamp(edlEntries, seg.start_ms);
        if (start === null) return null;
        let end = remapTimestamp(edlEntries, Math.max(seg.start_ms, seg.end_ms - 1));
        if (end === null) end = start + 1;
        return { start_ms: start, end_ms: Math.max(start + 1, end), text: seg.text };
      }).filter(Boolean)
    : segs;
  if (!remapped.length) throw new Error('All caption segments fall inside cuts for this recording');

  let content;
  if (format === 'vtt') {
    const body = remapped.map(seg => `${toVttTime(seg.start_ms)} --> ${toVttTime(seg.end_ms)}\n${seg.text}`).join('\n\n');
    content = 'WEBVTT\n\n' + body + '\n';
  } else {
    content = remapped.map((seg, i) =>
      `${i + 1}\n${toSrtTime(seg.start_ms)} --> ${toSrtTime(seg.end_ms)}\n${seg.text}\n`
    ).join('\n');
  }

  const recRow = db.get('SELECT path FROM recordings WHERE id = ?', [recordingId]);
  const base = recRow && recRow.path ? path.basename(recRow.path, path.extname(recRow.path)) : 'captions';
  const { canceled, filePath } = await dialog.showSaveDialog(control, {
    defaultPath: base + '.' + format,
    filters: format === 'vtt'
      ? [{ name: 'WebVTT', extensions: ['vtt'] }]
      : [{ name: 'SubRip', extensions: ['srt'] }],
  });
  if (canceled || !filePath) return { ok: false };
  require('fs').writeFileSync(filePath, content, 'utf8');
  return { ok: true, path: filePath };
});

ipcMain.handle('recording:delete', (_e, { recordingId, deleteFile = false }) => {
  const row = db.get('SELECT id, path, thumb FROM recordings WHERE id = ?', [recordingId]);
  if (!row) return { ok: false, error: 'Not found' };

  // These nine DELETEs used to run with no transaction, unlike edl.applyCuts
  // and transcription's write — a throw mid-sequence (or a crash) could
  // leave the recording row gone while words/segments/clips survived, and
  // every cleanup path keys off recording_id, so nothing would ever find
  // those rows again.
  db.exec('BEGIN');
  try {
    const transcript = db.get('SELECT id FROM transcripts WHERE recording_id = ?', [recordingId]);
    if (transcript) {
      db.run('DELETE FROM words WHERE transcript_id = ?', [transcript.id]);
      db.run('DELETE FROM segments WHERE transcript_id = ?', [transcript.id]);
    }
    db.run('DELETE FROM distributions WHERE recording_id = ?', [recordingId]);
    db.run('DELETE FROM production_packages WHERE recording_id = ?', [recordingId]);
    db.run('DELETE FROM edl_entries WHERE recording_id = ?', [recordingId]);
    db.run('DELETE FROM metadata_tags WHERE recording_id = ?', [recordingId]);
    db.run('DELETE FROM transcripts WHERE recording_id = ?', [recordingId]);
    db.run('DELETE FROM clips WHERE recording_id = ?', [recordingId]);
    db.run('DELETE FROM recordings WHERE id = ?', [recordingId]);
    db.exec('COMMIT');
  } catch (err) {
    try { db.exec('ROLLBACK'); } catch (_) { /* transaction already gone */ }
    throw err;
  }

  if (deleteFile) {
    if (row.path) { try { require('fs').unlinkSync(row.path); } catch (_) {} }
    if (row.thumb) { try { require('fs').unlinkSync(row.thumb); } catch (_) {} }
  }
  return { ok: true };
});

// From the hidden recorder window
ipcMain.on('recorder:chunk', (_e, chunk) => {
  if (!rec.raw) return;
  rec.raw.append(chunk);
  // A disk error (most commonly disk-full) used to have no listener on the
  // write stream at all, so it threw unhandled and crashed the main process.
  // Now it's caught and surfaced here: stop the take immediately rather than
  // keep silently dropping every subsequent chunk until the user notices.
  if (rec.raw.hadError && rec.state !== 'finalizing') {
    rec.message = 'Recording stopped: disk write failed (' + rec.raw.hadError.message + ')';
    stopRecording();
  }
});
ipcMain.on('recorder:state', (_e, msg) => {
  if (msg.warnings) {
    rec.warnings = msg.warnings;
    // #58, part 3: a warnings-only message (e.g. a device disconnecting
    // mid-take) carries no `state` key, so none of the branches below would
    // otherwise publish it — it would just sit until the next scheduled
    // tick. Surface it immediately instead.
    if (!msg.state) publishState();
  }
  if (msg.state === 'armed' && rec.state === 'arming') {
    runCountdownAndGo();
    publishState({ canvas: msg.canvas });
    return;
  }
  if (msg.state === 'recording' && rec.state === 'countdown') {
    rec.state = 'recording';
    rec.startedAt = Date.now();
    setCompact(true);
    publishState({ canvas: msg.canvas });
  } else if (msg.state === 'error') {
    rec.state = 'idle';
    rec.startedAt = 0;
    rec.message = msg.message || 'Recording failed.';
    if (rec.raw) { rec.raw.end(); rec.raw = null; }
    rec.markers = []; // the take is lost entirely — nothing to attach these to
    setCompact(false);
    publishState();
  }
});
ipcMain.on('recorder:done', (_e, msg) => { if (msg.perf) bus.emit('perf', msg.perf); finalizeRecording(msg.durationMs, msg.rawVideoCodec); });
// #58, part 2: relays the level analyser running on the real micStream (the
// recorder window, hidden) to the control window's meter — plain
// passthrough, no state kept here.
ipcMain.on('recorder:micLevel', (_e, data) => { sendControl('recorder:micLevel', data); });

// ---------------------------------------------------------------- lifecycle

settings.onChange((all, patch) => {
  broadcast('settings:changed', safeSettings(all));
  applyBubbleSettings(patch);
});

// #59: hotkeys were four accelerators hardcoded here with no way to rebind
// them, and a conflict with another app's global shortcut only
// console.warn'd — completely invisible to the user, who just saw the
// hotkey silently do nothing. Now reads from settings (rebindable in the
// UI) and reports which bindings failed so the renderer can show a real
// warning instead of nothing happening.
const HOTKEY_ACTIONS = {
  toggleRecording: () => (rec.state === 'idle' ? startRecording() : stopRecording()),
  togglePause: () => togglePause(),
  toggleMic: () => setMic(!rec.micEnabled),
  toggleBubble: () => toggleBubble(),
  // Task #56: unbound by default (no DEFAULTS entry in settings.js) — these
  // only do anything once the user assigns an accelerator in the Hotkeys
  // card, same as any other optional binding.
  dropChapterMarker: () => dropMarker('chapter'),
  dropRetakeMarker: () => dropMarker('retake'),
};
const HOTKEY_LABELS = {
  toggleRecording: 'Start / stop recording',
  togglePause: 'Pause / resume',
  toggleMic: 'Mute / unmute mic',
  toggleBubble: 'Hide / show bubble',
  dropChapterMarker: 'Drop chapter marker',
  dropRetakeMarker: 'Mark retake ("scratch that")',
};

function registerShortcuts() {
  globalShortcut.unregisterAll();
  const hk = settings.get().hotkeys || {};
  const failed = [];
  for (const [key, fn] of Object.entries(HOTKEY_ACTIONS)) {
    const accel = hk[key];
    if (!accel) continue; // empty binding = intentionally unbound
    if (!globalShortcut.register(accel, fn)) {
      logger.warn(`hotkey conflict: ${accel} (${HOTKEY_LABELS[key]}) is already bound by another app`);
      failed.push({ key, accel, label: HOTKEY_LABELS[key] });
    }
  }
  sendControl('hotkeys:conflicts', failed);
  return failed;
}

app.whenReady().then(async () => {
  logger.init(app.getPath('userData'));
  logger.info('app ready — version ' + app.getVersion() + ', platform ' + process.platform + ' ' + process.arch);

  // Initialize SQLite (ADR-001) and register IPC handlers before windows open.
  await db.init();
  // A corrupt mob.db used to throw straight out of init(), landing in the
  // catch below: an error dialog, then app.quit() — on every subsequent
  // launch, forever, with no way back in. sqlite.js now quarantines a bad
  // file and starts fresh instead of throwing; tell the user plainly
  // rather than silently handing them an empty library.
  const recovery = db.getLastRecovery();
  if (recovery) {
    // The fresh DB has zero rows, but the actual video files on disk are
    // untouched — scanning the save directory now is the only way the
    // user gets their library back after this, so do it before telling
    // them anything, and report how much came back.
    let adoptedCount = 0;
    try {
      const result = await reconcileOrphanedRecordings();
      adoptedCount = result.adopted.length;
    } catch (_) { /* best effort — the dialog below still tells the truth either way */ }
    dialog.showMessageBoxSync({
      type: 'warning',
      title: 'MOB Recorder database was reset',
      message: 'Your recording library could not be opened and has been reset to start fresh.' +
        (adoptedCount ? ` ${adoptedCount} existing recording${adoptedCount === 1 ? '' : 's'} found on disk ${adoptedCount === 1 ? 'was' : 'were'} re-added automatically.` : ''),
      detail: recovery.quarantinePath
        ? `The damaged file was kept here, in case it can be recovered:\n${recovery.quarantinePath}\n\nDetails: ${recovery.error}`
        : `The damaged file could not even be backed up. Details: ${recovery.error}`,
      buttons: ['Continue'],
    });
  }

  // #75: automatic rolling backup, at most once per 24h so normal repeated
  // launches during a work session don't spam the backups/ directory. The
  // manual "Back up now" button (Output settings) bypasses this cooldown.
  try {
    const backups = db.listBackups().filter(b => b.name.includes('-auto-'));
    const lastAutoMs = backups.length ? new Date(backups[0].createdAt).getTime() : 0;
    if (Date.now() - lastAutoMs > 24 * 60 * 60 * 1000) {
      db.backupNow('auto');
      db.pruneBackups(10);
    }
  } catch (err) { logger.warn('automatic backup failed: ' + err.message); }

  dbHandlers.register();
  // Manual "scan for missing recordings" (Output → Library in the UI) —
  // the same reconciliation, usable any time a recording is known to exist
  // on disk but is missing from the library (e.g. after the shutdown gap
  // task #21 fixed, or restoring a save folder from a backup).
  ipcMain.handle('library:reconcile', async () => {
    const result = await reconcileOrphanedRecordings();
    return { scanned: result.scanned, adoptedCount: result.adopted.length };
  });

  // #75: no way to get data out, back it up, or move it to a new machine.
  // mob.db holds everything that isn't the video file itself, and it's a
  // single sql.js file with no second copy — this is both the backup
  // format and the migration path.
  ipcMain.handle('library:exportAll', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const res = await dialog.showSaveDialog(win, {
      title: 'Export entire library',
      defaultPath: `mob-library-export-${new Date().toISOString().slice(0, 10)}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (res.canceled || !res.filePath) return { ok: false };
    require('fs').writeFileSync(res.filePath, JSON.stringify(portability.exportAll(), null, 2), 'utf8');
    return { ok: true, path: res.filePath };
  });

  ipcMain.handle('library:exportRecording', (_e, { recordingId }) => {
    const rec = db.get('SELECT path FROM recordings WHERE id = ?', [recordingId]);
    if (!rec) throw new Error('Recording not found: ' + recordingId);
    const bundle = portability.exportRecording(recordingId);
    const outPath = rec.path
      ? rec.path.slice(0, rec.path.length - path.extname(rec.path).length) + '.mob-export.json'
      : path.join(app.getPath('userData'), recordingId + '.mob-export.json');
    require('fs').writeFileSync(outPath, JSON.stringify(bundle, null, 2), 'utf8');
    return { ok: true, path: outPath };
  });

  ipcMain.handle('library:importBundle', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const res = await dialog.showOpenDialog(win, {
      title: 'Import MOB export',
      filters: [{ name: 'JSON', extensions: ['json'] }],
      properties: ['openFile'],
    });
    if (res.canceled || !res.filePaths.length) return { ok: false };
    let bundle;
    try {
      bundle = JSON.parse(require('fs').readFileSync(res.filePaths[0], 'utf8'));
    } catch (err) {
      throw new Error('Could not read that file as a MOB export: ' + err.message);
    }
    const result = portability.importBundle(bundle);
    await db.flush();
    return { ok: true, ...result };
  });

  // Manual backup, plus the automatic one below (app start, at most once/24h).
  ipcMain.handle('db:backupNow', () => {
    const p = db.backupNow('manual');
    db.pruneBackups(10);
    return p ? { ok: true, path: p } : { ok: false };
  });
  ipcMain.handle('db:listBackups', () => db.listBackups());
  ipcMain.handle('app:getUserDataPath', () => app.getPath('userData'));

  transcriptionHandlers.register(sendControl);
  editHandlers.register(sendControl);
  productionHandlers.register();
  voiceHandlers.register(sendControl, { startRecording, stopRecording, togglePause, setMic, dropMarker, getRecordingState: () => rec.state });
  syncHandlers.register(sendControl);

  // #69: app.getVersion() was never called anywhere — no build a bug report
  // could name. Shown in the UI (Hotkeys card) via this query.
  ipcMain.handle('app:getVersion', () => app.getVersion());

  // Relays the recorder window's own log() lines (previously written only
  // into a hidden DOM element in a window the user never sees) into the
  // same persisted log as everything else.
  ipcMain.on('log:recorder', (_e, line) => { logger.info('[recorder] ' + line); });

  // "Copy diagnostics" (task #69, item 4): turns a future "it isn't
  // working" into something answerable in one message instead of a whole
  // debugging session. Never includes the Cloudflare token itself — same
  // redaction cf:getConfig already uses.
  ipcMain.handle('diagnostics:bundle', async () => {
    const os = require('os');
    const s = settings.get();
    let encoders = [];
    try { encoders = [...(await ffmpeg.availableEncoders())]; } catch (_) { /* best effort */ }
    const lines = [
      'MOB Recorder diagnostics',
      '  App version: ' + app.getVersion(),
      '  Electron: ' + process.versions.electron + '  Chrome: ' + process.versions.chrome + '  Node: ' + process.versions.node,
      '  Platform: ' + process.platform + ' ' + process.arch + ' (' + os.release() + ')',
      '  Recording state: ' + rec.state,
      '  Available hardware/software encoders: ' + (encoders.join(', ') || 'none detected'),
      '  Settings (token redacted): ' + JSON.stringify({
        ...s,
        cloudflare: { workerUrl: s.cloudflare.workerUrl, apiToken: s.cloudflare.apiToken ? '[set]' : null },
      }),
      '',
      '--- last log lines (' + (logger.getLogPath() || 'no log file') + ') ---',
      logger.tail(200),
    ];
    return lines.join('\n');
  });

  sweepOldRaw();
  const s = settings.get();
  rec.micEnabled = s.mic.enabled;

  control = windows.createControlWindow();
  // Restore saved window position (clamped to available screen area)
  const ws = s.window;
  if (ws && ws.x != null && ws.y != null) {
    const displays = screen.getAllDisplays();
    const onScreen = displays.some(d => {
      const wa = d.workArea;
      return ws.x >= wa.x && ws.x < wa.x + wa.width && ws.y >= wa.y && ws.y < wa.y + wa.height;
    });
    if (onScreen) {
      control.setBounds({
        x: ws.x, y: ws.y,
        width:  Math.max(380, ws.width  || 412),
        height: Math.max(480, ws.height || 680),
      });
    }
  }

  bubble = windows.createBubbleWindow(s);
  // recorder is created lazily by ensureRecorder() on the first take.

  bubble.on('moved', persistBubblePosition);
  bubble.on('move', pushOverlay);
  bubble.on('resize', pushOverlay);
  bubble.on('close', (e) => { if (!app.__quitting) { e.preventDefault(); bubble.hide(); settings.set({ bubble: { visible: false } }); } });

  control.on('moved', persistControlPosition);
  control.on('resized', persistControlPosition);
  // Don't set __quitting here — that flag is before-quit's own guard against
  // re-entering itself after it has already started closing the DB. Setting
  // it in advance made before-quit's `if (app.__quitting) return` fire
  // immediately, skipping db.close() entirely on the most common quit path
  // (closing the control window). app.quit() below triggers before-quit on
  // its own, which sets the flag, closes the DB, then calls app.quit() again
  // — that second call is what this handler's old early flag was meant to
  // allow through, and before-quit already does that itself.
  control.on('closed', () => { app.quit(); });
  registerShortcuts();

  if (process.env.MOB_SHOT) {
    require('./shot').install({
      settings, setCompact,
      getWindows: () => ({ control, bubble })
    });
  }

  if (process.env.MOB_SMOKE) {
    require('./smoke').install({
      bus, settings, startRecording, stopRecording, setTestHookAttacher, dropMarker,
      getWindows: () => ({ control, bubble })
    });
  }

  // #67: auto-update was wired up but could never actually fire — dist/
  // release never publishes a latest.yml feed, the release tag format
  // doesn't match what electron-updater's GitHub provider expects, and the
  // only Windows build target (portable) can't be updated by electron-
  // updater at all even if a feed existed. Rather than leave a "Restart to
  // update" banner wired to a check that always 404s (silently, since the
  // old code caught and dropped it), the whole chain — this block, the
  // banner, app:restart, electron-updater itself — has been removed.
  // Revisit if the release pipeline in task #67 is ever built out for real
  // (nsis target actually enabled, feed published, tag format aligned).

  // Ticker for the elapsed-time display.
  setInterval(() => { if (rec.state === 'recording' || rec.state === 'paused') publishState(); }, 500);
}).catch(err => {
  // Fatal startup error — show a human-readable dialog before quitting so the
  // user isn't left with a silent crash and no window.
  dialog.showErrorBox('MOB Recorder failed to start', String(err));
  app.quit();
});

app.on('second-instance', () => { if (control) { control.show(); control.focus(); } });
app.on('before-quit', (e) => {
  if (app.__quitting) return;
  e.preventDefault();
  app.__quitting = true;
  globalShortcut.unregisterAll();
  // A live take's raw stream used to be abandoned mid-write on quit. end()
  // flushes and closes the file handle so the raw recording is at least
  // intact on disk, even though this exit skips transcoding/indexing it.
  // ffmpeg.killAll() stops any in-flight encode too — previously an
  // untracked ffmpeg process kept running after quit with no job object
  // (on Windows) to clean it up, still writing to its output file.
  ffmpeg.killAll();
  const endRaw = rec.raw ? rec.raw.end().catch(() => {}) : Promise.resolve();
  endRaw.then(() => db.close()).catch(() => {}).finally(() => app.quit());
});
app.on('window-all-closed', () => app.quit());
