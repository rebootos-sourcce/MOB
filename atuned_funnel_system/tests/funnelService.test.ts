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

  const { credential } = await service.issueAttachmentChallenge(session.id);
  const attached1 = await service.attachAccount(session.id, 'token_a', credential);
  const giftAfter1 = await adapters.repo.getGift(gift.id);
  assert.ok(giftAfter1?.transferredAt, 'gift should be transferred after first attach');
  assert.equal(giftAfter1?.userId, attached1.userId);

  const attached2 = await service.attachAccount(attached1.id, 'token_a', credential);
  const giftAfter2 = await adapters.repo.getGift(gift.id);
  assert.equal(giftAfter2?.transferredAt, giftAfter1?.transferredAt, 'a second attach must not re-transfer');
  assert.equal(attached2.userId, attached1.userId);
});

test('attaching a gift already transferred to a different user is refused', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_3');
  await service.selectGround(session.id, 'grief');
  const first = await service.issueAttachmentChallenge(session.id);
  await service.attachAccount(session.id, 'token_b', first.credential); // attaches to user_token_b

  // a fresh challenge, so this checks the gift-ownership conflict itself
  // and not the (separately tested) credential-reuse rejection
  const second = await service.issueAttachmentChallenge(session.id);
  await assert.rejects(
    () => service.attachAccount(session.id, 'token_c', second.credential),
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

test('a completed release request replays the exact durable result for the same idempotency key', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const started = await startAndRecognize(service, 'anon_5');
  const { session } = await service.selectGround(started.id, 'money');

  const first = await service.requestRelease(session.id, 'pattern_1', { idempotencyKey: 'dupe' });
  const second = await service.requestRelease(session.id, 'pattern_1', { idempotencyKey: 'dupe' });

  assert.deepEqual(second, first, 'a byte-identical retry must replay the original durable result');
  const gift = await adapters.repo.getGift(session.starterGiftId!);
  assert.equal(gift?.remaining, 99, 'replay must not consume another starter gift unit');
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

// ---------- the Database Production Completion TDD v2's own named corrections ----------

test('the starter gift is backed by one row per pattern, not a bare array', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_8');
  const { gift } = await service.selectGround(session.id, 'money');

  const items = adapters.repo.giftItems.get(gift.id);
  assert.ok(items, 'gift items must exist');
  assert.equal(items!.length, STARTER_GIFT_SIZE);
  assert.equal(new Set(items!.map((i) => i.patternId)).size, STARTER_GIFT_SIZE, 'pattern ids must be unique');
  assert.equal(new Set(items!.map((i) => i.position)).size, STARTER_GIFT_SIZE, 'positions must be unique');
  assert.ok(gift.patternSetHash, 'the frozen set must carry a hash, so a later canon change cannot reinterpret it silently');
});

test('an idempotency key reused with a different request is rejected, not silently replayed', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_9');
  await service.selectGround(session.id, 'fear');

  await service.requestRelease(session.id, 'pattern_1', { idempotencyKey: 'shared-key' });
  await assert.rejects(
    // same key, a different pattern: the request itself differs
    () => service.requestRelease(session.id, 'pattern_2', { idempotencyKey: 'shared-key' }),
    (err: unknown) => err instanceof FunnelError && err.code === 'IDEMPOTENCY_HASH_MISMATCH',
  );
});

test('an attachment credential cannot be replayed once used', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const session = await startAndRecognize(service, 'anon_10');
  await service.selectGround(session.id, 'purpose');
  const { credential } = await service.issueAttachmentChallenge(session.id);

  await service.attachAccount(session.id, 'token_d', credential);

  // a different session reusing the same credential string must not attach
  const other = await startAndRecognize(service, 'anon_11');
  await service.selectGround(other.id, 'purpose');
  await service.issueAttachmentChallenge(other.id); // other has its own challenge
  await assert.rejects(
    () => service.attachAccount(other.id, 'token_e', credential),
    (err: unknown) => err instanceof FunnelError && err.code === 'ATTACHMENT_CREDENTIAL_INVALID',
  );
});

test('two concurrent referral-grant callbacks for the same referral issue the grant exactly once', async () => {
  const adapters = buildFakeAdapters();
  const service = new FunnelService(adapters);
  const referral = await service.createReferral('inviter_2');
  await service.openReferral(referral.token);

  const [a, b] = await Promise.all([
    service.issueReferralGrant(referral.token, 'invitee_2'),
    service.issueReferralGrant(referral.token, 'invitee_2'),
  ]);
  assert.equal(a.grantIssuedAt, b.grantIssuedAt, 'a concurrent race must still land on one grant time');
});
