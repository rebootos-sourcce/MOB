'use strict';
// Stable device identity (ADR-003).
// UUID v4 generated once, persisted to userData/device.json.

const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const crypto = require('crypto');

let _deviceId = null;

function getDeviceId() {
  if (_deviceId) return _deviceId;

  const p = path.join(app.getPath('userData'), 'device.json');

  if (fs.existsSync(p)) {
    try {
      const { id } = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (id && typeof id === 'string' && id.length === 36) {
        _deviceId = id;
        return _deviceId;
      }
      throw new Error('device.json has no valid id');
    } catch (err) {
      // Minting a replacement here orphans every existing row's device_id —
      // recordings, production_packages and distributions all still carry
      // the old one, and it's unrecoverable once overwritten. Back the bad
      // file up and say so loudly instead of silently swallowing it (the
      // non-atomic write below used to make a crash during first-run write
      // enough to trigger this).
      try { fs.copyFileSync(p, p + '.corrupt-' + Date.now()); } catch (_) {}
      console.error('[mob] device.json was unreadable or invalid — generating a new device ID; the old file was backed up alongside it. Error:', err.message);
    }
  }

  _deviceId = crypto.randomUUID();
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = p + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify({ id: _deviceId, created_at: new Date().toISOString() }));
  fs.renameSync(tmp, p);
  return _deviceId;
}

module.exports = { getDeviceId };
