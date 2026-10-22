# ATÜNED MVP Alpha — Recursive Execution Contract (Superseding Clarification)
Version: 1.0
Date: 2026-10-21
Status: Active recursive execution plan; source implementation and runtime verification are not claimed by this document.

## Authority and supersession
This document governs execution of the Vritti and release-hit-feedback work in MVP Alpha. Read it with:
- `docs/ATUNED_VRITTI_NERVE_SIGNAL_FETTER_MARKER_TDD_v1.md`
- `docs/ATUNED_CQ_DQ_SQ_RELEASE_HIT_FEEDBACK_ADDENDUM_v1.md`
- the canonical profile schema, trace graph, release UI, engine tests, and release-chain tests.

Where older documents conflict with the owner's latest definitions below, the latest owner definitions in the addendum govern. In particular, the older `ATUNED_RECURSIVE_DRIVER_INTEGRATION_EXECUTION_CONTRACT_v1.md` says CQ and Coherence are separate and that CQ is unknown until all laws are measured. Those statements are superseded for this workstream: **CQ is Coherence**, and partial CQ builds from zero as laws are answered, with unanswered laws contributing zero. Completeness gates definitive tier eligibility, not whether a partial value exists. Do not silently rewrite historical records or create a second calculator; record the formula/version lineage and test migration behavior.

## Canonical owner definitions
- CQ = Coherence.
- DQ = Resistance / total shadow, using the existing canonical implementation unless a versioned change is approved.
- SQ = sum of individual fetter/node weights.
- Fetter = the name/type of an individual node; its weight contributes to SQ.
- Vritti (V-R-I-T-T-I) = total waveform of sensory input plus emotional input. Existing story/source records hold raw language and some onboarding context, but source audit has not established that the complete sensory-emotional waveform is already persisted.
- Qualium = orientation of distortion. It is distinct from Vritti waveform, fetter identity, node-table distortion descriptor (`NODES[].d`), inward/outward charge groupings, and tone/frequency unless an explicit domain mapping establishes a relationship.
- Vritti and fetter remain separate entities. Their association has provenance and status. A marker is a derived navigation/status affordance, not a score or causal claim.
- Release execution is not hit confirmation. Only an explicit user-confirmed hit contributes to the confirmed-hit set.
- Never infer DQ = 100 - CQ. Never let Vritti markers, presentation, holding, rejection, or release execution silently change CQ, DQ, SQ, node weight, or stored-charge estimates.

## Recursive execution protocol
Each block is executed in dependency order. After every block:
1. Review A: semantic/architectural connections and canonical ownership.
2. Review B: adversarial paths, failure modes, idempotency, migration, and regressions.
3. Add newly discovered dependencies to the same block or a follow-on sub-block.
4. Continue recursively until every acceptance criterion is either verified or explicitly blocked with evidence.
5. Never label a criterion complete because a document was written or code was committed. A code criterion requires source inspection and test/build evidence.
6. Append a Development Statistics Snapshot after every build/pass: overall verified completion and remaining percentage; P0–P6 completion; implemented versus verified work; passed/failed/blocked/not-run tests; open gaps; change since the previous evidence-backed snapshot; and the next target. Percentages must be computed from explicit acceptance criteria, never inferred from commits or document count.
7. A separate Development Metrics & Verification Auditor responsibility reviews the snapshot each turn. It must flag unsupported completion claims and must not invent test results or percentages.

## Block 1 — P0 canonical contract and owner map (COMPLETE)
P0 exit decisions are recorded in `docs/ATUNED_MVP_ALPHA_CANONICAL_RECORD_OWNER_AUDIT_v1.md` v1.1. P0 is complete as an architecture/ownership contract, not as runtime implementation. The canonical choices are: Vritti is the linked total sensory-emotional signal, not a new `p.vritti[]` store; fetter is the limiting-belief pattern; qualium is an orientation attribute of the Vritti→fetter interpretation/association; tone is owned/referenced by the canonical nerve-address node/seat owner; associations are provenance-bearing and not causation; the existing 21-law CQ remains the sole operational calculator until a versioned reconciliation of `CQ = (Integrity × Intention) / Resistance` defines units, normalization and zero-resistance behavior. Runtime mapping of `FLOWSEAT` and trace schema changes are P1 implementation tasks, not open P0 semantic decisions.

### P0 exit gate
- [x] Definitions, current owners, target owners, cardinality, provenance, metric isolation and CQ version policy documented.
- [x] Runtime gaps moved into P1/P2 acceptance criteria.
- [x] No standalone Vritti collection.

## Block 1 — Baseline and authority reconciliation
### Work
- Inventory canonical schema, persistence boundary, trace graph, release queue/session owner, UI rendering owner, tests, build scripts, and CI.
- Identify contradictory definitions and select the current owner-approved contract.
- Keep the old contract intact as historical record; this document supersedes conflicting statements for this implementation.
### Review A
- Is there one persistence owner and one queue owner?
- Are profile boundary whitelists and graph type allowlists accounted for?
- Are metric terms and historical versions distinguished?
### Review B
- Could old records lose new fields on load/save?
- Is qualium incorrectly aliased to a node distortion label, inward/outward charge grouping, or tone/frequency?
- Could the UI show a marker unsupported by persisted association state?
- Could a release be counted as a hit without explicit confirmation?
### Exit evidence
Repository paths, source contracts, dependency map, and contradiction list.

## Block 2 — P1/P2 record, trace and marker wiring (NEXT)
### Work
- Map the existing source/imprint, fetter/pattern, nerve-address node, tone, qualium semantics, and trace owners before changing storage. See `docs/ATUNED_MVP_ALPHA_CANONICAL_RECORD_OWNER_AUDIT_v1.md`. Do not add a standalone top-level Vritti collection by default; Vritti is the total waveform connecting existing owners.
- Preserve raw sensory and emotional source inputs, context, time, provenance, confidence, and waveform representation/method at their canonical owner. Existing story text/onboarding fields must not be overstated as a complete waveform record. Do not invent physiological units.
- Define qualium's allowed orientation vocabulary and canonical owner before creating a field or graph node. Do not assume `NODES[].d` or `OUTWARD`/`INWARD` is equivalent.
- Connect waveform/source evidence to the canonical fetter and the fetter to the canonical nerve-address node/tone through the existing trace model. Use references, not duplicated entities.
- Keep candidate, confirmed, and rejected association states distinct. Rejection changes active association state, not the historical Vritti record.
- Integrate association references with the existing trace allowlist/schema only after validating the allowed node/edge rules.
- Render a derived fetter marker with distinct candidate/confirmed states and navigation to the associated record(s). A missing link must be visible and must not auto-reassign.
### Review A
- Are raw report, normalized interpretation, confidence, and provenance separately preserved?
- Can associations be corrected without rewriting the original observation?
- Is the marker derived rather than stored as a second truth?
### Review B
- Test multiple Vrittis per fetter and multiple fetters per Vritti.
- Test missing links, duplicate events, reload, export/import, rejected associations, and old profiles.
- Assert no change to CQ/DQ/SQ/node weights/hit counts from Vritti/marker operations alone.
### Exit evidence
Canonical owner map, trace validation, UI path, migration coverage, and passing tests.

## Block 3 — Release hit-feedback state machine
### Work
- Add optional voice feedback to existing release session configuration; voice off retains the current flow.
- Use the same command handler for speech and visible controls.
- Maintain distinct states: presented, held, explicit hit, rejected from active queue, release executed.
- Use contextual commands that distinguish executing a release from confirming a hit. Low-confidence/ambiguous input causes no mutation and asks for clarification.
- Record append-only decision events with unique event ID, pattern/session IDs, timestamp, modality, raw/normalized command, confidence when available, and before/after state.
- Make replay idempotent. Removing from active pile preserves historical evidence; no permanent erasure by default.
- Accumulate only explicit user-confirmed hits. Do not let a hit feedback event silently alter CQ/DQ/SQ/stored charge.
### Review A
- Does the existing release queue remain the only queue owner?
- Are UI and voice commands semantically identical?
- Is a session's execution status separate from hit judgment?
### Review B
- Test duplicate delivery, stale session, missing pattern, ambiguous speech, low confidence, queue reload, voice-off behavior, rejection/reversal policy, and storage failure.
- Verify a failed persistence write is reported and not represented as saved.
### Exit evidence
Durable event/state code, visible controls, voice integration, and release-chain tests.

## Block 4 — Metric and recursive-loop integrity
### Work
- Reconcile CQ/DQ/SQ names at engine, schema, snapshot/history, UI, and export boundaries.
- Preserve the current 21-law partial CQ behavior and completeness gate.
- Preserve the existing release-lift implementation; do not duplicate lift in Vritti, hit feedback, trace, or UI.
- Verify the loop: Journal/SOURCE → Imprint → Pattern → Release → Reframe → Ritual/Practice → Evidence → Trace Graph → next discovery.
- Keep observed activation, stored-charge estimate, and durable baseline separate.
- Keep inferred, observed, proposed, and user-confirmed relationships distinct.
### Review A
- Are metrics derived once and surfaced consistently?
- Are event feedback and trace edges kept separate from numeric score calculations?
- Does outcome evidence return to the correct owner?
### Review B
- Test monotonicity and bounds, partial law coverage, repeated release, failed writes, and no double counting.
### Exit evidence
Metric contract tests, trace/loop tests, and consistent documentation.

## Block 5 — MVP Alpha build, regression, and snapshot
### Work
- Run `./atuned_src/BUILD-engine.sh`.
- Run `node tests/engine.js`.
- Run `env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=$PW_DIR node tests/releasechain.js` in the supported environment.
- Inspect the actual CI run/checks for the candidate commit. A workflow rerun is not proof of success unless its result is fetched.
- Update TDDs and execution documentation to match the code, not the reverse.
- Produce KPI table with status, evidence link, gap, owner/dependency, and next action.
### Review A
- Do source paths and acceptance tests cover each user-visible claim?
- Are required data migrations backward-compatible?
### Review B
- Are tests actually run against the candidate revision?
- Are any failures skipped, swallowed, or misreported?
- Are unverified items explicitly marked blocked/incomplete?
### Exit evidence
Build/test/CI evidence and final Alpha snapshot with no invented scores.

## KPI acceptance ledger
| KPI | Acceptance criterion | Status at contract creation |
|---|---|---|
| CQ/Coherence naming | One canonical name/metric, partial CQ behavior preserved | Contract clarified; runtime cross-surface audit pending |
| DQ/Resistance | Canonical meaning retained; no CQ complement assumption | Contract clarified; runtime cross-surface audit pending |
| SQ/fetter weights | SQ is sum of individual node weights; no marker side effects | Contract clarified; regression proof pending |
| Vritti signal ownership | Existing source/imprint record owns raw sensory/emotional inputs and waveform reference; no parallel collection | Owner map pending |
| Vritti–fetter–node links | Typed relationships preserve provenance and navigate across existing owners | Derived story→impression→fetter and address→fetter links implemented; tests added, not executed; marker navigation remains open |
| Fetter marker | Derived state opens correct Vritti record(s) | Not implemented/verified |
| Release hit feedback | Explicit hit only; hold/reject/execute distinct | Not implemented/verified |
| Voice safety | Low-confidence command causes no state change | Not implemented/verified |
| Event idempotency | Replay cannot double-count hit/association events | Not implemented/verified |
| Recursive loop | Evidence and outcomes reconnect without double counting | Audit/verification pending |
| Build and engine tests | Real candidate revision passes documented commands | Not run; candidate deploy workflow queued, not test evidence |
| Release-chain browser tests | Real candidate revision passes documented browser tests | Not run in this session |

## Current boundary
This contract is a superseding execution plan and KPI ledger. P0 is complete as the canonical architecture/ownership contract. Qualium is defined as the orientation attribute of the Vritti→fetter interpretation/association; tone belongs to the canonical nerve-address node/seat owner. Derived story→impression→fetter and address→fetter trace wiring is implemented, preserving the legacy story→address edge. P1-C regression/contract coverage and P2 trace/marker source integration are implemented on the branch. Structured sensory/emotional capture, a domain-approved qualium value vocabulary, release hit feedback, and test execution remain follow-on work; round-trip/idempotency assertions are now authored but not executed. The earlier draft's standalone Vritti collection change was reverted after owner clarification. It does not claim production three-layer wiring, marker rendering, voice hit feedback, or test execution. Each such item becomes complete only when implementation and verification evidence are linked.
