'use strict';
/**
 * Headless self-test (npm run smoke). Only loaded when MOB_SMOKE=1.
 *
 * Starts a real recording of the first available screen (camera and mic may
 * be absent, which the recorder tolerates), stops after a few seconds,
 * finalizes to MP4 and exits 0 on success. Renderer console output is
 * mirrored to stdout so errors in the UI windows are visible in CI logs.
 */
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function install(api) {
  const { bus, settings, startRecording, stopRecording, getWindows } = api;
  const outDir = process.env.MOB_SMOKE_DIR || path.join(app.getPath('temp'), 'mob-recorder-smoke');
  fs.mkdirSync(outDir, { recursive: true });
  const log = (...a) => console.log('[smoke]', ...a);
  const fail = (msg) => { console.error('[smoke] FAIL:', msg); app.exit(1); };
  const deadline = setTimeout(() => fail('timed out after 60s'), 60000);

  const wins = getWindows();
  for (const [name, w] of Object.entries(wins)) {
    w.webContents.on('console-message', (_e, level, message, line, sourceId) => {
      console.log(`[${name}:${level}] ${message} (${path.basename(sourceId || '')}:${line})`);
    });
    w.webContents.on('did-fail-load', (_e, code, desc) => fail(`${name} failed to load: ${code} ${desc}`));
    w.webContents.on('render-process-gone', (_e, d) => fail(`${name} renderer gone: ${d.reason}`));
  }

  let loaded = 0;
  const onLoaded = async () => {
    if (++loaded < Object.keys(wins).length) return;
    log('all windows loaded');
    settings.set({
      recording: { saveDir: outDir, countdown: 0, format: 'mp4', codec: 'h264', quality: 'balanced', maxHeight: 720, askWhereToSave: false, fps: 30 },
      bubble: { visible: true, border: true, shape: process.env.MOB_SMOKE_SHAPE || 'circle' }
    });
    setTimeout(() => { log('starting recording'); startRecording(); }, 1500);
  };
  for (const w of Object.values(wins)) w.webContents.once('did-finish-load', onLoaded);

  let stopped = false;
  bus.on('state', (st) => {
    if (st.state === 'recording' && !stopped) {
      stopped = true;
      log('recording started', JSON.stringify(st.canvas || {}));
      setTimeout(() => { log('stopping'); stopRecording(); }, 4000);
    }
    if (st.state === 'idle' && st.message) fail(st.message);
  });
  bus.on('finalized', ({ path: p, durationMs }) => {
    clearTimeout(deadline);
    const size = fs.statSync(p).size;
    log(`finalized ${p} (${size} bytes, ${durationMs} ms)`);
    if (size < 10000) return fail('output suspiciously small');
    app.exit(0);
  });
  bus.on('finalize-error', (e) => fail('finalize: ' + e.message));
}

module.exports = { install };
