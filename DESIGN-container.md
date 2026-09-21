# DESIGN-container.md

The journal is a container. Ruled 21 September, twenty second pass,
`TASKS.md` section 08i, CN1 to CN5 and TS1 to TS3. His words:

> Our journal is a container. It is a sacred space. In this space we speak
> freely. We speak from the heart. We dig deep. And we communicate in simple
> terms, in simple words, the truth of our experience. And in that story, our
> essence is revealed. So there is something in there as a mechanic that needs
> to be treated as a container.

    prototype   proto/container/index.html
    logic       proto/container/container.js
    prompts     proto/container/prompts.js       the set, with what each surfaces
    answers     proto/container/answers.js       one worked answer a prompt
    measure     proto/container/measure.js       scans every answer, real engine
    harness     proto/container/shots.js         shoots ten states, both widths
    engine      referenced at ../../engine.js, never copied
    read with   DESIGN-story4.md, which this arrived after and does not replace
    gate        python3 .claude/skills/atuned-voice/check.py, no hard failures

This ruling arrived after the four story page designs, so it is read against
them. It is not a fifth design. The four disagree about what the inside of a
container looks like. This is the container: what opens it, what closes it,
what leaves it, and who can see in. The prototype carries the mirror on the
inside, because that is the design `DESIGN-story4.md` recommends, and the
mechanic holds whichever belief he rules.

---

## 0. Take the word mechanic literally

He said mechanic, not atmosphere, and the difference is checkable. A container
has an inside and an outside. Something opens it. Something closes it. There
is a rule about what leaves it and who can see in.

A text box with a placeholder has none of those properties. Measured against
what ships today:

    property            ships today
    an outside          none. the journal is one field, always open
    an opening          none. it is already open when you arrive
    a closing           Commit, which is a save and not a close
    a rule about
      what leaves       none stated on the surface
    who can see in      not a question the surface can answer

Five properties, none of them present. So the journal is not a container that
needs decorating. It is a field that needs a lid.

**What is already true and is kept.** The engine does not mutate on a parse.
`parseStory` reads and `applyStory` writes, and they are two calls. The lid is
therefore not a new boundary in the engine, it is the first surface that draws
the one that was already there.

---

## 1. The mechanic, in one paragraph

A container is one bounded writing session with a lid. A key opens it and the
key carries the question. Inside, one container is the only thing on the
screen, the sniffer writes in the margin while you write, and nothing has
landed anywhere. Two things close it. **Seal** goes through an acknowledgement,
one card a line, where you say what is yours and what is not, and then it
lands: the reading crosses the seam and the words do not. **Empty** closes it
and keeps nothing. A sealed container sits on the shelf as a lid: a key, a
date, a number, a seal state, and the list of who can see in. Sight is granted
per container and never per account, in two rungs that are two grants, with a
clock, a ledger and one press to close it, and a container can be opened shut
at the start, before the writing, so the share control never exists for it at
all.

---

## 2. The six properties, and what each one is

Each says what a person sees, what they do, and what the engine does
underneath.

### 2.1 The outside, and it is a shelf

**Sees.** A column of lids. Each one carries the key it was opened with, the
date, the container's number, a seal glyph, and either **No sight** or
**Sight, 1**. Not one word of the writing.

**Does.** Presses a lid to read a sealed container. Presses a key to open a new
one.

**Engine.** Nothing. The shelf is a list of ids and states. A lid is drawn from
metadata only, which is what makes it the outside: being outside means not
seeing the words.

**Why the lid shows sight.** A sight list in a settings page is a list nobody
reads. On the lid, a person cannot look at a container without seeing who else
can. Standing ruling: a visible list of who has sight.

### 2.2 The key, which opens it and carries the question

**Sees.** Four rings: **Plain**, **Descent**, **Sin**, **Year**. Pressing one
deals a single question at the size of a question, with three controls: **Open
it**, **Another one**, **See all 9**.

**Does.** Opens a container on that question.

**Engine.** `openWith(id)` mints a container number and nothing else. No text,
no parse, no charge, and no row anywhere else in the product. A container that
has not been sealed has put nothing anywhere.

**The ring deals one key, it does not list them.** The first cut printed every
prompt in the ring and measured 23 simultaneous choices on the shelf at 1600,
against a standing target of twelve and a working memory of about four.
Fifteen questions about your own failures laid out in a column is a screen
somebody closes. One question and a control to deal another is seven choices on
the shelf and eleven with a ring open. The whole list is one labelled press
away, because a control with no affordance is the same as no control.

### 2.3 The inside, and the sniffer in the margin

**Sees.** The question, the field, and the instrument writing in the right
margin with a leader out of each word it read. Above it, the lid as a strip:
the key, **Open**, the number, and the sight state. Below it, three controls:
**Empty it**, **Leave it open**, **Seal it**. One line under them: *Nothing has
landed yet. Sealing is what lands it, and sealing goes through what the sniffer
read.*

**Does.** Writes, or records.

**Engine.** `parseStory` on every keystroke, and `marksOf` to place the marks
back on the letters the scanner actually scored. `applyStory` is not called.
Measured over 77 keystrokes: median 0.4 ms, 95th 0.9 ms at 1600, against a
16.7 ms frame.

**And this is where his line about the sniffer goes.** It is on the empty
margin, where it is true, and nowhere else:

> The sniffer. You may not see yourself in the story. This reads the patterns
> driving it, and writes what it reads here, beside the line it came from.

His own words are the source: *"you may not see yourself within the story,
especially when you start out, but this thing is sniffing all the patterns that
are driving your psyche."* It is the best short account of the instrument
anybody has written for it, and the one surface where it is literally true is
the one a person is writing on.

### 2.4 Two closes, and they are different

**Seal.** Goes through the acknowledgement, then lands. The container joins the
shelf, the reading crosses the seam, the words stay. The ledger takes a dated
line.

**Empty.** Closes and keeps nothing. Two steps: the first press relabels the
control to **Empty it. The words go.** and the status says what the second
press will do. Undo does not reach this one, because the words being gone is
the point rather than a side effect, so the error is prevented at the control
instead of apologised for afterwards. `UNDO_MAX` is zero and the stack is
unlimited, so an emptied container could be restored, and it deliberately is
not: a container a person cannot actually empty is a promise the product did
not keep.

**Leave it open** is not a third close. It goes back to the shelf with the
container still open and off the shelf, which is what an open container is.

### 2.5 The seam, and it is the rule about what leaves

Three things cross, and nothing else.

    the reading leaves    seats, fetters, weights and the route. it lands on
                          the body, the field and the summary.
    the words stay        no surface outside the container prints a sentence a
                          person wrote.
    one line is lifted    by hand, one at a time, in the acknowledgement.

**The second one is the standing ruling made into a mechanic.** `DECISIONS.md`
says the record and the story are never held joined, and that a cohort lead
sees the outputs and not the story cloud. Today that is a promise in a
document. Here it is a wall on a screen with two panels either side of it,
headed **The reading** and **The words**, and the second one says *These
stayed. Nowhere else in the product prints them.*

**The third one is his content chain.** *"What a person enters in the journal
is added to the imprints. Part of that becomes a story they have to release.
Part becomes a practice inside the ritual. Sometimes it becomes an affirmation,
also in the ritual."* Lift is that route, and it is one press on one line,
after that line has been acknowledged. The control does not exist before the
line is yours, which is the state change earning the affordance rather than
hiding it. The status says what it did: *Lifted. That line is in the ritual and
it is the only one of your words that left this container.*

### 2.6 Sight, which is the sharing

Its own section, because it is the half he ruled in the same breath.

---

## 3. Sharing. The unit is the container

His words:

> That container can be shared with a practitioner. So there is a connection
> between the container, the cohort, and the practitioner. Your unique number
> gets paired up with the friends.

**That settles a question the practitioner work had open, and it settles it the
safer way.** `DECISIONS.md` contradicts itself on this and has done since the
practitioner section was written: the tier table says a cohort lead sees the
outputs and **not the story cloud**, and the practitioner section says a
practitioner sees *"first name, last name, date of birth, what has been
released, what has not, the structure, and the stories."* Those cannot both be
true. The container answers it: nobody is granted the stories. A person grants
**one container**, once, by hand.

**Six properties. Four of them are how it refuses.**

    scope       two rungs, and they are two grants. The reading is seats,
                weights and the route. The words are the sentences. The reading
                is the default and the words is a second control with its own
                line beside it.
    the clock   every grant expires. Fourteen days by default, and the sight
                row counts down. Nothing is granted forever.
    the number  a container travels as a number. What a practitioner is handed
                is "no 4830" and a scope. The name never leaves the device,
                which is the standing ruling and is also exactly what he said:
                your unique number gets paired up with the friends.
    shut        set at open, before the writing. A container opened shut has no
                share control at all. Absent, not disabled, with Shut on the
                lid and one sentence in the sight panel saying why.
    one at a    there is no share all and no share my journal. Sight is granted
    time        per container, by hand, every time.
    the ledger  every open, seal, grant, expiry and revoke is a dated line on
                the lid. Nothing about sight happens quietly.

**Nothing is retroactive.** Adding a practitioner grants nothing. A container
sealed before a practitioner existed is not visible to them and never becomes
visible without a press.

**Revocation is one press,** labelled **Close it**, on the row of the person
who has sight, and it reports: *Closed. Ilse Coetzee-Nakamura cannot see this
container any more.*

### How it refuses, said plainly

A container a person can share is a container a person can be pressured to
share. A partner, a manager, a parent, a practitioner who should not be asking.
Four things are doing the refusing and none of them is a warning message.

1. **The decision is made before the writing.** Shut is set on the shelf, at
   open, when nobody is in the room asking. A person who knows the next thing
   they write is not shareable opens it shut, and there is then nothing to
   press under pressure. The control is absent, so there is no dialog to
   navigate and no clicking through.
2. **The reading is the unit that can be handed over.** Under pressure a person
   has something true to give that is not their sentences: seats, weights, a
   route. The second rung exists and is a separate press with its own line.
   Most of the value a practitioner actually needs is in the first rung.
3. **There is no bulk.** A person being pressured has to be pressured once per
   container. Forty containers is forty presses, and the cost of coercion rises
   with the amount of harm it could do, which is the right shape.
4. **The clock runs down on its own.** A grant made under pressure ends without
   the person having to go back and end it, which is the part that is hardest
   to do.

**What this does not fix, said rather than left to be found.** A person can
still be watched over the shoulder while they write, and a person can still
copy their own words out by hand. No mechanic reaches either. And a story is
free text, so a third party's name can be inside it: that is the open item
already recorded in `DECISIONS.md`, stripping named entities on device, and it
is not resolved here.

---

## 4. The prompts, and they are measured

His words:

> That makes the prompt questions for the journal very specific. Almost like
> when have you been type questions. When was the last time?

A prompt that asks somebody to describe themselves gets a description. A prompt
that asks when something last happened gets an event, and an event carries the
charge.

### 4.1 The two clause rule, and it is a measurement rather than a taste

**Every prompt has two clauses: the event, and what it cost.**

The first cut had the event clause only. Measured against the running engine,
one worked answer a prompt, written the way one of the six reference people
would write it:

    event clause only          the sniffer reads 18 of 38, and scores 19 hits
    event and cost clause      the sniffer reads 38 of 38, and scores 87 hits

**The reason is in the lexicon and not in the writing.** The event clause gets
a scene, and a scene is mostly nouns, people and dates. The charge is in the
aftermath, which is where a person reaches for the words the scanner actually
holds: tight, exhausted, sick, bracing, dreading, could not stop, mortified. A
prompt with no cost clause is asking for the half of the sentence the
instrument cannot read.

This is the same finding the voice skill records about `funnel/questions.js`,
arrived at from the other end. A hundred questions there, zero hard failures,
and the structural reason is that every one of them is a physical event in a
body, in a room, on a day, with a cost named. The prompts are the questions run
backwards: the same shape, asked instead of asserted.

### 4.2 The four keyrings

**Plain, 15.** No angle. For a day a person already knows the shape of.

**Descent, 9.** One a circle, generated off `CIRCLES`. The Compass already
prints `see` as a first person sentence about the person. The prompt asks them
the same thing.

**Sin, 7.** Asked as acts. Five of the seven are also circle names and that is
not a duplication: a circle asks what condition you are in, a sin asks what you
did. Two questions off one word, and the second one is answerable.

**Year, 7 here and 16 in the product.** Ages three to eighteen are his own
questions and are kept verbatim from `AGES`, with the cost clause appended
where they did not carry one. Past eighteen the years come in fives, generated
off the person's own age, on two forms.

### 4.3 The set, with what each one surfaces

Read the `s` column off `proto/container/prompts.js`, which carries it beside
every prompt. The measurement, off `node proto/container/measure.js`:

    prompts                     38
    the sniffer reads           38 of 38. none dead
    hits                        87, median 2 an answer
    imprints                    175, 19 named by the words, 156 by the fallback
    answers where every
      imprint is inferred       29 of 38
    seats touched               solar 22, throat 20, sacral 14, heart 5,
                                root 4, crown 4, third eye 3, coherent 3

**One prompt in the set takes charge off.** P12, *When was the last time you
slept well, and what was different about that day?* A prompt set that only ever
asks what is wrong builds an instrument that only ever reads load. The engine
has fifteen coherent words and `applyStory` already pulls the other way on
them. One question in fifteen aims at them.

### 4.4 The measurement that decides what the acknowledgement may say

**175 imprints, 19 named and 156 chosen by the fallback. 29 of 38 answers
produce nothing but inferred addresses.**

`parseStory` marks an imprint `inferred` when the seat was read and the address
under it was picked by the fallback, and the comment beside it forbids a
renderer printing the name as a finding when that is true. At this rate, a
surface that ignores the flag is naming an address the sentence never gave it,
four times out of five.

### 4.5 A defect the descent keyring found, and it is not mine to fix

`DANTECUE` carries the cue phrases the nine circles are recognised by.
**Sixteen phrases, and `scanStory` reads one of them.** The other fifteen are
in a different table from `LEX`, so the scanner has never seen them:

    Limbo             none of it is real, just brain chemistry, all in the
                      mind, nothing means anything really
    Gluttony          ate until, filled the gap with, instead of calling,
                      something to take the edge
    Greed             never enough, what i am worth, cannot afford to,
                      they have more
    Wrath and sloth   did not get out of bed, could not move all, went off at

As reference material that is harmless. As a keyring it is a door onto a parser
that cannot read what comes through it: a person answering the Greed prompt in
the Greed vocabulary is read by nothing. Folding the fifteen into `LEX` with
the seats `CHG2SEAT` already gives them is the fix, and it belongs to the
engine seat. It is the same defect class the sniffer's canon pass already
repaired once: a scoring layer and a reading layer that did not share a
vocabulary.

---

## 5. His three angles as ways in, and what changes

> I had to use Dante's Inferno, and then the seven deadly sins, and then my
> age. Different trajectories and angles at which to see myself. And even then
> I had to acknowledge the answers.

The product carries all three today. It carries them as things a person reads
about themselves. A reference surface hands somebody a description. A key makes
them write. Four things change.

**One. `CIRCLES[i].see` changes job.** It is already a first person sentence:
*"I already know how this works, and I stop listening once I have decided."*
Today the Compass prints it at a person. As a key it becomes the second half of
a question they answer. Same sentence, opposite direction, and only one of the
two produces a story the sniffer can read.

**Two. `circleAt` stops being the only route to a circle.** It picks one off
the coherence score and returns null above 41, so above the median band the
descent does not exist. As a keyring all nine are always available, because
choosing your own angle is the whole of what he described. The computed circle
stays and is still shown as the one the instrument reads. Both, not one.

**Three. `AGES` moves out of a drill and onto the ring, and grows an adult
half.** It stops at eighteen, which is right for the identification audit it
was built as and wrong for his own route, which was his age. Past eighteen the
years come in fives off the person's own age.

**Four. The sins get a surface for the first time.** They exist only as the
`sin` column of `CIRCLES` and no surface prints them. Seven acts, asked in the
past tense.

**And what does not change.** No new canon, no new table. All three rings are
generated off tables the engine already carries, so a prompt cannot fall out of
step with the material it came from. If he retunes a circle, the key retunes
with it.

---

## 6. The acknowledgement, which he named and nothing has

> And even then I had to acknowledge the answers.

**Seal goes through it and cannot skip it.** One card a line the sniffer read.
Each card quotes the person's own word, says what the instrument read out of
it, and offers two doors: **Mine** and **Not mine**. **Seal it** is disabled
until every line has an answer, and the count reads *4 mine, 1 not mine*.

**What a refusal does.** The line does not land. The charge it carried is not
applied. The refusal is kept on the container.

**Why the refusal is kept.** The count of what a person refuses is the
sniffer's own accuracy on that person, and it belongs to them. *The sniffer is
your truth* means the person rules on the reading, not that the reading rules
on the person. An instrument that cannot be told it is wrong is not a mirror.

**What a card is allowed to say, and it is narrower than the engine's own
flag.** `parseStory` marks `inferred` per band, not per word, so one word
naming a fetter makes the whole band named and the next word at that seat
inherits it. Reproduced on the worked story: **angry** names Anger at the solar
plexus, and **ashamed** then came back as Shame landing on Pride, because Pride
is what Anger resolved to. That is the instrument putting a word in somebody's
mouth on the one screen whose entire job is asking whether the word is theirs.

So a card asks the narrower question. The address is printed only when **this
line** carries the fetter the imprint was filed under. Otherwise the card says
what it actually knows:

    named        You wrote stayed quiet. It reads as Silenced and goes to the
                 throat. It lands on Self-Silencing.
    not named    You wrote ashamed. It reads as Shame and goes to the solar
                 plexus. The seat is read. Nothing in this line named a place
                 in it.

This changes what is said and not what is computed. The band keeps whatever
`parseStory` ruled.

**Three defects the first cut of the card had, all found by looking at the
picture.**

- *It reads as Throat and goes to the throat.* Where the scanner placed a word
  and named nothing, the read name fell back to the band and the sentence said
  the seat twice.
- *At a weight of 16.0.* The scanner's amount runs to about 28 and the charge a
  person reads anywhere else in this product runs to 10, so the card was
  printing a number against a denominator nobody has. The weight is off the
  card. It is summed on the sealed reading, normalised on `parseStory`'s own
  `Math.min(10, total/3)`, where it is one number on the scale every other
  surface uses.
- *It lands on Anger* under *It reads as Anger*. Eleven of the 112 addresses
  carry the name of the fetter they sit under, so one fact arrived stuttered.

**And a refused line is not a disabled line.** The first cut dimmed the whole
card to half opacity, so the two doors on it read as greyed out and a person
could not tell a refusal from a control that had stopped working. The slot
keeps its label and the value carries the state: the card keeps its weight, the
rule down its left edge goes to the dim ink, and the door that was pressed is
the one wearing the accent.

---

## 7. The truth sniffer on this surface

`TS1`: *"The sniffer is your truth. It is your truth sniffer."*

The acknowledgement is that sentence built. Everywhere else in the product the
sniffer's output arrives as a finding. Here it arrives as a claim the person
rules on, one line at a time, before anything lands. That is the difference
between a truth sniffer and a verdict.

`TS3`, whether Truth Sniffer is a name in the product or a mark to register, is
already open in `TASKS.md` with its snapshot and is not reopened here. What
this design needs from it is one thing: the margin heading is currently **The
sniffer** and the ruling decides whether it is **The truth sniffer**.

---

## 8. The measurements

Off `proto/container/shots.js`, which shoots and measures in the same run.

| state | choices, 1600 | above the fold, 1600 | choices, 390 | above the fold, 390 |
|---|---|---|---|---|
| shelf | **7** | 7 | 7 | 7 |
| a ring open | 11 | 11 | 11 | 10 |
| inside, empty | **5** | 5 | 5 | 5 |
| inside, holding | **5** | 5 | 5 | 5 |
| acknowledge | 12 | 8 | 12 | 4 |
| acknowledge, answered | 16 | 11 | 16 | 6 |
| sealed | 2 | 2 | 2 | 1 |
| the grant | 6 | 6 | 6 | 1 |
| shared | 3 | 3 | 3 | 1 |
| opened shut | 1 | 1 | 1 | 1 |

    under 44 by 44                          0, every state, both widths
    horizontal page scroll at 390           none
    requests not on file://                 0
    the page's own fetch and XHR log        0
    page errors and console errors          0
    ink redraw, 1600                        median 0.4 ms, 95th 0.9 ms, 77 frames
    ink redraw, 390                         median 0.4 ms, 95th 0.8 ms, 77 frames

The redraw is measured on a typed story rather than a pasted one, because the
draw this page has to hold to a frame is the one that happens on every
keystroke, and two samples off a paste is not a distribution.

**The standing item is 57 to 71 simultaneous choices per screen, against a
target of twelve.** Every state here is under twelve except the
acknowledgement, which is two doors a line and is a single task screen: at five
lines it is twelve, at eight it would be nineteen. That is the one number in
this design that grows with the person's writing, and the answer if it needs
one is to page the acknowledgement rather than to shorten the reading.

**Three defects found by looking at the pictures, not by reading the CSS.**

- **A class named for a concept collided with a class named for the same
  concept on a different element.** The sight panel was `.sight` and so was the
  lid's tag, so `.tag.sight` matched both, took the panel's 16px of top
  padding, and came back eleven pixels taller than its neighbour. One lid
  looked broken beside two that did not. The panel is `.sbox` now.
- **Two native checkboxes measured 20 by 20 against a floor of 44.** A
  checkbox cannot be made 44 by 44 without lying about where its target is.
  Both are the product's own ring treatment now: the mark is a ring, the state
  fills it, and the whole control is the target.
- **The key was printed twice,** once on the lid strip and again as the
  prompt's eyebrow, sixty pixels apart.

---

## 9. The port, and what it touches

Nothing in `atuned_src/` has been touched.

**What the container needs that does not exist.**

    the lid                 a new renderer. about 40 lines. metadata only, and
                            it must never read the story text.
    the shelf               a new surface, or the story page's own first state.
    the keyring             about 60 lines, all of it generated off CIRCLES,
                            AGES and the prompt table.
    the acknowledgement     a new surface, about 120 lines, reading
                            PARSED.hits and PARSED.imprints only.
    the narrower named
      test                  about 8 lines, in the acknowledgement's own
                            renderer. It computes nothing new.
    seal and empty          the two closes. applyStory is called once, on seal,
                            with the refused lines removed.
    sight                   a record store question and not a renderer
                            question. The renderer is about 90 lines.

**What it needs from the engine seat, and none of it is mine.**

    applyStory takes a
      filter                today it applies every imprint the parse produced.
                            The acknowledgement needs it to apply a subset.
                            One argument, and the body is otherwise unchanged.
    DANTECUE into LEX       15 of 16 cue phrases are unreadable by scanStory.
    inferred per word       parseStory marks it per band. The acknowledgement
                            wants it per word. The narrower test above is a
                            renderer working around this, and the right fix is
                            in the parse.

**Gates the port has to clear.** The list in `DESIGN-story.md` section 9,
unchanged, plus `python3 tools/terms.py`, which has one thing to settle before
the port and not after: the word for taking one thing out. This design says
**Empty** for a container, **Close it** for a grant, and **Not mine** for a
line. Three different acts and three words is correct under V14. What needs
checking is that none of them collides with Clear, which the writing field
already uses.

---

## 10. The questions that are genuinely his

Two. Everything else in this document is a decision and is recorded as one.

### 10.1 Does the words rung exist at all

> **What it is.** Sight is granted in two rungs. The reading is seats, weights
> and the route. The words are the sentences the person wrote. This design
> builds both, with the words as a second control carrying its own line.
>
> **At stake.** Whether a practitioner can ever read a person's own sentences.
> `DECISIONS.md` currently says both: the tier table says a cohort lead sees
> the outputs and not the story cloud, and the practitioner section says a
> practitioner sees the stories. One of the two has to move.
>
> **Either way.** With the rung, a practitioner can do the work they are for,
> and the promise becomes "never without a press" rather than "never". Without
> it, the promise is absolute and simpler to keep, and the container still
> shares everything the instrument computed. The safer answer is to cut the
> rung, and the reason not to cut it without asking is that somatic work on a
> story a practitioner cannot read is a real loss, not a theoretical one.
>
> **Look at.** `DECISIONS.md` lines 33 to 36 and 149 to 155, and
> `proto/container/container.js`, the sight section.

### 10.2 Does a refusal change what the instrument says next

> **What it is.** Marking a line **Not mine** stops it landing and is kept on
> the container. It does nothing else.
>
> **At stake.** Whether the sniffer learns. A person who refuses Pride forty
> times is telling the instrument something, and today it is only telling the
> ledger.
>
> **Either way.** A record only, and the refusal count is an honest measure of
> the instrument's accuracy on this person that neither side can argue with.
> Fed back, and the instrument stops saying a thing it keeps being told is
> wrong, which is either a better reading or a mirror that has learned to
> flatter. A person at level 3 who is defended refuses true readings, and an
> instrument that quiets down when refused would go quiet exactly where it
> matters.
>
> **Look at.** `atuned_src/engine/sniff.js`, `parseStory`, and the `inferred`
> comment it carries.
