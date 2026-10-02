# Pass 3: Kai Moana, animation and VFX director

GRADE: 68/100 (pass 1 was 70, pass 2 was 66)

I re-read the code behind my part before writing this. Three facts changed my spec, and they are in section 5.

## 1. THE PROPOSAL IN THREE SENTENCES

- "Tare" puts one pre-drawn light figure on the Field, Summary and Avatar, shows the loop as one closed ring in the top bar, and holds every surface to one grammar of colour, type, shape and motion.
- Motion becomes four verbs (still, breathe, travel, land) on one clock and one `MOTION` object, so a thing moving always means one thing.
- What the merge bent: "still means unread" became a dead first screen, Land lost how the figure is fed, and the Compass fix shrank to one line when it is six defects.

## 2. THE ICP ROOM (motion view, ten seconds on the Field)

- **Marcus, founder, level 7.** Sees the 4.2 s breath and pulses that follow his DQ (his habit-running score). Taps a seat, feels one Land. Stays. "It moves like it knows me."
- **Whitney, phone only, level 5.** Same breath, no hover, so tap is her only verb. Stays if the tap answers inside 120 ms. "Did that register?"
- **Nils, design skeptic.** Counts curves: 10 distinct easings in 53 rules today, three plus Land after. Leaves at any loop with no job. "Show me what the wobble is for."
- **Camille, somatic practitioner.** Reads 4.2 s as a slow breath cycle, so it must be the same for everyone and never speed up. Stays. "Do not pace my client for them."
- **Marta, acute distress.** Unread: a still outline and one sentence. Nothing faster than the breath. Stays only on calm. "Please do not flash at me."
- **Renata, operator.** Opens it forty times. Land is 320 ms and only on her own change. Stays. "It stayed out of my way."
- **Trey, quiz tourist.** Arrives unread. A still outline is a dead dial, so he leaves in four seconds without one cue. "Nothing is happening."
- **Sofia, open tables.** Barely looks at the Field. The figure is the only thing breathing, so nothing competes with her door. Stays. "Where is the data?"

## 3. UNIFIED QUALITY: 72/100

Against one voice of motion from first screen to habit. Three biggest gaps left:

- **Unread is still the first screen for most people.** One ring at 1.5 s is thin staging. Needs line, then figure draws in, then ring. Costs Trey and Whitney.
- **Release and Commit have no body.** Nothing says the figure receives the charge, so the avatar is not the centrepiece in motion.
- **98 animations, 16 on tokens, 50 literal durations.** The proposal names the object but not the sweep that retires the rest.

## 4. FINAL GRADE: 68/100

- Up 2: the Compass fix is scoped to exact lines and Land at 320 ms needs no gate edit.
- Held down: nothing is built; unread and the Release body are open.
- Standing: reduced motion 9, alive at rest 8, data 8, tokens 6, frame budget 6, release 3.

## 5. MY PART OF THE BUILD SPEC

### What I found in source that changes the spec

- **The bead ease is already on elapsed time.** `wheel.js` `draw()` uses `1-exp(-9.05*dt)` with dt clamped at 100 ms. Pass 2 treated the 9.05 as new. It is built. What is not built is the fall rate of 4.5.
- **Compass is frame counted in six places, not one.** All in `ui/cone.js` `coneTick`: `CONE.spin+=0.0022` (line 2587), `CONE.t+=1/60` (2596), `coneMirStep(1/60)` (2597), spin chase `gap*0.12` (2586), zoom chase `*.2` (`coneZoomStep`, line 131), pluck decay `TP*.965` (1788). At 120 Hz every one runs twice as fast. Measured by arithmetic: one turn is 0.0022 x 60 = 0.132 rad/s, 47.6 s at 60 Hz, 23.8 s at 120 Hz. The Compass breath (`sin(TAU*CONE.t/4.2)`) becomes 2.1 s on a fast screen.
- **Land equals the surface step.** `--t-surface` is already 320 ms and `--ease-land` already exists in `shell/head.html`. So `--t-land: var(--t-surface)` passes gate 12 (`ALLOW` in `tests/design.js` line 667) with no edit. Drop my 260 to 340 ms range. Land is 320 ms.
- **Two clocks exist.** `S.t` (`ui.js` line 1500) and `CONE.t`. They should be one.

### The `MOTION` object (in `ui/component.js`, next to `REDUCED` at line 1110)

Read once per lighting change from CSS tokens, never per frame.

| Field | Value | Source token |
|---|---|---|
| `breath` | 4.2 s | `--t-breath` |
| `half`, `wave` | 2.1 s, 8.4 s | derived, x0.5 and x2 |
| `land` | 320 ms | `--t-land` (new, = `--t-surface`) |
| `easeLand` | `cubic-bezier(.34,1.56,.64,1)` | `--ease-land` |
| `rise`, `fall` | 9.05 per s, 4.5 per s | new, `-ln(.86)*60` and half of it |
| `springLand` | w 16, damping .55 | one pair |
| `springSettle` | w 13, damping .86 | one pair |
| `floorChosen` | .45 opacity | held tile never below this |
| `dtMax` | 0.1 s | one clamp, both loops |
| `still` | bool | OS setting or `quiet` or `rm` |

Periods: 2.1, 4.2 or 8.4 s only, with one exemption: the Registers breathe at `4.2*R` (`cone.js` line 2158), scaled by each seat's tone ratio. That is data, so it stays.

### Compass elapsed time fix

- `coneTick(ts)`: `dt=min(.1,(ts-CONE.last)/1000)`, first frame `1/60`.
- `spin += 0.132*dt`.
- Spin chase `k=1-exp(-7.67*dt)` (that is `-ln(.88)*60`).
- Zoom chase `k=1-exp(-13.39*dt)` (`-ln(.8)*60`).
- Pluck decay `TP *= exp(-2.14*dt)`.
- `coneMirStep(dt)`.
- Delete `CONE.t`; read `S.t`. One clock, and the Compass breath is in phase with the Field. Check that `coneOpen` does not rely on `CONE.t` starting at 0.
- At 60 Hz nothing changes. At 120 Hz the turn goes from 23.8 s to 47.6 s, the breath from 2.1 s to 4.2 s.

### Period snaps (S, `ui/wheel.js`)

- Line 385: `Math.sin(S.t*1.4)` (4.49 s) becomes `Math.sin(S.t*TAU/4.2)`.
- `PUL_WAVE_HZ` 0.11 (9.09 s) becomes `1/8.4`.
- Line 355 spin at `S.t*.05` is a slow drift, not a period; leave it.

### The four verbs, with the exact job

- **Still.** Locks, locked orbs, unread outline. Nothing changes. A still dash means not measured.
- **Breathe.** Opacity .64 to 1, 4.2 s, `--ease-breath`, Field core and the figure only. Same for everyone, never dimmed on a low score.
- **Travel.** Pulse speed 0.7x to 1.5x from DQ (built), solid measured paths only.
- **Land.** 320 ms, `--ease-land`, `transform: scale(.96 to 1.04 to 1)` plus opacity .45 to 1, then rest.

### Copy lines I own

- Unread cue, once at 1.5 s: "Write one thing. The field starts there." (Narrative to confirm.)
- Boot skip hint at 1.5 s: "Press any key to skip."

### Gates

- **New in `tests/design.js`:** drive `coneTick(ts)` for 10 simulated seconds at 16.67 ms and again at 8.33 ms steps; `CONE.spin` and the breath phase must agree within 3 percent. Check against the old code first: it must fail there at 100 percent difference.
- **New:** counts of `transition:all` (23 now) and literal `cubic-bezier` (53 now) may only fall.
- **New:** `MOTION.breath===4.2` and every `MOTION` token resolves.
- Gate 12 stays untouched.

### Build order

1. Compass elapsed time and the 60 Hz against 120 Hz gate. **S**, `ui/cone.js`, the new gate.
2. Period snaps. **S**, `ui/wheel.js`, design gate 12 plus the new periods check.
3. `MOTION` object and `--t-land`, one clock. **M**, `ui/component.js`, `shell/head.html`, token gate.
4. Land on selection, floor .45, locks and unread still. **S**, `shell/head.html`, design gate 12.
5. Cut `transition:all`, name the properties. **S**, `shell/head.html`, the count gate.
6. Release body and Commit settle. **M**, `ui/release.js`, `ui/storyui.js`, `tests/functional.js`.
7. Loop ring clockwise turn, one transform. **M**, top bar in `ui/ui.js`, design gate.

### Frame cost and reduced motion

- Steps 1 to 5 add about ten operations a frame. Compass has 0.7 ms of headroom (7.3 against 8 ms); I add no drawing there.
- Land, ring and Breathe are `transform` and `opacity` on one element each: compositor only.
- Reduced motion gets the end state: no overshoot, ring and counters already landed, clock frozen.

## 6. RANKED RECOMMENDATIONS

1. **Compass on elapsed time, six sites, plus the gate.** S. Marcus, Nils, Renata, 120 Hz screens. Reskin.
2. **Period snaps (4.49 to 4.2 s, 9.09 to 8.4 s).** S. Nils, Camille. Reskin.
3. **One `MOTION` object, one clock.** M. Nils, Renata. Reskin.
4. **Unread staging.** S. Trey, Whitney, Marta. Reskin.
5. **Release and Commit body: the figure receives the charge.** M. Marcus, Camille. Reskin, needs the figure.
6. **Land with the .45 floor; locks and unread stay still.** S. Whitney, Nils, Marta. Reskin.
7. **Cut `transition:all` (23).** S. All, older laptops. Reskin.
8. **Loop ring turns clockwise only.** M. Marcus, Sofia. Reskin as a drawing; redesign if each arc is a 44 px target.
9. **Boot skip hint at 1.5 s.** S. Renata. Reskin.

## 7. ONE QUESTION

None. I decided: the Field breathes the same 4.2 s for everyone, so a low score never reads as punishment. The number and the core size carry the reading.
