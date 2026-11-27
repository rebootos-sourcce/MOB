# Pass 2: technical director (Anders Kjeld), onboarding round PJ

Read all twelve pass 1 reports (no QA report yet). Checked `tests/design.js` gates 12 and 13 and grepped the gates for the developer drawer. No new measurements.

## 1. AGREEMENTS (seats named)

- **Full bleed stage, no card, no dimmed app:** art, creative, brand, animation, uiux, innovation, me. The opaque stage lets the Field stop drawing.
- **One clock, time based, not `setTimeout`:** me, animation, systems.
- **Hold pauses, thirds navigate, a visible Pause ring must exist:** me, animation, uiux, creative, game, art, brand. Moving content over 5 s needs a stop control (WCAG 2.2.2).
- **The wash `blur(30px)` goes:** me, animation, brand, art.
- **Embed the 143KB webm, never the 2.4MB wav:** me, systems, creative, uiux.
- **Distress is a ship blocker for the first story:** narrative, innovation, creative, game. The clock needs a `distress` pause reason.
- **Gates cannot see the sheet:** me, systems.

## 2. DISAGREEMENTS

- **Voice on the slider: I was wrong.** Six seats cite the ruling that the release opens on his voice. Slider silent, release voiced, one embed, same cost. All ten phrases are `confirmed:false`: cue times are measured so they are safe, the words are not, so captions use the ruled release lines only.
- **Hold to answer the signal test (innovation 5): no.** Hold is already pause. One gesture cannot mean both, and iOS opens a text callout on press and hold. Use three ring chips.
- **Cut only on the exhale (innovation 4): no.** Quantising to a 10 s breath adds up to 10 s of waiting. Keep the breath as decoration, free.
- **CSS `animationend` as the clock (systems): no.** Reduced motion removes the animation, the event never fires, the slider freezes silently. A JS delta clock survives. I take systems' `reasons` idea, as a bitmask integer (zero objects).
- **"Pause while any control has focus" (uiux): only `:focus-visible` on the Pause ring.** A mouse click on Back leaves focus on it and would freeze the slider with no sign.
- **Palette: canon wins** (art). A full screen dark stage multiplies saturation, and two colour languages is the agreed defect. The cost is one edit to `PAL` in `engine/data/canon.js`; `equiv.py` will name that diff and I acknowledge it. Needs art and brand to confirm the seven values first.
- **Sample reading (marketing) vs killed (innovation):** innovation. A real table row is free data; a sample reading is someone else's body.
- **Ring of arcs vs hairline segments:** hairline, `scaleX`, compositor only. A ring repaints through `stroke-dashoffset`, about 0.1ms at 48px (estimate). Allowed for the loop drawing, not the clock.

## 3. WHAT I MISSED

- **The app still animates under an opaque sheet** (animation seat measured `rbwave` and three `rlring`). Stopping `draw` does not stop CSS keyframes. Put `visibility:hidden` on the app root while the stage is up. It also removes the hidden app from tab order and screen readers, which `aria-modal` without a trap never did.
- **Gate 12 allows four transition durations: 0.12, 0.22, 0.32, 0.42 s.** Every seat quotes 380, 520, 600 or 700ms. As CSS transitions those fail. Keyframe animations are exempt by the gate's own comment, so long moves go in the stage canvas or in keyframes.
- **Unexplained 1.37s first frame gap at 1600** (animation). Possibly the blurred layer. Re-measure after it goes.
- **`.ob-leaving`** keeps an invisible sheet taking clicks for 300ms (systems). The stage sets `pointer-events:none` while leaving.

## 4. THE PROPOSAL, TOGETHER (my part: the machine and its tokens)

**Length.** Five timed slides, at most 28 s, then a gate. Not 22 (too thin for the ruled line plus the loop), not 70 (the signal test sits in it). The signal test moves after the first release (marketing, sales, creative agree).

**Dwell.** `1.2 s + words / 3`, clamp 3.0 to 7.0, rounded to 0.1 s (creative, art; the others sit within 0.4 s of it). Reduced motion times 1.5. Built once into the slide table from word counts.

**Clock.** `slTick(dtMs)` inside the existing `loop(ts)`, dt clamped to 50ms. Pause mask bits: hold 1, hidden 2, user 4, typing 8, distress 16. Gate slides stop the clock. Voice: release only, `audio.currentTime` is the clock there.

**Controls.** Skip top right, 12px, 44 by 44 target, lands on the starting point, never the app. Hairline top, one 2px segment per slide, 4px gaps. Bottom row at 390: Back 44, Pause 56, Sound 44, rings. Hold 180ms. Right two thirds next, left third back. Space, arrows, Escape.

**Layers (arithmetic).** Ground, figure SVG (10 nodes), one canvas at DPR 2 cap, two text layers. At 390 by 844, 3x: ground 11.8MB, canvas 780 by 1688 by 4 = 5.3MB, the rest small. About 18MB, under my 24MB cap. JS per frame under 1ms, zero allocation (estimate). Field cost removed: 1.7 to 2.5ms.

**Tokens (needs art, creative, systems to sign).**
- Ground `#06060a` (the login's, no seam). Ink `#EFEDE8`. Accent `#7EB8D4`. Seat hue only on seats.
- Type: 12 (Skip, eyebrow), 16, 28, 40. Hero weight 300, 40px at 1600, 28px at 390, line 1.2, max 22 characters a line. Sentence case, no `text-transform`.
- Transitions: 220 text out, 420 text in with an 8px rise, 420 handoff fade, 320 hold ramp, 120 press. Longer motion is canvas or keyframes.
- Curves: enter `cubic-bezier(.22,1,.36,1)` (animation, creative, uiux agree), out `cubic-bezier(.4,0,1,1)`, breath `cubic-bezier(.37,0,.63,1)`, land `cubic-bezier(.34,1.56,.64,1)` on seats only.
- Prefix `.sl-`; `.ob-*` stays for the login. No `filter`, no `backdrop-filter`, no blend over the stage.

**Agree first.** Narrative: final copy, ruled line on one slide (17 words, 6.9s). Art: palette. Systems: `journey.ground`, `obAct`. Animation: which moves are keyframes. Game: release runs with no account.

## 5. REVISED GRADE: 58/100 (was 61)

Down 3. The app animating underneath (frame cost 4 to 3) and the invisible leaving sheet (compositor 7 to 6) were not in my pass 1. The machine is still small and cheap to replace.

## 6. COST OF EVERY OTHER SEAT'S PROPOSAL

S is under a day, M two to four days, L a week or more. "Breaks" means a gate fails as written.

| Seat | Proposal | Size | Breaks a gate? |
|---|---|---|---|
| Animation | Reel clock and cues | M | No, same as mine |
| | Durations 380, 520, 600, 700ms | S fix | Gate 12, as transitions |
| | Figure into the Field hub, shared move | L | Gate 12 if CSS |
| Art | Stage, one light, 8% glow with 60px blur | S | Gate 13 spirit if it is `filter`; use a pre-baked gradient |
| | Signal test as paced scene | M | `functional.js` lines 2374 to 2416 |
| Brand | Mark top left, six beats, "avatar" after the first read | M | No (the mark is already in the file) |
| | Text in 600ms | S fix | Gate 12 |
| Creative | Stage, five beats, 700ms shared ring move | M, L | Gate 12 at 700ms |
| Game | One path to release with no account | L | `functional.js` onboarding block |
| | Day two reminder push | L | Needs a service worker or network. Breaks one file, gate 7 |
| Innovation | First release is onboarding, deposits live | L | No; the Field is not on screen |
| UIUX | Beat controls, live region, 14 tile screen | S | Tap floor holds at 44; 14 controls is their own limit |
| | Dwell 2.5 + 0.32 per word, 70s | S | Only test time, if gates wait in real time |
| | Tutorial folds into aftercare | M | `functional.js` tutorial lines |
| Marketing | Proof row, 48px tabular figure | S | No |
| Sales | Gift ring, 100 then 88 | S | No |
| | Honour the gift in `planSight` | M | `tests/engine.js` `planSees` assertions, by name |
| Narrative | Script, 80s to slide 12 | M | Over the 28s ceiling |
| | Distress detector, debounced 300ms | L | New engine tests; function is S, clinical text is the L |
| Systems | `obAct`, `journey.ground`, allowlist handover | M | Engine counts rise; `equiv.py` names new items; `hostfree` holds if `fetch` stays in `ui/auth.js` |
| | Refuse non boolean `ui` flags | S | Maybe: `tests/engine.js` 435 to 438 |
| | Palette to canon | S | `equiv.py` named diff; any hue pinning gate |

## 7. TOP 5 RECOMMENDATIONS

1. **Clock, hide the app, stage, in one change. M.** Moves phone only, acute distress, skeptic.
2. **Gate 15 and a login with no `dev=1` run. M.** Every slide at 390, 375 by 667 and 1600: type floor, tap 44, durations, no horizontal scroll, zero `draw` calls while open. Moves practitioner, phone only.
3. **Distress `pause` hook now, detector next. S then L.** The mask bit ships with the clock. Moves acute distress.
4. **Voice: one embed, release only, `canPlayType` guard. S.** +191KB base64, packed +10.8%. Moves acute distress, practitioner.
5. **Tokens: transitions to four steps, palette to canon. S.** Moves skeptic.

## 8. QUESTION FOR THE OWNER

None. Decisions: five slides, 28s ceiling, voice on the release only, hairline progress, canon palette.
