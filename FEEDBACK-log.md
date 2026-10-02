# Feedback log

One entry per piece of feedback that changed the product. Newest first.
Source is who said it. Change is what moved, with the commit. Open means
it is recorded and not yet built. This is the record the owner asked for
once the product started taking user data: what was said, what was done,
what it cost.

Format:

    date · source · surface
    said: what they said, close to verbatim
    read: what we took it to mean
    change: what moved, commit, or open
    measure: the number that moved, if one did

The 26 September entries were graduated from `TASKS.md` DG to FO on his
order of 27 September (FO). Each names the lettered round that holds the full
record. The rulings behind them are in `DECISIONS.md`, and the measurements
in `STABILITY.md`.

## 2026-09-26 · owner · Field, the second scare, and the punch list

said: I shouldn't see text when I'm zoomed all the way out; text only fades
in when I'm zooming in. Orientation and balance, those two elements need to
be designed the same way, it's the same mechanic. Where are my animations?
Why aren't they like lines animating to show me which is the tension?
read: four rulings in direction, on the build he had just found and liked
("zoom in, zoom out, reframe, that's cool"). FJ.
change: open. Dispatched to design and build.

said: If it's in the blocks, fix it. If we haven't opened tasks, queue it up.
change: a standing rule, `DECISIONS.md`, "Working rules from the night". FJ.

## 2026-09-26 · owner · Field rail

said: everything should start on. We don't need SQ in the upper left nav,
SQ is a total sum of the DQ anyway. Keep Accuracy in that menu, just make
sure there's just two rows. I want to be able to close up that column.
Change the word spirit to energy. I want to see the animations on these.
Where are my three styles, on my right hand side overlay. Root energetics,
start closed. Shrink the Jung icons.
read: eight items, and FA confirmed "the three styles" are Wheel, Frames and
Dial, opposite the overlay. EZ, FA.
change: all eight, commit 248e5d2. FE.
measure: archetype grid 4 by 3 to 6 by 2. Functional 1074 to 1088.

## 2026-09-26 · owner · boot

said: very cool animation. Ease in and out to perfection that you can feel.
The solid bars come in one at a time. Breath, the outside rings I like.
Ember, the secondary lines, those are pretty cool. The one I like needs
thicker bands, with better timing.
read: the original arrival as the base, with Breath's travelling ring and
Ember's address ticks. EV, EZ, FA.
change: ported, commits 4c0e533 and 0736da2. FC. Two timing bugs under it
closed, found in ET: the fade had never once played.
measure: fade 5.00 to 5.24s and plays. Design gate 150 to 158 with eight new
boot checks.

## 2026-09-26 · owner · Field glass bar

said: it's glass, like Apple glass, it floats over the design and it can turn
everything on and off. I don't want that secondary navigation. A circle with
the icon inside, the percent ring around it, a pill to the lower right.
Wheel, Frames, Dial, just the icon, on the right. Frames flush, no bevel.
Zoom in and out, hit F to reframe. CQ bigger, lined up with DQ.
read: the depth words out, a glass toggle bar in, the reading chips as
circles in the left rail. DK, DR, DY, ER.
change: prototyped (DO, DV, ED), then ported, commit 8b2c3c0. EY. EV
records that this was reported done while it was true only of the
prototype, and that the gap was ours.
measure: functional 1052 to 1074, 22 new checks on real wheel, drag and key.

## 2026-09-26 · owner · icons and colour

said: I need icons for Architect, Engine, Weaver, Witness. The icons are a
little dull, punch them up. Option recommended, let's go with B. The glyphs
could be smaller, they're hover over anyway.
read: the four root marks, option B, archetypes in their seat colour, tiles
at the tap floor. DR, DX, DY, EA.
change: commit 3824c63 (EF), routed through every lighting at 2f563ab (EM)
and a21e7c2 (EW).
measure: tiles 48.4 to 44 pixels, 54 pixels of rail recovered. Snow root
names 2.41 to 4.97 against a 4.5 floor.

## 2026-09-26 · owner · ritual

said: zero is flowing, one two three impaired, four five six median, seven
eight nine heavy, ten is blocked or collapsed.
read: BO7's threshold, on his own scale. DY.
change: heavy at DQ 70, median at 40, commit 3824c63. EF.
measure: reference profiles locked to entry practices, 9 of 14 to 0 of 14.

## 2026-09-26 · owner · Field clicks

said: I've got domains active, and I'm clicking on it, and I'm getting
nothing in the information panel. I click on Magician, I get nothing.
read: a domain, a mask and an archetype on the Field opened no drill. DY.
change: commit 0d5fb9c. EE. Lines that cannot be selected and Frames and
Dial not animating were checked and found not to be regressions; both open.

## 2026-09-26 · owner · Compass and Body page

said: two precise specs, the Compass switch over the axis names at 390, and
the Body page's Glass white palette. EO, EP.
change: Compass, commit 255cef4 (ES); Body page, commit a21e7c2 (EW).
measure: a new collide check that failed fourteen times before the fix. Body
page seat rings on Glass white from 1.60 against a 3 floor.

## 2026-09-26 · owner · birth

said: Option three, that gives us the most robust answer. I need Los
Angeles, I don't need San Diego and San Francisco. I don't want to build
something that weighs more than the software we're building.
read: a named time zone with daylight saving computed, and one point per
zone for Rising. DI, DN.
change: commits 45f7203 (DL) and 2f60b02 (DS).
measure: Auckland births at 08:00 over four years, moon wrong on 349 of 1460
days before, zero printed wrong after. Packed build plus 8,840 bytes for the
whole zone table.

## 2026-09-26 · owner · foundation

said: is all foundation done, all database done, all schemas done, have you
gone through it and reviewed it a couple times.
read: a review, not a sign off. It found two routes that lost a person's own
data. DG.
change: both closed, commit 9a5fe14. DH.
measure: 7.24 units committed, 0.00 on disk after one visit, before; 7.24
through every step and a reload, after.

## 2026-09-17 · owner · Field stage

said: display information over the main feature is bad design, shrink it.
read: the key card covered the wheel.
change: key is a strip in flow above the canvas, one ring and one word per
element, each a door to the reading. Canvas is measured, not the stage.
measure: key 288px card over the wheel to a 46px strip above it. Overlap 0.

said: I cannot see the six arrows, the orb renders over them, they are too
short, they should have the word and the percent.
read: the gates were drawn but not legible.
change: arrows begin outside the halo, run toward the laws by share, carry
word and percent, and are clickable. Gate drill on the right.
measure: arrow length 0.4 core radii minimum to 1.45 minimum, label on all six.

said: punch up the saturation about 20% on the main graphic.
change: body.punch canvas#cv filter saturate(1.2).

said: the slider on the right needs to be meaningful, if I press it it does
not say anything.
change: the compass is a button, opens the tier ladder and the swing.

said: I like the one with the blue.
read: the relational Punch, chrome derived from the heaviest seat, holds.
change: kept.

said: are there small things to make the wheel look alive.
change: open. Art director proposing three tied to real quantities.

## 2026-09-17 · owner · gates and rail, second pass

said: give the action direction symbolic icons, name on hover, percent
pill at the lower right, a ring that matches the percent, click for the
information. The arrow is too long. I do not like text hovering over
things unless I can read it.
change: six ring icons on short stems, ring closes by share, pill at the
lower right, glyph per gate, name and sentence on hover, drill on click.
No text drawn over the wheel.

said: the reading should be a snapshot, then tabs under it where I select
fetters, complexes, hyper complexes, both halves of every pole.
change: stack tabs under the reading, every row shows held and installed.

said: the lines that cross, if I select one does it saturate more.
change: selected chain rises above rest in alpha and width, the rest fall.

said: put balance on the left, masculine or feminine lean.
change: open. No such measure exists in the engine. Needs a definition.

said: leaderboard markers on the compass, Musashi and Buddha at the top,
Moloch and Lucifer at the bottom, tiny symbols, name on hover.
change: open. No reference figures exist in the data. Needs their positions.

said: Field, Firing, Compounding, Everything need to be more meaningful.
change: open. Proposal made, ruling pending.

## 2026-09-17 · owner · save

said: none. Found by the systems scan.
read: the store was assigned, not bound, so no save ever wrote.
change: bound through bindStore, gate saves, reloads, reads back. 246.

## 2026-09-17 · owner · right rail

said: whatever I select I want the parent and the children, what is running
it, how it runs, the opposite, and the imprints sorted by that thing.
change: open. Selection model being specified.

said: I want to click Weaver, Architect and get definitions and behavioural
information on the right.
change: open. Definition door inventory in progress.

## 2026-09-17 · owner · counts

said: every time you add that 11 of 12, why.
read: a count against a total reads as a score. A reading is not a score.
change: nine count lines cut. Two survive, intake progress and release queue
position, because those are a finite list the person is working through.
rule: never print a count against a total unless the person is working
through a finite list and the number tells them how much is left.

## 2026-09-17 · owner · type

said: I do not like that font, give me something else.
read: IBM Plex Mono in the numerals.
change: Plex Mono removed, Lexend carries the digits. Canvas text too.

## 2026-09-17 · owner · drill headers

said: Address 007 root, where in your programming are you adding that.
read: the node serial leaked into a header meant for a person.
change: drill and map shelf headers show the seat name.

## 2026-09-17 · owner · theme

said: everything is relational, the harmonics, the colours, the chakras,
the stories. This look does not fit that.
read: Punch was a skin. Gold was the one colour with no seat behind it.
change: render() sets the heaviest seat and its charge on the body. Punch
redefines gold as that seat and tints the shell by the charge.

## 2026-09-17 · owner · saboteurs

said: give the Positive Intelligence saboteurs their respect, mark them.
The inferred list is tagged as inferred and named appropriately.
change: SAB_PI marks the ten. Inferred clusters take an agent noun for their
fetter, Root Flincher, Diffuse Recoiler, and carry the inferred label.
open: the owner has not seen the nouns yet.

## 2026-09-20 · owner · the mark

said: the squiggle is a loop, like this, without those bars on the left and
right. Very cute, golden ratio design, very tiny, and pure gold. And then:
it is called awareness, lowercase.
read: D13 closes. The soul shape was never a squiggly Q and it is in the
repository after all, at index.html:8936, which I had told him it was not.
change: tools/awareness.js generates it from the ratio and a measured brush.
The name soul is gone from the tooling and the presentation.

## 2026-09-20 · owner · the golden ratio and Zen

said: take the art director, have him look at the golden ratio and how it is
used in design, and Japanese Zen design aesthetics, all the details, the
structure of it, balance, austerity, simplicity, shape. Apply those rules.
read: the mark needed a second pass against a body of rules rather than
against my own eye.
change: reviews/AD-golden-zen.md, 1,299 lines with sources. Five of its
findings verified against the running generator and fixed, the worst being
that the stroke never crossed itself and that EYE was a phi shaped expression
that cancels to plain R.
open: the constants it prescribed were rejected after rendering them. Every
ratio exact, and what they drew was a fat letter P. The defect list was right
and the prescription was not. That is now the standing rule for this kind of
report: verify each finding, render each prescription, and keep them separate.

## 2026-09-20 · owner · the API keys

said: I owe you the eleven labs voice font and the Claude key. Are there any
spiritual type API keys that are free, or do we not need that stuff.
read: a straight question about the architecture, and the answer was no.
change: nothing built. Recorded on the list that neither key may be pasted
anywhere until the server exists, because a key inside a one file build is a
key every person who opens it can read and spend. And no spiritual service is
needed at all: the ephemeris is already arithmetic in engine/astro.js and
engine/birth.js, and a service would carry birth date, time and place off the
device, which is the most identifying record in the profile.

## 2026-09-20 · owner · the process

said: your first order as a business when I add things is to make sure it gets
onto the task list, and as you go through, just check it off. Every round the
project manager is checking the task list for what needs to go in the next
block.
read: I had three competing ledgers, which is the thing TASKS.md's own
preamble says must not exist.
change: CHECKLIST.md and OUTSTANDING.md folded into TASKS.md. One list, with
checkboxes, read at the top of every round. It paid on the first use: Ritual
was on it as open and was already built.

## 2026-10-01 · owner · the Compass in the Field's language

said: I want the UI UX team to have the compass overlays in the same design
aesthetic as body and field. And then the panels on the left and right of the
compass. Um, I want the center left, right of that render pane.
read: the overlays are text pills where the Field and the Body draw glass
circles, and the eight character names stand over the canvas's own edges. The
second sentence has more than one reading, so the page is built on one and the
other two are drawn for him to choose between.
change: the overlays are the glass bar's circles, the characters are two glass
panels beside the render pane, and the figure keeps the pane to itself. See
TASKS.md round OJ and mockups/compass-overlays/.

## 2026-10-02 · owner · unpack every symbol

said: "I need text depth added. The blueprint you were born on reads Earth, which
is the architect route on life path nine. There's a bunch of assumptions here
that the person has to make. Uh, you have to unpack blueprint. They don't know
what that means. Earth, they don't know what that means. Architect, they don't
know what that means, especially when you say architect route. And they don't
know what life path nine. So you have to unpack all those symbols in order to
provide context. And this is going to be a general rule for all, all
information across the board. I'm looking at Jesus's love generated from
within, freely given, no transaction, light that has a source. Right? We want
to express that. Love generated from within, what does that mean? Freely
given, what does that mean? No transaction, what does that mean? Light that has
a source, what does that mean? So meaning is missing." And: "Review this
twice."
read: the reading names six symbols in one sentence and explains none of them,
and a pole line is four claims with no meaning on any. The lead sentence is the
reading and stays. What was missing is the meaning beside each word, in the same
place, never behind a link. The word he heard as route is the root, one of four.
It also turned up a second defect in the same card: it said "Earth, fixed" of
every Architect, though a Capricorn, an earth sign, is cardinal.
change: one table of meanings, engine/data/gloss.js, and one way to show it,
the tooltip the product already had, as an underlined carrier where a line has
no room and as the sentence itself where it has. The blueprint card, the
Summary reading, the sign chips, the left rail's signs, the sign drills, the
axis and law labels and the Compass pole lines (every phrase of every pole, with
its meaning, in POLE_MEANS) were wired first. A gate, tests/unpack.js, fails a
surface that prints a seeded term bare, and it fails on the build from before.
tools/unpack-walk.js finds the terms nobody seeded. See TASKS.md round PO and
V23 in the voice skill.

## Earlier, from FEEDBACK-alexander.md

See that file. Its items are in TASKS.md.
