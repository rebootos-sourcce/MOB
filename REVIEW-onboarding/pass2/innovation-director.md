# Pass 2: innovation director (Rua Whitmore), round PJ

I read all eleven other pass 1 reports. A "gate" below means a screen where the clock stops and waits for the person. The "sniffer" is the code that reads a story for distress.

## 1. AGREEMENTS (strongest signals)

- **The first release is the onboarding, and the tutorial folds into what comes after it.** Me, game, UX, creative, systems, animation, narrative, marketing. Nobody defended the five card tutorial. Systems found why a stranger never reaches a release: `DEV_PLAY_TUTORIAL` is false.
- **The clock yields to the hand.** Creative, game, marketing, sales, TD, animation and I all say no timer on a decision or the story box.
- **Voice stays off the slider.** Animation, UX, game, creative, marketing, brand and I. Playing it twice in two minutes would spend it.
- **The press is the cost of word count.** Creative and UX counted it: 330 words, 12 or more taps. Cut words first, then add the timer.
- **Reduced motion keeps the timer and a visible pause ring.** Art, animation, TD, systems, game, UX, creative. Timing is reading, not movement.
- **The sniffer is a ship blocker.** Narrative measured it: "I do not want to be here anymore." reads as nothing, and "I am dying of embarrassment." reads Sad 8.8.

## 2. DISAGREEMENTS (I take a side on each)

- **Signal test before the release (art, UX, narrative, game) vs after (sales, marketing, creative).** I take after. His recording already covers feet and breath, so a throat test before it is two body exercises back to back (creative). Sales is right that the reading should come first as proof. Marketing is right that it must write something: `OB.felt` is thrown away today (creative, systems).
- **Hold-to-answer, my idea 5: I withdraw it.** TD found iOS turns a long press into text selection. Worse, hold already means pause everywhere else, so one screen where hold means "yes" is a mode clash. Three quiet ring chips are the default. The hold goes to an 8 person test and ships only if it wins.
- **Live "reading forms as you speak", my idea 3: conditional.** Sales measured "I keep taking care of everybody else." returns 0 hits, and so does the owner's own work example. A reveal that reads nothing in public is a defect with good press. It ships only with the floor in section 4.
- **Breath timing, my idea 4: corrected.** I wrote 4 s in, 6 s out from memory. His recording measures 2.3 s in and 3.35 s out, a 5.65 s period (animation). I use his.
- **"Same times, silent" for the voice cues, my idea 2: wrong.** Silent, that is 30 s of waiting on a reader. Silent, the opening collapses to one breath (section 4).
- **Progress mark.** Animation, marketing, UX want hairline segments. Art, brand, creative want a ring of arcs. I take hairline segments. Four arcs round the figure would read as the four station loop ring, and game wants that ring to light only when an act is done.
- **"It is okay" and "Nothing here grades you".** UX, animation, game keep them. Brand, narrative, marketing cut them. I cut both. A mirror gives no verdict before it has read anything, and denying a grade plants the idea of one (narrative, citing OB6).
- **Sample reading and the proof number (marketing, brand).** I hold my kill. A sample reading is someone else's body and failed in quiz apps. The proof is the person's own sentence reading live.
- **The word "avatar" on slide 3 (UX).** I side with brand. It is said once, at the first reading, when the figure has changed.
- **Total length.** 18 to 20 s (marketing, TD), 22.7 (brand), 24 (creative), 25 (game), 27.8 (animation), 70 (UX), 80 (narrative). I take about 23 s. The 70 and 80 s runs both contain the throat test.
- **Palette.** Art holds quieter canon colours, and the shipped `PAL` is louder. Hue is the language and does not move; this only lowers saturation. I side with canon, but animation's figure flies into the real Field, so the colours would jump at the handoff unless `PAL` changes in the same commit. Art and systems agree that first. If they cannot, ship `PAL` on the stage with no glow.

## 3. WHAT I MISSED

- **Gate 12 allows only 0.12, 0.22, 0.32 and 0.42 s durations** (TD). Animation, brand and creative proposed 380, 520, 600 ms.
- **A binaural beat near 6 Hz sits under his release audio** (animation). No visual may modulate at 3 to 30 Hz. My ticking gift counter must change no faster than twice a second.
- **The gift is not honoured in code** (sales). `planSees(null,'sab')` is false, so a new person cannot see the whole reading during the gift. My idea 3 needs that engine fix first.
- **Position is derivable** (systems). Store no step. `obAct(profile)` reads stored facts and returns open, ground, story, release, reading or done.
- **The tutorial's story spends real charge** (game), so a person writes twice. One story only.
- **Every phrase in `audio/atuned-opening-timing.json` is `confirmed:false`.** The boundaries come from silences and are reliable. The words come from an offline guess and are not. So his voice, as the clock, is safe. His voice, as captions, is not.
- **Distress also hits the "dimmed app" problem.** There is no permanent safety line by ruling, so the sniffer is the only guard and must pause the whole sequence.

## 4. THE PROPOSAL, TOGETHER

**One sentence:** the figure moves only when the person does something, and one breath is the clock.

**The slider (silent, about 23 s).** Opaque stage `--stage #06060a`, the login's own ground, so login to slider has no colour step. No card, no dimmed app, no dots. The boot figure continues at its closing pose, but its seats are outlined at 35% and Still, because Still means unread. A separate ring around it is the clock. It swells 2.3 s on `cubic-bezier(.37,0,.63,1)` and falls 3.35 s on the same curve, to scale 1.04. Slides change only at the end of the fall.

Four slides, each one breath, 5.65 s. The cut is a 0.22 s fade out, then 0.42 s in with an 8 px rise on `cubic-bezier(.22,1,.36,1)`.
1. "Welcome to a neurosomatic experience." Support at 1.5 s: "Neuro is nerves. Somatic is body."
2. "Awareness and intuition is a tool we use to turn your senses inward."
3. "There is more running you than you can see."
4. "Say one true thing. It shows where it sits in your body."

**Dwell formula, settled.** The breath replaces the four formulas. A gate in `design.js` refuses any slide where `1.0 + words / 2.8` exceeds 5.65, which means 13 words at most. Reduced motion: dwell 8.5 s, 0.22 s cross fade, ring static, pause ring visible.

**Controls.** Hold 180 ms or more pauses. A shorter tap on the right two thirds goes on, and the left third goes back. A visible 44 px pause ring and a quiet "Skip" top right. Skip lands on the gate, never the app. Page hidden pauses. At slide 1, Back does nothing. A `reasons` set holds why it paused: hold, hidden, focus, typing, user, sound, distress (systems). It runs inside the existing `loop` with `dt` clamped to 50 ms (TD).

**The gate.** Narrative's line: "Pick your starting point." The twelve sit on a ring (the `onb-01` mockup). Nothing times out. At 20 s idle the ring takes one quiet breath, once. Choosing one contracts the ring into the figure with that seat outlined brighter.

**The release opening is the voice.** Voice on: `audio.currentTime` is the clock, cues from the ten phrase starts, visuals leading by 150 ms. Voice off: one breath, "Feet on the floor.", then the stem. Rule: **no confirmed words, no Sound ring.** The owner listens once and confirms ten phrases, a task, not a question. Captions then equal his transcript, so voice and screen never say different words. The stem is the hero text. The picked starting point seeds the sentence, so no blank page.

**The reading floor (sales R2 plus narrative).** Run `parseStory` on the seed plus the person's words. If it is still empty, say "Not quite. Which part?" and never show an empty Mirror. Any distress hit stops the whole sequence: no sound, no counter, no offer.

**What the person sees.** The first deposit lands on a seat in seat hue on a 0.32 s single move (a Land, one movement, never a pulse), 62 ms apart across seats. The gift counter holds 100 for 4 s, then falls to 88 over the run, never faster than twice a second. The seats stay Still until the reading exists. After that the figure may breathe.

**After.** Animation's Reel B replaces the tutorial: landed, read, then "Keep this" and "Not now" at equal weight. The ticked box is on "Keep this" only (sales). The signal test becomes the first door on the first Field. The loop ring appears here, one quarter per act done, closing after the first release (game).

**Must be agreed before building.** Art and systems: the palette, `--stage`, the type scale 12, 16, 28, 40 (hero 40 at 1600, 28 at 390, weight 300). Animation: the 5.65 s breath as a named gate 12 edit. Narrative: the four lines and the distress frame, with a clinician signing. Systems: `obAct`, a `felt` field, the allowlisted account push. Sales and TD: the `planSight` fix. TD: iOS webm Opus test, Field paused while the stage is up.

## 5. REVISED GRADE

GRADE: 28/100 (was 36). Truth to the instrument falls from 6 to 5, because the signal answer changes only a paragraph (creative, systems). Honest about the person's state falls from 5 to 2, because narrative measured nothing detecting distress. The other four stay: novelty 2, teaches by doing 3, our own assets 2, phone 3. My predicted grade for the proposal falls from 78 to 70. Ideas 4 and 5 are cut or cut down, and idea 3 now depends on the reading floor.

## 6. TOP 5 RECOMMENDATIONS

1. **The first release is the onboarding (L).** Slider, gate, voiced opening, stem, 12 line run, reading. The tutorial becomes the aftercare. Moves Whitney, Renata, Toby, Marta.
2. **Sniffer plus reading floor before any live reveal (L, ship blocker).** Moves Marta, Nils, Camille.
3. **One clock: a 5.65 s breath, four slides, about 23 s, gates that never time out (M).** Moves Marta, Ezra, Whitney.
4. **Voice on the release opening only, shipped only when the ten phrases are confirmed (M).** Moves Marta, Camille, Nils.
5. **Signal test after the reading, as chips that write `felt`; test the hold on 8 people first (S).** Moves Nils, Whitney.

## 7. QUESTION FOR THE OWNER

None. I decide that the voice waits on confirmation and the throat test follows the reading. Reason: his ruling is that the release opens on his voice, and a caption that differs from his words would be a false reading.

**Crude test I will build for pass 3:** one HTML in `mockups/`, four slides on the breath clock, a gate, and a text box running the real `parseStory` on the owner's work sentence, to see how often it reads zero.
