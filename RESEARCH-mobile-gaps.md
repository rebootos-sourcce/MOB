# The phone, walked by the six ICPs, and the gaps

Ngozi Achebe-Lindgren, game director. 27 September 2026.

**What this is.** The second half of `TASKS.md` GF, his words: "take the mobile
version... floated by the ICPs and the focus group, until you're satisfied,
have them run through the UI UX user flow, this user story, get their
feedback, get their ability to see the interaction once they understand how
the tool works, and then get their feedback on the value they're experiencing
so far, and then get a gap analysis, and then throw this in the backlog."

The first half of GF, the concrete mobile fixes, was built by another seat
while this ran and landed as `e1863d3`. So this file walks two builds with one
script: the one he held in his hand, and the one that answers him. Every gap
below says what the fix did to it, measured, not what it was meant to do.

**Nothing under `atuned_src/` moved for this file, and `source.html` was not
touched.** The walk script and its evidence are in `proto/mobile/`.

**"The React version" is not answered here.** GF flags it as an open
architecture question. Everything below is the one file build as it ships.

---

# The answer, in eight lines

1. **The fix works for what he named.** Pinch now reaches the picture on all
   three (1.0x to 4.0x, the page never zooms), the picture starts 131 px higher,
   CQ and its readings are in the first screen, undo is gone, the poles are
   inside the picture, the loader prints one line a name, and Help and Profile
   act on the first tap. Measured on both builds.
2. **The biggest gap is the one he did not name, and it is still open.** A tap
   on the picture, the product's discover verb, opens its reading 4,347 to
   4,787 px below the screen on the fixed build (4,710 to 5,150 before) and
   nothing in view changes. 6 of 6 walks, both builds.
3. **The fix introduced one regression, measured.** A tap on the core of the
   Wheel opened the Core reading 6 of 6 times before and 0 of 6 after, across
   three press lengths, blank and loaded. The nine gates did not catch it.
4. **The Field still opens with nothing that says what it is:** 11 words before,
   12 after, against 24 to 151 on every other tab.
5. **Navigation traded one cost for another.** Every tab is now 2 taps and 0
   swipes. Summary went from 3 gestures to 2; the five tabs that were in view
   went from 1 tap to 2.
6. **Two small new frictions from the fix:** after the reframe circle, a phone
   is told to "Scroll on the picture to move in, drag to move it, F to come
   back", which is mouse and keyboard wording; and the loader's group heading
   reads "ICPs".
7. **Value so far, simulated and labelled:** before the fix nobody could get
   into the picture with their fingers. After it, all six can open it, see the
   poles, and read CQ without scrolling; what they still cannot do is learn
   what the thing they touched means, because that answer opens off screen.
8. **Of ten ranked gaps: five closed, one narrowed, four open, plus the
   regression.** The top one is open.

---

# 1. Method

**Two builds.** Before: commit `eae5b75`, `source.html` md5
`03027d3ea056b6f22a8620108686bd1c`, byte identical to the committed file apart
from the build stamp. The file on his phone was `atuned-packed.html`, the same
source except one commit, `7414091`, the glass bar fold, so this is the build he
tested to within one fold control. After: commit `e1863d3`, the committed
`source.html`, md5 `57de1498844dee6efd9fcd8436c5ca7a`; a clean build of that
commit from `git archive` differs from it only in the stamp. The fix seat's
uncommitted tree was never walked.

**The device.** Real Chromium 1194 through Playwright at 390 by 844, device
scale 2, `isMobile` and `hasTouch` on, so `(pointer:coarse)` matches and the
app takes every phone branch it has. One fresh browser context per walk and per
cell of the gesture matrix.

**The touch.** Every tap, hold, swipe and pinch is sent through the DevTools
protocol's `Input.dispatchTouchEvent`, the input path a finger uses:
`touch-action` is honoured, pointer events arrive typed `touch`, and the
browser's own pinch engages where the page allows it. A pinch is two points 60
px apart opening to 240, at the centre of the picture. The compositor's own
synthetic pinch was run beside it as a second check.

**Reproducible, one command per build, from the repo root:**

    NODE_PATH=/opt/node22/lib/node_modules node proto/mobile/walk.js source.html OUTDIR

Outputs committed: `proto/mobile/walk-before-eae5b75.jsonl` and
`proto/mobile/walk-after-e1863d3.jsonl`. Every number marked measured is a line
of one of them. Screenshots: `proto/mobile/observed/before-*.png` and
`after-*.png`. The control counter is `proto/firstrun/walk.js`'s, unchanged.

**Three probe bugs, found and fixed, and why both builds were re-run.** One,
the first matrix reset page zoom with a scale override that then blocked the
next pinch; the matrix now uses a fresh context per cell. Two, on the fixed
build the walk read the wheel's hit table before it had redrawn after a zoom
reset and aimed taps at x 658 on a 374 wide canvas, which read as dead taps;
the walk now returns to the whole picture with a real tap on the reframe
circle, as a person would. Three, the baseline counted a native picker load as
one gesture; on a phone it is two, open and choose, the same two the new loader
costs, so both count two. Both builds were re-run on the final script, and the
baseline numbers in this file are from that run. The headline baseline numbers
(11 words, the 150 px slide, the undo pair at 44 px) did not move.

**Three labels, the way `RESEARCH-90day.md` uses them.**

| Label | What it means here |
|---|---|
| **measured** | A line of a walk output or a screenshot, reproducible from the command above. |
| **judged** | Mine, with the reason shown. |
| **simulated** | What an ICP thinks or feels. Nothing here was said by a real person, and this project has no real user data. The personas and weights are `RESEARCH-icp.md`'s. |

**The people.** The six ICPs from `RESEARCH-icp.md`, with their panel weights:
Diane 180, Derek 170, Marcus 160, Angela 150, Sofia 140, James 100, which is
900 of the 1,000 panel. The three edge cases were not walked; this is a
usability pass, not an acquisition one. Each walk follows the path their own
recorded words predict and ends on a real reading: their own worked example,
loaded the way the build offers it on a phone, or, for Angela, her own
committed story.

**One limit, stated.** Chromium is not Safari. The findings that depend on
browser behaviour that differs on an iPhone say so where they land. His device
is not recorded in GF.

---

# 2. The first screen, before and after, measured

| Measure | Before `eae5b75` | After `e1863d3` |
|---|---|---|
| Boot to `booted` | 5.4 s | 5.4 s |
| Controls in view | 23 | 24 |
| Words in view | 11: "At u ned Source OS Energetics Ritual Story Field Body Profile Dark 1.0x 60 50 40" | 12: "At u ned Source OS Field Root Energetics CQ DQ 0% Accuracy Energy Awareness 1.0x" |
| A sentence saying what this is or what to do | none | none |
| Top of the stage | 252 px | 121 px |
| Top of the picture | 311 px | 180 px |
| Tabs reachable without a swipe | 5 of 9, the rest past the right edge behind a 26 px fade | 9 of 9, behind one folded bar naming the surface |
| Undo and redo on screen, empty stack | yes, 44 px, the undo ringed in gold | gone |
| Pole strip ("heaven and hell") | 711 to 901, under the picture, lower end 57 px past the fold | gone; halo and pitchfork drawn in the core |
| Readings dock (CQ, DQ, accuracy, four more) | 982 to 1141, 138 px under the fold, CQ a 72 px circle, the rest 44 px circles | 648 to 777, in the first screen, seven square tiles, 48 px tall |
| Lighting | a 110 by 44 button in the bar | inside the folded menu |
| Profile loader | a full width native picker | a 44 px circle beside Help and Profile |

Screenshots: `before-01-landing.png`, `after-01-landing.png`.

**Each tab's first screen on Diane's loaded profile (measured, part 4):**

| Tab | Words before | Words after |
|---|---|---|
| Energetics | 103 | 103 |
| Ritual | 83 | 92 |
| Story | 52 | 62 |
| **Field** | **11** | **12** |
| Body | 26 | 24 |
| Compass | 49 | 57 |
| Knowledge | 47 | 47 |
| Games | 132 | 142 |
| Summary | 101 | 151 |

The app opens on the one surface that says the least, on both builds.

---

# 3. The gestures, before and after, measured

One fresh context per cell. Blank profile and Marcus's worked example gave the
same result in every pinch cell.

| Gesture | Before: Wheel | Before: Frames, Dial | After: Wheel | After: Frames, Dial |
|---|---|---|---|---|
| **Two finger pinch** | picture slides 150 px left, zoom stays 1.0x | page zooms to 5x, picture stays 1.0x; the header and glass bar fill the screen, picture 16 to 30 percent of it | **1.0x to 4.0x**, page stays 1x | **1.0x to 4.0x**, page stays 1x |
| Compositor's own pinch | nothing | nothing | 1.0x to 2.48x | 1.0x to 2.48x |
| **Zoom +** circle | 1 tap, 1.25x | 1 tap, 1.25x | same | same |
| **Tap on an address mark** | reading opens 4,733 to 5,150 px down, nothing in view moves | same | reading opens 4,370 to 4,787 px down, nothing in view moves | same |
| **Tap on the core** (separate probe, 6 tries each) | Core reading opens, 6 of 6 | n/a | **nothing opens, 0 of 6** | n/a |
| Charge written by any gesture | no | no | no | no |

**Why the pinch failed before.** `canvas#cv` carries `touch-action:pan-y` on a
coarse pointer (`atuned_src/shell/head.html:1350`), which forbids the browser's
pinch, and nothing in the build answered two fingers, so the first finger armed
the pan and the spread was read as a drag. `#frend` had no `touch-action` rule,
so the browser zoomed the document instead. The fix adds `fieldPinch` in
`ui/ui.js` on both hosts and `pan-y` on `#frend`. Screenshots:
`before-02-pinch-wheel-slides.png`, `before-03-pinch-frames-page-zoom.png`,
`after-02-pinch-wheel-4x.png`, `after-03-pinch-frames-4x.png`.

**The core tap, measured with a separate probe**, `proto/mobile/coretap.js`,
because the walk only taps the core when no address is in reach: press lengths of 60, 150 and 300 ms, on a
blank profile and on Diane's, on each build. Before: the Core reading, 6 of 6.
After: nothing, 0 of 6. The Core reading is still reachable through the CQ tile,
which on the fixed build opens it on the first tap. The halo and pitchfork now
sit on the core (see gap 6), so the core is also now where the poles are
pressed; which of the fix's changes swallows the core's own press was not
traced here. That belongs to the fix seat.

**CQ, measured on the readings dock.**

| Action on CQ | Before | After |
|---|---|---|
| One tap | a line shows under the finger, is gone after the lift, nothing opens | the Core reading opens, at 4,079 px, off screen |
| Hold 1.5 s | "Coherence. The 21 laws, summed." shows while held, gone on lift | the same line is up after the release, 7 percent of the screen |

**The header, every tooltip carrier in the first screen tapped once.** Before:
Brand, Lighting, Help, Profile all show a line during the press, 0 of 4 still
show it 60 ms after the lift, 0 of 4 act, and a second tap opens the lighting
menu, the help sheet and the profile page. The mechanism, traced on the
baseline: showing the tip strips the carrier's `title` (`ui/tip.js:251`), the
tap's compatibility `mousedown` focuses the button, and the `focusin` handler
(`ui/tip.js:327`) no longer recognises the carrier and hides it; iOS Safari
does not focus a button on tap, so on an iPhone the line may have stayed, while
the swallowed first tap happened on both. After: Help and Profile open on the
first tap; Lighting is in the folded menu.

**Undo, before.** `#histpair` and `#undobtn` both carried `hidden` and both
rendered at 44 px, because `.histpair{display:flex}`
(`atuned_src/shell/head.html:807`) outranks the attribute. The ruling in
`body.html` reads "Hidden when the stack is empty rather than sitting there
disabled." After: `display:none` on a phone. The rule at line 807 is unchanged,
so at desktop widths the pair still shows with nothing to undo.

---

# 4. Six walks

Each walk: the path, measured; whether the interaction could be understood,
**measured** as whether each gesture produced the result a person expects;
and value so far, **simulated**, tagged with `RESEARCH-icp.md`'s ledger (BUY,
HOLD, CONFUSE, RESIST, REFUSE). Gestures count every tap, swipe, pinch and the
two taps of a load.

## Diane, 46, founder. 180. Between meetings.

**Path, measured.** Lands on the Field, pinches, returns to the whole picture,
loads her worked example, taps an address. 5 gestures on both builds. CQ 59,
DQ 20.

**Could she read the interaction, measured.** Before: 0 of 2 Field gestures
gave the expected result; the pinch slid the wheel and the tap opened her
reading 4,752 px below. After: the pinch works (1 of 2), and the tap still
opens its reading 4,389 px below. Her CQ is now in the first screen, named, as
"CQ 59%".

**Value so far, simulated.** Before: CONFUSE, then RESIST. "It is a good
picture that does nothing when I touch it." After: HOLD. "Now it moves and I
can see my number. Where is the cost line, and where did that thing I pressed
go." She asked for "a number I do not already have" and "what the 41 is costing
me this quarter" (`RESEARCH-icp.md` section 3). The number arrived. The cost
has not, on either build.

## Derek, 39, high performer. 170. Wants the limiter.

**Path, measured.** Energetics first (opens on "Your energetics were fixed at
the moment you were cut from your mother", 103 words, both builds), back to
the Field, pinch, reframe, load, tap. Before 7 gestures, after 9: each of his
two tab trips costs 2 taps now instead of 1.

**Could he read the interaction, measured.** After: pinch works, CQ opens its
reading on the first tap, a hold explains it and the line stays. The four
readings under CQ still print 0.42, 0.77, 0.62 and 1.00 beside an icon with no
name; a hold on each now names it.

**Value so far, simulated.** Before: RESIST. After: HOLD. "It holds still when
I hold it and tells me what CQ is. It still does not tell me what caps it, and
I had to press four tiles to learn what the decimals are."

## Marcus, 44, creative director. 160. Tests the instrument.

**Path, measured.** Switches to Frames, loads his example, pinches. Before: the
page went to 5x with the header and glass bar filling the screen, and his next
tap, on that zoomed page, landed on nothing; 5 gestures, no reading. After:
Frames to 4.0x, reframe, tap, reading 4,412 px below; 6 gestures.

**Could he read the interaction, measured and judged.** Measured: the pinch
works. Judged, from `after-03-pinch-frames-4x.png` and
`after-04-frames-1x-poles-and-status.png`: at 4x the halo and pitchfork are
large and unmistakable, which is exactly his sentence in GF ("when I zoom in I
can actually see the heaven and hell"). At 1x they are small, and in Frames the
pitchfork is drawn over the "DQ" label. On the wheel the two pole marks measure
14 px across at 1x, well under the 44 px tap floor.

**Value so far, simulated.** Before: HOLD. "The drawing is real. The phone
build is not finished." After: BUY on the picture, RESIST on the words. "Now
the drawing earns the phone. Then it told me to press F."

## Angela, 36, seeker. 150. From a group chat.

**Path, measured.** Story, types her sentence, commits, Field, pinch, reframe,
tap. Before 6 gestures, after 8, the difference being the two tab trips. CQ 0,
DQ 6, on both builds.

**Could she read the interaction, measured.** The story went in. CQ 0 after a
first story is `RESEARCH-firstrun.md`'s finding and not a phone defect. After:
the pinch works; the tap opens its reading 4,347 px below.

**Value so far, simulated.** Before: CONFUSE. After: CONFUSE, softer. "It heard
me in the Story box. The picture moves now. It still says zero, and when I
touch where it hurts nothing comes up."

## Sofia, 41, somatic practitioner. 140. Eleven at night.

**Path, measured.** Ritual (opens on "Build a ritual"), Field, pinch, reframe,
load, tap. Before 7, after 9. CQ 73, DQ 3.

**Could she read the interaction, measured.** After: the loader prints each
client example on one line, at 13 px, grouped; the pinch works; the tap opens
4,455 px below.

**Value so far, simulated.** Before: HOLD. After: HOLD. "Ritual tells me what
to run. I could show a client the picture now. I could not yet let a client
press it alone, because the answer goes somewhere they will not find."

## James, 57, C suite. 100. Opens Summary.

**Path, measured.** Before: Summary sat past the right edge, 2 swipes and a
tap; back to the Field, 1 swipe and a tap; 10 gestures, the most of the six.
After: 2 taps each way, 0 swipes; 9 gestures. CQ 44, DQ 27.

**Could he read the interaction, measured.** Summary gives him his name and
number in its first screen on both builds, 151 words after. After: the pinch
works; the tap opens 4,408 px below.

**Value so far, simulated.** Before: RESIST. After: RESIST, and it is not about
the phone. "The summary is the product. The picture is decoration." He was
always the ICP least served by the picture.

## What the six agree on

| | Diane | Derek | Marcus | Angela | Sofia | James |
|---|---|---|---|---|---|---|
| Gestures, before | 5 | 7 | 5, no reading | 6 | 7 | 10 |
| Gestures, after | 5 | 9 | 6 | 8 | 9 | 9 |
| Pinch reached the picture, before / after | no / yes | no / yes | no / yes | no / yes | no / yes | no / yes |
| Tapped reading in view, before / after | no / no | no / no | not counted / no | no / no | no / no | no / no |
| Value, simulated, before | CONFUSE, RESIST | RESIST | HOLD | CONFUSE | HOLD | RESIST |
| Value, simulated, after | HOLD | HOLD | BUY on the picture | CONFUSE | HOLD | RESIST |

**Measured:** pinch reached the picture for 0 of 6 before and 6 of 6 after. A
tapped reading appeared where the person was looking for 0 of 5 counted before
and 0 of 6 after. **Judged:** the fix moved the six from "this is broken" to
"this works and I do not know what it just told me", which is real progress
and is exactly the distance between a picture and an instrument.

---

# 5. The gap analysis, ranked

Ranked by how many of the six walks the gap blocked (stopped the expected
result) or slowed (cost extra gestures or a scroll), then by panel weight. The
"after" column is measured on `e1863d3`.

| # | Gap: what it does, against what a person needs | ICPs hit | Weight | In GF | After `e1863d3`, measured |
|---|---|---|---|---|---|
| 1 | **A tap on the picture opens its reading more than 4,300 px below, and nothing in view changes.** A person needs the reading where their eye is, or a visible move to it. | 6 of 6, blocked | 900 | no | **open**: 4,347 to 4,787 px, nothing in view moves |
| 2 | **Pinch does not reach the picture.** Wheel slides 150 px; Frames and Dial zoom the page to 5x with the chrome filling the screen. | 6 of 6, blocked | 900 | yes | **closed**: 1.0x to 4.0x on all three, page stays 1x |
| 3 | **The first screen says nothing about what this is.** | 6 of 6, slowed | 900 | no | **open**: 12 words, no sentence. `DESIGN-firstrun.md` carries the design |
| 4 | **The header: 252 px before the stage, 4 tabs past the edge.** | 6 of 6 slowed by height, James blocked | 900 | yes | **closed, with a trade**: stage at 121, all 9 tabs 2 taps and 0 swipes; the 5 tabs that were 1 tap are now 2 |
| 5 | **The first tap on Help, Lighting, Profile and CQ does nothing a person can see.** | 6 of 6 exposed, Derek and James walked into it | 900 | yes, as the hold | **closed** for Help, Profile and CQ: they act on the first tap, and a hold explains and stays |
| 6 | **Poles under the picture, lower end past the fold, unnamed.** | 6 of 6 see it, Marcus examines it | 900 | yes | **closed**: in the core on all three, readable at 4x. At 1x, 14 px marks on the wheel, and the pitchfork crosses "DQ" in Frames, judged |
| 7 | **Undo on screen with nothing to undo.** | 6 of 6 see it | 900 | yes | **closed on a phone**; the CSS defect at `head.html:807` stays at desktop widths, against its own ruling |
| 8 | **Readings dock under the fold, four of seven readings unnamed.** | Diane, Derek, James slowed | 450 | yes, as squares | **narrowed**: in the first screen, 129 px; the four still carry an icon and a decimal, named only on a hold |
| 9 | **Loader: names up to 57 characters, 2 wider than the box.** | 5 of 6 slowed | 750 | yes | **closed**: one line a name, 13 px, 1 of 15 ends in an ellipsis. New: its middle group is headed "ICPs" |
| 10 | **A first story reads CQ 0.** Not a phone defect. | Angela | 150 | no | **open**, tracked in `RESEARCH-firstrun.md` |
| R | **Regression: a tap on the Wheel's core opens nothing.** | exposed to all six, the centre of the picture | 900 | no | **new in `e1863d3`**: 0 of 6, against 6 of 6 before |

**Also named in GF and measured fine on both builds:** the Zoom circles, one tap
to 1.25x on all three pictures.

**Not measured, by his own words.** "Our root domains, this may need some
work" names no defect. For his read, the phone shows a row of four tiles and
the caption "washed, your selection sits here" (`before-06-readings-dock.png`),
which reads as a note to the builder rather than a line to a person. Judged.

---

# 6. The same gaps, through the loop

The loop is discover, play, flow, embody, and it closes.

| Station | Before | After |
|---|---|---|
| **Discover** | the verb, a tap on the picture, has no visible result, and the picture cannot be opened | the picture opens; the verb still has no visible result (gap 1), and the core no longer answers at all (R) |
| **Play** | reachable through text, Story and Games, 1 tap each | the same, 2 taps each |
| **Flow** | the number that moves is under the fold | the number is in the first screen, named, and explains itself on a hold |
| **Embody** | not reached by any of the six on a phone | not reached by any of the six on a phone |

**Judged, and costed where I can.** The fix turned flow on and left discover
half built. A loop whose first verb gives no feedback is not yet a loop on that
device. I will not put a retention number on gap 1: the project's loss model
(`proto/ritual/losssim.js`, used in `RESEARCH-90day.md`) has no parameter for a
gesture that answers off screen, and a number invented here is the kind this
repository keeps being bitten by. As a benchmark from elsewhere, not a promise
here: in the mobile products I have shipped, a primary gesture with no visible
response in the first session shows as a day one cliff rather than a slow leak,
because the person concludes the thing is broken rather than deep.
`RESEARCH-90day.md`'s model already loses 40 percent of the thousand by day 2
with this surface as the landing.

**Build size, judged.** Gap 1 is small to medium: the reading already renders
and already carries "Back to the field"; the work is where it opens on a phone.
R is a defect in code that landed today. Gap 3 is a line of copy plus a design
already drawn. Gap 7's desktop half is one CSS rule. The "F to come back" line
is one string with a phone branch.

---

# 7. Found in passing, for the backlog, not built

1. **The core regression, R above.** A tap on the Wheel's core opens nothing on
   `e1863d3`. Reproduce: build `e1863d3`, 390 by 844 with touch, tap the core;
   the same tap on `eae5b75` opens the Core reading. The gates passed around
   it; a gate that taps the core on a coarse pointer would have caught it.
2. **Undo's CSS at desktop widths**, `atuned_src/shell/head.html:807`:
   `.histpair{display:flex}` outranks `[hidden]`, so "hidden when the stack is
   empty" has not held at any width. A `[hidden]{display:none}` rule on the pair
   and both buttons is the whole fix.
3. **Desktop instructions on a phone.** After the reframe circle, the status
   line reads "Reframed. Scroll on the picture to move in, drag to move it, F to
   come back." (`after-04-frames-1x-poles-and-status.png`), and it pushes the
   stage down about 42 px while it shows. On a phone it wants "pinch" and no key.
4. **"ICPs" as a heading a person reads**, in the new loader list. It is this
   team's word for its customers, not a person's word for anything. For the
   voice seat; "Examples" would also close `RESEARCH-firstrun.md` item 7.
5. **The poles at 1x.** 14 px on the wheel against the 44 px tap floor, and the
   pitchfork over the "DQ" label in Frames. Readable at 4x, which is his stated
   intent, so this is a floor question rather than a defect.
6. **The tooltip's baseline first tap route** lost its own line on Chromium
   through `tip.js:251` and `tip.js:327`. The fix routes controls around it;
   any carrier left on the first tap route keeps the mechanism.
7. **Root Domains' caption** "washed, your selection sits here". For the voice
   seat.

---

# 8. His, and open

Each is written for the person with the vision. None is answered for him.

**1. When a person taps a mark on the picture on a phone, where should its
reading appear?** Today it opens more than 4,300 px below them and nothing
moves, on the build that fixed everything else. Three ways it could go:
- **A sheet that rises over the lower half of the screen.** The picture stays
  in view, the reading is under the thumb, a swipe down closes it. The largest
  build of the three, and the one I would pick: it keeps discover and the thing
  discovered on one screen.
- **The page scrolls down to the reading**, which already carries "Back to the
  field". The smallest build. The picture leaves the screen every time.
- **A short card under the picture**: the name, the seat, the load and one
  line, with the full reading behind it. Medium, and the picture mostly stays.

**2. Now that the tabs fold, is two taps to every surface the right price?**
Quoted from GF: "we're gonna want this to collapse" and "Primary navigation
needs to be in tabs, I think." The fix folds them: every surface is now 2 taps,
where five were 1 and Summary was 3. The other way is a bar of four or five
tabs along the bottom under the thumb, 1 tap each, with the rest one level
down; it costs a ruling on which surfaces are the loop (for example Story,
Field, Ritual, Games).

**3. Is 1.5 seconds the hold you want?** Quoted from GF: "it should pull up a
tooltip if I press for a second and a half." Built exactly that. A phone's own
long press is about half a second, so some people will lift before the line
arrives. Keep 1.5, or match the phone.

**4. Should the Field carry one sentence when it opens?** 12 words and no
sentence, on the surface the app opens on, on the fixed build. The opening
`DESIGN-firstrun.md` is designing answers it fully; the question is whether the
phone gets one line now or waits.

**5. The worked examples in the loader: "ICPs", or "Examples"?** The fix groups
them under "Your own", "ICPs" and "Reference cases". "ICPs" is our word for
our customers. "Examples" says what they are to the person pressing them.

**6. Still open from GF: "the mobile version, the React, React version."**
This file walked the one file build. If a React rebuild of the phone surface is
what you meant, every gap above is re-measured on that, and gap 1 becomes a
design question for that build rather than a fix to this one.
