# ATÜNED Master Index
**Version:** 0.3  
**Last reconciled:** 14 October 2026 UTC  
**Status:** Architecture review recorded; live production publisher/service ownership still requires authenticated Cloudflare confirmation. P0 remains open.  
**Purpose:** First stop for every engineering thread. This index points to the authority for decisions, code, content, deployment, backlog, and release evidence.

[ATUNED Architecture Review — 13 October 2026](ATUNED_ARCHITECTURE_REVIEW_2026-10-13.md) is the current cross-repository site and deployment map. It contains the six-pass review, path diagrams, 35-route inventory, source-of-truth map, branch freshness register, gap ledger, and archive/backlog rules.  
[ATUNED P0 Execution Control Board](ATUNED_P0_EXECUTION_CONTROL_BOARD.md) remains the active acceptance ledger; [P0 Block Execution Notes](ATUNED_P0_BLOCK_EXECUTION_NOTES_2026-10-12.md) records dependencies and stop/continue rules. The architecture map is complete at repository/configuration level, not at authenticated live-production level.

## Latest exact-head execution refresh — 14 October 2026, 22:55 UTC

This section supersedes older checkpoint rows where the exact head or workflow differs. Live GitHub check performed before this update; P0 remains OPEN.

- **Documentation queue:** the MOB branch had 0 queued and 0 in-progress pull-request workflow runs at the time checked. The previous queue-pressure warning is no longer current; do not trigger extra workflows without a scoped acceptance reason.
- **Reboot-OS PR #45 — recursive audit:** head `3dd693176c86b3b449b037bb076d263a623d4621`; run [#38604682980](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38604682980) failed before runner assignment (`runner_id=0`, no steps). This is not a code-test result.
- **Reboot-OS PR #46 — reduced motion:** head `2eae6b7c07d57d9979eb8f4ea462801730e1f055`; exact-head gate [#38513391386](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38513391386) passed. Human keyboard, screen-reader, and remaining-motion acceptance is still open; PR remains draft.
- **Reboot-OS PR #47 — single Pages publisher:** head `a43aae252811b00b082b8c7be55320b4204a8006`; exact-head gate [#38512729513](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38512729513) passed. The code removes the Reboot-OS Pages deploy path but does not establish the authenticated Cloudflare publisher/account/domain/rollback owner. PR remains draft.
- **Reboot-OS PR #48 — gift validator:** current head `7d4bbe543affb148486919e43bbd0f67341a47d5`; commits add rejection of whitespace-padded stable IDs and a synthetic regression. Exact-head run [#38650348533](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38650348533) failed before any steps (`runner_id=0`). The new regression has not executed in CI. No real bank or production manifest exists.
- **Reboot-OS PR #49 — public canon:** head `b757ae5d35cd9f42286c4de2a8f25d889d9eec54`; run [#38514518771](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38514518771) failed before runner assignment. Static allowlist review is not runtime acceptance.
- **Reboot-OS PR #52 — geometry:** head `8b34a7c787a1eca93d77c798e6324493988763ee`; run [#38646353600](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646353600) failed before runner assignment. Geometry source consistency is not packaged-browser acceptance; seven IDs still lack accepted measured positions and the source crosswalk remains unresolved.
- **Reboot-OS PR #53 — CI permissions/rollback tag:** head `938bbc628bf035b79c12a08179d2ef17ca7b400e`; run [#38646483356](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646483356) failed before runner assignment, with tag job skipped. Keep draft; do not retry absent new runner evidence.
- **Reboot-OS PR #35 — frozen gift contract:** head `f4cc9e965c0c4037f0aef09d7eb1292bf21ca656`; exact-head workflow [#38490665962](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38490665962) succeeded. It remains draft and is stacked on `alpha/p1-account-retention-24-months-20261010`, not main; this is not live persistence or owner-approval evidence.
- **MOB PR #66:** head `fc7033fb24ec9ed94e2f63563e723b82603b2e68`; exact-head workflow [#38322094250](https://github.com/rebootos-sourcce/MOB/actions/runs/38322094250) succeeded. This is repository CI, not gift approval or live end-to-end acceptance.
- **MOB PR #69:** head `f0c670b529e76c2d5c95e0b8dbe3c79b22b87ece`; exact-head workflow [#38646618269](https://github.com/rebootos-sourcce/MOB/actions/runs/38646618269) succeeded. It remains draft/open; this documentation refresh will require a new exact-head workflow.
- **Shared runner diagnosis:** issue [Reboot-OS #51](https://github.com/rebootos-sourcce/Reboot-OS/issues/51) remains open. Multiple Reboot-OS jobs report zero runner ID and zero steps, while exact-head MOB runs execute. No root cause is established. Queue is now drained; next step is administrator review of Actions policy/entitlement/runner configuration, not more retries.
- **Safety boundary:** no merges, deployment, migration, production data mutation, vault import, gift issuance/activation, billing activation, or profile-sync activation were performed.

## Current execution refresh — 14 October 2026 UTC

**Continuation handshake:** [ATÜNED Executive Handshake — P0 Engineering Continuation](ATUNED_EXECUTIVE_HANDSHAKE_2026-10-14_P0_ENGINEERING.md). This is the exact scope and status document for the next thread; engineering-only, no lookdev.

**P0 remains OPEN.** Reboot-OS main is `233b5c3acc3d7396e3bd1a861319689aa4a9d60e`; PRs #43 and #44 merged topology and release-documentation corrections without runtime or production-data changes.

- **Reduced motion:** Reboot-OS PR #46 is draft/open; exact-head gate #38513391386 passed on `2eae6b7c07d57d9979eb8f4ea462801730e1f055`. Human keyboard/screen-reader and remaining-motion review is still required.
- **Publisher:** Reboot-OS PR #47 is draft/open; gate #38512729513 passed on `a43aae252811b00b082b8c7be55320b4204a8006`. Main still has the conditional Pages deploy in `Reboot-OS/.github/workflows/web.yml`; MOB main also deploys Pages project `atuned`. The mitigation is not active until reviewed and merged, and the canonical publisher/account/domain/rollback path still needs authenticated operator confirmation.
- **Gift validator:** Reboot-OS PR #48 current head `dde8eaefaa3d9a02f0f02e0072f291418b081ab3`. Its prior passing gate predates the cross-bank duplicate-ID test. Current gate #38514559152 failed before any steps were recorded; the log is unavailable. Current-head test acceptance is unverified.
- **Source/lifecycle audit:** Reboot-OS PR #45 is draft/open and now records a read-only live-lifecycle finding. On connected Supabase ATUNED ref `tuvpjbduarteszwkdmuu`, 4,992/4,992 funnel sessions are `ARRIVE/active`; 4,412 were not updated in the prior 24 hours. Six starter gifts exist (five active, one pending); all six share one `pattern_set_hash`, and the inspected table lacks a gift-nature/catalog-version selector. These rows may be fixtures or real sessions; safe provenance and non-production lifecycle verification are required. Do not mutate production to normalize counts.
- **Database boundary:** live migration inventory ends at 0015; 0016–0018 and expected catalog/set/mapping tables are absent. Existing relevant tables have RLS and restrictive anon/authenticated deny policies; the current security advisor returned zero lints. This does not establish lifecycle correctness or future-table security.
- **Content / source inventory:** 851 Library entries enumerated; the 560-row source queue has zero stable final pattern IDs and zero owner-approved rows. It contains 154 rows without indexNodeId, 107 duplicate-text-hash groups covering 266 rows, 117 duplicate-title groups covering 314 rows, 24 ambiguous PDF locators, and 210 transcript sentence-boundary reviews. Duplicate hashes are review leads, not automatic deletion. The [MOB gift catalog owner-approval contract](https://github.com/rebootos-sourcce/MOB/pull/73) is draft/not approved. Six 100-item banks, item-level provenance/approval, and the stable six-nature-to-four-track mapping remain open.
- **Geometry:** canonical topology is 112 = 108 body + 2 above + 2 below. Full runtime geometry acceptance covers only 105/112 IDs; seven are refused and four legacy root/earth-core keys are orphaned. No approved geometry crosswalk is established.
- **Public canon:** Reboot-OS PR #49 proposes a frozen 119-table allowlist and quarantines eight entries. Static cross-check: 119 unique allowlist entries match current-main manifest SHA/row counts, with eight excluded; the PR is draft/unmerged and runtime fingerprint tests remain unverified because its exact-head gate failed before runner startup. The current public canon routes remain a P0 exposure review gate; do not import the protected vault or enable Source gateway until allowlist review and exact-head CI pass. Runner issue: [Reboot-OS #51](https://github.com/rebootos-sourcce/Reboot-OS/issues/51).
- **Geometry acceptance detail:** a full runtime-rule comparison accepts measured positions for only 105/112 canonical IDs. Seven are refused (IDs 43, 107, 108, 109, 110, 111, 112) because of missing positions, out-of-range anchor coordinates, or crown-seat deltas beyond the configured limit; four legacy root/earth-core keys are orphaned. Require an approved geometry crosswalk before changing positions or aliases.
- **CI interpretation:** latest Reboot-OS #45/#48 gate attempts failed before steps were recorded and logs are unavailable. Do not classify these as code-test failures or passes. Track root-cause investigation in [Reboot-OS issue #51](https://github.com/rebootos-sourcce/Reboot-OS/issues/51), then require exact-head CI.
- **Release boundary:** human accessibility/privacy review, non-production migration/rollback proof, persisted browser→Worker→database→reload acceptance, provider verification, and explicit release authorization remain mandatory.

The full additive execution record is in [the P0 control board](ATUNED_P0_EXECUTION_CONTROL_BOARD.md), the Reboot-OS [recursive execution audit](https://github.com/rebootos-sourcce/Reboot-OS/blob/docs/p0-recursive-execution-audit-20261014/atuned/docs/P0-RECURSIVE-EXECUTION-AUDIT-2026-10-14.md), and the [source traceability register](https://github.com/rebootos-sourcce/Reboot-OS/blob/docs/p0-recursive-execution-audit-20261014/atuned/docs/P0-SOURCE-TRACEABILITY-REGISTER-2026-10-14.md). No production migration, data write, deployment, gift issuance/activation, profile-sync activation, or billing activation was performed by this cycle.

## Current verified checkpoint — 13 October 2026 UTC

| Workstream | Exact evidence | Current status |
|---|---|---|
| Architecture map | [Architecture review](ATUNED_ARCHITECTURE_REVIEW_2026-10-13.md), report commit [0956c4f](https://github.com/rebootos-sourcce/MOB/commit/a7ba1091fecb675217b8bff7137c517ed1b74a1f) | Six independent review passes plus final cross-check documented. Source map and relevant branch-diff register complete; live Cloudflare target/publisher confirmation open. |
| MOB client | [PR #66](https://github.com/rebootos-sourcce/MOB/pull/66), head `fc7033fb24ec9ed94e2f63563e723b82603b2e68`; [workflow #38322094250](https://github.com/rebootos-sourcce/MOB/actions/runs/38322094250) | Exact recorded-head CI succeeded; PR remains draft/open/unmerged. Does not prove gift approval or persisted E2E. |
| Reboot-OS gift contract + public canon guard | [PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35), head `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf); [server workflow #38333447700](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38333447700); [smoke #38333450875](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38333450875); [smoke #38333447634](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38333447634) | Server tests passed 147/147; both smoke jobs passed. PR remains draft/open and is stacked on PR #34. External Cloudflare check is still failed. |
| Cloudflare Workers Build | [Failed build `0b27be84-ebb9-4d97-b20b-eba999fdcebc`](https://dash.cloudflare.com/b34a8a4f24d5ac71f7b386c240a6da90/workers/services/view/atuned-os/production/builds/0b27be84-ebb9-4d97-b20b-eba999fdcebc) and [server health probes](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38333447700) | Log confirms failed command `npx wrangler preview` stopped because `previews` was missing. Later settings screenshot shows `npx wrangler deploy`, root `/`, no build command. This mismatch must be resolved; no guess-based change. Read-only probes: `atuned-api /v1/health = 200`; `atuned-os /v1/health = 404`. |
| Cloudflare Pages production publisher | [MOB deploy workflow](https://github.com/rebootos-sourcce/MOB/blob/main/.github/workflows/deploy.yml) and [Reboot-OS web workflow](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/.github/workflows/web.yml) | **P0 risk:** both workflows publish different root bundles to Pages project `atuned`, branch `main`. Verify account bindings and designate one production publisher before further live site deploys. |
| Backend/API target | [Reboot-OS Wrangler config](https://github.com/rebootos-sourcce/Reboot-OS/blob/alpha/p1-fixed-pattern-gift-contract-20261010/atuned/server/wrangler.toml) | Source configuration names `atuned-api` under `atuned/server/`; dashboard service `atuned-os` is separate and not confirmed to be the API. Actual `ATUNED_API` Pages variable remains unverified. |
| Canonical starter gift / protected vault | [MOB issue #58](https://github.com/rebootos-sourcce/MOB/issues/58), [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35), Library `/canon_vault.sqlite` | Vault found and checked read-only 13 Oct: 3,346,432 bytes, SHA-256 `9c2cd7b610c1e7b1d056646047988b67d0f52368139952bcc2782b930056915e`, integrity `ok`, 0 FK violations, and all four original source files' sizes/MD5/SHA-256 match vault metadata. Contains 2,900 limiting beliefs + 2,700 truths, 72 duplicate groups, 496 topics. Runtime canon is separate; no production/Supabase import. Gift catalog still has 560 review rows, 0 stable product IDs, 0 owner-approved rows, 0 selected members and no active manifest. |
| Persisted Alpha journey | Browser → correct Worker → Supabase/D1 write/read/reload | 0/1 current-release journeys independently verified. Reboot-OS config sets `PROFILE_SYNC_ENABLED=0`, so profile sync routes are intentionally disabled in that config. |
| P0 closure | [P0 control board](ATUNED_P0_EXECUTION_CONTROL_BOARD.md) and [coordinated P0–P3 tracker #48](https://github.com/rebootos-sourcce/MOB/issues/48) | **OPEN.** Green tests do not resolve the Pages publisher collision, Cloudflare target, source approvals, six-channel/four-track mapping, or persisted E2E proof. |

These are separate evidence measures, not a combined completion percentage. Repository/configuration mapping is complete enough to direct the work; live production topology is not 100% verified. No merge, deployment, production migration, or live data change was made by this audit.

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

## Live exact-head refresh — 13 October 2026 UTC

This section supersedes the historical 12 October checkpoints retained elsewhere in this document. Refresh these exact refs before any new code or production action.

- MOB PR #69/docs branch: report commit `a7ba1091fecb675217b8bff7137c517ed1b74a1f` adds the cross-repository architecture review. This master-index update creates another new head; its own exact-head CI must be checked before calling the docs branch green.
- MOB PR #66: head `fc7033fb24ec9ed94e2f63563e723b82603b2e68`; workflow #38322094250 succeeded. PR is draft/open/unmerged.
- Reboot-OS PR #35: head `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf`; server passed 147/147, smoke #38333450875 and #38333447634 succeeded. PR is draft/open/unmerged and based on PR #34's retention branch, so the stack must be reconciled before promotion.
- Cloudflare Workers Build `0b27be84-ebb9-4d97-b20b-eba999fdcebc` failed. The uploaded log shows `npx wrangler preview` as the command and a missing `previews` block as the first error. A later screenshot shows `npx wrangler deploy`; that is a different configuration snapshot, not evidence the failed run is fixed.
- Cloudflare read-only health checks from current PR #35 CI: `atuned-api /v1/health` returned HTTP 200; `atuned-os /v1/health` returned HTTP 404. Neither alone proves the domain mapping.
- Deployment conflict: MOB `.github/workflows/deploy.yml` and Reboot-OS `.github/workflows/web.yml` both target Cloudflare Pages project `atuned`, branch `main`, while generating distinct website root output. Designate one publishing authority and verify the account/domain bindings before further live publishing.
- Config map: `atuned-api` is the checked-in backend Worker name and root `atuned/server` is its config source. `atuned-os` is a distinct Worker Builds service with unresolved role/domain. Reboot-OS Pages output consumes repository variable `ATUNED_API`; its actual value is not visible in source.
- Public canon: 119 runtime entries remain allowlisted; eight disputed/proposed/vault-labeled entries are quarantined. The remaining entries still need source-authority/public-suitability review.
- Gift baseline: 560-row review queue, zero stable product IDs, zero owner-approved rows, zero manifest selections, and no active banks. Six gift natures remain separate from the 12 starting grounds.
- Current-release persisted journey remains 0/1 independently verified. Six backend verb channels to four client meter tracks remains unmapped by an approved/tested adapter.
- Do not merge, deploy, apply migrations, activate gifts, enable profile sync, or change production flags without explicit owner approval and exact-head evidence.

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
| Public canon API boundary | [Reboot-OS `index.js` at draft head `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf`](https://github.com/rebootos-sourcce/Reboot-OS/blob/48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf/atuned/server/src/index.js), [exposure audit](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_CANON_EXPOSURE_AUDIT_2026-10-12.md) | Content fingerprint checks and same-row-count mutation test are in code. Eight explicitly proposed/unresolved/vault-labeled entries are excluded from public list/table routes; 119 allowlisted entries remain | Authority review of remaining entries is open. No vault import or production deployment authorized |
| Running engineering log | [Reboot-OS `atuned/docs/THE_LOG.md`](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/atuned/docs/THE_LOG.md) | Numbered decisions, backlog items, closure history, generated counts | Existing; update it rather than creating a competing log |
| Reboot-OS prototype | [Reboot-OS README](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/README.md), [ARCHITECTURE.md](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/ARCHITECTURE.md), [DATA.md](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/DATA.md), [ROADMAP.md](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/ROADMAP.md) | Single-file prototype map, data blocks, product roadmap | Docs describe v28; verify current build/version before relying on counts |
| Canonical source corpus / protected vault | Library: `canon_vault.sqlite`, `CANON_VAULT_REVIEW_2026-10-07.md`, the 560-row review queue and four raw source files | Original vault recovered and verified locally in read-only mode: 3,346,432 bytes; SHA-256 `9c2cd7b610c1e7b1d056646047988b67d0f52368139952bcc2782b930056915e`; integrity `ok`; 2,900 limiting beliefs and 2,700 embodied truths. All four source-file size/MD5/SHA-256 values match their vault metadata. Not imported into runtime or Supabase |
| Runtime canon database | Reboot-OS [`0001_canon.sql`](https://github.com/rebootos-sourcce/Reboot-OS/blob/alpha/p1-fixed-pattern-gift-contract-20261010/atuned/server/migrations/0001_canon.sql), generated from `data/canon.sqlite` | Source manifest ↔ generated migration matched 127/127 names, fingerprints and declared row counts; 0 mismatches. Metadata consistency is not content approval or proof that the protected vault has been imported |
| Canon review | `CANON_VAULT_REVIEW_2026-10-07.md` in ChatGPT Library | Evidence for protected corpus, provenance and duplicate policy | Verified document; local staging vault is not proof of production data |
| Canon application closure | ChatGPT Library: `CANON_APPLICATION_CLOSURE_BLOCK_2026-10-07.md` | Existing Source → candidate retrieval → user-confirm/correct/reject → immutable decision → pattern authority/release gate | Local implementation is reported tested (including 12/12 source-closure tests and 61/61 server tests); production deployment/state is not proven. Compare and reuse before rebuilding |
| Local Source wiring artifact and reports | Library: `atuned_source_wired_v2.html`, `source_http.py`, `source_client.js`, plus separately hashed `source_http_healed.py` and `source_client_healed.js`; see [execution refresh](ATUNED_EXECUTION_REFRESH_2026-10-12.md) | Gateway/client files recovered, but `source_http.py` imports missing `source_service.SourceService`; no equivalent file found in Library or current Reboot-OS server source. Original gateway has broad CORS and a health snapshot; healed version improves transport guards but still relies on a client-provided scope unless paired with trusted server-side identity. Worker has no `/v1/source/*` routes | Keep as differential-port reference, not deployable code. Recover missing service/adjudication dependency and define server-verified identity/ownership before integration |
| Current client sniffer / Source AI | [MOB `sniff.js`](https://github.com/rebootos-sourcce/MOB/blob/main/atuned_src/engine/sniff.js), [`sourceai.js`](https://github.com/rebootos-sourcce/MOB/blob/main/atuned_src/engine/sourceai.js), [`imprints.js`](https://github.com/rebootos-sourcce/MOB/blob/main/atuned_src/ui/imprints.js), [`storyui.js`](https://github.com/rebootos-sourcce/MOB/blob/main/atuned_src/ui/storyui.js) | Existing story-to-imprint detection, Source AI question logic, and UI | Present on MOB main. Reuse and review against current tests; do not rebuild. Relation to protected server-side catalog remains a separate integration gap |
| Source-line review queue | ChatGPT Library: `ATUNED_ALL_SOURCE_LINE_REVIEW_QUEUE_2026-10-12.csv` | Record-level source locator, text hash, stablePatternId, owner approval, manifest membership and line/phase review flags | **560 rows:** 376 transcripts (all physically located) + 184 PDF rows (160 unique exact token locators, 24 ambiguous). 0 stablePatternId populated, 0 ownerApproved=true, all 560 not_selected, 0 split/reframe reviews marked complete. 210 multi-line transcript records still need sentence-boundary review. This is a work queue, not a manifest |
| Raw source compilation | ChatGPT Library: `Lance_Energy_Spirituality_Master_Source_Compilation.txt` | Searchable source extracts, including the v65 manuscript extract and source appendix | Secondary compilation aid; preserve originals and provenance; do not replace original sources or the protected vault |
| Starter-gift catalog | [MOB issue #58](https://github.com/rebootos-sourcce/MOB/issues/58); [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) | Stable pattern IDs, sentence-level provenance, frozen 100-item set, issuance snapshot | Blocked: 0 owner-approved stable IDs; no production manifest |
| Onboarding gift choice | [MOB PR #66](https://github.com/rebootos-sourcce/MOB/pull/66) | Starting ground and gift nature are separate; client refuses synthetic local allowance without an approved meter adapter/bank. Current head `fc7033fb24ec9ed94e2f63563e723b82603b2e68` had queued checks at last capture | Open/draft/unmerged; catalog approval, channel-to-track mapping, and E2E persisted readback remain open |
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
| [MOB #58](https://github.com/rebootos-sourcce/MOB/issues/58) | Open P0 issue for canonical sentence inventory and 100-pattern gift | Protected vault exists in Library and its SQLite integrity plus all four source-file hashes were verified read-only. Continue sentence boundaries, stable IDs, authority/channel/side/phase validation, and owner approval; no active manifest |
| [MOB PR #66](https://github.com/rebootos-sourcce/MOB/pull/66) | Open/draft; head `fc7033fb24ec9ed94e2f63563e723b82603b2e68`; workflow #38322094250 succeeded | Candidate for separate gift-nature selection; CI does not approve the six banks or prove persisted end-to-end behavior |
| [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) | Open/draft; head `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf`; server passed 147/147 and both smoke runs passed; external `atuned-os` Workers Build failed | Keep draft and eight-table quarantine; resolve PR #34 stack, Pages publishing collision, and actual Cloudflare service target before promotion |
| [Reboot-OS #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) | Open infrastructure blocker; uploaded log identifies `npx wrangler preview` and missing `previews` block; later screenshot shows `npx wrangler deploy` | Confirm actual service/root/branch, the atuned-api versus atuned-os role, Pages publisher ownership, and `ATUNED_API`; don't add a previews block or retry blindly |
| [MOB PR #68](https://github.com/rebootos-sourcce/MOB/pull/68) | Open/draft; branch `recovery/p0-retention-receipt-20261012`; 3 commits ahead, none behind; workflow #38220044415 succeeded | Current narrow retention-receipt candidate; cross-review with Reboot-OS PR #34 before promotion |
| [MOB PR #65](https://github.com/rebootos-sourcce/MOB/pull/65) | Open/draft; copy/delete-confirm gate change; workflow #38148880267 succeeded; base is `dev7/p0-alpha-gates-20261010` | Stacked on an unmerged P0 candidate; selectively port to current main if still needed rather than merging the base blindly |
| [MOB PR #60](https://github.com/rebootos-sourcce/MOB/pull/60) | Open/draft; identity-safe profile import; branch is 10 ahead and 1 behind main; workflow #38093746343 succeeded | Review the schema delta against Reboot-OS PR #36; this branch is a candidate, not production authority |

Refresh every state above from GitHub before acting; this snapshot can become stale.

## 7. Content and site inventory gaps

The current accessible evidence identifies the following gaps that must be closed by inventory, not guesswork:

1. **Site URL register:** confirm canonical live URLs for Reboot-OS, ATÜNED, and The Mechanics of Being. One previously identified candidate domain is explicitly prohibited because it resolves to an unrelated product; do not link or open it. The approved ATÜNED production/demo URL is not yet verified. `lancepowell.art` is a discoverable art portfolio, but its role as the authoritative Mechanics of Being method site is unverified.
2. **Website-to-repository map:** the 13 October architecture review maps source/build pathways for MOB and Reboot-OS and identifies a potential dual-publisher collision at Pages project `atuned`. Still confirm account bindings, domain mapping, analytics/forms/privacy links, and exact production SHA before calling the live map complete.
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

1. **Resolve production publishing ownership.** MOB and Reboot-OS both have workflows that publish distinct website roots to Cloudflare Pages project `atuned`, branch `main`. Verify the actual account/project bindings and designate exactly one production publisher. The architecture report recommends keeping MOB as root funnel publisher while Reboot-OS's product output remains artifact/preview until deliberately integrated; this recommendation has not been applied.
2. **Resolve Cloudflare Worker identity.** The failed `atuned-os` build log ran `npx wrangler preview` and failed because the selected Wrangler config had no `previews` block. A later screenshot shows `npx wrangler deploy`, root `/`, no build command. Do not change `atuned-os` to use `atuned/server` or retry an alpha branch as Production until service purpose, repository, branch and root are confirmed. The backend's checked-in Worker is `atuned-api`; read-only current PR #35 probes report `atuned-api /v1/health = 200` and `atuned-os /v1/health = 404`.
3. **Verify Pages → API binding.** Confirm the Reboot-OS Pages variable `ATUNED_API` points to the intended `atuned-api` HTTPS origin and matches CORS/CSP. The actual variable value is not visible in repository source.
4. **Refresh docs CI.** PR #69's architecture report, index and board were updated after its last green workflow. Check the latest branch head and its own run; do not reuse an older workflow as evidence for this new head.
5. **Continue the gift bank gate.** The original protected vault is already in the ChatGPT Library; the SQLite file and all four source-file size/MD5/SHA-256 values were verified read-only. Do not request or recreate a duplicate. The production gift queue remains 560 rows, zero stable product IDs, zero owner-approved rows, zero selected entries. Finish sentence boundaries and source classification; prepare exactly six separately versioned 100-item banks only after explicit owner approval.
6. **Close remaining P0 data contracts.** Review the 119 remaining runtime public-canon entries for source authority/public suitability; define the tested six-server-channel to four-client-track mapping; prove browser → intended Worker → Supabase/D1 write → read → reload on approved non-production data.
7. **Promote components, not entire old branches.** Use main as the deployment-intended base; compare selected changes from PRs #65/#66/#68/#60 and divergent dev7 branches against current main. Preserve the ancestry of Reboot-OS PR #35 on PR #34. Review the detailed branch freshness and backlog register in [the architecture review](ATUNED_ARCHITECTURE_REVIEW_2026-10-13.md).
8. Keep PRs draft until required review and exact-head tests pass. No merge, production deploy/migration, billing/profile-sync enablement, gift activation or issuance without explicit owner approval.

**Release posture:** MVP Alpha is not release-ready. The architecture map is complete at repository/configuration level; live production routing remains open pending single-publisher choice, authenticated Cloudflare target verification, approved gift banks, channel mapping, and persisted end-to-end proof.

## API and deployment map — refreshed 13 October 2026

The route inventory is extracted from the Reboot-OS [Worker entry point at PR #35 head](https://github.com/rebootos-sourcce/Reboot-OS/blob/48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf/atuned/server/src/index.js). The server defines 35 routes. The full route list and pathway descriptions are in [ATUNED Architecture Review](ATUNED_ARCHITECTURE_REVIEW_2026-10-13.md). This is a code inventory, not proof every route is active in Production.

### Service register: names are not interchangeable

| Object | Repo/config path | Expected job | Current evidence |
|---|---|---|---|
| Cloudflare Pages project `atuned` | MOB `.github/workflows/deploy.yml`; Reboot-OS `.github/workflows/web.yml` | Public website | **P0 publishing collision risk:** both workflows publish different root bundles to project `atuned`, branch `main`. Verify account binding and assign one publisher. |
| Worker `atuned-api` | Reboot-OS `atuned/server/wrangler.toml`, entry `atuned/server/src/index.js` | API, D1, Supabase RPCs, scheduled work and provider proxies | PR #35 read-only health probe returned HTTP 200 at `/v1/health`. Production/domain mapping still needs readback. |
| Worker Builds service `atuned-os` | Cloudflare dashboard, repository Reboot-OS; settings screenshots show root `/`, no build command, deploy command `npx wrangler deploy` | **Unresolved role**; dashboard mentions static-assets-only trigger limitation | Failed build used `npx wrangler preview` and stopped on missing `previews`; later UI shows `deploy`. Probe at `/v1/health` returned 404. Do not assume this is the API or repoint it to the backend. |
| Pages variable `ATUNED_API` | Reboot-OS `.github/workflows/web.yml` and `atuned/test/tools/web.py` | Inject API origin into product HTML and CSP | Actual value not visible in source. Confirm it names the intended `atuned-api` origin and matches Worker CORS. |
| `atuned.world` custom domain | Pages domain configuration | Public root, which MOB describes as the funnel | Live domain-to-deployment binding not independently read from authenticated Cloudflare. Confirm actual account/domain/prod commit. |

### Cloudflare build failure and safety rule

The uploaded log for build `0b27be84-ebb9-4d97-b20b-eba999fdcebc` proves the command was `npx wrangler preview` and Wrangler 4.149.0 failed because no `previews` block was in the selected config. The later screenshot has a different command (`npx wrangler deploy`). This is a configuration snapshot mismatch to reconcile, not a reason to add `previews` blindly.

Checked-in `atuned/server/wrangler.toml` names the API Worker `atuned-api`, and `atuned/server/package.json` sets `npm run deploy` to `wrangler deploy`. **These are instructions for the API service only. They are not proof that the separate `atuned-os` static-assets service should use root `atuned/server`.**

Do not edit Cloudflare settings or retry a Production build until the operator confirms the exact service, source repository, production branch, root directory, command, asset bindings, and domain. Do not add a preview block just to silence the failed command. No dashboard setting or production deployment was changed by this review.

### Publishing rule to close

1. Confirm whether both repositories are connected to the same Cloudflare account and Pages project.
2. Assign exactly one Production publisher for Pages project `atuned`, branch `main`.
3. Keep a single artifact that includes the approved root funnel and the product app at its approved named path. If the product must remain in its own build, publish it as artifact/preview until integration is deliberately designed.
4. Confirm `ATUNED_API` and verify the public route after deployment.
5. Read back the actual production deployment commit and test the expected root and app URLs. A successful GitHub job alone does not prove the live website output is correct.

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


### Latest continuation work — 13 October 2026

- [Architecture review](ATUNED_ARCHITECTURE_REVIEW_2026-10-13.md), report commit `a7ba1091fecb675217b8bff7137c517ed1b74a1f`: six independent architecture passes, pathway maps, 35-route inventory, Cloudflare service register, selected branch-diff matrix, P0/P1 gap ledger, and archive/backlog rules.
- Protected `/canon_vault.sqlite` exists in the ChatGPT Library. Read-only SQLite check: integrity `ok`, 0 foreign-key violations, SHA-256 `9c2cd7b610c1e7b1d056646047988b67d0f52368139952bcc2782b930056915e`; all four raw source file sizes/MD5/SHA-256 values match the vault source metadata exactly. Contents remain separate and unimported.
- Reboot-OS PR #35 head `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf`: server workflow #38333447700 passed 147/147; smoke workflows #38333450875 and #38333447634 succeeded; Cloudflare Workers Build `atuned-os` failed on `0b27be84-ebb9-4d97-b20b-eba999fdcebc`.
- MOB PR #66 head `fc7033fb24ec9ed94e2f63563e723b82603b2e68`: workflow #38322094250 succeeded. PR remains draft.
- Reboot-OS PR #35 is based on PR #34's retention branch. Resolve the stack, verify the service target and single Pages publisher before promotion.
- **Current branch rule:** prefer main as the deployment-intended base; compare selected changes from divergent P0/P1 branches in the architecture report. Do not replace main with a whole old branch merely because it has a green historical workflow.
- **Current release state:** 119 runtime canon entries remain allowlisted but not all source-authority reviewed; gift queue remains 0 approved stable IDs out of 560; channel mapping and current-release persisted browser → Worker → storage reload remain unverified.
- PR #69's latest documentation updates are newer than the last recorded green docs workflow. Refresh the current PR head and verify checks for that exact head.
- No merge, production deployment, migration, billing/profile sync enablement, gift activation/issuance, or production data mutation was performed.



### Latest read-only Cloudflare probe — 13 October 2026

- [Cloudflare read-only probe report](ATUNED_CLOUDFLARE_READONLY_PROBE_2026-10-13.md): exact-head CI confirmed `atuned-api /v1/health` = HTTP 200 and `atuned-os /v1/health` = HTTP 404; both Wrangler dry-runs succeeded without deploying. Authenticated dashboard configuration, single Pages publisher ownership, and the failed external build remain unresolved. P0 remains open.
- Documentation workflow #38423556852 passed all 30 jobs on the current exact head `d0a6c6379c8caa0afb584489732f222b43b657ad` (30/30 successful jobs): [workflow evidence](https://github.com/rebootos-sourcce/MOB/actions/runs/38423556852). PR #69 remains draft/open/unmerged. This validates repository checks for the documentation head only; it does not clear the Cloudflare build failure or production blockers.


## MVP Alpha KPI source of truth — 13 October 2026
The KPI framework is tracked in [ATUNED_MVP_ALPHA_KPI_FRAMEWORK_2026-10-13.md](ATUNED_MVP_ALPHA_KPI_FRAMEWORK_2026-10-13.md). Apple App Analytics and Human Interface Guidelines are reference frameworks, not direct numerical benchmarks for ATÜNED. Proposed numeric targets require owner approval; all metrics must state numerator, denominator, cohort/window, exact test/build/commit, and status. Raw reflection text is not to be logged by default.

**KPI/P0 state:** A0-02 persisted browser → intended Worker → storage write/read/reload remains OPEN (0/1 independently verified); A0-08 gift banks remain OPEN (0 approved stable IDs recorded in the 560-row queue, no active manifest); A0-09 six server gift-nature channels to four client meter tracks remains UNVERIFIED; A0-10 one authoritative Pages publisher and verified API/domain mapping remains OPEN. P0 is NOT CLOSED.



**Latest recursive execution cycle — 13 October 2026, 12:13 PDT:** [P0 cycle record](ATUNED_P0_RECURSIVE_EXECUTION_CYCLE_2026-10-13_1213PDT.md). The latest docs workflow was queued at the time of the check; P0 remains open.


## Recursive build cycle 2 — 13 October 2026 UTC

- [P0 recursive build cycle 2 report](ATUNED_P0_RECURSIVE_BUILD_CYCLE_2026-10-13_1945UTC.md).
- MOB PR #70 Alpha artifact build passed at exact head `a47fe148e92cf6e628c0a128a09cb58c47dde9de`: [workflow #38438059206](https://github.com/rebootos-sourcce/MOB/actions/runs/38438059206), 31/31 jobs successful, artifact upload successful. Artifact metadata: 2,829,342 bytes; SHA-256 `408417e7acdbcfdefc01eacbad4e195deff6775e68d7aa1c01e5bb55de20ab44`. Internal ZIP member list still needs direct inspection.
- MOB PR #69 documentation CI passed at exact head `f8906555623f6403f9bbe78a40a743a7a46c1605`: [workflow #38453296307](https://github.com/rebootos-sourcce/MOB/actions/runs/38453296307).
- Reboot-OS PR #38 removes the competing Pages deploy action but its separate external Workers Builds check failed at exact head `70252de086bf36696b832f79c7734c9bf3841e1b`: [check #115487951398](https://github.com/rebootos-sourcce/Reboot-OS/runs/115487951398), build `dd4ebc77-57dc-4535-8357-3e91f5f85824`. The failed check is not the removed Pages deploy step; obtain authenticated Cloudflare first-error and service configuration before changing repository configuration.
- P0 remains OPEN: persisted browser-to-Worker-to-storage journey 0/1 independently verified; owner-approved stable gift IDs 0; six-to-four mapping unverified; authenticated production publisher/API/domain bindings unverified. No merge, deployment, migration, protected-vault import, gift activation, billing/profile-sync enablement, or production data mutation occurred.


## Recursive build cycle 4 — 13 October 2026 UTC

- [P0 recursive build cycle 4 report](ATUNED_P0_RECURSIVE_BUILD_CYCLE_2026-10-13_2257UTC.md).
- Exact-head workflows refreshed for MOB #69, #70, #66 and Reboot-OS #35, #38; all reported repository workflow success at their current heads. This does not independently verify external Cloudflare routing or production deployment.
- Alpha artifact #11833758292 was downloaded and inspected. All seven expected files are present and non-empty; `engine.js` parses with Node; six HTML files pass basic document-marker checks. ZIP SHA-256: `408417e7acdbcfdefc01eacbad4e195deff6775e68d7aa1c01e5bb55de20ab44`.
- P0 remains OPEN: current-release persisted E2E 0/1; owner-approved stable gift IDs 0; six-to-four meter mapping unverified; Cloudflare publisher/API/domain binding unresolved; migrations/rollback and public-canon provenance review remain incomplete. No production mutation or merge occurred.


### Cycle 4 follow-up — external Cloudflare check still failing

- Current Reboot-OS PR #38 head `8f4b722a600f9eed489b92786204916d3587d2e3`: local `web` workflow succeeds, but external `Workers Builds: atuned-os` check #115557166260 fails on build `c047ef31-f5b5-43a7-b36b-ad3a16df7e7c`; the check has zero annotations and exposes no first-error log. [Build details](https://dash.cloudflare.com/b34a8a4f24d5ac71f7b386c240a6da90/workers/services/view/atuned-os/production/builds/c047ef31-f5b5-43a7-b36b-ad3a16df7e7c). Authorized operator evidence is required; no speculative config patch.


### Cycle 4 follow-up — separate API preview and OS production outcomes

- Reboot-OS PR #35 current head has successful server/smoke workflows, successful external `atuned-api` preview build `f58c7387-2bbf-4060-a579-ae666d2ca488`, and failed external `atuned-os` production build `b9148ff9-4c07-49f4-8926-1e6d77d7c851` with zero annotations. A preview success does not establish production routing or the deployed Pages `ATUNED_API` value. Authorized Cloudflare confirmation remains required.


## Latest engineering delta — 14 October 2026 UTC

- Reboot-OS PR #53 head is now `938bbc628bf035b79c12a08179d2ef17ca7b400e`. Its workflow regression script checks least-privilege permissions, forbids `pull_request_target` and `write-all`, requires exactly one `contents: write` permission, and validates rollback-tag guards. Exact-head push run [#38646477095](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646477095) and pull-request run [#38646483356](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646483356) both failed before steps. Draft status is not the cause; issue [#51](https://github.com/rebootos-sourcce/Reboot-OS/issues/51) contains the admin evidence.
- Reboot-OS PR #52 head is now `8b34a7c787a1eca93d77c798e6324493988763ee`. The geometry source audit is wired into the gate; its PMFALIAS parser was corrected after cross-review found that the source is JavaScript object syntax, not JSON. The exact source-literal parser check passed locally. Exact-head push [#38646345109](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646345109) and pull_request [#38646353600](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646353600) both failed before steps, so CI has not executed the audit.
- MOB PR #69 documentation refresh at prior head `3d0b3b62e76a7e00dd6d66dbc8993662519b2daf` is under a live 28-job workflow [#38645821317](https://github.com/rebootos-sourcce/MOB/actions/runs/38645821317); at last poll, 26 jobs had passed and functional/recordlink jobs were still in progress. Do not call it complete until the aggregate gate finishes.
- The current [engineering continuation handshake](ATUNED_EXECUTIVE_HANDSHAKE_2026-10-14_P0_ENGINEERING.md) is refreshed with these exact heads and keeps all lookdev work excluded.


## Recursive build cycle 5 — 14 October 2026 UTC

**P0 remains OPEN.** This section supersedes earlier same-day head/run notes where they differ. No merge, deployment, production migration, protected-vault import, gift activation, billing/profile-sync enablement, or production data mutation occurred.

### Block A — exact-head evidence
- Before this refresh, PR #69 documentation workflow [#38650695161](https://github.com/rebootos-sourcce/MOB/actions/runs/38650695161) passed all 30 jobs at exact head `d1fc54c7dbd6b25e3604fc57b80ffbdcbb768e4f`. That result is valid for that head only; this documentation commit requires its own exact-head run before Block A closes.
- PR #73 owner-approval contract head `280c16cfd927f640c7ea7bba84e0ca8034dadc61`; workflow [#38652146233](https://github.com/rebootos-sourcce/MOB/actions/runs/38652146233) remains in progress, with the functional and onboarding2 browser jobs still running at the last check.

### Current Reboot-OS engineering heads
| Workstream | Exact head | Exact-head evidence | Current interpretation |
|---|---|---|---|
| PR #35 gift contract / migrations | `4406bf1d7d38655d03f4b4653e4510aad47ad72f` | [#38652445955](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38652445955) | Smoke failed before steps; no tests executed. PR remains stacked on draft PR #34. |
| PR #47 single Pages publisher | `b7d9f613f4d6a8951d6ce86de8649acb6b006d55` | [#38652450859](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38652450859) | Smoke failed before steps; no tests executed. Artifact-only workflow and publisher guard are combined with least-privilege permissions and guarded last-green tag logic. |
| PR #48 gift-bank validator | `513d098dbddc1ce0acd8906dbae753bdd9381ff1` | [#38652656758](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38652656758) | Smoke failed before steps; no tests executed. Validator now rejects duplicate JSON object keys, cross-bank stable-ID reuse, and schema attempts to enable cross-bank reuse; local-vs-cross-bank diagnostics are distinct. |
| PR #52 geometry crosswalk | `5ad705ad987ace6aee311f6e7d8a3f3e9980e628` | [#38646353600](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646353600) | Pull and push runs failed before steps; source-level checks confirmed 113 measured positions and four expected legacy orphans; no coordinates changed. |
| PR #53 workflow permissions | `88de1de769b4aec70ab415c9e976119c5d70734a` | [#38652441780](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38652441780) | Smoke failed before steps; no tests executed. Static source simulation passes, including the sole `contents: write` scope being confined to `move-last-green`. |
| PR #49 public canon | `b757ae5d35cd9f42286c4de2a8f25d889d9eec54` | [#38514518771](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38514518771) | Historical exact-head run failed before steps; 119 allowlisted runtime entries still need source-authority review. |
| PR #46 reduced motion | `2eae6b7c07d57d9979eb8f4ea462801730e1f055` | [#38513391386](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38513391386) | Historical exact-head gate passed; human accessibility review remains open. |

The repeated Reboot-OS failures have the same infrastructure signature: `smoke` ends with `steps=null` and `logs_url=null`, and the rollback-tag job is skipped. They are neither application-test failures nor passes. The latest runner evidence is recorded in [issue #51](https://github.com/rebootos-sourcce/Reboot-OS/issues/51). No further retries were issued.

### Block B — source inventory
- Queue: 560 records (376 2026 transcript, 184 archived PDF); zero owner-approved rows, zero stable production IDs, zero reviewed line splits, zero reviewed release/reframe classifications.
- 24 PDF locators remain ambiguous; 210 transcript records need sentence-boundary review; 154 rows lack `indexNodeId` (124 transcript, 30 PDF).
- 107 repeated source-text hash groups cover 266 rows (55 two-row groups and 52 three-row groups). These are review leads, not permission to delete records or collapse provenance. Preserve sourceRecordId and every source locator.

### Blocks C–E — gift contracts, client mapping, canon and migration safety
- PR #35 adds a versioned gift-nature mapping guard with a transaction-scoped advisory lock; a frozen starter set belongs to exactly one gift nature. The six-nature-to-four-client-track mapping is separate from the six server action/verb channels and remains unapproved/unverified.
- MOB PR #66 client behavior remains fail-closed: a verified server snapshot is not marked usable by the four-track meter until an owner-approved adapter exists. Current-release browser → Worker → storage write/read/reload remains unverified.
- Live Supabase project `tuvpjbduarteszwkdmuu` has applied migrations through `0015_first_visit_reaches_the_account`; 0016–0018 are absent. `starter_gifts` has 6 rows (5 active, 1 pending). Migration 0017 adds null frozen-set version fields and demotes legacy gifts without valid 100-item snapshots; as written, all 6 existing gifts would become pending absent an approved backfill. This user-visible impact is recorded on [MOB issue #58](https://github.com/rebootos-sourcce/MOB/issues/58). No migration was applied.
- Geometry IDs 43, 110, and 112 remain unresolved pending an approved crosswalk. The protected canon vault remains private and unimported.

### Block F — publishing
- PR #47 removes Reboot-OS's second Pages deployment and keeps its web output as an artifact, while retaining a guard and least-privilege workflow checks.
- Authenticated Cloudflare confirmation is still required for the canonical Pages publisher, account/project binding, `atuned-os` service purpose, domain/root route, and `ATUNED_API` origin. Do not deploy or mutate dashboard configuration speculatively.

### Blocks G–H — cross-review and closure
- Static source-level simulations of the workflow permission/tag guards passed on current PR #35, #47 and #53 files; this is not a substitute for CI. Their exact-head workflows have not executed test steps.
- Keep all PRs draft. P0 closure requires approved source-backed banks, the explicit channel/track contract, current-release persisted end-to-end proof, migration/rollback proof, and verified production publisher/API/domain ownership. The refreshed docs head must also pass its own workflow.
