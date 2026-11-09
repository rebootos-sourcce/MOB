'use strict';
// IPC handlers for the edit layer: apply EDL cuts, create clips.

const { ipcMain } = require('electron');
const path = require('path');
const crypto = require('crypto');
const { app } = require('electron');
const db = require('../db/sqlite');
const { applyCuts, remapTimestamp, loadEdl } = require('../edl');
const { recordingKey } = require('../r2/key');

function register() {
  // Apply a set of timeline cuts to a recording; returns updated EDL entries.
  ipcMain.handle('edit:applyCuts', (_e, { recordingId, totalDurationMs, cuts }) => {
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
  ipcMain.handle('edit:createClip', async (_e, { recordingId, sourcePath, startMs, endMs, label, type }) => {
    const ffmpeg = require('../ffmpeg');
    const id      = crypto.randomUUID();
    const ext     = path.extname(sourcePath) || '.mp4';
    const clipDir = path.join(app.getPath('userData'), 'clips');
    require('fs').mkdirSync(clipDir, { recursive: true });
    const clipPath = path.join(clipDir, `clip-${id}${ext}`);

    await ffmpeg.extractSegment(sourcePath, clipPath, startMs, endMs);

    const r2Key = `clip-${id}${ext}`;
    db.run(
      `INSERT INTO clips (id, recording_id, type, label, start_ms, end_ms, path, r2_key, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, recordingId, type || 'clip', label || '', startMs, endMs, clipPath, r2Key]
    );

    return { id, path: clipPath, r2Key };
  });
}

module.exports = { register };
