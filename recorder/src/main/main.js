'use strict';
const path = require('path');
const { app, BrowserWindow, ipcMain, desktopCapturer, screen, dialog, shell, globalShortcut, Menu, systemPreferences } = require('electron');
const settings = require('./settings');
const ffmpeg = require('./ffmpeg');
const { RawRecording, sweepOldRaw } = require('./recording-files');
const windows = require('./windows');
const Shapes = require('../shared/shapes');
const EventEmitter = require('events');

/** Internal event bus (used by the headless smoke test). */
const bus = new EventEmitter();

// Test harnesses get a throwaway profile so runs never inherit stale settings.
if (process.env.MOB_SHOT || process.env.MOB_SMOKE) {
  app.setPath('userData', require('path').join(app.getPath('temp'), 'mob-recorder-testprofile-' + process.pid));
}

if (!app.requestSingleInstanceLock()) app.quit();
app.setAppUserModelId('com.mob.recorder');

let control = null;
let bubble = null;
let recorder = null;

/** Recording state machine: idle -> countdown -> recording <-> paused -> finalizing -> idle */
const rec = {
  state: 'idle',
  raw: null,
  startedAt: 0,
  pausedTotal: 0,
  pausedAt: 0,
  micEnabled: true,
  message: '',
  warnings: []
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

function publishState(extra) {
  const s = settings.get();
  const payload = Object.assign({
    state: rec.state,
    micEnabled: rec.micEnabled,
    elapsedMs: elapsedMs(),
    message: rec.message,
    warnings: rec.warnings,
    bubbleVisible: s.bubble.visible
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
  let source;
  try {
    source = await resolveSource();
  } catch (err) {
    rec.message = err.message;
    publishState();
    return;
  }

  rec.state = 'arming';
  rec.message = '';
  rec.warnings = [];
  publishState();

  rec.raw = new RawRecording();
  rec.micEnabled = s.mic.enabled;
  rec.pausedTotal = 0;
  rec.pausedAt = 0;

  // Phase 1. Opening the camera, screen and mic can take up to a couple of
  // seconds on Windows. This has to complete BEFORE the countdown, otherwise
  // the countdown hits zero, the user starts talking, and the encoder is not
  // running yet.
  sendRecorder('recorder:arm', {
    sourceId: source.id,
    sourceKind: source.kind,
    displayBounds: displayBoundsFor(source),
    overlay: overlayPayload(),
    cameraDeviceId: s.camera.deviceId,
    micDeviceId: s.mic.deviceId,
    micEnabled: rec.micEnabled,
    fps: s.recording.fps,
    maxHeight: s.recording.maxHeight
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
    if (rec.raw) { rec.raw.end(); rec.raw = null; }
    publishState();
    return;
  }
  if (rec.state !== 'recording' && rec.state !== 'paused') return;
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

async function finalizeRecording(durationMs) {
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

  try {
    const result = await raw.finalize(outputPath, {
      format,
      codec: s.recording.codec,
      quality: s.recording.quality,
      fps: s.recording.fps,
      durationMs
    }, (p) => sendControl('finalize:progress', p));
    rec.state = 'idle';
    rec.startedAt = 0;
    setCompact(false);
    publishState();
    sendControl('finalize:done', { path: result.output, durationMs, format });
    bus.emit('finalized', { path: result.output, durationMs });
  } catch (err) {
    // Hardware encoder missing/failing? Retry once with libx264.
    if (format === 'mp4' && s.recording.codec !== 'h264') {
      try {
        const retryRaw = raw; // raw file still exists because finalize failed before unlink
        const result = await ffmpeg.finalize(retryRaw.path, outputPath, {
          format, codec: 'h264', quality: s.recording.quality, fps: s.recording.fps, durationMs
        }, (p) => sendControl('finalize:progress', p));
        try { require('fs').unlinkSync(retryRaw.path); } catch (_) { /* ignore */ }
        rec.state = 'idle';
        rec.startedAt = 0;
        setCompact(false);
        publishState({ message: `Encoder "${s.recording.codec}" failed, saved with H.264 instead.` });
        sendControl('finalize:done', { path: result.output, durationMs, format, note: `Encoder "${s.recording.codec}" failed, saved with H.264 instead.` });
        bus.emit('finalized', { path: result.output, durationMs });
        return;
      } catch (err2) {
        err = err2;
      }
    }
    rec.state = 'idle';
    rec.startedAt = 0;
    setCompact(false);
    rec.message = 'Saving failed: ' + err.message + `\nRaw recording kept at: ${raw.path}`;
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

ipcMain.handle('settings:get', () => settings.get());
ipcMain.handle('settings:set', (_e, patch) => settings.set(patch));
ipcMain.handle('state:get', () => ({
  state: rec.state, micEnabled: rec.micEnabled, elapsedMs: elapsedMs(), message: rec.message,
  bubbleVisible: settings.get().bubble.visible
}));
ipcMain.handle('sources:list', () => listSources());
ipcMain.handle('codecs:list', () => ffmpeg.codecOptions());
ipcMain.handle('shapes:list', () => ({ order: Shapes.ORDER, labels: Object.fromEntries(Shapes.ORDER.map((k) => [k, Shapes.SHAPES[k].label])), sizes: Shapes.SIZES }));
ipcMain.handle('recording:start', () => startRecording());
ipcMain.handle('recording:stop', () => stopRecording());
ipcMain.handle('recording:togglePause', () => togglePause());
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

// From the hidden recorder window
ipcMain.on('recorder:chunk', (_e, chunk) => { if (rec.raw) rec.raw.append(chunk); });
ipcMain.on('recorder:state', (_e, msg) => {
  if (msg.warnings) rec.warnings = msg.warnings;
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
    setCompact(false);
    publishState();
  }
});
ipcMain.on('recorder:done', (_e, msg) => finalizeRecording(msg.durationMs));

// ---------------------------------------------------------------- lifecycle

settings.onChange((all, patch) => {
  broadcast('settings:changed', all);
  applyBubbleSettings(patch);
});

function registerShortcuts() {
  const bind = (acc, fn) => { if (!globalShortcut.register(acc, fn)) console.warn('shortcut taken:', acc); };
  bind('CommandOrControl+Shift+R', () => (rec.state === 'idle' ? startRecording() : stopRecording()));
  bind('CommandOrControl+Shift+P', togglePause);
  bind('CommandOrControl+Shift+M', () => setMic(!rec.micEnabled));
  bind('CommandOrControl+Shift+H', toggleBubble);
}

app.whenReady().then(() => {
  sweepOldRaw();
  const s = settings.get();
  rec.micEnabled = s.mic.enabled;

  control = windows.createControlWindow();
  bubble = windows.createBubbleWindow(s);
  recorder = windows.createRecorderWindow();

  bubble.on('moved', persistBubblePosition);
  bubble.on('move', pushOverlay);
  bubble.on('resize', pushOverlay);
  bubble.on('close', (e) => { if (!app.__quitting) { e.preventDefault(); bubble.hide(); settings.set({ bubble: { visible: false } }); } });

  control.on('closed', () => { app.__quitting = true; app.quit(); });
  registerShortcuts();

  if (process.env.MOB_SHOT) {
    require('./shot').install({
      settings, setCompact,
      getWindows: () => ({ control, bubble, recorder })
    });
  }

  if (process.env.MOB_SMOKE) {
    require('./smoke').install({
      bus, settings, startRecording, stopRecording,
      getWindows: () => ({ control, bubble, recorder })
    });
  }

  // Ticker for the elapsed-time display.
  setInterval(() => { if (rec.state === 'recording' || rec.state === 'paused') publishState(); }, 500);
});

app.on('second-instance', () => { if (control) { control.show(); control.focus(); } });
app.on('before-quit', () => { app.__quitting = true; globalShortcut.unregisterAll(); });
app.on('window-all-closed', () => app.quit());
