# Achievements, four mockups

Mika's seat (art), with Sol (colour and light), Bjorn (type and grid) and Petra (composition and symbols). Made 16 October 2026 on the owner's ruling: "the avatar is a hero". Built from main at `ed089350`. These are mockups. Nothing in `atuned_src/` changed.

Open any file in a browser. Each one is a single file with no dependencies and no network.

| File | Direction | One line |
|---|---|---|
| `v1-body-with-rings.html` | Body with rings | A large figure in the centre, with a ring on each place released, the turn ring round it and dated tiles under it. At phone width the tiles sit in a bottom sheet. |
| `v2-dial.html` | Dial | The figure inside an instrument face, read from the inside out: the turn ring, a tick for each address released, then the horizon. The ledger is a column beside it. |
| `v3-field.html` | Field | The figure is a cool volume of points, and each released pattern is one point of light round it. Three releases look like three stars, and 18,000 look like a nebula. The ledger is folded away under the field. |
| `v4-receipt.html` | Receipt | The figure at full height on the left, inside Leonardo's circle. On the right is a long dated receipt of what left, one line per place. This is the most restrained of the four. |

Each file has a demo bar, marked as demo. It switches between three made-up people: a new person with 3 released, a person of 36 with 120, and a person of 54 with 18,000. It also has **Replay the last release**. In that moment the warm wash fades out over 900 ms while the cool ring draws clockwise from twelve o'clock, starting at 500 ms and lasting 700 ms. Then it stops and stays still. With reduced motion on, the page says so and shows the still end state. Pointing at a ring, or tapping it, gives the nerve, where it is, what it held and the date.

Pictures are in `shots/`: every version for each person at 1600 by 1000 and at 390 by 844, a full-page view, the release moment at four instants, and `vN-replay-strip.png`, which is the moment close up at five instants.

## What all four share, so they look like the product

- **The figure is the product's own.** It is the Body page outline from `engine/data/figure.js`. Every ring sits on the pixel where the Body page puts that address: the placement in `ui/map.js` (`pmAnat`) is ported line for line, and the build reads the data files directly, so the two cannot drift apart. The nerve names come from `engine/data/nodes.js`, and the typeface is the Inter embedded in `shell/head.html`.
- **Tokens use their real names and values** from `shell/head.html`. This round adds a semantic layer and no new colours: `--ach-flow` points at `--sec-flow` and means "a place released". `--ach-kept` points at `--sec-embody` and means "a practice kept". `--ach-q-*` point at the four nav loop colours.
- **The icon grammar (Petra).** A *released* icon is a ring with a 40 degree gap at one o'clock, with what was released drawn inside it: a small ring for a saboteur, a level line for a mask, three rings for a complex, three rings joined by a triangle for a hypercomplex, and a wave for a nerve opened. A *kept* icon is a closed ring with the practice inside it. *Shared* is two rings that touch at one point and never overlap.
- **The words.** Every line on the pages was run through `check.py --line`. One line failed: "Mockup 1 of 4" was flagged as a count against a total. It now reads "mockup 1". Every term is explained where it appears: address, saboteur, mask, complex, hypercomplex, recipe, impaired, open, pattern, and the estimate.

## The rules, and how each version holds them

All four hold every rule from the room's round 2:

- The figure is whole, with rings only where something was released. There are no empty sockets, no grey track and no "3 of 108".
- A release is drawn in two layers, warm out and cool in. Only a release gives off light.
- The turn ring has four quarters in the nav colours and never shows a number.
- The horizon arc's fill equals the printed percent, because both come from the same rounded figure. The band is drawn, never stated as "plus or minus", and "A working figure, not a measurement." sits beside it.
- "Released" only rises. The buy line is one line of type with no light and no ring.
- There is no Next button, no sound, no confetti, no toast and no alarm colour, and nothing names an absence.

Where a version bends a rule, the cost section below says so.

## Three findings from building them. These change what he decides.

1. **At small sizes the horizon is a speck, so all four draw it big.** At 1.7 percent, the honest arc on a 96 px ring is 5 px long, and with no track allowed it floats as noise beside its own number. Drawn outside the turn ring at figure size, the same 1.7 percent becomes a 37 px arc from twelve o'clock, with its end ring and the band hatch. So the horizon is part of the figure in every version, never a widget beside it.
2. **The band had to be faint through spacing, not opacity.** A see-through arc measured 1.51 to 1 against the page. The band carries meaning (how far off the estimate could be), so it needs 3 to 1. It is now drawn as thin ticks in full colour with gaps between them: each tick measures 7.01 to 1 and the band still reads as quiet. The band is wider than the dot that ends the solid arc, as the brief asked.
3. **The third demo person goes past the estimate.** At 54, the middle estimate is about 10,800 patterns (2,000 for each ten years) and the top of the band is 16,200, so 18,000 is past both. The product's release bank also holds only 10,800 lines today (`LINES_PER_CH`, as the game seat measured). Under the percent rule a ring cannot be filled past full and stay true. So this person's horizon is a closed ring, no percent is printed, and the page says: "More than the whole estimate for a person of 54, which is about 10,800. The estimate was too small for you." The band at scale shows on the person of 36 instead. That outcome is his figure meeting a real heavy user, and it is the first thing his recalibration will need to handle.

## Contrast, measured against each element's own ground

`node src/contrast.js` prints the full table and exits non-zero on any failure. It passed on the final build. Text must reach 4.5 to 1 and rings 3 to 1. The lowest values on these pages:

- The 13 px date on a tile while it is pointed at: `--dim` on `--panel-2`, **4.63**.
- The kept-family icon on a tile while it is pointed at: `--sec-embody` on `--panel-2`, **4.21**.
- The Field's figure outline at 70 percent: **3.55**. Two failures were caught and fixed on the way: the outline at 55 percent measured 2.62, and the see-through band measured 1.51.
- A release ring on the figure's brightest fill: **5.88**. On the dial plate: **6.53**.
- The turn ring's quarters on the page: 8.39 discover, 9.88 play, 7.01 flow, 5.57 embody.

## Each direction: what it is for, what it costs, what it bends

The costs are my estimates for the product build, in lines of UI code. They come on top of the stored data the systems seat sized (marks stored before the page). Every version shares the same core: the ring layer on the Body figure using the existing `pmAnat`, the turn ring, the horizon ring, the release moment and the words. In these mockups that core is about 290 lines (`src/shared.js`).

**V1, Body with rings.** For a person who opens the page to see themself. The figure lands first, the rings second, the text third. The ledger is tiles in a grid; at 390 it is a bottom sheet that grows into the space under the figure, so the newest dated tile shows without a tap.
- *Cost:* small to medium. About 300 lines over the core, mostly the sheet.
- *Bends:* at 390 the turn ring is Leonardo's circle, centred on the navel, and the shins pass out of it. No circle that fits a phone's width can hold a figure worth looking at.
- *Grade:* moves the surface from C- (the shelf on Compass today) to **B+**.

**V2, Dial.** For the person who reads instruments: a watch face built from the four of them.
- *Cost:* medium. About 350 lines over the core. It is also a third ring family that a person has to learn, which is why it needs a three-row key.
- *Bends "nothing names an absence", in spirit.* Ticks sit at their address number round the dial, so with 3 or 11 released the bezel reads as scattered debris, and the eye starts asking what goes in the gaps. With 52 released it reads as a beautiful bezel. It is the only direction that gets better as the record fills and is weakest for a new person.
- *Grade:* **B-**.

**V3, Field.** For feeling, not reading. It is the most beautiful of the four, and the one that most looks like the character work.
- *Cost:* medium to large. About 400 lines over the core. It adds a canvas of up to 18,000 points and needs a performance gate on a low-end phone.
- *Bends the dark-pattern line, in spirit.* Here the amount of light is the amount released. Free releases 10 patterns a week and tier one about 100 (`engine/plan.js`), so a payer's field brightens about ten times faster. Nothing on the page sells anything, but the picture itself shows how fast a tier fills, and the UX seat ruled exactly that out.
- *Grade:* **B**, A- for the look alone.

**V4, Receipt.** For the person who wants proof, plain: what left, where it left from, and when. It has one ink and one rule.
- *Cost:* the smallest. About 200 lines over the core. The list is bounded: one line per place plus one per kind of thing done.
- *Bends:* the turn ring is Leonardo's circle at both widths, crossing the shins.
- *Grade:* **B**. It is the most honest of the four, but on its own the figure has less presence.

## Recommendation

**Build V1.** It is the only direction where the figure is the hero at both widths and the record stays one glance away. It also costs little more than the cheapest.

**The one thing to change first: replace V1's grid of tiles with V4's receipt lines.** In V1 the tiles are four across, each with a full sentence, so every one weighs the same. That is twelve equal boxes asking to be read. The receipt is one column of dated lines with one rule, and it adds the line V1 does not have: each place released, with what it held. It reads faster, costs less and answers "what left me, and when" in the order it happened. Keep V3's field as the release moment's own scene once there is room to measure it on a phone.

Not covered here: Snow, Punch and Glass. These mockups are Dark only, and Snow already has paper values for `--sec-flow` (`#00635B`) in `head.html`.

## Rebuild and re-measure

    node mockups/achievements/src/build.js
    node mockups/achievements/src/contrast.js
    flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules \
      PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/achievements/src/shots.js

The picture run fails on any page error and on any request that leaves the file. Its last run was clean.
