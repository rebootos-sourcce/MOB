'use strict';
const { ipcMain } = require('electron');
const voice = require('../voice');

function register(sendControl, callbacks) {
  ipcMain.handle('voice:init',    async () => { await voice.init(sendControl, callbacks); return { enabled: voice.isEnabled() }; });
  ipcMain.handle('voice:stop',    () => { voice.stop(); return { ok: true }; });
  ipcMain.handle('voice:state',   () => ({ state: voice.getState(), enabled: voice.isEnabled() }));
  // Audio frames from renderer's AudioWorklet/MediaStreamSource
  ipcMain.handle('voice:frame',   (_e, frame) => voice.processAudio(new Int16Array(frame)));
  // Task #55: the renderer tells us which mode-scoped grammar applies (see
  // voice.js's own top comment) and whether a transcription is in flight
  // (S7's command-queueing acceptance criterion).
  ipcMain.handle('voice:setTab',          (_e, tab) => { voice.setTab(tab); return { ok: true }; });
  ipcMain.handle('voice:setTranscribing', (_e, flag) => { voice.setTranscribing(flag); return { ok: true }; });
}

module.exports = { register };
