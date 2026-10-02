# Pass 3: technical director (Anders Kjeld), onboarding round PJ

Read: PROPOSAL.md, my passes 1 and 2, and source at HEAD `e0f641a`. (est) means an estimate, not a device measure.

## 1. THE PROPOSAL AS I UNDERSTAND IT
One black stage, one figure and one clock play five silent slides (about 26 s), stop at a choice of twelve starting points, then a sentence, a 12 line release with his voice, an aftercare, and the Field. The clock is one tick inside the existing frame loop, so the Field stops drawing and costs nothing. The merge kept what I care about. It misread four small things, listed in section 5.

## 2. THE ICP ROOM
- **Marcus (founder, 7).** Sees black, the figure, one line, in 1 s. No card. Stays. "It moves like a title sequence and nothing is faking it."
- **Whitney (phone only, 5).** Sees figure and hairline at 390. Holds to read, taps to go on. Stays; the iOS press callout needs one CSS line. "It did not ask me for anything yet."
- **Nils (skeptic, 4).** No card, no dots, no wash. Hits Skip at 3 s, lands on the choice, not the app. Stays. "At least it lets me out."
- **Camille (practitioner, 6).** Sees Pause from frame one, sound off. Stays for the allowlist handover. "Show me what leaves the device."
- **Marta (distress, 02:00).** Sees one line, still. The distress bit pauses all and fades audio in 300 ms. Until the detector exists she has only Pause and Skip. "Please just stop moving."
- **Renata (operator, 7, main target).** Picks a point at 27 s, writes, releases. No button until "Keep this". "Finally it is not a quiz."
- **Trey (tourist).** Taps through in 8 s. Bounces if the first read is empty; the never empty read fixes it. "I wanted a result."
- **Sofia (open tables).** Slide 4 shows "112 addresses", a real row. Stays. "That is a real number, good."

## 3. UNIFIED QUALITY: 71/100
Gaps:
1. The distress detector is L and unbuilt.
2. Gates cannot see the stage: `design.js`, `functional.js`, `collide.js` all run `?dev=1`, which skips the login.
3. The lead's 180 and 520 ms fail gate 12's four steps.

## 4. FINAL GRADE
GRADE: 74/100 (pass 1 was 61, pass 2 was 58)
Up 16. Hide the app, one clock, hairline and visible Pause are ruled, so frame cost and timing machinery rise to about 8. Held back: no detector, no gate yet.

## 5. MY PART OF THE BUILD SPEC
**Where I differ from the lead (both values).**
- Word cap. The ruled line "Awareness and intuition is a tool we use to turn your senses inward." is 13 words. Lead: max 12. Mine: max 12 plus a named `SL_RULED` allowlist (this line and the welcome line). Dwell 6.5 s.
- Gate number. Gate 15 is THE ALARM LAW, 16 tooltip, 17 label class (`tests/design.js` 765, 833, 886). The brief said 15. Mine: the next free, 18 at HEAD; grep first.
- Voice embed place. My pass 1 said "before foot". That is inside the main script (opens `guard.html:304`, closes `foot.html:1`). Correct: `shell/voice.html` between `shell/body.html` and `shell/guard.html`. End marker stays last.
- Transit. Lead: fields 180 ms, ring 520 ms. Gate 12 allows only 0.12, 0.22, 0.32, 0.42 s on CSS transitions. Mine: fields 220 ms; ring zoom 520 ms by `el.animate()` (the gate reads transitions only), or 420 ms as CSS.
- Palette. Lead keeps shipped `PAL`. I withdraw canon: no `canon.js` edit. The stage reads seats through one function `slSeat(i)`.

**Files.** New: `engine/data/starts.js` (12 rows, stable string keys), `engine/journey.js` (`obAct`, `HAND`, `STAY`), `engine/distress.js` (pure `distressRead(text)`), `ui/slides.js`, `shell/voice.html` (one `<script type="text/plain" id="vo-opening">`, 191,020 bytes of base64 of `audio/atuned-opening.webm`, committed, a gate checks it against the webm). Edited: `ui/ui.js` loop, `ui/onboard.js` (keep `OB`, `obOpen`, `obClose` as shims; drop `obCard`, `obRender`, `.ob-wash`), `ui/login.js` (call `obAct`; Developer options and `DEV_PLAY_*` only under `?dev=1` or the owner's flag), `ui/sound.js`, `ui/release.js`, `ui/storyui.js`, `engine/schema.js`, `engine/plan.js`, `shell/head.html`.

**MANIFEST.** `starts.js` right after `engine/data/canon.js`. `journey.js` right after `engine/profiles.js`. `distress.js` right after `engine/sniff.js`. `ui/slides.js` right after `ui/onboard.js`, before `ui/login.js`. `voice.html` between body and guard. Engine files must stay free of `document`.

**Classes.** Prefix `.sl-`, host `#sl`, sibling of `#ob`, outside `.app`: `.sl-stage .sl-line .sl-eyebrow .sl-hair .sl-seg .sl-fill .sl-ctrl .sl-pause .sl-skip .sl-sound .sl-gate .sl-chip .sl-leaving .sl-still`. `.ob-*` stays for the login.

**Stage CSS.** `#sl{position:fixed;inset:0;height:100dvh;background:var(--stage);user-select:none;-webkit-touch-callout:none;touch-action:manipulation}`. `--stage:#06060a`, ink `#EFEDE8`, one baked radial gradient at 12 percent. No `filter`, `backdrop-filter` or blend. `body.sl-up .app{visibility:hidden}`. `.sl-leaving{pointer-events:none}`. Type 11, 13, 16, 20, 28, 44 (hero 44 at 1600, 28 at 390, weight 300).

**Clock (zero objects per frame).** `SL={on,i,ms,mask,last}`. In `loop(ts)` after the `S.t` line: `if(SL.on){slTick(ts);requestAnimationFrame(loop);return;}`. That skips `computeSeen`, `rbTick` and all Field draws.
- `dt=min(100,ts-last)`; a gap over 250 ms adds 0. I take animation's 100 over my own 50: at 10 fps a 50 ms clamp halves the film speed.
- Mask bits: hold 1, hidden 2, user 4, typing 8, distress 16, focus 32 (`:focus-visible` on the Pause ring only). Adds only if `mask===0` and kind is `auto`. Kinds: `auto`, `gate`, `act`.
- Dwell s: `max(3.0, 1.0+words/2.5)`, rounded up to 0.5, cap 7.0; period = dwell + 0.64 (420 in, 220 out). Words 5, 13, 10, 7, 7 give 3.0, 6.5, 5.0, 4.0, 4.0 = 22.5 + 3.2 = 25.7 s. Reduced motion: dwell times 1.5, instant cuts, 200 ms fade, Pause shown from frame one.
- Hairline: 2 px, one segment per `auto` slide, 4 px gaps, `scaleX`, written when `floor(f*200)` changes.
- Input: `pointerdown` arms 180 ms, then bit 1; `pointerup` clears with a 320 ms ramp. Short tap right two thirds goes on, left third goes back, a second back tap within 1.5 s goes a slide.  Space toggles bit 4, arrows step, Escape goes to the gate. The `ui/panels.js` capture listener on `document` eats pointerdown: read it first, register on `#sl`.
- Skip 16 px, 44 by 44, top right, goes to the `gate` slide found by `.k`. Pause, Sound, Back rings 44 px, bottom row at 390.
- Handoff: stage opacity 1 to 0 over `--t-context` while `.app` becomes visible in the same frame. Figure arc: read the hub rect once, `el.animate()` 520 ms. Full shared move is L.

**Cost (est).** At 390 by 844, 3x: ground 11.8MB, one canvas at DPR cap 2 5.3MB, SVG 10 nodes: about 18MB, under my 24MB cap. JS under 1 ms a frame, canvas redraws only inside a cue. Field cost removed: 1.7 to 2.5 ms (measured). Rest is compositor only. **Floor:** no sound, reduced motion, 30 fps, old phone all degrade to text and stills. Acceptable.

**Voice.** In `ui/sound.js`: `atob`, `Uint8Array`, `Blob`, `createObjectURL`, `new Audio`. Not `decodeAudioData` (9.5MB). Guard `canPlayType('audio/webm; codecs=opus')`, else hide Sound. Release opening only; `audio.currentTime` is the clock. Captions are the shipped `REL_WELCOME` lines. Packed file +10.8 percent.

**Gates.**
- `functional.js`: keep line 26. Rewrite 2374 to 2416 and 2437 around `slTick` with a fake clock (advances unclicked, hold stops it, back works, gate stops it, choosing advances, no charge written). Count from `SL_SLIDES.length`. Add one run without `?dev=1`. `tests/engine.js`: `obAct` cases.
- `design.js` gate 18: stage at 390x844, 375x667, 1600x1000, every slide: type floor 11, tap 44, no all caps, no horizontal scroll, CSS for every `.sl-*`, durations in the four steps, no `ease`, `window.draw` wrapped (zero calls open, more after), total period at most 30 s, `.app` hidden while open. Gate 7 stays at zero requests.
- `boot.js`: add a corrupt voice block (no `[role=alert]`, boots, Sound hidden) and a 97 percent cut of the voice build (says short, eof last).
- `monitor.js` per slide, both widths; `shots.js` still mode.

**Size: L**, 8 to 10 days. Slices in order:
1. Stage, clock, hide app, controls, `.sl-*`, gate 18, functional rewrite. M.
2. Parallel with 1: `starts.js`, `journey.js`, `obAct`, three named refusals, `planSight` gift fix, never empty read, `pSave` checks. M.
3. Parallel: `distress.js` and bit 16 stop frame. S stub, L detector.
4. Reel A copy and canvas cues. S.
5. Gate of twelve chips, transit, `journey.start`. M.
6. Story stage, first Mirror line. M.
7. `voice.html`, decode, release opening, gift counter. M.
8. Reel B, `HAND` or `STAY` handover, account fields, exit. M.
9. Tutorial replay, Developer options behind `?dev=1`. S.

## 6. RANKED RECOMMENDATIONS
1. Slice 1 as one change. M, redesign. Whitney, Marta, Nils, Marcus.
2. Distress stub with the clock, detector next. S then L, redesign. Marta, Camille.
3. Gate 18 and one no-dev run. M, redesign. Camille, Whitney.
4. `obAct` and never empty read. M, redesign. Trey, Renata.
5. Voice embed, transit by `el.animate()`. S, reskin. Marta, Nils.

## 7. QUESTION FOR THE OWNER
None.
