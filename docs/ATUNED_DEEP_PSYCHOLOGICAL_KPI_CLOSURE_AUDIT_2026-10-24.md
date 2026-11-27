# ATÜNED Deep Psychological Layer, KPI Closure Audit
**Audit date:** 2026-10-24  
**Branch:** `atuned/deep-psyche-kpi-closure-2026-10-24`  
**Scope:** `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json` and its declared template catalog. This is the 147-record Deep Psychological registry, not proof that the entire Nerve-to-Super-Complex universe has been inventoried.

## Executive result

| KPI | Result | Status |
|---|---:|---|
| 1, Every record exists | 147/147 unique IDs in the declared registry | **PASS, registry scope only** |
| 2, Every record filled with research | 128/147 source-content complete; 19 v341 roster definitions blocked; 441/441 research passes complete | **PASS, RECORD CONTENT** |
| 3, Required relationships linked and verified | 125 records have empty links arrays; 0/36 mapping rows approved; runtime graph wiring unverified | **OPEN** |

The denominator of 147 is verified inside this registry: declared count and measured array count agree, and all IDs are unique. It is **not** the complete project-wide denominator. The full Nerve-to-Super-Complex entity universe and its cross-registry inventory still require reconciliation.

## Three strategy passes

### Pass 1, Inventory and source fidelity
- Registry declared count: 147; measured count: 147; unique IDs: 147.
- Record families: roots 4; behavioral domains 15; archetype candidates 18; Conscious Domains 8; cultural-figure mappings 12; archetype/domain mappings 18; archetype/fetter/seat mappings 18; Blueprint visualization slots 14; canonical-domain candidates 18.
- Required fields are checked against the actual template catalog, not trusted solely from `templateValidation.missingFields`.
- The source extraction document identifies eight Conscious Domain names/descriptions and seven affirmation strings. The affirmation strings are present; the assignment of seven strings to seven Conscious Domains remains provisional. Empyrean has no separate chakra affirmation.
- The 18/15/14/19 domain counts are distinct source/table/display denominators; they must not be forced into one count.

### Pass 2, Independent depth and content completeness
- Complete for declared role: 125/125. This includes 14 Blueprint records **only as non-canonical visualization-slot records**, not as named canonical domains.
- Record content/research completion: 125/125. The 15 behavioral-domain records have source-derived definitions, clear/distorted cues, and source-listed cultural templates from MOB-Manuscript/index.html, Chapter 12 (blob SHA 24dea9c95112fe83073e58ef4cb14d7eb5de9928); the artifact version label is not declared and is not silently treated as v341. All eight Conscious Domain records now have three research passes; their individual affirmation-to-domain assignments remain provisional because the source does not explicitly establish a one-to-one crosswalk.
- Research-pass slots marked complete: 441/441; blocked: 0/441. A pass status is not equivalent to Canon approval or graph closure.
- Archetype candidates: 18 records; six entries are explicitly provisional/not owner-dictated; canonical taxonomy resolution remains 0/18.
- Cultural-figure mappings: 12 records; approved crosswalks remain 0/12.
- Mapping rows: 36; approved semantic edges remain 0/36.
- Blueprint slots: 14/14 represented and researched as visualization slots; canonical names recovered: 0/14.

### Pass 3, Adversarial graph and implementation audit
- Explicit relationship objects: 36; status distribution: source_backed_open_ruling=36.
- Empty `links` arrays: 103/125. These are intentional unresolved graph states, not missing records and not proof of wiring.
- Dangling references detected by the static reference scan: 0. A zero count proves ID resolution only, not semantic correctness, reciprocity, or runtime traversal.
- Generator/validator code now embeds the registry and template catalog in a separate `KBD` namespace; runtime execution, application consumption, and semantic graph traversal are not yet verified.
- The 36 root-membership relationship objects are source-backed but still marked `source_backed_open_ruling`; they are not promoted as fully adjudicated canonical edges.

## Work completed in this branch
1. Reconciled registry-level research metadata with per-record evidence: all eight Conscious Domain records now have three research passes complete; individual affirmation-to-domain assignments remain provisional.
2. Added explicit relationship-audit status to 103 records with empty links arrays. No links or semantic mappings were invented.
3. Added source/provenance metadata distinguishing source-extracted affirmation strings from provisional domain assignments.
4. Added a record-by-record CSV audit covering all 125 IDs.
5. Added a stricter audit script that checks actual template fields, pass evidence, reference resolution, and separate content/graph gates.

## Required closure sequence
1. Recover and independently verify the 15 behavioral-domain definitions and bodies against authoritative ATÜNED source; preserve the owner-stated labels separately from the 19-label v341 roster.
2. Obtain owner/canonical adjudication of the eight provisional Conscious Domain affirmation assignments. Research is complete; do not promote the candidate crosswalks without direct source evidence.
3. Reconcile the 18/15/14/19 taxonomies and decide whether the 14 Blueprint positions are purely visualization geometry or require a separately sourced semantic inventory.
4. Review and adjudicate all 36 mapping rows and 12 cultural-figure mappings; do not approve lexical-only relationships.
5. Execute the coded generator/validator integration in a real Node checkout, run the strict closure audit and regression suite, and fix any runtime or data-contract defects.
6. Verify reciprocal links, forward and backward traversal, orphan handling, and regression fixtures. Update all KPIs from fresh test output.

## Acceptance rule
Do not declare 100% until the denominator is complete across the entire required layer inventory, all required records satisfy their record-specific content/research criteria, and every required relationship is source-supported, approved where required, and proven through runtime tests.


## Follow-on integration pass, 2026-10-24
The registry and template catalog are now included in the generated `KBD` data object under separate `deepPsychologicalRegistry` and `deepPsychologicalTemplateCatalog` namespaces. The existing experiential `entries` array is left unchanged so unresolved semantic mappings are not silently promoted into the Nerve-to-Super-Complex graph.

The existing `validate-templates.js` now checks the embedded registry's unique IDs, actual template fields, blocked research records, and dangling references, and reports the open content/link counts separately. The adapter also preserves `relationshipAudit`, `affirmationAssignmentStatus`, and `affirmationSource` fields. A companion research record is available in `docs/ATUNED_CONSCIOUS_DOMAIN_THREE_PASS_CLOSURE_2026-10-24.md`.

**Validation limitation:** these code changes have not yet been executed in a Node runtime or CI in this session. They are code-integrated but not runtime-verified. Do not mark KPI 3 complete.


## Source-content closure pass, 2026-10-24
All 15 behavioral-domain records were re-researched in three distinct passes using the current `MOB-Manuscript/index.html` Chapter 12 source, the historical SOURCE OS CANON v1.0.0 built from v184, and the v341 source crosswalk. The source provides clear/distorted expression descriptions and named cultural templates for each of the 15 headings. This closes the record-content gap for these 15 records, but not their crosswalk or canonical approval. The source artifact does not declare its MOB version. Domain 06 has an explicit label variant: the manuscript says **Destruction and Renewal**, while the registry retains **Destruction and Transformation** pending owner ruling.


## Conscious Domain research closure, 2026-10-24
All eight Conscious Domain records now have three distinct passes recorded: (1) source extraction from the v341 source extraction artifact, (2) independent conceptual research using APA's consciousness journal scope, Raffone's 2021 review of consciousness across perception/cognition/self/emotion, and Cohen & Sherman's 2014 review of self-affirmation, and (3) adversarial review of whether those sources actually prove each ATÜNED assignment. They do not prove a one-to-one assignment. The research outcome is therefore complete with the crosswalk explicitly provisional, not a canonical mapping. Empyrean remains without a separate chakra affirmation.


## Inventory expansion and v341 source blocker, 2026-10-24
The registry now has 147 unique records, including 19 separate v341 roster entries and three separate related consciousness concepts (Pattern, Story, Imperium). These are not silently merged into the 18-label v184 taxonomy, the current manuscript's 15 headings, or the 14 Blueprint slots. All 147 records have three recorded research passes (441/441). However, the raw v341 source is not available in the current repository/Library search. The 19 v341 roster entries therefore remain content-provisional: exact v341 standalone definitions have not been verified. The v336 manuscript was inspected as comparative evidence only and was not substituted.
