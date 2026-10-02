# Pass 3: marketing director (Theo Lindqvist), onboarding, round PJ

Levels are the buyer grid levels in `BUYERS.md`. The panel is simulated, not measured.

## 1. The proposal as I understand it

One black room: the standing figure, a 26 second silent film of five slides, one decision (twelve starting points), one written sentence, a read back, a 12 line release with his voice, then the Field. The account comes after the reading. 

What the merge lost or misread:
- **The seeded read can mislead.** The starting point seeds the sentence, so a person who typed nothing useful still sees a lit seat. If the Mirror says "You wrote" over a place they chose, it is a claim with the wrong object.
- **"Check any row" has no door.** Slide 4 says the tables are open and nothing opens one.
- **The share card fell out.** Trey and Whitney are the free referral channel and have nothing to post.
- **A gift counter falling from 100 toward 88 can read as stock running out**, which is scarcity.

## 2. The ICP room

**Marcus, founder, level 7.** Sees a still figure. Stays through the proof row: a real engine number is what he buys. Leaves if slide 3 sounds like a promise. "Show me the table behind that row."

**Whitney, phone only, level 5.** Sees large text, no card. Taps right to speed up, picks Fatigue out. Stays through the pick; the empty read is where she could go. She wants something to send her sister. "Pretty. Can I save it?"

**Nils, design skeptic, level 4.** Sees a wellness-looking black screen. Taps Skip at slide 2, lands on the gate. Leaves at "turn your senses inward" unless the slide 4 row is real. "Neurosomatic is a made up word. Prove something."

**Camille, somatic practitioner, level 6.** Takes Guest. Stays for "112 addresses", since yes or no at an address is her own method. Leaves at Keep this if the data line is vague. "Who can see this, and where does it go?"

**Marta, acute distress, 02:00.** Sees a still figure, no price, no clock on her. If her sentence trips the distress hook she gets the plain stop frame and nothing is sold. That is the whole job. She leaves if the empty read says "Nothing matched" about her own words. "Please do not tell me it is nothing."

**Renata, operator, level 7, the main target.** Reads a line in 3 seconds, stays for the proof row, picks a starting point, writes one sentence, gets an address in about 75 seconds. Leaves if the read is empty. "That is a real instrument. Where is the row?"

**Trey, quiz tourist.** Taps through in 10 seconds, types four words, gets a reading, finds no card to post. Leaves at Keep this. "Cool. Where is my result card?"

**Sofia, loves the open tables.** Stops at slide 4, holds to pause, taps the row. If nothing opens she feels baited. If it opens she stays an hour. "Every table is readable. Show me."

## 3. Unified quality: 71/100

One room, one clock, one decision, no urgency. Three gaps left:
1. **Proof without a door.** The strongest asset is a picture, not a link.
2. **The first reading's source is hidden.** Seeded and written reads look the same.
3. **Nothing to carry out of the room.** No 1:1 reading card, so the free channel is closed.

## 4. Final grade

GRADE: 58/100 (pass 1 was 38, pass 2 was 34)

This grades the NEW proposal; the earlier two graded the old flow. Up: first value in about 75 seconds (was never), phone fit, acute arrival, proof now in the film, restraint kept at 9. Held down: no door on the proof, a possibly mis-sourced read, no share card, the data line unconfirmed, nothing measured. Assumed, unmeasured: 30 to 54 of 100 reach a first reading.

## 5. My part of the build spec

**Slides** (dwell = max(3.0, 1.0 + words / 2.5) in seconds, up to the next 0.5). Lead-in 1.0 s still.

| # | Dwell | Line |
|---|---|---|
| 1 | 3.0 | Welcome to a neurosomatic experience. |
| 2 | 6.5 | Awareness and intuition is a tool we use to turn your senses inward. |
| 3 | 5.5 | It reads your words. Each points to a place in your body. |
| 4 | 5.5 | Every table it reads is open. Check any row. |
| 5 | 4.5 | Discover. Play. Flow. Embody. Then round again. |

That is 25.0 s plus the lead-in, the 26 s ruled. Slide 2 is 13 words, so whitelist it.

**Slide 4 proof row.** One real row read from the engine at run time, never typed. Label "An example", 11 px, 70 percent ink. Number 28 px at 390, 44 px at 1600, weight 300, tabular figures (digits of equal width). Under it a 44 px ring target, "Open the table". Tap pauses the clock and opens the read-only table view; Back returns to slide 4. If that view cannot be reached before login, DROP "Check any row" and say "Every table it reads is open inside." No claim without a door.

**Mirror line at commit, within 6 s, no digits.**
- Matched words: "{their word} sits at your {address}. You wrote: {first 12 words}."
- Seeded only: "You chose {starting point}. That sits at your {address}. Add a sentence to read yours."
Never "You wrote" over a seeded place.

**Empty read.** Lead's value: "Nothing in that matched a pattern. Name how it felt." My value: "Not quite. Which part sat heaviest?" with the three feeling chips. "Nothing matched" is a verdict on her own words. The lead's line is acceptable only with chips beneath it.

**Gift counter.** Engine number only, neutral ink role, no accent, never red or amber at any count, updates at most twice a second. Said once, 4 s caption on the story screen: "100 patterns are open to you. Everything stays visible while you use them." No "left" or countdown word. Show "N used of 100" if Art agrees, since a falling number reads as stock. No padlock draws while `inGift` (the engine flag for the free gift period) is true.

**Keep this and Not now.** Two ring controls, equal weight, 48 px. Line above: "Your story is saved to your account. Your name and birth data are not." Print it only after Systems confirms it is true. Guest gloss: "Try it on this device. Clearing the browser clears it."

**Banned in the first run (add to the voice check):** okay, grades, sick, free, trial, limited, left, hurry, "Two minutes", "Nothing to fill in".

**Share card.** After the first reading, one quiet ring "Save this card": 1080 by 1080 on the `#06060a` stage with lit seat, address, the person's first 12 words. No username, birth data or score. "Atuned" at 11 px, 40 percent ink. Drawn on a canvas, nothing sent.

**Funnel gates, local flags only.** Record seconds to first Mirror, starting point chosen, Skip against Keep this against Not now, proof row tapped. Fail if median time to first Mirror passes 90 s, or a seeded start shows an empty read.

**Where I differ from the lead:** the empty read only (both values above).

## 6. Ranked recommendations

1. **Source-true Mirror line, never an empty read.** S, reskin. Moves Renata, Nils, Marta, Marcus.
2. **Proof row gets a door, or the claim is dropped.** M, redesign of slide 4. Moves Sofia, Nils, Marcus, Camille.
3. **Honour the gift in code, neutral counter, no padlock during the gift.** M, engine plus reskin. Moves Renata, Camille, Marta.
4. **Keep this and Not now at equal weight, box there only, one confirmed data line, honest push failure.** S to M, reskin. Moves Camille, Renata.
5. **1:1 share card after the first reading.** M, new build. Moves Trey, Whitney, Renata.
6. **Guest gloss, Developer options off the public door.** S, reskin. Moves Whitney, Marta, Nils.
7. **Local funnel flags and the 90 second gate.** S, new build. Moves all.
8. **Distress frame sells nothing: no counter, Keep this, tier or points.** M, redesign, ship blocker. Moves Marta.

## 7. One question for the owner

None. My decision: the proof row opens a table, the Mirror names its source, the empty read uses my line with chips. Reason: a level 6 or 7 buyer is moved by a row they can check.
