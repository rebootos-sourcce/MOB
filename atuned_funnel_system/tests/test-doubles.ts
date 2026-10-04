/* ============================================================
   IN-MEMORY FAKES. For testing this scaffold's own orchestration logic
   only. None of these are reference implementations: the real
   PatternCatalogAdapter, SourceAdapter, ReleaseAdapter and
   VerificationAdapter must call the real engine files named in
   adapters.ts, not whatever toy logic lives here.
   ============================================================ */

import type {
  Entitlement,
  EntitlementDecision,
  FunnelEvent,
  FunnelSession,
  PlanId,
  Referral,
  SightLevel,
  StarterGift,
  TutorialProgress,
  UsageLedgerEntry,
  UsageOperation,
  UsageSource,
  VerificationRef,
  VerificationStatus,
} from '../src/domain.js';
import { FunnelError } from '../src/domain.js';
import type {
  Clock,
  EventEmitter,
  FunnelAdapters,
  FunnelRepository,
  IdGenerator,
  IdentityAdapter,
  PatternCatalogAdapter,
  PaymentAdapter,
  ReadingAdapter,
  ReleaseAdapter,
  SourceAdapter,
  SourceAnalysisResult,
  VerificationAdapter,
  EntitlementAdapter,
} from '../src/adapters.js';
import { STARTER_GIFT_SIZE } from '../src/funnelConfig.js';

export class FakeClock implements Clock {
  private t = Date.parse('2026-10-04T00:00:00.000Z');
  nowIso(): string {
    this.t += 1000;
    return new Date(this.t).toISOString();
  }
}

export class FakeIdGenerator implements IdGenerator {
  private n = 0;
  next(): string {
    this.n += 1;
    return `id_${this.n}`;
  }
}

export class InMemoryFunnelRepository implements FunnelRepository {
  sessions = new Map<string, FunnelSession>();
  gifts = new Map<string, StarterGift>();
  tutorials = new Map<string, TutorialProgress>();
  referrals = new Map<string, Referral>();
  referralsByToken = new Map<string, string>();
  events: FunnelEvent[] = [];
  idempotencyKeys = new Set<string>();
  usageBalances = new Map<string, number>();

  async getSession(id: string): Promise<FunnelSession | null> {
    return this.sessions.get(id) ?? null;
  }

  async saveSession(session: FunnelSession): Promise<void> {
    const existing = this.sessions.get(session.id);
    if (existing && existing.version >= session.version) {
      throw new FunnelError('STALE_VERSION', `session ${session.id} stale write`);
    }
    this.sessions.set(session.id, session);
  }

  async getGift(id: string): Promise<StarterGift | null> {
    return this.gifts.get(id) ?? null;
  }
  async saveGift(gift: StarterGift): Promise<void> {
    this.gifts.set(gift.id, gift);
  }

  async getTutorial(sessionId: string): Promise<TutorialProgress | null> {
    return this.tutorials.get(sessionId) ?? null;
  }
  async saveTutorial(progress: TutorialProgress): Promise<void> {
    this.tutorials.set(progress.funnelSessionId, progress);
  }

  async saveReferral(referral: Referral): Promise<void> {
    this.referrals.set(referral.id, referral);
    this.referralsByToken.set(referral.token, referral.id);
  }
  async getReferralByToken(token: string): Promise<Referral | null> {
    const id = this.referralsByToken.get(token);
    return id ? this.referrals.get(id) ?? null : null;
  }

  async appendEvent(event: FunnelEvent): Promise<void> {
    this.events.push(event);
  }

  async hasIdempotencyKey(scope: string, key: string): Promise<boolean> {
    return this.idempotencyKeys.has(`${scope}:${key}`);
  }
  async recordIdempotencyKey(scope: string, key: string): Promise<void> {
    this.idempotencyKeys.add(`${scope}:${key}`);
  }

  async appendUsageLedgerEntry(entry: UsageLedgerEntry): Promise<void> {
    this.usageBalances.set(`${entry.userId}:${entry.source}`, entry.balanceAfter);
  }
  async getUsageBalance(userId: string, source: UsageSource): Promise<number> {
    return this.usageBalances.get(`${userId}:${source}`) ?? 1000; // generous default for tests
  }
}

export class FakeIdentityAdapter implements IdentityAdapter {
  async requireUserId(authToken: string): Promise<string> {
    if (!authToken) throw new FunnelError('SESSION_NOT_FOUND', 'no auth token');
    return `user_${authToken}`;
  }
}

export class FakePatternCatalogAdapter implements PatternCatalogAdapter {
  opened = new Set<string>();

  async getStarterPatterns(_selectedGroundId: string): Promise<string[]> {
    return Array.from({ length: STARTER_GIFT_SIZE }, (_, i) => `pattern_${i + 1}`);
  }
  async isAlreadyOpened(userId: string, patternId: string): Promise<boolean> {
    return this.opened.has(`${userId}:${patternId}`);
  }
  markOpened(userId: string, patternId: string): void {
    this.opened.add(`${userId}:${patternId}`);
  }
}

export class FakeSourceAdapter implements SourceAdapter {
  async analyzeStory(): Promise<SourceAnalysisResult> {
    return {
      status: 'inferred',
      candidatePatternId: 'pattern_1',
      evidenceIds: ['ev_1'],
      sourceVersion: 'fake-1',
    };
  }
}

export class FakeReadingAdapter implements ReadingAdapter {
  async createReading(sourceResult: SourceAnalysisResult) {
    return { readingId: 'reading_1', patternCandidateId: sourceResult.candidatePatternId };
  }
}

export class FakeReleaseAdapter implements ReleaseAdapter {
  private n = 0;
  async executeRelease(patternId: string) {
    this.n += 1;
    return { id: `release_${this.n}`, patternId, status: 'completed' as const };
  }
  async rerun(patternId: string) {
    this.n += 1;
    return { id: `rerun_${this.n}`, patternId, status: 'completed' as const };
  }
}

export class FakeVerificationAdapter implements VerificationAdapter {
  private n = 0;
  async verify(input: { releaseId: string; response: VerificationStatus }): Promise<VerificationRef> {
    this.n += 1;
    return { id: `verification_${this.n}`, releaseId: input.releaseId, status: input.response, userReport: null };
  }
}

export class FakeEntitlementAdapter implements EntitlementAdapter {
  async getDecision(_userId: string, operation: UsageOperation): Promise<EntitlementDecision> {
    if (operation === 'RERUN') {
      return { operation, source: 'STARTER_GIFT', amount: 0, allowed: true };
    }
    return { operation, source: 'STARTER_GIFT', amount: 1, allowed: true };
  }
  async getEntitlement(userId: string): Promise<Entitlement | null> {
    return {
      userId,
      planId: 'gift',
      newGroundLimit: STARTER_GIFT_SIZE,
      period: 'once',
      leadCapability: false,
      startedAt: new Date(0).toISOString(),
      expiresAt: null,
    };
  }
  async getSightLevel(): Promise<SightLevel> {
    return 'base';
  }
  async grant(userId: string, planId: PlanId): Promise<Entitlement> {
    return {
      userId,
      planId,
      newGroundLimit: 0,
      period: 'month',
      leadCapability: planId === 'tier4',
      startedAt: new Date().toISOString(),
      expiresAt: null,
    };
  }
}

export class FakePaymentAdapter implements PaymentAdapter {
  private resolved = new Map<string, { userId: string; planId: PlanId }>();
  setWebhookResult(eventId: string, userId: string, planId: PlanId): void {
    this.resolved.set(eventId, { userId, planId });
  }
  async beginCheckout(userId: string, planId: PlanId) {
    return { checkoutUrl: `https://checkout.test/${userId}/${planId}`, checkoutRef: `co_${userId}` };
  }
  async resolveWebhookEvent(eventId: string) {
    return this.resolved.get(eventId) ?? null;
  }
}

export function buildFakeAdapters(): FunnelAdapters & {
  repo: InMemoryFunnelRepository;
  catalog: FakePatternCatalogAdapter;
  payment: FakePaymentAdapter;
} {
  return {
    repo: new InMemoryFunnelRepository(),
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
  };
}
