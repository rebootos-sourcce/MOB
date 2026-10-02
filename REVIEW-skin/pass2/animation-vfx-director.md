GRADE: 66/100 (was 70)

Seat: Kai Moana, animation and VFX director. Pass 2. I read all twelve pass 1 reports. No QA measurement report had landed. I re-checked three numbers in source: 10 distinct `cubic-bezier` values across 53 literals, 23 `transition:all`, and `pulseRate()` at `wheel.js:1004`.

## 1. AGREEMENTS (two or more seats, independent)

- **Soul is "an instrument that reads"** (Innovation, Brand, Creative, Art, me). Motion can say it: an instrument settles, it does not bounce for fun.
- **The avatar is not on screen, and the loop is a row** (Art, Brand, Creative, Game, Innovation, UIUX, Systems, me). Confirmed. Motion cost: with no figure there is nothing for a release to land on, so my release screen stays silent. Game and I found the same hole from two sides: Commit "pays a status line", Release "has no loop".
- **Seat hues carry many meanings** (Art 16, Systems 25 of 34 colours, Creative, Brand). Motion adds to it. My "breathing" has five jobs. Art's "alarm has five jobs" is the same defect in colour. One gesture or one colour, one meaning.
- **Locks read as a shop** (Brand, Marketing, UIUX, Sales, Game). Nine padlocks on the first screen. Motion view: a sealed thing must be perfectly still. Anything that breathes reads as alive and available.
- **Type has no scale** (Art 30, Narrative 31, UIUX 38, Technical 43, Systems 38). The count depends on how each seat counts. The direction is shared, so I do not argue the figure.
- **Two sources of truth** (Technical, Systems). Seats live in CSS and in `canon.js`. Motion has the same split: CSS transitions use `--t-*` (132 of 229, Systems) while keyframes and canvas easing (`n.disp` 0.14, `ENTER_SPAN`) are typed in place.
- **390 pill over the zoom buttons** (nine seats). Not a motion defect. I add one thing: do not animate the move. Place it.

## 2. DISAGREEMENTS

- **Innovation: "58 keyframes, none reads data."** I disagree. The data motion is in the canvas, not in keyframes. `pulseRate(r)` sets pulse speed from DQ, the ring bends on a spring above charge 5, fringes are born and sink with charge direction. A grep of `@keyframes` cannot see it. Innovation's grade of 6 for motion as function should read 8.
- **Innovation: lamp test (every dial sweeps full scale on first load).** I decline. The boot already is the lamp test: it draws spine, seats, bands, 112 addresses, lens. A second sweep to full scale flashes "100" at a person who has nothing read, which is a false reading. Pick one overture.
- **Innovation: goniometer plotted from the release audio.** I decline as proposed. The binaural beat is about 6 Hz. A trace that follows the left minus right difference in real time moves at 6 Hz, inside the band where flicker is a hazard. If built, plot a smoothed envelope at 0.3 Hz or slower, amplitude under 40%. Plot the real audio, but never at the audio's own speed.
- **Game and Art: figure must never go dark, low coherence is "dark, not wrong".** I side with them and **withdraw my own idea**: a ragged breath at low CQ. Art quotes a simulated panel where 8,288 of 10,000 sit below CQ 50. That would give most people a ragged, shallow, dim hub, which reads as punishment. New rule below.
- **Creative: a thin outer arc from the reading to the ceiling.** Keep the arc. It must not behave as a progress bar (Innovation's baseline: kill the progress bar). So it never fills on a timer. It changes only when a release lands, by the Land verb, and it never shows a percentage.
- **Sales: dashed outer ring on the lock, and Innovation: dashed line for "stated, not measured".** Dashed now has three meanings (not drawn, stated only, locked) and I wanted moving dashes to mean "charge travelling". Settle it: a dashed stroke that is still means "not measured or not open". A dash that moves means charge travels, and only on a solid, measured path. Stillness separates them.
- **UIUX and Innovation: ring loop at 390 is hard.** Is the ring a skin or a redesign? A skin, if it is a drawing of the loop with the current station lit, and it opens the four doors on tap. It is a redesign only if the four arcs must each be a 44px target. They cannot fit at 390. Skin it.
- **Source OS contrast.** Not mine. Motion neutral. I back Brand's fix of showing the owner the contrast number beside his hex.
- **Case ruling.** Narrative, Brand, Creative all pick sentence case. I agree: `CLAUDE.md` is the standing rule, and `DECISIONS.md:349` ("every word") is older. Sentence case wins, proper names keep capitals. No motion reason for this, so I leave the build to Narrative.

## 3. WHAT I MISSED

- **Compass is at the frame ceiling already** (Technical: 7.3ms a frame against an 8ms line; Body 4.6ms; node counts over ceiling on both). My Compass fix to elapsed time is correct but is also a budget job. Anything persistent I add stays off those two canvases.
- **Only 16 of 98 animations use motion tokens** (Technical) and 50 literal durations (Systems). I graded tokens at 8 off transitions alone. Wrong. Now 6.
- **Gate 12 hard-codes 0.12, 0.22, 0.32, 0.42 s** (Technical). My 280 to 340ms Land and the arc travel need a named edit.
- **Majority of people read low** (Art, Marketing: demo Marcus 62, median S1 34). I tuned the skin to the demo.
- **The unread Field is a dead dial** (Innovation, Marketing). My "stillness means unread" makes it deader. I need a staged cue.
- **Ritual and Intake were not shot** (Creative, Innovation, UIUX). My review has the same gap.

## 4. THE SKIN, TOGETHER (my part)

**Motion verbs. Four, one meaning each.**

| Verb | Means | Spec |
|---|---|---|
| Still | unread, sealed, not open | no movement. Locks, locked orbs and unread Field never move |
| Breathe | a reading exists | 4.2s, opacity .64 to 1, one clean sine, same for everyone. Field core and the avatar figure only |
| Travel | charge in motion | speed from DQ (built, 0.7x to 1.5x). Out is expanding, in is collapsing. Seat hue, solid paths only |
| Land | you changed something | 260 to 340ms, `cubic-bezier(.34,1.56,.64,1)`, then rest. Chosen tile settles at .8 opacity, never below .45 |

- **Clock.** One `CLOCK` in elapsed seconds, `dt` clamped to 100ms. Harmonics of 4.2s only: 2.1, 4.2, 8.4.
- **Springs.** Land: w 16, damping .55. Settle (needles, ring): w 13, damping .86. Four unrelated pairs today.
- **Weight.** Charge rises at 9.05 a second, falls at 4.5. Falling has weight.
- **Tokens, CSS and JS from one place.** `--breath:4.2s`, `--ease-land`, `--t-land:300ms`, read once per lighting change by `getComputedStyle` into a `MOTION` object. This is Technical's single read path, applied to time. Needs Technical and Systems to agree the object name.
- **Motion carries no colour meaning.** Hue comes from the seat. Accent marks only controls (Art: never inside a data mark).
- **Loop ring (with Art, UIUX, Brand).** The lit arc turns clockwise only, 280ms Land, 420ms max for two stations. Embody to Discover wraps forward, so the ring is never seen turning back. One transform on one element.
- **Unread Field (with Marketing, UIUX).** The promise line enters on the existing 380ms and 62ms stagger. At 1.5s the "write" door gets one Land ring, once, never looped. A staged cue, not a loop.
- **Release (with Game).** Quiet ring behind the card. Each sealed address lands on its seat counter. Collapse plays on release, expand on install. Pulse rate follows live DQ. Dial transition 1000ms linear, the one place linear is true (real time). Commit gets Game's beat: imprints settle on their lanes, one breath, under two seconds, no confetti.
- **Figure (with Game, Creative, Brand).** One persistent breath. If the figure is on the Field it is the hub's breath, not a second one. Elsewhere a small figure breathes by one CSS opacity on a single element, in phase with the clock. Still on Compass and Body (budget). Never dimmed on a missed day.
- **Needle (adopting Innovation's set hand).** Spring "Settle", one overshoot, ghost hand static.
- **Stillness switch.** One function sets `body.still` from the OS setting, `quiet` and `rm`, and listens for the media query changing. Locks and unread state are always still.
- **Hover rules.** 23 `transition:all` become named properties. 53 `cubic-bezier` literals collapse to the three named curves plus Land.

**To agree before building.** Art: no seat hue on any moving mark except Travel, and dashes stay still. Narrative: one line of copy so quiet ring and "pressed to skip" read as plain text. Game: the figure's floor and the Commit beat. Technical: `MOTION` object, gate 12 edit, no persistent motion on Compass or Body. UIUX: the ring is a drawing, not four targets.

## 5. REVISED GRADE: 66/100 (was 70)

- Tokens 8 to 6: the 16 of 98 keyframe animations, 50 literal durations (Technical, Systems).
- Frame budget 7 to 6: Compass at 7.3ms a frame, node ceilings passed on Body and Compass (Technical).
- Release and Commit 4 to 3: Game found Commit pays a status line, which I had not walked.
- Unchanged: reduced motion 9, alive at rest 8, motion carries data 8.

## 6. TOP 5 RECOMMENDATIONS

1. **One CLOCK, one MOTION object, Compass on elapsed time (S to M).** `spin += 0.132*dt`, ease `1-exp(-7.7*dt)`. Core and DQ wave to whole ratios of 4.2s. A turn today takes 47.6s at 60Hz and 23.8s at 120Hz. Moves all ICPs on a fast screen, S1, S3, S7.
2. **Release and Commit land (M).** Ring, counters, collapse and expand, 1000ms linear dial. The loop's biggest moment stops being silent. S1, S6, S8, S10.
3. **Four verbs, with locks and unread still (S).** Selection from breath to Land with floor .45. Locks never move. Dashes still. S3, S4, S6, S13.
4. **Loop ring that turns clockwise only (M).** One element, transform, 280ms, wraps forward so the loop closes. S4, S6, S7, and Angela and Derek on the grid.
5. **Asymmetric bead ease and the cut of `transition:all` (S).** Rise 9.05 a second, fall 4.5. Named properties only. Compositor only, no layout tweens. All ICPs, and older laptops (Technical).

Boot trims (stand 0.5s shorter, a quiet "press to skip" at 1.5s) stay in the backlog behind these five. Personalising the boot ring to last CQ reverses "no flag is stored", so I make it his call only if he asks.

## 7. ONE QUESTION

None. Decision: the Field breathes the same clean breath for everyone. Coherence is carried by numbers and core size, never by a ragged or dim motion. Reason: most people read low, and motion that degrades with a low score reads as punishment.
