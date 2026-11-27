GRADE: 70/100 (pass 1: 56, pass 2: 60)

Mika, with Sol (colour, light), Bjorn (type, grid), Petra (composition, symbol). I re-measured every hex below in this pass (contrast against each element's own ground, and OKLab distance, a measure of how different two colours look to an eye; under 0.08 reads as one family).

## 1. THE PROPOSAL IN THREE SENTENCES

One light figure sits at the centre of the Field, Summary and Avatar page; light means coherence, bend means load, and there is no number on it. One ring of four arcs draws the loop; one grammar says hue means place, state separates by lightness and form, and one scale covers type, radii, motion, copy and locks. The merge bent three things and lost four. Bent: the accent (it needs a value per lighting, not one), "unlit seat is ink at 40 percent" (fails in Snow), and weights (it keeps three; I wanted two). Lost: Glass white inherits Dark's alarm at 3.43 to 1, Lumen Sacral and Solar sit under 3 to 1 on paper, Glass white has no seat tokens, and alarm sits 0.039 from Root in Lumen.

## 2. THE ICP ROOM (what I see from colour, shape, symbol)

- **Marcus (founder, level 7).** Sees a lit figure over a wheel, one cool accent, seat hues only on places. Opens the Avatar, stays. "Finally it looks like me and not a dashboard."
- **Whitney (phone only, level 5).** Sees a 64 px figure, one 44 px loop ring, the "not read yet" pill no longer on the zoom buttons. Taps the ring, stays. "I can tell where I am without reading."
- **Nils (design skeptic).** Counts: 3 radii, 6 sizes, one stroke. Stays only if Source OS is fixed. "Show me the system and I will believe it."
- **Camille (somatic practitioner).** Sees seat hues kept, stone steps for rank, nothing red on a low reading. Stays. "Low is not an emergency, good."
- **Marta (acute distress).** Sees a pencilled dashed outline, no red, no padlock wall, one sentence. Leaves if alarm red shows on a blank profile. "Nothing is shouting at me."
- **Renata (operator).** Sees tokens she can name. Stays if one palette edit repaints the wheel. "One place to change it."
- **Trey (quiz tourist).** Sees a figure and a dashed outline. Ten seconds is enough to want a lit one. Leaves at the first padlock. "Cool, how do I light mine?"
- **Sofia (loves the open tables).** Sees stone steps and rings, no hue noise. Stays. Leaves if tier hues come back on the tables. "Now I can read the table by shape."

## 3. UNIFIED QUALITY: 71/100

Gaps left:
1. **The figure is unbuilt, and its data path is not.** Soul on screen cannot pass 6 until it draws.
2. **Three seat glyph tables remain** (`SEATGLYPH`, `AV_IC`, `CHILD[].ic`). 44 of 198 shapes sit under more than one label. A skin fixes it only by container, below.
3. **Snow on a paper stage and the canvases' colour read are untested.** Seats measure 4.54 to 5.36 on the new stage, but the canvases were drawn for black.

## 4. FINAL GRADE: 70/100

Up ten. It moved on measured fixes, not on a build, which does not exist yet.

## 5. MY PART OF THE BUILD SPEC

**Colour roles, hex per lighting** (Sol found the gaps; all values measured).

| Role | Dark, Glass, Punch, Flat | Snow, Glass white | Lumen paper | Lumen stage |
|---|---|---|---|---|
| Seats (7) | `PAL`; Root lifted to `#DB5B55` (4.52 on panel, was 4.14) | Glass white takes `PAL_LIGHT` (4.57 to 5.82 on its stage) | `PAL_VIVID`; Sacral `#EB7000`, Solar `#BD8B00` (3.07, 3.06; were 2.61, 2.79) | same |
| Accent, control only | `#AFC0CE` (0.090 from Throat, 9.02 on panel) | `#3A5266` (0.091, 7.60; was 0.018) | `#0A5C8C` (0.164, 7.19; was 0.059) | `#F7F7F7` ring |
| On accent | `#0B1418` | `#F4F8FA` | `#FFFFFF` | `#101010` |
| Stage | `#0F1117`, Glass `#0B0D14`, Punch `#12131B`, Flat `#0A0B0E` | `#F2F0EB`, Glass white `#F2F1EC` | `#101010` (ruled) | |
| Stage ink | `#EFEDE8`, Glass `#F3F2EE`, Flat `#F7F6F3` | `#16171C`, Glass white `#14161C` | | `#F7F7F7` |
| Unlit seat | ink at 40 percent: `#69696B`, 3.44 | ink at 50 percent: `#848484`, 3.28 (40 percent measures 2.50) | | `#6C6C6C` |
| Steps 1 to 4 (rank, tiers, tracks, layers, loop, paid) | `#7E7A73 #99958D #B5B0A9 #D2CDC5` | `#848078 #67635C #4B4741 #312D27` | as Snow | as Dark |
| CQ floor, top | `#7D8597`, `#EAF4F9` (4.55 floor on panel) | `#667084`, `#0F2C3F` | `#5E6779`, `#0A2A40` | `#7D8597`, `#F2F8FB` |
| Alarm | `#FF2E1F` | `#D41200` (Glass white too, 4.99; it inherited 3.43) | `#E61000` (4.73) | |
| Figure light | `#F4E7C8` | `#E3CC8E` wash | `#FFE9B0` | |
| Figure floor line | `#767167` (3.89) | `#797979` (3.82) | | `#777163` |

Rules that go with the table:
- **CQ is one ramp.** Floor, mid (the 50 percent mix), top, in the same hue. Lit end is always the highest contrast end on its ground. Delete `TIERCOL` hues (`canon.js:697`). Never red. Word and core read the same stops (`ui.js:1031`, `wheel.js:92`).
- **Alarm is never colour alone.** It always carries a double ring and a glyph, because Root sits 0.082 from alarm in Dark and 0.039 in Lumen. Not on an unread profile: unread badges and tape marker use step 1 and a dash.
- **Steps versus accent.** Steps 3 and 4 sit 0.055 to 0.064 from the accent. Measured limit. Form separates them: accent is a ring on what you picked; a step is a filled bar for rank. They never share an element.

**The figure look** (Petra, Sol).
- One outline, stroke 1.6, round caps, `--stage-ink` at 90 percent. Seven bands root to crown inside. Band hue is its seat (place). Band brightness is that seat's coherence. Halo is `--fig-light`, scaled by CQ.
- Floor: halo never under 35 percent, outline never under 3 to 1 against the stage (table). Warm dim fill `#2D2723` on Dark. It never goes dark.
- Unread: dashed 4 4, unlit seat colour, no light. Read: solid. Bend (posture) is load. No number on it, no seat hue on the halo.
- Sizes 96 px at 1600, 64 px at 390. Drawn once per change; breath is CSS opacity.

**Shape and icon rules.**
- Radii 4, 10, 16, 999. Map 2 to 5 to 4; 8 to 12 to 10; 14 to 18 to 16. Lumen and Flat set 10 and 16 to 4, as now.
- Icons are rings, stroke 1.6 on a 24 grid, round caps and joins, drawn at 20 inside the box. Rendered stroke never under 1.5 px (`vector-effect:non-scaling-stroke` under 24 px). Lumen keeps 1.9. Punch keeps fills.
- Container says the class, glyph says the item. Seat: glyph in a ring. Axis: bare glyph, no ring. Loop: open arc. Mark earned: ring with a tick. Lock: sealed double ring.
- Solid is measured. Dashed is not measured. Nothing else dashes.
- Sizes 11, 13, 16, 20, 28, 44. Weights 400 for text, 500 for numerals and controls, 600 for headings. Sentence case, no `capitalize`.

**Build order.**
1. Seat tokens on all seven lightings, canvases read once per lighting change. M. `head.html`, canvas modules. Gate: a new `design.js` check that a canvas pixel equals its token.
2. Accent per lighting, Root lift, Lumen seats, Glass white alarm. S. `head.html`. Gate: distance to every seat at least 0.08, contrast at least 4.5, per element ground.
3. Stage tokens and Snow paper stage. M. `head.html`, `lock.js:252`. Gate: `shots.js` Snow Field, squint check.
4. Steps replace tier, track, layer and loop hues. M. `canon.js`, `ui.js:1401`, `map.js:702`, `fieldbar.js`. Gate: no seat hex outside place.
5. One CQ ramp. M. `wheel.js:92`, `canon.js:686`, `ui.js:1031`. Gate: `equiv.py` named diff, word at least 4.5.
6. Alarm roles and unread colour. S. `head.html:3979`, `release.js:1141`. Gate: alarm count on a blank profile is zero.
7. Radii, sizes, weights, stroke codemod. M. `head.html`. Gate: design.js counts (3 radii, 6 sizes).
8. Figure. L. New renderer. Gate: under 60 nodes, frame budget, floor contrast.

## 6. RANKED RECOMMENDATIONS

1. Seat tokens read once, all seven lightings (M). All ICPs, Renata first. Reskin.
2. Per-lighting accent, unlit, Glass white and Lumen fixes (S). Nils, Marta, Camille. Reskin.
3. Steps and one CQ ramp (M). Sofia, Camille, Marta. Reskin.
4. Figure, free, with floor (L). Marcus, Trey, Whitney. Redesign.
5. Container grammar and radii, sizes, stroke (M). Nils, Sofia. Reskin.
6. Source OS at `#7F8494` (4.51 on panel) beside his `#343434` (1.36), his call (S). Nils. Reskin.

## 7. ONE QUESTION

None. Source OS stays his hex until he sees the number. The proposal already carries that.
