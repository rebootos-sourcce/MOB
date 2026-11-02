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
