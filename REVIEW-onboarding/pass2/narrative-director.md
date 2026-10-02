# Pass 2: narrative director (June Okonkwo-Lund), round PJ

I read all eleven other pass 1 reports and ran `check.py --line` on every new line.

## 1. AGREEMENTS

- **Cut words, not just add a timer.** Creative, UI and UX, Game, Marketing, Brand, Animation and I. The card failed because it is a page of text. Strongest signal.
- **Voice plays once, at the release.** Animation, Brand, Creative, Game, Marketing, UI and UX, me.
- **No draft words on screen.** Animation, Game, Innovation, Systems, me. All ten phrases are `confirmed:false`.
- **"It is okay" and "making us sick" go.** Brand, Marketing, me.
- **Unanswered is never "nothing".** Art, UI and UX, me.
- **No timer crosses a decision or the story box.** All twelve.
- **Distress blocks shipping.** Innovation, Systems, Technical, Art, me.
- **Pause is a visible control.** Technical, Animation, Game, Creative, Systems, UI and UX, me.

## 2. DISAGREEMENTS

1. **Length.** Brand 22.7 s, Animation 27.8, me 80, UI and UX 70. I take **31.5 s, six slides**. The 70 and 80 held the throat test, which moves out (4). Cut slide 5 first, then 2. Never 1 or 3.
2. **Dwell.** Eight formulas, within a second of each other at 8 words. I take **1.5 s + 0.35 s a word**, floor 3.0, cap 9.0, round up to 0.5. The 1.5 s holds the entrance. A longer animation wins.
3. **Voice.** Systems and Innovation put it on the slider. I side with the release only. The slider must be whole in silence. `confirmed:false` blocks the words, not the phrase starts, which are measured. Cues run now. Shipped `REL_WELCOME` shows until he confirms.
4. **Signal test.** UI and UX, Game and my pass 1 keep it first. I move it to a profile replay. His voice already opens with feet and a breath, and two body scripts back to back overrun (Creative). **Hold as the answer is rejected.** Hold means pause. Use three ring chips.
5. **Tutorial folds in** after the release as Reel B. Animation, UI and UX, Game, me.
6. **First line.** The ruled line opens. Login A already says "There is more running you than you can see." (`login-a.html`), so the slider must not. "This is you" goes: the figure is not the avatar yet.
7. **Brand's not-list.** Declined. Three negations plant a coach in a person who never had one.
8. **Brand's "6.1 out of 10".** Refused. Never a count against a total. The gift counter is the one ruled exception.
9. **Marketing's example reading.** Declined (Innovation is right: it is someone else's body). The object beside "Every part is open" is the seven seat names.
10. **"Keep this" as button.** The ruled login row says "Create account". One word per concept.
11. **Progress.** Hairline segments, no digits. A ring competes with the figure.
12. **Loop.** Animation, Art and UI and UX draw it on slide 5. It moves to Reel B (Game's reason): it lights only for an act done.
13. **Reduced motion.** Art, Creative, Marketing and Technical lengthen dwell. I side with Animation: same timer, visible pause.
14. **Palette.** Art's call. A seat hue never carries a word.

## 3. WHAT I MISSED

- Three more shipped defects: "Two minutes" (it is about four), "Nothing here grades you" beside a printed score, "Nothing to fill in" before a disabled Next.
- The read can be empty. Sales: "I keep taking care of everybody else." returns zero hits. Write needs a refusal.
- I cut "And release" at 27.13 s only for the throat test. It is the hand over into the stem, so it stays.
- Opus in WebM may fail on older Safari (Technical). Sound hides, nothing else changes.
- "Avatar" too early is a claim (Brand). It waits for the first changed seat.

## 4. THE PROPOSAL: THE FINAL SCRIPT

Rules. Sentence case. No digits on slides. 12 words at most (the ruled line is 13, whitelisted by name). Text enters as one block, 380 ms `cubic-bezier(.22,1,.36,1)`, 10 px rise, leaves 220 ms. Never per letter or word: a typewriter runs near the release's 6 Hz beat. Hero 32 px at 1600, 22 px at 390, weight 400, line 1.2, 34 characters a line (24 at 390). Ink on black.

**Reel A, silent.** Dwell = 1.5 + 0.35 x words, rounded up.

| # | Exact line | Words | Dwell s |
|---|---|---|---|
| 1 | Welcome to a neurosomatic experience. | 5 | 3.5 |
| 2 | Neuro is your nerves. Somatic is your body. | 8 | 4.5 |
| 3 | Awareness and intuition is a tool we use to turn your senses inward. | 13 | 6.5 |
| 4 | This is a mirror. It shows what is running you. | 10 | 5.0 |
| 5 | Every part is open. If it does not know, it says so. | 12 | 6.0 |
| 6 | Write one true thing. It shows where it sits in your body. | 12 | 6.0 |

Total 31.5 s. Line 1 is whitelisted against "Welcome to": it is ruled. Slide 5 draws the seven seat names beside it.

**Gate, no timer.**
- Hero: **Pick your starting point.** The twelve tiles are the ruled names. I write the one line definitions, shown on hover or focus.
- Under: **About four minutes.** Print the measured median.
- Corner: **Skip** on slides 1 to 6, landing here. **Leave** here, to the unread Field, writing nothing.

**Write, no timer.**
- Hero: **I am releasing believing, thinking, feeling, behaving and acting that I am ...** (ruled, 12 words)
- Instruction: **Finish it in your own words.**
- Button after five words: **Release**.
- Empty read, once, words kept: **Nothing in that matched a pattern. Name how it felt.**
- Distress frames are pass 1 text. No timer, sound, points, release or upsell. The check runs on Release, before the voice. A clinician signs it.

**Release opening.** Voice 0 to 39.95 s only. Take 2 waits for run two. Silent track: the same cues minus the 4.5 s lead in. Each line enters 0.15 s early.
- 4.88, 8.73, 16.55, 22.58 s: `REL_WELCOME` lines one to four.
- 11.61 to 14.90 s: nothing. Silence is a copy decision.
- 29.89 s: the stem. The person's words land under it at 39.95 s.
- Stop: **Stop**, then **Stopped.** and **Look at the room.** for 5 s.
- Once he confirms, line one reads "Place your feet on the floor."

**Controls.** One ring: **Pause**, then **Resume**. State label: **Paused**. **Sound**, off.

**Reel B, after the reading.**

| # | Exact line | Words | Dwell s |
|---|---|---|---|
| B1 | This is your avatar. | 4 | 3.0 |
| B2 | You wrote: {first 12 words}. | 14 | 6.5 |
| B3 | {Word} sits at your {seat}. | 5 | 3.5 |
| B4 | Discover. Play. Flow. Embody. Then round again. | 7 | 5.0 |
| B5 | Your first 100 patterns are ready. Everything stays visible while you use them. | 13 | 6.5 |

- B4 draws a closed circle, one station a second.
- B3 with no match: the empty read line above.
- Account gate, no timer: **Keep this.** Menu: **Create account**, **Later**. Box: **I am 18 or older. I agree to the Terms and the Privacy policy.**

**Login.** Cut both eyebrows. Guest tooltip: **Use this device without an account. Clearing the browser clears it.**

**Agree first.** Animation: cues and curves. Systems: `obAct` derives position, so Skip and Leave store nothing. Technical: the clock. Legal: "Nobody reads this but you" holds only before an account.

## 5. REVISED GRADE

GRADE: 37/100 (was 40). Three more defects found, none removed. The new script is graded in pass 3.

## 6. TOP 5

1. **Six line script and dwell rule.** S. Derek gets an open mirror, Angela the ruled line.
2. **Distress detector and frames before Write ships.** L. James, Angela.
3. **Release opening on the cue table, confirmed text only.** M. Angela, James.
4. **Reel B from the person's words, loop closing there.** M. Derek, Angela.
5. **Controls and login strings, Guest defined.** S. James, Derek.

## 7. ONE QUESTION

None. If he never confirms the phrases, the shipped lines show and the build stays correct.
