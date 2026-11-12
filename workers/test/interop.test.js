// Task #61: the token this app's main process actually sends
// (recorder/src/main/cloudflare/deviceAuth.js — Node's built-in `crypto`,
// CommonJS, runs in Electron) must verify here using this Worker's own
// implementation (auth.js — Web Crypto, ESM, runs on Cloudflare). These
// are two independent implementations of the same HS256 JWT shape; a
// self-test (sign and verify with the same code) would never catch a
// byte-level encoding mismatch between them — only signing with one and
// verifying with the other does.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { verifyDeviceToken } from '../src/auth.js';

const require = createRequire(import.meta.url);
const { signDeviceToken } = require('../../recorder/src/main/cloudflare/deviceAuth.js');

test('interop: a token signed by the Electron app (Node crypto) verifies against the Worker (Web Crypto)', async () => {
  const token = signDeviceToken('device-interop', 'shared-secret-123');
  const { deviceId } = await verifyDeviceToken(token, 'shared-secret-123');
  assert.equal(deviceId, 'device-interop');
});

test('interop: the Worker still rejects an Electron-signed token under the wrong secret', async () => {
  const token = signDeviceToken('device-interop', 'shared-secret-123');
  await assert.rejects(() => verifyDeviceToken(token, 'a-different-secret'), /invalid signature/);
});
