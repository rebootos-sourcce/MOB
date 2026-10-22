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
- `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json` — initial registry of 93 records/recorded mapping rows. Every record has three research-pass slots, currently pending. This is an inventory seed, not a claim of completeness or approval.

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
| **Total seeded registry entries** | **93** | Counts inventory entries, including mapping rows; not the final canonical denominator for the entire engine. |

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

- Registry seed: **93 entries created in MOB**.
- Schema: **created in MOB**.
- Three-pass research: **0/93 records completed** at registry creation; every pass is pending.
- Semantic parent/child wiring: **not started**, by design, until source-first inventory and research establish supported edges.
- Template assignment, generated runtime parity, graph traversal, and tests: **not yet run for this registry**.
- Confidence in the *inventory counts for the repository tables inspected*: high.
- Confidence that the 93 entries are the complete canonical deep-psychological denominator: low; primary-source recovery remains open.

### Immediate next execution
1. Recover canonical roots/domain/Conscious Domain source from the project's documentation and manuscript artifacts.
2. Research all 93 seeded entries in three distinct passes, prioritizing source-defined records before mapping rows.
3. Reconcile archetype taxonomy names and counts; add missing records before any graph wiring.
4. Populate complete content and templates.
5. Add typed parent/child edges, generate, test, and trace both directions.
6. Refresh this TDD, the layer-count dashboard, source index/register, and executive handshake with actual counts and test output.
