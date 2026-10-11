# Dev 8 Development Log

**Working date:** 10 October 2026, Pacific time  
**Last GitHub state check:** 11 October 2026 UTC  
**Status:** Active. This log records work and evidence, not a merge or release authorization.

## Why this log exists

This file is the shared continuation record for Dev 8. It carries the execution handshake into GitHub so a new session can restart from verified facts rather than reconstructing the discussion. Update it when a development block ends, when a dependency changes, and before handing off.

The project rules remain in force: main is the integration line; do not weaken gates; generated builds are not edited by hand; a successful check on an earlier commit is not evidence for a later one; deployment skipped is not a deployment; profile sync and billing remain off; and user story/profile content stays local unless a separate privacy design is approved.

## Current verified state

### Browser and engine repository: MOB

Main baseline: `1c9811978834b1017ad9ca24199949aaddb0c5ee`.

| PR | Current state | Evidence / dependency |
|---|---|---|
| [#56 Quiz arrival](https://github.com/rebootos-sourcce/MOB/pull/56) | Open, mergeable, not merged | Head `4770c474364a6df2c034cc8e23dd6ac346c475da`. Workflow run [38079826276](https://github.com/rebootos-sourcce/MOB/actions/runs/38079826276): required gates, browser functional, and gates-pass succeeded; deploy was skipped. |
| [#57 Atomic release save](https://github.com/rebootos-sourcce/MOB/pull/57) | Open, draft, mergeable, not merged | Head `f522bbb3a7aa92536ac090c177c1cbc1ceed5ad6`. Workflow run [38094255847](https://github.com/rebootos-sourcce/MOB/actions/runs/38094255847): required gates, browser functional, and gates-pass succeeded; deploy was skipped. |
| [#59 Alpha acceptance gate](https://github.com/rebootos-sourcce/MOB/pull/59) | Open, not mergeable | Head `199bf88fbfb76085429dc6d22883971835c31418`. Base is #56's branch, so it must be reconciled after the focused changes are integrated. No current workflow run was returned for this exact head. |
| [#60 Safe profile import](https://github.com/rebootos-sourcce/MOB/pull/60) | Open, draft, mergeable, not merged | Head `fd148e4065a85c99e3bbf28170d3810a6c303d4b`. Workflow run [38093746343](https://github.com/rebootos-sourcce/MOB/actions/runs/38093746343): gates-fast, browser functional, gates-pass and the listed regression jobs succeeded; deploy was skipped. |
| [#61 Integrated Alpha validation](https://github.com/rebootos-sourcce/MOB/pull/61) | Closed, unmerged, draft; validation only | Current head `53fa3549202e731031c0d2be100cf1566d8d082d`. Workflow run [38094610607](https://github.com/rebootos-sourcce/MOB/actions/runs/38094610607) shows the Alpha journey, browser functional, gates-fast, and gates-pass succeeded. It is not a merge and does not replace a fresh run on the final mainline candidate. |

**P0 result:** #56 and #57 have current successful required test evidence on their own heads. That is progress, not Alpha sign-off. The final integrated candidate must include the accepted quiz path and atomic persistence together, and the blocking acceptance matrix must run on that exact candidate. The historical 56-assertion Alpha pass is useful evidence, but not a substitute for the final integration run.

### Server and product contracts: Reboot-OS

Main baseline: `40ba888508de76c2dcfa0d7851fbdd29b38d0b3e`.

| PR | Current state | Evidence / dependency |
|---|---|---|
| [#34 Deletion retention](https://github.com/rebootos-sourcce/Reboot-OS/pull/34) | Open, draft, mergeable, not merged | Head `75f5c1409e8fb8ebbc639feea438e36a4e3774f3`. Repository gate run [38095758810](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38095758810) reports smoke success. A separate Cloudflare Workers Build failure was recorded earlier and tracked in [issue #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37); recheck that provider status rather than treating repository smoke as proof of a successful Worker build. |
| [#35 Fixed 100-pattern grant](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) | Open, draft, mergeable, not merged | Head `69d6d09d57b63ed8fa92db5b9fa85b5c392cfdd8`. Repository gate run [38095119368](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38095119368) reports smoke success. It is stacked on the retention branch and requires a fresh check against the latest dependency before completion. No production 100-pattern set is approved or activated. |
| [#36 Profile schema crosswalk](https://github.com/rebootos-sourcce/Reboot-OS/pull/36) | Open, draft, mergeable, not merged | Head `919f92083efe027e991af238ae3a2585f72934e4`. This is design inventory only. No sync or user-data transport change is authorized. No PR workflow run was returned for this exact head. |

The source inventory currently has 150 candidate index rows, 143 with one or more explicit source runs in the inspected corpora, 43 without a source kind and verb, and zero owner-approved candidate IDs. A count of 100 is not proof of valid membership. Do not choose the first 100 rows or activate a production grant before the source mapping is reviewed and exactly 100 stable IDs are approved.

## Development block 1: P0 user journey and durable release

**Goal:** Make the accepted first-visit path and release/history persistence truthful, testable, and blocking.

### Work completed in this pass

- Reviewed the patches for quiz-arrival/session creation, atomic release persistence, and the Alpha acceptance gate.
- Confirmed the session work targets the route where an imported quiz record bypasses onboarding; the request must contain only the approved anonymous journey identifier and checkpoints, not story, name, or profile content.
- Confirmed the release path stages its history row with the profile change and relies on storage readback to decide whether save succeeded.
- Rechecked current GitHub jobs for #56, #57, #60, and #61.
- Added Dev 8 cross-review comments to [#56](https://github.com/rebootos-sourcce/MOB/pull/56), [#57](https://github.com/rebootos-sourcce/MOB/pull/57), and [#59](https://github.com/rebootos-sourcce/MOB/pull/59). These request precise acceptance evidence and do not approve the PRs.

### Findings still to close

1. On the final integrated candidate, prove quiz-link import creates exactly one session, repeated entry reuses it, concurrent starts coalesce, and a failed session request remains a visible failure.
2. On the final integrated candidate, prove that throwing writes, silent writes, corrupt writes, and partial-write-then-throw adapters cannot claim a release was saved unless the payload reads back exactly.
3. Exercise the no-prior-storage-key rollback path with both a corrupt silent write and a partial write that throws. If rollback itself fails, keep the state marked failed or unknown; never imply recovery was confirmed.
4. Reconcile #59 against the final integrated mainline after #56 and #57 have been resolved. Run the blocking Alpha gate and every required suite on the exact candidate.
5. Keep the closed #61 PR as historical validation evidence only. Do not merge it as a shortcut, and do not confuse a skipped deploy job with a deployment.

**Exit condition:** required checks green on the exact integration candidate, no expected-red Alpha assertions, rollback and retry outcomes verified, and independent review findings resolved. No merge or deploy is approved by this log.

## Development block 2: lifecycle, canonical content, and profile boundaries

**Goal:** Close the server/data contracts without accidentally enabling new privacy or product behavior.

### Work completed in this pass

- Rechecked deletion-retention and frozen-starter-set PR heads and available repository gate evidence.
- Rechecked the profile schema crosswalk and the browser-side duplicate-import PR.
- Recorded the dependence of the starter-set branch on the retention branch.
- Preserved the existing scope: profile sync off, billing off, crisis detection and aggregate Mirror/Sniffer work deferred, native mobile outside the browser MVP.

### Findings still to close

1. **Retention:** verify the current retry-fairness tests, preserve the original 24-calendar-month UTC deadline on retries, and recheck the independent Cloudflare Workers Build issue. Deletion is not fully verified while a cross-store cleanup path is unknown.
2. **Starter grant:** verify migration and Worker tests on the latest base. Validate exact membership readback, 100 unique IDs in stable order, catalog/set versions, content hashes, frozen immutability, and a mutation test that proves the gate rejects a broken grant. No production set exists until exactly 100 stable IDs are approved.
3. **Profile schema:** finish the crosswalk from browser profile v2 to server user schema v1 without enabling sync. Keep canonical definitions, user-owned imprints, selected release lines, and append-only release events as distinct objects. Make import/export scope explicit.
4. **Safe import:** #60 has successful current checks, but review the import boundary for conflict handling, legacy input, active-profile restoration, and failed-save rollback before closing it.
5. **Stack integrity:** refresh tests for each stacked PR against the latest base. In particular, verify that #35's base actually contains the latest retention fix before calling its acceptance evidence current.

**Exit condition:** current-SHA server and smoke evidence, provider build status understood, source IDs and content hashes reconciled, and privacy boundaries unchanged.

## Cross-pollination protocol: keep it, make it intentional

Cross-pollination remains a required part of development because interface reviews can expose defects and improvements that a single discipline misses. It should be structured so it improves the product rather than expanding every PR.

For every meaningful block:

1. **Owner completes a first pass.** The primary discipline confirms the intended behavior and adds a reproducible regression test for any defect.
2. **A different discipline makes an independent pass.** Reviewers examine interfaces, privacy boundaries, recovery, idempotency, accessibility, data meaning, and opportunities to reuse a stronger pattern already built elsewhere. The second pass should try to disprove the first pass, not repeat its summary.
3. **Classify discoveries.** A blocker goes into the current PR. A necessary reliability improvement becomes a linked follow-up if it cannot be safely contained. A new product idea goes into the backlog with its expected value and cost. Do not mix unrelated innovation into a release blocker.
4. **Test the cross-insight.** A promising idea is not adopted merely because it sounds better. Identify what changes, what measurable behavior improves, and which regression would fail if the idea were wrong.
5. **Record the result.** Each PR records the primary reviewer, the independent reviewer, the finding, its disposition, and the evidence. If the available tools do not identify a separate human or agent reviewer, label this as a review seat/pass, not as a confirmed independent agent.

Use at least one primary reviewer and one independent cross-review for every P0 change and every change that alters persistence, identity, privacy, catalog membership, deletion, or user-visible calculations. Smaller isolated changes can use a lighter pass.

## Ownership and operating boundaries

- **PM / release lead:** dependency map, current SHA, acceptance ledger, and scope control.
- **Engine / domain:** canonical semantics and persistence contract.
- **Browser UI / journey:** arrival flow, local state, and truthful user-facing save/failure behavior.
- **Worker / server:** request boundary, identity, storage, retention, and authorization.
- **Security / privacy:** request-body inspection, consent boundary, deletion proof, and exposure risk.
- **Data steward:** source provenance, stable IDs, catalog and set hashes.
- **QA / release:** clean reproduction, current-run evidence, deliberate regression, and final acceptance.
- **UX / creative / content:** interaction clarity, accessibility, visual review, and truthful copy.
- **Infrastructure:** provider build, migration state, published revision, and rollback identity.

These are accountable review seats. This log does not claim that a particular number of autonomous agents were running; that must be established by actual tool or workflow evidence.

## Exact next actions

1. Finish the two-pass review and current-SHA evidence for #56 and #57.
2. Do not merge either solely because its isolated gate passed. Validate the combined code first.
3. Reconcile #59 on the final candidate and rerun the blocking Alpha and required suites.
4. Recheck the external Cloudflare build issue and the latest stacked base for #34/#35.
5. Keep #35 production membership inactive until source mapping and owner approval establish exactly 100 stable IDs.
6. Complete the #36 crosswalk and #60 import review without enabling sync.
7. Update this log with the new heads, job URLs, remaining review findings, and explicit next block before handing off.

## Release decision

**Alpha is not yet declared ready.** The P0 focused PRs have successful required test runs and the current #61 validation head has a successful listed gate matrix, but that validation branch is closed and unmerged, and the final mainline candidate has not been established. The separate Worker build issue and owner-approved production starter set remain outside those green results. No production deployment is claimed.


## Active project-manager order and two-pass closeout protocol

**This section supersedes any ambiguous reading of the next actions above. Do not advance blocks until the active block passes both gap-review rounds and the exact candidate's required checks are green.**

### Block 1 execution queue: all P0s

1. **P0-C, release persistence, PR #57.** Finish the independent review of atomic profile/history writes. Cover missing prior key, silent/corrupt write, partial write then throw, adapter remove support, and rollback failure. Patch must-fix findings and add regression tests.
2. **P0-B, first-visit session/funnel, PR #56.** Finish independent review of privacy, exactly-once session creation, concurrent starts, reload reuse, and truthful failure. Patch must-fix findings and add regression tests.
3. **P0 integration candidate.** Integrate the focused #56/#57 changes in a controlled sequence. After each integration change, refresh the candidate SHA and required gates. Do not treat two separate green branches as proof that the combined candidate is green.
4. **P0-A, blocking Alpha acceptance, PR #59.** Reconcile its base after #56/#57 are integrated. Fix conflicts and any gate gaps. Run Alpha journey acceptance plus all required suites against the exact integrated candidate.
5. **Closeout gate.** No P0 closes until the combined candidate has passed gap review pass 1, fixes, gap review pass 2, fixes, and a fresh complete required test run. Keep #61 as historical validation only. No merge/deploy based on stale evidence.

### Required two-pass review for every agent block

- **Primary pass:** owner states contracts changed, adds/updates regression tests, and supplies exact SHA plus test run.
- **Gap pass 1:** independent reviewer tries to disprove the implementation. Check behavior, races, privacy/security, data integrity, rollback, retry, accessibility where relevant, and adjacent interfaces. Classify every finding as must-fix now, linked follow-up, or backlog.
- **Patch:** fix all must-fix items inside the block and add regression coverage. Do not mix unrelated redesign into the blocker.
- **Gap pass 2:** a reviewer other than the patch author checks every fix and searches for new gaps introduced by the fix. Record either findings or an evidence-based no-additional-findings result.
- **Re-test:** run targeted regression and all required gates on the new exact SHA. Any code change invalidates the previous run as final-candidate evidence.
- **Project-manager signoff:** update dependency ledger, SHA, evidence links, unresolved risks, and go/no-go. Only then advance.

Every agent must perform focused cross-pollination when a neighboring contract overlaps. A cross-insight needs a concrete behavior/test and expected value; otherwise record no additional improvement found. Tools must not be represented as separate human agents unless identity evidence supports that claim.

### Active status at this checkpoint

- #56 current head `4770c474364a6df2c034cc8e23dd6ac346c475da`, open and mergeable.
- #57 current head `f522bbb3a7aa92536ac090c177c1cbc1ceed5ad6`, open, draft, and mergeable.
- #59 current head `199bf88fbfb76085429dc6d22883971835c31418`, dirty/unmergeable and based on #56's branch. It must be reconciled against the final integrated candidate.
- #63 development-log check run `38103503296`: all completed jobs reported success at last inspection; browser functional gate was still in progress. Recheck before claiming the log PR is fully green.
- P0 block remains **OPEN**. Separate branch success is not final integration proof.



### Dev 8 live review update: gap pass 1

**#63 log checks:** workflow run [38103503296](https://github.com/rebootos-sourcce/MOB/actions/runs/38103503296) has now completed its listed browser functional gate successfully. At the latest check, `gates-pass` was still queued. Recheck before marking the log PR fully green.

**P0-C #57, must-fix review finding:** the new `bindStore(get,set,remove)` contract leaves `remove` optional, but restoring the absent-key state after a corrupt/silent write requires removal. If a host adapter lacks `remove`, the code returns `RollbackUnavailable` and does not claim success, but the corrupt key may remain durable. Inventory each real adapter, provide and test removal where supported, or reject the unsafe transaction before mutation. Add a no-prior-key test using the actual adapter contract and a rollback-failure test. Review comment: https://github.com/rebootos-sourcce/MOB/pull/57#issuecomment-6104544121

**P0-B #56, acceptance evidence requested:** the patch demonstrates a concurrent-start coalescing test, but pass 1 requested direct proof for reload reuse of the persisted session, non-OK/rejected session creation, retry after a rejected in-flight request, and no story/profile payload. Point to existing current-head tests or add missing cases. Review comment: https://github.com/rebootos-sourcce/MOB/pull/56#issuecomment-6104544317

**Decision:** both findings remain open. Do not mark either P0 complete until patch owners respond, tests cover the contracts, and the two review passes are recorded on current SHAs. P0 remains open; #59 remains blocked until the integrated candidate exists.
