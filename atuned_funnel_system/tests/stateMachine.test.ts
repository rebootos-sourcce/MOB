import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canTransition, assertTransition, FUNNEL_STATES, FUNNEL_TRANSITIONS } from '../src/stateMachine.js';
import { FunnelError } from '../src/domain.js';
import type { FunnelState } from '../src/domain.js';

const CANONICAL_PATH: FunnelState[] = [
  'ARRIVE',
  'RECOGNIZE',
  'UNDERSTAND_ENOUGH',
  'SIGNAL_TEST',
  'AHA',
  'BASELINE',
  'READING',
  'STORY',
  'MIRROR',
  'CONFIRM_CORRECT',
  'ADDRESS',
  'RELEASE',
  'REFRAME',
  'VERIFY',
  'RITUAL',
  'COLLECTION',
  'ACCOUNT',
  'PRACTICE',
  'RETURN',
];

test('the canonical first-use path is walkable start to finish', () => {
  for (let i = 0; i < CANONICAL_PATH.length - 1; i++) {
    const from = CANONICAL_PATH[i]!;
    const to = CANONICAL_PATH[i + 1]!;
    const check = canTransition(from, to);
    assert.equal(check.allowed, true, `${from} -> ${to} should be allowed: ${check.reason ?? ''}`);
  }
});

test('every state can reach SAFETY_STOP except SAFETY_STOP itself', () => {
  for (const state of FUNNEL_STATES) {
    if (state === 'SAFETY_STOP') continue;
    assert.equal(canTransition(state, 'SAFETY_STOP').allowed, true, `${state} -> SAFETY_STOP should be allowed`);
  }
});

test('SAFETY_STOP only exits to RECOGNIZE or RETURN, never forward into the journey', () => {
  const row = FUNNEL_TRANSITIONS['SAFETY_STOP'];
  assert.deepEqual([...row].sort(), ['RECOGNIZE', 'RETURN'].sort());
  assert.equal(canTransition('SAFETY_STOP', 'RELEASE').allowed, false);
});

test('an arbitrary forward jump is rejected, not silently allowed', () => {
  // ARRIVE straight to RELEASE: skips the entire recognize/signal/story arc
  const check = canTransition('ARRIVE', 'RELEASE');
  assert.equal(check.allowed, false);
  assert.throws(() => assertTransition('ARRIVE', 'RELEASE'), (err: unknown) => {
    assert.ok(err instanceof FunnelError);
    assert.equal((err as FunnelError).code, 'INVALID_TRANSITION');
    return true;
  });
});

test('a reading can loop MIRROR -> CONFIRM_CORRECT -> MIRROR on a rejection', () => {
  assert.equal(canTransition('MIRROR', 'CONFIRM_CORRECT').allowed, true);
  assert.equal(canTransition('CONFIRM_CORRECT', 'MIRROR').allowed, true);
});

test('RETURN re-enters the loop at STORY or RECOGNIZE, matching the product loop', () => {
  assert.equal(canTransition('RETURN', 'STORY').allowed, true);
  assert.equal(canTransition('RETURN', 'RECOGNIZE').allowed, true);
  assert.equal(canTransition('RETURN', 'ARRIVE').allowed, false);
});

test('transitioning to the same state is rejected (no self-loop as a silent no-op)', () => {
  assert.equal(canTransition('STORY', 'STORY').allowed, false);
});

test('RELEASE can go directly to VERIFY, skipping REFRAME, per the documented branch', () => {
  assert.equal(canTransition('RELEASE', 'VERIFY').allowed, true);
  assert.equal(canTransition('RELEASE', 'REFRAME').allowed, true);
});

test('RITUAL can skip COLLECTION straight to PRACTICE (declining to add the ritual)', () => {
  assert.equal(canTransition('RITUAL', 'PRACTICE').allowed, true);
  assert.equal(canTransition('RITUAL', 'COLLECTION').allowed, true);
});
