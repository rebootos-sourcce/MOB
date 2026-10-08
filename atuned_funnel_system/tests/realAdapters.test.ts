import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RealEntitlementAdapter,
  RealReleaseAdapter,
  RealVerificationAdapter,
  RealSourceAdapter,
  RealIdentityAdapter,
  type ProfileContext,
} from '../src/realAdapters.js';

test('RealEntitlementAdapter reads the real, shipped SIGHT and price tables', () => {
  const adapter = new RealEntitlementAdapter();
  const sight = adapter.readRealSightTable();
  const price = adapter.readRealPriceTable();
  assert.ok(Array.isArray(sight) && sight.length > 0, 'the real SIGHT table must have real rows');
  assert.ok(price && typeof price === 'object', 'the real PLAN_PRICE table must be an object');
});

test('RealEntitlementAdapter never charges a rerun', async () => {
  const adapter = new RealEntitlementAdapter();
  const decision = await adapter.getDecision('user_1', 'RERUN', 'pattern_1');
  assert.equal(decision.amount, 0);
  assert.equal(decision.allowed, true);
});

test('RealReleaseAdapter calls the real releaseWork and returns the updated profile', async () => {
  const adapter = new RealReleaseAdapter();
  const context: ProfileContext = { profile: { law: { Truth: 6 }, charge: {} } };
  const release = await adapter.executeRelease('1:1', context);
  assert.equal(release.status, 'completed');
  assert.ok(release.id.startsWith('release_'));
  assert.ok(context.updatedProfile, 'the real adapter must hand back the updated profile');
  assert.equal(typeof context.updatedProfile!.law.Truth, 'number');
});

test('RealVerificationAdapter calls the real, pure releaseVerify', async () => {
  const adapter = new RealVerificationAdapter();
  const result = await adapter.verify({
    releaseId: 'release_1',
    response: 'something_moved',
    beforeReference: '1',
    afterReference: null,
    notes: 'felt lighter',
    addressIds: [1],
  });
  assert.equal(result.status, 'something_moved');
  assert.equal(result.releaseId, 'release_1');
});

test('RealVerificationAdapter surfaces a real refusal rather than swallowing it', async () => {
  const adapter = new RealVerificationAdapter();
  await assert.rejects(() =>
    // not one of RV_ANSWERS; the real engine itself must refuse this, not a fake
    adapter.verify({
      releaseId: 'release_2',
      response: 'definitely-not-a-real-answer' as never,
      beforeReference: '1',
      afterReference: null,
      notes: null,
      addressIds: [1],
    }),
  );
});

test('RealSourceAdapter calls the real srcTurn and reads an empty story as unread', async () => {
  const adapter = new RealSourceAdapter();
  const result = await adapter.analyzeStory(
    { id: 'story_1', userId: 'user_1', rawText: '', createdAt: new Date().toISOString() },
    {},
  );
  assert.equal(result.status, 'unknown');
});

test('RealIdentityAdapter calls the existing /v1/me identity boundary, with a bearer token', async () => {
  let capturedUrl = '';
  let capturedHeaders: Record<string, string> = {};
  const fakeFetch = (async (url: string, init?: { headers?: Record<string, string> }) => {
    capturedUrl = url;
    capturedHeaders = (init?.headers ?? {}) as Record<string, string>;
    return {
      ok: true,
      status: 200,
      json: async () => ({ userId: 'user_42' }),
    } as Response;
  }) as typeof fetch;

  const adapter = new RealIdentityAdapter('https://atuned-api.lance-o-powell.workers.dev', fakeFetch);
  const userId = await adapter.requireUserId('tok_abc');
  assert.equal(userId, 'user_42');
  assert.equal(capturedUrl, 'https://atuned-api.lance-o-powell.workers.dev/v1/me');
  assert.equal(capturedHeaders.Authorization, 'Bearer tok_abc');
});

test('RealIdentityAdapter refuses an empty token without ever calling the network', async () => {
  let called = false;
  const fakeFetch = (async () => {
    called = true;
    return { ok: true, status: 200, json: async () => ({ userId: 'x' }) } as Response;
  }) as typeof fetch;
  const adapter = new RealIdentityAdapter('https://example.test', fakeFetch);
  await assert.rejects(() => adapter.requireUserId(''));
  assert.equal(called, false);
});
