GRADE: 70/100

Seat: Kai Moana, animation and VFX director. Pass 1, motion as language. Read only. Measured on `source.html` (commit 65ed759) in Chromium at 1600 wide with the Marcus profile loaded, plus a read of `shell/head.html`, `ui/wheel.js`, `ui/cone.js`, `ui/panels.js`, `ui/release.js`, `ui/railmotion.js`.

| Criterion | Score | Evidence |
|---|---|---|
| Tokens: one set of curves and durations | 8 | 134 uses of `--t-*` (micro 83, element 41, surface 12, context 9, enter 4). Three named curves cover most of it. 10 distinct bezier values in the file, though. |
| Motion carries data | 8 | DQ sets pulse speed (0.7x to 1.5x, `wheel.js` `pulseRate`). Charge above 5 bends the ring on a spring. CQ sets core size and glow. Gap: CQ and vitality have no tempo. |
| One vocabulary (one motion, one meaning) | 6 | "Breathing" means chosen, read, steady load, hearing and alive. Five jobs, one gesture. |
| Timing against the working ranges | 7 | Micro and element are on range. The boot runs 5.24s and `booted` landed at 5685ms from navigation. |
| Physics: anticipation, follow through, weight | 7 | Fringe spring crosses 5 with a backswing. The ease on every bead (`n.disp`) is symmetric, so a release has no weight. |
| Alive at rest | 8 | The Field breathes with nothing happening. Summary, Knowledge and Intake are still. |
| Reduced motion as its own state | 9 | End state, not a faster state. The wheel stops drawing. Chips print and clear on a timer. One flaw below. |
| Frame budget | 7 | `draw()` averaged 1.5ms on this software renderer. Every infinite CSS loop is opacity or transform. But 23 rules say `transition:all` and several tween layout. |
| Release screen | 4 | The card is text and a dial. The product's best motion language is absent from its biggest moment. |
| Fatigue at forty viewings | 6 | Boot plays in full every load (about 3.8 minutes over forty). Rail rings swing to 4% opacity. |

## THE SOUL

The soul of this product, to my eye, is a thing that breathes when it is read and goes still when it is not. The Field is the best of it: thread pulses that run faster as shadow rises, a ring that dents and springs back under load, fringe bands that are born at the ring when a charge expands and sink in when it collapses. With the labels off you could still read where the load sits and which way it is moving. That is motion as data, and it is rare. The skin job is to make the rest of the product speak the same dialect, and to give coherence a motion of its own.

## INVENTORY (what moves)

- Hover and press 120ms, element 220ms, panel 320ms, all ease-out. Tab: 6px rise, 420ms, enter only.
- Field entrance: 380ms a part, 62ms stagger, 900ms total, once a session.
- Bead ease (`disp`): 9.05 a second both ways (90% in 254ms). Fringe and ring bend: springs, w 14 to 20.
- Pulses and bar light: 0.7x to 1.5x on DQ, 9.09s wave. Breath: 4.2s, opacity .64 to 1. Core: 4.49s.
- Boot: 5.0s plus a 0.24s fade, about 40 keyframes. It draws the product's grammar: spine, seven seats, bands, 112 addresses, lens, gold halo.
- Release card: dial set once a second, bar width 420ms.
- Counts: 61 keyframes, 19 infinite loops, 23 `transition:all`.

## WHAT BREAKS COHERENCE (ranked)

1. **Five meanings, one gesture.** `rlring` breathes a selected tile. `chvBreath` breathes a read mask. The fringe breathes a steady load. `srcHalo` breathes "hearing". The wheel breathes everything. A person cannot tell "chosen" from "charged". Cost: the motion cannot be read with the labels off, which is the test I hold it to.
2. **The release screen is silent.** `release.js` has no loop. The dial changes by `setAttribute` once a second with no transition. DQ falls as a number (`relShade`) while the Field's collapse language, built for exactly this, never plays. This is the moment the whole loop exists for.
3. **Selection rings vanish.** `rlring` runs opacity .04 to 1. A selected state is lost for a fifth of every cycle, and ten rings on one clock is the most tiring thing on the rail. The wheel's own wave swings only .64 to 1.
4. **The Compass is tied to the frame rate.** `coneTick` adds a fixed `0.0022` radians per frame and eases at `gap*0.12` per frame. At 60Hz it turns once in 47.6s. At 120Hz, 23.8s, and the hover settle takes half the time. The wheel was fixed to elapsed time (`draw()`); the Compass and its `CONE.t += 1/60` were not.
5. **Three clocks and a drifting breath.** The core breathes at 4.49s, everything else at 4.2s, the DQ wave at 9.09s. The core drifts against the fringes every 65 seconds. In a product that says "harmonic", the periods should be whole ratios.
6. **Weightless release.** A charge dropping from 8 to 2 slides home in about half a second, the same as a charge rising. The rail bars already follow the better rule ("a gain has energy and a loss has weight", `component.js`). The wheel does not.
7. **Boot length.** 5.24s against my range of 400 to 600ms for a full context change. It has a reason (it is the overture) and a way out (press anything), but the way out is not discoverable: the only visible control is the developer Skip.
8. **Reduced motion has three doors.** `REDUCED` is read once at load, so changing the OS setting mid session stops the CSS but not the canvases. `body.quiet`, `body.rm` and the media query are three selector lists. In Punch, `.ib::after{display:none}` drops the selection breath entirely and nothing replaces it.
9. **Direction lost when still.** Under reduced motion the Character page's hot cells go to opacity 1, so expanding and collapsing look identical. The Field keeps the dent; that page does not.

## SKIN RECOMMENDATIONS: THE MOTION SKIN

Three verbs, one stillness, two springs, one clock. Nothing else moves.

**Stillness = unread.** Nothing in the product moves until there is a reading.

**Verb 1, breathe (means: this is read and live).** One period, `B = 4.2s`, opacity .64 to 1, on `--ease-breath`. Used only for the Field's own things and the avatar. Not for selection.

**Verb 2, travel (means: charge in motion, with direction).** Dashes, fringes and light move along a path. Speed is tension (DQ, as now). Outward is expanding, inward is collapsing. Used on the release screen.

**Verb 3, land (means: you changed something).** One overshoot, then rest. 260 to 340ms, `--ease-land`. Replaces the selection breath: a chosen tile lands once, then holds a steady ring at a fixed .8 opacity. A state must be legible at every moment.

**Two springs only.** Land: w 16, damping .55 (about 12% over). Settle: w 13, damping .86 (no ring). Today there are four unrelated pairs (fringe, bend, story stroke, story lane).

**One clock.** Everything runs on elapsed time, `dt` clamped at 100ms as in `wheel.js`. Harmonics of B: B/2 for fast states, 2B = 8.4s for the DQ wave.

### Data mapped to motion

| Data | Motion | New cost |
|---|---|---|
| CQ (coherence) | Breath purity. At 70 and over, a clean sine. Below, add `0.5*(1-CQ/70)*sin(2.7wt+phase)` and renormalise. Low coherence breathes ragged, high breathes clean. | One extra `sin` a frame |
| Vitality (radiance) | Breath depth: .78 to 1 when low, .55 to 1 when high. A flat person breathes shallow. | None |
| DQ | Travel speed (already built) | None |
| Charge change | Attack and release: rise at 9.05 per second, fall at 4.5 per second (tau 220ms, 90% in 510ms). Weight on the way down. | None |
| Gaining or losing | Core halo travels out or in, like the fringes | One gradient scale |

### Changes (effort, ICPs moved)

- **Release as a field, not a card (M).** Behind the card, one quiet ring. Each sealed address: land on the counters, 280ms. "Released" plays the collapse language (fringes sink in). "Installed" plays expand (born at the ring, travel out). Pulse rate follows live DQ, so the Field visibly calms as the number drops. Keep the dial, but give it `transition: stroke-dashoffset 1000ms linear` (linear is right where the value is real time, and nowhere else). Moves S1, S6, S7, S8, S10.
- **Fix Compass timing (S).** `spin += 0.132*dt`, ease `1-exp(-7.7*dt)` (matches .12 at 60Hz), `CONE.t += dt`. Moves everyone on a 120Hz phone or Mac, S1 and S5 most.
- **Selection from breath to land (S).** Floor `rlring` at .45, or replace as above. In Punch, breathe `fill-opacity` .8 to 1 instead of drawing nothing. S6, S7, S9.
- **Core period to 4.2s (S).** `sin(1.4t)` becomes `sin(1.496t)`. DQ wave 9.09s to 8.4s (`PUL_WAVE_HZ` .11 to .119). No visible change except that everything locks.
- **Asymmetric bead ease (S).** `k = 1-exp(-rate*dt)`, `rate = target>disp ? 9.05 : 4.5`.
- **Boot (S to M).** Keep the ruling that it plays in full. Trim the stand from 3.2s to 4.4s by 0.5s (ends 4.7s). Add a quiet "press to skip" line at 1.5s. Optional, and it needs his word: a six line inline script reads the last CQ from `localStorage` and fills the lens ring to that figure, not to 100. The boot then shows your own coherence, and nobody sees the same overture twice. S1, S5, S13.
- **Tab indicator travels (S).** One element, transform only, 280ms, `--ease-land`, across Discover, Play, Flow, Embody, and on wrap it exits right and enters left. The loop closes. S6, S7.
- **Hover rules (S).** Replace the 23 `transition:all` with named properties. Replace width, flex, font-size and max-width tweens where a transform will do.
- **One stillness switch (S).** One function sets `body.still` from the OS setting, `quiet` and `rm`, and listens for the media query changing mid session.

**Frame cost.** No new rAF loop; everything runs inside `loop()`. Added main thread work is under 0.1ms a frame. Every new CSS motion is opacity or transform, compositor only. My ceiling for the skin on the Field is 4ms of script a frame.

**Reduced motion for every item above.** End state, not slower. Release: ring held at mid breath, counters change with no land, dial steps once a second. Breath purity: a static ring thickness (ragged edge) says low CQ without moving. Direction: a static arrow glyph on the hot cell replaces travel on the Character page.

## REDESIGN CANDIDATES

None in motion. One refactor, not a redesign: merge `S.t`, `BM.t` and `CONE.t` into one `CLOCK`. A skin cannot do it because the three are driven from three loops, but the gain is every loop agreeing on time.

## RISKS

- **Never sync light to the 6 Hz theta beat in the release audio.** Keep every visual at 0.3Hz or slower, amplitude under 40%.
- **Breath purity may read as a fault.** Needs one line of copy at first sight and an off switch inside Quiet.
- **Slower fall** delays "done" by about 250ms. Test on the Story commit.
- **Boot personalisation** reverses "no flag is stored". His call.
- **Timings are sandbox numbers** (software renderer). Re-measure on a real phone before shipping the core halo.
