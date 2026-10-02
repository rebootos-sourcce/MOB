# Pass 1, devops-qa (Sam Oyelaran). Measured proof on the real onboarding

Build measured: `source.html` md5 prefix `ccb7f6fc`, stamp `3b11b43 2026-10-01 23:37`, Chromium 1194, no `?dev=1` (login shows), then a `dev=1` plus `obOpen(true)` run. Software rendering on a shared box, so times run slow. Counts and states are exact.

**GRADE: 58/100**

## How I know the probes do not lie
Checked against known cases first (`scratchpad/p1/probecheck.js`, `probecheck2.js`):
- Contrast reads painted pixels with all text hidden, not the page ground. #777 on white read 4.48 (true 4.48). White on black 21.0. A gradient ground reads worst case 3.02 and median 4.60. `color-mix()` text parsed, none read as null.
- First cut read SVG text as black (1.10 to 1) because SVG paints with `fill`, not `color`. Caught on the Field, fixed, re-run. Same family as the six probe lies on record.
- Tap count: I pressed 10, the page logged 11. The 11th is `#strun` calling `relgo.click()` itself (`storyui.js:1538`). Reconciled, not a miss.
- Controls: second release on the same page reads the icons 20 by 20 (first reads 0 by 0). Escape works on a fresh open, so the later failure is real.

## Measured, first frame to completed first release (guest path)
- **10 taps, 1 typed field** (83 characters). Guest, Come in, Try one thing, Yes, Next, Go in, Write what happened, Commit, Run release, End. With an account: 3 typed fields (email, password, story), still 10 taps.
- **Boot 5.4 to 5.7 s** (six runs, both widths) before the login shows. The login is live under it from 0.4 s: Guest is the topmost hit target and the email box is focused, while `.boot` is `pointer-events:none`. First tap at 1.0 s was eaten by the boot skip (login still open, boot gone), the second tap worked. So a hurried person needs 11 taps.
- Click to next screen: under 7 ms (innerHTML swap, no transition between steps). Each step then replays about 1.0 s of dot animation (14 dots, 0.52 s each, 0.07 s stagger, 7 of them a watermark at 7 percent opacity). Leave fade 520 ms. Go in to Field ready 130 to 210 ms.
- Words: onboarding 217 (about 55 s silent). Tutorial 226 (about 57 s). Signal test asks for ten breaths, ten yes, ten no: about 2 minutes on one screen by my estimate, not measured.
- **Release default is 81:28** (dose 100, 3 addresses, 12 plan keys), 168:56 via Field "Run a release". Dose 1 measured end to end: **118 s** to the done card (welcome 5 lines at 3.8 to 5.9 s each, list starts at 29 s). 12 lines is the ruled mini release and equals dose 1, but dose 1 means typing in a number box.
- Estimate by dose at pace 1: 1 = 2.3 min, 5 = 5.5, 25 = 21.5, 50 = 41.5. Pace 2 about halves.
- Console: **0 errors, 0 warnings, 0 network requests** across every run (a held session adds `GET /v1/me`; I mocked the Worker and never touched the real one).

## Type, contrast, targets (ob screens, both widths)
- Sizes: 11 (eyebrow), 12.5, 13, 13.5, 14, 14.5, 15, 24 (20 at 390). Four to six sizes per card. None under 11. Eyebrows render "What This Is" (CSS `capitalize`), against the sentence case ruling.
- Contrast: heading 12.4 to 13 and body 6.2 to 6.9 pass. The `--dim` role (rgb 148,144,138, 13.5px) reads **4.2 to 4.6** on the drifting wash, so it passes and fails by frame: 2 of 4 onboarding screens, all 5 tutorial screens, and the login labels (4.30 to 4.36). Disabled Next on the signal test **1.60**. Boot "Powered by Source OS" 9px **1.6**. Header "Source OS" 8.5px **1.35** on every app screen. Story first screen: disabled Commit and Run release **1.57**.
- Targets at 44 by 44 floor: all onboarding buttons pass at 390 and 1600. Fails: Forgot password 141x20, Developer options 115x20.6, three checkboxes 13x13 (visible to every stranger at 12.5px, 3.58 contrast), Pause and End **36x44** in welcome and opening.
- At 390x844 every step fits (ob1 overflows 15 px, button still visible). At 360x640 ob1 and ob2 need 219 and 83 px of scroll with the button below the fold. At 320x568: 304 and 247.

## State written, step by step
- Login, Guest, steps 1 to 3: nothing written. The signal answer (`OB.felt`) lives in memory only and is **never stored**.
- Go in, Not now and Escape all write the same thing: `ui.onboarded=true`. A skipped onboarding and a finished one are the same record.
- Commit writes axes, story, history (+1 snapshot). End writes `meter.lines` 0 to 12, axes, history (+1).
- Tutorial: reachable only by the Developer options checkbox or profile replay. A stranger never meets it, and `tutorialSeen` is never read.

## Reload
- Any reload returns to the 5.4 s boot and the login. Guest again restarts at step 1: step and Yes/No answer lost.
- Finished onboarding survives (no replay). Typed story draft is **lost**. A committed story survives in the profile but its release queue is **lost**: Story tab says "You have not written anything yet" and Run release is disabled (history 1, DQ 7.19). Field "Run a release" still works.
- Reload mid-run: run lost, nothing charged (lines 0, DQ unchanged). Honest, but starts over.

## WHAT BREAKS
1. **End lies by omission.** Pressing End 30 s into the list says "You released 0 patterns" yet writes the full result: DQ 7.19 to 5.89, 18 weight freed, 12 lines billed. The dose-1 run that said all 6 reads the same 5.89. The result does not depend on what was said.
2. **Pause and End are blank in the welcome and opening** (first 29 s of the first release of a session). `relCss()` only runs in the run phase, so the icons are 0x0 and the buttons 36 wide. Repro: `node icon2.js`.
3. **Tutorial Continue is dead when empty.** Enabled at open, press does nothing, no message (step 0 before and after).
4. **Modal is not a modal.** `aria-modal="true"`, but two Tabs leave the card, nothing behind is `inert`, and Escape stops working once focus is on the app. No live region.
5. **Boot Skip is shown to strangers** and sends them to the Field with no onboarding (`onboarded` stays false). Boot also eats the first tap and focuses a hidden email box (typing goes into a field nobody can see).
6. Welcome says "His recorded voice reads this part", and the recorded audio is not in the build (`atuned-opening` appears 0 times in `source.html`).
7. Tutorial copy "carries 10 of 10 of shadow load". Signal test at 390: "Pick one to go on." wedges between Next and Back.

## THE SOUL
The welcome is right: a figure, 11 words, "No judgment". The machine around it is not. It asks for a decision on every screen (10 taps) and throws away the only thing it asks the person to feel.

## RECOMMENDATIONS for the new onboarding
1. **Auto slider, dwell by words.** dwell = 2.0 s + 0.28 s per word, floor 3.5 s, ceiling 8 s (31 words = 8 s). Six slides, about 40 s total. Progress as 6 segments, 3 px high, top edge, 44 px hit zone. Hold anywhere (150 ms press) pauses. Tap right 30 percent next, left 30 percent back. Skip as text, 14px, 44x44, upper right, 7:1. **S to M.** Moves the phone only arrival, skeptic, distress.
2. **Reuse the release welcome timer** (`relStep`, 3.8 to 5.9 s a line) so there is one clock, not two. With the 49.7 s voice, key slides to the phrase starts in `atuned-opening-timing.json` (draft, unconfirmed text: do not print it). **M.**
3. **Boot to 2.5 s or less, `pointer-events:auto`, no focus until it ends,** and no stranger Skip. **S.**
4. **The signal test is one tap that advances.** Three buttons 44 high, no Next, no disabled state, no scroll at 360x640. Store the answer: `ui.obSignal` yes, no, none, null. **S.**
5. **Separate done from skipped**: `ui.onboarded` done or skipped, plus `ui.obStep`. Escape never writes. **S, schema additive (his call).**
6. **First release defaults to dose 1 (12 lines, about 118 s)**; draft and release queue persisted on input (debounce 400 ms). **M.**
7. **Fix End:** charge what was said, or print what it wrote. Call `relCss()` at open. **S.**
8. Tokens: body 16 px at 390, `--dim` to rgb(166,162,155) (worst frame 5.5:1), no text under 12 px, no disabled primary. Respect reduced motion (already clean: boot clears at 0.5 s, dots and wash off, 0 s transitions). **S.**
9. Focus trap and `inert` behind the card; `aria-live` on the slide change. **S.**

Gates to add, each proven to fail on today's build: icon box nonzero in every release phase; every enabled ob control changes state; ob contrast on painted pixels at both widths (my probe); reload mid-flow resumes at the same step; boot does not eat the first tap; Escape leaves the dialog from any focus.

## Reproduce
`cd /tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/p1; export NODE_PATH=/opt/node22/lib/node_modules`, then `node journey.js 1600 1000` (and `390 844`), `node dev.js 1600 1000`, `node boot.js`, `node door.js`, `node reload.js`, `node reload3.js`, `node realrun.js`, `node fold.js`, `node icon2.js`, `node esc.js`. Output JSON and shots sit beside them.

## Gates on this build (read off the run, not typed)
GATES_PLACEHOLDER
Not signed off for the current onboarding.
