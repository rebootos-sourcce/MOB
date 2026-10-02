# Pass 3, sales director (Camille Boucher). Onboarding, round PJ

Buyer levels are from `BUYERS.md`: 7 is the primary buyer (85 percent), 6 the volume (65), 4 and 5 the biggest and hardest crowd. The gift is the 100 free patterns, a run is at most 25, so the gift is four full runs.

## 1. THE PROPOSAL AS I UNDERSTAND IT

One black stage, one figure, one clock. A silent 26 s reel gives the mechanism, the person picks one of twelve starting points, writes one sentence, sees a first Mirror line (the engine's reading of their own words), then runs the 12 line release. Reel B shows the reading, then "Keep this" or "Not now", then the Field.

The lead kept what I cared about most: no price word, no clock on a decision, no "it is okay", the account after value, Developer options off the public door, and the engine facts (gift honoured in `planSight`, never empty read). It lost three things. (a) My gift line: the proposal shows a counter falling from 100 and never tells a stranger what 100 is. (b) The sales half of the distress rule: the stop frame says no colour and no audio, but not "no counter, no Keep this, no tier". (c) Skip on the release screen: it is not said where it lands, and if it lands on the Field the person skips Keep this.

## 2. THE ICP ROOM

**Marcus (founder, level 7).** Sees black, one figure, a line he reads in three seconds. Stays: the proof row, "112 addresses", is a real row he can check. Taps the right side twice to speed up, which works. Leaves if the Mirror line is generic. He wants to see his own sentence mapped, and it is. Says: "Fine. Show me the row that is wrong."

**Whitney (phone only, esoteric native, level 5).** Sees a 44 pt line and a tile grid with ring chips. She already knows chakra language, so the twelve starting points feel like home. She picks fast, types a long sentence, and loves the voice on the release. Leaves only at the signal test if it feels like a quiz. Says: "Okay, this feels like it knows me. What is the 100?" That question is gap one.

**Nils (design skeptic, level 4).** Sees hairline progress and no card. He stays through the reel because it is silent and stoppable. He leaves at "neurosomatic" if slide 3 has no mechanism. The proof row saves him. A padlock during the gift would end him, and the proposal removes it. Says: "Still no number on me. Good. Keep it that way."

**Camille (somatic practitioner, level 6).** Sees the ruled welcome line and reads it as a human wrote it. Stays for the mirror line and the loop as a circle. She tests the distress frame by typing a heavy sentence. If any sell element shows beside it, she is gone and tells her clients. Says: "Selling next to that sentence would be the end of it for me."

**Marta (acute distress, 02:00).** Sees a still frame, no colour, nothing moving. That is right. She does not want a counter, a button that says Keep, or a tier. She needs the plain stop frame to hold nothing but a way out. Says nothing. Success is that she is not sold to.

**Renata (operator, level 7, the main target).** Sees a short reel, a decision, one sentence. Her first Mirror lands about 85 to 95 s after she picks Log in or Guest. She does the release, sees 88, sees the reading, and meets Keep this at about four and a half minutes. She taps Keep this because the account line says what leaves the device. Says: "It showed me something before it asked me for anything."

**Trey (quiz tourist).** Sees a reel and bounces at slide 2 or the gate. Skip lands on the gate, not the app, so he stays in the funnel. He takes Guest. He is not a buyer yet and he is not hurt. The sale is the next visit, when his reading is still there. Says: "Where is the result?"

**Sofia (loves the open tables).** Sees "112 addresses" and "Check any row". She stays for the proof slide and will go looking for the tables. She is a Level 8 to 10 reader, and for her the proof row is the best slide. She leaves only if the row is invented. Says: "Is that row real? It is. Good."

## 3. UNIFIED QUALITY: 68 out of 100

Three biggest gaps left:
1. **The gift is never said.** The counter appears from 100 with no sentence. A number a person does not understand reads as a meter on them.
2. **Distress frame lacks a no-sell list.** The proposal says what is removed visually, not what commercial elements are removed.
3. **Skip and Keep this.** Nothing says that Skip on the release screen goes to Reel B. Keep this sits after a 48 s release and a 120 s settle, so a person who leaves in the settle never meets it.

## 4. FINAL GRADE

GRADE: 68/100 (pass 1 was 39, pass 2 was 36)

Pass 1 and 2 graded the current build. This grades the proposal. What moved it: the lead adopted the no-price slider, the decision clock stop, account after value, equal weight Keep this and Not now, the never-empty read, and the gift honoured in engine. Held back: the three gaps above, and nothing is measured yet. 68 is a paper score.

## 5. MY PART OF THE BUILD SPEC

**Gift line, said once.** On the stem screen, before the person types, a 4 s caption, 16 px, neutral ink role, no accent, no seat hue: "100 patterns are open to you. Everything stays visible while you use them." In 420 ms, out 220 ms. Text only, no ring (a ring that fills reads as fake progress). This differs from the proposal, which has no caption. Value if the lead refuses: put the same line as the first caption of the release stage, before the voice, and drop nothing else.

**Counter.** In the release stats corner, 16 px, neutral ink. It reads `planAllowance().left` and updates once per release line (every 4 s). Never red or amber at any count. Shown as "88 left" after the 12 line run. Never typed as a constant.

**Engine gate.** While `planAllowance().inGift` is true, `planSight` returns full sight, and no padlock node is drawn on any surface. Add a test: `planSees(null,'sab')` true while `inGift`, false after. At 12 left, once: "One run left in the gift. After it, saboteurs show on tier one."

**Distress no-sell list.** When the distress hook fires, remove from the document (not hide): gift counter, gift caption, Keep this, Not now, Hear it, signal test, any tier, plan or points text. Add `tests/funnel.js` assertion: in the stop frame, the DOM holds none of those ids. After the stop, nothing sells in that session.

**First Mirror.** Within 6 s of commit: "{their word} sits at your {address}. You wrote: {first 12 words}." No digits. Empty read: "Not quite. Which part?" with the feeling chips. The proposal's line "Nothing in that matched a pattern. Name how it felt." states a fail on a sentence that might be someone's worst; I prefer mine. Both values are given and the lead picks.

**Time to value.** Target Mirror at 95 s or less from the Log in or Guest tap, measured on the real flow with a clock run, not guessed. Reel 26 s plus gate 8 s plus story 45 s plus transit and Mirror 11 s is about 90.

**Skip on release.** Skip at any point in the release or the settle goes to Reel B (reading, then Keep this), never to the Field. The reading is kept.

**Keep this and Not now.** Both ring outlined, both 48 px tall, same width, Keep this first in reading order, Not now never greyed. One line above them: "Your story goes to your account. Your name and birth data stay on this device." (Systems confirms it is true before it ships.) Guest: "Try it on this device. Clearing the browser clears it." Ticked box on Keep this only: "I am 18 or older. I agree to the Terms and the Privacy policy." Unticked. If the push fails: "Your account is made. Saving the story failed. Try again." plus a Retry. Offer Keep this again once when 50 or fewer are left, then only in the profile.

**Signal test (after the reading).** Three ring chips: Yes, No, Felt nothing. Felt nothing is a real answer. Skipped is stored empty. No Next, no hold, no timer.

**Local funnel record** (additive, in `journey`): seconds to gate, tile id, seconds to Mirror, whether the Mirror was empty, Keep this or Not now, the step where the person left. Local only. Guest drop off is read by interview.

**No price word** in the first run: free, trial, limited, plan, upgrade, tier, patterns per week. "100 patterns" is a quantity, not a price.

## 6. RANKED RECOMMENDATIONS

1. **Gift line plus engine honour, no padlock while it lasts.** M, redesign of one engine rule. Levels 7, 6, 5.
2. **Distress no-sell list as a test.** S, reskin of the stop frame plus a gate. All levels, and Marta most.
3. **Skip on release goes to Reel B.** S, redesign of one route. Levels 7, 6, 4.
4. **First Mirror in 6 s, with the soft empty read.** M, redesign. Levels 7, 6, 4, 5.
5. **Keep this and Not now at equal weight, the box only there, honest push failure.** S to M. Levels 7, 6, 4.
6. **Measure the real path to the Mirror and the Keep this moment, then fix any "about" in copy.** S. Levels 7, 6.
7. **Signal test as an offered door after the reading.** S, reskin. Levels 6, 7.

## 7. QUESTIONS TO ASK, in the form that gets behaviour

- "Show me what you did right after your first reading." Five people per level, screen shared.
- At 12 left, before any price: "What would you have expected a month of this to cost?"
- On cancel: "What would make you stop?"

## 8. ONE QUESTION FOR THE OWNER

None. My decision: the gift is a quantity said once in plain words, and nothing sells beside a distress sentence.
