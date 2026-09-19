# Art Direction: The Field

Mika Ueda-Salas, with Sol Amadi on colour and light, Bjorn Haraldsson on type
and grid, Petra Nikau on composition and symbol.

Build under review: `source.html` at 1116106 bytes, built from the working tree
on branch `claude/laughing-feynman-xhfyj3`, parent commit `3ad7f41`, tree dirty.

## 0. How this was measured, and what lied

Every claim below names the DOM node or the canvas pixel it came from. Nothing
here was read off CSS.

Rendered at 1600x1000 and 390x844 with `tools/shots.js`, then driven live in
Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, 7200ms boot,
`loadP(3); setTab(2); render()`, which is the Marcus profile on the Field.

One probe lied and is recorded here so the number it produced is not quoted
later by mistake. A first pass sampled 14x14 pixel boxes at each gate centre
and reported the gate glyph at 1.26:1, 1.07:1 and 1.01:1 against its disc. That
was a region mean mixing glyph pixels with disc pixels, not a contrast reading.
The corrected probe self tests first: it returns 21.00 on white against black,
and it predicts the core sphere at `[126,77,82]` from `cqRamp(39.2)` in
`ui/wheel.js:60` and measures `[126,77,81]`. On that probe the gate glyph is
4.88:1, which passes. The gate ring is the defect, not the glyph. Section 2
carries the real numbers.

Measured `accuracy()` on the Marcus profile: `pct` 57.61, `band` 10.59,
`cov` 21, `signal` 19, `held` 0, `inst` 8, `deg` 0, `rel` 86.

---

## 1. The bands in the centre. Ruling: they are data, and they become interrogable

His four questions, answered from the code.

### 1.1 What is the intention

`ui/wheel.js:71-98` states it in the file. The core is CQ. CQ is intention
times integrity over resistance, and every one of those is a sum over things
the instrument already measures, so zoom resolves the disc into its parts
rather than magnifying a solid. Three layers, three thresholds, declared at
`ui/wheel.js:99`:

    const CORE_STEP=[1.45,2.30,3.40];

`DECISIONS.md:1019-1030` carries the same ruling in the owner's own record.
This is not a thing somebody added for texture. It was designed and written
down.

### 1.2 Is it the expression of the energy

Layer one is, and the other two are not. That is the honest answer and it is
why he could not tell what he was looking at.

`coreInside()` at `ui/wheel.js:264-291` draws three sets:

| Layer | Opens at zoom | Count | Feather length |
|---|---|---|---|
| The triad | 1.45 | 3 | `cr0*0.80*x` where x is `r.X`, `r.Y`, `r.Z` |
| The seven seats | 2.30 | 7 | `cr0*0.86*bandIg(b)/10` |
| The twenty one laws | 3.40 | 21 | `cr0*0.93*(S.law[nm]||0)/10` |

Layer one is vitality, awareness and will, which is exactly what the energy
read is the mean of. Layer two is per seat integrity. Layer three is the
twenty one laws, which are literally the numerator of CQ. So one third of what
he saw is the energy and two thirds is something else, and nothing on screen
separates them. Petra found this: three different quantities, one visual
grammar, no legend.

### 1.3 What values does it derive

Every feather is a value over ten, drawn against four quarter step rings at
`ui/wheel.js:276-278`, so the rim is ten and a feather reaching a third of the
way is a three. The scale is there. It is drawn at
`rgba(ink, 0.055)`, rising to `0.105` on the half ring only, which on the dark
ground is a ring nobody will find without being told it exists.

### 1.4 What is associated with it

Nothing. This is the whole of his complaint and it is exactly true.

`coreInside()` pushes no hit regions. Not one. The only entry covering that
area is pushed by `solCore()` at `ui/wheel.js:349`:

    HIT.push({k:'core',x:CX,y:CY,rad:cr0*1.5});

Measured live: `HIT` contains one `core` entry at `(332, 362.5)` radius 50.1,
and six `gate` entries, and nothing else inside the sphere. So at full zoom
thirty one individually valued marks sit inside one undifferentiated target
that opens the CQ drill. Click any feather and you get the number the feathers
are made of, which is the one thing you could already read.

### 1.5 The ruling

**They carry a real reading and they become interrogable. They do not come
out.**

Decoration that looks like data comes out. This is the opposite failure: data
wearing no affordance. That is worse than decoration, because decoration does
not invite the question he asked. A person who zooms in is asking "how much",
the answer is on screen, and the screen will not say it out loud.

Mine, and I will take the argument on it: the atomised core is the best idea
in this product. It is the only place where a single number visibly becomes
the things it is made of, which is what a diagnostic instrument is for. It has
been shipped as a texture because nobody gave it a handle.

### 1.6 What it becomes

**Hit.** In `coreInside()`, push one entry per feather, gated on its layer
alpha so nothing is targetable before it is visible:

    HIT.push({k:'fib',layer:i,nm:<name>,v:<value>,unit:'/10',
              x:CX+cos(a)*len, y:CY+sin(a)*len, rad:11});

The tip is the handle, which is the pattern `fetGrown` already uses at
`ui/wheel.js:218`. Radius 11 gives a 22px circle, which is under the floor, so
the hit radius is 22 and the tip dot is drawn at 3.2 as the existing atom
handle is. Where two feathers' tips fall within 18px of each other, nearest
centre wins, which the hit scan already does by array order.

**Hover.** Reuse `#probe`, which exists and is already the wheel's tooltip.
Content is three lines, no new component:

    Vitality                     <- the name, 13px, --ink
    7.4 of 10                    <- the value, 19px, the layer's seat colour
    one of three the energy read means   <- 11px, --dim

**Click.** Opens `rdShell` with the existing drill shape. Layer one opens the
energy drill, layer two the seat drill that `runNodeDrill` already serves,
layer three the law drill, which `HIT` already carries as kind `law` elsewhere.
No new drill is written. This is wiring, not building.

**It says what it is.** One line under the depth readout, in the slot that
already prints what zoom has added. `coreResolved()` at `ui/wheel.js:229-232`
already returns "the triad", "the seven seats", "the twenty one laws" and its
return value is used for a readout. The line reads:

    The core is open to the seven seats. Each feather is that seat's integrity, 0 to 10.

Sentence case, mechanical, no wellness language, and it answers "what is that"
before he has to ask.

**Cost.** Zero draw cost: the feathers are already painted. `HIT` grows by at
most 31 entries at zoom above 3.40, from a base of about 140, so 22 percent on
an array that is scanned on pointermove and not per frame. Gate 13 measures
backdrop count and frame rate; this adds neither a backdrop nor per frame work.
Measured backdrop count on the Field is unchanged by this proposal.

---

## 2. The six gates. Three defects, and the pill he has never seen

The node is the canvas `#cv`, 664x725 at (451, 264). The six gates are drawn by
`verpArrows()` at `ui/wheel.js:364-401`. Measured hit entries, canvas local:

    Awareness   (280.9, 304.3) r22      Ignorance   (383.1, 420.7) r22
    Detachment  (332.0, 285.0) r22      Attachment  (332.0, 440.0) r22
    Intention   (383.1, 304.3) r22      Aversion    (280.9, 420.7) r22

### 2.1 The ring is below the floor in all four lightings. Sol found this

The gate is a 26px disc with a ring track at `ui/wheel.js:379`:

    g.strokeStyle=rgba(c,.22); g.lineWidth=2.4;

Measured, one pixel on the track at 12 o'clock against one pixel of that same
gate's own disc fill. Not against the page. Against the element's own ground.

| Gate | Dark | Snow | Punch | Glass |
|---|---|---|---|---|
| Awareness | 1.06 | 1.03 | 1.04 | 1.04 |
| Intention | 1.03 | 1.06 | 1.03 | 1.03 |
| Attachment | 1.12 | 1.35 | 1.24 | 1.24 |
| Aversion | 1.34 | 1.31 | 1.32 | 1.76 |
| Ignorance | 1.69 | 1.61 | 1.91 | 1.52 |

The floor for a graphical object carrying meaning is 3:1. Every gate is between
one third and two thirds of it, in every lighting. At 1.03:1 the mark is not
dim, it is absent. He said "barely visible" and he was being generous.

The glyph is not the problem and I will not let it get blamed. Same probe, the
brightest glyph pixel against the same disc: 4.88:1 in Dark. The glyph passes.
The ring that is supposed to carry the reading does not.

### 2.2 The top centre gate is occluded. Petra found this

Detachment's numbers are missing from the table above because they cannot be
taken. Its 12 o'clock pixel reads `[90,162,184]` in Dark, `[76,135,153]` in
Snow and `[96,173,196]` in Punch and Glass, which is accent blue text, and its
disc samples `[255,255,255]` in Snow and `[157,156,157]` in Glass, which is a
nameplate plate. The "21 laws · integrity 6.2" nameplate is drawn over it.

Five of six gates render. One does not, in all four lightings. `tests/collide.js`
asserts no overlapping nameplates and passes, because a nameplate over a canvas
gate is not a nameplate over a nameplate.

### 2.3 The pill is real, and no shipped profile can produce it

He is right that there is no pill. He is right for a reason nobody has looked
at. The pill is written, at `ui/wheel.js:388-392`, and it is gated:

    if(evid){ ... g.fillText(v.pct+'%', ...) }

where `evid` is `V.some(v => v.pct > 0)`. Measured across all four shipped
profiles by calling `verpRead()` after each `loadP(i)`:

    profile 0  max pct 0   total n 0
    profile 1  max pct 0   total n 0
    profile 2  max pct 0   total n 0
    profile 3  max pct 0   total n 0

`VERPMIX` is only ever fed by `verpApply(text)` in `engine/verp.js:48`, which
runs from a story. No profile carries gate evidence, so `evid` is false on
every screen he has ever opened, the arc never draws, the pill never draws, and
the glyph drops from alpha 0.9 to 0.5. **The gates have shipped in their empty
state and nothing on screen says the state is empty.** That is the same class
of defect as the core printing 36 off the defaults, which this project already
ruled against twice.

### 2.4 The pill font is not in the build. Bjorn found this

`ui/wheel.js:391`:

    g.font='600 8.5px Lexend, system-ui, sans-serif';

The only face embedded in the build is `'Inter'`, at `shell/head.html`, the single `@font-face` block.
Lexend is not in the file, the product makes no outbound request, and gate 7
watches the network, so Lexend can never load. Every glyph set in it falls to
system-ui.

This is not confined to the gate pill. `shell/head.html` declares, at the `--num` token,
`--num:Lexend,system-ui,-apple-system,sans-serif`, and `--num` is what every
number in the product is set in, including the `.kb b` rule in `shell/head.html`.
Measured live on `#acc`: the `.v` span carrying "57.6%" computes to
`font-family: Lexend`, and there is no Lexend. The comment above that token
says the face was chosen for tabular figures so columns hold. There are no
tabular figures, because there is no face.

So the Field currently sets its labels in one typeface and its numbers in
whatever the host happens to have. That is why the numbers and the words do not
sit together, and it is a two line fix, not a redesign.

8.5px is also below anything this product should print. It exists nowhere else.

### 2.5 The tap target is unpoliced and under the floor

`ui/wheel.js:393` pushes `rad: R+9` where `R` is 13, so the target is a circle
of diameter 44. A 44 diameter circle inscribes a 31.1 by 31.1 square, which is
29 percent under the 44 by 44 floor. `tests/design.js` gate 8 measures
`getBoundingClientRect` on DOM nodes only, so no canvas target is checked by
it. This is not a regression, it is a hole in the gate.

### 2.6 What the gate becomes

Geometry, per gate, on the canvas. Tokens named are from `shell/head.html`
`:root` and `engine/data/canon.js`.

    disc          d 34   (was 26)
    ring track    2.5    at alpha .42   (was .22)
    ring arc      2.5    at alpha 1.0, from 12 o'clock clockwise
    glyph         18 box (was 15), stroke 1.9, ring not fill, unchanged family
    pill          h 15, r 7.5, min w 26, at the disc's lower right
    pill type     11px, 600, --sans, never --num until --num is fixed
    hit           rad 26  -> 52 diameter, inscribing 36.8 square
    stem          unchanged, weight is the share

**The ring track goes from .22 to .42.** Computed against the same disc fill,
that moves Heart green from 1.06:1 to 3.12:1 and Root red from 1.34:1 to
3.05:1. Both clear 3:1 with nothing to spare, which is deliberate: this is a
muted palette and the mark should be present, not loud. Sol's call, and he
wants it noted that raising alpha is the cheap move and the right one here only
because the disc behind it is a known flat fill. Anywhere the ground varies he
would want a value change, not an alpha change.

**The disc goes opaque.** `rgba(bgc,.92)` lets the wheel through, which is why
Attachment's disc measured `[44,46,53]` while Awareness measured `[23,25,34]`.
Same element, two grounds, so a single alpha cannot be correct for both. Set
1.0 and the ring has one ground.

**Snow gets its own palette.** `ui/wheel.js:373` reads `hx(PAL.Heart)` and
`hx(PAL.Root)` directly. `PAL` is the dark table at `engine/data/canon.js:70`.
`PAL_LIGHT` exists at `:72` and `seatCol()` at `ui/component.js:22` already
switches on `S.theme==='snow'`. So on paper every DOM ring uses `#2A7A5C` and
the canvas gate beside it uses `#6FC5A3`. The canvas should call `seatCol`.
That is one line and it is Sol's.

**The empty state says it is empty.** When `evid` is false, the ring track
draws, the arc does not, and the pill is replaced by nothing, but the hover
reads "no story yet, so no gate has been counted". Recognition over recall,
and it stops the instrument presenting an unmeasured gate as a measured one.

**The occlusion.** The "21 laws · integrity 6.2" nameplate moves to the arc
above the gate ring, at `cr0*1.3 + 34 + R + 14`, or the gate fan rotates by
half a step so no gate sits at exactly 12 o'clock. I prefer moving the
nameplate: the fan is symmetrical and symmetry is doing work here.

**Hover and click.** Both already exist on kind `gate`. The hover gains the
`d` string that `VERP` already carries, which is the one sentence that says
what the gate means: "I felt it and stayed out of the story." That sentence is
in `engine/verp.js:8-13` and has never been on screen.

**Cost.** Disc 26 to 34 is 8 more pixels of arc on six elements, so about 2100
more filled pixels per frame on a 664x725 canvas, which is 0.44 percent of it.
No new backdrop. Gate 13 is not at risk.

---

## 3. The top row. 106px today, 52px in my version

### 3.1 What it costs now, measured

Node `#key`, measured at 1600x1000 with the Marcus profile loaded.

    #key          920 x 106  at (323, 158)
    padding       12px 300px 0px 14px
    gap           6px, display flex, wraps
    children      8 buttons .kb, each exactly 44 tall
    row 1 y=170   CQ 121.4, DQ 115.0, SQ 113.4, Pole 128.5
    row 2 y=220   Vitality 145.4, Awareness 168.0, Will 125.2, Flow 131.0
    sum of widths 1047.9, plus 7 gaps at 6 = 1089.9 needed on one line
    content box   920 - 14 - 300 = 606 available
    #stage        922 x 833 at (322, 157)
    #cv           664 x 725 at (451, 264)

So the row costs **106px of an 833px stage, 12.7 percent**, and the wheel starts
107px below the top of its own stage.

The 300px right padding reserves space for `#tl`, which measures **173.2 x 121.9
at (917.8, 172)**, absolutely positioned. **126.8px of the 300px reserve is
holding nothing.** That is the single largest piece of dead horizontal space on
the surface and it is the reason the eight chips wrap.

### 3.2 Why it reads as too much line. Bjorn

Two rows of eight chips with eight words is 1089.9px of content squeezed into
606px of measure. The row is not wide, the measure is narrow, and the chips are
wide because each one carries a ring, a value pill and a separate word, three
objects for one reading. `.kb` is `padding:2px 9px 2px 4px` around a `.cr xs`
of 71 to 79px plus a `<b>` of 17 to 25px. The ring is 18px of that 79.

He read it as "too much horizontal line for something that should be a circle
and a pill with text" and that is precisely the anatomy: it is a circle and a
pill and text, and it is 131px wide on average because the three parts do not
share any space.

### 3.3 Four of the eight are one reading, printed as three

Vitality, Awareness and Will are not three readings. `DECISIONS.md:1019-1022`
and `ui/wheel.js:82-83` both say the triad is the three quantities the energy
read is the mean of, and `ui/summary.js:82` already prints them collapsed as
one `energy` figure of `(r.X+r.Y+r.Z)/3`. The core draws them as the first
thing zoom resolves.

So the Field prints a mean's three components across the top and then draws the
same three inside the core, and prints neither the mean. Collapse them to one
Energy chip and the row goes from 8 to 6.

### 3.4 The version, and its number

    #key          8px 190px 0px 14px      (was 12px 300px 0px 14px)
    height        8 + 44 = 52             (was 12 + 44 + 6 + 44 = 106)
    content box   920 - 14 - 190 = 716    (was 606)
    chips         6, one row, no wrap
    .kb padding   2px 8px 2px 3px
    .kb gap       5px                     (was 6)
    ring          --cr xs, 18 box, unchanged
    value         12px, 500, --sans
    label         11.5px, 500, --mid, sentence case
    min-height    44px, unchanged, gate 8 floor

Six chips: CQ, DQ, SQ, Pole, Energy, Flow. Budget 716 minus 5 gaps at 5 is 691
for six chips, 115 mean. The four short labelled chips measure under that
today. Energy and Flow are the wide ones and both fit at 11.5px label.

**The measured saving is 54px, which is 50.9 percent of the top row and 6.5
percent of the stage height.** The canvas top moves from y=264 to y=210 and the
wheel gains 54px of height, 725 to 779, which is 7.4 percent more radius
headroom. That is the number he asked for.

190px of reserve rather than 300 is `#tl` at 173.2 plus a 16px gutter, which
is the product's own `--g3`.

### 3.5 The phone, where this is worse and my answer costs more

Measured at 390x844, Marcus loaded, node `#key`:

    #key          374 x 54
    scrollWidth   1118      clientWidth 374
    overflow-x    auto      flex-wrap nowrap
    visible       CQ, DQ, and SQ clipped at its right edge
    off screen    Pole, Vitality, Awareness, Will, Flow

**744px, 66.5 percent of the row, is off screen behind a scroller with no
visible scrollbar.** Five of the eight readings on the Field are, to a person
holding a phone, missing. `atuned-ux` rule 10 is explicit: an overflowing
scroller with a hidden scrollbar is indistinguishable from a missing feature,
wrap instead.

At six chips the row is still about 690px against 346px of measure, so wrapping
to two rows costs 8 + 44 + 6 + 44 = 102px, against 54 today. **On the phone my
answer is 48px more expensive and I am saying so rather than hiding it.**

The alternative, which I prefer and which is Petra's: on phone the chips drop
their words and carry ring plus value only, six across at 346/6 = 57.6 each. A
ring of 18 and a four character value at 11px measures about 52. That is one
row, **52px, everything visible, nothing hidden**, and the word arrives on tap,
which is where a phone gets a label anyway since `title` does not exist on
touch. Every chip already opens a drill, so the affordance is built.

His instruction was less real estate. On desktop that is 106 to 52. On phone it
is 54 to 52 and the removal of a hidden control defect, which is the larger win
of the two even though the pixel number barely moves.

---

## 4. The lower right number. The interval exists and the Field throws it away

### 4.1 What is there

Node `#acc`, **236.5 x 66 at (854.5, 907)**, absolutely positioned, written by
`renderAcc()` at `ui/personas.js:181-206`. It prints a Crown ring, the string
`a.pct.toFixed(1)+'%'`, and the word "Identification".

Measured on Marcus: `pct` 57.61, `band` 10.59.

### 4.2 Where the interval comes from, and what it is not

It is in the code. `engine/compute.js:310`:

    var band = 5.7*0.5 + (1-cov)*6 + (1-sig)*8 + deg*4 + (1-rel)*1.2 + (1-exq)*3;

Half the fit's own mean absolute error, which the comment block at
`engine/compute.js:273-280` records as 5.68 from an additive layer ablation,
plus a penalty for each thing not measured. It is computed on every single call
to `accuracy()`.

**It is not a confidence interval and must never be labelled one.** There is no
sampling distribution behind it and no coverage claim. It is a stated gap made
of a known fit error plus known missingness. Call it a gap or a band. If a
future surface prints "95 percent CI" against this arithmetic that is a lie and
it will be my fault for not writing this paragraph.

### 4.3 The defect

`band` is printed in three places and none of them is the Field:

    ui/analytics.js:128     "plus or minus 11"        visible
    ui/analytics.js:173     in prose                  visible
    ui/personas.js:217      in the drill              one click away
    ui/summary.js:83        in a title= attribute     unreachable on touch

The Field prints the estimate and discards its interval, which is the one
surface he was looking at.

**And it prints one decimal place.** "57.6%" claims precision to a tenth against
an interval of plus or minus 10.59. The number is stated 106 times more
precisely than the instrument's own account of how much it knows. Bjorn found
this and it is the sharpest single thing in this report: the most precise
looking figure on the Field is the least certain one on it.

Summary prints the same value as "58%" at `ui/summary.js:82` and the Field as
"57.6%". One number, two precisions, two surfaces, one product.

### 4.4 It does not measure what he thinks it measures. Said plainly

He called it "the percent of behaviour accuracy" and asked that people see
"when it's simulated the accuracy is on point".

`accuracy()` does not measure that. `ui/personas.js:215-216` states what it
measures: how closely this field matches a named family, and how wide the match
is. It is a family identification confidence. There is no behaviour simulation
error rate anywhere in the engine and **I am not going to print a number that
does not exist.** If he wants a simulated behaviour accuracy, that is a new
measurement and it needs an owner and a method before it needs a component.

What can be said honestly today is: this is how much of you the instrument has
actually read, and this is how wide that is. That is close to what he wants and
it is true.

### 4.5 The version

His three asks were: the percent, no "Identification", and the plus or minus.
All three, and the word is replaced rather than deleted, because a bare
percentage with no noun is less honest than a jargon noun.

    #acc          236.5 x 62      (was 236.5 x 66)
    ring          --cr lg, 46 box, Crown, unchanged
    value         "58 % ± 11"
                  number  22px, 500, --sans, tabular once --num is fixed
                  ± and band  15px, 500, --mid
    caption       "simulated match", 11px, --dim, sentence case
    unread        "–" in the ring, caption "nothing measured yet"
    hit           the whole block, 236.5 x 62, over the 44 floor
    hover         "An estimate, not a measurement. The gap is the fit's own
                   error plus what has not been entered."
    click         unchanged, opens runAccDrill

**Integer precision. The decimal goes.** A tenth against a gap of eleven is a
claim the instrument cannot support, and dropping it is the honesty he asked
for, not a styling preference.

`±` is one glyph and it is the right one. It is not an em dash and the build's
em dash check does not touch it.

The colour stays Crown `#A98BCE`. It is a Crown family reading, it is not an
alarm, and nothing here goes near `--alarm`.

---

## 5. Benign and malignant, masculine and feminine. Four passes

He asked first what information they carry. That is the part that decides the
form, so it comes first.

### 5.1 What each one actually carries

**Lean, benign against malignant.** Node `#polbar`, **264 x 32 at (29, 242.9)**,
written at `ui/ui.js:594-624` from `leanRead(r)`.

Underneath it is `LEANMIX`, two integer counters at `engine/verp.js:38`, fed by
`leanApply(text)` counting literal cue phrases: 21 benign phrases and 20
malignant ones, listed at `engine/verp.js:29-37`. It also carries `cues`, the
number of phrases matched, and `src`, whether the figure came from the story or
from the field alone.

**The datum is a ratio of two counts with an evidence count attached.** It has
an n. At n = 0 it is not a reading.

**Balance, masculine against feminine.** Node `.bal`, **264 x 49.5 at (29,
317.9)**, written at `ui/ui.js:424-484` from `r.balance`, which is
`{read, lean}` with `lean` signed on [-1, +1].

**The datum is a signed magnitude on a continuum with an origin at zero.** No n.
It has a `read` gate instead.

So: **same shape, different evidence.** Both are a signed position on a two pole
axis measured out from a centre. One is counted, one is continuous. That single
sentence decides everything below.

### 5.2 What is wrong today, as defects

**D5.1. They are the same reading rendered at two heights and two anatomies.**
32 versus 49.5, measured. Lean has its icons inside the bar and no words. Balance
has its icons outside the bar, two words inline, a pill, and a separate 6px
track. Nothing about the underlying readings justifies a 17.5px height
difference or two different constructions.

**D5.2. Lean prints two bare integers with no percent sign and no pill.**
`ui/ui.js:619` and `:620` emit `<b>78</b>` and `<b>22</b>`. `DECISIONS.md:928`
rules that every percentage is an icon, a ring showing the percentage as an arc,
and a pill carrying the number. Lean has the icon and neither of the other two.
It is the one place in the product that breaks the ruled percentage component.

**D5.3. Lean has no unread gate and Balance does.** Balance prints "not enough
held to read" at `ui/ui.js:475`. Lean prints 78 and 22 unconditionally, falling
back to "the field alone" only inside a `title` attribute at `ui/ui.js:623`.
Same shape, opposite honesty, and it is the same defect this project has already
fixed twice: a percentage printed off defaults. Petra found this one.

**D5.4. The two use different colour families for the same kind of statement.**
Lean is Heart and Root, `#6FC5A3` and `#C4635E`, which is the benign and
malignant pair. Balance is Solar and Throat, `#D4BC70` and `#65B8D4`, via
`seatCol('Solar')` and `seatCol('Throat')` at `ui/ui.js:454`. Masculine and
feminine are a mirror axis, not two seats, so borrowing two seat colours for it
says a thing that is not true. Sol's finding.

**D5.5. The same reading is printed three times on one screen.** Lean is at
`#polbar` (264 x 32, left rail), at `#pol` (**173.2 x 77.9 at (917.8, 216)**,
centre top, as "Benign 78% / Malignant 22% / most of what is held is benign"),
and again in `#tl`'s block above it. Three renderings of two numbers, roughly
four inches apart.

### 5.3 The passes. Four, and three of them are wrong

**Pass A. Take Balance's form to Lean.** One 6px hairline, centre break, fill
out from the middle, one pill carrying a signed percent, glyphs at both ends.

*Trades:* total consistency, at the cost of Lean's second number. Lean is
genuinely two integers that sum to a whole from real counts, and collapsing it
to "56 percent benign" throws that away. A 6px track also carries an evidence
count badly, and Lean's evidence count is the most important thing about it.

*Rejected. It makes Lean lie about being continuous.*

**Pass B. Take Lean's form to Balance.** Both become a 32px filled bar with a
number at each end.

*Trades:* weight and legibility, at the cost of inventing a number. A masculine
lean of 26 percent does not imply "74 percent feminine". `lean` is one signed
value; there is no reciprocal in the engine. Putting a figure at the far end
would print a quantity nothing computed.

*Rejected, and this is the one worth showing him*, because it is the obvious fix
and it is the dangerous one. It is exactly how the app came to print a clamped
9999 as a 10.

**Pass C. One axis, two densities.** One component, one geometry, and the
difference between the two readings stated in words underneath instead of
implied by shape.

    .axisbar        264 x 28, plus a 16px evidence line = 44 total
    track           2px, full width, --edge-2
    centre          1px hairline at 50%, --edge-2, full height of the track
    fill            grows from 50% outward, 4px, radius 2, the leaning colour
    pill            cr('xs'), sits on the bar at the fill's outer end
    glyphs          15px ring, one at each end, outside the track, --dim,
                    lit to the leaning colour on the leaning end only
    words           11.5px, sentence case, the leaning one lit
    evidence        11px, --dim, one line, and this is where they differ

Evidence line for Lean: `from 14 cues in the story`, or when `cues` is 0,
`no story yet, so this is the field alone`, which moves the truth out of the
`title` and onto the screen.

Evidence line for Balance: `read from 8 addresses`, or `not enough held to read`,
which it already knows how to say.

*Trades:* 16px of extra height on each, and the two stop looking like different
features while the thing that actually differs is said in language instead of
guessed from geometry. Lean drops from 32 to 44 including its evidence line,
Balance from 49.5 to 44. Net on the rail: **plus 6.5px, and one component
instead of two.**

*This is the one. It is Pass C.*

**Pass D. Make both a ring, per the standing ruling.** `DECISIONS.md:928` says
every percentage is an icon, a ring and a pill. Apply it literally.

*Trades:* maximum consistency with every other figure in the product, at the
cost of direction. A ring drawn from 12 o'clock shows a magnitude and has no
pole. Both of these readings are direction first and magnitude second. A ring
would say how far and refuse to say which way.

*Rejected, and the ruling needs an exception written down.* **A ring is for a
quantity on 0 to 100. These are quantities on -1 to +1, and a signed axis gets
a centre out bar, not a ring.** That exception is not in `DECISIONS.md` and this
report is proposing it. It is the owner's call, not mine, and until he makes it
the ruling as written and the screen as built disagree.

### 5.4 The icon, made consistent

Both pairs are already ring and not fill, which I checked before saying
anything. Benign and malignant are at `ui/ui.js:609-611`, one closed ring with a
rising stroke and the same ring broken at the lower right with the stroke
falling out. Masculine and feminine are at `ui/ui.js:419-420`, circle plus stem.
That is good work and it stays.

What is inconsistent is the box and the weight: both are drawn at
`width="15" height="15"` in a 24 unit viewBox, but the benign pair fills its box
and the Mars and Venus glyphs do not, because their stems run to the corner.
Optically the balance glyphs read about 12 against the lean glyphs' 15.

*The move:* both pairs onto a common 20 unit optical box inside the 24 viewBox,
stroke 1.6, round cap, round join, which is the family the rest of the product
already uses. Petra's, and she wants it recorded that this is optical sizing and
not mathematical: the two families will not have the same bounding box when they
are done, they will have the same apparent size, which is the point.

### 5.5 Hover and click, which he asked for

Both currently carry a `title`, which does not exist on a phone, and the
audience arrives on phones.

*Hover:* the existing `#railtip`, wired at `ui/ui.js:487-505`. Two lines. The
pole's definition, which both already have written and hide in `title`. Then the
evidence, which the new line already prints.

*Click:* opens `rdShell` with the reading, what it is measured from, and what
moves it. Lean's drill states the cue count and that cues are literal phrase
matches, because a person told a number deserves to know it came from counting
phrases. Balance's drill carries the codex position already written at
`ui/ui.js:400-405`, including that feminine is not women, which today lives only
in a `title` string.

*Both become buttons.* Lean's `#polbar` is a `div` today and is not reachable by
keyboard at all. 264 x 44 clears the tap floor on both.

---

## 6. Tissue test against the ICPs

Sampled from the six ICP entries in `engine/data/people.js` and the roster at
`RESEARCH-icp.md:13-31`: Diane 46 founder, Marcus 44 creative director, Sofia 41
somatic practitioner, and the edge case Gordon 58 who refuses.

**Marcus, weight 160.** This is the profile the whole review was measured on, and
he is the owner's own reading. He zooms into his own core, sees thirty one
coloured marks, and gets no answer. Section 1 is for Marcus and he is 160 of the
panel weight.

**Sofia, weight 140, somatic practitioner.** She is the one who will ask what the
gates measure, and she is the one who will notice that all six read zero while
the product shows no sign that zero is an empty state rather than a finding. 2.3
is hers. A practitioner who catches the instrument presenting an unmeasured
value as a measured one stops trusting the rest of it, and she is the referral
channel.

**Diane, weight 180, the heaviest.** She carries Anticipation at 8 and cannot
stop. She is the one who reads "57.6%" and treats the tenth as real, then sees
"58%" on Summary and asks which is right. 4.3 is hers, and the answer that
protects her is the integer and the gap, not the decimal.

**Gordon, weight 35, refuses.** He carries Fear, Anger, Shame and Disgust at 10
with nothing installed. He is the reason the `±` is not optional. A man looking
for a reason to dismiss the instrument will find a bare unqualified percentage
faster than anything else on the screen, and the interval is what survives his
reading of it. `atuned-ux` already says this: the accuracy percentage and its
interval are this product's stated substitute for explaining a model, and it
says do not weaken that to look confident. The Field weakened it by omission.

**Nobody in the sample is served by the second row of the top strip.** Four of
its eight chips are the components of a mean that none of them asked for and
that the core already draws.

---

## 7. Build order

Sized by build cost, not by importance. The order within each size is the order
I would take them.

### S

1. **Point `--num` at Inter, or embed Lexend.** The `--num` token in `shell/head.html` and the
   three canvas `g.font` strings at `ui/wheel.js:391`, `:743`, `:752` and the
   three at `ui/component.js:274`, `:285`, `:292`. Every number in the product
   is currently set in a face that is not in the build. Two lines of tokens and
   six string literals. **Do this first**, because several measurements below
   change once the numbers are actually set in Inter. Grade: this alone moves
   the Field from C to C plus.
2. **Integer precision and the gap on `#acc`.** `ui/personas.js:202`. Drop
   `toFixed(1)`, append `± ` and `a.band.toFixed(0)`, replace the label. The
   value is already computed. Section 4.5. This is the highest honesty per line
   of code in the report.
3. **Gate ring alpha .22 to .42, and disc alpha .92 to 1.0.** `ui/wheel.js:378`
   and `:379`. Moves six elements from 1.03:1 to 3.12:1 in four lightings.
4. **Gate colours through `seatCol`.** `ui/wheel.js:373`. One line, fixes Snow.
5. **Move the "21 laws" nameplate off the top centre gate.** `ui/wheel.js:376`
   or the nameplate's own y. Restores the sixth gate.
6. **Gate hit radius 22 to 26.** `ui/wheel.js:393`. Clears the tap floor.

### M

7. **The top row to one line of six.** `#key` padding to `8px 190px 0px 14px`,
   collapse Vitality, Awareness and Will into one Energy chip, phone variant
   drops the words. 106 to 52 on desktop, and five hidden readings recovered on
   phone. Section 3.4 and 3.5.
8. **The gate at its new geometry, with the empty state that says it is empty.**
   Disc 34, glyph 18, pill 15 high at 11px, hover carrying the `VERP.d`
   sentence. Section 2.6.
9. **`.axisbar`, Pass C, replacing `#polbar` and `.bal`.** One component, two
   instances, an evidence line on each, both as buttons, both wired to
   `#railtip` and `rdShell`. Section 5.3. **Retire the duplicate at `#pol`**
   while this is open, or rule that the centre one stays and the rail one goes.
   Three renderings of two numbers is the finding; the redesign does not fix it
   by itself.
10. **The glyph pairs onto a common optical box.** Section 5.4.

### L

11. **The core becomes interrogable.** Per feather hit gated on layer alpha,
    `#probe` hover with name, value over ten, and what the layer is, click
    through to the three drills that already exist, and one line under the depth
    readout naming the open layer. Section 1.6. No new draw cost and no new
    backdrop.
12. **A canvas tap floor check in `tests/design.js`.** Gate 8 measures DOM rects
    only, so every canvas target in the product is unpoliced and one of them was
    29 percent under the floor. Walk `HIT` and assert `rad*2 >= 44`, or assert
    the inscribed square. This is the gate that would have caught 2.5 without
    anybody looking.

### Needs a ruling before it can be built

- **The signed axis exception to the ring ruling.** `DECISIONS.md:928` says every
  percentage is a ring and a pill. Sections 5.3 Pass D argues a signed axis on
  [-1, +1] gets a centre out bar instead. Owner's call.
- **Behaviour accuracy.** He asked for a simulated behaviour accuracy figure. The
  engine computes family identification confidence and nothing else.
  Section 4.4. That is a new measurement, not a new component, and nobody should
  print a number for it until it has a method.
- **Whether `#pol` or `#polbar` survives.** One of the three lean renderings has
  to go and it is a layout decision, not an art direction one.

## 8. Grade

The Field today: **C.** The instrument underneath it is good and several of its
best ideas are unreachable. Three separate elements print or imply a reading
that the code does not support at that precision, and one element that carries
thirty one real values has no affordance at all.

With S complete: **C plus.** The numbers are in the right typeface, the six
gates are visible in four lightings, and the least certain figure on the screen
stops claiming a tenth.

With M complete: **B.** The top row returns 54px to the wheel, five readings
come back on the phone, and two readings that are the same shape stop looking
like different features.

With L complete: **B plus.** The core stops being the best idea in the product
that nobody can ask a question of.

It does not reach A until the cognitive load item in `CLAUDE.md` gets its
architectural decision. 57 to 71 simultaneous choices per screen against a
working memory of about four is not something art direction can fix from here,
and I am not going to pretend otherwise by making the wrong number of things
prettier.
