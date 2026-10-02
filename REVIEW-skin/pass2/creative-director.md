GRADE: 55/100 (was 58)

Ines Halldors, creative director. Pass 2. I read all eleven other pass 1 reports. I also looked again at `mockups/character-aura/shots/aura-1-states.png` and `mockups/character/shots/overview-4x4.png`. That second look corrected me, see section 3.

## 1. Agreements (two or more seats, found alone)

- **The avatar is not the centre.** Brand, game, innovation, systems, uiux, marketing, art and I all said it. Systems adds the hard fact: the word "avatar" appears zero times in the files that draw charge (`rings.js`, `wheel.js`, `map.js`, `cone.js`). Confirmed, and worse than I wrote. Character is a lock card and the Avatar tab is a form.
- **The loop is a row of four, not a circle.** Me, brand, game, innovation, marketing, uiux, art. Embody opens a reference library. Confirmed. At 390 it collapses to a dropdown, so the loop vanishes on a phone.
- **Seat hues carry too many meanings.** Art counts 16 meanings on 7 hues. Systems counts 25 of 34 assigned colours colliding. Technical finds the seat colours owned twice, by CSS and by JS. I saw only the loop hues. Confirmed.
- **No type scale.** Counts run from 26 (innovation) to 43 (technical) depending on method. The method does not matter. The scale does.
- **Start Case labels break sentence case.** Narrative, brand, art, marketing and me.
- **Locks read as a shop.** Brand, marketing, uiux, game, sales and me. About nine to ten on the first Field screen.
- **The unread state prints verdicts and promises nothing.** Marketing, uiux, game. "Heaviest: Root 0.0" is a placeholder wearing the costume of a finding.
- **The 390 pill sits on the zoom buttons.** Eight seats. It is one defect, counted eight times.

## 2. Disagreements, and my rulings

1. **Should the avatar sit behind a tier lock?** Sales sells masks and registers at tier three. Game and innovation want a free figure. Marketing says the centrepiece cannot be the upsell. **Ruling: the figure is free.** A free outline figure with one light. The charge cloud and the masks stay on their tiers, as `DECISIONS.md` already rules. The lock sits on added detail, never on the person.
2. **Is a ring loop a skin or a redesign?** I wrote redesign. Art, uiux, game, brand and marketing wrote skin. **Ruling: the glyph is a skin and I withdraw my call.** A four-arc ring in the bar changes no door and no integer. What stays a redesign is innovation's R2, the whole navigation as a dial with the avatar at its centre. Not in this skin.
3. **Source OS at 1.36 to 1 contrast: defect or ruling?** Art and brand call it a defect. `head.html:825` records the owner asking for `#343434` three times, because the lighter value competed with the wordmark. **Ruling: his ruling holds.** His aim was "recessive", not "invisible", and we do not overrule his hex. We make it one token, `--mark-sub`, and we show him the contrast number once, in the handoff. It is a note, not a question.
4. **Does hue keep its place meaning?** Art asks to nudge Throat. `canon.js:250` says hue does not move. **Ruling: no seat hue moves.** Instead we move the accent, which is not a seat. Lower its chroma until it sits at least 0.08 away from Throat (OKLab distance, a measure of how different two colours look). Art and systems agree on the rest: seat hues mean place only. State, tier, layer and loop move to lightness and form.
5. **Loop colours.** Art keeps four section hues. **Ruling: neutral.** The loop uses lightness steps and the four icons. Systems counts the loop as one of six colliding namespaces, and art's own score for colour language is 3.
6. **Which figure?** I chose the Seal. Art, game and innovation chose Aura. **Ruling: Aura, and I was wrong.** See section 3.
7. **A number on the figure.** I said keep the 62 inside the hub. Game says no number on the figure. **Ruling: no number on the figure.** The reading sits on a plate under it. Innovation's "set hand" ghost needle waits for a test. Its own report names the risk, that people chase the ghost.
8. **Printing the ceiling.** Brand wants "Your ceiling is N. You read M." Narrative flags "6.2 against a clean ten" as a count against a total, which is banned. **Ruling: draw the ceiling, never print the pair.** An arc, plus the gap in its unit, "points to your ceiling". My own pass 1 move was too loose here.
9. **Locks.** Sales wants a coloured, ring-lit orb with a dashed outer ring. Brand wants grey with no icon. Uiux wants locked tabs removed behind one chip. **Ruling: sales on look, uiux on count.** Grey reads as empty, not sealed. A dashed ring is the product's "not yet drawn" language. One "Opens on tier N" chip per surface. No padlock on tabs or chips. A ring padlock appears only at the touch point.
10. **The word for the number.** Narrative proposes "weight". **Ruling: "charge".** It is the owner's word, in `CLAUDE.md` line one. Narrative's other three hold: occupied is "held", finished is "released", missing is "not read yet".
11. **A second numeral face.** Innovation wants one, technical prices it at 60 to 70KB. **Ruling: no.** One family. Use Inter's own tabular and slashed zero features, after a check that the latin subset kept them.
12. **The unread screen.** Game wants one door. Marketing wants a hero line plus doors. **Ruling: hero line, one primary door, three quiet doors.** "Write what happened" is the primary.
13. **Games.** Sales and uiux call it an orphan. The owner ruled "hide games for now" (`core.js:237`). **Ruling: it stays off the bar.** It gets tokens only. Marketing fixes the landing page claim.

## 3. What I missed

- **The Seal is a mask, not a person.** It is the Character layer, a face on a ring, led by one emotion. Aura is a body, and it already does what the owner means: load bends it, coherence lights it. Game and innovation saw this. My pass 1 move 2 would have put a tier-three mask on the Field hub. Dropped.
- **Aura at coherence 10 is nearly invisible.** Game's near-the-line note stands. A dim figure reads as punishment. Floor it at warm, dim, present.
- **CQ has two colour languages.** Art: `cqRamp` against `TIERCOL`. The same 35 is a brown core and a gold word. I missed it. It breaks my own "truth" row.
- **Only 6 of 15 hops in the content chain pass** (systems). Release to ritual is drawn in colour and not explained.
- **The wordmark colour changes with the theme** (brand). One mark, one hue, values only.
- **The compass turns on the frame rate** (animation). Twice as fast at 120Hz. Not a skin issue, but it makes "one clock" a real rule.
- **Technical's cost table.** Seven lightings, so every colour move is multiplied by seven. Canvases do not read CSS tokens. Fix that first or the skin looks finished in the rail and wrong in the wheel.

## 4. THE SKIN, TOGETHER

**Name: Tare.** In weighing, you subtract the container to read what is really in it. Internal name only. The user never sees the word.

**One sentence: every surface shows the load and the person under it, and release is the load coming off.**

### The three moves

**Move 1. One figure.** The free outline Aura figure is the hub of the Field, the head of Summary, the centre of the Avatar page and the backdrop of the release card.
- Light is coherence. Bend is load. No number on it.
- Unread: a pencilled outline, still, with nothing lit. Stillness means unread.
- A thin outer arc runs from the reading to the ceiling, from `cqCeiling()` and `cqHeadroom()`.
- The reading (62 and its band word) sits on a plate below the figure.
- Tier layers add the point cloud and masks.

**Move 2. One ring.** Four arcs that close, in the top bar and at 390.
- Active arc lit, three dim, Embody closing back to Discover.
- A single indicator travels along the ring on a 280ms land. On wrap it exits right and enters left.
- Embody opens on the Avatar. This needs `sec:` on `TAB.INTAKE` moved to `embody`. Integers stay. Needs uiux to agree.

**Move 3. One grammar.** Colour, type, shape, lock, case and motion all follow the same few rules.

### Tokens (values)

- **Type scale:** 11, 12, 14, 16, 20, 28, 44. Seven steps. 11 is chrome, 12 labels, 14 rail and definitions, 16 reading, 20 titles and values, 28 numbers, 44 hub and boot. Weights 400, 500, 600. No half pixels. `button{font:inherit}`.
- **Radii:** 4, 10, 16, 999. Circles stay circles.
- **Colour roles:** seat (place only, seven, unmoved), accent (control only, chroma lowered, never inside a data mark), ink (five neutral steps), alarm (`#FF2E1F`, measured wrong plus the record dot only), coherence (one ramp, `cqRamp` lifted to AA with a `--cq-ink` per lighting, floor is unlit slate), tier (one slate hue, four lightness steps, chroma kept).
- **Vitality, Awareness, Will:** yellow, indigo, blue, drawn as bars. Seats are drawn as rings. Form separates them.
- **Motion verbs:** still (unread), breathe (read and alive, 4.2s, .64 to 1, figure and Field only), travel (charge moving, speed is DQ), land (you changed something, 260 to 340ms, one overshoot). One clock, in whole ratios of 4.2s.
- **Symbols:** one seat sheet `{hue, glyph, body name, plain name}`. The body name is the label everywhere. The plain name is the first line of its gloss. `AV_AREAS` placeholders retire. Avatar is the figure and its page. Masks is the tier layer. Intake is the questions.
- **Copy rules:** sentence case, delete `text-transform:capitalize`, dash for any empty value, no "we", no count against a total, the four words above.

### Must be agreed first

- **Art:** colour roles, the accent move, the figure's colours.
- **Narrative:** type roles and the four words.
- **Systems:** the seat sheet and the registry.
- **Technical:** canvases read tokens once per lighting. Gate edits for 11px, `0.12 0.22 0.32 0.42`s durations and the alarm red.
- **Animation:** the verbs and the clock.
- **UI/UX:** the `sec:` move and the rail rule.
- **Sales:** one lock grammar.

## 5. Revised grade

**GRADE: 55/100 (was 58).** Down three. Symbol system 7 to 4, because art and systems proved the colour collisions I only guessed at. Skin uniformity 5 to 4, with the second CQ language and the two sources of seat colour. Truth stays at 6. Soul stated 7, and the Atmosphere and Voice rows hold, with animation's motion-as-data as a real asset. A skin that carries moves 1 to 3 is worth about 72.

## 6. Top 5 recommendations

1. **The free outline figure and the ceiling arc on the Field, Summary, Avatar and release.** M to L. Derek, Marcus, Diane, S6, S1.
2. **The closed four-arc loop in the bar and at 390.** S to M. Angela, Derek, Diane, S7.
3. **Separate colour by role.** Seats mean place only, one CQ ramp, tier on lightness, accent off the data, alarm for measured wrong only. Code first: canvases read tokens. M. Sofia, S4, S8, S3.
4. **One type scale, three weights, four radii, sentence case.** Delete `capitalize`. M. James, Angela, Marcus, S3.
5. **The unread screen and the lock grammar.** Hero line, one primary door, no verdicts, dashed-ring locks, one chip per surface, 390 pill moved. S. Angela, S7, S1, S8.

**Recommendation on case:** sentence case wins over `DECISIONS.md` line 353. The sheet's `capitalize` cannot tell a name from a statement, and 42 of 99 strings it touches are whole statements. Headers keep rank through size and weight, not capitals.

## 7. One question

None. Decisions made: the figure is free, the ring glyph is a skin, `#343434` holds as his ruling, sentence case wins, "charge" stays. Reason: the owner has told us he is tired of questions.
