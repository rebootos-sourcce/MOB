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

## 2. Create the KV namespace

```
npx wrangler kv namespace create "MOB_KV"
npx wrangler kv namespace create "MOB_KV" --preview
```

Each command prints an `id`. Copy both and paste them into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding     = "MOB_KV"
id          = "PASTE_PRODUCTION_ID_HERE"
preview_id  = "PASTE_PREVIEW_ID_HERE"
```

## 3. Create the R2 bucket

```
npx wrangler r2 bucket create mob-recordings
```

No ID to copy — the binding name `MOB_BUCKET` in `wrangler.toml` already maps to it.

## 4. Set secrets

Secrets are never stored in `wrangler.toml`. Set them once:

```
npx wrangler secret put CLOUDFLARE_API_TOKEN
# Paste your Cloudflare API token (Permissions: Workers Scripts:Edit, R2:Edit, Durable Objects:Edit)

npx wrangler secret put UPLOAD_SIGNING_SECRET
# Paste any long random string, e.g.:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep `UPLOAD_SIGNING_SECRET` private — it signs the time-limited upload URLs.

## 5. Deploy

```
npx wrangler deploy
```

Output includes your worker URL, e.g.:
```
https://mob-recorder.<your-subdomain>.workers.dev
```

## 6. Test

```bash
export WORKER_URL="https://mob-recorder.<your-subdomain>.workers.dev"
export TOKEN="<the CLOUDFLARE_API_TOKEN you set above>"

# Should return a presigned upload URL
curl -s -X POST "$WORKER_URL/presign" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"test-rec-001.mp4","mimeType":"video/mp4","deviceId":"test"}' | jq .
```

Expected response:
```json
{
  "presignedUrl": "https://mob-recorder.*.workers.dev/upload/test-rec-001.mp4?sig=...&exp=...",
  "r2Key": "test-rec-001.mp4",
  "expiresAt": "2025-..."
}
```

## 7. Configure the desktop app

Open MOB Recorder → Output → Cloud. Enter:
- **Worker URL**: the URL from step 5
- **API Token**: the `CLOUDFLARE_API_TOKEN` value from step 4

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
