GRADE: 56/100

Seat: Anders Kjeld, technical director. Question: what does a reskin cost, and what will the browser do with it. Everything below was read off `source.html` and `atuned_src/` on 1 October, or measured in the sandbox Chromium. Where a number is an estimate, it says so.

## Two corrections to the brief first
- The build is not 950KB. `source.html` is 3,712,246 bytes: 3,078,322 of script, 463,021 of CSS, 64,481 of embedded Inter font, the rest markup.
- There are not three themes. `LIGHTINGS` in `ui/panels.js` lists seven: dark, snow, punch, glass, glasswhite, flat, lumen. Each is a class on `<body>`. A skin must survive all seven or must say which it replaces.

## Scores (my discipline: how skinnable, how safe, how fast)

| Criterion | /10 | Evidence |
|---|---|---|
| Colour token layer in CSS | 6 | 77 custom properties, 2,484 `var()` uses, but 116 distinct hex and 100 distinct rgba literals still sit in the CSS |
| Colour in canvas and JS | 4 | seat palette lives in `engine/data/canon.js` three times (PAL, PAL_LIGHT, PAL_VIVID) plus ROOTCOL and TIERCOL. The seat CSS vars (`--root`..`--crown`) are used only 10 times in the whole file; the screen gets seat colour from JS inline styles (285 `style="` strings in `ui/`) |
| Type scale | 3 | 43 distinct `font-size` values in 506 declarations, no scale tokens (half pixels 11.5, 12.5, 13.5, 14.5 everywhere), 167 more in JS inline styles, 17 canvas `.font=` strings with `Inter` typed in |
| Shape language | 6 | `--r`, `--r-s`, `--r-xs` carry 161 of 283 radius declarations. 31 distinct values overall |
| Motion tokens | 6 | 106 of 117 transitions use `--t-*`. Only 16 of 98 animations do. 52 `cubic-bezier` literals, 58 keyframes |
| Icons | 5 | 130 inline SVG strings, 226 path literals, 12 different stroke widths, no sprite (0 `<symbol>`). Icon paths for seats and the nine axes live in engine data |
| Frame budget headroom | 7 | Field holds 60 fps on all seven lightings. See measurements |
| Gate resilience to a skin | 6 | design gates 186/186 green today, but several pin literals (below) |
| Degradation | 7 | reduced motion has 23 blocks, reduced transparency 1, glass is the only backdrop user and gate 13 forbids it over the Field |
| Build size discipline | 6 | 48% of shipped CSS bytes (224KB) are comments. Harmless, but the build carries them |

## Measurements (headless Chromium, no GPU, 1600x1000, Marcus-class profile loaded)
- Load 0.6s, boot sheet clears at 5.5s (the sheet is a designed three second hold plus load). JS heap 11MB.
- Field, per rAF callback, JS only: median 1.6 to 1.9ms on every lighting, p95 3.0 to 5.2ms, one worst frame of 17ms (punch). Whole main thread incl. paint: 253ms per second, about 4.2ms a frame. That is half of my 8ms budget used, 3.8ms left.
- Frame rate on the Field: 59.9 to 60.8 on all seven lightings. The old STABILITY.md note of "about 100ms per frame" is stale; do not quote it.
- Other surfaces, main thread per second: Compass 437ms (7.3ms a frame, AT my 8ms line), Body 279ms (4.6ms a frame, with only 46ms of script, so it is paint and SVG animation), Story 54, every other tab 21 to 23.
- Live nodes: 4,016 DOM on the Field, up to 6,023 on Compass (hidden surfaces keep their markup). My ceiling is 3,000 per surface. SVG nodes: 1,181 on the Field, 1,589 on Body, 1,890 on Compass. My ceiling is 1,500, so Body and Compass are already over it.
- Cost of a theme or token swap: `setLighting` plus render is 35 to 46ms one time. Overriding `--r`, `--accent` and the ease tokens on `:root` costs 13ms of style and layout, one time. A token-only skin is free per frame.
- Expensive CSS in the sheet: 28 `backdrop-filter`, 19 `filter:blur`, 71 `box-shadow`, 1 `mix-blend-mode`. Only the Glass lighting uses backdrop, and gate 13 keeps it off the Field.
- Not measured, say so: allocation inside the rAF loops (needs a heap timeline), and any real GPU. Estimate for a four year old laptop: 2 to 3 times slower CPU puts the Field near 8 to 12ms (still 60 fps), Compass at 15 to 22ms (drops to 30 to 45 fps), Body at 9 to 14ms. Based on the container's per frame numbers times the slowdown, not on a device.

## How colour is applied today
- CSS: tokens on `:root` in `shell/head.html` (7,116 lines). Six lightings are `body.<name>` blocks that redeclare 10 to 40 tokens each, plus scoped overrides: about 18KB of rules, at least 7.7% of the CSS.
- Canvas: the Field, rings, Body and Compass do not read CSS tokens. They read JS palettes (`PAL`, `PAL_LIGHT`, `PAL_VIVID`, chosen by `S.theme` in 24 places across 8 files), and read the stage's computed background to decide light or dark (`getComputedStyle` in component, cone, map, rings). Story reads three computed colours from the DOM, the one place canvas follows CSS.
- Inline: `ui/` builds colours into strings, 313 `rgb()` constructions and 226 canvas colour assignments, 83 hex literals (25 distinct). Engine data adds 34 distinct hex.
- The consequence: there are two sources of truth for the seven seat colours (CSS `:root` and `canon.js`) and nothing checks they agree.

## What breaks coherence (technical view, ranked)
1. Seat colours owned by JS, accent literal in 12 places (`GOLD` plus wheel 1, component 1, rings 3, map 7). A palette change done only in CSS leaves the canvases on the old palette. Cost: a skin that looks finished in the rail and wrong in the wheel.
2. No type scale. 43 sizes means a type change is a codemod, not a token edit.
3. Two motion systems. CSS transitions are tokenised; keyframes and canvas easing (`n.disp` at 0.14 per frame, `ENTER_SPAN` in `wheel.js`) are separate and kept in step by comments only.
4. Icon weight is set per icon (12 stroke widths). Lumen already proves one CSS rule (`stroke-width:1.9` on `.ib svg`) overrides them, so uniformity is cheap to get.
5. Surfaces already over the node ceilings (Body, Compass).

## Feasibility and cost table
S is under a day and one or two files. M is two to four days, several files, one codemod. L is a week or more or touches engine data.

| Skin move | Size | What it touches | Per frame cost | Risks to the gates |
|---|---|---|---|---|
| Neutral ramp, accent, ink (not seat hues) | S | `:root` and six lighting blocks in `head.html`; funnel regenerates by `tools/tokens.py` | none | gate 9 needs 7 distinct grounds, accent equal on dark lightings; contrast gate on figures |
| Seat colours: chroma and lightness only (hues are ruled) | M | `canon.js` x3 palettes, ROOTCOL, TIERCOL, `:root` seat vars, 12 accent literals, `engine.js` rebuild, `equiv.py` named diff | none | alarm gate pins `rgb(255,46,31)` literally, so a new alarm needs a gate edit; legibility gate per lighting; engine hash diff must be acknowledged |
| Radius and shape tokens (`--r`, `--r-s`, `--r-xs`) | S | three tokens move 161 declarations. The 122 literals (42 circles, 25 pills) need a pass to follow | none | tap floor gate 8; ring grammar says circles stay circles |
| Shape language in the canvases (arcs, nameplates) | M | `wheel.js`, `rings.js`, `cone.js`, `map.js` drawing code | low | `collide.js` nameplate overlap gate |
| New type scale, same face | M (codemod) or L (by hand) | add `--fs-*` tokens, remap 506 CSS declarations, 167 JS inline sizes, 17 canvas font strings | none | gate 4 floor 11px, gate 8 taps, `collide.js` (text widths), 390 wide wrapping |
| New typeface | M | `@font-face`, `--sans`, `--num`, 17 canvas `Inter` literals, `document.fonts.load` before the first canvas draw | none after load | +about 60 to 70KB base64 per variable face (estimate from Inter's 48KB raw). Gate 7 no network is fine. Tabular figures must survive in `--num` |
| Icon set | L | 130 SVG strings, 226 paths, `SEATGLYPH`, nine axis icons in `canon.js`, THEMEICON | none | rings not fills ruling; Punch is the exception; engine hash diff |
| Icon weight and cap only | S | one CSS rule on icon classes, as Lumen does | none | none known |
| Motion tokens (durations, curves) | S for transitions, M for the 82 literal animations and canvas easing | `head.html`, `wheel.js` | none if kept on transform and opacity | gate 12 hard codes the allowed durations `0.12 0.22 0.32 0.42`s, so it needs a named edit |
| A skin shipped as an 8th lighting | M | one `body.<name>` block, one `LIGHTINGS` row, one THEMEICON | gate 13 fps, backdrop count | gates 9 and 13 count `LIGHTINGS` at run time and pick it up |

## Cheaper path (85 percent of the effect)
- Ship the skin as a token layer plus one sheet: a new `:root` block, a type scale as `--fs-1..7`, one icon rule, one shape triple. No engine change, no new nodes.
- Make the canvases follow the CSS: read the seven seat tokens once per lighting change (not per frame) with `getComputedStyle`, cache them in a plain object, and reduce `PAL`, `PAL_LIGHT` and `PAL_VIVID` to defaults. That removes the two sources of truth and makes every later skin an S.
- Draw ornament with `background`, `box-shadow` inset or pseudo-elements, never new DOM nodes. We are already over 3,000.
- Keep the skin on `transform` and `opacity`. Any new glow, blur or backdrop goes on a small layer, scaled up, never full screen.

## What breaks first, and on what hardware
- Compass and Body on an older integrated GPU laptop, long before the Field. Anything a skin adds to those two surfaces (extra blur, extra SVG) goes first.
- Glass lighting on a machine without backdrop support. It is the reason `prefers-reduced-transparency` exists.

## Redesign candidates
- One only: the seat palette ownership (move canvas colour to read tokens). A skin cannot fix this alone, because the canvases never look at the sheet. It is invisible to the person and makes every future skin cheap.
- Do not redesign the icon set without need. Rings, one weight, one cap by CSS gets most of the uniformity.

## Risks
- Hidden coupling: gates that hold literals (alarm red, four durations, 11px, 44px). Each is a deliberate guard, so a change is a named edit, not a workaround.
- Engine data edits force `BUILD-engine.sh`, `engine.js` and an `equiv.py` diff. Keep skin work out of `engine/` where possible.
- Reduced motion and light themes are the usual places a skin is forgotten. 23 reduced motion blocks and 7 lightings all need a pass.
- Font load: a canvas drawn before a new face loads draws in the fallback and stays that way until the next frame that redraws. Gate on `document.fonts.ready`.
- My measurements are a no GPU, headless box. The ranking is reliable, the milliseconds are not a device figure.

Baseline for the cost table: `node tests/design.js` is 186 passed, 0 failed on this tree.
