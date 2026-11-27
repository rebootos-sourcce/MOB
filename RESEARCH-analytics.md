# Analytics, what is on screen and what is missing

Two questions from the owner, answered against the code, then a research pass
on display forms this tab does not have.

Method note. The audit is read off `atuned_src/`, not `source.html`, and every
claim carries a file and line. The research half used web search. Direct page
fetches were blocked by the network egress proxy in this environment, so the
sources below are cited by URL and summarised from search results rather than
quoted from the page. Where a claim matters to a recommendation it is marked as
needing the paper read before anything is built on it.

---

## 1. What the Analytics tab displays today

Entry point `anaRender()`, `atuned_src/ui/analytics.js:78`. Eight distinct
displays, six of them the same bubble field with different data.

**1. The coherence ring.** `analytics.js:87`. `cr(r.darkB, r.CQ, {size:'lg',
label:'coherence'})`. The ring fill is CQ as a fraction of 100 and the centre
prints `Math.round(p)+'%'` (`ui/component.js:28`). Colour is the heaviest seat.
Tier word beside it, `analytics.js:88`.

**2. The hero sentence.** `analytics.js:89` to `:93`. Four clauses, each
conditional: the highest weighted pattern across character layers, hypers,
complexes and saboteurs; the seat where flow stops, from `flSeats()`
(`ui/map.js:29`); the count of addresses carrying with the DQ figure; and the CQ
delta against the previous snapshot.

**3 to 8. Six packed circle fields**, `analytics.js:95` to `:113`, all through
`anaField()` (`:47`) and `anaPack()` (`:13`). Radius goes as the square root of
the value against the largest value in that field, budgeted to 46 percent of the
box (`:20` to `:25`). Each has a title, a subtitle, a hover `<title>` carrying
name and value to one decimal (`:59`), and a value printed inside the circle
only when the radius clears 26px (`:74`).

  - **Masks**, `:95`. Six. Value is `m.w`, the mean SQ across the seats that
    mask speaks from (`engine/compute.js:108` to `:111`).
  - **Domains**, `:98`. Value is a constant: `9` for a domain the person runs,
    `2` for one they do not. Not a measurement. See the defects list.
  - **Archetypes**, `:102`. Twelve. Value is `max(0.4, aff*10)` where `r.aff` is
    the normalised twelve vector from `affinity()`. Gold for the primary.
  - **What is running**, `:105`. First sixteen of the concatenated character
    layers, hypers, complexes and saboteurs, sorted by weight. Colour encodes
    tier, or the alarm colour when overshot.
  - **The nine axes**, `:108`. Value is `S.charge[c.nm]`, floored at 0.3.
  - **The seven seats**, `:111`. Value is `s.hot`, a count of held addresses at
    that seat, floored at 0.3.

**9. The twenty one laws.** `analytics.js:115` to `:125`. One vertical bar per
law, height `v/10*60` px, seat colour, three letter label, greyed and red
labelled when below 4. Header counts how many are shut. A sentence names them.

**10. The session strip.** `analytics.js:126` to `:133`, only when there are two
or more snapshots. One bar per snapshot in time order, height `cq/100*50` px,
colour the darkest seat, hover title carrying CQ and seat. Caption states that
height is CQ and colour is the darkest seat.

**11. The measured law caveat.** `analytics.js:134` to `:139`. Counts laws with
a stored answer and says plainly that unmeasured laws sit at the default 6 and
flatter the score. This is the most honest sentence on the tab.

**12. The record.** `analytics.js:142` renders `<div id="rec">`, filled by
`recRender()` (`ui/record.js:47`). Inside it: a clickable snapshot strip with A
and B markers (`record.js:66` to `:73`), the two timestamps and the gap
(`:75`), a lead figure for ground opened all time with a personal estimate and
a plus or minus (`:80` to `:85`), ten A against B against move rows (`:89` to
`:98`), and a closing sentence naming what moved between the two and stating
that what moved it is not in this record (`:104` to `:107`).

**13. The drill panel.** `#rdrill`, shared with the Field tab
(`shell/body.html:107`), filled by `anaDrill()` (`analytics.js:151`). Six
branches: domain, chain, axis, seat, archetype, mask. Each prints a heading, a
prose paragraph, a list of contributing addresses through `addrRow()`
(`ui/component.js:50`), and for four of the six a block of story excerpts that
landed on those seats (`analytics.js:168` to `:173`).

What is **not** on this tab: the accuracy figure and its interval. `accuracy()`
returns `{pct, band, ...}` (`engine/compute.js:176` to `:199`) and
`renderAcc()` paints it with the words "plus or minus" (`ui/personas.js:112` to
`:123`), into `#acc`, which lives in the Field tab rail
(`shell/body.html:79`) and is called only from `render()` (`ui/ui.js:293`).
`anaRender()` never calls it.

---

## 2. Claim one: "we're not showing what the percent is of 100"

**Answer: mostly true. One number carries a denominator. Every other number on
the tab is bare.**

CQ is the exception. `cr()` appends a percent sign (`ui/component.js:28`), so
the reader is told it is out of a hundred. Even that is loose: a percent is a
share of something, and CQ is not a share. It is `(It*Ig)/Rz` clamped to 0 to
100 (`engine/compute.js:136`), a ratio that happens to top out at 100 when all
twenty one laws read 10. Nothing on screen says what it is a hundredth of.

Every metric on the tab, its real range, and whether the tab states it:

| Shown | Where | Actual range | Range stated on this tab |
| --- | --- | --- | --- |
| CQ, coherence | `analytics.js:87` | 0 to 100 (`compute.js:136`) | Implied by the percent sign only |
| CQ delta since last session | `analytics.js:93` | -100 to +100 | No. No interval either |
| DQ, shadow weight | `analytics.js:92`, `record.js:90` | 0 to 10.8. `DQraw` sums `sq/10` over addresses with `sq>=4`, each capped at 1, across 108 somatic rows (`compute.js:123`) | No |
| Mask load | `analytics.js:96` | 0 to 10, mean SQ over the mask's seats (`compute.js:110`) | No |
| Domain size | `analytics.js:99` to `:101` | Not a range. Literal 9 or 2 | No, and the encoding is not a magnitude at all |
| Archetype affinity | `analytics.js:104` | `aff` is a normalised 12 vector, printed as `aff*10` | No. The share exists, and is shown one level down at `analytics.js:227` as a percent |
| Pattern weight | `analytics.js:107` | 0 to 10, mean SQ or mean JQ across parts (`compute.js:80`, `:84`) | No. The subtitle explains colour, not size |
| Axis charge | `analytics.js:109` | 0 to 10 (`ui/ui.js:110`) | No. Stated elsewhere, `ui/drills.js:171` |
| Seat load | `analytics.js:112` | A count, 0 to that seat's address total | No. The drill states "x of y" at `analytics.js:214` |
| Law value | `analytics.js:120` | 0 to 10 (`engine/data`, `S.law`) | No. Bar height is correctly scaled to 10, title prints the bare number |
| Session bar | `analytics.js:131` | Height is `cq/100*50` px | Caption says height is CQ. No 100 line is drawn |
| Ground opened | `record.js:81` | A count, open ended | **Yes.** It is the one figure with a denominator and an interval, both |
| Segment depth, SQ | `record.js:91` | 0, or 4 to 10. `loaded` requires `sq>=4` and `SQm` is the mean over `loaded` (`compute.js:63`, `:65`), so nothing between 0 and 4 can ever be expressed | No, and it is printed to two decimals as though continuous |
| Opposite installed, pole | `record.js:92` | 0 to 10, mean `n.pole` over the 108 somatic rows (`compute.js:117`) | No |
| Jouissance | `record.js:93` | 0 to 10, mean `n.jq` over the same rows (`compute.js:118`) | No |
| Five counts: addresses, saboteurs, complexes, hypers, character | `record.js:94` to `:98` | Counts, no fixed ceiling | No, correctly. A count against a census is the thing the product already refuses (`ui/ui.js:194`) |
| Accuracy and its interval | Not on this tab | 8.3 to 99, with a band (`compute.js:197`) | Absent from Analytics entirely |

Six defects found while checking the ranges. Each is small, each is a lie about
scale, and each is separable from anything recommended below.

1. **Domain bubbles size by membership, not magnitude.** `analytics.js:99` to
   `:101` passes `v:9` for a domain the person runs and `v:2` for one they do
   not. The module's own header comment says "Size is magnitude, colour is seat
   or tier. The biggest circle is the biggest thing" (`analytics.js:3`). In this
   one panel the biggest circle is only a selected one, and all selected ones
   are the same size. The panel also truncates: there are nineteen domains and
   it shows the selected ones plus `.slice(0,9)` of the rest.
2. **"What is running" silently truncates to sixteen.** `analytics.js:106`,
   `.slice(0,16)`. No caption says so, and `r.sabs` alone routinely exceeds
   that.
3. **The pole range is documented wrong.** `ui/drills.js:178` says the pole is
   "0 to 1 averaged across the nine". `compute.js:117` is
   `W.reduce((a,n)=>a+n.pole,0)/108` and `n.pole` is `clamp(rep-held,0,10)`
   (`compute.js:57`). It is a 0 to 10 quantity averaged over the somatic
   addresses, not a 0 to 1 quantity averaged over the nine axes.
4. **The DQ drill copy is stale.** `ui/drills.js:166` says "CQ divides by 1 plus
   DQ". `compute.js:134` is `Rz=Math.max(1,(1+DQraw*0.05)*_vf)`. The coefficient
   and the gate factor are both missing from the sentence.
5. **A term that can never saturate.** `compute.js:140` and `:148` both use
   `clamp(DQraw/14,0,1)`, but DQ cannot exceed 10.8, so that term tops out at
   0.77. Vitality and drag are both computed against a ceiling the field cannot
   reach.
6. **A ring that reads as a percentage carrying a 0 to 10 number.**
   `ui/component.js:43` to `:45`: `crNode` fills the ring to `n.sq*10` and
   prints `n.sq.toFixed(1)` in the centre. Every address row in every Analytics
   drill uses it, through `addrRow` (`analytics.js:166`). A person reading a
   ring 62 percent full with "6.2" in it has to work out for themselves which
   of the two is the scale.

---

## 3. Claim two: "we're not atomizing the analytics yet"

**Answer: partly built, and the part that is built is one level deep with no way
back. Click for information exists. F and B do not exist anywhere on this tab.**

The owner's own ruling says the same thing: `DECISIONS.md:148` to `:152`,
"Analytics atomises the same way. Click for information. F to move into what
drives the thing under the pointer. B to come back out. Not built."

Evidence, point by point.

**Click for information: built.** `analytics.js:145` to `:148` wires every
`[data-ab]` group to toggle `ANA_PICK` and call `anaDrill()`. `anaDrill()`
(`:151` to `:243`) handles all six bubble kinds and opens the shared drill panel
through `rdOpen()` (`ui/drills.js:8`). `TASKS.md:64` already records this
correction: the bubbles are clickable, so the question was never whether the
click works.

**F to move into what is under the pointer: not built.** There is exactly one
`keydown` listener that does anything with F, `ui/ui.js:92`, and its first line
is `if(S.tab!==TAB.FIELD)return;` (`ui.js:93`). No key press does anything at
all on the Analytics tab. A grep for `keydown` across `atuned_src/` returns two
hits: that one, and a slider's arrow keys at `ui/panels.js:38`.

Worth saying plainly, because the ruling describes a mechanism the wheel does
not have either. On the Field tab, **scroll** moves in (`ui.js:87` to `:91`,
`setZoom` at `:80`) and **F reframes**, meaning it snaps zoom back to 1 and pan
to 0, which is moving out, not in (`ui.js:97`). The product's own status string
says so: "Scroll on the wheel to move in, F to come back" (`ui.js:101`). So if
Analytics is to atomise "the same way", the key that exists today is the way
back out, and the way in has no key at all. That has to be settled before
anything is built: either F means in and a new key means out, which contradicts
the wheel, or the wheel's convention is kept and the way in is a click.

**The thing under the pointer: no such concept on this tab.** The Field tab
tracks a hover through `hitTest` and `S.hover` (`ui.js:111` to `:120`) and
paints a probe. Analytics hover is a native SVG `<title>` element
(`analytics.js:59`). The browser draws the tooltip; no JavaScript ever learns
where the pointer is. A key press on this tab has nothing to act on.

**B to come back out: not built, and the data structure forbids it.**
`ANA_PICK` is a single `{k, nm}` pair (`analytics.js:8`, set at `:147`). It is a
slot, not a path. There is nowhere to record where the person came from, so
there is nothing for B to pop. The only exit is the Close button
(`analytics.js:240` to `:243`) which sets `ANA_PICK=null` and returns to the top
in one step.

**And the second level, where it exists, destroys the first.** Each drill branch
ends in address rows through `addrRow`, which are wired by a delegated handler
at `ui/ui.js:341` to `:350`. That handler calls `runNodeDrill(n)` and, at
`ui.js:349`, explicitly clears `ANA_PICK` with a comment explaining why: leaving
it set caused a render to paint the old drill back over the new one. So the
second click does open a deeper reading, and in doing so it forgets the mask or
the seat the person opened it from. Going back one level is not possible, because
one level back no longer exists.

The whole gap is one missing data structure and one missing key handler. A stack
of picks instead of a slot, a breadcrumb rendered from the stack, a key that
pushes and a key that pops, and the existing six drill branches become the
levels of a hierarchy rather than six terminal leaves. That is Shneiderman's
overview, zoom and filter, details on demand, which is the received frame for
exactly this
(https://jtr13.github.io/cc21/ben-shneidermans-visualization-mantra.html,
http://www.ifp.illinois.edu/nabhcs/abstracts/shneiderman.html). The
mantra is the reason the request is sound and not a preference: the tab
currently gives an overview and details on demand with no zoom in between, and
no way back up the path.

---

## 4. What the rules rule out, before any chart is proposed

Two constraints kill most of the standard repertoire, so they are stated first.

**A reading is not a score.** `ui/ui.js:194` to `:196` records the ruling:
"18 of 112 held" was cut everywhere because a count against a total reads as a
test rather than a mirror. Read precisely, this forbids a **count against a
census**. It does not forbid a unit, and it does not forbid a share of a
normalised composition: the product already prints "benign 62 percent,
malignant 38 percent" as percentages of one field (`ui/ui.js:207` to `:216`)
and "34 percent outward" on the balance strip (`ui/ui.js:188`). So stating that
charge runs 0 to 10 is not a score, and neither is saying an archetype is 14
percent of a normalised twelve vector. Printing "41 of 112 addresses held" is.
Every recommendation below is checked against that line.

**No causation.** `record.js:107` ends the record with "What moved them is not
in this record", and `record.js:62` to `:64` states that charge moves with how a
story was worded so a lighter number is not on its own evidence of anything.
This rules out any display whose read is "X caused Y": no before and after pairs
framed as an intervention result, no arrows from a practice to a delta.

A third constraint, from the UX skill. "Explain the AI's reasoning has no AI to
explain. The equivalent duty here is the accuracy percentage and its interval,
which already state how much the instrument actually knows. Do not weaken that
to look confident." That is a standing instruction to put uncertainty on screen,
not a licence to consider it optional.

---

## 5. Research: how this problem is handled elsewhere

### The honesty problem with a derived score

The wearables industry is the closest analogue and it is a cautionary case, not
a model. A 2025 review of composite health scores in consumer wearables found
that readiness, recovery and strain scores are algorithm derived approximations
built from proprietary weightings, that no manufacturer discloses the algorithm
or the relative weights, and that two devices can differ by twenty points on the
same night
(https://www.degruyterbrill.com/document/doi/10.1515/teb-2025-0001/html?lang=en).
Oura's own documentation describes seven contributors summing to the Readiness
score without publishing the weights
(https://support.ouraring.com/hc/en-us/articles/360025589793-Readiness-Score,
https://sahha.ai/blog/how-readiness-scores-are-calculated/). This product is
already ahead of that bar in one specific way, `compute()` is readable and the
formula is stated in the drills, and behind it in another, the weights that
matter to a person are not visible on the tab where they read the score.

Apple's Vitals is the strongest consumer precedent that survives this product's
rules, because it refuses to produce a score at all. It builds a personal
typical range from about a week of the person's own nights and then labels each
metric "typical" or "outlier" against that range, a you to you comparison rather
than a comparison against a population
(https://support.apple.com/en-us/120142,
https://www.xda-developers.com/guide-to-the-vitals-app-in-watchos-11/). Note
what it does with multiplicity: a notification fires only when two or more
metrics fall outside their ranges at once, which is a deliberate guard against
reading a single fluctuation as a change.

The measurement literature gives the arithmetic behind that guard. On patient
reported outcome measures, individual level change scores are unreliable and are
susceptible to appearing by chance even when the person has not changed, and the
recommendation is that a change be required to exceed what measurement error
alone could produce, via a reliable change index, before it is called a change
(https://pubmed.ncbi.nlm.nih.gov/39340723/,
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11599412/,
https://www.jospt.org/doi/10.2519/jospt.2021.10836). Single case design practice
says the same in visual terms: judgments of change are most error prone when
there is baseline trend or high baseline variability, so level, trend,
variability and consistency are read together and never level alone
(https://link.springer.com/article/10.3758/s13428-022-01858-9,
https://www.sciencedirect.com/science/article/abs/pii/S0022440511000999). Both
should be read properly before the threshold in recommendation 2 is set.

On the display of an interval itself: a study of five formats with clinical
practitioners found quantile dotplots most accurate for assessing measurement
uncertainty, and found that although error bars and confidence intervals were
preferred for familiarity, responses revealed misconceptions that make them
questionable for the purpose
(https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10623599/). The broader review
literature reports that among distributional displays, the ones with frequency
framing, quantile dotplots and hypothetical outcome plots, outperform the others
(http://space.ucmerced.edu/Downloads/publications/Uncertainty_Visualization_Padilla_Kay_Hullman_2022.pdf,
https://dl.acm.org/doi/10.1145/3173574.3173718). General guidance is to reserve
error bars for audiences fluent in statistics and use scenario based or visual
property cues for everyone else
(https://arxiv.org/pdf/2210.12220).

The most directly useful technique found is value suppressing uncertainty
palettes. A VSUP allocates a large range of a visual channel to the value when
uncertainty is low and a small range when it is high, so uncertain values
retreat into a confidence fog while certain ones stay prominent, and a
crowdsourced evaluation showed it makes people weight uncertainty more heavily
in decisions (https://dl.acm.org/doi/10.1145/3173574.3174216,
https://www.domoritz.de/papers/2018-VSUPs-CHI.pdf). This is a colour rule, not a
chart, so it costs almost nothing in a single file and it applies to every
bubble already on the tab.

### The display forms

**Sparklines.** Tufte's definition is data intense, design simple, word sized
graphics, with a data ink ratio of 1 and therefore no frame, no tick marks and
no axis furniture; scale comes from numbers printed on or beside the line
(https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/,
https://en.wikipedia.org/wiki/Sparkline). The relevant caution is the flip side
of the same property: with no axis, a sparkline is only honest if the number and
its range sit next to it, which is precisely the discipline this tab currently
lacks.

**Small multiples.** The same chart repeated over slices, which shows many
variables without one overloaded chart, and shifts the reader's effort from
learning how the chart works to reading what the data says
(https://www.juiceanalytics.com/writing/better-know-visualization-small-multiples).
For nine axes on a shared 0 to 10 scale this is the textbook case.

**Slope charts and dumbbell plots.** A slope chart emphasises direction and
steepness between two points, a dumbbell emphasises the size of the gap, and
both are for exactly two values per category; with three or more, use a slope
chart over time or small multiples
(https://www.domo.com/learn/charts/slope-chart,
https://www.domo.com/learn/charts/dumbbell-plot-chart,
https://en.wikipedia.org/wiki/Slope_chart). The record already compares exactly
two snapshots, so both forms fit the data as it stands.

**Lasagne and sequence index plots.** For categorical variables measured
repeatedly, a lasagne plot uses one column per interval with colour for the
category, so a change of colour is a transition
(https://bmcmedresmethodol.biomedcentral.com/articles/10.1186/1471-2288-14-32).
Sequence index plots are strong at identifying common sequences and transitions
but overplot past roughly two hundred sequences, which is irrelevant here since
there is one person (https://arxiv.org/pdf/2604.23834).

**Ridgeline plots.** A distribution per group, aligned on a shared horizontal
scale with slight overlap (https://www.data-to-viz.com/graph/ridgeline.html).
Needs a distribution per group, which this instrument does not have until there
are many sessions.

**Calendar heatmaps.** One square per day, a year at a glance, no stats page to
dig through (https://habitheat.com/heatmap-habit-tracker/,
https://inithabits.com/blog/github-style-habit-tracker). Note what the
advocates actually claim for it: it manages the psychology of a broken streak.
That is an adherence device, not a reading.

**Waterfall charts** decompose a total into the increments and decrements that
produced it, instead of hiding behind one number
(https://en.wikipedia.org/wiki/Waterfall_chart,
https://chartengine.io/waterfall-chart/). The form assumes the composition is
additive. CQ is not: it is a product over a quotient (`compute.js:136`). So the
idea transfers and the chart does not.

**And a finding against the tab as built.** Position judgments beat length, and
length beats area; the exponent for perceived area is roughly 0.7, so encoding
values as areas leads readers to systematically underestimate them, and two
circles can feel similar when one is four times the quantity
(https://en.wikipedia.org/wiki/Stevens%27s_power_law,
https://medium.com/@patwardhanj/how-humans-see-quantity-the-perceptual-limits-of-size-in-data-visualization-cf67bf973890).
The six bubble fields put the worst channel on the most important comparison.
The module's comment at `analytics.js:4` to `:6` says line charts answered
nothing about a single session and packed circles are what one snapshot looks
like, and that judgment about a single snapshot stands. But it is an argument
for a field being the right shape, not for area being a readable number, and it
is why every recommendation below prints the value rather than relying on the
circle.

---

## 6. Ranked recommendations

Ranked by value per unit of build cost, with the two rules applied to each.

### 1. Put the scale on the number. No new chart.
**Question answered:** what is this figure out of.
**Why this data:** nine of the eleven metrics on the tab are bounded 0 to 10 or
0 to 100 and the bound is nowhere on screen. This is the owner's complaint
exactly, and it is a copy change, not a visualisation change.
**Form:** a unit after the value wherever the value is printed. Charge and
weight and law and mask read `6.2 of 10`. DQ states its ceiling once in the hero
sentence. The seat bubbles print `4 of 16 held`, which is a count against that
seat's own addresses and not against the census, so it survives the ruling. Fix
the six defects in section 2 at the same time, since four of them are the same
edit.
**Survives the rules:** yes. A range is a unit, not a grade. The one to watch is
the seat count, which must stay local to the seat.
**Cost:** small. Copy in `analytics.js:92` to `:121`, `record.js:89` to `:98`,
one edit each to `drills.js:166` and `:178`, one decision about `crNode`
(`component.js:43`). No new geometry.

### 2. Bring the accuracy interval onto this tab, and hold every delta against it.
**Question answered:** is this number worth reading, and is that movement a
movement.
**Why this data:** the engine already computes the band (`compute.js:197`), the
UX skill names it as this product's substitute for explaining a model, and the
tab that exists to show numbers is the one place it is missing. The record
already refuses to claim causation; this extends the same honesty to magnitude.
Call `renderAcc`'s data from `anaRender` rather than duplicating it.
**Form:** the figure with its plus or minus beside the coherence ring. Then, in
the record, a delta smaller than the interval renders as "inside the interval"
rather than as an up or down. `recRow` (`record.js:38` to `:45`) already has the
shape for this: it prints `level` when the difference is below display
precision, so the change is to raise that floor from display precision to the
measured interval, per metric. Do not invent the per metric thresholds. Derive
them, and read the reliable change index sources first.
**Survives the rules:** yes, and it strengthens both. It is the opposite of a
causal claim.
**Cost:** small for the figure, medium for the thresholds, because the threshold
per metric needs deriving and testing. The display half can ship first.

### 3. Show the three terms of CQ, with the arithmetic printed.
**Question answered:** what is making coherence the number it is.
**Why this data:** CQ is the headline on two tabs and is `(It*Ig)/Rz`
(`compute.js:136`). Its three terms are already computed, already bounded 0 to
10, 0 to 10 and 1 upward, and are exactly what "atomizing the score" means. The
waterfall literature is right about the need and wrong about the form here,
because the composition is multiplicative.
**Form:** three labelled bars on a shared 0 to 10 scale for intention and
integrity, resistance shown as the divisor it is, and the arithmetic printed as
one line underneath. Then the two subtractions that already sit inside integrity
made visible, since `Ig` is law mean plus pole times 0.30 minus JQ times 0.42
(`compute.js:120`), which is the only place the product currently tells a person
that overshoot costs them.
**Survives the rules:** yes. It is decomposition, not causation, and no count is
set against a census.
**Cost:** small to medium. Three bars and a caption, no new maths. The caption
is the hard part and it is copy.

### 4. Share per composition, archetypes first.
**Question answered:** how much of this person is each archetype, each mask,
each root.
**Why this data:** `r.aff` is already normalised, so the share is division by
nothing. Already logged as `TASKS.md:31` and second in the owner's own order
(`FEEDBACK-alexander.md:101`).
**Form:** the percent printed in or beside each bubble, and the field sorted so
the ranking is readable without comparing areas. Archetypes only, first. Masks
and seats are not normalised compositions, so the same treatment there would be
inventing a denominator.
**Survives the rules:** yes for archetypes, because a normalised vector's share
is not a count against a census. No for anything where the denominator has to be
manufactured.
**Cost:** small. The drill already prints it (`analytics.js:227`).

### 5. Small multiple sparklines, one per axis, over the record.
**Question answered:** what actually moved, rather than what the composite says
moved.
**Why this data:** nine axes on one shared bounded scale, one value per snapshot,
is the case small multiples exist for. It also answers a real hazard: CQ can be
flat while several axes move in opposite directions, and today nothing on the
tab would show that. Snapshots do not carry per axis charge yet, so `snapshot()`
(`engine/schema.js:75`) would need nine numbers added, which is additive and
loads under v1.
**Form:** nine cells, each a polyline on a shared 0 to 10 vertical scale, the
current value printed beside it per Tufte, no axis furniture, no tooltip needed.
Irregular session spacing must be handled honestly: plot against time, not
against index, or the line implies a rhythm the person did not have.
**Survives the rules:** yes, if no line is labelled as a result of anything.
**Cost:** small in the UI, nine SVG polylines and no library. One additive
schema change, one migration path for old snapshots that lack the fields, which
`validateProfile` already handles by filling from the blank.

### 6. A state strip for the categorical readings.
**Question answered:** how often does the reading change its mind.
**Why this data:** tier, heaviest seat and primary archetype are categories, and
a category either held or it did not. No arithmetic, therefore no drift, which
is the record's own stated test for what it is willing to lead with
(`record.js:11` to `:16`). The record already computes the transitions in prose
at `record.js:101` to `:103` and throws the sequence away.
**Form:** a lasagne strip, three rows, one column per snapshot, colour for the
category. Transitions read as colour changes. It sits directly under the
existing session strip and uses the same columns.
**Survives the rules:** yes, and better than most. It states what was, not what
caused what.
**Cost:** small. The data is in `CURP.history` already (`record.js:101`).

### 7. Uncertainty suppression on the bubble fills.
**Question answered:** how much should I trust this field.
**Why this data:** the accuracy band is already computed, the fields already
encode value in opacity (`analytics.js:61`), and the VSUP result is that people
weight uncertainty more when the palette carries it. It is the cheapest way to
make a low evidence profile look like one.
**Form:** desaturate toward grey as the band widens, globally per field, not per
bubble, because the band is a property of the whole reading. Caption it once in
plain words.
**Survives the rules:** yes. It is the muted palette argument applied to
confidence.
**Cost:** small, one function between the value and the fill. Requires one
ruling: a greyed field must not read as a disabled control.

### 8. A slopegraph for the A to B comparison.
**Question answered:** which axes crossed which, between two snapshots.
**Why this data:** the record compares exactly two snapshots, which is what a
slopegraph is for, and it uses position rather than area. It should **replace**
part of the ten row table rather than sit beside it, otherwise it adds a panel
and says nothing new.
**Survives the rules:** yes, provided the two snapshots are not framed as before
and after an intervention.
**Cost:** small. Blocked behind recommendation 5's schema change, since per axis
values are what make it worth drawing.

### 9. Reconsider area as the primary channel.
**Question answered:** which of these is actually bigger.
**Why this data:** area is the weakest channel available and the tab uses it six
times on its most important comparisons. The counter argument in the module
header is real: a field of circles is what one snapshot looks like, and a line
chart answered nothing. The resolution is not to delete the fields. It is to
stop asking them to carry precision: print the value, sort the field, and put
any comparison that has to be exact into a ranked row list instead.
**Survives the rules:** yes.
**Cost:** medium, and it costs the tab its signature look, which is why it is
ranked below cheaper fixes that remove most of the harm.

### 10. Calendar heatmap of sessions.
**Question answered:** did the person show up.
**Why this data:** it barely does. It answers adherence, not reading, and the
case made for it in practice is streak management. The UX skill's own note on
intrinsic against extrinsic motivation applies, and the accountability
notification work is where this belongs if anywhere.
**Survives the rules:** technically yes, no total and no causation.
**Cost:** small to build, and a rank this low because cheap is not a reason.

### Rejected outright

- **Ridgeline plots.** One value per axis per snapshot is not a distribution.
  There is nothing to show until the session count is large, and by then
  recommendation 5 already answers the question.
- **Hypothetical outcome plots.** Best in class for uncertainty on the evidence,
  and wrong here: they are animated, the product has a motion sensitivity
  toggle, and there is no sampling distribution to animate. The band is an error
  estimate, not a posterior.
- **Dumbbell plots as an addition.** Same two numbers the record rows already
  print. Only defensible as a replacement, which makes it part of
  recommendation 8 rather than its own item.
- **Anything that prints a count against the census of addresses.** Already
  ruled (`ui/ui.js:194`).
- **A gauge, a dial, or a letter grade for CQ.** The tier word already carries
  the qualitative read and a second qualitative encoding of the same number is
  duplication that invites the reading of a grade.

---

## 7. Sources

Uncertainty and derived scores

- https://dl.acm.org/doi/10.1145/3173574.3174216 and https://www.domoritz.de/papers/2018-VSUPs-CHI.pdf, value suppressing uncertainty palettes, Correll, Moritz and Heer, CHI 2018
- http://space.ucmerced.edu/Downloads/publications/Uncertainty_Visualization_Padilla_Kay_Hullman_2022.pdf, uncertainty visualisation review
- https://dl.acm.org/doi/10.1145/3173574.3173718, quantile dotplots and CDFs improve transit decisions
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10623599/, five score report formats tested with clinicians
- https://arxiv.org/pdf/2210.12220, visualising uncertainty in clinical machine learning
- https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1464348/full, whether uncertainty visualisation affects decisions

Composite scores in consumer products

- https://www.degruyterbrill.com/document/doi/10.1515/teb-2025-0001/html?lang=en, evaluation of composite health scores in consumer wearables
- https://support.ouraring.com/hc/en-us/articles/360025589793-Readiness-Score and https://ouraring.com/blog/readiness-score/, Oura's contributors
- https://sahha.ai/blog/how-readiness-scores-are-calculated/, input counts by vendor and the unpublished formulae
- https://support.apple.com/en-us/120142 and https://www.xda-developers.com/guide-to-the-vitals-app-in-watchos-11/, Apple Vitals, typical range and outlier instead of a score

Change that is not a change

- https://pubmed.ncbi.nlm.nih.gov/39340723/ and https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11599412/, reliable change index as a lower bound on meaningful change
- https://www.jospt.org/doi/10.2519/jospt.2021.10836, limitations of patient reported outcome measures
- https://link.springer.com/article/10.3758/s13428-022-01858-9 and https://www.sciencedirect.com/science/article/abs/pii/S0022440511000999, baseline stability and baseline trend in single case designs

Display forms

- https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/ and https://en.wikipedia.org/wiki/Sparkline, sparklines
- https://www.juiceanalytics.com/writing/better-know-visualization-small-multiples, small multiples
- https://www.domo.com/learn/charts/slope-chart and https://en.wikipedia.org/wiki/Slope_chart, slope charts
- https://www.domo.com/learn/charts/dumbbell-plot-chart, dumbbell plots
- https://bmcmedresmethodol.biomedcentral.com/articles/10.1186/1471-2288-14-32, lasagne plots for categorical longitudinal data
- https://arxiv.org/pdf/2604.23834, sequence methods for ordinal repeated measures
- https://www.data-to-viz.com/graph/ridgeline.html, ridgeline plots
- https://en.wikipedia.org/wiki/Waterfall_chart and https://chartengine.io/waterfall-chart/, waterfall decomposition
- https://habitheat.com/heatmap-habit-tracker/ and https://inithabits.com/blog/github-style-habit-tracker, calendar heatmaps for self tracking

Perception and interaction

- https://en.wikipedia.org/wiki/Stevens%27s_power_law and https://medium.com/@patwardhanj/how-humans-see-quantity-the-perceptual-limits-of-size-in-data-visualization-cf67bf973890, area is the weakest channel
- https://jtr13.github.io/cc21/ben-shneidermans-visualization-mantra.html and http://www.ifp.illinois.edu/nabhcs/abstracts/shneiderman.html, overview first, zoom and filter, details on demand
