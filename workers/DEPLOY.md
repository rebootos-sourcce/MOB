# Cloudflare Worker — Deploy Guide

One-time setup. Takes ~5 minutes.

## Prerequisites

- [Node.js 18+](https://nodejs.org)
- A Cloudflare account (free tier works)
- `wrangler` CLI (installed in this repo as a dev dependency)

```
cd workers
npm install
```

## 1. Authenticate

```
npx wrangler login
```

Your browser opens. Approve access. Close the tab when done.

## 2. Create the R2 bucket

```
npx wrangler r2 bucket create mob-recordings
```

No ID to copy — the binding name `MOB_BUCKET` in `wrangler.toml` already maps to it.

## 3. Set secrets

Secrets are never stored in `wrangler.toml`. Set them once:

```
npx wrangler secret put JWT_SIGNING_SECRET
# Paste any long random string, e.g.:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# This is the SAME value the desktop app's Output → Cloud "API Token"
# field holds — the app signs a device-scoped JWT with it (ADR-003,
# recorder/src/main/cloudflare/deviceAuth.js) and the Worker verifies that
# JWT with the same secret (workers/src/auth.js). It is still one shared
# secret, not a per-device one — see auth.js's own top comment for exactly
# what that does and doesn't protect against.

npx wrangler secret put UPLOAD_SIGNING_SECRET
# Paste a DIFFERENT long random string (same generation command works) —
# this one signs the time-limited R2 upload URLs and must not be the same
# value as JWT_SIGNING_SECRET.
```

## 4. Deploy

```
npx wrangler deploy
```

Output includes your worker URL, e.g.:
```
https://mob-recorder.<your-subdomain>.workers.dev
```

## 5. Test

The Worker now verifies a signed JWT, not a raw Bearer token, so testing
with curl needs an actual signed token rather than pasting the secret
directly:

```bash
export WORKER_URL="https://mob-recorder.<your-subdomain>.workers.dev"
export SECRET="<the JWT_SIGNING_SECRET you set above>"

# Run from the workers/ directory — signs a short-lived test token with
# the same function auth.js verifies with.
TOKEN=$(node --input-type=module -e "
import { signDeviceToken } from './src/auth.js';
console.log(await signDeviceToken('test-device', process.env.SECRET));
")

# Should return a presigned upload URL
curl -s -X POST "$WORKER_URL/presign" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"test-rec-001.mp4","mimeType":"video/mp4","deviceId":"test-device"}' | jq .
```

Expected response:
```json
{
  "presignedUrl": "https://mob-recorder.*.workers.dev/upload/test-rec-001.mp4?sig=...&exp=...",
  "r2Key": "test-rec-001.mp4",
  "expiresAt": "2025-..."
}
```

## 6. Configure the desktop app

Open MOB Recorder → Output → Cloud. Enter:
- **Worker URL**: the URL from step 4
- **API Token**: the `JWT_SIGNING_SECRET` value from step 3 — the app
  signs its own device JWT with this value on every request; it is never
  sent as-is.

Or set environment variables before launching:
```
CLOUDFLARE_WORKER_URL=https://... CLOUDFLARE_API_TOKEN=... npm start
```

## Redeploy after code changes

```
cd workers
npx wrangler deploy
```

## Local dev

```
npx wrangler dev
# Worker runs at http://localhost:8787
```

Point the desktop app at `http://localhost:8787` to test without deploying.
