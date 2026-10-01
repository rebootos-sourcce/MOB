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

1. **Five meanings, one gesture.** Breathing marks a chosen tile (`rlring`), a read mask (`chvBreath`), a steady load (fringe), "hearing" (`srcHalo`) and everything on the wheel. A person cannot tell "chosen" from "charged". It fails my test: read the motion with the labels off.
2. **The release screen is silent.** `release.js` has no loop. The dial changes by `setAttribute` once a second with no transition. DQ falls as a number while the collapse language built for exactly this never plays. It is the moment the whole loop exists for.
3. **Selection rings vanish.** `rlring` runs opacity .04 to 1, so a selected state disappears for a fifth of each cycle. The wheel's own wave swings only .64 to 1.
4. **The Compass is tied to the frame rate.** `coneTick` adds a fixed 0.0022 radians a frame and eases at `gap*0.12` a frame. One turn takes 47.6s at 60Hz and 23.8s at 120Hz. `CONE.t += 1/60` too. The wheel was fixed to elapsed time; the Compass was not.
5. **Drifting breath.** The core breathes at 4.49s, everything else at 4.2s, the DQ wave at 9.09s. The core slips against the fringes every 65 seconds. A "harmonic" product should use whole ratios.
6. **Weightless release.** A charge falling from 8 to 2 slides home as fast as one rising. The rail bars already follow the better rule (a gain has energy, a loss has weight); the wheel does not.
7. **Boot length.** 5.24s against my 400 to 600ms for a context change. It has a reason (the overture) and a way out (press anything), but the way out is not discoverable. The only visible control is the developer Skip.
8. **Three reduced motion doors.** `REDUCED` is read once at load, so a mid session OS change stops the CSS and not the canvases. `quiet`, `rm` and the media query are three selector lists. Punch drops the selection breath entirely (`.ib::after{display:none}`). The Character page's hot cells go to opacity 1, so expanding and collapsing look the same.

## SKIN RECOMMENDATIONS: THE MOTION SKIN

Three verbs, one stillness, two springs, one clock.

- **Stillness means unread.** Nothing moves until there is a reading.
- **Breathe means read and live.** One period, 4.2s, opacity .64 to 1. Field and avatar only. Never selection.
- **Travel means charge in motion.** Dashes, fringes and light along a path. Speed is tension (DQ). Outward is expanding, inward is collapsing.
- **Land means you changed something.** One overshoot then rest, 260 to 340ms, `--ease-land`. A chosen tile lands once, then holds a steady ring at .8 opacity. A state must be legible at every moment.
- **Two springs.** Land: w 16, damping .55 (about 12% over). Settle: w 13, damping .86. Today there are four unrelated pairs.
- **One clock.** Elapsed time with `dt` clamped at 100ms, as `wheel.js` does. Harmonics of 4.2s only: 2.1s, 4.2s, 8.4s.

### Data mapped to motion

| Data | Motion | New cost |
|---|---|---|
| CQ | Breath purity. Clean sine at 70 and over. Below that add `0.5*(1-CQ/70)*sin(2.7wt+phase)` and renormalise, so low coherence breathes ragged | one `sin` a frame |
| Vitality | Breath depth: .78 to 1 when low, .55 to 1 when high | none |
| DQ | Travel speed (built) | none |
| Charge change | Rise 9.05 a second, fall 4.5 (90% in 510ms). Weight on the way down | none |
| Gaining or losing | Core halo travels out or in, as the fringes do | one gradient scale |

### Changes (effort, ICPs moved)

- **Release as a field (M).** One quiet ring behind the card. Each sealed address lands on the counters (280ms). Released plays collapse, installed plays expand. Pulse rate follows live DQ, so the Field calms as the number drops. Dial gets `transition: stroke-dashoffset 1000ms linear` (linear is right only where the value is real time). S1, S6, S7, S8, S10.
- **Compass on elapsed time (S).** `spin += 0.132*dt`, ease `1-exp(-7.7*dt)`, `CONE.t += dt`. Anyone on a 120Hz screen.
- **Selection from breath to land (S).** Floor `rlring` at .45. In Punch, breathe `fill-opacity` .8 to 1. S6, S7, S9.
- **Lock the periods (S).** Core `sin(1.4t)` to `sin(1.496t)`. DQ wave 9.09s to 8.4s (`PUL_WAVE_HZ` .11 to .119).
- **Asymmetric bead ease (S).** `rate = target>disp ? 9.05 : 4.5`.
- **Boot (S to M).** Keep the ruling that it plays in full. Trim the 1.2s stand by 0.5s (ends 4.7s). Add a quiet "press to skip" line at 1.5s. Optional and his call: a short inline script fills the lens ring to the person's last CQ instead of 100, so the overture shows their own coherence. S1, S5, S13.
- **Tab indicator travels (S).** One element, transform only, 280ms, `--ease-land`, across Discover, Play, Flow, Embody. On wrap it exits right and enters left, so the loop closes. S6, S7.
- **Hover rules (S).** Replace 23 `transition:all` with named properties. Swap width, flex and font-size tweens for transforms.
- **One stillness switch (S).** One function sets `body.still` from the OS setting, `quiet` and `rm`, and listens for the media query changing.

**Frame cost.** No new rAF loop; all inside `loop()`. Added script under 0.1ms a frame. New CSS is opacity or transform, compositor only. Ceiling for the skin on the Field: 4ms of script a frame (`draw()` measured 1.5ms on a software renderer).

**Reduced motion.** End state, never slower. Release: ring held at mid breath, counters change without landing, dial steps each second. Low CQ shows as a static ragged ring edge. Direction on the Character page shows as a static arrow glyph.

## REDESIGN CANDIDATES

None in motion. One refactor, not a redesign: merge `S.t`, `BM.t` and `CONE.t` into one `CLOCK`. A skin cannot do it because the three are driven from three loops, but the gain is every loop agreeing on time.

## RISKS

- **Never sync light to the 6 Hz theta beat in the release audio.** Keep every visual at 0.3Hz or slower, amplitude under 40%.
- **Breath purity may read as a fault.** Needs one line of copy at first sight and an off switch inside Quiet.
- **Slower fall** delays "done" by about 250ms. Test on the Story commit.
- **Boot personalisation** reverses "no flag is stored". His call.
- **Timings are sandbox numbers** (software renderer). Re-measure on a real phone before shipping the core halo.
