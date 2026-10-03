# Fetters, the fix

Dani Sorensen. UI UX architecture. Written against the owner's report that the
Fetters surface is broken.

Everything counted here was counted in a real Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, at 1600 by 1000 and again
at 390 by 844, on the build below, after the 7.5 second boot. Where I state a
number I say how I got it.

    commit   3ad7f41
    md5      b72ae57e6bf66d4fc6cd6b1db9ed8cdf  source.html
    built    ./atuned_src/BUILD.sh, 1116106 bytes, div balance 0

Build provenance, stated because it is not a clean commit. The working tree was
already dirty when I arrived: `MANIFEST`, `shell/head.html`, `ui/panels.js`,
`engine/schema.js`, `engine/export.js` and two new files, `engine/outbox.js` and
`ui/account.js`, all in-flight account work that is not mine. My build includes
them. It does not matter to anything measured here, because every file that
renders the Fetters surface is clean against the commit:

    ui/map.js  ui/mapshelf.js  ui/ui.js
    engine/compute.js  engine/data/canon.js  engine/data/people.js

The one exception is the left rail count in section 4. `ui/panels.js` is dirty
by 74 deleted lines and it builds the left rail, so treat 47 as approximate and
the centre stage figure of 104 as exact. I built and I did not commit.

I did not touch `ui/wheel.js`. The art director has Field.

---

# 1. What reproduces, and what does not

There are two things in this product a person can click that say Fetters. I
drove both. One of them is the surface he is describing.

**The one that is broken: Body, sub bar, Fetters.** `TAB.ENERGY`, `PMLAYER`
`'bands'`, rendered by `renderMap()` in `atuned_src/ui/map.js:162`. It is the
first button in the sub bar and it is the layer the surface opens on for any
profile carrying anything, so clicking Body and clicking Fetters land in the
same place.

**The one that is not: Knowledge, Fetters.** The deck at
`atuned_src/ui/knowledge.js:152`. Nine cards, each carrying the name, the seat,
the opposite, the plexus, the location and a reading. That surface answers
every question and I am leaving it alone. Screenshot held at
`21-knowledge-fetters.png` in the scratchpad.

There is also a Fetters tab inside the reading stack in the right rail,
`railStack()` at `atuned_src/ui/ui.js:342`. It is a lesser instance of the same
problem and I cover it in section 7.

## 1.1 What is on the Body Fetters surface

Measured on Gordon, 58, the most loaded profile in the roster, charge at 10 on
Fear, Anger, Shame and Disgust.

    viewport                          1600 x 1000
    figure                            920 x 831
    circles in the centre stage       300
    circles carrying a title          7
    address marks drawn               97
    address marks with a name on screen  0
    text elements on the figure       1
    words on the figure               4

The one text element reads **nothing carrying yet**.

His words were "a bunch of circles that have no information" and "there's no
text on what's going on". Both reproduce exactly. Two hundred and ninety three
of the three hundred circles carry no title, no label, no name and no number.
The four words that are on the figure are wrong, which is section 2.

## 1.2 What "so clustered" is, in numbers

Address mark diameters and the distance between their centres:

    desktop 1600 x 1000
      marks                     97
      diameter, smallest        26 px
      diameter, largest         42 px
      diameter, median          30 px
      marks under the 44 px floor   97 of 97
      pairs of marks under 44 px apart   222

    phone 390 x 844
      figure                    374 x 470
      marks                     97
      diameter, smallest        12 px
      diameter, largest         19 px
      marks under the 44 px floor   97 of 97
      pairs of marks under 44 px apart   986

Closest pair measured on desktop: Fear at 6.6 and Panic at 5.5, centres 8 px
apart, each mark 30 px across. They are not adjacent, they are on top of each
other. That is the cluster, and on a phone there are 986 such pairs.

Not one interactive element on this surface meets the 44 by 44 floor. Zero of
97.

## 1.3 What happens when you click one

This is the part of his report that reproduces with a twist, and the twist
matters because it changes the fix.

The clicks are wired. `map.js:698` binds `onclick` to every `[data-node]` and
the cursor is `pointer`. So "I can't click on anything" is not literally a dead
handler. It is worse than a dead handler. Measured, clicking the mark whose
title is "Fear · 6.6":

    centre stage markup, byte identical before and after      true
    the only thing that changed                                #eshelf
    #eshelf top, in a 1000 px viewport                         1831 px
    the detail block written by the click, its top             3238 px
    does that block name the address that was clicked          no

The handler at `map.js:698` reads `PMPICK=B2K[n.b]`. It throws the address away
and selects the address's **seat**. Then it writes a description of the Root
seat into a panel 2238 pixels below the fold. So: the click registers, the
figure does not move, the response is off screen, and when you finally scroll
to it, it is about something else.

Same for the seat cores. They are 20 px across, they are the only seven circles
with a title, and clicking one writes its detail at the same unreachable depth.

I could not use a pixel diff to prove "nothing moved", because this page
animates continuously and a control pair of screenshots taken with nothing done
between them already differs. That probe lies here. The byte comparison of
`#emap.innerHTML` is the honest measure and it is what I used. Noting it so the
next person does not repeat the mistake.

## 1.4 What does not reproduce

He said "I don't know how accurate it is". The instrument is accurate. The
addresses drawn, their SQ values and their placement are all correct against
`compute()`. Nothing here is a maths bug. Every defect in this document is a
naming, placement or threshold defect in the renderer.

---

# 2. The instrument contradicting itself, on one screen

This is the finding I would fix tonight regardless of everything else.

On the Body Fetters surface, for Gordon:

    sub bar button                  Fetters 107
    right rail, Field, Carrying     97 addresses
    address marks drawn             97
    caption on the figure           nothing carrying yet
    shelf, below the fold           Held addresses, 97 ... Possession 9.5

Four numbers for one thing, three of them different, and one line of copy
saying the answer is none. On the same 1600 pixel screen the right rail says
"Carrying, 97 addresses" and the caption under the body says "nothing carrying
yet". They are 400 pixels apart.

**Why.** `map.js:451` builds `chain` as `marks.filter(kind==='bead')`. On the
Fetters layer `pmMarks()` at `map.js:77` returns marks of kind `'node'`. There
are no beads on this layer, ever. So the caption's guard at `map.js:509`,
`!chain.length && PMLAYER==='bands'`, is unconditionally true and the empty
state prints on every profile. It is not reading charge at all.

Measured across three profiles, all three print it:

    Gordon   107 carrying   "nothing carrying yet"
    James     90 carrying   "nothing carrying. 6 addresses hold the opposite instead."
    Sofia     52 carrying   "nothing carrying. 49 addresses hold the opposite instead."

The one profile it is most damaging on is Gordon, who is on record in
`RESEARCH-icp.md` refusing the product with "there is nothing wrong with me".
The instrument currently agrees with him in writing.

**The badge is separately wrong.** `pmCount()` at `map.js:127` counts
`r.carrying`, which is every address with SQ above zero. `pmMarks()` draws
`sq >= 4 || pole >= 4`. Two different populations under one number:

    Gordon   badge 107   marks drawn 97   off by 10
    Sofia    badge  52   marks drawn 49   off by  3
    James    badge  90   marks drawn 24   off by 66

A button reading 90 above a body carrying 24 visible things is the surface
telling a person it is hiding two thirds of what it found, which is the same
complaint the saboteur layer already got and had fixed.

---

# 3. Four questions, one per circle

He asked, in substance, four things of every circle: what is it, what is the
number, where did the number come from, what do I do with it. Here is the
answer for every circle class on the surface, counted on Gordon.

| Circle | Count | What is it | The number | Where from | What you do |
|---|---|---|---|---|---|
| Seat core, `.pm-seat` | 7 | a seat | carrying count and pass percentage | `flSeats()`, map.js:67 | hover 1s for a title, or click for a panel 2238 px down |
| Address mark, `g.pm-n` | 97 | one of 112 addresses | its SQ | `compute()`, `n.sq` | click selects the wrong object |
| Domain ring, dashed | 1 to 2 | the seats a running domain owns | none | `S.doms`, map.js:409 | nothing. no title, no legend row, no handler |
| Heat bloom, blurred group | 97 | texture for a carrying address | none | `n.sq`, map.js:392 | nothing. it is atmosphere |
| Pattern mark, `.pm-it` | 0 | a saboteur or complex | weight | `pmMarks()` | not drawn on this layer |
| Aura, `.pm-aura` | 1 | radiance | none | `r.radiance` | nothing |

**Three of six classes answer none of the four.** The dashed domain ring is the
purest case and it is the one in the Marcus screenshot the owner would have
been looking at: a dashed circle 119 px across sitting on the lower abdomen,
with no title, no legend entry, no handler and nothing anywhere on the surface
that mentions it exists. It is the single most reasonable thing on the page to
point at and say "what is that".

**And the fourth question has no answer anywhere, for any circle.** The tab is
called Fetters. There are nine fetters. Not one of them is named, drawn,
numbered or reachable on this surface. The engine has the rollup and it is not
hard, I computed it in the browser in one pass:

    Gordon, by fetter, addresses carrying and mean SQ
      Anger        27 addresses   mean 5.1
      Disgust      16             mean 5.5
      Sad          13             mean 5.6
      Fear         11             mean 5.5
      Shame        11             mean 5.8
      Apathy        9             mean 6.7
      Shock         6             mean 6.6
      Anticipation  3             mean 6.0
      Surprise      1             mean 5.5

That table is the surface. It is nine rows and it is not on screen.

## 3.1 The finding, stated once

**The label promises nine and the surface delivers ninety seven.** Every other
defect on this page follows from that one. Ninety seven objects is where the
clustering comes from, where the 26 px marks come from, where the absence of
names comes from, and why the click had to be redirected to the seat: an
address is too granular to be the unit of a layer that a person opened wanting
to know what they are carrying.

This is an information architecture error wearing a rendering error's costume,
which is most of them.

---

# 4. The count

Simultaneous choices in the viewport on Body, Fetters, Gordon, 1600 by 1000.
One selector run against the live document, visible and intersecting the
viewport.

    total interactive elements in view        173
      top bar                                  15
      sub bar                                   7
      left rail                                47
      centre stage                            104
    elements under 44 x 44                    104
    of which address marks                     97

One hundred and seventy three against a working memory of about four. The
product's standing measurement is 57 to 71 per screen. **This surface is two
and a half times the worst screen already on record**, and 97 of the excess is
one decision: drawing addresses where the label says fetters.

Collapsing to nine takes the centre stage from 104 to 9 and the surface total
from 173 to 78, which puts it back inside the product's existing band without
touching a single rail.

---

# 5. The replacement

The job this screen is hired for, in the person's words: **"show me what I am
carrying and where it sits in me."** Not "list my addresses". Nobody has ever
wanted an address.

Ruling for the whole spec: **the Fetters layer draws nine objects.** Nine axes,
eighteen ends. Addresses are one step down and reached by choosing a fetter.

## 5.1 Layout, 1600 wide

Four zones, each with one job, which is the owner's standing rule about the
areas around the centre.

    sub bar     the layer picker, unchanged except the badge (5.6)
    left rail   the controls. the existing Fetters section with its eighteen
                sliders already lives here and stays
    centre      the figure, nine marks, nine names
    right rail  the ledger. nine rows, above the fold. this is new and it is
                the fix for the shelf sitting at 1831 px

**The centre.** The same silhouette. Nine marks, one per fetter, each placed at
its own seat from `CHILD[].seat`. Three seats carry two fetters and take a
small horizontal offset, left and right of the spine, and that is the entire
placement problem. `pmNode()`'s hash scatter, which is what produces the
cluster, is not used on this layer at all.

Each mark:

    form           a ring. icons are ring, not fill
    size           44 px diameter minimum, fixed. weight is carried by the
                   ring's stroke width, not its diameter, which is already the
                   settled house pattern for a pattern mark at map.js:648
    glyph          the fetter's own mark, CHILD[].ic. nine of them exist in
                   canon.js and nothing on this surface draws one. a named
                   thing wears its own mark
    colour         the seat colour, PMC[seat]
    the second end the opposite, drawn as a second arc inside the ring, its
                   sweep set by S.replace. one mark, two ends, visibly
    the name       printed beside the mark, always. not on hover
    the number     the held value, beside the name

Nine names on a body is not the gutter that was correctly removed at
`map.js:436`. The gutter was up to twenty four address names with curves back
to seats. Nine is under the working memory limit twice over and it is the
vocabulary of the product.

**The right rail ledger, above the fold.** Nine rows, one per fetter, each 44 px
tall, which is 396 px plus a header. It fits above 1000 px with room. Each row:

    glyph   name   held   opposite   addresses

Sorted by held, descending. The row is a button. Hovering it lights its mark on
the figure, clicking it selects.

The existing `#eshelf` keeps everything it has and moves below this. Nothing is
deleted; the ledger is the thing that was missing above the fold.

**The header, one line, above the figure.** The heaviest fetter, named, with
the one cost sentence the engine already computes and currently buries in
`renderShelf()`:

    Anger, heaviest. 27 addresses. Flow stops at the sacral, 35 percent through.

That is what a stranger reads in four seconds. One object, not nine.

## 5.2 What a click does

Clicking a mark, or its ledger row, selects that fetter. Nothing navigates
away.

    the figure     the chosen mark grows its ring, the other eight drop to
                   0.5 opacity and keep their names
    inside it      the addresses under that fetter appear as small dots at
                   their seat, count named beside them. this is where the 27
                   go, one level down, after being asked for
    the right rail the ledger's chosen row expands in place into the card

The card carries what `CHILD` already holds and what the shelf already
computes, and it owes all three things a label owes:

    Anger                                    the name
    toward Equanimity                        the direction
    Celiac plexus, upper abdomen             the definition, where it lives
    held 8.0   opposite 0.0                  the two ends
    27 addresses, heaviest Blame at 8.4      the behaviour
    [ Open the drill ]                       one action

`runFetterDrill()` already exists at `atuned_src/ui/drills.js:357` and is
reachable today only from the Knowledge deck. That is the reason to come back,
and it is already built.

Clicking a selected fetter clears the selection. Clicking the figure background
clears it. There is no All button to hunt for, which matches the ruling already
applied to the pain regions.

## 5.3 What a hover does

Emphasis and nothing else. The mark and its ledger row light together, both
directions. **No information is carried by hover only**, because a phone has no
hover and this surface has to work identically at 390. Everything currently
reachable only through an SVG `<title>` on a 26 px circle is either printed or
gone.

## 5.4 Empty states, and there are two

The product currently says one thing to both and it is wrong for each.

**Nothing entered.** A stranger who has typed nothing. Draw all nine marks as
open rings at 0.35, names at full weight, values blank. The person meets the
nine words on their first visit, which is recognition over recall and is the
one thing this surface can do for a level 4 or 5 buyer who does not have the
vocabulary yet. One line:

    Nine axes, nothing entered yet. Write what happened and this fills in.

and the door to Story, which is a 44 px button and the only control on the
surface.

**Nothing carrying.** Rosa at level 10 and Lance both read here. Their fields
are genuinely clear and that is the product's best outcome, not a failure. Nine
marks drawn as closed rings in the opposite's treatment, names as the opposite:

    Fear, clear. Trust in at 9.0.

One line: `nothing carrying. nine axes clear.` No "yet". For Rosa there is no
yet and the word is the instrument being wrong about her.

This split is the fix for the caption bug in section 2 and it is the same one
condition in one place.

## 5.5 Phone, 390 by 844

Nine 44 px marks do not fit on a 374 by 470 figure without touching. So at 390
the figure is the picture and the ledger is the control.

    0 to 44       sub bar, horizontal scroll, already 44 px and already correct
    44 to 92      the header line, the heaviest fetter
    92 to 412     the figure, 320 tall, nine marks at 30 px with no names
    412 to 844    the ledger, nine rows at 44 px, names and numbers, scrolls

Tapping a ledger row selects, and the selected mark on the figure grows to 44
and takes its name. Tapping a mark is allowed and hits the nearest of nine,
which at nine objects is unambiguous. Nothing on the phone is reachable only by
touching the figure.

`#eshelf` stays below the ledger. It currently sits at 4241 px on a phone, which
is five screens down, and nothing above it tells you it is there.

## 5.6 The badge

A count under a word counts that word. The layer names nine things, so the
badge counts how many of the nine are carrying above the line.

    Gordon   9
    James    6
    Sofia    3
    Rosa     0

That is `nFettersWithAny` and I measured it in the browser against all three.
No count against a total, which is the standing ruling. The address count keeps
existing and moves into the fetter card, where it is labelled and belongs.

## 5.7 What comes off the surface

    the dashed domain ring     it is a domain, not a fetter, and it answers
                               none of the four questions. it belongs on
                               Compass. remove from this layer
    the heat bloom texture     keep, it is the field and it reads correctly
                               under nine marks where it could not under 97
    the hash scatter           pmNode() is not called on this layer any more
    the seat cores             keep, and raise the hit area to 44 while the
                               drawn core stays 20. a target is not a drawing

---

# 6. Ten passes with the ICPs

He asked for ten and then a thousand. **I ran ten.** Ten considered passes that
each changed something beat a thousand claimed ones, and a fabricated
simulation count is worse than none. So: ten, each one named, each one driven
by a specific ICP's recorded charge vector, `says` line and level on the
`BUYERS.md` grid, and each one changed the spec above. The spec in section 5 is
the output of pass 10, not of pass 1.

Roster and levels from `RESEARCH-icp.md` and `atuned_src/engine/data/people.js`.
Every reaction below is simulated. Nobody said any of this.

**Pass 1. Marcus, 44, creative director. Level 7.** v1 was nine named rings on
the body and nothing else. He gets four seconds and uses them. Stop: "Nine
rings and nine words. Where is the number. If I have to hover a circle to find
out how much I am carrying, I have already closed it."
*Changed:* the held value prints beside every name. Nothing on this surface is
hover only. That rule came from here and it held for the other nine passes.

**Pass 2. Sofia, 41, somatic practitioner. Level 8 to 9.** Three fetters
carrying, 49 addresses holding the opposite. v2 drew three marks and six
nothings. Stop: "Six of mine are blank and it looks broken the same way it did
before. Clear is not nothing. Clear is the thing I have worked four years for."
*Changed:* both poles always drawn. Nine marks, always, on every profile. A
clear fetter is a closed ring carrying its opposite's name and value. This is
what made the two empty states in 5.4 separate rather than one.

**Pass 3. Angela, 36, seeker, six modalities. Level 5, the hardest sell.**
Stop, at second one: "What is a fetter. I have done six modalities and nobody
used that word. There is nothing on this page that tells me."
*Changed:* the definition line comes onto the surface, once, in the header.
`railStack()` at `ui.js:379` already writes exactly this sentence for the right
rail and it is the right sentence. Port it, do not rewrite it. One word per
concept across both surfaces: held and opposite, in both places.

**Pass 4. Derek, 39, high performer. Level 7.** Stop: "I do not want a picture
of a body. I want what it costs me. Tell me what this is taking off the top."
*Changed:* the header line carries throughput and where it stops, not just the
heaviest name. `renderShelf()` already computes "stops at the sacral, 35 percent
through" and buries it at 1831 px. It moves into the one line above the figure.

**Pass 5. James, 57, C-suite. Level 8.** Stop: "I have seen this screen. What
has changed since last time. A number with no direction is a number I cannot
act on."
*Changed:* every ledger row gets a direction mark against the previous reading,
and the ledger can sort by movement. This is the third thing a label owes and
it is missing everywhere on this surface today. It is the one item in this
document that needs storage the product does not have yet, so it is sized L and
it is honest about depending on the record fetch at sign in.

**Pass 6. Diane, 46, founder. Level 6 to 7.** Anticipation at 8 held,
Apathy at 9.2 installed. Stop: "My highest held and my highest installed are
two different axes and the screen treats them the same. Which one is the
finding."
*Changed:* the ledger carries both columns on every row, held and opposite, and
the sort is on held with the opposite visible beside it. Two ends, two numbers,
one row. The header names the heaviest held, because that is the question the
surface was opened with.

**Pass 7. Gordon, 58, managing partner. Level 1 to 2, refuses.** Stop, and it
is the hardest one in this document: "There is nothing wrong with me." He opens
to a body covered in 97 marks, a wash of heat across his whole torso, and a
caption that currently says nothing is carrying.
*Changed:* two things. The caption bug is fixed for everybody, and it matters
most here, because the instrument currently contradicts itself in writing on
the one profile that is looking for a reason to leave. And the surface opens on
throughput rather than on damage: the header line states where flow stops, the
nine rings carry their weight in stroke, and the heat wash is behind a control
he can turn on rather than the first thing he sees. `BUYERS.md` says level 1 is
0 percent and says not to chase him. I am not chasing him. I am declining to
have the instrument be wrong at him.

**Pass 8. Ana, 47, teacher, one year out. Level 4, in it now.** "I cannot see
the far side of it." Stop: nine objects with no order is nine decisions, and
she does not have nine decisions in her.
*Changed:* one is named first. The header names the heaviest fetter and only
that one, and the other eight are present, quiet and one glance away. That takes
the first read from nine simultaneous choices to one, which is the difference
between the surface being usable at level 4 and not.

**Pass 9. Rosa, 61, retired midwife. Level 10, carries nothing.** Stop: "It
looks like it did not work."
*Changed:* the two empty states split for good, and the word "yet" comes out of
the one that is not waiting for anything. Her reading is the product's best
outcome and it must not be drawn as an absence.

**Pass 10. Marcus again, re-test.** Five people surface about 85 percent and
the sixth through fifteenth mostly confirm, so the tenth pass is a re-run rather
than a tenth voice. He confirms 1 through 9 and finds one thing left: "What is
the dashed circle."
*Changed:* the domain ring comes off this layer. It answers none of the four
questions, it is not a fetter, and a mark that cannot be named does not get to
sit on the body. It goes to Compass, where a domain belongs.

## 6.1 What ten passes did not settle

Angela at level 5 and Ana at level 4 are the largest population and the hardest
sell, and this surface is now legible to both. It is not persuasive to either.
That is a funnel problem, not a Body problem, and nothing in this document
touches it. Saying so here so the next round does not read a fixed surface as a
fixed funnel.

---

# 7. The other Fetters, in the right rail

`railStack()`, `atuned_src/ui/ui.js:342`, tab `'fet'`. Measured on a loaded
profile:

    rows                                9
    rows that are clickable             0
    row height                         44 px, correct
    top of #stack, 1600 x 1000       1358 px
    top of #stack, 390 x 844         3368 px

Every other layer in that stack renders `<button class="stk-r">`. Fetters alone
renders `<div class="stk-r static">`. So the one tab that opens by default is
the one tab where nothing is a door, on both viewports, and it sits below the
fold on both.

This is the same finding at a smaller scale and it takes the same fix: a row is
a door to the drill, `runFetterDrill()` is already written, and the nine rows
should be buttons like the other four layers' rows are. Sized S.

Its copy is right and should be the source for the Body header, which is what
pass 3 concluded. It is the only place in the product that says what held and
opposite mean in a sentence a person can read without a tooltip.

---

# 8. Build order

Sized by me, against this codebase, not against a generic one.

## S, and I would ship these first

    S1  the caption. map.js:509. the guard reads chain.length, which is
        structurally always zero on this layer. read carrying instead, and
        split the two empty states from 5.4. one condition, one place.
        this is the instrument contradicting itself and it is one line.

    S2  the badge. pmCount() map.js:127, the 'bands' branch. count the nine,
        not the 112. removes the 90 against 24 mismatch on James.

    S3  the dashed domain ring. map.js:409. remove from this layer.

    S4  the stack rows. ui.js:390. div.static becomes button, wired to
        runFetterDrill(), the same way the other four layers already are.

    S5  the seat core hit area. 20 px drawn, 44 px target.

## M

    M1  nine marks instead of ninety seven. pmMarks() map.js:77, the 'bands'
        branch returns nine objects built from CHILD with the per fetter
        rollup. pmNode()'s scatter is not called on this layer. this is the
        one that takes the centre stage from 104 choices to 9.

    M2  the mark itself. ring, fixed 44, weight in the stroke, CHILD[].ic as
        the glyph, the opposite as a second arc, name and value printed.
        the pattern is already written at map.js:648 and is ported, not
        reinvented.

    M3  the ledger, above the fold, right rail. nine rows, both ends, sorted
        by held. #eshelf keeps everything and moves below it.

    M4  the header line. heaviest fetter, plus the stop and the throughput
        that renderShelf() already computes.

    M5  select a fetter. the card, the addresses appearing one level down,
        the drill button. fix map.js:698 so the click keeps the object it
        was given instead of substituting the seat.

    M6  the phone layout, 5.5. figure above, ledger below, nothing reachable
        only by touching the figure.

## L

    L1  direction since the last reading, pass 5. needs a stored previous
        reading. it belongs with the record fetch at sign in and should not
        be faked from local storage in the meantime.

## What to instrument, so the next round can tell whether this worked

Four numbers, and the first three are countable by the existing gates.

    1  interactive elements in view on this surface. now 173. target under 80.
    2  interactive elements under 44 x 44. now 104. target 0.
    3  pairs of marks under 44 px apart. now 222 desktop, 986 phone. target 0.
    4  named objects on the figure. now 0. target 9.

`tests/collide.js` already asserts no overlapping nameplates and is green,
which tells you it is not watching this surface. Nine named marks is the first
thing on this layer it could actually check, so extend it rather than write a
new gate.

---

# 9. Grade

**Now: D.**

Not a C minus. The standing review gave the product a C minus with the note
that none of its blockers were architectural. This one is. The label promises
nine and the surface delivers ninety seven, and everything else on the page
follows from that: the clustering, the 26 px targets, the missing names, the
redirected click. On top of it sits an empty state that fires unconditionally
and tells the most loaded person in the roster that he is carrying nothing,
which is the one claim this product cannot get wrong and it gets it wrong on
every profile.

Against that: the arithmetic is right, the figure is beautiful, the heat wash is
correctly built, the drill it needs to reach already exists, and every piece of
data the replacement needs is already computed. Nothing in section 5 needs a new
number from the engine. That is why it is a D and not an F.

**Ceiling: A minus, same as the product.**

    S1 alone                         D        ->  D plus
    S1 to S5                         D plus   ->  C
    M1, M2                           C        ->  C plus
    M3, M4, M5                       C plus   ->  B
    M6                               B        ->  B plus
    L1                               B plus   ->  A minus

It caps at A minus for the same reason the product does. Angela at level 5 and
Ana at level 4 are the largest population and the hardest sell, and a legible
surface is not a persuasive one. That is not fixable here.
