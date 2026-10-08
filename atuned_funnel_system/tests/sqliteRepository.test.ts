import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SqliteFunnelRepository } from '../src/sqliteRepository.js';
import { FunnelService } from '../src/funnelService.js';
import { FunnelError } from '../src/domain.js';
import { STARTER_GIFT_SIZE } from '../src/funnelConfig.js';
import {
  FakeClock,
  FakeIdGenerator,
  FakeIdentityAdapter,
  FakePatternCatalogAdapter,
  FakeSourceAdapter,
  FakeReadingAdapter,
  FakeReleaseAdapter,
  FakeVerificationAdapter,
  FakeEntitlementAdapter,
  FakePaymentAdapter,
} from './test-doubles.js';

/** A real SQLite file per test, in a throwaway temp directory, not
 *  `:memory:`: the point is to prove the schema and constraints work
 *  against an actual file-backed database, the same engine a real
 *  deployment (Cloudflare D1 is SQLite-compatible) would run. */
function freshRepo(): { repo: SqliteFunnelRepository; cleanup: () => void } {
  const dir = mkdtempSync(join(tmpdir(), 'funnel-sqlite-'));
  const path = join(dir, 'funnel.db');
  const repo = new SqliteFunnelRepository(path);
  return { repo, cleanup: () => { repo.close(); rmSync(dir, { recursive: true, force: true }); } };
}

function serviceOn(repo: SqliteFunnelRepository) {
  return new FunnelService({
    repo,
    identity: new FakeIdentityAdapter(),
    catalog: new FakePatternCatalogAdapter(),
    source: new FakeSourceAdapter(),
    reading: new FakeReadingAdapter(),
    release: new FakeReleaseAdapter(),
    verification: new FakeVerificationAdapter(),
    entitlement: new FakeEntitlementAdapter(),
    payment: new FakePaymentAdapter(),
    clock: new FakeClock(),
    ids: new FakeIdGenerator(),
  });
}

async function startAndRecognize(service: FunnelService, anonymousId: string) {
  const session = await service.startSession(anonymousId);
  return service.advancePresentation(session.id, 'RECOGNIZE');
}

test('a session written to the real database is read back exactly, through a second repository instance', async () => {
  const { repo, cleanup } = freshRepo();
  try {
    const service = serviceOn(repo);
    const session = await startAndRecognize(service, 'anon_sqlite_1');
    const reopened = await repo.getSession(session.id);
    assert.ok(reopened);
    assert.equal(reopened!.state, 'RECOGNIZE');
    assert.equal(reopened!.anonymousId, 'anon_sqlite_1');
  } finally {
    cleanup();
  }
});

test('a stale session write is really rejected by the real database path, not just the in-memory fake', async () => {
  const { repo, cleanup } = freshRepo();
  try {
    const service = serviceOn(repo);
    const session = await startAndRecognize(service, 'anon_sqlite_2');
    // write the same version twice: the second must be refused
    await assert.rejects(
      () => repo.saveSession({ ...session, version: session.version }),
      (err: unknown) => err instanceof FunnelError && err.code === 'STALE_VERSION',
    );
  } finally {
    cleanup();
  }
});

test('the starter gift and its 100 item rows round-trip through the real database', async () => {
  const { repo, cleanup } = freshRepo();
  try {
    const service = serviceOn(repo);
    const session = await startAndRecognize(service, 'anon_sqlite_3');
    const { gift } = await service.selectGround(session.id, 'anxiety');
    const reread = await repo.getGift(gift.id);
    assert.ok(reread);
    assert.equal(reread!.patternIds.length, STARTER_GIFT_SIZE);
    assert.equal(new Set(reread!.patternIds).size, STARTER_GIFT_SIZE);
    assert.equal(reread!.patternSetHash, gift.patternSetHash);
  } finally {
    cleanup();
  }
});

test('the real unique constraint on starter_gift_items refuses a duplicate pattern in one gift', async () => {
  const { repo, cleanup } = freshRepo();
  try {
    const now = new Date().toISOString();
    const gift = {
      id: 'gift_dup',
      funnelSessionId: 'session_x',
      userId: null,
      source: 'funnel' as const,
      selectedGroundId: 'anxiety',
      patternIds: ['p1', 'p1'],
      granted: 100 as const,
      remaining: 100,
      patternSetHash: 'hash',
      issuedAt: now,
      transferredAt: null,
      status: 'active' as const,
    };
    await assert.rejects(() =>
      repo.saveGift(gift, [
        { giftId: gift.id, patternId: 'p1', position: 0, createdAt: now },
        { giftId: gift.id, patternId: 'p1', position: 1, createdAt: now }, // same pattern twice
      ]),
    );
  } finally {
    cleanup();
  }
});

test('REAL CONCURRENCY: two racing idempotency claims for the same key, against the real database, only one wins', async () => {
  const { repo, cleanup } = freshRepo();
  try {
    const results = await Promise.all([
      repo.claimIdempotencyKey('user:race', 'release', 'same-key', 'hash-a'),
      repo.claimIdempotencyKey('user:race', 'release', 'same-key', 'hash-a'),
    ]);
    const claimedCount = results.filter((r) => r.claimed).length;
    assert.equal(claimedCount, 1, 'exactly one of two concurrent racing claims must win, against the real unique constraint');
  } finally {
    cleanup();
  }
});

test('REAL CONCURRENCY: a reused idempotency key with a different request hash is refused by the real database path', async () => {
  const { repo, cleanup } = freshRepo();
  try {
    const first = await repo.claimIdempotencyKey('user:x', 'release', 'k1', 'hash-a');
    assert.equal(first.claimed, true);
    await assert.rejects(
      () => repo.claimIdempotencyKey('user:x', 'release', 'k1', 'hash-b'),
      (err: unknown) => err instanceof FunnelError && err.code === 'IDEMPOTENCY_HASH_MISMATCH',
    );
  } finally {
    cleanup();
  }
});



test('the full funnel invariant suite passes against the real database, not only the in-memory fake', async () => {
  const { repo, cleanup } = freshRepo();
  try {
    const service = serviceOn(repo);
    const session = await startAndRecognize(service, 'anon_sqlite_full');
    await service.selectGround(session.id, 'fear');

    const r1 = await service.requestRelease(session.id, 'pattern_1', { idempotencyKey: 'sqlite-k1' });
    assert.equal(r1.consumed, 1);

    const r2 = await service.requestRelease(session.id, 'pattern_1', { idempotencyKey: 'sqlite-k1' });
    assert.deepEqual(r2, r1, 'the real repository must replay the completed durable result');

    const { credential } = await service.issueAttachmentChallenge(session.id);
    const attached = await service.attachAccount(session.id, 'real_token', credential);
    assert.ok(attached.userId);

    const referral = await service.createReferral(attached.userId!);
    await service.openReferral(referral.token);
    const [a, b] = await Promise.all([
      service.issueReferralGrant(referral.token, 'invitee_sqlite'),
      service.issueReferralGrant(referral.token, 'invitee_sqlite'),
    ]);
    assert.equal(a.grantIssuedAt, b.grantIssuedAt, 'the real database must still land a concurrent referral race on one grant');
  } finally {
    cleanup();
  }
});
