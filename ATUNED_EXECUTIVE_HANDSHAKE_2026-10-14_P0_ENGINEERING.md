# ATÜNED Executive Handshake — P0 Engineering Continuation
**Prepared:** 14 October 2026 UTC  
**Purpose:** Pick up engineering P0 execution in a new thread without re-discovering the repository state or widening scope.  
**Scope:** Reboot-OS and MOB engineering, tests, safety, CI, data/persistence contracts, release gates.  
**Explicit exclusion:** Lookdev, brand/look development, visual redesign, and PR #74 / branch `lookdev/p0-execution-20261014`. Do not spend execution cycles on that workstream.

## Executive state

**P0 is not closed. Do not merge or deploy to manufacture a green board.** Work autonomously on independent engineering tasks, in parallel where possible. Continue until every automatable P0 is closed; only owner/administrator-dependent gates should remain. Keep exact-head evidence and distinguish code/test results from live-production acceptance.

### Hard operating rules
1. Start by reading this handshake, the [Master Index](ATUNED_MASTER_INDEX.md), and [P0 Execution Control Board](ATUNED_P0_EXECUTION_CONTROL_BOARD.md). Reconcile exact branch heads and current checks before editing.
2. Build in isolated branches/PRs. Add regression tests for fixes. Cross-check source and acceptance criteria; no claim of CI pass without an executed exact-head gate.
3. Never merge or deploy, apply production migrations, import `canon_vault.sqlite`, mutate production data, activate/issue gifts, or activate billing/profile sync without explicit authorization and required evidence.
4. Never invent gift selections, stable IDs, provenance, six-nature-to-four-track mappings, geometry positions/aliases/exclusions, Cloudflare bindings, or owner approval.
5. If a runner fails before any steps execute, record it as infrastructure/startup failure, not a code test failure and not a pass. Avoid repeated retries absent new evidence.
6. Do not lower test floors. Keep protected vault artifacts read-only.
7. User preference: execute blocks recursively/concurrently; do not repeatedly ask the user to tell the assistant to continue. No lookdev tasks.

## Current repositories and PRs

### Reboot-OS — `rebootos-sourcce/Reboot-OS`

| Block | PR / exact head | Current evidence | Next action |
|---|---|---|---|
| CI least privilege + guarded rollback tag | [PR #53](https://github.com/rebootos-sourcce/Reboot-OS/pull/53), `938bbc628bf035b79c12a08179d2ef17ca7b400e`, draft/open | Static source check confirms read-only default; isolated write-only tag job; smoke dependency; main-push restriction; stale-head, ancestry, remote-tag race, and compare-and-swap guards. Added `atuned/test/tools/workflow_permissions.py` and wired it into the gate. Exact-head run [#38646483356](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646483356) failed before any steps (`steps=[]`); tag job skipped. The paired push run [#38646477095](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646477095) has the same outcome. | Keep draft. Shared runner issue is not caused by draft status. Continue with source-level validation and request admin investigation under issue [#51](https://github.com/rebootos-sourcce/Reboot-OS/issues/51). Do not keep retrying the same no-step failure. |
| Gift-bank fail-closed validator | [PR #48](https://github.com/rebootos-sourcce/Reboot-OS/pull/48), `fe8cc1074adc19056f69ad1c35feee38749307d0), draft/open | Validator and synthetic tests exist. Exact-head run [#38514915008](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38514915008) failed with zero steps. Prior successful run predates the latest regression additions. | Restore runner execution, then run exact-head validator tests. Real source banks, stable IDs, approvals, schema, and mapping remain owner-dependent. No manifest or gift activation. |
| Public canon fail-closed allowlist | [PR #49](https://github.com/rebootos-sourcce/Reboot-OS/pull/49), `b757ae5d35cd9f42286c4de2a8f25d889d9eec54`, draft/open | Static inventory: 119 allowlisted entries match manifest hashes/row counts; 8 entries excluded. Exact-head run [#38514518771](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38514518771) failed before steps. Runtime fingerprint/endpoint evidence is not verified. | Restore runner; execute exact-head runtime checks. Keep protected vault unimported and public canon exposure gate closed. |
| Canonical geometry crosswalk | [PR #52](https://github.com/rebootos-sourcce/Reboot-OS/pull/52), `8b34a7c787a1eca93d77c798e6324493988763ee`, draft/open | Static source checks establish 112 unique NODEREG IDs, exact PMFPOS/fetter_positions equality (113 position keys), and documented geometry rejects. The source audit is wired into the gate. Cross-review fixed the PMFALIAS parser to handle JavaScript object syntax without `eval`; its five-entry parser check passed locally. Runtime browser evidence and authoritative source crosswalk remain absent. Exact-head pull_request run [#38646353600](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646353600) and push run [#38646345109](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646345109) both failed before steps. | Restore runner; add/execute fail-closed packaged-browser geometry checks. Do not alter coordinates/topology without source-backed approval. |
| Prevent duplicate Pages publishing | [PR #47](https://github.com/rebootos-sourcce/Reboot-OS/pull/47), `a43aae252811b00b082b8c7be55320b4204a8006`, draft/open | Exact-head gate [#38512729513](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38512729513) passed. Change is not merged; both repositories have deploy paths. | No merge/deploy until authenticated operator confirms canonical publisher, account/project/domain, root/build command, Worker binding, and rollback path. Historical evidence says MOB was the known production publisher; re-verify current bindings. |
| Reduced motion | [PR #46](https://github.com/rebootos-sourcce/Reboot-OS/pull/46), `2eae6b7c07d57d9979eb8f4ea462801730e1f055`, draft/open | Exact-head gate [#38513391386](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38513391386) passed, including automated non-vacuous reduced-motion checks. | Human keyboard/screen-reader and remaining-motion review remains required. Do not merge as a substitute for that review. |
| Starter grants / persistence contract | [PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35), `f4cc9e965c0c4037f0aef09d7eb1292bf21ca656`, draft/open | Exact-head server/full-gate runs previously passed on that head. This is repository CI evidence only. | Owner must confirm migration 0015 on the intended Supabase target and provide live browser → Worker → Supabase → attach → readback → deletion evidence. Review migrations 0016–0018/rollback in non-production before authorized live changes. |

### MOB — `rebootos-sourcce/MOB`

| Block | PR / exact head | Current evidence | Next action |
|---|---|---|---|
| Gift nature distinct from onboarding ground | [PR #66](https://github.com/rebootos-sourcce/MOB/pull/66), `fc7033fb24ec9ed94e2f63563e723b82603b2e68`, draft/open | Exact-head workflow [#38322094250](https://github.com/rebootos-sourcce/MOB/actions/runs/38322094250) passed all 30 jobs including functional browser and `gates-pass`. This is repository test evidence, not catalog approval or live persistence evidence. | Preserve no-set behavior: explicit `giftAccess='uninstalled'`, free allowance 10/week; never issue an implicit 100-pattern gift. The server catalog-to-meter adapter and approved IDs/mapping remain absent. |
| Master index / implementation audit / decisions | [PR #69](https://github.com/rebootos-sourcce/MOB/pull/69), prior head `575adea03ca7b1fbfd65580a4d0c138ef742924f`, draft/open | Exact-head workflow [#38515801145](https://github.com/rebootos-sourcce/MOB/actions/runs/38515801145) passed all listed jobs. This handshake refresh adds documentation and will require fresh exact-head checks. | Review and merge only through normal process; keep the control board current. Do not let docs CI success imply release acceptance. |
| Atomic release/quiz/Alpha acceptance | [PR #59](https://github.com/rebootos-sourcce/MOB/pull/59) is merged. | Merged code is not a substitute for the still-open catalog, safety, and live-persistence gates. | Continue dependent regression work only where it does not fabricate source or bypass owner gates. |

## Shared infrastructure blocker

Reboot-OS exact-head runs #38642952053 and #38646483356 (PR #53), #38514915008 (PR #48), #38514518771 (PR #49), and #38646353600 (PR #52) each recorded a failed smoke job with no steps; #53's tag job was skipped. These outcomes are not test assertions failing. The latest #53 run confirms a `pull_request` workflow is created while the PR is draft, so draft status is not the cause.

Admin action tracked in [Reboot-OS issue #51](https://github.com/rebootos-sourcce/Reboot-OS/issues/51): inspect Actions enablement, allowed-actions policy, hosted-runner entitlement/billing/spending cap, runner groups, and GitHub Support if settings look correct. Do not spend cycles on repeated failed-job retries without new runner evidence.

## Owner / administrator / human acceptance gates

These may remain open only because they require authorized external action or decisions; they must remain explicitly tracked:
1. GitHub Actions/hosted-runner diagnosis and restoration.
2. Owner-approved six banks (100 items each) with stable IDs, exact source provenance/hashes, item schema, approval references, and approved six-nature → four-track mapping.
3. Authenticated Cloudflare verification of canonical production publisher/service, Pages/Worker bindings, domain, root/build command, failing `atuned-os` provider logs, and rollback.
4. Confirm migration 0015 is applied on the intended Supabase project; review migrations 0016–0018 and demonstrate rollback in non-production before any authorized live migration.
5. Controlled live browser → Worker → storage write/read/reload/account attach/deletion/no-resurrection evidence and consent/retention/log/artifact privacy review.
6. Human keyboard, screen-reader, mobile, and remaining-motion accessibility acceptance.
7. Explicit release/rollback sign-off.

## Immediate execution order for the next thread
1. Read the exact-head run status for PR #53, #48, #49, #52 and MOB PR #66/#69. Do not treat PR #74 / lookdev runs as in-scope.
2. Continue source-level review and add independent tests to P0 branches without retrying runner-startup failures.
3. Finish source-grounded geometry acceptance tooling and cross-review gift validator/public canon fail-closed behavior.
4. Keep PR #47 and #46 draft until human/operator gates are satisfied.
5. Refresh this handshake and the control board only when evidence changes. Do not claim all P0s are complete while any required acceptance gate is open.

## Safety / release boundary
No merge, production deployment, live migration, production data mutation, protected vault import, billing/profile-sync activation, or gift activation/issuance was authorized or performed in this execution cycle. Draft branches stay draft until their own exact-head evidence and relevant owner/operator acceptance gates pass.


## Current continuation delta — 14 October 2026 UTC

P0 remains OPEN. Read the latest recursive build cycle in `ATUNED_MASTER_INDEX.md` and `ATUNED_P0_EXECUTION_CONTROL_BOARD.md` before changing a branch. The last green docs workflow passed 30/30 at the prior head `d1fc54c7dbd6b25e3604fc57b80ffbdcbb768e4f`; the new docs commit needs a new exact-head run.

Immediate order:
1. Let the current MOB #69 docs workflow settle; refresh the exact head/run ledger and verify the new docs head.
2. Do not retry Reboot-OS workflows while they fail before runner assignment. Latest evidence is in Reboot-OS issue #51.
3. Continue source review without generating production IDs or approving content. The 560-row queue has zero approved rows and 24 ambiguous PDF locators.
4. Keep migrations 0016–0018 unapplied. Live state is 5 active / 1 pending gifts; migration 0017 would demote all six without a reviewed backfill.
5. Keep PRs draft and production untouched until owner decisions and the release acceptance evidence are complete.

Latest current heads, exact run URLs, static-only findings, and remaining P0 gaps are recorded in the cycle 5 section of the master index. No merge, deploy, migration, vault import, gift activation, billing/profile-sync enablement, or production mutation occurred.


## Recursive build cycle 6 — 14 October 2026 UTC

**P0 OPEN; do not reset or merge.** The prior documentation head `498bc5791d03197bedc9120e96067c1b3a5a8ea6` passed [workflow #38652917919](https://github.com/rebootos-sourcce/MOB/actions/runs/38652917919), 30/30 jobs. MOB owner-contract head `280c16cfd927f640c7ea7bba84e0ca8034dadc61` passed [#38652146233](https://github.com/rebootos-sourcce/MOB/actions/runs/38652146233), 30/30. This cycle 6 documentation commit requires a fresh exact-head run.

Latest hardening:
- PR #35 branch head `fc276839ce56b85dd76472ac8d57111ed688a236`: migration 0017 preflight raises SQLSTATE 55000 before status normalization if any non-pending legacy gift lacks a frozen 100-item snapshot. The live state is five active, one pending; migration remains unapplied pending reviewed backfill/demotion.
- PR #35/#53/#47 branches share gate blob `42e7858efe173d5c9f27d56614199bc19239f641`, permission-test blob `b4bd5cd0b4454d86d280a45b0b7b4c4fa35075b3`, and publisher-guard blob `366603d0aa8daa5a9c59aaf03ad352b8e329c228`. The gate watches all workflow-file changes, keeps the only write scope in the guarded rollback-tag job, preserves P1 dry-runs/artifacts, and scans all workflows for Pages publishing.
- Exact-head Reboot-OS runs still fail before steps: #35 [#38654883997](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38654883997), #53 [#38654900105](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38654900105), #47 [#38654917099](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38654917099). No test execution or acceptance is claimed.
- PR #48 validator head `a67529d9541a2b2ccd2a051a35fc54548da1102f`, PR #52 geometry head `780d7d72b0dacbd0a5ed2775cf19162b76181177`, and PR #46 reduced-motion head `975faa2e016c4c65be6161050ad0531409c43710` remain unexecuted due the same runner issue.
- Source queue remains 560 rows, zero approved rows/production IDs, 24 ambiguous PDF locators, 210 transcript boundary reviews, and 154 missing indexNodeIds. No content was promoted.

Next order: verify this new docs head; keep Reboot-OS PRs draft while an authorized admin diagnoses runner assignment; continue source-locator review without inventing IDs; obtain owner approval for the nature-to-track adapter; prove current-release persisted browser → Worker → storage continuity; rehearse migration/backfill in a disposable environment; verify Cloudflare publisher/account/domain/API ownership. No production changes occurred.


## Recursive execution cycle 7 — 14 October 2026

### Block A documentation gate
- The previous documentation refresh workflow, [MOB run 38655142330](https://github.com/rebootos-sourcce/MOB/actions/runs/38655142330), has completed successfully: 30/30 jobs passed. This validates that documentation commit's repository gates only; it does not accept the separate Reboot-OS code branches.
- This cycle records the latest exact heads and explicitly separates source/static evidence from unexecuted runtime acceptance.

### Current exact heads and gate state
- P1 frozen gift contract PR #35: `bfb1ea1e72a7ccbc01e9ae9bc4462109f1e89e8b`.
- Least-privilege gate PR #53: `5ccb35d259cd23ae77bbb618654ca86459cacdc0`.
- Single Pages publisher guard PR #47: `50aa9cbafaa5734f571a89d12e2c93e0da99da51`.
- Gift-bank validator PR #48: `eb1e9025c5b7ffff49043e0ec56297dcea980d10`.
- Public canon allowlist PR #49: `ab6de04bd7412d25a81b1606488cc6d52e611258`.
- Geometry audit PR #52: `780d7d72b0dacbd0a5ed2775cf19162b76181177`.
- Exact-head Actions runs for #35, #53, #47, #49, and #48 each produced a failed `smoke` job with an empty step list; the privileged rollback-pointer job was skipped where applicable. No test command ran, so these are runner/Actions startup failures—not code-test failures and not passes. Continue tracking repository-level diagnosis in [issue #51](https://github.com/rebootos-sourcce/Reboot-OS/issues/51).

### Latest static acceptance boundaries
- Gate workflow/publisher/permissions contracts are converged across the P1, gate, and publisher branches; static cross-branch checks pass 8/8 per branch. The permission regression script now also rejects unsafe permission syntax and asserts gate self-protection (all-workflow path filters, publisher guard, Worker dry-runs, source/PDF locator artifacts, and generated log counts).
- Public canon inventory has 119 allowlisted tables with zero SHA, row-count, shape, or description mismatches against the source manifest; all eight quarantined entries remain excluded. Endpoint/runtime tests are not accepted until executed.
- Gift-bank validator rejects noncanonical classification values and noncanonical/duplicate provenance field requirements. Structural source checks do not establish owner approval or real-bank readiness.
- Migration 0017 preflights existing active/non-pending gifts and raises SQLSTATE 55000 when the frozen 100-item snapshot is absent. A disposable PostgreSQL regression covers rollback and explicit pending demotion; production remains untouched.
- Source review queue remains 560 rows: zero owner-approved rows, zero stable production IDs; 24 ambiguous PDF locators, 154 missing `indexNodeId` values, 210 transcript boundary reviews, and 107 repeated-hash groups (266 rows). Repeated hashes are review leads, not deletion authority.
- Geometry source audit preserves 112 stable node IDs, 113 source position keys, four documented legacy orphans, and unresolved semantic/runtime cases. No coordinates or topology changed.

### Unclosed acceptance gates / safety
1. Restore or diagnose GitHub Actions runner execution and obtain passing exact-head runs before accepting or merging the affected PRs.
2. Resolve ID 43 and the browser-observed packaged geometry behavior for ID 108; no inferred coordinate repair.
3. Complete source provenance, stable IDs, manifest membership, and explicit owner approval before gift-bank promotion.
4. Obtain authorized confirmation of the canonical Cloudflare account, domain, service, and API origin before publisher changes or deployment.
5. Prove full current-release browser → Worker → storage write/read/reload E2E. MOB client tests alone do not establish Worker connectivity.
6. Confirm the six gift natures-to-four client tracks adapter with the owner; keep server action/verb channels distinct.
7. Production Supabase remains at migration 0015; migrations 0016–0018 are unapplied. No production writes, migrations, deployments, vault imports, gift activation, or profile-sync/billing enablement occurred.

**Status:** documentation gate passed; source/static evidence improved; P0 closure remains blocked on actual exact-head runtime CI, owner approvals, authorized infrastructure confirmation, and end-to-end proof. All listed Reboot-OS PRs remain draft/open/unmerged.


## Executive continuation handshake — 14 October 2026, latest refresh

**State:** P0 OPEN. This continuation section is the operating plan for the next thread. Read `ATUNED_MASTER_INDEX.md` FIRST, then this handshake, then `ATUNED_P0_EXECUTION_CONTROL_BOARD.md`. The index is the current navigation/ledger authority; reconcile all live heads and workflow runs before acting because older cycle entries below are historical.

### Verified starting point

- Reboot-OS issue [#51 — smoke jobs failing before runner startup](https://github.com/rebootos-sourcce/Reboot-OS/issues/51) remains open. Latest inspected run [#38646483356](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38646483356) for the least-privilege branch has a failed `smoke` job with no recorded steps/log URL; rollback-tag job skipped. The validator run [#38514915008](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38514915008) and audit run [#38604682980](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38604682980) show the same startup signature. Do not call these test failures or passes; do not retry until new runner/admin evidence exists.
- Reboot-OS issue [#37 — Cloudflare Workers Builds](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) remains open. Prior evidence conflicts between `npx wrangler preview` (fails due missing `previews` config) and a later settings snapshot showing `npx wrangler deploy`. Authenticated operator readback of live settings and first-error logs is mandatory; no speculative config edits.
- PR #53 has a source-level least-privilege correction: workflow default `contents: read`, test job read-only, and isolated success-dependent `move-last-green` job with guarded compare-and-swap tag update. Main still has workflow-wide `contents: write`; the mitigation is not active until normal review/merge. Keep the PR draft until its exact-head gate executes and passes.
- PR #48 gift validator, PR #49 public canon, PR #45 recursive audit, and PR #52 geometry crosswalk remain draft. Latest inspected runs do not establish exact-head test acceptance. PR #46 reduced-motion and PR #47 publisher-guard have historical exact-head green runs, but still require human accessibility and authenticated publisher/domain acceptance respectively.
- The canonical source-review queue remains 560 rows: 376 transcript and 184 PDF rows; 24 ambiguous PDF locators; 154 missing `indexNodeId`; 210 transcript boundary-review records; 107 repeated-hash groups covering 266 rows. Zero owner-approved rows and zero stable production IDs. Duplicate hashes are review leads, not deletion permission.
- Supabase ATUNED ref `tuvpjbduarteszwkdmuu` was last read through migration 0015; migrations 0016–0018 were absent. Live gift state last recorded as five active and one pending. Migration 0017 preflight must not be bypassed; reviewed backfill/demotion decision is required before any authorized live migration.
- Geometry static source audit: 112 canonical IDs, 113 position keys, 105/112 accepted by current geometry rule, seven unresolved/refused IDs (43, 107–112), and four legacy orphan keys. ID 108's measured position is source-present but exceeds the current reach rule; packaged-browser evidence is missing. Do not invent coordinates or semantic aliases.
- Public canon static audit: 119 allowlisted tables and eight excluded/quarantined entries. Static fingerprints are not endpoint/runtime acceptance and do not imply source-owner approval.
- No merge, production deploy, live migration, protected-vault import, gift activation/issuance, billing/profile-sync activation, or production-data mutation was performed.

### Next-run strategy and blocks

**Execution rule:** work independently and recursively where safe; do not wait for the user to repeat “continue.” For every block, record exact source/head, changed files, command/test actually run, output, cross-review, remaining gaps, and next dependency. Close a block only with acceptance evidence on the exact current head.

**Block A — Index-first state reconciliation**
1. Read this Master Index first; then this handshake and the P0 board.
2. Refresh exact heads/status of Reboot-OS PRs #34, #35, #45–#49, #52, #53 and MOB PRs #66, #69, #73, #74. #74/lookdev is excluded from engineering execution.
3. Fetch current checks for each head; classify each as exact-head pass, exact-head executed failure, startup failure/no-step, stale evidence, or not run.
4. Refresh the index and control board only when the facts change. Do not trigger docs workflows without an acceptance reason.

**Block B — Actions startup root cause**
1. Keep issue #51 the single source of truth; issue #50 is closed as duplicate.
2. Require authorized admin to inspect Actions enablement, allowed-actions policy, hosted-runner entitlement/billing/spending cap, runner groups/concurrency and GitHub service health.
3. Once a runner is actually assigned, run one exact-head gate for PR #45 and PR #48 first, then other affected current heads.
4. Preserve step logs, test totals and artifacts; repair real failures, rerun only affected tests, and repeat on the new exact head.
5. Do not treat queue pressure as established cause; queue was reported drained in the latest index refresh.

**Block C — Security and workflow gates**
1. Review PR #53 permission boundaries and publisher guard across current branches. Main's broad write token remains a concrete gap until the reviewed change is accepted.
2. Ensure all workflow configuration changes trigger the gate, repository-controlled smoke steps are read-only, and only the guarded rollback-tag job writes.
3. Keep PR #47's single-publisher mitigation draft until exact-head gate evidence and authorized Cloudflare publisher ownership are both established.
4. Do not merge, bypass checks, or move the rollback tag manually.

**Block D — Gift source recovery and approval**
1. Resolve the 24 ambiguous PDF locators, then the 154 missing indexNodeId records, then 210 transcript boundary reviews, in that order.
2. Cross-reference every candidate to exact source location/text; repeated hashes may identify duplicates but cannot authorize deletion or consolidation.
3. Do not invent stable IDs, synthesize text, or select the first 100 rows.
4. Obtain owner-approved provenance/schema/classification and six separate 100-item immutable banks. Record approval references and hashes.
5. Independently cross-review the validator's duplicate/canonicality/provenance fail-closed rules. No real bank exists until evidence and owner approval are complete.

**Block E — Gift snapshot / migration safety**
1. Reconcile PR #35 and migrations 0016–0018 against current main and MOB contract.
2. Test snapshot immutability, exactly 100 unique approved entries, wrong-nature/missing-bank failures, replay, mutation, ordering, reload and account attachment in non-production fixtures.
3. Preserve the 0017 preflight that stops active legacy gifts without a frozen snapshot. Do not silently demote the five active gifts.
4. Confirm intended Supabase target and migration 0015 state; rehearse forward/rollback on disposable non-production Postgres.
5. No production migration or data mutation without explicit authorization.

**Block F — Browser/server mapping and persistence**
1. Keep six gift natures, four client meter tracks, and six server action/verb channels distinct.
2. Obtain owner-approved semantic mapping; do not infer by matching names or counts.
3. Prove current-release browser → intended Worker → Supabase write → read → reload, including attach, idempotent retry, duplicate prevention, correct usage counts and no resurrection after deletion.
4. Client tests alone are not Worker connectivity evidence. Use an approved non-production target until production testing is explicitly authorized.

**Block G — Public canon and geometry**
1. Execute PR #49 endpoint tests for unknown/quarantined tables, row-count/fingerprint drift, content mutation and deterministic ordering on exact head.
2. Keep protected `canon_vault.sqlite` private and unimported; preserve negative tests for excluded entries.
3. Execute geometry source-consistency and packaged-browser runtime tests on exact head. Resolve ID 43 semantic collision and IDs 107–112 with authoritative source evidence; do not invent coordinates, aliases or exclusions.
4. Cross-review source fingerprints, allowlist, parser safety and browser output.

**Block H — Cloudflare and publisher ownership**
1. Authorized operator captures first failing log and reads back repository binding, production branch, root directory, build/deploy/preview commands, account, Worker/service, domain, secrets/permissions and rollback target.
2. Resolve conflicting `preview` vs `deploy` evidence and confirm whether `atuned-os` is a preview/static service or production target. `atuned-api` is the Worker named in checked-in `atuned/server/wrangler.toml`; do not assume the services are interchangeable.
3. Verify which repository owns Pages project `atuned` and prevent two different root bundles from publishing to the same project/branch.
4. No configuration save, secret edit, deploy or check bypass until the owner confirms intended topology.

**Block I — Human acceptance and release closure**
1. Complete keyboard, screen-reader, mobile and remaining-motion review.
2. Complete privacy/consent/log/artifact review, deletion/no-resurrection lifecycle proof, and independent cross-repository contract review.
3. Reconcile every acceptance criterion against exact current SHAs and actual executed evidence; list owner/admin blockers explicitly.
4. Keep all affected PRs draft while acceptance is incomplete. Declare P0 closed only after all required gates pass and explicit release authorization is recorded.

### Stop conditions and handoff format

Stop only for an actual external dependency: authenticated GitHub admin access, authenticated Cloudflare access, owner decisions/approvals, or explicit release authorization. Continue safe source-level analysis and non-production test design while waiting. Never manufacture green status.

At the end of each run report:
- Blocks completed and exact evidence;
- patches/commits and affected branches;
- tests actually executed vs not executed;
- defects found and fixed;
- open owner/admin blockers;
- next block to execute.

**Current release decision: BLOCKED / P0 OPEN.** This is an engineering continuation, not a release approval.
