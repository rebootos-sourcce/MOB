# ATÜNED Deep-Psychological Record Setup — Three-Pass Research Audit
Date: 2026-10-22
Repository: rebootos-sourcce/MOB and rebootos-sourcce/Reboot-OS
Status: OPEN — record inventory seeded; source-row reviews partially complete; canonical taxonomy recovery and wiring remain open.

## Pass 1 — Primary source extraction

### MOB shared-record and closure contract
- `proto/knowledge/src/gen-data.js` establishes the existing record-envelope precedent: stable `id`, `kind`, `nm`, `seat`, `fam`, `def`, plus record-specific content and relationships.
- `proto/knowledge/src/validate-templates.js` requires stable/unique IDs, explicit template assignment and payload, no missing template fields, no dangling links, required kinds, and reciprocal closure for selected hyper-complex routes.
- `docs/ATUNED_TEMPLATE_THREE_PASS_RESEARCH_2026-10-20.md` and the Complex Record Inventory source map warn that generated prose or populated tables do not prove template or graph closure.
- Created shared JSON Schema and registry:
  - `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_SCHEMA_v1.json`
  - `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json`
  - `docs/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md`

### Reboot-OS psychological and adjacent taxonomy evidence
| Source | Observed evidence | SHA |
|---|---|---|
| `atuned/src/40_the-archetypes.js` | First twelve archetypes identified as owner-dictated; six appended entries are explicitly flagged web-researched/not dictated | `e6a7dd0b5891fed6e9903b28e0f7ac00f2a21049` |
| `atuned/src/45_the-psyche-map.js` | UI visualization layers and declared marker counts; not a canonical semantic record register | `9cd5d9b93ce3522b9f7c523efdfe6ee6fe1bc9d6` |
| `atuned/data/canon_tables/ARCH12.json` | 18 archetype content records despite filename | `2294d2a0bdde603e331a45e2f1f4785571719fff` |
| `atuned/data/canon_tables/ARCH18.json` | 18 archetype/fetter/seat tuples | `dc4a5713c70c63d93569226b7e2cdb3dc29299a6` |
| `atuned/data/canon_tables/ARCHDOM.json` | 18 archetype/domain mappings | `cc2cec9775282a658625b1f4435ee2e04ecb300b` |
| `atuned/data/canon_tables/CDOMAIN.json` | 12 cultural-figure/domain mappings | `e825043f9601fe8ff4a7dc08ccacdeaab668bd91` |
| `atuned/data/canon_tables/HYPER.json` | 8 entries in the Reboot-OS hyper-complex table | `a5235a8cdbda8dbfdcb68a003b42e7d8d08bb7f9` |
| `atuned/data/canon_tables/MASKS6.json` | 6 named masks | `f755b1ffa48cf0bb993ed4c8777711f18dabc82` |
| `atuned/data/canon_tables/SAB33.json` | 33 Saboteur entries | `73eca795255cb3124a6ee56af1509ff92b2c3dcf` |
| `atuned/data/canon_tables/NODEREG.json` | 112 Fetter/node entries | `8a2daa54b9a94dc9df6136f4a39a62bc57a6d9a3` |
| `atuned/data/canon_tables/manifest.json` | Declared row counts and table meanings; source for denominator cross-checks | `9cc010fac9b46e27e90594167de3ed5cdf89c680` |

## Pass 2 — Independent source/table cross-check

1. The 18 archetype names align across ARCH12, ARCH18, and ARCHDOM.
2. The source module identifies six entries as provisional web research rather than owner dictation: Hero, Everyman, Mentor, Shadow, Shapeshifter, and Healer. Their prose remains reviewable draft content, not owner-authored canon.
3. All 18 ARCHDOM rows were checked against the archetype-name table and the owner-stated behavioral-domain labels. Similar labels are not exact taxonomy equivalence; no semantic edge was approved.
4. All 18 ARCH18 rows were checked against the archetype-name table and SAB33 fetter labels. Exact label presence does not prove that the tuple is causal, hierarchical, or canon-approved.
5. All 12 CDOMAIN rows were compared against the separate domain label vocabulary. The table’s intended semantics and any crosswalk to the eight Conscious Domains remain unresolved.
6. The Psyche Map UI declares: Conscious Domains 8; Blueprint Domains 14; Archetypes 12; Masks 7; Hyper-Complexes 6; Saboteurs 14; Complexes 12; Clusters 9; Fetters 18; Child Fetters 9. The canonical table manifest separately lists ARCH12=18, ARCH18=18, ARCHDOM=18, CDOMAIN=12, MASKS6=6, HYPER=8, SAB33=33, and NODEREG=112. The UI counts cannot be substituted for source-backed record counts.
7. Fourteen Blueprint Domain slot placeholders were added to the registry to preserve the UI declaration and expose the missing names. They are marked `visual_slot_only_unresolved`; they are not canonical domain records.

## Pass 3 — Synthesis and record consistency

### Current registry
- **107 registry entries total**:
  - 93 owner-stated/source-backed records and mapping rows.
  - 14 Blueprint Domain visualization-slot placeholders.
- **66 of 93 source-backed entries** have three source-review passes complete:
  - 18 archetype content records.
  - 18 ARCHDOM mappings.
  - 18 ARCH18 archetype/fetter/seat rows.
  - 12 CDOMAIN cultural-figure/domain rows.
- The remaining 27 owner-stated roots, behavioral domains, and Conscious Domain slots have pass 1 captured. Passes 2 and 3 are blocked because authoritative definitions and independent corroboration were not located in the inspected sources.
- The 14 Blueprint Domain slot placeholders have pass 1 complete; passes 2 and 3 are blocked because no names or semantic definitions are present in the visual layer declaration.
- A custom structural audit confirmed 107 records, 107 unique IDs, all shared-envelope fields present, and exactly three ordered research-pass slots per entry. This was not a full JSON Schema validator run.
- No semantic parent/child links were created. No generator/runtime integration test was run for the new registry.

## Explicitly unresolved decisions and retrieval blockers

1. Recover authoritative source wording for the four roots, fifteen behavioral domains, and eight Conscious Domains.
2. Recover all fourteen Blueprint Domain names and definitions, or determine that the 14 is only visual geometry and retire the placeholder slots with a recorded owner/source decision.
3. Determine whether the archetype content set is the blueprint taxonomy, Jungian taxonomy, or a project-specific set. Do not infer this from filename or visual layer.
4. Reconcile the 12-vs-18 archetype visualization/table discrepancy; six source records are intentionally flagged as non-dictated.
5. Reconcile Masks 7 vs 6, Hyper-Complexes 6 vs 8 (and MOB’s separate six-item HCX library), Saboteurs 14 vs 33, and Fetters 18 vs 112.
6. Recover the intended meaning of CDOMAIN and verify the source authority of its cultural-figure mappings.
7. Define/verify the template assignment and runtime target for these records; registry field alignment alone does not wire the runtime.
8. Only after source and taxonomy decisions, add typed parent/child relationships and run forward/backward traversal, dangling-link, reciprocal-link, template, and runtime-parity tests.

## Next recursive execution

1. Search the full source HTML, manuscript repository, canonical JSON/SQLite artifacts, and relevant project files for the missing root/domain/Conscious Domain/Blueprint Domain definitions. Record exact locations searched and content retrieved; do not treat connector retrieval failure as proof of absence.
2. Update the 27 blocked owner-stated records when primary source evidence is recovered; finish their passes 2 and 3.
3. Resolve or formally disposition the 14 Blueprint Domain placeholders.
4. Reconcile visualization and canonical table counts with source/version evidence.
5. Populate complete templates, then add only supported typed relationships.
6. Integrate registry generation into the existing engine/knowledge pipeline, run the closure validator and tests in an actual runner, and verify forward/backward paths.
7. Refresh the registry, source register, source index, dashboard, TDD, and handshake after every round.

## Status statement

Record shells and an initial set of source-backed content are now committed. The deep-psychological layer is **not complete or wired**. This audit records partial execution and a reproducible checkpoint; it does not claim a background recursive job is running.
