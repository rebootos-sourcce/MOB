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

## Recursion pass: November 1 narrative and canonical catalog expansion

- Added `atuned_src/engine/voice_narrative.js` and `tests/source-voice-narrative.js`; loaded in MANIFEST before intelligence, exported from `engine/export.js`.
- `srcVoiceNarrative(turns)` treats speakers as separate subjects, distinguishes reported family observations from self-recognition, lets later explicit rejections override earlier proposals, refuses hypothetical/uncertain statements as confirmed resemblance, and reports multigenerational *similarity* only when parent and older generation are explicitly attributed the same descriptor.
- `srcVoiceIntelligence(text,record,{turns,allowProfile})` composes this narrative with `evLedger` and the record graph without writing records or assuming ancestral cause.
- Corrected evidence count from nonexistent `claim.refs` to the authoritative `claim.ev` field in the canonical ledger.
- Extended `srcVoiceCanon` from three to nine direct canonical arrays: NODES, SAB33, CHARGES, SI, EXPR, ARCH, DOMAINS, MASKS, BANDS. No invented user identity relationship, and this is *not* the whole MOB or Mechanics of Being record inventory.
- Added regression assertions to engine tests for narrative, corrections, negation, consent, and nine registry inventories.
- Direct V8 evaluation of the **committed** `srcVoiceNarrative` logic: 15/15 base cases plus 5 uncertainty/hypothetical checks passed. Stubbed engine integration contract including graph consent and catalog lookup also passed, but **does not substitute for running the actual engine bundle**.
- Downloadable isolated `SOURCE_AI_NARRATIVE_V4.html`: retained existing V2 working ElevenLabs agent and one-button UI; optional same-origin `srcVoiceIntelligence` hook is invoked only when the hosting application provides it. Access to profile records requires both `ATUNED_SOURCE_VOICE_CONTEXT.allowProfile===true` and `.userConsent===true`; standalone file never loads a user record. Local Chromium mock integration: 14/14 page/consent tests, 6/6 simulated start/transcript/tool/context/stop tests passed.
- PR #163 is still DRAFT, UNMERGED; all recent CI runs are QUEUED. Prior generated-product freshness failure persists until a full repository build. No honest claim of live production canonical graph, all records, or CQDQ calibration.
- Important: the uploaded V4 HTML is not magically able to import a private production engine from `file://`. Until the host wires the exact exported function, its browser tool is a provisional narrative reader.

### Follow-on before merging
1. Rebuild generated products via repo scripts in an authorized full checkout; commit source.html, engine.js and funnel/packed dependencies as one coherent update.
2. Run new narrative and three-build tests with actual canonical engine; fix observed failures, not guessed ones.
3. Integrate a consent-aware same-origin browser host into the deployed voice page. Test with real spoken user turns, inactivity, explicit corrections and transcript provenance, using synthetic examples in permanent reports.
4. Expand the remaining graph/canonical family indexes under source-of-truth registry contracts. Implement independent lineage and CQDQ verification; do not assign 10/10 law scores without evaluation.
