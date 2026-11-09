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
    } catch (_) { /* fall through to generate */ }
  }

  _deviceId = crypto.randomUUID();
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, JSON.stringify({ id: _deviceId, created_at: new Date().toISOString() }));
  return _deviceId;
}

module.exports = { getDeviceId };
