'use strict';
/**
 * Tiny JSON settings store. Lives at <userData>/settings.json.
 * No dependency; deep-merges partial updates and notifies listeners.
 */
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const DEFAULTS = {
  cloudflare: {
    workerUrl: null,   // e.g. https://mob-recorder.your-subdomain.workers.dev
    apiToken:  null,   // set via UI or CLOUDFLARE_API_TOKEN env var
  },
  bubble: {
    shape: 'circle',      // key from shared/shapes.js
    size: 240,            // shorter side in DIP
    x: null,              // null = bottom-right of primary display on first run
    y: null,
    mirror: true,      // flip left-right (what you see in a real mirror)
    flipV: false,      // flip upside down (for cameras mounted inverted)
    visible: true,
    border: true,
    excludeFromCapture: true // Windows WDA_EXCLUDEFROMCAPTURE so the bubble isn't recorded twice
  },
  camera: { deviceId: 'default' },
  mic: { deviceId: 'default', enabled: true },
  source: { id: null, name: null, kind: 'screen', displayId: null },
  recording: {
    fps: 30,              // 30 or 60
    maxHeight: 1080,      // 720, 1080, or 0 for native
    countdown: 3,         // seconds, 0 to disable
    format: 'mp4',        // 'mp4' | 'webm'
    codec: 'h264',        // see main/ffmpeg.js CODECS
    quality: 'high',      // 'high' | 'balanced' | 'small'
    saveDir: null,        // null = ~/Videos/MOB Recorder
    askWhereToSave: false,
    compactWhileRecording: true
  },
  window: {
    x: null, y: null, width: null, height: null
  },
  edit: {
    // Marked "resolved" in the spec (labeled slider, 300/500/750ms stops,
    // default 500) but never implemented — silence.js hardcoded the cutoff
    // with no way for a user to tune it for their speaking cadence.
    silenceThresholdMs: 500
  },
  ui: {
    // #59: a new user has no reason to know Edit needs a transcript first,
    // or that Production needs Edit's transcript, or what Distribution
    // needs configured — each tab just silently no-ops until its
    // prerequisite exists. Shown once; the Camera tab has a dismiss button
    // that flips this.
    seenModesIntro: false
  },
  // #59: these four bindings were hardcoded in main.js with no way to
  // rebind them, and a conflict with another app's shortcut only
  // console.warn'd — invisible to the user, who just saw the hotkey do
  // nothing. Accelerator strings in Electron's own format.
  hotkeys: {
    toggleRecording: 'CommandOrControl+Shift+R',
    togglePause: 'CommandOrControl+Shift+P',
    toggleMic: 'CommandOrControl+Shift+M',
    toggleBubble: 'CommandOrControl+Shift+H',
    // Task #56: left unbound by default — a global accelerator claimed with
    // no warning on an app that's recording continuously is more likely to
    // steal a shortcut the user wanted for something else than to get used.
    dropChapterMarker: '',
    dropRetakeMarker: '',
  }
};

let cache = null;
const listeners = new Set();

function file() { return path.join(app.getPath('userData'), 'settings.json'); }

function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }

function merge(base, patch) {
  const out = Object.assign({}, base);
  for (const k of Object.keys(patch || {})) {
    out[k] = isObj(base[k]) && isObj(patch[k]) ? merge(base[k], patch[k]) : patch[k];
  }
  return out;
}

function load() {
  if (cache) return cache;
  let stored = {};
  try {
    stored = JSON.parse(fs.readFileSync(file(), 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      // The file exists but failed to parse (e.g. a crash mid-write before
      // the atomic write below existed). This used to silently fall back to
      // DEFAULTS with no sign anything was lost — including the Cloudflare
      // worker URL/token, the save directory, and window/bubble geometry.
      // Back it up instead of discarding it.
      try {
        fs.copyFileSync(file(), file() + '.corrupt-' + Date.now());
        console.error('[mob] settings.json was corrupt and has been reset to defaults; the bad file was backed up alongside it:', err.message);
      } catch (_) { /* best effort */ }
    }
  }
  cache = merge(DEFAULTS, stored);
  if (!cache.recording.saveDir) {
    cache.recording.saveDir = path.join(app.getPath('videos'), 'MOB Recorder');
  }
  return cache;
}

function get() { return load(); }

function set(patch) {
  cache = merge(load(), patch);
  try {
    const target = file();
    fs.mkdirSync(path.dirname(target), { recursive: true });
    // Temp file + rename instead of writing target directly — writeFileSync
    // truncates before the new bytes land, so a crash mid-write left a
    // half-written, unparseable settings.json.
    const tmp = target + '.tmp-' + process.pid;
    fs.writeFileSync(tmp, JSON.stringify(cache, null, 2));
    fs.renameSync(tmp, target);
  } catch (err) {
    console.error('settings: failed to write', err);
  }
  for (const fn of listeners) fn(cache, patch);
  return cache;
}

function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

module.exports = { get, set, onChange, DEFAULTS };
