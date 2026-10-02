# Onboarding v2, auto slider mockup

Open `index.html` from disk. One file, no network, no audio, about 150 KB with the product's own Inter font carried in it.
`strip.html` is the contact sheet at 390. `png/` holds every beat at 1600 by 1000 and 390 by 844 (25 beats each).
Sources are in `src/`; `node mockups/onboarding-v2/src/build.js` rebuilds `index.html` and `strip.html`, and
`NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-v2/src/shots.js` redraws the pngs. `atuned_src/`,
`source.html` and `engine.js` are untouched.

## How to review it

- The strip at the top is the owner's: Restart, Jump to (every beat), Speed 1x 2x 4x, Reduced motion, Width Fit 1600 390,
  Door path (decides whether the last screen is the account ask or the Guest version), Stop frame direct or indirect.
  "Review controls" collapses it. `?clean` hides it (the pngs use that).
- The door: Create account and Guest start the first run. Log in goes to a stub "Field" end frame, because log in never
  plays the reel (UX pass 3).
- Hold the stage 180 ms to pause, tap the left third to restart the slide (a second tap within 1.5 s goes back one), tap the
  right two thirds to go on, Space pauses, Esc is Skip on the slides and Leave at the gate. Pause is visible from the
  first frame of the film. "show stop frame" is bottom right on every screen.

## Real and stubbed

Real (read from the repository at build time or built to spec):
- The 112 addresses: slide 4's row (row 1, Fear, Root, Lumbar Plexus), the count "112" in the line, the table the ring
  opens, and the release lines, all come from `atuned_src/engine/data/nodes.js`. The seven seat colours are `PAL`.
- Lexicon values (seat and amount) are the engine's own `LEX` entries for the fourteen words used.
- Release welcome lines are the shipped `REL_WELCOME`, and the line pattern is the shipped `REL_ENTRY` rotation.
- Dwell rule, honest time line, clock, pause mask, hold, thirds, reduced motion, easing curves, hairline, type scale.
  The dwell rule and the time line are computed in the file, not typed (`MOCK.DWELLCHECK`, `MOCK.timeLine()`).

Stubbed:
- The reading is a fourteen word lexicon (afraid, panicking, exhausted, snapped, angry, mortified, criticised, grief,
  lonely, sad, interrupted, betrayed, overthinking, pointless). Anything else is the empty read, then the pick fallback.
- Pick to seat is a stub (Money to Root and so on). No engine table maps a topic to a seat; the mockup places only the
  12 px ink seed mark and never a hue from a pick.
- Gift counter: 100 is a typed constant standing in for the engine's number (J8). It falls to 88 over the 12 lines.
- No audio. The Sound ring toggles its glyph and does nothing. No voice, so the release opening runs on the silent column
  of the narrative table, compressed (below).
- No account, no network. Log in, Create account, Keep this, Call 988 and Text 988 do nothing real.
- The distress stop frame is a static page; there is no detector. Text is the narrative draft, flagged on screen as
  needing clinician sign off.
- The Field handoff is an end frame with a Restart ring.
- "Open the table" on slide 4 is queued and opens the read-only table from the gate, never during the film.

Not verified: frame cost on a phone, real contrast numbers by tool (colours are the ruled tokens), touch hold on a real
device, the keyboard-up story screen (it relies on the container height query, tested only at 560 px and below by CSS,
not on a device), landscape beyond one 844 by 390 check.

## Timing table implemented

Reel A (design seconds; reduced motion runs the same table at x1.5 by slowing the clock, so cues keep their order):

| Slide | Line | Dwell | Picture move |
|---|---|---|---|
| Transit | none | 0.62 | fields fade 220, ring scales 1 to 1.5 and fades 420 |
| A1 | Welcome to a neurosomatic experience. | 3.0 | spine 0 to 0.7, seven seats Land from 0.2 (90 ms apart), halo draws 0.9 to 1.8, line in 0.4 |
| A2 | Awareness and intuition is a tool we use to turn your senses inward. | 6.5 | three rings draw from 0.6, seven rim marks Travel inward 3.0 to 4.1, one Land at 4.1 |
| A3 | This is a mirror. It shows what is running you. | 5.0 | none, the film's one rest |
| A4 | It reads 112 addresses. Each is a place in your body. | 5.0 | 112 ticks sweep from the root, the real row sets at 0.5, tick 1 and "112" Land at 1.4, table ring at 2.0 |
| A5 | Discover. Play. Flow. Embody. Then round again. | 5.0 | unlit circle draws 0.9 s, one dot travels once from 0.9 to 4.9, four unlit stations Land as it passes |

Total 24.5 s. Text in 420 ms ease out with a 10 px rise, out 220 ms ease in, opacity only, ending on the boundary.
Hairline 2 px, five segments, 4 px gaps, track ink 40, fill ink 85, no transition.

Gate: no clock. Figure arcs to its pose in 420 ms, hue drains to ink 40, twelve chips Land clockwise from twelve 62 ms
apart, live at 1.1 s. A pick: chip Lands 320, seed bead Travels 600 from +120, ring folds 420 at 0.72, Story at 1.2.
Time line "About four minutes. Stop any time." is computed: 5 pick, 30 write, 38.5 opening, 48 lines, 120 settle, 11 reel B
is 252.5 s, inside the 30 s window around 240, so it prints (rounded to the nearest minute).

Release (shortened, labelled on screen): gift line 0.6, the four welcome lines at 3.6, 6.6, 9.6, 13.6, the stem 16.6,
the person's sentence under it 18.4, the instruction 21.0, 12 lines at 2 s each from 23.0 (real is 4 s), settle from 47.0
for 10 s (real is 120 s). Counter falls one per line, 100 to 88. Total 57 s at 1x.

Reel B: B1 reading has no clock (the seat ring contracts from 0.8 s, "Go on" appears at 3.0 s). B2 loop is 5.0 s with
Pause and Skip. B3 is the one gate. Signal test is 27.5 s of timed lines and then an untimed question.

## Where the pass 3 specs conflicted, and what I chose

1. A1 dwell: UX 4.0, lead rule and narrative 3.0. Chose 3.0 (TALLY ruling 4).
2. A4 dwell: the narrative table says 10 words and 5.0. The line has 11 words, which the rule rounds to 5.5. Kept 5.0 to
   match the table; the check in the file reports the difference. A one line fix in the table if wanted.
3. A5 dwell: narrative 4.0, art and creative 6.0, animation 5.5. Chose 5.0, the shortest that lets the dot travel its 4 s
   after the 0.9 s draw. It also makes the total the lead's 24.5 s.
4. A3: animation has a bead arcing to the Throat, creative says nothing moves. Chose creative (a rest).
5. A5 stations: animation lights them 0.8 s apart, creative and TALLY 3 draw them unlit. Chose unlit; stations Land as the
   dot passes, lit only in Reel B.
6. Seat hue: TALLY 9 says hue only on a lit seat, and the boot figure is the first frame. Chose seven seats in `PAL` in
   Reel A (the demonstration of what a read looks like), drained to ink 40 at the gate (nobody is read yet), one seat
   returning to hue at the first Mirror line. If the owner wants Reel A in ink too it is one constant.
7. Radial light: art says one at 12 percent, TALLY 9 says none. Chose none. The lit seat gets a hue ring.
8. Gate ring geometry: art says centre 54 percent and radius 34vh; the labels outside the top and bottom chips collide
   with the prompt and the controls at 1000 tall, so centre 56 percent, radius 33vh. Gate prompt 28 at wide and 20 at
   390 (art says 20, creative says 44 or 28).
9. Story button: narrative says Release, creative and TALLY 6 say the Story tab's own word. Chose Commit (the shipped
   button says Commit). The step after the reading is "Begin the release".
10. B1 line: narrative's B1 says "That is your avatar changing", TALLY 8 says the word avatar once, on the loop screen.
    B1 is "{Seat} is lower." and "This is your avatar." is B2.
11. B3 headline: narrative's hero "Keep this." would sit above a button also called Keep this. Headline is "Keep this
    reading?", buttons Keep this and Not now at equal weight, as ruled. Guest sees "This stays on this device." and one ring.
12. Reduced motion: UX wants x1.0, TALLY x1.5. Chose x1.5. Cross fade 220 (animation) over 120 (art).
13. Idle pulse at the gate (animation, 10 s): not built, creative says no idle nudge and a pulse would add motion for
    a person who has not moved.
14. Distress figure: creative says 35 percent ink, which measures 2.81 to 1. Used 40.
15. Signal test: UX would move it to the Field; TALLY 8 keeps a quiet ring on the Reel B gate. Chose TALLY.
16. Time line wording: UX prints "five minutes" and adds "One word. You can change it." Chose the narrative's computed
    rule; the second line is not built (no screen yet says a pick can be changed).
17. Back at the gate (UX): not built. Esc is Leave there; the browser Back steps back one slide and never leaves.
18. Hairline offset: UX +4, art +8. Used +4.
19. Skip in the release sits under the counter (the stats corner owns the top right), not in the corner itself.
20. Release opening is compressed to about 21 s from the real silent 38 s so a reviewer is not held in it; the on screen
    label says so, and 4x speed shortens everything further.
21. Seat names use the engine's band names (Root, Sacral, Solar, Heart, Throat, 3rd Eye, Crown).
22. Additions with no spec: a second empty read for "Something else" says "Nothing matched. The release starts at the
    Root." and goes on; "Opens after the film" is the state of the slide 4 table ring once pressed; the Create account
    door hides the fields and says the name and passphrase come at the end.

## Gates run on the mockup itself

Font sizes used are only 11, 13, 16, 20, 28 and 44; CSS transition durations are only 120, 220, 320 and 420 ms (plus
0s on visibility); no em dashes anywhere in the sources or the page; `check.py --line` reports no hard failures on the
new strings. A scripted run at 1600 passed door, transit, auto advance A1 to A2 at the expected time, hold pause, tap
right, double tap left, Pause ring, 4x to the gate, pick, story, empty read and commit, reading, release, Reel B,
account ask and end, and a reduced motion load, with no console errors.
