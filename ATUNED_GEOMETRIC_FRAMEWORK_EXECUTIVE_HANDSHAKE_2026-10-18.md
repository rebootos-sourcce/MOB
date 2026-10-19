# ATUNED Geometric Framework — Executive Handshake
**Date:** 2026-10-18  
**Project branch:** `project/atuned-geometric-framework`  
**Repository:** `rebootos-sourcce/MOB`  
**Status:** Framework build in progress; not release-ready  
**Primary objective:** Establish a complete, machine-readable, traceable geometric model from Fetters through Saboteurs and the requested Complex, Hypercomplex, and Supercomplex levels. Templates, mappings, uncertainty, and traversal are the deliverable. Simulation is validation infrastructure, not a substitute for the framework.

## 1. Executive directive

Build the framework vertically, one layer boundary at a time. Every canonical entity gets the same shared description template. Every relationship is an explicit record with a status and provenance. Build all supported structure now; mark unsupported or disputed structure as unresolved and continue around it. Do not invent rosters or mappings to make the graph look complete.

The separate engine-building software owns engine generation, engine integration, and generated products such as `engine.js`, `source.html`, and packed HTML. This project must not spend effort repairing or regenerating those artifacts. Its responsibility is to give that software a correct, tested, implementation-ready framework and an explicit list of unresolved source decisions.

## 2. What success means

The framework is complete when:
1. Every canonical entity in every agreed layer has a stable ID and the shared description template.
2. Every known parent-child relationship is recorded with type, status, provenance, rationale, and uncertainty.
3. Every missing, ambiguous, conflicting, or unsupported entity/edge appears in a machine-readable gap register with a stable ID, severity, consequence, required evidence/action, and acceptance test.
4. A selection at any layer can return its known descendants, the path to base fetter inputs, provenance, and unresolved boundaries.
5. Starting from a lower-level entity can trace supported ancestors upward without turning hypotheses into canonical facts.
6. Opposite/coherent behavior is traced from the authoritative pole definitions, not guessed from a label.
7. Tests verify template parity, graph integrity, mapping coverage, gap visibility, no-fabrication rules, traversal, and inverse traversal.
8. Reports clearly distinguish structural completeness, synthetic regression performance, source coverage, and empirically validated accuracy.
9. The handoff to engine software documents stable IDs, schemas, relationship statuses, APIs/exports, open decisions, and integration acceptance criteria.

A passing simulator alone never proves framework completion.

## 3. Shared description template — mandatory at every layer

Each entity must use the same field names and shape. Layer-specific extensions are allowed; dropping shared fields or forking a different template is not.

1. **Identity:** stable ID, canonical name, aliases, layer, authoritative source/version.
2. **Plain-language story:** trigger/situation → internal signal → action/strategy → immediate payoff → longer-term cost. Context-sensitive, non-diagnostic, non-accusatory.
3. **What becomes available:** coherent/replacement state derived from authoritative opposite-pole definitions and mapped children; otherwise explicitly unresolved.
4. **Next move:** one concrete noticing/separating/choosing move consistent with the story.
5. **Mechanism / formation:** sourced explanation, or `unknown` / `not_yet_sourced`.
6. **Inputs / composition:** typed child IDs, contribution roles, bands or composition rules.
7. **Outputs / parent links:** candidate parents, status, evidence, and rationale.
8. **Evidence and uncertainty:** source references, excerpts/sections, observation IDs where relevant, confidence method, contradictions, unresolved questions.
9. **Distinction and overlap:** nearest neighbors, shared inputs, collision/tie status, distinguishing information required.
10. **Gap state:** complete / partial / blocked / unresolved; missing fields and next action.
11. **Interpretation guardrails:** no diagnosis, no identity labeling, no claims about hidden intent, no person scoring.
12. **Acceptance checks:** machine-checkable requirements for the record.

If a field does not apply, include an explicit `not_applicable` and reason. Never silently omit it.

## 4. Layer-by-layer work contract

### Layer 1 — Fetters → Saboteurs
- Canonical roster: 9 axes and 33 Saboteurs.
- Preserve independent 0–10 shadow and coherent readings for every axis; never collapse them into one signed number.
- Surprise does not score Saboteurs.
- Preserve the canonical bands and ramp/taper firing rule; band edges are not cliffs.
- Validate all 33 story templates, aliases, input axes, band bounds, and input coverage.
- Enumerate all 528 unique Saboteur pairs; report shared axes, overlap widths, partial overlap, ties, and exact-signature equality separately.
- Run deterministic midpoint, near-boundary, outside-band, missing-input, and perturbation fixtures.
- Keep behavioral evidence ranking separate from charge compatibility until evidence is independently labeled and calibration justified.
- Report gaps per Saboteur; do not claim empirical accuracy from synthetic fixtures.

### Layer 2 — Saboteurs → Complexes
- First reconcile the canonical Complex roster and terminology with authoritative sources.
- Do not infer canonical membership from score similarity.
- Apply the shared 12-field template to each canonical Complex.
- Record each required contributing Saboteur, role, relationship status, and provenance.
- Identify missing, ambiguous, contradictory, redundant, and over-broad edges.
- Simulate each supported composition and leave-one-child-out alternatives.
- Keep entities blocked where canonical definition or membership is not established.

### Layer 3 — Complexes → Hypercomplexes
- Verify the canonical roster and composition rules before populating membership.
- Use the shared template and mapping contract.
- Record child contributions, required/optional status only if the source defines it, competing mappings, and gaps.
- Test removal/perturbation of children and trace each Hypercomplex through Complexes and Saboteurs to fetter inputs.

### Layer 4 — Hypercomplexes → Supercomplexes
- Verify the canonical Supercomplex roster and composition rules before creating canonical nodes.
- Apply the same template, evidence and mapping rules.
- Record contributing Hypercomplexes, overlap, missing ancestry, and deterministic fixtures.
- Keep the top-level roster explicitly unresolved if the authoritative source cannot be found.

### Bidirectional traversal
- Top-down: selected entity → known children → all supported descendants → fetter axes and bands, with source and unresolved boundaries shown at every step.
- Bottom-up: selected fetter/Saboteur → reachable supported parents, with edge status and provenance preserved.
- Opposite behavior: trace from canonical shadow poles to their named coherent poles; do not invent a psychological opposite when the canonical mapping is missing.
- Unknown edges must be returned as blockers/gaps, not silently skipped.

## 5. Canonical-source conflict — P0 decision, not permission to guess

`proto/sniffer/SNIFFER_SPEC.md` currently defines the sequence as bias → fetter → Saboteur → Complex → hyper-complex, with mask as output; it also treats archetypes as always-running context rather than a releasable hierarchy rung. The current `hierarchy-graph.js` has six hyper-complex modes and source-supported archetype-context links, but no canonical Complex roster/membership or Supercomplex roster/composition. The project request requires a five-level geometric hierarchy: Fetters → Saboteurs → Complexes → Hypercomplexes → Supercomplexes.

These descriptions are not yet reconciled into one authoritative canonical model. Preserve the user-requested five-level target in the framework contract, while marking missing canonical rosters and edges unresolved. Do not relabel archetypes as Complexes, do not invent a Supercomplex roster, and do not treat the six listed hyper-complex modes as proof of complete membership. The resolution task is to locate and compare authoritative sources (canon/ENGINE/review data/book/library) and record the decision with provenance.

## 6. Relationship schema

Every edge is a first-class record:
- `from_id`, `from_layer`, `to_id`, `to_layer`
- `relationship_type` (for example: `contributes_to`, `contains`, `replacement_for`, `overlaps_with`, `frames`)
- `status`: `canonical`, `source_supported`, `hypothesis`, `unresolved`, or `rejected`
- `evidence_refs[]`, `rationale`, `confidence`, `known_counterevidence[]`
- `simulation_fixture_ids[]`, expected/observed behavior where applicable, and `gap_ids[]`

Never promote a hypothesis to canonical because it improves a simulation result.

## 7. Gap severity

- **P0:** missing/contradictory canonical roster or source, invalid mapping, required template field absent, or untraceable relationship blocking the next layer.
- **P1:** material ambiguity/collision, missing evidence, or simulation gap limiting discrimination.
- **P2:** maintainability or presentation issue that does not invalidate the mapping.

Every gap record needs: stable ID, affected entity/edge, source/evidence, status, consequence, required action/evidence, and an acceptance test.

## 8. Current verified snapshot at handoff

Based on the inspected repository files and existing contract:
- 9 fetter axes are defined.
- 33 canonical Saboteurs are present in the band table.
- 70 fetter-to-Saboteur band relationships are encoded in the canonical band table.
- 528 unique Saboteur pairs are possible; the existing contract reports 271 pairs with at least one shared interval and no exact duplicate full signatures.
- Existing synthetic baseline reports 31/33 intended targets ranked first and 33/33 in the top three. These are synthetic regression results, not empirical accuracy.
- Story-template test checks 33 story records and fields `h`, `a`, `n`, and reflection.
- Contract tests have been extended to validate canonical axis names, 0–10 band bounds, no Surprise scoring, and story-to-band mapping.
- A hierarchy-gap contract test has been added and wired into the evaluator workflow.
- Latest relevant PR #122 is open and draft. The latest code commit known at the start of this project branch is `0fe5d9ac2abf6f9d2a1310cec9d510d2678e1e6b`; latest CI for the relevant changes has not been confirmed passing.
- Complex membership, the full Hypercomplex composition graph, and the Supercomplex roster/composition remain unresolved.
- Engine/generated-artifact repair is explicitly out of scope.
- Behavioral indicators and empirical classification accuracy are not yet independently validated.

Do not treat these repository-reported metrics as freshly rerun results. Re-run the test suite and report exact commit/run IDs before upgrading their status.

## 9. Execution sequence — do work, do not merely restate plan

1. Run/inspect CI for the current commit. Fix failures in the framework tests and rerun.
2. Inspect all 33 story records against the 12-field template contract; generate a machine-readable per-entity coverage report.
3. Generate the per-Saboteur input/band and collision report from the canonical table; fix invalid records only when source evidence authorizes the fix.
4. Resolve Control Freak/Hyper-Vigilant overlap and Avoider weighting only against the canonical scoring specification; do not silently tune weights.
5. Audit coherent opposites against authoritative pole definitions and expose missing links.
6. Locate authoritative Complex, Hypercomplex, and Supercomplex sources. Record every conflict and make only source-backed canonical changes.
7. Populate higher-level entities and edges where supported; keep unresolved placeholders for the rest.
8. Run top-down and bottom-up trace fixtures across every layer, including tests that prove unknown boundaries remain visible.
9. Run all framework regression tests, compare expected and actual outputs, fix failures recursively.
10. Produce final coverage/gap reports and a versioned implementation handoff for the separate engine software.

At each iteration, report only: committed changes, tests actually run, CI status actually observed, remaining P0/P1 gaps, and the next concrete action. Do not repeat a roadmap without executing the next item.

## 10. Acceptance gates

- **Gate A — Saboteur template:** 33/33 records satisfy the shared fields; no missing/duplicate canonical IDs; all gaps reported.
- **Gate B — Fetter mapping:** 33/33 have valid canonical inputs or explicitly blocked status; all 528 pairs analyzed; overlap/tie report reproducible.
- **Gate C — Coherent/opposite path:** every supported fetter has a canonical opposite pole; unresolved poles remain explicit; end-to-end ancestry tests pass.
- **Gate D — Complex layer:** authoritative roster reconciled; every entity templated; every child edge mapped or unresolved with source.
- **Gate E — Hypercomplex layer:** canonical roster and membership rules reconciled; complete trace through Complex/Saboteur/Fetter ancestry where supported.
- **Gate F — Supercomplex layer:** canonical roster/composition reconciled; top-down and bottom-up traceability proven.
- **Gate G — Full framework:** all framework tests pass at the same commit; no silent gaps; final gap register and engine handoff published.

A gate is not passed until its evidence is recorded.

## 11. Engine-software handoff contract

The separate software should consume:
- stable IDs and canonical labels/aliases;
- entity records using the shared schema;
- relationship records with status/provenance;
- canonical fetter axes and separate shadow/coherent values;
- bands, firing/taper rules, and explicit collision metadata;
- coherent replacement-pole mappings;
- gap register and unresolved statuses;
- deterministic fixtures and acceptance expectations;
- version/commit metadata.

It must not infer missing membership, convert hypotheses into canonical mappings, collapse shadow/coherent readings, score Surprise toward a Saboteur, or present a clinical translation as diagnosis. Generated artifacts are its responsibility.

## 12. Start instruction for the next work session

Start from this branch and this document. First inspect current GitHub Actions for the latest commit and run the framework tests. Then finish Gate A and Gate B with a machine-readable coverage report and per-Saboteur gap list. Do not stop at describing the work. Do not work on generated engine artifacts. Do not move to a new speculative simulation until the shared framework contracts and canonical mapping gaps are exposed.

## Measurements and ratings
- Canonical roster counts currently established: 9 fetter axes; 33 Saboteurs.
- Encoded fetter-to-Saboteur band relationships: 70.
- Pairwise Saboteur combinations: 528.
- Reported overlapping pairs: 271/528.
- Reported synthetic target rank: 31/33 first; 33/33 top three.
- Latest test/CI status: pending confirmation.
- Higher-level structural completion: unverified.
- Empirical classification accuracy: unknown.
- Confidence in the build strategy: 0.97; confidence in full framework completion: not applicable until gates pass.
