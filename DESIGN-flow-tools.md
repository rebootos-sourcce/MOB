# DESIGN-flow-tools

The rules for Flow, which is two tool sets: Ritual and Accountability. This file
is the extension of `ATUNED-practice-ritual-accountability-trace-graph-TDD.md`
(section 45 there points here), and it is written so that every rule has a
gate, and every gate is named.

The gate is `tests/flowtools.js`. It runs alone with `node tests/flowtools.js`
and it is called from `tests/functional.js`, so a full run holds it through the
same code. Rule 15 fails the run if this list and that file disagree.

## 1. What was ruled

His words, round PO, 2 October, verbatim and not paraphrased (voice dictated,
and the correction in the middle is his own):

> "On the flow pages, get rid of the left and right menu. Actually, sorry. Move
> the new ritual to the right menu. And you're supposed to move accountability
> to its own tool set. You should have rules on a TDD for all this."

Read as four things, and the reading is stated so it can be corrected:

1. Flow has no left menu. The left column (Root Energetics, Psyche, Matrix)
   described a field the person is not looking at while they build a ritual.
2. The right menu on Flow is no longer the Energetic Summary and the Reading.
   It is the menu of the tool set the person is in. "Actually, sorry" is read
   as a correction from "get rid of both" to "keep the right one and give it a
   job": New ritual goes there.
3. Accountability stops being a part of the Ritual page and becomes a tool set
   beside it, with a door of its own in the Flow sub navigation.
4. All of it is written as rules with gates. This file.

If he meant the right column to go as well, the change is one rule (FT3) and
one line of CSS, and nothing else here moves.

## 2. Where the repo already said something, and which way it was followed

| Where | What it said | What was done |
|---|---|---|
| `engine/core.js`, the note at `TAB.RITUAL` | "the accountability tracker built inside it rather than beside it" | Superseded by his word of 2 October. The note is kept and a new one stands beside it. |
| `engine/core.js`, the TABDEF entry for Ritual | "the whole tab moves and nothing is split" | Same. He split it. |
| `ATUNED-practice-ritual-accountability-trace-graph-TDD.md` section 31 | ACCOUNTABILITY is its own group of the information architecture, with Today, Evidence, History and Change | Followed. This is the repo agreeing with him, and it is why Accountability is a tool set and not a section inside Ritual. |
| `DESIGN-nav.md` | Four doors and a second row; a door opens a surface | Followed. Flow is the door, Ritual and Accountability are its second row, each a TAB integer with a host of its own. |
| `CLAUDE.md`, never renumber TAB | Integers are identity | Followed. Accountability is 14, appended. |
| `CLAUDE.md`, a tab host that carries a folded surface cannot also be one | Fold deletes the child | Followed. `#acct` is a sibling of `#rit`, never a child. |
| `ui/ritual.js`, round LT | "the new ritual needs to be on the upper right hand side so it's front and center" | Kept in spirit and moved one step further: it was the top right of the page, it is the top of the right menu. |

## 3. The two tool sets

| | Ritual (`TAB.RITUAL`, host `#rit`) | Accountability (`TAB.ACCOUNT`, host `#acct`) |
|---|---|---|
| Question it answers | What will I do, and when? | Did I do what I set? |
| Stage | The chain (imprints, held, goal), the becoming prompt, the Active list | Done (today's rings, streak, figures, marks) and the Record (month and list) |
| Right menu | New ritual: closed it is one press and seven tags; open it is the builder | Due today, and Missed |
| Reads | plans, the record, the bank, the avatar's pairs | plans, the record, the ladder |
| Writes | start, edit, move, stop, again, delete a ritual; mark a day done; the timer | mark a day done or take it off; delete an entry and put it back |
| Files | `ui/ritual.js` | `ui/accountability.js`, painted through `ritRender` |

Both repaint through `ritRender`, because every writer in `ui/ritual.js`
already ends there, so no writer had to learn there are two surfaces now.

## 4. The rules

Each rule is a sentence a gate can fail. The `Gate:` line names the check by
the prefix it opens its message with.

### FT1. Flow is exactly two tool sets, in this order, each a tab of its own looked up by key.

Ritual, then Accountability. `TABDEF` carries both with `sec:'flow'`, the
markup carries both buttons in the Flow group, and the two lists agree. The
integer is 14, appended; nothing is renumbered and no two names share one. Any
code that needs a tab's entry reads it by `.k`, never by position.

Gate: `tests/flowtools.js`, messages beginning `FT1:`. Also `tests/engine.js` and
`tests/functional.js`, which hold the whole TAB table to its values.

### FT2. Flow has no left column.

On both tool sets, at 1600 and at 390, the left column is not drawn and no rail
section (`.lsec`) is visible anywhere.

Gate: `tests/flowtools.js`, `FT2:`.

### FT3. Flow's right column holds one panel, the Flow menu, and it goes away off Flow.

The one visible child of the right panel on Flow, apart from the fold control,
is `#flowrail`. The Energetic Summary, the Reading, Selection, Running, Moral
integrity and Run a release are not drawn there. Off Flow the menu, `#rit` and
`#acct` are shut and empty and the rail has its sections back. The child
selector hides the rest, so a section added to the rail later does not turn up
on Flow.

Gate: `tests/flowtools.js`, `FT3:`.

### FT4. New ritual lives in the right menu on Ritual, and only there.

Closed, it is one press and the seven tags. Pressing it opens the builder in
the same place: tags, steps, timer, how often, days, when, where, how long,
Start. No builder control, tag, field or Start is on the stage. The Active list
stays on the stage. On a phone the menu comes first on both tool sets, so a builder
opened from the chain, and what is due today, are where the person is looking.

Gate: `tests/flowtools.js`, `FT4:`.

### FT5. The Ritual stage holds no accountability.

No streak, rings, figures, marks, month or key. The one exception is the ring
on an Active row that marks today done, which is the same writer as
Accountability's and is the press a ritual list needs.

Gate: `tests/flowtools.js`, `FT5:`.

### FT6. Accountability is its own entry and it renders.

Its button is in the Flow group; pressing it lands on the tab, presses the
button, shows `#acct`, shuts `#rit`. The stage holds Done and Record. The menu
holds Due today and Missed. It renders on a blank profile and a loaded one.

Gate: `tests/flowtools.js`, `FT6:`; `tools/monitor.js`, which walks every
surface `TABDEF` names at both widths and exits non zero on an empty one;
`tests/design.js`, whose tap floor sweep walks every `TABDEF` tab.

### FT7. Accountability reads three things and invents nothing.

It reads the plans, the record (`CURP.rituals`) and the ladder (`ladderRead`).
A number printed is a count of days or minutes taken off those. Missed days are
counted over the last 14 days (`ACCT_SPAN`) for a ritual that is still active,
on the days it was due, with no entry marked done, and the count is the same
one the month draws as dashed rings. A ritual kept on one weekday is not missed
on the others. Most missed is first. Edit is offered at `PR_MISS_AT` misses or
more, the engine's own constant, and below that a miss is only counted. The
streak is the ladder's, so this page cannot disagree with the Summary. No
percent, no score, no rate, anywhere. The gate works the expected counts out
from the days and the entries and does not ask the page's own function.

Gate: `tests/flowtools.js`, `FT7:`.

### FT8. Empty states say what is empty and where to go, and never offer a second builder.

Nothing active: Due today says "Nothing active yet" and offers Open Ritual,
which lands on Ritual with the builder open in its menu. Missed says "Nothing
to miss yet". The streak reads a real 0. Accountability carries no New ritual,
no Start and no field.

Gate: `tests/flowtools.js`, `FT8:`.

### FT9. Every write goes through the one writer, and says how it went.

Marking a day done, taking it off, deleting an entry and putting it back are
`ritWrite`. Success says Done or Taken off through `status()`. A save that fails
says "Could not save that. Nothing changed.", keeps nothing, and leaves the ring
open. A worked example is refused by name and the page says on its face that
nothing there is saved. Accountability does not start or change a ritual: Edit
on a missed ritual goes to Ritual with that ritual open in the builder.

Gate: `tests/flowtools.js`, `FT9:`.

### FT10. Add to my ritual on the Compass teacher panel still lands, and the ritual shows in both tool sets.

The button writes the plan through `ritStartPlan`, says Added, and the ritual is
on the Active list (as "Toward" the teacher) and on Due today.

Gate: `tests/flowtools.js`, `FT10:`; `tests/functional.js`, the group named "a
teacher on the compass opens the behaviour complex and adds a starter ritual".

### FT11. A caller off Flow goes to Flow, and a ritual write off Flow paints nothing.

The release, the avatar's queue, the Summary and the Compass reach the ritual
through `ritOpen`. The builder lives in a menu that exists on Flow only, so
`ritOpen` off the tab goes to the tab with the log or the queue already in the
builder. A ritual write while the Compass is showing does not draw a ritual
over it.

Gate: `tests/flowtools.js`, `FT11:`.

### FT12. Both widths hold: inside the screen, no sideways scroll, the builder's week fits.

At 1600 and at 390 the menu is inside the viewport, the page does not scroll
sideways, and the builder's seven day row, seven presses of the 44 pixel floor,
sits inside the menu. The right column on Flow is 400 wide for that reason.

Gate: `tests/flowtools.js`, `FT12:`; `tests/design.js` gate 8, the tap floor.

### FT13. The fold is the person's and still works.

Shutting the right column on Flow shuts the menu to its one control, and
opening it brings the menu back. Nothing forces it open: it is their
arrangement of the screen.

Gate: `tests/flowtools.js`, `FT13:`.

### FT14. Every heading says what it means, in the same place.

Done, Record, Due today and Missed each carry a sentence under them. The menu's
head names the tool set and says in a sentence what it is. Streak, Best, Kept
and Practised are explained under the figures. The rings on the month are
explained under the key. This is the owner's unpack rule of 2 October
(`CLAUDE.md`, "UNPACK EVERY SYMBOL").

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
| FT1 to FT14, FT15 | `tests/flowtools.js` |
| FT1, and every TAB integer | `tests/engine.js`, `tests/functional.js` |
| FT6, FT12 | `tests/design.js`, `tools/monitor.js` |
| FT10 | `tests/functional.js` |
| Practice domain, schema and graph under the surface | `tests/practice.js`, `tests/trace.js` |
| FT14 voice | `.claude/skills/atuned-voice/check.py --objections` |
