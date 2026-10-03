# The Intake's three added blocks. FIRST DRAFT, round PP.

**SUPERSEDED IN PART, ROUND PQ.** The archetype block this file describes,
`IX_ARCH`, one row per archetype, is replaced by `IX_ARCH2` in
`DESIGN-archetype-questions.md`: eighteen rows that each put two archetypes
against each other, a dilemma or an either or, triangulated rather than asked
once each. Everything below about the axis and action blocks is still
current; everything about the archetype block (the table `arch` reads, its
decision 1, the "one question per archetype" note) is history. Read the newer
file for how archetype questions work now.

His words, 2 October: "Intake, I asked for the Jungian archetypes. And we should
also do, also do the nine emotional axis and the six action axis uh, for the
intake. We'll keep this design for now. Let's see what it looks like with all of
them stacked."

What was built: three blocks of questions under the laws on the Intake page, in
the page's own design, all open at once. Content is a plain data file,
`atuned_src/engine/data/intakemore.js`. The record, the boundary and the
read-out sentence are `atuned_src/engine/intakemore.js`. The drawing is
`iqxHtml` in `atuned_src/ui/intakeui.js`. Every sentence is marked draft
(`IX_DRAFT`) and is mine, not his, so it is the first thing to overrule. Nothing
reads the flag to change behaviour.

## What each block asks, and where the set comes from

| Block | Rows | Source set | Why this set |
|---|---|---|---|
| Archetypes | one per archetype | `ARCH`, `engine/data/canon.js` | The product's own twelve, which `ARCH_CREDIT` calls "Jung-derived, after Carol Pearson and Margaret Mark". |
| Emotional axes | one per axis | `CHILD`, the nine poled axes | The held side only. The opposite is stored already as the installed opposite and a person has installed nothing by answering a question. |
| Action axes | one per gate | `VERP`, `engine/verp.js` | See the decision below. |

Every question is "how often", 0 never to 10 every time: the scale the 63 use,
and the same eleven cell control.

## Two decisions I made so he can overrule them

**1. The twelve are the product's twelve, not the brief's.** The brief listed
Innocent, Orphan, Hero, Caregiver, Explorer, Rebel, Lover, Creator, Jester, Sage,
Magician, Ruler. The product's `ARCH` has Warrior and Everyman where the brief
has Hero and Orphan. Orphan and Hero are two of the eighteen in `ARCH18`
(`engine/data/canon.js`) and are not on the Avatar, the Field or the rail. A
person asked about Hero here who finds no Hero on the Avatar has been given two
lists, and the rule is one word per concept. So the block asks the twelve the
product already carries. If he wants Hero and Orphan in place of Warrior and
Everyman, it is a rename of two keys in `ARCH` and two rows in `IX_ARCH`, and
the gate will say which it missed.

**2. The six action axes are the six gates, said as action.** The owner did not
define them in this round and the repo has no table called "action axes".
Evidence that the gates are what he means:

- `DECISIONS.md`, tier ruling, "Read as": "the gates (said as action in the
  product)". `engine/plan.js` says the same: "gates said as action".
- `TASKS.md` GL4: "How I relate to the **six motion axis**. His words, and the
  product has no six of anything by that name: it has six masks, six gates in the
  VERP set, and six koshas." Of those three, the gates are the only ones the
  engine itself calls axes: the top of `engine/verp.js` reads "THE SIX AXES".
- They are what a person does when a feeling rises: notice it, stay out of its
  story, keep to what they were doing, miss it, get pulled in, go around it. That
  is an action, which is why they sit beside the emotional axes and not inside
  them.

The other candidate is the six release channels (believing, perceiving, thinking,
behaving, acting, feeling), ruled six at round CB. They were not taken. They are
the words in a release statement, a thing a person says, and nobody can say how
often they "feel" in the way a gate is rated. `BOOK-ERRATA.md` item 27 records
the ruling. If he means the channels, only `IX_ACT` changes, and it is a data
edit plus a new key list in the gate.

| Key | Name on the page | Meaning printed beside it |
|---|---|---|
| aware | Awareness | You notice the feeling in your body while it is there. |
| detach | Detachment | You feel it and stay out of the story it tells. |
| intent | Intention | It rises and you keep to what you were doing. |
| ignore | Ignorance | You do not see it coming, or you choose not to look. |
| attach | Attachment | The story takes you and you go with it. |
| averse | Aversion | You go around it, put it off or change the subject. |

## Where the answers go, and what they do not do

`p.intake.more = {arch:{Sage:7, ..}, axes:{Fear:4, ..}, acts:{aware:5, ..}}`.
Keys are the row's own name, values 0 to 10, an absent key means not answered.
Beside the 63 and never mixed into them, because the 63 are indexed by position
and read by `iqScore`, `iqApply` and CQ.

- **Older records.** No schema bump. A record with no field is filled from the
  blank in `loadProfile` and `validateProfile`. A profile with no `intake` at all
  is given one rather than throwing on the first press.
- **The boundary.** A block record or bag of the wrong type, a key naming a
  question the product does not ask, a value outside 0 to 10 or not a number: each
  is refused by name and never dropped or clamped. `null` is not answered.
- **A press** goes through `ixSet`, saves, and reports through `statusSaved()`.
  The answer stays on screen either way, and the status line says whether it
  will survive a reload.
- **EVIDENCE, NOT A VERDICT.** They write to no law, no charge, no CQ, no gate
  count (`p.gates.verp` is counts of sentences read out of stories and stays
  that), and not to `p.soul.arcs`, which is what the person chose on the Avatar.
  The engine gate answers every question 10, then 0 and 10 in turn, and asserts
  the whole reading is byte for byte what it was. The repo does not say these
  should feed anything, so they feed nothing.

## The read-out

Under each block, once every row is answered. Until then it says what is left
("3 left") and never a count against a total. It names the top row or rows, with
the meaning of each in the same sentence:

- Archetypes: "Leading archetype: Sage. Sage reads the situation."
- Emotional axes: "Loudest axis: Anger. The body heats up and pushes against
  something that feels wrong. Felt in the upper abdomen. Its other end is
  Equanimity: the body stays level while the pressure is there."
- Action axes: "Most used move: Attachment. The story takes you and you go with
  it."

Two at the top are "tied" and both are named. Under 3 points from top to bottom
(the floor `iqScore` already uses) or more than three tied at the top, it says
"Nothing leads." A person who pressed 10 twelve times is not given a winner.

## Notes, honestly

- **The archetype rows carry no name on the page.** A row headed "Ruler" asks
  whether you would like to be called one. The name arrives in the read-out with
  its meaning. The axis and action rows are named, each with its meaning in the
  same place, because the question is a sensation or a move and the name does not
  flatter. This is a design choice with a cost: the page cannot show which
  archetype a question is about, and a person cannot say "that one is Sage".
- **Every question is scored the same direction.** A person inclined to agree
  with everything gets a level read, and the read-out says so rather than naming
  a winner. Forced choice resists that better and needs a control this page does
  not have. It is the first thing to try if the draft reads flat.
- **One question per row is thin.** The 63 use three framings per law for a
  reason. One question per archetype, axis and gate is a first pass and cannot
  tell a person who holds a thing when it costs from one who holds it when nobody
  is looking. The read-out is worded as a lean, not a measure.
- **The Detachment mark** (`GATEGLYPH.detach`, a ring with a dot outside it)
  reads like the male sign at 16 pixels. It is the product's existing glyph and
  was not changed here. Flagged.
- **Length.** See the next section.

## Length, measured by `tools/intake-stacked.js`

Read the numbers off the run; they are not typed here, and a number typed into
this file would be the next one to go stale. The run prints the page's height in
pixels and in screens, and how much of it the three blocks add, on a stranger and
on a loaded example at both widths. Before the blocks the page was under one
screen at 1600. The blocks are most of what is on it now. That is the cost of
"all of them stacked", which he asked to see, and it is what he should look at
before deciding.

Proposed, not built:

1. **Fold the blocks like the seats.** Each block becomes one tile in the map
   under the laws (a ring, its name, a pip per row), and pressing it opens its
   questions in place, the way a seat opens its laws. The page returns to about
   one screen and the blocks keep the design they have. Cost: a block is no longer
   seen unless pressed, which is the reverse of what he asked to see this round.
2. **A strip of three rings in the header** (one segment per row, lit as rows
   are answered, the page's own grammar in `iqSegs`) so the remainder is visible
   from anywhere without a count against a total.
3. **One block at a time with Next**, the way "one at a time" shows a law. Longest
   to build, shortest page.

Either of the first two keeps the evidence-only rule. Neither was built.

## What was not changed, and why

- `ARCH`, `CHILD`, `VERP`: the tables the blocks read. Nothing in them moved.
- The 63, `iqScore`, `iqApply`: untouched, so CQ cannot move.
- The Avatar's chosen archetypes (`p.soul.arcs`): authoritative and separate.
- `SCHEMA_V`: the field is additive, which is the posture the practice objects
  already take, and the bump is his call.
- Hero and Orphan: see decision 1.
