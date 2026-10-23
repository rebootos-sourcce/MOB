# ATÜNED Deep Psychological Layer — Build Ledger and Link Register

**Last verified:** 2026-10-22  
**Status:** ACTIVE — source population has been committed; canonical research, taxonomy reconciliation, runtime integration, and test evidence remain open.  
**Repository:** https://github.com/rebootos-sourcce/MOB  
**Default branch observed:** `main`  
**Observed tree SHA at audit start:** `0b624a0969d6989ce41825f8566c7df5200d4a01`

## Purpose and operating rule

This is the durable, AI-to-AI continuity ledger for the Deep Psychological Layer. Every meaningful change must update this file and the TDD in the same work cycle. Treat links below as repository-relative source-of-truth pointers; resolve each path against the current default branch before acting. Never rely on an old handoff ZIP as the current state of the repository.

For each build cycle, record: date, branch/commit SHA, exact paths changed, links added/changed, tests and commands actually run, exit codes, results, remaining blockers, and the next concrete action. Distinguish **verified**, **provisional**, **unresolved**, and **not run**. Do not say a check passed unless it was executed and its output inspected.

## Canonical source and implementation paths

| Artifact | Repository path | Direct link | Role / current state |
|---|---|---|---|
| Primary TDD | `docs/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md` | [Open TDD](ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md) | Architecture, acceptance gates, execution order. Must be updated alongside this ledger. |
| TDD audit addendum | `docs/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_ADDENDUM_2026-10-22.md` | [Open addendum](ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_ADDENDUM_2026-10-22.md) | Corrected denominator and current gates. |
| Registry audit | `docs/ATUNED_DEEP_PSYCHOLOGICAL_REGISTRY_AUDIT_2026-10-22.md` | [Open audit](ATUNED_DEEP_PSYCHOLOGICAL_REGISTRY_AUDIT_2026-10-22.md) | Static counts and findings; not a runtime test. |
| Population update report | `docs/ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_POPULATION_UPDATE_2026-10-22.md` | [Open population report](ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_POPULATION_UPDATE_2026-10-22.md) | Reports committed structural population of the 23 target records; semantics remain provisional/unresolved. |
| Executive handshake | `docs/ATUNED_DEEP_PSYCHOLOGICAL_EXECUTIVE_HANDSHAKE_2026-10-22.md` | [Open handshake](ATUNED_DEEP_PSYCHOLOGICAL_EXECUTIVE_HANDSHAKE_2026-10-22.md) | Context and handoff requirements for the next AI/engineer. |
| Three-pass research audit | `docs/ATUNED_DEEP_PSYCHOLOGICAL_THREE_PASS_RESEARCH_AUDIT_2026-10-22.md` | [Open research audit](ATUNED_DEEP_PSYCHOLOGICAL_THREE_PASS_RESEARCH_AUDIT_2026-10-22.md) | Research-pass evidence and unresolved source work. |
| Record/code contract | `docs/ATUNED_DEEP_PSYCHOLOGICAL_CODE_TO_REGISTRY_CONTRACT_2026-10-22.md` | [Open contract](ATUNED_DEEP_PSYCHOLOGICAL_CODE_TO_REGISTRY_CONTRACT_2026-10-22.md) | Required registry/runtime interface. |
| Registry JSON | `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json` | [Open registry](data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json) | Canonical record data; latest known commit is referenced in the population report. |
| JSON schema | `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_SCHEMA_v1.json` | [Open schema](data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_SCHEMA_v1.json) | Structural contract for registry records. |
| Template catalog | `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json` | [Open template catalog](data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json) | Template assignments and record family expectations. |
| Adapter | `proto/knowledge/src/adapt-psychological-registry.js` | [Open adapter](../proto/knowledge/src/adapt-psychological-registry.js) | Present in repository; execution and runtime integration are not yet verified. |
| Audit program | `proto/knowledge/src/audit-psychological-registry.js` | [Open audit program](../proto/knowledge/src/audit-psychological-registry.js) | Repeatable static registry audit; distinguish its output from runtime tests. |
| Source extraction / v341 evidence | [Search repository for v341 source](https://github.com/rebootos-sourcce/MOB/search?q=Mechanics+of+Being+v341&type=code) | Search link | Exact canonical source file/path must be located and verified before claims are promoted to canonical. |
| All repository files | [Repository tree](https://github.com/rebootos-sourcce/MOB/tree/main) | Repository tree | Re-resolve paths on every cycle; branch contents may change. |

## Current baseline (from committed reports; not a claim that runtime tests passed)

- Registry denominator: **125 records**.
- Families: roots 4; behavioral domains 15; archetype candidates 18; Conscious Domains 8; cultural-figure/domain mappings 12; archetype/domain mappings 18; archetype/fetter/seat mappings 18; blueprint visualization slots 14; canonical-domain candidates 18.
- The population report says all 23 target records retain their IDs and have structural fields populated. The 15 behavioral-domain records contain explicitly provisional content; the eight Conscious Domain records preserve source gaps rather than inventing canonical affirmations/names.
- The population report records 69 research-pass slots reset to pending for the 23 target records. Research must be evidence-based and each pass must be meaningfully distinct.
- Canonical approval remains 0/23 in the population report.
- The source-taxonomy discrepancy (15 behavioral-domain registry records versus 19 native domains described in the prior v341 review, plus 18/15/14 candidate counts elsewhere) is unresolved. Do not force equivalence or change record identities without source evidence.
- Adapter execution, generator/validator integration, and forward/backward runtime traversal remain unverified in the audit documents.

## Work queue and acceptance gates

| ID | Work item | Status | Completion evidence required |
|---|---|---|---|
| DP-01 | Locate exact Mechanics of Being v341 source and record exact section/heading/anchor references | OPEN | Verified source path, version, relevant section excerpts/notes, and traceable per-record citations. |
| DP-02 | Inventory the exact 23 target record IDs from the current registry | OPEN / re-verify | Generated list of all 15 behavioral-domain IDs and 8 Conscious Domain IDs, checked against current registry SHA. |
| DP-03 | Reconcile the 15-versus-19 domain taxonomy and related 18/15/14 candidate counts | OPEN | Explicit crosswalk with source evidence; unmatched entities remain unresolved, not silently dropped. |
| DP-04 | Complete three distinct research passes for each of the 23 records | OPEN | Per-record evidence, findings, source/version, and pass completion; no repeated-source padding. |
| DP-05 | Recover canonical Conscious Domain names/definitions/affirmations | OPEN | Source-backed text for each field, including the Empyrean entry; otherwise preserve a named source gap. |
| DP-06 | Validate registry JSON against the actual schema and repository validators | NOT VERIFIED | Exact command, output, exit code, commit SHA, and zero unexplained failures. |
| DP-07 | Execute adapter in Node and reconcile counts/output | NOT VERIFIED | Exact command/output/exit code and before/after counts. |
| DP-08 | Integrate adapter into generator and validator without breaking existing Nerve-to-Super-Complex behavior | OPEN | Code review plus tests showing existing graph behavior preserved. |
| DP-09 | Test typed edges, valid IDs, reciprocity where required, and forward/backward runtime traversal | OPEN | Automated tests with command, output, exit code, and commit SHA. |
| DP-10 | Run full relevant regression suite and record results | NOT VERIFIED | Actual test commands/results and any skipped tests explicitly listed. |
| DP-11 | Audit all paths, relative links, external URLs, source anchors, and artifact references | OPEN | Link-check report; broken links fixed or recorded with reason and owner. |
| DP-12 | Update this ledger, TDD, audit, population report, and executive handshake after meaningful changes | CONTINUOUS | Same-cycle commits and matching status/counts across documents. |

## Link and documentation maintenance protocol

1. Before editing, fetch the current branch and inspect this ledger, the TDD, the registry, schema, template catalog, adapter, and audit program.
2. After any path move, rename, new source, new record, or changed implementation, update every inbound Markdown reference found by repository search. Use stable repository-relative links for in-repository artifacts and full GitHub URLs for handoff destinations.
3. After every meaningful implementation cycle, verify that all linked paths exist on the current branch; validate Markdown relative links and source anchors. Do not treat a URL's syntactic shape as proof it resolves.
4. Keep source links and claims together: every canonical definition or mapping must point to exact source material and version. A general search result is not sufficient evidence.
5. Update the primary TDD and this ledger in the same cycle. If a test was not run, say **NOT RUN**; if an integration was not verified, say **NOT VERIFIED**.
6. Record the commit SHA for every implementation/documentation change. Re-check the current registry SHA before writing, to avoid applying stale counts or stale paths.
7. Do not mark the 23 records complete merely because fields exist. Separate structural population, source-backed completion, taxonomy approval, runtime integration, and test closure.

## Build-cycle log

### 2026-10-22 — tracking baseline established
- Confirmed repository paths for the primary TDD, audit addendum, registry audit, population update, executive handshake, registry, schema, template catalog, adapter, and audit program.
- Confirmed the population report describes a committed registry update at commit [f8faa88b31341b56d50dcc1751d483f9dad19675](https://github.com/rebootos-sourcce/MOB/commit/f8faa88b31341b56d50dcc1751d483f9dad19675).
- Current registry blob SHA observed through GitHub file endpoint: `84e81ccba7baa1219a198e30671254c3f14d9353`.
- This cycle creates the durable path/link register and maintenance contract. It does **not** claim the 23 records are semantically complete or that runtime tests have run.
- Next action: retrieve the full registry and v341 source, derive exact 23 IDs and source anchors, then update each record with evidence-backed findings and preserve gaps where sources are absent.

## Measurements and confidence

- Repository paths resolved in this cycle: 11 primary paths plus the repository tree.
- Records in current baseline: 125.
- Target incomplete records described by latest population report: 23.
- Canonical approvals reported: 0/23.
- Runtime integration verified: no.
- Link checker executed in this cycle: no; this document establishes the required protocol, not a completed link audit.
- Confidence in this baseline as a documentation ledger: 0.91. Confidence in semantic/source closure: low until v341 source and record-level evidence are verified.


## 2026-10-22 — exact 23-record inventory and source crosswalk
- Added [23-Record Source Crosswalk](ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_SOURCE_CROSSWALK_2026-10-22.md), commit [59ad29d](https://github.com/rebootos-sourcce/MOB/commit/59ad29d03efd0621c3607f31b7bfea6a45152b9c).
- Retrieved the 1,067,012-character registry through its Git blob endpoint and parsed it. Confirmed 125 records and enumerated all 15 `domain:01`–`domain:15` IDs plus all eight `conscious-domain:01`–`conscious-domain:08` IDs.
- Retrieved and parsed SOURCE OS CANON at `rebootos-sourcce/Reboot-OS/atuned/data/canon.json`, blob SHA `27a7a178de1e87252fa8e59554a66735dbeb0aed`. Its metadata identifies source build `MOB_Complete_v184.html`, not v341. It groups 18 domain labels: Architect (5), Engine (5), Weaver (4), Witness (4), and records the open ruling “18 in the book, 15 in the compilation, 14 in the blueprint file.”
- No `MOB_Complete_v341.html` was found in the MOB default-branch tree. Exact v341 source recovery remains a blocker; no claim is made that v341 content has been verified.
- Crosswalk preserves likely lexical leads as unapproved candidates only. Canonical semantic mappings approved: 0/23.
- Next action: recover the actual v341 source (or verifiable v341 export), then record exact section/heading/anchor and hash for every evidence claim. Until then, do not invent canonical definitions, names, or affirmations.


## 2026-10-22 — v341 source recovered from conversation upload
- **Correction:** the earlier repository-only search missed the uploaded source file. `MOB_Complete_v341.html` was already attached to this conversation. It has now been materialized and inspected directly; do not ask the user to upload it again.
- File size: 16,417,226 bytes. SHA-256: `79c8ddd9fc3ea586cec56f523351702ee1ac96336ceff39f80730582332466e4`.
- Source headings verified: Chapter 28 “The Domains” (`#ch-domains`) and Chapter 32 “The Seven Affirmations” (`#ch22`). Chapter 12’s stacking-architecture container ID must be rechecked before publishing an anchor.
- v341 gives 19 source domain labels grouped 5/5/5/4 under Architect, Engine, Weaver, Witness. It also gives all eight Conscious Domain names and definitions. See the [23-Record Source Crosswalk](ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_SOURCE_CROSSWALK_2026-10-22.md) for the extracted inventory, SHA, and unresolved contradiction.
- Source contradiction: v341 lists 19 labels but also states Power (Directed Force) and Architect (Rulership) are separate domains, while Architect is not a member of the displayed 19-label list. This requires an owner ruling; do not silently change the count or list.
- Updated closure state: v341 recovered; eight consciousness source names found; 19 domain labels found; 15-to-19 behavioral crosswalk, three-pass evidence completion, source contradiction adjudication, schema/runtime tests, and automated link checks remain open.


## 2026-10-22 — registry records updated from v341
- Updated all eight Conscious Domain registry records with v341 source-backed names and concise definition summaries. Source extraction is recorded; independent corroboration, synthesis, and canonical approval remain pending. Registry commit: [507d730](https://github.com/rebootos-sourcce/MOB/commit/507d730b837d1ed26ca5a33a7ce879d80574b843).
- Added v341 source provenance and unapproved candidate crosswalk notes to all 15 behavioral-domain records without replacing their provisional definitions or promoting mappings. Registry commit: [1ef9d6f](https://github.com/rebootos-sourcce/MOB/commit/1ef9d6faf5ec3207ee7c69bf96954f141fc2e18d).
- Crosswalk corrected to reflect that v341 was found in the conversation upload, not in repository tree search. Source SHA-256: `79c8ddd9fc3ea586cec56f523351702ee1ac96336ceff39f80730582332466e4`.
- Remaining: pass 2 and 3 for all 23 records, adjudicate domain label mismatch and Architect/Rulership contradiction, schema/runtime validation, graph traversal, and automated link check.


## 2026-10-22 — v341 record-level crosswalk execution

This entry supersedes earlier ledger lines that say the exact v341 file has not been recovered. The file was already attached to the conversation and was materialized and inspected directly.

### Source and implementation commits
- Source artifact: conversation upload `MOB_Complete_v341.html`, 16,417,226 bytes, SHA-256 `79c8ddd9fc3ea586cec56f523351702ee1ac96336ceff39f80730582332466e4`.
- Registry pass metadata commit: [3bf815f](https://github.com/rebootos-sourcce/MOB/commit/3bf815f0ef50ab706ac57bb4d32c7c12eb122136).
- Record-level crosswalk classifications commit: [e6b8bb2](https://github.com/rebootos-sourcce/MOB/commit/e6b8bb25254b524ab23518662cfce8f8abae4207).
- TDD execution update commit: [4c8e9f0](https://github.com/rebootos-sourcce/MOB/commit/4c8e9f0df44caa7124288c98ce067e5d11a10c39).
- Registry path: [ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json](data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json).
- Source crosswalk: [ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_SOURCE_CROSSWALK_2026-10-22.md](ATUNED_DEEP_PSYCHOLOGICAL_23_RECORD_SOURCE_CROSSWALK_2026-10-22.md).
- Primary TDD: [ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md](ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md).

### What changed
- Reviewed the exact 23 target records: 15 behavioral-domain records and eight Conscious Domain records.
- Recorded the v341 19-domain roster grouped as Architect 5, Engine 5, Weaver 5, Witness 4.
- Classified all 15 owner-stated behavioral labels with explicit candidate status and closure conditions. None was promoted to a canonical mapping.
- Recorded source extraction as complete for all eight Conscious Domain records, blocked independent corroboration where no independent source was established, and left synthesis/approval open.
- Preserved the v341 contradiction: the text describes “Architect (Rulership)” as separate from Power, but Architect is not a member label in the displayed 19-domain list. Owner ruling required.
- Documented that v341 attributes its twelve-archetype descriptions to Carol Pearson's formalization and practitioner observation, and says Jung did not enumerate this same twelve-item list.

### Acceptance-gate status
| Gate | Status | Evidence / remaining work |
|---|---|---|
| DP-01 exact v341 source recovery | COMPLETE | Conversation-upload file hash and chapter anchors recorded in crosswalk. |
| DP-02 enumerate 23 target IDs | COMPLETE | Registry still has 125 total records; 15 behavioral + 8 Conscious Domain IDs identified. |
| DP-03 taxonomy reconciliation | IN PROGRESS | 15 candidate classifications recorded; mappings unapproved; Architect/Rulership contradiction and compound labels need owner ruling. |
| DP-04 three distinct research passes | IN PROGRESS | Pass 1 and cross-version comparison recorded for behavioral domains; behavioral synthesis remains open. Conscious pass 2 blocked pending independent source. |
| DP-05 Conscious Domain source names/definitions | SOURCE EXTRACTION COMPLETE | Eight names and concise definitions source-backed; exact affirmation relations and independent corroboration still open. |
| DP-06 schema validation | NOT RUN | Run validator and record command, output, exit code. |
| DP-07 adapter execution | NOT RUN | Execute Node adapter and inspect output/count reconciliation. |
| DP-08 generator/validator integration | NOT VERIFIED | No integration evidence committed. |
| DP-09 typed edges and forward/backward traversal | NOT RUN | Add/execute automated tests. |
| DP-10 regression suite | NOT RUN | Run relevant suite and record skips/failures. |
| DP-11 Markdown links/source anchors | NOT RUN | Automated link check not executed; do not claim all links resolve. |
| DP-12 TDD/ledger synchronization | UPDATED THIS CYCLE | Crosswalk, TDD, ledger, and registry updated in separate commits; re-fetch and verify current blobs before next write. |

### Exact source anchors
- Chapter 12 Stacking Architecture: `#ch17` — four directive clusters and the 19-domain list.
- Chapter 28 The Domains: `#ch-domains` — observed count of nineteen and the author's explicit withdrawal of an earlier derivation of eighteen.
- Chapter 32 The Seven Affirmations: `#ch22` — eight Conscious Domain names/definitions, seven chakra-zone affirmations, and additional Pattern/Story/Imperium Consciousness entries.

### Mandatory next actions
1. Fetch the current registry and schema blobs; run actual JSON Schema validation against all 125 records. Fix any schema violations caused by this cycle before further edits.
2. Run the existing audit program and adapter; record exact commands, outputs, exit codes, and current commit.
3. Resolve the v341 19-label/Architect-Rulership contradiction with the project owner; do not invent a 20th label or silently reinterpret a root as a member domain.
4. Obtain independent source material for the eight Conscious Domain records or explicitly retain pass 2 as blocked.
5. Complete the three-pass research and adjudication evidence for all 23 records, then add runtime traversal and regression coverage.
6. Run a link/anchor audit and fix links that fail.

### Current metrics
- Registry records: 125.
- Target records enumerated: 23/23.
- v341 domain labels inventoried: 19/19.
- Conscious Domain names/definition summaries extracted: 8/8.
- Behavioral candidate classifications documented: 15/15.
- Canonical behavioral mappings approved: 0/15.
- Conscious independent corroboration complete: 0/8.
- Schema/runtime/link tests verified in this cycle: 0.
- Confidence in file identity and extracted roster: 0.98.
- Confidence in final semantic mapping: not scored; owner rulings and independent corroboration remain open.


## 2026-10-22 — target schema-shape check and full-registry blocker

- Latest registry blob SHA: `0e08a2ab98cef7f4ac925d3322793627f6a5be31`; update commit [be3efd4](https://github.com/rebootos-sourcce/MOB/commit/be3efd44fd3a8e2cd86c4d5d10932318d8ffc2af).
- Added `templateValidation.status` to the 23 target records to satisfy the required envelope field without promoting semantic content.
- Target-only structural schema check: 23/23 records checked, 0 reported shape errors, 0 invalid research-pass enum values.
- Full-registry structural check: 125 records checked, 140 reported errors outside the 23-target set. Existing failures include missing `templateValidation.status` on root/archetype/other records and non-string `signals` elements in some archetype records.
- Scope/limitation: this was a targeted checker of schema-declared types, required properties, array bounds, and enums. It was not the repository's own audit script and not a standards-complete JSON Schema validator. The full registry is **not schema-clean**.
- Crosswalk follow-up commit: [f94f6d8](https://github.com/rebootos-sourcce/MOB/commit/f94f6d829ab1effa632c851977d6a885874f53af).
- TDD follow-up commit: [a58b794](https://github.com/rebootos-sourcce/MOB/commit/a58b794563e9d18e1d948f2c76766bf387dffd20).

### Revised acceptance gates
| Gate | Status |
|---|---|
| v341 source recovery / identity | COMPLETE |
| 23 target IDs inventoried | COMPLETE |
| v341 labels and 8 Conscious Domain definitions extracted | COMPLETE |
| 15 candidate classifications documented | COMPLETE; mappings remain unapproved |
| Target-record schema shape | COMPLETE under targeted checker |
| Full registry schema validation | BLOCKED / FAILING: 140 baseline errors remain |
| Independent corroboration for Conscious Domain records | BLOCKED |
| Owner ruling on Architect/Rulership and compound labels | OPEN |
| Repository audit script / adapter / runtime traversal / regression | NOT RUN |
| Automated Markdown link and anchor checker | NOT RUN |
