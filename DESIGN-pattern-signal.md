# The Pattern Signal

What a person's own journal says about which patterns run through them, shown
on the tool side. A design, not a build. Round GO in `TASKS.md`, 27 September.

    Owner of the mechanics   Tomas Egilsson, AI director
    Prototype                proto/pattern-signal/signal.html, runnable, no
                             network, shots at 1600 and 390 beside it
    Measured with            engine.js on 27 September, the story bank
                             (sim/stories.js), the fourteen persona lines,
                             and the owner's book
    Sits beside              reviews/SPEC-source-ai.md, whose counting rule
                             it borrows

---

## His Words

> "Maybe on the left hand side, the tool side, the percent of which patterns
> are running through a person. That's fucking rad. Maybe the sniffer is
> looking for those patterns too. It's like, oh we heard a little architect,
> oh we heard a little nature, oh we heard a little sage, right, so a person
> can kind of really see the signal strength at which they run through.
> That's fucking baller. Add that as a system design, run it through, figure
> out where it needs to go."

His three examples are three different tiers, and that turns out to settle
where it goes. **Architect is a root domain, Nature is a blueprint domain,
Sage is an archetype.** Those are the three icon grids the left rail already
carries: "0 · Root Domains" (four), "1 · Blueprint Domains" (nineteen), and
the primary and secondary archetypes (twelve). He is asking for those grids
to say how much the journal carries each one.

---

## The Answer, In Six Lines

1. **It is not readable from the journal today, and that is measured.** The
   sniffer has no vocabulary for any pattern. 0 of 41 story bank lines and 0
   of 14 persona lines name one; 382 sentences of the book do. People write
   what they did, never which pattern it was.
2. **It is buildable**, the same way the 21 laws already are: a cue table per
   pattern, authored from the book, matched with the laws' own machinery
   (`lawMatch` in `engine/sniff.js`), negation included.
3. **It counts entries, not words.** A pattern is marked by how many entries
   it was heard in, the rule Source AI asks by. One hot word is not a pattern.
4. **It is not a percent until there is enough to divide.** A share of one
   entry is a hundred percent of nothing. Below a floor it reads "not heard
   yet"; above it, "heard in 3 of 5 entries" is the percent, with its
   denominator.
5. **It goes on the tool side, and there are two ways to put it there.** Both
   are drawn in the prototype, same person, same entries.
6. **It must not come from other people's stories** under the modelling ruling
   as it stands. The cue table is authored, not learned.

---

## Why It Is Not Readable Today, And What Would Make It So

The sniffer reads charge: a seat and an amount. A pattern is not a charge.
"I hold the room for everyone" places nothing today and is plainly a
Caregiver line. Mapping seats to patterns instead, every heart word counted as
a little Caregiver because Caregiver's seat is the heart, would be arithmetic
presented as a reading about somebody's character, which is the exact defect
`parseStory` was fixed for when it told a bereaved person they carried
Martyrdom. Refused.

**What would make it readable is a cue table**, and there is a precedent in
the file. The 21 laws each carry a list of cue phrases in `engine/lexicon.js`
(law 49, Nature: "have not been outside", "screens all", "under strip
lights"), matched by `lawMatch` with a negation window. A pattern table is the
same shape: per pattern, the behaviours a person would write if it were
running. The book already has the raw material: every blueprint domain in
`DOMDEF` carries a sentence of what it does ("Finds the broken thing in any
room", "Thinks in cycles rather than straight lines") and a sentence of how
it distorts.

**The cost is authoring**, 35 patterns at perhaps six to twelve cues each, and
the discipline is the lexicon's own: every cue traces to a line in the book or
stands on its own stated argument, which is `QUESTIONS.md` 0l, still open for
the lexicon itself and the same question here.

## The Counting Rule

For each pattern, over the entries a person has committed:

    heard     entries in which at least one cue for it matched
    of        entries committed
    marks     0 none, 1 heard in one entry, 2 in two, 3 in three,
              4 in four or more

A root domain is heard in an entry when any of its blueprint domains is,
because that is what a root domain is: `DOMAINS[].r` already groups the
nineteen under the four.

**Why entries and not hits.** The same reason as Source AI's rung: return is
the evidence of a pattern and heat is not. A person who writes "client" five
times in one entry has one entry about a client.

**The floor.** Shares are not shown until five entries are committed, because
at one entry every heard pattern is a hundred percent and the drawing would
be a claim the data cannot hold. Five is the proposal, not a measurement; the
honest version measures where the ranking stops moving on the cohort, which is
the next step and cheap once a real table exists.

## Where It Goes. Two Options, Drawn

`proto/pattern-signal/signal.html`. Pick a person, step the entries forward.

**Option A. On the grids the tool rail already has.** Every icon keeps its
place, and a small signal mark, four ascending bars in the pattern's colour,
rides in its corner. The ring around a tile is what the person chose.

- For: nothing new on the rail. The cognitive load finding (57 to 71 choices
  per screen) is not made worse, and the grids a person already reads gain a
  second layer.
- Against: the count lives in a tooltip, and a phone has no hover. Measured
  in `DESIGN-information.md`: 480 of 637 named things in this product already
  cannot be answered on a phone. This would add 35 more.

**Option B. A Heard list at the head of the tool rail.** Only what was heard,
strongest first, across all three tiers, each row with its marks and "3 of 5".
Chosen patterns carry a tag; chosen and not heard are named once at the foot.

- For: the count is on the screen at both widths. It answers his sentence
  directly, a ranked "we heard a little of this".
- Against: a new section on a rail that is being cut down, and a second place
  a pattern's name appears.

**The recommendation is B at the head of the rail, with A's mark added to the
grids later if B earns its place.** B is the one a phone can read.

## The Part That Needs A Ruling Before Anything Is Built

**Chosen against heard.** The personas carry their own chosen archetypes and
domain (`PEOPLE[].a1`, `a2`, `dom`), and the prototype draws both. Sofia chose
Caregiver and Sage; her journal carries Caregiver in 3 of 5 entries and Sage
in 1. That gap is the most interesting thing this feature can show, and the
most dangerous: "you said you were a Sage and your stories say otherwise" is a
judgement about who somebody is. The register ruling says the product
describes what is running and never what a person is. So the gap may be
drawn, both marks side by side, and it may not be said in a sentence.

**Source AI does not say pattern names in conversation.** His phrase "oh we
heard a little architect" sounds like Source AI speaking, and its own
specification rules that it does not use definitions. The resolution
proposed: the tool rail shows the pattern signal, as a reading a person goes
and looks at; Source AI, in the conversation, stays in place and count.

## Privacy

On the device, from the person's own entries, and nothing leaves. The cue
table is authored from the book. It may not be refined from people's stories
under the ruling as it stands: `DECISIONS.md`, "Sight by tier, ruled, and the
journal use corrected", narrows modelling to aggregating limiting belief
phrasing to refine the sniffer's lexicon. Pattern cues are not limiting
beliefs, so learning them from people's writing needs his ruling and its own
consent line.

## How It Fails, Named

- **A cue is a behaviour, and behaviours are shared.** "Payroll" is Ruler,
  Exchange and Provision at once in the placeholder table. A real table has to
  decide whether one phrase may feed several patterns, and the drawing says
  more than it knows if it may.
- **Absence reads as a finding.** A pattern nobody writes about is not a
  pattern the person lacks. That is why nothing is drawn below the floor and
  why an unheard tile is quiet, not empty.
- **Attribution and negation,** the sniffer's two known gaps, apply here
  too, and the laws' negation window is the partial answer.
- **The name collides.** "Signal" is already the onboarding signal test
  (`RESEARCH-signal.md`, `proto/signal/`). Two concepts, one word. The
  prototype's section is called Heard, which is also Source AI's label for
  what it heard in an entry, and those are the same concept at two scales:
  one entry, and all of them.

## How To Evaluate It Honestly

No labelled set exists. Three checks, all runnable without one:

1. **Against the book.** Each domain's own chapter should light its own
   domain first. A table that fails that fails before a person sees it.
2. **Against the cohort.** On the story bank, whether the ranking stops
   moving by the fifth entry, which sets the floor.
3. **Against the person's own choice.** Agreement between chosen and heard is
   a weak label and free of leakage, because the choice is made on the intake
   and never reads the journal. It is a check on the table, never a target to
   tune toward, or the feature will tell everyone what they already said.

## What Is Open, And Whose

- **Which archetypes are counted, twelve or eighteen.** The rail's grids and
  this prototype use `ARCH`, twelve. The engine also carries `ARCH18` at
  `engine/data/canon.js:239`, eighteen archetypes each paired with its
  shadow saboteur and a seat (Warrior with Controller at the solar plexus,
  Healer with Hyper-Vigilant at the heart), read today only by
  `ui/analytics.js`. Round GQ quotes him, "which one is closer to you,
  warrior sage? Well, we've got 18 more", and logged that no table matched
  eighteen; this one does. If the signal counts `ARCH18`, each archetype
  already has a saboteur the sniffer's saboteur cues can see, which is half a
  cue table for free, and the shadow half of a pattern, not its expression.
- **Option A or B**, and where on the rail. His.
- **Whether the chosen and heard gap is shown.** His.
- **The name.** Heard, or another word; signal is taken. His.
- **Whether cues may ever be learned from people's writing.** His, and it
  needs a consent line.
- **Whether the cue table traces to the book** or stands on its own. The same
  open question as the lexicon, `QUESTIONS.md` 0l.
