# THE FEATHERS

Animation and VFX direction on the core graphic of the Field wheel. Written
against the owner's ruling of 20 September, TASKS.md section AH.

Everything numbered here was measured in a real Chromium at 1600x1000 against
`source.html` at commit head, with the animation clock pinned so a diff of two
renders of the same state reports zero. Every probe was checked against a
known good case before its output was believed, because this repository has
twice been given a defect that was the probe's own bug. Both checks and both
failures are recorded where they happened.

Prototypes: `/home/user/MOB/proto/feather/index.html`, and
`one.html`, `two.html`, `three.html`, `four.html` beside it. They are
standalone, they carry real numbers from seven real profiles, and hover and
click work in all four. Drop in code: `/home/user/MOB/proto/feather/wheel-core.patch.js`.

---

## WHAT IS THERE NOW

### Where the code is

| What | Where |
|---|---|
| The mark itself | `atuned_src/ui/wheel.js:266`, `function coreFeather(a,len,wid,col,al)` |
| The three layers | `atuned_src/ui/wheel.js:294`, `function coreInside(r,cr0)` |
| The twenty one laws called | `:314` |
| The seven seats called | `:318` |
| The triad called | `:321` |
| The thresholds | `:99`, `const CORE_STEP=[1.45,2.30,3.40]` |
| The ramps and the readout | `:253` `coreLayerA`, `:257` `coreOpen`, `:258` `CORE_LAYER_NM`, `:259` `coreResolved` |
| The only target covering it | `:399`, `HIT.push({k:'core',x:CX,y:CY,rad:cr0*1.5})` inside `solCore` at `:323` |
| The same twenty one, drawn again outside | `:735` to `:744` |
| What a click does | `atuned_src/ui/ui.js:235`, `runCoreDrill()` |

In the build product the same code sits at `source.html:10064` and `:10098`.

### What they are derived from

Thirty one marks in three populations, and all three carry real engine values.

| Layer | Opens at zoom | Count | Length | Half width | Colour | Spin |
|---|---|---|---|---|---|---|
| The triad | 1.45 | 3 | `cr0*0.80*x` where x is `r.X`, `r.Y`, `r.Z`, each 0 to 1 | `cr0*0.20` | Sacral, 3rd Eye, Solar, borrowed | `+0.015 rad/s` |
| The seven seats | 2.30 | 7 | `cr0*0.86*bandIg(b)/10` | `cr0*0.10` | the seat's own | `-0.03 rad/s` |
| The twenty one laws | 3.40 | 21 | `cr0*0.93*S.law[nm]/10` | `cr0*0.035` | the law's seat | `+0.05 rad/s` |

So the honest answer to "is any of it a reading" is yes, every length is. The
count is not decoration, the angles are, and the widths are: width encodes
which of the three layers a mark belongs to and nothing else, and angle is
`i/n` of a circle plus a clock.

### The four measured defects in the drawing

**One. Two of the three series are drawn against gridlines that are wrong for
them.** Four quarter step rings are drawn at `cr0*0.93*f` at `:301` to `:303`.
The laws run out to `0.93`, so a law at a true 10 reads 10.00 on those rings.
The seats run out to `0.86`, so a seat at a true 10 reads **9.25**. The triad
runs out to `0.80` on a quantity that is scored 0 to 1, so a triad at a true
1.00 reads **8.60**. A chart whose gridlines are wrong for two of its three
series is not a chart.

**Two. Eleven pairs of the thirty one share an angle.** Because 21 is 3 times
7, law `3k` sits exactly on seat `k` and law `7i` sits exactly on triad `i`.
Measured at zero spin: 11 coincident pairs to within 0.02 radians. The three
counter rotations pull them apart over time, and `REDUCED` sets spin to zero,
so under `prefers-reduced-motion` eleven pairs of feathers are drawn exactly on
top of each other, permanently.

**Three. The layers paint over each other.** Suppressing one layer at a time
and counting the pixels that change: the triad accounts for 11,451, the seats
10,237, the laws 8,979. Total ink with all three in is 20,079. The sum of the
parts is 30,667, so **10,588 pixels, 34 percent of the drawn ink, is one layer
painted over another**. The fattest and least trustworthy layer, the triad at
a half width of `0.20*cr0`, is on top.

**Four, and this is the one that proves him right.** Feather ink for a blank
profile that has answered nothing is **22,275 pixels**. Feather ink for Marcus,
who has a full story and twenty one answered laws, is **20,358 pixels**. The
blank profile draws a larger, fuller, more vibrant figure than the loaded one.
All twenty one laws default to 6.5 and all seven seats to 6.5, so twenty eight
of the thirty one marks are the same length, and the fresh profile reads as
the most coherent, most evenly developed person in the roster. The rail beside
it says "nothing read yet."

### How much of the canvas they occupy, at 1600 wide

Marcus, depth 3, zoom 3.6, clock pinned, Chromium, device pixel ratio 1.

| | |
|---|---|
| Wheel canvas | 664 x 727, 482,064 pixels |
| Core radius `cr0` | 165.8 pixels, disc area 86,393 pixels |
| Feather ink | **20,079 pixels** |
| Share of the core disc | 23.2 percent |
| Share of the wheel canvas | 4.2 percent |
| Equivalent square | 142 x 142 pixels |
| Cost in the frame | **0.4ms of a 1.7ms frame** |

Across the roster the ink runs from 1,791 pixels at Tomas, CQ 2.9, to 83,617
at Rosa, CQ 100, a range of 47 times. Almost all of that is `cr0`, which is
sized by CQ, and not the values inside it.

### Whether a hit target exists

It does not. **The array they are absent from is `HIT`.**

`HIT` holds 181 entries on the Field at depth 3, and the count does not change
with zoom: core 1, gate 6, law 21, arch 12, mask 6, seat 7, domain 19,
saboteur 1, and one node entry per routed address. Exactly one of those 181 lies inside the core rim, and it is
the one pushed at `wheel.js:399` with radius `cr0*1.5`.

Every one of the thirty one feather tips was probed with the product's own
`hitTest` at zoom 1.6, 2.5, 3.6 and 4.6. **Thirty one of thirty one returned
`core`.** The tool was checked first against a known good case: the midpoint of
a node wedge returned `{k:'node', name:'Fear'}`, so the probe reads the array
correctly and the result is the product's, not the probe's.

What a press does: `ui.js:117` treats a core hit as grab space and arms a pan,
and `ui.js:235` opens `runCoreDrill()` on release if the pointer never moved.
That drill prints CQ and the sentence about the circuit. So clicking any one of
thirty one individually valued marks gives you the one number those marks are
made of, which is the number already printed in the strip directly above the
wheel and in the rail to the right of it. He clicked and got the thing he could
already read. His word for that was "nothing," and it is the right word.

### The answer he was given, and whether it still holds

The answer came from the comment at `wheel.js:84` to `:93`, repeated in
`DECISIONS.md:1018` to `:1025`:

> They are feathers because that is what they look like from the inside: a
> spine with barbs, thinning to the tip, and the tip is how far that quantity
> actually reaches. A short feather is a quantity that is not carrying.
> Nothing here is decoration: every length on screen is a number the engine
> computed.

**Half of it holds and half of it does not.**

Holds: every length is a number the engine computed. That is true and it is
worth defending, because the failure here is not the usual one.

Does not hold: "the tip is how far that quantity actually reaches" is true of
one of the three layers against the rings it is drawn on, and false by 7.5
percent for the seats and by 14 percent for the triad. And "nothing here is
decoration" is a claim about the source of the numbers, not about the screen.
A quantity nobody can read and nobody can reach is decoration in effect
whatever it was in intent. On a blank profile the lengths are the engine's
defaults, which is worse than decoration: it is a figure of a person who has
not been read.

The symbol argument in that comment is the part that survives intact, and the
rest of this document is built on it.

---

## THE HUNDRED PASSES

Twenty distinct mechanisms, not twenty adjectives. Four of them were built and
rendered rather than argued, and those four are marked.

1. **Leave them, add a legend.** Lost. A legend for a mark that cannot be
   pressed is an apology. He did not ask what they were, he asked what he
   could do with them.
2. **Delete them, solid core.** Lost. It throws away the only place in this
   product where a single number visibly becomes the things it is made of,
   which is what a diagnostic instrument is for.
3. **Keep all three layers, add thirty one targets.** Lost. Three units on one
   ring scale means the tooltip has to explain why a true 1.00 lands at 8.6,
   and a tooltip that explains the drawing is a drawing that failed.
4. **Twenty one horizontal bars in the right rail.** Lost, and it is the most
   readable option on the board. It puts integrity somewhere other than inside
   the figure integrity is the numerator of, and the rail already carries
   fifty seven to seventy one simultaneous choices.
5. **A radar polygon closed over the twenty one.** Lost. A closed polygon reads
   as an area, and the area of a radar is an artifact of the ordering of its
   axes, so rotating the law list would change the apparent reading.
6. **A sunburst, twenty one wedges filled to value.** Lost. Filled wedges make
   area the channel again, and ring not fill is a standing ruling.
7. **A dot plot, twenty one dots on twenty one spokes.** Lost. Correct, and
   dead. A dot has no second channel at all, and it throws away the shape he
   said he liked.
8. **The nine poled axes as nine feathers.** Lost. An axis is charge you carry,
   not a thing you do, so length would be "the percent at which this happens to
   you," which is not his sentence. They are also the whole subject of the left
   rail already.
9. **The seven seats alone, seven feathers.** Lost as the primary. A seat is a
   place, not an action, and seven marks cannot decompose a twenty one term
   mean. Kept as the first of two zoom steps, because it is the sum the laws
   are the parts of.
10. **The twelve archetypes.** Lost. Affinity is a style of expression, there is
    no percent at which you do an archetype, and the named archetype ring
    already exists at depth 2 with working targets.
11. **The four roots, or the nineteen domains.** Lost. A domain is a weighting
    on the Distortion matrix, not a behaviour, and the domain ring already
    exists at depth 3.
12. **The triad alone, three large feathers.** Lost. Three marks is not an
    atomisation of anything, and vitality, awareness and will already have a
    door on the key strip above the wheel through `runXYZDrill`.
13. **One filament per address, a hundred and twelve of them.** Lost. That is
    the shell drawn a second time inside itself, and the shell is already the
    best drawing of them in the product.
14. **Length is the law, angle off the radial is vibrancy.** Lost. Angle off a
    baseline is read as position, so two laws at the same value would read as
    two different values.
15. **Length is the law, hue is vibrancy.** Lost. Colour is already the seat,
    and the seat colour is what lets a feather be traced outward to the band it
    belongs to. Taking colour for a second job breaks the one correspondence
    that makes the core an exploded view rather than a separate diagram.
16. **Length is the law, opacity is vibrancy.** Lost. Opacity against a ground
    that is itself tinted by coherence reads as distance rather than as
    condition, and opacity is the channel the deficit mark already uses.
17. **Length is the law, barb sweep angle is vibrancy.** Held in reserve. It is
    a genuine texture channel and it is orthogonal to length, but it only
    resolves at the largest core sizes and it does nothing at Tomas's 95 pixel
    radius. Offered as a refinement, not as the primary.
18. **The moult. The deficit drawn as loose barbs drifting between the tip and
    the rim.** *Built, `four.html`.* Lost as the primary: twenty one drifting
    debris fields on screen at once is exactly the thing that delights at first
    viewing and irritates at the fortieth, and it competes with the atom layer,
    which is already particulate. The idea of drawing the absence survives and
    is in the ruling as a static comb.
19. **Seven wings. One quill per seat, its laws as branches off that quill.**
    *Built, `three.html`.* Lost. It is the prettiest of the four and it is the
    least readable: the branches leave the quill at different radii, so their
    lengths share no baseline and comparing Truth to Patience becomes an
    eyeball estimate. Measured: not one of the twenty one tips lands on the
    quarter step rings. It taught the ruling one thing, which is that the seat
    grouping has to be visible, and that is now done with sector boundaries
    and colour instead of with a shape.
20. **His proposal verbatim. Length is the law, the width of the branches is
    vibrancy.** *Built, `one.html`.* Lost on measurement. See the verdict.

The one that won is number 21, which is his proposal with the second channel
moved off width: *built, `two.html`.*

---

## THE SYMBOL ARGUMENT

This comes before the geometry because he asked for it to.

A feather already carries meaning before anyone draws data on it. It is the
unit of flight. It is what a bird sheds and grows again. It is the thing that
weighs almost nothing, which is why the oldest use of a feather as an
instrument is as the counterweight: a heart is set against a feather and what
matters is the difference between them. That is, without stretching anything,
a moral integrity instrument. This product weighs a person's story against
twenty one laws of moral integrity and reports what the gap costs. **The core
is the heart. The feathers are what it is weighed against.** The product's
voice does not say any of that out loud, because the voice is mechanical and
physical and does not do mythology, but the shape can carry it silently, which
is what a symbol is for.

Three properties of a real feather do work here, and each one is true of the
number under it:

**Length is reach.** A feather's length is how far it reaches into the air. A
law's value is how far a person's conduct reaches into that law. A short
feather is a short reach. This is the property the existing code already named
and it is correct.

**A feather carries only if its vane is intact.** Barbs hook to each other and
make a surface. A feather with a split or bare vane still looks like a feather
from a distance and carries nothing. This is the second channel and it is the
one the owner was reaching for when he said vibrancy. A law kept while its seat
is loaded is a law kept at cost, and the cost belongs in the vane, not in the
length.

**A bare shaft is not a damaged feather, it is one that never grew a vane.** A
law nobody has answered gets no vane, because there is nothing yet for the
barbs to hook to. That is the third state, and it is the fix for the blank
profile drawing the fullest figure in the roster.

Rejected readings, for the record. **Rays of light**: the halo already says sun,
and light has brightness but no condition, so there is no second channel in it.
**Petals**: a flower's petals are a count, not a measure, and a short petal
reads as damage rather than as less. **Spokes**: a spoke is under tension and a
short spoke is a broken wheel, which is a judgment, and this product does not
grade people. **Roots**: roots go down, this figure goes out, and the shell
already owns outward. Feather stands.

**The line for the tooltip, and it is true of the number underneath it:**

> one of the twenty one you are weighed against

---

## WHAT THEY CARRY

**The twenty one laws of moral integrity. One feather each. Grouped into the
seven seats they are seated at.**

Four arguments, in order of weight.

**One. It is his own sentence.** "Each one represents the percent at which we
do it." Of every candidate on the board, only the laws are things a person
does. An axis is charge that happens to you. A seat is a place in the body. An
archetype is a style of expression. A root is a weighting on the matrix. The
triad are states. A law is a behaviour with a rate, and `S.law[nm]` is scored
0 to 10, which is a percent at which you do it with the decimal point moved.

**Two. The core is CQ, and the laws are literally CQ's numerator.**
`compute.js` has `Ig = mean of the twenty one laws + poleMean*0.30 - JQ*0.42`
and `CQ = (It * Ig) / Rz`. Nothing else in the product decomposes the number
the core is. The seven seats are the same twenty one summed by seat: `bandIg(b)`
is the mean of the laws at that seat, so the seven are free and are not a
second population. That is what makes a two step zoom honest rather than
decorative: **the seven are the sum and the twenty one are its parts.**

**Three. The count is defensible, which is the test he set.** Twenty one,
because there are twenty one laws. Seven groups, of three, three, three, four,
four, two and two, because that is how the laws are seated. No number in the
figure is chosen because it looked right.

**Four, and this one settles it.** The twenty one laws are already on this
wheel. `wheel.js:735` draws them as short spokes on a ring just outside the
core, at every depth, with twenty one working `HIT` entries of kind `law`, a
working tooltip and a working drill. Measured at 1600 wide, that ring sits at
1.22 times the core rim at every zoom, so the two never overlap and both are on
screen together above zoom 3.40. **One quantity, drawn twice on one screen,
4.6 pixels wide in the place you can press it and a hundred and fifty pixels
wide in the place you cannot.** This is not a proposal to invent a meaning for
the feathers. It is a proposal to join the two halves of a thing that was
already split.

**What leaves.** The triad. It was three states scored 0 to 1 drawn on a scale
calibrated 0 to 10, its full value reached 8.60 on its own gridlines, and it
already has a door on the key strip through `runXYZDrill` and a whole surface
on the Energy tab. Three marks is not an atomisation and nothing is lost.

---

## THE GEOMETRY

All of it arithmetic. `cr0` is the core radius the product already computes.

### Count and grouping

    marks              21, one per entry in SI
    groups             7, by SI[i].b, giving 3,3,3,4,4,2,2
    group order        SI order, which is already contiguous by seat

### Angle

The seven sectors are **the shell's own seat arcs**, not a fresh division.
`n.ang` is set once at load in `engine/core.js:8` and never moves, so each
seat's span is a constant, computed once:

    seat b:   a0 = min(n.ang for n in W where n.b === b)
              a1 = max(n.ang for n in W where n.b === b) + TAU/W.length

Those seven arcs tile the circle exactly and share their boundaries with the
shell's seat bands. Each law then takes an equal share of its own seat's arc:

    law k of n in seat b:   w  = (a1 - a0) / n
                            a  = a0 + w*(k + 0.5)      the centre line
                            a0 = a0 + w*k              the sector, for the target
                            a1 = a0 + w*(k + 1)

Why this and not twenty one equal slots: the core becomes an exploded view of
the ring around it. A person can run a line from a feather straight out to the
band it belongs to, and **the seat names the shell already draws outside the
rim label the core's sectors at no cost**, which satisfies "no text over the
hero graphic" by not needing any.

The trade, stated. The shell's seats hold unequal numbers of the hundred and
twelve, so a law's slot is 13.3 degrees at the Throat and 26.7 at the Sacral.
Angular width carries no quantity here, length does, so this is a layout
artifact and not a lie. Measured span: 13.3 to 26.7 degrees.

**There is no spin.** The sectors are pinned to the shell. This also removes
the eleven coincident pairs entirely, because twenty one slots tile the circle
with no duplicates, rather than being pulled apart by a clock.

### Length, which is the reading

One constant for every mark, so the gridlines are true for all of them.

    HUB = 0.15          the hub ring, which is zero
    RIM = 0.93          the rim, which is ten

    r(v) = cr0 * ( HUB + (RIM - HUB) * clamp(v,0,10)/10 )

    feather base   cr0 * HUB
    feather tip    r(v), with the breath applied
    rings drawn at r(0), r(2.5), r(5), r(7.5), r(10)

A hub, because twenty one spokes meeting at a point is a knot and every short
reading lives in the knot, so the readings that matter most were the ones
buried. A law at zero is a tick on the hub with no feather on it, which is the
honest drawing of nothing. Five rings rather than four, because zero is now a
line and has to be drawn or the baseline is invented.

### Width, which is not a reading

    half width = 0.046 * cr0, constant

The verdict section is why.

### Vibrancy, which is the vane and never the width

Vibrancy has to name a number, so here is the number:

    load(b) = mean n.sq over the addresses at seat b, 0 to 10
    vib(b)  = clamp(1 - load(b)/7, 0, 1)

Divided by 7 and not by 10 because the measured range across the reference
roster is 0.0 at Rosa to 6.7 at Tomas, so the channel uses its width instead of
a fifth of it. It drives two things and neither is a length:

    barb count   max(2, round(L/10 * lerp(0.50, 1.15, vib)))
    barb alpha   lerp(0.16, 0.70, vib)
    vane alpha   0.085 * (0.35 + 0.65*vib)

A law with a clear seat has a full vane. A law seated under charge has a bare
rachis: the rule is still kept and the lift is gone.

### The third state, which is the honesty fix

    known = CURP && CURP.laws && CURP.laws[nm] != null

If false, the mark is a **quill**: rachis at the blank value, no vane, no
barbs, and an open ring at the tip instead of a filled dot. The blank profile
goes from the fullest figure in the roster to twenty one bare shafts, which is
the true picture and reads at a glance without a word.

### The deficit, which is how a number says what it is out of

Between the tip and the rim: one dotted spine at alpha 0.17, and one to four
combs at alpha 0.13, spaced `gap/(n+1)` with `n = clamp(round(gap/34),1,4)`.
Static. A mark that says "this is missing" does not need to move, and there are
twenty one of them on screen at once.

### Colour

`bc(seat)`, the product's existing palette function, which already resolves
Dark, Snow and Lumen. Ring not fill: the vane is a 0.085 alpha wash under
stroked barbs, the sector fill at the seat step is 0.10 to 0.26, and nothing is
a solid.

### Breath, and the one number on the Field that was not a reading

The old core breathed on `Math.sin(S.t*1.4)` at 5 percent, a constant, so a
person at CQ 18 and a person at CQ 88 were given identically paced breath on an
instrument whose subject is a nervous system. The rate is the reading now:

    period     lerp(2.0s at CQ 0,  5.0s at CQ 100)
    amplitude  lerp(0.010 at CQ 0, 0.030 at CQ 100) of the radius
    phase      seatIndex/7 * 1.05 radians

Slow and deep against fast and shallow, which is what an autonomic system
actually does, and a per seat phase offset so the Root leads and the Crown
arrives about a sixth of a cycle later. That is overlapping action: the figure
breathes rather than pumping. At a 166 pixel core the amplitude is 1.7 to 5.0
pixels, which is above the resolution of the display. The old motion moved
0.07 pixels per frame at its peak, which was not.

### Zoom, and what resolves when

    1.45   the seven seats. one sector each, filled to bandIg(b)/10.
    2.30   the twenty one laws. each sector resolves into its 2 to 4 feathers,
           and the seat fill gives way as they arrive: seatA = a0 * (1 - a1*0.86)

3.40 goes. The shell is fully on screen only to zoom 2.08, which is the
measurement that already brought `FET_STEP` down from 2.60 and 3.90, and the
deepest core layer was landing after the ring had left the frame.

### The handoff, which is the animation that carries the idea

The twenty one law spokes outside the core fade out over the feathers' own
ramp, `give = 1 - coreLayerA(1)`, and their targets are dropped once
`give <= 0.5`. The handoff is the thing a person sees: **the laws did not
vanish, they went inside.** Below the threshold the spokes are the only copy
and they are untouched.

---

## THE INTERACTION

### Hover, mouse

Reuse `#probe`, the wheel's existing tooltip. The `HIT` entry is kind `law`
with a `core` flag, so `describe()` and `pointerdown` in `ui.js` already serve
it. One added branch for the core's richer line. Measured in the prototype:
**hover answered on 21 of 21 and click opened the detail on 21 of 21**, driven
by a real pointer at each sector's own midpoint.

What it says:

    ONE OF THE TWENTY ONE YOU ARE WEIGHED AGAINST
    Temperance
    2.8 of 10
    Sacral seat. You rarely hold it.
    The seat carries 1.3 of 10, so it costs something to keep.
    Click for the detail.

Every number says what it is out of. The eyebrow carries the symbol. The last
line is the affordance, in the shape the wheel's other tooltips already use.

For an unanswered law the fourth line is replaced:

    Not answered yet. This is the blank value, not a reading of you.

### The hover state on the graphic

The hovered feather goes to alpha 1 and the other twenty give ground to 0.42,
eased at 0.21 per frame, which reaches 90 percent in about 160ms at 60fps and
sits in the micro state band. It is the same per frame easing form the wheel
already runs on `n.disp`, so the two cannot drift to different feels. Twenty
one marks in one circle means "which one is that" has to be answered by the
drawing, not hunted.

### Click

Runs `runLawDrill(SI[h.j])`, which exists, is already wired to kind `law`, and
already opens the law's own reading. **No new drill is written.** The right
rail gains the seat's other laws as rows so the group is visible from inside
one of its members.

### Tap, on a phone

**The target is the seat, not the law.** Measured at 390 wide: the core radius
is 178 pixels, a law sector is 13.3 to 26.7 degrees and is 36 to 77 pixels
across at the rim, and **six of the twenty one are under the 44 pixel floor at
their widest point**. A seat sector is 149 pixels. So on a coarse pointer the
core pushes seven `seat` entries instead of twenty one `law` entries, and the
seat drill lists its two to four laws as rows the finger can then take. That is
the pattern the drills already use and it keeps the product's existing rule that
a tap reads and never writes.

### The target is the sector, not the feather

This is the load bearing decision in the whole interaction. A law at 1 of 10 is
a short mark, and it is the one a person most wants to press. The target
therefore does not shrink with the reading: it runs the full depth of its
sector, from the hub ring to the rim, at its own angular width, whatever the
feather inside it is doing.

### Targets go in the same array

`HIT.push({k:'law', j:i, core:1, cx:CX, cy:CY, a0, a1, r0:hub, r1:rim})`. This
is the same wedge shape the wheel already pushes for laws at `:741`, seats at
`:841`, archetypes at `:755` and domains at `:851`, so the two pass scan at
`ui.js:83` needs no new branch.

**How I know this cannot break the collide gate.** `tests/collide.js` asserts
two things and reads two globals to do it. The first half reads `window.__PLATES`
and calls `window.plateHit` on every pair, which is nameplates. The second half
reads `LBL`, which `radialTxt` records, and tests it against the bounding boxes
of the DOM controls on the stage, and then against the canvas edges. **It never
reads `HIT`.** Nothing proposed here pushes a plate or draws a label, because
the sector labels are the shell's existing seat names sitting outside the rim,
which `LBL` already records and which the gate already passes. `HIT` growing by
21 entries, or by 7 on a phone, is invisible to all 100 assertions. The gate
must still be run, and it will report the same count.

---

## THE VERDICT ON HIS PROPOSAL

**Length is right and it is the whole reading. Width is wrong, and it is wrong
in a way that gets worse exactly where the product matters most. Move vibrancy
off width and onto the vane, and everything he asked for survives.**

Built as `one.html` and measured against `two.html`, same data, same profiles,
same hit geometry, same tooltip, only the mark differs.

### The measurement

For every pair of laws whose readings differ by more than 0.15, ask: does the
mark with the larger reading carry more ink? If not, a person reading mass as
magnitude gets that pair backwards. Ink was measured by isolating one mark at a
time and differencing against a render with no marks.

*The first version of this probe reported 30.5 percent for both variants, which
is the shape of a bug and was one: it counted alpha coverage, and the core disc
is opaque, so it was measuring the disc. It was caught by its own tool check,
which requires a render differenced against itself to return zero and returned
152,629. The numbers below come from the corrected probe, whose self check
returns 0 and whose sum of twenty one isolated marks exceeds the whole figure
by 357 pixels of genuine overlap.*

| Profile | One. length x width | Two. length alone |
|---|---|---|
| Sofia, CQ 57.2 | 0 of 90 backwards, 0% | 0 of 90, 0% |
| Diane, CQ 28.6 | **32 of 105 backwards, 30.5%** | 0 of 105, 0% |
| Marcus, CQ 39.2 | 0 of 105, 0% | 0 of 105, 0% |
| James, CQ 12.8 | 0 of 102, 0% | 0 of 102, 0% |
| Tomas, CQ 2.9 | **37 of 88 backwards, 42.0%** | 0 of 88, 0% |

The widest single lie, on Diane: **Duty reads 8.4 and carries 4,388 pixels.
Unity reads 6.1 and carries 4,847 pixels.** The lower reading is drawn 10
percent heavier. Same figure, same instant, no hover needed to see it.

### Why it fails where it fails, and why the zeros are not a defence

The three profiles that score zero score zero because their seat loads are
nearly flat. Marcus runs 0.9 to 1.3 across seven seats, so the width channel
barely moves and therefore carries almost nothing. **The channel is either
silent or it is lying.** On Diane the loads run 1.3 to 3.6 and it lies on three
pairs in ten. On Tomas they run 3.7 to 6.7 while the readings themselves are
compressed into 2.3 to 4.1, so width dominates length completely and it lies on
four pairs in ten.

That is the exact inversion the product cannot afford. Tomas is the lowest
coherence profile in the roster. He is the person who most needs to see which
law is short, and his is the render where the mark is least able to say it.
Look at `v-one-Tomas` against `v-two-Tomas`: the first collapses into a small
spider where length and width both say "less" at the same time and neither can
be separated, and the second keeps twenty one findable tips on true gridlines
with bare vanes that say the seats are loaded.

The underlying reason is not aesthetic. Length and width on one mark multiply
into area, and area is the channel the eye actually reads for magnitude, so the
two do not sit side by side, they compound. Two channels on one mark is fine.
Two channels that multiply into a third is not.

### What replaces it, and it is still his idea

Vibrancy moves to the vane: how many barbs there are and how hard they are
drawn. Barb density is a texture, it does not change the mark's footprint, and
it is orthogonal to length, so a long sparse feather and a short full one are
both readable as what they are. Measured at 0 backwards pairs on all five
profiles.

And it is the better symbol, which is the part he cares about most. A feather
carries because its vane is intact. A law kept under a loaded seat is kept at
cost, and the cost belongs in the vane. The four corners of the resulting two
by two are all readable with the labels off:

    long and full    you do it, and it costs you nothing
    long and bare    you do it, and it is costing you
    short and full   you do not do it, and nothing is in the way
    short and bare   you do not do it, and the seat is loaded

The one he most needs to act on is the third, and it is the one the old drawing
could not say at all.

---

## THE FRAME COST

| | |
|---|---|
| Current thirty one marks, product, 1600x1000, zoom 3.6 | 0.4ms of a 1.7ms frame |
| Prototype two, twenty one marks plus rings plus disc, 253px rim | 0.40ms median, 0.80ms p95 |
| Prototype one, twenty one marks | 0.3ms median, 0.4ms p95 |
| Prototype four, twenty one marks plus loose barbs | 0.4ms median, 0.6ms p95 |
| Prototype three, seven wings | 0.1ms median, 0.2ms p95 |

The new mark set is ten fewer marks measured at a rim 64 percent larger than
the product's, so the budget is at or under what is already spent.

**Compositor.** None of it is. It is all 2D canvas into `#cv`, which is one
layer the Field already owns. No new backdrop filter, no new stacking context,
no new layer, nothing promoted. `tests/design.js` gate 13 counts backdrops and
frame rate, and this changes neither. Nothing needs to leave the main thread and
nothing should: 0.4ms is 2.4 percent of a 16.7ms budget.

**The one saving.** Deleting the triad removes the widest mark in the figure, a
half width of `0.20*cr0` filled and barbed, and with it the 10,588 pixels of
overdraw between the layers.

---

## REDUCED MOTION

Stated, because it always is.

| | |
|---|---|
| Breath | Off. `coreBreath` returns 0 and every feather sits at its full reading. Not slowed. |
| Spin | Gone for everyone. The sectors are pinned to the shell, so there is nothing to stop. |
| Hover lighting | Snaps. The ease factor goes to 1, so the end state arrives on the frame. |
| Layer arrival | Unchanged. It is a zoom ramp driven by the person's own gesture, not a clock. |
| Deficit combs | Static in both modes, by design. |

Measured in a `prefers-reduced-motion: reduce` context: **zero pixels changed
over 900ms**, and a feather whose law reads 3.3 sits at 0.4074 of the rim,
which is exactly `0.15 + 0.78 * 0.33`. The end state, not a slower animation.

This also repairs an existing reduced motion defect rather than adding one: at
present `REDUCED` sets spin to zero and leaves eleven pairs of the thirty one
drawn exactly on top of each other with nothing to separate them.

---

## THE FATIGUE TEST

Checked at forty, which is where a thing that delights once starts to irritate.

What survives forty viewings: the sector layout, because it is static and the
same figure is in the same place every time. The breath, because it is 1.7 to
5.0 pixels on a 2 to 5 second period, which is under the threshold at which
motion demands attention and over the threshold at which it is invisible. The
hover lighting, because it is invited and it is 160ms.

What did not survive and was cut: the drifting loose barbs of `four.html`, at
twenty one sites at once, on every frame, forever. Delightful at one viewing.
At forty it is the screen fidgeting at you. The moult idea survives as a static
comb, which says the same thing and then stops saying it.

What I am watching: the deficit combs at alpha 0.13. On a profile where every
law is short, which is Tomas, the empty band between the tips and the rim is
the largest area in the figure and it is full of faint ticks. It reads as
correct at one viewing. If it reads as noise at forty, the combs come out and
the dotted spine stays.

---

## THE CODE

Ready to paste: `/home/user/MOB/proto/feather/wheel-core.patch.js`. It parses
inside `wheel.js`, verified by splicing it into a copy of the real file and
running `node --check`, not by reading it.

### The diff, against `atuned_src/ui/wheel.js`

| Lines | Was | Becomes |
|---|---|---|
| `:99` | `const CORE_STEP=[1.45,2.30,3.40]` | `[1.45,2.30]`, moved into the new block |
| `:253` to `:262` | `coreLayerA`, `coreOpen`, `CORE_LAYER_NM`, `coreResolved` | same four, with `coreOpen` iterating `CORE_STEP` instead of reading `coreLayerA(2)` from a literal |
| `:263` to `:291` | `coreFeather(a,len,wid,col,al)` | `coreFeather(a,r0,r1,wid,col,al,dens)`, hub based, with a tip mark, plus new `coreQuill` and `coreDeficit` |
| `:292` to `:322` | `coreInside(r,cr0)`, three layers | `coreInside(r,cr0)`, two layers, five rings, seat sectors, and 21 or 7 `HIT` entries |
| new | | `CORE_HUB`, `CORE_RIM`, `coreRad`, `CORE_SEAT`, `CORE_SLOT`, `coreSeatLoad`, `coreVib`, `coreBreath` |
| `:735` to `:744` | the law spoke block, inline | `lawSpokes(r,L,ink)`, called from the same place, fading over `1 - coreLayerA(1)` |

`coreOpen` reading `coreLayerA(2)` from a literal is worth naming on its own:
shortening `CORE_STEP` by one entry without fixing it returns `NaN` silently
and the core never opens. That is the same class of defect as a count typed
into a gate, which this repository has been bitten by five times.

### Two edits outside `wheel.js`

**`atuned_src/ui/ui.js:262`**, in `pointermove`, one line beside the existing
`S.hover` assignment, so the drawing knows which feather is under the pointer:

    S.hlaw = (h && h.k==='law' && h.core) ? h.j : null;

and the matching `S.hlaw=null;` in the `pointerleave` handler at `:270`.

**`atuned_src/ui/ui.js:47`**, in `describe()`, one branch before the existing
`h.k==='law'` branch, for the core's richer line. The existing branch stays and
still serves the spokes below the threshold.

### The checklist before it is committed

    ./atuned_src/BUILD.sh              parse, div balance, no em dashes
    ./atuned_src/BUILD-engine.sh       engine still host free, nothing added to it
    node tests/engine.js               untouched, this is all renderer
    node tests/functional.js           read the count off the run
    node tests/collide.js              must report the same plate and label counts
    node tests/design.js               gate 13 backdrop count and frame rate
    node tools/monitor.js              the Field's lit pixel floor
    node tools/shots.js OUT 1600 1000 && node tools/shots.js OUT 390 844

Then look at the images. The two that matter are the Field on a blank profile,
which should now be twenty one bare quills, and the Field at 390, where the
core should be pushing seven targets and not twenty one.

---

## THE QUESTIONS I CANNOT ANSWER

Asked rather than guessed, per the standing instruction.

**1. Vibrancy. What is the number?** He said the word and I had to choose. I
chose the charge sitting on the seat a law is seated at, inverted, because it
is the only per law quantity the engine already holds that is not the law's own
value. If vibrancy means conviction, or frequency, or how recently the person
acted on it, the engine does not hold any of those and each one is a new field
on the intake. **This is the single question most likely to change the design.**

**2. Does the triad leave the core?** I am removing three marks he has looked
at. They survive on the key strip above the wheel and on the whole Energy tab.
If he wants them kept inside the core, they need their own rings at their own
scale, which means two calibrations in one circle, which is the defect I am
removing. I would rather ask than assume.

**3. Does the law spoke ring go, or stay?** I have it fading as the core takes
over, which says the laws went inside. The alternative is to keep it permanently
as the always available copy and accept the same number drawn twice above zoom
2.30. His call.

**4. Should the core stop sizing by CQ once it is open?** Measured: the core
radius is 94.7 pixels at Tomas and 277.4 at Rosa, so the person with the least
coherence gets a chart 2.9 times smaller than the person with the most, on the
same twenty one marks. A chart that shrinks with its own reading hides the
worst readings. The core's size is his ruling and `DECISIONS.md` defends it, so
I have not touched it, but I think it is wrong once the interior is a chart.

**5. Is there a canonical order of the laws within a seat?** Inheriting the
shell's arcs fixes where each seat sits. It does not fix whether Truth,
Transparency and Justice run clockwise in that order inside the Throat. `SI`
order is the current answer and I do not know whether it is the book's.

**6. The seat distribution.** Three, three, three, four, four, two and two.
Heart and Solar get four laws each and Sacral and Root get two, so two of the
seven seats are drawn at half the resolution of two others. Is that the book's
distribution or an artifact? `BOOK-ERRATA.md` is the place it would be
recorded and it is not there.

**7. A different affordance on the two pointers.** A finger gets seven seats
and a mouse gets twenty one laws, because six of twenty one are under the tap
floor at 390 wide. Is that acceptable, or should both get seven so the product
behaves identically everywhere?

**8. The stated count.** The product has a stated user facing figure for the
addresses, 112, which differs from the arithmetic count, and the rule is that
only the stated figure is ever said. Does twenty one need a stated form of its
own, or is twenty one simply twenty one?
