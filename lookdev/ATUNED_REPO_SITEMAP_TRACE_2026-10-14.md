# ATÜNED Repository Sitemap and Source Trace

**Updated:** 2026-10-14  
**Repository:** `rebootos-sourcce/MOB`  
**Branch context:** `lookdev/p0-execution-20261014`  
**Purpose:** fast source orientation for future AI sessions. Paths and hashes below are trace points, not a substitute for fetching the exact current revision.

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
| Lookdev guide | local `ATUNED_LOOKDEV_WORKBENCH_REVIEWED_2026-10-14.html` | Owner's 11-page brand guide with global palette patch | SHA-256 `f94b2dac4cf6daa91bcb2cb7e3ebdf46389a162fb4ab0650f80ccb6b2cf139cd`; local only at this point, not yet in repo. |
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
- Static transform checked in memory: no duplicate IDs; A–F section IDs once each; A–F present in TOC and nav; no unresolved static fragment hrefs. The source patch is committed on the isolated branch. However, the first targeted browser acceptance run failed on keyboard toggle behavior; the scroll-spy comparison and duplicate native-button keyboard handler are being corrected. Do not close P0-1 until corrected browser acceptance passes.

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

Do not equate this list with the 11-page look-development guide. Build a source-backed map for each tab: canonical source function/component, interactions/data source, corresponding guide page (if any), and whether the workspace representation is real functionality or preview-only. Explicitly document **Diagnostic → Summary** as a semantic mapping, not as identical labels. This map is still a required task; do not infer one-to-one correspondence from names.

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
