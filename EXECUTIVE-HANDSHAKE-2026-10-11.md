# Executive Handshake: MOB Alpha P0 and P1

**Prepared:** 10 October 2026, Pacific Time  
**Evidence current through:** 11 October 2026, 04:44 UTC  
**Audience:** Product owner, project manager, engineering and review team  
**Purpose:** Exact project state and ordered continuation plan for the next thread.

## 1. Executive decision

**P0 implementation and required acceptance validation are green on the integrated candidate. The candidate has not been merged to `main`.**

- Integrated PR: [MOB #59](https://github.com/rebootos-sourcce/MOB/pull/59)
- Tested head: `59a91176df50cfe9db81924c4463762a81886fbb`
- Post-floor run: [38111452439](https://github.com/rebootos-sourcce/MOB/actions/runs/38111452439)
- Required `gates-pass`: successful.
- Alpha on the tested head: **61 passed, 0 failed, 0 expected-red; floor 61**.
- No product PR has been merged and no deployment was performed.

One report-only check, `gates-report (copy)`, scored 147 passing checks against its existing floor of 149. It reported zero explicit assertion failures, but the test did not capture the delete-confirm dialog on desktop or mobile. The floor remains 149. This report-only failure does not participate in `gates-pass`; it stays a test-coverage follow-up and must not be represented as a required P0 gate failure.

**Executive decision required:** merging #59 to `main` may trigger the main-branch production deployment after its gates succeed. Do not merge or deploy until the project owner explicitly approves that combined consequence.

## 2. Goal and P0 scope

P0 protects the Alpha journey from imported quiz answers through first release.

| Block | Purpose | Status |
|---|---|---|
| P0-C, atomic release persistence | Keep profile state, release history and success messaging consistent | Validated on the integrated candidate |
| P0-B, first-visit session | Persist anonymous funnel credentials safely, support failure/retry/reload, protect local profile data | Validated on the integrated candidate |
| P0-A, Alpha acceptance | Make quiz-to-first-release and supporting browser journeys blocking | Required matrix passed; Alpha floor raised and rerun |

Treat PR #59 as the single integrated acceptance candidate. Do not substitute green results from older branches or older SHAs for the current integrated run.

## 3. Exact repository and PR state

Repository: [rebootos-sourcce/MOB](https://github.com/rebootos-sourcce/MOB), base `main`.

| PR | Head | Scope | Current state |
|---|---|---|---|
| [#56](https://github.com/rebootos-sourcce/MOB/pull/56) | `cb3fa5aef537246964758c6bce32aea6cadb27e5` | First-visit session creation, durable credentials, retry and privacy | Open, unmerged |
| [#57](https://github.com/rebootos-sourcce/MOB/pull/57) | `d040f3fdd33675439190bdbe99e9c5ad50765543` | Atomic release/history persistence and rollback | Open, unmerged |
| [#59](https://github.com/rebootos-sourcce/MOB/pull/59) | `59a91176df50cfe9db81924c4463762a81886fbb` | Combined P0 and blocking Alpha gate | Open, mergeable, unmerged |

Use #59 as the integration path. Do not merge #56 or #57 separately ahead of it. After an authorized integration, confirm their changes are in the merged tree before closing duplicate support PRs.

## 4. Acceptance evidence on the exact tested head

The post-floor run [38111452439](https://github.com/rebootos-sourcce/MOB/actions/runs/38111452439) finished with workflow conclusion `success`. All 31 jobs completed. The required `gates-pass` succeeded. The report-only copy leg failed its existing assertion floor, but did not participate in the required aggregator.

| Gate or suite | Result |
|---|---|
| `gates-fast` | Pass |
| Engine | 5,038 passed, 0 failed, 10 previously allowed expected-red; floor 5,002, ceiling 10 |
| Funnel package | 44 passed, 0 failed |
| Alpha journey | 61 passed, 0 failed, 0 expected-red; floor 61 |
| Functional browser suite | 2,622 passed, 0 failed; floor 2,317 |
| Storage, first-release, journey reload, onboarding, release screen | Required browser jobs passed |
| Boot, collide, funnel, design, monitor, voice | Required browser jobs passed |
| Golden and record-link reports | Passed |
| Required `gates-pass` | Passed |
| Report-only copy | 147 passed, 0 explicit assertion failures, below unchanged floor 149 |
| Pull-request deploy job | Skipped, as expected |

### Alpha floor governance

The provisional floor 56 was replaced with 61 after run 38107187227 measured 61 passed, 0 failed, 0 expected-red. The floor and gate document were updated together. Run 38111452439 then repeated the Alpha gate on the new exact head, again at 61/0/0 with floor 61. `expected_red_max.alpha-journey` remains zero. No floor was lowered.

## 5. P0 engineering changes

### P0-C: atomic release persistence

- Release profile and history persistence share one durable commit path.
- Regressions cover corrupt writes, partial-write exceptions, rollback, missing prior keys and rollback failure reporting.
- A failed durable write restores both prior durable bytes and the in-memory profile. This stops a later unrelated save from persisting an uncommitted release without its history.
- A refused save cannot send a first-release checkpoint, complete a ritual or ask the next answer.
- Release-screen regression verifies that the profile returns to its pre-release JSON state when the save fails.

Standalone P0-C run: [38107104818](https://github.com/rebootos-sourcce/MOB/actions/runs/38107104818), successful on head `d040f3fdd33675439190bdbe99e9c5ad50765543`.

### P0-B: first-visit session and privacy

- A session is considered kept only after its credential is durably written and read back exactly.
- Rejected session creation can be retried; persistence failure is returned as a failure and does not proceed to account join.
- Empty session IDs, invalid responses and credentials shorter than the server's 32-character contract are refused.
- Reload ignores stored session values without a valid ID, anonymous ID and credential.
- Corrupt/partial writes attempt verified restoration of the earlier session value.
- Sign-out behavior and fake Worker tests match the actual `funnel.ended` response contract.
- Privacy regression asserts that imported story/profile data stays local and profile sync remains disabled.

### P0-A: required acceptance and fail-closed rules

- Alpha quiz-to-first-release is blocking, with a floor of 61 and zero expected-red allowance.
- Storage, first-release, journey reload, onboarding, release-screen and the other required browser gates are blocking.
- Workflow-lint mutation tests protect the required gate list.
- Older successful runs are historical evidence only; source edits require fresh full validation on the new exact SHA.

## 6. Review outcomes and bounded residual risks

Source-level review pass 1 and pass 2 were completed, with must-fix findings patched and regression-tested before the final matrix. There are no unresolved GitHub review threads on #59. No separate human reviewer approval is recorded; these were two distinct source-review passes in the execution, not claimed as a human sign-off.

Two follow-ups remain:

1. **Cross-tab session idempotency.** Starts coalesce within one page, but separate tabs are not serialized, and a lost create response followed by retry can create an extra anonymous telemetry session. The request payload remains restricted and does not transmit story/profile data. Keep this follow-up bounded; no server migration is part of P0.
2. **Copy-test delete-confirm coverage.** The report-only test did not capture the delete-confirm dialog at 1600px or 390px, leaving 147 versus the existing floor of 149. Do not lower the floor. Fix its interaction/setup and prove the test against known-good and known-bad cases before deciding any floor change. It is not a required P0 gate failure on the current candidate.

## 7. Safety and production boundary

Until an explicit integration decision is made:

- Profile sync remains off.
- Billing remains off.
- No unapproved starter-pattern grants are active.
- No production deploy or remote Supabase migration is authorized by this handoff.
- No floor or assertion is weakened to manufacture a green result.
- No older SHA may substitute for the final candidate evidence.

**Merge/deploy boundary:** candidate acceptance is not production-release approval. Because merge to `main` triggers its gated deployment workflow, obtain explicit approval before merging. If approved, verify the merge SHA, main-branch gate results and deployment result separately.

## 8. P1 queue, after P0 integration

Keep each workstream separate, with two gap-review passes, regression coverage, and fresh exact-SHA gates. Cross-pollination must identify a concrete behavior, test and expected value, or record that no further improvement was found.

1. **MOB #60, identity-safe profile import:** [PR #60](https://github.com/rebootos-sourcce/MOB/pull/60) is open and draft. Same-ID imports should be idempotent; conflicting content must be rejected before mutation. Reconcile to the approved integration base and rerun tests. Keep profile sync off.
2. **Reboot-OS #34, 24-month deletion retention:** [PR #34](https://github.com/rebootos-sourcce/Reboot-OS/pull/34) is open and draft. Repository-owned tests were green earlier, but external Cloudflare Workers Builds checks remain red. Track [issue #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) and inspect the build through authenticated Cloudflare dashboard access. Do not bypass it.
3. **Reboot-OS #35, exact 100-pattern starter grant:** [PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) is open and draft. Source-kind validation is stricter, but 43 source rows remain untyped/unresolved and there is no owner-approved set of exactly 100 stable user-facing IDs. Keep starter grants disabled until a provenance-backed list is explicitly approved.
4. **Reboot-OS #36, browser/server profile contract mapping:** [PR #36](https://github.com/rebootos-sourcce/Reboot-OS/pull/36) is open and draft. Map field authority and add versioned contract tests before any profile sync.

## 9. Next-thread runbook

1. Read this document and the [Dev 8 development log](https://github.com/rebootos-sourcce/MOB/blob/dev8/development-log-20261010/DEV8-DEVELOPMENT-LOG-2026-10-10.md).
2. Verify PR #59 still points to `59a91176df50cfe9db81924c4463762a81886fbb` and run 38111452439 remains successful with `gates-pass` green.
3. Ask for the explicit decision to merge to `main`, knowing that this triggers the gated production deployment path, or to hold production.
4. If approved, merge only the integrated candidate. Verify the actual merge SHA, main-branch gates and deployment. Then confirm #56/#57 changes are included before closing the support PRs.
5. After P0 integration is complete, start P1 #60 on the accepted base. Keep #34 blocked on Cloudflare diagnosis, #35 disabled until the exact 100-ID grant is approved, and #36 as a prerequisite to future profile sync.

## 10. Status at handoff

- **P0 source and required acceptance:** green on exact candidate `59a91176df50cfe9db81924c4463762a81886fbb`.
- **Required gates:** pass.
- **Report-only copy coverage:** follow-up remains; floor preserved.
- **Review passes:** two completed; no separate human reviewer approval recorded.
- **PR #59 merge:** not done.
- **Production deployment:** not done.
- **P1 work:** queued behind the P0 integration decision.
- **Executive decision outstanding:** approve or defer the merge that triggers the production workflow.

**Measurement:** 3 P0 workstreams; integrated required gates green; 1 report-only test-coverage exception; 0 production deployments.  
**Confidence:** High in the exact candidate's validation evidence. Production release remains an explicit decision.
