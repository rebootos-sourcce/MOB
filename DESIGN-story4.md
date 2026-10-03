# DESIGN-story4.md

The story page, four designs. Ruled 20 September, seventeenth pass,
`TASKS.md` section 089. His words: "The story page is a D. I think that needs
to be redesigned. I need four designs by the art team, the creative team.
Right now it's really visually unimpressive and uninteresting. It's really
dull and it doesn't feel inspired."

    prototypes  proto/story4/instrument.html
                proto/story4/mirror.html
                proto/story4/body.html
                proto/story4/bench.html
                proto/story4/index.html       the four, with the belief on each
    the before  proto/story/story.html        untouched
    engine      referenced at ../../engine.js, never copied. Four pages, four
                script tags, zero copies.
    harness     proto/story4/shots.js         shoots and measures in one run
    shots       1600 x 1000 and 390 x 844, empty and loaded, plus the phone
                screen itself, 20 images, all looked at
    requests    zero not on file://, asserted from the browser's own request
                log and from a log the page keeps of its own fetch and XHR
    gate        python3 .claude/skills/atuned-voice/check.py, no hard failures

Three seats worked this: Sol Amadi on colour and light, Bjorn Haraldsson on
type and grid, Petra Nikau on composition and symbol. Findings are attributed,
because a finding with an owner is a finding somebody can argue with.

---

## 0. The diagnosis, and it is not the one the last pass answered

The last pass did not skip the look. It measured the journal at 1.019 to 1
against the page ground, found it was built out of the form control token set,
raised it onto `--panel` at 1.153, gave it a reading measure and made the live
fetter lighting the centre of the treatment. All of that is right and all four
of these designs inherit it without re-solving it.

It is still dull, and the reason is measurable.

**Measured on the story these four prototypes carry, 87 words, against the
running engine.**

    what the engine read out of it            8 hits
    what the shipping page lights              4
    the two coherent words it cannot light     slept well, grateful
    the phrase it cannot light as one thing    stayed quiet
    the name that phrase carries in PHRASES    silenced, printed nowhere
    places the charge actually lands on        8
    steps in the route, with coordinates       4
    surfaces in this product that draw any
      part of that route                       0

So the page shows four marks and hides the other half of the reading. Worse,
the four marks are not the reading: the shipping highlighter throws away
`hit.at`, which the scanner has recorded for every hit all along, and runs its
own regular expression over the raw text instead. That is a second reading of
the same sentence by a different rule, and it is why a coherent word cannot be
lit at all, why an idiom cannot be lit as one thing, and why the name the
engine already has for that idiom never reaches anybody.

**Petra found the shape of it.** The one genuinely unusual thing this surface
does, the instrument marking up a person's sentence while they are still
writing it, is rendered as four highlighter smudges. Everything else on the
page is a card. There is no drawing on this surface at all, on the surface
where the whole content chain starts.

**And the engine has been computing a drawing on every parse.**
`parseStory().path` returns the route the words take through the body, in
order, with a measured coordinate on every step, the total distance, the net
direction, the seat it dwells at, both ends, the heaviest word and the
lightest. `engine/core.js` even says why it is kept. Nothing renders one step
of it.

**So the problem is not construction, it is invention.** Four designs, four
arguments about what to invent with.

---

## 1. The four beliefs, stated first so an idea can be rejected rather than a layout

**One, the instrument.** The story page is an instrument, and an instrument
shows its trace.

**Two, the mirror.** The story page is a mirror. You put a sentence in and the
instrument gives it back in its own words, beside the line it came from, and
nothing else is on the page.

**Three, the body.** A story is a route through a body, and the page draws the
route where it happens.

**Four, the bench.** A story is stock, and this is the bench where it is cut
into parts and the parts are worked.

They disagree about the one thing the brief said they must disagree about.

| | what it does with the live lighting | where the reading lives |
|---|---|---|
| Instrument | gives it an axis. Every word plots on a seven column staff at the height of the line that produced it | inside the journal's own left edge |
| Mirror | refuses to touch the sentence. A leader runs out of the word to a line of the instrument's own writing | in the margin, at the same height |
| Body | puts it on the anatomy, in order, with direction | on the figure |
| Bench | makes it a filter. Clamp a part and the story goes quiet except the words that feed it | in the stock itself |

None of the four can be turned into another by moving a panel.

---

## 2. One, the instrument

**`proto/story4/instrument.html`.**

The journal is not a rectangle of text. It is a chart, and the person's own
sentence is its vertical axis.

Down the inside of the left edge sits a staff of seven columns, crown to root,
left to right, which is the body read top to bottom laid across the reading
direction. Every word the sniffer places plots as a dot in its seat colour at
the height of the line it was written on, and consecutive steps are joined by
a hairline. The heaviest one wears an open ring. A coherent word has no seat,
so it draws as a level dashed line across every column at once, and it is the
only unlit mark on the page.

**Sol.** The dot's opacity and radius run off the word's own intensity against
`PATHMAX`, the largest charged amount in the engine's lexicon, so the channel
has a real ceiling rather than a normalisation against whatever this story
happened to carry. The staff ground is `--bg` mixed 42 per cent into
`--panel`, which is darker than the journal and lighter than the page, so it
reads as an inset gutter rather than a second panel.

**Bjorn.** The mark on the word is a 2px rule under it, not a highlight. The
shipping mark fills the word at 15 per cent, rings it at 26 and takes it from
weight 300 to 500, which is three channels for one fact, and the weight change
moves the colour of the whole line so a marked paragraph reads as a paragraph
with holes in it. A rule under the word leaves the type alone.

Under the box, three findings, and the test every one had to pass is that a
person cannot make the same count by looking at the screen:

    Route    throat to solar plexus      where the story enters and leaves
    Dwell    throat                      the seat it keeps coming back to
    Kink     stayed quiet                the heaviest thing in it

All three are read off `path` at run time. None is a count. Under them, one
line stating what the staff is and is not: **"The staff records the order. No
number moves with it."** That is Ilse's sentence as much as mine: `pathOf` is
a record and feeds no arithmetic, and a drawing that implies otherwise is
claiming a measurement the instrument did not make.

**What it gives up.** It is the most conservative of the four. At a squint it
still reads as a writing box with panels beside it, and the invention is small
and precise rather than large.

---

## 3. Two, the mirror

**`proto/story4/mirror.html`.**

One wide column of the person's own writing at 19px on 1.85, and one narrow
column of the instrument's writing beside it. Every word the engine read gets
a line of its own, held at the height of the line that produced it, with a
leader running out of the word, across the gutter and into it.

    Throat.    It lands on Speaking To Be Right and Self-Silencing.
    Silenced.  It goes to the throat.
    Anger.     It goes to the solar plexus. It lands on Pride and Arrogance.
    Shame.     It goes to the solar plexus.
               Takes charge off, and it comes off every seat at once.
               Takes charge off.

Six lines off eight hits, which is every hit the scanner scored, once each.
Two of them are the words that take charge off, which no surface in this
product has ever shown. One of them is an idiom, named by the label the engine
already carries for it.

**Sol found the rule that decides the whole treatment, and it is a
measurement.** Against the journal's own ground at `--panel` `#1A1D26`:

    Root     #D6524C   4.14 to 1        Throat   #5EBBDB   7.70
    Crown    #A77EDB   5.33             Heart    #5FD5A6   9.26
    3rd Eye  #7D93E0   5.71             Solar    #DABF6A   9.33
    Sacral   #D8924E   6.53             ink      #EFEDE8  14.39

Body text needs 4.5. Setting a person's word in its seat colour fails at the
root, in red, on the seat that carries fear, and passes at every other seat,
which is the worst available version of that defect: it would look fine in
every test and break on the heaviest thing anybody writes. A rule is not text
and clears at 3 to 1. So the colour goes on the leader and the word keeps the
person's own ink at 14.39.

That measurement is what turned into the belief. Nothing is done to the
sentence. The instrument reaches out to it.

**June's rule, applied by the engine rather than by a writer.** `parseStory`
marks an imprint `inferred` when the seat was read but the address under it
was chosen by the fallback rather than by the person's words, and the comment
beside it forbids a renderer printing the name as a finding when that is true.
This is the only one of the four that writes in sentences, so it is the only
one that can say so, and it says: **"The seat is read. Nothing in the sentence
named a place in it."**

**Bjorn.** Two entries wanting the same height are pushed apart rather than
laid over each other, which is the collide rule this repository already has a
gate for. The leader is what keeps the link honest once a line has moved off
its own height.

**What it gives up.** At phone width there is no margin to annotate, so the
reflection stops being aligned and becomes a list in the order the words
landed. Same lines, same order, no geometry, and the leaders are not drawn,
because a leader pointing off the screen is worse than none.

---

## 4. Three, the body

**`proto/story4/body.html`.**

The figure is the shipping one: `BODYPATH` and the 72 traced nerve branches
of `NERVEBR`, drawn in the same 100 by 100 space and with the same transform
`ui/map.js` uses, cropped to the figure's own width so the column is not
mostly margin.

Two layers, and they are two different facts. The branches carry what is
**held**, off the profile, so a loaded seat is already brighter before a word
is typed. The route carries what **this story** is doing, off `path`, drawn in
the order the words landed with a line between the steps and an open ring on
the heaviest. Keeping them apart matters: a drawing that adds them together
says a person is carrying something they have only just said.

Under it, the route in words, because a drawing that cannot be read aloud is
half a reading: **"This story starts at the throat and ends at the solar
plexus. It spends most of its words at the throat. The heaviest thing in it is
stayed quiet."**

**And the figure is the navigation.** Each seat wears the product's own ring
at 26px with a 44px target around it, and pressing one holds the panel below
to what is held there. A seat with nothing in it says so rather than rendering
an empty cloud, which is indistinguishable from a panel that failed.

**What it gives up.** At a squint the figure lands before the writing does,
and the writing is what the page is for. It is also the most expensive of the
four at phone width: the figure costs about 190 pixels before anything else,
and everything below it had to give height back to keep the release control
above the fold.

---

## 5. Four, the bench

**`proto/story4/bench.html`.**

No cards. Three zones and two hairlines: the writing, the rack of parts, the
vice. A card is a thing you read. A zone is a place you work, and that is the
whole visual argument, which is why this one does not look like the other
three before anything is in it.

The lighting is three things, and all three fire:

1. Every word the engine read carries a dotted rule in its seat colour.
2. **While you write, the parts your words are feeding light in the rack and
   rise to the top of it.** The join is the band, which the engine already
   puts on both a word and an imprint, so there is no table for anybody to
   maintain.
3. **Clamp a part and the story goes quiet except the words that feed it.**
   The lighting stops saying "this word was read" and starts saying "these are
   the words this release is about", which is the question a person actually
   has at the moment they are choosing what to run.

**Petra found the failure in the first cut of that, and it was the good kind.**
Clamping a part the story never reaches dimmed the whole page and lit nothing,
which reads as a fault rather than as an answer. It only dims when there is
something to light, and otherwise the vice says **"Nothing in this story
reaches these. They are held from before."** which is a true and useful thing
this product has never said.

Selection is physical. A part in the vice leaves the rack, because a part
cannot be in two places and a list that shows it in both is a drawing of a
state that does not exist.

**What it gives up.** It draws nothing. It is the only one of the four with no
picture in it at all, and its appeal is entirely in how it behaves.

---

## 6. What survives all four, because they are his rulings

Checked on every page, in the shots, not in the source.

    the record button, circular, lower right, inside the field    all four, 56px
    a red light upper left while it is listening                  all four
    click in and type, no mode to choose                          all four
    an imprints button upper right                                all four
    the release panel runs from here                              all four
    its control above the fold, 1600 and 390                      measured below
    select from the imprints panel, including several             all four
    several says how they work through you together               all four
    no counting subtext                                           all four
    every pill in the product's own ring treatment                all four
    a figure's label is one word                                  all four
    ring, never fill                                              all four
    no serif, no paper, no shadow, no date stamp                  all four

The pair reading is `compute()` plus `leaves()` intersected, which is the
`pairPath` the last pass specified, unchanged.

---

## 7. The measurements

Every figure below is off `proto/story4/shots.js`, which shoots and measures
in the same run. The prototype's own three chrome controls are excluded from
the choice counts. Measured with a record loaded, a story in the box and two
imprints selected.

|  | instrument | mirror | body | bench |
|---|---|---|---|---|
| choices on the surface | 40 | **28** | 47 | 39 |
| above the fold, 1600 | 8 | 8 | 27 | 25 |
| above the fold, 390 | 7 | 7 | 13 | 8 |
| Run release, 1600, fold 1000 | 208 | **127** | 208 | 189 |
| Run release, 390, fold 844 | 783 | **233** | 832 | 764 |
| under 44 by 44 | 0 | 0 | 0 | 0 |
| horizontal scroll at 390 | none | none | none | none |
| hero redraw, median | 1.0 ms | 2.3 ms | 1.5 ms | 3.6 ms |
| hero redraw, 95th | 2.4 ms | 4.3 ms | 2.4 ms | 5.6 ms |
| requests not on file:// | 0 | 0 | 0 | 0 |
| the page's own fetch and XHR log | 0 | 0 | 0 | 0 |
| page errors and console errors | 0 | 0 | 0 | 0 |

The before, measured by the last pass, was 39 interactive on the surface and
20 above the fold at 1600, with Run release at 208.

Every redraw is under the 16.7 ms frame, worst case 5.6 ms on the bench at
1600, and the worst single frame seen across every run of the harness was
8.6 ms. The sample is five to seven frames a case, which is small and is
stated rather than rounded away. The mirror and the instrument both measure
their marks off rendered line boxes, which is the expensive part of the draw,
and it is still inside three milliseconds at the median.

---

## 8. What was found on the way, and none of it is mine to fix

Five defects came out of building this. Four are in code this seat does not
own.

**SY11. `SEATXY`'s x is not drawable, and this is the first surface to find
out.** `SEATXY` is the centroid of each seat's own traced branches. Its y is
exactly right and comes out in anatomical order without being told to. Its x
is an artefact of how many branches were traced on which side:

    crown 50.00   throat 49.89   heart 49.94   solar 50.03
    sacral 50.73  root 52.75     eye 42.96

The third eye sits 7.04 points left of the midline off three traced branches.
Drawn, that puts it out on the shoulder. The body design takes the y and puts
the x on the midline and says so in the file rather than quietly correcting a
published number. **`pathOf` reads x as well as y when it computes `span`,**
so the distance a story travels is inflated by tracing noise. That is for the
engine seat.

**SY12. The shipping highlighter is a second reading of the sentence.** It
discards `hit.at` and re-matches with its own regular expression, so it cannot
light a coherent word, cannot light an idiom as one unit and cannot carry the
label the engine has for that idiom. All four prototypes rebuild the engine's
own normalisation and keep the original index of every character, so a mark
lands on exactly the letters the scanner scored. `normMap` and `marksOf`, same
in all four, about forty lines.

**SY13. The one line reading says "held" about something that is not held.**
`oneLine` printed "Held at a weight of 2.1" about a place this story has put
charge on but has not committed. Fixed in all four: a pending place says what
it is and names Commit as what lands it.

**SY14. The first cut of this harness measured the fold wrong.** Picking an
imprint scrolls the document, and the measurement was taken after the clicks,
so it reported Run release at minus 556 and called it above the fold. It
scrolls to the top before measuring now. Two designs were genuinely below the
fold at 390 once it was honest, and both were fixed. A tool that lies is worse
than no tool.

**SY15. A full page capture lies about a sticky element.** The mirror's rail
came back painted over the reflection with 150 pixels of nothing above it,
which is the capture and not the page. The harness now also shoots the phone
screen itself at 390, and the way to tell the difference is to look at both.

---

## 9. Which one I would ship

**The mirror, whole.**

Four reasons, in order of weight.

1. **It is the only one whose drawing is the product's actual claim.** "Close
   the gap between your mind and your body, and hand you your own instructions
   so that you can change them." The mirror is that sentence as a layout: your
   words on the left, your instructions on the right, joined by a line, while
   you write. The other three are good drawings of things the instrument
   knows. This one is a drawing of what it is for.
2. **It answers the standing cognitive load item rather than adding to it.**
   28 choices against the before's 39, and 8 above the fold. It is the only
   one of the four that takes something away.
3. **Its empty state is the best thing in this pass.** A first ever open is a
   page, a placeholder, a record button and one quiet line in the margin.
   Nothing on this surface is louder than the invitation to write.
4. **It is the least like anything else.** Every other journal product on the
   shelf is a text box with a sidebar. This is a manuscript with a reader in
   the margin.

**What I would take from the others, and it is not a merge.** The three
findings in the instrument's readout, Route, Dwell and Kink, are three fields
off `path` and no design at all. Whichever surface wins can carry them for
about twenty lines, and they should be carried, because the engine has been
computing them into a drawer since the path landed.

**The second choice is the body,** and the case for it is the one I cannot
measure: it is the only one that will make somebody say something out loud the
first time they see it. If the answer to "dull" is meant to be felt rather
than argued, that is the one. It costs the most at phone width and it puts the
figure ahead of the writing at a squint.

**The bench is the one to keep in the drawer.** Its behaviour is the best of
the four and its still frame is the weakest, which is exactly the wrong shape
for a design being judged from screenshots, and the right shape for a design
being judged by somebody using it. If any of this goes to the panel, the bench
is the one that will test better than it shows.

---

## 10. The port

Nothing in `atuned_src/` has been touched. Three seats are live in there.

**Shared by all four and going in whichever wins.**

    normMap, marksOf        ui/storyui.js. The marks become the engine's own
                            hit list rather than a second regular expression.
                            About 40 lines, and it deletes hlHtml's regex.
    oneLine's pending case  ui/imprints.js. Three lines.
    pairPath, pairLine      ui/imprints.js, as the last pass already specified.
    crBadge, crbNode        the prototypes carry the badge geometry by value
                            because each page has to stand alone. The port
                            calls ui/component.js:150 and 183 and deletes all
                            four copies.

**The mirror, if it is the one.**

    1  stRender loses .st-hd entirely, as the last pass already specified.
    2  the surface becomes a two column grid with the reflection column as a
       margin, not a panel. No card, no border, no ground.
    3  the reflection is a new renderer, about 90 lines, reading PARSED.hits
       and PARSED.imprints only. It computes nothing.
    4  the leaders are one SVG over the grid, about 40 lines.
    5  the release panel becomes the sticky rail. stRelPanel loses RUN_SPEED_S,
       ST_RELN, ST_RELSRC and ST_RELSPD, which the last pass already ruled.
    6  impLive splits into impHeld and impFilled, and Filled in leaves this
       surface for the imprints page.

**Gates the port has to clear.** The full list is in `DESIGN-story.md` section
9 and none of it changes. Add `python3 tools/terms.py`, which has one thing to
settle: the word for taking one thing out of a release. The bench says
"Remove" and the other three say "Clear selection", and the page already uses
"Clear" for the writing. One word, settled once, before the port and not
after.

---

## 11. Five questions

1. **Which belief.** Not which layout. The four are in
   `proto/story4/index.html` with the sentence on each. If none of the four
   sentences is the story page, say which sentence is and the drawing follows
   from it.
2. **The coherent words.** "I slept well" and "I was grateful" take charge off
   every seat, and the shipping page cannot show that at all. All four of
   these show it, deliberately unlit, as the only marks on the page with no
   colour. Is that right, or do the words that take charge off deserve a
   colour of their own?
3. **The route.** `parseStory().path` has been computing the order, the
   distance, the direction, the dwell and both ends on every parse, and
   nothing renders it. The instrument prints three findings off it, the body
   draws it. Is the route something a person should see, or is it engine
   bookkeeping that should stay in the drawer?
4. **Filled in.** The mirror moves it off this surface entirely, on the
   argument that nothing there can be released so nothing there is a choice.
   The other three keep it. Off, or on?
5. **The phone.** The mirror loses its alignment at 390 and becomes a list.
   The body keeps its figure but pays about 190 pixels for it. If the phone is
   where a person actually writes their story, that is the whole comparison
   and it changes my recommendation. Which is the primary surface?
