# ATÜNED — Canonical Coherence Formula Integration TDD
Version: 1.0
Date: 2026-10-22
Status: **Formula wired in source; runtime verification pending.**
Branch: `atuned/mvp-alpha-recursive-execution`

## Goal
Make CQ / Coherence one operational engine output defined by:

`CQ = clamp((Integrity × Intention) / Resistance, 0, 100)`

No competing CQ calculator is introduced. CQ model version is 3.

## Canonical source mapping implemented
- **Integrity**: `cqSum()/10`, the existing fixed-denominator 21-law score on the 0..10 input scale, with unanswered laws contributing zero. `cqSum()` uses `lawNow()`, so eligible release lift is already included once.
- **Intention**: the existing `It` value, derived from the seven-band `bandIg` average plus the existing pole/JQ adjustments, clamped to 0..10.
- **Resistance**: the normalized operational `Rz` factor, `max(1, (1 + DQ × 0.05) × verpFactor())`. DQ is the canonical total-shadow Resistance measure; Rz normalizes it with the six-axis gate factor for the formula's 0–10 Integrity/Intention scales. The floor at 1 defines the zero-shadow/zero-gate behavior and preserves partial CQ from zero answered laws.
- **CQ**: `clamp(integrity * intention / resistance, 0, 100)`; if no laws are answered, CQ is explicitly zero. The engine returns the three formula inputs with CQ for auditability.
- **Derived CQ consumers**: `cqSpan()` computes low/high CQ through the same formula; `releaseWork()` reports formula-based CQ before/after; `exCeiling()` recomputes the no-shadow resistance and removes the pole/JQ contribution from intention before calculating the expression ceiling; analytics labels the formula and marks older model bars as not comparable; history rows persist formula inputs; release-screen copy describes CQ as the formula output rather than a law-only measure.
- **Versioning**: `CQ_MODEL=3`; snapshots stamp the model version and persist rounded Integrity, Intention and Resistance inputs. Model-3 rows validate the Resistance floor. Record comparisons are suppressed across model versions, and analytics labels old-model CQ bars as historical/not comparable.

## Dataflow
`answered laws + eligible release work → Integrity`
`band integrity + existing pole/JQ adjustment → Intention`
`total-shadow DQ + six-axis gate factor → normalized Resistance Rz (floor 1)`
`Integrity × Intention / Resistance → clamp 0..100 → CQ / Coherence`
`CQ → existing tiers, expression lever, governance/quadrant, snapshots, and downstream readers`. `cqSpan()` now projects both bounds through the same formula (varying unanswered laws while holding current intention/resistance fixed); `exCeiling()` evaluates the shadowless expression ceiling through the same formula without mutating live state.

All consumers continue to read the single `compute().CQ` result. `cqSum()` remains an input/utility for Integrity and range calculations; it is no longer assigned directly as the public CQ output.

## Guardrails
1. Do not duplicate the release-lift mechanic.
2. Do not treat DQ as `100-CQ`.
3. Do not conflate DQ (total-shadow/resistance input) with SQ (total node shadow weight) or SQm (mean loaded-node weight).
4. CQ stays in 0..100; unanswered laws contribute zero to Integrity, and the public CQ remains zero when no laws have been answered.
5. Normalized Resistance Rz has a nonzero floor of 1; changing its scale, gate factor, or floor is a domain/model change and requires a new version plus boundary tests.
6. Any future change to Integrity, Intention, Resistance, scaling, or denominator behavior requires a model version change and migration/comparison plan.

## Regression coverage authored
- Explicit model-3 assertion.
- CQ span, release deltas, and expression ceiling route through formula-based values.
- History snapshots persist formula inputs, validate model-3 Resistance, and retain formula version; analytics avoids implying that historical model values are comparable.
- Release feedback copy and analytics tooltip now describe CQ as Integrity × Intention / Resistance.
- CQ equals the clamped formula using the exposed inputs.
- Integrity and Intention remain within 0..10.
- Resistance is at least 1.
- Blank/no-answered-law CQ remains zero.
- Existing persistence, deterministic read, tier, bounds, release, and profile tests remain in the suite; old tests that asserted CQ was law-only were revised where directly identified.

## Verification status
- Source edits and regression-test edits are committed on the feature branch.
- Local build/test execution was unavailable in this environment.
- GitHub Actions deploy run `39742889089` was observed queued on 2026-10-22; it is not a pass.
- Do not claim runtime acceptance until the build, `node tests/engine.js`, `node tests/trace.js`, and the documented release-chain test have completed successfully on the candidate revision.
