# MOB Recorder

A local, Loom-style screen recorder for Windows. It records your screen with your
webcam floating on top in a shape you choose (circle, rounded square, pill, hexagon…),
captures your microphone, and saves a finished **MP4 (H.264)** or **WebM** to disk.
Nothing is uploaded anywhere.

Built with Electron. Everything runs on your laptop.

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
- [Node.js](https://nodejs.org) 18 or newer (only to run from source or build the installer).
- A webcam and microphone. Bluetooth headsets: pair in Windows Settings first; they then
  appear in the Microphone dropdown.

## Run it

```powershell
cd recorder
npm install
npm start
```

The first launch asks for camera and microphone access. Windows 10 does not prompt for
screen recording; if you get "Permission denied", open **Settings → Privacy → Camera /
Microphone** and make sure *Allow desktop apps to access your camera / microphone* is on.

## Build an installer / portable EXE

```powershell
npm run dist            # installer + portable EXE in recorder/dist/
npm run dist:portable   # portable EXE only
```

The EXE is unsigned, so SmartScreen will show "Windows protected your PC" the first time.
Click **More info → Run anyway**. That's expected for a personal build.

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
│   └── shot.js                   # window screenshot capture for layout review
└── src/
    ├── main/
    │   ├── main.js               # app lifecycle, recording state machine, IPC, hotkeys
    │   ├── windows.js            # creates the control / bubble / recorder windows
    │   ├── settings.js           # JSON settings store (<userData>/settings.json)
    │   ├── ffmpeg.js             # encoder presets and the finalize step
    │   ├── recording-files.js    # streams chunks to disk, hands off to ffmpeg
    │   └── smoke.js              # self-test, loaded only with MOB_SMOKE=1
    ├── preload/preload.js        # narrow contextBridge API for renderers
    ├── shared/shapes.js          # one shape definition → CSS clip-path + canvas path
    └── renderer/
        ├── control/              # the panel UI
        ├── bubble/               # floating camera preview
        └── recorder/             # compositor + MediaRecorder engine
```

## Testing

`npm run smoke` launches the app with synthetic camera/mic devices, records the screen
for 4 seconds, finalizes to MP4, and exits 0 on success. `MOB_SMOKE_SHAPE=hexagon`
records with a given bubble shape so the overlay can be checked.

`npm run shot` captures PNGs of the control panel and bubble for layout review.
`MOB_SHOT_STATES=output,compact,shapes` adds variants. Both harnesses run against a
throwaway settings profile, so they never inherit your real configuration. On Linux
wrap either with `xvfb-run`.

## Known limitations

- **System audio** (sound playing on your PC) is not captured. Mic only for now.
- When recording a **single window** rather than a display, the bubble is pinned to the
  bottom-right of the video at its chosen size, because Windows doesn't tell us where
  that window sits relative to the bubble.
- Bubble dragged onto a monitor that isn't being recorded simply won't appear in the video.
- Camera background blur / virtual background is not implemented yet.

## Roadmap ideas

- Cursor highlight and click ripples.
- Post-record editor: move or resize the bubble after the fact (requires recording the
  camera as a separate track).
- System audio via WASAPI loopback.
- Background blur using MediaPipe selfie segmentation.
