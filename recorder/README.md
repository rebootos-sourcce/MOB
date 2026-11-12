# MOB Recorder

A local, Loom-style screen recorder for Windows. It records your screen with your
webcam floating on top in a shape you choose (circle, rounded square, pill, hexagon…),
captures your microphone, and saves a finished **MP4 (H.264)** or **WebM** to disk.
Nothing is uploaded anywhere unless you explicitly configure Cloudflare sync.

Built with Electron. Everything runs on your laptop. The app has four modes, one tab each:

- **Camera** — record. Everything below this line in this README is Camera mode.
- **Edit** — transcribe a recording (local Whisper, via `@xenova/transformers`), remove
  detected filler words and silences, trim with in/out handles, create standalone clips,
  run the "Studio Sound" audio chain, and render your cuts to an actual output file.
- **Production** — generate a title, description, hashtags and chapter markers from the
  transcript, regenerate any one of those fields without touching the others, and export
  a JSON file plus a YouTube-ready description with the chapter list baked in.
- **Distribution** — upload a recording and its production package to Cloudflare R2
  (optional; only active once you set a Worker URL and API token under Output → Cloud).

Edit requires a transcript, Production requires Edit's transcript, Distribution requires
a Production package — each tab's "Select a recording" list only shows what's ready for it.

## What it does

- **Test your camera before you record.** The panel opens with a live preview in the
  exact shape, flip and ring that will be recorded, plus the resolution and frame rate
  your camera actually negotiated.
- **Pick your camera and mic** from dropdowns; the preview and level meter switch instantly.
- **Flip** the camera left-to-right (mirror) or upside down. Applies to the preview, the
  bubble and the recording together.
- **Screen + camera bubble** recording, screen-only if no camera is present.
- **Camera bubble** you can drag anywhere, resize with the corner grip or S/M/L presets,
  and switch between 7 shapes live. Optional border ring that follows any outline,
  polygons included. Hide/show at any time.
- **What you see is what's recorded**: the bubble's on-screen position and shape are
  composited into the video in real time.
- **Microphone** picker (built-in, USB, Bluetooth headsets — anything Windows lists),
  mute/unmute during recording, and a live level meter so you can see it's registering.
- **Pick what to record**: any display or a single window.
- **Output**: MP4 with H.264 (default, best compatibility), H.265, or AV1; or WebM.
  Quality presets High / Balanced / Small. 720p, 1080p, or native resolution. 30 or 60 fps.
- **Pause / resume**, 3-second countdown, global hotkeys, compact floating bar while recording.
- **Panel laid out as the order you work**: 1 check yourself, 2 bubble look, 3 what to
  record, 4 output (collapsed, you set it once), with the record button always pinned
  to the bottom.
- Recordings stream to disk as you go, so a crash never loses the take.

## Requirements

- Windows 10 version 2004 or newer (21H1/21H2 is fine), 64-bit. Windows 11 works too.
- Camera and microphone access enabled for desktop apps (see **First run on Windows**).
- [Node.js](https://nodejs.org) 18 or newer (only to run from source or build the installer).
- A webcam and microphone. Bluetooth headsets: pair in Windows Settings first; they then
  appear in the Microphone dropdown.

## First run on Windows

### "Windows protected your PC"

You will see this once. It is SmartScreen, and it appears because the file is
**unsigned** and carries a "downloaded from the internet" mark. It is not a virus
warning and no package format avoids it — installer, portable EXE, ZIP and MSI all
trigger it the same way.

Two ways past it:

- **Click through it once.** Click **More info**, then **Run anyway**. Windows
  remembers the choice for that file.
- **Remove the mark first** (no warning at all). Right-click the downloaded `.exe`
  → **Properties** → tick **Unblock** at the bottom → **OK**. Then run it normally.
  The PowerShell equivalent is `Unblock-File .\MOB-Recorder-0.1.0-portable.exe`.

The only permanent fix is a code signing certificate, which costs roughly $200–600
a year. An EV certificate earns SmartScreen trust immediately; a cheaper OV one still
warns until the file builds download reputation. For a tool you use yourself, that is
not worth paying for — unblock the file once and move on.

### Camera and microphone access

Windows 10 does **not** prompt desktop apps for the camera the way a browser does.
Access is controlled by one global switch, and when it is off `getUserMedia` simply
fails with no explanation. The app detects this and shows a banner with a button that
opens the right Settings page.

To set it manually: **Settings → Privacy → Camera**, turn on *Allow apps to access your
camera*, then scroll to the bottom and turn on **Allow desktop apps to access your
camera**. That second switch is the one that matters and it is easy to miss. Repeat
under **Privacy → Microphone**.

### If a camera stops working

Webcams — especially a second or external one — sometimes wedge until the device is
reset. The app will say `Can't open "…"` with a **Try again** button. If that does not
help:

1. Close anything else that might hold the camera (Teams, Zoom, the Windows Camera app,
   a browser tab). Only one app can own some webcams at a time.
2. Unplug and replug a USB camera, then press the **↻** button next to the ready badge
   to re-scan.
3. Failing that, reboot. A driver in a bad state usually needs it.

Use the **↻** button any time you plug in or pair a new camera, headset or microphone —
it re-reads permissions and the device list without restarting the app.

## Run it from source

```powershell
cd recorder
npm install
npm start
```

## Hotkeys

| Keys | Action |
|---|---|
| Ctrl + Shift + R | Start / stop recording |
| Ctrl + Shift + P | Pause / resume |
| Ctrl + Shift + M | Mute / unmute mic |
| Ctrl + Shift + H | Hide / show the camera bubble |

Right-click the bubble for shape, size, snap-to-corner, mirror and flip. Double-click it to hide.

## Codecs: which one to pick

- **H.264 (libx264)** — the default. Plays everywhere (Slack, Teams, phones, browsers).
  Encoded with `-preset slow -crf 18` at High quality, which is visually lossless for
  screen content and noticeably better than Loom's output.
- **H.265 / HEVC** — about 40% smaller at the same quality. Needs a modern player; Windows 10
  may need the free HEVC extension from the Store to play it in Movies & TV. VLC plays it fine.
- **AV1 (SVT-AV1)** — the smallest files, slow to encode. Only shown if the bundled FFmpeg
  build includes it.
- **GPU encoders (NVIDIA / Intel / AMD)** — fast, slightly lower quality per megabyte.
  Listed only when the FFmpeg build has them. If a GPU encoder fails the app retries with
  libx264 automatically.

WebM output is a stream copy of the live VP9 recording, so it saves instantly.

## How it works

```
 ┌──────────────┐   settings / commands    ┌──────────────────┐
 │ control panel│ ───────────────────────▶ │   main process   │
 │  (window)    │ ◀─────────────────────── │  state machine,  │
 └──────────────┘   state, progress        │  hotkeys, ffmpeg │
                                           └───┬──────────▲───┘
 ┌──────────────┐  bounds / shape (live)        │          │ 1 s chunks
 │ camera bubble│ ──────────────────────────────┘          │
 │ (transparent,│                                ┌─────────┴────────┐
 │ always on top│                                │ recorder (hidden)│
 └──────────────┘                                │ screen + cam +   │
                                                 │ mic → canvas →   │
                                                 │ MediaRecorder    │
                                                 └──────────────────┘
```

1. The **recorder** window grabs the chosen display via `desktopCapturer`, the webcam and
   mic via `getUserMedia`, and paints screen + shaped camera into a canvas every frame.
2. `canvas.captureStream()` plus the mic track feed `MediaRecorder` (VP9/Opus WebM). Each
   1-second chunk is sent to the main process and appended to a raw file on disk.
3. On stop, **FFmpeg** (bundled via `ffmpeg-static`) transcodes to MP4 with `+faststart`,
   or stream-copies to a seekable WebM. The raw file is deleted on success and kept if
   anything fails, with the path shown in the panel.
4. The **bubble** window is excluded from screen capture (`setContentProtection`, i.e.
   `WDA_EXCLUDEFROMCAPTURE`) so the camera appears only once in the video. If your
   Windows build doesn't support that, the live bubble and the composited one overlap
   exactly, so the result still looks right.

## Project layout

```
recorder/
├── package.json
├── scripts/
│   ├── smoke.js                  # headless end-to-end recording self-test
│   ├── shot.js                   # window screenshot capture for layout review
│   └── check-syntax.js           # recursive node --check over src/
├── test/                         # node:test unit tests (npm test)
└── src/
    ├── main/
    │   ├── main.js               # app lifecycle, recording state machine, IPC, hotkeys
    │   ├── windows.js            # creates the control / bubble / recorder windows
    │   ├── settings.js           # JSON settings store (<userData>/settings.json)
    │   ├── ffmpeg.js             # encoder presets, finalize, Studio Sound audio chain
    │   ├── recording-files.js    # streams chunks to disk, hands off to ffmpeg
    │   ├── logger.js             # rolling log file at <userData>/logs/mob.log
    │   ├── transcription.js      # Whisper pipeline (ADR-008); MOB_FAKE_TRANSCRIPT fixture
    │   ├── edl.js / production.js / identity.js / ...
    │   ├── db/                   # sql.js-backed SQLite (ADR-001, ADR-006) + migrations
    │   ├── intelligence/         # filler/silence/caption/hashtag/energy algorithms
    │   ├── ipc/                  # one file per IPC surface (db, edit, production, sync, voice)
    │   └── smoke.js              # self-test, loaded only with MOB_SMOKE=1
    ├── preload/preload.js        # narrow contextBridge API for renderers
    ├── shared/shapes.js          # one shape definition → CSS clip-path + canvas path
    └── renderer/
        ├── control/              # the panel UI — all four modes
        ├── bubble/               # floating camera preview
        └── recorder/             # compositor + MediaRecorder engine
```

See `../docs/adr/` for the design decisions behind the main process (local-first SQLite,
why sql.js instead of a native binding, the EDL model, device identity, Cloudflare
Queues, the intelligence algorithms' correctness rules, why segments replaced a separate
captions table, and why transcription runs in-process rather than a worker thread) — and
ADR-009 for the full list of spec'd features deliberately not built here, each with its
citation, so a feature on that list doesn't need re-discovering as a gap.

## Testing

`npm run check` syntax-checks every file under `src/`. `npm test` runs the unit test
suite (`node --test` — zero extra dependencies) over the pure algorithm modules in
`src/main/intelligence/` plus the EDL/shapes/key helpers: filler/silence detection,
caption formation, hashtag TF-IDF, energy scoring, EDL timestamp remapping. These need
no Electron, DB, or filesystem and run in well under a second.

`npm run smoke` launches the real app with synthetic camera/mic devices, records the
screen for 4 seconds, finalizes to MP4, and exits 0 on success. `MOB_SMOKE_SHAPE=hexagon`
records with a given bubble shape so the overlay can be checked.

Set `MOB_SMOKE_FULL=1` alongside `MOB_SMOKE=1` to also exercise Edit and Production:
transcribe the recording, assemble a package, and verify the resulting DB rows. On its
own this would download the ~150MB Whisper model on every run; also set
`MOB_FAKE_TRANSCRIPT=1` to skip that and feed a small canned word list through the exact
same downstream pipeline (filler/silence/caption/hashtag/energy detection, every DB
write) instead — the full pipeline then runs in a couple of seconds with no model
download, which is what CI does:

```powershell
$env:MOB_SMOKE_FULL=1; $env:MOB_FAKE_TRANSCRIPT=1; npm run smoke
```

`npm run shot` captures PNGs of the control panel and bubble for layout review.
`MOB_SHOT_STATES=output,compact,shapes,perm` adds variants, and `MOB_NO_FAKE=1` drops
the synthetic devices so the no-camera error states render. All three harnesses run
against a throwaway settings profile, so they never inherit your real configuration. On
Linux wrap any of them with `xvfb-run`.

## Known limitations

Real bugs and unfinished corners below. For the much longer list of spec'd features
deliberately *not* built (platform publishing beyond R2, Twitter/X, Instagram, AV1
export, LUT grading, speaker diarization, and more — each with why), see
`../docs/adr/009-deferred-feature-set.md`.

- **System audio** (sound playing on your PC) is not captured. Mic only for now.
- When recording a **single window** rather than a display, the bubble is pinned to the
  bottom-right of the video at its chosen size, because Windows doesn't tell us where
  that window sits relative to the bubble.
- Bubble dragged onto a monitor that isn't being recorded simply won't appear in the video.
- Camera background blur / virtual background is not implemented yet.
- Voice commands exist (`src/main/voice.js`) but are not reachable in practice — the wake
  word is a placeholder and recognition needs an API key with nothing to set it to.
- Distribution uploads to R2 but doesn't publish anywhere or return a shareable link; see
  `docs/adr/` and the task board for the current state of the Cloudflare Worker side.

If something breaks, use the **Diagnostics** card (bottom of the Camera tab) to copy
version, platform, encoder support, and recent log lines in one click — the underlying
log file lives at `<userData>/logs/mob.log`.

## Roadmap ideas

- Cursor highlight and click ripples.
- Post-record editor: move or resize the bubble after the fact (requires recording the
  camera as a separate track).
- System audio via WASAPI loopback.
- Background blur using MediaPipe selfie segmentation.
