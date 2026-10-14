# ATÜNED Dev — Start Here / Working Index

**Updated:** 2026-10-14  
**Scope:** ATÜNED look development plus inherited application P0 blockers  
**Rule:** This index is the first read in every continuation. It is a routing document, not a claim that listed tasks are complete.

## Mandatory read order — every round

1. **This file:** current priorities and source map.
2. [ATÜNED Master Index](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_MASTER_INDEX.md) on the separate docs branch (not merged to main): cross-repository source/deployment authority. Exact blob SHA `4080c5f851bf483b1408f818280ab78f45dc2107`.
3. [Architecture Review](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_ARCHITECTURE_REVIEW_2026-10-13.md) and [P0 Execution Control Board](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_P0_EXECUTION_CONTROL_BOARD.md): wider system trace and release gates.
4. [Executive handshake](ATUNED_LOOKDEV_EXECUTIVE_HANDSHAKE_2026-10-14.md): scope, decisions, constraints, carry-over rules.
5. [Repository sitemap and source trace](ATUNED_REPO_SITEMAP_TRACE_2026-10-14.md): canonical entry points, dependencies, prototypes, evidence paths.
6. [Execution ledger](ATUNED_DEV_EXECUTION_LEDGER_2026-10-14.md): status of every task, evidence, SHA, blockers, next action.
7. Re-read the current source at the exact branch/commit recorded in the ledger; do not rely on old summaries.
8. Search the conversation/project library for **ATUNED BRAND DEV 5**, **ATUNED BRAND DEV 4**, and **ATUNED BRAND DEV 3**. Review each three times: (a) decisions/goals, (b) visual/page requirements, (c) gaps/conflicts. If literal source folders are unavailable, record that limitation rather than pretending to have reviewed them.
9. Inspect the master index and relevant source files before describing any asset/token/icon/motion/sound as canonical.
10. Before ending the round, update this index, sitemap/trace if mappings changed, execution ledger, and executive handshake. All incomplete work must remain in the carry-forward list.

## Current workstreams

### A. Brand look-development guide
- Owner-supplied guide: `ATUNED_LOOKDEV_BRAND_GUIDE_REVIEWED_V2_2026-10-13.html`.
- Reviewed local artifact: `ATUNED_LOOKDEV_WORKBENCH_REVIEWED_2026-10-14.html`.
- Local SHA-256: `9e96f0bdb51b381291e44ab47fbacfe319728c2a3dc21f8bc56e944fec9e4614`.
- Fixed page order: Fonts/Typography → Logo/Wordmark → Colors → Icons → UI Elements → Copy Elements → Story → Taglines → Motion → Sound → Innovation.
- A local Chromium run now verifies all 11 tabs can be activated, global palette tokens change, light/dark mode changes computed colors, mobile document width remains 390px, and no JS exceptions/console errors were recorded in that pass.
- Still open: commit reviewed HTML to this branch; full keyboard-only/screen-reader acceptance; owner visual approval; component-by-component contrast audit (Earth/Jewel accent on surface is below 4.5:1 if used as text); source-fidelity cross-review. Latest local pass also wired Mirror confirmation/challenge/correction feedback and fixed sound-enable label consistency. QA package: local `ATUNED_LOOKDEV_BROWSER_QA_2026-10-14.zip`.
- Do not use the generic three-direction workbench as the primary brand guide.

### B. Application P0 blockers
1. **P0-1 Appendix collision:** partial, issue #75 open. Appendix F identity/contents/nav patch is committed on the isolated branch (`f32cf203381b4a19419f26718e778c8c9e6b1cd9`, root blob `adb84d9f4c96ae2b568b547b47a28eb682ec1298`). Static IDs pass; browser acceptance failed on keyboard toggle. A guarded patcher now addresses native-button double activation and scroll-spy target matching; corrected run `38609326592` was queued at last poll.
2. **P0-2 Field B Strata:** open. Stored Gordon/1600 worst frame gap ~49.9ms, one frame above 17.5ms; repeat runs and root-cause determination missing.
3. **P0-3 Core/A/B selection:** open. Need matched fresh screenshots at 1600px and 390px, review matrix, and recorded selection.
4. **P0-4 runtime/accessibility/isolation:** open. CI success is not targeted proof for the appendix fix or all runtime requirements.
5. **Workspace/source mapping:** partial. Map all 12 app tabs to real source features vs workspace-only previews; explicitly document Diagnostic → Summary mapping.
6. **KPI acceptance:** open. Approve thresholds, define procedures, run tests, and preserve unmeasured KPIs as unmeasured.
7. **Cross-functional decision log:** open. Keep/change/reject decisions must cite evidence and rationale.

## Current repository pointers
- Repository: `rebootos-sourcce/MOB`
- Working branch: `lookdev/p0-execution-20261014`
- Canonical application entry: `main/index.html`, Git blob SHA `24dea9c95112fe83073e58ef4cb14d7eb5de9928` (do not modify main/production).
- Field A: `proto/field-a/index.html`, blob `fc36c42bd44aca5b2dde2200d1879ae3d6dc89f3`.
- Field A measurements: `proto/field-a/measure-field.json`.
- Field B: `proto/field-b/index.html`, blob `d2013e3a00fac76049697d3c59f4aa97c9ef89e3`.
- Field B harness: `proto/field-b/shoot.js`; stored measurements: `proto/field-b/cost.json`.
- Shared engine: `engine.js` (large-file connector read returned empty; inspect via local checkout).
- Token source: `atuned_src/shell/head.html`; generated stylesheet: `funnel/tokens.css`; generator: `tools/tokens.py`. Never hand-edit generated CSS.
- Navigation issue: [#75](https://github.com/rebootos-sourcce/MOB/issues/75).
- Draft PR: [#74](https://github.com/rebootos-sourcce/MOB/pull/74), documentation-only, open/unmerged.
- Existing guarded patcher: [patch_appendix_navigation.mjs](patch_appendix_navigation.mjs).

## Safety gates
- Do not merge or deploy without explicit release authorization.
- Do not edit canonical production `index.html` while doing brand look development.
- Do not claim queued/running jobs passed.
- Do not call a static/in-memory patch a source fix.
- Do not call a prototype preview a production feature.
- Every status needs evidence and an exact source revision; use **OPEN**, **PARTIAL**, **VERIFIED**, or **BLOCKED** consistently.


## Execution refresh — 2026-10-14 18:15 UTC

- Live Issue #75 remains OPEN: https://github.com/rebootos-sourcce/MOB/issues/75.
- Appendix source patch is on isolated branch `lookdev/p0-execution-20261014`; branch root `index.html` blob is `adb84d9f4c96ae2b568b547b47a28eb682ec1298`. Static check previously reported 434 IDs, zero duplicates, A–F targets once, 106 data targets, and zero static fragment hrefs. Main/production remains unchanged.
- Browser run [38608899960](https://github.com/rebootos-sourcce/MOB/actions/runs/38608899960) failed at keyboard toggle acceptance: Enter left `aria-expanded=false`.
- Follow-up run [38609326592](https://github.com/rebootos-sourcce/MOB/actions/runs/38609326592) failed earlier in patcher validation: the keyboard-handler removal pattern did not match the source, so browser tests were skipped and no artifacts were produced.
- Corrective patcher change committed as `08402497a48986aa50a61229136e864681e97fe7`; patcher blob SHA `dae9298e2c7dc2fd6032242a128934b9636a76b5`. It replaces the whitespace-fragile exact string with a whitespace-tolerant regex and still requires exactly one match or a proven already-applied state. The regex source was re-fetched and inspected. **No passing run has yet been verified for this commit.** Refresh Actions and inspect the next run before further source changes.
- Field B stored evidence re-fetched: `proto/field-b/cost.json` blob `6aeff297eb300407702a5e499c873a306beb9e0e`; Gordon/1600/Strata remains a single stored outlier at `gapWorst≈49.9ms`, `over=1`, `gaps=21`. This is historical data, not a repeat measurement. `requests.log` blob `9475387168d699b0a6cdfd62743fdb80aea45b49` records zero off-machine requests in the old harness run. Repeated performance runs remain OPEN.
- Canonical root HTML and `engine.js` connector fetches still return empty content for large blobs. Byte-capable checkout/source trace remains blocked. The uploaded continuity ZIP contains plans and prior records, not the missing canonical workspace source or the local brand-guide artifact; the exact reviewed HTML and QA package described in prior records are not mounted in this thread.
- Next actions: verify Actions run for commit `08402497a48986aa50a61229136e864681e97fe7`; if static validation passes, inspect browser acceptance and artifacts. Then continue source recovery, repeated Field B measurements, matched Core/A/B captures, guide transfer/accessibility QA, source-tab map, KPI register, creative decision log, and exact Brand Dev 3/4/5 retrieval. Do not merge/deploy.


## Follow-up verification — 2026-10-14 18:20 UTC

- Recursive gap check found the first regex draft did not tolerate all whitespace variants. It was broadened and committed as `cca97598ea21aeb110b29405ab675a56ea1aa2ef`; patcher blob SHA is `ddb2fe20c52acd5980071d4ef77f5728f3feda5f`.
- The regex was exercised locally against the original formatting, a compact formatting, and a whitespace-heavy variant. It removed the first two sample handlers and did not match the whitespace-heavy third sample in that first check; the pattern was then broadened to tolerate whitespace around the event name, function parameters, condition, and calls. The final broader regex has not yet been re-exercised in this environment against the real repository source, and the exact-head GitHub Actions result is not verified. Treat this as a patcher change awaiting CI, not as a fixed or passed P0.
- Current gate remains: fetch the Actions result for commit `cca97598ea21aeb110b29405ab675a56ea1aa2ef`; verify static patcher and browser test, and inspect uploaded artifacts before advancing or closing Issue #75.
