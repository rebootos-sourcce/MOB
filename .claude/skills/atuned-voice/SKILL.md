---
name: atuned-voice
description: The house voice for Atüned / SOURCE, as a system a writer can be held to. The Encarta anchor, the warmth pass, the checkable micro rules with a failing and a fixed line beside each, the owner's own objections as a runnable database, the reading history of every writing seat, the ten passes, and a runnable gate. Load before writing or editing any user facing string: UI copy, labels, tooltips, drills, readings, errors, empty states, onboarding, funnel and quiz copy, the names of things. Loads alongside atuned-ux, which owns the surface; this owns the words on it.
---

# Atüned Voice

The surface rules are in `.claude/skills/atuned-ux/SKILL.md`. The buckets are in
`COPY.md`. The settled rulings are in `BIBLE.md`. This file is the part none of
those carry: where the voice comes from, what it does to a sentence, and how to
tell whether a line you just wrote is in it.

---

## Use It In Ten Seconds

You are mid sentence. Read this card, then go back.

    1  Say the fact. Present tense, concrete noun, no lead in.
    2  Move the subject to the person, and keep the predicate.
    3  Name the cost.
    4  Name the one thing to do, or say nothing.
    5  Cut to the fewest words that stay true. Then read it out loud.

These fail on sight, before any judgement is needed. The count is not written
here, because this card said nine while carrying eleven the moment two rules
were added, which is the defect the repository has been bitten by twelve times:

    an em dash                          anywhere, including your own notes
    a line that says a thing is starting  "Welcome to", "Let us begin"
    an instruction to a nervous system  "relax", "sit back", "gently"
    a number with no unit               "25 of your allowance"
    a figure with a tolerance on it     "plus or minus 12", "swing 11"
    an abstract noun as a heading       Insights, Journey, Wellness
    a band word standing alone          Severe with nothing attached
    a second wording for the empty state  it is "not read yet", once
    a reassurance to a fear not raised  see V12, which is held and not banned
    two buckets in one string           an instruction that is also a reading
    all caps in copy                    sentence case in body, title in headers

Then run the gate:

    python3 .claude/skills/atuned-voice/check.py --line "your line here"
    python3 .claude/skills/atuned-voice/check.py atuned_src/ui/release.js
    python3 .claude/skills/atuned-voice/check.py --baseline
    python3 .claude/skills/atuned-voice/check.py --objections

---

## 1. The Anchor, Named Precisely

The owner said Encarta. That is a real register with real moves, and it is not
a vibe. Encarta shipped from 1993 on a CD, built on the Funk and Wagnall's
text, and its house style was set by the constraint it was under: a screen, a
reader who arrived by search rather than by page, and no room. Eight moves
carry it. Cite them by number when you are arguing about a line.

**E1. The definition arrives in the first clause.** The subject, a comma, then
what it is. The shape, written out rather than quoted, is "Jazz, a form of music
characterised by improvisation and a strong rhythmic base." No approach, no
framing, no context paragraph first.

**E2. Present tense, indicative.** Things are, not have been shown to be.

**E3. Concrete nouns carry the sentence.** The noun does the work, so the
adjective is not needed. Where an adjective appears it is a measurement
(seven, molten, nocturnal), not an evaluation.

**E4. The elaboration follows the definition and is ordered by weight.** What
matters most is second, not last. There is no build.

**E5. No throat clearing.** No "it is worth noting", no "interestingly", no
rhetorical question, no exclamation. The entry begins on the subject.

**E6. Every number has a unit and, where it is a share, a denominator.** 4,506
metres. About 12 per cent of the land area.

**E7. Confidence comes from the sentence being short.** Length is the hedge.
Encarta does not sound sure because it says "certainly", it sounds sure
because the sentence stops.

**E8. No second person and no first person.** The reader is not addressed and
the writer is not present. There is nobody in the room but the subject.

### What Encarta Cannot Do, And Why It Matters Here

The anchor is right about register and wrong about stance, and the reason is
the subject. Encarta's subject is not reading the entry. Ours is.

- **It cannot instruct.** E8 forbids the second person, so it has no
  imperative mood. This product's whole purpose is mechanical: hand a person
  their own instructions so they can change them. That needs an imperative.
- **It never admits a limit.** An encyclopedia that says "not known" has
  failed. An instrument that never says "not read yet" is not a mirror.
- **It never names a cost.** It describes a mechanism and stops. Our reader is
  paying for the mechanism, which is the only reason they opened it.
- **It cannot be silent.** Encarta answers every query. This product has a
  Refusal bucket and uses it.
- **It is cold, and it is cold on purpose.** It is written about a subject that
  cannot be hurt by it. A person at level 3 who is defended, or level 1 who is
  actively repelled, is reading a description of themselves. `BUYERS.md` has
  the grid. Nothing in Encarta's register was built for that reader.

So: keep the register, move the stance. That is the whole of section 2.

---

## 2. The Warmth Pass, As Operations

Warmth is not a set of adjectives to add. It is six operations on a sentence
that already passed the Encarta pass. Run them in this order.

**W1. Move the subject to the person and keep the predicate.** This is the
whole trick and it costs nothing. The verb stays mechanical, so the register
does not move; only who the sentence is about moves.

    E-form   The masseter contracts under sustained threat appraisal.
    W-form   A tight jaw before you are properly awake.

That second line ships, at `funnel/index.html:267`, quoted exactly. Notice how
little it took. The noun is still concrete, the tense is still present, no
adjective is doing work the noun could do, and the second person arrives once,
in a subordinate clause, carrying the whole stance on its own. That is the
lightest available version of the move and it is usually the right one.

**W2. Replace the representative instance with the reader's own.** Encarta's
example stands for a class. Ours is theirs, because the engine read it out of
what they wrote. Where the instrument has not read one, say so. Never invent
the instance to make the sentence land.

**W3. Admit the limit once, at the end, and never hedge throughout.** One
sentence at the close of a reading, naming what was not read and what would
put it in. `COPY.md` rules this and `ui/summary.js:242` does it: "There is no
birth data on file, so the spiritual layer is not in this reading. Date, time
and place would put it in."

**W4. Add the cost.** Say the number, then what it means, then what it costs,
in that order. Encarta stops after the second.

**W5. Add one route out, imperative, one step.** Verb first. After the reading,
never inside it. One step, because a person under load holds about four items
and you are spending one of them.

**W6. Set the sentence at the speed of speech.** Encarta's cadence is written
to be read at leisure. Ours is read by somebody tired. Say it out loud. If you
would not say it to a person sitting across from you, it does not ship.

### What Is Kept, What Is Broken, And Why Each Break Earns Itself

Kept, and not negotiable: E1 definition first. E2 present tense. E3 concrete
nouns. E4 ordered elaboration. E5 no throat clearing. E6 units and
denominators. E7 confidence from brevity.

Broken, with the reason each break is paid for:

| Encarta move | Broken to | Why the break earns itself |
|---|---|---|
| E8, no second person | Second person throughout | The subject is reading the entry. A description of a person written in the third person about them is a case note, and a practitioner reads a clinical register into whatever he is handed. |
| No admitted limit | W3, the limit stated once | Every figure here is computed from self report. An instrument that hides that is claiming a measurement it did not make. `TEAM.md` gives that word to one seat and she does not lend it. |
| No cost named | W4, the cost named | The reader is the one paying. A mechanism with no cost attached is a fact about the world, and they did not come for one. |
| No imperative | W5, one route out | "Close the gap between your mind and your body, and hand you your own instructions so that you can change them." A route is the product. |
| Leisure cadence | W6, speech cadence | Working memory holds about four items and the person is under load. Measured at 57 to 71 simultaneous choices per screen. The sentence is not the place to spend more. |

Never licensed, whatever the brief says: comfort in place of information. The
softening adverb. The abstract noun. A reassurance against a fear nobody
raised. A claim the engine cannot produce a field for.

---

## 3. The Micro Rules

Sixteen. Each one has a line that failed and the line that replaced it, drawn
from copy this product ships or shipped. A rule nobody can fail is not a rule,
so every one of these has a real corpse.

Cite them as V1 to V20 in review.

### V1. No Line Whose Job Is To Say A Thing Is Starting

    FAIL  ui/release.js:8    Welcome to release and reframe.
    FAIL  ui/release.js:11   Let us begin.
    FIX   cut both

The person pressed Begin. They know. The surface title is already on the card.
A preamble line is the product reading its own heading out loud. Each of these
holds the screen for 2.2 seconds by `RUN.speed`, so the two of them cost 4.4
seconds before anything happens.

### V2. Never Instruct A Nervous System

    FAIL  ui/release.js:9    Find a quiet space. Sit back and relax,
    FIX                      Sit down. Put both feet on the floor.

"Relax" is an outcome, not an action, so it cannot be followed. It is also the
exact register of the shelf this product refuses. Name a position a body can
take. `TEAM.md` is explicit that the product does not touch a nervous system.

### V3. A Physical Metaphor Has Mass And A Direction

    FAIL  ui/release.js:10   Feel what the body is doing as the energy goes.
    FIX                      Keep some attention on your body, and notice
                             which place answers.

Goes where. "The energy goes" has no direction, no address and no agent. The
fix names a place and a thing to do with it. Load is physical. A leak is
physical. A lock is physical. "Energy flowing" is a gesture.

### V4. Every Sensation Line Names A Place

    FAIL  ui/release.js:9    and turn your senses inward to feel what is
                             released.
    FIX                      Notice which place answers first.

Inward to where. The passive also hides the agent: what is released, by what.
The instrument's whole value is that it lands a reading at a named plexus or a
named nerve, and a sensation line with no address throws that away on the one
screen where the body is actually being used.

### V5. The Product Never Addresses Itself

    FAIL  ui/imprints.js:87  Nothing held. Write in the box and it gathers
                             here.
    SHIPS ui/imprints.js:89  You have not written anything yet. Whatever you
                             write gets pulled apart and collected here.

Already fixed in this repository, which is why the rule is the house's own and
not an import. The first line narrates the product's state. The second says
what a person would say about themselves.

### V6. One String, One Bucket

    FAIL  ui/release.js:10   As the words repeat, follow along in thought.
    FIX                      Each line names one pattern. Follow it in thought
                             as it lands.

The failing line is an Instruction and a Definition wearing one coat: it tells
you what to do and explains the mechanism in the same breath, so neither is
clean and the mechanism is the part that gets skimmed. The seven buckets are in
`COPY.md`. A string that is two buckets is a string that is wrong.

### V7. A Number Carries Its Unit, And Its Denominator If It Is A Share

    FAIL  ui/release.js:197   25 of your allowance
    FAIL  engine/plan.js:155  92 of the gift left
    FIX                       25 patterns of the 92 you have left
    FIX                       92 patterns left of the hundred

Twenty five of what. `planAllowance` already returns `left` and `of`, so the
honest sentence needs no new field. Worse, the free grant is ten patterns a
week and a run caps at twenty five, so "25 of your allowance" reads as a bill a
person cannot pay. Both instances are open findings, not fixed: they belong in
`TASKS.md`, and `check.py` reports them on every run.

This rule has a shipped counter example worth copying. `KB_OF` at
`ui/knowledge.js:273` is a table of denominator phrases, one per card family,
so every percent on that surface arrives as "62 per cent of the mask at full
weight". That is the pattern. The number and what it is out of are written once,
in one place, and its own comment says why: where a family has no honest percent
for some of its rows the line says so rather than leaving a person to assume the
blanks are zeroes.

### V8. A Reading Is Not A Score

    FAIL  the weight printed as "7.4 of 10"
    SHIPS ui/summary.js:250   at a weight of 7.4

Recorded at `ui/summary.js:249`: "of 10" made it a mark out of ten. A count
against a total invites a person to pass or fail. A weight is a quantity of
something they are carrying.

The same defect, caught on a percentage, at `ui/summary.js:280`: "the field
leans benign at 100 per cent" was a share with no denominator on a surface
where a percent could mean three different things. The fixed line names both
ends and says they add to a hundred.

### V9. A Label This Product Puts On A Person Carries Three Things

The definition, the behaviour it produces, and the direction out of it. A word
like Severe with nothing attached is a judgement. The same word with those
three is a reading. Ruled in `BIBLE.md`.

    FAIL  Oscillating
    SHIPS Oscillating. The field spends as much as it builds. Nothing is
          compounding in either direction.

### V10. Antithesis Is A Tool, Not A Cadence

"X, not Y" and "not X but Y" and "rather than" are the single most recognisable
machine rhythm in English prose, and the reason is that they let a writer sound
decisive without deciding anything. The house rate, measured off the shipping
copy, is under 3 per cent of sentences. Onboarding runs it at 14 per cent.

    FAIL  ui/onboard.js:145   in your own words, not a questionnaire
    FAIL  ui/onboard.js:146   a place in the body, not a label
    FIX   ui/onboard.js:145   the day, in your own words
    FIX   ui/onboard.js:146   a named plexus or a named nerve

Two of four cells on one card, each defining a thing by what it is not. The fix
keeps one negation at most per surface and makes the rest positive and
concrete. Note that "the day, in your own words" is not new copy: it is already
in the product at `ui/component.js:412`. Reuse beats invention, and it also
satisfies one word per concept.

`check.py` prints this rate per file against the house rate. It does not carry
a threshold, because the house rate moves as the copy moves.

### V11. Cap The Sentence That Opens On It Is, That Is, This Is

Measured at 3.3 per cent of product sentences. Onboarding runs 9.5 per cent.
The construction defers the subject by two words and reads as a machine
restating itself. The fix is almost always to start on the noun.

    FAIL  It is something you cannot see as separate from you, which is why it
          costs more than it looks like it should.
    FIX   A character layer costs more than it looks like it should, because
          you cannot see it as separate from you.

Same length, one gloss removed, subject first.

### V12. Never Reassure Against A Fear Nobody Raised

    FAIL  ui/drills.js:837   Not a memory exercise. A person who cannot think
                             of anything they identify with is not unusual,
                             because an identification that is working does
                             not feel like one. So go year by year.
    FIX                      Go year by year and look at what got picked up.
                             Toys, games, characters, teams, machines.
                             [and after a person comes up empty]
                             An identification that is working does not feel
                             like one, which is why nothing came. Try the next
                             year.

Thirty one words of comfort arrive before the instruction, answering a fear the
person has not had yet. Move the reassurance behind the failure it answers. It
is the same sentence and it is worth ten times more there.

**The bounded exception, and it is the owner's.** The welcome at
`ui/onboard.js:121` opens on "This is you, and it is okay." followed by "No
judgment. Nothing here grades you." That is his ruling, quoted in the file, and
it reverses an earlier opening on "nobody is coming to save you". It stands,
and the exception is bounded to the welcome: a person arriving at a mirror has
already raised that fear before the page loaded, which is the condition the
rule actually tests. Anywhere past the welcome, the rule holds without
exception. `check.py` flags reassurances and rules on none of them.

### V13. Sentence Case In Body, Title Case In Headers, And A Value Is Body

    FAIL  ui/imprints.js:105   Nothing Held, 15 Installed
    SHIPS ui/imprints.js:109   nothing held, 15 installed

Recorded in the file: the row styling carried a capital on every word straight
into the value, so a reading came back wearing a title. A value is never
titled. `tests/design.js` watches all caps; nothing watches title case on a
value, so this one is yours to see.

### V14. One Word Per Concept, And A Real Distinction Keeps Its Own Word

Delete or remove, never both. The canonical terms are in the UX skill: the
empty state is "nothing held", a held address is "held", the person's data is
"profile". Held, installed and firing are three states and stay three words.
Run `python3 tools/terms.py` before you commit.

### V15. A Refusal States What Failed, What It Means, And What Changes It

No apology, no exclamation, one sentence where one will do. The model is
already in the product and is the best refusal here:

    SHIPS ui/release.js:80   You are looking at Sofia, which is a worked
          example rather than your record. Switch to your own profile to run a
          release.

State, reason, route. And the shorter one, at `ui/drills.js:150`: "Nothing is
held here, so there is nothing to release. The protocol opens once this address
is carrying."

### V16. The Count Stated To Users Is 112

The lower figure the codex counts is never printed in front of a person. It is
in `check.py` so that no writer has to hold it, and the gate fails on it.

### V17. A Figure's Label Is One Word

    FAIL  ui/record.js      Ground opened, all time
                             12
                             addresses and channels opened at least once, from
                             47 lines spoken. Your own horizon reads about 300,
                             give or take 40.
    SHIPS ui/record.js:96    Opened
                             12 addresses
                             opened at least once, from 47 lines spoken.

    FAIL  ui/cone.js         Minutes planned, not yet done          30
    SHIPS ui/cone.js:953     Planned                        30 minutes

The record card is the corpse the rule was written against and it carried the
second defect too: the horizon, about 300, was stated under the figure and
stated again four lines below it in the Next block. Same number, twice, on one
card, which is the "of the same 90 days" he was pointing at.

His, and he asked for it by name. "The buttons still have that noodly text on
them. 85 days kept, of the 90 days on your record. Of the same 90 days. We
should need a rule never to write shit like that. Instead of 85 days kept,
just one word. Recurring, missed, active, streak."

**It is the resolution of a collision between two of his own rulings.** V7
says a number carries its unit and, where it is a share, its denominator. The
answer given to V7 was a second line of prose under every figure, so five stat
cards became five paragraphs and the denominator was said twice in the same
breath. Both rules are his and both stand. What changes is where each one
lands:

    the unit rides on the figure          85 days
    the label is one word                 Kept
    everything else is in the tooltip     or it is not needed

Recurring. Missed. Active. Streak. Kept. Opened. Planned. Practised. Saved.
Installed. A word that names what the figure counts, in the register a person
would use out loud.

**The mechanical half, and it is two halves.** A figure's label carries no
comma, and it is one word. A comma in a figure's label is a sentence wearing a
label's clothes: a comma means a second part and a name has one part. An
article is not a word for this count, so "The core" is a label and "Ground
opened" is not.

**What this rule does not reach, said rather than left to be found.** An
eyebrow over a paragraph is not a figure's label and stays as long as it needs
to be: "How it runs through you" sits over prose and labels nothing that can be
counted. The gate only reads a label that stands immediately in front of a
figure, which is the shape a figure actually ships in, and it reads two of
them: the row pair `['Minutes practised', l.minutes]`, and a label element
standing immediately in front of an element the stylesheet sets in the numeric
typeface. Both class lists are read off `shell/head.html` at run time, the
label set from the rule that capitalises it and the figure set from the rule
that gives it `var(--num)`, so neither can go stale when a class joins either
rule. Only a selector that is the element itself counts as a figure: `.rec-big`
is one, `.rit-sv-h b` is a row that happens to hold one, and the first cut of
the gate could not tell them apart and reported "Today's ritual" as a figure
label.

**One thing it collides with, and the collision is the owner's to settle.**
`COPY.md` rules two labels by name that carry a figure and take two words,
"Filled in" and "Carrying", and its Label section allows two or three words.
They sit on the Field rail with a figure beside each. This rule does not
overturn a ruling, so they stand as written and the gate does not reach them.
When he rules on it, one of the two documents moves.

**And the unit is not the label.** "85 days" is one figure carrying its own
unit. It does not become "85" with "days" promoted into the label, which would
buy the one word rule by breaking V7. Read the pair out loud: "kept, eighty
five days". If that is not a thing a person would say, the label is wrong.

### V18. A Figure Carries No Interval, No Tolerance And No Decoration

    FAIL  ui/analytics.js    Identification  58%  plus or minus 12
    FAIL  ui/personas.js     swing 11
    FAIL  ui/summary.js      of 100, plus or minus 11
    FAIL  ui/record.js       Your own horizon reads about 300, give or take 40.
    FIX                      the figure alone, and the range drawn beside it

His, and he ruled it as a class rather than as two strings: "do a sweep of text
like that. 100 plus minus 12, swing 11. That shit has to all go." A figure with
a tolerance stapled to it is a lab readout and not copy.

He ruled the replacement in the same breath, and it is the load bearing half:
"give a pill to the lower right side of the number of the coherence slider,
like it oscillates within the person's range." **The range is drawn, never
stated.** An interval is a shape, and a shape is the one thing prose is worst
at. Where the shape cannot be drawn, the fact survives in words with no figure
in it: "The needle has play in it, so a small move is not a reading."

The whole class was swept out on 21 September and the gate holds it closed. Two
sentences that named the interval came out with it, because a sentence pointing
at a figure that is no longer on the screen is a sentence about nothing.

### V19. The Empty State Has One Wording, And A Refusal Is Not A Value

    FAIL  ui/ui.js:490       masculine   not enough held to read   feminine
    FIX                      masculine   \u2013   feminine
    FIX   ui/drills.js       Neither side reaches 1, so no direction is
                             named. Write what happened and both sides move.

His: "the balance masculine feminine is broken. It says masculine, not enough
held to read feminine. I do not understand what that bullshit means."

Two defects in one string and they are worth separating, because only one of
them is gateable.

**The bucket.** A Refusal was sitting in a Value slot, and that slot is centred
between two labels, so the eye reads one sentence across three elements. A
value's empty state is a dash. `COPY.md` has said so since it was written: a
dash is the honest glyph for not read yet, and it is not zero. The refusal
keeps its full form one door away, in the drill, where there is room to say
what failed and what changes it.

**The wording.** Five phrasings of one state were in the product: not read yet,
nothing read yet, not enough held to read, nothing measured, too little held.
One concept, five words, which is V14 broken on the most read string in the
app. The wording is **not read yet** as a value, and **Nothing read yet, so
<what is absent>** as a sentence. The gate holds it.

### V20. If You Cannot Use Regular Words To Describe It, Do Not Describe It

    FAIL  ui/cone.js:752     The waist is 40 to 60 out of 100, where most
                             people oscillate.
    FIX                      The narrow middle is where most people sit.

His sentence, and it is the rule. It collides head on with V7, which says every
number carries its denominator, and **his ruling wins**: the point of V7 was
that a bare 13 means nothing, not that every figure should be dressed in a
scale. Where a plain sentence can say it, the plain sentence goes. Where it
cannot, the number goes, and not the scale.

The distinction that makes this scrubbable rather than endless: a small scale
label under a figure is V7 working, and prose that hides behind a scale instead
of saying something is the defect. Read every one out loud as a sentence and
keep the ones that survive it.

---

## 3b. His Objections, As A Database

"create a log of all the times I said I do not like this copy type. Create a
database, sweep for it, and kill it. And add that to the style guide."

The last clause is this section. The other three are three files.

    COPY-OBJECTIONS.md    the log, and COPY-OBJECTIONS.html is the same
                          content for reading rather than for diffing
    objections.json       the database, beside this file
    check.py --objections the sweep, and it is the gate

**The database is the source and the log is a build product.** Both are
rendered by `tools/objections.py`, which imports the sweep rather than
carrying one, so the log cannot disagree with the database and neither can
disagree with the product. A log kept by hand beside a database read by a
program is the defect this repository has been bitten by twelve times in
another coat.

**Every rule cites the objection it comes from**, by entry id, and every entry
carries his wording verbatim with the file and line it is recorded at. Where a
class was taken from a ruling with no quotation behind it, the entry says so
and says what it was inferred from. Nothing in the log is remembered.

**A rule nobody can express as a check is guidance, and it is named.** Nine of
them, at the foot of the database: the bucket half of V19, whether a heading is
a thing a person would say, text over a graphic, a legend nobody asked for, the
AI six itself. They are written down rather than dropped, and they are not
turned into a bad pattern, because a tool that lies is worse than no tool.

**A rule enforced somewhere else is cited, not rewritten.** The figure label,
the naked number, the em dash, the count, the caps, the soft lexicon and the
preamble are all in the gate above. The verdict rule is in
`marketing/refuse.js`. Terminology drift is `tools/terms.py`. One word per
concept applies to tools as much as to copy.

**Read the counts off the run.** No figure from that sweep is written into this
file, and the rules that read zero are the ones doing the most work: a class
swept out and then held closed is what a gate is for.

---

## 4. The Seats And What They Read

`TEAM.md` has eighteen seats. Seven of them write or rule on writing. A general
style guide becomes a specific one at exactly this point: what a person has
read decides what they reach for, and it decides what they cannot see. The
blindness column is the load bearing one. Nobody is hired for their library
alone.

**June Okonkwo-Lund, 46, narrative director.** Poetry, then technical writing,
then twenty years finding out they are the same job at different distances.

- *Reads:* Klinkenborg, *Several Short Sentences About Writing*, which is the
  one actually reached for. Orwell, *Politics and the English Language*. Le
  Guin, *Steering the Craft*. Basho and Issa, which is where compression and
  the Japanese substrate both enter. Zinsser. The original Mac HIG. A folder of
  screenshotted error messages that is a real folder.
- *Good at:* cutting, the refusal, the empty state, and where a sentence
  breaks. Hearing a person's own words and giving them back.
- *Blind to:* compression that has gone past the reader. A nine word sentence
  that a level 5 cannot parse is not tight, it is broken, and she will defend
  it because it sounds finished. She also prefers the line that lands to the
  line that is true, which is why pass 1 exists and is first.

**Noa Ferreira-Blake, 45, brand director.** Owns what the thing is before it is
anything it does.

- *Reads:* Paul Rand's IBM and UPS rationales, for the argument and not the
  mark. Vignelli's *Canon*. Otl Aicher. Kenya Hara on Muji, which is a brand
  built on the absence of branding and is the nearest reference this product
  has. Ries and Trout, *Positioning*. Byron Sharp, *How Brands Grow*, as the
  counterweight to everything romantic. Rory Sutherland.
- *Good at:* the one true sentence, naming, refusing the category cliché, and
  saying what we are not, which does more work than saying what we are.
- *Blind to:* the second screen. Brand reads the first four seconds and stops.
  She has no instinct for instruction copy at all, because a promise has no
  imperative mood, and she will approve a hook that becomes a label a person
  re-reads four hundred times.

**Theo Lindqvist, 41, marketing director.** Reach, positioning, the story
outward.

- *Reads:* Ogilvy, *Confessions of an Advertising Man*. Bernbach's internal
  memos. Howard Gossage, for the refusal to shout. Eugene Schwartz,
  *Breakthrough Advertising*, whose five levels of awareness map almost exactly
  onto the ten level grid in `BUYERS.md` and are the reason he reads that grid
  faster than anyone. Dave Trott.
- *Good at:* the first four seconds. Proof over claim, which in this category
  is the only available asset. Answering the objection inside the material
  rather than in a rebuttal.
- *Blind to:* durability. An advertisement is read once and a label is read
  four hundred times, and he writes both the same way. He also reaches for
  urgency under pressure, which in this category is counter signalling and is
  ruled out.

**Camille Boucher, 44, sales director.** The funnel, the tiers, the conversion.

- *Reads:* Stripe's documentation, for a paid product explaining itself without
  persuading. Basecamp's pricing pages. Chris Voss. Cialdini, read as a list of
  things not to do.
- *Good at:* the upgrade sentence written as a service rather than a push.
  Naming a drop off as a specific failure with a name on it. Refusing
  manipulation, which here is disqualifying and not merely distasteful.
- *Blind to:* the refusal register. A salesperson's reflex at a wall is to
  soften it, and a refusal that apologises has claimed the product did
  something wrong by having a limit.

**Ngozi Achebe-Lindgren, 54, game director.** The loop, progression, session
shape.

- *Reads:* Koster, *A Theory of Fun*. Schell, *The Art of Game Design*. Bogost
  on procedural rhetoric. The *Dark Souls* item descriptions, which are the
  best compressed diegetic writing in the medium. Nintendo's first party
  tutorial copy, which teaches a mechanic in six words and never praises.
- *Good at:* copy that teaches a mechanic in one line. The streak line. The
  line on a first that is a dated fact and not a compliment.
- *Blind to:* praise. A game says "nice". This product reads a nervous system
  and may not, because praise from an instrument is a reading it did not take.

**Ilse Coetzee-Nakamura, 52, CQ.** Whether the model the product asserts is
defensible by somebody not already convinced.

- *Reads:* tantric ritual manuals in Sanskrit, and forest plots. Gawande on
  checklists. She owns the word "measurable" everywhere it appears.
- *Good at:* provenance, the evidence tier, the falsification list, and handing
  back the sentence she will sign instead of the one she killed.
- *Blind to:* rhythm. She will return a sentence that is true and unsayable.
  Twice in her first pass the replacement was better copy than the line she
  killed, because the real mechanism was more physical than the invented one.
  That is the case for running her before the cut and not after.

**Ines Halldors, 44, creative director.** Holds the line between beautiful and
true, and says yes and no.

- *Reads:* not a library. One habit, and it is the standard: she reads every
  line as the person on the worst day of their year.
- *Good at:* killing the line the room has fallen in love with.
- *Blind to:* nothing that matters here, which is why she is the tiebreak and
  not a pass.

---

## 5. The Ten Passes

"Simulated it ten times before they gave us an answer."

**Ten polishes are not worth doing.** Ten passes of the same question converge
on the average of the ten, and the average of ten good answers is the AI six.
That is exactly what the smoothness is: no pass ever lost, so no pass ever
decided anything. A line that has been through ten polishes has had every edge
that could offend anyone taken off it, and the edge was the content.

**Ten different questions are worth doing,** because they disagree, and a
disagreement has to be settled by a rule, and the rule leaves a mark on the
line. The mark is the thing the owner is asking for.

So: ten questions, in this order, once each.

    1   Is it true          Against what the engine computes. Name the field.
                            A beautiful sentence that overstates a reading is
                            a defect and a lie.
    2   Which bucket        One of seven. If it is two, it becomes two strings.
    3   Where in the loop   Discover, play, flow, embody. A string that serves
                            none of the four is a string nobody needs.
    4   The Encarta pass    E1 to E7. Definition first, present tense,
                            concrete nouns, units, no throat clearing. Strip
                            every trace of stance.
    5   The warmth pass     W1 to W6. Move the subject. Add the cost. Admit
                            the limit once. Add one route out.
    6   Cut                 Fewest words that stay true. Your first draft is
                            twice as long and you know it.
    7   Read it as Angela   Level 5, six modalities, wants magic. Does she
                            stay on the screen or decide this is homework.
    8   Read it as Derek    Level 7, endurance, wants the diagnostic. Does he
                            believe the number, or spot a claim with no
                            instrument behind it.
    9   Read it as James    Level 3, third turnaround, defended. Does he feel
                            described or accused.
    10  Out loud, standing  At the speed of speech. Where does the break land.
                            Reading it in your head is not reading it.

Passes 7 to 9 use the six reference cases that are already in the product, in
`ui/personas.js`. Sofia, Diane, Marcus, Angela, Derek and James. Load the
profile and read the line on the surface with that person's numbers in it.
A line that lands for all three of Angela, Derek and James is rare and worth
keeping.

### When Two Passes Disagree

Do not average them. Averaging is how the six happens. Settle it on the
precedence below and record which pass lost.

1. **Pass 1 beats everything.** A truer line that reads worse ships. There is
   no exception and it is not a matter of degree.
2. **Pass 2 beats 4, 5 and 6.** A string doing two jobs is not fixed by better
   words. It is split.
3. **Pass 9 beats pass 7.** Losing Angela costs a sale. Accusing James harms a
   person who came to look at himself. `BUYERS.md` says level 3 is not the
   market, which makes this cheap to get wrong and is the reason it is written
   down.
4. **Pass 10 beats pass 6.** If the cut killed the break, put the word back.
   Rhythm is not decoration; where a sentence breaks is what makes it land.
5. **Pass 3 beats pass 5.** If warmth has added a sentence that serves no
   station of the loop, warmth added furniture.
6. **Pass 7 and pass 8 do not resolve against each other, ever.** Angela wants
   the reading and Derek wants the arithmetic, and a line that serves both is
   usually a line that serves neither. This is not a tie to break, it is a
   missing string: Derek's version is a Definition, Angela's is a Reading, and
   the product has two buckets for exactly this reason. Write both.
7. **Anything still open after that is Ines's,** and it goes to her as the two
   candidate lines and the pass each one wins on. Never as a question.

### What Changes Between Pass One And Pass Ten

Pass 1 to 3 decide whether the string should exist. Most cuts happen here and
they are cuts of whole strings, not words. Pass 4 to 6 decide the sentence.
Pass 7 to 9 decide whether it survives contact with a person, and they are the
passes that most often send you back to pass 1, because a line that Derek does
not believe is usually a line that was never true. Pass 10 decides where it
breaks.

If nothing came back from passes 7 to 9, you did not run them. Read them on the
surface with the profile loaded, not in your head at your desk.

---

## 6. The Test

`python3 .claude/skills/atuned-voice/check.py`

Three modes, and the first is the one that matters:

    --baseline          what the shipping copy currently reads, and every hard
                        failure in it
    --line "..."        one candidate line against that baseline
    <path> ...          one file or directory against that baseline
    --all               every file in the corpus, ranked

**No house number is typed into the gate or into this document.** The
distribution a line is measured against is computed off the shipping copy on
every run. This repository has been bitten nine times by a number typed into a
document that the product then grew past, and a voice gate carrying a
hardcoded median would have been the tenth. Read the rate off the run.

### What It Checks Mechanically

Hard failures, which are a red run:

    em dash                 anywhere
    the count               the figure below 112, in a user facing string
    preamble                a line announcing that a thing is starting
    soft                    the category lexicon, thirty terms
    filler                  simply, kindly, please note, no worries, oops
    bang                    an exclamation mark
    caps                    all caps in copy, with the real initialisms exempt
    naked number            a run time value with no unit, in rendered and in
                            template form

Rates, reported against the house rate for the same measure, per file:

    antithesis              X not Y, not X but Y, rather than
    gloss                   , which is
    it-is open              a sentence opening on a demonstrative copula
    reassurance             flagged for a person to rule on, never failed
    sentence length         median, p90, p95, share over 25 words

### What It Cannot Check, And Says So On Every Run

Four things, and they are the four that decide it. The gate prints this block
at the end of every run rather than producing a score, because a score with the
unmeasurable part left out is a lie about how much has been checked.

1. **Is it true.** No regex reads a claim against a reading.
2. **Is it one bucket.** A string that is two passes every mechanical gate.
3. **Does it land for Angela, Derek and James.**
4. **Rhythm.** Where the sentence breaks.

### The Gate Was Checked Against Known Good Cases First

The first cut of the naked number gate reported seven findings and five were
wrong: it flagged `KB_OF` at `ui/knowledge.js:273`, which is the correct
pattern and the one V7 holds up as the model, and a glued mid sentence
fragment in `ui/panels.js`. It now requires a run time value immediately in
front of the literal, and it reports two, both real. A tool that lies is worse
than no tool. If you extend the gate, break a known good line with it first.

### The Rest Of The Checking Is Already Built

    python3 .claude/skills/atuned-voice/check.py --objections
                                          his own objections, V18 to V20
    python3 tools/objections.py           renders COPY-OBJECTIONS.md and .html
    python3 tools/terms.py                terminology drift, V14
    node tests/design.js                  all caps, type floor
    ./atuned_src/BUILD.sh                 em dashes, and it is a build gate
    node tools/shots.js OUT 1600 1000     then LOOK at the images

---

## 7. The Evidence

Four before and afters off shipping copy. The rate figures are from a run of
`check.py --baseline` on 20 September 2026 and are dated on purpose: run it
again rather than quoting them.

### The Release Opening. The Clearest AI Six In The Product.

`ui/release.js:8` to `:11`. Seven lines, held 2.2 seconds each by `RUN.speed`,
so 15.4 seconds of preamble before the first address appears. Quoted exactly:

    var OPENING=['Welcome to release and reframe.','We will be here for a few minutes.',
     'Find a quiet space. Sit back and relax,','and turn your senses inward to feel what is released.',
     'As the words repeat, follow along in thought.','Feel what the body is doing as the energy goes.',
     'Let us begin.'];

Named against the rules, line by line, and this is what "it feels like AI"
turns out to mean when it is made checkable:

    1  Welcome to release and reframe.          V1. Reads the heading aloud.
    2  We will be here for a few minutes.       V1, and it is vaguer than the
                                                product: the previous screen
                                                already prints the run length
                                                computed from RUN.speed.
    3  Find a quiet space. Sit back and relax,  V2. An outcome given as an
                                                instruction, in the register of
                                                the shelf the brand refuses.
    4  and turn your senses inward to feel      V4, and the passive hides the
       what is released.                        agent. Inward to where.
    5  As the words repeat, follow along in     V6. Instruction and Definition
       thought.                                 in one string.
    6  Feel what the body is doing as the       V3. No mass, no direction, no
       energy goes.                             address.
    7  Let us begin.                            V1. Nobody says this.

Proposed, and it is a finding for `TASKS.md` and not an edit, because another
seat is in this copy right now:

    var OPENING=['Sit down. Put both feet on the floor.',
     'Each line names one pattern. Follow it in thought as it lands.',
     'Keep some attention on your body, and notice which place answers.'];

Three lines, 6.6 seconds instead of 15.4. Every line is one bucket. The somatic
work that line 4 was gesturing at is done by line 3 with a place in it. "In
thought" is kept because it is already the product's term and V14 applies. The
gate is clean on it:

    $ python3 .claude/skills/atuned-voice/check.py --line "Sit down. Put both
      feet on the floor. Each line names one pattern. Follow it in thought as
      it lands. Keep some attention on your body, and notice which place
      answers."
      no hard failures

### The Allowance Number

    FAIL  ui/release.js:197    +((RUN.plan||[]).length)+' of your allowance'
          renders as           25 of your allowance
    FAIL  engine/plan.js:155   say:giftLeft+' of the gift left'
          renders as           92 of the gift left
    FIX                        25 patterns of the 92 you have left
    FIX                        92 patterns left of the hundred

V7. `planAllowance` already returns `left` and `of`, so neither fix needs a new
field. The free grant is ten patterns a week against a run cap of twenty five,
which is why the first one does not merely read oddly: it reads as a bill.

### The Onboarding Card

`ui/onboard.js:145` to `:146`, two of four cells:

    FAIL  ['You write what happened','in your own words, not a questionnaire'],
    FAIL  ['It finds where that sits','a place in the body, not a label'],
    FIX   ['You write what happened','the day, in your own words'],
    FIX   ['It finds where that sits','a named plexus or a named nerve'],

V10. Measured, `onboard.js` runs antithesis at 14.3 per cent of its sentences
and the demonstrative copula opener at 9.5 per cent, against a product rate of
2.7 and 3.3. It is the worst file in the product on both, and it is the first
screen a person sees. The fixed left cell is not new copy: it is already at
`ui/component.js:412`.

### The One The Repository Already Fixed

    FAIL  ui/imprints.js:87    Nothing held. Write in the box and it gathers
                               here.
    SHIPS ui/imprints.js:89    You have not written anything yet. Whatever you
                               write gets pulled apart and collected here.

V5, and the file keeps the dead line in a comment so the rule can be read off
the repair. That is the practice this whole skill is copying.

### And The Counter Example, Which Is Where The Voice Already Works

`funnel/questions.js`. A hundred items, and not one of them fails a gate. The
reason is structural and it is the single most portable thing in this document:
**every item is a physical event, in a body, in a room, on a day.** Not a
trait, not a feeling, not a self description.

    You hold a room well and then sit in the car a while before you drive.
    Your hand is on the phone before you notice deciding to reach for it.
    You say yes while your chest tightens, because no is going to cost more
    than you have.
    Somebody asks how you are and the answer is out of your mouth before you
    have checked.

That is Encarta's grammar, with Encarta's one prohibition lifted and nothing
else added. Present tense. Concrete nouns. No adjective doing the work. The
definition in the first clause. Second person, because the subject is reading.
A cost named. No comfort anywhere.

**And they are the longest copy in the product.** Measured: median 12 words
against a house median of 6, p95 of 18 against 16, and zero hard failures. That
is the most useful thing on this page and it is worth stating on its own line so
nobody mistakes the gate's output for a target. Short is not the test. Naming an
event is the test, and a sentence that names one is allowed to take twelve words
to do it. A six word sentence that names no event is the shorter failure.

When a line is not working, the fastest repair in this product is to ask what
the physical event was, and write that instead.
