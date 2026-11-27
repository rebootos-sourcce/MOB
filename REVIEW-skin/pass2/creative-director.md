GRADE: 55/100 (was 58)

Ines Halldors, creative director. Pass 2. I read all eleven other pass 1 reports and looked again at `mockups/character-aura/shots/aura-1-states.png` and `mockups/character/shots/overview-4x4.png`.

## 1. Agreements

- **The avatar is not the centre.** Brand, game, innovation, systems, uiux, marketing, art, me. Systems adds the hard fact: "avatar" appears zero times in `rings.js`, `wheel.js`, `map.js`, `cone.js`. Confirmed, and worse than I wrote.
- **The loop is a row.** Same seats, plus animation. At 390 it collapses to a dropdown and vanishes.
- **Seat hues carry too many meanings.** Art counts 16 meanings on 7 hues. Systems counts 25 of 34 colours colliding. Technical finds seat colour owned twice, by CSS and JS. Confirmed.
- **No type scale.** Counts run 26 to 43 by method. The method does not matter. The scale does.
- **Start Case breaks sentence case.** Narrative, brand, art, marketing, me.
- **Locks read as a shop.** Brand, marketing, uiux, game, sales, me.
- **The unread state prints verdicts.** "Heaviest: Root 0.0" is a placeholder dressed as a finding. Marketing, uiux, game.
- **The 390 pill sits on the zoom buttons.** Eight seats, one defect.

## 2. Disagreements and rulings

1. **Avatar behind a tier lock?** Sales sells masks at tier three. Game and innovation want a free figure. **Ruling: the figure is free.** A free outline with one light. The charge cloud and masks stay on their tiers, as `DECISIONS.md` rules. The lock sits on added detail, never on the person.
2. **Ring loop: skin or redesign?** I said redesign. Art, uiux, game, brand, marketing said skin. **Ruling: the glyph is a skin and I withdraw my call.** No door or integer changes. Innovation's R2, the whole nav as a dial around the avatar, stays a redesign and is not in this skin.
3. **Source OS at 1.36 to 1.** Art and brand call it a defect. `head.html:825` shows the owner asked for `#343434` three times because brighter competed with the wordmark. **Ruling: his ruling holds.** He wanted recessive, not invisible. We make it one token, `--mark-sub`, and show him the contrast number once, as a note.
4. **Do hues keep their place meaning?** Art nudges Throat. `canon.js:250` says hue does not move. **Ruling: no seat hue moves.** Instead lower the accent's chroma until it is at least 0.08 from Throat (OKLab distance, how different two colours look). State, tier, layer and loop move to lightness and form.
5. **Loop colour.** Art keeps four section hues. **Ruling: neutral.** Lightness steps plus the four icons. Systems counts the loop hues as a colliding namespace.
6. **Seal or Aura?** I chose Seal. **Ruling: Aura, I was wrong.** See section 3.
7. **A number on the figure.** I said keep the 62 inside. Game says none. **Ruling: none.** The reading sits on a plate beneath. Innovation's ghost "set hand" waits for a test, since people chase it.
8. **Printing the ceiling.** Brand wants "ceiling N, you read M". Narrative flags that as a count against a total. **Ruling: draw it, never print the pair.** An arc, plus the gap in its unit.
9. **Locks.** Sales wants a ring-lit orb with a dashed ring. Brand wants grey, no icon. Uiux wants one chip. **Ruling: sales on look, uiux on count.** Grey reads as empty, not sealed. A dashed ring is the product's "not yet drawn" language. One "Opens on tier N" chip per surface. No padlock on tabs. A ring padlock only at the touch point.
10. **The word for the number.** Narrative proposes "weight". **Ruling: "charge",** the owner's word in `CLAUDE.md`. Narrative's other three hold: held, released, not read yet.
11. **A second numeral face.** Innovation wants one. **Ruling: no.** Use Inter's tabular and slashed zero features, after checking the latin subset kept them.
12. **Unread screen.** Game wants one door, marketing a hero line. **Ruling: hero line, one primary door ("Write what happened"), three quiet doors.**
13. **Games.** The owner ruled "hide games for now" (`core.js:237`). It stays off the bar and gets tokens only.

## 3. What I missed

- **The Seal is a mask, not a person.** It is the tier-three Character layer, a face led by one emotion. Aura is a body: load bends it, coherence lights it. Game and innovation saw this. My move would have put a mask on the hub.
- **Aura at coherence 10 is nearly invisible.** Game is right. A dim figure reads as punishment. Floor it at warm, dim, present.
- **CQ has two colour languages** (art). The same 35 is brown in the core and gold in the word.
- **Only 6 of 15 hops of the content chain pass** (systems). Release to ritual is drawn in colour, not explained.
- **The wordmark changes hue per theme** (brand).
- **Canvases never read CSS tokens** (technical). Fix that first, across seven lightings, or the skin looks finished in the rail and wrong in the wheel.

## 4. THE SKIN, TOGETHER

**Name: Tare.** In weighing, you subtract the container to read what is in it. Internal only. The user never sees it.

**Sentence: every surface shows the load and the person under it, and release is the load coming off.**

**Move 1. One figure.** The free outline Aura figure is the hub of the Field, the head of Summary, the centre of the Avatar page and the backdrop of the release card.
- Light is coherence. Bend is load. No number.
- Unread: pencilled outline, still, nothing lit.
- A thin arc runs from the reading to the ceiling, from `cqCeiling()` and `cqHeadroom()`.
- The reading (62 and its band word) sits on a plate below.

**Move 2. One ring.** Four arcs that close, in the bar and at 390.
- Active arc lit, three dim. Embody closes to Discover.
- One indicator travels on a 280ms land.
- Embody opens on the Avatar: `sec:` on `TAB.INTAKE` moves to `embody`. Integers stay.

**Move 3. One grammar.**
- **Type:** 11, 12, 14, 16, 20, 28, 44. Weights 400, 500, 600. No half pixels. `button{font:inherit}`.
- **Radii:** 4, 10, 16, 999.
- **Colour roles:** seat (place only, unmoved), accent (control only, never in a data mark), ink (five neutral steps), alarm (`#FF2E1F`, measured wrong plus the record dot), coherence (one ramp, AA lifted, floor unlit slate), tier (one slate hue, four lightness steps).
- **Vitality, Awareness, Will:** bars. Seats are rings. Form separates them.
- **Motion verbs:** still (unread), breathe (read, 4.2s, .64 to 1, figure and Field only), travel (charge moving, speed is DQ), land (changed, 260 to 340ms, one overshoot). One clock, whole ratios of 4.2s.
- **Symbols:** one seat sheet `{hue, glyph, body name, plain name}`. Body name is the label. Avatar is the figure and its page. Masks is the tier layer. Intake is the questions.
- **Copy:** sentence case, delete `capitalize`, dash for empties, no "we", no count against a total.

**Agree first:** art (colour roles, accent), narrative (type roles, four words), systems (seat sheet), technical (tokens in canvases, gate edits for 11px, durations and alarm red), animation (verbs, clock), uiux (`sec:` move, rail), sales (lock grammar).

## 5. Revised grade

**GRADE: 55/100 (was 58).** Symbol system 7 to 4, because art and systems proved the collisions I guessed at. Skin uniformity 5 to 4, for the second CQ language and double seat source. Voice and atmosphere hold, and animation's motion-as-data is a real asset. The skin as specified is worth about 72.

## 6. Top 5

1. **Free outline figure and ceiling arc on Field, Summary, Avatar, release.** M to L. Derek, Marcus, Diane, S6, S1.
2. **Closed four-arc loop in the bar and at 390.** S to M. Angela, Derek, Diane, S7.
3. **Colour by role.** Seats mean place, one CQ ramp, canvases read tokens. M. Sofia, S4, S8, S3.
4. **One type scale, radii and sentence case.** M. James, Angela, Marcus, S3.
5. **Unread screen and lock grammar, 390 pill fixed.** S. Angela, S7, S1, S8.

**Case:** sentence case wins over `DECISIONS.md` line 353. The sheet's `capitalize` cannot tell a name from a statement: 42 of 99 strings it touches are whole statements. Rank comes from size and weight.

## 7. Question

None. Decided: the figure is free, the ring glyph is a skin, `#343434` holds, sentence case wins, "charge" stays. The owner is tired of questions.
