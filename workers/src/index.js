'use strict';
// MOB Recorder — Cloudflare Worker
//
// Endpoints (all require Authorization: Bearer <device-scoped JWT — see
// auth.js, ADR-003>, except /upload which carries its own HMAC signature):
//   POST /presign   { key, mimeType, deviceId }
//     → { presignedUrl }   (time-limited HMAC-signed URL to this Worker)
//     deviceId must match the token's own sub claim — see checkDeviceAuth.
//
//   PUT  /upload/<r2Key>?sig=<hmac>&exp=<ts>
//     → { ok, r2Key, etag, bytes }
//     (no Bearer needed — URL carries its own HMAC signature)
//
//   POST /queue     { distributionId, recordingId, r2Key, packageId, platform, deviceId }
//     → { ok, distributionId }
//     deviceId must match the token's own sub claim.
//
//   GET  /status/:id
//     → { status, r2Key, bytesUploaded, … }
//     Only the device that created this job (the deviceId stored on its
//     own DO, from /queue's /init call) can read its status — a token for
//     a different device gets 403, not another device's job metadata.

import { verifyDeviceToken } from './auth.js';

export { DistributionCoordinator } from './coordinator.js';

export default {
  async fetch(request, env, ctx) {
    const url    = new URL(request.url);
    const method = request.method;

    if (method === 'OPTIONS') return cors(new Response(null, { status: 204 }));

    try {
      // ── Upload (no Bearer — HMAC in query string) ────────────────────────
      if (method === 'PUT' && url.pathname.startsWith('/upload/')) {
        const r2Key = decodeURIComponent(url.pathname.slice('/upload/'.length));
        return handleUpload(request, env, url, r2Key);
      }

      // ── All other endpoints require a device-scoped JWT ──────────────────
      const auth = await checkDeviceAuth(request, env);
      if (auth instanceof Response) return cors(auth);

      if (method === 'POST' && url.pathname === '/presign')   return cors(await handlePresign(request, env, url, auth));
      if (method === 'POST' && url.pathname === '/queue')     return cors(await handleQueue(request, env, auth));
      if (method === 'GET'  && url.pathname.startsWith('/status/')) {
        const id = url.pathname.slice('/status/'.length);
        return cors(await handleStatus(env, id, auth));
      }

      return cors(json({ error: 'not found' }, 404));
    } catch (err) {
      return cors(json({ error: err.message }, 500));
    }
  },
};

// ── /presign ──────────────────────────────────────────────────────────────────
async function handlePresign(request, env, url, auth) {
  const { key, mimeType = 'video/mp4', deviceId } = await request.json();
  if (!key) return json({ error: 'key required' }, 400);
  // ADR-003: deviceId used to be accepted from the body and forwarded with
  // no check at all (the top comment even documented it as a field without
  // this file ever reading it). Now it must match the verified token.
  if (deviceId && deviceId !== auth.deviceId) return json({ error: 'deviceId does not match token' }, 403);

  const ttl = Number(env.UPLOAD_TOKEN_TTL_SECONDS || 3600);
  const exp = Date.now() + ttl * 1000;
  const sig = await hmacSign(`${key}:${exp}`, env.UPLOAD_SIGNING_SECRET);

  const uploadUrl = new URL(url.origin);
  uploadUrl.pathname = '/upload/' + encodeURIComponent(key);
  uploadUrl.searchParams.set('sig', sig);
  uploadUrl.searchParams.set('exp', String(exp));

  return json({ presignedUrl: uploadUrl.toString(), r2Key: key, expiresAt: new Date(exp).toISOString() });
}

// ── /upload/:r2Key ────────────────────────────────────────────────────────────
async function handleUpload(request, env, url, r2Key) {
  const sig = url.searchParams.get('sig');
  const exp = url.searchParams.get('exp');
  if (!sig || !exp) return cors(json({ error: 'missing sig/exp' }, 400));

  if (Date.now() > Number(exp)) return cors(json({ error: 'upload token expired' }, 410));

  const valid = await hmacVerify(`${r2Key}:${exp}`, sig, env.UPLOAD_SIGNING_SECRET);
  if (!valid) return cors(json({ error: 'invalid upload token' }, 403));

  const object = await env.MOB_BUCKET.put(r2Key, request.body, {
    httpMetadata: { contentType: request.headers.get('Content-Type') || 'video/mp4' },
  });

  return cors(json({ ok: true, r2Key, etag: object.etag, bytes: object.size }));
}

// ── /queue ────────────────────────────────────────────────────────────────────
async function handleQueue(request, env, auth) {
  const job = await request.json();
  const { distributionId, recordingId, r2Key, packageId, platform = 'cloud', deviceId } = job;

  if (!distributionId || !recordingId || !r2Key) {
    return json({ error: 'distributionId, recordingId, r2Key required' }, 400);
  }
  if (deviceId && deviceId !== auth.deviceId) return json({ error: 'deviceId does not match token' }, 403);

  const id   = env.COORDINATOR.idFromName(distributionId);
  const stub = env.COORDINATOR.get(id);

  // Init is idempotent — safe to retry; a resumed DO returns its current
  // status. The DO stores the VERIFIED deviceId (auth.deviceId), not
  // whatever the body claimed — handleStatus's own device check below is
  // only as good as what actually got stored here.
  await stub.fetch(new Request('https://do/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ distributionId, recordingId, r2Key, packageId, platform, deviceId: auth.deviceId }),
  }));

  // Advance to 'queued'; await so failures surface to the caller.
  await stub.fetch(new Request('https://do/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'queued' }),
  }));

  return json({ ok: true, distributionId });
}

// ── /status/:id ───────────────────────────────────────────────────────────────
async function handleStatus(env, distributionId, auth) {
  if (!distributionId) return json({ error: 'id required' }, 400);
  const id   = env.COORDINATOR.idFromName(distributionId);
  const stub = env.COORDINATOR.get(id);
  const res  = await stub.fetch(new Request('https://do/state'));
  const body = await res.json();
  // ADR-003: this used to return any distributionId's full metadata
  // (recordingId, r2Key, platform, …) to anyone holding the one shared
  // Bearer secret, regardless of which device created it. deviceId is
  // absent (unknown status, per coordinator.js's #handleState default)
  // only for a distributionId nothing has ever /queue'd — that's a 404,
  // not an authorization decision this device gets to make.
  if (body.deviceId == null) return json(body, res.status);
  if (body.deviceId !== auth.deviceId) return json({ error: 'not found' }, 404);
  return json(body, res.status);
}

// ── auth ──────────────────────────────────────────────────────────────────────
// Task #61 / ADR-003: was a static CLOUDFLARE_API_TOKEN Bearer compare with
// no structure and no per-device scoping at all. Returns { deviceId } on
// success, or a Response to return directly on failure (so fetch()'s
// caller can tell the two apart with `instanceof Response`, since a valid
// auth result and an error response are both plain objects otherwise).
async function checkDeviceAuth(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) return json({ error: 'unauthorized' }, 401);
  if (!env.JWT_SIGNING_SECRET) return json({ error: 'worker not configured (missing JWT_SIGNING_SECRET secret)' }, 503);
  try {
    return await verifyDeviceToken(match[1], env.JWT_SIGNING_SECRET);
  } catch (err) {
    return json({ error: 'unauthorized: ' + err.message }, 401);
  }
}

// ── HMAC helpers (Web Crypto) ─────────────────────────────────────────────────
async function hmacSign(message, secret) {
  if (!secret) throw new Error('UPLOAD_SIGNING_SECRET not set');
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  // URL-safe base64
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function hmacVerify(message, token, secret) {
  const expected = await hmacSign(message, secret);
  return timingSafeEqual(expected, token);
}

// Constant-time string comparison (avoids timing attacks on HMAC tokens)
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ── utilities ─────────────────────────────────────────────────────────────────
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function cors(response) {
  const h = new Headers(response.headers);
  h.set('Access-Control-Allow-Origin',  '*');
  h.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  return new Response(response.body, { status: response.status, headers: h });
}
