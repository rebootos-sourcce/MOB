# Summary layout, three reviews, one commit

Everything for the Summary rebuild of 1 October 2026 (Discover > Summary,
TAB.SUMMARY 1). Pictures are of the built page in real Chromium, 1600 by 1000
and 390 by 844, profile Sofia loaded with her one story entry unless named.

## Read in this order

1. `INTERPRETATION.md` what he asked for, the candidates, what was chosen, what
   the round OJ clarification settled
2. `REVIEWS.md` the three reviews, grades, diagrams, counts, what changed
3. `ICP-FEEDBACK.md` the pitch, simulated and marked as simulated
4. This file: the pictures, the files changed, what could break

## Pictures

Each is 1600 by 1000 (the first screen) unless it says full, which is the same page
at a window as tall as the surface runs. Phone full captures are also cut into a
`-sheet.png` of side by side columns so they can be read as one picture.

| Stage | Blank, 1600 | Blank, 390 | Loaded, 1600 | Loaded, 390 |
|---|---|---|---|---|
| before | `before-blank-1600.png` | `before-blank-390.png` | `before-loaded-1600.png`, `-full` | `before-loaded-390.png`, `-full`, `-sheet` |
| after pass 1 | `pass1-blank-1600.png` | `pass1-blank-390.png` | `pass1-loaded-1600.png`, `-full` | `pass1-loaded-390.png`, `-full`, `-sheet` |
| after pass 2 | `pass2-blank-1600.png` | `pass2-blank-390.png` | `pass2-loaded-1600.png`, `-full` | `pass2-loaded-390.png`, `-full`, `-sheet` |
| after pass 3, final | `pass3-blank-1600.png` | `pass3-blank-390.png` | `pass3-loaded-1600.png`, `-full` | `pass3-loaded-390.png`, `-full`, `-sheet` |

Also, final build:

- `pass3-owner-1600.png`, `-full`, `pass3-owner-390.png`, `-full`, `-sheet`. Derek's
  sky and charge carrying the owner's own name, Lance O'Neill Powell, the one state
  in which the name panel shows meanings.
- `pass3-entered-1600.png`, `pass3-entered-390.png`. A name and a birth entered and
  nothing else: the page is still unread and still shows the four doors.
- `pass3-slot-loaded-1600.png`, `-full`. The day slot drawn as a dashed box. It is
  invisible in production.
- `icp-james-loaded-1600.png`, `icp-angela-loaded-1600.png` (and 390). The tissue test.

Pass 2's blank picture prints the word You at display size. That is the defect
review 3 found and pass 3 fixed, and it is left in the record on purpose.

Option pictures for the open questions. These are the real page with one change made
in the document before the picture. The ones with `text-edited` in the name have
words changed by hand for the picture. None is built.

- `option-nine-as-built.png`, `option-nine-first-person-text-edited.png`
- `option-do-first-1600.png`
- `option-source-printed-1600.png`
- `option-headings-softened-text-edited-1600.png`

## The tools, to run it again

Run from the repo root with `NODE_PATH=/opt/node22/lib/node_modules`.

    ./atuned_src/BUILD.sh
    node mockups/summary-layout/shoot.js LABEL [person] [slots]   pictures and counts
    python3 mockups/summary-layout/show.py LABEL                  the counts, compact
    python3 mockups/summary-layout/sheet.py LABEL-loaded-390-full.png
    node mockups/summary-layout/taps.js                           44 by 44, every fold open
    node mockups/summary-layout/contract.js                       the structure the gates read
    node mockups/summary-layout/options.js                        the option pictures

`SRC=/path/to/other/source.html` points any of them at another build. The before
pictures were taken from a build of the committed `summary.js` and `head.html` at
`935224c`, made in a scratch folder.

## Files changed

    atuned_src/ui/summary.js       the page, rebuilt by meaning; NAME_MEANINGS; the day slot
    atuned_src/shell/head.html     the grid, the cards, the cascade, the folds, the phone order

Nothing under `engine/`. No MANIFEST change. Build products (`source.html`,
`engine.js`, `atuned-packed.html`, `funnel/dist`) were rebuilt locally to take the
pictures and are not committed.

`python3 tools/equiv.py` against a build of the old files names the difference, for
acknowledging:

    only in shipped    sumStruct
    bodies changed     lensWestern sumAxes sumFull sumGlance sumLens sumNum
                       sumPlate sumSpirit sumUnread sumWire
    new                NAME_MEANINGS ROOT_ELSAYS SUM_IC SUM_OPEN nameKey
                       nameMeaning sgCap sgFold sgHead sgMeet sgMeetRow sgRing
                       sgStage sgSvg sgZone sumArch sumBirth sumBlueprint sumChain
                       sumChips sumConverge sumDayHtml sumDaySlot sumDrivers sumIc
                       sumMarks sumMasks sumNameBlock sumNameParts sumNamed
                       sumNine sumRealName sumSeats sumWho

## What the rebuild keeps, and what could break

Run, and held, by `contract.js` on James, at both widths: `#sumbody` and the
`.sum-wrap` host; `.s-pband b` with the tier colour; `.s-gl` five; `.s-story .s-p`
three; `.s-row` thirteen; `.s-dom`; `.s-chip` seven with no border on any;
`.s-nrow` six; `.s-npart` three; every `.cr` an icon, an arc and a pill with no
empty pill; no box overflowing its own; the story opens on the blueprint sentence
and closes on the lean; no placeholder text; the full name and Life path on the
page; the comparisons named. Every control that carries `data-sp`, `data-num`,
`data-dom`, `data-seat`, `data-arch`, `data-mask`, `data-gl` still opens a reading.
`data-igspan` and `data-sout` are still handled by the one delegated listener.

What I could not run, by instruction, and where the risk is:

1. **`.s-gl` is five, not six.** The coherence ring left the glance because the plate
   carries it. `tests/functional.js` asserts at least five on James, who has an
   accuracy reading. A profile with none gets four.
2. **Controls inside a closed fold are in the document and not on the screen.** That
   is seats, masks beyond three, the integrity span buttons, the four lenses, the
   birth comparison, numerology and its rows, and the third overlap and the range.
   Gates that query and click pass. A gate that measures boxes sees nothing there
   until a fold is open, so the tap floor gate samples fewer controls than before.
   `taps.js` opens every fold and finds none under 44 by 44.
3. **On a phone the document order is not the visual order.** At 700 wide and under,
   CSS `order` lifts the day slot and the output row after the story, the drivers and
   the marks. A gate that asserts the two agree would fail.
4. **`.s-spirit`, `.s-cols`, `.s-main`, `.s-side`, `.s-side-a`, `.s-side-b` and
   `sumStruct` are gone from a read profile's markup.** I grepped `tests/` and
   `tools/` for each and found no reader. `.s-spirit` still renders on an unread page
   with a birth on file. The orphaned CSS for the removed ones is still in
   `head.html`.
5. **`tests/design.js` was not run.** The page adds a class, `.sg-zh`, to the
   title case rule. Nothing is under 11 pixels (the smallest is 12), no all caps, and
   every control is 44 by 44 at both widths by `taps.js`. The alarm gate reads rings
   by title: the nine cells are titled by the fetter's name and carry no good end
   word.
6. **`tests/funnel.js`, `tests/boot.js`, `tools/monitor.js` and `tests/collide.js`
   were not run.** The surface renders on a blank and a loaded profile with no page
   error at both widths, which is what the monitor reads.
7. **`python3 tools/terms.py`** was run and reports drift in the same classes as
   before. The new strings reuse the rail's own labels ("Other ways this shows up",
   "Expression", "Born").
8. The voice gate has no hard failures on the file, and none on each new UI line.
