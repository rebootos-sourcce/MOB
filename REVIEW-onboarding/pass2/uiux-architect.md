# Pass 2: UI and UX architect (Dani Sorensen), round PJ

I read all eleven other pass 1 reports.

## 1. AGREEMENTS

- **Black stage, no card, no dimmed app.** Art, Brand, Creative, Kai (animation), Innovation, Technical, me.
- **The clock yields to the hand.** Game, Creative, Marketing, Innovation, Kai, Technical, me. Telling slides run on a timer. A slide that asks for an act has none.
- **The first release is the real onboarding.** Game, Innovation, Systems, Narrative, Kai, me. Today no stranger reaches one.
- **Skip lands on the starting point, not the app.** Nine seats.
- **A timeout stores "unanswered", never "Nothing".** Art, Narrative, Game, me.
- **Distress detection blocks shipping.** Narrative measured it: "I do not want to be here anymore" reads as nothing, "I am dying of embarrassment" reads Sad 8.8. A word list misfires both ways.
- **Reduced motion keeps the timer and shows a pause control.** Kai, Technical, Systems, Game, Narrative, me.

## 2. DISAGREEMENTS (my side, and why)

- **Progress ring (Art, Brand, Creative) vs hairline (Kai, Marketing, Technical, me).** Hairline. A ring already means the loop on slide 5 and the twelve at the gate. A third ring meaning time breaks one word per concept and fights the figure.
- **Voice drives the slider (Innovation, Systems, Narrative) vs silent (the rest, me).** Silent. His ruling opens the release on his voice, so a slider voice means hearing it twice in four minutes. Sound is off by default, so the slider must work whole without it.
- **`confirmed:false` on every phrase.** Start times are measured, words are a draft. Cues may trigger visuals. No printed word comes from the draft. Systems' gate refusing unconfirmed lines is right.
- **Signal test in the slider (Narrative, Art, my pass 1) vs after (Marketing, Sales, Creative).** I change to after. Creative is right: feet and breath are in the release opening too, so it is two body exercises back to back. It becomes an optional door after the first reading.
- **Hold to answer (Innovation).** No. Hold already means pause. One gesture cannot mean both. Chips stay.
- **Skip at 12 to 14 px (Art, Brand, Creative, Narrative).** No. My floor is 16. Make it quiet with colour, not size. James is 57.
- **Length before the decision: 18 to 24 s (Marketing, Sales, Brand, Creative), 80 s (Narrative), 70 s (me).** I take 28 s, five slides. The ruled line alone is 22 words, about 9 s.
- **"Avatar" on slide 5 (me) vs Brand.** I concede. A label arrives with its evidence. First printed after the first release.

## 3. WHAT I MISSED

- The faded sheet still takes clicks for 300 ms (Kai, Systems).
- `OB.felt`, the signal answer, is thrown away (Systems). Stored and read, or it is theatre.
- The read can come back empty (Sales: "I keep taking care of everybody else." gives 0 hits). My path assumed a reading.
- Derive position, store no step (Systems `obAct`). This fixes my Esc finding.
- My own trap: "clock stops on any focus" freezes a mouse user who tapped Back. Only keyboard focus (`:focus-visible`) pauses.

## 4. THE PROPOSAL, TOGETHER

**Path.** Login A, 520 ms transit, slider (28 s), gate, tile, release opening, stem box, 12 lines, settle, reading, aftercare, Keep this, Field.

**Slider.** Dwell = 1.0 s + words / 2.5, floor 3 s, cap 9 s. Twelve words a slide at most.

1. "This is you." Seven seats land root to crown, 90 ms apart. 3.5 s.
2. "Welcome to a neurosomatic experience." then at +1.4 s "Awareness and intuition is a tool we use to turn your senses inward." Ruled. 9 s.
3. "You write one true thing. It shows where it sits in your body." 6.5 s.
4. "Then you let it go." 3 s.
5. "Discover. Play. Flow. Embody. Then again." A circle, 900 ms a station, closes. 5 s.

The login carries "There is more running you than you can see." Slide 1 answers it.

**Gate.** No clock. "What brought you here?" Twelve tiles, 112 by 64, 8 px gap, 3 across at 390, 4 across at 1600, same order, 16 px labels, radius `--r-s` 11. The ring of twelve cannot hold 16 px labels at 390. That is 14 controls with Back and the app exit, over my 12. I accept it: twelve plain words, recognised not weighed. Upper right: slot "patterns", value 100, then 88. Under the tiles: "About N minutes. Stop any time." N is computed from the cue table, never typed. "Two minutes" was untrue.

**Controls.** Ring buttons, 44 px: Back, Next, Sound. Pause 56. Skip is text, 16 px, top right, 44 target. Hold 180 ms pauses. A tap under 250 ms latches. Pause keeps its label and `aria-pressed` carries state. Pause reasons (Systems): hold, hidden tab, keyboard focus, typing, user, distress. The clock is one frame tick with a delta, not `animationend`, which never fires under reduced motion (Technical).

**Tokens.**
- Ground: the login's `#06060a`, one token.
- Ink `#EFEDE8`, sub at 70 percent, one accent for the one live control. Seat hues only on the figure and things naming a seat. State never uses a seat hue.
- Hairline: 2 px, 4 px gaps, fill ink 85 percent, track 40 percent (should clear 3 to 1; Art to measure).
- Type: 16 (labels, controls, Skip), 18 (sub), 30 at 390 and 40 at 1600 (hero, weight 300, line 1.2). Art may raise 40 to 52, never lower 16.
- Motion: text in 420 ms `cubic-bezier(.22,1,.36,1)` with 8 px rise. Out 220 ms `cubic-bezier(.4,0,1,1)`. Land 320 ms. Nothing flickers at 3 to 30 Hz (Kai). Verbs: Still, Breathe, Travel, Land.
- Symbols: ring is loop or address. Time is a line. Icons are rings.
- Copy: sentence case, no digits except the counter, button word is the Story tab's "Commit".

**After the gate.**
- Tile tap fills a ring 600 ms and lights that seat.
- Release opens on his voice. Silent: same cue table, ruled captions, a "Hear it" ring, a quiet "Skip to the stem". Honest cost 50 s.
- Stem box and Commit have no clock. The sniffer (the code that reads a story for distress) must pass before the 12 lines. With no permanent safety line it is the only guard.
- Settle shows time left and a way to finish early.
- Aftercare, same grammar, 5 s a beat, from their own data. First print of "your avatar".
- Keep this: one username or email field, optional recovery email, unticked agreement box, Keep this and Not now at equal weight. Never on Guest, never on frame one.
- The Field opens with the released address changed and no padlocks. The signal test is a door there and it writes something. Day two door: "Read the same place again."

**Must agree first.** Art: stage token, hero size, contrast, and the quieter canon seat palette. I side with canon for the stage: it changes saturation, not hue, so place meaning holds. Narrative: the five lines and the empty read copy. Systems: `obAct`, pause reasons, starting point field. Game: which act lights which loop quarter. Kai: cue table. Technical: Field loop paused while open.

## 5. REVISED GRADE

GRADE: 39/100 (was 42). Down three: honest controls 5 to 4 (the faded sheet eats clicks, "Unlock all sight" shows), flow 4 to 3 (the answer is discarded), first four seconds 5 to 4. The proposal predicts about 76 unbuilt (was 78), held back by the distress path and the empty read.

## 6. TOP 5

1. **Stage, clock and the gate (L).** Moves Angela, Marcus, Diane, Derek, James.
2. **Distress hook before the first story ships (L).** Moves James, Angela, every level 1 to 3 arrival.
3. **First run writes: starting point, stem, entry, reading (M).** Derived position. The starting point's feeling word is added before the read. Moves Angela, Derek, Sofia.
4. **Aftercare replaces the five card tutorial (M).** Kept as profile replay. Moves Sofia, Marcus, Derek.
5. **Honest door (S).** Developer options hidden. Guest defined in a visible line, "Guest keeps everything on this device." Moves James, Angela, Diane.

## 7. QUESTION FOR THE OWNER

None. Decision: slider silent, voice opens the release, no printed word from the unconfirmed draft. Reason: his own ruling, and no double hearing.
