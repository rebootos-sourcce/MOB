# Pass 3: animation and VFX director (Kai Moana), round PJ

## 1. The proposal as I understand it
One black room, one figure, one clock: a silent five slide film (about 26 s to a decision), a starting point, one sentence, a first reading, his voice opening the release, the 12 line run, an aftercare film, an arc into the Field. The merge lost three things of mine: breathing starts at the first Mirror line, distress needs motion rules, and its 180, 520 and 200 ms values fail gate 12 (the test allowing only 120, 220, 320 and 420 ms for CSS transitions). The lead's order (story before voice) is right; I had it backwards.

## 2. The ICP room
- **Marcus (7).** Sees black, the standing figure, one line. Stays. "The first frame finally is the avatar."
- **Whitney (phone, 5).** Sees seven marks land up a spine, taps right, stays. Sound is off, so her opening is silent. "Feels like an altar, not an app."
- **Nils (4).** Finds Skip, lands on the gate, stays. "Fine, if nothing spins."
- **Camille (6).** Counts the breath, in 2.3 s, out 3.5 s. Approves. "Exhale longer than inhale. Good."
- **Marta (02:00).** Motion starts before she types, so the detector cannot know her yet. Taps Pause, which must exist from frame one. "Make it stop moving."
- **Renata (7).** Reaches the gate at 26 s. "Twenty six seconds, then my call."
- **Trey (3).** Taps through, leaves at the story box. "Where is my result?"
- **Sofia (8).** Hold pauses on the proof row. "Keep that row up."

## 3. Unified quality: 70/100
Gaps: (a) the 40 s opening is silent for most people; (b) frame cost is estimated, not measured on a phone; (c) the distress frame has no clinician text.

## 4. FINAL GRADE: GRADE: 71/100 (pass 1 was 46, pass 2 was 42)
Up: one clock, opaque stage, distress as a blocker. Held down by the gaps.

## 5. Build spec
**Tokens.** Ease out `cubic-bezier(.22,1,.36,1)` (arrivals). Ease in `(.4,0,1,1)` (exits). Land `(.34,1.56,.64,1)` (an overshoot pop). Breath `(.37,0,.63,1)`, 4.2 s, opacity .64 to 1, only once a reading exists. Draw `(.45,0,.15,1)`, 900 ms (canvas). CSS transitions use only 120, 220, 320, 420 ms; longer moves run on the stage canvas (gate 12 does not see them).
**Verbs.** Travel 700 ms ease in, path bent 12 percent. Land 320. Text in 420 ease out, 10 px rise; out 220 ease in. Stagger 62 ms (90 for seats, 70 for twelve points).
**Clock.** One `REEL.t` in seconds inside the existing `loop(ts)`. Delta clamp 100 ms (Technical says 50; at 10 frames a second that doubles a 25 s film). A gap over 100 ms is a hidden tab, which is a pause. Pause mask: hold 1, hidden 2, user 4, typing 8, distress 16, keyboard focus 32. Voice on: `audio.currentTime` is the clock; drift over 120 ms slews, over 400 snaps.
**Transit (0 is its end).** Login fields fade 220 ease in, -0.62 to -0.40. Ring scales 1 to 1.5 and fades, 420 ease out, -0.42 to 0. Ground `#06060a`, same as the login.

**Reel A.** Dwell = max(3.0, 1.0 + words/2.5), up to 0.5 s, cap 7.0, or last cue + 0.5 s if longer. Cue times are slide local.

| Slide | Seconds | Line, dwell | Cues |
|---|---|---|---|
| A1 | 0.0 to 3.0 | Welcome to a neurosomatic experience. 3.0 | Seven seats Land root to crown from 0.2; line in 0.4; halo draws 0.9 to 1.8 |
| A2 | 3.0 to 9.5 | Awareness and intuition... inward. 13 words, 6.5 | Three rings draw from 0.6; seven rim marks Travel inward 3.0 to 4.1, one Land at 4.1 |
| A3 | 9.5 to 14.5 | Mirror line, 10 words, 5.0 | Bead arcs to Throat 2.2 to 2.9, 8 percent squash; seat rises at 9.05 a second to 6.5 by 3.6 |
| A4 | 14.5 to 19.0 | Proof row, 8 words at most, 4.5 | Row in 0.5; "112" Lands 1.4, no counting |
| A5 | 19.0 to 24.5 | Loop line, 7 words, cue bound 5.5 | Lit arc clockwise; four stations Land 0.4, 1.2, 2.0, 2.8; closes 3.6; glow falls to 5.0 |

Slide change: out ends on the boundary, in starts on it. Hairline: 2 px, one segment per slide, 4 px gaps, `scaleX` fill, linear (real time), ink .5 over .28; out 220 at the gate.

**Gate (24.5, no timer).** Figure arcs to centre, scale .36, 420 ease out. Twelve points Land clockwise from 24.9, live at 26.0. At 390: 3 by 4 tiles, 112 by 64, radius 10. Hover lifts 2 px, 120. After 10 s idle, one ring pulse. A pick: tile Lands 320, others fall to .45 over 220, bead Travels 600 from +120, ring folds into the figure 420 ease in (1.14 s). 
**Story.** No clock. First Mirror line in 420; the figure begins to Breathe, ramped in over 1.2 s.

**Release opening (R clock = voice time; visuals lead 150 ms; the same table runs silent, so "Hear it" mid run just seeks the audio).**

| R (s) | Event |
|---|---|
| 0.6 | Gift line in; counter 100 Lands upper right |
| 1.7 | Core Lands |
| 4.73 to 8.36 | REL_WELCOME line 1 |
| 8.58 to 11.39 | Line 2; marks Travel inward 9.8 |
| 15.98 to 16.40 | Anticipation: figure to .985, 420 ease in |
| 16.40 | Line 3; inhale to 1.06 by 18.70; exhale to 22.20 |
| 22.43 | Line 4; inhale to 1.04 by 24.4; exhale to 27.1 |
| 27.13 to 28.0 | Rings contract onto figure, 870 ease in |
| 29.74 | Stem in; five marks Land 30.4, 32.4, 34.4, 36.4, 38.4 |
| 39.95 | Person's sentence lands under the stem, 420 |
| 40.2 to 40.5 | Voice fades; take two never plays |
| 42.5 | Text out 220; figure to small upper left ring, 420 ease out |
| 42.9 | Run line 1: 12 lines at 4 s, a Land per seal, then the 120 s settle dial |

Narrative wants silent 4.5 s shorter; I keep one table so the sound toggle is a seek (alternate: start silent at R = 3.4). The settle dial is drawn per frame, linear because it is real time.

**Reel B (0 is the settle's end).** B1 0.0 to 6.0: seats fall at 4.5 a second, core Lands 1.04, counter swaps 100 to 88 as one beat (120 out, 220 in, never a count), reading in at 1.2. B2 6.0 to 9.0 "This is your avatar." (once): loop ring draws 900 ms, earned stations Land, others ink at 40 percent. B3 from 9.0, one gate: Keep this and Not now at equal weight, fields in 420 staggered, a quiet ring "Try the signal test" on the same screen (one stop, not two). Exit 620 ms: figure arcs to the hub 420, stage out 220 from 200, Field in 420 from 200, app root visible at 200, stage removed at 620.

**Controls.** Hold over 180 ms pauses; release ramps 320. Right two thirds advances, left restarts, a second tap within 1.5 s goes back. Skip 16 px, 44 px target, to the gate in 420. Pause and Sound rings 44 px; Pause visible from frame one in every mode.
**Distress frame.** Cues cancel that frame. Colour to ink over 220 ease in. No Land, Travel or Breathe. Audio fades 300, no auto advance, the pause clears only by the person's choice.
**Reduced motion.** End states, 220 opacity cross fade (not 200), same timer, dwell 1.5 times as ruled (I prefer 1.0, since the entrance budget is gone; it costs only length). No Breathe or scale cues. Dial steps once a second. One function sets `body.still`.
**Frame cost.** Rest 0 ms. One canvas, DPR cap 2, drawn in cues. No blur; glow is a baked 12 percent radial. App root `visibility:hidden` under the stage. Nothing between 3 and 30 Hz, no loop under 2.1 s. Targets 4 ms at 1600, 6 ms at 390 (4x slowdown). The SVG figure repaints, so not compositor only.
**Gate 12b** in `tests/design.js`: load the stage without `?dev=1`; every transition is one of the four durations, none default `ease`; zero animations running on the hidden app; under reduced motion zero running and Pause visible at frame 0.

## 6. Ranked recommendations
1. Clock, pause mask, cues, distress frame (M, redesign): Marta, Whitney.
2. Reel A and gate at 26 s (M, redesign): Marcus, Nils, Renata, Trey.
3. Opening cued to voice (M, redesign): Camille, Marta.
4. Hide app, cut `.ob-wash`, gate 12b (S, reskin): Whitney, Nils.
5. Reel B and Field arc (M, redesign): Renata, Sofia.
6. Pause visible from frame one (S, reskin): Marta.

## 7. Question for the owner
None.
