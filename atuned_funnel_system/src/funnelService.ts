/* ============================================================
   THE FUNNEL SERVICE. Orchestration only. Every rule of consequence
   (what a release does, what a confirmed pattern means, how much a tier
   is owed) lives behind an adapter; this file sequences calls to those
   adapters and enforces the state machine, the idempotency rules and the
   accounting invariants the TDDs name as non-negotiable:

     NO DUPLICATE STARTER GIFT
     NO RERUN CHARGE
     NO CLIENT GRANTED ENTITLEMENT
     NO SILENT STATE JUMPS
     NO SILENT EVIDENCE PROMOTION

   This file does not import express/fastify/any HTTP framework: section
   29 of the Master TDD lists the recommended routes
   (POST /funnel/session, POST /funnel/story, ...) but says to use the
   existing application's own router rather than a second framework, so
   the HTTP layer is deliberately left out of this scaffold. Whoever
   attaches this writes thin route handlers that construct the right
   input type and call the matching method below.
   ============================================================ */

import type {
  Entitlement,
  FunnelEvent,
  FunnelSession,
  Referral,
  StarterGift,
  TutorialProgress,
  UsageLedgerEntry,
  VerificationStatus,
} from './domain.js';
import { FunnelError } from './domain.js';
import { assertTransition, canTransition } from './stateMachine.js';
import { REFERRAL_GRANT_AMOUNT, STARTER_GIFT_SIZE } from './funnelConfig.js';
import type { FunnelAdapters } from './adapters.js';

export class FunnelService {
  constructor(private readonly a: FunnelAdapters) {}

  // ---------- session lifecycle ----------

  async startSession(anonymousId: string): Promise<FunnelSession> {
    const now = this.a.clock.nowIso();
    const session: FunnelSession = {
      id: this.a.ids.next(),
      anonymousId,
      userId: null,
      state: 'ARRIVE',
      status: 'active',
      selectedGroundId: null,
      starterGiftId: null,
      tutorialCompleted: false,
      firstReleaseId: null,
      verificationId: null,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    await this.a.repo.saveSession(session);
    await this.emit(session, 'SESSION_STARTED', {});
    return session;
  }

  private async mustGetSession(sessionId: string): Promise<FunnelSession> {
    const session = await this.a.repo.getSession(sessionId);
    if (!session) throw new FunnelError('SESSION_NOT_FOUND', sessionId);
    if (session.state === 'SAFETY_STOP') {
      throw new FunnelError('SAFETY_STOP_ACTIVE', sessionId);
    }
    return session;
  }

  /** Persists a validated transition plus whatever partial fields changed,
   *  bumping version for optimistic concurrency. */
  private async advance(
    session: FunnelSession,
    to: FunnelSession['state'],
    patch: Partial<FunnelSession> = {},
  ): Promise<FunnelSession> {
    assertTransition(session.state, to);
    const next: FunnelSession = {
      ...session,
      ...patch,
      state: to,
      version: session.version + 1,
      updatedAt: this.a.clock.nowIso(),
    };
    await this.a.repo.saveSession(next);
    return next;
  }

  /** The only path into SAFETY_STOP. Never conditioned on conversion
   *  state: no caller in this file may skip this when the existing
   *  safety layer (outside this scaffold) says stop. */
  async safetyStop(sessionId: string, reason: string): Promise<FunnelSession> {
    const session = await this.a.repo.getSession(sessionId);
    if (!session) throw new FunnelError('SESSION_NOT_FOUND', sessionId);
    if (session.state === 'SAFETY_STOP') return session; // idempotent
    const check = canTransition(session.state, 'SAFETY_STOP');
    if (!check.allowed) throw new FunnelError('INVALID_TRANSITION', check.reason ?? 'cannot reach SAFETY_STOP');
    const next = await this.advance(session, 'SAFETY_STOP');
    await this.emit(next, 'SAFETY_STOPPED', { reason });
    return next;
  }

  /** Presentation-only beats: no adapter call, no data of their own, just a
   *  validated move to the next screen (ARRIVE -> RECOGNIZE,
   *  UNDERSTAND_ENOUGH -> SIGNAL_TEST, SIGNAL_TEST -> AHA, AHA -> BASELINE,
   *  BASELINE -> READING, READING -> STORY or MIRROR). Kept as one method
   *  rather than five identical ones; every state-bearing beat
   *  (selectGround, recordStory, requestRelease, ...) still gets its own
   *  named method below because those carry real logic. */
  async advancePresentation(sessionId: string, to: FunnelSession['state']): Promise<FunnelSession> {
    const session = await this.mustGetSession(sessionId);
    return this.advance(session, to);
  }

  // ---------- starting ground + starter gift (Implementation TDD sections 5-7) ----------

  async selectGround(sessionId: string, groundId: string): Promise<{ session: FunnelSession; gift: StarterGift }> {
    const session = await this.mustGetSession(sessionId);
    if (session.starterGiftId) {
      // selecting ground twice must not mint a second gift
      const existing = await this.a.repo.getGift(session.starterGiftId);
      if (existing) return { session, gift: existing };
    }

    const patternIds = await this.a.catalog.getStarterPatterns(groundId);
    if (patternIds.length !== STARTER_GIFT_SIZE || new Set(patternIds).size !== STARTER_GIFT_SIZE) {
      throw new FunnelError(
        'ENTITLEMENT_DENIED',
        `starter catalog returned ${patternIds.length} ids (unique ${new Set(patternIds).size}), expected ${STARTER_GIFT_SIZE} unique`,
      );
    }

    const now = this.a.clock.nowIso();
    const gift: StarterGift = {
      id: this.a.ids.next(),
      funnelSessionId: session.id,
      userId: session.userId,
      source: 'funnel',
      selectedGroundId: groundId,
      patternIds,
      granted: STARTER_GIFT_SIZE,
      remaining: STARTER_GIFT_SIZE,
      issuedAt: now,
      transferredAt: null,
      status: 'active',
    };
    await this.a.repo.saveGift(gift);

    const next = await this.advance(session, 'UNDERSTAND_ENOUGH', {
      selectedGroundId: groundId,
      starterGiftId: gift.id,
    });
    await this.emit(next, 'CONCERN_SELECTED', { groundId });
    await this.emit(next, 'STARTER_GIFT_ISSUED', { giftId: gift.id });
    return { session: next, gift };
  }

  // ---------- account attachment (Implementation TDD section 9, transaction in section 31) ----------

  /** Idempotent: calling this twice for the same session must not grant
   *  the gift twice, and must not throw on the second call once the first
   *  has succeeded. */
  async attachAccount(sessionId: string, authToken: string): Promise<FunnelSession> {
    const session = await this.mustGetSession(sessionId);
    const userId = await this.a.identity.requireUserId(authToken);

    if (session.userId === userId && session.starterGiftId) {
      const gift = await this.a.repo.getGift(session.starterGiftId);
      if (gift?.transferredAt) {
        return session; // already attached and transferred; idempotent no-op
      }
    }

    if (!session.starterGiftId) {
      throw new FunnelError('GIFT_NOT_FOUND', 'no starter gift to transfer for this session');
    }
    const gift = await this.a.repo.getGift(session.starterGiftId);
    if (!gift) throw new FunnelError('GIFT_NOT_FOUND', session.starterGiftId);
    if (gift.transferredAt && gift.userId !== userId) {
      throw new FunnelError('GIFT_ALREADY_TRANSFERRED', `gift ${gift.id} already belongs to another user`);
    }

    const now = this.a.clock.nowIso();

    if (!gift.transferredAt) {
      const transferred: StarterGift = { ...gift, userId, transferredAt: now };
      await this.a.repo.saveGift(transferred);
    }

    let tutorial = await this.a.repo.getTutorial(session.id);
    if (!tutorial) {
      tutorial = {
        funnelSessionId: session.id,
        userId,
        startedAt: null,
        patternSelected: false,
        firstReleaseStarted: false,
        firstReleaseCompleted: false,
        verificationCompleted: false,
        completedAt: null,
      };
    } else {
      tutorial = { ...tutorial, userId };
    }
    await this.a.repo.saveTutorial(tutorial);

    const attached: FunnelSession = { ...session, userId, version: session.version + 1, updatedAt: now };
    await this.a.repo.saveSession(attached);

    await this.emit(attached, 'ACCOUNT_ATTACHED', { userId });
    await this.emit(attached, 'STARTER_GIFT_TRANSFERRED', { giftId: gift.id });
    return attached;
  }

  // ---------- tutorial (Implementation TDD section 10) ----------

  async startTutorial(sessionId: string): Promise<TutorialProgress> {
    const session = await this.mustGetSession(sessionId);
    const existing = await this.a.repo.getTutorial(sessionId);
    const progress: TutorialProgress = existing
      ? { ...existing, startedAt: existing.startedAt ?? this.a.clock.nowIso() }
      : {
          funnelSessionId: sessionId,
          userId: session.userId,
          startedAt: this.a.clock.nowIso(),
          patternSelected: false,
          firstReleaseStarted: false,
          firstReleaseCompleted: false,
          verificationCompleted: false,
          completedAt: null,
        };
    await this.a.repo.saveTutorial(progress);
    await this.emit(session, 'TUTORIAL_STARTED', {});
    return progress;
  }

  async completeTutorial(sessionId: string): Promise<TutorialProgress> {
    const session = await this.mustGetSession(sessionId);
    const existing = await this.a.repo.getTutorial(sessionId);
    if (!existing) throw new FunnelError('SESSION_NOT_FOUND', `no tutorial progress for ${sessionId}`);
    const progress: TutorialProgress = { ...existing, completedAt: this.a.clock.nowIso() };
    await this.a.repo.saveTutorial(progress);
    await this.emit(session, 'TUTORIAL_COMPLETED', {});
    return progress;
  }

  // ---------- story -> source -> mirror -> confirm/correct ----------

  async recordStory(sessionId: string, rawText: string): Promise<FunnelSession> {
    const session = await this.mustGetSession(sessionId);
    const next = await this.advance(session, 'STORY');
    await this.emit(next, 'STORY_RECORDED', { length: rawText.length });
    return next;
  }

  /** The funnel does not interpret. It hands the story to Source and
   *  stores a reference to what comes back. See SourceAdapter's own
   *  comment for which real engine file this must call. */
  async analyzeAndMirror(
    sessionId: string,
    story: { id: string; userId: string; rawText: string; createdAt: string },
  ): Promise<FunnelSession> {
    const session = await this.mustGetSession(sessionId);
    const result = await this.a.source.analyzeStory(story, {});
    const reading = await this.a.reading.createReading(result);
    const next = await this.advance(session, 'MIRROR');
    await this.emit(next, 'READING_CREATED', {
      readingId: reading.readingId,
      status: result.status,
      candidatePatternId: reading.patternCandidateId,
    });
    return next;
  }

  /** Call only once the session is in CONFIRM_CORRECT (reach it with
   *  `advancePresentation(sessionId, 'CONFIRM_CORRECT')` once the mirror
   *  has been shown). `outcome` must come straight from the person:
   *  CONFIRM, CORRECT or REJECT. A rejection returns the session to
   *  MIRROR rather than silently advancing, per the Implementation TDD
   *  section 12: "The funnel must not simply mark a rejected reading as
   *  accepted to advance the user." Showing the mirror again after a
   *  rejection means re-entering CONFIRM_CORRECT before calling this
   *  again, same as the first time. */
  async confirmOrCorrect(
    sessionId: string,
    outcome: 'CONFIRM' | 'CORRECT' | 'REJECT',
    correction?: string,
  ): Promise<FunnelSession> {
    const session = await this.mustGetSession(sessionId);
    if (outcome === 'REJECT') {
      const next = await this.advance(session, 'MIRROR');
      await this.emit(next, 'READING_REJECTED', {});
      return next;
    }
    const next = await this.advance(session, 'ADDRESS');
    await this.emit(
      next,
      outcome === 'CORRECT' ? 'READING_CORRECTED' : 'READING_CONFIRMED',
      correction ? { correction } : {},
    );
    return next;
  }

  async selectAddress(sessionId: string, addressId: string): Promise<FunnelSession> {
    const session = await this.mustGetSession(sessionId);
    const next = await this.advance(session, 'RELEASE');
    await this.emit(next, 'ADDRESS_SELECTED', { addressId });
    return next;
  }

  // ---------- release, with the new-ground/rerun accounting transaction
  //            (Implementation TDD section 32) ----------

  async requestRelease(
    sessionId: string,
    patternId: string,
    opts: { idempotencyKey: string } = { idempotencyKey: `${sessionId}:${patternId}` },
  ): Promise<{ session: FunnelSession; releaseId: string; consumed: 0 | 1 }> {
    const session = await this.mustGetSession(sessionId);
    const userId = session.userId ?? session.anonymousId;

    const dupeScope = 'release';
    if (await this.a.repo.hasIdempotencyKey(dupeScope, opts.idempotencyKey)) {
      throw new FunnelError('DUPLICATE_IDEMPOTENCY_KEY', opts.idempotencyKey);
    }

    const alreadyOpened = await this.a.catalog.isAlreadyOpened(userId, patternId);
    const operation = alreadyOpened ? 'RERUN' : 'OPEN_NEW_GROUND';
    const decision = await this.a.entitlement.getDecision(userId, operation, patternId);
    if (!decision.allowed) {
      throw new FunnelError('ENTITLEMENT_DENIED', decision.reason ?? `${operation} denied for ${userId}`);
    }

    // NO RERUN CHARGE is a system invariant in both TDDs; enforce it here,
    // not only in the adapter, so a misconfigured adapter cannot violate it.
    const amount: 0 | 1 = operation === 'RERUN' ? 0 : decision.amount;

    const release =
      operation === 'RERUN'
        ? await this.a.release.rerun(patternId, {})
        : await this.a.release.executeRelease(patternId, {});

    if (amount === 1) {
      const balanceAfter = (await this.a.repo.getUsageBalance(userId, decision.source)) - 1;
      const entry: UsageLedgerEntry = {
        id: this.a.ids.next(),
        userId,
        source: decision.source,
        operation,
        patternId,
        releaseId: release.id,
        amount,
        balanceAfter,
        idempotencyKey: opts.idempotencyKey,
        createdAt: this.a.clock.nowIso(),
      };
      await this.a.repo.appendUsageLedgerEntry(entry);
    }
    await this.a.repo.recordIdempotencyKey(dupeScope, opts.idempotencyKey);

    /* State transition ownership: selectAddress() already moves the
       session ADDRESS -> RELEASE for the first-use journey. A rerun
       requested later from PRACTICE must NOT walk the onboarding state
       machine backwards into RELEASE; it is a steady-state action, not a
       first-use step. So this method only records the session's own
       firstReleaseId the first time, and otherwise leaves state alone. */
    let next = session;
    if (session.state === 'RELEASE' && !session.firstReleaseId) {
      next = await this.a.repo
        .saveSession({ ...session, firstReleaseId: release.id, version: session.version + 1, updatedAt: this.a.clock.nowIso() })
        .then(() => ({ ...session, firstReleaseId: release.id, version: session.version + 1 }));
    }

    await this.emit(
      next,
      operation === 'RERUN' ? 'RERUN_STARTED' : 'RELEASE_STARTED',
      { patternId, releaseId: release.id },
    );
    await this.emit(
      next,
      operation === 'RERUN' ? 'RERUN_COMPLETED' : 'RELEASE_COMPLETED',
      { patternId, releaseId: release.id },
    );
    if (amount === 1) await this.emit(next, 'USAGE_CONSUMED', { patternId, source: decision.source });

    return { session: next, releaseId: release.id, consumed: amount };
  }

  async recordReframe(sessionId: string): Promise<FunnelSession> {
    const session = await this.mustGetSession(sessionId);
    const next = await this.advance(session, 'VERIFY');
    await this.emit(next, 'REFRAME_CREATED', {});
    return next;
  }

  // ---------- verification (section 16) ----------

  async verify(
    sessionId: string,
    releaseId: string,
    response: VerificationStatus,
    notes: string | null = null,
  ): Promise<FunnelSession> {
    const session = await this.mustGetSession(sessionId);
    const result = await this.a.verification.verify({
      releaseId,
      response,
      beforeReference: null,
      afterReference: null,
      notes,
    });
    const next = await this.advance(session, 'RITUAL', { verificationId: result.id });
    await this.emit(next, 'VERIFICATION_RECORDED', { releaseId, response });
    return next;
  }

  // ---------- referral (section 19) ----------

  async createReferral(inviterUserId: string): Promise<Referral> {
    const referral: Referral = {
      id: this.a.ids.next(),
      inviterUserId,
      inviteeUserId: null,
      token: this.a.ids.next(),
      status: 'created',
      grantAmount: REFERRAL_GRANT_AMOUNT,
      createdAt: this.a.clock.nowIso(),
      openedAt: null,
      signedUpAt: null,
      grantIssuedAt: null,
    };
    await this.a.repo.saveReferral(referral);
    return referral;
  }

  async openReferral(token: string): Promise<Referral> {
    const referral = await this.a.repo.getReferralByToken(token);
    if (!referral) throw new FunnelError('SESSION_NOT_FOUND', `no referral for token ${token}`);
    if (referral.status !== 'created') return referral; // idempotent
    const opened: Referral = { ...referral, status: 'opened', openedAt: this.a.clock.nowIso() };
    await this.a.repo.saveReferral(opened);
    return opened;
  }

  /** Issuing the grant twice for the same referral must not double the
   *  25-pattern bonus. */
  async issueReferralGrant(token: string, inviteeUserId: string): Promise<Referral> {
    const referral = await this.a.repo.getReferralByToken(token);
    if (!referral) throw new FunnelError('SESSION_NOT_FOUND', `no referral for token ${token}`);
    if (referral.status === 'grant_issued' || referral.status === 'used') {
      return referral; // idempotent: grant already issued once
    }
    const now = this.a.clock.nowIso();
    const granted: Referral = {
      ...referral,
      inviteeUserId,
      status: 'grant_issued',
      signedUpAt: referral.signedUpAt ?? now,
      grantIssuedAt: now,
    };
    await this.a.repo.saveReferral(granted);
    return granted;
  }

  // ---------- payment webhook (section 33) ----------

  /** Must be safe to call twice with the same `eventId` (processor
   *  retries webhooks). The second call is a no-op. */
  async handlePaymentWebhook(eventId: string): Promise<{ granted: boolean }> {
    const scope = 'payment_webhook';
    if (await this.a.repo.hasIdempotencyKey(scope, eventId)) {
      return { granted: false };
    }
    const resolved = await this.a.payment.resolveWebhookEvent(eventId);
    if (!resolved) return { granted: false };
    await this.a.entitlement.grant(resolved.userId, resolved.planId, 'payment');
    await this.a.repo.recordIdempotencyKey(scope, eventId);
    return { granted: true };
  }

  // ---------- events ----------

  private async emit(
    session: FunnelSession,
    type: FunnelEvent['type'],
    data: Record<string, unknown>,
  ): Promise<void> {
    const event: FunnelEvent = {
      id: this.a.ids.next(),
      sessionId: session.id,
      userId: session.userId,
      type,
      data,
      createdAt: this.a.clock.nowIso(),
    };
    await this.a.repo.appendEvent(event);
  }
}

export type { Entitlement };
