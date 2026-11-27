# Onboarding v2, one Field (round PP, 2 October)

Open `index.html` from disk. One file, no network, no audio. The Onest typeface is carried in it. `MOTION.md` is the motion brief (the twelve principles of animation, each tied to a moment and a number).
`strip.html` is the contact sheet at 390. `png/` holds every beat at 1600 by 1000 and 390 by 844 (32 beats each, numbered in the order a person meets them), plus `filmstrip-1600.png`, `filmstrip-390.png`, `motion-1600.png`, `motion-390.png` and `still-*.png`.
Sources are in `src/`; `node mockups/onboarding-v2/src/build.js` rebuilds `index.html` and `strip.html` (the script is `src/js/01` to `06`, joined in name order inside one function). Shots: `NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-v2/src/shots.js`. Probes: `probe-motion.js`, `probe-still.js`, `probe-door.js`, and `filmstrip.js` for the contact sheets. `atuned_src/`, `source.html` and `engine.js` are untouched.

## The sequence, in one line

Door, then arrive (a greeting, then "Something brought you here. Let's start there."), ask ("What brought you here?", twelve starting points), settle ("Do not solve it yet. Notice what is here."), feel (six feeling words), body (tap the place), story (one open field), mirror ("Here is what I heard.", That is me or Not quite and a correction), a held breath and a bridge, then the release, Reel B, keep this, the Field. All of it on one Field that never cuts.

## What changed this round

- The five slides of Reel A are gone. The 112 addresses line, the loop slide and the proof row are no longer up front. The ring of 112 ticks is still there, as the Field, with no number on it.
- The Field is the stage. It is the door's own ring (the same 112 ticks, the same three tide arcs): in the transit the ring morphs to the Field's size, the hue drains to ink, and the figure assembles inside it. It stays alive behind every state, including the release (where its ticks are the addresses being said) and Reel B (where the lit ones remain).
- Every input is answered by the Field before any story: a starting point reshapes how the ring moves, a feeling word bends it again (Heavy sags and slows it, Tight pulls it in, Numb dims it, Restless speeds it, Hollow shortens the ticks, Hot warms them), a body tap makes it lean to that seat and gathers its motes around the seat.
- Flow elements: one text box that glides between anchors (a translate), words that rise on an arc one after another, chips that are born in the Field and leave it on arcs and return to it, a trail of the person's own words gathering at the top (Overwhelm, Heavy, Chest), a slow tide behind it all. All DOM motion is transform, translate and opacity.
- The mirror is made only of what the person gave: their pick, their feeling, their place, a quote of their own words, and a word the engine's lexicon knows. Correcting it changes the pieces it can read (a feeling, a place, a lexicon word) and the Field visibly re-answers; if nothing was readable the correction is quoted back as "You added" and the ring still answers once.
- The release, Reel B, keep this, the signal test and the stop frame are kept. They are re-timed to the same word motion and the same Field. The address ring in the release's corner was removed (the Field's own ticks do that now); the gift counter ring of 100 stays in its corner.
- Fixed on the way: a chip still travelling could sit on top of another and take its tap (a chip takes taps only once it has landed); Restart lost the chip layout; the hidden door's 34 s wash kept animating off screen (now paused when the door is not showing).

## What the person does and what moves

| State | Person | Waits or auto | Field and text |
|---|---|---|---|
| Transit | nothing | 1.0 s | door text out 220 ms, ring morphs, figure assembles |
| Arrive, greeting | nothing | 3.0 s | ruled line, words rise |
| Arrive, invitation | nothing | 4.0 s | two sentences, a 620 ms breath between them |
| Ask | taps one of twelve | waits, never advances itself | chips leave the Field on arcs; a tap squashes the chip, a bead flies to the Field, the ring pulls in then answers |
| Settle | nothing | 13.0 s | ring slows (0.45x), warms, breathes 4.2 s; the trail shows the pick |
| Feel | taps a word, or Not sure | waits; 1.8 s after the last tap it goes on | each tap re-answers; a later tap changes it |
| Body | taps a place, or Not sure | waits; 2.0 s after the last tap it goes on | outline draws on, ripple, lean, seat colour, motes |
| Story | writes, then Done (3 words or more), or "I would rather not say" | waits | each new word is a small ripple |
| Mirror | That is me, or Not quite and one line | lines at 900 ms, then waits | the line being read moves the Field |
| Recognition | nothing | 1.2 s of Field only, then the bridge | pull to 0.94 then spring, one breath |
| Bridge | "Begin the release" (consent) | waits | |
| Release, Reel B | as before | as before | |

Tap on empty stage goes on at once while the space after an answer is running. Hold 180 ms pauses a clocked beat, tap right goes on, tap left restarts it (twice within 1.5 s goes back one). Esc is Skip on a clocked beat and Leave at the question.

## Where the pasted review conflicts with a ruling, and what I did

1. Review: open with an invitation, no explanation up front. Rulings: "Welcome to a neurosomatic experience." and "Awareness and intuition is a tool we use to turn your senses inward." are his own words. Kept both. The greeting is the only card before the invitation (3 s, a tap skips it). The awareness line moved to the settle beat, where it does its job: it is the instruction for turning inward, and "Do not solve it yet" follows it.
2. Review: no 112 addresses, no Discover Play Flow Embody up front. Done. The loop (still a circle, ruled) is Reel B 2 only, and the word avatar is still said once, there.
3. Review step "PATTERN: Here is what may be running underneath it". Not built. A pattern line would be an inference, and the ruling is that the mirror is sourced from the person's own words and never invented. The bridge goes from recognition to the release.
4. Review: no required button presses. Kept that everywhere except the points where a person answers, and kept "Begin the release" as a button, because starting a twelve line release is a consent, not an advance.
5. Review: "What changed?" after the release. Reel B 1 ("Heart is lower.") already does that and is kept as is.
6. Rulings that stand and were not touched: account after the first release, gift counter of 100, the release stem, twelve starting points, no number, score or percent on screen (the time line is words and is computed; the lexicon amounts are never shown), the loop as a circle, no permanent safety line with a stop frame, Login A, sourced mirror.
7. The earlier hairline (one segment per slide, ruled in round PJ) is retired: there are no slides to count, and a progress line would say pages. Pause is still visible on every clocked beat.
8. The time line used to print only when the path was within 30 s of four minutes. The new path is about five minutes, so it now prints whatever it computes, rounded to the nearest minute ("About five minutes. Stop any time."). Still computed, never typed.
9. "Open the table" (the 112 rows) is dropped with the slide it lived on. It can return on the Field screen after the release.
10. The pass 3 rule "seat hue only on small marks" is kept in spirit: ring ticks are 2 px marks, and a seat colour reaches them only after the person names the place (at most 40 percent mix on the ring, a stronger arc on the tide arc of that seat).

## Timing, measured

### 1600 by 1000, played at 1x

| Beat | Beat length s | Text card | Enter ms | Hold ms | Exit ms | Peak things moving | Typical |
|---|---|---|---|---|---|---|---|
| login | 1.1 | none | - | - | - | 0 | 0 |
| transit | 1.4 | none | - | - | - | 1 | 1 |
| arr1 | 3.5 | card 1 | 540 | 1893 | 220 | 3 | 1 |
| arr2 | 4.1 | card 1 | 1020 | 2563 | 220 | 3 | 1 |
| ask | 3.9 | card 1 | 470 | 2113 | 220 | 4 | 2 |
| settle | 13.4 | card 1 | 820 | 5963 | 220 | 4 | 1 |
|  |  | card 2 | 1170 | 4863 | 220 |  |  |
| feel | 3.7 | card 1 | 780 | 3070 | 220 | 4 | 2 |
| body | 4.0 | card 1 | 540 | 3443 | 220 | 4 | 1 |
| story | 2.2 | card 1 | 1503 | 730 | 220 | 4 | 1 |
| mirror | 13.6 | card 1 | 540 | 8326 | 220 | 4 | 2 |
|  |  | card 2 | 610 | - | - |  |  |
|  |  | 10 more (min to max) | 553 to 2820 | 1480 to 3773 | 120 to 220 |  |  |
| recog | 5.7 | card 1 | 3353 | - | - | 2 | 1 |
| rel | 58.7 | card 1 | 610 | 2307 | 220 | 3 | 1 |
|  |  | card 2 | 750 | 2250 | 220 |  |  |
|  |  | 18 more (min to max) | 470 to 2253 | 1230 to 8946 | 220 |  |  |
| b1 | 3.8 | card 1 | 2253 | 330 | 220 | 3 | 1 |
| b2 | 5.0 | card 1 | 820 | 3730 | 220 | 4 | 1 |
| b3 | 2.4 | none | - | - | - | 2 | 2 |
| end | 0.6 | none | - | - | - | 2 | 2 |

| Beat | Frames | fps | p95 frame gap ms | Worst gap ms | Page cost per frame, mean ms | Page cost, max ms |
|---|---|---|---|---|---|---|
| login | 7 | 51.4 | 33.3 | 33 | 0.93 | 5.2 |
| transit | 42 | 28.9 | 50.0 | 450 | 0.76 | 10.3 |
| arr1 | 171 | 49.3 | 16.8 | 517 | 0.52 | 8.6 |
| arr2 | 206 | 49.8 | 33.4 | 200 | 0.36 | 8.6 |
| ask | 197 | 50.5 | 33.4 | 217 | 0.37 | 6.4 |
| settle | 651 | 48.4 | 33.4 | 417 | 0.64 | 89.7 |
| feel | 193 | 52.1 | 33.4 | 133 | 0.28 | 4.6 |
| body | 194 | 47.9 | 33.4 | 200 | 0.49 | 6.5 |
| story | 108 | 49.0 | 33.4 | 183 | 0.42 | 5.3 |
| mirror | 624 | 45.9 | 50.0 | 250 | 0.35 | 8.8 |
| recog | 263 | 46.2 | 33.5 | 217 | 0.72 | 88.2 |
| rel | 2899 | 49.4 | 33.4 | 350 | 0.42 | 29.8 |
| b1 | 168 | 44.1 | 49.9 | 350 | 0.43 | 5.5 |
| b2 | 287 | 57.2 | 16.8 | 50 | 0.57 | 6.1 |
| b3 | 98 | 40.4 | 66.6 | 300 | 0.39 | 5.1 |
| end | 28 | 52.3 | 33.3 | 67 | 0.04 | 0.1 |

Load average before the run 22.6, 25.1, 25.2, after 24.5, 24.9, 25.1, on 4 cpus.

### 390 by 844, played at 1x

| Beat | Beat length s | Text card | Enter ms | Hold ms | Exit ms | Peak things moving | Typical |
|---|---|---|---|---|---|---|---|
| login | 1.0 | none | - | - | - | 0 | 0 |
| transit | 1.0 | none | - | - | - | 1 | 1 |
| arr1 | 3.0 | card 1 | 540 | 1876 | 220 | 3 | 1 |
| arr2 | 4.0 | card 1 | 1020 | 2430 | 220 | 3 | 1 |
| ask | 3.9 | card 1 | 470 | 2163 | 220 | 4 | 2 |
| settle | 13.4 | card 1 | 820 | 5713 | 220 | 4 | 1 |
|  |  | card 2 | 1170 | 5080 | 220 |  |  |
| feel | 3.7 | card 1 | 780 | 3003 | 220 | 4 | 2 |
| body | 4.2 | card 1 | 540 | 3626 | 220 | 5 | 2 |
| story | 2.2 | card 1 | 1503 | 697 | 220 | 4 | 1 |
| mirror | 12.6 | card 1 | 540 | 7810 | 220 | 4 | 2 |
|  |  | card 2 | 610 | - | - |  |  |
|  |  | 10 more (min to max) | 420 to 2553 | 3373 | 220 |  |  |
| recog | 5.4 | card 1 | 3203 | - | - | 2 | 1 |
| rel | 57.4 | card 1 | 610 | 2390 | 220 | 3 | 1 |
|  |  | card 2 | 750 | 2233 | 220 |  |  |
|  |  | 18 more (min to max) | 470 to 2203 | 1163 to 8930 | 220 |  |  |
| b1 | 3.7 | card 1 | 2203 | 280 | 220 | 3 | 1 |
| b2 | 5.1 | card 1 | 820 | 3796 | 220 | 4 | 1 |
| b3 | 2.4 | none | - | - | - | 2 | 2 |
| end | 0.6 | none | - | - | - | 2 | 2 |

| Beat | Frames | fps | p95 frame gap ms | Worst gap ms | Page cost per frame, mean ms | Page cost, max ms |
|---|---|---|---|---|---|---|
| login | 18 | 53.7 | 33.4 | 33 | 0.20 | 0.3 |
| transit | 51 | 49.2 | 33.4 | 133 | 1.02 | 11.6 |
| arr1 | 163 | 53.7 | 16.8 | 117 | 0.38 | 3.1 |
| arr2 | 230 | 57.3 | 16.8 | 67 | 0.29 | 6.5 |
| ask | 204 | 52.1 | 33.4 | 67 | 0.40 | 4.2 |
| settle | 719 | 53.8 | 16.8 | 333 | 0.33 | 5.5 |
| feel | 202 | 54.8 | 33.3 | 83 | 0.41 | 13.9 |
| body | 218 | 52.5 | 33.3 | 117 | 0.44 | 4.9 |
| story | 92 | 41.7 | 50.1 | 233 | 1.04 | 37.9 |
| mirror | 626 | 49.5 | 33.4 | 183 | 0.39 | 9.8 |
| recog | 281 | 52.2 | 33.4 | 100 | 0.38 | 3.4 |
| rel | 3143 | 54.8 | 16.8 | 167 | 0.39 | 8.1 |
| b1 | 205 | 55.4 | 16.8 | 83 | 0.32 | 2.6 |
| b2 | 283 | 55.7 | 16.8 | 167 | 0.54 | 15.8 |
| b3 | 123 | 51.6 | 33.4 | 133 | 0.29 | 1.8 |
| end | 33 | 54.9 | 33.3 | 33 | 0.03 | 0.1 |

Load average before the run 24.5, 24.9, 25.1, after 22.8, 24.2, 24.8, on 4 cpus.

How to read the tables. A person is simulated: it answers after a short think time (2.2 s at the question, 1.8 s at feel, 2.0 s at body, 1.5 s at story and so on), so the length of the answering beats is the probe's, not the product's. Enter runs from the first word starting to the last word ending, so it includes the stagger; where a card also reveals something later (the Done button in story, the question and the Begin button in recognition, a line after another in the mirror) that later reveal is inside its enter figure, which is why story is 1503 and recognition 3353. Hold runs from the end of the enter to the start of the exit. Exit is all words together. The mirror's lines are separate cards, each 900 ms after the last. Words are counted by animations, so the word counts are approximate and are left out here.
"Things moving" counts one choreographed group each: a card's words, a chip set, the trail, the body targets, the text box glide, a section fade, the release counter, and the Field as one group however many canvas movers it has (pose arc, answer wave, ripple, pull, bead, lean). The ambient tide, the breath and the 28 motes are always on and are not counted. The peak is the moment of a state change (it is the overlap that makes the change flow). The typical figure, 1 to 2, is what a person sees while anything is moving, and it is the staging number.

Design numbers, for reference: transit 1.0 s, greeting 3.0 s, invitation 4.0 s, settle 13.0 s (the ruled line 0.3 to 6.6 s, the notice card from 6.8 s), after a feeling 1.8 s, after a body tap 2.0 s, mirror lines at 2.1 s plus 0.9 s each and the question 0.3 s after the last, recognition 1.2 s of Field only then the bridge, button at 4.0 s. The release is unchanged (57 s at 1x, labelled as shortened).
Words enter at 220 ms opacity, 260 ms arc, 70 ms apart and no more than 560 ms across a line. The brief says an element enters in 180 to 260 ms. Each word does. A whole card takes longer because of the stagger, on purpose: reading order is the job.
Dwell check for the ruled long line: "Awareness and intuition..." has 13 words, the old rule says 6.2 s, and it holds 5.7 to 6.2 s on screen after its enter.

## Frame rate and cost, honestly

The machine is shared and was heavily loaded (load average about 25 on 4 cpus for all three runs, and the browser is headless with a software renderer). Read the fps with that in mind. They are not a claim about a phone.

| Width | Frames | Mean fps | p95 frame gap | Page cost per frame (step plus draw) |
|---|---|---|---|---|
| 1600 by 1000 | 6137 | 50.5 | 33.4 ms | mean 0.46 ms, p95 0.8 ms, max 89.7 ms |
| 390 by 844 | 6592 | 54.2 | 33.3 ms | mean 0.39 ms, p95 0.9 ms, max 37.9 ms |

- The number to trust is the page's own cost: under half a millisecond per frame for 112 ticks, 28 motes, three arcs and a figure, against a 16.7 ms budget. The frame gaps above 16.7 ms are the machine, not the page. Two earlier runs of the 1600 probe put the 50 to 240 ms spikes on different beats each time, so they are scheduler stalls and not a cost in the code.
- The first frames of the transit were the slowest in both runs (about 29 fps at 1600, worst gap 450 ms): that is the canvas resize after the door and the first layout of the flow section.
- DOM motion seen in the run: opacity, transform and translate only (words, chips, trail, body targets, text box glide, section fades, the squash and nudge). Paint only, no layout: 120 ms colour changes on rings and fields for hover and focus. No width, height, top or left is animated. One carry over that the probe did not reach: the keep this fields still open with a 420 ms max-height, as in the previous build.
- The canvas is the one full redraw per frame that the door already had. Nothing new is composited as its own layer except the text box glide.
- `DPR` is capped at 2. The probe ran at 1.

## Reduced motion

Same function as before (`setStill`, set by the strip's Still switch and by `prefers-reduced-motion`), now also governing the Field. `probe-still.js` plays the flow with the browser told to reduce motion and checks, per beat, the real Animation objects and the Field's own movers:

- No transform or translate animation runs. The only motion left is an opacity fade of 220 ms (and the 120 ms colour change on a ring that is pressed).
- No spring, wave, ripple, pull, bead or pose arc is live after the first frame. An input puts the Field in its end state at once: the new shape, the lean, the seat colour, the motes already gathered round the seat.
- The tide, the breath and the mote drift stop. The canvas is the same picture twice. Words appear without rise or stagger. Chips fade in at their places. The text box does not glide.
- The clocked beats run at 1.5x slower, so cues keep their order, and a screenshot of the still state is `png/still-1600-body-tap.png` and `png/still-390-body-tap.png` (a good picture: the outline, the seat ring, the motes round it, the trail).
- Result at both widths: 6 beats, 0 misses.

## Real and stubbed

Real (read from the repository at build time or built to spec):
- The 112 addresses, their seats and the release lines come from `atuned_src/engine/data/nodes.js`. The seven seat colours are `PAL`. Lexicon values are the engine's own `LEX` entries for the fourteen words.
- Release welcome lines are the shipped `REL_WELCOME`, the line pattern the shipped `REL_ENTRY` rotation.
- Dwell rule, time line (computed from the design path), clock, pause mask, hold and tap, reduced motion, easing curves, type scale.

Stubbed:
- The shapes of movement. No engine table maps a starting point or a feeling to how a field should move. The twelve profiles in `01-data.js` (STARTS) and the six in FEELS are an animator's reading. They are the part most likely to be retuned. The seat a place belongs to is the real seat.
- The reading is a fourteen word lexicon plus the person's own three taps. Correction parses a small word list (PLACE_WORDS, FEEL_WORDS, the lexicon). A correction with none of those words is quoted back and not interpreted.
- Gift counter 100 is a typed constant (J8). No audio, no account, no network. Log in, Create account, Keep this and the 988 buttons do nothing real. The distress stop frame is static, with no detector, text flagged on screen as needing clinician sign off.
- The Field handoff is an end frame with a Restart ring.
- Removed code that may return: the Reel A slides, the "Open the table" dialog.
- No GIF or WebM. There is no video encoder on this machine (no ffmpeg), and I did not try the browser's own screen recorder, so the owner's view of motion is `filmstrip-*.png` (six states in order) and `motion-*.png` (the Field answering a tap, frame by frame, with the clock stepped by hand), plus the live file.

Not verified: frame cost on a phone, touch hold on a real device, the keyboard up story screen, short landscape (844 by 390: the new poses were not solved for it), screen readers (a live region line is set on every beat, nothing else was tested), contrast of text over the tide arcs (arcs are 10 to 38 percent ink or less and sit behind the text, but no tool measured it, and `probe-door.js` still covers only the door).

## Pass 3 choices that still stand

Seat names are the engine's band names. Hue returns only for a lit seat (here: a named place or the release address being said). Guest sees "This stays on this device." and one ring. The signal test is a quiet ring on the keep screen. Reduced motion runs the clocked beats at 1.5x. Pause is visible from the first frame of a clocked beat. Skip lands at the next answer, never in the app. The distress stop frame sells nothing. Transitions are 120, 220, 320 or 420 ms, with three exceptions this round: 260 ms for the word arc, 520 ms for the Field's pose arc into the body and side poses (a context change, inside the 400 to 600 ms range), and 640 ms for the door's red wash to leave in the transit (opacity only, so the door does not pop at the end of it).
Font sizes used are only 11, 13, 16, 20, 28 and 44. No em dashes anywhere in the sources. `check.py --line` reports no hard failures on the new strings.
