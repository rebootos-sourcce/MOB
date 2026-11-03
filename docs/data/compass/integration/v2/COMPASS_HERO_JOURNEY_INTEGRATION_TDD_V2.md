# ATÜNED Compass / Hero's Journey Board — Integration TDD v2
**Date:** 2026-11-03  • **Status:** Implemented candidate seam; not merged, not deployment-verified  
**Stacked development base:** `atuned/hero-journey-board-main-sync-2026-10-29` (open PR #156)  
**Build branch:** `work/compass-board-contract-2026-11-03`

## Purpose and verified model
The Compass is the Hero's Journey Board, not a 21-law radial dashboard. It contains one CQ position (0–100), three realms, and 26 narrative encounters: Inferno 9 (0–40), Purgatorio 7 (40–60), Paradiso 10 (60–100). The CQ position uses `hjLocate(compute().CQ)` **only when full 21-law coverage is eligible**. The independent selected encounter remains user-chosen. Board visits, a presumed personality, a narrative metaphor, or a completed practice must not overwrite CQ.

The 12 core archetype research records are linked to **8 Paradiso scenes** as *candidate resonances*. There is no verified placement of all 12 across Inferno/Purgatorio scenes; do not fabricate one. The seven Purgatorio terrace records each encode vice↔capacity oscillations. The owner's seven-layer narcissism conception is preserved in a **separate provisional reconciliation contract**, not falsely substituted for terrace source records.

## Three strategy reviews before changes
1. **Source-truth review (confidence 0.96):** Re-read board map, CQ position contract, archetype registry, Purgatorio registry, `HERO_JOURNEY_BOARD_CQ_AVATAR_DIRECTIVE_V1.md`. Preserve stable IDs and approved 9/7/10 geometry. Distinguish owner's model from completed source-to-psychology crosswalk.
2. **Runtime-seam review (confidence 0.93):** Verified `atuned_src/engine/hero_journey.js` reads canonical CQ and holds separate active encounter, `hero_journey.js` lives on open PR #156, and `relPick`/`ritStartPlan` are existing release/ritual writers. No new database, calculator, or parallel user record.
3. **Regression and release review (confidence 0.89):** Read PR #156's test evidence and two known voice objections. Chose small UI-copy and candidate-link fixes plus deterministic contract test on a **stacked branch**. Do not merge PR #156 or claim deployed state without re-running build, test, CI and browser readback.

## Real module and content owners
| Concern | Authoritative owner | Current seam |
|---|---|---|
| CQ calculation | `atuned_src/engine/compute.js`; accepted owner ruling `docs/briefs/cq-unified.md` | Read-only from `compute().CQ`; do not re-score |
| Position projection | `atuned_src/engine/hero_journey.js`, `docs/data/compass/avatar/v2/CQ_POSITION_26_SCENE_MAP_V1.json` | 0, 40, 60, 100 tested |
| Level content | `docs/data/compass/gameboard/v1/GAMEBOARD_MAP_V1.json` | Stable 26 IDs; generated runtime scene atlas |
| Purgatorio | `docs/data/purgatorio/v1/PURGATORIO_REGISTRY_V1.json` | 7 vice-to-capacity records, 14 pole records |
| Owner's narcissism model | owner direction + complex research, not an approved terrace mapper | `PURGATORIO_NARCISSISM_CROSSWALK_PROVISIONAL_V1.json` |
| Archetypes | `docs/data/compass/archetypes/v1/CORE_12_BEHAVIORAL_ARCHETYPES_REGISTRY_V1.json` | 12 candidates across 8 Paradiso anchors |
| Screen | `atuned_src/ui/hero_journey.js`, `atuned_src/ui/avatarui.js` | Selected scene now exposes candidate resonance, without grading |
| Diagnostic | `atuned_src/ui/diagnostic3.js`; optional standalone funnel branch PR #145 | Self-report status stays separate from CQ |
| Release / ritual | existing `relPick` / `ritStartPlan` | Dynamic profile-dependent link; fixed scene recipe IDs remain null |
| SOURCE AI | existing Source inquiry engine | Guide as Virgil metaphor, one consent-based question; no diagnosis |
| Avatar | `atuned_src/engine/avatar.js` | Existing unique-release count + original complete CQ chronology |

## Implemented changes in this slice
1. `atuned_src/ui/hero_journey.js`: selected narrative scene reveals linked archetypes with explicit **candidate** context. Shows clear absence for scenes without approved resonances; does **not** present invented shadow/archetype positions.
2. `atuned_src/ui/hero_journey.js` and `atuned_src/ui/diagnostic3.js`: remove passing-grade/denominator phrases. Display raw reading and distinct progress facts. User still sees actual 0–100 boundary bands.
3. `PURGATORIO_NARCISSISM_CROSSWALK_PROVISIONAL_V1.json`: preserve seven terrace/pole IDs, provenance, owner hypothesis, and explicit null semantic mechanisms awaiting evidence and approval.
4. `tests/compass-board-contract.js`: deterministic gate for 26 stages, 9/7/10, CQ boundaries, 12 valid overlays, seven terrace joins, and absence of invented narcissism mapping.

## Required runtime states and guardrails
- **Unmeasured/partial:** no definitive CQ position, no fixed realm diagnosis. Never create a fake 50% position. Label as provisional, preserve unanswered/N/A where separately represented.
- **Measured:** only canonical engine CQ can produce `location`; 40 belongs to Purgatorio and 60 to Paradiso; 100 final scene.
- **Exploration:** user may open any scene independently of measured position. A selected encounter does not move the avatar.
- **Shadow/archetypes:** candidate link is reversible and must carry source/provisional status. No automatic narcissism diagnosis from a score.
- **Movement:** releases and practices are evidence only when existing writers say they occurred; do not award unearned CQ or recalculate it.
- **Unknown protocol IDs:** keep null, disable only the missing fixed join, continue supported dynamic profile-based routes. Do not block whole board for an unmapped scene.
- **Three-pass SOURCE summary:** evidence review → pattern hypotheses and alternatives → verification/uncertainty; never present a completed CQ if 21-law eligibility fails.
- **Sensitive profile:** first/middle/last names and DOB as the user directs for the profile; birth location and time optional. No invented birth data or metaphysical certainty.

## Acceptance gates (must be completed before approval/merge)
- `node tests/compass-board-contract.js` — NEW; source-level checks performed in connector sandbox; **Node test not yet run in repository runner**.
- `node tests/herojourney.js` and `node tests/herojourney-ui.js` — previously reported green for PR #156's earlier SHA; **rerun on this branch**.
- `python3 .claude/skills/atuned-voice/check.py --objections` — PR #156 reported red due to count-versus-total language; copy updated here; **rerun**.
- `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh` — rebuild generated files in that order; inspect reproducibility, then commit rebuilt artifacts as required by the repository. **Not run here**.
- `node tests/engine.js`, `node tests/functional.js`, `node tools/products.js`, `node tests/chrome-path.js`, `python3 tools/workflow-lint.py` — **not run on this branch**.
- Live browser: 21-law partial CQ shows no active location; after full 21, CQ 39.999/40/59.999/60/100 maps correctly, each selected scene shows candidate label, revisiting does not move avatar; mobile, screen reader, reduced motion and persistent export/import all require validation.
- Visual approval: archetype symbolism/icons, exact placement of middle seven narcissism sublayers, and whole-board art are **not approved** by this engineering slice.

## Conflicts and decisions
- **CQ formula:** `docs/briefs/cq-unified.md` says owner ruled pure 21-law sum, while an older `ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md` records a model-3 experiment as not accepted. Do not promote the older formula by accident; inspect current `compute.js` and owner decisions before calling any formula canonical.
- **Narcissism:** owner says seven-layer mechanism at 40–60; Purgatorio registry says seven named vice-capacity terraces and the separate complex registry contains narcissism. Provisional crosswalk records both, marks the one-to-one causal relationship unresolved; this is not a blocker to presenting Purgatorio.
- **PR #156:** open and reported `mergeable=false` on 2026-11-03; it also carries changes relative to a now-moving `main`. The stacked changes do not resolve branch-base conflicts; run merge test after PR #156 is updated.
- **PR #145:** Core-10 diagnostic branch targets a different base, not yet a safely merged feature. Keep imports and SOURCE summary seam as explicit integration tasks.

## Remaining work, sequenced
1. Run Node/voice/production build gates; repair actual failures only. Verify generated assets and CI against exact commit.
2. Resolve PR #156 mainline diff and branch conflicts in a dedicated integration round; preserve canonical profile/writer boundaries.
3. Create evidence-backed archetype↔Inferno/Purgatorio resonance candidates only after behavioral-source review; design owner-accepted symbolic icons. No forced one-to-one or shadow opposite.
4. Research seven narcisisism-related mechanisms independently, propose evidence-based relations to each terrace with disconfirming cases; keep separate unless owner approves semantics.
5. Integrate final quiz → 21-law eligibility → three-depth SOURCE summary → avatar and ritual journeys through existing storage seams, then run actual complete user story.
6. Update handoff and two-way execution log every round; do not silently merge.

**Engineering confidence:** recorded structure 0.96; code path mapping 0.93; semantic seven-layer mapping 0.45; verified release readiness cannot be assigned until CI and live tests run.
