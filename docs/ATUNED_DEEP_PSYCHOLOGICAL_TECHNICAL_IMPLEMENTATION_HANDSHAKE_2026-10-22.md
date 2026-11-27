# ATÜNED Deep Psychological Layer, Technical Implementation Handshake
**Date:** 2026-10-22  
**Repository:** `rebootos-sourcce/MOB`  
**Companion document:** [Executive Continuation Handshake](ATUNED_DEEP_PSYCHOLOGICAL_EXECUTIVE_HANDSHAKE_2026-10-22.md)

## 1. Engineering objective

Make the deep psychological registry a validated, runtime-consumed, traversable layer in the existing ATÜNED knowledge engine. Integration must be additive and non-breaking for the experiential Nerve-to-Super-Complex graph.

Current relevant implementation:
- `proto/knowledge/src/gen-data.js`, existing experiential data generator.
- `proto/knowledge/src/validate-templates.js`, existing generated-data/template validator.
- `proto/knowledge/src/adapt-psychological-registry.js`, adapter that projects registry records into a separate `psych_*` namespace, preserving parent/child references, links, provenance, research-pass metadata, confidence, and unresolved questions.
- `proto/knowledge/src/audit-psychological-registry.js`, repeatable static registry audit, with a strict mode intended to fail while gates remain open.
- `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json`, source registry.
- `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json`, template catalog.
- `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_SCHEMA_v1.json`, record schema.

**Important state:** the adapter explicitly reports `runtimeIntegrated: false`. Its existence is not evidence that it runs in the generator. The audit script has been committed but its execution in Node has not yet been proven in the available session. Verify both in the repository environment.

## 2. Registry baseline

Expected declared inventory: **125 records**.

| Family | Count |
|---|---:|
| Roots | 4 |
| Behavioral domains | 15 |
| Archetype taxonomy candidates | 18 |
| Conscious domains | 8 |
| Cultural-figure/domain mappings | 12 |
| Archetype/domain mapping rows | 18 |
| Archetype/fetter/seat mapping rows | 18 |
| Blueprint visualization slots | 14 |
| Source OS canonical-domain candidates | 18 |
| **Total** | **125** |

Static audit findings:
- Template assigned: 125/125.
- Structurally complete per registry template-validation metadata: 102/125.
- Structurally incomplete: 23/125, comprising all 15 behavioral-domain records and all 8 Conscious Domain records.
- Behavioral-domain records: missing `def` and `body` on all 15.
- Conscious Domain records: all 8 missing required affirmation fields; 7/8 also missing `def` and `body`.
- Pass 1 marked complete: 125/125.
- Passes 2 and 3 marked complete: 103/125; 22 blocked (8 Conscious Domain records, 14 blueprint visualization slots).
- Blueprint canonical names recovered: 0/14.
- Archetype taxonomy resolved: 0/18.
- Mapping rows reviewed: 36; approved semantic edges: 0.
- Cultural figure mapping rows reviewed: 12/12; approved crosswalks: 0/12.
- Domain-count ruling unresolved; 12-, 15-, and 18-domain signals must be traced to source editions and record types.
- Static reference scan: zero dangling IDs in scanned fields, but no proof of reciprocal links, semantic correctness, or traversability.
- Runtime integration: not proven.

## 3. Baseline execution protocol

Inspect repository package scripts and project instructions before choosing commands. Do not assume an npm script name. Then:

1. Record `node --version` and package manager/version.
2. Run the audit script in report mode.
3. Run it with `--strict`; capture exit code and full output.
4. Run the existing generator and validator using the repository's declared commands.
5. Run the existing test suite before changes and preserve its baseline.
6. If a command fails, classify the failure: code defect, missing dependency, wrong invocation, source-data defect, or environment limitation.
7. Fix code/data only when evidence identifies the cause; rerun the same commands.
8. Save test output or a concise machine-readable test report in the repository.

Do not claim a command passed unless it was actually run and its exit status observed.

## 4. Adapter and runtime integration contract

Inspect the full adapter before editing. Verify:

- Input paths are repository-root-safe and independent of current working directory.
- Registry, schema, and template catalog load from the intended canonical files.
- Input validation fails closed on malformed JSON, duplicate IDs, unknown templates, and invalid required fields.
- The adapter preserves original stable IDs or applies a documented deterministic mapping into `psych_*` IDs.
- All references are transformed consistently; no edge points from a transformed ID to an untransformed ID.
- Parent/child, influence, mapping, and provenance links remain separate relationship types.
- Confidence, unresolved questions, source references, and research-pass evidence survive projection.
- Output ordering is deterministic.
- Re-running the adapter produces the same output for unchanged input.
- Existing experiential records are not overwritten, retyped, or assigned colliding IDs.
- Adapter errors are actionable and return non-zero status in CI.

Then integrate it into the generator/validation pipeline at an explicit point. Avoid an implicit side path that creates psychological output but is never consumed by runtime. Update documentation and scripts so a new developer can reproduce the generation from a clean checkout.

## 5. Required validator gates

The registry-aware validator should fail for any of the following:

1. Declared registry count differs from actual count.
2. Missing or duplicate record IDs.
3. Unknown or incompatible template assignment.
4. Missing required fields according to schema/template.
5. Invalid record-family/type pairing.
6. Dangling parent, child, influence, mapping, or provenance references where IDs are required.
7. Required reciprocal parent/child relationships are not reciprocal.
8. Unapproved semantic mappings are emitted as authoritative links.
9. A placeholder is presented as a canonical entity without provenance and an explicit resolution decision.
10. A record marked research-complete lacks evidence for the required substantive passes.
11. Psychological IDs collide with experiential IDs or output records.
12. Generated output fails deterministic or schema checks.
13. Runtime integration flag remains false while the build claims the layer is integrated.

Use explicit severity classes if some source dependencies are allowed to remain unresolved during prototype work. However, do not allow a prototype warning to be mislabeled as production acceptance.

## 6. Three substantive research passes

Every applicable record requires three distinct passes, not three empty metadata objects. Each pass should capture at minimum:

- Research question and scope.
- Source title/edition/URL or repository path and pinpoint locator.
- Evidence or a precise summary of the relevant passage.
- Findings and the resulting record changes.
- Conflicting sources or competing interpretations.
- Confidence and unresolved questions.
- Researcher/run date.
- A clear pass outcome: complete, blocked with reason, or not started.

Recommended pass separation:
1. **Pass 1, Source recovery:** identify primary source, exact terminology, edition, and direct evidence.
2. **Pass 2, Comparative validation:** compare against related ATÜNED source models and identify conflicts, duplicates, or category errors.
3. **Pass 3, Integration validation:** verify the interpretation against neighboring records, parent/child semantics, mappings, and expected traversals.

Adapt this separation where the project already defines specific pass semantics, but keep passes genuinely distinct. Never overwrite the original evidence when later passes change an interpretation.

## 7. Taxonomy and content resolution

### Behavioral domains (15)
Recover source-backed definitions and bodies for all 15. Each record must include provenance and meet the exact schema/template requirements. Do not generate generic filler to satisfy field presence.

### Conscious domains (8)
Recover canonical names, definitions/bodies, required affirmations, and source evidence. Do not infer affirmation text unless the project source explicitly authorizes synthesis; if synthesis is allowed, label it as generated and record its design rule.

### Blueprint visualization slots (14)
For each slot, decide and document one of:
- source-backed canonical blueprint entity,
- UI/visualization-only slot that should not be represented as a canonical psychological entity,
- obsolete or duplicate placeholder,
- unresolved pending source evidence.

No canonical name has yet been recovered for the 14 slots in the measured audit. Preserve slot IDs until downstream references are inspected; do not silently rename or delete them.

### Archetype and domain-count discrepancy
The registry includes 18 archetype taxonomy candidates, 15 behavioral-domain records, 18 source-OS canonical-domain candidates, and evidence of a separate 12-domain model. These are currently different record families, not proof of one shared taxonomy. Trace each to the exact source edition and determine whether the numbers describe different concepts, versions, or an actual conflict. Write a decision record with citations to source material and impact on dependent mappings.

### Mapping rows
The 18 archetype/domain rows and 18 archetype/fetter/seat rows have not yet been approved as semantic edges. The 12 cultural-figure/domain rows have not yet been approved as crosswalks. Validate each mapping independently and record:
- source evidence,
- directionality and relationship meaning,
- confidence,
- alternate interpretations,
- approval/rejection/defer status,
- affected traversals and tests.

## 8. Graph and traversal tests

Implement tests for:
- ID uniqueness across all output namespaces.
- Every required reference resolves.
- Reciprocal parent/child invariants where required.
- Mapping edges only appear as approved when explicitly approved.
- No unintended cycles in relationships that are required to be acyclic; document intentional cycles in other relationship types.
- Stable deterministic generation.
- No changes to baseline experiential records except explicitly reviewed compatibility changes.

### Forward traversal
Start at each applicable root and follow only permitted relationship types through the psychological layer toward downstream experiential nodes/action. Assert expected reachable records, path validity, and stop conditions. Do not assume every record must connect through every layer; define valid paths from source-backed model rules.

### Backward traversal
Start from each required downstream experiential/action node and traverse permitted edges back to its supporting psychological records and roots. Assert expected upstream reachability and ensure mappings do not create false lineage.

For each traversal test, store:
- starting record ID,
- allowed edge types,
- expected reachable IDs or invariants,
- actual reachable IDs,
- missing/extra paths,
- pass/fail status.

A generic graph search that returns some nodes is not sufficient; assertions must reflect the intended model.

## 9. Non-regression requirements

Before and after integration, compare:
- experiential record counts by type,
- stable IDs,
- parent/child links,
- Nerve-to-Super-Complex routes,
- hyper-complex reciprocal routes,
- generator output shape,
- current validator behavior.

Any changes to the experiential graph must be explicit, justified, and covered by tests. Psychological-layer additions should not silently modify the existing Nerve-to-Super-Complex semantics.

## 10. Completion evidence and reporting format

Every iteration should report:

1. **Changed files** and commit SHA(s).
2. **Commands actually run**, exit codes, and test results.
3. **Registry metrics** before and after.
4. **Research evidence added** and records affected.
5. **Open blockers**, with specific record IDs and required source dependency.
6. **Forward traversal** pass count and failures.
7. **Backward traversal** pass count and failures.
8. **Experiential non-regression** result.
9. **Acceptance gate percentage**, with numerator/denominator and definition.
10. **Confidence** in measured results and any limitations.

A pass rate must be computed from actual tested gates. Do not use the count of files written, records created, or research slots filled as a proxy for completion.

## 11. Immediate next actions

1. Execute the audit script under Node and verify its actual behavior.
2. Run baseline generator, validator, and tests.
3. Fix any audit-script defects and add a reproducible audit test.
4. Produce a record-ID-level missing-content report for the 15 behavioral domains and 8 Conscious Domains.
5. Locate source material for those records and fill fields with citations/provenance.
6. Resolve the 14 blueprint slots and the domain/archetype count discrepancy using source editions.
7. Complete three substantive research passes per applicable record.
8. Validate and approve mappings one by one.
9. Integrate the adapter into the generator/validator pipeline.
10. Add graph, traversal, and non-regression tests.
11. Re-run strict audit and all tests; update the audit/TDD/source index/handoffs from measured results.

## 12. Current confidence statement

The static registry inventory and listed gap counts are based on a direct parse of the 125-record registry and are considered high confidence. The runtime state, adapter execution, and graph behavior remain unverified until the commands and tests above are run. Do not describe the psychological layer as wired in or complete before those proofs exist.
