# The Phone Build. Specification

Creative direction, art direction, UI and UX for Atüned / SOURCE on a phone.
The architectural ruling, the detection rule, the navigation, every surface at
390, the touch model, six ICP rounds, the build order, and what the phone
deliberately does not carry.

Nothing in this document has been built. No file outside this one was touched.
`DESIGN-mobile.md` and `DESIGN-mobile-icp.md` carry a five pass study at this
exact size and say of themselves that nothing in them was built either. This
document starts from them, remeasures against the build as it stands today, and
carries the iteration forward from their point of convergence. Where it differs
from them, it says so and says why.

---

## 0. Measured Today, Before Anything Is Proposed

Chromium 1194, `source.html` at commit 64f2ded, device scale 2, touch on,
`isMobile` on. Reproduced with the owner's own numbers where they overlap.

**The navigation.**

    390 x 844   4 of 8 tabs off screen   Compass, Knowledge, Games, Summary
    360 x 800   4 of 8 off               same four
    430 x 932   3 of 8 off               Knowledge, Games, Summary
    844 x 390   0 of 8 off               landscape gets the desktop bar

`#tabbar` measures 348 wide with 671 of content, `overflow-x:auto`,
`flex-wrap:nowrap!important` at `atuned_src/shell/head.html:589`, the scrollbar
suppressed at `:592`, and a 26px fade mask at `:602`. So the four tabs are not
literally unreachable: they are behind a blind horizontal drag inside a 45px
strip whose only sign is a fade. That is the same defect the key strip already
carries and it is the project's own rule 10 broken. The owner's harsher reading
is also fair, because that drag competes with a page that scrolls sideways
underneath it.

**The page scrolls sideways.** `document.body.scrollWidth` reads 1386 against a
390 viewport, and `body.scrollLeft = 900` succeeds. The bleed is `#subbar`, the
depth row, measuring 1378 inside a 374 box with no overflow rule, at
`atuned_src/shell/body.html:170`.

**Nested scrollers.** `documentElement.scrollHeight` reads 844 while
`body.scrollHeight` reads 5428 on Field. `window.scrollTo(0,3000)` leaves
`window.scrollY` at 0. The body is the scroller and the document is not, so
every sticky or fixed rule written later resolves against the wrong box.

**The chrome.**

    .top          7..296    289 tall
    #tabbar      67..112    4 of 8 off the right edge
    Profile lab 118..136
    #psel       142..186    full width, 348 wide, naming another person
    undo/redo   192..236
    lighting    192..236
    help        192..236
    account     242..286    wraps to a fourth row at 390 and 360
    #subbar     302..364    1378 of content in a 374 box
    #key        371..425    1118 of content in a 374 box, scrollbar hidden
    canvas      425..760

289 pixels of chrome, then 123 more of two hidden scrollers, and the instrument
starts at 425 on an 844 screen. The third thing a person sees is a profile
select. On a loaded profile it reads "Lance, 54, author", so a practitioner
holding the phone out to a client shows the client another person's name.

**Page heights at 390, loaded.**

    Knowledge   23540      27.9 screens
    Summary     10393      12.3
    Story        9200      10.9
    Energetics   8583      10.2
    Body         6874       8.1
    Games        6162       7.3
    Field        5428       6.4
    Compass      5399       6.4

**The one action a phone is for is the last thing on the page.** On Summary,
which is where the app opens, `Run a release` sits at y 9586 of 10393. That is
11.4 screens down and in the final 8 percent of the document. The previous
study measured 4336 and called it 5.1 screens. It has got further away.

**A tap on the wheel throws the instrument off the screen.** Measured: tap a
bead at 390, `body.scrollTop` goes 0 to 4426 and the canvas moves to y minus
4001. There is no back control. The previous study measured 1978. It has more
than doubled.

**The wheel draws its captions on itself.** Three pills at depth B, measured in
canvas space:

    112 addresses · SQ · 0 loaded   y  65.7 .. 85.7   x  85.8 .. 288.2
    saboteurs · 39                  y  80.4 .. 100.4  x 133.5 .. 240.5
    21 laws · integrity 9.3         y 115.8 .. 135.8  x 110.0 .. 264.0

The first two overlap by 5.3 pixels vertically with their x ranges fully
nested, and both are drawn across the Crown seat label, which is struck through
in the render. At depth D there are eight pills and the centre is one block.

**Canvas text collisions, phone against desktop, same profile, same depth.**

    depth       390 x 844                1600 x 1000
    B (Cluster) 3 pairs,  0 clipped      3 pairs,  0 clipped
    C (Chain)   38 pairs, 2 clipped      10 pairs, 0 clipped
    D (Blueprint) 94 pairs, 2 clipped    25 pairs, 0 clipped

The desktop column is the baseline and it is printed so nobody reads the phone
number as an absolute. The tool that produced it lied on its first run: it read
text positions in local coordinates and reported the desktop seat names as
clipped to negative x, which is false. It was corrected to map every corner
through `ctx.getTransform()` and revalidated against the desktop case before
the phone numbers were trusted.

The cause is exact and it is not CSS. Every radius in `atuned_src/ui/wheel.js`
is a fraction of `U`. Every text size is an absolute constant. `U` measures
114.7 at 390 against 211 at 1600. The geometry halves and the type does not.
`pill()` at `atuned_src/ui/component.js:291` draws at `CX, CY - rad` at 11px
with no width check and no vertical ledger, so nine call sites stack on one
axis.

**Two surfaces do not render at all on a phone.**

`#cone.tabmode{position:absolute}` at `atuned_src/shell/head.html:2240` is never
released in the 720 block. The compass canvas measures 338 x 591 at y minus
612, so it draws on top of the chrome. The screenshot is two layers of text on
one another and nothing is legible.

`.pm-svg{position:absolute;inset:0;height:100%}` at
`atuned_src/shell/head.html:1796` sizes against `.emap`, whose `min-height` is
released to 0 at `:2310`. The body figure measures 374 x 0. The surface named
Body draws no body.

Both are the same defect. `.iq` at `:2306` and `.emap` at `:2310` were
released from absolute positioning and `#cone.tabmode` was not. Two of three
were fixed and the third was missed, inside one file, and nothing caught it.
That is the drift this codebase already has, and it is the strongest argument
for the gate in section 7.

**What is already right, and must not be undone.**

    canvas#cv touch-action    pan-y under (pointer:coarse), head.html:958
    drag to charge            disarmed on a coarse pointer, ui.js:113
    controls under 44px       0 on seven of nine surfaces, 1 on Energetics
    Knowledge                 already search first, chips already at 44
    blank profile             the reading silences itself and four doors render
    JS errors at 390          none

The 44 floor holds today. The previous study measured 28 violations on
Energetics and 12 on Story and those are gone. Anything in this document that
reads like a repeat of that work is a repeat of a document, not of the build.

---

## 1. The Architectural Ruling

**One file that adapts. `source.html` stays one build product. There is no
`phone.html` and there is no `BUILD-phone.sh`.**

The owner said "if I load up on my mobile device, it auto detects which version
and then gives me that version." That sentence describes an experience, not a
file count. **I am building to the reading that he is describing what he wants
to happen, not how many artifacts exist**, and I am saying so plainly because
the other reading is available and I am refusing it for reasons that follow.

### Why not a second build product

**It is broken on this product's own delivery channel, today, before drift is
even reached.** `CLAUDE.md` rules that every build goes to the owner as a
download, one attachment, named `atuned.html`, with the commit and the md5
stated, and that it runs from wherever it lands because it is one file with no
dependencies. A second build product means one of three things. The owner sends
two attachments and states two md5s, and the person on a phone has to know
which one is theirs. Or he sends one and the phone person gets the desktop
build. Or `source.html` navigates to `phone.html`, which only works if both
files travelled together to the same directory, and an email attachment does
not travel with a sibling. Option (b) does not fail in six months. It fails on
the first send.

**The gates only know about one build.** `tools/equiv.py` compares one file
against one baseline, by name and hashed body, and exits non zero on any
difference. With two products every data table change needs two comparisons and
nothing in the gate set knows the second exists. `hostfree.py` asserts one
engine. `tests/design.js` renders one file. The proof apparatus is singular and
making it plural is a larger job than the phone layout.

**The TAB integers are persisted identity.** Two shells over one engine means
the first divergence in `setTab` or `render()` is silent. `atuned_src/engine/core.js:46`
records that a stale tab index caused the same class of bug four times, which
is why Compass is 8 and Settings is 9 rather than renumbered. A forked view
layer is that debt with a bigger surface.

**Drift here has a countable surface.** Four lightings, a seven seat colour
system, 33 icons added in one block alone, three motion curves and four
durations, the ring not fill rule, the 112 count, the one word per concept
rule, sentence case. Every one of those has to be true in both products and
only one of them has a gate. A hand copied palette drifts, and this is a hand
copied everything.

### Why layout alone is not enough either, and what the third answer is

Responsive means the same controls reflowed into a column. That is what exists,
and the owner is right that it is not good. Adaptive means a different
composition of the same components. The components do not fork, the composition
does.

Three of the defects in section 0 are outside CSS reach and prove the point.
The canvas labels are absolute pixels against fractional radii and no media
query enters a canvas. The tap that scrolls the body 4426 pixels is behaviour.
Every explanation in the product lives in a `title` attribute, so on a touch
device this product currently explains none of its own controls. A media query
does not fix any of the three. One constant in the renderer, one sheet, and one
relocation of the title strings fix all three, and none of them is a fork.

### What this costs, stated rather than smoothed

**Layout complexity concentrates in one media block and that block will grow.**
The 720 block is already 46 lines and already carries the bug in section 0. The
cap is the whole defence: one boolean, and a 390 gate in the same commit as the
first phone rule.

**The document carries elements the phone does not show.** The matrix is 171
cells and remains in the DOM under `display:none`. It costs parse time and
bytes and no layout. Measured cost of the whole matrix block in the built file
is under 4KB of a 1.05MB build. Accepted.

**Two compositions in one renderer set is real work and I am not calling it
small.** Nine surfaces each gain a phone arrangement. What keeps it from being
a fork is that every one of them renders the same components from the same
state through the same entry points. The only place that genuinely needs a
second code path is the wheel's label spend, and that is one constant read by
nine call sites.

**What breaks if I am wrong.** If the phone composition turns out to need
different data and not just a different arrangement, this ruling is wrong and
the right answer is a second shell over the same engine, never a second engine.
The test for that is one question asked at the end of build step M3: did any
phone rule need a value the desktop does not compute. If the answer is ever
yes, reopen this section in writing.

---

## 2. The Detection Rule

**Space decides the composition. The pointer decides the interaction. One
token, and the pointer half needs no token because it already exists.**

    /* set once at boot, and again on the media query change event */
    const PHONEQ = matchMedia(
      '(max-width:720px), (pointer:coarse) and (max-height:560px)');
    const setPhone = () => document.body.classList.toggle('phone', PHONEQ.matches);
    setPhone(); PHONEQ.addEventListener('change', setPhone);

Interaction stays where it already is, at `atuned_src/shell/head.html:958` and
`atuned_src/ui/ui.js:113`, keyed on `(pointer:coarse)` and nothing else.

**Never the user agent string.** A user agent is an identity claim and this
product's whole posture is that it does not collect identity claims. The engine
may not touch `navigator` at all and `hostfree.py` enforces it. Beyond posture,
it is simply wrong: it reports desktop for a tablet with a keyboard, reports
mobile for a desktop browser in device emulation, is spoofed by default in two
shipping browsers, and goes stale whenever a vendor rewrites it. A media query
is a statement about the room the person is in. That is the thing being asked.

**Why the second clause.** Width alone fails and the failure is measured. A
phone held sideways is 844 x 390. On width alone it lands in the desktop
composition with a 242 pixel stage, which is the worst of the three
arrangements. The height clause catches it.

**What happens, stated case by case.**

    phone upright        390 x 844,  coarse   phone. first clause.
    phone sideways       844 x 390,  coarse   phone. second clause.
    small phone          360 x 800,  coarse   phone. first clause.
    large phone          430 x 932,  coarse   phone. first clause.
    tablet upright       820 x 1180, coarse   not phone. desktop composition,
                                              which fits at 820. touch safety
                                              comes from the pointer query,
                                              which is already in the build.
    tablet sideways     1180 x 820,  coarse   not phone. correct.
    7in tablet           600 x 960,  coarse   phone. the tab bar does not fit
                                              at 600 either, so the phone
                                              composition is the right one.
    desktop dragged      500 x 900,  fine     phone composition, mouse
                                              interaction. correct: the
                                              composition failure is about
                                              space. hover still works, drag
                                              to charge still arms, because
                                              those answer to the pointer.
    desktop              1600 x 1000, fine    not phone. unchanged.

**One boolean and no more.** `body.phone` is the only layout mode this product
gets. Anything asking for `body.tablet` or `body.compact` is a request to
reopen this section in writing, not a CSS change. The cap is the defence
against the drift that section 1 argues about, and it only holds if it is a
gate.

---

## 3. The Navigation

Eight tab labels sum to 671 pixels of text. At 390 they cannot be a bar at any
height without breaking the 44 floor. That is arithmetic and no styling answers
it.

The previous panel established the harder finding and it holds: **there is no
ranking of eight surfaces into four or five slots that serves a practitioner, a
first time quiz taker and an executive at once**, because they do not want the
same first screen. Three of six lost their primary surface to the same overflow
sheet and all three withheld. So the phone does not rank surfaces.

It ranks the loop instead.

### The bottom bar. Four slots, fixed, in the thumb arc

    Field    the instrument             TAB.FIELD   2
    Write    the only way charge gets in TAB.STORY  0
    Read     the only place it answers   TAB.SUMMARY 1
    All      every surface, as a page    no tab

Three of the four are the three states of the core loop, which is
`parseStory` to `compute` to `relPick` to `ritFor` and is already in the
engine. The fourth is a door, not a drawer.

64 tall plus the safe area inset, fixed, never scrolls, does not scroll
horizontally. Four slots at 390 gives 97 per target. A ring icon over a label,
sentence case, one word each.

**Why this answers the objection that killed the four slot bar.** Sofia,
Angela and James each lost a destination into a sheet called More. Here nothing
is in a sheet called More. **All** opens a full screen page listing every
surface as a peer, each row a name and one line of what it does. Nine rows at
64 is 576, plus a 52 header, inside 844 with no scroll. Marcus's objection was
precise and it was to the word: More is what a team says when it could not
decide. All is not a decision deferred, it is the statement that the bar is a
shortcut and the list is the product.

**The All page, in order.**

    Field         the wheel. where charge sits and what it is chorded to
    Write         the day in your own words. the engine reads it
    Read          the reading, in sentences
    Body          the seven seats on a figure, and where it is held
    Energetics    the questions. fifteen minutes, resumable
    Compass       the two paths of one behaviour, over time
    Knowledge     every table the reading runs on
    Games         brain release. six of them
    Analytics     the numbers behind the reading
    ----
    History       what you changed, and taking it back
    Reference cases  how this looks with somebody else's field loaded
    Settings      lighting, type, quiet, account, who has sight

**Analytics keeps a row although it has no tab.** It is folded into Summary and
it stays folded. The row sets Summary and scrolls to the analytics block. A
folded surface keeps its door, because James came for Analytics and a surface
he cannot name is a surface he cannot ask for. This is one line in the row
handler, not a new tab, and `TAB.ANALYTICS` stays 4.

**Reference cases** is `#psel` at `atuned_src/shell/body.html:107`. It leaves
the chrome entirely. It is a demonstration control and it is labelled as one.
It costs James at step two and Sofia at step two, and between them they are 240
of 1000 on the panel's weights.

**The tab integers do not move.** `TABDEF` at `atuned_src/engine/core.js:85`
reorders so that Field, Story and Summary are the first three, which the file's
own comment explicitly permits. The bar is built from the first three entries
plus the All control. `setTab` needs no change: it already works by key and
already paints by `TABOF(k).cls`. That is the reward for freezing `TAB`.

### The primary action. One verb, above the bar

Full width less a 16 gutter, 56 tall, fixed directly above the bar. The only
element of its colour on the screen. Its label is a verb and it changes with
the state, and the line above it says why.

    state                          the line                              verb
    nothing held                   Nothing entered yet.                  Write
    story written, not applied     3 seats loaded from what you wrote.   Read it
    seats held, nothing released   Heaviest seat: fear, lumbar plexus,   Run a
                                   6.2.                                  release
    release finished               4 patterns cleared. Field down 1.8.   Set a
                                                                         ritual

No new arithmetic. `compute()` returns everything the line needs and `relPick`
already picks the seats. What is new is a function that reads state and returns
a verb and a line. It is small and pure, so it belongs in `atuned_src/engine/`
and can be tested headless in `tests/engine.js`.

This is what moves the release from y 9586 to the thumb.

---

## 4. The Chrome

Today it is 289 pixels, seven controls, and it costs every screen forever.

**What survives at the top.** A bar 52 tall, fixed, two things.

    left    the current surface's name. sentence case, 17px, one word.
    right   one back control. 44 x 44. ring icon.

Not the wordmark. A person who has opened the app knows what it is. What they
do not know is where they are, and the previous panel's most common single
complaint was Angela's: "how to go back. Every time I tapped something I lost
my place and there was no arrow." The wordmark already gets four seconds in the
boot, which is the one place in this product with an emotional register.

**What moves behind the All page.** Reference cases, lighting, help, account,
history. Five controls off every screen. Lighting and type size are set once in
a product's lifetime and do not earn permanent chrome on the smallest screen.

**Undo and redo, which is the one argument here.** They are the largest
remaining gap in the product and putting them behind a list makes them harder
to reach. The ruling is that on a phone they are not chrome. They attach to the
thing they undo: the sheet that made a change carries a 44px control that says
what it will take back, and the All page carries a History row. A power user
loses a permanent pair. Everybody else gains 44 pixels on every screen and a
control that names its own effect instead of saying only "undo". I state it as
a cost because it is one.

**What goes behind something.** The depth ladder, `#vbar` at
`atuned_src/shell/body.html:170`, which is 1378 of content in a 374 box and is
the thing making the page scroll sideways. It becomes one button sitting on the
wheel's lower left corner showing the current depth by name. Tapped, it opens a
four row sheet, each row the depth name and its `layers` string from
`atuned_src/ui/wheel.js:131`. That string exists today only inside a `title`
attribute and is therefore invisible on every touch device. This one change
removes the horizontal bleed and recovers a body of explanation the product
already wrote and currently cannot show.

**The key strip.** `#key`, 1118 of content in a 374 box behind a hidden
scrollbar. It becomes a wrapping row of rings, four up, under the caption.
Wrap, never scroll. Rule 10.

---

## 5. Surface By Surface At 390

Each one states the first screen top to bottom in device pixels at 390 x 844,
then what changes, then what blocks it.

### Field

    0..52      top bar. "Field" left, back right
    52..60     gutter
    60..422    the wheel. square, 362 x 362
    422..430   gutter
    430..456   the caption. one line, 13px, DOM, not canvas
    456..500   the key. four rings in a row, wrapping
    500..556   the state line
    556..724   the reading, first card, scrolls on from here
    724..780   the primary action, fixed
    780..844   the bottom bar, fixed, plus safe area

The wheel starts at 60 instead of 425. That is 365 pixels recovered, 43 percent
of the screen.

Square, sized `min(100vw - 28px, 100svh - 232px)`. `svh` and not `vh`, because
iOS reports `vh` against the toolbar free height and the wheel would sit under
the bottom bar on first paint. Square because `reframe()` at
`atuned_src/ui/component.js:111` takes `U` from `min(CW,CH)/2`, so today's
374 x 335 throws away 19 pixels of width on each side for nothing.

The depth button sits on the wheel's lower left corner, 44 x 44 plus its label.

**Blocked on nothing.**

### Read, which is Summary

The app opens here and a stranger's first screen is this one with nothing
entered. That must not change.

    0..52      top bar. "Read"
    52..        the plate. first name at display size, the band and the
               direction out of it beside it. full bleed, no box.
               on r.unread this is replaced by the four doors and the
               reading silences itself, which is already true today and
               is the single best thing on this surface.
               the reading, in its own panel, with its own ground
               the output row: the protocol, the release, the next marker
               everything structural as rows that open, one at a time
               analytics last
    724..      the primary action
    780..      the bar

10393 pixels today. The target is under 2400, which is under three screens,
and it comes from the structural blocks becoming rows rather than from deleting
anything.

On a blank profile the primary action and the first door say the same thing.
The doors collapse to three rows under the action, and the action is door one.
One object, one action.

**Blocked on nothing.**

### Write, which is Story

The box is the object and it is the only thing on the screen.

    0..52      top bar. "Write"
    52..       a textarea at 40vh, one ground, no box inside a box
               the speak control, 44 x 44, beside it
               nothing else above the fold
    724..      the primary action. "Read it"
    780..      the bar

The imprint cloud is 38 pills on the stage today. It collapses to five group
headers with counts, one group open at a time, which is the UI UX architecture
review's own ruling and takes Story from 111 controls to 42 at desktop width.
On a phone it goes under the box, below the fold.

The release settings become a sheet raised by the primary action once a story
has landed: how many patterns, how long, how quick, which ones. Run from there
without leaving Write.

**Blocked on nothing.**

### Body

**Blocked, and it is a two line fix.** The figure renders 374 x 0 because
`.pm-svg` at `atuned_src/shell/head.html:1796` sizes against a parent whose
`min-height` is released to 0 at `:2310`. Until that is released the surface
named Body draws no body.

Once it renders:

    0..52      top bar. "Body"
    52..       the figure. full width, aspect locked, 362 x 500
               one layer button on its lower left, opening a seven row sheet
               the seat list under it, seven rows, colour as the only mark
    724..      the primary action
    780..      the bar

The seven layer buttons become one button and a sheet, the same pattern as the
depth ladder. That pattern was already invented on this codebase for exactly
this reason: the comment at `atuned_src/shell/body.html:168` records that the
layer row wrapped to two lines and covered the head and the throat, and that a
control which hides the thing it controls is not a control.

The pain map is the one place on a phone where a drag writes. It is additive,
it has its own clear control, and a person painting on a figure has said what
they are doing. It is not the wheel.

### Energetics, which is Intake

Its own linear flow with no chrome at all. This is the funnel and it does not
share a layout with the instrument.

    one question per screen
    the 0 to 10 scale wrapping to two rows of six and five, every point 44
    a progress line, not a count against a total
    a back control
    fifteen minutes stated at the top, resumable, stated as resumable

The scale is the only measured floor violation left in the build: `.iq-n` at
`atuned_src/shell/head.html:953` is a fixed 32 x 32 square and there are eleven
per question. Eleven at 44 is 484 against a 390 screen. `.iq-sl` at `:952`
already sets `flex-wrap:wrap`, so the answer is `flex:1 1 44px; min-width:44px;
height:44px; width:auto` and it wraps. All eleven points survive. No data
changes.

The 400 word paragraph that currently opens the surface moves behind a "why
this is asked" row. It is good writing and it is not the first thing a person
needs.

**Blocked on nothing.**

### Compass

**Blocked, and it is a one line fix.** `#cone.tabmode{position:absolute}` at
`atuned_src/shell/head.html:2240` is never released in the 720 block, so the
canvas lands at y minus 612 and draws on top of the chrome. `.iq` and `.emap`
have the release and this does not.

Once it renders, the phone default is the flat two dimensional version, not the
spinning one. A 338 wide rotating mesh with haloed labels at 60 frames on a
phone is a frame budget conversation and the flat version carries the same
reading. The spinning one is a button, which is the reverse of the desktop
default and is the only place in this document where the two compositions
differ in what they show first. It is stated here so nobody calls it a
regression.

    0..52      top bar. "Compass"
    52..       the flat figure, 362 wide
               the oscillating band under it, 30 day by default
               the layers control as one button and a sheet
    724..      the primary action
    780..      the bar

### Knowledge

Already close, and it should be said. The search field is already first, the
chips are already at 44, the cards are already a deck. The one change is
measured: 23540 pixels of document at 390, 27.9 screens.

**Nothing renders until a person types or taps a chip.** The list logic exists.
The page goes from 23540 to under 900 and the search field becomes the object
rather than a control above a wall. The 112 addresses remain, all of them, and
the catalogue exemption in the UI UX review protects them from being
"simplified" by a later pass.

`on the right` in `atuned_src/ui/knowledge.js:95` becomes `below`.

### Games

A list of games, each a row with its name and one line of what it does. A game
runs full screen with the chrome gone and one exit control.

Games are the one surface where the phone is better than the desktop, because a
brain release game is a thing done in a queue and not at a desk, and the spec
should say so rather than treating every surface as a loss.

### Settings

A list. Each row carries its name and its current value on the right, and a tap
changes it. No segmented controls, no three button rows.

    Lighting        Dark
    Type size       Standard
    Quiet           Off
    Profile         ...
    Reference cases ...
    History         ...
    Account         ...
    Who has sight   nobody

**Quiet** is new and it is James's row. One switch that sets reduced motion for
this profile regardless of the system setting, drops the background wash and
stops the field breathing. It is a setting and not a theme, and it is not
`prefers-reduced-motion`, which is honoured separately and always.

**Who has sight** is listed here with nobody as its value even before the
practitioner grant is built, because a person is entitled to see that the
answer is nobody. Never a silent default.

---

## 6. The Touch Model

### The wheel

**What a thumb does.**

    tap on an address, seat or ring   opens the sheet. the wheel stays lit
                                      behind it. never a scroll.
    drag on empty canvas or the core  pans the frame. already the behaviour
                                      at atuned_src/ui/ui.js:58.
    pinch                             zoom, through the existing
                                      setZoom(z,ax,ay) at ui.js:80, with the
                                      midpoint as the anchor. replaces the
                                      wheel event, which no phone fires.
    double tap                        reframe. replaces the f key.
    vertical swipe anywhere           scrolls the page. touch-action pan-y,
                                      already set at head.html:958.

**What a thumb must not do, and both of these are already true and must stay
true.**

**It must not write charge.** `COARSE` at `atuned_src/ui/ui.js:113` disarms
`DRAG` on a coarse pointer and the comment above it records the reproduction:
a touch on Denial Of Light and a 60 pixel drag upward moved Anger from 8.0 to
10.0 and the page did not move at all. There is no undo, so the charge was
simply gone. It cost somebody a reading once. **This stays disarmed until undo
exists, and this document says so explicitly so that the next pass has to argue
with a sentence rather than quietly delete a boolean.**

**It must not lose the instrument.** Today a tap scrolls the body to 4426 and
the canvas leaves the screen by 4001 pixels with no way back. The sheet
replaces this outright. The tap is correct. The return is what is broken.

### The sheet

One component. About forty lines of CSS and a pointer handler. No library.

Three detents.

    peek   120px   the seat, the plexus, the value. one line. opens here.
    half   45vh    the full address: what it is, what it produces, the
                   direction out of it, and the title string that a phone
                   cannot otherwise reach.
    full   92vh    the address, its chords, and its controls.

**It opens at peek and not at half.** That is Sofia's change and it is the only
reason the sheet works in a session: she holds the phone out to a client, taps
an address, and the instrument stays visible with one line under it. Half is a
second, deliberate drag.

Dismissed by a downward swipe, by the back control, by a backdrop tap, and by
Escape where there is a keyboard. That is the single dismissal contract the
product is missing, and defining it here means every later overlay inherits it.

The wheel keeps drawing behind the sheet with the tapped address lit. The frame
budget question is real: `compute()` and `draw()` run every frame through the
loop at `atuned_src/ui/ui.js:310`. While the sheet is in motion the wheel holds
its last frame and resumes on settle. Under `prefers-reduced-motion` the sheet
gets its end state and no travel, which is this product's stated rule and not a
faster animation.

### One handed reach

On an 844 tall phone the comfortable thumb arc is roughly the lower 420 pixels
and the top 200 is the hardest reach on the screen. Today every control in this
product is in the top 289.

**What sits in the bottom third.**

    780..844   the bottom bar. four slots, 97 each.
    724..780   the primary action. full width, 56.
    the sheet's handle and its first two rows, when one is open.

**The rule.** Nothing above 420 is ever the only way to do something. The back
control at the top right is the one exception and it is duplicated three ways:
a downward swipe on the sheet, a backdrop tap, and the system back gesture.

---

## 7. The ICP Rounds

Six rounds, numbered 6 through 11 because the five in `DESIGN-mobile-icp.md`
came first and this continues them rather than repeating them. The roster is
the six ICPs in `atuned_src/engine/data/people.js` carrying `ICP` in their role
plus the three reference cases, at the weights in `RESEARCH-icp.md`: Diane 180,
Derek 170, Marcus 160, Angela 150, Sofia 140, James 100, Ana 50, Gordon 35,
Rosa 15.

**Every reaction in this section is simulated.** Nothing was said by a real
person. The measurements in section 0 are measured and are marked as such. The
two must not be read as the same kind of evidence.

Each round states what was put in front of the panel, what broke, and what
changed as a result. A round that changes nothing is the stopping condition.

### Round 6. The four slot bar, tested against the three who lost a surface

**Put in front of them.** Field, Write, Read and All in the bar. The primary
action above it. All opens a full screen list of nine surfaces plus three
service rows.

**Sofia, 140.** Holds. All is a page and Knowledge is row seven of it, not the
seventh thing inside a drawer called More. But she is holding the phone out to
a client and the sheet covers 60 percent of the screen, so her own tap hides
the instrument she is pointing at.

**Angela, 150.** Confuses. The app opens on Read and the bar's first slot says
Field, and she does not know what Field means. She came from a group chat to
take a quiz.

**James, 100.** Resists. Analytics is not in the list, because Analytics is
folded into Summary and has no tab. He came for Analytics and cannot name it.

**Derek, 170.** Buys. The verb is on the screen and it is one tap.

**Diane, 180.** Buys, and asks for a delta for the sixth time.

**Marcus, 160.** Holds. "All is a word that means something. More is a word
that means we could not decide."

**Changed.**
1. The sheet opens at a 120 pixel peek detent, not at half. Half is a second
   drag.
2. On `r.unread` the app opens on Read with the four doors and the primary
   action reads "Write what happened". Field is still one tap and is not the
   default for somebody who has entered nothing.
3. The All page carries an Analytics row that sets Summary and scrolls to the
   analytics block. A folded surface keeps its door.

### Round 7. The blank profile, which is what a stranger sees

**Put in front of them.** Round 6 plus the three changes, with nothing entered.

**Ana, 50.** Holds, and it is the first time she has not refused in seven
rounds. "One thing at a time. At two in the morning I can do one thing at a
time. Nothing on the screen called me a word."

**Angela.** Holds and then stalls. The primary action says "Write what
happened" and the first of the four doors says "Write what happened". She reads
it as two different controls and taps the wrong one twice.

**Marcus.** Holds. "Two controls with the same sentence is the join showing. I
can see the two teams."

**Changed.**
4. On a blank profile the primary action **is** door one. The four doors
   collapse to the three that remain, listed under it. One object, one action.

### Round 8. Sideways, and the other two sizes

**Put in front of them.** Rounds 6 and 7 at 844 x 390, 430 x 932 and 360 x 800.

**Measured, not simulated.** At 844 x 390 the top bar at 52, the action at 56
and the bar at 64 leave 218 for the object. A 218 square wheel is `U` 109,
which is below the label floor even after the budget in section 8.

**Marcus.** Resists at landscape. "You have made a phone app and then turned it
sideways and let it fall over."

**Derek.** Holds at landscape. He uses it sideways in a car and is the one
person who does.

**Changed.**
5. In landscape the wheel and the sheet go side by side: the wheel at the full
   available height on the left, the sheet as a fixed right column at 46
   percent. The bottom bar becomes a left rail of four at 64 wide, because the
   thumb arc in landscape is the two bottom corners and not the bottom edge.
   This is one orientation query inside the existing token. It is not a third
   mode and it does not reopen section 2.

360 and 430 needed no change. 360 gives 90 per slot and 430 gives 107.

### Round 9. Sofia with a client's eyes on the screen

**Put in front of them.** Rounds 6 to 8, on Field, loaded, held out at arm's
length.

**Sofia.** Holds and then names the thing nobody had looked at. The profile
select is gone, which was the step two refusal for her and for James, and that
is the largest single fix in the document for her. But the caption line under
the wheel now reads `112 addresses · 0 loaded · 39 saboteurs · integrity 9.3`,
and a client reads "39 saboteurs" as a verdict about themselves, at arm's
length, in nine point type they did not ask for.

**Ana.** Agrees from the other side. "Thirty nine of anything, about me, at two
in the morning."

**Changed.**
6. The caption on a phone carries what is loaded, not an inventory of what
   exists. On a blank field it reads "Nothing loaded yet." On a read field it
   reads the heaviest seat and its plexus. The inventory moves into the sheet,
   where a person asked for it. This is also the count against a total rule
   read properly: the caption was printing an inventory at somebody who had not
   asked for one, and the fact that it is not literally a fraction does not make
   it a reading.

### Round 10. Derek's one tap, and James turning everything off

**Put in front of them.** Rounds 6 to 9, loaded, with charge held.

**Derek.** Buys. Cold open to a running release is one tap, against 9586
pixels of scrolling measured today. Then he says the same thing he has said in
seven rounds: the state line says "heaviest seat: fear, lumbar plexus, 6.2" and
does not say what 6.2 costs him. The slot is built and empty.

**James.** Holds. He wants everything that moves to stop and there is no
control that does it. The lighting menu changes the palette. `prefers-reduced-motion`
is honoured but it is a system setting and he will not change his system for one
app.

**Diane.** Buys. Asks for the delta for the eighth time.

**Changed.**
7. Settings gains a Quiet row. One switch, per profile, which sets reduced
   motion regardless of the system setting, drops the background wash and stops
   the field breathing. It is a setting, not a theme, and it does not touch the
   `prefers-reduced-motion` path, which is honoured always.

**Not changed, and carried out of this document.** The cost line and the delta
are engine work, not layout. Derek and Diane are 350 of 1000 between them and
they are the two most willing to pay, and they have now asked in eight rounds.
This is the third document to record it. It belongs in `TASKS.md` as an engine
item, not as a phone item, and putting it here again would be the fourth
recording of a thing nobody has built.

### Round 11. The confirmation round

**Put in front of them.** Everything above, all nine surfaces, at 390 x 844,
430 x 932, 360 x 800 and 844 x 390, blank and loaded.

**Nothing changed.** No ICP raised a new layout failure. Every objection still
standing is content: the tier word at the low end, the cost line, the delta, and
who can see a client's record. Sofia's condition is consent and not layout.
Gordon does not arrive and no layout reaches him, which was true in all eleven
rounds. Rosa is correctly not the customer.

**That is the stopping condition.** When the layout stops being the failure the
real failures become visible, and the ones that are visible now are the same
four the previous study ended on. Two studies converging on the same four from
different starting points is evidence that the convergence is real rather than
a fresh opinion.

### Tally across the six rounds

    round   BUY  HOLD  CONFUSE  RESIST  REFUSE   what changed
    6        2     2      1        1       0     3 changes
    7        2     4      0        0       0     1 change
    8        2     3      0        1       0     1 change
    9        3     3      0        0       0     1 change
    10       4     2      0        0       0     1 change
    11       4     2      0        0       0     nothing

---

## 8. The Wheel, And The Labels That Must Leave It

This is the art direction call and it is the difference between a shrunk
desktop chart and an instrument that reads at arm's length.

**A phone wheel shows fewer labels, larger. Not the same labels, smaller.**

At `U` 114.7 the current ladder tries to print, at Blueprint depth: seven seat
names, nineteen domain names, twelve archetype names, six mask names, up to six
saboteur nameplates and eight text pills. Fifty eight pieces of type on a 362
circle, with 94 overlapping pairs and two names running off the canvas.

### What draws on a phone

    the core number, CQ          keeps its size. it is the reading.
    the seven seat names         11px, on the shell, inward anchored
    the lead archetype only      11px, at depth C and D
    every ring                   unchanged. colour and weight carry the data.
    every bead                   unchanged. they are the data.

### What stops drawing on a phone

    the 19 domain names          the ring keeps its colour and its weight.
                                 the names live in the caption and the sheet.
    the 6 mask names             same.
    the 11 secondary archetypes  same.
    every text pill              all of them. see below.
    the saboteur nameplates      already suppressed at depth C and D by the
                                 CEIL guard, on desktop and phone both.
                                 stated here so nobody finds it later and
                                 calls it a regression.

### The pills leave the canvas entirely

`pill()` at `atuned_src/ui/component.js:291` has no width check against the
chord available at its radius and no vertical ledger against the pill before
it, which is why eight of them stack down one axis. Under `body.phone` the nine
call sites at `atuned_src/ui/wheel.js:614, 625, 634, 682, 693, 781, 790, 791,
792` write into one DOM caption element under the canvas instead:

    Heaviest seat: fear, lumbar plexus, 6.2

One line, 13px, selectable, themeable, read by a screen reader, and outside the
instrument.

**This is already a ruling and it was already broken here.** `FEEDBACK-log.md`,
the owner, 17 September: "display information over the main feature is bad
design, shrink it" and "I do not like text hovering over things unless I can
read it." The ruling was applied to the key card and the same defect shipped at
phone width in the same place.

### The label budget is one constant, not a fork

    var LBUDGET = document.body.classList.contains('phone') ? 1 : 3;

Read once per frame by the nine call sites. It is the only place in this
document where a renderer needs a second code path, and it is a number rather
than a branch.

### Type does not shrink to make labels fit

12px at `U` 211 becomes 6.5px at `U` 114.7 and 6.5px is not type, it is
texture. Spend fewer labels at full size. This is the one move that cannot be
substituted by any amount of layout.

---

## 9. Build Order

Each step is independently shippable and independently gated. Sizes are honest
against this codebase.

### S. Small

**S1. Release the three absolute panels at 720.** Two rules, and it unblocks
two surfaces that currently do not render at all.

    head.html:2240   #cone.tabmode gets the same static release .iq and .emap
                     already have at :2306 and :2310
    head.html:1796   .pm-svg sizes against a parent with a height, or .emap
                     keeps a min-height under phone

Nothing else in this document can be looked at on a phone until this lands.

**S2. The mode token and its gate, in the same commit.** Not after it.

    ui.js boot       body.phone from the two clause query in section 2,
                     listening for the change event
    tests/design.js  a 390 x 844 pass and an 844 x 390 pass beside the 1600
                     one, checking: no document and no body horizontal
                     scroll, every visible control at or above 44, the
                     object fully inside the first viewport, and canvas
                     text overlaps at or below the desktop baseline for
                     the same depth

The gate is the point. `body.scrollWidth` reads 1386 today and no gate looks at
it.

**S3. The 44 floor under phone.** One rule, one selector list, plus `.iq-n`
wrapping to two rows of six and five. The floor holds on seven of nine surfaces
already; this is the last one.

**S4. The desktop verbs.** Four strings ship instructions a phone cannot
follow.

    ui/ui.js:7         "Hover a bead to name it."
    ui/ui.js:32        "Click to select, shift-click to add."
    ui/ui.js:101       "Scroll on the wheel to move in, F to come back."
    ui/knowledge.js:95 "the same detail the wheel opens, on the right."

Two of them describe interactions a phone cannot perform at all, and the one
that explains shift click is itself inside a `title`, so the instruction is
unreachable by the same device that cannot follow it.

### M. Medium

**M1. The chrome.** Top bar at 52. `#tabbar` stops being a hidden scroller. The
All page. Reference cases, lighting, help and account out of the bar. The depth
ladder becomes one button and a sheet carrying `VIEWS[i].layers`, which removes
the horizontal bleed and recovers a body of explanation at the same time.

**M2. The bottom bar and the primary action.** `TABDEF` reorder, which is a
named diff to acknowledge through `tools/equiv.py` rather than a silent one.
Four slots. The state verb function, which is pure and goes in the engine with
its own headless tests. `setTab` unchanged.

**M3. The wheel.** Square canvas, `svh` sizing, order first. Pills to the DOM
caption. The label budget constant. The key strip wraps rather than scrolls.

**M4. The sheet.** One component, three detents, the single dismissal contract.
Replaces the 4426 pixel jump. M3 depends on this for its tap behaviour, so M4
lands first or they land together.

### L. Large

**L1. Energetics as its own linear flow.** The largest layout cost in the
document and it is the funnel. A mode inside the same file, never a second
document.

**L2. The density work.** Knowledge renders nothing until asked, which takes it
from 23540 pixels to under 900. Story's imprint cloud collapses to five headers
with counts. The 39 number fields become read only rows with a per axis editor.
Read the UI UX architecture review first: it rules the desktop spine and this is
the same decision arriving on the phone.

**L3. Landscape.** Wheel and sheet side by side, the bar as a left rail. Last,
because it is the smallest population and the highest complexity, and because
it is the step most likely to be the one that multiplies the token.

### Gates after every step

The five in `CLAUDE.md`, plus `tools/shots.js` at 1600 x 1000 and 390 x 844,
and then **look at the images**. Reading CSS is not reviewing a screen, and two
of the three worst findings in section 0 were invisible in the source and
obvious in the render. M1 through L2 change what a person sees, so
`python3 tools/terms.py` runs too. M2 reorders `TABDEF`, so `tools/equiv.py`
runs and the diff is acknowledged by name.

---

## 10. What The Phone Deliberately Does Not Carry

Each one has a reason that is not "there is no room", and each one says where
the information went, because a thing that is absent and unreachable is a
reduction and a thing that is absent and reachable is an edit.

**The matrix.** `atuned_src/shell/body.html:50` to `:57`. Nineteen domains by
nine child fetters is 171 cells. At 390 each cell is 20 pixels. A grid whose
smallest unit is under half the tap floor is a texture, not a control, and no
arrangement of 171 cells reaches 44. It stays on the desktop, where it is
excellent. **Where it went:** every cell is reachable from Knowledge and from
the sheet a tap on the wheel opens. Nothing is lost, one view of it is.

**The three bulk sliders.** `allCh` and `allRep` at
`atuned_src/shell/body.html:41` and `:42`, `allLaw` at `:127`. Each writes
every one of nine or twenty one values in a single gesture and there is no undo.
A range input dragged inside a scrolling page on a phone is a coin toss between
scrolling and setting, and losing that toss destroys the person's whole field.
**Where it went:** nowhere. They come back when undo exists, and not before.

**Drag to charge.** Already disarmed on a coarse pointer and it stays disarmed
for the same reason. **Where it went:** a tap opens the address and charge is
changed there with explicit controls that say what they are doing. That is
better than a drag on any device and I am not arguing that here.

**The 39 number fields as drag tracks.** Nine held plus nine opposite, and
twenty one laws, built by `numField` at `atuned_src/ui/panels.js:7`. Each is a
drag track plus a number input, 78 controls in two rails, against a working
memory of about four. **Where it went:** read only rows showing the value, and a
tap opens that one axis in an editor. One decision at a time.

**The wordmark in the chrome.** **Where it went:** the boot, which already
spends four seconds saying the name and is the one place in this product with an
emotional register.

**Hover explanation.** This is the opposite of a reduction and it is the reason
the list is worth reading. Every explanation in this product lives in a `title`
attribute: the depth ladder's whole meaning at `atuned_src/ui/panels.js:102`,
nineteen domains at `:136`, four root clusters at `:156`, twelve archetypes at
`:177`. A touch device has no hover. **On a phone this product currently
explains none of its own controls.** Every one of those strings becomes the
first line of the sheet that a tap opens. The phone build carries more
explanation than the desktop, not less.

### And what is not absent, which matters more

**No surface is removed.** Pass four of the previous study removed six surfaces
from the phone, scored best on every layout measure in that document, and broke
the funnel and lost the highest value ICP in the roster. Marcus and Diane
approved it because the six deleted surfaces were not theirs. Sofia refused at
the line saying Knowledge is desktop only and Angela refused at the line saying
Intake is desktop only, and between them they are the practitioner who brings
clients and the person who arrives from a shared link.

That is the trap in this work and it is the one that is easiest to mistake for
a win. It is named here so that the next pass has to argue with a paragraph.

---

## 11. Open, And Whose Call

**Mine, once section 1 is accepted.** Every step in section 9.

**The owner's.**

- Whether the phone's Compass default is the flat version. I have specified it
  and it is the only place the two compositions show a different thing first.
- Whether undo and redo losing their permanent chrome on a phone is acceptable.
  I have ruled it and I have stated the cost.
- Whether Quiet is a setting or whether the answer is that the product should
  move less by default. James is 100 of 1000 and the second answer is larger.

**Blocked on a decision already named elsewhere.** The bulk sliders come back
when undo exists. Drag to charge stays disarmed until the same day. Nothing
else in this document is blocked.

**Carried out, and this is the third document to carry it.** The state line has
a slot for a cost and a slot for a delta and both are empty. Derek has asked
for the cost in eight rounds and Diane has asked for the delta in eight rounds.
They are 350 of 1000 and they are the two most willing to pay. It is engine
work and it does not belong in a phone spec, which is why it is one paragraph
here and should be one line in `TASKS.md`.
