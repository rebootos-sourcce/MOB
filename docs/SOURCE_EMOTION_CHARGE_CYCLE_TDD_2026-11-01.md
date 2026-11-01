# Source AI — Laws of Emotion / Charge-Up and Charge-Down Sniffer
**TDD v0.1-draft · 2026-11-01 · OWNER MODEL · not production-implemented**

## Executive contract
Source must detect the **story of an emotional episode**, not just the presence of an emotion word. The owner defines **charge-up** as the building emotion plus accumulating stories, and **charge-down** as the subsequent stories of decompression, reappraisal, aftermath or ongoing reaction. Emotion family, lexical intensity, narrative phase, time perspective and charge direction are *independent fields*.

TULA's bell curve is an **illustrative model, not a measured Gaussian distribution**. Never infer its peak, numerical position, duration, or a causal outcome from one adjective. Single phrase **"I got pissed off"** must be recognized as first-person **Anger, provisional colloquial wording; TULA rank unknown; phase unknown; direction unknown**. "I pissed off my sister" is a separate causative statement about another person and does **not** assert the speaker felt anger.

## Five-pass source review — owner's 21-page PDF
**Source:** owner-provided `Copy of TULA - YOUR AUTHENTIC SELF.pdf`, 21 pages (full reference and machine-readable catalog in owner's executive ZIP).
1. Pages 1–2: speaking/story prompts and channels: Believe; Perceive/Imagine/Think; Speak/Say/Voice; Behave/Act/Feel; Do/Know/Want/Need. Normalize seven channels **Believe, Perceive, Think, Behave, Act, Say, Feel** without losing exact spoken wording.
2. Pages 3–9: seven **1–9 ordinal word ladders** (63 ranked slots): Fear p3, Anger p4, Sadness p5, Disgust p6, Shock p7, Happiness p8, Shame p9. Colloquial **pissed off** is not one of the exact numbered words. "Horrified" appears on two ladders (Fear=9, Disgust=8). Preserve ambiguity; no synthetic 1–9 -> 0–10 conversion.
3. Pages 10–13: Attachment, Aversion, Ignorance categories (behavior, beliefs, action, ethics). A word mention is NOT a verified fetter or law violation. Attribute to subject, tense, negation, story and context.
4. Page 14: Mild/moderate/intense stress vocabulary is a second taxonomy; "Upset" is broad here but ranked 3 on the Anger card, so avoid forcing one interpretation.
5. Pages 15–21: seven illustrated curves: Sadness 15, Anger 16, Shock 17, Disgust 18, Fear 19, Shame 20, Happiness 21. Left = Future Projection, apex = Choice, right = Past Reflection; Y = Emotional Intensity, X = Time Perspective. They are conceptual illustrations and do not define a physiological waveform.

## Anger page 16 is especially important
The **diagram's** left/story-building labels include Irritated, Annoyed, Frustrated, Angry, Furious, Enraged, Infuriated, Seething, Raging. Its right/story-after-peak labels include Embarrassed, Ashamed, Guilty, Humiliated, Provoked, Hostile, Aggressive, Vengeful, Violent. These are **diagram annotations, not** the separately authored Anger 1–9 card on page 4 (Annoyed, Irritated, Upset, Angry, Mad, Furious, Livid, Outraged, Enraged). Do not conflate either set.

**Crucial rule:** Embarrassment or humiliation may be reported after anger; they are **not guaranteed**. Post-peak hostility or aggression can be *continued activation*, not healthy decompression. The TULA reflection-side label does not establish that a speaker has actually felt it.

## State / data design
Use a **read-only** `srcVoiceChargeCycle(finalizedTurns, opts)` *new draft function* loaded after `srcVoiceNarrative` and composed inside `srcVoiceIntelligence`. Do NOT replace `sniffStory` or duplicate the canonical graph/scoring engine.

- Observations: exact transcript span, offset, final/interim status, source, speaker, subject, tense, negation, hypothetical, quote context, correction pointer, clause.
- Vocabulary: emotion family, `matchKind=EXACT_TULA|CANONICAL|MORPHOLOGICAL|PROVISIONAL_IDIOM|PARAPHRASE|UNKNOWN`, PDF page, ambiguities and status reviewed/provisional.
- Intensity: `tulaRank: 1..9|null` ONLY if sourced; self-reported rating separate; modifiers (really, extremely etc.) separate. No unapproved rank inference.
- Story links: episode ID, evidence turns, triggers, perceptions, belief/story rule, feel/think/say/act/behave events, consequences, reparative actions, explicit choices, family-to-self/ancestral candidate with source attribution.
- `narrativePhase=UNKNOWN|FUTURE_PROJECTION|BUILDING|PEAK_OR_CHOICE|PAST_REFLECTION|STABLE|MIXED|CORRECTED`.
- `chargeDirection=UNKNOWN|INCREASING|DECREASING|CONTINUING|STABLE|MIXED`.
- Never equate `PAST_REFLECTION` with `DECREASING`. "After I yelled I was ashamed" = aftermath with unknown anger decrease. "I was furious and then calmed" = explicit decrease. "I got pissed off" = both unknown.
- No curve marker until explicit chronology; the Gaussian is **illustrative**.
- Crosswalk seven TULA families ↔ nine MOB child axes from `CHILD`: Fear, Anger, Shame, Disgust, Shock, Sadness ↔ canonical Sad; Happiness positive reference (not all coherent poles). Apathy, Surprise and Anticipation remain independent canonical axes.
- A single person/event can include multiple simultaneous axes. Keep perceived right/wrong actions distinct from adjudicating 21 integrity laws. No CQ or somatic measurement from unassessed speech.

## Read-only graph seam
`transcript -> srcVoiceSniff (sniffStory/srcHear) -> srcVoiceNarrative -> srcVoiceChargeCycle -> evLedger -> traceFromRecord (only if active-profile user consent) -> srcVoiceIntelligence -> voice clientTool + visualization`.
Candidate graph node/edge concepts: turn, event, emotion_obs, story_rule, choice, behavior, consequence, family_role, correction, curve_phase; REPORTED_BY, PRECEDES, SUBJECT_OF, PART_OF_EPISODE, CORRECTS, USER_CONFIRMED_LINK. **These names are proposed** pending reconciliation with actual `trace.js` graph schema. Never mutate `applyStory` from voice. Only explicitly confirmed patterns may be considered for durable profile writes through a separate approved workflow. No raw private journal/profile IDs to ElevenLabs or this repo.

## Visual behavior
Preserve the one-button voice orb, lower female voice, greeting at session start, and silent idle. Color exact canonical words by canonical chakra `PAL` (solid underline), approved/provisional paraphrases dotted, negated/doubted dashed. Same-band/subject clauses may carry full-phrase color only when supported; mixed clauses stay multi-colored. Show a compact rising/falling timeline with **build** and **aftermath/decompression** and seven channel indicators. Marker only when chronology is evidenced; otherwise "Position unknown". It is a visualization of **language evidence**, not measured body or CQ.

## Test-driven acceptance (must run on actual canonical engine)
1. "I got pissed off" => Anger/self/rank=null/phase=UNKNOWN/direction=UNKNOWN.
2. "I pissed off my father" => causative other-person effect, NOT user anger.
3. "I wasn't pissed off" => negated; hypothetical, quoted, future and corrected claims may not turn into user profile load.
4. "At first annoyed, then furious" => ordered Anger ranks 1 then 6, building, **not** arbitrary 0–10.
5. "I was furious; afterward I was embarrassed" => Anger -> Shame AFTERMATH; **no automatic decreasing**.
6. "I calmed down later" with same episode => DECREASING when explicitly linked.
7. "Afterward I got even angrier" => PAST_REFLECTION + INCREASING, NOT DECOMPRESSING.
8. "My mother got angry; now I see a pattern in myself" => distinguish subjects, self-resemblance candidate, no gene/ancestral causal claim.
9. Corrected user report retracts tentative downstream evidence; consent false returns no active-record graph.
10. Two-family word "horrified" and broad "upset" preserve alternative categories.
11. Intent vs action: "I wanted to shout but paused" => no actual shouting.
12. No speculative numeric CQ/law scores or automatic check-ins during silence.

**Test data authored in user's executive ZIP:** 37 synthetic semantic fixtures, JSON Schema report contract, 63-term/source-page catalog and a package validator. Proposed fuzzy benchmark: precision >=0.90, recall >=0.85 and zero unsafe positive promotion on negation/quoted-other/no-consent fixtures; these are **targets, not measured results**.

## Current as-built / verification
- Canonical engine already has `sniff.js`, `lexicon.js`, `trace.js`, `voice_sniffer.js`, `voice_narrative.js`, `voice_intelligence.js`; draft [PR #163](https://github.com/rebootos-sourcce/MOB/pull/163) remains unmerged.
- Local V6 TULA visual HTML detects "pissed off" and presents a conceptual curve; **26/26 browser cases passed locally**, but it is not the time-ordered story engine, not merged and not deployed.
- The source JSON catalog/37 fixtures/spec/schema were drafted and structurally validated; **no full canonical test coverage or real voice-to-graph trajectory verification yet**.
- Follow actual MOB build sequence and regenerate derived products: `./atuned_src/BUILD-engine.sh`, `./atuned_src/BUILD.sh`, `./funnel/BUILD-single.sh`, `node tests/engine.js` plus new charge-cycle contract suite. Do not mark 100% until approved live mic/idle/correction/privacy + actual graph tests pass.

**Next AI:** Read this TDD -> `docs/SOURCE_VOICE_3_BUILD_HANDSHAKE_2026-11-01.md` -> `docs/SOURCE_VOICE_SIGNAL_VIEW_V5_HANDOFF_2026-11-01.md` -> `SNIFFER_SPEC.md`, and obtain the owner's full 2026-11-01 executive ZIP with reference PDF and test fixtures. Update this TDD/PR index after verified changes.


## Implementation update — V7
**Status: IMPLEMENTED IN DRAFT ENGINE (not merged/deployed).** This supersedes older inline 'proposed' status statements above, which remain as original design history.
- New pure `srcVoiceChargeCycle(finalizedTurns,opts)` at `atuned_src/engine/voice_charge_cycle.js` implements seven 1–9 TULA ladders (63 slots), explicit provisional everyday idioms, subject and grammatical-causative gates, negation, hypothetical, correction provenance, ordered multi-turn story episodes, seven speaking channels, and independently reported phase/direction.
- `atuned_src/MANIFEST` now loads it after `voice_narrative.js` and before `voice_intelligence.js`. Official `engine/export.js` exports function and source terms. `srcVoiceIntelligence` now reads it into `intelligence.emotionCycle`, not into CQ, stored story or an unconsented graph.
- `tests/source-voice-charge-cycle.js` has **25 runtime cases plus 7 structural/privacy gates**, but **CI is queued**, so its running under the whole engine is not certified. Separate local test fixture harness exercised **37/37 owner synthetic semantic scenarios plus 9 privacy/state assertions** with standalone module. Headless browser V7 visual/semantic integration **12/12** passed. A source-status fixture for current text has no consent input; its test instead asserts no graph query or profile write.
- V7's source is `proto/source/source-ai-elemental-charge-v7.html` and is an isolated one-file voice prototype, not integrated into actual production UI. It keeps the same ElevenLabs agent and a local candidate tracker; an optional host reader remains dependent on explicit consent and a production same-origin app.
- Important improvement: V6 attempted to locate the emotional curve point from a rank and time-perspective label; V7 hides this unsupported plotted marker. `calmed down` no longer becomes a false TULA Sadness word `down` inside the updated visual scanner. Owner wants natural **elemental art rather than chakra symbols**; V7 uses abstract elemental motifs, with correspondence labeled provisional pending owner review.
- **OPEN:** run official build, commit derived `engine.js`, `atuned_src/source.html`, funnel generated products; resolve full GitHub CI; wire V7 same-origin voice to authenticated consent-scoped active record & verified graph; real browser/WebRTC/mic, speech transcription and idle tests; measured language precision/recall; owner acceptance, merge and deploy.
- See `docs/SOURCE_VOICE_V7_EXECUTIVE_HANDOFF_2026-11-01.md` for next-agent reading order and known limitations.
