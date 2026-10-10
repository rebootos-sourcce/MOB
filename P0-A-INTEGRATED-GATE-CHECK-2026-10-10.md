# Alpha Gate Integration Check — 2026-10-10

## Current dependency order

1. P0-B quiz-arrival fix is [MOB #56](https://github.com/rebootos-sourcce/MOB/pull/56), head `4770c474364a6df2c034cc8e23dd6ac346c475da`. Its latest run has all acceptance/test gates passing; the deployment job is skipped because the PR is not being deployed.
2. P0-C atomic-save fix is [MOB #57](https://github.com/rebootos-sourcce/MOB/pull/57), head `a6a2fea416de80054ef9df9aff78a181b5b330d9`. Its latest run has all 30 check-runs completed, with fast, required and functional checks passing; deployment is skipped.
3. P0-A gate changes are [MOB #59](https://github.com/rebootos-sourcce/MOB/pull/59), head `f6967bf405e58757a7d1ac5aa3637d17e3a006a3`, with base retargeted to the P0-B branch above. Run a new combined matrix against that base before judging integration.

## Required integrated result

The Alpha-only golden slice measures 56 assertions. The floor is pinned at 56 and `expected_red_max` is 0. It must reach **56 passed, 0 failed, 0 expected-red** on the P0-B code base. CI must also pass the workflow-lint mutation self-test for every newly required gate. A clean run against P0-B does not by itself authorize merging to main: once P0-B is merged, retarget P0-A to main and rerun the entire matrix.

The report-only full golden walk still includes explicitly deferred readback-after-cleared-storage and downloaded-file account creation paths; failures there are tracked separately and must not be silently treated as Alpha gate results.

## Safety constraints

- No profile sync; no story, name or birth details in anonymous funnel traffic.
- No billing enablement, production deploy or merge from this document.
- No starter pattern manifest is activated until the exact 100 stable IDs are traceable and owner-approved.
- Mark a P0 complete only from the current head SHA and latest required check results, not a preceding commit or a skipped deployment job.
