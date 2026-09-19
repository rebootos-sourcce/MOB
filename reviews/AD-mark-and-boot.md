# The Mark And The Boot

Art direction, animation direction and design direction, one room, one call.
Written against the build at `source.html`, 1,174,265 bytes, driven in Chromium
1194 at 1600x1000 and 390x844.

Every number below names the DOM node it came from. Three of my own probes
lied during this pass and I say where, because a tool that lies is worse than
no tool.

Render the proposals: `reviews/mark-proposals.html`. One file, no network,
Inter embedded. Open it and press play.

---

## 1. What Is Actually There

### 1.1 How I Measured It

Screenshot timestamps drift. My first capture asked for a frame at 0ms and
took it at 297ms, asked for 200 and took it at 706, because the screenshot
call itself costs 200 to 400ms. Those PNGs are not evidence of timing and I
discarded them for that purpose.

The timing below comes from a `requestAnimationFrame` loop injected before
document load that records `performance.now()` the first frame each node
crosses `opacity > 0.02`, read from `getComputedStyle`. Four runs, two
viewports. The geometry below comes from a separate run where every
`document.getAnimations()` entry is paused and seeked, so the frame is exact
rather than sampled.

### 1.2 The Timeline, As A Stranger Meets It

| t | What the node does | Node |
|---|---|---|
| 43 to 53ms | the sheet is in the document, opaque black | `#boot` |
| 143 to 227ms | the app underneath is built and usable | `#tabbar` has 8 children |
| 736 to 868ms | one blue dot, 27px across, appears | `.b-core` |
| 1,286 to 1,383ms | the first seat arrives | `.b-s1` |
| 1,619 to 1,711ms | the way out is finally offered | `.boot-skip` |
| 3,335 to 3,431ms | the halo arrives | `.b-halo` |
| **3,652 to 3,752ms** | **the first word of any kind appears** | `.boot-wm` |
| 4,719 to 4,852ms | the sheet begins to fade | `#boot` opacity drops below .99 |
| 5,269 to 5,403ms | the node is removed | `document.getElementById('boot')` returns null |

The audit's 4,776ms is the fade *start*, not the clear. The clear is 5,287ms
at 1600 and 5,269ms at 390, averaged over four runs. The audit understated it
by half a second.

The honest sentence: **the app is usable at 200ms and the sheet holds a
stranger away from it for 5,287ms, and for the first 3,727 of those there is
not one word on the screen.** Between 868ms and 1,286ms there is exactly one
blue dot and nothing else. That is 418ms of a single dot, on black, with no
skip line, on a first run.

A number that surprised me: `.boot::before` is a second opaque black layer at
`z-index:2` above every child, animating out over .46s at a .34s delay. So
the first 800ms of a five second sheet are black by construction. That is
defensible as a title bookend and indefensible as four fifths of a second
spent before a first time visitor sees anything at all.

### 1.3 What The Mark Currently Is

Seven filled circles of radius 4.2 to 5.4 on a 1.4px hairline spine, a 1.6px
circle of radius 62, twenty four 1.5px tick marks around it, a 9 unit filled
disc at the centre, and a 39 by 13.2px ellipse floating 68px above the ring.

Five defects, each measured on the named node at t = 5,000ms with the
animations paused.

**1. The heart is never visible.** `.b-s4` is 16.2px of `#6FC5A3` and sits
entirely inside `.b-core`, which is 27px of `#7EB8D4` and is painted after it.
A bounding box containment test returns true on all four edges. In a product
about the body, the one seat that is permanently hidden is the heart.

**2. The seats do not overshoot their size, they overshoot their position.**
`.b-seat` carries `transform-origin:100px 100px`, which is the centre of the
viewBox and not the centre of each circle. At the 60 percent keyframe, scale
1.5, the root seat at cy 160 is thrown to cy 190. Measured on screen at 1600:
the root seat's painted centre moves from y 557 to y 608, a 51px radial
excursion. The stylesheet comment says "each one overshooting its size and
settling back". It is not doing that. It is a defect of solid drawing, because
for 660ms the seats do not sit on the geometry the field uses.

**3. The halo is not gold.** `.b-halo` computes to `rgb(126, 184, 212)`, which
is `#7EB8D4`, the blue accent, because `--gold` has been an alias for
`--accent` since the accent was ruled blue. The token named `--au` is the real
gold and nothing in the boot reads it. The owner asked for a golden hue. The
file already contains the gold and the boot is asking for the wrong name.

**4. The boot wordmark and the header wordmark are two different marks.**
`.boot-wm .bn` has `text-transform:none` and renders "Atuned". `.brand .bn`
has `text-transform:uppercase` and renders "ATUNED". Measured widths:

| | name | subtitle | apart |
|---|---|---|---|
| header `.brand` | 85.17px | 85.17px | 0.00px |
| boot `.boot-wm` | 88.00px | 60.97px | **27.03px** |

The header was re-tracked for the uppercase mark and the boot was not. The
boot's umlaut is still at `left:.055em` and `left:.35em`, the pair placed
against a lowercase u, while the header's pair was re-measured against the
capital and sits at `.116em` and `.488em`. The boot is frozen at a state the
rest of the product left.

**5. The sheet is pointer transparent and the skip fires anyway.** `.boot`
carries `pointer-events:none`. I clicked the Compass tab's coordinates while
`document.getElementById('boot')` was still truthy. A capture phase listener
recorded the target as `SPAN.n` with text "Compass", inside `#tabbar`, and the
app navigated to Compass while the overture was still on screen. So "press
anything to go straight in" also presses whatever is under the pointer. A
stranger who dismisses the overture lands on a surface they did not choose.

### 1.4 The Two Non Visual States

**No JavaScript.** Verified with `javaScriptEnabled:false`. The sheet plays
the full overture on its CSS `forwards` fill and goes `visibility:hidden` at
5.20s, uncovering the `.nojs` notice. The mechanism is correct. The number is
not: the one message that fixes a dead preview pane is held back for 5.2
seconds.

**Reduced motion.** Verified with `reducedMotion:'reduce'`. `if(rm)clear()`
runs synchronously in `panels.js`, so `#boot` is gone and `body.booted` is set
before 1,000ms. Somebody who asked the machine to stop moving currently sees
no mark, no name and no title card at all. They asked for no motion. They did
not ask for no identity.

### 1.5 Cost Today

Boot markup 3,069 bytes and boot CSS 3,741 bytes with comments stripped,
6,810 total, 0.58 percent of the file.

I do not quote a frame rate for the current boot. My rAF counter measured
between 45.8 and 59.9 fps across four runs, and the spread is the counter
contending with the screenshot driver rather than the boot's real cost. That
is a probe I would not stand behind, so I am not reporting it as a number. I
report instead the structural fact, which is deterministic: the current boot
animates `stroke-dashoffset` on 25 separate nodes, `.b-ring` plus the 24
`.b-addr line` elements. `stroke-dashoffset` is a paint property. Twenty five
nodes repaint every frame for 1,550ms.

---

## 2. The Fundamentals, Applied And Named

He asked for these by name. Here is which of them are load bearing on this
mark, which I am spending real milliseconds on, and which I am dropping.

### 2.1 The Ones I Am Spending

**Timing.** The single most load bearing one and the whole defect. The current
sequence spends 3,727ms before the first word. The new one spends 120ms before
the first ink and 1,180ms before the first word. Nothing else in this document
matters as much as those two numbers.

**Staging.** One thing at a time in the order the eye should take it, and the
order is the argument. The current boot goes root to crown, bottom to top,
which says "a ladder". The product says the field is harmonic and centred. The
new order goes **heart first, then outward in mirrored pairs**. Three stagger
steps instead of seven, and every step is symmetric about the heart, which is
the symmetry he asked for expressed as motion rather than as a drawing.

**Anticipation.** The heart draws in before it releases. Scale .14 to .10 over
the first 40ms of a 340ms move, then out. Nothing in nature starts from rest
at full speed and a 40ms backswing is the difference between a thing appearing
and a thing arriving.

**Squash and stretch.** The heart flattens as it expands and rounds as it
lands: `scale(.14) scaleY(1.28)` to `scale(1.16) scaleY(.90)` to `scale(1)
scaleY(1)`. It is the only element in the mark with mass and it is the only
one that gets this. A thing that changes size without changing shape has no
weight.

**Follow through and overlapping action.** Nothing waits. The spine starts at
470ms while the second register pair is still arriving. The ring starts at
640ms while the third pair is still settling. The halo starts at 900ms while
the ring is still overshooting. The wordmark arrives at 1,180ms while the halo
is still opening. Five beats, four overlaps, and the whole sequence is 640ms
shorter than the sum of its parts.

**Slow in and slow out.** Three curves, named for the job, already in the
file. `cubic-bezier(.22,1,.36,1)` for things arriving, `cubic-bezier(.4,0,1,1)`
for things leaving, `cubic-bezier(.34,1.56,.64,1)` for things landing. There is
no linear anywhere in the proposal. Linear is the one curve that does not exist
outside a machine.

**Exaggeration.** The heart overshoots to 1.16 and the register bars to 1.30.
At 300ms a reading at true scale reads as nothing at all. Thirty percent looks
right at that duration and looks absurd frozen, which is how you know it is
correct.

**Secondary action.** The credit line arrives 120ms behind the name, so it
reads as a consequence of the name rather than as a second thing happening.
And the halo breathes: scale 1 to 1.018 over 4,200ms on `cubic-bezier(.37,0,
.63,1)`, forever, under everything. 1.8 percent at a 14 per minute period,
which is a resting respiratory rate. That is the spend on being alive at rest,
and it is the one part of this I would fight hardest to keep.

**Arcs.** The halo arrives on a rotation of minus four degrees rather than
straight out. The rays travel on a curve into place because a straight path
between two points is what a machine does. It costs nothing: it is one extra
term in a transform that is already there.

### 2.2 The Ones I Am Dropping, And Why

**Straight ahead and pose to pose.** Not a decision here. This is pose to pose,
every beat is a keyframe, and there is no straight ahead texture to add
because the sequence has no simulated element. Naming it would be a book
report.

**Appeal.** Not dropped, but not a beat either. It is the whole of section 3
and it is answered by the drawing, not by the timing. A mark that is not worth
watching twice cannot be timed into being worth watching twice.

**Solid drawing.** Not a beat. It is a constraint the current boot violates
(defect 1.3.2) and the proposal respects by construction: every element scales
about its own centre with `transform-box:fill-box`, so no element ever leaves
the geometry the field uses.

---

## 3. The Mark

Two directions. Both are drawn on a **178 by 178 viewBox with the centre at
(89, 89)**, because 89 is a Fibonacci number and 178 is twice it, so the
centre is a term of the series rather than a rounding of half the box.

Both are in `reviews/mark-proposals.html` at 18px, 64px and 320px on all seven
lightings, plus Lumen's white ground and the boot's black.

### 3.1 Direction A, The Nimbus

**The idea.** The halo is the mark. Not a hoop above a head: a rayed nimbus,
which is what a halo has actually been since Byzantium, with the seven
registers set inside it as a stave. Gold outside, white inside, which is his
brief verbatim.

**Where phi lands. Seven places, all checkable to three decimals.**

1. **One weight ladder.** Every line weight in the mark is `5 * phi^k`:

   ```
   1.180   1.910   3.090   5.000   8.090   13.090
   ```

   Six weights, each 1.618 times the one below it. Seven registers, six
   weights, one ladder. This is the whole of "varying line weight" and it is
   not a mood, it is a sequence.

2. **The ring's contrast is phi.** Outer boundary is a circle of radius 55.
   Inner boundary is an ellipse `rx 41.910, ry 46.910`. The stroke is therefore
   13.090 units at 3 and 9 o'clock and 8.090 at 12 and 6. 13.090 / 8.090 =
   1.6180. This is a broad nib with a horizontal axis, which gives vertical
   stress and preserves both mirror axes. A 30 degree nib would look more
   calligraphic and would break the vertical mirror, and he asked for symmetry.

3. **The nimbus radius is phi times the ring.** Longest ray reaches 89, ring
   is 55. 89 / 55 = 1.6182.

4. **Every ray tapers by phi squared.** Tip width = base width / 2.618.

5. **The register widths are a phi ladder.** Half widths 25.902, 16.008,
   9.894, 6.115. Each ratio is 1.618 to three decimals.

6. **The register spacings are a phi ladder.** Gaps from the heart outward
   7.414, 11.996, 19.410. Each ratio is 1.618.

7. **The heart bar's half width is the counter's half width over phi.**
   41.910 / 1.618 = 25.902.

**Symmetry.** Two mirrors. Left to right is exact on every element. Top to
bottom is exact on the ring and on the register stave. It is deliberately
broken on the rays, and that is the one asymmetry in the mark: the radiance is
graded from the top, because light comes from somewhere and a nimbus that is
even all the way round is a sun, not a halo. Ray length runs `3 + 31 * u^phi`
where `u = (1 + cos theta) / 2`, so 34 units at 12 o'clock, 11.7 at 3 and 9,
and 3 at 6. Ray base width runs `1.180 + 3.820 * u^phi`, so 5.000 at the top
and 1.180 at the bottom.

I tried it ungraded first and it read as a sunburst medallion. The grade is
what makes it a halo, and I would not give it up for the second mirror.

**The two optical cuts.** A mark that only works at one size is not a mark, so
this one has two, and the switch is at **40px**, stated and argued: the
smallest ray base is 1.180 units, which at 40px renders 0.265 device pixels
and is not there.

*Display cut, 40px and up.* Rays, modulated ring, seven registers.
*Text cut, under 40px.* Ring at radius 78 with a counter of `rx 57, ry 65`,
which is a stroke of 21 at the sides and 13 at the top and bottom, ratio 1.615.
One register, the heart. No rays.

The proportions change between the cuts and the impression does not, which is
what an optical size is for. At 18px the mark is a heavy gold annulus with a
white bar through it: a distinct silhouette, legible at a glance, and nothing
like a chakra diagram.

**What Direction A forfeits.** Three things, named.

- At 18px it loses the nimbus entirely. The halo at 18px is carried by the
  ring being gold, and that is a real loss.
- The 18px silhouette has a mild resemblance to a minus sign or a no entry
  sign. I looked at it at six times scale and I think the gold reads as
  ornament rather than as a prohibition, but it is a resemblance and he should
  see it before he rules.
- The stave has a residual audio waveform read, because a symmetric stack of
  bars widest in the middle is a waveform envelope. Making the bars equal
  width would kill it, and equal width bars will not fit inside the elliptical
  counter at the poles. I chose the phi ladder and I am naming the cost.

**The SVG.**

```svg
<svg viewBox="0 0 178 178" width="320" height="320" style="overflow:visible"
     fill="none" aria-label="Atuned">
 <g class="m-halo">
  <path class="m-rays" fill="var(--au)" d="M91.5 34L89.955 0L88.045 0L86.5 34ZM105.599 36.508L112.718 4.096L110.912 3.612L100.871 35.241ZM118.49 42.517L132.615 15.212L131.095 14.334L114.51 40.22ZM129.353 51.572L147.537 31.581L146.419 30.463L126.428 48.647ZM137.526 63.05L156.427 50.86L155.743 49.677L135.737 59.95ZM142.512 76.207L159.328 70.746L159.033 69.644L141.739 73.323ZM144 90.212L157.099 89.463L157.099 88.537L144 87.788ZM141.874 104.175L150.936 105.981L151.128 105.262L142.378 102.295ZM136.235 117.187L141.927 119.907L142.23 119.383L137.028 115.813ZM127.413 128.369L130.809 131.174L131.174 130.809L128.369 127.413ZM115.968 136.939L117.992 139.685L118.399 139.45L117.032 136.324ZM102.662 142.279L103.804 145.123L104.241 145.006L103.808 141.972ZM88.41 144L88.775 147L89.225 147L89.59 144ZM74.192 141.972L73.759 145.006L74.196 145.123L75.338 142.279ZM60.968 136.324L59.601 139.45L60.008 139.685L62.032 136.939ZM49.631 127.413L46.826 130.809L47.191 131.174L50.587 128.369ZM40.972 115.813L35.77 119.383L36.073 119.907L41.765 117.187ZM35.622 102.295L26.872 105.262L27.064 105.981L36.126 104.175ZM34 87.788L20.901 88.537L20.901 89.463L34 90.212ZM36.261 73.323L18.967 69.644L18.672 70.746L35.488 76.207ZM42.263 59.95L22.257 49.677L21.573 50.86L40.474 63.05ZM51.572 48.647L31.581 30.463L30.463 31.581L48.647 51.572ZM63.49 40.22L46.905 14.334L45.385 15.212L59.51 42.517ZM77.129 35.241L67.088 3.612L65.282 4.096L72.401 36.508Z"/>
 </g>
 <path class="m-ring" fill="var(--au)" fill-rule="evenodd"
   d="M89 34A55 55 0 1 1 89 144A55 55 0 1 1 89 34ZM89 42.09A41.91 46.91 0 1 0 89 135.91A41.91 46.91 0 1 0 89 42.09Z"/>
 <g class="m-seats" fill="currentColor">
  <rect class="p3" x="82.885" y="49.59"  width="12.229" height="1.18" rx="0.59"/>
  <rect class="p2" x="79.106" y="68.635" width="19.787" height="1.91" rx="0.955"/>
  <rect class="p1" x="72.992" y="80.041" width="32.016" height="3.09" rx="1.545"/>
  <rect class="p0" x="63.098" y="86.5"   width="51.803" height="5"    rx="2.5" fill="var(--au)"/>
  <rect class="p1" x="72.992" y="94.869" width="32.016" height="3.09" rx="1.545"/>
  <rect class="p2" x="79.106" y="107.455" width="19.787" height="1.91" rx="0.955"/>
  <rect class="p3" x="82.885" y="127.229" width="12.229" height="1.18" rx="0.59"/>
 </g>
</svg>
```

The text cut, under 40px:

```svg
<svg viewBox="0 0 178 178" width="18" height="18" fill="none" aria-label="Atuned">
 <path fill="var(--au)" fill-rule="evenodd"
   d="M89 11A78 78 0 1 1 89 167A78 78 0 1 1 89 11ZM89 24A57 65 0 1 0 89 154A57 65 0 1 0 89 24Z"/>
 <rect fill="currentColor" x="53.772" y="85.455" width="70.456" height="7.091" rx="3.545"/>
</svg>
```

### 3.2 Direction B, The Standing Wave

**The idea.** No body, no registers, no dots. Four concentric arcs at radii 89,
55, 34 and 21, each one open at the top and at the bottom, with the openings
aligned on the vertical axis so the negative space draws a tapering channel
that is never itself drawn. The field is harmonic and this is what a harmonic
looks like from above.

**Where phi lands.** The radii 89, 55, 34, 21 are consecutive Fibonacci terms,
so each ratio converges on phi: 1.6182, 1.6176, 1.6190. The angular openings
are 34, 21, 13 and 8 degrees, the same series, narrowing inward, which is what
makes the channel taper. The weights are the same `5 * phi^k` ladder, running
13.090 on the outer arc down to 0.729 on the innermost. Each arc is modulated
by the same vertical stress construction, so it is thickest at 3 and 9 o'clock
and tapers into its own openings.

**Symmetry.** Two exact mirrors, both of them. This is the more symmetric of
the two directions and it is the one that answers that part of the brief
without a caveat.

**What Direction B forfeits.** More than A does.

- It says nothing about a body. The seven registers have nowhere to live, so
  the boot cannot fill it with the reading and the mark cannot ever carry
  somebody's own data. That is the biggest single forfeit in this document.
- At 18px it collapses to two broken arcs and a dot, which is weaker than A's
  annulus.
- It is close to a signal strength or a sonar signifier, and that is a
  category it does not want to be in.
- The gold only appears on the outermost arc, so "golden hue with the white"
  is a thinner claim here than in A.

What it buys: it is unmistakably not a chakra diagram, it is genuinely
unfamiliar, and it holds both mirrors exactly.

**The SVG.**

```svg
<svg viewBox="0 0 178 178" width="320" height="320" fill="none" aria-label="Atuned">
 <path fill="var(--au)"       d="M115.021 3.889A89 89 0 0 1 115.021 174.111L111.194 166.374A75.91 80.91 0 0 0 111.194 11.626ZM62.979 3.889A89 89 0 0 0 62.979 174.111L66.806 166.374A75.91 80.91 0 0 1 66.806 11.626Z"/>
 <path fill="currentColor" opacity=".82" d="M99.023 34.921A55 55 0 0 1 99.023 143.079L98.112 140.041A50 51.91 0 0 0 98.112 37.959ZM78.977 34.921A55 55 0 0 0 78.977 143.079L79.888 140.041A50 51.91 0 0 1 79.888 37.959Z"/>
 <path fill="currentColor" opacity=".82" d="M92.849 55.219A34 34 0 0 1 92.849 122.781L92.633 121.609A32.09 32.82 0 0 0 92.633 56.391ZM85.151 55.219A34 34 0 0 0 85.151 122.781L85.367 121.609A32.09 32.82 0 0 1 85.367 56.391Z"/>
 <path fill="currentColor" opacity=".82" d="M90.465 68.051A21 21 0 0 1 90.465 109.949L90.383 109.221A19.82 20.271 0 0 0 90.383 68.779ZM87.535 68.051A21 21 0 0 0 87.535 109.949L87.617 109.221A19.82 20.271 0 0 1 87.617 68.779Z"/>
 <circle cx="89" cy="89" r="13" fill="currentColor"/>
</svg>
```

### 3.3 My Recommendation

**Direction A.** It carries the product's own subject, it is the only one of
the two that can hold a reading, and its 18px cut is the stronger. Direction B
is the prettier object and the emptier one.

---

## 4. The Wordmark Gains Words

### 4.1 The Model, Stated Before It Is Used

Letter spacing is added after every character including the last, so a tracked
line's border box is one gap wider than its ink. The product already handles
this with a negative `margin-right`. All widths below are **optical**, ink to
ink:

```
optical(s, fs, ls) = natural(s, fs) + ls * fs * (characters - 1)
```

Measured natural set widths, Inter as the product embeds it, verified against
`document.fonts` reporting exactly one family:

```
ATUNED                weight 300    4.0338 * fs
ATUNED                weight 400    4.0712 * fs
POWERED BY SOURCE OS  weight 500   12.6824 * fs
SOURCE OS             weight 500    5.8180 * fs
```

The coefficients hold across sizes to four decimals, which is the check that
they are advance widths and not a rounding: ATUNED at weight 300 measures
137.156px at 34px and 177.484px at 44px, giving 4.0340 and 4.0337.

### 4.2 Why The Arithmetic Breaks

Today the header holds two lines at one width and it holds them on the border
box, not on the ink. Measured on the shipped build:

```
.brand .bn  border box 85.161px   ink 83.192px
.brand .bs  border box 85.178px   ink 81.202px
```

The boxes match to 0.017px. **The ink is 1.99px apart**, which is the lower
line sitting 2.4 percent short. Both lines carry `margin-right:-<tracking>`, so
what actually centres is the ink, and the stylesheet's claim that the subtitle
is "tracked to the wordmark's width" is true of the box and two pixels out on
the letters. At 18px nobody will see it and I am not asking for it to change.
I am recording it because the same model is about to be used on a bigger
lockup, where two pixels becomes five.

**POWERED BY SOURCE OS is twenty characters and sets 107.797px at 8.5px with
no tracking at all.** To pull it back to 83.18px needs **minus .1524em**, which
at 8.5px closes the counters and is not typography. The only font size at which
it fits untracked is **6.56px**, which is below the product's own floor and
below the 8.5px exception `tests/design.js` gate 4 already carries.

**So the bar cannot hold the endorsement at any size that respects the floors.
That is arithmetic, not taste.** My recommendation is that it does not go
there: a line that costs a row of persistent chrome on every screen forever
and reads as an advertisement on the fortieth viewing is a fatigue defect, and
the endorsement is identity, read once.

### 4.3 Where It Does Go, And The Measured Tracking

The title card, where there is room. One lockup, two lines, one width.

The target width is **198.00px**, which is 320 divided by phi, so the wordmark
sits at the golden section of the mark above it.

| Line | Size | Weight | Tracking | Margin-right | Ink width, measured |
|---|---|---|---|---|---|
| ATUNED | 43px | 300 | **.1142em** | -.1142em | **198.027px** |
| POWERED BY SOURCE OS | 11px | 500 | **.2799em** | -.2799em | **197.999px** |

Worked, so it can be checked rather than believed:

```
ATUNED    natural at 43px, weight 300 = 4.0338 * 43          = 173.454
          198.000 - 173.454 = 24.546 ;  24.546 / (43 * 5)    =   .11417
POWERED   natural at 11px, weight 500 = 12.6824 * 11         = 139.506
BY        198.000 - 139.506 = 58.494 ;  58.494 / (11 * 19)   =   .27987
SOURCE OS
```

**Then checked against the real rendering rather than trusted**, because the
umlaut is an inline-block inside the first line and a span boundary can add a
letter-space that the model does not know about. Both strings rendered in a
probe with the same typography, measured, and the trailing gap subtracted:

```
ATUNED with the umlaut span, 43px / 300 / .1142em    198.027px
ATUNED as plain text,        43px / 300 / .1142em    198.011px
POWERED BY SOURCE OS,        11px / 500 / .2799em    197.999px
```

**0.028px apart.** The umlaut span costs 0.016px, which is nothing. A binary
search over the credit line's tracking against the name's measured width
converges on .2800em, so .2799 is right to four places and the fourth place is
worth 0.02px. The model and the render agree and the numbers can be used.

**Hierarchy comes from value, not from size.** POWERED BY in `--dim`, SOURCE OS
in `--ink`, same size, same tracking, one line, one sum. Splitting the sizes
would split the arithmetic into two problems.

**11px clears the type floor**, so unlike today's 8.5px subtitle this line
needs no named exception in gate 4. That is a small win worth banking.

The string stays sentence case in the markup and is uppercased in the sheet,
which is the existing pattern and the reason the all caps gate does not fire.

### 4.4 The Umlaut, Measured Against The Glyph

I rendered Inter's capital U to a canvas inside `source.html`, where the font
is actually embedded, and scanned the ink. My first attempt at this ran in the
proposal harness, which did not embed Inter, and returned identical numbers for
weight 300 and weight 400. That is impossible for a variable font and it is how
I caught that it was measuring a system fallback. The harness now embeds the
same woff2 the product ships, for exactly that reason.

Measured, Inter, in em of the font size:

| Weight | U advance | Stem separation | Stem pair centre | Stem width |
|---|---|---|---|---|
| 300 | .7358 | .4250 | .3625 | .0667 |
| 400 | .7441 | .3833 | .3667 | .0917 |
| 500 | .7402 | .3583 | .3625 | .1083 |

**The rule: the dot diameter is 1.35 times the stem width of the weight in
use, and the pair is centred on the stems, not on the box.**

| | dot | ::before left | ::after left |
|---|---|---|---|
| title card, weight 300 | **.090em** | **.1050em** | **.5300em** |
| bar, weight 400 | **.124em** | **.1131em** | **.4964em** |

Verified in the harness: the rendered dot centres land at 6.44px and 24.72px
into the U box at 43px, against a computed target of 6.45 and 24.73. Within
one hundredth of a pixel.

Two consequences.

**The header does not need to move.** Its current `.116em` and `.488em` are
within .0084em of the measured values, which is 0.15px at 18px. It was
measured properly once and it holds. The only correction it could take is the
dot diameter: `.14em` is 1.53 times the stem where the rule says 1.35, so
`.124em`. That is a 0.29px change and it is optional.

**The boot must move.** Its `.055em` and `.35em` were placed against a
lowercase u at a time when the boot said "Atuned". Nothing about them is right
for a capital.

---

## 5. What It Costs

### 5.1 The Beat Sheet

Total 3,340ms. Every property below is transform or opacity.

| # | Start | Element | From, to | Dur | Curve | Principle |
|---|---|---|---|---|---|---|
| 1 | 0 | black | hold | 120 | none | staging |
| 2 | 120 | heart bar `.p0` | scale .14 sY1.28, in to .10, out to 1.16 sY.90, to 1 | 340 | `.34,1.56,.64,1` | anticipation, squash, stretch |
| 3 | 380 | throat and solar `.p1` | scale .25, 1.30, 1 | 300 | `.34,1.56,.64,1` | timing |
| 4 | 470 | eye and sacral `.p2` | same | 300 | same | stagger 90ms |
| 5 | 470 | spine | scaleY 0 to 1 from the heart | 380 | `.22,1,.36,1` | overlapping action |
| 6 | 560 | crown and root `.p3` | same as 3 | 300 | same | stagger 90ms |
| 7 | 640 | ring | scale .86, 1.05, 1 | 520 | `.34,1.56,.64,1` | follow through |
| 8 | 700 | skip line | opacity 0 to .55 | 320 | `.22,1,.36,1` | the way out |
| 9 | 900 | halo | scale .82 rot -4deg, 1.03 rot .6deg, 1 rot 0 | 720 | `.22,1,.36,1` | arcs |
| 10 | 1,180 | ATUNED | opacity 0 to 1, translateY 8 to 0 | 380 | `.22,1,.36,1` | staging |
| 11 | 1,300 | credit line | opacity 0 to 1, translateY 5 to 0 | 340 | `.22,1,.36,1` | secondary action |
| 12 | 1,620 | halo | scale 1, 1.018, 1 and opacity .92, 1, .92, forever | 4,200 | `.37,0,.63,1` | alive at rest |
| 13 | 1,900 to 2,080 | the seven take canon colour, 60ms apart outward from the heart | opacity 0 to 1 on a colour layer | 260 each | `.22,1,.36,1` | the only beat that carries data |
| 14 | 2,900 | the sheet | opacity 1 to 0, then visibility hidden | 420 | `.4,0,1,1` | leaving |
| 15 | 3,320 | the node is removed by script, timer floor 3,500 | | | | |

**The deltas.**

| | today | proposed | delta |
|---|---|---|---|
| first ink of any kind | 820ms | 120ms | **700ms earlier** |
| first word on screen | 3,727ms | 1,180ms | **2,547ms earlier** |
| the way out is offered | 1,695ms | 700ms | 995ms earlier |
| node removed | 5,287ms | 3,320ms | **1,967ms earlier** |
| stagger between siblings | 42ms, 24 of them | 90ms, 3 of them | inside the 60 to 110 band |

The finished frame is complete at 2,340ms and the fade starts at 2,900, so
there is a 560ms hold on a complete mark with the breath running under it.
A frozen end frame is a still. A held one with a 1.8 percent breath is a shot.

**The ruling conflict, named rather than resolved.** `CLAUDE.md` says the boot
is three seconds. The stylesheet says five was ruled later, with two beats of
black at each end. I am proposing 3,340ms and I am not pretending that is a
neutral change. If he wants the five seconds back, the way to spend the extra
1,660ms is on the hold and the breath, not on delaying the first word. Both
versions are one number in one place.

### 5.2 Frame Cost, Measured

Measured in `reviews/mark-proposals.html`, two runs at each of two viewports,
a rAF counter over the full 3,400ms:

```
1600x1000   60.5 fps   worst frame 16.8ms   frames over 16.9ms: 0
1600x1000   60.4 fps   worst frame 16.8ms   frames over 16.9ms: 0
 390x844    60.6 fps   worst frame 16.8ms   frames over 16.9ms: 0
 390x844    60.4 fps   worst frame 16.8ms   frames over 16.9ms: 0
```

Those four runs start the sequence and run the counter inside one page
evaluation, so nothing crosses the driver boundary mid measurement. A worst
frame of 16.8ms is exactly one refresh at 60Hz, so **zero frames were
dropped.** When the same page is driven by an out of process click instead,
the worst frame reads 19.3 to 28.4ms. That is the driver's frame and not the
animation's, and I am reporting the isolated number as the measurement and
this one so nobody is surprised by it.

Read back from `document.getAnimations()`, the properties touched across the
whole sequence are: **opacity 53 keyframe entries, transform 35, visibility 2**
and nothing else. No `stroke-dashoffset`, no `fill`, no `filter`, no
`box-shadow`. **Every moving property is compositor only**, and the single
`visibility` flip is a discrete step at the last keyframe.

Three decisions bought that.

- **The ring does not draw itself, it arrives.** A variable weight ring is a
  filled path and a fill cannot be dash drawn. It scales in instead, which is
  free, and it is better animation: a line drawing itself is a loader trope
  and this mark is a solid.
- **The 24 rays are one path, not 24 nodes**, and they bloom as one group on a
  single transform. The current boot's 24 `.b-addr line` elements each carry
  their own dashoffset animation. Twenty five paint animated nodes become zero.
- **The seven colours are a second stacked layer at opacity 0**, not an
  animated `fill`. Seven extra nodes, no paint.

Gate 13 measures 60fps in every lighting. This proposal adds no paint work to
the boot and none at all after it clears, except the halo breath, which is one
transform on one group.

### 5.3 Byte Cost

| | current | proposed | delta |
|---|---|---|---|
| boot markup | 3,069 | 2,967 | -102 |
| boot CSS | 3,741 | 3,164 | -577 |
| lockup markup | included above | 134 | +134 |
| **total, comments stripped** | **6,810** | **6,265** | **-545** |

**The proposal is 545 bytes smaller than the thing it replaces**, because 24
`<line>` elements with inline `animation-delay` attributes cost more than one
`<path>`. Against a 1,174,265 byte file this is noise either way, and it
matters only because it means nothing has to be traded for it.

The 18px cut adds 221 bytes to the header if it is used there. Direction B's
display cut is 886 bytes, a third of A's, which is its one real advantage.

### 5.4 What The Boot Does When JavaScript Never Arrives

**Stated explicitly, because this cost a mayday once.**

The sheet's fade stays a CSS animation with a `forwards` fill and a
`visibility:hidden` terminal keyframe:

```css
.boot{animation:bootOut .42s cubic-bezier(.4,0,1,1) 2.9s forwards}
@keyframes bootOut{to{opacity:0;visibility:hidden}}
```

So with scripts off the overture plays in full and the sheet goes
`visibility:hidden` at **3,320ms**, uncovering the `.nojs` notice, which stays
at the same `z-index:9999` and stays earlier in document order so the boot
paints over it until it lifts. That mechanism does not change. Only the number
does: **the notice that tells somebody how to fix a dead preview pane arrives
1,880ms sooner than it does today.**

The script side teardown floor moves from 5,400ms to 3,500ms, and it stays the
floor in every case so a dropped `animationend` never leaves a transparent
sheet over a working instrument.

**One defect to fix while we are in here.** `.boot{pointer-events:none}` lets a
dismissing press land on the app underneath, measured in 1.3.5. The sheet
should take `pointer-events:auto` and the skip handler should move from the
window to the sheet itself, so the press that dismisses the overture dismisses
the overture and nothing else.

### 5.5 Reduced Motion

Reduced motion gets the end state and never a faster animation. Today it gets
nothing at all: `if(rm)clear()` removes the sheet before 1,000ms and a
reduced motion visitor never sees the mark, the name or the credit.

**Proposed:** the completed frame, no movement of any kind, no breath, held
1,200ms, then `opacity 1 to 0` over 300ms and cleared. Opacity is not
vestibular motion and a title card that never appears is not an accommodation,
it is an omission.

```css
@media (prefers-reduced-motion:reduce){
 .boot *{animation:none!important;transform:none!important;opacity:1}
 .boot{animation:bootOutRM .3s linear 1.2s both}
}
@keyframes bootOutRM{to{opacity:0;visibility:hidden}}
```

**This is a change of behaviour and it is his to rule.** If he wants today's
instant clear kept, it is one media query and nothing else in the proposal
moves.

---

## 6. The Seven Lightings

Gold has to hold on all of them and it does. Measured with a colour resolver
that composites every ancestor background through a canvas round trip, so
`oklab()` and `color()` values resolve rather than being regex scraped.

**I validated the resolver before I trusted it**, on two known cases: white on
black returned 21.00 and `#C2A063` on black returned 8.50. Both exact.

That validation is not ceremony. Two earlier probes in this pass produced
wrong numbers on exactly this measurement. The first scraped digits out of
`color(srgb 0.110549 0.106745 0.140392)` and read Punch's bar as pure black,
giving 8.50 where the truth is 6.90. The second sampled a screenshot pixel and
landed on a tab pill instead of the bar, reporting Lumen at 1.15. Both were
discarded.

`--au` against each lighting's own top bar ground:

| Lighting | Bar ground | `--au` | Contrast |
|---|---|---|---|
| Dark | rgb(26, 29, 38) | `#C2A063` | 6.81 |
| Snow | rgb(248, 247, 243) | `#8A6B24` | 4.65 |
| Punch | rgb(28, 27, 36) | `#C2A063` | 6.90 |
| Glass | rgb(19, 21, 28) | `#C2A063` | 7.38 |
| Glass white | rgb(252, 252, 251) | `#8A6B24` | 4.86 |
| Flat | rgb(18, 20, 25) | `#C2A063` | 7.46 |
| **Lumen** | rgb(16, 16, 16) | `#C9A34A` | **7.99** |
| the boot's own black | rgb(0, 0, 0) | `#C2A063` | 8.50 |

**All seven clear 4.5 to 1 for text and every one of them clears 3 to 1 for a
graphic by at least 55 percent.** The weakest is Snow at 4.65 and it is still
above the text threshold. Gold is safe everywhere and it needs no per theme
override.

**Lumen is the one that needed thinking about** and it is the easiest of the
seven, because his ruling already settled it: any background carrying text is
`#101010`, so the top bar is black and the mark in the bar sits on black at
7.99 to 1. The white ground only appears between panels, where no mark sits.
The harness draws the mark on both anyway, because a mark that only works on
the surface we expected is a mark waiting to be dropped on the other one.

**The colour rule for the mark, one line:** the ring and the rays are
`var(--au)`, the registers are `currentColor`, and the heart is `var(--au)`.
So the mark inherits the ink of whatever surface it is placed on and the gold
is the only colour it asserts. On Lumen's white ground `currentColor` resolves
dark, on Lumen's black bar it resolves light, and nothing needs a theme rule.

**One open for him.** The bar wordmark is sky blue on his earlier ruling. The
title card in this proposal is gold and white on his new one. Those are two
rulings that now sit next to each other, and I have built the card in gold and
white and left the bar alone rather than deciding that for him.

---

## 7. The Grade Delta

Judged on the first run experience, which is the thing the audit measured.

| | Before | After |
|---|---|---|
| Time to first ink | 820ms | 120ms |
| Time to first word | 3,727ms | 1,180ms |
| Time to the way out | 1,695ms | 700ms |
| Time to clear | 5,287ms | 3,320ms |
| Paint animated nodes | 25 | 0 |
| Measured fps | not measurable without contention | 60.4 to 60.6, worst frame 16.8ms, 0 dropped |
| Boot bytes | 6,810 | 6,265 |
| Gold in the mark | none, `--gold` resolves blue | `--au` at 4.65 to 8.50 on all seven |
| Line weights | 3 (1.4, 1.5, 1.6) | 6, each phi times the last |
| Phi in the construction | none | 7 places, checkable to 3 decimals |
| Mirror axes | 1, and the motion breaks it | 2, and the motion holds both |
| Optical sizes | 1 | 2, switching at 40px |
| Heart visible | no, covered by the core | yes, and it is the largest register |
| Seats sit on the field geometry | no, 51px radial excursion | yes, `transform-box:fill-box` |
| Wordmark matches the header | no, 27.03px apart, wrong case | yes, and a measured tracking |
| Reduced motion sees the mark | no | yes, held 1,200ms, no movement |
| No script notice arrives | 5,200ms | 3,320ms |
| Dismissing press hits the app | yes, verified on the Compass tab | no |

**Grade before: D.** Not for the drawing, which is competent, but because four
of the five seconds a stranger is held carry no information, the heart is
invisible, the halo is the wrong colour, the boot wordmark is a different mark
from the product's, and the skip gesture navigates the app. Any one of those is
a defect. Together they are a first screen that works against the product.

**Grade after: A minus.** The minus is earned and I am not rounding it away.
Direction A's 18px cut forfeits the nimbus, the 18px silhouette has a minus
sign resemblance I would want a second opinion on, and the stave keeps a
residual waveform read. Those are three live risks, they are all in section
3.1, and none of them is solved by animating better.

---

## 8. What Needs A Ruling Before Anything Is Built

1. **Direction A or Direction B.** My call is A. Section 3.3 says why.
2. **3,340ms or the ruled 5,000ms.** If five, the extra goes on the hold and
   the breath, never on the first word.
3. **Reduced motion: hold the card, or keep today's instant clear.** Section
   5.5.
4. **The title card is gold and white. The bar wordmark is still sky blue.**
   One of those should probably move. Not my call.
5. **Does "powered by SOURCE OS" belong in the top bar.** The arithmetic in
   4.2 says it cannot fit there without breaking a floor. If he rules it must
   appear, the only version that works is horizontal, to the right of the
   lockup, at 8.5px and 107.80px wide, with the width matching constraint
   abandoned because the two things are no longer stacked.

## 9. Files

- `reviews/AD-mark-and-boot.md`, this document.
- `reviews/mark-proposals.html`, 151,599 bytes, one file, no network, Inter
  embedded. Both directions at 18px, 64px and 320px on nine grounds, which is
  the seven lightings plus Lumen's white ground and the boot's own black. The
  boot is playable with a live frame counter and a reduced motion switch, and
  the lockup arithmetic is set at true size.

  Verified before handing it over: 54 marks render, nine grounds, `document.fonts`
  reports exactly one family, **zero requests that are not `file:`**, zero page
  errors and zero console errors, at 1400x1000, at 390x844 and under
  `prefers-reduced-motion: reduce`.

Nothing else in the repository was touched and nothing was committed.
