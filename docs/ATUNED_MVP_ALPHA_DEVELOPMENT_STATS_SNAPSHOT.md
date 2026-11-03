# ATÜNED MVP Alpha, Development Statistics Snapshot
Snapshot: 2026-10-22 (CQ formula source audit; canonical Intention mismatch found)
Scope: Priority-1 CQ / Coherence formula integration, including downstream projections and the connected signal architecture
Baseline type: Updated after P0 contract closure; first comparable runtime snapshot remains unavailable, so no build delta is claimed.

## Headline
| Measure | Current value | Basis |
|---|---:|---|
| Runtime acceptance criteria verified complete | 0% | No successful runtime evidence is verified. The latest inspectable GitHub Actions deploy run remains queued on an earlier candidate; the current head has no returned status check. |
| Runtime acceptance criteria remaining or unverified | 100% | All runtime integration and regression criteria remain open until source implementation is tested. |
| P0 canonical architecture/ownership contract | 100% | Canonical definitions, target owners, cardinality, provenance, CQ-version policy, and runtime-gap transfer are recorded in the v1.1 owner audit. This is contract completion, not runtime completion. |
| Build delta | N/A | First comparable snapshot; no previous evidence-backed baseline. |

## Block-by-block progress
Implementation percentages below describe code and integration present on the branch, not verified runtime behavior. Verification remains separately tracked in the headline until tests execute.

| Block | Implemented (verification pending where noted) | Remaining implementation | Status and evidence |
|---|---:|---:|---|
| P0, Canonical engine contract and owner map | 100% | 0% | Complete as architecture/ownership contract. Qualium is the Vritti→fetter interpretation orientation; tone belongs to canonical nerve-address node/seat owner; CQ equation version policy and metric isolation are fixed. Runtime source wiring is P1, not a P0 blocker. See ATUNED_MVP_ALPHA_CANONICAL_RECORD_OWNER_AUDIT_v1.md v1.1. |
| P1-A, Source/tone owner seam | 100% implemented / unverified | 0% implementation remaining | `FLOWSEAT`/`seatHz` located in `engine/data/practice.js`; existing consumers in `ui/release.js` and `ui/map.js`; derived address tone reference wired in `engine/trace.js`. Test execution remains unverified. |
| P1-B, Trace relationship seam | 100% implemented / unverified | 0% implementation remaining | Derived story→impression→fetter and canonical address→fetter association are wired; `loopRead` exposes source-backed markers with raw story text, candidate provenance, address/nerve and configured FLOWSEAT tone reference. No `p.vritti[]`; tests authored but not executed. |
| P1-C, Regression/contract closure | 100% implemented; execution deferred | 0% implementation remaining | Added deterministic/idempotent derivation, profile validation round-trip, legacy profile without trace, strict rejection of uncontracted qualium fields, confirmed-address versus inferred-fetter provenance, metric isolation, and UI contract assertions. Commands have not been executed by instruction. |
| P2, Trace graph/marker integration | 100% implemented; execution deferred | 0% implementation remaining | Existing pattern row now exposes source-backed story text, inferred/candidate status, canonical nerve address and nerve label, configured FLOWSEAT seat-tone reference, and explicit unrecorded qualium dimension. Marker is derived; no duplicate Vritti collection or metric writes. Structured sensory/emotional capture is split into a separate follow-on block, not counted as marker integration. |
| P3, CQ/DQ/SQ calculation integration | Arithmetic wired; framework mapping blocked | Not complete | `compute.js` has model-3 arithmetic and consumers/history wiring, but it uses band-derived `It` as Intention. Canonical `docs/briefs/cq-unified.md` / `DECISIONS.md` define Intention as action-linked said-versus-did follow-through (`intentionRead`, 7-day window). These are not equivalent. Owner decision required before claiming framework-correct CQ. See `ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md`. |
| P4, Release/intervention loop | 0% | 100% | Release hit-feedback requirements are documented elsewhere; no new implementation or tests completed in this pass. |
| P5, End-to-end verification | 0% verified | 100% unverified | Candidate GitHub Actions deploy/gate runs are still queued; no completed test result is available at this snapshot. Local build/test execution is unavailable in this environment; no pass is claimed. |
| P6, Final integration and handoff | 0% | 100% | Cannot close until runtime implementation and verification evidence exist. |

## Implemented versus verified
- Implemented in this pass: CQ model 3 formula wiring in `compute.js`; returned formula inputs; revised CQ regression expectations and added explicit formula contract assertions; added `ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md`.
- Verified by source inspection: story text and onboarding metadata live under p.story.entries; address/nerve identity is sourced from NODES; trace is strict and stored through p.trace; the current source does not establish that NODES[].d or OUTWARD/INWARD is qualium.
- Not verified: runtime signal → fetter → qualium → node/tone traversal, marker rendering, persistence round trip for new links, metric isolation, release-feedback integration, build/tests.
- Test status: passed 0 confirmed; failed 0 confirmed; blocked/not run: documented build, engine, and release-chain tests. “0 passed” means no run evidence is available, not that tests failed.

## Open gaps
1. Structured sensory and emotional input capture at the existing source/imprint owner remains a separate follow-on; current story text is preserved as raw source and is not misrepresented as a fully structured waveform.
2. A domain-approved qualium orientation vocabulary is not invented. The current contract exposes qualium as an explicit, unrecorded orientation-of-distortion dimension until its canonical owner and values are approved.
3. CQ arithmetic and downstream wiring exist, but canonical Intention mapping is unresolved. Do not proceed to other work or mark CQ complete until the formula's Intention source and missing-data behavior are settled, then update tests and run acceptance.
4. Build and test execution remains deferred by instruction; run ./atuned_src/BUILD-engine.sh, node tests/engine.js, node tests/trace.js, and the documented release-chain command before claiming runtime verification.

## Next recursive execution target
Priority 1 is CQ formula model 3. Source wiring, formula-consistent range/ceiling projections, and regression assertions are committed. Candidate CI/gate runs remain queued; inspect the first completed run, repair every failure recursively, then run engine, trace, and release-chain acceptance. Do not advance structured sensory/emotional capture or release feedback ahead of CQ acceptance.

## Audit rule
Do not upgrade a percentage because a document was written or a commit exists. Mark criteria complete only when the defined source/behavior criteria and applicable verification evidence are satisfied. Update this file after every subsequent build/pass and preserve the previous snapshot for delta calculation.