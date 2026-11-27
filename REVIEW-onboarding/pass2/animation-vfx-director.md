GRADE: 42/100 (was 46)

Kai Moana, animation and VFX director, pass 2, round PJ. I read all twelve pass 1 reports. No QA report had landed.

## 1. AGREEMENTS

- **A full bleed black stage, no card, no dimmed app, no wash.** Art, Brand, Creative, Innovation, UIUX, Technical, me.
- **The clock never crosses a decision or the story box.** Game, Creative, Sales, Marketing, Innovation, UIUX, me. A timed choice is pressure, and a defaulted answer is a lie.
- **Controls.** Hold pauses, thirds for taps, a quiet Skip, a visible pause button (Creative, Game, Brand, Marketing, UIUX, Technical, me). A pause that only works by holding traps anyone who cannot hold.
- **The recorded voice belongs to the release opening, sound off by default.** Brand, Marketing, Game, Creative, UIUX, me.
- **The loop closes as a circle** (Art, Brand, UIUX, Game, me), and **the Field stops drawing under the stage** (Technical, me).
- **Distress is a ship blocker** (Narrative, Innovation, Creative, Systems, Art). Technical measured 29 to 39% main thread busy under the old sheet.
- **No `setTimeout` clock.** Technical and me.

## 2. DISAGREEMENTS

- **Systems: clock by CSS animation and `animationend`.** Declined. Reduced motion removes the animation, so the event never fires and the slider freezes silently. One JS clock in the existing frame loop.
- **Technical: clamp frame time at 50ms.** I take 100ms. At 10 frames a second a 50ms clamp runs a 25 s film in 50 s. A gap over 100ms means the tab was hidden, which is a pause.
- **Innovation: answer the signal test by holding.** Declined, and Innovation doubts it too. Hold already means pause. Three ring chips instead.
- **Innovation: slides change on the exhale, breath ring as progress.** Declined for the slider. A swelling ring is the meditation timer Brand warns about, and in my own verb table breathing means a reading exists. I withdraw my pass 1 breathing in slide 1. The figure stays Still until the first reading, then begins to breathe. That is the earned moment.
- **Narrative: voice used 1.85 to 25.5 s on the signal test. Systems: grounding on the slider, stem on the release.** Both declined. The grounding leads into the stem, and the seam (human voice, then the list read by the machine) breaks if the halves play minutes apart. One range, release opening only, 0 to 40.5 s.
- **UIUX: 70 s before the first decision, with breath ring and signal test.** Declined. The release opening already is the body exercise. Two in a row is Creative's point.
- **Progress mark, settled.** Art, Brand, Creative, Narrative want a ring. Marketing, UIUX, Technical and I want a hairline. I take the hairline. The loop is a circle on slide 5, and the figure already owns a halo. A ring of progress makes three rings with three meanings. A 2px line across 358px has 66px segments you read in peripheral vision. A 48px ring has 20px arcs.
- **Palette.** I side with Art: the quieter canon colours on the stage. Saturation multiplies on a full black screen. The stage reads seat colour through one function, so whichever palette wins, one line changes.

## 3. WHAT I MISSED

- **Distress.** I had a hook only. It needs a named frame: everything Still, no colour, no Land, audio fading out in 300ms, never auto advancing.
- **The signal test.** I gave it no scene. It is 108 words in Art's count, so it becomes Reel C below.
- **The stem has five verbs, not six.** I wrote six marks in pass 1. The count is read off the stem text.
- **The run was never budgeted** (UIUX, Game). Twelve lines at 4 s is 48 s, plus about 15 s of cooling, plus the 120 s settle.
- **`confirmed:false` blocks words, not timing.** Phrase starts are measured from silences. The screen shows only the ruled `REL_WELCOME` lines and the ruled stem, never the draft transcript.
- **Voice may not play on older Safari** (Technical, Creative). `canPlayType` guard, silent track continues.
- **Revised grade.** Frame budget 6 to 4 (Technical's measurement). Reduced motion 7 to 6 (Systems: no rule on the fade or the card move). Gate 12 never sees the sheet because `design.js` runs with `?dev=1`.

## 4. THE PROPOSAL, TOGETHER: THE FINAL TIMELINE

**Verbs (one meaning each).** Still: unread, sealed. Breathe: a reading exists, 4.2s sine, opacity .64 to 1. Travel: charge moving, 700ms `--ease-in`, curved path (quadratic, 12% sideways bend). Land: you changed something, 300ms `--ease-land`. Text in: 380ms `--ease-out`, 10px rise. Text out: 220ms `--ease-in`. Draw: 900ms `(.45,0,.15,1)`, the boot's own curve. Charge rises at 9.05 a second and falls at 4.5, the engine's real rates. Stagger is 62ms between sibling things (or 90ms for the seven seats).

**Clock.** One `REEL.t` in seconds, advanced inside the existing `loop(ts)`. Cues read it, never a timer. Pause reasons are a set: hold, hidden, user, focus, typing, distress. With voice on, `audio.currentTime` is the authority. Drift over 120ms slews, over 400ms snaps. Dwell is Narrative's: 1.0 s plus words over 2.5, rounded up to 0.5 s, minimum 2.5, at most 12 words. A slide is the longer of its reading dwell and its last cue plus 0.5 s.

**Transit from login.** Time zero is its end. Fields fade -0.64 to -0.46 `--ease-in`. The login ring scales 1 to 1.5 and fades, -0.52 to 0, `--ease-out`. Seats start landing at -0.2, so nothing waits. The stage ground must be the login's exact ground (one `--stage` variable), or a step shows.

**Reel A, the welcome, silent. Seconds from zero.**

| Slide | Start to end | Line (Narrative owns words) | Motion |
|---|---|---|---|
| A1 | 0.0 to 3.5 | Welcome to a neurosomatic experience. | Seven seats Land root to crown, 90ms stagger. Halo draws clockwise 0.9 to 1.8. Line in at 0.6 |
| A2 | 3.5 to 8.0 | Neuro is your nerves. Somatic is your body. | Pulse travels up the spine 3.9 to 4.6, each seat pops as it passes. All seven Land together at 5.6 |
| A3 | 8.0 to 14.0 | Awareness and intuition is a tool we use to turn your senses inward. | Three faint rings draw 8.6, 120ms stagger. Seven rim marks Travel inward 11.0 to 12.1, each ends in one Land. Once |
| A4 | 14.0 to 20.0 | It reads your words. Each points to a place in your body. | Bead arcs from the line to Throat 17.2 to 17.9, 8% squash on impact, seat rises to 6.5 by 18.6 and glows |
| A5 | 20.0 to 25.5 | Discover. Play. Flow. Embody. Then round again. | Lit arc clockwise only, a station every 0.8 s from 20.4, closes at twelve at 23.6. Glow falls 23.6 to 25.0 |
| Gate | 25.5 to 27.0 | Pick your starting point. | Figure arcs to centre, scales .36, 520ms `--ease-out`. Loop ring stays as the outer ring. Twelve points Land clockwise from 25.9, 70ms stagger |

Slide change: out ends on the boundary, in starts on it. Total 25.5 s of telling, a live decision at 27.0 s. That is longer than Brand's 22 s because the ruled two sentences cost 9 s with their gloss. It is far under 70 s.

**The gate.** No timer. Hover or focus lifts a point (Land, 120ms). After 10 s idle the centre takes one Land ring, once. Below 700px the ring becomes a 3 by 4 grid of tiles 112 by 64 in the same order and stagger, figure at the top 18%. A tap: tile Lands 300ms, others fall to .45 over 220ms, a bead travels tile to seat 600ms, the ring folds into the figure 380ms `--ease-in`. About 1.1 s, then the release opening. Systems must give each of the twelve a seat.

**Release opening, R-clock equals voice time.** Cut at 40.5. Visuals lead the voice by 150ms.

| R time | Event |
|---|---|
| 0.6 to 4.4 | Gift line (six words, Sales), counter 100 Lands upper right, where stats live |
| 1.7 | Core Lands once as the voice begins |
| 4.73 to 8.45 | Line 1 |
| 8.58 to 14.55 | Line 2. Inward marks Travel 9.8 |
| 16.40 | Line 3. Inhale 16.55 to 18.85, scale 1 to 1.06 `(.37,0,.63,1)`. Exhale to 22.2 |
| 22.43 | Line 4. Shorter breath, exhale ends 27.1 |
| 27.13 to 28.0 | Rings contract onto the figure, 870ms `--ease-in` |
| 29.74 | Stem is the hero line. Five marks Land at 30.4, 32.4, 34.4, 36.4, 38.4. Not word synced, no word times exist |
| 40.1 | Box rises, caret, clock stops. Voice fades 40.2 to 40.5. Take two is held for a later run |

After "Read it" (shown at five words): box out 220ms, figure shrinks to the small address ring upper left, 520ms `--ease-out`. The run is release.js's own clock: 12 lines at 4 s, one Land per seal, then cooling and the 120 s settle dial (1000ms linear, the one true linear, because it is real time). Quiet exit after cooling, never forced. No flicker: no visual modulates between 3 and 30 Hz, loops run no faster than 2.1 s a period.

**Reel B, after the settle.** B1 0.0 to 3.6: seats fall at 4.5 a second, core Lands 1.04, counter swaps 100 to 88 as one beat (120ms out, 220ms in, never a count). Figure starts to breathe at 3.6, ramping in from its current phase. The word "avatar" is first said here (Brand). B2 3.6 to 9.6: reading enters 380ms, 62ms stagger, rings expand, Travel speed 0.7 to 1.5 times live DQ. B3 from 9.6, gate: Keep this and Not now at equal weight, fields 380ms staggered, tick Lands 120ms. Exit 640ms: figure arcs into the Field hub 420ms, stage fades 220ms, the Field enters on its own 380ms.

**Reel C, the signal test, on demand** from a Field door and the profile, never forced. C1 0.0 to 4.0 "Bring your attention to your throat." C2 4.0 to 16.0 ten ticks, 1.2 s apart, each rises .25 to 1 in 220ms and stays. C3 16.0 to 28.0 the same for no. C4 gate, three 44px chips, 700ms after a tap it advances. No answer records nothing.

**Controls.** Hairline 2px at the top, one segment per slide, 4px gaps, fill `scaleX`, linear, ink at .5 over a .28 track. Hold 200ms pauses, release resumes with a 300ms ramp. Tap thirds: left restarts, then back inside 1.5 s, middle toggles pause, right goes on. Visible: Skip (text, top right), Pause ring 44px, Sound ring 44px. Skip goes to the gate in 520ms. At the gate it reads "Not now" and goes to the unread Field without setting `onboarded`. Esc and arrows work.

**Reduced motion.** End states, instant cuts, same timer, no longer dwell (they asked for stillness, not slowness). Hairline becomes done, current, ahead. Pause visible from frame one. One function sets `body.still`.

**Frame cost.** Rest is 0ms: one CSS opacity animation. One canvas (rings, marks, bead, glow), DPR capped at 2, drawn only inside cues. No `filter:blur`, glow is a baked radial gradient. Targets 4ms at 1600, 6ms at 390 with 4x slowdown. Not compositor only: SVG figure repaints, cheap at 10 nodes.

**Needs agreeing.** Art: type (40/28, weight 300), ground, palette. Narrative: lines, 12 words, gift line, "Not now". Systems: seat for each starting point, `distress` hook. Technical: the clock, the cue table, the voice embed. UIUX: control positions. Game: first mark and counter.

## 5. REVISED GRADE: 42/100 (was 46)

Technical measured the cost I only suspected. Systems found the missing reduced motion rule. Nothing I read raises the current build.

## 6. TOP 5

1. **Reel engine: one clock, pause reasons, cue tables, distress frame (M).** Whitney, Marta, Derek.
2. **Reel A and the gate, 27 s (M).** Marcus, Nils, Angela.
3. **Release opening cued to the voice, box at 40.1, counter (M).** Marta, Camille, Angela.
4. **Reel B: the figure begins to breathe, Keep this, exit into the Field (M).** Everyone at the moment of value.
5. **Reduced motion, cut `.ob-wash`, stop the Field draw, name the gate 12 durations (S).** Motion sensitive users, older laptops.

## 7. QUESTION FOR THE OWNER

None. Decision: the signal test leaves the first minute and becomes an optional scene after the first release. Reason: he asked for no button pressing and a first release, and the release opening is already a breathing exercise.
