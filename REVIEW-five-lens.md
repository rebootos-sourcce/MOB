# Five lens review

A scope, discovery, creative direction, product development and user
experience pass over Atüned / SOURCE, run against the product as it renders,
not against the source alone. Every claim about the code carries a file and a
line. Every claim about a screen was taken from a screenshot I looked at.

**Method.** `source.html` at commit state of 18 September, loaded in the repo's
Chromium at 1600x1000, 1180x900, 720x900 and 390x844. `loadP(6)` for James, 57,
C-suite, third turnaround, the heaviest reference case with 18 addresses held.
All eight tabs captured at 1600 and at 390. All three themes captured on Field,
Summary and Energy. The Energy layer row exercised through Pain and Flow. The
story commit path run end to end with real text. Release overlay opened. The
density control driven through its three steps with computed styles read before
and after.

**What I did not do.** I did not run `BUILD.sh`, did not edit any file but this
one, and did not commit. `node tests/design.js` was run read only and reports
16 passed, 1 failed, the failure being the font CDN, which is the expected
environmental one.

**On not repeating work.** `DESIGN-ia.md` sections 1.6 and 5 already name the
unreachable cosmology, the missing undo, the invisible ladder, the unread
ritual log, the missing import control and the overlay dismissal contract.
`DESIGN-mobile.md` already names the phone composition. `MILESTONES.md` already
names the below the fold instrument, the font size sprawl and the missing brand
mark. `RESEARCH-ladder.md` already settles the streak question. None of that is
restated here except where a measurement has moved since it was written. What
follows is what those documents do not contain.

---

# Lens 1. Scope

## Is the scope coherent

Partly. There are two products in this tree and they are wearing one set of
chrome.

**Product one is the instrument.** Intake, Story, Field, Energy, Analytics,
Summary. Six tabs, one arithmetic core, one data model, one loop: put something
in, see where it sits, release it. That product is coherent, and its centre of
gravity is the Field wheel.

**Product two is the reference work.** Knowledge and Games. Knowledge is a
searchable dump of every table the engine runs on, eleven filter pills wide.
Games is two practice modes, one of which prints the words "Not built." to the
person (`atuned_src/ui/games.js:230`). Neither reads the left rail. Neither
reads the right rail. At 1600x1000 the Knowledge tab spends 638 of 1600
horizontal pixels on two rails it does not use, and the Games tab spends the
same 638 pixels showing a reading it never refers to. I looked at both
screenshots side by side and the only difference between them and the Summary
tab is the middle third.

That is the incoherence: eight tabs share one chrome, and three of them
(Knowledge, Games, and Intake before any answer exists) have no relationship to
the chrome they are wearing.

## What I would cut

**1. Games, as a tab.** It is two practice modes. "The letting go run" is a
deck of twenty four cards dealt from the person's own field, which is genuinely
good and belongs inside the release flow where a person already is. "The match"
is unfinished and says so on screen. Cutting the tab and folding the letting go
run into the release overlay removes a top level navigation slot, removes the
"Not built." string, and puts the practice where the intent already is.

**2. The persona selector, from shipping chrome.** `Whose field` sits in the
top bar at the highest visual priority on every screen, and on a phone it is
above the fold while the instrument is not. I measured the 390 wide header at
380 pixels tall, 45 percent of the first screen, and the persona select is in
it. It is a development fixture. It is also, per `DESIGN-ia.md` 1.6, the only
route to the entire cosmological layer, which is why nobody has cut it. Cutting
it requires closing that route first. Until then it should be behind the
profile sheet, not in the bar.

**3. The density control, in the top bar.** Three unlabelled letters, T, C and
W. The same setting exists in the profile sheet with three named rows and a
description. The bar version is the illegible one, and `atuned_src/ui/panels.js:246`
carries a comment saying "The strip in the top bar is gone" while the code below
it still paints the strip. Keep the sheet, drop the bar.

**4. One of the three "go deeper" grammars.** Field atomises by scroll zoom.
Analytics atomises by clicking a bubble. Energy atomises by a region pill row
that appears on the Pain layer. Three interaction languages for one verb, in one
product, across three tabs. Pick one.

## What is missing that must be

**1. A first screen that is not a verdict.** Covered in full under The obvious
things, item 1. It is the single largest scope hole and it is not on any list.

**2. The pain map artwork.** `atuned_src/engine/data/figure.js:10` names two
external files, `fig-fetter.png` and `fig-pain.png`. Neither exists anywhere in
the tree. Both are requested on every single load and both return
`ERR_FILE_NOT_FOUND`. `DECISIONS.md` states "The pain map is on all four" tiers.
The one asset promised on every paid tier has never existed. Covered under The
obvious things, item 3.

**3. A destination for a release.** `CURP.rituals` is written at
`atuned_src/ui/ritual.js:70` and read by nothing. I grepped the whole tree. This
half of the "day two" finding in `MILESTONES.md` is still open. The other half
has closed since that document was written: `CURP.history` is now read by
`atuned_src/ui/analytics.js:10`, `atuned_src/ui/record.js:21`,
`atuned_src/ui/summary.js:141` and `atuned_src/ui/panels.js:280`, and
`CURP.story.entries` is read by `atuned_src/ui/imprints.js:101` and
`atuned_src/ui/analytics.js:183`. The record should say so.

---

# Lens 2. Discovery

Assumptions nobody has tested, in the order that their being wrong would cost
the most.

## Untested assumption 1. That the reading is defensible when the input is empty

The product's whole claim is mechanical defensibility. `DECISIONS.md` calls the
brief "a magical solution without the magic" and says "every line of it has to
be mechanically defensible."

`atuned_src/engine/core.js:74` seeds every one of the nine axes at charge 3
before a person has done anything. On first load with zero input the product
renders CQ 36, the word **Incoherent** in the largest display type on the
screen, `Darkest Root 2.0`, `Law shut: Truth at the throat`, and in the right
rail `held Fear 3.0, Anger 3.0, Shame 3.0`. Three lines above those numbers the
same panel says `Field: Held nothing`. I have the screenshot.

Nobody has asked: what is the defence of the number 3? Not what its interval is,
which `TASKS.md` A1 covers. What the 3 *is*. If the answer is "a demo value so
the wheel is not empty", then the app's opening screen is a fabrication in a
product that sells non-fabrication, and A1 is mis-scoped as a gate question when
it is actually a seed question.

## Untested assumption 2. That the parse reads what a person means

I wrote a real story into the Story tab: a man still waiting for a dead father's
approval, repeating it with his board, angry and ashamed of being angry. The
engine returned four imprints: Pride +2.5, Arrogance +2.5, Competition +2.5,
Anger +2.5. It got Anger. It did not get shame, did not get the father, did not
get longing, and it returned three Solar ego addresses for a story whose surface
words were "angry" and "ashamed". Charge moved Anger from 3 to 6.78 and Shame
from 3 to 3.19.

I am not saying the parse is wrong. I am saying nobody has a test for whether it
is right, there is no file in this tree containing stories with expected reads,
and the entire product rests on that mapping. `tests/engine.js` has 279
assertions and none of them is a human story with a human judgement attached to
it. That is the highest value missing test in the repo.

## Untested assumption 3. That the person will find the release

`#bRel`, "Run a release", is the primary action of the entire product. I
measured its position on a fresh load of the reference case:

| Viewport | Top of the release button |
|---|---|
| 1600 x 1000 | 1,827px |
| 390 x 844 | 4,146px |

Not in view at either size. On desktop it sits at the bottom of an inner
scroller whose scrollbar is styled thin and whose content is 1,730px in an
826px box, below four collapsible sections. Nobody has asked what percentage of
sessions reach it, because there is no instrumentation, which is the next item.

## Untested assumption 4. That local only means nothing needs measuring

There is no instrumentation of any kind, by design, and the privacy posture is
right. But `DECISIONS.md` now puts a developer analytics view in scope for
refining models off stories. That means somebody has already accepted that some
signal has to leave. The question nobody has been asked is the narrow one:
would the owner accept a strictly local, person visible, exportable session
ledger, counted on device and never transmitted, so that "did anyone reach the
release" becomes answerable without a controller existing? The machinery is
there. `CURP.history` is already written on every commit and every release.

## Questions the owner has not been asked

1. **What is the product called?** The browser tab says `SOURCE · your field`
   (`atuned_src/shell/head.html:4`). The wordmark on screen says **Atüned**. The
   repository is `MOB`. `CLAUDE.md` says "Atüned / SOURCE". Four names, none of
   them ruled, and the funnel in M5 cannot open a page without one. This is a
   one sentence decision blocking a milestone.

2. **Is the Punch theme shippable as specified?** The ruling is "nothing is
   outlined and everything is solid." Executed literally at
   `atuned_src/shell/head.html:82`, it removes the selected state from every
   `.vt` button in the product. See The obvious things, item 2. The ruling
   needs one clarifying clause: what carries selection when nothing is outlined.

3. **Does the release run right then left, left then right, or both at once?**
   `atuned_src/ui/release.js:117` prints "Four passes: right then left, limit
   before truth" to the person, inside the overlay, immediately above the Begin
   button. `DECISIONS.md` records the owner's ruling as "Then left side, then
   right side" and then records the catalog settling it as "Both run at once,
   fifty and fifty, and both must clear." Three positions exist and the one on
   screen matches neither of the other two.

4. **Is the density control meant to scale the layout or only the type?** The
   profile sheet tells the person "This scales the whole interface, not just the
   type" (`atuned_src/ui/panels.js:277`). Measured, it changes 112 of 832
   visible elements, 13.5 percent. See The obvious things, item 6.

## What would change the plan if it turned out false

- **If the first screen verdict drives people away**, then M1 is not "the
  reading earns being believed", it is "the reading does not exist until it is
  earned", and that is a different build with a different default state.
- **If the parse is weak on real prose**, the Story tab is a liability rather
  than the front door, and the intake becomes the only trustworthy input. That
  reverses the priority of A1 and A7.
- **If the release is unreachable in practice**, then every downstream decision
  about tiers, patterns and the meter is pricing a feature nobody has performed.
  The tier ladder in `DECISIONS.md` prices patterns. A pattern is produced by a
  release. The release is at pixel 4,146 on a phone.

---

# Lens 3. Creative direction

## Grade

**B minus.**

Graded to the weakest screen, not the average, per the hero propagation rule.
The hero is an A. The spread is the problem, and one of the three themes has a
navigation failure in it.

## Lens by lens

### Composition, value structure and focal hierarchy. 8.

The Field wheel is the best thing in this product and one of the better pieces
of information design I have seen in a single file. The value structure is
correct: a near black field, a mid grey ring of 112 segments, chroma reserved
for what is actually wrong, and one hot focal object at the centre. The eye
lands on the red disc, travels out along the saboteur threads to the named
nameplates, and comes back. That is intentional composition.

It loses two points for a hierarchy failure the composition cannot fix: the
severity verdict appears four times on the Field screen at once. The pill row
says `13% CQ`. The top right says **Severe** in 22px. The right rail says
`13% Severe` again. The centre disc says `13`. Four instances of one number
competing for focus, and the largest type on the screen is spent on a word the
person has already read twice.

### Balance, framing and visual weight. 6.

The three column grid at 302 / 1fr / 336 is well proportioned and it is the same
grid on all eight tabs, which is right. But the frame jumps. I measured `.mid`
top at 162px on Field and 90px on every other tab, because the view selector
subbar exists only on Field (`atuned_src/ui/panels.js:73`). Every element on the
page, both rails included, translates 72 pixels vertically every time a person
enters or leaves the tab they visit most. That is a 72 pixel jump cut on the
most frequent transition in the product.

Second deduction: the left rail is present at full weight on tabs that do not
use it. On Knowledge and Games the rail is decoration.

### Colour harmony and psychological impact. 9.

The strongest discipline in the file. The `:root` block at
`atuned_src/shell/head.html` holds seven seat hues, three neutrals, an alarm, a
gold and a good/bad pair, and the argument for each is written into the comment
above it. Warm chroma is pulled 30 to 40 percent because warm hues raise
autonomic arousal and the heaviest fields are warmest. Full chroma is reserved
for what is wrong. I checked the `ui/` layer for colour drift and found three
hardcoded hex values in eighteen files. That is near perfect token compliance on
colour.

No gray on black violation found. Body copy runs `--mid` at `#B4B0A8` on
`#191B23`, which is comfortably above the floor. The dimmest tier, `--dim` at
`#7C7872`, carries only metadata and captions.

One point off for the snow theme, where I compared the three Field screenshots
side by side: the chrome inverts cleanly and the canvas does not. The wheel's
evidence layer is the same values in all three themes, so in snow the
instrument sits in a light room wearing dark clothes. `body.punch canvas#cv{filter:saturate(1.2)}`
at `atuned_src/shell/head.html:279` is the only theme rule that reaches the
canvas at all, and it is a saturation nudge, not a palette.

### Animation principles and motion consistency. 4.

The lowest score and the clearest system gap. The token block defines colour,
radius in three steps, spacing in three steps and a touch target. It defines no
motion. I counted 16 distinct transition declarations in the stylesheet:
`.15s` x7, `.18s` x5, `.16s` x4, plus `.2s`, `.14s`, `width .4s` x2, `width .5s`,
`width .3s`, `left .35s`, `background .35s`, `opacity .5s`, `transform .2s`,
`opacity .16s` and two `cubic-bezier(.3,0,.2,1)`. Three durations within 30ms of
each other doing the same job is drift, not rhythm, and it is exactly the
reasoning the spacing comment in `:root` already gives for collapsing 5, 7, 8, 9
and 11 into three steps. Motion was left out of that pass.

There is no choreography anywhere. Tab changes are instant swaps. The 72 pixel
frame jump is uncushioned. The only sequenced motion in the product is the
release run, and it is good.

`@media (prefers-reduced-motion:reduce)` is present and correct.

### Story, visual cohesion and cross screen unity. 6.

Three magnitude encodings across three tabs, none of which teach the next.
Field encodes magnitude as radial bar length. Energy encodes it as a small
coloured tick beside a label. Analytics encodes it as circle area. A person who
learns to read one learns nothing about the other two. `MILESTONES.md` M4
already names this as "one visualisation grammar" missing, so I will not spend
the point twice, but I will add what it does not say: the three encodings also
disagree about direction. On the wheel, longer is worse. On the axis rows,
higher is worse for held and better for installed, and the two sit in the same
row with the same pill shape. In the 390 wide right rail I looked at
`Shock 7.0` next to `Groundedness 9.3` in red, and the red 9.3 is a good number.

### Canvas and cross discipline polish. 7.

The wheel canvas holds the DOM aesthetic well: the same seat hues, the same
restraint, tabular figures. The body figure in Energy is beautiful and the
leader line system is legible at desktop width.

Two failures, both on screens I looked at:

- The Analytics "What is running" chart renders 32 circles and zero text
  elements. Not truncated labels, which `MILESTONES.md` M2 already names. No
  labels at all. Thirty two unnamed discs under a heading that the Summary tab
  calls "the loudest thing running". The Masks chart has 12 circles and 8 labels;
  Domains has 20 and 10; Archetypes has 24 and 11. Roughly half of every bubble
  chart in the product is unlabelled.
- The Pain layer's region selector panel draws on top of the layer pill row that
  launched it. In the screenshot, `Pain` and `Flow` are covered by the panel that
  selecting `Pain` opened. The control occludes its own state.

### Iconography, readability and form follows function. 5.

Icons are ring, not fill, throughout, and the ring set is genuinely good: the
four view icons at `atuned_src/ui/panels.js:95` are a concentric family that
reads as one system, and the domain glyphs are consistent in weight.

Five is the score because of three readability failures that are not opinions:

1. **Punch theme, selected state, 1.13:1.** Measured. The selected tab's
   background is `srgb(0.1635, 0.1574, 0.1851)` and its text is `rgb(21,19,10)`,
   a colour chosen for a gold ground. Contrast 1.13. Every other tab has the
   identical background. The navigation shows nothing. Cause is a single rule,
   `atuned_src/shell/head.html:82`, whose specificity beats `.vt.on`. Detail in
   The obvious things, item 2.

2. **The fourth root domain is cut in half.** `Witness` renders as `Witn` at
   every desktop width. Measured: the row's scrollWidth is 274 in a 224 pixel
   box with `overflow-x:visible`, so it paints past the card edge and the card's
   own overflow clips it. The button's centre is still inside the card so it is
   clickable, which is worse, because the affordance says broken and the
   behaviour says fine. Cause is an inline style string at
   `atuned_src/ui/panels.js:159` that gives four buttons `flex:1 1 auto` with
   `padding:8px 6px` in a container that cannot wrap. This is rule 10 of the
   product's own UX skill, "never hide a control with no affordance", and it is
   visible in every single 1600 wide screenshot I took.

3. **"8 addresses" above seven rows.** The release overlay's header counts 8 and
   the list shows 7, because `.rel-log` is capped at `max-height:260px` at
   `atuned_src/shell/head.html:1051` with a hidden scrollbar. The header
   contradicts the body on the confirmation screen of the product's destructive
   action.

## Hero element

The Field wheel at `ui/wheel.js`, loaded with a heavy profile. The value
structure, the chroma discipline and the nameplate typography are portfolio
level. The release overlay is second and is arguably cleaner.

## Weakest screen

The Energy tab at 390 wide. It renders 12 pixels tall. See The obvious things,
item 4.

## Hero propagation gap

Wide. The Field wheel and the release overlay would both screenshot well enough
to sell the product. The Energy tab on a phone, the unlabelled Analytics
bubbles and the Punch navigation would each, on their own, make a careful buyer
assume the rest is unfinished.

## Priority fix

Put type and motion into the token block, then fix `head.html:82`. The first is
the system debt that makes the others recur. The second is a one line
correctness fix on a shipped theme.

---

# Lens 4. Product development

## What blocks what, and what is out of order

**Out of order 1. M4 is being treated as a polish milestone and it is a
platform.** `MILESTONES.md` places "the product looks like one thing" fourth and
notes it blocks M5. Two things have changed since it was written. The font size
count has gone up, not down: I measured 29 distinct `font-size` declarations
across 210 uses, against the 25 across 153 that M4 recorded. The stylesheet is
drifting while the milestone waits. And the reason is now diagnosable: the
`:root` block tokenises colour, radius, spacing and the touch target, and
tokenises neither type nor motion. Until a type scale and a motion scale exist
as tokens, every new surface adds sizes. This is not a taste task. It is the
same mechanical argument the spacing comment already makes in the file.

**Out of order 2. The gates test one twelfth of the product surface.**
`tests/design.js` runs at 1600x1000 only, in the dark theme only, and its "one
surface per tab" loop iterates `for(let i=0;i<5;i++)`, which visits Story,
Summary, Field, Energy and Analytics and never visits Intake, Knowledge or
Games. The product has eight tabs, three themes and at least three widths that
behave differently. The gate covers five of seventy two combinations, and it
covers the five oldest.

That single fact explains three of the four visual defects in this report. The
Energy collapse at 720, the Punch selection failure and the unlabelled bubbles
are all outside what the gate looks at. Extending `design.js` to loop themes and
widths is cheaper than any of the fixes it would have caught, and it should
precede M4 rather than follow it.

**Out of order 3. Undo is sized as medium and is currently one line out of
place.** `atuned_src/ui/storyui.js:29` applies the story, and line 33 calls
`pSnap()`. The snapshot is taken *after* the mutation, so the history holds only
post apply states. Moving `pSnap()` above `applyStory` gives the exact
pre mutation state the undo needs, in the exact path that needs it, using
machinery that already persists. That does not make undo free, because the
surface work in `DESIGN-ia.md` 5.3 is real, but it moves the arithmetic half of
M3 from medium to trivial and it should be recorded as such.

## What is expensive that looks cheap

**1. The web quiz, B1.** `TASKS.md` sizes it medium, mostly reuse, because it
shares the intake and the schema. The reuse is real. What is not costed is that
a quiz page needs a visual identity to sit in, and there is none. No brand mark,
no favicon, no product name ruled, and the type system is one blocked network
request away from being system-ui. I loaded the product with font egress
blocked and `document.fonts` came back empty: Lexend never arrived, there is no
`@font-face` fallback, and every screenshot in this review is rendered in a
system fallback. B1 cannot ship a page until M4 and the name are done, which
makes M4 a hard dependency of M5 rather than a soft one.

**2. The Google Fonts decision, A10.** Filed as small and as a privacy call
about bytes. It is also a single point of failure for the entire visual
identity, and it is the only outbound request in a product whose pitch is that
nothing leaves the device. Those are two independent arguments for the same fix
and only one of them is on the list.

**3. The Punch theme.** Ruled in a sentence, implemented as a set of override
selectors. Overrides that remove borders globally will keep breaking selected
states as new components arrive, because the ruling as written removes the
channel that carries selection without naming a replacement. This is cheap to
patch once and expensive forever if the pattern stands.

**4. `figure.js`.** Two external PNGs, cheap to reference and impossible to
ship, because the architecture forbids a second file and the assets have never
existed. Either inline them as base64 and pay the bytes, or delete the raster
path and commit to the vector body, but the current state is a permanent silent
fallback that nobody can see is a fallback.

## What is cheap that looks expensive

**The ritual log.** `DESIGN-ia.md` 5.5 already names it. What it does not say is
how close it is: `CURP.rituals` is already written with `{t, track, band}` at
`atuned_src/ui/ritual.js:71`, `CURP.history` already has four readers, and
`atuned_src/ui/record.js` already renders a history strip. One more list in an
existing surface closes the loop the product claims to deliver.

## Sequencing risk

The fork to accounts is in `CLAUDE.md` and in `MILESTONES.md`, and the record
store is the seam. The risk nobody has written down is smaller and nearer: the
product is about to add a network boundary while its *design* gate tests one
theme at one width. Adding auth, a paywall and a practitioner view multiplies
surfaces faster than the gate grows. The gate should be widened before the
surfaces are.

---

# Lens 5. User experience

## Where a person gets lost

**At the first screen, immediately.** `atuned_src/ui/ui.js:447` calls
`setTab(TAB.FIELD)` on boot, so the entry point is the densest surface in the
product. `DESIGN-ia.md` 5.1 names this. What it does not name is what the screen
says. With zero input the person is told, in the largest type on the page, that
they are **Incoherent**, that their **truth is shut at the throat**, and that
they are holding fear, anger and shame at 3.0. There is no path through. There
is no "start here". The word "Intake" is the first tab in display order and
nothing points at it.

**At the second screen, if they find Intake.** The intake is 63 questions across
21 laws with no stated time cost and no progress expectation beyond a bar. The
copy reads "Answer in any order. Nothing is required." A person who answers
nothing gets the same reading as before, which is the reading the app already
showed them. The intake never earns itself.

**On every entry to Field.** 72 pixels of uncushioned vertical jump.

**On the Energy tab, on a phone.** Nothing renders. The stage is 12 pixels tall
and the person sees the Awareness rail where the body should be.

## What they cannot undo

Three irreversible writes, and `DESIGN-ia.md` 5.3 names all three. I will add
only the observation the screenshots gave me: committing a story also clears
the textarea (`atuned_src/ui/storyui.js:34`, `ST_TEXT=''`). The text is kept in
`CURP.story.entries`, and it is surfaced by `ui/imprints.js:101`, so it is not
lost. But at the moment of the click, three hundred words vanish from the box
with no confirmation, and nothing on the Story screen tells the person where
they went. That is the emotional experience of a destructive action even though
the data is safe.

## What the product does not explain

1. **What 3.0 means before you have answered anything.** Covered above.
2. **What the four view buttons do.** `Charge`, `Cluster`, `Chain`, `Blueprint`
   sit in a bar with four concentric ring icons that are visually a family and
   semantically unrelated to their labels. `TASKS.md` C already lists "the depth
   button names" as open. The icons make it worse, because four rings that
   differ only by count read as a progression and the four views are not one.
3. **What a pattern is, anywhere in the product.** It is the unit the entire
   tier ladder in `DECISIONS.md` is priced in. The word appears in the meter and
   nowhere in the interface explains it.
4. **Which direction is good.** Held and installed sit in the same row shape
   with the same pill treatment and opposite polarity.

## What it asks for that it does not use

This is the sharpest one and `DESIGN-ia.md` 1.6 item 1 has the mechanism. I will
state the user experience consequence, which that document does not.

The Intake tab asks a person for their **first name, middle name, last name,
sex at birth, date of birth, time of birth and place of birth**, under a
paragraph that says "Your energetics were fixed at the moment you were cut from
your mother." Seven personal fields, framed as the foundation of the reading.

`CURP.who.born` is written (`atuned_src/ui/intakeui.js:130`) and read by
nothing that renders for a real person. `renderSpirit` at
`atuned_src/ui/personas.js:38` was patched to call `spiritualOf(bn)` when a
birth record exists, so the western rows now populate, but the ascendant
resolves against a nine city gazetteer (`atuned_src/engine/astro.js:144`). The
nine are Asheville, Chicago, Portland, Santa Fe, Boulder, Boston, Oaxaca,
Lisbon and Greenwich. A real person types a real city and gets null.

So the product asks for the most identifying data it will ever hold, gives it
the most consequential framing on the page, and then cannot use the field that
framing depends on. That is the worst possible ratio of ask to use, and in a
product whose strongest ruling is "we never sell anybody's data", asking for
seven identifying fields it does not use is a posture problem as well as a
usability one.

The middle name is asked for and read by nothing at all.

---

# The obvious things

Ranked by how plain they are and how much they cost. These are things sitting in
front of the team that no document in this tree names.

## 1. The app tells a stranger they are incoherent before they have spoken

Open `source.html` with no saved profile. `atuned_src/engine/core.js:74` sets all
nine axes to charge 3. The first screen renders CQ 36, the word **Incoherent**
in 22px, `Law shut: Truth at the throat`, `Darkest Root 2.0`, and in the right
rail `Fear 3.0 Anger 3.0 Shame 3.0`. Three rows above those numbers the same
panel prints `Held: nothing`. The caption at the bottom of the wheel is honest:
"21 laws unmeasured, sitting at the default 6, signal 0%, 0 held". So the
instrument knows it knows nothing and delivers a diagnosis anyway, and then
contradicts itself on the same panel.

`TASKS.md` A1 treats this as a confidence interval problem. It is not. The
interval is correct. The *values* are invented. For the sceptical, high
capability buyer this product targets, a fabricated opening verdict is the
single fastest way to lose them, and it is on screen before any other design
decision gets a chance.

The fix is not a gate. It is a zero state: charge 0, the wheel empty, the ring
grey, the centre reading "nothing measured", and one sentence pointing at
Intake.

## 2. In one of three themes, you cannot see which tab you are on

`atuned_src/shell/head.html:82` sets `background:var(--panel-2)` on every
`body.punch .vt`. That selector beats `.vt.on` and `.vt[aria-pressed=true]`, so
in the Punch theme the selected tab, the selected view and the selected theme
button all get the same background as the unselected ones. The only remaining
difference is text colour, and the selected text colour is `rgb(21,19,10)`,
chosen for a gold ground.

Measured contrast of the selected tab label in Punch: **1.13:1**. The same
label in dark: 11.58:1. Line 87 restores the selected state for `.ib` icon
buttons and stops there.

So in a theme the owner personally ruled into the product, the current tab is
the only unreadable word on the screen and the navigation carries no state at
all. I looked at the screenshot before I measured it and could not tell which
tab was active.

## 3. The product is not one file, and the pain map artwork does not exist

`atuned_src/engine/data/figure.js:10` declares `FIG_FETTER='fig-fetter.png'` and
`FIG_PAIN='fig-pain.png'`. Neither file is in the repository. Both are requested
on every load. Both return `net::ERR_FILE_NOT_FOUND`. `ART_OK` reads
`{"fig-fetter.png":0,"fig-pain.png":0}` at runtime.

Two consequences.

**The single file rule is already broken**, by design, in the file whose comment
explains the decision. `CLAUDE.md` opens with "One HTML file, no dependencies,
no network, no backend." The product ships two dangling file references.

**The pain map has never rendered.** `DECISIONS.md` states "The pain map is on
all four" tiers. It is the one thing promised at every price point. What the
Pain layer actually draws is the vector fallback, and in the screenshot it reads
as faint coloured scratches on the body outline. Nobody has looked at the Pain
layer and asked why it looks like that, because the fallback is good enough to
not announce itself.

## 4. The Energy tab is twelve pixels tall on every phone

Measured at both 390x844 and 720x900:

| Tab | Stage height at 390 | Stage height at 720 |
|---|---|---|
| Field | 878px | 933px |
| Energy | **12px** | **12px** |
| Intake | 3,236px | 2,574px |
| Knowledge | 5,674px | 5,566px |

`.emap` is `position:absolute; inset:0` at `atuned_src/shell/head.html:713`. The
720 breakpoint at line 1147 sets `.stage{overflow:visible; min-height:0}` so the
other tabs can flow, and line 1154 rescues `.iq` by making it static. `.emap`
was never given the same treatment, so it resolves to `inset:0` against a zero
height box and renders 10 pixels tall. At 1180 it is fine, 556 pixels, because
line 1122 still gives the stage `min-height:62vh`.

The band is width 720 and below. That is every phone. In the 390 screenshot the
person taps Energy and sees the Awareness rail where the body should be, with a
thin sliver of nothing above it.

## 5. The primary action is below the fold at every size

`#bRel`, "Run a release", measured on a fresh load of the reference case:
**1,827px** down at 1600x1000, **4,146px** down at 390x844. On desktop it lives
at the bottom of an inner scroller carrying 1,730px of content in an 826px box,
under four collapsible sections, with `scrollbar-width:thin`.

The product reads charge so that a person can release it. The release control is
not on the screen at any supported size. This is not on any backlog, in any
milestone, or in any of the seven design and research documents.

## 6. A control tells the person it does something it does not do

The profile sheet's screen section says, verbatim: "How much fits on one screen.
This scales the whole interface, not just the type."
(`atuned_src/ui/panels.js:277`).

Measured across the three density steps on the Summary tab, 832 visible
elements: **112 change size. 720 do not.** `body.dens-tight{--ui:.86}` scales
`body{font-size:calc(14.5px * var(--ui))}` and nothing else, because every
component in the stylesheet declares an absolute pixel size. The claim is off by
a factor of seven.

`CLAUDE.md` and the UX skill both carry the rule: "a control must never claim
success before it has it." This is the same rule, applied to a setting instead
of a save.

## 7. Half of every bubble chart has no label

Counted in the rendered DOM on the Analytics tab with the reference case loaded:

| Chart | Circles | Text elements |
|---|---|---|
| Masks | 12 | 8 |
| Domains | 20 | 10 |
| Archetypes | 24 | 11 |
| The nine axes | 18 | 13 |
| The seven seats | 14 | 8 |
| **What is running** | **32** | **0** |

`MILESTONES.md` M2 names truncated bubble labels as a shipping defect. This is a
different and larger thing: unlabelled circles, and one entire chart with no
text at all, under a heading the Summary tab treats as the headline finding.

## 8. Internal placeholder names are in the user facing knowledge base

The Knowledge tab is headed "Everything the instrument knows". The fourth screen
of rows contains `Root_08_Unnamed`, subtitled `Cauda Equina, axis unrouted`. It
is searchable. `TASKS.md` C already lists `Root_08_Unnamed` as the owner's open
item, so the gap is known. What nobody has said is that the open item is
currently printed to the person, in the tab whose whole promise is completeness,
alongside four further addresses whose anatomy field is null.

## 9. The product has four names and none of them is ruled

Browser tab: `SOURCE · your field` (`atuned_src/shell/head.html:4`). Wordmark:
**Atüned**. Repository: `MOB`. Brief: "Atüned / SOURCE". A person who bookmarks
the app gets one name and a person who looks at the screen gets another. M5
needs a landing page and cannot have one without this.

## 10. The release confirmation miscounts its own list

"8 addresses" above seven rows, because `.rel-log` caps at 260px with no scroll
affordance (`atuned_src/shell/head.html:1051`). On the confirmation screen for
the product's irreversible action.

## 11. The gate that measures the rule this codebase most often breaks does not fail

`python3 tools/terms.py` still reports, today: the empty state written four ways
(`nothing held` x7, `no story yet` x3, `none` x2, `nothing is held` x1), a held
address five ways (`held` x23, `running` x5, `carrying` x4, `loaded` x1,
`firing` x1), the charge value four ways. Rule 1 of the UX skill calls this
"Yale's sharpest rule and the one this codebase keeps breaking."

`BUILD.sh`, `tests/engine.js`, `tests/functional.js`, `tests/collide.js` and
`tests/design.js` all exit non zero on failure. `terms.py` prints. It is the only
advisory tool in the set and it measures the rule with the worst compliance
record in the project.

---

# Feedback on the visuals

Asked for by name, so stated directly.

**What is beautiful, specifically.**

The Field wheel with a heavy profile loaded. The 112 segment ring in
desaturated grey, the seat names set in colour and rotated to the tangent, the
saboteur threads reaching from the centre out to nameplates that sit outside the
ring, and one hot disc at the middle carrying the number. The restraint is the
achievement: almost everything is grey, and the two things that are not grey are
the two things that are wrong. The colour argument in the stylesheet comment is
the best written art direction rationale I have read in a codebase, and the code
obeys it.

The release overlay. A 560px card, one number set at 38px, a list of what is
about to happen with the seat named on the right in the seat's own colour, a
line of mechanical prose, cancel and begin. It is calm, it is honest about
duration, and it does not decorate.

The Energy body figure at desktop width. The leader lines fan symmetrically,
the seat discs sit on the midline, and the vector body has a drawn quality that
the rest of the interface does not attempt anywhere else.

**What is not beautiful.**

The left rail. It is a stack of five heterogeneous control types: a two number
balance bar, a row of four text pills, a 5x4 grid of glyph buttons, two 5x5
grids of archetype buttons, and four collapsed section headers. It has no
internal rhythm, it is identical on all eight tabs, and on three of them it does
nothing. It is the first thing a person sees on a phone. It is the least
designed surface in the product and it occupies the most screen time.

The Analytics bubble charts. Packed circles at four different label states
(labelled, truncated, unlabelled, and an entire chart with no text) inside cards
that are otherwise well set. A chart where half the marks are anonymous is not a
chart.

The type. 29 sizes, no scale, no token. It reads as competent everywhere and as
designed nowhere, because there is no interval a person's eye can learn.

The Punch theme. It is not a third theme, it is the dark theme with borders
removed, and removing the borders removed the selection. Compare the three Field
screenshots: snow is a real inversion with a considered light palette, punch is
a subtraction.

---

# Feedback on the user flow

Asked for by name.

**The flow as it exists.**

    load  ->  Field, with a verdict already on it
              ^
              |  no pointer to Intake, no pointer to Story,
              |  no statement of what this is
              v
    Intake -> 63 questions, no time cost stated, nothing required,
              the reading does not change shape when they are done
    Story  -> write, commit, text vanishes, charge moves, no undo,
              no confirmation, no view of what was committed
    Field  -> the charge is now visible
    ????   -> the release button is 1,827 pixels down the rail

There is no onboarding, no route, and no completion. The loop the product
promises, find a pattern, release it, watch it change, is technically present
and has no flow connecting its three steps. `TASKS.md` A7 asks for a tutorial
that completes one loop and sizes it large because the copy has to be written
first. That is correct and it is also the wrong first move. The cheaper move is
to put the three steps in the order the product intends and let the interface
argue for itself:

1. Zero state on load, with one sentence and one control.
2. Intake, with the time cost stated and the interval shown as the reason.
3. Story, with the committed text visible after the commit.
4. Release, promoted out of the rail bottom to the place a person is looking.

**The flow failure nobody has measured.** The release overlay does not clear on
a tab change. I opened it on Field, pressed escape, which did nothing, called
`setTab(7)`, and screenshotted the release card floating over the Games tab with
the Games content dimmed behind it. `DESIGN-ia.md` 5.8 predicted exactly this
and it is now demonstrated rather than inferred. A person can navigate away from
a confirmation dialog for a destructive action and take the dialog with them.

---

# Feedback on the user experience

Asked for by name.

**What the experience is, honestly.** It is a professional instrument that
behaves like a demonstration. Everything in it is real, the arithmetic is
defended, the data is the owner's own, and the visual restraint is genuine. And
the first thing it does with a stranger is show them nine reference people in a
dropdown, a verdict derived from nothing, and a wall of controls.

**The three experience failures that matter most, in order.**

1. **It diagnoses before it listens.** Item 1 of the obvious things. Everything
   else about the experience is downstream of whether the person believes the
   first screen, and the first screen is currently not believable, by the
   instrument's own admission in its own caption.

2. **It asks for a great deal and returns none of it.** Seven identifying
   fields in Intake, framed as the foundation of the reading. The birth data is
   written and effectively unread for any real person, because the gazetteer is
   nine cities. The middle name is read by nothing anywhere. For a product whose
   strongest ruling is that data is never sold, collecting identifying data it
   cannot use is the wrong side of its own promise.

3. **It hides the one thing it is for.** The release is the product. It is at
   pixel 4,146 on a phone.

**What is genuinely good about the experience and should be protected.**

The status discipline. `status()` is one writer, confirmations clear at 2.4
seconds, failures hold, and the save path now refuses to claim a write it did
not make. That is better than most shipped software.

The honesty of the captions. "21 laws unmeasured, sitting at the default 6."
"A move smaller than the interval is not a reading." "Family identification,
plus or minus 6.4." An instrument that states its own uncertainty in the same
type size as its findings is rare and it is the most trustworthy thing in the
product. Protect it, and then make the headline numbers deserve it.

The release run itself. Twenty four cards dealt from the person's own field,
four passes, 1.2 minutes stated up front, and a mechanism that does not pretend
to be anything other than what it is.

---

# Summary

| Lens | Grade | The one thing |
|---|---|---|
| Scope | C+ | Eight tabs, one chrome, three tabs that do not use it |
| Discovery | D | The seed value of 3 has never been questioned |
| Creative direction | B- | Hero is an A, type and motion are untokenised, Punch breaks navigation |
| Product development | C+ | The design gate covers five of seventy two surface combinations |
| User experience | C | Diagnoses before it listens, asks for what it cannot use, hides the release |

**If one thing is done first:** replace the seeded charge of 3 with a real zero
state. It is the first screen, it is the trust argument, it costs nothing
architecturally, and every other finding in this report is read differently by a
person who was not lied to on arrival.

**If a second thing is done:** widen `tests/design.js` to loop three themes and
three widths across all eight tabs, before M4 rather than after it. Four of the
defects in this report were reachable by that loop.
