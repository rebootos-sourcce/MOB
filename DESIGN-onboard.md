# Onboarding: what was measured before the pass was stopped

**Status: stopped, 20 September 2026.** The owner ruled "let's turn off
onboarding for now" while this pass was in flight. Nothing here is a proposal
and nothing here asks for a decision. It is the record, so the next pass starts
from measurements rather than from a blank file.

**What this file is not.** It is not a design for a surface. The build brief
that produced these numbers is superseded and the rulings it was built against,
`TASKS.md` 0p OB1 to OB15 and SIG1 to SIG6, are untouched and still his.

**Three things in here are defects in code that ships or in a prototype that
does not, and they do not depend on onboarding coming back.** They are in
section 5 with the line numbers, so somebody else can pick them up.

---

# 1. Method

Everything in sections 2 and 3 was executed, not estimated.

`source.html` at commit `ed4170e`, clean tree, driven in Chromium at
`/opt/pw-browsers/chromium-1194` from `file://` at 1600x1000 and 390x844. The
onboarding was opened through its own control with `obOpen(false)` and walked
end to end. Word counts are `innerText` of `.ob-card`, tokens containing at
least one alphanumeric. Control counts are buttons, inputs, selects, links and
anything carrying a role or a tabindex inside the card.

Three classes of figure, labelled every time.

| Label | What it means |
|---|---|
| **measured** | Executed in this build and read off the DOM. A fact about the file |
| **cited** | Published outside this project, with the source named |
| **judgement** | Reasoned estimate with the arithmetic shown |

**One caveat on the baseline and it is load bearing.** A copy sweep was live in
`atuned_src/ui/onboard.js` while this ran. The numbers below are off the built
`source.html` at `ed4170e`, which is what a person would have had in their hand.
The sweep has since cut a clause from screen 0 and rewritten the heading of
screen 1, so the shipping figure will be a few words lower than 372 by the time
anybody reads this. **Re-measure rather than quoting it.** That is the whole
lesson this repository has been bitten by seven times.

---

# 2. What ships today, measured

Four screens, one modal sheet, `role="dialog" aria-modal="true"`.

| Screen | Words | Controls | Screen counter |
|---|---|---|---|
| 0. "This is you, and it is okay." | **45** | 2 | 4 dots |
| 1. "We walk you through you." | **141** | 2 | 4 dots |
| 2. The signal test | **86** | 10 | 4 dots |
| 3. "What just happened" | **100** | 1 | 4 dots |
| **Total** | **372** | | |

No interactive element measured under 44 by 44 at either viewport. That floor
is met today and was never the problem.

## 2.1 Time to the first useful moment

This is the number the brief said decides it, and it is not how short the flow
is. It is how soon a person does something rather than reads something.

**Cited.** Silent reading of English non-fiction runs about 238 words a minute.
Brysbaert, *How many words do we read per minute?*, Journal of Memory and
Language 109 (2019), 104047.

**Measured and derived.** Screens 0 and 1 carry 186 words and contain nothing to
do but press onward. At 238 wpm that is **47 seconds of reading before the first
thing a person is asked to do with their body.** Screen 2 then puts a further 28
words of instruction above the first stimulus, and the first *capture*, which is
a click on one of eight seats, lands at about **69 seconds**.

**And the doing, when it arrives, is a click.** An exercise whose entire content
is interoception is executed with the eyes and a mouse. That is defect six in
section 3 and it is the one that matters most.

## 2.2 The voice gate on the shipping file

`python3 .claude/skills/atuned-voice/check.py atuned_src/ui/onboard.js`, run
20 September against the live file mid sweep:

| rate | onboard.js | house |
|---|---|---|
| antithesis | 4.8% | 2.8% |
| gloss | 4.8% | 0.9% |
| it-is open | **9.5%** | 2.6%, and it is over house |
| reassurance | 4.8% | 0.0% |

No hard failures. The skill's own section 7 records this file at 14.3% and 9.5%
before the sweep began, so the sweep has already moved antithesis a long way and
has not moved the demonstrative copula opener at all.

---

# 3. The six defects in the shipped signal test. All six reproduced.

`RESEARCH-signal.md` names six and `TASKS.md` SIG records them. Each was checked
against the running build rather than against the source, because a defect read
off code is a defect somebody asserted and a defect read off a screen is one
somebody saw.

**1. It is untimed. Reproduced.** Both words are in the document at once.
`innerText` of the step returns the instruction, the neutral word, the bridging
line, the charged word and all eight buttons in a single dump with no pacing
anywhere. A person can read the screen in four seconds and press a seat. His
description opens on "take a second, turn their senses inward", and there is no
second in it. This is the defect that makes the other five possible.

**2. Neither state is the person's own. Reproduced.** The contrast built is
between a dull word the product picked from a list of five and a loaded word the
product picked off the nine axes, defaulting to Fear. His contrast is between
affirming and negating and the person generates both. Yes and no carry no
subject matter, which is the point of using them: what moves is the act. "fear"
carries subject matter, so whatever moves could be this person's history with
the word. Two different exercises reading two different things.

**3. One exposure, not ten each. Reproduced.** No repetition anywhere in the
step. SIG2 is ten and ten.

**4. It asks for a location, from a list. Reproduced.** Measured: ten controls on
the step, seven named seats plus Nothing plus two navigation buttons. SIG5 is
explicit that we all feel it differently and the words we would use will be
different, and seven seats is a vocabulary handed over before the person has
felt anything.

**5. The payoff grades the felt sense against a table. Reproduced, verbatim off
the screen:**

> You felt fear at the root. That is where this instrument reads it too, which
> means your felt sense and the measurement agree before you have entered
> anything.

On the first screen of the product, the instrument checks a person's body
against a lookup table. `RESEARCH-signal.md` already rules this the line to
delete.

**6. The load and the shape. Reproduced, and my numbers differ from the
research's.** Ten simultaneous choices on the step, which passes the floor of
twelve. It fails the shape. Measured: **86 words on the step, of which 61 are
prose and 28 sit above the first stimulus.** The research reported "about 70
words above the first thing a person does"; the measured figure is 28 above the
first word and 45 above the first thing to press. Report the measured one.

**And the seventh, which is his own rule turned on the file.** Screen 2 carries
"There is no right answer, and nothing at all is an answer." Nothing on the
screen had suggested there was a right answer. That is V12 and it is the same
move as the "and it is okay" he struck himself.

---

# 4. The fight, and how it was being resolved

This is the part worth keeping. Four of his rulings collide and they collide
structurally, not as a matter of taste.

    OB1   no count of screens
    OB2   one button forward
    OB11  icons, shown as a loop
    OB13  far too much text
    OB15  at no point results or purpose

They fight because an onboarding buys patience with a progress indicator, and
every progress indicator is a count. The UX floor is explicit that the indicator
is what buys the patience and is not decoration, so it cannot simply be deleted:
a flow with no indicator at all is a flow a person abandons earlier, which is
the opposite of what OB1 is for.

## The answer, and it held

**There is exactly one progress object in the whole flow and it is the loop
itself. The ring is the indicator. Progress is angular rather than ordinal, and
a ring shows position without showing a remainder, because a circle has no last
place. The Next button does not advance a page, it turns the ring a quarter, so
the person performs the loop with the only control on the screen instead of
reading a description of it. And the fourth press does not land on a final
screen: it closes the ring, sweeps the arc back to discover and opens the
product, so there is nothing to count and nothing to count towards.**

That one object settles four rulings at once. OB1, because angular position
carries no ordinal. OB2, because one control turning a ring is one control.
OB11, because the loop is drawn as a loop and is the progress, not an
illustration beside it. And OB13, because a ring that carries the state needs no
sentence explaining where you are.

**The same ring carries progress at three scales,** which is why a person never
has to learn a second indicator: one close over eight seconds is a settle, one
close over twenty seconds is a word arriving ten times, one quarter a press is a
station of the loop. On the beat screens the arc runs around the rim of the
circle the person is touching, so there is literally one circle on the screen.

## The two things that followed from it, and both are worth keeping

**The text budget is spent inside a wait.** The only prose in the flow, three
lines and twenty three words, sits under the ring while it closes for eight
seconds. The pause has to happen anyway, so the instruction costs no time at
all. That is the general move for OB13: prose read during a pause a person is
already spending is free, and prose on a screen whose only other control is
Next is the expensive kind.

**The exercise goes before the tour, which reverses what ships.** Two reasons
and the second is the stronger one. Time to the first act falls from 47 seconds
to about three. And the tour's lines describe tools that read charge out of a
body: a person who has just felt a word land reads them as a fact about
something that happened to them, and a person who reads them first reads them as
a claim. Mechanic before name. It is the Nintendo order and the Half-Life 2
order and it is the reason both teach without a tutorial.

## What did not hold, recorded so nobody tries it again

**A dotted row with the dots unlabelled.** The first idea was to keep an
indicator and strip its numerals. It fails on sight: four dots are four dots
whether or not they carry digits, and OB1 is not about numerals, it is about a
person knowing how much is left.

**A static diagram of the loop on one screen.** The most literal reading of
"show it as a loop" is one screen carrying all four stations with their labels.
Four labels arriving together is four simultaneous items against a working
memory of about four, on the surface where the target is one, and a static
diagram on an onboarding screen is a thing nobody reads. The version that worked
keeps the whole ring on screen the entire time and lights one station at a time,
which is both at once.

**Rendering the station labels at opacity zero so the reveal could be a fade.**
Measured and caught: it put four words into the text tree of every screen that
was supposed to carry none, and the word count read 28 on a screen whose copy is
24. Invisible text is still text. The stations are not in the document until the
tour begins.

**OB14's third item cannot be built.** OB14 asks the onboarding to say "here is
what the Field does, here is what Energy does, here is how they work for you,
here is what the core loop does." Its third item is a purpose sentence and OB15
forbids purpose without exception. The other three survive as mechanisms in the
present tense with no benefit attached, and the fourth, the core loop, is the
ring itself. **This is a collision between two of his own rulings in adjacent
lines and it needs him, not a writer.**

**And a second collision, also between two of his own documents.**
`DESIGN-gamification.md` allocates the four quarters by mechanic: play is the
ritual and flow is the record, and the record now lives on the Ritual surface.
Following that table names one surface at two stations, so a person finishes
able to name three doors rather than four, and OB14's whole brief is that they
can name the doors. Both documents are his. Unresolved.

---

# 5. Three defects somebody else should pick up

None of these depends on onboarding coming back.

**5.1 `atuned_src/ui/onboard.js:92`. A write that can fail, swallowed.**

    try{ if(CURP){ CURP.onboarded=true; pSave(); } }catch(e){}

`pSave()` returns a boolean and callers elsewhere check it:
`atuned_src/ui/account.js:337` reads `if(!pSave()){status('Could not write to
storage. Nothing was deleted.','fail');return false;}`. This one ignores the
return value and swallows any throw into an empty catch. If storage is full or
blocked, `onboarded` never persists, nothing is reported, and the flow reopens
on every launch with no explanation of why. Against the standing rule that every
write that can fail reports through `status()` and a control must never claim
success before it has it.

**5.2 `atuned_src/ui/onboard.js`, the signal step's forward control changes its
own identity.** The button reads "Choose one to go on" while disabled and "Next"
once a seat is picked. UX rule 2: a slot keeps its label and the value carries
the state. A control whose label changes identity with the data makes a person
re-parse the screen every time the data moves, and here it does it on the one
screen where their attention is supposed to be inside their body.

**5.3 `proto/signal/signal.html`, the readout prints a reading as a score.** Its
final table carries "Separation, from the markers: 62 out of 100", "Separation,
as you set it: 62 out of 100" and "Angle between them: 74 degrees out of 180".
That is a count against a total on a reading, which the standing ruling forbids
and which V8 records twice. It is in a prototype and not in the build, so it is
cheap now and expensive if anybody ports it.

---

# 6. What exists on disk from the stopped pass

Left in place rather than deleted, because it is the evidence behind section 4
and a description of a mechanic is worth less than one somebody can press.

    proto/onboard/onboard.html     the ring, the paced exercise, the four
                                   stations. Runs from the file system,
                                   references ../../engine.js and never copies
                                   it, and was measured at zero outbound
                                   requests and no dropped frames
    proto/onboard/shot-*-1600.png  ten states, desktop
    proto/onboard/shot-*-390.png   ten states, phone

**It is a stopped prototype, not a proposal,** and it has not been walked with
the reference profiles, so no completion or retention figure is attached to it
and none should be invented later. What it does carry that is worth reading is
the ring, the arc on the pad rim, and the three lines read inside the settle.

**One measurement off it, and only because it is a fact about a file that
exists.** Measured the same way as section 2: 120 words rendered across the
flow over 24 distinct lines, 95 distinct words, against 372 today. The distinct
figure was 97 in the first draft of this paragraph, computed by hand, and the
measured number is 95. That is the eighth time this repository has been bitten
by a number somebody typed instead of reading off a run, and it is recorded
rather than quietly corrected. Voice gate clean: antithesis 0.0%,
gloss 0.0%, demonstrative copula opener 0.0%, reassurance 0.0%, median sentence
5 words against a house median of 6, no hard failures.

---

# 7. What stays true whatever gets built

**The observer test does not go in onboarding and this does not reopen.**
`RESEARCH-signal.md` rules it out on five grounds and the first is his own book:
"The Observer does not unlock at the beginning of the work. Explain it and it
becomes an idea. Run the sequence and it becomes direct experience." It runs
five to six minutes against a two minute flow, it fails Diane, Derek and James
on the buyer grid while passing Angela, and first run is the worst place in the
product to run a decentering induction on somebody who has entered nothing. It
belongs in `engine/data/practice.js` as a six minute row and it is offered
before the first release, which is the moment his own note names. Onboarding may
name it. It may not run it, and naming it without running it carries only
purpose, which OB15 forbids, so the honest version names it nowhere.

**And the open question the research put to him is still open.** Q4: ten
repetitions is his and the length of the beat is not. Three seconds gives eighty
one seconds of paced attention and two gives fifty two, and fifty two is the
figure that holds Diane on the same argument that keeps the observer test out.
Whether two seconds is long enough to feel anything is not something this seat
can measure. It is his.
