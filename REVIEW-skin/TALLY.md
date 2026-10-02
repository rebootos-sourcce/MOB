# Skin review, tally (round PH, 2 October)

Standing framework, three passes, twelve seats (QA's measured pass 1 is still being written;
it joins when it lands). Passes 1 and 2 graded the SHIPPED product, measured against the
screens as built. Pass 3 graded the lead's merged PROPOSAL on paper.

| Seat | Pass 1 (shipped) | Pass 2 (shipped) | Pass 3 (proposal) |
|---|---|---|---|
| Art direction | 56 | 60 | 70 |
| UX | 51 | 47 | 62 |
| Copy and type | 68 | 58 | 64 |
| Brand | 56 | 58 | 66 |
| Systems | 39 | 38 | 44 |
| Animation | 70 | 66 | 68 |
| Innovation | 52 | 51 | 58 |
| Mechanics and stickiness | 48 | 44 | 55 |
| Technical | 56 | 60 | 68 |
| Marketing | 52 | 49 | 63 |
| Sales | 58 | 55 | 63 |
| Creative | 58 | 55 | 66 |
| **Average** | **55.3** | **53.4** | **62.3** |

The shipped product averages 53 to 55. The skin as proposed projects near 62 on paper;
systems grades its own discipline lowest (44) because the counts are ugly: no type scale token
exists, the accent fails its own contrast floor on all seven lightings, eight of ten tier colours
sit within 0.08 of a seat colour, seat colour has two owners (about 298 `rgba` and `mixc` sites),
and the coherence index measures 23 today (projected 74 when every move lands; floors 40 for
the skin round and 65 to ship). The grade cannot reach the proposal's own 74 until the figure
has a data path and a hub big enough to read.

## The one finding under all of them
The soul is "every part of this reading can be opened and checked" (brand) and "load and the
person under it, release is the load coming off" (creative). The build keeps that half the
time: the open tables do; the Field opens on a number, the avatar is behind a lock and empty,
the loop is a row, and one colour means sixteen things.

## Rulings after pass 3 (lead; each revisable, reasons given)
1. EMBODY STAYS KNOWLEDGE (creative, evidence: `core.js` lines 142 and 228 quote his "Embody is
   knowledge"). The figure appears on every surface and tapping it opens the Avatar tab.
   "Avatar as Embody" is a redesign and his call, not this skin.
2. The ring lights the SECTION YOU ARE IN (creative); it never changes with time; a 6 px dot
   marks the newest dated act and ships when that data exists (technical: no data behind it yet).
3. TYPE: measure first. The first build step reruns the codemod on the six steps (11, 13, 16, 20,
   28, 44) through `design.js` and `collide.js`; the measured fallback is the seven steps (11,
   12, 13, 14, 16, 20, 28) which both gates passed. 12 and 14 stay as chrome-only steps if more
   than five strings wrap. Token names `--fs-1` to `--fs-9` (systems). Weights 400, 500 (numerals
   and controls only), 600.
4. COLOUR per lighting (art, systems; every figure measured on its own ground): accent dark
   `#AEBFCB` (0.089 from Throat), Snow and Glass white `#33516E`, Lumen paper `#0A5C8C`;
   unlit seat is ink at 40 percent on dark and 50 percent on Snow and Glass white; Glass white
   alarm `#D41200` and it takes `PAL_LIGHT` seats; Lumen Sacral `#EB7000` and Solar `#BD8B00`
   (hue held); alarm is never colour alone (double ring and glyph); Dark Root `#DB5B55` is
   PROPOSED (a lightness nudge on a seat hue, he ruled the palette punched up ten percent and
   "hue does not move"; held until he sees it); ONE CQ ramp per lighting with an unlit floor that
   is never invisible (dark ramp starts `#6B7384`, 3.54 to 1); Snow's stage moves to paper.
5. THE TEN EMBODIMENT BANDS KEEP TEN COLOURS (technical: `TIERCOL`, gate 15, his ruling); the
   chain tiers, practice tracks, layers, loop and paid tiers go to the one slate ramp. Because
   eight bands sit within 0.08 of a seat colour, a band mark is always a FORM different from a
   seat mark (a bar for rank, a ring for place); recorded as a known limit.
6. RADII `--r-1` 4, `--r-2` 10, `--r-3` 16, `--r-pill` 999px; `--r-xs` and `--r-s` alias `--r-2`
   for one release (systems: 4 would otherwise shrink the old 8 px visibly).
7. MOTION: `Land` is 320 ms (`--t-surface`, `--ease-land` already exist, no gate 12 edit); dial
   timing is a JS tween on elapsed time; the Compass fix is six sites in `ui/cone.js`, not one
   (spin, clock, `coneMirStep`, spin chase, zoom chase, pluck decay; at 120 Hz everything runs
   at twice the speed today); two period snaps in `ui/wheel.js` (4.49 s to 4.2 s, 9.09 s to 8.4 s).
8. LOCKS: one chip per surface, never grey, naming the RUNG ("Opens on tier one"). Sales wants
   the price on the chip; copy ruled no price in a lock tooltip. Lead: the chip names the rung and
   the one-card tier sheet one tap away shows the price; revisit after tap to Stripe is measured.
9. SOURCE OS: his `#343434` stands as his ruling; he sees the number once (1.36 to 1 on the bar
   panel, 1.56 on the page) and my proposed fix `#7F8494` (4.51 to 1); one token, `--mark-sub`.
10. THE FREE FIGURE is the unmasked "load low" posture from the Aura states (no Child, Teen or
   Ideological mask: masks classify a person and stay the paid layer), pre-drawn once per reading
   change, breath in CSS opacity, light floor 35 percent, no number on it; the dial numeral (44 px)
   sits on a plate under it. The Field hub is about 100 px today and a readable figure is 240 px
   tall, so the wheel geometry needs its own spec before the figure ships (gap).
11. FUNNEL TRUE-UP comes FIRST in the build (marketing, sales, copy): `funnel/buy.html` still says
   50 patterns (ruled 25) and "a tier is a rate of new ground and nothing else" (false since 1 Oct).
12. Engine facts the skin cannot fix: the Marcus example reads Gaining 62 on the Field while Story
   says nothing is held (one reading, two answers); the figure has no data path ("avatar" appears
   in none of the files that draw charge); day two has no pull (games seat: a Commit landing beat
   "The day is on the record.", a dashed streak ring with no count, a day-two line).

## Build order (technical's ten steps and the other seats' parts, merged)
Not skin, first: J13 copy, J9 truth, J5 masks by tier, J3, J4 (they own the same files). Then:
S1 token layer and type codemod (S), S2 canvases read tokens and `rgba` stops allocating (M),
S3 stillness while unread, the 390 pill, Compass on elapsed time (S), S4 one MOTION clock (M),
S5 pre-drawn figure (M, after J4), S6 lock mark inside P11 (M), S7 names and Embody (S, after
J5), S8 ring unlit (M), S9 unread stage (M, after P18b), S10 engine data changes with a named
`tools/equiv.py` diff (L, last). The coherence gate `tools/coherence.js` lands with S1.

## QA's measured defects (pass 1, real Chromium, dark theme, 14 surfaces, 1600 and 390 wide)
27 distinct text sizes (ten are half-pixel steps), 47 text colours, 19 icon sizes, 21 stroke widths,
median 67 controls per screen, 106 of 2063 text items fail 4.5 to 1. Quick fixes, in order:
1. The count on the selected tab (`.stk-t.on b`) is invisible, 1.12 to 1, on 11 of 14 surfaces:
   two rules on one selector. FIXED in source this round (one line).
2. Analytics archetype bar labels on their own bar colour read 1.6 to 3.5 to 1 (dark ink on the green bar is 7.9).
3. `--dim` on tinted cards reads 3.6 to 4.4 (a step to about `#a5a29d` clears it).
4. The red text token reads 3.5 to 4.1 (about `#dd716c` clears it; note the seat hue ruling).
5. `button.s-row` (Summary at 390) and `button.bal` (Field dial) fall back to Arial (22 elements): `button{font:inherit}`.
6. Body map dim labels read 2.4 to 3.1 (a deliberate dim state that still measures as a fail).
7. The Source OS logotype is 1.34 to 1 in his fixed hex: record it as a named exemption.
The probe `REVIEW-skin/measure-coherence.js` is validated against a hand-checked fixture and is ready to become a gate.
