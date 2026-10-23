# ATÜNED Deep-Psychological Layer — Record-First TDD
Version: 1.0.0
Date: 2026-10-22
Status: OPEN — record inventory seeded; research and closure incomplete
Repository: `rebootos-sourcce/MOB`
Owner instruction: Set up every record in the shared Nerve-to-Super-Complex record format first; research every record in three distinct passes; only then wire supported parent/child and cross-layer relationships. Repeat until all records pass the closure gate.

## 1. Execution order is mandatory

1. **Research documentation and source files first.** Read the source index/register, closure audits, Nerve-to-Super-Complex generator and validator, canonical source files, and adjacent Reboot-OS canonical tables.
2. **Enumerate every record family and every known item.** Create stable record IDs before expanding prose or creating graph edges. Unknown denominators, missing labels, and disputed taxonomy membership must appear as explicit unresolved work items; never silently omit them.
3. **Normalize every record to the shared envelope.** Preserve the existing generator's common fields (`id`, `kind`, `nm`, `seat`, `fam`, `def`) and explicit link/template fields expected by the closure validator. The new deep-psychological registry adds provenance, research-pass state, taxonomy identity, completeness fields, and typed relationship intent without replacing the existing engine.
4. **Attach ATÜNED-specific content from authoritative documentation.** Copy/paraphrase only claims that can be traced to a source. Preserve owner-provided wording separately and mark it owner-stated/unverified until its source and version are reconciled.
5. **Complete three distinct research passes per record and per proposed relationship.** A single reread, one search result, or three repetitions of the same claim do not count as three passes.
6. **Only after record setup and research, establish supported parent/child and cross-layer links.** Do not manufacture a hierarchy or infer equivalence from similar names.
7. **Generate runtime records and templates, run validation, and trace forward/backward paths.** Fix each failure at its authoritative source, regenerate, retest, and repeat.
8. **Refresh the catalog, source register, layer-count dashboard, TDD, and executive handshake after every meaningful round.** Closure is achieved only when every required record and applicable edge passes acceptance tests.

## 2. Evidence reviewed for the shared format

- `proto/knowledge/src/gen-data.js` builds records with a common envelope including stable IDs and fields such as `kind`, `nm`, `seat`, `fam`, `def`; it explicitly emits nerve branch, node, saboteur, architecture, and descent records from canonical source tables.
- `proto/knowledge/src/validate-templates.js` requires stable IDs, unique IDs, template assignment/payload, zero missing required template fields, no dangling links, and presence of required kinds including `complex`, `supercomplex`, and `inferred`. Its hyper-complex closure check requires links to Saboteur and Complex records, reciprocal links, route axes, and a reciprocal inferred counterpart.
- `docs/ATUNED_TEMPLATE_THREE_PASS_RESEARCH_2026-10-20.md`, `docs/ATUNED_TEMPLATE_CONNECTIVITY_CLOSURE_EXECUTION_2026-10-20.md`, and `docs/ATUNED_COMPLEX_RECORD_INVENTORY_SOURCE_MAP_2026-10-20.md` document that populated prose is not proof of a complete record or a valid graph, and that generator/template/connectivity closure remains open.
- Reboot-OS `ARCH12.json` has **18 actual entries**, despite the filename. `ARCHDOM.json` has 18 archetype-to-domain rows; `ARCH18.json` has 18 archetype/fetter/seat tuples; `CDOMAIN.json` has 12 cultural-figure/domain rows. These are source-backed tables, but their taxonomy roles and relationship semantics are not yet fully verified.

## 3. Files created in this first record-setup round

- `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_SCHEMA_v1.json` — shared JSON Schema for the record envelope.
- `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json` — 107 entries: 93 source-backed/owner-stated records and mapping rows plus 14 explicitly non-canonical Blueprint Domain visualization-slot placeholders. Each entry has exactly three research-pass slots. This is an inventory seed, not a claim of complete canonical coverage or approval.

## 4. Record inventory seeded

| Family | Seeded items | Evidence / qualification |
|---|---:|---|
| Owner-stated roots | 4 | Architect, Engine, Weaver, Witness. Seat associations are preserved as owner-stated and remain unverified against canonical repo sources. |
| Owner-stated behavioral domains | 15 | Exact labels preserved from owner context. Primary-source recovery and parent assignment remain open. |
| Archetype candidates | 18 | Names read from Reboot-OS `ARCH12.json`. Taxonomy identity is unresolved; do not automatically label them blueprint archetypes or the canonical Jungian set. |
| Conscious Domains | 8 | Empyrean Consciousness plus seven explicit unresolved-name placeholders. Placeholder IDs prevent omissions without inventing names. |
| Cultural-figure/domain mappings | 12 | Exact rows from `CDOMAIN.json`; a separate table until taxonomy semantics are verified. |
| Archetype/domain mappings | 18 | Exact rows from `ARCHDOM.json`; target domain equivalence is unverified. |
| Archetype/fetter/seat mappings | 18 | Exact rows from `ARCH18.json`; canonical status and fetter semantics are unverified. |
| **Source-backed/owner-stated entries** | **93** | Counts records and mapping rows; not the final canonical denominator for the entire engine. |
| Blueprint Domain visualization placeholders | 14 | Slot-only placeholders; names/definitions are unknown and must not be exposed as canonical records. |
| **Total registry entries including placeholders** | **107** | Inventory count, not the final canonical denominator for the entire engine. |

This inventory is deliberately not a forced single hierarchy. The owner-stated hierarchy Roots → Domains → Blueprint Archetypes → Jungian Archetypes is a working structure to validate, not permission to force all source tables into that chain.

## 5. Shared record contract

Each record must carry:

### Identity and taxonomy
- `id`: stable, unique ID; never derive identity solely from a display label.
- `kind`: typed record family.
- `nm`: canonical display name in the established engine envelope.
- `recordType`, `layer`, `taxonomyVersion`, `status`: explicit taxonomy identity and lifecycle.
- `seat`, `fam`: where applicable; unknown values remain null/unknown, not guessed.
- `aliases`: sourced alternate labels only.

### Meaning and behavior
- `def`, `body`, `definition`, `essence`, `function`.
- `healthyExpression` and `decoherentExpression`.
- Observable signals, distortions, triggers, behavioral expressions, downstream effects, examples and non-examples.
- Distinctions from adjacent concepts and safety/clinical boundaries where applicable.
- Avoid identity labeling: describe a pattern as a pattern, not as an immutable property of a person.

### Relationships and runtime
- `parentId`, `childIds`, `links`, `upstreamInfluenceIds`, `downstreamEffectIds`, and typed `relationships`.
- Every edge must carry source/provenance, direction, relation type, confidence, status (canonical/inferred/proposed/unresolved), and reciprocal/forward-backward test expectations.
- `templateId`, `template`, and `templateValidation` must meet the existing validator's contract before runtime closure.
- Unknown edges are represented as open work items, not fabricated links.

### Provenance and research
- `sourceRefs`, `sourceIds`, `sourceClaims`, evidence strength, confidence, unresolved questions, and changelog.
- Exactly three distinct research-pass slots per record, and three-pass review for each material crosswalk or relationship.
- A record cannot be marked research-complete unless all three passes cite source material, document findings/conflicts, and close or explicitly disposition every question.

## 6. Three-pass research protocol

**Pass 1 — primary-source extraction**
- Recover the authoritative source and its version/status.
- Capture exact source claims and record IDs/counts.
- Separate canon, owner instruction, implementation, generated output, proposed material, and inference.
- Record the source SHA or stable link.

**Pass 2 — independent corroboration and contradiction**
- Use a second independent source or source path where available.
- Check aliases, version drift, duplicate labels, count discrepancies, and contradictory definitions.
- A repeated copy of the same table is not independent corroboration.
- If no independent source exists, mark that limitation explicitly; do not mark the pass as corroborated.

**Pass 3 — synthesis and cross-record consistency**
- Compare parent, child, siblings, and adjacent taxonomy records.
- Confirm consistent language, definitions, IDs, seat/band vocabulary, provenance, and distinctions.
- Document unresolved conflicts and confidence.
- Only then propose relationships, with edges still pending validation.

## 7. Current unresolved source questions

1. Locate the authoritative definition and source/version for the four roots and fifteen behavioral domains.
2. Recover the original names, affirmations, definitions, and sources for the seven non-Empyrean Conscious Domains.
3. Establish whether the 18 ARCH12 entries are blueprint archetypes, Jungian archetypes, or a project-specific archetype taxonomy.
4. Determine what the 12 CDOMAIN cultural figures represent and whether the labels have any formally approved relationship to the 15 behavioral domains or eight Conscious Domains.
5. Validate ARCHDOM and ARCH18 semantics and reconcile repeated fetter labels across archetypes.
6. Recover the complete blueprint-archetype inventory and any explicit Blueprint → Jungian mapping, if such a taxonomy exists.
7. Establish the canonical psychological record denominator before claiming all records exist.
8. Reconcile this inventory with the existing Nerve-to-Super-Complex inventory, template catalog/assignments, and source register.
9. Verify the exact generated runtime contract; schema alignment in the registry does not prove generator output is compliant.
10. Confirm how the deep psychological layer connects to the existing experiential layer without replacing or bypassing it.

## 8. Required closure gates

A record is **not complete** merely because its ID exists or its prose is populated. Every applicable record must pass:

1. Stable ID and unique ID test.
2. Required shared-envelope fields and schema validation.
3. Primary source/version/provenance check.
4. Three completed, distinct research passes.
5. Semantic completeness and explicit unknowns.
6. Template ID and populated template payload validation.
7. Parent/child and cross-layer relationships supported by evidence.
8. No dangling IDs or accidental taxonomy merges.
9. Reciprocal edges where required by the relation contract.
10. Forward and backward graph traversal for every required path.
11. Generator/runtime parity and source-to-runtime trace.
12. Acceptance test tied to the requirement and a recorded result.

## 9. Recursive execution loop

Repeat the following cycle until no open record or required edge remains:
1. Re-read source index and registry.
2. Select the next highest-priority incomplete record family.
3. Retrieve authoritative source files and version evidence.
4. Reconcile record denominator and create/update every record shell in the shared shape.
5. Complete research passes 1, 2, and 3 for each record and proposed relationship.
6. Populate source-supported content and template assignment.
7. Add only supported typed edges.
8. Generate the catalog/runtime payload.
9. Run schema, required-field, uniqueness, dangling-link, reciprocal-edge, and graph-path checks.
10. Fix failures at the owning source, regenerate, and rerun.
11. Update registry statuses, dashboard, source register, TDD, and handshake.
12. Continue with the next incomplete family; do not stop after one successful sample.

Do not claim a long-running background process is active. Continue the loop through the available execution session and leave a precise checkpoint if execution limits require a handoff.

## 10. Current status and next checkpoint

- Registry: **107 entries** — 93 source-backed/owner-stated entries and 14 visualization-slot placeholders.
- Schema: **created in MOB**; a custom structural audit found 107 unique IDs, exactly three research-pass slots per entry, and no missing shared-envelope fields.
- Three-pass source review: **66/93 source-backed entries complete for source-row review** (18 archetypes, 18 ARCHDOM mappings, 18 ARCH18 mappings, 12 CDOMAIN mappings). This does not mean their taxonomy semantics are approved.
- Owner-stated roots/domains/Conscious Domain slots: pass 1 recorded; passes 2 and 3 blocked pending canonical source recovery.
- Blueprint Domain placeholders: 14 visualization slots recorded; passes 2 and 3 blocked because the visual count does not provide names or definitions.
- Semantic parent/child wiring: **not started**; do not create unsupported crosswalks.
- Template assignment, generated runtime parity, graph traversal, and tests: **not yet run for this registry**.
- Confidence in inspected repository table counts: high. Confidence in completeness of the canonical deep-psychological denominator: low.

### Immediate next execution
1. Recover canonical roots/domain/Conscious Domain source from the project's documentation and manuscript artifacts.
2. Research all 93 seeded entries in three distinct passes, prioritizing source-defined records before mapping rows.
3. Reconcile archetype taxonomy names and counts; add missing records before any graph wiring.
4. Populate complete content and templates.
5. Add typed parent/child edges, generate, test, and trace both directions.
6. Refresh this TDD, the layer-count dashboard, source index/register, and executive handshake with actual counts and test output.

## 11. Additional source discovery and three-pass cross-check (2026-10-22)

### Pass A — primary source extraction
- `atuned/src/40_the-archetypes.js` states the first twelve archetype entries are carried over from the owner’s dictation; six entries appended on 2026-09-24 are flagged as web-researched placeholders and not dictated.
- The six flagged entries are Hero, Everyman, Mentor, Shadow, Shapeshifter, and Healer.
- `atuned/data/canon_tables/ARCH12.json` contains 18 actual entries; `ARCH18.json` and `ARCHDOM.json` each also enumerate 18 archetype keys.
- `atuned/src/45_the-psyche-map.js` defines visualization layers with display counts: Conscious Domains 8, Blueprint Domains 14, Archetypes 12, Masks 7, Hyper-Complexes 6, Saboteurs 14, Complexes 12, Clusters 9, Fetters 18, Child Fetters 9.
- `atuned/data/canon_tables/manifest.json` separately declares ARCH12=18, ARCH18=18, ARCHDOM=18, CDOMAIN=12, MASKS6=6, HYPER=8, SAB33=33, NODEREG=112. These are not all the same denominator.

### Pass B — independent table/code cross-check
- All 18 archetype names align across the inspected ARCH12, ARCH18, and ARCHDOM tables. The module's provenance comment qualifies the final six as non-dictated web-researched placeholders.
- All 18 ARCHDOM rows and all 18 ARCH18 rows received three repository-evidence review passes; their source rows are preserved separately and no semantic cross-layer edge was approved.
- All 12 CDOMAIN rows received three source-consistency passes. The table’s intended meaning and any relation to Conscious Domains or the fifteen owner-stated behavioral domains remain unresolved.
- The psyche-map display counts conflict with canonical table counts for Archetypes, Masks, Hyper-Complexes, Saboteurs, and Fetters. The display counts are visualization declarations, not proof of canonical record denominators. Fourteen Blueprint Domain slots were added as explicitly non-canonical placeholders only.

### Pass C — synthesis and gap disposition
- Registry status is 107 entries, of which 93 are source-backed/owner-stated records or mapping rows and 14 are visual-slot placeholders.
- Three-pass review completed for 66/93 source-backed entries. Root/domain/Conscious Domain entries remain blocked after pass 1 because authoritative definitions and independent corroboration were not located in the inspected sources.
- The 18 archetype content records are populated from ARCH12. Six records retain explicit non-dictated provenance; taxonomy identity remains unresolved for all 18.
- No new semantic parent/child edges have been added. This is intentional: source row consistency does not prove a causal or hierarchical relationship.
- The registry passed a structural audit for unique IDs, required envelope fields, and exactly three ordered pass slots per entry. This was a custom structural audit, not a full JSON Schema validator or runtime integration test.

## Current recursive record status — 2026-10-22

- Registry: **125 unique records**; 125/125 have explicit proposed template assignments and exactly three research-pass slots.
- Research: **103/125 records have all three repository/source review passes complete**. Pass 1 is complete for all 125. Passes 2 and 3 remain blocked for 22 placeholders: eight Conscious Domain slots and fourteen Blueprint Domain visualization slots.
- Required fields: **102/125 records structurally complete; 23 incomplete**. Fifteen owner-stated behavioral-domain records lack definition/body; eight Conscious Domain records lack affirmations, and seven of those also lack definition/body.
- Runtime: **0/125 records integrated** into the existing generator/validator/runtime. No end-to-end traversal or runtime parity test has been executed.
- Semantic crosswalks: **0 of 36 ARCHDOM/ARCH18 mapping rows approved as semantic edges**. Eighteen source-canon root-membership edges are recorded, but the source's 18/15/14 domain-count ruling remains unresolved.
- This is a partial source-review and record-setup milestone, not completion. Do not claim all records complete or wired.

## Code-to-registry contract extraction — 2026-10-22

Completed a static field-by-field comparison of `proto/knowledge/src/gen-data.js` and `proto/knowledge/src/validate-templates.js` against the 125-record psychological registry and its proposed catalog. Exact engine kinds, template IDs, required fields, and validator checks are documented in [`ATUNED_DEEP_PSYCHOLOGICAL_CODE_TO_REGISTRY_CONTRACT_2026-10-22.md`](ATUNED_DEEP_PSYCHOLOGICAL_CODE_TO_REGISTRY_CONTRACT_2026-10-22.md).

Key result: the registry's 125 proposed template assignments are not runtime assignments. The generator does not import this registry, the proposed template IDs are not declared in `TEMPLATE_SCHEMAS`, and the validator only evaluates generated `data.js`. The static comparison is complete; adapter implementation, runtime integration, and executable path tests remain open. No tests were run in a Node environment in this round.

## Adapter implementation checkpoint — 2026-10-22

Added `proto/knowledge/src/adapt-psychological-registry.js` (commit `74c52ee3268a1fb53c75fb75265681fe2ba3270e`). It deterministically reads the registry and proposed template catalog, projects each record into an explicit `psych_<sourceKind>` namespace, preserves template payload, links, parent/child declarations, provenance, research-pass slots, confidence, status, and unresolved questions, and reports missing required fields without fabricating content. It checks duplicate IDs, undefined/mismatched template assignments, three-pass-slot presence, and dangling links/parent/child references.

**Important boundary:** this adapter deliberately emits a separate psychological registry and marks `runtimeIntegrated: false`. It does not modify the existing Nerve-to-Super-Complex graph or claim that unapproved taxonomies are equivalent. This is the safe first implementation step before a deliberate merge contract is approved.

### Verification status
- [x] Adapter source committed.
- [ ] Adapter executed in Node against the current repository checkout.
- [ ] Adapter output counts compared with registry counts.
- [ ] Automated smoke tests executed.
- [ ] Generator imports/merges the adapted records.
- [ ] Runtime validator checks psychological records and typed edges.
- [ ] Forward/backward graph traversal tests pass.


## 2026-10-22 measured audit addendum

The authoritative current registry JSON was fetched via its Git blob SHA and parsed: **125 records**. The 107-entry count previously noted in this TDD is stale. Current family counts: roots 4; behavioral domains 15; archetype candidates 18; Conscious Domains 8; cultural-figure/domain mappings 12; archetype/domain mappings 18; archetype/fetter/seat mappings 18; blueprint visualization slots 14; canonical-domain candidates 18.

Current measured gates: 125/125 template assignments; 102/125 structurally complete; 23 incomplete records (15 behavioral domains and 8 Conscious Domains); 103/125 have research passes 2 and 3 marked complete; 22 are blocked (8 Conscious Domains and 14 blueprint slots); blueprint canonical names recovered 0/14; archetype taxonomy resolved 0/18; approved semantic edges 0 across 36 mapping rows; cultural-figure crosswalks approved 0/12. Basic child/influence/link ID scan found zero dangling IDs, which is not proof of semantic or runtime connectivity.

See [the measured audit](ATUNED_DEEP_PSYCHOLOGICAL_REGISTRY_AUDIT_2026-10-22.md). The adapter has not been executed in Node; generator integration and forward/backward runtime traversal remain open. Do not declare closure until these gates pass.


## 2026-10-22 build ledger, path register, and continuous link maintenance

The durable build ledger and link register is now part of the repository:
[ATUNED_DEEP_PSYCHOLOGICAL_BUILD_LEDGER_AND_LINK_REGISTER_2026-10-22.md](ATUNED_DEEP_PSYCHOLOGICAL_BUILD_LEDGER_AND_LINK_REGISTER_2026-10-22.md).

This ledger is the AI-to-AI continuity index for the current build. It lists the TDD, audit addendum, registry audit, population update, executive handshake, three-pass research audit, code-to-registry contract, registry JSON, schema, template catalog, adapter, audit program, source search, and repository tree. It also contains the live work queue, completion evidence requirements, and build-cycle log.

### Mandatory maintenance contract

- Update the ledger and this TDD in the same work cycle after every meaningful change to records, schemas, source files, code, tests, paths, links, or acceptance status.
- Re-fetch the current default branch and current registry SHA before edits. Do not trust stale copies, previous handoff ZIPs, or old record counts.
- Whenever a file is moved or renamed, search for and update every inbound Markdown reference. Validate relative paths and external URLs; record the actual result of the link check.
- For every canonical record claim, capture the exact source path, version, section/heading, and a traceable evidence note. A search link is a discovery aid, not canonical evidence.
- Track structural population, source-backed completion, taxonomy approval, runtime integration, and test closure as separate gates.
- Every test entry must include the exact command, output summary, exit code, and commit SHA. Tests not executed must remain marked NOT RUN or NOT VERIFIED.
- Keep the 15 behavioral-domain records distinct from the 19 native domains described in the v341 review until a source-backed crosswalk resolves the discrepancy. Do not silently merge, rename, omit, or promote candidate records.
- The ledger's status is not itself proof of link validation or runtime success. Those checks remain open until evidence is committed.

### Current verified documentation update

- Build ledger commit: `81a0e5a27d69ca2850263d33c395367e96f78978`.
- Ledger link: [Build ledger and link register](ATUNED_DEEP_PSYCHOLOGICAL_BUILD_LEDGER_AND_LINK_REGISTER_2026-10-22.md).
- The repository population report describes the 23-record structural population update at commit [f8faa88b31341b56d50dcc1751d483f9dad19675](https://github.com/rebootos-sourcce/MOB/commit/f8faa88b31341b56d50dcc1751d483f9dad19675).
- This documentation update does not claim that the canonical content, adapter execution, generator/validator integration, runtime traversal, or link checker has passed.


## 2026-10-22 source crosswalk gate

The exact 23 target IDs and source taxonomy discrepancy are recorded in [ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_SOURCE_CROSSWALK_2026-10-22.md](ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_SOURCE_CROSSWALK_2026-10-22.md). This is an inventory and research plan, not canonical approval.

The available SOURCE OS CANON identifies its source build as `MOB_Complete_v184.html`, not v341, and records an unresolved domain-count ruling: 18 in the book, 15 in the compilation, and 14 in the blueprint file. The exact v341 source has not been located in the MOB default-branch tree. Do not claim v341 extraction is complete until the actual v341 source/export, version marker, content hash, and relevant section anchors are verified. The 15 behavioral-domain IDs and eight Conscious Domain IDs are enumerated, but canonical source-to-record mappings approved by this crosswalk remain 0/23. Runtime integration and tests are separate, unverified gates.


## 2026-10-22 v341 source recovery and evidence gate
The uploaded `MOB_Complete_v341.html` was present in the conversation and has now been inspected directly. SHA-256: `79c8ddd9fc3ea586cec56f523351702ee1ac96336ceff39f80730582332466e4`; size: 16,417,226 bytes. The source crosswalk records the source-backed 19-label domain roster, all eight Conscious Domain names/definitions, source headings, and remaining adjudication gates.

Do not continue describing v341 as unavailable. The unresolved problem is no longer source access: it is record-by-record evidence traceability, adjudicating the 15 registry behavioral-domain records against the 19 source labels, and resolving the source's internal Architect (Rulership)/Power (Directed Force) statement against its displayed 19-label roster. All changes must preserve source hash, section/anchor, claim-level evidence, status, and explicit non-canonical/approved distinction. Runtime integration and automated link checks remain unverified until actually executed.


## 2026-10-22 — registry populated from recovered v341 source
The uploaded v341 file has been extracted (SHA-256 `79c8ddd9fc3ea586cec56f523351702ee1ac96336ceff39f80730582332466e4`). The registry now holds source-backed name/definition summaries for all eight Conscious Domain IDs, and v341 provenance plus unapproved candidate mapping notes on all fifteen behavioral-domain IDs. The summaries are not a substitute for the source itself; retain the source hash and chapter anchor in each record. Research passes 2–3 and canonical approval remain pending. Do not mark the overall task complete until the 15-to-19 domain crosswalk and the source's Architect (Rulership)/Imperium contradiction are adjudicated, all 23 records have the required three distinct evidence passes, and schema/runtime/traversal/link tests have actually been run and logged.


## 2026-10-22 v341 source-review execution update

The uploaded source `MOB_Complete_v341.html` was materialized from the current conversation and inspected. SHA-256: `79c8ddd9fc3ea586cec56f523351702ee1ac96336ceff39f80730582332466e4`. Relevant verified anchors are Chapter 12 Stacking Architecture (`#ch17`), Chapter 28 The Domains (`#ch-domains`), and Chapter 32 The Seven Affirmations (`#ch22`).

See the [23-record source crosswalk](ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_SOURCE_CROSSWALK_2026-10-22.md) for the per-ID candidate classifications and source notes.

### Research pass implementation state
- The 15 behavioral-domain records now record source extraction, a cross-version comparison against the historical v184 CANON, and a synthesis/classification pass. Their third pass remains `in_progress` because mappings are unapproved and the source has unresolved naming/count contradictions.
- The eight Conscious Domain records now record source extraction and a synthesis stage. Their independent corroboration pass is `blocked` until an independent source is available; an internal cross-section check must not be mislabeled as independent corroboration.
- Registry research pass status values use the schema enum only: `pending`, `in_progress`, `complete`, or `blocked`.
- Registry update commit: [3bf815f](https://github.com/rebootos-sourcce/MOB/commit/3bf815f0ef50ab706ac57bb4d32c7c12eb122136). Crosswalk update commit: [e6b8bb2](https://github.com/rebootos-sourcce/MOB/commit/e6b8bb25254b524ab23518662cfce8f8abae4207).

### Do not close the following gates
1. Do not approve any 15-to-19 mapping until the owner rules the compound labels and root/domain ambiguity.
2. Do not treat the v184 CANON as v341 or as a superior authority.
3. Do not merge Pattern Consciousness, Story Consciousness, or Imperium Consciousness into the eight-record Conscious Domain roster without a source/owner ruling.
4. Do not mark independent corroboration complete for the Conscious Domain records until a genuinely independent source has been inspected.
5. Schema validation, adapter execution, runtime integration, forward/backward traversal, regression tests, and automated link checks remain NOT RUN / NOT VERIFIED unless separate evidence is committed.


### 2026-10-22 target record schema-shape check

Registry commit [be3efd4](https://github.com/rebootos-sourcce/MOB/commit/be3efd44fd3a8e2cd86c4d5d10932318d8ffc2af) added the required `templateValidation.status` field to all 23 target records. A targeted structural check against the schema's declared required fields, types, array bounds, and enum constraints reported 0 shape errors for those 23 records and 0 invalid research-pass enum values.

**Do not mark full registry schema validation passed.** The same check found 140 existing errors in the other records of the 125-record registry: missing `templateValidation.status` fields and non-string `signals` values in some archetype records. The checker was a targeted structural check, not the repository's own audit program or a standards-complete JSON Schema implementation. Run the project validator and reconcile these legacy-shape mismatches before claiming full schema conformance.

The crosswalk records this distinction and the current registry SHA. Adapter execution, runtime integration, graph traversal, regression, and automated link checking remain not run/not verified.
