# Deep-Psychological Record Contract — Code-to-Registry Comparison
Date: 2026-10-22
Status: COMPLETE FOR STATIC COMPARISON; INTEGRATION NOT EXECUTED

## Sources inspected
- `proto/knowledge/src/gen-data.js` — blob SHA `2e9ad7e282bee49771b80909b90e83a298490ac1`
- `proto/knowledge/src/validate-templates.js` — blob SHA `2b6c46c6035973c9d2a774ec34ba0cd66e01bb13`
- `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json` — blob SHA `40d899f28e0e592a7cdf3df074ce29dd89666993`
- `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json` — blob SHA `ea76c12766f29f9a51a6ccefface85d3b3437e52`

## 1. Existing engine record contract

The generator declares these existing template kinds and fields:

| Engine kind | Existing template ID | Required fields |
|---|---|---|
| `hypercomplex` | `TPL-HYPERCOMPLEX` | nm, fam, cluster, def, body, behavior, triggerMechanism, livedExample, impact, practice, inferred, inferenceBasis, confidence, reviewStatus, oppositeId, oppositeDefinition, oppositeStatus, narrativeSource, researchSources, links |
| `nerve` | `TPL-NERVE-BRANCH` | nm, seat, fam, def, branchIndex, sourceSeat, pointCount, mappingBasis, mappedNodeIds, narrativeSource, links |
| `seat` | `TPL-SEAT` | nm, fam, def, body, links |
| `axis` | `TPL-FETTER-AXIS` | nm, seat, fam, def, card, where, says, inst, opp, links |
| `node` | `TPL-FETTER-NODE` | nm, seat, fam, def, where, card, theme, distort, axis, body, trigger, says, out, inst, opp, nextMove, narrativeSource, links |
| `sab` | `TPL-SABOTEUR` | nm, seat, fam, def, body, trigger, says, out, livedBehavior, availableState, nextMove, nids, arch, links |
| `hcx` | `TPL-HYPERCOMPLEX` | nm, seat, fam, def, sub, links |
| `complex` | `TPL-COMPLEX-UNIFIED` | nm, fam, def, body, inferred, inferenceBasis, behavior, triggerMechanism, livedExample, impact, practice, oppositeId, oppositeDefinition, oppositeStatus, confidence, reviewStatus, narrativeSource, researchSources, links |
| `inferred` | `TPL-COMPLEX-UNIFIED` | Same field set as `complex` |
| `supercomplex` | `TPL-SUPERCOMPLEX` | nm, fam, def, body, inferred, inferenceBasis, behavior, triggerMechanism, livedExample, impact, practice, oppositeId, oppositeDefinition, oppositeStatus, confidence, reviewStatus, refer, narrativeSource, researchSources, researchPasses, links |
| `mask` | `TPL-MASK` | nm, seat, fam, def, links |
| `arch` | `TPL-ARCHETYPE` | nm, seat, fam, def, links |
| `dom` | `TPL-DOMAIN` | nm, seat, fam, def, clear, dist, links |
| `term` | `TPL-GLOSSARY-TERM` | nm, fam, def, links |

The shared engine envelope is not merely a list of arbitrary descriptive properties. The existing generator assigns stable IDs and kinds, emits canonical short field names, attaches `templateId` and a template payload, and emits graph references through `links`. The validator reads generated `KBD` data from `proto/knowledge/src/data.js`; checks unique IDs, template assignment/payload, missing required fields, dangling links, required engine kinds, and reciprocal hypercomplex routes to Saboteur, Complex, and inferred counterpart records.

## 2. Static comparison with the deep-psychological registry

Current registry counts: 125 records; 125 unique IDs; 125 proposed template assignments; 23 records flagged with missing required fields; 103 records with all three research-pass slots marked complete; 0 records runtime-integrated.

The proposed psychological catalog defines nine template variants: root, owner-stated domain, canonical domain candidate, archetype candidate, Conscious Domain, cultural-figure mapping, ARCHDOM mapping, ARCH18 mapping, and Blueprint Domain visualization slot.

### Compatible conventions
- Both systems have stable IDs, a `kind`, `nm`, `fam`, `def`, and graph-link concepts.
- The psychological registry uses `links` and parent/child IDs; source-table membership is represented with explicit typed relationships and reciprocal root/domain declarations.
- The psychological records carry source references, research-pass evidence, confidence, status, unresolved questions, and change history. These are useful provenance extensions, not replacements for the engine’s required fields.

### Incompatible or incomplete conventions
1. **Template IDs are not engine IDs.** The proposed `TPL-PSYCHOLOGICAL-*` catalog is documentation-only. The current generator does not declare these IDs or these new kinds.
2. **Required fields are not aligned.** Psychological records use fields such as `definition`, `sourceRefs`, `researchPasses`, `parentId`, `childIds`, and `relationships`; engine templates require short fields such as `def`, `body`, and `links`, with different kind-specific payloads. A field being present on the registry root object does not prove that it is copied into the engine’s `template` payload.
3. **No generation route exists yet.** The current generator builds its `E` array from its existing sources and kinds. It does not import or transform the new deep-psychological registry.
4. **The closure validator is not registry-aware.** It reads only generated `data.js` and expects the seven engine kinds `node`, `sab`, `hcx`, `hypercomplex`, `complex`, `supercomplex`, and `inferred`. The 125-record psychological registry does not satisfy or exercise that runtime gate.
5. **Record population is not semantic completion.** The registry still has 23 missing required fields. The eight Conscious Domain records and fourteen Blueprint Domain visualization slots must not be made to appear complete by fabricating names, affirmations, or definitions.
6. **Graph coverage is partial.** Eighteen source-canon root/domain membership edges exist. No semantic crosswalk is approved between the 15 owner-stated behavioral domains and 18 source-canon domain candidates; the 36 ARCHDOM/ARCH18 rows are source mappings, not approved causal or hierarchy edges.

## 3. Sample field-by-field mapping

| Psychological record field | Engine equivalent | Disposition |
|---|---|---|
| `id` | `id` | Compatible; preserve stable identity |
| `kind` | `kind` | Compatible only after mapping to a supported/explicitly added engine kind |
| `nm` | `nm` | Compatible |
| `seat` | `seat` | Compatible where source-supported; never infer missing seat |
| `fam` | `fam` | Compatible, but taxonomy semantics must be preserved |
| `def` / `definition` | `def` | Map explicitly; avoid relying on duplicate fields |
| `body` | `body` | Compatible if content is source-backed |
| `links` | `links` | Compatible syntax; target existence and reciprocal rules must be validated |
| `parentId` / `childIds` | Usually `links` plus typed edge metadata | Keep typed edge metadata; do not flatten away edge semantics |
| `sourceRefs` / `sourceClaims` | `narrativeSource` / `researchSources` | Requires a deterministic provenance adapter |
| `researchPasses` | `researchPasses` only on supercomplex today; otherwise extension | Add a shared research-provenance field or extension schema; avoid silently dropping passes |
| `confidence`, `status`, `unresolvedQuestions`, `changelog` | No uniform equivalent across all current templates | Preserve as explicit extension fields or a linked provenance record |
| `templateId`, `template`, `templateValidation` | Same concepts, but IDs/required fields differ | Add an adapter and validate against the target template, not just the proposed catalog |

## 4. Required next implementation steps

1. Create a deterministic adapter from the psychological registry to the engine record envelope. Explicitly map every field and define whether extra provenance fields remain on the record, move to an extension object, or become linked provenance records.
2. Decide whether psychological record kinds are first-class new engine kinds or must map to existing `arch`/`dom` kinds. Do not overload `arch` or `dom` until semantics are approved.
3. Extend the engine's `TEMPLATE_SCHEMAS` and generation pipeline with the approved psychological templates, or introduce a separately validated registry with a documented merge contract.
4. Extend validation to check psychological template IDs, all required fields, uniqueness, source provenance, parent-child reciprocity, typed edge targets, and forward/backward reachability.
5. Keep unknown content null/blocked and fail closed. Do not auto-fill the 23 incomplete records with generated prose.
6. Run the generator and validator in a real Node environment. Capture command, commit, exit code, output, and counts. No runtime/test result is claimed by this static comparison.
7. Only after adapter and validator pass, run sample trace tests from each root to source-defined domain candidates and back, and test the existing Nerve → Node → Saboteur → Complex → Hypercomplex → Supercomplex closure independently.

## 5. Acceptance criteria for this stage

- [x] Exact existing template kinds and required fields extracted from code.
- [x] Existing validator contract extracted.
- [x] 125-record registry compared structurally against the existing contract.
- [x] Integration blockers documented without inventing equivalence.
- [ ] Adapter implemented and tested.
- [ ] New kinds/templates wired into generation.
- [ ] Runtime validator extended and passing.
- [ ] Forward/backward path tests passing.
