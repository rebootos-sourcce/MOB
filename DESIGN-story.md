# DESIGN-story.md

The story page, rebuilt. Ruled 20 September, thirteenth pass, high priority,
`TASKS.md` section 0d2.

    prototype   proto/story/story.html
    engine      referenced at ../../engine.js, never copied
    shots       1600 x 1000 and 390 x 844, empty and loaded, looked at
    requests    zero not on file://, logged on every render
    gate        python3 .claude/skills/atuned-voice/check.py, no hard failures

His words: "This is high priority. The most important portion of the product
has gotten the least amount of attention." He is right and the record supports
him. Story is where the content chain starts and it has not been rebuilt once.

---

## 0. What was measured before anything was designed

All of it against the running build at 1600 x 1000, Derek loaded, the boot
sheet and the onboarding closed. Nothing below is a hand count.

    fixed controls on the story surface          19
    of which are the release panel alone         10
    pills                                        32
    "Run a release" bottom edge                  1002px, in a 1000px viewport
    the release footer string                    "3 addresses, 12 patterns,
                                                  about 26 seconds"
    the imprints headline                        "Imprints, 32"
    seat rows                                    "3 held, 16.1, 1 installed"
    the journal ground against the page ground   1.019 to 1
    the reading card ground against the same     1.153 to 1

Two of those need saying out loud. The release button is two pixels below the
fold, which is the thing he complained about, measured. And the release footer
is the string he quoted back at me almost word for word.

---

## 1. SY5. The box does not carry the weight of what it is

This is the item he named as a feeling rather than a rule and it is the one
that matters. It is not answered with decoration. It is answered by reading
what this product already does to a region it treats as consequential, and
noticing that the journal does the opposite of all of it.

### What makes a region feel consequential here, read off the product

The Summary's reading, the right rail's reading, the Compass card and the
knowledge rows all share four moves, and none of the four is ornament:

1. **They rise.** `.s-readbox` sits on `--panel`, and the comment the author
   left beside it says why in the product's own words: *"the reading gets a
   home. It was text on the page ground."*
2. **They hold a measure.** `.s-p` is capped at 66ch. Nothing consequential in
   this product runs the full width of its column.
3. **They light the named things inside the prose.** `.s-w` puts a seat colour
   on any term the engine can name, inside a running sentence, so reading the
   paragraph and reading the field are the same act.
4. **They have a frame with a logic.** A border, a padding of 22px, a radius.

### What the journal did

    .st-hl{background:var(--sunk);border-color:var(--edge)}

`--sunk` is `#090A0E`. The page ground is `#0C0D12`. Measured, that is
**1.019 to 1**: the journal box is darker than the page it sits on. It is a
hole. It is also the only consequential region in this product that is below
the ground, and `--sunk` is the token it shares with `.ip-g`, a 12.5px toggle
button, and `.ip-max`, a 15px icon button.

So the answer to "there's something about the treatment of that box that
doesn't feel special" is not a feeling. The journal is built out of the token
set for form controls, and it is the only thing in the product that sinks.

### What the prototype does, three moves, no decoration

**One. It rises.** The box goes onto `--panel`, the same ground every reading
in this product already sits on, at 1.153 to 1 against the page. The one
surface the whole content chain starts at is now treated like the readings it
produces rather than like a settings input.

**Two. It holds a measure.** 72ch, centred in the column, at 17px on 1.78.
A field that runs the width of its column is a form input. A column of text at
a reading measure is a page, and that difference is doing more work here than
any amount of border or shadow could.

**Three. The instrument marks up the sentence while it is still being
written.** `.st-f` already exists and already lights every fetter the sniffer
finds in the person's own seat colour. Today it is the last thing anybody
notices, because it is happening inside a hole. Made the centre of the
treatment, it is the answer: **this is the only surface in the product where
what a person says becomes what the instrument reads, in front of them, as
they write it.** That is what makes it a journal rather than a text field, and
it is already built.

On top of those three, one micro-interaction and one frame rule, both cheap:

- **The top edge carries the reading.** A 2px rule across the head of the box
  that sits at `--edge-2` while nothing has been found and goes to the seat
  colour of the heaviest thing the sniffer has found so far. It lights to the
  accent on focus, before a word is typed. The owner's ruling that top, bottom,
  left and right each need a logic, applied at the scale of one component: the
  top of the box says what the box has found, the bottom of it carries the one
  control inside it.
- **Nothing sits above the box.** No eyebrow, no label, no control row. The
  first thing on the page is the page.

### What I did not do, and why

I did not give it a serif, a paper texture, a shadow, a ruled line or a date
stamp. Every one of those is a costume for a journal rather than a journal.
The argument above is that the box was being built out of the wrong material,
not that it needed a better skin.

---

## 2. SY1 to SY4. The copy, the button, the light, the typing

**SY1. Too much copy, and "The Day" goes.** Measured. Copy around the box:

    before   "The day" 2 + "Record" 1 + the privacy note 16
             + the placeholder 14                                 = 33 words
    after    the placeholder 6 + the privacy note 13              = 19 words
    above the box, before                                          19 words
    above the box, after                                           0 words

The placeholder is now **"What happened. In your own words."** The second
sentence is not new copy: "in your own words" already ships at
`ui/component.js:412` and is the fix the voice skill records for V10. Reuse
beats invention and it satisfies one word per concept.

**SY4. Click in and type.** There is no mode to choose. The textarea is the
default target, the record button is a single control inside it, and nothing
asks a person which way they are going to do this before they do it.

**SY2. The record button.** Circular, 56px, lower right, inside the field.
56 rather than 44 because it is the only control living inside the writing
surface and it is pressed with a thumb on a phone. Ring, never fill: at rest
it is a ring around a microphone, while listening it is a ring around a stop
square. The textarea carries 96px of bottom padding so text never runs under
it. Press it and it restarts recording onto what is already there, which is
the behaviour `ui/storyui.js:269` already has with `var base=ST_TEXT`.

**SY3. The red light.** Upper left, inside the field, present only while the
microphone is open, `--alarm` with a 4px soft halo and a 1.5s pulse that stops
under `prefers-reduced-motion`. The box border goes to a 42 per cent alarm
mix at the same time, so the signal is at two scales and neither is a word.

The standing ruling that the privacy line is said before the microphone opens
is kept. It is one sentence now instead of two, and it sits under the writing
rather than above it: **"Recording sends audio to your browser's speech
service. Typing stays on this device."** Both facts are load bearing and
neither is negotiable. Putting it below the box means it is read on the way to
the button and is never sitting between somebody and the page they came to
write on.

**SY6.** Already done. Commit is Commit. The count that used to ride on it
("Commit 3") was a figure with no unit; the pending pills in the cloud are the
count, and they are a shape rather than a number.

---

## 3. SR. The release panel, and SR5's redesign

His ruling: "this should be a type panel, a mini release I can run directly
from here, and I should be able to select it from the imprints panel. So
heaviest in this story is meaningless because I can select the one I want to
run, and select multiple."

That one sentence retires eight controls, because once selection is the
selector there is nothing left for the other buttons to do.

    before                                      after
    From: Heaviest | This story        (2)      the selection, or the heaviest
                                                as a default when nothing is
                                                picked
    Addresses: 1 | 3 | 5 | 8           (4)      gone. The selection is the count.
    Pace: Slow | Steady | Quick        (3)      a number field, default 1
    Run a release                      (1)      Run release, at the top
    Detail                             (1)      gone. Pressing a pill is the
                                                detail.
    Release N                          (1)      gone. Run release is the one
                                                verb on this panel.

**SR4. Above the fold, measured.** The release card is the first thing in the
right column. Run release bottom edge:

    1600 x 1000   before 1002 (below)     after 208 (above)
    390 x 844     after 700 (above), with the journal capped at 44vh on a
                  phone so the card's controls are reached without a scroll

**SR3. Pace is a typed field.** `type="number"`, min 0.4, max 12, step 0.1,
default 1, 44px tall, labelled `Pace ... seconds a line`. The unit is on the
label because the value is what a person types. `RUN_SPEED_S` and its three
named speeds go: a number a person sets is not a feeling the product names for
them.

**SR5, the redesign, stated as the proposal it needs.** The release panel is
two controls and a list. The list is what will run. The pace is what a person
types. Run release is the verb. Everything else was a question that selection
already answers.

**SX2 and the collision it creates, which is his call.** He said, three times,
get rid of "three addresses, twelve patterns, about twenty six seconds". I
have. But `ui/storyui.js:113` carries a recorded corpse: that line exists
because the panel used to print the address count followed by the word
patterns, and a person choosing three was quoted three while the run spent up
to twenty five from a weekly grant of ten. The standing ruling is that a person
sees what a run costs before they begin it.

Both rulings are his and both stand. My resolution is that they land in
different places: **the cost leaves the story page and moves to the release
runner's first frame**, which already exists and is already the moment of
commitment. Nothing on the story page counts anything. Nothing bills anybody
without saying so. **This is his to confirm.**

---

## 4. SI3. How two imprints work through you, and it is computed

The interesting item, and the answer was already in the engine.

`compute()` builds the ladder the owner wrote out in his own words in section
0g2: addresses compound into saboteurs, pairs of saboteurs into complexes,
families of complexes into hyper complexes, pairs of those into the superego.
Node, cluster, network, named for a developer instead of for a person.

So "how do these two work together" is a filter over what compute already
returned, not a sentence anybody writes.

### The function

There is **no single existing function that takes two addresses**, and I am not
going to claim one. What exists is the one address version of exactly this
question, shipping in two places:

    ui/drills.js:192   var owners=[].concat(r.sups,r.hys,r.cxs,r.sabs)
                        .filter(function(o){return leaves(o).indexOf(n)>=0;});
    ui/mapshelf.js:95  the same expression, verbatim

The pair version is that expression intersected. In the prototype it is
`pairPath`, and it is four lines:

    function chainOf(r){return [].concat(r.sups,r.hys,r.cxs,r.sabs);}
    function ownersOf(r,n){return chainOf(r).filter(function(o){
     return leaves(o).indexOf(n)>=0;});}
    function pairPath(r,a,b){
     var A=ownersOf(r,a);
     return A.filter(function(o){return leaves(o).indexOf(b)>=0;});}

`compute()` is called once. `leaves()` is `ui/component.js:192` unchanged. No
new arithmetic, no coefficient, no engine change. The identity comparison is
safe because `BY[i]` and `leaves()` both hand back the live `W` objects.

**So the answer to the question in the brief: `compute()` plus `leaves()`.
Specifically `r.sups`, `r.hys`, `r.cxs` and `r.sabs` filtered by
`leaves(o).indexOf(n)>=0` for both nodes. The new function to add is
`pairPath(r,a,b)` and it belongs in `ui/imprints.js`, not in the engine,
because it computes nothing.**

### What it returns on real records, measured

Derek, Need For Approval and Manipulation Through Emotion:

    sab   Deflector 6.0, Imposter 5.5, Stickler 5.0, Perfectionist 5.0
    cx    Deflector + Imposter 5.8, Stickler + Perfectionist 5.0
    hy    Collapse 4.7

James, Blame and Envy:

    sup   Predatory / Dysregulation 5.9
    hy    Predatory 5.9
    cx    Heart Striker + Sacral Striker 5.4, Imposter + Martyr 5.9

Derek, Need For Approval and Pride: empty. Which is also a real answer.

### The sentence

Definition first, present tense, the person as the subject, every figure
carrying its unit, and the ladder carried by the verbs rather than by a gloss:

    Both feed Deflector, at a weight of 6.0. Deflector pairs into the complex
    Deflector + Imposter, at a weight of 5.8. Above that they compound into
    Collapse, at a weight of 4.7.

And when nothing is shared, which is the case the product has never had a line
for:

    Nothing compounds these two. They fire on their own, and releasing one
    leaves the other where it is.

Both clean through the voice gate. The eyebrow over it is **"How they run
through you"**, which is `ui/drills.js:196`'s existing eyebrow put in the
plural rather than a new one.

**SI2, one selection.** The same block, cut to what fits: the badge, the name,
the seat and its nerve, one sentence naming the weight and the axis it sits on,
and the chips for what it feeds. That is `runNodeDrill` shortened, not a second
reading of the same address.

**SI1.** An `Imprints` control at the top right of the surface, with an
outbound arrow, which opens the full page. One control, one word, and the
word says where it goes.

---

## 5. SX3. One figure treatment, and a defect found on the way

**SX3.** Every pill is now the product's own badge: the seat ring carrying the
reading, the glyph in the middle, the figure in a pill overlapping the lower
right, and the name beside it. That is `crBadge` in `ui/component.js:150` and
`crbNode` at 183, which the release list on this very page already uses. The
port reuses those calls. The prototype carries the geometry by value only
because it has to stand alone.

**And the size channel goes.** `impPill` scaled its font from 13px to 17px and
its padding from 6px to 11px by magnitude. That is a second magnitude channel
on a component whose ring is already the magnitude channel, and it is the same
defect recorded at `FE3` for the feathers: a quantity put on a visual channel
that is already carrying something else. One size, and the ring reads it.

### The defect. What is filled in is not an imprint.

Found while reproducing the "already loaded" report and it is the real thing
underneath it. `impLive()` at `ui/imprints.js:11` returns
`n.sq>=4 || n.pole>=4`, and `impRender` prints the length of that as
"Imprints, N". Measured on the reference records:

    Sofia    Imprints, 49     held 0     filled in 49
    Angela   Imprints, 33     held 0     filled in 33
    Marcus   Imprints, 8      held 0     filled in 8
    Derek    Imprints, 32     held 20    filled in 12
    James    Imprints, 24     held 18    filled in 6

Three of the six reference people are told they are carrying between eight and
forty nine imprints while holding nothing at all. Every one of those pills is
an installed coherent opposite, which is what a release **produces**. The panel
is counting the cure as the disease.

The seat rows say it out loud and contradict themselves in the same breath:

    Sofia, Crown       nothing held, 14 installed
    Angela, Heart      nothing held, 8 installed

A slot keeps its label and the value carries the state. A row that says nothing
is held and then prints fourteen of them is a label arguing with its own value.

**And it is his "fifteen something at third eye".** SX2 quotes him as "for help
fifteen something at third eye, get rid of all that". That string is
`ui/imprints.js:109`, and the number he saw is the installed count.

**The fix.** Held addresses are the imprints cloud. Installed poles keep their
place on the page and lose the word: they go under their own heading,
**Filled in**, below the cloud, at 72 per cent opacity and not selectable for a
release, because there is nothing there to release. "Filled in" is the
product's own term, already printing in the Summary rail as "Filled in,
12 addresses". Reuse again.

**SX2, the seat rows.** The seat row carries the seat name in the seat colour
and nothing else. His ruling: people can count how many patterns are under the
third eye. The sum with no unit ("3 held, 16.1") goes with it.

---

## 6. The loaded state. Reproduced, and it is not what was guessed

The brief asked me to test both ways and say which it is.

**A reference persona does not persist across a reload.** Tested in a real
Chromium, same browser context, persona picked, page reloaded:

    before picking   S.who 0    unread true    live 0
    after picking    S.who 4    unread false   live 33
    after a reload   S.who 0    unread true    live 0

`ui/ui.js:1004` loads persona 0 and then `ui/ui.js:1010` overwrites `CURP` from
the store, so a reload always comes back to the person's own record. The
hypothesis in the brief is wrong, and so is the worry attached to it: there is
no reference persona silently surviving a session.

**A true first run shows nothing.** Clean context, no storage:

    unread true, loaded 0, carrying 0, under 0, measured 0,
    live 0, imprints panel prints the empty state copy,
    zero non-file requests, zero page errors

**But the report is real and section 5 is what it is.** He did not reload. He
picked a record, or was on one, went to the story page, typed nothing, and the
panel printed a headline of up to forty nine imprints and a cloud of pills with
figures on them. On James, node 31 has `pole 4.16`, so **Need For Approval is
one of those pills**, wearing a tick and a 4.2, on a page where nothing has
been entered. That is the name he gave and it reproduces exactly.

So: not a persistence defect, and not nothing. A counting defect, named above,
fixed in the prototype.

One thing found beside it and left for its own line: with Angela, Marcus or
Sofia loaded, `r.unread` is false while `r.loaded.length` is zero. That is the
`carrying` versus `held` boundary `engine/compute.js:212` already documents at
length. It is not new and it is not mine.

---

## 7. SX1. Addresses. The word, the count, the cost

His ruling, and it is a whole app problem rather than a story page one.

### What it costs, counted

    occurrences inside string literals, atuned_src/     168
    files carrying at least one                          32
    heaviest: ui/drills.js 30, engine/data/kb.js 18,
              ui/analytics.js 11, engine/data/cards.js 10,
              ui/ui.js 9, engine/data/canon.js 9
    a glossary head term in engine/data/kb.js            1
    other glossary entries that define themselves
      in terms of it (Allostatic load, Fetter, Node,
      Hardened mask, Letting go, Replacement state,
      Two mechanics)                                     7
    identity that must not move: .addr, n.i, data-addr,
      PKEY, schema field names                           unchanged, 59 sites

`BOOK-ERRATA.md` will need a pass on top of that, because the codex and the
engine already disagree in places and this changes one side of the comparison.

### The word

**Place.** And the argument is not mine, it is the product's, because the
product already uses "place" to explain what an address is. Three shipping
strings:

    engine/ladder.js   Ten distinct addresses opened. Not ten runs. Ten places.
    ui/summary.js      Each one is a place in the body before it is a word.
    ui/release.js      Keep some attention on your body, and notice which
                       place answers.

When a term needs a gloss in three places and the gloss is the same word every
time, the gloss is the term. Adopting it deletes the gloss.

It also survives every real line:

    20 addresses carrying          20 places carrying
    Release empties the address    Release empties the place
    the ring is your 112 addresses the ring is your 112 places
    at a specific node address     at a specific place in the body

### What I checked before proposing it

Measured across shipping string literals, to see what a new term of art would
collide with:

    place / places    28      point / points    44      spot / spots    0
    node / nodes      54      site / sites       0      seat / seats  145

`point` is out: 44 existing uses and a points ladder in scope in
`DESIGN-gamification.md`. `node` is out: it is more jargon than the word being
replaced, and it fails the only test he set. `spot` and `site` are clean but
one is casual and the other is clinical.

`place` looks like the worst of them at 28 until the 28 are read. Nine are the
compound "date, time and place" and "Place of birth", which is bounded and
unambiguous and stays. Three are the glosses above, which the change removes.
The rest are CSS and HTML my regex caught. **The true collision is one bounded
compound, not a term.**

### What it does not touch

Nothing renamed. `.addr`, `n.i`, `data-addr`, `PKEY`, every schema field and
every stored key keeps its spelling. This repository renames identity for
nobody and this is a copy change, not a data change.

### How it should be done, which is not now

Not in the same commit as the story page. It is 168 strings over 32 files, it
crosses the codex, and it needs `tools/terms.py` extended to watch the new term
before the sweep rather than after it, or the two words will run side by side
for a month. One commit, one seat, gated by `terms.py` and by
`node tests/design.js`.

---

## 8. The counts

Measured in a real Chromium, Derek loaded, two imprints selected, by querying
the live DOM. Not a hand count.

    fixed controls on the story surface     before 19      after 7
    of which the release panel                     10             2
    pills                                          32            32
    total interactive on the surface               51            39
    controls above the fold, 1600 x 1000           42            20
    controls above the fold with a selection
      open, 1600 x 1000                             n/a           7
    controls above the fold, 390 x 844              n/a           6
    controls on a blank profile, either width       n/a           5
    anything under 44 x 44                          0             0
    horizontal page scroll at 390                   n/a          none
    Run release above the fold, 1600                no           yes
    Run release above the fold, 390                 n/a          yes
    non-file requests, every render                 n/a          zero
    page errors, every render                       n/a          zero

Seven fixed controls against a working memory of about four is still over, and
five of the seven are unavoidable: write, record, clear, commit, run. The two
that are a choice are the pace field and the Imprints link.

**The five group tabs are the one thing I have left alone and it is a
question.** Seat, Charge, Saboteur, Story and Expression are five simultaneous
choices on a panel whose job is now selection, and grouping belongs on the
imprints page the new button opens. He did not ask for them to go and I am not
removing a shipped feature on my own reading of a brief.

---

## 9. The port

Nothing in `atuned_src/` has been touched. Four other seats are live in there.

### `atuned_src/ui/storyui.js`

1. `stRender`: delete the `.st-hd` block entirely, lines 13 to 35. The eyebrow,
   the record button and the two line note all leave the head.
2. Rebuild `.st-ed` as `.jr`: `--panel` ground, `--r` radius, the 2px top rule
   as a `::before` reading a `--lead` custom property, the 72ch measure on the
   inner wrapper, 17px on 1.78, bottom padding 96px.
3. Add the red light element and the circular record button inside `.jr`.
   `stMic` is unchanged, including every one of its failure paths: they are
   correct and the comment above them says why.
4. Move the privacy sentence under the box, cut to one sentence.
5. `stRelPanel`: delete `RUN_SPEED_S`, `ST_RELN`, `ST_RELSRC`, `ST_RELSPD` and
   every button they drive. The panel becomes the pace input, the run button
   and the list. It moves above `#imp` in the DOM. `meterPlan` stops being
   called here; the cost belongs to the runner's first frame.
6. `stRefresh` gains the `--lead` write and keeps everything else.

### `atuned_src/ui/imprints.js`

1. `impLive()` splits. `impHeld()` is `n.sq>=4`. `impFilled()` is
   `n.sq<4 && n.pole>=4`. Nothing calls one and prints the other's word.
2. `impPill` drops the font-size and padding interpolation and calls
   `crbNode(n,'sm')` plus the name. The three states are the arc, the dash and
   the selected border, not three sizes.
3. The seat row loses its `<em>`. The seat name and the seat colour, nothing
   else.
4. Filled in gets its own heading below the cloud and its pills are not
   selectable.
5. Add `pairPath(r,a,b)` and `pairLine(r,a,b)`. The selection block renders
   above the cloud.
6. `IMP_PICK` already exists and already drives `imprun`. It now also drives
   the release panel's pool, which is the whole of SR2.

### Gates the port has to clear

    ./atuned_src/BUILD.sh
    ./atuned_src/BUILD-engine.sh
    node tests/engine.js
    node tests/functional.js
    node tests/collide.js
    node tests/design.js
    node tools/monitor.js
    python3 tools/terms.py
    python3 .claude/skills/atuned-voice/check.py atuned_src/ui/storyui.js
    python3 .claude/skills/atuned-voice/check.py atuned_src/ui/imprints.js
    node tools/shots.js OUT 1600 1000 && node tools/shots.js OUT 390 844

`tests/functional.js` will need its expectations moved for every deleted
control. That is the point of the gate and it is not a reason to keep them.

---

## 10. What to instrument

So the next round can tell whether any of this worked, rather than asking.

    words written per opened story, median and p90
    share of stories that reach Commit
    share opened by the record button against by typing
    time from the page opening to the first keystroke
    pills selected per release, distribution
    releases run from the story page against from elsewhere
    the selection block: opened, and opened with two or more
    pace values people actually type
    stories abandoned with text in the box

The one that answers SY5 is the second: a box that carries the weight of what
it is gets finished. A box that reads as a settings input gets abandoned with
text in it.

---

## 11. Five questions

1. **The cost line.** Get rid of "three addresses, twelve patterns, about
   twenty six seconds", ruled, and it is gone from the story page. It moves to
   the release runner's first frame, where it is stated once at the moment of
   commitment. Confirm that is where you want it, because the standing ruling
   is that nobody is billed without seeing the bill.
2. **The five group tabs.** Seat, Charge, Saboteur, Story, Expression. Five
   choices on a panel whose job is now selection, and grouping belongs on the
   imprints page the new button opens. Fold them there?
3. **Addresses becomes places.** 168 strings, 32 files, a glossary head term
   and seven entries that define themselves by it. Your word, and a separate
   commit from this one?
4. **Filled in.** Installed poles keep their place on the page and lose the
   word imprint. Sofia reads "Imprints, 49" today with nothing held. Is
   "Filled in" the right heading, or do you want them off the story page
   entirely?
5. **The pace default.** You said default one. One second a line is faster than
   every named speed the panel had, and the old Quick was 1.4. Is one the
   number, or is one the field's unit and you want the default left at what
   Steady was?
