# ATÜNED Deep Psychological Layer — KPI Closure Audit
**Audit date:** 2026-10-24  
**Branch:** `atuned/deep-psyche-kpi-closure-2026-10-24`  
**Scope:** `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json` and its declared template catalog. This is the 125-record Deep Psychological registry, not proof that the entire Nerve-to-Super-Complex universe has been inventoried.

## Executive result

| KPI | Result | Status |
|---|---:|---|
| 1 — Every record exists | 125/125 unique IDs in the declared registry | **PASS — registry scope only** |
| 2 — Every record filled with research | 102/125 complete for its declared role; 23 substantive records remain open | **OPEN** |
| 3 — Required relationships linked and verified | 0 of 36 mapping rows approved as semantic edges; runtime integration not verified | **OPEN** |

The denominator of 125 is verified inside this registry: declared count and measured array count agree, and all IDs are unique. It is **not** the complete project-wide denominator. The full Nerve-to-Super-Complex entity universe and its cross-registry inventory still require reconciliation.

## Three strategy passes

### Pass 1 — Inventory and source fidelity
- Registry declared count: 125; measured count: 125; unique IDs: 125.
- Record families: roots 4; behavioral domains 15; archetype candidates 18; Conscious Domains 8; cultural-figure mappings 12; archetype/domain mappings 18; archetype/fetter/seat mappings 18; Blueprint visualization slots 14; canonical-domain candidates 18.
- Required fields are checked against the actual template catalog, not trusted solely from `templateValidation.missingFields`.
- The source extraction document identifies eight Conscious Domain names/descriptions and seven affirmation strings. The affirmation strings are present; the assignment of seven strings to seven Conscious Domains remains provisional. Empyrean has no separate chakra affirmation.
- The 18/15/14/19 domain counts are distinct source/table/display denominators; they must not be forced into one count.

### Pass 2 — Independent depth and content completeness
- Complete for declared role: 102/125. This includes 14 Blueprint records **only as non-canonical visualization-slot records**, not as named canonical domains.
- Substantive content still provisional: 23/125 — 15 behavioral-domain definitions/bodies remain provisional and source-unverified; 8 Conscious Domain records have pass 1 complete but passes 2 and 3 blocked pending independent source verification and adjudication of affirmation-to-domain assignments.
- Research-pass slots marked complete: 359/375; blocked: 16/375. A pass status is not equivalent to Canon approval or content closure.
- Archetype candidates: 18 records; six entries are explicitly provisional/not owner-dictated; canonical taxonomy resolution remains 0/18.
- Cultural-figure mappings: 12 records; approved crosswalks remain 0/12.
- Mapping rows: 36; approved semantic edges remain 0/36.
- Blueprint slots: 14/14 represented and researched as visualization slots; canonical names recovered: 0/14.

### Pass 3 — Adversarial graph and implementation audit
- Explicit relationship objects: 36; status distribution: source_backed_open_ruling=36.
- Empty `links` arrays: 103/125. These are intentional unresolved graph states, not missing records and not proof of wiring.
- Dangling references detected by the static reference scan: 0. A zero count proves ID resolution only, not semantic correctness, reciprocity, or runtime traversal.
- Runtime integration: not verified. The template catalog explicitly remains proposed/not integrated with the engine.
- The 36 root-membership relationship objects are source-backed but still marked `source_backed_open_ruling`; they are not promoted as fully adjudicated canonical edges.

## Work completed in this branch
1. Reconciled registry-level research metadata with per-record evidence: all eight Conscious Domain records now have pass 1 complete and passes 2–3 blocked.
2. Added explicit relationship-audit status to 103 records with empty links arrays. No links or semantic mappings were invented.
3. Added source/provenance metadata distinguishing source-extracted affirmation strings from provisional domain assignments.
4. Added a record-by-record CSV audit covering all 125 IDs.
5. Added a stricter audit script that checks actual template fields, pass evidence, reference resolution, and separate content/graph gates.

## Required closure sequence
1. Recover and independently verify the 15 behavioral-domain definitions and bodies against authoritative ATÜNED source; preserve the owner-stated labels separately from the 19-label v341 roster.
2. Complete the two blocked research passes for each of the eight Conscious Domains. Confirm exact source assignment of each affirmation; keep the seven crosswalks provisional until verified.
3. Reconcile the 18/15/14/19 taxonomies and decide whether the 14 Blueprint positions are purely visualization geometry or require a separately sourced semantic inventory.
4. Review and adjudicate all 36 mapping rows and 12 cultural-figure mappings; do not approve lexical-only relationships.
5. Integrate the registry/template catalog with the Nerve-to-Super-Complex generator and validator; execute the actual Node audit and test suite.
6. Verify reciprocal links, forward and backward traversal, orphan handling, and regression fixtures. Update all KPIs from fresh test output.

## Acceptance rule
Do not declare 100% until the denominator is complete across the entire required layer inventory, all required records satisfy their record-specific content/research criteria, and every required relationship is source-supported, approved where required, and proven through runtime tests.


## Follow-on integration pass — 2026-10-24
The registry and template catalog are now included in the generated `KBD` data object under separate `deepPsychologicalRegistry` and `deepPsychologicalTemplateCatalog` namespaces. The existing experiential `entries` array is left unchanged so unresolved semantic mappings are not silently promoted into the Nerve-to-Super-Complex graph.

The existing `validate-templates.js` now checks the embedded registry's unique IDs, actual template fields, blocked research records, and dangling references, and reports the open content/link counts separately. The adapter also preserves `relationshipAudit`, `affirmationAssignmentStatus`, and `affirmationSource` fields.

**Validation limitation:** these code changes have not yet been executed in a Node runtime or CI in this session. They are code-integrated but not runtime-verified. Do not mark KPI 3 complete.
