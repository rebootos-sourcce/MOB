# ATÜNED Dev — Start Here / Working Index

**Updated:** 2026-10-14  
**Scope:** ATÜNED look development plus inherited application P0 blockers  
**Rule:** This index is the first read in every continuation. It is a routing document, not a claim that listed tasks are complete.

## Mandatory read order — every round

1. **This file:** current priorities and source map.
2. [Executive handshake](ATUNED_LOOKDEV_EXECUTIVE_HANDSHAKE_2026-10-14.md): scope, decisions, constraints, carry-over rules.
3. [Repository sitemap and source trace](ATUNED_REPO_SITEMAP_TRACE_2026-10-14.md): canonical entry points, dependencies, prototypes, evidence paths.
4. [Execution ledger](ATUNED_DEV_EXECUTION_LEDGER_2026-10-14.md): status of every task, evidence, SHA, blockers, next action.
5. Re-read the current source at the exact branch/commit recorded in the ledger; do not rely on old summaries.
6. Search the conversation/project library for **ATUNED BRAND DEV 5**, **ATUNED BRAND DEV 4**, and **ATUNED BRAND DEV 3**. Review each three times: (a) decisions/goals, (b) visual/page requirements, (c) gaps/conflicts. If literal source folders are unavailable, record that limitation rather than pretending to have reviewed them.
7. Inspect the master index and relevant source files before describing any asset/token/icon/motion/sound as canonical.
8. Before ending the round, update this index, sitemap/trace if mappings changed, execution ledger, and executive handshake. All incomplete work must remain in the carry-forward list.

## Current workstreams

### A. Brand look-development guide
- Owner-supplied guide: `ATUNED_LOOKDEV_BRAND_GUIDE_REVIEWED_V2_2026-10-13.html`.
- Reviewed local artifact: `ATUNED_LOOKDEV_WORKBENCH_REVIEWED_2026-10-14.html`.
- Local SHA-256: `f94b2dac4cf6daa91bcb2cb7e3ebdf46389a162fb4ab0650f80ccb6b2cf139cd`.
- Fixed page order: Fonts/Typography → Logo/Wordmark → Colors → Icons → UI Elements → Copy Elements → Story → Taglines → Motion → Sound → Innovation.
- A local Chromium run now verifies all 11 tabs can be activated, global palette tokens change, light/dark mode changes computed colors, mobile document width remains 390px, and no JS exceptions/console errors were recorded in that pass.
- Still open: real human-equivalent keyboard/focus acceptance; search correctness/expectations; sound gesture/autoplay verification; accessibility/contrast review; commit reviewed HTML to this branch; screenshots for all 11 pages at desktop and mobile; source-fidelity cross-review.
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
