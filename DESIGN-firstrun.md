# The first run, storyboarded: boot, check in, opening, landing

Dani Sorensen, UI UX architect. 26 September 2026.

**Status: a storyboard, not a build.** His words, `TASKS.md` FH: "Tutorial
screens need to all be mapped out. That means they need to be storyboarded."
Nothing under `atuned_src/` moved for this file and nothing here ships until
the questions in section 9 and section 0.10 are answered. It is the map a
build is cut from. **Read section 0 first**: it is the revision after FK and
it supersedes parts of what follows.

**Why a new file and not `DESIGN-onboard.md`.** That file is the record of a
pass stopped on 20 September. Its own first line says nothing in it is a
proposal. This file is a proposal, and it spends that file's measurements
rather than repeating them: the ring as the only progress object (OB24), the
paced signal test, the text budget spent inside a wait. Read that file for the
evidence. Read this one for the sequence.

**What is new since that pass, and it is why the sequence changes.** FH adds
three things the stopped pass never had: a screen between the boot and the
app, a one time first and last name on it, and a box that means "do not show
me this again". It also moves the landing: "the starting square". And the
product moved underneath: the boot is real (FC), the Field opens with every
layer on (FE), and the Field rail carries Root energetics off the person's own
name (FE, EZ).

Figures are labelled the way `DESIGN-onboard.md` labels them.

| Label | What it means |
|---|---|
| **read** | Read off the code at the commit this file lands on, with the line |
| **measured** | Executed in a build, dated, with the file named |
| **judgement** | Reasoned estimate with the arithmetic shown |

Sections 1 to 13 below were written without running the build. Section 0 was
written after running it: its figures are measured on 26 September at
`acc8181`, and the evidence is `RESEARCH-firstrun.md`.

---

# 0. Revised 26 September, after FK: the opening is one turn of the loop, performed

**Why this section exists.** FK, his words: "It's discover play flow embody. I
like the ring with the tune. We want that center ball, Hello Sofia's good."
Then the order to run the software against the ICPs and research outside what
pulls people in. Both are done, in `RESEARCH-firstrun.md`. This section is the
sharpened design they produce. **Where it disagrees with sections 4 to 12, this
section wins**, and each superseded part below carries a note saying so.

## 0.1 Kept exactly as he confirmed

- **The ring.** The seven colour ring the boot ends on is still the only
  progress object from the boot to the Field.
- **F1, the check in, as drawn.** "Hello, Sofia.", the two name fields, the
  line under them, the box, Next. Not one element changes.
- **The loop's four words: discover, play, flow, embody.** On every screen in
  the opening a station shows its own word and nothing else as its name. No
  station is labelled with a surface or a tool. The earlier draft's mapping to
  journal, imprints, release and ritual is withdrawn, and Q6 is retired: he
  answered it.
- **The signal test, F2 to F6**, as drawn, with one line changed on F6.

## 0.2 What running it and the research changed

Each line: the change, what was measured, and the source.

1. **The loop stops being four cards and becomes the first turn.** The
   earlier F7 to F10 were four presses of Next, one line each: a deck of
   cards. NN/g's 70 person test found deck of cards tutorials do not improve
   task performance (`RESEARCH-firstrun.md` 5.1). Duolingo's first lesson is
   its onboarding (5.2). AN3 already ruled it: the core loop is the tutorial
   and day one done is running it once. So each station is **done once, in the
   real product**, and the ring advances a quarter when it is done.
2. **That is also the navigation tutorial he asked for.** "The tutorial,
   navigating them around the software." Four stations are done in four real
   places, so a person finishes the opening having used the places, with no
   card describing them. The ring docked on the stage is the only guide.
3. **The reward goes first, and it is already built.** Measured: the moment a
   stranger feels seen is the live highlight while a story is typed, her own
   words lighting in place, about twenty seconds in (Angela, 3). discover is
   built around that moment.
4. **The first act is no longer punished.** Measured: the first commit erases
   what was found and says "nothing reaches the line yet", CQ reads "0%", and
   the Field does not move; the first visible change costs a second story
   (`ui/imprints.js:143`, applyStory lands 0.35). WHOOP and Oura show a
   calibrating state greyed and say when it fills (5.4). So the first turn
   draws what the story found **faintly at its own addresses, under the line**,
   and says so. The engine and the line do not change. The render does.
5. **The turn ends on when and where.** Ritual already has the row, with "after
   I put the kettle on" as its example. A concrete plan for when and where
   raised Headspace app opens 7.5 percent (5.3); it is Fogg's anchor and the
   Hook's investment that loads the next visit (5.6). AN10 says day two is the
   ritual. This row is what makes day two happen.
6. **The person lands with one closed circle that they made.** The endowed
   head start measured 34 against 19 percent completion (5.5), and here none of
   it is gifted. LD1 already counts a closed circle.
7. **The landing lights only what their own story touched**, and says the one
   sentence the Help sheet already holds, once: which zone is which.

## 0.3 The sequence

    boot -> Hello -> signal test -> discover -> play -> flow -> embody -> the Field
                                    '--------- one turn, the ring closes ---------'

| Step | Where | Time | The one thing a person does |
|---|---|---|---|
| boot | shipped | 5.4 s measured | watches |
| Hello | F1, unchanged | about 8 s | types their name |
| signal test | F2 to F6, unchanged | about 60 s | moves the marker, twice |
| discover | the real story surface | 45 to 90 s | writes one thing |
| play | the real Field | about 15 s | opens one address |
| flow | the real release | about 30 s | follows it in thought |
| embody | the real Ritual, the When row | about 15 s | picks when |
| the Field | landing | | the turn is closed |

**Judgement, from the table.** First act at about 6 seconds, as before. First
moment about the person, their own words lit, at about 100 to 130 seconds.
First address on the Field under 3 minutes. The whole opening 3 to 4 minutes,
against the under five minutes to first value that Amplitude reports for high
performing products (5.7). About 8 presses and one piece of writing. Every
step after the name is a doing step; none is a reading step.

## 0.4 The four stations, frame by frame

The station screens are the product's own surfaces, not copies of them. The
ring docks at the top of the stage (at 390, above the surface, under the bar)
with the station's word and one line. Everything on the surface except the
one lit target is dimmed to about a third, not hidden and not covered by a
sheet (Q9 asks whether that honours OB9). Leave sits in the corner on every
station, as on the signal test. All lines below passed `check.py --line` on 26
September with no hard failures, and still owe the voice seat's ten passes.

**F6, the two marks, one line added.** After "A thought moved your body." the
Next press hands straight into discover. The line under the circle becomes:

    A thought moved your body. Now write one down.

The other two outcome lines stay as drawn.

**T1. discover.** The story surface. Lit: the text box and Commit.

    discover
    Write one thing from this week that is still on you.

The prompt answers the blank page, which every journaling neighbour solves
with a question rather than an empty box (`RESEARCH-firstrun.md` 5.11). The
words light as they are typed, which is built (`ui/storyui.js`, the highlight
layer). On Commit the ring closes its first quarter, and the panel, instead of
"nothing reaches the line yet", reads:

    12 found, all under the line for now. What you write next adds to them.

The number is the count the Commit button already carries. It is a count of
what was found, never set against a total.

**T2. play.** The Field. Its once a session entrance plays now, held from the
boot for this moment (F0's second defect). Drawn: the addresses the story
touched, faint where under the line and full where over, and the rest of the
wheel dimmed. Lit: those addresses.

    play
    Your words landed here. Open one.

Opening an address is built (the Help sheet: "Open an address, click it").
Opening one closes the second quarter.

**T3. flow.** The release, over the address they opened. **Measured: on a
first story the release refuses**, "Nothing is held above the line yet, so
there is nothing to release." So on the first turn it runs as practice,
labelled on the release itself:

    flow
    Run one release over it. Follow each line in thought.
    Practice. This one writes nothing to your field.

AN5 holds: the opening spends no real charge. The last line of the release
closes the third quarter. Q10 is whether flow should instead wait until
something has crossed the line.

**T4. embody.** Ritual, scrolled to the When row. Lit: the row and Save.

    embody
    Pick when you will come back to it.

Three anchors as chips, drawn from the row's own example and two like it,
and a field for their own words. Save closes the ring. When the accounts
product brings push notifications, this is the one place the permission is
asked, after the value and never before it (`RESEARCH-firstrun.md` 5.6).

**T5. The landing.** The ring sweeps back to discover and lands as the Field's
core, as F11 drew it. The Field shows the person's own entry. The ring's line
slot says once, then empties:

    The wheel is your field. Left is what you are made of. Right is what it reads.

That is the Help sheet's own sentence, cut to fit. Root energetics opens if a
name was given (Q8, unchanged). **The lit first door from F11 is dropped**:
measured, the four doors vanish once a story exists, and the person has
already been through them.

## 0.5 Leaving, at any point

- **The box on F1** still goes straight to the Field, unchanged.
- **Leave on a station** goes to the Field with the quarters already done
  drawn closed and the rest open. The ring shows real progress and only real
  progress. The status line is unchanged: "The opening is in Account."
- **Reload mid turn** resumes at the station after the last closed quarter.
- **The story stays.** A story written in discover is a real entry, with undo
  as its net (`engine/undo.js`), because it is the person's own words about
  their own week. Only flow is practice.

## 0.6 What must be true before this ships, measured, not new asks

The first turn walks a stranger through three surfaces that today state a
reading on a blank record. A person who has just been greeted by name and is
then told what is "most shut" in them by a record holding nothing will not
trust the next thing it says. These are defects already on the backlog or
found in this run (`RESEARCH-firstrun.md` section 6), named here so they are
not discovered after the build:

1. AV24: the right rail's archetype and domain percentages and the lit
   Warrior and Sage on a blank record.
2. Ritual's "the root is carrying the most" on a blank record.
3. CQ's "0%" in its largest numeral after a first story.
4. The calibrating render in T1 and T2, which is new UI over an unchanged
   engine.
5. A practice mode on the release for T3, if Q10 lands on practice.

## 0.7 The three walks, and three more

**Angela, level 5.** Hello, her name back. The signal test is her moment. In
discover she writes about her sister and watches "said yes when" light, and
the throat reads Self-Silencing. That is the recognition she came for, now at
about two minutes instead of never. The commit no longer answers her with a
zero: twelve found, under the line. play shows her where they sit; she opens
the throat. flow is where she would stop if the release lines read as
mechanical, which is the voice seat's job, not this file's. embody: "after I
put the kettle on". **Stops: none forced. Watch flow.**

**Derek, level 7.** Watches the boot, types his name, sees three numbers
promised. The signal test reads to him as a calibration, which is how he
reads everything. discover is where he writes the least; a two line entry
still lights. **His stop is embody**, if the chips read as wellness rather than
scheduling; the fix is the chip wording, and "before the first run of the day"
belongs in the set. He leaves with a limiter only after the 63, which the
opening does not pretend to replace.

**James, level 3.** Ticks the box on F1 and is on the Field in one press, as
before. **What changes for him is 0.6**: the Field he lands on no longer
tells a blank record what is shut in it, which is what lost him in this run.

**Marcus.** Stays through the signal test for the instrument, as predicted.
play is his station: a wheel that answers his own words is the "clearly not a
template" proof. **His stop is the practice label in flow** if it reads as a
demo; the label stays, because a release that claims to have moved charge it
did not move is worse.

**Diane.** Box, or Leave after discover. Either way her first story is
written and her field is not empty, which is further than any path took her
in this run.

**Sofia, level 8.** Runs the whole turn, and **embody is her station**: what to
run and how long, and when. She is also the concierge route: the same opening,
run beside a client, is her first session with them (`RESEARCH-firstrun.md`
5.9). Noted for the practitioner design.

## 0.8 What to instrument, replacing section 11

Held on the record as dated flags, nothing sent, as before.

1. Time from first paint to the first lit word in discover.
2. discover commit rate, and the length of the first entry.
3. Whether an address was opened in play.
4. flow practice completion, and where in the lines it was left.
5. embody: whether a when was set, and which chip or own words.
6. **Day two return within an hour of the chosen when.** This is the number the
   whole turn is built to move.
7. Leave, by station. Box tick rate on F1, as before.

Then five real strangers at 390, watched. Five surface about 85 percent of
what is wrong.

## 0.9 The grade

**Today, measured this round: D** for a stranger. 102 controls in view on the
landing at 1600, no instruction in view at 390 and the doors 3,216 px down,
the first act answered with a zero, and three surfaces asserting a reading on
a blank record.

**The storyboard as drawn before this section: B minus**, judgement,
unchanged.

**As revised: B plus**, judgement. The first moment about the person arrives
at about two minutes and is their own sentence, the first act is rewarded
rather than refused, and a person leaves the opening having used four real
places and set a time to come back. Capped by the landing's load, which only
AN8 and the rail fold move. **A minus** with 0.6 fixed and AN8 behind it.

## 0.10 Questions for him, revised

Q1, Q2, Q4, Q7 and Q8 in section 9 stand unchanged. **Q6 is retired**: he
answered it in FK. **Q3 and Q5 change**, and three are new.

**Q3, revised. Does a station line say what to do, or what it is for?** 20
September: "At no point are we talking about results or purpose." 26
September: "Highest purpose of the product results." The revised lines in 0.4
name an act ("Write one thing from this week that is still on you") and let
the result be what happens on the screen. That may settle Q3 by showing
rather than saying. Or he may still want the purpose said: then each station
gains one line, and the right column of section 5's table is the draft.

**Q5, revised. The opening now walks through the door.** Section 9 asked
whether the opening stops at the first story or runs it. The revision runs
it: the story is real, only flow is practice. Costs AN5's "no real charge" for
the story, which is the person's own words and carries undo. The other answer
keeps the story as practice too, and costs the one thing the run showed
works: their own sentence becoming their own field.

**Q9, new. Is a dimmed product a pop up?** OB9: "No pop ups. One screen, not a
sheet over the product." The first turn happens in the real surfaces with all
but one target dimmed.
- *Dimmed, not covered.* No sheet, nothing drawn over the product, the product
  is the screen. Costs a spotlight state on four surfaces.
- *Full screen copies of each station.* Honours OB9 to the letter. Costs the
  navigation tutorial, because the person never touches the real places.

**Q10, new. What does flow do on a first story, when the release refuses?**
Measured: nothing crosses the line on a first story.
- *Practice release, labelled, writes nothing.* The turn closes on day one.
  Costs a practice mode on the release.
- *flow waits.* The third quarter stays open until something crosses the line,
  usually the second story. Costs the closed circle on day one, and it makes
  day two the day the loop first closes.

**Q11, new, his and explicitly undecided. A few more questions after the
signal test?** His words in FK: "maybe we can ask them a few more questions
that kind of turn on, like not turn on, but activates the expression,
activates certain aspects of the diagnostic. I don't know, maybe we don't do
that." Not recommended here, and not built. What the research says, both ways:
Headspace doubled course starts by asking a few questions even when the
answer changed nothing, and active practice did not rise (5.3). Three ways it
could go:
- *None.* The name stays the only question, and it already writes three real
  numbers.
- *One law, asked three ways.* Three questions, the smallest set that gives the
  engine a spread to read, so one spoke of the Field is real on day one. Costs
  about 40 seconds and places a questionnaire in the opening.
- *A few that change nothing computed.* Raises starts, per Headspace, and is
  the one version the house voice cannot allow, because a question that
  pretends to personalise is a claim the instrument cannot back.

**Q12, new, smaller. Say that the fourteen people in the picker are worked
examples?** Measured: the picker reads "Custom" and lists "Sofia, 41, somatic
practitioner" and thirteen more with nothing saying what they are. Marcus is
the person a worked example serves (5.10).
- *Name them.* One word in the picker, "Examples", and one line on the
  landing. Costs a line.
- *Leave them.* Costs nothing to build, and a stranger reads them as other
  people's data.

---

# 1. The job

**What a stranger hires the first run for, in the person's words:** "Show me
this is about me before I give it anything that costs."

Not "teach me the app". The Nielsen Norman result in
`reviews/QUESTIONS-onboarding.md` section 6 (seventy people, four apps, ease
rated 4.92 by the tutorial readers against 5.49 by the skippers, cited) says a
tour in front of the product makes the product feel harder. So the opening
earns its time only three ways, and every frame below has to do one of them:

1. **Say the person's name back to them.** FH asks for it and it is the
   cheapest proof of "about me" the product owns.
2. **Have their body answer once.** AN7: the somatic opener is the one thing
   onboarding has them do. SIG1 to SIG6 are the specification.
3. **Show the loop as a loop.** CLAUDE.md, ruled 20 September: discover, play,
   flow, embody, and "anywhere the four appear together they close".

M2 in `MILESTONES.md` is the test the whole sequence is held to: **a first
session ends in a change, not a tour.** The opening ends at the door of that
change, with the door lit. Whether it walks through the door is section 9, Q5.

---

# 2. What exists today, read off the code

**The app opens on the Field.** Read: `engine/core.js:158` sets
`tab:TAB.FIELD` and `ui/ui.js:1298` runs `setTab(TAB.FIELD)` as the opening
surface step.

**The Field draws as the Wheel on a first visit.** Read: `ui/rings.js:71` sets
`FVIEW='wheel'`, and `fviewGet` at `:76` to `:79` returns the stored view or
the wheel. The view is kept per browser, in the store, and not on the profile.
Frames and Dial are the other two (`ui/rings.js:59` to `:70`).

**A first visit gets a blank profile named You.** Read: `ui/ui.js:1248`,
`pNew('You')`. Its `who` block is empty: `engine/schema.js:27`,
first, middle and last all empty strings.

**The boot runs every launch and is skippable by any press.** Read:
`ui/panels.js:942` to `:1023`. The fade is `shell/head.html:3814`, starting at
5 seconds plus `--hold`. Reduced motion clears it at once (`:1023`). No flag is
stored to skip it on a return visit, and its comment says that is on purpose:
it is the overture. **Nothing in this storyboard changes that ruling.** The box
FH asks for suppresses the check in, not the boot.

**When the boot lifts it starts the Field's once a session entrance.** Read:
`ui/wheel.js:749`, `enterLift`, called from the boot's lift in `panels.js`.

**The onboarding flow exists and is switched off.** Read: `ui/onboard.js:43`,
`OB_AUTO=false`, read once at `ui/ui.js:1306` to `:1313`. It is a sheet with
`role="dialog" aria-modal="true"` over the product (`ui/onboard.js:123`), four
steps, a four dot counter (`:128`), and it is the build `DESIGN-onboard.md`
measured at 372 words and graded against six defects in its signal test.

**The replay already lives in Settings.** Read: Settings has no tab. It is
integer 9, reached only from the profile button (`ui/panels.js:917`), and
renders the account area (`ui/account.js`). Its first section, Account, holds a
group called **The Opening** with one control, "Run the signal test again",
which calls `obOpen(true)` (`ui/account.js:115` to `:118`, wired at `:294`).

**The seen flag is on the record and is not in the schema.** Read:
`ui/onboard.js:113` writes `CURP.onboarded=true`. It is not in `blankProfile`
and `validateProfile` does not know it. Section 8 fixes where it lives.

**A name alone already prints three real numbers on the Field.** Read:
`ui/personas.js:150` to `:157`, `spNumRows`, guarded on the person's own name
and not on a reading, and its comment says why: "a person who has typed their
name and nothing else has a real expression number and no reading yet."
`engine/numerology.js:148` onward computes expression, soul urge and
personality off the name, and life path, birthday and maturity only once a
birth date exists. **This is the single most useful fact for this storyboard:
the name FH asks for is not only a greeting. It is the first number on the
screen that is about the person.**

**The name has one editor, and it is Energetics.** Read:
`ui/account.js:103` to `:110`: "There is only ever one editor for a field."
The editor is the Who this is form on Energetics, `ui/intakeui.js:367` to
`:373`, writing `CURP.who.first` and `CURP.who.last` on change. The check in
below is a first write into those same two fields through the same path, and
never an editor: once a name exists it is not asked again, and changing it is
Energetics' job.

**The four doors print on a blank Field.** Read: `ui/component.js:694` to
`:702`, `STARTD`. Write what happened, Read nine sentences, Go year by year,
Say who you are becoming.

---

# 3. The rulings this sequence sits inside

Not reopened here. Where two collide, the collision is named and sent to
section 9 rather than settled by building one side.

| Ruling | Where | What it forces on the storyboard |
|---|---|---|
| OB1 no count of screens | `TASKS.md` 0p | The ring is the only indicator. No dots, no "step 2" |
| OB2, OB12 one button forward, it says Next | 0p | One primary control per frame |
| OB3 "not now" goes | 0p | No second button. The way out is a corner word, section 5 |
| OB4 Hello, not Welcome | 0p | The greeting reads "Hello, Lance." Also V1 in the voice skill |
| OB5 "and it is okay" goes | 0p | "This is you" is not used as a line either: the name does that job |
| OB9 no pop ups | 0p | Full screen, not a sheet over the product. The shipped sheet is replaced |
| OB10, OB11 icons, shown as a loop | 0p | The four stations are icons on one ring |
| OB13 super simple | 0p | Under 25 words on any frame. Prose only inside a wait |
| OB14 a tour of the tools | 0p | Collides with AN3's mapping. Section 9, Q6 |
| OB15 no results or purpose | 0p | Collides with FH. Section 9, Q3 |
| AN3 the core loop is the tutorial | `TASKS.md` AN | Day one done is running it once. The station names are discover, play, flow, embody, his words in FK, never a surface name. Section 0 |
| AN5 lives in the profile, replayable, no real charge | AN | The toggle and the replay live in Account. Nothing writes to the axes |
| AN6 humble and warm | AN | Carried by the name and by silence, never by adjectives |
| AN7 the signal test is the one thing they do | AN | Frames 2 to 6 |
| AN9 same onboarding for both arrivals | AN | No branch on origin. The only branch is on data: is a name already there |
| AN11 capture something | AN | The name, and the two marks. Section 9, Q7 |
| OBS5 no observer test in onboarding | 0p | Not named, not run |
| Opens on the Field | CLAUDE.md, 19 September | The landing is the Field |
| Every layer on | FE item 1, EZ | The landing draws everything |
| The boot is the overture, never auto skipped | `ui/panels.js` | The box does not touch it |

---

# 4. The sequence, in one line

**Superseded by section 0.3.** Kept as the record of the first draft.

    boot  ->  check in  ->  signal test  ->  the loop  ->  landing
    5.24s     one press     about 60s       four presses   the Field

Five screens. The signal test is one screen with five states and the loop is
one screen with four, which is how the prototype already draws them
(`proto/onboard/onboard.html`). **One object threads all five:** the seven
colour ring the boot ends on shrinks onto the check in, becomes the progress
ring through the signal test, carries the four stations through the loop, and
closes onto the Field. A person never meets a second indicator.

**Forward presses: six.** Next on the check in, Next on the two marks, Next on
each of the four stations. Judgement, from the frames below.

**Words: about 110 across the whole run**, against 372 shipped
(`DESIGN-onboard.md` section 2, measured 20 September at `ed4170e`) and 120 in
the stopped prototype (same file, section 6, measured). Judgement: the check in
adds about 20 and the loop is written at about 10 a station.

**Time from first paint to landing: about 95 seconds with two second beats,
about 115 with three.** Judgement: 5.24 boot, about 8 on the check in, 8 of
settle, ten beats of yes, 5 of hold, ten beats of no, about 4 on the marks,
about 3 a station. The beat length is his open question Q4 in
`DESIGN-onboard.md` section 7 and is not answered here.

**Time to the first act: about 6 seconds.** The first thing a person does is
type their own name, where the shipped flow spent 47 seconds of reading before
the first act and 69 before the first press (`DESIGN-onboard.md` 2.1,
measured). This is the largest single change in the storyboard and it comes
from FH, not from me.

---

# 5. The frames

Each frame: what it shows, what a person can do and how many things that is,
what it writes, and what happens on a skip or a leave. Copy is proposed, run
through `check.py --line` on 26 September (no hard failures, antithesis, gloss,
it-is opener and reassurance all at 0.0), and still owes the voice seat's ten
passes before it ships.

## F0. The boot. Shipped, unchanged.

**Shows.** The FC composite: spine, seven seats, the colour ring travelling
outward, addresses thrown out and cooling into their seats, the glass lens.
**Can do.** Anything, and anything skips it. **Time.** 5.24 seconds.

**One change, at the seam only.** On a launch where the opening is on, the
boot lifts onto F1 instead of onto the Field, and its final ring lands at F1's
mark position rather than dissolving. On a launch where it is off, nothing
differs from today.

**Two defects this seam would ship if built naively, both of a kind this
repository has already paid for.**

- `ui/ui.js:1313` opens the onboarding on a typed `setTimeout(...,5600)`. That
  is a second copy of the boot's length in a second file, which is exactly the
  pair ET found at `panels.js` and `head.html`, where the fade never once
  played. F1 must open off the boot's own lift (`enterLift`'s caller in
  `panels.js`), never off a number.
- The Field's once a session entrance (`ui/wheel.js:749`) is started by the
  boot's lift. On a first run the lift reveals F1, so the entrance would run
  and finish under F1 and nobody would see it, which is ET's second bug in a
  new coat. On a first run the entrance is held until the opening closes and
  started by the close.

## F1. The check in. His "loading screen".

**Honest about what it is.** Measured in the boot comment itself: "the app is
usable at 198ms". There is nothing to load, and the UX skill is explicit that
an indicator for a 20ms operation is a lie about effort. So this screen carries
no spinner, no bar and no "loading" word. It is a check in, which is his other
word for it, and what it loads is the one thing that is actually about the
person: their name, into their numbers.

**Shows, top to bottom.**

    [the boot's ring, at rest, small]
    Hello.                      -> Hello, Lance.  as the first field fills
    First name   [          ]
    Last name    [          ]
    Your name sets three of your numbers. Held in this browser.
    [ ] Go straight in from now on
    [ Next ]

**Can do: four things.** Two fields, one box, one button. Under the floor of
twelve and at the working memory of four, and the only screen in the run that
reaches four.

**The greeting fills as they type.** "Hello." becomes "Hello, Lance." on the
first field's input, not on its change. No dead state (UX rule 9), and it is
the answer to "these people see me" (`ui/onboard.js:66` to `:68`, his words)
delivered by the person's own keystrokes rather than by an adjective.

**The line under the fields is a fact with its cost named.** "Your name sets
three of your numbers" is expression, soul urge and personality, which
`engine/numerology.js` computes off a name alone. "Held in this browser" is the
same fact `ui/account.js` states on Privacy, said at the moment of asking
because that is the practice the product already follows for the outbox
(`ui/account.js:456`, "said before they type, not after"). It is not a
reassurance against an unraised fear: an ask for a name raises it.

**Fields.** Visible labels, never placeholders. `autocomplete="given-name"`
and `"family-name"`. Middle name is not asked: Energetics asks it, and
numerology treats a middle name as its own part, so its absence changes
nothing that is printed, only what can be printed later. Sentence case, plain
class, never title cased: "de Vries is not De Vries" (`ui/account.js:267`).

**The box.** His words: "Do you want to check this box so you don't have to
see this again?" The label is the state it sets, in the person's verb: "Go
straight in from now on". The whole row is the target, 44 by 44 at minimum.
It sits above Next because it changes where Next goes, and read order has to
reach it first. On a phone it stays above the keyboard with Next.

**Next is the only button and its label never changes** (UX rule 2, OB21).

- Box clear: the name is written, F2 opens.
- Box ticked: the name is written, the opening is switched off, the ring
  closes at once and lands on the Field (F11). The whole opening is skipped
  now and on every later launch, until the toggle in section 7 turns it back
  on. Q1 in section 9 is whether that is what he meant by "this".

**Writes.** `who.first` and `who.last`, through the same setter Energetics
uses, only if typed, and reported through `status()` if the save fails. The
opening flag, section 8. Nothing to the nine axes.

**On a later launch with a name already on the record,** the fields are not
shown. F1 is the greeting, the box and Next: three things, "Hello, Lance."
This is the only branch, and it branches on data rather than on where the
person came from, so AN9 holds.

**Empty is allowed.** Next with both fields empty goes on. "Hello." stays
"Hello.", Root energetics stays not read yet, and the name can be given on
Energetics any time. Q4 is whether it should be required.

## F2. The settle. Signal test, state 1 of 5.

Built: `proto/onboard/onboard.html`, step 1. `shot-settle-1600.png`,
`shot-settle-390.png`.

**Shows.** The ring, empty, closing over 8 seconds. Under it three lines, 22
words, each with its icon. Reused verbatim from the prototype:

    A word arrives ten times. Think it as it lands.
    Keep some attention on your body.
    Move the marker to show what moved.

**Can do: one thing.** Leave, top right. There is no Next: the ring is the
Next. The only prose in the whole signal test is read inside a wait that has
to happen anyway, which is the OB13 answer the stopped pass found.

## F3. Yes. State 2 of 5.

Built: prototype step 2. `shot-yes-390.png`, which is the drawing for this
frame. **Shows.** The word "yes", and one circle the person touches, with the
ring's arc running round that circle's rim so there is one circle on the
screen and not two. Ten beats. **Can do: two things.** Move the marker, Leave.
SIG2 and SIG5: the person generates the state, and no list of words is offered.

## F4. The hold. State 3 of 5.

Built: prototype step 3. "Stay with what is left of it." The ring closes once
more. **Can do: one thing.** Leave.

## F5. No. State 4 of 5.

As F3, with "no". `shot-no-*.png`.

## F6. The two marks. State 5 of 5.

Built: prototype step 5. `shot-marks-*.png`. **Shows.** Both marks on one
circle and the distance between them. No number, no score, no list of words,
and nothing telling the person where they should have felt it, which is the
defect the shipped build carries (`DESIGN-onboard.md` section 3, defect 5).

    A thought moved your body.            both marks moved
    Both marks are at the centre.         neither moved
    The circle recorded nothing.          one or both never touched

**Can do: one thing, plus Leave.** Next. **Writes.** Nothing to the axes
(AN5). Whether the two marks are kept on the record, so the next run can show
whether they moved, is Q7.

## F7 to F10. The loop. One screen, four states.

**Superseded by section 0.4**, which performs the four stations in the real
product instead of turning a ring through four cards. **The surface mapping
below is withdrawn in FK**: the stations are discover, play, flow, embody, by
name, and are not relabelled as journal, imprints, release or ritual. Kept as
the record of what was proposed and corrected.

Built: prototype stations, `shot-discover-1600.png` is the drawing. **Shows.**
The ring with four stations at 12, 3, 6 and 9 o'clock, the lit station's name
and icon, one line, Next. Next turns the ring a quarter (OB24), so the person
performs the loop with the only control on the screen. **Can do: two things
per state.** Next, Leave. The station labels are not in the document until the
loop begins (`DESIGN-onboard.md` section 4: invisible text is still text).

**The mapping is AN3's and the content chain's, which is not the prototype's.**
CLAUDE.md, his words: what is entered in the journal is added to the imprints,
part becomes a story to release, part becomes a practice in the ritual. AN3:
"discover, play, flow, body, which is the journal, the imprints, the release
and the ritual." The prototype mapped play to the Field and embody to Body to
satisfy OB14. Q6 asks which he means.

Two line sets, because OB15 and FH disagree (Q3). Both passed the voice gate.

| Station | Surface | Mechanism only, holds OB15 | Purpose led, from his FH words |
|---|---|---|---|
| discover | Story, the journal | You write the day. It reads charge out of the words. | It finds your story and the place in the body where it lives. |
| play | Story, the imprints | Your words come apart into imprints. Each one sits at an address in the body. | It finds what that story is wired to, and what it costs you over time. |
| flow | Release | A release runs one line at a time over one address. You follow it in thought. | Release takes the charge off, one address at a time. |
| embody | Ritual | A practice comes out of the reading. You mark the day. | The ritual holds the change, one day at a time. |

The first cell of the left column is the prototype's line, kept. "In thought"
is the product's existing term (voice skill, V6 fix). The right column is FH
material and not final copy: FH says it is raw, and anything claiming healing
goes through `marketing/refuse.js` and the CQ seat before it can ship.

**On the fourth Next the ring closes.** The arc sweeps back to discover and the
screen opens onto F11. There is no last screen and nothing to count towards.
The opening flag switches off here, because it has been seen.

## F11. The landing. "The starting square".

**Revised in section 0.4, T5**: the lit first door is dropped, because the
doors are gone once a story exists, measured.

**Shows.** The Field, every layer on (FE), drawn as Frames if Q2 lands on
Frames, and the Field's entrance playing now, held from the boot for exactly
this moment (F0). The ring from the opening lands on the stage's own centre and
becomes the Field's core.

**Two things are lit, once, and only on this landing.**

1. **The first door.** "Write what happened" carries the ring's arc colour on
   its border for this landing only. It is a strong default, not a gate, which
   is the same posture as the intake ruling in CLAUDE.md. It is the door to the
   change M2 asks for and to the discover station the person just pressed.
2. **Root energetics, if a name was given.** Open, showing expression, soul
   urge and personality, because it is the only thing on the Field that is
   about this person. EZ ruled the section starts closed, so this is Q8.

**The count on this screen is the standing problem and this storyboard does not
solve it.** Measured 19 September on a blank profile: 71 simultaneous choices
on the Field at 1600 and 20 at 390 (`reviews/QUESTIONS-onboarding.md` section
3, dated, the rail has been rebuilt since and it must be re-measured). The
opening lands a person on the most loaded screen in the product. The lit door
is the mitigation, not the fix. The fix is AN8, the bar that grows, and the
left column fold FE already built, and both are outside this file.

---

# 6. Skip, leave and dismiss, every route

| Route | Where | What it does | Opening flag after |
|---|---|---|---|
| Any press on the boot | F0 | Skips the boot only, as today | unchanged |
| Box ticked, Next | F1 | Name written, straight to F11 | off |
| Leave | F2 to F10, top right corner | Ends the run, straight to F11, status line names where to find it again | off |
| Escape | F2 to F10 | Same as Leave. On F1 it does nothing: F1's way out is the box, and a key that throws away a half typed name is a key nobody meant to press | off |
| Last Next | F10 | Ring closes, F11 | off |
| Tab closed or reload mid run | anywhere | Nothing written for the run | still on, so the next launch opens on F1 with the greeting and resumes at F2 |
| Save fails | any write | `status()` says so and the run still ends, OB20's rule | on, and the status line says it will open again |

**Leave is a corner word, not a second button.** It is the prototype's own
pattern (`shot-yes-390.png`, top right), it sits outside the column a person is
reading, and it answers the UX floor: anything over ten seconds gets an
estimate and a way out. OB3 struck a second button beside Next, and this is
not one. If he reads Leave as that button returning, it is a one word removal,
and the cost is a 60 second exercise with no exit but closing the tab.

**The status line on Leave:** "The opening is in Account." One sentence, the
route and nothing else.

---

# 7. Where the box and the toggle live in Settings

**The box lives on F1 only.** It is the check in's own way out and it is the
same switch as the toggle below, seen from the other side.

**The toggle lives in the group that already exists.** Profile button, top
right of the bar, opens Settings. Settings opens on the Account section
(`ACC_OPEN='account'`, `ui/account.js:32`). The third group on that section is
**The Opening** (`:115`). One press from anywhere in the product, and no new
place to learn.

That group today holds one action. It becomes a toggle and an action, drawn
with the two row types the account area already has (`accTog` at `:81`,
`accAct` at `:72`), so no new component:

    The Opening
      Show the opening at launch                        [ switch ]
        the check in, the signal test and the loop
      Run the opening now                               [ Open it ]
      The signal test writes nothing to the nine axes. The opening keeps
      your name, and only if you typed it.

- **The switch** writes the opening flag through `uiSet`, the one writer for
  profile preferences (`ui/account.js:333`), which already reports a failed
  save. On means the next launch opens F1 after the boot. It never opens the
  run immediately: a switch that navigates is two controls in one.
- **Run the opening now** replaces "Run the signal test again" and calls the
  same entry the launch does. It starts at F1 if no name is on the record and
  at F2 if one is. It does not touch the switch.
- **The foot line changes** because the old one, "Nothing it does is written to
  your record", stops being true the moment F1 writes a name. The product
  never claims a write it did not make, and it does not hide one it did.
- **The Identity group above it is untouched.** It reads the name F1 wrote,
  and "Change it" still opens Energetics, the one editor.

**The word is "opening", everywhere.** The account area already calls it The
Opening. He says onboarding and tutorial, and both are team words; putting
either on a screen beside "opening" is two words for one concept (UX rule 1).
The check in is part of the opening and is not given its own word in the UI.

---

# 8. What a build would need, named so it is not discovered

Not code. Preconditions, in the order they bite.

1. **One flag, on the schema.** `ui.intro`, boolean, default true in
   `blankProfile`'s `ui` block (`engine/schema.js:35`), validated by name in
   `validateProfile`. An older profile carrying `onboarded:true` reads as
   `intro:false`, so nobody who has already met the opening meets it again
   uninvited. This retires the unvalidated `onboarded` flag. Additive, but it
   touches the profile shape, which is the cross compatibility contract with
   SOURCE and his (CLAUDE.md, "His, not mine").
2. **`OB_AUTO` goes true only when he approves this storyboard.** OB0 turned it
   off on his word and EZ on 26 September repeated "not right now". FH is the
   first ruling since that asks for the opening as a one time screen.
3. **The sheet goes.** `#ob` is a modal sheet. OB9 rules no pop ups. The run
   is a full screen surface with nothing of the product painted behind it,
   because a sheet over a working instrument is the thing that ruling struck.
4. **The seam reads the boot, never a number** (F0).
5. **The Field entrance is held to the opening's close** (F0).
6. **The Frames arrival is not ported.** If Q2 lands on Frames, the landing
   needs the Frames entrance from `proto/arrival/arrive.js`, which FC names as
   not done. Every Field gate measures the Wheel, so Frames as the landing
   also needs its own checks in `tests/functional.js` and `tools/monitor.js`.
7. **The profile name stays You.** F1 writes `who.first` and `who.last`, not
   `CURP.name`, and the Account heading prints `CURP.name`. Renaming the
   profile to the first name is tempting and is not in this storyboard, because
   `PROF_BY` has keyed on the profile name before and been bitten by it
   (`ui/account.js:356` to `:363`). Q4 covers whether the heading should read
   the person's name.
8. **Reduced motion and Quiet.** The boot is already cleared at once. The
   ring's arc steps instead of sweeping; the beats still pace, because pace is
   the exercise and not decoration.
9. **Gates.** `tests/funnel.js` and `tests/functional.js` walk F1 to F11 on a
   blank profile at both widths; one run with the box ticked; one with Leave at
   F3; one reload mid run that resumes at F1; one with storage blocked. Then
   five real people at 390, before the numbers are believed.

---

# 9. The questions. His to rule, with both answers and what each costs

**Q1. What does the box turn off?** His words: "Do you want to check this box
so you don't have to see this again?"
- *The whole opening, one switch.* As storyboarded. Ticked, the person goes
  straight in now and never meets F1 again until the toggle says so. Costs the
  greeting by name on later launches.
- *Only the check in, as a greeting on every launch.* F1 says "Hello, Lance."
  after every boot until the box is ticked, separate from the walk through,
  which is then one time on its own. Costs one press on every launch for every
  person who never finds the box, and James and Derek pay it first.

**Q2. Is "the starting square" Frames?** His words: "If we can get that lined
up with the start, the starting square, that'd be cool. It also needs to have a
loading screen in between." FA confirmed "the square" is Frames.
- *Frames.* The first run lands on the Field drawn as nested frames; later
  launches keep whatever view the person last chose. Costs the Frames arrival
  port and its gates (section 8, item 6).
- *Square one, the start.* The boot hands off to the check in with no cut and
  the landing stays on the Wheel as shipped. Costs nothing to build. It does
  not give him the square if that is what he meant.

**Q3. Revised in section 0.10.** As first asked:

**Q3. Does the loop say what each tool is for?** OB15, 20 September: "At no
point are we talking about results or purpose." FH, 26 September, in the same
breath as the storyboard ask: "Highest purpose of the product results." OB25
has asked this since 20 September and is still open.
- *Mechanism only.* The left column of the station table. Holds OB15. Costs
  the why, and Angela is the person who needs it.
- *Purpose led.* The right column, from his FH words. Costs OB15, and every
  line goes through the refusal gate before it ships.

**Q4. Is the name required?**
- *Optional,* as storyboarded. Next works empty. Costs the greeting and the
  three numbers for anybody who skips it.
- *Required.* Next waits for a first name. Costs Diane and James, who walk at
  an ask placed before a payoff (`reviews/QUESTIONS-onboarding.md` Q3 and
  section 3). And: should the Account heading then read the person's name
  instead of "You"?

**Q5. Revised in section 0.10.** As first asked:

**Q5. Does the opening end at the door of the first story, or walk through
it?** AN5: it "does not spend real charge". M2: "a first session ends in a
change, not a tour."
- *At the door,* as storyboarded. The loop is shown, the first door is lit, and
  the first real entry is the person's own act on their own field, with undo as
  the net (`engine/undo.js`, built). Costs M2 inside the opening: the change
  happens only if they take the door.
- *Through it.* The discover station opens the real journal and the loop waits
  for a first entry. Costs AN5, and a first session that must write before it
  may continue, which is the story surface's refusal rate at the front of the
  product.

**Q6. Retired in FK.** He answered it: "It's discover play flow embody." The
text below is the record of the question as it was put.

**Q6, as asked. Which four surfaces are the four stations?**
- *Journal, imprints, release, ritual.* AN3 and the content chain in CLAUDE.md.
  As storyboarded. Costs the Field and Body a named station, and OB14 named
  them.
- *Story, Field, Ritual, Body.* The prototype's mapping, built for OB14. Costs
  the release, which he calls the true gamification, a station of its own.

**Q7. May the opening keep the two marks?** AN11 asks the opening to capture
something. `RESEARCH-signal.md` names the one capture that needs no shared
vocabulary: whether the same shape returns next session.
- *Keep them,* dated, on the record and never on the axes. A replay can draw
  the last run's marks beside this run's. Costs a new field on the profile,
  which is the schema and his, and the foot line in section 7 gains a clause.
- *Keep nothing.* Costs the one thing the signal test can show over time.

**Q8. Does Root energetics open on the first landing?** EZ: "I want that one to
start closed."
- *Open, once, if a name was given.* The person lands on three numbers that are
  theirs. Costs his closed default, for one landing.
- *Closed, always.* Costs nothing, and the only thing on the Field about the
  person sits behind a fold on the one screen where it would matter.

Already open elsewhere and not asked twice: beat length, two seconds or three
(`DESIGN-onboard.md` section 7).

**A note for the funnel seat, not a question.** FH's welcome copy opens
"Welcome, name. Welcome to Attuned, comma name." In the app, OB4 rules
"Hello," and the voice gate fails a line that says a thing is starting (V1).
If the funnel page and the app are meant to greet in one voice, the funnel
storyboard should see this line.

---

# 10. Where they stop. Four walks, four levels of the grid

**Superseded by section 0.7**, whose walks follow a build that was run.

`BUYERS.md` peaks at 8 to 10 and collapses through 5 and 4, which are the
largest population. The engine's own reading of each reference profile has
moved since the CQ refit (FG in `TASKS.md`), so no level is quoted here from an
older run: read it off the profile.

**Marcus, 44, creative director. The beachhead.** Boot: watches it. F1: types,
reads "Hello, Marcus.", reads that his name sets his numbers, continues. **F2 is
his stop.** Eight seconds of a closing ring and "keep some attention on your
body" is the most wellness looking moment in the run, and Q9 of the twelve
already named that risk for him. What holds him: the pad in F3 reads as an
instrument, a crosshair and a marker, and Leave is visible. Watch F2 abandon in
the five person test.

**Angela, 36, seeker.** F1: likely the warmest screen for her, her name comes
back. Signal test: her moment, she stays. Loop: stays if the lines say what the
tools do for her, which is Q3. **F11 is her stop.** She lands on the most
loaded screen in the product. The lit door is what keeps her; without it she is
back where `reviews/QUESTIONS-onboarding.md` section 3 lost her, taking the
nine sentences and meeting truncated fragments.

**Diane, 46, founder.** **F1 is her stop, if the name is required.** She walks
at an ask placed before a payoff. With the name optional, the line under the
fields tells her what it buys, and the box lets her go straight in. Either way
she is on the Field in two presses.

**James, 57, C suite. Defended, short on time.** Sees the box, ticks it, is on
the Field in one press. The storyboard serves him by getting out of his way,
and that is the right service for level 3: `BUYERS.md` says he is not the
market, and the voice skill's precedence says accusing him costs more than
losing Angela's sale. Nothing on F1 accuses.

**Derek, 39, high performer, briefly.** F6 gives no number, by ruling. He wants
the diagnostic. Watch whether "A thought moved your body." reads to him as a
claim with no instrument behind it.

---

# 11. What to instrument, before the build is judged

**Superseded by section 0.8.**

Held on the record as dated flags. Nothing is sent: there is nowhere to send
it, and the outbox rule applies (`ui/account.js`, obSend).

1. **Time to the first number about them.** First paint to Root energetics
   printing off a typed name. The shipped first run has no such moment at all.
2. **F1 completion, with and without a name.** Answers Q4 with data.
3. **Box tick rate.** High means the opening is a tax. Near zero means nobody
   sees the box.
4. **Where Leave is pressed, by frame.** F2 is the prediction for Marcus.
5. **Beats completed** on F3 and F5, which is Q4 of the stopped pass measured.
6. **Landing to first committed story,** in seconds, and whether the lit door
   was the route. This is M2, measured.
7. **Replays from Account.** A replay means the opening is useful after the
   first time, which is AN5's bet.
8. **Day two return.** One flag. AN10 says day two is the ritual.

Then five real strangers at 390, watched. Five surface about 85 percent of
what is wrong.

---

# 12. The grade

**Superseded by section 0.9**, which is measured where this was judged.

**Today, as a stranger:** D, 19 September, `reviews/QUESTIONS-onboarding.md`
section 8. The opening was off then and is off now, so a stranger lands on the
Field with nothing. Since then the boot plays, the rail is rebuilt and every
layer starts on, none of which was re-graded. Judgement: C today, not measured.

**Built as storyboarded:** B minus, judgement. The first act moves from 47
seconds of reading to about 6 seconds of typing a name, the first number about
the person arrives on the first press, and the whole run is about 110 words on
one ring. It is capped by where it lands: a screen measured at 71 choices,
which only AN8 and the rail fold can move. With AN8 built behind it, B plus.

---

# 13. Files

    atuned_src/engine/core.js:158        the opening tab
    atuned_src/ui/ui.js:1248             the blank You on a first visit
    atuned_src/ui/ui.js:1298, 1306-1313  the opening step and the typed 5600
    atuned_src/ui/panels.js:942-1023     the boot's lift, skip and floor
    atuned_src/ui/wheel.js:749           the Field entrance held under the boot
    atuned_src/ui/rings.js:59-79         Wheel, Frames, Dial and the stored view
    atuned_src/ui/onboard.js             the shipped sheet, off at :43
    atuned_src/ui/account.js:111-118     The Opening group, the toggle's home
    atuned_src/ui/account.js:72-85, 333  the action row, the toggle row, uiSet
    atuned_src/ui/personas.js:150-157    Root energetics off a name alone
    atuned_src/engine/numerology.js:148  what a name computes, and what needs a date
    atuned_src/ui/intakeui.js:367-373    the one editor for the name
    atuned_src/ui/component.js:694-702   the four doors
    proto/onboard/onboard.html           the ring, the pad, the stations
    proto/onboard/shot-*.png             the drawings for F2 to F10
    RESEARCH-firstrun.md                 the run, six walks, and the sources
    proto/firstrun/walk.js               the walk, reproducible on any build
    proto/firstrun/observed/*.png        what a stranger met, 26 September
    proto/firstrun/storyboard.html       the drawings for every frame,
                                         published privately at
                                         https://claude.ai/artifact/Kudg5izpXHQAmyVVGNGiXT
    DESIGN-onboard.md                    the stopped pass, and its measurements
    reviews/QUESTIONS-onboarding.md      the twelve, the counts, the walks
