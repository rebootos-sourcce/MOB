'use strict';
// S7: Voice command infrastructure.
// Architecture: Porcupine wake word ("Hey MOB") -> Vosk grammar recognizer -> command dispatch.
// Falls back gracefully when native libraries are unavailable (proxy-restricted build env).
//
// States: IDLE -> LISTENING (after wake word) -> TRANSCRIBING (command spoken) -> IDLE
// Commands: "start recording", "stop recording", "pause", "resume", "mute", "unmute"

// Fix #26: longer phrases first so "stop recording" and "unmute" match before
// their prefixes ("stop", "mute") — entries are iterated in insertion order.
const COMMANDS = [
  ['start recording', 'recorder:go'],
  ['stop recording',  'recorder:stop'],
  ['pause',           'recorder:pause'],
  ['resume',          'recorder:resume'],
  ['unmute',          'recorder:setMic'],
  ['mute',            'recorder:setMic'],
  ['stop',            'recorder:stop'],
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
 * @param {function} sendControl   main.js sendControl(channel, payload)
 * @param {object}   callbacks     { startRecording, stopRecording, togglePause, setMic }
 */
async function init(sendControl, callbacks) {
  _sendControl = sendControl;
  _callbacks   = callbacks || {};

  // Fix #15: guard against missing/empty API key before instantiating Porcupine
  if (!process.env.PICOVOICE_API_KEY) {
    console.log('[mob/voice] PICOVOICE_API_KEY not set — voice commands disabled');
    return;
  }

  try {
    const { Porcupine, BuiltinKeyword } = require('@picovoice/porcupine-node');
    _porcupine = new Porcupine(
      process.env.PICOVOICE_API_KEY,
      [BuiltinKeyword.HEY_GOOGLE], // placeholder — replace with custom "Hey MOB" model
      [0.5]
    );
    _enabled = true;
    console.log('[mob/voice] Porcupine loaded');
  } catch (_) {
    console.log('[mob/voice] Porcupine not available — voice commands disabled');
    return;
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
    }
  } catch (_) {
    console.log('[mob/voice] Vosk not available — will use keyword-only recognition');
  }
}

/**
 * Process an audio PCM frame (Int16Array, 512 samples at 16kHz).
 * Returns the dispatched command string, or null.
 */
function processAudio(frame) {
  if (!_enabled || !_porcupine) return null;

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

  if (_vosk) {
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
    } catch (_) {}
  }

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
