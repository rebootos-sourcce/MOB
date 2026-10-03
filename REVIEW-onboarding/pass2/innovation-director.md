# Pass 2: innovation director (Rua Whitmore), round PJ

I read all eleven other pass 1 reports. A "gate" is a screen where the clock stops. The "sniffer" reads a story for distress.

## 1. AGREEMENTS

- **The first release is the onboarding; the tutorial folds into what follows it.** Me, game, UX, creative, systems, animation, narrative, marketing. Systems found why a stranger never reaches one: `DEV_PLAY_TUTORIAL` is false.
- **The clock yields to the hand.** No timer on a decision or the story box. Creative, game, marketing, sales, TD, animation, me.
- **Voice stays off the slider.** Animation, UX, game, creative, marketing, brand, me.
- **Reduced motion keeps the timer plus a visible pause ring.** Art, animation, TD, systems, game, UX, creative.
- **The sniffer is a ship blocker.** Narrative measured it: "I do not want to be here anymore." reads as nothing; "I am dying of embarrassment." reads Sad 8.8.

## 2. DISAGREEMENTS (my side, and why)

- **Signal test: after the reading.** Art, UX, narrative, game put it before; sales, marketing, creative after. His recording already covers feet and breath, so a throat test first is two body exercises back to back (creative). It must also write something: `OB.felt` is thrown away today (creative, systems).
- **My hold-to-answer idea: withdrawn.** TD found iOS turns long press into text selection, and hold already means pause everywhere else. Three quiet ring chips are the default; the hold goes to an 8 person test.
- **My live reading idea: conditional.** Sales measured "I keep taking care of everybody else." returning 0 hits. A reveal that reads nothing, in public, is a defect with good press. It ships with the floor in section 4.
- **My breath was wrong.** I wrote 4 s in, 6 s out. His recording measures 2.3 s in, 3.35 s out, a 5.65 s period (animation). I use his.
- **My "same times, silent" was wrong.** Silent, it is 30 s of waiting.
- **Progress mark: hairline segments** (animation, marketing, UX) over a ring of arcs (art, brand, creative). Four arcs would read as the four station loop ring, which game wants lit only by acts done.
- **"It is okay" and "Nothing here grades you": cut.** UX, animation, game keep them; brand, narrative, marketing cut. A mirror gives no verdict before it has read, and denying a grade plants the idea of one (narrative).
- **Sample reading (marketing): I hold my kill.** A sample is someone else's body.
- **"Avatar" on slide 3 (UX): brand wins.** Say it once, at the first reading, when the figure has changed.
- **Length.** 18 to 28 s (marketing, TD, brand, creative, game, animation), 70 (UX), 80 (narrative). I take about 23 s. The long two contain the throat test.
- **Palette.** I side with art's quieter canon (hue stays, saturation drops), but animation flies the figure into the real Field, so colours jump unless `PAL` changes in the same commit. If that cannot be agreed, ship `PAL` on the stage with no glow.

## 3. WHAT I MISSED

- **Gate 12 allows only 0.12, 0.22, 0.32, 0.42 s** (TD). Animation, brand, creative proposed 380, 520, 600 ms.
- **A binaural beat near 6 Hz sits under his audio** (animation). No visual may modulate at 3 to 30 Hz, so the gift counter changes at most twice a second.
- **The gift is not honoured in code** (sales): `planSees(null,'sab')` is false, so a new person cannot see the whole reading. My live reading needs that engine fix first.
- **Position is derivable** (systems). Store no step. `obAct(profile)` returns open, ground, story, release, reading or done.
- **All ten phrases in `atuned-opening-timing.json` are `confirmed:false`.** Boundaries come from silences and are reliable; words come from an offline guess. So his voice is safe as a clock and unsafe as captions.

## 4. THE PROPOSAL, TOGETHER

**One sentence:** the figure moves only when the person does something, and one breath is the clock.

**Slider, silent, about 23 s.** Opaque stage `--stage #06060a` (the login's ground). No card, no dimmed app, no dots. The boot figure continues at its closing pose, seats outlined at 35% and Still, because Still means unread. A separate ring around it is the clock: swell 2.3 s, fall 3.35 s, both `cubic-bezier(.37,0,.63,1)`, to scale 1.04. Slides change only at the end of the fall.

Four slides, one breath each, 5.65 s. Out: 0.22 s fade. In: 0.42 s with an 8 px rise, `cubic-bezier(.22,1,.36,1)`.
1. "Welcome to a neurosomatic experience." Support at 1.5 s: "Neuro is nerves. Somatic is body."
2. "Awareness and intuition is a tool we use to turn your senses inward."
3. "There is more running you than you can see."
4. "Say one true thing. It shows where it sits in your body."

**Dwell formula, settled.** The breath replaces the four formulas. A `design.js` gate refuses any slide where `1.0 + words / 2.8` exceeds 5.65, so 13 words at most. Reduced motion: dwell 8.5 s, 0.22 s cross fade, ring static.

**Controls.** Hold 180 ms pauses. Tap: right two thirds on, left third back. A visible 44 px pause ring. Quiet "Skip" top right, landing on the gate, never the app. A `reasons` set records why (hold, hidden, focus, typing, user, sound, distress), so the sniffer can stop the clock (systems). It runs in the existing `loop`, `dt` clamped to 50 ms (TD).

**Gate.** Narrative's line: "Pick your starting point." Twelve on a ring (the `onb-01` mockup). No timeout. After 20 s idle the ring takes one quiet breath, once. A choice contracts the ring into the figure.

**Release opening is the voice.** Voice on: `audio.currentTime` is the clock, cues from the phrase starts, visuals leading 150 ms. Voice off: one breath, "Feet on the floor.", then the stem. **No confirmed words, no Sound ring.** The owner confirms ten phrases by listening, a task, not a question. The picked starting point seeds the stem, so no blank page.

**Reading floor.** Run `parseStory` on the seed plus the person's words. Still empty: "Not quite. Which part?" Never an empty Mirror. Any distress hit stops everything: no sound, no counter, no offer.

**What the person sees.** Deposits land on seats in seat hue, one 0.32 s move each (a single move, never a pulse), 62 ms apart. Gift counter holds 100 for 4 s, then falls toward 88 over the run. Seats stay Still until a reading exists; after that the figure may breathe.

**After.** Animation's Reel B replaces the tutorial, then "Keep this" and "Not now" at equal weight, the ticked box on "Keep this" only (sales). The signal test becomes the first door on the first Field. The loop ring appears here, one quarter per act done (game).

**Agree before building.** Art and systems: palette, `--stage`, type scale 12, 16, 28, 40 (hero 40 at 1600, 28 at 390, weight 300). Animation: the breath as a named gate 12 edit. Narrative: four lines and the distress frame, signed by a clinician. Systems: `obAct`, a `felt` field. Sales and TD: the `planSight` fix, an iOS webm Opus test.

## 5. REVISED GRADE

GRADE: 28/100 (was 36). Truth to the instrument 6 to 5: the signal answer changes only a paragraph (creative, systems). Honest about the person's state 5 to 2: narrative measured no distress detection. Novelty 2, teaches by doing 3, our assets 2, phone 3 stand. My target for the proposal drops from 78 to 70.

## 6. TOP 5 RECOMMENDATIONS

1. **First release is the onboarding (L).** Slider, gate, voiced opening, stem, 12 line run, reading; tutorial becomes aftercare. Moves Whitney, Renata, Toby, Marta.
2. **Sniffer plus reading floor before any live reveal (L, ship blocker).** Moves Marta, Nils, Camille.
3. **One clock: 5.65 s breath, four slides, about 23 s, gates never time out (M).** Moves Marta, Ezra, Whitney.
4. **Voice on the release opening only, shipped when ten phrases are confirmed (M).** Moves Marta, Camille, Nils.
5. **Signal test after the reading, as chips that write `felt`; hold tested on 8 people first (S).** Moves Nils, Whitney.

## 7. QUESTION FOR THE OWNER

None. Decision: voice waits on confirmation; the throat test follows the reading. Reason: a caption that differs from his words is a false reading. Pass 3 crude test: four slides on the breath clock, a gate, and the real `parseStory` on work sentences, counting how often it reads zero.
