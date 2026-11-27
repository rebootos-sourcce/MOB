# The Masks page. A measured spec, round MS.

His six findings, round MS in `TASKS.md`, each measured against the real
build before anything was proposed, the same discipline the Field-to-Masks
pass round MQ used. Built into a scratch file, nothing in the repository
touched by the measuring. Roster: all 14 people in `PEOPLE`, both
readings, through the real `chRead`/`chSvg`/`chGeo`.

## The current page, graded

Grade C. Intent C, truth C minus, craft B minus.

**Intent.** On light profiles the loudest things on the page are the
marks, drawn in ink at .52 to .95 opacity, constant design and not data.

**Truth, seven measured defects.**
- **Preteen and Professional are the same data.** Both sit on Solar and
  Throat by canon (`engine/data/canon.js:499,508`, verified directly:
  `b:['Solar','Throat']` on both). Their lit address sets match exactly
  (Jaccard 1.0) on every profile that runs a saboteur.
- **Heart and Crown sit under no mask**, verified directly against the
  same file: the six masks' seats union to Root, Sacral, Solar, Throat,
  3rd Eye only. That is 36 of the address table's addresses, a third of
  it. James's own primary charge, Blame at the Heart, appears on no face.
- **Where weight lands is decided by the layout, not the person.** The
  Hilbert walk starts at the brow and the heaviest group goes first; in
  every reading with 20 or more lit pixels the heaviest address sits in
  the top third of the face.
- **The tier ramp flattens on heavy profiles.** Gordon-dark: Child and
  Teen are entirely in the hyper complex tier. Lance-light: every mask is.
- **Charge does not change brightness within a tier.**
- **The hottest tier reads pale, not hot**: mixed 36% toward `--ink`.
- **Pixel area is not comparable across masks**: the same charge covers
  2.5 times the area on Teen that it does on Child.

**Craft, four measured defects.** The outline is a 1:1 blob, flat-sided
for a quarter of its height (reads as a coin or a pot). Marks alias
differently at each of the three grids. Sibling cards render at different
grids, so neighbouring faces carry differently sized pixels for no
readable reason. All six breathe in lockstep, confirmed both by direct
measurement (all six glows read the same opacity at one instant) and by
the CSS itself: `.chv-grid .chv-glow,.chv-grid .chv-rim-on{animation:
chvBreath var(--t-breath) var(--ease-breath) infinite}`, one shared
period and easing for all six, no per-mask variation possible as written.

**Performance headroom.** One `renderCharacter` costs 2.3 to 15.2ms,
markup 75 to 327KB, at most 90 svg elements. Room for what follows.

## Finding 1. The base shape, filtered through a golden ratio

`MASK_FACE` (`canon.js:481`) is a hand-typed path, not a constructed
proportion. Its one golden thing is an accident: the widest line sits at
0.375 from the top, near 1/phi^2 (0.382).

Three candidates screenshotted on James and Diane, `golden-ladder.png`:
- **A, current, 1:1.**
- **B, phi/2 = 0.809, the pentagon's own ratio.**
- **C, 1/phi = 0.618, the golden rectangle.** Reads as a capsule, loses
  38% of the cells at the 32 grid. Not recommended.
- **D, the ladder.** One construction stepped by phi across the six ages,
  `k = phi^(-i/5)` running 1.000 down to 0.618, chin exponent
  `c = 1 + 2i/5`. Child broad and blunt, Ideological narrow and pointed.
  Reads as one face growing up; also serves finding 2.

Craft notes that travel with whichever is picked: draw the chin as an arc
and not a straight line (a straight chin on the narrow end reads as a
bucket); snap marks to a cell-proportional stroke width instead of a
fixed-unit `isPointInStroke`, which is today's 2/1/2-row aliasing; give
all six cards one shared grid, the largest any mask needs, so siblings
carry the same pixel size.

Cost: B loses about 16% of the face's cells; raise `CH_RES` to
`[18,26,36]` (must stay even, the right half mirrors at G/2). The same
outline draws the icon family (`knowledge.js:147`), so changing canon
changes the icons too, an engine data change: run `tools/equiv.py` and
acknowledge the named diff.

**Correction to round MS's own log**: it said redrawing the shape "would
move the pixel geometry the click depends on." Checked and found false:
the hover and click solve a cell from the pointer and look it up in a
per-render `byCell`, so neither depends on the outline. The click can
ship before the outline question is settled.

## Finding 2. Each mask its own element

Ranked causes: all six move on one shared clock (round MQ's own choice,
which his new finding reverses); one composition rule puts the same
weight at the same brow band on every face; one shared silhouette,
canon's own "the six wear one face"; and the shared-seat data problem
above.

Moves: motion per mask (finding 3, cheapest and largest fix); silhouette
per mask (ladder D); position as data, a seeded region grow from each
seat's own anchor in place of one Hilbert order, so the higher seat's
charge sits higher on the face (Child: Sacral upper, Root lower; Teen:
Throat; Ideological: 3rd Eye at the brow); no invented mask colours,
since a colour has to mean something and seats already carry colour.

## Finding 3. Each mask's own animation nature

Every mask keeps the Field's tempo, `--t-breath` 4.2s, as its reference
and takes a period in a phi relation to it, physically true (breath slows
with age) and mathematically useful (phi periods never fall back into
step, so the lockstep defect cannot return by accident). Amplitude is
data: the Field's own weight mapping, floored at 0.15 so every read mask
still moves a little.

| Mask | Period | Motion |
|---|---|---|
| Child | 2.60s | Contracts toward centre, a flinch |
| Preteen | 3.30s | A scanning ink band, holds at each eye |
| Teen | 4.2s + a second hit | The split halves push apart |
| Adult | 4.2s exactly | Holds steady; a tension pulse along the seam |
| Professional | jaw still, face on 4.2s and 6.8s | The jaw freezes, the fill flickers on two periods |
| Ideological | 6.80s | Does not breathe; only the ring glows |

Requires splitting `chSvg`'s merged paths into per-purpose groups
(`chv-bg`, `chv-lit`, `chv-mark`, `chv-rim`) plus a per-mask class.
Honours `body.rm`, `body.quiet` and reduced motion throughout.

## Finding 4. Which charges are heaviest

Two channels, one meaning each: brightness becomes absolute charge
(`0.18 + 0.82*(v/10)^0.8`, comparable across every mask, quantised so
paths still merge), and tier becomes how fused the cells are (a dot, a
tile, a fused plate, a plate with an ink bevel) rather than a brightness
step, dropping the mix toward ink so the hottest tier stays saturated.
Only the heaviest block on each face carries a weight ripple; every other
block ripples on hover or selection, so the quiet faces make the loud one
legible.

## Finding 5. What transfers from the Field

The grammar, not the geometry: `frFlow`'s tension pulse for the Adult
seam and the weave traces; `frChains`'s one weight mapping, `kk =
(w-3.5)/3`, driving amplitude, ripple speed and trace weight everywhere
here, one word for one concept; the ring-bends-under-load dent (`GQ`,
which he already liked) as the most distinctive transfer; the entrance
stagger on first open, Child to Ideological. Not transferred: the canvas
aura, the Field's bowed curves (this page is a grid), zoom-reveal names.

## Finding 6. Pixel click, and the cross-mask weave

**Click**, buildable now: factor the hover's cell solver out into
`chCellAt(e,svg)`; a click on a lit pixel opens that pixel's own
saboteur's drill where it has one, else the address's own drill; the
tooltip's own footer names what the click opens rather than saying only
"click the mask."

**The weave**, the larger piece: selecting a saboteur, complex or hyper
complex dims every mask it does not touch, draws an orthogonal trace
between the masks it does, in developmental order (Child to Ideological),
weighted by that mask's own share of the chain's charge, an off-mask
terminal ring for Heart and Crown. Measured first rather than assumed:
61% of saboteurs already span two or more masks by shared seats alone;
22 of 36 hyper complexes and all 12 top-of-chain clusters touch four
masks or more, 9 of those touch all six, so at that level the
discriminating information is where on each face and how much, which is
why trace weight carries the share.

## Build order

1. **No ruling needed**: motion per mask, the brightness/tier fix, mark
   snapping and one shared grid, the pixel click. Moves the grade from C
   to B minus on their own.
2. **After his pick on the outline** (A, B or D, `golden-ladder.png`).
3. **After the body-map ruling**: composition by seat anchor.
4. **The weave**, then the rim-bends-under-load transfer.

## Open, and his to rule

1. **Which outline. A, B or D.** The same outline also redraws every
   mask's icon on the Knowledge page.
2. **Canon says "the six wear one face" so the family reads at a
   glance; this round asks for each to be its own element.** Does ladder
   D, one construction in six steps, satisfy both, or does the new
   finding replace the canon line?
3. **Preteen and Professional are the same data** (same two seats).
   Give them different seats, rule a weighting between the two, or keep
   the same data and say so on the card?
4. **Heart and Crown sit under no mask**, a third of every address and
   17% of the roster's saboteurs. Bring them onto the page, for example
   as the ground the six sit on, or leave them off and say so?
5. **Should the face become a small body map**, the higher seat higher
   on the face? New meaning, needs a yes.
6. **His own profile opens on six empty masks in Dark**, since every one
   of his 39 saboteurs is overshot and lives in Light. Keep Dark default,
   true but blank for him, or open on whichever reading has built
   further?

## Addendum, round MT. The shape redone, the frames, and five masks

His rejection of A/B/C/D sent this back to the art director for a second
pass, differently briefed: proven-pleasing forms (his own examples, oval
and egg), carrying the pattern's own symbolism rather than a proportion
study, plus a framing system so the six (now five) still read as one
family while each stands apart. Evidence under
`/tmp/.../scratchpad/mt/` this session; the two load-bearing screenshots,
`1-shapes-sheet.png` and `2-page-James-dark-1600.png`, were sent to him
directly rather than described.

**Why A through D failed, read cold.** Helmets and pots, not faces: a
round crown, a flat shoulder, a straight taper. The marks read as
hardware, ink bars rather than things that happened to a shape. The
Hilbert-walk fill carried no meaning a person could read as "body." His
word "symbolism" was about the last two, not the ratio; no proportion
tweak could have fixed it.

**The shape: an egg, broad at the brow.** Three candidates rendered on
real profiles including Lance's own blank Dark reading (E1 oval, E2 egg
broad at the brow, E3 egg broad at the base); E3 read as an Easter egg
and a vase, E1 is the fallback, E2 is the recommendation. The six canon
marks are redrawn as events in the life of one shell, apertures cut from
the face rather than ink bars drawn on it, each with a one-cell moat so a
mark never gets swallowed by same-colour fill on a heavy profile, the
exact LT-era defect this session already fixed once.

**Never blank, folded in here as asked and re-measured properly.**
Today's rim at 0.3 opacity was measured at 1.43 to 1.99:1 against its own
card in Dark, under the 3:1 floor for a graphic, the real reason Lance's
Dark reading reads empty. Move: every unlit home draws as a faint tile in
its own band's own seat colour, and the rim and marks solve for 3:1 per
seat rather than one flat value, so a quiet profile shows its whole body
map waiting to fill and no seat's outline reads louder than another's by
accident.

**Frames.** One shared card treatment, a border drawn as a gradient from
the mask's highest seat to its lowest, so the border is data and no
colour is invented; it steps to full and joins the breath once the chain
reaches the character. What varies per mask is its light, not its
colour, argued from each mask's own motion at rest (a close low source
for the Child, a band at eye height for the Preteen that checks the
room, backlit for the Ideological so its halo is lit and the face sits
in shadow).

**Seven seats, recommendation M1: five masks, not six.** Measured against
all 14 profiles both readings: Preteen moves from Solar/Throat to
Solar/Heart, Ideological gains Crown alongside 3rd Eye, Professional is
removed. Seat coverage goes from 5 of 7 to 7 of 7, saboteurs under no
mask from 46 of 270 to zero, and every pair of masks that used to light
identically on some profile (5 pairs) now the highest overlap measured
is 0.82. The remaining four masks climb the body without a gap: Root
Sacral, then Solar Heart, then Throat, then 3rd Eye Crown, with the
Adult's own seam landing exactly on the data join between the Child's
seats and the Preteen's, which is its own canon mark, "the join shows."

**Open, his to rule, five questions:**
1. The shape: E2 the egg broad at the brow (recommended) or E1 the oval.
2. Professional's removal, confirmed. If he wants real career data
   instead, that is a new field on all 112 addresses, an engine schema
   change and not a page change, named here rather than assumed.
3. M1 moves the Preteen from Throat to Heart, canon, his call.
4. The halo: kept, knowing some will read it as religious, or replaced
   with a flat bar held over the head.
5. The Teen holds one seat, 12 addresses, the least data and the
   largest pixels on the page. Accept it, or give it Heart too and break
   the clean climb.

Findings 3 through 6 from the first pass still stand; checked against
this one and none conflict, including the click and the hover, verified
live rather than assumed (a hover on James's Adult correctly named the
address Pride under the new shape).

## Addendum, round MV. The layout: a centre mask and four beside it

Sent separately to the UI/UX team once he ruled E2 and flagged the
layout itself as unfinished, "fill the center space well/symmetrically,
and I can see them in detail... animation, motion, and interest."

**Recommendation: a triptych**, one mask large in the centre with the
other four in developmental order beside it (two per side on desktop, a
row of four underneath on phone), against a plain three-over-two grid of
five equal masks. Measured on James's Dark reading at 1600x1000: the
triptych's centre mask draws its pixels at 20px against 9px for either
alternative, covers 62% of the stage against 35%, and is the only
arrangement where a tier's own gap between pixels (findings 4's own
ramp) actually shows as more than one screen pixel. The equal-five grid
loses on every number checked; its only advantage is that no mask is
singled out, which the triptych answers a different way, by making the
centre mask whichever one a press brings there.

**Which mask opens in the centre is not chosen by charge.** Measured
across all 14 profiles, both readings: the heaviest mask leads the next
by less than 0.3 on a 0 to 10 scale in most readings that carry any
charge, two reasonable ways of measuring "heaviest" pick different
masks, and the winner changes on the Dark/Light toggle for every profile
checked with both readings filled in. Choosing by charge would reshuffle
the page on every toggle and present a near-tie as a verdict, against
the product's own rule that a reading is not a score. Recommendation:
Child on first open, then whichever mask was last pressed, remembered in
this browser the same way the right column's own fold state already is.

**The right column does not need to close for this.** Checked directly
rather than assumed: closing it changes the centre mask's size by zero
percent at four of six desktop sizes tested and ten percent at the
narrowest, and the column is where a press already answers, so closing
it by default would cost something for almost no room gained.

**Alive on open, not only on press.** The centre mask lights first, the
four side masks rise after it in developmental order 90ms apart, the
whole entrance lands under one second, runs once per visit rather than
on every `render()`, and drops out entirely under reduced motion.

**Real conflicts with the standing spec, flagged rather than resolved:**
finding 6's weave draws lines in developmental order, which crosses the
centre mask in a triptych rather than running in a line; finding 1's
"one shared grid" needs to hold across the unread and read states too,
since an unread profile renders coarser today and would visibly change
resolution at centre-mask size the moment a first story lands; the
hover's own cell math needs the viewBox offset added once faces are
cropped into their cards; a single pixel is under the touch floor at
every size tested, so a touch press has to target the saboteur's block
rather than the cell.

**Open, his to rule, five questions:** one centre mask with four beside
it, or all five equal and larger; which mask opens the page; whether
pressing a side mask swaps it into the centre or something else shows
the detail without moving anything; how the weave's lines route around a
centre mask; and, on a phone, a centre mask over four small ones on one
screen, or all five stacked at full size across roughly three screens of
scrolling.

## Addendum, round MX/MY. The rail and one large mask, measured

His own direction, built and measured rather than re-argued for the
triptych he didn't pick: all five masks as small icons in a rail down
the left side, the rest of the stage one large hero for whichever is
selected. On every number checked it beats the triptych, sharply on
tall screens (1600x1600: 39.9px a cell against 21.3px) and by 15 to
24% on wide ones, since the triptych's height was never capped by its
side masks' width.

**Six structural findings, each measured rather than guessed:**
1. **Rail icon size has a floor, not a fixed number.** 40px is where all
   five marks stay legible (verified visually, `ladder.png`); 48 to 56px
   is recommended when the stage has room. Solved from stage height
   (`clamp(40, (stage height - 154) / 7.5, 56)`), not set once.
2. **The hero's own build blocker, found rather than assumed clear:**
   `.chv-svg{max-width:260px}` in `head.html:4821` caps the hero at
   10.8px a cell today regardless of layout; confirmed directly, this
   rule has to be overridden for the rail to reach its measured sizes.
3. **The rail becomes a row at 720px, the shell's own existing
   breakpoint**, not a new number; the column wins above it, the row
   wins by 35 to 42% below it.
4. **The switch re-lights in place rather than travels.** Unlike the
   triptych, nothing changes position here, so a flying copy would say
   the mask moved when it didn't; the charge drains toward the spine
   and the new mask's charge lights back outward on the same walk order
   its pixels were handed out on, about 420ms.
5. **The weave found and designs around a real bug**: 47 of 270 running
   saboteurs currently own no pixel on any mask because a heavier
   saboteur drawn first claims the same addresses, 14 of those also
   carrying the duplicate-naming bug the TDD audit already found in
   `compute.js`. Fix: select by address, not by which group happened to
   draw the pixel; after that fix nothing is empty. The trace itself
   runs down the rail's own gutter with a spur to each member mask,
   rather than through the icons, which was found to visually cross
   through non-members.
6. **Never-blank holds at hero size**, and the per-seat contrast solve
   from the shape addendum is confirmed required rather than optional,
   since at this size the outline is the whole picture on an empty
   reading.

**Open, his to rule, six questions:** rail order (Child at top, reading
order, or Child at the bottom climbing the body map); phone rail above
the hero (reads as tabs) or below it (in thumb reach); the blank
profile's coarser grid, kept as the existing reward for filling in or
drawn at full resolution always; whether a rail press alone updates the
hero or also the right column; the halo at hero size, a bar or a
bracket rather than a ring; and real device frame rate for the re-light
and per-mask motion, which this environment cannot measure.

Grade: structure moves from C to A minus; craft stays B minus until the
per-seat rim contrast and the re-light are actually built; truth is
unchanged, the data defects found along the way are not this pass's to
fix.
