# ATÜNED — Next execution queue: smallest work, highest leverage

**Created:** 2026-11-02 (UTC) · **Owner boundary:** MOB `main` publishes `atuned.world`; Reboot-OS owns supporting backend APIs. **Status: PLAN ONLY; zero merges/deployments authorized by this document.**
**Find this from:** [persistent cleanup log](./ATUNED_MAIN_ENGINE_CLEANUP_EXECUTION_LOG_2026-11-02.md) in [draft PR #165](https://github.com/rebootos-sourcce/MOB/pull/165).

## Verify before taking ownership
- MOB `main` observed: `b6f4c1610f814a75c133d38173a52297d7e64dbf`; **refresh** main and all PR heads before editing.
- Source AI draft [#163](https://github.com/rebootos-sourcce/MOB/pull/163): head `aa449a80700f09407b12fd2bb838209ac5cd4570`. [Exact-head run 41496716099](https://github.com/rebootos-sourcce/MOB/actions/runs/41496716099): `gates-fast` SUCCESS; `gates-browser (functional)` still IN PROGRESS at observation. **Do not equate fast green with full green.**
- Avatar draft [#164](https://github.com/rebootos-sourcce/MOB/pull/164): head `fbe2bff47e7529e92856fcf53baef4a4944ff3ab`; leave its active owner branch alone.
- Docs draft [#165](https://github.com/rebootos-sourcce/MOB/pull/165): recording only; never treat docs-only PR as an engine release.
- `.github/workflows/deploy.yml` **already contains** a post-upload step called `Cloudflare serves this commit in production`: it polls Cloudflare's production deployments and checks commit SHA, stage, and successful status. F14 must **reuse** this, not claim it is missing.

## Queue map

```text
  [Q0  refresh heads + CI evidence]
                  |
    +-------------+-------------+
    |                           |
[Q1  F03 / P1]             [Q2  F09 / P2]
Source AI CI closure       Pin TS + Wrangler
smallest remaining fix     isolated tooling branch
    |                           |
    +-------------+-------------+
                  |
          [Q3  F14 / P2]
       Independent read-only
       public health evidence
                  |
    [review / CI / validation]
                  |
    [owner approves merge/deploy]
```

| Order | Project | What to do | Acceptance evidence | Touches | Estimate (subjective) |
|---|---|---|---|---|---|
| Q0 | Evidence refresh | Re-read branch heads, run status, tools and deploy workflow; check if another agent has taken the ticket. | Dated SHA/runs in log. | Read-only | 0.98 confidence |
| Q1 | **F03 / P1: Source CI closure** | Check exact-head full workflow first. If green, close as verified with no extra code. If red, diagnose failing job, repair only reproducible defect; do not suppress the five tests or orphan detector. | All 5 newly wired tests included, `gates-fast` and full `gates-pass` succeed on same head SHA; log test names/run URLs. | #163 owner branch: coordinate first | Impact 5/5 · effort 1–2/5 · conf 0.96 |
| Q2 | **F09 / P2: Reproducible toolchain** | In a **new isolated branch**, inspect existing package/lock strategy and green runtime versions. Pin currently floating `typescript` installs (several jobs) and `wrangler@4` to exact proven versions. Preserve build order, rollback, generated file checks and deploy behavior. | Fresh environment builds match tracked artifacts; all required gates green; tool versions and rollback guard checked; separate review PR. | `.github/workflows/deploy.yml`, appropriate package/lock metadata | Impact 5/5 · effort 2/5 · conf 0.92 |
| Q3 | **F14 / P2: Independent public-site verification** | Preserve **existing Cloudflare SHA readback**. Add a small **read-only** external smoke probe on public site and documented critical routes; classify `PASS`/`FAIL`/`UNKNOWN`. When commit readback is unavailable outside privileged deploy, report `UNKNOWN`, not invented proof. | Networked job reports endpoint/HTTP availability without customer data; deploy readback remains untouched; fixture/offline probe and one real external run linked; separate review PR. | Probe + reporting CI, not deployment secrets logic | Impact 4/5 incremental · effort 2/5 · conf 0.88 |

## Safe sequencing and concurrency
1. **Q0 first.** Cancel duplicate work when the code or review state has superseded the plan.
2. **Q1 fastest win:** close with evidence if CI is already green. Reopen only for actual remaining failure. Do not write to the branch while its owner is changing it.
3. **Q2 and Q3 may be designed in parallel,** but use distinct draft branches/PRs; limit simultaneous deploy-workflow edits to one. Merge order is Q2 before Q3 only if Q3 touches the same workflow file.
4. At each implementation PR: base from refreshed `main`, run targeted tests and full gates, verify no generated drift, record exact head SHA and CI URL, check browser/voice impact where relevant.
5. **No auto-merge to main, Cloudflare deploy, rollback, or GitHub administration changes** from this queue. Owner decides promotion after verified evidence.

## Stop / re-scope conditions
- Source AI full gate green at exact head: **mark F03 verified; do not create a second unnecessary fix**.
- Toolchain pins break legacy generated build or rollback behavior: revert the isolated change and document mismatch before retesting.
- Public health check cannot authenticate live SHA: publish `UNKNOWN`; do not weaken existing Cloudflare proof.
- Another agent owns the target branch, main changes, or run status changes: refresh findings and coordinate, do not force-push.
- **Administrative F01** (main protection) remains a separate owner-approved policy change; **F05** abuse controls and **F07** browser security remain open for later risk-based scheduling.

## Cross-AI evidence contract
Append every discovery, commit, test, blocker and decision to
`docs/ATUNED_MAIN_ENGINE_CLEANUP_EXECUTION_LOG_2026-11-02.md`.
Use `L012+` IDs; include UTC date, repo + branch + SHA, file(s), GitHub PR/workflow link, measured result, and what is not yet verified.
If an implementation succeeds, update the log and this queue file in PR #165 (or superseding handoff) without claiming the docs branch itself is merged.

## Measurements / ratings
**Queue:** 3 projects + 1 evidence gate · **Current implementation this queue:** 0 · **Required tests to retain:** 5/5 · **Actual #163 gates-fast observed:** PASS · **Actual #163 full gate observed:** IN PROGRESS · **Existing deploy SHA readback:** PRESENT · **Production claims:** not independently reverified · **Overall plan confidence:** 0.92 (subjective, updated from prior 0.93).
