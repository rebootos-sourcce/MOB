'use strict';
// IPC handler for Cloudflare sync (S8).

const { ipcMain } = require('electron');
const { syncDistribution } = require('../cloudflare/sync');

function register(sendControl) {
  ipcMain.handle('sync:distribution', async (_e, { distributionId }) => {
    return syncDistribution(distributionId, (p) => {
      if (sendControl) sendControl('sync:progress', { distributionId, ...p });
    });
  });
}

module.exports = { register };
