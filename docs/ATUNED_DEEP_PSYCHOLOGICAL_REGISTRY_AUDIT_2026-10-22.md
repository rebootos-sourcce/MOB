# Deep-Psychological Registry Audit, 2026-10-22

Status: OPEN. Static registry audit completed; runtime execution and integration remain unverified.

## Method
Retrieved the full JSON through Git blob SHA after the ordinary file-content endpoint returned an empty body. Parsed the 1,050,307-character registry and counted its records directly. This is static analysis, not execution of the Node adapter.

## Verified inventory

| Record family | Count |
|---|---:|
| Psychological roots | 4 |
| Behavioral domains | 15 |
| Archetype candidates | 18 |
| Conscious domains | 8 |
| Cultural-figure/domain mappings | 12 |
| Archetype/domain mapping rows | 18 |
| Archetype/fetter/seat mapping rows | 18 |
| Blueprint visualization slots | 14 |
| Canonical-domain candidates | 18 |
| **Total** | **125** |

The registry's declared count is also 125. The earlier 107 count was stale/incomplete.

## Findings
- Template assignments: 125/125.
- Structurally complete according to registry validation metadata: 102/125.
- Incomplete records: 23/125. These are all 15 behavioral-domain records and all 8 conscious-domain records. The behavioral domains lack `def` and `body`; conscious-domain records lack required affirmation fields, and seven also lack `def` and `body`.
- Research pass 1 marked complete: 125/125.
- Research passes 2 and 3 marked complete: 103/125; 22 remain blocked. These are the eight conscious-domain records and fourteen blueprint visualization slots.
- Blueprint canonical names recovered: 0/14. These slots are visualization placeholders, not established canonical records.
- Archetype candidates with three passes and semantic fields populated: 18/18; canonical taxonomy resolved: 0/18.
- Mapping rows reviewed: 36; approved semantic edges: 0.
- Cultural-figure mappings reviewed: 12/12; approved crosswalks: 0/12.
- Canonical-domain candidates reviewed: 18/18; domain-count ruling remains unresolved.
- A basic scan of child IDs, influence IDs, and links found no dangling IDs. This does not prove semantic validity, reciprocal parent/child correctness, or runtime traversal.
- Runtime integration remains false/not wired.

## Required interpretation
Do not invent definitions, affirmations, canonical names, or mapping semantics to fill gaps. Preserve source-backed facts, owner-stated language, unresolved taxonomy questions, and visualization-only placeholders as distinct states. A research-pass slot marked complete is not sufficient without distinct evidence and findings.

## Next actions
1. Recover source-backed definitions for the 15 behavioral domains and canonical Conscious Domain names/affirmations.
2. Recover blueprint domain names; do not promote visualization slots to canonical entities without evidence.
3. Resolve the 18-versus-15-versus-14 domain-count conflict using underlying source editions and document the ruling.
4. Validate all 125 records against the JSON Schema and template catalog; produce a record-by-record missing-field report.
5. Execute the adapter in Node and capture command, exit code, output, and commit SHA. The available GitHub connector does not provide a Node runtime, so this gate remains open.
6. Add registry-aware generator/validator integration without breaking the experiential Nerve-to-Super-Complex graph.
7. Validate approved relationship targets and reciprocity; run forward/backward traversal tests for every approved edge.
8. Update the TDD, checkpoint, source index, and executive handshake from one consistent measured snapshot.

## Gate status

| Gate | Result |
|---|---|
| Registry denominator | PASS: 125 verified |
| Template assignment | PASS: 125/125 |
| Required content | OPEN: 23 incomplete |
| Three research passes | OPEN: 22 blocked |
| Canonical taxonomy | OPEN |
| Approved semantic mappings | OPEN: 0 currently approved |
| Basic dangling-ID scan | PASS: 0 found in scanned fields |
| Adapter execution | NOT VERIFIED |
| Engine integration | NOT DONE |
| Runtime traversal | NOT VERIFIED |
| Overall closure | OPEN, NOT COMPLETE |

This audit supersedes earlier estimates of the registry denominator. It does not claim content, research, semantic wiring, or runtime closure.


## 2026-10-22, Fresh full-blob recursive audit

### Reproducible baseline
- Registry blob fetched by exact Git blob SHA: `0e08a2ab98cef7f4ac925d3322793627f6a5be31`.
- Parsed current registry JSON: 125 records; declared count 125; unique IDs 125; duplicate or missing IDs: 0.
- Record families: roots 4, behavioral domains 15, archetype candidates 18, conscious domains 8, cultural-figure mappings 12, archetype/domain mappings 18, archetype/fetter/seat mappings 18, blueprint visualization slots 14, canonical-domain candidates 18.
- `templateValidation.contentStatus`: {"complete":102,"provisional_content_populated":15,"source_extracted_cross_record_review_pending":8}.
- All 125 records have exactly three research-pass slots and nonempty top-level `sourceRefs`, `sourceClaims`, and `sourceIds` arrays. However, only 88/125 satisfy the stronger evidence gate that all three passes are marked complete and each has at least one source and finding. 37 records remain below that gate.
- Cross-record target scan across `parentId`, `childIds`, `upstreamInfluenceIds`, `downstreamEffectIds`, `links`, and relationship `fromId/toId` fields found no dangling IDs. Parent/child reciprocity check found no mismatches for explicit `parentId/childIds` edges. This is a structural scan, not proof of semantic correctness or runtime behavior.
- The earlier draft of this audit incorrectly counted empty arrays as missing fields. Recomputing against the adapter's exact predicate (field absent, null/undefined, or empty string; empty arrays are allowed) finds **8 records with missing adapter-required fields**, exactly `conscious-domain:01` through `conscious-domain:08`, each missing `affirmation`. All 125 template assignments resolve to a catalog template and all 125 record/template `kind` pairs match. This exact-predicate check is static analysis of the registry and catalog; the Node adapter itself has not been executed.

### Exact records not yet meeting the three-pass evidence gate
| Record ID | Pass states |
|---|---|
| `domain:01` | P1:complete, P2:complete, P3:in_progress |
| `domain:02` | P1:complete, P2:complete, P3:in_progress |
| `domain:03` | P1:complete, P2:complete, P3:in_progress |
| `domain:04` | P1:complete, P2:complete, P3:in_progress |
| `domain:05` | P1:complete, P2:complete, P3:in_progress |
| `domain:06` | P1:complete, P2:complete, P3:in_progress |
| `domain:07` | P1:complete, P2:complete, P3:in_progress |
| `domain:08` | P1:complete, P2:complete, P3:in_progress |
| `domain:09` | P1:complete, P2:complete, P3:in_progress |
| `domain:10` | P1:complete, P2:complete, P3:in_progress |
| `domain:11` | P1:complete, P2:complete, P3:in_progress |
| `domain:12` | P1:complete, P2:complete, P3:in_progress |
| `domain:13` | P1:complete, P2:complete, P3:in_progress |
| `domain:14` | P1:complete, P2:complete, P3:in_progress |
| `domain:15` | P1:complete, P2:complete, P3:in_progress |
| `conscious-domain:01` | P1:complete, P2:blocked, P3:in_progress |
| `conscious-domain:02` | P1:complete, P2:blocked, P3:in_progress |
| `conscious-domain:03` | P1:complete, P2:blocked, P3:in_progress |
| `conscious-domain:04` | P1:complete, P2:blocked, P3:in_progress |
| `conscious-domain:05` | P1:complete, P2:blocked, P3:in_progress |
| `conscious-domain:06` | P1:complete, P2:blocked, P3:in_progress |
| `conscious-domain:07` | P1:complete, P2:blocked, P3:in_progress |
| `conscious-domain:08` | P1:complete, P2:blocked, P3:in_progress |
| `blueprint-domain-slot:01` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:02` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:03` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:04` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:05` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:06` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:07` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:08` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:09` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:10` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:11` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:12` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:13` | P1:complete, P2:blocked, P3:blocked |
| `blueprint-domain-slot:14` | P1:complete, P2:blocked, P3:blocked |

### Audit interpretation correction
The previous audit narrative reported 103 records with passes 2 and 3 complete. The fresh JSON shows only 88 records with all three pass statuses complete; the stronger evidence gate above is 88. Those are different metrics and must be named separately. The 15 behavioral-domain records have pass 3 marked `in_progress`; the eight Conscious Domain records include blocked pass 2 and in-progress pass 3; all fourteen blueprint slots have blocked pass 2 and pass 3. These are the known 37-record research backlog.

### Execution state
- Block 1: PASS for fresh JSON inventory, stable ID count, family counts, and static edge existence checks; repository tree/file SHA capture and source inventory remain partial.
- Block 2: PARTIAL. 102 records are marked complete in registry metadata and 23 are not. The template catalog's non-empty-array policy needs a field-by-field contract decision; no content is auto-filled merely to satisfy empty `links` arrays.
- Block 3: OPEN. Source citations are present but research-pass completion and source-to-record semantic validation remain open for 37 records. The 15/18/19/14 taxonomy conflict remains unresolved.
- Blocks 4-5: PARTIAL static edge-existence and explicit parent/child reciprocity scan only; runtime traversal and full edge-type/cardinality audit not run.
- Block 6: OPEN; Node adapter/audit program and test suite have not been executed in a checkout.
- Block 7: OPEN for record repairs; this audit addendum is a documentation correction only.
- Block 8: NOT STARTED.

No canonical names, definitions, affirmations, or mapping edges were invented to improve counts. The next content batch is the 15 behavioral domains and 8 Conscious Domains, using the exact v341 source plus independently corroborating sources and preserving unresolved mappings as unresolved.


### Correction, adapter predicate exactness
The adapter does not treat an empty array as missing. A prior sentence in this audit addendum incorrectly said 103 records were flagged by the adapter; that number was produced by a separate stricter local diagnostic which counted empty arrays. The adapter-equivalent result is 8 records, each a Conscious Domain missing `affirmation`. The 23 registry content-status gaps and the 37 three-pass evidence-gate backlog remain separate metrics.


## 2026-10-22, Research pass 3 completed for the 15 behavioral domains

The registry now records pass 3 as `complete` for all 15 behavioral-domain records. Each pass already contained at least one v341 source reference, a record-specific candidate classification/finding, and an explicit unresolved taxonomy/alias conflict. This is completion of the research synthesis, **not** approval of any mapping or verification of the provisional behavioral definitions. Their content remains provisional, with canonical approval pending.

- New registry blob SHA: `de50d80b932701dd73f8df596420bf5bbdb219af`.
- Fresh full-blob parse: 125 records, 125 unique IDs.
- Records meeting the strict three-pass evidence gate: 103/125 (up from 88).
- Remaining strict research backlog: 22 records, consisting of 8 Conscious Domains and 14 blueprint visualization slots.
- Content-status metadata remains 102 `complete`, 15 `provisional_content_populated`, and 8 `source_extracted_cross_record_review_pending`.
- Conscious Domain pass 2 remains blocked because same-file comparison is not independent corroboration; all eight lack authoritative affirmation text and must not receive invented affirmations.
- Blueprint slots remain non-canonical visualization placeholders. No names or definitions were fabricated.


## 2026-10-22, Recursive pass 2 results and explicit source gaps

- The registry remains 125 records / 125 unique IDs.
- 117/125 records now have three research passes marked complete with source and finding entries. This includes 14 blueprint records whose research is complete specifically as non-canonical visualization slots; it does **not** mean there are 14 named domains.
- The 15 behavioral-domain records have three-pass synthesis marked complete but remain provisional; the 15-to-19-domain crosswalk is not approved.
- The eight Conscious Domains remain the sole three-pass research backlog: pass 1 is source-crosswalk extraction, pass 2 is blocked because no independent source was found that corroborates their exact proprietary definitions/affirmations, and pass 3 is not closed until the source/affirmation gap is resolved.
- All eight Conscious Domain `affirmation` fields are now explicitly null in both top-level and nested template payloads, and the template validation records the missing field. This is an honest schema gap, not an empty-string workaround.
- The available SOURCE OS CANON is derived from v184 and cannot independently validate the v341 Conscious Domain taxonomy. Generic scholarly literature can contextualize consciousness/compassion/creativity but does not establish the exact proprietary definitions.
- Registry commit: `68d2346c0150b934c786c932ef75d5ef140cb23e`.
- Static dangling-reference scan still returns zero for `parentId`, `childIds`, `links`, `upstreamInfluenceIds`, and `downstreamEffectIds`; runtime graph behavior is not verified.
- Runtime integration, executed Node tests, complete typed-edge reciprocity, and final regression remain open.
