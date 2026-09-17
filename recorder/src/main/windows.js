'use strict';
/**
 * The app is three BrowserWindows:
 *   control  - the panel you interact with (source, camera, mic, output, record)
 *   bubble   - transparent always-on-top camera preview you drag around
 *   recorder - hidden; owns the media streams, composites screen+camera into
 *              a canvas, and runs MediaRecorder
 */
const path = require('path');
const { BrowserWindow, screen } = require('electron');
const Shapes = require('../shared/shapes');

const PRELOAD = path.join(__dirname, '..', 'preload', 'preload.js');
const R = (...p) => path.join(__dirname, '..', 'renderer', ...p);

const CONTROL_SIZE = { width: 400, height: 640 };
const COMPACT_SIZE = { width: 320, height: 60 };

function createControlWindow() {
  const win = new BrowserWindow({
    width: CONTROL_SIZE.width,
    height: CONTROL_SIZE.height,
    minWidth: 360,
    minHeight: 420,
    frame: false,
    resizable: true,
    backgroundColor: '#14161a',
    title: 'MOB Recorder',
    webPreferences: { preload: PRELOAD, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false }
  });
  win.loadFile(R('control', 'index.html'));
  win.setMenuBarVisibility(false);
  return win;
}

/**
 * Compute bubble bounds for a shape+size, keeping the bubble's centre if it
 * already has a position, otherwise parking it bottom-right of the primary
 * display.
 */
function bubbleBoundsFor(settings, current) {
  const { width, height } = Shapes.dimensions(settings.bubble.shape, settings.bubble.size);
  let x = settings.bubble.x;
  let y = settings.bubble.y;
  if (current) {
    x = Math.round(current.x + current.width / 2 - width / 2);
    y = Math.round(current.y + current.height / 2 - height / 2);
  } else if (x == null || y == null) {
    const wa = screen.getPrimaryDisplay().workArea;
    x = wa.x + wa.width - width - 32;
    y = wa.y + wa.height - height - 32;
  }
  return clampToDisplays({ x, y, width, height });
}

/** Keep the bubble at least partially on some display. */
function clampToDisplays(b) {
  const d = screen.getDisplayMatching(b).workArea;
  const x = Math.min(Math.max(b.x, d.x - b.width + 40), d.x + d.width - 40);
  const y = Math.min(Math.max(b.y, d.y), d.y + d.height - 40);
  return { x, y, width: b.width, height: b.height };
}

function createBubbleWindow(settings) {
  const bounds = bubbleBoundsFor(settings, null);
  const win = new BrowserWindow({
    ...bounds,
    frame: false,
    transparent: true,
    resizable: false,       // we resize ourselves via setBounds to keep the aspect ratio
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    alwaysOnTop: true,
    show: settings.bubble.visible,
    title: 'Camera',
    webPreferences: { preload: PRELOAD, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false }
  });
  // 'screen-saver' is the highest level below system UI, so the bubble stays
  // above fullscreen apps too.
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setMenuBarVisibility(false);
  // Windows 10 2004+: WDA_EXCLUDEFROMCAPTURE removes this window from screen
  // capture, so the recording shows only the composited camera, not the live
  // bubble underneath it.
  win.setContentProtection(!!settings.bubble.excludeFromCapture);
  win.loadFile(R('bubble', 'index.html'));
  return win;
}

function createRecorderWindow() {
  const win = new BrowserWindow({
    width: 640,
    height: 360,
    show: false,
    webPreferences: { preload: PRELOAD, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false }
  });
  win.loadFile(R('recorder', 'index.html'));
  return win;
}

module.exports = { createControlWindow, createBubbleWindow, createRecorderWindow, bubbleBoundsFor, clampToDisplays, CONTROL_SIZE, COMPACT_SIZE };
