# THE ONE TOOLTIP

Atüned / SOURCE. The tooltip is currently eight mechanisms, three of which
draw a panel, and the three panels disagree. This replaces all eight with one.

    Read against      commit fb18dd8, source.html md5 f37ff329
    Tree              dirty, and moving while this was written. The frame
                      numbers were re-run against that md5 at the end.
    Measured with     /opt/pw-browsers/chromium-1194, 1600x1000 and 390x844
    Profiles          Lance for the audit, Gordon for the frame rate
    Prototype         proto/tip/tip.html, runnable, no network
    Date              2026-09-20

Four of us worked it. Sol Amadi took colour and light, Bjorn Haraldsson took
type and grid, Petra Nikau took composition and symbol, and I took the whole.
Every finding carries a name so it can be argued with.

Every number below was read off a run. Nothing here is estimated.

---

## THE AUDIT

### Eight Mechanisms, Not Three

The owner said the tooltip design is inconsistent across the board. It is
worse than inconsistent. There is no tooltip. There are eight things doing
the job of one.

| # | Mechanism | Where | Count | Opens on | Reachable by thumb |
|---|---|---|---|---|---|
| 1 | Native `title=` in renderer template strings | `ui/*.js`, 32 sites | 32 | browser hover, about 500ms | no |
| 2 | Native `title=` hand written in the shell | `shell/body.html:162,243,258,262` | 4 | browser hover | no |
| 3 | Native `title=` emitted unconditionally by `cr()` | `ui/component.js:51`, 36 call sites | 36 | browser hover | no |
| 4 | Native `title=` emitted conditionally by `crBadge()` | `ui/component.js:153`, via `crbNode` and `crPat` | 6 | browser hover | no |
| 5 | Native `title="Open X"` from `addrRow()` | `ui/component.js:113` | 3 | browser hover | no |
| 6 | `.title=` property assignment in DOM code | `panels.js` x7, `ui.js` x2, `personas.js` x1 | 10 | browser hover | no |
| 7 | `#railtip`, a built panel keyed on `data-tip` | `ui/ui.js:501` to `:528`, CSS `head.html:1231` | 8 carriers | `pointerover` only | no |
| 8 | `#probe`, a built panel for the canvas | `ui/ui.js:261` to `:271`, host `body.html:434`, CSS `head.html:1220` | 1 | `pointermove` only | no |

And a ninth thing that is not a tooltip but is doing a tooltip's job: three
**caption slots**, a fixed region per rail that a hover writes a description
into and a mouseleave wipes.

    #capD   panels.js:356 and :383    blueprint domains and root domains
    #capA   panels.js:406             archetypes
    #mxk    personas.js:14 and :20    the matrix cells

A caption slot is invisible until something is hovered, so nobody knows it is
there, and it has no touch route at all. Found by Petra.

`aria-describedby` is used **zero** times in the entire product. Measured
across all ten surfaces.

### The Number Of Definitions A Phone Cannot Reach

`TASKS.md:165` records eight. That number is wrong by a factor of twenty four.

Measured live, Lance loaded, walking every surface `TABDEF` and `TABEXTRA`
name, counting only elements that are actually visible:

    distinct title strings on screen                        259
    of those, definitions that live ONLY in a title         195
    of those 195, on elements that are not focusable         27
    carriers with a reachable route (data-tip)                 8
    elements with aria-describedby                             0

"Lives only in a title" means the string is 24 characters or more, its text
does not appear in the element's own text, and it carries no `data-tip`. In
plain terms: a sentence that exists nowhere else on the screen.

Per surface, visible title attributes:

    energetics  89    field    98    knowledge  93    summary  142
    ritual      89    body     94    games      93    settings   8
    story      198    compass 108

The heaviest single carriers:

    107  button.ip inst     an intake pill
     31  button.ib          a blueprint domain or archetype icon
     12  span.cr sm         a ring drawn by cr()
      7  button.cn-nr       a compass row

The 27 static ones are the sharpest, because even a tap-to-open tooltip
cannot reach them without a change to the element. They include the masculine
and feminine glyphs on the balance strip, 15 by 15 pixels, at `ui.js:475`,
each carrying a sentence the codex is explicit about; the whole `.railtop`
block; and the polarity bar. Found by Petra.

### The Two Built Panels Disagree, And One Is Broken

Measured live, computed style and rendered box:

| | `#probe` | `#railtip` |
|---|---|---|
| declared | `head.html:1220` | `head.html:1231` |
| position | `absolute` | `fixed` |
| max-width | **300px** | **288px** |
| padding | 13px 15px | 13px 15px |
| radius | 11px | 11px |
| rendered | 227 x 229 | 288 x 109 |
| connection to its carrier | none | none |
| opens on | `pointermove` | `pointerover` |

Twelve pixels of measure between two panels that are meant to be one object.
Found by Bjorn.

**`#railtip` renders an empty heading on half its carriers.** `ui.js:509`
reads the carrier's name from `el.querySelector('.tn')`. The four depth
buttons are `.vt` and their name span is `.n`, not `.tn`. Measured: the panel
opens with `<b></b><hr>`, a hairline rule with nothing above it. Verified in
`proto/tip/_now-railtip.png`. Found by Bjorn.

**`#probe` covers the hero graphic.** Measured on the Field with Lance
loaded, hovering address 001: the panel rendered 227 by 229 at client
743, 393, inside a wheel canvas at 451, 263, 664 by 727. It sits on the
picture, over the Crown and Root labels. `DESIGN.md` law 8 says no text over
the hero graphic, ever. The tooltip is the thing breaking it. Verified in
`proto/tip/_now-probe.png`. Found by Petra.

**`.probe .tt-q` fails the contrast floor.** `head.html:1229` sets 11px with
`opacity:.6`. The parent colour is `--mid #B4B0A8` on `--panel #1A1D26`.
Composited, that is `#767574`, which measures **3.66 to 1**. The floor is
4.5. Gate 4 does not catch it because gate 4 measures type size and the
opacity is on the element. Found by Sol.

**The probe prints numbers with no denominator.** Live capture, address 001:
`susceptibility 1.00`, `held 0.3, opposite 8.8`, `SQ 0.0`. Four figures, no
scale on any of them. Found by me.

### Two Things Found On The Way, Not Mine To Fix

The four depth buttons `.vt` report widths of 1552 pixels each and x origins
of 18, 1563, 3108 and 4653 in a 1600 window. Three of the four sit off screen.
That is `#vbar`, not the tooltip, but it means three of the eight carriers
that do have a reachable route cannot be reached either.

`DESIGN.md` records seven lightings and `CLAUDE.md` records four. The tooltip
is specified for seven, read off `LIGHTINGS` at run time.

---

## THE TEN PASSES

Ten mechanisms, not ten adjectives. Each lost for a stated reason.

**1. Keep the native title and add a long press.** Cheapest possible change.
Lost: a native title cannot be styled, cannot carry a ring, cannot carry a
colour, and is truncated by the operating system at a length the page cannot
know. It is also invisible to every gate in `tests/design.js`, so the type
floor and the contrast floors could never be enforced on it. Bjorn.

**2. CSS only, `::after` on `[data-tip]` driven by `:hover` and
`:focus-within`.** No script at all, which is attractive for something that
must never break. Lost: CSS cannot measure the viewport, so a panel on the
right rail opens off the right edge. That is the exact bug `#railtip` was
built to dodge, written at `ui.js:515`. A content string in a CSS property
also cannot carry a number slot or an icon. Petra.

**3. The platform's own popover, with `anchor-name` and `position-try`.**
This is where the web is going and in 2028 it will be the right answer. Lost
today: anchor positioning is not everywhere, and the fallback is the
positioning code we would have had to write anyway. Six of the reference
people are 57 or older and arrive on older devices. Revisit when the fallback
is the rare path rather than the common one. Me.

**4. `<details>` and `<summary>`, an inline disclosure.** Works with no
script, works on touch, needs no positioning. Lost: it reflows. Opening one
definition in a rail of twenty rows pushes nineteen rows down the page, so
the act of asking what a word means moves every other word. Petra.

**5. A bottom sheet on every device, desktop included.** One shape, one code
path, nothing to flip. Lost on desktop: on a 1600 by 1000 screen a definition
sent to the bottom of the window is up to 700 pixels of eye travel from the
word that raised it. Kept for the coarse pointer, where it is right, and that
half of it survives into pass 10. Me.

**6. The caption slot, generalised.** One fixed readout per surface and
everything writes into it. It already exists three times, so this is the
cheapest to finish. Lost: it is invisible until something is hovered, which
means a person who has not hovered does not know the product answers
questions at all, and it has no touch story. Recognition over recall, rule 6
of the UX skill. Petra.

**7. A persistent inspector panel in the right rail.** Rich, roomy, no
placement problem. Lost: the right rail is already the reading. A second
panel there that changes on hover gives the person two moving objects and no
way to tell which one is theirs. Sol.

**8. Expand in place. The carrier grows to hold its own definition.** The
most direct connection possible between a word and its meaning. Lost for the
same reason as pass 4, plus it invalidates every nameplate box
`tests/collide.js` measures. Bjorn.

**9. Follow the pointer, which is what `#probe` does now.** Lost, and this is
the measurement that killed it: the panel lands on the hero graphic, measured
at 227 by 229 inside a 664 by 727 canvas. A panel that moves is also a panel
a pointer cannot enter, so a long definition can never be scrolled and a link
inside it can never be followed. Petra.

**10. THE WINNER. One anchored panel with a tether, and a sheet on a coarse
pointer.** One element in the document. Positioned against the carrier's own
box with a four side flip, and the box is inflated by the gap before the fit
test, so the panel can never land on the thing it describes. Connected by a
drawn tether in the carrier's own colour, so the eye is told where it came
from rather than left to guess. On a coarse pointer it becomes a sheet at the
edge of the window, and the sheet takes the half of the window the carrier is
not in. Hover with intent on a fine pointer, tap on a coarse one, focus for
the keyboard, Escape to close. The native `title` stays on the element until
the moment the panel opens, so a script that never ran leaves a working
native tooltip behind.

---

## THE DESIGN

### The Idea, In One Line

**The panel grows out of its carrier along a line of the carrier's own
colour.** Everything below serves that.

A tooltip that fades in place makes the eye search backwards for what caused
it. This one draws a two pixel tether from the carrier across the gap, then
the panel arrives at the tether's foot. The tether leads by sixty
milliseconds, so the eye is already at the destination when the panel lands.
That is the whole of the animation idea and it is the reason for the timings
rather than a decoration on top of them. Petra.

### Geometry

    max-width              300px        anchored
    measure                272px content, about 46 characters at 13px
    padding                12px 14px 13px
    radius                 var(--r-s), 11px
    border                 1px solid var(--tip-edge)
    gap from the carrier   10px, and the tether is exactly that long
    viewport inset         8px on three sides
    top inset              the tab bar's own bottom edge plus 8px
    z-index                60
    minimum side width     200px, below which it goes to the sheet
    body scroll cap        38vh anchored, 45vh on the sheet
    mask at the cut        22px, one line at line-height 1.65

The sheet, on a coarse pointer or below 600px:

    left / right           8px
    bottom                 8px plus env(safe-area-inset-bottom)
    radius                 var(--r), 16px
    padding                14px 16px 16px, right padding 52px for the close
    close button           44 x 44, the tap floor exactly
    carrier clearance      16px

`--edge-2` at 14 percent, not `--edge` at 9. The panel floats over arbitrary
content including a near black wheel, and at 9 percent the bottom edge
disappears into it. Read off `proto/tip/_now-probe.png`, where the current
probe's lower edge cannot be found. Found by Sol.

### Type

    kicker   11.5px  --num   --dim   tabular, letter-spacing .02em
    title    13px / 1.3   600   --ink
    body     13px / 1.65  400   --mid
    numbers  11.5px  --num   label --dim, value --ink 500, "of" --dim 400
    action   12px / 1.4   500   --accent

One face, three levels, and the levels are weight, value and space. Nothing
is bigger than the body. The title and the body are the same 13 pixels and
the hierarchy is carried by `--ink` against `--mid`, which is 14.39 to 1
against 7.79 to 1. That is a large step and it does not cost a pixel of
height. Bjorn.

11.5 and not 11. Gate 4's floor is 11 pixels and a floor is not a target. The
current `.probe .tt-q` sits exactly on the floor and then multiplies itself
by 0.6, which is how it reaches 3.66 to 1.

Sentence case in the body. The kicker is lower case because it is a label and
not a sentence. No all caps anywhere, which gate 5 enforces.

### Colour, And The Argument For It

The tooltip declares its own ground, per lighting, and it is always
**opaque**.

    :root         --tip-bg #1A1D26   --tip-edge rgba(255,255,255,.14)
    body.snow     --tip-bg #F8F7F3   --tip-edge rgba(20,23,28,.18)
    body.punch    --tip-bg var(--panel-2)   --tip-edge transparent
    body.glass    --tip-bg #151922   --tip-edge rgba(255,255,255,.17)
    body.glasswhite --tip-bg #F6F6F4 --tip-edge rgba(20,22,28,.18)
    body.flat     --tip-bg #121419   --tip-edge #2E333E
    body.lumen    --tip-bg #FFFFFF   --tip-edge rgba(16,16,16,.22)

Opaque, because gate 13 forbids a `backdrop-filter` over the Field and
Glass's `--panel` is `rgba(30,34,46,.55)`. Translucent without a backdrop
filter is not glass, it is a hole: the wheel reads straight through the
definition. `#151922` is what Glass's own `--panel` composites to over its
`--bg`, so the tooltip looks like Glass without behaving like it. Sol.

Punch takes `--panel-2` rather than a border, because `--edge` is transparent
in Punch and a hairline there is nothing. That is the move every other Punch
control already makes at `head.html:567`. Flat takes no shadow, because Flat
has none anywhere.

Body text against its own ground, measured:

    dark        --mid #B4B0A8 on #1A1D26        7.79
    snow        --mid #4E4C48 on #F8F7F3        7.99
    glass       --mid #C2BEB6 on #151922        9.49
    glass white --mid #4A4843 on #F6F6F4        8.44
    flat        --mid #A9A69F on #121419        7.58
    lumen       --mid #43434A on #FFFFFF        9.81

The dim tier, which carries the kicker and the number labels, measures 5.30
on dark and 6.04 on snow. Lowest value measured anywhere inside the panel,
across 18 carriers at both widths, is **5.30 to 1**. The floor is 4.5.

`--panel` and never `--panel-2` as the tooltip ground. On `--panel-2` the dim
tier drops to 4.63, and on glass white's `--panel-2` equivalent to 4.91.
Those clear the floor with no margin, and six of the reference people are 57
or older, where contrast sensitivity has already fallen. Sol.

**The carrier's colour is only ever a graphic.** The tether and the entry
mark take it. No text inside the panel ever does. Root measures 4.17 to 1 on
the dark tooltip ground, which is correct for a two pixel stroke against the
3 to 1 floor a graphic is held to, and would fail as a sentence. The alarm
colour never appears in a tooltip at all: a tooltip is an explanation and an
explanation is not a warning. Sol.

### The Tether And The Entry Mark

Two parts of one gesture, forty pixels of continuous stroke.

    tether       2px wide, 10px long, in the gap, in the carrier's colour
    entry mark   2px thick, 30px long, along the panel's near edge, same colour
    radius       1px on the mark, none on the tether

Together they draw a T where the line arrives. It replaces the caret every
other tooltip in the world draws, without being a caret: an arrow points at
something, and this says the colour came through here. Petra.

The entry mark ran the full panel width first. At 284 pixels it read as a
header rule rather than as an arrival, and it overshot the 11 pixel corner
radius and cut the corner square. Both gone at 30. Read off the first
prototype shot, not off the CSS.

### The Transition

Two steps, both on named tokens. Gate 12 asserts that every duration is one
of the four named steps and that nothing runs on the browser default ease.

**Enter.** The tether first, `transform:scale(0)` to `scale(1)`, origin at
the carrier end, `--t-micro` 120ms, `--ease-out`. Then the panel: opacity 0
to 1, `scale(.972)` to 1, and 6 pixels of travel toward the carrier resolving
to 0. `--t-element` 220ms, `--ease-out`. The panel's `transform-origin` is
set in script to the tether's foot, so it grows out of the line rather than
out of its own middle.

The 60ms lead is the difference between the two durations doing their work,
not a delay: the tether is finished at 120ms and the panel is still arriving
until 220ms.

**Exit.** No tether animation. Opacity to 0, 4 pixels of travel back toward
the carrier, `--t-micro` 120ms, `--ease-in`. Shorter than the entrance, and
on the leaving curve. `DESIGN.md` law 7 states it: a thing leaving does not
need to be watched out.

`visibility` is stepped, not transitioned, with a 120ms delay on the way out,
so a closed panel takes no pointer events and is invisible to a screen
reader. A panel at opacity zero that still covers the app is the failure gate
11 was written for.

**Hover intent.** 380ms before opening. Under about 300 the panel fires while
the pointer is merely crossing, and a rail of twenty rows becomes twenty
panels. **Grace.** 120ms after the pointer leaves, which is what makes the 10
pixel crossing into the panel survivable. The gap is 10 and not 16 for this
reason.

**Reduced motion.** Opacity only, 120ms, linear. Not zero. A panel that
appears with no elapsed time reads as a glitch rather than as an answer. The
tether stops growing and is simply there. Honoured through both the media
query and a `body.rm` class, because the UX skill rule 8 requires a toggle
and not only a query.

### What Happens On A Phone

Tap opens. Tap the same carrier again closes. Tap anywhere else closes.
Escape closes. There is no hover path at all on a coarse pointer, and the
`pointerover` handler returns immediately rather than racing the tap.

The sheet never covers its carrier, and scrolling is not always enough to
achieve that. Measured on the 390 run before this existed: five of eighteen
carriers were still under the sheet after it scrolled, because a carrier in
the last 300 pixels of a page has nowhere left to go. So the side is decided
from arithmetic before anything moves:

    carrier clears the sheet          sheet at the bottom, no scroll
    page can scroll far enough        scroll by the difference, sheet at the bottom
    page cannot                       sheet at the top

The placement never depends on the scroll landing, so there is no race
between the scroll and the panel's own 220 milliseconds. After the fix: **0
of 18 carriers covered, at 390 and at 1600.**

**The open carrier is marked, and only on the sheet.** On a fine pointer the
tether already says which word this belongs to. On a phone there is no tether
and the sheet is 800 pixels from the word. So the carrier takes a 2 pixel
ring in its own colour while its sheet is open, and the sheet's entry mark is
the same colour. Two objects, one colour, and that is the whole connection.
`box-shadow` rather than `outline`, because a ring carrier is round and a
rectangular outline around a circle is a second shape. Petra.

Not added on desktop. That would be the fourth thing.

### What Happens When The Definition Is Long

The body scrolls at 38vh anchored and 45vh on the sheet, with
`overscroll-behavior:contain` so the page underneath does not move with it. A
mask fades the last 22 pixels, one line, so a cut never reads as the end of a
sentence. The mask is on the body and not on the panel, because a mask on the
panel would eat the entry mark.

The panel takes pointer events, which is what makes a long definition
readable at all. That is only safe with the 10 pixel gap and the 120
millisecond grace, and those three decisions are one decision.

### Where It Is Allowed To Land

Placement order is below, above, right, left, and the first that fits wins.
The carrier's box is inflated by the 10 pixel gap before the fit test, so the
panel can never land on the thing it describes. Measured across 18 carriers
at 1600 and at 390: **0 overlaps**.

**The panel never covers the tab bar.** The bar is how a person leaves the
surface, and a definition that hides the way out is worse than no definition.
The bar's own bottom edge is read once per open and used as the top inset, so
nothing is written down and no number can go stale. Measured before this
existed: on the live Field in Glass the canvas panel landed at 637, 26 and
sat across Knowledge, Games and Summary.

**A canvas mark aligns to the canvas, never to the mark.** The wheel hands
over the canvas element's box and the mark as a point inside it. Placing
against the mark put the panel at 637, 531, 300 by 233 inside a canvas at
451, 263, 664 by 727, which is dead centre of the picture, and that is law 8
broken by the tooltip. The wheel already lights the hovered mark itself, so
nothing is lost by moving the panel off the graphic.

**And when a point is given with no order, the side follows the point.** A
mark on the left of the wheel opens to the left, a mark on the right opens to
the right. Measured on the live Field, Gordon loaded: a mark at 22 percent
placed at 157, 479 on the left; a mark at 78 percent placed at 1125, 473 on
the right. Neither over the wheel, neither over the bar. The tether stays
short and the eye never crosses the picture to read about the picture.

### Every Number Says What It Is Out Of

The number slot is a definition list of pairs, and the renderer drops any
entry that does not carry three parts. There is no way to pass a bare figure.

    SQ           5.4 of 10
    Seat           1 of 7
    Address        1 of 112
    Accuracy      96 of 100

The count stated is 112, never 108, in the tooltip as everywhere else.

### What Happens With No Script

The element keeps its `title` attribute. `tip.js` removes it at the moment
the panel opens and puts it back when the panel closes. So:

    script never ran        the native title works, unstyled but present
    script threw at boot    the native title works
    script alive            the product's panel opens, and the native one
                            cannot also appear because the attribute is gone

That ordering is deliberate. A migration that strips `title` at wire time
would leave nothing behind if anything downstream threw. Tooltips are the
last thing that should break.

---

## THE MARKUP AND THE CSS

### Where The New File Goes In MANIFEST

    ui/component.js
    ui/tip.js          <-- here, line 35
    ui/wheel.js

Immediately after `ui/component.js` and before everything else in `ui/`.

Three reasons, and they are the MANIFEST rule rather than a preference.
`tip.js` calls `esc()`, which `component.js` declares at line 20, and a
forward reference throws at parse, which in a concatenated build takes down
every module after it. `tip.js` touches `document`, so it belongs in `ui/`
and may never go in `engine/`. And every renderer after it emits `data-tip`
attributes that the delegated listener picks up, so it has to exist before
any of them run, while needing nothing from any of them.

It is one delegated listener set on `document`, so no renderer has to call
anything. A renderer emits attributes and the tooltip appears.

### One Block For atuned_src/shell/head.html

Two token lines first, next to the other lighting tokens. `--tip-bg` must be
declared in `:root` and in `body.snow`, because those two lightings inherit
`--panel` rather than stating one. Measured: injected without them,
`background:var(--tip-bg)` resolved to nothing and the panel rendered with a
transparent ground in Dark and in Snow, the two lightings most of this
audience will ever see. That is the silent `var()` failure law 7 already
names for the motion tokens.

```css
:root{--tip-bg:#1A1D26;--tip-edge:rgba(255,255,255,.14);--tip-shadow:0 10px 24px rgba(0,0,0,.38)}
body.snow{--tip-bg:#F8F7F3;--tip-edge:rgba(20,23,28,.18);--tip-shadow:0 10px 24px rgba(20,22,28,.13)}
```

Then the block itself, complete. It replaces `head.html:1220` to `:1232`, the
`.probe` and `.railtip` rules, which are deleted.

The full block is in **`proto/tip/tip.css`**, 196 lines, with the arguments
in comments. Paste it whole. It is also live in `proto/tip/tip.html` between
the two banner comments, so the block and the running prototype cannot drift.

Every `var()` in it carries a fallback. That is not belt and braces, it is
the finding above.

### One Function For atuned_src/ui/tip.js

The whole module is in **`proto/tip/tip.js`**, 290 lines, and it is the same
text that runs in `proto/tip/tip.html`. It declares one name, `TIP`, and
calls `TIP.wire()` at the end.

The interface a renderer sees:

**Attributes on a carrier.** Nothing else is needed.

    data-tip      the body sentence. Required.
    data-tip-t    the title. Optional. Omitted means no title line, and the
                  renderer must emit no empty element, which is the
                  <b></b><hr> defect.
    data-tip-k    the kicker, above the title. Optional.
    data-tip-n    numbers, as label|value|of, separated by semicolons.
    data-tip-a    the action line. Optional.
    --c           the carrier's colour, read from its computed style.

**The three calls.**

    TIP.wire()               once, at load. Already at the end of the module.
    TIP.show(element)        open against an element. Rarely needed.
    TIP.showAt(rect, data)   open against a rectangle. This is the canvas
                             entry. data takes at:{x,y} for the point inside
                             the rectangle, order for the placement order,
                             force for a pinned side, and c for the colour.
    TIP.hide()               close.

Nothing else is public. The placement, the sheet decision, the native title
handover and the carrier mark are all internal.

---

## THE MIGRATION

In this order. Each step leaves the product working.

### Step 1. Land the file, change nothing else

    add   atuned_src/ui/tip.js          from proto/tip/tip.js
    edit  atuned_src/MANIFEST:35        insert ui/tip.js after ui/component.js
    edit  atuned_src/shell/head.html    add the two token lines by the other
                                        lighting tokens, and the block

At this point every existing `title` attribute in the product becomes a
product tooltip, because `read()` falls back to `title` when there is no
`data-tip`. All 195 definitions become reachable by tap in one step, with no
renderer touched. Run `node tests/design.js` and `node tools/monitor.js`
here, before anything else moves.

### Step 2. Retire the canvas probe

    ui/ui.js:261 to :271    replace the pr.innerHTML / pr.style / classList
                            block with one TIP.showAt call, handing over the
                            canvas rect and at:{x,y} from loc(e)
    ui/ui.js:271            pointerleave calls TIP.hide()
    ui/ui.js:10             describe() returns the data object rather than an
                            HTML string. Its arguments and its call sites do
                            not change.
    ui/ui.js:25             the .tt-q arithmetic line becomes data-tip-n
                            entries, each with its denominator
    shell/body.html:434     delete <div class="probe" id="probe">
    shell/head.html:1220-9  delete the .probe rules
    shell/head.html:2702    remove #probe from the tab-field display list
    ui/panels.js:151        remove 'probe' from the id list

This is the step that fixes law 8.

### Step 3. Retire the rail tooltip

    ui/ui.js:501 to :528    delete wireKbJump's tooltip half. Keep the click
                            half, which jumps into the codex. The data-tip
                            attributes it reads stay and are now read by
                            TIP instead.
    ui/ui.js:896            the call stays, now wiring only the jump
    shell/head.html:1231    delete the .railtip rule

This is the step that fixes the empty heading.

### Step 4. Retire the caption slots

    ui/panels.js:356,383    the two capD writers become data-tip attributes
    ui/panels.js:406        the capA writer likewise
    ui/personas.js:14,20    the mxk writer likewise
    shell/body.html:328,332,357   the three .cap and .mxk hosts are removed
                            only after the rail has been re-laid out, because
                            they currently hold vertical space

Step 4 is the only one that changes a layout, so it goes last and it goes
with a fresh pair of shots at both widths.

### Step 5. Enrich, file by file, no hurry

Everything works after step 1. Step 5 is upgrading a title string into a
structured tooltip, and it is worth doing first where the numbers are.

    ui/component.js:51      cr() emits data-tip-t, data-tip-n and keeps the
                            title as the fallback. This one change upgrades
                            36 call sites at once and is the highest value
                            line in the migration.
    ui/component.js:113     addrRow, "Open X" becomes an action line
    ui/component.js:153     crBadge, same treatment as cr()
    ui/ui.js:384,438,563,644
    ui/summary.js:121,320,393,463
    ui/drills.js:478,492,505,511,524,551,597,821,919
    ui/cone.js:695,742,744,746,915
    ui/panels.js:238,296,346,380,404,480,751,754
    ui/imprints.js:74,84   ui/analytics.js:167,179
    ui/record.js:70        ui/storyui.js:15      ui/personas.js:6
    shell/body.html:162,243,258,262

### Step 6. The twenty seven static ones

Each needs `tabindex="0"` and nothing else. The list is reproducible: the
audit script is `proto/tip/` adjacent and can be re-run against any build.
The largest single group is the balance strip glyphs at `ui.js:475`, which
are 15 by 15 pixels and therefore also fail gate 8's tap floor. Those two
defects are one defect and should be fixed together.

---

## THE MEASUREMENT

All of it on the live `source.html`, Gordon loaded, 1600 by 1000, with the
block and the module injected at run time. `source.html` was not edited.

### Frame Time On The Field, Dark

Eight interleaved repetitions, 2.5 seconds of `requestAnimationFrame` each.

    panel closed    median 60.6 fps    mean 60.56    range 60.5 to 60.6
    panel open      median 60.6 fps    mean 60.54    range 60.2 to 60.6

**16.5 milliseconds a frame with the tooltip open over the repainting wheel,
which is the vsync ceiling.** The tooltip costs the Field nothing measurable.
Every sample in both conditions lands between 60.2 and 60.6, a spread of 0.4
across sixteen runs, so the difference of 0.02 between the two means is
noise and not a reading.

On the prototype's own repainting canvas, 180 frames each: 16.60ms mean with
the panel open, 16.65ms closed.

### The Structural Assertions, All Seven Lightings, Panel Open

    lighting     backdrops over the Field   tip backdrop-filter   over the wheel
    dark                 0                       none                  false
    snow                 0                       none                  false
    punch                0                       none                  false
    glass                0                       none                  false
    glasswhite           0                       none                  false
    flat                 0                       none                  false
    lumen                0                       none                  false

And the ground resolves to an opaque colour in all seven: `rgb(26,29,38)`,
`rgb(248,247,243)`, `color(srgb .143 .172 .220)`, `rgb(21,25,34)`,
`rgb(246,246,244)`, `rgb(18,20,25)`, `rgb(255,255,255)`.

### Gate Shaped Checks On The Prototype, 18 Carriers, Both Widths

    1600 x 1000, anchored
      panel overlaps its carrier              0
      text under 11px                         0
      text under 4.5 to 1 on its own ground   0    lowest measured 5.30
      close button under 44 x 44              0    not shown at this width
      page errors                             0

    390 x 844, sheet
      panel overlaps its carrier              0
      text under 11px                         0
      text under 4.5 to 1 on its own ground   0    lowest measured 5.30
      close button under 44 x 44              0    measured 44 x 44
      page errors                             0

### Glass Did Not Resolve, And I Am Not Going To Pretend It Did

An early single pass read Glass at 53.2 closed and 47.1 open, a loss of 6.1.
Repeating it five times interleaved gave a closed range of **46.1 to 60.7 on
the same condition**. The noise on this runner is about 14 frames a second in
Glass, which is more than twice the effect being looked for.

Four layerisation strategies were then measured, four repetitions each. The
medians ordered themselves plausibly and the ranges overlapped almost
completely. Under this runner's noise none of it means anything, and a
compositing hint added on evidence that did not resolve is exactly the
mistake `CLAUDE.md` records being bitten by twice.

So: no `will-change`, no `contain`, no `isolation` in the shipped block. The
structural rule is satisfied absolutely, which is the part that is
deterministic, and it is the part gate 13 asserts for the same reason. The
experiment to settle it is in the questions below.

### What Was Found By Measuring And Would Have Shipped

Five defects, each caught by a run rather than by reading:

1. A transparent ground in Dark and Snow, from an unresolved `var()`.
2. The sheet closing itself, because scrolling the carrier clear fired the
   scroll handler. Five of eighteen carriers on the 390 run.
3. The sheet still covering the carrier when the page cannot scroll further.
4. The panel landing on the tab bar in Glass, at 637, 26.
5. The panel landing dead centre of the wheel, which is law 8, broken by the
   thing meant to explain the wheel.

And one probe that lied: the first overlap check read the carrier's rectangle
before a smooth scroll and the panel's after, and reported five failures that
were its own. Checked against a known good case, corrected, re-run.

---

## THE QUESTIONS YOU CANNOT ANSWER, AND I AM ASKING RATHER THAN GUESSING

**1. Does the tooltip cost Glass frames?** This runner cannot tell. The
experiment is exact and takes two minutes on a quiet machine: load
`source.html`, Gordon, Glass, the Field, then alternate ten times between the
panel closed and the panel open over the wheel, 2.5 seconds of
`requestAnimationFrame` each, and compare the medians. If Glass loses more
than 3 frames a second, add `will-change:opacity, transform` to `.tip` and
repeat. If it does not, the block ships as written. The script is
`proto/tip/` adjacent and ready.

**2. Should hover open at all on a fine pointer, or should everything be a
tap?** Hover with intent is the convention and it is free on a desktop. It is
also a second interaction model to maintain and it is the one no gate can
easily test. Tap only would make the product one thing everywhere. I have
built hover because the current product has it and removing an affordance is
a bigger ruling than adding one. Your call.

**3. What is the action line for, exactly?** `Press to read it` currently
appears on the eight `data-tip` carriers because those rows jump into the
codex. If the ambition is that every named thing is a door, the action line
belongs on most of the 195. If it is only for rows that already navigate, it
belongs on eight. That is a product ruling, not a design one.

**4. Does a tooltip on the Compass and the Body pages need to carry the same
shape?** Those two surfaces draw their own graphics with their own hit
testing, and both would use `showAt`. I have not measured what the right
placement order is for either, because I have not been asked to touch them.
Say the word and I will.

**5. The `.vt` depth buttons are off screen at 1600.** Three of four, at x
1563, 3108 and 4653 in a 1552 pixel scroller. That is not the tooltip, but it
means three of the only eight reachable definitions in the product today
cannot be reached at all. Whose is it?

**6. `CLAUDE.md` says four lightings and the code has seven.** `DESIGN.md`
records the same disagreement. The tooltip is written for seven, read off
`LIGHTINGS` at run time, so it does not care which document is right. But the
document should be fixed by whoever owns it, and I am forbidden from touching
it.

---

## WHAT THIS MOVES THE GRADE TO

The tooltip was not gradeable, because there were eight of them.

    before     eight mechanisms, three panels, two geometries, 195
               definitions unreachable on a phone, one panel sitting on the
               hero graphic, one rendering an empty heading, one number in
               four printed with no denominator, one contrast failure at
               3.66 to 1 that no gate can see
    after      one mechanism, one geometry, 0 unreachable, 0 overlaps at both
               widths, lowest contrast inside the panel 5.30 to 1, no text
               under 11px, the tap floor met exactly, no backdrop filter in
               any lighting, and 60.6 frames a second on the Field with the
               panel open

Not a pass yet, because it is not in the build. Step 1 of the migration is
three file changes and it alone closes AM3.

---

## THE FILES

    proto/tip/tip.html                the runnable prototype, every state
    proto/tip/tip.css                 the block for shell/head.html
    proto/tip/tip.js                  the module for ui/tip.js
    proto/tip/_now-probe.png          the canvas probe on the hero graphic
    proto/tip/_now-railtip.png        the rail tooltip with its empty heading
    proto/tip/shot-1600-dark-ring.png
    proto/tip/shot-1600-dark-long.png
    proto/tip/shot-1600-dark-static.png
    proto/tip/shot-1600-dark-canvas.png
    proto/tip/shot-1600-snow-ring.png
    proto/tip/shot-1600-side-bottom.png
    proto/tip/shot-1600-side-top.png
    proto/tip/shot-1600-side-right.png
    proto/tip/shot-1600-side-left.png
    proto/tip/shot-390-dark-sheet.png
    proto/tip/shot-390-dark-long.png
    proto/tip/shot-390-snow-sheet.png
    proto/tip/shot-field-live-dark.png      the design on the live Field
    proto/tip/shot-field-live-glass.png
    proto/tip/shot-field-leftmark.png       the side following the mark
    proto/tip/shot-field-rightmark.png
