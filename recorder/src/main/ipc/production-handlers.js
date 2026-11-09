'use strict';
const { ipcMain } = require('electron');
const { assemblePackage } = require('../production');

function register() {
  ipcMain.handle('production:assemble', async (_e, { recordingId, clipId }) => {
    return assemblePackage({ recordingId, clipId });
  });
}

module.exports = { register };
