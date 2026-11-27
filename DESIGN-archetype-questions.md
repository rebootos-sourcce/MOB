# The archetype block, triangulated. Round PQ.

His words, this round. "Maybe the right flow is we ask them the right
combination of questions to have them triangulate on the behaviors that they
identify with." And: "For archetype questions, are the archetype opposite
behaviors? If they are, we simply want to ask more moral ethical questions
that tease out which archetype would react or respond to a given situation...
For the archetype, you can also ask either or questions." And: "Archetype
questions and situational dilemmas. Review this twice, figure out what needs
to be built. Strategize."

This replaces the round PP archetype block (`DESIGN-intake-axes.md`), one
question per archetype, "how often do you move on a threat at once", answered
on its own eleven cell scale. That block is still the one shown for the
emotional axes and the action axes; only the archetype third of the three
stacked blocks changed. See "What was replaced, and why" below for the
reasoning.

## His question, answered first: are the twelve opposite pairs

No, and not partially either. Checked against the product's own tables
(`engine/data/canon.js`) rather than assumed.

`ARCH`, the twelve archetypes, carries three fields on each row: `nm` the
name, `v` what it does, and `b` the seat it sits at. There is no `opp` field.
Compare `CHILD`, the nine emotional axes, which does carry one: Fear's `opp`
is Trust, Anger's is Equanimity, and so on, for all nine. The engine already
has a working idea of "opposite" and it chose not to give the archetypes one.

The seat is the only grouping `ARCH` has, and it is not a polarity, for two
reasons. First, it is uneven: five seats hold two archetypes each (Root:
Warrior, Everyman. Crown: Sage, Innocent. Throat: Rebel, Jester. Heart:
Caregiver, Lover. Sacral: Creator, Explorer), and two seats hold one each
(Solar: Ruler. 3rd Eye: Magician). A clean set of opposite pairs on twelve
things is six pairs; this is five pairs and two singles. Second, sharing a
seat means "lives in the same part of the body", which is proximity, not
opposition: the Root carries both the Warrior, who moves on the threat, and
the Everyman, who stays with the room, and those are not opposite moves, they
are two different moves that happen to be read at the same seat.

So the premise behind his first question is false of this data, and the
honest answer is to say so rather than build a dilemma on a polarity this
table does not have. Which is exactly why his second sentence is the
instruction this file follows: moral or practical situations where two named
responses lean toward two different archetypes, picked for what the two
archetypes actually do, the same way the round JQ integrity law dilemmas
were built (CLAUDE.md, "Open, and whose call": the beggar, the two kids
fighting). Mixed, as he asked, with either or pairs.

## The triangulation method

**Reused, not invented.** The 21 integrity laws already triangulate: `Q3` in
`engine/intake.js` asks the same law three ways (under cost, unseen, an
ordinary day) and `iqScore` reads the mean as the law's score and the spread
across the three as whether the reading is reliable at all (`spread<3` is
"even, within measurement noise"). The archetype block is the same idea
applied to a different shape of evidence: instead of three framings of one
thing, it is three *contests* that each name the archetype, each against a
different rival, so one answer can never carry the whole reading for any one
name.

**The pairing.** Twelve archetypes, each put against three different others,
never the same pair twice. In graph terms: a three regular circulant on the
twelve, built from `ARCH`'s own table order (Warrior 0 through Innocent 11).
Every archetype is paired with its two table neighbours (distance 1 round the
list) and the one archetype six seats away (distance 6, the diametric pair).
Twelve things each appearing three times gives eighteen pairs (12 x 3 / 2 =
18), and the eighteen split evenly: nine built as a dilemma, nine as an
either or.

**The two formats, on one line.** Every row names two archetypes, `a` and
`b`, and stores one number, 0 to 10: 0 is fully `a`, 10 is fully `b`, the same
line the nine emotional axes already sit on between a state and its opposite.

- A **dilemma** is a short two clause scene ending in a question, the round
  JQ shape, with two named responses as two buttons. Pressing one writes the
  line's own end, 0 or 10: a dilemma is simply an either or a person is not
  offered the middle of.
- An **either or** is two short behaviours on the same eleven cell scale
  every other row on this page already uses, so a person can also sit
  between them rather than only pick one, which is what he asked for when he
  said either or questions were an addition and not a replacement.

Both write through the exact same boundary (`ixSet`, `ixValidate`, 0 to 10,
refused by name outside it) with no new code there at all, because both are
the same shape of answer.

**The arithmetic, in full, and it is the only place it runs.** In
`engine/intakemore.js`, `ixRead`'s branch for `id==='arch'`:

    for every row: ptB = v/10, ptA = 1 - ptB
    tally[row.a] += ptA
    tally[row.b] += ptB

Three rows touch every archetype, each worth at most one point, so the
ceiling is 3. The floor under which nothing leads, `IX_ARCH_FLOOR`, is
derived rather than typed fresh: `IX_FLOOR` (3) is the noise floor the 21
laws and the other two blocks already use on their 0 to 10 scale, carried
across by the ratio of ceilings, `3 * (3/10) = 0.9`. A tie of up to three
archetypes at the top is a real tie and both (or three) are named; more than
that, or a spread under the floor, reads "Nothing leads." Exactly the rule
the other two blocks already use, reapplied to a tally instead of a raw
value.

**Why this is auditable rather than a model.** A person reading
`engine/intakemore.js` can reconstruct any result by hand from the eighteen
stored numbers: multiply, add, compare. There is no weight that was fit to
data, no hidden parameter, no cohort it was tuned against. `tests/engine.js`
proves it by recomputing the same tally independently of `ixRead` and
asserting the two agree, on more than one state of the answers.

**Why no single question can decide it.** Each row can move its own two
names by at most one point in either direction (0 to 1 toward one, 1 to 0
toward the other). An archetype needs all three of its rows to go its way to
reach the ceiling of 3. A single bad mood on one scene can move a tally by at
most one point out of three, never enough by itself to put an archetype at
the top of twelve.

## Worked example

Suppose every row is answered at the midpoint (5, an honest "I am not sure").
Every archetype ties at 1.5 (three rows at 0.5 each). Spread is 0, under the
floor: "Nothing leads."

Now suppose a person answers every row touching Warrior fully toward Warrior
(the dilemma buttons at the Warrior end, the either or slid to 0 or 10
accordingly) and leaves every other row at the midpoint. Warrior's three rows
each give it a full point: tally 3.0, the ceiling. Every other archetype
either lost its one contest against Warrior (dropping one of its three rows
to 0, for a tally of 1.0) or was never asked against Warrior and sits at its
untouched midpoint (1.5). Spread is 3.0 - 1.0 = 2.0, well over the floor:
Warrior leads alone. This exact case is one of the assertions in
`tests/engine.js`.

## What was replaced, and why

The round PP archetype block (`IX_ARCH`, one row per archetype, "how often do
you move on a threat at once") is removed and replaced, not kept alongside
the new one. Two single-answer readings of the same twelve names sitting on
one page would raise the question "which one is the real one" with no good
answer, and the round PP design note already named its own weakness: "one
question per archetype... cannot tell a person who holds a thing when it
costs from one who holds it when nobody is looking. The read-out is worded as
a lean, not a measure... Forced choice resists that better... It is the first
thing to try if the draft reads flat." This is that forced choice, so it
replaces rather than sits beside the thing it was proposed as the fix for.

The emotional axis block (`IX_AXIS`) and the action axis block (`IX_ACT`) are
untouched. His ask this round was archetype questions and situational
dilemmas, and neither of those two blocks is either.

Nothing else moved: `ARCH`, the Avatar's chosen archetypes (`p.soul.arcs`),
the 63 integrity law questions, CQ. This is still evidence shown back to the
person, read by no sum (`tests/engine.js`, "EVIDENCE, NOT A VERDICT", proves
answering every row top and bottom changes no law, charge, gate count or CQ).

## What a round PP answer, already saved, does now

No profile in this repository carries one (checked: `engine/data/people.js`
has none), so this is a statement about the shape of the migration rather
than a repair for data that exists. A record saved under round PP would carry
keys like `arch:{Warrior:7}`. Those keys no longer match any row
(`IX_ARCH2` keys are pairs, `Warrior_Sage` and so on), so `ixRow('arch',
'Warrior')` returns null. `loadProfile` trusts its input and leaves the
stray key sitting inert (it is additive, no schema bump, the posture this
file already states); `ixRead` never reads it, since it iterates the current
rows, so it does no harm and asks no question twice. A wire import carrying
that old key is refused by name at the boundary, the same as any other key
the product does not currently ask, which `tests/engine.js` checks
explicitly as the migration edge case.

## Review, twice

**First pass** wrote the pairing, the eighteen questions and the scoring
rule.

**Second pass**, rereading every question as a stranger would:

- Reworded three either or pairs that had repeated a phrase from a dilemma
  almost verbatim (same behaviour, different scene), so no two rows anywhere
  in the eighteen read the same sentence, which `tests/engine.js` now checks
  by name across the whole block.
- Checked every dilemma for a genuinely ambiguous single-question read: each
  scene was written so a plausible person could take either response (a
  tense room can be broken with a joke or sat with quietly; a rule that feels
  wrong can be pushed back on or let go of to keep a relationship), rather
  than a scene with one obviously correct answer.
- Reran the voice gate and the objections sweep (`check.py`, `--objections`)
  against the new data file and the two engine files it touches: no hard
  failures, no new objection findings.
- Reread the scoring rule looking for one or two rows that could dominate the
  outcome by themselves. They cannot: every archetype sits in exactly three
  rows and no row is worth more than one point, which `tests/engine.js`
  proves directly (flipping any one row end to end moves either of its two
  names by at most one point).

## What is left

- **Wording is still mine, not his,** marked by the same `IX_DRAFT` flag the
  round PP block carried. All eighteen rows are his to overrule, sentence by
  sentence.
- **The read-out stays a lean, not a measure,** the same posture the round PP
  note held: one pass of eighteen questions is a first instrument, not a
  calibrated one, and the product says so by naming "Nothing leads" rather
  than inventing a winner under the floor.
- **The pairing is one valid construction, not the only one.** A different
  three regular graph on the twelve (for instance, one chosen to make every
  pair's two archetypes as behaviourally distinct as possible, rather than
  reading off `ARCH`'s table order) would ask differently worded questions
  from the same method. The method (eighteen rows, three per archetype, a
  tally with a derived floor) does not depend on which specific graph is
  used; this repository's choice is the simplest one to state and to check.
- **The Avatar's chosen archetypes (`p.soul.arcs`) and this block's lean are
  still two separate records**, by design, and nothing surfaces them side by
  side yet. Whether the product should ever show "you chose Sage, and your
  answers here lean Warrior" is open and his to rule on.
