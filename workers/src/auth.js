// Task #61 / ADR-003: device-scoped JWT auth.
//
// Not the `jose` library the spec names — this Worker has had zero npm
// dependencies since it was written (index.js's own upload-URL signing
// already does raw HMAC via Web Crypto, not a library), and a real
// `npm install jose` couldn't be run or verified in the sandbox this was
// built in (see #61's own task notes). The algorithm is the same either
// way: HS256 (base64url header + payload, HMAC-SHA256 signature). It's
// deliberately minimal — no header alg negotiation, no key rotation, no
// alternate algorithms — because a Worker with one symmetric secret has
// no use for any of that.
//
// Honest limit this does NOT fix, stated here because it's easy to miss:
// every device still shares the SAME signing secret (same as the old
// static Bearer compare it replaces). A device that holds the secret can
// still mint a token with any `sub` it wants — there is no per-device
// provisioning step yet. What this DOES fix, for real: the Worker used to
// read `deviceId` straight out of the request body with no check at all
// ("accepted and forwarded, not enforced" — ADR-003's own words). Now the
// body's deviceId must match the token's verified `sub`, and index.js's
// /status handler additionally checks it against the job's OWN stored
// deviceId before returning anything — so a caller can no longer read or
// act on a job it didn't create, even though it could still (with the
// secret) mint a token claiming to be any device. True cross-device
// isolation needs a per-device secret registry, which is real, separate,
// future work (a registration/enrollment flow this task doesn't build).

function base64url(bytes) {
  const str = typeof bytes === 'string' ? bytes : String.fromCharCode(...new Uint8Array(bytes));
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  return atob(padded);
}

async function hmacSha256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return base64url(sig);
}

// Constant-time string comparison (avoids timing attacks on the signature).
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Signs a device-scoped token: payload.sub === deviceId, with iat/exp.
 * The desktop app calls this (or an equivalent local implementation) using
 * the same JWT_SIGNING_SECRET the Worker verifies with.
 */
async function signDeviceToken(deviceId, secret, ttlSeconds = 3600) {
  if (!deviceId) throw new Error('deviceId required');
  if (!secret) throw new Error('secret required');
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(JSON.stringify({ sub: deviceId, iat: now, exp: now + ttlSeconds }));
  const signingInput = header + '.' + payload;
  const sig = await hmacSha256(signingInput, secret);
  return signingInput + '.' + sig;
}

/**
 * Verifies a device-scoped token. Returns { deviceId }. Throws on any
 * failure: malformed shape, bad signature, expired, or no `sub` claim.
 */
async function verifyDeviceToken(token, secret) {
  if (!token || typeof token !== 'string') throw new Error('token required');
  if (!secret) throw new Error('JWT_SIGNING_SECRET not configured');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('malformed token');
  const [headerB64, payloadB64, sig] = parts;

  const expectedSig = await hmacSha256(headerB64 + '.' + payloadB64, secret);
  if (!timingSafeEqual(expectedSig, sig)) throw new Error('invalid signature');

  let payload;
  try { payload = JSON.parse(base64urlDecode(payloadB64)); }
  catch (_) { throw new Error('malformed payload'); }

  if (!payload.sub) throw new Error('token missing sub (device id)');
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && now > payload.exp) throw new Error('token expired');

  return { deviceId: payload.sub };
}

export { signDeviceToken, verifyDeviceToken };
