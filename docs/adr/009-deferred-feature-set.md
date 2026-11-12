# ADR-009: Deliberately Deferred Feature Set

**Status:** Decided
**Referenced by:** `docs/mob-recorder-tdd.html`, `docs/mob-build-plan.html`, `docs/mob-architecture.html`

## Context

The three spec documents (`mob-recorder-tdd.html`, `mob-build-plan.html`, `mob-architecture.html`) describe a larger surface than this app builds. Most of the gap is not an oversight — it's named as deferred in the specs themselves, or decided against during this project's build sessions for a stated reason (cost, platform restriction, or scope). Left unwritten, every review re-discovers these as "missing" and re-litigates a decision that was already made. This ADR is the single place that decision lives.

Two kinds of entry follow: features the specs themselves mark as out of scope or future work (cited by doc + line), and structural choices this codebase made that diverge from what the specs describe (cited by the file that actually implements the divergence).

## Decision: deferred features

**Platform publishing beyond R2.** `mob-recorder:// ` custom protocol, OAuth2 PKCE, `node-keytar`/`safeStorage` token persistence, and the YouTube Data API v3 resumable upload (TDD:963-968, 1621, 1825; build-plan:929-939) are not built. This project's standing scope decision stops distribution at an R2 upload + shareable link (ADR pending real Worker deployment — see task #61). The `youtube`/`tiktok`/`linkedin` strings present in the code today are `variants.js`'s per-platform *copy generation* (title/caption text tailored to each platform's conventions) — metadata text with no upload path behind it; do not mistake one for the other.

**Twitter/X.** TDD:1365, 1435: deferred because X's API requires $100/month for the write access this app would need (chunked media upload). TDD:1435: "surface only after owner decides to absorb the cost" — a business decision, not an engineering gap.

**Instagram.** TDD:1367, 1435: deferred because personal accounts have zero API access (a business/creator account is required) and the 90-second Reels cap makes most screen recordings unpublishable anyway.

**WebCodecs recorder rewrite.** TDD:1323: `VideoEncoder` could replace `MediaRecorder` for precise frame control, but TDD's own text calls it "deferred — requires a rewrite of recorder.js and is not needed for Build 9." `recorder.js`'s current `MediaRecorder` + manual `canvas.captureStream(0)` architecture stays.

**Analytics.** TDD:1059: requires cloud infrastructure this project doesn't run (view counts, engagement data would need a server to aggregate).

**Eye-contact correction, speaker diarization, face-track auto-zoom.** TDD:1545, 1538, 725/1056/1617 respectively — all MediaPipe-dependent AI features explicitly grouped under later build phases in the TDD's own module list, not attempted here.

**AV1 export.** TDD:1318-1321 describes a road map (`libsvtav1`, `av1_nvenc`) for *export*, explicitly "not for the intermediate" — i.e. even the spec doesn't want this for the raw capture codec, only as a possible future delivery format. Not built.

**Multi-clip stitch timeline, rough-cut generation (Underlord), transcript-based editing.** TDD:1056/1580/748,1004-1010,1829 — each listed as a distinct future module (word-level transcript editing mapping to video cuts via `contenteditable` + Whisper timestamps is the most-cited one, TDD:1004-1010). None of EDL/segments/transcript infrastructure this app already has is a blocker for these; they're sequenced after what's built.

**Background blur / AI Green Screen, LUT color grading.** TDD:531-543 ranks background blur high (Loom parity) but large; TDD:964-995 specs `.cube` LUT browsing + WebGL2 preview + `lut3d` apply-at-save. Both need MediaPipe Tasks / WebGL2 pipelines not currently in this app.

**Silero VAD gate.** build-plan:749, 896 — a voice-activity-detection gate to skip recording empty silence. `silence.js`'s `detectSilences()` (ffmpeg's own `silencedetect` filter, post-hoc on the finished recording) covers the *editing* use case (trim silence after the fact); a live recording-time VAD gate is a different, unbuilt feature.

**Multi-device sharing, D1 replication.** build-plan:186 states explicitly: "Multi-device use requires explicit sharing flow (out of scope for V1)." build-plan:142 describes D1 as the sync target for a Worker that isn't deployed (task #61). `device_id` columns exist on root tables per ADR-003 for schema parity, but nothing enforces or exercises cross-device semantics locally — there's exactly one writer.

**Claude API title generation.** build-plan:640, in the spec's own words: "Title generation made a Claude API call that is dead code — no API key is bundled." The decided, shipped path is `production.js`'s local energy-heuristic title selection (highest-energy real speech segment, ADR-005's scoring rules) — see task #51.

## Decision: structural divergences (decided, not bugs)

These are places the running code differs from what the spec documents literally describe. Each was a deliberate choice made during this project's build sessions, not a shortcut that slipped through.

- **`better-sqlite3` → `sql.js`** (ADR-006): the spec assumes a native SQLite binding; this app runs sql.js's WASM build instead, persisted to disk manually. See ADR-006 for the full tradeoff.
- **SQL migration files → inline JS in `migrate.js`**: no `.sql` migration file directory exists; schema evolution is hand-written JS logic keyed on a `schema_version` row.
- **`captions` table → `segments` with `type='speech'/'silence'`** (ADR-007, amended for task #56's `markers` table).
- **`main/intelligence/{chapters,formatters,packages}.js` → folded into `production.js` and `variants.js`**: the spec's module boundaries split chapter detection, text formatting, and package assembly into separate files; this codebase consolidated related logic once their actual coupling (all three read the same transcript + EDL state to build one package) became clear during implementation.
- **`vault.json` → superseded by SQLite**: TDD:1128-1155 and 1451 describe a `vault.json` index file living next to the save folder as the recording library's index. ADR-001 made SQLite the single source of truth instead; nothing reads or writes `vault.json` in this codebase.

## Resolved: the one open question this ADR's source task raised

Task #63 (which produced this document) flagged one genuinely open item: whether transcription running in-process (blocking the main process during Whisper) rather than in a worker thread should stay that way. **This is resolved by ADR-008**, written earlier in the same session: in-process stays, with the tradeoff (no clean cancellation path, documented as ADR-008's own open follow-up question) accepted rather than hidden.

## Consequences

A reviewer hitting any item above should find it here with its citation before re-opening it as a gap. Anything NOT listed here and NOT implemented is a real gap, not a deferred decision — the task board (`#48`, `#55`, `#61`, `#71`, `#72`, `#77` at time of writing) tracks those separately.
