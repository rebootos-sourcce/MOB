# ADR-003: Device Identity + Ownership Column on All Root Tables

**Status:** Decided
**Referenced by:** `recorder/src/main/identity.js`

## Context

No table has a `user_id` or `device_id`. When D1 is the sync target, any Worker request can read or overwrite any row. When multiple installations sync to the same D1 database, rows from different machines collide. The Worker has no way to scope queries or enforce ownership.

## Decision

Generate a stable `device_id` (UUID v4) on first launch, stored in Electron's `userData`. Add `device_id TEXT NOT NULL` to `recordings`, `distributions`, and `production_packages`. Worker auth middleware validates a JWT whose `sub` claim equals the `device_id`. All D1 reads and writes are scoped to `WHERE device_id = ?`.

## Consequences

Multi-device use requires an explicit sharing flow (out of scope for V1). Single-device use is fully isolated. The Worker never touches another device's rows. Local SQLite does not enforce this (only one device writes to it), but the column is present for schema parity with D1.

## Implementation status (as of this session)

The local half is in place: `identity.js` generates and persists the `device_id`, and the column is populated on every write. This session hardened its persistence (atomic temp-file+rename write; a corrupt `device.json` is now backed up and logged instead of silently minting a replacement that would orphan every existing row's identity).

The Worker half described in "Decision" **does not exist**. `workers/src/index.js` does a static shared-secret Bearer compare, not a JWT, and `deviceId` is read from the request body and never validated against anything — it is accepted and forwarded, not enforced. There is no `workers/src/auth.js`. Any holder of the one shared secret can act as any device. This is a real gap against this ADR's stated consequence ("the Worker never touches another device's rows"), not just an unfinished feature — it should be closed before any multi-device or shared-environment deployment.
