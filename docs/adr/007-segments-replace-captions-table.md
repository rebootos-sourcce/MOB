# ADR-007: `segments` Replaces the Separate `captions` Table

**Status:** Decided (undocumented until this session)
**Referenced by:** `recorder/src/main/db/schema.sql`, `recorder/src/main/intelligence/captions.js`

## Context

The schema documented in ADR-005's surrounding spec (see `docs/mob-build-plan.html`) defines a separate `captions` table (`id`, `transcript_id`, `clip_id`, `seq`, `start_ms`, `end_ms`, `text`, `format`) alongside `segments` (`seq`, `start_ms`, `end_ms`, `text`, `type`, `wpm`, `energy`). In practice these overlap almost completely: a caption is a span of text with start/end timestamps over the same transcript timeline that `segments` already models, distinguished only by being intended for display rather than analysis.

## Decision

Drop the `captions` table. Speech content lives in `segments` with `type = 'speech'`; silence gaps live in `segments` with `type = 'silence'` (the schema's own comment documents this as "Fix #20"). `captions:export` (`main.js`) reads `segments WHERE type = 'speech' ORDER BY seq` and formats SRT/VTT directly from those rows, rather than a separately-populated `captions` table.

## Consequences

One fewer table, one fewer write path to keep in sync with the transcript. The tradeoff: `segments.type` was specified (per the build-plan schema) to also carry `'filler' | 'retake' | 'bookmark'` values for future use (chapter markers, retake cuts) — none of those are written today, only `'speech'` and `'silence'`. If/when bookmark markers or retake cuts are built (see the deferred-features note), they have a natural home in this same table rather than a new one, which is one more argument for this collapse having been the right call.

No `format` column exists on `segments` (the dropped `captions` table's `format TEXT DEFAULT 'srt'`) — format is a property of the *export*, chosen at export time by `captions:export`'s caller, not stored per row. This is correct: the same segment timeline can produce both an SRT and a VTT file without needing two rows.
