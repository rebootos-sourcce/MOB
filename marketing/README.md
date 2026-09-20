# The marketing system

His brief, and the sentence in it that this is built around: *"You should know
how to search that information and get the maximum, and then break it down and
understand the psychological strings that's pulling on, and you should be able
to know how to plug that into our fetter matrix so you know how to use
communication that speaks directly to that."*

**The idea, in one sentence.** The product already measures which address a
person is carrying, so the language that reaches them is not a guess about a
demographic. It is a lookup against their own field.

This directory is that lookup, built and measured. Nothing in it touches
`source.html`, `engine.js`, `atuned_src/`, `tests/`, `funnel/`, `proto/`,
`CLAUDE.md` or `TASKS.md`.

---

## Run it

    node marketing/tests.js        the gate. 240 assertions, exits non zero
    node marketing/hooksim.js      the thousand run, with the sweep
    node marketing/hooksim.js --validate    the five validation groups alone
    node marketing/hooksim.js --sweep       the sensitivity tables alone
    node marketing/field.js        the panel, and its four validation groups
    node marketing/refuse.js "a line"       one line against the nine rules

Read the counts off the run. This file does not restate them.

---

## The files

    hooks.js      the hook table. Copy and art direction on the same row,
                  keyed to a charge and a seat the engine actually deals
    field.js      the thousand person panel, every field read through the
                  real engine
    match.js      the lookup. A field goes in, a line comes out
    refuse.js     the guard, as a gate that returns a verdict on a string
    hooksim.js    the measurement, and what it is honestly measuring
    tests.js      the gate for this directory

    MAP.md        what each charge responds to and what closes the page,
                  sourced row by row, with the unsourced rows said plainly
    AESTHETIC.md  the design language, stated as rules, no hex values
    GUARD.md      the line, the argument for it, and its measured price

---

## The five things the brief asked for, and where each one is

### 1. The map

`MAP.md`. Nine charges, seven seats, response and repel per row, and a source
column with four honest values: engine, panel, literature, unsourced. **Five
rows are sourced, two partly, two not at all.** Disgust has its content and its
size and not its response. Shock and Surprise have the engine and the panel and
nothing else. Those two are not dressed to look like the others.

Five general mechanisms run under every row and are stated once: regulatory fit,
the self referencing effect, the information gap, autonomy supportive phrasing,
and the fear appeal meta analysis, which is the inconvenient one and is in there
for that reason.

### 2. The hooks, written and addressed

`hooks.js`. Seventeen field hooks, one clear entry, one door out, four state
doors and four role doors.

**His form is the ruling and every line is in it**: speaks to the pain, then
asks a what if question. His own lines are the benchmark:

> What if you could wave it away? What if you could see yourself clearly? What
> if you could look into a mirror and see the programming running at every atom
> in your body?

Those are good and they are one line for everybody. The difference here is that
each line is tagged to an address, and the tag is checked: `tests.js` assertion
15 fails if a hook names a nerve, a seat or a distortion the engine does not put
on that address, and assertion 17 fails if a hook's ink is not the token its
seat says.

**Art and copy are one row, not two documents.** `TASKS.md` MS1 asked for
sharpening against each other rather than a handoff, and a handoff is what two
files produce. So every hook carries `art` with its ink, its figure, the rule
that figure has to obey and its motion, and the ink is a lookup off the seat
rather than a choice.

### 3. The levels: role, state or field

`hooksim.js` section 3, and the answer is that **it is by field, and the other
two are not close.**

On the panel, a line served by field names the charge the person's own reading
is heaviest at for **872 of the 894 eligible**. By state it is 462. By role,
437. And the sweep matters more than those three numbers: across five seeds and
three jitter widths, **field leads in 15 of 15 runs by 272 to 460 people of
1000**, while state leads role in only **5 of 15**, by minus 25 to plus 25.

**So the first version of this system claimed state beats role and the sweep
took the claim off it.** State and role are level. Neither pre reading label is
a key. That makes the case for the doors sorting rather than asserting stronger
than it was, and it makes the intake the only thing the top of the funnel is
actually for.

**His two claims were tested and both hold.**

- *A burned out executive and a burned out athlete carry the same charge.* Both
  modally Shame, at 67 and 75 percent of their groups.
- *Two executives may need different ones.* Executive and burned out is modally
  Shame; executive and anxious is modally Anger. One role, two states, two
  different lines.

**And one nobody asked for.** Sadness is not where grief sits. Sad is the
heaviest charge for **1 person in the panel of 1000**, and for 0 of the 200
behind the grief door. Their addresses are Fear at the root, Self-Exclusion at
the crown and Self-Judgment at the vagus. A hook written at sadness addresses
one person in a thousand, and that figure does not depend on which archetypes
were labelled grief stricken, which is the one label in `field.js` that is a
judgement rather than a measurement.

### 4. The simulation

`hooksim.js`, reusing `proto/ritual/losssim.js`'s panel weights and its seeded
stream, comment and all, because that comment records a real defect in the
stream and the fix is load bearing.

**What it does not do: it does not model whether anybody buys.** There is no
shipped product and no click data, so a funnel rate would be a coefficient of
mine dressed as a finding. It measures coverage, naming precision, the band
gate and the refusal gate, and every one of those is checkable by hand against
the engine's own tables.

**The probe was checked against an answer it did not choose, and failed.**
`field.js` validation group 1 asserts that all nine archetypes land on the grid
level `losssim.js` independently records for them. It failed on the first run:
Angela came out a level high, because reading the level as a decile of CQ
disagrees with the engine's own band boundaries on every fractional CQ at the
top of a band. The level is now the position of the engine's band in `TIERDEF`.
Eight rows of nine had passed.

**And a second defect the same day.** The first jitter applied one draw to all
nine charges, which moves a vector up and down and never changes which charge is
largest. A thousand people produced eight distinct heaviest addresses. Every
finding about within role variance would have been an artefact of that. It is
one draw per axis now, and the panel holds 25 distinct charge and seat keys.

### 5. The aesthetic

`AESTHETIC.md`. Read out of `funnel/tokens.css`, which is generated from the
app's own stylesheet, and stated as rules with no hex values anywhere.

The load bearing rule: **the address decides the colour.** A hook at the Heart
is inked `--heart`, and `tests.js` fails if it is not. Beyond that, the
document carries the traps the generated file records against itself, because
each one is a way for marketing to break something already fixed: `--gold` is
an alias for a blue accent and `--au` is the real gold; `--num` once named a
face that was not in the build; `--dim` carried 104 of 105 contrast failures on
one surface and the reason it moved is that six of thirteen reference people are
57 or older.

**Two open gaps in the shipped funnel are reported there and not fixed**,
because `funnel/` belongs to another seat: the page carries the umlaut mechanism
and not the wordmark, and Source OS appears nowhere on it although FN4 asks for
it by name.

---

## The guard

`GUARD.md`, and the enforcement is `refuse.js`.

**The line: a person must be able to stop and be glad they used it.**

It is a gate rather than a paragraph, because `TASKS.md` MS4 says the refusal
has to survive the marketing system or the system will quietly find its way
back to loss framing. Nine rules, each with its reason and its source, each with
a deliberate violation written against it that has to be caught by the full gate
and has to pass when that one rule is removed. A gate nobody has broken on
purpose is a gate nobody has tested.

**And the refusal runs on who a line is served to, not only on its words.**
Level 1 of `BUYERS.md` gets no hook ever, on the grid's own reasoning that
buying this means dismantling an identity they are using to survive. On the
panel that is 106 of 1000 refused, and every one of them is served the engine's
own direction for that band, carried verbatim so the product does not grow a
second voice.

**The argument does not rest on manipulation being ineffective, because it is
not.** Fear appeals measure d 0.27 across 248 samples with no identified
backfire. It rests on two measurements in this repository: with the deduction
modelled rather than only the uplift, the loss mechanic costs 1.9 points of the
thousand person panel, and where it does buy something it buys less as the
honest design gets better. The refusal got cheaper as the product got better.

`GUARD.md` also states what would change my mind, so the position is
falsifiable rather than doctrinal.

---

## Gates this directory already passes, and what it has not been through

Passes:

    node marketing/tests.js                     240 assertions, 0 failures
    python3 .claude/skills/atuned-voice/check.py  no hard failures on every
                                                copy field, run from tests.js
    node marketing/hooksim.js --validate        5 groups
    node marketing/field.js                     4 groups

The voice gate found real defects on the first run and they are fixed: the
largest hook in the set, the one served to 307 of 1000, **named no place in a
body at all**, and six others did the same. The antithesis rate in the copy
fields ran at 6.5 percent against a house rate of 2.7 and is now 3.6, and the
glosses are gone.

Not been through, and said rather than left to be discovered:

- **No surface has been built.** This is a table, a lookup and a measurement.
  Nothing here is a page, so nothing has been screenshotted and nothing has
  been looked at, which `CLAUDE.md` is explicit is not the same as reviewing a
  screen.
- **No copy has been read on a loaded profile.** The voice skill's passes 7 to
  9 want each line read as Angela, Derek and James with their numbers on the
  surface. That needs a surface.
- **`equiv.py` and the engine gates were not run**, because nothing in
  `atuned_src/` was touched.

---

## Three things for him

- **The hook set is not eighteen equal doors.** One hook carries 307 of 1000.
  The production order follows the distribution and the first four lines cover
  more than half the addressable panel, so the question is whether to build
  four properly or seventeen thinly.
- **Seven keys have people and no hook**, 22 of 1000, the largest being
  Surprise at the sacral with 8. They are deliberate holes: a line written
  against a key holding one person in a thousand is written against the panel
  rather than against a person. Whether the Throat seat stays empty is a real
  decision, because it is the only one of the seven seats with no hook at all.
- **The clear entry sells confirmation and not relief**, and it is the one place
  where the grid and the field disagree in an interesting direction. Level 10 is
  the grid's highest buying probability at 100 percent and the person there has
  no pain to speak to. The line offers the schematic and says plainly that
  nothing here will relieve them of anything. That is the offer, and it is worth
  his ruling on whether it is the right one.
