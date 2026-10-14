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
| CI least privilege + guarded rollback tag | [PR #53](https://github.com/rebootos-sourcce/Reboot-OS/pull/53), `b7cf85c914bb8b5e168fd106f7b8232599374bee`, draft/open | Static source check confirms read-only default; isolated write-only tag job; smoke dependency; main-push restriction; stale-head, ancestry, remote-tag race, and compare-and-swap guards. Added `atuned/test/tools/workflow_permissions.py` and wired it into the gate. Exact-head run [#38645050870](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38645050870) failed before any steps (`steps=[]`); tag job skipped. | Keep draft. Shared runner issue is not caused by draft status. Continue with source-level validation and request admin investigation under issue [#51](https://github.com/rebootos-sourcce/Reboot-OS/issues/51). Do not keep retrying the same no-step failure. |
| Gift-bank fail-closed validator | [PR #48](https://github.com/rebootos-sourcce/Reboot-OS/pull/48), `fe8cc1074adc19056f69ad1c35feee38749307d0), draft/open | Validator and synthetic tests exist. Exact-head run [#38514915008](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38514915008) failed with zero steps. Prior successful run predates the latest regression additions. | Restore runner execution, then run exact-head validator tests. Real source banks, stable IDs, approvals, schema, and mapping remain owner-dependent. No manifest or gift activation. |
| Public canon fail-closed allowlist | [PR #49](https://github.com/rebootos-sourcce/Reboot-OS/pull/49), `b757ae5d35cd9f42286c4de2a8f25d889d9eec54`, draft/open | Static inventory: 119 allowlisted entries match manifest hashes/row counts; 8 entries excluded. Exact-head run [#38514518771](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38514518771) failed before steps. Runtime fingerprint/endpoint evidence is not verified. | Restore runner; execute exact-head runtime checks. Keep protected vault unimported and public canon exposure gate closed. |
| Canonical geometry crosswalk | [PR #52](https://github.com/rebootos-sourcce/Reboot-OS/pull/52), `277252f2372adaf487c8c558fb72ee89dbcc218e`, draft/open | Static source checks establish 112 unique NODEREG IDs, exact PMFPOS/fetter_positions equality (113 position keys), and documented geometry rejects. Runtime browser evidence and authoritative source crosswalk remain absent. Exact-head run [#38604526305](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38604526305) failed before steps. | Restore runner; add/execute fail-closed packaged-browser geometry checks. Do not alter coordinates/topology without source-backed approval. |
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

Reboot-OS exact-head runs #38642952053 and #38645050870 (PR #53), #38514915008 (PR #48), #38514518771 (PR #49), and #38604526305 (PR #52) each recorded a failed smoke job with no steps; #53's tag job was skipped. These outcomes are not test assertions failing. The latest #53 run confirms a `pull_request` workflow is created while the PR is draft, so draft status is not the cause.

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
