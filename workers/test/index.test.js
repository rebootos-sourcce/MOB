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

// Stands in for R2Bucket's own put()/get() shape closely enough to drive
// handleUpload/handleDownload for real, not a stub of their behavior.
class FakeBucket {
  constructor() { this.objects = new Map(); }
  async put(key, body, opts = {}) {
    const buf = await new Response(body).arrayBuffer();
    const contentType = (opts.httpMetadata && opts.httpMetadata.contentType) || 'application/octet-stream';
    const etag = 'fake-etag-' + key;
    this.objects.set(key, { buf, contentType, etag });
    return { etag, size: buf.byteLength };
  }
  async get(key) {
    const obj = this.objects.get(key);
    if (!obj) return null;
    return {
      body: new Response(obj.buf).body,
      httpEtag: obj.etag,
      writeHttpMetadata(headers) { headers.set('content-type', obj.contentType); },
    };
  }
}

function makeEnv() {
  const instances = new Map();
  return {
    JWT_SIGNING_SECRET: SECRET,
    UPLOAD_SIGNING_SECRET: 'upload-secret',
    UPLOAD_TOKEN_TTL_SECONDS: '3600',
    MOB_BUCKET: new FakeBucket(),
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

// ── Task #48: shareable link (/presign-download + /download) ───────────────

test('shareable link: upload a real object, then presign-download and fetch it back — full round trip', async () => {
  const env = makeEnv();

  // Upload for real, through handleUpload, not by poking FakeBucket directly.
  const presignRes = await authedRequest(env, '/presign', { method: 'POST', body: { key: 'rec-share.mp4' } });
  const { presignedUrl } = await presignRes.json();
  const uploadRes = await worker.fetch(new Request(presignedUrl, {
    method: 'PUT', headers: { 'Content-Type': 'video/mp4' }, body: 'fake-video-bytes',
  }), env, {});
  assert.equal(uploadRes.status, 200);

  // Now get a shareable download link for the same key.
  const shareRes = await authedRequest(env, '/presign-download', { method: 'POST', body: { key: 'rec-share.mp4' } });
  assert.equal(shareRes.status, 200);
  const { downloadUrl } = await shareRes.json();
  assert.ok(downloadUrl.includes('/download/rec-share.mp4'));

  // The link itself needs no Bearer token — it's handed to someone else.
  const downloadRes = await worker.fetch(new Request(downloadUrl), env, {});
  assert.equal(downloadRes.status, 200);
  assert.equal(await downloadRes.text(), 'fake-video-bytes');
  assert.equal(downloadRes.headers.get('content-type'), 'video/mp4');
});

test('shareable link: a tampered (but not yet expired) exp fails signature verification', async () => {
  const env = makeEnv();
  await env.MOB_BUCKET.put('rec-x.mp4', 'bytes');
  const shareRes = await authedRequest(env, '/presign-download', { method: 'POST', body: { key: 'rec-x.mp4' } });
  const { downloadUrl } = await shareRes.json();
  const tampered = new URL(downloadUrl);
  // Extend the link's own life by rewriting exp — still in the future, so
  // this only passes if the handler fails to catch that the signature was
  // computed for a DIFFERENT exp.
  const originalExp = Number(tampered.searchParams.get('exp'));
  tampered.searchParams.set('exp', String(originalExp + 999999));
  const res = await worker.fetch(new Request(tampered.toString()), env, {});
  assert.equal(res.status, 403);
});

test('shareable link: a correctly-signed but already-expired link is rejected with 410, not 403', async () => {
  const env = makeEnv();
  env.SHARE_LINK_TTL_SECONDS = '-1'; // already expired the instant it's signed
  await env.MOB_BUCKET.put('rec-z.mp4', 'bytes');
  const shareRes = await authedRequest(env, '/presign-download', { method: 'POST', body: { key: 'rec-z.mp4' } });
  const { downloadUrl } = await shareRes.json();
  const res = await worker.fetch(new Request(downloadUrl), env, {});
  assert.equal(res.status, 410);
});

test('shareable link: a tampered key in the URL is rejected (signature covers the key, not just exp)', async () => {
  const env = makeEnv();
  await env.MOB_BUCKET.put('rec-real.mp4', 'real-bytes');
  await env.MOB_BUCKET.put('rec-other.mp4', 'other-bytes');
  const shareRes = await authedRequest(env, '/presign-download', { method: 'POST', body: { key: 'rec-real.mp4' } });
  const { downloadUrl } = await shareRes.json();
  const tampered = downloadUrl.replace('rec-real.mp4', 'rec-other.mp4');
  const res = await worker.fetch(new Request(tampered), env, {});
  assert.equal(res.status, 403);
});

test('shareable link: an upload token cannot be reused as a download token for the same key/exp', async () => {
  const env = makeEnv();
  await env.MOB_BUCKET.put('rec-y.mp4', 'bytes');
  const presignRes = await authedRequest(env, '/presign', { method: 'POST', body: { key: 'rec-y.mp4' } });
  const { presignedUrl } = await presignRes.json();
  // presignedUrl is an /upload/... URL; splice its sig/exp onto a /download/... path.
  const uploadUrl = new URL(presignedUrl);
  const forgedDownload = new URL(uploadUrl.origin + '/download/' + encodeURIComponent('rec-y.mp4'));
  forgedDownload.searchParams.set('sig', uploadUrl.searchParams.get('sig'));
  forgedDownload.searchParams.set('exp', uploadUrl.searchParams.get('exp'));
  const res = await worker.fetch(new Request(forgedDownload.toString()), env, {});
  assert.equal(res.status, 403);
});

test('shareable link: downloading a key that was never uploaded is a 404, not a crash', async () => {
  const env = makeEnv();
  const shareRes = await authedRequest(env, '/presign-download', { method: 'POST', body: { key: 'never-uploaded.mp4' } });
  const { downloadUrl } = await shareRes.json();
  const res = await worker.fetch(new Request(downloadUrl), env, {});
  assert.equal(res.status, 404);
});
