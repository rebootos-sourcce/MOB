GRADE: 68/100 (pass 1 was 56, pass 2 was 60)

Seat: Anders Kjeld, technical director. "Measured" means sandbox Chromium, no GPU: it ranks things, it is not a device figure.

## 1. The proposal in three sentences
- One light figure, drawn once per reading change and breathed by CSS opacity, is the hub of the Field, the head of Summary and the centre of Avatar; one closed four-arc ring sits behind the four section buttons; one grammar (hue is place, six type steps, four radii, four motion verbs, one lock mark) replaces what each surface does alone.
- The merge bent three things. "Tiers move to a slate ramp" is right for chain and paid tiers, but `TIERCOL` in `canon.js` holds ten embodiment bands the owner ruled must each carry a colour (gate 15 asserts it), so those ten stay. "A quarter lit by the newest dated act" has no data behind it (plan item L1, later), so the ring ships unlit. "Four doors while unread" collides with slice P18b, which replaces four doors with one Next.
- It leaves Body (1,589 SVG nodes) and Compass (1,890 nodes, 7.3 ms a frame) over my ceilings. The skin adds nothing there, and fixes only the Compass clock.

## 2. The ICP room
- **Marcus, level 7.** Sees the lit figure in the wheel centre and one ring. Stays: the figure adds 0 ms to the Field's 4.2. Leaves if Compass drops frames. "It finally looks like one thing."
- **Whitney, phone only, level 5.** Sees the 390 Field with the pill clear of the zoom buttons. Taps the 44 px ring button. Leaves on the 5.5 s boot hold (measured, gate 11). An old phone runs the Field at 8 to 12 ms (estimate: 2 to 3 times 4.2). "Why is it still loading?"
- **Nils, skeptic.** Sees Start Case gone and Arial gone from Summary. Counts sizes in devtools (43 today, six after). Leaves if he finds two alarm reds. "Show me the token file."
- **Camille, practitioner.** Sees a still outline, no number, one sealed mark. Stays. "It does not tell me what to think."
- **Marta, acute distress.** Sees the unread screen, one sentence, nothing moving (unread draws once; the reduced motion path already does this). J0 (distress detection) is not a skin job and must ship first. "Please stop moving."
- **Renata, operator.** Sees no speed change. Checks the gates and the 3.7 MB file size. Stays if gates are green. "Show me the frame time."
- **Trey, quiz tourist.** Sees a hero sentence and one door. Takes it. Leaves on the boot hold. The funnel reads `funnel/tokens.css` (from `:root`, by `tools/tokens.py`), so tokens reach him free if `--gold` stays an alias. "Fine, what do I do now?"
- **Sofia, loves the tables.** Sees the quiet fifth door and goes straight in. The skin adds no chrome there. Sentence case must keep proper nouns (Root, Sacral) through one `.proper` class. "Where is the full list?"

## 3. Unified quality: 72 of 100
Three gaps left:
1. **Two colour owners and two clocks until S2 and S4 land.** CSS and `canon.js` both hold the seven seats. `rgba()` and `mixc()` at `ui/component.js:809` make new objects every Field frame (pass 2: 2.7 to 16.7 MB a second). Compass runs at twice speed at 120 Hz.
2. **Half the skin waits on other blocks.** The hub and unread stage touch `component.js` and `ui.js` (J4, P18b). The lock mark touches `ui/lock.js` (P11).
3. **Surfaces over ceiling.** 4,016 DOM nodes on the Field against my 3,000. Nobody owns it.

## 4. Final grade: 68
Up from 60: every move is costed, sequenced and gated. Held back: rAF allocation is unmeasured on a heap timeline, the 11, 13, 16, 20, 28, 44 scale is untested (I measured seven steps and five), and there is no real GPU.

## 5. My part of the build spec

**Ceilings on every step.** 0.5 ms a frame of added script, zero objects per frame, 60 added static SVG nodes a surface, no new backdrop, no large blur, `shadowBlur` under 20, motion on transform and opacity only.

**Figure cost (estimate).** The Aura mockup measured 29 to 35 ms a frame, so it cannot be live. Drawn once, a 12 pass blurred stroke at 360 px measured 2.8 ms; I budget 35 ms once, in `requestIdleCallback`, keyed on a rounded hash of CQ and the seven charges. After that 0 ms script: breath is `animation:breathe 4.2s` on opacity 0.82 to 1.0, compositor only. Memory 2 MB at 360 px; cap ratio at 2.

**Tokens (`shell/head.html`).** `--fs-1..6` = 11, 13, 16, 20, 28, 44. Weights 400, 500, 600. `--r-1..4` = 4, 10, 16, 999. `--sp-1..` on 4 px, new code only. `--label-case:none`, with `text-transform:var(--label-case)` on the label classes. Icons on `.ib svg`: stroke 1.6, round cap and join; Punch keeps fills. `--alarm:#FF2E1F` unchanged. Seven seat tokens on all seven lightings, glasswhite included. Periods 2.1, 4.2, 8.4 s; durations 0.12, 0.22, 0.32, 0.42 s; `dt` clamped at 0.1 s.

**Build order (size, file, gate).**
1. Not mine, first: J9 (S) and J5 (S), tiny, in parallel. Then J3, then J4 (L).
2. **S1 tokens. S.** `head.html`, then `python3 tools/tokens.py`. First rerun my codemod on the six steps; if more than 5 strings wrap, keep 12 and 14 as chrome only. Gates 3, 4, 8, 12, collide, funnel.
3. **S2 canvases read tokens. M.** One preallocated `SEATTOK`, filled once in `setLighting` via `getComputedStyle`, never in a frame. Precompute `RGBA[seat][alpha]` at 16 alpha steps so the loop builds no strings. `component.js`, `wheel.js`, `rings.js`, `cone.js`, `map.js`. Engine untouched, so no `equiv.py` diff. Gate 15, functional.
4. **S3 stillness, Compass on elapsed time, 390 pill. S.** `wheel.js`, `cone.js` (`coneTick`), `head.html`. Gate 13.
5. **S4 `MOTION` and one clock. M.** `component.js` by `REDUCED`; 23 `transition:all` named by property. Gate 12.
6. **S5 figure. M, after J4.** `component.js`, `avatarui.js`, `summary.js`. Needs a derived `figureKey()`: the word avatar appears zero times in the Field renderers. Gates 12, 13, functional.
7. **S6 lock mark. M, inside P11.** `ui/lock.js`. `tests/locks.js` is untouched: opacity under 1 still passes it.
8. **S7 names. S, after J5.** In `engine/core.js`: `nm:'Masks'` on `TAB.MASKS`, `sec:'embody'` on `TAB.INTAKE`, Knowledge out. No integer moves. Gate 2, functional.
9. **S8 ring. M.** 12 static SVG nodes behind `.secb`, drawn from `SECTIONS` by `.k`. Unlit until L1.
10. **S9 unread stage. M, after P18b.** I build the container (hero, privacy line, stillness); P18b's Next fills it. Four doors stay until it swaps them.
11. **S10 engine data. L, last.** One CQ colour, seat chroma, three palettes in `canon.js`. `BUILD-engine.sh`, then `tools/equiv.py`, acknowledging each named diff.

**Gate edits, by name.**
- **Gate 12, motion is named.** `ALLOW` stays 0.12, 0.22, 0.32, 0.42 s. It reads `transitionDuration` only, so a 4.2 s breath animation passes. Add: `MOTION` exists and every period is in {2.1, 4.2, 8.4}. No fifth step; the proposal dropped the one second dial.
- **Gate 13, frame rate.** Lightings are read at run time, so none is added by hand. Add: an unread Field makes at most 2 wheel `clearRect` calls a second, and the figure layer animates opacity only. The 30 fps backstop stays at 30.
- **Gate 14, the boot.** No edit. It proves the skin added no `.boot-skip` line.
- **Gate 15, the alarm law.** Alarm literal and `TIERCOL`'s ten hex keys stay. Add: each `SEATTOK` value equals its `canon.js` default on dark (nothing checks this today), and `.s-pband b` still equals `TIERCOL[tier]`.
- **Gate 17, plain in a label class.** The finder tests `textTransform==='capitalize'`, so deleting the rule crashes it at its first assert. Edit: match `var(--label-case)` (I checked the CSSOM reads that string back) and read the token. `none` asserts and skips the sweep; `capitalize` runs it as today. One token reverts it, the gate stays alive.
- **Gate 9, not on your list but hit.** Accent loses chroma; gate 9 needs it equal across dark lightings.

## 6. Ranked recommendations
1. Canvases read tokens, `rgba` stops allocating (S2). M, reskin. Marcus, Whitney, Renata.
2. Stillness while unread, 390 pill, Compass clock (S3). S, reskin. Marta, Whitney.
3. Token layer and the six step scale (S1). S to M, reskin. Nils, Whitney, Trey.
4. Pre drawn figure on a derived `figureKey()` (S5). M, reskin for the draw, redesign for the data path. Marcus, Camille.
5. Lock mark built inside P11, not beside it (S6). M, reskin. Camille, Trey.
6. Sentence case on one token with the gate 17 edit. S, reskin. Nils, Sofia.
7. Heap timeline of the Field before and after S2. S. Renata.

## 7. One question for the owner
None.
