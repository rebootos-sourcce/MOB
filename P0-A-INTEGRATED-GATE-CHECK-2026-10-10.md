# Alpha Gate Integration Check

Status date: 11 October 2026. The integrated P0 candidate has passed its required CI matrix and was merged to `main` outside this recovery execution. The subsequent main-branch workflow also completed the Cloudflare Pages production deployment. This document records the observed state; it does not authorize any additional merge or deployment.

## Final integrated candidate

- Integrated PR: [#59](https://github.com/rebootos-sourcce/MOB/pull/59), now closed and merged.
- Final PR head tested: `74279113003ca02c3675be04cf8d7bff651008b9`.
- Exact-head required workflow: [run 38157593102](https://github.com/rebootos-sourcce/MOB/actions/runs/38157593102), completed successfully with **30/30 jobs successful**, including `gates-pass`.
- Main merge commit: `ed5eca344836e852f117a5b573059e5e1cf1e3ab`.
- Main workflow: [run 38169307942](https://github.com/rebootos-sourcce/MOB/actions/runs/38169307942), completed successfully with **31/31 jobs successful**, including `gates-pass` and the Cloudflare Pages deployment verification. The deployment job confirmed production was serving the merge commit.
- The separate Pages build/deployment workflow [run 38169307447](https://github.com/rebootos-sourcce/MOB/actions/runs/38169307447) also completed successfully.

## Measured gates and floors

The Alpha floor was raised from 56 to 61 in the same patch that updated this gate document. The expected-red ceiling remains zero, and no existing floor was lowered.

| Gate | Exact final PR-head result | Floor |
|---|---:|---:|
| Alpha journey | 61 passed, 0 failed, 0 expected-red | 61 |
| Copy | 151 passed, 0 failed | 151 |
| Functional browser | 2,622 passed, 0 failed | 2,317 |
| Collision | 388 passed, 0 failed | 388 |
| Funnel | 562 passed, 0 failed | 562 |
| Storage | 120 passed, 0 failed, 0 expected-red | 120 |
| First release | 121 passed, 0 failed | 121 |
| Release screen | 153 passed, 0 failed | 145 |
| Onboarding verification | 211 passed, 0 failed | 211 |
| Design | 192 passed, 0 failed | 192 |

The earlier post-floor run on `59a91176df50cfe9db81924c4463762a81886fbb` had a report-only copy result of 147/149. That result is superseded by the copy-gate regression patch in commit `724d912756092f5a6542dc054515f643d7d1e5cc` and the measured floor increase in `74279113003ca02c3675be04cf8d7bff651008b9`. The final PR-head run passed the copy gate at 151/151. No floor was reduced.

The copy regression now requires a real persisted profile, an actual native delete confirmation, a cancelled deletion that preserves the profile and current selection, and an accepted deletion that removes the profile. Missing confirmation dialogs or controls fail the test rather than being silently counted as coverage.

## Review record

The Dev 8 execution log and PR #59 discussion record source-level gap-review passes for the integrated release persistence, anonymous session creation/reuse, privacy boundaries, rollback behavior, and Alpha gate. During this recovery check, the final copy-gate patch was reviewed in two passes: first for behavior and regression completeness, then for fail-closed test-harness behavior and floor integrity. No additional must-fix issue was found in that patch.

GitHub has **zero formal review submissions** recorded for PRs #56, #57, and #59. The source-level review notes do not constitute formal GitHub approvals. PRs #56 and #57 were closed unmerged as duplicates; PR #59 was merged.

## Current disposition and safeguards

- Required CI validation passed on the exact final PR head `74279113003ca02c3675be04cf8d7bff651008b9`.
- The main merge commit also passed its full required matrix, and the main workflow confirmed the production deployment.
- The merge and deployment occurred outside this recovery execution, despite the instruction not to merge or deploy. No merge, deployment, rollback, or additional production change was initiated by this recovery check.
- Formal independent GitHub approvals remain absent and should be recorded as a process gap, not represented as completed approvals.
- Profile sync and billing remain off. Anonymous session requests must not contain story, name, birth data, or profile payloads.
- No further merge or deployment is authorized by this document. Any rollback or additional release action requires explicit owner direction.

## Next steps

1. Preserve the passing test floors and exact-head evidence.
2. Record the missing formal review approvals as a post-merge governance gap; do not imply they exist.
3. If the owner requires further assurance, conduct a post-merge independent review against main at `ed5eca344836e852f117a5b573059e5e1cf1e3ab` before any further release work.
