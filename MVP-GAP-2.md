# MVP gap, second count, 2 October

Checked today: HEAD 4d81750, build v1253.

## 1. What MVP means

MVP is the smallest thing a stranger can use, pay for, and be safe in. His three pillars (round NV, `MVP-GAP.md`) are onboarding and tutorial, release, and the paywall and pay journey. The accounts fork he called (`CLAUDE.md`, "What this project is becoming") adds three more: accounts, a practitioner who can be given sight of a person's data, and safety and privacy. **In the MVP:** the three pillars, sign in, a response for someone in distress, honest privacy, sound that works, and a practitioner page he can see, filled with example people. **After it:** real client records and grants, sync across devices, push notices, points that buy patterns, the ring, the tier four lead suite (`PLAN.md` K "Later"). That split of the practitioner is my default, not his ruling.

## 2. The gap table

"Built and used" only where I found it reachable in the app.

|Step|State|Proof|Left|Who|
|---|---|---|---|---|
|**Onboarding and tutorial**||||| 
|Funnel quiz and buy pages|built, not wired or not visible|funnel/quiz.html, buy.html|No public address. Buy page has no pay button|him: domain|
|Concern choice, pattern gift|not started|no concern step in funnel/|Waits on his storyboard|him|
|First-run welcome cards|partly|Run today: Guest opens them|His grade D on the look. Slider is a mockup|me|
|Day One tutorial|built, not wired or not visible|ui/tutorial.js; login.js:96 sets it off|Settings replay only. Wire into first run|me|
|First reading never empty|not started|PLAN J10: 11 of 16 sentences read nothing|Sniffer coverage, large|me|
|Copy sweep|partly|COPY-SWEEP-FINDINGS.md; J13 not merged|Run it|me|
|Phone widths|built and used|390 wide walk today|None|none|
|**Release**||||| 
|Release run, rerun, allowance|built and used|ui/release.js; engine group OG1|None|none|
|Release redesign and second audit|partly|mockups/release-redesign only; no audit file|Build, audit|me|
|**Paywall and pay**||||| 
|Tiers, locks, prices 12 29 59 99|built and used|engine/plan.js, ui/lock.js|Gift not honoured (J8)|me|
|Upgrade page to checkout, manage billing|partly|ui/plans.js, ui/auth.js|Never run against a live server|me|
|Server checkout, webhook, portal|partly|reboot-os: 56 tests pass, stubbed|Uncommitted. Not deployed|me|
|Stripe products, keys, BASE_PLAN 0|not started|STRIPE-SETUP.md|About 30 minutes|him|
|One real test-mode payment|not started|none|After the two rows above|him, then me|
|Self-grant closed|not started|engine/schema.js:983 takes a pasted tier|Small fix and a gate|me|
|25 pattern referral|not started|DECISIONS.md only|After first payment|me|
|**Accounts**||||| 
|Sign up, sign in, forgot password|partly|ui/login.js, ui/auth.js; server not reachable here|Deploy, mail key|him|
|Claim a quiz record at sign in|not started|no quiz claim code; paste box only|Build the seam|me|
|Sync, push, delete from server|not started|server routes exist; app calls none|After MVP (PLAN K, L3)|me|
|**Practitioner**||||| 
|Switch, door, Clients page|built, not wired or not visible|ui/practitioner.js, 124 lines, a sketch|Shut on worked examples; see below|me|
|Client list, panel, notes on examples|not started|PRACTITIONER-STORY.md PR1 to PR4|Slices below|me|
|Grants, real client records|not started|no grant table in reboot-os|Needs second-seam ruling|him, then me|
|**Safety and privacy**||||| 
|Distress reader|not started|side branch c1cbc1a only; 28% cold recall|Merge, fix, test (P05)|me|
|Care card and Help sheet|not started|no such file|P09|me|
|Clinician and counsel review|not started|none|Book it|him|
|Truth sweep|not started|account.js:424 toggle still there|Small (J9, P04)|me|
|Privacy table, forget, encrypted backup|not started|plain export only|P08, P20, P21|me|
|**Sound**||||| 
|Sound effects and release bed|partly|ui/sound.js plays after a press in my run|He hears none. Builder on it|me|
|**Quality gates**||||| 
|Engine gate|built and used|node tests/engine.js: 4172 passed, 0 failed|None|none|
|Browser gates|built and used|collide 831 passed; design and functional: see note|None|none|
|New gates: safety, privacy, perf, journey|not started|not in tests/|Land with each slice|me|
|Packed file|built, not wired or not visible|inflates to v1161; source.html is v1253|Repack (P23)|me|


**Two numbers, and neither is a measurement.** Old file: 16 of 25 steps, 64 percent, every step weighing the same. Today: 10.5 of 32 steps, 33 percent. The drop is the longer list (safety, practitioner, sound and gates were left out) and stub-only work now counting half. **Second number, weighted by what blocks a first paying stranger:** of the 12 steps marked as blockers in this table (distress, care, review, self-grant, first reading, the pay chain, sign in, the public page, the release), 3 points are earned out of 12, 25 percent. This is the number to steer by.

## 3. The practitioner layer

**Built in code.** A switch in Settings, Account, "Practitioner mode" (`ui/account.js:179`). A fifth menu section after Embody with one tab, "Clients" (`engine/core.js:236`). The page is `ui/practitioner.js`, 124 lines: three dashed empty rows, three stubs reading "not built yet", and a line calling it a sketch. Privacy shows "People who can see this record: nobody", a promise with no list behind it. The server in `/home/user/reboot-os` has no grant table and no link routes.

**Can a person reach it.** Yes, measured in headless Chromium on `source.html`. At 1600 wide: profile button (top right), Settings, Account, scroll to the bottom group, flip the switch, press the new "Practitioner" button after Embody, then "Clients". With `?dev=1` the login card is skipped. Without it, press Guest and then "Not now" first. At 390 wide: the same switch, then the top "Play Field" button opens a list and Clients is last.

**Why he does not see it, reproduced.** On a worked example (the profile list leads with them, for example Pavel) the switch slides on, the menu stays shut, and the line "Nothing saved on a worked example." flashes. The switch is stored on the profile, and examples refuse writes. The earlier "could not reproduce" was on his own profile, where it works. The switch also sits below the fold.

**Only a story.** Roster, active status, swipe, notes, right panel, grants, consent: all in `PRACTITIONER-STORY.md` and `DESIGN-profiles.md`, none in code. No picture of the page exists, though he asked to see both right panel versions.

**Smallest build so he can SEE it** (my sizing, S 1 day, M 2 to 3):
- S0, small: make the switch a device setting that works on any profile (overlaps J2).
- S1, small: one mockup picture, both right panel versions, to him first.
- S2, medium: the three column page on the example people, labelled as examples (PR1).
- S3, medium: right panel from structure only, sortable (PR2).
- S4, small: private notes on the practitioner's device (PR3). S5, small: the person's "who can see me" list with revoke, empty (PR4).

He sees it after S0 to S2, about 4 to 5 days. Real clients (PR5 to PR9) need server grants (M), his ruling on a second network seam, and a large panel (`DESIGN-profiles.md`).

## 4. The sound gap

Code claims: sound is on by default and plays after a person's first press (`ui/sound.js`, `sfxWhy`). In my run `sfx('kept')` fired after one click. He hears nothing; a builder is on it.

## 5. Critical path to the first real payment

**His steps:** (1) Stripe: four monthly products, keys, the customer portal switched on (`STRIPE-SETUP.md`, about 30 minutes). (2) Worker secrets, domain, mail key (`HOSTING-SETUP.md`). (3) Book the clinician and counsel review now, the lead time is theirs. (4) Pick the onboarding slider.

**My steps, in order, sizes from `PLAN.md` K (S 1 day, M 2 to 3, L 5):**
1. Self-grant fix, J11, S. Needs nothing.
2. P06 commit and deploy the server, one timed signup, S, after his 1 and 2.
3. In parallel: safety P05 then P09 (M, M); reading coverage P12 then J10 (L, L); onboarding J1 (L).
4. Gift and lock P11 after P10 (M, M), gate chain P03, P19, P10 (M each).
5. First test-mode payment, then P23 release candidate and repack (M).

Two chains of about 10 days each; `PLAN.md` K says 18 to 32 working days for the whole slice plan. Public launch also waits on his review.

## 6. Ten risks, each with the one fix

1. Distress reader hits 5 of 18 cold phrases (28 percent) and misses curly apostrophes. Fix: P05, worded as best effort.
2. Self-grant: a pasted record with tier four opens every layer (`engine/schema.js:983`). Fix: J11, gated.
3. First reading empty for 11 of 16 plain sentences. Fix: J10, with those sentences as a test.
4. The packed file is stale, v1161 against v1253. Fix: repack, add a stamp check.
5. Server never confirmed live. Its billing changes are uncommitted in `/home/user/reboot-os`, and unreachable from here. Fix: P06.
6. Flaky timing gates. The 30 fps floor flaked at 29.8, and today other agents' gates ran beside mine. Fix: median of three, one integrator on a quiet machine.
7. Clinician and counsel review has an unknown wait. Fix: book it now.
8. "Unlock all sight" is on the real login card, and the gift is not honoured (J8). Fix: P11, hide it behind `?dev=1`.
9. The privacy page promises a named list that nothing fills, and the "Improve the Models" toggle contradicts research sharing being off. Fix: J9, small.
10. Device settings are written to the profile, so worked examples refuse the sound and practitioner switches (J2). Fix: one device setting store.
