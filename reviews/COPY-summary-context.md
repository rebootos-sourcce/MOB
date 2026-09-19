# The Summary, And The Standing Rule That Context Is Key

Editorial and narrative. Written against AH1 to AH5 and AJ1, from the surface
as it renders today, on a real Chromium at 1600 x 1000 and 390 x 844.

Build read: `source.html` md5 `3007ed4bb765df2ec4c6b6a42f24e284`, branch
`claude/laughing-feynman-xhfyj3`, head `a68f5dd`. Built with
`./atuned_src/BUILD.sh`, driven with `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`,
7200ms to boot, profiles loaded through `loadP()`, surface `#sumbody`.

**A probe lied before the code did, and it was mine.** My first run passed
`loadP(3)` for Angela and read back Marcus. `PEOPLE[0]` is the custom profile
at runtime, so every reference index is one higher than the source file's array
looks. Every figure below was re-measured after the correction. Angela is 4,
Derek 5, James 6.

**The tree moved while I was reading it.** Another session committed `b315ba5`
part way through, so `source.html` is no longer the file I measured. I diffed
the two. The only change touching anything in this report is seven lines adding
`PAL_VIVID` to `canon.js`, a third seat palette for Lumen. No renderer, no
figure and no string in this file moved. Every measurement below stands, and
the md5 above is the one it was taken on.

Nothing in this file was written. No product code changed. No commit.

---

## 1. What The Centre Column Actually Says Today

### 1.1 The nodes, so nothing here is a claim about a picture

The centre column is `#sumbody .s-cols .s-main`. At 1600 it measures 522px
wide beside `.s-side` at 328px. At 390 both measure 362px and stack. Its
children, in document order, measured on James:

    .s-told      What You Told It      renders only when a story entry exists
    .s-readbox   the reading           three .s-p paragraphs and one .s-src
    .s-outrow    three .s-out cards    protocol, release, next marker
    .s-glance    six .s-gl buttons     coherence, shadow weight, carried depth,
                                       pole, energy, identification

Above it, outside `.s-cols`, sits `.s-plate`: `.s-pname`, `.s-pl-r` carrying a
`cr()` ring and `.s-pband`, and then `.s-ptoward`.

### 1.2 The plate, transcribed

`.s-pname` reads `James`.

`.s-pband` reads `Severe` then `Numb`.

`.s-ptoward` reads, under an eyebrow that renders `Where It Goes`:

> Off the floor, and nothing more ambitious than that. One seat, one address,
> one line. Not a programme.

**That is the string AH3 names.** It is not a bug and it is not stray text. It
is `TIERDEF` `toward` for the Severe band, `atuned_src/engine/data/canon.js`
line 381, rendered by `sumPlate` in `atuned_src/ui/summary.js` line 471. The
owner read it as part of a summary because it is printed in the place a summary
subtitle goes, directly under his own name, in the sentence shape of a subtitle.
It is the third of the three things a band is required to carry and it is in the
wrong slot. It comes out of the plate. Section 4 says where it goes instead.

`.s-pwho` did not render on any of the three profiles. It is guarded on
`CURP.who.line`, which nothing in the build ever writes.

### 1.3 The reading, transcribed in full. James

`.s-readbox .s-p`, paragraph one:

> The blueprint you were born on reads **air**, which is the **Witness** root,
> on life path **7**, the one who looks. The name carries an expression of
> **1**, builds first and asks after. What is actually running is
> **Architect**, through **Sage**. Those do not agree. A blueprint that says
> Witness and a field that runs Architect means something was installed on top
> of the blueprint, and it has been carried long enough to feel like a
> personality.

Paragraph two:

> That reaches the body at **Blame**, on the **anger** axis, at a weight of
> 6.2. The biggest thing compounding on it is **Aggressor**, at a 100 percent
> match. Flow stops at the **sacral**, which is where the charge is dense
> enough to close the seat. Shadow weight is 9.1 and the law furthest shut is
> **Compassion**, at the heart.

Paragraph three:

> Momentum: the field leans **malignant** at 74 percent, which means it is
> contracting. Installed pole is past the point where it pays, so some of the
> work is now costing. No avatar has been stated, so there is nothing to
> measure this against. Say who you are becoming and this paragraph names what
> stands in the way.

`.s-src`:

> Written from the nine axes, the twenty one laws, the blueprint and the birth
> data. Nothing here is generated from anything the instrument has not
> measured.

`.s-outrow`, three cards:

> The Protocol This Calls For / A practice / Open it
>
> Release This First / Blame / Heart seat, holding 6.2. Release has about 7.2
> in it / Run a release
>
> Next Marker / Entry / 1 away

`.s-glance`, six buttons, each a ring, a pill and a key:

> 13% coherence | 9.1 shadow weight | 5.1 carried depth | 0.55 pole |
> 0.29 energy | 79% identification

### 1.4 The same column on Angela and Derek

Angela, `.s-readbox .s-p` two and three:

> Nothing is held above the line, so nothing is reaching the body as load.
> There are 74 addresses carrying under it, which is signal and not yet cost.

> Momentum: the field leans **benign** at 82 percent, which means it is
> contracting.

Derek, paragraph two:

> That reaches the body at **Need For Approval**, on the **shame** axis, at a
> weight of 6.6. The biggest thing compounding on it is **Avoider +
> Restless**. Flow stops at the **sacral** ...

### 1.5 Which sentences are about the person, and which are the instrument
### talking about itself

Counted clause by clause across the three profiles.

**About the person.** Six clauses, and they are the only six.

    the blueprint reads air, and air is the Witness root
    life path 7, the one who looks
    the expression is 1, builds first and asks after
    what is running is Architect, through Sage
    it reaches the body at Blame, on the anger axis
    the law furthest shut is Compassion, at the heart

**About the instrument, or about its own arithmetic.** Everything else.

    "at a weight of 6.2"              a figure on a scale never named
    "at a 100 percent match"          a match between two things, unstated
    "Flow stops at the sacral"        flow is not defined anywhere a thumb reaches
    "Shadow weight is 9.1"            a number with no range and no meaning
    "Momentum:"                       a label on a paragraph, not a sentence
    "leans malignant at 74 percent"   74 percent of what
    "Installed pole is past the
     point where it pays"             four abstractions in one clause
    "No avatar has been stated, so
     there is nothing to measure
     this against"                    the instrument reporting its own gap,
                                      in the last paragraph, in the place the
                                      reading should land
    ".s-src" in full                  a disclaimer about the instrument
    "Release has about 7.2 in it"     7.2 of what
    "Next marker / Entry / 1 away"    1 what
    all six glance keys               six bare figures, no clause on any

That is six clauses about a person against roughly twenty about the machine,
in the column the owner asked to be purely text about him.

### 1.6 Four defects measured, not inferred

**One. Not one bold name in the reading carries its mark's colour.** AH1 is
real and it is total. I read `getComputedStyle().color` on every `<b>` inside
`.s-readbox`. Twelve bolds on James, seven on Angela, every one of them
`rgb(239, 237, 232)`. One off white for Witness, Architect, Sage, air, anger,
sacral, Compassion and malignant.

**And the mechanism is already built, four inches away.** `sumWords`, which
colours a committed story entry, works correctly. I committed one entry to
James and measured `.s-told b`: `angry` came back `rgb(212, 188, 112)`, which
is Solar. `tight` came back `rgb(101, 184, 212)`, Throat. `not sleeping` came
back `rgb(196, 99, 94)`, Root. So the same page colours the person's own words
by seat and prints the instrument's names in a flat grey. AH1 is applying one
rule that exists to the one block that does not have it.

**Two. Angela's third paragraph contradicts itself in one sentence.**

> the field leans benign at 82 percent, which means it is contracting

`lean.ben` is 82 and `r.benign` is `CQ >= 50`, which is false at 40.9. The
renderer takes the word from the first and the consequence from the second and
joins them with "which means". Benign and contracting are both true of her and
neither causes the other. Measured across the roster, three of fifteen profiles
print this: You, Marcus, Angela.

**Three. Derek's sentence has a hole where a number should be.**

> The biggest thing compounding on it is Avoider + Restless.

The percent match clause is conditional on the loudest item also being the top
named saboteur. It is not, so the sentence ends on a raw internal name with a
plus sign in it.

**Four. Two glance figures print outside the range they state.** Covered in
section 2, because it is the whole of section 2.

### 1.7 What the centre does not contain

On all three reference profiles `.s-told` does not render at all, because no
reference profile carries a story entry. So on every profile the owner opens,
the centre column contains no material from the story journal. The block that
carries his own words is the first child of the centre and it is empty by
default. Section 4 addresses this directly.

---

## 2. Context Is Key. Every Number This Product Prints

This is AJ1 and it is the most valuable part of this file.

His example was the compass and the compass is honest evidence. Here is the
whole string, `coneRead()`, `atuned_src/ui/cone.js` line 441:

> You read **13**, below the oscillating band. Integrity **4.3**, coherence
> **13**.
>
> Integrity is the hull. A hole in it means the ship takes on water, and
> everything above the waterline stops mattering. Integrity raises coherence,
> coherence raises what you can hold to, and that raises integrity again. The
> loop turns both ways. Yours is currently turning **down**.

The second paragraph is about integrity. It is not about 4.3. A person reads a
paragraph about hulls and still does not know whether 4.3 is bad, how bad, or
how far it is from anything. **A metaphor is not a context clause. A range, a
direction and a next move is a context clause.** That is the correction.

### 2.0 The rule, in a form that can be checked

Every printed figure carries four things, in this order, in the one place the
figure is printed:

    1. the scale        what the top and the bottom of it are
    2. the reading      what this value means on that scale
    3. the cost         what it produces in behaviour
    4. the move         the one thing that moves it

Where all four will not fit, the scale and the reading are not optional. The
cost and the move may sit one press away. **A tooltip is not one press away on
a phone.** The Field console's eight readings put the entire definition in a
native `title=` attribute, `atuned_src/ui/ui.js` lines 638 to 689, and the
audience arrives on phones. Every one of those definitions is currently
unreachable for most of the people who will read this product.

### 2.1 The measured state of the scales, which has to be fixed before any
### clause can be written

Read across all fifteen profiles.

| Figure | Range stated to the person | Range actually measured | Verdict |
|---|---|---|---|
| CQ, coherence | 0 to 100 | 1.0 to 100 | correct |
| DQ, shadow weight | "0 to 10" on Summary, no range on Field | 0 to 54.74 | **false** |
| SQ, carried depth | 0 to 10 | 0 to 5.96 | correct, never exercised |
| Pole | "0 to 1" in both places | 0 to 8.49 | **false by a factor of ten** |
| Vitality, awareness, will | 0 to 1 | 0.01 to 1.0 | correct |
| Flow | 0 to 1 | not swept | assumed correct |
| Integrity, intention | not stated | 1.93 to 10 | 0 to 10, and it is not said |
| Identification | 0 to 100 with an interval | 22 to 96 | correct, and it is the model |

**DQ is the worst number on the surface.** The summary glance calls it "What
is held, 0 to 10." Ana reads 22.83, Nkem 19.62, Tomas 45.89, Gordon 54.74.
`cr()` clamps its arc at 100, so all four of them get an identical full ring,
and the figure under it says 22.8 or 54.7 against a stated maximum of ten. The
Field ring divides by 14 instead, `atuned_src/ui/ui.js` line 651, so the same
quantity is drawn on three different scales in one build.

**Pole is the same defect one order smaller.** Both places say 0 to 1. It is a
mean of `clamp(n.rep - n.held, 0, 10)`, so it is 0 to 10. Lance reads 8.49 and
his ring is full.

**No clause can be written over a false scale.** Fixing the scale is a
precondition of AJ1, not a separate task.

### 2.2 The clauses. One per figure

Each entry gives what it measures, what high means, what low means, what a
person does, and then the shipping string.

---

**Coherence. CQ. 0 to 100.**

Measures: what the field builds against what it costs, over the whole circuit.
High: more arrives than is spent, and the gains stack.
Low: more is spent holding than arrives, so effort goes into carrying.
Do: clear the heaviest address, and answer the laws. Only both move it.

Ship, where the number is printed:

> **13.** Coherence runs nought to a hundred. It is what the field builds
> against what it costs. At 13 almost all of it is going into holding.

And beside it, the band, which already carries a definition, a state and a
direction in `TIERDEF` and currently shows two of the three:

> **Severe.** Most of the field is carrying. Very little is clear. Ordinary
> demands read as threats, and capacity is spent before the day starts.

---

**Shadow weight. DQ.**

Measures: the summed charge across every address that is carrying. It is a
sum, so more addresses raise it even when each one is light.
High: many addresses carrying, or a few carrying hard.
Low: little is held.
Do: empty addresses. This is the one figure release moves directly.

**The honest answer is that this number cannot be explained in a clause and
should not be printed as a number.** A sum with no ceiling has no reading. 9.1
and 45.9 are the same word to a person, and the ring cannot tell them apart.
It is a sum of two facts a person can hold. Print the two facts:

> **18 addresses carrying.** The heaviest is **Blame**, at 6.2 out of 10. The
> rest of the load is spread behind it.

Keep DQ inside the engine, where it belongs, and take the letters off the
surface. If a single figure is wanted, it is the count, which has a meaning
and no ceiling problem.

---

**Carried depth. SQ. 0 to 10.**

Measures: how deep the charge sits at the addresses that are carrying, meaned.
Not how many, how far down.
High: what is held is dug in.
Low: what is held is near the surface and comes off cheaply.
Do: nothing on its own. It says whether a release run will be short or long.

> **5.1 out of 10.** How far down the charge sits at the addresses carrying it.
> Above five it is dug in rather than recent.

---

**Pole. 0 to 10, and it is stated as 0 to 1.**

Measures: how much of the coherent opposite is standing across every address.
High: the far side of the axis is in place, and past about 6 it costs.
Low: the opposite is not built, so an emptied address has nothing in it.

**This one also cannot carry a clause as a decimal.** It is a mean over every
address, and almost every address is nought, so 0.55 is a true number that
describes nobody. A person has six addresses with something in them, not a
field at 0.55. Print the count:

> **6 addresses have the opposite in place.** Releasing empties an address.
> Replacing fills it. An address emptied and not filled comes back.

---

**Energy. The mean of vitality, awareness and will.**

**Delete it.** The Field console already broke these three apart, deliberately,
and the reason is in the code at `atuned_src/ui/ui.js` line 655: a mean is
exactly the thing that cannot say which of the three is carrying and which is
short. The Summary glance then means them back together and prints 0.29. It is
the one figure on the surface that destroys information rather than carrying it.
What replaces it is the shortest of the three, named:

> **Will is the short one, at 21 percent.** Integrity carried through a seat
> that is not blocked. Vitality reads 39 and awareness 26.

---

**Vitality. 0 to 1, print it as a percent.**

Measures: what is left after apathy and the carried load.
High: capacity is available before the day starts.
Low: capacity is spent on holding before anything is asked of you.
Do: it follows shadow weight. Empty an address and this moves.

> **Vitality 39 percent.** What is left after the load is carried. Below half,
> the day starts already spent.

---

**Awareness. 0 to 1.**

Measures: intention read against distortion.
High: you can see the pattern while it runs.
Low: you see it afterwards, and only afterwards.
Do: name the address out loud while it is running. That is the whole move.

> **Awareness 26 percent.** Whether you can see the pattern while it runs or
> only after. Low means after.

---

**Will. 0 to 1.**

Measures: integrity carried through a seat that is open. Not effort. Force that
arrives.
High: what you decide is what happens.
Low: the decision is made and the seat it has to pass through is shut.
Do: open the seat that is shut, not the decision.

> **Will 21 percent.** Force that actually arrives, not force applied. Low
> means the decision is sound and the seat it runs through is closed.

---

**Flow. 0 to 1, and the Body page prints it as a percent.**

Measures: what reaches the crown from the root, every seat multiplied by the
next. One shut seat closes the whole line.
High: signal travels.
Low: signal is spent before it arrives.
Do: open the seat it stops at. The one named is the only one that matters.

> **Flow 39 percent, and it stops at the sacral.** Each seat passes what the one
> below it sent. One closed seat closes the line above it.

---

**Integrity. Ig. 0 to 10, and the range is currently never stated.**

Measures: the twenty one laws, meaned, adjusted by what is installed.
High: the hull is whole and coherence holds wherever you raise it.
Low: coherence leaks out as fast as it is built.
Do: answer the laws, and change what you do. Release does not touch this.

This is the number the owner asked about by name. Ship:

> **Integrity 4.3 out of 10.** The twenty one laws, meaned. It is the hull. At
> 4.3 the hull is open, so coherence runs out as fast as you build it, and the
> law furthest shut is **Compassion**, at the heart.

---

**Intention. It. 0 to 10.**

Measures: the seven seats' own integrity, meaned. What the circuit is pointed
at before anything resists it.
High: aim is clear.
Low: aim is split across seats that disagree.
Do: the same as integrity. This one is not reachable by release either.

> **Intention 4.3 out of 10.** What the circuit is pointed at before resistance.
> Coherence is intention times integrity, divided by resistance, so this is one
> of its two numerators.

---

**Overshoot. JQ, printed as "overshoot 0.53, 6 overshot".**

Measures: the coherent opposite driven past the point where it pays.
High: the good thing is being done compulsively and cannot be stopped.
Low: nothing is overdone.
Do: stop adding at the addresses named. Do not release them. They are full.

> **6 addresses are overshot.** The opposite is in place and being driven past
> the point where it pays. Adding there costs now, it does not build.

The decimal comes off. The count is the reading.

---

**Distortion. Printed as "distortion 10.0".**

Measures: the root domain's multiplier on the fetters it is most susceptible to.

**It no longer divides coherence.** It was struck from the formula by the
author's ruling of 13 May, recorded in `atuned_src/engine/compute.js` line 132,
because distortion and SQ were the same reading under two names. It is still
computed, still printed in the Instruments block, and still says 10.0 to a
person who has no way of knowing it is inert. **Take it off the surface.** It
is the only figure in the product that influences nothing and is displayed
anyway. Analytics may keep reading it.

---

**Orientation. Benign against malignant, printed in the rail as bare 26 and 74.**

Measures: where what is held points. Outward at other people, or inward at the
person carrying it.
High malignant: the charge is aimed at other people.
High benign: it lands on you.
Do: neither end is a verdict. It says who takes the cost, which decides which
address to take first.

> **Malignant 74 percent.** Where what you are holding points. Malignant means
> outward, at other people. Benign means it lands on you. This is a reading of
> the charge, not of you.

The rail currently prints `26` and `74` with a label a screen away. Two bare
integers under the word Orientation is the exact shape AJ1 forbids.

---

**Balance. The strip printing "masculine 2% feminine".**

Measures: which way the field discharges. Sympathetic against parasympathetic,
which is the same axis the cards call right channel and left channel.
High either side: discharge runs one way.
Centre: it runs both.
Do: nothing directly. It says which side a release will be felt on.

> **2 percent toward masculine.** Which way the field discharges. Masculine is
> the sympathetic side, feminine the parasympathetic. Dead centre means both.

---

**Identification. The accuracy percentage. 0 to 100, with an interval.**

**This is the model and it is already correct.** It is the only figure on the
Summary that carries its own meaning in its own tooltip, and it names its own
error:

> How much of you the instrument has actually measured, plus or minus 6.

Make it visible instead of hovered, and give it the fourth part, the move:

> **79 percent, plus or minus 6.** How much of you has actually been measured.
> Twenty one laws answered, eighteen addresses carrying. Write one more day and
> this rises.

---

**Swing. Printed on the coherence polar as "swing 22".**

Measures: how far a reading can wander before it settles. It is derived from
coherence, so it is not independent.
High: the reading moves day to day and a single day is not the reading.
Low: it is settled, and today is close to every day.
Do: read the middle, not the edge. The swing narrows before the number rises.

> **Swing 22 points.** How far this reading can wander before it settles. A wide
> swing means today is not the reading. The swing narrows before the number
> rises.

---

**Match percentage. "at a 100 percent match".**

Measures: how well the charge you carry fits a named pattern's own range.
High: every charge the pattern needs is inside its range. It is not a guess.
Low: it is the closest fit and it is a loose one.
Do: at a high match, read the pattern's own description. It will be recognisable.

> **Aggressor, at a 100 percent match.** Every charge that pattern needs is
> inside its range. This is a fit, not a resemblance.

---

**Seat pass percentage. Body page, "Sacral 8 held 66%".**

Measures: the share of signal that gets through that seat.
High: the seat passes what arrives.
Low: the seat is holding and the seats above it are starved.
Do: take the lowest, not the loudest.

> **Sacral passes 66 percent, with 8 addresses held.** The seats above it only
> ever get what this one lets through.

---

**Archetype share. "Sage 20%".**

Measures: the share of the whole affinity spread that this archetype takes.
High: it runs most of the time.
Low: it is available and rarely reached for.
Do: nothing. It is a description, not a load.

> **Sage, 20 percent of the spread.** The one you reach for most. A share, not a
> score, and there is nothing wrong with any of them.

---

**Mask weight. "Child 3.2".**

Measures: the charge sitting under the seats that era formed.
High: that era is still running the room.
Low: it is quiet.
Do: the mask is a door onto the addresses under it.

> **Child, 3.2 out of 10, at the root and the sacral.** The weight sitting under
> the seats that era built. High means that age is still answering for you.

---

**The chain. "28 saboteurs, 13 complexes, 3 hyper, 1 character".**

Measures: how far what is running has compounded. Loose patterns become
complexes, complexes become hyper complexes, hyper complexes become character.
High at the far end: it has stopped looking like a behaviour and started
looking like you.
Do: the chain is read right to left. Character first.

> **1 at character.** Loose patterns compound into complexes, complexes into
> hyper complexes, and a hyper complex that has been carried long enough stops
> reading as a behaviour. A count at the character end is the oldest thing here.

Note this is four counts with no total beside them, which is correct and stays.

---

**Headroom. "Release has about 7.2 in it".**

Measures: how many points of coherence a release can still reach, given that
release cannot touch integrity.
High: the lever is loaded.
Low: the lever is spent and the laws are the only thing left.
Do: it is a decision about where to spend fifteen minutes.

> **Release has about 7 points of coherence in it for you.** Release empties
> addresses. It cannot raise integrity, and integrity is the rest of the gap.

---

**Next marker. "Entry, 1 away".**

Measures: the distance to the next marker of ground opened, in patterns.
High: it is far, which is a direction rather than a task.
Low: it is one run away.
Do: open ground.

> **Entry is 1 pattern away.** One line at one address, down one channel.

The word "pattern" is not optional. `1 away` is the purest example in the
product of AJ1's complaint.

---

**Convergence. "4 comparisons could be made. 1 point the same way."**

Measures: how many of the five birth systems could be checked against the field,
and how many agreed.
High agreement: the blueprint and what is running are the same thing.
Low: something was built on top of the blueprint.
Do: read the disagreement. It is where the installation is.

Already correct, and one of the two best strings on the surface. It states the
denominator as a fact rather than as a score, which is the pattern every other
number should copy.

---

**The numerology digits. "Life path 7".**

Covered in section 3, because a digit is a named thing and its context is a
behaviour, not a range.

---

### 2.3 What section 2 costs

Three things have to happen and only the third is copy.

1. Correct two scales in the engine or the renderer. DQ and pole. One is
   printed on three different scales in one build.
2. Move eight definitions out of `title=` attributes into the surface. The
   Field console, `atuned_src/ui/ui.js` lines 638 to 689.
3. Write the clauses. They are above.

---

## 3. Every Named Thing Is A Behaviour

AH2. Second person, present tense, what you do rather than what you are.

**The finding first, because it changes the size of this job.** Four of these
tables already exist, already written as behaviour, and are already correct.
`atuned_src/engine/data/people.js` lines 190 to 228 carries `SIGN_RUNS`,
`CH_RUNS`, `CE_RUNS`, `HD_RUNS` and `LP_RUNS`, under a comment that reads
"how each thing RUNS through a person. behaviour, not definition."

They are reachable from exactly one place: the `title=` attribute on the chips
in `sumSpirit`. So the work the owner is asking for is written and invisible.
Move them onto the surface and change third person to second.

What is missing entirely: the twelve archetypes are third person verb phrases,
the nineteen blueprint domains are abstract nouns, and the six masks carry no
text at all.

### 3.1 The four root domains

These are the ones he named. Second person, present tense.

    Witness     You watch the thing until it makes sense, and you are still
                watching when a decision was needed.
    Architect   You build the structure, then you live inside it, then you
                defend it.
    Engine      You start it moving and find out what it was by moving it.
    Weaver      You join the two things that were not speaking, and you stay
                in the middle holding them.

### 3.2 The twelve archetypes

The engine already carries a third person verb on each, `ARCH[].v` in
`atuned_src/engine/data/canon.js` line 184. Kept as the spine, rewritten as
the behaviour, with the seat colour they already carry.

    Warrior     You move on the threat before anyone has agreed there is one.
    Sage        You read the room and hold the read back until it is asked for.
    Rebel       You refuse the frame, and you refuse it whether or not the
                frame was the problem.
    Caregiver   You attend to the other person first, and you do not notice
                what that costs until later.
    Creator     You make the thing. The thing has to exist before you can say
                what you meant.
    Magician    You change the conditions instead of arguing inside them.
    Ruler       You order the field. Disorder reads to you as a thing to fix
                rather than a thing to leave.
    Explorer    You go to the edge to find out where it is.
    Lover       You close the distance, and you close it faster than the other
                person is closing it.
    Jester      You break the tension. Sometimes that is generous and sometimes
                it is how you leave the room.
    Everyman    You stay with the room and take the room's pace.
    Innocent    You take it at face value, which is why you are the one who is
                surprised.

### 3.3 The nineteen blueprint domains

These are the weakest strings in the product today. "understanding as operating
mode" is an abstract noun about an abstract noun, and the voice forbids both.
All nineteen, as behaviour.

Architect:

    Knowledge     You find out before you commit, and sometimes instead of
                  committing.
    Justice       You measure the situation against what is right and you say
                  the measurement out loud.
    Imperium      You put the force into the structure, and the structure
                  carries the decision for you.
    Duty          You carry the obligation without renegotiating it, and
                  without mentioning the weight.
    Fate          You work with the order you did not choose rather than
                  fighting it.

Engine:

    Power         You apply directed force. You are the one who moves it, not
                  the one who owns it.
    Creation      You bring the thing into form, and the form is how you find
                  out what it was.
    Dissolution   You take the form apart when it has stopped carrying.
    Descent       You go down into the material on purpose, and you go alone.
    Death         You end it so there is room. You are better at the ending
                  than at the grief after it.

Weaver:

    Connection    You bond without folding into the other person.
    Exchange      You keep the value moving both ways and you notice when it
                  stops.
    Restoration   You bring it back to level after it has been knocked over.
    Provision     You supply what the other person needs, often before they
                  ask.
    Play          You make something with no use, and the useless thing is
                  where the new one comes from.

Witness:

    Nature        You watch without stepping in, including when stepping in
                  would help.
    Trickster     You break the pattern with a paradox and let the break do
                  the work.
    Mystery       You hold the unresolved thing open instead of closing it
                  early.
    Guardian      You watch over what cannot watch itself, and you do not
                  stand down.

### 3.4 The six masks. Currently no text exists at all

    Child         You meet it the way you met it before you had words for it.
    Preteen       You perform for whoever is watching, because you learned
                  somebody was.
    Teen          You hold the split together from outside, and the join shows.
    Adult         You run the version of yourself that was built to work.
    Professional  You wear the face the job issued and it fits well enough to
                  forget it is on.
    Ideological   You hold the position above the evidence, and the position
                  holds you.

### 3.5 Life path. The digits

`LP_RUNS` already has these and they are good. Second person:

    1   You go first, alone if that is what it takes.
    2   You join, and you hold the pair together past the point it is fair.
    3   You express it before it is finished.
    4   You build a thing that outlasts the person who built it.
    5   You move before the walls close.
    6   You tend the people and forget yourself in the tending.
    7   You look at it until it makes sense, and the looking is the whole day.
    8   You command the structure and you pay for commanding it.
    9   You complete what other people abandoned.
    11  You channel more than you can hold.
    22  You make the imagined thing physical.
    33  You teach it by carrying it first.

### 3.6 The elements

    air     You take it in through the channel that names it. You talk first.
    earth   You take it in through what is built. You touch it first.
    fire    You take it in by starting it. You move first.
    water   You take it in through what it feels like. You absorb first.

### 3.7 The sun, moon and rising, which already exist

`SIGN_RUNS` is already written as behaviour and is good work. It needs one
change beyond second person: the three positions need their own behaviour line,
because the sign alone is not what runs.

    sun      What you run on when you are choosing.
    moon     What you run on when nobody is watching.
    rising   What arrives in the room before you do.

So James reads: "**Libra** waits for the balance point and pays for the wait.
**Taurus** underneath holds position until the thing is actually built.
**Pisces** arrives first and dissolves the boundary."

### 3.8 The rule this establishes

**A name that cannot be written as a behaviour does not go on this surface.**
That is the test and it is checkable. It kills "understanding as operating
mode" and it protects every name that survives it.

---

## 4. The Centre Column

### 4.1 What his test means, concretely

"It's like looking at an astrology page about you."

An astrology page has four properties, and three of them are what he is asking
for.

    second person, present tense, about behaviour
    a fixed sequence the reader learns and can return to
    it changes, and the change is the reason to come back
    it flatters

The fourth is the one this product refuses. **The register he is asking for is
not flattery, it is recognition.** An astrology page is read because it
describes something the reader already half knew, in words they had not found.
That is the same effect `DECISIONS.md` already rules for: recognition, not
revelation. Described rather than judged. A mechanic's estimate, not a verdict.

So the concrete test for this column, which can be applied to any sentence:

1. Is it about him, or about the instrument. If the subject of the sentence is
   a quantity, it fails.
2. Is it in the second person and the present tense.
3. Does every name in it carry a behaviour.
4. Does every number in it carry its scale.
5. Would you say it out loud to him, sitting across a table.

The current third paragraph fails one, two and four in a single clause: "No
avatar has been stated, so there is nothing to measure this against."

### 4.2 What stays in the centre

    the plate           name, coherence, band, band definition
    Today               one line on what has moved. AH5, see section 6
    How you run         the named things, as behaviour, in their own colours
    Where it lands      the body. seat, address, axis, flow
    What it costs       the chain, the lean, integrity
    Your words          the story entries, coloured where they landed
    Do one thing        a single instruction with a single control
    How much is
    measured            identification, in one line, at the bottom

Prose only. Every number inside a sentence, none standing alone.

### 4.3 What moves right

Everything the owner named, and two more the same rule catches.

    the glance strip, all six rings      -> right, as a column
    the spiritual layer, every glyph     -> right
    life path, expression, soul urge,
      personality, birthday, maturity    -> right
    every name part, cornerstone,
      capstone, karmic debt              -> right
    the blueprint selection              -> right
    primary, secondary, also             -> right
    the masks                            -> right
    where it sits, the seat loads        -> right
    the chain counts                     -> right
    "Next marker"                        -> right, it is a measurement
    ".s-src", the disclaimer             -> right, once, at the foot of the
                                            right column, not under the reading

### 4.4 What is deleted

    ".s-ptoward" from the plate    AH3. It reappears as one sentence inside
                                   "Do one thing", which is where a direction
                                   belongs.
    "energy", the mean of three    section 2. It destroys information.
    "distortion"                   inert since 13 May.
    "Momentum:" as a label         a colon is not a sentence.
    "What You Told It"             the product narrating itself in the third
                                   person. It becomes "Your Words".
    "9/19/2026"                    a raw machine date under a person's own
                                   sentence. It becomes "Today" or "Tuesday"
                                   or "19 September".

### 4.5 The order, and why it is this order

Evidence, then reading, then cost, then instruction. The current column puts
the person's own words first, which is right and should be kept. But it puts
them first only when they exist, and on every reference profile they do not
exist, so what the owner has actually been looking at is the column with its
first block missing.

**When there are no words, the column says so in one line and asks for one.**
It does not silently close the gap.

### 4.6 The drafted centre column, three sizes. James, verbatim

Facts used, all measured off the running build: coherence 12.8, band Severe,
state Numb, integrity 4.31, intention 4.33, heaviest address Blame at 6.2 in
the heart on the anger axis, loudest pattern Aggressor at a 100 percent match,
flow 39 percent stopping at the sacral, 18 addresses carrying, 72 under the
line, 6 filled in, weakest law Compassion at the heart, lean malignant 74,
character Predatory / Dysregulation, identification 79 plus or minus 6,
headroom 7.2, sun Libra, moon Taurus, rising Pisces, life path 7, expression 1,
element air, blueprint root Witness, running root Architect, domain Imperium,
primary Sage.

Bold in every draft below means the name carries its own mark's colour, which
is AH1. Seat names take the seat colour from `PAL`. Root domains take
`ROOTCOL`. Archetypes take their own seat, which is already on the record.

---

#### Size S. The phone, and a first visit. Three blocks

> ### James
> **13** · Severe
> Most of the field is carrying. Very little is clear.
>
> **How you run**
>
> You were born on **air**, which reads as the **Witness** root. You watch the
> thing until it makes sense. Life path **7** runs the same way. You look at it
> until it makes sense, and the looking is the whole day.
>
> That is not what is running. What is running is **Architect**, through
> **Sage**. You build the structure and then you live inside it. You read the
> room and hold the read back until it is asked for. Something was built on top
> of the watching, and it has been carried long enough to feel like you.
>
> **Where it lands**
>
> It lands at **Blame**, in the **heart**, on the **anger** axis, at 6.2 out of
> 10. Eighteen addresses are carrying. Flow stops at the **sacral**, so 39
> percent of what starts at the root reaches the top.
>
> **Do one thing**
>
> Release **Blame**, in the heart. One seat, one address, one line. Not a
> programme.
>
> [ Run a release ]
>
> 79 percent of you has been measured, plus or minus 6.

---

#### Size M. The default. Desktop, a loaded profile, no story yet

> ### James
> **13** · Severe · Numb
> Most of the field is carrying. Very little is clear. Ordinary demands read as
> threats, and capacity is spent before the day starts.
>
> **How You Run**
>
> You were born on **air**. Air reads as the **Witness** root: you watch the
> thing until it makes sense, and you are still watching when a decision was
> needed. Life path **7** runs the same way. **Libra** waits for the balance
> point and pays for the wait. **Taurus** underneath holds position until the
> thing is actually built. **Pisces** arrives in the room before you do and
> dissolves the boundary.
>
> What is running is not that. It is **Architect**, through **Sage**, inside
> **Imperium**. You build the structure and then you live inside it and then
> you defend it. You read the room and hold the read back until it is asked
> for. You put the force into the structure, and the structure carries the
> decision for you.
>
> Witness watches. Architect builds. Something was built on top of the
> watching, and it has been carried long enough to feel like a personality
> rather than a thing that was installed.
>
> Your name carries an expression of **1**. You go first, alone if that is what
> it takes.
>
> **Where It Lands**
>
> It lands at **Blame**, in the **heart**, on the **anger** axis, at 6.2 out of
> 10. Blame is the move that puts the cost on somebody else so the structure
> does not have to change.
>
> Eighteen addresses are carrying weight. Seventy two more are holding
> something under the line, which is signal and not yet cost.
>
> The **sacral** is where flow stops. Thirty nine percent of what starts at the
> root reaches the top. The rest is spent holding.
>
> The law furthest shut is **Compassion**, at the heart. That is the same seat
> **Blame** sits in. Those two are one fact read from both ends.
>
> **What It Costs**
>
> The thing most compounded on top of Blame is **Aggressor**, at a 100 percent
> match, which means every charge that pattern needs is inside its range. This
> is a fit, not a resemblance.
>
> Above it sits **Predatory / Dysregulation**, at character. Loose patterns
> compound into complexes and complexes into hyper complexes, and one that has
> been carried long enough stops reading as a behaviour. It reads as you.
>
> What you are holding leans **malignant** at 74 percent. Malignant means it
> points outward, at other people. That is a reading of the charge and not of
> you.
>
> Integrity reads **4.3 out of 10**. Integrity is the hull. At 4.3 the hull is
> open, so coherence runs out as fast as you build it.
>
> **Do One Thing**
>
> Release **Blame**, in the heart. Release empties an address. It has about
> seven points of coherence in it for you, and it cannot raise integrity, which
> is the rest of the gap. Integrity moves when you answer the laws or when what
> you do changes.
>
> Off the floor, and nothing more ambitious than that. One seat, one address,
> one line. Not a programme.
>
> [ Run a release ]   [ Answer the laws ]
>
> **How Much Of This Is Measured**
>
> 79 percent, plus or minus 6. Twenty one laws answered, eighteen addresses
> carrying, six filled in. Nothing is stated about who you are becoming, so
> none of this is measured against that. Write one day and this rises.

---

#### Size L. Everything present. A story entry, an avatar, history

The two blocks the L adds are Today, which is AH5 and blocked, and Your Words,
which is built and empty on every reference profile. Both shown in place.

> ### James
> **13** · Severe · Numb
> Most of the field is carrying. Very little is clear. Ordinary demands read as
> threats, and capacity is spent before the day starts.
>
> **Today**
>
> Coherence has not moved since yesterday. What changed is where the weight
> sits: **Blame** came up 0.4 and **Interrupting** came down. Both are anger,
> and it moved from the throat to the heart. Yesterday's reading is on the
> record.
>
> **Your Words**
>
> *19 September.* Third week of the turnaround. I told Priya her numbers were
> **fantasy** in front of the whole room and I did not feel anything. Drove home
> **angry** about the traffic. My chest has been **tight** since Tuesday and I
> am **not sleeping** past four.
>
> Four words in that landed at four seats. **Angry** at the solar plexus.
> **Tight** at the throat. **Not sleeping** at the root. The sentence about
> Priya carried no charge at all, which is the finding: the room is where the
> cost was paid and the traffic is where it was felt.
>
> **How You Run**
>
> *(as size M)*
>
> **Where It Lands**
>
> *(as size M, plus)*
>
> You wrote that your chest has been tight since Tuesday. The seat under that is
> the **throat**, and three addresses there are carrying. The chest is where the
> **heart** meets it, and four more are carrying there, **Blame** at the top of
> them. The instrument did not go looking for that. You wrote it and it landed
> where the numbers already were.
>
> **What It Costs**
>
> *(as size M, plus)*
>
> You said: I make the call and I sleep fine. People find that cold. It is what
> they hired. The record says you are not sleeping past four. Both can be true.
> One of them is a position and the other is a measurement, and this instrument
> only reads the second.
>
> **Against Who You Said You Are Becoming**
>
> You stated the **heart**. The heart is one of the four seats carrying, and
> **Blame** is the heaviest thing in it. The thing you named is blocked by the
> thing named above, which is the only reason this paragraph exists.
>
> **Do One Thing**
>
> *(as size M)*
>
> **How Much Of This Is Measured**
>
> 79 percent, plus or minus 6. Twenty one laws answered, eighteen addresses
> carrying, six filled in, one day written. Written from the nine axes, the
> twenty one laws, the blueprint and the birth data. Nothing here comes from
> anything that was not measured.

---

### 4.7 The empty state, because it is the most read copy on this surface

When there are no story entries and the profile is otherwise loaded, the Your
Words block does not disappear. It says:

> **Your Words**
>
> Nothing written yet. This page reads better from your own sentences than from
> the sliders, because a sentence carries where it landed and a slider does not.
> Write one day.
>
> [ Write today ]

That is a refusal in the seventh bucket's shape: what is missing, why it
matters, and the one control that fixes it. No apology.

---

## 5. Holding The House Voice Against The Astrology Register

The tension is real and it is worth naming exactly rather than waving at.

**Where they agree, which is most of it.** Both registers are second person,
present tense, about behaviour, and concrete. An astrology page does not say
"optimise your wellness journey". It says you hold position until the thing is
built. That is a physical metaphor and a short sentence. The strings in section
3 are simultaneously the most astrological and the most house voice copy in this
document. That is not a coincidence. **Compression and specificity are what both
registers are made of.**

**Where they collide, in three places.**

**One. Warmth.** An astrology page is warm because it is always slightly on the
reader's side. This product is not on anybody's side, it is a mirror. The
resolution is in the material and not in the tone: warmth here comes from
precision, from getting something right that the person has never heard said.
The line "the room is where the cost was paid and the traffic is where it was
felt" is warm because it is accurate, not because it is kind. **No sentence is
softened to produce warmth. Warmth is a by product of being right.**

**Two. Sweep.** An astrology page makes claims larger than its evidence. This
one may not. Every sentence in section 4 is conditional on a value that exists,
which is already the rule in `COPY.md` bucket six and is already enforced in
`sumStory`. It stays enforced. Where evidence runs out, the draft says so in one
line and moves on, rather than hedging every clause.

**Three. Rhythm against the short sentence rule.** Short sentences are the
ruling and they are right. But a column of nothing but short sentences reads as
a list of findings, which is what the current reading reads as. The fix is not
longer sentences, it is **varying where they break**. Three short, then one that
runs, then one of four words. Read the size M draft out loud and the shape is
audible. Nothing in it is long. The rule holds.

**What I would hold, and what I would give.**

I hold: no em dashes, sentence case bodies, title case headers, no soft wellness
language, physical metaphors only, no count against a total, the count is 112,
no label without a definition and a behaviour and a direction, one word per
concept.

**I give nothing, and one ruling needs a decision from him rather than from me.**

**The one that has to give is "a reading is not a score", as it is currently
applied to the plate.** Not the ruling. The ruling is right and it is the spine
of the product. What has to give is the arrangement that prints `13` in the
largest type on the page, in a ring, as the first thing under a person's name,
which is the visual grammar of a score no matter what the words around it say.
His own complaint is the evidence: "you read 13, what does that mean."

Two ways out, and it is his call.

**A.** The number stays where it is and the band definition sits on the same
line, at the same weight, so the word and the number arrive together. Smaller
change, and it keeps the plate as a headline.

**B.** The band word leads and the number sits beside it at label size. "Severe.
Most of the field is carrying." and then 13 as the supporting figure. This is
the arrangement that actually stops it reading as a score, and it is the one I
would choose. It costs the visual anchor at the top of the page.

I would not split the difference by shrinking the ring a little. That produces a
slightly smaller score.

**One more thing that is his and not mine.** `Severe` is a band word, a node
name, a hyper complex name and the word for a shut axis. `DECISIONS.md` already
records this as open and names `Seized` as the candidate. It renders in the
largest word on the page on two of the three profiles I read. It is the single
highest leverage word in the product and it is still open.

---

## 6. AH5. The Daily Retune, And What It Needs First

### 6.1 The dependency, stated rather than assumed

AH5 cannot be built from copy. It needs three things this product does not have.

**The seam.** `CLAUDE.md` allows the app exactly one network seam, the record
fetch at sign in. A daily retune is a second call on a different schedule. That
is an architecture decision and it is the owner's.

**A ruling on what Source AI may read.** This is the hard one and it is not a
technical question. `DECISIONS.md` rules, in the strongest entry in the file,
that the record and the story are never held joined, that the name never leaves
the device, and that the story without the record is what refines the models.
A daily retune that reads a person's journal and returns a reading about that
person **joins them by definition**. It is the exact shape the standing promise
forbids. Three ways it could be resolved and all three are his:

    on device      the retune runs locally against the model already in the
                   file. No story leaves. This is the only option that needs
                   no new promise.
    keyed          the story goes out under the key with no name, and the
                   reading comes back to the key. The join exists for the
                   length of one request.
    not at all     the retune is a recompute, not a generation. Nothing leaves
                   and the copy is assembled from tables that are already in
                   the build.

**A place to keep the old reading.** `schema.js` already stores snapshots with
an ISO stamp and a coherence, which `record.js` already diffs into sentences
like "the heaviest seat moved from the throat to the heart". **Most of AH5's
history half already exists.** What is missing is keeping the prose, not the
numbers.

### 6.2 What the Today block would say, which is writeable now

Three states. All three are assembled from `record.js` diffs, which are already
computed, so the third option above would produce all of these with no seam at
all.

**Nothing moved:**

> **Today**
>
> Nothing has moved since yesterday. The band held, the heaviest seat held, and
> the primary held. A day with no movement is a reading, not a gap.

**Something moved:**

> **Today**
>
> Coherence came up 1.4. The heaviest seat moved from the **throat** to the
> **heart**. What you wrote yesterday landed at **Blame**, and Blame is what
> moved. Yesterday's reading is on the record.

**The first day:**

> **Today**
>
> This is the first reading on the record. There is nothing to compare it to
> yet. Come back tomorrow and this line says what moved.

### 6.3 The one thing the copy has to refuse

The owner's sentence is "Source AI always monitors that stuff." **The product
may not say that to a person.** Monitoring is the word for what somebody else
does to you, and this product's whole promise is the opposite. The behaviour he
is describing is correct and the word is not. What it says instead:

> This page is rebuilt every day from everything you have written. Yesterday's
> is kept.

Passive on the monitoring, active on the person. Nothing watches. The page is
rebuilt.

---

## 7. What This Costs, Sized

    AH1  colours on the bold names        S   the rule exists in sumWords
    AH3  ".s-ptoward" out of the plate    S
    AJ1  fix the DQ and pole scales       S   engine or renderer, not copy
    AJ1  definitions out of title=        M   eight on the Field console alone
    AH2  behaviour lines, the writing     M   four tables already exist
    AJ1  the clauses, everywhere          M   written, section 2
    AH4  the column rebuilt               L
    AH5  the daily retune                 L   blocked, section 6

The two smallest items, AH1 and AH3, are the two the owner named first and both
are one sitting.

---

## 8. The Strings, Old And New, Side By Side

Only the ones that ship as strings. Everything else is in the sections above.

| Where | Old | New | Why |
|---|---|---|---|
| `.s-ptoward` | Where It Goes / Off the floor, and nothing more ambitious than that | deleted from the plate, one sentence inside Do one thing | AH3. A direction is not a subtitle |
| `.s-told` eyebrow | What You Told It | Your Words | the product was narrating itself in the third person |
| `.s-gl` coherence | 13% coherence | 13. Coherence runs nought to a hundred. It is what the field builds against what it costs | AJ1 |
| `.s-gl` shadow weight | 9.1 shadow weight, "What is held, 0 to 10." | 18 addresses carrying. The heaviest is Blame, at 6.2 out of 10 | the stated range is false. Measured to 54.7 |
| `.s-gl` pole | 0.55 pole, "0 to 1" | 6 addresses have the opposite in place | the stated range is wrong by a factor of ten |
| `.s-gl` energy | 0.29 energy | deleted. Will is the short one, at 21 percent | a mean destroys the reading |
| `#rows` | distortion 10.0 | deleted | inert since 13 May |
| `#rows` | overshoot 0.53, 6 overshot | 6 addresses are overshot. The opposite is in place and being driven past the point where it pays | the count is the reading |
| `#rows` | integrity 4.3 | Integrity 4.3 out of 10. The twenty one laws, meaned. It is the hull | his own example |
| `.s-out` next marker | Entry / 1 away | Entry is 1 pattern away. One line at one address, down one channel | 1 what |
| `.s-out` release | Release has about 7.2 in it | Release has about 7 points of coherence in it for you. It cannot raise integrity | 7.2 of what |
| `.s-p` three | Momentum: the field leans benign at 82 percent, which means it is contracting | What you are holding leans benign at 82 percent. Benign means it lands on you rather than on other people. Coherence is still below the line | two readings joined by a false "which means" |
| `.s-p` three | No avatar has been stated, so there is nothing to measure this against | Nothing is stated about who you are becoming, so none of this is measured against that | the instrument was the subject of the sentence |
| `DOMAINS[].d` | understanding as operating mode | You find out before you commit, and sometimes instead of committing | an abstract noun about an abstract noun |
| `MASKS` | *(no text exists)* | six behaviour lines, section 3.4 | six weights print today with no meaning at all |
| `.s-told` date | 9/19/2026 | 19 September | a machine date under a person's own sentence |
| `coneRead` | You read 13, below the oscillating band. Integrity 4.3, coherence 13 | You read 13 out of 100. Below 40 is below the median range, where the field costs more than it builds. Integrity reads 4.3 out of 10, and integrity is the hull | the metaphor was not context |

---

## 9. What I Could Not Answer

**The seat percentages on the Body page contradict each other and I did not
resolve which is right.** `renderShelf` prints the field wide held count under
the heading "Heaviest seat", `atuned_src/ui/mapshelf.js` line 22, so James reads
"Heaviest seat / Sacral / 18 held" while the seat row four inches below reads
"Sacral 8 held". Both figures are correct and they are different quantities
sharing one word. It is a copy defect with an engineering cause and it is not
mine to fix.

**Whether the plate should lead with the word or the number is his,** and it is
the only place I have not made the call myself. Section 5.

**The band word Severe is still open** and it renders larger than anything else
on this page.
