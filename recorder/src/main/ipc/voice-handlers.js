'use strict';
const { ipcMain } = require('electron');
const voice = require('../voice');

function register(sendControl, callbacks) {
  ipcMain.handle('voice:init',    async () => { await voice.init(sendControl, callbacks); return { enabled: voice.isEnabled() }; });
  ipcMain.handle('voice:stop',    () => { voice.stop(); return { ok: true }; });
  ipcMain.handle('voice:state',   () => ({ state: voice.getState(), enabled: voice.isEnabled() }));
  // Audio frames from renderer's AudioWorklet/MediaStreamSource
  ipcMain.handle('voice:frame',   (_e, frame) => voice.processAudio(new Int16Array(frame)));
}

module.exports = { register };
