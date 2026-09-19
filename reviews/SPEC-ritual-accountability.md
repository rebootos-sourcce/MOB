# Module 05, Ritual. Spec, Six Passes And The Rulings

Ines Halldors, creative director, 19 September 2026. Written against the live
build at commit `b1aa0d8`, `source.html` md5 `2a2710c2894d7f60d8c59d9082af3d2a`,
booted in Chromium at 390 by 844 and at 1600 by 1000 and probed, not read from
memory. Every number attributed to a probe below was produced this session and
the probe is named beside it.

Six passes, and they are six different passes rather than one pass repeated.
Nothing here is recommended on taste. The ICP sample and the focus group sample
are reported with the findings, at the end, at their stated weights.

---

# Part 0. The Owner's Source Document, Reconstructed

`docs/RITUAL-ACCOUNTABILITY-source.md` is in the repo as of `b1aa0d8` and it is
a ten line stub. The body was a paste in the spawning conversation and it is not
on disk. So the substance is restated here, and the build specs against this
section. Where a fact below could not be verified against anything in this
repository, it is marked **unverified in repo** and the reason is given. That is
not a challenge to the owner. It is the difference between a fact the gates can
hold and a fact only he can confirm.

**The module.** Module 05, tab label Rituals. Quick Release is surgical: one
fetter, timed, done. The Ritual Builder is rehabilitative, the repeated
container that rebuilds capacity after the charge comes off. Stage EMBODY. Built
from what cleared.

**Bible 399.** The loop that makes it load bearing. A release should produce the
ritual, and a completed ritual should produce tomorrow's prompt. Nothing else in
the product closes that circle. **Unverified in repo:** `BIBLE.md` here is 158
lines, so 399, 1110, 1111 and 1133 are line numbers in the owner's own codex and
not in this file. Treated as his law, recorded as such.

**June 2026 ruling, which overrides the older four tab spec.** No tab bar inside
the module. Page 1 is ritual home, streak banner plus active rituals. Page 2 is
the opened ritual, step list with per step X and check marking, then Submit, End
ritual, Edit ritual. Edit is one level deep off page 2. Nothing goes three pages
deep. The X and check marking replaced the step by step session runner entirely.

**September 2026.** 10,000 simulated arcs over seven navigation configurations.
Winner at 0.94, calendar plus card slider. Two taps to mark a day, four taps to
add a card. Categories live on the add screen and not on the landing, and
putting them on the landing is what cost the tab versions their score. Panel
result 71 percent weekly. Highest single lift is the 22:00 mark the day push,
plus 6. **Unverified in repo:** `PANEL-10k.md` is a 10,000 member audience
simulation and carries no navigation configurations, no 0.94, no card slider and
no 22:00 figure. The September arc simulation is a separate artefact and is not
on this machine.

**Reminders rule.** One push per card at the time it runs, plus one to mark the
day. Quiet hours respected. Nothing else pushes.

**Locked interaction mechanics, from the look dev arc.** Hold to complete, 1.5
seconds, with immediate press feedback. The circle is the complete target only
and the row is the expand target only, and they never overlap. No
`position:sticky` anywhere. Section bars are straight edged.

**The accountability game.** The owner's own, 2024, TULA page 219. Identify and
release 20 prompt based patterns per day for one week, 140 total. One big goal.
A cohort. And the line that carries it, which the person writes themselves and
the app never edits: "What's at stake for you not doing this?" At the end of the
week the app shows them their own sentence next to what they actually did.

**Why it is not a habit tracker.** Broken integrity creates somatic charge. In
CQ = (Intention x Integrity) / Resistance, Intention is set at the read and
Resistance only comes off through release, so Integrity is the only term a
person can act on today. An accountability module here is the only user facing
control on a formula term. **Verified in repo:** `DECISIONS.md` line 1009,
"integrity over resistance, and every one of those is a sum over things the
instrument already measures", and line 1019, "integrity, which is bandIg over
ten". The claim holds against the code.

**Bible 1110.** The map lives in Ritual. Integrity, kept, broken, open, streak
per step. A broken row is neutral and only the streak compounds.

**Bible 1133.** Nothing resets to zero. One grace day free. A miss beyond it
halves the streak rather than ending it. Verified by the owner: 7 kept, miss,
kept on grace reads 8; two missed reads 4; never 0.

**What the mirror doc says to kill.** Soul Bux. Streaks as a bare number, which
it calls a guilt engine. Any badge that is not a released node. The governing
principle is subtractive: the win condition is an empty cloud, and the Map fills
as the cloud empties.

**The join.** A ritual step is a promise. Keeping it moves Integrity, Integrity
moves Resistance, Resistance is the load, a seat whose load drops crosses a
state boundary, and Vitality rises. Accountability is the input, Vitality is the
readout, the crossing is the receipt.

**Added today, and it is new scope.** It should act like a calendar ritual
builder and accountability tracker. It works with the sniffer to detect stories
so it can automate a release protocol. A person can add new behaviours, for
example transforming communication. There are defaults: gratitude, affirmation.
There is work we want done around the app: set the boundary, set the avatar.
Ritual becomes the third button in the navigation. The accountability tracker
pushes things to do, to the mobile device and to the app, all driven by the data
in the app. And if you fail, the accountability needs to go into a story saying
why.

## The Arithmetic Finding Hidden In Bible 1133

The owner's own three verified cases settle a choice the code would otherwise
have to guess. 7 kept, one miss absorbed by grace, one kept reads 8: so the
grace day neither increments nor halves. Two missed reads 4: from 7, the first
miss is grace and the second halves, and 7 halved reads 4. So **the halving is
ceiling division and not floor**. Floor gives 3 and contradicts his stated 4,
and `Math.floor(1/2)` is 0 and contradicts "never 0".

    streak after a miss beyond grace = Math.max(1, Math.ceil(s/2))

    7 -> 4      4 -> 2      2 -> 1      1 -> 1

That one line is load bearing, it is derived from his numbers rather than
chosen, and it is gate 1 in section 10.

---

# Pass 1. Intent. What This Module Promises, And Whether A Calendar Pays It

My own pass, before anybody else cuts at it.

**The promise.** Every other surface in this product reads. Ritual is the only
one that claims something comes back. Release takes charge off an address, which
leaves a hole, and the Bible's own product line is that the instrument says what
is running you. It does not say what fills the space. Stage EMBODY is the
answer, and the sentence is: **what you cleared stays clear because you built a
container around the hole it left.** That is a rehabilitative claim and it is
the largest claim in the product, because it is the only one that survives the
person putting the phone down.

**Does a calendar deliver it.** A calendar delivers cadence, not capacity, and
that is the right instrument anyway. Rehabilitation is dosage over time, and
dosage over time is the one quantity a reading cannot show. The wheel shows
state. The record shows two states and the distance. Neither shows repetition,
and repetition is the mechanism. So yes, on one condition.

**The condition, and it is the whole design.** Every calendar in every habit
product is a demand surface, because an empty cell is an accusation and thirty
empty cells against thirty is a count against a total drawn as a grid. This
product's standing ruling is that a reading is not a score and a count is never
printed against a total. So the calendar ships as a **record of days that
happened**, and future cells are drawn as numerals with no cell chrome, no ring
and no state. Nothing on the grid is ever empty, because nothing in the future is
ever asked. That single move is what makes a calendar legal here.

**My library, for once said out loud because it is doing work.** The closest
analogue this product has is a flight instrument, and every good one shows
current state and rate of change and never the pilot's record. An altimeter does
not report how many times you landed badly. The calendar is an altimeter of
practice, and the step streak is the rate of climb, and neither is a logbook.

**One word per concept, and it bites immediately.** The owner's tab label is
Rituals and his navigation instruction is Ritual as the third button. The menu
rule is one word naming exactly what the surface does. A person builds a ritual,
singular, and then keeps it. **Ruled: the tab word is Ritual.** The module in
documentation stays Module 05.

**What would make this the shelf.** Diane, the heaviest ICP in the roster at 180
of 1,000, says it in `RESEARCH-icp.md` section 4: "Does it give me back an hour
or does it give me another practice to fail at. I have a shelf of those." A
calendar of daily cards is, on its face, exactly the shelf. The only thing
separating this module from every habit app on her phone is that the card came
off a release and says so. **So the origin line is not decoration, it is the
module's entire differentiation, and a card without one has to admit it.**

---

# Pass 2. The Game Director On Push, Against The Commercial Case

Put to Ngozi Achebe-Lindgren. `reviews/game-design.md` is hers and its refusal
list is explicit. Quoted from her own file: "the notification that names an
absence" is on it, beside the variable ratio reward, the loss framed streak, the
artificial scarcity timer, the near miss, the social pressure nudge, the dark
pattern on cancel and the resource drip. Her rule under all of it: a person must
be able to stop and be glad they used it.

## Her Argument Against The Owner's Push Requirement

**One. A push is a behavioural intervention and this population was selected for
load.** `PANEL-10k.md` puts 2,673 of 10,000 in the reachable audience below CQ
21, which `DESIGN-progression.md` section 4 treats as the acute band. A
notification is the only part of the product that arrives without being opened,
so it is the only part that reaches somebody who did not choose to be reached.

**Two. The 22:00 mark the day push is structurally a push that names an
absence.** This is her sharpest point and it is correct as stated. A push that
asks a person to mark the day only fires usefully when the day is unmarked. Its
trigger condition is the absence. You cannot separate the copy from the trigger
by rewording it, because the absence is what selected the person for the send.

**Three. The measured lift measures compliance, not capacity.** Plus 6 weekly
from a mark the day push is a measurement that people marked more days. The
module's claim is that capacity came back. Those are different quantities and the
product must not let the cheaper one stand in for the dearer one.

**Four. Her own number for the other side, offered unprompted.** Patel et al.
2016, *Annals of Internal Medicine*, thirteen weeks, four arms, a seven thousand
step goal, proportion of participant days hitting it: 0.30 control, 0.35 gain
framed, 0.36 lottery, 0.45 loss framed. So refusing the loss frame costs about
22 percent of adherent days. She states it and refuses anyway, and she labels it
as a walking trial with a cash incentive and not a prediction about this build.
That is the standard of honesty this document is held to.

## The Commercial Case Back

Camille Boucher on the funnel, Theo Lindqvist on reach.

**One. The retention curve is not a manipulation problem, it is an existence
problem.** `reviews/simulation-quarter.md` section 6.3 measures day 7 retention
at 13.6 percent and day 30 at 5.9 percent. Section 6.4 measures engaged minutes
falling from 123 on day one to 14 in month one. A product at 5.9 percent on day
30 does not get to decline the highest single lift in the owner's own
simulation. Refusing it is not restraint, it is a decision that the module
should not work.

**Two. The highest value ICP is a referrer and a referrer needs a returner.**
Sofia, 140 of 1,000, holds the best day 30 in the roster at 22 percent and she
brings clients. `RESEARCH-icp.md` finding: five of the seven who arrive name a
person and not an ad, so the acquisition channel is referral carrying a number.
A client who never returns never refers, and the module that produces the return
is this one.

**Three. The push is the only mechanic that reaches the person at the moment the
practice runs.** `RESEARCH-ladder.md` section 6.6 rates the if then plan as the
highest evidence item in the entire repo at d = 0.65 and calls it the cheapest
thing in the file. Gollwitzer's contingent format is a cue at a time and a
place. A push at the card's run time is that cue, delivered externally, and
there is no in app substitute because the person is not in the app.

## My Ruling

**Both seats are right and the disagreement resolves on the copy, not on
whether it fires.** The push ships at full strength and the refusal holds
literally, because the refusal was never about the timing.

1. **The card push ships unchanged and it is the one Ngozi does not contest.**
   One per card, at the card's run time, naming the practice. That is the if then
   cue at d = 0.65 and it is the strongest evidenced thing available.

2. **The 22:00 push ships, and it is not a mark the day push.** It is a close
   the day push and it carries the person's own content: the step name that ran,
   or their own stake sentence. It fires **only while a season is running**,
   which is the fix for her point two. During a season the day is a bounded
   object with an end, so the trigger is the season and not the absence, and the
   push fires on a marked day and an unmarked day identically. That is what
   breaks the structural link she correctly identified.

3. **The copy rule is already in the repo and it becomes law here.**
   `DESIGN-progression.md` line 890, approved research: a notification may name
   the practice and it may never name the gap. Section 9 of this spec holds
   every string against it.

4. **No push at acute, and no push during an absence.** If no season is running,
   the day push does not exist. There is therefore no send during a lapse, which
   is the case `RESEARCH-ladder.md` section 2 designed for explicitly.

**The honest cost of my ruling, stated as a cost.** Plus 6 was measured on a
mark the day frame. Moving the frame from compliance to account will cost some of
it. My estimate is plus 3 to plus 4 weekly, it is an estimate and not a
measurement, it is mine and not hers, and it is replaced by our own number from
the first thousand people.

**Recorded, not smoothed.** Ngozi does not concede point three. Her position on
record: a lift measured on marking days is not evidence about capacity, and she
wants the module instrumented so that marks and released patterns are reported
separately and never as one figure. I agree with that and it is section 10 gate
5. She does concede point two once the season gates the send, and she says so.

---

# Pass 3. The UX Architect On Two Pages, The Calendar, And The Load

Put to Dani Sorensen. `reviews/uiux.md` is hers and pass 3 of it is the
cognitive load count.

## The Measured Position She Starts From

Desktop, 1600 by 1000, deduped, above the fold, from her own file:

    story 111   knowledge 98   energetics 90   summary 86
    settings 85   compass 80   field 77   body 70
    mean 87, range 70 to 111

Phone, 390 by 844: 16 to 35, mean 25. The repository had recorded 57 to 71 and
it has grown, which is her point: an architectural decision with no gate is a
preference. Constant chrome is 63 to 73 of every desktop screen, so between 72
and 90 percent of every screen is furniture.

## Her Read On The Two Page Ruling

**She supports it without reservation and she is the seat most likely to have
objected.** Two pages plus sheets is the flattest structure in the product. Her
one refinement, and it is the rule that lets new scope land without breaking the
June ruling:

> **Depth is counted in pages. A sheet is not a page. A sheet may not open a
> sheet.**

That resolves the only real collision in the owner's new scope. Categories live
on the add screen, and the add screen cannot be a page because Edit already
occupies the one level off page 2. So Add is a sheet over page 1, the day view
is a sheet over page 1, the failure account is a sheet over page 2, and Edit is
a full bleed sheet over page 2 that reads as a page and returns to page 2. The
June ruling survives intact: page 1, page 2, Edit one level off page 2, nothing
three pages deep.

## Her Read On The Calendar

**The calendar is one decision group, not thirty controls, and the rule is
already in her own file.** Pass 3 of `reviews/uiux.md`: a homogeneous set with
one label and one consequence counts as one group, and she wrote the exemption
for the 112 address catalogue for exactly this reason. A month grid is one
decision with about thirty options.

Page 1 counted her way:

    season banner       0 groups   a readout, no decision
    calendar            1 group
    card slider         1 group
    add a card          1 control
    total               3 groups

Against a target of under twelve and a working memory of about four, **page 1 is
the lightest surface in the product and it should be.** She notes that this is
the first surface specified after her ruling and it is the proof the ruling
works.

## The Debate We Actually Had. The Third Button

**Her argument.** The bar is eight today, verified by probe: `TABDEF` reads
Energetics, Story, Field, Body, Compass, Knowledge, Games, Summary.
`reviews/simulation-quarter.md` D10 measures that on a phone 48 percent of the
navigation is already off screen, and `reviews/uiux.md` F18 records that the bar
becomes a horizontal scroller at 1100px with `data-end` flipping to 0, which is
rule 10 broken: a control hidden with no affordance. A ninth entry makes a
measured defect worse, and there is a free slot: Games is touched by 14 percent
and has "Phase Two: Not built" printed on the page, per her own feature table.

**My argument.** Position three is not an arbitrary slot. The bar reads left to
right as say, see, and the thing they add up to. Ritual is the act between
saying and seeing, and putting it after Body buries the one surface whose job is
to be opened on an ordinary Tuesday. And Games came back out of the fold on the
owner's own ruling, which is recorded in `engine/core.js:92`, so I cannot spend
that slot.

**My ruling.** The bar goes to nine, Ritual at display index 2, and the bar
wraps at narrow widths rather than scrolling, which is the fix F18 already names
and the markup already allows. That fixes a measured defect in the same pass
rather than deepening it.

**Escalated to the owner as one line, because the slot is his:** if the bar must
stay at eight, the candidate to fold is Games, and folding it reverses a ruling
he made. One sentence from him settles it and nothing else in this spec depends
on the answer.

## Her Read On The Locked Mechanics

All four hold and none of them costs anything.

- **Hold to complete, 1.5 seconds, immediate press feedback.** She notes this is
  the correct control for a destructive-adjacent act with no undo, and it is
  `atuned-ux` rule 5 satisfied by a different means: a hold is reversible by
  releasing, so it needs no confirm dialog.
- **The circle completes, the row expands, never overlapping.** Buildable at 390
  and she specified the geometry: a 44 by 44 ring at each end of the row, and the
  expand zone is the span between them, minimum 44 tall. At 390 wide that leaves
  302px of row, which carries a 48 character name at the sub bar size.
- **No `position:sticky`.** Held. The calendar scrolls with the page and the card
  slider is a horizontal scroller with visible edge fade, not a sticky element.
- **Straight edged section bars.** Held, and it agrees with the Bible's no boxes
  line at top level.

**One refusal she adds and I accept.** Two marking controls on a row is two
decisions where the owner's spec implies one act. She wants the check as the
primary ring and the X as the secondary ring with lower contrast, so a person
scanning sees one target and a person who needs the other finds it. Ring not
fill on both. That is craft and it goes in section 4.

---

# Pass 4. The Narrative Director On Every String

Put to June Okonkwo-Lund. She reviewed thirty one strings and the two that
matter are the stake sentence and the failure account.

## The Stake Sentence

The owner's line, verbatim: **"What's at stake for you not doing this?"**

Her finding, stated as a defect so it can be weighed: it is a double negative,
it carries a contraction where the house voice uses none, and "this" dangles
with no antecedent on screen.

**Her ruling: keep it exactly, unedited, and do not house style it.** Three
reasons and the third is the one that decides.

1. It is the only line in the product written in the owner's spoken register,
   and the register is the content. It is a question one person asks another. A
   mechanical rewrite would make it a question software asks, and software has no
   standing to ask it.
2. The dangling "this" is answered by the goal the person typed one field
   above. The antecedent is theirs, which is the point.
3. **It is the only line in the product Marcus cannot argue with, because he
   wrote it.** Marcus is 160 of 1,000 and `RESEARCH-icp.md` records him as the
   ICP who closes the tab in four seconds and will argue with any claim. The
   person's own sentence is unfalsifiable in the one way that is honest.

**Rules attached.** The app never edits it, never truncates it in the render,
never offers a placeholder or an example, and never scores it. It is stored
exactly as typed including the punctuation. At the end of the week it is printed
in full beside the days, which is the owner's own instruction and it is the whole
mechanism: his sentence against his record, with no third sentence from us in
between.

## The Failure Account. The Most Delicate Copy In The Product

**The instruction.** If you fail, the accountability needs to go into a story
saying why.

**Her danger, and it has a precedent with a body count.** `RESEARCH-icp.md`
claim three: Angela was handed the word Incoherent and closed the app, and Ana,
the persona actually in crisis, would land in the bottom bands and be handed
Corrupt. The finding was that a moral adjective delivered by software to a person
in load is a verdict, and a verdict ends the relationship at the moment the
product is supposed to begin. **"You failed, now write why" is that same
mechanic with a text box attached.** It is worse than a band word, because a band
word is about arithmetic and this would be about a promise.

**The commercial argument for it anyway,** from the sales seat and it is strong:
the failure account is the single best story generation mechanic in the product,
because it produces text on the day the person is most charged, and
`reviews/simulation-quarter.md` D3 measures that the story reader returns nothing
for 85 percent of ordinary writing. A charged, specific, first person account of
why a promise did not hold is the highest quality input the sniffer will ever
get.

**Her resolution and my ruling.** It ships, and the framing is mechanical, and
the word never appears.

- The state word in the data is **broken**, per Bible 1110. The state word on the
  surface is nothing at all: an unfilled ring.
- The prompt is one line and it names the mechanism rather than the person:

      The step did not run. Say what got in the way.

- Under it, one line that says what the text is for, because this product's own
  transparency law says a mirror you cannot inspect is not a mirror:

      This goes to the reader like any other account. It is charge, not a
      confession.

- No placeholder. No example. No character count. Skip is always present and is
  as large as Save.
- **Not offered at acute.** `DESIGN-progression.md` section 4.3 removes the
  commercial and comparative layer at acute. An account of a broken promise is
  neither, but it is an ask, and the rule there is that a disabled control still
  asks a question. So at acute it is absent from the render and the day is marked
  and nothing else happens.
- The word fail, failure, failed, missed, behind, should and streak do not appear
  in any string in this module. Section 9 is the string table and the terms gate
  enforces it.

## The Rest Of The Strings, Ruled

Headers take title case, ruled 19 September. Body copy is sentence case.

    Today                        page 1 header
    The Week                     season banner header
    Add A Card                   add sheet header
    Edit Ritual                  edit sheet header
    From                         origin label on a card
    Kept                         data word, never rendered alone as a score
    Nothing runs today.          empty state, cards exist, none due
    One day free.                the grace line, printed once at season start

**Two words she kills.** "Complete" as a verb, because the product uses run.
And "track" as a noun for a card category, because `PRACTICE` already uses track
for the four practice tracks and one word per concept forbids the second
meaning. The card grouping word is **family**, which is already the Bible's word
for an icon set, and the families are named in section 5.

---

# Pass 5. The Systems Director On The Schema

Put to Yuki Brennan. `SCHEMA_V` is 2 at `engine/schema.js:13`.

## What The Profile Carries Today, Measured

Probe, `blankProfile('x')` in the live build, keys in order:

    v id name created updated soul axes who seed meter plan avatar purpose
    laws intake gates story rituals history

`rituals` is a flat array of save records, shape
`{t, track, band, steps:[practiceKey], min}`, written at `ui/ritual.js:70`.
**That is a log and not a container.** It has no identity per ritual, no per step
state, no run time, no day ledger and no origin. Nothing in the module the owner
described can be stored in it.

**Her verdict on the existing module, and it is the finding behind contradiction
4.** `ui/ritual.js` is 74 lines. It is a practice picker overlay that pushes one
record per save. `engine/ladder.js:33` `pracDays` reads `p.rituals` and nothing
else, so the record counts ritual saves and not ground opened, which
`reviews/game-design.md` finding 6 already measured and which this session
reproduced: a profile with 8 saved rituals and zero release runs reports 8 days
and `meter.unique` of 0.

## The Addition. Schema v3, Additive

A v1 or v2 profile loads with `ritual` filled from the blank, which is the
migration pattern the file already uses for gates at `:68` and for renamed laws
at `:62`.

    /* v3. Ritual. Additive: a v1 or v2 profile has no cards, no marks and no
       season, which reads as nobody having built one yet. Saving upgrades it.
       p.rituals is NOT touched and NOT migrated away. It keeps its shape and
       its readers forever, per the port rule. */
    ritual:{
      cards:[],                 /* array, cap 60, refused by name above that */
      marks:{},                 /* dateKey -> cardKey -> mark. cap 730 dates */
      season:null,              /* null, or the season object */
      grace:{usedOn:null},      /* ISO date of the one free day, per season */
      push:{card:true, day:true, quiet:{from:'22:30', to:'07:00'}},
      seeded:false              /* true once the v2 rituals log was read across */
    }

### The Card, Field By Field

    k          string 8..16, unique within cards. 'c'+base36 time+4 random
    nm         string 1..48. the person's own words, or the default's
    fam        'body'|'somatic'|'energy'|'mind'|'voice'|'ground'
    seat       one of the seven seat names. drives the colour. never free text
    ic         string 0..160, the ring path from the icon catalogue
    min        integer 1..120, the stated run length
    at         ISO, created
    from       null, or {node:int 0..111, name:string, band:string, t:ISO}
               null means a default or hand built card and the surface says so
    steps      array 0..12 of {k:string, nm:string 1..64, how:string 0..280}
    run        null, or {h:int 0..23, m:int 0..59}. null means no push
    days       array of int 0..6, empty means every day
    pausedAt   null or ISO
    retiredAt  null or ISO. a retired card is kept and is reachable, never deleted
    weight     bool. false on the around the app cards. false never feeds the
               season or the streak

### The Mark

    ritual.marks['2026-09-19']['c1a2b3'] = {
      s:'kept'|'broken'|'open',
      at:ISO,
      why:null or a story entry id,
      steps:{ '<stepk>':'kept'|'broken' }
    }

`open` is written by the day roll and not by the person: a day that passed with
an active card and no mark is open. Open is not broken and it never halves a
streak. That is three states plus the streak, which is Bible 1110 exactly.

### The Season

    n          integer 1..999, the season number
    startedAt  ISO
    endsAt     ISO, startedAt plus seven days
    stake      string 0..280, verbatim, never edited
    goal       string 0..140, the one big goal
    target     integer 1..400, default 20, the daily number
    cohort     string 0..64, stored and not rendered in phase 1

## Validation At The Boundary

In `validateProfile`, `engine/schema.js:134` to `:237`, in the style already
there: typed, bounded, refused by name, never clamped.

- `fam` not in the set of six is **refused by name**. A clamped family is a card
  wearing another family's colour, and the colour means something.
- `season.target` outside 1..400 is refused by name and never clamped, because a
  clamped 9999 reads as a 400 nobody entered, which is the exact failure the
  boundary comment already warns about.
- `marks` keys must match `/^\d{4}-\d{2}-\d{2}$/`. A malformed key is refused by
  name. The date count is capped at 730 and the excess is refused by name.
- `cards` capped at 60. `steps` capped at 12 per card. Strings bounded as above.
- `seat` must be one of the seven. `node` must be an integer 0 to 111.
- `stake` is length checked and **not otherwise touched**. No trim, no case
  transform, no punctuation normalisation. It is the person's sentence.

## The Migration, And What Breaks

**The migration is a seed and not a conversion.** On the first render of the
module with `ritual.seeded === false`, the most recent entry in `p.rituals`
becomes one card: `nm` from its track, `fam` mapped from its track, `steps` from
its practice keys resolved through `PRACTICE`, `min` from its `min`, `from` null.
`seeded` flips true and `pSave()` runs. Nothing in `p.rituals` is read again and
nothing is deleted. A person who used the overlay arrives with their steps
already on the calendar.

**Named diffs for `tools/equiv.py`, because an intended change is a named diff
you acknowledge rather than a silent one:**

    TAB                gains RITUAL:10. no existing integer moves
    TABDEF             gains one entry at display index 2
    streakRead         body changes: grace day, ceiling halving, reads ritual.marks
    pracDays           kept, body unchanged. ritDays is added beside it
    MARKS week/month/season   test changes from consecutive to days in a window
    ledgerRead         clear and carry relabelled, the axis unit bug fixed
    ladderHtml         the gap sentences and the bare run number are deleted
    blankProfile       gains ritual, SCHEMA_V 2 -> 3
    validateProfile    gains the ritual branch

**What breaks if the marks are not moved off `p.rituals`.** Everything. The
streak would keep counting ritual saves, so a person could hold a hundred day
streak without running a single step, which is finding 6 with a calendar drawn on
top of it.

**Her one warning, and it is the real risk in the data.** `ritual.marks` is a
nested object keyed by date and card and it is the first unbounded growing
structure in the profile that is not a list. At 730 days by 60 cards by a step
map it is the largest thing in the file. Measured estimate: about 180 bytes per
card day, so 730 days at 6 active cards is roughly 790 KB, which is above the
178 KB saturated profile figure `DESIGN-progression.md` section 5.2 uses as its
generous case. **Ruling: the cap is 400 days of marks, not 730, and dates older
than 400 coalesce to `{s, at}` with the step map dropped.** A step map older than
a year answers no question anybody asks.

---

# Pass 6. The ICPs And The Focus Group

Nine personas from `RESEARCH-icp.md` at their stated weights, 1,000 simulated
panel members. Their charge vectors from `engine/data/people.js` drive the
reactions. **Every quotation is simulated. Nothing here was said by a real
person.**

    Diane 180   Derek 170   Marcus 160   Angela 150   Sofia 140
    James 100   Ana 50   Gordon 35   Rosa 15

## Diane, 180. HOLD, And She Is The Module's Hardest Case

"Another practice to fail at. I have a shelf of those." She is the largest
weight and her objection is the module's premise. What moves her is one thing and
it is not copy: the card says where it came from. "From Fear, Root. Released 14
March" is not a habit somebody sold her, it is the container for a hole she made
herself.

**Consequence, and it changes the build order.** If the defaults arrive before
the first release, Diane meets a shelf on day one and does not come back to check
whether it became something else. **Ruled: the two behaviour defaults do not
appear until the first release completes.** Before that, page 1 carries the two
around the app cards, which are honest structural work and are visibly not
habits, and one line and one door to Story.

## Derek, 170. BUY, Then Burns Out By Day Three

He will add twelve cards on day one and run all of them. `RESEARCH-icp.md`: "63
is nothing. I do intervals longer than that." He also runs the arithmetic
unprompted, which is the whole finding in claim four.

**The mitigation is arithmetic, not a cap and not a warning.** The add sheet
prints the day's total minutes as the card is added, and the card slider is
ordered by run time so an overloaded day reads as overloaded at a glance. No
limit, no "are you sure", no soft copy. Give him the number and he will do the
division, because that is what he does.

**Predicted outcome, honestly:** he still overloads week one. The difference is
that on day ten the calendar shows him three days at six cards and two days at
one, which is the data he needed, and he corrects instead of quitting. The
halving is what keeps him in: he is the persona most likely to miss two days
after a race, and 7 to 4 is a survivable number where 7 to 0 is not.

## Marcus, 160. RESIST, And He Is The Copy Gate

He will read every string in the module looking for the seam. The two places he
finds one: any use of the word fail, and any number printed against a total.
Both are already forbidden. The stake sentence is the one line he cannot attack.

## Angela, 150. BUY, And She Lives On The Streak

She is the reason contradiction 2 is not academic. A bare number she watches is a
number that can drop, and she is on record closing the app over one word. But the
halving is the design that keeps her, because it cannot reach zero, and the
season is what actually serves her: seven days with an end is a bounded object
and she has done six modalities looking for one.

**Her real risk in this module is the opposite of the mirror doc's.** Remove the
streak entirely and she loses the thing she came for. Print it as a bare number
and she loses the app. Section 6 threads that needle: the arithmetic exists and
drives a bar, and the number is never printed.

## Sofia, 140. HOLD, Hard, And She Wants Her Client's Screen

"I would take it for my clients before I took it for me. That is the honest
answer." She wants to build a client's ritual from her own screen. That is the
tier four cohort lead suite and `DECISIONS.md:30` already rules it: manage
profiles, build rituals and build accountability for the people you lead.

**Phase 1 must not block her path even though it cannot serve it.** A card set
is exportable as a template through the existing export seam, so she can hand a
client a set today by a route that is not a product feature. The practitioner
screen is deferred and named as deferred.

## James, 100. RESIST, And He Turns Every Push Off But One

"Fifteen minutes is a long time to spend proving something to software." He
will open notification settings before he opens the module.

**Consequence: the push controls are per kind and not one master switch.** Two
toggles, card and day, plus quiet hours. He keeps the card push because it names
the practice at the time the practice runs and it asks nothing. He turns the day
push off, and the module has to work at full value with it off, which it does,
because the in app due list is the same data.

## Ana, 50. Does Not Walk, And She Is Why The Acute Rules Exist

She is in crisis and lands in the bottom bands. At acute: season banner absent,
step streak bars absent, failure account not offered, no push. Calendar present,
cards present, add present. Nothing announces the state, per
`DESIGN-progression.md:4.1`: the product may hide what it sells and may never
hide what it measures.

## Gordon, 35, And Rosa, 15. REFUSE At Step 1

Unchanged and correctly so. Neither reaches the module. Do not redesign for
Gordon.

## Panel Ledger

Thirty one reactions recorded across the nine. Counts: BUY 6, HOLD 9, CONFUSE 3,
RESIST 9, REFUSE 4. Resistance, confusion and refusal are 16 of 31, 52 percent,
which is above the floor this exercise is held to and none of it is padding.

**The three findings that changed the spec:** Diane moved the defaults behind the
first release, James split the push toggle in two, and Derek turned a cap into a
number.

---

# Part 2. The Five Contradictions, Ruled Or Escalated

## 1. The Daily Number. 20 A Day And 140 A Week, Versus 400 A Week

**Ruled, with one line escalated.** 20 a day and 140 a week stands, exactly as
the 2024 deck states it. It is a bounded seven day object with a cohort and a
stake attached, and it is the owner's own tested design.

**Why 400 a week is almost certainly a different quantity.** 400 a week over
seven days is 57 a day, which is nearly three times the deck, and nothing in the
interaction model marks 57 of anything in two taps. Meanwhile `DECISIONS.md:19`
prices tier one at **400 patterns a month**, and one pattern is one release line.
So 400 is a supply figure and 20 is a target figure, and they measure different
things: 20 is patterns a person identifies and releases in the game, 400 is
release lines the plan affords. Conflating them turns a target into a bill.

**Ruling:** the season target is 20 a day and 140 a week. The 400 figure is
retired from this module and stays in the meter where it belongs.

**And the craft problem inside his own number, solved rather than dodged.** 20 a
day is a total, and this product never prints a count against a total. So the
target is stated **once**, at the start of the season, inside the person's own
commitment, and the daily surface never prints a fraction. The day shows marks.
The end of the week shows his sentence beside the days and what ran on them, as a
list, which is his instruction and it needs no denominator.

**Escalated, one line:** confirm 400 a week was the plan allowance and not a
second target. If it was a target, the season is unbuildable as specified,
because 57 marks a day cannot be made in two taps and the interaction ruling
would have to be reopened.

## 2. Streak Versus Season

**Ruled, and this is the one place I overrule the mirror doc.**

**Both, and the season is the surface while the streak is the arithmetic.**

Bible 1133 is law and the halving stands, because it is the only streak design
in this repository that cannot reach zero and therefore cannot produce the
abstinence violation effect that `RESEARCH-ladder.md` section 2 names as the
worst available move. The mirror doc is right about the actual harm and wrong
about the remedy: the harm is the **bare number**, not the arithmetic.

- The streak is **never printed as a number**, anywhere, on any surface.
- It is drawn **per step**, per Bible 1110, as a bar length on the step row, with
  no label and no figure.
- The expanded step row shows the last thirty days as a strip of marks, which is
  the shape `RESEARCH-ladder.md` section 6.5 specifies and `ui/record.js:66`
  already renders. No number, no consecutive count, no best ever, and no sentence
  about the days that carry no mark.
- The one number on page 1 is the season day, 1 through 7. **A thing that ends
  cannot be a guilt engine**, and that is the whole argument.

**Why I do not kill the counter outright.** Angela is 150 of 1,000 and she is the
panel member who lives on it. Killing it loses her for a harm the halving already
answers. The mirror doc's sentence survives in full: there is no streak as a bare
number in this module.

## 3. Four Tabs Versus Two Pages

**Ruled, no escalation.** The June 2026 ruling wins. It is the later ruling, it
is the owner's, and it is better: two pages plus sheets is the flattest structure
in the product and Dani's count puts page 1 at three decision groups against a
mean of 87 controls elsewhere.

The older four sub tab spec and the P1 list are retired. Their content lands
under Dani's sheet rule from pass 3: **depth is counted in pages, a sheet is not
a page, and a sheet may not open a sheet.** Add is a sheet, the day view is a
sheet, the account is a sheet, and Edit is the one level off page 2 the ruling
already permits.

## 4. Built Or Not Built

**Ruled: not built. The record that says it is built is wrong, and this is a
correction rather than a question.**

Measured this session in the live build, `source.html` md5
`2a2710c2894d7f60d8c59d9082af3d2a`:

- Nine tabs swept for the string "accountab". It appears on exactly one surface,
  Energetics, and it is the law E40 in the intake catalogue. The only other
  occurrence in the source tree is `engine/plan.js:65`, the tier four
  description. **There is no accountability surface in the product.**
- `ui/ritual.js` is 74 lines: a practice picker overlay writing a log that
  nothing reads back, which `DECISIONS.md:195` already records as a gap.
- `streakRead` has no grace day and no halving. Probe: 7 kept days, one missed
  day, then today kept, on the live build:

      streakRead -> {run:1, best:7, days:8, live:true}

  Bible 1133 says that case reads 8. **The build returns 1.** Two missed returns
  1 as well, where his verified figure is 4.
- The lapsed case still renders what `reviews/game-design.md` finding 2 measured
  and told the team to delete. Probe, 14 days ending 11 days ago, Compass:

      14 / days , last run
      The run ended 11 days ago. Longest held: 14. Practise today and a new one starts.
      Today is not on the record yet.   [Build today's ritual]

- The virgin profile still opens on a zero in the largest type, with the stray
  space before the comma from `cone.js:582`, which finding 7 measured.
- `ledgerRead` still prints nine axes and calls them addresses: "Held at the far
  pole, 0 addresses", finding 5.
- And a live violation nobody has reported: the Energetics tab prints **"0 of
  63", "0 of 21" and three instances of "0 of 3"**. Five counts against a total,
  on a surface the no count gate does not sweep, which is finding 12 on a third
  screen.

**The correction to file:** the smoke test that passed was exercising the ritual
overlay, which does exist. The Bible entry should read specified, not built.
Anything built against the "already built" record would have been built twice.

## 5. Paused Cards And The Streak

**Ruled. It is a definition and it is mine.**

**A paused card is not asked, so it cannot be answered.** It produces no row on
the day. It is not kept, not broken and not open. Its step streaks freeze at
their length and do not decay while paused, because decay would be a punishment
for a choice the product offered.

**And the correlation changes what it measures, correctly.** The 21 day window
is 21 days **with the card active**, not 21 calendar days. A paused day is
excluded from the window rather than counted as a zero, because a zero is a
measurement and a pause is the absence of one. That means the correlation
measures the card and not the calendar, which is the honest quantity and the
useful one.

**One consequence, stated so nobody is surprised by it.** A person who pauses
everything has no accountability row at all, and the surface says nothing about
it. That is correct. Pausing is not lapsing.

---

# Part 3. The Debates On Record

Six, where four were asked for. Each carries both arguments and the ruling.

| # | Seats | Question | Outcome |
|---|---|---|---|
| 1 | game director vs sales and marketing | Does the 22:00 push ship | **Ships, reframed.** Season gates the send, copy names the practice. Ngozi does not concede the lift claim and that is recorded |
| 2 | UX architect vs creative director | Does the bar go to nine | **Nine, with wrap.** Games named as the fold candidate. One line escalated to the owner |
| 3 | game director and the mirror doc vs Bible 1133 and Angela's weight | Streak or season | **Both.** Season on the surface, streak as arithmetic, no bare number anywhere |
| 4 | narrative director vs the owner's instruction, with sales arguing for | The failure account | **Ships.** Never called a failure, skippable, absent at acute |
| 5 | creative director vs game director | Is a calendar open check close | **Ships as a past only record.** No future cell is scored |
| 6 | game director vs sales director | The around the app asks | **Ship as cards with no weight.** They never feed the season or the streak |

## Debate 5, In Full, Because It Decides The Module's Shape

**Ngozi.** "The core loop is say, see, run, say again. What the loop is not is
open, check, close, and that is the shape of every product with a counter in it
and the shape this one must not take, because the thing being checked would be a
reading of a nervous system." A calendar is the canonical open check close
surface.

**Me.** The calendar is not the check. The card is the check. The calendar is the
record of what happened, and self monitoring is the strongest and dullest finding
in `RESEARCH-ladder.md` at d = 0.40, already built for snapshots at
`ui/record.js:66` and found by 6 percent of people because it is inside a folded
surface. Putting it on a top level tab is not adding a mechanic, it is surfacing
one that is already there and already evidenced.

**Ruling.** It ships, and one constraint makes it legal. **Future days are drawn
as numerals with no cell chrome, no ring and no state.** The grid never shows an
empty cell where a mark could have been, because the future was never asked.
Nothing on the calendar can be a demand, so nothing on it can be a check.

## Debate 6, In Full, Because It Is New Scope

**Ngozi.** An app that assigns the person homework about the app is the resource
drip in a new coat, and it is not in any beat of the loop. Set your avatar is not
say, see, run or say again.

**Camille.** The boundary is 30 commitments and the avatar is the becoming half.
They are the highest value data in the moat and nobody finds them: 18 percent
touched, and the simulation records the avatar door as a dead end with no link.
`runAvatarDrill` exists at `ui/drills.js:656`, behind a door tile, which is why
the owner has never seen the thing he paid for.

**Ruling.** They ship as cards with `weight:false`. They appear in the slider,
they can be marked, they **never count toward the season target and never feed a
streak**, and they retire when the underlying structure is complete:
`boundaryCount(p.purpose).filled === 30` and `p.avatar.built === true`. An app
maintenance task is not a released pattern and the arithmetic must not pretend
otherwise. And they are the only cards present before the first release, which is
Diane's fix from pass 6.

---

# Part 4. The Spec

## 4.0 The One Sentence

> **Ritual is where what you cleared becomes something you keep doing, marked on
> a calendar, and held to a sentence you wrote yourself.**

## 4.1 The Navigation Change

    engine/core.js   TAB gains RITUAL:10
                     No existing integer moves. Settings is 9, so 10 is next,
                     appended for the reason Compass was appended as 8.
    engine/core.js   TABDEF gains {k:TAB.RITUAL, id:'rite', nm:'Ritual',
                     cls:'tab-ritual'} at display index 2
    shell/body.html  #rite host, a sibling of #story and #cv, not a child
    MANIFEST         engine/rite.js after engine/ladder.js
                     ui/riteui.js after ui/ritual.js

Resulting bar, left to right:

    Energetics  Story  Ritual  Field  Body  Compass  Knowledge  Games  Summary

**What moves.** Field, Body, Compass, Knowledge, Games and Summary each shift one
position right. No integer changes, so no stored tab breaks. `TABREAL` is
untouched because Ritual is not a folded surface.

**The bar wraps at narrow widths and does not scroll.** This fixes
`reviews/uiux.md` F18 in the same pass, and the markup already allows it.

**`#rite` carries no folded surface**, per the CLAUDE.md rule that a tab host
carrying a folded surface cannot also be one. Page 1 and page 2 are two children
of `#rite` and the renderer writes each child's innerHTML, never the host's.

**The old overlay.** `#rit` and `ritOpen` stay in phase 1 with their bodies
unchanged, per the port rule. Their three callers, `ui/release.js:162`,
`ui/summary.js:476` and `ui/cone.js:504`, are repointed to
`riteGo(1)` plus a card proposal. The overlay is removed in phase 2 once nothing
calls it.

## 4.2 Page 1. Ritual Home

Header: **Today**. No back control, this is the root.

### In Order Down The Screen

**1. The season banner.** Present only while a season is running.

    THE WEEK
    Day 3 of the week.                    <- the only number on this page
    <the person's stake sentence, in full, never truncated>
    [End the week]

No fraction, no percentage, no count of patterns against 20 or 140. Day 3 of 7 is
permitted as the one exception and it is not a count against a total in the
forbidden sense: it is a position in a bounded object with a known end, like a
page number. **I am ruling that explicitly so the gate has an exemption by name
rather than a judgement call.**

When no season is running: one control, `Start the week`, and one line: "Seven
days, one goal, and a sentence you write yourself."

**2. The calendar.** A month grid, seven columns, straight edged section bar
above it, no `position:sticky`.

Per day cell, and this is the whole state table:

    kept          a filled ring in the day's dominant card seat colour
    partial       a half filled ring
    broken        a ring outline only. no alarm colour, no red, no weight change
    open          a faint ring outline at 30 percent
    no card active  the numeral alone, no ring
    future        the numeral alone, no ring, no cell chrome, never scored
    today         the numeral in the accent, ring drawn from the day's marks

Month navigation is two 44 by 44 controls. The month does not scroll past the
current month forward. Tapping a day opens the day sheet.

**3. The card slider.** A horizontal scroller with a visible edge fade, one card
per active card due today, ordered by `run` time and then by `min` ascending.

Per card row, and the geometry is Dani's from pass 3:

    [ check ring 44x44 ]  name, 48 chars max        [ X ring 44x44 ]
                          from: Fear, Root · 14 Mar
                          [ step streak bar, no number ]      12m

- The check ring is the complete target. **Hold 1.5 seconds**, with immediate
  press feedback on pointerdown: the ring begins to fill from the top, and
  releasing early returns it with no mark written. Reduced motion gets the end
  state, not a faster fill.
- The X ring is the second marking control, ring not fill, lower contrast.
- The span between the two rings is the expand target and nothing else. Tapping
  it expands the row in place to show the steps and one control, `Open`, which
  goes to page 2. **The two targets never overlap.**
- The origin line is `from: <name>, <band> · <date>`. When `from` is null it
  reads `default` or `built by you`, and it never pretends.
- The step streak is a bar. No number. No label.

**4. One control.** `Add a card`, opening the add sheet.

### Every Empty State On Page 1

    unread profile        The four doors, exactly as Summary renders them, and one
                          line: this fills from what you release. Page 1 asserts
                          no reading, and it empties itself on the way out so a
                          hidden surface never sits in the document.
    no release yet        The two around the app cards only. One line: behaviour
                          cards arrive from what you release. One door to Story.
                          The gratitude and affirmation defaults are NOT offered
                          yet. This is Diane's fix and it is deliberate.
    cards exist, none due today    Nothing runs today. Calendar and slider stay.
    all cards paused      Nothing is running. One control, Add a card. No copy
                          about the pause.
    all cards retired     Same as no release yet, plus the retired set reachable
                          from the add sheet.
    acute                 Season banner absent. Streak bars absent. Calendar,
                          cards and add present. Nothing announces the state.

## 4.3 Page 2. The Opened Ritual

Header: the card name, title case as typed. Back control top left, 44 by 44,
returning to page 1.

    <card name>
    From Fear, Root. Released 14 March.        or: Default. Not built from a release.
    12 minutes, four steps.

    [check][X]  Box breathing                     [bar]
    [check][X]  Name the three things             [bar]
    [check][X]  Say each one out loud once        [bar]

    [ Submit ]  [ End ritual ]  [ Edit ritual ]

- Per step: the same two ring targets and the same expand span. Expanding a step
  shows its `how` text and the last thirty days as a strip of marks, no number.
- **Submit** writes today's marks for every step that carries one, rolls up the
  card's state, writes the day's calendar mark, and returns to page 1. If any
  step carries an X it opens the account sheet first. A step with no mark is left
  unmarked and is not written as broken.
- **End ritual** sets `retiredAt`. It is reversible from the add sheet, so it
  gets no confirm dialog, which is `atuned-ux` rule 5 satisfied by reversibility
  rather than by a question.
- **Edit ritual** opens the edit sheet, full bleed, one level off page 2, and its
  back control returns to page 2 and never to page 1.

Empty state, a card with no steps: "No steps yet." plus `Edit ritual`.
At acute: the streak bars and the account sheet are absent. Submit still works.

## 4.4 The Calendar And The Card Slider. Two Taps And Four Taps

**Two taps to mark a day.**

    marking today       hold the check ring on the card row, page 1.      1 contact
    marking another day tap the day cell (1), hold the check ring in the
                        day sheet (2).                                    2 contacts

The day roll up is automatic: a day is kept when every weighted active card is
kept, partial when some are, broken when one or more carries an X and none is
outstanding, and open when the day has passed with no mark. **The person never
marks a day directly.** A day is a consequence of cards, which is the only way a
calendar can be a record rather than a demand.

**Four taps to add a card.**

    1  Add a card                    opens the add sheet
    2  a family                      six families, on the sheet, never on page 1
    3  a behaviour                   the list inside that family
    4  Add                           writes the card and closes

**Categories live on the add sheet.** The owner's September finding is that
putting them on the landing is what cost the tab versions their score, and Dani's
count agrees from the other direction: six families on page 1 would take it from
three decision groups to four and would put a taxonomy in front of a record.

The add sheet also carries, below the four taps and never in front of them: the
run time, the days of the week, and **the day's running total in minutes,
updating as the card is added**. That is Derek's number from pass 6. No cap and no
warning copy.

## 4.5 The Families

If it has a name it has an icon, the icon has a family, the family has a colour,
and the colour means something. The colour is the seat, which is the product's
existing colour law.

    body      Root      #C4635E   breath, cold, movement, sleep
    somatic   Sacral    #D19255   the emotional scan, shaking, sound
    energy    Crown     #A98BCE   sitting, light, fasting
    mind      3rd Eye   #8296DB   journalling, attention, reading
    voice     Throat    #65B8D4   the fifty percent, the twenty five percent
    ground    Heart     #6FC5A3   gratitude, affirmation, boundary, avatar

**Voice is the owner's "transforming communication" and it is already specified
in this repository.** `DECISIONS.md:176`, under the ritual builder heading: fifty
percent, use half the communication for twenty minutes, two hours or a week, half
is context only; twenty five percent, a quarter, and a quarter is meaning only.
The question it trains is already written there too. That is the first Voice card
and it costs nothing to build because the words exist.

`PTRACK` in `engine/data/practice.js:102` carries four colours today and gains
Voice and Ground. The four existing practice tracks keep their word, and the
card grouping word is **family**, per pass 4.

## 4.6 The Accountability Model

**The season.** Seven days. The person starts it. It carries `n`, `startedAt`,
`endsAt`, the stake sentence, one goal, `target` default 20, and a cohort string
stored and not rendered in phase 1.

**The daily number.** 20 a day, 140 a week. Stated once, at the start, inside the
person's own commitment screen. Never printed as a fraction anywhere.

**The stake sentence.** `What's at stake for you not doing this?` The person
answers it in their own words. Stored verbatim, never edited, never trimmed,
never scored, never truncated in a render. Printed on the season banner and again
at the end of the week beside the days.

**The end of the week.** One surface, and it is the owner's instruction exactly:
his sentence, then the seven days and what ran on each. No percentage, no
verdict, no congratulation, no next season prompt on the same screen. One control
to start another week, below the fold.

**The grace day.** One per season, `grace.usedOn`. The first broken day of a
season consumes it. The grace day **neither increments nor halves**, which is
what makes the owner's case A read 8. It is announced once, at season start, in
four words: "One day free." It is never announced again, and its consumption is
never reported, because reporting it is naming the absence.

**The halving.** A broken day beyond grace:

    for each active weighted card's each step:
      streak = Math.max(1, Math.ceil(streak / 2))

Never 0. Derived from the owner's own verified cases, as shown in part 0.

**A broken row.** Same type weight, same family colour, an unfilled ring, and no
copy. **Not the alarm colour**, because the Bible reserves that for something
being wrong and a step that did not run is not a thing being wrong. No red, no
warning icon, no exclamation, no sentence. It prints the step name and nothing
else, and it sits in the list at the same height as a kept row.

**Open.** A day that passed with an active card and no mark. Open is not broken.
It does not consume the grace day and it does not halve anything. This is the
state that makes a lapse cost nothing: a person who stops for nine days has nine
open days and an intact streak.

**What the streak is not.** Not a number on any surface. Not a consecutive count.
Not a best ever. Not a sentence about the days without a mark. Not a thing the
day push refers to.

## 4.7 The Sniffer Join

Three directions, and together they are the only closed loop in the product.

### A. A Release Produces The Ritual

On release completion, `ui/release.js` holds the run log. A new pure function in
`engine/rite.js`:

    riteFrom(log, r) -> {nm, fam, seat, min, steps, from}

It takes the seat carrying the most cleared charge, maps it through the existing
`TRACK4BAND` at `ui/ritual.js:7`, asks the existing `ritFor` for the called
practice, and returns a proposed card with `from` populated from the heaviest
released address.

**One control on the release completion surface: `Keep this as a card`.** Not
automatic. A card the person did not choose is a card they did not promise, and
the entire module runs on the promise. Port, do not rebuild: `ritFor` keeps its
body and its signature.

### B. A Completed Ritual Produces Tomorrow's Prompt

    ritPrompt(p, now) -> {text, cardk} | null        host free, pure

Read on the next open of Story, rendered by `ui/storyui.js` as one line above the
box with a dismiss control.

    every step kept        Box breathing ran four days. Say what is different.
    any step broken        handled by C below, not by a prompt
    nothing marked         null. No prompt. Never a prompt about an absence.

It writes nothing. It is a suggested prompt and not an entry, and dismissing it
costs nothing and is not recorded.

### C. A Failure Becomes A Story

On Submit with any X, one sheet over page 2:

    <the step name>
    The step did not run. Say what got in the way.
    [ text box, no placeholder, no character count ]
    This goes to the reader like any other account. It is charge, not a confession.
    [ Skip ]                                    [ Save ]

On Save: `parseStory(text)` runs, `applyStory(text)` runs, a story entry is
written with `src:'ritual'` and the card key, and the returned entry id is
written to `marks[day][card].why`.

**That closes the circle.** The broken promise becomes text, the text becomes
charge at an address, the address is releasable, and the release produces a card.
Nothing else in the product generates its own input.

`Skip` is always present and is the same size as `Save`. Not offered at acute.

### The Automation, Bounded

The owner's instruction is that it works with the sniffer to detect stories so it
can automate a release protocol. **Ruled: automated detection, never automated
release.** The module may propose a card and may propose a release selection. It
may never run a release, because a run spends the meter and a machine spending a
person's allowance is the one thing that cannot ship. `relCost` gates the run and
a person presses it.

**And `pathOf` gets its first UI caller in the product.** Verified by grep: zero
callers in `atuned_src/ui/`. The failure account's route is drawn on the day
sheet as the address the account landed at. That is the cheapest use of the most
game shaped object in the codebase and it is an S.

## 4.8 The Defaults And The Around The App Asks

**The two behaviour defaults, the owner's own, both Ground family, Heart.**

    Gratitude     3 min   1 Name three things that held.
                          2 Say each one out loud, once.
    Affirmation   2 min   1 Say the line.

The affirmation line is built from the ruled form in `DECISIONS.md`:
`I now embody the truth that I am ...`. It is filled from the person's own avatar
`be` side when the avatar exists, and from the seat's own `toward` string in
`canon.js` when it does not. That is a real join between two things already in the
file and it costs nothing.

**Both are withheld until the first release completes**, per Diane in pass 6.

**The two around the app asks, Ground family, `weight:false`.**

    Set your boundary   steps generated from boundaryCount(p.purpose).thin,
                        one per thin side. Retires when filled === 30.
    Set your avatar     one pair step, running runAvatarDrill in place.
                        Retires when p.avatar.built === true.

Neither counts toward the season target. Neither feeds a streak. Both retire
rather than repeat. They are the only cards present before the first release, and
the avatar card is the first time the owner will have seen the avatar as a screen
rather than as a drill behind a door tile.

## 4.9 The Push Model, Honestly Costed

**Two kinds, and nothing else pushes.**

**1. The card push.** One per card, at `card.run`, naming the practice and the
card name. Never a count, never a state, never an absence. Off per card and off
per kind. This is Gollwitzer's if then cue at d = 0.65, the highest evidence item
in the repository.

**2. The day push.** One, at 22:00 local, **only while a season is running**. It
names the practice that ran, or the person's own stake sentence. It fires on a
marked day and an unmarked day identically, which is what severs the structural
link to the absence.

**Quiet hours.** Default 22:30 to 07:00, so 22:00 is legal by default. If the
person moves quiet hours earlier than 22:00, the day push moves to the last legal
minute before them. If quiet hours cover the whole evening, it does not fire and
nothing is said about it.

**Never.** During an absence, because no season means no day push. At acute. Any
push that names a gap, a count, a total, a streak or another person.

**The cost, stated honestly and in both directions.**

- The owner's figure is plus 6 weekly from the 22:00 push. **It cannot be
  verified here**: there is no navigation arc simulation in this repository and no
  0.94 or 22:00 figure in `PANEL-10k.md`.
- My estimate with the frame moved from compliance to account: **plus 3 to plus
  4**. Labelled as my estimate, from shipped mobile, not a measurement of
  anything in this build. Instrument it and replace it.
- The game director's refusal number, for the frame we are **not** adopting:
  Patel 2016, loss framed 0.45 of participant days against gain framed 0.35, so a
  loss frame would buy about 22 percent more adherent days. We decline it and the
  decline is priced.
- **Push needs a service worker, which is a second file, and
  `DECISIONS.md:207` names that as open: whether push may add a second file
  against the one file rule.** This is a genuine escalation and it blocks the
  push half of phase 1 and nothing else. Without it the module still closes the
  loop and loses both pushes, keeping an in app due list on page 1 driven by the
  same data.

## 4.10 Schema Additions And Migration

As specified in pass 5. Summarised for the builder:

    SCHEMA_V      2 -> 3, additive
    new field     p.ritual = {cards, marks, season, grace, push, seeded}
    untouched     p.rituals keeps its shape and its readers, forever
    seeding       the most recent p.rituals entry becomes one card on first open
    validation    validateProfile gains the ritual branch. fam, seat, target and
                  the date keys are refused by name and never clamped
    caps          60 cards, 12 steps, 400 mark dates, coalesce older
    engine seam   engine/rite.js, host free. No document, window, fetch

New pure functions in `engine/rite.js`:

    ritualBlank()                  -> the v3 blank
    riteCard(spec)                 -> a validated card, or null with a reason
    riteDue(p, now)                -> the cards due on that day
    riteMark(p, dayKey, cardk, stepk, state) -> writes one step mark
    riteRoll(p, dayKey)            -> rolls the day up. kept|partial|broken|open
    riteStreak(p, cardk, stepk, now) -> integer. grace and ceiling halving
    riteSeason(p, now)             -> {n, day, stake, goal, endsAt} or null
    riteWeek(p)                    -> the end of week surface's data
    riteFrom(log, r)               -> a proposed card from a release
    ritPrompt(p, now)              -> {text, cardk} or null
    riteDays(p)                    -> distinct day keys carrying a mark

`streakRead` in `engine/ladder.js` is repointed at `riteDays` and gains the grace
and halving. `pracDays` keeps its body and is no longer the streak's source.

---

# Part 5. Phase 1 And What Is Deferred

The owner's standing instruction, `DECISIONS.md:1092`: make the system highly
operational before making any of it complete. A full loop that is crude beats a
polished half. Phase 1 below closes the loop.

## Phase 1

| # | Item | Size |
|---|---|---|
| P1.1 | `TAB.RITUAL = 10`, `TABDEF` at index 2, `#rite` host, bar wraps at narrow width | S |
| P1.2 | `engine/rite.js`. The eleven pure functions above, host free, including the grace day and the ceiling halving | M |
| P1.3 | Schema v3, boundary validation refusing by name, the seed migration, the caps | M |
| P1.4 | `ui/riteui.js` page 1. Season banner, calendar, card slider, add sheet, day sheet, every empty state in 4.2 | L |
| P1.5 | `ui/riteui.js` page 2. Step list, two ring targets, hold to complete, Submit, End ritual, Edit sheet | M |
| P1.6 | The two defaults and the two around the app cards, with the retire conditions | S |
| P1.7 | The release to card join. `riteFrom` plus one control on the release completion surface | S |
| P1.8 | The failure account sheet and `ritPrompt` rendered in `ui/storyui.js` | M |
| P1.9 | The ladder defects that will sit next to this: delete the gap sentences and the bare run number, the virgin zero, the stray space at `cone.js:582`, the axes as addresses label, the `nine` mark double count, the five counts against a total on Energetics | M |
| P1.10 | Gates. Section 6 below | M |

**Phase 1 total: two S, five M, one L, plus gates.** Call it eight to ten working
days with the tests, and the loop is closed on day one of that range being done.

## Deferred, And Why

| Item | Size | Why not now |
|---|---|---|
| Both pushes | M | Blocked on the second file ruling, `DECISIONS.md:207`. Nothing else depends on it |
| The cohort | L | A cohort is other people, so it needs a consent grant, a visible list of who has sight and revocation. The string is stored and not rendered |
| The practitioner building a client's card set | L | Tier four, already ruled. Sofia's path is unblocked by template export in the meantime |
| The 21 day correlation surface | M | Cannot exist until 21 days of marks exist. Arithmetic, not a choice |
| `pathOf` drawn on the day sheet | S | The cheapest large thing left in the codebase. First thing after phase 1 |
| An automated release proposal | M | Detection ships in P1.8. The proposal needs the pattern keying ruling |
| Retiring `ui/ritual.js` and `#rit` | S | Phase 2, once nothing calls `ritOpen` |

---

# Part 6. The Gates

Every one of these is a check and not an opinion.

1. **`tests/engine.js`, the halving.** The owner's three verified cases as three
   assertions: 7 kept, miss on grace, kept reads 8; two missed reads 4; and a
   streak of 1 missed twice reads 1 and never 0. Plus: a paused card writes no
   row; an open day does not halve; the grace day neither increments nor halves.
2. **`tests/engine.js`, the boundary.** A v1 and a v2 profile round trip with
   `ritual` filled from the blank. A bad `fam` is refused by name. A `target` of
   9999 is refused by name and not clamped to 400. 500 mark dates round trip and
   401 coalesce.
3. **`tests/functional.js`, the interaction.** Two contacts mark a past day. Four
   taps add a card. The check ring and the expand span do not overlap at 390 wide,
   asserted from bounding boxes. A 1.4 second hold writes nothing and a 1.6 second
   hold writes a mark.
4. **`tests/design.js`, the surfaces.** No `position:sticky` anywhere in the
   module. Every interactive element at or above 44 by 44 at 390 wide. The alarm
   colour appears nowhere in the module. **The no count against a total sweep runs
   over all nine tabs and not one selector**, with `Day n of the week` as the one
   named exemption. That gate as written would fail the build today on Energetics,
   which is the point.
5. **Instrumentation, and it is Ngozi's condition from pass 2.** Marks and
   released patterns are reported as two separate figures and never as one. A lift
   measured on marking days is never reported as evidence about capacity.
6. **`tools/terms.py`.** Two new sets. The banned progression words that
   `DESIGN-progression.md` section 2.1 specified and nobody added: points, XP,
   score, level, badge, achievement, trophy, streak, coin, gem, token, loot, box,
   spin, prize, rank, leaderboard. And this module's own: fail, failure, failed,
   missed, behind, should.
7. **`tools/equiv.py`** run against the named diff list in pass 5, so every
   change to an existing declaration is acknowledged rather than silent.
8. **Look at the images.** `node tools/shots.js OUT 1600 1000` and
   `node tools/shots.js OUT 390 844`, on page 1 empty, page 1 with a season, page
   1 at acute, page 2, and the end of the week. Reading the CSS is not reviewing
   a screen.

---

# Part 7. The Grade Delta, And The Single Biggest Risk

## The Grade Delta

`reviews/game-design.md` grades how well the product rewards returning at **D**,
and its own table prices the closest item: "the ritual read back as an if then
plan, B minus to B, d = 0.65, cheapest item in the file."

My call, stated so the next review can check whether it happened:

    phase 1 as specified, no push            D  -> C+
    the failure account producing stories    C+ -> B-
    both pushes shipped at my estimate       B- -> B

**C plus without the push, B minus once the loop is generating its own input, B
with push.** The step from C plus to B minus is the largest in the product and it
is not a feature, it is the circle closing: this becomes the first module whose
output is another module's input.

What would move it past B is the 21 day correlation, and that is arithmetic
waiting on time rather than work waiting on a decision.

## The Single Biggest Risk

**It is not the push, and it is not the schema. It is Diane.**

She is 180 of 1,000, the heaviest weight in the roster, and her line is on
record: another practice to fail at, I have a shelf of those. A calendar of daily
cards is the shelf. The only thing separating this module from every habit app on
her phone is the origin line, and the origin line only exists once the person has
run a release.

**So the risk is that phase 1 ships the shelf to the people who have not released
yet, which on day one is everybody.** The mitigation is sequence and not copy:
the behaviour defaults are withheld until the first release, page 1 before that
carries only the two structural cards and one door to Story, and every card
without an origin says so in its own line rather than hiding it.

If that sequencing is dropped to make day one look fuller, the module becomes a
habit tracker with a body diagram, and the panel will read it as one inside four
seconds. Marcus in four, Diane in one screen. **That single build decision is
worth more than any other line in this document.**

---

# The Sample, Reported With The Findings

Per the standing rule that taste alone is not admissible.

**ICPs and focus group.** Nine personas from `RESEARCH-icp.md` at their stated
weights over 1,000 simulated members, driven by their charge vectors in
`engine/data/people.js`. Thirty one reactions recorded: BUY 6, HOLD 9, CONFUSE 3,
RESIST 9, REFUSE 4. Resistance, confusion and refusal are 52 percent.

**Review records read.** `CLAUDE.md`, `BIBLE.md`, `TEAM.md`, `DECISIONS.md`,
`RESEARCH-icp.md`, `RESEARCH-ladder.md`, `DESIGN-progression.md`,
`reviews/game-design.md`, `reviews/uiux.md`, `reviews/creative.md`,
`reviews/simulation-quarter.md`, `PANEL-10k.md`, `.claude/skills/atuned-ux/SKILL.md`.

**Live code read.** `atuned_src/ui/ritual.js`, `atuned_src/engine/ladder.js`,
`atuned_src/engine/avatar.js`, `atuned_src/engine/sniff.js`,
`atuned_src/engine/schema.js`, `atuned_src/engine/core.js`,
`atuned_src/ui/cone.js`, `atuned_src/engine/data/practice.js`,
`atuned_src/MANIFEST`.

**Probes run this session,** Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, 6300ms boot, at 390 by 844:
a nine tab string sweep for "accountab"; `streakRead` against the owner's three
Bible 1133 cases; `ladderHtml` rendered on a virgin profile and on a profile
lapsed 11 days after 14 days; `ledgerRead` on 8 rituals with zero release runs;
`parseStory().path` on a test sentence; `boundaryCount` and `p.avatar` on a blank
profile; a grep for `pathOf` callers in `atuned_src/ui/`.
