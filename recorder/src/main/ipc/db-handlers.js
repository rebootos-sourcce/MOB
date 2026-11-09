'use strict';
// IPC bridge: renderer ↔ SQLite (ADR-001, ADR-003).
// Exposes db:run, db:get, db:all, db:exec to the renderer via contextBridge.
// All write operations automatically scope to the device's device_id.

const { ipcMain } = require('electron');
const db = require('../db/sqlite');
const { getDeviceId } = require('../identity');

function register() {
  ipcMain.handle('db:run', (_e, sql, params) => {
    db.run(sql, params || []);
    return { ok: true };
  });

  ipcMain.handle('db:get', (_e, sql, params) => {
    return db.get(sql, params || []);
  });

  ipcMain.handle('db:all', (_e, sql, params) => {
    return db.all(sql, params || []);
  });

  ipcMain.handle('db:exec', (_e, sql) => {
    db.exec(sql);
    return { ok: true };
  });

  ipcMain.handle('db:deviceId', () => getDeviceId());
}

module.exports = { register };
