import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FunnelService } from '../src/funnelService.js';
import { FunnelError } from '../src/domain.js';
import { STARTER_GIFT_SIZE } from '../src/funnelConfig.js';
import { buildFakeAdapters } from './test-doubles.js';

/** ARRIVE -> RECOGNIZE is a plain presentation beat with no logic of its
 *  own (see advancePresentation in funnelService.ts); every test below
 *  needs it before selectGround, which requires RECOGNIZE per the
 *  canonical transition table. */
async function startAndRecognize(service: FunnelService, anonymousId: string) {
  const session = await service.startSession(anonymousId);
  return service.advancePresentation(session.id, 'RECOGNIZE');
}

test('starter gift: exactly 100 unique patterns, and selecting ground twice does not mint a second gift', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_1');

  const first = await service.selectGround(session.id, 'anxiety');
  assert.equal(first.gift.patternIds.length, STARTER_GIFT_SIZE);
  assert.equal(new Set(first.gift.patternIds).size, STARTER_GIFT_SIZE);
  assert.equal(first.gift.remaining, STARTER_GIFT_SIZE);

  const second = await service.selectGround(first.session.id, 'anxiety');
  assert.equal(second.gift.id, first.gift.id, 'a second selectGround call must reuse the existing gift');
  assert.equal(adapters.repo.gifts.size, 1);
});

test('account attachment transfers the gift exactly once, even called twice', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_2');
  const { gift } = await service.selectGround(session.id, 'burnout');

  const attached1 = await service.attachAccount(session.id, 'token_a');
  const giftAfter1 = await adapters.repo.getGift(gift.id);
  assert.ok(giftAfter1?.transferredAt, 'gift should be transferred after first attach');
  assert.equal(giftAfter1?.userId, attached1.userId);

  const attached2 = await service.attachAccount(attached1.id, 'token_a');
  const giftAfter2 = await adapters.repo.getGift(gift.id);
  assert.equal(giftAfter2?.transferredAt, giftAfter1?.transferredAt, 'a second attach must not re-transfer');
  assert.equal(attached2.userId, attached1.userId);
});

test('attaching a gift already transferred to a different user is refused', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_3');
  await service.selectGround(session.id, 'grief');
  await service.attachAccount(session.id, 'token_b'); // attaches to user_token_b

  await assert.rejects(
    () => service.attachAccount(session.id, 'token_c'),
    (err: unknown) => err instanceof FunnelError && err.code === 'GIFT_ALREADY_TRANSFERRED',
  );
});

test('new ground consumes exactly one unit; a rerun of the same pattern consumes zero', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_4');
  await service.selectGround(session.id, 'fear');

  const r1 = await service.requestRelease(session.id, 'pattern_1', { idempotencyKey: 'k1' });
  assert.equal(r1.consumed, 1, 'first open of pattern_1 is new ground');

  adapters.catalog.markOpened(session.anonymousId, 'pattern_1');
  const r2 = await service.requestRelease(session.id, 'pattern_1', { idempotencyKey: 'k2' });
  assert.equal(r2.consumed, 0, 'rerunning already-opened ground must never consume new ground');
});

test('a release request is rejected if the idempotency key has already been used', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_5');
  await service.selectGround(session.id, 'money');

  await service.requestRelease(session.id, 'pattern_1', { idempotencyKey: 'dupe' });
  await assert.rejects(
    () => service.requestRelease(session.id, 'pattern_1', { idempotencyKey: 'dupe' }),
    (err: unknown) => err instanceof FunnelError && err.code === 'DUPLICATE_IDEMPOTENCY_KEY',
  );
});

test('a rejected reading returns to MIRROR rather than silently advancing', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_6');
  await service.selectGround(session.id, 'purpose');
  await service.recordStory(session.id, 'something happened');
  const mirrored = await service.analyzeAndMirror(session.id, {
    id: 's1',
    userId: 'u1',
    rawText: 'something happened',
    createdAt: new Date().toISOString(),
  });
  assert.equal(mirrored.state, 'MIRROR');
  await service.advancePresentation(session.id, 'CONFIRM_CORRECT'); // the "is that right?" screen

  const rejected = await service.confirmOrCorrect(session.id, 'REJECT');
  assert.equal(rejected.state, 'MIRROR', 'rejecting must not advance the state machine to ADDRESS');

  await service.advancePresentation(session.id, 'CONFIRM_CORRECT'); // shown the mirror a second time
  const confirmed = await service.confirmOrCorrect(rejected.id, 'CONFIRM');
  assert.equal(confirmed.state, 'ADDRESS');
});

test('safety stop is reachable from any state and the session is flagged on every further call', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_7');
  await service.selectGround(session.id, 'relationships');

  const stopped = await service.safetyStop(session.id, 'out of scope');
  assert.equal(stopped.state, 'SAFETY_STOP');

  await assert.rejects(
    () => service.recordStory(session.id, 'anything'),
    (err: unknown) => err instanceof FunnelError && err.code === 'SAFETY_STOP_ACTIVE',
  );
});

test('a referral grant issued twice for the same token does not double the bonus', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const referral = await service.createReferral('inviter_1');
  await service.openReferral(referral.token);

  const g1 = await service.issueReferralGrant(referral.token, 'invitee_1');
  assert.equal(g1.status, 'grant_issued');
  const firstIssuedAt = g1.grantIssuedAt;

  const g2 = await service.issueReferralGrant(referral.token, 'invitee_1');
  assert.equal(g2.grantIssuedAt, firstIssuedAt, 'issuing the grant twice must not move the issue time or re-grant');
});

test('a payment webhook delivered twice grants entitlement exactly once', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  adapters.payment.setWebhookResult('evt_1', 'user_x', 'tier2');

  const first = await service.handlePaymentWebhook('evt_1');
  assert.equal(first.granted, true);
  const second = await service.handlePaymentWebhook('evt_1');
  assert.equal(second.granted, false, 'a repeated webhook delivery must be a no-op');
});
