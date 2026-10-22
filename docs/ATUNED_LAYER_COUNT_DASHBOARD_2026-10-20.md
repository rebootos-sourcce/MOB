# ATÜNED Layer Count Dashboard — 2026-10-20

**Status:** OPEN. This is the current source-backed count snapshot, not a completion declaration.  
**Rule:** Refresh this dashboard and the TDD/work log after every meaningful change and at every thread handoff. Remove an outstanding flag only after verification. Never claim a persistent monitoring agent is active unless one is configured and tested.

## Required quick count on every round

| Layer / record family | Count currently supported by inspected source | Record/template completion | Status |
|---|---:|---|---|
| Nerve artwork branches | 72 | Not audited as individual framework records | Count confirmed by opening comment in atuned_src/engine/data/nerves.js; generator now assigns stable branch IDs and joins each branch to nodes sharing its seat band |
| Nerve-branch-to-node seat crosswalk | 72 branches represented as generated `nerve:*` records; 1,118 seat-level branch→node edges expected across 108 somatic nodes | Generator now emits branch records and reciprocal branch/node links; not yet regenerated or validator-tested | IMPLEMENTED IN GENERATOR SOURCE; execution verification OPEN. This is a seat/band crosswalk, not a one-to-one anatomical mapping. Four field anchors have no nerve branch mapping. |
| Nodes / addresses | 112 | Individual completeness not audited | Count supported by atuned_src/engine/data/nodes.js; includes 108 somatic nodes and 4 field anchors in prior audit |
| Fetters / emotional axes | 9 | Record-level coverage not audited | SNIFFER_SPEC.md identifies nine emotional axes as fetters; full record inventory and mapping completeness remain OPEN |
| Saboteurs | 33 | Record/template coverage not fully audited | Canonical SAB33 table; required record-level validation remains OPEN |
| Ordinary complexes | Total unverified; at least 1 explicit definition located | Generated complex records: 0 in inspected proto/knowledge generator path; complete source records/templates unverified | OPEN — Narcissism is explicitly typed as kind 'complex' in compass.js; do not infer total from this one hit |
| Hyper-complex modes | 6 | Record/template coverage not fully audited | SNIFFER_SPEC.md names six modes; this is a separate layer from ordinary complexes |
| Super-complexes | **UNVERIFIED** | Record/template coverage not audited | Psychopathy is disputed by owner and must not be counted as super-complex |
| Inferred records | Denominator unverified | Not audited | Must list individually and mark as inferred, with provenance and confidence |

## Sources to re-fetch and reconcile

- atuned_src/engine/data/nerves.js — SHA fc85b609ffba8cd1a24105fa9dec829f6a12b082
- atuned_src/engine/data/nodes.js — SHA 51e73e4c6061da77c629861ca7fc1b1b5de747eb
- atuned_src/engine/data/canon.js — SHA e7aa11668008aa145e47f023c622ef026e1c662f
- atuned_src/engine/data/compass.js — SHA b165e957b4c0db8dea75de8caf1f9f4b3ebc0282
- SNIFFER_SPEC.md — SHA ea172cd3ac68ebfd6212eb010f1f5724d1026cec
- proto/knowledge/src/gen-data.js — SHA 65e6a7f8377d0f3bc437094f0f0c1eb175cc4c8c
- proto/knowledge/src/validate-templates.js — SHA 78b2c8039b61605256cf3e6b25ff18a82b8246b
- docs/ATUNED_COMPLEX_RECORD_INVENTORY_SOURCE_MAP_2026-10-20.md — complex source map, candidate classification, and next actions

## Wiring / connectivity snapshot

**Overall graph status: OPEN — full-framework connectivity is not yet proven.** This section distinguishes relationships encoded by source fields or generator logic from relationships verified in the generated knowledge-base graph. A source field is not proof that every target exists or that the generated edge is valid.

| From | To | Wiring currently evidenced | Verification status |
|---|---|---|---|
| Node/address | Emotional axis/fetter | Node records carry a canonical axis reference (`c` in source; generator reads `n.cf`) and generated node content routes to the linked axis when one is assigned | Partial; every node target and null/unresolved exception must be audited |
| Saboteur | Node/address and its linked child/axis | Generator derives saboteur records from `ALL_SAB`, its node IDs, and corresponding child records | Generator logic exists; full generated edge coverage and dangling references not yet verified |
| Saboteur | Hyper-complex mode | Saboteur source rows carry an `hcx` classification, and generator looks up the matching `HCX_LIB` entry | Intended relation evidenced; every saboteur-to-mode target must be validated |
| Hyper-complex mode | Complex / higher-order descent | `SNIFFER_SPEC.md` defines bias → fetter → saboteur → complex → hyper-complex; `compass.js` currently labels Narcissism (complex), Machiavellianism (hyper complex), and Psychopathy (super complex), but the owner rejected Psychopathy's super-complex classification; do not treat that label as canon | Conceptual hierarchy evidenced; complete record-level edges not verified |
| Ordinary complex | Generated knowledge-base record/template | Validator requires kind `complex`, but inspected `gen-data.js` path does not emit ordinary complex records | **Gap confirmed in inspected generator path** |
| Super-complex | Generated knowledge-base record/template | Validator requires kind `supercomplex`; a source entry exists in `compass.js` | Record emission and links not verified |
| Nerve branch | Node/address, fetter, saboteur, complex | Nerve artwork has 72 branches; a complete crosswalk from every branch into the framework was not established in this audit | **Unverified; requires explicit nerve-to-character/record crosswalk** |
| Template | Each required record | Validator checks template ID/payload, required fields, duplicate IDs, and dangling links | Validator exists; a successful run against freshly generated current data has not been established here |
| Framework-wide links | All applicable records and layers | No complete source-backed edge inventory with expected-versus-present counts is currently available | **OPEN — do not describe the framework as fully wired** |

### Required wiring audit

For each source and target layer, produce an edge register with: `source_id`, `relationship_type`, `target_id`, source provenance, whether the target exists, whether the edge is emitted, and validation result. Report counts as **expected edges / emitted edges / verified edges / dangling edges / unresolved exceptions**. Include node-to-axis, node-to-nerve, saboteur-to-node/fetter, saboteur-to-hyper-complex, complex-to-hyper-complex, higher-order descent, template-to-record, and any canon-defined links. A null source field must remain an explicit exception until canon resolves it; do not invent a target.

## Completion fields required per layer

For each layer, the next verified dashboard must record: canonical expected count; unique IDs/names; records present; records substantively complete; templates present and complete; source provenance; relationship edges expected/present/verified; outstanding IDs; unresolved exceptions; validation command and result. A layer is not complete merely because the source has a list or a generator has a schema.

## Execution order (P0)

1. Reconcile all canonical source inventories and establish denominators for every layer.
2. Create/complete all required records and templates.
3. Inventory and wire relationships only after the records are accounted for.
4. Run record, template, dangling-reference, graph-integrity, and navigation tests.
5. Update this dashboard, master TDD, gap register, source index, audit log, executive handshake, and handoff ZIP in the same checkpoint.
6. Do no unrelated work until the all-layer gate passes or the owner explicitly changes priority.

## Automation limitation

This document establishes the update rule; it does not itself create continuous monitoring or cross-thread synchronization. No persistent monitoring agent has been configured or tested in this change. Until such an agent is actually configured and verified, refresh these counts during each work round and verify them at thread startup/handoff.


### Complex template checkpoint — 2026-10-20

- Generator now defines a shared `TPL-COMPLEX-UNIFIED` template for both `complex` and `inferred` records.
- Shared fields include the definition/body, explicit inferred flag and inference basis, opposite record ID, opposite definition, opposite-resolution status, provenance, and links.
- The source-defined `Narcissism` descent record is emitted as a complex record with the shared template fields. Its opposite remains explicitly unresolved because no authoritative opposite definition was found in the inspected source; no opposite was invented.
- The descent's `Machiavellianism` and `Psychopathy` entries have implementation labels that require owner-taxonomy reconciliation. Psychopathy is not an approved super-complex and must not be counted as one. Neither entry is counted as an ordinary complex.
- **Not yet verified:** regenerated output, validator results, full complex denominator, full inferred-complex inventory, and authoritative opposites. Do not mark the complex layer complete until these are resolved.


## Complex content population checkpoint — 2026-10-20

### Source-defined higher-order entries now populated

The source registry `atuned_src/engine/data/compass.js` carries substantive template content for three DESCENT entries. Narcissism is labeled complex and Machiavellianism hyper-complex in the implementation. Psychopathy's implementation label is disputed by the owner and is not approved taxonomy. Each has definition, behavior, trigger/mechanism, lived example, impact, practice, a named working counterpart, confidence, review status, and external research URLs. These are content records, not a claim that the full complex inventory has been found.

### Explicit inferred counterpart records

The generator now emits three separate inferred counterpart records and reciprocal edges:
- `opposite:Narcissism` — Grounded Self-Worth
- `opposite:Machiavellianism` — Transparent Reciprocal Agency
- `opposite:Psychopathy` — Empathic Accountability

All three are marked inferred working counterparts, not canonical one-to-one opposites. Their links return to the matching descent record. Template content includes inference basis, behavior, trigger/mechanism, lived example, impact, practice, confidence, review state, provenance, and research sources. The higher-order descent entries include the same detail fields in their generated template payloads.

### Verification boundary

Source and generator edits are committed. The generated `data.js` has not yet been regenerated and the validator has not yet been run in this execution, so runtime template coverage and edge validation remain pending. The full denominator of all canonical and inferred complexes remains unknown. Pass B and Pass C review remain open.

## Nerve-to-node crosswalk — implementation checkpoint

- Branch source: `atuned_src/engine/data/nerves.js`, 72 coordinate branches.
- Node source: `atuned_src/engine/data/nodes.js`, 112 records (108 somatic nodes in seven bands, plus 4 field anchors).
- Generator change: `proto/knowledge/src/gen-data.js` now loads the nerve artwork source, emits one `nerve` record per branch with a stable seat-local ID, adds a `TPL-NERVE-BRANCH` payload, and emits reciprocal links between branch records and nodes sharing the corresponding band.
- Seat alias mapping: `eye → 3rd Eye`; `root → Root`; `sacral → Sacral`; `solar → Solar`; `heart → Heart`; `throat → Throat`; `crown → Crown`.
- Expected seat-level edges: Root 400; Sacral 112; Solar 192; Heart 165; Throat 108; 3rd Eye 36; Crown 105; total **1,118 branch-to-node edges**. These are calculated from branch counts × node counts per matching band.
- Scope limitation: this creates a framework topology by shared seat/band, not evidence that each artwork branch is an anatomically identified nerve or has a uniquely established relationship to each node. Four field anchors are outside the seven seat bands and remain unlinked to nerve branches.
- Verification state: source changes re-fetched and string-checked. Generator execution and validator run remain unverified; do not call this runtime-tested or fully closed until executed.

## Fetter-to-Saboteur wiring — implementation checkpoint

- Updated `proto/knowledge/src/gen-data.js` so node records read the canonical axis from the source node's `c` field (rather than the non-existent `cf` field).
- Added reciprocal links from each Saboteur to every canonical fetter axis represented by the Saboteur's explicit `nids` through the linked node records. The axis also links back to that Saboteur.
- This is a source-derived graph: Saboteur → its declared node IDs → each node's canonical axis. It does not infer additional relationships beyond the committed `nids` and node axis values.
- Generator and validator still require execution; this source-level wiring is not yet runtime verified.

## Complex-to-Saboteur wiring — 2026-10-20

- Updated `proto/knowledge/src/gen-data.js` to add reciprocal links between the three populated DESCENT records and Saboteurs whose explicit node IDs intersect declared provisional axis routes.
- Provisional route axes: Narcissism → Shame, Fear, Control, Insecurity; Machiavellianism → Fear, Control, Shame; Psychopathy → Fear, Control, Shame, Anger.
- Each complex record carries `routeAxes` and `routeBasis` so the mapping is inspectable. These are provisional routing relationships, not canonical claims; expert/source review is still required.
- Source wiring is implemented. Generated edge counts and validator status are not yet confirmed by execution.


## Hyper-complex population checkpoint — 2026-10-20

- Canonical modes: Grandiosity (Cluster I / Narcissism), Predatory (II), Collapse (III), Rigidity (IV), Dysregulation (V), Dissociation (VI), from `SNIFFER_SPEC.md` section 5.
- Generator source defines six `hypercomplex:<name>` records with `TPL-HYPERCOMPLEX` and substantive working content.
- Generator source defines six `inferred:hypercomplex-inverse:<name>` counterpart records. Each is marked inferred and paired reciprocally; these are working hypotheses, not canonical opposites.
- Validator now requires the `hypercomplex` record kind. Grandiosity links to the source-defined Narcissism entry. Direct parent mappings for modes II–VI remain unresolved.
- Research sources support adjacent schema-mode constructs only; they do not establish these ATÜNED modes as diagnoses or one-to-one clinical equivalents.
- **Source-defined count: 6 modes + 6 inferred counterparts. Generated output and validator pass remain unverified by execution.**

## Hypercomplex-to-complex connectivity closure — 2026-10-20

- Updated `proto/knowledge/src/gen-data.js` to give all six hypercomplex modes explicit provisional axis routes and connect each mode to Saboteurs sharing the route's canonical node IDs. Because the populated complex records already link to routed Saboteurs, each mode also receives links to reachable populated complex records.
- Added reciprocal edges for hypercomplex ↔ Saboteur and hypercomplex ↔ complex routes. The existing inferred counterpart links remain reciprocal.
- Updated `proto/knowledge/src/validate-templates.js` to fail if a hypercomplex mode lacks route axes, a Saboteur route, a populated complex-layer link, reciprocal route edges, or its reciprocal inferred counterpart.
- These are **provisional ecosystem routes**, not canonical parent-complex assignments or clinical equivalences. Direct parentage for Predatory, Collapse, Rigidity, Dysregulation, and Dissociation remains unresolved and must not be described as canon.
- **Implementation committed; execution status remains unverified.** The generator and validator have not yet been executed in this environment, so do not report the graph as runtime-validated until the validator passes.


## Owner taxonomy correction — 2026-10-20 (overrides earlier dashboard wording)

- **Psychopathy is not an approved super-complex.** The owner explicitly rejected that classification. The `kind: 'super complex'` label in `atuned_src/engine/data/compass.js` is an implementation label, not approved canon; it must not be used to establish the super-complex count.
- **Canonical super-complex count remains UNVERIFIED.** Recover the owner's list from Mechanics of Being and the ATÜNED app/codex sources before creating or classifying those records.
- Full-file review of `compass.js` identified distinct candidate source families: 8 mirror pairs (16 poles), 9 circles, 6 behavioral-cascade states, 4 blueprint patterns, and the 3-item DESCENT registry. These are not interchangeable categories. Do not assume any family is the super-complex list without authoritative source evidence.
- The previous dashboard statement that Psychopathy is a confirmed super-complex is superseded by this correction. Preserve the history but use this correction for all current decisions.
- The root `source.html` retrieval returned no usable body text through the current connector, and the referenced `MOB-Manuscript` README path was inaccessible. Treat these as source-retrieval blockers, not as absent content.
- Before starting super-complex work, complete the layer-by-layer inventory for nerves, nodes, fetters, saboteurs, ordinary complexes, and hyper-complexes, and reconcile all candidate source families against the authoritative owner-defined taxonomy. Keep the super-complex phase gated until that is complete.


## Owner-directed phase-order correction — 2026-10-20

**Active phase is now Super-Complex source reconciliation and design.** The owner explicitly directed that Super-Complex work begin before the remaining lower-layer closure audit. The previous dashboard execution order is retained as the deferred post-discussion closure plan, not as a gate preventing current Super-Complex work.

Read [ATUNED_SUPER_COMPLEX_PHASE_HANDSHAKE_2026-10-20.md](ATUNED_SUPER_COMPLEX_PHASE_HANDSHAKE_2026-10-20.md) first. It contains the full source-first startup sequence, source authority hierarchy, candidate-family breakdown, and retrieval protocol.

### First-read blockers
- Required exact source `MOB_Complete_v341.html` has not yet been recovered through the last retrieval path; v336/v2 staging material is not a substitute.
- Large root `source.html` body and referenced `MOB-Manuscript` README were not retrievable via the connector used. This is not proof of absent source content.
- The owner-defined eight ordinary Complexes and original semantic nerve-to-character mapping still require authoritative source locators.
- General Super-Complex membership rule and canonical denominator remain unresolved.
- Psychopathy as a canonical Super-Complex is **rejected by owner**; do not count or promote it because of the current `compass.js` label.

No completion percentages should be calculated from unverified denominators. Current counts above remain evidence snapshots, not closure claims.

## Deep-psychological layer record setup — 2026-10-22

| Family | Seeded records/rows | Research status | Wiring status |
|---|---:|---|---|
| Owner-stated roots | 4 | Pass 1 captured; passes 2–3 blocked pending canonical source recovery | Parent/child links not assigned |
| Owner-stated behavioral domains | 15 | Pass 1 captured; passes 2–3 blocked pending canonical source recovery | Parent/child links not assigned |
| Archetype candidates from Reboot-OS ARCH12.json | 18 | All three repository-evidence passes complete; six explicitly non-dictated placeholders; taxonomy identity unresolved | No forced blueprint/Jungian equivalence |
| Conscious Domains | 8 slots | Pass 1 captured; passes 2–3 blocked; seven names unresolved | No crosswalk assigned |
| CDOMAIN cultural-figure mappings | 12 | Three source-consistency passes complete; table semantics unresolved | No crosswalk assigned |
| ARCHDOM archetype/domain mappings | 18 | Three source-consistency passes complete; target taxonomy equivalence unverified | No semantic edges approved |
| ARCH18 archetype/fetter/seat mappings | 18 | Three source-consistency passes complete; mapping semantics unresolved | No semantic edges approved |
| Blueprint Domain visualization placeholders | 14 | Pass 1 confirms only a visualization count; passes 2–3 blocked | Slot-only, non-canonical |
| **Source-backed/owner-stated entries** | **93** | **66/93 three-pass source reviews complete** | **No new semantic edges verified** |
| **Registry total including visualization placeholders** | **107** | **All records remain open for canonical completeness/approval** | **Not wired to runtime** |

The Psyche Map visualization also declares counts that conflict with canonical table counts: Archetypes 12 vs 18 source entries; Masks 7 vs MASKS6=6; Hyper-Complexes 6 vs HYPER=8 and a separate MOB six-item HCX library; Saboteurs 14 vs SAB33=33; Fetters 18 vs NODEREG=112. Treat these as version/visualization discrepancies, not interchangeable denominators. See ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md and data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json.
