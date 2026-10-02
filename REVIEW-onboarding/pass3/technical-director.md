# Pass 3: technical director (Anders Kjeld), onboarding round PJ

Read: PROPOSAL.md, my passes 1 and 2, systems and animation pass 2, and the source at HEAD `e0f641a` (MANIFEST, `loop` in `ui/ui.js`, `ui/onboard.js`, `ui/login.js`, `tests/design.js`, `tests/boot.js`). Numbers marked (est) are estimates from this sandbox, not a device.

## 1. THE PROPOSAL AS I UNDERSTAND IT
One black stage with one figure and one clock plays five silent slides (about 26 s), stops at a choice of twelve starting points, then a sentence, a 12 line release with his voice, and a short aftercare, and lands on the Field. The clock is one tick inside the existing frame loop, so the Field stops drawing and costs nothing. The merge kept everything I care about. It misread four things, all small (section 5, "differs").

## 2. THE ICP ROOM
- **Marcus (founder, level 7).** Sees black, the figure, one line, in 1 s, no card. Watches the cost: Field silent, no stutter. Stays. "It moves like a title sequence and nothing is faking it." Leaves if the clock drifts from the voice.
- **Whitney (phone only, level 5).** Sees the figure and the hairline at 390 wide. Taps right to speed up, holds to read. Risk is the iOS press and hold callout; `-webkit-touch-callout:none` fixes it. Old phone gets two layers and no blur. Stays. "It did not ask me for anything yet."
- **Nils (design skeptic, level 4).** Sees no card, no dots, no wash. Hits Skip in 3 s and lands on the choice, not the app. Stays because the stage is honest and Skip works. "At least it lets me out."
- **Camille (practitioner, level 6).** Sees Pause from frame one, sound off, reduced motion honoured. Checks the privacy line. Stays for the allowlist handover. Leaves if a clinical frame is missing. "Show me what leaves the device."
- **Marta (acute distress, 02:00).** Sees one line, still. The distress bit pauses everything, colour out, audio fades in 300 ms. Today the detector is not built, so she meets only Pause and Skip. Stays only if the stub ships. "Please just stop moving."
- **Renata (operator, level 7, main target).** Sees the stage, picks a starting point at 27 s, writes a sentence, releases. Zero buttons until "Keep this". Stays through the 48 s run. "Finally it is not a quiz."
- **Trey (quiz tourist).** Sees 5 slides, taps through in 8 s, picks anything. Bounces at the story box if the first read is empty. The never empty read is the fix. "I wanted a result."
- **Sofia (loves open tables).** Sees "112 addresses" and a real engine row on slide 4. Wants the table. The proof row is free data. Stays. "That is a real number, good."

## 3. UNIFIED QUALITY: 71/100
Gaps left:
1. **Distress detector is L and unbuilt.** The bit ships with the clock, the reading does not. Biggest risk.
2. **Gates cannot see the stage.** `design.js`, `functional.js`, `collide.js` all run `?dev=1`, which skips the login. Nothing measures the stage until a new gate does.
3. **Two type scales and two durations lists.** Lead's 11/13/16/20/28/44 against gate 12's four steps. Both fit if the ring zoom and long moves are keyframes or `el.animate()`.

## 4. FINAL GRADE
GRADE: 74/100 (pass 1 was 61, pass 2 was 58)
Up 16 from pass 2. Moved it: hide the app, one clock, the hairline and a visible Pause are ruled, so frame cost and timing machinery go from 4 and 2 to about 8. Held back: no distress detector, no gate yet, and 190KB of audio on a file that arrives cut.

## 5. MY PART OF THE BUILD SPEC
**Differs from the lead (both values).**
- **12 words a slide.** The ruled line "Awareness and intuition is a tool we use to turn your senses inward." is 13 words. Lead: max 12. Mine: max 12 plus a named `SL_RULED` allowlist for that string and the welcome line. Dwell 6.5 s.
- **Gate number.** Instruction and my pass 2 said "gate 15". Gate 15 is THE ALARM LAW, 16 tooltip, 17 label class (`tests/design.js` 765, 833, 886). Mine: new gate is the next free, 18 at HEAD. Build agent greps first.
- **Voice embed place.** My pass 1 said "after body, before foot". That is inside the main script (opens `guard.html:304`, closes `foot.html:1`). Correct place: `shell/voice.html` between `shell/body.html` and `shell/guard.html` in MANIFEST. The end of file marker stays last.
- **Transit durations.** 180 and 520 ms fail gate 12 as CSS transitions. Lead: 180/520. Mine: fields fade 220 ms (`--t-element`), ring zoom 520 ms as `el.animate()` (the gate reads CSS transitions only), or 420 if CSS.
- **Palette.** Lead keeps shipped `PAL`. I withdraw canon. No `canon.js` edit, no `equiv.py` diff. The stage reads seats through one function `slSeat(i)`, so one line moves it.

**Files.**
- New: `atuned_src/engine/data/starts.js` (12 rows, stable string keys, display order a separate field), `engine/journey.js` (`obAct`, `HAND`, `STAY`), `engine/distress.js` (pure `distressRead(text)`), `ui/slides.js` (clock, controls, slide table, stage canvas), `shell/voice.html` (one `<script type="text/plain" id="vo-opening">` holding 191,020 bytes of base64 of `audio/atuned-opening.webm`; committed, plus a gate comparing its md5 to the webm).
- Edited: `ui/ui.js` loop, `ui/onboard.js` (keep `OB`, `obOpen`, `obClose`, `OB_LEAVE_MS` as shims; drop `obCard`, `obRender`, `OB_AUTO`, `.ob-wash`), `ui/login.js` (`obAct` call, `DEV_PLAY_*` and Developer options only under `DEV_SKIP` or the owner's flag), `ui/sound.js` (voice decode), `ui/release.js`, `ui/storyui.js`, `engine/schema.js`, `engine/plan.js`, `shell/head.html`.
- **MANIFEST.** `engine/data/starts.js` right after `engine/data/canon.js`. `engine/journey.js` right after `engine/profiles.js`. `engine/distress.js` right after `engine/sniff.js`. `ui/slides.js` right after `ui/onboard.js`, before `ui/login.js`. `shell/voice.html` between body and guard. `BUILD-engine.sh` and `hostfree.py` pick up the three engine files; none use `document`.

**New classes (prefix `.sl-`, host `#sl`, sibling of `#ob` and `#login`, not inside `.app`).** `.sl-stage .sl-line .sl-eyebrow .sl-hair .sl-seg .sl-fill .sl-ctrl .sl-pause .sl-skip .sl-sound .sl-gate .sl-chip .sl-leaving .sl-still`. `.ob-*` stays for the login only. Rename account feedback `.ob-a`, `.ob-qs` to `.fb-`.

**Stage CSS.** `#sl{position:fixed;inset:0;height:100dvh;background:var(--stage);user-select:none;-webkit-touch-callout:none;touch-action:manipulation}`. `--stage:#06060a`. Ink `#EFEDE8`. One radial gradient at 12 percent, baked, no `filter`, no `backdrop-filter`, no blend. Safe area insets on the controls. While up, `body.sl-up .app{visibility:hidden}`. `.sl-leaving{pointer-events:none}`. Type 11, 13, 16, 20, 28, 44; hero 44 at 1600, 28 at 390, weight 300, 22 characters a line.

**Clock (`ui/slides.js`, zero objects per frame).**
`SL={on:false,i:0,ms:0,mask:0,last:0}`. In `loop(ts)` after the `S.t` line: `if(SL.on){slTick(ts);requestAnimationFrame(loop);return;}`. That skips `computeSeen`, `rbTick` and every Field draw.
- `slTick` takes plain numbers. `dt=min(100,ts-last)`; a gap over 250 ms adds 0 (a throttled tab is a pause). I take animation's 100 over my own 50: at 10 fps a 50 ms clamp runs the film at half speed.
- Mask bits: hold 1, hidden 2, user 4, typing 8, distress 16, focus 32 (only `:focus-visible` on the Pause ring). Tick adds only if `mask===0` and slide kind is `auto`. Kinds `auto`, `gate`, `act`.
- Dwell, seconds: `max(3.0, 1.0+words/2.5)` rounded up to 0.5, cap 7.0. Slide period = dwell + 0.64 (420 in, 220 out). At 5, 13, 10, 7, 7 words that is 3.0, 6.5, 5.0, 4.0, 4.0 = 22.5 + 3.2 = 25.7 s. Reduced motion: times 1.5 (34 s), Pause shown from frame one, instant cuts, 200 ms fade.
- Hairline: 2 px, `SL_AUTO.length` segments, 4 px gaps, fill `transform:scaleX()`, written only when `floor(f*200)` changes.
- Input: `pointerdown` starts a 180 ms timer, then bit 1 on; `pointerup` releases it with a 320 ms resume ramp. A short tap on x above 33 percent goes on, below goes back; a second back tap within 1.5 s goes a slide. Ignore taps on `button`. Keys: Space toggles bit 4, arrows step, Escape goes to the gate. The `ui/panels.js` capture listener on `document` eats pointerdown; the build agent must read it first and register on `#sl` with `stopPropagation`.
- Skip: 16 px text, 44 by 44 target, top right, lands on the `gate` slide found by `.k`, never the app. Pause ring 44, Sound ring 44, Back 44 at 390, bottom row.
- Handoff: stage `opacity` 1 to 0 over `--t-context` while `.app` loses `visibility:hidden` in the same frame. 85 percent version of the figure arc: read the hub rect once, move with `el.animate()` over 520 ms. Full shared move is L.

**Cost (est).** Layers at 390 by 844, 3x: ground 11.8MB, one canvas (cap DPR 2) 5.3MB, figure SVG 10 nodes, two text layers: about 18MB, under my 24MB. JS under 1 ms a frame. Canvas redraws only inside a cue (dirty flag). Field cost removed: 1.7 to 2.5 ms measured. Compositor only in rest; cues repaint SVG, cheap at 10 nodes.
**Floor.** No sound, no webm support, reduced motion, 30 fps, oldest phone: all degrade to text and still frames. Acceptable.

**Voice.** Decode lazily in `ui/sound.js`: `atob`, `Uint8Array`, `Blob`, `createObjectURL`, `new Audio(url)`, not `decodeAudioData` (9.5MB decoded). Guard `canPlayType('audio/webm; codecs=opus')`; empty hides Sound. Release opening only. Cue clock reads `audio.currentTime`; drift over 120 ms slews, over 400 ms snaps. Captions are the shipped `REL_WELCOME` lines. Size: packed +10.8 percent (est from pass 1 table: 1,753,033 to about 1,941,700).

**Gates.**
- `functional.js`: keep line 26 (`booted` calls `obClose`). Rewrite 2374 to 2416 and 2437 around `slTick` with a fake clock: advances with no click, hold stops it, back works, a gate stops it, choosing advances, zero charge written, one story entry after commit. Slide count from `SL_SLIDES.length`. Add one run without `?dev=1`, so the login-to-stage transit is walked once. Add `obAct` table cases to `tests/engine.js`.
- `design.js` new gate 18: stage open at 390x844, 375x667, 1600x1000, each slide: type floor 11, tap 44, no all caps, no horizontal scroll, every `.sl-*` has CSS, durations in the four steps, no `ease`, `window.draw` wrapped and zero calls while open, more than zero after, total auto period at most 30 s from the table, `.app` is `visibility:hidden` while open. Gate 7 stays at zero requests with voice on (blob URLs allowed).
- `boot.js`: expect green. Add a corrupt voice block (no `[role=alert]`, boots, Sound hidden) and a 97 percent cut of the voice build (must say short, eof still last).
- `monitor.js`: per slide walk at both widths. `shots.js`: still mode and reduced motion before load. `collide.js`: none.

**Size and slices.** Whole build L (about 8 to 10 days of agent time). Order for a worktree:
1. Stage, clock, hide app, controls, Skip, hairline, `.sl-*`, gate 18, functional rewrite. **M.** Placeholder gate slide.
2. In parallel, slice 1 independent: `starts.js`, `journey.js`, `obAct`, blank `journey`, three named refusals, `planSight` gift fix, never empty read, `pSave` checks in `stCommit` and `relCoolDown`. **M.**
3. In parallel, `distress.js` and the mask bit 16 stop frame. **S** stub, **L** clinical.
4. Reel A copy and canvas cues. **S.**
5. The gate (twelve chips, ring at 1600, 3 by 4 at 390), transit, `journey.start`. **M.**
6. Story stage and first Mirror line. **M.**
7. `shell/voice.html`, voice decode, release opening, gift counter. **M.**
8. Reel B, handover allowlist (`HAND` or `STAY` partition test), account fields, exit. **M.**
9. Tutorial replay in profile, Developer options behind `?dev=1`. **S.**

## 6. RANKED RECOMMENDATIONS
1. Slice 1 as one change. **M, redesign.** Whitney, Marta, Nils, Marcus.
2. Distress stub with the clock, detector next. **S then L, redesign.** Marta, Camille.
3. Gate 18 and one no-dev run. **M, redesign.** Camille, Whitney.
4. Journey and `obAct`, never empty read. **M, redesign.** Trey, Renata.
5. Voice embed, release only. **S, reskin.** Marta, Camille.
6. Gate 12 fit for ring zoom (`el.animate()`). **S, reskin.** Nils.

## 7. QUESTION FOR THE OWNER
None.
