# Summary page: three layout reviews

Reviewer: Dani Sorensen, UI UX lead. Each review is of the page as it stood, with
a letter grade, an information architecture diagram, a cognitive load count by
script, and what changes. The page is revised between passes, so review N is of
the page that came out of review N minus one.

All counts are by `mockups/summary-layout/shoot.js`, off the built page in real
Chromium, profile Sofia loaded with her one story entry, rails as shipped (left
shut, right open). Run again with `show.py LABEL`. Nothing here is typed from
memory.

How the count is made, so it can be argued with:

    controls on the page    visible buttons, summaries, inputs inside #sumbody on
                            the first screen
    controls on the screen  the same, over the whole window, rails and bar included
    groups                  visible boxes with their own edge or ground that hold text
    text blocks             visible elements owning twelve or more characters of text
    words                   the words in those blocks
    row level               for every row of side by side boxes, how much of the
                            tallest box's height the shortest one actually fills.
                            1 is level, 0.5 is a hole under half the column
    story at, action at     pixels down the surface from its own top to the first
                            story paragraph and to the first output button. A first
                            screen is 1000 tall at 1600 and 844 at 390, with about 125
                            of that taken by the bar

## The numbers, all passes

Loaded profile, first screen unless it says surface.

| | before | pass 1 | pass 2 | pass 3 |
|---|---|---|---|---|
| 1600: controls on the page | 11 | 8 | 0 | 1 |
| 1600: controls on the screen | 40 | 37 | 29 | 30 |
| 1600: groups | 10 | 9 | 8 | 9 |
| 1600: text blocks | 19 | 15 | 22 | 20 |
| 1600: words | 293 | 119 | 290 | 276 |
| 1600: surface height, px | 2462 | 2689 | 2223 | 2103 |
| 1600: row level, mean | 0.56 | 0.59 | 0.77 | 0.84 |
| 1600: story at | 354 | 926 | 388 | 388 |
| 1600: action at | 905 | 2381 | 1983 | 1899 |
| 390: words | 124 | 49 | 127 | 99 |
| 390: surface height, px | 5006 | not taken | not taken | 4654 |
| 390: story at | 398 | 1813 | 463 | 473 |
| 390: action at | 1237 | 4860 | 4386 | 2314 |
| 390: whole document, px | 8540 | 9071 | 8529 | 8188 |

Two things the table says that are easy to miss.

First, the screen carries 29 interactive controls that are not the Summary: the
bar, the profile switch, the right rail and its rows. The page itself can move
the figure by one to eleven. The standing finding that this product measures 57
to 71 simultaneous choices is mostly the shell, and a Summary rebuild cannot fix
it alone. `BIBLE.md` 5.7 records 81 to 98 on the shell at `1c021f4`.

Second, "controls on the page" fell from 11 to 1 mostly because the seven birth
marks moved below the first screen, not because seven controls went away. They are
still on the page, in one strip, and they are measured and tap safe there.

---

## Review 1. The page as it stood

Grade: **D plus.**

### The job

Sofia, 41, somatic practitioner, opens Summary because she has just written a
paragraph about not being held and wants to know what it says about her. In her
words: "tell me what you heard, and what it means I should do."

### Four seconds

A stranger sees a name, a ring with 73 percent and the word Compounding. Then a
box of her own words, a box of reading, and to the right a tall column of small
rings and lists. She thinks this is a report about her. She does not know which of
the forty things to touch. She is afraid the rest of the page is a list of defects.

### The diagram, 1600 wide, in the order a person meets it

    PLATE      Sofia ........................................ [ring 73] Compounding
               Where it goes: one sentence
    -------------------------------------------------------------------------------
    COLUMN A (41%)            COLUMN B (side a)         COLUMN C (side b)
    What you told it          6 rings in a row          Four lenses (4 rows)
    Reading, 3 paragraphs     Blueprint chips           Spiritual layer
    3 output cards            Primary and secondary x4    paragraph
    In the body, 3 paragraphs Masks x5                    7 glyph buttons
    (ends here, a hole)       The chain, 4 counts         4 agree and differ lines
                                                        Numerology in full
                                                          6 numbers, 3 name parts, stones
    -------------------------------------------------------------------------------
    Integrity over time, full width, 6 span buttons and a chart

### The count

First screen at 1600: 11 controls on the page, 40 on the screen, 10 groups, 19 text
blocks, 293 words, 11 rings. Column heights 1130 and 2157, so the row level is
0.52. The first output button is at 905 down the surface, which puts it below the
first screen. At 390: 124 words on the first screen, 5006 pixels for the surface,
action at 1237.

### Where they stop

- **Sofia** stops at column C. "Five systems, read independently off one birth
  date" is the product explaining its method before it has said a thing about her.
- **Derek**, 39, stops at the six rings. Six figures with no order and no
  next move.
- **James**, 57, stops at "Weaver" printed in four places (the reading, the blueprint
  chip, the Western lens, the agreement line) and is not told which one is the source.
- **Angela**, 36, stops at the first red ring and reads it as a verdict.

### What is wrong, structurally

1. The page is organised by where the data came from (the field, the birth, the
   story), not by the question a person has. A person never asks "what does the
   birth data say".
2. Three columns with three different kinds of thing and no shared baseline. The
   shortest ends two thirds of the way down and leaves a hole.
3. One fact is printed in four places and coherence is printed twice, in the
   plate and in the first ring.
4. There is a first name and nothing else. No full name, no meaning of the name,
   no root energetics in plain words, and numerology is at the bottom.
5. The way out sits below the first screen.
6. No nesting. Everything is open, so everything competes.

### The move

Group by question: who this is, what is running, what it costs, what to do. Put
the story and the person's own root energetics on the first screen, side by side,
equal halves. Fold the working (lenses, agreement, numerology, integrity chart).
One mark per group. Every row two equal halves or three equal thirds. Show the
nine as a set. Leave a marked, empty slot for the day block between the cards and
the way out.

### What to instrument

Time to first tap on the page. Which fold rows are opened, per profile band.
Whether the output button is reached without a scroll. Whether people open the
numerology fold.

### Grade delta

D plus to C plus, expected, if the move is made as written.

---

## Review 2. Pass 1

Grade: **C.** The structure is right and the first screen is wrong.

Pass 1 grouped the page into four zones with a header block first: the plate, then
six cells (born, running, name, three overlaps), then a strip of seven birth marks,
then the zones. Everything open except the working.

### The diagram, 1600

    WHO THIS IS    plate: name, full name, ring, band, where it goes
                   6 cells in 3 by 2: Born, Running, Name | 3 overlaps, each with a band of 4 circles
                   7 birth mark buttons
    WHAT IS RUNNING   [ story card ........ | blueprint, primary, 5 masks card ]
    WHAT IT COSTS     [ 3 by 3 nine + 3 paragraphs | 6 rings, chain (and a hole) ]
                      integrity chart, full width, open
    WHAT TO DO        3 cards
    WHERE IT COMES FROM   3 folds

### The count

1600: 8 controls on the page, 37 on the screen, 9 groups, 15 text blocks, 119
words, row level 0.59 (worst 0.39, the readings card). The story starts at 926, so
at 1600 by 1000 it is not on the first screen at all. At 390 the story is at 1813
and the action at 4860, and the document is 9071 pixels, longer than before.

### Where they stop

- **Marcus**, 44, stops at the empty circles where the root marks should be (a
  glyph that was a bare path and drew nothing), and at three identical captions "A
  light overlap". "Designed, not assembled" does not survive that.
- **Diane**, 46, stops at the header. Thirteen items stand between her and her own
  story: six cells and seven buttons.
- **Derek** stops at the 3 by 3 because "Anticipation" breaks as "Anticip ation" in the
  cell.
- At 390 **Angela** cannot read the full name. It wraps into a column of three lines
  beside the ring and pushes the band to the edge.

### What is wrong

1. **It broke a ruling.** The centre is the story and evidence goes first. Pass 1
   put forty-odd things between the person and the story.
2. The header answers "who is this" at the length of a page. Born and running restate
   what the reading's first paragraph says one inch lower.
3. A hole in the readings card, and the 3 by 3 cells are too narrow for their words.
4. Coherence is still printed twice.
5. Seven buttons plus six cells is thirteen items before anything is read.
6. The phone got longer.

### The move

The first row is the story and the person's root energetics, equal halves, the
story on the left because it is read first and the phone reads it first. The
header shrinks to a plate. The seven marks leave the card and become one strip.
Coherence leaves the readings. Every working block (masks beyond three, integrity,
seats, lenses, agreement, numerology) goes behind a labelled row with a chevron.

### What to instrument

Story visible without a scroll, as a boolean per first run. Count of folds
opened per session.

### Grade delta

C to B minus, expected.

---

## Review 3. Pass 2, with two new inputs

Inputs beyond the layout: the simulated ICP pitch in `ICP-FEEDBACK.md`, and the
round OJ message in `INTERPRETATION.md` that moves the name to the right as the
second driver in a cascade.

Grade: **B minus.**

### The diagram, 1600

    WHO THIS IS     plate (name, full name, ring, band, where it goes)
    [ Story card ........................ | Root energetics card ................ ]
      what you told it                       three facts across (Born, Running, Name)
      reading, 3 paragraphs                  where the four meet, 3 rows with circles
      (a hole of about 200 under it)         seven birth marks, in the card
    [ What is running ................... | What it costs ....................... ]
      blueprint, primary x4, masks x3          5 rings, 3 by 3 nine, 3 paragraphs
      chain, All masks fold                    Integrity over time fold
    WHAT TO DO      3 cards
    FOLDS           Four lenses | Birth comparison | Numerology in full

### The count

1600: 0 controls on the page, 29 on the screen, 8 groups, 22 text blocks, 290
words, row level 0.77. Story at 388, which is on the first screen. Action at 1983.
At 390 the document is 8529 pixels and the action is at 4386.

### Where they stop

- **Marcus** at the card with the hole: the Running card has 150 pixels of empty ground
  above "All masks" and the Story card ends 200 pixels short of its neighbour.
- **James** at "Where the four meet". Four small circles lit and unlit stand for the
  systems that met, he cannot read them, and a phone has no hover to ask them.
- **Diane** at the action row. At 1983 it is two screens down.
- **Derek**, on a phone, at the same row: 4386.
- **Angela** at a blank profile. Pass 2 printed the word You at display size at the
  head of the blank page. It is the roster default and not a person, so it breaks
  "nothing is printed off a default".
- Everyone at the three facts: Born and Running both read "Weaver" with the same mark,
  which is the dupe from review 1 in a smaller font.
- The 3 by 3 still breaks "Surprise" and "Anticipation".

### What is wrong

1. A default is printed as a name. A real defect, not a taste.
2. Cards stretch to equal height with a hole inside the short one.
3. A set of four circles stands in for words. A control-shaped thing that is not
   one, and unreachable on a phone.
4. "Running" is not a static fact and does not belong in a block of things that do
   not change. The owner's message makes this clear.
5. The name has a number and no meaning, and now the owner says the meaning is what
   is wanted, on the right.
6. On a phone the way out is 4386 pixels down.
7. `.sg-zh` headings were not title case, which breaks the header ruling.
8. The chips drew a box each, and the owner ruled the little boxes out. The
   functional gate asserts no border on any chip, so this would have failed it.
9. Found while adding the name panel, in the unread page: once a name or a birth
   is entered, the card pushes the four doors under the fold.

### The move

- The right hand card becomes **What drives it**: a numbered cascade. Stage one is
  Born: the root the sun sign gives, then the two strongest meetings, the light
  overlap note said once, and the rest behind a fold. Stage two is Named: each part
  of the name with its meaning from a table, "No meaning on file" where there is none,
  then the Expression. A ring with an arrow closes the line, which says "and then
  everything below".
- Running leaves it. The Running root is already the blueprint chip in the card below.
- The band of circles is replaced by words: the systems that met, and a strength only
  when it is more than light.
- The seven birth marks become one strip across the page under both cards, with one
  edge around the strip and none around a mark. Seven or five, they stand level.
- The nine become vertical cells so no word breaks.
- Blank profiles print no name. The unread page is the four doors beside the first
  drivers when a name or a birth is entered, and the doors alone otherwise.
- On a phone the output row follows the story, the drivers and the marks. The
  document keeps one order and CSS lifts the row.
- "Expression" is the one word for the name number, as on the numerology rows.
  "Other ways this shows up" is the rail's own label, used again.
- A table named `NAME_MEANINGS`, read by name part, stubbed with his three entries and
  nothing else.

### What to instrument

Stage opens: does anyone tap Other ways this shows up. Whether a name part with no
meaning on file makes a person open Intake. Reads of the Named stage by band, since
James and Derek are band 5 and Sofia is band 8.

### Grade delta

B minus to B plus, expected.

---

## After pass 3

Grade: **B plus.** Not an A, for four reasons stated so nobody has to find them.

1. The way out sits at 1899 on a desktop. A day block from the other seat, going
   into the slot above it, makes it lower, not higher. The slot is full width, 96
   pixels while empty in the dev view and zero in production.
2. The Running card still has up to 150 pixels of ground above its fold on a
   profile with few masks. Equal height cards cost a hole somewhere.
3. The right rail's Energetic Summary prints the same nine as a table beside the
   page's 3 by 3 and the same overlap. That is the shell's and not this page's, and
   it is the largest remaining dupe.
4. The whole screen is still 30 controls. Nothing on this page can fix that.

### Tap floor and overflow

`taps.js` opens every fold and measures every control on Sofia, Derek, James and
Angela at 1600 and at 390: 42 to 47 controls each, none under 44 by 44, no box
overflowing its own, no sideways scroll.
