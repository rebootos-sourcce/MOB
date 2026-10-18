# Percent phase 2, the strategy (MOB, 17 October)

## The logic, once, in the engine

- Every printed score goes through `fmtPct(kind, value)` in `engine/pct.js`, the registry (one table naming each kind of score, its bottom and top, and the engine line that sets them). No renderer writes its own `*10` or `toFixed` for a score.
- Percent = how far the value sits between bottom and top, whole, held inside 0 and 100. Nought prints the dash `–`, never `0%`; an unread profile prints the dash.
- The fill rule: a ring drawn for a score fills `pct(kind, value)`, so arc and number agree. New gate `tests/pct.js` checks every ring it can reach: printed percent equals arc fill.
- Direction is the kind's own: CQ, expression, flow, pass, archetype, vitality and kept read "higher is better"; DQ, weight, charge, chain, pull and overshoot read "higher is heavier". The words beside each figure already say which.
- No alarm colour on any percent (default taken, his to overrule, in DECISIONS.md): a high percent never reads as a red mark. Band names (Severe, Corrupt) stay, flagged.
- A change is before and after (`pctMove`): "from 58% to 61%", "held at 58%" when equal.
- Counts, factors (×1.35), 0 to 10 inputs, ids, hertz and time stay. The one cap stays 10. The line at 4 reads 40%.

## The quiz only record (Summary plate)

- The plate prints the word (early, partial) while filling, and CQ as N% once every law is answered (`accCover().complete`, where CQ stops moving). Before that the figure is mostly defaults. `tests/golden.js` station 4 changes from "always a word" to "a word while filling, the percent equal to the ring once full": a named change.

## The slices, one pull request each

1. **The shared ring and the Field headline**: `ui/component.js` (address, pattern and badge rings, the CQ and DQ pair, the tween), `ui/fieldbar.js` (fixes fill against print), `ui/rings.js`, `ui/wheel.js` centres, `ui/ui.js` foot ring and rail. Flips: `tests/design.js` "the headline coherence is a number" and gate 15 "a charge past ninety still reddens"; `tests/railmenu.js` RM2 "bare, no percent sign".
2. **Summary**, `ui/summary.js`, tier lines in `engine/data/canon.js`. Flips: golden station 4; `tests/copy.js` "a weight prints as a whole number".
3. **Analytics and the record**, `ui/analytics.js` (bubble floors, domain constant), `ui/record.js`. Flips: `tests/copy.js` "a change in CQ is said in whole numbers".
4. **The drills and hover lines**, `ui/drills.js`, tips in `ui/ui.js`.
5. **The rest**: body map, shelf, Character, Knowledge, Compass, personas, intake, imprints, Story pill, avatar, ritual stage, games, profile. Flips: `tests/functional.js` Character figure against `toFixed(1)`.
6. **The funnel**, `funnel/quiz.html`, `funnel/about.html`.

Each slice: before and after shots at 1600 by 1000 and 390 by 844, the full local sweep, every flipped assertion named in its pull request, `tools/equiv.py` for moved code.

## Conflicts in flight

- **`ui/release.js` is not touched**; its seat is rebuilding the results and the carousel. `tests/release-percent.js` stays until they flip it.
- TODO for the release seat: patterns released, bank and vault stay COUNTS; finished card DQ and CQ print `fmtPct`, "Down 0.14" and "Up 0.01" become `pctMove`; "163 weight freed" becomes DQ before and after; the log ring fills `pct('weight', w0/10)` (w0 is already 0 to 100) and prints it; the running plate prints `fmtPct('weight', sqNow)`; expression "up 0.4" and "1.2 points left" become before and after, silent under 1%; released at an address may be a percent of what was held there.
- **Achievements** (not started) ask the registry for any figure.
