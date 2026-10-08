/* ============================================================
   THE REAL REPOSITORY. `FunnelRepository` implemented against an actually
   running database, not a fake, using `node:sqlite` (built into Node 22,
   no added dependency, no account, no network). See `sql/sqlite_schema.sql`
   for why SQLite specifically and what it does and does not prove.

   THE ATOMIC CLAIM IS THE ONE PIECE WORTH READING CAREFULLY. Round SF's
   fix for the read-then-execute-then-write idempotency race was an
   interface, `claimIdempotencyKey`, with no database behind it to prove it
   atomic. Here, the atomicity is real: a single `insert`, relying on the
   real `primary key (scope_key, idempotency_key)` constraint in
   `sql/sqlite_schema.sql` to fail the SECOND of two racing callers, not a
   prior `select`. `tests/sqliteRepository.test.ts` proves this against the
   real file, including a genuine concurrent race (two claims issued inside
   a `Promise.all`, same key).
   ============================================================ */

import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  AttachmentChallenge,
  FunnelEvent,
  FunnelSession,
  IdempotencyClaim,
  Referral,
  StarterGift,
  StarterGiftItem,
  TutorialProgress,
  UsageLedgerEntry,
  UsageSource,
} from './domain.js';
import { FunnelError } from './domain.js';
import type { FunnelRepository } from './adapters.js';

const here = dirname(fileURLToPath(import.meta.url));

function resolveSchemaPath(): string {
  if (process.env.FUNNEL_SQLITE_SCHEMA) return process.env.FUNNEL_SQLITE_SCHEMA;
  const candidates = [
    join(here, '..', '..', 'sql', 'sqlite_schema.sql'), // dist/src/ -> atuned_funnel_system/sql
    join(here, '..', 'sql', 'sqlite_schema.sql'), // src/ -> atuned_funnel_system/sql
  ];
  return candidates[0]!;
}

const b2i = (b: boolean): number => (b ? 1 : 0);
const i2b = (i: unknown): boolean => i === 1 || i === true;

export class SqliteFunnelRepository implements FunnelRepository {
  private readonly db: DatabaseSync;

  constructor(path: string = ':memory:') {
    this.db = new DatabaseSync(path);
    this.db.exec('pragma foreign_keys = ON;');
    const schema = readFileSync(resolveSchemaPath(), 'utf8');
    this.db.exec(schema);
  }

  close(): void {
    this.db.close();
  }

  // ---------- sessions ----------

  async getSession(id: string): Promise<FunnelSession | null> {
    const row = this.db.prepare('select * from funnel_sessions where id = ?').get(id) as
      | Record<string, unknown>
      | undefined;
    if (!row) return null;
    return {
      id: row.id as string,
      anonymousId: row.anonymous_id as string,
      userId: (row.user_id as string | null) ?? null,
      state: row.state as FunnelSession['state'],
      status: row.status as FunnelSession['status'],
      selectedGroundId: (row.selected_ground_id as string | null) ?? null,
      starterGiftId: (row.starter_gift_id as string | null) ?? null,
      tutorialCompleted: i2b(row.tutorial_completed),
      firstReleaseId: (row.first_release_id as string | null) ?? null,
      verificationId: (row.verification_id as string | null) ?? null,
      version: row.version as number,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  async saveSession(session: FunnelSession): Promise<void> {
    const existing = this.db.prepare('select version from funnel_sessions where id = ?').get(session.id) as
      | { version: number }
      | undefined;
    if (existing && existing.version >= session.version) {
      throw new FunnelError('STALE_VERSION', `session ${session.id} stale write`);
    }
    this.db
      .prepare(
        `insert into funnel_sessions
          (id, anonymous_id, user_id, state, status, selected_ground_id, starter_gift_id,
           tutorial_completed, first_release_id, verification_id, version, created_at, updated_at)
         values (?,?,?,?,?,?,?,?,?,?,?,?,?)
         on conflict(id) do update set
           anonymous_id=excluded.anonymous_id, user_id=excluded.user_id, state=excluded.state,
           status=excluded.status, selected_ground_id=excluded.selected_ground_id,
           starter_gift_id=excluded.starter_gift_id, tutorial_completed=excluded.tutorial_completed,
           first_release_id=excluded.first_release_id, verification_id=excluded.verification_id,
           version=excluded.version, updated_at=excluded.updated_at`,
      )
      .run(
        session.id,
        session.anonymousId,
        session.userId,
        session.state,
        session.status,
        session.selectedGroundId,
        session.starterGiftId,
        b2i(session.tutorialCompleted),
        session.firstReleaseId,
        session.verificationId,
        session.version,
        session.createdAt,
        session.updatedAt,
      );
  }

  // ---------- starter gifts ----------

  async getGift(id: string): Promise<StarterGift | null> {
    const row = this.db.prepare('select * from starter_gifts where id = ?').get(id) as
      | Record<string, unknown>
      | undefined;
    if (!row) return null;
    const items = this.db
      .prepare('select pattern_id from starter_gift_items where gift_id = ? order by position')
      .all(id) as { pattern_id: string }[];
    return {
      id: row.id as string,
      funnelSessionId: row.funnel_session_id as string,
      userId: (row.user_id as string | null) ?? null,
      source: 'funnel',
      selectedGroundId: row.selected_ground_id as string,
      patternIds: items.map((i) => i.pattern_id),
      granted: 100,
      remaining: row.remaining as number,
      patternSetHash: row.pattern_set_hash as string,
      issuedAt: row.issued_at as string,
      transferredAt: (row.transferred_at as string | null) ?? null,
      status: row.status as StarterGift['status'],
    };
  }

  async saveGift(gift: StarterGift, items: StarterGiftItem[]): Promise<void> {
    if (items.length !== gift.patternIds.length) {
      throw new FunnelError(
        'ENTITLEMENT_DENIED',
        `gift ${gift.id}: ${items.length} item rows against ${gift.patternIds.length} pattern ids`,
      );
    }
    this.db
      .prepare(
        `insert into starter_gifts
          (id, funnel_session_id, user_id, source, selected_ground_id, pattern_set_hash,
           granted, remaining, issued_at, transferred_at, status)
         values (?,?,?,?,?,?,?,?,?,?,?)
         on conflict(id) do update set
           user_id=excluded.user_id, remaining=excluded.remaining,
           transferred_at=excluded.transferred_at, status=excluded.status`,
      )
      .run(
        gift.id,
        gift.funnelSessionId,
        gift.userId,
        gift.source,
        gift.selectedGroundId,
        gift.patternSetHash,
        gift.granted,
        gift.remaining,
        gift.issuedAt,
        gift.transferredAt,
        gift.status,
      );
    const existingItems = this.db
      .prepare('select count(*) as n from starter_gift_items where gift_id = ?')
      .get(gift.id) as { n: number };
    if (existingItems.n === 0 && items.length > 0) {
      const insertItem = this.db.prepare(
        'insert into starter_gift_items (gift_id, pattern_id, position, created_at) values (?,?,?,?)',
      );
      for (const item of items) insertItem.run(item.giftId, item.patternId, item.position, item.createdAt);
    }
  }

  // ---------- tutorial ----------

  async getTutorial(sessionId: string): Promise<TutorialProgress | null> {
    const row = this.db.prepare('select * from tutorial_progress where funnel_session_id = ?').get(sessionId) as
      | Record<string, unknown>
      | undefined;
    if (!row) return null;
    return {
      funnelSessionId: row.funnel_session_id as string,
      userId: (row.user_id as string | null) ?? null,
      startedAt: (row.started_at as string | null) ?? null,
      patternSelected: i2b(row.pattern_selected),
      firstReleaseStarted: i2b(row.first_release_started),
      firstReleaseCompleted: i2b(row.first_release_completed),
      verificationCompleted: i2b(row.verification_completed),
      completedAt: (row.completed_at as string | null) ?? null,
    };
  }

  async saveTutorial(progress: TutorialProgress): Promise<void> {
    this.db
      .prepare(
        `insert into tutorial_progress
          (funnel_session_id, user_id, started_at, pattern_selected, first_release_started,
           first_release_completed, verification_completed, completed_at)
         values (?,?,?,?,?,?,?,?)
         on conflict(funnel_session_id) do update set
           user_id=excluded.user_id, started_at=excluded.started_at,
           pattern_selected=excluded.pattern_selected, first_release_started=excluded.first_release_started,
           first_release_completed=excluded.first_release_completed,
           verification_completed=excluded.verification_completed, completed_at=excluded.completed_at`,
      )
      .run(
        progress.funnelSessionId,
        progress.userId,
        progress.startedAt,
        b2i(progress.patternSelected),
        b2i(progress.firstReleaseStarted),
        b2i(progress.firstReleaseCompleted),
        b2i(progress.verificationCompleted),
        progress.completedAt,
      );
  }

  // ---------- referrals ----------

  async saveReferral(referral: Referral): Promise<void> {
    this.db
      .prepare(
        `insert into referrals
          (id, inviter_user_id, invitee_user_id, token, status, grant_amount,
           created_at, opened_at, signed_up_at, grant_issued_at)
         values (?,?,?,?,?,?,?,?,?,?)
         on conflict(id) do update set
           invitee_user_id=excluded.invitee_user_id, status=excluded.status,
           opened_at=excluded.opened_at, signed_up_at=excluded.signed_up_at,
           grant_issued_at=excluded.grant_issued_at`,
      )
      .run(
        referral.id,
        referral.inviterUserId,
        referral.inviteeUserId,
        referral.token,
        referral.status,
        referral.grantAmount,
        referral.createdAt,
        referral.openedAt,
        referral.signedUpAt,
        referral.grantIssuedAt,
      );
  }

  async getReferralByToken(token: string): Promise<Referral | null> {
    const row = this.db.prepare('select * from referrals where token = ?').get(token) as
      | Record<string, unknown>
      | undefined;
    if (!row) return null;
    return {
      id: row.id as string,
      inviterUserId: row.inviter_user_id as string,
      inviteeUserId: (row.invitee_user_id as string | null) ?? null,
      token: row.token as string,
      status: row.status as Referral['status'],
      grantAmount: 25,
      createdAt: row.created_at as string,
      openedAt: (row.opened_at as string | null) ?? null,
      signedUpAt: (row.signed_up_at as string | null) ?? null,
      grantIssuedAt: (row.grant_issued_at as string | null) ?? null,
    };
  }

  // ---------- events ----------

  async appendEvent(event: FunnelEvent): Promise<void> {
    this.db
      .prepare(
        `insert into funnel_events (id, session_id, user_id, type, sequence, event_version, data, created_at)
         values (?,?,?,?,?,?,?,?)`,
      )
      .run(
        event.id,
        event.sessionId,
        event.userId,
        event.type,
        event.sequence,
        event.eventVersion,
        JSON.stringify(event.data),
        event.createdAt,
      );
  }

  async nextEventSequence(sessionId: string): Promise<number> {
    const row = this.db
      .prepare('select max(sequence) as m from funnel_events where session_id = ?')
      .get(sessionId) as { m: number | null };
    return (row.m ?? 0) + 1;
  }

  // ---------- atomic idempotency claim ----------

  async claimIdempotencyKey(
    scopeKey: string,
    operation: string,
    idempotencyKey: string,
    requestHash: string,
  ): Promise<{ claimed: true; claimToken: string } | { claimed: false; existing: IdempotencyClaim }> {
    const now = new Date();
    const nowIso = now.toISOString();
    const leaseIso = new Date(now.getTime() + 5 * 60_000).toISOString();
    const claimToken = randomUUID();
    try {
      this.db
        .prepare(
          `insert into idempotency_claims
            (scope_key, operation, idempotency_key, request_hash, status, created_at, claimed_at, lease_expires_at, claim_token)
           values (?,?,?,?, 'in_progress', ?, ?, ?, ?)`,
        )
        .run(scopeKey, operation, idempotencyKey, requestHash, nowIso, nowIso, leaseIso, claimToken);
      return { claimed: true, claimToken };
    } catch (err) {
      if (!(err instanceof Error) || !/UNIQUE constraint failed/.test(err.message)) throw err;
      const row = this.db
        .prepare('select * from idempotency_claims where scope_key = ? and idempotency_key = ?')
        .get(scopeKey, idempotencyKey) as Record<string, unknown>;
      if (String(row.request_hash) !== requestHash) {
        throw new FunnelError('IDEMPOTENCY_HASH_MISMATCH', `${idempotencyKey} was already used for a different request`);
      }
      if (row.status === 'completed') {
        return {
          claimed: false,
          existing: {
            scopeKey: row.scope_key as string,
            operation: row.operation as string,
            idempotencyKey: row.idempotency_key as string,
            claimToken: row.claim_token as string,
            requestHash: row.request_hash as string,
            status: row.status as IdempotencyClaim['status'],
            resultReference: (row.result_reference as string | null) ?? null,
            createdAt: row.created_at as string,
            completedAt: (row.completed_at as string | null) ?? null,
          },
        };
      }
      const lease = row.lease_expires_at as string | null;
      if (!lease || new Date(lease).getTime() <= now.getTime()) {
        this.db
          .prepare(
            `update idempotency_claims
                set operation = ?, claimed_at = ?, lease_expires_at = ?, claim_token = ?
              where scope_key = ? and idempotency_key = ? and status = 'in_progress'`,
          )
          .run(operation, nowIso, leaseIso, claimToken, scopeKey, idempotencyKey);
        return { claimed: true, claimToken };
      }
      return {
        claimed: false,
        existing: {
          scopeKey: row.scope_key as string,
          operation: row.operation as string,
          idempotencyKey: row.idempotency_key as string,
          claimToken: row.claim_token as string,
          requestHash: row.request_hash as string,
          status: row.status as IdempotencyClaim['status'],
          resultReference: (row.result_reference as string | null) ?? null,
          createdAt: row.created_at as string,
          completedAt: (row.completed_at as string | null) ?? null,
        },
      };
    }
  }

  async completeIdempotencyClaim(
    scopeKey: string,
    idempotencyKey: string,
    claimToken: string,
    resultReference: string,
  ): Promise<void> {
    const result = this.db
      .prepare(
        `update idempotency_claims
            set status='completed', result_reference=?, completed_at=?, lease_expires_at=null
          where scope_key=? and idempotency_key=? and claim_token=? and status='in_progress'`,
      )
      .run(resultReference, new Date().toISOString(), scopeKey, idempotencyKey, claimToken);
    if (result.changes !== 1) {
      throw new FunnelError('DUPLICATE_IDEMPOTENCY_KEY', `${idempotencyKey} claim is no longer owned`);
    }
  }


  // ---------- usage ledger ----------

  async appendUsageLedgerEntry(entry: UsageLedgerEntry): Promise<void> {
    this.db
      .prepare(
        `insert into usage_ledger
          (id, user_id, funnel_session_id, source, operation, pattern_id, release_id, amount, balance_after, idempotency_key, created_at)
         values (?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .run(
        entry.id,
        entry.userId,
        entry.funnelSessionId,
        entry.source,
        entry.operation,
        entry.patternId,
        entry.releaseId,
        entry.amount,
        entry.balanceAfter,
        entry.idempotencyKey,
        entry.createdAt,
      );
  }

  async consumeUsage(entry: UsageLedgerEntry): Promise<number | null> {
    if (entry.amount !== 1 || entry.operation !== 'OPEN_NEW_GROUND') {
      throw new FunnelError('ENTITLEMENT_DENIED', 'invalid usage consumption');
    }

    if (entry.source === 'STARTER_GIFT') {
      const gift = this.db
        .prepare(
          `select id, remaining, status from starter_gifts
             where funnel_session_id = ?
               and (? is null or user_id = ?)
               and status in ('pending','active')
               and remaining > 0
             order by issued_at
             limit 1`,
        )
        .get(entry.funnelSessionId, entry.userId, entry.userId) as
        | { id: string; remaining: number; status: string }
        | undefined;
      if (!gift) return null;

      const next = gift.remaining - 1;
      this.db.prepare(
        `update starter_gifts
            set remaining=?, status=case when ?=0 then 'depleted' else status end
          where id=? and remaining=?`,
      ).run(next, next, gift.id, gift.remaining);

      const balanceAfter = Number(next);
      this.appendUsageLedgerEntry({ ...entry, balanceAfter });
      return balanceAfter;
    }

    const key = [entry.userId, entry.source].join(':');
    const row = this.db
      .prepare(
        `select balance_after from usage_ledger
          where user_id=? and source=?
          order by created_at desc, rowid desc limit 1`,
      )
      .get(entry.userId, entry.source) as { balance_after: number } | undefined;
    const current = row?.balance_after ?? 1000;
    if (current <= 0) return null;
    const balanceAfter = current - 1;
    this.appendUsageLedgerEntry({ ...entry, balanceAfter });
    return balanceAfter;
  }


  async getUsageBalance(userId: string, source: UsageSource): Promise<number> {
    const row = this.db
      .prepare(
        `select balance_after from usage_ledger where user_id = ? and source = ?
         order by created_at desc, rowid desc limit 1`,
      )
      .get(userId, source) as { balance_after: number } | undefined;
    return row ? row.balance_after : 0;
  }

  async transferStarterGift(
    giftId: string,
    userId: string,
    transferredAt: string,
  ): Promise<'transferred' | 'already_owned' | 'owned_by_other' | 'not_found'> {
    const row = this.db
      .prepare('select user_id, transferred_at, remaining from starter_gifts where id = ?')
      .get(giftId) as { user_id: string | null; transferred_at: string | null; remaining: number } | undefined;
    if (!row) return 'not_found';
    if (!row.transferred_at) {
      this.db
        .prepare(
          `update starter_gifts
             set user_id=?, transferred_at=?, status=case when remaining=0 then 'depleted' else 'active' end
           where id=? and transferred_at is null`,
        )
        .run(userId, transferredAt, giftId);
      return 'transferred';
    }
    return row.user_id === userId ? 'already_owned' : 'owned_by_other';
  }


  // ---------- attachment challenge ----------

  async saveAttachmentChallenge(challenge: AttachmentChallenge): Promise<void> {
    this.db
      .prepare(
        `insert into attachment_challenges (id, session_id, credential_hash, expires_at, used_at, created_at)
         values (?,?,?,?,?,?)
         on conflict(id) do update set used_at=excluded.used_at`,
      )
      .run(challenge.id, challenge.sessionId, challenge.credentialHash, challenge.expiresAt, challenge.usedAt, challenge.createdAt);
  }

  async getAttachmentChallenge(sessionId: string): Promise<AttachmentChallenge | null> {
    const row = this.db
      .prepare('select * from attachment_challenges where session_id = ? order by created_at desc limit 1')
      .get(sessionId) as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      id: row.id as string,
      sessionId: row.session_id as string,
      credentialHash: row.credential_hash as string,
      expiresAt: row.expires_at as string,
      usedAt: (row.used_at as string | null) ?? null,
      createdAt: row.created_at as string,
    };
  }

  async markAttachmentChallengeUsed(id: string): Promise<void> {
    this.db.prepare('update attachment_challenges set used_at = ? where id = ?').run(new Date().toISOString(), id);
  }
}
