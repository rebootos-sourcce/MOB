# Pass 3: animation and VFX director (Kai Moana), round PJ

## 1. The proposal as I understand it
One black room, one figure, one clock. A silent five slide film runs (about 26 s to a live decision), the person picks a starting point, writes one sentence, sees a first reading, then hears his voice open the release and does the 12 line run. A short aftercare film ends in one gate and an arc into the Field. The merge kept what I care about, except: it never said the figure starts breathing at the first Mirror line (I had it later), it dropped the distress frame's motion rules, and it quotes 180, 520 and 200 ms, which gate 12 (the test that allows only 120, 220, 320 and 420 ms for CSS transitions) would fail. I also had the box rising at the end of the voice. The lead's order is right: the story comes first, and the voice ends by landing the person's own sentence under the stem.

## 2. The ICP room
- **Marcus (founder, 7).** Sees black, the standing figure, one ruled line at 28 px, no card. Stays. Skips nothing. Leaves nowhere. "The first frame finally is the avatar."
- **Whitney (phone, 5).** Sees seven marks land up a spine and a line. Taps right to go faster, finds the hairline, stays. Sound is off, so she misses the voice and the 40 s opening is silent for her. "Feels like an altar, not an app."
- **Nils (skeptic, 4).** Sees a film he did not ask for. Finds Skip at 16 px in under 3 s and lands on the gate. Stays only because the gate is real. "Fine, if nothing spins and Skip works."
- **Camille (practitioner, 6).** Watches the breath cue: in 2.3 s, out 3.5 s. Approves the longer exhale. Distrusts seat colour on a calm screen. "Exhale longer than inhale. Good."
- **Marta (distress, 02:00).** Sees motion start by itself before she has typed a word, so the detector cannot know her yet. Taps Pause, which must be there from frame one. Leaves if anything moves after that. "Make it stop moving."
- **Renata (operator, 7).** Sees the film, reads the proof row, reaches the gate at about 26 s. Chooses. Stays. "Twenty six seconds, then my call. Good."
- **Trey (tourist, 3).** Taps right thirds, reaches the gate fast, picks the first chip, leaves at the empty story box because it has no timer to hide behind. "Where is my result?"
- **Sofia (open tables, 8).** Hold-pauses on the proof row. Wants the real row, not a picture. Stays. "Keep that row up longer."

## 3. Unified quality: 70/100
Gaps left:
- **Silent 40.5 s opening.** Sound is off by default, so most people watch breath cues with no voice. Untested for patience.
- **Frame cost is estimated, not measured** on a real phone with the stage built.
- **Distress frame** has motion rules (below) but no clinician text yet.

## 4. FINAL GRADE: GRADE: 71/100 (pass 1 was 46, pass 2 was 42)
Moved up because the lead picked one clock, a hairline, the opaque stage, a still figure until the first reading, and distress as a blocker. Held down by the gaps above.

## 5. Build spec

**Tokens.** Ease out `cubic-bezier(.22,1,.36,1)` (arrivals). Ease in `(.4,0,1,1)` (exits). Land `(.34,1.56,.64,1)` (an overshoot pop). Breath `(.37,0,.63,1)`, 4.2 s, opacity .64 to 1, from the first reading only. Draw `(.45,0,.15,1)`, 900 ms, the boot's own curve. CSS transitions use only 120, 220, 320, 420 ms. Moves longer than that run on the stage canvas (not a CSS transition, so gate 12 does not see them) or as keyframes.
**Verbs.** Still: unread. Breathe: a reading exists. Travel: charge moves, 700 ms ease in, path bent 12 percent sideways. Land: 320 ms Land curve. Text in: 420 ms ease out, 10 px rise. Text out: 220 ms ease in. Stagger: 62 ms (90 ms for seven seats, 70 ms for twelve points).
**Clock.** One `REEL.t` in seconds, advanced inside the existing `loop(ts)`. Delta clamp: I give 100 ms. Technical gives 50 ms. At 10 frames a second a 50 ms clamp runs a 25 s film in 50 s; a gap over 100 ms means the tab was hidden, which is a pause. Pause mask: hold 1, hidden 2, user 4, typing 8, distress 16, keyboard focus 32. Voice on: `audio.currentTime` is the clock; drift over 120 ms slews, over 400 ms snaps.
**Transit (clock 0 is its end).** Login fields fade 220 ms ease in, -0.62 to -0.40. Ring scales 1 to 1.5 and fades, 420 ms ease out, -0.42 to 0. Stage ground is the login's exact ground (one `--stage`, `#06060a`).

**Reel A. Dwell = max(3.0, 1.0 + words/2.5), up to 0.5 s, cap 7.0, or last cue + 0.5 s if longer.** Cue times are slide local.

| Slide | Start to end (s) | Line, words, dwell | Cues |
|---|---|---|---|
| A1 | 0.0 to 3.0 | Welcome to a neurosomatic experience. 5, 3.0 | Seven seats Land root to crown from 0.2; line in 0.4; halo draws clockwise 0.9 to 1.8 |
| A2 | 3.0 to 9.5 | Awareness and intuition is a tool we use to turn your senses inward. 13, 6.5 | Three faint rings draw from 0.6, 120 ms stagger; seven rim marks Travel inward 3.0 to 4.1, one shared Land at 4.1 |
| A3 | 9.5 to 14.5 | Mirror line, 10 words, 5.0 | Bead arcs to the Throat seat 2.2 to 2.9, 8 percent squash on impact; seat rises at 9.05 a second to 6.5 by 3.6 and glows |
| A4 | 14.5 to 19.0 | Proof row, 8 words at most, 4.5 | Row in at 0.5; "112" alone Lands at 1.4. No counting |
| A5 | 19.0 to 24.5 | Loop line, 7 words, cue bound 5.5 | Lit arc clockwise only; stations Land at 0.4, 1.2, 2.0, 2.8; arc closes at 3.6; glow falls 3.6 to 5.0 |

Slide change: out ends on the boundary, in starts on it. Hairline: 2 px, one segment per slide, 4 px gaps, fill `scaleX` linear (real time, the one honest linear), ink .5 over a .28 track. It fades out 220 ms at the gate.

**Gate (24.5, no timer).** Hairline out 220. Figure arcs to centre, scale .36, 420 ms ease out. Twelve points Land clockwise from 24.9, 70 ms stagger, live at 26.0. At 390: 3 by 4 tiles, 112 by 64, radius 10, figure in the top 18 percent. Hover or focus lifts a point 2 px, 120 ms. After 10 s idle, one ring pulse, once. A pick: tile Lands 320, others fall to .45 over 220, a bead Travels tile to seat 600 ms from +120, ring folds into the figure 420 ms ease in. About 1.14 s total. The clock never advances here.

**Story.** No clock, typing bit set. First Mirror line in: 420 ms, and the figure begins to Breathe, ramped from its current phase over 1.2 s. Commit: box out 220, no digits.

**Release opening cue table (R clock equals voice time, visuals lead the voice by 150 ms; same table silent, so "Hear it" mid run just seeks the audio to R).**

| R (s) | Event |
|---|---|
| 0.6 | Gift line in 420; counter 100 Lands upper right |
| 1.7 | Core Lands once |
| 4.73 / out 8.36 | REL_WELCOME line 1 |
| 8.58 / out 11.39 | Line 2; inward marks Travel 9.8 |
| 11.61 to 16.40 | Quiet on purpose |
| 15.98 to 16.40 | Anticipation: figure to scale .985, 420 ms ease in |
| 16.40 | Line 3; inhale to 1.06 by 18.70; exhale to 22.20 |
| 22.43 | Line 4; inhale to 1.04 by 24.4; exhale to 27.1 |
| 27.13 to 28.0 | Rings contract onto figure, 870 ms ease in |
| 29.74 | Stem in 420 ms; five marks Land at 30.4, 32.4, 34.4, 36.4, 38.4 (not word synced) |
| 39.95 | The person's own sentence lands under the stem, 420 ms |
| 40.2 to 40.5 | Voice fades. Take two never plays |
| 42.5 | Stem and sentence out 220; figure to the small upper left ring, 420 ms ease out |
| 42.9 | Run line 1. 12 lines at 4 s, one Land per seal, then the 120 s settle dial |

Narrative asks for a silent run shorter by 4.5 s. I keep one table: the first 4.5 s carry the gift line and first Land, and a single table makes the sound toggle a seek. If the owner prefers short, start the silent clock at R = 3.4.
Settle dial: drawn per frame from the clock, not a CSS transition. Linear, because it is real time.

**Reel B (zero is the settle's end).** B1 0.0 to 6.0 reading: seats fall at 4.5 a second, core Lands at 1.04, counter swaps 100 to 88 as one beat (120 out, 220 in, never a count), reading in at 1.2, 62 ms stagger. B2 6.0 to 9.0 "This is your avatar." (once): loop ring draws 900 ms, stations the person earned Land, the rest ink at 40 percent. B3 from 9.0, gate: Keep this and Not now at equal weight, fields in 420 staggered, tick draws 120; a quiet ring "Try the signal test" sits on the same screen so there is one stop, not two. Exit 620 ms: figure arcs to the Field hub 420 ease out, stage out 220 from 200, Field in 420 from 200, app root visible at 200, stage removed from the document at 620. Reel C (signal test, on demand): ten ticks 1.2 s apart, each rises .25 to 1 in 220 ms; three 44 px chips; no answer stores empty.

**Controls.** Hold over 180 ms pauses, release resumes with a 320 ms ramp. Right two thirds advances (out 220, in 420), left third restarts, a second tap within 1.5 s goes back. Skip 16 px, ink .6, 44 px target, to the gate in 420. Pause ring 44 px, visible from frame one in every mode (Marta). Sound ring 44 px, off.
**Distress frame.** Cues cancel on the same frame. Colour to ink over 220 ms ease in, no Land, no Travel, no Breathe, canvas stops, audio fades 300 ms, no auto advance, the pause bit cannot clear until the person chooses.
**Reduced motion.** End states, 220 ms opacity cross fade (not 200: gate legal), same timer, dwell times 1.5 times as the lead ruled (I preferred 1.0 times, since the 1.0 s of entrance budget is gone, but four seats agree and it costs only length). Pause visible from frame one. No Breathe, no scale cues; the figure holds opacity 1. Settle dial steps once a second. One function sets `body.still`.
**Flicker.** Nothing modulates between 3 and 30 Hz. No loop has a period under 2.1 s.
**Frame cost.** Rest 0 ms. One canvas, DPR capped at 2, drawn inside cues only. No `filter:blur`; glow is a baked radial gradient at 12 percent. App root `visibility:hidden` while the stage is up. Targets 4 ms at 1600, 6 ms at 390 with 4x CPU slowdown. Not compositor only: the SVG figure repaints, cheap at 10 nodes.
**Gates.** Add gate 12b to `tests/design.js`: load the stage without `?dev=1`; every transition on it is one of the four durations and none is default `ease`; zero running animations on the hidden app; no animation period under 2.1 s; under reduced motion zero running animations and Pause visible at frame 0.

## 6. Ranked recommendations
1. **One clock, pause mask, cue tables, distress frame (M, redesign).** Marta, Whitney, Renata.
2. **Reel A and gate at 26 s with the table above (M, redesign).** Marcus, Nils, Renata, Trey.
3. **Opening cued to the voice, sentence lands at 39.95 (M, redesign).** Camille, Marta, Whitney.
4. **Hide the app, cut `.ob-wash`, gate 12b (S, reskin).** Whitney, Nils.
5. **Reel B, Breathe at first Mirror line, one gate, arc to the Field (M, redesign).** Renata, Sofia.
6. **Pause visible from frame one in every mode (S, reskin).** Marta.

## 7. Question for the owner
None.
