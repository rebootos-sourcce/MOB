# Flow, round QN, notes

Branch `flow-three-column`, on top of `56ebb09`. Shot by `node tools/flowshots.js mockups/flow-qn`
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
| Thirty days | right | `ritDaySegs`, the month's own read of a day |
| History | right | plans and `CURP.rituals`, grouped by steps |

The rules are FT16 to FT23 in `DESIGN-flow-tools.md`, each held by `tests/flowtools.js`.
