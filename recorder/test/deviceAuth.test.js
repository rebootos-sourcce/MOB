'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

const { signDeviceToken } = require('../src/main/cloudflare/deviceAuth');

test('signDeviceToken: produces a 3-part JWT with the deviceId as sub', () => {
  const token = signDeviceToken('device-abc', 'secret');
  const parts = token.split('.');
  assert.equal(parts.length, 3);
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  assert.equal(payload.sub, 'device-abc');
  assert.ok(typeof payload.iat === 'number' && typeof payload.exp === 'number');
  assert.ok(payload.exp > payload.iat);
});

test('signDeviceToken: different secrets produce different signatures for the same claims', () => {
  const a = signDeviceToken('device-abc', 'secret-a', 3600);
  const b = signDeviceToken('device-abc', 'secret-b', 3600);
  assert.notEqual(a.split('.')[2], b.split('.')[2]);
});

test('signDeviceToken: requires deviceId and secret', () => {
  assert.throws(() => signDeviceToken('', 'secret'), /deviceId required/);
  assert.throws(() => signDeviceToken('device-abc', ''), /secret required/);
});
