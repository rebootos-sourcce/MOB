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
