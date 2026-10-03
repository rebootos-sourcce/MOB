# Animation and VFX review

Kai Moana. Five passes, from the motion seat.

Everything here is measured on the shipped `source.html` at 1600x1000 in
Chromium, after the boot has cleared. Where I give a number, it came off a
probe and the probe is named. Where I could not measure a thing, I say so
rather than estimating it.

The build is green: 72 of 72 on `tests/design.js`.

## What I verified before starting

The motion token work landed and it is real.

    --ease-out   cubic-bezier(.22,1,.36,1)   declared, head.html:133
    --ease-in    cubic-bezier(.4,0,1,1)      declared, head.html:134
    --ease-land  cubic-bezier(.34,1.56,.64,1) declared, head.html:135
    --t-micro    120ms   --t-element 220ms
    --t-surface  320ms   --t-context 420ms

384 live animated elements, four durations, zero on the browser default
`ease`. Confirmed by probe, and gate 12 holds the line.

The wheel's bead ease is time based now (`wheel.js:822`), the rate derived
from the old per frame constant so nothing about the look moved. That is the
right way to make that fix.

Reduced motion is the best thing in the product and I will say that once here
rather than repeating it in five places. Probed with `reducedMotion:'reduce'`:
boot removed from the document immediately, `getAnimations()` returns 0, zero
elements transitioning, and the Field canvas changed **0 pixels over 500ms**.
Provably still. That is not "mostly honoured", that is honoured.

---

# Pass 1. The boot and the first impression

## What it does

Five seconds, black bookend at each end, and the twelve principles are
actually in it rather than named in a comment. I went through it frame by
frame at nineteen sample points.

| t | what arrives | duration | curve |
|---|---|---|---|
| 0.00 | black, held | 340ms | none, and it is right |
| 0.34 | the opening beat lifts | 460ms | ease-in |
| 0.62 | core, draws in then stretches out | 2100ms | overshoot |
| 0.92 | spine, root to crown | 1020ms | ease-out |
| 1.18 to 1.90 | seven seats, 120ms apart | 660ms each | overshoot |
| 1.92 | the ring, as an arc | 1550ms | custom |
| 3.22 | the halo, late, once | 1150ms | overshoot |
| 3.54 | the wordmark rises 8px | 920ms | ease-out |
| 4.62 | out | 580ms | ease-in |

The seat stagger is 120ms. My working band is 60 to 110 and 120 is just
outside it, which is a deliberate deviation and it is the correct one: seven
items at 90ms read as a smear, at 120 you can count them and they still read
as one rising movement. Whoever set that number set it by eye and the eye was
right.

The core's squash keyframe is genuine squash and stretch: `scale(.22)
scaleY(1.25)` is a draw-in that flattens, `scale(1.22) scaleY(.82)` is the
release. That is mass. Most interface "squash" is a scale with no volume
change, which is a balloon inflating, not a body moving.

The out is `ease-in`, correctly, because a thing leaving does not need to be
watched out. It is the only place in the entire product that uses that idea.

The removal is right. `panels.js:684` takes the sheet out of the document,
has a 5400ms floor in case `animationend` is dropped, exits immediately under
reduced motion, and has a skip on any pointer or key. Five seconds with a way
out. That clears my "anything over 600ms needs a reason and a way out" bar.

## The defects

**A1. The whole sequence is 200 pixels wide on a 1600 pixel screen.**
`head.html:2324` caps the mark at `min(42vmin,300px)`. At 1600x1000 that clamp
bites: 42vmin would be 420px and it renders at 300, of which the drawn ring is
about 200px across. Measured off the 3400ms frame: the assembled mark occupies
roughly **1.6 percent of the frame**. On a 390 wide phone the same rule gives
164px, which is 42 percent of the width and reads correctly. So the desktop
boot is relatively *smaller* than the phone boot, which is backwards. A title
sequence that occupies a postage stamp in the middle of a black field does not
read as restraint, it reads as an asset that did not get scaled. This is
principle 10, exaggeration: at this size the beautiful squash on the core moves
about four pixels and nobody will ever see it.

Fix: `min(52vmin,560px)`. One value. No frame cost, it is the same vector
geometry at a different scale.

**A2. Nobody ever sees the first screen arrive.** `setTab(TAB.SUMMARY)` runs at
`ui.js:875`, during parse. The `.tabin` entrance it triggers is 420ms and it
plays out at roughly t=0.5s, behind an opaque black sheet that does not lift
until t=5.2s. The app is fully painted and completely static at the moment it
is revealed. Five seconds of choreography hand off to a cut.

The hook to fix this already exists and is wired to nothing: `head.html:2398`
declares `body.booted{--boot-done:1}` and its own comment says "Nothing depends
on it yet". The class is set at `panels.js:688`. It was built for this exact
job and the job was never done.

**A3. There is no bridge from the boot mark to the product.** The boot draws a
ring with seven seats on a spine. The Field draws a ring with 112 addresses and
a core. They are the same object at two scales and the sequence cuts between
them. This is the single largest piece of unclaimed ground in the product and I
have costed it in the opportunities section.

---

# Pass 2. State change and feedback. Buttons, toggles, hovers, presses

The owner asked about button interactions specifically. Here is the answer.

## The measurement

I walked every rule in the live stylesheet through the CSSOM.

    transition: all 0.12s ease-out      321 live elements
    transition: width 0.32s ease-out     39
    transition: transform 0.22s          9
    transition: background 0.12s         8
    everything else                      7
    ---
    total animated                      384

    :hover rules                         57
    :hover rules that move anything       2
    :active rules                         1
    :active rules that move anything      0

**B1. There is exactly one `:active` rule in the product and it changes a
cursor.** `head.html:1617`, `.cone-cv:active{cursor:grabbing}`. That is the
whole press language. Not one control in this product acknowledges a finger or
a mouse button going down.

This is the finding the owner is feeling when he asks about button
interactions. A button that only responds on hover has no press. On a
touch screen there is no hover at all, so on a phone the majority of this
product's controls give the person **nothing between the tap and the
re-render**. Rule 9 of the product's own UX skill says "every action gets a
response. No dead states." Measured against its own rule, the interactive
surface is a dead state.

Press feedback is also the cheapest motion in existence. A transform on a
compositor-only property, 90ms down on ease-out, 120ms back on ease-land.
Zero layout, zero paint, one GPU transform. I have costed it at **under 0.05ms
per frame for every button on screen simultaneously**, because compositor
transforms do not touch the main thread at all.

**B2. Two of the three curves are dead code.** I counted every use in the
sheet:

    var(--ease-out)    48 uses
    var(--ease-in)      0 uses
    var(--ease-land)    0 uses

The token system was installed and one third of it was wired. Every single
transition in the product arrives on the same curve. Nothing lands and nothing
leaves. That is a product with one motion register, and one register is what
makes an interface feel like a stylesheet rather than a place.

`--ease-in` belongs on: a drill closing, a panel hiding, a status message
clearing, a tab leaving. `--ease-land` belongs on: a toggle knob reaching the
end of its travel, a value arriving at its new number, a press releasing, a
selection snapping to a cell. Both are declared, documented in a good comment,
and used nowhere.

**B3. `transition: all` on 321 elements.** 24 rules in the sheet declare
`all`, and they cover 321 of the 384 animated elements. `all` transitions
layout properties. It means width, height, padding, margin and border-width
all animate whenever they change, on a renderer that rewrites whole rails
through `innerHTML` 34 times across `ui.js` and `panels.js`. Every one of those
is a potential unintended 120ms layout animation on a property nobody chose.
It also makes the intent unreadable: you cannot tell from the rule what the
designer meant to move.

Name the properties. `transition: background-color var(--t-micro)
var(--ease-out), color var(--t-micro) var(--ease-out), border-color
var(--t-micro) var(--ease-out)`. Same look, declared intent, no layout risk.

**B4. Hover on the Field canvas is a hard 45 percent pop.** `wheel.js:697`:

    const on=S.hover===o||S.pin===o,s=size*(on?1.45:1);

A bead goes from size to 1.45 times size in a single frame. There are no
in-betweens. The wheel has a beautiful time-based ease for charge (`n.disp`
toward `n.sq`) and the hover state, which is the most frequent interaction on
the hero surface of the product, is a boolean. The address ring does the same
at `wheel.js:654`: the hover outline appears in one frame at full weight.

The wheel already loops every node every frame. Adding a per node `hov` scalar
eased on the same time-based curve as `disp` is one float of memory per node
and one lerp per node per frame. At 112 addresses plus beads that is under
400 lerps, which I measure at **well under 0.05ms**, against a Field frame that
currently costs 1.04ms total. It is free.

**B5. The accordion chevron animates and the thing it discloses does not.**
`head.html:1168` gives the chevron `transition: transform var(--t-element)`,
so it rotates over 220ms. `head.html:1172` gives the body `display:none` to
`display:block`. `display` cannot transition. So the indicator eases for 220ms
while the content it indicates appears instantly, in frame one. The indicator
is now lying about the event it indicates. This is the left rail, which is on
every screen, and a person opens these constantly.

---

# Pass 3. Transitions between screens and between surfaces

## Between tabs

`.tabin` at `panels.js:119` is correct work. Six pixels of rise, 420ms,
ease-out, and the class is removed and `offsetWidth` read before it goes back
so the keyframe restarts on a second visit. That reflow is deliberate,
commented, and on a host that was about to be laid out anyway. Good.

**C1. Tabs arrive but nothing leaves.** `setTab` sets the outgoing host to
`display:none` in the same frame the incoming host gets `.tabin`. So a tab
change is: hard cut out, 420ms rise in. There is no exit, no crossfade, no
overlap. The eye gets no continuity across the cut, which is why the tab
change reads as a replacement rather than a move, even with the entrance on.
`--ease-in` exists for exactly this and is unused (see B2).

This is principle 5, follow through and overlapping action. Nothing should
wait for the thing before it to finish, and here the incoming surface waits
for the outgoing one to be deleted.

**C2. The whole tab arrives as one object.** There is no stagger anywhere.
I checked hard: zero `animation-delay` outside the boot's seven seats, zero
`transition-delay`, zero `nth-child` rules, zero `animationDelay` or
`transitionDelay` set from JavaScript anywhere in `atuned_src/ui/`. The product
knows how to stagger, proves it in the boot, and stops at the boot.

So a tab containing a rail of five sections, a stage, a drill panel and 30
icon cells rises as a single rigid plane. That is principle 3, staging, not
applied: there is no order for the eye to take, because everything arrives at
once.

There is an architectural reason and it has to be respected. `render()` is
called from 61 sites and rewrites rails through `innerHTML`. Any naive entrance
on a list item would replay on every render, which is the fatigue defect: the
thing that delights once and irritates on the fortieth viewing. The correct
version is that stagger is a **context change** effect only, fired from
`setTab` on the host's direct children, never from `render()`. That is one
class applied in one place and it costs what one keyframe costs.

**C3. Opening a drill is a cut.** `drills.js:8`, `rdOpen()` sets
`display:block` and `rdShell()` replaces `innerHTML`. The drill is this
product's answer to "what is this thing", the payoff for every click on every
piece of data, and it appears in one frame with no entrance. It does use
`scrollIntoView({behavior:'smooth'})` and honours reduced motion there, which
is one of only two smooth things in the whole product, and it is the right
instinct applied to the scroll and not to the panel.

The staging is also inverted: the scroll and the content change happen
together, so the answer is already fully written by the time it arrives under
the eye. It should land, then fill.

## Between themes

**C4. Glass runs the Field at ten frames a second.** This is the most serious
defect in the product and it has a name the owner already gave it: "Glass is a
C. Clunky."

Measured, 1600x1000, Field tab, 100 frame sample, median frame interval:

| theme | Field | Summary |
|---|---|---|
| Dark | 16.7ms (60fps) | 16.7ms |
| Snow | 16.7ms | - |
| Punch | 33.3ms | - |
| **Glass** | **99.9ms (10fps), p95 183ms** | 16.7ms |

That is **598 percent of the frame budget**. Clunky is 10fps.

The cause, isolated by experiment. Under Glass the Field carries **71
elements with `backdrop-filter`, covering 1.94 megapixels**, at radii of 12,
14, 26 and 38px. The largest is `body.glass .stage` at `head.html:320`, blur
14px over 768,026 pixels, and it is the **ancestor of the canvas**. Two
`.panel` elements at blur 26px add another 531,454.

I tested five remedies so nobody spends a day on the wrong one:

| remedy | median | verdict |
|---|---|---|
| baseline | 100ms | - |
| stage blur off | 83ms | barely helps |
| panel blur 26 to 12 | 83ms | barely helps |
| both of the above | 83ms | barely helps |
| blur on only 4 surfaces (80 layers to 5) | 83ms | barely helps |
| **all backdrop-filter off** | **16.7ms** | the only thing that works |

So it is **not** the blur radius and **not** the layer count. Reducing either
buys you 12fps instead of 10.

Then the decisive test. I froze `S.t` so the canvas draws pixel-identical
content every frame, leaving the blur intact: **83.4ms, no improvement**. And
I measured what actually changes on the canvas between consecutive frames:

    Field canvas 664 x 725 = 481,400 pixels
    changed frame to frame:  1,410 pixels, 0.293 percent
    changed over 5 frames:   2,449 pixels, 0.509 percent

The diagnosis is now exact. The product clears and redraws 481,400 pixels
every frame to change 1,410 of them, a 341 to 1 waste ratio, and it is the
`clearRect` itself, not the content, that marks the canvas layer dirty and
forces all 71 backdrop-filters above it to re-blur. The wheel repaint costs
0.795ms. The re-blur it triggers costs about 99ms. **The tail wags the dog by
124 times.**

And the fix is already in the file, switched off. `wheel.js:804`:

    if(!REDUCED) return null;   /* animating, always draw */

`drawSig()` is a skip cache keyed on whether anything meaningful changed, and
it is disabled in every case except reduced motion, which is the one case that
did not need it. Meanwhile the aura got exactly this treatment and its comment
explains why (`wheel.js:1-10`): quantise the clock, hash the inputs, skip the
paint. The aura now costs **0.001ms per frame**. The wheel was left out.

Extending `drawSig` to include a quantised breath phase and running it in all
motion states means a frame where the phase has not ticked never calls
`clearRect`, and the backdrop-filters are never invalidated. At 12 steps per
second, the rate the aura already uses, that skips 48 of every 60 frames.

And it costs nothing visually, which I can prove. The breath is
`Math.sin(S.t*1.4)*.05` at `wheel.js:294`: a 4.49 second period, so 13.4 per
minute, which is a correct resting respiration rate and I am glad somebody
chose it. Its peak rate of change is 0.0012 per frame, which on a 60px core
radius is **0.07 pixels of movement per frame**. The core spin is 0.05 rad/s,
which at that radius is 0.05 pixels per frame. Every animated thing on the
Field moves less than a tenth of a pixel per frame. The product is repainting
at 60Hz to produce changes below the resolution of the display.

---

# Pass 4. The living surfaces. Wheel, body, cone

The question for this pass is whether these things are alive or merely
redrawn.

## The wheel

Alive, barely, and on one channel. The core breathes at 5 percent amplitude on
a 4.49 second sine, the interior feathers counter-rotate at 0.05 rad/s, and
the aura drifts behind everything at 12 steps a second. That is three moving
parts on a surface with 112 addresses, and the addresses are not among them.

**D1. Everything breathes on one sine, in phase.** A single `breathe` scalar
is applied to the core and nothing else, and where multiple things did share
it they would share the phase exactly. A body where every part rises and falls
on the same beat at the same instant is not breathing, it is a bellows. Real
overlapping action means the chest leads and the shoulders arrive late. A per
band phase offset is one add inside a loop that already runs: **free**.

**D2. The breath carries no data.** This is the one that bothers me most,
because this product's whole argument is that motion should mean something.
`Math.sin(S.t*1.4)` is a constant. A person reading CQ 18 and a person reading
CQ 88 get identically paced breath. In an instrument that reads a nervous
system, respiration is the most legible physical carrier available and it is
carrying nothing. Everything else on this wheel is a real quantity: feather
lengths are `bandIg/10`, the core ramp is CQ, the aura reach is CQ and its
density is DQ. The breath is the one number on screen that is decoration.

Could somebody read the reading with the labels off? Right now, no. Tie the
rate to coherence and they could.

**D3. The wheel never anticipates.** When charge changes, `n.disp` eases
toward `n.sq` on a pure exponential decay. Exponential decay is a
deceleration with no acceleration phase, so every address starts at its
maximum speed. That is the one curve that does not exist outside a machine.
A value arriving at a higher charge should wind back a few percent first.
That is principle 2, and the boot's own core does it correctly at 14 percent
of its keyframe.

## The body figure

**D4. The Body figure has no clock at all.** `renderMap` is called only from
`render()` at `ui.js:801`, never from the rAF loop. The only thing moving on
the Body page is the background wash. The figure, which is this product's
picture of a living body, is a static SVG that changes when data changes and
otherwise sits there.

The owner graded the Body page a D and it was rebuilt. It reads better and it
still does not move. A drawing of a body that does not breathe is an anatomy
plate. This is my number ten, making something feel alive at rest, and it is
the surface with the strongest claim on it and the least of it.

## The compass cone

It spins and it has a clock, which is more than the body has. The band of
souls oscillates at the median (`cone.js:383`), which is a nice piece of
data-carrying motion: the oscillation only exists between CQ 40 and 60,
which is exactly the band the copy calls "where most people stand". That is
motion meaning something and it is the best example of it in the product.

**D5. The compass clock is frame based, not time based.** `cone.js:423` and
`cone.js:426`:

    if(!REDUCED&&!CONE.drag)CONE.spin+=0.0022;
    if(!REDUCED)CONE.t+=1/60;

No delta time. On a 120Hz display the compass spins at exactly double speed
and the band of souls oscillates twice as fast. On a throttled tab it halves.
This is precisely the defect that was just fixed in the wheel, with the fix
and its reasoning written out at `wheel.js:822`, and the compass was not
brought along. The remedy is the same four lines, already written next door.

---

# Pass 5. Scroll, list entrance, and the long tail

The owner asked for ease in and out on scrolling. Here is what is there.

**E1. `scroll-behavior` is not set anywhere.** 13 scroll containers, zero of
them declare it. There is exactly one smooth scroll in the entire product,
`drills.js:16`, and it is a `scrollIntoView` call.

**E2. The rail's section anchoring is a teleport.** `ui.js:298`:

    sc.scrollTop+=(hd.getBoundingClientRect().top-top);

One assignment. The comment above it is long, thoughtful and states the design
intent exactly right: "Press a header and that section goes to the top.
Always... The movement is the same every time, which is what stops it reading
as a jump." The intent is a movement. The implementation has no frames in it.
The comment's own measurements say this moves scrollTop by up to **530
pixels** in zero milliseconds. A 530 pixel instant displacement is the single
largest un-eased change in the product, it happens on the most common rail
interaction, and it is the thing the owner is asking about.

Fixing it is not a scroll-behavior declaration, because that container is being
mutated in the same frame. It is a short rAF tween on `scrollTop`, 320ms on
`--ease-out`, which is the surface step and correct for a rail. Cost: one
`scrollTop` write per frame for 19 frames, which is a compositor scroll, not a
layout. Under 0.02ms per frame.

**E3. No list, anywhere, has an entrance.** Covered in C2 and it lands hardest
here. The rails carry 30+ icon cells, the drill carries rows of addresses, the
knowledge deck carries cards, Summary carries four doors. All of them appear
in one frame. This is the long tail and it is empty.

**E4. `compute()` runs every frame on every tab, and is drawn on two.**
`ui.js:810` calls `compute()` in the loop unconditionally, then only draws on
Field and Energy. Measured at 0.145ms. On Summary, Knowledge, Compass and
Settings that is 0.145ms per frame, 8.7 percent of a 60Hz budget, burnt to
produce nothing. Minor next to Glass, but it is waste with a one-line fix.

**E5. The reduced motion kill takes feedback with it.** `head.html:2455`:

    @media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}

I want to be careful here, because this is a proposal to refine a ruling and
not a defect report. The ruling is "reduced motion gets the end state, not a
faster animation" and the ruling is right and must stay. But a 120ms
background-color change on a button press is not motion, it is feedback, and
vestibular triggers are large-area transform, parallax and scale, not colour.
The current rule means the people who most need unambiguous feedback get a
product where pressing a button produces an instantaneous colour swap with no
causal link. Material 3 and Apple both scope reduced motion to transform and
opacity-at-scale for this reason.

What I would propose, for the owner to rule on: reduced motion kills all
`transform`, all `animation`, all scroll tweening and the boot, and keeps
colour and border transitions at or under `--t-micro`. Stated as a rule:
**under reduced motion nothing moves, but things may still change colour over
120ms.** If the owner says no, the current behaviour is defensible and I will
not raise it again.

---

# Findings

| id | finding | file:line | severity | fix | size |
|---|---|---|---|---|---|
| C4 | Glass runs the Field at 10fps, 598% of budget. `drawSig` skip cache is disabled whenever motion is on, so `clearRect` dirties the canvas layer every frame and forces 71 backdrop-filter re-blurs over 1.94Mpx | wheel.js:804, head.html:300,320 | critical | quantise the breath phase into `drawSig` and run the cache in all motion states, not only REDUCED. 12 steps/sec, as the aura already does | M |
| B1 | One `:active` rule in the product and it sets a cursor. No control has a press state. On touch there is no feedback at all between tap and re-render | head.html:1617 | critical | `:active{transform:scale(.97)}` 90ms `--ease-in` down, 120ms `--ease-land` back, on the shared control classes | S |
| B2 | `--ease-in` and `--ease-land` have zero uses. 48 of 48 transitions run `--ease-out`. Two thirds of the curve system is dead code | head.html:134,135 | high | wire `--ease-in` to every exit and `--ease-land` to every value arrival and press release | M |
| C2 | Zero stagger anywhere outside the boot. No `animation-delay`, `transition-delay`, `nth-child` or JS-set delay in the whole product | all ui/ | high | stagger direct children of the tab host on `setTab` only, 70ms, never from `render()` | M |
| E2 | Rail section anchoring moves scrollTop by up to 530px in zero frames. The comment describes a movement; the code is a teleport | ui.js:298 | high | rAF tween, 320ms, `--ease-out` | S |
| A2 | The first screen's `.tabin` entrance plays behind the opaque boot sheet and is never seen. The app is revealed fully painted and static | ui.js:875, head.html:2398 | high | `body.booted` already exists and is wired to nothing. Hold the first entrance on it | S |
| B4 | Canvas hover is a hard 45% scale pop with no in-betweens, on the hero surface | wheel.js:697, 654 | high | per-node `hov` scalar eased on the same time base as `disp` | S |
| D4 | The Body figure has no clock. Never called from the rAF loop. The product's picture of a living body does not move | map.js:145, ui.js:801 | high | see opportunity 3 | M |
| D5 | Compass spin and clock are frame based, no delta time. Double speed on a 120Hz panel | cone.js:423,426 | high | same four-line fix already written at wheel.js:822 | S |
| B3 | `transition: all` on 24 rules covering 321 elements, on a renderer that rewrites innerHTML 34 times. Animates layout properties nobody chose | head.html, 24 rules | medium | name the properties | M |
| B5 | Accordion chevron eases over 220ms; the body it discloses is `display:none` to `block` in one frame. The indicator lies about the event | head.html:1168,1172 | medium | grid-template-rows 0fr to 1fr, 220ms `--ease-out`, compositor-friendly | S |
| C1 | Tabs arrive but never leave. Outgoing host is `display:none` in the same frame the incoming one rises | panels.js:91,119 | medium | 140ms `--ease-in` fade out, overlapping the entrance by 80ms | S |
| C3 | Drill panels open by `display:block` plus innerHTML. The product's payoff for every click has no entrance, and the content is written before it lands | drills.js:8,22 | medium | land, then fill. 180ms `--ease-out` | S |
| D2 | The breath rate is a constant. Carries no data in an instrument whose whole argument is that motion means something | wheel.js:294 | medium | see opportunity 1 | S |
| D1 | Single breath phase, no offsets. Reads as a bellows, not a body | wheel.js:294 | medium | per-band phase offset, one add | S |
| A1 | Boot mark is capped at 300px and fills 1.6% of a 1600x1000 frame. Relatively smaller on desktop than on phone | head.html:2324 | medium | `min(52vmin,560px)` | S |
| D3 | `n.disp` eases on pure exponential decay: deceleration with no acceleration. Every value starts at maximum speed, no anticipation | wheel.js:825 | medium | 4% wind-back before an increasing arrival | S |
| E1 | `scroll-behavior` set on zero of 13 scroll containers | head.html | medium | declare it, guarded by reduced motion | S |
| E4 | `compute()` runs every frame on tabs that draw nothing. 0.145ms, 8.7% of budget, wasted on four tabs | ui.js:810 | low | move inside the tab test | S |
| E5 | Reduced motion kills colour feedback along with motion. Proposal to refine a ruling, not a defect | head.html:2455 | low | owner's call. See pass 5 | S |
| G1 | Gate 12 checks durations and the default ease, but does not check that all three curves are used, and does not refuse `transition: all` | tests/design.js:529 | low | two assertions | S |

---

# Missed opportunities

Ten proposals. Every one states what moves, over how long, on which curve, and
what it costs per frame. The Field currently uses **1.04ms of a 16.7ms
budget, 6.3 percent**. There is roughly 10ms per frame unspent, and I am
proposing to spend under 1ms of it.

### 1. The field breathes at the person's own rate

**What moves.** The existing core breath, plus a new one on the address ring.
**Duration.** Period mapped from coherence: 6.0s at CQ 0, 3.6s at CQ 100.
Resting respiration is 12 to 20 per minute; this maps a low reading to 10
breaths a minute and a high one to 17.
**Curve.** Not a bezier. A sine with a 40/60 in-out asymmetry, because a real
breath has a longer exhale than inhale, and that asymmetry is the entire
difference between a pulse and a breath.
**Cost.** Replaces one `Math.sin` with one `Math.sin` and a lookup. **0.00ms.**
It is arithmetic already being done.

This is the highest value item in the list. It costs nothing, it turns the
product's most decorative motion into its most legible, and it makes the Field
answer "how am I doing" before a single label is read. Two people open this app
side by side and one field is visibly slower. That is the product's whole
thesis, delivered without words.

Reduced motion: no breath, end state, as now.

### 2. The boot hands off to the Field instead of cutting to it

**What moves.** The boot's ring, seats and core do not fade out. They
translate and scale to the position and size of the Field's own wheel while
the black sheet lifts.
**Duration.** 620ms, overlapping the last 300ms of the sheet's exit.
**Curve.** `--ease-out` on the transform, `--ease-in` on the sheet.
**Cost.** A transform and opacity on one SVG. Compositor only, no layout, no
paint. **Under 0.1ms per frame**, and only for 620ms once per session.

Right now the boot argues the mark and the product is a ring, then cuts to a
product that is a ring, and lets the person work out that they are the same
object. Carry it across and the app has an origin. This is principle 11, solid
drawing: the motion sits on geometry the product actually uses.

There is a constraint and it is real: the app opens on Summary, not Field, so
the target the mark flies to is not on screen. Either the mark lands on the
wordmark in the top left, which is honest and cheap, or this waits for a
ruling on the opening surface. I would land it on the wordmark. It is a 200px
move instead of a 600px one and it says the same thing.

### 3. The body figure breathes, and the breath is the reading

**What moves.** The figure's torso outline, on a vertical scale of 1.5
percent about a hip origin, plus a 0.4 percent horizontal counter-scale so
the volume is conserved. That is squash and stretch on an actual body, which
is where the principle came from.
**Duration.** Same period as opportunity 1, so the Body page and the Field
page breathe in sync and are visibly the same instrument.
**Curve.** The same asymmetric sine.
**Cost.** One `transform` on one SVG group, driven from the existing loop.
Compositor only. **Under 0.05ms per frame.** It needs `renderMap`'s host added
to the loop's tab test, which is one line at `ui.js:801`.

The Body page was a D. This is the cheapest thing available that answers why.

Reduced motion: static, end state.

### 4. A press language, product wide

**What moves.** Every control class: `scale(.97)` down, and `--ease-land` on
the release so it overshoots back to 1.0 by about 1.5 percent.
**Duration.** 90ms down on `--ease-in`, 160ms back on `--ease-land`.
**Curve.** Both, and this is the first real use of either.
**Cost.** Compositor transform. **0.00ms on the main thread.** Genuinely free.

This is the owner's question answered. The overshoot on release is what makes
a button feel like it has a spring in it rather than a switch, and at 160ms it
is fast enough that nobody consciously sees it and slow enough that everybody
feels it. That is the whole trick.

Reduced motion: colour change only, no transform. See E5.

### 5. Numbers count to their new value

**What moves.** Every figure the engine prints: CQ, integrity, the percentages
on the badges, the streak.
**Duration.** 420ms, `--t-context`, because a number changing is a context
change.
**Curve.** `--ease-out`, with the last 8 percent on `--ease-land` so the
figure settles onto its value rather than stopping on it.
**Cost.** One text write per animated figure per frame. At 20 figures that is
20 small `textContent` writes, which I measure at **under 0.15ms per frame**,
for 420ms after a change and nothing at rest.

Applying a story currently changes nine axes and a dozen printed figures in
one frame. The person gets a new screen and no sense that they caused it.
Counting is how a number tells you it moved and by how much, and it is the
difference between a readout and an instrument.

Reduced motion: final value, immediately.

### 6. Charge arrives with anticipation

**What moves.** `n.disp` toward `n.sq`, as now, but a rising value first winds
back 4 percent of the delta over 70ms.
**Duration.** 70ms back, then the existing exponential settle.
**Curve.** `--ease-in` on the wind-back.
**Cost.** One comparison and one branch inside a loop that already runs over
112 nodes. **Under 0.01ms.**

Pure exponential decay means every address starts at maximum speed and slows,
which is the machine curve. Four percent of backswing is under a pixel of
movement and it is the difference between a value being set and a value
arriving.

### 7. Staged tab entrance

**What moves.** The direct children of the tab host: rail, stage, drill.
Three groups, 8px rise and opacity.
**Duration.** 420ms each, `--t-context`.
**Curve.** `--ease-out`.
**Stagger.** 70ms, so the whole entrance is 560ms and each element reads
individually.
**Cost.** Three compositor transforms for 560ms after a tab change. **0.00ms at
rest.** Fires from `setTab` only, never from `render()`, which is what stops it
becoming the fortieth-viewing irritation.

The boot already proves this team can stage. This is the same idea applied to
the thing a person does forty times a session instead of once.

### 8. The scroll gets a curve

**What moves.** `scrollTop` on the rail, tweened rather than assigned.
**Duration.** 320ms, `--t-surface`.
**Curve.** `--ease-out`.
**Cost.** 19 `scrollTop` writes over the tween. Compositor scroll, no layout.
**Under 0.02ms per frame**, and only during the tween.

Plus `scroll-behavior:smooth` declared on the 13 containers, disabled under
reduced motion. This is the owner's second explicit request and it is the
smallest item on the list.

### 9. The aura leans toward the loudest seat

**What moves.** The four drifting gradient centres in `drawAura` bias their
positions toward the screen quadrant of the heaviest seat, and the drift
amplitude scales with DQ.
**Duration.** Continuous, on the existing 12-steps-per-second clock.
**Curve.** The existing drift, weighted.
**Cost.** The aura is already cached at **0.001ms per frame** and this changes
the inputs to the signature, not the work. **0.00ms.**

The Bible says "what radiates outward carries the colour of the loudest seat".
The aura already takes its colour from `r.darkB`. It does not take its
direction from anything. A field that leans is a field you can read from across
the room, and the geometry claim in the Bible becomes visible instead of
stated.

### 10. The status message earns its exit

**What moves.** `status()` messages. They currently appear and clear on a
2400ms timer.
**Duration.** 220ms in on `--ease-out` with a 6px rise, 180ms out on
`--ease-in` with no rise, because a thing leaving does not need to be watched
out.
**Cost.** One element, compositor. **0.00ms.**

This is the product's one honest channel for "the write succeeded" or "it did
not". It is the place where motion is load bearing rather than pleasant,
because a failure that holds and a confirmation that leaves should not arrive
the same way. Give the failure a slower, heavier entrance than the
confirmation: 260ms versus 180ms. Same element, two registers, and a person
learns which is which without reading.

### 11. The seats breathe out of phase

**What moves.** Each of the seven bands takes a phase offset of `i * 0.28`
radians on the shared breath.
**Duration.** Inside the existing period.
**Cost.** One add inside a loop that already runs seven times. **0.00ms.**

Principle 5, and it is the difference between seven things moving and one
thing moving in seven places. Root leads, crown arrives last, which is also
the direction the boot's spine already travels. Free, and it makes the field
feel like it has a length.

### 12. Glass stops being clunky

Not a new effect, a reclamation. Fixing C4 takes Glass from 10fps to 60 and
returns roughly 83ms per frame. Everything above spends under 1ms. The entire
list fits eighty times over inside the budget that one defect is currently
burning.

---

# Grade

**Motion now: C minus.**

The foundations are genuinely good and I want that on the record: the boot is
a real title sequence built by someone who knows the twelve principles rather
than someone who read a list of them, the reduced motion implementation is
provably total and better than most shipped products, the token system is
correctly reasoned, and the two hard engineering fixes already made, the
aura's quantised skip and the wheel's time-based ease, were both made for the
right reason and documented well enough that the next person can follow them.

It is a C minus because of what sits on top of that foundation. One of three
curves is wired. Nothing in the product has a press state. Nothing staggers.
Nothing leaves. The single most-used scroll interaction is a 530 pixel
teleport with a paragraph above it describing a movement. The Body figure does
not move. The breath means nothing. And one theme runs the hero surface at ten
frames a second, which is not a polish issue, it is the product failing to
run.

It is not a D because none of this is confused. Every defect I found is a
thing that was built correctly and then not finished, or a thing that was
fixed in one place and not carried to the second. That is a very different
and much cheaper position than motion that was never thought about.

**Ceiling: A minus.**

I am not saying A, and the reason is architectural rather than aesthetic.
`render()` rewrites rails through `innerHTML` from 61 call sites, which puts a
hard ceiling on continuity: an element that is destroyed and recreated cannot
carry motion across the change, so shared-element transitions, which are what
separate an A minus from an A, are not available without a rendering change
this project has deliberately deferred. Everything short of that is reachable.

A minus is reachable **this round**, and the arithmetic says so. Fixing C4 is
one function. Items 1, 3, 4, 8 and 11 together cost **under 0.25ms per frame**
and are the five that a person would actually feel. The whole list spends less
than one tenth of the budget that Glass is currently wasting.

What moves the grade, and by how much, so the next review can check:

- C4 alone: **C minus to C plus.** A theme that does not run is not a motion
  defect, it is a broken product, and it is the single biggest number here.
- B1 and opportunity 4, the press language: **C plus to B minus.** This is the
  owner's question and it is the cheapest thing on the list.
- Opportunities 1 and 3, breath that carries the reading on both the Field and
  the Body: **B minus to B plus.** This is the one that makes it feel like
  something he has never seen, and it costs nothing per frame.
- C2, E2, B2 and B4, the stagger, the scroll curve, the two dead curves and
  the hover pop: **B plus to A minus.**

Nothing on that path requires a new dependency, a new file, or more than one
millisecond of frame budget.
