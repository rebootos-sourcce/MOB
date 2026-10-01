GRADE: 39/100

Yuki Brennan, systems director. Pass 1, design system and information system read as one. Measured from `atuned_src/` at HEAD `8df2ce2`, by read-only scripts over the head.html sheet, the nine style sheets that `ui/*.js` inject at run time, inline style strings, and `engine/data`. Screens read: 1600 and 390, Marcus loaded.

A token is a named value such as `--panel` that every surface reads instead of typing the number. A literal is the number typed in place.

| Criterion | /10 | Evidence |
|---|---|---|
| Colour tokenisation | 7 | 2,079 colour token reads against 497 literal colour sites: 80.7 percent tokenised |
| Type scale | 2 | 38 px sizes, 174 half-pixel declarations, 1 of 658 uses a variable |
| Spacing and radius | 3 | 42.6 percent of 1,920 px spacings on a 4 px grid; radius 47 percent tokenised |
| Motion | 5 | 132 of 229 declarations use `--t-*`; 50 literal durations, 61 keyframes |
| Component variants | 3 | 95 button root classes; 99 panel-like roots; 10 style sheets |
| Icon system | 4 | Rings held (68 round caps, 1 butt), but 17 dictionaries and 14 CSS stroke widths |
| Colour means one thing | 2 | 25 of 34 assigned colours collide with another meaning |
| Seat identity across surfaces | 5 | Root is also Ground, shield is also house, glasswhite palette split |
| Data chain carry-through | 4 | 6 of 15 hop tests pass (table below) |
| Vocabulary, one word one thing | 4 | Glossary defines 3 of 10 spine nouns |

Baseline: `ATUNED-art-ux-icp-review.md` gave Systemic Coherence 94. That was a judgement, not a count. This is not a decline. It is the first time anything was counted.

## The count

| Thing | Distinct | Tokenised | Note |
|---|---|---|---|
| Colours outside token defs | 172 | 80.7% of sites | 145 more live inside theme token defs; 27 hex literals equal no token |
| Font sizes | 38 px + 8 other | 0.2% | 13 sizes cover 90 percent of use |
| Radii | 37 | 174 of 371 | 107 are circle or pill, 90 raw px |
| Spacing px values | 58 | 9 token reads | `--g1,--g2,--g3` are defined and never read |
| z-index | 16 | 0 | two at 9999 |
| Durations | 50 literal | 58% | 58 `cubic-bezier` literals against 3 named eases |
| Opacity | 37 | 0 | ad hoc alpha ladder |
| Icon dictionaries | 17+ | 0 | `AV_IC, SEATGLYPH, QICON_D, CN_IC, FB_IC, REL_IC, RIT_IC, SUM_IC, THEMEICON` and more; about 500 paths |
| Themes | 7 | | dark, snow, punch, glass, glasswhite, flat, lumen |

## The soul

It is an instrument whose one grammar is: seven seats, each with a colour, and a charge that moves through them. When that grammar holds, as on the Body figure, the Field rings and the Story seat list, it is strong. Coherence breaks where the grammar is borrowed for jobs that are not places.

## The data chain, hop by hop

Test per hop: a stored join key, the same symbol (word, glyph, colour) on both ends, a click-through.

- Journal to imprints (1 of 3). The entry stores `imprints:` as a count and `bands`, not which imprints (`storyui.js` commit). Seat colour carries.
- Imprints to release (2 of 3). Joined by node id. The same atom is called imprint on Story, pattern and line in Release, address on Body, node in code.
- Release to ritual (1 of 3). `ritFor` picks the practice from the darkest seat and the tier, not from what was released. `ritual.js` says the link "is drawn in colour and not explained in words". The engine's own graph (`PATTERN_LINKED`, `story`, `impression`) is built and not wired. Impression there, imprint here.
- Ritual to avatar (2 of 3). Avatar cycles read `p.rituals`. But the avatar names the seats Ground, Pleasure, Drive, Love, Voice, Clarity, Meaning with a second glyph set, marked "placeholders" in `AV_AREAS`.
- Avatar to Field, Body, Compass (0 of 3). The word avatar appears 0 times in `rings.js`, `map.js`, `cone.js`, `wheel.js`, `fieldbar.js`, `character.js`, `release.js`, `storyui.js`. The centrepiece is invisible on every surface that draws charge. Its side data (`atuned-avatar-side`) and ritual plans (`atuned-ritual-active`) sit beside the record and do not export.

Also: Vitality is Sacral orange in `rings.js`, Solar in `drills.js`, yellow in `PLAN.md`. Will is Solar yellow, Root, and blue. A tier carries two names for one reading, "Gaining" on the Field and "Tuned" beside it on Summary. The glossary has no entry for Imprint, Pattern, Seat, Story, Ritual or Avatar.

## What breaks coherence, ranked

1. Seat hues do six jobs. 34 colours carry meaning in 6 namespaces (seat, tier, practice track, root type, loop section, semantic) but only 26 values exist. 10 pairs are identical (ΔE 0, where ΔE is perceived colour distance and under about 10 reads as one colour). Heart is also good (7.2) and the Compounding tier; Throat is also the accent (8.2) and the Even tier; the four practice tracks are Eye, Heart, Crown and Solar. `head.html` rules "colour means place, severity by saturation", and `TIERCOL` and `cqRamp` break it. Cost: a person cannot tell where from how bad.
2. Seat colours have two sources. CSS `--root` and `--solar` have 0 reads; JS `PAL`, `PAL_LIGHT`, `PAL_VIVID` in `canon.js` carry them, picked by ternaries in `seatCol` and `bc`. `body.glasswhite` defines no seat tokens, so CSS draws dark pastels on white (Solar 1.61 to 1 contrast, Heart 1.62) while canvas uses `PAL_LIGHT`. From source; not yet rendered.
3. Three nouns for one hero: tab Avatar is `TAB.INTAKE`, the door Intake is `TAB.QUESTIONS`, Character is `TAB.MASKS`. The integers are identity and stay, but the centrepiece, the Avatar tab and the Character page are three names for one hero.
4. Right rail changes name and content: "Energetic Summary" on Field, "Selection" on Compass and Character, "Root Energetics" on mobile. Character at 1600 shows Compass copy, "Back to the compass".
5. Number chips mix five scales (percent, 0 to 1, 0 to 10, 0 to 100, days) in one style. Field's top row prints 0.0, 1.3, 62%, 11% side by side.
6. No type or spacing ramp, so every new surface re-decides.
7. Stale numerals in comments: "three themes", "FOUR LIGHTINGS", "SIX", "SEVEN" above seven; "APP OPENS ON SUMMARY" above `tab:TAB.FIELD`. The repo's own recurring defect.
8. At 390 the Field's Accuracy pill and zoom buttons overlap the 62% Gaining chip.

## Gate: Coherence Index

New static gate `tools/coherence.js`, no browser, reads source like `hostfree.py`. Each term is s in [0,1] by `clamp((x - floor) / (target - floor))`. Weights sum to 1.

CI = 100 x (0.15 meaning + 0.15 chain + 0.10 seat + 0.10 vocab + 0.10 colourTok + 0.10 type + 0.10 component + 0.08 geometry + 0.06 motion + 0.06 icon)

- meaning = 1 minus colours in an undeclared cross-namespace collision (ΔE76 under 10) over colours with a meaning. Now 0.26. Aliases allowed only if listed in `ALIAS` with a reason.
- chain = passed hop tests over 15, from a `CHAIN` table. Join key test reads `validateProfile`; click-through lives in `functional.js`. Now 0.40.
- seat = 1 minus conflicts over 63 cells (7 seats x name, glyph, 7 theme colours, CSS against JS). Now 0.70.
- vocab = glossary coverage of spine nouns, then alias hits over total hits from a registry. Now 0.30.
- colourTok = tokenised share, floor 0.5, target 0.95. Now 0.68.
- type = half variable share, half distinct sizes (floor 60, target 9). Now 0.21.
- component = mean of `.btn` share of buttons, panel roots (8 over n), sheet count (1 over n). Now 0.15.
- geometry = mean of radius token share and on-grid spacing share. Now 0.35.
- motion = mean of `--t-*` share and distinct durations. Now 0.41.
- icon = mean of 24-grid share, stroke widths, dictionary registry share. Now 0.24.

Today it reads 37, matching my 39 grade. Ratchet: store the last pass in `COHERENCE.json`; fail if any term drops more than half a point or CI drops below the stored value. Floor 50 for the Soul round, 70 to ship the skin.

## Skin recommendations

- Add a type ramp (`--fs-1` to `--fs-8`, about 8 values, 12 to 22) and map the 13 hot sizes to it. S. Moves every ICP, most Derek and Angela on phones.
- Add `--sp-1` to `--sp-8` on a 4 px grid and revive `--g1,--g2,--g3`. S, mechanical.
- Split the seven hues from state. Keep seats as the only chroma hues. Move good, bad, tiers, tracks and root types to lightness and chroma on one neutral-to-warm ramp, never a seat hue. M. Moves Sofia, Marcus.
- Make CSS the single source for seats: JS reads `getComputedStyle` once per theme change; delete the three palettes in `canon.js`. Define seat tokens in glasswhite. M.
- Fix tokens for motion, easing, z-index (`--z-chrome`, `--z-sheet`, `--z-tip`) and alpha ladder (4 steps). S.
- Two button variants plus danger, one panel root with three elevations; alias the 99 old roots to it, then delete. L but mechanical.
- Pick one icon grid and one stroke (1.6) in `CSS`; merge dictionaries into one registry `ICONS` keyed by concept. M.
- Put the avatar on the Field: a small avatar mark with its percent complete in the core strip. M. Moves Diane, James, Angela.
- Name the rail once. S.

## Redesign candidates

- A concept registry (`engine/data/things.js`): one row per spine noun with word, glyph, colour token, glossary line, home surface. Surfaces read it. A skin cannot do this because the defect is three tables for one thing. Adds no storage.
- Chain join keys: entry stores imprint node ids; ritual stores pattern ids; avatar moves into the record. Additive and v1 still loads, but it is the owner's call and may touch Schema v2.

## Risks

- Seat-colour consolidation changes every canvas at once; run `tools/equiv.py` and `tests/design.js` first.
- Collapsing tier colours loses what the owner ruled for chroma falling with coherence. Keep chroma, drop hue.
- The gate rewards deleting variety. Do not let it delete the Punch exception, which is ruled.
- The 4 px grid will move 1,100 declarations a pixel or two. Look at the shots.
