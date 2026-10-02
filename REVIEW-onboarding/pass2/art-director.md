# Pass 2, art director: the onboarding and tutorial (round PJ)

Mika, with Sol (colour, light), Bjorn (type, grid), Petra (composition, symbol). I read all eleven other pass 1 reports, the stage mockups `onb-01-start-*.png` and `release-redesign/frames/open-2s-d.png`, and re-checked three of my own pass 1 claims against source. Two of them were wrong. They are in section 3.

## 1. AGREEMENTS

- **Full bleed black stage, no card, no dimmed app.** All twelve seats, including mine. Strongest signal in the round.
- **The boot figure stays on screen as the one actor.** Kai, Brand, Creative, Petra, me. One object, never rebuilt between slides. The figure is the avatar before the person has the word.
- **No dots.** Kai, Brand, Marketing, UI UX, Systems, me. Dots fail on contrast (my measure: 1.55 to 1) and carry no time.
- **Hold pauses, right two thirds goes on, left third goes back, a quiet Skip, and a visible pause button.** Eight seats. The visible button is not optional: a timer over five seconds needs one (Creative, Game, Technical, UI UX).
- **The clock never advances through a decision or the story box.** Game, Creative, Marketing, Sales, Kai, me.
- **Voice only on the release opening.** Kai, Brand, Marketing, UI UX, Game, Creative, Technical, me. The slider is silent.
- **"It is okay" and "making us sick" go.** Brand, Marketing, Narrative, me.
- **One type scale and sentence case.** Systems, Narrative, UI UX, me.
- **Distress detection is a ship blocker.** Narrative, Innovation, Creative, Systems, Game.

## 2. DISAGREEMENTS, AND WHERE I LAND

1. **Length before the first decision (22, 28 or 70 s).** I take 26 s, five slides. The 70 s (UI UX) is the signal test sitting inside the slider. I move the test out, so the 70 goes with it.
2. **Dwell formula.** For a 12 word slide the four candidates give 5.15, 5.4, 5.8 and 5.8 s. A 0.7 s spread is not worth an argument. I take `dwell = max(3.0, 1.4 + words / 3.0)` seconds, cap 7.0, because the 380 ms entrance sits inside it. Reduced motion multiplies by 1.5.
3. **Voice.** Release opening only. Every phrase in the timing file is `confirmed:false`, so no spoken word is drawn on screen until he confirms it. The screen shows his ruled lines. Kai's lead of 150 ms, visual first, is right.
4. **Signal test.** After the first reading, in Reel B (Kai's name for the after-release sequence). The release opens with feet on the floor and breathing, so a test before it is two body exercises in a row (Creative). Its mechanic is three ring chips, Yes, No, Nothing, with no Next. I cut the hold-to-answer idea (Innovation): hold already means pause everywhere, and one gesture cannot mean both.
5. **Tutorial.** Folds into Reel B, same stage. The five card typed tutorial is deleted and survives only as a replay from the profile (Narrative, Game, UI UX, Kai).
6. **Seat palette.** I reverse myself. See section 3.
7. **First line.** The ruled line opens, as the brief says. His "There is more running you than you can see" becomes slide 3. Nothing is lost and nothing is argued.
8. **Progress mark.** Hairline segments. I reverse my ring. See section 3.
9. **Login A first.** Fixed ruling. The stage uses the login's ground so the two screens are one room.
10. **Account fields.** After the first reading. Fields as underlines, 16 px type (below 16 px iOS zooms the page on focus). The ticked box is a ring with a tick, unticked by default, one row. "Keep this" and "Not now" are the same size and the same stroke. Only the stroke colour differs: accent on Keep this, ink at 60 percent on Not now.
11. **The one decision.** Twelve starting points. At 1600 they sit on a ring around the figure. At 390 they become a 3 by 4 grid of ring chips, 112 by 64. UI UX counts 14 controls and accepts it. I accept it too: they are one pick among recognisable words. This is the one place the stage breaks its single centre axis.
12. **The 12 line mini release.** The figure shrinks into the small address ring upper left (a shared element move, one object travelling from one place to another rather than one fading and another appearing). Then it is black, the prompt as 44 px hero text, stats upper right. The gift is a ring of 100 ticks, the login's tick language, with the number beside it. It reads 88 at the end. The release mock types letter by letter. That is Kai's 6 Hz hazard. Reveal by line.
13. **Controls (Petra against UI UX).** UI UX wants a visible Next. I do not. A visible Next rebuilds the button he rejected. Right tap and the right arrow key do it. Visible controls are Pause and Back, two 44 px rings along the bottom, and Skip upper right. No Sound ring on the slider, since it is silent.
14. **Reduced motion (Kai against five seats).** Kai wants hard cuts. I take a 200 ms opacity fade, no rise, no draw, no sweep. An opacity change on text is not vestibular motion, and a hard cut is a flash.
15. **The word avatar.** Brand is right: not before the first reading. The figure is there from frame one. Reel B beat 1 names it.

## 3. WHAT I MISSED

- **Palette, my error.** Pass 1 called the shipped seat colours wrong and chose the quieter canon. `canon.js` lines 250 to 258 record an owner ruling: "punch the dull ones up about ten percent, on the dark version." Three seats were raised on purpose. Shipped `PAL` stands. I protect calm another way: seat hues are small marks (12 px or less) or a glow at 12 percent or less.
- **A new defect from that check.** A seat dimmed to 50 percent alpha on black measures Root 1.98, 3rd Eye 2.43, Crown 2.33 to 1. All under the 3 to 1 floor for UI parts. Rule: an unlit seat is ink at 40 percent (3.33 to 1), never its own hue faded.
- **Progress ring, my error.** Petra: a symbol is a sentence, and I gave one ring three jobs (timer, halo, loop). Hairline at the top is time. The halo around the figure is the person. The thin large circle is the loop. A small 44 px ring is a thing you can touch. Ring size says what kind of thing it is.
- **Type sizes, my error.** My 52, 30, 18 and 12 break the six sizes I proposed in the skin round (11, 13, 16, 20, 28, 44). Bjorn corrects me. Narrative's 22 and 32 also sit off the scale.
- **Ground.** Systems found two near blacks and `--hot` defined nowhere. I had a third, `#0C0D12`. One token now.
- **Light cost.** Technical: a 130 percent blurred layer is about 20 MB of texture on a phone, and Kai: it has no job. My "60 px blur" glow goes. A plain radial gradient does it.
- **The mark.** Brand: I forgot the drawn sky blue wordmark. It sits top left.
- **Release mock.** Its hero line is about 24 px and left aligned. Same hero size as the slider, centred on the figure's axis.

## 4. THE PROPOSAL, TOGETHER (my part: tokens, symbols, composition)

**Tokens.** All new classes `.sl-`. Systems owns the names.
- `--stage #06060A`, fixed in all four lightings. It is a room, not a surface. Ink `#EFEDE8` (17.3 to 1), mid `#B4B0A8` (9.4), dim `#94908A` (6.4). Seat hues are shipped `PAL`. Accent is the `--accent` token, which follows whatever the skin round settles. Never hard code `#7EB8D4`. Alarm is never on the stage. A distress frame uses ink only, because the alarm colour aimed at a person says they are wrong.
- Type, Inter, `--fs-1..6` = 11, 13, 16, 20, 28, 44. Weights 300 (44 only) and 400. Hero 44/52 at 1600, 28/36 at 390. Support 16/24 in mid. Chrome 13/20. No eyebrows. Hero measure 17em at 1600 (two lines), full width less 16 px gutters at 390 (three lines), `text-wrap:balance`, 12 words maximum.
- Radii 4, 10, 16, 999. Stroke 1.6, round caps. Rings, not fills.
- Motion uses existing tokens only. Text in: `--t-enter` 380 ms, `--ease-out`, 10 px rise. Text out: `--t-element` 220 ms, `--ease-in`, opacity only, incoming starts at 120 ms. Land: `--ease-land`. Breath: `--t-breath` 4.2 s. Nothing may modulate between 3 and 30 Hz.

**Composition, 1600 by 1000 and 390 by 844.** Figure `height:clamp(220px,34dvh,340px)`, centre at 40 percent of the height. Text starts at 66 percent. Text never overlaps the figure. Squint order: figure, line, nothing. Top edge: hairline at the safe area inset (the strip a phone notch eats) plus 8 px, five segments, 2 px high, 4 px gaps. Current fills linear at ink 85 percent, done 85, ahead 40 (3.33 to 1). It fades out at the gate because the clock has stopped. Wordmark top left, 22 px. Skip top right, 13 px, ink at 60 percent (6.4 to 1), 44 px target. Bottom: Back and Pause rings, 44 px, 16 px apart, centred. Back is disabled on slide 1, not hidden, so Pause does not jump. Whole stage is the hold zone: `user-select:none`, `-webkit-touch-callout:none`.

**Light.** One radial gradient, 70vmin, centre alpha 12 percent, no filter, opacity changes over 380 ms. It takes the colour of a seat only when the slide is about that seat. Otherwise ink at 6 percent. Colour appears only where it means place.

**Sequence, 26.3 s, silent.** Copy is Narrative's to finalise.

| # | Line | Dwell | Picture |
|---|---|---|---|
| 1 | "Welcome to a neurosomatic experience." Support: "Neuro is nerves. Somatic is body." | 5.4 | Seven seats light root to crown, 90 ms apart. Halo closes. |
| 2 | "Awareness and intuition is a tool we use to turn your senses inward." | 5.4 | Inward marks, once. |
| 3 | "There is more running you than you can see." | 4.4 | Figure still. Glow ink. |
| 4 | "Write one true thing. See where it sits in your body." | 5.1 | Throat lights. Glow in Throat. |
| 5 | "Discover. Play. Flow. Embody. Then again." | 6.0 | Loop circle, 1 px, ink. Four stations, 1.1 s each, closes at 12. |
| gate | "Pick your starting point." | none | The loop circle stays as the outer ring. Twelve chips land clockwise, 62 ms apart. The figure breathes. |

At the gate each chip is a 56 px ring. Its icon stroke takes the seat it opens onto, and the label is ink. Border ink at 40 percent. A pick lands the icon (260 ms), drops the other eleven to ink 22 percent, then the chip travels into the figure and lights that seat (420 ms, `--ease-enter`). Needs a `seat` key on each row of Systems' `GROUNDS` table.

**Reel B, after the reading.** Seats that moved fall. Before and after shown as two solid rings, the old at ink 35 percent, the new in the seat hue (dashed means not measured, so not dashed). The word "avatar" is spoken here, once. Then the signal test as ten ticks lighting 1.2 s apart (0.83 Hz) and three chips. Then Keep this.

**Distress frame.** Figure at 35 percent, still, no glow, no breath, no sound, no alarm hue, no timer.

**Agree first.** Type scale with Narrative and UI UX. Token names and the `GROUNDS.seat` key with Systems. Curves and the flicker rule with Kai. Where the distress frame is triggered with Narrative and Systems.

## 5. REVISED GRADE

GRADE: 38/100 (was 38). One up, one down. Pacing and motion 3 to 4: Kai shows the boot is the best motion in the product and reduced motion already works. Type 5 to 4: Systems counts 11 sizes and a missing rule. Projected for this proposal built, at 390 and 1600: about 76. It is capped by the 14 control gate at 390 and by the unconfirmed voice.

## 6. TOP 5 RECOMMENDATIONS

1. **The stage and its tokens: `--stage`, six sizes, ring ledger (M).** Phone only (Whitney), skeptic (Nils), practitioner (Camille).
2. **The boot figure as the one actor, with one gradient glow and no blur (M).** Nils, Marta (acute distress at 02:00), Whitney.
3. **Controls: hairline progress, hold, thirds, Pause and Back rings, Skip upper right (S).** Marta, Whitney, Renata (primary buyer, level 7).
4. **The gate: twelve ring chips, travel into the figure, shrink to the address ring (M).** Whitney, Marta, Renata.
5. **Unlit seat rule, distress frame look, no alarm colour on a person (S).** Marta, Camille.

## 7. ONE QUESTION

None. Decision: shipped `PAL` stands, the stage is black in every lighting, and Next is not drawn. Reason: the first is his ruling, the second keeps the login and release in one room, the third keeps the button he rejected off the screen.
