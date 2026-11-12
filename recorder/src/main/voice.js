'use strict';
// S7: Voice command infrastructure.
// Architecture: Porcupine wake word ("Hey MOB") -> Vosk grammar recognizer -> command dispatch.
// Falls back gracefully when native libraries are unavailable (proxy-restricted build env).
//
// States: IDLE -> LISTENING (after wake word) -> TRANSCRIBING (command spoken) -> IDLE
// Commands: "start recording", "stop recording"/"done", "pause", "resume",
// "mute", "unmute", "chapter here", "cut that"/"new take"/"scratch that"

// Fix #26: longer phrases first so "stop recording" and "unmute" match before
// their prefixes ("stop", "mute") — entries are iterated in insertion order.
//
// Task #55: the RECORDING-tier slice of docs/mob-recorder-tdd.html:1764-1796's
// full vocabulary table (mode-scoped IDLE/RECORDING/EDITING/GRADING/
// DISTRIBUTING grammar; this file only implements the IDLE+RECORDING tiers
// so far — see that task's own notes for what EDITING/GRADING/DISTRIBUTING
// still needs and why it isn't here yet). "cut that"/"new take"/
// "scratch that" are the spec's three synonyms for the same retake-boundary
// marker dropMarker() already supports; "chapter here" is its chapter
// counterpart; "done" is the spec's shorter synonym for "stop recording".
const COMMANDS = [
  ['start recording', 'recorder:go'],
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

let _state       = 'IDLE';   // IDLE | LISTENING | TRANSCRIBING
let _sendControl = null;
let _callbacks   = {};  // main-process recording callbacks
let _porcupine   = null;
let _vosk        = null;
let _enabled     = false;
let _listenTimer = null; // Fix #16: track the listen-timeout so we can cancel it

function getState()  { return _state; }
function isEnabled() { return _enabled; }

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
 * @param {object}   callbacks     { startRecording, stopRecording, togglePause, setMic }
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
  // command) or Vosk alone (every utterance is checked against COMMANDS,
  // no wake word — see processAudio()). Porcupine with no Vosk model is NOT
  // enabled: a wake word that can never recognize a command afterward isn't
  // a working feature.
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
  // COMMANDS directly. Trade-off, not a bug — accepted deliberately in
  // init()'s own comment: this is the only mode reachable without a
  // Picovoice account, at the cost of needing to actually say a command
  // phrase rather than idle chatter (ordinary conversation not matching any
  // COMMANDS entry is simply ignored by _matchCommand's lookup, same as
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
      if (final.text) return _matchCommand(final.text);
    }
  } catch (_) { /* ignore — treated as silence/unrecognized */ }
  return null;
}

function _matchCommand(text) {
  const lower = text.toLowerCase().trim();
  for (const [phrase, channel] of COMMANDS) {
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
      true; // mute/unmute have no state dependency

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
    if (_sendControl) _sendControl(channel, payload);
    return phrase;
  }
  return null;
}

function stop() {
  if (_listenTimer) { clearTimeout(_listenTimer); _listenTimer = null; }
  _state = 'IDLE';
  _enabled = false;
  try { if (_porcupine) { _porcupine.release(); _porcupine = null; } } catch (_) {}
  try { if (_vosk) { _vosk.free(); _vosk = null; } } catch (_) {}
}

module.exports = { init, processAudio, stop, getState, isEnabled, COMMANDS };
