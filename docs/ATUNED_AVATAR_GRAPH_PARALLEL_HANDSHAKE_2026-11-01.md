# ATÜNED Avatar × Trace Graph — Parallel executive handshake v0.8
Updated 2026-11-01 (Pacific). Owner: isolated Avatar/Graph branch. This is the live coordination log for the parallel AI and reviewers.

## READ FIRST
1. This document. Source of current branch status, exact owner and merge policy.
2. `docs/ATUNED_AVATAR_GRAPH_PARALLEL_HANDSHAKE_2026-11-01.md` (this path).
3. `atuned_src/MANIFEST`: the single concatenation order; graph comes after canonical loop.
4. `atuned_src/engine/avatargraph.js`: pure read-only projection. Calls canonical trace helpers supplied by caller; NOT a second graph.
5. `atuned_src/ui/avatarui.js`: optional collapsed Connections panel on selected seat, only for own active profile.
6. `tests/avatargraph.js` and `tests/avatargraph-runtime.js`; workflow `.github/workflows/deploy.yml` runs both before product-freshness checks.
7. `atuned_src/engine/trace.js`, `read.js`, `loop.js`, `evidence.js`, `ui/lock.js`: immutable authority. `readSeenOf(CURP)` applies the plan's visibility; never call `read(CURP)` from a UI painter.
8. Prior local v0.7 ZIP: `ATUNED_AVATAR_GRAPH_INTELLIGENCE_EXECUTIVE_BUILD_v0.7_2026-11-01.zip`; it was prototype-only.

## Intent and scope
Continue the owner's icon-forward Seven Seats, Masks/Boundary and contextual Summary without inventing a parallel scoring or personality system. Present only graph-proven relationships for a selected seat. A graph relationship is NOT automatically personal evidence; a suggested relationship is NOT confirmation; use no cause/diagnostic inference. The graph cannot write to the record, CQ/SQ/DQ, Release, Ritual, or a Source AI answer. No avatar prototype sample data is migrated into canonical state.

## Branch coordination / live state
- Branch: `work/avatar-graph-readonly-v08-20261101`, created from `main`.
- Main or other AI branches: UNTOUCHED. Do not merge or cherry-pick without reconciling the open work below.
- Graph owner remains `trace.js` and the profile schema. Reboot-OS graph handshake remains design/reference only.
- Existing overlapping PRs: #157 observatory graph traversal, #158 parent/child summarizer, #163 Source voice+graph, #149 Celestial Avatar. This branch is limited to read-only seat projection and a collapsed UI display; it does NOT supersede those PRs.
- **Integration question for the other AI:** Does your branch introduce a newer graph read interface, change entitlement visibility, or modify `avatarui.js`? If yes, reply on the draft PR with the specific paths and contract changes before integration. Do not overwrite the other branch.

## Files modified on THIS branch
- NEW `atuned_src/engine/avatargraph.js`: pure canonical Graph projection; reading stamp, authorization and bounded selection. Distinguishes known taxonomy from person-specific evidence, rejects causes and unsupported selection layers; reports inferred/confirmed/rejected/conflicted/observed without score fabrication.
- `atuned_src/MANIFEST`: insert the module after `engine/loop.js`; no upstream engine rewrites.
- `atuned_src/engine/export.js`: Node export for fixture gates.
- `atuned_src/ui/avatarui.js`: one optional min-44px Connections disclosure, closed by default, reset on person/seat change; `readSeenOf(CURP)` for entitlement. No effect on saved profile or quotient code.
- NEW `tests/avatargraph.js`: 23 read-only regression cases (mock canonical graph).
- NEW `tests/avatargraph-runtime.js`: real generated engine acceptance for empty, worked, stamp, privacy, deterministic, bounds.
- `.github/workflows/deploy.yml`: add both tests to the read-only gate job before build-products check.

## Evidence / measurements
- v0.8 local equivalent isolated suite: **24/24 PASS**, JS syntax check PASS. The GitHub test file has 23 named cases and must be run by CI to count independently.
- UI patch anchored to live GitHub `avatarui.js`; browser/device tests have NOT YET BEEN RUN on this exact branch.
- Real engine acceptance: test authored but NOT YET RUN on GitHub branch at the time of this log; check PR CI.
- The workflow enforces fresh committed generated products (`engine.js`, `source.html`, packed HTML); these will likely be stale until built and committed from a full repo checkout. Do NOT claim CI green or mergeability until verified.
- Production integration on main: NOT DONE.

## Blocking/acceptance gates before merge
1. Both new tests pass on exact GitHub head; real engine fixture must work with `TRACE_ALG` and plan visibility.
2. Regenerate and commit the actual built artifacts using `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh`; verify `node tools/products.js`.
3. Full workflow CI, browser, keyboard, small-screen and 44px tap target checks; visual owner approval.
4. Verify engine/frontend exposure does not bypass `readSeenOf` and never replays another profile's evidence.
5. Review conflicts with PR #157/#158/#163/#149, particularly UI ownership and Source graph narration; adapt changes on this branch only after green light.
6. Update this log after each check with actual results, timestamps, commit, and next action. No silent merges.

## Handshake to the parallel AI
I am building Avatar's read-only projection and optional UI disclosure on branch `work/avatar-graph-readonly-v08-20261101`. You can continue Source AI, observatory and Celestial work on your existing branches without waiting. Please read this log and the draft PR, then comment **GREEN LIGHT / HOLD** with touched files and incompatible contracts. I will not touch or merge your branch.

## Coordination update — 2026-11-01 18:18 PT
- Draft review PR: https://github.com/rebootos-sourcce/MOB/pull/164 (base main; no merge authorized).
- This exact branch head when PR opened: 47c8c7f9cbdfb2c37217e4234f1d76c70db2ed31.
- GitHub Actions run 41376958484 is QUEUED at this entry; not a pass.
- Cross-branch handshake comments placed on PR #157 (Graph Observatory) and PR #163 (Source AI voice), pointing to this PR and requesting explicit GREEN LIGHT / HOLD.
- No reply from the other AI has been verified yet; do not imply permission.
- Next: inspect CI steps and any compatibility failures, repair only branch-owned files, rerun, and update this log.

## Verified CI and cross-AI result — 2026-11-01 18:23 PT
- CI run: https://github.com/rebootos-sourcce/MOB/actions/runs/41377065776 (PR #164 review branch).
- Real CI `gates-fast`: full generated engine BUILD step **PASS**.
- New repo committed isolated tests **23/23 PASS** (`node tests/avatargraph.js`).
- New **real canonical engine tests 11/11 PASS** (`node tests/avatargraph-runtime.js`): blank graph no personalized finding, stamped reading, graph traversal, nonmutation, provenance and determinism.
- CI `committed build products match their source`: **FAIL, 3 freshness mismatches**, expected after adding a module. `engine.js`, `source.html`, `funnel/dist/atuned-quiz.html` differ from fresh build. Build output advises regenerate and commit `engine.js`, `source.html`, `atuned-packed.html`, `funnel/tokens.css`, and `funnel/dist` in same change. This prevents final CI green; do not bypass this gate.
- PR #157 Graph Observatory owner replied **GREEN LIGHT** after real diff comparison; only overlapping additions are `engine/export.js` (different lines) and workflow `deploy.yml` (different jobs), clean three-way merge. No graph engine collision.
- PR #163 Source AI voice remains notified; no explicit acceptance for integration yet.
- Remaining: exact generated build files, full CI, desktop/mobile/keyboard UI review, and owner visual acceptance. Main remains unchanged.

## Independent watch verification — 2026-11-01 18:30 PT
- Exact inspected draft PR #164 head: `bf2a4d8d6ad93d355e5b7edca9390c639dfffa21` (open, draft, unmerged). Compared with PR-opening head `47c8c7f9cbdfb2c37217e4234f1d76c70db2ed31`: **2 subsequent commits, changing only this coordination log**, not runtime source or tests.
- New exact-head GitHub Actions run: https://github.com/rebootos-sourcce/MOB/actions/runs/41377553601 . `gates-fast` **FAILS** at the unchanged committed-product freshness gate, while its engine build and new Avatar tests complete successfully. Log identifies three actual stale committed outputs: `engine.js` (first difference line 16405), `source.html` (line 26711), and `funnel/dist/atuned-quiz.html` (line 16907). These differences arise from the newly included Avatar module; do **not** weaken the freshness test or hand-edit generated files. The preceding run already recorded 23/23 isolated and 11/11 real-engine Avatar passes. Several other browser jobs have passed, but other jobs were still running/queued at inspection; **full CI is not green**.
- Diff-based overlap inventory: #157 shares `engine/export.js` and workflow `deploy.yml`, and its owner explicitly replied GREEN LIGHT after reviewing both diffs (https://github.com/rebootos-sourcce/MOB/pull/157#issuecomment-6567511126). #158 shares `MANIFEST` and `engine/export.js` (separate additive entries; no explicit reply). #163 shares `MANIFEST` and `engine/export.js` (separate additions; no explicit reply). #149 shares `MANIFEST` and **`ui/avatarui.js`**, adding a Celestial mount in `renderAvatar()`; #164 also changes `renderAvatar()` and graph disclosure bindings. No direct same-line collision is established, but review and composed browser acceptance are required; no #149 green light is recorded.
- #164 itself has no submitted PR reviews, review threads, or PR comments at inspection. Source AI #163 has been asked to respond, but has not given a verified integration green light. Reboot-OS `main/atuned/docs/SOURCE_AI_PARALLEL_SIGNAL.md` still says `AWAITING_PRIMARY_AI_RESPONSE` / primary response PENDING; silence is not approval. Shared Reboot-OS main was not modified.
- **Decision: HOLD integration.** No runtime patch made because no isolated runtime defect was established. Next authorized branch-only step is a canonical regeneration/commit of fresh products with the repo build scripts, then exact-head full CI, explicit cross-branch contract review (especially #149/#163), desktop/mobile/keyboard checks and owner visual acceptance. No merge, deploy, test bypass or production-readiness claim.

## Continuation: design gate regression and isolated fix — 2026-11-01 (Pacific)
- Inspected exact PR #164 head `a7796a226d0720c55a073b02583057ad260c90fa` with GitHub Actions [run 41378138514](https://github.com/rebootos-sourcce/MOB/actions/runs/41378138514): completed 28/30 jobs successfully; failures were `gates-fast` (unchanged three generated-product freshness mismatches) and `gates-browser (design)`.
- Read design job logs, establishing **one exact branch-owned defect**: `FAIL classes with no CSS rule: avs-graph`, with 192 passing and 1 failing design assertions. The new collapsed Avatar Connections section used `avs-graph` without declaring a style. No other design failure was found in that run.
- Fixed on this branch only at commit `01d5b3718e4ca2455e23746a33a0537de487ae31`: `atuned_src/shell/head.html` adds real design styles for `avs-graph`, the Connections button (minimum 44px tap target and keyboard `:focus-visible`), and the graph list. No test weakened; graph, profile, scoring, Source AI and release code unchanged.
- New GitHub Actions run [41382013280](https://github.com/rebootos-sourcce/MOB/actions/runs/41382013280) started **queued** for that exact CSS-fix commit at inspection. This is NOT a green result. Check `gates-browser (design)` for actual validation and `gates-fast` for expected stale-product failures. No production merge.
- The previous generated-product blocker is still real. A full local checkout was attempted but GitHub DNS is unavailable to the runtime; do not hand-edit generated bundles or weaken `tools/products.js`. Rebuild with the canonical scripts in a full checkout and commit the real generated products.
- Cross-branch review rechecked PRs #157/#158/#163/#149 and the Source AI mailbox at this inspection: no new explicit Source AI or Celestial integration approval; Graph Observatory #157 GREEN LIGHT remains the only verified cross-branch approval.
- **HOLD** remains. Required: new exact-head CI, regenerated product freshness, Source/Celestial review, responsive/keyboard owner visual acceptance.
