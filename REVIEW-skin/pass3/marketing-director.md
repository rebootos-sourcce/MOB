# Pass 3, marketing director (Theo Lindqvist). Reach, simulated against the merge

## 1. THE PROPOSAL IN THREE SENTENCES

Tare: one free light figure, one four-arc loop ring, and one grammar for colour, type, shape, motion, locks and copy, so every surface shows the load and the person under it. The unread Field becomes its own screen (one promise sentence, four doors, a quiet door to the tables, the privacy line, no verdicts, no zeros, no padlocks). The funnel is told true.

What the merge lost or bent:
- **Login A is gone.** My pass 2 top item, the ruled first screen with one Start button, is not in it. The promise sentence lands on the unread Field only. `ui/login.js` still shows a form first. Dev mode skips it, so the skin shots never showed that.
- **Day 2 has no trigger.** Game and UI/UX both found it. A paid person with no reason to return leaves at month two.
- **Levels 4 and 5 have no lane.** Biggest group, hardest sell. The first release is their only door.
- **Marcus contradicts himself.** Field says Gaining at 62, Story says nothing is held above the line. Dropped. A demo that disagrees with itself kills every pitch built on it.

## 2. THE ICP ROOM (ten seconds on the new Field)

- **Marcus, founder, level 7 (85 percent buy).** Sees a pencilled figure and one sentence naming what he cannot see. Writes a story at once. Stays, because a plain sentence of cost comes back fast. Leaves if the demo contradicts itself. "Fine. Show me where the leak is."
- **Whitney, phone only, level 5 (30 percent buy, but my referral channel).** On 390 the doors are above the fold and the pill is off the zoom buttons. She takes a door, then screenshots Summary. Leaves at a form or a padlock. "Is this the astrology app for people over astrology?"
- **Nils, design skeptic.** Hunts for the crack. Sentence case holds and the clipped tabs are gone. He goes to the fifth door, the tables, and stays. One crack left: the Source OS wordmark at 1.36 to 1 contrast. "Somebody decided this. Now show me the tables."
- **Camille, somatic practitioner, level 8.** Sees a figure she could show a client, no number on it. The privacy line is at the door. Practitioner consent is still on no first screen. Leaves unless consent is findable. "Who sees my client's record, and how do I stop it?"
- **Marta, acute distress.** Two in the morning. One sentence, one box, no zero, no verdict, no lock. That is kind. She writes one story and may leave, which is right. We do not market to her or follow her with a message. "I just need it to stop."
- **Renata, operator, level 7.** Marcus, faster. Leaves at a red-brown low band with a price beside it. The proposal removes both. "Does this cost me an hour a day?"
- **Trey, quiz tourist, level 4 to 5.** Wants a score. The quiz footer still prints "of the hundred points" and "out of ten". He finds a reading and leaves. Not a loss: wrong buyer. "Where is my number?"
- **Sofia, loves the open tables.** The fifth door lifts the codex out of Embody. She needed no persuading. She is the testimonial. "Every table is readable. Nobody else does that."

## 3. UNIFIED QUALITY: 64/100

It reads as one thing from the Field onward, not from the first screen, which is a login. Three biggest gaps:
1. **The front door is outside the skin.** Landing lists Games and Play as real games. `funnel/buy.html` line 367 says 50 patterns when the ruling is 25, and line 308 says a tier is "a rate of new ground and nothing else", false since 1 October.
2. **Nothing is measured.** The panel's 315 against 1,948 reaching a score is simulated.
3. **No day 2 pull, and no low-band screen seen.** Art counted 8,288 of 10,000 simulated people reading below 50. For most real arrivals the first hero is a low reading, and nobody has rendered one under the new skin.

## 4. FINAL GRADE

GRADE: 63/100 (pass 1 was 52, pass 2 was 49)

Pass 3 grades the proposal, not the shipped product. It rose because the merge took my unread screen, the free figure with no number, one lock per surface and the true funnel. It stops short of 70: Login A dropped, day 2 silent, no person tested.

## 5. MY PART OF THE BUILD SPEC

**Copy, exact:**
- Hero, 28 px at 1600, 20 at 390: "There is more running you than you can see."
- Under it, 16 px: "Write one story. The instrument reads where it is held."
- Button, 16 px, 500: "Start". Quiet link: "I have an account". Start is the guest path; an account is offered after the first release, as ruled.
- Four doors, one 16 px sentence each, centred on the stage, kept while unread.
- Fifth door, quiet: "Open the tables the reading runs on."
- Privacy line, 13 px, under the doors and on the login: "Your stories and readings stay on this device."
- Empty is a dash. Where `ui/ui.js` lines 1369 and 1370 print "Heaviest" and "Most shut" on a blank profile, print "Nothing yet".
- Lock, named by the next rung: "Opens on tier three." Never "locked", "unlock", "upgrade", "premium", a count of places left, or a countdown. No price on a reading surface. A price appears only after a tap on a sealed mark.
- Day 2, after a first release, only if the compare exists: "The next reading is compared with this one."
- Summary top, body size: "Nothing here is generated from anything the instrument has not measured." Reading text 16 px.

**Funnel words:** `funnel/buy.html` 367 becomes "25 patterns when they join"; line 308 says a tier buys sight up the chain as well as new ground; the quiz drops "out of ten" and "of the hundred points".

**Build order (S small, M medium, L large):**
1. Funnel truth. S. `funnel/buy.html`, quiz, landing sources. Gate: `tests/funnel.js` plus cases in `check.py --objections` for "50 patterns", "of the hundred points", "out of ten", "rate of new ground and nothing else".
2. Verdicts off a blank profile. S. `ui/ui.js`, `ui/release.js` line 1065. Gate: `tools/monitor.js` fails if a blank profile prints "Heaviest", "Most shut" or "0.0".
3. Privacy line to door and login. S. `ui/login.js`, `ui/account.js` line 127. Gate: `tests/functional.js` asserts it at 1600 and 390.
4. Login A, Start as guest. M. `ui/login.js`, `ui/onboard.js`. Gate: `tests/funnel.js` counts Start, create account and close; `tests/boot.js` stays green.
5. Unread screen, five doors. M. `ui/summary.js`, Field stage. Gate: `monitor.js`, plus a design-gate case for doors above the fold at 390 by 844.
6. Lock copy through `planNextSees` (`plan.js` line 495). S to M. Gate: voice check bans the words above; design gate allows three or fewer sealed marks on the first Field screen.
7. Demo agreement. S. Gate: the demo profile reads the same band on Field, Story and Summary.

## 6. RANKED RECOMMENDATIONS

1. **Login A first.** S to M. Redesign (a skin cannot change the first screen). Moves Marcus, Renata, Whitney, Marta, Trey.
2. **Unread screen, no verdicts.** M. Redesign. Moves all eight, most Marta and Whitney.
3. **Funnel told true.** S. Reskin of words. Moves Nils, Trey, Camille, every referral.
4. **One lock mark per surface, ink, never red or grey.** S to M. Reskin. Moves Marcus, Renata, Nils, Whitney.
5. **Free figure, no number.** M to L. Redesign. Moves Marcus, Sofia, Whitney, Camille.
6. **Privacy line, proof line at body size, fifth door.** S. Reskin. Moves Nils, Camille, Sofia.
7. **Day 2 line with a real compare behind it.** M. Redesign. Moves Marcus, Renata, retention.
8. **Measure it:** count Start, Create account and close at the login, then first stories committed. S. Before any paid reach.

**Arithmetic.** Nothing is measured on real people. What would have to be true: at least half of arrivals commit a first story. A skin does not move willingness to pay. It moves how many reach a reading, and the reading is the ad.

## 7. ONE QUESTION

None. Decisions: sentence case wins over the Start Case line. Source OS keeps the owner's hex and he sees the 1.36 to 1 figure beside it once. Levels 1 to 3 are not marketed to. Levels 4 and 5 are reached only through the first release.
