# Copy. The buckets and how each one is written.

Ruled by the owner. Every string in this product belongs to exactly one bucket
and each bucket has its own shape. A string that does not fit a bucket is a
string nobody decided on.

## The voice, in five words

**Grounded. Direct. Humble. Insightful. Specific.**

Nothing abstract. No soft wellness language. Physical metaphors only. Short
sentences. No em dashes, anywhere, including commit messages. Sentence case, no
all caps. Never say 108; the count stated to users is 112.

The test: **read it out loud.** If you would not say it to somebody sitting
across from you, it does not ship. "Set the root, the archetypes, and the nine
poled axes" fails that test and was on the first screen for months.

## The seven buckets

### 1. Menu

A place you can go. Tabs, rail sections, tab strips.

    ONE WORD. And the word names exactly what the surface does, not what
    it is about and not what it belongs to.

    Energetics   not Intake        a person does not perform an intake
    Body         not Energy        Energy named the subject, Body is on screen
    Fetters      not Child fetters "child" is schema, not information
    Laws         not 21 laws of integrity
    Reading      not The reading   an article is not a word
    Running      not What is running
    Flow         not Flow through

No article, no qualifier, no count in the label. A count belongs on the badge.

### 2. Label

Names a control or a slot. Two or three words, and it never changes with the
data. A label that changes identity when the value moves makes a person
re-parse the layout every time.

    Profile      not Whose field
    Myers-Briggs not Type, if you know it
    Carrying     not Held
    Filled in    not Installed

### 3. Value

The reading itself. A number, a word from a fixed table, or a dash.

    Never invented. A percentage is never printed off a default, and a band
    word never appears without its meaning beside it.

    A dash is the honest glyph for "not read yet". It is not zero.

### 4. Definition

What a term means, said where the term is said. One or two sentences, in the
words a person already has.

    Not in a tooltip alone. A touch screen cannot reach a tooltip and the
    audience arrives on phones.

    "Oscillating" alone is a word a person has to already know. "Oscillating.
    The field spends as much as it builds. Nothing is compounding in either
    direction." is a definition.

### 5. Instruction

What to do, and what will happen when you do it. Second person. Active. The
verb is the first word where the sentence allows.

    Write what happened. The day, in your own words.
    Run the protocol here. Four channels, twenty five lines.

Never "click here". Never a control that says only what it is.

### 6. Reading

The prose the instrument speaks: the story summary, a drill, a finding.

    Every clause is conditional on the value it names existing. A person with
    no birth data gets a sentence saying so, never a paragraph of hedges.

    Say the number, then say what it means, then say what it costs. In that
    order.

    Nothing here is generated from anything the instrument has not measured,
    and the copy says so once at the end rather than hedging throughout.

### 7. Refusal

When the product cannot do something or will not claim something.

    Plain, one sentence, no apology, and it names what would change it.

    "Nothing is held here, so there is nothing to release. The protocol opens
    once this address is carrying."

    Never "oops". Never an exclamation mark. Never a control that offers an
    action it will then refuse.

## Things we never do

- **Read the schema out loud.** "nine poled axes, held state then coherent
  opposite" is a data model. "Nine feelings. The left slider is how much you
  carry it, the right is how much of its opposite is in place" is copy.
- **Name a person off a default.** The band word waits until the measured
  identification earns it.
- **Print a count against a total.** A reading is not a score.
- **Use two words for one concept.** Held, installed and firing are three
  states and keep three words. Everything else gets one.
- **Put the only copy of a definition in a tooltip.**
- **Claim success before we have it.** Every write that can fail reports
  through `status()`.
- **Abstract nouns as headings.** "Awareness" survives because it is a named
  rung in the codex. "Insights", "Journey", "Wellness" do not exist here.
- **Address the product to itself.** "Nothing held. Write in the box and it
  gathers here" is the product narrating. "You have not written anything yet"
  is talking to a person.

## Ruled 27 September

Three rulings in one message, `TASKS.md` GG. Each sharpens "Nothing abstract"
above rather than adding a new voice.

### Say what it is. Never define a state by what it is not.

His words: "I think the language for our copy needs to be... 'A mask is not a
fault and it is not a stage you fail to leave.' Like, that's too abstract.
Simplify it."

A sentence that defines a state by denying two things a person might fear has
told them nothing. It sounds wise and it cannot be pictured. Say what the thing
is, then what it does, in words a person could catch themselves at this week.

    Before   A mask is not a fault and it is not a stage you failed to leave.
             It is a shape held in front of the seats it covers, and it costs
             what holding it costs.
    After    A mask is a way of acting you learned at one age and still use.

The line he quoted ships at `ui/drills.js:607`. Two denials, then a shape with
no size, then a cost defined as itself. The replacement is one sentence with a
verb a person does.

The test: **can a person picture it?** If a sentence needs somebody to unpack
it, it is cut. The signs, in the order they turn up:

    a definition that opens on "is not"
    a cost defined as itself            "it costs what holding it costs"
    a noun nobody can touch             shape, stage, space, journey, energy
    a line that would be true of anybody

It is V10 and V20 of the voice skill applied to psychological states, where the
temptation is worst, because a state is the thing a writer most wants to sound
deep about.

### A load says what it means, in the same sentence

His words: "And when you say load 1.9 from now on, tell what the load means. A
load of 1.9 means the nerve is mildly impaired. Affecting these organs and could
impair blood flow."

**A load, weight or charge figure never stands alone.** In the same sentence,
or the one straight after it, it carries:

    1  the word for where it sits on the curve     a little tense
    2  for a mean, how many addresses are held     3 addresses under it
    3  the nerve it sits on                        the vagus nerve
    4  what that nerve runs in the body            the voice box, the heart

His line is the template, and the order is his: the number, what it means,
the organs, the blood.

**The curve is his, and it is already in the engine.** `engine/compute.js:183`
to `:203`, the lever's bell, fitted to his own words on 25 September. Load is
charge on a scale of 0 to 10, at one address or averaged over the addresses
under a mask. The pull is how much of what a person could express that load
takes back.

    load       word             from                                  pull
    0          nothing held     the empty state, one wording          none
    under 3    a little tense   his words, at 2                       almost none
    3 to 4     tense            under the line. Held starts at 4      5 to 21%
    4 to 6     held             "the range we travel", his words.     21 to 79%
                                5 is his average, and pulls half
    6 to 8     heavy                                                  79 to 99%
    8 and up   locked           his "paralyzed" is 9                  over 99%

Held is the existing word for an address at 4 or over, so it keeps its
meaning. "A little tense" and the range we travel are his. Tense, heavy and
locked are drafts: physical, one word each, and his to overrule.

**Where the organs come from, and the line they do not cross.** The engine
names the nerve at every address (`engine/data/nodes.js`, the `n` field) and
the plexus at every seat (`engine/data/catalog.js`, `nv`). What a nerve runs is
anatomy, a fact about the nerve. The instrument measures what a person
reported, placed at that nerve. It does not measure an organ. So the sentence
names what the nerve runs and never says the organ is damaged. Blood flow is
named only where the nerve itself sets how wide the vessels open, which the
autonomic plexuses do and a muscle nerve does not. Where a nerve runs no organ,
none is named.

**One count, never a count against a total.** "3 addresses under it are held",
never "3 of 12". A reading is not a score.

Worked, off the reference profiles, headless through `engine.js`. Each line
went through `check.py --line` with no hard failure.

    His      A load of 1.9 means the nerve is mildly impaired. Affecting these
             organs and could impair blood flow.

    James    Load 2.1, a little tense. 3 addresses under it are held. The
    Teen     heaviest sits on the pharyngeal nerve, which runs swallowing and
             the back of the throat.

    Derek    Load 3.4, tense, just under the line. 12 addresses under it are
    Preteen  held. The heaviest, Pride at 5.4, sits on the celiac plexus. That
             nerve hub runs the stomach, liver, pancreas and spleen, and sets
             how far the blood vessels feeding them open.

    Nkem     Load 4.8, held, in the range most people travel. 9 addresses
    Teen     under it are held. The heaviest, Self-Silencing at 6.1, sits on
             the vagus nerve, which runs the voice box, slows the heart and
             moves the gut.

    Tomas    Load 5.8, held. 24 addresses under it are held. The heaviest,
    Child    Possession at 9.0, is locked. It sits on the gluteal nerve, which
             drives the muscles that hold your hip steady when you stand and
             walk.

James is the reason for part 2 of the rule. His Teen load reads a little tense
on average and three addresses under it are held, the heaviest at 5.4. The
mean alone would have told him his throat was nearly clear. Tomas is the
reason for the last clause of the organ line: a muscle nerve, so no organ and
no blood.

**One word is held open.** His template says the nerve is "impaired". That
states the nerve's function was measured, and it was not: the instrument read
what he reported, at that place. The curve words describe the charge and not
the nerve. It is his call, and it is asked in `TASKS.md` GG, with what each
choice costs.

### Every mask names the archetype that powers it

His words: "which Jungian archetypes are powering the masks? This is very
important... the teen, for example, like the rebel."

**Every mask states its archetype and one line on why that archetype powers
it and what it does for the person.** The archetype is named from the twelve
the product already carries, `ARCH` at `engine/data/canon.js:407`, and never
from outside it. One word per concept: each of the twelve already has a
Knowledge entry to link to, and his Rebel is one of them.

Two facts, stated once so nobody has to guess. Jung's own word for the mask is
the persona, the Latin for a player's mask. The twelve are Mark and Pearson's
set, built on Jung. So in his terms the mask is the persona and the archetype
is the engine under it.

In the drill, under the mask's own line:

    Powered by   Rebel
                 The Rebel refuses the frame, and at this age the frame is a
                 person. It marks where you end and your parents begin.

Two sentences, two jobs. The first is why, and it reuses the archetype's own
verb from `ARCH`. The second is what the mask does for the person, which is
the reason it was worth building and the reason it is still worn. That second
sentence is what keeps a mask a reading and not a verdict. Both are a
Definition: the same for everybody who wears that mask.

The six, drafted. The mask's own line is `MASKS` at `engine/data/canon.js:494`,
as shipped. Teen and Rebel are his.

    Mask          It does                        Archetype  Why, then what it does for you
    Child         gets small so somebody         Innocent   The Innocent takes it at face value that the
                  else decides                              bigger person will decide well. It kept you
                                                            looked after when you could not look after
                                                            yourself.
    Preteen       checks the room before it      Everyman   The Everyman stays with the room, so it reads
                  says the thing                            the room first. It keeps you in the group.
    Teen          pushes back on the person,     Rebel      The Rebel refuses the frame, and at this age
                  not the problem                           the frame is a person. It marks where you end
                                                            and your parents begin.
    Adult         handles it, and files what     Warrior    The Warrior moves on the threat and counts the
                  it cost                                   damage after. It gets the thing done on a day
                                                            when feeling it would stop you.
    Professional  performs competence until      Ruler      The Ruler keeps things in order, so it shows
                  the feeling passes                        control while the feeling is still loose. It
                                                            keeps you trusted with people, money and
                                                            decisions.
    Ideological   answers from the position      Sage       The Sage reads the situation, and this mask
                  instead of the moment                     read it once and kept the answer. It gives
                                                            you ground to stand on when the moment is
                                                            unclear.

Two of the six are close calls and are asked rather than settled: Adult could
be the Caregiver, which carries other people's load and files its own, and
Ideological could be the Magician, which sits at the 3rd Eye with the mask.
The Ruler's own line in `ARCH` reads "orders the field", and Field is a surface
name, so the sentence above paraphrases it rather than quoting it.

The art direction seat is drawing the masks from this table and not the other
way round. A change to an archetype here is a change to that drawing.

### Clean editorial. Five lines, before and after.

His words: "So add that to our style guide and give me some examples. I want to
see some really clean editorial."

Five strings the product ships, quoted as a person reads them with a reference
profile loaded, and each rewritten under the three rulings above. Locations are
at commit `7c5282d`. None is changed in `atuned_src/` by this; they are
findings in `TASKS.md` GG for the seat that owns those files.

**1. The mask, what it is.** `ui/drills.js:607`, the Teen mask.

    Before   A mask is not a fault and it is not a stage you failed to leave.
             It is a shape held in front of the seats it covers, and it costs
             what holding it costs. This one sits over the Throat. Its charge
             is read from the story, never from a question about your age.
    After    A mask is a way of acting you learned at one age and still use.
             This one pushes back on the person, not the problem. It sits over
             your throat, and its load is read from what you enter.

Two denials and a cost defined as itself, out. The mask's own line from
`MASKS` in. It carries one antithesis, and that is the surface's one.

**2. The mask, its load.** `ui/drills.js:615`, James.

    Before   Load 2.1, the mean charge on the addresses under it.
    After    Load 2.1, a little tense. 3 addresses under it are held. The
             heaviest sits on the pharyngeal nerve, which runs swallowing and
             the back of the throat.

The old line defines the number by its arithmetic. The new one says what it
means, what it hides, and where in the body it is.

**3. Awareness.** `ui/ui.js:1017`, the orb's title, Derek.

    Before   Awareness of the instrument. 0.28 of 1. Intention read against
             distortion. Not the rail section of the same name.
    After    Awareness, 0.28 of 1. How much of what you mean to do gets past
             what is running in you. What is running is at its ceiling, so
             intention carries it alone.

"Intention read against distortion" is the formula read aloud,
`engine/compute.js:427`. The new line is the same formula said as a thing that
happens to a person. The last sentence of the old one is a name collision
apologising for itself: two things called Awareness. A rename fixes that and a
sentence does not.

**4. The upward cone.** `ui/drills.js:690`, the Compass.

    Before   Each of the twelve is the maximum coherent expression of one human
             quality, at one moment when it was most needed. They are
             coordinates, not a summit. Nothing here is a person to become.
    After    Each of the twelve is one human quality at full strength, at the
             moment it was most needed. Take a bearing off them. None of them
             is a person to become.

"Coordinates, not a summit" is right and abstract. A compass takes a bearing,
and the surface is called Compass.

**5. The governor.** `ui/drills.js:874`.

    Before   The governor is a name for the pattern, not a person and not a
             thing that exists. It is still recognisable because the pattern is
             still running.
    After    The governor is an old name for this pattern. People still know
             the name because the pattern still runs.

Two denials out. The claim they were guarding is kept, said positively: it is a
name, it is old, and it lasts because the behaviour does.

## Ruled 27 September, round GS

Three naming rulings, `TASKS.md` GS, recorded in full in `DECISIONS.md` under
"Character, the masks, Release, and the opening screen".

**Character is what all the masks add up to, and what is running them.** His
words: "the whole enchilada... a visualization of what all the masks look
like, and what's running it." A Definition of Character says the sum, never a
single layer. Character and Masks are two words for two things and both stay.

**A mask is never given a name of its own.** "That's identification. Yep, take
that out." A mask is named by its age, from `MASKS`, and by the archetype that
powers it. Never a custom name, never a name built from the person's own
entries.

**Release is the word, and a release empties a story.** "The release is any
story... empty the body of stories, period." One word per concept: Integrate
does not name the mechanic or any string in it. A Definition of release names
the story first and the charge second, because the charge at an address is how
the instrument reads that the story is still there.

    Before   Release empties the address.
    After    A release empties a story out of the body. The charge at the
             address is how the instrument reads what is left.

**The opening screen copy is his, dictated, and one clause of it is his to
settle.** It is not written into the product until he has chosen between
shipping it word for word and ending before "pain and disease free". The team
does not rewrite dictated words.

## Where each bucket lives

    menu          engine/core.js TABDEF, shell/body.html .lsec-hd
    label         shell/body.html, ui/*.js form labels
    value         ui/component.js cr(), the renderers
    definition    engine/data/canon.js TIERDEF, kb.js GLOSS, the drills
    instruction   ui/component.js startHTML, the buttons
    reading       ui/summary.js sumStory, ui/drills.js
    refusal       wherever a control is withheld

A new string is written in its bucket's shape or it does not ship.
