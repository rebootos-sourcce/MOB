# The character sheet

His sentence, and it is a specification rather than a tagline:

> "The reality is that you're already the most powerful version of yourself.
> You're already there. It's the limiters that are inhibiting you. So we want
> to find the limiters and release the limiters."

A character sheet whose numbers go up as you earn them is every other gamified
app. A character sheet whose numbers are already high and are being held down
is this one. **The stat is the ceiling and the reading is the drag against
it**, and that inversion has to live in the arithmetic rather than in the copy,
or the page collapses back into points on the first review.

Runnable, and it needs nothing beside it:

    proto/sheet/sheet.src.html    the surface, with its three script tags
    proto/sheet/sheet.js          the ceiling arithmetic, 250 lines, no browser
    proto/sheet/build-sheet.js    -> sheet.html, one file, no siblings
    proto/sheet/shots-sheet.js    shoots and measures in the same run
    proto/sheet/probe.js          every figure in this document, regenerable
    proto/sheet/sheet.html        592 KB. Open it. It makes no request at all.

`engine.js` and `proto/avatar/rise.js` are **referenced, never copied.** Two
prototypes in this repository carried a byte identical engine and both were
fixed for the same reason: a copy goes stale in silence and the prototype then
measures a build nobody ships. The rise is read out of the dashboard's own file
so the sheet and the dashboard cannot disagree about a seat.

Read off commit `95f0736` with the tree dirty, because two other seats are
working in it. `node proto/sheet/probe.js` reproduces every number below and
exits non zero if its own self check fails.

---

## 1. Where the inversion shows up, gauge by gauge

Six gauges. Every one of them obeys the same rule: **the bar is drawn at full
length and never grows, and what is drawn inside it is the load.** Nothing on
the page fills up as a person improves. Things empty.

| Gauge | The ceiling, drawn | The reading, inside it |
|---|---|---|
| The headline | the whole bar | the count of addresses holding something, and it falls |
| The seven seats | every row the same length | the part charge is holding down, per seat |
| The figure | a ring per seat, fixed radius | the arc that conducts, and the dim arc that does not |
| The masks | the outline, drawn before anything is read | the pixels that fill as the instrument reads that era |
| An aim | the sentence the person wrote about themselves at full | the weight at the seat the bad day resolves to |
| The summary | what the seat would conduct with the charge gone | what it conducts today, and both levers priced |

**The one number a person reads first is a count of limiters and it goes
down.** Marcus arrives at 99 and a quarter of release work takes him to 31.
Gordon arrives at 107 and finishes at 28. There is no experience bar anywhere
on the page and no figure that rises as a reward.

### The three segments, and why this decomposition and not a prettier one

Every seat is cut into three parts that sum to 100, and the two cuts are the
engine's own two mechanics. `GLOSS`, under **Two mechanics**: *"(1) Release,
the charge at the address reduces; (2) Embodied Truth, the replacement state is
installed while the address is open."*

    open     what conducts today
    held     what charge is holding down          mechanic one empties this
    empty    what no opposite has filled yet      mechanic two installs this

Measured across the roster, and the sum is asserted at run time in the browser
by `shots-sheet.js` as well as here:

    name      limiters   open   held  empty   sum    seat costing most
    Marcus         99   76.9    9.1   14.0  100.0    Throat
    Diane          91   70.0   17.1   12.9  100.0    Solar
    Sofia          52   89.0    3.2    7.8  100.0    Throat
    Angela         74   85.1    4.5   10.4  100.0    Solar
    Derek          90   64.8   22.5   12.6  100.0    Solar
    James          90   63.9   23.5   12.6  100.0    Sacral
    Ana           107   53.4   33.9   12.7  100.0    Solar
    Gordon        107   38.2   46.7   15.1  100.0    Throat
    Tomas         107   40.4   44.4   15.1  100.0    Root
    Rosa            0  100.0    0.0    0.0  100.0    Root

Seven of the nine loaded profiles carry an `empty` share between 12.6 and 15.1,
which is the engine saying something the product has never drawn: **clearing
alone tops a seat out at 84.7 out of a hundred, and the last fifteen points
come only from the installed opposite.** That is the normaliser the dashboard
already flagged as his, arriving from the other direction, and here it is not a
footnote, it is a visible third of the gauge with the mechanic that fills it
named beside it.

---

## 2. The ceiling is the same for everybody, and that is the whole point

    charge 0, opposite 10, laws 10, per seat
    Root 99   Sacral 100   Solar 100   Heart 100   Throat 100   3rd Eye 100   Crown 100

The ceiling is a property of the address table and of nothing else. It does not
move on the laws: `rep` is `replace x (0.72 + 0.28 x relief)`, so even at
relief nought a fully installed opposite gives 7.2, whose pole term of 0.277
still clears the 1.18 clamp on `n.open`. So `seatFull` is computed with no
profile loaded at all and returns the same seven numbers for every person alive.

**That is his sentence, computed.** The difference between two people is
entirely drag. Nobody has a better ceiling than anybody else.

**One address caps the root under 100, and it is already on his list.**
`Root_08_Unnamed` carries no fetter, so it carries no opposite, tops out at
1.00 where every other root address reaches 1.18, and drags the root's ceiling
to 99.0. The page does not print a phantom point of drag for it: the root's bar
draws full and the address is named in the probe rather than invented into the
reading.

---

## 3. `cqCeiling` is not the ceiling, and here is the measurement

`TASKS.md` BL2 says the engine already computes the ceiling and names
`cqCeiling`. It was the first thing tried and it does not survive contact with
the roster.

    name         CQ   cqCeiling   headroom
    Marcus      39.2       39.4        0.3
    Diane       28.1       33.9        5.8
    Sofia       56.6       58.0        1.5
    Angela      40.9       41.9        1.0
    Derek       15.0       23.4        8.4
    James       12.0       18.9        6.9
    Ana          7.6       17.9       10.3
    Gordon       0.8        3.1        2.3
    Tomas        2.0        6.7        4.7
    Rosa       100.0      100.0        0.0

**Drawn as a ceiling, that tells Gordon that the most powerful version of him
reads 3.1 out of a hundred.** It tells Marcus his best possible self is three
tenths of a point away from where he is standing. Both are the opposite of the
brief.

The reason is in the engine's own body at `compute.js:263`: `cqCeiling` sets
every charge to zero and **holds the twenty one laws exactly where they are**,
and CQ is `(Intention x Integrity) / Resistance` with Integrity being the laws.
So it is the ceiling a person's current conduct allows, which is a real and
useful quantity and is not the most powerful version of anybody.

**It is worth keeping and worth showing, under its own name.** It is the honest
answer to "how much is a release worth to my coherence", which is what
`ui/release.js:100` already uses it for. The sheet prints it in the foot with
that sentence attached rather than as a headline.

**One note for the seat that just exported it.** `cqCeiling` and `cqHeadroom`
were absent from `engine/export.js` when this pass started and another seat
added them mid pass, with a comment saying cqCeiling *"is the person and the
reading is the drag against it"*. The export is right and overdue. The comment
is the premise this section measures and refuses, and it should be corrected
before anything else is built on it.

---

## 4. The hero, and what it is allowed to do

His brief: *"The hero image is a silhouette of the man with the chakra stuff."*

The silhouette is `BODYPATH` under the pain map's own transform, `PMS`, `PMTX`
and `PMTY` out of `engine/data/figure.js`, so this figure and the Body page are
one drawing seen twice and no coordinate is invented here. Measured, that
transform puts the body at x 28.5 to 71.5 and y 2 to 98 in the 100 by 100 box,
centred on exactly 50, which is where `PMBANDS` already puts the seats.

**The ring is the ceiling and it never changes size.** The arc inside it is
what conducts and a dimmer arc continuing round it is what charge is holding
down. A person cannot make the ring bigger. Ring, never fill.

**The ring radius is not `PMBANDS.r`, and that is a real finding.** Those radii
are 8 to 13 in a space where neighbouring seats sit 6.5 apart, because on the
pain map they are address scatter radii rather than drawn rings. Used directly
on a full body they overlap into one blur. They are mapped onto 2.0 to 2.9
here, which keeps their order and their relative size and keeps the largest
inside half the smallest gap. The dashboard never hit this because it stretches
its y axis and crops away the legs.

**The figure's job is where and the rows' job is how much.** No labels on the
figure, no leader lines, no nameplates to collide. The seat rows two columns
over carry the names and the numbers.

Breath is the reading and is kept identical to `proto/avatar/dash.src.html`:
period 2.0 seconds at coherence nought and 5.0 at a hundred, amplitude 0.010 to
0.030 of the radius, one seventh of a cycle of phase per seat so the root
leads. Nothing else on the figure moves.

---

## 5. The mask strip, and the argument for pixels

His words, and it is the most original thing in the message:

> "A side graphic in pixel mode, pixel art, made up of the chakra colours of
> our masks. Almost like a UI display, maybe 300 pixels. As people enter their
> story the masks begin to fill in."

### What it reads

`compute()` already returns `maskRing`: one row per mask, `w` the mean `sq`
over the addresses at that mask's seats. Nothing is invented. The fill is `w`
out of the axis clamp of ten, and the colour is whichever of the mask's seats
is carrying more, so the strip is chakra coloured because of a reading rather
than because of a swatch.

    Gordon:  Child 65 root, Preteen 54 throat, Teen 69 throat,
             Adult 53 sacral, Professional 54 throat, Ideological 42 third eye
    Marcus:  Child 11 sacral, Preteen 11 throat, Teen 13 throat,
             Adult 10 sacral, Professional 11 throat, Ideological 9 third eye
    Sofia:   Child 4, Preteen 4, Teen 7, Adult 4, Professional 4, Ideological 4

**On somebody who has written nothing, all six read nought and all six draw as
empty outlines.** That is the honest state and it is also the invitation: the
mask exists as a shape before it carries anything, and writing is what fills
it. It is the first thing in the product that visibly rewards the journal, and
it rewards it with evidence rather than with points. No figure on that strip
reads zero in type; the emptiness is the drawing.

**And the strip drains.** Gordon after a quarter of release work goes from 65,
54, 69, 53, 54, 42 to single figures. So the same graphic rewards writing by
filling and rewards releasing by emptying, which is exactly right under the
inversion: **the pixels are the limiter.** Writing makes the limiter legible.
Releasing removes it. The copy on the surface says which is which in one
sentence so that filling is never read as getting worse.

### The register change, argued

`MK12` is right that pixel art is a deliberate register change and that this
product's look is argued from autonomic response. Here is the argument.

Everything else on this screen is drawn as the body: a continuous silhouette,
anatomical coordinates, rings that breathe at the rate of a reading. **A mask
is not the body.** `GLOSS`: *"the accumulated distortion functioning as an
identity construct. What most people call their personality."* A quantised
grid at eight by eleven says constructed in the one register that cannot be
mistaken for anatomy, and it says it without a word of copy. **Coarse is made,
smooth is body.** That is semantic work, not nostalgia, and it is the only
place on the page where a second register earns its keep.

What the register change is not allowed to bring, and none of it is in the
file: no saturation lift, no outline on the pixel, no dither, no scanline, no
animation, no second palette. The colours are `PAL` at its shipped values. The
strip is the product's own palette at a lower resolution.

The shape is authored and only the fill is read. Eleven rows of a face outline,
one seam per mask taken from the differences already in `MASKS[].ic`, and the
engine decides how far up the fill reaches and what colour it is.

### The defect the strip surfaced, and it is a table defect

**Two of the six masks are one reading under two names.** `MASKS[1]` Preteen
and `MASKS[4]` Professional both carry `['Solar','Throat']`, so `w` is
identical for every profile, measured on every profile in the roster. Six
gauges of which two can never differ is a reading a person will catch. The
surface names it in a line rather than drawing over it, and the fix belongs in
`canon.js` and is not mine. Either Professional gets a seat pair of its own or
the roster is five on the surface and six in the engine.

---

## 6. His solar plexus mechanic, measured before anything was designed around it

> "If you're setting rituals for discipline, to follow through on the things
> you say you're going to do, that's power, that's solar plexus. So if a person
> is describing their lack of value or self worth or confidence or self
> respect, they're downgrading their solar plexus. So the sniffer should find
> that."

`SB14` says measure the named case first. Measured, against a control case the
repository already states the answer to.

### What his four words return today

    text                    axes          offers   laws    resolver
    "self worth"            none               0   none    null
    "confidence"            none               0   none    null
    "self respect"          none               0   none    null
    "follow through"        none               0   none    null
    "discipline"            none               0   none    null
    "i have no self worth"  none               0   none    null
    "i have no confidence"  none               0   none    null
    "i have no self respect"none               0   none    null
    "i have no discipline"  none               0   none    null

**Nought of the four words he named reaches the solar plexus. Nought of them
reaches anything at all.** They are absent from the 231 word lexicon, they
match no phrase, they trip no law cue, and `readSeat`, which is what the avatar
pair already uses at `drills.js:767`, returns null for every one of them.

### But the model underneath is already right, in three places

**One. The lexicon reaches the seat for the one word it has.**

    absent  worth            in  worthless        ["solar",26]
    absent  worthy           in  stupid           ["solar",20]
    absent  unworthy         in  inadequate       ["throat",22]
    absent  confidence       in  not good enough  ["sacral",24]
    absent  respect
    absent  discipline
    absent  value
    absent  esteem

`"i am worthless"` loads Anger 8.8, offers the Celiac Plexus and resolves to
Solar. So the mechanism works and the coverage does not. And note the second
half of that table: **the family he named is filed across three different
seats.** Worthless is solar, not good enough is sacral, inadequate is throat.
Those three are the same sentence in three registers and they should not
resolve to three seats.

**Two. The address he is describing already exists, at the seat he named, under
the right name.**

    Unworthiness at the Inferior Mesenteric Plexus, seat Solar, axis Sad

The hole is not the address, it is the routing. `"i feel stupid and worthless
when he corrects me"` resolves to Solar correctly and then names its imprints
**Pride, Arrogance, Competition and Anger**, because a solar hit infers its
addresses from the seat's dominant axis, which is Anger, and Unworthiness sits
on Sad. So a person who writes that they feel worthless is handed back
Arrogance. That is the finding with teeth, and it is a line that loses James on
pass 9 before it loses anybody else.

**Three. Follow through is already seated at the solar plexus, as a law.**

    the laws seated at Solar: Courage, Duty, Responsibility, Accountability
    Duty's cues: said i would and, let them down, did not show up,
                 broke my word, promised and, backed out, went back on

`"i said i would and i did not show up"` returns the law Duty and nothing else.
**His sentence about discipline is already in the engine and it is on the law
side, which is the right side**: discipline is conduct, conduct moves
`bandIg`, and `bandIg` is the multiplier on both mechanics at that seat. What
it is not is charge, so it moves coherence rather than the rise, which is
exactly the split `DESIGN-avatar.md` section 18 measured.

### So the finding, in one paragraph

The sniffer reads events and not traits. Every one of his four words is a
trait. Every phrasing that names a physical event in a room on a day reaches
the seat. That is the same thing `funnel/questions.js` already discovered from
the other end, where a hundred items pass every voice gate because every one of
them is an event rather than a self description. **The hole is the abstraction
layer, and it is about twenty words wide.** A worth family seated Solar,
matching worth, worthless, unworthy, confidence, respect, self respect,
esteem, discipline and follow through, plus a routing rule that sends a worth
hit to address 44 rather than to the seat's default axis, closes his own
example. That is a coverage change to a table with an owner, and it is not
mine.

**And one thing that is not a coverage fix.** `SNIFFER_SPEC.md` names Worth and
Self-respect as the coherent pole of **Shame**, whose address is the Pudendal
and whose seat in `CHG2SEAT` is **Sacral**. His sentence puts worth at the
solar plexus. The two tables disagree and the disagreement is not
resolvable by adding words. It is a ruling and it is his.

---

## 7. The two sets of stories

His brief: *"the stories of the person I want to become and the stories of the
person who I currently am. There are cells on the right of the info area to put
all this stuff in."*

**That field already exists, it already carries his own ruling, and the
inversion makes it exactly right without renaming anything.** `avatar.pairs` in
`engine/avatar.js`, with his sentence quoted in the file: *"one side is who the
person is at their best, the other is who they are not. The app never rules on
whether an attribute is a real edge or a saboteur wearing a virtue."*

    be      who you are at your best, in your own words   ->  the ceiling
    notbe   the same attribute on a bad day               ->  the limiter

Under "you are already the most powerful version of yourself", `be` is not an
aspiration, it is a statement of what is already true. `notbe` is the limiter on
it. The pair is the inversion written in the person's own words, and the field
was built for it a year before the sentence was said.

**Whether they are tags, stories or both is his, and it is already half ruled.**
The engine's own comment settles the shape without settling the scope: *"A pair
is written as a pair. The left side is a value and a value has no address. The
right side is a sentence about a bad day, and a sentence about a bad day
parses. That is why neither half is written alone."* So the left half is
tag shaped and the right half has to be a story, because the right half is the
only one that resolves. The page is built that way and shows both. What is
still open is whether the left half should become a closed field, and the cost
of that is in section 9.

**What the cells do on the page.** Two text fields and one button, the pair
resolves live through `readSeat`, and the row shows the seat, its colour and
either the weight there today or the share of that weight that has gone since
the pair was written. Marcus's second sample pair, `"I said I would and I did
not show up"`, prints **Not resolved** on the surface, which is his own
solar plexus example failing in public. That is deliberate and it should stay
in the prototype until the lexicon closes.

**The completion figure needs one stored number.** `avatarProgress` already
returns done, total and per cent, and its rule is that an aim is done when its
whole seat is clear, which is months of work, so a person sits at nought of
three for a quarter and the figure never moves. The sheet keeps that figure
under **Cleared** and adds a second one under **Released**: the share of the
weight at the aim's seat that has gone since the day the pair was written.
That needs `at` and `sq0` per pair, which is the same class of stored fact as
`meter.firsts` and `avatar.rise0`: a dated fact about a state that no longer
exists, written once and never recomputed.

    avatar.pairs[i] = { be, notbe,          /* unchanged */
                        at:   '<ISO date>', /* NEW, write once */
                        sq0:  <0 to 10> }   /* NEW, write once, null when
                                               the pair resolved to no seat */

Additive, refused by name at the boundary in the `plan.tier` style, an older
pair without them showing the weight instead of the share. No version bump
needed and none proposed.

---

## 8. The summary, and the one line that may not be faked

His four: how I am doing, what I could be doing better, where I am slipping,
what it recommends next.

    State      tierOf(r.CQ), the name, the state and the definition
    Better     the seat costing the most, how much of its ceiling is held,
               and both levers priced against each other with their cost named
    Slipping   the seat that has fallen furthest since the baseline
    Next       the heaviest address at that seat, and the shortest practice on
               the track that seat maps to

**Slipping is a comparison against a dated mark and nothing else.** With no
baseline it returns null and the surface says so. Every other product in this
category answers that question from the present tense, which is how "where you
are slipping" quietly becomes "where you are worst" and starts telling a person
they are failing at something they have never been measured on twice. It reads
against `avatar.rise0`, which `DESIGN-avatar.md` section 19 already specified
and which is still unbuilt.

**Better prices both levers and names what each one costs**, carried verbatim
from the dashboard, because a quarter of release work against one change of
conduct is not a fair race and the sentence says so rather than pretending.

---

## 9. What is his, and the cost of each way

**IJ3, tags or stories.** Both shapes are cheap to show and one is already
shown.

- *Stories on both halves*, which is what ships in the prototype. Cost: the
  left half never resolves and never has to, and free text on the left is one
  more field a practitioner grant has to reason about. Gain: a person writes
  the sentence they would actually say, and the whole product's first move is
  that a person writes something.
- *A closed field on the left.* Cost: somebody has to author the table of what
  a person may be at their best, and the one thing this product refuses to rule
  on is whether an attribute is an edge or a saboteur wearing a virtue. A
  closed list of virtues is that ruling, made by the table rather than by a
  person, and `engine/avatar.js` says in as many words that the product does
  not make it. Gain: it validates, it filters, and it can be counted across
  people.
- *Closed on the left and free on the right* is the shape the engine already
  implies and the one this seat would take if it were mine, and it is not.

**IJ1, does the intake become the journal.** Not decided here and not shown,
because it is a scope decision rather than a copy change. What the sheet needs
from whichever way it goes is one thing: the right hand half of a pair has to
reach `parseStory`, and it does whether it arrives from an intake question or
from a journal box.

---

## 10. The empty state, which is the strongest state this page has

The ruling of 19 September taught that whatever renders on the opening surface
renders to somebody who has entered nothing. On every other surface in this
product that is a constraint. Here it is the argument.

**The claim the sheet makes is true before a person types anything.** The
ceiling is already there and it is the same one everybody has. So on a field
with nothing in it the page says exactly that, draws the body, draws seven
rings at the ceiling, draws six empty masks, and draws no reading at all.

No figure reads zero anywhere. The seat rows carry a name and an empty bar. The
trend column is blank rather than seven noughts. The aim figures are absent
until a pair exists, and the released share is absent until something has
actually been released. The four doors are the `component.js:410` four,
verbatim, with the fourth one rewritten to point at the cells.

---

## 11. Measured on the delivered page

    outbound requests            0, at 1600 and at 390, on four profiles,
                                 counted by wrapping fetch, XMLHttpRequest,
                                 Image, WebSocket, EventSource and sendBeacon
                                 before any other script, and by a
                                 PerformanceObserver on every resource
    page errors                  0
    simultaneous choices         9, of which 4 are the review controls that
                                 would not ship. Five on the surface itself:
                                 two doors, two fields and one button.
    touch targets under 44       0
    open + held + empty          100.0 at every seat, asserted in the browser
                                 on every run, not only in this document
    hero redraw                  0.00 to 0.10 ms median, 0.10 ms at the 95th,
                                 against a 16.7 ms frame, over 400 to 500
                                 frames per run. Two canvases, both in the loop.
    voice gate                   no hard failures. Antithesis 0.0 per cent
                                 against a house rate of 2.8, gloss 2.6
                                 against 0.9, demonstrative opener 2.6
                                 against 2.6.
    shot at                      1600 by 1000 and 390 by 844, on Marcus,
                                 Gordon, Sofia and a first ever open, each
                                 before and after a quarter of release work

---

## 12. Record of this pass, and the four things found by running it

**The ceiling the task named is the wrong number and only the roster said so.**
`cqCeiling` looks correct in the code and gives Gordon a most powerful self of
3.1 out of a hundred. Section 3.

**The voice gate reads a pair of strings in an array literal as a figure and
its label.** The sample pairs were written as `[['Somebody who...','I sat in
the meeting...']]` and came back as eleven hard failures, each one a label nine
words long. The gate is right about the shape: that is exactly the
`['Minutes practised', l.minutes]` form V17 watches for. The table is objects
now and the run is green, and the voice seat should know that a table of
sentence pairs trips it.

**`PMBANDS.r` is not a ring radius and a full body figure is where that shows.**
At the pain map's own values the seven rings overlap into one blur, because
those radii are address scatter in a space where the seats sit 6.5 apart. The
dashboard never hit it because it stretches its y axis and crops the legs off.

**Two of the six masks are one reading under two names,** found by drawing six
gauges and looking at them rather than by reading `canon.js`. Preteen and
Professional carry the same seat pair and can never differ.

**And one thing that was checked and was fine.** The ceiling arithmetic reads
`S` and writes nothing. `probe.js` run 0 asserts that a second ceiling read
leaves `S.charge` byte identical, because two probes in this repository have
now reported a defect that was the probe's own bug.
