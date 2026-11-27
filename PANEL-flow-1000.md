# The Flow, Sampled A Thousand Times

A thousand simulated arrivals walked from first landing to day ninety, through
the flow that is actually built. The walk is a script, not a paragraph:
`/home/user/MOB/tools/flowsim.js`. Every number below is that script's output
or a measurement the script was fed.

    written        tools/flowsim.js, 1000 people, 40 trials, seed 1
    engine         engine.js md5 1da186acfb093ab79327b9e7510755ec
    build measured source.html md5 8d12924ca0dc92efe9663710f940e36c
                   at commit 656d3bd, working tree dirty
    driven         Chromium, file://, 1600x1000 and 390x844
    re-checked     every measured fact below was taken twice, once at
                   source.html md5 d2de8bdc476909f60e75d72c55df0835 and again
                   after something outside this task rebuilt the file at
                   06:50:53. Identical on every one.

**Every figure in this file is one of four classes and is labelled.**

| Label | What it means |
|---|---|
| **measured** | Read from `atuned_src/`, or executed in Chromium or node this run |
| **engine** | Produced by running `engine.js` on data already in the repository |
| **cited** | A published figure, with its reference named |
| **judgement** | A modelled value, with its anchor stated and its sensitivity swept |

Nothing here was said by a real person. A rate with no source is a defect and
the script refuses to carry one: `node tools/flowsim.js --sources` prints all
twenty five rates with the sentence behind each.

---

## How The Tool Was Checked Before It Was Trusted

A tool that lies is worse than no tool, so `--check` runs six known good cases
before any result. It also caught a real defect in the first version of this
model, which is the reason the gate is worth having.

    node tools/flowsim.js --check

    pass  the roster reads in the order tests/engine.js asserts:
          Rosa 100 > Ana 7.6 > Gordon 0.8
    pass  Sofia bands Even at 56.6 and James bands Severe at 12, which is
          what PANEL-usability.md records
    pass  a flat draw of 20000 at p=0.62 returns 12525, inside 3 sigma of 12400
    pass  every rate certain: 1000 of 1000 reach day 90
    pass  and 1000 of 1000 put something in
    pass  boot at zero: 0 booted, 0 at day 90
    pass  the published funnel in RESEARCH-icp.md reproduces as
          1000, 288, 178, 109, 50, 44 against 1000, 310, 186, 121, 52, 47,
          every stage inside 3 sigma
    pass  the sniffer returns at least one imprint for 1 of 14 of the
          repository's own persona lines
    pass  no amount of story text reaches the release gate of sq 4:
          0 of 98 windows put a single address above the line

Case five is the one that matters. `RESEARCH-icp.md` section 7 publishes a
funnel of 1000, 310, 186, 121, 52, 47. Feeding that document's own stage rates
through the same Bernoulli machinery this simulation uses returns 1000, 288,
178, 109, 50, 44, every stage inside three standard errors. The machinery
reproduces a known good funnel before it is asked to produce a new one.

**The defect the gate caught.** The first version gave each person a per step
odds multiplier taken from their buying probability on the grid. That
compounded one whole funnel fact eleven times and took the boot step from 97.9
percent to 14.3 percent. It was wrong and it looked plausible. The per person
shift is applied once now, spread across the eleven bendable steps as a log
odds distance from the panel's weighted geometric mean, so the shift
accumulated across a whole walk is the intended odds ratio and no single step
is distorted. The failure is recorded in the script at `BENDSTEPS` rather than
quietly fixed.

---

## Who The Thousand Are, And A Finding Before The Walk Starts

Weights from `RESEARCH-icp.md`, the panel weight column, summing to 1000. The
reading is not typed in: the script computes each persona from `engine.js` at
run time using the same walk `tests/engine.js` group 15 uses, then bands the
result on the ten level table in `BUYERS.md`.

| Who | Age | Weight | CQ, engine | Tier, engine | Grid level | Buying probability |
|---|---|---|---|---|---|---|
| Diane | 46 | 180 | 28.1 | Corrupt | 3, Defensive | 20 percent |
| Derek | 39 | 170 | 15.0 | Severe | 2, Numb | 10 percent |
| Marcus | 44 | 160 | 39.2 | Incoherent | 4, Frustrated | 40 percent |
| Angela | 36 | 150 | 40.9 | Incoherent | 4, Frustrated | 40 percent |
| Sofia | 41 | 140 | 56.6 | Even | 6, Receptive | 65 percent |
| James | 57 | 100 | 12.0 | Severe | 2, Numb | 10 percent |
| Ana | 47 | 50 | 7.6 | Collapsed | 1, Fragmented | 0 percent |
| Gordon | 58 | 35 | 0.8 | Collapsed | 1, Fragmented | 0 percent |
| Rosa | 61 | 15 | 100.0 | Mastery | 10, Sovereign | 100 percent |

**The panel's weighted buying probability is 29.3 percent of 1000.** That is
the ceiling on everything below, and it is not a UX number.

**The finding.** `BUYERS.md` records that the curve peaks at levels 10, 9 and 8
and collapses through 5 and 4. Read at the readings the engine actually gives
them, the roster sits at levels 6, 4, 4, 3, 2, 2, 1, 1 and 10. Weighted, the
mean arrival is at level 3.5. Eight hundred of the thousand sit at level 4 or
below, which is the part of the owner's own grid he described as the largest
population and the hardest sell.

The onboarding cannot be written for level 8, and it is not being asked to be.
It is being asked to work for a population the grid says is mostly frustrated
or numb. That is a harder brief than the one the surfaces are currently built
to, and it is the frame the rest of this document sits inside.

---

# 1. THE FUNNEL

1000 people, 40 trials, mean and the 95 percent interval across trials.

| Step | Reaches it | Of 1000 | Interval |
|---|---|---|---|
| Lands, the file opens | 1000 | 100.0 percent | 1000 to 1000 |
| Survives the boot to first paint | 979 | 97.9 percent | 972 to 989 |
| Starts the onboarding rather than Not now | 802 | 80.2 percent | 778 to 827 |
| Finishes the four onboarding cards | 668 | 66.8 percent | 637 to 697 |
| Chooses an action on the landing surface | 207 | 20.6 percent | 186 to 230 |
| Reaches a surface that can take an input | 146 | 14.6 percent | 117 to 166 |
| Puts something in, intake or story | 104 | 10.4 percent | 86 to 120 |
| Sees a first reading rather than the dash | 104 | 10.4 percent | 86 to 120 |
| Runs a first release | 4 | 0.4 percent | 1 to 8 |
| Saves a first ritual | 19 | 1.9 percent | 10 to 29 |
| Still there in week one, days 2 to 7 | 33 | 3.3 percent | 23 to 43 |
| Still there at one month, days 24 to 30 | 14 | 1.4 percent | 7 to 20 |
| Still there at three months, days 84 to 90 | 10 | 1.0 percent | 6 to 16 |
| Earns Seven days, seven consecutive saved rituals | 0 | 0.0 percent | 0 to 0 |
| Earns Thirty days | 0 | 0.0 percent | 0 to 0 |
| Earns Ninety days | 0 | 0.0 percent | 0 to 0 |

The windows are stated because a single day draw is not what the question
means. Still there at day 7 is opened at least once on days 2 to 7. At day 30
it is days 24 to 30. At day 90 it is days 84 to 90.

**By device.** 8000 walks, phone share 60 percent of arrivals.

| Device | Arrivals | Puts in | First release | First ritual | Day 7 | Day 30 | Day 90 |
|---|---|---|---|---|---|---|---|
| Desktop | 3206 | 12.0 percent | 0.9 percent | 2.3 percent | 3.9 percent | 2.3 percent | 1.3 percent |
| Phone | 4794 | 8.9 percent | 0.2 percent | 1.5 percent | 2.7 percent | 0.9 percent | 0.8 percent |

Of the 104 of 1000 who put something in, 31.2 percent are still there in week
one. That is the number that matters most in this table, and it says the
retention half of the product is not the broken half.

**Three readings of that table.**

The onboarding works. 668 of 1000 finish four cards. Nothing downstream of it
performs like that.

The collapse is one step wide. 668 of 1000 finish the onboarding and 207 of
1000 choose an action on the surface behind it. That is 461 people lost on the
landing surface, which is 69 percent of everybody who was still there.

The flagship is not reached. 4 of 1000 run a release. The release is the thing
the tier ladder prices, the thing nine rulings are attached to, and it is
reached by four people in a thousand.

**Against the outside.** Cited, and reproduced from
`reviews/SIM-ninety-days.md` section 8 rather than refetched this run: Baumel
A, Muench F, Edan S, Kane JM, "Objective User Engagement With Mental Health
Apps", J Med Internet Res 2019;21(9):e14567, ninety three apps, median daily
active users 4.0 percent, median fifteen day retention 3.9 percent, median
thirty day retention 3.3 percent.

This model puts 1.4 percent of 1000 arrivals at one month against a category
median of 3.3 percent of installs. Those are not the same denominator and the
comparison is generous to this product, because an arrival has already opened
the file. On the more favourable denominator it still lands at under half the
median of a category whose median is a catastrophe.

**And that is not a retention finding.** Of the people who put something in,
31.2 percent come back inside a week. The product holds the people it reaches.
It reaches 104 of 1000.

---

# 2. THE FRICTION POINTS, RANKED

Ranked by people lost out of 1000, from the `--check` verified run. Every
screen is named with its file.

| Rank | People | Where | File |
|---|---|---|---|
| 1 | 462 | The landing surface. Field, cognitive load, no instruction | `atuned_src/ui/ui.js`, `atuned_src/shell/body.html` |
| 2 | 176 | The onboarding sheet, pressed Not now | `atuned_src/ui/onboard.js`, `atuned_src/ui/ui.js` |
| 3 | 134 | The onboarding sheet, left part way through the four cards | `atuned_src/ui/onboard.js` |
| 4 | 61 | The phone tab strip, four of nine doors past the edge | `atuned_src/shell/body.html`, `atuned_src/shell/head.html` |
| 5 | 42 | The story, Commit 0 and the button disabled | `atuned_src/engine/sniff.js`, `atuned_src/engine/lexicon.js` |
| 6 | 37 | The intake ends at nothing is carrying | `atuned_src/engine/intake.js`, `atuned_src/ui/intakeui.js` |
| 7 | 22 | The intake, stopped part way through 63 | `atuned_src/ui/intakeui.js` |
| 8 | 21 | The boot, no word in the first four seconds | `atuned_src/shell/body.html` |
| 9 | 7 | The story named an accusation the person did not write | `atuned_src/engine/sniff.js` |
| 10 | 6 | Days two to six, nothing brought them back | `atuned_src/ui/cone.js`, `atuned_src/ui/ritual.js` |

### 1. The Landing Surface. 462 Of 1000

**Measured this run, Chromium, both viewports.** Visible interactive elements
in the first viewport, per surface.

| Surface | 1600x1000 | 390x844 | Words of text on the surface |
|---|---|---|---|
| Knowledge | 102 | 33 | 856 |
| Story | 97 | 28 | 79 |
| Compass | 96 | 29 | 187 |
| Energetics | 91 | 22 | 510 |
| Ritual | 89 | 23 | 297 |
| Summary | 83 | 20 | 425 |
| Games | 80 | 21 | 143 |
| **Field, the landing surface** | **75** | **26** | **0** |
| Body | 72 | 29 | 0 |

`CLAUDE.md` records 57 to 71 simultaneous choices per screen against a working
memory of about four. The current measurement is 72 to 102 in the first
viewport at 1600. The landing surface presents 75 and carries zero words of
text. The skill file's working floor is under 12.

The load gate in the model is one line with one constant from the skill file:

    p_proceed = 1 / (1 + log2(choices / 12))

At 75 choices that is 0.275. At 26 it is 0.472, which is why the phone
viewport scores better on this one step than the desktop does: a small screen
is an accidental progressive disclosure device. Both are far under the floor.

This is the largest single loss in the funnel and it is the item `CLAUDE.md`
already files as architectural and needing a decision before it needs code.
The simulation's contribution is the size of it: 462 of 1000, and 199 of 1000
recovered by that fix alone.

### 2 And 3. The Onboarding Sheet. 310 Of 1000 Between Them

**Measured.** The sheet opens 5,646 ms, 5,811 ms and 5,568 ms after navigation
in three runs, from `step('onboarding', ...)` in `atuned_src/ui/ui.js` with a
5,600 ms timeout. Four cards, measured as four dots in `obCard`. Card 0 puts
"Not now" beside the primary control. One interaction is required, one of
eight seats, and Next stays disabled until it is chosen.

The 176 and 134 are judgement, at 0.82 to start and 0.94 per transition, and
they are the two softest numbers in the model. What is measured is the
interruption: the sheet arrives 5.6 seconds after landing, on top of a surface
the person has already begun to read. It is not a welcome that precedes the
product. It is a modal that interrupts it.

Everything else about this sheet is good and the model says so. 668 of 1000
finish it, which is the best performing step in the product.

### 4. The Phone Tab Strip. 61 Of 1000

**Measured at 390x844.** `clientWidth` 348 against `scrollWidth` 723.

| Tab | Left | Right | Visible |
|---|---|---|---|
| Energetics | 21 | 118 | yes |
| Ritual | 123 | 186 | yes |
| Story | 191 | 251 | yes |
| Field | 256 | 313 | yes, and it is where the app lands |
| Body | 318 | 377 | cut at 348 |
| Compass | 382 | 470 | no |
| Knowledge | 475 | 577 | no |
| Games | 582 | 653 | no |
| Summary | 658 | 744 | no |

Four of nine entirely past the edge and a fifth cut. The affordance is a 26
pixel gradient mask and `#tabbar` has `scrollbar: display:none`. That is skill
rule 10 exactly: never hide a control with no affordance.

The two writing surfaces, Energetics and Story, are both visible, so this
costs less than it looks. What is off screen is Summary, which carries the four
doors and the only honest first paragraph in the product, and Compass, which
carries the record, the streak and the one line that asks a person to come back
today.

### 5 And 9. The Story Surface. 49 Of 1000

**Measured, and this is the sharpest measurement in the document.**
`parseStory` was run over the fourteen persona `says` strings in
`atuned_src/engine/data/people.js`. Those are the product's own voice samples,
first person, present tense, emotionally loaded, fourteen to twenty two words.

**Thirteen of fourteen return zero imprints.** The Commit button therefore
stays disabled, because `ui/storyui.js` disables it unless
`ST_PARSED.imprints.length` is non zero.

Driven in Chromium, Diane's own line typed into the Story surface:

    commitLabel     "Commit 0"
    commitDisabled  true
    release panel   "Nothing is held above the line yet, so there is
                     nothing to release."
    runDisabled     true

Both primary controls on the surface, dead, on the product's own copy about its
own ICP.

**The length curve, measured by concatenation.**

| Mean words | At least one imprint |
|---|---|
| 18 | 1 of 14 |
| 36 | 2 of 14 |
| 53 | 3 of 14 |
| 89 | 5 of 14 |
| 160 | 9 of 14 |
| 249 | 14 of 14 |

Linear through the origin, so the model uses `p(commit) = min(1, words / 249)`.
A first entry has to run to about 250 words before the button is reliably
alive, and the surface gives no length guidance at all: the placeholder is
"What happened. Write it the way you would say it out loud." and the only
feedback is a live word count with no target.

**And when it does fire, it accuses.** Measured, four of four samples:

    "My partner cut me out of the deal and my jaw is tight"
        Deceit, Lying, Excuse, Spiritual Language To Manipulate
    "I am exhausted"
        Pride
    "I screamed at my son and I hate that I am like my father"
        Pride, Arrogance, Competition, Anger
    "I used to drive nine hundred miles and feel nothing. Now I cannot
     get to the end of the street."
        Denial Of Light, Knowing Better Than God, Denial Of Truth, Fear Of God

The last of those is Tomas, the panel's floor case, and it is the one persona
line the sniffer does read. A person in collapse writes a sentence about not
being able to leave the street and the instrument answers Knowing Better Than
God.

### 6 And 7. The Intake. 59 Of 1000

**Measured, and the good news first.** All three conditions
`RESEARCH-icp.md` says lift completion from 31 percent to 68 percent are now on
the surface, in `ui/intakeui.js`. `iqAccuracy` prints "about fifteen minutes
for all of it, in any order. Stop whenever and come back". The bar prints "N
answered, M left" and never a count against a total. The panel headed "Twenty
One Laws, Three Ways" names the three way design in one sentence. That was the
one of the three still missing when `reviews/SIM-ninety-days.md` was written.
It is there now. The model uses 0.68 accordingly.

**And the bad news is structural.** `iqApply` writes `p.laws` and `S.law` and
nothing else. A grep for every writer of `S.charge` across `atuned_src/` finds
`engine/sniff.js`, `ui/release.js`, the wheel drag at `ui/ui.js:259`, the nine
fields in `ui/panels.js`, `ui/personas.js` for a reference case, and
`engine/schema.js` on load. The intake is not among them.

Fifteen minutes and sixty three questions put nothing on the wheel.

---

# 3. WHERE THE FLOW IS BROKEN RATHER THAN MERELY LOSSY

Six things. Four are breaks. Two are corrections to the brief.

### Break One. Three Of The Four Doors Write Nothing

**Measured in Chromium.** Summary on a blank profile prints, verbatim:

> Four ways in. None of them asks you to know a term first, and **any one of
> them fills this page.**

The four are declared at `STARTD` in `atuned_src/ui/component.js`. Each was
pressed and driven three levels deep with the charge sum and the reading read
before and after.

| Door | Goes to | Charge written | Reading after |
|---|---|---|---|
| Write what happened | Story | 0.00 to 0.00 on one sentence | unread still true |
| Read nine sentences | `runRecogniseDrill`, `ui/drills.js:589` | 0.00 to 0.00 | unread still true |
| Go year by year | `runAgeDrill`, `ui/drills.js:806` | 0.00 to 0.00 | unread still true |
| Say who you are becoming | `runAvatarDrill`, `ui/drills.js:685` | 0.00 to 0.00 | unread still true |

`runAgeYear` says it out loud in its own copy: "Nothing is stored here, and
nothing is scored." `AGE_ANS` is a module variable and never reaches the
profile.

So the sentence on the landing page is false for three of the four, and for
the fourth it is true only above about 250 words. This is the single most
consequential broken thing found, because it is the product's own instruction
to a stranger and following it produces nothing.

### Break Two. Neither Entry Path Can Reach The Release

**Measured.** The display and release gate is `n.sq >= 4`, at
`engine/compute.js:63`. The sniffer writes `0.35` per touch, at
`engine/sniff.js:239`.

Story text at 18, 53, 89, 160, 249, 498 and 996 words, run through
`applyStory` and `compute` on a blank field, 98 windows in all:

    loaded (sq >= 4)     0, at every length
    under  (0 < sq < 4)  saturates at 27
    imprints             saturates at 4

The intake writes no charge at all. So on day one, from a blank profile, there
is no path from anything a person enters to the release. The only routes to
`sq >= 4` are the nine number fields in the left rail and the wheel drag, and
neither is one of the four doors. That is why 4 of 1000 run a release.

`DESIGN-mobile-icp.md:279` records the phone figure independently: 11 percent
of that panel reached the wheel with intent and 4 percent found Run a release.
The simulation uses that figure rather than inventing one, and the code
explains it.

### Break Three. All Sixteen Types Print The Same Reading

**Measured in Chromium.** The Myers-Briggs seed applied on a fresh profile,
three types, then Summary read.

| Type | CQ | Tier | Held | Under | Summary headline |
|---|---|---|---|---|---|
| INTJ | 36.00 | Incoherent | 0 | 107 | 36 percent, Incoherent, Frustrated |
| ENFP | 36.00 | Incoherent | 0 | 107 | 36 percent, Incoherent, Frustrated |
| ISTJ | 36.00 | Incoherent | 0 | 107 | 36 percent, Incoherent, Frustrated |

The charge vectors do differ. The headline does not. With no law measured the
reading resolves to 36.00 for every one of the sixteen, and `seedShare` reads
1.00, so the page correctly says the field is entirely the seed while printing
a number that is identical for everybody who ever states a type.

Marcus asked for a claim specific enough to be wrong. This is a claim that
cannot be wrong because it is the same claim for everybody.

### Break Four. A Latent Trap In The Blank Profile

**Measured.** `engine/schema.js:95` reads
`S.charge[c.nm] = a.held != null ? a.held : 3`. A profile whose `axes` object
is empty therefore loads at charge 3 on all nine, which is 107 addresses
carrying and `unread` false, because `unread` requires `under === 0` at
`compute.js:171`.

The live path is safe: `pNew` writes `held:0` explicitly, and the first run
state read out of Chromium is charge 0 on all nine, under 0, unread true, and
Summary correctly shows the dash and the four doors. The trap is that any other
caller of `blankProfile` that does not write the axes gets a full field on a
profile nobody entered. `pImport` is the caller to watch, since it is the seam
the record fetch at sign in will arrive through.

### Correction One. Undo Exists. The Brief Is Out Of Date

The owner named undo on applying a story as the largest remaining gap.
**Verified independently, and it is built.**

- `atuned_src/engine/undo.js`, 98 lines. `UNDO_MAX = 0`, which the file states
  means no ceiling, on the owner's ruling.
- Redo is there too, with the standard contract: a new change abandons the
  branch walked away from.
- `undoPush` is called at four sites: `ui/storyui.js:82` with the label
  "committing the story", immediately before `applyStory`; `ui/release.js:86`;
  and twice in `ui/ui.js` for a hand set charge and a blueprint change.
- The control is in the top bar. `paintUndo` in `ui/panels.js:742` hides the
  pair when both stacks are empty, writes what the step will take back into
  the accessible name and the tooltip, and the usual chords are bound with a
  guard so an input keeps its own.

So the item is not open. `TASKS.md` section 2f still lists U1 as not built, and
`CLAUDE.md` still lists undo under "Mine to build when asked". Both are stale.
So are AN3, the onboarding, and AN7, the signal test, which are
`atuned_src/ui/onboard.js` and its card 2. A backlog that says a built thing is
unbuilt is the same defect as a count typed into a document, and this
repository has a rule about that.

**What is actually still missing, and it is a third of the gap not the whole
one.** `undoState` captures the nine charges, the nine installed opposites, the
twenty one laws and the soul. It does not capture `p.meter`, `p.history` or
`p.story.entries`. So undoing a release restores the field and leaves the spend:
the patterns are gone, the ground is still marked open, the snapshot is still
written and the journal entry is still in the record. The label on the control
says "Takes back the release at N addresses", and it takes back the reading, not
the bill.

That is the honest version of the item. Not "no undo". An undo that restores
the instrument and not the ledger.

### Correction Two. Nobody Can Get Back From A Spend, And Nobody Is Told What It Cost

Related and separate. `meterRun` at `engine/schema.js:520` pushes unique keys
onto `p.meter.unique` and there is no remove. A spend is the one thing in the
product that is genuinely irreversible, and it is the thing undo does not
cover.

The cost is at least stated now, which it was not. `meterPlan` costs one pass
rather than filling to the cap, and both the Story release panel and the
release pick phase print the price in patterns and seconds before the run
begins. That is skill rule 3 honoured.

---

# 4. THE NINETY DAY SHAPE

### What Actually Brings Somebody Back On Day 7

Four candidate mechanisms. One exists, and it is on a surface a phone cannot
reach.

| Mechanism | In the code | Where |
|---|---|---|
| A streak, and a line asking for today | **yes** | `engine/ladder.js`, rendered by `ladderHtml` in `ui/cone.js` |
| A push notification | no | `TASKS.md` section B, "Deferred, and genuinely separate" |
| An email or any off device reach | no | no account, no network except the planned record fetch |
| Content that is not finished in session one | no | about 123 minutes of first pass content, measured in `reviews/SIM-ninety-days.md` |

**So the answer is the streak, and here is what the streak actually counts.**

`streakRead` counts distinct days present in `p.rituals`. `p.rituals` is
written in exactly one place: the Save ritual button in `ui/ritual.js`. Nothing
in the product records that a ritual was performed. There is no done control,
no timer, no after state.

The ledger on Compass therefore prints **"Minutes practised"** against a sum of
`p.min` over saved plans. That is minutes planned. A person who selects the
twenty minute Emotional Scan, presses Save ritual, and closes the tab has
twenty minutes practised on the record and a day on the streak.

That is the one place in this product where a label claims something the data
does not carry, and skill rule 3 is explicit: provide a status and never lie
about it.

**And the streak is off screen on a phone.** Compass sits at left 382 against a
tab strip `clientWidth` of 348. The only surface carrying the record, and the
only line in the product that asks a person to come back today, "Today is not
on the record yet", is entirely past the edge for 60 percent of arrivals.

### The Marks Nobody Earns

`MARKS` in `engine/ladder.js` has sixteen entries. Three of them are the ninety
day shape: Seven days at `s.best >= 7`, Thirty days at 30, Ninety days at 90.
All three count **consecutive days carrying a saved ritual.**

**0 of 1000 earn Seven days.** 0 earn Thirty. 0 earn Ninety.

The arithmetic is not close. 19 of 1000 save a first ritual at all. A saved
ritual on a given day needs the person to return and to press the button, and
seven of those in a row against a decaying return probability is a vanishing
event. The product's own day seven mechanism is unreachable as built, and it is
unreachable for a reason that has nothing to do with motivation: it is gated on
a button nobody is pointed at, on a surface most arrivals never see, counting
something the product never observes.

### And One Thing That Tells A Person They Did Something They Did Not

`ladderHtml` ends with `L.next.d`, the next mark's description, in past tense.
On a blank record `ladderRead` returns `MARKS[0]` as next, so the surface
prints:

> **First run** You ran one. The instrument is no longer a thing you are
> reading about.

to somebody who has run nothing. The streak paragraph above it is correct and
says "Nothing on the record yet. Build one ritual and save it, and the first
day is on." The two sentences contradict each other on the same screen.

### The Shape, Stated

| Day | Still there, of 1000 | What is holding them |
|---|---|---|
| 1 | 104 put something in | The onboarding worked and one surface undid it |
| 2 to 7 | 33 | A reading they can reread. Nothing asks for them |
| 24 to 30 | 14 | Reference use. Sofia and Marcus, and the ones like them |
| 84 to 90 | 10 | The plateau, at the cited category floor of 4 percent daily |

The curve flattens rather than going to zero, at the daily floor taken from the
cited median daily active figure of 4.0 percent. That plateau is real and it is
about ten people in a thousand.

**The shape is not a retention curve problem.** 31.2 percent of the people who
put something in are still there in week one, which is a good number by any
published benchmark. The ninety day shape is decided on the landing surface,
five seconds in, before anybody has had a chance to be loyal or disloyal.

---

# 5. THE FIX LIST

Counterfactuals from the same script, one fix at a time, everything else as
built. `node tools/flowsim.js --fixes`. Ordered by people at day 30 recovered.

| Fix | +day 30 | +puts in | +reaches a release | File |
|---|---|---|---|---|
| 1. Bring the landing surface to the working floor of 12 choices | **+28** | +199 | +10 | `atuned_src/ui/ui.js`, `atuned_src/shell/body.html` |
| 2. Make 63 answered questions reach the wheel | +9 | 0 | +3 | `atuned_src/engine/intake.js` |
| 3. Make an ordinary first entry commit | +7 | +42 | +4 | `atuned_src/engine/sniff.js`, `atuned_src/engine/lexicon.js` |
| 4. Wrap the tab strip so nine doors are visible at 390 | +3 | +42 | +1 | `atuned_src/shell/body.html`, `atuned_src/shell/head.html` |
| 5. Say nothing rather than guess a family | +2 | 0 | +1 | `atuned_src/engine/sniff.js` |
| 6. Put the record and today's line where a phone can reach it | +2 | 0 | 0 | `atuned_src/ui/cone.js`, `atuned_src/ui/ritual.js` |
| 7. Connect an entry path to the release gate | +1 | +2 | **+29** | `atuned_src/engine/compute.js`, `atuned_src/engine/intake.js` |

**All seven together: 242 of 1000 at day 30, against 14 as built.**

That is seventeen times the base and far more than the sum of the parts, which
is the important result in this table. The fixes are not independent. Each one
opens a gate behind which the next one is waiting, so fixing one and measuring
it will understate it, and fixing one and stopping will look like a failure.

**Ordered by people recovered per unit of work, rather than by people alone.**

**One afternoon each, and do these first.**

- **Fix 5, the guess.** One condition in `engine/sniff.js`: when no adjective
  matches, say nothing instead of firing the band's modal family. It is the
  smallest item in this document and it is the one that stops the product
  telling a man who screamed at his son that he is arrogant.
- **Fix 6, the record where a phone can reach it.** Move the streak, the
  ledger and "Today is not on the record yet" onto the Ritual tab, which is
  visible at 390 and is where a person would look for it. `ui/cone.js` already
  holds `ladderHtml` as a function, so this is a call site and a host.
- **The next mark's tense.** A second string per mark in `engine/ladder.js`,
  future tense, used when the mark is `next` rather than `earned`. One field.
- **The ledger's label.** "Minutes practised" becomes "Minutes planned", or a
  done control is added to the ritual and the label becomes true. The label is
  the cheap half and the honest half is the control.

**A week each.**

- **Fix 4, the tab strip.** Wrap to two rows. Nine doors at 390 with no hidden
  scroller. It also unblocks fix 6 and half of fix 1.
- **Fix 3, the sniffer.** The measured target is explicit: an eighteen word
  first person sentence should commit. It currently needs 250 words. This is
  `engine/lexicon.js` coverage and a `0.35` per touch weight that cannot reach
  a gate of 4.
- **Fix 1, the landing surface.** 75 first viewport choices to under 20 is not
  one afternoon, and it is the largest single recovery in the document at 199
  people putting something in. Remove, hide, shrink, organise, in that order,
  which is skill rule 7. The first candidate is the left rail's nine charge
  fields and twenty one law fields, which are the instrument's own controls and
  not a stranger's.

**A ruling before any code.**

- **Fix 7 and fix 2 are one decision.** Either the intake seeds charge the way
  `engine/seed.js` does, or the release gate of `sq >= 4` moves, or the intake
  surface states plainly that it measures integrity and that the wheel is
  filled elsewhere. Any of the three closes the break. Choosing none of them
  leaves sixty three questions ending at "nothing is carrying", which costs 37
  people directly and caps the release at 4 in a thousand.
- **The four doors.** Either doors two, three and four write something, or the
  sentence "any one of them fills this page" changes. The sentence is currently
  false for three of four and it is the first instruction a stranger reads.
- **The sixteen types.** Either the seed moves the headline, or the headline is
  withheld until a law is measured. Printing 36 percent Incoherent identically
  for all sixteen is a number about the default, which is the exact thing the
  unread gate exists to prevent, arriving through a door the gate does not
  watch.

**Then, and only then, the documents.** `TASKS.md` section 2f and the
`CLAUDE.md` open list say undo, the onboarding and the signal test are not
built. All three are built. Correcting that costs minutes and it stops the next
person spending a day on work that is finished.

---

# 6. WHAT TO INSTRUMENT

So the next round can answer this from data rather than from a model. Six
counters, all local, none of them personal.

1. **Simultaneous choices in the first viewport, per surface, per breakpoint.**
   The measurement in section 2 was made by hand this run. It should be a gate.
   `tests/design.js` already walks every surface at both sizes and could assert
   a ceiling.
2. **Time from navigation to the first interaction with anything.** The model's
   largest loss is a surface that does not get pressed. That is one timestamp.
3. **Word count of a first story entry, and whether Commit was enabled.** This
   is the model's own load bearing assumption and it is two integers.
4. **Which of the four doors was pressed, and whether the field changed within
   sixty seconds.** This is the break in section 3 turned into a counter.
5. **Whether a saved ritual was ever followed by a second save on the next
   day.** The streak is the only pull in the product and nothing measures
   whether it pulls.
6. **Whether a release was ever reached, and by which route.** Four in a
   thousand is the model's number. The route is what says which fix worked.

---

# 7. HOW THE MODEL COULD BE WRONG

Named honestly, biggest first, with the sweep beside it.
`node tools/flowsim.js --sweep`.

### The One That Would Most Change The Answer: The Load Gate

I expected the first entry length to be the load bearing assumption. The sweep
says it is not. The load gate is.

The gate is `p = 1 / (1 + log2(choices / 12))`. The floor of 12 is from the
skill file and the choice counts are measured, but the **shape** is mine. It is
one plausible curve out of many and nothing in the repository or in the
literature fixes it.

| Floor | Puts something in | Day 7 | Day 30 | Day 90 |
|---|---|---|---|---|
| 4 choices | 64 | 21 | 9 | 5 |
| 8 choices | 81 | 24 | 11 | 8 |
| 12 choices, as used | 104 | 33 | 14 | 11 |
| 20 choices | 149 | 45 | 20 | 13 |

And turning the gate off entirely, which is counterfactual 1, moves "puts
something in" from 104 to 303 of 1000. **So somewhere between a third and two
thirds of everything this model reports as lost is attributed to one curve
whose shape is a judgement.**

If cognitive load does not cost people at anything like that rate, the funnel
above is too pessimistic by a large factor and fix 1 drops out of first place.
If it costs more, every other fix is being measured behind a wall.

**This is testable and it is cheap.** Five people, which is the skill file's
own floor, on the Field surface at 390 and at 1600, with one task: do the thing
the page is asking you to do. Five sessions surface about 85 percent of the
problems and would replace the model's largest guess with an observation.
Nothing in this document should be spent against until that test is run.

### Second: First Entry Length

Lognormal, median 45 words, sigma 0.8, because the surface gives no guidance.
The measured `p(commit) = words / 249` is linear in it, so it matters.

| Median words | Puts something in | Day 7 | Day 30 | Day 90 |
|---|---|---|---|---|
| 20 | 92 | 31 | 12 | 8 |
| 45, as used | 104 | 33 | 14 | 11 |
| 90 | 113 | 38 | 17 | 12 |
| 150 | 122 | 41 | 17 | 12 |
| 250 | 134 | 47 | 20 | 15 |

Less load bearing than expected. Even at 250 words, which is generous for a
first journal entry with no prompt, the funnel moves by 30 of 1000. The story
path is capped by everything upstream of it.

### Third: The Phone Share

60 percent, judgement, anchored on `DESIGN-mobile-icp.md:564` and the
`RESEARCH-icp.md` finding that five of seven arrivals come from a person rather
than an ad.

| Phone share | Puts something in | Day 7 | Day 30 |
|---|---|---|---|
| 20 percent | 121 | 39 | 21 |
| 40 percent | 113 | 36 | 18 |
| 60 percent, as used | 104 | 33 | 14 |
| 80 percent | 96 | 30 | 11 |

Monotonic and modest. The phone is worse overall but better on the load gate,
and the two partly cancel.

### Fourth: The Two Onboarding Rates

0.82 to start and 0.94 per transition are the softest measured-adjacent numbers
in the model and together they account for 310 of 1000. Sweeping the start rate
from 0.6 to 0.95 moves the day 30 figure from 13 to 17 of 1000. It changes the
ranking of friction points 2 and 3 against 4 and 5, and it does not change the
conclusion.

### Fifth: A Withdrawn Claim

The first version of this model said `return2With` was calibrated so the phone
cohort reached the 9 percent seven day return in `DESIGN-mobile-icp.md:372`. It
cannot be. The as built funnel loses about 90 of every 100 arrivals before an
action, so 9 percent of arrivals returning inside a week is above the ceiling
of everybody who got anywhere at all. That document measures return among
people who reached an action, and this one measures it among arrivals.

The claim was withdrawn rather than the arithmetic bent. The rate is now
labelled judgement and the gap is reported instead of being closed.

### What Would Not Change

The four measured breaks do not move with any parameter, because they are not
parameters.

- Thirteen of fourteen of the repository's own persona lines return zero
  imprints, so the Commit button is disabled on them.
- No amount of story text, up to 996 words, puts a single address at the
  release gate.
- The intake writes no charge, so sixty three questions cannot reach the
  release either.
- Three of the four doors write nothing, on a page that says any one of them
  fills it.

Those four are facts about the code at md5 8d12924ca0dc92efe9663710f940e36c.
They would be true if every judgement in this model were wrong.

---

## The Grade Delta

| | As built | With the seven fixes |
|---|---|---|
| Puts something in, of 1000 | 104 | 303 to 340 |
| Reaches the release, of 1000 | 4 | 33 |
| Still there at one month, of 1000 | 14 | 242 |
| Earns Seven days, of 1000 | 0 | above zero, and it needs a done control to be true |
| Grade | **D** | **B minus, and the ceiling is the 29.3 percent panel buy rate** |

The D is not for the instrument. The instrument reads, and every measured
finding in this document is about the twenty seconds between a person landing
and the instrument getting anything to read. The product's problem is not that
people leave. It is that 896 of 1000 never arrive at it.

---

## What This File Is Not

It is not evidence about people. It is a model with its sources named and its
largest guess flagged for a five person test.

The measured half is evidence about the code, and it was taken twice, at two
different md5s, in a working tree that something else was rebuilding while this
ran. Every measurement held across the rebuild.

**Reproduce it:**

    node tools/flowsim.js --check --sources
    node tools/flowsim.js --fixes
    node tools/flowsim.js --sweep
