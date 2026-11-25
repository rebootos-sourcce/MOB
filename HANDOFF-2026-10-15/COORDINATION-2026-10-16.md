# Two threads, one repository: how the build thread and the look development thread stay out of each other's way

Written 16 October 2026 by the build thread, for the owner and for the look development thread (the "Atuned Emmy agent" thread). Neither thread can see the other. This file and the repository are the only shared channel.

## What is true right now

- `main` is what atuned.world serves. It is at the commit named by `git log -1 origin/main`. Every merge to `main` starts a deploy, and a deploy runs every gate.
- Merged today: the crisis button and the Contracted and "your energy" words (PR 86), the record-truth fixes (94), the gate coverage work (91), Emmy's files (89), the archetype percent engine (90).
- In flight, each on its own branch, each needing `main` merged in before it can land: tutorial journal step (PR 95), Discord feedback (PR 100), example profiles show only (PR 97), privacy and terms pages (PR 87).
- Not product code, no merge risk: gift bank candidates (PR 98), branch cleanup manifest (PR 99), the four achievements mockups (branch `claude/achievements-mockups`, under `mockups/achievements/`).
- Files the in-flight work touches, so look development should not edit them in the same hours: `atuned_src/ui/tutorial.js`, `ui/login.js`, `ui/storyui.js`, `ui/release.js`, `ui/account.js`, `ui/crisis.js`, `shell/head.html` near the onboarding stage, `engine/showonly.js`, `funnel/legal/*`, `functions/feedback.js`, `.github/workflows/deploy.yml`.

## The rules for any thread that changes the site

1. Work on a branch cut from the current `main`. Never push to `main`. A change reaches `main` only by a pull request that passes every check.
2. Edit `atuned_src/` and `funnel/` sources. Never edit `source.html`, `engine.js`, `atuned-packed.html` or `funnel/dist/*`: they are build products. After your last source change, run `./atuned_src/BUILD-engine.sh`, `./atuned_src/BUILD.sh` (it also packs) and `./funnel/BUILD-single.sh`, commit the products, and run `node tools/products.js`, which fails if they do not match the source. If another branch merged first, merge `main` into yours, regenerate the products from the merged sources (never resolve them by hand), commit and push again.
3. Read `CLAUDE.md` and `DECISIONS.md` first. No em dashes. Sentence case. Plain words, every term explained where it appears. Never say 108; the count is 112. A control never claims success it does not have.
4. A look change is a design change: run `node tests/design.js`, `tests/collide.js`, `tools/monitor.js` and `node tools/shots.js`, and look at the pictures at 1600 and 390 wide. The measured floors are in `.claude/skills/atuned-ux/SKILL.md`.
5. Look development that is not ready to ship goes in `mockups/<name>/` or `lookdev/`, which no gate reads and no deploy publishes.
6. Leave a note here, dated, in the section below, when you start something that touches shared files, so the other thread can read it.

## Notes from the look development thread

(Add dated notes here: what you are changing, which files, which branch, when you expect a pull request.)

## Notes from the build thread

- 16 October, evening: the next hours are a stabilization push. Merge order: 95, 100, 97, 87. After the last one, a full deploy and a build handed to the owner as a download with its stamp and md5. Please do not merge to `main` between those, and hold look changes to a branch until that build is out.


## 25 November 2026, 15:29 Pacific: ChatGPT to Claude, Alpha stabilization mailbox

**To Claude and any build agent continuing this work.** This is the existing shared inter-thread coordination channel, not a claim that Claude has already read the message. Owner requested a detailed GitHub mailbox handoff and continued updates until Alpha is complete. Re-read the latest PR heads and workflows before acting, because this section is a timestamped snapshot, not live status. Future build cycles should append a dated update here and leave a short PR #222 comment linking the update. Do not erase the earlier handoff history.

### Scope and safety

- Repository: `rebootos-sourcce/MOB` only, **not** `Reboot-OS`. Seven open draft review PRs #222 to #228. No direct work on `main`.
- Do not merge or deploy, alter branch protection, activate billing, grant production paid access, enable sync, or touch live user data without owner authorization. Do not weaken tests, floors, guards, or acceptance criteria to obtain green.
- Source files in `atuned_src/` are canonical; generated `source.html`, `engine.js`, and packed products are not to be hand edited. Full-history build and product consistency checks are mandatory for source changes.

### What I completed

1. Verified PR heads and workflow results repeatedly through GitHub, distinguishing queued/in-progress jobs from concluded jobs. Previously verified successful full-history artifact rebuilds are PR #223 `v3506` (`2a506666`), #225 `v3502` (`62f7ec2d`), #226 `v3503` (`d9ccb1d5`). Temporary build workflows were already removed. #222 includes a permanent `v1` shallow-build reject in `tools/products.js` (`8b63a31f`).
2. Added diagnostic register [`qa/ALPHA-CI-DEFECT-REGISTER-2026-11-25.md`](../../qa/ALPHA-CI-DEFECT-REGISTER-2026-11-25.md), commit [`213da546`](https://github.com/rebootos-sourcce/MOB/commit/213da546aa8df28aeaa984af3991fcd394358421), to review branch `audit/alpha-stabilization-2026-11-25` (PR #222). Records job links, measured failures and the nonwaivable remaining acceptance work.
3. Changed only `tests/talksilence.js` on PR #222, commit [`52634ebf`](https://github.com/rebootos-sourcce/MOB/commit/52634ebf29bcb598f415c3fba4ceb4e4b1104317). Added Chromium test-launch flags `--disable-background-timer-throttling`, `--disable-renderer-backgrounding`, `--disable-backgrounding-occluded-windows` to address the observed under-sampling of four simultaneous pages. Retained the 40-second soak, >500 sample floor, movement limit, and injected known-bad jump positive control. The hypothesis was timer throttling; **the subsequent CI still failed the Talksilence report gate**, so this is NOT a verified fix. Diagnose rather than declare success.
4. A later separate commit `52d1c9e` on PR #222 modified `.github/workflows/nightly-gates.yml` and `tools/gates-repeat.js`; this change was observed but was **not authored in the two commits above**. Inspect its diff and authorship before altering those files.

### Latest verified state, 25 November 2026 about 15:29 Pacific

| PR | Exact head | CI evidence | Overall status |
|---|---|---|---|
| #222 | `52d1c9e313f25fb6299939a76242535a557af356` | [45711742184](https://github.com/rebootos-sourcce/MOB/actions/runs/45711742184) | in progress; `gates-fast` passed, `glassblue` and `talksilence` report jobs failed |
| #223 | `2d699e46e2ebe61a4debc532c52d67d38357a812` | [45664542607](https://github.com/rebootos-sourcce/MOB/actions/runs/45664542607) | completed, success |
| #224 | `33e0720c5a5ee00c9a8d70e675d9f7842b0f7d5c` | [45646701769](https://github.com/rebootos-sourcce/MOB/actions/runs/45646701769) | completed, success |
| #225 | `c691416c66df6fbec809e8c7e54c2befc2c6984a` | [45664947054](https://github.com/rebootos-sourcce/MOB/actions/runs/45664947054) | completed, success |
| #226 | `d5bade27dd19e02a678f3cd8202a432425945c39` | [45664955117](https://github.com/rebootos-sourcce/MOB/actions/runs/45664955117) | completed, success |
| #227 | `5bf4220ef7a90d4d51a065b141e563f0d0fd76e4` | [45647988756](https://github.com/rebootos-sourcce/MOB/actions/runs/45647988756) | completed, success |
| #228 | `8e76dbabacb50148542df9501ab176f4ca732e18` | [45663352295](https://github.com/rebootos-sourcce/MOB/actions/runs/45663352295) | completed, failure; glassblue and talksilence |

The overall workflow's green conclusion does not certify every report-only check. Five completed successfully, one failed, one still running at inspection. No global Alpha acceptance conclusion has been reached.

### Defects and measurements for Claude

- **Talksilence, open.** On #226 the reporter showed **57 passed, 4 failed**. During a nominal 40-second / 50ms sampler, a page produced only 167 samples (151 visible); other pages were similarly sparse. The intentionally injected movement repeated four times but zero excursions were measured. The detector cannot be trusted until its known-bad positive control fires; investigate page lifecycle, background throttling, scheduling, browser timer resolution and whether the target `#stapply` is visible for the entire intended interval. On latest #222 run the report still failed even after the Chromium flags. Fetch current job logs before choosing the next fix. Keep every acceptance criterion intact.
- **Glassblue, open.** On #226 reporter showed **243 passed, 2 failed**, both mobile 390px loaded Discover surface checks. Probe saw the Glass white baseline warm color (91.1% of lit pixels warm), but Glass blue had only 31,241 qualifying light pixels out of 243,584 stage pixels in the failing read. Inspect `tests/glassblue.js` section 8, actual stage `::before` gradient, canvas and DOM paint in `atuned_src/`. Preserve owner-selected cool blue appearance and Glass white baseline. Do not change visual thresholds to hide a product defect.
- **Srcconvo, earlier failure (not confirmed recurring).** On #222 older run a canvas-seat-label assertion failed once: **78 passed, 1 failed**. Later #222 latest job listing did not report `srcconvo` failure. Investigate only if reproduced.
- **#228 releasechain readiness.** Overall failure is report-only Glassblue/Talksilence in the inspected job set; separately validate the releasechain-specific scenario and navigation readiness before claiming PR acceptance.
- **Release blockers:** seven-repeat regressions on latest verified heads are not certified; production database and security acceptance incomplete; 20/20 critical journey acceptance incomplete. Document tested journey evidence, not an inferred pass rate.

### Next actions, in order

1. Read `CLAUDE.md`, `DECISIONS.md`, this coordination note and `qa/ALPHA-CI-DEFECT-REGISTER-2026-11-25.md`. Compare exact branch heads and inspect latest relevant CI logs, including #222 run 45711742184 and #228 run 45663352295.
2. Fix the **measurement integrity** of Talksilence first. Reproduce under CI-like resource limits; the injected known-bad jump must be observed. Preserve 40s and existing floors. Only then assess whether the actual Commit button moves. Create scoped review-branch change, run targeted regression and full branch gates, and record exact run ID/head and result.
3. Diagnose Glassblue 390px loaded stage with a DOM/canvas/screenshot cross-check. Fix canonical UI source only if a product defect is proved, rebuild all required products with full history, inspect visual screenshots at 1600 and 390 and test unchanged Glass white.
4. Maintain entitlement fail-closed, record-link zero grants/carried=0, Story Commit visibility, fade behavior, draft durability and test-budget bounds while rerunning. Do not break already passing work.
5. Finish database/security and all 20 critical journeys and seven-repeat acceptance. Only after full verifiable acceptance report completion and pause the automation; do not auto-merge or deploy.

### When you continue and how to keep Claude informed

At **each material development step**, append a dated, concise log here with: author/agent, exact PR and branch, new head SHA, code paths and behavior changed, expected vs measured results, CI run/job links and final conclusions (or explicit pending), open defects and the immediate next action. Leave a short linked message on PR #222 for visibility. **Claude: please use this section as the read-first shared mailbox; coordination between sessions is by committed repository evidence, not an assumption of direct communication.**
