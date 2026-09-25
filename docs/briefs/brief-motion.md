# Motion design

Section owner: motion and effects direction. It covers everything that moves or
is timed in the product: transitions, state changes, easing, choreography, the
canvas clocks, the boot, and the holds between one state and the next. The
static visual language and the screen layout are covered in other sections. A
colour or a size appears here only when the motion depends on it.

Every number in this section was read from the source at `atuned_src/` or
measured in the running build. Where the two disagree, the measurement is
given, and the disagreement is listed.

    build measured      da6cca6, source.html, 25 September
    browser             Chromium through Playwright, 1600 x 1000, 60 Hz
    profiles            blank (You), and Gordon, the heaviest reference case
    probes              scratchpad probe-motion.js, probe-rel.js, probe-seat.js

## 0. How to read this section

Each item carries a status. The port team should build to the status, not to
the prose around it.

| Status | Meaning | What the port does |
|---|---|---|
| **Shipped** | In the live build and working as its comment says. | Reproduce exactly. |
| **Shipped, defect** | In the live build, measured, and wrong against its own stated intent. | Reproduce the intent. Every defect has a stated fix in section 14. The owner rules on anything marked his call. |
| **Declared, dead** | The stylesheet declares a transition that never plays, because the element is rebuilt rather than updated. | Build the declared motion. The declaration is the intent. |
| **Prototyped** | Built and measured in `proto/`, not merged into the live build. | Do not ship without a ruling. Keep the spec to hand. |
| **Designed, not built** | Written in a design doc, never coded. | Same as prototyped. |

**Do not port from the source comments.** The comments in this codebase are
unusually good, and on motion several of them are stale. The seat stagger, the
ring's start time, the boot's length, the squash, the heartbeat and the
onboarding step are all described in comments with numbers the code no longer
runs. Section 13 lists every one. The numbers in this document are the running
values.

## 1. The motion philosophy, in the rules the code actually keeps

These are the rules the build follows. They are the why behind every table
below, so a new motion in the port can be judged against them.

1. **Every animation has a job, and the job is stated.** Nothing moves for
   decoration. The source comment above each motion names what it tells a
   person. A motion that cannot name its job is cut.
2. **Motion that carries data beats motion that decorates.** The band beside
   the wheel swings wider when coherence is low. The compass marker swings
   across the person's own history. The breath of the core is the one
   exception and it is flagged as such (section 5.4).
3. **A data mark never overshoots its value.** The overshoot curve is used on
   the boot and on one toggle knob, never on a reading. A bar that overshoots
   briefly shows a number the engine did not compute. Address charge, bars and
   dials all settle with no overshoot.
4. **Three curves, four durations, named for the job.** A hover and a tab can
   no longer drift to the same speed. Before the tokens existed, 381 of 384
   animated elements ran on the browser's default `ease`, a symmetric curve
   that decelerates as slowly as it accelerates and reads as mechanical.
5. **Arrive fast, settle long. Leave without being watched.** Entrances use
   ease out. Exits use ease in, or are cut. No surface animates its own exit
   except the tooltip.
6. **An entrance happens once.** The Field assembles once per session, not on
   every visit, because an entrance repeated on navigation becomes a tax.
7. **Reduced motion gets the end state, never a slower animation.** Somebody
   who asked the machine to stop moving did not ask it to move less. The clock
   freezes, the boot is removed on the first script pass, eases snap.
8. **Nothing over the live canvas carries a backdrop filter.** The wheel
   repaints every frame, and a backdrop filter over it re-reads and re-blurs
   the backdrop every frame. Measured: 60.5 frames a second with none, 12.0
   under the Glass lighting with them. Gate 13 enforces it for surfaces at
   rest. One overlay still breaks it (section 7, defect D3).
9. **The hit target is where the thing lands, not where it is mid flight.** An
   animating mark never drags its hit box with it, so a pointer that has found
   something keeps it.
10. **Easing on a canvas is driven by elapsed time, not by frame count.** A
    per frame fraction settles twice as fast on a 120 Hz panel. The wheel was
    fixed for this. The compass was not (defect D5).

## 2. The vocabulary

### 2.1 Curves

Defined once on `:root` in `shell/head.html:162`.

| Token | cubic-bezier | Progress at 25 / 50 / 75 % of time | 90 % reached at | Peak | Job |
|---|---|---|---|---|---|
| `--ease-out` | `(.22, 1, .36, 1)` | 0.765 / 0.961 / 0.997 | 38 % of the duration | 1.000 | A thing arriving. Fast off the mark, long settle. |
| `--ease-in` | `(.4, 0, 1, 1)` | 0.099 / 0.325 / 0.630 | 94 % | 1.000 | A thing leaving. It does not need to be watched out. |
| `--ease-land` | `(.34, 1.56, .64, 1)` | 0.816 / 1.087 / 1.060 | 30 % | **1.098 at 57 %** | A thing that lands. One overshoot of about 10 %, no ring. |

**Why three.** One curve cannot do all three jobs. An arrival wants the eye to
see the motion start and then lose interest, so it front loads: three
quarters of the travel is done in the first quarter of the time. A departure
wants the opposite, so the thing is still visible as it starts to go and gone
before the eye tracks it. A landing wants mass, and mass reads as a small
overshoot and a settle. That overshoot is ten per cent, larger than physics
for anything this light, because at these durations a true scale overshoot
reads as nothing.

`--ease-out` is effectively an ease out quint. `--ease-in` is Material's
accelerate curve. `--ease-land` is an ease out back.

**Four more curves exist, hand written, all in the boot or the skip.** They are
not tokens and they are listed so the port does not normalise them away:

| Where | cubic-bezier | Shape | Why it is not a token |
|---|---|---|---|
| boot ring draw | `(.32, .72, .26, 1)` | softer ease out, 90 % at 49 % of time | A 1.55 s stroke draw on the token ease out is 90 % drawn in 0.6 s and then crawls. This keeps the pen moving visibly for the length of the draw. |
| boot sheet fade out, CSS | `(.4, 0, .2, 1)` | ease in out, Material standard | Ruled: "a fade in very very quick, a nice little ease in, ease out". The previous `ease-in` arrived at full speed and stopped dead. |
| boot black opener | `(.4, 0, 1, 1)` | literal of `--ease-in` | The black is the thing leaving. |
| skip fade | `.18s (.4, 0, 1, 1)` | ease in | Set inline by script. Off the duration scale (see 2.3). |

`micPulse` on the recording dot uses the keyword `ease-in-out`. It is an
infinite loop, which has no arrival and no departure, so neither token fits.

### 2.2 Durations

| Token | Value | Job | Argument, as written in the source |
|---|---|---|---|
| `--t-micro` | 120 ms | hover, press, focus | Below about 100 ms a change reads as a jump with no cause. Above about 150 ms the pointer has already left. |
| `--t-element` | 220 ms | one thing entering or leaving | |
| `--t-surface` | 320 ms | a panel, a rail, a lighting change | More area needs more time to be read as one move. |
| `--t-context` | 420 ms | a whole tab | The longest thing the product is allowed to take. |

Anything longer than 420 ms has to justify itself and needs a way out. The
boot is the only thing that exceeds it and it has one (section 3.6).

### 2.3 What is actually on screen

Measured by walking every tab in `TABDEF` and reading the computed transition
of every element:

| Duration and curve | Elements | Example |
|---|---|---|
| 120 ms, ease out | 4198 | `.vt`, `.btn`, chips, rows |
| 120 ms, ease out, two or three properties | 59 | `.cn-sb`, `.cn-b` |
| 220 ms, ease out | 98 | `#status`, switches, the chevron |
| 320 ms, ease out | 351 + 18 | slider tracks; `html` and `body` |
| 420 ms, ease out | 14 | bars, the Body aura |
| 120 ms, ease in | 8 | `.tip` at rest, its exit |
| **180 ms, browser `ease`** | 8 | **`.cn-nr`, the compass name rows. Off both scales. Defect D11.** |

Also in the stylesheet, on elements the walk did not reach on a blank profile:
`.bal-f` at `width .3s`, off the scale. It is also dead (section 11).

Gate 12 (`tests/design.js:531`) asserts the token rule, but only on the
default tab. That is how the compass rows got through.

### 2.4 Time based easing on a canvas

A CSS transition carries its own clock. A canvas does not, so the wheel eases
its values itself. The form used everywhere it has been done correctly:

    k = 1 - exp(-rate * dt)          dt in seconds, clamped to 0.1
    value += (target - value) * k

The rate is chosen so that at exactly 60 Hz it matches a per frame fraction
the design was tuned against: `rate = -ln(1 - f) * 60`. For the wheel's
address ease, `f = 0.14`, so `rate = 9.05` per second.

**Why the clamp.** A tab that was hidden for a minute reports one enormous
frame. Without the clamp every value snaps to its target in one step, which is
the jump the easing exists to prevent.

### 2.5 The clocks

There are three.

| Clock | Where | Advances | Frozen under reduced motion | Notes |
|---|---|---|---|---|
| `S.t` | `ui/ui.js:974` | real seconds, per frame delta clamped to 0.05 s | yes | Drives the core breath, the core spin, the wash and the oscillating band. Measured: 1.017 per 1.003 s of wall time. Only advances while the loop runs, which is always. |
| `CONE.t` | `ui/cone.js:561` | **1/60 per frame, not per second** | yes | Frame dependent. Defect D5. Drives the compass souls and marker. |
| `ENTER_T0` | `ui/wheel.js:672` | `performance.now()` at first Field arrival | set to 0, which reads as complete | The one shot assembly. |

The master loop (`ui/ui.js:973`) runs every frame for the life of the page. On
the Field it draws the wheel, the wash and the oscillating band. On the Body
tab it draws the wash only. Elsewhere it only computes. The compass runs a
second loop of its own while it is open.

## 3. The boot

### 3.1 What it is for

A loader that spins says only "wait". This one says what the instrument is
before a person has entered anything: a spine rises root to crown, seven seats
take light in order, a ring of addresses closes around them, a halo settles
over the crown, and the name arrives. By the time it clears, somebody who has
never seen the product has been shown its shape.

It is also the first thing a person sees every single launch. It is not
skipped automatically on a return visit and no flag is stored, by ruling: "it
is the overture and it is worth watching". Section 3.8 flags what that costs at
forty launches.

### 3.2 The geometry

One SVG, `viewBox 0 0 200 200`, sized `min(42vmin, 300px)` square, centred on
a black `#000` sheet, `position: fixed; inset: 0; z-index: 9999`, flex column,
gap 26 px between the figure and the wordmark. The sheet is
`pointer-events: none`, so a press goes through it to the app (and is caught,
section 3.6).

| Element | Geometry | Paint |
|---|---|---|
| spine `.b-spine` | line x=100, y 160 → 40, length 120 | stroke `--edge-2`, 1.4 |
| seats `.b-s1` to `.b-s7` | circles on x=100 at y = 160, 140, 120, 100, 80, 60, 40; r = 4.6, 4.6, 4.6, 5.4, 4.6, 4.2, 4.2 | Root `#D6524C`, Sacral `#D8924E`, Solar `#DABF6A`, Heart `#5FD5A6`, Throat `#5EBBDB`, 3rd Eye `#7D93E0`, Crown `#A77EDB` |
| core `.b-core` | circle (100,100) r 9 | `--accent` |
| ring `.b-ring` | circle (100,100) r 62, rotated -90° so the draw starts at 12 o'clock | stroke `--accent` 1.6 at .85 |
| address ticks `.b-addr line` | 24 ticks, 15° apart, from r 62 to r 68, starting at 12 o'clock, clockwise | stroke `--accent` 1.5 |
| halo `.b-halo` | ellipse (100,21) rx 13 ry 4.4 | stroke `--au`, the gold, 1.4 |
| wordmark `.boot-wm` | below the SVG: the name at 23 px, then "Powered by" over "Source OS" at 9 px, 38 px under it | |

The seat colours are the palette values, copied, because the boot runs before
any script can read the palette. Gate 11 fails if they drift.

### 3.3 The timeline, as it runs

All times are from when the document's styles first compute, which is within a
few milliseconds of navigation. Every animation below uses `both` or
`forwards` fill.

| t start | t end | Element | Property, from → to | Duration | Curve | Keyframes |
|---|---|---|---|---|---|---|
| 0.00 | 0.34 | black cover `.boot::before` | opaque black over everything, holding | | | the opening beat |
| 0.34 | 0.80 | black cover | opacity 1 → 0 | 460 ms | `(.4,0,1,1)` | `bootIn` |
| 0.62 | 2.72 | core | scale and opacity | 2100 ms | land, **per segment** | `bootCore`: 0 % scale .35 op 0; 14 % scale .22 op 1; 46 % scale 1.22; 74 % scale .92; 100 % scale 1 |
| 0.92 | 1.94 | spine | stroke-dashoffset 120 → 0, draws root to crown | 1020 ms | ease out | `bootSpine` |
| 1.18 | 1.84 | Root seat | scale and opacity | 660 ms | land, per segment | `bootSeat`: 0 % scale .2 op 0; 60 % scale 1.5 op 1; 100 % scale 1 op .92 |
| 1.30 | 1.96 | Sacral | same | | | |
| 1.42 | 2.08 | Solar | same | | | |
| 1.54 | 2.20 | Heart | same | | | |
| 1.66 | 2.32 | Throat | same | | | |
| 1.78 | 2.44 | 3rd Eye | same | | | |
| 1.90 | 2.56 | Crown | same | | | |
| 1.92 | 3.47 | ring | stroke-dashoffset 390 → 0 (circumference 389.6), clockwise from 12 | 1550 ms | `(.32,.72,.26,1)` | `bootRing` |
| 2.080 | 2.700 | tick 1 at 12 o'clock | opacity 0 → .5 | 620 ms | ease out | `bootAddr` |
| +0.042 each | | ticks 2 to 24, clockwise | same | | | |
| 3.046 | 3.666 | tick 24 | same | | | |
| 2.62 | 3.67 | halo | scale about its own centre, opacity | 1050 ms | land, per segment | `bootHalo`: 0 % scale .6 op 0; 55 % scale 1.14 op .95; 100 % scale 1 op .8 |
| 3.20 | 4.12 | wordmark | opacity 0 → 1, translateY 8 px → 0 | 920 ms | ease out | `bootWm` |
| 4.12 | | everything | still | | | the held end |
| **≈ 5.45** | | **the sheet** | **removed from the document by script, at full opacity** | | | see 3.5 |
| 7.02 | 7.26 | the sheet, only if no script ran | opacity 1 → 0, visibility hidden | 240 ms | `(.4,0,.2,1)` | `bootOut` |

**A note for the port on keyframe curves.** A CSS `animation-timing-function`
applies to each interval between keyframes, not to the whole animation. So
`bootCore` runs the overshoot curve four times: 0→14 %, 14→46 %, 46→74 %,
74→100 %. Each segment overshoots its own target by up to ten per cent of its
own delta. A port that applies the curve once across the whole timeline will
produce a visibly softer core. Reproduce it per segment.

### 3.4 The choreography, and why each beat is where it is

**The opening beat.** For a third of a second there is nothing, on purpose.
Black at each end is the oldest device in title work: the room goes dark
before anything arrives. The black is a separate layer over the figure, so the
figure cannot flash before the cover has begun to lift.

**Anticipation on the core.** The core appears at .35 of its size and first
draws in to .22 before releasing past its size to 1.22. Nothing in nature
starts from rest at full speed, and the draw in is what makes the release read
as a release.

**Staging, root to crown.** The spine draws upward, starting at 0.92 s while
the core is still in its backswing. Then the seats arrive one at a time in the
order the body is read in every other surface of the product.

**The seats are born at the heart and thrown outward.** This is the
distinctive part and no comment in the source says it. Every seat's
`transform-origin` is `100px 100px`, the centre of the figure, not its own
centre. So a seat scaling from .2 to 1.5 and back to 1 does not grow in place:
it starts close to the heart, is thrown out along the spine past its own seat,
and falls back into it. Measured with the animations paused and scrubbed:

| t | Root seat centre y (rest 160) | Heart (rest 100) | Crown (rest 40) |
|---|---|---|---|
| 1.20 s | 129 | 100 | not yet visible |
| 1.35 s | 194.1, past its seat by 34 units | 100 | not yet visible |
| 1.58 s | 190 | 100 | not yet visible |
| 1.84 s | 160, landed | 100 | 88 (invisible, pre delay) |
| 2.40 s | 160 | 100 | 40.7, landing |

The Heart does not travel at all: it sits on the origin and only swells. Root
and Crown travel furthest, in opposite directions. The figure radiates from
its centre, which is where the core has just released from. That reads as the
seats being emitted by the core rather than placed on the spine.

**Timing.** The seats are 120 ms apart. The source comments say 90 ms; the
code runs 120. At 120 the seven read as one rising movement that can still be
counted, inside the 60 to 110 ms sibling band plus a little, which suits a
sequence the viewer is meant to count.

**Overlapping action.** The ring starts at 1.92 s, 20 ms after the Crown seat
starts and while Throat, 3rd Eye and Crown are still landing. Nothing waits
for the thing before it to stop.

**The ring as the pen.** It draws clockwise from 12 o'clock over 1.55 s. The
24 address ticks fade in behind it at 42 ms spacing, also clockwise from 12.
Forty two milliseconds is under the 50 ms threshold at which siblings read as
separate events, deliberately: the ticks read as one sweep trailing the pen,
not as twenty four arrivals.

**Secondary action.** The gold halo arrives at 2.62 s, under the main action
and late, so it reads as a consequence rather than as another event. It
breathes once, to 1.14 and back to 1, and settles at opacity .8.

**The name.** Last, 8 px of rise over 920 ms, at 3.20 s. It finishes at 4.12 s
and the whole figure then stands still.

**What was cut, and why it stays cut.** A pulse on the whole figure read as a
loading spinner. A non uniform squash on the core read as a wobble: a standing
body that changes width is made of rubber. Both were ruled out ("get rid of the
squash and stretch from the intro animation. Doesn't look good."). The core's
scale is uniform. The figure assembles and then holds. Do not reintroduce
either.

### 3.5 What it protects against: the silent truncation

The boot fades on a CSS animation with a forwards fill. That needs no script,
which is the problem it was built around.

1. **A file that arrives short.** The build is delivered packed: a gzip of the
   whole app, base64'd, with a few hundred bytes of loader that inflates it.
   A truncated gzip stream cannot inflate. A truncated plain script parses
   most of the way and leaves a shell. Either way, if the boot sheet simply
   fades on schedule, it uncovers a complete looking application with an
   empty tab bar and nothing in the middle. That is exactly what the owner saw
   in a preview pane, and it read as a dead build.
2. **So the sheet is not trusted to mean "ready".** A separate script block,
   `shell/guard.html`, runs before everything else and cannot be killed by a
   parse error in the main block. It watches for `window.error`, unhandled
   rejections, and one timer.
3. **The watchdog timer is 8000 ms.** If the app has not called `__bootOk` by
   then, the guard paints a full screen message. It checks for the end of file
   marker to say whether the file is short or the script stopped, and prints
   the build stamp first.
4. **The guard waits for the document before judging it.** An error fired
   while the parser is inside the script block would otherwise report every
   syntax error as a truncated file. It waits for `DOMContentLoaded`, with a
   1500 ms ceiling.
5. **The guard takes the boot sheet off by hand** with `display: none`,
   because the sheet's CSS fade would otherwise uncover the message and cover
   it again.
6. **The `noscript` notice** covers the case of scripts off entirely.
7. **The packed loader's own length check sits ahead of the payload.** The
   first cut put it inside the loader, and a cut file cuts the loader too:
   measured at 80 % it sat on its opening line forever. Measured whole and cut
   at 100, 99, 95 and 50 % at both widths: whole it opens, cut it says so.

A partial start, where some rail sections failed, is not a dead app. It gets
one quiet dismissible line at the bottom of the screen, no motion, and the
product stays usable.

**For the port.** The desktop app will not be delivered as a truncatable file,
but the principle ports: **the boot's exit must be caused by the app saying it
is ready, never by a timer alone.** If the port's boot is a timeline, gate its
end on the ready signal and give the ready signal its own watchdog.

### 3.6 Removal, and the skip gesture

**The fade is CSS, the removal is not.** An element at opacity 0 still covers
the app, still takes pointer events and is still in the tab order. So on
`animationend` of `bootOut`, or on a timer floor, script removes the node and
adds `booted` to the body. Gate 11 asserts the node is gone.

**The skip.** `pointerdown` or `keydown`, anywhere, once, in the capture phase:

    sheet opacity 1 → 0       180 ms  cubic-bezier(.4,0,1,1)   (inline style)
    node removed              at 190 ms
    the click that follows    swallowed once, in capture
    the swallow listener      expires after 700 ms if no click comes

**Why the click is eaten.** The sheet does not take the pointer, so the press
that skips also lands on whatever is under it. Pressing over the tab strip
used to skip the boot and navigate to that tab in the same gesture. Stopping
`pointerdown` alone was not enough, because the `click` is dispatched anyway.
Measured before the fix: a press over the Energetics tab moved the surface.

**The instruction line is gone, the gesture stays.** Ruled 21 September: "the
loading screen, at the very bottom there is some text that says press any so
and so, get rid of that." Any press or key still goes straight in. Gate 14 now
asserts the line is absent and that a press still clears the sheet. The port
reproduces the gesture and does not draw the line.

**Timing of the skip, for fidelity.** 180 ms is between `--t-micro` and
`--t-element`. It is a departure, so ease in is correct. If the port
normalises it, use 120 ms ease in, not 220.

### 3.7 Reduced motion

`.boot { animation: none; opacity: 0; visibility: hidden }` under
`prefers-reduced-motion: reduce`, and the script removes the node on its first
pass. A person with reduced motion never sees the boot, not a short one.

### 3.8 Measured defects in the boot

**D1. The ending never plays. Shipped, defect.** On 20 September the boot was
lengthened by ruling ("two seconds longer ... the figure settles at 4.06 and
stands still for the rest"): `bootOut` moved from 5.02 s to 7.02 s. The script
floor that removes the node was not moved and still fires at 5450 ms. Measured:
the sheet sits at opacity 1 until about 5.45 s and is then removed in one frame.

So with scripts running, which is always:

- the eased 240 ms fade out is never seen,
- the "closes on black" bookend is never seen,
- the app appears by a hard cut from a full opacity figure.

The port should reproduce the intent: hold to 7.02 s, fade over 240 ms on
`(.4,0,.2,1)`, remove at 7.26 s. The fix in the source is one number
(section 14). **His call.** The effective 5.45 s is what the owner has been
using since the 20th. The ruling says 7.26. He should see both before the
port picks one.

**Fatigue at forty.** 5.45 s, or 7.26 s as ruled, at every launch, with no
visible way out now that the line is gone. Forty launches is 3.6 minutes of
overture at the current length and 4.8 at the ruled one. Anything over 600 ms
needs a reason and a way out; the reason is strong on the first launch and
weak on the fortieth, and the way out is now invisible. **His call.** One
option: return visits get the figure only, 0.34 s to 2.72 s, then the fade.

## 4. Tab switching

**Shipped.** One arrival, no departure.

    outgoing host      display: none, same frame. no exit animation.
    incoming host      class .tabin
    @keyframes tabIn   from { opacity: 0; transform: translateY(6px) }
                       to   { opacity: 1; transform: none }
    duration           --t-context, 420 ms
    curve              --ease-out
    fill               both

**Why.** Switching surfaces was a single frame cut: one host to `none`, the
next to `flex`. That gives the eye no direction and no sense that anything
moved rather than was replaced. Six pixels of rise over the context step is
the smallest move that reads as arrival. The outgoing surface is not animated
because it does not need to be watched leaving.

**The restart.** Adding a class that is already present does not restart a
keyframe, so the second visit to a tab would animate nothing. `setTab` removes
the class, reads `offsetWidth` to force a layout, and adds it back. This is
the one deliberate forced reflow in the product (`ui/panels.js:143`). The
port needs the equivalent: an entrance that restarts on every arrival.

**What rises.** The host for the tab looked up by its key, never by position:
the canvas itself on the Field, the settings host on Settings. The surface is
rendered synchronously before the animation starts, so the whole populated
surface rises, not an empty frame.

**The tab indicator does not travel.** The pressed tab carries a 2 px accent
underline as a pseudo element (`left 8px; right 8px; bottom -1px`). It appears
on the new tab and vanishes from the old one in the same frame. There is no
sliding indicator.

**The pressed tab's type morphs.** `.tabtop` carries `transition: all 120ms
ease-out` from `.vt`. On press, `font-weight` goes 350 → 500 and
`letter-spacing` .012em → 0, and the colour goes to the accent. Because the
typeface is Inter as a variable font, the weight interpolates continuously
over 120 ms rather than switching. Reproduce this only if the port also uses a
variable weight axis; with static weights it becomes a jump, and a jump is
better handled by not transitioning weight at all. Frame cost: layout on the
strip for 120 ms.

**Scroll and focus on arrival.** A new surface starts at its own top. Focus
moves to the pressed tab button with `preventScroll`, because the browser was
scrolling a still focused button from the old surface back into view. The
scroll reset runs twice, once now and once on the next frame, because
renderers that lay out late would otherwise win. None of this is animated.

**The compass tab** starts its own frame loop on arrival and stops it on exit.

**Reduced motion.** The global rule kills the animation. The surface appears
in its end state.

## 5. The Field

The Field is the canvas wheel: a core at the centre, the shell of 112
addresses in seven seat bands, rings of laws, archetypes and domains at deeper
depths, and a slow wash behind everything. It repaints every frame while it is
on screen.

### 5.1 The assembly on arrival

**Shipped, defect** (it runs where nobody can see it, D2).

His question: "the field almost looks like a character, and the elements are
separate, so what if they each moved into place. And a colour animation of the
bands. As a one time event."

So the seven seats arrive in turn, Root first and Crown last, the order the
body fills and the order every reading in the product is given in. That sweep
is the colour animation of the bands: the seats are the rainbow, and taking
them in turn is the only way to see they are seven things and not one
gradient.

    ENTER_SPAN     380 ms    each part's own arrival
    ENTER_STAGGER   62 ms    between seats, Root = 0 ... Crown = 372 ms
    ENTER_CORE     300 ms    the core's delay
    ENTER_TOTAL    900 ms    when the entrance is declared over
    curve          1 - (1 - k)^3, a cubic ease out, computed in script

| Part | Starts | Ends | What moves |
|---|---|---|---|
| Root seat addresses | 0 ms | 380 ms | nothing drawn before its turn; then each address swings the last 0.19 rad (10.9°) into place, from the clockwise side, and its charge depth grows from 0 to its value |
| each next seat | +62 ms | +380 ms | same |
| Crown seat addresses | 372 ms | 752 ms | same |
| core | 300 ms | 680 ms | radius from 0.34 to 1.0 of its size, never from zero |
| the six gates at the core | 380 ms | 760 ms | size from 0.4 to 1.0 |

**Why a seat that is not due yet is not drawn at all.** A band that is merely
dim is a band that is already there. Absence is what makes the sweep visible.

**Why the core never starts at zero.** A core at zero is a reading that has
vanished, and it is the only thing on the surface. The first cut ran 1.9 s
with the core absent for 1.28 s and the functional gate failed 44 checks: for
over a second the instrument was not there. An entrance that has to be waited
out is a loading screen.

**Why once per session.** It fired on every arrival, so a person who stepped
to Knowledge and back watched it reassemble, which turns an entrance into a
tax on navigation. It also made every measurement within 900 ms of a tab
change a race against the animation.

**Why the hit targets do not travel.** Every address registers its target at
its final angle from the first frame. A box that moved with the animation
would slide out from under a pointer that had already found it.

**D2. It plays under the boot.** The app opens on the Field. `setTab(FIELD)`
runs at start up, which calls `enterStart()`. Measured: the entrance starts
166 to 173 ms after navigation and ends about 1.07 s. The boot sheet is opaque
until about 5.45 s. The entrance is spent behind the boot, and because it is
once per session it never plays again. A person only ever sees it if they skip
the boot within the first second.

The intent is better than the build here, and the fix makes the two set pieces
into one. The boot draws seven seats on a spine, root to crown, as "this is the
shape". If the Field's own seats then assemble root to crown the moment the
boot clears, the product says "and this is yours" with the same staging. The
port should start the assembly on the boot's removal (or on skip), not on the
first tab set. Section 14 has the exact change.

### 5.2 The address charge ease, which is the most important motion in the product

**Shipped.** Every address has a target charge `n.sq` and a displayed charge
`n.disp`. Every frame on the Field:

    rate = -ln(0.86) * 60 = 9.05 per second
    k    = 1 - exp(-9.05 * dt),  dt clamped to 0.1 s
    disp = disp + (sq - disp) * k

    63 % of the way     110 ms
    90 %                254 ms
    95 %                331 ms
    99 %                509 ms

Measured, one address released from 6.567 to 0: 1.29 at 153 ms, 0.216 at
350 ms, 0.035 at 550 ms. Pure exponential. No anticipation and no overshoot,
by rule 3: a data mark never shows a value the engine did not compute.

**What it carries.** Every change to a charge is shown as the addresses
swelling or draining at the same rate, whatever caused it:

- a drag on an address (the address trails the pointer by this ease, which is
  the follow through that makes a drag feel like it has mass),
- a story committed,
- a release run,
- an undo or a redo,
- a profile switch.

Commit swells and undo drains at the same rate, so the two read as one
reversible action.

**Deferred consequence, and it is a good accident.** `disp` is only updated
inside the Field's draw, and the draw only runs while the Field is on screen.
So a story committed on the Story tab does not animate anywhere. The addresses
hold their old value. When the person returns to the Field, the charge lands
then, over about half a second, in the same beat as the tab's 420 ms rise.
The consequence arrives where the person can see it. Keep this in the port:
the displayed value must not advance while the canvas is off screen.

**What the ease drives.** The depth an address reaches into the shell
(`U*0.016 + ld*U*0.088`, where `ld = disp/10`), its gradient alpha, its glow
at 6.5 and above (shadow blur 16 in its own colour at .9), and a red rim at 9
and above (`#FF2E1F` at .85, 1.4 px). All of them move together because they
all read `disp`.

**Reduced motion.** `disp` snaps to `sq`. The canvas is not redrawn at all
while nothing changes: a signature of view, tab, profile, hover, pin,
lighting, zoom, pan, total charge and coherence is compared each frame and the
draw is skipped on a match. Before this, reduced motion measured slower than
motion, because it repainted an identical 922 by 913 surface every frame.

### 5.3 Hover and press on the wheel

**Shipped, defect D8** (no easing).

| Target | Hover | Press |
|---|---|---|
| address | 2 px outline in the gold, same frame. cursor `ns-resize` | mouse: arms a drag. vertical drag writes charge at 1 unit per 22 px, one undo step per drag. touch: never writes, opens the address |
| saboteur, complex, hyper, character beads | bead scale 1.45, a radial glow of 3.4 × its radius at .5 alpha, and its name, same frame | pins it and opens its reading |
| seat band | cursor pointer | opens the seat's reading |
| core | grab space | a press that does not move opens the coherence reading; a press that moves pans |
| empty canvas | cursor crosshair | pans |

The tooltip for canvas marks (`#probe`) fades over 120 ms ease out and follows
the pointer at an offset of 18 px with no easing on position.

Every canvas hover is a same frame change, which is outside the 80 to 150 ms
micro range the rest of the product keeps. It reads as a flicker on a fast
sweep across the ring. The feather design proposes 0.21 per frame (14.1 per
second as a rate, 90 % in about 160 ms) on the hover highlight, the same form
as the charge ease so the two cannot drift to different feels.

**Why touch does not write.** A thumb landing on the wheel to scroll dragged
the value under it and saved it. Measured at 390: a 60 px drag moved a charge
from 8.0 to 10.0 and the page did not scroll. On a coarse pointer the drag does
not arm, vertical panning goes to the page, and a tap reads.

### 5.4 The core breathes

**Shipped.** The core's radius is multiplied by `1 + 0.05 * sin(1.4 * S.t)`.

    period      4.49 s, about 13.4 breaths a minute
    amplitude   ±5 % of the radius
    also moves  the glow halo, whose radius is a multiple of the core's

**Why this rate.** 13.4 a minute is inside resting adult respiration, 12 to
20. It is the Field's "alive at rest" motion: when nothing is happening, the
centre of the figure is still breathing. At 5 % it is under the threshold where
motion demands attention and over the threshold where it is invisible.

**The one number on the Field that is not a reading.** The rate and depth are
the same for everybody. A person at coherence 18 and a person at 88 breathe
identically, on an instrument whose subject is a nervous system.

**Prototyped, not shipped:** the breath rate as the reading
(`DESIGN-feathers.md`, `proto/feather/`):

    period      lerp(2.0 s at CQ 0, 5.0 s at CQ 100)
    amplitude   lerp(0.010 at CQ 0, 0.030 at CQ 100) of the radius
    phase       per seat, seatIndex / 7 * 1.05 rad, so the Root leads and the
                Crown arrives about a sixth of a cycle later

Slow and deep against fast and shallow, which is what an autonomic system
does. The seat phase makes the figure breathe as a wave up the body rather
than pumping. The avatar prototypes (`proto/avatar/`) port the same rule with
a full seventh of a cycle between seats. Not merged. His call.

**Reduced motion.** No breath.

### 5.5 The core opens as you zoom in, and its layers turn

**Shipped.** Past zoom thresholds the core resolves into feathers, each a
radial rachis with barbs whose length is a reading out of ten. Three layers
rotate slowly, at different rates, two against one:

| Layer | Appears from zoom | Direction and rate | One revolution |
|---|---|---|---|
| the 21 laws | 3.40 | +0.05 rad/s | 126 s |
| the 7 seats | 2.30 | -0.03 rad/s | 209 s |
| the triad | 1.45 | +0.015 rad/s | 419 s |

**Why counter rotation.** Layers turning at different rates and directions
read as depth, the way parallax does. At these speeds it is only noticed if
the eye stays, which is the right level for a figure a person is studying.

Behind the feathers the sphere goes from opaque to a wash as the layers come
in (fill alpha `1 - 0.62 * open`) so the interior reads as inside, the
specular highlight fades out (it is the one mark that says solid), and the core
grows up to 1.95 times to give the parts room.

**Reduced motion, defect D15.** The spin goes to zero and eleven pairs of the
thirty one feathers sit exactly on top of each other. The feather design
removes the spin and seats every feather in its own sector, which fixes it.

### 5.6 Zoom resolves the figure: time is the person's gesture

**Shipped.** This is not an animation on a clock, and it is the most unusual
motion decision in the product. Each layer's opacity is a function of zoom:

    alpha(z) = clamp((z - threshold) / (threshold * ramp), 0, 1)

| Layer | Threshold | Ramp | Fully in at | Notches of scroll to cross |
|---|---|---|---|---|
| core: triad | 1.45 | 0.42 | 2.06 | 3.1 |
| core: seven seats | 2.30 | 0.42 | 3.27 | 3.1 |
| core: 21 laws | 3.40 | 0.42 | 4.83 | 3.1 |
| shell: axis glyphs on carrying addresses | 1.55 | 0.30 | 2.02 | 2.3 |
| shell: names and held/installed pairs | 2.05 | 0.30 | 2.67 | 2.3 |
| atoms: one line per story that put charge there | 2.60 | 0.26 | 3.28 | 2.0 |
| depth ladder adds a layer at | 2.2, 3.2, 4.2 | step | | |

One scroll notch multiplies zoom by 1.12. The `+` and `-` keys by 1.25. The
range is 1 to 7. The point under the pointer stays fixed while the scale
changes.

**Why a ramp two to three notches wide.** A layer that switched on at a single
threshold was reached by accident or not at all: at a ceiling of 7 with atoms
at 5.20, a scroll went 4.89 then 7 and passed straight over the layer. A ramp
two notches wide cannot be skipped, and a layer arrives as the person commits
to looking closer, at the rate they choose. The person scrubs the timeline.

**Only what is carrying grows.** An address below charge 4 does not move at
any zoom. A hundred and twelve labels at once is noise.

**Zoom itself is not eased. Defect D12.** Each notch jumps. More importantly,
`F` and double click reset from as far as 7 to 1 in one frame, and every
resolved layer disappears at once. Tweening zoom and pan with the charge ease
would make the atomisation run backward as the view returns, which is the
figure explaining itself in reverse. Reduced motion: snap, as now.

### 5.7 The wash behind everything

**Shipped.** A canvas behind the app, painted at one eighth resolution and
stretched, with no CSS filter. The bilinear upscale is the blur, for free.
Measured with the old 120 px CSS blur at full size: 7.7 frames a second.

    a central gold glow         radius lerp(.20, .58) of the viewport by CQ
    four drifting blobs         warm (Heart or Root colour) and lead (the darkest seat)
                                alternating, near the corners, each drifting ±5 %
                                of the viewport on its own sine
    drift periods               70, 78, 87, 100, 116 s
    canvas opacity              .15 (dark) or .16 (light), plus radiance × .24
    clock                       S.t × 0.09, quantised to 12 steps a second
    skip rule                   the paint is skipped when nothing in its signature changed

**Why so slow.** The wash is the area of effect of the shadow weight. It is
atmosphere and must never be noticed moving; at 70 to 116 second periods it is
only seen as having moved. Quantising to 12 steps a second costs nothing
visible at that speed and saves most of the paint.

**Reduced motion.** The clock is pinned. It paints once.

### 5.8 The oscillating band beside the wheel

**Shipped.** A vertical scale, 0 to 100, with a marker at the person's
coherence. The marker drifts inside a band whose width is itself a reading:

    band width, points     2.5 + (1 - CQ/100)^2 * 26
                           CQ 0: 28.5   CQ 20: 19.1   CQ 50: 9.0   CQ 80: 3.5   CQ 100: 2.5
    drift                  sin(0.55 t) * 0.62 + sin(0.23 t + 1.1) * 0.38
                           times half the band width
    periods                11.4 s and 27.3 s

**Why.** Tight alignment leaves little room to wander, and a decohering field
ranges wide. A person at 20 sees their marker wander nearly ten points either
side. A person at 90 sees it barely move. That is motion carrying data, and it
can be read with the labels off. Two incommensurate sines never repeat, so the
drift never becomes a visible loop, which is what keeps it tolerable at forty
viewings.

**How it moves.** The SVG is built once per reading. Every frame after that,
only one group is moved, by `transform: translateY()` with `will-change:
transform`, and only when the offset changes by more than 0.01 px. Before
this, the whole SVG was rewritten every frame: one forced layout and one style
recalculation per frame, measured at 59.96 a second.

**Reduced motion.** No drift, so the signature never changes and nothing is
rewritten.

### 5.9 Static geometry that reads as motion

**Shipped.** Not animated, and listed because it belongs to the motion
language. At the Chains and Blueprint depths, the chords between addresses and
their patterns are quadratic curves whose sag is the person's susceptibility
at that connection: `pull = base * (1.28 - 0.62 * tension)`. A connection the
person is susceptible at runs taut and nearly straight; one they are not
susceptible at hangs slack. A person who has pulled a rope reads the tension
with the labels off. Chord width and alpha scale with the pattern's weight, so
the heaviest reads about four times the lightest.

## 6. The compass

A second canvas, its own loop, an axonometric figure: an arrow up and an arrow
down meeting at a neck, eight seat coloured meridians, a room at the median
band with souls moving in it, and the person's position on every axis joined
by a ribbon.

| Motion | Value | Why |
|---|---|---|
| idle spin | +0.0022 rad per frame, 0.132 rad/s at 60 Hz, one turn in 47.6 s | "The whole thing spins." Slow enough to be a property of the figure, not an event. |
| aim on hover | a name in the side rail sets a target; each frame moves 12 % of the remaining angle; the short way round; released inside 0.004 rad | Ruled: "hovering one spins the figure to that person, quickly, and never snaps." A target plus an ease is the only way to be quick and never snap. 90 % in 18 frames, 300 ms. |
| release | leaving the name drops the target, and the idle drift resumes from wherever the figure is | So it never snaps back either. |
| drag | 0.008 rad of spin per px horizontal; 0.004 of tilt per px vertical, clamped .08 to .92 | The clamp stops the figure tilting past the point where up stops reading as up. No inertia on release. |
| front row | the rail row for the meridian nearest the viewer lights: opacity .55 → 1 and a 2 px edge in the seat colour | The rail and the drawing point at each other. Read off the spin every frame, updated only on change. |
| the souls | 18 dots in the median room. Phase offsets on the golden angle (2.399963 rad) so they never bunch. Each on its own speed, 0.20 to 0.46 rad per clock unit. Height swings ±9.2 on the 0 to 100 axis, inside the 40 to 60 room. They orbit at 0.4 × the spin. Alpha .34 + .14 × the swing | The median is where most people stand. Being told you are typical and being shown it are different readings. They are not data about anybody, which the caption says. |
| the marker | swings across the person's own range from their history (30, 90 or 365 day window): `sin(0.55 t) × half range`. Holds still with no history or one reading | Ruled: "a dot oscillating across the range the data says is yours." The same wobble for two people with nothing in common was decoration. |

**Flat is the default.** It opens with the tilt out, "start 2D flat, and then
you can click and mouse and move around it". Flat is the same figure at tilt
0.0001, so one renderer serves both.

**D4. Every control press starts another loop. Shipped, defect, measured.**
Flat, Regulation, Layers and the span buttons each call `coneOpen`, which
calls `coneTick` without cancelling the loop already running. Each press adds
a full frame loop. Measured: spin 0.130 rad/s, then 0.660 after four presses
(5 ×), and the clock 0.98 → 5.00 units a second. The figure visibly speeds up
with every press, and every loop redraws the whole canvas.

**D5. Frame dependent.** The spin, the aim ease and `CONE.t` all advance per
frame. On a 120 Hz display the compass turns twice as fast and its souls move
twice as fast. The wheel was fixed for exactly this; the compass was not.

**D6. Flat snaps.** The Flat toggle sets the tilt from 0.60 to 0.0001 in one
frame, on a surface whose ruling is "never snaps".

**D7 (part). Reduced motion still animates the aim.** The idle spin and the
clock stop under reduced motion, but the hover aim ease has no reduced motion
check, so hovering a name still turns the figure over 300 ms.

**D11. The rail rows** transition at 180 ms on the browser default ease, off
both scales.

## 7. The release ritual

### 7.1 What exists

**Shipped.** A release is a fixed overlay (`#rel`) that walks a plan of
thought lines, one per address per channel, on a fixed cadence.

    cadence            2.2 s per line (RUN.speed), a setInterval
    opening            3 lines at 2.2 s, 6.6 s, skippable
                       progress: three 7 px dots, the current and past ones filled, same frame
    the run            one line per 2.2 s tick
                       each tick rewrites the card: channel and line, the address
                       name at 30 px in its seat colour, the side (Right or Left)
                       offset 34 % toward its side, a progress bar, the count
    pause, stop        immediate
    cooldown           the arithmetic runs, the field is written, the done card replaces the run

**Why a fixed cadence and no animation per line.** The release is paced
reading, not a show. Seven lines at 2.2 s was 15.4 s before the first
address, and was cut to three for that reason. The rhythm is the design.

**The progress bar is dead. Declared, dead.** `.rel-prog i` declares a width
transition of 420 ms ease out, but the whole card is rewritten through
`innerHTML` on every tick, so the bar is a new element each time and jumps.
Build the declared motion: 420 ms ease out on width, updated in place.

### 7.2 The discharge

There is no discharge effect on the release card. **The discharge is the
charge ease on the wheel** (section 5.2): when the cooldown writes the field,
every released address drains from its old depth toward its new one at 9.05
per second, 95 % in 331 ms, and its opposite pole fills.

**D3. It plays behind a blurred sheet at 18 frames a second. Shipped, defect,
measured.** The overlay has `backdrop-filter: blur(10px)` over a 76 % ground.
On the Field, which is where a release is watched, that is the exact case gate
13 forbids. Measured on Gordon at 1600 by 1000: **60.9 frames a second with the
sheet closed, 17.7 with it open.** The drain, the one moment in the product
where a person could see a pattern leave their field, happens under a blur and
a card, at a third of the frame rate, and is over before they press Done.

If the release was started from another tab, the drain waits and plays when
the person next arrives on the Field, as in 5.2.

The move is in section 14: drop the blur for an opaque ground, and on the
cooldown, lower the sheet so the wheel is seen draining before the done card
arrives. **His call** on the choreography. The frame rate fix is not a design
question.

### 7.3 Designed, not built: the release is meant to be heard

`DESIGN-release.md` specifies the release's timing as sound, not motion.
Nothing of it is in the build. It is included so the port can see that the
intended "effect" of a release is an audio vocabulary of four members, and so
nothing visual is added that would compete with it.

| Earcon | When | Waveform | Envelope | Pan | Haptic |
|---|---|---|---|---|---|
| TURN | channel changes | sine, partial at 2× at 0.10; 587 Hz release half, 784 Hz reframe half | attack 8 ms, decay to silence at 190 ms | ±0.7 | 12 ms |
| CROSS | release to reframe at each address | 587 Hz then 880 Hz, a rising fifth | attack 25 ms each, 220 then 420 ms, overlapping 130 | centre | 30, 60 off, 30 ms |
| CLOSE | cooldown opens | 392 Hz, partial 588 at 0.14 | attack 40, hold 200, decay 2400 ms | centre | 90 ms |
| HALT | stop, or a refusal | 330 Hz, no partial | attack 6, decay 260 ms | centre | 20, 40 off, 20 ms |

Plus a binaural bed, off by default and a separate toggle: 200 Hz carrier,
6 Hz beat in the release half, 10 Hz in the reframe half, a 12 s ramp landing
on the cross, gain 0.025, 4 s fade in, 3 s out.

The rule behind it transfers to motion: **mark boundaries, never beats.** A
run speaks up to six hundred lines and makes at most eleven sounds. If the
port adds a visual accent to the release, it goes on the same eleven
boundaries and nowhere else.

## 8. Cards, drills, sheets, the container

### 8.1 The drill panel

**Shipped.** Every mark that carries data opens a reading in one panel in the
right rail. It appears with `display: block`, same frame. When the rail sits
beside the stage, the section is scrolled into view with the browser's smooth
scroll (auto under reduced motion). When the rail is stacked under the stage,
on every phone, it is not scrolled at all.

**Why the phone case does nothing.** Scrolling a stacked rail into view took
the page 4000 px down and left the thing the person pressed off the top of the
screen. It reads as the button doing nothing, and the person presses again.

The back control sticks to the top of the panel. No motion.

### 8.2 Rail sections

**Shipped.** The chevron is an 8 px L of two borders. Closed `rotate(45deg)`,
open `rotate(-135deg)`, 220 ms ease out, a half turn. The header goes to the
gold. The body is `display: none` to `block`, same frame. Every section can be
open at once.

### 8.3 Sheets and overlays

| Surface | Appears | Ground | Why |
|---|---|---|---|
| help and profile sheet | `hidden` attribute, same frame | rgba(6,8,11,.62) | a confirmation shape |
| onboarding | `display: flex`, same frame | rgba(6,6,8,.94), opaque on purpose | a backdrop blur over the Field cost it 10.9 to 18 frames a second, and an opaque ground also stops the wheel showing through text a person is reading |
| release | `display: flex`, same frame | rgba(8,9,13,.76) and a 10 px blur | defect D3 |
| compass as a modal | `display: flex`, same frame | | |

No sheet animates its entrance or exit. That is consistent, and it is below
the standard the tooltip sets. A sheet is a surface transition: 320 ms,
ease out in, ease in out. Section 14 proposes it as optional.

### 8.4 Onboarding figure

**Shipped, only on request.** `OB_AUTO` is false, so onboarding does not open
by itself; it is replayed from help. When it opens, the welcome carries the
boot's column again at rest: spine, seven seats, gold halo.

    seats              opacity 0 → .92, translateY 3 px → 0
    duration           520 ms, ease out
    delays             100 ms + i × 70 ms, Root first: 100, 170, 240, 310, 380, 450, 520 ms
    last seat lands    1040 ms
    reduced motion     no animation, opacity .92

**Why.** The person watched this figure assemble at the boot. Meeting it
again standing still says "this is the thing, and it is you" without a
sentence. The comment beside it says the step is 170 ms and "the boot's rhythm
halved"; the running step is 70 ms, and the boot's is 120. Build 70.

### 8.5 The tooltip, which is the most finished motion in the product

**Shipped.** Ruled: "Design it so that it is sexy. Wow me. Think transition,
think animation." One mechanism replaced eight.

**On a fine pointer, beside its carrier:**

    hover intent        380 ms before it opens. under 300 it fires while crossing a list
    tether              2 px, the carrier's colour, 10 px long, crossing the gap
                        scale 0 → 1 from the carrier's end, 120 ms ease out
    panel               opacity 0 → 1, translate 6 px toward the carrier → 0,
                        scale .972 → 1, transform origin at the tether's foot
                        220 ms ease out
    entry mark          30 by 2 px of the carrier's colour on the panel's near edge,
                        centred on the tether, making a T with it
    exit                opacity and transform back, 120 ms ease in,
                        visibility flips at 120 ms
    grace               120 ms to cross the 10 px gap into the panel
    placement           below, above, right, left, first that fits; never over
                        the carrier, never over the tab bar; on the wheel,
                        beside the canvas on the side of the pointed mark

**Why the tether.** A tooltip that fades in place makes the eye search for its
cause. This one grows out of its carrier. The tether finishes at 120 ms while
the panel is still arriving until 220 ms, so the line is already drawn when
the panel lands and the eye is already at the destination. The T replaces a
caret: an arrow points, and this says the colour came through here.

**Why scale .972.** Two point eight per cent is the smallest scale that reads
as growth rather than as a fade. More reads as a zoom.

**On a coarse pointer, or under 600 px wide, as a sheet:**

    position            bottom of the window, 8 px inset, safe area respected
                        or the top, if the carrier cannot be scrolled clear
    motion              translateY 12 px → 0 from its edge, same 220 ms in, 120 ms out
    tether              none. the carrier takes a 2 px ring in its own colour instead
    first tap           explains. the tap's click is swallowed. second tap acts

The sheet scrolls the carrier clear of itself before opening, smoothly, with
the side decided by arithmetic first so nothing races the scroll.

**Frame cost.** Opacity and transform only, compositor. Its own shadow is set
at 24 px, not the product's 64 px shadow, because a large soft shadow over a
repainting canvas is recomposited every frame: 6.1 frames a second lost under
Glass with the larger one. Measured open on the live Field: 60.6 frames a
second.

**Reduced motion, defect D7.** The tooltip's own rules ask for opacity only at
120 ms linear, arguing that "a panel that appears with no elapsed time reads as
a glitch". A global rule elsewhere (`* { transition: none !important }`)
overrides it, so it appears in 0 s. Measured. Also dead: a second copy of the
reduced motion rules under `body.rm`, a class nothing ever sets. It was the
start of an in app motion toggle, which the UX rules require and which does not
exist.

### 8.6 The journal container

**Prototyped, not shipped.** `proto/container/` and `DESIGN-container.md`.
Open, seal and empty are states drawn as three different glyphs (a ring with a
gap, a closed ring with a bar, and empty), not animations. The only motion in
the prototype is the recording lamp:

    @keyframes lamp    0 %, 100 % { opacity: 1 }  50 % { opacity: .38 }
    duration           1.5 s ease-in-out infinite
    reduced motion     none

The live build has no container. Its nearest relative is the story editor's
microphone dot:

    @keyframes micPulse  0 %, 100 % { opacity: 1; scale 1 }  50 % { opacity: .5; scale .82 }
    duration             1.6 s ease-in-out infinite, only while recording
    reduced motion       none

A pulse is the one universal convention for "recording now", which is its
whole job. 1.6 s is 37.5 a minute, slow enough not to read as an alarm.

### 8.7 Timed holds

These are not animations, but they are timing a person feels.

| What | Hold | Why |
|---|---|---|
| status line, success | clears after 2400 ms | a confirmation nobody dismissed is noise |
| status line, failure | holds until replaced | a failure must not vanish before it is read |
| intake Save label | result for 900 ms on success, 2600 ms on failure, then "Save" | failures get nearly three times as long |
| Export label | 1200 ms | |
| ritual Save | "Saved", then the surface re-renders at 420 ms, the context step | it used to close at 700 ms and threw away the plan |
| match game mismatch | both cards held face up 700 ms, then turned back | long enough to memorise two faces |
| letting go game clock | updates every 250 ms | |
| guard message | waits for DOMContentLoaded, 1500 ms ceiling | |
| watchdog | 8000 ms | |

The status line itself has `transition: all 220ms`, but it is `display: none`
when empty, so it appears in one frame.

## 9. Progression and reward

**There is no reward animation, and that is deliberate.** No confetti, no
badge unlock, no count up, no streak flame, no variable reward. The research
(`RESEARCH-ladder.md`, upheld in `DESIGN-progression.md`) rejects consecutive
day streak pressure, variable reward ("named as a gambling schedule by its own
advocates"), leaderboards and loss framing. A reading is about the person and
a ledger is about the work; celebrating a reading would score the person.

What does change on screen:

| Element | Change | Motion |
|---|---|---|
| streak number, 42 px light | dim when not running, ink when running | same frame |
| marks on the ladder | a dated list, newest last, nothing shown before it is true | none. An empty slot is a demand, so there are no empty slots to fill |
| release done card | rows for each address, cleared ones tinted | none |
| match game | a matched pair drops to opacity .34 | same frame |
| cards in the games | face state changes background | 120 ms ease out |

**For the port.** Do not add celebration. If an arrival is wanted for a new
mark on the ladder, the only defensible one is the product's own element
entrance: 220 ms, ease out, 6 px rise, once, on the mark that is new. It says
"this is new" without saying "well done".

## 10. Micro interactions

| Control | Rest → hover or on | Duration, curve | Notes |
|---|---|---|---|
| tab `.tabtop` | colour mid → ink on hover; pressed: accent, weight 350 → 500, tracking .012em → 0, underline 2 px | 120 ms ease out | underline has no transition. weight morph needs a variable font |
| depth buttons `#vbar .vt` | same family; pressed underline 1.5 px at 5 px from the bottom. `.zoomed` adds a gold border and a 4 px dot when zoom resolved past the button | 120 ms ease out | |
| `.vt` general | background → panel-2, border → edge-2, colour → ink | 120 ms ease out | `transition: all` |
| `.btn` | background → sunk, border → edge-2 | 120 ms ease out | |
| `.btn.pri` | `filter: brightness(1.08)` | 120 ms ease out | |
| ring chip `.cr`, rows, list items | colour and ground steps | 120 ms ease out | |
| canvas key chips `.kb` | ground → sunk, colour → ink | **same frame** | no transition declared |
| switch `.ac-sw` | track: ground and border to the accent. knob: translateX 0 → 18 px, dim → accent | track 220 ms ease out; **knob 220 ms ease land** | the only use of the landing curve outside the boot. overshoot 9.8 %, about 1.8 px |
| charge slider tracks `.nf .tr b` | width to the new value | 320 ms ease out | updated in place, so it plays |
| Body page paint regions `.pm-pr` | fill opacity 0 → .10 hover, .14 selected; stroke opacity 0 → .55, .78 | 120 ms ease out | a region is nearly invisible until pointed at, which makes the figure a surface to paint on rather than a diagram of nine boxes |
| lighting change | `html, body` background and colour | 320 ms ease out | the whole ground crossfades. repaint of the page for 320 ms |
| focus | 2 px gold outline, 2 px offset | same frame | correct: focus must not lag |
| press `:active` | **nothing, anywhere** | | defect D9 |

**D9. There is no press state.** Not one control in the product responds to
being pressed down. On a fine pointer, hover carries some of the feedback. On
a phone, which is where this audience arrives and where there is no hover, a
press gets no acknowledgement until its result renders. The move is in
section 14.

## 11. Declared, dead: transitions that never play

These are declared in the stylesheet and never run, because the renderer
rebuilds the element through `innerHTML` on every render instead of updating
it. A new element has no previous value to transition from. The port should
build every one of them, updating in place:

| Element | Declared | Renders via | What the person sees instead |
|---|---|---|---|
| `.rel-prog i`, release progress | width 420 ms ease out | card `innerHTML` every 2.2 s tick | a jump per line |
| `.polbar .fill`, balance of benign against malignant | width and left 420 ms ease out | `pb.innerHTML` | a jump |
| `.bmbar i`, benign and malignant meters | width 420 ms ease out | `$('pol').innerHTML` | a jump |
| `.bal-f`, `.bal-m`, masculine and feminine lean | width 300 ms, left 320 ms | `e.innerHTML` | a jump |
| `.iq-bar i`, intake progress | width 420 ms ease out | intake render | a jump |
| `.pm-aura`, Body page glow | opacity and background 420 ms | the whole map's `innerHTML` | a jump. note: a gradient background cannot interpolate in CSS in any case; build it as an opacity crossfade of two layers |

All of these are data. By rule 3 they settle with ease out and no overshoot.

## 12. The distinctive motion, the things that are this product and not a generic interface

Ranked by how much they say, not by how much they move.

1. **The oscillating band is a reading you can see with the labels off.**
   Low coherence wanders wide, high coherence holds still. The motion is the
   measurement (5.8).
2. **Charge lands where it can be seen.** One ease for every change to the
   field, driven by elapsed time, frozen while the Field is off screen, so a
   story written on another tab lands on the wheel when the person comes back
   (5.2).
3. **Zoom is a timeline the person scrubs.** The core atomises into feathers
   and the shell into named fetters and then into the individual stories that
   put the charge there, each over two to three notches, at the speed of the
   person's own attention (5.6).
4. **The boot's seats are emitted by the core.** Scaled about the figure's
   centre, they are thrown out along the spine past their seats and fall back,
   root and crown furthest, heart not at all (3.4).
5. **The Field assembles root to crown, once.** The seat sweep is the colour
   animation of the bands and the order the body is read in (5.1). Not seen
   today: D2.
6. **The compass carries a crowd and a history.** The median room holds
   souls on golden angle phases, and the person's own marker swings across
   the range their own record says is theirs (6).
7. **The tooltip grows out of its carrier.** A tether that leads the panel and
   a T where it lands (8.5).
8. **The core breathes at a resting respiratory rate** and its interior
   layers counter rotate (5.4, 5.5). Prototyped next step: the breath rate is
   the reading, and the breath travels up the body as a wave.
9. **Tension as geometry.** The chords sag by susceptibility. Not a motion,
   but it is the same idea: a physical property carrying a number (5.9).
10. **Restraint as policy.** No reward animation, a release that marks
    boundaries and not beats, and drifting barbs cut from the feathers on the
    fatigue test because "at forty it is the screen fidgeting at you".

## 13. The source comments that will mislead a port team

Every one of these is a comment stating a motion value the code does not run.
Build to the right hand column.

| Where | The comment says | The code runs |
|---|---|---|
| `head.html` boot block, and `body.html:36` | "Three seconds" | 4.12 s of motion; removed at about 5.45 s; ruled 7.26 s |
| `head.html` boot, `.b-seat` comment, `body.html` | seats "90ms apart" | 120 ms apart |
| `head.html` boot header, `.b-ring` comment | ring "starts at 0.95s" | 1.92 s |
| `body.html` twelve principles | "SQUASH STRETCH the core flattens as it expands" | removed by ruling; uniform scale only |
| `head.html` "FIVE BEATS AT THE TAIL" | five heartbeats from 4.10 s | no beat animation exists; the figure holds still |
| `body.html` twelve principles | "the seats travel a curve" | they travel straight out and back along the spine |
| `panels.js:926` | "5.26s is the end of the sequence" | 7.26 s in CSS; the timer it guards fires at 5.45 s |
| `guard.html` watchdog | "past the boot sheet's own five and a bit" | the watchdog is 8 s against a ruled 7.26 s; still past it, by less |
| `head.html` `.ob-fig` | "a hundred and seventy millisecond step, which is the boot's own rhythm halved" | 70 ms; the boot's is 120 |
| `wheel.js:849` | the assembly lasts "the second and a half" | 900 ms |
| `head.html` `.tip::before` | the tether "leads the panel by sixty milliseconds" | both start together; the tether finishes 100 ms before the panel |

## 14. The defect register, and the moves

Each move is stated as property, from, to, duration, curve. Frame cost and
reduced motion are stated for every one.

| # | Defect | Measurement | The move | Frame cost | Reduced motion |
|---|---|---|---|---|---|
| D1 | Boot removed by timer before its fade | opacity 1 until about 5.45 s, then gone in one frame; `bootOut` at 7.02 s never runs | `panels.js:929` floor `5450` → `7450`. Then the sheet holds to 7.02 s, fades opacity 1 → 0 over 240 ms on `(.4,0,.2,1)`, and is removed on `animationend` at 7.26 s. Gate 11's wait 5800 → 7800. **His call** between the ruled 7.26 and the lived 5.45 | compositor | unchanged: removed on first pass |
| D2 | Field assembly spent under the boot | starts at 166 to 173 ms, ends about 1.07 s, boot opaque until about 5.45 s | In `setTab`, call `enterStart()` only once `body.booted` is set. In the boot's `clear()`, call `enterStart()` if the Field is the current tab. Timings unchanged: 380 ms span, 62 ms stagger, core at 300 ms, 900 ms total. On a skip, the 180 ms fade overlaps the first 180 ms of the assembly, which is correct overlapping action | canvas, already drawn every frame | unchanged: end state on the first frame |
| D3 | Release sheet blurs the live wheel; the drain is hidden | 60.9 fps closed, 17.7 open, Gordon, 1600 | `.rel` `backdrop-filter: blur(10px)` → none; ground rgba(8,9,13,.76) → rgba(6,6,8,.94), the onboarding value. Extend gate 13 to open overlays. On cooldown, **his call**: sheet ground opacity 1 → 0 over 320 ms ease in, hold 600 ms while the wheel drains, done card in over 220 ms ease out with 6 px rise | removes a full screen readback per frame | no fade; the done card appears with the drained wheel beside it |
| D4 | Compass loop duplicated per control press | spin 0.130 → 0.660 rad/s after four presses | `cancelAnimationFrame(CONE.raf)` before `coneTick()` in `coneOpen` | removes n extra full redraws | n/a |
| D5 | Compass frame dependent | 2 × speed at 120 Hz by construction | idle spin `+= 0.132 * dt`; aim `k = 1 - exp(-7.67 * dt)`; `CONE.t += dt`, dt clamped to 0.05. At 60 Hz this is identical to now | none | unchanged |
| D6 | Flat toggle snaps the tilt | 0.60 → 0.0001 in one frame | tween tilt with the aim ease, rate 7.67/s, 90 % in 300 ms | canvas, already drawn | snap |
| D7 | Reduced motion gaps | tooltip 0 s under reduced motion against its stated 120 ms opacity; compass aim still eases; `body.rm` dead | Keep opacity fades under reduced motion and kill displacement: scope the global rule to `transform` and `animation`, not `opacity`. Add a reduced motion check to the compass aim so it snaps. Remove the `body.rm` rules, or build the in app toggle they were for. **His call** on the toggle | none | this is the reduced motion fix |
| D8 | Canvas hover is instant | same frame gold outline and 1.45 × bead | hover highlight alpha eased at 14.1/s (0.21 per frame at 60 Hz), 90 % in about 160 ms; bead scale 1 → 1.45 on the same ease | canvas, already drawn | snap |
| D9 | No press state anywhere | zero `:active` rules on any control | `.btn`, `.vt`, chips, rows: on `:active`, `transform: scale(.97)` in 80 ms ease out; release back to 1 over 120 ms ease out. Primary button also takes `filter: brightness(.94)` on press | compositor | background step only, no scale |
| D10 | Six declared transitions never play | section 11 | update width, left and opacity on the existing node rather than rebuilding it; keep 420 / 320 ms ease out as declared; `.bal-f` 300 ms → 320 ms | layout on a small box for 420 ms | snap |
| D11 | Compass rows off scale | 180 ms browser `ease` | `.cn-nr` `transition: border-color .18s, opacity .18s` → `var(--t-micro) var(--ease-out)` for both. Gate 12 to walk every tab | none | snap |
| D12 | Zoom and reset are instant | reset from 7 to 1 drops every resolved layer in one frame | tween `S.zoom`, `S.panx`, `S.pany` toward their targets with the charge ease, 9.05/s, 95 % in 331 ms; the layer alphas follow zoom so the atomisation plays in reverse | canvas, already drawn | snap |
| D13 | Stale motion comments | section 13 | correct the comments when the code is next touched | none | n/a |
| D14 | Core breath is not a reading | one rate for every CQ | **Prototyped, his call**: period lerp(2.0, 5.0 s) by CQ, amplitude lerp(1 %, 3 %), Root leading by 1.05 rad across the seats | none | off |
| D15 | Core feathers overlap under reduced motion | 11 of 31 pairs coincide at spin 0 | the feather design seats each feather in its own sector and drops the spin | none | this is the fix |

**Optional, not a defect.** Sheets (help, profile, onboarding, release)
currently cut in and out. For consistency with the tooltip: ground opacity
0 → 1 and card translateY 8 px → 0 over 320 ms ease out on the way in; 220 ms
ease in on the way out, with removal after. Compositor only. Reduced motion:
opacity only.

## 15. Frame budget

| Motion | Where it runs | Cost | Compositor only |
|---|---|---|---|
| tab rise, tooltip, boot fades, skip | CSS | opacity and transform | yes |
| boot spine and ring draws | CSS `stroke-dashoffset` on a 300 px SVG | paint, small, 3.5 s once | no |
| boot seat, core and halo scales | CSS transform on SVG children | paint of the SVG | no, cheap |
| wheel | canvas, full redraw every frame on the Field | the dominant cost. 60.9 fps on Gordon at 1600 | n/a |
| wash | canvas at 1/8 resolution, 12 Hz, skipped when unchanged | about 56 thousand pixels a paint | n/a |
| oscillating band | one `translateY` per frame on an SVG group | style only | close to it |
| compass | its own canvas, full redraw every frame while open | per loop, which is why D4 matters | n/a |
| tab weight morph | `font-weight` and `letter-spacing` | layout on the strip for 120 ms | no |
| lighting change | `html, body` background | full page repaint for 320 ms | no |
| slider widths | width | layout on a 58 px box | no |
| any `backdrop-filter` over the Field | | 12 to 18 fps | forbidden |
| any large soft shadow over the Field | | 6 fps lost at 64 px blur | keep shadows at 24 px or less |
| a gradient allocated per frame | | 21.7 fps under dark and 9.4 under snow when the core's number disc was a gradient | use stacked flat fills |

## 16. Reduced motion, the complete table

| Motion | Under `prefers-reduced-motion: reduce` today | Intended |
|---|---|---|
| boot | never shown; removed on first script pass | same |
| tab rise | none | same |
| Field assembly | end state on the first frame | same |
| charge ease | snaps | same |
| core breath | off | same |
| core layer spin | off, and 11 feather pairs overlap (D15) | spin removed for everyone by the feather design |
| wash | painted once | same |
| oscillating band | still | same |
| compass idle spin and clock | still | same |
| compass hover aim | **still eases, 300 ms** (D7) | snap |
| tooltip | **appears in 0 s** (D7) | opacity only, 120 ms |
| onboarding figure | still, opacity .92 | same |
| drill scroll | instant | same |
| microphone pulse | none | same |
| an in app motion toggle | **does not exist** | required by the UX rules; his call |
| zoom-driven layers | still follow zoom; this is the person's gesture, not a clock | same |

## 17. Grade

**Now: B.** The vocabulary is right, argued and gated. The data motion (the
band, the charge ease, the compass marker) is better than most instruments
ship. The tooltip is finished work. What holds the grade down is that the
three set pieces never reach the eye: the boot's ending is cut by a timer, the
Field's assembly plays under the boot, and the release's discharge plays under
a blur at 18 frames a second. Plus a compass that speeds up every time it is
touched, and no press state anywhere.

**After D1 to D12: A minus.** Nothing new is invented. Every move is either
the source's own declared intent or a value already used elsewhere in the
product. The remaining distance to an A is the breath as a reading and the
release choreography, both of which are the owner's rulings to make.

## 18. Port checklist

1. Define the three curves and four durations as named tokens before writing
   any motion. Fail the build on a raw duration or the platform's default ease.
2. One clock in real seconds, per frame delta clamped to 0.05 s, frozen under
   reduced motion. Every canvas ease uses `1 - exp(-rate * dt)`.
3. The charge ease at 9.05 per second, updated only while the Field is on
   screen.
4. The boot as tabled in 3.3, curves applied per keyframe segment, seats
   scaled about the figure's centre. Its end gated on the app's ready signal,
   with a watchdog behind that. Skip on any press or key, eat the click.
5. The Field assembly started when the boot clears, once per session.
6. Hit targets at final positions from the first frame of any entrance.
7. Zoom thresholds and ramps exactly as in 5.6; layers are functions of zoom,
   not of time.
8. Nothing translucent and blurred over a canvas that repaints every frame.
9. Update data bars in place so their transitions play.
10. A press state on every control.
11. Reduced motion as the end state, stated per motion, plus an in app toggle
    if the owner rules for it.
12. No reward animation.
