# Pass 3, game director (Ngozi Achebe-Lindgren), round PJ

## 1. THE PROPOSAL AS I UNDERSTAND IT

A stranger lands in one black room with one figure. A silent film of about 26 seconds runs by itself, then waits at one decision (pick a starting point). The person writes one true sentence, the engine reads it back, a 12 line release plus a 120 second settle runs, and a short aftercare reel ends on the Field.

The loop in one sentence: say one true thing, see where it sits, release it, watch the avatar change. The merge kept my main points: no timer over a decision, the first release is the onboarding, distress blocks shipping, no streak, no scarcity clock.

Lost or misread:
- **No exit at the gate.** Skip and Esc land on the gate, but nothing lets a person leave it. A person must be able to stop and be glad they came. My pass 2 had "Leave", writing nothing.
- **The half release leaves no trace and no line.** My "Stopped. Nothing was released." fell out.
- **No day 2 door.** My "Read the same place again" and the one reminder, default off, are gone. Without a reason to return, the first week is empty.
- **Retention numbers are gone.** A proposal without its cost is an opinion. They are in section 5.
- **Reel B is overloaded** (see gap 2).
- **The gift counter "falling" on the release screen** is a loss frame, a count going down in front of a body. Misread, I think.

## 2. THE ICP ROOM (ICP means ideal customer profile, one imagined person)

**Marcus, founder, level 7.** He sees the black room and the standing figure, with no card. He lets the film run, taps Skip once to test it, lands on the gate, and stays. He hunts for the developer drawer and finds it lower right behind the dev flag. *"It shows me something before it asks me anything. Good."*

**Whitney, phone only, level 5.** At 390 wide she sees the figure and the ruled welcome line. She holds the screen with her thumb to pause it and no iOS text menu opens. She likes the "senses inward" line because it sounds like her. She picks a chest point and stays. She leaves if the tiles are under 44 px. *"Okay, this talks like me. I'll start with the heavy chest one."*

**Nils, design skeptic, level 4.** He sees a film, not a form, and watches for a trick. The proof row ("112 addresses", a real engine row) holds him. He leaves at the Keep this screen if the line about what leaves the device is vague, and he reads a falling gift counter as a free trial meter. *"Tell me exactly what leaves my device and I'll think about it."*

**Camille, somatic practitioner, level 6.** She sees seats rising root to crown and judges the pacing. She stays through the 120 second settle because it is not shortened. She walks if there is no answer for a client who types something dark. *"The quiet is right. What does it do when someone types the worst sentence?"*

**Marta, acute distress, 02:00.** She sees black, one still figure, and moving words. She needs a way out in under three seconds, not a film. Skip (16 px, top right) to the gate, then Leave, and the Field opens unread. If she types a dark sentence, the distress hook stops everything. Today that hook does not exist, so for her the build is not ready. *"I can't read this right now. Make it stop."*

**Renata, operator, level 7, main target.** She sees the figure, watches two slides, then holds. She writes "I keep taking care of everybody else.", gets a pick seeded line instead of nothing, and runs the full release. She stays if the avatar visibly changes. She leaves at Reel B if it is long. *"Five minutes is fine if I get one thing I can use tonight."*

**Trey, quiz tourist.** He sees a login door and takes Guest. He skips the film, picks at random, and stops at the story box because it wants words. With Leave he goes out without a scolding and gets one quiet door next open. *"I just wanted my result."*

**Sofia, loves the open tables.** She sees "112 addresses" and leans in. She stays through the film and picks fast. She wants to open the list and finds no door to it until later. *"The whole list is real? Where do I read it?"*

## 3. UNIFIED QUALITY: 71/100

One voice, one clock, one figure, one palette rule, closed loop, no pressure pattern. That is a strong spine.

Three biggest gaps:
1. **No leaving and no tomorrow.** No exit at the gate, no trace for a half release, no day 2 door.
2. **Reel B is a second onboarding.** After about five minutes, the person gets the reading, the loop, the word "avatar", the signal test, the Keep this choice, the agreement box and the account fields. That is six decisions at the point of most fatigue.
3. **Distress detection is a promise, not code.** The hook, the stop frame and the clinician signed text do not exist. Everything else is polish until they do.

## 4. FINAL GRADE

GRADE: 66/100 (pass 1 was 36, pass 2 was 34)

This grades the proposal, so it is not the same yardstick as the earlier two grades, which scored the shipped onboarding. What moved it up from the old build:
- Agency. One decision before value, not six.
- No button wall.
- A real first release.
- An honest, fixed reward (one changed address). No variable ratio schedule (a reward of random size or timing), no streak.

What holds it down: gaps 1 to 3 above, and the retention cost (section 5), which I accept and say out loud.

## 5. MY PART OF THE BUILD SPEC

**Loop sentence.** Say one true thing, see where it sits in the body, release it, watch the avatar change.

**Dwell, as the lead ruled.** `max(3.0, 1.0 + words / 2.5)`, rounded up to 0.5 s, cap 7.0 s. Reduced motion times 1.5. Dwell starts when text begins to enter. Reel A total is derived from the table. A gate fails above 30 s and the figure is never typed.

**Gate.**
- Hero: "Pick your starting point."
- Under: "About {n} minutes. Stop any time." `n` is computed from the table, never typed. Today it is five (26 s film, about 60 s writing, 48 s release, 120 s settle, about 30 s reel B), so "four" is wrong and goes with "Two minutes".
- No timer. Choosing a tile is the advance. The tile is 44 px or more and a ring.
- **New, "Leave", 16 px, quiet, lower left.** It opens the unread Field. It writes nothing and sets no flag. The next app open shows one quiet door, "Pick your starting point", never a badge or a push.

**After the pick.** The seat lights over 420 ms. Line: "Starting from {point}." for 2.5 s. A tap skips it. It stores `journey.start`.

**Guaranteed deposit.**
- Release lines are the person's own hits first, then padded from the picked point's addresses up to 12. A zero hit sentence still gives a release.
- The reading says which line came from where: "From your words." / "From your starting point."
- Rule: every completed first release changes exactly one address and the avatar, never random, the same each time.
- A release stopped before line 12 commits nothing. The stage says "Stopped. Nothing was released." for 3 s. Skip from second zero of the settle is allowed. A stop after line 12 keeps the release, with no scolding line.

**Gift counter.** I differ from the lead on the release screen. The lead has it falling toward 88 while the person releases. Mine: it is hidden during the release and shown once in Reel B, static, at the engine's value, with no motion, no colour change and no low warning. If the owner wants it falling, then the falling value is the engine's number, never typed.

**Reel B, four beats, 24 s at most.**
- B1 the reading and the changed address.
- B2 "This is your avatar." (the word said once) and the loop drawn as a closed circle, one station a second.
- B3 "Keep this" and "Not now", same size, same weight, one line on what leaves the device. Box unticked, shown only after Keep this. No fields for Guest.
- B4 one ring, "Open the tables", for Sofia and level 6 and 7 readers. It lands on the address list.
- **The signal test leaves Reel B.** It becomes the first door on day 2. I differ from the lead here, and I give both values. Lead: offered in Reel B as three ring chips, unanswered stores empty. Mine: day 2 only. Evidence: every extra choice after the main ask costs people. A benchmark from elsewhere, not a promise here, is 10 to 20 percent per added step in post value funnels. If the owner keeps the lead's version, it must be last, below the account ask, and skippable in one tap.

**Day 2 and the week.**
- The Field's first door on the next open is "Read the same place again". A two minute visit gives one sentence and a reading, a twenty minute one runs a full release. Neither is punished.
- One optional reminder, off by default, never loss framed, never "do not break". Nothing on a missed day.
- No streak, no scarcity timer, no near miss, no social nudge, in any file under the stage. A gate greps for them.

**Seat colour.** I accept the lead's ruling on shipped `PAL` (the shipped seat colours). The condition is that the red root seat is never larger than 12 px and its glow is 12 percent or less on the stage.

**Planning retention.** Benchmarks from elsewhere, not promises: free to play day 1 is 25 to 30 percent, day 7 is 8 to 12. Planning here: day 1 15 to 22, day 7 6 to 9. That is about a third lower at day 1 and a quarter lower at day 7 against the middle of the benchmark. Streak plus loss push bought a fifth to a third of day 7. We give it up.

Planning funnel, per 100 arrivals: 70 reach the gate, 55 pick, 40 write, 30 to 35 start the release, 25 to 30 finish it, 10 to 14 keep it. Build size: about 4 to 6 days for my parts, excluding the distress detector.

**Telemetry (counting what people do).**
- Events: arrive, slide reached, skip, gate seen, pick, leave, story start, commit, empty read, release start, line 12, settle end, stop (with the second), keep, not now, day 2 open.
- Stored in memory only. Nothing leaves without the account.
- Pair it with five strangers I actually watch before ship, because the numbers never say why they left.

**Gates.**
1. The sum of auto dwells is at most 30 s.
2. No clock runs on a gate or on a story step.
3. Decisions before the first release equal one (the pick).
4. Leave exists at the gate and writes nothing.
5. Keep this and Not now are the same size.
6. The gift number equals the engine's.
7. The stage files contain no streak, loss or timer words.

## 6. RANKED RECOMMENDATIONS

1. **Distress detector, hook and stop frame (L, ship blocker, redesign).** Moves Marta, Camille. Nothing ships without it.
2. **Leave at the gate, the half release trace line and `obAct` storing nothing on Skip (S, redesign light).** Moves Marta, Trey, Nils, Marcus.
3. **Guaranteed deposit: pick seeded release and a changed address (M, redesign).** Moves Renata, Whitney, Trey.
4. **Trim Reel B to four beats and move the signal test to day 2 (S, redesign light).** Moves Renata, Nils, Camille.
5. **Day 2 door and one reminder, default off (M, redesign).** Moves Renata, Camille, Marcus.
6. **Gift counter static, once (S, reskin).** Moves Nils, Marta.
7. **"Open the tables" ring in Reel B (S, reskin).** Moves Sofia, Camille.
8. **Telemetry plus five watched strangers (S).** Moves all of them.

## 7. ONE QUESTION

None. If the owner overrules me on the signal test or the falling counter, the build keeps the lead's value and I have given both.
