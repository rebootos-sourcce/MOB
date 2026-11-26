# ATUNED Alpha — CI defect register (2026-11-25)

Scope: `rebootos-sourcce/MOB` only. Review branch `audit/alpha-stabilization-2026-11-25` (PR #222). **Not production acceptance.**

## Head verification and actual workflows

Checked branch heads before writing this register. All seven PRs were open and draft; heads matched the following:

| PR | Head | Workflow | Overall status at inspection |
|---|---|---|---|
| #222 | `8b63a31f` | [45664821629](https://github.com/rebootos-sourcce/MOB/actions/runs/45664821629) | completed/success |
| #223 | `2d699e46` | [45664542607](https://github.com/rebootos-sourcce/MOB/actions/runs/45664542607) | in progress |
| #224 | `33e0720c` | [45646701769](https://github.com/rebootos-sourcce/MOB/actions/runs/45646701769) | completed/success |
| #225 | `c691416c` | [45664947054](https://github.com/rebootos-sourcce/MOB/actions/runs/45664947054) | completed/success |
| #226 | `d5bade27` | [45664955117](https://github.com/rebootos-sourcce/MOB/actions/runs/45664955117) | completed/success |
| #227 | `5bf4220e` | [45647988756](https://github.com/rebootos-sourcce/MOB/actions/runs/45647988756) | completed/success |
| #228 | `8e76dbab` | [45663352295](https://github.com/rebootos-sourcce/MOB/actions/runs/45663352295) | in progress |

The four inspected `gates-fast` jobs on #222/#223/#225/#226 completed successfully, as did the four inspected `gates-report (recordlink)` jobs. Overall success must not be substituted for report-only acceptance.

## Open defects (none waived)

### A-001 — Talksilence: monitor quality and positive control fail

Evidence: [#226 job 139384496940](https://github.com/rebootos-sourcce/MOB/actions/runs/45664955117/job/139384496940), `tests/talksilence.js`.

Observed: 57 passed / 4 failed. At 1600px, 167 samples were recorded during a nominal 40-second / 50ms sampling run; only 151 samples found the button onscreen. At 390px, 140 samples were onscreen. Talk-off yielded 180 samples. The deliberately injected 150ms jump repeated four times yet registered zero excursions over 135 visible samples. Recognition restarts (7) and rerenders (9) were observed.

Distinction: these observations do **not** prove the button stayed still; the known-bad control also escaped detection. Do not lower the >500 and positive-control assertions to turn the gate green. Investigate browser event-loop saturation / concurrent four-page monitoring and add independent, validated movement detection before drawing a product conclusion. Confirm control detects its injected movement under CI load and catches real regressions.

### A-002 — Glassblue: phone-width color mismatch

Evidence: [#226 job 139384496369](https://github.com/rebootos-sourcce/MOB/actions/runs/45664955117/job/139384496369), `tests/glassblue.js`.

Observed: 243 passed / 2 failed. At 390px the loaded-page color probe reported 91.1% of light pixels leaning warm in the Glass white baseline, and only 31,241 of 243,584 pixels fitting the expected Glass blue light-surface test. Other lighting menus, alignment, accessibility, and menu stacking checks passed in the inspected log. Need isolate which DOM/canvas surface contributes the warm/incorrect pixels and establish whether it is a product defect or a measurement error. Preserve the owner-selected Glass blue appearance; do not rewrite color thresholds for convenience.

### A-003 — Source conversation canvas text assertion

Evidence: [#222 job 139384014018](https://github.com/rebootos-sourcce/MOB/actions/runs/45664821629/job/139384014018), `tests/srcconvo.js`.

Observed: 78 passed / 1 failed. Failure text: `the circle drew text at all, its seat labels: []`. The test emitted an empty seat-label list; inspect whether this reflects absent canvas drawing, inaccessible capture, or an overly restrictive assertion. Do not remove the intended rule that no status text belongs at the circle center.

## Acceptance and work order

1. Reproduce A-001 under resource-constrained CI; validate detector against known bad movement **before** evaluating the product. Keep 40s soak and full negative coverage.
2. Isolate A-002 mobile Glass blue offending surfaces using pixel/DOM cross-checks; fix product rendering if proved, preserving baseline Glass white.
3. Reproduce A-003 independently; verify assertion meaning against actual painted canvas.
4. Re-run relevant report, fast, browser, and product-consistency gates at exact new branch heads. Then execute required seven-repeat regression runs with artifacts.
5. Complete production database/security review and 20/20 critical journey acceptance with explicit evidence; currently NOT certified.

**Release restrictions:** no merges/deploys, main/branch-protection modification, billing activation, paid entitlement grants, sync, or live user data access without owner authorization. No gate relaxation. Keep all fixes on review branches.

This is a diagnostic register and not a test pass, product fix, or production-readiness claim.
