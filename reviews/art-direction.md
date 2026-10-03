# Art direction review

Mika Ueda-Salas, with Sol Amadi on light and colour, Bjorn Haraldsson on type
and grid, Petra Nikau on composition and symbol.

Five passes, not merged. Everything numeric below was measured in Chromium at
1600x1000 and 390x844 against `source.html` built from `atuned_src/` at
`claude/laughing-feynman-xhfyj3`. Six lightings were swept on eight tabs.

**A note on the instruments, because this repo has been burned by lying tools.**
The contrast probe was wrong twice before it was right. First it read `color`
on SVG text, which returns the inherited black and reported every wheel label
as invisible. Second it only parsed `rgba()`, and Chromium serialises a
`color-mix()` result as `color(srgb r g b / a)`, so it read every glass primary
button as dark ink on the page ground at 1.02:1 and declared the whole Glass
call to action unreadable. Both were false and both are retracted here. The
probe now parses both spellings and takes SVG `fill`, and it was checked
against three known pairs before anything below was written: white on black
returns 21.0, `#767676` on white returns 4.54, black on black returns 1.0.
A fourth check, an 82 percent accent mix over black, returns 6.04, which is the
arithmetic. Every ratio in this document comes from that probe after it passed.

---

## Pass one. The squint.

Six feet back, eyes half closed, no reading. What is the shape, and where does
the eye land first, second, third.

### Field, which is the app's core screen

The eye lands on the red disc at the centre of the wheel, then on the purple
identification badge alone at the bottom, then on the eight pills at the top
left. The instrument itself, the ring of seats that is the entire point of the
screen, comes fourth.

That order is wrong, and it is wrong for a measurable reason. The wheel canvas
`#cv` is 664 by 725 CSS pixels. Everything actually drawn on it fits inside a
box of **392 by 362**. That is 29.5 percent of the canvas area, and lit pixels
are **6 percent** of it. The canvas sits inside a 922 by 833 stage, so the
instrument occupies about **18 percent of the area of its own stage**. The
other 82 percent is not ma. Ma is a gap you placed. This is a gap that
happened, and you can tell because the labels are crowding the rim while there
is a quarter of a screen of nothing outside them.

Petra: the loudest object on the screen is a filled red disc about 36 pixels
across at the wheel hub, and it is the one element that is a fill in a product
whose form ruling is that things are rings. It wins the squint because it is
the only solid shape. It should not win it.

### Summary

The eye lands on `James` at 58px, which is correct, then on the right rail,
which is wrong, because the right rail is a second copy of the centre. Both
print the archetypes at 20, 16 and 14 percent. The centre names them (Sage,
Ruler, Warrior, Rebel) and the rail does not, so the rail is strictly less
information occupying 330 pixels of the widest column the eye reaches. Two
readings of one reading, 500 pixels apart, is not hierarchy, it is an echo.

### Compass

The eye lands on a giant `0`. `The record` sets the day count at roughly 52px,
which makes it the second largest numeral on any screen in the product, and on
a fresh profile the value is zero. Art direction is the allocation of
attention, and the largest number on the Compass is currently allocated to
nothing having happened. Sol's note: that zero is also the highest value
contrast object in the lower half, so it wins twice.

### Body

This is the best screen in the product and it is the only one that passes the
squint cleanly. The eye lands on the warm fog at the sacral, then on the cool
one at the throat, then reads down the spine. That is a lit figure with a
narrative, and it is the only place the light is doing work rather than
sitting behind glass. Sol found it and wants it protected: whatever else
changes, the volumetric wash on the figure is the product's one piece of real
art direction and nothing should flatten it.

Its defect is that it is **unlabelled**. Eighteen rings on a body and not one
name, not one legend, not one key. The Field wheel names every seat. The Body
page names none of them. A stranger sees a constellation and has no sentence.

### Games

The eye lands on `Deal twenty four`, correctly, and then falls off the bottom
of the content into roughly 310 vertical pixels of empty stage below the last
card. The page does not know how tall it is.

### The squint finding that covers all of them

Every screen is a three column sandwich: left rail, stage, right rail, and the
two rails are the same on all eight tabs. The rails carry 20 blueprint domain
buttons, 12 primary buttons, a balance slider and a full reading card
regardless of which surface you are on. So the squint silhouette of Story,
Field, Summary, Knowledge, Compass, Games and Intake is **identical**. The
product has eight surfaces and one shape. Bjorn: when the frame never moves,
the eye stops believing it moved, and the tab change stops registering as
navigation.

---

## Pass two. Light and colour.

Sol leads this one.

### The headline: there is no light, so Glass has nothing to refract

Glass is graded C and this is why. The entire light source in the product is
one canvas, `#bgaura`. Measured: its bitmap is **200 by 125 pixels**, presented
at **1792 by 1120**. That is a nine times upscale of a 25,000 pixel image to
fill a two megapixel screen, and it is the only thing behind the glass.

Glass declares `backdrop-filter: blur(38px) saturate(1.8)` on `.glass` and
`.panel` (head.html:325) and `blur(12px)` on every control (head.html:329).
Blur is a function that takes an image and returns a smoother version of it.
Applied to a near flat field, it returns a near flat field. **The material is
correct and the subject is missing.** Glass is not clunky because the glass is
badly made. It is clunky because you are looking through a beautifully made
window at a blank wall, and the mind reads that as a smudge rather than as a
pane.

Put something behind it and Glass moves from C to B in one change, with no
edit to the glass rules at all.

### The seven seats have one value and two grounds

The seat palette is stated once and used on both a near black ground and a
paper ground. Measured against the element's own ground, on `#F6F6F4`:

| Seat | Hex | Ratio on paper |
|---|---|---|
| Solar | `#D4BC70` | **1.73** |
| Heart | `#6FC5A3` | **1.90** |
| Sacral | `#D19255` | **2.44** |
| 3rd Eye | `#8296DB` | **2.65** |
| Crown | `#A98BCE` | **2.67** |

Every seat fails on paper, three of them by more than half. The palette was
tuned for a dark ground, which was the right call, and then a light ground was
added without re-tuning it. The argument from autonomic response holds on
black: low saturation, mid lightness, controlled contrast. On paper, mid
lightness against a light ground is not calm, it is absent. Calm requires a
value gap and these have none.

This is not a request to change the seat colours. It is a request for a
**second step on each seat ramp**: one value that reads as light emitted on a
dark ground, one that reads as pigment on a light ground. Two tokens per seat,
seven seats, fourteen values, one file. The seats stay the seats.

### The badge numeral fails against its own pill in every lighting

This is the most repeated contrast defect in the product, and it hits the one
component the Bible names as the product's signature: the ring plus pill badge.
The pill ground is a tint of the seat colour and the numeral inside it is the
full seat colour, so the numeral is by construction a low contrast object.

Measured on the Field tab, numeral against its own pill:

| Lighting | 3rd Eye | Root | Sacral | Heart | Solar |
|---|---|---|---|---|---|
| Dark | 3.42 | 3.59 | 4.17 | 4.29 | |
| Glass | 2.43 | 2.54 | 2.90 | 3.04 | 3.59 |
| Glass white | 2.25 | | 2.00 | 1.72 | **1.52** |

Not one of those reaches 4.5. The fix is one decision: inside a seat tinted
pill the numeral is `--ink`, and the seat is carried by the ring and the tint,
which is where it belongs. The seat is an identity, not a legibility budget.

### The render ground was ruled and the ink on it was not

head.html:901 rules that the render ground is `#101010` on the three render
surfaces, in every lighting. That is a good ruling. A flight display is black
whatever the cabin lights are doing.

But the chrome sitting on that black ground still resolves the lighting's own
ink tokens. In Snow, `--ink` is `#16171C`. Measured on the Field badge strip:

    #16171C on #101010    1.06    "CQ" "DQ" "SQ" "Pole"
    #16171C on #101010    1.06    "Vitality" "Awareness" "Will" "Flow"
    #16171C on #101010    1.06    "Severe"   .tierbtn, 14.5px

Nine labels and the tier name on the app's core screen, at 1.06 to 1. They are
invisible. Glass white is the same at 1.05. The Compass repeats it: five
segmented control labels and four inline values at 2.22 in Snow, and
`Today is not on the record yet.` at 1.06.

The ruling needs its other half: **on a render surface the ink ramp is the dark
ramp, whatever the lighting.** One scoped token block inside `#cv`, `#emap`
and `#cone`.

### The invisible count, in all six lightings, from one duplicated line

head.html:1694 and head.html:1695 are consecutive rules on the same selector
setting the same property:

    .stk-t.on b{color:var(--accent)}
    .stk-t.on b{color:var(--on-accent)}

The second wins. `--on-accent` is `#0B1418`, the ink meant to sit on a filled
accent, but `.stk-t.on` sets `background:transparent` (head.html:1693). So the
count on the selected stack tab is near black ink on a near black panel:

    dark 1.11   glass 1.30   punch 1.13   flat 1.05   glasswhite 1.01   snow 1.00

Deleting line 1695 fixes it everywhere. This is why the right rail appears to
read `Fetters` with no number: the number is there and it is painted out.

### Punch paints the pressed tab label out

`#EFEDE8` on `#7EB8D4` measures **1.85**. In Punch the active top tab fills
with the accent and the label keeps the light ink. The one word telling you
where you are is the least readable text on the screen. head.html:364 handles
`.vt[aria-pressed=true]` for the depth bar but the top tab name is a `.n` and
misses it.

### Flat and Glass both miss the small text floor on one token each

Flat has the most failures of any lighting, 257 across eight tabs, and almost
all of them are one value: `--dim:#767369` measuring 3.63 to 4.01 against the
panels it sits on. Glass has 228, and 19 per screen are `--dim:#928D85` at
**4.43**, missing 4.5 by 0.07. Two token nudges clear roughly 400 of the 917
failures counted in this review.

Failure totals across eight tabs, for the record, lowest is best:

    punch 29    dark 58    snow 162    glasswhite 183    glass 228    flat 257

Punch is the most legible lighting in the product by a factor of two, and it is
the one that was added last and argued least.

### What is right, and should be said

The alarm colour is held. `#FF2E1F` does not appear on any surface swept in
this review, and no high reading on a good scale is painted in it. The defect
that landed twice has not landed a third time.

---

## Pass three. Type and grid.

Bjorn leads this one.

### The numerals are set in a typeface that is not in the file

`--num` is declared as `Lexend, system-ui, -apple-system, sans-serif`
(head.html:117). The only face embedded is Inter: `document.fonts` returns
exactly one entry, `Inter 300 700 loaded`, and the product makes no network
request by ruling and by gate 7.

So **Lexend never arrives**, and every element that asks for it falls through
to the platform sans. That is 634 elements on a sweep of eight tabs, including
`.v` (the badge numerals), `.n`, `.bmv`, `.pol2-t` and `.tp`. This is a somatic
diagnostic instrument whose entire output is numbers, and the numbers are set
in whatever the host happens to have. Two consequences you can see without
knowing the cause: the numeral and the word beside it in a badge sit on
different x-heights, and `font-variant-numeric: tabular-nums` (head.html:~688)
is a request the fallback may decline, so columns of figures do not align.

This is a blocker and it is cheap. Either embed Lexend the way Inter was
embedded, or set `--num` to Inter with `font-feature-settings:"tnum"`. Inter
has excellent tabular figures and a slashed zero. Bjorn's preference is the
second: one face was the ruling, and the instrument gains nothing from a
second voice on the numbers that it does not gain from Inter's own tabular set.

### Thirty three font sizes is not a scale

Measured across eight tabs, distinct rendered `font-size` values:

    9  11  11.5  12  12.5  13  13.1  13.19  13.27  13.36  13.44  13.5  13.52
    13.69  13.78  13.86  14  14.03  14.28  14.5  15  16  17  18  19  20  22
    25  26  27  38  42  58

Two separate problems live in that list.

**Eight sizes inside a 3.5 pixel band.** 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5
carry 1,078 of the elements measured. The step from 11 to 11.5 buys no
hierarchy at any viewing distance and costs a decision every time someone
writes a new component. A real scale for this product is five steps: 11 for
labels, 13 for secondary, 16 for reading, 20 for surface titles, and a display
size. Everything else is a rounding error wearing a costume.

**Eleven fractional sizes between 13.1 and 14.28.** These are computed, not
chosen: the imprint chips scale their type with the charge. The idea is
genuinely good, type size carrying data is exactly the right instinct for an
instrument, and Tufte would sign it. The execution is unmanaged: the whole
range is 1.18 pixels, about nine percent, which is under the threshold at
which a size difference is perceptible in running text. So the product pays
the full cost of a non systematic scale and receives none of the signal. If
size is going to carry charge, it needs three or four declared steps with at
least a 15 percent ratio between them, not a continuous function.

### There is no vertical rhythm

Distinct values measured across eight tabs:

    padding-top      18 distinct   1 2 3 4 6 7 8 9 10 11 12 13 14 15 16 18
    gap              18 distinct   1 2 4 5 6 7 8 9 10 11 12 14 18
    margin-bottom    13 distinct
    line-height      15 distinct, and 523 elements declare none at all

Ten of the eighteen padding values are odd numbers, so they cannot sit on any
even grid. 523 elements take the browser's `normal` line height, which varies
by font and by size, which means the leading in this product is partly decided
by the fallback typeface named in the previous finding.

This is the single largest reason the interface reads as clunky rather than as
calm, and it is why the owner's word for Glass was "clunky" even though the
glass itself is well made. Nothing repeats, so nothing rests. A four pixel
base with a six step ramp (4, 8, 12, 16, 24, 32) replaces all of it.

### What is right

Radii are disciplined. Seven distinct values across eight tabs, and three of
them are the declared tokens 8, 11 and 16, with 999px and 50 percent for pills
and circles and 3 or 4 for Punch. Nobody has invented a radius. Border widths
are a single value, 1 pixel, 661 instances. That is a system holding.

### Sentence case is broken by one CSS rule and twenty two data rows

head.html:686:

    .pm-eye,.tier1,.sub,.sp-hd,.rit-tr,.ip-bh,.sum-lt,.ad-nm,.gm-on,
    .eyebrow,.lbl{text-transform:capitalize}

This is the source of every Title Case string a reviewer sees. In the DOM the
copy is correct sentence case: `Who this is`, `The statement runs nine gates at
once`. On screen it renders `Who This Is` and `The Statement Runs Nine Gates At
Once`. The comment above the rule (head.html:680) already knows this is wrong,
names two cases it broke, and says the wider question is the owner's. It is
raised here as decided by the standing ruling: sentence case, no all caps, and
capitalising `At` and `In` is not even title case. Delete the declaration.

Separately, 22 of the 112 address names in `engine/data/nodes.js:6` carry a
capitalised minor word: `Shame Of Desire`, `Manipulation Through Emotion`,
`Need For Approval`, `Knowing Better Than God`, `Anger At God` and 17 more.
These are the most read strings in the product, they appear as chips on Story
and as card titles in Knowledge, and no convention makes `Of` a capital.

---

## Pass four. Composition, density, and the empty states.

### Density, with the number

Simultaneous interactive controls visible at 1600x1000:

    story 110   know 97   intake 89   summary 84   compass 79
    field 77    games 75  energy 69

The UX skill records 57 to 71 and calls it architectural. It has grown. Story
is at 110 controls against a working memory of about four, and 110 of them are
presented at one level with no grouping stronger than a hairline box.

The compositional cause is the one from the squint pass: the two rails never
change. On Story, the 20 blueprint domain buttons and the 12 primary buttons
in the left rail are 32 controls that do nothing for the task of writing down
what happened. They are not background, they are lit, boxed, dotted and
interactive. Petra: a rail that is present on every surface is furniture, and
furniture you cannot switch off is clutter.

The move is not to delete them. It is to let the rails **recede when they are
not the subject**. A rail at 55 percent opacity with its dots off, that comes
back on hover or focus, removes 32 objects from the squint on five of eight
tabs and costs nothing and no feature.

### The empty states, which are the stranger's first screen

The Bible says the app opens on Field, CLAUDE.md says it opens on Summary and
that both reading surfaces silence themselves on `r.unread`. Measured cold,
with nothing entered:

**The centre column behaves.** `Nothing has been entered, so there is nothing
to read` and the four doors. Good copy, honest, no fake numbers.

**The right rail does not.** On a profile with nothing in it, the rail prints
`Archetypes First 26% Second 19% Third 19%`, `Domains First 100%`,
`Heaviest Root 0.0` and `Most shut Truth at the throat`. Two lines above, in
the same card, it prints `Carrying: nothing yet` and `Filled in: nothing yet`.
So one card says both "nothing yet" and five specific measurements about a
person it has not measured. This is the worst defect in this review by
consequence, because it is a diagnostic instrument asserting a reading it does
not have, on the first screen a stranger sees, and the product's whole
positioning is that a mirror you cannot inspect is not a mirror. Marcus in the
ICP roster says he wants a claim specific enough to be wrong. This one is
specific and it is wrong.

**The left rail does not either.** Cold, it shows `72 / 28` benign against
malignant with a filled green bar, a named blueprint domain, and a selected
primary. All of it derived from a blank.

**The four doors are four grey rectangles.** They are the single most important
composition in the product, the stranger's first and only choice, and they
carry no icon, no colour, no seat, no differentiation. The form ruling is "if
it has a name it has an icon, the icon has a family, the family has a colour."
Four named doors and not one icon. They read as disabled rows. They are also
laid out in a 620 pixel column with 310 pixels of empty stage to their right,
so they are simultaneously cramped and adrift.

**The cold Field badge strip writes the empty state three ways in one row.**
`CQ` shows a dash, `DQ` and `SQ` show `0.0`, `Pole` shows `0.00`. Three
representations of "nothing" across four adjacent pills. The UX skill's first
rule names this exact failure and records that the empty state had been written
five ways before.

**The Compass empty state is a dead box.** `30 day oscillation` sets a grey
rectangle containing `no readings in this window` at 10px, and in Snow that
string measures 2.22 to 1. An empty state should be the most carefully drawn
thing on a surface, because it is the state a new person is guaranteed to see
and the state an experienced person sees when something has gone wrong.

### Composition defects, named and located

**The Compass cone is clipped.** The apex runs off the top edge of the stage.
There is zero top margin and the structure is cut.

**The Compass labels collide.** In one 1600 pixel frame: `40 to 60 oscillating,
most people stand here` overprints the marker and `The blueprint`; `Geryon`
overprints `Charon`; `Set` overprints `The blueprint`; `Asmodeus` overprints
`The blueprint`; `desire and will` overprints `illumination`. `collide.js`
runs at 1680x1020 and checks DOM nameplates, and these labels are drawn into
the canvas, so the gate cannot see them. That is a gate gap, not just a
drawing defect.

**The Settings lighting control is clipped and two lightings are unreachable.**
The `Dark Snow Punch Glass` segment is cut at the card's right edge with
`Glass` sliced in half and `Glass white` and `Flat` entirely outside. There is
no scrollbar, no fade and no chevron. UX rule 10 exactly: a control hidden with
no affordance is indistinguishable from a missing feature. A person on Settings
cannot reach two of the six lightings.

**The mobile tab bar is clipped mid word.** At 390 the top tabs cut at `Comp`
with four of eight tabs invisible and nothing indicating they exist. The badge
strip below cuts mid badge the same way. head.html:557 has a written ruling
that "the bar wraps rather than hiding a control, which is the right rule" and
at 390 it is not wrapping.

**The mobile wheel nameplates overprint the wheel.** At 390,
`112 addresses · SQ · 18 loaded` crosses `Crown` and the rim, and
`21 laws · integrity 4.3` is crossed by `Judge`.

**On mobile, chrome takes a third of the screen.** From the top of the page to
the first content is roughly 290 of 844 pixels: wordmark, tab scroller, a full
width profile select, then a row of undo, redo, lighting and help, then a
second row with one account button alone on it. The account button sits by
itself on its own line, which is a wrap artefact, not a layout.

**Settings row one is ragged masonry.** Three cards in a row ending at three
different heights, and row two starting at three different tops. No rhythm, and
one card's text visibly bleeds a stray `C` and `w` fragment into the gap.

**Games leaves 310 vertical pixels of empty stage** below its last card, and
ships a card reading `Phase Two ... Not built.` on a user surface.

**`0 days , last run`** has a space before the comma. `ui/cone.js:582`.

---

## Pass five. The symbol system as one language.

Petra leads this one.

The system is real. There is a genuine family here with a consistent 24 unit
box (488 of 564 visible SVG nodes use `viewBox="0 0 24 24"`), and the ring
rather than fill ruling is held: of 837 drawable nodes measured, 768 carry
`fill:none`, and the 69 that do not are chart marks in the pole gauge and
gradient ellipses in the body figure, which are illustration and not icons.
That ruling is not broken and should be recorded as passing.

Four things are wrong with it as a language.

### One. The family has no optical size axis

The same 24 unit glyphs render at fifteen different pixel sizes:

    8  10  11  12  14  15  16  17  18  19  21  24  26  34  46

with ten different stroke widths in play:

    0.3  1  1.3  1.5  1.6  1.7  1.8  2  2.4  3  3.5

and no rule connecting the two. A 1.7 stroke in a 24 box rendered at 8 pixels
lands at 0.57 device pixels, which on a one times display is a grey smear
rather than a line. The same 1.7 rendered at 46 lands at 3.26, which is heavy.
So on a single screen the small seat dots read as thin and washed and the large
badge rings read as fat, and the two do not look like they came from the same
hand. They did. The drawing is the same and the correction is missing.

An icon family with a 5.7 times size range needs two or three drawn weights,
not one scaled. The cheap version, which is 90 percent of the benefit: bind
stroke width to rendered size so the apparent weight is constant. At 21 pixels
use 1.7, at 15 use 2.2, at 10 use 2.8, at 34 and above use 1.2.

### Two. The family has two terminals, which means it is two families

Measured across eight tabs:

    stroke-linecap     round 664    butt 173
    stroke-linejoin    round 588    miter 249

A symbol set is a language with a grammar, and a terminal is the most visible
piece of that grammar after weight. Round caps with mitred joins is a specific
and deliberate combination that some families use; round caps with round joins
is another; butt caps with mitred joins is a third. All three are present here.
Aicher's Munich set works because every corner in it resolves the same way and
your eye stops asking. Here the eye keeps asking.

Rule it: round cap, round join, everywhere, with mitre reserved for glyphs
whose meaning is squareness (the Flat lighting mark, the grid glyphs). Then
the exception is legible as an exception.

### Three. A symbol repeated twelve times in one viewport is not a symbol

On Knowledge, the visible card grid draws 77 icons of which 47 are distinct,
and the single most repeated glyph, the shield
`M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z`, appears **twelve times**. Twelve
cards in one screen, twelve identical marks, at identical size, in identical
colour, because they share a seat.

The seat is already stated twice on each of those cards: by the 2 pixel rule
across the card's top edge and by the word `Root` under the title. The icon is
the third statement of the same fact and the first statement of nothing.
Petra's line: a symbol is a sentence, and twelve copies of one sentence is a
chant.

Either the card icon becomes the address's own mark, which is the promise the
form ruling already makes ("if it has a name it has an icon"), or it goes and
the card's identity is carried by the title alone. The middle position, a
family mark where an identity mark is expected, is the only wrong answer.

### Four. The named things that have no icon

The form ruling says if it has a name it has an icon. Three places break it,
all on high traffic surfaces:

- The four doors on the cold Summary. Four names, no marks.
- The nine gates on Games (`believing`, `perceiving`, `thinking`, `behaving`,
  `acting`, `feeling`, `speaking`, `saying`, `doing`). Nine named states set as
  9 dark 11px pills. They look like tags. They are the spine of the model.
- The Body figure's eighteen rings. Named in the data, unnamed on screen.

### Two smaller symbol notes

**The Punch badge falls apart.** In Punch the ring and the pill lose the
container that joined them and read as two separate objects with a gap, rather
than as the one compound mark the Bible defines ("the icon carries the percent
as a ring, and the pill at its lower right carries the number"). The compound
badge is the product's signature object and Punch breaks it into pieces.

**The Body page's dashed circle is a third line language.** One dashed ring in
blue violet around the sacral cluster, on a page where every other stroke is
solid. It is the only dashed element in the product and its meaning is
undeclared. A dash means "provisional" or "boundary" or "predicted" in most
instrument vocabularies. Here it means nothing stated, which means the eye
assigns it something.

### Glass and Punch both re-box the tab strip, reversing a written ruling

head.html:553 strips the boxes off `.tabtop` with an eight line comment ruling
that a top level tab is a word and an underline and not a button, because
"chrome on a wordmark makes it look like a control". Then head.html:329 gives
`body.glass .vt` a background and a border, and head.html:360 gives
`body.punch .vt` a background. `.tabtop` is a `.vt`, the lighting rules are
later and more specific, and both lightings put the boxes back. You can see it
in the shots: in Dark the tab strip is eight words under a hairline; in Glass
and Punch it is eight buttons. A ruling that survives in one lighting and not
in three is not being enforced. `:not(.tabtop)` on both selectors.

---

## Consolidated findings

| id | finding | file:line | severity | fix | size |
|---|---|---|---|---|---|
| AD-01 | Right rail prints archetypes, domains, heaviest seat and most shut law for a profile with nothing entered, in the same card that says "nothing yet". The instrument asserts a reading it has not taken, on a stranger's first screen | `atuned_src/ui/panels.js` reading card; `ui/summary.js` | blocker | Gate the whole rail card on `r.unread` the way the centre surface already is, and show the four doors instead | M |
| AD-02 | Selected stack tab count is invisible in all six lightings (1.00 to 1.30) because two consecutive rules set the same property and the second uses the filled accent ink on a transparent background | `atuned_src/shell/head.html:1694-1695` | blocker | Delete line 1695 | S |
| AD-03 | Badge strip labels and the tier name are invisible on the Field stage in Snow (1.06) and Glass white (1.05): the ruled `#101010` render ground keeps the lighting's light ink | `atuned_src/shell/head.html:901,914` | blocker | Redeclare `--ink --mid --dim` to the dark ramp inside `#cv`, `#emap`, `#cone` for every lighting | S |
| AD-04 | Every numeral in the product is set in a fallback face: `--num` names Lexend, only Inter is embedded, no network by ruling | `atuned_src/shell/head.html:117` | blocker | Set `--num:'Inter'` with `font-feature-settings:"tnum"`, or embed Lexend as Inter was embedded | S |
| AD-05 | Lighting segment in Settings is clipped; Glass white and Flat are unreachable, no scroll affordance | `atuned_src/ui/panels.js:489,515` | blocker | Wrap the segment instead of overflowing it, per the rule already written at head.html:557 | S |
| AD-06 | Mobile top tab strip clips mid word at 390; four of eight tabs hidden with no affordance. Badge strip below does the same | `atuned_src/shell/head.html` tab strip at the 390 breakpoint | blocker | Wrap the strip at narrow widths; if it must scroll, add an edge fade and a chevron | M |
| AD-07 | Badge numeral fails against its own seat tinted pill in every lighting (Solar 1.52 on Glass white, 3rd Eye 2.43 on Glass, 3.42 on Dark) | badge component, `atuned_src/shell/head.html` ring and pill block | major | Numeral becomes `--ink`; the seat is carried by the ring and the tint only | S |
| AD-08 | Seven seat colours all fail on a paper ground (Solar 1.73, Heart 1.90, Sacral 2.44, 3rd Eye 2.65, Crown 2.67) | `atuned_src/shell/head.html:395-400` snow block | major | Add a second step to each seat ramp: an emitted value for dark grounds, a pigment value for light | M |
| AD-09 | Glass has nothing to refract: the only light is a 200x125 canvas upscaled to 1792x1120 | `atuned_src/ui/component.js:123`; `head.html:431` | major | Render the aura at the presented size and give it structure worth blurring (see MO-1) | M |
| AD-10 | `text-transform:capitalize` renders every eyebrow in Title Case, against the sentence case ruling, including `Primary And Secondary` and `The Statement Runs Nine Gates At Once` | `atuned_src/shell/head.html:686` | major | Delete the declaration; the DOM copy is already correct sentence case | S |
| AD-11 | Counts printed against totals in four places: `13 of 100`, `63 of 63 answered`, `21 of 21 laws measured`, `21 of the 76 laws` | `ui/panels.js:471,531`; `ui/intakeui.js:81`; `ui/analytics.js:124,152` | major | Print the value and the state, never the denominator, per the ruling that a reading is not a score | S |
| AD-12 | Punch paints the pressed tab label out: `#EFEDE8` on `#7EB8D4` at 1.85 | `atuned_src/shell/head.html:364` and `.tabtop` | major | Give the pressed `.tabtop` label `--on-accent` in Punch, as `.vt` already gets | S |
| AD-13 | Glass and Punch re-box the top tab strip, reversing the ruling written at head.html:553 | `atuned_src/shell/head.html:329,360` | major | Add `:not(.tabtop)` to both lighting selectors | S |
| AD-14 | Compass cone clipped at the stage top edge; at least five label pairs overprint in one frame. `collide.js` cannot see them because they are drawn into the canvas | `atuned_src/ui/cone.js` | major | Inset the projection, add label repulsion, and extend the collide gate to sample canvas labels | L |
| AD-15 | Flat: `--dim:#767369` measures 3.63 to 4.01 across the whole secondary text tier; 257 failures, the worst of six lightings | `atuned_src/shell/head.html:284` | major | Lift `--dim` to about `#8A8780` | S |
| AD-16 | Glass: `--dim:#928D85` measures 4.43, missing the small text floor on 19 elements per screen | `atuned_src/shell/head.html:221` | major | Lift to about `#9C978E` | S |
| AD-17 | No spacing system: 18 padding values, 18 gap values, 13 margin values, 10 of them odd; 523 elements declare no line height | `atuned_src/shell/head.html` throughout | major | Declare a 4px base ramp (4 8 12 16 24 32) and a leading ramp, and convert | L |
| AD-18 | 33 distinct font sizes, 8 of them inside a 3.5px band carrying 1,078 elements | `atuned_src/shell/head.html` throughout | major | Five step scale: 11 13 16 20 display. Nothing between | M |
| AD-19 | Charge driven type sizes span 13.10 to 14.28, a 9 percent range, below the perceptual threshold, so the signal is paid for and not received | imprint chip renderer, `atuned_src/ui/imprints.js` | minor | Quantise to three declared steps at a 15 percent ratio | S |
| AD-20 | Icon family has no optical size axis: one drawing scaled across 15 render sizes with 10 unrelated stroke widths | icon renderer `svgI`, `atuned_src/ui/component.js` | major | Bind stroke width to rendered size so apparent weight is constant | M |
| AD-21 | Two terminal languages in one icon family: round and butt caps, round and mitre joins | icon paths across `atuned_src/ui/` | major | Rule round cap and round join; keep mitre only where squareness is the meaning | M |
| AD-22 | Knowledge draws one identical glyph on twelve cards in a single viewport, restating a seat that the card's top rule and its `Root` label already state twice | `atuned_src/ui/knowledge.js` | major | Give each address its own mark, or drop the icon and let the title carry identity | L |
| AD-23 | The four doors on the cold Summary carry no icon, no colour and no seat, on the most important composition in the product | `atuned_src/ui/summary.js` doors block | major | One ring icon and one seat colour per door | S |
| AD-24 | The Body figure's eighteen rings are unlabelled: no names, no legend, no key | `atuned_src/ui/map.js` | major | Seat names down the left of the figure, hover or tap for the address name | M |
| AD-25 | The empty state is written three ways in one badge row: a dash, `0.0`, `0.00` | Field badge renderer, `atuned_src/ui/ui.js` | major | One glyph for nothing held, everywhere | S |
| AD-26 | 22 of the 112 address names carry a capitalised minor word (`Shame Of Desire`, `Anger At God`, `Need For Approval`) | `atuned_src/engine/data/nodes.js:6` | major | Lowercase the minor words; run `equiv.py` since this is a data table | M |
| AD-27 | Both rails render identically on all eight tabs, so all eight surfaces share one squint silhouette, and 32 rail controls are lit on surfaces they do not serve | `atuned_src/shell/body.html` rail hosts | major | Recede the rails to 55 percent with dots off when they are not the subject; restore on hover or focus | M |
| AD-28 | Summary prints the archetype percentages twice on one screen, and the rail copy omits the names, so the echo carries less information than the original | `ui/summary.js` and `ui/panels.js` reading card | major | Rail keeps the state, centre keeps the reading; do not print the same figures twice | M |
| AD-29 | Compass sets a zero at roughly 52px, making "nothing has happened" the largest numeral on the surface | `atuned_src/ui/cone.js:582` area | minor | Set the record numeral at the reading size until there is a record to show | S |
| AD-30 | `0 days , last run`: space before the comma | `atuned_src/ui/cone.js:582` | minor | Move the comma | S |
| AD-31 | Compass empty state is a grey box with `no readings in this window` at 10px, measuring 2.22 in Snow | `atuned_src/ui/cone.js` oscillation panel | minor | Draw the empty window as a designed state: the axis, the band, and one line | S |
| AD-32 | Games ships `Phase Two ... Not built.` on a user surface and leaves roughly 310px of empty stage below it | `atuned_src/ui/games.js` | minor | Remove the placeholder card; let the surface end where its content ends | S |
| AD-33 | Settings row one is ragged masonry with three different card heights and a visible clipped text fragment between cards | `atuned_src/ui/panels.js:489` | minor | Equalise the row or commit to a real masonry with a declared column rhythm | M |
| AD-34 | Body page uses one dashed ring in a product where every other stroke is solid, with no declared meaning | `atuned_src/ui/map.js` | minor | Either declare what a dash means in the line vocabulary, or make it solid | S |
| AD-35 | Punch breaks the compound badge: ring and pill separate into two objects when the container border is removed | `atuned_src/shell/head.html:356-372` | minor | Keep the badge container's background in Punch even where borders go | S |
| AD-36 | `Root_08_Unnamed` renders as a Knowledge card title with an underscore and an index | `atuned_src/engine/data/nodes.js:6` | minor | Owner's call on the name; until then render unnamed addresses with a designed placeholder rather than the key | S |
| AD-37 | `BIBLE.md` says the Source OS subtitle is in the accent; the code rules it white and says so in the comment | `BIBLE.md` Form section vs `head.html:479-489` | minor | Correct the Bible to match the later ruling so nobody reverts the code | S |
| AD-38 | The instrument occupies about 18 percent of the area of its own stage on Field while its labels crowd the rim | `atuned_src/shell/head.html:915` `--lane:128px` | major | Grow the wheel to fill the canvas and push the nameplates into the lanes that already exist for them | M |

---

## Missed opportunities

These are not defects. They are things the product has earned and has not
taken.

**MO-1. The field should be the light.** The product's own definition says the
field is the geometry of awareness's radiance, that it is harmonic, and that
what radiates outward carries the colour of the loudest seat. Right now that
is a sentence in the Bible and a 200 by 125 pixel blur behind everything. It
should be the ground. The background wash should be generated from the actual
reading: the loudest seat sets the hue, the malignant share sets the
saturation, the coherence sets how tightly the field is organised, and the
swing sets how much it drifts. A person changes profile and the room changes
temperature before they have read a number. This is the highest value single
move available, it is what Glass needs to stop being a smudge, and it costs one
canvas renderer. Sol has wanted this since the first look. Turrell built a
career on exactly this proposition: the light is the work, not the thing the
work is lit by.

**MO-2. A calm mode, which is the thing a nervous system product should have
shipped first.** Everything in this review about density has the same
underlying answer and it is not "remove features". It is a second reading of
the same data at a tenth of the density: the seat, the heaviest address, the
one law most shut, and the direction out of it. Four objects, one screen, no
rails. Bind it to a key. Sofia in the ICP roster takes this at eleven at night
when the last client has gone, and Diane opens it during a meeting. Neither of
them opens the 110 control screen in those moments. This is Kanso as a product
decision rather than as a vocabulary word.

**MO-3. Type size as charge, done properly.** The instinct is already in the
code and it is right, and the execution wastes it on a nine percent range. Give
the imprint chips three declared sizes at a 15 percent ratio and the Story
surface becomes a chart you read by squinting, which is exactly what a chart
should be and exactly what this one currently is not. Tufte's whole argument
is that the data should carry the ink. Here the data is carrying the ink by
about a pixel.

**MO-4. The Body figure should name itself.** It is the best drawing in the
product and it is mute. Seat names set down the left edge at the height of
their rings, in the seat colour, at the reading size. Nothing else. That single
addition turns a constellation into an instrument, and it is the change most
likely to move the Body page from where it is to a B plus. Petra would set them
flush left on a single axis so the eye reads a column of names and a column of
light and makes the connection itself, which is stronger than a leader line.

**MO-5. One state, one glyph, across the whole product.** Held, installed and
firing are three states and stay three words per the ruling. They do not yet
have three marks. Give them three, drawn once, used everywhere: on the wheel,
on the chips, on the body, in the codex, in the rail. That is what makes a
symbol set a language rather than a collection, and it is the thing Aicher's
Munich set did that everyone remembers. Right now a person learns each
surface's vocabulary separately.

**MO-6. Punch is the strongest position in the product and it is being treated
as the third theme.** It has 29 contrast failures against Dark's 58 and Glass's
228. It is the only lighting where the colour is doing the structural work
instead of the borders, which is the position the Bible's own colour argument
implies. It is also the only one with a real point of view: no outlines,
everything solid, the mark is the position. Sol's read is that Punch should be
developed as the flagship and Dark kept as the default, rather than Punch
sitting in the menu as an option. A product that reads a nervous system
arguing from autonomic response should ship the lighting with the fewest edges
in it.

**MO-7. The four doors deserve to be the best composition in the product.**
They are the stranger's only choice and they are four grey rectangles. Four
doors, four seat colours, four ring icons, four different weights of the same
sentence structure, set large with real air around them, on a ground lit by
MO-1. That is a first screen somebody screenshots. Marcus in the ICP roster
says the only thing that gets him in is one screenshot of the instrument that
is clearly not a template. This is that screenshot, and right now it is a list.

**MO-8. A single reading object, drawn once, used in all three places.** The
archetype percentages are currently drawn in the centre column of Summary, in
the right rail, and in the badge row on Field, three times, three ways, with
different information in each. Draw it once, as a component with a density
parameter: full in the centre, medium in the rail, compact in a strip. One
drawing, three densities. That removes the echo found in pass one, removes a
whole class of drift, and is the only way the badge convention in the Bible
survives contact with a fourth surface.

**MO-9. Motion has not been spent.** The product has four transitions worth
having and is using none of them: the charge settling into an axis after a
story is committed, the field re-lighting when the profile changes, a seat
opening when it is released, and the wheel finding its rest position on load.
Each is a short, damped, single property move, each states a causal
relationship that currently has to be read in text, and reduced motion gets
the end state per the ruling already in the Bible. The twelve principles have
one rule that matters most here and it is slow in, slow out: an instrument that
snaps reads as a toggle, and an instrument that settles reads as a measurement.

**MO-10. The Compass wants to be a Vignelli diagram, not a perspective
render.** It is currently a wireframe cone in three quarter perspective with
sixteen labels fighting each other in one frame and the apex clipped. The
information in it is ordinal and relational, not spatial. The London
Underground argument applies exactly: the geometry is not the point, the order
and the connections are, and flattening it buys you every label placed
cleanly. That is the change most likely to move the Compass off a D.

---

## Grade

### Now: C plus

The argument, in three parts.

**What is earning it.** The material vocabulary is real and it is not generic:
the seat palette is a considered system argued from something, the ring rather
than fill ruling holds across 768 of 837 drawable nodes, the radius set is
disciplined at seven values with three of them tokens, the border weight is a
single value across 661 instances, and the Body page is a genuinely beautiful
piece of light that would survive being shown to anyone. The alarm colour is
held. The copy voice is specific and unusual and the product does not sound
like anything else. Six lightings exist and each resolves its own ground, which
is a harder thing to ship than it sounds.

**What is holding it down.** Three of the four foundations under a visual
language are not built. There is no spacing system, and the eighteen padding
values and thirteen margin values are why the word for this product keeps
coming back "clunky" even where the surfaces are well made. There is no type
scale, and thirty three sizes with eight of them in a three pixel band is a
scale that has been accreted rather than designed. There is no optical size
rule on the icons, so a family that is genuinely well drawn reads as two
families on any screen showing both an 8 pixel mark and a 46 pixel one. And
there is no light: the only light source in the product is a twenty five
thousand pixel image stretched across two million pixels, which is why the
Glass lighting, which is technically well built, has nothing to do.

**What is disqualifying it from higher.** Two of six lightings make the labels
on the core screen invisible at 1.05 to 1. One duplicated CSS line paints out a
count in all six. Every numeral in a numerical instrument is set in a fallback
typeface. And the right rail prints five specific measurements about a person
who has entered nothing, on the first screen a stranger sees, in the same card
that says "nothing yet" twice. That last one is not a contrast defect, it is
the product contradicting its own founding claim, and no amount of good drawing
survives it.

C plus, not C, because the Body page and the Knowledge deck are both clearly
above the line and the system underneath is coherent enough that the fixes are
mostly token edits rather than rebuilds. Twelve of the thirty eight findings
are single line changes.

### Ceiling: A minus

The argument.

Everything blocking this product from an A minus is a decision that has not
been made yet, not a constraint that cannot be lifted. A spacing ramp is one
afternoon. A five step type scale is one afternoon. An optical size rule on the
icon renderer is one function. The seat ramp's second step is fourteen values.
The invisible count is one deleted line. None of that is architectural and none
of it needs the backend this project does not have.

And the product has the two things you cannot add later. It has a subject
worth drawing, which most software does not, and it has a point of view about
that subject that is specific enough to argue with. The seven seats are not a
palette chosen for mood, they are a coordinate system, and every colour on
screen either is one or has a reason not to be. That is the condition under
which colour becomes structure rather than decoration, and it is the hardest
thing on this list to acquire. It is already there.

A minus rather than A, and the reason is honest: this product has 112 addresses
to name, 21 laws, nine axes, 19 domains, 12 archetypes and six lightings, in
one file, with no server. Something in the room is always going to be denser
than an A composition wants to be. Getting to a flat A means deciding that some
of that information does not appear on the same screen as the rest, and that is
an information architecture ruling, not an art direction one. It belongs to the
systems seat and to the owner. The moment that ruling exists, the ceiling moves
to A and the work to reach it is the same work listed above.

**What moves the grade, and by how much.**

- AD-01 alone, the cold rail telling the truth, moves it from C plus to B
  minus. It is one gate on one card and it removes the only defect in this
  review that damages the product's claim about itself.
- AD-02 through AD-06, the five blockers, together move it to B.
- MO-1, the field becoming the light, moves it to B plus on its own and takes
  Glass from C to B in the same change, because it is the only finding that
  gives the glass something to refract.
- AD-17 and AD-18, the spacing ramp and the type scale, move it to A minus.
  Nothing else on the list buys as much per hour, and nothing else is as
  invisible until it is done.

Sampled against the ICP roster before landing: Marcus, who closes the tab if
the wheel looks like a dashboard, is the reader for AD-38 and MO-7. Diane, who
wants a number and then what it costs, is the reader for AD-28 and MO-2. Sofia,
who takes it on a phone in bed, is the reader for AD-06 and MO-2. Derek, who
wants the limiter named, is the reader for AD-24. Angela, who wants to be seen,
is the reader for AD-01, because a reading she did not earn is the fastest way
to lose her. Gordon and Rosa are correctly out of scope and nothing here
chases them.
