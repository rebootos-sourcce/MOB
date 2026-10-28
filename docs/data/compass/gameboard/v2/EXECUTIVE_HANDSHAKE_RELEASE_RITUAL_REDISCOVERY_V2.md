# ATUNED — 26 Hero's Journey Release/Ritual Reconciliation V2
**Date:** 2026-10-27  
**Repository:** `rebootos-sourcce/MOB` / `atuned/compass-foundation-closure-20261026`  
**Evidence scope:** Existing engine functions and release/ritual content in MOB, with an independent inventory of Reboot-OS source material.  
**Status:** **26/26 dynamic release routes + 26/26 dynamic ritual routes SOURCE-VERIFIED.** Fixed per-user instance IDs remain intentionally null. Browser-level outcome, scene-specific canonical protocols and CQ/Avatar chain are not certified.

## Executive correction
The statement "26 missing release protocols" was inaccurate. The source-level `GAMEBOARD_MAP_V1.json` intentionally leaves `releaseProtocolId` and `becomingRitualId` null, while the **shipped 26-scene** `atuned_src/engine/data/hero_journey.js` snapshot already assigns `protocol:"relPick"` and `ritual:"ritStartPlan"` to every scene, together with `DYNAMIC_PROFILE_DEPENDENT_NOT_FIXED_CONTENT_ID` status.

**Runtime release path:** `Scene → hjReleaseAddresses(scene) → SI law seat → W held/confirmed imprints (cf, sq≥4; top 3) → User presses Review → relPick(ids) → existing release meter and reframe.` If no eligible imprint is present, the action is unavailable.

**Runtime ritual path:** `Scene → hjRitualCandidate(scene, compute()) → first qualifying SI law/seat → ritFor({darkB:seat,DQ}) → user starts 7-day ritual → ritStartPlan({steps:[practice.k],band,track,days:7})`. If current user pacing has no recommended practice, the action is unavailable.

**Not equivalent:** A function entrypoint is not an approved per-scene canonical `Protocol` instance. A teacher's named starter `recipeRitual(id)` is a reusable recipe, not an automatic gameboard assignment. New per-user records must still be created/accepted and validated through existing user action/state transitions.

## Existing scene mappings from shipped runtime
| Scene ID | Behavior/scene | Existing release path | Existing ritual path | Activation |
|---|---|---|---|---|
| `game:inferno:L09` | Treachery | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:inferno:L08` | Fraud | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:inferno:L07` | Harmful Force | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:inferno:L06` | Epistemic Rigidity | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:inferno:L05` | Reactivity | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:inferno:L04` | Resource Fixation | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:inferno:L03` | Consumption | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:inferno:L02` | Entitlement | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:inferno:L01` | Nonengagement | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:purgatorio:P01` | Pride → Humility | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:purgatorio:P02` | Envy → Charity / Kindness | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:purgatorio:P03` | Wrath → Meekness / Forbearance | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:purgatorio:P04` | Sloth / Acedia → Zeal / Diligence | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:purgatorio:P05` | Avarice / Prodigality → Generosity / Stewardship | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:purgatorio:P06` | Gluttony → Temperance / Sufficiency | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:purgatorio:P07` | Lust → Chastity / Respectful Intimacy | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD01` | Chosen Commitment | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD02` | Humble Contribution | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD03` | Reciprocal Love | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD04` | Truthful Inquiry | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD05` | Principled Courage | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD06` | Just Leadership | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD07` | Quiet Presence | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD08` | Hopeful Connection | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD09` | Coherent Alignment | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |
| `game:paradiso:PD10` | Unity | relPick → hjReleaseAddresses | ritStartPlan → hjRitualCandidate | conditional |

## Existing MOB teacher ritual templates (39)
`atuned_src/engine/data/teachers_recipes.js` includes **39 unique recipe IDs** across **14 poles / 13 teachers**. All 39 starter rituals reference valid source library practice keys (17 baseline + 8 teacher practices + 28 recipe extensions). Every recipe is flagged `draft:true` until reviewed; three home poles use their own non-needle routes.

| Pole | Ritual count | IDs |
|---|---:|---|
| IL | 3 | `IL-give`, `IL-need`, `IL-alone` |
| RE | 3 | `RE-hold`, `RE-changed`, `RE-jaw` |
| DE | 3 | `DE-want`, `DE-enough`, `DE-pull` |
| OR | 3 | `OR-rule`, `OR-plan`, `OR-stand` |
| PO | 3 | `PO-cut`, `PO-small`, `PO-own` |
| PE | 3 | `PE-name`, `PE-match`, `PE-see` |
| TR | 2 | `TR-land`, `TR-tell` |
| CH | 3 | `CH-move`, `CH-ten`, `CH-feel` |
| FL | 3 | `FL-move`, `FL-call`, `FL-other` |
| AL | 3 | `AL-line`, `AL-said`, `AL-owe` |
| HO | 3 | `HO-stop`, `HO-wait`, `HO-rest` |
| SA | 2 | `SA-hand`, `SA-name` |
| TU | 3 | `TU-plain`, `TU-end`, `TU-both` |
| NA | 2 | `NA-tend`, `NA-season` |

Also in MOB:
- `atuned_src/ui/release.js`: reusable bilateral Release → Reframe system; current user-specific meter IDs are not static scene IDs.
- `atuned_src/engine/practice.js`: Goal/Protocol/ProtocolStep/Ritual/PracticeEvent state machine; stored accepted protocols and scheduled rituals require IDs and provenance per user.
- `atuned_src/engine/data/cards.js`: owner-derived 3C/release card and nine-axis generator; not a hardcoded one-scene-per-card assignment.
- `atuned_src/engine/hero_journey.js`: `hjReleaseAddresses` / `hjRitualCandidate` read actual user's signals and current pacing.
- `atuned_src/ui/hero_journey.js`: existing user-triggered calls `relPick(ids)` and `ritStartPlan(...)`.
- `docs/data/compass/integration/v1/TEACHER_POLE_SOURCE_AND_RECIPE_JOIN_V1.json`: 14 pole → teacher/opposite → recipe IDs; classified as source-referenced, not canonical runtime game scene assignment.

## Existing Reboot-OS source depot
- `rebootos-sourcce/Reboot-OS/atuned/data/letgo/letgo_cards.json`: **233** legacy release-card source items, blob SHA `85f3fe9f06f88ca6e7c095b25d8b17f40aecc412`. They are source assets, not 233 certified app protocol objects.
- `atuned/data/canon_tables/PRACTICE.json`: 17 older practice-library entries, source SHA `d192108fa1e320fdcf2f6d81b764afc1596e007a`.
- `atuned/data/canon_tables/CRITUAL.json`: 12 historical teacher ritual entries, source SHA `0e22ac085880942860aeb8816d9c36c287149b69`, primarily affirmation/action pairs rather than uniquely scheduled gameboard ritual instances.
- Additional `atuned/data/letgo/letgo_join.json`, `letgo_fetter_join.json`, `LETGO.json` preserve release-to-fetter research but do not create automatic source-supported scene→fetter associations.

## Source-backed graph/editor
- `docs/data/compass/integration/v3/ATUNED_UNIFIED_RESEARCH_GRAPH_V3.json`: **398 nodes and 861 typed research/source-reference links**, including **52** new scene→existing function references and **39** pole→starter recipe links. They remain `notRuntime:true` because the graph is documentation. Existing runtime methods are separately active.
- `docs/data/compass/integration/v3/ATUNED_GRAPH_EDITOR_V3.html`: self-contained graph explorer, all sourced IDs and links, drafts exported separately.
- `docs/data/compass/gameboard/v2/validate_gameboard_existing_routes_v2.cjs`: verifies each source scene, function entrypoint and conditional guard and checks starter recipe step IDs.
- `docs/data/compass/gameboard/v1/validate_gameboard.cjs`: earlier contradiction fixed; validates intentionally nullable content IDs and verifies a dynamic route is present.
- `docs/data/compass/integration/v3/validate_unified_research_graph_v3.cjs`: checks source blob SHA, typed edges, editor parity, and no false runtime promotion.

## Not yet proven
1. The authoring TDD's **approved scene-specific Purgatorio release contract** has not been established. Dynamic release selection is current runtime; fixed content-level approval is an additional policy decision.
2. The 39 teacher rituals are reusable starters, not all automatically applicable to any scene or user. Source-approved `scene → exact teacher ritual` semantic links remain open.
3. Real browser end-to-end tests with empty vs loaded profiles, denied actions, read/save/replay, CQ model 3, Source AI, consent, and Avatar progression have not passed in this turn.
4. Do not create 26 fake protocol records, automatically approve mappings, or count each historical release card as a released pattern.

## Canonical accounting
- Runtime scene route references: **26 release + 26 becoming = 52/52**.
- Existing recipe templates: **39/39** referenced from 14 Compass poles in research graph.
- Per-user Protocol instances preallocated in static gameboard: **0**, by design.
- Approved one-to-one scene↔specific reusable recipe/protocol relationships: **0**, pending source and semantics.
- Real user-flow browser acceptance: **NOT VERIFIED**.
