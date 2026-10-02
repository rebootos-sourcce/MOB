GRADE: 60/100 (was 56)

Mika, with Sol (colour, light), Bjorn (type, grid), Petra (composition, symbol). I read all eleven other pass 1 reports, re-opened `1600-00-first-screen.png`, `390-field-loaded.png` and `mockups/character-aura/shots/aura-1-states.png`, and re-ran contrast on the numbers below.

## 1. AGREEMENTS (the strongest signals)

- **The avatar is not the centrepiece.** Confirmed by eleven of twelve seats. Character is a padlock page, the Avatar tab is a form, the Field centre is a sphere with "62". Systems adds a hard fact: the word "avatar" appears zero times in the Field, Body and Compass renderers.
- **The loop is a row, not a circle.** Confirmed by Brand, Creative, Game, Innovation, UI UX, Marketing and us. Flow and Embody hold one tab each, so the row is also two empty stops.
- **One hue, many meanings.** Sol counted 16 meanings on 7 hues. Systems counted 25 of 34 assigned colours colliding. Kai found the same defect in motion: "breathing" does five jobs. Petra found it in alarm: five jobs. Same defect, three disciplines.
- **No type scale.** My count was 30 rendered sizes. Technical counted 43 declared, June 31, UI UX 38, Creative 35, Innovation 26. The counts differ because we counted different things (rendered text versus declared rules). The finding is the same: no size is a token.
- **Case.** Brand, Creative, June, Marketing and Bjorn all see "Need To Be Need...". Agreed.
- **Locks read as a shop.** Nine to ten padlocks on the first Field screen (Brand, Marketing, UI UX, Sales, Game). Sales adds the cause I missed: the locked orb is opacity .55 and greyscale, the same look as "off", so it never says "sealed".
- **390 collision.** Seven seats found it. I re-looked: the readout pill sits under the zoom buttons.
- **Source OS is invisible.** Brand, June, Marketing and us.

## 2. DISAGREEMENTS (I decide)

- **Avatar behind a tier lock.** Sales and Marketing treat it as a product ruling. Game and Innovation want a free figure. I side with Game. A locked centrepiece is a shop window onto an empty room, and the ruling is "the avatar is the centrepiece". Rule: everyone gets one figure, drawn from their seat weights, one light. Tier three sells the five masks and the detail, not the figure.
- **Ring loop: skin or redesign?** Creative calls it the one redesign. Innovation gives it one chance in three and fears 390. UI UX and Brand call it a skin. I split it. The drawing is a skin: a 28px four arc ring left of the bar, active arc lit, a return arrowhead on Embody. Same four items, same integers. The row of words stays beside it for reach. Replacing the bar with a big ring is the redesign, and I do not ask for it.
- **Loop hues.** Creative wants neutral tints. I want one: the four arcs in the single accent, lit at 100%, the other three at 30%. A loop is one thing turning, not four colours.
- **Source OS.** Owner ruling or defect? His three requests were about brightness: `#343434` replaced `var(--ink)` because white competed with the mark (`head.html:825`). The hex solved that and broke reading. Measured: `#343434` on `#1A1D26` is 1.35 to 1, on `#0C0D12` 1.56. I rule defect and keep his intent. Use `#7F8494`: 4.51 on the panel, 5.20 on the deepest ground, still far under the wordmark. Show him both numbers beside his hex. Caps stay, as a lockup.
- **Case, the recorded conflict.** `head.html:1288` says title case on headers, ruled. `CLAUDE.md` says sentence case. Sentence case wins. Reasons: `capitalize` is not title case (it prints "Need To Be Need" and "Where It Goes", where real title case lowercases "to" and "it"); it needed a `.plain` hatch for names, which proves the tool is wrong; Swiss practice and every instrument label we admire are sentence case; and the ruling was about headers while the CSS applies it to 15 label classes at 11 to 13px. Proper nouns keep capitals (Root, Heart, Source OS).
- **Innovation's second numeral face.** No. A mismatched face reads as a mistake. Inter has `tnum` and `zero`. Check the embedded subset keeps them. If it does, this is free.
- **Dashed lines.** Innovation uses dashed for "stated, not measured". Sales uses dashed for locks. One meaning only: dashed means not measured. A lock is a solid double ring.
- **Throat versus accent.** My pass 1 moved Throat. `canon.js:250` says hue does not move, and Technical shows three palettes would change. I reverse. Move the accent instead (section 4).

## 3. WHAT I MISSED

- **Systems, two sources of truth for seats.** CSS `--root` and friends have almost no reads. JS `PAL` paints. `glasswhite` defines no seat tokens. Solar and Heart measure 1.61 and 1.62 on white there. I only measured Lumen. Worse than I graded.
- **Technical, canvases never read the sheet.** A palette change in CSS leaves the wheel on the old one. Every colour move below needs the canvas read-once fix first.
- **Game and Kai, floor on the dark end.** My own "low coherence is dark, not wrong" went too far. The Aura mockup at coherence 10 is nearly invisible (re-checked). Dark must still be present: a floor of 3 to 1 for the figure outline against its stage.
- **I re-looked at the first screen and found my own miss.** On a blank profile, six chips wear red minus badges, the tape marker is red, the core sphere is red-brown. Alarm on a person who entered nothing says "wrong" about nobody. Marketing found the print version ("Heaviest: Root 0.0"). Mine is the colour version.
- **June, weights.** 500 and 600 are used 126 and 136 times and look the same at 12 to 13px. I had not counted weights.
- **UI UX, 16px reading floor.** 0 of 73 Field text items reach 16. I accepted 14 for reading. Wrong.
- **Kai, selection rings.** `rlring` drops to .04 opacity, so a selected state vanishes. Selection is a state, not a breath.

## 4. THE SKIN, TOGETHER (my part)

**Type** (Bjorn, with June and UI UX). Six sizes: 11 chrome floor, 13 labels and rail, 16 reading, 20 title, 28 number, 44 display. June's 12 versus 13 split is a pixel nobody sees. Weights 400 and 600 only, plus 300 for the 44. `button{font:inherit}` to stop Arial. Sentence case, no `capitalize`.

**Shape.** Radii 4, 10, 16, 999. Icon stroke 1.6, round caps, one CSS rule on icon classes (Technical: Lumen already proves it). Rings, not fills, Punch excepted.

**Colour roles** (Sol).
- Seven seat hues mean place and nothing else. Source is CSS tokens, canvases read them once per lighting.
- Accent `#7EB8D4` to `#A8BCCB`: 0.076 from Throat (was 0.024), chroma 0.031 against 0.090. Contrast 8.59 on the panel. Accent never sits inside a data mark.
- Tiers, practice tracks, root types, layer toggles: one slate ramp, four lightness steps, no seat hue. Group by dash and weight.
- One CQ colour: `cqRamp`, lifted to 4.5 to 1 per lighting by a new `--cq-ink`. Delete `TIERCOL` hues. Floor is lit slate, never red, never invisible.
- Alarm `#FF2E1F` for measured wrong and the record dot. Nothing else. Not on an unread profile.
- Stage tokens per lighting (`--stage`, `--stage-ink`), so Snow stops pairing a black stage with paper chrome.

**Motion** (agree with Kai). Stillness is unread, breathe is read, travel is charge, land is changed. One 4.2s period. Selection holds a steady ring at .8 and lands once.

**Symbols** (Petra, with Systems). Loop ring as above. Lock is a sealed double ring in colour at 80%, never grey. Dashed is not measured. The figure runs root to crown in seat order, as the Aura mockup does.

**Must agree first.** Seat source of truth with Technical and Systems. Type scale with June and UI UX. The 4.2s clock with Kai. Figure floor with Game.

## 5. REVISED GRADE: 60/100 (was 56)

Up four. The reskin is better argued: three seats supplied numbers I lacked (weights, canvas ownership, the lock look). Held down: the unread red is a new defect on the first screen and glasswhite is worse than measured. Criterion moves: soul on screen 4 to 5, type 6 to 7, light 4 to 4 (glasswhite offsets Snow), colour language 3 to 3. With the skin built, about 74.

## 6. TOP 5 RECOMMENDATIONS

1. **Seat palettes read from CSS, one source** (M). Prerequisite for everything. Moves all ICPs, S4 and S3 most.
2. **Split state from place**: tiers, tracks, layers, CQ, alarm, accent move off seat hues (M). S4, S12, S8, S17.
3. **Six sizes, two weights, sentence case** (M by codemod, `tests/design.js` as guard). S3, S16, Marcus, Angela.
4. **A figure for everyone, on the Field centre, with a floor** (M to L, the one redesign I defend). Marcus, Diane, Angela, S6.
5. **Loop ring mark, sealed lock, unread colour fix, Source OS at 4.5** (S, together). All ICPs, S13 and S7 first.

## 7. ONE QUESTION

None. Decisions: sentence case wins over the title case ruling; Source OS rises to 4.5 to 1 keeping caps; the accent moves, the seat hues do not; the figure is free for all. Reason: each serves a standing ruling (sentence case, centrepiece, hue is language) and costs the owner nothing to leave alone.
