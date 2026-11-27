GRADE: 46/100

Seat: Kai Moana, animation and VFX director. Round PJ, pass 1, onboarding and tutorial. Read: BRIEF, `ui/onboard.js`, `ui/tutorial.js`, `ui/login.js`, the `.ob-*` and boot rules in `shell/head.html`, the shots in `onb-shots/`, the mockups in `mockups/onboarding/png/`, and `audio/atuned-opening-timing.json`. I also ran the real build in Chromium at 1600 and 390, opened `obOpen(true)` and read `document.getAnimations()` plus 240 frames of timing. The 390 tutorial shot shows the Field and no sheet, so the tutorial was judged from source, not from that image.

## 1. THE INVENTORY (what moves now)

| Thing | Duration, curve | Verdict |
|---|---|---|
| Boot: lens fill, halo, wordmark, out | .96s and .9s on `(.45,0,.15,1)`, .92s ease-out, 5.0s fade of .24s | The best motion in the product. Keep and continue from it |
| Login (`ui/login.js`) | zero animation declared (grep returns none). The ring motion he asked for is not built | Missing |
| Sheet open (`obOpen`) | `display:none` to `flex`, 0ms | Card appears in one frame. No entrance |
| Step change (`obRender`) | `innerHTML` replaced, 0ms | Hard cut on every step |
| Figure dots `obDot` | .52s ease-out, 70ms stagger | Good timing, but replays on every render. 14 run on step 0 (7 visible, 7 inside a watermark at 7% opacity) |
| `.ob-wash` | 30s infinite, scale 1 to 1.1 and rotate 3deg, `blur(30px)` on a 735 by 572 layer | 0.33% a second and 0.1 degree a second. Below what an eye can read. No job |
| Seat pick, dots, Next enabling | instant, because the element is destroyed and rebuilt | A selection that snaps |
| Leave | CSS 220ms ease-in, JS removes at 520ms | 300ms of invisible sheet still in the document |
| Tutorial commit | hard cut to "What this found" | The first real charge lands in silence |
| App under the sheet | the sheet is 94% opaque; `rbwave` (9.09s) and `rlring` (4.2s, three) still run behind it at 390 | Frames spent on what nobody sees |

Median frame 16.7ms at both widths, so the sheet is not slow. It is just mostly still. One 1.37s gap appeared at the first frame at 1600 and did not repeat at 390. Unexplained, re-measure in pass 3.

## 2. GRADE, nine criteria out of ten

- Does it move, and should it: 4. Two keyframes, one with no job.
- Timing: 5. The 70ms stagger is right. Entrance 0ms, step 0ms, leave mismatched.
- Curves: 6. Tokens are used. No linear found.
- Choreography: 3. No order. Each screen is a new page.
- Alive at rest: 4. The wash is dead motion. The figure stands still.
- Motion carries meaning: 2. A first story lands with no landing.
- Reduced motion: 7. Wash and dots stop on the end state. Good.
- Frame budget: 6. Fine at 60Hz but a big blurred layer and a live app behind.
- Continuity with boot and login: 4. The boot figure vanishes, a card appears.

Total 41 of 90, scaled to 46.

THE SOUL. The boot figure: seven seats rising root to crown, a gold halo closing. A person sees it assemble, and it is "this is you" without a word. The onboarding should be that figure staying on screen, not a new card.

WHAT BREAKS. A card is a page. A page needs a button to turn. He said he does not want to press buttons. The fix is a world (one figure, one field) and a clock, not a better card.

## 3. THE NEW SEQUENCE: ONE ACTOR, ONE CLOCK

**Rule.** No cards. The stage is full bleed `#06060a` (the login ground). The boot's end frame is the first frame: same figure, same coordinates, halo closed. Slides are poses of one world, so nothing is rebuilt between them. Text is one line block at a time, entering on 380ms `(.22,1,.36,1)` with a 10px rise, leaving on 220ms `(.4,0,1,1)`. Never per letter, never per word (a typewriter runs at about 6 Hz, which is the hazard band).

**Four verbs, as ruled in the skin round.** Still: unread, sealed. Breathe: a reading exists, 4.2s sine, opacity .64 to 1, figure and rings only. Travel: charge moving, seat hue, out expands, in collapses. Land: you changed something, 260 to 340ms on `(.34,1.56,.64,1)`.

**Transit from login.** Fields fade 180ms ease-in. The login ring then scales 1 to 1.5 and goes to opacity 0 over 520ms ease-out. The stage is already under it with the figure standing. His own "completes the zoom animation".

**Reel A, the welcome, silent track. Time zero is the end of the transit.**

| Slide | Start, length | Line (Narrative owns final copy) | Motion and verb |
|---|---|---|---|
| 1 Arrive | 0.0, 4.0s | "This is you, and it is okay." | Seats Land root to crown, 90ms stagger, scale .6 to 1.12 to 1, 260ms. Halo draws clockwise from twelve, .9s on `(.45,0,.15,1)`, from 0.9s. Breathe starts at 1.8s |
| 2 Inward | 4.0, 6.0s | "Welcome to a neurosomatic experience." then 1.4s later "Awareness and intuition is a tool we use to turn your senses inward." | Three faint field rings draw on clockwise, 120ms stagger. At 5.6s seven rim marks Travel inward on curved paths (quadratic, 12% sideways bend), 700ms, 60ms stagger, each ends in one Land on its seat. Once |
| 3 Where | 10.0, 5.4s | "A story sits somewhere in your body." | One seat (Throat). A bead arcs in over 700ms on ease-in, the seat rises on the real charge rate (9.05 a second) to 6.5, glow appears at that level as the Field does. 8% squash on impact. Line enters at 0.9s |
| 4 Release | 15.4, 5.2s | "And you can let it go." | Glow collapses 700ms ease-in. Seat falls on the real fall rate (4.5 a second). Replacement ring expands 500ms Land. Collapse is release, expand is install |
| 5 Loop | 20.6, 5.6s | "Discover. Play. Flow. Embody. Then again." | Four stations at 12, 3, 6, 9. Lit arc travels clockwise only, 900ms a station, label Lands as it arrives and stays. After Embody it continues to twelve and closes the circle at 4.6s. Never turns back. The loop is a circle, not a list |
| Gate | 26.2, 1.6s | "What brought you here?" | Figure arcs to the centre of the twelve-point ring and shrinks to .36, 520ms ease-out. Loop ring becomes the outer ring. Twelve points Land clockwise from twelve, 70ms stagger (840ms). Then the clock stops |

Auto time to the first decision: 27.8s. Reading speed holds 2.8 words a second or less on every slide (hold = 1.4s + words / 3.2, never under 3.2s).

**The gate never auto advances.** The slider never decides for a person. At the gate the figure breathes, the twelve points are Still, and one hover or focus lifts a point (Land, 120ms). If nothing happens for 10s, the centre prompt takes one Land ring, once. No loop, no countdown.

**Reel B, the way out, after the first release and reading** (this replaces the typed day one tutorial screens; the first story is already written in the starting session).

| Slide | Start, length | Motion |
|---|---|---|
| B1 Landed | 0.0, 3.6s | Seats that moved fall on 4.5 a second. Figure core Lands 1.04 in 300ms (grows, never dims). One counter beat, one Land, never faster than 2 a second |
| B2 Read | 3.6, 6.0s | The Field enters on its own numbers: 380ms with 62ms stagger across seven seats. Rings expand outward from the figure. Travel speed follows live DQ, 0.7x to 1.5x. The whole reading stays visible during the gift |
| B3 Keep it | 9.6, gate | One ring, one action: create the account. Stage still, figure breathes |
| Exit | 420ms | Figure arcs into the real Field hub. Stage fades 220ms. The real Field then arrives on its own 380ms enter. One object travelled, nothing was swapped |

## 4. SYNC TO THE SPOKEN OPENING

The recording belongs to the release screen, as he ruled ("it opens on my recorded voice"). Playing it in Reel A as well would be the second hearing by the fortieth view. So Reel A stays silent, and the release opening uses the same engine with the voice as its clock. The text shown stays his confirmed `REL_WELCOME` lines, never the draft transcript (`"confirmed": false` on every phrase).

Visuals lead the voice by 150ms, because text is read, not heard. Cues from the JSON:

| Clip time | Phrase | Motion |
|---|---|---|
| 0.0 | lead in | Stage black, figure already breathing |
| 4.73 | feet on the floor (4.88) | Line 1 "Sit down. Put both feet on the floor." enters. Exit 8.45 |
| 8.58 | notice inside (8.73) | Line 2 enters. Inward Travel marks run 700ms. Exit 14.55 |
| 16.40 | deep breath (16.55) | Line 3 enters. Inhale: core and rings scale 1 to 1.06, 16.55 to 18.85, `(.37,0,.63,1)` |
| 18.85 | slowly exhale | Exhale back to 1.0 over 3.35s. Period 5.65s, 0.18 Hz |
| 22.43 | repeat, settle (22.58) | Line 4 enters. Second, shorter breath 22.6 to 27.1 |
| 27.13 | and release | Collapse 870ms ease-in |
| 29.74 | the first stem (29.89 to 39.95) | Stem is the hero line. Six channel marks light clockwise, evenly spread across the 10s. **Not word synced: the JSON has no word times.** Ask for them |
| 39.95 | the end of the stem | The person's own second answer Lands under it, 300ms |
| 40.71 | second stem (40.86 to 49.67) | Hero line swaps, 220ms out, 380ms in. Clip ends, the release run takes over |

**Flicker rule, written as a rule.** The release audio carries a binaural beat near 6 Hz. No visual may modulate at 3 to 30 Hz, at any amplitude over 10%. Loops run no faster than 2.1s a period. Visuals take phrase starts (events at least a second apart) and a breath envelope under 0.3 Hz. Never audio amplitude, never syllables. One shot Lands are single, monotone moves, not periodic.

**Clock.** One `REEL.t` in seconds, advanced by `dt` clamped at 100ms while running. Every cue reads `REEL.t`, never `setTimeout`. With voice on, `audio.currentTime` is the authority: drift over 120ms slews at 10% a frame, over 400ms snaps. If the audio stalls the visuals hold. If it fails to load, `status()` says so and the silent track continues. Voice is off by default. At the first release one quiet ring, "Hear it", turns it on; browsers want that tap anyway.

## 5. CONTROLS

- **Progress.** A 2px hairline at the top, one segment per slide, 4px gaps. The current one fills with `transform:scaleX`, linear, because it is real time. Ink at .5, no hue.
- **Hold** (pointer down 200ms or more): pause while held. Release resumes with a 300ms ramp. Audio pauses at once and fades back in 200ms.
- **Tap** right third: next slide. Left third: restart this slide, tap again within 1.5s for the one before.
- **Pause control.** A visible 44px ring button, so a person who cannot hold has a way. Space toggles it. Paused state: stage dims 8%, label "Paused. Press space or tap to go on."
- **Skip.** Quiet text, top right, 44px target. It goes to the gate, never to the app, since the decision is the product. The skip transit is 520ms, not the full 1.6s. Esc does the same. Arrow keys step.
- **Back at slide 1:** nothing happens.
- **Replay from the profile:** same Reel, plus a one second chapter strip. The fortieth view is covered by Skip being one tap.

## 6. REDUCED MOTION

Somebody who asked for stillness did not ask for less motion. End states, instant cuts, no cross fades:
- Figure fully lit and Still, rings fully drawn, no breathing, no Travel, no marks, no bead. Collapse and expand become the end pose.
- Slides still advance on the same timer (timing is reading, not movement) and cut instantly. The progress hairline becomes three states, done, current, ahead, with no fill.
- Pause control is shown from the first frame. Voice is unchanged.
- One function sets `body.still` from the OS setting and the `quiet` and `rm` switches, and it listens for the setting changing.

## 7. FRAME BUDGET

- **Rest costs 0ms of main thread.** Ambient breathing is a CSS opacity animation on one element. `will-change` is applied only while a move runs.
- **One canvas** for rings, marks and bead, DPR capped at 2, redrawn only inside slides 2 to 5 and the cues in section 4. It cancels its rAF (the browser's per frame callback) on pause and on every gate. About 7s of 28 is active.
- **Figure is SVG**, 10 nodes. CSS transform on SVG children repaints that one layer. It is not compositor only, and it is cheap at this node count.
- **Targets:** 4ms main thread a frame at 1600, 6ms at 390 under 4x CPU slowdown. Measure in pass 3.
- **While the Reel is up** the stage is 100% opaque and `render()` for the Field and Compass is suspended. That removes `rbwave` and three `rlring` animations measured running underneath.
- **Remove** the `.ob-wash` `blur(30px)` layer (735 by 572px at 1600). Pre-baked static gradients carry the colour.

## 8. WHAT BREAKS IF THIS IS DONE WRONG

- A hold pause with no visible pause control is an accessibility fail and a trap for anyone who cannot hold.
- Per word reveals look alive and hit 6 Hz. Banned.
- Playing the clip in both Reel A and the release.
- A slide timer that lives in `setTimeout`: pause, back and voice drift all break.
- Any breathing on a sealed or locked object reads as available.

## 9. RECOMMENDATIONS

1. **Reel engine, one clock, cue lists, pause, skip, tap zones (M).** Everything else hangs on it. ICPs moved: the stranger on a phone, the person in a hurry, anyone who hates pressing buttons.
2. **Reel A, six poses on the boot figure, silent, 27.8s to the gate (M).** The new aesthetic and the end of the button wall. The stranger, the sceptic who needs it to feel real.
3. **Release opening cued to the clip, with word times from the owner (M).** The recorded voice finally leads the screen. The anxious or somatic user, the practitioner led client.
4. **Reel B and the figure into the Field hub, with the Land on first release (S to M).** The first reading lands instead of printing. All ICPs at the moment of value.
5. **Reduced motion state and `body.still` (S).** Motion sensitive users, and the audit.
6. **Cut `.ob-wash`, the app behind, the leave mismatch, and the replayed dots (S).** Older phones and laptops.

Gate 12 in `tests/design.js` hard codes four durations; my 520ms transit, 900ms station and 5.65s breath need a named edit. Motion inventory growth is justified: the Reel is the only motion with a clock.

## 10. QUESTION FOR THE OWNER

None. Decisions: Reel A is silent, the recording stays at the release, skip goes to the decision and not the app, the gate never auto advances. Reason: he asked for no button pressing and a first release, and a slider that decides for the person or plays his voice twice would break the second.
