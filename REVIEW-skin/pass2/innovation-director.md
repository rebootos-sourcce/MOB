GRADE: 51/100 (was 52)

Rua Whitmore, innovation. Pass 2. I read all eleven other pass 1 reports. I built nothing again, so every crude version is still a spec. I checked one fact in source: the embedded Inter font file.

## 1. AGREEMENTS (two or more seats, independently)

- **The avatar is not the centrepiece.** Brand, art, creative, game, marketing, sales, uiux, systems and me. Systems adds the sharpest fact: the word "avatar" appears zero times in the files that draw charge (`rings.js`, `map.js`, `cone.js`, `wheel.js`). The centre of the product is not wired to the surfaces. Confirmed.
- **The loop is a row, not a circle.** Brand, art, creative, game, marketing, uiux, me. Confirmed.
- **Seven hues carry many meanings.** Art counts 16 meanings on 7 hues. Systems counts 25 of 34 assigned colours colliding. Technical confirms seat colour lives in JS, not CSS. Confirmed.
- **No type scale.** Art 30 sizes, narrative 31, creative 35, systems 38, technical 43, me 26. The counts differ because each seat counted differently. The verdict is the same, so stop quoting a number and ship a scale.
- **Start Case against the sentence case rule.** Brand, art, creative, narrative, marketing, uiux.
- **Locks read as a shop.** About nine to ten padlocks on the first Field screen. Brand, marketing, uiux, sales, game, me.
- **The unread state prints verdicts and promises nothing.** Marketing ("Heaviest: Root 0.0"), narrative (zeros where a dash belongs), uiux, me.
- **The 390 wide pill overlaps the zoom buttons.** Seven seats. Confirmed.
- **Release is silent.** Animation (4 of 10), game, me. The biggest moment has the weakest feedback.

## 2. DISAGREEMENTS

- **Avatar behind a tier lock.** Sales wants a sealed door with a ghost silhouette behind it. Game, brand, marketing and art want a free figure. I side with game. Reason: the figure is the measurement of coherence, not a feature. The 1 October ruling sells the registers (the per seat point cloud), not the figure. So: free gets one white light driven by CQ alone. Paid gets the seven seat registers. Sales is right that the door must show a room. The room is the free figure.
- **Ring loop: skin or redesign?** Art says S, brand says M, creative and game say redesign. I split it. A ring glyph of four arcs in the header with the lit station is a skin. A ring as the navigation, avatar at the centre, is a redesign. I gave that one in three. Uiux says the phone should show the ring instead of a dropdown, which is the exact thing to test on S5 and S11 first.
- **Source OS contrast.** Art flags it only, brand says show the owner the number, narrative says raise it. It is 1.4 to 1.5 contrast. A legend nobody can read is not a lockup. Decision: raise it to the `--dim` token, keep the lockup small, log the contrast figure in `DECISIONS.md` beside his hex. Keep it a deliberate quiet register, not invisible.
- **Seat hues keep place meaning?** Yes. "Hue is the language and does not move" holds. State separates by lightness and line quality, never by a seat hue. I take art and systems against the tier and gate colours. Where I add something: line quality is a state channel that costs no hue.
- **Breath purity.** Animation maps low CQ to a ragged breath. Game says low must read as dark, not wrong. Art cites a simulated panel with 8,288 of 10,000 below CQ 50. If most people breathe ragged, ragged is the default, not the signal. I side with game. Show raggedness only at the lowest band, behind a Quiet switch, and test it on S8 first.
- **One family of type.** Narrative says one family. My pass 1 wanted a second numeral face. I withdraw it. See section 3.

## 3. WHAT I MISSED

- **Motion already reads data.** I said none of it did. Animation shows DQ sets pulse speed and charge past 5 bends the ring on a spring. Motion as function 6 to 8.
- **My slashed zero needs no new face.** I checked: the embedded Inter keeps `tnum` (digits all the same width) and drops `zero` (slashed zero). Re-subset the same font with `zero` kept. A few KB, no second face, no 17 canvas font literals to touch.
- **All caps is ruled out.** I proposed engraved caps for plate labels. The rulings forbid all caps UI copy. Engrave with weight and tracking in sentence case. "SOURCE OS" stays the one lockup exception.
- **Frame budget.** Technical measures Compass at 7.3ms a frame (at its 8ms line) and Body over its node ceiling. My cross bearing on the Compass is too expensive there. Move it to Summary or Story. Also R1 cannot "turn the figure into the cones". The figure lives on Field, Story, Summary and Avatar as one small canvas, 1 to 2ms. Body and Compass keep their own object.
- **The goniometer must not flicker.** Animation's hard line: no visual at the 6 Hz theta beat, nothing faster than 0.3 Hz, amplitude under 40%. A vectorscope plotted at audio rate breaks that. Low pass the plot to 0.3 Hz.
- **Transclusion is half blocked.** Systems finds the journal stores a count of imprints, not their ids (chain hop 1 of 3). So a clause can open its address and law today, but not "your lines" until the entry stores ids. That is Schema v2, the owner's. M to L, built in two steps.
- **Two stores disagree on Marcus.** Creative: Field says 62, Gaining. Story says nothing is held. That damages my truth score (8 to 6) until the threshold is named in the line.
- **Dashed already means something.** Sales: dashed outer ring is the "not yet drawn" language in the Compass side panels. Good. It must keep one meaning (see 4).

## 4. THE SKIN, TOGETHER (my part, written to fit)

**Type scale:** 11, 13, 16, 20, 28, 44. The 44 is for the one dial numeral. Weights 400, 500, 600. Narrative proposes 15 for reading, uiux wants 16 because 0 of 73 text items reach it. Must be agreed with narrative and uiux. Sentence case everywhere.

**Radii:** 4, 10, 16, pill. Circles stay circles. **Icon stroke:** 1.6, round cap, one CSS rule (technical: Lumen already proves it).

**Colour roles:** seat hues mean place only. Accent means control. Alarm means measured wrong, plus the record dot. Everything else (tier, gate, track) uses one hue at four lightness steps. Needs art and systems.

**Line grammar (mine, new):**
- Solid ink = measured from the person's words.
- Dashed pencil = stated, not yet earned (`seedShare`) or not read yet. Wobble under one pixel.
- Dim sealed ring, no padlock = locked, with one line: "Opens on tier two".
- Fills never carry state. Dashed means one thing only.

**Motion verbs** (taking animation's set): still means unread. Breathe means read and live, 4.2s. Travel means charge in motion. Land means you changed something, 260 to 340ms. I add one rule: **ink**. A pencilled line becomes solid with one land when a reading earns it.

**Copy rules:** an empty figure shows a dash and the sentence gives the reason. No count against a total. A band name, not a score, on any dial. The dial prints band edges, not "out of 100". Needs narrative.

**Symbols:** the Field hub is a dial: needle at CQ now, a faint reference hand at the last saved day, the ceiling (`cqCeiling`) as the far stop. This is my set hand, merged with creative and brand's ceiling arc. A hand shows the last reading. It never says "you dropped".

**The figure:** one canvas, lit by CQ, floor warm and dim, never dark, no number on it.

## 5. REVISED GRADE: 51/100 (was 52)

| Criterion | Was | Now | Why |
|---|---|---|---|
| Concept originality | 9 | 9 | |
| Rendered originality | 5 | 5 | |
| Signature object, first screen | 3 | 3 | |
| Motion as function | 6 | 8 | Animation's evidence |
| Material | 4 | 4 | |
| Craft and hand | 4 | 4 | |
| Type ownership | 3 | 3 | |
| Adjacent fields | 6 | 6 | |
| Truth of the novelty | 8 | 6 | Unread verdicts, counts against totals, Marcus contradiction |
| Unity of the novelty | 4 | 3 | Avatar wired to nothing; 16 meanings on 7 hues |

Held to it: the skin pack as revised moves rendered originality from 51 to about 68. Adding the figure reaches about 76.

## 6. TOP 5 (ranked)

1. **The unread Field as a pencil instrument.** Dial drawn dashed, values dashes, one sentence ("There is more running you than you can see"), one door. No verdicts. Folds in marketing's hero, game's one door and uiux's closed rail. S to M. Moves S13, S7, S8, Angela, Derek.
2. **Set hand with the ceiling.** The 62 disc becomes a dial with a reference hand and the ceiling as its stop. Needs ten daily snapshots (game), so the reference hand appears only once they exist. S to M. Moves Derek, James, Diane, S5, S16.
3. **Pencil to ink as the one confidence grammar.** Dashed means not earned yet, on the dial, the ceiling, the lock and the untouched Knowledge laws. Done with `stroke-dasharray` on existing paths, so no new DOM nodes (technical's ceiling). M. Moves James, Sofia, S11, S3, Angela.
4. **The lit figure on four surfaces.** Canvas, CQ light, free version one white light, registers paid. Crude behind a flag on the Field centre first. L (a redesign, see section 2). Moves Marcus, Sofia, Diane, S6, S7.
5. **Release as a field, with a smoothed goniometer.** Animation's quiet ring plus a stereo plot of the real audio at 0.3 Hz or slower. M. Moves Derek, Marcus, S4, S1.

Deferred: waterfall for imprints (canvas, entry dates exist, still M), cross bearing (move to Summary), transclusion (needs ids). The lamp test is folded into the boot: on a blank profile the boot ring fills, then settles to unread. Animation's optional "fill to last CQ" is the same idea.

## 7. QUESTION FOR THE OWNER

None. My decisions, with reasons:
- **Sentence case wins.** `DECISIONS.md` around line 353 rules Title Case for "headers and subheaders" only. The CSS stretched it to 15 label classes, including value fragments ("Need To Be Need..."), and needs a `.plain` escape hatch to stop eating whole sentences. `CLAUDE.md` rules sentence case. Instrument legends are plates, not headings. Start Case reads as 2012 software.
- **Source OS is raised.** Decided in section 2.
- **Free figure.** Decided in section 2. It reverses nothing in the 1 October sight ruling.
