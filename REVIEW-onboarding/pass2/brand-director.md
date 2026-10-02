GRADE: 35/100 (was 37)

Seat: brand, Noa Ferreira-Blake. Pass 2, round PJ. I read all eleven other pass 1 reports.

## 1. AGREEMENTS

- **A full bleed black stage replaces the card.** Brand, art, creative, animation, technical, UX, innovation. No wash, no dimmed app, no dots.
- **The loop is a circle and the avatar is the centrepiece.** Brand, art, animation, UX, game. Today "avatar" appears zero times in `onboard.js`, `tutorial.js` and `login.js` (brand, art).
- **The first release is the real onboarding.** Game, innovation, systems, creative, UX, brand. The tutorial is unreachable by a stranger because `DEV_PLAY_TUTORIAL` is false (systems, marketing, sales, game).
- **"It is okay" and "making us sick" go.** Brand, narrative, marketing. Both are claims with nothing beside them.
- **The voice stays on the release screen.** Brand, art, creative, animation, UX, game, marketing. Nine seats say it, and I confirm.
- **Developer options, with "Unlock all sight", must leave the public door.** Narrative, marketing, systems, sales, brand. A lock a stranger can open on frame one makes every later lock look decorative.
- **Distress detection blocks the first story.** Narrative, innovation, creative, art, systems, brand.

## 2. DISAGREEMENTS

1. **Signal test inside the slider** (art, narrative, UX, game) against **after the first release** (creative, marketing, sales). I take after. It is a body exercise, and the release opens with another one (feet on the floor, breath). Two in a row is a meditation timer, which is on our not-list. After the reading it becomes a check: the reading said a place, now test it on yourself. A mirror that lets you test it keeps the open promise.
2. **Voice clip cut into the slider** (narrative, 1.85 to 25.5 s; innovation and technical, voice as the clock). No. One hearing, at the release. By the fortieth view the clip is wallpaper. And all ten phrases are `confirmed:false`, which means the owner has not yet checked the draft words against what he said. The times are measured and safe to use. The words are not safe to print. A caption that differs from his voice is a mirror that lies. Captions come only from his confirmed release lines.
3. **A staged demo reading** (animation slides 3 and 4: a bead into the throat, a seat rising to 6.5; marketing: a labelled example reading). No. It is someone else's body, and nothing the person did. Innovation killed it for the same reason. The slider shows no number and no charge. The first charge a stranger sees is theirs. Marketing's real table row stays (section 4, slide 4).
4. **Glow behind the figure** (art R2, 8 percent, 60px blur). No. Soft light is banned in this category. The seat colours on the figure are the only light.
5. **Breathing at the gate** (animation, game, creative). No. Stillness means unread. Breathing means a reading exists. The figure breathes for the first time at the reading, so that moment is visible. If one seat breathes before then, locked things read as available (animation's own warning).
6. **Palette** (art: the quieter canon, because a black stage multiplies saturation). I keep the shipped `PAL`. The boot, the Field and the wheel all use it. A second palette in onboarding only is the two colour languages the skin round found. Art's saturation worry was the wash, and the wash is gone. The seats now appear as marks on a figure, not as fields of colour. A palette change is a whole product ruling, so it is not made here.
7. **Weight 300 hero** (art, creative, UX). I keep 400. The wordmark is ruled at 400 because 600 shouted. Text lighter than the name makes the name look like the loud one.
8. **Progress as a ring of arcs** (mine, art, creative). I concede. A ring around the figure competes with the halo and looks like the loop ring, which says "this is a loop of five". Hairline segments at the top edge, as animation, marketing, UX and technical propose.

## 3. WHAT I MISSED

- **The ruled somatic line.** My pass 1 copy dropped it. It is in the proposal now.
- **Source OS colour.** Pass 1 set it grey. The identity says accent, under the wordmark. Fixed below.
- **The product already breaks the promise I wanted to say.** Narrative measured that "I want to end my life" reads Sad 8.8 and offers a release. Sales measured that "I keep taking care of everybody else." returns zero hits. "If it does not know, it says so" is false unless an empty read says it, in those words. The gift line is false while `planSees(null,'sab')` returns false (the whole reading is not visible during the gift, sales).
- **The account copy.** The story passes to the account (systems). So "stays on this device" and "Nobody reads this but you" are true only before Keep this. The ask must state what leaves.
- **Numbers.** Narrative's rule: no "of 10" in copy, because it prints a score. My avatar line used one. Dropped.

My grade moves down two: Developer options on frame one, an empty read on the owner's own example, and no detector.

## 4. THE PROPOSAL, TOGETHER (my part: identity, copy that says what we are, tokens)

**The one sentence, on the login:** "There is more running you than you can see." Login A carries it. It is the first thing shipped, and the slider does not repeat it.

**Stage.** Ground `--stage`, the login's `#06060a`, one token, opaque 100 percent. Stop the Field draw loop while it is up (technical). The boot's end frame is slide 1's first frame: same figure, same coordinates, halo closed, shipped `PAL`, 36vmin tall, clamped 200 to 340px.

**Mark.** Drawn sky blue wordmark top left, 26px tall at 1600, 22px at 390. "Source OS" under it, accent, 12px, weight 400. Never "Powered by" after the boot.

**Tokens.** Type scale 12, 16, 28, 40 only. Hero 40px at 1600, 28px at 390, weight 400, line 1.2, centred, max 18em, ink role, sentence case, no eyebrows. Seat hue appears only on the figure. State never uses a seat hue. Accent sky only on the wordmark and the one live control. Rings, never fills.

**Dwell.** `1.2 s + 0.35 s per word`, rounded to 0.1, floor 3.0, cap 7.0. Reduced motion keeps the timer at 1.5 times.

| # | Line | Dwell |
|---|---|---|
| 1 | Welcome to a neurosomatic experience. | 3.0 s |
| 2 | Awareness and intuition is a tool we use to turn your senses inward. | 5.4 s |
| 3 | Atüned is a mirror. It shows what is running you. | 4.7 s |
| 4 | Every part is open. It says when it does not know. One real address row from the engine sits under it at 16px, read from data, never typed. | 4.7 s |
| 5 | Not a coach. Not a guide. Not a friend. An instrument. | 4.4 s |
| Gate | Pick your starting point. Twelve tiles. No timer. | stops |

That is 22.2 s of dwell, about 25 s on the clock with fades, five slides and one gate. Slide 5 is the only place the not-list is said. If narrative strikes it as antithesis (a not X but Y sentence, the shape the house voice rations), the fallback is "An instrument, not a coach." and nothing else moves.

**Motion.** Text in 420ms, `cubic-bezier(.22,1,.36,1)`, opacity and 8px rise. Text out 220ms, `cubic-bezier(.4,0,1,1)`, opacity only. Both are existing gate 12 durations. Never per word. Figure: Land (a single monotone move, 260ms) root to crown at 90ms stagger on slide 1 only. Slides 2 to 5 are Still. Four verbs, as ruled: Still, Breathe, Travel, Land.

**Controls.** Hairline progress, 2px, top edge, segments with 4px gaps, ahead 35 percent white (3 to 1 against the stage), passed and current 85 percent, the current one fills linearly. Hold 180ms or more pauses and resumes 300ms after release. A tap under 180ms: right two thirds forward, left third back. A 44px ring Pause, bottom centre, for anyone who cannot hold. "Skip", top right, 16px, ink at 60 percent, 44px target, no box, lands on the gate in 520ms and never in the app. Esc the same. The slider has no sound control and plays no sound.

**After the pick.** The tile contracts into the figure with that seat lit (420ms). Then the release stage, direction A, opening on his voice, captioned with confirmed lines only. Honest length under the tiles: "About four minutes. Stop any time."

**After the release, same grammar.**
- B1: the figure returns with one seat changed and breathes for the first time. "This is your avatar. The charge at your throat fell." No number.
- B2: the loop closes as a circle, "Discover. Play. Flow. Embody. Then again."
- B3, optional with Skip: the signal test, the person's own seat, ten ticks a side, three ring chips, no answer recorded if none tapped.
- B4: "Keep this" and "Not now", equal weight, and one line: "Your story and your readings go with the account. Your name and birth data stay here." Systems must confirm it is true.
- Empty read, always: "Nothing in that matched a pattern. Name how it felt." Never an empty Mirror.

**Must be agreed first.** Narrative: whitelist "Welcome to" (rule V1) and the slide 5 fallback. Art and systems: scale 12, 16, 28, 40 and the one `--stage` token. Animation: Land and fade curves, so gate 12 in `tests/design.js` stays at its four durations. Systems and sales: the gift honoured in code before the gift line ships. Technical: the real address row on slide 4.

## 5. REVISED GRADE: 35/100 (was 37)

Evidence added by others: Developer options on the public door, an unread owner example, no detector, a gift not honoured. The look and the mark scores do not rise, because nothing shipped changed.

## 6. TOP 5 RECOMMENDATIONS

1. **One stage, one figure: the boot continued.** M. Skeptic, phone only, acute distress. Kills the card, wash, ghost figure and the dimmed Field with its padlocks.
2. **Five lines, one gate, the not-list said once.** S. Skeptic, practitioner. Pulls the claims, adds the ruled line.
3. **Keep the promises in the product before saying them.** M. Skeptic, practitioner, Renata. Remove Developer options, honour the gift, make an empty read say it does not know.
4. **Distress detector and stop frame before the first story ships.** L. Acute distress first. Instrument voice, never "I am sorry". A clinician signs the text (narrative).
5. **Name the avatar at the first reading, and let it breathe only then.** M. Phone only, skeptic, practitioner.

## 7. ONE QUESTION FOR THE OWNER

None. Decision: the voice plays only on the release screen, and its captions come only from lines he has confirmed. Reason: the hearing stays one of a kind, and a screen must never say words he did not.
