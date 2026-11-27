# Character page: the face, the selected state and the effects

Round NK. Art direction: Mika Ueda-Salas, with Sol Amadi (colour and light),
Bjorn Haraldsson (type and grid) and Petra Nikau (composition and symbol).
Motion: Kai Moana. A spec, not a build. Measured 1 October against the working
tree. Tissue sample: 12 of the 14 reference people, read headlessly through
`engine.js`; Lance and Rosa read as unread through that loader and are not
counted.

## 1. The face: E2, the egg broad at the brow

The drawing survives, outside the repository: `scratchpad/mt/proto.js`
(`eggPath`) and `mt/1-shapes-sheet.png`, the sheet he ruled from at MV.

- **Curve**, in the icons' 24 unit box: x = 12 + 5.624 sin t (1 + 0.2 cos t),
  y = 12.4 - 7.4 cos t. Brow at y 5, chin at y 19.8.
- **Proportion.** 11.46 wide by 14.8 tall, aspect 0.775. Widest line 40.7%
  down. "Broad at the brow" is 10.72 wide at a quarter height against 8.77 at
  three quarters, 1.22 to 1.
- **One path for canon**, fitted within 0.01 units, replacing `MASK_FACE`
  (the Knowledge icons change with it):
  `M12 5C14.9 5 17.73 7.02 17.73 11.02C17.73 14.72 15 19.8 12 19.8C9 19.8 6.27 14.72 6.27 11.02C6.27 7.02 9.1 5 12 5Z`
- **Grid.** Box `CH_X0 3, CH_Y0 2.2, CH_S 18`, one grid for all five
  (19.A3), `CH_RES` 20, 28, 36. Bjorn measured 16 dropping the Teen's crack
  to zero cells.

```
 3 ........OOOO........    G 20, the Child, rows 3 to 19
 4 ......OO####OO......    (rows 0 to 2 are clear; the
 5 .....O########O.....     Ideological bar sits on row 1)
 6 ....O##########O....
 7 ....O##########O....    O  rim
 8 ....O###----###O....    #  fill
 9 ....O##--oo--##O....    o  aperture ring, rim weight
10 ....O##-o  o-##O....    -  moat, never lit
11 ....O##--oo--##O....       blank: cut, ground shows
12 ....O###----###O....
13 ....O##########O....    162 face cells, 40 of them rim
14 .....O########O.....
15 .....O########O.....
16 ......O######O......
17 ......O######O......
18 .......OO##OO.......
19 .........OO.........
```

**Marks are cells, not stroke tests.** Centred marks take an even column
count, since the face mirrors at G/2. Child 2 by 1 at y 11.6. Preteen two 2 by
1 at x 9.3 and 14.7. Teen 2 columns, brow to three quarters down. Adult one
row on its seat join. Ideological one row, one empty row above the brow; icon
`M9 2.6h6`.

Petra and Bjorn. Craft B minus to B.

## 2. Selected: lit, not pressed

**Defect.** `.chv-m[aria-pressed=true]{border-color:var(--gold)}`,
`head.html` 4843, and the weave's `box-shadow:0 0 0 2px var(--accent)`, 4853.
An edge drawn round a control is a form button. The Field never selects that
way: the chosen chain "saturates rather than lights" (`wheel.js` 1163). Sol:
saturation reads as arousal, so the selected mask is the one at full chroma.

| State | Treatment |
|---|---|
| Rest | No border, no ground. Svg `filter:saturate(.45)`. Glow held at .64, still. |
| Hover | `saturate(.75)` and an 8% pool, over `--t-element` 220ms, `--ease-out`. |
| Selected | `filter:none`. A `::before` pool, `radial-gradient(closest-side, color-mix(in srgb, var(--mk-top) 20%, transparent), transparent)`, `--mk-top` the highest seat, set inline. Pool and glow on `chvBreath`, `--t-breath` 4.2s. |
| Hero | Never framed. The same pool at 12%, centred on the widest line, radius 60%. Same light at two sizes is what joins icon to hero (Petra). |

**Saturate, not opacity.** The saturate matrix keeps luminance near enough
that the rim's contrast barely moves; opacity would push a rim already at 1.43
to 1.99 to 1 (19.A5) further under 3 to 1. Measure on #101010 after.

**Lightings.** Snow: a 14% pool. Glass: as Dark. Punch, by its own rule that
a selected thing is a fill: flat `color-mix(in srgb, var(--mk-top) 22%,
var(--sunk))`, no breath. Keyboard keeps `:focus-visible`, never shown on a
press.

Sol and Mika. F, a generic control, to B plus.

## 3. What comes in from the Field, and the language it makes

**What it integrates over.** The addresses under each mask's seats, summed
per seat band of the face (the body map, 19.A9). Three quantities cross:
charge per address (`sq`), weight per pattern (`(w - 3.5) / 3`, as
`frChains` draws chords) and direction since the record opened (`frDir`).
The grammar comes across, the geometry does not.

| Effect | From the Field | One meaning |
|---|---|---|
| Breath | 0.82 + 0.18 sin(2 pi t / 4.2) | Read and alive. Each mask its own phi period, 19.A1 |
| Pool | `frShadow`'s radial pools | Attention: the selected mask |
| Fringe | `fringeDraw`, `frStress` | Load: running hot |
| Pulse | `pulses()`, a 7 pixel dash | Connection: the weave |
| Fall | the rest of the web to .08 | Focus: all outside the weave |

**Not taken:** the canvas aura (already here as `chWash`), feathers (radial,
the core's own), bowed chords (a grid has no curve), names revealed by zoom.

**The language is three zones, one question each.** Inside the rim is what
you hold: brightness is charge, fusion is how far it has built. The rim is the
membrane: it breathes when read and lights at the character. Past the rim is
what it costs: fringes where it is loaded, spill where it got out. A face reads
like a pressure map with the labels off, the test the Field already passed.

Kai and Sol. Intent B to A minus.

## 4. Running hot and overexpressed

**Correction first.** "Running hot" already means an address past 5,
`RUNHOT_AT`, `wheel.js` 1035. Complex and hyper complex are how built, not how
hot. One word per concept: tier stays fusion, ruled at 19.A2 (dot, tile, fused
plate, plate with an ink bevel).

**Running hot.** Dark reading, hero only. Outside the rim, at the hot seat
band's rows, three dotted echoes of the outline at the stipple inset .33,
alternating seat colour and the seat lifted 55% toward white (30% toward black
on paper). Alpha `frStress^1.3`: zero at 5, a visible step on crossing. Two
cells apart at low stress, one at full, so they crowd where the load is.
Expanding, they step outward a cell every 1.1s; collapsing, inward; steady,
they stand and breathe. Past 6.5, the band's rim pushes out one cell. Reduced
motion: fixed phase.

**Overexpressed,** `o.over`, light reading only (`chOwn`). The engine's words:
"will not shut, rather than will not open." So the block never closes: its end
gap (`chRead`, line 334) fills; a one cell spill at .30 lights every ground
cell touching it; and it holds still while its mask moves. Stillness on a
breathing page reads as stuck, and survives reduced motion.

**No alarm red on the face.** Sol: #FF2E1F on a seat lattice reads as more
Root. It stays on the word "overshot" in Selection.

**Sample.** 161 hot addresses across 7 of 12 people. 21 overshot saboteurs
across 6; Sofia, Marcus and Angela run only overshot.

Kai and Sol. Truth C to B.

## 5. The information layer, and the weave alone

**Defect, Petra.** The page opens with Child as hero and Selection silent:
`chDrill` runs only on a press. NA ruled they move together.

**Three depths.**

1. **The page, on open.** "Your character": a row per mask in canon order, a
   24px icon, the name, the highest thing built there in one word, and the
   count running hot. The hero's row wears the pool. A row is a rail press.
2. **A mask.** `chDrill`, led by three counts, each keyed by a 3 by 3 crop of
   the person's own cells: running hot, how built, overshot. The key lives
   here, never on the stage; he cut the Field's stage caption at BA9.
3. **A saboteur.** `runDrill`, led by "Runs under": each mask it lights, with
   its address count there. None: "It runs at the heart, where no mask is worn
   yet." 38 of 215 saboteurs in the sample touch no read mask until R1.

**The weave alone, Kai.** Over `--t-surface`, 320ms, `--ease-out`: every hero
cell outside the saboteur falls to .08, the Field's number. The glow goes out,
the wash drops to .35, rim and marks hold. The woven block keeps full tone,
and one cell, 42% toward white, walks it in hand out order, a step every 180ms
slack to 90ms taut, then rests 600ms. Rail members repeat that in miniature;
the rest go `saturate(0)`, silhouette kept, nothing lit. Back in 220ms.

Petra and Kai. Structure A minus to A.

## If only one ships

The egg, section 1. He has named it in two rounds and rejected two builds over
it, and it is the geometry every other section draws on: the fringe needs the
rim's rows, the moat needs the marks, the pool centres on the widest line, so
effects built on today's outline get drawn twice. It is also the cheapest
certain win, because the drawing exists and the path above is fitted: a canon
change to `MASK_FACE` and the halo path, the grid box and `CH_RES` in
`ui/character.js`, marks laid as cells, `tools/equiv.py` naming the diff, and
the Knowledge icons looked at. Second, the selected state, a few lines of CSS
that take away the thing he called a button.
