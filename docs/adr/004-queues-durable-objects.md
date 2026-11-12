# ADR-004: Cloudflare Queues + Durable Objects Replace KV for Distribution Jobs

**Status:** Decided
**Referenced by:** `recorder/src/main/cloudflare/sync.js`, `workers/src/coordinator.js`

## Context

The original design used KV as an async job queue (`KV.put(jobId, status)`). KV has no queue semantics: no FIFO ordering, no retry, no dead-letter handling, no exactly-once delivery. A Worker reading from KV to process jobs is a polling anti-pattern. KV TTL-based cleanup is a source of silent data loss.

## Decision

Use Cloudflare Queues for async distribution jobs (YouTube upload, TikTok submit, etc.). Use a Durable Object (`DistributionCoordinator`) to track per-distribution state machine: `pending → uploading → processing → published`. Add `resume_session_uri TEXT` to the `distributions` table so interrupted uploads resume rather than restart.

## Consequences

The Queue consumer handles retries with exponential backoff automatically. The Durable Object holds the upload cursor so a 2GB video resumes from byte N, not byte 0. The `distributions` table becomes a read-only audit log of what the Durable Object decided.

## Implementation status (as of this session)

Partial, with one direct contradiction of the stated premise. What exists: the `DistributionCoordinator` Durable Object, with an idempotent `/init` and a tracked status (`pending → uploading → uploaded → queued`). What does not:

- **There is no presigned-URL upload.** `/presign` returns a URL back to the Worker itself, and `/upload/:key` does `MOB_BUCKET.put(r2Key, request.body)` — every video byte streams through the Worker, which is exactly the 100MB-body-limit problem ADR-001 cites as a reason to avoid Worker-mediated uploads in the first place.
- **There is no Queue.** `workers/wrangler.toml` has no `[[queues]]` binding and `index.js` has no `queue()` handler; `/queue` just pokes the Durable Object synchronously. None of "retries with exponential backoff" exists.
- **`resume_session_uri` is never read or written.** `sync.js` always uploads from byte 0. A 2GB upload interrupted at byte 1.9GB restarts from the beginning.
- `wrangler.toml` still binds the `MOB_KV` namespace this ADR says to remove, unused by any code, with a `REPLACE_WITH_KV_ID` placeholder that blocks `wrangler deploy` until filled in.

None of this blocks local-only use (ADR-001's whole point), and deployment of the Worker is explicitly out of scope for the current phase of work — but if that phase starts, this ADR's actual decision needs to be built, not just its schema.
