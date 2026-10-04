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
-- funnel_sessions, starter_gifts, funnel_events, tutorial_progress,
-- usage_ledger, referrals. It does not create users, stories, patterns,
-- releases, or any table the real engine already owns the shape of
-- elsewhere (see domain.ts's REFERENCE ONLY types for why).
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
  pattern_ids         text[] not null,
  granted             integer not null default 100,
  remaining           integer not null,
  issued_at           timestamptz not null default now(),
  transferred_at      timestamptz null,
  status              text not null default 'pending',

  constraint starter_gifts_granted_chk check (granted = 100),
  constraint starter_gifts_remaining_chk check (remaining >= 0 and remaining <= 100),
  constraint starter_gifts_pattern_count_chk check (array_length(pattern_ids, 1) = 100),
  constraint starter_gifts_status_chk
    check (status in ('pending','active','depleted','cancelled'))
);
create index if not exists starter_gifts_funnel_session_id_idx on starter_gifts (funnel_session_id);
create unique index if not exists starter_gifts_one_per_session_uq on starter_gifts (funnel_session_id);

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

create table if not exists funnel_events (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references funnel_sessions(id),
  user_id     uuid null,
  type        text not null,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists funnel_events_session_id_idx on funnel_events (session_id);
create index if not exists funnel_events_type_idx on funnel_events (type);

-- idempotency ledger backing FunnelRepository.hasIdempotencyKey /
-- recordIdempotencyKey, scoped so the same key can be reused safely
-- across different operation types (e.g. "release" vs "payment_webhook").
create table if not exists funnel_idempotency_keys (
  scope       text not null,
  key         text not null,
  created_at  timestamptz not null default now(),
  primary key (scope, key)
);

-- ============================================================
-- ROW LEVEL SECURITY. Deny by default (Implementation TDD section 24).
-- These are starting policies, not a production security certification;
-- the document's own words: "harden RLS before production" (section
-- 44, step 5). A real attachment pass must audit every policy below
-- against the actual auth claims the chosen backend issues.
-- ============================================================

alter table funnel_sessions enable row level security;
alter table starter_gifts enable row level security;
alter table tutorial_progress enable row level security;
alter table usage_ledger enable row level security;
alter table referrals enable row level security;
alter table funnel_events enable row level security;
alter table funnel_idempotency_keys enable row level security;

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
