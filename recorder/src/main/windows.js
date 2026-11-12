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
// #76: package.json's build.icon covers packaged installs; this is what an
// unpackaged dev run shows instead of the generic Electron logo on Windows
// and Linux taskbars (macOS dev-run Dock icon still falls back to
// Electron's own — not worth app.dock.setIcon() for a dev-only cosmetic).
const APP_ICON = path.join(__dirname, '..', '..', 'build', 'icon.png');

const CONTROL_SIZE = { width: 412, height: 680 };
const COMPACT_SIZE = { width: 320, height: 60 };

function createControlWindow() {
  const win = new BrowserWindow({
    width: CONTROL_SIZE.width,
    height: CONTROL_SIZE.height,
    minWidth: 380,
    minHeight: 480,
    frame: false,
    resizable: true,
    backgroundColor: '#14161a',
    title: 'MOB Recorder',
    icon: APP_ICON,
    // The panel may throttle in the background; it has nothing to keep alive
    // when it is not on screen. The bubble and the recorder must not throttle,
    // because they keep rendering while another app has focus.
    webPreferences: { preload: PRELOAD, contextIsolation: true, nodeIntegration: false }
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

/**
 * Task #77: region capture. Spans the union of every connected display (not
 * just the primary one) so a drag can start on any monitor, transparent and
 * always-on-top so it sits over whatever the user is looking at, like a
 * native OS region-capture crosshair. The window's own bounds become the
 * origin region-picker.js's mouse coordinates are relative to — main.js's
 * region:pick handler adds that offset back to get absolute DIP coordinates
 * before matching them against a specific display.
 */
function regionPickerBounds() {
  const displays = screen.getAllDisplays();
  const minX = Math.min(...displays.map(d => d.bounds.x));
  const minY = Math.min(...displays.map(d => d.bounds.y));
  const maxX = Math.max(...displays.map(d => d.bounds.x + d.bounds.width));
  const maxY = Math.max(...displays.map(d => d.bounds.y + d.bounds.height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function createRegionPickerWindow() {
  const bounds = regionPickerBounds();
  const win = new BrowserWindow({
    ...bounds,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    alwaysOnTop: true,
    focusable: true,
    title: 'Select region',
    webPreferences: { preload: PRELOAD, contextIsolation: true, nodeIntegration: false }
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setMenuBarVisibility(false);
  win.loadFile(R('region-picker', 'index.html'));
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

module.exports = { createControlWindow, createBubbleWindow, createRecorderWindow, createRegionPickerWindow, regionPickerBounds, bubbleBoundsFor, clampToDisplays, CONTROL_SIZE, COMPACT_SIZE };
