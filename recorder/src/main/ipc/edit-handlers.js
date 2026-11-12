'use strict';
// IPC handlers for the edit layer: apply EDL cuts, create clips.

const { ipcMain } = require('electron');
const path = require('path');
const crypto = require('crypto');
const { app } = require('electron');
const db = require('../db/sqlite');
const { applyCuts, remapTimestamp, loadEdl } = require('../edl');
const { clipKey } = require('../r2/key');

function register() {
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
}

module.exports = { register };
