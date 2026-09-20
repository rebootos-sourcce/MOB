# THE DESIGN LAW

Atüned / SOURCE. The single document that states what the surface is allowed
to do. There are nine DESIGN-*.md files and each describes one surface. This
describes all of them.

Every law below is derived from the code in this repository, not from memory
and not from the paragraph in CLAUDE.md that describes it. Where the two
disagree, the code is stated and the disagreement is named. Every number says
how it was measured.

    Read against      commit 656d3bd
    source.html md5   d2de8bdc476909f60e75d72c55df0835
    Gates run         node tests/design.js, 92 passed, 2 failed
    Date              2026-09-20

Contrast figures are WCAG 2.1 relative luminance, computed in
`/tmp/.../scratchpad/m.py` from the literal hex values read out of the files
cited. Saturation is HSL S, from the same hex. Frame rates are the numbers
`tests/design.js` gate 13 printed on this run. Screens were read at 1600x1000
and 390x844 with the Gordon profile loaded.

Four of us worked it. Sol Amadi took colour and light, Bjorn Haraldsson took
type and grid, Petra Nikau took composition and symbol, and I took the whole.
Findings carry a name.

---

## LAW 1. THE COLOUR LAW

**Seven seat colours, three palettes, one accent, one alarm. Everything on
screen is a seat colour or has a stated reason not to be.**

### The Seven Seats

Declared once, at `atuned_src/engine/data/canon.js:78`, and mirrored into CSS
tokens at `atuned_src/shell/head.html:81`. The two agree exactly.

| Seat | Hex | Hue | Sat | Light | On --bg #0C0D12 | On --panel #1A1D26 | On --panel-2 #252833 |
|---|---|---|---|---|---|---|---|
| Root | `#CF5953` | 2.9 | 56.4 | 56.9 | **4.81** | 4.17 | 3.64 |
| Sacral | `#D19255` | 29.5 | 57.4 | 57.6 | 7.35 | 6.37 | 5.56 |
| Solar | `#D4BC70` | 45.6 | 53.8 | 63.5 | 10.38 | 9.00 | 7.85 |
| Heart | `#65CFA5` | 156.2 | 52.5 | 60.4 | 10.19 | 8.83 | 7.71 |
| Throat | `#65B8D4` | 195.1 | 56.3 | 61.4 | 8.65 | 7.50 | 6.55 |
| 3rd Eye | `#8296DB` | 226.5 | 55.3 | 68.4 | 6.78 | 5.88 | 5.13 |
| Crown | `#A883D6` | 266.7 | 50.3 | 67.6 | 6.36 | 5.52 | 4.81 |

Saturation runs 50.3 to 57.4. Spread is **7.1 points**. Lowest contrast on the
ground is Root at **4.81 to 1**, which clears the 4.5 text threshold. Root and
Crown fall below 4.5 on `--panel-2` (3.64 and 4.81). Neither carries body text
there, both carry a 2.4 to 3.6 pixel ring stroke, and a stroke is not held to
the text threshold. Stated so nobody has to rediscover it.

The argument is autonomic, not aesthetic. Warm hues raise heart rate and
adrenaline. Root, Sacral and Solar are red, orange and yellow, and they carry
the heaviest load in most fields, so full chroma there would show the most
loaded person the most activating picture. Chroma comes down 30 to 40 percent
on the warm three and slightly on the cool four. Hue is the language and does
not move. This is written at `canon.js:67` and again at `head.html:33`.

**CLAUDE.md is stale on three of the seven.** It lists Root `#C4635E`, Heart
`#6FC5A3`, Crown `#A98BCE`. Those are the pre-ruling values. Each of the three
took exactly ten points of saturation with hue and lightness held: Root 46.4 to
56.4 at hue 2.9 and L 56.9; Heart 42.6 to 52.5 at hue 156.3 to 156.2 and L
60.4; Crown 40.6 to 50.3 at hue 266.9 to 266.7 and L 67.6. That closed the
family spread from 17.0 points to 7.1. The code wins. CLAUDE.md should be
corrected, and this brief does not do it because the task forbids touching it.
Found by Sol.

### Which Lighting Takes Which Palette

One ladder, and it is written twice so the HTML rings and the canvas cannot
drift apart: `component.js:28` for `seatCol()`, `component.js:206` for `bc()`.
They are the same ternary on purpose.

    Lumen              PAL_VIVID     canon.js:85
    Snow               PAL_LIGHT     canon.js:87
    everything else    PAL           canon.js:78

`PAL_LIGHT` is the same seven hues deepened into ink for paper. Measured on
Snow's ground `#EDEBE6`: 4.34 (Solar) to 5.29 (Crown). All seven clear 4.5
against Snow's `--panel` `#F8F7F3`, 4.82 to 5.88. Saturation runs 26.3 to 51.1.

`PAL_VIVID` is the named exception to the muted ruling, on the owner's word,
because Lumen's whole brief is vibrancy. Saturation runs 80.8 to 100.0. It has
to hold on white paper and on the `#101010` centre stage both, and it does not
fully manage the first. Measured on white: Sacral `#FF7A00` at **2.61**, Solar
`#C79200` at 2.79, Heart `#00A85C` at 3.11, Throat `#0091C4` at 3.59. Four of
seven are under 4.5 on paper. They clear on the stage (5.30 to 7.28). This is
the cost of the vibrancy ruling and it is a real one. Found by Sol.

**Defect, and it is live.** Lumen's CSS seat tokens and `PAL_VIVID` disagree on
three seats. `head.html:342` declares `--solar:#FFC400`, `--heart:#00C46A`,
`--throat:#00A9E0`. `canon.js:85` declares `#C79200`, `#00A85C`, `#0091C4`.
So anything drawn by the sheet and anything drawn by JavaScript are different
colours in the same lighting. The sheet's values are the paper-hostile ones:
`#FFC400` measures **1.60 to 1 on white**, which is a yellow that is not there.
The move: take the three sheet tokens to the `PAL_VIVID` values, in
`head.html:342`. That costs stage contrast (Solar 11.91 down to 6.83) and buys
paper legibility (1.60 up to 2.79). Nothing in gate 9 or anywhere else watches
this, because no gate compares a CSS token to a JS constant. Found by Sol.

### GOLD, The Accent, And The One True Gold

`canon.js:89` declares `const GOLD='#7EB8D4'`. The constant is named gold and
the value is blue. That is not a bug, it is history: the accent was ruled blue,
the token kept its name because sixty places in the sheet already read it, and
`head.html:96` makes `--gold` a formal alias of `--accent`. Nothing reads a
literal.

    --accent  #7EB8D4   8.96 on --bg. the product's accent, every dark lighting
    --gold    alias     the same value, kept for the sixty existing call sites
    --au      #C2A063   7.86 on --bg. actual gold. head.html:109

`--au` exists because the token lied about its name and something was asked for
in real gold. Nothing uses `--au` unless it is asked for by name.

### ALARM Is Reserved

`canon.js:89` declares `ALARM='#FF2E1F'`. Saturation **100.0**, the only full
chroma value in the product. 5.23 on `--bg`. Snow deepens it to `#D41200`
(4.54 on `#EDEBE6`), Lumen to `#FF1500`.

Full chroma is reserved for the alarm because the rest of the system gave its
chroma away. That is what makes the alarm read. If anything else goes to full
chroma the alarm stops being a signal and becomes a colour. See Law 3.

---

## LAW 2. THE TIER COLOUR LAW

**Ten bands. Each has a colour. Every place the tier is named wears it.**

`TIERCOL` at `canon.js:382`. `TIERDEF` at `canon.js:393`, ten entries, each
carrying `at`, `nm`, `state`, `soma`, `def`, `energy` and `toward`. Band ranges
come from `tierRange()` at `canon.js:474`, which reads the top of a band as one
below the floor of the band above, so a band prints as a range and not a
threshold.

| Band | Range | Hex | Sat | On --panel | The argument |
|---|---|---|---|---|---|
| Mastery | 91 to 100 | `#E4D9A8` | 52.6 | 11.85 | Clear light. Nothing held, nothing shouting. |
| Embodied | 81 to 90 | `#8FD0A8` | 40.9 | 9.42 | The heart green opening toward the light above it. |
| Compounding | 71 to 80 | `#65CFA5` | 52.5 | 8.83 | The Heart seat exactly, because this is where it builds. |
| Gaining | 61 to 70 | `#74C1C4` | 40.4 | 8.15 | Between heart and throat. Moving, not arrived. |
| Even | 51 to 60 | `#65B8D4` | 56.3 | 7.50 | The Throat seat exactly. Receptive, level. |
| Oscillating | 41 to 50 | `#8296DB` | 55.3 | 5.88 | The 3rd Eye seat exactly. Swinging, and this is the seat of it. |
| Incoherent | 31 to 40 | `#C9A96A` | 46.8 | 7.51 | Warm. A caution, and not an alarm. |
| Corrupt | 21 to 30 | `#C98A5E` | 49.8 | 5.84 | Warmer and lower. The warning deepening. |
| Severe | 11 to 20 | `#A9776E` | 25.5 | 4.45 | Chroma coming out. Numb is less present, not louder. |
| Collapsed | 0 to 10 | `#8A6F6C` | 12.2 | 3.66 | The colour nearly gone. The floor is quiet. |

The ladder is one continuous line: saturation falls from 52.6 at the top
through 12.2 at the bottom, and contrast falls with it from 11.85 to 3.66. The
argument, written at `canon.js:375`, is that chroma falls away as coherence
does, so collapse reads as the colour going out of the picture, which is what
collapse is. Three bands borrow a seat colour outright (Compounding takes
Heart, Even takes Throat, Oscillating takes 3rd Eye) and the rest sit in the
same muted family.

**None of the ten is the alarm red.** That is the point of the table. A person
reading Collapsed is not a person for whom something is wrong with the
instrument, they are a person who is low, and the alarm colour would say the
first thing while meaning the second.

**Collapsed at 3.66 on `--panel` is under 4.5 and it carries the tier word as
text.** Verified live: the Summary hero at 1600 prints "Collapsed" in
`#8A6F6C`. The argument for it is deliberate quiet and I accept the argument,
but the number is a defect against the contrast law and it lands on exactly the
band whose reader is least equipped. Severe at 4.45 is a rounding error from
the same problem. The move, if the argument is to hold: keep the hue and the
chroma, raise lightness until both clear 4.5. `#8A6F6C` at L 48.2 needs about
L 56 to reach 4.5 on `--panel`. Found by Sol.

**Every place the tier is named wears its colour.** Five sites, and they are
the complete set:

    ui.js:554         the strip ring, tcol from TIERCOL[r.tier]
    summary.js:76     the glance row, colour passed as the seventh field
    summary.js:560    the Summary hero ring
    summary.js:563    the Summary hero tier word
    panels.js:522     the rail tier word
    drills.js:922     the tier ladder, every row in its own band colour

Six, not five. Counted off `grep -rn TIERCOL atuned_src/ui/`. The rule is: if
the tier word is printed, it is printed in `TIERCOL[r.tier]`, with
`var(--ink)` as the fallback when the tier is absent. There is no site that
prints the word in the default ink.

---

## LAW 3. THE ALARM LAW

**`cr()` reddens past 90. A reading whose high end is the good end never
reddens.**

`component.js:17` declares `var HOT_AT=90`. `component.js:39` is the whole
mechanism:

    var hot=(o.hot!==undefined)?o.hot:(p>=HOT_AT);

Past 90 percent the arc stroke becomes `var(--alarm)`, the value pill takes
`--alarm-soft`, the border goes to `rgba(255,46,31,.45)` and the glyph stroke
goes to the alarm. `head.html:1022`.

This was a defect twice. The wording that settled it is in the code at
`summary.js:123`: "96 per cent flow accuracy and yet it is red. Red is a colour
of danger. That is bad colouring."

### The Two Kinds Of Reading

A **charge** reading measures what is being carried. High is the cost. It
reddens, and reddening is correct.

| Reading | Where | Scale |
|---|---|---|
| shadow weight, DQ | `summary.js:87` | summed, no ceiling |
| carried depth, SQm | `summary.js:97` | of 10 |
| seat load, address SQ | `crbNode`, `component.js:164` | of 10 |
| saboteur weight | `crPat`, `component.js:167` | of 10, hot at 9 or on overshoot |
| mask weight | `sumStructRow`, `summary.js:306` | of 10 |
| complex, hyper, character | via `crPat` | of 10 |

A **share, coherence, accuracy, flow, integrity or fill** reading measures what
is standing. High is the end a person is working toward. It passes `hot:false`
and never reddens, whatever the number.

| Reading | Where `hot:false` is passed | Scale |
|---|---|---|
| coherence, CQ | `summary.js:559`, `summary.js:501`, `analytics.js:100`, `ui.js:555` | of 100 |
| accuracy, identification | `personas.js:225`, `summary.js:106` | of 100, plus or minus the band |
| flow through | `mapshelf.js:14` | of 100 |
| pole, installed poles | `summary.js:101` | of 10 |
| energy, vitality, awareness, will | `ui.js:730`, `:735`, `:740`, `summary.js:103` | of 1 |
| flow, seats multiplied | `ui.js:745` | of 1 |
| archetype share | `summary.js:128` via `sumStructRow` | percent of the blueprint |
| domain share | `ui.js:789`, `prow()` | percent of the selection |
| gate pass, integrity | `drills.js:252`, `:308` | of 1 |
| fill, expression | `expression.js:10`, `exprFill` | of 10 |
| seedShare | `seed.js:80` | 0 to 1 |

The boundary, stated once so it can be applied to the next reading nobody has
built yet: **if the number going up is the person getting better, it never
reddens.** `summary.js:128` encodes exactly that as a predicate, and it is
the only row in the product that decides per item:

    hot:(x[0]==='shadow weight'||x[0]==='carried depth')?undefined:false

Two charges out of six rows, and four that are never allowed the alarm.

**Verified live.** Gordon at 1600, Summary: shadow weight 54.7 prints in the
alarm, coherence 1 percent does not, identification 82 percent does not, the
first domain share at 100 percent does not. The law holds on screen.

**No gate catches a violation of this.** There is no assertion anywhere in
`tests/design.js` about the alarm colour. It has been a defect twice, it is
enforced by a convention in nineteen call sites, and the nineteenth to be
written wrong will ship. The move: a gate that loads a profile, walks every
`.cr.hot` on every surface, and asserts its `title` names a charge reading. I
am not writing it in this pass because the task is the brief, but it belongs
in `TASKS.md`. Found by Petra.

---

## LAW 4. THE ICON LAW

**Ring, not fill. A 24 unit grid. If it has a name it has an icon, the icon has
a family, the family has a colour, the colour means something.**

### Ring, Not Fill

Every glyph in the product is `fill:none` with a stroke. Twelve declarations
enforce it and they are the complete set:

    head.html:857    .seg-i svg            1.6
    head.html:989    .cr .ring .gl svg     1.7
    head.html:1274   .crb-g svg            2.0 / 1.8 / 1.6 by size
    head.html:1330   .bal-g svg            1.6
    head.html:1354   .ad-ic                1.7
    head.html:1473   .undobtn, .redobtn    1.7
    head.html:1509   .pol-g svg            1.7
    head.html:1540   .ib svg               1.7, 2.0 when pressed
    head.html:1743   .kb-cg svg            1.5
    head.html:1868   .gm-card.mt svg       1.6
    head.html:2245   .st-mic svg           1.7
    head.html:1084   .s-dom svg            1.7

Stroke weight runs 1.5 to 2.0. That is a four step ladder across sizes 11 to 24
and it is optical rather than proportional: the smaller mark takes the heavier
stroke so it does not vanish. `head.html:1288` to `:1296` is the ladder.

### The 24 Unit Grid

`component.js:20` is the only helper that draws one:

    const svgI=function(p){return '<svg viewBox="0 0 24 24">'+p+'</svg>';};

Every glyph family is authored in that box. `SEATGLYPH` at `canon.js:93`,
`GATEGLYPH` at `canon.js:126`, `QICON_D` at `component.js:78`, and the 111
`ic:` path strings across `canon.js`, `compass.js`, `kb.js` and `practice.js`.

**Counted, not asserted:** 111 `ic:` declarations across `atuned_src/`, 100 of
them in `engine/data/`. Plus 8 seat glyphs including the fallback `_`, 6 gate
glyphs, and 4 quotient glyphs. `grep -rho "ic:'" atuned_src/ | wc -l`.

### The Families

| Family | Where | Colour |
|---|---|---|
| Seats, 7 plus a fallback | `canon.js:93` | the seat's own `PAL` value, via `seatCol()` |
| Gates, 6 | `canon.js:126` | the gate's seat |
| Quotients, 4 | `component.js:78` | the seat the reading is argued from |
| Charges, 9 | `canon.js:108`, `CHILD[].ic` | the charge's seat |
| Domains, 19 | `canon.js:153` | the root, via `ROOTCOL`, `canon.js:149` |
| Archetypes, 12 | `canon.js:192` | the archetype's seat `b` |
| Roots, 4 | `ROOTCOL` | Architect `#8296DB`, Engine `#D19255`, Weaver `#65CFA5`, Witness `#A883D6` |

`ROOTCOL` is four of the seven seat colours reused, exactly. Architect wears
3rd Eye, Engine wears Sacral, Weaver wears Heart, Witness wears Crown. The
family colour is never invented.

### Three Things Get Letters Instead Of A Drawing

`component.js:40` records the ruling. CQ, DQ and SQ take their letters in the
centre of the ring rather than a glyph, because those three letters are the
names everything in this product calls them by, and a drawing would be a second
name for a thing that already has one. `cr(..., {text:'CQ'})` at
`component.js:58`.

The four quotients that had no icon at all got one, argued from what the
reading is rather than from what the word sounds like. `component.js:78`:
vitality is a shoot, awareness is an aperture (the eye was already spoken for
by perception), will is force through a gap, flow is what rises and keeps
rising.

### The Exceptions, And They Are Not What CLAUDE.md Says

CLAUDE.md names Punch and Lumen as the exceptions to ring-not-fill. **They are
not.** I checked every rule. No glyph is filled in either lighting.

What Punch and Lumen change is the **carrier**, not the mark. In Punch a
selected chip takes a solid colour fill and the glyph reverses to the ground:
`head.html:570`, `stroke:var(--bg)`. In Lumen the same, reversing to the panel:
`head.html:389`, `stroke:var(--panel)`. Lumen also thickens every nav glyph
from 1.7 to 1.9 at `head.html:382`, because the paper ground eats a thin
stroke. The ring rule holds on the mark in all seven lightings.

The one fill rule in the entire sheet is `head.html:860`:

    .seg-i[data-solid] svg path:first-child{fill:currentColor}

`grep -rn "data-solid" atuned_src/` returns exactly one hit, that line. No
renderer emits the attribute. It is a dead rule. Gate 3 catches a class with no
CSS; nothing catches a CSS rule with no class, so it has sat there unreferenced.
Delete it, and then the icon law has zero exceptions and can be stated without
one. Found by Petra.

### Selection Is A Ring, With Three Named Exceptions

`head.html:52` states it: recognition speed matters most before selection, so a
fill on the chosen item spends legibility where it is not needed. Selection is
a ring, the icon keeps its colour and its inner spacing.

Punch, Flat and Lumen override it, each on a ruling, because in all three the
material is gone and colour is carrying the whole hierarchy:

    head.html:563    body.punch .vt[aria-pressed=true]  solid accent
    head.html:443    body.flat .iq-n.on                 solid accent
    head.html:391    body.lumen .vt[aria-pressed=true]  solid accent

---

## LAW 5. THE NUMBER LAW

**Every number says what it is out of. Never a count against a total. Never
print a percentage off a default.**

### Every Number Says What It Is Out Of

The ruling, quoted in the code at `summary.js:112`: "You read 13, what does
that mean."

`sumGlance()` at `summary.js:70` is the enforcement. Every row is a six or
seven element array and the sixth element is the scale, printed as a third line
in the button:

    coherence        of 100
    shadow weight    summed, no ceiling
    carried depth    of 10
    pole             of 10
    energy           of 1
    identification   of 100, plus or minus <band>

**The scale is on the screen, not in a tooltip.** Same site,
`summary.js:114`. A title attribute is not an answer because a phone has no
hover, and eight definitions in this product lived only in a title. The title
keeps the longer sentence; the scale is visible.

Two of those scales were lies and the code records both corrections.
`summary.js:72`: shadow weight was labelled 0 to 10 and reads 54.7 on Gordon,
45.9 on Tomas, 22.8 on Ana. It is a sum with no ceiling and the label now says
so. `summary.js:99`: pole was labelled 0 to 1 and read 8.49.

### Never A Count Against A Total

`canon.js:474`, `tierTop()` and `tierRange()`. A band is a range and prints as
one. The ladder used to print one number per row, which is a threshold, and a
threshold does not tell a person how wide the word is.

The count stated to users is **112**. `wheel.js:824` prints it:

    pill('112 addresses · SQ · '+r.loaded.length+' loaded', R.shell+14)

Verified on screen at 1600 with Gordon: "112 addresses · SQ · 97 loaded".

### Never Print A Percentage Off A Default

Three sites, all reached because the app opens on the Field and both reading
surfaces render to somebody who has entered nothing.

    summary.js:496   sumUnread. the hero ring holds an en dash, colour --dim
    summary.js:444   sumNum returns '' on r.unread
    analytics.js:97  the hero ring holds an en dash, the arc holds nothing

`summary.js:437` records the worst of it: `sumUnread` printed "a number off a
default is a number about the default and not about you" and then called
`sumNum`, which fell back to the name "You", computed a full numerology reading
off it and ended on a karmic debt line. Twenty lines under the sentence
forbidding exactly that. The guard is at the callee, not the caller, because
any future caller has the same problem.

`analytics.js:92` records the same failure on the folded Analytics surface: the
eyebrow already knew how to say "not read yet" and the ring beside it printed
36 percent anyway.

**No gate catches this either.** Nothing in `tests/design.js` loads a blank
profile and asserts that no ring prints a percentage. `tools/monitor.js` walks
a blank profile but counts markup size, not content. Found by Bjorn.

---

## LAW 6. THE TYPE LAW

**One face. Sentence case body, title case headers, no all caps UI copy, no em
dashes. The typeface is carried, not fetched.**

### One Face, And It Took Two Corrections To Get There

`head.html:127` and `head.html:146`. `--sans` and `--num` are both Inter.

The first correction: the face was Lexend, which is wide by design, and the
rail clipped. Witness rendered as Wit. Inter is narrower at the same size and
carries more characters per line without dropping the point.

The second is the sharper one and it is written at `head.html:128`. `--num`
named Lexend for the digits. **Lexend was never in the build.** When Google
Fonts went, Inter was embedded and Lexend was not, so every number in this
product, every reading, every allowance, every tabular column, fell through to
`system-ui`. Which face that is depends on the machine, so the one thing the
token existed to guarantee, that columns of figures line up, was the one thing
it could not do. `document.fonts.check('12px Lexend')` returns true, which is
what hid it: `check` answers whether the text can be rendered at all, and a
fallback counts. The honest reader is the loaded-families list and it has one
entry. Gate 7 asserts it: `tests/design.js:243`, "Inter resolved from the file
rather than falling back silently". This run printed `faces: Inter loaded`.

### No Network Request, And Why

`head.html:12` states it. The file linked `fonts.googleapis.com` and
`fonts.gstatic.com`, so every load sent the person's IP to Google before they
had typed a word. This product holds somatic and psychological self report and
the standing promise is that nothing leaves the device.

Inter is embedded at `head.html:28` as a variable font, latin subset, weight
300 to 700, one file, base64 in a `@font-face`. Forty eight kilobytes raw,
sixty four as base64, about a tenth of the build for the last network
dependency it had.

**Gate 7**, `tests/design.js:218`. It watches the network at run time rather
than reading the source. It asserts zero outbound requests beyond the two local
rasters, asserts specifically that nothing reaches `googleapis` or `gstatic`,
and asserts Inter resolved. This run: `outbound requests: none`.

### Case

`head.html:963`:

    .pm-eye,.tier1,.sub,.sp-hd,.rit-tr,.ip-bh,.sum-lt,.kb-h,.sh-h,.ad-nm,
    .gm-on,.eyebrow,.lbl{text-transform:capitalize}

Headers take a capital on every word. Body text is sentence case. Done in the
sheet rather than by editing every string, so a header written in sentence case
still renders correctly and nobody has to remember the rule while writing one.
`capitalize` only touches the first letter of each word, so an acronym like CQ
survives.

`head.html:967` is the escape hatch: `.plain` on any of those classes returns
it to sentence case. `sh-h` needs it because that class also prints a person's
own name, and rendering somebody as De Vries is wrong about them rather than
merely styled.

**Defect. `text-transform:capitalize` is not title case, it is Start Case.**
Title case leaves of, the, and, this lowercase. The sheet's own comment at
`head.html:947` admits this and then the rule was applied anyway. Visible at
1600 on the Summary: "Primary And Secondary", "Where It Goes". The move is not
a CSS one, because CSS cannot know the stop words. Either the headers are
authored in title case and the transform comes off, or the rule is restated
honestly as Start Case. It is the owner's call and it is raised here rather
than answered. Found by Bjorn.

### No All Caps UI Copy

**Gate 5**, `tests/design.js:138`. It walks every leaf text node, skips SVG,
skips `.brand`, and fails on any string over six characters that is either
`text-transform:uppercase` or all uppercase letters.

One exemption, named narrowly on `.brand` and nothing else. A logotype is not
copy. ATUNED has been uppercase since the owner ruled it, and it only ever
passed the gate by being six characters, which is luck. SOURCE OS under it is
nine, so the exemption had to be written. It is done in the sheet at
`head.html:735` rather than in the markup, so the string in the document stays
sentence case and the mark's own styling carries the case. This run: `all-caps
strings: none`.

The other two uppercase rules in the sheet are both on the boot wordmark,
`head.html:702` and `head.html:3149`, which is the same logotype.

### The Type Floor

**Gate 4**, `tests/design.js:112`. Nothing under 11 CSS pixels, measured on the
computed style of every leaf text element, skipping SVG because SVG text scales
with its viewBox.

One exemption, by class, `EXEMPT=['bs']`. That is the build stamp under the
wordmark: identity, read once, says nothing operational, and nothing is lost by
skipping it. The owner ruled it two points under the floor. It is by class so
the next thing that wants to be small has to come and argue.

**This gate is failing on this run.** `{"gl gl-t @9.5px":3}`. `head.html:1246`
sets `.cr .gl-t` at 9.5px. That is the letter centre from Law 4: the CQ, DQ and
SQ letters printed inside a ring. Three of them, on the Field strip. The
letters are not a wordmark and they are not a serial number, they are the names
the whole product calls those readings by, so the exemption does not reach
them. The move: `.cr .gl-t` to 11px and the ring geometry in `CRGEO`
(`component.js:16`) opened to carry it, or the letters accept a fourth named
exemption with an argument attached. Found by Bjorn.

### Measure And Rhythm

    reading text   16px, line-height 1.7, max-width 68ch   head.html:971
    labels         11px, weight 600, --dim                 head.html:936
    spacing        6 / 10 / 16                             head.html:178
    radii          16 / 11 / 8, flat lightings 4 / 4 / 3    head.html:147, :412

The spacing scale is three steps and it is argued: 6 between things in one
control, 10 between controls, 16 between blocks. Gaps of 5, 7, 8, 9 and 11 were
all doing one of those three jobs with no reason stated, so they read as drift
rather than as rhythm.

**The type scale has not had the same treatment.** Measured:
`grep -o "font-size:[0-9.]*px" atuned_src/shell/head.html | sort -u` returns
**32 distinct sizes at or above 8.5px**: 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12,
12.5, 13, 13.5, 14, 14.5, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
30, 34, 38, 42, 46, 48. Half-point steps between 11 and 15 are the bulk of it:
12.5px is declared 64 times, 13.5px 34 times, 11.5px 20 times. Thirty two sizes
is not a scale, it is a record of every decision made separately. The spacing
scale got three steps and an argument; the type scale got none. Found by Bjorn.
The move is a named ladder of six or seven sizes as tokens on `:root`, the same
way `--g1`, `--g2` and `--g3` were done, and it is a large diff, so it is
raised and not done here.

### No Em Dashes

Anywhere. Including commit messages and this document. `BUILD.sh` checks it as
part of the build, per CLAUDE.md. There is not one in this file.

---

## LAW 7. THE MOTION LAW

**Three curves, four durations, all named. Nothing over the Field carries a
backdrop filter.**

### The Named Steps

`head.html:162` and `head.html:167`:

    --ease-out    cubic-bezier(.22,1,.36,1)      a thing arriving. fast off the mark, long settle
    --ease-in     cubic-bezier(.4,0,1,1)         a thing leaving. it does not need to be watched out
    --ease-land   cubic-bezier(.34,1.56,.64,1)   a thing that lands. one overshoot, no ring

    --t-micro     120ms   hover, press, focus
    --t-element   220ms   one thing entering or leaving
    --t-surface   320ms   a panel or a rail, which carries more area
    --t-context   420ms   a whole tab. the longest the product may take

The micro step is argued: below about 100ms a change reads as a jump with no
cause; above about 150 the pointer has already left.

**Gate 12**, `tests/design.js:528`. It reads the computed style of every
animated element rather than the sheet, because the sheet lied: before this
block existed, 381 of 384 live animated elements ran on the browser default
`ease`, a symmetric curve that reads as mechanical because it decelerates as
slowly as it accelerates, and the four hand written beziers in the sheet sat on
one live element.

The gate asserts all seven tokens resolve (an unresolved `var()` reads as empty
and the transition silently falls back to 0s, which is no motion at all), that
there are over 100 live animated elements, that **no element runs on the
default ease**, and that **every duration is one of the four named steps**.
This run: `animated: 381  durations: 0.32s 0.12s 0.22s 0.42s`.

**The gate has a hole and two durations are through it.** `grep` for literal
durations in the sheet returns `.12s`, `.18s` and `.3s`. `.12s` equals
`--t-micro` and is harmless. The other two are not named steps:

    head.html:1730   .kb-c      transition:transform .18s
    head.html:1340   (a width)  transition:width .3s

Gate 12 samples the document on the default tab. `.kb-c` is a Knowledge card
and Knowledge renders lazily, so the element does not exist when the gate
looks. The move: both to `--t-element`, and the gate to walk every tab the way
gate 8 does. Found by Bjorn.

### Reduced Motion

`component.js:366`. `REDUCED` reads `prefers-reduced-motion` and the rAF loop
honours it: the Field stops breathing. The UX skill, rule 8, requires this to
be a toggle and not only a media query.

### Nothing Over The Field Carries A Backdrop Filter

**Gate 13**, `tests/design.js:568`, and it is the best-argued gate in the file.

The Field's wheel canvas repaints every frame. Every element above it carrying
a `backdrop-filter` has its backdrop re-read and re-filtered on each of those
frames. Measured on Gordon at 1600x1000 in isolation: dark 60.5, snow 60.5,
punch 60.6, flat 60.6, **glass 12.0, glass white 16.4**. Seventy one elements
carried a backdrop under Glass.

The diagnosis is recorded because every obvious fix was tried and failed. Not
the radius: 26 down to 10 gave 12.0. Not the pseudo elements: removing the
specular and the fringe gave 12.9. Not the count: 71 down to 5 gave 12.7,
because the cost is the readback and readback goes with area. Not
layerisation: `will-change`, `translateZ`, `contain` and `isolation` on the
canvas all landed between 11.6 and 12.1. Stopping the wheel repainting gave
56.7, which is the proof. Removing every backdrop gave 60.6.

So the gate asserts the **structural fact**, which is deterministic: nothing
over the Field carries a `backdrop-filter` in any lighting. The frame rate is a
loose backstop at 30, well under the 60 floor, because the file keeps several
pages open at once and a lighting measured in that company reads 36 where the
same build reads 60.1 alone. A tighter number would be a gate reporting on the
gate, which this project has been caught by twice.

The list of lightings is read from `LIGHTINGS` at run time, not written down.
Lumen shipped with neither its frame rate nor its backdrop count guarded
because the list was hand written and went stale the moment a seventh landed.

This run, all seven clean:

    dark       backdrops 0   fps 54.8
    snow       backdrops 0   fps 61.8
    punch      backdrops 0   fps 59.5
    glass      backdrops 0   fps 56.8
    glasswhite backdrops 0   fps 60.9
    flat       backdrops 0   fps 60.9
    lumen      backdrops 0   fps 61.1

### The Aura Is Painted Small And Scaled Up

`component.js:301`. The background wash was a full viewport canvas inset 25
percent, 2400 by 1500 at desktop size, carrying a 120px CSS blur and
recompositing whenever its content changed. Measured on the Field with a loaded
profile: **7.7 frames a second, against 59.5 with that one element hidden.**
Eighty seven percent of the frame budget went into blurring four radial
gradients that are already soft. Dropping the radius did not save it: 40px at a
smaller inset still only reached 15.2.

It is now painted at an eighth scale (`AURA_DIV=8`, `component.js:240`) and
stretched back up. The browser's bilinear upscale is the blur, it is free, and
eight times is far past the point where a gradient shows a step. The backing
store goes from about 3.6 million pixels to 56 thousand: 64 times less to
paint and nothing at all to filter.

### The Boot

**Gate 11**, `tests/design.js:467`, and **gate 14**, `:631`.

Gate 11 asserts the boot sheet is up while the app loads, that it draws seven
seats, that **every boot seat is a palette colour**, that all seven differ,
that the addresses are drawn, and that the sheet is **removed from the
document** rather than faded, because a sheet at opacity zero still covers the
app and still takes pointer events.

Gate 14 asserts the way out is legible before the sequence ends, at under
2600ms, that the text says what to do (`/press/i`), and that taking it goes
straight in. The reason: `pointerdown` and `keydown` have always cleared the
boot, nothing said so, and a person met a five second sheet with no visible end
and no visible exit while the app underneath had been usable since 198ms.
Verified in the 1600 shot: "Press anything to go straight in".

---

## LAW 8. THE COMPOSITION LAW

**No text over the hero graphic. Ever.**

The hero graphic is whatever the surface exists to show. The wheel on the
Field. The figure on the Compass. The body on Body.

Three sites record the rule and each one records what it cost to learn it.

**`wheel.js:386`.** The coherence figure was set in the middle of the wheel's
core, at up to half the core's diameter. Two rulings beat the argument for
keeping it. The first is this law. The second is that coherence was printed
**four times on one screen**: the strip above the wheel, the core, the right
rail's pill, and the tier word, which is coherence restated in a word. Four
sayings of one number is not emphasis, it is the surface having no idea what it
is for. Nothing was lost. The strip directly above the wheel carries "1% CQ"
and the rail carries it again, so the number is two inches away in both
directions. The core stays, because the core is sized and lit by coherence,
which is the drawing doing the work rather than a caption doing it.

**`cone.js:213`.** Sixteen names were painted on the Compass figure. Measured
before removal: **89 colliding pairs at 1600 wide, and no gate watching one of
them**, because a radial layout has no line breaking and a painted word cannot
be measured by anything that measures markup. The names moved to a rail left
and right, where they light up as the figure wheels round. The rail has line
breaking, `tests/collide.js` can see it, a screen reader can read it and a
button can carry a control. All four were impossible while the names lived in a
canvas.

**`cone.js:474`.** The worst break. The coherence number was printed in 15
point beside the marker in the middle of the figure, saying 39 and nothing
else. Two faults in one: it sat on the drawing, and it was a number with no
scale, which is Law 5.

What stays on a hero graphic is the graphic: seat coloured meridians, address
marks, the core sized and lit by the reading.

**The rule is broken today, on the Field, in nine places.** `wheel.js` calls
`pill()` nine times and `pill()` (`component.js:358`) draws a rounded label
**onto the canvas**, centred on CX:

    wheel.js:744   '21 laws · integrity 1.9'
    wheel.js:756   '12 archetypes'
    wheel.js:765   '6 masks'
    wheel.js:824   '112 addresses · SQ · 97 loaded'
    wheel.js:852   '19 domains · Architect'
    wheel.js:940   'saboteurs · 39'
    wheel.js:949   'complexes · 19'
    wheel.js:950   'hyper · 6'
    wheel.js:951   'character · 2'

Three of them are visible simultaneously in the 1600 Gordon shot, stacked
inside the ring. I am not calling this a violation to be fixed blind: the
radial labels sit **outside** the rings at `LBL_R=1.20` (`component.js:188`),
which is off the drawing, and those nine pills are ring captions that name what
each band is. They earn a hearing. But the rule as written is absolute and the
pills are text over the hero, so either the rule gains a stated exception for a
band caption or the captions move to the strip that already sits above the
canvas. It is the owner's call. Found by Petra.

**Two composition defects at 390, both visible in the mobile shot.**

1. The Summary hero prints the tier word "Collapsed" hard against the right
   viewport edge with no gutter. `head.html:2350`, `.sum-hero`, a flex row
   with the ring and the tier and no minimum right padding at narrow widths.
   Every other block on that screen holds a 16px gutter. Found by Petra.

2. The tab bar at 390 shows five of nine tabs and scrolls horizontally with no
   affordance. That is the UX skill's rule 10 exactly: "an overflowing scroller
   with a hidden scrollbar is indistinguishable from a missing feature. Wrap
   instead." It is on the product's primary navigation. `DESIGN-mobile.md`
   should own this and this brief records it. Found by Petra.

---

## LAW 9. THE SEVEN LIGHTINGS

**Seven, and each is genuinely its own. A lighting is not a skin.**

`LIGHTINGS` at `atuned_src/ui/panels.js:280`. `setLighting()` at `:282` toggles
one body class. `account.js:286` renders the same seven in the account page, so
there are two doors onto one setter, which is not a duplicate: one is for
changing it while looking at the instrument, the other for finding it when you
do not know where it is.

**CLAUDE.md says four.** It names Dark, Snow, Punch and Glass. There are seven.
Gate 9's own heading string still says "four lightings" at
`tests/design.js:309`, though its assertions read the count off `LIGHTINGS` at
run time and pass. The code wins.

| # | Key | Name | Ground | What it is for |
|---|---|---|---|---|
| 1 | `dark` | Dark | `#0C0D12` | The default. A deep neutral ground, four levels of surface, the muted palette. The instrument at rest. |
| 2 | `snow` | Snow | `#EDEBE6` | Paper. Off-white, never pure white. `PAL_LIGHT`, the accent deepened to `#2F6E92` to hold, the umlaut to `#13303F` because the dots sit on paper and not on the letter. |
| 3 | `punch` | Punch | seat tinted | Nothing is outlined, everything is solid. One plane, no borders, no shadows, a selected thing is a colour fill. Relational: the shell tints toward the seat the reading names heaviest, `--seat` and `--seat-w` set by `render()`. A light Throat reading is a cool grey; a severe Root one is warm and deeper. The chrome is a consequence of the field, not a skin. |
| 4 | `glass` | Glass | `#0B0D14` | The one aimed forward. Holographic skeuomorphism: refraction rather than blur, a two pixel spectral fringe running cool on one edge and warm on the other, one light upper left. The ground stays neutral and the **light** carries the seat reading, because Punch already tints the surface and doing both turns a Sacral heavy field brown. |
| 5 | `glasswhite` | Glass white | `#E8E7E2` | The same material under a different sun. Dark glass is lit from behind, pale glass is lit from in front. The panes stay translucent, the fringe stays, the specular inverts. The blur is lower than dark Glass on purpose: on a light ground a heavy blur reads as fog, on a dark one it reads as depth. |
| 6 | `flat` | Flat | `#0A0B0E` | The opposite position to all the others. Where Glass says the interface is made of something, Flat says it is made of nothing and only the reading is real. Every radius to 4px, every edge to one pixel, no shadow, no backdrop, and the accent carries the entire hierarchy. It states its own accent, `#5FD4C4`, because with no material doing any work the colour has to be strong enough to. |
| 7 | `lumen` | Lumen | `#FFFFFF` | The only two tone one. White ground, white chrome, and every centre display area stays `#101010`. The panels do the work the paper does in Snow and the paper does the work the frame does in Dark. Two inks, because there are two grounds: `--on-bg` exists only here. `PAL_VIVID` at full chroma, the named exception to the muted ruling, on the owner's word, because Lumen is about vibrancy. |

### Gate 9 Is The Enforcement

`tests/design.js:309`. It reads the count off `LIGHTINGS` rather than a written
number, after a hand written six failed for the one reason a gate must never
fail: the product grew. Third hand written count found stale in one session,
after the lighting list and the tab count.

It asserts, per lighting, that it resolves its own `--panel`, `--edge`, `--ink`
and `--accent`, and that its ink and its ground are not the same colour. Then
across the set: **seven lightings must produce seven distinct grounds**, or one
of them is a skin rather than a lighting. That is the check that caught Glass
inheriting Dark. And that the ink moves with them, at least two distinct.

Then the accent rule: one value across every dark lighting that inherits it
(Dark, Punch and Glass all `#7EB8D4`), Flat states its own because it has
nothing else, Snow deepens on paper. This run printed all seven grounds
distinct.

### What Is Not Guarded

**Contrast per lighting.** Gate 9 checks that tokens resolve and that grounds
differ. It does not check any ratio. Measured across the seven:

    Dark    --dim #94908A on --panel        5.30    on --panel-2   4.63
    Snow    --dim #605E59 on --panel        6.04
    Lumen   --dim #8C8C94 on stage panel    5.37
    Glass   --ink #F3F2EE on --bg          17.33
    Flat    --dim #767369 on --panel        3.88

**Flat's `--dim` is 3.88 and that is a defect.** `--dim` is the only token
marking the second tier of the information architecture: every eyebrow, every
key label, every explanatory subline. Dark's `--dim` was fixed for exactly this
reason (`head.html:73` records that it measured 3.70 and carried 104 of the 105
contrast failures on the Summary in Dark, one value, 104 defects). Snow's was
fixed. Flat's was not. The move: `--dim` at `head.html:401`, the `body.flat` block, from `#767369` to
about `#89857C`, which lands at 4.6 on Flat's `--panel`. Found by Sol.

The age argument is in `head.html:76` and it is the reason this matters more
than the ratio suggests: six of the reference people are 57 or older (James 57,
Gordon 58, Rosa 61, plus Abraham 66, Wren 74 and one more at 58), and contrast
sensitivity falls materially past 55. At 3.88 that part of the sample loses the
whole layer that tells them what they are looking at.

---

## THE GATES, AS A SET

Every gate in `tests/design.js` is a law already enforced. Named, in order,
with what each forbids.

| Gate | Line | Forbids |
|---|---|---|
| 1 · load | 27 | A console error that is not one of the two named raster misses. A tab declared in `TABDEF` that does not reach the bar. A shell that is not 4 depths, 19 domains, 12 archetypes, 21 law fields, 18 axis fields, 171 matrix cells. |
| 2 · one surface per tab | 67 | Two tab surfaces visible at once. A folded surface visible without its parent. `#ana` inside `#sum` is the one fold left. |
| 3 · CSS coverage | 96 | A class a renderer emits with no CSS rule behind it. |
| 4 · type floor | 112 | Text under 11 CSS pixels. One exemption, `.bs`, the build stamp, by class. **Failing: 3 elements at 9.5px.** |
| 5 · all caps | 138 | Any UI string over six characters set in or transformed to uppercase. One exemption, `.brand`, because a logotype is not copy. |
| 6 · panels and names | 173 | A panel narrower than the column that holds it. A single class name declared twice with conflicting geometry. **Failing: `.kb` declared twice, both setting padding.** |
| 7 · nothing leaves | 218 | Any outbound request beyond the two local rasters. Any reference to `googleapis` or `gstatic`. Inter falling back silently. |
| 8 · tap floor | 249 | Any on-screen interactive element under 44 by 44. Measured per tab, on the settled screen, with the entrance transform removed. A label wrapping a checkbox is measured, because clicking the label toggles it. |
| 9 · lightings | 309 | A lighting that does not resolve its own tokens, or that shares a ground with another. An accent that drifts across the dark lightings. Count read off `LIGHTINGS`. |
| 10 · the body paints what it counts | 400 | A mark that is in the DOM and not on the screen. It counts the marks, then reads the pixels under them and asserts the figure differs with and without. Written because a `clipPath` whose only child was a `<g>` clipped forty nine correctly placed marks away, and neither reading the source nor counting the nodes could catch it. |
| 11 · the boot | 467 | A boot that does not draw seven seats, seats that are not palette colours, seats that are not all distinct, or a sheet that fades instead of being removed. |
| 12 · motion is named | 528 | An unresolved motion token. An element on the browser default ease. A duration that is not one of the four named steps. |
| 13 · the Field's frame rate | 568 | Any `backdrop-filter` over the Field, in any lighting. Frame rate under 30 as a loose backstop. |
| 14 · the boot says how to get past it | 631 | A boot whose exit is not legible before 2600ms, does not say what to do, or does not work when taken. |

Read the count off the run, never off this table. This run: **92 passed, 2
failed.** CLAUDE.md says 94 and says it is green. It is neither. That is the
sixth time this repository has been bitten by a number typed into a document
that the product then grew past, and it is exactly the defect CLAUDE.md itself
names.

---

## THE ARGUMENT UNDERNEATH ALL OF IT

Restraint is not decoration here, it is mechanism. The seat palette gives up 30
to 40 percent of its chroma so that the one full-chroma value in the product
means something. The type gives up its shouting so three levels of hierarchy
can be carried by weight, space and value. The hero graphic gives up its
caption so the drawing can do the work. Every one of those is the same move: a
thing withholds so that the next thing can be read.

That is also why the alarm law and the number law are the two that have been
broken most. Both are cases where adding one more thing looked free.

---

## TISSUE TEST, AND THE SAMPLE

Reported, as required, rather than claimed.

**What was run.** `source.html` at commit 656d3bd. Screens captured at
1600x1000 and 390x844 with **Gordon, 58, managing partner** loaded. Gordon is
the edge case from `RESEARCH-icp.md` who refuses: Fear, Anger, Shame and
Disgust at 10, nothing installed, coherence 1 percent, Collapsed. He is the
correct worst case for a colour and contrast read because every charge reading
on his screen is maxed and every good-end reading is at the floor. Surfaces
read: Field, Summary, Compass, Knowledge, in Dark, plus Snow, Punch and Lumen
on the Field. The boot was read on a blank profile at 1600 with Marcus
selected.

**What was not run.** I did not read all six ICPs, and I did not read Rosa,
whose field is nearly empty and who is the opposite worst case for the same
laws: with almost nothing held, Law 3's charge readings sit near zero and the
question becomes whether the good-end readings look like an alarm by being
full. That read is owed. I did not read Glass, Glass white or Flat on screen,
only in measurement, and Flat is the one with a live contrast defect.

**Three passes.**

*Squint, from six feet.* Summary at 1600: the eye lands on "Gordon" first, the
tier word "Collapsed" second, the red 54.7 third. That is the right order and
it is achieved with size, then colour, then colour, which is one channel too
many at the third level but is defensible because the third level is the alarm.
Field at 1600: the eye lands on the wheel, then the red DQ pill top left, then
the rail. Also right. The wheel is unmistakably the hero.

*Measure.* Everything above, against each element's own ground. Four defects
carry numbers: Collapsed at 3.66 on `--panel`, Flat's `--dim` at 3.88, Lumen's
Solar at 1.60 on white, and the 9.5px letter centres. Tap targets are clean on
all nine tabs.

*Detail.* The half-point type sizes. The two stray durations. The dead
`data-solid` rule. The 390 gutter.

---

## WHAT THIS BRIEF MOVES THE GRADE TO

Before: a design law that existed in eleven places, four of them stale.

After: one document, every law with the file and line that enforces it or the
gate that catches it, and eight defects named with a measurement and a move.

The eight, in the order I would take them:

1. Gate 4 failing, 3 elements at 9.5px. `head.html:1246`. Bjorn.
2. Gate 6 failing, `.kb` declared twice. `head.html:1238` and `:1250`. Bjorn.
3. Lumen's three CSS seat tokens disagree with `PAL_VIVID`. `head.html:342`. Sol.
4. Flat's `--dim` at 3.88. `head.html:401`. Sol.
5. Collapsed and Severe under 4.5 as text. `canon.js:391` and `:392`. Sol.
6. No gate watches the alarm law, which has been a defect twice. Petra.
7. The 390 gutter on `.sum-hero` and the unaffordanced tab scroller. Petra.
8. Thirty two type sizes. Architectural, and the owner's call. Bjorn.

None of them is in this file's scope to fix. All of them are in `TASKS.md`'s.
