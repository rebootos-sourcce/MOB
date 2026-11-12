'use strict';
// IPC handlers for the edit layer: apply EDL cuts, create clips.

const { ipcMain } = require('electron');
const path = require('path');
const crypto = require('crypto');
const { app } = require('electron');
const db = require('../db/sqlite');
const { applyCuts, remapTimestamp, loadEdl, canUndo, undoLastCut } = require('../edl');
const { clipKey, recordingKey } = require('../r2/key');
const { getDeviceId } = require('../identity');

function register(sendControl) {
  // Apply a set of timeline cuts to a recording; returns updated EDL entries.
  ipcMain.handle('edit:applyCuts', (_e, { recordingId, totalDurationMs, cuts }) => {
    // These values flow straight into cut math with no validation before
    // this. recordings.duration_ms is nullable, and totalDurationMs was
    // being passed through unchecked — a null/NaN duration produced NaN
    // output_end_ms rows in edl_entries, which later became an unplayable
    // "NaN:NaN:NaN,NaN" exported caption file.
    if (!recordingId || !db.get('SELECT id FROM recordings WHERE id = ?', [recordingId])) {
      throw new Error('Recording not found: ' + recordingId);
    }
    if (!Number.isFinite(totalDurationMs) || totalDurationMs <= 0) {
      throw new Error('totalDurationMs must be a positive number');
    }
    if (!Array.isArray(cuts) || !cuts.every(c =>
      c && Number.isFinite(c.start_ms) && Number.isFinite(c.end_ms) &&
      c.start_ms >= 0 && c.end_ms > c.start_ms && c.end_ms <= totalDurationMs
    )) {
      throw new Error('cuts must be an array of { start_ms, end_ms } within [0, totalDurationMs]');
    }
    const entries = applyCuts(recordingId, totalDurationMs, cuts);
    return { ok: true, entries };
  });

  // Load the current EDL for a recording.
  ipcMain.handle('edit:loadEdl', (_e, { recordingId }) => {
    return loadEdl(recordingId);
  });

  // Undo the most recent applyCuts() for a recording. Repeated calls walk
  // back through the full history to the original uncut state — there was
  // no way to reverse a cut at all before this.
  ipcMain.handle('edit:undo', (_e, { recordingId }) => {
    const entries = undoLastCut(recordingId);
    return { ok: true, entries };
  });
  ipcMain.handle('edit:canUndo', (_e, { recordingId }) => ({ canUndo: canUndo(recordingId) }));

  // Remap a source timestamp through the loaded EDL.
  ipcMain.handle('edit:remapTimestamp', (_e, { recordingId, sourceMs }) => {
    const entries = loadEdl(recordingId);
    return remapTimestamp(entries, sourceMs);
  });

  // Create a clip: ffmpeg-extract [start_ms, end_ms] from source, write clips row.
  // Fix #18: ignore renderer-supplied sourcePath — look up the path from the DB
  // to prevent path traversal via a compromised renderer process.
  ipcMain.handle('edit:createClip', async (_e, { recordingId, startMs, endMs, label, type }) => {
    const rec = db.get('SELECT path, codec FROM recordings WHERE id = ?', [recordingId]);
    if (!rec || !rec.path) throw new Error('Recording not found: ' + recordingId);
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs < 0 || endMs <= startMs) {
      throw new Error('startMs/endMs must be a valid, non-empty, non-negative range');
    }

    const ffmpeg = require('../ffmpeg');
    const id      = crypto.randomUUID();
    const ext     = path.extname(rec.path).replace(/^\./, '') || 'mp4';
    const clipDir = path.join(app.getPath('userData'), 'clips');
    require('fs').mkdirSync(clipDir, { recursive: true });
    const r2Key    = clipKey(id, ext);
    const clipPath = path.join(clipDir, r2Key);

    await ffmpeg.extractSegment(rec.path, clipPath, startMs, endMs);

    db.run(
      `INSERT INTO clips (id, recording_id, type, label, start_ms, end_ms, path, r2_key, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, recordingId, type || 'clip', label || '', startMs, endMs, clipPath, r2Key]
    );

    return { id, path: clipPath, r2Key };
  });

  // Render the recording's EDL cuts to an actual output file. Until this
  // existed, applyCuts only ever wrote edl_entries rows — "Remove fillers"
  // reported success and the video on disk never changed. The result is
  // registered as a NEW sibling recording (not an overwrite), so the
  // original is preserved and the edit can be redone differently.
  ipcMain.handle('edit:renderOutput', async (event, { recordingId }) => {
    const rec = db.get('SELECT path, title FROM recordings WHERE id = ?', [recordingId]);
    if (!rec || !rec.path) throw new Error('Recording not found: ' + recordingId);

    const entries = loadEdl(recordingId);
    if (!entries.length) throw new Error('No edits to render — apply cuts first');

    const ffmpeg = require('../ffmpeg');
    const ext = (path.extname(rec.path).replace(/^\./, '') || 'mp4');
    const format = ext === 'webm' ? 'webm' : 'mp4';
    const base = rec.path.slice(0, rec.path.length - path.extname(rec.path).length);
    const outputPath = `${base}-edited.${format}`;

    const segments = entries.map(e => ({ source_start_ms: e.source_start_ms, source_end_ms: e.source_end_ms }));
    await ffmpeg.renderEdl(rec.path, outputPath, segments, (frac) => {
      if (sendControl) sendControl('edit:renderProgress', { recordingId, pct: Math.round(frac * 100) });
    });

    const newId = crypto.randomUUID();
    const outputDurationMs = entries[entries.length - 1].output_end_ms;
    db.run(
      `INSERT INTO recordings (id, device_id, path, duration_ms, codec, status, r2_key, title, created_at)
       VALUES (?, ?, ?, ?, 'h264', 'ready', ?, ?, datetime('now'))`,
      [newId, getDeviceId(), outputPath, outputDurationMs, recordingKey(newId, format), (rec.title || path.basename(rec.path)) + ' (edited)']
    );
    await db.flush();

    return { ok: true, recordingId: newId, path: outputPath };
  });

  // #50: one-click "Studio Sound" (TDD:1313-1317) — ffmpeg.js had no audio
  // filter chain at all before this. Registered as a NEW sibling recording,
  // same pattern as edit:renderOutput, so the original audio is never lost.
  ipcMain.handle('edit:studioSound', async (event, { recordingId }) => {
    const rec = db.get('SELECT path, title, duration_ms FROM recordings WHERE id = ?', [recordingId]);
    if (!rec || !rec.path) throw new Error('Recording not found: ' + recordingId);

    const ffmpeg = require('../ffmpeg');
    const ext = (path.extname(rec.path).replace(/^\./, '') || 'mp4');
    const format = ext === 'webm' ? 'webm' : 'mp4';
    const base = rec.path.slice(0, rec.path.length - path.extname(rec.path).length);
    const outputPath = `${base}-studio.${format}`;

    const result = await ffmpeg.applyStudioSound(rec.path, outputPath, (elapsedMs) => {
      if (sendControl && rec.duration_ms) {
        sendControl('edit:renderProgress', { recordingId, pct: Math.round(Math.min(1, elapsedMs / rec.duration_ms) * 100) });
      }
    });

    const newId = crypto.randomUUID();
    db.run(
      `INSERT INTO recordings (id, device_id, path, duration_ms, codec, status, r2_key, title, created_at)
       VALUES (?, ?, ?, ?, 'h264', 'ready', ?, ?, datetime('now'))`,
      [newId, getDeviceId(), outputPath, rec.duration_ms, recordingKey(newId, format), (rec.title || path.basename(rec.path)) + ' (studio sound)']
    );
    await db.flush();

    return { ok: true, recordingId: newId, path: outputPath, denoised: result.denoised };
  });
}

module.exports = { register };
