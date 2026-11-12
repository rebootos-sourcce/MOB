'use strict';
// S7: Voice command infrastructure.
// Architecture: Porcupine wake word ("Hey MOB") -> Vosk grammar recognizer -> command dispatch.
// Falls back gracefully when native libraries are unavailable (proxy-restricted build env).
//
// States: IDLE -> LISTENING (after wake word) -> TRANSCRIBING (command spoken) -> IDLE
//
// Task #55: mode-scoped grammar, matching docs/mob-recorder-tdd.html:1723-1796's
// IDLE/RECORDING/EDITING/GRADING/DISTRIBUTING table. The RECORDING/IDLE tiers
// dispatch straight to main-process callbacks (startRecording, dropMarker,
// …) the way this always worked, since main.js already has everything they
// need. EDITING/GRADING/DISTRIBUTING commands act on whichever recording is
// open in that tab — state the RENDERER has (selectedRecordingId) and the
// main process, where this file runs, does not — so those three dispatch via
// a new 'voice:editorCommand' event instead, and the renderer's own
// control.js reuses the exact same functions its buttons already call. Mode
// is tracked via setTab(), which the renderer calls on every tab switch;
// RECORDING always wins over whatever tab happens to still be visually
// selected, since getRecordingState() is live truth and _tab can only be
// stale between an actual tab click and the next one.
//
// Not yet real, and left out of COMMANDS rather than faked: "highlight
// this" (needs a tagged time RANGE, not a point marker — markers.sql only
// has point markers), "apply cinematic/clean grade" (no LUT/grading feature
// exists anywhere in this codebase yet), "copy share link" (task #48 — no
// shareable URL is ever produced today), and "upload to tiktok" as a
// DISTINCT action from "upload to youtube" (only one generic cloud-upload
// path exists; both phrases trigger it, documented in EDITING_COMMANDS'
// comment below rather than silently presented as separate real actions).

// Fix #26: longer phrases first so "stop recording" and "unmute" match before
// their prefixes ("stop", "mute") — entries are iterated in insertion order.
const IDLE_COMMANDS = [
  ['start recording', 'recorder:go'],
];

// "cut that"/"new take"/"scratch that" are the spec's three synonyms for the
// same retake-boundary marker dropMarker() already supports (task #56);
// "chapter here" is its chapter counterpart; "done" is the spec's shorter
// synonym for "stop recording".
const RECORDING_COMMANDS = [
  ['stop recording',  'recorder:stop'],
  ['chapter here',    'recorder:markChapter'],
  ['scratch that',    'recorder:markRetake'],
  ['new take',        'recorder:markRetake'],
  ['cut that',        'recorder:markRetake'],
  ['pause',           'recorder:pause'],
  ['resume',          'recorder:resume'],
  ['unmute',          'recorder:setMic'],
  ['mute',            'recorder:setMic'],
  ['stop',            'recorder:stop'],
  ['done',            'recorder:stop'],
];

// Dispatched to the renderer as 'voice:editorCommand' — see this file's own
// top comment for exactly which real function each channel reuses.
const EDITING_COMMANDS = [
  ['remove filler words', 'edit:removeFillers'],
  ['trim silences',       'edit:trimSilences'],
  ['clean up audio',      'edit:cleanAudio'],
  ['clean audio',         'edit:cleanAudio'],
  ['add captions',        'edit:addCaptions'],
  ['make a clip',         'edit:makeClip'],
  ['ready to grade',      'mode:toProduction'],
];

const GRADING_COMMANDS = [
  ['normalize audio',     'edit:cleanAudio'], // same real loudnorm/compress chain as "clean up audio" — this app has one audio-processing pass, not two
  ['export for youtube',  'production:exportFiles'],
  ['ready to publish',    'mode:toDistribution'],
];

const DISTRIBUTING_COMMANDS = [
  ['upload to youtube',   'distribution:upload'],
  ['upload to tiktok',    'distribution:upload'], // same generic cloud-upload path — no platform-specific upload exists yet
];

let _state         = 'IDLE';   // IDLE | LISTENING | TRANSCRIBING
let _sendControl    = null;
let _callbacks       = {};  // main-process recording callbacks
let _porcupine       = null;
let _vosk            = null;
let _enabled         = false;
let _listenTimer     = null; // Fix #16: track the listen-timeout so we can cancel it
let _tab             = 'camera'; // camera | edit | production | distribution — set by the renderer via setTab()
let _transcribing    = false;
let _queuedCommands  = []; // commands heard while _transcribing — replayed once it clears

function getState()  { return _state; }
function isEnabled() { return _enabled; }

/** Renderer calls this on every tab switch — see this file's top comment. */
function setTab(tab) { _tab = tab; }

/**
 * S7 acceptance (build-plan:911): commands spoken while a transcription is
 * running must queue, not be dropped or misfire mid-transcribe. The renderer
 * calls this around its transcription:start invoke (true before, false in a
 * finally{} after). Going false replays whatever queued, in order, through
 * the exact same dispatch path a live command would have used.
 */
function setTranscribing(flag) {
  _transcribing = !!flag;
  if (_transcribing) return;
  const queued = _queuedCommands;
  _queuedCommands = [];
  for (const text of queued) _dispatchText(text);
}

/**
 * Initialize voice commands. Silently no-ops if native libraries aren't available.
 *
 * Task #72: this used to hard-require PICOVOICE_API_KEY before even
 * attempting Vosk, which meant voice commands were completely unreachable
 * for anyone without a Picovoice account — even though Vosk itself is free,
 * offline, open-source, and needs no key at all. Porcupine (wake word) and
 * Vosk (command recognition) are now tried independently: Vosk-only gives
 * continuous command recognition with no "Hey MOB" wake word (see the
 * processAudio() branch below), which is the only mode most users without a
 * Picovoice key will ever reach; adding a key layers proper wake-word
 * gating on top. _enabled reflects whichever combination is actually
 * available, not just the Porcupine case.
 *
 * @param {function} sendControl   main.js sendControl(channel, payload)
 * @param {object}   callbacks     { startRecording, stopRecording, togglePause, setMic, dropMarker, getRecordingState }
 */
async function init(sendControl, callbacks) {
  _sendControl = sendControl;
  _callbacks   = callbacks || {};

  if (process.env.PICOVOICE_API_KEY) {
    try {
      const { Porcupine, BuiltinKeyword } = require('@picovoice/porcupine-node');
      _porcupine = new Porcupine(
        process.env.PICOVOICE_API_KEY,
        [BuiltinKeyword.HEY_GOOGLE], // placeholder — replace with custom "Hey MOB" model
        [0.5]
      );
      console.log('[mob/voice] Porcupine loaded (wake-word gating enabled)');
    } catch (_) {
      _porcupine = null;
      console.log('[mob/voice] Porcupine not available — continuing without wake-word gating');
    }
  } else {
    console.log('[mob/voice] PICOVOICE_API_KEY not set — no wake-word gating; trying Vosk-only mode');
  }

  try {
    const vosk = require('vosk');
    vosk.setLogLevel(-1);
    const { app } = require('electron');
    const path = require('path');
    const modelPath = path.join(app.getPath('userData'), 'vosk-model');
    if (require('fs').existsSync(modelPath)) {
      const model = new vosk.Model(modelPath);
      _vosk = new vosk.Recognizer({ model, sampleRate: 16000 });
      console.log('[mob/voice] Vosk loaded');
    } else {
      console.log('[mob/voice] Vosk installed but no model at ' + modelPath + ' — voice commands disabled');
    }
  } catch (_) {
    console.log('[mob/voice] Vosk not available — voice commands disabled');
  }

  // Reachable in two independent shapes: Porcupine+Vosk (wake word, then a
  // command) or Vosk alone (every utterance is checked against the active
  // grammar, no wake word — see processAudio()). Porcupine with no Vosk
  // model is NOT enabled: a wake word that can never recognize a command
  // afterward isn't a working feature.
  _enabled = !!_vosk;
  if (!_enabled && _porcupine) {
    try { _porcupine.release(); } catch (_) { /* ignore */ }
    _porcupine = null;
  }
}

/**
 * Process an audio PCM frame (Int16Array, 512 samples at 16kHz).
 * Returns the dispatched command string, or null.
 */
function processAudio(frame) {
  if (!_enabled || !_vosk) return null;

  // No Porcupine (no Picovoice key, or it failed to load): there's no wake
  // word to gate on, so every committed Vosk utterance is checked against
  // the active grammar directly. Trade-off, not a bug — accepted
  // deliberately in init()'s own comment: this is the only mode reachable
  // without a Picovoice account, at the cost of needing to actually say a
  // command phrase rather than idle chatter (ordinary conversation not
  // matching any entry is simply ignored by _matchCommand's lookup, same as
  // today's wake-word path once past the keyword).
  if (!_porcupine) return _processVoskFrame(frame);

  try {
    const keywordIndex = _porcupine.process(frame);
    if (keywordIndex >= 0 && _state === 'IDLE') {
      _state = 'LISTENING';
      if (_sendControl) _sendControl('voice:listening', {});

      // Fix #16: store timer reference so _matchCommand can cancel it
      _listenTimer = setTimeout(() => {
        _listenTimer = null;
        if (_state === 'LISTENING') _state = 'IDLE';
      }, 5000);

      return null;
    }
  } catch (_) { return null; }

  if (_state !== 'LISTENING') return null;
  return _processVoskFrame(frame);
}

function _processVoskFrame(frame) {
  try {
    // acceptWaveform() returns true once Vosk has detected the end of an
    // utterance (a pause). This used to always read partialResult(), which
    // updates on every frame as speech is still being recognized — so an
    // unstable interim guess could dispatch an irreversible action (e.g.
    // stopping a take) before the user finished the sentence. Only the
    // committed final result is matched now; partials are discarded.
    const isFinal = _vosk.acceptWaveform(Buffer.from(frame.buffer));
    if (isFinal) {
      const final = JSON.parse(_vosk.result());
      if (final.text) return _dispatchText(final.text);
    }
  } catch (_) { /* ignore — treated as silence/unrecognized */ }
  return null;
}

// Queues during a transcription (S7/build-plan:911) instead of dispatching
// immediately; setTranscribing(false) drains the queue through this same
// function later, in order.
function _dispatchText(text) {
  if (_transcribing) { _queuedCommands.push(text); return null; }
  return _matchCommand(text);
}

/** Which grammar is active right now. RECORDING always wins over a stale _tab. */
function _activeCommands() {
  const currentState = _callbacks.getRecordingState ? _callbacks.getRecordingState() : null;
  if (currentState === 'recording' || currentState === 'paused') return RECORDING_COMMANDS;
  if (_tab === 'edit')         return EDITING_COMMANDS;
  if (_tab === 'production')   return GRADING_COMMANDS;
  if (_tab === 'distribution') return DISTRIBUTING_COMMANDS;
  return IDLE_COMMANDS;
}

function _matchCommand(text) {
  const lower = text.toLowerCase().trim();
  for (const [phrase, channel] of _activeCommands()) {
    if (!lower.includes(phrase)) continue;

    const currentState = _callbacks.getRecordingState ? _callbacks.getRecordingState() : null;
    // 'pause' and 'resume' both drive the same togglePause() toggle in the
    // main process, so dispatching on either phrase without checking state
    // could do the opposite of what was said: "resume" while actively
    // recording would PAUSE it, and "pause" while already paused would
    // RESUME it. Likewise "start" only makes sense from idle and "stop"
    // only while live — a misheard phrase in the wrong state is now a
    // no-op instead of firing an action nobody asked for. currentState is
    // null when main.js didn't supply getRecordingState (defensive default:
    // don't block anything we can't actually verify).
    const stateOk =
      channel === 'recorder:pause'  ? currentState === 'recording' :
      channel === 'recorder:resume' ? currentState === 'paused' :
      channel === 'recorder:go'     ? (currentState == null || currentState === 'idle') :
      channel === 'recorder:stop'   ? (currentState == null || currentState !== 'idle') :
      // dropMarker() itself already rejects a marker outside recording/paused
      // (see main.js) — gated here too so a misheard "chapter here" during
      // IDLE doesn't even attempt the call, same as every other channel here.
      (channel === 'recorder:markChapter' || channel === 'recorder:markRetake')
        ? (currentState === 'recording' || currentState === 'paused') :
      true; // mute/unmute/EDITING/GRADING/DISTRIBUTING channels have no recording-state dependency — _activeCommands() already scoped them to the right tab

    // Fix #16: cancel the listen timeout before transitioning state
    if (_listenTimer) { clearTimeout(_listenTimer); _listenTimer = null; }
    _state = 'IDLE';
    if (!stateOk) return null;

    const payload = channel === 'recorder:setMic'
      ? { enabled: phrase === 'unmute' }
      : {};
    // Dispatch directly to main-process recording functions so the command
    // actually takes effect, then notify the renderer for UI feedback.
    if (channel === 'recorder:go'     && _callbacks.startRecording) _callbacks.startRecording();
    else if (channel === 'recorder:stop'   && _callbacks.stopRecording)  _callbacks.stopRecording();
    else if ((channel === 'recorder:pause' || channel === 'recorder:resume') && _callbacks.togglePause) _callbacks.togglePause();
    else if (channel === 'recorder:setMic' && _callbacks.setMic) _callbacks.setMic(payload.enabled);
    else if (channel === 'recorder:markChapter' && _callbacks.dropMarker) _callbacks.dropMarker('chapter');
    else if (channel === 'recorder:markRetake'  && _callbacks.dropMarker) _callbacks.dropMarker('retake');
    // EDITING/GRADING/DISTRIBUTING channels act on whatever recording/
    // package is open in that tab — state only the renderer has — so they
    // go out as a SINGLE event instead of a direct callback call plus the
    // usual UI-feedback send below; control.js reuses the exact function
    // its own button for that action calls.
    if (!channel.startsWith('recorder:')) {
      if (_sendControl) _sendControl('voice:editorCommand', { channel });
      return phrase;
    }
    if (_sendControl) _sendControl(channel, payload);
    return phrase;
  }
  return null;
}

function stop() {
  if (_listenTimer) { clearTimeout(_listenTimer); _listenTimer = null; }
  _state = 'IDLE';
  _enabled = false;
  _queuedCommands = [];
  _transcribing = false;
  try { if (_porcupine) { _porcupine.release(); _porcupine = null; } } catch (_) {}
  try { if (_vosk) { _vosk.free(); _vosk = null; } } catch (_) {}
}

module.exports = {
  init, processAudio, stop, getState, isEnabled, setTab, setTranscribing,
  IDLE_COMMANDS, RECORDING_COMMANDS, EDITING_COMMANDS, GRADING_COMMANDS, DISTRIBUTING_COMMANDS,
};
