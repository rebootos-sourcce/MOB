'use strict';
const { contextBridge, ipcRenderer } = require('electron');

// Channels the renderer is allowed to listen on. Keeps the bridge narrow.
const LISTEN = new Set([
  'settings:changed',
  'recorder:arm', 'recorder:go', 'recorder:perfOn', 'recorder:stop', 'recorder:pause', 'recorder:resume',
  'recorder:setMic', 'recorder:updateOverlay',
  'recording:state', 'finalize:progress', 'finalize:done', 'finalize:error',
  'bubble:resizing', 'bubble:menuBlocked', 'ui:compact', 'ui:countdown'
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

// MOB database bridge (ADR-001: local-first SQLite)
contextBridge.exposeInMainWorld('mob', {
  db: {
    run:      (sql, params)  => ipcRenderer.invoke('db:run', sql, params),
    get:      (sql, params)  => ipcRenderer.invoke('db:get', sql, params),
    all:      (sql, params)  => ipcRenderer.invoke('db:all', sql, params),
    exec:     (sql)          => ipcRenderer.invoke('db:exec', sql),
    deviceId: ()             => ipcRenderer.invoke('db:deviceId'),
  }
});
