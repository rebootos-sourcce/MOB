# Pass 3, game director (Ngozi Achebe-Lindgren), round PJ

## 1. THE PROPOSAL AS I UNDERSTAND IT

A stranger lands in one black room with one figure. A silent film of about 26 seconds runs by itself, then waits at one decision, a starting point. The person writes one true sentence, it is read back, a 12 line release and a 120 second settle run, and a short aftercare reel ends on the Field. The loop in one sentence: say one true thing, see where it sits, release it, watch the avatar change.

The merge kept my hard points: no timer over a decision, no streak, no scarcity clock, the first release is the onboarding, distress blocks shipping. It lost or misread:
- **No exit at the gate.** Skip lands on the gate, but nothing lets a person leave it. My "Leave", writing nothing, fell out.
- **The half release leaves no line.** My "Stopped. Nothing was released." fell out.
- **No day 2 door.** "Read the same place again" and one reminder, default off, are gone.
- **The retention cost is gone** (section 5), and the gift counter falling during the release is a loss frame.

## 2. THE ICP ROOM (ICP is one imagined person)

**Marcus, founder, level 7.** Sees black and one figure. Taps Skip once, lands on the gate, stays. *"It shows me something before it asks me anything."*

**Whitney, phone only, level 5.** She holds the screen to pause and no iOS text menu opens. "Senses inward" sounds like her. She picks and stays. Tiles under 44 px would lose her. *"Okay, this talks like me."*

**Nils, design skeptic, level 4.** The proof row, "112 addresses" from a real engine row, holds him. He leaves at Keep this if the line on what leaves the device is vague. *"Tell me exactly what leaves my device."*

**Camille, somatic practitioner, level 6.** Stays through the unshortened 120 second settle. Walks if nothing answers a client who types something dark. *"The quiet is right. What happens at the worst sentence?"*

**Marta, acute distress, 02:00.** She needs out in under three seconds: Skip, then Leave, Field unread. If she types a dark line the distress hook must stop everything. It does not exist yet, so for her the build is not ready. *"I can't read this right now. Make it stop."*

**Renata, operator, level 7, main target.** Writes "I keep taking care of everybody else.", zero hits today, and still gets a release. Stays if the avatar visibly changes, tires at a long Reel B. *"Five minutes is fine if I get one thing for tonight."*

**Trey, quiz tourist.** Skips the film, picks at random, stops at the story box. With Leave he exits unscolded. *"I just wanted my result."*

**Sofia, loves the open tables.** Leans in at "112 addresses". Finds no door to the list. *"The whole list is real? Where do I read it?"*

## 3. UNIFIED QUALITY: 71/100

One voice, one clock, one figure, one closed loop, no pressure pattern. Biggest gaps:
1. **No leaving and no tomorrow.** No exit at the gate, no trace of a half release, no day 2 door.
2. **Reel B is a second onboarding.** After about five minutes it stacks reading, loop, signal test, Keep this, agreement box and fields.
3. **Distress detection is a promise, not code.** The hook, the stop frame and the clinician signed text do not exist.

## 4. FINAL GRADE

GRADE: 66/100 (pass 1 was 36, pass 2 was 34)

This grades the proposal, not the shipped build, so the yardstick differs. Up for agency (one decision before value, not six), no button wall, a real first release, and a fixed earned reward with no variable ratio schedule (random size or timing). Held down by the three gaps and the retention cost.

## 5. MY PART OF THE BUILD SPEC

**Dwell, as the lead ruled:** `max(3.0, 1.0 + words / 2.5)`, rounded up to 0.5 s, cap 7.0 s, times 1.5 in reduced motion. Reel A total is derived. A gate fails above 30 s.

**Gate.**
- Hero "Pick your starting point." Under it "About {n} minutes. Stop any time." with `n` computed from the table. Today that is about five, so "four" is wrong.
- No timer. Choosing a tile is the advance. Tiles are rings, 44 px or more.
- **New:** "Leave", 16 px, quiet, lower left. It opens the unread Field, writes nothing, sets no flag. The next open shows one quiet door to the gate, never a badge or a push.

**After the pick.** Seat lights over 420 ms. "Starting from {point}." for 2.5 s, tap skips. Stores `journey.start`.

**Guaranteed deposit.**
- Release lines are the person's own hits first, padded from the picked point up to 12.
- The reading labels each line "From your words." or "From your starting point."
- Every completed first release changes exactly one address and the avatar. Never random.
- Stopped before line 12: nothing commits, stage says "Stopped. Nothing was released." for 3 s, no "are you sure". Stopped after line 12 keeps it. Skip is allowed from second zero of the settle.

**Gift counter.** I differ from the lead. Lead: falls from 100 toward 88 on the release screen. Mine: hidden during the release, shown once in Reel B, static, at the engine's value, no motion, no colour change, no low warning. Either way the number is the engine's, never typed.

**Reel B, four beats, 24 s at most.** B1 the reading and the changed address. B2 "This is your avatar." (said once) with the loop as a closed circle, one station a second. B3 "Keep this" and "Not now", same size and weight, one line on what leaves the device, box unticked and shown only after Keep this, no fields for Guest. B4 one ring, "Open the tables", landing on the address list.

**Signal test.** I differ from the lead. Lead: offered in Reel B as three ring chips. Mine: first door on day 2. Evidence: a benchmark from elsewhere, not a promise here, is 10 to 20 percent lost per added step after the main ask. If the lead's version stays, it goes last, below the account ask, skippable in one tap.

**Day 2 and the week.**
- First door on the next open: "Read the same place again". A two minute visit gives one sentence and a reading. A twenty minute one runs a full release. Neither is punished.
- One optional reminder, off by default, never loss framed. Nothing happens on a missed day.
- No streak, loss, scarcity or social nudge string under the stage.

**Seat colour.** I accept the lead's shipped `PAL`, on one condition: the red root seat is never over 12 px, and its glow is 12 percent or less, on the stage.

**Retention.** Benchmarks from elsewhere, not promises: free to play day 1 is 25 to 30 percent, day 7 is 8 to 12. Planning here: day 1 15 to 22, day 7 6 to 9. That is about a third lower at day 1 and a quarter lower at day 7 against the benchmark middle. Streak plus loss push bought a fifth to a third of day 7. We give it up. Planning funnel per 100 arrivals: 70 reach the gate, 55 pick, 40 write, 25 to 30 finish the release, 10 to 14 keep it. Build size for my parts, 4 to 6 days, excluding the distress detector.

**Telemetry.** Count arrive, slide reached, skip, pick, leave, commit, empty read, line 12, settle end, stop second, keep, day 2 open. Pair it with five strangers watched before ship, because the number never says why.

**Gates.** Auto dwells sum to 30 s or less. No clock on a gate or story step. One decision before the first release. Leave exists and writes nothing. Keep this and Not now match in size. Gift number equals the engine's. No streak, loss or timer words in stage files.

## 6. RANKED RECOMMENDATIONS

1. **Distress detector, hook and stop frame. L, ship blocker, redesign.** Marta, Camille.
2. **Leave at the gate, the half release line, `obAct` storing nothing on Skip. S, light redesign.** Marta, Trey, Nils, Marcus.
3. **Guaranteed deposit: pick seeded lines and a changed address. M, redesign.** Renata, Whitney, Trey.
4. **Trim Reel B to four beats, signal test to day 2. S, light redesign.** Renata, Nils, Camille.
5. **Day 2 door and one reminder, default off. M, redesign.** Renata, Camille, Marcus.
6. **Gift counter static, shown once. S, reskin.** Nils, Marta.
7. **"Open the tables" ring. S, reskin.** Sofia, Camille.
8. **Telemetry plus five watched strangers. S.** All.

## 7. ONE QUESTION

None. Where I differ from the lead, both values are above and the build can take either.
