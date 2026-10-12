# ATÜNED Master Index
**Version:** 0.1  
**Last reconciled:** 12 October 2026  
**Status:** Initial working index; cross-repository and website inventory is not yet complete.  
**Purpose:** First stop for every engineering thread. This index points to the authority for decisions, code, content, backlog, and release evidence. It must be updated when work changes.

## Current verified checkpoint — 12 October 2026 UTC

| Workstream | Exact evidence | Current status |
|---|---|---|
| Master index | [Draft PR #69](https://github.com/rebootos-sourcce/MOB/pull/69), branch `docs/atuned-master-index-20261012` | OPEN / DRAFT; documentation only; refresh the live PR head before acting |
| MOB client | [PR #66](https://github.com/rebootos-sourcce/MOB/pull/66), head `9280501683d07867c72bc582cba62fe9aed00d49`; [run #38199490611](https://github.com/rebootos-sourcce/MOB/actions/runs/38199490611) | 30/30 jobs passed; functional browser gate 2,622/2,622. PR remains OPEN / DRAFT; no deploy from this pull-request run |
| Reboot-OS gift contract | [PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35), head `4d57161c16fc7382cec1552eaeb59da91028640d`; [server #38271445824](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38271445824), [push gate #38271445831](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38271445831), [PR gate #38271453636](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38271453636) | Repository-owned gates all passed on this SHA; PR remains OPEN / DRAFT |
| External Cloudflare check | [Check #114886960394](https://github.com/rebootos-sourcce/Reboot-OS/runs/114886960394); build ID `f6612baf-bd07-41da-b9b1-6ba0629d3d27` | FAILED; zero annotations, first failed step unknown without authenticated dashboard logs |
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
| Worker/server | [rebootos-sourcce/Reboot-OS](https://github.com/rebootos-sourcce/Reboot-OS) | Worker, server routes, migrations, runtime integration, packaged UI | Server code exists; external Cloudflare build gate unresolved |
| Worker entry/config | `Reboot-OS/atuned/server/`; `atuned/server/wrangler.toml` | Worker named `atuned-api`; server and bindings | Inspect actual branch before edits |
| Running engineering log | [Reboot-OS `atuned/docs/THE_LOG.md`](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/atuned/docs/THE_LOG.md) | Numbered decisions, backlog items, closure history, generated counts | Existing; update it rather than creating a competing log |
| Reboot-OS prototype | [Reboot-OS README](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/README.md), [ARCHITECTURE.md](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/ARCHITECTURE.md), [DATA.md](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/DATA.md), [ROADMAP.md](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/ROADMAP.md) | Single-file prototype map, data blocks, product roadmap | Docs describe v28; verify current build/version before relying on counts |
| Canonical pattern sources | Library and Reboot-OS `atuned/data/letgo/`; protected local vault documented as `data/canon_vault/canon_vault.sqlite` | Source text, provenance, limiting beliefs and embodied truths | Source exists; deployment/accessibility and exact path must be verified. Do not recreate or overwrite |
| Canon review | `CANON_VAULT_REVIEW_2026-10-07.md` in ChatGPT Library | Evidence for protected corpus, provenance and duplicate policy | Verified document; local staging vault is not proof of production data |
| Starter-gift catalog | [MOB issue #58](https://github.com/rebootos-sourcce/MOB/issues/58); [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) | Stable pattern IDs, sentence-level provenance, frozen 100-item set, issuance snapshot | Blocked: 0 owner-approved stable IDs; no production manifest |
| Onboarding gift choice | [MOB PR #66](https://github.com/rebootos-sourcce/MOB/pull/66) | Separate starting ground from gift nature; pass gift snapshot to client | Open/draft/unmerged; latest recorded exact-head CI was green, but integration and catalog are not production-ready |
| Cloudflare external build | [Reboot-OS issue #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) | Diagnose recurring `Workers Builds: atuned-os` failure | Blocked pending authenticated first-error logs |
| Public product site / demo endpoint | Canonical domain is intentionally not printed here because the previously flagged domain is prohibited for use | Product-facing acquisition/demo path | Current approved product URL, deployment SHA, analytics and legal links remain UNVERIFIED; do not link or open the prohibited domain |
| Founder / art site | `lancepowell.art` | Public art portfolio is discoverable; not yet verified as the authoritative Mechanics of Being method site | Confirm whether it is intentionally cross-linked to ATÜNED and which pages are canonical |
| The Mechanics of Being | ChatGPT Library has at least v45, v58 and v65 PDFs; `Mechanics_of_Being_v65.pdf` is the highest version located in this search | Method/book content, concepts, definitions and source canon | v65 is latest located, not confirmed as final canonical edition; register dates, hashes, editable sources and authority decision |
| Manuscript repository | [MOB-Manuscript](https://github.com/rebootos-sourcce/MOB-Manuscript) | Private GitHub repository named for The Mechanics of Being | Root inventory currently shows only `.gitattributes` (66 bytes) and `index.html` (5,901,968 bytes); latest returned commit is `dc7ba522d5a38c60b27973e3fed4576cee06e9b7` dated 31 May 2026. Treat HTML as a publication artifact until content blocks are mapped to editable source |
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
| [MOB #58](https://github.com/rebootos-sourcce/MOB/issues/58) | Open P0 issue for canonical sentence inventory and 100-pattern gift | Recover corpus, resolve contract, build auditable inventory |
| [MOB PR #66](https://github.com/rebootos-sourcce/MOB/pull/66) | Open/draft; recorded head `9280501683d07867c72bc582cba62fe9aed00d49`; 30/30 jobs passed | Continue client integration; verify latest head before relying on this status |
| [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) | Open/draft; current recorded catalog work, 0 approved IDs, external build failure | Continue evidence-only catalog work; inspect Cloudflare logs; no migration/activation |
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

1. Verify and record the exact canonical URLs for the three public-facing sites and their deployed source repositories.
2. Inventory the full `MOB-Manuscript` repository and the latest Mechanics of Being source files in the Library.
3. Reconcile `MOB #48`, `MOB #58`, `Reboot-OS THE_LOG.md`, and the active handshakes into one non-duplicated P0–P3 backlog.
4. Review and refine the implementation audit acceptance rows and denominators, then report evidence-based progress separately for each workstream.
5. Continue P0 work: Cloudflare root cause, end-to-end persistence, and approved canonical gift inventory.

**Release posture:** MVP Alpha is not release-ready until the current blockers are closed and verified. Keep billing, profile sync, production migrations, gift activation, and gift issuance off. No merge or deployment is authorized by this index.
