# ATÜNED Master Index
**Version:** 0.2  
**Last reconciled:** 12 October 2026  
**Status:** Working index; cross-repository and website inventory remains partly incomplete. Fresh evidence is in [ATUNED Execution Refresh](ATUNED_EXECUTION_REFRESH_2026-10-12.md); where older snapshots conflict, the refreshed checkpoint controls.  
**Purpose:** First stop for every engineering thread. This index points to the authority for decisions, code, content, backlog, and release evidence. It must be updated when work changes.

[P0 Execution Backlog — block-by-block closure and exit tests](P0_EXECUTION_BACKLOG_2026-10-12.md) is the active execution contract. Update its existing blocks when new gaps are found; do not create duplicate plans or restart discovery.

## Current verified checkpoint — 12 October 2026 UTC

| Workstream | Exact evidence | Current status |
|---|---|---|
| Master index | [Draft PR #69](https://github.com/rebootos-sourcce/MOB/pull/69), branch `docs/atuned-master-index-20261012`; last observed green workflow [#38284558034](https://github.com/rebootos-sourcce/MOB/actions/runs/38284558034) on pre-refresh head `fefa661f450f77b3a0a70456c9c202d7a534a6e7` | OPEN / DRAFT. This refresh adds documentation commits; verify the workflow on the final updated head before any merge decision. Deployment was skipped on the observed PR workflow |
| MOB client | [PR #66](https://github.com/rebootos-sourcce/MOB/pull/66), head `9280501683d07867c72bc582cba62fe9aed00d49`; [run #38199490611](https://github.com/rebootos-sourcce/MOB/actions/runs/38199490611) | 30/30 jobs passed; functional browser gate 2,622/2,622. PR remains OPEN / DRAFT; no deploy from this pull-request run |
| Reboot-OS gift contract + public canon guard | [PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35), current head `39cde03898543aca4e4d3a33774095117a8526f7`; [server #38283599925](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38283599925), [smoke #38283606361](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38283606361) | Server 147/147 tests passed; smoke 840 passed / 0 failed; 44 screenshot surfaces captured; both Worker dry-runs passed. Draft/open/unmerged; production steps skipped |
| External Cloudflare check | `Workers Builds: atuned-os`, current build [0caff241-0bd3-453e-a86d-985e0b839726](https://dash.cloudflare.com/b34a8a4f24d5ac71f7b386c240a6da90/workers/services/view/atuned-os/production/builds/0caff241-0bd3-453e-a86d-985e0b839726) | **FAILED** on PR #35 head `39cde03898543aca4e4d3a33774095117a8526f7`; zero annotations. Read-only health probe: `atuned-api` = 200, `atuned-os` = 404. Investigate target/config mismatch, but first failing build step still requires authenticated dashboard logs |
| Canonical starter gift | [MOB issue #58](https://github.com/rebootos-sourcce/MOB/issues/58) | 0 owner-approved stable IDs out of required 100; no active production manifest; migrations 0017/0018 not applied |
| Persisted Alpha journey | Required browser → Worker → Supabase write/read/reload path | 0/1 independently verified for the current release; UNVERIFIED |

These are separate evidence measures, not a combined completion percentage. Do not infer release readiness from green repository tests alone.

## Continuity rule — required in every future handshake

Put the link to this master index in the **opening section** of every executive and next-thread handshake, before the task queue. Require the next thread to read it first, then the current backlog, then the handshakes; refresh GitHub exact-head evidence before editing. At handoff time, update the index/log with changed SHAs and test evidence, produce both handshake documents, and include them plus supporting notes in one verified ZIP. Do not claim autonomous agents ran unless they actually did.

## 1. Start here

Every new thread must follow this order:

1. Read this index.
2. Read the cross-functional backlog: [MOB issue #48 — P0–P3 gap closure](https://github.com/rebootos-sourcce/MOB/issues/48).
3. Read the current executive and next-thread handshakes in the latest verified handoff package.
4. Refresh the live state of the linked PRs, issues, branch heads, checks, deployments, migrations, and release flags.
5. Read the source-of-truth document for the task.
6. Compare the specification, source code, data, tests, and runtime. Record conflicts rather than guessing.
7. Make the smallest safe change, test it on the exact head, update the log, and state the next task.

**Do not infer that a document is implemented merely because it exists.** Use the status terms defined below. Do not merge, deploy, apply production migrations, activate or issue gifts, enable billing, enable profile sync, or rewrite rollback tags without explicit owner approval.

## 2. Canonical project map

| Area | Current known location | Authority / purpose | Current status |
|---|---|---|---|
| Cross-functional backlog | [MOB issue #48](https://github.com/rebootos-sourcce/MOB/issues/48) | Priority, dependencies, P0–P3, release blockers | Active; refresh before each task |
| Implementation audit | [ATUNED_IMPLEMENTATION_AUDIT.md](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_IMPLEMENTATION_AUDIT.md) | Requirement-to-code/test/evidence mapping, measured status, next action | Created on PR #69 branch; requires exact-head CI and review |
| Product decisions | [`DECISIONS.md` on main](https://github.com/rebootos-sourcce/MOB/blob/main/DECISIONS.md); [12 October gift-selection ruling in draft PR #69](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/DECISIONS.md) | Owner-locked product rules | Main contains the broad 100-pattern gift rule; draft PR #69 records the more specific category-selected bank rule pending review. Read both and refresh state before coding |
| Main client and funnel | [rebootos-sourcce/MOB](https://github.com/rebootos-sourcce/MOB) | Canonical browser/client code under `atuned_src/`; client tests and Pages workflow | P0 integrated; P1 onboarding branch open |
| Alpha behavior contracts | [MVP architecture v2](https://github.com/rebootos-sourcce/MOB/blob/main/ATUNED-MVP-architecture-v2.md), [Funnel journey TDD](https://github.com/rebootos-sourcce/MOB/blob/main/ATUNED-funnel-to-software-journey-TDD-v1.md), [Signal → story → pattern → release/reframe TDD](https://github.com/rebootos-sourcce/MOB/blob/main/ATUNED-Funnel-Signal-Story-Pattern-Release-Reframe-TDD-v1.md) | Authoritative product behavior and client/server flow | Read with `DECISIONS.md`, issue #48 and current implementation; do not assume docs prove shipped behavior |
| Sniffer / Source AI contract | [Sniffer spec](https://github.com/rebootos-sourcce/MOB/blob/main/SNIFFER_SPEC.md), [Sniffer TDD](https://github.com/rebootos-sourcce/MOB/blob/main/TDD-sniffer.md), [Source AI spec](https://github.com/rebootos-sourcce/MOB/blob/main/reviews/SPEC-source-ai.md), [sniffer audit](https://github.com/rebootos-sourcce/MOB/blob/main/REVIEW-sniffer-audit-2026-10-09.md), [Source review](https://github.com/rebootos-sourcce/MOB/blob/main/REVIEW-source.md), [browser tests](https://github.com/rebootos-sourcce/MOB/blob/main/tests/sniffpage.js) | Contract, historical gaps, current behavior modules and page-level tests | Extensive code/spec/test assets already exist. The 9 Oct review is historical; reconcile its P1/P2 status against current exact-head code before claiming completion |
| MOB historical work ledgers | [TASKS.md](https://github.com/rebootos-sourcce/MOB/blob/main/TASKS.md), [BACKLOG-AUDIT.md](https://github.com/rebootos-sourcce/MOB/blob/main/BACKLOG-AUDIT.md), [BACKLOG.html](https://github.com/rebootos-sourcce/MOB/blob/main/BACKLOG.html), [sniffer handshake](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/HANDSHAKE-sniffer.md) | Prior work, round-by-round tasks, backlog and workstream-specific execution rules | Historical ledgers can be stale; use targeted search, compare with current issues/PRs, and read this master index first. Large ledgers are not a substitute for the current #48 backlog |
| Worker/server | [rebootos-sourcce/Reboot-OS](https://github.com/rebootos-sourcce/Reboot-OS) | Worker, server routes, migrations, runtime integration, packaged UI | Server code exists; external Cloudflare build gate unresolved |
| Worker entry/config | `Reboot-OS/atuned/server/`; `atuned/server/wrangler.toml` | Worker named `atuned-api`; server and bindings | Inspect actual branch before edits |
| Public canon API boundary | [Reboot-OS `index.js`](https://github.com/rebootos-sourcce/Reboot-OS/blob/39cde03898543aca4e4d3a33774095117a8526f7/atuned/server/src/index.js), [exposure audit](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_CANON_EXPOSURE_AUDIT_2026-10-12.md), [PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) | Frozen 127-entry name/fingerprint/declared-row-count inventory; unknown or metadata-drifted rows are hidden, unexpected live row counts return 404. Current server 147/147 and smoke 840/840 passed; external Cloudflare still fails | No current protected-vault leak established. Vault is recovered but remains separate from runtime; classify all 127 existing entries and strengthen in-place content-fingerprint validation before any protected import |
| Running engineering log | [Reboot-OS `atuned/docs/THE_LOG.md`](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/atuned/docs/THE_LOG.md) | Numbered decisions, backlog items, closure history, generated counts | Existing; update it rather than creating a competing log |
| Reboot-OS prototype | [Reboot-OS README](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/README.md), [ARCHITECTURE.md](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/ARCHITECTURE.md), [DATA.md](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/DATA.md), [ROADMAP.md](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/ROADMAP.md) | Single-file prototype map, data blocks, product roadmap | Docs describe v28; verify current build/version before relying on counts |
| Canonical source corpus / protected vault | Library: `canon_vault.sqlite`, `CANON_VAULT_REVIEW_2026-10-07.md`, the 560-row review queue and four raw source files | Original vault recovered and verified locally in read-only mode: 3,346,432 bytes; SHA-256 `9c2cd7b610c1e7b1d056646047988b67d0f52368139952bcc2782b930056915e`; integrity `ok`; 2,900 limiting beliefs and 2,700 embodied truths. All four source-file size/MD5/SHA-256 values match their vault metadata. Not imported into runtime or Supabase |
| Runtime canon database | Reboot-OS [`0001_canon.sql`](https://github.com/rebootos-sourcce/Reboot-OS/blob/alpha/p1-fixed-pattern-gift-contract-20261010/atuned/server/migrations/0001_canon.sql), generated from `data/canon.sqlite` | Source manifest ↔ generated migration matched 127/127 names, fingerprints and declared row counts; 0 mismatches. Metadata consistency is not content approval or proof about missing protected vault |
| Canon review | `CANON_VAULT_REVIEW_2026-10-07.md` in ChatGPT Library | Evidence for protected corpus, provenance and duplicate policy | Verified document; local staging vault is not proof of production data |
| Canon application closure | ChatGPT Library: `CANON_APPLICATION_CLOSURE_BLOCK_2026-10-07.md` | Existing Source → candidate retrieval → user-confirm/correct/reject → immutable decision → pattern authority/release gate | Local implementation is reported tested (including 12/12 source-closure tests and 61/61 server tests); production deployment/state is not proven. Compare and reuse before rebuilding |
| Local Source wiring artifact and reports | Library: `atuned_source_wired_v2.html`, `source_http.py`, `source_client.js`, plus separately hashed `source_http_healed.py` and `source_client_healed.js`; see [execution refresh](ATUNED_EXECUTION_REFRESH_2026-10-12.md) | Gateway/client files recovered, but `source_http.py` imports missing `source_service.SourceService`; no equivalent file found in Library or current Reboot-OS server source. Original gateway has broad CORS and a health snapshot; healed version improves transport guards but still relies on a client-provided scope unless paired with trusted server-side identity. Worker has no `/v1/source/*` routes | Keep as differential-port reference, not deployable code. Recover missing service/adjudication dependency and define server-verified identity/ownership before integration |
| Current client sniffer / Source AI | [MOB `sniff.js`](https://github.com/rebootos-sourcce/MOB/blob/main/atuned_src/engine/sniff.js), [`sourceai.js`](https://github.com/rebootos-sourcce/MOB/blob/main/atuned_src/engine/sourceai.js), [`imprints.js`](https://github.com/rebootos-sourcce/MOB/blob/main/atuned_src/ui/imprints.js), [`storyui.js`](https://github.com/rebootos-sourcce/MOB/blob/main/atuned_src/ui/storyui.js) | Existing story-to-imprint detection, Source AI question logic, and UI | Present on MOB main. Reuse and review against current tests; do not rebuild. Relation to protected server-side catalog remains a separate integration gap |
| Source-line review queue | ChatGPT Library: `ATUNED_ALL_SOURCE_LINE_REVIEW_QUEUE_2026-10-12.csv` | Record-level source locator, text hash, stablePatternId, owner approval, manifest membership and line/phase review flags | **560 rows:** 376 transcripts (all physically located) + 184 PDF rows (160 unique exact token locators, 24 ambiguous). 0 stablePatternId populated, 0 ownerApproved=true, all 560 not_selected, 0 split/reframe reviews marked complete. 210 multi-line transcript records still need sentence-boundary review. This is a work queue, not a manifest |
| Raw source compilation | ChatGPT Library: `Lance_Energy_Spirituality_Master_Source_Compilation.txt` | Searchable source extracts, including the v65 manuscript extract and source appendix | Secondary compilation aid; preserve originals and provenance; do not replace original sources or the protected vault |
| Starter-gift catalog | [MOB issue #58](https://github.com/rebootos-sourcce/MOB/issues/58); [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) | Stable pattern IDs, sentence-level provenance, frozen 100-item set, issuance snapshot | Blocked: 0 owner-approved stable IDs; no production manifest |
| Onboarding gift choice | [MOB PR #66](https://github.com/rebootos-sourcce/MOB/pull/66) | Separate starting ground from gift nature; pass gift snapshot to client | Open/draft/unmerged; latest recorded exact-head CI was green, but integration and catalog are not production-ready |
| Cloudflare external build | [Reboot-OS issue #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) | Diagnose recurring `Workers Builds: atuned-os` failure | Blocked pending authenticated first-error logs |
| Public product site / demo endpoint | Canonical domain is intentionally not printed here because the previously flagged domain is prohibited for use | Product-facing acquisition/demo path | Current approved product URL, deployment SHA, analytics and legal links remain UNVERIFIED; do not link or open the prohibited domain |
| Repository publishing metadata | GitHub repository metadata for MOB, Reboot-OS, and MOB-Manuscript | Tells us where publishing may be configured, not what is live | MOB reports GitHub Pages enabled but no homepage value; Reboot-OS and MOB-Manuscript report Pages disabled. Live URL and deployment-to-domain mapping remain UNVERIFIED |
| Founder / art site candidate | `lancepowell.art` is referenced in project source material | Possible founder/art portfolio; current live content and canonical role were not verified in this pass | Confirm owner-controlled URL and whether it is intentionally cross-linked to ATÜNED; do not treat it as the Mechanics of Being method site without evidence |
| The Mechanics of Being | ChatGPT Library has at least v45, v58 and v65 PDFs; `Mechanics_of_Being_v65.pdf` is the highest version located in this search | Method/book content, concepts, definitions and source canon | v65 is latest located, not confirmed as final canonical edition; register dates, hashes, editable sources and authority decision |
| Manuscript repository | [MOB-Manuscript](https://github.com/rebootos-sourcce/MOB-Manuscript) | Private GitHub repository named for The Mechanics of Being | GitHub Pages disabled. Root inventory currently shows only `.gitattributes` (66 bytes) and `index.html` (5,901,968 bytes); latest returned commit is `dc7ba522d5a38c60b27973e3fed4576cee06e9b7` dated 31 May 2026. Treat HTML as a publication artifact until content blocks are mapped to editable source |
| Agreements / source-of-truth charter | Agreements documentation branch referenced in prior handoff | Source authority and engineering collaboration rules | Link and exact file path need verification |

### Known runtime boundary

Intended architecture: **Browser → `atuned-api` Worker → repository/persistence adapter → Supabase**. The actual deployed path, current bindings, authoritative write store, and complete browser → Worker → Supabase read-after-write journey must be reverified against current live state. Do not create a second Worker in MOB or treat local meter state as proof of a server-side gift.

## 3. Authority rules

When deciding what the system should mean, use this order:

1. Current explicit owner decision.
2. Existing authoritative domain contract / source-of-truth charter.
3. Canonical architecture.
4. Existing persistence contract.
5. Supporting specifications and TDDs.
6. Generated scaffolds.
7. AI inference.

When deciding what is actually running, use this order:

1. Verified live state.
2. Verified applied migrations.
3. Actual repository implementation at an exact SHA.
4. Executed test evidence at that SHA.
5. Staging state.
6. Documentation.
7. Generated scaffolds.

If the two orders disagree, record **CONFLICT** and identify the evidence. Never silently pick whichever file is newest.

## 4. Status and completion measurement

Use these implementation statuses: **IMPLEMENTED, TESTED, UNVERIFIED, BLOCKED, CONFLICT**. For backlog workflow, preserve the labels already used in `THE_LOG.md`: **BUILT, OPEN, YOURS, HELD**. Do not introduce a competing status vocabulary.

Percentages must be evidence-based, not intuition. For each deliverable, record:
- numerator: acceptance criteria verified at the current exact SHA;
- denominator: all agreed acceptance criteria for that deliverable;
- test/run URL and SHA;
- unverified criteria and blockers.

Do not combine different kinds of progress into one headline percentage. Passing unit/browser tests does not prove deployment, persistence, safety, customer validation, or release readiness.

### Initial evidence dashboard — 12 October 2026

| Workstream / measure | Verified progress | What it means | Overall status |
|---|---:|---|---|
| MOB PR #66 exact-head CI | 30/30 jobs passed (100% of that run's jobs); functional browser gate 2,622/2,622 | Client checks green on the recorded head; not proof of gift readiness or production E2E | TESTED; PR remains open/draft |
| P0 Alpha assertions before integration | 61/61 passed in the recorded candidate run | Acceptance-count result for that candidate only | TESTED; not full release proof |
| Canon source locator coverage | 376/376 recorded source locators matched | Provenance locator coverage, not approved pattern content | PARTIAL |
| Approved stable pattern IDs | 0 approved out of the required 100 per frozen set | No production-eligible starter gift | BLOCKED |
| Frozen production starter manifest | 0 active manifests | No gift may be activated or issued | BLOCKED |
| Supabase migrations | Live recorded through 0015; migrations 0017/0018 not applied | Catalog schema is not live; no production migration authorized | BLOCKED |
| Browser → Worker → Supabase persisted write/read | 0/1 current-release journey independently verified in the latest handshake | Full end-to-end persistence proof remains missing | UNVERIFIED |
| External Cloudflare build diagnosis | 0/1 first-error diagnosis verified | Dashboard logs needed; do not bypass the gate | BLOCKED |
| Protected vault isolation from public canon API | Read-only integrity, source-hash verification and local vault schema/counts are now verified; runtime public API remains a separate SQLite/migration | 0/1 production/deployed isolation journey independently verified; source vault has not been imported | BLOCKED before protected-source import. Preserve public negative tests; classify current runtime content and strengthen content-hash checks |
| Customer willingness-to-pay / first paying customer | Not measured | Product/business validation remains open | UNVERIFIED |

These are component-level measures, not a single MVP Alpha completion percentage. A headline percentage is intentionally withheld until the full acceptance denominator and weighting are agreed and all criteria are inventoried.

## 5. Prioritized development picture

### P0 — Alpha release blockers

1. **End-to-end persistence proof:** verify browser write → Worker → Supabase write → readback after reload, with RLS/RPC and authoritative-store behavior confirmed. Keep D1 authority until reconciliation is proven.
2. **Canonical 100-pattern gift:** recover the existing source material; define stable sentence-level IDs, source provenance, release/reframe, side/channel mapping, and the exact approved set. Never choose the first 100 records or fabricate text.
3. **Gift entitlement contract:** the selection rule is resolved: the user chooses one of six gift natures (`anxiety`, `overwhelm`, `burnout`, `depression`, `grief`, `sadness`) separately from the twelve starting grounds; each choice maps to that category's own fixed 100-pattern bank. See the [owner decision recorded in MOB #58](https://github.com/rebootos-sourcce/MOB/issues/58#issuecomment-6127996424). What remains blocked is source-grounded review and owner approval of the exact stable pattern IDs for each bank, deterministic mappings, and the catalog-to-meter adapter.
4. **Catalog-to-meter mapping:** MOB tracks four execution tracks while the server catalog uses six verb channels. Define a deterministic source-backed adapter and consumption rule before activating gifts.
5. **Cloudflare external build:** obtain the first failing log from an authenticated operator, confirm repository/service/root/build command/permissions, and fix the demonstrated cause. Do not bypass the check.
6. **Deployment ownership:** MOB's proven Pages publisher and Reboot-OS's packaged-web workflow have both targeted a Pages project called `atuned`. Confirm one authoritative production publisher and avoid independent workflows overwriting the same project.
7. **Acceptance gates:** preserve exact-head CI evidence and test floors. Do not merge or deploy without explicit owner approval.

### P1 — Reliability, privacy, content and operational completeness

- Complete deletion/retention policy across D1, Supabase first-visit/session/gift records, logs, local records, and payment records; prove no-resurrection and cross-account isolation.
- Complete the UI/UX pass for reachable surfaces, including keyboard/touch/focus/loading/error/unavailable/success states and dead controls.
- Finalize privacy, consumer-health-data and terms content with owner/counsel approval before publishing. Existing legal drafts contain unresolved notes and placeholders.
- Maintain billing and profile sync off until separately approved and verified.
- Finish source-grounded review of ambiguous and multi-line corpus records; distinguish locators from sentence boundaries and approval.
- Clarify QA/release scope and branch protection. A green run is not equivalent to a fully governed release.

### P2 — Explicitly later

- Sound burst-rate reliability investigation without lowering thresholds.
- Cross-device attachment, pass expiry, duplicate/replay, timeout/retry, and deletion/reattachment coverage.
- After Alpha, integrate Sniffer → user-confirmed Mirror → canonical Release → Verification → Evidence → Trace/CQ.
- Complete recovery/backup/restore and broader system security review.
- Reconcile duplicate or outdated task lists against the canonical log.

### P3 — Cosmetic, after P0 closure

- Minor spacing, typography, tooltips, icons, motion and sound polish.
- Do not reopen retired mockup proposals unless a new owner decision explicitly restores them.

### Out of scope for this browser MVP

Android/iOS builds, signing, and store packaging are not release blockers unless the owner explicitly changes the scope.

## 6. Active GitHub work

| Item | Current recorded state | Next action |
|---|---|---|
| [MOB #48](https://github.com/rebootos-sourcce/MOB/issues/48) | Cross-functional P0–P3 tracker | Keep as the master backlog; update before and after work |
| [MOB #58](https://github.com/rebootos-sourcce/MOB/issues/58) | Open P0 issue for canonical sentence inventory and 100-pattern gift | Vault and source artifacts recovered and hash-checked. Continue sentence-boundary review, stable ID assignment, authority/channel/side/phase validation, and explicit approval; no active manifest |
| [MOB PR #66](https://github.com/rebootos-sourcce/MOB/pull/66) | Open/draft; recorded head `9280501683d07867c72bc582cba62fe9aed00d49`; 30/30 jobs passed | Continue client integration; verify latest head before relying on this status |
| [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) | Open/draft; head `39cde03898543aca4e4d3a33774095117a8526f7`; server 147/147 passed; smoke 840 passed / 0 failed; 44 screenshot surfaces; external `atuned-os` Cloudflare build failed (current build `0caff241-0bd3-453e-a86d-985e0b839726`) | Obtain authenticated first-failure build logs, resolve actual cause, preserve draft/no production changes |
| [Reboot-OS #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) | Open infrastructure blocker | Authenticated operator captures first actual Cloudflare error |

Refresh every state above from GitHub before acting; this snapshot can become stale.

## 7. Content and site inventory gaps

The current accessible evidence identifies the following gaps that must be closed by inventory, not guesswork:

1. **Site URL register:** confirm canonical live URLs for Reboot-OS, ATÜNED, and The Mechanics of Being. One previously identified candidate domain is explicitly prohibited because it resolves to an unrelated product; do not link or open it. The approved ATÜNED production/demo URL is not yet verified. `lancepowell.art` is a discoverable art portfolio, but its role as the authoritative Mechanics of Being method site is unverified.
2. **Website-to-repository map:** identify the source repository, deploy workflow, target domain, analytics, forms, privacy/terms links, and current production SHA for every site.
3. **Manuscript authority:** inventory all Mechanics of Being manuscript PDFs and editable sources, record versions and dates, designate the current canonical version, and map each chapter/concept to the canon and product modules. Preserve historical versions.
4. **Library register:** inventory relevant Library files and prior handoff packages, deduplicate by content/hash rather than filename alone, and identify which files are current, superseded, reference-only, or unverified.
5. **Repository completeness:** inventory all repositories accessible to the project, including private repositories, branches, docs, generated artifacts, and release workflows. Current known repositories are MOB, Reboot-OS, and MOB-Manuscript; verify whether more exist.
6. **Implementation audit:** maintain [`ATUNED_IMPLEMENTATION_AUDIT.md`](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_IMPLEMENTATION_AUDIT.md), mapping priority requirements to code, persistence, tests, status, conflicts, migrations and acceptance evidence. Its first pass is committed on PR #69 and remains under review.
7. **Decision register:** consolidate explicit owner decisions, unresolved questions, dates, and links to the source conversation/issue. No repeated decisions should be asked again when an authoritative ruling already exists.
8. **Backlog reconciliation:** compare `MOB #48`, `MOB #58`, Reboot-OS `THE_LOG.md`, repository roadmap/task files, open issues/PRs, and handshake documents. Retain stable item IDs; do not delete historical entries.
9. **Ownership map:** name the responsible workstream and reviewer for each P0/P1 item. Do not imply that agents or independent reviewers ran unless evidence exists.
10. **Release and evidence register:** map exact SHAs to CI runs, deployments, migrations, environment, rollback point, and approval. Keep test success, deploy success, and production E2E proof separate.

## 8. How to maintain this index

- Keep this document as the navigation layer, not a duplicate of every task or specification.
- Keep numbered history and generated counts in `atuned/docs/THE_LOG.md`.
- Keep the current cross-functional priorities and acceptance checklists in MOB issue #48 and specific blockers in their own issues.
- Each work item must link to source requirements, implementation paths, tests, exact SHA, run evidence, and any owner decision.
- Update the status dashboard only from verified evidence. If the denominator is unknown, report **UNMEASURED**, not an invented percentage.
- At the end of each execution block, update the relevant log and issue, then hand off the exact next action.
- At each executive handoff, package the current handshake files and supporting documents into a verified ZIP.

## 9. Immediate next actions

1. Finish current Reboot-OS PR #35 smoke gates [#38279998550](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38279998550) and [#38280005952](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38280005952); the exact-head server suite [#38279998569](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38279998569) has passed 147/147.
2. Resolve the current Cloudflare failure on build `0caff241-0bd3-453e-a86d-985e0b839726` from authenticated first-error logs. GitHub exposes 0 annotations and no failed-step detail. Read-only probes show `atuned-api` health 200 and `atuned-os` health 404; use this as a target-mismatch clue, not proof of cause. Do not bypass.
3. Refresh current PR #69 head and corresponding workflow; each documentation commit triggers a new gate, so don't rely on prior SHA results.
4. Recover the original `canon_vault.sqlite` and standalone Source gateway/client/service files from the previous workspace. Do not recreate them.
5. Classify all 127 runtime manifest entries, especially `RARE` (“the vault patterns”), before any protected import.
6. Continue the 560-row source queue with sentence-boundary review, stable IDs, provenance and owner approval. Build fixed 100-item banks only from approved records.
7. Define/test the server-bank-to-four-track meter mapping and persisted browser → Worker → Supabase journey on an approved non-production target.
8. Keep all PRs draft. No merge, production deployment/migration, billing/profile sync, gift activation or issuance without explicit owner approval.

**Release posture:** MVP Alpha is not release-ready until the current blockers are closed and verified. Keep billing, profile sync, production migrations, gift activation, and gift issuance off. No merge or deployment is authorized by this index.


## API and deployment map — audited 12 October 2026

**Source of truth for route inventory:** [Reboot-OS Worker route table at PR #35 head `39cde03898543aca4e4d3a33774095117a8526f7`](https://github.com/rebootos-sourcce/Reboot-OS/blob/39cde03898543aca4e4d3a33774095117a8526f7/atuned/server/src/index.js). The following 35 HTTP routes were extracted from the checked-in route table. This is a code inventory, not proof that the external deployment is live or reachable.

- **Worker repository:** [Reboot-OS](https://github.com/rebootos-sourcce/Reboot-OS)
- **Worker root:** `atuned/server/`
- **Entrypoint:** `atuned/server/src/index.js`
- **Wrangler config:** `atuned/server/wrangler.toml`
- **Package scripts:** `atuned/server/package.json`; `npm test`, `npm run deploy` (maps to `wrangler deploy`)
- **Configured Worker name:** `atuned-api`
- **Configured D1 binding/database:** `DB` → `atuned`
- **Configured Pages/app project:** `atuned` (separate from the Worker)
- **Known API base used by server workflow smoke tests:** `https://atuned-api.lance-o-powell.workers.dev` — must be treated as a configured test target, not independent proof of production/domain mapping.
- **Application origin configured in Worker:** `https://atuned.world`
- **Secrets:** service keys and private credentials belong in Cloudflare/GitHub secrets, never this index or browser code.

### Exact HTTP routes

- `POST /v1/auth/signup`
- `POST /v1/auth/signin`
- `POST /v1/auth/forgot`
- `POST /v1/auth/reset`
- `POST /v1/auth/signout`
- `GET /v1/me`
- `POST /v1/funnel/session`
- `GET /v1/funnel/session/:id`
- `POST /v1/funnel/session/:id/attach`
- `PATCH /v1/funnel/session/:id/checkpoint`
- `POST /v1/purchase`
- `POST /v1/billing/checkout`
- `POST /v1/billing/portal`
- `POST /v1/voice/synthesize`
- `POST /v1/billing/webhook`
- `GET /v1/health`
- `GET /v1/version`
- `POST /v1/crash`
- `GET /v1/export`
- `GET /admin`
- `GET /v1/admin/account`
- `GET /v1/admin/crashes`
- `POST /v1/admin/plan`
- `POST /v1/admin/delete`
- `GET /v1/push/key`
- `PUT /v1/push`
- `DELETE /v1/push`
- `POST /v1/store/apple`
- `POST /v1/store/google`
- `DELETE /v1/me`
- `PUT /v1/consent`
- `PUT /v1/sync`
- `GET /v1/sync`
- `GET /v1/canon`
- `GET /v1/canon/:table`

### Cloudflare build failure and fix status

The supplied build log proves the configured external build ran `npx wrangler preview` from repository root `/`; Wrangler then failed because no `previews` block was configured. Repository Wrangler config is at `atuned/server/wrangler.toml`, names the Worker `atuned-api`, and the server package deploy script is `wrangler deploy`. Both `atuned-api` and `atuned-os` passed non-deploying dry-run packaging tests, so those results do **not** identify which production service is correct.

**Required Cloudflare dashboard correction (not yet applied):** in the `atuned-os` Workers Builds settings, set the root directory to `atuned/server` and the build/deploy command to `npm run deploy` only after confirming that the existing production Worker intended for this app is `atuned-api`. Do not add a `previews` block merely to make the wrong preview command pass. Then trigger a controlled build and verify the deployed Worker/health endpoint. No dashboard settings, production deployment, or production migration have been changed by this documentation update.

**Current status:** repository route/config inventory documented; Cloudflare dashboard settings remain an operator action requiring authenticated dashboard access. Keep issue [Reboot-OS #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) open until a successful build and target verification are recorded.


## Cloudflare deployment path and operator checklist — refreshed 12 October 2026

**Start here before touching dashboard settings:** [Reboot-OS issue #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) and [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35). The owner reported both `atuned-api` and `atuned-os` working during DEV 21/22. Preserve that as owner-reported verification, but do not treat it as proof that the currently failing external build check is green: the latest documented Cloudflare check is still a separate failure. Recheck current exact-head evidence before asking for dashboard work.

### Paths and target identifiers

- Worker source root: `atuned/server/`
- Wrangler configuration: `atuned/server/wrangler.toml`
- Worker entry point: `atuned/server/src/index.js`
- Server package scripts: `atuned/server/package.json`; deploy script is `npm run deploy` (`wrangler deploy`)
- Public health route: `GET /v1/health`
- Runtime canon routes needing security review: `GET /v1/canon` and `GET /v1/canon/:table`
- Public-canon regression tests: `atuned/server/test/canon-public.test.mjs`
- Runtime canon source database: `atuned/data/canon.sqlite` (separate from protected `canon_vault.sqlite`)
- Candidate Worker names observed in checks: `atuned-api` (name in checked-in Wrangler config) and `atuned-os` (external Cloudflare Workers Builds check)
- Cloudflare build history/check: build `0caff241-0bd3-453e-a86d-985e0b839726`; older historical build `f6612baf-bd07-41da-b9b1-6ba0629d3d27`. These are historical identifiers; always inspect the latest failing build first.
- Cloudflare project/service dashboard link recorded in the check: [atuned-os build](https://dash.cloudflare.com/b34a8a4f24d5ac71f7b386c240a6da90/workers/services/view/atuned-os/production/builds/0caff241-0bd3-453e-a86d-985e0b839726).

### Cloudflare procedure — do not guess or bypass

1. Open [Reboot-OS #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) and refresh PR #35's exact head and external check.
2. If the latest external check is green and the owner confirms both endpoints are healthy, record the new evidence and do not ask for unnecessary dashboard changes.
3. If it is red, sign in to Cloudflare and open **Workers & Pages**. Select the exact service named by the failed check, currently recorded as `atuned-os`, and open its latest failed build.
4. Read and record the **first actual failing step and error** before changing anything. GitHub has previously exposed zero annotations, so do not infer the cause from a red badge alone.
5. Compare the service's repository, branch, root directory, build command, and required secret bindings with the intended app. The checked-in config points to `atuned-api` under `atuned/server/`; do not assume `atuned-api`, `atuned-os`, and Pages project `atuned` are interchangeable.
6. Only if the owner/operator confirms `atuned-api` is the intended target, evaluate root `atuned/server` and command `npm run deploy`. Do not change production settings just to silence a preview command; do not add a `previews` block without evidence it is the correct fix.
7. Run a controlled build and verify the intended service plus `/v1/health`. Keep the external check visible until the new build passes.
8. Do not expose secrets in issue comments/logs. Do not merge, deploy manually, run migrations, import the protected vault, enable billing/profile sync, or activate gifts as part of diagnosis.

### Additional active paths to carry forward

- Master index: `ATUNED_MASTER_INDEX.md` (this file; mandatory first read).
- Implementation audit: `ATUNED_IMPLEMENTATION_AUDIT.md`.
- Decisions: `DECISIONS.md`.
- Execution evidence: `ATUNED_EXECUTION_REFRESH_2026-10-12.md`.
- Cross-functional tracker: [MOB issue #48](https://github.com/rebootos-sourcce/MOB/issues/48).
- Fixed-bank catalog blocker: [MOB issue #58](https://github.com/rebootos-sourcce/MOB/issues/58).
- Client gift-nature separation: [MOB PR #66](https://github.com/rebootos-sourcce/MOB/pull/66).
- Server gift/public-canon guard: [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35).
- Source gateway references: `source_http.py`, `source_client.js`, their healed variants; missing dependency `source_service.SourceService` must be recovered, not guessed. Do not port before server-authenticated identity and negative-access tests exist.
- Protected source database: `canon_vault.sqlite`, SHA-256 `9c2cd7b610c1e7b1d056646047988b67d0f52368139952bcc2782b930056915e`; keep local/server-side and do not put its corpus in the public client or import it without explicit approval.

**Handoff rule:** every executive handshake and next-thread handshake must link to this index near the top and repeat the Cloudflare paths, current evidence status, and the exact operator checklist. Keep this index on the docs PR branch until approved; do not link to a nonexistent `main` copy as if it were merged.


### Current handoff files — 12 October 2026
- [Executive handshake](ATUNED_EXECUTIVE_HANDSHAKE_2026-10-12_EXECUTION.md)
- [Next-thread handshake](ATUNED_NEXT_THREAD_HANDSHAKE_2026-10-12_EXECUTION.md)
- [Execution log](ATUNED_EXECUTION_LOG_2026-10-12_CLOUDFLARE_INDEX.md)

These are on the same draft docs branch as this index. Refresh the PR #69 head and its exact-head workflow before relying on the final bundle; none of these documentation commits is a merge or production release.


### Latest continuation work
- Implementation audit and code acceptance plan: [ATUNED_IMPLEMENTATION_AUDIT.md](ATUNED_IMPLEMENTATION_AUDIT.md), updated in commit `14ff5e11e7368c227df6f62b77fb9769c1baaa08`.
- Executive handshake: [ATUNED_EXECUTIVE_HANDSHAKE_2026-10-12_EXECUTION.md](ATUNED_EXECUTIVE_HANDSHAKE_2026-10-12_EXECUTION.md).
- Next-thread handshake: [ATUNED_NEXT_THREAD_HANDSHAKE_2026-10-12_EXECUTION.md](ATUNED_NEXT_THREAD_HANDSHAKE_2026-10-12_EXECUTION.md).
- Execution log: [ATUNED_EXECUTION_LOG_2026-10-12_CLOUDFLARE_INDEX.md](ATUNED_EXECUTION_LOG_2026-10-12_CLOUDFLARE_INDEX.md).
- The current public-canon implementation freezes manifest SHA/row-count metadata, but the route does not independently recompute the actual table content fingerprint on read. A same-row-count mutation of canon table contents may therefore evade the current check if the manifest remains unchanged. Treat this as a code-review finding to fix with the source fingerprint's exact canonicalization algorithm and regression tests; do not invent a replacement hash format.
- Current docs PR #69 head was `14ff5e11e7368c227df6f62b77fb9769c1baaa08` at last refresh. Workflow lookup returned no PR-triggered run for that SHA; recheck after the next documentation commit.
