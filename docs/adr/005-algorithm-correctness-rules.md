# ADR-005: Algorithm Correctness — Five Rules That Fix All Six Bugs

**Status:** Decided
**Referenced by:** `recorder/src/main/intelligence/filler.js`, `silence.js`, `captions.js`, `hashtags.js`

## Rules

- **R1** — Filler pre-pad goes BEFORE the word (speaker hesitates before saying "um"), post-pad is ≤50ms.
- **R2** — `start_ms` is always `max(0, computed_value)` — never negative.
- **R3** — Overlapping filler/silence segments merge by extending the last segment's `end_ms`.
- **R4** — Caption overflow creates a new caption; it never merges with the next segment.
- **R5** — Hashtag extraction uses TF-IDF; raw TF is insufficient for multi-recording corpora.

## Context

These five rules address: negative timestamps when the first word is a filler, phantom gaps from bidirectional padding, duplicate captions from overflow merging into adjacent segments, and useless hashtags on short single recordings where every term has TF=1.

## Implementation status (as of this session)

R1–R4 hold in the current code, with one correction to R1 made this session: `transcription.js` was adding a *second*, independent ±200ms pad on top of `filler.js`'s own pre/post pad before marking a word as a filler-adjacent "don't touch" zone, which widened the effective window to 350ms before / 250ms after each filler — enough to swallow the preceding word. The stacked pad was removed; R1's stated 150ms/≤50ms padding is now the only padding applied.

Separately (not an R1–R4 violation, but adjacent): the filler *token list* itself had drifted from spec — it included ordinary words (`like`, `basically`, `literally`, `actually`, `so`, `well`, `right`) well beyond the intended filler-sound set. Trimmed this session to `um/uh/er/ah/hmm/uhh/umm/mhm/uh-huh`.

R5 is **not implemented**. `extractHashtags` computes a real TF score but `IDF_OVERRIDES` is a small hardcoded table of per-word weights, not a TF-IDF computation over a corpus — there is no corpus, so two recordings on the same topic do not get different hashtags, and `metadata_tags.idf_score` is written as the TF score passed twice (`transcription.js`), not a real IDF value. This is a known open gap, not yet scheduled.
