GRADE: 62/100

Seat: Sam Oyelaran, DevOps and QA. Discipline: measurable proof. Build measured: `source.html`, md5 `ccb7f6fc40938e0e6a935dab3e28796e`, dark theme, profile 3 (Marcus, example), 14 surfaces, 1600 and 390 wide, real Chromium. I edited no source and no build product.

SIGNED OFF: NO. One control is unreadable today (item 1 below), and the contrast floor fails on 5% of text.

## Reproduce it

    cd /home/user/MOB
    NODE_PATH=/opt/node22/lib/node_modules node REVIEW-skin/measure-coherence.js --json out.json --md out.md
    ... --selftest                    the probe checks itself and stops
    ... --baseline out.json --gate    exit 1 if any "lower is better" number got worse

## The tool was checked before the product

The probe carries a fixture with answers known by hand and refuses to run if any is wrong: black on white is 21.0, #777 on white is 4.48, color-mix, gradient and 2D canvas grounds, a scrolled container, a label drawn twice and clipped with clip-path, a placeholder, generated content, and four things with a box and no paint.

It lied three times while I built it, and the fixture caught each:

- Dark ink on a dark ground for a button that is bright blue. A "full page" screenshot of this app is a viewport with black padding, because the page scrolls inside `body`.
- A dark label nobody can see on the Field bars. Each label is drawn twice and the dark copy is clipped to the fill. A box is not paint, so every flagged label is now photographed as is and with its own glyphs blanked. No difference means no paint.
- The wash canvas read as white. Text over a canvas now reads the canvas pixels.

Six mutants of the probe each exit 2 on the self test (wrong luminance weight, box only visibility, no scroller walk, no paint test, blind to canvas, placeholder read in the control's ink).

## Coherence table, per surface (1600 / 390)

Distinct values on the whole screen. Ink and fill show perceptual families (colours within 3 units of Lab distance merged). Failing means under 4.5 to 1, checked against pixels.

| surface | text sizes | ink families | fill families | radii | shadows | controls | under 44 px | text failing |
|---|---|---|---|---|---|---|---|---|
| Story | 11 / 8 | 6 / 6 | 7 / 8 | 5 / 5 | 2 / 3 | 36 / 23 | 0 / 0 | 2 / 4 |
| Avatar | 13 / 13 | 16 / 16 | 15 / 15 | 5 / 6 | 3 / 3 | 64 / 61 | 0 / 0 | 4 / 4 |
| Summary | 15 / 19 | 15 / 15 | 15 / 17 | 5 / 6 | 2 / 2 | 50 / 83 | 0 / 0 | 4 / 4 |
| Intake | 15 / 15 | 22 / 22 | 23 / 22 | 5 / 5 | 6 / 6 | 64 / 60 | 0 / 0 | 10 / 9 |
| Analytics | 18 / 17 | 26 / 29 | 15 / 15 | 6 / 7 | 2 / 2 | 88 / 85 | 5 / 5 | 31 / 38 |
| Field | 11 / 11 | 16 / 16 | 23 / 21 | 5 / 5 | 5 / 6 | 71 / 65 | 0 / 0 | 3 / 3 |
| Body | 13 / 12 | 18 / 17 | 17 / 17 | 6 / 6 | 4 / 4 | 75 / 72 | 7 / 7 | 32 / 31 |
| Compass | 12 / 11 | 23 / 22 | 21 / 21 | 7 / 7 | 6 / 5 | 78 / 75 | 0 / 0 | 3 / 5 |
| Character | 12 / 11 | 16 / 15 | 14 / 14 | 6 / 6 | 2 / 2 | 62 / 59 | 0 / 0 | 3 / 5 |
| Ritual | 15 / 14 | 18 / 18 | 19 / 19 | 8 / 8 | 2 / 2 | 118 / 118 | 0 / 0 | 5 / 6 |
| Knowledge | 13 / 13 | 16 / 17 | 14 / 14 | 6 / 6 | 2 / 2 | 103 / 142 | 0 / 0 | 4 / 6 |
| Clients | 9 / 9 | 3 / 4 | 4 / 4 | 4 / 4 | 1 / 1 | 11 / 6 | 0 / 0 | 1 / 1 |
| Games | 13 / 12 | 15 / 15 | 14 / 14 | 6 / 6 | 2 / 2 | 60 / 61 | 0 / 0 | 3 / 4 |
| Settings | 9 / 8 | 5 / 6 | 5 / 5 | 4 / 5 | 1 / 1 | 23 / 21 | 0 / 0 | 1 / 1 |

Overall, union across all surfaces (1600; 390 is within one or two):

| dimension | distinct | top five cover | on one surface only |
|---|---|---|---|
| text sizes | 27 | 77% | 9 |
| weights | 5 | 100% | 0 |
| text ink (families) | 50 (47) | 89% | 32 |
| fills (families) | 68 (43) | 55% | 28 |
| border colours (families) | 60 (25) | 67% | 27 |
| border widths | 3 (1 px is 98%) | 100% | 0 |
| radii | 9 | 97% | 3 |
| shadow shapes | 11 | 93% | 6 |
| icon sizes | 19 | 78% | 5 |
| icon stroke, authored / drawn | 14 / 21 | 83% / 71% | 4 / 7 |
| icon style | ring, 1275 of 1275 | 100% | 0 |

Two ratios a skin can move. Concentration (share of uses held by the top five values, mean of nine dimensions): 82% at 1600, 81% at 390. Local dialect (values found on one surface only): 43% at 1600, 47% at 390. Text under 12 px is 14% of characters.

Floors. Controls per screen: median 67 at 1600, range 11 to 118. Reachable above the fold: median 45 at 1600, 16 at 390. Horizontal overflow 0 px everywhere. App requests that are not file, data or blob: 0. Rendered em dashes: 0. All caps text: 1.

## Criteria

| criterion | /10 | evidence |
|---|---|---|
| Type scale | 5 | 27 sizes; ten sit between 11 and 15 px in half pixel steps; 9 appear on one surface only |
| Weight and family | 8 | 5 weights, one family, except 22 text elements at 390 that fall to Arial (item 6) |
| Colour palette | 5 | 47 ink families, 43 fill families, 43% single surface dialect |
| Shape | 8 | 9 radii hold 97% of uses; hairline is 98% of borders; 4 shadows hold 93% |
| Icon system | 6 | every icon is a ring, rule holds; 19 sizes, 21 drawn stroke widths from 0.6 to 3.6 px |
| Contrast | 3 | 106 of 2063 text elements fail at 1600 (5.1%), 93 under 4.0; 121 of 2413 at 390 |
| Tap targets | 8 | 12 distinct controls under 44 px; floor is 29 px at 1600, 26 px at 390 |
| Interaction density | 4 | median 67 controls per screen, 142 on Knowledge at 390; working memory is about 4 |
| Voice rules, measurable | 9 | 1 all caps element (owner ruled logotype), 0 em dashes, 0 overflow, 0 requests |
| Provability of the skin | 6 | the probe now exists and is deterministic; one theme and one profile only |

## The soul, for a measuring eye

The skeleton is disciplined and the skin is not. Hairlines, pills, 44 px targets, one typeface and ring only icons hold to within a few percent everywhere. Colour, small type and line weight are where each surface starts to speak its own dialect.

## What breaks coherence, ranked

1. **An invisible number.** The count on the selected tab (`.stk-t.on b`) is ink `#0b1418` on the page ground, 1.12 to 1, on 11 of 14 surfaces. `head.html` lines 3597 and 3598 are two rules for one selector; the second wins and the tab background is transparent. Photographed: the 9 is not there.
2. **Analytics archetype bars.** 23 labels and values at 1600 (25 at 390) sit on their own bar colour at 1.6 to 3.5. Dark ink `#0b0d10` on the green bar is 7.9; the light ink is 2.1.
3. **`--dim` (#94908a) on tinted cards.** 8 to 12 elements at 3.6 to 4.4 (Intake, Story, Compass, Body).
4. **Red as text.** `#d6524c` for Warrior, Root and Ground reads 3.5 to 4.1.
5. **Body map dim labels** ("clear", "Cranial plexus", "100%") at 2.4 to 3.1. A deliberate dim state that measures as a failure.
6. **Wrong font at 390.** `button.s-row` (Summary) and `button.bal` (Field dial) do not inherit the family and fall to the browser's Arial.
7. **Icon weight changes with size.** Strokes are authored in a 24 unit box (1.6 is commonest) and shown from 8 to 46 px, so one icon draws at 0.6 px small and 3.6 px large.
8. **Twelve controls under 44 px.** Five archetype bars (29 to 40) and seven Body seats (36, and 26 at 390).
9. **Density.** Ritual 118 controls, Knowledge 103 (142 at 390).
10. **Logotype.** "Source OS" `#343434` on `#1a1e26` is 1.34. The owner fixed that hex three times. Record it as a named exemption instead of finding it as a failure every run.

## Skin recommendations

- Fix item 1. Effort S. Every ICP, since it is a number a person cannot read.
- Two token steps: `--dim` to about `#a5a29d` (worst card ground reaches 4.51) and the red text token to about `#dd716c` (4.54). Effort S. Clears about 20 failures.
- Flip bar ink to dark above a bar's fill (item 2). Effort S.
- `font-family:inherit` on buttons (item 6). Effort S.
- One stroke width per icon size tier, with `vector-effect:non-scaling-stroke`. Effort M. Collapses 21 drawn widths to about 3.
- Collapse half pixel type steps to one ladder (11, 12, 13, 14, 16 plus display). Effort M.
- Give the 12 small controls 44 px hit areas without moving the drawing. Effort S.
- Commit a baseline JSON and run `--gate` beside the other four gates. Effort S.

## Redesign candidates

None for my discipline. Each defect above is a token, a rule or a stroke setting, and a skin reaches all of it.

## Risks

- The pixel oracle is blind to paint taken from `currentColor`.
- The wash canvas under text moves a ground by up to 0.3 in ratio, so the gate allows one more borderline element per surface and allows no new failure under 4.0.
- Dark theme and one profile only. Light and Punch are unmeasured; run the theme switch before the skin ships.
- Listeners added in script are invisible to the DOM, so control counts are a floor.

## Proof the gate works

- Clean build against its own baseline: exit 0.
- Same build with one injected rule (`.pm-eye` ink and size, `.btn` radius and shadow): exit 1, 69 metrics named as worse.
- Three full runs: identical except one borderline ink that the wash flips and a ghost count that moves by one. A first version flaked on the Story surface under load (5 sizes against 11); it now waits until the surface stops changing.

## Four gate counts, in order

- `BUILD.sh`, `BUILD-engine.sh`: not run. They rewrite build products and this pass is read only. md5 of `source.html` unchanged.
- `node tests/engine.js`: 3638 passed, 0 failed
- `node tests/functional.js`: 1806 passed, 0 failed
- `node tests/collide.js`: 351 passed, 0 failed
- `node tests/design.js`: 186 passed, 0 failed

Not signed off.
