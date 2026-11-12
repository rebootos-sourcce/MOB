# ADR-001: Local-First — SQLite in Electron is the Source of Truth

**Status:** Decided
**Referenced by:** `recorder/src/main/db/sqlite.js`

## Context

The original architecture described intelligence algorithms running in Cloudflare Workers and D1 as the primary store. This directly contradicts the "fully offline" product promise, requires internet for every operation, and means multi-GB video uploads must route through a Worker (blocked by the 100MB body limit).

## Decision

SQLite in the Electron main process is the sole source of truth. All six intelligence algorithms run locally in Node.js. D1, R2, and Queues are a sync and distribution layer only — optional, never blocking the core loop. A recording can reach production without any Cloudflare account.

## Consequences

Workers become thin API shims: auth, pre-signed URL generation, D1 replication writes, and Queue submissions. No algorithm logic crosses the network. R2 upload bypasses the Worker entirely via pre-signed URL. User data is never at risk if Cloudflare is down or the user is offline.

## Implementation status (as of this session)

Complies, with one undocumented deviation: the engine is **sql.js** (pure WASM), not better-sqlite3 as originally assumed when this ADR was written — no native module rebuild is needed across Electron versions/platforms, at the cost of a full in-memory database that has to be exported and written to disk on every change rather than writing through directly. This is the root cause behind a durability bug fixed this session (`sqlite.js`'s `persist()` now does atomic temp-file+rename instead of truncating `mob.db` directly). See ADR-006.

R2 upload does **not** currently bypass the Worker — see ADR-004's implementation status.
