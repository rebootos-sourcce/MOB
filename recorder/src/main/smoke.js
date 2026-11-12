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
  const { bus, settings, startRecording, stopRecording, getWindows, setTestHookAttacher, dropMarker } = api;
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
    const captureMode = process.env.MOB_SMOKE_CAPTURE_MODE || 'screenCam';
    // Task #77: a fixed, small region near the display's origin — safe
    // regardless of the Xvfb virtual display's actual resolution, and lets
    // resolveSource()'s existing "no source configured yet -> pick the
    // primary display" fallback pick the screen, same as every other mode
    // here — no need to replicate listSources()' display-matching logic
    // just for this smoke path.
    settings.set({
      recording: Object.assign(
        { saveDir: outDir, fps: Number(process.env.MOB_SMOKE_FPS || 30),
          maxHeight: Number(process.env.MOB_SMOKE_H || 720), countdown: Number(process.env.MOB_SMOKE_COUNTDOWN || 0), format: process.env.MOB_SMOKE_FORMAT || 'mp4', codec: process.env.MOB_SMOKE_CODEC || 'h264', quality: 'balanced', askWhereToSave: false,
          // Task #62/#77: lets this same smoke harness exercise camOnly/
          // audioOnly/region.
          captureMode },
        // A fixed, small region near the display's origin — safe regardless
        // of the Xvfb virtual display's actual resolution, and lets
        // resolveSource()'s existing "no source configured yet -> pick the
        // primary display" fallback pick the screen, same as every other
        // mode here — no need to replicate listSources()' display-matching
        // logic just for this smoke path. Only included in the patch when
        // actually testing region mode — settings.set()'s merge writes
        // whatever key is present, undefined included, so an omitted key is
        // not the same as an explicit `region: undefined`.
        captureMode === 'region' ? { region: { x: 20, y: 20, width: 320, height: 240 } } : {}
      ),
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
      // Task #56: exercise marker drop during a real take — dropMarker()
      // requires state 'recording'/'paused', so this is the one window
      // where that's actually true.
      if (dropMarker) {
        const chapterResult = dropMarker('chapter');
        const retakeResult = dropMarker('retake');
        log('dropped markers', JSON.stringify({ chapterResult, retakeResult }));
      }
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

      // 1b. Task #56: the chapter + retake markers dropped mid-take above
      // should have survived finalize() and landed on this recording_id.
      if (dropMarker) {
        const markerRows = db.all('SELECT type, at_ms FROM markers WHERE recording_id = ? ORDER BY at_ms', [rid]);
        log('pipeline: markers persisted =', JSON.stringify(markerRows));
        if (markerRows.length !== 2 || !markerRows.some(m => m.type === 'chapter') || !markerRows.some(m => m.type === 'retake')) {
          return fail('full pipeline: expected 1 chapter + 1 retake marker on recording ' + rid + ', got ' + JSON.stringify(markerRows));
        }
      }

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

      const pkgRow = db.get('SELECT id, chapters_json FROM production_packages WHERE id = ?', [packageId]);
      if (!pkgRow) return fail('full pipeline: production_packages row missing after assemblePackage()');

      // 3b. Task #56: the chapter marker dropped mid-take should have won
      // over detectChapters()'s word-density guess — no EDL cuts were
      // applied in this run, so the marker's at_ms should pass through
      // production.js's remap step unchanged and appear verbatim.
      if (dropMarker) {
        const chapterMarker = db.get("SELECT at_ms FROM markers WHERE recording_id = ? AND type = 'chapter'", [rid]);
        const chapters = JSON.parse(pkgRow.chapters_json || '[]');
        log('pipeline: chapters_json =', JSON.stringify(chapters));
        if (!chapters.some(c => c.start_ms === chapterMarker.at_ms)) {
          return fail('full pipeline: chapter marker at ' + chapterMarker.at_ms + 'ms did not appear in chapters_json: ' + JSON.stringify(chapters));
        }
        // markers:retakeCuts logic (db-handlers.js) shouldn't throw on a real
        // transcript, whether or not the suggestion ends up non-null for
        // this particular (very short) take.
        const retakeMarker = db.get("SELECT at_ms FROM markers WHERE recording_id = ? AND type = 'retake'", [rid]);
        const segs = db.all("SELECT * FROM segments WHERE transcript_id = ? AND type = 'speech' ORDER BY start_ms", [transcriptId]);
        const before = segs.filter(s => s.end_ms <= retakeMarker.at_ms);
        const seg = segs.find(s => s.start_ms <= retakeMarker.at_ms && retakeMarker.at_ms <= s.end_ms) || before[before.length - 1] || null;
        log('pipeline: retake marker at', retakeMarker.at_ms, 'ms — preceding segment:', JSON.stringify(seg));
      }

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
