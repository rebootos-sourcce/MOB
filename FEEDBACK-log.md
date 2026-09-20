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

## Earlier, from FEEDBACK-alexander.md

See that file. Its items are in TASKS.md.
