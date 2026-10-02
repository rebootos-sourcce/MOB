# Pass 2, art director: the onboarding and tutorial (round PJ)

Mika, with Sol (colour, light), Bjorn (type, grid), Petra (composition, symbol). I read the eleven other pass 1 reports, the stage mockups and a release frame, and re-checked three of my own claims against source. Two were wrong (section 3).

## 1. AGREEMENTS

- **Full bleed black stage, no card, no dimmed app.** All twelve seats.
- **The boot figure stays as the one actor.** Kai, Brand, Creative, Petra, me.
- **No dots.** Kai, Brand, Marketing, UI UX, Systems, me (1.55 to 1 on contrast).
- **Hold pauses, thirds navigate, quiet Skip, visible pause button.** Eight seats. Moving content over five seconds needs a visible pause (Creative, Game, Technical, UI UX).
- **The clock never runs through a decision or the story box.** Six seats.
- **Voice only on the release opening.** Eight seats.
- **"It is okay" and "making us sick" go.** Brand, Marketing, Narrative, me.
- **Distress detection blocks the first story.** Five seats.

## 2. DISAGREEMENTS, AND WHERE I LAND

1. **Length (22, 28, 70 s).** 26 s, five slides. UI UX's 70 s is the signal test inside the slider. I move the test out.
2. **Dwell.** The four formulas differ by 0.65 s on a 12 word slide. I take `max(3.0, 1.4 + words / 3.0)` s, cap 7.0. Reduced motion times 1.5.
3. **Voice.** Release opening only. Every phrase is `confirmed:false`, so no spoken word is drawn until he confirms it.
4. **Signal test.** After the first reading, in Reel B (Kai's name for the after-release sequence). The release opens with feet and breathing, so a test first is two body exercises in a row (Creative). Three ring chips, no Next. I cut hold-to-answer (Innovation): hold already means pause.
5. **Tutorial.** Folds into Reel B. The typed five card version survives as a profile replay.
6. **Seat palette.** I reverse. Section 3.
7. **First line.** The ruled line opens. "There is more running you than you can see" is slide 3.
8. **Progress mark.** Hairline segments. I reverse my ring.
9. **Login A first.** Fixed. Same ground as the stage, so one room.
10. **Account fields.** After the first reading. Underline fields at 16 px (below that iOS zooms on focus). Ticked box: a ring with a tick, unticked. "Keep this" and "Not now" share size and stroke, differing only in colour: accent against ink at 60 percent.
11. **The one decision.** Twelve starting points: a ring around the figure at 1600, a 3 by 4 grid of ring chips at 390 (112 by 64). UI UX counts 14 controls and accepts it; so do I. It is the one place the stage leaves its centre axis.
12. **Mini release.** The figure shrinks into the address ring upper left. Prompt as 44 px hero, stats upper right. The gift is a ring of 100 ticks (the login's tick language) beside its number, 88 at the end. The release mock types by letter, Kai's 6 Hz hazard. Reveal by line.
13. **Visible Next (UI UX).** No. It rebuilds the button he rejected. Right tap and the arrow key serve it. Drawn: Pause and Back rings, Skip. No Sound ring on a silent slider.
14. **Reduced motion (Kai wants hard cuts).** I take a 200 ms opacity fade, no rise or draw. A hard cut is a flash.
15. **The word avatar.** Not before the first reading (Brand). The figure is there from frame one.

## 3. WHAT I MISSED

- **Palette, my error.** `canon.js` lines 250 to 258 record an owner ruling: "punch the dull ones up about ten percent, on the dark version." Shipped `PAL` stands. I protect calm another way: seat hues only as marks of 12 px or less, or as a glow of 12 percent or less.
- **A new defect from that check.** A seat at 50 percent alpha on black measures Root 1.98, Crown 2.33, 3rd Eye 2.43 to 1. All under the 3 to 1 floor. Rule: an unlit seat is ink at 40 percent (3.33 to 1), never its own hue faded.
- **Progress ring, my error.** Petra: a symbol is a sentence, and I gave one ring three jobs. Hairline is time, halo is the person, the thin large circle is the loop, a 44 px ring is a thing you touch.
- **Type, my error.** My 52, 30, 18, 12 break the scale I proposed in the skin round. Narrative's 22 and 32 are off it too.
- **Ground and light.** Systems found two near blacks and I added a third: one token now. Technical: a blurred oversize layer is about 20 MB of texture on a phone, so my blur goes.
- **The mark.** Brand: I forgot the drawn wordmark. Top left.

## 4. THE PROPOSAL (my part: tokens, symbols, composition)

**Tokens.** New classes `.sl-`. Systems owns the names.
- `--stage #06060A`, the same in all four lightings (a room, not a surface). Ink `#EFEDE8` 17.3 to 1, mid `#B4B0A8` 9.4, dim `#94908A` 6.4. Seats are shipped `PAL`. Accent is the `--accent` token, never a typed hex. Alarm never appears on the stage.
- Inter, `--fs-1..6` = 11, 13, 16, 20, 28, 44. Weights 400, and 300 on the 44. Hero 44/52 at 1600, 28/36 at 390, 12 words maximum, `text-wrap:balance`, measure 17em at 1600 (two lines), three lines at 390. Support 16/24 mid. Chrome 13/20. No eyebrows.
- Radii 4, 10, 16, 999. Stroke 1.6, round caps.
- Motion on existing tokens only. Text in: `--t-enter` 380 ms, `--ease-out`, 10 px rise. Text out: `--t-element` 220 ms, `--ease-in`, opacity only, the next line starts at 120 ms. Land: `--ease-land`. Breath: `--t-breath` 4.2 s. Nothing modulates between 3 and 30 Hz.

**Composition.** Figure `height:clamp(220px,34dvh,340px)`, centred at 40 percent of height. Text starts at 66 percent, never touching the figure. Squint order: figure, line, nothing. Top: hairline at the safe area inset (the strip a notch eats) plus 8 px, five segments, 2 px high, 4 px gaps, done and current ink 85 percent, ahead 40. It fades out at the gate, since the clock stopped. Wordmark top left, 22 px. Skip top right, 13 px, ink 60 percent, 44 px target. Bottom: Back and Pause rings, 44 px, 16 px apart. Back is disabled, not hidden, on slide 1. The whole stage is the hold zone (`user-select:none`, `-webkit-touch-callout:none`).

**Light.** One radial gradient, 70vmin, centre alpha 12 percent, no filter. A seat's colour only when the slide is about that seat, else ink at 6 percent.

**Sequence, 26.3 s, silent.** Narrative finalises the words.

| # | Line | s | Picture |
|---|---|---|---|
| 1 | "Welcome to a neurosomatic experience." Support: "Neuro is nerves. Somatic is body." | 5.4 | Seats light root to crown, 90 ms apart. Halo closes. |
| 2 | "Awareness and intuition is a tool we use to turn your senses inward." | 5.4 | Inward marks, once. |
| 3 | "There is more running you than you can see." | 4.4 | Figure still. |
| 4 | "Write one true thing. See where it sits in your body." | 5.1 | Throat lights, glow in Throat. |
| 5 | "Discover. Play. Flow. Embody. Then again." | 6.0 | Loop circle, 1 px ink. Four stations 1.1 s each, closes at twelve. |
| gate | "Pick your starting point." | none | Loop stays as the outer ring. Twelve chips land clockwise, 62 ms apart. Figure breathes. |

**The gate chip.** 56 px ring, icon stroke in the seat it opens onto (a `seat` key per row of Systems' `GROUNDS`), label ink, border ink 40 percent. A pick lands the icon (260 ms), drops the other eleven to ink 22 percent, then travels into the figure and lights that seat (420 ms, `--ease-enter`).

**Reel B.** Seats that moved fall. Old ring ink 35 percent, new ring in the seat hue, both solid (dashed means not measured). "Avatar" is named here, once. Then the signal test: ten ticks 1.2 s apart, three chips. Then Keep this.

**Distress frame.** Figure at 35 percent, still. No glow, breath, sound, timer or alarm hue: that colour aimed at a person says they are wrong.

**Agree first.** Scale with Narrative and UI UX. Names and `GROUNDS.seat` with Systems. Curves with Kai. Distress trigger with Narrative and Systems.

## 5. REVISED GRADE

GRADE: 38/100 (was 38). One up, one down. Motion 3 to 4: Kai shows the boot is the best motion in the product and reduced motion already works. Type 5 to 4: Systems counts 11 sizes and one missing rule. Built, this proposal projects to about 76.

## 6. TOP 5 RECOMMENDATIONS

1. **The stage and its tokens (M).** Phone only (Whitney), skeptic (Nils), practitioner (Camille).
2. **The boot figure as the one actor, one gradient glow, no blur (M).** Nils, Marta (acute, 02:00), Whitney.
3. **Controls: hairline, hold, thirds, Pause and Back, Skip (S).** Marta, Whitney, Renata (primary buyer).
4. **The gate: twelve chips, travel into the figure, shrink to the address ring (M).** Whitney, Marta, Renata.
5. **Unlit seat rule, distress frame, no alarm colour on a person (S).** Marta, Camille.

## 7. ONE QUESTION

None. Decisions: shipped `PAL` stands, the stage is black in every lighting, Next is not drawn. Reasons: his ruling, one room from login to release, and the rejected button stays off screen.
