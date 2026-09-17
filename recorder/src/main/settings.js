'use strict';
/**
 * Tiny JSON settings store. Lives at <userData>/settings.json.
 * No dependency; deep-merges partial updates and notifies listeners.
 */
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const DEFAULTS = {
  bubble: {
    shape: 'circle',      // key from shared/shapes.js
    size: 240,            // shorter side in DIP
    x: null,              // null = bottom-right of primary display on first run
    y: null,
    mirror: true,
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
  try { stored = JSON.parse(fs.readFileSync(file(), 'utf8')); } catch (_) { /* first run */ }
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
    fs.mkdirSync(path.dirname(file()), { recursive: true });
    fs.writeFileSync(file(), JSON.stringify(cache, null, 2));
  } catch (err) {
    console.error('settings: failed to write', err);
  }
  for (const fn of listeners) fn(cache, patch);
  return cache;
}

function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

module.exports = { get, set, onChange, DEFAULTS };
