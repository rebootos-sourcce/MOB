/* ============================================================
   DOMAIN TYPES. The funnel's own entities, plus the minimal reference
   shapes of entities the funnel touches but does not own.

   Read CLAUDE.md and PLAN.md section S/T in the main repo before wiring
   any of this. Short version: the real product is one static HTML file
   with a host-free engine (atuned_src/engine/*.js) that runs entirely in
   the browser, plus one existing network seam, a Cloudflare Worker
   (atuned-api.lance-o-powell.workers.dev, see atuned_src/ui/auth.js) that
   already handles sign up, sign in and the stored plan field. There is no
   Postgres or Supabase wired in anywhere yet; that is still the owner's
   open call (DECISIONS.md, "Cloudflare vs Supabase"). The two TDDs this
   scaffold was built from assume a Postgres/Supabase backend throughout.
   Nothing here hard-codes that assumption: FunnelRepository is an
   interface, sql/0001_funnel.sql is offered as the Postgres-flavoured
   migration IF that is the path chosen, and every other adapter is written
   so it can call the real existing engine file directly (named in each
   adapter's own comment in adapters.ts) instead of re-implementing it.

   WHAT THIS FILE OWNS. The funnel's own session, starter gift, usage
   ledger and referral records: the things the TDDs call out as new,
   nothing the main product's engine already owns. WHAT IT DOES NOT OWN.
   Pattern, Evidence, Release, Reframe, Verification and the rest already
   have a real shape in the shipped engine (engine/trace.js, engine/
   practice.js, engine/compute.js, engine/journey.js). Reference types for
   those are marked REFERENCE ONLY below: the funnel only needs to know
   enough of their shape to pass IDs around, and the real shape stays
   wherever the real engine already defines it.
   ============================================================ */

// ---------- canonical state machine states (see stateMachine.ts) ----------

export type FunnelState =
  | 'ARRIVE'
  | 'RECOGNIZE'
  | 'UNDERSTAND_ENOUGH'
  | 'SIGNAL_TEST'
  | 'AHA'
  | 'BASELINE'
  | 'READING'
  | 'STORY'
  | 'MIRROR'
  | 'CONFIRM_CORRECT'
  | 'ADDRESS'
  | 'RELEASE'
  | 'REFRAME'
  | 'VERIFY'
  | 'RITUAL'
  | 'COLLECTION'
  | 'ACCOUNT'
  | 'PRACTICE'
  | 'RETURN'
  | 'SAFETY_STOP';

// ---------- the funnel's own entities ----------

export type FunnelSessionStatus = 'active' | 'completed' | 'stopped' | 'abandoned';

export interface FunnelSession {
  id: string;
  anonymousId: string;
  userId: string | null;
  state: FunnelState;
  status: FunnelSessionStatus;
  selectedGroundId: string | null;
  starterGiftId: string | null;
  tutorialCompleted: boolean;
  firstReleaseId: string | null;
  verificationId: string | null;
  /** optimistic concurrency: every persisted mutation increments this. */
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type StarterGiftStatus = 'pending' | 'active' | 'depleted' | 'cancelled';

export interface StarterGift {
  id: string;
  funnelSessionId: string;
  userId: string | null;
  source: 'funnel';
  selectedGroundId: string;
  /** The frozen set, for quick reads and the exactly-100 check. The
   *  durable, referentially sound record is `StarterGiftItem`, one row per
   *  pattern; this array must always equal that row set. Kept here because
   *  the in-memory fakes and the service layer read it directly, not
   *  because a JSON array is the production source of truth (the Database
   *  Production Completion TDD v2, section 5.4, rules a bare array out for
   *  exactly this reason: it cannot enforce uniqueness or a real foreign
   *  key to the pattern catalog on its own). */
  patternIds: string[];
  granted: 100;
  remaining: number;
  /** A hash of the frozen pattern set, taken at issuance. A future canon
   *  change must never silently change an already-issued gift; comparing
   *  this hash is how a reconciliation job notices if it ever did. */
  patternSetHash: string;
  issuedAt: string;
  transferredAt: string | null;
  status: StarterGiftStatus;
}

/** One row per pattern in a starter gift, the production-real form of
 *  `StarterGift.patternIds`. `(giftId, patternId)` and `(giftId, position)`
 *  are both unique (see `sql/0001_funnel.sql`); a gift has exactly 100 of
 *  these rows, checked at issuance and reconcilable later even if the
 *  convenience array on `StarterGift` is ever dropped. */
export interface StarterGiftItem {
  giftId: string;
  patternId: string;
  position: number;
  createdAt: string;
}

export type UsageOperation = 'OPEN_NEW_GROUND' | 'RERUN';

/** Matches the four entitlement sources the TDDs name as distinct. */
export type UsageSource =
  | 'STARTER_GIFT'
  | 'FREE_WEEKLY_BANK'
  | 'REFERRAL_GRANT'
  | 'PAID_MONTHLY_ALLOWANCE';

export interface UsageLedgerEntry {
  id: string;
  userId: string | null;
  funnelSessionId: string | null;
  source: UsageSource;
  operation: UsageOperation;
  patternId: string;
  releaseId: string | null;
  /** 1 for OPEN_NEW_GROUND, always 0 for RERUN. Never negative. */
  amount: number;
  balanceAfter: number;
  idempotencyKey: string;
  createdAt: string;
}

export type ReferralStatus =
  | 'created'
  | 'opened'
  | 'signed_up'
  | 'grant_issued'
  | 'used'
  | 'expired'
  | 'cancelled';

export interface Referral {
  id: string;
  inviterUserId: string;
  inviteeUserId: string | null;
  token: string;
  status: ReferralStatus;
  grantAmount: 25;
  createdAt: string;
  openedAt: string | null;
  signedUpAt: string | null;
  grantIssuedAt: string | null;
}

export interface TutorialProgress {
  funnelSessionId: string;
  userId: string | null;
  startedAt: string | null;
  patternSelected: boolean;
  firstReleaseStarted: boolean;
  firstReleaseCompleted: boolean;
  verificationCompleted: boolean;
  completedAt: string | null;
}

// ---------- tier / entitlement (see funnelConfig.ts for the real numbers) ----------

export type PlanId = 'gift' | 'free' | 'tier1' | 'tier2' | 'tier3' | 'tier4';

export interface Entitlement {
  userId: string;
  planId: PlanId;
  newGroundLimit: number;
  period: 'once' | 'week' | 'month';
  leadCapability: boolean;
  startedAt: string;
  expiresAt: string | null;
}

/** Decision the entitlement adapter returns for ONE requested operation. */
export interface EntitlementDecision {
  operation: UsageOperation;
  source: UsageSource;
  amount: 0 | 1;
  allowed: boolean;
  reason?: string;
}

/* SIGHT DEPTH IS PART OF ENTITLEMENT TOO, deliberately, against the TDDs'
   own section 25 ("reading visibility is not gated by tier") and the
   Master TDD's closing line ("sight is not for sale, new ground is").
   Round OK, 1 October, reversed exactly that principle: free sees the 112
   addresses, domains, archetypes, laws and shadow; tier one adds
   saboteurs; tier two adds complexes and the Kundalini; tier three and
   four add hyper-complexes, character and the point cloud. The owner
   reconfirmed it directly, round SD, 4 October: "don't change the
   structure, don't change the staircase." So SightLevel exists here
   because the real, live rule needs it, not because this document asked
   for it; see PLAN.md section S/T for the full citation. */
export type SightLevel = 'base' | 'saboteurs' | 'complexes' | 'hyperComplexes';

export interface TierDefinition {
  planId: PlanId;
  priceUsd: number;
  newGroundLimit: number;
  period: 'once' | 'week' | 'month';
  sight: SightLevel;
  leadCapability: boolean;
}

// ---------- reference shapes only: the real shape lives in the shipped engine ----------

/** REFERENCE ONLY. Real shape: engine/schema.js, a person's own profile. */
export interface UserRef {
  id: string;
  email?: string;
}

/** REFERENCE ONLY. Real shape: whatever the Story/journal entry already is
 *  in engine/journey.js and the profile's own story list. */
export interface StoryRef {
  id: string;
  userId: string;
  rawText: string;
  createdAt: string;
}

/** REFERENCE ONLY. Real shape: engine/trace.js node of type "pattern" /
 *  "pattern_candidate", or the Saboteur/complex a story maps to. */
export interface PatternRef {
  id: string;
  status: 'candidate' | 'confirmed' | 'rejected' | 'archived';
}

/** REFERENCE ONLY. Real shape: whatever engine/compute.js releaseWork()
 *  and engine/journey.js already return for one release. */
export interface ReleaseRef {
  id: string;
  patternId: string;
  /** Numeric engine address ids worked by the release. */
  addressIds?: number[];
  status: 'started' | 'completed' | 'interrupted' | 'failed';
}

/** The real engine's own five answers, verbatim: `RV_ANSWERS` in
 *  engine/practice.js (verified directly against the real engine.js round
 *  SG; both Funnel TDDs instead paraphrase these in English, "I feel
 *  different" / "Nothing changed" / etc., which is the right user-facing
 *  copy but not this value's own wire shape). Kept exactly as the real
 *  engine spells them so `releaseVerify()` never refuses a real call. */
export type VerificationStatus = 'feel_different' | 'see_differently' | 'something_moved' | 'nothing_changed' | 'not_sure';

export interface VerificationRef {
  id: string;
  releaseId: string;
  status: VerificationStatus;
  userReport: string | null;
}

// ---------- events (append only; see funnelService.ts for emission points) ----------

export type FunnelEventType =
  | 'SESSION_STARTED'
  | 'CONCERN_SELECTED'
  | 'STARTER_GIFT_ISSUED'
  | 'STARTER_GIFT_TRANSFERRED'
  | 'ACCOUNT_ATTACHED'
  | 'TUTORIAL_STARTED'
  | 'TUTORIAL_COMPLETED'
  | 'PATTERN_SELECTED'
  | 'FIRST_PATTERN_OPENED'
  | 'STORY_RECORDED'
  | 'READING_CREATED'
  | 'READING_CONFIRMED'
  | 'READING_REJECTED'
  | 'READING_CORRECTED'
  | 'ADDRESS_SELECTED'
  | 'RELEASE_PLANNED'
  | 'RELEASE_STARTED'
  | 'RELEASE_COMPLETED'
  | 'RELEASE_INTERRUPTED'
  | 'REFRAME_CREATED'
  | 'VERIFICATION_RECORDED'
  | 'RERUN_STARTED'
  | 'RERUN_COMPLETED'
  | 'GIFT_DEPLETED'
  | 'FREE_BANK_STARTED'
  | 'REFERRAL_CREATED'
  | 'REFERRAL_OPENED'
  | 'REFERRAL_SIGNUP'
  | 'REFERRAL_GRANT_ISSUED'
  | 'REFERRAL_GRANT_USED'
  | 'PAYWALL_SHOWN'
  | 'TIER_SELECTED'
  | 'PAYMENT_STARTED'
  | 'PAYMENT_COMPLETED'
  | 'ENTITLEMENT_GRANTED'
  | 'ENTITLEMENT_CHANGED'
  | 'USAGE_CONSUMED'
  | 'USAGE_RESTORED'
  | 'RETURNED'
  | 'SAFETY_STOPPED';

export interface FunnelEvent {
  id: string;
  sessionId: string;
  userId: string | null;
  type: FunnelEventType;
  /** Monotonic within one session, so a reader can reconstruct the exact
   *  order state changed in even if two events share a timestamp. Required
   *  by the Database Production Completion TDD v2, section 8.2. */
  sequence: number;
  /** The event payload's own shape version, independent of `schema_version`
   *  elsewhere; lets a future change to what one event type carries without
   *  reinterpreting an already-written historical event. */
  eventVersion: number;
  data: Record<string, unknown>;
  createdAt: string;
}

/** An atomic idempotency claim, replacing the read-then-execute-then-write
 *  pattern `FunnelRepository.hasIdempotencyKey`/`recordIdempotencyKey`
 *  described in round SE: two concurrent callers with the same key must not
 *  both pass the check before either has recorded it. `claimIdempotencyKey`
 *  in adapters.ts is the atomic replacement; this is its row shape (Database
 *  Production Completion TDD v2, sections 5.1 and 13). */
export type IdempotencyStatus = 'in_progress' | 'completed';

export interface IdempotencyClaim {
  scopeKey: string;
  operation: string;
  idempotencyKey: string;
  claimToken: string;
  /** A hash of the request's own meaningful fields. The same key with a
   *  different hash must be rejected, not silently replayed with new
   *  inputs. */
  requestHash: string;
  status: IdempotencyStatus;
  resultReference: string | null;
  createdAt: string;
  completedAt: string | null;
}

/** The anonymous-session security handshake (Database Production Completion
 *  TDD v2, sections 14-15): a session id alone must never be treated as
 *  proof of ownership when attaching it to a real account. This is the
 *  credential that proves the browser calling attachAccount is the same one
 *  that ran the funnel session, independent of whatever the real identity
 *  system (the existing reboot-os Worker) uses to prove who the account is. */
export interface AttachmentChallenge {
  id: string;
  sessionId: string;
  /** Never the raw credential. The credential itself lives only in the
   *  browser; this is what the server checks it against. */
  credentialHash: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
}

// ---------- small result/error types used across the service layer ----------

export class FunnelError extends Error {
  constructor(
    public code:
      | 'INVALID_TRANSITION'
      | 'SESSION_NOT_FOUND'
      | 'GIFT_ALREADY_TRANSFERRED'
      | 'GIFT_NOT_FOUND'
      | 'STALE_VERSION'
      | 'ENTITLEMENT_DENIED'
      | 'DUPLICATE_IDEMPOTENCY_KEY'
      | 'SAFETY_STOP_ACTIVE'
      | 'ATTACHMENT_CREDENTIAL_INVALID'
      | 'IDEMPOTENCY_HASH_MISMATCH',
    message: string,
  ) {
    super(message);
    this.name = 'FunnelError';
  }
}
