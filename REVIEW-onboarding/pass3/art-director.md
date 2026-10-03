# Pass 3, art director (round PJ)

Mika, with Sol (colour), Bjorn (type), Petra (composition, symbol). I read PROPOSAL.md and the pass 2 reports, and measured against `head.html` tokens.

## 1. The proposal as I understand it

One black room, one figure, one clock: login, a silent 26 second film, one decision (twelve starting points), one sentence read back, a 12 line release, then the figure arcs into the Field. The merge lost three things. The gate chip's colour is left open (Creative says ink, I said seat hue). My wordmark now collides with the release's address ring, upper left. And Brand's "ink at 35 percent clears 3 to 1" is wrong: Sol measured 2.81 on `#06060A`. At 40 percent it is 3.33. Use 40.

## 2. The ICP room (judged on form, light, type, symbol)

- **Marcus, founder, level 7.** Sees the boot figure holding still on black, then one line. Lets it run. Stays: it is his thing, quieter. "Good. Where does my avatar live?"
- **Whitney, phone only, esoteric native.** Sees black, a figure, a 2 px hairline. Holds to pause, screenshots slide 2. Reads the loop circle as a chart. Stays, but the twelve plain ink chips give her nothing to post. "Where is the one I post?"
- **Nils, design skeptic, level 4.** Squints: figure, line, nothing. Right order. Then he finds two gate layouts and checks the type is on six sizes. Leaves at one stray hue. "One face, one black. Show me the edge case."
- **Camille, somatic practitioner, level 6.** Sees stillness. The figure breathes only after a reading, which she approves. She checks the distress frame and wants it plain. "Do not make it pretty at the wrong moment."
- **Marta, 02:00, acute distress.** Sees a dark screen, thin text. Dim black is right. She leaves if anything moves while she reads, so the Pause ring must be visible from frame one. "Please stop moving."
- **Renata, operator, level 7, main target.** Reads a clock: five hairline segments, 26 seconds. Taps right twice, reaches the gate in six seconds. Stays for the proof row, a real engine number. "That is a spec sheet. Good."
- **Trey, quiz tourist.** Taps through, picks the first chip, types four words. At the reading he looks for a card to post. Leaves at Keep this. "Where is my result image?"
- **Sofia, loves the open tables.** Sees "112 addresses" and wants to tap it. Stays through the film for it. "Open that row." It should open the table after onboarding, never during.

## 3. Unified quality: 72/100

The grammar is nearly one: one ground, one scale, one stroke, one motion set. Three gaps.

1. **The gate is numbers, not layouts.** The ring (1600) and grid (390) are not drawn for 320 wide, 667 tall, landscape phone, or the story screen with the keyboard up. Section 5 draws them.
2. **Twelve starting point icons do not exist.** House rule: if it has a name it has an icon. Petra: one ring family, 24 px grid, 1.6 stroke, round caps, no fill, ink (a starting point is not a body place, so no seat hue).
3. **No gate watches the stage.** `design.js` runs with `?dev=1`, so it never sees login or the stage.

## 4. FINAL GRADE

GRADE: 74/100 (pass 1 was 38, pass 2 was 38)

This grades the proposal on paper. The shipped build stays 38 until built. Up 36: card, dots and wash gone (Bjorn, Sol); one ground; hue only on small marks; contrast fixed by number (Sol); one squint order (Petra). Held below 80 by the three gaps.

## 5. My part of the build spec

**Tokens.** `--stage:#06060A`, opaque, identical in all four lightings and identical to the login ground (a one pixel step shows as a seam). Ink `#EFEDE8` 17.3 to 1, mid `#B4B0A8` 9.4, dim `#94908A` 6.4. Ink at 40 percent (3.33) for ahead marks, unlit seats and unchosen chips. Never ink 22 percent (1.76) on anything meant to be seen. Seats are shipped `PAL` (5.1 to 10.8 to 1 on stage). Alarm never on the stage.

**Type.** Sizes 11, 13, 16, 20, 28, 44 only. Hero 44/52 weight 300 at 1600, 28/36 weight 400 at 390 (a 28 px stroke at weight 300 is about 2 px and shimmers). If 300 shimmers on a 1x screen, use 400. Measure 17em, `text-wrap:balance`. Gate prompt 20/28 mid. Chip label 16/20, two lines. Skip 16, ink 60 percent (6.4), 44 px target. Slide 2 has 13 words, over the 12 word gate: whitelist it beside slide 1.

**Dwell.** I yield to the lead: `max(3.0, 1.0 + words/2.5)`, up to 0.5, cap 7.0, never under the last cue plus 0.5 s. Slides: 3.0, 6.5, 5.0, 4.0, 6.0, about 24.5 s plus fades.

**Stage composition.** Figure `clamp(220px,34dvh,340px)`, centre at 40 percent; text top at 66 percent, never touching it. At 390 by 844: figure 195 to 482, text 557 to 665, Pause 750. At 375 by 667: figure 153 to 380, text from 440. At `max-height:480px`: figure left, text right. Hairline at safe inset top + 8, 16 px margins, five segments, 2 px, 4 px gaps, done and current ink 85, ahead ink 40. Pause ring 44 px lower left, 16 px in, `stopPropagation`. Hairline, Pause and the clock leave at the gate.

**The gate.** Figure shrinks to `clamp(120px,22dvh,200px)`, centre 26 percent, 520 ms. Prompt 24 px under it. At 390: `repeat(3,1fr)`, 8 px gap, chips min 88 by 64, radius 10, border ink 40, icon ink, grid bottom 24 px above the safe inset (fits 667 tall: grid 323 to 603). At 320 wide the stage under a fixed prompt may scroll. At 1600: 56 px ring chips on an ellipse, radius `34vh`, centre 54 percent, labels outside along the radius, prompt fixed top at 72 px. Land clockwise from twelve, 62 ms apart. On press: icon lands 320 ms, the other eleven go to ink 40, an 8 px seat dot shows on the pressed chip, then it travels into the figure (420 ms `--ease-enter`) and lights the seat.

**Hue and light.** Seat hue only on marks of 12 px or less, a radial glow of 12 percent or less, or the one seat named. Light is one radial gradient, 70vmin, no `filter`.

**Motion.** Text in 420 ms `--ease-out`, 10 px rise (new `--t-stage-in`; if gate 12 refuses it, shipped `--t-enter` 380 is invisibly different). Text out 220 ms `--ease-in`, opacity only, next starts at 120 ms. Land 320 ms `--ease-land`. Transit: fields fade 220 ms, ring scales 1 to 1.5 and fades 420 ms (180 and 520 are not in gate 12). Breath 4.2 s after the first reading only. Reduced motion: 120 ms fade, no rise.

**Wordmark.** Fades with the login fields. The upper left then belongs to the address ring. It returns once, bottom centre, 13 px, accent, on the reading frame.

**Release.** Gift as a ring of 100 ticks, 48 px, 1 px ticks, one tick drops to ink 40 per line, 88 left, beside the engine's number.

**Distress frame.** Figure at 35 percent, still, ink on stage, no ring, glow, hue, counter or sound. No alarm colour: aimed at a person it says they are wrong.

**Exit.** Make the app root visible at exit start with the Field at opacity 0. Stage out 220 ms, Field in 380 ms. In Snow use 420 ms: black to white in 220 ms is a flash.

**Gates (`design.js`, without `?dev=1`).** Text at least 4.5 to 1 and marks 3 to 1, each against its own ground. Stage ground equals login ground. No element over 12 px has seat hue. Controls at least 44 px. Sizes inside the six. Durations inside gate 12.

## 6. Ranked recommendations

1. **Stage tokens, hue rule, type scale (M, reskin).** Nils, Marta, Whitney, Camille.
2. **Gate drawn at 1600, 390, 375 by 667, 320, landscape (M, redesign).** Whitney, Renata, Marta.
3. **A reading frame made to screenshot at 390 by 844: figure, one line, one place, wordmark (S, redesign).** Trey, Whitney.
4. **Twelve starting point ring icons, one family (M, redesign).** Nils, Sofia, Renata.
5. **Stage gates in `design.js` (S, reskin).** Nils, Camille.
6. **Controls: hairline, Pause, Skip, hold, thirds (S, reskin).** Marta, Renata, Whitney.
7. **Distress frame, Snow exit fade (S, reskin).** Marta, Camille.
8. **Gift tick ring (S, redesign).** Sofia, Renata.

## 7. One question

None.
