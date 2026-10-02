GRADE: 47/100 (was 51)

Dani Sorensen, UI UX architect. Pass 2, 2 October 2026. I read the eleven other pass 1 reports. No QA report yet.

## 1. AGREEMENTS

- **The avatar is not the centre.** Art, brand, creative, game, innovation, marketing, systems, me. Confirmed. Systems adds the hardest fact: the word "avatar" appears zero times in the files that draw charge (`rings.js`, `map.js`, `cone.js`, `wheel.js`). It also has three names: Avatar, Intake, Character (`TAB.MASKS`).
- **The loop is a row.** Eight seats. Confirmed. Flow and Embody hold one door each.
- **Seat hues do too many jobs.** Art (16 meanings on 7 hues), systems (25 of 34 colours collide), creative (loop hues reuse seat hues). I missed this: I count choices, not colours. One colour cannot answer both "where" and "how bad".
- **No type scale.** Seven seats, counts from 26 to 43, differing by what was counted. Nobody found a scale.
- **Start Case against sentence case.** Art, brand, copy, creative, marketing.
- **Locks read as a shop.** Brand, marketing, game, sales, me. Nine padlocks on the first Field screen.
- **The unread state prints verdicts.** Marketing, copy, me. One defect: a zero or a name where a dash belongs.
- **The 390 pill sits under the zoom buttons.** Eight seats. Cheapest fix in the project. Do it first.

## 2. DISAGREEMENTS

**a. Avatar behind a tier lock.** Sales accepts the ruling (`DECISIONS.md` line 2609: "The Character masks stay at tier three"). Game, innovation, marketing, brand want a free figure. I side with the free figure, and it does not break the ruling, because the ruling names the masks, not the figure. Split the object. The figure (light for coherence, bend for load) is free and sits at the centre of the Field. The masks page keeps the tier. Reason: the centrepiece cannot also be the upsell (marketing), and the day 30 reason to return (game) must live on the free side. Game's guard holds: no number on it.

**b. Ring loop, skin or redesign.** Creative, game, innovation (one chance in three) say redesign. Brand, art, marketing say skin. Both, in two layers. Layer 1, a skin: a ring marker of four arcs beside the four section words, current arc lit, an arrow closing Embody to Discover. Buttons, doors and keys do not move. Layer 2, a redesign: the ring as the only navigation. It waits for five people at levels 4 to 6. On a phone the marker is one 44 by 44 button opening a sheet of four stations, not "Play | Field v".

**c. Regrouping Flow and Embody.** I proposed it in pass 1 and I withdraw it. `core.js` quotes the owner, round KT: "Flow is ritual and accountability. Embody is knowledge." That is a ruling. Instead a one-tab section loses its one-tab sub bar, and the ring station opens the tab itself.

**d. Loop colours.** Art wants the four section hues. Creative and systems want ink tints. I side with them. The loop answers "where am I in my process", a seat hue answers "where in my body", and the Field shows both at once. One ink hue, four lightness steps, plus four station icons (eye, play, waves, figure).

**e. Lock look.** Brand: drop the padlock, dim the chip. Sales: dim looks like "off", keep colour and add a dashed ring. Sales is right about dim, brand about the padlock. Both: no padlock, full hue at about 80 percent, dashed outer ring (the product's own "not drawn yet" language). I also revise pass 1. I said locked tabs should leave the bar. That breaks my own rule (never hide a control with no affordance) and the ruling that a slot keeps its label. Locked slots stay.

**f. Source OS at 1.36 to 1.** Four seats call it a defect. It is the owner's hex, asked for three times (`DECISIONS.md` line 2309). It is a credit, not a control or a reading, and no walk fails on it. Leave it. Pass 3 shows the contrast figure beside his hex once.

**g. Lamp test (innovation).** I disagree. The boot already runs 5.24 seconds (animation) with no visible exit. Fold it into the boot, and show a skip line at 1.5 seconds.

**h. Ghost hand (innovation).** A needle with a reference hand is a score wearing a dial. A reading is not a score. Do not build it.

## 3. WHAT I MISSED

- **Creative:** the Field says Gaining at 62, Story and Summary say "Nothing is held above the line." In the first minute the instrument contradicts itself.
- **Game:** day 2 has no return trigger, and Commit pays only a status line, which breaks my feedback floor.
- **Systems:** the right rail renames itself (Energetic Summary, Selection, Root Energetics), and the Field's top row prints 0.0, 1.3, 62% and 11% in one chip style: four scales in a row.
- **Marketing:** S7, phone only, 1,240 people, is the acquisition channel. I walked six named people and none is her. Her doors sit below the fold at 390. Also the privacy line ("stays on this device") belongs on the first screen and login, not Settings.
- **Animation:** the selection ring fades to 4 percent each cycle. A chosen state must be legible at every moment.
- **Art:** on Compass the brightest thing is the rail button "Build today's ritual", not the cone.
- **Technical:** Body and Compass already pass the node ceiling, so a skin must add no nodes.

## 4. THE SKIN, TOGETHER (my part)

**Type, six steps:** 12 labels and chips, 14 controls and rail values, 16 reading, 20 title, 28 number, 40 the Field core. Weights 400, 500, 600. 11 survives only for the engraved wordmark line (gate 4 floor stays). Line height 1.5 at 16, 1.35 at 12 and 14, 1.15 above. Reading blocks stop at 34rem, about 68 characters. Reading surfaces go to 16. This folds copy's 13 into 14 and 15 into 16.

**Spacing:** 4, 8, 12, 16, 24, 32, 48. **Radii:** 4, 10, 16, circle.

**Colour, one channel one question.** Where: seat hue only. How much: lightness and shape, never hue. Which phase: ink tint plus station icon. Can I press it: the one accent, never inside a data mark. Hues do not move (`canon.js:250`); art's Throat shift is a hue move and needs a ruling, so I do not depend on it.

**Motion verbs.** Stillness means unread. Breathe means read. Travel means charge moving. Land means you changed something. The loop marker is the only chrome that moves, once, 280ms, on a section change.

**Symbols.** Four arc loop ring. Lock is a dashed ring. Empty is a dash. The figure is one ring line outline, two behaviours: light and bend.

**Copy.** Sentence case, delete `text-transform:capitalize`. Empty state is a dash plus one sentence naming the next act. No count against a total. Retire "we". One noun, Avatar, the owner's own word; the tier three page is Masks. The right rail has one name, "Reading", and follows the surface.

**Case ruling.** `DECISIONS.md` line 353 (Start Case) sits far above the round OK entries, so it is older, and the brief and `CLAUDE.md` say sentence case. Sentence case wins. With a capital on every word the eye has no stress to catch. Names (Discover, Play, Root) keep capitals.

**Agree first.** Type: copy and tech (a codemod of about 500 declarations). Colour: art, systems, tech (canvases must read tokens). Motion marker: animation. Locks: sales and brand. Figure drawing: art and game. Avatar noun: brand and copy.

## 5. REVISED GRADE: 47/100 (was 51)

Down four. Day 2 has no pull, first run is weaker than I scored (S7 meets doors below the fold, the Field contradicts Story), and the rail renames itself. With the five moves below I expect about 64.

## 6. TOP 5

1. **The unread Field as its own screen. M.** One sentence ("There is more running you than you can see"), four doors above the fold on both widths, the privacy line, no locks, no zeros, no verdicts. Fix the 390 pill first (S). Moves Angela, James, Diane, Sofia, S7.
2. **The figure at the Field centre, free and fixed; masks keep the tier. M to L.** The day 30 reason and the owner's centrepiece. Moves Marcus, Derek, Angela, Diane.
3. **Loop ring marker, phone sheet, no one-tab sub bars. M.** Moves everyone, most Derek and Marcus.
4. **Six step type scale, three weights, sentence case, reading at 16. M (codemod).** Moves Sofia, James, Angela.
5. **One lock grammar: dashed ring, no padlocks, slots stay, one line, one tier card. S.** Moves Angela, Diane, James, Sofia.

## 7. QUESTION FOR THE OWNER

None. Decisions: free figure with tiered masks, sentence case, Source OS left as his hex, Flow and Embody left where he put them.
