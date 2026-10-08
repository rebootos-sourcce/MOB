/* ============================================================
   ADAPTER INTERFACES. Every external authority the funnel calls, and
   nothing else. funnelService.ts depends only on these interfaces, never
   on a concrete implementation, so the real wiring is "write a class that
   implements this interface" and nothing in the service layer changes.

   EACH INTERFACE BELOW NAMES THE REAL FILE IT SHOULD CALL. That is the
   point of this split: the funnel TDDs ask for a system that "coordinates
   existing authorities" rather than reimplementing them, and the existing
   authorities are almost all host-free JavaScript in atuned_src/engine/,
   which has no document, window or fetch in it (hostfree.py enforces
   this). That means the real SourceAdapter, ReleaseAdapter and
   VerificationAdapter implementations can, in principle, require() the
   actual engine/*.js files into a Node process and call their real
   functions directly, rather than port the logic into TypeScript a
   second time. Whoever attaches this should treat "import the real
   engine file" as the default plan and "reimplement in TypeScript" as
   the fallback only where the engine function assumes a browser-side
   profile object this service does not have.

   test-doubles.ts (in tests/) provides in-memory fakes for every
   interface here, used by the test suite. They are fakes for testing
   this scaffold's own orchestration logic, not reference implementations
   to ship.
   ============================================================ */

import type {
  Entitlement,
  EntitlementDecision,
  FunnelEvent,
  FunnelEventType,
  FunnelSession,
  PatternRef,
  PlanId,
  ReleaseRef,
  StarterGift,
  StoryRef,
  TutorialProgress,
  UsageOperation,
  VerificationRef,
  VerificationStatus,
} from './domain.js';

// ---------- persistence ----------

/** Wire to Supabase/Postgres, or to whatever store the existing
 *  reboot-os Worker already uses, for: funnel_sessions, starter_gifts,
 *  funnel_events, tutorial_progress, usage_ledger, referrals. See
 *  sql/0001_funnel.sql for the Postgres-flavoured shape, offered, not
 *  mandated: DECISIONS.md still has "Cloudflare vs Supabase" open. */
export interface FunnelRepository {
  getSession(id: string): Promise<FunnelSession | null>;
  /** Must reject with FunnelError('STALE_VERSION', ...) if `session.version`
   *  does not match the currently stored version (compare-and-swap). */
  saveSession(session: FunnelSession): Promise<void>;

  getGift(id: string): Promise<StarterGift | null>;
  /** Must write `gift` and its full `StarterGiftItem` row set in the same
   *  transaction: `patternIds.length` must always equal the item row count,
   *  per the Database Production Completion TDD v2, section 5.4. */
  saveGift(gift: StarterGift, items: import('./domain.js').StarterGiftItem[]): Promise<void>;

  getTutorial(sessionId: string): Promise<TutorialProgress | null>;
  saveTutorial(progress: TutorialProgress): Promise<void>;

  saveReferral(referral: import('./domain.js').Referral): Promise<void>;
  getReferralByToken(token: string): Promise<import('./domain.js').Referral | null>;

  appendEvent(event: FunnelEvent): Promise<void>;
  /** The next `sequence` value for this session's event stream. Must be
   *  gap free and monotonic per session even under concurrent writers. */
  nextEventSequence(sessionId: string): Promise<number>;

  /** Atomic idempotency claim, replacing the round SE
   *  hasIdempotencyKey/recordIdempotencyKey pair, which read then executed
   *  then wrote with no atomic claim in between: two concurrent callers
   *  with the same key could both pass the check before either recorded
   *  it. Database Production Completion TDD v2, sections 5.1 and 13.
   *
   *  Must behave as one atomic operation (a unique constraint on
   *  (scopeKey, idempotencyKey) with an insert-or-return-existing, or
   *  equivalent): the first caller gets `{claimed: true}` and proceeds; a
   *  concurrent or later caller with the SAME key and the SAME
   *  requestHash gets `{claimed: false, existing}` and must return the
   *  existing claim's own eventual result, never re-run the operation. A
   *  caller with the same key and a DIFFERENT requestHash must be
   *  rejected (FunnelError, a hash mismatch), never silently served either
   *  result. */
  claimIdempotencyKey(
    scopeKey: string,
    operation: string,
    idempotencyKey: string,
    requestHash: string,
  ): Promise<{ claimed: true } | { claimed: false; existing: import('./domain.js').IdempotencyClaim }>;
  completeIdempotencyClaim(scopeKey: string, idempotencyKey: string, resultReference: string): Promise<void>;

  appendUsageLedgerEntry(entry: import('./domain.js').UsageLedgerEntry): Promise<void>;
  /** Atomically consume one new-ground unit and return the resulting balance.
   *  The production implementation must debit the authoritative source
   *  (starter gift row or usage bank) and append the ledger entry in one
   *  database transaction. Return null when no unit is available. */
  consumeUsage(entry: import('./domain.js').UsageLedgerEntry): Promise<number | null>;
  getUsageBalance(userId: string, source: import('./domain.js').UsageSource): Promise<number>;

  /** The anonymous-session attachment credential (sections 14-15). A
   *  session id by itself is never sufficient proof to attach a funnel
   *  session to a real account; this challenge is. */
  saveAttachmentChallenge(challenge: import('./domain.js').AttachmentChallenge): Promise<void>;
  getAttachmentChallenge(sessionId: string): Promise<import('./domain.js').AttachmentChallenge | null>;
  markAttachmentChallengeUsed(id: string): Promise<void>;
}

// ---------- identity ----------

/** Wire to the existing reboot-os Worker (atuned_src/ui/auth.js,
 *  AUTH_API). That file is today's only network seam and already
 *  handles sign up, sign in, sign out and the forgotten-password route;
 *  it does not currently expose a server-callable "requireUserId" in the
 *  shape this interface wants, so a thin endpoint on the same Worker is
 *  the real piece of wiring work here, not a new identity system. */
export interface IdentityAdapter {
  /** Must return the server-validated user id, or throw, never trust a
   *  client-supplied id. */
  requireUserId(authToken: string): Promise<string>;
}

// ---------- pattern catalog ----------

/** Wire to whatever the real app already uses to pick a person's starting
 *  112-address reading; the pattern/saboteur tables already live in
 *  atuned_src/engine/data/{canon,kb,cards}.js. This adapter's job is
 *  purely "given a starting ground, name 100 real pattern ids," not to
 *  invent a new catalog. */
export interface PatternCatalogAdapter {
  /** Must return exactly 100 unique, real pattern ids. */
  getStarterPatterns(selectedGroundId: string): Promise<string[]>;
  /** True if `patternId` has ever been opened as new ground by this user,
   *  i.e. whether the next open of it would be a rerun. */
  isAlreadyOpened(userId: string, patternId: string): Promise<boolean>;
}

// ---------- source / reading / release / verification ----------

export interface SourceAnalysisResult {
  /** Mirrors the evidence-state vocabulary both TDDs insist on preserving. */
  status: 'observed' | 'inferred' | 'hypothesized' | 'unknown';
  candidatePatternId: string | null;
  evidenceIds: string[];
  sourceVersion: string;
}

/** Wire to atuned_src/engine/sourceai.js (srcTurn / srcHear / srcRung /
 *  srcDims / srcNext). Do not reimplement question selection or evidence
 *  scoring here: section 15 of the Master TDD and section 34 of the
 *  Implementation TDD both forbid a second interpretation engine, and
 *  round SB of this project's own TASKS.md already found a prior document
 *  re-deriving sourceai.js's existing logic under new names. */
export interface SourceAdapter {
  analyzeStory(story: StoryRef, context: Record<string, unknown>): Promise<SourceAnalysisResult>;
}

/** Wire to whatever creates the Mirror ("you said / I noticed / possible
 *  pattern") presentation from a SourceAnalysisResult; today that is the
 *  onboarding mirror in atuned_src/ui/onboard.js. */
export interface ReadingAdapter {
  createReading(sourceResult: SourceAnalysisResult): Promise<{ readingId: string; patternCandidateId: string | null }>;
}

/** Wire to the authoritative release engine: atuned_src/engine/compute.js
 *  (releaseWork, lawLift) and atuned_src/engine/journey.js. The funnel
 *  must not compute a release lift or a CQ delta itself. */
export interface ReleaseAdapter {
  executeRelease(patternId: string, context: Record<string, unknown>): Promise<ReleaseRef>;
  rerun(patternId: string, context: Record<string, unknown>): Promise<ReleaseRef>;
}

/** Wire to atuned_src/engine/journey.js releaseVerify() and the five
 *  answers already defined in atuned_src/engine/practice.js RV_ANSWERS.
 *  Do not invent a sixth answer, and use the real engine's own five wire
 *  values (VerificationStatus in domain.ts), not the TDDs' own English
 *  paraphrase of them: both agree on the count and the five meanings, not
 *  the spelling, and releaseVerify() refuses anything off its own list
 *  (round SG found this directly: a first draft of this scaffold used the
 *  English words and the real engine rejected every call). */
export interface VerificationAdapter {
  verify(input: {
    releaseId: string;
    response: VerificationStatus;
    beforeReference: string | null;
    afterReference: string | null;
    notes: string | null;
    addressIds?: number[];
  }): Promise<VerificationRef>;
}

// ---------- entitlement ----------

/** Wire to atuned_src/engine/plan.js (SIGHT, PLAN_PRICE) and the usage
 *  ledger this scaffold owns. Answers two questions, not one: how much
 *  new ground (velocity, the TDDs' own framing) AND how much sight depth
 *  (the live, owner-ruled staircase the TDDs' own text argues against;
 *  see the SightLevel comment in domain.ts). Get this one wrong and
 *  either a paying customer sees less than they are owed, or a free
 *  visitor sees a saboteur the owner has twice ruled should stay locked. */
export interface EntitlementAdapter {
  getDecision(userId: string, operation: UsageOperation, patternId: string): Promise<EntitlementDecision>;
  getEntitlement(userId: string): Promise<Entitlement | null>;
  getSightLevel(userId: string): Promise<import('./domain.js').SightLevel>;
  grant(userId: string, planId: PlanId, source: 'referral' | 'payment' | 'gift'): Promise<Entitlement>;
}

// ---------- payment ----------

/** Wire to the real Stripe integration (STRIPE-API-STEPS.md,
 *  STRIPE-SETUP.md at the repo root already describe the account side of
 *  this). Client code must never hold a processor secret; this interface
 *  exists precisely so the funnel service never needs to. */
export interface PaymentAdapter {
  beginCheckout(userId: string, planId: PlanId): Promise<{ checkoutUrl: string; checkoutRef: string }>;
  /** Called from the webhook route, after signature verification has
   *  already happened at the HTTP boundary, never inside this adapter. */
  resolveWebhookEvent(eventId: string): Promise<{ userId: string; planId: PlanId } | null>;
}

// ---------- small infra ----------

export interface Clock {
  nowIso(): string;
}

export interface IdGenerator {
  next(): string;
}

export interface EventEmitter {
  emit(sessionId: string, userId: string | null, type: FunnelEventType, data: Record<string, unknown>): Promise<void>;
}

/** Everything funnelService.ts needs, bundled, so a caller constructs one
 *  object instead of nine positional arguments. */
export interface FunnelAdapters {
  repo: FunnelRepository;
  identity: IdentityAdapter;
  catalog: PatternCatalogAdapter;
  source: SourceAdapter;
  reading: ReadingAdapter;
  release: ReleaseAdapter;
  verification: VerificationAdapter;
  entitlement: EntitlementAdapter;
  payment: PaymentAdapter;
  clock: Clock;
  ids: IdGenerator;
}

// re-exported for callers that only need the shape, not the pattern/reference types
export type { PatternRef };
