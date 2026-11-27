GRADE: 58/100 (pass 1 was 52, pass 2 was 51)

Rua Whitmore, innovation. Pass 3. In passes 1 and 2 I built nothing. This time I built the crude dial in my scratchpad (one SVG file, no repo change) and looked at it at 390 wide.

## 1. THE PROPOSAL IN THREE SENTENCES

Tare: every surface shows the load and the person under it, and release is the load coming off. One free pre-drawn light figure (light is coherence, bend is load, no number on it) sits on the Field, Summary and Avatar, one closed four-arc ring shows the loop, and one grammar (hue means place, state means lightness and line, four motion verbs, one clock) covers the rest. Locks shrink to one sealed mark per surface, and the unread state becomes its own quiet screen.

What the merge lost or bent from my side:
- **Lost: the set hand.** The 62 disc becoming a dial (needle, band name, ceiling stop) is not in the merge. The figure took the hub, but the reading still needs an instrument. It goes on a plate under the figure.
- **Lost: ink as a verb.** The merge keeps "solid = measured, dashed = stated or not read", which is my grammar. It dropped the moment that makes it alive: a pencilled line turning solid with one land (a 320 ms settle) when a reading earns it.
- **Bent: the ceiling arc** moved into the figure. I now agree, as long as it is never printed as a pair.

## 2. THE ICP ROOM (ten seconds on the Field)

- **Marcus (founder, level 7).** Sees the light figure, a plate reading "62 Mid", a dashed arc to the ceiling. Taps the figure to open Body. Stays. "Finally it looks like what it measured."
- **Whitney (phone only, level 5).** Sees a 64 px figure and a 44 px ring button. Screenshots it, reads the glossary. Leaves if the ring looks like a menu icon with no label. "Why is there a ring up there?"
- **Nils (design skeptic).** Sees one type family, one radius set, solid and dashed lines that obey a rule. Hunts for the first break, such as a padlock in a hue that is not slate. "It has rules. Show me one it breaks."
- **Camille (somatic practitioner).** Sees seat hues that still mean place, and no verdict. Stays if the legend says "stated, not yet earned" in plain words. "Does the dash mean the client said it, or the system guessed?"
- **Marta (acute distress, 02:00).** Sees a pencilled still outline, a dash, "There is more running you than you can see.", one door. No score, no padlock. Writes one line. Leaves at once if anything breathes ragged or dim. "It is not telling me I am broken."
- **Renata (operator).** Reads the dial as an instrument in two seconds, then asks where the log is. Leaves if the figure eats room the data needs at 1600. "Give me the number and the trend."
- **Trey (quiz tourist).** Sees a pencilled figure and four doors. Taps the one that sounds like a quiz, screenshots the figure. Leaves when a door asks for a story. "Where is my result?"
- **Sofia (loves the open tables).** Goes straight to the tables and stays. The dashed grammar tells her which cells were earned. Leaves if state is tinted in seat hues. "Which of these numbers did you earn?"

Across the room: only the pencilled unread screen holds Marta. Nobody leaves over novelty. They leave on a break in the rule.

## 3. UNIFIED QUALITY: 68/100

One object, one confidence grammar and one clock is a real jump from six coats of paint on one skeleton. Three gaps remain.
1. **The figure is a picture, not wired.** The word "avatar" appears in none of the files that draw charge (`rings.js`, `map.js`, `cone.js`, `wheel.js`). A drawn figure with no data path is a mascot.
2. **Four surfaces stay in their own worlds.** Knowledge (one wave icon on eleven laws), Games, Release (the run is the product, the screen is a form) and Compass (7.3 ms a frame, no persistent motion allowed). They get tokens, not a signature.
3. **Material is half done.** Blur plus hairline, and the brief bans it. I still say do not finish refraction. Use flat material with line quality as the texture.

## 4. FINAL GRADE: GRADE: 58/100 (pass 1 was 52, pass 2 was 51)

- Up: the free figure and the pencil grammar are on paper (signature object 3 to 6, unity 3 to 5). Motion as data is real (6 to 7).
- Held back: the merge dropped the dial, nothing has met a person yet, and a third of what I love turns out unusable.
- Built out, the skin pack is worth about 70. Adding the wired figure reaches about 76.

## 5. MY PART OF THE BUILD SPEC

**What the crude dial taught me.** At 390 wide, a dashed arc drawn over a solid floor stroke turned to mud. A dashed arc alone, with no floor under it, reads as pencil at once. Rule: the solid floor appears only when something is read.

**Line grammar.**
- Measured: solid, stroke 1.6, round caps.
- Stated or not read: dash `2 5`, stroke 1.6, ink at 75 percent. No wobble (under one pixel it cannot be seen at 390).
- Ceiling: dash `2 4`, the one `--cq-ink` at 50 percent, 7 px inside the dial arc. Never printed as "N of M".
- Ghost hand: stroke 1.4, `--cq-ink` at 45 percent, on tap only, and only after ten daily snapshots. It never shows on open.
- Unlit floor: slate `#4A5260` on dark lightings, stroke 3. Low reads as present, not dead.
- Dash arrays are constants, hoisted once. Dashed strokes cost more to paint.

**Dial.** Arc 144 to 396 degrees, radius 62, needle 50, hub dot 3 px. Numeral 44 px, weight 600, tabular digits, on the plate and never on the figure. Band name 13 px beneath, dim ink. Needle uses the Settle spring (w 13, damping .86). Field and Summary only.

**Ink verb.** A dashed segment turns solid with one Land (320 ms, one overshoot), once. Reduced motion shows the end state.

**Copy.** Unread dial: a dash and "not read yet". Ceiling legend: "Further on, once you release." Pencil legend: "Dashed means stated, not yet earned."

**Goniometer (last).** A stereo plot is a left against right scope. Plot a smoothed envelope of the real audio at 0.3 Hz or slower, under 40 percent amplitude, silent by default. It plots the instrument, never the body.

**Build order.**
1. Unread pencil dial plus hero sentence. S. `ui/rings.js`, `ui/component.js`. Gates `functional.js`, `monitor.js`. A dashed dial lowers the Field's lit-pixel count, so re-measure the floor and never lower it blind.
2. Dial replaces the 62 disc, ceiling arc beside it. M. `ui/rings.js`. Gates `design.js`, `collide.js`, `monitor.js` at 1600 and 390.
3. Pencil on locks and Knowledge laws. M. `ui/lock.js`, the Knowledge renderer. Gates `locks.js`, `design.js`.
4. Ink verb. S. Motion object, `rings.js`. Gate 12 (durations stay 120, 220, 320, 420 ms).
5. Ghost hand on tap. S. Gate `functional.js`.
6. Cross bearing on Summary, never Compass. M. Fires only when a contradiction exists. Gate `monitor.js`.
7. Smoothed goniometer on Release. M. Gate `functional.js` plus a flicker check.

**Test on people first.** Pencil dial and figure in front of Nils and Whitney. Camille reads the dash legend. Marta meets only the unread screen, with Quiet on.

## 6. RANKED RECOMMENDATIONS

1. Unread pencil dial plus hero sentence. S. Marta, Trey, Whitney. Reskin.
2. Dial with ceiling arc replaces the disc. S to M. Marcus, Renata, Sofia. Reskin.
3. Pencil to ink through locks and Knowledge. M. Nils, Camille, Sofia. Reskin.
4. Wire the figure to CQ and seat weights on one shared data path. M, then L for registers. Marcus, Trey. Redesign.
5. Ink verb. S. Marcus, Nils. Reskin.
6. Cross bearing on Summary. M. Camille, Nils. Reskin.
7. Smoothed goniometer. M. Camille, Marcus. Reskin, last.

Killed again: streak flames, points and badges, confetti, a heatmap calendar, finished glass refraction, a second numeral face, the lamp test. The loop as the only navigation stays a redesign, one in three, test it on Whitney first.

## 7. ONE QUESTION

None. Decision taken: the numeral sits on a plate under the figure, so "no number on the figure" holds.
