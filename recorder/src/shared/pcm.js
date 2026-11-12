// Task #72: downsamples a mono Float32 PCM buffer (whatever sample rate the
// browser's AudioContext actually runs at — commonly 44100 or 48000) into
// fixed-size 16kHz Int16 frames. voice.js's wake-word/speech bindings expect
// exactly FRAME_SIZE samples per call, not an arbitrary chunk size, so a
// caller feeding irregular-sized chunks (e.g. a ScriptProcessorNode's fixed
// buffer size, which rarely divides evenly into 16kHz frames after
// resampling) must carry leftover samples across calls — pcmFramer does
// that explicitly via its returned `carry`, rather than silently dropping
// or padding the remainder.
//
// Loaded two ways, like shapes.js/material.js: a plain <script> tag in the
// control-panel renderer (no bundler, no Node `require` under
// contextIsolation) defines window.Pcm, while node --test loads it as a
// CommonJS module.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Pcm = factory();
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

const TARGET_RATE = 16000;
const FRAME_SIZE = 512; // matches voice.js's documented processAudio() contract

/**
 * Linear-interpolation resample. Good enough for speech-command recognition
 * (Vosk/Porcupine expect 16kHz mono speech, not hi-fi audio) without pulling
 * in a resampling library for a browser-rate -> 16kHz conversion.
 */
function resampleLinear(float32, inputRate, targetRate) {
  if (inputRate === targetRate) return Float32Array.from(float32);
  const ratio = inputRate / targetRate;
  const outLen = Math.max(0, Math.floor(float32.length / ratio));
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const srcIndex = i * ratio;
    const i0 = Math.floor(srcIndex);
    const i1 = Math.min(i0 + 1, float32.length - 1);
    const frac = srcIndex - i0;
    out[i] = float32[i0] * (1 - frac) + float32[i1] * frac;
  }
  return out;
}

function floatToInt16(float32) {
  const out = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

/**
 * @param {Float32Array} float32      raw mic samples at inputRate
 * @param {number}       inputRate    the AudioContext's actual sampleRate
 * @param {Float32Array} [carrySamples] leftover resampled samples from the
 *                                     previous call (empty/undefined on the
 *                                     first call)
 * @returns {{frames: Int16Array[], carry: Float32Array}}
 */
function pcmFramer(float32, inputRate, carrySamples) {
  const resampled = resampleLinear(float32, inputRate, TARGET_RATE);
  let combined = resampled;
  if (carrySamples && carrySamples.length) {
    combined = new Float32Array(carrySamples.length + resampled.length);
    combined.set(carrySamples, 0);
    combined.set(resampled, carrySamples.length);
  }
  const frames = [];
  let offset = 0;
  while (offset + FRAME_SIZE <= combined.length) {
    frames.push(floatToInt16(combined.subarray(offset, offset + FRAME_SIZE)));
    offset += FRAME_SIZE;
  }
  return { frames, carry: combined.subarray(offset) };
}

return { TARGET_RATE, FRAME_SIZE, resampleLinear, floatToInt16, pcmFramer };
});
