GRADE: 44/100 (pass 1 was 39, pass 2 was 38)

Yuki Brennan, systems director. Measured at `c4523f8`. A token is a named value such as `--panel` that every surface reads; a literal is the number typed in place. OKLab distance is how different two colours look (0 is the same, 0.08 is clearly apart).

## 1. The proposal in three sentences

One pre-drawn figure, one closed ring for the loop, and one grammar where hue means place only and state moves to lightness and form. It builds from tokens read once, so the canvases and the CSS finally agree. It stays in one file and moves no tab integer.

What the merge lost or bent, all checked:
- "Six steps, already adopted": false. `head.html` has no `--fs` token; the names exist only in my onboarding report.
- Accent floor 0.08 from Throat. Art's `#A8BCCB` measures 0.080, no margin. Today Snow sits 0.018, Lumen 0.059, Flat 0.043. Zero of seven lightings pass.
- "Slate floor, never invisible". The old CQ floor `#2A2D38` is 1.23 to 1 on the panel; `#5A6070` is 2.68.
- Eight of ten tier colours sit within 0.08 of a seat; three are seat colours exactly.
- The six steps move 457 of 658 font-size declarations, 57 by two pixels or more. Not free.
- Radii "4, 10, 16" would send `--r-xs` (8 px) to 4. Nearest value says 10.
- No gate is named, so nobody can say the skin landed.

## 2. The ICP room (data and token view)

- **Marcus:** the Field's colours now match Story. Stays. "Seven colours, one meaning."
- **Whitney:** 16 px first line, the 390 pill clear of the zoom buttons. Stays if the doors sit above the fold. "I can read it."
- **Nils:** counts sizes and radii in devtools: six, four. Stays. "Fine. It has a system."
- **Camille:** the skin stores nothing new. Stays. "Same record, same rules."
- **Marta:** still outline, one sentence, no red, no zeros. Stays a minute. "It did not shout."
- **Renata:** reads the ratchet. Stays. "A number I can fail a build on."
- **Trey:** the accent is now near grey, so the call to action rides on form. Risk of leaving. "Where do I press?"
- **Sofia:** table colours read as roles. Stays. "Every colour has one job."

## 3. Unified quality: 66/100

Sound where it names roles. Not yet a sheet. Gaps:
1. Chain carry-through is not a skin (6 of 15 hops pass).
2. 95 button root classes survive. "L, mechanical" has no owner.
3. Only dark is specified; the other six lightings need values or the canvas fix rebuilds today's split.

## 4. Final grade: 44/100

Up six from 38: the sheet is reconciled and checked. Held down: nothing is built, and three values fail.

## 5. My part of the build spec

**Type.** `--fs-1` 11, `--fs-3` 13, `--fs-5` 16, `--fs-6` 20, `--fs-7` 28, `--fs-9` 44 (`clamp(28px,7vw,44px)`). Names 2, 4, 8 retired, never reused. Weights 400, 500, 600; 300 on 44 only. Line height 1.35, 1.5 at 16, 1.1 from 28. `button,input,select,textarea{font:inherit}`. Map nearest, ties up; skip unitless SVG text; reading surfaces opt in to 16 by hand list.

**Space and shape.** `--sp-1..8` = 4, 8, 12, 16, 24, 32, 48, 64; delete `--g1..g3`. Radius `--r-1` 4, `--r-2` 10, `--r-3` 16, `--r-pill` 999px, circle 50%; `--r-xs` and `--r-s` alias `--r-2` for one release; Punch overrides stay. z: 0, 1, 10, 20, 30, 40, 50, 60 (16 values today). Alpha: .08, .16, .32, .64 (56 today). Stroke `--stroke-icon` 1.6, marks 2 (31 widths today).

**Motion.** Keep `--t-micro` 120, `--t-element` 220, `--t-surface` 320 (Land, `--ease-land`), `--t-context` 420, `--t-enter` 380, `--t-stagger` 62. Breath 4.2s, with 2.1s and 8.4s. Five eases; 59 curve literals go. The one-second dial is a JS tween on elapsed time, so gate 12 needs no fifth step. `MOTION` is read once per lighting change.

**Colour roles.**

| Role | Dark | Snow, Glass white | Check |
|---|---|---|---|
| `--accent` (was `--gold`) | `#AEBFCB` | `#33516E` | 0.089, 0.091 from nearest seat; 8.9, 7.7 to 1 on panel |
| `--cq-0` floor | `#6B7384` | `#6A7282` | 3.54, 4.51 on panel |
| `--cq-1` | `#8892A3` | `#4F596B` | 0.092 from nearest seat |
| `--cq-2` | accent | accent | the one named exception |
| `--cq-3` | `#E6EEF4` | `#1F2530` | 14.4 to 1 |
| `--rank-1..4` | alias `--cq-0..3` | same | tiers, tracks, root types, layers, loop, paid |

Accent sits 0.052 from `--mid` text, so selection rides on a ring at .8 opacity, never colour alone. `--gold` stays an alias for its 106 reads until `tokens.py` regenerates `funnel/`. Seats: seven names on all seven lightings (dark, Glass, Flat, Punch take `PAL`; Snow, Glass white `PAL_LIGHT`; Lumen `PAL_VIVID`; values unmoved), plus `--stage` and `--stage-ink`. `seatRead()` fills a preallocated table per lighting change; the 47 `PAL` reads in nine files go through it; `canon.js` palettes stay as engine defaults. Alarm `#FF2E1F` is 0.082 from Root, so role and shape separate them. `--lockup-sub` stays `#343434` in the allow list; show the owner 1.35 to 1 beside `#7F8494` (4.51).

**The gate: `tools/coherence.js`.** Static, no browser, host free like `hostfree.py`; `--live` adds Chromium for computed values per lighting. A self test runs first on a fixture with known answers (black on white 21 to 1, old accent against Throat 0.029), because probes in this repo have lied.

CI = 100 x sum of weight x clamp((x - floor) / (target - floor)).

| Term | Weight | Today | Floor | Target |
|---|---|---|---|---|
| roles (colours not within 0.08 of a seat, or aliased with a reason) | .15 | .26 | 0 | 1 |
| chain (hop tests, carried) | .15 | .40 | 0 | 1 |
| seatOne (49 cells in CSS, no `PAL` read outside `seatRead`) | .10 | .21 | 0 | 1 |
| vocab (glossary; retired words: 22 "Source AI", 20 "we", 1 `capitalize`; carried) | .10 | .30 | 0 | 1 |
| colourTok | .10 | .80 | .5 | .95 |
| type (on six steps or a var) | .10 | .31 | .30 | .98 |
| component (95 button root classes) | .10 | 0 | 95 | 12 |
| geometry (radius tokens .47, 4 px grid .35) | .08 | .12 | .4, .3 | .9, .85 |
| motion (.64 tokenised; 59 curves; 23 `transition:all`) | .06 | .11 | .5, 59, 23 | .95, 4, 0 |
| icon (31 stroke widths) | .06 | 0 | 31 | 3 |

Today reads **23**. Pass 1's 37 used softer floors; do not compare. With every move landed it projects **74**, assuming vocab reaches .7 and component stays put. Ratchet in `COHERENCE.json`: any term drops half a point, fail. Floor 40 for the skin round, 65 to ship.

Hard assertions, outside the index: seven seats and `--stage` on all seven lightings; accent 0.08 from every seat on every lighting; `--cq-0` 3 to 1 on stage; JS seat colour equals CSS computed per lighting; no `transition:all`; no duration off the five; no `capitalize` unless `--case` reverts it. Exemptions sit in `tools/coherence.allow.json`, each with a reason. Punch is in it. The gate must never delete a ruled exception.

**Order** (size, file, proof).
1. Gate, self test, baseline. S. `tools/coherence.js`. Self test, then the pre-commit list.
2. Seat sheet, `seatRead`, `rgba` and `mixc` without allocation. M. `head.html`, `ui/component.js`, rings, wheel, map, cone, `ui.js`. Seat assert, design 9, collide, `equiv.py`.
3. Roles: accent, cq, rank, tier values. M. `canon.js`, `head.html`. `equiv.py` names the diff; design 15.
4. Type tokens and codemod, height and wraps measured. M. `head.html`. Design 4, collide, gate 17 edit.
5. Space, radius, z, alpha tokens. S, sweep L. No new literal.
6. Motion object, Compass on elapsed time. M. `ui/cone.js`. Gates 12, 13.
7. Case and words. S. Gate 17, voice check.

## 6. Ranked recommendations

1. Seat sheet on seven lightings, `seatRead`. M, reskin. Marcus, Nils, Sofia.
2. Gate and ratchet first. S, reskin. Renata, Nils.
3. Fix the three failing values before anyone builds on them. S, reskin. Marta, Trey.
4. Six sizes, `font:inherit`, sentence case. M, reskin. Whitney, Marcus.
5. Space, radius, z, alpha tokens. S then L, reskin. Nils.
6. One motion object. M, reskin. Whitney, Marta.
7. `things.js` concept registry and chain join keys. L, redesign; join keys touch Schema v2, the owner's call. Camille, Sofia.

## 7. One question

None.
