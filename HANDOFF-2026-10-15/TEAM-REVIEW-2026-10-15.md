# The team's review of the owner's handshake, 15 October 2026

Fourteen seats read `ORIENTATION.md` and `HANDSHAKE-OWNER-2026-10-15.md`,
then strategised the next flow for their discipline, read only, with no
browser gate run (the audit held the lock) and nothing pushed. All
fourteen reported. Every seat was asked for a finding, its cause, the
move, the cost, and what the person sees change, P0 and P1 only, naming
which application it meant. MOB is the live one at atuned.world. Reboot-OS
atuned is the second.

## Where the seats agree, which is the next flow

1. **One application is the alpha, and it is MOB.** The project manager,
   the technical director, DevOps, the creative director and the brand
   director all land there: it is live, it was verified live on 11 October,
   and it is the only one with a walk from quiz to cancelling under test.
   Reboot-OS keeps the server and gives up its publish. Its application
   stays unpublished. PR 54 is finished to its own gate and left a draft for
   the owner's word. The owner's copy rules in the handshake apply to MOB's
   words too. This is the team's default if the owner does not rule.
2. **Stop the publisher collision before the budget comes back.** Turn off
   the Reboot-OS `web` workflow (an Actions page switch, no minutes), land
   only the `web.yml` part of Reboot-OS PR 47, and give Reboot-OS a
   Cloudflare token with Workers and D1 rights only, so the repository
   cannot publish to Pages even by hand. Nobody pushes to Reboot-OS main
   until then. Re-running the failed 10 October publish would put a five day
   old second application over atuned.world.
3. **The budget, and making it last.** The owner raises the Actions
   spending limit. The team halves the spend: `gate.yml` runs on pushes to
   main only, MOB's fourteen report-only jobs run on main only, and
   pull request runs cancel the one before them.
4. **"Diagnostic" is on screen in both applications, and the word on screen
   is "reading".** MOB prints "From your diagnostic" and "Not answered in
   the diagnostic" (`atuned_src/ui/drills.js` 276 and 278). Reboot-OS prints
   it as a button and as the title of any step a person adds
   (`atuned/src/43_what-surfaced.js` 227 and 235) and as a tools tile
   "Diagnostics" (`44_polarity.js` 172). Saved keys named `Diagnostic` stay,
   because records use them; only the display name changes. The gate
   `tests/copy.js` gets a rule that fails on "diagnos" in rendered copy, so
   the ruling stops being a sentence nobody checks.
5. **Numbers come off the daily surfaces and sit one tap down, labelled
   "how this was worked out".** The owner's 14 October ruling is later than
   round PQ ("just a number"), so it wins. In MOB the coherence figure prints
   on at least five surfaces (`summary.js` 902, `wheel.js` 506, `ui.js`
   1044, `analytics.js` 696, `panels.js` 1177), and the Field's key prints
   percent signs against the no percent ruling. The ring keeps drawing the
   figure; the value becomes the band word plus how much has been measured.
   The marketing seat's caution stands: level 7 and 8 buyers buy a number
   they can test, so the arithmetic stays open one tap down and out of any
   sweep. A state is a physical word (loaded, taut, slack, clear), never a
   mood.
6. **Reboot-OS PR 54 has real defects beyond its copy.** Four broken strings
   from the sweep stop the whole application parsing (fixed locally on 15
   October: `32_story.js` 611, `34_calibration.js` 498,
   `40_the-archetypes.js` 545, `47_the-five-units-as-svg.js` 174). "Settled
   overnight" prints "eased by 0" on every row because `a.d` is never set
   (the field is `delta`), and the raw delta prints as "-12" elsewhere
   (`33_soul-bux.js` 560, `52_reading-sheets.js` 73): print a word, never
   the number, and never rename `a.d` to `a.delta`, which would print the
   leak. The overlay colour read (`49_the-overlays.js` 19 reads `o.col`, the
   data says `c`) is real but harmless today, and the literal fix would turn
   a name the alarm red; set the three overlays to ink. The first open
   invents a history (`43_what-surfaced.js` 150 to 156 seed a week and a
   protocol; `loadICP` resets neither), so a stranger is praised for follow
   through. `build.py` swallows its own exit code (line 142). A nerve row
   prints a colour code as a sentence (`50_the-double-bind.js` 239), the
   nerve badge prints the raw weight (line 212), and axis state words wear
   the alarm red and the good green (lines 121 and 141).
7. **The privacy page must say what the first visit sends.** It promises
   nothing about use is reported; the app sends four checkpoints before any
   sign in. One paragraph: a random id, the ground, two done marks, two ids,
   no story text, why, how long, how to delete. Every count below waits on
   it.
8. **KPIs, honestly.** Countable today from the server: ground chosen,
   tutorial done, first release, verification, joined to an account.
   Ready but reading zero: first paid month, first cancel (Stripe is not
   set up). Not countable: landing to quiz, quiz to app (no field says
   which door), and day 1, 7, 30 return, which must not be counted, because
   "nothing about how you use the app is reported to us" is a promise. The
   alpha retention number is the second month's renewal, which Stripe
   sends. The move: one read-only totals query, run by hand weekly, no
   dashboard, no new event.
9. **Before checkout opens.** The tiers panel inside the app is the page
   between the reading and the card, not `buy.html`. It needs an unticked
   recurring charge box and the cancel and refund words the terms already
   promise (and California's renewal law requires). Sell a tier on what it
   shows, not on amounts. While the gift lasts, show the whole chain.
10. **The loop's return.** A release does not count as practice
    (`engine/ladder.js` `pracDays` only counts finished rituals), so a week
    of daily releases reads as a streak of zero. Save one finished ritual
    entry on a release. Day two gets a reason when the release ends by
    asking for one goal for tomorrow (`aim_set` exists). The streak never
    goes on the mirror as the reason to open the app.
11. **Done, this week, with CI out.** One evidence folder per head commit:
    a clean worktree, every `deploy.yml` command in order, every log saved,
    `tools/floors.js` over the folder, each browser gate three times behind
    the lock, the commit and the md5. Pin `runs-on: ubuntu-24.04` before
    the 19 October image change. The committed `engine.js` on main crashes
    its own gate (`E.storyHits is not a function`): the counts come only
    from a fresh build, and the committed products are due a regeneration.

## What the seats would stop this week

- Any sweep that strips a number or the word "Diagnostic" without putting
  something in its place (narrative, creative). In MOB a dash means not read
  yet; in Reboot-OS `Diagnostic` is a stored key.
- Numbers turned into feelings (brand). Calm, balanced, at peace are not
  states.
- Building a second "Today, your mirror" in MOB. It has one, `daily.js`, in
  the right rail (UX).
- Renaming `a.d` to `a.delta`, or adding a bare caller to `authFunnelRead`
  to make a gap pass (fullstack).
- Wiring an "app opened" event to measure return (marketing). It breaks the
  promise.
- Opening checkout before the renewal box and the refund words ship (sales).
- Any push or merge to Reboot-OS main until the token is swapped (DevOps).
- Opening new pull requests. Twenty six are open and none can run (PM).
- The literal overlay colour patch (art): it turns nothing into a red alarm.
- Putting the streak on the mirror (game).

## The project manager's queue

| # | App | What | Priority | Who | Hrs | Unblocks | When |
|---|---|---|---|---|---|---|---|
| 1 | Both | Raise the GitHub Actions spending limit on the account that owns `rebootos-sourcce`. Same visit: turn MOB Pages off and require `gates-pass` | P0 | Owner | 0.25 | every merge, deploy and live check | is the budget |
| 2 | Reboot-OS | Delete or repoint the `atuned-os` Cloudflare build. It fails on every commit, so no Reboot-OS pull request can ever be green | P0 | Owner | 0.25 | every Reboot-OS merge | now |
| 3 | Reboot-OS | Nobody pushes to main until PR 47 lands | P0 | Team | 0 | atuned.world keeps serving MOB | now |
| 4 | Reboot-OS | PR 47 removes the Pages publish and adds a guard. The first Reboot-OS merge | P0 | Team | 1 | ends the publisher collision | budget |
| 5 | Reboot-OS | PR 54 blocks 2 to 5, run locally: rebuild, "Diagnostic" labels, the overlay colour, the raw number in "eased by", smoke, browser pictures | P0 | Team | 11 | block 6 | now |
| 6 | MOB | Live proof of the first visit path (Gate D in the evidence matrix) | P0 | Team | 4 | alpha sign off | budget |
| 7 | Reboot-OS | PR 54 block 6: full gate green, PR stays a draft | P0 | Team, then his word | 1 | its merge | budget |
| 8 | MOB | Golden expected red ceiling: main names two, the ceiling allowed five. Set to the count the run prints | P1 | Team | 0.5 | new gaps cannot hide | done 15 Oct in this folder's PR |
| 9 | MOB | Golden gap E3f: a downloaded copy blames the person's connection. Say the true reason | P1 | Team | 2 | one gap closed | now |
| 10 | MOB | PR 60 (importing one record twice makes three profiles) and PR 65 (delete confirmation) | P1 | Team | 4 | two alpha bugs | now |
| 11 | MOB | PR 70, the downloadable alpha build | P1 | Team | 2 | the file he is sent | budget |
| 12 | Reboot-OS, then MOB | PR 34, then 35 onto it, then MOB 68. A push to Reboot-OS main applies migrations and deploys the server | P1 | Team | 8 | 24 month retention and the delete receipt | budget |
| 13 | MOB | Re-check the voice on the live site | P1 | Team, his ears | 0.5 | voice proof | budget |
| 14 | Both | Close by reading, keep what is true in `TASKS.md`: MOB 53, 63, 64, 67, 69, 73, 74; Reboot-OS 45 | P2 | Team | 3 | eight fewer open | docs |
| 15 | Both | Close without merging: MOB 52 (types counts into a readme), MOB 18 (replaced by PR 25), Reboot-OS 2 (voice already ported) | P2 | Team | 1 | three fewer open | docs |
| 16 | MOB | Golden gap E2: the app never reads the first visit back, so a cleared browser starts over. Needs a server lookup by account | P2 | Team | 6 | second device | now |
| 17 | Both | Gift banks: six natures with 100 approved patterns each, Reboot-OS 48, migrations 0016 to 0018 (he applies them). MOB 66 merges last | P2 | Team drafts, owner approves | 40+ | the 14 October gift rule | budget |
| 18 | Both | Stripe: four tiers, keys, webhook, portal. Checkout stays closed until then | P2 | Owner, then team | 4 | paid tiers | now |
| 19 | Reboot-OS | PR 53 (least privilege CI), 49 (canon allowlist), 46 (reduced motion) | P2 | Team | 4 | not needed for alpha | budget |
| 20 | Reboot-OS | PR 52 (geometry crosswalk) and 36 (profile schema map): read, close if docs only | P3 | Team | 2 | not needed for alpha | docs |

**The one decision for the owner: which application is the alpha.** The
team's default is MOB, for the reasons in point 1 above. If he picks
Reboot-OS instead, MOB loses its publish and the second application needs
its own proof for the first visit, the voice, payment and delete, with all
of its release gates A to E still open.

## Questions for the owner

Every seat answered "none". Row 1 and row 2 are steps for him, not
questions.

---

## The seats' reports, as returned

### Creative director

**What the handshake asks of my seat**
- Hold the copy line on Reboot-OS PR 54, the second application. That means no raw scores, totals or charges, no "Diagnostic" anywhere a person can read it, nonclinical words, and "Today, your mirror" as the daily surface.
- Review that flow as it renders before anyone calls Block 3 closed. Two facts first. The audit file every seat is sent to, `AUDIT-2026-10-15.md`, is not in the folder. PR 54's head is `387a4e5`, two commits past the `d38d2f2` the handshake names.

Who I checked this against: the six ICPs in `atuned_src/engine/data/people.js` (not `ui/personas.js`) and the 9 October rulings. Sofia is a somatic practitioner, and she cannot use a tool that calls itself diagnostic. Diane and James read any number as a grade. Derek reads a zero as "nothing happened".

**Next flow**

1. P0, MOB (the live app at atuned.world)
- Finding: the live law panel prints "From your diagnostic", "Your three answers sit 3.6 apart" and "it defaults to 5.0".
- Cause: on 9 October the team ruled that "Diagnostic" leaves everything a person reads, but nothing checks for it. Neither `tests/copy.js` nor the voice checker fails on the word.
- Move: in `atuned_src/ui/drills.js`, lines 276 to 279 (`lawDrillHtml`), say "From your answers" and "Not answered yet". Say the spread as a word (close, apart, far apart) and drop the decimals. Add a rule to `tests/copy.js` that fails on "diagnos" or on a decimal in what any surface shows.
- Cost: one file and one rule. The rule will probably find more. Until the Actions budget is raised, only local runs count as proof.
- What the person sees change: a reading in plain words, not a clinical label next to a number.

2. P0, Reboot-OS PR 54
- Finding: "Settled overnight" says "eased by 0" under every release, which is false.
- Cause: `atuned/src/43_what-surfaced.js:19` reads `a.d`, but the cascade stores the amount as `delta` (`33_soul-bux.js:535`). In the same file, line 561 prints that delta raw ("-12") under "WHILE YOU WERE AWAY".
- Move: drop the number from both lines and say "eased" or "settled". Rebuild, then run `build.py --check`.
- Cost: two lines, and both build files rebuilt.
- What the person sees change: the mirror stops saying a release moved nothing, and stops showing a raw charge.

3. P1, Reboot-OS PR 54
- Finding: the "Diagnostic" sweep only went one line deep. The tools grid still shows a tile named "Diagnostics" with "triangulate the number" and "accurate to N points". The Structure tile prints a count against a total, "N / 33".
- Cause: commit `ec97e2f` changed the one line a text search found. Nothing checks what actually renders.
- Move: in `atuned/src/44_polarity.js`, rename only the visible name at line 172 (the internal key `diag` stays). Remove the "/ 33" from the tile stats near line 228. Add the same check on what renders to `atuned/test/smoke.py`.
- Cost: under ten lines plus one rule.
- What the person sees change: no clinical label and no scoreboard on the tools grid.

One tie broken: the handshake writes the heading "TODAY · YOUR MIRROR", and the house rule is sentence case. It becomes "Today, your mirror" (`32_story.js:807`). That is cosmetic, so it waits.

**What I would stop this week**
- Writing a copy ruling down as a sentence with no check behind it. That is why the live app still says "diagnostic" six days after it was ruled out, and why PR 54's sweep stopped after one line.

**Question for the owner:** none.

### Technical director

**What the handshake asks of my seat (Reboot-OS)**
- Block 2: prove the build matches its source by running the check and recording the command, the exit code and the output. Reading the code does not count as a pass.
- Block 5: show in a real browser that the copy changes did not change how anything works. A successful deploy does not prove that.

**The three claims (Reboot-OS PR 54. The live head is 387a4e5, not d38d2f2.)**
- **Overlay colour: real.** Lines 6, 8 and 10 of `49_the-overlays.js` set `c:`, but line 19 reads `o.col`, so every card gets `--c:undefined`. The three system names and the focus border on the input lose their accent colour and show plain text colour instead. Nothing else breaks. The fix is to change `o.col` to `o.c`. It costs nothing per frame.
- **`a.d`: a real bug, but not the one reported.** Nothing ever sets `d`. The settled records hold `{id,b,delta,due,from,q}` (`33_soul-bux.js:278`). So line 19 of `43_what-surfaced.js` prints "eased by 0" on every row, which is false. The raw number the review was worried about is printed somewhere else: a bare `c.delta` under "While you were away" (`33_soul-bux.js:560` and `52_reading-sheets.js:73`). The banned text list in `build.py` catches neither.
- **"Diagnostic": partly real.** Line 227 prints `t[0]` as a button label, and line 235 sets `label:type`, so any step a person adds is titled "Diagnostic". The `refs` key (line 232) and `type:'Diagnostic'` (lines 153 and 257) are saved keys that sync at `42b_cloud.js:117`. Keep those keys and add a separate display name.

**Next flow for my discipline**
1. **P0, both applications.** Finding: two workflows publish to the same place. Reboot-OS `web.yml` publishes to Cloudflare Pages project "atuned", branch main, on any push to main that changes `atuned/build/atuned.html`, and PR 54 changes that file. MOB `deploy.yml` publishes to the same project and branch. Cause: MOB's ordering and its production read back only watch MOB's own deploys, so an overwrite from Reboot-OS goes unseen. Move: turn off the Reboot-OS "web" workflow now, on its Actions page or with one API call. That uses no runner minutes and works while the budget is out. Then merge PR 47. Cost: one call. The person sees: atuned.world keeps serving MOB `ed5eca3`.
2. **P1, Reboot-OS.** Finding: `build.py` exits 0 even when its copy check or its quick smoke test fails. Cause: line 142, `else: build()`, throws the result away. Move: change it to `sys.exit(build())`. Cost: one line. The person sees: the fix for the out of date build cannot be recorded as exit 0 while its smoke test is failing.
3. **P1, both.** Finding: the Actions budget will run out again the same way. Cause: Reboot-OS `gate.yml` runs on pushes to any branch and on pull requests, so every push to a PR branch runs the full smoke twice. MOB `deploy.yml` runs 30 jobs per PR push, 14 of them report-only jobs that cannot fail the run, and it never cancels outdated runs. Estimate (I did not read run times): 30 jobs at 2 to 4 billed minutes each is about 60 to 120 minutes per MOB push. Move: in `gate.yml`, limit push to `branches: [main]`. Run MOB's report-only jobs on main only. Add `concurrency` with `cancel-in-progress` for pull requests. The required gates stay as they are. Cost: roughly half the minutes on each repository.

**The one thing I would stop this week:** merging or re-running anything on Reboot-OS once the budget is raised, until move 1 is done. Re-running the failed 10 October publish, run 38020152941, would push a five day old Reboot-OS build over atuned.world.

**Question for the owner:** none.

### DevOps and QA

**What the handshake asks of my seat**
- Proof, not claims. Every block closes on a command, its exit code and its output. A retry or a Cloudflare green closes nothing. Anything blocked is reported as blocked, with the smallest thing that would unblock it.
- What I can produce here today, for Reboot-OS atuned (the second app), PR 54: Block 1, the diagnosis, not the closing run. Block 2, yes, and it exits 1 on the 7 byte drift. Block 3, the source half. Block 4, everything except smoke.py. Block 5, once the browser lock is free. Block 6, the full CI gate, cannot be done locally, so it reads "blocked".

**Next flow**

1. **P0. Reboot-OS atuned can still publish over MOB, live.** Finding: PR 47's guard exited 0 on a workflow that publishes to atuned with two spaces in "pages  deploy". Branch `claude/app-migration-decision-yx56cj` still has the old publish step, and a hand started run uses that branch's copy. Cause: the protection lives in files every branch copies, and the token has Pages rights it never uses. Move: before the budget goes up, the owner gives Reboot-OS a new Cloudflare token with only Workers Scripts and D1 edit rights, the two that server.yml names. Then land only PR 47's web.yml part, which takes 10 lines out. Do not land the whole PR: it adds 236 lines and clashes with PR 54's gate.yml. MOB side: no change while MOB is the publisher. Cost: ten minutes of the owner's time. What he sees: nothing changes, and that is the fix.

2. **P0. Rollback for MOB, live, today.** Finding: the written rollback (deploy.yml run by hand with rollback_ref) is an Actions job, so it cannot run until the budget lifts. Move: Cloudflare is the only route today. Go to dash.cloudflare.com, then Workers and Pages, atuned, Deployments. Pick the production row before ed5eca3, open its three dot menu, choose Rollback. Do the same for the Worker atuned-api. Caveats: I have not checked these steps myself, because this seat has no Cloudflare access. A rollback lasts only until the next publish from either repository.

3. **P1. Both apps: "done" this week means proven locally and waiting for CI.** Finding: MOB's committed engine.js at ed5eca3 crashes its own gate at tests/engine.js line 5165, "E.storyHits is not a function". The 5038 count only comes from a fresh build. Move, one evidence folder per head commit: start from a clean worktree; run every deploy.yml command in order and save each log into the folder; run `node tools/floors.js --dir FOLDER` with no gate named (it checks all 28 minimum pass counts plus the monitor, and a missing log fails; its self test passed 47 of 47, and it caught that crash); run each browser gate three times, behind the lock; record the commit and the md5 fingerprint. Reboot-OS has no minimum counts, so write down smoke.py's count. Also pin `runs-on: ubuntu-24.04`: run warnings say ubuntu-latest becomes Ubuntu 26 from 19 October, so the first red after the budget may be the new machine image, not the code.

**Stop:** no push or merge to Reboot-OS main until that token is swapped. Reboot-OS web.yml publishes the committed file with no gate in front of it, and PR 54's file is 7 bytes off its source. The moment the budget lifts, one push replaces MOB on atuned.world. The rollback that would undo it is also an Actions job.

**Question:** none. **Not signed off.** Engine: 5038 passed, 0 failed, 10 expected red, on the brief's fresh build. On the committed build it crashes. Functional, collide and design were not run by this seat, because the lock was held.

### Fullstack technical director

**What the handshake asks of my seat**
- Reboot-OS PR 54: check two suspected bugs, and sort every "Diagnostic" into words a person sees and internal keys. Change only the seen words.
- Make narrow fixes, rebuild both files, and prove it with real runs. Nothing merges. The GitHub Actions budget is used up, so local runs are the only proof.

**The three claims (Reboot-OS, PR 54 tree at 387a4e5)**
- **Colour mismatch: real, but cosmetic.** `49_the-overlays.js` lines 6, 8 and 10 set `c`, and line 19 reads `o.col`. So the card gets `--c:undefined`, and `.ovh b` (`10_style.css.html` line 2150) falls back to plain ink. The three system names lose their colour. P3.
- **Raw number from `a.d`: not real as stated.** `appliedReport` comes from `cascadeQ` (`33_soul-bux.js` line 550). Its entries carry `delta`, never `d` (line 535). So `43_what-surfaced.js` line 19 always prints "eased by 0": false, but not a raw score. Raw charges do show elsewhere, as `c.delta` (for example "-12"), at `33_soul-bux.js` line 560 and `52_reading-sheets.js` line 73. `#report` draws as the app starts (`53_nav.js` line 56).
- **"Diagnostic": real in two places.** Seen: the add step button (line 227 draws `STEPTYPES`, line 146), and the step's name after it is added (line 235 sets `label:type`, shown at line 214). Internal: line 153, line 257 and the `refs` key at line 232. "Diagnostic re-read" does not exist. Line 153 shows "Reading re-check".

**Next flow**
1. **Reboot-OS, P0, 2 hours.** Raw charges and "Diagnostic" appear in copy people see. Move: `renderReport` (line 560), `reportSheet` (line 73) and `surfacedHTML` (line 19) print a word for the state, never `delta`. Give `STEPTYPES` a third field holding the display name, and use it at lines 227 and 235. The keys stay as they are, because saved steps use them. The person sees "Root settled" instead of "-12", and no clinical word on the ritual.
2. **MOB, P1, 1 hour.** Golden check E3f: the downloaded file tells the person to check their connection when the server turns a file page away. Cause: `authWhy` (`ui/auth.js` line 474) reads every missing answer as a dropped connection. Move: when the page is not http or https, say that only the copy at atuned.world can make an account. `feedbackWhere` (line 431) already makes that check. Turn `golden.js` line 1105 into a pass.
3. **MOB, P1, 2 hours.** The "five expected red" count is out of date. E20 closed at `1d48f78`, and E1q and E19 at `ed5eca3`. The source has two left, E2 and E3f. `floors.json` still allowed 5. E2 cannot close inside MOB: `authFunnelRead` (line 192) needs a session id that a second device does not have; its no sign in path (line 196) leaves out the credential header the server requires; the server has no lookup by account; with profile sync off, it would bring back only the topic picked and the tutorial flag. Move: set the limit to the real count. Rewrite the check at line 968 to clear storage, sign in, and expect the first visit back.

**What I would stop this week:** renaming `a.d` to `a.delta` at Reboot-OS `43_what-surfaced.js` line 19. The handshake's wording invites that one word fix, and it would create the leak: "Root eased by -12". Adding a bare caller to `authFunnelRead` so MOB's E2 passes is the same trap.

**Question for the owner:** none.

### UI and UX architect

**What the handshake asks of my seat**
- Make "Today, your mirror" the daily surface. That means plain word states, the person's own evidence first, and no coherence (CQ), shadow (DQ) or depth (SQ) figures, weights or charges in the copy.
- On MOB `ed5eca3`, the live one, this does conflict with round PQ of 2 October ("Just a number"). The newer ruling wins. A search of the source finds the coherence figure on at least five surfaces, not three: the Summary plate (summary.js:902), the Field wheel centre (wheel.js:506), the rail ring (ui.js:1044), Analytics (analytics.js:696) and the profile sheet (panels.js:1177).

**Next flow**

1. **P0, MOB.** Finding: someone arriving from the quiz sees "62" in the largest ring on their first screen. Cause: the PQ ruling, plus the plus or minus 13 was cut off the tile (summary.js:1013). A bare 62 claims more than the instrument knows. Move: in `sumPlate`, the band and its state word already sit beside the ring (line 906). Take the digits out of the ring's label and put in a word for how much has been measured, taken from `accuracy(r)`. The arc stays. The figure and its range move into the core drill. Reboot-OS already does this with `cohWord` (46_the-readings-model-under-simulation-1183.js:112). Apply the same at wheel.js:506 and ui.js:1044. Cost: one helper, three call sites, and updated gate expectations. What the person sees: Angela reads "Coherent, early reading" rather than a grade. Derek and Sofia find the number one tap down. Nothing is hidden: a word that states its uncertainty is more accurate than 62 without its 13.
2. **P1, MOB.** Finding: MOB already has a mirror. `daily.js` places eight blocks written by the engine (showing up, in the way, changing, one thing to do). They stay silent on an empty record, and they sit in the right rail beside the full reading. Cause: placement F24, "the words to the side". Move: once today's summary is saved (`dlyToday`), `sumRender` shows those blocks first and folds the reading under them. Day one stays the reading. Cost: layout only, no new sentences. What the person sees: day three opens on today, not on day one again.
3. **P0, Reboot-OS.** Finding: the first open invents a history. `week` starts with three kept days, and `proto` starts with four steps, one marked done (43_what-surfaced.js:150-156). `loadICP` resets neither (34_calibration.js:291). So the mirror tells a stranger "Your recent actions show meaningful follow-through", because follow through works out to 75 (32_story.js:824). Move: start both empty, reset both in `loadICP`, and add a check in smoke.py. Cost: a few lines. What the person sees: "Nothing scheduled", and no praise they did not earn.

**First 60 seconds** (from reading the source, not from a rendered screen). MOB, blank profile: an empty Coherence ring, "Nothing has been read yet", and four doors. Nothing invented. Reboot-OS: onboarding, a dimmed dial, one door ("Start · 4 minutes"), then the invented week. The mirror is a view toggle inside Story that is off by default (32_story.js:164), with about 200 words on an empty record. Keep MOB's first minute. Borrow Reboot-OS's single door with its time stated.

**What I would measure first:** the MOB Summary for a quiz arrival, at 390 and 1600 wide. Count the raw figures and the choices on the first screen, then the words before the first button.

**Stop this week:** building a new "Today, your mirror" page in MOB from PR 54. MOB already has one. A second would be two words for one concept, on a screen where too many choices is already the standing problem.

**Question for the owner:** none.

### Narrative director

**What the handshake asks of my seat**
- Hold rendered copy to the owner's 14 October ruling: no raw scores, a state with its meaning beside it, nonclinical, no "journey", and every body place named as a model. ORIENTATION section 4 limits this to Reboot-OS atuned, but section 6 applies it to both. I apply it to both.
- Rule on "Diagnostic", and record how the two copy standards resolve.

**Collisions, and what wins**
- **Raw scores.** MOB (live) V22 ships "at a weight of 7.4", and round PQ kept "62" on Summary. The 14 October ruling is later, so it wins in both apps. The house method stays: the ring draws the figure and no number is printed (V18).
- **Nonclinical line versus MOB V12** (no reassurance nobody asked for). The handshake wins on where the line goes. The house wins on how it reads: say the source once, as a fact (W3), never as a denial.
- **Six distinctions versus seven buckets.** No collision. The buckets say what a string does, and the six say how sure it is. But MOB's bucket "Reading, what is true" claims too much. It becomes "what your answers and stories show".
- **Unpack every symbol.** Reboot-OS hides the system on its morning stack, and MOB V23 names it. V23 wins in both, because a hidden source reads as a measurement.
- **Agreed, with one fix each in Reboot-OS.** "108 in the body" sits only in a comment (30_lexicon line 497). Its standard says "body" where the owner corrected it to embody. It allows "--" as a dash.

**Diagnostic.** The word never renders in either app. The outward noun is "reading", as `funnel/about.html` already ruled. MOB: change CLAUDE.md line one to "A somatic instrument", because that line is where the refused heading came from. Reboot-OS: 43_what-surfaced.js line 227 draws STEPTYPES as buttons, so the button label becomes "Reading" and the stored key 'Diagnostic' stays.

**Next flow**
1. **P0, MOB.** Summary prints the coherence and shadow numbers. The shadow one sits under "shadow weight". Cause: round PQ came before the ruling. Move, in `atuned_src/ui/summary.js` lines 88, 101 and 902: take the number off the ring and make the band word the value. "shadow weight" becomes "shadow". The tooltip "How closely you keep the 21 laws, all added up." becomes "Coherence is when what you mean, what you do and what your body does point the same way." Under the ring goes: **"Where you stand today, read from your own answers and what you carry, so it moves when they do."** Cost: four strings, and the gates get new baselines. What the person sees: a ring, a word and a sentence, with nothing to pass or fail.
2. **P1, MOB.** `atuned_src/ui/drills.js` lines 276 and 278 print "From your diagnostic", and print a guessed default as a decimal. Move: "From your answers". The eyebrow becomes "Not answered". The line becomes "Not answered yet, so this is a guess. Three questions would replace it." Cost: three strings.
3. **P1, MOB, with the same line in Reboot-OS.** "That reaches the body at" (summary.js line 311) reads as anatomy. Move, once, beside the limit line at 304: "The places named here come from a map of the body, and nothing in yours is measured to get them."

**Stop:** any quick sweep that strips numbers or "Diagnostic" without putting something in their place. In MOB a dash means "not read yet" (V19), so a stripped figure tells someone who has a reading that they were never read. In Reboot-OS, 'Diagnostic' is a stored key, so renaming it breaks saved data.

**Question:** none.

### Brand director

**What the handshake asks of my seat**
- It asks me to keep one name while the daily promise in Reboot-OS atuned (the second application) changes shape. Its main screen becomes "Today, your mirror", described in plain states, with no clinical words and no "journey". That moves toward our position, not away from it. "Mirror" is already our word, and copy that sticks to evidence and makes no medical claim is how an instrument talks.
- It also asks me to name the one risk. "Plain states" must not turn into "softer". The reading can be said in words, but how it was worked out stays one tap away. Hiding a number is fine. Hiding the table is not.

**The promise:** Today, this is what is running you, top to bottom, in plain words, and every part of how it was read is open.

**Next flow**
1. **P0.** Finding: both applications use the name, and they do not match. Reboot-OS atuned calls itself "Atüned · The Becoming, live" with an all caps ATUNED wordmark. MOB, the live application, says "SOURCE · your field" inside the app and "Atuned", with no umlaut, in the landing page's browser tab. Cause: nobody set a rule for which one carries the name. Move: the name goes with the address. Whatever atuned.world serves is called Atüned, and today that is MOB. In Reboot-OS atuned, the page title in `atuned/src/00_head.html` and the wordmark in `20_markup.html` become plain text, "Reboot-OS preview", until the owner rules. Cost: two lines, no logic. What the person sees: only one thing is ever called Atüned.
2. **P0.** Finding: the word "Diagnostic" shows on screen in both applications. In Reboot-OS atuned it is a button in the ritual builder (`atuned/src/43_what-surfaced.js`, line 227). In MOB it appears as "From your diagnostic" and "Not answered in the diagnostic" (`atuned_src/ui/drills.js` lines 276 and 278), while the landing page's last line says "Not a diagnosis. Not a verdict." Cost to the brand: the word borrows medical authority we have said we do not claim. Inside the code, "somatic diagnostic instrument" is fine. On a screen it is not. Move: keep "instrument" and drop "diagnostic" from every screen. Reboot-OS atuned shows "Reading re-check", a label it already uses, and keeps `type:'Diagnostic'` as the saved key underneath. MOB says "From your answers" and "Not answered yet". Cost: one label lookup and two strings.
3. **P1.** Finding: the first wordmark a stranger sees in MOB is shouting. `funnel/index.html` line 69 sets it at weight 600 with tightened letter spacing. Line 3 drops the umlaut from the browser tab, and line 442 says "Powered by SOURCE OS". Move: weight 400 with room between the letters, a tab titled "Atüned", and "Source OS" in the accent colour under the name. Cost: a few lines of styling, two strings, and the funnel test run locally.

**What I would stop this week:** in both applications, the copy sweep turning numbers into feelings. A state is a physical word: loaded, taut, slack, clear. Never calm, balanced, glowing or at peace. The day the mirror starts reporting moods, it gets shelved next to the meditation apps, and the whole position is gone.

**Question for the owner:** none.

### Marketing director

**What the handshake asks of my seat**
- Copy in both applications follows its section 3: describe states in words, show no raw scores or totals, avoid clinical words, and label every claim as something the person reported, something seen, a model link or an outcome. "Journey" is banned.
- PR 54 (the copy sweep) stays unmerged and nothing publishes from Reboot-OS. So no campaign links to "Today, your mirror".

**The KPI ladder** (MOB, live. Its server is the Worker in Reboot-OS `atuned/server`.)

| KPI | Numerator over denominator | Event | Countable today |
|---|---|---|---|
| Landing to quiz | quiz loads / landing loads | page request | Partly. Neither page sends anything. Only Cloudflare's own totals, which the privacy page already names |
| Quiz to app | sessions opened from a quiz link / quiz loads | record link lands | No. The session does not record which door opened it. Needs one new field |
| Ground chosen | sessions with a ground / sessions opened | onboarding checkpoint | Yes |
| Tutorial done | done / ground chosen | checkpoint | Yes |
| First release, then check | releases / tutorials done; checks / releases | checkpoints | Yes, from 14 October only. Before migration 0015 the server rejected both |
| Account | sessions joined to an account / sessions opened | attach | Yes |
| First paid month | first paid invoices / accounts | Stripe notice, logged by the server | Ready, but reads zero. Checkout is closed and the four tiers are not made |
| First cancel | subscriptions ended / paid | Stripe notice | Ready, reads zero |
| Day 1, 7, 30 return | accounts back on day N / accounts made on day 0 | an app open | No, and it cannot be counted without breaking "Nothing about how you use the app is reported to us". The voice meter keeps only two days, and only for voice users |

**Next flow**
1. P0, MOB. Finding: the privacy page promises nothing about use is reported. But the app sends four checkpoints for every first visit, before sign in. Cause: MOB PR 46 and 47 added that record, and `funnel/legal/privacy.html` was never updated. Move: add one paragraph saying what is sent (a random id, the ground, done marks, two ids, no story text), why, how long it is kept and how to delete it. Cost: one paragraph. Person sees: a privacy page that matches the app. Every count above waits on this.
2. P1, MOB. Finding: five steps of the ladder are already stored, and nobody reads them. Move: one read only query, totals only, run by hand each week. No dashboard, no new event. Cost: half a day. The owner sees real numbers.
3. P1, both. Finding: section 3 helps level 6 buyers and hurts levels 7 and 8. At level 6 a first number reads as a grade, and labelled evidence is proof instead of claim. At 7 and 8, "steadier" is what every wellness app says, and they buy a number they can test. Move: record a decision. Daily screens (Reboot-OS "Today, your mirror", MOB Summary) use words. The open tables keep the arithmetic one tap down, labelled "how this was worked out", and stay out of the PR 54 sweep.

**Stop this week:** anyone wiring up the empty event table, or adding an "app opened" signal, in either application to measure the Reboot-OS bible's return targets (35, 22 and 12 percent). It breaks the privacy promise. In this category, not tracking people is itself the signal. Use the second month's renewal as the alpha retention number instead. Stripe already sends it.

**Question for the owner:** none.

### Sales director

My brief said sight is not for sale. The owner reversed that on 1 October (DECISIONS.md, round OK; `engine/plan.js` SIGHT). A tier now buys two things: how far up the chain a person can see, and how many new patterns they get a month.

**What the handshake asks of my seat**
- Sell in plain qualities, not numbers. No scores, totals, weights or charges in the copy, no "journey", and nothing that sounds like diagnosis or treatment.
- Claim only what the evidence holds.

**Path to the first paid month** (MOB is the live app. Its server is in Reboot-OS `atuned/server`.)
1. Owner: raise the GitHub Actions spending limit. Until then nothing deploys, and the Stripe check also runs there.
2. Team: nothing gets published from Reboot-OS, so atuned.world keeps serving MOB.
3. Team: ship move 1 on MOB. Also confirm that the closed checkout switch (Reboot-OS PR 31) still lets a test card buy. STRIPE-GO-LIVE never mentions the switch.
4. Owner: STRIPE-GO-LIVE Part A, steps 1 to 9, with the test card.
5. Owner: have the lawyer read section 8 of the terms. DECISIONS says launch waits on this.
6. Owner: say "open checkout". Team: open the switch and remove "Checkout is not open yet" from `funnel/buy.html` in the same deploy.
7. Owner: Part B, live. Make one real tier one charge, then refund it.

**Next flow**
1. P0, MOB. The page a person sees between the reading and the card is the tiers panel inside the app (Account, Billing, `atuned_src/ui/plans.js`). It is not `buy.html`, which has no buy button and comes before the reading. Finding: the panel never says when a stop takes effect or that refunds exist. It also has no renewal box, which section 8 of `funnel/legal/terms.html` promises. Move: add an unticked box that says "I agree to a recurring charge of the price shown every month until I cancel." Put this text under it, and on `buy.html` too: "You pay each month until you stop. Stop any time in Manage billing. Your tier runs to the end of the month you paid for, then you are on free. Nothing is deleted, and saboteurs and the views above them lock again. Ask within seven days of any charge and we refund all of it: hello@atuned.world." The same text replaces "Leaving costs nothing and takes nothing with it" on `buy.html`, which stopped being true on 1 October. Cost: half a day.
2. P1, MOB. Finding: the tiers are sold on amounts: 400 patterns, 21,400 lines, therapy sessions. Move: in `plans.js` and `buy.html`, start each tier with what it shows. Give the pace as releases a week and keep pattern counts as small print. Cut the therapy comparison (`planWorth` in `ui/panels.js`, `buy.html` section 7), because it reads as treatment. Cost: a day.
3. P1, MOB. Finding: the moment of value is the first reading, and a free person finds a padlock where their saboteurs would be. Cause: the gift was ruled "100 patterns, with everything visible" and kept in round PK, but the app follows the tier alone. Move: in `engine/plan.js`, show the full chain while the gift lasts. Add this line to the gift text: "For your first 100 patterns you see everything. After that, saboteurs and up are part of a tier." Record it as a default the owner can overrule. Cost: a day.

**Stop this week:** opening checkout before move 1 ships. A charge made under words that promise less than the terms becomes the first refund. And the terms themselves say California's automatic renewal law requires that box.

**Question:** none.

### Art director

**What the handshake asks of my seat**
- Reboot-OS atuned (the second app): section 3 takes the numbers off the screen. Something visual has to carry the state instead, and it must not say something different from the words.
- Reboot-OS atuned: check known finding 1, the overlay colour, before anyone patches it.

**The overlay claim: real, but harmless as it stands.** `atuned/src/49_the-overlays.js` lines 6 to 11 store the colour as `c`. Line 19 reads `o.col`, so every card gets `--c:undefined`. The built `atuned.html` has the same bug. What the person sees: the style sheet's line 2150 falls back to the plain text colour, so the three system names show in ordinary ink. Line 2156 does the same for the input's focus border, so focus is still visible. "undefined" never appears on screen. The literal fix (read `o.c`) would turn "Eastern astrology" #E0524B. That is exactly the hex the sheet uses for "bad".

**Next flow, Reboot-OS, top three**
1. P0. Finding: opening a body map row prints a colour code as if it were a sentence, for example "Heavily impaired. #E77016". Cause: `nerveWhat` (line 167) returns column 2 of `NERVESTATE`, which holds the colour. The description column was lost in an earlier edit, and `50_the-double-bind.js` line 239 prints whatever comes back. Move: line 239 prints only the state word until narrative writes the missing column. Cost: one line.
2. P0. Finding: the nerve badge prints the raw weight (line 212, the `.nbp` span), which section 3 forbids. Move: delete that span. The ring drawing beside it already shows five states by narrowing its gap and breaking up its line. Cost: one line.
3. P1. Finding: the diagnostic axis state words are coloured with their axis colour (lines 121 and 141). Flow uses the same hex as `--acc`, the sheet's "bad" red. Emotions uses the same hex as the "good" green. So "strong alignment" on Flow looks like an alarm, and "friction present" on Emotions looks like success. That is the alarm defect a third time. In the light theme (Snow) these words also measure 1.67 to 1.73 to 1, far below the 4.5 to 1 minimum for readable text. Move: state words take `var(--ink)`. Axis colour stays on the pill and the progress dots. Add an `--alarm` token so red stops meaning root, current step, focus and bad all at once. Cost: two lines and one token.

So the state is carried by order, weight, the ring's shape, and the word in ink. It must never be carried by a seat colour or by `--acc`.

**Same family? Only half.** MOB (live), `atuned_src/shell/head.html` lines 81 to 83 and 96: muted seat colours, a separate alarm #FF2E1F, a blue accent, two all caps rules. Reboot-OS, `atuned/src/10_style.css.html`: the desktop seat colours at line 107 match MOB exactly. The phone theme at lines 52 to 55 keeps the older, louder colours, where root and `--acc` share #E0524B, and there is no alarm token. The sheet has 42 all caps rules, and the source has 60 `toUpperCase` calls. The nerve glyph is a ring. The pain map marks are filled dots, which breaks ring not fill. Reduced motion is handled in both apps.

**Stop this week:** the literal overlay patch. It turns a missing colour nobody notices into a red that tells the person something is wrong. Fix the read and set all three overlays to ink. They are not seats, so they have no claim to a seat colour.

**Question for the owner:** none.

### Game director

**What the handshake asks of my seat**
- Reboot-OS (the second application): "Today, your mirror" becomes the first thing a person sees each day. So that is where they come back, or do not.
- Both applications: no scores, totals, weights or charges in the words on screen, and nothing made up. Any reward on that page has to be something the person's own saved history really holds.

**Day two today, MOB (live).** They open wherever they were last, usually the Summary page. Its Today column starts a new day but has no goal of theirs to ask about, because neither the first run nor the release ever asks them to set one. Their streak reads zero and no practice mark is earned, because yesterday's release saved no ritual. The only next step anywhere is "Run another" on the release results, which is more of yesterday and not a reason to come back today.

**The next flow**
1. **P0, MOB: the release does not count as practice.** Finding: a person who releases every day for a week still has a streak of zero and no practice marks. Cause: `pracDays` in `atuned_src/engine/ladder.js` only counts finished rituals. The first run saves none. `ritRelDone` in `atuned_src/ui/ritual.js` only ticks a ritual that already covers that body address. Move: when a release finishes and no ritual was ticked, save one finished ritual entry through `ritWrite`. Cost: about a day, plus an engine test (seven releases read as seven days). What the person sees: "New mark, First run" on the release they just finished. The honest reward is days practised and new lines opened, because both only go up. The streak is not honest: it halves after a gap. There are eighteen marks at commit `ed5eca3`, not sixteen.
2. **P1, both applications: give day two a reason.** MOB: the release results end by asking for one goal for tomorrow. It saves through `aim_set`, the goal record that already exists in `engine/daily.js`. The next day, Today asks whether it was kept. About a day of work. Reboot-OS: the mirror ends at "Notice one moment" with nothing to press. The one honest reason to come back, "Settled overnight / lands tomorrow" in `atuned/src/43_what-surfaced.js`, sits below it and prints a raw number. Move: open the mirror on what settled overnight, said in words, then today's sentence, then one button into a release, with the four steps drawn as a closed circle. Half a day. Benchmark from games I shipped, not a promise here: a next step the person sets for themselves added 3 to 6 points to next day return.
3. **P1, Reboot-OS: how a 100 pattern bank is played.** A bank of 100 is 50 lines on the left channel plus 50 on the right. That is exactly one full release in the book, so played straight through it is twenty minutes of reading a list. One turn: five lines on one left and right pair, a rest, then one question, "which line landed?" Two minutes is one turn, twenty minutes is four. What the person sees: the nature explained in one sentence, the lines that landed kept as theirs, and today's five. Never "37 of 100". No bank has approved content yet, so write this down as the agreed format now and build it later.

**What I would stop this week:** putting the streak on the mirror as the reason to open the app. It halves when someone misses days, so it works by making stopping hurt. This product reads somebody's nervous system, and I will not use a manipulation pattern on it. Benchmark from elsewhere: a streak like that, shown up front, is worth 2 to 4 points of 30 day return. We give that up on purpose and show days practised instead.

**Question for the owner:** none.

### Project manager

The queue is the table in the first section of this file. Two places the files disagreed when the seat read them: the orientation told every seat to read `AUDIT-2026-10-15.md`, which did not yet exist (it does now), and the orientation counted five golden gaps where main has two (corrected the same day). **The one decision: which application is the alpha.** If the owner does not choose, the team goes with MOB. **Stop this week:** opening new pull requests. Twenty six are open, nine are only documents, and CI cannot run any of them. Finish these first. **Question for the owner:** none. Row 1 is a step for him to take, not a question.

### AI director

**What the handshake asks of my seat**
- No raw numbers, and no state word more exact than the margin the product already states: plus or minus 3 points on coherence (compute.js 94). The screen says the same thing as "a small move is not a reading" (analytics.js 205).
- Mark each claim as the person's answer or the model's guess, and say "not enough to say yet" when that is true.

**The two coherence formulas: one model, not two.** Neither formula in the brief runs anywhere. Both were retired on 25 September: MOB, live, at compute.js 395 to 401, and Reboot-OS atuned, the second, at 45_the-psyche-map.js 463 to 467. Both now run one model: coherence is the 21 law answers added up over 210, plus a tiny lift for each release (0.00077). That is MOB compute.js 150 to 168, and Reboot-OS 45_the-psyche-map.js 513 to 516 and 557. A record moved between them keeps its number on the same 21 answers. It drifts after releases, because MOB counts patterns (ui/release.js 1335) and Reboot-OS counts cleared stories (45_the-psyche-map.js 570). Its word changes at once: 80 reads "Compounding" in MOB and "HIGH" in Reboot-OS.

**Next flow**
1. **P0, Reboot-OS atuned.** Finding: a coherence word shows after the first seven questions, when 33 is the most anyone can score, so everyone reads "LOW" or "VERY LOW". Cause: the home screen locks only at level 0 (46_the-readings-model-under-simulation-1183.js line 95). cohWord (36_the-teachers-on-the-compass.js 134) checks nothing. Move: cohWord says "Not read yet, N of 21 answered" until level 3, as MOB does (compute.js 435). Cost: one function. Person sees: no low verdict on day one.
2. **P0, MOB, live.** Finding: Analytics prints "CQ up 0.1 since last session" (analytics.js 176) on the same tab as "a small move is not a reading". Cause: any move of 0.05 or more gets printed. Move: print nothing under 3; say "No change you can read yet", and name whether an answer changed or only the release lift moved it. The lift is fitted to one data point. Also, within 3 of a tier floor, tierOf (canon.js 826) names both neighbouring tiers. Defensible lines: no word before all 21 laws, and 50, the middle the owner ruled. Arbitrary: every other floor. They are named lines every ten points with no data behind them, and six points in every ten sit within 3 of one. Cost: small. Person sees: a move or a state only when it is bigger than the margin.
3. **P1, MOB, live.** Finding: for each imprint the sniffer knows only whether the fetter was stated or guessed (sniff.js 904), whether the word was said with a no, whether it is about someone else, and any degree word. It has no confidence figure and no count of supporting words. A guessed fetter is the seat's most common one, and it lands charge at full weight (applyStory, 1047). Its chip prints that fetter as a plain label; the warning that it is a guess sits only in a hover title (imprints.js 116). Move: parseStory counts the words behind each imprint. A guessed chip says "heart, not named" on its face, and an imprint resting on one word says "one word, not enough to say what". Cost: an added field only; no reading changes. Person sees: a guess marked as a guess, without hovering.

**The one thing I would stop this week:** explaining coherence as intention times integrity over resistance, as this brief does. Neither application computes it any more, so copy built on it describes arithmetic that is not running.

**Question for the owner:** none.

### Systems director

Read at MOB ed5eca3, Reboot-OS 387a4e5 (PR 54).

**What the handshake asks of my seat**
- Reboot-OS PR 54, Block 3: Diagnostic in STEPTYPES, refs and {type:'Diagnostic'} is saved state; change the printed word, never the key.
- Both apps: hide raw scores on the surface, never in the record.

**Next flow**
1. **P0, the four field nodes, both apps.** Finding: MOB and NODEREG agree on ids 1 to 112 (109, 110 above the body; 111, 112 below). pattern_data.json puts foot nerves on 109 to 112, two field nodes at 113, 114. MOB alone spells 109 Sol Star. Cause: source document against dictation (Reboot-OS L-012). Move: MOB engine/schema.js validateProfile keeps any short meter.unique string, charged to the gift. Refuse by name a bad address (1 to 112), channel (four) or line (under 50); keep older two part keys. Reboot-OS: NODEREG files field nodes under crown and root; add top (body, above, below). Cost: about 15 lines and a test each; no version bump. Person sees: a line saved against a place that does not exist is refused, not charged.
2. **P0, E2 read back, MOB and the Reboot-OS Worker.** Finding: the server keeps ground, tutorial done, release and check ids, an empty gift row and progress flags stuck false, even after account delete. MOB reads none: authFunnelRead has no caller. Cause: a write only seam; a cleared browser has no id to ask by. Move: Worker GET /v1/me adds firstVisit {selectedGroundId, tutorialCompleted, firstReleaseId, verificationId} or null. MOB authCheck (already one boot call) passes it through engine/journey.js: unknown ground refused by name, empty journey filled, nothing overwritten. No gift count crosses; starter_gifts.remaining never moves, so the local meter stays the one truth. Cost: about 50 lines, no new request. Person sees: a cleared browser or second device skips the repeat first visit.
3. **P1, the gift bridge, both apps.** Finding: the four client tracks are MOB's meter channels (left or right side, release or reframe), inside every line key. Gate E's six to four mapping is a category error. Move: pattern_id is the MOB line key, address:channel:line; a bank is 100 keys, hashed sorted, in starter_gift_items.pattern_id; no track_id. MOB saves journey.gift.nature, one of six, never read off the ground (only four share a name). Team decides format, hash, checks; owner supplies each nature's 100 lines and approves each hash. Person sees: the gift opens lines chosen for their nature.

**Stop this week:** shrinking pattern_data.json to 112 by dropping "the two non-canonical records" (canon rule 6). It differs at ids 107 to 114, so lines saved at 109 to 112 silently move.

**Question for the owner:** none.
