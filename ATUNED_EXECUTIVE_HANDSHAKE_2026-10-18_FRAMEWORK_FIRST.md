# ATUNED DEV — Executive Handshake
## Framework-First Continuation and Modeling Handoff
**Version:** 2026-10-18 (expressly verbose continuation edition)  
**Repository:** `rebootos-sourcce/MOB`  
**Active engineering branch:** `audit/fetter-saboteur-simulation-plan-2026-10-18`  
**Related draft PR:** [#122 — Fetter-to-Saboteur framework evaluator](https://github.com/rebootos-sourcce/MOB/pull/122)

---

## 1. Executive directive

Continue building and validating the **ATUNED framework and its modeling/simulation layer**. Do not spend further effort regenerating, repairing, comparing, or committing the engine's generated artifacts in this workstream. Those artifacts—including `engine.js`, `source.html`, and `atuned-packed.html`—are generated and maintained by separate software operated by the project owner.

The purpose of this handshake is to connect the framework work to that separate engine-building process. The framework must define, validate, document, and expose the canonical rules, data contracts, mappings, evidence requirements, and reproducible simulations that the other software can consume. When the framework is stood up and internally coherent, the owner will use the separate software to complete engine/ATUNED integration and generated products.

**Scope correction:** Previous work drifted into chasing generated-engine parity. That is not the task for this thread. Stop that line of work. Do not change generated engine files, do not attempt to regenerate them, and do not make framework progress conditional on engine artifact parity. Keep engine integration as a clearly documented downstream handoff requirement only.

## 2. Objective

Deliver a dependable framework for mapping the nine canonical fetter axes to the 33 canonical Saboteur profiles, distinguishing shadow and coherent readings, handling overlapping profiles without false certainty, and supporting repeatable simulations for model development.

The framework must be useful for modeling even before empirical behavioral accuracy is fully established. It must, however, clearly distinguish:
- **Specification integrity:** implementation agrees with canonical definitions and data.
- **Computational correctness:** scoring and ranking calculations behave as specified.
- **Synthetic test performance:** behavior on constructed fixtures.
- **Behavioral validity:** whether evidence-informed classifications match independently established outcomes.
- **Engine integration:** work performed by the separate engine-building software.

Never present one of these as proof of another.

## 3. Current verified baseline from the active work

The current draft PR is open and remains a draft. Its metadata reports 19 commits and 11 changed files. Its documented scope includes a deterministic evaluator, exhaustive band-collision simulation, regression tests, and source-coverage audit.

Previously recorded simulation results:
- Canonical Saboteur profiles compared: **33/33**.
- Exact name-and-band parity in the baseline comparison: **33/33**.
- Candidate pairs with at least one overlapping fetter-band interval: **271/528**.
- Exact duplicate complete signatures: **0**.
- Constructed synthetic midpoint fixtures ranking the intended profile first: **31/33**.
- Constructed synthetic fixtures ranking the intended profile in the top three: **33/33**.

These synthetic results are useful regression signals, **not empirical or real-world classification accuracy**.

The evaluator work described in PR #122:
- Scores all 33 canonical candidates from the canonical band table.
- Enumerates all 528 candidate pairs and detects shared axis intervals.
- Keeps charge-only ranking separate from behavior-evidence ranking.
- Requires explicit evidence references and observation IDs for experimental behavior scores.
- Rejects noncanonical fetter axis names.
- Leaves blocked or ambiguous catalog entries unscored.
- Avoids a global 65/35 blend until weights and evidence coverage are validated.

CI status must be checked against the latest commit before any claim of a current pass. An earlier revision passed evaluator and collision-simulation tests; the PR description says the stricter provenance/axis-validation run and full repository gates were pending. Do not convert an earlier pass into a claim that the latest revision or the entire repository is green.

## 4. What the framework workstream owns

### A. Canonical model and contracts
1. Treat `SNIFFER_SPEC.md` as the canonical specification unless a newer authoritative project decision explicitly supersedes it.
2. Preserve the canonical set of 33 Saboteurs and nine fetter axes.
3. Preserve independent shadow and coherent readings; never collapse them without a documented rule.
4. Validate names, axes, charge bands, required fields, and profile counts against the canonical source.
5. Document input/output schemas and invariants so the external engine software can implement the same behavior without guessing.
6. Keep source-of-truth data separate from generated outputs.

### B. Charge-only evaluator
1. Make the scoring algorithm deterministic and reproducible.
2. Test boundary values, values inside bands, values outside bands, missing values, and invalid axis names.
3. Keep shadow and coherent values independent throughout the calculation.
4. Produce a complete ranked candidate list with per-axis contributions and enough diagnostics to explain ties.
5. Explicitly represent uncertainty and ties; do not manufacture a unique answer when the inputs do not support one.
6. Retain machine-readable fixture outputs and a human-readable report.

### C. Collision analysis
1. Preserve the exhaustive 528-pair analysis.
2. Distinguish interval overlap on at least one axis from full-signature equality.
3. Report which axes overlap, overlap widths, and the inputs under which rankings change.
4. Include named collision examples such as Micromanager versus Hyper-Vigilant and Control Freak versus Hyper-Vigilant.
5. Do not treat a shared interval as proof that two Saboteurs are behaviorally equivalent. It means charge-only evidence may be insufficient in that region.

### D. Behavioral evidence layer
1. Behavioral evidence is an optional, separate layer on top of the charge-only baseline.
2. Each indicator must be observable, specific, falsifiable where possible, and linked to a source or documented observation.
3. Store provenance, observation IDs, direction (supports/contradicts/neutral), confidence, context, and missingness explicitly.
4. Separate source-description coverage from validated indicator coverage and from empirical classification accuracy.
5. Keep ambiguous and unsourced entries blocked or unscored. Do not invent source-backed indicators to fill a coverage table.
6. Compare charge-only and behavior-informed rankings on the same fixtures.
7. Behavioral evidence may refine rankings, but must not erase contradictory evidence, fabricate observations, or suppress plausible alternatives without a documented rule.
8. Do not introduce a global evidence/charge weighting blend until independent labeled cases justify calibration.

Current source audit reported 28 individually source-backed descriptions, two ambiguous entries (Victim and Judge), and three missing individual descriptions (Innocent, Enabler, Control Freak). These counts describe the earlier audit state and must be rechecked before being treated as current. Even the 28 source-backed descriptions must be converted into reviewed observable indicators before they count as behavioral validation.

### E. Scoring exceptions to resolve
- **Control Freak / Hyper-Vigilant tie:** the constructed Control Freak fixture gave both candidates a score of 1.000 under the current rules. Inspect the canonical specification and scoring contract. Fix only if the implementation violates a governing rule; otherwise document the legitimate ambiguity and represent the tie correctly.
- **Avoider weighting:** Avoider ranked third on its own synthetic fixture under a 0.55 multiplier. Determine whether that multiplier is specified and justified. Do not change it merely to force the intended fixture to rank first. If the rule is unsupported or inconsistent with the canonical specification, remove or revise it with tests and a rationale.

## 5. Required execution blocks

Execute these blocks sequentially. After each block, inspect failures and gaps, repair only supported defects, rerun the relevant tests, then proceed. The full framework regression suite should be rerun after material changes.

### Block 1 — Establish framework baseline
- Inspect the current branch and PR #122.
- Read the canonical specification, runtime canonical data, evaluator, fixtures, tests, and workflow definitions.
- Confirm the latest commit SHA and actual CI status.
- Record the baseline with exact commands, test counts, pass/fail state, and known limitations.
- Do not touch generated engine products.

**Exit condition:** reproducible baseline and explicit inventory of open framework gaps.

### Block 2 — Finish deterministic evaluator validation
- Exercise all 33 profiles and all nine axes.
- Add or verify boundary, missing-data, invalid-input, tie, and shadow/coherent separation tests.
- Check that the reported rankings and diagnostics are deterministic.
- Verify all 528 candidate pairs and collision metadata.

**Exit condition:** tests demonstrate the specified behavior; exceptions are either fixed or explicitly documented as legitimate ambiguity.

### Block 3 — Resolve specification/scoring discrepancies
- Investigate Control Freak / Hyper-Vigilant and Avoider weighting.
- Use canonical definitions and explicit rules, not intuition or fixture-target forcing.
- Add regression tests for the final decision and document the rationale.

**Exit condition:** no unexplained scoring exception remains.

### Block 4 — Make the evidence catalog auditable
- Recheck the 33-entry behavioral catalog against its source material.
- Mark each entry as source-backed, ambiguous, missing, or validated indicator set.
- For each eligible indicator, record provenance and observable positive/negative contrasts.
- Keep missing and ambiguous entries unresolved until evidence is found.
- Do not claim empirical accuracy from a source inventory alone.

**Exit condition:** each catalog entry has a transparent status and every scored indicator has traceable evidence.

### Block 5 — Comparative simulations
- Run charge-only and evidence-informed evaluators on identical fixtures.
- Use independently labeled cases for accuracy claims; synthetic cases are for implementation regression only.
- Report top-1, top-3, ties/unresolved cases, false positives, false negatives, and per-profile results where ground truth exists.
- Include sample size, label provenance, limitations, and uncertainty.
- If no independent labels exist, report that accuracy is not measurable yet rather than inventing a percentage.

**Exit condition:** reproducible comparison report that separates synthetic performance from empirical validity.

### Block 6 — Framework regression and handoff package
- Run evaluator tests, collision simulation, evidence-provenance tests, and all relevant framework checks available in this repository.
- Inspect the exact latest CI result; rerun failed framework jobs and fix genuine framework defects recursively.
- Do not run or repair engine-generated artifact parity as part of this workstream.
- Produce a handoff contract for the separate software: canonical data version, axes, scoring semantics, evidence schema, uncertainty/tie handling, test fixtures, expected outputs, and known limitations.
- Record engine-side work as a downstream integration checklist, not as a blocker to framework completion.

**Exit condition:** framework checks are verified for the current commit and the handoff package is sufficiently explicit for the external software to implement.

## 6. Definition of framework completion

The framework workstream is complete when:
1. Canonical data and implementation contracts are internally consistent.
2. The deterministic evaluator is covered by reproducible tests.
3. Collision analysis is reproducible and its limitations are explained.
4. The two known scoring exceptions are resolved or explicitly justified by the canonical rules.
5. Evidence provenance and missing/ambiguous states are handled honestly.
6. Comparative simulations run reproducibly, with no unsupported accuracy claims.
7. Current framework CI status is verified and the relevant framework test gates pass.
8. The separate engine handoff document specifies what the other software must build and how to verify parity.

**Framework completion does not mean engine integration is complete.** The owner will handle engine and ATUNED generated-product completion in the separate software.

## 7. Explicitly out of scope for this workstream

Do not:
- Regenerate or edit `engine.js`, `source.html`, `atuned-packed.html`, or other generated engine products.
- Spend time resolving the previously reported generated-product mismatch (`Controller` versus `Micromanager`) here.
- Weaken parity checks to get a green build.
- Treat engine build failures caused by generated artifacts as framework failures.
- Claim that a previous CI run proves the current revision passes.
- Claim real-world classification accuracy from synthetic fixtures.
- Invent behavioral sources or expected labels.
- Add unrelated features or expand scope beyond the framework and its handoff contract.

If a workflow mixes framework checks with engine artifact checks, identify and report the two categories separately. Run the framework-relevant tests directly where possible, and state exactly which checks were and were not run.

## 8. External engine integration handoff

When the framework contract is ready, the separate software should:
1. Import the canonical 33-profile data and nine-axis schema.
2. Implement the exact documented band scoring and shadow/coherent separation.
3. Implement tie and uncertainty handling without silently forcing a single classification.
4. Consume only behavior indicators with valid provenance and status.
5. Reproduce the framework's fixture outputs.
6. Run the engine's own build, generated-artifact refresh, parity checks, and downstream integration gates in that separate environment.
7. Return test results and any divergence to the framework workstream for contract-level correction.

The external software owns generated files and engine-specific build mechanics. This repository's framework documents must be explicit enough that the external implementation can be tested against stable expected outputs.

## 9. Current status and honest reporting rules

**Last established status in the conversation:** the framework evaluator and collision simulation have been added in draft PR #122; earlier dedicated tests passed; stricter latest CI and full repository gates were not confirmed passing. The charge-only baseline is recorded. Empirical behavior-informed accuracy is unknown. The prior full repository run exposed generated-product mismatch after the em-dash gate was fixed, but that generated-artifact issue is explicitly out of scope under this corrected handshake.

Before reporting a new status, refresh the PR and latest commit's checks. Report:
- what was actually changed;
- which commands/tests were actually run;
- exact pass/fail results and commit SHA;
- remaining framework gaps;
- downstream engine tasks separately;
- confidence and its basis.

Do not say work was executed if only a plan was written. Do not claim background work continued after the session ended. Do not call the framework complete until its defined exit conditions are met.

## 10. First action on resumption

Resume from the existing branch and PR #122. Do not restart the strategy. Do not touch generated engine files. First verify the latest branch state and CI, then complete Blocks 1–6 in order, focusing exclusively on framework correctness, reproducible modeling/simulation, evidence handling, and the explicit handoff contract.

## Measurement and confidence register

| Measure | Current recorded value | Interpretation |
|---|---:|---|
| Canonical Saboteur profiles | 33 | Canonical set represented in baseline |
| Fetter axes | 9 | Canonical axis set |
| Profile pairs examined | 528 | All unique pairs among 33 candidates |
| Pairs with at least one shared interval | 271 | Charge-only overlap exists |
| Exact duplicate full signatures | 0 | No identical full band signature in baseline |
| Synthetic fixtures top-1 | 31/33 | Synthetic regression result only |
| Synthetic fixtures top-3 | 33/33 | Synthetic regression result only |
| Empirical classification accuracy | Unknown | Independent labels not established |
| Current latest CI | Must be refreshed | Earlier pass is not proof of current pass |
| Engine generated-artifact parity | Out of scope here | Owned by separate software |
| Confidence in scope correction | 0.99 | Directly follows user's explicit instruction |
| Confidence in empirical accuracy | Not assignable | Insufficient independent ground truth |

**Controlling instruction:** Build the framework. Make its rules, evidence, tests, simulations, and external-engine handshake correct and explicit. Leave engine generation and engine artifact repair to the separate software.


## 11. CONTROLLING SCOPE UPDATE — FULL HIERARCHY FRAMEWORK (2026-10-18)

The owner clarified the required deliverable: stop treating the second layer's simulator as the main work. Build the framework across the full hierarchy in order:

**Fetters → Saboteurs → Complexes → Hypercomplexes → Supercomplexes.**

Every entity at every layer must use one shared story/description template; every child-parent mapping must be explicit; each boundary must have simulations, overlap/differentiation analysis, and a gap report; and the full ancestry must remain traceable to the fetter inputs. The simulator is a validation tool, not the deliverable. A passing simulator cannot close missing template or mapping work.

New controlling contract:
- `proto/sniffer/ATUNED_ALL_LEVELS_FRAMEWORK_CONTRACT.md`
- It defines the shared entity template, typed relationship schema, layer-specific acceptance criteria, simulation outputs, gap severity, completion gates, and current source-grounded blockers.
- Do not fabricate Complex, Hypercomplex, or Supercomplex rosters or mappings. Locate and reconcile canonical source data; if unavailable, record a precise blocked entity/gap and continue building the reusable schema and validators.
- First establish template parity and roster/edge/gap validation; complete the 33 Saboteur stories and their fetter mappings; then advance each higher layer only with source-verified rosters.
- Treat P0 template/mapping/source-of-truth gaps as blockers to framework completion. Do not tune synthetic score weights while structural framework gates remain open.
- Engine-generated outputs remain excluded; the separate software owns generation and engine-side parity.

This scope update supersedes any interpretation of Blocks 1–6 that would keep the effort centered on the evaluator or collision simulation rather than the full hierarchy framework.


## 12. Work-session changes and current verification (2026-10-18)

- Added `proto/sniffer/ATUNED_ALL_LEVELS_FRAMEWORK_CONTRACT.md`, defining the shared entity template, mapping-edge contract, simulation outputs, gap IDs/severity, and acceptance gates for all requested levels.
- Added `proto/sniffer/fetter-saboteur-framework-contract.test.js` to assert that the user-facing Saboteur story table contains 33 unique records, each with story (`h`), coherent availability (`a`), next move (`n`), and a reflection prompt, and that every canonical band maps to a story record or explicit alias.
- Updated `.github/workflows/fetter-saboteur-evaluator.yml` to run the template-parity test and trigger when the story source changes.
- Updated this handshake to make full hierarchy coverage the controlling scope.
- Current branch head at this status refresh: `67836765fd8066ce2b11ed4b64917addbca27900`; PR #122 remains open and draft. No combined status checks were returned for this exact head at the time of refresh; therefore the new test is **not yet claimed as CI-passing**.
- Source check: `atuned_src/engine/data/sabcard.js` has 33 records and each record contains `h/a/n` plus a reflection prompt. This is structural parity; it does not prove that every story's factual content is canonically validated or that every replacement state is correctly derived.
- Critical source gap confirmed: `SNIFFER_SPEC.md` lists the six hyper-complex modes but does not provide a canonical Complex membership graph or Supercomplex roster/composition. It also describes archetypes at layer 3, so this must be reconciled against the authoritative source rather than silently relabeled. The all-level contract records these as P0 blockers and explicitly forbids inventing rosters or mappings.
- Remaining framework work is still substantive: validate the new test in CI, add machine-readable roster/edge/gap records and full per-profile diagnostics, reconcile the authoritative higher-level hierarchy, then complete the mapping/simulation/gap reports at every boundary. The framework is **not complete** yet.


## 13. Graph wiring and inverse inference update (2026-10-18)

New implementation in `proto/sniffer/hierarchy-graph.js` connects the known graph and makes the inferred list callable rather than an isolated artifact:
- `getModel()`: full graph snapshot and explicit gap register.
- `getInferredList()`: 33 Saboteurs with canonical fetter bands/inputs, source-supported archetype-context candidates, and explicit blocked mappings at missing higher layers.
- `summarizeSelection(nodeId)`: top-down traversal from a selected node, returning its known children and unresolved boundary gaps.
- `inferUp(startIds)`: bottom-up inversion from fetters or Saboteurs through all currently supported parent edges, preserving provenance and edge status.

The graph contains 9 fetter nodes, 33 Saboteur nodes, 70 canonical fetter-to-Saboteur band edges, 12 archetype-context nodes and 23 source-supported Saboteur-to-archetype context edges. The archetype roster is explicitly conflicted (the spec itself records 12/13/15 variants). The six hyper-complex modes are represented as a partial roster with no fabricated membership edges. Complex and Supercomplex appear as explicit unresolved placeholders so selecting the top-level placeholder surfaces the missing structure rather than returning a false complete path.

Added `proto/sniffer/hierarchy-graph.test.js` for structural counts, top-level blocked traversal, inferred-list wiring, and inverse paths; the dedicated workflow now includes it. The current code/test changes have been committed to the existing feature branch, but CI status for the newest revision remains unverified. Do not report test pass until GitHub Actions confirms it.
