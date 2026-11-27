# SI7. Does the charge of the nerve take r1's grammar? Five rounds, 30 October

His question, the same breath as picking r1 for the left rail: "I think that
this logic works for the charge of the nerve as well. What are your thoughts?
Review this 5 times. Let's look for the cleanest solution."

Reviewed by the art director (Mika), the UI/UX architect (Dani), the technical
director (Anders) and the animation director (Kai), the creative director
(Ines) deciding. Same seats as the four dual-readings mockups.

The mockup that proves the verdict is `mockups/nerve-charge/index.html`, with
its shots in `mockups/nerve-charge/shots/`. It is standalone and is not wired
into `source.html`.

## The verdict, first

**A third answer. Neither r1 everywhere nor the sketch bar as it stands.** The
address deck and its drill keep the sketch bar's shape, because an address
carries two amounts and the sketch bar already draws two amounts. But it is
corrected into r1's own amount rule, mirrored about one zero, and everything it
borrowed from r1's pair is taken out:

- The one track with a line down its middle becomes two half tracks with a
  small gap between them. The gap is the zero. No line, no needle.
- The percent comes out of the fill and sits outside the track, at the end the
  fill is heading toward, in a fixed column. It is never inside a fill again,
  so it is never cut.
- The two end icons are actually drawn (today they are not), and each lights
  by the engine's own verdict: the pattern's icon while charge is left after
  the opposite, the opposite's icon once the opposite is ahead.
- The opposite's word is in dim ink unless the opposite is ahead, which is
  r1's lit pole rule.
- The five addresses with no opposite keep the gap where every other row has
  it and draw no right side at all.
- A profile with nothing entered draws no tracks, only the names.

Then the rule for the whole product is one sentence a stranger can learn once:
**a needle on one track is one reading split two ways; a fill growing from a
gap is an amount.** The rail is r1. Every address, anywhere it is drawn, is
this row.

Grade: the address deck goes from **C**, as built on this branch, to **A-**.
r1's pair ported onto the deck grades **D**. Reasons are in the rounds.

## What the review is measured on

- **Build.** A scratch build of this branch at `f0efe988` (the merge that
  brought `dualpole-bar-wire-20261028` in), built into the scratchpad with
  `atuned_src/BUILD.sh` so the committed `source.html` was not touched. The
  committed `source.html` does not carry the new bar at all (no `kbp2` class
  in it, and it still has `poleShare`), so it could not be measured.
- **Rows.** The real `kbRows('addr')` and the real deck drawn by `kbRender()`,
  for every person in `PEOPLE`: sixteen loaded people and the profile with
  nothing entered. The six ICPs (Sofia, Diane, Marcus, Angela, Derek, James)
  carry the screen measurements; all sixteen carry the row counts.
- **Widths.** 1600 by 1000 and 390 by 844, the house widths.
- **Probes.** `mockups/nerve-charge/src/probe/`: `addr.js` reads the rows,
  `deck.js` measures the real deck, `dump.js` writes the data the mockup
  carries. Each was checked against a known case before its numbers were used:
  the deck count read 112 rows, 107 with an opposite and 5 without, which
  matches `kbRowsOf('addr')` read by eye.

## Round 1. Intent, and the question corrected by the code

What is the deck for? A person opens it to find where charge sits among every
address the engine reads (108 somatic, each at a named plexus or nerve, plus
4 field anchors, two above the body and two below) and to open one. The rail
is for reading nine summary figures at a glance. Different jobs. The question
is whether one drawing serves both, so first the ground it stands on was
checked, and five things in the brief were not so.

- **There is no third bar in the drill.** `poleBar` and `poleShare` were
  retired by `3cdc18dc`. `poleDrillHead` in `ui/knowledge.js` calls the same
  `poleDualBar` with its large flag. So there are two drawings in question,
  the rail and the address row, and the drill is the address row, larger.
- **Laws do not use this row.** `kbRowHtml` sends only `node` rows to
  `kbPoleRow`. The deck is exactly the 112 addresses: 107 with a real
  opposite, 5 without (`Root_08_Unnamed`, and the field anchors Sol Star,
  Stellar Gateway, Earth Star and Gaia Gateway).
- **The deck row is not a fraction of the rail's height. It is taller.**
  Measured: the real deck row is 72 pixels at both widths. r1's rail pitch is
  44 (r1's own notes, "Kept: the 44px pitch"). Whether "the figure over the
  centre line" survives at a small height is not the question, because the
  height is not small. What is dense is the count: the deck is 8,537 pixels
  tall at phone width with 4 rows above the fold, and 4,622 at 1600 in two
  columns with 14 above the fold.
- **The bar is built only in the source, on this branch.** The committed
  `source.html` predates it (see above).
- **This branch does not start.** The scratch build's own boot guard records
  "first profile: dualPoleState is not defined" and "opening surface:
  dualPoleState is not defined", and shows "2 parts of this build did not
  start". Cause: `3cdc18dc` deleted `dualPoleState` and `dualPoleStateWord`
  from `ui/knowledge.js`; `renderAmplifiers` in `ui/ui.js` (the Field's four
  amplifier rows, which came in from main with `1a7900e9`) still calls both;
  the merge `84158efc` joined the two. Every `loadP` and every `render()` with
  a reading throws. `main` is not affected; `dualpole-bar-wire-20261028`, this
  branch and `rail-r1-grammar-30oct` (built on it, task SI5) all are. Not this
  review's to fix. Every measurement below shims the two helpers with their
  own deleted bodies so the deck could be drawn at all.

Ruling: the question stands, on corrected ground. Two drawings, one for 9
rows and one for 112, at roughly the same row height. Density is the count,
not the height.

## Round 2. Truth: what an address's numbers are

r1's pair grammar draws **one reading split two ways**: a track with a line
at 50 and one mark, and the figure is how far toward the side you lean. It
only works when the two sides add to a hundred, as Masculine and Feminine do.

An address does not have that reading. `compute()` in `engine/compute.js`
gives each address two amounts of its own and two figures derived from them:

- **held** (`n.held`), the charge sitting at the address, 0 to 10;
- **installed** (`n.rep`), how much of its opposite is in, 0 to 10;
- **left after** (`n.sq`), what is still held once the opposite is counted,
  `held - 0.86 x installed`, which is what the Field draws and DQ sums;
- **opposite ahead** (`n.pole`), `installed - held`, floored at nought.

Held and installed are each out of all of it and do not add to anything.
Measured across the sixteen loaded people, 1,792 rows: **591 carry both, 1,087
carry held only, 90 carry installed only, 24 carry nothing.**

So r1's pair on an address needs a figure the engine does not compute. There
are only two candidates, and both fail:

- **Held's share of held plus installed.** That is `poleShare`, the JZ tug of
  war that was already retired, whose "two percents at the ends ... add to a
  hundred". It reads every held-only row as 100%: 1,087 of the 1,792 rows
  pinned at the end, Sofia's Shame held at 6% drawn the same as Tomas's Fear
  held at 88%.
- **The build's own midpoint, `poleTip`** (`50 - held/2 + installed/2`), which
  the sketch bar already uses for its icons and its spoken word. On screen in
  column B of the mockup: Derek's Possession, held 46, Groundedness installed
  72, nothing left after, reads **63% toward Groundedness**. Tomas's Spiritual
  Escapism, held 97, reads **99%**. Neither number exists anywhere in the
  engine or the drill.

This is the defect the original review already found and fixed for CQ and
DQ: "A line at 50 between CQ and DQ would draw a figure the engine does not
compute", answered by moving DQ under How much. The same answer holds here.
In r1's own grammar an address is the amount family, twice.

And the sketch bar's fills are already that: left from the centre by held,
right from the centre by installed, each out of all of it. Right family. But
it borrows the pair twice. Its single track with a line down the middle looks
like r1's 50. And `poleTip` drives its icons and its spoken word, where it
already misreads: the screen reader says "neutral" on 11 rows where nothing is
left after the opposite (Diane's Obsession, Derek's Possession), and
"collapsed" on 175 rows the engine does not call loaded (its own line is 4 of
10, `n.sq>=4`).

Ruling: not r1 everywhere, because it fails at truth, before density is even
asked. And not the sketch bar unchanged. Keep its shape, take out the pair it
borrowed.

## Round 3. Craft at 112 rows, measured on the real deck

Only now the light, the weight and the word.

- **The figure inside the fill is cut, and a cut figure is a wrong number.**
  For the six ICPs the deck prints 812 figures. At 390 wide, **428 do not fit
  inside their own fill**; at 1600, 222. The figure runs past the centre and
  under the opposite's fill, so Sofia's Nihilism, held at 11%, reads **"1."**
  on her phone (`shots/real-row-390-sofia-nihilism.png`). Sofia, Marcus and
  Angela lose more than two thirds of their figures this way at phone width.
  This is a truth defect wearing a craft costume.
- **The two end icons draw nothing.** `poleDualBar` sets each icon's colour
  but never its stroke, and the sheet does not either, so the computed stroke
  is `none` on all 224. The collapsed icon is invisible and the open icon
  shows only its centre dot. The dominance icons in his sketch have never been
  on a screen (`shots/real-row-1600-derek-possession.png`). Nobody caught it
  in review because the row still reads without them, which says they are
  carrying nothing the fills do not. They stay, because his sketch has them
  and the poles have names, but they are given the one job the fills cannot
  do: which way the address nets out.
- **Nothing entered reads as neutral.** With no reading, all 112 rows say
  "neutral" to a screen reader and both icons sit at full colour. Nothing read
  is not neutral.
- **The five rows with no opposite** draw a centre line, an empty right half
  and an open icon for an opposite they do not have. His second sketch draws
  that kind of row from the left end with no centre line. Dani: the deck is
  scanned down a column, and lengths only compare when they share a zero. Five
  rows with their zero at the left end, among 107 with it at the centre, put
  two zeros in one column. So these rows keep the gap where every other row
  has it and draw nothing on the right at all, no half, no icon, no word. That
  keeps his rule (no opposite, no right label) and keeps one zero.
- **His "Possession 95%" is not one of the five. It is a held only row.**
  Read off the build, Tomas's Possession is held at 95 with nothing of
  Groundedness installed, and Possession does have an opposite. So his second
  sketch is the case where nothing is installed yet, which is 1,087 of the
  1,792 rows. Drawn from the left end, more than half the deck would have its
  zero at the left and the rest at the centre, and a row would change shape
  the day the first of its opposite went in, under a person's eye, with no
  change in what is held. So the held only row keeps the gap and lets the
  right side recede instead: the opposite's word in dim ink, its icon dim, its
  half empty. On screen that reads very close to his second sketch, the held
  fill and its figure are the only bright things on the row, and it keeps one
  zero for the whole deck.

Ruling: the move is specific enough to build, so it was built at arm's length
to prove rather than assert. `mockups/nerve-charge/index.html`, three columns
on the same real rows: A as built on this branch (copied from `kbpCss` and
`poleDualBar`), B r1's pair ported, C the move.

## Round 4. The mockup, measured and looked at

Eight people (the six ICPs, Tomas, nothing entered), both widths.

- **C prints no cut figure** at either width for any of the eight, and draws
  219 end icons (two on each of 107 rows, one on each of 5). Row pitch at phone
  width, in the same column, is 61 pixels for C against 65 for A. With nothing entered, C's
  pitch is 40, because it draws the codex and no empty tracks.
- **B on screen** confirms round 2 (`shots/row-derek-possession-B.png`):
  "63%" toward Groundedness on a row whose drill says nothing is left.
- **Mika, the gap.** Put beside the r1 rail shot, the two cannot be mistaken
  for each other: r1's pair is one track with a line standing out of it and a
  white needle; C is two half tracks, a gap and no needle. Without the gap, a
  rail pair at 70% Positive and an address with 40% installed would be the
  same pixels with different numbers printed on them, on two tabs of one
  product. The gap is the cheapest thing that says "zero" and not "fifty".
- **Dani, new: the right column was nine words said 107 times.** There are
  nine opposites for 107 rows, so a seat reads Trust, Trust, Trust, Trust down
  its right edge, all in Heart green in A, competing with the 112 names that
  are actually different. In C the opposite's word is dim unless the engine
  says the opposite is ahead (`n.pole` over `n.sq`). Lit on Derek's deck: 17
  of 112. On Tomas's: none. On Sofia's: 55. Now the green means something.
- **Anders, cost.** Measured in the mockup at 1600 for Derek, a full deck
  rebuilt 20 times: A 104,497 bytes of markup, 2,160 elements, 29.6
  milliseconds a rebuild; C 108,448 bytes, 2,337 elements, 33.1; B 72,566,
  1,864, 30.4. Same order. C needs no transform, no tween and no per frame
  paint: inline widths in a string, which is how `kbRender` builds the deck
  already. Porting r1's paint loop here would be wrong on cost alone:
  `kbRender` rewrites the whole deck on every keystroke in search (`oninput`
  calls it), so any per row entrance would replay 112 times a letter.
- **What still costs C.** Tomas carries nothing installed, so 111 right halves
  are empty track. Kept: an empty right half is the reading "nothing
  installed", which JQ asked to see ("I want to see both poles"), and r1 keeps
  an empty half on its pairs too.

## Round 5. The drill, the motion, and the two screens question

- **The drill names the address twice and uses two scales.** The heading says
  Possession and the bar's own line says Possession again, the same class of
  defect r1's round 1 caught. And the bar says 46% and 72% while the sentence
  under it says "Charge held here 4.6. Groundedness installed 7.2. Left after
  that 0.0." One reading, two scales, on one screen. The move, built in the
  mockup (`shots/drill-derek-possession-C.png`): the large bar drops its name
  line, and the sentence is in per cent, "Held here 46 per cent. Groundedness
  installed 72 per cent. Left after that, none." The drill is the one place
  all three figures belong; the row carries two and lets the lit icon say the
  third.
- **Kai, motion.** None on the deck, for the reason Anders measured. In the
  drill, the one bar a person opened, the two fills grow from the gap once on
  open over 380 milliseconds (the house's `ENTER_SPAN`), stop hard at both
  ends, and land in the first frame under reduced motion. Built in the mockup.
- **A third drawing of the same thing was found on the Field.** The four
  amplifier rows (Justification, Entitlement, Perfectionism, Obsession) are
  addresses, drawn with a ring and the old five step state glyph, and they are
  the rows that crash this branch. They are addresses, so they take this row.
  After that, every address anywhere is one drawing and every summary figure
  on the rail is r1.
- **Is two grammars on two screens a defect?** No, once C is built. They are
  r1's two families, each applied to what its reading actually is. The defect
  today is the opposite one: the sketch bar dresses two amounts as a pair.
  Forcing one shape over both would repeat the exact mistake the rail review
  graded C+: "One component, rbPair, was stretched over pairs that sum to 100
  ... and a pair that does not".

## The finding, the cause, the move, the cost, the grade

- **The finding.** The address deck prints figures it cannot fit (428 of 812
  cut at phone width for the six ICPs, and a cut "11%" reads as a different
  number), its dominance icons are not drawn, and its icons and spoken word
  run on a midpoint the engine never computes.
- **The cause.** Not the bar. It treats two independent amounts as one pair:
  a pair's centre line, a pair's midpoint, and the figure inside a fill that
  is short more often than not because most addresses carry little.
- **The move.** In `ui/knowledge.js`, `poleDualBar`, `kbPoleRow`, `kbpCss` and
  `poleDrillHead`; in `ui/drills.js`, the sentence in `nodeDrillHtml`; in
  `ui/ui.js`, `renderAmplifiers`. In this order:
  1. P0 first, outside this review: restore what `renderAmplifiers` calls, or
     move it to the new row, so the branch starts.
  2. Two half tracks with a 2 pixel gap and no centre line. Held fills its
     half from the gap by `held` per cent of the half; installed fills its
     half the same way.
  3. Figures out of the fills, into fixed columns outside the track ends, 32
     pixels on the row and 38 in the drill. A zero prints nothing.
  4. Both end icons get `stroke="currentColor"`. The pattern's icon is lit
     when `n.sq >= 0.05` and `n.sq >= n.pole`; the opposite's when `n.pole >=
     0.05` and `n.pole > n.sq`; otherwise both are dim. `poleTip`,
     `poleDimPct` and `poleLean` go.
  5. The opposite's word is dim unless the opposite's icon is lit.
  6. A row whose `q` is null (the five) has no right half, icon or word, and
     keeps the gap.
  7. Nothing entered draws no track line.
  8. The spoken label says held and installed in per cent and then one of
     "charge left after the opposite", "the opposite is ahead", "nothing left
     either way", or "not read yet".
  9. The drill's large bar drops its name line, and its sentence moves to per
     cent.
  10. The amplifier rows take the same row.
- **The cost.** About half a day for steps 2 to 10 once step 1 is in, plus
  the gates: `design.js` floors, `collide.js`, `monitor.js` baselines for the
  Knowledge page, and the mark variety floor recalibrated in PR 147, which
  counts deck marks and has to be re-measured. Two new assertions belong in
  `tests/functional.js`: no figure on the deck is wider than the box it is
  drawn in, and no end icon has a computed stroke of `none`. Risk: low. No
  engine figure changes; the drawing stops inventing one.
- **The grade delta.** Address deck, C to A-. Not an A because the nine
  opposites still repeat down the right edge (now quiet, not gone), heavy
  profiles carry a column of empty right halves, and the collapsed icon is a
  circle with a bar through it, which on a list of buttons can read as a
  remove control. It is his sketch's own minus, so it stays.

## Decided here, so it is not asked

- **"By weight" keeps sorting on held.** The Field ranks addresses by left
  after, and the deck sorts on held, so Derek's Possession, held at 46 with
  nothing left, sorts above his Scarcity, held at 39 with all of it left. Measured: 3 of the 6 ICPs
  (Diane, Derek, James) have rows held at 40 or more with under half of it
  left. Sorting on a figure the row does not print would put the printed
  figures out of order, which reads as broken. The lit icon carries left
  after on every row, and the drill states it. Held stays the sort.

## Outside this question, recorded so it is not lost

- The deck's kind chip prints "Fetters 112" on a screen that never states the
  structure, against the 28 October ruling that a screen may not open on a
  bare 112.
- The right hand word sits lower than the left hand name on every row as
  built, because the name line aligns on baseline across two font sizes.
  Gone in C, which centres the line.

## Shots

In `mockups/nerve-charge/shots/`:

- `real-row-390-sofia-nihilism.png`, the real deck: 11% printed as "1.".
- `real-row-1600-derek-possession.png`, the real deck: end icons not drawn.
- `real-deck-1600-diane.png`, `real-deck-390-sofia.png`, the real deck whole,
  with the boot guard's "did not start" notice showing.
- `1600-<person>.png`, all three columns for each of the eight.
- `390-<person>-A.png`, `-B.png`, `-C.png` for nothing entered, Sofia and
  Derek.
- `row-<person>-<address>-A.png`, `-B.png`, `-C.png` for Derek's Possession,
  Sofia's Nihilism, Tomas's Fear (a held only row, the case his "Possession
  95%" sketch draws) and Diane's Sol Star (a field anchor with no opposite).
- `drill-derek-possession-C.png`, the drill head as moved.
