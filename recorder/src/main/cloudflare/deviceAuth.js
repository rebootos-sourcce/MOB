'use strict';
// Task #61 / ADR-003: signs the device-scoped JWT the Worker's
// workers/src/auth.js verifies. Pure, dependency-free (Node's built-in
// crypto only) so it's usable from sync.js without pulling in Electron —
// and so its wire format can be checked against the Worker's own
// (Web Crypto-based) implementation in a cross-runtime test, not just
// round-tripped against itself. The two MUST agree on every byte of the
// signing input; see workers/test/interop.test.js.
//
// Still a SHARED secret, not a per-device one — see workers/src/auth.js's
// own top comment for exactly what this does and doesn't protect against.

const crypto = require('crypto');

function base64url(buf) {
  return buf.toString('base64url');
}

/**
 * @param {string} deviceId
 * @param {string} secret        this app's existing cloudflare.apiToken
 * @param {number} [ttlSeconds]
 * @returns {string} a signed HS256 JWT: header.payload.signature
 */
function signDeviceToken(deviceId, secret, ttlSeconds = 3600) {
  if (!deviceId) throw new Error('deviceId required');
  if (!secret) throw new Error('secret required');
  const header = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(Buffer.from(JSON.stringify({ sub: deviceId, iat: now, exp: now + ttlSeconds })));
  const signingInput = header + '.' + payload;
  const sig = base64url(crypto.createHmac('sha256', secret).update(signingInput).digest());
  return signingInput + '.' + sig;
}

module.exports = { signDeviceToken };
