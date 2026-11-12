'use strict';
// Task #72: voice.js's init()/processAudio() call require('electron'),
// require('vosk') and require('@picovoice/porcupine-node') — none of which
// are real dependencies of this project (no package.json entry, nothing in
// node_modules), and none of which this sandbox can install or obtain a
// real Picovoice key / Vosk model for. These tests fake all three modules
// via Module._resolveFilename, the same technique used for #38's
// transcription-cancellation tests, to verify the actual state-machine
// logic this task fixed: voice commands reachable with Vosk alone (no
// Picovoice key), Porcupine+Vosk still working exactly as before when a
// key IS present, and Porcupine-with-no-Vosk-model correctly staying
// disabled rather than enabling a wake word that could never recognize a
// command afterward.
const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('module');
const fs = require('fs');

const ORIGINAL_RESOLVE = Module._resolveFilename;
const voiceModulePath = require.resolve('../src/main/voice');

// Mutable per-test fixture the fake vosk Recognizer reads from, so each test
// can script exactly what "Vosk heard" without touching voice.js's real code.
let voskScript = { isFinal: false, text: '' };
let existsSyncResult = true;

function installMocks() {
  const fakes = {
    electron: { app: { getPath: () => '/tmp/mob-voice-test-userdata' } },
    vosk: {
      setLogLevel: () => {},
      Model: class FakeModel { constructor() {} },
      Recognizer: class FakeRecognizer {
        constructor() {}
        acceptWaveform() { return voskScript.isFinal; }
        result() { return JSON.stringify({ text: voskScript.text }); }
        free() {}
      },
    },
    '@picovoice/porcupine-node': {
      BuiltinKeyword: { HEY_GOOGLE: 'HEY_GOOGLE' },
      Porcupine: class FakePorcupine {
        constructor() {}
        // >= 0 simulates a detected wake word; test flips this via closure below.
        process() { return FakePorcupine.nextResult; }
        release() {}
      },
    },
  };
  Module._resolveFilename = function (request, ...rest) {
    if (fakes[request]) {
      const fakePath = '\0fake:' + request;
      if (!Module._cache[fakePath]) {
        Module._cache[fakePath] = { id: fakePath, filename: fakePath, loaded: true, exports: fakes[request] };
      }
      return fakePath;
    }
    return ORIGINAL_RESOLVE.call(this, request, ...rest);
  };
  return fakes;
}

function restoreMocks() {
  Module._resolveFilename = ORIGINAL_RESOLVE;
}

function freshVoice() {
  delete require.cache[voiceModulePath];
  return require('../src/main/voice');
}

test('voice: Vosk-only mode (no PICOVOICE_API_KEY) dispatches commands with no wake word', async (t) => {
  installMocks();
  t.after(restoreMocks);
  delete process.env.PICOVOICE_API_KEY;
  const existsOrig = fs.existsSync;
  fs.existsSync = (p) => (p.includes('vosk-model') ? existsSyncResult : existsOrig(p));
  t.after(() => { fs.existsSync = existsOrig; });

  const voice = freshVoice();
  let stopped = false;
  await voice.init(() => {}, { stopRecording: () => { stopped = true; }, getRecordingState: () => 'recording' });

  assert.equal(voice.isEnabled(), true, 'Vosk alone should be enough to enable voice commands');

  voskScript = { isFinal: true, text: 'please stop recording now' };
  const dispatched = voice.processAudio(new Int16Array(512));
  assert.equal(dispatched, 'stop recording');
  assert.equal(stopped, true, 'the matched command should actually invoke the callback, not just return a string');

  voice.stop();
});

test('voice: Porcupine + Vosk requires the wake word before a command is matched (unchanged behavior)', async (t) => {
  const fakes = installMocks();
  t.after(restoreMocks);
  process.env.PICOVOICE_API_KEY = 'fake-key-for-test';
  t.after(() => { delete process.env.PICOVOICE_API_KEY; });
  const existsOrig = fs.existsSync;
  fs.existsSync = () => true;
  t.after(() => { fs.existsSync = existsOrig; });

  const voice = freshVoice();
  let started = false;
  await voice.init(() => {}, { startRecording: () => { started = true; }, getRecordingState: () => 'idle' });
  assert.equal(voice.isEnabled(), true);

  const FakePorcupine = fakes['@picovoice/porcupine-node'].Porcupine;

  // No wake word yet — a command-shaped utterance should NOT dispatch.
  FakePorcupine.nextResult = -1;
  voskScript = { isFinal: true, text: 'start recording' };
  assert.equal(voice.processAudio(new Int16Array(512)), null, 'a command before the wake word must be ignored');
  assert.equal(started, false);

  // Wake word detected -> enters LISTENING, no command yet.
  FakePorcupine.nextResult = 0;
  assert.equal(voice.processAudio(new Int16Array(512)), null);
  assert.equal(voice.getState(), 'LISTENING');

  // Now the same utterance, in LISTENING, actually dispatches.
  FakePorcupine.nextResult = -1;
  const dispatched = voice.processAudio(new Int16Array(512));
  assert.equal(dispatched, 'start recording');
  assert.equal(started, true);

  voice.stop();
});

test('voice: Porcupine with no Vosk model available stays fully disabled', async (t) => {
  installMocks();
  t.after(restoreMocks);
  process.env.PICOVOICE_API_KEY = 'fake-key-for-test';
  t.after(() => { delete process.env.PICOVOICE_API_KEY; });
  const existsOrig = fs.existsSync;
  fs.existsSync = () => false; // no model on disk
  t.after(() => { fs.existsSync = existsOrig; });

  const voice = freshVoice();
  await voice.init(() => {}, {});
  assert.equal(voice.isEnabled(), false, 'a wake word that can never recognize a command afterward is not a working feature');
  assert.equal(voice.processAudio(new Int16Array(512)), null);

  voice.stop();
});
