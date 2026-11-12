'use strict';
// IPC handler for Cloudflare sync (S8).
// Fix #21: distribution row creation (and UUID generation) lives in main process,
// not the renderer — keeps identity generation server-side and auditable.

const { ipcMain } = require('electron');
const crypto = require('crypto');
const db = require('../db/sqlite');
const settings = require('../settings');
const { getDeviceId } = require('../identity');
const { syncDistribution } = require('../cloudflare/sync');

function register(sendControl) {
  // Read CF config (workerUrl only — never send apiToken to renderer)
  ipcMain.handle('cf:getConfig', () => {
    const cf = settings.get().cloudflare || {};
    return {
      workerUrl:   cf.workerUrl  || process.env.CLOUDFLARE_WORKER_URL  || null,
      configured:  !!(cf.workerUrl || process.env.CLOUDFLARE_WORKER_URL),
      tokenStored: !!(cf.apiToken  || process.env.CLOUDFLARE_API_TOKEN),
    };
  });

  // Save CF config from renderer settings UI (token stored in settings.json)
  ipcMain.handle('cf:setConfig', (_e, { workerUrl, apiToken }) => {
    const patch = {};
    if (typeof workerUrl === 'string') {
      const trimmed = workerUrl.trim();
      if (trimmed) {
        let parsed;
        try { parsed = new URL(trimmed); } catch (_) { throw new Error('Worker URL is not a valid URL'); }
        if (parsed.protocol !== 'https:') throw new Error('Worker URL must use https://');
      }
      patch.workerUrl = trimmed || null;
    }
    // Only touch apiToken when a non-empty value was actually sent. The
    // renderer clears its token field after every successful save, so a
    // later save that only edits the worker URL used to resend an empty
    // string here and silently wipe the previously stored token.
    if (typeof apiToken === 'string' && apiToken.trim()) {
      patch.apiToken = apiToken.trim();
    }
    settings.set({ cloudflare: patch });
    return { ok: true };
  });

  // Create a distribution row and return its ID to the renderer.
  ipcMain.handle('sync:prepare', (_e, { recordingId, packageId }) => {
    if (!recordingId || !packageId) throw new Error('recordingId and packageId required');
    // Without this, a stale or mistyped ID silently created a distribution
    // row pointing at nothing, which then sat 'pending' forever.
    if (!db.get('SELECT id FROM recordings WHERE id = ?', [recordingId])) {
      throw new Error('Recording not found: ' + recordingId);
    }
    if (!db.get('SELECT id FROM production_packages WHERE id = ?', [packageId])) {
      throw new Error('Production package not found: ' + packageId);
    }
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
