'use strict';
// IPC bridge for the transcription pipeline.
// renderer invokes 'transcription:start' → main runs Whisper → fires progress events.

const { ipcMain } = require('electron');
const { transcribe } = require('../transcription');

let _sendControl = null;
let _isRunning = false; // Fix #6: concurrency guard

function register(sendControl) {
  _sendControl = sendControl;

  ipcMain.handle('transcription:start', async (_e, { recordingId, force = false }) => {
    if (!recordingId) throw new Error('recordingId required');

    const db = require('../db/sqlite');
    const rec = db.get('SELECT path FROM recordings WHERE id = ?', [recordingId]);
    if (!rec || !rec.path) throw new Error('Recording not found: ' + recordingId);
    const filePath = rec.path;

    // Return existing transcript without re-running Whisper unless force=true
    if (!force) {
      const existing = db.get('SELECT id FROM transcripts WHERE recording_id = ? ORDER BY created_at DESC LIMIT 1', [recordingId]);
      if (existing) {
        const words = db.get('SELECT COUNT(*) as n FROM words WHERE transcript_id = ?', [existing.id]);
        const tags  = db.get('SELECT COUNT(*) as n FROM metadata_tags WHERE recording_id = ?', [recordingId]);
        return { transcriptId: existing.id, words: (words && words.n) || 0, tags: (tags && tags.n) || 0, cached: true };
      }
    }

    // Fix #6: prevent concurrent transcriptions that would corrupt DB
    if (_isRunning) throw new Error('Transcription already in progress');
    _isRunning = true;

    try {
      const result = await transcribe({
        recordingId,
        filePath,
        onProgress: (p) => {
          if (_sendControl) _sendControl('transcription:progress', { recordingId, ...p });
        }
      });
      return result;
    } finally {
      _isRunning = false;
    }
  });
}

module.exports = { register };
