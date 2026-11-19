# ATUNED Fetter-to-Saboteur Simulation Plan
**Date:** 2026-10-18  
**Status:** Execution plan; accuracy not yet measured  
**Scope:** Validate the framework mapping from the nine fetter axes to the 33 canonical Saboteurs. This is not a general Sniffer integration task.

## Decision
Do not treat charge-band compatibility as proof of Saboteur identity. The simulation must measure whether the canonical fetter-to-Saboteur mapping identifies the intended pattern, and whether sourced observable behavioral evidence resolves collisions without suppressing valid alternatives.

## Verified starting point
- `SNIFFER_SPEC.md` defines the canonical 33 Saboteurs and their charge bands.
- `atuned_src/engine/data/canon.js` and `proto/sniffer/bands.js` contain the canonical band table; the previous parity check reported 33/33 matching rows.
- The experimental `proto/sniffer/behavioral-score.js` consumes externally supplied support/contradiction ratings. It does not classify raw behavior and is not integrated into the production decision path.
- The experimental catalog represents all 33 names, but only 28 entries have individual source descriptions; Victim/Judge is ambiguous, and Innocent, Enabler, and Control Freak are blocked.
- The 65/35 behavior/charge weights are provisional. Do not report them as validated.
- Dedicated scorer CI passed on a prior run. The broader build workflow failed at the build's “em dash found” check. These are separate gates.

## Execution blocks

### Block 1 — Establish a reproducible charge-only baseline
1. Read the canonical band rows directly from the spec/runtime source; do not hand-maintain a second list.
2. Generate deterministic synthetic fixtures at band centers, edges, just below/above edges, and shared intersections.
3. Preserve each axis's shadow and coherent readings separately. Do not collapse them into a signed value.
4. Record every candidate score, ranking, and tie; keep charge-only results labeled as such.
5. Add explicit regressions for Surprise not independently triggering a Saboteur, resentment as Anger + Apathy, weak/high-frequency Avoider behavior, and tapered band scoring.

**Output:** machine-readable baseline results and a collision report for all canonical profiles.

### Block 2 — Enumerate mapping collisions
1. Compare every Saboteur pair using all shared axes and intersecting bands.
2. Separate full-signature collisions from partial overlaps.
3. Record each collision's shared intervals, non-shared axes, and whether the current charge rules can distinguish the pair.
4. Prioritize pairs with high overlap and materially different behavioral mechanisms. Micromanager vs Hyper-Vigilant is the first contrast: Fear 7–9 and Anger 5–7 overlap completely on the two axes shown by those profiles.

**Output:** exhaustive collision matrix with counts computed from the canonical table, not manually estimated.

### Block 3 — Build a provenance-backed behavioral test set
For each canonical Saboteur, define:
- observable supporting behaviors (not hidden intent);
- observable contradicting behaviors;
- context and recurrence requirements when supported by the source;
- citations/provenance;
- a positive fixture, counterexample, and nearest-candidate contrast;
- expected result and reason;
- status: canonical/source-backed, proposed, or unresolved.

Use the legacy v29 trigger/interrupt/formation fields as source material, not as already validated positive/negative indicators. Do not invent individual definitions for blocked entries. Keep Victim/Judge ambiguous until a source distinguishes them. Keep missing entries behaviorally unscored until valid source material is found.

**Output:** test catalog with provenance and explicit blocked cases.

### Block 4 — Implement a framework-level evaluator
1. Integrate behavior evidence at the fetter-to-Saboteur mapping boundary, not as an unrelated ranker.
2. Keep charge compatibility and behavioral evidence visible as separate contributions.
3. Use only sourced/approved indicators; missing or ambiguous evidence must not increase or decrease a candidate.
4. Do not lock 65/35 weights as canon. Initially report charge-only and evidence-informed rankings side by side. If weights are later tested, mark them experimental and run sensitivity analysis.
5. Preserve multiple candidates when the evidence does not distinguish them.

**Output:** deterministic evaluator with explicit provenance, uncertainty, and explanation per candidate.

### Block 5 — Run the accuracy simulation
Run the fixtures against the evaluator and report:
- exact expected-vs-predicted results;
- top-1 accuracy only for cases with independently established expected labels;
- top-k/retained-candidate coverage for genuinely ambiguous cases;
- false positives, false negatives, unresolved cases, and results by Saboteur;
- charge-only baseline versus evidence-informed performance;
- source coverage and fixture coverage separately from accuracy.

Do not count synthetic fixtures authored from the same rules as independent validation. Label them as logic/regression tests, not empirical accuracy evidence.

### Block 6 — Close gaps recursively
For every failure: identify whether the defect is in canonical mapping, source mapping, evaluator logic, fixture expectation, or implementation integration. Correct the smallest responsible layer, rerun its tests, then rerun the complete regression suite. Never fix a failing test by weakening its expected outcome without source justification.

### Block 7 — CI and closure
1. Run dedicated simulation tests.
2. Run the actual engine and repository test/build gates.
3. Investigate the current build failure at the “em dash found” check and determine whether it is caused by this change or pre-existing content.
4. Verify results from the final commit/PR head.
5. Keep the PR draft until runtime integration, regression, and evidence review pass.

## Acceptance gates
- 33/33 canonical identities accounted for, with no silent rename or duplicate.
- Every band sourced from the canonical table; parity verified.
- All overlap pairs enumerated reproducibly.
- Every behavior-informed score has source-backed evidence and an explicit evidence direction.
- Missing/ambiguous evidence remains unscored.
- Shadow and coherent readings remain independent.
- Regression rules above pass.
- Results distinguish logic-test performance from empirical classification accuracy.
- Full applicable CI/build gates pass on the final revision.

## Current gaps and priority
| Priority | Gap | Closure evidence |
|---|---|---|
| P0 | No exhaustive baseline/collision report | Generated output from all 33 canonical rows |
| P0 | No independently supported positive/negative behavioral fixture set for all 33 | Provenance-complete catalog; unresolved entries explicitly blocked |
| P0 | Experimental scorer not connected at the framework mapping boundary | Runtime-level tests demonstrate behavior evidence changes or preserves rankings appropriately |
| P0 | No measured mapping accuracy | Reproducible expected-vs-predicted report, with synthetic and independent cases separated |
| P0 | Broader build gate fails | Root cause fixed or documented as independently reproduced; full gate rerun |
| P1 | Provisional 65/35 weights lack validation | Sensitivity results and approved rationale, or remove fixed weighting |
| P1 | Behavioral coverage only 28 individually mapped descriptions | Source gap resolved without fabricated definitions |

## Current scorecard
- Canonical identity coverage: 33/33 represented.
- Individual behavioral source mappings: 28; ambiguous: 2; missing: 3.
- Charge-band parity: previously reported 33/33.
- Behavioral ranker: experimental, separate from runtime.
- Mapping accuracy: **not measured**.
- End-to-end simulation: **not complete**.
- Dedicated scorer CI: **passed on a prior run**.
- Broader build: **failed at an em-dash check on the retrieved run**.
