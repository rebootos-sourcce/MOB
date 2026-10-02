# MVP gap, third count, 2 October (afternoon)

Measured on HEAD `f2fd8ff` of `claude/laughing-feynman-xhfyj3`, 2 October 14:26 UTC. The
committed `source.html` is stamped `v1358 96355ba 2026-10-02 12:39`, md5 `12654041`. A fresh
build of `atuned_src/` at this HEAD, written to a scratch folder, is byte for byte the same
apart from the stamp line, and `engine.js` built fresh is identical (md5 `9fd3afbf`), so every
gate below ran against what is actually committed. Read only: nothing was built or merged.

Every number in this file was read off a run made for this file. Where something could not be
checked from here, it says so.

## 1. The answer, first

**Percent to MVP, two ways.**

- **Every step counted the same (the "flat" count): 15 of 34 steps, 44 percent.** On the same
  32 steps the last count used, 14 of 32, also 44 percent (it was 10 of 32, 31 percent, this
  morning). The two extra steps are the two things you added tonight (round QA): the daily
  summary on screen, and the feedback tracker.
- **Only the steps that stop the first paying stranger (the "weighted" count): 3.5 of 12, 29
  percent** (it was 3 of 12, 25 percent). This is the one to steer by. It barely moved because
  tonight's work was mostly on things a stranger sees after the blockers, not on the blockers.
  Of the 12, the five with nothing done at all are all safety or truth: the distress check, the
  care card, the outside safety review, the free-upgrade hole, and the empty first reading.

How a step scores: done and reachable in the app is 1, built but partly done or not reachable is
one half, not started is 0. The steps are the team's list, so this is a way to see what is
left, not a measurement of quality.

**How the database is working, in one paragraph.** Today every person's data lives only in
their own web browser, on their own machine. Every profile, story, reading and setting is saved
in the browser's own storage (called `localStorage`), through one hookup in the code
(`bindStore`, `atuned_src/ui/ui.js:1585`), and the app never sends it anywhere. A real server
database also exists and is switched on: you created it in Cloudflare on 27 September (a "D1"
database, Cloudflare's built-in database, named `atuned`), and on 30 September the server (a
small program Cloudflare runs for us, called the Worker) went live at
`atuned-api.lance-o-powell.workers.dev` and built its tables. But the live server is the older
version: it can make accounts and sign people in, and it has empty tables ready for records, but
it has no payment parts and no voice part. Those are written and pass all 72 of their own tests
here, but they sit on a side branch that has never been sent live. And the app only ever asks
the live server about sign in; it never saves a person's record there. This sandbox's network
refused the server's address, so I could not see whether anyone has actually signed up.

**The single next task.** F1, the distress reader's engine half (the part of the code that
checks a first story for a person in crisis and shows nothing yet): start from the 292 line
draft already saved on branch `f1-distress-detector`, fix the curly apostrophe and the
"not" handling, and put a test on it. It needs nothing from anyone and it unblocks every safety
step. The one thing from you that runs beside it: your answer to J0, section 7.

## 2. What MVP means (unchanged from the second count)

MVP is the smallest thing a stranger can use, pay for, and be safe in. Your three pillars
(round NV, `MVP-GAP.md`): onboarding and tutorial, release, and the paywall and pay journey.
The accounts fork you called adds three more: accounts, a practitioner who can be given sight
of a person's data, and safety and privacy. **In the MVP:** the three pillars, sign in, a
response for someone in distress, honest privacy, sound that works, a practitioner page you can
see filled with example people, and (your round QA words, "that needs to be in") the daily
summary and the feedback tracker. **After it:** real client records and grants, sync across
devices, push notices, points that buy patterns, the ring, the tier four lead suite, and most of
the 90 day path (section 6, "Not doing").

## 3. The gap table

"Built and used" only where it is reachable in the app and a gate (an automated test run that
must pass) or my own probe shows it working. "Changed" says what moved since the second count
(`MVP-GAP-2.md`, HEAD `4d81750`, 2 October 02:00).

| Step | State | Proof | Left | Who | Changed since 2nd count |
|---|---|---|---|---|---|
| **Onboarding and tutorial** | | | | | |
| Funnel quiz and buy pages | built, not visible | `funnel/dist/` rebuilt at `b052556`; `funnel/buy.html` still says "Checkout is not open yet" | No public address (held on purpose until the distress response is in, F3). No pay button | him: domain, later. me: pay button | No |
| Starting point choice, pattern gift | partly | Twelve starting points in the onboarding (`OB_STARTS`, `ui/onboard.js`, `c30a70c`), kept on the story entry as `ent.ob.pick` | Not kept as a fact about the person, and the gift does not read it (F15) | me | **Yes, 0 to one half.** The choice now exists in the app |
| First run onboarding | built and used | On by default for every new arrival (`DEV_PLAY_ONBOARDING=true`, `ui/login.js:95`). `tests/onboarding2.js` 104 passed, 0 failed, in a real browser, including its F4 and F5 sections | "Not me" keeps a place out of the release but the story's charge still lands on it in the Field (the no is recorded, `ent.ob.no`, and nothing reads it yet). Per place yes and no, finished, is F16 | me | **Yes, one half to 1.** Wired in (`c30a70c`), mirror made true (F4), first release capped (F5, `7acd9f2`). Detail in section 4 |
| Day One tutorial | built, not visible | `ui/tutorial.js`; reachable only by the developer switch (`DEV_PLAY_TUTORIAL=false`, `ui/login.js:96`) | Sequence it after the onboarding as aftercare, the seats' call | me | No |
| First reading never empty | not started | My run today: 7 of the 12 plain sentences the review named still read nothing ("I am tired.", "I am stuck.", "I feel like a fraud at work.", four more) | Reading coverage, J10 / F10, large | me | No |
| Copy sweep | built and used | J13 copy walk merged (`d3a4e46`); unpack every symbol merged (`b25beb0`), its gate `tests/unpack.js` 560 passed, 0 failed | One wording tension in the F5 card ("place" is right, the counting is more than you asked for), seats to settle | me | **Yes, one half to 1** |
| Phone widths | partly | Gates at 390 wide pass (see Quality) | New since the count: the archetype intake's either-or dots are 32.4 pixels wide on a phone against the 44 pixel floor for a thumb (round PV), and the design gate only checks tap size at 1600 wide | me | **Yes, 1 to one half.** A defect came in with the archetype rebuild |
| **Release** | | | | | |
| Release run, rerun, allowance | built and used | `ui/release.js`; `tests/release-percent.js` 8 passed, 0 failed | None | none | No |
| Release redesign and second audit | partly | Studio voice landed, opt in (`d297a9c`); percent sign dropped (`094e2cf`); the redesign is still only `mockups/release-redesign/` | The black stage, the Field kept visible, the done screen (F12, F17) | me | Small. Voice landed |
| **Paywall and pay** | | | | | |
| Tiers, locks, prices 12 29 59 99 | built and used | `engine/plan.js`, `ui/lock.js`; `tests/locks.js` 289 passed, 0 failed | Gift not honoured: a fresh person sees no saboteurs, `planSees(null,'sab')` is false in my run (J8) | me | No |
| Upgrade page to checkout, manage billing | partly | `ui/auth.js` calls `/v1/billing/checkout` and `/v1/billing/portal`; a live plan's "Move to" now opens Manage billing, never a second checkout (`f6bbd1a`) | Never run against a live server, and the live server does not have these routes yet | me | Double-bill fix landed, app side |
| Server checkout, webhook, portal | partly | `reboot-os`, branch `claude/app-migration-decision-yx56cj`, tip `28fa6de`: 72 passed, 0 failed in my run. Second checkout on a paying account refused, 409 (`72a222b`) | That branch is 8 commits ahead of `main` and not live. Merging it to `main` is what sends it live | him: say go. me: merge | Committed now (was uncommitted); double-bill fix landed, server side |
| Stripe products, keys, `BASE_PLAN` 0 | partly | Four test-mode price ids in `wrangler.toml` (`e536668`) | Stripe secret key and webhook signing secret not confirmed set on the Worker; customer portal not confirmed on; `BASE_PLAN` is still `"1"` (every account reads as tier one) | him, then me | **Yes, 0 to one half.** Products made |
| One real test-mode payment | not started | none | After the two rows above | him, then me | No |
| Self-grant closed | not started | `tests/plan-selfgrant.js` 5 passed, 0 failed, and that gate passes only while the hole is still open: a pasted record saying "tier four" still opens every layer | Small fix, and flip that gate in the same change (J11) | me | No. The worked example unlock (`e0c46d6`) was built as a separate door and does not close this one |
| 25 pattern referral | not started | `DECISIONS.md` only | After the first payment | me | No |
| **Accounts** | | | | | |
| Sign up, sign in, forgot password | partly | The server is live: GitHub run `36385561644`, 30 September 21:07 UTC, applied database steps `0001` to `0008` and published Worker version `9ac30b3d`. The app points at it (`AUTH_API`, `ui/auth.js:37`) | No real sign up on record. The mail key that sends "forgot password" emails is not confirmed. Not reachable from this sandbox | him: mail key. me: one timed real sign up | **Correction, not a change.** The second count said the server was not deployed. It has been live since 30 September |
| Claim a quiz record at sign in | not started | No claim code on this branch; the claim packet sits in `journey.js` on protected commit `3869d96`, not landed | F13, then F21 | me | No |
| Sync, push, delete from server | not started | The live server has these routes; the app calls none of them | After MVP | me | No |
| **Practitioner** | | | | | |
| Switch, door, Clients page | built and used | The switch is a device setting now, so it works on a worked example too (`3491d58`); `tests/practitioner.js` 23 passed, 0 failed | Your look (round QA: "I will review the practitioner's page") | him | **Yes, one half to 1** |
| Client list, panel, notes on examples | built and used | `ui/practitioner.js` rebuilt, 583 lines (was 124), ten worked examples each labelled "example", private notes on this device, an honest "who can see me" list that reads nobody (`ded9adc`) | Example people only, by design. Its right column is a third pattern the visual-fail step must fold in (F22) | him: review | **Yes, 0 to 1** |
| Grants, real client records | not started | No grant table in the server's database | Needs your ruling on a second network route, after MVP | him, then me | No |
| **Safety and privacy** | | | | | |
| Distress reader | not started | Nothing on this branch: the onboarding gate prints "J0 STILL OPEN... typeof a detector function: undefined". A 292 line draft sits on branch `f1-distress-detector` (`600e65e`), not in the build list (`MANIFEST`), no test, never run; an older one on `c1cbc1a` | F1, then F2 | me | No. A draft exists; it is not counted as built |
| Care card and Help sheet | not started | The Help sheet (`helpSheet`, `ui/panels.js:1147`) is "How to read this", with no person to call | P09, inside F2 | me | No |
| Clinician and counsel review | not started | none | You said "not now" (round PW) | him | No |
| Truth sweep | not started | The "Improve the Models" switch is still in Account (`ui/account.js:425`), against research sharing being off | J9, small | me | No |
| Privacy table, forget, encrypted backup | not started | Plain export and "Delete this record" only (`ui/account.js:453`) | P08, P20, P21 | me | No |
| **Sound** | | | | | |
| Sound effects and release bed | partly | Sound made audible (J2, `1035de8`); the tension line spark (`44fc4db`); `tests/sound.js` 48 passed, 0 failed | Your last word on it was "I don't hear sound effects" and nobody has heard the spark. Your ear is the test | him: listen | Spark built and gated |
| **Quality gates** | | | | | |
| Engine gate | built and used | `node tests/engine.js` 4489 passed, 0 failed | The voice self-check still writes to a shared `/tmp` file (`tests/engine.js:6640`), F6 | me | Count grew from 4172 |
| Browser gates | BROWSER_STATE | BROWSER_PROOF | BROWSER_LEFT | me | BROWSER_CHANGED |
| New gates: safety, privacy, speed, journey | partly | Landed since: `journey.js` 70/0, `onboarding2.js`, `practitioner.js`, `device.js` 6/0, `plan-selfgrant.js`, and `trace.js` 266/0, `daily.js` 437/0, `practice.js` 780/0 | Safety, privacy and speed gates do not exist | me | **Yes, 0 to one half** |
| Packed file | built, not current | `atuned-packed.html` inflates to `v1349 8e05776 2026-10-02 11:22`; `source.html` is `v1358 96355ba`. It is missing F4 and F5 | Repack, and a check that fails when the two stamps differ | me | Repacked at `b052556`, stale again within three hours |
| **Added by you, round QA** | | | | | |
| Daily summary on screen | built, not visible | The engine half is on this branch: `engine/daily.js`, `tests/daily.js` 437 passed, 0 failed. Nothing on screen calls it | In progress on branch `daily-summary-ui`, 0 commits yet | me | New row |
| Feedback tracker and Discord door | partly | Account, Get help: "Ask a question", "Report something broken", "Rate", "Product feedback" exist and queue on the device (`engine/outbox.js`), and say "held on this device", truthfully, because nothing sends | In progress on branch `feedback-tracker`, uncommitted edits. Discord needs your webhook address and invite link | me, him: the two Discord links | New row |

**Counting it up.** Onboarding 4 of 7. Release 1.5 of 2. Paywall 2.5 of 7. Accounts 0.5 of 3.
Practitioner 2 of 3. Safety 0 of 5. Sound 0.5 of 1. Gates BROWSER_GATES_SUM of 4. Your two new
rows 1 of 2. **Flat: FLAT_34.** **Weighted**, over the same 12 blocker steps the second count
used (distress, care, outside review, self-grant, first reading, the four pay steps, sign in,
the public page, the release run): release 1, sign in one half, public page one half, and three
pay steps at one half each, so **3.5 of 12, 29 percent.**

## 4. Onboarding, checked end to end

You asked whether the honest mirror and the three place cap really work now. They do, inside
the onboarding, with one gap named below.

- **The mirror** (the step that shows a person what was read and lets them say yes or no) now
  reads the story before anything is saved (`ST_PARSED`, set at `ui/onboard.js:641`), and the
  save (`stCommit`) runs only after the person answers (`obCommit`, `ui/onboard.js:650`).
  A place the person's words did not name is printed with a "a guess" tag and the line "The
  engine's guess, from your Heart seat" (a seat is one of the seven body regions), never as
  their own words (`obRow`, `ui/onboard.js:351`). The gate's F4 section runs this on the
  review's own sentences, in a real browser, and passes.
- **The cap**, checked by me against the engine directly, not through the screen: Diane's
  sentence ("I snapped at my co-founder in front of the team and I cannot stop replaying it.")
  still reads 12 places, all 12 guesses, but the first release plan takes 3 of them, 12 lines,
  and says 9 wait. A sentence with named feelings ("I am exhausted and I cannot stop working.")
  reads 5, plans 3 and 12 lines. The plan is built only from the places the person said yes to
  (`obYesSignal`, `ui/onboard.js:507`), so a "Not me" can no longer slip into the release.
- **The gap.** The engine still reads Diane's sentence as 12 guesses: the mirror is now honest
  about guessing, but the guessing itself (F10) is unchanged. And a "Not me" keeps a place out
  of the release while the story's charge still lands on that place in the Field (F16).
- **Still the ship blocker.** The same gate prints "J0 STILL OPEN": no distress check runs on a
  stranger's first story. "I do not want to be here anymore." still reads as nothing in my run.

## 5. The database, in full

**Where a person's data lives today: their own browser, nowhere else.**
- One storage hookup. The engine never touches the browser; the app hands it one get and one
  set function backed by `localStorage` (`atuned_src/ui/ui.js:1585`, `bindStore` in
  `engine/schema.js:370`). I found no other direct use of `localStorage` in the app.
- What is kept under which name: every profile, with its stories, Field, journal and plan, in
  one entry, `source.profiles` (`PKEY`, `engine/schema.js:13`). Device settings such as sound
  and practitioner mode in `source.profiles.device`. The feedback queue in `source.outbox`. The
  sign in token in `source.session`. Ten small screen preferences (which view, which
  overlays) under short names such as `fview` and `bmov`, plus `devsight` for the testing
  switch.
- What leaves the machine, all through `ui/auth.js`, the only file that calls the network
  (`authCall`, line 85): email and password at sign up and sign in, the token on sign out and
  on "who am I" (`/v1/me`), a tier name at checkout, a request to open Manage billing, and,
  only if Studio voice is switched on, the release line to be spoken. Never a story, a reading
  or a profile.

**What exists on the server, read from `reboot-os` on this machine** (branch
`claude/app-migration-decision-yx56cj`, tip `28fa6de`, clean):
- One Worker, `atuned-api`, and one D1 database, `atuned`. Tables: accounts, sessions, consent,
  records (each record body sealed with a key, `src/seal.js`), research records, audit,
  entitlements (who has which plan), store events, push subscriptions, password resets, sign in
  attempts, crash reports, server errors, and 127 read-only "canon" tables of the product's own
  reference data. With the branch: Stripe columns and voice use.
- Routes the server answers: sign up, sign in, forgot and reset password, sign out, who am I,
  delete my account, consent, save and fetch a record (sync), export, push, the Apple and
  Google purchase checks, admin tools, and on the branch only: checkout, Manage billing, the
  Stripe webhook, and the voice.
- No table for a practitioner being granted sight of a person. That is not built anywhere.
- Server tests: 72 passed, 0 failed, run here today.

**What is actually live, from GitHub's own logs, not from the green tick.**
- Live: the `main` branch's server, published 30 September 21:07 UTC (run `36385561644`,
  attempt 9, Worker version `9ac30b3d`), with database steps `0001` to `0008` applied to the
  real database (id `70031c42...`, the one you pasted in at `ee73363` on 27 September). That
  version has accounts, sign in, sync, push, consent and export. Its settings say `BASE_PLAN`
  `"1"` and allow any website to call it (`ALLOWED_ORIGIN "*"`).
- Not live: everything since. The branch is 8 commits ahead of `main`: the Stripe work
  (`f1c0913`, `c9c3a1a`, `72a222b`, `23724ce`), the four price ids (`e536668`) and the voice
  (`f398143`). The server's own deploy job publishes only from `main`, so none of it has gone
  out. Merging the branch to `main` sends it out and applies database steps `0009` and `0010`.
- Two database step files share the number `0010` (`0010_stripe_lifecycle.sql`,
  `0010_voice.sql`). Cloudflare tracks them by full name so both should apply, but rename one
  before the merge so the order is never a question.
- Unknown from here: whether the secret keys (the mail key, the record sealing key, the Stripe
  keys) are set on the live Worker, and whether anyone has signed up. This sandbox's network
  refused the Worker's address (403 at the proxy), so I could not ask it.

**The difference, said plainly.** The database and its routes exist in code with passing
tests: yes. A real database is live and reachable on the internet: yes, since 30 September.
The app saves anyone's data into it: no. The app only signs people in there. Payment against
it: not possible yet, because the payment routes are not live.

## 6. The task list to MVP

Base: pass 3 of the funnel review's build list (`git show 097c945:REVIEW-funnel/FINAL-SPEC.md`,
section 7, rows F1 to F36), crossed against what landed since and against this count. Sizes
from `PLAN.md` K: small (S) is about 1 builder day, medium (M) 2 to 3, large (L) 5. "Blocks"
means it blocks the first paying stranger (the weighted count).

**Done since that list was written:** F4 (the mirror made true, checkpoints `cf6f592` to
`96355ba`) and F5 (the first release capped, `7acd9f2`). F7 was done (`b052556`) and is stale
again, so it moves into row 7 below. F12's voice half landed (`d297a9c`).

**Your steps** (minutes each, no engineering):

| # | What | Blocks |
|---|---|---|
| Y1 | Answer J0: when the distress reader fires, which of A, B or C (section 7) | yes |
| Y2 | In Cloudflare, delete the old preview links this branch published before `c46a872` (they still show the onboarding without the mirror fix and without any distress check) | yes |
| Y3 | Put the Stripe secret key and the webhook signing secret on the Worker, and switch on the customer portal (`STRIPE-SETUP.md`) | yes |
| Y4 | Say go to sending the server branch live (merge to `main`) | yes |
| Y5 | Confirm the mail key is set, so "forgot password" emails arrive | yes |
| Y6 | Listen to the sound, effects and the tension line spark | no |
| Y7 | Look at the practitioner page | no |
| Y8 | Discord webhook address and invite link, for the feedback tracker | no |
| Y9 | Point `atuned.world`, only after row 6 is in | yes |

**Engineering, in order.** Wave 0 first because it is about what strangers can already reach.

| # | Was | What | Who | Size | Depends on | Blocks |
|---|---|---|---|---|---|---|
| **Wave 0** | | **Make the live first ten minutes safe and true** | | | | |
| 1 | F1 | Distress reader, engine half: from `600e65e` and `c1cbc1a`; read the curly apostrophe; "not" steps a cue down instead of voiding it; three outcomes (ordinary, strong, needs a person now) with a gate. The crisis phrase test file stopped an agent's content filter tonight, so a person may need to write that one file | ai-director, devops-qa | M | nothing | yes |
| 2 | F6 | Voice self-check writes to its own temporary file, not a shared one | devops-qa | S | nothing | no, protects every row |
| 3 | J11 | Self-grant: the boundary ignores a pasted plan; flip `tests/plan-selfgrant.js` in the same change | systems-director | S | nothing | yes |
| 4 | J8 | The gift is honoured (a new person sees the whole reading while it lasts); "Unlock all sight" hidden behind `?dev=1` | systems-director, technical-director | S | nothing | yes |
| 5 | J9, P04 | Truth sweep: the "Improve the Models" switch and the four cause lines | narrative-director | S | nothing | yes |
| 6 | F2, P09 | When the reader fires, on every story path: stop before the save, no reading, no release, the care card with a person to call | narrative-director, uiux-architect | M | 1, Y1 | yes |
| 7 | F7 | Repack, and a check that fails when the packed stamp differs from `source.html` | technical-director | S | nothing | no |
| 8 | new | Archetype either-or dots to 44 pixels on a phone; the design gate checks tap size at 390 too | uiux-architect | S | nothing | no |
| **Wave 1** | | **Reading and shape** | | | | |
| 9 | F10, J10 | Reading coverage: the 7 empty sentences read something; a story stops pulling a whole seat in as guesses | ai-director | L | 1 | yes |
| 10 | F9, P03 | The record door | systems-director | M | nothing | no |
| 11 | F8 | Practice record shape, version 2 | systems-director, fullstack-td | M | nothing | no |
| 12 | F11 | The trace, and a no kept as a no (the trace graph view is in progress on `trace-graph-ui`) | systems-director | M | 9 | no |
| 13 | F12 | Release overhaul, first half: black stage, Field visible, done screen | fullstack-td, uiux-architect | M | 2 | no |
| **Wave 2** | | **First ten minutes finished, and pay** | | | | |
| 14 | P06, F35 | Server live: rename one `0010` file, merge to `main`, `BASE_PLAN` to 0, narrow `ALLOWED_ORIGIN` to the app's addresses | technical-director | M | Y3, Y4 | yes |
| 15 | new | One timed real sign up against the live server | devops-qa | S | 14, Y5 | yes |
| 16 | new | First real test-mode payment end to end; the buy page's button replaces "Checkout is not open yet" | technical-director | S | 14, 3 | yes |
| 17 | F13 | The journey record and the claim packet at sign up | systems-director | M | 10 | no |
| 18 | F15 | The chosen starting point kept as a fact; the gift's first patterns drawn from it | uiux-architect, fullstack-td | S | 17 | no |
| 19 | F16 | The one mirror, finished: yes, not me or correct, per place; a no writes a decline and takes the charge off | ai-director, uiux-architect | M | 6, 9, 12 | no |
| 20 | F17 | Release overhaul, second half: the "what changed" card | fullstack-td, narrative-director | S | 11, 12, 13, 17 | no |
| 21 | F18 | The cutover: Ritual and Accountability write through one practice record | fullstack-td, devops-qa | L | 11, 17, 12 | no |
| 22 | F19 | One proposed practice, five minutes or less, asked "when?" | fullstack-td | S | 20, 21 | no |
| 23 | F20 | The front door: the landing page opens the onboarding in the app | technical-director | M | 6, 19 | yes |
| 24 | F21 | Carry a quiz record without a file | technical-director | M | 23, Y9 | no |
| 25 | F22 | Visual-fail step 1: one right column host per page, the practitioner's folded in | uiux-architect, technical-director | M | 2, your go on the visual-fail pictures | no |
| 26 | new | Tutorial runs after the onboarding as aftercare, not instead of it | uiux-architect | S | nothing | no |
| 27 | P08 | Privacy table and its gate | devops-qa | M | 10 | no |
| 28 | P20 | Forget: side stores and single entry delete | systems-director | M | 10 | no |
| 29 | P21 | Encrypted export and restore | systems-director | M | 10 | no |
| 30 | new | The 25 pattern referral | systems-director | M | 16 | no |
| 31 | F36 | Release candidate: every gate on the merged tree, repack, stamps equal | devops-qa | M | everything above | yes |

**Your round QA adds, already moving** (in progress, not landed; each branch has 0 commits
past `f2fd8ff` at the time of this count, so check them there):
- Daily summary on screen: branch `daily-summary-ui`.
- Trace graph view: branch `trace-graph-ui`.
- Every worked example reading as tier four: branch `personas-tier-four` (a new
  `tests/personas-tier.js`, uncommitted).
- Feedback tracker: branch `feedback-tracker` (uncommitted edits to `engine/outbox.js`,
  `engine/export.js`, `ui/account.js`).
- The Character page rebuild: the merge is mid-way on branch `char-torus-merge2`, waiting on
  the rewrite of `tests/functional.js`'s Character section; the reviewed work is `5dcb45d`.
- The achievements TDD review: no branch named to me.

**Size, honestly.** 31 rows: 12 small, 17 medium, 2 large. About 56 to 73 builder days. The
longest chain is rows 1, 9, 12, 19, 23, 31, about 17 working days on its own, so with four
builders in parallel plan on 4 to 5 weeks, not less. Your nine steps are under two hours in
total and four of them (Y1, Y3, Y4, Y5) sit on the critical path.

**Not doing for MVP, and why.**
- F23 to F33, the 90 days (one Next, the Summary page rebuild, the week and month summaries,
  suggestions that read evidence, the Field showing before and after): they make day 2 to day 90
  worth coming back for, and none of them is needed for a stranger to start, pay and be safe.
  Your round QA question "can we push people through 90 days?" is answered: not yet, and this
  is the list that does it.
- Sync, push, delete from the server, and real practitioner grants: after MVP (`PLAN.md` K,
  L3 and L4). Grants also need your ruling on a second network route.
- Spec part two, identity across devices, any funnel event sent off the device: as pass 3.
- The outside clinician and counsel review: you said "not now". It stays a public launch gate in
  `PLAN.md` K and in the weighted count, so it is listed, not dropped.

## 7. Needs a ruling

One, and it is the one already put to you (`WAITING-ON-YOU.md`, J0). It changes what row 6
builds.

**When the distress reader thinks a first story is a crisis, what does the product do?** The
reader will miss people: the old draft caught 5 of 18 crisis phrases it had never seen.
- **A. Ship a best-effort first version now.** It stops before the reading, says plainly it may
  have misread, and shows the care card with a person to call. Cost: the words go out without a
  clinician's sign-off. Row 6 starts the day row 1 lands.
- **B. Name a person who designs the response first.** Cost: rows 6, 19, 23 and 24 and the
  domain wait for that person.
- **C. Keep the domain dark until a clinician has reviewed it.** Cost: the same as B, with no
  date.

Row 1 is built either way, since it shows nothing to a person.

## 8. Gates run for this count

All from the repo root on HEAD `f2fd8ff`, against the committed `source.html` and `engine.js`,
one at a time, with `NODE_PATH=/opt/node22/lib/node_modules`.

GATE_TABLE

Not run: `node tools/monitor.js` and `tools/equiv.py`, because nothing changed; `check.py
--objections`, because no words changed.

## 9. What changed in this file's own method

- The table and scoring are the second count's. Two rows were added because you asked for them
  by name tonight; the comparable number on the old 32 rows is given beside the new one.
- One row went down (phone widths) because a defect came in. One row is a correction (the
  server has been live since 30 September; the second count said it was not deployed).
- The distress draft is not counted, as instructed: it has never been built into the app or run.
