# DESIGN-nav

The navigation becomes two levels. Four doors instead of nine, Intake off the
bar and into the rail, and the second row left justified with the first.

His ruling is at `TASKS.md` section 08a and is quoted there in full. This file
is the port: what changes, what may not change, what it costs, and the five
things only he can rule on.

The prototype is `proto/nav/index.html`. It stands alone, it references
`../../engine.js` and never copies it, and it makes no outbound request. The
run that proves that is `proto/nav/requests-1600.log` and
`proto/nav/requests-390.log`: two requests at each width, both local file
reads, no page errors. The screenshots are beside them, and the port's own
measurements, taken on the build rather than on the prototype, are in
`proto/nav/port.log`.

Three tools sit with it. `count.js` counts simultaneous choices on
`source.html`, surface by surface, at both widths. `measure-port.js` applies
the port inside the built page and reads the chrome back. `shots.js` takes the
screenshots and the request logs and exits non zero on an outbound request, a
page error or a failing gate.

**Nothing in `atuned_src/` is touched by this file.** Other seats are live
there. This is the specification and the measurement.

---

## 1. The structure

    Ritual      surface 10
    Story       surface 0        Summary 1
    Tools       container        Field 2, Body 3, Compass 8
    Insight     container        Knowledge 6, Games 7

    Intake      surface 5        a button in the left rail, above Awareness
    Settings    surface 9        no door, reached from the profile button
    Analytics   surface 4        folded into Summary, and still folded

Every integer above is the integer that surface already has. Nothing is
renumbered. Energetics is renamed Intake and keeps integer 5 and host `#iq`.

### The table, and it is the whole port

```js
/* NAVBAR is DISPLAY STRUCTURE, the way TABDEF is DISPLAY ORDER. Every value
   is a TAB integer read off the engine's own constant. Nothing here is a
   position and nothing here is a string a renderer parses.

   own is the door's own surface, or null where the door is a container with
   no surface behind it. kids are the surfaces that sit under it. */
const NAVBAR=[
 {nm:'Ritual',  own:TAB.RITUAL, kids:[]},
 {nm:'Story',   own:TAB.STORY,  kids:[TAB.SUMMARY]},
 {nm:'Tools',   own:null,       kids:[TAB.FIELD,TAB.ENERGY,TAB.COMPASS]},
 {nm:'Insight', own:null,       kids:[TAB.KNOW,TAB.GAMES]}];

/* Intake comes off the bar and keeps its integer. It is named here rather
   than in NAVBAR because it is a rail control, not a door. */
const RAILDOOR=TAB.INTAKE;

/* the door that carries a surface, by key and never by position */
const DOOROF=function(k){
 for(var i=0;i<NAVBAR.length;i++){
  if(NAVBAR[i].own===k)return NAVBAR[i];
  if(NAVBAR[i].kids.indexOf(k)>=0)return NAVBAR[i];}
 return null;};
```

`NAVBAR` belongs in `engine/core.js` beside `TABDEF`, because it is data and
the engine already owns the tab tables. `DOOROF` goes with it. Neither touches
a document, so `hostfree.py` stays green.

### What may not change, and why the rule exists

**The TAB integers do not move.** They are identity, persisted and compared.
`TABDEF` stays exactly as it is: it remains the list of surfaces that have a
door, and `TABOF` still resolves a key to its entry. `NAVBAR` sits on top of
it and says which door each one lives under. A stored tab from a session
before this change still resolves, because nothing it could hold has changed
value.

**Grouping is not folding, and the difference is in the document.** The fold
moved `#ana` inside `#sum`, and the parent's renderer, which writes the whole
`innerHTML` of its host, deleted the child on the way past. The functional
gate caught it. This change moves no host. `#sum` stays a sibling of `#story`,
`#games` stays a sibling of `#know`. Every surface keeps its own host, its own
renderer and its own entry, and the only thing that knows about the grouping
is the bar.

**Games stays unfolded.** It was pulled back out of Knowledge on the ruling
that they are independent games, somewhere a person goes for brain release,
and a game folded into a reference page is neither. Putting both under Insight
does not fold one into the other: they are two hosts under one door, and the
gate below asserts exactly that by name.

### The gate that keeps them apart

Ten checks, running in the prototype and green at both widths. They belong in
`tests/functional.js` when this lands. Read them off
`proto/nav/index.html`, function `gate()`. The three that matter most:

    every grouped surface keeps its own host
      every key in NAVBAR resolves through TABOF to a distinct host id. A fold
      would make two keys share one id and this fails on it.

    Knowledge and Games are two hosts under one door
      named, because the unfold ruling is the reason the check exists.

    Summary is under Story and is its own host
      #sum is not a descendant of #story and Story's renderer cannot reach it.

The remaining seven check that every door in `TABDEF` is placed exactly once,
that no door names a surface the engine does not carry, that Analytics still
resolves to Summary through `TABREAL`, that Settings still has no door and
still resolves to itself, that Intake is still integer 5 at host `#iq`, that
nothing is under 44 by 44, and that the second row starts at the same x as the
first.

---

## 2. The open question, and it is his

**Nothing in the ruling says what a parent does when pressed.** Ritual and
Story are surfaces. Tools and Insight are not. Both answers are built in the
prototype and the toggle at the top switches between them.

### A. A door opens its first child

Tools opens Field. Insight opens Knowledge. Every door lands somewhere and
nothing is ever a dead press.

    cost   Tools becomes a second name for Field, and Insight a second name
           for Knowledge. A person on Compass who presses Tools is taken to
           Field, which is a door that moves them somewhere they did not ask
           to go. The first child of each group becomes privileged in a way
           nothing in the product says it is.
    buys   Field and Knowledge stay one press away, so four of the nine
           surfaces cost nothing extra.

### B. A door opens its row and leaves the centre alone

Pressing Tools reveals Field, Body and Compass and does not move the stage.

    cost   Every surface under a container goes to two presses. On a first run
           a person presses Tools, the centre does not change, and a button
           that does not visibly do anything reads as broken. The row below it
           is the only thing that moved, and it moved 44 pixels below where
           they were looking.
    buys   A door means one thing. Tools is a place that holds instruments and
           is not a synonym for any of them.

### C. A door opens the child you were last on

Not built, because it is A with a memory and costs nothing extra to write.

    cost   The same press gives different results on different days. In an
           instrument that is worse than either A or B.

**The recommendation, and it is a recommendation and not a ruling.** A, with
one correction that removes its worst edge: a container door opens its first
child **only when the surface you are on is not already under it.** Press
Tools from Summary and you land on Field. Press Tools while on Compass and
nothing moves, because you are already there. That keeps every door landing
somewhere, keeps Compass from being yanked to Field, and costs one condition.

---

## 3. What it costs a person in presses

Nine surfaces, measured. Before, every surface is one press. After, under
option A:

    Intake      1 -> 1    rail button, above Awareness
    Ritual      1 -> 1    the door is the surface
    Story       1 -> 1    the door is the surface
    Field       1 -> 1    Tools opens it
    Knowledge   1 -> 1    Insight opens it
    Summary     1 -> 2    Story, then Summary
    Body        1 -> 2    Tools, then Body
    Compass     1 -> 2    Tools, then Compass
    Games       1 -> 2    Insight, then Games

Four surfaces get further away by one press. Under option B it is six:
Field and Knowledge join them.

**And the narrow widths reverse part of that.** Measured on `source.html`,
doors sitting past the right edge of a strip whose only affordance is a 26
pixel fade:

    360    5     Body, Compass, Knowledge, Games, Summary
    390    5     Body, Compass, Knowledge, Games, Summary
    430    4     Compass, Knowledge, Games, Summary
    1280   3     Knowledge, Games, Summary
    1600   0

**It is not only a phone problem, and that is the part worth stopping on.** At
1280, which is a laptop, Knowledge, Games and Summary are already off the end
of the strip. So today those surfaces cost one press **plus a horizontal drag
on a strip most people will not know is there**, on every width below 1600.
After the change four doors fit at 360 and nothing is past the edge at any
width measured, so the surfaces that went to two presses cost two presses that
are both on screen. Below 1600 this makes them cheaper, not dearer.

    doors past the right edge    360   5 -> 0
                                 390   5 -> 0
                                1280   3 -> 0
                                1600   0 -> 0

The run is `proto/nav/port.log`.

---

## 4. What it buys in simultaneous choices, and it is not much

Measured on `source.html` with `proto/nav/count.js`, which walks TABDEF and
TABEXTRA at run time and counts every interactive element with a box on
screen. Every run stamps the build's md5, because `source.html` moves under a
seat that is reading it and a figure with no build behind it cannot be checked
later. Nothing behind a closed accordion counts; the header that holds it
counts once.

**Per surface, everything in the document:**

    Summary 85, Ritual 92, Games 98, Field 99, Story 103, Body 105,
    Compass 106, Energetics 119, Knowledge 221
    range 85 to 221, median 103

**Per surface, inside the first viewport, which is what simultaneous means:**

    at 1600    Body 64, Field 69, Games 72, Summary 75, Ritual 76,
               Compass 80, Energetics 82, Knowledge 125
               range 64 to 125, median 76
    at 390     range 13 to 24, median 17

The 1600 figures bracket and exceed the standing 57 to 71 in `CLAUDE.md`. The
390 figures are low for a bad reason: the rails do not collapse on a phone,
they stack, so 85 to 221 controls are still in the document and 13 to 24 of
them are on screen. **On six of the nine surfaces at 390 the entire first
viewport is navigation:** 11 of the 13 to 24 visible controls are the top bar.

**What this change moves:**

    choices in the top chrome, 1600 and 390 alike
      before   14, and 15 on Field and Body where the sub bar is drawn
      after    9 on Intake, 10 on Ritual, 11 on Story, Summary, Knowledge
               and Games, 12 on Field, Body and Compass
      delta    2 to 5 fewer

Against a per surface total of 85 to 221, that is between 1 and 6 per cent.
**Say it plainly: this is a navigation fix and not a cognitive load fix.** The
standing item of 57 to 71 simultaneous choices against a working memory of
about four is untouched by it. Nine doors becoming four, with the children of
the open door showing and the rest not, does cut the bar from nine words to
between four and seven. It does not touch the rails, and the rails are where
the count actually lives: the left rail alone is 52 controls on every surface
but Settings, at both widths, on every tab.

**The next move on cognitive load is the left rail, not the bar.** 52 controls
in one column, open on arrival, on nine surfaces out of nine.

---

## 5. What it costs in chrome, and this is the real price

Measured on `source.html` by `proto/nav/measure-port.js`, which applies the
port in the page and reads the heights back. The run is `proto/nav/port.log`.

    at 1600 and at 1280
      top bar                     65 -> 58
      sub bar                     62 -> 46   folded onto the bar's own edge
      chrome on Field and Body   127 -> 104     18.1 per cent off
      chrome on the other seven   65 -> 104     60 per cent on

    at 390
      top bar                    239 -> 176     26.4 per cent off
      chrome on Field and Body   301 -> 266     11.6 per cent off
      chrome on the other seven  239 -> 222      7.1 per cent off

**On Field and Body at 390 the second row wraps, and that is correct.** Those
two surfaces already put their own tools in the sub bar, so at 390 the row
carries three children and four depths and does not fit: it goes to two lines,
46 pixels becomes 90, and the standing rule is wrap rather than hide. The top
bar's 63 pixel saving still pays for it, which is why Field is 301 to 266 and
not 301 to 312.

**A second row of navigation costs a second row.** At 390 the top bar pays for
it four times over, because nine doors wrap that bar into four rows and four
doors fit beside the wordmark on one. At 1600 and 1280 the bar was never
wrapping, it was scrolling, so there is no height to recover and the seven
surfaces that have no sub bar today gain 39 pixels.

Two ways to pay the 39, and the choice is his:

**Reserve the row, which is what is specified here.** The row is always 44
high whether the open door has children or not. A bar whose height answers to
which door is pressed moves the whole stage down and up again on every press,
and these surfaces are instruments: a wheel that jumps 44 pixels when somebody
changes door costs more than the 44 pixels are worth.

**Or put the children on the same row as the doors, behind a rule.** Chrome
then falls 7 pixels on every surface instead of rising 39 on seven of them.
The cost is that it is no longer what he asked for: "left justified with the
top menu items" describes a row that begins where the doors begin, and a strip
that begins after the doors end is a different thing.

---

## 6. The second row starts at the first menu item

His words: "I do not want the sub tools to start underneath the logo, they
need to start left justified with the top menu items."

Measured on the build at 1600: the first menu item starts at x 129 and the sub
bar's first control starts at x 18. **111 pixels apart, and the sub bar is
under the wordmark.**

The fix is one custom property and it is read rather than typed:

```js
/* THE GUTTER IS A DIFFERENCE BETWEEN TWO MEASURED LEFTS, which is why it
   cannot be a number in the sheet. The sub bar does not start at the window's
   left edge, it starts at its own margin, so a padding set to the door's
   absolute x lands that margin further right again. Both lefts are read and
   the difference is written once, on layout and on resize. */
function navGutter(){
 var b=document.querySelector('#tabbar .tabtop'), sb=$('subbar');
 if(!b||!sb)return;
 var x=Math.round(b.getBoundingClientRect().left-sb.getBoundingClientRect().left);
 document.documentElement.style.setProperty('--navgut',Math.max(0,x)+'px');}
```

```css
.subbar{padding-left:var(--navgut,13px)}
```

Measured after the fix: first door at x 127, second row's first word at x 128.
One pixel, which is a rounding and not a misalignment. At 390 the wordmark and
the four doors share a row, so the gutter is 124 and the second row starts
under the doors rather than under the wordmark, which is the ruling holding at
a width where it costs a third of the row. **See the question at the end.**

Two lessons are built into that function and must not be optimised out. It
reads the button and not the strip that holds it, because the two were eight
pixels apart and his ruling is about where the first word starts. And it
subtracts the sub bar's own origin, because the first cut did not and landed
the row eight pixels right of the doors after appearing to be correct.

---

## 7. Sharpening, in numbers

His words: "this looks like a GUI, streamline it a bit, sharpen it by twenty
percent, thirty percent." Applied to the navigation only, since that is what
this pass touches. Every figure is against a measured before.

    what                  before        after        change
    bar padding           9px           6px          33 per cent off
    strip gap             5px           2px          60 per cent off
    door label            14px          13px          7 per cent off
    weight spread         0             180          420 against 600
    sub bar               its own slab  the bar's second row, on one hairline
    top bar at 1600       65px          58px         10.8 per cent off
    top bar at 390        239px         176px        26.4 per cent off
    chrome, Field, 1600   127px         104px        18.1 per cent off
    chrome, Field, 390    301px         266px        11.6 per cent off

**The tap floor does not move.** Every door stays 44 by 44 and the second row
stays 44 high. The density comes out of the chrome around the target and never
out of the target, and the gate counts doors under the floor and reads zero.

**The weight spread is the one that is free.** Today the pressed door differs
from the other eight by a 2 pixel underline and a colour step, and the weight
is identical across all nine: measured, the strip's total width does not
change by a pixel when the pressed door changes. Inter is carried in the build
as a variable font at 300 to 700, so a pressed door can be 600 against 420 at
no cost in bytes and no cost in layout, and the state is then legible in
peripheral vision instead of only under the label.

**Two edges become one.** The bar and the sub bar are two glass slabs stacked
with a gap. They become one block with a hairline between the rows, and the
pressed door's underline runs down into the row it owns instead of floating
above it. That is 16 pixels of the 62 and it is also the semantic: the row
below belongs to the door above it.

**A door with children says so before it is pressed.** One 11 by 1.5 pixel
rule under the label, in `--dim`, in the accent when the door is open. Without
it Ritual and Tools look identical until pressed, which under option B means a
person cannot tell which doors will move the centre.

**What was checked and is not a defect.** The pressed rule sets
`letter-spacing:0` against the base, which would reflow the strip on every
press. Measured across four presses: the nine widths do not change. The rule
is redundant rather than harmful. It comes out in the sharpening because the
after state carries the weight instead, not because it was breaking anything.

**One collision with the art direction seat, named rather than resolved.**
That seat's hard rule is a rounded sans for body text. This product's typeface
is ruled and is Inter, carried in the file, with Google Fonts gone and gate 7
of `tests/design.js` watching the network. The ruling wins and the collision
is recorded here.

---

## 8. Intake

Energetics is renamed Intake and comes off the bar. It becomes the first
control in the left rail, above the Awareness section, in `shell/body.html`
immediately before `<div class="lsec open" data-sec="soul">`.

It is drawn as a door and not as a section header: 44 high, full width of the
rail, its own border, and the border goes to the accent when the surface is
open. A section header opens a drawer and a door changes the surface, and the
rail has six of the former already.

    integer   5, unchanged
    host      #iq, unchanged
    renderer  renderIntake, unchanged
    label     Intake

`TABDEF` loses its Energetics entry, because `TABDEF` is the bar. Intake moves
to `TABEXTRA`, beside Settings, which is the table that already exists for a
surface with a host, a class and a renderer and no door in the navigation.
`TABOF` reads both, so nothing downstream changes.

**One cost, and it is a phone cost.** On a phone the rails stack below the
centre stage, so the Intake button sits below the fold on every surface. It is
one press, and it is one press after a scroll nothing announces. Today
Energetics is the first door in the bar. This is the one place where the
ruling makes something meaningfully harder to reach, and it is worth a line in
his ear.

---

## 9. What to instrument

Nothing here is measurable after the fact without these four, and all four are
local counters, not a network call.

1. **Presses to first surface change, per session.** If option A is chosen
   this should be 1. If it climbs to 2 the container doors are being pressed
   and then corrected, which is B happening by accident.
2. **Container presses that change nothing.** Under option B, every press of
   Tools or Insight that is not followed within four seconds by a press of one
   of its children is a person finding out the door does nothing.
3. **Surfaces never reached, per profile, in the first five sessions.** The
   four that moved to two presses are Summary, Body, Compass and Games. If any
   of them falls against its own rate from before the change, the second press
   is the cause.
4. **The horizontal drag on the door strip, at any width.** It should go to
   zero at 390 and stay at zero. If it does not, four doors are still not
   fitting somewhere and the fade is still the only thing saying so.

---

## 10. Order of work

1. `NAVBAR`, `RAILDOOR` and `DOOROF` into `engine/core.js`. Intake out of
   `TABDEF` and into `TABEXTRA`, with its label changed to Intake. Nothing
   renumbered. `BUILD-engine.sh` and `hostfree.py` stay green.
2. The bar markup in `shell/body.html`: four buttons instead of nine, each
   carrying `data-tabk` for the door's own surface where it has one. The
   navigation stays written into the document rather than built in a loop,
   which is the ruling recorded beside it.
3. The second row in `#subbar`, built from `NAVBAR` by key. `setTab` paints it
   and the pressed state on both rows, reading each button's own integer.
4. `navGutter()` on layout and on resize. The stylesheet changes in section 7.
5. The Intake button into the left rail in `shell/body.html`.
6. The ten checks from `gate()` into `tests/functional.js`.
7. `node tools/monitor.js`, which reads `TABDEF` and `TABEXTRA` at run time
   and will walk the new bar without being told about it. Then the shots at
   both widths, and look at them.

---

## 11. Five questions, and every one of them is his

1. **What does a container door do when pressed?** A opens its first child, B
   opens only its row, C is A with a memory. The recommendation is A with one
   condition: a container does not move you if you are already under it.
   Section 2 has what each one costs.

2. **Is Insight the word?** The menu rule recorded in `engine/core.js` is his:
   one word, and the word names exactly what the surface does, not what it is
   about and not what it belongs to. Ritual, Story and Tools all pass it.
   Insight names what a person is supposed to get, and Games is under it, and
   Games is brain release rather than insight. It is his word and it stands
   until he moves it, but the rule it sits against is also his.

3. **The 39 pixels at 1600.** Seven of the nine surfaces gain a 44 pixel row
   they do not have today. Reserve the row and keep the ruling, or put the
   children on the doors' row behind a rule and keep the pixels. Section 5.

4. **At 390, does the alignment hold?** The second row starting at the first
   menu item costs 124 pixels of a 390 pixel row, because the wordmark and the
   four doors share the top row on a phone. It is the ruling applied
   literally. The alternative is that below 820 the second row starts at the
   bar's own left edge, where there is no wordmark above it to sit under.

5. **Intake below the fold on a phone.** It is the one surface the ruling
   makes harder to reach, because the rails stack under the centre stage.
   Leave it, or give it a door on the bar at phone widths only.
