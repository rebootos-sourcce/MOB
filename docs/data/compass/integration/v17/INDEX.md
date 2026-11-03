# ATÜNED Compass three-realm crosswalk — V17
**2026-11-03 | Read first for this audit.**

## Purpose
Document a source-traced, read-only crosswalk from **26 scene IDs (9 Inferno, 7 Purgatorio, 10 Paradiso)** through research record IDs, candidate archetypes and available paths to the engine's 21 integrity-law labels. This is not the separate V0.4 local service nor a production deployment, approved Canon edge set, or score formula.

## Files
- `REALM_LAYER_ARCHETYPE_LAW_CROSSWALK_V17.json`: all scene rows, typed research-only paths, source Git blob SHAs, and missing-law coverage. **Source of truth for this V17 audit.**
- `CROSSWALK_EXECUTIVE_HANDSHAKE_V17.md`: scope, measured findings, exceptions, interpretation and next seams.
- `validate_realm_crosswalk_v17.cjs`: offline consistency checks against V4 graph, without mutating it.
- `DEV_LOG_V17.md`: append-only handoff activity and open questions.
- `REVIEW_QUEUE_V17.json`: two open route gaps, source qualifications, and proposed review criteria.

## Start in source order
1. `docs/ATUNED_MASTER_FILE_INDEX.md` and its V16 override.
2. `docs/data/compass/integration/v16/ATUNED_EXECUTION_STRATEGY_AND_PROGRESS_V16.md`.
3. `docs/data/compass/integration/v4/ATUNED_UNIFIED_RESEARCH_GRAPH_V4.json` (404 nodes, 875 research/source edges; none approved as new runtime integration).
4. Realm registries and the gameboard linked by the audit's `sources` field.
5. This V17 audit, validator, and development log.

**Do not confuse the master Source index, the graph editor's proposed links, and approved runtime intelligence edges.**
