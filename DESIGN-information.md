# THE INFORMATION SYSTEM

How this product says what it means. One layer above the tooltip.

    Read against      commit 0e63f4b, source.html md5 bc24308b
    Tree              dirty. The tooltip's migration step 1 is landed and
                      uncommitted: ui/tip.js is new, MANIFEST and head.html
                      are edited, source.html is rebuilt. Every number below
                      is read against that build, not against the commit.
    Measured with     /opt/pw-browsers/chromium-1194, 1600x1000 and 390x844
    Profiles          Lance for the walk, the six ICP entries for the session
    Prototype         proto/info/info.html, runnable, no network
    Harness           proto/info/demand.js, icp.js, coverage.js, hundred.js
    Date              2026-09-20

Built on `DESIGN-tooltip.md`, which is the component. This is the layer above
it: which question goes to which surface, and where the answer lives. Nothing
below re-does that audit. Where I checked one of its numbers I say so and I
give mine beside it.

Every number here was read off a run. The harness validates itself against
that audit before it prints anything, and where it disagrees the disagreement
is stated rather than smoothed.

---

## THE ANSWER

**Yes, and it is five lines and one attribute.** The product needs this
system, but it does not need a new mechanism, a new panel, a new table or a
new word. It needs a rule about which of the surfaces it already has answers
which of the five questions it already raises, and one attribute that carries
a name instead of a sentence.

The measurement that settles it: **637 distinct things a person can see carry
a name or a figure, and 480 of them, 75 percent, cannot be answered on a
phone.** On a desktop it is 335 of 637. That is not a tooltip problem. The
tooltip component is designed and correct. It is that 244 of those carriers
are coined vocabulary this product invented, 236 of them have no route to a
definition at all, and the definitions overwhelmingly already exist: 343 names
resolve through four tables the engine already ships.

So the content is there and the route is not. Of a hundred sampled requests,
**76 already have their answer in a table** and 24 need somebody to write
something. The system is the route.

And the route has to be a rule rather than a habit, because the alternative
has already been run and measured: eight mechanisms doing the job of one, a
ninth that is not a tooltip doing a tooltip's job, and 259 distinct sentences
living in renderer template strings where no gate can see them.

**What it costs to be wrong, saying yes.** About 4.7 kilobytes on a 1,343,839
byte build, which is 0.35 percent, 87 nanoseconds per lookup, and two changed
lines in `ui/tip.js`. If this is overhead, it is the cheapest overhead in the
repository and it deletes itself by reverting two lines.

**What it costs to be wrong, saying no.** The product ships a vocabulary of
188 coined names that a person meets in their first session and cannot look
up, and a paid tier asks them to believe a reading they cannot read. Seven of
those names are Trust, Worth, Acceptance, Vitality, Groundedness, Joy and
Readiness: the coherent opposites, which is what release installs. They are
defined nowhere in the product. A person can be told their Trust is installed
at 1.2 of 10 and there is no sentence anywhere in the file saying what Trust
is. That is the outcome of the whole instrument, undefined.

---

## THE DEMAND, MEASURED

### The Harness Validates Itself First

`proto/info/demand.js` walks the built file at both widths, with Lance loaded,
over every surface `TABDEF` and `TABEXTRA` name, and classifies every visible
carrier. Before it reports anything it re-derives the numbers
`DESIGN-tooltip.md` measured, by that audit's own definitions.

| | tooltip audit | this harness | |
|---|---|---|---|
| visible title carriers, Energetics | 89 | 89 | exact |
| Story | 198 | 198 | exact |
| Field | 98 | 98 | exact |
| Body | 94 | 94 | exact |
| Compass | 108 | 108 | exact |
| Knowledge | 93 | 93 | exact |
| Games | 93 | 93 | exact |
| Summary | 142 | 142 | exact |
| Settings | 8 | 8 | exact |
| Ritual | 89 | 93 | +4, the tree moved |
| distinct title strings | 259 | 259 | exact |
| definitions only in a title | 195 | 192 | within 2 percent |
| `aria-describedby` | 0 | 0 | exact |
| distinct `data-tip` carriers | 8 | 8 | exact |

Nine of ten exact. Ritual is +4 because Ritual changed in `840de24` and
`0e63f4b`, after that audit was written, and the +4 in title occurrences is
the whole of the +4 in the total, 1016 against 1012.

**Two corrections the validation forced, both of which would have produced a
confident wrong answer.**

The first walk scoped itself to the tab's own host element and reported **zero
title carriers on six of nine surfaces**. The left and right rails are not
inside any tab host and they carry 43 of the heaviest carriers in the product
on every tab. A walk that cannot see the rails would have concluded this
product says almost nothing. Scoped to the visible document, it reproduces the
audit exactly.

The second read "195 definitions only in a title" as a count of occurrences
and got 739. It is a count of distinct strings. Corrected, 192.

That is the tool checked against a known good case before it was believed,
which this repository asks for because it has twice had a probe report its own
bug as a defect.

### The Five Kinds

Five questions, and every carrier raises exactly one of them. The priority
order is stated and the overlaps are reported, so nothing is hidden by it.

    word      what does this word mean
    number    what is this number out of
    control   what does this control do
    reading   why does this reading say what it says
    next      what do I do now

### Per Surface

Carriers a person faces on that screen, including the shared rails, at 1600
with Lance loaded.

| surface | word | number | reading | control | next | total | no route |
|---|---|---|---|---|---|---|---|
| Energetics | 54 | 98 | 92 | 59 | 5 | 308 | 170 |
| Ritual | 26 | 56 | 92 | 31 | 4 | 209 | 71 |
| Story | 37 | 169 | 199 | 39 | 3 | 447 | 87 |
| Field | 27 | 58 | 103 | 33 | 1 | 222 | 69 |
| Body | 34 | 155 | 97 | 79 | 8 | 373 | 140 |
| Compass | 33 | 71 | 104 | 37 | 3 | 248 | 83 |
| Knowledge | 243 | 62 | 204 | 41 | 1 | 551 | 304 |
| Games | 27 | 62 | 96 | 30 | 1 | 216 | 77 |
| Summary | 78 | 137 | 114 | 53 | 8 | 390 | 146 |
| Settings | 2 | 5 | 18 | 15 | 3 | 43 | 30 |

Nine surfaces in the bar and Settings, which has no door. The rails appear on
all ten, so these do not add up to a product total and must not be summed.

### Per Kind, Across The Product

Distinct carriers, the shared chrome counted once. This is the real shape of
the demand.

| kind | distinct carriers | no route at all | no route on a phone |
|---|---|---|---|
| word | 244 | 236, 97 percent | 243, 99.6 percent |
| number | 172 | 19, 11 percent | 20, 12 percent |
| reading | 127 | 4, 3 percent | 123, 97 percent |
| control | 72 | 55, 76 percent | 72, 100 percent |
| next | 22 | 21, 95 percent | 22, 100 percent |
| **all** | **637** | **335, 53 percent** | **480, 75 percent** |

A native `title` is counted as a route on a desktop and not on a phone,
because that is what it is. It opens on hover only, cannot be styled, is
truncated by the operating system at a length the page cannot know, and is
invisible to every gate in `tests/design.js`.

Two things fall out of that table and they point in opposite directions.

**The number law is nearly done.** 152 of 172 number carriers print their
scale on the surface, with no interaction at all. Law 5 is working. The
information system should say so and add nothing there.

**The word is the hole.** 244 carriers, 236 with no route, and they are the
part a person cannot guess, because this product coined them.

### What A Phone Loses, Measured

The DOM is identical at both widths: **1,397 visible elements at 1600 and
1,397 at 390.** Nothing is hidden on a phone. What changes is that the page
becomes **11,641 pixels tall** against 1,000, the elements in the viewport
fall from 640 to 106, and `matchMedia('(pointer:coarse)')` becomes true, which
retires every hover route in the product at once.

### The Six ICPs Through A First Session

Six entries in `PEOPLE` carry `· ICP`. Each one's charge vector produces a
different reading, so each faces a different set of named things. Six stops in
the order the app moves a person through them, starting where it opens, at
390 with the onboarding sheet dismissed.

| who | named things met | unanswerable on a phone | distinct terms | in the glossary | a knowledge row |
|---|---|---|---|---|---|
| Diane, 46 | 379 | 378 | 94 | 8 | 77 |
| Derek, 39 | 437 | 436 | 105 | 8 | 86 |
| Marcus, 44 | 335 | 334 | 78 | 8 | 61 |
| Angela, 36 | 374 | 373 | 105 | 9 | 88 |
| Sofia, 41 | 387 | 386 | 120 | 9 | 103 |
| James, 57 | 436 | 435 | 98 | 9 | 80 |

Between 78 and 120 coined names each, in one session, on a phone, with
**eight or nine** of them in the glossary and no route on the surface to any
of the rest. 188 distinct names across the six.

Sofia is the somatic practitioner and she meets the most, 120, which is the
opposite of what a familiarity argument would predict. She is not confused by
them; she is the one who will notice when two of them mean the same thing.

### Where Every Name Is Defined, If Anywhere

`proto/info/coverage.js` reads the table names off the engine source, opens
**171 tables**, and looks for a description against every name the product
prints.

| kind of name | names | in GLOSS | a knowledge row | in some engine table | defined nowhere |
|---|---|---|---|---|---|
| address | 108 | 2 | 108 | 28 | 0 |
| universal law | 50 | 6 | 50 | 7 | 0 |
| glossary term | 46 | 46 | 46 | 46 | 0 |
| saboteur | 39 | 0 | 39 | 11 | 0 |
| law | 19 | 1 | 19 | 5 | 0 |
| domain | 16 | 0 | 16 | 16 | 0 |
| archetype | 12 | 0 | 12 | 3 | 0 |
| opposite | 9 | 1 | 2 | 1 | **7** |
| seat | 7 | 0 | 0 | 7 | 0 |
| fetter | 6 | 0 | 6 | 0 | 0 |
| mask | 6 | 0 | 6 | 6 | 0 |
| hyper-complex | 4 | 0 | 0 | 4 | 0 |
| **all** | **322** | **56** | **304** | **134** | **7** |

**This table is the second version and the first one was wrong.** The first
pass looked in `GLOSS` and in the knowledge rows only and reported that the
seven seats and the four hyper-complexes are defined nowhere. Both were false.
`APC` in `engine/data/catalog.js` carries 297 to 438 characters per seat and
`HCX_LIB` carries a line per hyper-complex. The probe had opened five tables
out of 171, because a `const` at the top level of a classic script does not
appear on `window` and the scan was reading `window`. A probe that looks in
two places and says "nowhere" is a probe that lies. It reads the names off the
source and resolves them by identifier now.

The corrected finding is sharper than the wrong one.

**Seven names in this product have no definition anywhere: Trust, Worth,
Acceptance, Vitality, Groundedness, Joy, Readiness.** Those are seven of the
nine coherent opposites. They are what release installs and what the ladder
counts. `runFetterDrill` prints "Trust installed 1.2" and the product has no
sentence saying what Trust is.

**And the seats are the other shape of the same defect.** All seven are
defined, well, at 297 to 438 characters each, and those definitions reach
exactly one place: `runSeatDrill`. Root is not in the glossary, is not a
knowledge row, and cannot be searched for. A definition that good, that
unreachable, is the argument for the system in one line.

### Spot Checks On The Live Build

Four things I checked rather than inherited, because they change the
arithmetic.

**1. The tooltip works on a desktop.** Hovering a `.tierow` in the right rail
on Summary opens the panel at 1272, 487, 300 by 173, titled Warrior, with the
archetype's sentence in it. The component is real and it is in the build.

**2. The migration's step 1 claim is false as landed.** `DESIGN-tooltip.md`
states that landing the module makes all 195 title definitions reachable,
because `read()` falls back to `title`. It does fall back. But `carrier()`
matches `[data-tip],[data-tip-t]` only, so a title-only element is never
recognised as a carrier and `read()` is never called on it. Measured: **280
title carriers in the document and 8 `data-tip` carriers, of which 4 have a
zero sized box.** Four carriers in the whole product open a panel. One line
fixes it and it is step 1 of my migration below.

**3. On a phone, explain and navigate are the same gesture and the wrong one
wins.** Tapping a `.tierow` at 390 on Summary: at +120ms the tab has changed
from 1 to 6 and the tip carries "Warrior An archetype. Warrior moves on the
threat". At +300ms the tip is empty. The definition arrives and is destroyed
before it can be read. This is the open question 3 in the tooltip design,
answered by measurement: a carrier that both explains and navigates must not
do both on one tap.

**4. The product says 108, twice.** On the Knowledge glossary surface, in the
`Fetter` and `Node` entries: "108 fetters in the body" and "108 physical
nodes". The standing ruling is that the count stated to users is 112. Both
entries also say 112 in the next clause, so this may be a distinction the
owner intends, but it is on screen and the ruling is absolute. Found by the
gate this system asks for, which is the point of having one.

**5. The onboarding sheet covers the rails.** On a fresh load with a profile,
`document.elementFromPoint` over a right rail row returns `DIV.ob`. Every
hover test failed until it was removed. Not mine, and not a defect in itself,
but any measurement of this product has to dismiss it first or it measures an
overlay.

### A Hundred Passes

`proto/info/hundred.js` draws a hundred real carriers out of the walk,
stratified in the measured proportion, on a fixed stride so the hundred are
the same hundred on every run, and resolves each against which table holds its
answer and which route reaches it today.

    word 38   number 27   reading 20   control 11   next 4

    the answer already exists in a table        76
    somebody has to write it                    24

    what has to be written
      a control that describes itself           11
      a coherent opposite, defined nowhere       9
      the rest                                   4

    route today
      word, none                                37 of 38
      reading, a native title                   19 of 20
      number, a scale on the surface            13 of 27
      number, a scale and a native title         8
      control, none                              9 of 11

Three quarters of the work is already done and filed. The quarter that is not
is eleven control labels and the nine coherent opposites.

---

## THE KINDS, EACH WITH ONE SOURCE OF TRUTH AND ONE SURFACE

| kind | the question | one source of truth | one surface | today |
|---|---|---|---|---|
| word | what does this word mean | `GLOSS`, then the knowledge row, then the engine table that holds it | **the tip**, short form. The tip's action line opens the drill | 236 of 244 have nothing |
| number | what is this out of | the renderer that printed the figure | **the surface**, beside the figure, no interaction. Never the tip | 152 of 172 already do this |
| control | what does this control do | its own label | **the label**. A tip only when the label physically cannot carry it | 55 of 72 have nothing |
| reading | why does this say what it says | `compute()`, and the drill that already exists | **the drill**. The tip carries one line and the door | 123 of 127 are hover only |
| next | what do I do now | the surface itself | **the control**. Never a tip | 21 of 22 have nothing |

Two of these are rulings this product already carries and the system only
states them: Law 5 owns the number, and `DESIGN.md` law 5 is explicit that
"the scale is on the screen, not in a tooltip". The other three are the work.

The resolver is one function over four tables that already exist. Measured on
the live build: **343 names resolve, 100 percent hit rate, 87 nanoseconds a
lookup.** One frame at 60 hertz holds 191,000 of them.

---

## THE RULE

Five lines. This is the deliverable.

    1  A name is glossed once, in one table, and the tip shows it.
       Nothing else may carry a definition.
    2  A number says what it is out of, on the surface. Never in the tip.
    3  A control says what it does in its own label.
       A tip only when the label cannot.
    4  A reading explains itself in its drill.
       The tip is the door to it, not a second copy of it.
    5  A name with no gloss is a defect. The gate counts them
       and the count is read off the run.

And one mechanism underneath it, which is the whole of the implementation:

    a renderer emits    data-gloss="Fear"
    it never emits      title="A named conditional response pattern..."

The name is the only thing a renderer knows. One function turns a name into
its definition. A second copy of a sentence becomes impossible rather than
discouraged, which is what "one word per concept" needs in order to be
enforceable instead of aspirational.

**Three depths are forbidden.** The tip is the short answer and the drill is
the long one. Nielsen Norman put the ceiling at two levels of disclosure and
this product has exactly two surfaces for it already.

**One mark, everywhere.** A glossed name is drawn with a dotted rule under it.
One treatment, on every surface, so a person learns once that a dotted word
answers. It survives at 11.5 pixels, it costs no layout, it needs no hover,
and it is not a badge beside every word in the product.

---

## HOW IT USES WHAT EXISTS

Nothing new that a table already holds.

**`GLOSS`, `engine/data/kb.js`.** 56 entries, 39 to 504 characters, median
213. It reaches exactly one surface: the Knowledge tab's glossary section,
where all 56 render. It becomes the first table the resolver searches and
gains nothing else.

**The knowledge rows, `ui/knowledge.js`.** `kbRows()` builds 320 rows across
twelve sections out of the engine tables, and the file's own header already
states the principle this system generalises: "Nothing here is a second copy
of the data: it reads the engine tables directly, so the knowledge base and
the reading can never disagree." That is the rule, already written, for one
surface. The system applies it to all ten.

**The drills, `ui/drills.js`.** Thirty run functions, one panel, already the
long form answer for a reading. `runSeatDrill`, `runFetterDrill`,
`runSabDrill`, `runDomDrill` and `runKbDrill` are already exactly the surface
kind 4 needs. They gain a caller: the tip's action line.

**`APC` and `HCX_LIB`.** The seat and hyper-complex definitions. Joined to the
resolver, they stop being reachable from one drill only.

**The tooltip, `ui/tip.js` and `proto/tip/`.** Unchanged in behaviour,
geometry, colour, motion or placement. Two lines:

    carrier()   also matches [data-gloss]
    read()      resolves [data-gloss] through glossOf(), one lookup

`proto/info/build.js` asserts on both targets, so if `tip.js` moves the build
fails loudly rather than producing a stale page.

**`wireKbJump`, `ui/ui.js:501`.** Its click half already jumps from a rail row
into the codex and opens the row. That is the tip's action line, already
built, already wired, on eight carriers. It becomes the generic one.

**What is retired.** Nothing extra. The tooltip design already retires the
canvas probe, the rail tooltip and the three caption slots. This system adds
no tenth mechanism, which was the first thing to check.

---

## THE COMPS, NAMED

Direct fetch is blocked by the egress proxy on this runner, so every claim
below is from the search index rather than from the page, and I mark what I
could not verify. Nothing here is a vibe; each entry is the mechanic.

**Duolingo. The mark, and it is measured.** Words carrying a dotted underline
can be tapped for a hint, and tapping one is treated as a signal that the word
was not top of mind, which feeds the scheduling. One mark, one gesture, the
same on both pointers, and the act of asking is itself the measurement. This
is the mark I have taken, and the reason I have taken a dotted rule rather
than an icon.
<https://blog.duolingo.com/duolingo-flashcards/>,
<https://duolingo.fandom.com/wiki/Exercise>,
<https://medium.com/design-bootcamp/language-learning-with-duolingo-the-interaction-and-instruction-ed5ac0029332>

**Bloomberg Terminal. One key from everywhere, two depths.** HELP on any
screen returns that screen's own documentation; HELP twice opens a message to
a person. Same route from every field in the product, and the depth is chosen
by repeating the gesture rather than by finding a different control. The two
depth ceiling, thirty years before Nielsen Norman wrote it down.
<https://guides.nyu.edu/bloombergguide/help>,
<https://manchester-uk.libanswers.com/teaching-and-learning/faq/192202>

**Stripe. One canonical glossary, referenced from everywhere.**
`docs.stripe.com/glossary` is the single reference definition for payment
terminology used throughout the documentation, and the docs are built as an
application rather than as prose. One term, one definition, one address.
<https://docs.stripe.com/glossary>, <https://docs.stripe.com/>,
<https://www.mintlify.com/blog/stripe-docs>

**GOV.UK Design System. The sanctioned alternative to a tooltip.** The Details
component is a short link that reveals more detailed help text on click, and
it is what the system recommends when there is one section of extra content.
It reflows rather than floats, works with no script, and works on touch. I
lost this for the in place route for the reason the tooltip design records at
its pass 4: opening one definition in a rail of twenty pushes nineteen rows
down. I have kept it for the drill, which is exactly what it is.
<https://design-system.service.gov.uk/components/details/>

**Material Design 3. Two tooltips, and the rich one does not hover.** Plain
tooltips are non-interactive text. Rich tooltips are persistent, carry a
subhead and up to two actions, and open **on press, not on hover**. That is
the shape of the tip with an action line, and the persistence is what makes
the action line reachable at all.
<https://m3.material.io/components/tooltips/guidelines>

**Oura. A score decomposes into named contributors.** Readiness, Sleep and
Activity are 0 to 100 and each one is made of named contributors on the same
0 to 100 scale, published, with the bands stated. Every number says what it is
out of and what it is made of, which is Law 5 and kind 4 in one move.
<https://support.ouraring.com/hc/en-us/articles/360025589793-Readiness-Score>,
<https://sahha.ai/blog/how-readiness-scores-are-calculated/>

**WCAG 1.4.13, content on hover or focus.** Additional content revealed on
hover or focus must be dismissible, hoverable and persistent. This is a
mechanical requirement and not a preference, and the tooltip design already
satisfies all three: Escape closes it, the 10 pixel gap and the 120
millisecond grace make the crossing survivable, and it stays until dismissed.
I could not open w3.org from this runner, so I am citing the criterion by
number and not quoting it.
<https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html>
(**blocked, unverified quotation**),
<https://www.wcag.com/authors/1-4-13-content-on-hover-or-focus/> (**blocked**)

**Sarah Higley, tooltips in the time of WCAG 2.1.** Do not use the `title`
attribute to make a tooltip: it is announced inconsistently by assistive
technology and is unusable on touch. Reference the tooltip from its trigger
with `aria-describedby`. And the one that bites hardest here: a tooltip should
only ever carry non-essential content, and the content should be written
assuming it may never be read.
<https://sarahmhigley.com/writing/tooltips-in-wcag-21/> (**page blocked,
claims from the search index**), <https://zoebijl.github.io/apg-tooltip/>

That last one is the sharpest objection to this whole design and it deserves a
straight answer rather than a dodge. **A definition of Trust is not
non-essential content.** If the tip were the only route it would be
disqualified on that ground. It is not: the index is a route with no hover and
no tip at all, and the drill is a surface. That is precisely why this is a
system with three routes rather than a tooltip with one.

**Nielsen Norman Group, progressive disclosure.** It improves learnability,
efficiency and error rate, and the recommendation is a maximum of two
disclosure levels for any single interaction. That is the ceiling I have taken
for the tip and the drill.
<https://www.nngroup.com/videos/progressive-disclosure/>

**Not found, and I am saying so rather than filling the gap.** I looked for a
published benchmark for how often in product help is actually opened, in
Pendo's or Appcues' own material or anywhere else, and there is none in the
index. Any number I gave you for expected open rate would be invented. The
prototype counts reads instead, which is the honest substitute and is the
Duolingo move.

---

## THE COPY RULES

A definition is written once, by one person, into one table. It is not written
in a renderer, ever.

**Length.** The short form is one or two sentences and under 220 characters,
which is the median of the 56 entries `GLOSS` already holds and is what fits
the tip's 272 pixel measure without scrolling. The long form has no ceiling
and lives in the drill, where it can scroll and carry rows.

**Person.** Third person about the thing, not second person about the reader.
"Stored survival energy held at a node", not "your stored survival energy".
The reading already speaks to the person; the definition describes the
instrument. `GLOSS` is already written this way in all 56 entries and this
rule is a description of it, not a change to it.

**Tense and mood.** Present, indicative, declarative. A definition never
instructs. If it wants to instruct, that is kind 5 and it belongs on a
control.

**What it never does.**

- Never repeats the name as the first words. "The specific location in the
  body's energetic architecture", not "An address is the specific location".
  The tip prints the name above the body already.
- Never prints a bare figure. Every number in a definition goes in the number
  slot, as label, value and denominator, and the renderer drops any entry that
  does not carry three parts. There is no way to pass a bare figure.
- Never says 108. The count stated to users is 112. Two `GLOSS` entries
  currently break this and they are named above.
- Never uses an em dash.
- Never uses soft wellness language. No journey, no holding space, no
  invitation, no honouring. Physical metaphors only, which is what the
  existing entries do: heat, pressure, weight, conduction, firing, discharge.
- Never hedges with "may" or "can be seen as". The instrument states what it
  measures. Where the claim is contested it says so outright, which `GLOSS`
  already does at `Chakra`: "Held because it is the vocabulary the work is
  done in, not because it has been measured." That is the model.
- Never defines a word with a word that is itself unglossed. The gate catches
  this by walking the definitions as well as the surfaces.

**One worked example of each kind.**

*Kind 1, word.* The name is `Trust`, one of the seven the product does not
define. Short form, for the tip:

> The coherent opposite of Fear. The state that occupies the root once the
> fear charge is discharged.

Long form, for the drill:

> The coherent opposite of Fear. What occupies the lumbar plexus once the
> survival charge has discharged. It is not a belief about safety and it is
> not optimism: it is the absence of a firing pattern at an address that used
> to fire, measured as installation rather than as mood. Release empties the
> address. Trust is what fills it.

Third person, physical, states what it is not because the wrong reading is
predictable, ends on the mechanism. 336 characters long, 108 short.

*Kind 2, number.* On the surface, beside the figure, no interaction:

> Trust installed   1.2 of 10

Not "1.2". Not "Trust 1.2". The label keeps its name, the value carries the
state, and the denominator is printed. Where a scale has no ceiling the
denominator says that in words, as `summary.js:72` already does for shadow
weight.

*Kind 3, control.* The label is the definition:

> Release this address

Not "Release" with a tip explaining what is released. Twelve of the hundred
sampled controls are icon-only and those are the only ones that earn a tip,
one line, verb first:

> Undo the last charge

*Kind 4, reading.* The tip carries one line and the door. The drill carries
the argument:

> Built from 23 held addresses across Root, Solar. It fires when those carry
> at once, and the output bends on the way out.

That sentence is `runDrill` at `ui/drills.js:44`, already written, already
correct. The work is not writing it. The work is giving it a door from the
surface that shows the reading.

*Kind 5, next.* Never a tip:

> Take the next question

A tip a person has to open to find out what to do is a product that did not
say.

---

## THE MIGRATION

By file, in an order where the product works after every step. Steps 1 and 2
are the whole of the system; everything after is content.

### Step 1. The carrier selector. One line.

    ui/tip.js, carrier()    [data-gloss] joins the selector

Nothing else changes and nothing regresses, because no renderer emits
`data-gloss` yet. This is the line that makes step 2 possible and it is
separated from it so that a bisect can tell them apart.

At the same time, and this is not mine to decide but it is in the same
function: the audit's claim that step 1 of the tooltip migration makes 195
definitions reachable is false as landed, for the same reason. If the owner
wants that claim to be true, `[title]` joins the selector too. I have not done
it, because a native title is not a definition and turning 259 of them into
product panels is a content decision, not a wiring one.

### Step 2. The resolver. One function.

    ui/tip.js, read()       resolve [data-gloss] through glossOf()
    ui/tip.js               glossOf(name), which searches, in order:
                            GLOSS, then APC, then HCX_LIB, then kbRows

Measured: 343 names, 100 percent hit rate, 87 nanoseconds a lookup. It is
built once at first call and cached.

`glossOf` cannot live in `engine/`: `kbRows()` calls `compute()` and is in
`ui/knowledge.js`, which loads after `ui/tip.js`. So the resolver builds its
index lazily on first open rather than at load, which it has to do anyway
because `kbRows` reads the current profile.

### Step 3. The mark. One CSS rule.

    shell/head.html         .g, a dotted rule under a glossed name, and the
                            44 pixel hit box with the negative margin

Measured in the prototype: the padding and negative margin give a 44 by 44 hit
box on an inline word without changing the line box. Gate 8 measures every
interactive element and a glossed word in a sentence is one.

### Step 4. The highest value renderer first.

    ui/component.js:51      cr() emits data-gloss instead of building a title
                            string. One change, 36 call sites.
    ui/component.js:153     crBadge, the same.
    ui/component.js:113     addrRow, "Open X" becomes the action line.

This is the single highest value line in the migration and it was already
identified as such by the tooltip design. It is higher value now, because the
renderer stops composing prose at all.

### Step 5. The seven that are defined nowhere.

    engine/data/canon.js    CHILD gains an opp definition per axis, or a new
                            OPPDEF keyed the way SABDEF and DOMDEF are keyed

Seven entries, short and long, 3,117 bytes as drafted in
`proto/info/info.html`. **This is the one step that is not mine to land**,
because it is new canon and canon is the owner's. The drafts are written and
they are written in the voice; they need his word, not my commit.

### Step 6. The rest of the renderers, file by file, no hurry.

    ui/ui.js, ui/summary.js, ui/drills.js, ui/cone.js, ui/panels.js,
    ui/imprints.js, ui/analytics.js, ui/record.js, ui/storyui.js,
    ui/personas.js, shell/body.html

The sites are the ones `DESIGN-tooltip.md` already lists under its step 5. The
change at each is the same change: a name replaces a sentence.

### Step 7. The gate.

    tests/design.js         gate 16. Walk every surface, collect every name
                            the engine's tables know, and assert that each one
                            visible on screen resolves through glossOf().
                            Report the failures BY NAME.

By name, not by count, because that is what `validateProfile` does at the
boundary and it is the same discipline: refuse by name, never clamp. The count
is read off the run.

The gate is also what stops this document going stale, which is the failure
`CLAUDE.md` records five times and `DESIGN.md` records a sixth.

### Step 8. The tap collision.

    the carrier that both explains and navigates

Measured above: on a phone the navigation wins in 120 milliseconds and the
definition is destroyed. The fix in the prototype is one rule: on a coarse
pointer the first tap explains and the tip's action line navigates. On a fine
pointer nothing changes, because hover already separates them. This is open
question 3 of the tooltip design and it has an answer now.

---

## WHAT IT COSTS

**Kilobytes.**

    ui/tip.js, the two changes           +1,031 bytes as prototyped,
                                         of which about 800 is comment
    glossOf and its lazy index           about  600 bytes
    the .g rule and the hit box          about  260 bytes
    the seven definitions                     3,117 bytes, drafted
    -----------------------------------------------
    total                                about 5.0 kilobytes raw

Against a build of 1,343,839 bytes, that is **0.37 percent**. For comparison,
the typeface this product embeds is about 64 kilobytes, or thirteen times the
whole system.

And there is a saving on the other side that I am not counting, because I
cannot yet measure how much of it lands: **19,602 bytes of prose currently sit
in 259 distinct title strings inside renderer template strings**, 18,810 of it
in the 203 strings of 24 characters or more. Every one of those that becomes a
name is prose that leaves a renderer. If half of them land, the system is free.

**Frames.**

Measured on the live build: `glossOf` resolves 343 names at **87 nanoseconds a
lookup**, 100 percent hit rate over 100,000 calls. One frame at 60 hertz holds
191,000 of them. A tooltip opens a few times a second at most.

The tooltip itself was already measured at **60.6 frames a second with the
panel open over the repainting Field**, which is the vsync ceiling, and this
system adds one hash lookup per open. There is nothing here to measure.

The prototype passes its own checks at both widths: panel overlaps its carrier
0, text under 11 pixels 0, interactive elements under 44 by 44 **0**, all caps
strings over six characters 0, em dashes 0, occurrences of 108 0, page errors
0.

**The work, in files changed.**

    step 1  ui/tip.js                                     1 file,  1 line
    step 2  ui/tip.js                                     1 file, ~25 lines
    step 3  shell/head.html                               1 file,  1 rule
    step 4  ui/component.js                               1 file,  3 functions,
                                                          45 call sites move
    step 5  engine/data/canon.js                          1 file,  7 entries
                                                          OWNER'S CALL
    step 6  11 renderer files                             gradual, no deadline
    step 7  tests/design.js                               1 file,  1 gate
    step 8  ui/tip.js                                     1 file,  1 branch

Steps 1, 2, 3 and 7 are the system and they are four files. Everything works
after each one.

---

## THE QUESTIONS I CANNOT ANSWER

Every team has been told to ask rather than guess. These are the ones I will
not guess at.

**1. The seven coherent opposites. Is my draft canon?** Trust, Worth,
Acceptance, Vitality, Groundedness, Joy and Readiness have no definition
anywhere in the product and they are what release installs. I have drafted all
seven, in the voice, in `proto/info/info.html`. Canon is yours. Are these
right, or do they come out of the book and I should be quoting rather than
writing?

**2. Is a hyper-complex a name a person meets?** `HCX_LIB` defines four in one
line each, and those lines are good. They reach no knowledge row and no
glossary entry. Should Grandiosity, Predatory, Dysregulation and Dissociation
be glossed for a person, or are they an internal taxonomy the surface should
not be naming at all? If the second, that is a naming problem and not an
information problem, and I would rather it went that way.

**3. The two `GLOSS` entries that say 108.** `Fetter` and `Node` both print
"108" and then "112" in the next clause, so the distinction may be deliberate:
108 physical nodes in the body, 112 addresses including the four field nodes.
The ruling as written is absolute. Do those two entries carry a stated
exception, or is the copy wrong?

**4. Does the native `title` join the carrier selector?** One line makes all
259 title strings open the product's panel on tap, on a phone, today. It is
also 259 strings that were never written as definitions being promoted to
definitions, and a tooltip design gate cannot see their quality. My instinct
is no, and to convert them one file at a time under step 6, which leaves the
native title working in the meantime. It is a content ruling, not a wiring
one. Your call.

**5. Where is the practitioner in this?** The accounts fork puts a
practitioner in front of somebody else's somatic self report. A practitioner
reading Sofia's screen meets the same 120 names, and they are a second
audience with a different prior. Do they get the same gloss, a second one, or
none because they are assumed to know? That changes whether `glossOf` needs an
audience argument, and it is much cheaper to answer now than after.

**6. Should a read be counted?** Duolingo treats tapping a hint as a signal
that the word was not known, and feeds it back. This product could do the same
with no network: which names a person looks up is the most honest map of what
the reading is failing to say. It is also behavioural data about a person's
confusion, held next to their somatic self report, and the privacy rulings
here are structural. I have built the counter in the prototype and I have not
proposed persisting it. That is a boundary question and it is not mine.

**7. `ui/tip.js` is uncommitted in the working tree.** MANIFEST, head.html and
source.html are edited and not committed. Every number in this document is
read against that build. If that work is reverted, steps 1 and 2 have nothing
to attach to and the demand table is unchanged but the route table gets worse.
Whose is it, and is it landing?

---

## THE FILES

    proto/info/info.html         the runnable prototype, three routes, both widths
    proto/info/info.src.html     its source, before the tip block is inlined
    proto/info/build.js          info.src.html + proto/tip -> info.html
    proto/info/demand.js         the walk. every carrier, classified and routed
    proto/info/report.js         pass 0, then the demand tables
    proto/info/icp.js            the six ICPs through a first session
    proto/info/coverage.js       where every name is defined, across 171 tables
    proto/info/hundred.js        the hundred passes, deterministic
    proto/info/demand.json       the walk's output
    proto/info/icp.json          the session walk's output
    proto/info/coverage.json     the coverage scan's output
    proto/info/shots.js          screenshots and the gate shaped checks
    proto/info/shot-1600-page.png        the whole page, desktop
    proto/info/shot-1600-route1.png      in place, the tip anchored
    proto/info/shot-1600-route2.png      by name, the index
    proto/info/shot-1600-route3.png      from a reading, the tip and the drill
    proto/info/shot-390-page.png         the whole page, phone
    proto/info/shot-390-route1.png       in place, the sheet
    proto/info/shot-390-route2.png       by name
    proto/info/shot-390-route3.png       from a reading
    proto/info/_verify-live-1600.png     the tip opening on the live build
    proto/info/_verify-live-390.png      the sheet on the live build
    proto/info/_verify-390-collide.png   explain and navigate on one tap

To re-run everything:

    NODE_PATH=$(npm root -g) node proto/info/demand.js
    node proto/info/report.js
    node proto/info/hundred.js
    NODE_PATH=$(npm root -g) node proto/info/icp.js
    NODE_PATH=$(npm root -g) node proto/info/coverage.js
    node proto/info/build.js
    NODE_PATH=$(npm root -g) node proto/info/shots.js

`shots.js` exits non zero on any failure, so it can go in a gate.
