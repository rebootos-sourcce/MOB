'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

const { recordingKey, clipKey } = require('../src/main/r2/key');

test('recordingKey: uses the rec- prefix and respects format', () => {
  assert.equal(recordingKey('abc-123', 'mp4'), 'rec-abc-123.mp4');
  assert.equal(recordingKey('abc-123', 'webm'), 'rec-abc-123.webm');
});

test('recordingKey: defaults to mp4 only when no format is given', () => {
  assert.equal(recordingKey('abc-123', undefined), 'rec-abc-123.mp4');
  assert.equal(recordingKey('abc-123', ''), 'rec-abc-123.mp4');
});

test('clipKey: uses a distinct clip- prefix from recordingKey (previously two independent key formats existed)', () => {
  const id = 'xyz-789';
  assert.equal(clipKey(id, 'mp4'), 'clip-xyz-789.mp4');
  assert.notEqual(clipKey(id, 'mp4'), recordingKey(id, 'mp4'));
});
