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
