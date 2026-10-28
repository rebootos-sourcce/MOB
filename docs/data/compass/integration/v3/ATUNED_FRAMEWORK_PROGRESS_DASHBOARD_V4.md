# ATUNED Compass Framework — Completion Dashboard V4
**Date:** 2026-10-27  
**Source:** GitHub records on `atuned/compass-foundation-closure-20261026` and pinned Deep Psyche branch blob `837da5d0862ca91e5e8a53a64f9505203a845148`.  
**Scope:** Compass framework and Journey, not the entire ATUNED application.

## Overall completion (planning estimate): **62%**
Workstreams contribute 20 points each. The percentage tracks source/structure/integration readiness; it is **not** runtime QA coverage or a claim that the engine is finished.

| Workstream | Score | Evidence |
|---|---:|---|
| Map and narrative structure | 20/20 | 26 game scenes and 25 navigational edges exist |
| Published, harmonized record coverage | 16/20 | Most families published; 2 standardized teachers, 6 named counterparts and canonical V1/v341 gaps remain |
| Research coverage | 17/20 | Baseline 162 research physical record instances audited; Deep Psyche 149 source records with four reviews; independent research/semantics unresolved |
| Unified cross-layer graph | 9/20 | 357 addressable graph nodes and 770 typed edges; Deep Psyche 149/149 imported into documentation; 21 cross-registry name matches not approved |
| Executable and tested Hero's Journey | 0/20 | 26 missing release protocol IDs, 26 missing becoming ritual IDs, no E2E runtime event→CQ→avatar certification |
**TOTAL: 62/100**

## Current unified graph
**357 nodes / 770 unique typed links / 8 isolated context/source records / 0 dangling / 0 duplicate IDs.**
The V1 graph had 208/562. V2 adds 149 source Deep Psyche records, 187 reciprocal relationship pairs (from 374 source entries), and 21 unapproved exact-name cross-registry candidate edges.

## Record inventory (overlapping identity classes; never sum as unique people)
| Layer | Inventory |
|---|---:|
| Inferno normalized research | 38 |
| Purgatorio research | 23 |
| Paradiso research | 10 |
| Native core archetypes | 12 |
| Shadow identities | 30 (23 public and 7 context-only) |
| Deep Psyche registry | 149 |
| Hero's Journey scenes | 26 |
| Integrity laws | 21 |
| Engine Compass poles | 14 (13 distinct teachers) |
| Standardized teacher records | 11; two missing |

## Typed graph wiring (all in research/editor, none promoted to scores)
| Edge segment | Count | Meaning |
|---|---:|---|
| `baseline` | 300 | Original Compass static research links |
| `inferno_research` | 80 | Source-candidate Inferno associations |
| `shadow_law_research` | 49 | Proposed integrity-law contrasts |
| `gameboard_navigation` | 25 | Scene order |
| `scene_source` | 26 | Scene points to its authoring record |
| `scene_crosswalk` | 6 | Behavioral Inferno/Purgatorio candidate resonance |
| `scene_archetype` | 12 | Paradiso scene/archetype candidate resonance |
| `shadow_source` | 14 | Shadow identity source-reference, not equivalence |
| `pole` | 36 | Engine teacher/pole/shadow and axis identity pointers |
| `catalog` | 14 | 14 public shadow encounter listings |
| `deep_psyche_source_branch` | 187 | 187 source-declared reciprocal Deep Psyche pairs |
| `cross_registry_lexical_candidate` | 21 | Exact-name matches ONLY, not semantic identity |
| **TOTAL** | **770** | **Unique typed research edges** |

## Runtime truth
- `atuned_src/engine/trace.js` already derives address→fetter→saboteur→complex→hyper-complex→super-complex relations dynamically **from an actual user reading**.
- The static research graph **does not** feed `traceFromRecord()`, CQ/DQ/SQ or runtime Hero's Journey.
- Deep Psyche source register on branch `atuned/deep-psyche-end-to-end-2026-10-26` has 149 template-complete records and a separate app adapter in draft PR #131, but it is not merged/deployed here.
- Exactly **26/26 scene releaseProtocolIds and 26/26 becomingRitualIds are null**. Product-level scene-to-release-to-ritual-to-CQ-to-avatar loop is NOT implemented/certified.
- Previous gameboard validator fails at the first missing release protocol ID: **an expected acceptance blocker**, not a graph file parsing failure.
- 21 name-only exact cross-namespace candidates require semantic review. Do not equate 18 candidate Deep Psyche archetypes with the 12 native archetypes.
- CI for the unified data can validate source integrity and script parsing but cannot prove browser interaction, canonical semantic approval or deployment.

## Remaining gates
1. Recover/reconcile 19 exact v341 source wordings and the missing original Inferno V1, or explicitly accept V2.
2. Adjudicate four figure conflicts, five one-sided teacher/Paradiso links and 21 cross-registry lexical match candidates.
3. Normalize missing Zoroaster and Confucius standardized teacher records and six named inverse registry memberships.
4. Resolve Super-Complex membership for actual individuals through two-or-more hyper-complex evidence and identity stabilization; do not label 23 shadow figures as approved super-complexes.
5. Resolve the owner-canonical Intention evidence input; ensure CQ formula and release lift are not double-counted.
6. Assign/validate 26 concrete safe release and becoming-ritual IDs; wire evidence→CQ→avatar and run E2E tests.
7. Merge the Deep Psyche branch when canonical and CI checks permit; run real build, browser, privacy/accessibility and deployment tests.

## Canonical artifact links
- `docs/data/compass/integration/v3/ATUNED_UNIFIED_RESEARCH_GRAPH_V2.json`
- `docs/data/compass/integration/v3/ATUNED_GRAPH_EDITOR_V2.html`
- `docs/data/compass/integration/v3/validate_unified_research_graph_v2.cjs`
- `.github/workflows/compass-unified-graph-v1.yml`
- `https://github.com/rebootos-sourcce/MOB/pull/131`

## Every-turn progress contract
Always end with: **Overall percent**, five workstream scores, **total records by family**, **node/typed-edge totals**, **wiring breakdown by segment**, **research/proposed vs approved/runtime distinctions**, **what changed this turn**, and **precise remaining blockers**. Do not claim work occurring after the turn ends.
