GRADE: 58/100 (pass 1 was 52, pass 2 was 51)

Rua Whitmore, innovation. Pass 3. Pass 1 and 2 I built nothing. This time I built the crude dial in my scratchpad (one SVG file, no repo change) and looked at it at 390 wide. It taught me one thing, in section 5.

## 1. THE PROPOSAL IN THREE SENTENCES

Tare: every surface shows the load and the person under it, and release is the load coming off. One free pre-drawn light figure (light is coherence, bend is load, no number on it) sits on the Field, Summary and Avatar, one closed four-arc ring shows the loop, and one grammar (hue means place, state means lightness and line, four motion verbs, one clock) covers the rest. Locks shrink to one sealed mark per surface, and the unread state becomes its own quiet screen.

What the merge lost or bent from my side:
- **Lost: the set hand.** The 62 disc becoming a dial with a needle and a ceiling stop is not in the merge. The figure took the hub. The reading still needs a place to live, and "a plate beneath the figure" is where the dial goes.
- **Lost: pencil to ink as a verb.** The merge keeps "solid = measured, dashed = stated or not read", which is my grammar. It dropped the one moment that makes it feel alive: a pencilled line turning solid with one land (a 320 ms settle) when a reading earns it.
- **Bent: the ceiling arc** went into the figure. I now agree: it sits beside the dial and is never printed as a pair.
- **Deferred, rightly:** goniometer, waterfall, transclusion, cross bearing. All need the figure and the unread screen to ship first.

## 2. THE ICP ROOM (eight people, ten seconds on the Field)

- **Marcus (founder, level 7).** Sees the light figure, a warm plate reading "62 Mid", a dashed arc to the ceiling. Taps the figure to open the Body. Stays; this is the first screen that looks like it knows his record. "Finally it looks like what it measured."
- **Whitney (phone only, level 5).** Sees a 64 px figure and a 44 px ring button at 390. Screenshots it, opens the glossary first. Leaves if the ring button looks like a menu icon and nothing says what it is. "Is this my chart? Why is there a ring up there?"
- **Nils (design skeptic).** Sees one family of type, one radius set, solid and dashed lines that obey a rule. Opens the dial and checks that dashed means unmeasured everywhere. Leaves on the first break, such as a padlock hue that is not slate. "It has rules. Show me one it breaks."
- **Camille (somatic practitioner).** Sees seat hues that still mean place, and no verdict. She wants to know what the dashed line promises. Stays if the legend says "stated, not yet earned" in her language. "Does the dash mean the client said it, or the system guessed it?"
- **Marta (acute distress, 02:00).** Sees a pencilled still outline, a dash, one sentence, "There is more running you than you can see.", one door. No score, no flashing, no padlock. Stays three minutes; writes one line. Leaves at once if anything breathes ragged or dim. "It is not telling me I am broken."
- **Renata (operator).** Sees the dial and reads it as an instrument: needle, band name, ceiling. Takes the dial in two seconds and asks where the log is. Leaves if the figure takes space the data needs at 1600. "Give me the number and the trend. Skip the glow."
- **Trey (quiz tourist).** Sees a pencilled figure and four doors. Taps the one that reads like a quiz. Screenshots the figure within four minutes. Leaves when the first door asks for a story. "Where is my result?"
- **Sofia (loves the open tables).** Sees a clean Field and goes straight to the tables. Stays long. The dashed grammar tells her which cells are measured, which pleases her. Leaves if the tables are tinted in seat hues for state. "Tell me which of these numbers you earned."

Read across the room: the figure moves Marcus and Trey. The dial moves Renata and Marcus. The pencilled unread screen is the only thing that holds Marta. Nobody leaves because of novelty. They leave on a break in the rule.

## 3. UNIFIED QUALITY: 68/100

The proposal now has one object, one confidence grammar and one clock. That is a real jump from the six coats of paint I graded in pass 1. Three gaps remain.
1. **The figure is a picture, not wired.** The word "avatar" appears in none of the files that draw charge (`rings.js`, `map.js`, `cone.js`, `wheel.js`). A pre-drawn figure with no data path is the Replika mistake with a better excuse.
2. **Four surfaces stay different worlds.** Knowledge (one wave icon on eleven laws), Games, Release (the run is the product and the screen is a form) and Compass (7.3 ms a frame, no persistent motion allowed). The grammar reaches them as tokens, not as a signature.
3. **The material is half done.** Blur plus hairline, and the brief bans it. I still say do not finish refraction. The honest fix is flat material with line quality as the texture.

## 4. FINAL GRADE: GRADE: 58/100 (pass 1 was 52, pass 2 was 51)

- Up 7: the figure is free and Aura is chosen, so the signature object exists on paper (3 to 6). Pencil to ink became the shared grammar (unity 3 to 5). Motion as data is real (6 to 7).
- Held back: the merge dropped the dial, so the reading has no instrument. Nothing was tested on a person, and my own third-unusable rule applies to my own ideas.
- Held to it: spec built out, the skin pack is worth about 70. Adding the wired figure reaches about 76.

## 5. MY PART OF THE BUILD SPEC

**What the crude dial taught me.** At 390 wide, a dashed arc drawn over a solid floor stroke turned to mud. A dashed arc on its own, with no floor under it, reads at once as pencil. Rule: the solid floor appears only when something is read.

**Line grammar (exact).**
- Measured: solid, stroke 1.6, round caps.
- Stated or not read: dash `2 5`, stroke 1.6, ink at 75 percent. No wobble. A wobble under one pixel is not visible at 390 and costs paint time.
- Ceiling: dash `2 4`, role colour is the one `--cq-ink` at 50 percent, radius 7 px inside the dial arc. Never printed as "N of M".
- Ghost hand: line stroke 1.4, `--cq-ink` at 45 percent. At 62 against 55 it reads as a faint twin. On demand only, tap the dial. It never shows on open (the game seat's loss-frame objection stands).
- Unlit floor: slate `#4A5260` on the dark lightings, stroke 3, so low reads as present, not dark.
- Hoist every dash array to one constant. Dashed strokes cost more to paint, so no per-frame strings.

**Dial.** Arc from 144 to 396 degrees, needle length 50 of a 62 radius, hub dot 3 px. Numeral 44 px, weight 600, tabular digits. Band name 13 px beneath it in the dim ink. The numeral sits on the plate under the figure, never on it. Needle moves on the Settle spring (w 13, damping .86). Needle and arc stay on the Field and Summary only.

**Ink verb.** When a reading earns a line, the dashed segment turns solid with one Land (320 ms, one overshoot), once. Reduced motion shows the end state.

**Copy.** Unread dial: a dash and "not read yet". Ceiling legend: "Further on, once you release". Pencil legend (one line, in the legend sheet): "Dashed means stated, not yet earned."

**Goniometer (last).** Smoothed envelope of the real left and right audio, 0.3 Hz or slower, under 40 percent amplitude, silent by default. It plots the instrument, never the body.

**Build order.**
1. **Unread pencil dial plus the hero sentence.** S. Files `ui/rings.js`, `ui/component.js`. Gates `functional.js`, `monitor.js`. Watch the Field lit-pixel floor: a dashed dial lowers the count, so re-measure it, do not lower the floor blind.
2. **Dial replaces the 62 disc, ceiling arc beside it.** M. Files `ui/rings.js`, one shared draw helper. Gates `design.js`, `collide.js`, `monitor.js` at 1600 and 390.
3. **Hoisted dash constants, pencil on locks and Knowledge laws.** M. File `ui/lock.js`, Knowledge renderer. Gates `locks.js`, `design.js` (padlock mark stays at the touch point).
4. **Ink verb.** S. Files the motion object and `rings.js`. Gate 12 (durations stay on 120, 220, 320, 420 ms).
5. **Ghost hand on tap, only after ten daily snapshots.** S. Gate `functional.js`.
6. **Cross bearing on Summary, never on Compass.** M. Fires only when a contradiction exists. Gate `monitor.js` plus a copy check.
7. **Smoothed goniometer on Release.** M. Gates `functional.js`, plus a flicker check: no component faster than 0.3 Hz.

**Crude tests before any of it ships.** Put the pencil dial and the figure in front of Nils and Whitney first. Camille tests the dash legend. Marta is tested only by the unread screen, with Quiet on.

## 6. RANKED RECOMMENDATIONS

1. **Unread pencil dial plus hero sentence.** S. Marta, Trey, Whitney. Reskin.
2. **Dial with ceiling arc replaces the disc.** S to M. Marcus, Renata, Sofia. Reskin.
3. **Pencil to ink grammar through locks and Knowledge.** M. Nils, Camille, Sofia. Reskin.
4. **Wire the figure to CQ and seat weights with one shared data path.** M, then L for registers. Marcus, Trey. Redesign (a shared object).
5. **Ink verb (one land when a line is earned).** S. Marcus, Nils. Reskin.
6. **Goniometer, smoothed.** M. Camille, Marcus. Reskin, but last.
7. **Cross bearing on Summary.** M. Camille, Nils. Reskin.
Killed again: streak flames, points and badges, confetti, a chat bubble for Source, a heatmap calendar, a seventh theme, finishing glass refraction, a second numeral face, the lamp test (the boot already is one).
Redesign I still do not recommend: the loop as the only navigation. One in three, test it on Whitney first.

## 7. ONE QUESTION

None. Decision taken: the dial numeral sits on a plate under the figure, so "no number on the figure" holds.
