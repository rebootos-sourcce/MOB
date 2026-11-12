# ADR-002: EDL (Edit Decision List) as a First-Class Schema Concept

**Status:** Decided
**Referenced by:** `recorder/src/main/edl.js`

## Context

When a user cuts a filler segment in Edit mode, the original recording timestamps survive but the exported clip has different timestamps. All downstream tables — captions, segments, chapters — reference the original recording timeline. After a cut, caption `start_ms=12400` may now be caption `start_ms=10900` in the export, breaking SRT files and YouTube chapter markers silently.

## Decision

Add an `edl_entries` table recording which source ranges were kept and their remapped output positions. Provide a `remapTimestamp(edlEntries, sourceMs) → outputMs` function used by every table that generates export artifacts (captions, chapters, thumbnails).

## Consequences

SRT export, chapter JSON, and thumbnail selection all call `remapTimestamp` before writing positions. Cuts stack correctly: a second cut is applied to already-remapped output positions. The original `words` and `segments` rows are immutable; EDL entries describe the edit without destroying source data.

## Implementation status (as of this session)

Now fully live. For most of this project's life, the schema existed but the behavior described in "Consequences" did not:

- `remapTimestamp` had **two independent implementations** (`edl.js` and a second one duplicated inside `production.js`) that disagreed on an adjacent-cut boundary. Reconciled this session — `production.js` now calls the one shared function.
- Captions export (`captions:export` in `main.js`) read `segments` timestamps raw, ignoring the EDL entirely. Fixed this session — it now remaps through the EDL before formatting SRT/VTT.
- There was **no path from `edl_entries` to an actual output file at all** — applying cuts wrote rows and nothing else; the video on disk never changed. Fixed this session (`ffmpeg.renderEdl`, `edit:renderOutput`).
- `edl_entries.clip_id` is still never populated by `applyCuts()`, so the `idx_edl_clip` index exists but is unused.
