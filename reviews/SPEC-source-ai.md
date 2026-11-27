# Source AI: What It Reads, What It Is For, And How It Talks

The one specification of Source AI. Two rulings, in the order he gave them.

- **20 September, what it reads and what it is for.** The first half of this
  file, unchanged.
- **27 September, how it listens, how it asks, and who it is to the person.**
  Round GO in `TASKS.md`. The second half, from "Ruled 27 September" down.
  Tomas Egilsson, AI director, owns the mechanics; the copy was written to the
  house voice (`.claude/skills/atuned-voice/SKILL.md`) and every string on the
  page passes `check.py`.

Where this file and any other document disagree about Source AI, this file is
the one that is maintained, and the other document is the one that moves.

    Built from it     atuned_src/engine/sourceai.js    the listening half
                      atuned_src/ui/storyui.js         srcPaint, the speaking half
    Gated by          tests/engine.js, group SA
    Measured with     the probes quoted in section "The Scale", on the
                      story bank (sim/stories.js), the fourteen persona lines
                      and the owner's book, 27 September

---

Ruled by the owner, 20 September. His answer was a systems answer rather than
a permissions one, and the distinction matters: he was asked what Source AI
may read and he described what it is, which is the more useful ruling and the
one that had been missing.

---

## His Words

> "What are its systems? Its systems need to be able to take this spiritual
> overlap behaviour because that shows consistency across systems. It should
> read the psychology structure, it should have information on the knowledge
> base, it knows how to measure all of that against the CQ and the spiritual
> integrity and the intentions and the expressions and the way that people
> communicate in their story. And through that it should know how to look at
> the data and kind of get a snapshot of a person's behavioural energies and
> motion, in any particular structure, like a saboteur, complex, hyper
> complex, the archetypes, it doesn't matter. It's one big connected system
> and they're all driving each other. Not driving each other. It was a flow to
> output, but from intention to output."

The correction at the end is the load bearing part. **Not driving each other.
A flow, from intention to output.** That is a direction, and a direction makes
the whole thing computable rather than associative.

---

## The Five Inputs, Named Against What Already Exists

Nothing below needs a model to produce. All five are already computed by the
engine, which is what makes this a reading problem rather than a research one.

**1. The spiritual overlap.** Five systems read independently off one birth
date: the Western element, the Eastern seat, the Human Design read, the gene
key and the numerology. The value is not any one of them. It is the agreement
between them, because five independent systems landing on the same seat is a
signal and one system saying anything is not. `lensWestern`, `lensEastern`,
`lensDesign`, `lensGene`, `numerology.js`, and the convergence count the
spiritual block already prints.

**2. The psychology structure.** The stack as it stands: saboteurs,
complexes, hyper complexes, character, the masks, the archetypes and the
blueprint. `compute()` returns every one of them already sorted by weight.

**3. The knowledge base.** `GLOSS`, the 112 addresses, the 21 laws, the 33
saboteurs, the nine circles and the eight mirror pairs. This is the model's
vocabulary and the only place its definitions may come from. It does not get
to invent a term.

**4. The measurements.** CQ, integrity, intention, expression, DQ, SQ, pole,
overshoot and distortion. These are the axes everything else is measured
against.

**5. The story.** How the person actually communicates: what they write, the
words they use for it, which seat those words land on, and what the parser
read out of them. `parseStory`, its imprints, and the gate mix.

---

## What It Produces

**A snapshot of behavioural energies and motion.** Two words and they are not
the same word. Energy is where the charge sits. Motion is which way it is
going. A reading that gives the first without the second is a photograph of a
person who is moving.

**At whatever structure the question lands on.** A saboteur, a complex, a
hyper complex, an archetype, a seat, a law. His point is that the level is
not the model's business: it is one connected system and the same reading runs
at any grain. So the interface takes a subject and returns the same shape of
answer whatever the subject is.

---

## The Flow, Which Is The Architecture

Intention to output, one direction, and every stage is already measured.

    intention        what the person is moving toward
      through
    integrity        the 21 laws, which is how they act under cost
      through
    the field        the nine axes, what is held at which address
      through
    the structure    saboteurs, complexes, hyper complexes, character
      through
    expression       how it comes out, in the words they choose
      to
    output           what actually happens, and what it costs

A model that reads this as a flow can say where the loss is. A model that
reads the same six as a bag of features can only say what correlates, which is
what every wellness product already does and is the thing this instrument
exists not to be.

**This also settles what a finding may claim.** Source AI may say where in the
flow something is being lost, because the flow is measured at every stage. It
may not say why the person is like that, because nothing in the flow measures
cause.

---

## What This Ruling Does Not Settle

**Where the model runs.** This says what it reads. It does not say whether any
of it leaves the device, and that is a separate ruling with the privacy floor
attached. The standing rules still hold and nothing here overrides them: the
name never leaves the device, the record is never held joined to the story,
and the record never carries a customer id, subscription id, email, key,
secret or token.

**Two readings of "reads the knowledge base" are possible** and they have very
different costs. Either the knowledge base is in the prompt, which is cheap
and bounded and means the model can only use what it was handed, or it is
retrieved against, which is open ended. The first is the one that fits a
product whose whole claim is that it never invents a figure. Recorded as the
recommendation, not as a ruling.

**The daily retune of the Summary** depends on this and on where the model
runs. `AH4`.

---

# Ruled 27 September. How It Listens, How It Asks, And Who It Is

## His Words

Round GO in `TASKS.md`, quoted in full there. The part that is Source AI:

> "So the right-hand side menu I want a summary of the story as it's being
> heard through source AI, which is our own unique algorithm, which if you
> remember it has its own way of looking at things ... And so as source is
> sniffing out the story, and it's discerning because, right, it doesn't use
> definitions, it's discerning the energy behind the story. It's able to probe
> questions from a scale of zero to 10 that are just seven, eight, nine, and
> 10. Looking for the root, which is usually a 10. Why questions are very
> important. We're not a clinician, we're not their friend. We're a peer and a
> companion who sees them for their authentic nature, not for the conditions
> that created them, which is why that should be part of source AI's core
> programming as well. And so maybe the prompt starts off with what are we
> talking about today? Or what are we writing about today? ... listening to
> the story, discerning the story, seeing how the person's architecture is,
> how everything's running through them, and going oh this is what I see, why
> do you think this is, why do you think that is, right, in order to get them
> to find the root. And you know it's not to badger them. It's their job to
> lead. It's not source. If they want to move on, source's job isn't to dig
> deeper, it's just to go cool, yeah. Commit that to source AI's
> documentation as well, and update all of our documents."

## Who It Is. The Core Programming

**A peer and a companion.** Not a clinician and not a friend. Each of the two
it is not rules out something concrete, and that is what makes the stance
checkable rather than a tone:

| It is not | So it never |
|---|---|
| A clinician | diagnoses, names a disorder or a symptom, grades the person, assigns homework, or holds a session open |
| A friend | reassures, agrees, takes a side about the people in the story, gives advice, or tells the person how they should feel |
| It is a peer | says what it heard, in the person's own words, and asks why |

**It sees a person for their authentic nature, not for the conditions that
created them.** This is the load bearing line and it is the same line the
register ruling in `DECISIONS.md` already draws from the other side ("We are
not judging anybody. The product says what is running, not what a person
is"). Mechanically:

- A pattern is a condition. It runs through a person, lands at a place, comes
  back. It is never the subject of a sentence that has the person as its
  object. "You keep coming back to the heart" is allowed. "You are grieving",
  "you are an angry person", "you have shame" are not.
- The person is never described. Only what was heard, where, and how often.
- Nothing Source AI says may be true of the person only because of what
  happened to them. What happened to them is theirs to tell, not its to name.

## What It Listens For. Energy, Not Definitions

"It doesn't use definitions, it's discerning the energy behind the story."
Turned into what the instrument can honestly hold, energy is three things:

1. **Where.** The seat a word lands on. The sniffer knows this with
   confidence, because the lexicon places every word.
2. **How often.** How many times the entry comes back to that seat, and
   whether earlier entries did too. This is what a pattern is.
3. **In whose words.** The person's own, quoted back as typed.

What Source AI does not say to a person, ever: an address name, a fetter name,
a saboteur, a complex, an archetype or a band word. Those are definitions,
and the ruling is that it does not use them. This is also the instrument
being honest: `parseStory` marks most readings `inferred`, meaning the words
named a seat and the address was picked by fallback, and it has already been
measured telling a bereaved person they carry Martyrdom off a fallback
(`engine/sniff.js`, the comment above `named=seg.length>0`). A place and a
count cannot make that mistake.

The imprints in the right rail still carry names, because they are the
instrument's reading and a person goes there to act on it. Source AI is the
conversation, and the conversation stays in place and count.

## The Scale. Zero To Ten, And Why It Is Not The Sniffer's

**The obvious scale is wrong, measured.** `parseStory` already puts a zero to
ten on every seat an entry touches, `min(10, sum/3)`. On the shipped lexicon:

| Measure | Value |
|---|---|
| Median single lexicon word, on that scale | 7.33 |
| Lexicon words that clear 7 on their own | 149 of 219 |
| Story bank lines the sniffer reads at all | 22 of 41 |
| Of those, reaching 7 on that scale | 15, which is 68 percent |

So "ask only at seven and over" on the sniffer's own number would ask about
nearly everything it reads. That number measures how hot a word is. He asked
for pattern, and the root.

**The scale Source AI uses counts return.** A pattern is something that comes
back, so each rung is evidence of coming back that the person could check by
reading their own words:

| Rung | What it means | Asked? |
|---|---|---|
| 0 | nothing read at that seat, or every mention negated | no |
| 1 to 6 | heard once in this entry: the sniffer's reading, capped at 6 | no |
| 7 | the entry comes back to the same seat a second time | yes |
| 8 | three times or more | yes |
| 9 | an earlier committed entry touched this seat too | yes |
| 10 | back across entries and again here, or in two or more earlier entries. The root | yes, as the root |

One word, however hot, is heard and never questioned. That is a precision
decision, taken on purpose: a false question in a somatic reading costs more
than a missed one, because a person asked "why" about something they did not
mean has been told the instrument saw something that is not there.

**Measured on the ladder, 27 September:**

| Corpus | Asked at 7 or over | Reached 10 |
|---|---|---|
| Story bank, one line each, nothing earlier | 3 of 41 lines, 7.3 percent | 0 |
| Story bank, each figure's lines committed in order | 7 of 41, 17.1 percent | 0 |
| Story bank, a figure's lines as one long entry | 5 of 9 | 0 |
| The book, one sentence each | 74 of 10,420, 0.7 percent | 0 |
| The book, 80 word chunks | 153 of 1,284, 11.9 percent | 0 |

Nothing reaches ten inside six lines, which is right: the root is meant to be
rare and to take more than one sitting. Committed in order, six of the nine
figures were asked anything at all, their first question came between the
second and the sixth entry, and three of those six first questions were
nines, a seat an earlier entry had touched coming back. Marcus, Gordon and
Rosa were never asked, which for Gordon and Rosa is the sniffer reading
nothing in what they wrote.

**Negation.** The sniffer does not read it: "I was not angry" and "I was
angry" parse to the same seat and amount (measured, and on record in
`BIBLE.md` 8.3). Source AI does not ask about a mention when either of the two
words before it is a negation. Measured: this drops nothing in the story bank,
because the lexicon's own negative phrases ("not told anyone") carry the
negation inside the match, and 36 of 1,208 seated hits in the book, which read
as correct drops on inspection. The two word window, and leaving "did" out,
are both measured choices: the laws' three word window dropped "could not
stop" across a conjunction, and "did" mutes "I did cry".

**What it reads to do this.** The entry's text, and the seat keys that earlier
commits already stored on the person's own record, `CURP.story.entries[].bands`.
Not the text of earlier entries. Not the name. On the device, in the engine,
which has no host and cannot send anything anywhere.

## How It Asks

**It opens with his sentence.** "What are we writing about today?" He offered
two; this is the journal, so it is writing. Under it, three simple questions
to start from, turned by the day so the page does not become furniture:

    What happened today that your body is still holding?
    Where did you feel it first?
    What did you not say?
    Who was in the room?
    What keeps coming back?
    What did you do straight after?

"Deep questions, simple, straightforward questions." Each is a physical event
a person can answer from memory, which is the shape `funnel/questions.js`
already proved works in this product, and none of them names a feeling for
the person.

**While the person writes, it says what it heard.** Under a label, Heard: one
row per seat, the seat's name in its colour, the person's own words in
quotation marks, and the rung drawn as ten marks with the last four edged in
the seat colour, so the end it asks at is visible before anything reaches it.
The rung is drawn and never printed, because a reading is not a score.

**At seven and over, one question, and it is a why.** About one seat, in
place and count, never a label:

| Rung | The question |
|---|---|
| 7, 8 | "The solar plexus comes up twice in this. Why do you think it keeps landing there?" |
| 9 | "The heart was in an earlier entry too. Why do you think it comes back?" |
| 10 | "You keep coming back to the heart, here and in what you wrote before. Why do you think that is?" |

Under it: "Answer in the journal, or leave it." The answer is more story. It
goes where every word goes, into the journal, and gets heard.

**A screen reader hears what Source AI says, once.** The column is rewritten
on every keystroke, so it is not itself a live region; one hidden line carries
only the opener, the question or "Cool.", and is written only when it
changes. Nobody is read the whole column at every letter.

**It asks why and never answers why.** The 20 September half of this file
says Source AI may say where in the flow something is lost and may not say
why, because nothing in the flow measures cause. The 27 September ruling does
not reverse that; it completes it. The instrument does not know why. The
person does, or can find out, and the question is how they get there. "In
order to get them to find the root." Source AI never offers a because, a
likely reason, or an interpretation of what the person answers.

## The Person Leads

"It's their job to lead. It's not source. If they want to move on, source's
job isn't to dig deeper, it's just to go cool, yeah."

- **One question at a time.** Never two open, never a list.
- **Move on is one press and it is final for the entry.** Source AI says
  "Cool." and "Nothing more asked in this entry." Then it keeps listening and
  keeps showing what it heard, and it asks nothing, however much more the
  person writes about the same place or any other. The next entry is a new
  conversation.
- **No follow up.** There is no rule anywhere in `srcTurn` that asks again,
  raises the rung it asks at, rephrases a question the person left, or
  returns to a seat they moved on from. That absence is the specification and
  the engine gate asserts it.
- **Leaving a question is an answer.** Writing on without answering is fine.
  The question stays on screen, unanswered, and does not escalate.
- **Depth is the person's.** Source AI never proposes going further. If the
  person goes further, it listens further.

## Where It Sits On The Page. The Swap

His words: "we want to swap the imprints and protocol component with the
information component, and the information component then becomes the source
kind of prompt and summary system, that way all three are tied together ...
so the information pane then becomes an imprints and the protocol."

Read against the shipped page, 27 September, commit `53d7730`, screenshots
at 1600 and 390 on a blank profile and with one entry typed:

| Before | After |
|---|---|
| Stage, left: the journal | Stage, left: the journal, unchanged |
| Stage, right: Imprints over the release settings (`#imp`, `#strel`) | Stage, right: Source AI (`#stsrc`), the prompt and the summary as heard |
| Right rail, the pane he calls information: Root Energetics, Reading, Selection, Flow, Running, Moral integrity | Right rail on the Story: Imprints and Release as two open sections, and Selection, where Detail on an imprint opens |

So the three are one system reading left to right: what the person writes,
what Source AI hears in it and asks, and what the instrument found and can
release. `#imp` and `#strel` kept their ids, so every renderer and gate still
finds them. On every other tab the rail is exactly as it was, and the two
hosts are emptied on the way out so a hidden rail never holds a stale
reading. Stacked on a phone the order is journal, Source AI, imprints,
release, then the tools.

The rail section is headed Release rather than Protocol. He ruled it the same
day, round GS in `DECISIONS.md`: "Release is the one word", over Integrate
Protocol, and a release empties a story from the body, not only the charge at
an address. The button under it already reads "Run a release".

## How It Fails, Named

Each of these is real on this build and none is hidden by the ladder.

1. **Silence on half of what people write.** The sniffer reads nothing in 19
   of 41 story bank lines, so Source AI has nothing to hear in them. It says
   so, "Nothing read yet, so nothing is asked," and gives one route, "Say
   what your body did, and where." James's "I make the call and I sleep fine"
   gets that line, and he is right that the instrument cannot read him.
2. **Negation past two words.** "I was never, not once, angry" still counts.
3. **Attribution.** "He was furious" is counted as the person's. The sniffer
   has no subject, and neither does Source AI.
4. **Tense.** "I used to panic" is counted as now.
5. **Emphasis reads as return.** "Furious. Furious." is a seven. A person
   who repeats for emphasis is asked; that is usually the right question
   anyway, and Move on is one press.
6. **Earlier entries are counted by seat, not by what they said.** An entry
   about grief and an entry about a tight chest before a race are both the
   heart. The rung says "came back"; it cannot say it was the same thing.
7. **An undo takes the charge back and leaves the entry,** so an undone entry
   still counts as earlier. The alternative, reading the undo stack, couples
   Source AI to storage it has no business in.

## How To Evaluate It Honestly

There is no labelled set and none is coming: nobody can say what the right
question to a real person's real entry was. What can be measured, and how:

- **Ask rate.** The share of entries that draw a question. Measured above on
  three corpora. If it climbs past about one entry in three in real use, the
  ladder is badgering and seven is too low.
- **Move on rate.** The share of questions a person moves on from. High is
  not failure, it is the person leading, but a rise after a change to the
  ladder is the change reading as pushier.
- **Return after a question.** Whether the next words written after a
  question land on the same seat. That is the nearest thing to "the question
  helped the person say more" the instrument can see.
- **Agreement with the person's own later choice.** Whether a seat Source AI
  asked about is one the person later chooses to release. A weak label, and
  free of leakage, because the release choice is made on a different surface
  by the person and never reads the rung.

**Every one of these is on the device and stays there.** Under the standing
rulings nothing about a person's entries is reported back, so today these are
measured on the simulated cohort (`sim/stories.js`) and in the owner's own use.
Reading them across people needs his consent line first: `AZ4`, and the
narrowed modelling ruling in `DECISIONS.md`, "Sight by tier, ruled, and the
journal use corrected", which licenses aggregating limiting belief phrasing to
refine the lexicon and nothing wider.

## What This Ruling Does Not Settle

- **Whether Source AI may read earlier entries at all.** `DESIGN-sniffer.md`
  question 12. Built to the narrowest reading that works: seat keys already
  stored, on the device, never the text. If he rules no, rungs 9 and 10
  disappear and the ladder stops at 8; the change is one argument.
- **Whether a model ever speaks for it.** The page says "scripted" beside the
  name, because every line is chosen by a rule. A model behind the sign in
  seam would take the same inputs and keep every rule in "The Person Leads"
  as a constraint on its output, not a suggestion in its prompt.
- **The signal strength per pattern** he raised in the same message, "we
  heard a little architect, a little nature, a little sage", is a design, not
  yet a build: `DESIGN-pattern-signal.md` and `proto/pattern-signal/`.
