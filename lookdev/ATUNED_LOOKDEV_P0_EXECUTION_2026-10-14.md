# ATÜNED Look Development — P0 Execution Record
**Date:** 2026-10-14  
**Workstream:** Creative Development / LookDev  
**Status:** PARTIAL — source recovered and candidate assets inventoried; browser/runtime acceptance remains open.  
**Safety boundary:** no production deployment, no edits to canonical `index.html`, no live data changes.

## First correction: canonical source is present
The prior execution note said the canonical HTML was unavailable at the referenced paths. A fresh recursive tree read of `rebootos-sourcce/MOB@main` found the canonical root application:

- `index.html`
- Git blob SHA: `24dea9c95112fe83073e58ef4cb14d7eb5de9928`
- Recorded size: 5,901,968 bytes
- Verified repository location: https://github.com/rebootos-sourcce/MOB/blob/main/index.html

The source retrieval adapter returned an empty content body for this large file while still returning its SHA and path. Therefore the file is identified, but its full bytes have **not** been retrieved into a browser-capable runtime in this execution. Do not call that browser-tested or fully recovered locally.

## Candidate LookDev assets found
The MOB main tree contains two explicit Field explorations and measurement evidence:

### Field A
- `proto/field-a/index.html` — SHA `fc36c42bd44aca5b2dde2200d1879ae3d6dc89f3`, 56,069 bytes
- `proto/field-a/measure-field.js` — SHA `0635a0f4f2d7c97b3ec880275c7edadbd617700f`
- `proto/field-a/measure-field.json` — SHA `03bf08ee5092e08cbac106ca8f600be24f9a4a0e`
- Desktop/mobile panel measurements and request logs are present.
- Desktop/mobile screenshots and axis, band, mark, spine, and today variants are present.

### Field B
- `proto/field-b/index.html` — SHA `d2013e3a00fac76049697d3c59f4aa97c9ef89e3`, 52,743 bytes
- `proto/field-b/seventh.html` — SHA `cae7a6d7790892fb1f99aaa35a5c1ffa6bbb27f0`
- Cost data, request logs, and `shoot.js` / `shoot-seventh.js` are present.
- Desktop/mobile screenshots cover anchoring, columns, details, rings, stacks, shell, strata, unroll, open/shut, and body-region states.

These are candidates, not yet an approved Look A/Look B mapping. Their presence is evidence of existing exploratory work; it does not establish isolation, source-of-truth status, or current browser behavior.

## Execution blocks and acceptance

| Block | Status | Evidence / exit condition |
|---|---|---|
| B0 — source-of-truth discovery | **PARTIAL** | Canonical path/SHA/size identified; full root HTML bytes not retrieved by connector. |
| B1 — protect Core | **HELD / SAFE** | No edits made to root `index.html`; use a separate branch and new workspace paths for look development. |
| B2 — map candidate looks | **PARTIAL** | Field A/B HTML, measurement data, request logs, and screenshot sets inventoried. Need visual inspection and explicit role assignment. |
| B3 — dependency and token trace | **OPEN** | Trace all CSS/font/image/script references; establish whether tokens are imported or copied; identify network dependencies. |
| B4 — static/runtime validation | **OPEN** | Need local checkout or retrievable artifact, syntax checks, real browser run, console/network review, and screenshots at desktop/mobile widths. |
| B5 — interaction and state isolation | **OPEN** | Verify controls, state persistence, reset/restore, export, and prove A/B changes cannot alter Core or each other. |
| B6 — visual acceptance | **OPEN** | Art direction, UI/UX, animation, accessibility, and responsive acceptance with measured evidence. |
| B7 — handoff and release | **HELD** | No production promotion until owner-approved look, exact SHA, test evidence, rollback plan, and explicit release authorization. |

## Next safe actions
1. Obtain the canonical root HTML through a byte-capable repository checkout/artifact path; verify SHA-256 against the retrieved bytes and record Git blob SHA separately.
2. Retrieve and inspect Field A/B pages and their referenced dependencies in a local/browser-capable runtime.
3. Compare them against Core at the same viewport and content state. Treat existing screenshots as historical evidence until their generating commit, viewport, and run are confirmed.
4. Select one controlled comparison matrix: Core / Look A / Look B. No fourth variant until A/B measurements are complete.
5. Record each visual difference as a token/component change with before/after screenshot, contrast/accessibility result, motion behavior, and owner decision.
6. Run exact-source browser acceptance; update this record with command, runtime, viewport, console/network outcome, screenshot hashes, and remaining defects.
7. Keep the branch unmerged and deployment untouched until release gates are met.

## Evidence boundaries
- **Verified:** GitHub main tree identifies canonical root HTML and the Field A/B artifacts at the SHAs listed above.
- **Not verified:** full canonical HTML bytes in local runtime; visual appearance from this execution; real browser launch; console/network health; Look A/B independence; save/restore/export behavior; production parity.
- **No production mutation:** no merge, deploy, database write, or production configuration change was performed.


## Static dependency pass — 14 October 2026
A second source pass read the complete Field A and Field B HTML and the shared generated token stylesheet.

- Field A HTML SHA remains `fc36c42bd44aca5b2dde2200d1879ae3d6dc89f3`; fetched text length 56,052 characters. It imports `../../engine.js`, contains one generated person-selector button pattern using `data-who` and `aria-pressed`, has one inline stylesheet, and no explicit form, inline event attributes, localStorage/sessionStorage usage, or direct `fetch()` calls detected by this static scan.
- Field B HTML SHA remains `d2013e3a00fac76049697d3c59f4aa97c9ef89e3`; fetched text length 52,737 characters. It imports `../../funnel/tokens.css`, `../../engine.js`, and `../../funnel/ring.js`. Two explicit controls exist: “Close every band” and “Measure the frame cost.” No explicit form, inline event attributes, localStorage/sessionStorage usage, or direct `fetch()` calls detected by this static scan.
- Shared `funnel/tokens.css` SHA: `4a2f6ff14639a0389c3192200703d389b1538103`; 8,457 characters. Its header says it is generated by `tools/tokens.py` from `atuned_src/shell/head.html`, and must not be edited directly. It declares approximately 49 tokens.
- Both pages reference the same shared `engine.js`; Field B also references the canonical token stylesheet and ring module. This is a dependency coupling to inspect, not proof that either page mutates Core. Do not fork token values by copying CSS. Any approved visual change should be made at the token source and regenerated through the documented toolchain.
- Static scan did not detect external URL literals in either HTML page. It is not a network capture and cannot establish that runtime requests are absent; the existing request logs must be checked against a real run.
- Full `engine.js` content retrieval returned an empty body for the large file, so engine behavior is not yet verified. The canonical root `index.html` also returned an empty body due to its size.

### Updated block status
- **B0 source map:** IMPLEMENTED for repository path/SHA discovery; local byte-level hash verification remains OPEN.
- **B2 candidate map:** IMPLEMENTED for path/dependency inventory; visual inspection and approved A/B assignment remain OPEN.
- **B3 dependency/token trace:** PARTIAL. Direct HTML references and generated token source are known; engine internals and runtime network graph remain OPEN.
- **B4 browser/runtime:** OPEN. No browser was launched and no screenshot/console claim is made.
- **B5 interaction/isolation:** OPEN. Static control discovery only; no interaction was executed.

## Exact next action
Use an authenticated local checkout or CI artifact to access the canonical 5.9 MB root HTML and shared engine, run the documented Field A/B measurement scripts, inspect screenshot artifacts, then launch the exact checked-out source in a real browser at 1600px and 390px. Record all commands and outputs before changing any visual code. Preserve Core and all production targets.


## Second recursive pass — canonical HTML and navigation defect
The blob API successfully returned the complete root HTML into the analysis pass (5,898,347 characters). This corrects the earlier connector-only limitation: source text is now inspectable, although no local browser/runtime was launched from this environment.

Static inventory of the root source:
- Title: `The Mechanics of Being, Lance Powell`
- 16 inline script blocks; 11 inline style blocks
- 16 buttons, 103 anchors, one input, one iframe
- 434 element IDs; one duplicated ID value found: `appendix-a`
- 53 inline `onclick` attributes and 35 `addEventListener` calls
- 10 `aria-label` attributes, zero `aria-live` attributes detected
- No `TODO`, `FIXME`, `HACK`, `console.log`, or `debugger` strings detected by the simple source scan
- No external script/link imports detected in the root HTML; this is not a network capture

### New P0 defect logged
Issue [#75 — Fix duplicate appendix-a target and complete appendix navigation](https://github.com/rebootos-sourcce/MOB/issues/75) records the confirmed defect.

Two different sections use `id="appendix-a"`:
1. Appendix A — The Coherent Opposite Library
2. A second section titled Appendix A — The Pattern Catalog at the end of the document

The side navigation and contents use `data-target="appendix-a"`, so the target is ambiguous. The contents summary says “Four appendices”; navigation includes A–E and an additional technical diagram, while the Pattern Catalog is absent from the contents. The intended correction is to retain the original A target, make the Pattern Catalog Appendix F with `id="appendix-f"`, add E/F to the contents, add F to side navigation, and reconcile counts.

**Patch attempt outcome:** an attempted rewrite of the 5.9 MB root blob failed at the connector transport layer. No HTML source edit was made. The defect is tracked with concrete repro and patch steps; do not report it as fixed.

### Updated P0 state
- Source bytes/text: **retrieved through Git blob API**; local checkout/hash verification remains open.
- Static source audit: **completed first pass**; duplicate appendix target is a confirmed defect.
- Browser acceptance: **open**; repository CI browser gates are running but are not a substitute for targeted acceptance of the appendix fix.
- P0 navigation defect: **open, issue #75**.
- Production: **untouched**.


## Third recursive pass — measurement artifacts and CI
Parsed the checked-in measurement JSON rather than treating screenshot filenames as proof.

### Field A measurement coverage
- Both viewport datasets are present: 390px and 1600px.
- Each dataset lists 15 profiles and eight depth/view records (A–D repeated twice).
- The current artifact's maximum seat label character count is 7. This is only a data-shape summary; it does not establish visual legibility or clipping.

### Field B transition budget
The existing `proto/field-b/cost.json` reports a specific outlier for `gordon-1600`, the explicitly tested heaviest roster profile:
- Strata: mean paint time about 1.82 ms, worst paint time about 2.10 ms
- Real-frame transition: worst frame gap about 49.9 ms, with 1 frame over the 17.5 ms budget out of 21 measured frames
- Other recorded state/direction entries show 0 frames over budget and 23 measured frames

The source explains that `over` counts real `requestAnimationFrame` gaps over 17.5 ms. This is a **performance/frame-budget outlier**, not a geometry overflow. It needs a rerun to distinguish a repeatable Strata transition problem from runner/compositor noise before choosing Field B. The measurement source and artifact are present, but this execution did not launch the local Playwright harness.

### CI status
- Prior PR workflow run `38601381970`: last observed 18 jobs succeeded and 10 remained in progress; no failed jobs were reported at that observation.
- After the latest execution-record commit, workflow run `38601838177` started. Its first observation showed 13 jobs in progress and 15 queued, with no conclusions yet. It must be polled to completion; do not treat queued/running jobs as passing.
- The current PR workflow is triggered by the documentation branch. Its results exercise the repository's gates, but they do not verify the proposed Appendix F patch because that patch has not been applied.

### Updated open blockers
1. **Appendix navigation collision:** duplicate `appendix-a` target; tracked in issue #75; fix not applied.
2. **Field B Strata timing outlier:** rerun `proto/field-b/shoot.js` on Gordon at 1600px, compare repeated frame-gap measurements, and record disposition.
3. **Look selection:** no approved Look A/B mapping; visual screenshot comparison and owner acceptance remain open.
4. **Targeted browser proof:** root source was statically inspected from the blob API, but no local browser launch, fresh screenshot capture, or console/network capture was performed in this execution.

Production and canonical source remain unchanged.
