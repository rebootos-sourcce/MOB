// Task #61: auth.js has no package.json test runner config of its own to
// fight — workers/ had zero tests before this file. Run with `npm test`
// (node --test) from the workers/ directory; package.json's "type":
// "module" is what lets this import auth.js's ES module syntax directly,
// same as index.js already uses.
import test from 'node:test';
import assert from 'node:assert/strict';
import { signDeviceToken, verifyDeviceToken } from '../src/auth.js';

const SECRET = 'test-signing-secret';

test('signDeviceToken + verifyDeviceToken: round-trips the device id', async () => {
  const token = await signDeviceToken('device-abc', SECRET);
  const { deviceId } = await verifyDeviceToken(token, SECRET);
  assert.equal(deviceId, 'device-abc');
});

test('verifyDeviceToken: rejects a token signed with a different secret', async () => {
  const token = await signDeviceToken('device-abc', SECRET);
  await assert.rejects(() => verifyDeviceToken(token, 'wrong-secret'), /invalid signature/);
});

test('verifyDeviceToken: rejects a tampered payload even with a valid-looking signature', async () => {
  const token = await signDeviceToken('device-abc', SECRET);
  const [header, , sig] = token.split('.');
  // Swap in a different device's payload, keeping the original signature —
  // this must fail, not silently authenticate as the tampered device.
  const forgedPayload = Buffer.from(JSON.stringify({ sub: 'device-victim', iat: 0, exp: 9999999999 })).toString('base64url');
  const forged = `${header}.${forgedPayload}.${sig}`;
  await assert.rejects(() => verifyDeviceToken(forged, SECRET), /invalid signature/);
});

test('verifyDeviceToken: rejects an expired token', async () => {
  const token = await signDeviceToken('device-abc', SECRET, -10); // already expired 10s ago
  await assert.rejects(() => verifyDeviceToken(token, SECRET), /expired/);
});

test('verifyDeviceToken: rejects malformed tokens', async () => {
  await assert.rejects(() => verifyDeviceToken('not-a-jwt', SECRET), /malformed token/);
  await assert.rejects(() => verifyDeviceToken('', SECRET), /token required/);
  await assert.rejects(() => verifyDeviceToken(null, SECRET), /token required/);
});

test('verifyDeviceToken: rejects a token with no sub claim', async () => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ iat: 0, exp: 9999999999 })).toString('base64url');
  const signingInput = header + '.' + payload;
  // Sign it correctly (so this test isolates the "missing sub" check from
  // the signature check above) using the same algorithm auth.js uses.
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sigBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
  const sig = Buffer.from(sigBytes).toString('base64url');
  await assert.rejects(() => verifyDeviceToken(signingInput + '.' + sig, SECRET), /missing sub/);
});

test('signDeviceToken: requires a secret and a deviceId', async () => {
  await assert.rejects(() => signDeviceToken('', SECRET), /deviceId required/);
  await assert.rejects(() => signDeviceToken('device-abc', ''), /secret required/);
});
