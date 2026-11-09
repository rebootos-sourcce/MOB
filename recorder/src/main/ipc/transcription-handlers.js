'use strict';
// IPC bridge for the transcription pipeline.
// renderer invokes 'transcription:start' → main runs Whisper → fires progress events.

const { ipcMain } = require('electron');
const { transcribe } = require('../transcription');

let _sendControl = null;

function register(sendControl) {
  _sendControl = sendControl;

  ipcMain.handle('transcription:start', async (_e, { recordingId, filePath }) => {
    if (!recordingId || !filePath) throw new Error('recordingId and filePath required');

    const result = await transcribe({
      recordingId,
      filePath,
      onProgress: (p) => {
        if (_sendControl) _sendControl('transcription:progress', { recordingId, ...p });
      }
    });

    return result;
  });
}

module.exports = { register };
