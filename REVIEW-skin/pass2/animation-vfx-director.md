GRADE: 66/100 (was 70)

Seat: Kai Moana, animation and VFX director. Pass 2. I read all twelve pass 1 reports; no QA report had landed. I re-checked in source: 10 distinct `cubic-bezier` values across 53 literals, 23 `transition:all`, `pulseRate()` at `wheel.js:1004`.

## 1. AGREEMENTS

- **The avatar is not on screen and the loop is a row** (Art, Brand, Creative, Game, Innovation, UIUX, Systems, me). Confirmed. Game and I found the same hole from two sides: Commit "pays a status line" and Release "has no loop". With no figure, a release has nothing to land on.
- **Seat hues carry many meanings** (Art 16 meanings, Systems 25 of 34 colours). My "breathing" has five jobs. Art's "alarm has five jobs" is the same defect in colour. One gesture or one colour, one meaning.
- **Locks read as a shop** (Brand, Marketing, UIUX, Sales, Game). Motion view: a sealed thing must be perfectly still. Anything that breathes reads as available.
- **No type scale** (Art 30 sizes, Narrative 31, UIUX 38, Technical 43). The counts differ by method. The direction is shared.
- **Two sources of truth** (Technical, Systems). Seats live in CSS and in `canon.js`. Motion has the same split: CSS uses `--t-*` while keyframes and canvas easing (`n.disp` 0.14, `ENTER_SPAN`) are typed in place.
- **390 pill over the zoom buttons** (nine seats). Place it, never animate it.

## 2. DISAGREEMENTS

- **Innovation: "58 keyframes, none reads data."** Wrong. The data motion is in canvas, not keyframes. `pulseRate(r)` sets pulse speed from DQ, the ring bends on a spring above charge 5, fringes are born and sink with charge direction. A grep of `@keyframes` cannot see it. Their motion score of 6 should be 8.
- **Innovation: lamp test, every dial sweeps full scale on load.** Decline. The boot already is the lamp test. A second sweep flashes "100" at someone with nothing read, a false reading. One overture.
- **Innovation: goniometer plotted from the release audio** (a left against right scope). Decline as written. The binaural beat is about 6 Hz, so a trace following it moves at 6 Hz, inside the flicker hazard band. If built, plot a smoothed envelope at 0.3 Hz or slower, under 40% amplitude.
- **Game and Art: the figure never goes dark, "low is dark, not wrong".** I side with them and withdraw my own idea of a ragged breath at low CQ (coherence). Art's simulated panel has 8,288 of 10,000 below CQ 50. Most people would see a ragged, dim hub, which reads as punishment.
- **Creative: a thin arc from the reading to the ceiling.** Keep it, but it must not act as a progress bar (Innovation's baseline: kill it). It never fills on a timer and shows no percent. It moves only when a release lands.
- **Sales and Innovation: dashed strokes** now mean not drawn, locked, and stated only, and I wanted moving dashes to mean charge travelling. Settle it: a still dash means not measured or not open. A moving dash means charge travels, on solid measured paths only. Stillness separates them.
- **Is the ring loop a skin or a redesign** (UIUX, Innovation, Creative)? A skin, if it is a drawing with the current station lit that opens the four doors on tap. It is a redesign only if each arc must be a 44px target, which cannot fit at 390.
- **Source OS contrast.** Not motion. I back Brand: show the owner the contrast number beside his hex.
- **Case.** Narrative, Brand and Creative pick sentence case. I agree: `CLAUDE.md` is standing, and `DECISIONS.md:349` ("a capital on every word") is older. Sentence case wins, proper names keep capitals. Narrative builds it.

## 3. WHAT I MISSED

- **Compass is at the frame ceiling** (Technical: 7.3ms a frame against an 8ms line; Body 4.6ms; node counts over ceiling on both). My elapsed-time fix is also a budget job, and nothing persistent goes on those two canvases.
- **Only 16 of 98 animations use motion tokens** (Technical), 50 literal durations (Systems). I graded tokens off transitions alone. Now 6, not 8.
- **Gate 12 hard-codes 0.12, 0.22, 0.32, 0.42 s** (Technical). My 280 to 340ms Land needs a named edit.
- **Most people read low** (Art, Marketing: demo Marcus 62, simulated S1 median 34). I tuned the skin to the demo.
- **The unread Field is a dead dial** (Innovation, Marketing). My "stillness means unread" deadens it further. It needs a staged cue.
- **Ritual and Intake were not shot** (Creative, Innovation, UIUX). My review shares that gap.

## 4. THE SKIN, TOGETHER (my part)

**Four verbs, one meaning each.**

| Verb | Means | Spec |
|---|---|---|
| Still | unread, sealed, not open | no movement. Locks, locked orbs, unread Field |
| Breathe | a reading exists | 4.2s, opacity .64 to 1, one clean sine, same for everyone. Field core and the figure only |
| Travel | charge in motion | speed from DQ (built, 0.7x to 1.5x). Out expands, in collapses. Seat hue, solid paths only |
| Land | you changed something | 260 to 340ms, `cubic-bezier(.34,1.56,.64,1)`, then rest. A chosen tile holds .8 opacity, never below .45 |

- **Clock.** One `CLOCK` in elapsed seconds, `dt` clamped at 100ms. Periods are 2.1, 4.2 or 8.4s only.
- **Springs.** Land: w 16, damping .55. Settle: w 13, damping .86. Four unrelated pairs today.
- **Weight.** Charge rises at 9.05 a second and falls at 4.5.
- **Tokens from one place.** `--breath:4.2s`, `--ease-land`, `--t-land:300ms`, read once per lighting change into a `MOTION` object, as Technical proposes for seat colour. 53 curve literals collapse to three named curves plus Land.
- **No colour in motion.** Hue comes from the seat. Accent marks controls only (Art).
- **Loop ring (Art, UIUX, Brand).** The lit arc turns clockwise only, 280ms Land, 420ms at most across two stations. Embody to Discover wraps forward, so the loop is never seen turning back. One transform on one element.
- **Unread Field (Marketing, UIUX).** The promise line enters on the existing 380ms and 62ms stagger. At 1.5s the "write" door takes one Land ring, once, never looped.
- **Release and Commit (Game).** A quiet ring behind the card. Each sealed address lands on its seat counter. Collapse plays on release, expand on install. Pulse rate follows live DQ. The dial gets a 1000ms linear transition, the one place linear is true because it is real time. Commit: imprints settle on their lanes, one breath, under two seconds, no confetti.
- **Figure (Game, Creative, Brand).** One breath only. On the Field the figure is the hub's breath. Elsewhere a small figure breathes by one CSS opacity on one element, in phase with the clock, and is still on Compass and Body. Never dimmed on a missed day.
- **Needle (Innovation's set hand).** Settle spring, one overshoot, ghost hand static.
- **Stillness switch.** One function sets `body.still` from the OS setting, `quiet` and `rm`, and listens for the setting changing.

**To agree first.** Art: no seat hue on a moving mark except Travel. Technical: the `MOTION` object, the gate 12 edit, and no persistent motion on Compass or Body. Game: the figure's floor and the Commit beat. UIUX: the ring is a drawing, not four targets. Narrative: copy for the unread promise line.

## 5. REVISED GRADE: 66/100 (was 70)

- Tokens 8 to 6 (16 of 98 animations tokenised, 50 literal durations).
- Frame budget 7 to 6 (Compass 7.3ms, node ceilings passed).
- Release 4 to 3 (Commit pays a status line, which I had not walked).
- Reduced motion 9, alive at rest 8 and motion carries data 8 stand.

## 6. TOP 5 RECOMMENDATIONS

1. **One CLOCK, one MOTION object, Compass on elapsed time (S to M).** `spin += 0.132*dt`, ease `1-exp(-7.7*dt)`. Core 4.49s becomes 4.2s, DQ wave 9.09s becomes 8.4s. One Compass turn takes 47.6s at 60Hz and 23.8s at 120Hz today. Moves S1, S3, S7, anyone on a fast screen.
2. **Release and Commit land (M).** Ring, counters, collapse and expand, linear dial. The loop's biggest moment stops being silent. S1, S6, S8, S10.
3. **Four verbs, with locks and unread still (S).** Selection from breath to Land, floor .45. Dashes stay still. S3, S4, S6, S13.
4. **Loop ring that turns clockwise only (M).** S4, S6, S7, and Angela and Derek.
5. **Asymmetric bead ease, `transition:all` cut (S).** Rise 9.05, fall 4.5. Named properties, compositor only. All ICPs, older laptops.

Boot trims (0.5s off the stand, a quiet "press to skip" at 1.5s) wait behind these. Personalising the boot ring reverses "no flag is stored", so it is his call only if he asks.

## 7. ONE QUESTION

None. Decision: the Field breathes the same clean breath for everyone. Coherence shows by number and core size, never by ragged or dim motion. Reason: most people read low, and motion that degrades with a low score reads as punishment.
