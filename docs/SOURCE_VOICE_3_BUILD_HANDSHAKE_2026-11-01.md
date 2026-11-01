# Source AI: three-build executive integration handshake
**2026-11-01 | MOB draft PR #163 | NO production deployment**

## Purpose
Build Source intelligence in three strictly composed reads, reusing the existing engine. The voice conversation remains working in the isolated ElevenLabs pilot. This is a new read-only engine model; it is not automatically the live voice backend.

## Index: files and owners
| Stage | Path | Contract |
|---|---|---|
| 1: voice to Sniffer | `atuned_src/engine/voice_sniffer.js` | `srcVoiceSniff(text,prior,active)`; canonical `sniffStory` and `srcHear`, never `applyStory` |
| 2: Sniffer to graph | `atuned_src/engine/voice_intelligence.js` | `srcVoiceGraph(text,record,{allowProfile:true})`; actual `traceFromRecord`, record-scoped, consent required |
| 3: graph to intelligence | same file | `srcVoiceIntelligence(text,record,opts)`; canonical `evLedger` plus bounded graph links; no unsupported claims |
| Canonical records lookup | same file | `srcVoiceCanon(kind,query,limit)`; dynamic NODES, SAB33 and CHARGES lookup, not a hardcoded replacement table |
| Engine placement | `atuned_src/MANIFEST` | after Sniffer and evidence; respects actual load order |
| Node export | `atuned_src/engine/export.js` | all four functions available to engine consumers |
| Stage 1 test | `tests/voice-sniffer.js` | existing contract |
| Three-build test | `tests/source-voice-intelligence.js` | consent, deterministic response, record redaction, no writes, negation, actual canon inventory |

## Critical source-of-truth clarification
MOB already has a real typed, record-derived trace graph in `atuned_src/engine/trace.js` (including `traceFromRecord`, `tracePath` and `traceNeighbors`). Treat older documents saying the graph does not exist as outdated. A graph existing **inside the app** is not the same as voice access to it.

## Required invariants
1. No text input: UNREAD. No record passed: NO_RECORD. No consent: CONSENT_REQUIRED. No automatic lookup of all profiles.
2. A known `NODES` membership relationship is a catalog fact, **not** proof of a pattern in a person. Only story->pattern supports edges can relate to that record. Preserve inferred vs user_confirmed provenance.
3. Source receives no record ID, profile name or historical raw story in the report. Only current-turn evidence and limited, non-identifying derived counts.
4. Neither a word nor an address proves ancestral inheritance, genetic cause or diagnosis. Ancestry remains NOT_ASSESSED until a separate verified lineage evidence model exists.
5. CQ and 21-law 10/10 remain NOT_MEASURED. Distinguish law keyword mentions from measured integrity.
6. Graph reads should never mutate profiles, the global loaded record, or the Release Engine. Do not call `applyStory`, `traceApply`, `loadProfile` or `read(...,{write:true})` from voice.
7. Silence causes no response. The one session greeting remains; further questions follow new user speech only.

## Verification / blockers
- GitHub commits for staged code and tests are in draft PR #163.
- Real CI has been enqueued on the branch; passing independent source-build and browser tests is not yet evidenced.
- Prior PR run #41275647534 failed the **committed product freshness** gate: `engine.js`, `source.html` and `funnel/dist/atuned-quiz.html` did not match their freshly built source. The existing PR was already failing before the new stage 2/3 files.
- Official repo procedure requires building with `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh`, running `node tests/engine.js` and `node tests/voice-sniffer.js && node tests/source-voice-intelligence.js`, and committing generated products together. No remote interactive shell or complete private repository checkout was available from this ChatGPT runtime.
- User's standalone Source HTML still returns local lexical signals unless and until a **real hosted/on-device engine consumer** invokes the new functions. Never say it is now fully using record graph.
- The 112 addresses and 33 saboteurs are currently indexed through the dynamic record lookup; other canonical record families (complexes, hypercomplexes, celestial, expanded ancestral/nerve records, etc.) need verified indexing. Not all records are yet connected.
- The graph lookup only considers the explicitly supplied active record; **all-user-record access is neither present nor authorized**.

## Next-AI owner instructions
1. Read this file and PR #163 first, then `HANDSHAKE-sniffer.md`, `reviews/SPEC-source-ai.md`, `SNIFFER_SPEC.md`, `TDD-sniffer.md`.
2. Run actual engine tests and fix failures, regenerate committed products using canonical build scripts. Do not manually edit generated products.
3. Implement an explicit-consent browser clientTool consumer inside the production same-origin ATUNED app, returning `srcVoiceIntelligence` results without sensitive profile data. Keep existing standalone voice pilot separate until verified.
4. Extend canonical indexed record read to all approved graph registries and lineage evidence only when those registries have identity/provenance contracts.
5. Run real speech / turn silence / negation / correction / multi-session ancestor tests. Close PR only after checks pass and owner approval.

This handoff is an honest integration status, not a claim of 100% completion.
