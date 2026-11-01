# Source AI V5 Visual Sniffer — Executive Engineering Handoff (2026-11-01)

**Branch / PR:** `source-voice-sniffer-readonly-20261031` / [draft PR #163](https://github.com/rebootos-sourcce/MOB/pull/163). This is not merged or deployed.

## Intent / the owner's decisions
Source AI retains **one conversational button** and the already working ElevenLabs Matilda pilot. The screen must show observable patterns as a compact, responsive chakra-colored visualization, not a long text dashboard. It should listen for contextual paraphrases, full phrases, seven communication channels (Believe, Perceive, Think, Behave, Act, Say, Feel), intensity modifiers, child-emotion vocabulary, action/intention and moral-integrity evidence, and family-to-self/ancestral narrative. A metaphor or mention is not an established CQ, fetter diagnosis or inherited cause.

## Actual delivered local V5 client
Downloadable conversation artifact **SOURCE_AI_SIGNAL_VIEW_V5.html** (SHA-256 `ee00ee0f003c011c3e822333d771a2382c3398e2159ed161f0ade42b72d57add`), plus `SOURCE_AI_V5_EXECUTIVE_HANDSHAKE_2026-11-01.zip`. Owner chat artifacts **are not committed to GitHub**; other agents must request or retrieve the ZIP from the user/conversation. The local HTML is one-file, needs no Python runtime and keeps agent ID `agent_8301m6aqwbrje4v8218ty5rz2w2b`.

### Visual behavior
- Animated cyan/amber orb for user and Source output, unchanged session start/stop.
- Seven colored signal bars using actual canonical palette `PAL`: Root #D6524C, Sacral #D8924E, Solar #DABF6A, Heart #5FD5A6, Throat #5EBBDB, Brow #7D93E0, Crown #A77EDB.
- Seven channel lamps that activate on spoken first-person channel language.
- Copyable spoken transcript (real spaces), exact canonical vocabulary indicated as solid underline, six explicit provisional paraphrase families as dotted underlines, denied/uncertain references as dashed. The multiword/full clause coloring is restricted to a supported same-band clause; no one-color wash for a mixed-band sentence.
- Compact family-to-self narrative visual, child emotion mentions, intensity words and reported action/intention distinctions. No clinical diagnosis or numeric severity produced.
- The read-only `read_sniffer_evidence` ElevenLabs client tool returns bounded provisional semantic cues, channels, modifiers and child emotion mentions. A non-interrupting `sendContextualUpdate` is sent only after confirmed substantive user turns, not on idle.
- When a **same-origin production host** explicitly exposes `window.srcVoiceIntelligence`, a completed user turn can request the real canonical reader. The visual status distinguishes `LOCAL CANDIDATES`, `Sniffer read` and `Graph read`. A record is passed only if **both** `ATUNED_SOURCE_VOICE_CONTEXT.allowProfile===true` and `.userConsent===true`; disabling either prevents the next profile read.

### Conservative inference
The six provisional phrase mappings are not newly approved canon entries. They have no new fetter IDs, intensity values or CQ scores. In particular, `indignant` (tentatively anger/solar) and `avoidant` (tentatively withdrawal/sacral) must not be locked to a canonical address without review. Existing `atuned_src/engine/lexicon.js`, `sniff.js`, `voice_sniffer.js`, `voice_narrative.js`, `voice_intelligence.js`, `trace.js`, and `evidence.js` remain the sources of truth for canonical behavior.

## Tests executed (local, NOT production)
- `node --check` for extracted inline module: PASS.
- V5 browser/semantics rendering tests: **34/34 passed**, headless Chromium desktop/mobile.
- Simulated ElevenLabs SDK start -> confirmed speech -> evidence client tool -> contextual update -> stop: **6/6 passed**.
- Simulated canonical-host read, consent, revocation and graph-status boundary: **10/10 passed**.
- Real V5 microphone/WebRTC/provider behavior and direct running production bundle: **NOT tested in this turn**. Tests do not certify precision/recall or 21x10/10 coherence.

## Production completion sequence
1. Run full MOB tests and rebuild generated files under the draft PR: `./atuned_src/BUILD-engine.sh`, `./atuned_src/BUILD.sh`, `./funnel/BUILD-single.sh`, `node tests/engine.js`, `node tests/voice-sniffer.js`, `node tests/source-voice-narrative.js`, `node tests/source-voice-intelligence.js`. Existing GitHub Actions runs were still queued at time of this handoff. An older run failed stale generated products.
2. Host the voice V5 UI in the same origin as the real canonical engine. Supply a **verified read-only** `srcVoiceIntelligence` call; consent separately gates a record-scoped `traceFromRecord` graph query. Do not expose raw private journals or profile objects to ElevenLabs.
3. Reconcile the V5 provisional fuzzy candidates with the one canonical `LEX`/Sniffer ontology, retaining phrase boundaries, context, negation, role attribution, corrections, and explicit reviewer rulings. Support true phrase-to-fetter mappings only after independent acceptance tests.
4. Extend actual law, nine child-emotion, actions and universal-law records into the verified graph-output schema; support multi-session ancestral evidence only with explicit user-reported lineage and causal restraint.
5. Run real mic/idle/voice/correction/privacy tests, adversarial paraphrase vs near-match cases, objective scoring; merge/deploy only with owner review.

## Source status
- Draft PR #163 authored three functional backend reader stages but is **unmerged**.
- Standalone V5 provides a provisional **visualization**, not a working production graph service.
- Source uses one agent + canonical engine; no new AI agent was created for V5.
- No production source/build modified by this particular visualization pass.

**Next-AI reading order:** this file -> `docs/SOURCE_VOICE_3_BUILD_HANDSHAKE_2026-11-01.md` -> `reviews/SPEC-source-ai.md` -> `SNIFFER_SPEC.md` -> PR code/tests -> the owner's V5 ZIP index. Update the executive handshake after every verified status change.

## Verified GitHub prototype source (same branch)
- `proto/source/source-ai-signal-v5.html` is the **actual complete tested V5 prototype**, committed on this draft branch (blob SHA `cc210ba1643225e0a2d0ef0c1c233d6b19bfd1a3`). A full GitHub readback matched the tested conversation file exactly (70,237 characters). This corrects the older note that only the owner chat contained the HTML.
- `proto/source/README.md` explains UI detection boundaries and links to canonical integration.
- The **executive ZIP**, builder, tests, and screenshot remain user-downloadable conversation artifacts, not all stored as repo files.
