GRADE: 61/100

Seat: Anders Kjeld, technical director. Subject: can the new onboarding be an automatic slider inside one HTML file, and what does it cost. Read from `atuned_src/` and `source.html`, and measured in the sandbox Chromium (no GPU, software raster) on 2 October. Where a number is an estimate it says so.

## How it works today
- `ui/onboard.js` and `ui/tutorial.js` (26KB together) are one machine: a global `OB` or `TUT` with a `step` integer, one `innerHTML` write per click, one click listener. There is no clock. Nothing moves unless a button is pressed.
- They fill `#ob` and `#tutorial`, fixed hosts at z-index 95: a `.ob-card` (560px, 88vh) over a 94% black ground. The login reuses the same `.ob-*` classes, so those rules stay.
- Handover: `loginEnter()` calls `obOpen(false)` once, gated on `CURP.ui.onboarded`. `obClose()` fades 520ms, saves the flag, reports a failed save, calls `render()`.
- The one frame loop, `loop(ts)` in `ui/ui.js`, keeps drawing the Field every frame under the sheet.

## Scores for the current onboarding (feasibility and cost)
| Criterion | /10 | Evidence |
|---|---|---|
| Frame cost while open | 4 | The Field is drawn for a screen nobody can see: 1.7ms JS blank, 2.5ms loaded (300 calls timed). Main thread 29 to 39% busy with the sheet up against 6% when the loop idles (software raster: read as a ratio) |
| Compositor behaviour | 7 | No `backdrop-filter` (gate 13 forbids it). But `.ob-wash` is 130% size with `blur(30px)` and a rotate: at a 390 by 844 phone with 3x pixels that is about 20MB of texture, against 11.8MB for one full screen layer. The blur is pointless, the gradients are already soft.  Arithmetic, not measured |
| Timing machinery | 2 | None. No clock, pause, resume or per slide duration |
| Garbage and allocation | 8 | Nothing per frame. One string per click |
| 390 wide | 5 | Card uses `88vh` not `dvh` (the phone's moving address bar breaks vh), and copy heavy slides scroll inside the card (`390-ob-1.png` fills the screen) |
| Testability | 6 | Driven by selectors, real time waits, no clock to step |
| Gate coverage | 3 | `design.js` and `collide.js` run with `?dev=1`, which skips the login and onboarding, so no design gate ever measures the sheet open |
| Degradation | 6 | Reduced motion handled for wash and dots |
| Failure honesty | 8 | Save failure reported, sheet still closes |
| Size | 9 | 26KB of JS for both flows |

## THE SOUL
A reading room: the instrument waits for the person. He asked for a sequence that carries the person. The machinery is small, so replacing it is cheap. Keep only the names `obOpen`, `obClose`, `OB.open`, which the gates call.

## WHAT BREAKS
1. The Field keeps drawing under the new sequence unless the loop is told to stop. Cost 2 to 2.5ms JS on this machine. On a four year old laptop, 2 to 3 times slower (estimate from this container, not a device), that is 5 to 7ms of my 8ms budget, spent on nothing.
2. `setTimeout` chains drift and cannot pause cleanly. A CSS `animationend` clock never fires if reduced motion removes the animation, so the sequence freezes silently. Both rejected.
3. iOS: press and hold selects text and opens a callout menu, which breaks hold to pause. Opus in WebM may not play on older Safari (I believe it arrived late, not tested; I cannot test a phone here).
4. About 30 lines in `functional.js` assume click driven steps (listed below).

## RECOMMENDATIONS for the new onboarding

**1. One clock, in the existing loop. S.** Add `if(SL.on){slTick(ts);requestAnimationFrame(loop);return;}` after the `S.t` line in `loop`. `slTick` is delta based, `dt` clamped to 50ms like `S.t`, so pause is just not adding. No second rAF. `slTick(dtMs)` takes plain numbers so gates drive it with a fake clock. Slide table built once, two reused text layers, zero objects per frame. The progress bar is one element, `transform:scaleX()`, written only when the value changes in steps of 1/200.
- Dwell: `1800 + 330 x words` ms, clamped 2600 to 7000. Reduced motion: x1.4.
- Hold: press for 180ms pauses. A shorter tap: right two thirds next, left third back. Space toggles hold, arrows step, Escape leaves. Page hidden: hold.
- Real buttons, each 44 by 44: Pause, Back, Skip (quiet, top right), Sound. Zones are not buttons.
- Slide kinds: `auto` (timed) and `gate` (no timer: the starting point choice, the first story). A gate stops the clock and shows the one control. Answering the signal test advances after 1200ms, no Next button.
- iOS: `user-select:none; -webkit-touch-callout:none` on the stage, `100dvh`, `env(safe-area-inset-*)`.

**2. Stop the Field while the slider is open, fade into it at the end. S.** The same one line saves 2 to 2.5ms a frame. At handoff the stage drops `opacity` over 420ms (compositor only) while the Field resumes. Drawing the Field live behind the slides is the L option: full cost back, and any blur over it breaks gate 13. My 85% version: opaque ground `#06060a` (the login's), the seven seat figure from `obFigure()` (10 SVG nodes), the wash as plain gradients at 100% size, scale only 1 to 1.06 over 30s, no filter, no rotate. Two full screen layers at most (about 24MB on a 3x phone).

**3. Voice: lazy, shared, off by default. S for the code, one decision for the size.**
- Embed as `<script type="text/plain" id="vo-opening">` in a new `shell/voice.html`, listed in MANIFEST after `shell/body.html` and before `shell/foot.html`, so the end of file marker stays last. It never touches the JS parser.
- Decode only when needed: `atob`, `Uint8Array`, `Blob`, `URL.createObjectURL`, `new Audio(url)`, in `ui/sound.js` (the one file allowed audio). About 1 to 3ms (estimate). Use an audio element, not `decodeAudioData`: the clip is mono 48kHz, so decoded it is 49.7 x 48000 x 4 = 9.5MB against 143KB.
- Guard on `canPlayType('audio/webm; codecs=opus')`. If empty, hide the Sound control and play silent. The screen text is complete without it.
- Seeking works: the file has Cues and Duration. With sound on, voice is the clock: read `audio.currentTime` each frame (free), slide boundaries from the 10 phrase starts in the timing file. Hold or hidden page pauses audio. Revoke the blob URL on close. The Sound tap is the gesture the browser wants.
- The first 28s of the clip is the settle script and the last 20s the release stem, so it also serves the release screen: one embed pays for both. Narrative seat: a 50s voice is the longest thing in the sequence.

**4. Build size, measured. S.**
| File | Now | With 191,020 bytes of base64 audio | Change |
|---|---|---|---|
| `source.html` | 3,712,246 | about 3,903,500 | +5.1% |
| `atuned-slim.html` | 2,343,097 | about 2,534,300 | +8.2% |
| `atuned-packed.html` | 1,753,033 | about 1,941,700 | +10.8% |

Opus does not compress: gzip grew 141,472 bytes for 143,265 raw, then the packer's base64 adds a third. Optional: re-encode at 16kbps (now about 23); estimate 95KB, about 45KB saved packed, unconfirmed, no encoder here. `tools/slim.py` only strips bare `<script>` blocks, so `text/plain` passes (verify with one run). `tools/pack.js` needs no change. This file has a history of arriving cut and grows 10.8%, so the end marker stays last.

**5. Gates. M.**
- `functional.js`: line 26 (`booted` closes `OB`) survives if the names stay. Rewrite lines 2374 to 2416 (`.ob-h`, `[data-ob=next]`, disabled Next, `[data-obseat]`, four steps) around `slTick`: advances with no click, hold stops it, back works, a gate stops it, answering advances, zero charge written, `onboarded` saved. Count slides from `OB_SLIDES.length`, never a typed 4. Line 2437 reads the first slide synchronously. The paid welcome block (4541) survives.
- `design.js`: new gate 15 runs the slider open at 390x844, 375x667 and 1600x1000, every slide: type floor 11px, tap floor 44 on every control, no all caps, no horizontal scroll, CSS coverage of every `.sl-*` class, durations only 0.12, 0.22, 0.32 or 0.42s (gate 12), no `ease`. Gate 7 stays at zero requests with voice on (blob URLs are allowed). In the spirit of gate 13: wrap `window.draw`, assert zero calls while open and more than zero after close, fps 30 as backstop.
- `collide.js`: no change (wheel plates only). `boot.js`: expect green unchanged; add a 97% cut (must say short) and a corrupt voice block (no alert, plays silent).
- `tools/monitor.js`: add a per slide walk at both widths, non zero exit on an empty slide. `tools/shots.js`: needs a still mode (`SL.still`) and reduced motion emulated before load.

**6. Cheapest path. M, 3 to 4 days.** Keep `#ob`, `obOpen`, `obClose`, `OB`. Replace `obRender` and `obCard` with a slide table and `slTick`. New `.sl-*` classes (about 120 lines CSS), `.ob-*` stays for the login. The tutorial reuses the engine: its journal step is a gate, its result slides are timed. About 250 lines JS. Audio is one more S task.

## The floor
No sound: silent, full text, fine. Reduced motion: fades only, longer dwell, Pause always visible (auto moving content must be stoppable). A 30fps battery saver: the clock is time based, so slides stay on time. Oldest realistic phone: two full screen layers, no per frame work, no filter. Acceptable.

ICPs moved: phone only arrival (390 layout, dvh, hold callout), the skeptic (no sound, no wait), someone in acute distress (Pause always one tap, nothing forces pace), the practitioner (Skip and replay from the account area).

Question for the owner: none. Decision taken: the Field is paused during the slider and revealed at the end, because the first screen of a stranger's Field is empty anyway.
