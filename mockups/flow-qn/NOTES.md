# Flow, round QN, notes

Branch `flow3-qn`, on top of `56ebb09`; reshot 3 October after the resume pass below. Shot by `node tools/flowshots.js mockups/flow-qn`
on the person's own record, seeded through the product's own writers (six stories through
stCommit, one pass of the release arithmetic, three avatar stories, four rituals over thirty
days). The seed is described at the head of `tools/flowshots.js`. Nothing here is a real
person's record.

## The pictures

- `flow-1600.png`: the first screen at 1600, as a person lands on it.
- `flow-1600-tall.png`: the same page on a 2300 tall window, so all six centre cards show.
- `stack-1600.png`: the six centre cards alone.
- `suggested-1600.png`, `suggested-390.png`: the left column's Suggested list.
- `loop-1600.png`, `loop-390.png`: the thirty day loop and its summary.
- `history-1600.png`, `history-390.png`: History, with Back in rotation on an ended ritual.
- `flow-390.png` and `flow-390-01.png` onward: the phone page a screen at a time. The phone
  shell scrolls inside itself, so a full page capture paints only the first screen.
- `flow-1600-blank.png`: a first visit, nothing written and nothing kept.
- `flow-390-blank.png`: the same first visit on a phone, where New and Suggested now come first.

## What each new part reads

| Part | Where | Reads |
|---|---|---|
| Suggested | left | `ritFor` (the seat carrying the most), `avRituals` (the Avatar page's own queue), `relQueueOf` (the heaviest held place per seat) |
| Ritual to avatar | centre, top left | `avCycles`, the Avatar page's Cycles; `avRows`, each avatar story's seat |
| Ongoing goal | centre, top right | `ritBecoming`; `ladderRead().next` |
| Active today | centre, middle | the Active list, unchanged |
| Did it work | centre | the record; the last snapshot before a ritual began, against `compute().loaded` now |
| Keep or delete | centre | plans in their last three days |
| Practice analytics | centre | the chain; `CURP.rituals` by seat and by week |
| Thirty day loop | right | `ritDaySegs`, the month's own read of a day |
| History | right | plans and `CURP.rituals`, grouped by steps |

The rules are FT16 to FT24 in `DESIGN-flow-tools.md`, each held by `tests/flowtools.js`.

## The resume pass, 3 October

The checkpoint commit (`14e6b64`) was rebuilt in its own worktree and walked
through its own buttons as Angela, Derek, James and a blank profile, not only
read. What it claimed held, with four things found by walking it:

- **Suggested was never shown to a person with nothing running.** The left
  column was the builder or Suggested, never both, and the builder opened
  itself whenever nothing was active. Now Suggested sits under the input in
  both states, the builder no longer opens itself, and Cancel is always on
  the builder (it had none with nothing active, which would have been a room
  with no door once it stopped opening on its own). Left column controls on a
  first visit at 1600: 28 to 10.
- **The same practice at the same seat was two cards** (James: The Somatic
  Truth Check twice at the sacral). One card now, with both reasons, and its
  Start sets the schedule for the held place.
- **On a phone the input column was last even with nothing to keep**, about
  four thousand pixels down. With nothing active it is first now (`ritnone`),
  which is what the auto opening builder used to do there; and the centre's
  own New ritual shows only when the left column is folded, so one screen
  carries one New ritual between the two.
- **"Thirty days" named two things on one screen**, the loop and a ladder
  mark. The loop is the "Thirty day loop" now, his words.

All held by FT24, and the FT4 check that leaned on the self opening builder
now opens it with the press a person uses.
