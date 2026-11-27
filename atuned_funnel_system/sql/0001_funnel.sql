-- ============================================================
-- FUNNEL SCHEMA, Postgres-flavoured.
--
-- Offered, not mandated. DECISIONS.md still has "Cloudflare vs Supabase"
-- open as the owner's own call. This migration assumes Postgres (as a
-- Supabase project, or any other Postgres host) because that is what
-- both TDDs this scaffold was built from assume throughout. If the
-- decision instead keeps the existing reboot-os Cloudflare Worker and
-- whatever store it already uses (D1, KV, Durable Objects), the shapes
-- below translate directly: every table here is exactly the set
-- FunnelRepository promises in src/adapters.ts, and a D1/KV
-- implementation of that interface needs no change to funnelService.ts.
--
-- This migration owns ONLY the tables the funnel TDDs name as new:
-- funnel_sessions, starter_gifts, starter_gift_items, funnel_events,
-- tutorial_progress, usage_ledger, referrals, idempotency_claims,
-- attachment_challenges. It does not create users, stories, patterns,
-- releases, or any table the real engine already owns the shape of
-- elsewhere (see domain.ts's REFERENCE ONLY types for why).
--
-- THIS FILE HAS NEVER BEEN APPLIED to a real database: it is still a
-- template, offered alongside the rest of this scaffold. The Database
-- Production Completion TDD v2's own rule, "migrations remain append
-- only, never edit an applied migration," starts counting from the
-- first real `wrangler`/`supabase migration up` (or equivalent) against
-- a live environment. Until that first real apply, this file may still
-- be corrected in place, which is what this file's own round SF
-- correction pass did: the original version stored a starter gift's
-- patterns as a bare `pattern_ids text[]` column and a single
-- `funnel_idempotency_keys` table with no atomic claim semantics, both
-- named directly as defects in that TDD's own section 5 (`TASKS.md`
-- round SF has the full citation). Once this file is ever actually run
-- against a real database, every future change belongs in a new,
-- separately numbered file, never an edit here.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists funnel_sessions (
  id              uuid primary key default gen_random_uuid(),
  anonymous_id    text not null,
  user_id         uuid null,
  state           text not null,
  status          text not null default 'active',
  selected_ground_id text null,
  starter_gift_id uuid null,
  tutorial_completed boolean not null default false,
  first_release_id uuid null,
  verification_id uuid null,
  version         integer not null default 1,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint funnel_sessions_status_chk
    check (status in ('active','completed','stopped','abandoned')),
  constraint funnel_sessions_state_chk check (state in (
    'ARRIVE','RECOGNIZE','UNDERSTAND_ENOUGH','SIGNAL_TEST','AHA','BASELINE',
    'READING','STORY','MIRROR','CONFIRM_CORRECT','ADDRESS','RELEASE',
    'REFRAME','VERIFY','RITUAL','COLLECTION','ACCOUNT','PRACTICE','RETURN',
    'SAFETY_STOP'
  ))
);
create index if not exists funnel_sessions_user_id_idx on funnel_sessions (user_id);
create index if not exists funnel_sessions_anonymous_id_idx on funnel_sessions (anonymous_id);

create table if not exists starter_gifts (
  id                  uuid primary key default gen_random_uuid(),
  funnel_session_id   uuid not null references funnel_sessions(id),
  user_id             uuid null,
  source              text not null default 'funnel',
  selected_ground_id  text not null,
  -- The frozen set's own hash, taken at issuance. A future canon change
  -- must never silently reinterpret an already-issued gift; this is what
  -- a reconciliation job compares against to notice if it ever did
  -- (Database Production Completion TDD v2, section 9, "gift issuance").
  pattern_set_hash    text not null,
  granted             integer not null default 100,
  remaining           integer not null,
  issued_at           timestamptz not null default now(),
  transferred_at      timestamptz null,
  status              text not null default 'pending',

  constraint starter_gifts_granted_chk check (granted = 100),
  constraint starter_gifts_remaining_chk check (remaining >= 0 and remaining <= 100),
  constraint starter_gifts_status_chk
    check (status in ('pending','active','depleted','cancelled'))
);
create index if not exists starter_gifts_funnel_session_id_idx on starter_gifts (funnel_session_id);
create unique index if not exists starter_gifts_one_per_session_uq on starter_gifts (funnel_session_id);

-- ONE ROW PER PATTERN, replacing a bare `pattern_ids text[]` column (the
-- Database Production Completion TDD v2's own section 5.4: a JSON/array
-- column "cannot by itself enforce valid pattern references, uniqueness,
-- or referential integrity"). `pattern_id` is left as `text` rather than
-- `uuid` because the real pattern catalog's own keys are text (the
-- engine's Saboteur/address/pattern tables are keyed by name, not a
-- generated uuid); the comment at that section's own words: "use that
-- canonical key type rather than inventing a new one." A real attachment
-- pass should add a foreign key here once the real catalog's table is in
-- the same database; until then `pattern_id` is validated application
-- side by PatternCatalogAdapter at issuance, named here so the gap is
-- visible rather than silently assumed closed.
create table if not exists starter_gift_items (
  gift_id     uuid not null references starter_gifts(id),
  pattern_id  text not null,
  position    integer not null,
  created_at  timestamptz not null default now(),

  constraint starter_gift_items_position_chk check (position >= 0 and position < 100)
);
create unique index if not exists starter_gift_items_pattern_uq on starter_gift_items (gift_id, pattern_id);
create unique index if not exists starter_gift_items_position_uq on starter_gift_items (gift_id, position);
create index if not exists starter_gift_items_gift_id_idx on starter_gift_items (gift_id);

-- Enforced at the row-count level by the application transaction (insert
-- the gift and its 100 item rows together, same transaction, round out
-- with a check against count(*) before commit); Postgres has no bare
-- "exactly 100 child rows" table constraint, so this is named here as a
-- transactional invariant rather than a declarative one, consistent with
-- the TDD's own build-order: expand, backfill, validate, switch.

create table if not exists tutorial_progress (
  funnel_session_id       uuid primary key references funnel_sessions(id),
  user_id                 uuid null,
  started_at              timestamptz null,
  pattern_selected        boolean not null default false,
  first_release_started   boolean not null default false,
  first_release_completed boolean not null default false,
  verification_completed  boolean not null default false,
  completed_at            timestamptz null
);

create table if not exists usage_ledger (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null,
  source            text not null,
  operation         text not null,
  pattern_id        text not null,
  release_id        uuid null,
  amount            integer not null,
  balance_after     integer not null,
  idempotency_key   text not null,
  created_at        timestamptz not null default now(),

  constraint usage_ledger_source_chk
    check (source in ('STARTER_GIFT','FREE_WEEKLY_BANK','REFERRAL_GRANT','PAID_MONTHLY_ALLOWANCE')),
  constraint usage_ledger_operation_chk check (operation in ('OPEN_NEW_GROUND','RERUN')),
  constraint usage_ledger_rerun_amount_chk
    check (operation <> 'RERUN' or amount = 0),
  constraint usage_ledger_amount_nonneg_chk check (amount >= 0)
);
-- same operation + same idempotency key must be the same durable result
create unique index if not exists usage_ledger_idempotency_uq on usage_ledger (user_id, idempotency_key);
create index if not exists usage_ledger_user_id_idx on usage_ledger (user_id);

create table if not exists referrals (
  id                 uuid primary key default gen_random_uuid(),
  inviter_user_id    uuid not null,
  invitee_user_id    uuid null,
  token              text not null unique,
  status             text not null default 'created',
  grant_amount       integer not null default 25,
  created_at         timestamptz not null default now(),
  opened_at          timestamptz null,
  signed_up_at       timestamptz null,
  grant_issued_at    timestamptz null,

  constraint referrals_status_chk check (status in (
    'created','opened','signed_up','grant_issued','used','expired','cancelled'
  )),
  constraint referrals_grant_amount_chk check (grant_amount = 25)
);
create index if not exists referrals_inviter_user_id_idx on referrals (inviter_user_id);
-- NOTE, section 5.5's own correction: a unique `id` on this table (already
-- the primary key) proves a referral ROW is unique. It does not prove the
-- GRANT was only issued once, since two concurrent callbacks could both
-- read status <> 'grant_issued' before either writes. The actual
-- one-time guarantee lives in `idempotency_claims` below, keyed by this
-- referral's own id under the 'referral_grant' operation; `issueReferralGrant`
-- in funnelService.ts claims that row before ever writing `grant_issued_at`.

create table if not exists funnel_events (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references funnel_sessions(id),
  user_id       uuid null,
  type          text not null,
  -- monotonic within one session; required so a reader can reconstruct
  -- exact ordering even when two events share a timestamp (section 8.2)
  sequence      integer not null,
  event_version integer not null default 1,
  data          jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists funnel_events_session_id_idx on funnel_events (session_id);
create index if not exists funnel_events_type_idx on funnel_events (type);
create unique index if not exists funnel_events_session_sequence_uq on funnel_events (session_id, sequence);

-- ATOMIC IDEMPOTENCY CLAIM, replacing the plain funnel_idempotency_keys
-- table this file used to hold. The old shape was a bare (scope, key)
-- primary key with no request hash and no status: a caller could insert
-- the key, then crash before finishing its work, and a retry would see
-- the key already present and silently treat an unfinished operation as
-- done. Section 5.1's own required behavior: "claim atomically, if
-- completed return stored result, if in progress apply controlled replay
-- behavior." The insert below IS the atomic claim: a unique violation on
-- (scope_key, idempotency_key) is how a real adapter implementation
-- tells "someone already claimed this" apart from "this key is new,"
-- inside one statement, not a prior SELECT.
create table if not exists idempotency_claims (
  scope_key         text not null,
  operation         text not null,
  idempotency_key   text not null,
  request_hash      text not null,
  status            text not null default 'in_progress',
  result_reference  text null,
  created_at        timestamptz not null default now(),
  completed_at      timestamptz null,

  primary key (scope_key, idempotency_key),
  constraint idempotency_claims_status_chk check (status in ('in_progress','completed'))
);

-- ANONYMOUS-SESSION ATTACHMENT CREDENTIAL (sections 14-15). A funnel
-- session id is not a secret (it travels in a URL, a cookie, local
-- storage) and must never by itself be treated as proof that the browser
-- presenting it is the one that ran the session. Only the credential's
-- hash is ever stored; the raw credential lives in the browser alone
-- (issueAttachmentChallenge in funnelService.ts never persists it).
create table if not exists attachment_challenges (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid not null references funnel_sessions(id),
  credential_hash  text not null,
  expires_at       timestamptz not null,
  used_at          timestamptz null,
  created_at       timestamptz not null default now()
);
create index if not exists attachment_challenges_session_id_idx on attachment_challenges (session_id);

-- ============================================================
-- ROW LEVEL SECURITY. Deny by default (Implementation TDD section 24).
-- These are starting policies, not a production security certification;
-- the document's own words: "harden RLS before production" (section
-- 44, step 5). A real attachment pass must audit every policy below
-- against the actual auth claims the chosen backend issues.
-- ============================================================

alter table funnel_sessions enable row level security;
alter table starter_gifts enable row level security;
alter table starter_gift_items enable row level security;
alter table tutorial_progress enable row level security;
alter table usage_ledger enable row level security;
alter table referrals enable row level security;
alter table funnel_events enable row level security;
alter table idempotency_claims enable row level security;
alter table attachment_challenges enable row level security;

-- Anonymous sessions are scoped by an unguessable id passed from the
-- client and validated at the service boundary, not by auth.uid(), since
-- no identity exists yet at ARRIVE. Once attached, user_id scoping takes
-- over. Both read policies below are intentionally permissive at the row
-- level and rely on the service boundary never handing out another
-- session's id; tighten this (e.g. a server-only role) before trusting it
-- as the only layer, per the document's own "RLS is defense in depth,"
-- not the only depth.

create policy funnel_sessions_owner_read on funnel_sessions
  for select using (user_id = auth.uid() or user_id is null);

create policy usage_ledger_owner_read on usage_ledger
  for select using (user_id = auth.uid());

create policy referrals_owner_read on referrals
  for select using (inviter_user_id = auth.uid() or invitee_user_id = auth.uid());

-- Writes to every table above go through the service role only (the
-- trusted server boundary both TDDs insist on for entitlement, gift
-- transfer, referral grants and payment-driven changes). No insert/update
-- policy is granted to the anon or authenticated roles here on purpose:
-- "system operations... must not depend on a client asserting ownership"
-- (Implementation TDD section 24). Add narrow, explicit client-write
-- policies only for fields a client is actually meant to set directly
-- (e.g. a session's own state field, via a validated RPC), never a bare
-- table-level insert/update grant.
