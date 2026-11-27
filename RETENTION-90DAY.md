# Can we carry a person through 90 days? Measured, 2 October

His question, round QA: "Can we push people through 90 days? Do we have the sticking
points?"

Stamp: measured on `claude/laughing-feynman-xhfyj3` at `eb33e54`, `source.html` md5
prefix `a9c9b260` (build stamp `d486d3e 2026-10-02 14:33`). F4 (the mirror) and F5 (the
capped first release) are both in this build, at `7acd9f2`. Read only: nothing was built.
Game director seat.

Words used here, said once.
- An **ICP** (ideal customer profile) is one kind of person we build for. The nine in
  `RESEARCH-icp.md` are weighted to add up to 1,000 simulated people.
- The **mirror** is the onboarding card that shows what the engine read in a first story
  and asks yes or "Not me" for each place.
- An **address** is one of the 112 exact places in the body the engine can hold charge
  at. The onboarding calls it a **place**. A **seat** is one of the seven body regions the
  addresses sit in.
- The **Field** is the page the app opens on. Its side column prints a **reading**: the
  addresses holding the most weight, by name.
- The **if-then plan** is the "when" a person attaches to a practice ("after I put the
  kettle on"). It is the single most studied habit lever there is (Gollwitzer and
  Sheeran 2006, 94 studies).
- **ritualsim** is `tools/ritualsim.js`, the 1,000 person, 90 day simulation of the
  practice loop. An **ablation** is a run with one mechanic taken out, so the drop
  shows what that one mechanic is worth.

## The answer

**No, not today.** A person who finishes the onboarding loses everything on their next
visit, so nobody reaches day 2 with anything carried over. Behind that, nothing in the
product knows what day it is, so day 8, day 30 and day 90 look exactly alike.

- Tonight's two fixes are real. The mirror no longer passes a guess off as the person's
  own word, and the first release is three places and twelve lines. Evidence below.
- The point where people get stuck has moved later. It used to be minute five to eight.
  Now it is the next morning.
- Five sticking points, in the order a person meets them. The first is a defect nobody
  had found, and it is small to fix. The other four already have rows in the backlog.

## How this was measured

- **ritualsim, checked before it was trusted.** `node tools/ritualsim.js --validate`
  passes 18 of 18 on this build. Know what that does and does not prove:
  - Checks 1 and 2 test the machinery: the weights add up to 1,000, and a constant
    churn rate matches its known formula.
  - Check 3 compares the model to the curve it was tuned on
    (`reviews/simulation-quarter.md` 6.3). The tool says so itself: "the CURRENT run is a
    restatement and not an independent prediction." A pass means the arithmetic holds. It
    does not mean the forecast is right. Only the differences between runs (the
    ablations) count as findings.
  - Section A of the tool (what the build deals each ICP) is a frozen snapshot on
    purpose. It keeps the old tier cut-offs (8 and 4), and `ui/ritual.js` notes it does.
    So its "83.5 percent are dealt 15 minutes or more" no longer describes the app. I
    measured the live `ritFor` separately (below).
  - The tuning curve sets six of the nine ICPs to exactly zero on day 90. That leaves
    650 of the 1,000 with no day 90 reading the model can give. Across five random seeds
    its day 90 counts run 27 to 38 (today) and 36 to 65 (with the spec built). Day 30 is
    the last day where it says anything steady.
- **The real app, in a real browser.** Real Chromium, through the real Guest door (the
  login card's no-account button), on the pass-3 review's own first stories for Diane,
  Marcus, Angela and Ana. Then I came back on days 1, 2, 8, 30 and 90 with the browser
  clock moved forward. The probe was checked against a known good case first: a value
  written to storage on one page reads back on the next ("kept"), so a lost record is
  the app's fault, not the probe's.

## What tonight's fixes did fix

| Pass-3 finding | Now, measured on this build | Verdict |
|---|---|---|
| The mirror showed guesses as the person's word ("around the word Pride") | "around the word" appears in none of the five walks. Every guess carries a visible "a guess" tag and the line "The engine's guess, from your Solar seat." Each seat is explained in plain words. Marcus's "angry" shows as "you named anger" | Fixed (F4) |
| The charge was written before the mirror, so "Not quite" could take nothing back | Done writes nothing. 0 entries and 0 charge until the mirror's Commit, in every walk | Fixed (F4) |
| One "That is me" for every address | One Yes and one Not me per place. Only a yes reaches the release | Fixed (F4) |
| The release took all 8 or 12 addresses and called them "8 lines" | Diane 8 read: "Your first release takes 3. The other 5 wait." Diane 12 read: 3 taken, 9 wait. Marcus, Angela: 3 taken, 1 waits. The run is exactly 12 lines every time, and the queue matches the plan | Fixed (F5) |
| The first practice asked 15 to 20 minutes of 835 of 1,000 | Live `ritFor` now gives the shortest practice in the track. Diane, Derek, James and Ana: The Somatic Truth Check, 2 minutes. Angela, Rosa: Box Breathing, 5. Marcus, Sofia, Gordon: Active Listening, 10. **0 of 1,000 are asked for 15 minutes or more** | Fixed, earlier than F19 |
| The ritual card offered 6 to 19 choices | It leads with one called practice. The rest wait behind "More practices" | Mostly fixed |

## The five sticking points, in the order a person meets them

### 1. Day 1, the first return: the whole record is thrown away

**Who:** everyone who writes a story in the onboarding, which is the default first run for
all 1,000.

**What happens, reproduced three times, twice on this exact build:**
- The onboarding's Commit writes a small note onto the story entry: `ob`, holding the
  starting point, the feeling, the body place and the yes and no answers
  (`ui/onboard.js`, `obCommit`, since `c30a70c` this morning).
- The profile check at the storage boundary (`validateProfile`) allows only `t`, `text`,
  `imprints`, `bands`, `lex` and `asked` on a story entry (`engine/schema.js:788`,
  `ENT_KEYS`). So at the next boot it rejects the entire profile with:
  `story.entries[0] may not carry ob`.
- With no valid profile left, the boot makes a new blank "You" and opens that. The person
  presses Guest and gets the welcome sheet again, "This is you, and it is okay.", over an
  empty instrument. Story gone, release gone, ritual gone.
- The rejected record is still kept in browser storage, so nothing is destroyed. But
  `storeRefused()` has no caller anywhere in the app, so the person is never told and has
  no way back to it.
- Confirmed with no browser at all: an entry carrying `ob` fails `validateProfile`, and
  the same entry without it passes.
- Probably the same cause as tonight's one open functional gate failure, "the answer
  survives the boundary on the way back in". That intake answer passes the check when
  tested alone. Likely, not proven.
- Why the gates did not catch it: `tests/onboarding2.js` (104 of 104) never reloads the
  page.

**What it costs:** ritualsim assumes the record survives a reload. Every credit in its
spec run (the record people can see, the streak, the season) depends on that. Its "no
record" ablation is the nearest model of this, and it costs 30 of 1,000 by day 30. Today
is worse than that ablation: there is no record at all after the first visit.

**Fix:** not in the F list. It is a new defect.
- Allow `ob` on story entries and check its shape at the boundary: pick, feel and place
  as whole numbers, yes and no as lists of address ids, fixes as text.
- Make the boot say so when it rejected a record, through `status()`, which this
  project's rule already requires ("never lie about a failure").
- Add a reload-and-read-back step to `tests/onboarding2.js`.
- Size S. Nothing below counts until this lands.

### 2. Minute ten, the end of the first release: the payoff says nothing happened

**Who:** every person on a fresh profile who runs the first release. That was 4 of 4 in
the walks.

**What happens:** the done screen ends on "Expression did not move. Release has about 0.0
points left to give you. The laws hold expression down from here, and there are twenty
one of them." The engine has this right: on a fresh profile no law is answered, so there
is no room left to show. But this is the reward moment of the first session, and it
tells a newcomer that nothing moved and nothing will. Next to it, "DQ 4.22" and "Down
0.86" stand with no explanation, which round PO forbids. The good part: the main button
is "Build a ritual", so there is a next step right there.

**Fix:**
- F17: the "what changed" card, five fixed answers, saved.
- F12: the done screen laid out with the Field as its picture.
- And one rule: do not print the headroom sentence while the laws are unanswered.
- Size S.

### 3. Day 2 onward, the Field: it leads with words the person said no to

**Who:** Diane and Marcus first, 340 of 1,000 by weight, the two the pass-3 review lost
at the mirror. In practice, anyone whose story reads mostly guesses.

**What happens, reproduced:**
- Diane's "I snapped at my co-founder..." reads 12 places, all guesses.
- She presses Not me on all 12. The bridge says, truthfully, "You did not say yes to any
  place, so nothing from this story goes into a release."
- But Commit still writes the story's full weight onto the nine axes: Anger 2.52,
  Disgust 2.52, Apathy 2.1. That is the same weight as if she had answered nothing.
- So the Field, the page the app opens on every visit, leads with **"Denial Of Light,
  Primary. Escapism, Secondary. Addiction, Tertiary."** Her no keeps an address out of
  the release. It never reaches the page she sees every day.
- Marcus has a smaller version. He said "angry", and the release takes Pride, Arrogance
  and Competition. The address actually named Anger comes fourth at that seat, so it
  waits for a later release.

**Fix:**
- F16: Not me writes a decline, and what the engine proposes visibly changes.
- F29: the Field shows confirmed apart from unresolved.
- F10 for the ordering: an address named for the word the person used goes first.
- Size M.

### 4. Day 2 to 7: nothing names one next step, and the "when" is buried

**Who:** all 1,000.

**What happens:**
- The app opens on the Field. Nothing on the Field mentions the ritual the person built,
  its "when", or what to do today. I checked the visible text on days 1, 2, 8, 30 and
  90: no "next", no ritual, no "since you were last here".
- The ritual lives one tab away (Flow, then Ritual), where it does show "after I put the
  kettle on, 6 days left".
- The "when" exists, but it is one optional box near the bottom of a builder with 27
  controls: seven seat tags, a timer, how often, seven weekday buttons, then When, Where
  and How long.
- **This is the largest lever ritualsim measures.** Take away the if-then plan and the
  spec run loses **56 of 1,000 by day 30** and 21 by day 90. That is roughly double the
  next lever. (`ui/ritual.js` says "72 of 1000 at day thirty, measured" above this box.
  Today's run says 56. That is a number typed into the code and left there while the
  real value moved.)
- In progress, not counted: `trace-graph-ui` and `daily-summary-ui` have no commits.
  Their worktrees hold uncommitted edits to `ui/summary.js` and the shell.

**Fix:**
- F19: accepting the one proposed practice asks one question, "when?". It is no longer
  an optional box under 26 other controls.
- F23: one Next, in the Field's side column, which is where the app opens.
- Sizes: F19 S, F23 M.
- Modelled worth, as direction only: the if-then plan 56 at day 30, the record seen on a
  surface the person opens 30.

### 5. Day 7 to 90: the only ritual ends without a word, and no surface knows what day it is

**Who:** everyone who builds a ritual. "A week" is the default length.

**What happens:**
- I ran Diane's return with the first defect neutralised (the `ob` note stripped before
  reload, standing in for the fix).
- On day 8 her ritual has quietly ended. The Ritual tab says "Nothing active yet. Start
  one with New ritual in the right menu". "Yet" is false for someone who just finished a
  week.
- There is no moment that closes the week, nothing asking how it went, no offer to carry
  on.
- Day 30 and day 90 show exactly what day 8 shows.
- The streak, the record and the sixteen marks (`ladderHtml`) are drawn in one place
  only, inside the Compass card (`ui/cone.js:3120`).
- `engine/daily.js` can write real summaries for these windows, but `dlyCompose` has no
  caller in the app. The engine exports it and nothing uses it.

**Fix:**
- F26: the summaries at about a week, a month and three months, led by what changed and
  what was declined. It depends on F24 (the Summary page) and F23.
- The week-end close is the "about a week" summary in F26. Ritualsim's season mechanic
  is worth 5 of 1,000 by day 30. That is small, but this is the only place it lives.
- Sizes: F26 M, behind F24 L.

## Standing, not about retention: Ana, 50 of 1,000

"I do not want to be here anymore. Everything is too heavy." still reads as nothing, and
the onboarding answers "That is fine. You can always write another in the Story tab." F1
(the distress reader) and F2 (the response) are not merged. The F1 draft sits unverified
on `f1-distress-detector`. This is the reason F3 keeps the public domain dark, and that
holds.

## Where practice holds and where it falls, by ritualsim's own numbers

People still active, out of 1,000. "Today" is the tuned curve. "Spec" is every mechanic
in the ritual spec built.

| Day | Today | Spec |
|---|---|---|
| 1 | 571 | 708 |
| 7 | 137 | 317 |
| 30 | 59 | 119 |
| 90 | 28 | 36 |

What each mechanic is worth (spec with that one thing taken out, people lost):

| Taken out | Lost by day 30 | Lost by day 90 |
|---|---|---|
| The if-then plan, the "when" | 56 | 21 |
| The record, on a surface the person opens | 30 | 12 |
| A missed day halves the run instead of resetting it to zero | 23 | 8 |
| The release reaches people who had nothing hot enough to release | 12 | 14 |
| A seven day season | 5 | 2 |
| One practice instead of the whole list | 2 | 0 |
| Push notifications | 2 | 4 |

My reading as game director:
- **Most people leave in the first two days.** Today that is 374 of 1,000 by the
  model's own exit tags, and 304 of those could not run a release. Week one is where
  this product is won or lost. Day 90 depends on getting week one right.
- **Practice holds where there is a "when" and a record the person can see. It falls
  where there is neither.** Both are cheap and neither one manipulates anyone.
- **Push notifications are the smallest lever in the table.** 2 of 1,000 by day 30, and
  their coefficient is a guess the tool marks as unverified. The accounts plan carries
  push for ritual accountability. It should not be built in the hope that it carries
  retention, because the model says it will not.
- **Halving the run instead of resetting it is worth 23 of 1,000 by day 30.** That is
  the humane choice and the one that keeps people. A run that resets to zero punishes
  leaving, and that is not shipping here.
- **For scale, a benchmark from elsewhere, not a promise here:** free to play mobile
  games I have shipped ran roughly 35 to 40 percent of people still playing on day 1 and
  5 to 8 percent on day 30, using every manipulation pattern this product refuses. The
  spec run's 12 percent on day 30, with none of them, would be a good result. Today's
  model says 6 percent, and the real build is below the model, because of sticking
  point 1.

## The order I would fix them in

1. **The rejected record (point 1).** S. A day with this unfixed means nobody keeps
   anything, so every other row is unmeasurable.
2. **The done screen's headroom line (point 2, part of F17).** S.
3. **F19's one "when" question and F23's one Next (point 4).** The largest lever, on the
   page the app opens.
4. **F16 and F29 (point 3).** A no that lands where the person looks.
5. **F26 behind F24 (point 5).** The week, month and quarter summaries, with the ritual's
   week-end close inside the first one.

None of these needs a streak that threatens a loss, a countdown, a random reward, or a
notification that plays on fear of missing out. A person must be able to stop and be glad
they used it.

## Reproduce

- `node tools/ritualsim.js --validate`, then `node tools/ritualsim.js` for sections A to F.
- Point 1, with no browser:

      node -e 'const E=require("./engine.js");const q=E.blankProfile("You");
      q.story.entries.push({t:new Date().toISOString(),text:"x y z",imprints:1,bands:{},ob:{pick:1,feel:1,place:1,yes:[],no:[]}});
      console.log(E.validateProfile(JSON.parse(JSON.stringify(q))).errs)'

  It prints `story.entries[0] may not carry ob`. Delete `ob` and that error goes.
- The browser probes (real door, clock moved forward, Not me on every row) were run from
  this seat's scratchpad and are not committed, because this round builds nothing. Each
  step above names the function it drives, so a gate can be written from it.
