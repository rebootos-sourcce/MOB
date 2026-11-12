// Task #61: index.js's device-scoped auth, tested against a REAL
// DistributionCoordinator (the actual class from coordinator.js, not a
// mock of it) backed by an in-memory Map standing in for Durable Object
// storage — so these tests exercise the real /init → /progress → /state
// transitions the Worker's own fetch() handler drives, not a stand-in for
// them.
import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { DistributionCoordinator } from '../src/index.js';
import { signDeviceToken } from '../src/auth.js';

const SECRET = 'test-jwt-secret';

class FakeStorage {
  constructor() { this.map = new Map(); }
  async get(key) { return this.map.get(key); }
  async put(key, value) { this.map.set(key, value); }
}

function makeEnv() {
  const instances = new Map();
  return {
    JWT_SIGNING_SECRET: SECRET,
    UPLOAD_SIGNING_SECRET: 'upload-secret',
    UPLOAD_TOKEN_TTL_SECONDS: '3600',
    COORDINATOR: {
      idFromName(name) { return name; },
      get(id) {
        if (!instances.has(id)) instances.set(id, new DistributionCoordinator({ storage: new FakeStorage() }, {}));
        const coordinator = instances.get(id);
        return { fetch: (req) => coordinator.fetch(req) };
      },
    },
  };
}

async function authedRequest(env, path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token !== null) headers.Authorization = 'Bearer ' + (token ?? await signDeviceToken('device-a', SECRET));
  const req = new Request('https://worker.test' + path, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  return worker.fetch(req, env, {});
}

test('checkDeviceAuth: no Authorization header -> 401', async () => {
  const env = makeEnv();
  const res = await authedRequest(env, '/presign', { method: 'POST', body: { key: 'x' }, token: null });
  assert.equal(res.status, 401);
});

test('checkDeviceAuth: valid token -> /presign succeeds', async () => {
  const env = makeEnv();
  const res = await authedRequest(env, '/presign', { method: 'POST', body: { key: 'rec-1.mp4' } });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.presignedUrl.includes('/upload/rec-1.mp4'));
});

test('/presign: a deviceId in the body that disagrees with the token is rejected', async () => {
  const env = makeEnv();
  const res = await authedRequest(env, '/presign', {
    method: 'POST', body: { key: 'rec-1.mp4', deviceId: 'device-b' }, // token below is signed for device-a
  });
  assert.equal(res.status, 403);
});

test('/queue + /status: a different device cannot read another device\'s job', async () => {
  const env = makeEnv();
  const tokenA = await signDeviceToken('device-a', SECRET);
  const tokenB = await signDeviceToken('device-b', SECRET);

  const queueRes = await authedRequest(env, '/queue', {
    method: 'POST', token: tokenA,
    body: { distributionId: 'dist-1', recordingId: 'rec-1', r2Key: 'rec-1.mp4', deviceId: 'device-a' },
  });
  assert.equal(queueRes.status, 200);

  const ownStatus = await authedRequest(env, '/status/dist-1', { token: tokenA });
  assert.equal(ownStatus.status, 200);
  const ownBody = await ownStatus.json();
  assert.equal(ownBody.status, 'queued');
  assert.equal(ownBody.recordingId, 'rec-1');

  const otherStatus = await authedRequest(env, '/status/dist-1', { token: tokenB });
  assert.equal(otherStatus.status, 404, 'device-b must not see device-a\'s job, not even that it exists');
});

test('/queue: a deviceId in the body that disagrees with the token is rejected, and the stored deviceId is the verified one, not the claimed one', async () => {
  const env = makeEnv();
  const tokenA = await signDeviceToken('device-a', SECRET);

  const rejected = await authedRequest(env, '/queue', {
    method: 'POST', token: tokenA,
    body: { distributionId: 'dist-2', recordingId: 'rec-2', r2Key: 'rec-2.mp4', deviceId: 'device-b' },
  });
  assert.equal(rejected.status, 403);

  // Same distributionId, now queued correctly as device-a (no spoofed deviceId this time).
  const ok = await authedRequest(env, '/queue', {
    method: 'POST', token: tokenA,
    body: { distributionId: 'dist-2', recordingId: 'rec-2', r2Key: 'rec-2.mp4', deviceId: 'device-a' },
  });
  assert.equal(ok.status, 200);

  const status = await authedRequest(env, '/status/dist-2', { token: tokenA });
  const body = await status.json();
  assert.equal(body.deviceId, 'device-a');
});

test('/status: an unknown distributionId is a plain 404-shaped response (coordinator.js\'s own "unknown" default), not treated as a device mismatch', async () => {
  const env = makeEnv();
  const token = await signDeviceToken('device-a', SECRET);
  const res = await authedRequest(env, '/status/never-queued', { token });
  assert.equal(res.status, 200); // coordinator.js's #handleState always 200s; "unknown" is in the body
  const body = await res.json();
  assert.equal(body.status, 'unknown');
});

test('checkDeviceAuth: an expired token is rejected', async () => {
  const env = makeEnv();
  const expired = await signDeviceToken('device-a', SECRET, -10);
  const res = await authedRequest(env, '/presign', { method: 'POST', body: { key: 'x' }, token: expired });
  assert.equal(res.status, 401);
});

test('checkDeviceAuth: missing JWT_SIGNING_SECRET fails closed, not open', async () => {
  const env = makeEnv();
  delete env.JWT_SIGNING_SECRET;
  const token = await signDeviceToken('device-a', SECRET);
  const res = await authedRequest(env, '/presign', { method: 'POST', body: { key: 'x' }, token });
  assert.equal(res.status, 503);
});
