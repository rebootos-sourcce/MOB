# Pass 2: narrative director (June Okonkwo-Lund), round PJ

I read all eleven other pass 1 reports. I ran `check.py --line` on every new line below.

## 1. AGREEMENTS

- **Cut the words, not just add a timer.** Creative, UI and UX, Game, Marketing, Brand, Animation and I all say the card failed because it is a page of text. Strongest signal.
- **The voice plays once, at the release.** Animation, Brand, Creative, Game, Marketing, UI and UX and I. Heard on the slider and again at the release, it is a second hearing by the fortieth view.
- **No draft words on screen.** Animation, Game, Innovation, Systems and I. All ten phrases are `confirmed:false`, so the gate refuses them.
- **"It is okay" and "making us sick" go.** Brand, Marketing and I. One is a verdict. One is a disease claim.
- **An unanswered question is never "nothing".** Art, UI and UX and I.
- **A timer never crosses a decision or the story box.** All twelve.
- **Distress is a ship blocker.** Innovation, Systems (a `distress` pause reason), Art (flagged it), Technical and I.
- **Pause must be a visible control.** Technical, Animation, Game, Creative, Systems, UI and UX and I.
- **Hide Developer options.** Sales, Marketing, Systems and I.

## 2. DISAGREEMENTS

1. **Length before the first decision.** Brand 22.7 s, Game under 25, Animation 27.8, me 80, UI and UX 70. I take **31.5 s, six telling slides**. Reason: the 80 and 70 hold the throat test, which moves out (item 4). First cut if pass 3 shows drop off: slide 5, then 2. Never 1 or 3.
2. **Dwell formula.** Eight formulas, all within a second of each other at 8 words. I take **1.5 s + 0.35 s per word**, floor 3.0, cap 9.0, round up to 0.5. The 1.5 s holds the 0.38 s entrance. A slide that animates longer than its dwell takes the longer number.
3. **Voice.** Systems and Innovation want it on the slider. I side with the release only. The slider must be complete silent, and a voice that sets the clock makes silence the thinner version. `confirmed:false` blocks only the words. The phrase starts are measured and reliable, so cues run today and the screen shows the shipped `REL_WELCOME` lines until he confirms.
4. **Signal test.** UI and UX, Game and my pass 1 keep it before the release. I move it out. His voice already opens with feet on the floor and a deep breath. Two body scripts back to back is the overrun Creative measured. It becomes a replay chapter in the profile. **Hold as the answer is rejected** (Innovation's idea 5): hold already means pause. Answer with three ring chips.
5. **Tutorial folds in.** Yes, after the release, as Reel B below. Animation, UI and UX, Game and I agree.
6. **First line.** The ruled line opens. Login A already carries "There is more running you than you can see." (`login-a.html`, `HEAD.A`), so the slider must not say it twice. "This is you" goes: the figure is not the avatar yet, so it is a claim the picture does not make.
7. **Brand's not-list** ("Not a coach. Not a guide. Not a friend. An instrument."). Declined. Three negations in a row is the antithesis pattern, and it plants the coach idea in a person who never had it.
8. **Brand's "6.1 out of 10".** Refused. A reading is not a score, and never a count against a total. The gift counter is the one ruled exception.
9. **Marketing's example reading.** Declined: Innovation is right that a sample is someone else's body. The object beside "Every part is open" is the seven seat names, drawn once.
10. **"Keep this".** The ruled login row says "Create account". One word per concept, so the button says that.
11. **Progress mark.** Hairline segments, no digits. A ring around the figure competes with the centrepiece.
12. **Loop on Reel A.** Animation, Art and UI and UX draw it on slide 5. I move it to Reel B. Game's reason: the loop lights only for an act done, and a stranger has done none.
13. **Reduced motion lengthens dwell** (Art, Creative, Marketing, Technical say x1.4 to 1.5). I side with Animation: same timer. Pause stays visible, and the person asked for less movement, not more waiting.
14. **Palette.** Art's call. One copy rule: a seat hue never carries a word.

## 3. WHAT I MISSED

- **Current copy has three more defects.** "Two minutes" is false (about four). "Nothing here grades you" sits beside a printed score out of 100. "Nothing to fill in" precedes a disabled Next. (UI and UX, Brand.)
- **The read can be empty.** Sales measured it: "I keep taking care of everybody else." returns zero hits. The Write step needs a refusal.
- **Pass 1 cut "And release" at 27.13 s** only because of the signal test. With the test gone it is the hand over into the stem and stays.
- **Silent must be whole.** Opus in WebM may not play on older Safari (Technical). If so, the Sound control hides and nothing else changes.
- **Guest is the road most strangers take** (Marketing, Sales). It needs a definition.
- **A figure labelled "avatar" too early** is a claim (Brand). The word waits for the first changed seat.

## 4. THE PROPOSAL: THE FINAL SCRIPT

Rules for every string. Sentence case. No digits on the slides. At most 12 words (the ruled line is 13, whitelisted by name). Text enters in one block on 380 ms `cubic-bezier(.22,1,.36,1)` with a 10 px rise, leaves on 220 ms. Never per letter or per word: a typewriter runs near 6 Hz, the band to avoid beside the release's 6 Hz beat. Hero 32 px at 1600, 22 px at 390, weight 400, line 1.2, at most 34 characters a line (24 at 390). Ink on black, never a hue.

**Reel A, silent, on the black stage.** Words, then dwell = 1.5 + 0.35 x words, rounded up.

| # | Exact line | Words | Dwell s |
|---|---|---|---|
| 1 | Welcome to a neurosomatic experience. | 5 | 3.5 |
| 2 | Neuro is your nerves. Somatic is your body. | 8 | 4.5 |
| 3 | Awareness and intuition is a tool we use to turn your senses inward. | 13 | 6.5 |
| 4 | This is a mirror. It shows what is running you. | 10 | 5.0 |
| 5 | Every part is open. If it does not know, it says so. | 12 | 6.0 |
| 6 | Write one true thing. It shows where it sits in your body. | 12 | 6.0 |

Total 31.5 s. Line 1 is whitelisted against "Welcome to", because it is ruled. Slide 5 draws the seven seat names beside the line. Slide 6 hands to the gate with a 220 ms exit and no pause.

**Gate (no timer, never advances).**
- Hero: **Pick your starting point.** (Instruction.) The twelve tiles are the ruled names, one or two words each. A definition shows on hover or focus, one line, which I will write for each of the twelve.
- Under the tiles: **About four minutes.** (Reading.) Print the measured median, not a guess.
- Corner: **Leave**. It goes to the unread Field and writes nothing. On slides 1 to 6 the corner word is **Skip** and it lands on this gate.

**Write (no timer).**
- Hero: **I am releasing believing, thinking, feeling, behaving and acting that I am ...** (ruled stem, 12 words)
- Instruction: **Finish it in your own words.**
- Button, shown after five words: **Release**.
- Empty read, once, words kept: **Nothing in that matched a pattern. Name how it felt.**
- Distress frames are the pass 1 text, unchanged. They never auto advance and carry no sound, points, release or upsell. The check runs when Release is pressed, before the voice starts. A clinician signs it.

**Release opening.** Voice 0 to 39.95 s only (take 1, the ruled stem). Take 2 waits for run two. Silent track: the same cue table with the 4.5 s lead in removed. Each line enters 0.15 s before its phrase start:
- 4.88 s: `REL_WELCOME[0]`. 8.73 s: `[1]`. 16.55 s: `[2]`. 22.58 s: `[3]`.
- 11.61 to 14.90 s: nothing. Silence is a copy decision.
- 29.89 s: the stem, with the person's own words landing under it at 39.95 s.
- Stop control: **Stop**. It shows **Stopped.** then **Look at the room.** for 5 s, two elements, then the exit.
- When he confirms the ten phrases, line 1 becomes "Place your feet on the floor." If not, the shipped line stays.

**Controls.** Pause and Resume (one control, ring, 44 px). State label **Paused**. Sound is **Sound**, off by default.

**Reel B, after the release and the reading.** Same dwell rule, built from the person's words.

| # | Exact line | Words | Dwell s |
|---|---|---|---|
| B1 | This is your avatar. | 4 | 3.0 |
| B2 | You wrote: {first 12 words}. | 14 | 6.5 |
| B3 | {Word} sits at your {seat}. | 5 | 3.5 |
| B4 | Discover. Play. Flow. Embody. Then round again. | 7 | 5.0 |
| B5 | Your first 100 patterns are ready. Everything stays visible while you use them. | 13 | 6.5 |

- B4 draws a closed circle, one station lit per second, and never a list.
- B5 follows the sales line. The counter on the release stats reads 88.
- If nothing matched, B3 becomes: **Nothing in that matched a pattern. Name how it felt.**
- Account gate (no timer): hero **Keep this.** Menu **Create account** and **Later**, equal weight. The ticked box: **I am 18 or older. I agree to the Terms and the Privacy policy.**

**Login.** Cut both eyebrows. Hide Developer options unless `dev=1`. Guest tooltip: **Use this device without an account. Clearing the browser clears it.**

**Agree first.** Animation: cue table and curves. Systems: `obAct` derives position, so Skip and Leave store nothing. Technical: the dwell clock. Legal: "Nobody reads this but you" is true only before an account exists.

## 5. REVISED GRADE

GRADE: 37/100 (was 40). Three more shipped defects found (section 3) against none removed. The script above is graded in pass 3.

## 6. TOP 5

1. **The six line script and the dwell rule.** S. All ICPs. Derek gets a mirror claim and an open table. Angela gets the ruled line.
2. **Distress detector and frames before Write ships.** L. James most, then Angela.
3. **Release opening on the cue table, confirmed text only.** M. Angela, James.
4. **Reel B from the person's words, loop closing there.** M. Derek, Angela.
5. **Controls and login strings, sentence case, Guest defined.** S. James, Derek.

## 7. ONE QUESTION

None. Decision: the first run needs no answer from him. If he never confirms the phrases, the shipped lines show and the build stays correct.
