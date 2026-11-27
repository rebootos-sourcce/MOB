# Onboarding and first experience. Review 3 of 3: narrative, copy, flow and safety

Reviewer 3 of 3, narrative and copy seat (June Okonkwo-Lund). 1 October 2026.
Docs only. Nothing under `atuned_src/` moved, nothing was built, nothing was
pushed.

Reviewed: `ATUNED-onboarding-first-experience-TDD.md`, read in full twice, then
against the product as it stands. Reviewers 1 and 2 hold the other halves. This
file holds the words, the order a person meets them in, and the places a person
could be hurt or misled.

What the file contains:

    A  every screen from landing to handoff, in the TDD's own section 45 schema
    B  the ten integrity questions and six archetype polar questions
    C  the safety and claims audit, with every failing line and a fixed line
    D  the visual grammar as a table, and the figure conflict
    E  five questions that change the design, each with its quoted snippet
    F  the voice gate, run on every proposed string, and what it cannot judge
    G  what was read

---

## 0. The findings that move the most, in order of weight

The owner would want these before reading anything else. Each is argued where
it is numbered.

1. **The Mirror in the TDD prints things the engine does not hold.** The TDD's
   own example story, "I keep taking care of everybody else.", returns nothing
   at all from the shipped sniffer: no hit, no imprint, no axis, no saboteur
   (section A, S06, measured). The example's "Cause / Experience" sentence is a
   motive written in the person's voice that nobody said. The engine has no
   field for it, and the product's own brief forbids inventing one (C-1, row 2).
2. **There is no safety path.** The TDD takes a spoken or typed story from a
   stranger and has no line for a person in danger. Measured: "I want to end my
   life. I feel hopeless and numb." returns Sad at 8.8 and an offer of a
   release to "Happy / Restoration". "I do not want to be here anymore." returns
   nothing. The legal floor already drafted the line and nothing built it
   (C-1, the gap, and E3).
3. **The funnel promises the opposite of what the TDD stores.** The funnel's
   story step says "Nothing you write leaves this browser, and it is not saved.
   Close the page and it is gone." The TDD says preserve the original story
   and move it into the account. One of the two sentences has to change, and
   the timing of the account decides which (E2).
4. **A first release may refuse.** On a first story the engine often holds
   nothing above the line, and the release refuses. The TDD promises an
   automatic ten-pattern release and a first success (E4).
5. **The release sentence is a fourth wording.** The brief says "release the
   charge". The ruling and the shipped stem say "I am letting go of". The TDD
   says "I am releasing", drops "perceiving" from the six ruled channels,
   leaves off the state the sentence is about ("that I am afraid"), and states
   five gates on day one where the book starts with one (C-4).
6. **"This isn't a test, and there isn't a good or bad number" is untrue the
   moment the answers move the reading.** Integrity feeds coherence, and
   coherence has ranked bands. The fix is structural, not a sentence (E5).
7. **Ten of the TDD's own user-facing lines fail the house gate** (five of them
   are the handoff labels in capitals), and fourteen more rows fail on rules the
   gate cannot read. Counted off the run of 1 October 2026 and the table in C-5.
   Every one has a fixed line beside it, or is cut with the reason.
8. **"No human figures" collides with the Body page, the aura and the Avatar**
   (D-2). The ban holds for decoration. It cannot hold for the figure that
   carries location.
9. **Three things the TDD names are not in the product's vocabulary**: "Mage"
   (the table says Magician), "Story Tag" (tag is taken), "Intensity" (the
   product says weight, charge and load). One word per concept.

---

## A. Screen by screen

### A.0 Conventions

**Tags on every string.**

    TDD        quoted from the TDD, where it gives copy. Never edited in place.
               A TDD line that fails the voice gate keeps its row and gets a
               PROPOSED replacement beside it. The failure is argued in C-5.
    TDD edited the TDD's line with one word changed. The change is named on
               the screen where it sits.
    EXISTING   shipped in the product today, or drafted and ruled in a file
               named on the row. Reuse beats invention.
    PROPOSED   mine. Flagged for the owner. Nothing here is ruled.

**Buckets.** Every string is exactly one of the seven in `COPY.md`: Menu, Label,
Value, Definition, Instruction, Reading, Refusal. A string that is two is two
rows. Where a Refusal carries its own route in one sentence, V15 allows it.

**Rulings that bind every screen below.** Recorded in `TASKS.md` 0p and
`DESIGN-firstrun.md`; cited by number, not reopened here.

    OB1    no count of screens. The ring is the only progress object, and a
           ring carries no digits
    OB2    one button forward. It says Next (OB12)
    OB3    no "not now". The way out is a corner word
    OB4    "Hello", never "Welcome"
    OB6    no reassurance against a fear nobody raised
    OB9    no pop up. One screen, not a sheet over the product
    OB13   under 25 words on any frame. Prose only inside a wait
    OB15   at no point results or purpose (open against FH, Q3 in firstrun)
    HS     a section never explains itself. Four kinds of line stay: a
           reading, a refusal, a disclosure owed, one line at the moment of use

**Fields.** The fields of the TDD's section 45 schema, in its order.
Where the TDD says "do not leave any of these behaviours to inference", a field
is never left blank. "None" is written as "none" and means none.

**Persistence names.** `device` is the person's own browser store, through
`bindStore`, and a failed write reports through `status()`. `record` is an
account record, and exists only if the owner answers E2 that way. No story
text, feeling text, correction text, integrity answer or archetype answer is
ever put in an analytics event. `engine/outbox.js` already refuses `story`,
`journal`, `mirror`, `laws`, `answers63`, `avatar` and `aim` by name, and the
same list governs events.

**Placeholders.** `{n}` and the like are read off the run, never typed. A count
typed into a string is a defect this repository has recorded many times.

**The Next label.** Never changes with the data. Where a screen cannot go
forward, Next is absent, not disabled, and the way through is on the screen.
This is the signal test lesson: "I can't click next to go, I can only click
solar."

### A.1 The journey, as screens

The TDD's section 7 lists its states in one column, LAND to CONTINUED_PRACTICE.
The ones before handoff are LAND to VERIFY. Three of those have no screen of
their own in the TDD's sections 9 to 33: ENCOUNTER (never defined),
ACCOUNT_CREATED (no screen) and PATTERN_SELECTED (the engine picks).

    TDD state             screen id   screen
    LAND                  S00         landing, the funnel's first page
    ENCOUNTER             S01         no screen of its own. See the note below
    SELECT_GROUND         S01         starting point
    STARTER_GIFT_ISSUED   S02         starter gift
    ACCOUNT_CREATED       S03         save, position per TDD section 7
    TUTORIAL_STARTED      S04         feeling page
                          S05         story, text and voice
                          S06         the gather, no copy
                          S07         the Mirror
                          S08         accuracy check
                          S08b        second reading, the "Not quite" path
                          S09         adjustment, text and voice
    PATTERN_SELECTED      S10         no screen. The engine picks. See S08
                          S11         somatic setup
    FIRST_RELEASE         S12         mini release
    VERIFY                S14         post-release observation
                          S15         integrity setup
                          S16         integrity question, ten times
                          S17         archetype transition
                          S18         archetype polar question, six times
                          S19         handoff
    RERUN onward          out of scope: the TDD's sections 35 to 39 are
                          pricing and practice, not first experience

**Gap 1. ENCOUNTER is named and never defined.** The TDD's section 7 lists it,
and no section describes it. Proposed: it is the moment the Field first draws
under S01, before any press. It has no screen, no string and no event of its
own. Silence is a copy decision.

**Gap 2. The "Not quite" path is named and never specified.** Section 17 gives
three paths. Section 18 specifies only Adjust. Section 44 says no behaviour is
left to inference. S08b below is my proposal.

**Gap 3. The account has a place in section 7 and none in the screens.**
Section 10 says funnel state transfers on account creation. Section 8 says the
first experience is already the application. S03 follows section 7. E2 asks the
owner whether it should.

**What the TDD leaves out that the owner has already ruled in.** The signal
test (AN7, "the one thing they do") and the check in ("Hello, Sofia", FK) are
not in the TDD's journey. This file does not put them back. If the owner keeps
them ahead of S04, the signal test's payoff line "A thought moved your body."
asserts the causation the TDD's section 20 forbids (C-2).

---

### S00. Landing

```yaml
id: S00
purpose: Say what this reads, in the person's own week, and offer one way in.
title: "Instruments for the body you are running"        # EXISTING, funnel/index.html
supporting_copy: "You are tired in a way that sleep does not fix, and the same month keeps arriving."   # EXISTING
inputs: none
actions:
  - Start
default_action: Start
validation: none
system_response: Opens S01 in the same document. No page load, no second site.
visual_response: >
  The Field draws at rest and breathes. No node yet. No figure. The existing
  seven seat spine is the only mark.
persistence: none. Nothing has been entered.
next_state: S01
alternate_paths:
  - Mission, Vision, About stay in the funnel navigation and leave the flow.
recovery: A person who returns mid flow is offered Carry on (R09), not S00.
analytics_events: [funnel_started]
```

```copy
C00.1 | Label | Instruments for the body you are running | EXISTING
C00.2 | Reading | You are tired in a way that sleep does not fix, and the same month keeps arriving. | EXISTING
C00.3 | Instruction | Start | PROPOSED
```

Notes:
- "Take the test" is the landing's shipped button. It names a hundred question
  quiz the TDD's journey does not contain. "Start" names what the button does.
  If the owner keeps the quiz as a second door, the landing carries both.

---

### S01. Starting point

```yaml
id: S01
purpose: Let the person say what brought them. This is the one decision before the first release.
title: "What brought you here?"                           # TDD section 9, required
supporting_copy: none
inputs:
  - one of twelve ground chips, single select
  - "Something else" opens one text line, optional
actions:
  - select a chip
  - change the chip
  - Next
default_action: none. No chip is preselected.
validation: >
  Next is absent until a chip is selected. "Something else" with an empty line
  is valid and records ground "unspecified". No text is refused.
system_response: >
  Records the ground. The engine maps the ground to a fixed set of axes and
  seats from the CHILD table (a lookup, deterministic, the engine seat's to
  write). Issues the gift on Next, not on the press.
visual_response: >
  The chosen chip's glyph docks at its seat on the spine in the seat colour
  and the Field answers with one brightening of that seat (NOTICE). The
  system "received an address" (TDD section 9). Changing the chip moves the
  dock and the brightening. No sound.
persistence: >
  device: ground, ground_text (only if typed). Restored on return: the chip is
  selected and Next is present.
next_state: S02
alternate_paths:
  - Leave (corner word) returns to S00. Nothing is kept.
  - Back is not offered. The chip can be changed in place.
recovery: Storage failure reports through status() (R03) and the flow continues in memory.
analytics_events: [ground_selected]
```

```copy
C01.1 | Instruction | What brought you here? | TDD
C01.2 | Label | Constant worry | PROPOSED
C01.3 | Label | Too much | PROPOSED
C01.4 | Label | Anger | PROPOSED
C01.5 | Label | Running on empty | PROPOSED
C01.6 | Label | Always tired | PROPOSED
C01.7 | Label | A loss | PROPOSED
C01.8 | Label | Fear | PROPOSED
C01.9 | Label | Someone close | PROPOSED
C01.10 | Label | Not enough | PROPOSED
C01.11 | Label | Money | PROPOSED
C01.12 | Label | No direction | PROPOSED
C01.13 | Label | Something else | TDD
C01.14 | Label | In your own words | PROPOSED
C01.15 | Instruction | Next | EXISTING
```

Where each chip comes from. The TDD lists twelve examples, not twelve required
strings ("Examples:"). Each is put in a plain word a ten year old says,
because most of them fail on sight.

    TDD example      chip               why
    Anxiety          Constant worry     a diagnosis word by itself. The chip names what happens
    Overwhelm        Too much           an abstract noun. A ten year old says too much
    Anger            Anger              kept
    Burnout          Running on empty   a clinical word. The picture is a fuel gauge
    Fatigue          Always tired       kept short. The landing's longer line is
                                        "tired in a way that sleep does not fix"
    Grief            A loss             grief is a state. A loss is the event
    Fear             Fear               kept
    Relationships    Someone close     an abstract plural noun, which the label rule bans
    Self-worth       Not enough         a trait word, and a verdict. The chip is what is said in the head
    Money            Money              kept
    Purpose          No direction       an abstract noun
    Something else   Something else     TDD, kept

Why the swap matters beyond the ten year old rule: "Anxiety" and "Burnout" are
condition words. A condition word beside a release is a claim to mitigate a
condition, and `reviews/LEGAL-floor.md` section 1 says that is where a product
leaves the general wellness policy. The chips are the person's own picture of
what is happening. Never a finding.

---

### S02. Starter gift

```yaml
id: S02
purpose: Issue the allowance and say what a pattern is, once, on demand.
title: "Your first 100 patterns are ready."               # TDD section 10, required
supporting_copy: none on the page. One Definition one door away (C02.3, C02.4).
inputs: none
actions:
  - Next
  - press the number to open the Definition
default_action: Next
validation: none
system_response: >
  Writes StarterGift {selected_ground, granted, remaining=granted, issued_at,
  status=issued}. The pattern_ids[] set is the engine's selection for the
  ground. Nothing is spent yet.
visual_response: >
  One ring, drawn at the seat the ground docked to, with one tick per pattern
  granted, in the seat colour. This is the allowance. As ground opens, ticks go
  dark. It is a finite budget, which CO-05 allows as a count: "92 patterns left
  of the hundred." No hundred separate nodes: that would be decoration.
persistence: >
  device: StarterGift. Restored on return as issued, not transferred.
next_state: S03
alternate_paths:
  - Leave returns to S01 with the chip kept.
recovery: Storage failure reports through status() (R03).
analytics_events: [starter_gift_issued]
```

```copy
C02.1 | Value | Your first 100 patterns are ready. | TDD
C02.2 | Value | {ground} | PROPOSED
C02.3 | Definition | A pattern is one line you release, at one place in your body. | PROPOSED
C02.4 | Definition | Opening a pattern for the first time uses one of the {granted}. Running it again costs nothing. | PROPOSED
C02.5 | Instruction | Next | EXISTING
```

Notes:
- **"Personalized" cannot be said.** The gift is chosen from one chip. The
  instrument has read nothing yet. Nothing on this screen says the set was
  chosen for the person, only for the ground. `DESIGN-firstrun.md` Q11 puts
  it exactly: "a question that pretends to personalise is a claim the
  instrument cannot back."
- **Open question, not asked in section E:** the TDD's StarterGift carries
  `pattern_ids[]` and `remaining`. A set of 100 chosen patterns and an
  allowance spent on any ground are two different products
  (`DECISIONS.md`: "Only ground opened for the first time spends the gift or
  the tier").
  The copy above reads the allowance version. If it is a fixed set, C02.4
  changes.

---

### S03. Save

Position follows the TDD's section 7 (ACCOUNT_CREATED before TUTORIAL_STARTED).
E2 asks whether it should move to after S08.

```yaml
id: S03
purpose: Turn the funnel state into a record the person can open again.
title: "Save your 100 patterns."                          # PROPOSED
supporting_copy: one Definition, the disclosure owed (C03.4). Variant by E2.
inputs:
  - Email, required
  - First name, optional
actions:
  - Save
default_action: Save, when Email is a valid address
validation: >
  Email must parse. A bad address is refused by name, never corrected in
  silence (R10). First name is never required.
system_response: >
  Creates the account, moves StarterGift and the ground into it, sets
  transferred_at, and greets by first name if given ("Hello, Lance." on S04's
  entry, OB4). No export. No import (TDD section 10).
visual_response: >
  The ring from S02 locks to the corner and its ticks stay. No celebration.
persistence: >
  record: account, StarterGift (transferred), ground. device: the same, until
  the record confirms.
next_state: S04
alternate_paths:
  - Leave returns to S02. Nothing is created.
  - Sign in for a returning person opens the record and resumes (R09).
recovery: >
  A failed save keeps every field filled and says what failed (R04). The
  person is never sent back to S01.
analytics_events: [account_created, tutorial_started]
```

```copy
C03.1 | Instruction | Save your {granted} patterns. | PROPOSED
C03.2 | Label | Email | PROPOSED
C03.3 | Label | First name | PROPOSED
C03.4 | Definition | Your email opens this record again. What you write is stored with it. | PROPOSED
C03.4b | Definition | Your email opens this record again. What you write stays in this browser. | PROPOSED
C03.5 | Instruction | Save | PROPOSED
```

Notes:
- C03.4 and C03.4b are the two answers to E2. The one that ships must be true
  of the build on the day. A disclosure that outruns the code is a lie.
- How the account signs in is outside this review. If it is a link by email,
  nothing here changes. If it is a password, one Label changes and nothing
  else.

---

### S04. Feeling page

```yaml
id: S04
purpose: Move from naming a topic to noticing what is present.
title: "What are you feeling today?"                      # TDD section 11, "possible primary prompt"
supporting_copy: none
inputs:
  - one line of text or voice, state 1
  - a second line, state 2, after state 1 is answered
actions:
  - Next
  - Record (voice, same control as S05)
default_action: Next
validation: >
  Both lines may be empty. An empty page is a valid answer and is recorded as
  "not answered". No refusal. The person is never told a feeling is required.
system_response: >
  Keeps the two answers verbatim. The second answer is the only source of the
  Mirror's cause slot (S07). Nothing is interpreted on this screen.
visual_response: >
  The Field breathes. As words are typed, the words the table recognises are
  highlighted in place in the person's own text (the highlight layer the story
  surface already has, `ui/storyui.js`). No card, no number, no address appears
  yet. "A card that flickers between Fear and nothing while somebody is still
  writing is a reading nobody can trust" (funnel/quiz.html, "READING WAITS FOR
  THE BUTTON").
persistence: >
  device or record per E2: feeling_text, feeling_how_text. Restored on return
  with both lines filled.
next_state: S05
alternate_paths:
  - Leave returns to S03 or S02 per E2. Text is kept.
recovery: A failed save reports (R03). The text stays on screen.
analytics_events: [feeling_submitted]   # PROPOSED event. The TDD's list has none for this screen. No text in the event.
```

```copy
C04.1 | Instruction | What are you feeling today? | TDD
C04.2 | Instruction | How does that feeling run through you? | TDD
C04.2b | Instruction | Where do you feel it in your body? | PROPOSED
C04.3 | Menu | Record | EXISTING
C04.4 | Instruction | Next | EXISTING
```

Notes:
- **C04.2 names no place.** V4: "Every sensation line names a place." The TDD
  says the exact copy "can be tuned during implementation", so C04.2b is
  offered. The Mirror's Where slot reads best off an answer that names a
  place, and the engine already reads place words in text.
- **Input is free text, not a list.** `TASKS.md` SIG5: "We all feel it
  differently and the words we would use will be different." A feelings list
  hands over a vocabulary before the person has felt anything.
- **Two prompts, one screen, two states.** Not two screens. OB1.

---

### S05. Story, text and voice

```yaml
id: S05
purpose: Take a real story in the person's own words, typed or spoken.
title: "Tell us what’s off."                              # TDD section 12, required. Fails the mirror rule, see C-5 row 2.
supporting_copy: >
  Two lines, both disclosures owed, both HS-permitted: the voice line (C05.5)
  when Record is chosen, and the safety line (C05.6) always.
inputs:
  - text box
  - Record (voice)
actions:
  - type
  - Record, then press again to stop and keep what was heard
  - Next
default_action: Next, present only when the box holds text
validation: >
  Next is absent while the box is empty. The way through is on the screen:
  the box and Record. No refusal string is needed (R01: silence). Text is
  never truncated. If a ceiling exists, it is refused by name with the limit.
system_response: >
  Stores the original story byte for byte. On Next, runs the table reader once
  (parseStory, sniffStory) and moves to S06. Voice and text are one input:
  what Record hears is placed in the box and can be edited before Next.
visual_response: >
  The person's own words light in place as they are typed or heard. The Field
  breathes. Signals gather as marks at their seats, faint, with no label. The
  gather is the words lighting, not a reading.
persistence: >
  device or record per E2: story_original (immutable), story_edits. Voice audio
  is never stored by us. The audio itself reaches the browser's speech service
  (C05.5), which is why the line is on the screen and not in a tooltip.
next_state: S06
alternate_paths:
  - Record, then the browser refuses the microphone: R02, and typing continues.
  - Leave returns to S04. The story is kept on device.
recovery: >
  Storage failure: R03, and the story stays on screen. Browser closed mid
  story: restored from device on return, with Carry on (R09).
analytics_events: [story_submitted]   # carries length class and mode (text or voice), never the text
```

```copy
C05.1 | Instruction | Tell us what’s off. | TDD
C05.1b | Instruction | Write what happened. | PROPOSED
C05.2 | Label | What happened, and where you felt it. | EXISTING
C05.3 | Menu | Record | EXISTING
C05.4 | Menu | Recording | EXISTING
C05.5 | Definition | Recording sends the audio to your browser’s speech service. Typing does not leave this device. | EXISTING
C05.6 | Definition | Nobody reads this but you. If you are not safe, call or text 988 in the United States, or your local emergency number. | EXISTING
C05.7 | Instruction | Next | EXISTING
```

The states of the input, which S05 and S09 share.

    state             what is on the screen                           what the person can do
    empty             the box and Record. No Next                     type, or press Record
    typing            the person's words light in place               type, Record, Next
    asking            the voice line (C05.5) is visible before the    press Record again to go on,
                      microphone opens                                or type instead
    recording         the Recording label and a clock in the button   press again to stop
    heard             the words are in the box, editable              edit, Record again, Next
    refused           one of the four shipped refusals (R02)          type, or allow the microphone
    saved             nothing. A confirmation clears after 2.4 s      nothing
    failed to save    R03, and the text stays                         copy the text, try again

Notes:
- **C05.6 is drafted, ruled for this place, and unbuilt.** `reviews/LEGAL-floor.md`
  Block C: "One line, under the story composer, permanent and not a popup."
  Its first sentence is true only if the story stays on the device. Under E2
  answers A or B it changes to "Nobody is reading this as you write." E3 asks.
- **"Two equivalent input modes" are not equivalent.** The TDD's section 12.
  Typing stays on the device. Recording sends the audio to a vendor. The
  ruling of 19 September says the control states this "in one line before the
  microphone opens". Today it lives in a `title` attribute, which a phone
  cannot reach. On first run it must be on the screen when Record is chosen.
- **"Tell us" is the only "we" in the product.** `ui/onboard.js` already struck
  "We walk you through you" for it: "a guide claim and it is the only place in
  the product that speaks as we." This product is a mirror, not a guide.
- **"What’s off" presupposes a fault and is two things.** The TDD uses the same
  four words for the story prompt (S05) and for the correction prompt (S09).
  A string that is two is a string that is wrong.

---

### S06. The gather

```yaml
id: S06
purpose: Hold the person while the reader runs, and show that the words were taken.
title: none. Silence is a copy decision.
supporting_copy: none
inputs: none
actions: none. A press anywhere does nothing.
default_action: none
validation: none
system_response: >
  sniffStory returns in milliseconds. The screen exists so the Field can settle
  (TDD section 19, "When enough information exists, the Field should settle
  into the Mirror state"). It never waits on a spinner: the table reader
  computes in under 100 ms, and an indicator for a 20 ms operation is a lie
  about effort (UX skill).
visual_response: >
  The faint marks from S05 pull toward one another by seat (PATTERN) and
  steady. Where the reader found nothing, the marks do not settle. They stay
  where they were and the screen moves to S07 in its UNKNOWN state.
persistence: story_signal v1 written, with the reader's working kept (the
  parsed hits), because a reading that discards its own evidence cannot be
  audited.
next_state: S07
alternate_paths: none
recovery: A reader error is a build defect. It reports through status() and returns to S05 with the story kept.
analytics_events: [story_signal_generated]   # carries counts only: hits, axes, seats
```

What the shipped reader returns, measured on 1 October 2026 against `engine.js`
at HEAD `b4b9e5c` (md5 prefix `d8f3892fd6b4`, a build product). Read this before
believing the TDD's Mirror example.

    text                                             what came back
    "I keep taking care of everybody else."          nothing. No hit, imprint, axis or saboteur
    + "I am overwhelmed and my chest is tight."      "overwhelmed" at the solar seat, "chest is
                                                     tight" at the heart. Anger at the celiac plexus
                                                     8.8, Sad at the pericardial nerve 8.0. Every
                                                     imprint inferred. No saboteur
    + "I am afraid things will fall apart ..."       Fear at the lumbar plexus 5.2 joins. Five
                                                     saboteurs. The first is Loner at 0.77, which
                                                     is the opposite of "taking care of everybody
                                                     else"
    "My father died last year and I am exhausted."   Sad at the heart 9.2, Apathy 8.7

Three things follow, and each changes the design:

- **The TDD's own story reads as nothing.** The Mirror must have an honest
  UNKNOWN state, because on a short true sentence it will be the common one.
- **The engine reads "overwhelmed" as Anger.** A person who writes "overwhelmed"
  is likely to meet "reads as anger" and say "Not quite". The Mirror will be
  rejected often on a single adjective, which is why S08b and S09 are first
  class screens and not edge cases.
- **A single sentence about a death reads 9.2 of 10.** A weight that high, on
  one line, printed to a stranger, is the "precision over recall" warning in
  `engine/sniff.js` turned against a grieving person. The first run Mirror
  prints no weight (S07).

---

### S07. The Mirror

```yaml
id: S07
purpose: Give back what the table found, in the person's own words, and say what it did not find.
title: none. The labels are the heading. COPY.md: a section never explains itself.
supporting_copy: >
  One Reading sentence (C07.8 or C07.9), one Definition one door away (C07.11),
  and the short form (C07.12) wherever a reading prints.
inputs: none
actions:
  - open the Definition
  - Next, which opens S08
default_action: Next
validation: >
  Slots print only what the engine holds. A slot the engine cannot fill prints
  a dash. Nothing is written to fill a slot. A slot never changes its label.
system_response: >
  Renders from story_signal v{k}. The engine holds: the person's words
  (marksOf quotes), an adjective from the lexicon, a seat, a plain place (CHILD
  .loc) when a place was stated, one of nine axes, a saboteur name above a
  confidence floor, and a weight. It holds no relationship, no cause and no
  tag. See the slot table below.
visual_response: >
  MIRROR. The marks that settled in S06 converge on one seat of the Body
  figure, drawn at line weight, and the Field keeps the same seat lit. The
  three representations the TDD asks for (summary, body map, animation) are
  the Reading sentence, the Body mark, and the axis motion in D. Same signal,
  three drawings.
persistence: >
  device or record: story_signal v{k} with its slot values and, per slot,
  whether it was stated, matched or inferred. Restored on return.
next_state: S08
alternate_paths:
  - Nothing found (UNKNOWN): the screen shows the person's words only, the
    refusal C07.10, and Next returns to S05 with the text kept.
recovery: none needed. The state is derived and can be recomputed.
analytics_events: [mirror_shown]   # PROPOSED. Carries which slots were filled, not their values.
```

The slot table. TDD section 15 asks for ten things. The table says what fills
each one, and which cannot be filled honestly.

    TDD item                    first run slot     source                        printed
    Story Tag                   Pattern            saboteur name above the       the name and one line (V9),
                                                   confidence floor              or a dash
    Story Snippet               You said           the person's words, quoted    verbatim, in quotes
    Quality / Adjective         Feels like         a lexicon adjective that is   the person's word, or a dash
                                                   in the text
    Intensity                   Weight             the weight                    NOT printed on first run.
                                                                                 The arc only. See below
    Cause / Experience          (no slot)          the S04 second answer         shown as the person's own
                                                                                 words under You said, or not
                                                                                 shown. Never written by us
    Body location               Where              a stated place, else seat     stated: the place. inferred:
                                                   only                          the seat, never an address name
    Relevant relationships      (no slot)          none. No engine field         not shown (below)
    Color                       the seat colour    PAL, by seat                  drawn, never named
    Visual pattern              the Body mark      the seat and axis             drawn
    Animation                   the axis motion    the table in D                drawn

    Reads as                    Reads as           one of the nine axes          the axis word

Why Weight is not printed on first run. Three reasons, in order:

1. **The ruling is not made.** `SKILL.md` V22: "until he makes it, no surface
   prints a node state", and a bare weight is flagged as a bare figure (CO-30).
   The TDD's "Intensity: 8" is a bare figure and a count against a total
   (CO-05, CO-06).
2. **It would be wrong.** One sentence about a death reads 9.2 (S06).
3. **The first run precedent already exists.** `DESIGN-firstrun.md` T1 prints
   "12 found, all under the line for now", a count of what was found, never
   set against a total.

Why there is no relationship slot. The shipped engine has no relationship
field. A relationship the reader did not read would be invented. If the owner
wants relationships, they arrive only from the person, in S09, kept verbatim and
never interpreted.

Why Where prints two ways. `ui/storyui.js` and `funnel/quiz.html` already
carry the rule, learned from a corpse: "My father died last year" was told
Martyrdom, so an inferred imprint earns no card and no address name. A stated
place ("my chest") is printed as the person's place. An inferred one prints the
seat only, with the word it came from one door away.

```copy
C07.1 | Label | You said | PROPOSED
C07.2 | Label | Feels like | PROPOSED
C07.3 | Label | Where | PROPOSED
C07.4 | Label | Reads as | PROPOSED
C07.5 | Label | Pattern | PROPOSED
C07.6 | Label | Weight | PROPOSED
C07.7 | Value | {snippet} | PROPOSED
C07.8 | Reading | You said {place}. Your words read as {axis} there. | PROPOSED
C07.9 | Reading | Your words read as {axis}. The nearest place in the body is your {loc}. | PROPOSED
C07.10 | Refusal | Nothing in that matched a place in the body yet. Say where you felt it, or what it did. | PROPOSED
C07.11 | Definition | A table matches your words to places in the body. Atüned is in alpha, so a reading can move as the tables are corrected. | PROPOSED
C07.12 | Definition | A reading, not a diagnosis. This is not medical care. | EXISTING
```

Notes:
- **C07.11 is the limit, admitted once.** W3. It also carries the owner's alpha
  ruling (`DESIGN-funnel-welcome.md` screen 4). The TDD never mentions alpha.
- **"Reads as" is a verb about the table, not about the person.** Brief
  section 5: "You may be avoiding confrontation because..." not "You are afraid
  of confrontation." The sentence says what the words did.
- **The Pattern slot carries its three things** (V9): the name from the
  saboteur table, one line of what it does, and the way out one door away. The
  lines already exist (`SABDEF`, `AV_IMPACT`). None is authored here.
- **Words on the frame:** C07.8 and C07.12 are the only prose. Both fit OB13.

---

### S08. Accuracy check

```yaml
id: S08
purpose: Let the person say whether the reading fits. A rejection is information.
title: "Does this feel accurate?"                         # TDD section 17, required
supporting_copy: none
inputs: one of three answers
actions:
  - That’s it
  - Not quite
  - Adjust
default_action: none. Enter and Escape do nothing here. Silence is not a confirmation.
validation: none. All three are valid and none is preselected.
system_response: >
  That’s it: marks story_signal v{k} confirmed. The engine selects the release
  patterns (S10, no screen) from the confirmed signal and opens S11.
  Not quite: marks v{k} rejected with route "next reading" and opens S08b.
  Adjust: marks v{k} rejected with route "adjust" and opens S09.
visual_response: >
  TEST. The reading draws as two paths, the one shown and the next ranked, both
  pressable at 44 by 44 or more. CONFIRM on That’s it: the stroke stops moving,
  turns solid and the ring closes. Not quite: CONTRADICTION, the path parts and
  the shown one dims, kept and not removed.
persistence: >
  every version of the signal, each answer, and the route taken. Nothing is
  overwritten (TDD section 47).
next_state: S11 on That’s it. S08b on Not quite. S09 on Adjust.
alternate_paths:
  - Leave keeps the signal unconfirmed. On return, this screen again.
recovery: >
  A person who leaves with the reading unconfirmed returns to this screen,
  never to S11. Nothing runs on an unconfirmed reading.
analytics_events: [story_signal_confirmed, story_signal_rejected]
```

```copy
C08.1 | Instruction | Does this feel accurate? | TDD
C08.1b | Instruction | Does this fit? | PROPOSED
C08.2 | Menu | That’s it | TDD
C08.3 | Menu | Not quite | TDD
C08.4 | Menu | Adjust | TDD
```

Notes:
- **Three answers collide with OB2, one button forward.** Treat the three as
  one control with three answers and no primary style. The forward button is
  That’s it. The other two are not forwards, they are corrections.
- **"Accurate" is already a reading in this product.** `compute.js` returns an
  accuracy figure and Analytics prints it. Two meanings of one word. C08.1b is
  offered. "Fit" is also physical.
- **No default.** An Enter key that confirms a reading is a consent nobody gave.

---

### S08b. Second reading (the "Not quite" path)

```yaml
id: S08b
purpose: Offer the next ranked reading without asking the person to explain anything.
title: none
supporting_copy: none
inputs: one of three answers, same control as S08
actions: [That’s it, Not quite, Adjust]
default_action: none
validation: none
system_response: >
  Shows the next ranked reading from the same sniffStory result: the next axis
  by shadow, the next saboteur by confidence. At most two more are shown. When
  none is left, the next press of Not quite goes to S09 with no string.
visual_response: >
  CONTRADICTION. The previous path stays dimmed beside the new one so the
  person sees both. UNKNOWN is a dashed stroke: `BIBLE.md`, "A dashed border
  means pending or inferred."
persistence: reading_index per version, each answer, each rejection.
next_state: S11 on That’s it. S09 on Adjust or when no reading is left.
alternate_paths: none
recovery: as S08
analytics_events: [story_signal_rejected]   # carries route, never text
```

No copy. The slot labels are S07's, unchanged. A slot keeps its label.

---

### S09. Adjustment, text and voice

```yaml
id: S09
purpose: Let the person say what did not fit, and re-read it.
title: "Tell us what’s off."                              # TDD section 18, required. Same string as S05. See C-5 row 2.
supporting_copy: none
inputs: text box, Record
actions: [type, Record, Next]
default_action: Next, present only when the box holds text
validation: Next is absent while the box is empty. The way back is Leave.
system_response: >
  Reads the correction with the same table reader. Slots the correction
  addresses are replaced. Slots it does not address stay. The diff is shown
  (C09.2). The correction text is kept verbatim as its own record. Then S08.
visual_response: >
  CONTRADICTION then CONFIRM: the old path dims and is kept, the new path draws
  and steadies. Nothing flashes. The changed slots are outlined once.
persistence: >
  correction text (immutable), signal v{k+1}, the diff. The first reading is
  never deleted.
next_state: S08
alternate_paths:
  - After three rejections without a confirm, offer Next past the release
    (C09.5), which goes to S15 and records release_skipped.
recovery: >
  A reading that never gets confirmed does not run. The person's words are
  kept. Nothing is lost and nothing is claimed.
analytics_events: [story_adjustment_submitted, story_signal_updated]
```

```copy
C09.1 | Instruction | Tell us what’s off. | TDD
C09.1b | Instruction | What part does not fit? | PROPOSED
C09.2 | Reading | Changed: {slots}. | PROPOSED
C09.3 | Refusal | Nothing in that changed the reading. Say where you felt it, or what it did. | PROPOSED
C09.4 | Refusal | Nothing is confirmed yet, so there is nothing to release. | PROPOSED
C09.5 | Instruction | Next | EXISTING
```

Notes:
- **C09.1b is the brief's own line.** `CREATIVE-BRIEF-voice.md` section 10:
  "Let's back up. What part doesn't fit?" The brief's "I may have connected
  those two patterns too quickly" is not used, because it speaks as "I", and
  nothing in this product does.
- **A release never runs on an unconfirmed reading.** The TDD's section 40 names
  RELEASE_REJECTED and gives it no recovery. This is it.

---

### S11. Somatic setup

S10 is not a screen. The engine picks the release patterns from the confirmed
signal: the offer's addresses, heaviest first, up to the number computed for the
run and never more than the allowance holds.

```yaml
id: S11
purpose: Say what is about to happen and what to notice, before the release starts.
title: "Welcome to a somatic experience. Turn your senses inward."   # TDD section 20. Fails V1 (hard) and V4. See C-5 row 1.
supporting_copy: three short lines, C11.2 to C11.4, under the OB13 floor of 25 words
inputs: none
actions: [Next, Leave]
default_action: Next
validation: none
system_response: >
  Computes {n}, the number of lines in the run, from the patterns picked. Shows
  the lines. Opens S12 on Next. If the engine holds nothing to release (E4),
  the screen carries the practice label (C12.10) and S12 runs as practice.
visual_response: >
  An 8 second settle with the ring closing once, the OB13 answer: the prose is
  read inside a wait that has to happen anyway. HELD: the located mark rests,
  ring tight. Reduced motion: the ring steps.
persistence: somatic_setup_started flag and {n}. Restored on return: this screen.
next_state: S12
alternate_paths:
  - Leave returns to S08 with the reading kept.
recovery: >
  A person who feels unwell on this screen has Leave, always visible, in the
  corner. No confirmation. No loss.
analytics_events: [somatic_setup_started]
```

```copy
C11.1 | Instruction | Welcome to a somatic experience. Turn your senses inward. | TDD
C11.2 | Instruction | Sit down. Feet on the floor. | PROPOSED
C11.3 | Definition | You will read {n} short lines from what you wrote. | PROPOSED
C11.4 | Instruction | Notice pressure, heat, weight, tingling, movement, or nothing. | PROPOSED
C11.5 | Instruction | Next | EXISTING
C11.6 | Menu | Leave | PROPOSED
```

Notes:
- **How the TDD's "no required sensation" is met without a reassurance line.**
  "Or nothing" is in the list of things to notice (C11.4). That is explicit, it
  is short, and it answers a fear this very instruction raised. A sentence
  saying nothing is required would be V12, and OB6 struck its cousin.
- **"The system first explains what the user is about to do."** C11.3 does:
  how many lines, and where they come from.
- **C11.2 is shipped copy.** `ui/onboard.js`: "Sit down. Put both feet on the
  floor." It names a position a body can take (V2).
- **The words the TDD lists as possible experiences** (Pressure, Density,
  Relief, Movement, Activation, No noticeable sensation) become Pressure, Heat,
  Weight, Tingling, Movement, Easing and Nothing. Heat, pressure, tingling and
  weight are the product's own glossary words for Charge. "Density" and
  "Activation" fail the ten year old rule.

---

### S12. Mini release

```yaml
id: S12
purpose: Run a short, linear release over the confirmed signal, read continuously.
title: "I am releasing believing, thinking, feeling, behaving, acting."   # TDD section 21, required. See C-4 for the ruling it collides with.
supporting_copy: none
inputs: none
actions:
  - Pause
  - End
default_action: none. The run advances at the product's own reading pace.
validation: >
  The run may start only on a confirmed reading. If nothing is held above the
  line, it starts as practice or does not start (E4).
system_response: >
  Speaks the head once, then {n} lines, one pattern each, at the pace the
  release surface already uses. The clock reads minutes and seconds and falls,
  and is replaced by the measured pace after four lines (DESIGN-release: "The
  clock does not lie"). Sound and haptics are off by default. On the last
  line, the cooldown (C12.6, C12.7). End jumps to the cooldown and never
  leaves an address open.
visual_response: >
  RELEASE. HELD at the top, CONTRACTED during the head, RELEASING one gate and
  one line at a time, OPENING at the last line, SETTLING in the cooldown,
  OBSERVING at the end. See D for the mapping. No particles. No green. No tick.
persistence: >
  release_run: lines read, ended_early (yes or no), practice (yes or no),
  timestamps. Restored on return: S12 does not resume mid run. It resumes at
  S11 with the reading kept.
next_state: S14
alternate_paths:
  - End: cooldown, then C12.8, then S14.
  - Pause: holds on the current line.
recovery: >
  A refusal (C12.11) returns to S09 with the story kept. A run left by closing
  the tab is recorded as release_abandoned and resumes at S11.
analytics_events: [first_release_started, pattern_released, first_release_completed]   # plus release_ended_early and release_refused, PROPOSED
```

```copy
C12.1 | Instruction | I am releasing believing, thinking, feeling, behaving, acting. | TDD
C12.1b | Instruction | I am letting go of believing, perceiving, thinking, behaving, acting, and feeling that I am afraid. | EXISTING
C12.1c | Instruction | I am letting go of believing that I am afraid. | PROPOSED
C12.3 | Menu | Pause | EXISTING
C12.4 | Menu | End | EXISTING
C12.5 | Label | Left | EXISTING
C12.6 | Instruction | Stop the work. Stay where you are. | EXISTING
C12.7 | Instruction | Notice which place answers. | EXISTING
C12.8 | Instruction | Open your eyes. Look at the room. | PROPOSED
C12.9 | Definition | The opposite of {axis}, at this place, is {opp}. | PROPOSED
C12.10 | Refusal | Practice. This one writes nothing to your profile. | PROPOSED
C12.11 | Refusal | Your story put too little weight on one place to release yet. Add one more thing that happened. | PROPOSED
```

Notes:
- **The TDD's line is a stem with no object.** "I am releasing believing,
  thinking, feeling, behaving, acting." has no state in it. The shipped
  statement ends in one. `engine/data/cards.js` builds it from `C3_STEM`: "I am
  letting go of believing, perceiving, thinking, behaving, acting, and feeling
  that I am", then the state, and its own comment says "Nothing else may spell
  the channels out." C12.1b is that sentence with one state, "afraid", as a
  sample. The TDD says the language "begins" with its line, so it is read as
  the head, said once, and the lines that follow each name one pattern. Which
  wording the head takes is C-4.
- **Two things the cooldown must not say.** The book's "The charge moves up the
  channel and out through the mouth" is a physiological claim and stays out of
  first run. And the book's warning stands: "The released address is open
  territory until the coherent opposite is installed; whatever frequency the
  system encounters first will fill the space." C12.9 names the opposite from
  the engine's own table (CHILD), once. The reframe half is still open
  (`DESIGN-release.md` question 3), and so is the line it speaks.
- **C12.11 replaces a shipped refusal for first run only.** The shipped line,
  "Nothing is held above the line yet, so there is nothing to release.", uses
  "the line", which is a word a person has not been given.

---

### S14. Post-release observation

```yaml
id: S14
purpose: Ask what the person noticed, without scoring them and without interpreting the answer.
title: "Feel what is here now."                           # PROPOSED. Echoes the TDD's driving word, section 24
supporting_copy: none
inputs:
  - chips, multi select: Pressure, Heat, Weight, Tingling, Movement, Easing, Nothing
  - one text line, "Something else", optional
  - state 2, after state 1: where attention was, one of three
actions: [select, deselect, Next]
default_action: Next, always present
validation: >
  Nothing is a chip, not an absence. It is a complete answer. An empty page is
  also a complete answer and is recorded as "not answered". No answer is ever
  corrected or refused.
system_response: >
  Echoes the person's answer back as stated (C14.7, C14.8) and writes
  nothing else. It does not say what the answer means. It does not say the
  pattern is confirmed. It does not say anything changed. This is VERIFY.
visual_response: >
  OBSERVING. The Body mark from S07 sits beside the person's report: before,
  the place the words reached. After, the place the person says, if they said
  one. If they said nothing, the after half is an empty ring labelled Nothing.
  No number moves. No colour improves.
persistence: >
  device or record: observation {chips, text, attention}. Restored on return.
next_state: S15
alternate_paths:
  - Leave goes to S15 with the observation recorded "not answered".
recovery: none. There is no wrong answer to refuse.
analytics_events: [post_release_observation]   # carries chip enums, never the text
```

```copy
C14.1 | Instruction | Feel what is here now. | PROPOSED
C14.2 | Instruction | What did you notice? | PROPOSED
C14.3 | Label | Pressure | PROPOSED
C14.4 | Label | Heat | PROPOSED
C14.5 | Label | Weight | PROPOSED
C14.6 | Label | Tingling | PROPOSED
C14.7 | Label | Movement | PROPOSED
C14.8 | Label | Easing | PROPOSED
C14.9 | Label | Nothing | PROPOSED
C14.10 | Instruction | Reflect on where your attention was while you read. | PROPOSED
C14.11 | Label | On the words | PROPOSED
C14.12 | Label | On my body | PROPOSED
C14.13 | Label | Somewhere else | PROPOSED
C14.14 | Reading | You noticed {list}. | PROPOSED
C14.15 | Reading | You noticed nothing. | PROPOSED
C14.16 | Instruction | Next | EXISTING
```

Notes:
- **How the TDD's two cases are met.** Section 24: "They may have been highly
  focused on thought. They may not have been holding the pattern strongly."
  The attention question gives each a name, "On the words" and "Somewhere
  else", without calling either a failure.
- **No measured change exists to show.** The engine's cooldown arithmetic
  lowers the held charge by a model rule when a run completes. That is a
  bookkeeping update, not an observation. The first release may not say
  anything changed. VERIFY shows the person's report beside the Mirror and
  nothing else.
- **Reflect and Feel** are the TDD's two driving words, kept as verbs in
  Instructions (C14.1, C14.10), in sentence case.

---

### S15. Integrity setup

```yaml
id: S15
purpose: Set up ten questions about how the person acts, one real moment each.
title: "Reflect on a real moment."                        # TDD section 25, required
supporting_copy: "Four lines. Two have one word changed from the TDD's. See C-5."
inputs: none
actions: [Next]
default_action: Next
validation: none
system_response: >
  Opens S16 question 1. Starts the integrity record. Writes nothing to the
  laws, the coherence reading, or the Avatar (E5, default A).
visual_response: >
  The Field stays present and quiet. The seven seats are shown as a spine with
  no fill. Each answered seat will light in its own colour, one step, with the
  same magnitude whatever the answer.
persistence: integrity_assessment_started. Restored on return: S15.
next_state: S16
alternate_paths:
  - Leave goes to S17 with the integrity record marked "not started".
recovery: none
analytics_events: [integrity_assessment_started]
```

```copy
C15.1 | Instruction | Reflect on a real moment. | TDD
C15.2 | Instruction | Think about how you actually act when this shows up in your life. | TDD edited
C15.3 | Instruction | Not how you want to act. Not how you think you should act. | TDD edited
C15.4 | Definition | The midpoint is 5. | TDD
C15.5 | Label | almost never | TDD
C15.6 | Label | about half the time | TDD
C15.7 | Label | almost every time | PROPOSED
C15.8 | Instruction | Where would you put yourself on the scale? | TDD
```

Notes:
- **One word changed in the TDD's own lines.** "Operate" becomes "act" in the two
  lines where it appears, because "operate" fails the ten year old gate.
  Everything else is the owner's.
- **Cut, with reasons in C-5:** "Most people operate somewhere in the middle."
  (unsourced, and it anchors the answer), "This isn't a test, and there isn't a
  good or bad number." (untrue once answers move the reading, OB6), "The
  highest value represents consistency, not perfection." (antithesis, and it
  calls the top of a scale a virtue), and "Be as honest with yourself as you
  can." (the instruction above already says it).
- **Scale words.** The TDD's "10 = consistently" becomes "almost every time".
  The shipped intake key reads "never, about half the time, every time", an
  earlier ruling in the owner's words. "Every time" claims perfection and
  "almost every time" does not. If the owner takes this, the intake key moves
  too. One concept, one wording.
- **Word count on this frame is over OB13.** C15.1 to C15.4 run to 35 words.
  They are the owner's own, so they stand and are flagged.

---

### S16. Integrity question (ten times)

The ten are written in section B. One screen, one question, one continuum, one
action: the TDD's section 27.

```yaml
id: S16
purpose: Ask one question about one real moment and take one position on the line.
title: the moment, then the ask. See section B.
supporting_copy: none
inputs:
  - a line from 0 to 10 in integer steps, marks at 0, 5 and 10
actions:
  - touch the line
  - move the marker
  - Next
  - Skip
default_action: none. The marker is absent until touched. It does not start at 5.
validation: >
  Any integer 0 to 10. A touch on the line is the answer. Skip leaves the
  question unanswered, which is recorded as skipped, never as 5, never as 0.
  A value outside the range cannot be entered. Nothing is clamped in silence.
system_response: >
  Writes the answer to the integrity record only. Shows the position and the
  nearest scale word (C16.5). Says nothing about the number. No praise. No
  concern. No colour change by value.
visual_response: >
  The law's own icon (the SI mark, a ring stroke, never a fill) at one size. On
  Next the seat that law sits at lights one step in its own colour. The step is
  the same size and the same duration at 0 and at 10. No celebration for a high
  answer. No punishment for a low one (TDD section 27).
persistence: >
  device or record: integrity_answers[law] = {value or skipped, framing,
  answered_at}. The answers never enter an analytics event.
next_state: S16 (next question). S17 after the tenth.
alternate_paths:
  - Back returns one question and keeps the answer. A changed answer replaces
    the value and keeps the first in history.
  - Leave goes to S17. Unanswered questions stay unanswered.
recovery: >
  Resume at the first unanswered question. The footer line is shipped copy:
  "about fifteen minutes. Stop whenever and come back." That line belongs to
  the 63 questions. It is not needed for ten.
analytics_events: [integrity_question_answered, integrity_assessment_completed]   # plus integrity_question_skipped, PROPOSED. Enums and law ids only.
```

```copy
C16.1 | Instruction | How often is this true of you? | PROPOSED
C16.2 | Menu | Skip | PROPOSED
C16.3 | Instruction | Next | EXISTING
C16.4 | Value | {value}, {word} | PROPOSED
C16.5 | Value | almost never | PROPOSED
C16.6 | Value | less than half the time | PROPOSED
C16.7 | Value | about half the time | PROPOSED
C16.8 | Value | more than half the time | PROPOSED
C16.9 | Value | almost every time | PROPOSED
```

The one table that maps a value to its word, kept in one place:

    value 0 to 1     almost never
    value 2 to 4     less than half the time
    value 5          about half the time
    value 6 to 8     more than half the time
    value 9 to 10    almost every time

This is one table so the number and the word cannot disagree (V22).

Progress. OB1 says no count of screens. `CO-05` allows two survivors: "intake
progress and release queue position". The ruling that settled the collision for
onboarding was the ring as the only progress object, with no digits. So the ten
questions carry an arc and no "3 of 10".

---

### S17. Archetype transition

```yaml
id: S17
purpose: Say that the next part is about how the person tends to act, and show what they have picked.
title: "Next, how you tend to act."                       # PROPOSED. Replaces "explain that the next section looks at how the user tends to operate", section 28
supporting_copy: >
  One Reading per case. If the person has picked archetypes, name them with
  their verbs. If not, say so.
inputs: none
actions: [Next]
default_action: Next
validation: none
system_response: >
  Reads the Avatar's archetype choices if they exist. They are authoritative
  (TDD section 28). The six questions start from them. If none exist, the six
  run from the default pairs.
visual_response: >
  The archetype marks, ring and not fill, at neutral saturation (TDD section
  30). Picked ones sit forward. Nothing is lit by a score.
persistence: archetype_assessment_started
next_state: S18
alternate_paths:
  - Leave goes to S19. The archetype record is marked "not started".
recovery: none
analytics_events: [archetype_assessment_started]
```

```copy
C17.1 | Instruction | Next, how you tend to act. | PROPOSED
C17.2 | Reading | You picked {archetypes}. | PROPOSED
C17.3 | Reading | You have not picked an archetype yet. | PROPOSED
C17.4 | Instruction | Next | EXISTING
```

Notes:
- **Where does the person pick archetypes?** The TDD says "The user has
  identified archetypes such as Warrior, Sage, Mage, Rebel" and the journey
  has no screen where they do. The Avatar page asks one thing per seat, "Say who
  you are becoming". Nothing in S00 to S16 asks for an archetype. C17.3 is the
  honest line for a person who arrives here with none.
- **"Mage" is not in the table.** `ARCH` carries Magician. One word per concept.
- **Each named archetype carries its verb** from `ARCH` ("Warrior, moves on the
  threat"), because a label this product puts on a person carries a definition
  (V9).

---

### S18. Archetype polar question (six times)

The six are written in section B.

```yaml
id: S18
purpose: Ask how the person tends to act when something happens, between two behaviours, and allow both.
title: the moment, then "do you tend to:". See section B.
supporting_copy: none
inputs:
  - a line between two poles, marker absent until touched
  - Both, as its own action
actions: [touch the line, Both, Skip, Next]
default_action: none
validation: >
  Touch records a position on the line. Both records "both", which is not the
  centre of the line. Skip records "skipped". An untouched marker is never a
  value. The person is never forced to a pole (TDD section 29).
system_response: >
  Writes the lean to the archetype record as an observed expression, dated, and
  separate from the Avatar's stated choices. It never changes the stated
  choices (authoritative). It names no archetype as the person's.
visual_response: >
  The two archetype marks of the pair sit at the poles, ring not fill. The
  pair's saturation moves by one small step toward the pole touched, and
  returns by a fixed rule over time. Both moves neither. A visual change must
  not read as a permanent identity (TDD section 30).
persistence: >
  archetype_answers[pair] = {lean, both, skipped, answered_at}. Never in an
  event.
next_state: S18 (next). S19 after the sixth.
alternate_paths:
  - Back returns one and keeps the answer.
  - Leave goes to S19.
recovery: resume at the first unanswered pair
analytics_events: [archetype_question_answered, archetype_assessment_completed]
```

```copy
C18.1 | Menu | Both | TDD
C18.2 | Menu | Skip | PROPOSED
C18.3 | Instruction | Next | EXISTING
```

Notes:
- **The tile cannot carry two sources.** The rail's archetype tile draws a disc
  with a ring, and the ring is the person's share of what the blueprint
  expresses (`ui/railtiles.js`, `r.aff[j]`). The TDD's "saturation based on
  observed language and behavior" has no field in the engine. A tile with two
  sources is two concepts on one mark. Proposed: the answers move a small arc
  segment beside the ring, never the ring.
- **The decay is open, and already recorded as open.** `CLAUDE.md`, "A seed
  decay policy": "Whether it should fade on its own, or only move when the
  person moves it, is open." The same question applies here. Until the owner
  rules, the lean does not fade and is dated.

---

### S19. Handoff

```yaml
id: S19
purpose: Show the person what just happened, in their own words and their own report, and hand them into the software.
title: none. The five labels are the heading.
supporting_copy: none
inputs: none
actions: [Go in]
default_action: Go in
validation: none
system_response: >
  Fills each row from the record. A row with nothing behind it prints a dash.
  Never a sentence that was not earned by the person. Marks the tutorial
  complete and opens the Field with the person's reading drawn, as the app
  already opens on the Field.
visual_response: >
  The five rows draw in order, each with the Field element it came from: the
  words, the mark, the path, the gates, the report. MIRROR gathers them. The
  rows are a circle that closes onto the Field, never a list with a last item.
persistence: tutorial_completed, handoff_viewed. The five rows are derived and are
  never stored as text.
next_state: the Field
alternate_paths:
  - A person who skipped the release sees "You worked with it" as a dash and the
    reason in one word, "Skipped".
recovery: none
analytics_events: [tutorial_completed, software_entered]   # plus handoff_viewed, PROPOSED
```

```copy
C19.1 | Label | You said | TDD
C19.2 | Label | Atüned noticed | TDD
C19.3 | Label | You tested | TDD
C19.4 | Label | You worked with it | TDD
C19.5 | Label | You observed | TDD
C19.6 | Value | {snippet} | PROPOSED
C19.7 | Value | {axis} at your {loc} | PROPOSED
C19.8 | Value | You confirmed it as read. | PROPOSED
C19.9 | Value | You changed it {k} times, then confirmed it. | PROPOSED
C19.10 | Value | You read {n} lines in {mm:ss}. | PROPOSED
C19.11 | Value | You ended after {j} lines. | PROPOSED
C19.12 | Value | You noticed {list}. | PROPOSED
C19.13 | Value | You noticed nothing. | PROPOSED
C19.14 | Instruction | Go in | EXISTING
```

Notes:
- **The TDD's five lines are in capitals** (`YOU SAID`, `ATUNED NOTICED` ...).
  The house has no all caps copy, and the product spells the name Atüned.
  C-5 row 9.
- **"You observed" holds the person's report and nothing else.** Never "You
  felt it work", never "change". "You tested" is the accuracy check and the
  adjustments, not a pass.
- **The integrity and archetype answers are not in the TDD's five rows**, though
  section 32 lists them among what onboarding has established. Left out here:
  the five are the TDD's mandate. If the owner wants them in the mirror, one
  more row, "You answered", with "{k} questions on how you act", and no number
  for any law.

---

### R. Refusals and failures, in one place

Every one is a Refusal: what failed, what it means, what changes it. No
apology. No exclamation. No "oops". No therapeutic language.

```copy
R02.1 | Refusal | Recording needs microphone permission. Allow it in the browser and press Record again. | EXISTING
R02.2 | Refusal | The browser blocked speech recognition for this page. | EXISTING
R02.3 | Refusal | No microphone was found. | EXISTING
R02.4 | Refusal | Nothing was heard. Press Record and speak, or type it. | EXISTING
R03.1 | Refusal | This browser would not save your words. Copy them before you leave. | PROPOSED
R04.1 | Refusal | The record did not save. Check your connection and press Save again. Your words are still on this page. | PROPOSED
R10.1 | Refusal | That does not look like an email address. Check it and press Save again. | PROPOSED
R09.1 | Instruction | Carry on | EXISTING
```

Table by id:

    R01   empty story at S05, S09     no string. Next is absent and the box is the way through
    R02   microphone                  the four shipped lines, `ui/storyui.js`
    R03   a local write failed        status(), and the text stays on screen
    R04   the record did not save     status(), fields stay filled
    R05   nothing matched             C07.10, at S07
    R06   a correction changed nothing  C09.3, at S09
    R07   the release refused         C12.11, at S12, first run wording
    R08   no confirmed reading        C09.4, at S09
    R09   a person returns mid flow   Carry on, the funnel's shipped word, at the screen left
    R10   a bad email                 R10.1, at S03

---

## B. The questions

### B.1 The ten integrity questions

**Why these ten.** The TDD's section 26 asks for ten, mapped to the 21 laws, and
gives no rule for choosing. This is the rule, and it is open to override.

1. **Every seat gets at least one.** The 21 laws sit at seven seats: Throat 3,
   Crown 3, 3rd Eye 3, Heart 4, Solar 4, Sacral 2, Root 2 (`engine/data/canon.js`
   `SI`). Ten answers must leave no seat dark on the Body page, so seven are
   one per seat. The other three go to Solar, Heart and the 3rd Eye, where a
   second law can be answered about without a lecture.
2. **The moment must be a body, in a room, on a day.** `SKILL.md` section 7:
   "every item is a physical event." The funnel's hundred already pass this. Each
   of the ten comes from a funnel item and from the intake stem for the same
   law, so the law key joins the engine and nothing is invented.
3. **Nothing that needs a definition first.** Unity, Nature and Detachment fail
   the ten year old test on the law's own name.
4. **Nothing that lands as an accusation on minute eight.** Non-Harm is the
   hardest to answer cold, and the easiest to answer 10 to.
5. **Heaviest in the middle, light at the end.** Root to Crown, which is
   `BANDS` order. Accountability and Forgiveness land fourth and sixth. The ten
   end on Awareness, which is the thing the product itself exercises.
6. **Mixed framing.** The shipped intake reads each law three ways: "When it
   costs you something", "When nobody would know", "On an ordinary day". Four
   of the ten use cost, two use unseen, four use ordinary. One framing per law
   is all that fits in ten questions, and it cannot give the intake's "spread".
   See E5.

**What the ten cover.** Patience, Temperance, Courage, Accountability,
Compassion, Forgiveness, Truth, Humility, Presence, Awareness.

**What the other eleven are, and why they wait.**

    Transparency      overlaps Truth at the same seat. Its moment is a hidden life, which is
                      too heavy this early
    Justice           a dilemma, not a moment. The owner's beggar and two kids examples
                      (CLAUDE.md, round JQ) are the format for it, and they are unbuilt.
                      The shipped stem is a seat's own phrase, and the first thing to overrule
    Unity             fails the ten year old test on its own name
    Equanimity        overlaps Patience and Awareness
    Nature            fails the ten year old test on its own name
    Generosity        two sided (giving and receiving). It needs two questions
    Aesthetic Beauty  assumes a making life, which not every reader has
    Duty              overlaps Accountability at the Solar seat
    Responsibility    overlaps Accountability at the Solar seat
    Detachment        fails the ten year old test
    Non-Harm          see rule 4. Reserve question below

**Reserve, if the owner wants a law in.** Non-Harm and Justice, written to the
same shape, not in the ten.

```copy
QR1 | Instruction | You know exactly what would hurt them, and you could say it. | PROPOSED
QR1a | Instruction | How often do you take the option that costs them least? | PROPOSED
QR1b | Label | I say the accurate cruel thing because it is accurate. | PROPOSED
QR1c | Label | I take the option that costs them least. | PROPOSED
QR2 | Instruction | Two people you know are in a dispute, and one of them is a friend. | PROPOSED
QR2a | Instruction | How often do you give each what is actually theirs? | PROPOSED
QR2b | Label | I take my friend's side before I have heard the other. | PROPOSED
QR2c | Label | I weigh it the same both ways. | PROPOSED
```

**How each is built.** One moment, one ask, and the 0 and 10 ends as two
concrete behaviours. The 0 end is a line from the funnel's hundred. The 10 end is
its lawful pair. The 5 stays "about half the time". `intakeui.js` records the
owner's ruling: "a scale nobody has calibrated is not a measurement, it is a
mood." The ends make the scale a calibration.

```copy
Q01 | Instruction | You are early and ready. The person you are waiting for is not. | PROPOSED
Q01a | Instruction | How often do you wait without it leaking onto them? | PROPOSED
Q01b | Label | It leaks onto them almost every time. | PROPOSED
Q01c | Label | It almost never leaks. | PROPOSED
Q02 | Instruction | It is late. Nobody is watching. You have had enough. | PROPOSED
Q02a | Instruction | How often do you stop? | PROPOSED
Q02b | Label | I stop when it is gone. | PROPOSED
Q02c | Label | I stop at enough. | PROPOSED
Q03 | Instruction | There is one conversation you keep putting off. Having it will cost you something. | PROPOSED
Q03a | Instruction | How often do you walk toward it? | PROPOSED
Q03b | Label | I get near it and stop. | PROPOSED
Q03c | Label | I have it. | PROPOSED
Q04 | Instruction | You break something that was yours to look after. Somebody else is about to take the blame. | PROPOSED
Q04a | Instruction | How often do you say it was you, out loud? | PROPOSED
Q04b | Label | I let them believe it broke itself. | PROPOSED
Q04c | Label | I say it was me. | PROPOSED
Q05 | Instruction | Somebody close to you tells you their pain. | PROPOSED
Q05a | Instruction | How often do you feel it with them before you try to fix it? | PROPOSED
Q05b | Label | I start fixing it so I do not have to feel it. | PROPOSED
Q05c | Label | I feel it with them first. | PROPOSED
Q06 | Instruction | Somebody wronged you years ago. Nobody would know if you kept holding it. | PROPOSED
Q06a | Instruction | How often do you put it down? | PROPOSED
Q06b | Label | I forgive out loud and take it back in private. | PROPOSED
Q06c | Label | I put it down, and it stays down. | PROPOSED
Q07 | Instruction | Somebody asks for a yes. Your chest tightens, because the true answer is no. | PROPOSED
Q07a | Instruction | How often do you say the true thing? | PROPOSED
Q07b | Label | I say yes and carry it. | PROPOSED
Q07c | Label | I say no. | PROPOSED
Q08 | Instruction | Somebody tells you something true about yourself, and it stings. | PROPOSED
Q08a | Instruction | How often do you hear it out before you answer? | PROPOSED
Q08b | Label | I go looking for what is wrong with them. | PROPOSED
Q08c | Label | I hear it out. | PROPOSED
Q09 | Instruction | You are with somebody you love. | PROPOSED
Q09a | Instruction | How often are you all the way in the room with them? | PROPOSED
Q09b | Label | I am somewhere else the whole time. | PROPOSED
Q09c | Label | I am here. | PROPOSED
Q10 | Instruction | The same argument starts again. | PROPOSED
Q10a | Instruction | How often do you catch the moment you walked into it? | PROPOSED
Q10b | Label | I cannot find the moment I entered it. | PROPOSED
Q10c | Label | I catch it as I go in. | PROPOSED
```

How one question reads on the screen, with the three marks. This is Q01 and
Q07. The labels at 0 and 10 are the question's own. The label at 5 is the same
on every question.

    Q01  Patience
         You are early and ready. The person you are waiting for is not.
         How often do you wait without it leaking onto them?

         0                          5                           10
         |--------------------------|----------------------------|
         It leaks onto them         about half                   It almost
         almost every time          the time                     never leaks

    Q07  Truth
         Somebody asks for a yes. Your chest tightens, because the true answer is no.
         How often do you say the true thing?

         0                          5                           10
         |--------------------------|----------------------------|
         I say yes and              about half                   I say no
         carry it                   the time

The marker is absent until touched. After a touch the screen adds one value,
the number and its word, "7, more than half the time" (C16.4), and nothing else.

The ten, as a table.

    #   law             seat      framing   funnel item it comes from        intake stem it joins
    1   Patience        Root      ordinary  Patience, "early, ready, furious"    wait without leaking
    2   Temperance      Sacral    unseen    Temperance, "You stop when it is gone"   stop at enough
    3   Courage         Solar     cost      Courage, "get near it and stop"      move toward what you are avoiding
    4   Accountability  Solar     cost      Accountability, "believe it broke itself"   name it out loud to someone
    5   Compassion      Heart     ordinary  Compassion, "start fixing it"        feel it without fixing it
    6   Forgiveness     Heart     unseen    Forgiveness, "take it back in private"   put it down
    7   Truth           Throat    cost      Truth, "say yes while your chest tightens"   say the true thing
    8   Humility        3rd Eye   cost      Humility, "look for what is wrong with them"   let the world be more right than you
    9   Presence        3rd Eye   ordinary  Presence, "somewhere else the whole time"    stay in the room with what is happening
    10  Awareness       Crown     ordinary  Awareness, "cannot find the moment you entered it"   notice what you are doing while you do it

Notes:
- **Direction.** Every ask is written so that 10 is the lawful behaviour. This is
  the shipped intake's direction ("how often do you STEM"). The funnel's hundred
  go the other way: they are written as the violation, scored inverted, "never
  is ten, always is nought", and `funnel/questions.js` says why: "A personality
  item asks what kind of person you are and gets back the person somebody wants
  to be." The TDD's own scale makes 10 the virtue, so the risk is flattery. The
  mitigation is the 0 end: it is the funnel's own violation line, a thing that
  happened in a body, which a person can recognise.
- **The Humility stem is a seat's phrase, not the owner's.** `engine/intake.js`:
  "They are mine rather than his, so they are the first thing to overrule." Q08
  does not use it. The moment and the ask are from the funnel item.
- **The ten answers cannot go through the intake's scorer.** `iqScore` returns a
  law only when all three framings are answered, and calls a spread under 3
  "inside self-report noise". One answer per law is below the engine's floor. E5.

### B.2 Six archetype polar questions

All PROPOSED, all flagged. The TDD gives two examples, which are rows 1 and 2.
The pairings are mine. No source pairs these twelve. They come from the
archetype table's own verbs (`ARCH`, `v`), the way they are used in
`AV_DEF`. The owner decides every pair.

    #   pair                      the moment                                       pole A              pole B
    1   Warrior and Sage          "When something needs to change, do you tend to:"   Act immediately    Understand it deeply first
        TDD example                                                                  (TDD)               (TDD)
    2   Warrior and Magician      "When faced with resistance, do you tend to:"       Push through       Find another way around it
        TDD example                                                                  (TDD)               (TDD)
    3   Rebel and Innocent        "Somebody hands you a rule you did not make."      Push back on it    Take it as given and go
    4   Everyman and Explorer     "You walk into a place where everyone already      Stay with the      Go and look at
                                   knows each other."                                 group              what is past it
    5   Caregiver and Creator     "You have one free hour."                          See who needs      Make the thing you have
                                                                                      something          been meaning to make
    6   Ruler and Jester          "The room goes tense and nobody speaks."           Set the order      Break the tension

**What each pole is.** Each pole is the archetype's own verb, said as a thing a
person does: Warrior moves on the threat, Sage reads the situation, Magician
changes the conditions, Rebel refuses the frame, Innocent takes it at face
value, Everyman stays with the room, Explorer goes to the edge, Caregiver
attends to the other, Creator makes the thing, Ruler orders the field, Jester
breaks the tension. All `ARCH` `v` strings.

**Lover is not asked.** Lover ("closes the distance") has no clean opposite in
the table. Warrior is asked twice because I read both of the TDD's examples as
Warrior poles.

**Every question carries Both and Skip.** Both is its own action: it records
"both", and it is not the centre of the line. Skip records "skipped". An
untouched line is never a value. The TDD, section 29: "Do not force false
binaries."

```copy
P1 | Instruction | When something needs to change, do you tend to: | TDD
P1a | Label | Act immediately | TDD
P1b | Label | Understand it deeply first | TDD
P1h | Instruction | Something has to change. Do you tend to: | PROPOSED
P1ha | Label | Act first | PROPOSED
P1hb | Label | Work it out first | PROPOSED
P2 | Instruction | When faced with resistance, do you tend to: | TDD
P2a | Label | Push through | TDD
P2b | Label | Find another way around it | TDD
P2h | Instruction | Something pushes back. Do you tend to: | PROPOSED
P2ha | Label | Push through | PROPOSED
P2hb | Label | Find a way around | PROPOSED
P3 | Instruction | Somebody hands you a rule you did not make. Do you tend to: | PROPOSED
P3a | Label | Push back on it | PROPOSED
P3b | Label | Take it as given and go | PROPOSED
P4 | Instruction | You walk into a place where everyone already knows each other. Do you tend to: | PROPOSED
P4a | Label | Stay with the group | PROPOSED
P4b | Label | Go and look at what is past it | PROPOSED
P5 | Instruction | You have one free hour. Do you tend to: | PROPOSED
P5a | Label | See who needs something | PROPOSED
P5b | Label | Make the thing you have been meaning to make | PROPOSED
P6 | Instruction | The room goes tense and nobody speaks. Do you tend to: | PROPOSED
P6a | Label | Set the order | PROPOSED
P6b | Label | Break the tension | PROPOSED
```

The question for the owner on pairs is not asked in section E, because the
pairs change nothing in the design. It is flagged here. If he wants no pairs
that are not his, the six questions come from the Avatar page's own prompts.

---

## C. Safety and claims audit

Rules audited against: `CLAUDE.md` Voice, `COPY.md`, `SKILL.md`,
`CREATIVE-BRIEF-voice.md`, `reviews/LEGAL-floor.md`, `COPY-OBJECTIONS.md`, and
the TDD's own section 48, "Must not happen". A TDD line is quoted, with its
section, then judged.

### C-1 No medical claims, no diagnosis

    #    the TDD line                                           verdict
    1    (absent) no crisis path, no "not medical care" line    GAP. See below
    2    section 13 example, "Cause / Experience: Fear that     FAILS pass 1. A motive written in the
         things will fall apart if I don’t handle them."        person's voice. The snippet is "I keep
                                                                taking care of everybody else." Nobody
                                                                said fear. The engine returned nothing on
                                                                that sentence (S06)
    3    section 13 example, "Quality: Overwhelmed" and          FAILS. Neither word is in the snippet.
         "Story Tag: Over-responsibility"                       The reader finds words in the text. The
                                                                tag is not in the saboteur table
    4    section 15, "The Body Map should show where the        OVERSTATES. The engine places by the
         user experiences it."                                  person's words, a stated place or a seat.
                                                                It does not know where a person
                                                                experiences anything
    5    section 16, the map "communicates density,             ALLOWED if the motion comes from the axis
         movement, contraction, pressure"                       table (D), labelled as the pattern's, never
                                                                as the person's sensation
    6    section 9, grounds "Anxiety", "Burnout", "Grief",      RISK. A condition word beside a release is
         with "100 patterns ... relevant to the selected        a claim to mitigate. LEGAL-floor section 1
         starting ground"                                       says that is where the wellness policy ends.
                                                                S01 swaps to plain words
    7    section 21, "The release is an experiential            HOLDS. Keep it. The shipped cooldown line
         exercise. Do not describe it as a medical              "The charge moves up the channel and out
         treatment."                                            through the mouth" does not hold it. Out of
                                                                first run
    8    section 32, "Observed Change"                          OVERSTATES. One release is one report.
                                                                Name it "Reported"
    9    section 40, RELEASE_SUCCESS and RELEASE_NO_EFFECT      Internal names, but they leak into
                                                                analytics and into copy. "No effect" calls a
                                                                person's "Nothing" a failure, which section
                                                                24 forbids. Rename (below)
    10   section 37, "results-as-a-service ... purpose-based    INTERNAL. Keep out of the UI. OB15
         impact product"
    11   the funnel's landing today: "the leak shows up as     OUTSIDE THE TDD, INSIDE ITS ROOM. Section 6:
         mental, physical and spiritual disease."              "The funnel is the first room of the
                                                                product." A disease claim in that room.
                                                                `funnel/index.html`

**1. The gap.** Two blocks of copy are drafted in `reviews/LEGAL-floor.md` and
neither is built. A grep of `atuned_src/` and `funnel/` finds no "988" and no
"not medical care". The TDD takes a story from a stranger, spoken or typed.
Measured against the shipped reader on 1 October 2026:

    "I do not want to be here anymore."                    no axis, no seat, no offer. Read as nothing
    "I want to end my life. I feel hopeless and numb."    Sad 8.8, Apathy 5.2. The offers are releases:
                                                           Sad to "Happy / Restoration", Apathy to
                                                           "Joy / Aliveness"

A person who writes the second line is met by a Mirror and an offer to run a
release. This is the strongest finding in this file. It needs no word list to
fix: it needs one permanent line where the person writes (E3).

The drafted line, `LEGAL-floor.md` Block C: "Nobody reads this but you. If you
are not safe, call or text 988 in the United States, or your local emergency
number." The short form for wherever a reading prints, Block A: "A reading, not
a diagnosis. This is not medical care." Both are in the copy blocks above.

**Rename the release states.** Internal names, so that nothing leaks.

    RELEASE_SUCCESS     completed
    RELEASE_PARTIAL     ended_early
    RELEASE_REJECTED    reading_rejected
    RELEASE_ABANDONED   abandoned
    RELEASE_CONFUSED    confused
    RELEASE_NO_EFFECT   reported_nothing

"Success" is defined by finishing, not by effect, and the name should not say
otherwise.

### C-2 A sensation is never proof

The TDD, section 20: "Do not tell the user that a particular sensation proves
that a pattern exists." The design holds it in these places:

- S11 lists "nothing" among the things to notice. S14 makes Nothing a chip.
- S14 echoes the report as stated and never says what it means.
- S19 labels the row "You observed" and fills it with the person's words.
- S12's visual states never use a success colour or a tick.

One place it does not hold. The shipped signal test, which the TDD omits, ends
on "A thought moved your body." and "That is the whole idea." That is a
causal claim read off one sensation, and the TDD forbids it. If the signal test
stays ahead of S04, its payoff line has to change.

### C-3 High scores are not morally superior. Low scores are not failure.

The TDD's section 26 closing and section 27. The guards below are all
structural, because the one sentence the TDD offers is untrue.

1. **No tier word on ten answers.** The shipped intake already withholds the
   band: "The band is named once all 21 are in".
2. **No sum, no mean, no total.** A count against a total invites a pass or a
   fail (CO-05). The ten answers are never added.
3. **Same magnitude at every value.** The step that lights a seat is one size,
   one duration, one colour at 0 and at 10.
4. **No praise.** The product reads a nervous system and may not say "nice".
   Praise from an instrument is a reading it did not take. `SKILL.md` section 4,
   the game seat's blind spot.
5. **The answers do not move the Avatar's visible improvement.** `CLAUDE.md`:
   "A person watches their avatar improve and the improvement is driven by
   releases and by going through the loop." If self-report moved it, answering 10
   would buy a better Avatar. That is both a moral ranking and a reason to
   flatter. E5.
6. **The scale's top is not named for a virtue.** "Almost every time" and not
   "consistently" (S15).
7. **0 is a place on a line, not a verdict.** No word is attached to it but the
   scale word.

And the TDD's sentence that is untrue: "This isn't a test, and there isn't a
good or bad number." In this product there is one. Integrity feeds coherence,
and coherence is read in ten ranked bands from Collapsed to Mastery
(`TIERDEF`). `engine/compute.js`: CQ is Ig times It over Rz. If ten answers
reach the laws, the sentence is false the moment they land. If they do not
(E5, default A), it is true and does not need to be said. Either way it does not
ship as written. It is also the line the owner struck twice: OB6, "we have not
set anything up that would make a person think they were being graded, so
denying it plants the idea", and the intake heading "This Is Accuracy, Not
Judgment", struck for denying "a judgement nobody raised".

### C-4 "Release", "letting go" and the open ruling

Four wordings are in play for one mechanic. All four are quoted.

    the brief          "Canonical language: use 'release the charge,' not 'let go of the
                       charge.'"                                  CREATIVE-BRIEF-voice.md section 4
    the ruling         "believe, I'm letting go of believing, perceiving, thinking, behaving,
                       acting, feeling. Those are the channels we're using."
                                                                  DECISIONS.md, round CB, 26 September
    the shipped stem   "I am letting go of believing, perceiving, thinking, behaving, acting, and
                       feeling that I am", then the state
                                                                  C3_STEM, engine/data/cards.js
    the TDD            "I am releasing believing, thinking, feeling, behaving, acting."
                                                                  section 21

The open question is already recorded. `COPY-SWEEP-FINDINGS.md`, question 1,
with three ways it could go. This file does not reopen it. It adds what the TDD
brings to it:

1. **A third verb.** "Releasing" is neither the brief's imperative nor the
   ruled "letting go of".
2. **Five channels, not six.** The TDD drops "perceiving" and moves "feeling"
   from last to third. The ruling says six, in order. `C3_VERB` in
   `engine/data/cards.js` is built to it and says of itself "Nothing else may
   spell the channels out." The Field draws six gates at the core
   (`ui/wheel.js`, "SIX GATES at the core"). A five gate statement leaves one
   drawn gate unspoken.
3. **No state.** The shipped stem ends "that I am" and takes the state the
   address holds, "afraid", "angry". The TDD's line stops after the gates.
   Read aloud, it asks a person to release believing, thinking and feeling,
   with no thing in them.
4. **Five gates on day one.** The book starts with one. `DESIGN-release.md`
   quotes it: "Month 1: letting go of believing only. Month 2: letting go of
   believing, thinking, and feeling. Month 3 and beyond: full ten-gate chain."
   The same file reads the graduated entry as "so the full chain is not the
   opening position". The TDD's five are more than month 2.
5. **It does not read aloud.** "Releasing believing" is two gerunds in a row.
   Say it: "I am releasing believing". Then say "I am letting go of believing".
   The second is a sentence a person can say in their head eleven times.
   Rhythm is not decoration.

**Recommendation, and it is the owner's call.** Keep Release as the name of
the mechanic, its button and its heading. COPY.md round GS ruled it: "Release is
the word, and a release empties a story." Keep the shipped stem for the
sentence a person says. That is option 2 in the findings file, "The brief
governs the product's voice, the protocol keeps the book's". Cost, as it
records: two verbs near one mechanic. Row C12.1b is that sentence. Row C12.1c is
the book's first month, "believing" only, if the owner wants a graduated first
release. The TDD says "Use this formulation consistently unless the product
owner changes it." This asks him to change it, and does not change it.

### C-5 Every place the TDD's own copy fails the voice gate, quoted, with a fixed line

"Gate" is `check.py --line`, run on 1 October 2026. "Judgment" is a rule the
gate cannot read, named by its number. A fixed line is a proposal.

    #   failing line (TDD section)                            gate or rule             fixed line
    1   "Welcome to a somatic experience. Turn your senses    gate: preamble (hard).   "Sit down. Feet on the floor. Notice
        inward." (20)                                          V4: "inward to where".   pressure, heat, weight, tingling,
                                                               OB4: "Welcome" goes.     movement, or nothing."
                                                               V21: "somatic             (S11, C11.2 to C11.4)
                                                               experience"
    2   "Tell us what’s off." (12 and 18)                      judgment: the product  S05: "Write what happened."
                                                               is a mirror and does   S09: "What part does not fit?"
                                                               not speak as "we"
                                                               (`ui/onboard.js`); V6,
                                                               one string in two
                                                               jobs; "off" presupposes
                                                               a fault
    3   "Think about how you actually operate when this        gate: abstract-word      "Think about how you actually act when
        shows up in your life." (25)                           (hard), "operate"        this shows up in your life."
    4   "0 = I almost never operate this way" (25)             gate: abstract-word      "almost never"
        "5 = I operate this way about half the time"           (hard) on the second     "about half the time"
        "10 = I operate this way consistently"                 and third                "almost every time"
    5   "Most people operate somewhere in the middle." (25)    gate: abstract-word      cut. No fixed line. It is an
                                                               (hard). Judgment: pass   unsourced figure about people,
                                                               1, unsourced, and it     and the scale already marks the
                                                               anchors the answer       middle
    6   "This isn’t a test, and there isn’t a good or bad      gate: passes.            cut. Made true by structure
        number." (25)                                          Judgment: OB6, V12,      (C-3), not by a sentence
                                                               pass 1
    7   "The highest value represents consistency, not         gate: passes, but the    cut. The scale's third label
        perfection." (25)                                      antithesis rate is      already says what a 10 is
                                                               100 per cent on this
                                                               line. Judgment: it
                                                               names the top of a
                                                               scale as a virtue
    8   "You’re assessing yourself against the moments        judgment: V21,           "Answer for the moments you have
        you’ve actually lived." (25)                           "assessing" and          actually lived."
                                                               "against"
    9   "YOU SAID", "ATUNED NOTICED", "YOU TESTED", "YOU       gate: caps (hard) on     "You said", "Atüned noticed", "You
        WORKED WITH IT", "YOU OBSERVED" (33)                   all five                 tested", "You worked with it", "You
                                                                                        observed"
    10  "FEEL" and "REFLECT" (11 and 24)                       judgment: caps. The      "Feel what is here now." and
                                                               gate passed both        "Reflect on where your attention
                                                               one word lines. It       was while you read."
                                                               reads sentences, and
                                                               the rule stands
    11  "You’ve worked through this ground. There is more     judgment: pass 1.        "You have used all 100 patterns. New
        to explore." (38)                                      "Worked through"         ground takes a plan."
                                                               claims a life topic is
                                                               finished
    12  "Mirror → Test → Change" (1)                           judgment: two names      do not print it. If the three words
                                                               for the loop. The        are wanted, they are the handoff rows
                                                               ruled loop is a circle,  (S19)
                                                               "never a list"
    13  "Mage" (28)                                            judgment: V14. The       "Magician"
                                                               table says Magician
    14  "Intensity: 8" (13 and 15)                             judgment: V8, V22. A     label "Weight". The arc only, until
                                                               bare figure, and a       the node state is ruled (S07)
                                                               third word beside
                                                               weight, charge, load
    15  "Story Tag" (13 and 15)                                judgment: V14. DESIGN-   label "Pattern"
                                                               tags: "The word tag is
                                                               already taken by the
                                                               codex"
    16  "Density", "Activation" (20)                           judgment: V21            "Weight", "Tingling"
    17  "Self-worth", "Purpose", "Relationships" (9)           judgment: COPY.md,       "Not enough", "No direction",
                                                               "Abstract nouns as       "Someone close"
                                                               headings"
    18  "Does this feel accurate?" (17)                        judgment: "accurate"     "Does this fit?"
                                                               is already a reading
                                                               in Analytics
    19  "Fear that things will fall apart if I don’t handle   gate: passes.            no fixed line. The slot is filled
        them." (13, the example's cause)                       Judgment: pass 1, an     only from the person's own words
                                                               invented cause, "Do      (S04's second answer), else it is a
                                                               not invent a cause" in   dash
                                                               the brief section 10

The fixed lines that are not already a row in section A or B, in the gate's
own format so they were run too:

```copy
F1 | Instruction | Answer for the moments you have actually lived. | PROPOSED
F2 | Instruction | You have used all {granted} patterns. New ground takes a plan. | PROPOSED
```

What the gate did not catch, and the judgment rows are the ones that matter:
the antithesis in the section 25 copy taken as a group (two "Not how you ..."
lines and "consistency, not perfection"), V12 on the section 25 supporting copy
as a block, and every pass 1 failure. None of those has a pattern.

### C-6 Where the TDD collides with a standing ruling

The collision is named and the ruling wins until the owner says otherwise. Each
row says what this file did.

    #   the TDD                                    the ruling                                     what the screens did
    1   section 17, three answers                  OB2, one button forward                        one control, three answers (S08)
    2   section 20, "Welcome to"                   OB4, V1                                        S11 starts on the act
    3   section 25, "not a good or bad number"     OB6, V12; the intake heading struck            structure instead (C-3)
    4   sections 25 to 27, one question at a time  OB1, no count of screens                       an arc, no digits (S16)
    5   section 12, voice "equivalent" to text     the ruling of 19 September, the disclosure     the line on the screen (S05)
                                                   "in one line before the microphone opens"
    6   sections 10 and 47, preserve and move      the funnel's "Nothing you write leaves this    E2
        the story                                  browser, and it is not saved"; CLAUDE.md,
                                                   "Storage is still the person's own browser
                                                   for everything except the quiz record";
                                                   DECISIONS.md, "The thing that leaves the
                                                   device is the story itself"
    7   section 1 and 33, "Mirror, Test, Change"   CLAUDE.md, the loop is a circle, "never a    not printed (C-5 row 12)
        and a five step handoff                    list"
    8   section 21, five channels                  DECISIONS.md round CB, six channels            C-4
    9   section 37, "results"                      OB15, "At no point are we talking about        internal only
                                                   results or purpose"
    10  section 31, integrity conditions the       CLAUDE.md, the Avatar improves by releases     E5
        Avatar
    11  section 4, "no human figures"              the Body page, the aura, the Avatar            D-2
    12  the journey has no signal test             AN7, "the signal test is the one thing they    flagged, not restored
                                                   do"

### C-7 What the TDD gets right, kept as written

Not everything is a finding. These hold and the screens keep them.

- "Experience first. Evidence second. Explanation third." (section 1)
- "Do not claim certainty when the system is interpreting." (13)
- "The user must be able to reject the interpretation. The system must treat
  rejection as meaningful information." (17)
- "Do not force the user to accept the first interpretation." (18)
- "Do not use celebratory animation for high scores. Do not use punitive
  animation for low scores." (27)
- "Sight is not for sale. New ground is." (37). A line a person can say out
  loud, with a noun they can touch.
- "No user input should be silently discarded." (47)

---

## D. The visual grammar, as a table

### D-1 Event, element, motion, renderer

"Renderer" is the existing surface that draws it. Field is `ui/wheel.js` and
`ui/rings.js` (the Wheel, Frames and Dial views). Body is `ui/map.js`. Compass is
`ui/cone.js`. Where none of the three can carry it, the row names the surface
that does. Durations are proposals to tune on the build. Under reduced motion or
Quiet, every motion becomes a step: the state changes, nothing sweeps. The pace
of a ritual is the one place pace is kept, because pace is the exercise.

    TDD event       Field element                       motion                           renderer
    SIGNAL          one address mark appears at its     fades in over 240 ms at its      Field. The story surface's
    node appears    seat, in the seat colour, a dot     seat radius. No travel, no       highlight layer lights the
                    and not a glow                      flare                            words first (`ui/storyui.js`)
    NOTICE          an already drawn mark brightens     one rise, held 400 ms, back to   Field
    node brightens  by its amount                       its level
    CONNECT         a thin stroke forms between two     draws along its length over      Field. It already carries
    line forms      marks that share a pattern          500 ms, then rests               bowed curves between
                                                                                         addresses
    CONTRADICTION   one stroke becomes two bowed        splits over 400 ms. The          Field. The Compass's
    paths diverge   curves ending at different          discarded path dims to 30 per    two pole axes are the same
                    addresses                           cent and stays, kept             geometry, see D-3
    TEST            both ends take a ring outline,      outline in over 200 ms, 44 by    Field. Hit targets are the
    paths become    pressable at 44 by 44 or more       44 or more                       Field's own HIT array
    selectable
    CONFIRM         the chosen stroke goes from         animation stops, stroke goes     Field
    path stabilizes animated to solid and the ring      solid, ring closes over 300 ms.
                    closes                              No flare, no tick
    UNKNOWN         a dashed stroke ending in an open   none. It rests. A dashed         Field. `BIBLE.md`: "A
    path remains    ring                                border means pending or          dashed border means
    open                                                inferred"                        pending or inferred"
    PATTERN         marks of one axis drift toward      drift 6 px toward their          Field. The atoms and pulses
    repetition      their centroid, density rises       centroid over 600 ms, once       that run on the shadow wave
    gathers                                             per new hit
    RELEASE         the core's six gates part, one      each gate opens as its line is   Field for the gates (`SIX
    structure       per line, and the address ring's    read. The ring's dash lengthens  GATES at the core`). The
    loosens         dash lengthens                      with each line                   words are `ui/release.js`
    CHANGE          a held mark's open arc moves to a   one transfer over 600 ms, from   Field. The nine axes already
    state           ring that closes: held becomes      the shadow arc to the ring       carry a held charge and an
    reorganizes     installed                                                            installed opposite
    VERIFY          the Mirror's mark and the person's  two marks side by side, same    Body. The same seat on the
    before and      report side by side, or an empty    size, the one at the place the   figure twice
    after           ring labelled Nothing               words reached, the one the
    separates                                           person reported
    MIRROR          the marks converge on a seat of     converge over 600 ms, then       Field gathers, Body holds.
    system gathers  the figure and the five slots       rest                             The slots are S07's
    what it has     appear
    observed

The six release states, which the TDD lists as one progression:

    HELD         the located mark at rest, ring tight                        Field
    CONTRACTED   the ring draws once to its smallest during the head        Field
    RELEASING    one gate parts and one line is read, repeated              Field gates, release surface text
    OPENING      the last gate opens, the ring's dash is at its longest     Field
    SETTLING     motion slows to still over the cooldown                    Field
    OBSERVING    the mark rests. S14 asks                                   Field, then Body for VERIFY

The nine axes and the motion each carries, for the Mirror's "animation shows how
the pattern operates". This is a table, one place, so the motion cannot drift
from the axis. It states what the pattern does, never what the person feels.
All PROPOSED. A person who writes "overwhelmed" and sees the Anger motion (the
shipped reader reads it as Anger) is exactly who presses Not quite, so the
motion has to be mild enough to survive being wrong.

    Fear          tightens inward, a short pulse
    Anger         presses outward against its ring
    Shame         folds toward its lower edge
    Disgust       pushes away from the centre
    Apathy        thins and dims, slowly
    Shock         one flash, then still
    Sad           sinks, slow
    Surprise      one small rise
    Anticipation  leans forward by one step

### D-2 "No human figures" against the Aura person

The TDD, section 4: "Do not use: Human figures as decorative elements." And
"Artificial glowing effects that do not communicate state."

The words that matter are "decorative" and "do not communicate state". The
product has four human forms and a glow. They do different jobs.

    what it is                              where                               job
    the Body figure, a silhouette           `ui/map.js`, `BODYPATH` in          carries location. Every address has a
    with 112 addresses placed on it         `engine/data/figure.js`             real place on it
    the aura, a radial wash behind it       `ui/map.js` `pm-aura`; the Field's  data. `BIBLE.md` section 3.10: "The
                                            `drawAura` in `ui/wheel.js`         aura is the one atmosphere, and it is
                                                                                data": the accent at the centre,
                                                                                wider with coherence, seat colour in
                                                                                the corners by DQ
    the Avatar's person mark and masks      `ui/avatarui.js` `AV_IC.person`;    the Avatar is "the centrepiece"
                                            `ui/character.js`                   (CLAUDE.md)
    the standing figure, seven seats        `obFigure` in `ui/onboard.js`       the boot's own figure, reduced
    on a spine

**The "Aura person" is read here as the Body figure with its aura wash.** If it
means another surface, the finding holds for any figure that carries location.

Where it conflicts.

1. **Literal reading.** The Body page is a human silhouette by construction.
   The TDD's section 16 asks for the "existing Body visual language" and, in the
   same breath, "not simply display a static human body illustration". A body
   map that shows where something sits has to be a body.
2. **The aura on a first run.** It passes the TDD only while it carries data. On
   a blank profile it carries none: `DESIGN.md` law 5, "never print a percentage
   off a default", as `DESIGN-integrity.md` quotes it. An aura drawn on S01 to
   S06 is decoration and breaks section 4. It stays off until S07, and it draws
   from the story signal only.
3. **The Avatar.** The TDD's section 31 makes the Avatar the destination. It is a
   figure. The ban cannot be literal.

**Recommended rule.** The ban holds for decoration. A figure that carries
location or state may stay.

- S00 to S06: no figure. The standing spine of seven seats, no outline.
- S07 and S14: the Body silhouette at one line weight, ring not fill, no face,
  no skin tone, no fill. The located address is the only mark on it.
- S19 onward: the Avatar, once the person has something in it.
- The aura appears at S07 from the signal, and carries data or does not show.

**This is not one of the five questions** because it changes how the TDD is
read and not what is built. It is flagged here for the owner.

### D-3 Two more notes on the visual language

- **The Compass carries religious names.** `engine/data/compass.js` pairs
  Jesus with Lucifer, Buddha with Geryon, Moses with Set. The TDD bans
  "religious imagery". The Compass's two pole axes are the right geometry for
  the archetype polar questions, a line, two ends, a position, and the
  CONTRADICTION row. Take the geometry. Leave the names out of every first run
  screen.
- **The archetype icons are not in the left navigation.** The TDD's section 30
  says "left navigation or relevant archetype area". They sit in the Field's
  rail tiles (`ui/railtiles.js`), drawn as a disc with a ring, and the Avatar
  page. "Relevant archetype area" is the one that exists.

---

## E. Five questions that change the design

Each carries the earlier thing it is about, quoted, so nobody has to go and find
it. The ways it could go are written with what each costs. None is answered for
him. A default is named only where the screens above had to pick something to be
complete, and the default is mine.

### E1. Does the Mirror print only what the table can produce, or does a reading step write sentences?

**The quoted things.**

TDD section 13, the example:

    Story Snippet:  "I keep taking care of everybody else."
    Quality:        Overwhelmed
    Intensity:      8
    Cause / Experience:  Fear that things will fall apart if I don’t handle them.

And the promise the funnel welcome's draft makes, drafted and not shipped,
`DESIGN-funnel-welcome.md` slide 2: "The words you write are matched to the
addresses by a table. No language model reads them."

And `ATUNED-architecture-security-review.md`: "The current v950 Source AI
interface is not yet a live LLM system."

**What I measured.** The shipped reader returns nothing on that example
sentence. With "overwhelmed" and "my chest is tight" added it returns Anger at
the celiac plexus and Sad at the pericardial nerve, all inferred. It never
returns the sentence in the Cause slot. It has no relationship field.

**Three ways it could go.**

- **A. Table only.** The Mirror prints the person's words, their own adjective,
  a place, an axis, a saboteur name with its line, and the S04 second answer
  as the cause in the person's own words. Cost: the Mirror reads as less
  magical for Angela on a short story, and nothing writes "fear that things will
  fall apart". Gain: every sentence is true of the engine, the file stays one
  file with no network, and the promise "no language model reads them" holds.
- **B. A language reading step writes Cause and Relationships.** Cost: it
  breaks that promise and the single network seam in `CLAUDE.md` (a second
  seam, on the person's most private text). Every Mirror sentence becomes an
  inference that needs the brief's observation, interpretation and hypothesis
  labels (section 6), and the architecture review's own "invention check" and
  "evidence check" have to run before the sentence prints. A wrong cause
  printed to a stranger is the first thing a person rejects.
- **C. Table first, then the person writes the cause.** After S07, one optional
  line, in the person's words, kept verbatim under You said. Cost: one more
  prompt, which OB13 resists, and Angela still gets no sentence of her own.

**What it changes.** S06, S07, S09 and the whole of section A's Mirror slot
table. A is what the screens above assume.

### E2. Where does the story live, and when does the account appear?

**The quoted things.**

TDD section 47: "No user input should be silently discarded. Preserve: Original
story. Story Signal versions. User corrections. Confirmed interpretation."

TDD section 7 puts ACCOUNT_CREATED before TUTORIAL_STARTED.

The funnel's story step today, `funnel/quiz.html`: "Nothing you write leaves
this browser, and it is not saved. Close the page and it is gone." And its
door: "There is no account and no server, so nothing here can be fetched later
by anybody, including us. ... Your story is not in it."

`DECISIONS.md`, "Privacy and the snippet": "The thing that leaves the device is
the story itself, from the journal or the imprints. The name never leaves."
With its open line: "a story is free text, so a name can be inside the story.
Stripping named entities on device is the only way that holds, and it will miss
some."

`CLAUDE.md`: "Storage is still the person's own browser for everything except
the quiz record, so save failures still must be reported rather than swallowed."

**Three ways it could go.**

- **A. Account first, as the TDD orders it.** S03 sits after the gift. The story
  is typed after the account exists and is stored with the record. The funnel's
  two promises are edited on the day to say so, and S05's safety line changes to
  "Nobody is reading this as you write." Cost: an email before any payoff. The
  first-run research has Diane and James leaving at an ask placed before a payoff.
- **B. The story stays in the browser until the Mirror is confirmed, then the
  account is offered.** S03 moves to after S08. The story and answers transfer on
  Save, with the disclosure beside the button. Cost: the TDD's order changes;
  until Save, a closed tab loses the story, which the funnel today already says
  and a person has accepted; and a local save needs its failure reported.
  Gain: the first account prompt arrives with a reading the person said "That’s
  it" to.
- **C. The story text is never stored.** Only the signal is kept, the person's
  snippet is optional. Cost: section 47 is dropped, the session cannot be
  reconstructed, and "preserve user corrections" has nothing to preserve.

Whichever he rules, the two funnel sentences quoted above stop being true on
the day capture ships. The test's foot line, "This page makes no request of any
kind.", goes the same day (`DESIGN-funnel-welcome.md`, items 14 and 15).

**What it changes.** S03's position and copy (C03.4 or C03.4b), the persistence
field of every screen from S04, S05's safety line, and what an event may carry.
The screens above assume A, the TDD's order, so the file is complete without
his answer. That is my default and not a ruling.

### E3. Does the story box carry one permanent safety line, and does the somatic setup carry a stop route?

**The quoted things.**

`reviews/LEGAL-floor.md` section 4: "A product that asks a person to write about
shame, rage and despair will receive crisis disclosures. In this build nobody is
on the other end, and that fact has to be said rather than implied." And Block
C: "One line, under the story composer, permanent and not a popup:

    Nobody reads this but you. If you are not safe, call or text 988 in the
    United States, or your local emergency number."

And "Do not put this on Summary ... It belongs where a person is writing about
their life."

TDD section 20: "Welcome to a somatic experience. Turn your senses inward."

**What I measured.** "I want to end my life. I feel hopeless and numb." returns
Sad at 8.8 and an offer of a release. "I do not want to be here anymore."
returns nothing.

**Three ways it could go.**

- **A. One permanent line under the story box at S05 and S09, plus a Leave
  that is always visible and an End that opens the eyes line ("Open your eyes.
  Look at the room.") at S11 and S12.** Cost: a line on every story box. The
  owner has ruled twice against text that explains a section (HS, BA9). This is
  the fourth kind that survived the sweep, "a disclosure owed", and it is still
  text under a box for every James. Gain: the one thing that cannot be missed.
- **B. The line appears only when the engine reads a danger word set.** Cost:
  the set does not exist, a miss is the worst failure this product could have,
  and the measured example above shows the reader is blind to a passive form
  already. A false positive on a bereaved person is a second harm.
- **C. As the TDD has it, nothing.** Cost: not defensible. `LEGAL-floor.md`:
  "the one nobody regrets."

**What it changes.** S05 and S09's supporting copy, S11 and S12's exit, and
whether a release is ever offered on a reading whose words include a danger
form. The screens above assume A.

### E4. When the first story puts nothing above the line, what does the first release do?

**The quoted things.**

TDD section 21: "The system should automatically select relevant patterns from
the Story Signal. The initial mini release should contain approximately 10
relevant patterns."

TDD section 23: "First session objective: WRITE, IDENTIFY, RELEASE, PRACTICE."

`DESIGN-firstrun.md` section 0.4, measured: "on a first story the release
refuses, 'Nothing is held above the line yet, so there is nothing to release.'"
And its question Q10: "What does flow do on a first story, when the release
refuses?"

**Three ways it could go.**

- **A. It runs as labelled practice and writes nothing.** "Practice. This one
  writes nothing to your profile." The loop closes on day one. Cost: a practice
  mode on the release surface. The handoff row "You worked with it" has to say
  practice, and a person whose first "release" moved nothing may read it as a
  demo.
- **B. It waits.** The release stays closed until something crosses the line,
  usually a second story. Cost: no first release on day one, and the TDD's
  P0 "first release completion" does not happen in session one. Gain: no
  claim is made that was not earned.
- **C. The first story's commit changes so it lands over the line.** Cost: it
  moves the arithmetic. The line sits at 4 on the engine's 0 to 10 scale, it is
  his, and a first story that costs the person more than they wrote would be a
  reading the person did not give.

**What it changes.** S11, S12, S14 and S19, and the meaning of "first success"
in the TDD's section 40. The screens above assume A.

### E5. Do the ten integrity answers write to the laws and the coherence reading, or are they held as evidence only?

**The quoted things.**

TDD section 26: "The assessment should record the user's self-assessment as
evidence about how they perceive their own behavior. It is not a diagnosis. It
is not a grade." And section 25: "there isn't a good or bad number."

`ui/intakeui.js`, in the owner's own intake: "The band is named once all 21 are
in" and "a CQ of 3 printed after one law is a stranger being told they are
incoherent on the strength of a twenty first of the data."

`engine/intake.js`: a law is scored only when all three framings are answered,
and "a spread under 3 is inside self-report noise."

`CLAUDE.md`: "A person watches their avatar improve and the improvement is
driven by releases and by going through the loop above."

`DESIGN-integrity.md`: three blank values for one law, 5.5, 6 and 6.5, "Three
tiers for a person who has entered nothing."

**Three ways it could go.**

- **A. Evidence only.** The ten are stored as dated self-reports, one framing
  each. They are not written to the laws, they do not enter the coherence
  reading, they move no band and no Avatar state. The seat lights on the
  spine, and that is all they do. "No good or bad number" is true without being
  said. Cost: ten law spokes stay unlit on the Field, and the schema gains a
  field, which is his.
- **B. Write them as law values.** Ten spokes appear. Cost: coherence is then
  read over ten answered laws and eleven at the default 6, the exact thing the
  intake withholds; "no good or bad number" is false; the Avatar moves on a
  self-report, which pays a person to answer 10.
- **C. Ask the other two framings for these ten first, and write after.** Thirty
  questions before any write. Cost: it is not ten, and it is the intake.

**What it changes.** S15 and S16's persistence and visual response, S19's
optional answers row, the Field's law spokes after onboarding, and whether
integrity may move the Avatar at all. The screens above assume A.

---

## F. The voice gate, run on what I wrote

Run on 1 October 2026, from the repository root:

    python3 .claude/skills/atuned-voice/check.py --line "<string>"

What the gate cannot judge is named after the result.

The tool reads quoted strings in code. It does not read prose in a `.md` file:
run on this file it answers "no prose strings found". So every string in the
`copy` blocks above was extracted by a throwaway script and run twice, once as
`check.py --line "<string>"` and once as `check.py --brief --line "<string>"
--layer <layer>`, the layer taken from the row's bucket. The script is not
committed. The strings in tables and prose are the same strings.

Result, 1 October 2026:

    set             rows   hard failures   brief findings
    PROPOSED         156         0               4
    EXISTING          31         0               7
    TDD               30         1               5
    TDD edited         2         0               0

On the TDD's own user-facing lines, run separately, ten of forty five fail the
gate (C-5).

**The four findings on PROPOSED rows, and what was done.**

    C09.4  review, next-step     "Nothing is confirmed yet, so there is nothing to release." has
                                 no route inside it. The route is Next, beside it, which V15
                                 allows (ruled BA9). Kept
    C12.1c flag, release-language  the open ruling in C-4. It is a flag and not a stop, and the
                                 gate says so: "an owner question before it is an edit"
    C19.7  review, somatic-metric  "{axis} at your {loc}". A body word in a Value. It is the
                                 person's place and the figure's own unit. Kept
    C19.12 review, somatic-metric  "You noticed {list}." The person's own report, echoed. Kept

**Findings on rows that are not mine.** The EXISTING rows carry seven. The
landing's "You are tired in a way that sleep does not fix ..." is flagged as a
claim about who the person is (`mirror-identity`). It is shipped copy, and it is
the funnel's owner's line, so it is reported and not changed. The rest are
review prompts on shipped words (Recording, End, Carry on, two refusals) and
the release flag and a readability grade on the shipped stem, whose long words
(believing, perceiving, behaving) are canon names. The TDD rows carry the one
hard failure, "Welcome to", and four review prompts on its three answer labels
and "Both".

**Two things the tool got wrong or missed, so nobody trusts a green run.** It
passed the single words "FEEL" and "REFLECT", which break the no all caps rule,
because it reads sentences. It passed "This isn’t a test, and there isn’t a good
or bad number." and the TDD's invented Cause sentence, because no pattern reads
a claim against a reading. Both are in C-5.

**Also run:** the file has no em dash and no en dash, and it states the address
count as 112 wherever it states one. Checked by grep.

**The tissue test.** Not run on a surface, only read at a desk, which the skill
says is not running it. Each line is read as Angela (level 5, wants magic),
Derek (level 7, wants the diagnostic) and James (level 3, defended). Load a
reference profile and read it on the surface before any of this ships.

    string                                  Angela              Derek               James
    C01 chips, plain words                  stays, they are     reads "Constant     no condition word
                                            hers                worry" as soft      to be accused of
    C07.8 "Your words read as fear there."  lands                believes it. It     reads "words read as",
                                                                names the table     not "you are"
    C07.11 table limit and alpha            low interest        the line he looks   no change
                                                                for first
    C08 That’s it, Not quite, Adjust        three honest doors  wants Adjust        wants Not quite, which
                                                                                    costs him nothing
    C11.4 "or nothing"                      reads it as hers    reads it as an      reads it as no trap
                                                                instrument spec
    S16 the ends of the line                recognises herself  wants a unit        flinches at the 0 end,
                                            at the 0 end                            so no number is shown
                                                                                    until he has moved

The one place Derek and Angela cannot both be served by a line is S07's Weight
slot, and the pass order says write two strings, not one. The arc is Angela's.
The figure is Derek's and waits for the node state ruling.

**What no run can judge, and it is the part that decides.** Whether any of
these is true of the engine on a real story. Whether a ten year old understands
"leaking onto them". Whether the poles of the polar questions are the poles the
owner means. Where each sentence breaks when it is read standing up: pass 10 is
not done, and it is the owner's and the voice seat's to do, out loud.

---

## G. What was read

    ATUNED-onboarding-first-experience-TDD.md   twice, whole
    CLAUDE.md, COPY.md, DECISIONS.md (release, privacy), TASKS.md (OB and SIG)
    .claude/skills/atuned-ux/SKILL.md
    .claude/skills/atuned-voice/SKILL.md, check.py, and the brief engine's rules
        through `check.py --brief`, objections through COPY-OBJECTIONS.md
    CREATIVE-BRIEF-voice.md
    DESIGN-onboarding-narrative.md, DESIGN-onboard.md, DESIGN-firstrun.md,
        DESIGN-funnel-welcome.md, DESIGN-release.md, DESIGN-integrity.md,
        DESIGN-tags.md
    COPY-SWEEP-FINDINGS.md, reviews/LEGAL-floor.md,
        ATUNED-architecture-security-review.md (sections 21 and the Source AI note)
    atuned_src/ui/onboard.js, tutorial.js, storyui.js (voice strings),
        intakeui.js, avatarui.js, railtiles.js, map.js, wheel.js, rings.js
    atuned_src/engine/sniff.js, intake.js, outbox.js, data/canon.js,
        data/cards.js (C3_STEM), data/compass.js
    funnel/index.html, funnel/quiz.html, funnel/questions.js
    engine.js, run read-only through node, md5 prefix d8f3892fd6b4, at HEAD b4b9e5c
