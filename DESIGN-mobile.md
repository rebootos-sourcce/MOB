# The phone build

Creative direction and art direction pass on Atüned / SOURCE at 390 x 844.
Five design passes, a structural ruling, the specified design, a build order,
and the things not to do.

Nothing in this document has been built. No file outside this one was touched.

---

## 0. What I measured, before proposing anything

Run against `source.html` at 390 x 844, device scale 2, Chromium 1194. The
counting rule is every focusable element that is visible and has a box:
`button, input, select, textarea, a[href], [role=slider], [role=tab], [tabindex]`.

    tab          controls   under 44px   scroll depth   wheel top
    Field            86          6           4,401         462
    Story           103         12           4,605           .
    Summary          75          5           5,942           .
    Energy           82         12           3,366           .
    Analytics        75          5           6,044           .
    Intake          109         28           5,918           .
    Knowledge       196         16           9,051           .
    Games            78          7           4,166           .

These sit close to the owner's table and confirm it. Two differences worth
stating rather than smoothing over. Story reads 103 and not 111 because I
counted at boot plus one scanned story, not with a committed field. Story reads
12 under the floor and not 32 because my selector counts elements, and the
owner's count appears to include the sub-elements inside each imprint pill. The
conclusion does not move. The violating classes are named in section 7 and every
one of them is real.

Three hard defects that no amount of taste will fix:

**The page scrolls sideways.** On Field the document scroll width is 468 against
a 390 viewport. The cause is `#vbar`, the depth row, measuring 447 inside a 376
box at `atuned_src/shell/body.html:17`, with no overflow rule on `#subbar` at
`atuned_src/shell/head.html:189`. The fourth depth, Blueprint, is off screen with
nothing on screen saying so. That is the project's own rule 10 broken.

**The key strip is a scroller with a hidden scrollbar.** 826 of content in 374 of
box, at `atuned_src/shell/head.html:1067`, with `::-webkit-scrollbar{display:none}`
one line below. SQ, Pole and Energy are unreachable by sight. The comment above
that rule states it was a deliberate choice to stop the strip wrapping to three
rows. It traded a visible cost for an invisible one, which the rule forbids.

**There are two nested scroll containers.** `documentElement.scrollHeight` reads
844 while `body.scrollHeight` reads 5,918. `html, body{overflow:auto}` at
`atuned_src/shell/head.html:1044` makes html a 844 tall scroller wrapping a body
scroller. Any sticky or fixed element placed later will resolve against the wrong
box, and iOS momentum will fight itself.

And the state of the instrument itself:

**On a phone the wheel draws its labels on top of itself.** At Blueprint depth,
nine `pill()` calls stack down the vertical axis of a 374 x 335 canvas and
overlap each other and the rings. Domain names run off both edges: Provision
reads as "rovision", Protection as "ction", Descent as "Desc". The seat names
overrun the domain ring by 31px and leave the canvas by 19px.

The cause is exact and it is not CSS. Every radius in `atuned_src/ui/wheel.js`
is a fraction of `U`. Every text size is an absolute pixel constant:
12 at line 214, 11 and 12.5 at line 221, 11.5 at 196, 13 and 11.5 at 187,
12.5 at 236, 11px inside `pill()` at `atuned_src/ui/component.js:155`. When `U`
halves from 360 to 168, the geometry halves and the type does not. The label
system is scale dependent and it only holds above roughly `U` 300.

---

## 1. Seven lens grade of the phone build as it stands

Graded against the hero propagation rule. The desktop Field view is the hero.
Every phone screen is graded on whether it deserves to live in the same product.

    Lens 1  Composition, value, focal hierarchy       3/10
    Lens 2  Balance, framing, visual weight           3/10
    Lens 3  Colour harmony and psychological impact   7/10
    Lens 4  Motion consistency                        6/10
    Lens 5  Story and cross screen unity              3/10
    Lens 6  Canvas integration                        2/10
    Lens 7  Iconography, readability, form follows    3/10

    Overall grade: D+
    Hero element: the wheel at desktop width. The core ramp, the seat
      palette and the ring weights are genuinely good.
    Weakest screen: Field at Blueprint depth on a phone. Nine text pills
      stacked on the instrument, nineteen clipped domain names, seven seat
      names running off the canvas.
    Hero propagation gap: total. The best screen and the worst screen do not
      read as the same product. They do not read as the same decade.
    Priority fix: the first 462 pixels are chrome. The instrument is the
      product and it is below the fold on the tab that is named after it.

The palette survives at phone width, which is why lens 3 holds. Muted seat
colours argued from autonomic response still read correctly at 390. The
failures are all composition and hierarchy, which is the good news: the
identity is intact and the layout is wrong.

---

## 2. The five passes

Each pass proposes, then attacks its own proposal, then hands forward what
survived the attack.

### Pass 1. Compress

**Proposal.** Keep every control. Shrink the chrome. Tabs to 36px tall, theme
icons to 32, key strip to 10px type, wheel up to 380 and first on the page.
Pure CSS inside the existing 720 media block at `atuned_src/shell/head.html:1058`.
No JS, no structure, no risk. Build it in an afternoon.

**Attack.** It fails on arithmetic. Eight tab buttons at their natural label
width sum to 720px. At 390 they wrap to three rows whatever the height, so the
tab bar cannot fall below about 110px without breaking the 44px floor, and
breaking that floor is how 32 controls got below it in the first place. The
proposal fixes the symptom by committing the cause. It also does nothing at all
for the canvas, where the worst damage is, because no CSS rule reaches inside a
canvas.

**Survives.** The measurement discipline. The single non negotiable target that
every later pass inherits: **the wheel is fully visible on first paint, above the
fold, without scrolling.** And the finding that the tab bar is the fixed cost,
not the variable one.

### Pass 2. Move navigation to the thumb

**Proposal.** The tab bar leaves the top and becomes a fixed bottom bar, in the
thumb arc. All eight tabs stay, in one row, scrolling horizontally with snap.
Top bar reduces to brand plus settings. Recovers about 140px at the top of every
screen.

**Attack.** Two failures. First, a horizontally scrolling bar with a hidden
scrollbar is the exact defect already measured in the key strip, reproduced at
larger scale and made permanent. Eight destinations behind a gesture with no
affordance is worse than eight destinations wrapped onto three rows, because at
least three rows are honest. Second, eight peer destinations is not a
navigation model, it is a list. Hick's law says the cost of a choice rises with
the count; the product's own UX floor says working memory holds about four. Eight
flat destinations on a 390 screen is a menu pretending to be a bar.

**Survives.** Bottom placement. The thumb arc on a 844 tall phone covers roughly
the lower 420px; the top 200px is the hardest reach on the screen and it is
currently where every control lives. Navigation goes to the bottom and stays
there.

### Pass 3. Nest into sheets

**Proposal.** Four primary destinations in the bottom bar plus a fifth slot
called More, which opens a sheet holding the rest. Every left and right rail
section, which is already a named folding block at `atuned_src/shell/body.html:22`
through `:57` and `:95` through `:130`, becomes a sheet drawn from the bottom.
This is the owner's phrase made literal: buttons and menus nested into buttons.

**Attack.** Over nesting. The reading is the product's output, not a setting. If
CQ, the tier and what is running sit two taps behind a sheet, the person has to
ask for the answer they came for. Recognition over recall, the project's rule 6,
breaks. Second, sheets stack on a page that is already two nested scrollers, and
a scroll inside a sheet inside a body inside an html scroller is how a phone
build starts feeling broken in ways nobody can name.

**Survives.** The nesting model itself, applied to inputs and settings only, never
to outputs. The four plus More bar. And a hard rule that arrives here and holds to
the end: **the nested scroll must be resolved before any sheet is added.**

### Pass 4. The wheel is the page

**Proposal.** Stop treating the phone screen as a document. The wheel is fixed
and fills the screen. The reading rises from the bottom as a sheet at three
detents: peek at 120px showing coherence and tier, half at 45 percent, full. The
wheel stays visible behind the sheet and reacts to it. One surface, one
instrument, the centre image at the centre of the app.

**Attack.** It is the right composition and it exposes that the composition was
never the blocker. Two problems. First, a fixed canvas with a draggable sheet
over it runs `compute()` and `draw()` every frame through the loop at
`atuned_src/ui/ui.js:310` while the sheet is in motion, on a phone, at device
scale 2. That is a frame budget conversation, not a layout one. Second and
decisive: put the wheel on a 390 screen at any size and the label system still
draws pills across it, because the pills are pixels and the rings are fractions
of `U`. The most beautiful composition in the world still renders "rovision".

**Survives.** The wheel first composition. And the conclusion the whole document
turns on: **the fix has to reach inside the renderer. Layout alone cannot do it.**

### Pass 5. One build, two compositions, one type scale

**Proposal.** One file. One engine. One DOM tree. A single mode token,
`body.phone`, set once at boot from a media query, not a user agent string. CSS
recomposes the same components into a different arrangement. The renderer reads
one constant, a label budget, and spends fewer labels at larger sizes when `U` is
small. Every text pill leaves the canvas and becomes a DOM caption under it.

**Attack.** A mode token is a fork wearing a smaller hat. If it multiplies into
`body.phone`, `body.tablet`, `body.compact`, the product has three layouts that
drift against each other and no gate catches it. Second, `tests/design.js`
checks one surface per tab and a type floor at 1600 x 1000 only. A phone
composition with no phone gate rots in a fortnight, exactly as the first
responsive block did: the comment at `atuned_src/shell/head.html:1034` says the
rails stack under the stage, and for a while the code did not do it.

**Answer to the attack, and the ruling.** Cap the token at one boolean, written
once, and put that cap in the build gate. Add a 390 pass to `tests/design.js`
in the same commit as the first phone rule, never after. This is the design that
ships.

---

## 3. The structural ruling

**Layout alone cannot fix this, and a separate mobile design must not be built.
The answer is one build with two compositions and a scale aware renderer.**

Here is the argument.

**Why layout alone fails.** Three of the defects are outside CSS reach. The
labels drawn on the canvas are absolute pixels against fractional radii; no media
query enters a canvas. The drag handler at `atuned_src/ui/ui.js:58` turns a
vertical finger movement over any address into an irreversible charge edit, and
`touch-action:none` at `atuned_src/shell/head.html:254` means the page cannot be
scrolled with a thumb resting on the wheel; that is behaviour, not style. And
every explanation in the product is in a `title` attribute: the depth ladder's
whole meaning at `atuned_src/ui/panels.js:102`, all nineteen domains at
`:136`, all twelve archetypes at `:177`, the four root clusters at `:156`. A
touch device has no hover. On a phone this product currently explains nothing.

**Why a forked mobile build fails.** The one file constraint is not a preference
in this codebase, it is the architecture. `atuned_src/MANIFEST` is a load order
and the build concatenates in that order. Two builds means two manifests, and
the moment a data table changes, `tools/equiv.py` compares one of them against
the wrong baseline. Worse, the engine is shared and host free by enforcement;
a second shell would be a second set of renderers reading the same engine, and
the first divergence in `setTab` or `render()` would be silent. This project has
already paid for a stale tab index four times, which is why `TAB` is frozen at
`atuned_src/engine/core.js:50`. A forked view layer is the same class of debt
with a bigger surface.

**Why the third answer is not a compromise.** The distinction the word
"responsive" hides: responsive means the same controls reflowed into a column,
which is what exists and is what the owner correctly calls hideous. Adaptive
means a different composition of the same components. The components do not
fork. The composition does. The cost is one boolean, a block of CSS, a reorder of
`TABDEF` which is explicitly permitted at `atuned_src/engine/core.js:51`, and one
constant in the renderer. No second engine. No second file. No second manifest.

**The sniffer.** Capability, not identity. One line at boot:

    document.body.classList.toggle('phone',
      matchMedia('(max-width:720px) and (pointer:coarse)').matches);

Width alone would put a narrow desktop window into touch mode and take the
matrix away from someone with a mouse. `pointer:coarse` alone would put an
830px tablet into phone mode. Both together. It re-evaluates on the media query
change event, so a rotated phone or a resized window lands correctly without a
reload. It never reads `navigator.userAgent`, which the engine may not touch
anyway and which the shell should not want to.

**One boolean and no more.** `body.phone` is the only layout mode this product
gets. Anything wanting a third mode is a request to reopen this ruling in
writing, not a CSS change. That cap is the whole defence against drift.

---

## 4. Navigation. Eight tabs into a thumb

`TAB` integers are identity and are not touched. `TABDEF` is display order and is
reordered freely, which `atuned_src/engine/core.js:51` states in its own comment.
Every lookup already goes through `TABOF(k)` by `.k` at `:65`.

**The bottom bar. Four slots.**

    Field      the instrument. the hero. default on open.
    Story      the input. how charge gets in.
    Summary    the output. what it costs.
    More       everything else, in a sheet.

Four at 390 gives 97px per target, comfortably past the floor, with room for a
ring icon above a label. The bar is fixed to the bottom, 64px tall plus the safe
area inset, and it does not scroll.

Why these three and not others. Field is the centre image and the owner has
already ruled it central. Story is the only place a person puts something in.
Summary is the only place the instrument answers in words. Energy, Analytics,
Intake, Knowledge and Games are all instruments or libraries that a returning
person seeks deliberately, which is what a menu is for.

**The More sheet.** One tap. A list of five rows at 56px each, each row a name
and one line of what it is, in the same folding language the rails already use.
Below them a divider, then Reference cases, then Settings. The sheet is the
owner's request made structural: menus nested into buttons.

**Settings sheet.** Holds what leaves the chrome: the three themes, the type size
toggle, and motion. These are set once and never again. They currently cost 100
vertical pixels on every screen forever.

**Reference cases.** `#psel` at `atuned_src/shell/body.html:11` is a demo control,
not a user control. It leaves the chrome entirely and becomes a row in the More
sheet. It is not deleted, because it is how the product is shown to a buyer, but
it stops charging every person a full width select and a right aligned label for
a feature that is not theirs. Note the label reads "Whose field" while the UX
rules at `.claude/skills/atuned-ux/SKILL.md` make "profile" canonical and forbid
"persona" in copy; the row in the sheet reads **Reference cases**.

**Depth ladder.** Four buttons, 447px, currently clipped. It becomes one button
sitting on the wheel's lower left corner, showing the current depth by name:
"Cluster". Tapped, it opens a four row sheet, each row the depth name and its
`layers` string from `atuned_src/ui/wheel.js:131`. That string is currently only
in a `title` and is therefore invisible on a phone. This is the single change
that both removes a horizontal clip and recovers a body of explanation the
product already wrote and cannot currently show.

---

## 5. The first screen

At 390 x 844, Field, on open, before any scroll:

    0          safe area inset
    0 to 56    top bar: brand left, one settings ring right
    56 to 72   gutter
    72 to 434  the wheel. square. 362 x 362.
    434 to 442 gutter
    442 to 498 the key. five rings in one row, label under each.
    498 to 540 the tier line. coherence, the tier it names.
    540 to 620 the balance strip, inward against outward.
    620 to 780 the reading, first card, scrolls on from here
    780 to 844 bottom bar, four slots, fixed

Everything above 540 is the instrument and its three readings. Nothing above 540
is a setting, a theme, a persona or a tab that is not the current one. The wheel
starts at 72 instead of 462, a recovery of 390 vertical pixels, which is 46
percent of the screen.

The wheel size is `min(100vw - 28px, 100svh - 232px)`, which at 390 x 844 gives
362 square. `svh` and not `vh`, because iOS reports `vh` against the toolbar-less
height and the wheel would sit 60px under the bottom bar on first paint. Square,
because `reframe()` at `atuned_src/ui/component.js:111` takes `U` from
`min(CW,CH)/2` and a 374 x 335 canvas throws away 19px of width on each side for
nothing.

---

## 6. The wheel, and the labels that must go

This is the art direction call, and it is the one that makes the difference
between a shrunken desktop chart and an instrument that reads at arm's length.

**A phone wheel shows fewer labels, larger. Not the same labels, smaller.**

At `U` 181 the current ladder tries to print, at Blueprint depth: 7 seat names,
19 domain names, 12 archetype names, 6 mask names, up to 6 saboteur nameplates,
and 9 text pills. Fifty nine pieces of type on a 362 circle. On desktop at `U`
360 that is dense. At 181 it is noise, and the screenshot proves it.

**What draws on a phone.**

    the core number, CQ                 keeps its size, it is the reading
    the seven seat names                11px, on the shell, inward anchored
    the lead archetype only             11px, at depth C and D
    the rings, every one of them        unchanged. colour and weight carry
    the beads, every one of them        unchanged, they are the data

**What stops drawing on a phone.**

    the 19 domain names        the ring keeps its colour and its weight.
                               the names live in the rail and in the probe.
    the 6 mask names           same.
    the 11 secondary archetype names
    every text pill            all nine of them
    the saboteur nameplates    already suppressed at depth C and D by the
                               CEIL guard at wheel.js:298, on both desktop
                               and phone. Stated here so nobody discovers
                               it later and calls it a regression.

**The pills leave the canvas entirely.** `pill()` at
`atuned_src/ui/component.js:154` has no width check against the chord available
at its radius, which is why nine of them stack down the middle of a phone wheel.
On a phone the call sites at `atuned_src/ui/wheel.js:178, 189, 198, 212, 223,
311, 320, 321, 322` write into one DOM caption element under the canvas instead:

    112 addresses · 0 loaded · 0 saboteurs · integrity 6.0

One line, selectable, themeable, readable by a screen reader, and outside the
instrument. This is a better answer than the current one on desktop too, but that
is a separate argument and I am not making it here.

**Touch on the wheel.** Two changes, and the first is a safety change.

`atuned_src/ui/ui.js:58` sets `DRAG` on pointerdown over any address, and
`:105` to `:110` writes `S.charge` and calls `saveYou()` on every move. With
`touch-action:none` at `atuned_src/shell/head.html:254`, a thumb that lands on
the wheel to scroll the page instead rewrites the person's charge, permanently,
because there is no undo. On a phone, drag to charge is off. Tap opens the
address in the reading, and charge is changed there with explicit controls that
say what they are doing. `touch-action` becomes `pan-y` so the page scrolls
under a resting thumb.

Pinch to zoom replaces the wheel handler at `:87` and the keyboard handler at
`:92`, both of which are dead on a phone. Two finger pinch calls the existing
`setZoom(z, ax, ay)` at `:80` unchanged, with the midpoint as the anchor. Double
tap reframes, which is what `f` does today.

---

## 7. The 44px floor

The floor is already a token, `--tap:44px` at `atuned_src/shell/head.html:50`,
with a comment saying it lives there so it cannot drift back into forty separate
padding declarations. It drifted anyway. These are the classes below it and the
lines that set them:

    .stk-t     32px   head.html:600     stack tabs, on 4 tabs
    .iq-n      32px   head.html:953     intake scale, 11 per question
    .pm-lb     32px   head.html:649     energy map labels
    .gm-chip   34px   head.html:521     games chips
    .kb-t      36px   head.html:492     knowledge tabs
    .ip-g      27px   head.html:766     imprint grouping, no min-height set
    .ip-max    27px   head.html:770     imprint expand, no min-height set
    .st-mic    32px   head.html:751     the speak button, no min-height set

Under `body.phone` every one of these takes `min-height:var(--tap)`. That is one
rule with a selector list, not eight edits.

`.iq-n` is the one that needs thought rather than a token. It is a fixed
32 x 32 square and there are eleven of them per question, 0 to 10. Eleven at 44
is 484 and the screen is 390. `.iq-sl` at `atuned_src/shell/head.html:952`
already sets `flex-wrap:wrap`, so the answer is `flex:1 1 44px; min-width:44px;
height:44px; width:auto` and it wraps to two rows of six and five. The scale
keeps every one of its eleven points. No data changes.

---

## 8. What is deleted on a phone

Deleted means it does not render. Each has a reason that is not "there is no
room".

**The matrix.** `atuned_src/shell/body.html:50` to `:57`. 19 domains by 9 child
fetters is 171 cells. At 390 each cell is 20px wide. It cannot reach 44 and no
arrangement makes it. A grid whose smallest unit is half the floor is not a
control on a phone, it is a texture. It stays on desktop, where it is excellent.

**The three bulk sliders.** `allCh` and `allRep` at `atuned_src/shell/body.html:41`
and `:42`, `allLaw` at `:127`. Each writes every one of nine or twenty one values
in a single gesture, through the handlers at `atuned_src/ui/panels.js:58` to
`:63`. There is no undo. A range input dragged inside a scrolling page on a phone
is a coin toss between scrolling and setting, and losing that toss destroys the
person's whole field. These come back when undo exists, and not before.

**The persona select from the chrome.** `atuned_src/shell/body.html:11` and `:12`.
Moved, not deleted, to the More sheet. Reason in section 4.

**The theme segment and type toggle from the chrome.**
`atuned_src/shell/body.html:13` through `:15`. Moved to the settings sheet. A
control used once in a product's lifetime does not get permanent chrome on the
smallest screen.

**Demoted, not deleted: the 39 number fields.** Nine held plus nine opposite at
`atuned_src/shell/body.html:43`, twenty one laws at `:128`, all built by
`numField` at `atuned_src/ui/panels.js:7`. Each is a drag track plus a number
input, 78 controls in two rails. On a phone they render as read only rows showing
the value, and tapping a row opens that one axis in an editor. One decision at a
time instead of 78 on a screen against a working memory of about four. This is
the project's own rule 7 applied: remove, hide, shrink, organize, in that order.

---

## 9. Build order

Each step is independently shippable and independently gated. Nothing later
depends on a decision not yet made.

**Step 1. Stop the bleeding. No design decisions required.**

    atuned_src/shell/head.html:1044   resolve the nested scroller. one
                                      scroll container, not html inside body.
    atuned_src/shell/head.html:189    #subbar wraps rather than clips, until
                                      step 4 replaces the depth row outright.
    atuned_src/shell/head.html:1067   the key strip wraps rather than scrolls
                                      behind a hidden scrollbar, until step 5.
    atuned_src/shell/head.html:254    touch-action:pan-y under body.phone
    atuned_src/ui/ui.js:58            no DRAG on a coarse pointer
    atuned_src/ui/ui.js:105 to :110   the charge write behind the same guard

Step 1 makes the current build honest. It gets uglier before it gets better,
because wrapping shows what scrolling hid. That is correct and it is temporary.

**Step 2. The mode token and its gate. Same commit, both.**

    atuned_src/ui/ui.js:352           set body.phone at boot from the media
                                      query, listen for its change event
    tests/design.js                   a 390 x 844 pass beside the 1600 one:
                                      no horizontal document scroll, every
                                      visible control at or above 44, the
                                      wheel fully within the first viewport

The gate goes in with the token. Not after it.

**Step 3. The 44px floor.**

    atuned_src/shell/head.html:600, 953, 649, 521, 492, 766, 770, 751
                                      one body.phone rule, one selector list
    atuned_src/shell/head.html:952    .iq-n wraps to two rows

Cheapest step in the document and it clears 28 of the violations on Intake alone.

**Step 4. Navigation.**

    atuned_src/engine/core.js:56      reorder TABDEF. TAB at :50 untouched.
    atuned_src/shell/body.html:6      #tabbar moves out of .glass top
    atuned_src/shell/body.html:4      top bar becomes brand plus settings
    atuned_src/ui/panels.js:89        build four bottom slots under body.phone
    atuned_src/ui/panels.js:66        setTab unchanged. it already works by
                                      key and already paints by TABOF(i).cls
    atuned_src/shell/body.html:11     psel into the More sheet
    atuned_src/shell/body.html:13     themes and legible into settings

`setTab` needs no change at all, which is the reward for freezing `TAB`.

**Step 5. The wheel takes the screen.**

    atuned_src/shell/head.html:1086   square canvas, svh sizing, order first
    atuned_src/shell/head.html:265    key strip recomposed as a five up row
                                      under the canvas
    atuned_src/ui/panels.js:100       depth ladder becomes one button and a
                                      sheet carrying VIEWS[i].layers as text

**Step 6. The renderer learns its scale.**

    atuned_src/ui/wheel.js:214        seat names, keep
    atuned_src/ui/wheel.js:221        domain names, suppress under body.phone
    atuned_src/ui/wheel.js:196        mask names, suppress
    atuned_src/ui/wheel.js:187        secondary archetypes, suppress
    atuned_src/ui/component.js:154    pill() writes to the DOM caption
    atuned_src/ui/wheel.js:178, 189, 198, 212, 223, 311, 320, 321, 322
                                      the nine call sites feed one caption

The engine is untouched throughout. `atuned_src/engine/` gains no `document`,
no `matchMedia`, no `window`. The mode token is a class on `body`, which is the
shell's business, and `hostfree.py` stays satisfied.

**Step 7. Demotions.**

    atuned_src/shell/body.html:41, 42, 127   bulk sliders off under phone
    atuned_src/shell/body.html:50 to 57      matrix off under phone
    atuned_src/ui/panels.js:7                numField renders a row plus an
                                             editor under phone

**Gates after every step.** The five in `CLAUDE.md`, plus `tools/shots.js` at
both 1600 x 1000 and 390 x 844, and then look at the images. Steps 4 through 7
change what a person sees, so `python3 tools/terms.py` runs too. Step 6 changes
no data table, so `tools/equiv.py` is not required, but step 4 reorders `TABDEF`
and that is a named diff to acknowledge rather than a silent one.

---

## 10. What I recommend not doing

**Do not build a second HTML file.** Two shells over one engine drift on the
first divergence in `setTab` or `render()`, and nothing in the gate set would
catch it. The argument is in section 3 and it is the ruling.

**Do not sniff the user agent.** `matchMedia('(max-width:720px) and
(pointer:coarse)')` is the test. A user agent string is an identity claim, and
this product's whole posture is that it does not collect those.

**Do not add a third layout mode.** One boolean. A request for `body.tablet` is
a request to reopen section 3 in writing.

**Do not renumber `TAB`.** `atuned_src/engine/core.js:50` is persisted, compared
and passed around, and the file's own comment records four bugs from exactly
this. `TABDEF` at `:56` is display order and takes every reordering this document
asks for.

**Do not put all eight tabs behind a hamburger.** It solves the space problem and
destroys the orientation problem. Four visible plus a named More is a model; one
icon holding eight peers is a filing cabinet.

**Do not shrink the canvas type to make the labels fit.** 12px at `U` 360 becomes
6px at `U` 181 and 6px is not type, it is texture. Spend fewer labels at full
size. Section 6.

**Do not put the wheel behind a "tap to expand".** The centre image is the
product. Making the product a disclosure is the one move that cannot be undone
by a later pass.

**Do not solve the touch floor with a viewport zoom lock or a scale transform.**
Both make the whole interface smaller in exchange for making the numbers pass.
The floor is a finger, not a metric.

**Do not ship drag to charge on touch before undo exists.** This is the strongest
recommendation in the document. `CLAUDE.md` already names undo as the largest
remaining gap in the product. A phone turns that gap into a gesture a person
makes by accident while trying to scroll.

**Do not add a library.** No sheet component, no gesture package, no icon set.
One file, no dependencies. A bottom sheet is a translated div with a pointer
handler and about forty lines of CSS.

**Do not introduce another horizontal scroller with a hidden scrollbar.** There
are two in the build today and both are defects by the project's own rule 10.
Wrap, nest, or cut. Never hide.

**Do not fold the font question into this work.** Self hosting the three families
as base64 is the owner's call, costs bytes in a single file build, and has
nothing to do with layout. It is a separate ruling and it should stay one.

---

## 11. Open, and whose call

**Mine, once the ruling above is accepted.** Every step in section 9.

**The owner's.**

- Whether Summary or Energy takes the third bottom slot. I have specified
  Summary, because it is the only surface that answers in words, but Energy is
  the surface a returning person opens most and that is an argument I have not
  measured.
- Whether the phone wheel drops the domain names at Blueprint depth, or drops
  Blueprint depth itself on a phone. Dropping the depth is cleaner and loses a
  capability. Dropping the names keeps the capability and loses its legend.
- Whether the demoted number fields in section 8 are the right shape, or whether
  the intake flow should own charge entry on a phone outright and the rails
  become read only there.

**Blocked on a decision already named elsewhere.** The bulk sliders come back
when undo exists. Nothing else in this document is blocked.
