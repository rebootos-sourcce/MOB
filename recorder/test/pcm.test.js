'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

const { TARGET_RATE, FRAME_SIZE, resampleLinear, floatToInt16, pcmFramer } = require('../src/shared/pcm');

test('resampleLinear: same rate returns an equal-length copy, not the original array', () => {
  const input = new Float32Array([0.1, 0.2, 0.3]);
  const out = resampleLinear(input, TARGET_RATE, TARGET_RATE);
  assert.deepEqual([...out], [...input]);
  assert.notEqual(out, input);
});

test('resampleLinear: downsampling 48000 -> 16000 shrinks the buffer by exactly 3x', () => {
  const input = new Float32Array(4800); // 0.1s at 48kHz
  const out = resampleLinear(input, 48000, TARGET_RATE);
  assert.equal(out.length, 1600); // 0.1s at 16kHz
});

test('resampleLinear: interpolates between neighboring samples, not nearest-only', () => {
  // ratio = 4/3 ~= 1.333; srcIndex for i=1 is 1.333 -> strictly between input[1]=0 and input[2]=10
  const out = resampleLinear(new Float32Array([0, 0, 10, 10]), 4, 3);
  assert.ok(out[1] > 0 && out[1] < 10, 'expected an interpolated value strictly between neighbors');
});

test('floatToInt16: clamps out-of-range samples to the Int16 bounds', () => {
  const out = floatToInt16(new Float32Array([-2, -1, 0, 1, 2]));
  assert.equal(out[0], -32768);
  assert.equal(out[1], -32768);
  assert.equal(out[2], 0);
  assert.equal(out[3], 32767);
  assert.equal(out[4], 32767);
});

test('pcmFramer: a chunk shorter than one frame produces no frames and carries everything forward', () => {
  const input = new Float32Array(100); // well under FRAME_SIZE at 16kHz passthrough
  const { frames, carry } = pcmFramer(input, TARGET_RATE, undefined);
  assert.equal(frames.length, 0);
  assert.equal(carry.length, 100);
});

test('pcmFramer: carry from one call plus the next call completes a frame with no sample loss', () => {
  const first = new Float32Array(FRAME_SIZE - 10).fill(0.5);
  const { frames: f1, carry } = pcmFramer(first, TARGET_RATE, undefined);
  assert.equal(f1.length, 0);
  assert.equal(carry.length, FRAME_SIZE - 10);

  const second = new Float32Array(20).fill(0.25);
  const { frames: f2, carry: carry2 } = pcmFramer(second, TARGET_RATE, carry);
  assert.equal(f2.length, 1);
  assert.equal(f2[0].length, FRAME_SIZE);
  assert.equal(carry2.length, 10); // (FRAME_SIZE - 10) + 20 - FRAME_SIZE = 10 left over
});

test('pcmFramer: a large chunk at a real browser rate (48000) yields the expected number of 16kHz frames', () => {
  // 1 second of audio at 48kHz -> 16000 samples at 16kHz -> floor(16000/512) = 31 full frames, 128 left over
  const oneSecond = new Float32Array(48000);
  const { frames, carry } = pcmFramer(oneSecond, 48000, undefined);
  assert.equal(frames.length, 31);
  assert.equal(carry.length, 128);
  for (const f of frames) assert.equal(f.length, FRAME_SIZE);
});
