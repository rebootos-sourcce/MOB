# ADR-003: Device Identity + Ownership Column on All Root Tables

**Status:** Decided
**Referenced by:** `recorder/src/main/identity.js`

## Context

No table has a `user_id` or `device_id`. When D1 is the sync target, any Worker request can read or overwrite any row. When multiple installations sync to the same D1 database, rows from different machines collide. The Worker has no way to scope queries or enforce ownership.

## Decision

Generate a stable `device_id` (UUID v4) on first launch, stored in Electron's `userData`. Add `device_id TEXT NOT NULL` to `recordings`, `distributions`, and `production_packages`. Worker auth middleware validates a JWT whose `sub` claim equals the `device_id`. All D1 reads and writes are scoped to `WHERE device_id = ?`.

## Consequences

Multi-device use requires an explicit sharing flow (out of scope for V1). Single-device use is fully isolated. The Worker never touches another device's rows. Local SQLite does not enforce this (only one device writes to it), but the column is present for schema parity with D1.

## Implementation status (updated, task #61)

The local half is in place: `identity.js` generates and persists the `device_id`, and the column is populated on every write. An earlier session hardened its persistence (atomic temp-file+rename write; a corrupt `device.json` is now backed up and logged instead of silently minting a replacement that would orphan every existing row's identity).

The Worker half described in "Decision" now exists, with one honest caveat. `workers/src/auth.js` verifies a real HS256 JWT whose `sub` claim is the `device_id` — not the `jose` library this ADR implies (that dependency couldn't be installed or verified in the sandbox this was built in; the minimal implementation is the same algorithm, Web Crypto only, no other dependencies — matching this Worker's existing style, since `index.js`'s own upload-URL signing already used raw Web Crypto, not a library). `index.js`'s `/presign` and `/queue` handlers now reject a request whose body `deviceId` disagrees with the token's verified `sub`, and `/status` only returns a job's metadata to the device that created it (checked against the `deviceId` the Durable Object itself stored from `/queue`'s `/init` call, not whatever the caller currently claims). `recorder/src/main/cloudflare/deviceAuth.js` signs the token on the Electron side (Node's built-in `crypto`, not Web Crypto, since it runs in the main process); a cross-runtime test (`workers/test/interop.test.js`) proves the two independent implementations agree on the wire format, not just that each round-trips against itself.

**What this does NOT fix**, stated plainly because it would be easy to overclaim: every device still shares the SAME `JWT_SIGNING_SECRET` (the same shared-secret model the static Bearer compare used, just signing a structured, expiring claim now instead of being compared directly). A device that holds the secret can still mint a token claiming to be any `device_id` it wants — this closes the "accepted and forwarded, not enforced" gap this ADR originally called out (a body's claimed `deviceId` can no longer silently diverge from reality), but it does **not** achieve this ADR's "the Worker never touches another device's rows" against a malicious holder of the secret. That needs a per-device secret registry — an actual registration/enrollment flow — which is real, separate, future work, not attempted here. D1 and its `WHERE device_id = ?` scoping also still don't exist; this Worker has no SQL backing store at all yet (state lives entirely in per-job Durable Objects).
