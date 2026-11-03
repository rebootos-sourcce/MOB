# ATÜNED Recursive Driver Integration — Pass 2: Source Discovery
Date: 2026-10-21
Status: Source paths located; no production patch made in this pass.

## Scope executed
- Enumerated the MOB repository's tracked tree.
- Located the canonical engine modules under `atuned_src/engine/`, including `compute.js`, `intake.js`, `loop.js`, and `trace.js`.
- Located the engine test gate at `tests/engine.js`, release lifecycle test at `tests/releasechain.js`, and build entry point at `atuned_src/BUILD-engine.sh`.
- Read the current `compute.js` source excerpts, CQ ruling in `DECISIONS.md`, and unified CQ brief at `docs/briefs/cq-unified.md`.

## Findings
1. The runtime is not the small TypeScript funnel service. The canonical engine is in `atuned_src/engine/`; do not patch a parallel adapter as if it were the engine.
2. The current engine comments state CQ is the 21-law score summed over a fixed denominator of 210, with unanswered laws contributing zero; a separate `CQ_MODEL=2` stamp exists to prevent readings from different formula versions being compared as ordinary movement.
3. The current compute code calculates a resistance-like `Rz` from DQ and the six-gate `verpFactor()`, with a minimum of 1. The comments say `Rz` no longer directly multiplies the CQ formula. This differs from the older multiplicative Coherence expression and must be versioned rather than conflated.
4. The current compute comments also describe a release-lift mechanism that can change law scores slightly after release. That is compatible with CQ being derived only from laws, but it makes replay/idempotency and event provenance essential.
5. `docs/briefs/cq-unified.md` records a separate historical ruling for DQ as total shadow and SQ per address. This must be reconciled with the user's current directional DQ/willpower instruction before changing those semantics; no equation should be invented.
6. The prior integration contract's formula distinction is directionally correct, but its generic statement that CQ is null until all 21 laws are measured conflicts with the current canonical engine ruling: the engine's current model builds CQ from zero as laws are answered, while completeness gates the definitive tier. The integration contract must not override the later source-of-truth ruling.

## Review A — missing connections
- The handoff must distinguish *partial CQ reading* from *complete/definitive CQ tier*.
- Integrity aggregate, law-based CQ, resistance, and the historical Coherence formula must remain separately named until an owner ruling binds them.
- Release lift is a legitimate CQ update only when the underlying law evidence changes; it must not be treated as an independent CQ adjustment.

## Review B — adversarial checks
- Do not use the outdated null-until-21 rule as the runtime acceptance criterion.
- Do not reintroduce the old `It × Ig / Rz` formula; source comments explicitly say that version squared law influence and allowed a release to lower CQ.
- Do not infer that a release run confirms a pattern. `loop.js` comments explicitly separate observed practice from user-confirmed pattern status.

## Status
- Source paths: located.
- Source excerpts: reviewed.
- Runtime code edited: no.
- Tests executed: no; source/test contract reviewed only.
- Next: inspect exact compute implementation and relevant engine test assertions, then make a narrow test-backed correction only if a concrete mismatch is verified.
