'use strict';
const { contextBridge, ipcRenderer } = require('electron');

// Channels the renderer is allowed to listen on. Keeps the bridge narrow.
const LISTEN = new Set([
  'settings:changed',
  'recorder:start', 'recorder:stop', 'recorder:pause', 'recorder:resume',
  'recorder:setMic', 'recorder:updateOverlay',
  'recording:state', 'finalize:progress', 'finalize:done', 'finalize:error',
  'bubble:resizing', 'ui:compact', 'ui:countdown'
]);

contextBridge.exposeInMainWorld('api', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  on: (channel, fn) => {
    if (!LISTEN.has(channel)) throw new Error('Not allowed to listen on ' + channel);
    const wrapped = (_e, ...args) => fn(...args);
    ipcRenderer.on(channel, wrapped);
    return () => ipcRenderer.removeListener(channel, wrapped);
  },
  platform: process.platform
});
