'use strict';
/**
 * Headless self-test (npm run smoke). Only loaded when MOB_SMOKE=1.
 *
 * Starts a real recording of the first available screen (camera and mic may
 * be absent, which the recorder tolerates), stops after a few seconds,
 * finalizes to MP4 and exits 0 on success. Renderer console output is
 * mirrored to stdout so errors in the UI windows are visible in CI logs.
 *
 * Full pipeline (MOB_SMOKE_FULL=1): also runs transcription, assembles a
 * production package, and verifies DB row integrity.
 */
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function install(api) {
  const { bus, settings, startRecording, stopRecording, getWindows, setTestHookAttacher } = api;
  const outDir = process.env.MOB_SMOKE_DIR || path.join(app.getPath('temp'), 'mob-recorder-smoke');
  fs.mkdirSync(outDir, { recursive: true });
  const log = (...a) => console.log('[smoke]', ...a);
  const fail = (msg) => { console.error('[smoke] FAIL:', msg); app.exit(1); };
  const deadline = setTimeout(() => fail('timed out after 60s'), 60000);

  const wins = getWindows();
  const hook = (w, name) => {
    w.webContents.on('console-message', (_e, level, message, line, sourceId) => {
      console.log(`[${name}:${level}] ${message} (${path.basename(sourceId || '')}:${line})`);
    });
    w.webContents.on('did-fail-load', (_e, code, desc) => fail(`${name} failed to load: ${code} ${desc}`));
    w.webContents.on('render-process-gone', (_e, d) => fail(`${name} renderer gone: ${d.reason}`));
    if (process.env.MOB_BENCH && name === 'recorder') {
      w.webContents.once('did-finish-load', () => w.webContents.send('recorder:perfOn'));
    }
  };
  for (const [name, w] of Object.entries(wins)) hook(w, name);
  if (setTestHookAttacher) setTestHookAttacher(hook);

  let loaded = 0;
  const onLoaded = async () => {
    if (++loaded < Object.keys(wins).length) return;
    log('all windows loaded');
    settings.set({
      recording: { saveDir: outDir, fps: Number(process.env.MOB_SMOKE_FPS || 30),
        maxHeight: Number(process.env.MOB_SMOKE_H || 720), countdown: Number(process.env.MOB_SMOKE_COUNTDOWN || 0), format: process.env.MOB_SMOKE_FORMAT || 'mp4', codec: process.env.MOB_SMOKE_CODEC || 'h264', quality: 'balanced', askWhereToSave: false },
      bubble: { visible: true, border: true, shape: process.env.MOB_SMOKE_SHAPE || 'circle' }
    });
    setTimeout(() => { log('starting recording'); startRecording(); }, 1500);
  };
  for (const w of Object.values(wins)) w.webContents.once('did-finish-load', onLoaded);

  let stopped = false;
  const seen = [];
  bus.on('state', (st) => {
    if (seen[seen.length - 1] !== st.state) { seen.push(st.state); log('state ->', st.state); }
    if (st.state === 'recording' && !stopped) {
      stopped = true;
      log('recording started', JSON.stringify(st.canvas || {}));
      setTimeout(() => { log('stopping'); stopRecording(); }, 4000);
    }
    if (st.state === 'idle' && st.message) fail(st.message);
  });
  bus.on('perf', (st) => log('PERF', JSON.stringify(st)));
  let stopAt = 0;
  bus.on('state', (st) => { if (st.state === 'finalizing' && !stopAt) stopAt = Date.now(); });
  bus.on('finalized', async ({ path: p, durationMs, recordingId }) => {
    clearTimeout(deadline);
    const size = fs.statSync(p).size;
    log(`finalized ${p} (${size} bytes, ${durationMs} ms)`);
    if (stopAt) log('FINALIZE_MS', Date.now() - stopAt, '| recorded_ms', durationMs,
      '| ratio', ((Date.now() - stopAt) / durationMs).toFixed(3) + 'x realtime');
    if (size < 10000) return fail('output suspiciously small');
    log('state sequence:', seen.join(' -> '));
    const i = (x) => seen.indexOf(x);
    if (i('countdown') >= 0 && i('arming') >= 0 && i('arming') > i('countdown')) {
      return fail('devices armed AFTER countdown — first words would be lost');
    }

    if (!process.env.MOB_SMOKE_FULL) return app.exit(0);

    // ── Full pipeline test ───────────────────────────────────────────────────
    log('MOB_SMOKE_FULL: starting full pipeline test');
    try {
      const db = require('./db/sqlite');
      const { transcribe } = require('./transcription');
      const { assemblePackage } = require('./production');

      // 1. Verify recordings row exists
      const rid = recordingId || db.get(
        "SELECT id FROM recordings ORDER BY created_at DESC LIMIT 1"
      )?.id;
      if (!rid) return fail('full pipeline: no recordings row found');
      log('pipeline: recordingId =', rid);

      // 2. Transcription
      log('pipeline: transcribing…');
      const { transcriptId, words: wordCount } = await transcribe({
        recordingId: rid, filePath: p,
        onProgress: ({ stage, pct }) => log(`pipeline: ${stage} ${pct}%`),
      });
      log(`pipeline: transcript ${transcriptId} — ${wordCount} words`);

      const txRow = db.get('SELECT id FROM transcripts WHERE id = ?', [transcriptId]);
      if (!txRow) return fail('full pipeline: transcripts row missing after transcribe()');

      const dbWords = db.get('SELECT COUNT(*) AS n FROM words WHERE transcript_id = ?', [transcriptId]);
      log(`pipeline: words in DB = ${dbWords?.n}`);
      // A short 4-second recording may produce zero words — that's fine; just check the row exists.

      // 3. Production package assembly
      log('pipeline: assembling production package…');
      const { packageId } = await assemblePackage({ recordingId: rid });
      log('pipeline: packageId =', packageId);

      const pkgRow = db.get('SELECT id FROM production_packages WHERE id = ?', [packageId]);
      if (!pkgRow) return fail('full pipeline: production_packages row missing after assemblePackage()');

      // 4. FK integrity: package must reference a valid recording
      const pkgRec = db.get(
        'SELECT p.id FROM production_packages p JOIN recordings r ON p.recording_id = r.id WHERE p.id = ?',
        [packageId]
      );
      if (!pkgRec) return fail('full pipeline: FK violation — production_packages.recording_id references missing recording');

      log('pipeline: all checks passed ✓');
      app.exit(0);
    } catch (err) {
      fail('full pipeline: ' + err.message);
    }
    // ── End full pipeline test ───────────────────────────────────────────────
  });
  bus.on('finalize-error', (e) => fail('finalize: ' + e.message));
}

module.exports = { install };
