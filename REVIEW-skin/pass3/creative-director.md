GRADE: 66/100 (pass 1 was 58, pass 2 was 55)

Ines Halldors, creative director, pass 3. Read: the template, PROPOSAL.md, all of pass 2 (creative, art, game, innovation, uiux, marketing, technical, systems, narrative, sales, brand), `ATUNED-art-ux-icp-review.md`, the 1600 Field and 390 first-screen shots, `mockups/character-aura/shots/aura-1-states.png`, `core.js`, `head.html`. Sample note: `ui/personas.js` is the Matrix grid, not the ICPs. I sampled `PANEL-10k.md` (Nils, Camille, Whitney, Marta, Renata, Trey) and `people.js` (Marcus, Sofia).

## 1. The proposal in three sentences

Draw one free figure, light for coherence and bend for load with no number on it, and put it at the centre of the Field, the head of Summary and the Avatar page. Draw the loop as one closed four-arc ring over the existing buttons, and run one grammar of colour (hue means place only), type, shape, motion and word under both. The merge lost one thing and bent two (section 3a to 3c): it lost the pass 2 finding that the free figure must be the unmasked person, and it bent the ring's meaning and the Embody move.

## 2. The ICP room (ten seconds on the reskinned Field)

- **Marcus (level 7).** Sees a bent warm figure, a thin arc up to a tick, then "It has cost me two studios" under it. Stays. Opens Compass. "That arc is the gap. That is the first honest thing a dashboard has shown me."
- **Whitney (phone only, level 5).** Sees the 28 px hero line, one door, a pencilled figure. Taps "Write what happened". Stays if the ring button opens a sheet. Leaves at the first padlock row. "Is it going to tell me I am basic?"
- **Nils (design skeptic).** Counts. Finds one type scale and one stroke weight, then finds `#343434` Source OS at 1.36 to 1. Stays, grudgingly, because the figure is not a hologram. "Who set that wordmark? Somebody ruled that. Fine."
- **Camille (practitioner).** Sees no verdict on the figure, no zeros, the privacy line. Stays. Leaves if the figure reads as a diagnosis of her client. "It shows. It does not name. Good."
- **Marta (acute distress, CQ 9).** Sees a dim warm figure that is still there. The plate must not lead with "Severe". Stays only if it is calm. Leaves if the light goes out. "It did not tell me how bad I am."
- **Renata (operator).** Sees the ring, the loop, one next move. Stays: it is a gauge. Leaves if the figure animates beyond a slow breath. "Fine. Where is the ceiling number?" It is not printed. She will ask.
- **Trey (quiz tourist).** Sees a figure and a line. Pokes once, hits one chip, leaves. Do not chase. "Cool. Is it done?"
- **Sofia (loves the open tables).** Sees the fifth quiet door to the tables. Stays an hour. The figure is a side dish. "Where are the 112?" Keep that door.

## 3. Unified quality and what I overrule

**Unified quality of the proposal as written: 74/100.** One voice, one grammar, and one centre, but the centre is a drawing with no data path yet. The three biggest gaps left:

1. The figure has no home in the wheel. At 1600 the hub is about 100 px across and the seven seat nodes sit about 100 px out (from the shot, verify). A readable figure is 240 px tall. Nobody has specified the wheel geometry. A drawing that collides with its own nodes is the same lie in a new coat.
2. The figure is not wired. "Avatar" appears zero times in `rings.js`, `wheel.js`, `map.js`, `cone.js`. A figure on a screen no reading reaches is decoration wearing the costume of data.
3. Marta. The Aura sheet shows coherence 10 as a ghost. The proposal floors it warm, but the proposal does not say what the plate says at the lowest band.

**Overrulings, both values given.**

**3a. Embody opens on the Avatar and Knowledge moves out. I withdraw it, I wrote it.** Lead value: move `sec:` on `TAB.INTAKE` to `embody`. Original value: `core.js` lines 142 and 228 quote the owner: "Flow is ritual and accountability. Embody is knowledge." and, in his own mapping, the Avatar sits second under Discover. Moving it leaves Knowledge with no section, and uiux withdrew the same idea on the same evidence. My value: leave `sec:` alone. The figure appears on every surface and a tap on it opens the Avatar tab. The ring's fourth station opens Knowledge, as ruled. Avatar-as-Embody is a redesign for the owner, not this skin.

**3b. The ring's lit quarter is "the newest dated act". I rule against.** Lead value: lit by newest dated act. My value: lit by the section you are in. Evidence: the four `.secb` buttons already mark where you are. Light the ring by last act and, after the first journal entry, every screen outside Discover shows two lit things that disagree (Field selected, Discover lit). One mark, two meanings, the defect we condemned in hue. "Newest act" goes to the figure's floor and the Ritual streak, not the ring.

**3c. Type steps 11, 13, 16, 20, 28, 44.** Lead value: six steps, no 12, no 14. Technical's value: seven steps, 11, 12, 13, 14, 16, 20, 28, measured: 186 of 186 design checks, 351 of 351 collide, drawn sizes 17 to 10. In `head.html` I count 498 declared sizes, with 12 at 55 uses and 14 at 48, so the lead's scale reflows 103 declarations to a neighbour it never measured. My value: ship the measured seven plus 44 for the dial. Run the six-step on the same codemod after, and take it only if both gates stay green. A tidy scale nobody ran is a guess.

**Held as ruled:** the unmasked figure is free; Source OS `#343434` stays, with the 1.36 to 1 number shown once beside it; sentence case wins.

## 4. Final grade

**GRADE: 66/100.** Pass 1 58 for the product built. Pass 2 55 after art and systems proved the colour collisions I had guessed at. Pass 3 66 is the product as it stands once build one lands. It moves up because the figure is now free and unmasked, the ceiling is drawn, three conflicts are settled with evidence, and the merge has one grammar. It does not reach the 74 of the proposal, since the data path and hub geometry are still builds, not drawings.

## 5. My part of the build spec

**The figure (free).**
- Posture: the "load low" upright figure from `aura-1-states.png`, unmasked. Masks (Child, Teen, Ideological) are the tier three layer and classify a person. A free figure never wears one. Bend comes from load only.
- Box: 240 tall at 1600, 168 at 390. Node ring radius moves from about 100 to 150 (112 at 390). Estimated from the shot, verify.
- Floor: stroke `#8A6F55` solid on Dark, 4.15 to 1 on `#0B0D11`. Do not use alpha for the floor. Each of the seven lightings gets its own floor token, gate asserts 3 to 1 on all seven.
- Light: lerp from floor at CQ 0 to the lit gradient at CQ 100, linear in CQ. No threshold, no red.
- Breath: 4.2 s, opacity .72 to 1, CSS only, figure only. Unread: still, stroke 1, dashed, `--ink` at 40 percent.
- Marks: under 60 SVG nodes. No blur, no bloom.

**The ceiling arc.** Radius = figure box + 24 px, stroke 1.5. Reading arc solid in `--cq-ink`. The headroom to the ceiling is dashed (not yet drawn, the product's own language) with a 2 px solid tick at the ceiling. Fed from `cqCeiling()` and `cqHeadroom()`. Caption: "Room above you: 38." Never print the pair.

**The plate under the figure.** Number and band word, except at the lowest band, where it reads: "A lot is running you right now. One thing at a time." No "Severe" on first read.

**Ring semantic.** Lit arc = current section. Stroke 1.6, round caps, return arrow Embody to Discover, 280 ms land, clockwise only. Four buttons stay as targets (gate 8).

**Copy.** Unread hero: "There is more running you than you can see." Primary door: "Write what happened". Figure definition: "Light is how together you are. Bend is what you carry." One lock chip per surface, "Opens on tier three".

**Order, with size, file, gate.**
1. 390 "not read yet" pill off the zoom buttons. S. Field CSS. `collide.js` at 390.
2. Unread screen: hero, doors, privacy line, no digits, no padlock. S. Summary and Field renderers. New check in `functional.js`: unread first screen holds zero digits and zero `.lock`.
3. Static figure on Summary head and Avatar page. M. New `ui/figure.js`, manifest after renderers. `design.js` floor contrast on seven lightings, `monitor.js` lit-pixel floor.
4. Wire the data path: CQ and load into one figure object. M. Reads the engine through the UI layer only. `tests/engine.js` stays untouched, `hostfree.py` stays green.
5. Field hub with new node ring geometry and the ceiling arc. L. `rings.js`. `collide.js`, `monitor.js`, frame budget 0.5 ms script.
6. Ring glyph over the buttons. S to M. `shell/body.html`. Gate 8 (44 px), `functional.js`.
7. Copy and type codemod. M. `head.html`. `design.js`, gate 17 edited by name, `terms.py`.

## 6. Ranked recommendations

1. **Free unmasked figure with the warm floor, Summary and Avatar first.** M. Marcus, Marta, Camille, Sofia. Reskin.
2. **Hub geometry and ceiling arc on the Field.** L. Marcus, Renata, Nils. Redesign of the hub, inside the skin.
3. **Unread screen and the 390 pill.** S. Whitney, Marta, Trey. Reskin.
4. **Ring glyph lit by current section.** S to M. Whitney, Renata. Reskin.
5. **Measured seven-step type scale, radii, sentence case.** M. Nils, Marcus. Reskin.
6. **One CQ ramp and canvases reading tokens.** M. Nils, Whitney (older phones). Reskin.
7. **Lock chip, one per surface.** S. Whitney, Trey. Reskin.

## 7. Question for the owner

None.

## TALLY: what the reskin must feel like

It must feel like a gauge that is on your side. The first thing you see is a person, not a dashboard: one figure, warm, never dark, bending where you carry and lit where you cohere, with no number laid on it and no verdict printed beside it. If you have read nothing yet, the figure is a pencilled outline, still, and the screen says one true sentence and offers one door. The ceiling is drawn, so the story is a subtraction toward who you already were, never a score you are failing. Colour tells you where, and only where. How much is told by lightness, how sure by line, and a seal is one mark that says what opens next. The ring tells you which beat of the loop you are in and closes on itself, so Embody hands you back to Discover. It is quiet. Four verbs of motion: still, breathe, travel, land. Every word is short, physical, sentence case and mechanical, and the same word means the same thing everywhere. A phone gives the same instrument at the same weight, with the big thing first. Marta can look at it at two in the morning and not be told how bad she is. Nils cannot find a second scale. Marcus finds his own sentence under the figure. The test is four seconds: a stranger knows it is a mirror, it is on their side, and it does not want anything from them yet.
