# ATUNED Framework — Completion Dashboard V5
**As of:** 2026-10-27  
**Branch:** `atuned/compass-foundation-closure-20261026`  
**Planning readiness:** **67/100**, up from 62/100. **Not a production quality, clinical validity, or deployment certification.**

## Score card
| Workstream | Score | Why |
|---|---:|---|
| Map and narrative structure | 20/20 | 26/26 scene records and 25 sequence edges |
| Published, harmonized record coverage | 16/20 | 39 teacher ritual IDs sourced; remaining cross-version harmonization and semantic approvals unresolved |
| Documented research coverage | 17/20 | Existing research registries and Deep Psyche 149-record four-pass review; source independence/canon still open |
| Unified cross-layer research graph | 10/20 | 398 nodes/861 unique research/source refs; 26 release +26 ritual existing runtime entrypoint links, 39 named recipe sources |
| Executable and verified Hero Journey | 4/20 | 26/26 existing dynamic release and ritual methods pass static and isolated conditional routing tests; real browser, saved event replay, CQ→Avatar and full accepted per-user instance flow not verified |
| **TOTAL** | **67/100** | Five equally weighted workstreams |

## Current unified graph
**398 graph nodes / 861 unique directed typed research/source references / zero duplicate node IDs / zero dangling endpoints.**
Previous V2 graph: 357 nodes, 770 edges. **V3 adds 41 existing-method or teacher-ritual reference nodes and 91 sourced links.**

### Exact wiring to source
| Edge category | Count |
|---|---:|
| `baseline` | 300 |
| `inferno_research` | 80 |
| `shadow_law_research` | 49 |
| `gameboard_navigation` | 25 |
| `scene_source` | 26 |
| `scene_crosswalk` | 6 |
| `scene_archetype` | 12 |
| `shadow_source` | 14 |
| `pole` | 36 |
| `catalog` | 14 |
| `deep_psyche_source_branch` | 187 |
| `cross_registry_lexical_candidate` | 21 |
| `runtime_route_source_references` | 52 |
| `teacher_recipe_source_references` | 39 |
| **TOTAL typed reference links** | **861** |

Graph source code and editor are documentation-only (`notRuntime:true` on these imported edges). This does not undo the already implemented `atuned_src/engine/trace.js` runtime graph.

## Source inventory
| Subsystem | Found / status |
|---|---|
| Deep Psyche source | **149 records**, **187 reciprocal graph pairs**; separate source branch, deployment not certified |
| Inferno | **38** documented records, **80** research associations |
| Purgatorio | **23** research records |
| Paradiso | **10** research records |
| Shadow archetype atlas | **30** identities (23 public and 7 context) |
| Native archetypes | **12** |
| Integrity laws | **21** |
| Hero's Journey | **26** scenes / **25** nav edges |
| Compass poles | **14** / **13** distinct teacher names |
| MOB teacher starter rituals | **39 unique recipe IDs**, step keys verified |
| MOB practice library | **17** core entries + **8** teacher practices + **28** recipe extension practices |
| Reboot-OS historical release cards | **233** source cards; not 233 approved engine protocol objects |
| Reboot-OS historical teacher rituals | **12** teacher action/affirmation records, not fixed scene instances |

## The source-backed correction: 26 alleged missing protocols
- **26/26 scenes already route to `relPick`**, using `hjReleaseAddresses` to select confirmed, relevant held addresses (or refuse when none are eligible).
- **26/26 scenes already route to `ritStartPlan`**, using `hjRitualCandidate` / `ritFor` to select a practice under current pacing (or refuse when none).
- The `atuned_src/engine/data/hero_journey.js` source snapshot declares the same existing two methods on all 26 records. The user action interface calls those methods.
- **39/39 named teacher recipe IDs** exist in `atuned_src/engine/data/teachers_recipes.js`, attached to 14 poles. The scene-to-specific-teacher recipe link is intentionally **not** an automatic assumption.
- **26/26 `releaseProtocolId` and 26/26 `becomingRitualId` still equal null** in V1 gameboard because those would be fixed per-scene content/accepted user protocol instances. **Their null values do not indicate absent shared release implementations.**

### Validation
- Latest confirmed successful CI run: [Compass Unified Research Graph V1–V3](https://github.com/rebootos-sourcce/MOB/actions/runs/40615613591).
- It checks source SHA, 398/861 source projection, editor JS parsing, 39 practice-step IDs, 26 runtime scene release/ritual references and isolated conditional/no-eligible-data behavior.
- Real browser click-through and production event/CQ/Avatar replay remain **NOT CERTIFIED**. CI is evidence of static/isolated routing, not of user-experience or deployed equivalence.

## Next exact acceptance gates
1. Review safe scene-specific protocol/capacity matching before approving particular release/teacher recipe IDs. Preserve the existing dynamic fallback rather than creating phantom Protocol entities.
2. Validate actual browser action for a user with no eligible imprints, a user with imprints, low practice tier, and a user who refuses/interrupts a ritual.
3. Validate persistence and trace of release/reframe → accepted/scheduled ritual → practice event → 21 laws / canonical Intention → CQ → avatar with no double counting or unjustified automatic CQ adjustment.
4. Resolve source-version uncertainties: exact 19 v341 domain definitions, four figure mismatches, five teacher/Paradiso one-sided links, archival Inferno V1 status and cross-branch merge.
5. Check PR #131 merge/deploy and user-visible production route; do not call source-only validation a deployed feature.

## Read order / handoff
1. `docs/data/compass/gameboard/v2/EXECUTIVE_HANDSHAKE_RELEASE_RITUAL_REDISCOVERY_V2.md`
2. `docs/data/compass/gameboard/v2/GAMEBOARD_EXISTING_RELEASE_RITUAL_BINDINGS_V2.json`
3. `docs/data/compass/integration/v3/ATUNED_UNIFIED_RESEARCH_GRAPH_V3.json`
4. `docs/data/compass/integration/v3/ATUNED_GRAPH_EDITOR_V3.html`
5. `docs/data/compass/integration/v3/validate_unified_research_graph_v3.cjs`
6. `docs/data/compass/gameboard/v2/validate_gameboard_existing_routes_v2.cjs`
7. `atuned_src/engine/hero_journey.js`, `atuned_src/ui/hero_journey.js`
8. `atuned_src/ui/release.js`, `atuned_src/ui/ritual.js`
9. `atuned_src/engine/data/teachers_recipes.js`, `atuned_src/engine/practice.js`

## Required every-turn status line
**Completion 67%; 398 nodes; 861 typed research/source links; 26/26 existing release routes; 26/26 existing ritual routes; 39 teacher recipe IDs; no fixed scene instance IDs preallocated; full production end-to-end not certified.**
