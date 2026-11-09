'use strict';
// S7: Voice command infrastructure.
// Architecture: Porcupine wake word ("Hey MOB") -> Vosk grammar recognizer -> command dispatch.
// Falls back gracefully when native libraries are unavailable (proxy-restricted build env).
//
// States: IDLE -> LISTENING (after wake word) -> TRANSCRIBING (command spoken) -> IDLE
// Commands: "start recording", "stop recording", "pause", "resume", "mute", "unmute"

const COMMANDS = {
  'start recording': 'recorder:go',
  'stop recording':  'recorder:stop',
  'stop':            'recorder:stop',
  'pause':           'recorder:pause',
  'resume':          'recorder:resume',
  'mute':            'recorder:setMic',
  'unmute':          'recorder:setMic',
};

let _state    = 'IDLE';   // IDLE | LISTENING | TRANSCRIBING
let _sendControl = null;
let _porcupine = null;
let _vosk     = null;
let _enabled  = false;

function getState() { return _state; }
function isEnabled() { return _enabled; }

/**
 * Initialize voice commands. Silently no-ops if native libraries aren't available.
 * @param {function} sendControl   main.js sendControl(channel, payload)
 */
async function init(sendControl) {
  _sendControl = sendControl;

  try {
    // Try loading @picovoice/porcupine-node (optional dep — may not be installed)
    const { Porcupine, BuiltinKeyword } = require('@picovoice/porcupine-node');
    _porcupine = new Porcupine(
      process.env.PICOVOICE_API_KEY || '',
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
      setTimeout(() => { if (_state === 'LISTENING') _state = 'IDLE'; }, 5000); // 5s timeout
      return null;
    }
  } catch (_) { return null; }

  if (_state !== 'LISTENING') return null;

  // Try Vosk recognition
  if (_vosk) {
    try {
      _vosk.acceptWaveform(Buffer.from(frame.buffer));
      const partial = JSON.parse(_vosk.partialResult());
      if (partial.partial) return _matchCommand(partial.partial);
    } catch (_) {}
  }

  return null;
}

function _matchCommand(text) {
  const lower = text.toLowerCase().trim();
  for (const [phrase, channel] of Object.entries(COMMANDS)) {
    if (lower.includes(phrase)) {
      _state = 'IDLE';
      const payload = channel === 'recorder:setMic'
        ? { enabled: phrase === 'unmute' }
        : {};
      if (_sendControl) _sendControl(channel, payload);
      return phrase;
    }
  }
  return null;
}

function stop() {
  _state = 'IDLE';
  _enabled = false;
  try { if (_porcupine) { _porcupine.release(); _porcupine = null; } } catch (_) {}
  try { if (_vosk) { _vosk.free(); _vosk = null; } } catch (_) {}
}

module.exports = { init, processAudio, stop, getState, isEnabled, COMMANDS };
