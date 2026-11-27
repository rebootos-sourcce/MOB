GRADE: 66/100 (pass 1 was 58, pass 2 was 55)

Ines Halldors, creative director. Read: PROPOSAL.md, pass 2, the Field shots, `aura-1-states.png`, `core.js`, `head.html`. `ui/personas.js` is the Matrix grid, not the ICPs, so I sampled `PANEL-10k.md` and `people.js`.

## 1. The proposal in three sentences

Draw one free figure, light for coherence and bend for load, no number on it, at the centre of the Field, the head of Summary and the Avatar page. Draw the loop as one closed four-arc ring over the existing buttons, and run one grammar of colour (hue means place only), type, shape, motion and word under both. The merge bent two things and lost one (section 3): the ring's meaning, the Embody move, and the rule that the free figure wears no mask.

## 2. The ICP room (ten seconds on the Field)

- **Marcus (level 7).** Sees a bent warm figure, a thin arc to a tick, his own line under it. Stays. "That arc is the gap. First honest thing a dashboard has shown me."
- **Whitney (phone only, level 5).** Sees a 28 px hero line and one door. Taps "Write what happened". Leaves at the first padlock row. "Is this going to tell me I am basic?"
- **Nils (design skeptic).** Counts type sizes and strokes, finds one scale, then finds Source OS at 1.36 to 1. Stays. "Somebody ruled that. Fine."
- **Camille (practitioner).** No verdict on the figure, no zeros, privacy line present. Stays. "It shows. It does not name."
- **Marta (acute distress, CQ 9).** Sees a dim warm figure still there. Stays only if the plate does not lead with "Severe". "It did not tell me how bad I am."
- **Renata (operator).** Sees the ring and one next move. Stays, it is a gauge. "Where is the ceiling number?" Not printed.
- **Trey (quiz tourist).** Sees a figure and a line, taps one chip, leaves. Do not chase. "Cool. Is it done?"
- **Sofia (open tables).** Sees the quiet fifth door to the tables. Stays an hour. "Where are the 112?" Keep that door.

## 3. Unified quality: 74/100, and my overrulings

Three gaps left:

1. **The figure has no room.** At 1600 the hub is about 100 px across and the seven seat nodes sit about 100 px out (read off the shot, verify). A readable figure is 240 px tall. Nobody specified the wheel geometry.
2. **The figure is not wired.** "Avatar" appears zero times in `rings.js`, `wheel.js`, `map.js`, `cone.js`. A figure no reading reaches is decoration wearing the costume of data.
3. **Marta.** Coherence 10 is a ghost in `aura-1-states.png`. The floor fixes the light, not the words.

**Where the lead is wrong for the soul, both values.**

- **3a. Embody opens on the Avatar and Knowledge moves out. I withdraw it, I wrote it.** Lead value: move `sec:` on `TAB.INTAKE` to `embody`. Evidence: `core.js` lines 142 and 228 quote the owner, "Embody is knowledge." Moving it strands Knowledge. My value: `sec:` stays. The figure appears everywhere and a tap on it opens the Avatar tab. The fourth station opens Knowledge. Avatar-as-Embody is a redesign and the owner's call.
- **3b. The ring is lit by the newest dated act.** Lead value: that. My value: the section you are in. Evidence: the four `.secb` buttons already mark where you are. After the first journal entry, every other screen shows two lit things that disagree. One mark, two meanings is the defect we condemned in hue.
- **3c. Type 11, 13, 16, 20, 28, 44.** Lead value: six steps, no 12 or 14. Technical measured seven (11, 12, 13, 14, 16, 20, 28): design 186 of 186, collide 351 of 351, drawn sizes 17 to 10. In `head.html` I count 498 size declarations, 12 at 55 uses and 14 at 48, so the six-step moves 103 nobody ran. My value: ship the measured seven plus 44 for the dial. Run the six-step through the same codemod after, and take it only if both gates stay green.
- **Held as ruled:** the figure is free, Source OS `#343434` stays with the 1.36 to 1 number shown once, sentence case wins.

## 4. Final grade

**GRADE: 66/100.** Pass 1 was 58 on the built product. Pass 2 was 55, once art and systems proved the colour collisions. Pass 3 is the product once build one lands. Up: the figure is free and unmasked, the ceiling is drawn, three conflicts are settled. Below the proposal's 74: the data path and hub geometry are builds, not drawings.

## 5. My part of the build spec

**Figure.**
- Posture: the "load low" upright figure in `aura-1-states.png`, unmasked. Masks (Child, Teen, Ideological) classify a person and are tier three. Bend comes from load only.
- Box: 240 tall at 1600, 168 at 390. Node ring radius about 100 to 150 (112 at 390).
- Floor: solid stroke `#8A6F55` on Dark, 4.15 to 1 on `#0B0D11`. Never alpha. One floor token per lighting, gate asserts 3 to 1 on all seven.
- Light: linear from floor at CQ 0 to the lit gradient at CQ 100. No threshold, no red.
- Breath: 4.2 s, opacity .72 to 1, CSS only. Unread: still, stroke 1, dashed, ink at 40 percent.
- Under 60 SVG nodes. No blur.

**Ceiling arc.** Radius box plus 24 px, stroke 1.5. Reading solid in `--cq-ink`. Headroom dashed with a 2 px solid tick, from `cqCeiling()` and `cqHeadroom()`. Caption "Room above you: 38." Never print the pair.

**Plate.** Number and band word, except the lowest band: "A lot is running you right now. One thing at a time."

**Ring.** Lit arc is the current section. Stroke 1.6, round caps, return arrow Embody to Discover, 280 ms land, clockwise only. Buttons stay 44 px (gate 8).

**Copy.** Hero: "There is more running you than you can see." Door: "Write what happened". Key: "Light is how together you are. Bend is what you carry." Lock chip: "Opens on tier three".

**Order.**
1. 390 pill off the zoom buttons. S. Field CSS. `collide.js` at 390.
2. Unread screen, no digits, no padlock. S. Summary and Field renderers. New `functional.js` check: zero digits and zero `.lock` while unread.
3. Static figure on Summary and Avatar. M. New `ui/figure.js`. `design.js` floor contrast on seven lightings, `monitor.js` lit pixels.
4. Wire CQ and load into one figure object. M. UI layer only, engine untouched. `engine.js` and `hostfree.py` stay green.
5. Field hub geometry, ceiling arc. L. `rings.js`. `collide.js`, `monitor.js`, 0.5 ms script.
6. Ring glyph. S to M. `shell/body.html`. Gate 8, `functional.js`.
7. Copy and type codemod. M. `head.html`. `design.js`, gate 17 edited by name, `terms.py`.

## 6. Ranked recommendations

1. Free unmasked figure, warm floor, Summary and Avatar first. M. Marcus, Marta, Camille. Reskin.
2. Hub geometry and ceiling arc on the Field. L. Marcus, Renata, Nils. Redesign of the hub, inside the skin.
3. Unread screen and the 390 pill. S. Whitney, Marta, Trey. Reskin.
4. Ring lit by current section. S to M. Whitney, Renata. Reskin.
5. Measured type scale, radii, sentence case. M. Nils, Marcus. Reskin.
6. One CQ ramp, canvases read tokens. M. Nils, Whitney. Reskin.
7. One lock chip per surface. S. Whitney. Reskin.

## 7. Question for the owner

None.

## TALLY: what the reskin must feel like

It must feel like a gauge that is on your side. The first thing you see is a person, not a dashboard: one figure, warm, never dark, bending where you carry and lit where you cohere, with no number laid on it and no verdict beside it. Before you have read anything it is a pencilled outline, still, with one true sentence and one door. The ceiling is drawn, so the story is a subtraction toward who you already were, never a score you are failing. Colour says where, and only where. Lightness says how much, line says how sure, and one seal says what opens next. The ring says which beat you are in and closes on itself, so Embody hands you back to Discover. Motion has four verbs, still, breathe, travel, land, and nothing else moves. Every word is short, physical, sentence case and mechanical, and one word means one thing. Marta can open it at two in the morning and not be told how bad she is. Nils cannot find a second scale. The test is four seconds: a stranger knows it is a mirror, knows it is on their side, and sees that it wants nothing from them yet.
