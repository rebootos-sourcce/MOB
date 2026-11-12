'use strict';
const { contextBridge, ipcRenderer } = require('electron');

// Channels the renderer is allowed to listen on. Keeps the bridge narrow.
const LISTEN = new Set([
  'settings:changed',
  'recorder:arm', 'recorder:go', 'recorder:perfOn', 'recorder:stop', 'recorder:pause', 'recorder:resume',
  'recorder:setMic', 'recorder:updateOverlay',
  'recording:state', 'finalize:progress', 'finalize:done', 'finalize:error', 'recording:thumbReady',
  'bubble:resizing', 'bubble:menuBlocked', 'ui:compact', 'ui:countdown',
  'transcription:progress',
  'edit:renderProgress',
  'voice:listening', 'voice:editorCommand',
  'sync:progress',
  'recorder:micLevel',
  'hotkeys:conflicts'
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
// Fix #1: named query/mutation API — renderer cannot send raw SQL.
contextBridge.exposeInMainWorld('mob', {
  db: {
    query:    (name, params)   => ipcRenderer.invoke('db:query', name, params),
    mutate:   (name, payload)  => ipcRenderer.invoke('db:mutate', name, payload),
    deviceId: ()               => ipcRenderer.invoke('db:deviceId'),
  }
});
