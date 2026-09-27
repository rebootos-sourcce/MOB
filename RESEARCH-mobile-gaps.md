# The phone, walked by the six ICPs, and the gaps

Ngozi Achebe-Lindgren, game director. 27 September 2026.

**What this is.** The second half of `TASKS.md` GF, his words: "take the mobile
version... floated by the ICPs and the focus group, until you're satisfied,
have them run through the UI UX user flow, this user story, get their
feedback, get their ability to see the interaction once they understand how
the tool works, and then get their feedback on the value they're experiencing
so far, and then get a gap analysis, and then throw this in the backlog."

The first half of GF, the concrete mobile fixes, was being built by another
seat in the same working tree while this ran. This file walks the build he
held in his hand, measures every defect he named plus the ones he did not, and
says for each gap whether the fix in flight closes it.

**Nothing under `atuned_src/` moved for this file, and `source.html` was not
touched.** The walk script and its evidence are new, in `proto/mobile/`.

**"The React version" is not answered here.** GF flags it as an open
architecture question. Everything below is the one file build as it ships.

---

# The answer, in seven lines

1. **The tap on the picture, the product's discover verb, has no visible
   result on a phone.** Every ICP tapped a mark; every reading opened between
   4,649 and 5,150 pixels below the top of the screen and nothing in view
   changed. He did not name this one, GF does not list it, and the fix in
   flight does not touch it. It is the largest gap in this file.
2. **Pinch is broken two different ways, measured.** On the Wheel two fingers
   are read as one and slide the picture 150 pixels sideways at 1.0x. On
   Frames and Dial the browser takes the pinch and zooms the whole page to 5x,
   and what fills the screen is the header and the glass bar, with the picture
   16 percent of it. That second one is "the overlay dominates", reproduced.
3. **On a phone, the first tap on Help, Lighting, Profile or CQ does nothing a
   person can see.** The explanation shows under the finger and is gone within
   60 milliseconds of the lift, and the tap itself is swallowed. The second tap
   acts. This is the likeliest reason he has "never used" half the header.
4. **The Field, where the app opens, carries 11 words and none of them say what
   it is.** Every other tab opens on a heading and 26 to 132 words.
5. **The undo pair is on screen with nothing to undo**, on every first
   landing, because a CSS rule beats the `hidden` attribute. It was ruled to be
   hidden when the stack is empty. Measured, and a fair part of why it looks
   purposeless to him.
6. **Of the ten gaps ranked below, the fix in flight is built to close five,
   narrows two, and leaves three open,** and the top one is among the three.
7. **Value so far, simulated and labelled as such:** the picture earns its keep
   with Marcus and nobody else, because on a phone nobody can get into it.

---

# 1. Method

**The build walked.** Commit `eae5b75`, `source.html` md5
`03027d3ea056b6f22a8620108686bd1c`. Byte identical to the committed
`source.html` apart from the build stamp line, checked with a diff. The file on
his phone was `atuned-packed.html`, which carries the same source except one
commit, `7414091`, the glass bar fold (GB), so this is the build he tested to
within one fold control.

**The device.** Real Chromium 1194 through Playwright at 390 by 844, device
scale 2, `isMobile` and `hasTouch` on, so `(pointer:coarse)` matches and the
app takes every phone branch it has. One fresh browser context per walk and per
cell of the gesture matrix, so nothing one gesture left behind (a page zoom,
a pan) is read as the next one's result. The first run of the matrix reset
page zoom with a scale override that then blocked the next pinch; that run was
discarded and the matrix rebuilt on fresh contexts.

**The touch.** Every tap, hold, swipe and pinch is sent through the DevTools
protocol's `Input.dispatchTouchEvent`, which is the same input path a finger
uses: `touch-action` is honoured, pointer events arrive typed `touch`, and the
browser's own pinch zoom engages where the page allows it. A pinch is two
points 60 pixels apart opening to 240, at the centre of the picture.

**The script is reproducible.** From the repo root:

    NODE_PATH=/opt/node22/lib/node_modules node proto/mobile/walk.js source.html OUTDIR

It printed `proto/mobile/walk-before-eae5b75.jsonl`, committed beside it, and
every number in this file marked measured is a line of that file. The curated
screenshots are `proto/mobile/observed/before-*.png`. The control counter is
`proto/firstrun/walk.js`'s, unchanged, so the two files' counts compare.

**Three labels, the way `RESEARCH-90day.md` uses them.**

| Label | What it means here |
|---|---|
| **measured** | A line of the walk output or a screenshot, reproducible from the command above. |
| **judged** | Mine, with the reason shown. |
| **simulated** | What an ICP thinks or feels. Nothing here was said by a real person, and this project has no real user data. The personas and weights are `RESEARCH-icp.md`'s. |

**The people.** The six ICPs from `RESEARCH-icp.md`, with their panel weights:
Diane 180, Derek 170, Marcus 160, Angela 150, Sofia 140, James 100. 900 of the
1,000 panel. The three edge cases were not walked; this is a usability pass,
not an acquisition one. Each walk follows the path their own recorded words
predict, and each ends on a real reading: their own worked example loaded
through the picker, or, for Angela, her own committed story.

**One limit, stated.** Chromium is not Safari. Two findings below depend on
browser behaviour that differs on an iPhone, and each says so where it lands.
His device is not recorded in GF.

---

# 2. What a phone meets on landing, measured

| Measure | Value | Source |
|---|---|---|
| Boot to `booted` | 5.5 s | walk, part 1 |
| Controls in view | 23, none under the 44 pixel floor | part 1 |
| Words in view | 11: "At u ned Source OS Energetics Ritual Story Field Body Profile Dark 1.0x 60 50 40" | part 1 |
| Any sentence saying what this is or what to do | none | part 1 |
| Header, top of screen to top of stage | 252 px, 30 percent of the screen | part 1 |
| Top of the picture | 311 px | part 1 |
| Tabs in view | 5 of 9. Compass, Knowledge, Games, Summary sit past the right edge | part 1 |
| Cue that more tabs exist | a 26 pixel fade on the bar's right end, nothing else | part 1, `tabMask` |
| Undo and redo on screen with an empty stack | yes, 2 of the 23 controls | part 1, `before-01-landing.png` |
| Pole strip ("heaven and hell") | 711 to 901, below the picture, lower end 57 px past the fold | part 1, `poles` |
| Root Energetics header | 926, under the fold | part 1 |
| Readings dock (CQ, DQ, accuracy, four more) | 982 to 1141, 159 px tall, 138 px under the fold | part 1 |
| Profile picker entries | 15, from 6 to 57 characters; 2 wider than the box at its own font (376 against 324 px) | part 1 |

Screenshot: `proto/mobile/observed/before-01-landing.png`.

**Per tab, first screen, on Diane's loaded profile (measured, part 4):**

| Tab | Controls | Words | Opens on |
|---|---|---|---|
| Energetics | 17 | 103 | "Who this is", then a paragraph |
| Ritual | 17 | 83 | "Build a ritual" |
| Story | 22 | 52 | "The day" |
| **Field** | **23** | **11** | **"1.0x 60 50 40 59"** |
| Body | 20 | 26 | the seven seats and their loads |
| Compass | 20 | 49 | "The compass" |
| Knowledge | 26 | 47 | "The codex" |
| Games | 16 | 132 | "Games" |
| Summary | 13 | 101 | the person's name and CQ |

The app opens on the one surface that says the least.

---

# 3. The gestures, measured

One fresh context per cell. Blank profile and Marcus's worked example gave the
same result in every cell, so they are one row.

| Gesture | Wheel | Frames | Dial | Expected |
|---|---|---|---|---|
| **Pinch open** | picture slides 150 px left, zoom stays 1.0x, page does not zoom | page zooms to 5x, picture zoom stays 1.0x | page zooms to 5x, picture zoom stays 1.0x | the picture grows under the fingers |
| What fills the screen after it | the wheel, half off the left edge (`before-02-pinch-wheel-slides.png`) | header and glass bar: picture 16 percent of the screen, glass bar 26 (`before-03-pinch-frames-page-zoom.png`) | picture 16 to 30 percent, glass bar 23 to 26 | the picture |
| **Zoom +** circle, lower right | 1 tap, 1.0 to 1.25x | 1 tap, 1.0 to 1.25x | 1 tap, 1.0 to 1.25x | works |
| **Tap on a mark** | reading opens at 4,733 to 5,150 px, off screen, nothing in view moves | same | same | the reading, where the eye is |
| Any charge written by any gesture | no | no | no | no. The rule from `ui.js:108` holds |

**Why the Wheel slides.** `canvas#cv` carries `touch-action:pan-y` on a coarse
pointer (`atuned_src/shell/head.html:1350`), which forbids the browser's pinch,
and the build walked has no two finger handler, so the first finger arms the
pan on empty canvas (`ui/ui.js`, the `pointerdown` on `cv`) and the spread of
two fingers is read as one finger dragging. **Why Frames and Dial zoom the
page.** `#frend` has no `touch-action` rule and no two finger handler in this
build, so the browser zooms the document, and the zoom lands on the chrome.

**Reading CQ, measured on the readings dock.**

| Action on CQ | Result |
|---|---|
| One tap | "Coherence. The 21 laws, summed." shows while the finger is down, is not up after the lift, nothing opens |
| Second tap | the Core reading opens at 4,094 px, off screen |
| Hold 1.5 s | the same line shows, 374 by 65 px, 7 percent of the screen, and goes the moment the finger lifts |

**The first tap on the header, measured on every tooltip carrier in the first
screen (part 4).** Brand, Lighting, Help, Profile: 4 of 4 show their
explanation during the press, 0 of 4 still show it 60 ms after the lift, 0
of 4 act. A second tap opens the lighting menu, the help sheet and the profile
page respectively; the brand goes to the Field, where the person already is. **Mechanism, traced:** showing the tip strips the carrier's
`title` (`ui/tip.js:251`), the tap's compatibility `mousedown` focuses the
button, and the `focusin` handler (`ui/tip.js:327`) no longer finds a carrier
without its title and hides the tip. The first tap's click is swallowed by
design, "the first tap explains and the second acts". **The Safari caveat:**
iOS Safari does not focus a button on tap, so on an iPhone the explanation
may stay up; the swallowed first tap happens on both.

**Undo, measured.** `#histpair` and `#undobtn` both carry `hidden`, and both
render at 44 pixels, because `.histpair{display:flex}`
(`atuned_src/shell/head.html:807`) outranks the attribute. The ruling in
`body.html` says "Hidden when the stack is empty rather than sitting there
disabled." On a blank first landing the stack is empty and the pair is there,
the undo arrow ringed in gold.

---

# 4. Six walks

Each walk: the path, measured; whether the interaction could be understood,
**measured** as whether each gesture produced the result a person expects; and
the value so far, **simulated**, tagged with `RESEARCH-icp.md`'s ledger (BUY,
HOLD, CONFUSE, RESIST, REFUSE).

## Diane, 46, founder. 180. Between meetings.

**Path, measured.** Lands on the Field, loads her worked example through the
picker, pinches the wheel, taps an address. 3 gestures. CQ 59, DQ 20.

**Could she read the interaction, measured.** 0 of 2 Field gestures gave the
expected result: the pinch slid the wheel sideways, the tap opened "Root.
Fear. Lumbar plexus" 4,692 px below her screen. Her CQ is on screen only as
the "59" beside a tick on the pole strip, unlabelled.

**Value so far, simulated.** CONFUSE, then RESIST. "It is a good picture that
does nothing when I touch it. Where is the cost line." She asked for "a number
I do not already have" and "what the 41 is costing me this quarter"
(`RESEARCH-icp.md` section 3). On a phone she gets the number without its name
and no cost at all. She would not open it a second time between meetings.

## Derek, 39, high performer. 170. Wants the limiter.

**Path, measured.** Energetics first (1 tap; 103 words, opens on "Your
energetics were fixed at the moment you were cut from your mother"), back to
Field (1 tap), loads his example, pinches, taps an address. 5 gestures.
CQ 49, DQ 26, 20 addresses loaded.

**Could he read the interaction, measured.** Pinch: failed. Tap: reading
4,711 px down. His number sits in the dock 982 px down; one tap on it flashes a
line and does nothing, the second opens the Core reading 4,094 px down. The
four readings under CQ print 0.42, 0.77, 0.62 and 1.00 beside an icon, with no
name (`before-06-readings-dock.png`).

**Value so far, simulated.** RESIST. "It shows me 49 and four decimals with no
names, and it will not tell me what caps it." Derek does the division
(`RESEARCH-icp.md` section 5); unnamed decimals are the thing he trusts least.

## Marcus, 44, creative director. 160. Tests the instrument.

**Path, measured.** Switches to Frames, loads his example, pinches. 4
gestures. CQ 62, DQ 11.

**Could he read the interaction, measured.** The picture holds: Frames at 390
is a real drawing, not a template, which is the one thing he said gets him in
("one screenshot of the instrument that is clearly not a template",
`RESEARCH-icp.md` section 1). The pinch took the whole page to 5x and put the
header and the glass bar in front of him (`before-03`). His next tap, made on
that zoomed page, landed on nothing, so his tap result is not counted: the
page stays at 5x until he pinches back out. The pole strip reads "60 50 40"
under the picture with a halo and a trident at its ends and no name on either
(`before-04-poles-frames.png`).

**Value so far, simulated.** HOLD. "The drawing is real. The phone build is
not finished, and I can see exactly where." He is the one ICP the picture
reaches on a phone, and he reaches it by looking, not by touching.

## Angela, 36, seeker. 150. From a group chat.

**Path, measured.** Story (1 tap), types her sentence, Commit is in view after
typing, commits, Field (1 tap), pinches, taps. 5 gestures. CQ 0, DQ 6.

**Could she read the interaction, measured.** The story went in. The Field
then read CQ 0, which `RESEARCH-firstrun.md` already found at both widths and
which is not a phone defect. Pinch: failed. Tap: reading 4,649 px down.

**Value so far, simulated.** CONFUSE. "It heard me in the Story box. Then it
gave me a zero and a picture that slides away when I touch it." The live
highlight while typing was not re-measured here; `RESEARCH-firstrun.md`
measured it at 390 and it is still her best moment.

## Sofia, 41, somatic practitioner. 140. Eleven at night.

**Path, measured.** Ritual (1 tap; 83 words, "Build a ritual"), Field (1 tap),
loads her example, pinches, taps. 5 gestures. CQ 73, DQ 3.

**Could she read the interaction, measured.** Ritual answers her in its first
screen. The Field does not: pinch failed, tap 4,758 px down. To load a client
she scans 15 names up to 57 characters long, none of them marked as a worked
example in the list itself (only the closed picker says "example" once one is
chosen).

**Value so far, simulated.** HOLD. "Ritual tells me what to run. The Field on a
phone I would not put in front of a client yet." Her test is whether a map
claims more than it measured, and here it is not the claim that fails, it is
the reach.

## James, 57, C suite. 100. Opens Summary.

**Path, measured.** Summary is past the right edge: 2 swipes on the tab bar
and 1 tap; back to Field, 1 swipe and 1 tap; loads his example, pinches, taps.
8 gestures, the most of the six. CQ 44, DQ 27, 18 addresses loaded.

**Could he read the interaction, measured.** Summary, once reached, gives him
his name and his number in its first screen (101 words). The Field: pinch
failed, tap 4,711 px down.

**Value so far, simulated.** RESIST. "The summary is the product. The picture is
decoration, and I had to find the summary by swiping a menu." He was always
the ICP least served by the picture; the phone confirms it.

## What the six agree on

| | Diane | Derek | Marcus | Angela | Sofia | James |
|---|---|---|---|---|---|---|
| Gestures to a real reading | 3 | 5 | 4 | 5 | 5 | 8 |
| Pinch reached the picture | no | no | no | no | no | no |
| Tap on the picture showed anything in view | no | no | not counted | no | no | no |
| Value so far, simulated | CONFUSE, RESIST | RESIST | HOLD | CONFUSE | HOLD | RESIST |

**Measured:** 0 of 6 could open the picture with their fingers and 0 of 5
counted taps showed a reading where they were looking. **Judged:** nobody got
far enough into the Field on a phone to have a felt sense of its value; the
value they report is from the parts of the product that are text (Story,
Ritual, Summary) and from looking at the drawing. That is the finding under
the finding.

---

# 5. The gap analysis, ranked

Ranked by how many of the six walks the gap blocked (stopped the expected
result) or slowed (cost extra gestures or a scroll), then by panel weight.
"Fix in flight" is read from the other seat's uncommitted diff at the time of
writing, and is what it is **built** to do, not what it has been measured to
do; section 7 is where it is measured.

| # | Gap: what it does now, against what a person needs | ICPs hit | Weight | In GF | Fix in flight | After it |
|---|---|---|---|---|---|---|
| 1 | **A tap on the picture opens its reading 4,649 to 5,150 px below, and nothing in view changes.** A person needs the reading where their eye is, or a visible move to it. | 6 of 6, blocked | 900 | no | not touched | **open** |
| 2 | **Pinch does not reach the picture.** Wheel: slides 150 px at 1.0x. Frames and Dial: page to 5x, chrome fills the screen. Needs: the picture scales under the fingers, the page never does. | 6 of 6, blocked | 900 | yes | two finger handlers on the wheel and the renditions, page zoom refused over the picture | built to close |
| 3 | **The first screen says nothing.** 11 words, no sentence, on the surface the app opens on. Needs: one line of what this is and what to touch. | 6 of 6, slowed | 900 | no | not touched; the folded bar will name the surface "Field" and nothing more | **open**; `DESIGN-firstrun.md` carries the design |
| 4 | **Header of 252 px, 4 tabs off screen with a 26 px fade as the only cue.** Needs: the picture high on the screen, every surface reachable in one known gesture. | 6 of 6 slowed by the height, 1 blocked (James, 3 gestures for Summary) | 900 | yes | the tabs fold into one bar that opens a three column grid, lighting inside it | built to close; one tap now hides all nine, measure after |
| 5 | **First tap on Help, Lighting, Profile and CQ shows a line under the finger and does nothing.** Needs: a tap acts; an explanation, when asked for, stays readable. | 6 of 6 exposed (all four are in the first screen), 2 walked into it (Derek, James on CQ) | 900 | yes, as the hold | a tap acts on a control, a 1.5 s hold explains, the click after a hold is swallowed | built to close for controls; carriers that are only words keep the first tap explain, and whether their line survives the lift is not in the diff |
| 6 | **Undo pair on screen with nothing to undo.** CSS outranks `hidden`. Needs: gone until there is something to take back. | 6 of 6 see it | 900 | yes, "hide it" | `.top .histpair{display:none!important}` on a phone | closed on a phone; **the CSS defect stays at desktop widths**, against its own ruling |
| 7 | **Poles under the picture, lower end past the fold, unnamed.** Needs: inside the picture, near CQ and DQ. | 6 of 6 see it, 1 examines it (Marcus) | 900 | yes | strip hidden on a phone, halo and fork drawn in the core of all three pictures, scaled with the core | built to close; at 1.0x they draw at core size, so reading them depends on gap 2 being closed |
| 8 | **Readings dock under the fold, 159 px, four of seven readings unnamed.** Needs: the number a person came for in the first screen, every reading named. | 3 of 6 slowed (Diane, Derek, James, the three who came for a number) | 450 | yes, as squares | square buttons in a grid, 48 px rows | narrows: shorter, still under the fold; names arrive only on a hold |
| 9 | **Profile list: 15 names up to 57 characters, 2 wider than the box, none marked as examples.** Needs: short names, one line, marked as examples. | 5 of 6 slowed (all but Angela) | 750 | yes | a circle beside Help opens a list built from the picker's own entries | narrows: the button closes, the list prints the same full text with no truncation rule in the diff |
| 10 | **A first story reads CQ 0.** Not a phone defect; measured again here. | 1 of 6 (Angela) | 150 | no | not touched | open, tracked in `RESEARCH-firstrun.md` |

**Also named in GF and measured here as fine:** Lighting as a segment in the
bar (one 110 by 44 button now, folding into the menu in the fix), and the Zoom
circles, which work on all three pictures in one tap.

**Not measured, by his own words.** "Our root domains, this may need some
work" names no defect. What the phone shows under it, for his read: a row of
four tiles and the caption "washed, your selection sits here"
(`before-06-readings-dock.png`), which reads as a note to the builder rather
than a line to a person. Judged.

---

# 6. The same gaps, through the loop

The loop is discover, play, flow, embody, and it closes. Every gap above lands
on one station, and the pattern is plain.

| Station | What a phone does to it today | Gaps |
|---|---|---|
| **Discover** | The verb is a tap on the picture, and it has no visible result. The station does not turn. | 1, 2, 3 |
| **Play** | Reachable through text (Story, Games). Not through the picture. | 4 |
| **Flow** | The number that moves is under the fold and unnamed. | 8, 5 |
| **Embody** | Not reached by any of the six on a phone in this pass. | follows from 1 |

**Judged, and costed where I can.** A loop whose first verb gives no feedback
is not a loop on that device; it is a picture. I will not put a retention
number on gap 1: the project's own loss model (`proto/ritual/losssim.js`, used
in `RESEARCH-90day.md`) has no parameter for a gesture that fails, and a
number made up here would be the kind this repository keeps being bitten by.
What I will say, as a benchmark from elsewhere and not a promise here: in every
mobile product I have shipped, a primary gesture with no visible response in
the first session shows up as a day one cliff, not a slow leak, because the
person concludes the thing is broken rather than deep. RESEARCH-90day's model
already loses 40 percent of the thousand by day 2 with this surface as the
landing.

**Build size, judged.** Gap 1 is small to medium: the reading already renders
and already carries "Back to the field"; the work is where it opens on a phone.
Gap 3 is a line of copy plus the first run design already drawn. Gap 6's
desktop half is one CSS rule.

---

# 7. Before and after

**Status at the time of writing: the fix had not been committed.** The fix
seat's work was in the shared working tree, uncommitted, across `head.html`,
`body.html`, `component.js`, `cone.js`, `panels.js`, `personas.js`,
`rings.js`, `tip.js`, `ui.js` and `wheel.js`. A half written tree is not a
build, so it was read to fill the "fix in flight" column in section 5 and was
not walked. The walk re-runs against the fix commit with one command:

    ./atuned_src/BUILD.sh /tmp/after.html
    NODE_PATH=/opt/node22/lib/node_modules node proto/mobile/walk.js /tmp/after.html OUTDIR

What the after walk has to show for each "built to close" in section 5 to
count as closed:

| Gap | Closed when the walk reads |
|---|---|
| 2 | `pinch` on all three pictures: `pageScale` stays 1, `appZoom` or `frameZoom` rises above 1, `pan` does not jump 150 px |
| 4 | `landing`: picture top well under 311; every tab reachable in at most 2 taps with 0 swipes |
| 5 | `tip-on-lift`: a tap on Help, Lighting and Profile acts on the first press |
| 6 | `landing.hist`: the pair's height is 0 on a blank profile |
| 7 | `poles`: the strip is absent on a phone and the glyphs sit inside the picture's box |

---

# 8. Found in passing, for the backlog, not built

1. Undo's CSS defect at desktop widths, `atuned_src/shell/head.html:807`:
   `.histpair{display:flex}` outranks `[hidden]`, so the ruling "hidden when
   the stack is empty" has not held anywhere. A `.histpair[hidden]{display:none}`
   and the same for `.undobtn` and `.redobtn` is the whole fix.
2. The tooltip's first tap route loses its own line on Chromium: `tip.js:251`
   strips the title, the compatibility `mousedown` focuses the button, and the
   `focusin` handler at `tip.js:327` hides a carrier it no longer recognises.
   Any carrier the fix leaves on the first tap route keeps this.
3. The profile list's entries do not say "example" until one is chosen, which
   `RESEARCH-firstrun.md` item 7 found at 1600 and is also true on a phone.
4. Root Domains' caption "washed, your selection sits here" reads as a builder's
   note. For the voice seat.
5. The pole strip's two glyphs and its "60 50 40" carry no name on the phone,
   and the strip is going away on the phone in the fix; wherever the halo and
   fork land, a press on them should say what they are, which the hold will
   give them.

---

# 9. His, and open

Each is written for the person with the vision. None is answered for him.

**1. When a person taps a mark on the picture on a phone, where should its
reading appear?** Today it opens about 4,700 pixels below them and nothing
moves, which is gap 1. Three ways it could go:
- **A sheet that rises over the lower half of the picture.** The picture stays
  in view, the reading is under the thumb, a swipe down closes it. The largest
  build of the three, and the one I would pick: it keeps discover and the thing
  discovered on one screen.
- **The page scrolls down to the reading**, which already carries "Back to the
  field". The smallest build. The picture leaves the screen every time.
- **A short card under the picture**, the name, the seat, the load and one
  line, with the full reading behind it. Medium, and it keeps the picture
  mostly in view.

**2. On a phone, should the main navigation fold at the top, or become a bar of
tabs at the bottom under the thumb?** Your words in GF were both: "we're gonna
want this to collapse" and "Primary navigation needs to be in tabs, I think."
The fix in flight builds the fold at the top: one bar naming where you are,
opening onto all nine. A bottom bar fits four or five, which would mean
choosing which surfaces are the loop (for example Story, Field, Ritual, Games)
and putting the rest one level down. The fold costs one extra tap to every
surface; the bottom bar costs a ruling on which five.

**3. Is 1.5 seconds the hold you want?** Quoted from GF: "it should pull up a
tooltip if I press for a second and a half." The fix builds exactly that. For
comparison, a phone's own long press is about half a second, so at 1.5 seconds
some people will lift before it arrives and see nothing. Keep 1.5, or match the
phone.

**4. Should the Field carry one sentence when it opens?** Today it carries 11
words and no sentence, and it is the surface the app opens on. This is the
opening `DESIGN-firstrun.md` is designing; the question here is only whether
the phone should wait for that or get one line now.

**5. The worked examples in the profile list: named people, or marked as
examples?** Quoted from GF: "the names are really large on here too, they're
wrapping onto a second line." The longest entry is "Tomas, 58, long haul
driver, off the road fourteen months", 57 characters. Shortening to "Tomas,
example" fixes the wrap and says what it is; it loses the trade and age that
make them feel like people.

**6. Still open from GF: "the mobile version, the React, React version."**
This file walked the one file build. If a React rebuild of the phone surface is
what you meant, every gap above is re-measured on that, and gap 1 becomes a
design question for that build rather than a fix to this one.
