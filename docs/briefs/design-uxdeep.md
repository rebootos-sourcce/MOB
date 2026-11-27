# Atüned / SOURCE. Interaction design, in depth

For the team porting the product to a desktop build. You do not have this
codebase. You have the screen structure brief, which maps every region and
every surface. This document does not repeat it. It covers what that map
cannot: how things behave when pressed, in what order a person meets them,
what a person can take back, where they stop, and the reasoning the product
used to make each call, so that you can make the same call on a screen that
does not exist yet.

Written by Dani Sorensen, UI UX architect.

    Read against    commit eb788a2, 25 September 2026, clean tree
    Build           source.html md5 26ff48bd4f111fa1dcd90822d6c62778
    Method          read in source. No browser walk was run for this
                    document. Every figure that came from a browser is
                    quoted from the document that measured it, named, and
                    should be re-measured on your build before it is quoted
                    again. This repository has been bitten a dozen times by
                    a number typed into a document that the product then
                    grew past.

---

## 0. How to read this

Every claim carries one tag.

| Tag | Means |
|---|---|
| **BUILT** | Read in the source at the commit above. What the product does. |
| **MEASURED** | A browser figure from a named document in the repo, on an earlier build. Re-measure. |
| **SPEC** | Designed, argued and often prototyped. Not in the build. |
| **OPEN** | The owner's call. Not mine and not yours. Listed in full in section 11. |
| **DEFECT** | The code disagrees with a standing ruling. Found by reading, not reproduced in a browser for this document. The project's rule is to reproduce a failure before fixing it and to re-measure after, so treat each as a lead, not a verdict. |
| **STALE** | A document in the repo says one thing and the code says another. The code wins. |

**The rulebook.** The product carries its own UX rules in
`.claude/skills/atuned-ux/SKILL.md`: Yale Usability and Nielsen Norman
heuristics reconciled with the owner's rulings, where **a ruling beats a
general principle and the collision is named rather than quietly resolved.**
Its ten rules are cited here as R1 to R10. Its measured floors:

    touch target        44 by 44, every interactive element
    feedback            under 1s nothing; 1 to 3s spinner;
                        3 to 10s progress showing what is left;
                        over 10s an estimate and a way to leave
    usability testing   5 people
    working screen      under 12 simultaneous choices (my floor; the skill
                        states the working memory of about four)

The ten rules, as they bite in this product:

    R1   One word per concept. "nothing held", "held", "profile".
    R2   A slot keeps its label. The value carries the state.
    R3   Provide a status and never lie about it. One writer, status().
    R4   Prevent the error at the boundary, do not apologise after.
    R5   Undo beats confirm.
    R6   Recognition over recall.
    R7   Less is more: remove, hide, shrink, organise, in that order.
    R8   Accessibility built in. Motion is a toggle, not only a query.
    R9   Micro interactions are the language. No dead states.
    R10  Never hide a control with no affordance.

**Three lines of the rulebook are STALE and you should know which.**

- R4 says `loadProfile` accepts a charge of 9999. The boundary now exists:
  `validateProfile` refuses a wrong type or an out of range value by name and
  never clamps, and `pImport` is atomic (`CLAUDE.md`).
- R5 says "There is no undo. Open, and the largest remaining gap." Undo is
  built, unlimited, with redo (section 4.4). Several other files still carry
  conditions written against its absence, and those conditions now need
  reading carefully rather than obeying (section 4.5).
- The "principle loses to a ruling" list says personalisation and cross device
  continuity are out of scope because there is no account. The owner has since
  called the fork: this becomes an accounts product (`CLAUDE.md`, "What this
  project is becoming"). The engineering posture survives the fork; that
  exclusion does not.

**Case, and a fourth staleness.** `CLAUDE.md` says sentence case.
`DECISIONS.md`, ruled 19 September, says headers and sub headers take a
capital on every word, body text stays in sentence case, and "the stylesheet
was right and `CLAUDE.md` was wrong". The build implements it by transform and
by one classifier (`rdCase` in `ui/drills.js`): a string of four words or
fewer with no internal punctuation and a leading capital is a label and is
title cased; anything else is a statement and stays plain; a string that
starts lower case is a reading and is never titled. A person's own name is
exempt, because a transform that writes de Vries as De Vries is wrong about
them. No all caps anywhere.

---

## 1. Who this is designed against

The product does not design for users. It designs against named reference
people, loaded as real profiles with real numbers, and it tissue tests every
flow through at least three of them from different levels of the buyer grid.
A flow that works for Derek and fails for Angela works for nobody who pays
twice.

### 1.1 The roster

| Person | Where named | Level on the grid | Job they hire the product for | The stopper, as recorded |
|---|---|---|---|---|
| **Sofia**, 41, somatic practitioner | `engine/data/people.js` | practitioner, brings clients | show a client where charge sits, in session; run something alone at night | the persona picker ("whose field is this") before anything about the client; Knowledge buried; the consent question, which is not a layout problem |
| **Diane**, 46, founder | `people.js` | 6 to 7 | a forty second check between meetings: a number, and whether it moved | eight tabs before information; no delta; an ask before a payoff |
| **Marcus**, 44, creative director | `people.js` | 4 to 5 | first contact and a quality judgement in four seconds | anything that looks squeezed, clipped or undecided; the word More |
| **Angela**, 36, seeker | `people.js`; "level 5, six modalities, wants magic" in `.claude/skills/atuned-voice/SKILL.md` | 5, the largest and hardest segment | recognition. Her phone is the entire product | the word Incoherent; tapping something and losing her place with no way back |
| **Derek**, 39, endurance | `people.js`; "level 7, wants the diagnostic" in the voice skill (my earlier review placed him at 8) | 7 to 8, the 85 to 90 percent buyer | the diagnostic, and the release run hands free between sets | a claim with no instrument behind it; the action five screens down |
| **James**, 57, C suite | `people.js`; "level 3, third turnaround, defended" in the voice skill | 3, defensive | read one number, once | anything that accuses rather than describes; a demo control above his own data |
| **Ana**, 47, teacher, edge case | `people.js`; `DESIGN-mobile-icp.md` | in crisis | opens things at two in the morning | one more choice than she can hold; a moral word about herself |
| **Gordon**, 58, managing partner | `people.js`, "There is nothing wrong with me" | the most loaded profile in the roster, CQ about 1 | does not arrive | refuses the frame at the ad. `RESEARCH-icp.md`: **do not chase him**; softening the pain line to reach him loses Ana and Derek |
| **Rosa**, 61, retired midwife | `people.js`, charge nearly all zero | the nearly empty case | none | correctly not the customer. Useful as the test that an empty field reads as empty and not as broken |

All ICP quotations in the repo are **simulated** panels, and every percentage
attached to them is model output, not human behaviour. The repo says so on
every file and so do I. They are useful as lenses, not as evidence.

### 1.2 The segmentation that decides the funnel

`BUYERS.md` is the owner's grid, ten levels, and **it is not monotonic**. It
peaks at 8, 9 and 10, collapses through 5 and 4, and floors at 1. Levels 4 and
5 are the largest population and the hardest sell: at 4 the work hurts, at 5
it is not mystical enough. **Onboarding cannot be written for level 8.** Derek
will find his way through anything. Angela is the person the flow is for.

### 1.3 The premise you must design into every first screen

The brief I was given frames it as a person often being at their most loaded
when they arrive. The repo states it through three facts rather than that
sentence: the largest population sits at levels 4 and 5; the edge case the
panel keeps returning to is Ana at two in the morning; and the four low band
words (Incoherent, Corrupt, Severe, Collapsed) are handed by software to the
people in the worst state. `RESEARCH-icp.md` calls the last one "the most
dangerous copy in the product". The design consequence runs through every
section below: **the first screens meet a person who has the least spare
working memory the product will ever see from them, and who is primed to read
any number as a verdict.**

---

## 2. The first run, step by step

### 2.1 What a stranger actually meets today (BUILT)

| Step | What happens | Decisions offered | Can they go back | Required |
|---|---|---|---|---|
| 0 | Boot overture: the spine and seven seats drawn in order, then the ring. Ends at about 5.3 s; a timer removes it at 5.45 s whatever happens | none visible. Any press or key skips it, and that first press is swallowed so it does not also press the app | n/a | no. Reduced motion removes it immediately |
| 1 | Lands on **Field** (`setTab(TAB.FIELD)`, ruled 19 September, reversing Summary). The onboarding sheet does **not** open (`OB_AUTO=false`, ruled 20 September) | the whole shell: nine tab doors, the rails, the depth row, the wheel | n/a | nothing is required anywhere in the product |
| 2 | Because nothing is read (`r.unread`), every reading slot shows a dash or "not read yet", and **the rail prints the four doors** | four doors, each a verb and one line | yes, every door is non destructive | no |
| 3a | "Write what happened": switches to Story and focuses the text box | write, or record by voice | switch tab | no |
| 3b | "Read nine sentences": opens a drill of nine first person sentences, no diagnosis word in any of them | pick one, or "None of these. Try by age" | the drill's back control, Escape | no |
| 3c | "Go year by year": opens the age ladder drill, sixteen years, one question each, then yes or no tests | pick a year | "All sixteen" inside the drill; Escape | no. "Nothing is stored here, and nothing is scored" |
| 3d | "Say who you are becoming": opens the avatar drill | the pairs, the purpose map | "All of them", "The avatar" | no |
| 4 | Commit a story: the reading lands everywhere at once | undo is now offered | the back arrow | no |

**The fastest honest path** from cold to a personal reading: skip the boot,
press the story door, write, press Commit. **Three presses.** My earlier
review measured roughly eighty seconds and three taps on a build that opened
on Summary (`reviews/uiux.md`, MEASURED). The door pre focusing the text box
is correct and should survive the port.

**Three things that path does not do (BUILT, and each is a DEFECT against a
ruling):**

1. **The commit reports nothing through `status()`.** The largest state change
   the product makes outside a release happens silently; the only trace is the
   undo arrow appearing in the top bar corner, which is not where the person is
   looking. R3 and R9. Still true in `ui/storyui.js`.
2. **Nothing walks them to the reading.** The reading lands on Story, where
   the imprints column fills, and on every rail. Nothing says "this is what it
   read, and here is where". R6.
3. **Three of the four doors open a drill, and on a phone the drill opens off
   screen.** `rdOpen` scrolls the drill into view only when the rail sits
   beside the stage; when the rail is stacked under it, it deliberately does
   not move the page (it used to throw the page four thousand pixels). On a
   desktop the rail is beside the stage and this is fine. **For the port:** a
   desktop build keeps the drill in view, so this defect does not carry over,
   but any narrow window mode you add inherits it.

### 2.2 The four doors, and why they are the best funnel asset in the product

(BUILT, `ui/component.js`, `STARTD`.) Four doors, one set of ids delegated
through one listener so the same doors can appear in two places. They are
four different psychographics, correctly matched:

    Write what happened        levels 7 to 8. Has material, wants the
                               machine to read it. Derek, Diane.
    Read nine sentences        levels 4 to 5. Cannot self accuse, needs
                               recognition rather than confession. Angela,
                               Marcus. Ruled from the owner's own history:
                               "I did not think of myself as bad."
    Go year by year            cannot name a feeling, can name a year.
                               "An identification that is working does not
                               feel like one", which is most people.
    Say who you are becoming   levels 8 to 9. Wants a target. The only door
                               that points forward rather than back.

**Placement rule (BUILT):** one set of doors per screen. The rail prints them
on every tab while nothing is read, except Summary, whose centre already
carries them at full width. **"A call to action that survives the action is
furniture"**: the doors disappear the moment anything is read.

**What they do not do: route.** Every person reads all four descriptions and
self sorts, and self sorting is what levels 4 and 5 are worst at. One
question above them in the product's voice would sort the hardest segment
("Can you name what happened, or only that something is off?"). That was my
recommendation in `reviews/uiux.md`; whether the four stay equal or one
becomes the front door is **OPEN** (`reviews/QUESTIONS-onboarding.md` Q8).

### 2.3 The onboarding sheet: built, switched off, and ruled wrong

**Do not port the built onboarding as a flow.** Port the rulings. Here is why.

**What is built (BUILT, `ui/onboard.js`).** A modal sheet, four steps,
`role="dialog" aria-modal="true"`, focus moved to its first button on open:

| Step | Headline | Controls | Words (MEASURED, `DESIGN-onboard.md`) |
|---|---|---|---|
| 0 | "This is you, and it is okay." with the boot figure at rest | Come in, Not now | 45 |
| 1 | "Everything that is running you, top to bottom." Four lines of how it works | Try one thing, Back | 141 |
| 2 | The signal test: a flat word, then a charged word from the nine axes, then "where did that one land" | seven seats plus Nothing (8), Next (disabled until one is chosen, the reason given as its accessible description), Back | 86 |
| 3 | "A word with no power over you moved your body." | Go in | 100 |

Nothing it does writes to the record. It is replayable from Settings, Account,
"Run the signal test again". Escape and Not now leave. On close it sets a flag
on the record and **reports if the save fails**, because a flow that reopens
on every launch and will not say why is the worst shape a first run can take.
The sheet still closes on a failed save: trapping somebody to punish a storage
failure helps nobody.

**What the owner then ruled (TASKS.md section 0p, OB1 to OB15 and SIG1 to
SIG6, all open).** Among them:

- OB1: no count of screens. "I do not want to see how many screens I have to
  go through." The four dots go.
- OB2 and OB3: one button forward, and the second control goes.
- OB6: "No judgment, nothing here grades you" goes. His reason is a copy rule
  worth holding everywhere: **nothing on the screen suggested a grade, so
  denying one plants the idea. A reassurance against a fear nobody has raised
  is an accusation.**
- OB9: no pop ups. One screen, not a sheet over the product.
- OB11: the loop shown as a loop, with icons.
- OB13: far too much text.
- OB14: a tour of what each instrument does.
- OB15: "At no point are we talking about results or purpose."
- SIG1 to SIG6: the signal test is yes ten times and no ten times, felt
  inward, and **may not ask a person to pick from a list**, because "we all
  feel it differently and the words we would use will be different". The
  built step asks for a seat from a list of seven and then grades the felt
  sense against a lookup table ("That is where this instrument reads it too"),
  which `DESIGN-onboard.md` records as defect five and the line to delete.

**The voice collision, and how it was settled.** The product voice is
mechanical and precise. The onboarding is not: "WE DO NOT DO MECHANICAL, which
settles the collision between this and the instrument's own voice: the
instrument is mechanical about measurements and this is not a measurement"
(`ui/onboard.js`, recording his ruling). **Carry that distinction into any new
surface: mechanical is the register for anything that measures; a welcome is
not a measurement.** This reversed my own earlier default (Q6 in
`reviews/QUESTIONS-onboarding.md`), and the ruling stands.

**The design that answered four of his rulings at once (SPEC,
`DESIGN-onboard.md`, prototype at `proto/onboard/`).** It is worth knowing
because the problem it solves will recur in your auth and paywall flows.

A flow buys patience with a progress indicator (the rulebook: an indicator
makes people willing to wait about three times longer), and every progress
indicator is a count, which OB1 forbids. The answer: **one progress object,
and it is the loop itself.** A ring. Next turns it a quarter. Progress is
angular, not ordinal, and a circle has no last place, so there is nothing to
count and nothing to count towards. The fourth press closes the ring, sweeps
back to discover and opens the product. The same ring carries progress at
three scales (an eight second settle, a word arriving ten times, a station of
the loop), so a person never learns a second indicator. **Prose is spent
inside a wait**: the only instruction sits under the ring while it closes,
because a pause that has to happen anyway makes reading free. **The exercise
goes before the tour**: time to first act falls from about 47 seconds to
about 3, and a tour read after feeling a word land reads as a fact about
something that just happened rather than as a claim. Mechanic before name,
which is the Nintendo and Half-Life 2 order.

Two collisions inside that work are **OPEN** and need him, not a writer: OB14
asks for a purpose sentence per instrument and OB15 forbids purpose without
exception; and the gamification document allocates the loop's four quarters
by mechanic in a way that names one surface at two stations. The beat length
of the signal test (two seconds or three) is also **OPEN**.

### 2.4 The intake, where the diagnostic meets the loaded person

The intake is the Energetics tab (integer 5). It is the funnel's centre of
gravity: the web quiz reads the same twenty one laws, and a record from the
web can be loaded into the app (Settings, Account, Privacy, "Load a record").

**The order a person meets it (BUILT, `ui/intakeui.js`):**

1. **Who this is.** First, middle, last, sex at birth, date, time with "I do
   not know it", place, and an optional Myers Briggs type. The type is named
   "the ego's own account of itself, not a reading", seeds charge on the nine
   axes so a first day is not empty, and then states on every visit how much
   of the field is still that seed ("so the field is mostly yours now").
   "Save and close" rolls the block up to one line and names every gap out
   loud ("no date of birth"), because a card that hides a blank reads as
   complete. It is disabled until there is a name or a date, and says so
   rather than sitting dead.
2. **The top strip.** The CQ figure or a dash with "no law measured yet"; a
   progress bar; the words "N answered, **M left**", laws measured, laws still
   at the default; the profile switcher, New, Save, Export.
3. **What a ten means.** Three panels side by side: asked three ways, what a
   ten means, what accuracy looks like. Then the scale key, "0 never, 5 about
   half the time, 10 every time", and "about fifteen minutes for all of it, in
   any order. Stop whenever and come back: nothing is required and what you
   have entered is kept."
4. **Seven seat groups, crown down to root**, each with one plain line of what
   it governs ("what you stand on"), each law card framed in its seat's
   colour. **One law open at a time.** Inside it, the three framings side by
   side, named in English (Under cost, Unseen, Ordinary day) rather than the
   engine's left, right, neutral, each with eleven buttons, 0 to 10.

**The tension, stated in the product's terms.** The instrument reads the gap
between three framings of one law. That is why it is sixty three questions and
cannot be twenty one: one answer per law gives a mean with no spread, and the
engine refuses to read a lean it cannot see (`RESEARCH-icp.md`: "Cutting to 21
does not shorten the quiz, it deletes the instrument"). Against that, the
person answering is at levels 4 and 5, loaded, and suspicious of being
handled.

**How the build resolves it without shortening (BUILT), and the reason for
each move:**

| Move | Reason on record |
|---|---|
| Nothing required, any order, resumable, kept on every click | "Strong default rather than a hard gate on the intake", decided (`CLAUDE.md`). Diane and Sofia both need to stop halfway and not lose it |
| Duration stated at the top, remainder always visible | Simulated panel: 31 percent finish with neither, 60 with both, 68 with the three way design named in one line (`RESEARCH-icp.md`, simulated) |
| The repetition is named before question one | Marcus, around question 40: "I will feel handled. Unless you said so at the top. If you said so at the top, I will admire it." |
| Calibration said in the place the number is pressed | "A scale nobody has calibrated is not a measurement, it is a mood." Answering from how you would like to be seen poisons all three framings at once |
| What is left, never a fraction | "A count against a total reads as a score and this instrument does not score anybody." The bar carries the proportion, because a bar is a length and not a number |
| Law card shows "2 left" or "unanswered", never "1 of 3" | same rule, at the card |
| Grouped by seat, body order, seat colour | twenty one laws in one flat list is a list, "and a list is what the owner called boring"; grouped, it is a figure read top to bottom |
| One law open at a time | caps the live answer buttons at 33 (3 framings by 11) |

**Where Angela, Derek and James stop (simulated, `RESEARCH-icp.md`):**

- **Derek** stops around question 40 if the duration and remainder are not
  stated. They are, now. He finishes: "Tell me the three asks are three
  different loads and I will do all 63."
- **Angela** does not resist the length, she resists the design: "Why does it
  matter whether anyone would know. I answer honestly either way." Her Truth
  law reads 2.6 against a baseline of 6.9. Her confusion is the finding, and
  no copy fix removes it. She walks at the result, at the word Incoherent.
- **James** "would give it four minutes. Front load the finding." Nothing in
  the build front loads a finding before question one.

**Where the build still breaks its own rules (DEFECT):**

- **An answer is saved without reporting.** Pressing a number writes, applies
  and calls `pSave()` and ignores its return. Every other write on the surface
  (identity fields, seal, the Save button) reports through `statusSaved()`.
  R3: a write that can fail reports.
- **An answer cannot be taken back to unanswered.** It can be changed to
  another number and never cleared. An accidental press on the wrong law's
  scale becomes a measured law with no way to return it to the default.
- **Changing the Myers Briggs seed writes charge onto the nine axes and does
  not push undo.** It is reversible by choosing "not said", but the arrows do
  not know it happened.
- **The identity form is the first thing on the surface.** Seven fields and a
  birth moment before a single reading. `reviews/QUESTIONS-onboarding.md` Q3
  records that Diane and James walk at an ask placed before a payoff, which is
  the recorded reason they walk in the web funnel too. What may be asked
  before anything is given is **OPEN**.

**Decided but not built:** situational questions modelled on the Ultima virtue
dilemmas, **pending the format ruling (OPEN)**, and the nine child emotion
questions (`PLAN.md` block 9). Whether the tools panel lock after the intake is
retroactive is **OPEN** (`DECISIONS.md`). `DESIGN-nav.md` proposes moving the
intake off the bar into the left rail, and names its own cost: on a phone the
rail stacks under the stage, so the funnel's surface goes below the fold
(SPEC, **OPEN**).

**Two arrivals, one flow (ruled).** "Same onboarding for both arrivals." My
earlier default was two flows, because the web quiz arrival has answered the
laws and seen a reading and the cold arrival has nothing. The owner ruled one,
and the build asks only one question: has this record met it before. **For
the port, with sign in:** the record fetch at sign in is the one moment you
will know which arrival you have. The ruling stands until he moves it; if you
need it moved, bring it to him with the two first screens side by side.

---

## 3. The story: the one input that moves the reading

The job, in a person's words: "Write what happened, and tell me where it
sits." It is the only input that materially moves identification (my earlier
note: from about 21 percent with nothing to near 79 on a full profile,
MEASURED in `reviews/QUESTIONS-onboarding.md`).

### 3.1 Input: two paths, one equal to the other (BUILT)

**Typing** is the primary and the private path. The placeholder is the
instruction: "What happened. Write it the way you would say it out loud."

**Recording** is one control in the header: a dot plus a microphone plus a
label that carries its state, **Record** or **Recording**. "Speak became
record": a menu word describes what the control does, not what the person
does. The dot says which mode without reading the label.

**The privacy line is always visible, one line, not a dialog:** "Recording
sends the audio to your browser's speech service. Typing does not leave this
device." The reasoning is the pattern to reuse for every permission you add
(sign in, push, sync): the owner keeps the microphone and promises data is
never sold, both true; a third fact is also true, the browser's speech
recognition is a network service the product does not control. **A promise
about data is only worth what the person can check, so the cost is said at
the control, before the act, in the same sentence as the alternative.** A
dialog would ask for a decision the person cannot yet make anything of, and
it would sit between them and the thing they came to do.

**Recording failed silently, which is why it looked broken.** The prior pass
found the microphone button un pressing itself with no word. Every failure now
reports through `status()`, before or as it happens, each in words a person
can act on:

    no speech recognition     "This browser has no speech recognition.
                              Typing works."
    not a secure page         named BEFORE anything is attempted, because it
                              is the common case: "Opened from a file, the
                              browser will not turn the microphone on.
                              Typing works."
    permission refused        "Allow it in the browser and press Record
                              again."
    no microphone, network, nothing heard, blocked, start threw
                              each named separately

**For a desktop build this is the section most likely to change under you.**
The shipped product is one HTML file that runs from disk, and from disk the
microphone never turns on. A desktop shell's embedded browser may or may not
carry a speech service at all. Whatever you ship, keep the three properties:
the cost is stated at the control, typing is the equal path named in the same
sentence, and every failure is said in words before the control resets. The
recogniser language is fixed at US English in the build; a second language is
not in scope anywhere I can find.

Recording appends to what is already typed rather than replacing it, and
interim results render as they arrive.

### 3.2 Between the keystroke and the charge landing (BUILT)

Nothing is written until Commit. Between, on every keystroke, the story is
parsed and three things answer:

1. **The words light up in the person's own sentence.** A layer behind the
   text box holds the same text at the same metrics; the box's own text is
   transparent with only the caret showing; each scored stretch is marked in
   its seat's colour. The marks land on exactly the characters the engine
   scored, because the renderer uses the engine's own offsets rather than a
   second regular expression (the second reading disagreed with the first: on
   an 87 word story the engine read 8 hits and the page lit 5, and the words
   that take charge off a person were the only ones invisible). The name each
   mark carries ("silenced", "self attack") is held on the element and **not
   drawn**: showing it anywhere a person can read it is a design decision the
   code declares is not its to make (OPEN).
2. **The imprint column shows ghosts.** Pending imprints draw as ghosts "so
   you can see where the text is about to land", carrying whether the address
   was inferred. The count bar reads "N words, M tagged" and the Commit
   button reads **Commit N**, where N is imprints found; it is disabled at
   zero.
3. **The release panel under it offers "This story"** as a source, with a
   count.

The caret is preserved through every refresh: only the read column repaints,
never the box being typed in.

**What the preview may and may not claim.** This is the product's sharpest
honesty question and it is **OPEN**. A word names an axis; no word names an
address. "I was furious" returns four imprints named Pride, Arrogance,
Competition and Anger, all flagged as not inferred, because the flag reports
the axis honestly and says nothing about the address, which was chosen by
susceptibility order (`DESIGN-sniffer.md` question 13). A bereavement once
came back as Martyrdom. The ladder the sniffer document sets out is the rule
to design any preview against:

    a hit              "this string occurred here"          never a finding
    a band sum         "charge is held in this region"      a reading
    a named fetter     "the person named this axis"         a reading, sourced
    an inferred address                                     never a finding

**An entry that reads nothing** currently shows as an empty reading, which
reads to a person as "you are clear" when the instrument did not understand
them. 91 percent of the owner's own book reads as nothing. Silence, a question
back, or "this did not resolve" are three different products (**OPEN**,
`DESIGN-sniffer.md` question 10).

### 3.3 Commit (BUILT)

On press, in order: refuse if the loaded profile is a worked example rather
than the person's own record, and say so by name through `status()`; **push
undo, named "committing the story", before the mutation**; apply the story to
the nine axes, to the six gates and to the lean; append the entry to the
record with its date; save; snapshot; clear the box; point back at the
person's own record; repaint.

**Clear** empties the box with no confirm and no undo. It is a draft, not a
write. The draft itself lives in memory: it survives a tab switch and does not
survive a reload.

### 3.4 Undo and redo: the safety net (BUILT)

**The shape.** Two arrows in the top bar, back and forward. The pair exists
only while there is history in one direction or the other: "a permanently
disabled button is furniture". The arrow is the whole visible label, ruled
"just the arrows"; what the step will take back is written on every repaint
as the accessible name and the tooltip: "Back. Takes back committing the
story. 3 steps available." Pressing either repaints everything and says what
moved: "Took back committing the story." / "Put back committing the story."
Cmd or Ctrl Z, Ctrl Y and Ctrl Shift Z work everywhere except inside a text
field, which keeps its own.

**Why unlimited.** `UNDO_MAX=0`, on the owner's ruling. It was capped at twenty
on a memory argument, and the arithmetic killed it: one entry is nine charges,
nine opposites, twenty one laws and a short soul, under a kilobyte. "A person
who cannot get back to where they started has no undo, they have a grace
period."

**Why it captures inputs, not readings.** A snapshot records a derived reading
(CQ, DQ, SQ). You cannot restore a field from it because the inputs are gone.
Undo captures the inputs and recomputes everything else.

**Why redo.** "Undo without it is half a control." A step back with no way
forward makes undo something a person is careful with rather than something
they explore with. A new change abandons the branch walked away from, which is
the contract people already have in their hands.

**Why per record.** One stack for the whole app leaked a reference case's
field into the person's own record (reproduced: 53.0 of James's charge written
into an empty profile). History is keyed by the record's id; switching record
hides the arrows, and switching back brings that record's history with it.
Clearing on a switch was rejected because it would spend a person's whole
history on one glance at a worked example.

**Why arrows and not the named label.** My earlier review called "Undo
committing the story" the best copy in the product and asked for every
destructive control to name what it takes back. The owner ruled the arrows.
The sentence survives as the accessible name and the tooltip, and on a touch
device the tooltip's first tap explains and the second acts (section 6), so
the name is one tap away rather than gone. Keep both halves.

### 3.5 What undo covers, and what it does not (BUILT, read from code)

This matters more for the port than anything else in section 3, because
several files write conditions against "when undo exists", and undo existing
does not mean every control is covered.

| Pushes undo | Does not push undo |
|---|---|
| committing a story | the 39 rail number fields (nine held, nine opposite, twenty one laws) |
| a release, at its cool down | the three bulk sliders that write all nine or all twenty one values in one gesture |
| a charge drag on the wheel, once per drag, not once per pixel | blueprint domain, archetype and root buttons **in the left rail** |
| a blueprint domain or archetype pressed **on the wheel** | the Myers Briggs seed |
| | an intake answer |

**So the same act, choosing a blueprint domain, is undoable from the wheel and
not from the rail (DEFECT, R1 applied to behaviour: one act, one contract).**

**And "take back committing the story" is partial (DEFECT, read from code,
not reproduced).** Undo restores the nine axes, the opposites, the laws and the
soul. It does not remove the journal entry the commit appended, and it does not
reverse the commit's contribution to the six gates (`VERPMIX`) or the lean
(`LEANMIX`). The gates feed a cost multiplier on everything held, so a coherence
figure after "Took back committing the story" may not equal the figure before
the commit, and the words are still in the record. Reproduce before fixing; if
it reproduces, the label is claiming more than it does, which is R3.

Also: the history lives in memory. It survives tab changes and does not
survive a reload.

### 3.6 Conditions written against the absence of undo, now stale

- `ui/ui.js`: on a coarse pointer the wheel's drag to charge does not arm,
  because a thumb scrolling the page rewrote a person's charge irreversibly.
  "This comes out when undo exists and not before." Undo exists and the drag
  does push undo. Whether touch drag comes back is **OPEN**, and it is a
  scroll versus set conflict as much as an undo one.
- `DESIGN-mobile.md`: the bulk sliders "come back when undo exists". **They do
  not push undo.** The condition is not met by undo existing.
- `reviews/QUESTIONS-onboarding.md` Q5: a tutorial that releases for real
  "does not start until undo exists". Since ruled: the tutorial does not spend
  real charge.

**Read "when undo exists" as "when this control pushes undo, and undo restores
everything this control wrote".**

### 3.7 Undo beats confirm, and the one confirm

R5. The product confirms exactly once: **Delete this record**, a native
confirm that says what goes ("the identity, the 63 answers, the stories, the
imprints and every snapshot") and that it cannot be undone and there is no
copy unless you made one. It is the one act undo cannot reach, because there
is no store yet. Everything else is priced before and undoable after. The
release, the largest write in the product, has no confirm: it states its cost
before it starts (section 3.8) and pushes undo when it lands.

**For the port:** once records live off device, delete becomes a controller's
obligation, not a local act. The confirm stays, and the sentence must say
exactly where it was deleted from and what remains. It already refuses to
claim it deleted anything from anywhere else, "because that would be a lie
about the one thing a person most needs the truth about".

### 3.8 The release, from the story (BUILT)

The right half of Story. Every setting a run takes, **stated before it
starts**, because a person is entitled to see what a run costs before they
begin it: From (Heaviest, or This story with a count), Addresses (1, 3, 5, 8),
Pace (Slow, Steady, Quick; named rather than numeric, "because a person
choosing how fast to run a release is choosing a feeling and not a number").
The foot reads "3 addresses, 25 patterns, about 55 seconds", and the pattern
count is computed by **the same call the run makes, with the same cap**, so it
is the price and not an estimate. A label that said Patterns over a number of
addresses once quoted three and spent twenty five: on the free tier, a
fortnight's grant.

The run itself is an overlay: an opening, skippable; then one line at a time
at the chosen pace with a progress bar, "N of M patterns", Pause and Stop;
then a done state that says what moved, including "Coherence did not move"
when it did not, and how much release has left to give before integrity is
the only thing holding the reading down. The feedback floor for over ten
seconds (an estimate and a way to leave) is met.

Three interaction facts to carry, each read from code:

- **Stop does not cancel. It finishes early and applies the release.** The
  write lands at cool down, and Stop calls the cool down. A person who presses
  Stop thinking it means "abort" gets the full release applied (undoable).
  Name it or change it; that is a product call and it is **OPEN** as far as I
  can find.
- **The overlay has no Escape and survives a tab change** (DEFECT; my earlier
  review measured it floating over Knowledge). The sheet closes on Escape and
  backdrop; the drill closes on Escape; the release does not. Two dismissal
  contracts.
- **"N of M patterns" is a count against a total**, on a process rather than a
  reading. The same collision the intake bar faced; the intake resolved it to
  "M left" plus a bar. Name the collision to him rather than resolving it
  silently.

**A crossing is refused, never repointed.** Releasing or committing onto a
reference case refuses and says whose field is loaded: "which is a worked
example rather than your record. Switch to your own profile." Two attempts to
repoint instead were each worse than the bug, one spending a whole gift in four
presses. Keep this. It is the exact shape your practitioner view needs
(section 10).

---

## 4. The drill: the one mechanism for more detail

### 4.1 What it is (BUILT)

One host in the right rail's Selection section, one shell (`rdShell`), more
than thirty renderers. The screen structure brief lists them and their layout.
Here is how it behaves.

**Entering.** Any element carrying data opens one: a mark on the wheel (a
press that did not move; a press that moved is a drag or a pan), a ring in the
key strip, an address row anywhere in the product, a row in the stack, a
running pattern card, the balance or lean strips, the tier word, three of the
four doors, a Knowledge row, a Summary card. Opening forces Selection open
**beside** whatever else is open in the rail, and scrolls it into view only
when the rail sits beside the stage.

**Toggling.** Pressing the same running pattern again unpins and closes it.
Other kinds re open.

**Inside, top to bottom, always the same grammar:** a sticky back control at
the top that names where it goes ("Back to the field"); an eyebrow saying what
kind of thing this is; the name; an optional sub line; labelled blocks in a
fixed vocabulary ("How it runs through you", "The opposite", "Made of", "Held
here", "Addresses here"); an action only when there is something to act on
("Run the protocol here" appears only when the address is carrying; otherwise
a sentence saying why not and what opens it); a Close at the bottom for the
person who read to the end.

That grammar is the owner's reading shape (`DECISIONS.md`, "The register"):
this is what is running; this is how the pattern works; this is how it
operates in you, in your material; this is the behaviour you actually want;
your mind is holding these, let us release them; you can go to your imprints
from here, "a route, not an instruction to feel something".

**Leaving.** The top control, the bottom control, or Escape. All three close
the drill entirely. The top one was moved there on his question "If I click,
how do I get back?": a close at the bottom of a long drill made a person read
to the end of something they did not want in order to leave it, "a one way
door on the one surface built to be pressed into".

### 4.2 Nesting: flat, and hand authored where it exists

**There is no drill history.** A row inside a drill (an address inside a law
drill, say) opens its drill **in the same slot, replacing** the one it came
from. The top control then says "Back to the field", which closes everything;
it does not step back one drill.

Where a way back one level exists, it is written by hand into that drill:
"All of them" in an avatar pair, "All sixteen" in an age year, "The avatar"
in the purpose map, "None of these. Try by age" as a sideways door. So the
effective depth is two, inconsistently.

That matches the ceiling the information design set on purpose: **"Three
depths are forbidden."** The tooltip is the short answer and the drill is the
long one, two levels of disclosure, the Nielsen Norman ceiling
(`DESIGN-information.md`). The inconsistency is not the depth, it is that a
person cannot predict which drills offer a step back and which only offer
out. Whether the drill gains a real one step back is a change to the one slot
model and is **OPEN**.

**And the drill does not close on a tab change (read from code).** `setTab`
clears the pin but does not clear the drill, so a drill opened on the Field
stays open on Story, with its top control still reading "Back to the field".
That is R2 broken on the control a person uses to leave. Reproduce, then decide
whether a drill belongs to the tab it was opened on or to the rail.

### 4.3 What earns a drill, and what stays inline

The information design sorts every carrier into five questions, and gives
each one home (`DESIGN-information.md`, SPEC as a system, much of it already
practised):

| The question a person has | Where it is answered | Never |
|---|---|---|
| **A word:** what does this mean | the tooltip, short form; its action line opens the drill for the long form | a second definition written in a renderer |
| **A number:** what is it out of | **on the surface, beside the figure**, with no interaction ("Trust installed 1.2 of 10") | in a tooltip or a drill. 152 of 172 number carriers already do this (MEASURED) |
| **A control:** what does it do | **its own label**, starting on the verb. A tip only when the label physically cannot carry it (an icon only control) | a tooltip explaining an unlabelled button |
| **A reading:** why does it say this | **the drill**. The tip carries one line and the door | a copy of the argument in the tip |
| **Next:** what do I do now | **the control itself** | a tip a person has to open to find out what to do, "a product that did not say" |

Three rules that decide the borderline cases, each from a ruling:

1. **The refusal keeps its full form one door away.** A value slot that has
   nothing to show draws empty, with a dash. The sentence explaining why
   ("neither side reaches 1, so no direction is named") lives in the drill.
   Ruled after the balance slot printed a refusal sentence between the words
   masculine and feminine and the owner, reading it, said he did not
   understand what it meant. He was reading it correctly: a sentence in a
   value slot parses as a value.
2. **A word the product puts on a person carries its own meaning where it is
   said.** The tier word used to hold its definition in a hover title; now the
   rail prints the definition beside it and the word is a button to the whole
   reading. Anything that lands on a person as a judgement is inline. Anything
   that is a lookup is a tip.
3. **Ask whether it is a drill before it is allowed to be a tab.** A drill is
   detail about a thing already on screen. **Two counter examples set the
   limit.** The Compass lived three clicks deep inside a drill and the owner
   went looking for it and could not find it; it became a tab. The Ritual was
   a modal reached from three places and he had never seen it; it became a
   tab, and "a surface that needs a second press to show anything is a blank
   screen with a name on it", so it opens itself on arrival. **The test: a
   drill answers a question about something visible; a tab is a place a
   person goes back to on purpose.**

---

## 5. Navigation, persistence and the empty state guard

### 5.1 The model (BUILT)

Nine doors in the bar, in display order: Energetics, Ritual, Story, Field,
Body, Compass, Knowledge, Games, Summary. Settings has no door; the profile
button reaches it, "because a setting is not a place in the product a person
navigates to as a peer of the instrument". Analytics is folded into Summary.
The wordmark goes home, and home is the Field. The bar is written into the
document rather than built by a loop, so a start up failure cannot take the
navigation with it. Pressed state is read off each button's own identity
integer, never off its position.

The owner's structural ruling: top, bottom, left and right each need a logic,
so the areas around the centre carry information worth having at a glance.
**The rails are on every tab. The rails are the app and the tabs are a
stage.** Nothing on screen says so, and a stranger builds the opposite model
in the first minute (my earlier review). If your port keeps the three column
shell, say it once, somewhere a stranger reads.

**Menu rule, ruled:** one word per door, and the word names exactly what the
surface does, not what it is about. Intake became Energetics and Energy became
Body under it. Apply it to every door you add: Sign in, Plan, Clients.

### 5.2 What a tab change does (BUILT)

In order: resolve a folded surface to its carrier; **empty Summary and the
folded Analytics on the way out**, so a hidden surface never sits in the
document asserting a reading about a profile that is no longer selected; clear
the pin; show the host; the surface **arrives** with six pixels of rise rather
than appearing as a one frame cut, "which gives the eye no direction"; measure
the canvas the moment it is visible and not a line earlier; open the rail
sections the surface is about, **once, the first time**, "because a tab that
reopens it on every visit is arguing with them"; open the Ritual on arrival;
start or stop the Compass and Games frame loops; scroll to the top of the new
surface and **move focus to the pressed tab button**, because a focused control
on the old surface made the browser scroll back to it.

### 5.3 What persists

| State | Across a tab change | Across a reload |
|---|---|---|
| the record: identity, answers, charge, stories, imprints, snapshots, avatar, plan | yes | yes, in the person's own browser storage, and a failed save says so |
| lighting, density, the Quiet motion toggle | yes | yes |
| zoom, pan and depth on the wheel | yes | no |
| which rail sections are open | yes, all independently: "every section can be open at once, ruled", because the left rail exists to compare the blueprint with the axes being set | no |
| the open drill | **yes, and with a stale back label** (section 4.2) | no |
| the story draft, the release panel's settings | yes | no |
| the open law on the intake, the stack tab, the Knowledge section | yes | no |
| the age ladder answers | yes | no, and it says "Nothing is stored here" |
| undo and redo | yes, per record | no |
| the release overlay | **yes, it survives the change** (DEFECT) | no |

**No browser history.** Nothing uses the history API; there is one document
and the browser's Back leaves the app. **For a desktop build**, the platform's
back gestures (mouse button four, Alt Left, a swipe) mean nothing today. Decide
deliberately. The candidates are: nothing; close the drill; previous tab. The
drill's top control already names a destination, so if back is bound to
anything it should be bound to what that control says.

**Escape is layered by accident.** The tooltip catches Escape first in the
capture phase and stops it, so one press closes the tooltip and nothing else.
After that, the sheet, the drill, the lighting menu and the onboarding each
listen for Escape on their own, so a single press can close several at once
(read from code). The release overlay does not listen at all. **Port one
rule:** Escape closes the topmost layer, one layer per press.

### 5.4 Proposed navigation, not built

Two proposals exist and neither is ruled.

- **Two levels, four doors** (`DESIGN-nav.md`, SPEC, prototype at
  `proto/nav/`): Ritual; Story with Summary under it; Tools holding Field,
  Body and Compass; Insight holding Knowledge and Games; Intake off the bar
  into the left rail. Four surfaces move to two presses, and on anything under
  1600 wide that is cheaper, because today three to five doors sit past the
  right edge of a strip whose only affordance is a fade (MEASURED at 1280, a
  laptop). Five questions are his: what a container door does when pressed;
  whether Insight passes his own menu rule when Games sits under it; the 39
  pixels a reserved second row costs at 1600; whether the second row's left
  alignment holds at 390; and Intake below the fold on a phone. **The document
  says of itself: "this is a navigation fix and not a cognitive load fix".**
- **The phone composition** (`DESIGN-mobile-icp.md` pass five, SPEC): one
  object, one action, one way back. Not your surface, but its principle is
  section 10's.

### 5.5 The empty state guard, and the job it does

**The flag (BUILT, `engine/compute.js`):** `unread` is true when nothing is
loaded above the line, no law has been measured, and nothing sits under the
line. Every surface that prints a reading silences itself on it. The screen
structure brief tables what silences on each surface and what still leaks; I
will not repeat the table. Here is why it exists and what it protects against.

**The failure it was built after.** A stranger's first load used to seed every
axis at 3, which produced CQ 36 and the word Incoherent in the largest type on
screen, beside a panel correctly saying nothing was held. Later the opening
surface printed coherence 42 percent off nothing but the default 6 on the
laws. **The values were invented, and the product named a person from them
before they had typed a word.** "Zero is the honest opening."

**The sentence that carries it, and my candidate for the best line in the
product:** "Nothing has been entered, so there is nothing to read. The
arithmetic underneath works and it is not being shown, because a number off a
default is a number about the default and not about you."

**The job, stated as a rule you can apply to screens that do not exist:** a
screen that looks diagnostic must never appear diagnostic when nothing is
behind it. A ring draws empty with a dash, because an empty ring is the honest
picture of an empty field. A label keeps its slot. The doors take the place of
the reading. The empty state is said one way across the app: "Nothing has been
read yet. Write a story or set a charge." (Five phrasings of it were found and
cut to one.)

**The guard is still half built, and a stranger cannot tell which half is
lying (DEFECT, read from code):** the right rail's person block prints
archetype shares ("First 26 percent") and domain shares for a default
selection nobody made, "Heaviest" with a value of 0.0, and "Most shut" naming
a law off the default of 6, all without checking `unread`. My earlier review
measured 29 numbers in the rails beside the centre's refusal paragraph. The
honest half is wasted when the dishonest half is louder, more numerous and in
colour.

**And the guard has a hole at the other end (OPEN, `DESIGN-sheet.md`):** a
person who writes stories, never answers the intake, and releases everything
reads `unread` again. **The success condition of the whole product returns a
person to the state of never having arrived.** The flag cannot tell "never
entered" from "emptied". The first screen for a person who has done the work
must not be the stranger's screen.

**One more default that leaks through the arithmetic:** a field with nothing
entered reads 28 of 100 malignant on the lean, because the engine derives it
from CQ (`DESIGN-lean.md` question 7). The surfaces silence on `unread` for
exactly this class of problem. Any new surface that reads the lean has to as
well.

---

## 6. The tooltip and when the product explains itself

### 6.1 The one tooltip (BUILT, `ui/tip.js`)

An audit found eight mechanisms doing the job of one, and **195 definitions
reachable only by hover** (the backlog had said eight; MEASURED in
`DESIGN-tooltip.md`) on an audience that arrives on phones. One replaced them.

| Behaviour | What it does | Why |
|---|---|---|
| Fine pointer | hover with 380 ms intent, 120 ms grace | under about 300 ms a pointer crossing a rail of twenty rows fires twenty panels; the grace makes the ten pixel crossing into the panel survivable, so a long definition can be scrolled |
| Coarse pointer, or narrower than 600 | a sheet at the window edge, on the half the carrier is not in | a definition 700 pixels from its word on a desktop is too far; on a phone the sheet is right |
| Tap on a coarse pointer | **the first tap explains, the second acts** | measured: on a phone, explain and navigate were one gesture and navigation won in 120 ms, destroying the definition before it could be read |
| Keyboard | focus opens it; Escape closes it, caught first | |
| Scroll | closes an anchored panel; never a sheet | a panel chasing a scrolling carrier is a second moving object; the sheet scrolled its own carrier clear and closed itself, until that was measured |
| Placement | below, above, right, left, first that fits; the carrier's box is inflated by the gap so the panel can never land on what it describes; never over the tab bar, "the bar is how a person leaves the surface" | |
| On the wheel | the panel is placed against the canvas, beside the picture, on the side the mark is on | law 8: no text over the hero graphic, and the tooltip was the thing breaking it |
| Content | kicker, title, body, numbers as label, value and "of" triples (a bare number cannot be passed), an action line | R2 and the "every number says what it is out of" rule, enforced by the data shape |
| No script | the native title stays on the element until the panel opens and is put back after | a script that never ran leaves a working native tooltip; "tooltips are the last thing that should break" |
| Colour | the carrier's colour is only ever a graphic (the tether, the entry mark), never text; the alarm colour never appears | "a tooltip is an explanation and an explanation is not a warning" |

Every element with a native title is now a carrier, so the 195 are reachable
by tap. `DESIGN-information.md` had argued against promoting all of them
(question 4) because a title was never written as a definition; the build
promoted them anyway. Their quality is unreviewed.

### 6.2 What is not yet one tooltip (BUILT, read from code)

- **The canvas probe is still a second panel.** Hovering the wheel writes its
  own `#probe` box at the pointer plus 18 pixels, inside the canvas, which is
  the text over the hero graphic that law 8 forbids and the tooltip design was
  built to retire (migration step 2, not done). The screen structure brief
  lists `#probe` with the tooltip; in code they are still two things.
- **Two caption slots** in the left rail still receive text on hover and wipe
  it on leave, with no touch route (migration step 4, not done).

### 6.3 Inline or behind a tap: the rule

Section 4.3's five kinds decide it. The shorter version, derived from the
rulings and not from generic practice:

1. **If misunderstanding it could harm the person, it is inline.** The tier
   word's meaning. What a ten means, in the place the ten is pressed. Where the
   audio goes, at the microphone. Held and opposite, "said once, in place,
   rather than left in a tooltip no thumb can reach".
2. **If it is a scale, it is inline beside the number.** Always.
3. **If it is a definition, it is a tap.** One mark, everywhere, so a person
   learns once that a marked word answers. The spec'd mark is a dotted rule
   under the word, with a 44 by 44 hit box that does not change the line box
   (SPEC; not built).
4. **If it is an argument, it is a drill.**
5. **Never three depths.**

Sarah Higley's objection is the sharpest one and the answer is on file: a
tooltip may only carry non essential content, and **a definition of Trust is
not non essential**. So the tip cannot be the only route; the drill and a
searchable index are the other two.

**The content gap, which is canon and therefore his (OPEN):** seven of the
nine coherent opposites (Trust, Worth, Acceptance, Vitality, Groundedness,
Joy, Readiness) have no definition anywhere in the product, and they are what
release installs. A person can be told their Trust is installed at 1.2 of 10
and there is no sentence saying what Trust is. Drafts exist in
`proto/info/info.html`, unapproved.

Also open: whether hover should open at all on a fine pointer; whether the
action line belongs on every named thing or only on rows that already
navigate; whether a practitioner gets the same glosses; and whether counting
which names a person looks up, the most honest map of what the reading fails
to say, is allowed to be stored at all.

---

## 7. Cognitive load. The open problem

### 7.1 In the product's own terms

`CLAUDE.md`: "57 to 71 simultaneous choices per screen against a working memory
of about four. Architectural, needs a decision first." Once measured at 109.
Rule 7 of the rulebook: "Measured at 57 to 71 simultaneous choices per screen
on desktop. Working memory holds about four. Open, and architectural." My
target for a working screen is under twelve.

**It has grown.** Every later measurement is higher:

    reviews/uiux.md            70 to 111, deduped, above the fold, 1600
    DESIGN-nav.md              64 to 125 in the first viewport at 1600;
                               85 to 221 in the document
    the screen structure brief 64 to 125 seen at 1600; the fixed shell alone
                               81 to 98 on every surface but Settings

All MEASURED, on different builds and with different selectors. **Do not quote
any of them. Re-measure on your build, stamp the build, and read the number
off the run.**

**Where it lives.** Not in the centre. The left rail is about 52 controls on
every surface, open on arrival; the top bar about 14; the right rail 15 to 32.
The phone is lighter for a bad reason: the rails do not collapse, they stack,
so most of them are below the fold. **A desktop port is the configuration
where the load is worst**, and every new surface you add into a shell that
already carries 81 to 98 fixed choices starts over budget before it draws
anything.

### 7.2 Why it is architectural and not a cleanup

The load is produced by rulings, each of them correct on its own:

- top, bottom, left and right each carry at a glance information;
- every rail section can be open at once;
- never hide a control with no affordance (R10);
- recognition over recall (R6): show the options;
- the product's density is its argument; nothing in the 112 addresses, the
  twenty one laws or the nineteen domains is to be deleted.

Against R7: remove, hide, shrink, organise, in that order. Those cannot all be
satisfied on one screen. That is the decision he has not made, and it is not
mine or yours to make.

### 7.3 The options on file, none of them ruled

| Option | Source | What it buys | What it costs |
|---|---|---|---|
| **A. The left rail becomes a spine.** Four labelled icons; each opens its section as a drawer over the stage, one at a time, closing on Escape and backdrop. Plus the Story imprint cloud collapsed to its group headers. Plus a design gate that fails over 45 | my earlier review, `reviews/uiux.md` pass 3 | roughly halves the per screen count (projected, not measured); gives the product one dismissal contract | the left rail stops being at a glance, which is against his four sides ruling. My review wrote "I am ruling this". **I had no standing to rule it and `CLAUDE.md` still lists it open. Treat it as a proposal.** |
| **B. Two level navigation** | `DESIGN-nav.md` | fixes the scrolling bar at laptop width | by its own measurement, 1 to 6 percent of the load |
| **C. One object, one action, one way back** | `DESIGN-mobile-icp.md` pass five | the panel's only composition with no layout abandonment | Marcus: "The count did not go down. The count stopped being on the screen at the same time." It is ordering, not reduction, and it was designed for a phone |
| **D. A bar that grows as it is earned** | `reviews/QUESTIONS-onboarding.md` Q10 | day one sees fewer surfaces | collides with R10 unless every locked surface shows what unlocks it, which is a whole new state |
| **E. Density** (Tight, Comfortable, Wide) | built | fits more or less on a screen | changes size, not the number of decisions |

There is also an open question about the measurement itself: a grid of
nineteen blueprint domains is one decision with nineteen options, not nineteen
decisions. Counted as decision groups, the same screens are 17 to 21, not 70 to
111 (MEASURED, `reviews/uiux.md`), and that count points at the fix (too many
groups on screen when nobody asked them a question) rather than at deleting
domains. Which metric the gate holds is part of the decision.

### 7.4 What the port should do while it is open

1. **Do not decide it.** Build the shell so that each option remains possible:
   rail sections as independent components that could become drawers; the
   drill independent of the rail it sits in.
2. **Put a count gate in from the first commit**, reporting per surface and by
   name, even with no threshold. The number moved from 71 to 111 because
   nothing was watching it.
3. **Count every new surface before it ships**, including auth and paywall.
   A sign in screen with the full shell around it is a 90 choice sign in
   screen.
4. Bring the decision to him with the options drawn, side by side (section
   10.3).

---

## 8. Feedback and the status contract

**One writer (BUILT, `status()` in `ui/component.js`).** A single region with
`role="status"` and `aria-live="polite"`. Failures stay on screen until
replaced; confirmations clear at 2.4 seconds, "which is past the point a person
has read it and before it becomes furniture". Saving has its own wording
because saving is the case that was lying: the intake Save button used to read
"Saved" whether or not anything was written. It now reads "Saved" or "Not
saved", and a refusal names its own reason: "This is a worked example rather
than your record. Switch to your own profile first" is a different sentence
from "Storage is full or blocked, so this session will not survive a reload",
because a person can act on the difference.

**The patterns worth copying exactly:**

- A seal that fails to save puts the form back rather than claiming it rolled
  up.
- A record import is atomic: nothing moves until the profile has validated,
  loaded and saved; a refusal names the field; the message is written after
  the host redraws, because the redraw erased a success message at the moment
  it became true.
- Billing with nothing bound says so rather than opening a dead page:
  "Billing is not connected yet. The plan is read from your record, and the
  page that changes it lives behind sign in."
- Sign in, which does not exist, is shown as stubs that say it does not exist:
  "This record is in this browser and nowhere else, so there is nothing to sign
  in to and nothing to sign out of."

**Timing.** Everything computes locally in well under 100 ms, so the product
has never needed a spinner, and the rulebook forbids one: "an indicator for a
20 ms operation is a lie about effort". The boot overture is 5.3 seconds with
no progress and no visible way out (MEASURED; the skip exists and nothing says
so). The release run meets the over ten seconds floor. **The port adds a
network for the first time** (sign in, the record fetch, billing, push). The
feedback floors apply to this product for the first time, and every network
write is a write that can fail, so every one reports.

**Gaps, read from code (DEFECT):** the story commit reports nothing on
success and ignores the result of its own save and snapshot, so a commit onto
full or blocked storage is silent both ways; an intake answer ignores its save
result. (The rail number fields are fine: they save on a debounce and report a
refused write by name.)

---

## 9. The owner, as a person this product also has an interface with

Two rulings govern how anything is brought to him, and they are interaction
design, not etiquette.

**Four headings, in his order, and nothing else** (ruled 21 September):

    What I did
    How it impacts you
    What I am doing next
    What I need from you

Bullets, not paragraphs. **The questions are listed in full under the last
heading, never referred to as a list he has to go and find.** A finding that
does not change what he decides goes in the backlog, not in the reply. His
words: "the output is so dense constantly that I cannot read this all the
time, I have got decision fatigue." This is R7 applied to the person who owns
the product, and it is the same working memory arithmetic.

**A question about a drawing is asked with the drawing.** Both answers, side by
side, same profile, both widths. Ruled after a geometry question was put to him
in prose and he said, correctly, that he could not tell what it meant.

**Builds go to him as a download, never a preview**, named `atuned.html`, with
the commit and the md5, because a rendered file in a view pane cannot be saved,
"and a build he cannot save has not shipped."

Every open question in section 11 should reach him in that shape.

---

## 10. Principles for surfaces that do not exist yet

The port adds auth, a paywall and tiers, a practitioner view, push
notifications, and a points and badge ladder. None is designed. Each must still
feel like this product. These are the interaction principles to hold, each with
the ruling it comes from and what it means for the new surfaces. They are
principles, not designs; the designs are his to approve.

### 10.1 The principles

**1. A reading is never invented.** Source: the unread guard; "a number off a
default is a number about the default and not about you". *For new surfaces:*
a practitioner looking at a client who has entered nothing sees the refusal,
not a default. A paywall never shows a sample reading dressed as the person's
own. A notification never states a reading the person has not produced.

**2. A reading is not a score.** Source: never print a count against a total;
the band word is a description, not a grade; the low band words are under
review and his. *For new surfaces:* **"A practitioner panel sorted by coherence
is a leaderboard with a licence. Group views sort by what needs attention,
never by who is ahead"** (`DECISIONS.md`). No rank, no percentile, no "you are
ahead of". And settle the word tier before the paywall: today it names both a
coherence band and a plan on the same Settings screen (my review, F14); R1.

**3. Sight is not for sale.** Source: `DECISIONS.md`. Every tier, free
included, sees the whole reading. A tier buys one thing, how much new ground
may be opened. *For the paywall:* never withhold a person's own reading to sell
it back. The paywall sells volume and says so. A rerun of ground already
opened costs nothing, forever.

**4. Never claim success before you have it.** Source: R3 and the status
contract. *For auth:* "signed in" appears only after the session exists. *For
billing:* the tier changes on screen only after the processor confirms. *For
push:* "reminders on" only after the platform grants permission. Every network
write reports through the one writer.

**5. A consequential grant is explicit, listed and revocable.** Source:
`CLAUDE.md`. A practitioner seeing somatic and psychological self report needs
explicit consent, a visible list of who has sight, and revocation, never a
silent default. The Settings page already carries the shape: "Who has sight:
nobody. A practitioner gets sight only when you grant it. The grant is listed
here by name, with what they see and the date you gave it, and one press on
the row takes it back." And a cohort lead sees the outputs, not the tools, and
**not the story cloud**: the story is the person's own words and the record and
the story are never held joined.

**6. A crossing is refused, never repointed.** Source: the reference case
refusals on commit and release. *For the practitioner view:* a practitioner
cannot commit, release or answer on a client's field. The refusal names whose
field is loaded and what to do instead. Repointing was tried twice and each
time was worse than the bug.

**7. Undo beats confirm; confirm only where undo cannot reach.** Source: R5.
*For the new surfaces:* revoking a grant is one press and immediate, and
restoring it is another grant. Deleting a record off device keeps its confirm
and says exactly where it was deleted from. Cancelling a plan says what
changes and when, and undoes if it can.

**8. Validate at the boundary, refuse by name, never clamp.** Source:
`validateProfile`; "a clamped 9999 reads as a 10 the person never entered".
*For auth:* the record fetch at sign in is the boundary's first real caller.
One known hole to close first: a renamed law in an older record is dropped at
the boundary with `ok: true` and no error, so the rename migration never fires
(`DESIGN-integrity.md`, disagreement two).

**9. Every surface opens showing something true, or says why it cannot.**
Source: the Ritual ruling, the four doors. *For new surfaces:* an empty client
list, an empty plan history, a practitioner with no clients: each is a designed
state with one verb, not a blank panel with a heading.

**10. Say the cost at the control, before the act, in one line, beside the
alternative.** Source: the microphone line. *For auth:* what the address is
used for, at the address field. *For push:* what a reminder will contain, at the
switch. *For the paywall:* the price in patterns and minutes, computed by the
same call that will charge it, as the release panel does.

**11. One word per concept, one slot one label.** Source: R1 and R2. Canonical
words: nothing held, held, profile (never persona), release, opposite. A
control's label starts on its verb and names what it does. The empty state is
said one way.

**12. Refusal is a first class answer.** Source: the lean channels report "not
read" rather than zero; the engine declines to name a direction it cannot see.
*For new surfaces:* a practitioner summary of a thin record says it is thin.

**13. The asymmetric error.** Source: `DESIGN-lean.md`. "A false positive on
the lack side is the one error this product cannot afford." Three accounts of
being harmed once read up to 1.9 times worse than an account refusing
responsibility, and the design was rebuilt around that one failure. *For push
and the practitioner view:* no verdict about a person travels in a notification
or a client summary. The owner's register: "We are not judging anybody. The
product says what is running, not what a person is." A label about a pattern
may be blunt; a label about the whole person may not be a moral word.

**14. Things empty as a person improves.** Source: the character sheet
inversion (`DESIGN-sheet.md`, SPEC): "you are already the most powerful version
of yourself; it is the limiters". The bar is drawn full and never grows; what
is drawn inside it is the load, and the load falls. *For the points and badge
ladder:* not a number that rises as a reward, and not Duolingo's manipulative
half. The dated first ("first release at the throat"), which the product
already records and never shows, is the achievement shape that fits.

**15. Voice.** Mechanical and precise about anything that measures; short
sentences; physical metaphors only (heat, pressure, weight, conduction,
discharge); no soft wellness language (no journey, no holding space, no
invitation). A welcome is not a measurement and may be warm. Never reassure
against a fear nobody raised. No em dashes. The count stated is 112, never 108.
Headers title cased by the transform, body in sentence case, a person's own
name exempt.

**16. Form.** Icons are rings, not fills (the one exception is the Punch
lighting's own icon, where the fill is the message). Every named thing wears
its own mark. A percentage is one object everywhere: a ring showing the arc and
a pill carrying the number. A domain is a choice and never gets a ring, because
a ring is a measurement.

**17. Motion.** A surface arrives; it does not appear. A thing leaving does not
need to be watched out. Reduced motion is honoured through the system setting
and through a Quiet toggle on the record, because the setting alone is not
enough (R8).

**18. The network lives at named seams.** Source: the one file posture and
gate 7, which fails on any outbound request. A desktop build changes the
container, not the posture: the app gains network at the record fetch, billing
and push, each a named seam, each a write that reports. Nothing else calls
out. The fonts were removed from Google for this reason: every load sent the
person's address to a third party before they had typed a word.

**19. Four sides, each with a logic.** Source: his ruling on the regions round
the centre. A new surface either earns its place in that logic or is a drill.

### 10.2 The three new surfaces, walked with three people

A tissue test of the principles, not a design. Stops are predictions from the
recorded psychographics, marked as such.

**Sign in.** *Diane* walks at an ask before a payoff; the recorded fix is to
show the score first and ask after (`RESEARCH-icp.md`). *James* will not hand an
address to a stranger to receive a number he was already promised, and wants a
one time code so the address is not the only key; the Settings page already
promises "never the address alone, because an address alone is the key to
somatic and psychological self report". *Angela* came from a group chat link on
a phone; a sign in wall before anything about her is the pass four failure,
where removing her route to the quiz collapsed activation. **Principles 1, 4,
10.** Where sign in sits relative to the first reading is his.

**The paywall.** *Derek* does the division: at 39 he holds about 7,800
patterns, the free tier opens 520 a year against 200 accrued by living, so
twenty four years (`RESEARCH-icp.md`, simulated). A paywall that hides that
arithmetic loses him when he does it himself. *Angela* at level 5 wants magic
and will read a price per pattern as a meter on her feelings. *Sofia* needs to
know what her clients will be asked to pay before she sends them. **Principles
2, 3, 10.** The one pattern equals one dollar unit is internal and never
printed.

**The practitioner view.** *Sofia* withholds her recommendation until she can
see who else can see a client's record; that is her stopper in every pass of
the phone study, and it is not a layout problem. *James* as a client would
refuse a view that ranks him. *Ana* as a client needs to know nobody is reading
her answers but her unless she said so. **Principles 2, 5, 6, 13.** Whether a
practitioner sees everything or the tier scope is **OPEN**.

### 10.3 How to bring a design decision to him

Section 9: four headings, questions in full, and a question about a drawing
asked with both drawings, same profile, both widths.

---

## 11. Open, and his call

Not mine and not yours. Each is one line; the source says more.

**First run and onboarding**
1. The onboarding rewrite: OB1 to OB15 and SIG1 to SIG6 (`TASKS.md` 0p). It is
   off until then.
2. OB14 against OB15: a purpose sentence per instrument against "at no point
   are we talking about results or purpose" (`DESIGN-onboard.md`).
3. The loop's quarters named by mechanic put one surface at two stations
   (`DESIGN-onboard.md`, `DESIGN-gamification.md`).
4. The signal test beat: two seconds or three (`DESIGN-onboard.md`).
5. Four equal doors, or a front door (`reviews/QUESTIONS-onboarding.md` Q8).
6. What counts as day one done (Q2).
7. What may be asked before anything is given, including a name or a birth date
   (Q3).
8. A named tutorial, or teaching through consequence (Q4).
9. A second day, and who asks: the product, the person, or the practitioner
   (Q12).
10. What a stranger sees when a story reads nothing (`DESIGN-sniffer.md` Q10).
11. Whether a reading ever prints an inferred address name (`DESIGN-sniffer.md`
    Q13).
12. Whether the names on the highlighted words are shown to the person.

**The intake**
13. The format of the Ultima style situational questions.
14. Whether the tools panel lock after the intake is retroactive.
15. The two phrases for Justice and Humility were missing; they now exist in the
    code. Whether they are his words.
16. Intake off the bar and into the rail, and its cost on a phone
    (`DESIGN-nav.md`).

**Story, undo and release**
17. Whether drag to charge returns on a touch surface now undo exists.
18. Whether Stop in a release means finish or abort.
19. Whether "N of M patterns" on the run is allowed, as the intake bar's
    remainder was.

**Navigation, drill and information**
20. The five navigation questions in `DESIGN-nav.md` section 11.
21. Whether the drill gains a one step back, and whether it closes on a tab
    change.
22. The seven coherent opposite definitions, which are canon.
23. Hover at all on a fine pointer; the action line's scope; a practitioner's
    glossary; whether looked up names may be counted.
24. The first screen for a person who has released everything and reads unread
    again (`DESIGN-sheet.md`).

**Cognitive load**
25. The decision: which of A to E in section 7.3, or none, and which metric the
    gate holds.

**Accounts**
26. Whether a practitioner sees everything or the tier scope (`DECISIONS.md`).
27. The word for a coherence band once tier means a plan.
28. The low band words: Incoherent, Corrupt, Severe, Collapsed.
29. Whether push may add a second file against the one file rule.
30. The two arrivals: one flow stands until he moves it.

---

## 12. What to instrument in the port

All local counters unless and until he rules otherwise, and each one a question
before it is a number.

1. **Presses from first paint to first input, and which door.** If the story
   door dominates and the nine sentences door is never pressed, the doors are
   not reaching level 5.
2. **Commit, then what.** The next surface a person visits within ten seconds of
   a commit. If it is nothing, the silent commit (section 2.1) is costing the
   reading.
3. **Undo within thirty seconds of a commit or release**, by act. A high rate on
   commit means the preview is not doing its job.
4. **Drill opened, then closed within four seconds with no press inside it.** A
   definition that did not help.
5. **Tooltip first taps that are never followed by a second tap** on a carrier
   that navigates. The explain first rule costing a press.
6. **Intake: laws completed per session and where people stop**, by seat group.
7. **Simultaneous choices per surface, per build**, stamped with the build.
8. **Returns to the unread state** by a person who had a reading.
9. **Release: Stop pressed, and whether undo follows it.** If Stop is followed
   by undo, people meant abort.

**Grade delta.** Not given here. No browser walk was run for this document, and
a grade without one is a guess. The last measured grade of the interaction
layer is C minus in `reviews/uiux.md`, on a build that opened on Summary, and
several of its blockers are fixed in the current code (Games renders; the rail
no longer prints the empty state sentence beside a live reading). A five person
walk on the desktop build is the way to set the new one.
