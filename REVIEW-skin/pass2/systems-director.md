GRADE: 38/100 (was 39)

Yuki Brennan, systems director. I read all eleven other pass 1 reports; the QA report had not landed. A token is a named value such as `--panel` that every surface reads instead of typing the number.

## 1. Agreements (two or more seats, independently)

- **Avatar is not the centrepiece.** Eight seats. My count: the word avatar appears 0 times in the six files that draw charge.
- **The loop is a row.** Nine seats. `SECTIONS` holds four rows, Flow and Embody one tab each.
- **Hues carry too many meanings.** Art: 16 meanings on 7 hues. Me: 25 of 34 colours collide. Technical confirms two sources for seat colour. Strongest signal.
- **No type scale.** Counts differ by method and all hold: art 30 (rendered), me 38 (sources), technical 43 (declarations).
- **Case**: five seats. **Locks read as a shop**: five. **Unread prints verdicts**: marketing, uiux, me. **390 pill overlaps zoom**: seven.

## 2. Disagreements, and my side

- **Start Case against sentence case.** I found a second ruling nobody cited: `DECISIONS.md:1116`, "Headers take title case. The stylesheet was right and `CLAUDE.md` was wrong." So the owner ruled it twice. I take a scope fix. The rulings name headers. The CSS applies `text-transform:capitalize` to 15 classes, and narrative found 42 of 99 of those strings are whole statements ("Moral Integrity, 21 Of The 76 Laws"). A transform is a second author: stored and drawn strings differ. Delete it. Headers are authored in title case. Labels, eyebrows and statements are sentence case. `CLAUDE.md` is stale on headers; that edit is the owner's.
- **Do seat hues keep place meaning?** Yes, for fills and arcs of data. State may share a hue with a seat only as an 8px ring marker with a glyph, never as an arc or fill. Loop phases, practice tracks, chain tiers, layers, root domains, compass axes and paid tiers lose hue entirely.
- **Art says move Throat; I say lightness only.** `canon.js:250` rules hue does not move. Accent and Throat separate by role: accent is never a data mark, except the CQ crown, entered as a named alias.
- **Source OS contrast.** Both. A logotype is exempt from contrast rules, and `#343434` is his hex three times. Keep it as `--lockup-sub` with a named gate exemption. The category claim moves to the one sentence on the Field.
- **Avatar behind a tier lock.** Game, innovation, sales, brand say free. I agree for a data reason: the mark is a pure function of CQ and seat charge, and CQ is already free. Lock detail layers, not the figure. A free `avatar_mark` SIGHT row is additive.
- **Ring loop: skin or redesign.** A skin if it draws from `SECTIONS` and `TABDEF.sec` by `.k`, with no integer moved and no tab added. A redesign only if Flow and Embody gain doors or the avatar becomes home.
- **Charge or weight.** Narrative proposes "weight". The engine says charge 131 times and weight 35, and the owner's own sentence says charge. One word: charge.
- **Innovation's second numeral face.** No. The carried Inter has `tnum` and no `zero` (I extracted it). Use tabular-nums, zero bytes.
- **Game's marks "in family colour".** A new colour namespace. Marks are ink, or a seat if about a seat.
- **UIUX "rail closed three sessions".** That stores a counter. Derive it: open when `!r.unread`.
- **UIUX five type steps.** Too few. Chrome needs 12 and 13.

## 3. What I missed

- **Art:** Snow keeps a black stage (two suns). "Gaining" is 1.86 to 1 on paper. Alarm has five jobs. Ten Summary elements render in Arial: `.s-nrow` is a button with no `font:inherit`.
- **Sales, brand:** a lock is `opacity:.55; grayscale(1)`, the same look as off or empty. Sealed and unread cannot be told apart.
- **Innovation:** dashed already means three things. Same collision class as colour.
- **Technical:** gate 12 pins 120, 220, 320, 420 ms; gates pin the alarm literal, 11px and 44px. The funnel regenerates from `tools/tokens.py`. Body and Compass are over the SVG node ceiling. `--gold` is blue in 94 places: a concept with the wrong name.

## 4. The skin, together: the unified token sheet

Every other seat's proposal must fit these rows. Values are proposed. Dark shown; all seven lightings redefine the colour rows.

| Family | Tokens and values |
|---|---|
| Type | `--fs-1..8` = 11, 12, 13, 14, 16, 20, 28, 40. Old sizes go to the nearest step, ties up. 16 is reading prose. 40 is `clamp(32px,8vw,40px)`. Weights 400, 500, 600. 300 only at 28 and up. Line height 1.35 chrome, 1.6 prose, 1.25 title, 1.1 display. Tracking 0, .02em, -.01em. No caps. Numerals: Inter `tnum`. |
| Spacing | `--sp-1..8` = 4, 8, 12, 16, 24, 32, 48, 64. `--hit` 44. Delete `--g1..g3`. |
| Radii | 4, 8, 12, 16, pill 999, circle 50%. Inner radius = outer minus padding. Punch overrides to 4. |
| Elevation, z, alpha | Three elevations: panel, panel-2 (the only shadow), sunk. z: 0, 1, 10, 20, 30, 40, 50, 60 (boot). Alpha: .08, .16, .32, .64. |
| Stroke | Icons 1.6 on a 24 grid. Marks 2. Round caps. Rings, not fills; Punch excepted. |
| Motion | 120, 220, 320, 420 ms, enter 380, stagger 62, breath 4.2 s with harmonics 2.1 and 8.4, dial 1000 linear. Five curves, the rest deleted. |

| Colour role | Token and value | Means | Never |
|---|---|---|---|
| Ground | `--bg #0C0D12`, `--panel #1A1D26`, `--panel-2 #252833`, `--sunk #090A0E`, plus `--stage`, `--stage-ink` per lighting | surface depth | a stage that ignores the lighting |
| Ink | `--ink #EFEDE8`, `--mid #B4B0A8`, `--dim #94908A` | text rank | meaning |
| Seat | `--root #D6524C` to `--crown #A77EDB`, one CSS source, JS caches per lighting | place | any other job |
| Instrument ink | `--accent #7EB8D4` (rename from `--gold`) | selected ring, control, CQ crown | data marks except CQ |
| CQ ramp | #2A2D38, #5A6070 at .5, accent at .76, #EAF4F9 at 1.0 | coherence, one source for word and core | red |
| Alarm | `--alarm #FF2E1F` | measured wrong, record dot | master numbers, heavy mark |
| State marker | `--good #68CBA4`, `--bad #D4736D` | 8px ring and glyph | arcs, fills |
| Tier | paid: ink and numeral. Chain: accent, 4 lightness steps. Coherence: CQ ramp. | rank | seat hue |

| Mark grammar | Rule |
|---|---|
| Line | solid = measured. Dotted 1/4 = stated only (`seedShare`). Dashed 6/4 = not drawn or sealed. Dash is a status channel only. Layer groups use weight and lightness. |
| Motion verbs | still = unread. Breathe = read and live. Travel = charge moving. Land = you changed something, 320 ms, `--ease-land`. Selection is a steady ring at .8, never breathing. |
| Numbers | one style per scale: percent, one decimal out of ten, count, days. Empty is a dash, never 0. |
| Provenance | the person's own words carry a label, "You wrote". |

**New data object, no new storage:** `engine/data/things.js`, one row per seat and spine noun: stored key, plain name, body name, glyph, colour token, glossary line, home surface. Stored keys ('Root') never change; names are display. The avatar mark reads only the record, never `atuned-avatar-side`.

**Agree before building:** Art (CQ ramp hex, seat lightness, `--stage`). Narrative (type roles, case scope, seat names). Kai (verbs, springs, gate 12 edit). Technical (seat cache, alarm gate, `tokens.py`). Brand (one mark hue, lockup exemption, avatar noun). UIUX and game (avatar mark under 60 SVG nodes, one lock per surface from `lockFor()`).

## 5. Revised grade: 38 (was 39)

Motion 5 to 6 (91 percent of transitions tokenised). Seat identity 5 to 4 (Snow stage, `--sky` teal at `head.html:434`). One word 4 to 3 (case transform, landing and app disagree on Play and Flow). Coherence Index reads 37.

## 6. Top 5

1. One source for seat colour, plus `things.js`. M. Marcus, Sofia.
2. Type and spacing ramps, delete the case transform. S tokens, L sweep. Angela, Derek, James.
3. Split state from place: tier, loop, track, layer lose hue; one CQ ramp. M. Sofia, Marcus, S8.
4. Avatar mark on the Field, derived, free. M. Diane, James, Angela.
5. Distinct encodings for lock, unread, off, selected, hot. S. Angela, S6, S4.

## 7. Question for the owner

None. Decision: sentence case for labels, title case for headers, authored not transformed. Reason: it honours both rulings and removes the transform that edits stored strings.
