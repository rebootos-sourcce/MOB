# The Field And The Compass. Art Direction, Measured

Mika Ueda-Salas, with Sol Amadi on colour and light, Bjorn Haraldsson on type
and grid, Petra Nikau on composition and symbol. 19 September.

Measured on commit `a68f5dd`, `source.html` md5 `3007ed4bb765df2ec4c6b6a42f24e284`,
and **every measurement re-verified on `5c267a6`, md5 `328df343ace0a4b299508904683daddc`**,
because three commits landed in this tree while this review was being written.
Nothing in the table moved. `bc()` is still unfixed, gate 13 still has six
lightings in its loop, and the compass still measures 89 overlapping label
pairs at 1600 and 98 at 390 on the newer build.
Every measurement below was taken in a real Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, booted for 7200ms, on the
Marcus profile loaded through `loadP(3)`, at 1600 by 1000 and at 390 by 844.
Every measurement names the DOM node it came from. Seven probes have lied this
session, so each probe here was checked against a known good case before its
number was believed, and where a number is from this review's own page rather
than from the product it says so.

Nothing in this file was written to `atuned_src/`. **I committed nothing.**
One thing he should know anyway: `reviews/compass-passes.html` was swept into
commit `5c267a6` by another session working in this tree at the same time. It
is my file and its content is what I wrote, but the commit is not mine and its
message does not mention it.

---

## 1. What Was Measured, And On What

    surface        node                     1600 x 1000          390 x 844
    stage          #stage                   922 x 833            376 x 803
    reading strip  #key                     920 x 106            374 x 54
    canvas         canvas#cv                664 x 725            335 high
    tier block     .tl#tl                   173.2 x 121.9        374 x 121.9
    accuracy       .acc#acc                 237.1 x 66           374 x 66
    right rail top .railtop#railtop         298 x 98.8           346 x 98.8
    left rail bar  .polbar#polbar           264 x 32             346 x 32
    compass card   .cone-card               920 x 903            374 x 1577.5
    compass canvas #conecv                  528 x 430            338 x 343

The reading itself, from `compute()` on Marcus: CQ 39.17, tier Incoherent,
DQ 0.0, SQm 0.0, vitality 0.955, awareness 0.770, will 0.623, pole 0.478,
malignant 22. From `accuracy(r)`: 57.6 percent, band plus or minus 10.6,
reliability 86, signal 19.

He said the accuracy figure reads 70 percent. On Marcus it reads 57.6. The
figure moves with the profile, so both are true of different people and the
instruction is the same either way.

---

## 2. The Top Row, Counted And Named

Eight chips, all rendered by one string in `ui/ui.js` at line 630, all wearing
the same object with the same weight, the same border and the same 44 pixel
height. Measured from `#key .kb`:

    order  node                       reads          width   what it actually is
    1      #key .kb[data-q=cq]        39%            122.4   coherence, 0 to 100
    2      #key .kb[data-q=dq]        0.0            113.9   shadow weight, summed charge
    3      #key .kb[data-q=sq]        0.0            113.0   segment depth, 0 to 10
    4      #key .kb[data-q=pole]      0.48           128.4   installed opposite, 0 to 1
    5      #key .kb[data-q=xyz]       0.95           143.2   vitality, 0 to 1
    6      #key .kb[data-q=xyz]       0.77           166.6   awareness, 0 to 1
    7      #key .kb[data-q=xyz]       0.62           124.6   will, 0 to 1
    8      #key .kb[data-q=flow]      1.00           130.6   flow, 0 to 1

**Squint, from six feet.** The eye lands on nothing. Eight objects of equal
weight in two ragged rows is a texture, not a hierarchy. He called it a
jumbled cluster and the word is exact: there is no order in it, because
nothing in the drawing says there is one. Three of the eight are on one scale,
four are on another, one is on a third, and the strip does not know that.

**Three defects, with their measurements.**

**2a. Three vocabularies on one strip.** Found by Bjorn. Chips one to three
print initialisms. Chips four to eight print English. A stranger reads
`CQ 39%` beside `Awareness 0.77` and has to hold two systems at once on the
first strip of the first instrument screen. `.kb b` is one class carrying two
kinds of name.

**2b. The word Awareness means two different things on this screen at the
same time.** Found by Bjorn, and it is the sharpest thing on the page. The
left rail's first section header, `shell/body.html` line 232, is the word
Awareness, and it holds orientation, balance, root domains, blueprint domains,
primary and secondary. Chip six is also the word Awareness and it is `r.Y`,
intention read against distortion. Measured positions: the header at x 31,
y 189 and the chip at x 576, y 234, both on screen, both visible, 545 pixels
apart. That is rule 1 of the UX skill broken in the plainest possible way.
One of the two has to give the word up.

**2c. At 390 the strip hides five of its eight chips and says nothing about
it.** Measured on `#key`: `scrollWidth` 1113, `clientW` 374, `flex-wrap`
nowrap, `overflow-x` auto, `scrollbar-width` none. Chips four through eight
have right edges at 518, 667, 839, 970 and 1107 against a viewport of 390.
The rule this breaks is the product's own, rule 10: an overflowing scroller
with a hidden scrollbar is indistinguishable from a missing feature, wrap
instead. The CSS is `shell/head.html` line 2647.

**Everything printed twice on one screen.** Taken by walking every leaf
element with a non zero box and a visible computed style, then grouping by
text. Cross checked against the screenshot by eye.

    reading           printed at                                       times
    coherence 39      #key .kb[data-q=cq] .cr .v   x368  y182            4
                      #railtop .cr .v              x1306 y179
                      the wheel core, ui/wheel.js:352, canvas
                      the swing strip, .pol2, canvas
    tier Incoherent   .tierbtn#tier                x1018 y172            2
                      #railtop .rt-t               x1374 y177
                      and a third at depth 0 only, ui/wheel.js:615
    benign 78         #pol .bmv                    centre stage          2
    malignant 22      #polbar .lb b                left rail
    pole 0.48         #key .kb[data-q=pole] .cr .v x735  y182            2
                      the right rail               x1319 y1625

Four prints of one number is not emphasis. It is the instrument disagreeing
with itself about where its own answer lives.

**And one measurement nobody asked for, which is worse than any of the
above.** Found by Sol. On the Field the stage is `#101010` in every lighting
except Glass white, by `shell/head.html` line 1152, but the text tokens on it
are the lighting's own. In Snow that puts Snow's dark ink on black. Measured
against each element's own ground, not the page:

    element                      Dark   Snow   Punch  Glass  Glasswhite  Flat   Lumen
    #tier "Incoherent"           16.26   1.06  16.26  16.42   18.08     17.61  17.76
    #key .kb label word           9.68   2.45   9.71   1.85    2.29      8.61  10.39
    #key .kb value                7.25   3.33   6.59   7.24    7.25      7.25   3.84
    #acc .acc-l "Identification"  5.99   2.94   5.99   5.58    5.31      4.01   5.70
    #pol .bmnote                  5.99   2.94   5.99   5.58    5.31      4.01   5.70

The tier word on the Field in Snow measures 1.06 to 1. That is not low
contrast, that is not rendered. Every chip label in Snow is 2.45, in Glass
1.85, in Glass white 2.29. The floor is 4.5 for body and 3.0 for large.
Snow is the lighting Sofia sits beside a client in. It is the one that breaks.

I have been burned by exactly this before, which is why the table is against
each element's own ground and not against the page.

---

## 3. His Two Literal Questions, Answered From The Code

**"The text to the right of it, I don't know what that is."**

It is the word **Identification**. `ui/personas.js` line 198 to 201 writes
`.acc-b` as a flex row of two things: `cr('Crown', a.pct, {size:'lg',
label:'identification'})`, which draws the ring, the crown glyph and the value
`57.6%`, and then `<span class="acc-l">Identification</span>` after it. So the
strip reads ring, then figure, then the word, left to right.

He does not know what it is because the word is a truncation. The reading is
family identification: how closely this field matches a named family and how
wide that match is. `runAccDrill` says so in full, and the stage says one
word of it.

**Where it goes.** Lower right of the stage, and the label moves to the left
of the figure exactly as he said. And it stops being one word. The strip reads

    Family match    (ring) 57.6%    plus or minus 10.6

Label, then the object, then the band. That is his instruction and the
standing editorial ruling in the same line. Copy goes to the editorial seat
for the final wording; the geometry is mine and it is below.

**"That weird text that you have underneath it."**

It is `.bmnote`, written by `ui/ui.js` line 581, and it currently reads
"most of what is held is benign". It sits inside `#pol`, which sits inside
`.tl#tl`, absolutely positioned at top 14, right 152 on the stage. `#pol` also
draws the benign and malignant bars themselves, at 78 percent and 22 percent,
which the left rail's `#polbar` already draws under the heading
`0 · Orientation`.

The note is weird because it is a sentence restating the bar directly above
it, in a place that is not the rail where that reading lives.

**Where it goes.** Nowhere. It is deleted with the rest of `#tl`. The reading
survives in `#polbar` in the left rail, which is where he says it already is,
and the sentence's content is already in the bar's `title` and its drill.

**And Severe, which is the tier word.** The same `#tl` block carries
`.tierbtn#tier`, which on Marcus reads Incoherent and on a lower field reads
Severe. `#railtop` in the right rail carries the same word plus its
definition. `#tl` goes; `#railtop` stays, because it is the one that also
says what the word means.

---

## 4. The Field, Laid Out From His Grouping

### 4a. The grouping, and the one thing I moved that he did not name

He gave two kinds. CQ, DQ and SQ are one. Vitality, awareness and will are
another, with flow, and they go lower left. Accuracy goes lower right with its
label to its left.

That leaves **Pole**, which he did not name. The argument for where it goes is
a scale argument and not a taste one. Pole is the coherent opposite installed
across the nine axes, read nought to one. The lower left group is nought to
one. So Pole would join them, except the lower strip then does not fit, which
is measured below. So Pole leaves the stage entirely and goes into the left
rail under Fetters, beside the nine axes it is the summary of. The left rail
already carries a held slider and an opposite slider for all nine; Pole is
their mean and belongs with them.

This is the fourth thing removed and it is the hardest part of the job. If he
wants it back on the stage it costs one wrapped row, which is 44 pixels of
wheel, and the number is in 4c.

### 4b. The geometry

    THE STAGE. Three grid rows instead of two.

    .stage{grid-template-rows:var(--strip) minmax(0,1fr) var(--strip)}

    row 1, #key, 894 x 56 usable
      [Coherence  (ring) 39%]  [Shadow weight (ring) 0.0]  [Segment depth (ring) 0.0]
      left aligned, gap 8, one row at every width above 700

    row 2, canvas#cv, the wheel, nothing over it at all

    row 3, #strip2, 894 x 56 usable
      [Vitality 0.95] [Awareness 0.77] [Will 0.62] [Flow 1.00]    ...    [Family match (ring) 57.6% ±10.6]
      the group left aligned, the accuracy right aligned, one row

    DELETED
      .tl#tl            the whole block, with #tier and #pol inside it
      .acc#acc          as an absolute overlay. It becomes the right end of row 3
      #key padding-right:300px   it existed only to leave room for .tl

The chips keep their 44 pixel height, so the tap floor is untouched. Strip
height is 56: 44 for the control and 12 of top padding, which is the gap
already in use.

**Width arithmetic, at 1600.** Available inside the strip after a 14 pixel
gutter each side: 894. Row 1 content, using the measured chip widths with
the longer words substituted at the same 12px size: about 150 plus 172 plus
168 plus two gaps of 8, which is 506. Fits with 388 to spare. Row 3 content:
143.2 plus 166.6 plus 124.6 plus 130.6 plus three gaps of 8, which is 589,
plus the accuracy block at about 250 and a 28 pixel group gap, which is 867.
Fits with 27 to spare. Pole at 128.4 plus a gap would make it 1004 and it
would wrap. That is the arithmetic that moves Pole.

**At 390.** Both strips wrap rather than scroll. Row 1 becomes two lines,
100 tall. Row 3 becomes three lines with the accuracy on its own, 156 tall.
Nothing is hidden and there is no scroller with no scrollbar. This is a
straight repeal of `shell/head.html` line 2647.

### 4c. What the row costs now, and what mine costs

    now                                            area on the stage
    #key            920 x 106                      97,520 px2
    .tl#tl          173.2 x 121.9, overlaying       21,113 px2
    .acc#acc        237.1 x 66, overlaying          15,649 px2
    total                                          134,282 px2, 17.5 percent of the stage

    mine
    row 1           894 x 56                        50,064 px2
    row 3           894 x 56                        50,064 px2
    total                                          100,128 px2, 13.0 percent of the stage

    canvas height   725 now, 721 after. A loss of 4 pixels, 0.6 percent.
    canvas clear    two overlays removed from it, 36,762 px2 given back.

So the strip costs a quarter less stage, hands the wheel back its top right
corner and its bottom, and the wheel loses four pixels of height doing it.

If Pole stays on the stage, row 3 wraps at 1600 and the strip becomes 100
tall. Canvas height then falls to 677, a loss of 48 pixels, 6.6 percent of
the wheel's height. That is the price of the fourth thing and it is why the
fourth thing goes.

### 4d. The tokens

    --strip      56px    the height of a reading strip on the stage
    --strip-pad  14px    its gutter
    --chip-gap    8px    between chips inside one group
    --grp-gap    28px    between groups on the same strip

Three and a half times the chip gap for the group gap. That ratio is what
makes two groups read as two groups without a rule between them, which is the
restraint move: no divider, no box, no background. Space does it.

Colour does not change. The chips keep `cr()` and the seat colour of whatever
each reading is measured at, which is already correct and already carries
`hot:false` on the readings where high is the good end. That fix is in and it
stays in.

**One colour defect to fix with it.** `#acc` in `shell/head.html` line 1338
still carries `.acc-n{color:var(--gold)}` at 34px from the version before the
ring. It is dead and it should go with the block, because a live rule for a
dead element is how a gold 34 pixel number comes back.

### 4e. The contrast fix that has to land with the layout

The Field stage sets its own ground to `#101010` and does not set its own ink
in six of the seven lightings. Lumen already does this correctly, at
`shell/head.html` line 352:

    body.lumen .stage{--ink:#F7F7F7; --mid:#B6B6BC; --dim:#8C8C94; ...}

Every lighting whose stage is `#101010` needs the same treatment, scoped the
same way. That is one rule, and it takes the tier word from 1.06 to above 12,
the chip labels from 2.45 to above 9, and the accuracy label from 2.94 to
above 5, in Snow. Without it the new layout is the old layout, unreadable in
the lighting a practitioner works in.

**Grade.** The Field top row is at **D** now: correct data, no hierarchy, one
word carrying two meanings, five controls hidden on a phone, and a whole
lighting in which half of it does not render. The layout above takes it to
**B**. The contrast fix takes it to **A minus**. What keeps it off A is that
coherence is still printed four times on one screen, and that is a question
about where the product's answer lives, which is section 8.

---

## 5. The Compass. The Reversal, And Ten Passes

### 5a. The reversal, said plainly, because it is not mine to resolve quietly

Earlier this evening: *the compass is a feature and should not take up most of
the dominant space.* The build was made smaller to match, and that is the
build I measured.

Tonight: *you're wrecking my compass. The compass is a centerpiece. It should
be the entire center area.*

I am working to the later ruling, because it is unambiguous and he gave it
after seeing the result of the first. **It is a reversal and he should see it
as one.**

**What the reversal costs.**

1. The information column has to leave the card. That is not a loss, because
   AF4 already rules that the compass text is information and goes right. The
   reversal and AF4 are the same move, which is lucky.
2. **The real cost is new architecture, and it is small but it is new.** The
   right rail, `.col` at 336 pixels, currently carries the Field's sections:
   Reading, Selection, Flow, Fetters, Saboteurs, Complexes, Hyper, Character.
   Putting the compass reading, the record, the ladder and the graph there
   means the rail's contents change with the tab. The product does not have a
   per tab rail today. This is the thing to decide before anything is built.
3. `.cone-card{width:min(860px,95vw)}` at `shell/head.html` line 1857 stops
   being a card and becomes the stage. `.cone-body{grid-template-columns:1fr
   340px}` loses its second track.
4. **If he reverses again**, the CSS comes back in one line but `coneOpen`
   gains a branch, because the information has to render into the card or into
   the rail depending. Say it now rather than discover it then.
5. An hour of work built to the first ruling is discarded. That is the
   smallest of the five costs and it is not a reason to argue.

### 5b. What the compass measures now, and why he is right

    .cone-card      920 x 903     the whole centre, and it is his
    #conecv         528 x 430     the canvas inside it
    .cone-info      340 x 843     the information column beside it
    .cone-fig       528 x 430

    the drawn figure, from CONE_H 0.55 and CONE_FLARE 0.52 at U = 215:
      axis height   236 px        0.55 x 215 x 2
      widest        224 px        0.52 x 215 x 2

So the compass figure is about **236 by 224 pixels inside a 920 by 903 pixel
centre**. It covers **6.3 percent of the centre area**. Below it, from y 558
to y 903, sits a 528 by 345 pixel rectangle of nothing, which is 20 percent of
the centre showing no information at all.

He is not being fussy. The centrepiece of the product is rendering at one
sixteenth of the space it is given.

**And the labels are a pile.** Measured by wrapping `fillText` on the compass
context during one `coneDraw()`, taking each label's real box from
`measureText` and the font size, and comparing every box against every other.
The probe was checked first against a known good case: two disjoint boxes
report no hit, two overlapping boxes report a hit, and the label positions
move between flat and turned, so it is not reporting on a frozen frame.

    1600 x 1000   23 labels drawn   89 overlapping pairs
    390 x 844     23 labels drawn   98 overlapping pairs

Named offenders: Elijah against Phlegyas, Meister Eckhart, The Furies, Jesus,
Lucifer, illumination and Ramakrishna, all at once. Rumi against Charon,
desire and will, The blueprint, and the band sentence. `tests/collide.js` only
walks `TAB.FIELD`, so nothing in the gates has ever looked at this.

**Grade.** The compass is at **D minus**. The geometry is good and the
drawing is honest, and both are invisible.

### 5c. Ten passes, and I ran ten

`reviews/compass-passes.html` is a standalone page, no network, no dependency,
same discipline as the product. It draws all ten passes live from the
geometry ported out of `ui/cone.js`, carries the seven lightings on a switch
so he can check every pass in every one, and **measures itself while it
draws**: each card's figure fill and overlapping label count are taken from
the frame in front of you, not typed in. Its counters say which figure they
read, because a counter reporting on itself and calling it the product would
be the third lying probe this week.

Each pass carries the ones before it and changes one thing. The ICP reaction
drives the next change. Simulated against the charge vectors in
`engine/data/people.js` and the method in `RESEARCH-icp.md`. Nothing was said
by a real person.

    pass  change                                          who       what the ICPs did with it
    1     full centre, information column out             Mika      Marcus RESIST, Sofia HOLD
    2     figure fills its box, H .55 to .78              Bjorn     Derek HOLD: cannot read a name
    3     labels leadered to an outer ring                Bjorn     Marcus BUY, James HOLD: why 3D
    4     depth sorted paint, far half falls back         Sol       James BUY, Angela HOLD: it is still
    5     ambient rotation, one turn in 100 seconds       Petra     Angela BUY, Diane RESIST: where am I
    6     the vivid palette reaches the canvas            Sol       Sofia BUY, Marcus HOLD: hold chroma
    7     chroma rides depth, the band becomes a shell    Sol       Derek BUY, Diane HOLD: still no me
    8     your reading is a plane, not a dot              Petra     Diane BUY, Rosa RESIST: 39 of what
    9     every number carries its scale and meaning      Mika      Rosa BUY, James BUY
    10    it slides in and lands from 0.94 scale          Petra     Marcus BUY, Angela BUY

**Measured across the ten**, by the page, at a 430 pixel card:

    figure fill          21 percent at pass 1, 32 percent from pass 2 on
    overlapping labels   1 pair at pass 1 and 2, nought from pass 3 on
    frame rate           59.7 to 61.1 fps with all ten drawing and five animating

The shipped figure at 528 by 430 inside 920 by 903 covers about 23 percent of
its own canvas and 6.3 percent of the centre. Pass 2's geometry at the full
centre takes the figure to about 46 percent of the centre, which is a
sevenfold gain and the single largest move in the run.

**What the passes taught that I did not expect.** Diane pushed back twice in a
row, at pass 5 and pass 7, on the same thing: motion with nothing of hers in
it. She is the highest weighted panel member and she was asking for pass 8
before pass 8 existed. The order should have been 8 then 5. Recorded rather
than tidied, because the run is the evidence.

Rosa is the other one worth reading. She refuses the product correctly, and
at pass 8 she refused it for the wrong reason: she could not tell what 39
meant. At pass 9 she refuses it for the right reason. A refusal for the right
reason is a working instrument. That is the whole argument for AJ1 in one
panel member.

### 5d. Every proposal, against the seven lightings and the frame gate

Nothing in passes 1 to 10 adds a DOM layer over the compass or the Field, so
nothing in them touches `tests/design.js` gate 13, which asserts that nothing
over the Field carries a `backdrop-filter`. All of it is canvas work inside
the rAF that already runs.

Measured on the passes page with all ten canvases live and five animating:
59.7 to 61.1 fps. The product draws one.

**Gate 13 has a hole and it is not mine.** Its lighting loop is
`['dark','snow','punch','glass','glasswhite','flat']`. Lumen is not in it. The
seventh lighting is unguarded by the frame rate gate and by the backdrop
assertion. That is one array entry and it should go in before Lumen ships.

---

## 6. Lumen, And What The Vibrancy Costs

**The finding, and it is a defect, not a proposal.** Found by Sol.
`ui/component.js` line 153:

    function bc(b){return hx(LIGHT()?PAL_LIGHT[b]:PAL[b]);}

`LIGHT()` is `S.theme==='snow'`. So every colour drawn on a canvas in this
product, which is the wheel, the compass, the body figure and the swing strip,
knows about exactly two palettes. `PAL_VIVID` exists in
`engine/data/canon.js` line 77 and is reached only by `seatCol`, which serves
HTML rings. **In Lumen the entire centre field paints in the muted palette.**

I screenshotted the Field in Lumen and in Dark side by side at 1600. They are
the same picture. AD2 says the centre field is vibrant, and it is not.

The fix is one ternary in one function and it is a Small. It is also the
single highest leverage line in this whole review, because it is the
difference between Lumen existing and Lumen being a white chrome with the
dark app still inside it.

**A second Lumen defect, smaller.** The CSS tokens and `PAL_VIVID` disagree.
`--solar:#FFC400` against `PAL_VIVID.Solar '#C79200'`, `--heart:#00C46A`
against `'#00A85C'`, `--throat:#00A9E0` against `'#0091C4'`. So in Lumen a
seat wears one colour as a chrome token and another as a reading. One of the
two is right and they cannot both be. My call: the JS values are right,
because they were chosen to hold on paper and on `#101010` both, and `#FFC400`
on white measures about 1.7 to 1. The CSS should move to the JS values, not
the other way.

**What vibrancy costs in the other six.** Nothing. `PAL_VIVID` is reached only
when `S.theme === 'lumen'`. The standing ruling that the palette is muted and
argued from autonomic response is untouched in Dark, Snow, Punch, Glass, Glass
white and Flat. Lumen is its named exception, on his word, and the sheet
should say so where a future reader will find it.

**What vibrancy costs inside Lumen, and this is Sol's ruling.** Full chroma
across a whole figure reads as a toy. Marcus said so at pass 6 and he is the
ICP whose whole value is saying so. Pass 7 answers it: chroma rides depth.
The near half of the figure is at full vivid, the far half washes toward the
ink. One multiply per meridian, no frame cost, and it is the same thing a
cinematographer does with a key and a fill.

---

## 7. Ideas For The Field. Visual And Animated

He named the atomization as the thread to pull, and he is right, and the first
finding is that almost nobody will ever see it.

**7a. The atomization is nine scroll notches deep and nothing says it is
there.** Found by Petra. `ui/wheel.js` line 178: `ATOM_STEP = 2.60`, and
`atomA()` returns nought until `S.zoom` passes it. The default zoom is 1.0 and
the wheel steps by a factor of 1.12 per notch, so reaching the atom layer
takes log(2.6) / log(1.12), which is **8.4 notches, so nine**. A person has to
scroll nine times on a canvas with no affordance saying there is anything to
find. The thing he called super cool is functionally not in the product.

**The move.** The atoms do not wait for zoom. Every address carrying charge
from a committed story grows its hairlines at all times, at about 18 percent
of full length, and zoom lengthens them rather than summoning them. Zoom stops
being a gate and becomes a magnifier, which is what a person expects it to be.
*Cost:* `atomIndex()` is already memoised against the entry count so no
re-parse happens per frame. The draw is one line and one 2 pixel arc per
story, capped at six per address by `list.slice(0,6)`. Worst case across the
roster is 112 addresses times 6, which is 672 short segments, about 1.1ms per
frame at 1600 against a 16.7ms budget. **Medium.**

**7b. The wheel breathes on the reading, not on the clock.** Found by Sol, and
it is the highest ratio of meaning to frames in this list. `ui/wheel.js` line
294 already breathes the core: `breathe = Math.sin(S.t*1.4)*.05`. 1.4 is a
constant, so every field in the product breathes at the same rate. Make the
period flow. A field at flow 1.00 breathes at about 4.2 seconds per cycle, a
field at flow 0.30 at about 11 seconds. A person watching the wheel is then
watching their own throughput, and a practitioner across the room can read
somebody's flow without a number. *Cost:* the same sine with a different
divisor. **Nothing. Small.**

**7c. Charge arrives, it does not appear.** Found by Petra. Applying a story
rewrites the axes and the next frame draws the new state, so the single most
consequential act in the product is invisible. Let the imprints travel: points
leave the core and land at their addresses over 420ms on the product's own
easing, 40ms apart. A person sees where their story went. *Cost:* one extra
pass of up to 24 points for 420ms only, about 0.3ms per frame during the
landing and nothing at rest. *And it is not only decoration:* it builds the
visual vocabulary that Undo needs to reverse, and Undo is the largest
remaining gap in the product. **Medium.**

**7d. The atoms retract when Undo lands.** Found by Petra. The same path as
7c, reversed, over 260ms. Undo without a picture is a claim; Undo with the
hairlines pulling back in is a fact. *Cost:* shares 7c's code. **Small, once
7c exists.**

**7e. Below the horizon, the seat names read upside down.** Found by Petra.
`radialTxt` sets every band name along its own radius, so Heart at the bottom
of the wheel runs bottom to top and a person tilts their head. Flip the
baseline below the horizon, which is what every map and every watch face does.
*Cost:* one conditional on the angle. **Nothing. Small.**

**7f. Depth should read as attention, not as scale.** Found by Sol. Zoom grows
the shapes and the layers that are not resolved stay at full weight, so
magnification reads as a bigger picture rather than as a closer look. Let the
unresolved layers lose contrast as the resolved one gains it. That is the
whole language of a rack focus and it costs one alpha multiply per layer.
**Small.**

**7g. The wash is the slowest thing on screen and it should show it.** Found
by Sol. DQ's background wash is the area of effect and it is cached by
signature, so it snaps. When DQ moves, let the wash crossfade over 900ms while
everything else moves at the 320ms step, so the slowest reading in the
instrument is also the slowest thing in the drawing. *Cost:* one extra canvas
composite for 900ms after a change, nothing at rest. **Medium**, and it needs
a fifth duration token or an argued exception to the four step rule, which
gate 12 enforces. Say which before building.

**7h. The alarm colour, swept.** Found by Mika. `#FF2E1F` is reserved for
something being wrong, and `ui/wheel.js` line 652 uses it correctly on an
address past 9, where high is bad. The key row's `hot:false` fix is in and
correct. The sweep that has not been done is every other `cr()` call in the
product where high is the good end. This has been a real defect twice. *Cost:*
none, it is a read. **Small.**

---

## 8. What I Did Not Fix, And Whose Call It Is

**Coherence is printed four times on one screen.** The chip, the right rail,
the wheel core and the swing strip. Each of the four has a defensible reason
to exist and no two of them can be removed without an argument about where the
product's answer lives. That is an information architecture ruling, not an art
direction one, and it should be made once and applied everywhere rather than
argued four times. It is the one thing keeping the Field off an A.

**The word Awareness, carrying two concepts.** The left rail section and the
chip. One of them gives the word up. My recommendation is the chip, because
the section is a place and the chip is a reading, and a reading can be renamed
to what it measures: intention read against distortion. But the naming is
editorial and the ruling is not mine.

**Whether Pole belongs on the stage at all.** I moved it to the left rail on a
scale argument and I have given the pixel cost of putting it back.

---

## 9. Build Order

### Small. Nothing new, and it removes more than it adds

1. Delete `.tl#tl` from `shell/body.html` and the `#pol` and `#tier` writers
   from `ui/ui.js`. This is AE2, AE3 and the weird text in one cut.
2. Swap `.acc-l` to before the ring in `ui/personas.js` renderAcc. AE4, first
   half.
3. Remove the dead `.acc-n` rule at `shell/head.html` line 1338.
4. `bc()` in `ui/component.js` line 153 learns Lumen. This is the line that
   makes AD2 true.
5. Reconcile the Lumen CSS seat tokens to `PAL_VIVID`.
6. Add `lumen` to the lighting loop in `tests/design.js` gate 13.
7. Move Pole out of `#key` and into the left rail Fetters section.
8. 7b, the breath reads flow. 7e, the seat names flip below the horizon.
9. 7h, sweep the alarm colour against every reading where high is good.

### Medium. The layout, the contrast, and the first half of the compass

10. The three row stage, the two strips, the four tokens. AE1 and AE4.
11. `#key` wraps at 390 instead of scrolling. Repeal `head.html` line 2647.
12. Every lighting whose Field stage is `#101010` sets its own ink, the way
    `body.lumen .stage` already does. This is the contrast fix and without it
    item 10 ships unreadable in Snow.
13. Compass passes 1, 2, 3, 4 and 6: full centre, the figure fills the box,
    labels leadered, depth sorted paint, the vivid palette on the canvas.
14. `tests/collide.js` learns `TAB.COMPASS`. The nameplate assertion exists
    and has never looked at the surface with 89 overlaps on it.
15. 7a, the atomization at rest.

### Large. The parts that need a ruling before they start

16. **The per tab right rail.** Decide it before building anything in 13. It
    is the real cost of the reversal.
17. Compass passes 5, 7, 8, 9 and 10: rotation, the lit band, your plane, the
    context on every number, the slide. AF2 and AF3.
18. AJ1 swept across the Field and the compass. The compass currently says
    "You read 39, below the oscillating band. Integrity 6.2, coherence 39" and
    that is his own example of the defect.
19. 7c and 7d, charge arriving and Undo retracting. These two are a design
    dependency of Undo, which is the largest gap in the product.
20. Where the product's one answer lives. Section 8.

---

## 10. The Grades

    surface              now          after Small   after Medium   after Large
    Field top row        D            C             B              A minus
    Field as a whole     C minus      C plus        B minus        B plus
    Compass              D minus      D             B minus        A minus
    Lumen                C            B plus        A minus        A minus

Lumen jumps furthest on the Small pass because one of its two defects is a
single ternary, and the lighting is currently shipping a white frame around a
dark app.

The Field cannot reach A while its answer is printed four times, and the
compass cannot reach A while the product has not ruled on the rail.

---

Files: `reviews/AD-field-compass.md`, `reviews/compass-passes.html`.
Nothing else was touched.
