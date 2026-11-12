'use strict';
// Task #69: when a user says "it crashed," there was nothing to look at —
// no disk logging, no crashReporter, no diagnostics bundle. console.* in a
// packaged Windows app goes nowhere, and the recorder window's own log()
// wrote into a hidden DOM element in a window the user never sees.
//
// A single rolling file at userData/logs/mob.log. One rotation (not an
// unbounded .1/.2/.3 series) keeps disk use bounded with no cleanup logic
// needed — a desktop app's log doesn't need more history than "this run
// plus the previous one."

const fs = require('fs');
const path = require('path');

const MAX_BYTES = 2 * 1024 * 1024; // 2MB
let logPath = null;

function init(userDataPath) {
  const logDir = path.join(userDataPath, 'logs');
  try { fs.mkdirSync(logDir, { recursive: true }); } catch (_) { /* best effort */ }
  logPath = path.join(logDir, 'mob.log');
  try {
    const st = fs.statSync(logPath);
    if (st.size > MAX_BYTES) fs.renameSync(logPath, logPath + '.old');
  } catch (_) { /* no existing log file yet, or rotation failed — not fatal either way */ }
  write('INFO', '--- log started ---');
}

function write(level, msg) {
  // Safe to call before init() (some modules load before app.whenReady) —
  // just drops the line rather than throwing. A logging failure must never
  // be the thing that crashes the app it's trying to diagnose.
  if (!logPath) return;
  try {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] [${level}] ${msg}\n`);
  } catch (_) { /* best effort */ }
}

function info(msg)  { write('INFO', msg); }
function warn(msg)  { write('WARN', msg); }
function error(msg) { write('ERROR', msg); }

/** Returns the last N lines of the current log file (for the diagnostics bundle). */
function tail(n = 200) {
  if (!logPath) return '';
  try {
    return fs.readFileSync(logPath, 'utf8').split('\n').slice(-n).join('\n');
  } catch (_) { return ''; }
}

function getLogPath() { return logPath; }

module.exports = { init, info, warn, error, tail, getLogPath };
