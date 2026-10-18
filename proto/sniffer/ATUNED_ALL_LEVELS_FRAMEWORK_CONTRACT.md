# ATUNED Framework Completion Contract — All Hierarchy Levels
Date: 2026-10-18
Status: Framework contract and gap register; not a claim that every level is populated.
Scope: Canonical descriptions, explicit mappings, simulations, gap reporting, and traceable progression from fetters through supercomplexes. Engine-generated outputs are downstream and out of scope.

## Executive rule

**Do not call a level complete because its simulator passes.** A level is complete only when every canonical entity has a description using the shared template, every parent/child relationship is explicitly mapped or marked unresolved, mapping coverage and gaps are reported, and tests prove the contract. Never invent canonical entities or relationships to make a table look complete.

## Canonical layer order

Fetters (9 axes; shadow and coherent readings independent) → Saboteurs (33 profiles) → Complexes → Hypercomplexes → Supercomplexes.

The canonical spec calls the next rung “hyper-complex”; the project request and downstream vocabulary also use “hypercomplexes.” Keep one stable machine ID and make display labels configurable. Masks are output, not a rung. Do not insert archetypes as a hierarchy level.

## Shared entity description template

Every entity at every layer must render these same named fields. If a field does not apply, emit an explicit `not_applicable` with a reason rather than silently dropping the field.

1. **Identity** — stable ID, canonical name, aliases, layer, canonical source and source version.
2. **Plain-language story** — lived sequence in second person: situation/trigger → internal signal → action/strategy → immediate payoff → longer-term cost. Non-diagnostic, non-accusatory, context-sensitive; describe a pattern someone may run, not who they are.
3. **What becomes available** — named coherent/replacement state, derived from the mapped child entities and canonical opposite-pole definitions; never guessed.
4. **Next move** — one concrete noticing/separating/choosing move, consistent with the story and not framed as an order.
5. **Mechanism / formation** — source-backed account where available; otherwise `unknown` or `not yet sourced`. Do not fabricate developmental causation.
6. **Inputs / composition** — typed child IDs and contribution roles; for the Saboteur layer this means fetter axis + band + independent shadow/coherent readings.
7. **Outputs / parent links** — candidate parent entities and relationship status, including evidence/provenance.
8. **Evidence and uncertainty** — source URLs, source excerpt/section, observation IDs when applicable, evidence status, confidence method, contradictions, unresolved questions.
9. **Distinction and overlap** — nearest neighbors, shared inputs, distinguishing features, collision status, and what additional input would discriminate them.
10. **Gap state** — complete / partial / blocked / unresolved; missing fields and exact next action.
11. **Safety and interpretation guardrails** — no diagnosis, no identity labeling, no claims about hidden intent, no person scoring; uncertainty remains visible.
12. **Acceptance checks** — machine-checkable requirements for this record.

The user-facing story fields (2–4) must be consistent across all entities. The data schema may extend per layer but must not fork the shared template.

## Mapping contract

Every relationship is a first-class record, not an implication hidden in prose:
- `from_id`, `from_layer`, `to_id`, `to_layer`
- `relationship_type` (contains / contributes_to / triggered_by / differentiates / replacement_for / overlaps_with)
- `status` (canonical / source_supported / hypothesis / unresolved / rejected)
- `evidence_refs[]`, `rationale`, `confidence`, `known_counterevidence[]`
- `simulation_fixture_ids[]`, `expected_behavior`, `observed_behavior`, `gap_ids[]`

Never convert a hypothesis to canonical merely because it makes a simulation rank as expected. Unresolved mappings remain visible in outputs.

## Layer-specific requirements

### Layer 1 — Fetters → Saboteurs
Canonical input set: nine axes — Fear, Anger, Shame, Disgust, Apathy, Shock, Sad, Surprise, Anticipation. Each axis has independent 0–10 shadow and coherent values. Never collapse them into one signed value. Surprise scores no Saboteur.

For each of the 33 canonical Saboteurs:
- Keep the canonical band definition and axis names/IDs.
- State the band edges and the firing rule (ramp, not cliff).
- Show the fetter axes that contribute and which required inputs are missing.
- Run the target's midpoint fixture and near-boundary/outside-band fixtures.
- Compare every pair for shared axis intervals, list overlap axes/widths, and distinguish partial overlap from exact full-signature equality.
- Report ties and plausible alternatives rather than forcing a unique result.
- Show each profile's shared-template story, coherent replacement state, next move, source status, and gap state.
- Keep behavioral evidence separate from charge compatibility. No blended score or accuracy claim without independent labels and calibration.

Current known baseline from the existing simulator: 33 profiles, 528 unique pairs, 271 pairs with at least one shared axis interval, no exact duplicate full signatures, 31/33 synthetic midpoint fixtures rank the intended target first, and 33/33 rank it in the top three. These are synthetic logic regressions only, not empirical accuracy.

### Layer 2 — Saboteurs → Complexes
Do not start by inventing a list of Complexes. First reconcile the canonical Complex roster and source of truth. For every canonical Complex:
- Apply the same 12-field description template.
- Enumerate required contributing Saboteur IDs and the role of each contribution.
- Map each contributing Saboteur to the Complex with provenance and relationship status.
- Identify missing, ambiguous, contradictory, and over-broad mappings.
- Simulate each canonical composition plus leave-one-child-out and nearest-neighbor alternatives.
- Report which Saboteur inputs are sufficient, redundant, or missing to distinguish the Complex from neighboring Complexes.
- Keep a Complex blocked if its canonical definition or membership cannot be verified.

### Layer 3 — Complexes → Hypercomplexes
Use the same template and relationship schema. Verify the canonical Hypercomplex roster before populating it. For each Hypercomplex, list contributing Complex IDs, required versus optional relationships if the canon defines that distinction, coverage, competing mappings, and simulations that remove or perturb each child. Explicitly trace each Hypercomplex back through its Complex and Saboteur ancestry to fetter inputs.

### Layer 4 — Hypercomplexes → Supercomplexes
Use the same template and relationship schema. Verify the canonical Supercomplex roster and composition rules before filling records. For each Supercomplex, document its contributing Hypercomplexes, parent-child provenance, distinguishing signature, collision/overlap analysis, missing ancestry, and simulation results. Preserve full traceability to the original fetter axes.

## Required simulation outputs at every mapping boundary

Every boundary must produce:
1. A canonical roster count and a completeness count.
2. A per-entity record with required fields present/missing.
3. A per-edge mapping table with source status and evidence.
4. Coverage: mapped, partially mapped, unresolved, blocked, and rejected edges.
5. Collision report: shared inputs, near-neighbors, ties, and distinguishing features.
6. Perturbation tests: remove one child/input, shift values near a band edge, and test missing/contradictory evidence.
7. Deterministic fixtures and expected outputs.
8. A gap register where every gap has severity, affected IDs, reason, required evidence or change, and acceptance test.
9. A no-fabrication check: unknown source data must remain unknown.
10. An end-to-end trace from the top-level entity down to the contributing fetter readings.

## Gap IDs and severity

Use stable IDs such as `FET-SAB-###`, `SAB-CMP-###`, `CMP-HCX-###`, and `HCX-SCX-###`.
- **P0**: missing canonical roster/source, invalid or contradictory mapping, template required field absent, or untraceable relationship that blocks the next layer.
- **P1**: meaningful ambiguity/collision, missing evidence, or simulation gap that limits reliable differentiation.
- **P2**: presentation/maintainability issue that does not block a valid mapping.
Every gap must state: entity/edge, evidence, consequence, action, and a testable closure condition.

## Framework completion gates

- **Gate A — Template parity:** all canonical entities across all layers use the same required template; machine check proves field parity.
- **Gate B — Fetter/Saboteur:** all 33 Saboteurs have verified bands, stories, replacement states, next moves, mapped axes, simulations, and explicit gap status.
- **Gate C — Complex:** canonical roster and each entity's story/composition/mappings/simulations are complete or specifically blocked by source gaps.
- **Gate D — Hypercomplex:** same acceptance contract, with ancestry traceability.
- **Gate E — Supercomplex:** same acceptance contract, with ancestry traceability.
- **Gate F — End-to-end:** automated validation proves every entity and edge is accounted for; no silent missing mappings; unresolved relationships are surfaced; outputs reproducible.
- **Gate G — Handoff:** machine-readable schemas, canonical source versions, fixtures, gap register, and exact integration contract are ready for the separate software.

Do not label the framework finished while any P0 is open. P1s may remain only if explicitly accepted, non-blocking, and surfaced to the user.

## Current verified gaps at the time this contract was written

1. **P0 — Shared-template parity is not yet proven across all 33 Saboteur records by a dedicated contract test.** `atuned_src/engine/data/sabcard.js` documents the intended shared story/availability/next-move pattern, but the framework needs a parity check that every canonical Saboteur has all required fields and no orphan/duplicate record. This does not authorize editing generated products.
2. **P0 — The current fetter/Saboteur simulation is not a complete hierarchy framework.** It checks pairwise band overlap and synthetic midpoint ranking; it does not yet emit the full per-entity template status, all missing-input diagnostics, edge coverage, or reusable gap register required here.
3. **P0 — The canonical hierarchy source is incomplete/discordant for the requested progression.** `SNIFFER_SPEC.md` describes the chain fetter → saboteur → complex → hyper-complex, but its detailed layer 3 is archetypes and layer 4 is six hyper-complex modes; it does not establish a canonical Complex roster/composition table or any Supercomplex roster. Reconcile this against the authoritative model source before asserting the roster or membership. Do not reinterpret archetypes as Complexes or invent Supercomplexes.
4. **P0 — Hypercomplex/Supercomplex roster and composition rules are not yet established in the inspected framework artifacts.** The six modes named in the spec (Grandiosity, Predatory, Collapse, Rigidity, Dysregulation, Dissociation) are identified as hyper-complex modes, but a complete membership graph and the requested next-level Supercomplexes are not supplied by that section. Record the six known modes as a partial source-backed inventory only; keep membership and Supercomplex edges unresolved until reconciled.
5. **P1 — Behavioral source coverage is not behavioral validation.** The latest available audit records 28 individually source-backed descriptions, 2 shared/ambiguous descriptions (Victim/Judge), and 3 missing individual descriptions (Innocent, Enabler, Control Freak); re-run the audit before treating counts as current.
6. **P1 — Synthetic midpoint results are not empirical classification accuracy.** Independent labeled cases and an approved evaluation protocol are absent from the current framework contract.

## Execution rule for the next implementation pass

Build the shared schema and roster/edge/gap validators first; populate and validate the 33 Saboteur records and their fetter edges against canonical sources; then proceed upward only when each next-level roster is source-verified. For any absent source, produce a precise blocked record and gap rather than pausing the entire framework or fabricating a mapping. Do not spend the work session tuning synthetic ranking weights while these structural gates are open.

## Source of truth
- `SNIFFER_SPEC.md` — canonical nine axes, 33 Saboteurs, firing bands, layer order, and known guardrails.
- `proto/sniffer/bands.js` — machine-readable Saboteur band table used by the evaluator.
- `proto/sniffer/behavioral-catalog.json` and `proto/sniffer/FETTER_BEHAVIOR_EVIDENCE_COVERAGE_AUDIT_2026-10-18.md` — descriptive source crosswalk and its current evidence limitations.
- `atuned_src/engine/data/sabcard.js` — current user-facing Saboteur story/availability/next-move copy source. The separate software owns generation of engine outputs.
