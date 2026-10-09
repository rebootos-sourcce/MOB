# Development strategy v2: foundation first, recursive blocks

Ruled by the owner, 8 October: main is the line, foundation before anything else, cosmetics last, run the blocks recursively until complete. Base: `origin/main` at `8f565af`. Open work: `MVP-OPEN-ITEMS-2026-10-08.md` (M1 to M94). Sequence: `GAME-PLAN-main-cleanup.md`. Agent rules: `HANDSHAKE.md`. This is v2: three independent reviews (sequence, handshake, failure modes) are folded in.

## 1. Operating model

- **Lead (me)** owns the plan, the worktrees, every push, every merge, the one full gate run per block, live verification, rollback, and the report to the owner. Nobody else touches `main`.
- **Builders**: one agent per work package (WP), each in its own git worktree on its own branch cut from `origin/main`, with a list of allowed paths, an acceptance command, and the handshake. They commit locally. They never push, merge, or open pull requests.
- **Reviewers**: two per block, independent. They see the diff and the acceptance criteria, never the builder's summary. Adversarial. They write findings; they do not fix.
- **Patch** goes back to the same builder (resumed). Reviewers re-check the patch only.
- **Round limit.** Round 3 runs only if round 2 has fewer blockers than round 1 and every round 2 blocker was already in round 1. If a finding cites the acceptance criteria and not a line of code, it needs a ruling: stop and report, do not patch. After round 3, any open blocker stops the loop and goes to the owner.

## 2. The loop, per block

1. DRAFT: split into WPs with disjoint file ownership; each acceptance is a command that can fail.
2. BUILD in parallel, separate worktrees.
3. REVIEW x2: (a) correctness and risk, (b) evidence and gates.
4. PATCH, re-review the patch.
5. INTEGRATE: lead merges the WP branches into one block branch, dependency order, mechanical conflicts only. **Then run `tools/equiv.py` from base to the integrated build. Its list of changed declarations must equal the union of each WP's own list, with the same body hashes.** That catches the semantic conflicts a textual merge resolves silently.
6. FULL GATE: lead runs every gate once, serialized, on the block branch. Numbers are read off the run.
7. PR: lead pushes, opens one pull request. "Green" means the run on the pull request's head commit is green. Merge with `expectedHeadSha` set to that commit.
8. MERGE under the merge rule below. Merging publishes atuned.world when the deploy runs.
9. VERIFY live where the change is live: the live stamp must equal the merged commit within 10 minutes. If the deploy run is red or the stamp is wrong in that time, roll back first, diagnose after.
10. RECORD: numbers into `STABILITY.md`, defaults taken into `DECISIONS.md`, open list updated.
11. NEXT.

**Merge rule.** Merge only when every gate is green on the merged commit. Sole exception: design gate 13's frame rate check and the fade timing check, each passing when re-run alone under `flock`, both lines pasted in the pull request. Never a whole gate. Never a check the diff touches. A drifted test counts as red.

## 3. Priority: harm to a person first, then what unblocks what

| Order | Block | Contents (open list ids) |
|---|---|---|
| P0a | **1 v1: the ruler, minimal** | Gates run as jobs inside `deploy.yml`; the deploy job `needs` them and runs only on `push` to main; `concurrency: pages-prod`; a `pull_request` trigger with no path filter; a single job named `gates-pass` that branch protection can require later. Deterministic gates required: builds, engine, funnel package, boot, collide, funnel, hostfree via build, voice. Chromium path fixed across the 46 files. Engine crisis cases written (expected red per line). Repair the drifted Discord test. Rollback written and tested (done). M48 (FAQ copied to the live site) rides the same `deploy.yml` edit. |
| P0b | **Beside block 1, no code** | M6 second copy of the record key (owner holds), M64 book the lawyer (weeks of lead time), M4 start the practice server (staging), M49 Pages off and a sweep of git history for keys. |
| P1 | **2a. Harm closers** | M59 crisis check, in the engine and in the quiz, behind the engine cases; M62 honest privacy words with M63's default recorded first; M3 reset screen (needs the Worker's confirm route checked in Reboot-OS, and M17's sender); M9 ask the browser to keep a guest's storage. Then a stamped, packed build sent to the owner. |
| P1b | **1 v1.5: finish the ruler** | Switch table, equiv base against head in CI, packed stamp check, design gate 7 for the signed in release screen, `tests/sync.js` expected red, merge-base red check, `tests/recordlink.js`, M77. |
| P2 | **2b. Ports** | Funnel seam (97 tests), practitioner migration 0014 (stays unapplied until staging exists), release screen cleanup with M28 (the first release screen contradicts its card; screen gate written expected red first), voice port stays dark until M23 and M68. |
| P3 | **3. Records safe**, with **N1 sign in hardening** beside it | Block 3 waits on M5 (the backup export, server work in Reboot-OS). M29 (the loop closes) once block 4 makes the first visit work. |
| P4 | **4. First visit in a browser** | M20, S8, S22, S4. |
| P5 | **5. Money** | Needs the owner's Stripe steps. Live Stripe ids only after M35 to M37 are green. |
| P6 | **6. Delete everywhere** | After 5. |
| P7 | **7. Honest labels and the walk** | Close out. |
| later | N2 to N5 | Running the service, legal, circle and screens, private launch. |

## 4. Stop conditions (where the loop hands back to the owner)

- Branch protection: after block 1 v1's first green run, the owner turns it on.
- Stripe steps, the lawyer, any secret only the owner holds.
- A ruling with no default in `DECISIONS.md`. (Ten defaults are recorded before 2a.)
- Round 3 still shows a blocker.
- A gate that was green on main is red after a merge and the cause is not found in one pass: revert, report.
- The deploy run is red, or the live stamp is not the merged commit within 10 minutes: roll back first.
- Anything that turns on live: sync, voice, migration 0014 on Supabase before staging exists.
- A failed live check after a merge.
- Live Stripe ids before M35 to M37 are green.
- Anything that would run a destructive operation on live data.

## 5. What a work package carries

Objective in one sentence. Allowed paths. Forbidden paths. Acceptance command. The failing-first test. The report format. `HANDSHAKE.md`.

## 6. Rollback, written and tested

- **Fast (about 2 minutes):** re-run the last good deploy run through the GitHub MCP `rerun_workflow_run`. Tested 8 October: re-ran run 37820507107, success, same commit, nothing visible changed.
- **A deploy workflow dispatch that skips the gates** for an emergency rollback: built in block 1 v1 (`workflow_dispatch` with a `rollback_ref` input; it checks out that commit and deploys it, nothing else).
- **Slow, always available:** a revert pull request through the normal route.
- The lead has no Cloudflare dashboard. Pages "rollback to previous deployment" is not available from here.
- **Never** use `pull_request_target`: it would publish a public preview of onboarding, the 2 October exposure, and only the owner can delete it.
