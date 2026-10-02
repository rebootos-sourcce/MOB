# Pass 3, art director (round PJ)

Mika, with Sol (colour, light), Bjorn (type, grid), Petra (composition, symbol). I read PROPOSAL.md and the twelve pass 2 reports, and measured against `head.html` tokens.

## 1. The proposal as I understand it

One black room, one figure, one clock: login, a silent 26 second film, one decision (twelve starting points), one sentence read back, a 12 line release, then the figure arcs into the Field. The lead's merge kept everything I care about except three things. It dropped the Back ring (fine, thirds and arrows serve it). It left the gate chip's colour open: Creative says ink, I said seat hue. It never says what happens to my wordmark, which now collides with the release's address ring in the upper left. Sol also found that Brand's "35 percent white clears 3 to 1" is wrong: ink at 35 percent on `#06060A` measures 2.81 to 1. At 40 percent it is 3.33. Use 40.

## 2. The ICP room (judged on form, light, type, symbol)

- **Marcus, founder, level 7.** Sees the boot figure holding still on black, then one line. Lets it run. Stays: it looks like the thing he built, only quieter. He leaves nowhere. "Good. Where is my avatar going to live?"
- **Whitney, phone only, esoteric native.** Sees black, a figure, white words, a 2 px hairline. Holds to pause and screenshots slide 2. Stays: she reads the loop circle as a chart, not a poster. Risk: the twelve chips at 390 are plain ink, so no screenshot. "Where is the one I post?"
- **Nils, design skeptic, level 4.** Squints: figure, line, nothing. That order is right. Then he checks the gate and finds two layouts (ring at 1600, grid at 390). Stays if the type is on six sizes and the hairline aligns to the 16 px gutter. Leaves at one stray hue. "One face, one black. Fine. Show me the edge case."
- **Camille, somatic practitioner, level 6.** Sees stillness, a slow breath only after the first reading. Approves that nothing pulses. Checks the distress frame and wants it plain. "It is quiet. Do not make it pretty at the wrong moment."
- **Marta, 02:00, acute distress.** Sees a very dark screen, thin text. Brightness matters: `#06060A` is dim, good. She leaves if anything moves while she reads. The film must be pausable by one tap on Pause. "Please stop moving."
- **Renata, operator, level 7, main target.** Sees a clock she can read: hairline, five segments, 26 seconds. Taps right twice, reaches the gate in six seconds. Stays: the proof row ("112 addresses") is a real number from the engine. "That is a spec sheet. Good."
- **Trey, quiz tourist.** Taps right through the film, picks the first chip, types four words. At the reading he looks for a card to post and finds none. Leaves at Keep this. "Where is my result image?"
- **Sofia, loves the open tables.** Sees the proof row and wants more of it on the stage. Stays through the film for it. "Can I tap that row?" It should open the table after onboarding, not during.

## 3. Unified quality: 72/100

The grammar is nearly one: one ground, one scale, one stroke, one motion set. Three gaps left.

1. **The gate is not drawn at every size.** The ring (1600) and the 3 by 4 grid (390) exist as numbers, not as layouts. 320 wide, 667 tall and landscape phone are open, and so is the story screen with the keyboard up. I draw them in section 5.
2. **Twelve starting point icons do not exist.** House rule: if it has a name it has an icon. Petra owns a ring family: 24 px grid, 1.6 stroke, round caps, no fill, ink (a starting point is not a body place, so no seat hue).
3. **No gate watches the stage.** `design.js` runs with `?dev=1`, so it never sees login or the stage. Contrast, ground and the 12 px hue rule go unmeasured.

## 4. FINAL GRADE: 74/100 (pass 1 was 38, pass 2 was 38)

GRADE: 74/100

This grades the proposal as written. The shipped build is still 38 until it is built. Moved up by 36: the card, dots and wash go (Bjorn, Sol); one ground; seat hue only on small marks; contrast rules fixed by number (Sol); the stage is a composition with one order (Petra). Held below 80 by the three gaps above.

## 5. My part of the build spec

**Ground and tokens.** `--stage:#06060A`, opaque, the same in all four lightings, and exactly the login's ground (a one pixel step shows as a seam). Ink `#EFEDE8` 17.3 to 1, mid `#B4B0A8` 9.4, dim `#94908A` 6.4. Ink 40 percent = 3.33 (ahead marks, unlit seats, unchosen chips). Never ink 22 percent on anything meant to be seen (1.76). Seat colours are shipped `PAL` (Root 5.1 to 9 to 10.8 on stage). Accent `--accent`. Alarm never on the stage.

**Type.** Sizes 11, 13, 16, 20, 28, 44 only. Hero 44/52 at 1600 weight 300, 28/36 at 390 weight 400 (thin strokes of 2 px at 28 shimmer). If 300 shimmers on a 1x screen, use 400 and say so. Hero measure 17em, `text-wrap:balance`, 12 words max. Gate prompt 20/28 mid. Chip label 16/20, two lines max. Skip 16 (lead's floor), ink 60 percent (6.4 to 1), 44 px target. Slide 2 is 13 words, over the 12 word gate: whitelist it beside slide 1 or the gate fails the ruled line.

**Dwell.** I yield to the lead: `max(3.0, 1.0 + words/2.5)`, rounded up to 0.5, cap 7.0, and a slide is also at least its last cue plus 0.5 s. Slide 1 3.0, slide 2 6.5, mirror line 5.0, proof row 4.0, loop 6.0. About 24.5 s plus transitions, near 26.

**Composition, stage (Petra).** Figure `height:clamp(220px,34dvh,340px)`, centre at 40 percent. Text top at 66 percent, centred, never touching the figure. 390 by 844: figure 195 to 482, text 557 to 665, Pause ring bottom 750. 375 by 667: figure 153 to 380, text from 440. At `max-height:480px` landscape: figure left third, text right, same order. Hairline: safe inset top + 8, 16 px side margins, five segments, 2 px high, 4 px gaps, done and current ink 85, ahead ink 40. Pause ring 44 px, lower left, 16 px from the edge, `stopPropagation` so it is not a stage tap. Hairline, Pause and Skip leave at the gate (the clock stopped, so they have nothing to say).

**The gate.** Figure scales to `clamp(120px,22dvh,200px)`, centre 26 percent, 520 ms. Prompt at figure bottom + 24. At 390: grid `repeat(3,1fr)`, 8 px gap, chip min 88 by 64 (112 by 64 at 358 wide), radius 10, border ink 40, icon ink 24 px, label ink. Grid bottom at least 24 px above the safe inset. Fits 667 tall (grid 323 to 603). At 320 wide or under, the stage under a fixed prompt may scroll. At 1600: chips are 56 px rings on an ellipse, radius `34vh`, centre 54 percent, labels outside the ring along the radius, prompt fixed at top 72 px. Land clockwise from twelve, 62 ms apart. Press: chip icon lands 320 ms, other eleven to ink 40, an 8 px seat dot shows on the pressed chip (a mark under 12 px), then travels into the figure, 420 ms `--ease-enter`, and lights that seat.

**Hue rule.** Seat hue only on marks of 12 px or less, or a radial glow of 12 percent or less, or the seat being named. One seat at a time on the film. No `filter`, no blur.

**Light.** One radial gradient, 70vmin, centre alpha 12 percent of the named seat, else ink at 6 percent.

**Motion** (all on existing tokens). Text in 420 ms `--ease-out`, 10 px rise (new `--t-stage-in:420ms`; if gate 12 refuses it, use shipped `--t-enter` 380, the 40 ms is invisible). Text out 220 ms `--ease-in`, opacity only, next line starts at 120 ms. Land 320 ms `--ease-land`. Transit from login: fields fade 220 ms, ring scales 1 to 1.5 and fades 420 ms (180 and 520 are not in gate 12). Breath 4.2 s only after the first reading. Nothing between 3 and 30 Hz. Reduced motion: 120 ms opacity fade, no rise, no draw.

**Wordmark.** Withdrawn from the film. It fades with the login fields. The upper left corner becomes the address ring from the gate on. A small drawn wordmark returns once, bottom centre, 13 px, accent, on the reading frame (see recommendation 3).

**Release screen.** Gift: a ring of 100 ticks, 48 px, 1 px ticks, ink 85 percent, one tick goes to ink 40 per line, 88 left at the end, next to the engine's number. Prompt hero as above. No typed digits.

**Distress frame.** Figure at 35 percent, still. Ink on stage, no ring, glow, hue, counter, sound. No alarm colour: it says "you are wrong".

**Exit.** Make the app root visible at exit start, Field at opacity 0, stage fades out 220 ms while the Field fades in 380 ms. In Snow lighting use 420 ms: a black to white step in 220 ms is a flash.

**Gates (add to `design.js`, run without `?dev=1`).** Text on stage at least 4.5 to 1 and marks at least 3 to 1, each against its own ground. Stage ground equals login ground. No element over 12 px carries a seat hue. Every control at least 44 px. Font sizes inside the six. Durations inside gate 12.

## 6. Ranked recommendations

1. **Stage tokens, hue rule, type scale (M, reskin).** Nils, Marta, Whitney, Camille.
2. **Gate layouts at 1600, 390, 375 by 667, 320 and landscape (M, redesign).** Whitney, Renata, Marta.
3. **A reading frame built to be screenshot, 390 by 844: figure, one line, one place, wordmark bottom (S, redesign).** Trey, Whitney.
4. **Twelve starting point ring icons in one family (M, redesign).** Nils, Sofia, Renata.
5. **Stage gates in `design.js` without `?dev=1` (S, reskin).** Nils, Camille.
6. **Controls: hairline, Pause ring, Skip, hold, thirds (S, reskin).** Marta, Renata, Whitney.
7. **Distress frame and the Snow exit fade (S, reskin).** Marta, Camille.
8. **Gift tick ring on the release (S, redesign).** Sofia, Renata.

## 7. One question

None.
