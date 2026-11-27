# The golden path, walked by hand. 31 October 2026

MOB. Sam, DevOps and QA. A verification round: nothing was edited, committed
or pushed. The owner asked tonight: "We need the funnel, the quiz, the summary
from the quiz, and the create account [checked]."

## The build that was walked

- Branch `journal-pure-voice` at `30d179e3`, the same commit as `origin/main`
  when fetched.
- Built fresh: `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh`.
  The only bytes the build changed in the tree were the build stamps in
  `source.html` and `atuned-packed.html` (now `v2731 30d179e3 2026-10-31 16:37`).
  `source.html` md5 `85a3e12943cfa3a5c5321d1006b8172c`;
  `funnel/dist/atuned-quiz.html` md5 `058e7711d5f200b5bcffd82877429f59`;
  `funnel/dist/atuned-funnel.html` md5 `704503d16ef8afd1dcc5637e37e128a2`.
- **Another seat was working in this same checkout during the round.** At
  16:52 UTC it changed `atuned_src/ui/account.js`, rebuilt `source.html` over
  mine (md5 `ae428159...`), staged it, and committed `578aa1a7` on this
  branch. Every gate below that finished before 16:52 ran on my build. The
  hand walk, `onboarding2` and the alpha-journey form were then run again on
  a private clone of `30d179e3` built fresh (`source.html` md5
  `52bba70d58ef4a137f01745639e4d7c2`, differing from mine only in the build
  time stamp; the funnel pages byte for byte the same), and every figure and
  screenshot here is from that clean run. Nothing of the other seat's work
  was touched.
- Served on 127.0.0.1 in the exact layout `.github/workflows/deploy.yml`
  publishes (lines 654 to 663): the funnel as `index.html`, the quiz as
  `atuned-quiz.html`, `source.html` as `atuned.html`.

## What could not be walked, and why

- **The live site and the live server.** This sandbox's egress proxy refuses
  `atuned.world` and `atuned-api.lance-o-powell.workers.dev` (CONNECT 403), so
  nothing here says what production serves tonight. And the Worker allows one
  origin, atuned.world, so a local page could not have signed up against it
  even with egress. No real account was made on the real server.
- **So the account step ran against a fake Worker** written for this walk from
  the contract in `atuned_src/ui/auth.js` (sign up, `/v1/me`, the first visit
  session, attach), separate from the one in `tests/golden.js` so the two
  cannot share a bug. The app's own seam, `AUTH_API` ("a var so a gate can
  point it at a stub", `ui/auth.js:37`), was pointed at it. Every other host
  was cut and counted: none was reached.

## The reproduction

From the repo root, after the three builds:

    NODE_PATH=<playwright install> node reviews/funnel-golden-path-2026-10-31/walk.js 1600 1000 /tmp/walk-1600 .
    NODE_PATH=<playwright install> node reviews/funnel-golden-path-2026-10-31/walk.js 390 844 /tmp/walk-390 .

It presses what a person presses: Take quiz, Start, the body signal (Chest,
Tightens), a hundred answers weighted to the middle, Keep reading through all
five layers one at a time, Write a story (a real one), Continue to my record,
Open the app with my record, then email, password and Create account. 390 runs
as a phone (touch, mobile viewport). Screenshots, the walk logs and the text of
both readings are in `reviews/funnel-golden-path-2026-10-31/`.

**The tool was checked first, and it lied once.** The dead control probe
passed its known case at the top of the page, then at 1600 read all six
"Name the feeling" chips as live and at 390 read four of them as live. The
landing snaps between frames on its own scroll, so a press read while the
snap was still settling counted the snap as the press. Second cut: the
scroll settles before the press, only markup and address count, and the
known dead and live buttons are checked again mid page inside a snapped
frame. On the second cut all six read dead at both widths on both runs, which
matches the source (below) and a by-hand press that reads `aria-pressed` and
the status line directly (`feel-before-*.png`, `feel-after-grief-*.png`).

**And it is still flaky at 390, which is a defect in the tool, named here.**
On one of the two second-cut runs at 390 its known dead button, mid page,
read as live. A false live can only hide a dead button, never invent one, so
the six dead chips stand (they are also proven by the source and by hand).
What it does mean is that "the other 23 landing buttons are live" is proven
at 1600, where both known cases held on both runs, and is not proven at 390.
The likely cause is the landing's own frame classes changing as the scroll
settles, which this probe still counts as markup; the next cut should strip
class changes outside the pressed control.

## Results, per step, both widths

| Step | 1600 | 390 | Verdict |
|---|---|---|---|
| 1. Funnel landing and quiz, to a reading | quiz completes 100 of 100, no page error, no broken image, no sideways scroll, every link resolves | same | **FAIL**, one defect: six dead buttons on the landing (F1) |
| 2. The quiz's own reading | coherent, five layers each with real text, CQ is the engine's own, no undefined or NaN | same | **FAIL** on the house percent rule (F2); otherwise coherent |
| 3. Create account, carried into the app | made, signed in, lands on Summary once, laws and CQ carried, reload holds, second open goes where they left off | same | **PASS** against the fake Worker, one defect on what Summary calls the person (F3) |
| 4. Existing gates | see below | see below | they confirm 3, and none of them holds F1, F2 or F3 |

The walk's own tally on the clean build: 1600 read 45 passed, 3 failed; 390
read 44 passed, 4 failed. At both widths three failures are F1 and the two
halves of F2. The fourth, at 390 only, is the probe's own known case (below).

## Findings, ready to hand to a build seat

### F1. The six "Name the feeling" buttons on the landing do nothing. Both widths.

- **Where.** `funnel/index.html` lines 642 to 652, beat 02, the section
  `#name`: Stress, Anger, Fear, Overwhelm, Grief, Tension, and the status line
  `<p id="named">` under them.
- **What I did.** Opened the landing, scrolled to "Name the feeling", pressed
  Grief (and each of the others, each on a fresh load).
- **What I expected.** What the section's own comment promises: "A press names
  the point: it takes a ring, the house's mark for a thing that is held, its
  shake halves and it pulses once." The button reads pressed and the status
  line says the word back.
- **What happened.** Nothing. `aria-pressed` stays `false`, `#named` stays
  empty, the point does not change. Screenshots `feel-before-390.png`,
  `feel-after-grief-390.png` and the same pair at 1600.
- **Cause.** No script on the page reads `data-f` or writes `#named` or
  `SG.named`; `grep` finds no handler. The handler was written in `61a44ed7`
  (3 October, Round RD, "beat 02, naming", `feelBtns` setting `SG.named` and
  calling `sigPulse()`) and is in no build on main since the merges of
  4 October: neither parent of merge `0c24409e` carries it. The canvas still
  reads `SG.named` (the ring, the halved shake at lines 1365 to 1411), so only
  the setter is missing.
- **Why no gate saw it.** `tests/funnel.js` measures every landing control's
  size (270 controls) and never presses one.
- **The fix, for whoever builds it.** Restore the handler from
  `git show 61a44ed7:funnel/index.html` lines 1415 to 1427, against today's
  `SG` and `sigPulse`, and add a press check to `tests/funnel.js` that fails on
  today's build first.

### F2. The quiz's reading still prints bare figures, where the app prints percent.

- **What I saw.** The quiz says "51" beside "Even". The app, one press later,
  says "51%" for the same reading. The five thin laws read 1.5, 2.5, 3.5, 3.8,
  3.8 under "Each law is scored out of ten", and the seven seats read 3.3, 2.7,
  1.7, 2.1, 1.8, 1.6, 2.8 under "Average load per seat, out of ten".
  Screenshots `03-reading-layer1-*.png`, `03-reading-layer2-*.png`,
  `03-reading-layer4-*.png`.
- **The rule it breaks.** `HANDOFF-2026-10-15/PERCENT-FRAMEWORK-2026-10-16.md`,
  the owner's words: "Instead of 0.0, site wide, we need to convert those
  numbers into percent... If it says 6.2, then we should change that to
  percent." Rule 6: CQ prints as N% everywhere. The registry names
  `funnel/quiz.html` as a printer of `cq`, `law` and `weight`.
- **Cause.** Phase 2 slice 6, "The funnel, `funnel/quiz.html`,
  `funnel/about.html`" (`PERCENT-PHASE-2-2026-10-17.md`), was never built.
  `quiz.html` has no `fmtPct` call; it prints `Math.round(r.CQ)` (line 711),
  `l.v.toFixed(1)` (line 856) and `x.v.toFixed(1)` (line 769). `fmtPct` is in
  the engine the quiz already inlines: in the page, `fmtPct('cq', 51.48)`
  answers `51%`.
- **What it costs the person.** Two numbers for one reading a press apart,
  and the funnel is the first screen a stranger reads.
- **Otherwise the reading is coherent.** Each of the five layers carries real
  text (1600: 652, 209, 2538, 1179 and 613 characters); no undefined, NaN,
  null or `[object` anywhere; the figure is the engine's own CQ (51.48,
  rounded); it is explained beside it ("That is your coherence. One hundred
  is every law closed..."), with its tier word and what the tier means; the
  108 somatic and 4 field anchor structure is said before any count.

### F3. Summary calls a funnel arrival "Web".

- **What I saw.** After Create account the person lands on Summary, and the
  first thing on it, in the largest type on the page, under "Who this is", is
  the name **Web**. Screenshots `05-summary-1600.png`, `05-summary-390.png`.
- **Cause.** The quiz names the record it hands over `Web reading`
  (`funnel/quiz.html:542`, `blankProfile('Web reading')`). Summary prints the
  first word of the profile's name as the person's name
  (`atuned_src/ui/summary.js:912`, `sumNameBlock`, `nm.split(/\s+/)[0]`), and
  `sumRealName` only treats `You` as "not somebody". So `Web reading` reads as
  a person called Web.
- **What it costs the person.** The first screen after the funnel greets a
  stranger by a name they never gave. This is exactly the screen the 9 October
  ruling chose for the first arrival.
- **Why no gate saw it.** `tests/golden.js` station 4 holds that the account
  page names the reading open (`Web reading`), and `tests/gift.js` and
  `tests/landing.js` read the plate's figure and the gift line, not the name.
- **Ways it could go** (not chosen here): the plate treats the quiz's record
  name as no name, the way it treats `You`; or the quiz hands over a record
  with no name and the label lives elsewhere; or the door asks for a first
  name. The first is the smallest and changes one function.

### Observations, not defects

- **The story written in the quiz does not reach the app.** By design and said
  on the door: "Your story is not in it." Worth knowing if "quiz answers carried
  over" was taken to include the story. The 21 laws and the coherence do carry,
  exactly.
- **The quiz's reader named nothing exact on a plain story.** "My chest went
  tight and my jaw locked and I said nothing... I felt heavy in my stomach"
  came back as "tight and said nothing landed at the heart and throat seats
  without naming what is there". Chest, jaw, stomach and heavy were not
  matched. That is the reader's word list, honestly reported, not a fault in
  the funnel.
- **The quiz names the first release by its address, the app by its feeling.**
  The quiz says "a release starts at Victimhood, at the Coccygeal Plexus"; the
  app's Summary says "Release this first: Sadness". The app's choice is ruled
  (P0-3 of the 23 October inference audit, at `ui/summary.js:1094`), so the two
  screens a press apart give the same thing two names.
- **The door the quiz opens is titled "Log in"**, with Log in as the primary
  button and Create account second, for a person who has no account yet. It
  works; it is the wrong way round for this arrival.

## The gates, read off their own runs on this build

Run from the repo root on the fresh build, one after another, while the walk
ran beside them. Every one is at or above its floor in `tests/floors.json`.

| Gate | What it actually covers on this path | Result | Floor |
|---|---|---|---|
| `tests/golden.js` at 1600 | landing door, quiz by its own buttons (signal skipped, Show the whole reading), the link, Create account at the door, the reading on Summary and the account, first release, CQ, pay, cancel, delete, onboarding door, the downloaded copy | 146 passed, 0 failed, 1 expected red | 146, expected red at most 1 |
| `tests/golden.js` at 390 (`W=390 H=844`) | the same | 146 passed, 0 failed, 1 expected red | 146 |
| `tests/funnel.js` | every funnel page renders at both widths, no network, control sizes, links, the quiz to a reading | 681 passed, 0 failed | 669 |
| `tests/recordlink.js` | the record in the link, refusals, the packed build | 60 passed, 0 failed | 60 |
| `tests/landing.js` | where the app opens, the first landing on Summary, where they left off | 20 passed, 0 failed | 20 |
| `tests/gift.js` | a new person from the quiz's link, the gift line, nothing locked | 64 passed, 0 failed | 64 |
| `tests/onboarding2.js` | the other door: onboarding through Guest, not the quiz door | 289 passed, 0 failed (clean build) | 289 |
| `ATUNED_ALPHA_QUIZ_ONLY=1 tests/golden.js` | the required alpha-journey form | 61 passed, 0 failed, 0 expected red (clean build) | 61, expected red at most 0 |

- The one expected red in golden is E2: "the app reads its first visit back
  from the server (authFunnelRead has no caller). The person sees: a second
  device, or this browser after its storage is cleared, starts the first visit
  again from the beginning." Known since 9 October and held by its ceiling.
- **They confirm the hand walk on step 3** (account, carry over, the first
  landing) and on the quiz reaching a reading.
- **None of them holds F1, F2 or F3.** funnel.js measures the landing's
  controls without pressing them; nothing reads the quiz's figures against the
  percent rule; nothing reads the name on the Summary plate. A green run of
  every gate above is a build with all three in it.
- `tests/record.js` is not on this path: it holds the words on the record
  surfaces against a seeded profile, and never opens the funnel.

## Signed off or not

**Not signed off.** The path works end to end: a stranger can go from the
landing through a hundred questions to a reading, into the app, make an
account and land on their own reading, at both widths, with no errors. But it
is not "done is zero bugs": the landing has six buttons that do nothing (F1),
the quiz prints its reading in a different form from the app it hands to (F2),
and the first screen after the account calls the person "Web" (F3). And the
account step is proven against the contract, not against the live server,
which nothing in this sandbox can reach.
