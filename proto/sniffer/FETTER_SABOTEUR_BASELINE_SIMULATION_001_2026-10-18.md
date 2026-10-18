# ATUNED Fetter-to-Saboteur Baseline Simulation 001
**Run date:** 2026-10-18  
**Source:** `proto/sniffer/bands.js` and `atuned_src/engine/data/canon.js` from MOB `main`  
**Classification:** Synthetic logic/regression baseline — **not empirical accuracy**

## Executive result
The first reproducible charge-only baseline has now been calculated from all 33 canonical rows using the membership ramp, geometric mean, arity weights, and Avoider weight documented in `canon.js`.

- Parsed reference rows: **33**
- Parsed runtime rows: **33**
- Exact name-and-band parity: **33/33**
- Unique canonical names: **33**
- Saboteur pairs sharing at least one overlapping axis interval: **271 of 528 possible pairs**
- Exact full-signature duplicates: **0**
- Synthetic band-midpoint fixtures where intended profile ranks first: **31/33**
- Synthetic band-midpoint fixtures where intended profile appears in top three: **33/33**

These ranking counts are diagnostic only. Each fixture was generated from the target profile's own band midpoints, and expected labels were assigned by construction. They must **not** be reported as real-world classification accuracy or validation of the fetter-to-Saboteur theory.

## Method
1. Read the 33 reference rows from `proto/sniffer/bands.js` and the 33 runtime rows from the `SAB33` section of `atuned_src/engine/data/canon.js`.
2. Compare names and all axis/low/high band tuples.
3. For each target Saboteur, construct one synthetic input by setting each of its required axes to the band midpoint and all other axes to zero.
4. Score all 33 candidates with the canonical formula:
   - in-band membership peaks at the midpoint and tapers to 0.75 at either band edge;
   - below-band taper is 2 points and above-band taper is 3 points;
   - required fetter memberships combine using the geometric mean;
   - arity weights are 0.80 for one-axis, 1.00 for two-axis, and 1.10 for three-axis rows;
   - Avoider receives its configured 0.55 multiplier;
   - final score is clamped to [0, 1].
5. Enumerate each pair sharing one or more axis intervals. This pair count means *some shared interval exists*, not that the entire signatures are equivalent.

## Ranking exceptions
| Intended synthetic target | Rank | Top results | Interpretation |
|---|---:|---|---|
| Control Freak | 2 | Hyper-Vigilant 1.000; Control Freak 1.000; Micromanager 0.917 | The two-axis input is fully compatible with Hyper-Vigilant; Control Freak's third axis is also at its midpoint, but the current scoring/ranking permits a tie. Preserve both. |
| Avoider | 3 | Hyper-Achiever 0.866; Escapist 0.612; Avoider 0.550 | The explicit Avoider multiplier suppresses the intended profile below other candidates on this synthetic input. This is a concrete design tradeoff to review, not a reason to remove the rule without approval. |

All other 31 synthetic target fixtures ranked their constructed target first. All 33 targets appeared in the top three. Full per-target scores should be retained when the test harness is added; this summary does not imply behavioral evidence was used.

## Micromanager vs Hyper-Vigilant
| Synthetic input | Micromanager | Hyper-Vigilant | Result |
|---|---:|---:|---|
| Fear 8.5, Anger 6.5 | 1.000 | 0.875 | Micromanager ranks first |
| Fear 8.0, Anger 6.0 | 0.917 | 1.000 | Hyper-Vigilant ranks first |

This confirms the ramp formula can rank the two profiles differently at different positions inside their overlapping bands. It does **not** show which mechanism is active in a person. Observable behavioral evidence and independent expected outcomes are still required to validate that distinction.

## What this block proves—and does not prove
**Proves:** the current two source tables can be parsed and compared row by row; the current scoring formula can be run reproducibly on 33 synthetic band-midpoint fixtures; overlapping intervals are extensive; the current rules produce identifiable ranking exceptions.

**Does not prove:** empirical accuracy, that behavioral indicators correctly distinguish Saboteurs, that the 65/35 experimental behavior/charge weighting is valid, or that the experimental behavioral evaluator is integrated into production.

## Next blocks
1. Save machine-readable scores for all 33 fixtures and all 271 overlapping pairs.
2. Review the Control Freak/Hyper-Vigilant tie and Avoider suppression against the governing specification; do not silently tune weights.
3. Build source-cited observable positive, negative, and contrast cases. Keep Victim/Judge ambiguous and the three missing descriptions blocked until supported sources resolve them.
4. Integrate evidence-informed evaluation at the fetter-to-Saboteur mapping boundary.
5. Compare charge-only results with evidence-informed results using independently established expected labels; report accuracy, retained-candidate coverage, false positives/negatives, and unresolved cases separately.
6. Run dedicated and full repository gates on the final commit; the previously observed broader build failure remains a separate open item.

## Measurements and confidence
- Table parity: **33/33** (high confidence; exact name and band tuple comparison).
- Shared-interval pair count: **271/528** (high confidence for the stated interval-overlap definition).
- Synthetic top-1 ranking: **31/33** (high confidence as a reproduction of the specified synthetic method; not empirical accuracy).
- Synthetic top-3 coverage: **33/33** (same limitation).
- Mapping accuracy against independent ground truth: **unknown**.
- Behavioral scoring integration: **not verified**.
- Overall framework validation: **not complete**.
