'use strict';
// MOB Recorder — Cloudflare Worker
//
// Endpoints (all require Authorization: Bearer <CLOUDFLARE_API_TOKEN>):
//   POST /presign   { key, mimeType, deviceId }
//     → { presignedUrl }   (time-limited HMAC-signed URL to this Worker)
//
//   PUT  /upload/<r2Key>?sig=<hmac>&exp=<ts>
//     → { ok, r2Key, etag, bytes }
//     (no Bearer needed — URL carries its own HMAC signature)
//
//   POST /queue     { distributionId, recordingId, r2Key, packageId, platform, deviceId }
//     → { ok, distributionId }
//
//   GET  /status/:id
//     → { status, r2Key, bytesUploaded, … }

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

      // ── All other endpoints require Bearer auth ──────────────────────────
      const authErr = checkBearer(request, env);
      if (authErr) return cors(authErr);

      if (method === 'POST' && url.pathname === '/presign')   return cors(await handlePresign(request, env, url));
      if (method === 'POST' && url.pathname === '/queue')     return cors(await handleQueue(request, env));
      if (method === 'GET'  && url.pathname.startsWith('/status/')) {
        const id = url.pathname.slice('/status/'.length);
        return cors(await handleStatus(env, id));
      }

      return cors(json({ error: 'not found' }, 404));
    } catch (err) {
      return cors(json({ error: err.message }, 500));
    }
  },
};

// ── /presign ──────────────────────────────────────────────────────────────────
async function handlePresign(request, env, url) {
  const { key, mimeType = 'video/mp4', deviceId } = await request.json();
  if (!key) return json({ error: 'key required' }, 400);

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
async function handleQueue(request, env) {
  const job = await request.json();
  const { distributionId, recordingId, r2Key, packageId, platform = 'cloud', deviceId } = job;

  if (!distributionId || !recordingId || !r2Key) {
    return json({ error: 'distributionId, recordingId, r2Key required' }, 400);
  }

  // Create / resume DistributionCoordinator DO
  const id  = env.COORDINATOR.idFromName(distributionId);
  const stub = env.COORDINATOR.get(id);
  await stub.fetch(new Request('https://do/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ distributionId, recordingId, r2Key, packageId, platform, deviceId }),
  }));

  // Kick off post-upload processing (non-blocking — Worker will handle in DO)
  const doId = env.COORDINATOR.idFromName(distributionId);
  const doStub = env.COORDINATOR.get(doId);
  // Fire-and-forget: mark as queued
  const _ = doStub.fetch(new Request('https://do/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'queued' }),
  }));

  return json({ ok: true, distributionId });
}

// ── /status/:id ───────────────────────────────────────────────────────────────
async function handleStatus(env, distributionId) {
  if (!distributionId) return json({ error: 'id required' }, 400);
  const id   = env.COORDINATOR.idFromName(distributionId);
  const stub = env.COORDINATOR.get(id);
  const res  = await stub.fetch(new Request('https://do/state'));
  return new Response(res.body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── auth ──────────────────────────────────────────────────────────────────────
function checkBearer(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = env.CLOUDFLARE_API_TOKEN;
  if (!token) return json({ error: 'worker not configured (missing CLOUDFLARE_API_TOKEN secret)' }, 503);
  if (auth !== `Bearer ${token}`) return json({ error: 'unauthorized' }, 401);
  return null;
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
