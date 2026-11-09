'use strict';
// IPC handler for Cloudflare sync (S8).
// Fix #21: distribution row creation (and UUID generation) lives in main process,
// not the renderer — keeps identity generation server-side and auditable.

const { ipcMain } = require('electron');
const crypto = require('crypto');
const db = require('../db/sqlite');
const { getDeviceId } = require('../identity');
const { syncDistribution } = require('../cloudflare/sync');

function register(sendControl) {
  // Create a distribution row and return its ID to the renderer.
  ipcMain.handle('sync:prepare', (_e, { recordingId, packageId }) => {
    if (!recordingId || !packageId) throw new Error('recordingId and packageId required');
    const id = crypto.randomUUID();
    const deviceId = getDeviceId();
    db.run(
      `INSERT INTO distributions (id, device_id, recording_id, package_id, platform, status, created_at)
       VALUES (?, ?, ?, ?, 'cloud', 'pending', datetime('now'))`,
      [id, deviceId, recordingId, packageId]
    );
    return { distributionId: id };
  });

  ipcMain.handle('sync:distribution', async (_e, { distributionId }) => {
    return syncDistribution(distributionId, (p) => {
      if (sendControl) sendControl('sync:progress', { distributionId, ...p });
    });
  });
}

module.exports = { register };
