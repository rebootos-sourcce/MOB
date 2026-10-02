GRADE: 47/100 (was 51)

Dani Sorensen, UI UX architect. Pass 2, 2 October 2026. I read all eleven other pass 1 reports. The QA measurement report had not landed, so none of this leans on it.

## 1. AGREEMENTS (two or more seats, independent)

- **The avatar is not the centre.** Art, brand, creative, game, innovation, marketing, systems, me. Confirmed. Systems adds the sharpest fact: the word "avatar" appears zero times in the files that draw charge (`rings.js`, `map.js`, `cone.js`, `wheel.js`). It also has three names (Avatar, Intake, Character, which is `TAB.MASKS`). Confirmed as stated.
- **The loop is a row, not a circle.** Eight seats. Confirmed. Sharper: Flow and Embody hold one door each, so two of four stations have no sub bar worth the name.
- **Seat hues do too many jobs.** Art (16 meanings on 7 hues), systems (25 of 34 colours collide), creative (loop hues reuse Crown, Heart, Throat, Sacral). Confirmed. I missed this in pass 1 because I count choices, not colours. It is still my problem: a person cannot answer "where is it" and "how bad is it" from one colour.
- **No type scale.** Seven seats, seven different counts (26, 30, 31, 35, 38, 43). They differ by what was counted (CSS only, or JS inline too, half pixels or not). The number is not the point. Nobody found a scale.
- **Start Case against sentence case.** Art, brand, copy, creative, marketing. See disagreements for the ruling.
- **Locks read as a shop.** Brand, marketing, game, sales, me. Nine padlocks on the first Field screen.
- **The unread state prints verdicts.** Marketing ("Most shut: Truth"), me ("Heaviest Root 0.0"), copy ("0 days"). All three are the same defect: a zero or a name where a dash belongs.
- **The 390 pill sits under the zoom buttons.** Eight seats. It is the most reported defect and the cheapest fix. Do it before any of the rest.

## 2. DISAGREEMENTS

**a. Should the avatar sit behind a tier lock.** Sales accepts the recorded ruling (`DECISIONS.md` line 2609: "The Character masks stay at tier three until he says otherwise"). Game, innovation, marketing and brand want a free figure. I side with the free figure, and it does not contradict the ruling, because the ruling names the masks, not the figure. Split the object. The figure (one shape, light for coherence, bend for load) is free and sits at the centre of the Field. The masks page keeps the tier. Reason: the centrepiece cannot also be the upsell (marketing), and the day 30 reason to return (game) has to live on the free side. Game's guard stays: no number on it, and it never goes dark on a missed day.

**b. Ring loop, skin or redesign.** Creative, game and innovation (who gives it one chance in three) call it a redesign. Brand, art, marketing say skin. I take both, in two layers. Layer 1 is a skin: a ring marker of four arcs next to the four section words, current arc lit, an arrow closing Embody back to Discover. The buttons, the doors and the keys do not move. Layer 2 is a redesign: the ring as the only navigation with the avatar in the middle. It waits for five people at levels 4 to 6 (innovation's test). On a phone the marker is one 44 by 44 button that opens a sheet of the four stations, not today's "Play | Field v" dropdown.

**c. Regrouping Flow and Embody.** I proposed it in pass 1. I withdraw it. `core.js` records the owner's words, round KT: "Flow is ritual and accountability. Embody is knowledge." That is a ruling. A one-door station is honest if the station itself is the door. So a section with one tab loses its one-tab sub bar and the ring station opens the tab directly.

**d. Loop colours.** Art wants the ring in the four section hues. Creative and systems want ink tints. I side with systems and creative. The loop answers "where am I in my process". A seat hue answers "where in my body". Both are on screen at the Field at once. The arcs get one ink hue in four lightness steps plus the four station icons (eye, play, waves, figure).

**e. Lock look.** Brand says remove the padlock, dim the chip. Sales says dim looks the same as "off" or "empty", so keep colour and add a dashed ring. Sales is right about dim, brand is right about the padlock. Both: no padlock glyph, full hue at about 80 percent, dashed outer ring (the product's own "not drawn yet" language). I also revise my pass 1. I said locked tabs should leave the bar. That breaks my own rule (hiding a control with no affordance) and the standing ruling that a slot keeps its label and the value carries the state. Locked slots stay in place.

**f. Source OS at 1.36 to 1.** Brand, art, copy and marketing call it a defect. It is the owner's hex, asked for three times (`DECISIONS.md` line 2309). It is a credit line, not a control and not a reading, so no task in my walks fails on it. Decision: leave it. Pass 3 puts the contrast figure beside his hex once, and that is all.

**g. Lamp test (innovation, S).** I disagree. Animation measured the boot at 5.24 seconds with no visible way out. A lamp test adds a second beat before Angela's first useful thing. Fold it into the boot, which already draws the grammar, and make the skip line visible at 1.5 seconds (animation's proposal).

**h. Set hand and ghost hand (innovation).** A needle with a reference hand is a score wearing a dial. Standing ruling: a reading is not a score. I would not build the ghost hand.

## 3. WHAT I MISSED

- **Creative: two stores disagree.** The Field says Gaining at 62. Story and Summary say "Nothing is held above the line." In the first minute that reads as the instrument contradicting itself. It lowers first run and trust.
- **Game: day 2 has no return trigger, and Commit pays a status line.** I scored the day 3 pull as the ritual. Game's day 2 score of 2 is fairer. The first act that matters has the weakest feedback, which breaks my 1 to 3 second feedback floor.
- **Systems: the right rail renames itself** (Energetic Summary, Selection, Root Energetics). Character at 1600 shows Compass copy. Also the Field's top row prints 0.0, 1.3, 62% and 11% in one chip style, four scales side by side. My load count never saw units.
- **Marketing: S7, phone only, 1,240 people, is the acquisition channel.** I walked six named people and none is her. On 390 her doors sit below the fold. That raises the weight of the phone first screen.
- **Marketing: the privacy line** ("stays on this device") should be on the first screen and the login, not only Settings. I listed it as James's blocker and then filed it under a Settings note. It is a first screen item.
- **Animation: breathing means five things, and the selection ring fades to 4 percent each cycle.** A chosen state must be legible at every moment. That is my feedback floor too.
- **Art: squint order is wrong on Compass, Story, Body and Analytics.** On Compass the brightest thing is the rail button "Build today's ritual", not the cone.
- **Technical: Body and Compass already exceed the node ceiling.** A skin adds no nodes there. My structural moves remove them.

## 4. THE SKIN, TOGETHER (my part)

**Type scale, six steps.** 12 labels and chips, 14 controls and rail values, 16 reading, 20 title, 28 number, 40 the Field core. Weights 400, 500, 600. 11px survives only for the engraved wordmark line (gate 4 floor stays). Line height: 1.5 at 16, 1.35 at 12 and 14, 1.15 at 28 and 40. Reading blocks stop at 34rem, about 68 characters. This folds copy's 13 into 14 and 15 into 16, and matches sales (12, 14, 16, 20) and systems. Reading surfaces (Summary, Story column, Knowledge definitions, Settings) go to 16. My floor was never met by chrome, and this meets it where a person actually reads.
**Spacing.** 4, 8, 12, 16, 24, 32, 48. **Radii.** 4, 10, 16, circle (creative's set, mapped onto `--r-xs`, `--r-s`, `--r`).
**Colour roles, one channel one question.** Where: seat hue, only. How much: lightness and shape, never hue. Which phase: ink tints plus station icon. Can I press it: the one accent, never inside a data mark. Hues do not move (`canon.js:250`). Art's Throat shift is a hue move and needs the owner's ruling, so I do not depend on it.
**Motion verbs.** Stillness means unread. Breathe means read. Travel means charge moving. Land means you changed something. The loop ring marker is the only chrome that moves, once, 280ms, on a section change.
**Symbols.** Loop ring of four arcs. Lock is a dashed ring, no padlock. Empty is a dash. The figure is ring line, one outline, light and bend as its only two behaviours.
**Copy rules.** Sentence case, delete `text-transform:capitalize` (see the case ruling below). Empty state is a dash plus one sentence naming the next act. No count against a total. Retire "we". One noun for the figure: Avatar, which is the owner's own word ("What is Atuned? Your avatar"). The tier three page is called Masks.
**The rail.** One name, "Reading", at every width. It follows the surface (nothing for Games or Knowledge that answers nothing there).

**Agree first.** Type scale: copy and tech (a codemod of 500 declarations, gates 4 and 8, `collide.js`). Colour roles: art, systems, tech (canvases must read tokens once per lighting). Motion marker: animation. Lock grammar: sales and brand. The figure's drawing: art and game (Seal or Aura, both ring-line; I need only that it is one object at two sizes). Avatar noun: brand and copy.

**The case ruling.** `DECISIONS.md` line 353 (Start Case on headers) sits far above the round OK entries, so it is older, and the brief and `CLAUDE.md` both say sentence case. Sentence case wins. Reason from structure: when every word starts with a capital, the eye has no stress to catch, "Need To Be Need..." truncates, and proper nouns lose their meaning. Names (Discover, Play, Flow, Embody, Root) keep their capitals as names.

## 5. REVISED GRADE: 47/100 (was 51)

Down four. Reasons: day 2 has no pull (game), first run is weaker than I scored because S7 phone-only is the largest channel and meets doors below the fold, the rail renames itself, and the Field contradicts Story. My nine criteria now read 6, 3, 5, 5, 4, 5, 4, 5, 5. If the five moves below ship, I expect about 64. The rest needs the figure and the return page.

## 6. TOP 5 (ranked)

1. **The unread Field as its own screen. M.** One sentence ("There is more running you than you can see"), four doors above the fold on both widths, the privacy line, no locks, no zeros, no verdicts. First, fix the 390 pill (S). Moves Angela, James, Diane, Sofia, S7.
2. **The figure on the Field centre, free, fixed; masks keep the tier. M to L.** Moves Marcus, Derek, Angela, Diane. This is the day 30 reason and the owner's centrepiece.
3. **Loop ring marker and a phone sheet; one-tab sections lose the sub bar. M.** Moves everyone, most Derek and Marcus.
4. **Six step type scale, three weights, sentence case, reading at 16. M (codemod).** Moves Sofia, James, Angela.
5. **One lock grammar: dashed ring, no padlocks, slots stay, one line, one tier card. S.** Moves Angela, Diane, James, Sofia.

Next, not ranked: Commit lands on the figure for under two seconds (game, animation), and the Field and Story stop disagreeing about what is held.

## 7. QUESTION FOR THE OWNER

None. Decisions: free figure with tiered masks, sentence case, Source OS left as his hex, Flow and Embody doors left where he put them.
