# ATÜNED Repository Sitemap and Source Trace

**Updated:** 2026-10-14  
**Repository:** `rebootos-sourcce/MOB`  
**Branch context:** `lookdev/p0-execution-20261014`  
**Purpose:** fast source orientation for future AI sessions. Paths and hashes below are trace points, not a substitute for fetching the exact current revision.

## 0. Master index and cross-repository authority

- [ATÜNED Master Index](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_MASTER_INDEX.md), branch `docs/atuned-master-index-20261012`, blob SHA `4080c5f851bf483b1408f818280ab78f45dc2107`. It is not present on `main`; use the exact docs-branch link until merged.
- [Architecture Review](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_ARCHITECTURE_REVIEW_2026-10-13.md), blob SHA `3a31664e7a43b7c5ad1d16f5ef134d780ba2062c`.
- [P0 Execution Control Board](https://github.com/rebootos-sourcce/MOB/blob/docs/atuned-master-index-20261012/ATUNED_P0_EXECUTION_CONTROL_BOARD.md), blob SHA `4e8d74f00f785dc08ddd471302ec43ca90b27c8d`.
- The master index is cross-repository/release authority; this lookdev sitemap is the focused MOB source trace. Neither replaces the other.

## 1. Entry-point map

| Area | Source/path | Role | State / caution |
|---|---|---|---|
| Canonical app | `index.html` on `main` | Production application entry | Main Git blob `24dea9c95112fe83073e58ef4cb14d7eb5de9928`; branch root blob `adb84d9f4c96ae2b568b547b47a28eb682ec1298` includes the scoped Appendix F patch. Main remains unchanged. |
| Field A prototype | `proto/field-a/index.html` | Candidate visual prototype | Blob `fc36c42bd44aca5b2dde2200d1879ae3d6dc89f3`; imports shared `../../engine.js`. |
| Field A measures | `proto/field-a/measure-field.js`, `proto/field-a/measure-field.json` | Measurement generator and saved output | Historical output; re-run and record runtime/source commit before accepting. |
| Field B prototype | `proto/field-b/index.html` | Candidate visual prototype | Blob `d2013e3a00fac76049697d3c59f4aa97c9ef89e3`; imports generated tokens, shared engine, and ring module. |
| Field B extra state | `proto/field-b/seventh.html` | Additional Field B state/prototype | Blob `cae7a6d7790892fb1f99aaa35a5c1ffa6bbb27f0`. |
| Field B measurement | `proto/field-b/shoot.js`, `proto/field-b/cost.json`, `proto/field-b/requests.log` | Browser capture/performance/request evidence | Stored Gordon/1600 Strata outlier: worst frame gap ~49.9ms, 1/21 gaps above 17.5ms. Repeatability not verified. |
| Shared runtime | `engine.js` | Common prototype/application behavior | Large-file connector fetch returned empty content; inspect through local checkout and trace imports/call sites before claiming behavior. |
| Token source | `atuned_src/shell/head.html` | App-owned token definitions | Blob `6638402056950cf0a9c92c975aa3536cae7ddada`; source of truth according to generator header. |
| Generated tokens | `funnel/tokens.css` | Shared generated CSS token output | Blob `4a2f6ff14639a0389c3192200703d389b1538103`; do not hand-edit. |
| Token generator | `tools/tokens.py` | Rebuilds `funnel/tokens.css` from shell source | Blob `db04b2d61bec42d2d6a1d5be667a80a0d717901d`. |
| Appendix patcher | `lookdev/patch_appendix_navigation.mjs` | Guarded check/apply patch for duplicate appendix target | Blob `0daf99082075c2d4fd9dfe9c2b718c2261bac103`; transformation passed in-memory static checks; actual source patch still open. |
| Lookdev guide | local `ATUNED_LOOKDEV_WORKBENCH_REVIEWED_2026-10-14.html` | Owner's 11-page brand guide with global palette patch | SHA-256 `9e96f0bdb51b381291e44ab47fbacfe319728c2a3dc21f8bc56e944fec9e4614`; local only at this point, not yet in repo. |
| Issue | [#75](https://github.com/rebootos-sourcce/MOB/issues/75) | Appendix navigation defect tracking | Open. |
| PR | [#74](https://github.com/rebootos-sourcce/MOB/pull/74) | Documentation/trace handoff | Draft, open, unmerged; not an application fix. |

## 2. Canonical application trace

### Source recovery
- Root `index.html` at `main` is the current canonical application path found by the repository tree.
- Git blob SHA: `24dea9c95112fe83073e58ef4cb14d7eb5de9928`.
- Connector successfully returned source text for static analysis (5,898,347 characters) in prior pass, but the direct contents adapter returned empty content due to size. Local byte-for-byte checkout/hash verification remains open.

### Confirmed root HTML static findings
- Title: `The Mechanics of Being, Lance Powell`.
- 16 inline script blocks, 11 inline style blocks.
- 434 IDs; one duplicated ID: `appendix-a`.
- 103 anchors, 16 buttons, one input, one iframe.
- Duplicate target belongs to original Appendix A “The Coherent Opposite Library” and appended “Appendix A — The Pattern Catalog”.
- Proposed correction: preserve original `#appendix-a`; rename Pattern Catalog to Appendix F and `id="appendix-f"`; reconcile TOC, side navigation, appendix counts and cross-links.
- Static transform checked in memory: no duplicate IDs; A–F section IDs once each; A–F present in TOC and nav; no unresolved static fragment hrefs. The source patch is committed on the isolated branch. First targeted browser acceptance failed on keyboard toggle behavior; the guarded patcher now removes the duplicate native-button keydown handler and fixes scroll-spy comparison. Corrected workflow `38609326592` remained queued at last poll. Do not close P0-1 until corrected browser acceptance passes.

## 3. Candidate prototype dependency trace

### Field A
- `proto/field-a/index.html` imports `../../engine.js`.
- One inline stylesheet; dynamic person-selector controls using `data-who` and `aria-pressed`.
- Saved measurement JSON includes 390px and 1600px datasets, 15 profiles per viewport, and eight depth/view records.
- Existing screenshots are historical until their producing commit, browser, viewport and command are confirmed.

### Field B
- `proto/field-b/index.html` imports `../../funnel/tokens.css`, `../../engine.js`, and `../../funnel/ring.js`.
- Visible controls include “Close every band” and “Measure the frame cost”.
- Saved `cost.json` has shut/open/Gordon datasets at 390px and 1600px. Gordon/1600 Strata has `gapWorst≈49.9`, `over=1`, `gaps=21`; other listed Strata rows are below the 17.5ms threshold.
- Re-run `NODE_PATH=$(npm root -g) node proto/field-b/shoot.js` in a byte-capable checkout. Preserve raw output and request log; repeat runs before deciding whether it is a repeatable defect.

## 4. Application surface map — source verification required

The supplied task list says the application exposes these 12 top-level tabs:
1. Story
2. Avatar
3. Summary
4. Intake
5. Analytics
6. Field
7. Body
8. Compass
9. Character
10. Ritual
11. Knowledge
12. Clients

Do not equate this list with the 11-page look-development guide or assume the list belongs to root `main/index.html` without proving it. Root `main/index.html` is titled “The Mechanics of Being, Lance Powell” and uses chapter/appendix navigation groups; the owner-supplied guide has 11 tabs. The exact 12-tab source has not been identified in the currently attached artifacts or repository path scan. This is a source-of-truth discrepancy and a P0 dependency. Locate the precise source artifact/commit before building the mapping. Then map each tab: canonical source function/component, interactions/data source, corresponding guide page (if any), and whether the workspace representation is real functionality or preview-only. Explicitly document **Diagnostic → Summary** as a semantic mapping, not as identical labels. This map is still a required task; do not infer one-to-one correspondence from names.

## 5. Brand guide sitemap — fixed order

| # | Page | Main acceptance focus |
|---:|---|---|
| 1 | Fonts / Typography | Font source/provenance, hierarchy, weights, legibility |
| 2 | Logo / Wordmark | Clearly mark concepts as proposals unless approved source is found |
| 3 | Colors | Palette study applies globally; token readout stays synchronized |
| 4 | Icons | Search/filter works; proposed marks not mislabeled canonical |
| 5 | UI Elements | Component states, focus, affordances, reset/restore |
| 6 | Copy Elements | Modes, corrections, concise copy, evidence status |
| 7 | Story | Source provenance and correct product framing |
| 8 | Taglines | Placement qualification; distinguish public promise from internal copy |
| 9 | Motion | Search/group/replay/reduced-motion behavior |
| 10 | Sound | Opt-in, enable/disable, sample controls, state consistency |
| 11 | Innovation | Product mechanics grounded in source, not decorative invention |

## 6. Read/trace procedure for every next thread

1. Read `ATUNED_DEV_START_HERE.md`.
2. Read the executive handshake and latest execution ledger.
3. Resolve the branch head and exact commit; refresh issue #75, PR #74 and all relevant CI runs.
4. Read the exact source bytes or retrieve a checkout. Record Git blob SHA and SHA-256 of local bytes separately.
5. Trace HTML imports, inline scripts/styles, external resources, event handlers, local/session storage, network calls and state ownership.
6. Trace `engine.js` call sites from root app, Field A and Field B; document shared mutable state and isolation boundaries.
7. Trace tokens from `atuned_src/shell/head.html` through `tools/tokens.py` to `funnel/tokens.css`.
8. For every screenshot/measurement, record source commit, command, browser/runtime, viewport, artifact path and hash.
9. Run one acceptance block, patch the confirmed issue, re-run focused checks, then review for new gaps before moving to the next block.
10. Update this sitemap and the execution ledger whenever paths, dependencies, source SHAs or acceptance states change.


## 7. Source-of-truth discrepancy: CORE_REFERENCE and 12-tab source

- The inherited task refers to an embedded `CORE_REFERENCE.html` inside a supplied handoff artifact and a separate source with 12 top-level tabs (Story, Avatar, Summary, Intake, Analytics, Field, Body, Compass, Character, Ritual, Knowledge, Clients).
- Current conversation attachments contain the owner-supplied 11-page brand guide and the reviewed local guide; the current branch tree does not contain a `CORE_REFERENCE.html` file.
- `main/index.html` is a 5.9MB “The Mechanics of Being, Lance Powell” document with chapter and appendix navigation. It is not the 11-page guide and has not been proven to be the 12-tab workspace referenced in the inherited task.
- Therefore the canonical-source-vs-CORE_REFERENCE byte comparison and 12-tab source mapping remain **OPEN / BLOCKED BY SOURCE IDENTIFICATION**. Do not infer that these are the same source.
- Next action: locate the exact handoff artifact containing `CORE_REFERENCE.html`, record artifact hash/provenance, compare its embedded bytes with the current candidate source, and establish the governing version before editing the 12-tab workspace.


## Latest guide interaction patch

The local 11-page guide now has Mirror response buttons that set an explicit preview status and `aria-pressed`, and the sound opt-in checkbox synchronizes the enable button label when disabled. Earth palette muted token was changed to `#d0c4b4`; core token contrast pairs now meet 4.5:1 for normal text. The accent token on Earth/Jewel surfaces remains below 4.5:1 and requires per-component usage review. Updated local guide SHA-256: `9e96f0bdb51b381291e44ab47fbacfe319728c2a3dc21f8bc56e944fec9e4614`. Browser QA zip is a local artifact and the guide is not yet committed to this repository branch.


## Execution refresh — 2026-10-14 18:15 UTC

- Live Issue #75 remains OPEN: https://github.com/rebootos-sourcce/MOB/issues/75.
- Appendix source patch is on isolated branch `lookdev/p0-execution-20261014`; branch root `index.html` blob is `adb84d9f4c96ae2b568b547b47a28eb682ec1298`. Static check previously reported 434 IDs, zero duplicates, A–F targets once, 106 data targets, and zero static fragment hrefs. Main/production remains unchanged.
- Browser run [38608899960](https://github.com/rebootos-sourcce/MOB/actions/runs/38608899960) failed at keyboard toggle acceptance: Enter left `aria-expanded=false`.
- Follow-up run [38609326592](https://github.com/rebootos-sourcce/MOB/actions/runs/38609326592) failed earlier in patcher validation: the keyboard-handler removal pattern did not match the source, so browser tests were skipped and no artifacts were produced.
- Corrective patcher change committed as `08402497a48986aa50a61229136e864681e97fe7`; patcher blob SHA `dae9298e2c7dc2fd6032242a128934b9636a76b5`. It replaces the whitespace-fragile exact string with a whitespace-tolerant regex and still requires exactly one match or a proven already-applied state. The regex source was re-fetched and inspected. **No passing run has yet been verified for this commit.** Refresh Actions and inspect the next run before further source changes.
- Field B stored evidence re-fetched: `proto/field-b/cost.json` blob `6aeff297eb300407702a5e499c873a306beb9e0e`; Gordon/1600/Strata remains a single stored outlier at `gapWorst≈49.9ms`, `over=1`, `gaps=21`. This is historical data, not a repeat measurement. `requests.log` blob `9475387168d699b0a6cdfd62743fdb80aea45b49` records zero off-machine requests in the old harness run. Repeated performance runs remain OPEN.
- Canonical root HTML and `engine.js` connector fetches still return empty content for large blobs. Byte-capable checkout/source trace remains blocked. The uploaded continuity ZIP contains plans and prior records, not the missing canonical workspace source or the local brand-guide artifact; the exact reviewed HTML and QA package described in prior records are not mounted in this thread.
- Next actions: verify Actions run for commit `08402497a48986aa50a61229136e864681e97fe7`; if static validation passes, inspect browser acceptance and artifacts. Then continue source recovery, repeated Field B measurements, matched Core/A/B captures, guide transfer/accessibility QA, source-tab map, KPI register, creative decision log, and exact Brand Dev 3/4/5 retrieval. Do not merge/deploy.
