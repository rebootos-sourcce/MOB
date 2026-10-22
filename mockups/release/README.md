# Release session mockups, 17 October 2026

Draft, do not merge. Mockups only: nothing in `atuned_src/` changed.

The ask, in the owner's words: the release pages he likes in behaviour (the
first two) grade a D on looks, "they don't look like anything else" in the
app. He wants the setup and the voice's script on one screen, "I don't want
to jump between screens", the prompt bold and centred above a carousel whose
top and bottom fade, a countdown, a two minute cooldown the voice guides, and
a completion that carries the numbers. Mostly frictionless. From a C minus to
a B plus.

Four versions, each one page that changes in place from Begin to the end:

| File | Version | The tension it takes |
|---|---|---|
| `r1-one-stream.html` | One stream | Everything is a line in one focus slot: script, statements, cooldown, congratulations. Pure type. Counts lines. |
| `r2-three-bands.html` | Three bands | A fixed stage in the paywall's flat card family. The whole script is readable before Begin. Counts minutes. |
| `r3-the-dial.html` | The dial, **lead** | One instrument face for the whole session. Twelve marks, one per pattern this run opens, fill in seat colour. The ring is the countdown. |
| `r4-the-figure.html` | The figure | The body outline beside the list, the three places marked on it. Counts lines here and lines in all. |

Open any of them in a browser. "States and versions" in the dark bar on top
jumps between states, motion, pace and a phone frame. A state opened there is
a still picture until you press something on it; Begin, Play and Rerun these
run it live.

## Grades, by the four of us

Mika Ueda-Salas (the whole), Sol Amadi (colour and light), Bjorn Haraldsson
(type and grid), Petra Nikau (composition and symbol). Every number below is
read off `shots/measure.json` or off the capture of today's build, not typed
from memory.

### Today's screens: D, and C minus at best

Pictures: `shots/today/`. Counts are words and presses inside the window at
1600 by 1000.

- **Set up, C minus.** 84 words, 13 presses. The eye lands on the story
  (right), then scatters across the step rail, two outlined number boxes, a
  filled segmented pick, a pill switch and two buttons. Bjorn: two input
  idioms in one row, and the labels are 12px bold letterspaced, which reads as
  small caps. Sol: a warm radial wash in the seat colour sits under the
  story; on a Root reading that is a red pool under the words, which raises
  arousal on the one screen that should lower it. Petra: the voice switch is a
  filled pill, the only filled switch in a ring system.
- **Settle, C.** The single sentence at 32px is right. Three clocks for a
  breath instruction (a ring, Elapsed, Left) is not, and the ElevenLabs
  paragraph repeats on every phase.
- **The list, D.** 166 words and 27 presses inside the window at 1600 (23 at
  390). Nine zones compete: rail, prompt, list, two side panels, scrub,
  arrows, bank strip with Submit and Recycle, a hint paragraph, four figures.
  The list is the best idea on the screen and it is the fifth thing the eye
  finds. The browser-storage notice sits over the readings at 1600 and over
  the hint at 390. And every row says "... that I am afraid.": see "What is
  not true" below.
- **Rest, C plus.** The two minute ring is the right object. The line above
  it, "Now rest for two minutes", is faded by opacity to near nothing (by eye;
  the probe cannot see opacity).
- **Results, D plus.** 417 words, 141 inside the first window, and it
  scrolls. It counts lines (600 released, 600 recharged), bank and vault in
  addresses, and DQ and CQ, three units for one question.

### The four new versions

Counts are words on screen at 1600 and at 390, then presses (things to
press). Every state passes the shots gate: nothing below the fold or off the
side, no overlaps, text at 4.5 to 1 or better against its own ground (lowest
measured 5.12, the script's past lines in version 2), marks at 3 to 1 or
better (lowest 8.07), every press at least 44 by 44, no request leaving the
file, and two presses on every running state.

| Version | Before | Script | List | Reframe | Paused | Cooldown | Done | Spent |
|---|---|---|---|---|---|---|---|---|
| 1 One stream | 56/56, 10 | 27/27, 2 | 30/29, 2 | 20/19, 2 | 36/35, 3 | 18/17, 2 | 70/70, 3 | 95/95, 4 |
| 2 Three bands | 151/112, 10 | 82/82, 2 | 30/30, 2 | 20/20, 2 | 35/35, 3 | 43/43, 2 | 70/70, 3 | 95/95, 4 |
| 3 The dial | 63/63, 10 | 28/27, 2 | 30/29, 2 | 20/19, 2 | 36/35, 3 | 18/17, 2 | 70/70, 3 | 95/95, 4 |
| 4 The figure | 74/62, 10 | 28/27, 2 | 34/33, 2 | 24/23, 2 | 36/35, 3 | 18/17, 2 | 70/70, 3 | 95/95, 4 |

Paused has three presses (Play, End session, the crisis door) because a held
list has to offer both ways on. The running list has exactly two: Pause and
the crisis door.

- **1. One stream: B.** Squint order is right: prompt, line, count. The
  purest answer to "no jumping": the same focus slot carries the voice's
  first word and the congratulations. Mika: before Begin the eye lands on
  "Okay, we are getting into a release session", the least useful sentence on
  the screen, and the completion is type on a void with the cards pushed to
  the floor. Sol: colour is almost absent, so it marries the app's type but
  not its look.
- **2. Three bands: B minus.** Closest to the paywall's flat cards, and the
  only version where the whole script can be read before it is heard. But the
  well is a framed panel, and the owner ruled at round QM, 2 October: "I don't
  want a frame around anything. I want it to be the entire screen."
  `tests/release-screen.js` holds that ruling. It is also the densest before
  Begin (151 words), and Bjorn: the cooldown clock sits in the bottom band, off
  the eye line.
- **3. The dial: B plus. The lead.** One object holds the whole session.
  Petra: the twelve marks are twelve patterns, the allowance's own unit, so
  the ring teaches the unit without a sentence, and a symbol that is a
  sentence is the job. Sol: seat colour enters as light on the ring and never
  as the colour of words, so contrast is never at risk and the palette is
  argued (yellow at the solar plexus, green at the heart, blue at the third
  eye). The countdown is a share, not a number that ticks, so it cannot urge.
  The cooldown, a thin accent ring unwinding inside the finished ring, is the
  best image in the set, and the completion, every mark lit, reads from six
  feet. Against it, Petra: a release mark and a reframe mark look the same.
  Bjorn: the line inside the face is narrower, so at 390 a long line wraps to
  two and its neighbours sit at 13px. Mika: at 390 the face leaves about 150
  pixels empty above and below.
- **4. The figure: B minus.** It ties the release to the body, the owner's
  centre ("What is Atuned? Your avatar"), and in the cooldown, when the voice
  asks where the energy is moving, the eye has the body to go to. But it puts
  two lights on screen, the ring on the figure and the line in focus, and a
  release wants one. The figure spends 40 percent of the desktop to show
  three rings, and on a phone it shrinks to a 150 pixel sticker.

### The lead, and what would take it from B plus to A minus

Build **3, the dial**. Next pass, in this order:

1. Tell release from reframe on the ring: draw a reframe mark as a thin inner
   arc under its release mark, so a place reads as two halves (Petra).
2. On a phone, let the face grow into the empty band above it (Mika).
3. Before Begin, the empty ring reads a little like a loader. Draw the twelve
   marks at the seat colour's lowest step instead of panel grey, so the run is
   visibly the person's own before it starts (Sol).

## What is not true in the product yet

Each of these is something the app does not do today, checked against
`main` at `aeab54e2`.

- **One screen.** Today the release is five screens behind a step rail (Set
  up, Settle, Release, Rest, Results). None of the single page exists.
- **His script.** The voice does not say "Okay, we are getting into a release
  session", "When you're ready, let's begin" or the beginning resonance "I'm
  letting go of believing, perceiving, thinking, behaving, acting, feeling."
  as its own line. It says the welcome (`REL_WELCOME`) and then "Each line
  names one pattern. Repeat it in thought as it lands." (`OPENING`).
- **His prompt.** The prompt pinned today is "I am letting go of believing,
  perceiving, thinking, behaving, acting, and feeling" (`C3_STEM`). "I'm
  releasing believing, perceiving, thinking, behaving, acting, feeling that I
  am" is not in the product.
- **The cooldown's order and words.** A two minute rest with a countdown ring
  exists (`REL_SETTLE_S`, 120). What does not: his cooldown lines, and the
  order. Today the voice says "Congratulations. You finished your release:
  600 lines." first and then "Now rest for two minutes." He now wants the two
  minutes first and the congratulations after.
- **The completion's numbers.** Today's results count lines, put bank and
  vault in addresses and add DQ and CQ, and the screen scrolls. Patterns
  released this session, bank and vault in patterns, this month's new
  patterns left, and Run another session as the one action are all new.
  "Rerun these" exists on the empty card before a run (built 17 October), not
  on the completion.
- **The list's presses.** Today the list carries Heavy marks (swipe to the
  bank or the shadow), Bookmark, a scrub, Back, Now and Forward, Submit and
  Recycle. These mockups drop all of them to reach two presses. That costs
  the heavy marks that feed the bank and the shadow, and the bookmark. It
  needs a ruling before it is built: drop them, or move heavy marking to the
  completion.
- **The lines.** At the profile used for today's pictures (Fear, Control and
  Insecurity) every line at all three addresses is one sentence, "... that I
  am afraid.", because all three resolve to the one Fear letting-go card,
  which has one statement. The mockups use the printed Anxiety card through
  the engine's `relLine` at three addresses whose fetter is Anticipation
  (Anxiety, Expectation, Hypervigilance), five sentences a side, verbatim.
  Only the addresses on the three printed cards (Anxiety, Grief, Anger) have
  varied lines today. The carousel shown is what the fix should look like,
  not what most addresses say now.
- **The ring's twelve marks** and the lines-left count under the list. Today
  shows "Remaining 597 lines" in a readout block and "82:06 left" top right.
- **The time estimate.** These use the product's speech constants but assume
  the voice says only "that I am" and the sentence on each line, as his
  17 October script implies. Today the head lines carry the whole six channel
  statement, so the same dose estimates 83 minutes in the product and 71 here.
- **Finish now** in the cooldown is new.
- **The figure's rings** (version 4) are placed by seat, not at the exact
  address the Body page draws.
- **The numbers on the completion** (12 released, 44 in the bank, 100 in the
  vault, 288 left this month, renewal 14 Nov 2026) are demo values on tier
  one's real grant of 400 a month.
- **The voice is silent here.** The product speaks through ElevenLabs over
  the network; these files make no request, so the voice is shown as words.

## Calls made here, recorded so they can be overruled

- **Bank keeps its meaning.** In the product and in DECISIONS.md ("The goal
  is for a person to empty their bank and to fill their vault") the bank is
  what is still held in the body. The brief also asked for "new patterns left
  in the bank this month", which is the allowance. One word per concept, so
  the bank stays the bank, and the allowance is a separate quiet line: "288
  new patterns left this month."
- **The allowance line is on the completion, not under Run.** He ruled the
  cost line off the setup at round IG ("Cost runs left, that goes away. And
  this, just, run release button."). The completion is after the spend, so
  the line there reports, it does not price.
- **Patterns, not lines, on the completion.** The allowance's unit (17
  October). One address is four patterns.
- **No second press after "When you're ready, let's begin."** The script
  holds three seconds and goes on. A press there would be the jump between
  screens he asked to lose.
- **The comma after "releasing" is dropped** in his prompt: "I'm releasing
  believing, perceiving..." reads as one verb and its objects; with the comma
  it reads as a list that starts with "releasing".
- **The reframe half is kept**, under his "I know that I am" (round QM),
  because the run does it today and nothing in the 17 October words removes
  it.
- **The run speed field is dropped** from the setup; Story or Seat, the dose
  (25, 50, 100 each side, his words, his default of 100), Voice and Binaural
  tone stay.
- **The countdown never shows seconds while the list runs.** Seconds appear
  only in the cooldown, where he asked for a visible two minute count.

## The words

Every line on every page passes the house voice gate (`check.py --line`):
67 distinct lines, 67 pass. No em dashes anywhere in this folder. The lines
he gave on 17 October are his, typed once in `src/shared.js` under `W`.

## How to run

From the repo root, with `engine.js` built (it is committed):

    node mockups/release/src/build.js
    flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules \
      PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/release/src/shots.js
    flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules \
      PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/release/src/play.js
    python3 mockups/release/src/voice.py .claude/skills/atuned-voice/check.py

`shots.js` writes every state of every version at 1600 by 1000 and 390 by
844, the list and the cooldown again with reduced motion, and the crisis door
opened from the running list, and fails on anything above. `play.js` presses
each version the way a person would, live at a fast pace, including one
whole session from Begin to the congratulations (105 checks, all pass).
`src/today.js` pictures today's release on a committed story from a built
`source.html`.

Files: `src/build.js` reads the lines, timing, welcome, marks, crisis words,
allowance, seat colours, face and figure out of the product. `src/shared.*`
is the session, the clock, the carousel, the crisis panel and the demo bar.
`src/r1` to `src/r4` are the four versions.

## 18-19 October: his reaction to the four, applied to the dial

He watched the four and picked **3, the dial**. Full reaction and the
numbered list it was read off: `OWNER-REACTION-18OCT.md` (not in this folder).
Versions 1, 2 and 4 stop here, kept only as the record; their files are
untouched by this round. Everything below changed `r3-the-dial.html` only,
through `src/build.js r3`, which writes that one file and leaves the other
three where they were.

1. **Four icons, one row, during the run.** Pause and the crisis door used to
   be the whole running list; Voice and End are new. All four (crisis, voice,
   pause or play, end) are ring icons with no visible caption, his own ask
   ("each self-explaining without a caption"), named for anyone else by
   `aria-label` and `title`. The crisis mark is a life ring (a ring, a hole,
   four straps), the safety-glyph convention, not a question mark: Petra's
   check was whether a stranger would read "crisis, help" off the shape
   alone, and a life ring is the one glyph that convention already carries
   that meaning without the words. `src/shared.js`'s `MK.help` and `UI.quad`;
   `src/r3.css`'s `.quad`.
2. **Ending early is honest.** A pattern opens the first time one of its
   four channels (left release, right release, left reframe, right reframe,
   the engine's own order, see below) is said at all; so the count an early
   End reports is the channels actually reached, never the planned run. The
   ring agrees: lit marks stop exactly where the person stopped, grey past
   that point, on the cooldown and the completion both. Demoed at `?s=ended`,
   a believable partial run (one address fully said, the next one channel
   in, the third untouched): "You ended early. You released 5 patterns at 2
   places in your body." `shared.js`'s `money()` and `ACT.end()`.
3. **Fonts.** Checked against `atuned_src/shell/head.html`: the embedded
   Inter was already exact (`build.js` slices the same `@font-face` out of
   head.html at build time) and the `--sans` token already matched
   character for character. What did not travel was `--num`, the token the
   shipped app puts on every tabular number, a near twin of `--sans` missing
   only the `Segoe UI` fallback. Carried over now, so `.num` reads
   `var(--num,var(--sans))` and the numbers on the ring, the stats and the
   dose picker use the same declared stack the rest of the product does,
   not a coincidence of two similar lists.
4. **No address jargon beside the feeling word.** The running line used to
   print the seat ring, "Anxiety", then "Adrenal Medulla, solar plexus"
   beside it. The anatomical name and the seat word are both gone from that
   line; only the feeling word remains, which is what he asked for word for
   word.
5. **Symmetry.** The four icons sit in one grid, equal cells, equal gaps.
   The completion's two buttons are the same height and shape, filled and
   quiet, side by side and centred. (A build bug surfaced here first: a
   percentage width on a flex child with no stretch resolves against
   nothing and collapses to its content, so the first build of this row
   measured 22 pixels wide, an icon's own width, not a button's. Fixed by
   giving the grid explicit pixel tracks instead of percentages. Gate 6
   below is what caught it.)
6. **The countdown, split left and right.** His words: "50 left, 50 right."
   The engine's own convention, confirmed in `atuned_src/engine/schema.js`
   (the THE ORDER comment above `HEAVY_KEY`): "the channels in the order
   the caller names them, which is left release, right release, left
   reframe, right reframe." His left/right is the product's own left/right,
   not a mockup invention, so no mismatch to flag. The foot of the dial now
   reads "N left, M right": the side already said in the running half
   counts down from the dose to nought; the side not reached yet still
   reads the full dose, never a number not yet earned. `shared.js`'s
   `sideSplit()`.
7. **The cooldown line, verbatim.** "Focus your awareness inside your body
   for the next 2 minutes." replaces the four line rotation this had
   before. Voice checked, see below.
8. **End sits with the other three icons**, not isolated in the paused
   state alone: it is always one of the four, pressable whether paused or
   running, which is also what lets a person end without pausing first if
   that is what they want.
9. **The completion, made to feel like a finish.** Congratulations grew
   (34 to 40px) and now fades and settles in on arrival (disabled under
   reduced motion). The ring under it is the full session in seat colour,
   lit on every mark, from the version that already read as the strongest
   image in the set.
10. **The forbidden sentence is gone from this mockup.** Checked by reading
    every line this build captures at every state: zero instances of "a
    pattern is one line at one place" or any variant, at any width, in this
    file. (The constant it came from, `W.pattern` in `shared.js`, is kept
    defined and unused by `r3.js`, because `r1`/`r2`/`r4` are frozen as they
    stood and still reference it; nothing in those three files changed this
    round.)
11. **Completion buttons: Run another session, End session.** Both present,
    both built, same size. Run another session goes back to the setup (his
    "back to your bank in session"). End session is provisional, his own
    words ("We'll change it if we need to"): it shows a status line saying
    where it goes in the product, Summary with the reading already on it,
    the same pattern this file already used for Close and See the tiers,
    because this one page has no second screen to send it to and "ONE
    SCREEN, nothing navigates" is this file's own rule at the top of
    `shared.js`.
12. **Overlaps.** None found in this round's gate (see below); the one real
    bug was the collapsed icon row in point 5, caught as four 22 pixel wide
    presses, not as a visual overlap.

### The real channel names, and why nothing was reinterpreted

`atuned_src/engine/schema.js` says it directly, in the block above
`HEAVY_KEY`: an address's four channels are, in order, left release, right
release, left reframe, right reframe, and `build.js` already reads them this
way (`CH=[['L','limit'],['R','limit'],['L','truth'],['R','truth']]`). His
"50 left, 50 right" is this same left and right, not a screen-position left
and right, so the fix was to show it, not to translate it.

### Gates, this round

    node mockups/release/src/build.js r3
    shots.js r3            24 states (8 default plus the rm and crisis
                            extras, both widths): all ok, zero clipping,
                            overlap, contrast or small target failures
    shots.js r3 ended       the new demo state, both widths: ok
    play.js                 all four files, 105 checks: all ok, including
                            r3's new 4 press running list and quad crisis
                            door
    voice.py                every line this build captures, 75 lines across
                            all four files' measure.json entries: 75 pass,
                            0 fail

**The running list's press ceiling moved from two to four in `shots.js`,
on purpose, not silently.** His four icons took the running list from two
presses (pause, the crisis door) to four (pause, the crisis door, voice,
end), so the gate's own floor for "too many presses" moved with it, from
`m.presses>2` to `m.presses>4`, named in a comment at both places it
appears in `shots.js`. `play.js`'s press count is now read per version
(`v==='r3'?4:2`) for the same reason, and its crisis-door click moved from
the `.crx` class (words only, still true of `r1`/`r2`/`r4`) to
`[data-act="crisis"]`, which every version's crisis button carries whether
it is words or an icon.

### What could not be built as asked, with the reason

Nothing on his twelve-item list. The one open item from the September round
("heavy marks") is unrelated to this round and still waits on his answer,
unchanged.

## 19 October: "too compressed, needs to be symmetrical and evenly spaced"

His second reaction, to the screenshots the round above produced
(`r3-run`, `r3-done`, both widths): "The design is a C. The layout is too
compressed and needs to be symmetrical and evenly spaced." Measured what
that meant before touching anything, by reading real box positions out of
the built file rather than guessing from the picture:

- The page's outer container (`.r3` in `r3.css`) centred nothing. It used
  `justify-content:space-between`, which pins the first and last child to
  the padding edge and hands whatever height is left over to the one or two
  gaps between them. That leftover is different on every state, because
  every state's content is a different height, so the gap was never a
  chosen number: 39.7px before begin, 63.9px running, and on the
  completion the ring sat 22px from the stats on a desktop and **10px** on
  a phone, the single tightest spot measured.
- Top and bottom padding were different numbers (48px and 60px), a small
  but real asymmetry on a screen he called out for needing to be
  symmetrical.
- The spacing scale itself was ad hoc: 6, 8, 10, 12, 14, 22, 28 all in use
  for what are conceptually the same kind of gap (icon to icon, card to
  card, block to block), so even where a gap was not literally an
  accident of leftover space, it was not a deliberate, repeatable rhythm
  either.

The fix: `.r3` now centres its content (`justify-content:center`) on one
declared gap per state, so the space above and below the whole block is
always the true leftover, split evenly, which is what symmetrical means
on this axis; padding is equal top and bottom; and the gap values now
step in a clear scale (14, 16, 18, 24, 28, 32, 40, 44) instead of
scattering across a dozen numbers. Re-measured after, every state, both
widths: top margin equals bottom margin to the pixel, at both 1600x1000
and 390x844, on every one of before, running, paused, the cooldown, the
completion and the ended-early demo. The ring-to-stats gap that measured
10px on a phone is 32px now; 22px on a desktop is 44px now.

No face, ring or text size changed, and no state's content was removed,
so this is spacing only: `src/r3.css`'s `.r3`, `.r3t`, `.r3f`, `.quad`,
`.doneacts` and the `done`/`cool` phase overrides, at both the desktop
rules and inside the `@media (max-width:760px)` block.

Gates re-run after: `shots.js r3` (24 states, both widths) and
`shots.js r3 ended`, all still ok, zero clipping or scrolling, confirming
the extra room did not push anything off the page at either width.

## 22 October: the ring was never a matched element, so a real collision shipped quiet

The last session's own note: a real collision on the allowance spent
completion, the stat row sitting on the ring's lit arc, at a width the
automated check called clean. Measured before touching anything, the way
this file now insists on: at 390 the stat row's top sat inside the ring's
own bottom arc by about 33px; at 1600, worse, the green arc ran straight
through two of the five captions, cutting "Bank, still held" and
"Reframes, this session" in half. Both widths were broken, not only the
one the note named.

**Why the gate missed it.** `shots.js`'s collision check (`blocks`, the
list of elements it tests against each other) has never included the
dial's own ring. A `<path>` on an SVG is not a `button`, an `a`, a `p`, a
`.fg` or any of the other things that list names, so the ring was simply
never in the fight. Named as a fix to the check itself, not only to the
page, because the next thing the ring sits behind would have shipped
quiet too.

**The fix, on the page.** `r3.js`'s `paint()` now sets `data-spent="1"` on
the dial's root whenever the completion is the allowance spent variant
(`m.done&&!m.done.canRun`), read off the same model every other state
reads, not off width. `r3.css` reads that attribute to compact this one
state, and only this one: the meaning line under each stat (`.fm`, kept
on the ordinary completion, where there is room) is dropped, the gap
between the stat row, the sentence and the two status rows below tightens
to 6px, and the block's own floor moves to 14px, the same number at both
widths now. Re-measured after: the stat row's top clears the ring's own
rendered bottom edge by 26.9px at 390 and 9.5px at 1600, both real,
positive, both widths, and the ordinary completion (`?s=done`) is
untouched, pixel for pixel, since `data-spent` is never set for it.

**The fix, in the gate.** `shots.js` now walks the ring's actual curve,
not its bounding box. A bounding box was the first attempt and it is
wrong for a curved mark: an arc's box is a pie slice, and most of that
slice is empty, so the box reads as colliding with anything sitting in
the empty corner, which is exactly where the running list's own feeling
word and the before screen's centred text sit on purpose. Checked against
a known case before trusting it, the way this file's own rules ask:
the box test flagged the centred word on the before screen, plainly clear
of the ring in the picture, so it was wrong and the walk replaced it.
`getPointAtLength` samples points along the ring's own rendered marks
(`.ring .tr`, the twelve track marks every state draws, lit or grey, so
the empty ring before a run and the cooldown's inner ring are covered
too), scaled from the ring's own viewBox to the screen the way the
browser already scales it, and a block only fails when some point on
that real line sits within the stroke's own width of it, the distance
that would make them touch. A second false alarm, caught the same way:
a composite wrapper span (`.chan`'s own column, a channel's name over its
count, two differently sized lines centred as one) reports a box that
reaches past its own two lines of text into the gap its narrower child
leaves beside the wider one. Fixed by only testing a wrapper here when it
carries its own text directly, the way the contrast check below it
already reads "own" text rather than a parent's whole `textContent`, or
is itself a press; a pure layout wrapper around other matched elements is
left to them.

**What the fixed gate then caught, for real, going forward.** Once the
ring could be seen at all, it found two more genuine collisions this
round's own new work had put there, neither the one the note named:

1. The four-channel countdown's outer two columns, Left release and
   Right reframe, crossed the ring's own track at 390 in the run, reframe
   and paused states. Confirmed at full resolution, not only by the
   numbers: the ring's line ran through the letter "L" of "Left" and
   close by the "0" under it. Moving the row up enough to clear the ring
   alone is not available here: the carousel above it clips its own
   overflow at its own box edge (measured at 517px), but its first faded
   neighbour line sits fully inside that box already, at 503px, so a
   push far enough to clear the ring (tried once at 20%, once at 23%)
   crossed that still legible line instead, confirmed the same way, at
   full resolution: "through what is ahead" sitting behind "Right release
   Left reframe". Fixed with both a small, measured position change
   (`.ft`'s mobile `bottom`, 12% to 15%, the number the desktop rule
   already uses) and a tighter row (`.chan`'s mobile `gap`, 8px to 2px),
   so the remaining distance comes from the row's own width rather than
   a position that does not have the room to give. Re-measured after
   with the gate's own point walk: 6.47px clear on the label, 8.08px
   clear on the number, both real.
2. The before screen's own ring caption, "Each mark on the ring is one
   pattern...", came within 3.12px of the ring at 390, close enough that
   the walk (not the box) caught it. Fixed with `#rs[data-ph="before"]
   .in{inset:21%}` at that width only, pulling the text in from an 18%
   inset that was never set there before; re-measured after, 8.23px
   clear. 1600 was already clear and is untouched.

**A scope mistake caught before it shipped.** Verifying the whole set,
`node mockups/release/src/build.js` was run with no argument, which
rebuilds all four files, not only the dial. `shared.js` already carried
this round's own changes (the four channel labels, the five stat
entries, and `W.cool` shrinking from a four line rotation to the one
fixed line his 18 October words gave), committed by the session before
this one. Rebuilding all four pulled those changes into `r1-one-stream`,
`r2-three-bands` and `r4-the-figure` too, which would have silently
changed their cooldown text, the three files this document already calls
"kept only as the record... untouched by this round." Caught by reading
the diff before committing, not by a gate: `git diff --stat` showed
`r1-one-stream.html` changed by 99 lines it had no business carrying.
Reverted with `git checkout`, the three files and the shot pictures that
had changed under them, back to what `HEAD` already held; `node
mockups/release/src/build.js r3` writes only the dial, which is what
every build from here on used.

**Gates, this round.**

    node mockups/release/src/build.js r3
    shots.js                default states, all four files, both widths:
                             88 ok, 0 bad, the ring now checked
    shots.js r3 ended        2 ok, both widths
    play.js                  all four files, 105 checks: 105 ok, 0 bad
    voice.py                 87 distinct lines across every file's
                             measure.json entry: 87 pass, 0 fail

**The four asks, re-verified against the built file, not assumed from the
diff.**

1. **The feeling word, centred.** Measured, not eyeballed: ring to word
   and word to the icon row are 39.25px and 39px at 1600 (0.25px apart),
   66.16px and 67px at 390 (0.84px apart). `r3.css`'s
   `#rs[data-ph="run"] .r3t` gap rules, from the session before this one,
   confirmed still in place and still true.
2. **Four countdowns, four colours.** `Left release`, `Right release`,
   `Left reframe`, `Right reframe` each read their own number, each in
   their own colour, stepped from the address's own seat colour
   (`--c0` through `--c3` in `r3.css`'s `.chan`). Checked as RGB, not by
   eye: the closest pair (Left reframe to Right reframe) is 28.1 apart,
   the furthest (Left release to Right reframe) 91.3, both real.
3. **The completion.** `Congratulations.` is 56px at 1600 and 34px at
   390, read as the computed style, not off the source: `r3.css` carries
   two mobile rules for it (a general 26px and a more specific
   `#rs[data-ph="done"]` one at 34px) and the second wins by
   specificity, so 34px is what the screen actually shows. Up from 40px
   and 24px before this fork of work began (`49a2e002`), at 1600 and 390.
   The ring is the same element, same position, same size, running or
   finished, by the shared centring rule above it; nothing about the fix
   in this round touched that rule. The two buttons hold the 44px floor
   and nothing more (`.doneacts .go,.doneacts .go2`). The stat line is
   five numbers, `Released`, `Bank`, `Vault`, `Reframes`, `Left this
   month`, each read off `money()` in `shared.js`, which reads
   `ALLOW.patternsPerAddress` off the built `engine.js`'s tier one grant
   (`PLAN_BY.one`, sourced in `atuned_src/engine/plan.js`) at build time,
   `build.js` throwing if tier one has no grant, not a typed number; the
   single old "288 new patterns left this month" sentence is gone from
   this file.
4. **The ring, unchanged between running and the finish.** Still the one
   rule from the session before this one
   (`#rs[data-ph="run"] .face,#rs[data-ph="script"] .face,#rs[data-ph="paused"]
   .face,#rs[data-ph="done"] .face{position:absolute;top:50%;left:50%;
   transform:translate(-50%,-50%)}`), untouched by this round's fix,
   which only ever moved what sits below the ring, never the ring.
