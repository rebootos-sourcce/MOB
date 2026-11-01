# SOURCE AI V7 — EXECUTIVE HANDSHAKE
**Date:** 2026-11-01 · **Project:** ATÜNED / MOB · **Branch:** `source-voice-sniffer-readonly-20261031` · **PR:** https://github.com/rebootos-sourcce/MOB/pull/163 · **State:** DRAFT, NOT MERGED, NOT PRODUCTION

## BEGIN HERE — INDEX / reading order
1. This file: verified status, paths, blockers, ownership boundary.
2. `docs/SOURCE_EMOTION_CHARGE_CYCLE_TDD_2026-11-01.md`: 21-page TULA source-grounded charge-up/down TDD with implementation update.
3. `docs/SOURCE_VOICE_3_BUILD_HANDSHAKE_2026-11-01.md`: original three-source-engine stages.
4. `proto/source/README.md`, then `proto/source/source-ai-elemental-charge-v7.html`: latest **one-button** V7 pilot, independently runnable, NOT deployed.
5. `atuned_src/engine/voice_charge_cycle.js` + `voice_intelligence.js`, `voice_narrative.js`, `voice_sniffer.js`; `atuned_src/MANIFEST` and `atuned_src/engine/export.js`.
6. `tests/source-voice-charge-cycle.js`, `tests/source-voice-intelligence.js`, `tests/voice-sniffer.js`, `tests/source-voice-narrative.js`; official engine/generation build scripts.
7. Owner ZIP `SOURCE_AI_V7_EXECUTIVE_HANDSHAKE_2026-11-01.zip` (provided in ChatGPT thread, NOT automatically a GitHub repo file): original owner TULA PDF, 37-case semantic fixture JSON, fixture/standalone tests, local V7 script, screenshot, TDD source catalog and full executive status.

## Product intent / owner rulings
Source AI is a **peer**. One voice button, no text-heavy dashboard, silence while user is silent, opening greeting at session start, a low soft warm non-patronizing voice, no automatic digging. User explicitly prefers **visual element over chakra symbol**: abstract motion/material/element motifs with chakra colors; no claim the art is a measured force. The first five conventional design metaphors (Earth, Water, Fire, Air, Space), and Light and Awareness for remaining bands, are **NOT approved canonical energetic assignments**. Keep them visually provisional until owner confirms. Do not turn Source into a clinician or another separate intelligence agent.

Source must identify *actual reported language* across: canonical fetters/112 addresses, fuzzy synonyms/paraphrases, seven communication channels (Believe/Perceive/Think/Behave/Act/Say/Feel), intensity modifiers, the nine canonical CHILD axes, 21 spiritual-integrity laws, reported intent vs action, ancestry/family-to-self narrative, corrections/negation, and emotional episodes. A verbal expression is never an inherited causal mechanism, confirmed trait, CQ grade, or numeric body-energy measurement.

**TULA owner's clarification:** charge-up = emotion building AND accumulating stories; charge-down = stories after peak/choice, which can describe release, embarrassment/shame/guilt/humiliation, or continuing hostility/charge. TULA curves are illustrative: future projection (left), choice (apex), past reflection (right); a lexical 1–9 ordinal word and time reference do not place a person at a numeric curve coordinate. The source reference has 7 x 9 = 63 ladder positions, 7 conceptual diagrams, distinct from canonical 9 CHILD emotion axes.

## Actual code in this PR (verified files)
- `atuned_src/engine/voice_sniffer.js` reads **canonical** `sniffStory` / `srcHear`, read only, no self-certified CQ.
- `atuned_src/engine/voice_narrative.js` distinguishes descriptions of family vs speaker, self-similarity candidate, corrections; no unsupported inherited mechanism.
- `atuned_src/engine/voice_intelligence.js` handles canonical `evLedger`, consent-scoped `traceFromRecord`, read-only `srcVoiceGraph`, nonidentifying `srcVoiceCanon` records from 9 **sampled** canonical table families (NOT all records).
- **NEW V7:** `atuned_src/engine/voice_charge_cycle.js` implements `srcVoiceChargeCycle(finalizedTurns,opts)` read-only, source-ranked lexicon plus provisional idioms, grammatical subject including transitive 'I pissed off my sister' vs first-person 'I got pissed off', quote/hypothesis/negation, cross-turn phase and independent direction, correction/retraction, and 7 channels. It uses neither profile nor graph, writes nothing, auto-prompts never. JSON output includes `curvePosition:'NOT_MEASURED'`, `coherence:'NOT_MEASURED'`, `ancestry:'NOT_ESTABLISHED'`.
- `atuned_src/MANIFEST` loads charge reader after narrative, before intelligence. `engine/export.js` exports the reader and `SRC_TULA_LADDERS`. `srcVoiceIntelligence` composes `intelligence.emotionCycle`.
- **NEW V7 visual:** `proto/source/source-ai-elemental-charge-v7.html` keeps ElevenLabs pilot `agent_8301m6aqwbrje4v8218ty5rz2w2b`; current audio behavior and provider credit conditions not newly changed. Element-led, language-cue visual bars with live words/channels; deterministic cycle view across confirmed turns, source-ranked/unknown distinction, and no unsupported plotted Gaussian dot. The local prototype still has an optional same-origin hook to actual intelligence; it is NOT yet hosted with the canonical graph.

## Tests / truth of measurement
- On a **standalone local module**, all **37/37** semantic scenarios in `TEST_FIXTURES.json` passed; additional **9** privacy/state assertions passed. These were deterministic synthetic inputs, not measured language precision/recall in natural conversation.
- On **headless Chromium**, V7 passed **12/12** UI/cycle/simulated-voice-ledger/responsive-screen assertions; no browser page errors. The results include 'I got pissed off' (Anger, rank/phase/direction UNKNOWN), 'Then I felt ashamed' (past reflection, NOT necessarily decreasing), 'Then I calmed down' (explicit decreasing), and no curve marker from ordinal rank.
- Draft PR has `tests/source-voice-charge-cycle.js` (25 test phrases + structural/privacy gates). It has **NOT been verified against the official built `engine.js` yet**.
- The full MOB build, compiled `engine.js`, generated `source.html` and funnel outputs, and CI **were queued/not verified** at last check. Prior PR CI flagged stale generated products, which remain OPEN. Do not declare pass.
- The V7 **real microphone/WebRTC test**, actual ElevenLabs billing/access, full voice-to-record graph, real transcript matching, production deployment, and 21x10 integrity law compliance audit are NOT verified. No numeric CQDQ score obtained.

## Remaining actions / exact order
1. Sync branch and run `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh`. Commit all regenerated products together. Inspect tests/build scripts rather than assuming queued CI means green.
2. `node tests/source-voice-charge-cycle.js`, `node tests/source-voice-intelligence.js`, `node tests/source-voice-narrative.js`, `node tests/voice-sniffer.js`, `node tests/engine.js`; full repository/browser CI and nonregression. Compare genuine outputs from canonical engine. Local ZIP includes reproducible standalone fixture and Chromium runners.
3. Implement **same-origin** authenticated host composition: finalized speech -> `srcVoiceIntelligence` -> read-only graph query from explicit active record only with two consent flags -> bounded nonidentifying result -> V7 display. Do not ship raw journals/profile IDs or long historical records to ElevenLabs. Verify revocation and no graph access without consent.
4. Resolve fuzzy paraphrase family mappings against the existing `LEX`/source registry and review ambiguous one-to-many terms; use grammar/subject, correction and chronology before any record promotion. Benchmark precision/recall on consented diverse sentences (targets 0.90/0.85 remain **unmeasured**).
5. Owner sign-off on elemental metaphors and perceived readability; real mic, idle-silence, greeting, corrections, client-tool callback, audio visualizer behavior; then PR review, merge, deploy. Give other AI the specific unresolved failures, not '100%' claims.

## Behavioral caveats / boundaries
One word does not establish where a person is on a curve. `pissed off` is a provisional Anger synonym with **NO TULA rank**. `I pissed off my sister` is transitive causative, **NOT** self anger. `horrified` occurs twice in TULA (Fear 9, Disgust 8), so context required. `upset` appears as both Anger rank 3 and general stress label, remain ambiguous. `calmed down` is a decompression phrase, NOT a Sadness rank-1 match on `down`. Anger followed by shame is AFTERMATH, not an automatic drop in charge. Family-to-self is a speaker-reported resemblance, not genetic inheritance.

## Continuation protocol
DO NOT replace the existing One-Button voice agent or clone engine rules. Implement above the existing canonical reader. Keep PR draft until full gates pass. Update this document and the PR body as test status changes, with exact SHA, commands, failures and follow-up patches. The owner asked to end this thread with the executive ZIP so a next thread can resume from this index without repeating repo search.
