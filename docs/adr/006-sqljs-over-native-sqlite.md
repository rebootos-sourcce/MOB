# ADR-006: sql.js (WASM) Instead of a Native SQLite Binding

**Status:** Decided (undocumented until this session)
**Referenced by:** `recorder/src/main/db/sqlite.js`

## Context

ADR-001 establishes SQLite in the Electron main process as the source of truth, but does not specify which binding. The obvious choice, `better-sqlite3`, is a native Node addon: it must be rebuilt (via `electron-rebuild`) for Electron's exact Node ABI, per platform and per architecture. For an app shipping Windows/Mac/Linux across x64 and arm64, that is four to six native binaries to build, test, and keep in sync with every Electron upgrade — and native module rebuild failures are one of the most common sources of "works on my machine" packaging breakage in Electron apps.

## Decision

Use `sql.js`, a pure-WebAssembly build of SQLite with zero native compilation step. The database lives entirely in memory as a `Uint8Array`; `sqlite.js` loads it from `userData/mob.db` on startup and exports + writes the whole buffer back to disk on every change (debounced).

## Consequences

**Positive:** no native rebuild step, no per-platform/arch binary matrix, works identically across Electron versions without recompilation. This is almost certainly the right trade for a small-to-medium local database in a cross-platform desktop app.

**Negative, and the reason this ADR exists:** every write is "export the entire in-memory database and write the whole file," not an incremental on-disk write. This has two consequences that were not anticipated when the tradeoff was made:

1. **Durability window.** A crash between `db.export()` and the write landing on disk loses whatever changed since the last successful write — there is no WAL or incremental journal to replay. This session fixed the sharper edge of this (the write was not even atomic: `persist()` truncated `mob.db` directly, so a crash *during* the write, not just before it, could corrupt the file outright). It is now a temp-file-plus-rename, which closes the corruption case but not the "last N seconds of writes since the debounce" exposure, which is inherent to the export-the-whole-DB model.
2. **Write cost scales with total database size, not with the size of a single change.** A one-row `UPDATE` on a database with 10,000 transcript words still re-serializes the whole database. This has not yet been a measured problem (the dataset this app accumulates per user is not large), but it is worth knowing before assuming an `INSERT` is O(1).

No action is proposed here — this ADR exists to make the tradeoff visible, since it was previously undocumented and directly explains a real bug (non-atomic persist) found and fixed in this session.
