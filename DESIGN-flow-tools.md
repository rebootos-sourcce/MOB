# DESIGN-flow-tools

The rules for Flow, which is one page of three columns: inputting new on the
left, the ritual in the centre, the accountability tracker on the right. This
file is the extension of `ATUNED-practice-ritual-accountability-trace-graph-TDD.md`
(section 45 there points here), and it is written so that every rule has a
gate, and every gate is named.

The gate is `tests/flowtools.js`. It runs alone with `node tests/flowtools.js`
and it is called from `tests/functional.js`, so a full run holds it through the
same code. Rule 15 fails the run if this list and that file disagree.

## 1. What was ruled, and it has been ruled three times

His words, round QF, 2 October, verbatim and not paraphrased:

> "And if you'll notice, we're re-merging the knowledge base and the
> accountability tracker. Left menu will be for inputting new. Right side of
> the menu is for the accountability tracker. Center piece is for the ritual."

Read as four things, and the reading is stated so it can be corrected:

1. Flow is one page again, not two. Accountability stops being a tool set with
   a door of its own and becomes a column of the Ritual page.
2. The left column comes back, with a job: inputting new. That is the builder,
   closed to one press and seven tags until it is wanted.
3. The centre is the ritual and nothing else: the chain from story to work,
   and the Active list.
4. The right column is the accountability tracker: what is due, what was done,
   what was missed, and the record.

**This reverses round PO on both counts, and the churn is the record.** Round
JQ, 27 September: "attach the accountability tracker to it", so it was built
inside the Ritual page. Round PO, 2 October: "get rid of the left and right
menu. Actually, sorry. Move the new ritual to the right menu. And you're
supposed to move accountability to its own tool set", so the left column went,
the builder went right, and Accountability got a door. Round QF, the same day,
is the shape above. Nothing about the previous rounds was wrong when it was
built, and the integers did not move through any of it.

**What the one sentence in it does not settle, and it is named rather than
guessed.** "Re-merging the knowledge base and the accountability tracker" names
two things, and only one of them has a column in the three he then listed. The
accountability tracker is merged, in full. The Knowledge tab, integer 6 in
Embody, is left where it is: what it holds is the universal laws, the seats,
the cards, the gates, the archetypes, the domains, the masks, moral integrity,
the saboteurs, the child emotions and the fetters, and none of those is a
ritual, an input or a record of days. Dissolving a reference surface into this
page on one clause would cost more to undo than to leave. It is the one open
question in the round and it is written down open.

## 2. Where the repo already said something, and which way it was followed

| Where | What it said | What was done |
|---|---|---|
| `engine/core.js`, the note at `TAB.RITUAL` | "the accountability tracker built inside it rather than beside it" | True again, by his own word of round QF. Both earlier notes are kept beside the new one. |
| `DESIGN-flow-tools.md` at round PO | "Flow has no left column" | Superseded. The left column has a job now, which is the thing it did not have then. |
| `CLAUDE.md`, never renumber TAB | Integers are identity | Followed. Accountability is still 14. It lost its door and kept its integer, through `TABFOLD`. |
| `CLAUDE.md`, a tab host that carries a folded surface cannot also be one | Fold deletes the child | Followed, and it is the reason the tracker is drawn into the right rail and not into a host inside `#rit`. The rails are siblings of the stage, so the stage's own paint cannot reach them. |
| `CLAUDE.md`, Analytics and Games | A folded surface keeps its integer and its renderer and loses its door | Followed exactly. `acctRender` kept its body and became `acctSideHtml`; nothing about what it reads changed. |
| `ui/ui.js`, "the field left panel starts closed" | The left column starts shut | Followed where it was ruled, which is the Field. Flow's left column has its own store key and defaults open, because a menu that arrives shut is a control hidden with no affordance. |
| round PE, "all information is on the right hand side" | The right rail is where detail lives | Followed. The tracker is detail about the ritual and it is on the right. |

## 3. The three columns

| | Inputting new (`#flownew`) | The ritual (`#rit`) | The tracker (`#flowrail`) |
|---|---|---|---|
| Question it answers | What shall I start? | What am I doing? | Did I do it? |
| Holds | New ritual closed to one press and seven tags; open, the builder | The chain (imprints, held, goal), the becoming prompt, the Active list | Due today, Done, Missed, the Record |
| Reads | `PRACTICE`, the avatar's pairs, the bank | plans, the bank, the avatar's pairs | plans, the record, the ladder |
| Writes | start, edit, move, stop, again, delete a ritual; the timer | mark a day done; the timer | mark a day done or take it off; delete an entry and put it back |
| Files | `ui/ritual.js` | `ui/ritual.js` | `ui/accountability.js`, written by `ritRender` |

All three are painted by `ritRender` on every paint, because a column written
only on some paths is a column that goes stale.

## 4. The rules

Each rule is a sentence a gate can fail. The `Gate:` line names the check by
the prefix it opens its message with.

### FT1. Flow is one page with one door, and Accountability keeps its integer.

`TABDEF` carries `TAB.RITUAL` alone with `sec:'flow'`, and the markup carries
one button in the Flow group. `TAB.ACCOUNT` is still 14, no integer is shared,
and `TABFOLD` maps it onto `TAB.RITUAL`, so `TABREAL` answers Ritual and
`SECOF` still answers flow. A tab stored by anybody who used Accountability
while it had a door still resolves to the surface that carries it. Any code
that needs a tab's entry reads it by `.k`, never by position.

Gate: `tests/flowtools.js`, messages beginning `FT1:`. Also `tests/engine.js` and
`tests/functional.js`, which hold the whole TAB table to its values.

### FT2. All three columns are drawn, each holds the thing it is for, and they never overlap.

At 1600 the three sit side by side in the order input, ritual, tracker. At 390
they stack, and the order is the ritual, then the tracker, then inputting new.
No rail section (`.lsec`) is visible on either side.

Gate: `tests/flowtools.js`, `FT2:`.

### FT3. Each rail holds exactly one panel on Flow, and both go away off Flow.

The one visible child of the left panel, apart from its fold control, is
`#flownew`; of the right panel, `#flowrail`. Root Energetics, Awareness, Child
emotions, the Matrix, the Energetic Summary, the Reading, Selection, Running,
Moral integrity and Run a release are not drawn here. Off Flow both menus are
shut and empty and both rails have their sections back. The child selector
hides the rest, so a section added to either rail later does not turn up here.

Gate: `tests/flowtools.js`, `FT3:`.

### FT4. Inputting new is the left column, and only there.

Closed, it is one press and the seven tags. Pressing it opens the builder in
the same place: tags, steps, timer, how often, days, when, where, how long,
Start. No builder control, tag, field or Start is on the stage or in the right
column. The Active list stays on the stage. While the builder is holding
something the body carries `ritbuild`, which is what brings the column to the
front on a phone.

Gate: `tests/flowtools.js`, `FT4:`.

### FT5. The Ritual stage holds no accountability.

No streak, rings, figures, marks, month or key. The one exception is the ring
on an Active row that marks today done, which is the same writer as the
tracker's and is the press a ritual list needs. On a phone it is also the
reason the centre can go first.

Gate: `tests/flowtools.js`, `FT5:`.

### FT6. The tracker is the right column, in one order, with no door and no host of its own.

`setTab(TAB.ACCOUNT)` lands on the Ritual page, the Flow group has no button
for 14, and there is no `#acct` in the document. The right column holds Due
today, Done, Missed and the Record, in that order, on a blank profile and a
loaded one.

Gate: `tests/flowtools.js`, `FT6:`; `tools/monitor.js`, which walks every
surface `TABDEF` names at both widths and exits non zero on an empty one;
`tests/design.js`, whose tap floor sweep walks every `TABDEF` tab.

### FT7. The tracker reads three things and invents nothing.

It reads the plans, the record (`CURP.rituals`) and the ladder (`ladderRead`).
A number printed is a count of days or minutes taken off those. Missed days are
counted over the last 14 days (`ACCT_SPAN`) for a ritual that is still active,
on the days it was due, with no entry marked done, and the count is the same
one the month draws as dashed rings. A ritual kept on one weekday is not missed
on the others. Most missed is first. Edit is offered at `PR_MISS_AT` misses or
more, the engine's own constant, and below that a miss is only counted. The
streak is the ladder's, so this column cannot disagree with the Summary. No
percent, no score, no rate, anywhere on the page. The gate works the expected
counts out from the days and the entries and does not ask the page's own
function.

Gate: `tests/flowtools.js`, `FT7:`.

### FT8. Empty states say what is empty and offer the one press, never a second builder.

Nothing active: Due today says "Nothing active yet" and offers New ritual,
which opens the builder in the left column and goes nowhere, because there is
nowhere to go. Missed says "Nothing to miss yet". The streak reads a real 0 as
the house dash. The tracker carries no Start and no field of its own, and it
names no column by its side, because on a phone the columns stack and neither
of them is on a side.

Gate: `tests/flowtools.js`, `FT8:`.

### FT9. Every write goes through the one writer, and says how it went.

Marking a day done, taking it off, deleting an entry and putting it back are
`ritWrite`. Success says Done or Taken off through `status()`. A save that fails
says "Could not save that. Nothing changed.", keeps nothing, and leaves the ring
open. A worked example is refused by name, and the page says once, in the
centre, that nothing there is saved. Edit on a missed ritual opens that ritual
in the left column and never leaves the page.

Gate: `tests/flowtools.js`, `FT9:`.

### FT10. Add to my ritual on the Compass teacher panel still lands, and the ritual shows in two columns at once.

The button writes the plan through `ritStartPlan`, says Added, and the ritual
is on the centre's Active list (as "Toward" the teacher) and on the tracker's
Due today, on one screen.

Gate: `tests/flowtools.js`, `FT10:`; `tests/functional.js`, the group named "a
teacher on the compass opens the behaviour complex and adds a starter ritual".

### FT11. A caller off Flow goes to Flow, and a ritual write off Flow paints nothing.

The release, the avatar's queue, the Summary and the Compass reach the ritual
through `ritOpen`. The builder lives in a column that exists on Flow only, so
`ritOpen` off the tab goes to the tab with the log or the queue already in the
builder. A ritual write while the Compass is showing does not draw a ritual
over it, in any of the three columns.

Gate: `tests/flowtools.js`, `FT11:`.

### FT12. Both widths hold: inside the screen, no sideways scroll, the builder's week fits.

At 1600 and at 390 every column is inside the viewport, the page does not
scroll sideways, and the builder's seven day row, seven presses of the 44 pixel
floor, sits inside the left column. Both side columns are 400 wide for that
reason: the week on the left and the month's seven days on the right are the
same floor, and 360 was tried first and cut the seventh day off, which a shot
caught and a number in a stylesheet would not have.

Gate: `tests/flowtools.js`, `FT12:`; `tests/design.js` gate 8, the tap floor.

### FT13. Both folds are the person's and still work.

Shutting either column on Flow shuts its menu to the one control that opens it
again, and opening it brings the menu back. Nothing forces either open: it is
their arrangement of the screen. The left column's default on Flow is open,
under its own store key, because his ruling that it starts shut names the
Field, where the column is a rail of readings, and here it is the menu the page
is for.

Gate: `tests/flowtools.js`, `FT13:`.

### FT14. Every heading says what it means, in the same place.

Each of the three columns names its job and says in a sentence what it is. Due
today, Done, Missed, Record and Active today each carry a sentence under them.
Streak, Best, Kept and Practised are explained under the figures. The rings on
the month are explained under the key. This is the owner's unpack rule of 2
October (`CLAUDE.md`, "UNPACK EVERY SYMBOL").

Gate: `tests/flowtools.js`, `FT14:`; `python3 .claude/skills/atuned-voice/check.py
--objections` for the voice.

### FT15. The rules and the gates are one list.

Every `### FTn.` in this file has a `Gate:` line naming `tests/flowtools.js`,
every `FTn:` check in that file has a rule here, and the practice TDD links this
file and names the gate.

Gate: `tests/flowtools.js`, `FT15:`.

## 5. Not built, and why

These are in the practice TDD and are not in this change. Each is named so the
gap is not read as an oversight.

- **The reason a day was missed.** TDD section 24 lists the classes
  (`wrong_time`, `too_long` and the rest, `PR_MISS` in the engine). The profile
  has nowhere to keep one yet, and a control that took an answer and dropped it
  would be the status lie. Edit is the only response offered at `PR_MISS_AT`.
- **Evidence and outcome** (TDD sections 11 to 14: what changed because you
  practised). They need the practice domain's own records wired to this
  surface, which is the P1 build order, and the surface would otherwise print
  an outcome nobody recorded.
- **The 30, 60 and 90 day change record** (TDD section 35).
- **Points lost for a miss.** His line from the original ritual brief, "if I
  fail an accountability I lose points", is a gamification rule, and the TDD
  says a miss is investigated and not punished. The two disagree and the
  ruling is his.

## 6. The gate map

| Rule | Gate |
|---|---|
| FT1 to FT15 | `tests/flowtools.js` |
| FT1, and every TAB integer | `tests/engine.js`, `tests/functional.js` |
| FT6, FT12 | `tests/design.js`, `tools/monitor.js` |
| FT10 | `tests/functional.js` |
| Practice domain, schema and graph under the surface | `tests/practice.js`, `tests/trace.js` |
| FT14 voice | `.claude/skills/atuned-voice/check.py --objections` |
