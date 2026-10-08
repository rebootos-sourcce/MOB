-- ============================================================
-- SQLITE SCHEMA. The same nine tables as sql/0001_funnel.sql, adapted to
-- SQLite's own dialect, for `SqliteFunnelRepository` (src/sqliteRepository.ts).
--
-- WHY THIS EXISTS ALONGSIDE THE POSTGRES FILE, NOT INSTEAD OF IT. Round SF
-- left one real decision open: Postgres/Supabase, or the existing reboot-os
-- Cloudflare Worker's own store. Round SG needed a real, running database
-- today to turn FunnelRepository from an untested interface into something
-- actually proven, and neither of those two options can be stood up from
-- inside this session (no Supabase account exists here, and the Worker's
-- own source is not part of this checkout). SQLite is real, built into
-- Node 22 (`node:sqlite`), needs no account, no network, no new
-- dependency, and the same SQL shape (minus Postgres-only syntax) runs
-- against it today. `SqliteFunnelRepository` is not a third persistence
-- option to choose between: it is today's actually-running proof that the
-- `FunnelRepository` interface and the constraints the Database Production
-- Completion TDD v2 demanded are real and correct, in whichever of the two
-- real databases is eventually chosen, SQLite is not the destination.
--
-- DIALECT DIFFERENCES FROM sql/0001_funnel.sql, named rather than hidden:
--   - no `create extension`, no `gen_random_uuid()`: ids are generated in
--     application code (IdGenerator), as every adapter here already does
--   - `uuid` -> `text`, `timestamptz` -> `text` (ISO 8601 strings, as
--     Clock.nowIso() already produces), `jsonb` -> `text` (JSON.stringify
--     at the repository boundary)
--   - `check (... in (...))` constraints are supported the same way
--   - no row level security: SQLite has no role/policy system. This file
--     is not itself a statement that RLS is unnecessary; it says plainly
--     that whichever real target is chosen (Postgres via Supabase, or a
--     D1 equivalent) is where that protection actually has to live, exactly
--     as sql/0001_funnel.sql's own RLS section already argues
-- ============================================================

create table if not exists funnel_sessions (
  id              text primary key,
  anonymous_id    text not null,
  user_id         text,
  state           text not null,
  status          text not null default 'active',
  selected_ground_id text,
  starter_gift_id text,
  tutorial_completed integer not null default 0,
  first_release_id text,
  verification_id text,
  version         integer not null default 1,
  created_at      text not null,
  updated_at      text not null,

  check (status in ('active','completed','stopped','abandoned')),
  check (state in (
    'ARRIVE','RECOGNIZE','UNDERSTAND_ENOUGH','SIGNAL_TEST','AHA','BASELINE',
    'READING','STORY','MIRROR','CONFIRM_CORRECT','ADDRESS','RELEASE',
    'REFRAME','VERIFY','RITUAL','COLLECTION','ACCOUNT','PRACTICE','RETURN',
    'SAFETY_STOP'
  ))
);
create index if not exists funnel_sessions_user_id_idx on funnel_sessions (user_id);
create index if not exists funnel_sessions_anonymous_id_idx on funnel_sessions (anonymous_id);

create table if not exists starter_gifts (
  id                  text primary key,
  funnel_session_id   text not null references funnel_sessions(id),
  user_id             text,
  source              text not null default 'funnel',
  selected_ground_id  text not null,
  pattern_set_hash    text not null,
  granted             integer not null default 100,
  remaining           integer not null,
  issued_at           text not null,
  transferred_at      text,
  status              text not null default 'pending',

  check (granted = 100),
  check (remaining >= 0 and remaining <= 100),
  check (status in ('pending','active','depleted','cancelled'))
);
create unique index if not exists starter_gifts_one_per_session_uq on starter_gifts (funnel_session_id);

create table if not exists starter_gift_items (
  gift_id     text not null references starter_gifts(id),
  pattern_id  text not null,
  position    integer not null,
  created_at  text not null,

  check (position >= 0 and position < 100)
);
create unique index if not exists starter_gift_items_pattern_uq on starter_gift_items (gift_id, pattern_id);
create unique index if not exists starter_gift_items_position_uq on starter_gift_items (gift_id, position);

create table if not exists tutorial_progress (
  funnel_session_id       text primary key references funnel_sessions(id),
  user_id                 text,
  started_at              text,
  pattern_selected        integer not null default 0,
  first_release_started   integer not null default 0,
  first_release_completed integer not null default 0,
  verification_completed  integer not null default 0,
  completed_at            text
);

create table if not exists usage_ledger (
  id                text primary key,
  user_id           text,
  funnel_session_id text references funnel_sessions(id),
  source            text not null,
  operation         text not null,
  pattern_id        text not null,
  release_id        text,
  amount            integer not null,
  balance_after     integer not null,
  idempotency_key   text not null,
  created_at        text not null,

  check (user_id is not null or funnel_session_id is not null),
  check (source in ('STARTER_GIFT','FREE_WEEKLY_BANK','REFERRAL_GRANT','PAID_MONTHLY_ALLOWANCE')),
  check (operation in ('OPEN_NEW_GROUND','RERUN')),
  check (operation <> 'RERUN' or amount = 0),
  check (amount >= 0)
);
create unique index if not exists usage_ledger_identity_idempotency_uq
  on usage_ledger (
    coalesce(user_id, '__anonymous__'),
    coalesce(funnel_session_id, '__no_session__'),
    idempotency_key
  );
create index if not exists usage_ledger_funnel_session_id_idx on usage_ledger (funnel_session_id);
create index if not exists usage_ledger_user_id_idx on usage_ledger (user_id);

create table if not exists referrals (
  id                 text primary key,
  inviter_user_id    text not null,
  invitee_user_id    text,
  token              text not null unique,
  status             text not null default 'created',
  grant_amount       integer not null default 25,
  created_at         text not null,
  opened_at          text,
  signed_up_at       text,
  grant_issued_at    text,

  check (status in ('created','opened','signed_up','grant_issued','used','expired','cancelled')),
  check (grant_amount = 25)
);
create index if not exists referrals_inviter_user_id_idx on referrals (inviter_user_id);

create table if not exists funnel_events (
  id            text primary key,
  session_id    text not null references funnel_sessions(id),
  user_id       text,
  type          text not null,
  sequence      integer not null,
  event_version integer not null default 1,
  data          text not null default '{}',
  created_at    text not null
);
create index if not exists funnel_events_session_id_idx on funnel_events (session_id);
create unique index if not exists funnel_events_session_sequence_uq on funnel_events (session_id, sequence);

create table if not exists idempotency_claims (
  scope_key         text not null,
  operation         text not null,
  idempotency_key   text not null,
  request_hash      text not null,
  status            text not null default 'in_progress',
  result_reference  text,
  created_at        text not null,
  completed_at      text,
  claimed_at        text not null,
  lease_expires_at  text,
  claim_token       text not null,

  primary key (scope_key, idempotency_key),
  check (status in ('in_progress','completed'))
);

create table if not exists attachment_challenges (
  id               text primary key,
  session_id       text not null references funnel_sessions(id),
  credential_hash  text not null,
  expires_at       text not null,
  used_at          text,
  created_at       text not null
);
create index if not exists attachment_challenges_session_id_idx on attachment_challenges (session_id);
