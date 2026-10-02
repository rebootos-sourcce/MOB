# Pass 2: UI and UX architect (Dani Sorensen), round PJ

I read all eleven other pass 1 reports. Terms are explained where they first appear.

## 1. AGREEMENTS

- **Full black stage, no card, no dimmed app.** Art, Brand, Creative, Kai (animation), Innovation, Technical, me. Confirmed. Technical adds the cost reason: the Field redraws under the sheet for nothing.
- **The clock yields to the hand.** Game, Creative, Marketing, Innovation, Kai, Technical, me. Slides that tell run on a timer. A slide that asks for an act has no timer.
- **The first release is the real onboarding.** Game, Innovation, Systems, Narrative, Kai, me. Today no stranger reaches one (`DEV_PLAY_TUTORIAL` is false, and the onboarding writes nothing).
- **Skip lands on the starting point, never the app.** Nine seats. Confirmed.
- **Timed out is not "Nothing".** Art, Narrative, Game, me. A timeout stores "unanswered". Nothing is a real answer and must stay one.
- **Distress detection is a ship blocker.** Narrative measured it: "I do not want to be here anymore" reads as nothing, and "I am dying of embarrassment" reads Sad 8.8. So a word list will misfire both ways. Systems offers a `distress` pause reason as the hook.
- **Developer options off the public door.** Marketing, Narrative, Sales, Systems. Sales found "Unlock all sight" on frame one.
- **"It is okay" and "making us sick" go.** Brand, Narrative, Marketing, Creative, brief.
- **Reduced motion keeps the timer and shows a pause control.** Kai, Technical, Systems, Game, Narrative, me.

## 2. DISAGREEMENTS (my side, and why)

**Progress as a ring of arcs (Art, Brand, Creative) vs a hairline (Kai, Marketing, Technical, me).** I take the hairline. The ring already means two things on this stage: the loop circle on slide 5 and the ring of twelve at the gate. A third ring meaning "time" breaks one word per concept, and it competes with the figure in the squint test. Hairline: five segments across the top, 2 px high, 4 px gaps.

**Voice drives the slider (Innovation idea 2, Systems 3, Narrative 3) vs silent slider (Kai, Art, Brand, Creative, Marketing, Game, me).** I take silent. His rule is that the release opens on his voice. Playing it first means a person hears it twice in four minutes. And with sound off by default, most strangers hear nothing from the slider anyway, so it must be whole in silence.

**Voice and `confirmed:false`.** The phrase start times are measured. The words are an offline draft. So cues may trigger visuals, but no printed word comes from the draft. Printed lines are his ruled copy only. Systems' gate that refuses an unconfirmed line on screen is right.

**Signal test inside the slider (Narrative, Art, my pass 1) vs after (Marketing, Sales, Creative).** I change my mind and take after. Creative is right: feet on the floor and breathing is the release opening too, so the test would be two body exercises back to back, about 80 s more before the person does the one decision. It leaves the first run and becomes an optional door after the first reading.

**Hold to answer (Innovation idea 5).** No. Hold already means pause on this stage. One gesture cannot mean both. Innovation also bets a third of it is unusable. Chips stay: Yes, No, Nothing.

**Skip at 12 to 14 px (Art, Brand, Creative, Narrative).** No. My floor is 16 px. Make it quiet with colour, not size. James is 57.

**Sample reading as proof (Marketing beats 2 and 3).** No. Innovation's prior art is right: a person does not believe someone else's result is theirs. The proof for Nils is their own reading with its cause shown, after the release.

**Total length before the decision: 18 to 24 s (Marketing, Sales, Brand, Creative) vs 80 s (Narrative) vs my 70 s.** I take 28 s, five slides. The ruled somatic line alone is 22 words, about 9 s at slow reading pace. Under 24 s means cutting it or the figure beat.

**Avatar word on slide 5 (my pass 1) vs Brand's "not before the first reading".** I concede. A label arrives with its evidence. The figure stands in the middle of the loop with no word. "This is your avatar" is first printed after the first release, when a seat has moved.

**"Come in" counts and a 60 or 90 second first reading (Marketing, Sales).** Not reachable. The voice opening is 49.7 s alone. I fight for time to first felt change, not first reading: tapping a starting point lights that seat at about second 30.

## 3. WHAT I MISSED

- **The invisible sheet still takes clicks for 300 ms** after it fades (Kai, Systems). A control that eats taps with nothing visible breaks my honest controls floor.
- **`OB.felt` is thrown away** (Systems, Marketing). The signal answer is read by nothing. Whatever it becomes must be stored and read, or it is theatre.
- **The read can come back empty** (Sales, measured: "I keep taking care of everybody else." gives 0 hits). My path assumed a reading. Moment of value fails on the owner's own example.
- **Day two** (Game). I wrote session design and gave no reason to return.
- **Position should be derived, not stored** (Systems `obAct`). It fixes my Esc finding: skipped is "onboarded with no starting point", so nothing is lost.
- **My pass 1 had a trap.** "The clock stops while any control has focus" freezes a mouse user who just tapped Back. Fix: only keyboard focus (`:focus-visible`) pauses.

## 4. THE PROPOSAL, TOGETHER (my part: structure, flow, controls)

**Path.** Login A, then 520 ms transit, then slider (28 s), then the gate, then tile, then release opening, then stem box, then 12 lines, then settle, then reading, then aftercare, then Keep this, then the Field.

**Slider, five slides.** Dwell = 1.0 s + words / 2.5, floor 3 s, cap 9 s. I take Narrative's formula, his own measured pace. Mine was within half a second of it.

| # | Line | Dwell |
|---|---|---|
| 1 | "This is you." Seven seats land root to crown, 90 ms apart | 3.5 s |
| 2 | "Welcome to a neurosomatic experience." then at +1.4 s "Awareness and intuition is a tool we use to turn your senses inward." Ruled, verbatim | 9.0 s |
| 3 | "You write one true thing. It shows where it sits in your body." | 6.5 s |
| 4 | "Then you let it go." | 3.0 s |
| 5 | "Discover. Play. Flow. Embody. Then again." A circle, four stations 900 ms each, closes | 5.0 s |

The login carries "There is more running you than you can see." Slide 1 answers it. No second hero line. At most 12 words a slide.

**Gate.** No clock. "What brought you here?" Twelve tiles, 112 by 64, 8 px gap, 3 across at 390 and 4 across at 1600, same order. 16 px labels. Radius is the existing `--r-s` 11. Fourteen controls with Back and the app exit. I accept it: twelve homogeneous words, recognised not weighed. The ring of twelve does not fit 16 px labels at 390. Counter slot in the upper right: label "patterns", value 100, then 88 after the run. Under the tiles one line, "About N minutes. Stop any time.", where N is computed from the cue table, never typed. "Two minutes" was untrue.

**Controls.** Visible rings, 44 px: Back, Pause (56), Next, Sound. Skip is text, 16 px, top right, 44 px target. Hairline at the top. Hold 180 ms pauses. A tap under 250 ms latches the pause. Pause keeps its label and `aria-pressed` carries the state. Pause reasons (Systems): hold, hidden tab, keyboard focus, typing, user, distress. Back at slide 1 is dimmed but present. Clock is one frame tick with a delta, not `animationend`, because reduced motion removes the animation and the clock would stall (Technical).

**Tokens.**
- Stage ground: the login's `#06060a`, one token. Two blacks between login and stage read as a cut.
- Roles: ink `#EFEDE8`, sub ink at 70 percent, one accent for the one live control and the playhead. Seat hues only on the figure and on things that name a seat. State never uses a seat hue (Brand, me).
- Hairline: fill ink at 85 percent, track at 40 percent, which should clear 3 to 1 against the stage. Art to measure.
- Type, four steps: 16 (labels, controls, Skip), 18 (sub), 30 at 390 and 40 at 1600 (hero, weight 300, line 1.2). Art may move 40 to 52 but not below 16 anywhere.
- Spacing on the 4 px grid, 16 px gutter, `100dvh`, safe area kept.
- Motion, all gate friendly: text in 420 ms `cubic-bezier(.22,1,.36,1)` with 8 px rise. Text out 220 ms `cubic-bezier(.4,0,1,1)`. Land 320 ms. Drawn paths are named exceptions. Nothing modulates between 3 and 30 Hz (Kai's flicker rule). Verbs: Still, Breathe, Travel, Land.
- Symbols: ring means loop or address. Time is a line. Icons are rings.
- Copy: sentence case, no digits except the counter, the Story tab's own word "Commit" for the button, never "Continue" or "Read it".

**After the gate.**
- Tile tap fills the ring for 600 ms and lights that seat.
- The release opens on his voice. Silent: the same cue table, same length, captions from ruled copy, a "Hear it" ring and a quiet "Skip to the stem". Honest cost: 50 s.
- The stem box and Commit have no clock. The sniffer (the code that reads the story for distress) must pass before the 12 lines. No permanent safety line exists, so this is the only guard.
- 12 lines at about 4 s. The settle shows time left and a way to finish early.
- Aftercare, the same grammar, 5 s a beat, from the person's own data: landed, read, then Keep this. First print of "your avatar".
- Keep this: one username or email field, optional recovery email, an unticked agreement box, Keep this and Not now at equal weight. Five controls. Never on Guest, never on frame one.
- The Field opens with the released address changed and no padlocks. The signal test is a door there, and it writes something. Day two door: "Read the same place again."

**Must agree before building.** Art: stage token, hero size, hairline contrast, quieter seat palette. I side with Art's canon for the stage: it changes saturation, not hue, so the place language holds. Narrative: the five lines and the empty-read copy. Systems: `obAct`, the pause reasons, the starting point field. Game: which act lights which loop quarter. Kai: transit and cue table. Technical: pause the Field loop while open.

## 5. REVISED GRADE

GRADE: 39/100 (was 42). Down three, current onboarding only. Others found what I missed: the invisible sheet takes clicks, the signal answer is discarded, nothing detects distress, the door shows "Unlock all sight", and the read can come back empty. Honest controls 5 to 4. Flow as one object 4 to 3. First four seconds 5 to 4. The new proposal predicts about 76 unbuilt (was 78). The signal test leaving the first run and the empty read both cost two points until fixed.

## 6. TOP 5 RECOMMENDATIONS

1. **Stage plus clock plus the gate (L).** Five slides, 28 s, hairline, pause rules, the gate that never auto advances. Moves Angela, Marcus, Diane, Derek, James.
2. **Distress hook before the first story ships (L).** The story box stops the clock, the sniffer can stop the whole sequence. Moves James, Angela, every level 1 to 3 arrival.
3. **The first run writes: starting point, stem, entry, reading (M).** Derived position, no stored step. Fix the empty read with the starting point's feeling word added before the read. Moves Angela, Derek, Sofia.
4. **Aftercare replaces the five card tutorial (M).** Keep as profile replay. Signal test becomes a door that writes. Moves Sofia, Marcus, Derek.
5. **Honest door (S).** Developer options hidden, Guest defined in a visible line ("Guest keeps everything on this device."), account only after release with the unticked box. Moves James, Angela, Diane.

## 7. QUESTION FOR THE OWNER

None. Decision: the slider is silent, the voice opens the release, and no printed word comes from the unconfirmed draft. Reason: his own ruling, plus no double hearing.
