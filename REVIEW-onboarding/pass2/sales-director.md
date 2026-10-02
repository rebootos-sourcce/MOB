# Pass 2, sales director (Camille Boucher). Onboarding and tutorial, round PJ

I read all twelve pass 1 reports. Levels are the buyer levels in `BUYERS.md` (7 is the primary buyer, 6 the volume, 4 and 5 the biggest and hardest crowd). I checked two facts: `planSight` reads the tier only and never the gift, and every phrase in `audio/atuned-opening-timing.json` is `confirmed:false`.

## 1. AGREEMENTS

- **The slider names no price.** Marketing, game, brand, me.
- **A decision is never timed.** Nine seats stop the clock at the starting point and the story box.
- **Unanswered is stored as unanswered, never "Nothing".** Art, narrative, UIUX, creative.
- **The first release is the real onboarding, and the account follows it.** Innovation, game, UIUX, animation, narrative, systems.
- **Developer options leave the public door.** Marketing, narrative, systems, me. "Unlock all sight" on frame one makes the lock look decorative.
- **Distress is a ship blocker.** Narrative, systems, innovation, animation, tech, UIUX.
- **The voice stays off the slider.** Seven seats, and me.
- **About nine padlocks on the first Field screen read as a shop.** Brand, art, game, UIUX, marketing.

## 2. DISAGREEMENTS, AND MY SIDE

- **Marketing: "A hundred patterns free. One at a time. It has an end." before any input.** Refused. "It has an end" plants a clock, a countdown in a quieter coat. Marketing is right that a stranger needs an end in sight. The honest answer is the measured time on the starting screen ("About four minutes. Stop any time", UIUX), not a limit.
- **Marketing: write nothing for levels 4 and 5, and show an "An example" reading.** Refused. One flow for all is ruled, and innovation is right that nobody believes someone else's result is theirs. Levels 4 and 5 are served by the feeling chip on the stem.
- **UIUX and narrative: the signal test sits in the slider, 70 to 80 s before any evidence.** That is where level 7 leaves. Marketing and creative also move it later. I take after.
- **Innovation: answer the signal test by how long you hold.** Refused. A hold cannot be told from "did not hold", so the data would lie. Chips stay.
- **Marketing: slider before the login door.** Refused. Login A is ruled first.
- **Game and UIUX: the reading comes after a four minute release.** If the person's words are read back only after about 48 s of lines and a 120 s settle (`REL_SETTLE_S`, the timed stillness), value sits four minutes in. The first Mirror line shows at the story commit. The release then proves the change.
- **My own pass 1 error.** I called "This is you, and it is okay" earned. Brand, marketing and narrative are right: it promises a verdict before any evidence. It goes. The throat test is where proof lives.

## 3. WHAT I MISSED

- **Distress has a sales rule.** On the frame that replaces the reading (narrative's refusal frame): no gift counter, no Keep this, no tier, no points. Selling beside someone's worst sentence is disqualifying.
- **No score on the first reading.** Narrative found "8.8 of 10 of shadow load". A first number out of ten reads as a grade. The first reading names a place and the person's own words, no digits.
- **Zero reads.** Narrative measured "I do not want to be here anymore" reading as nothing. It is my zero-read finding again. An empty read says "Not quite. Which part?" and never "that is a real reading".
- **Padlocks during the gift are a lie.** The ruling says the whole reading is visible during the gift, so no padlock draws while `inGift` is true. This sharpens my R9.
- **The gift is derived, never stored** (systems), so the counter is the engine's number, never typed.
- **Account creation is two steps** (systems): account made, then data pushed. If the push fails, Keep this says so and can retry.
- **Three rings can confuse.** Art has a timer ring, game a loop ring, I have a gift ring. A gift ring that looks like a progress bar reads as fake endowed progress.

## 4. THE PROPOSAL, MY PART

Pace rule, taken from narrative: `dwell = max(3.0 s, 1.0 s + words / 2.5)`, rounded up to 0.5 s, 12 words a slide at most. It is the slowest rate offered, and stressed readers need slow. The extra second costs nothing.

**Four silent slides, 20 s, then the gate:**
1. 3.0 s: "Welcome to a neurosomatic experience."
2. 6.0 s: "Awareness and intuition is a tool we use to turn your senses inward." (The ruled line split in two, so each slide stays under 12 words.)
3. 5.0 s: "There is more running you than you can see."
4. 6.0 s: "You write one thing. It shows where it sits in your body."

The mechanism lands before 15 s, which level 6 needs. The loop circle moves to after the release, with the person's own sentence travelling round it (art R9). Cut: "it is okay", "making us sick", any price word.

**Gate, no timer:** "Pick your starting point." Twelve tiles, 44 px or taller, no Next. A tap advances after 600 ms. Skip lands here, never in the Field. After a Skip, the next open starts here, not at slide 1.

**Stem screen, no timer:** the ruled stem as the hero line, three feeling chips from `FEELINGS-WHEEL.md` under it so nobody faces a blank. "Read it" shows after five words. 16 px minimum on any line holding a number or a choice.

**Gift, said once, as a 4 s caption on the stem screen, then a number in the release stats corner:** "100 patterns are open to you. Everything stays visible while you use them." Neutral ink role, no accent, no seat hue, never red or amber at any count, never changing faster than twice a second. After the run, the number is read from `planAllowance`.

**Mirror at the commit, inside 6 s:** "{their word} sits at your {address}. You wrote: {first 12 words}." No digits. Empty read: the fallback above, with chips. Never an empty Mirror.

**Then** the 12 line mini release. Leaving at any point keeps the reading.

**Keep this, after the release and its reading.** Two controls, equal weight, both ring outlined, both 48 px: **Keep this** and **Not now**. Keep this opens username (3 to 20 characters) or email, an optional recovery email, and one unticked row: "I am 18 or older. I agree to the Terms and the Privacy policy." The box appears here only, never on Guest, never on frame one. Line above it: "Your story is saved to your account. Your name and birth data are not." (Narrative and systems confirm it is true before it ships.) Guest line: "Try it on this device. Clearing the browser clears it."

**The signal test is an offered door after the reading,** one quiet ring labelled "Try the throat test", with a time measured on a clock run. Chips Yes, No, Nothing. No Next, no hold.

**To agree first:**
- Narrative: the exact gift, Keep this and refusal lines.
- Systems: `planSight` reads `inGift` and sees all, and the account push is a named allowlist. The ruling is given, so I call it a defect, not a request.
- Art: the gift ring's role colour, and one ring on screen at a time.
- Technical: the distress hook stops the clock and removes every sell element.

## 5. REVISED GRADE: 36/100 (was 39)

Down three. UIUX shows "Two minutes" is untrue (about four with the release). Brand and UIUX show padlocks drawn where the gift ruling says nothing is locked. Narrative shows the zero read and the "okay" verdict cost more than I scored. Nothing dark ships, so manipulation stays high.

## 6. TOP 5 RECOMMENDATIONS

1. **First Mirror line at the story commit, inside 90 s of frame one, with the feeling chip and the zero read fallback.** M. Levels 7, 6, 4, 5.
2. **Honour the gift in the engine, no padlock while it lasts, counter read from the engine.** M. Levels 7, 6.
3. **Keep this and Not now at equal weight after the first release, the ticked box there only, honest failure on the push, Developer options off the public door.** S to M. Levels 7, 6, 4.
4. **A silent 20 s slider that names no price, never times a decision, and stops at the starting point.** S. Levels 6, 7, 4, 5.
5. **The signal test as an offered door after the reading, chips only, unanswered stored as unanswered.** S. Levels 6, 7.

Questions for the first watch (five people per level): "Show me what you did right after your first reading." At 12 left, before any price: "What would you have expected a month of this to cost?" On cancel: "What would make you stop?" Local flags only: seconds to the first Mirror, the tile chosen, Keep this against Not now.

## 7. ONE QUESTION FOR THE OWNER

None. My decision: the gift is honoured in code because he already ruled it, and the slider carries no price word because a stranger who has seen nothing cannot weigh one.
