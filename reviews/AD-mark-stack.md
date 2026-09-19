# The Mark, Drawn From The Stack

Art direction. Written after the owner rejected the first proposal outright and gave
the direction himself. Nothing from `reviews/AD-mark-and-boot.md` sections 3 and 4 is
reused: that was a gold nimbus argued from phi, and it carried neither of the two
things he has now named as ours.

Open `reviews/mark-stack.html`. It is the deliverable. This file is the working.

Mika Ueda-Salas, art direction and the whole. Sol Amadi, colour and light. Bjorn
Haraldsson, type and grid. Petra Nikau, composition and symbol. Every finding below
says which of us found it, because a finding with an owner is a finding somebody can
be argued with about.

## The Direction, Verbatim

> The stack is really interesting because the fetters are, all of it is divine
> geometry. The fetters are the most detailed, and then the very top is binary,
> right? Benign, malignant. And they all stack and form a shape. So then we also have
> seven chakra colours. So we have two elements that are very unique to us. And then
> we also have our soul shape, that kind of squiggly cue.

Four claims in it, and I went and checked all four before drawing anything. Three
hold. One does not, and one is half true in a way that is more useful than the whole
version.

## 1. The Stack Is Real. Here It Is, With Line Numbers.

Seven rungs, bottom to top. Each is a coarser reading of the same field.

| rung | what | count | seat colour | file and line |
|---|---|---|---|---|
| 1 | addresses | 112, being 108 somatic and 4 field | all seven, on `.b` | `atuned_src/engine/data/nodes.js:5` |
| 2 | fetters | 9 poled | six seats on `.seat`, no Crown | `atuned_src/engine/data/canon.js:100` |
| 3 | saboteurs | 33 named, 14 clusters, 9 inferred | through the family | `canon.js:8`, `nodes.js:7`, `canon.js:131` |
| 4 | complexes | pairs inside one family | inherited through `hcx` | `atuned_src/engine/compute.js:88` |
| 5 | hyper | 6 architectures, 6 overshoot poles | six seats on `.b`, no Heart | `nodes.js:34`, `atuned_src/engine/core.js:15` |
| 6 | character | pairs of hyper, gate at weight 5.6 | inherited | `compute.js:107` |
| 7 | orientation | one bit | none | `compute.js:180` |

The product already renders five of these seven as a tab strip at
`atuned_src/ui/ui.js:352`, named Fetters, Saboteurs, Complexes, Hyper, Character. The
addresses sit under it and the orientation sits over it in the left rail under the
heading Orientation at `atuned_src/shell/body.html:256`. So the structure he is
describing is not a metaphor and it is not new. It is the product, read as one
object, which nothing in the product currently draws.

**Found by Mika.**

### 1.1 The Taper Is Real And It Is Not Monotone

All nine axes set to the same value, one blueprint domain, no roots, run through
`compute()` in `engine.js`.

| rung | held 3 | held 7 | held 10 |
|---|---|---|---|
| addresses carrying | 0 | 24 | 47 |
| fetters | 9 | 9 | 9 |
| saboteurs | 0 | 23 | 22 |
| complexes | 0 | 10 | 10 |
| hyper | 0 | 3 | 3 |
| character | 0 | 1 | 0 |
| orientation | malignant 28 | malignant 55 | malignant 70 |

**The defect this would have caused.** Nine fetters produce twenty three saboteurs. A
mark drawn as a clean pyramid narrowing at every step is drawing a lie about the third
rung, and this product does not ship decoration that looks like data. All three
directions take their taper from the library cardinality, which is fixed, rather than
from a live count, so the mark is a constant and the bulge is not misreported as a
narrowing. **Found by Mika. Moves nothing on its own, and it is the reason direction 2
is honest rather than pretty.**

### 1.2 Where The Seven Seat Colours Attach, Counted

| rung | Root | Sacral | Solar | Heart | Throat | 3rd Eye | Crown |
|---|---|---|---|---|---|---|---|
| 112 addresses | 16 | 16 | 16 | 15 | 12 | 12 | 21 |
| 9 fetters | 1 | 2 | 2 | 2 | 1 | 1 | **0** |
| 6 architectures | 1 | 1 | 1 | **0** | 1 | 1 | 1 |
| 6 overshoot poles | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| complexes, character | inherited through `hcx` | | | | | | |
| orientation | none, a scalar | | | | | | |

**No single rung carries all seven.** The fetters have no Crown. The architectures have
no Heart. The two gaps are at opposite ends of the ladder, and the two rungs together
cover all seven. Only the 112 addresses carry all seven on their own.

This is the most load bearing fact in the document, because it decides the small cut of
every direction: a mark that must show seven seats cannot take them from one rung.
**Found by Petra, counting the data rather than reading the comments.**

## 2. Where His Description And The Engine Disagree

### 2.1 The Fetters Are Not The Most Detailed Layer

There are 112 addresses under the nine fetters at `nodes.js:5`, each carrying a seat, a
named plexus or nerve, an axis, a distortion and a charge label. Nine is not more
detailed than 112, and the rung strip at `ui.js:352` does not show the address layer at
all, so the stack as a person currently sees it starts one rung above its own floor.

**What is true, and I think it is what he means.** The fetters are the only rung a
person writes to. Nine held values and nine opposites, eighteen continuous inputs at 0
to 10 in half steps, at `shell/body.html:292`. Everything above is derived. Everything
below is derived too: `n.sq`, `n.held`, `n.rep` and `n.pole` are all computed at
`compute.js:51` to `57`. So the gradient he is describing is a gradient of **degrees of
freedom**: eighteen at the fetters, zero everywhere else, one bit at the top.

That is a sharper statement than his and it is the one the mark should draw.
**Found by Mika.**

### 2.2 The Binary At The Top Is CQ Restated

`compute.js:180`:

    const benign=CQ>=50,malig=benign?0:Math.round((50-CQ)/50*100);

Orientation is a threshold on coherence. It carries no information that CQ does not
already carry, and the comment sitting above that line in the file says so and records
that it was caught pretending to be a second axis. The two real independent axes the
engine now computes are **Shape**, `outwardShare`, whether the conditioning points at
other people or at the person carrying it, and **Control**, `organisedShare`, whether it
is organised or chaotic. They cross into four governance quadrants at `compute.js:204`.

**The move.** All three directions draw the one bit he named, because that is what he
named and it is what the rail prints. Each one has a marked place where a second bit
goes instead if he rules it: the boundary ring in direction 1 can break in two places
rather than one, the top register in direction 2 is already two cells and can become
four, and the junction disc in direction 3 can become two half discs. **This needs his
ruling before anything is built, because a mark whose top rung says nothing new is the
weakest rung in it. Found by Mika.**

### 2.3 Malignant Is Not An Alarm

`#FF2E1F` is reserved for something being wrong. Malignant is a reading of a field, not
a fault in the instrument, and this product has shipped that confusion twice. In all
three directions the orientation rung is `currentColor` and its two states are a
presence against an absence: a closed ring against a broken one, a lit cell against a
dim one, a filled disc against a hollow one. No red, at any size, on any ground.
**Held by Sol.**

## 3. The Soul Shape. It Exists And It Is In The Repository.

He says he may never have shown it to me. He has.

`index.html`, the codex, Appendix E, section *05 Verity Symbol*, captioned *the collapse
sequence as one mark, outside in*. The tile labelled **Layer 6, Soul** at
`index.html:8936` is one path and one dot:

    M17 36.5 C20 26, 25.5 23.5, 30 29.5 C34.5 35, 40 31.5, 42 22.5
    circle cx 29.8 cy 29.8 r 3

A 58 unit box, a 25 by 14 extent, a two lobe curve crossing its own centre, and a filled
dot on the crossing. The same squiggle sits at the middle of the full Verity Symbol at
`index.html:8932` as a small closed lens. The prose names it twice, at
`index.html:7229` and `index.html:2929`.

**The correction to the record.** `CHECKLIST.md:105` reads *D13. The soul shape. Not in
the repository, cannot be drawn from.* That line is wrong and should be struck. The mark
has been in the repository since the codex was written. Directions 1 and 3 are drawn
from it rather than from an invention of mine. **Found by Petra.** I have not edited
`CHECKLIST.md`, because the brief said to touch no other file.

**The one thing I am not going to guess at.** He calls it a squiggly cue. If that is a
squiggly *Q*, a circle with a tail through it, then what he has in mind is closer to the
polarity drawing described at `index.html:2929`, a circle of awareness with a squiggly
line cutting through it and two pins at the poles, and that drawing exists in the codex
only as a raster, not as a path. The HTML shows the closest I can get to it without
inventing his own artwork. If the Q reading is the right one, all three directions
change and this is the first question to answer.

## 4. Divine Geometry, Meant Properly

Six constructions were candidates. Three are in, three are out, and the reason is a
count in the engine every time.

| construction | verdict | why |
|---|---|---|
| seed of life | **in, direction 1** | seven circles is seven seats. twelve vesica lenses is twelve hyper families. constants `sqrt 3` and 2, stated as such rather than dressed as phi. |
| Fibonacci ladder | **in, direction 2** | six widths from 144 on a phi ladder land on six consecutive Fibonacci terms to within three hundredths of a unit. |
| golden spiral | **in, direction 3** | whirling squares in a golden rectangle. the only construction that is a sequence and a terminus at once, which is what the collapse is. |
| Metatron's cube | out | thirteen circles and seventy eight lines. thirteen matches nothing in the engine, and forcing a thirteen circle figure to say twelve is the gesture the brief warns against. |
| Platonic solids | out | there are five and the rung strip has five tabs. that is a coincidence. nothing makes a saboteur an octahedron rather than a cube, and a mapping with no rule behind it is decoration wearing a mathematician's name. |
| flower of life | out, and it is the near miss | nineteen circles, and the engine has nineteen blueprint domains with `DARC = 360 / 19` already computed against them at `core.js:188`. a real bijection, and it belongs to the Field surface rather than to the mark: nineteen circles will not survive 18px and the blueprint is not part of the stack he described. this is the one I would build next if he wants a second mark. |

**Constructions chosen by Petra, argued against the counts by Mika.**

## 5. The Three Directions

Not variations. One figure built on circles, one on rectangles, one on a curve. Full
path data is inline in the HTML. The geometry is summarised here.

### 5.1 Direction 1. The Seed

Seven circles of radius 34 on a 178 box centred at 89 89, six outer centres at distance
34, so the seed reaches exactly 68 and nothing was chosen. Six inner lenses are the six
held architectures in their seat colours, each pointing radially at its seat. Six outer
lenses are the six overshoot poles, in `currentColor`, because `FAM_POLE` at
`core.js:15` gives each pole a name and no band, so the engine itself gives them no
seat. Nine radial ticks on the ring at `34 * sqrt 3 = 58.890`, which is where the six
outer lens tips land. A boundary ring at 68 is the orientation. The soul squiggle sits at
the centre.

Two cuts, switch at 96px. Under it the mark is the seed outline and nothing else: six
scallops, each the 120 degree arc of one outer circle between the two points where its
neighbours cut it, at weight 10, plus the Heart as a disc of radius 13.5 and the squiggle
over it.

**A defect I caused and then measured out.** The first version filled the six inner
lenses at 28 percent. Those lenses overlap pairwise by 60 degrees, so six translucent
fills reach roughly 85 percent coverage at the centre and every hue is lost to a brown
wash. They are stroked now and never filled. **Found by Sol on the first 320px render.**

**A second defect, same shape.** The display cut was switching in at 40px, which put
twenty five overlapping strokes in a 64px box and read as a coloured scribble. The switch
is at 96px. **Found by Bjorn at the magnifier.**

**What it forfeits.** Saboteurs and complexes, which have no construction feature to sit
on. Orientation at 18px, because the boundary ring is 9px across with a quarter pixel
stroke and goes. Seven nameable seats at 18px: you get six coloured scallops and a heart,
and you read a rosette rather than six countable seats. And it is the most ordinary
figure of the three, since half the wellness market already owns a flower of life.

### 5.2 Direction 2. The Cairn

Six registers stacked, widths `144, 89, 55, 34, 21, 13`. A phi ladder from 144 gives
`144, 88.997, 55.003, 33.994, 21.009, 12.984`, which is six consecutive Fibonacci terms
with no rounding argument to make. Heights are 13 and gaps are 8, both Fibonacci, so the
vertical rhythm is the same series as the horizontal taper. Register 1 is nine cells of
exactly 16 units in the nine fetter seat colours in root to crown order. Register 2 is
six cells of 14.833, the six architectures in seat order. Registers 3 to 5 are ink at 40
percent, because complexes and character carry no seat field of their own. Register 6 is
two cells of 6.5, one lit and one at 16 percent.

**This is the only direction that carries all seven seat colours with no invention at
all.** Register 1 has no Crown and register 2 has no Heart, and between them the two
registers are the engine's own seat assignment, printed. The Heart gap in register 2 is
visible as an absence in the ramp, and that absence is the reading.

**A defect found on the render.** Adjacent rects leave a subpixel seam at every raster
size, so the nine cell base read as nine bars with hairlines between them rather than as
one chromatic band. Cells now overlap by 0.3 of a unit on all but the last, which is
invisible at 320px and closes the seam at 18. **Found by Bjorn.**

**A second defect.** Registers 3 to 5 were ink at 70 percent and the eye landed on the
grey bars before the colour, which inverts the mark's own reading. 40 percent.
**Found by Sol on the squint pass.**

**What it forfeits.** The soul shape, entirely. There is no place in a stack of bars for
the squiggle that is not a lie about where the soul sits. It reads as a signal strength
meter upside down, which is the sharpest thing wrong with it and is not fixable by
drawing. It has no circle, so it sits slightly outside a product whose every other
surface is round. And at 18px the upper registers are 1.3px tall with 0.8px gaps, so the
small cut is three registers and Crown never appears in it.

### 5.3 Direction 3. The Collapse

A golden spiral from whirling squares. Seven quarter arcs, source radii `55 34 21 13 8 5
3`, scaled by `144 / 89 = 1.617978` into a 160 by 100 box with an inset of 8 and 5.5, so
the spiral's own bounding box is exactly 144 by 89, two Fibonacci terms and a golden
rectangle. Each arc centre is placed at `C = Q + (r_next / r) * (C_prev - Q)` at the
junction Q, so consecutive arcs share a tangent by construction and nothing is eyeballed.
The seven arcs take the seven seat colours root to crown. The junction between the fifth
and sixth arcs carries the orientation disc. The innermost arc hands off to the soul
squiggle at the eye, at 113.169 73.455.

Two cuts, switch at 40px. Under it the same path runs as one 9.5 unit stroke with a seven
stop gradient in `userSpaceOnUse`, plus the squiggle.

**A defect found on the render and fixed by dropping an idea I liked.** The arcs were on
a falling weight ladder, 9.5 down to 3, which put a visible round cap knob at every
junction because each arc is its own path and the wider one overshoots the narrower. All
seven are 9 units now with butt caps, which meet flush because the junctions are tangent
continuous. The taper is already in the radii and the weight ladder was saying it twice.
**Found by Bjorn. Conceded by Mika.**

**What it forfeits.** It is not square, because a golden spiral lives in a golden
rectangle. At 18px tall it is 29px wide, which is fine beside a wordmark and unusable as
an app icon, an avatar or a favicon without a second lockup. The small cut keeps all
seven pigments and loses all seven names, because seven discrete arcs at 18px would put
the Crown arc at 0.87px of arc length. It has no symmetry on either axis and will never
read as a seal or a credential stamp. And the pairing of seat ladder to rung ladder is my
assertion, not an engine fact: both have seven terms and that is all.

## 6. The Seven Lightings, Measured

Seat colour against the ground it is actually drawn on. WCAG relative luminance, graphic
floor 3.0 to 1. The palette is whichever of the three `seatCol` resolves at
`atuned_src/ui/component.js:28`.

| ground | palette | Root | Sacral | Solar | Heart | Throat | 3rd Eye | Crown | min |
|---|---|---|---|---|---|---|---|---|---|
| Dark | muted | 4.24 | 6.37 | 9.00 | 8.17 | 7.50 | 5.88 | 5.83 | 4.24 |
| Snow | light | 5.61 | 4.97 | 4.82 | 4.85 | 5.24 | 5.70 | 5.88 | 4.82 |
| Punch | muted | 4.30 | 6.46 | 9.12 | 8.27 | 7.60 | 5.96 | 5.90 | 4.30 |
| Glass | muted | 4.37 | 6.57 | 9.27 | 8.42 | 7.73 | 6.06 | 6.01 | 4.37 |
| Glass white | light | 5.86 | 5.19 | 5.03 | 5.07 | 5.47 | 5.95 | 6.14 | 5.03 |
| Flat | muted | 4.64 | 6.98 | 9.85 | 8.94 | 8.21 | 6.43 | 6.38 | 4.64 |
| Lumen bar | vivid | 4.68 | 7.28 | 6.83 | 6.12 | 5.30 | 3.71 | 3.49 | 3.49 |
| **Lumen paper** | **vivid** | 4.07 | **2.61** | **2.79** | 3.11 | 3.59 | 5.13 | 5.46 | **2.61** |
| Lumen paper | light | 6.02 | 5.33 | 5.17 | 5.20 | 5.62 | 6.11 | 6.30 | 5.17 |
| boot black | muted | 5.29 | 7.95 | 11.23 | 10.19 | 9.36 | 7.33 | 7.27 | 5.29 |

**The defect, and it is in the product rather than in the mark.** `seatCol` returns
`PAL_VIVID` for the whole of Lumen, and Lumen has two grounds. On its white paper the
vivid palette fails the graphic floor on two seats, Sacral `#FF7A00` at **2.61** and Solar
`#C79200` at **2.79**, with Heart at 3.11 and Throat at 3.59 barely over. Any graphic
placed between Lumen's panels inherits that.

**The move.** One extra branch in `seatCol` at `atuned_src/ui/component.js:28`, resolving
per ground rather than per theme: `PAL_VIVID` on Lumen's `#101010` chrome, `PAL_LIGHT` on
Lumen's paper, where all seven clear 5.17. Worth making whether or not any of these marks
ships. **Found by Sol. The resolver was validated first on two known cases, white on black
returning 21.00 and `#C2A063` on black returning 8.50, both exact, because two probes in
the previous pass lied on exactly this measurement.**

The second weakest pair is Lumen's black bar at full chroma, Crown at 3.49 and 3rd Eye at
3.71. Both clear 3.0 and neither has margin, so the Crown arc in direction 3 and the Crown
cell in direction 2 are the first two things to re-measure if that bar ground ever moves.

## 7. Ink At 18px, Measured

Each 18px cut rasterised at device pixel ratio 1 onto its own panel colour, then
differenced against that colour pixel by pixel. Marked is every pixel the mark touches at
all. Solid is every pixel over 110 of summed channel difference, which is what survives a
squint.

| direction | box | ground | marked | solid |
|---|---|---|---|---|
| 1. The Seed | 18 x 18, 324px | Dark | 123, 38 percent | 101, 31 percent |
| | | Snow | 126, 39 percent | 106, 33 percent |
| | | Lumen bar | 123, 38 percent | 100, 31 percent |
| | | Lumen paper | 126, 39 percent | 106, 33 percent |
| 2. The Cairn | 27 x 18, 486px | Dark | 130, 27 percent | 98, 20 percent |
| | | Snow | 130, 27 percent | 102, 21 percent |
| | | Lumen bar | 130, 27 percent | 96, 20 percent |
| | | Lumen paper | 130, 27 percent | 102, 21 percent |
| 3. The Collapse | 29 x 18, 522px | Dark | 170, 33 percent | 135, 26 percent |
| | | Snow | 171, 33 percent | 139, 27 percent |
| | | Lumen bar | 166, 32 percent | 131, 25 percent |
| | | Lumen paper | 171, 33 percent | 139, 27 percent |

**No direction has a ground specific failure at 18px.** Across four grounds the marked
count moves by at most 5 pixels out of 324, 0 out of 486 and 5 out of 522. Whatever each
mark loses at small size it loses the same amount everywhere, which is what a mark built
from `currentColor` and seven tokens should do. **Measured by Bjorn, who wanted the number
before he would agree the 18px cuts were finished.**

## 8. The Grade

Judged on the mark alone, not the boot.

| | today | direction 1 | direction 2 | direction 3 |
|---|---|---|---|---|
| says what the product is | D. seven dots on a line, generic | B | A | A |
| carries the seven seats | F. the heart is painted over and invisible | B, six at small size | A, across two registers | A |
| carries the stack | F. absent | C, five of seven rungs | A, all six drawn rungs | A |
| carries the soul mark | F. absent | A | F | A |
| reads at 18px | C | B | B | A |
| holds on all seven lightings | B | A | A | A |
| is not a chakra diagram | F | C | A | B |
| **overall** | **D** | **B minus** | **B plus** | **A minus** |

The row that decides it is the last one. Direction 1 is a flower of life and everyone has
seen a flower of life. Direction 2 is a bar stack and everyone has seen a signal meter.
Direction 3 is a spiral and everyone has seen a spiral, but nobody has seen one whose
radii are the rungs of a stack and whose eye is a squiggle, and it is the only one of the
three where a person can be told what every part of it means and every answer is true.

## 9. My Recommendation

**Direction 3 in the bar, direction 1 as the seal.**

Direction 3 is the only one that carries all seven rungs, all seven seat colours and his
own soul mark in one figure, and the only one whose construction is also the product's
stated mechanism: the collapse sequence, outside in, ending on a point. Its one real cost
is that it is 160 by 100 and will never be an app icon, and the fix for that is a
companion mark rather than a compromise in this one. Direction 1 is square, built from the
same seven seats and the same squiggle, and at 64px and above the two read as one family.
Ship 3 in the bar and 1 on the icon and they are not two marks, they are a mark and its
seal.

**Direction 2 is the one I would not ship and would not throw away.** The Fibonacci ladder
on 144 89 55 34 21 13 is the truest drawing of the stack in this document, and it belongs
on the Summary surface as the reading itself, live, with the real counts in it. As a mark
it collides with a signal meter and it drops the soul. As a data figure it is the best
thing here.

**Bjorn dissents and prefers 2**, on the grounds that a mark whose proportions are the
data is worth more than a mark that needs a second lockup. His argument is recorded rather
than resolved. The icon problem is his to lose and the ladder problem is mine.

## 10. What Needs A Ruling

1. **Squiggle or squiggly Q.** If the mark he means is the circle with the line cutting
   through it and the two pins, none of the three is drawn from the right shape and all
   three change. Everything else waits on this.
2. **The top rung.** One bit that restates CQ, or two bits that do not. Shape and Control
   are computed and independent and the rail draws neither.
3. **Direction, and whether there is a second lockup.** 3 in the bar with 1 as the seal is
   two files to maintain instead of one.
4. **Whether the mark may be chromatic at 18px at all.** Every direction here puts seat
   colour in the top bar. The bar today is one accent. Seven colours in the chrome is a
   change to the whole product's colour discipline, not a change to a mark.
5. **Strike `CHECKLIST.md:105`.** D13 says the soul shape is not in the repository. It is,
   at `index.html:8936`.

## 11. Files

    reviews/mark-stack.html     the deliverable. standalone, no network, no dependencies,
                                Inter embedded as the build carries it. every direction at
                                18, 32, 64, 128 and 320 on eight grounds, with the stack
                                assembling layer by layer.
    reviews/AD-mark-stack.md    this file.

No product code was changed. `source.html`, `engine.js` and everything under
`atuned_src/` are untouched, and so is `CHECKLIST.md`, whose line 105 I am asking him to
strike rather than striking myself.
