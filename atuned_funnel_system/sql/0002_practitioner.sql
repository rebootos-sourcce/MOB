-- ============================================================
-- MIGRATION 0002: PRACTITIONER GRANTS + LEASE COLUMN FIX
--
-- Append-only. Never edit 0001_funnel.sql once it has been applied.
-- This file adds:
--
--   1. lease_expires_at column to idempotency_claims. The column is
--      required by IdempotencyClaim in domain.ts (section 14.3 of the
--      Master Seam Implementation spec) but was absent from 0001. A
--      5-minute default keeps existing in-progress rows consistent.
--
--   2. practitioner_grants table: one row per explicit consent record.
--      Raw stories, email, and payment are never in scope. See the
--      CLAUDE.md practitioner model and seam/practitioner-access.ts.
--
--   3. practitioner_grant_revocations table: immutable append-only log.
--      A grant is live only when no revocation row references it.
--
--   4. RLS on both new tables: deny by default; reads scoped to the
--      authenticated subject or the authenticated practitioner only.
--      Writes go through the service role, never a client-direct grant.
--
-- THIS FILE HAS NEVER BEEN APPLIED to a real database; it may be
-- corrected in place until the first real `migration up`. After that,
-- further changes belong in 0003 and beyond.
-- ============================================================

-- ----------------------------------------------------------------
-- 1. lease_expires_at on idempotency_claims
--    The sqliteRepository runtime already carries this field; the
--    Postgres schema was missing it. now() + interval mirrors the
--    5-minute lease window in IDEMPOTENCY_LEASE_MS.
-- ----------------------------------------------------------------

alter table idempotency_claims
  add column if not exists lease_expires_at timestamptz
    not null default (now() + interval '5 minutes');

-- ----------------------------------------------------------------
-- 2. practitioner_grants
-- ----------------------------------------------------------------

create table if not exists practitioner_grants (
  id                uuid primary key default gen_random_uuid(),
  practitioner_id   uuid not null,
  subject_user_id   uuid not null,
  -- Array of scope names. Postgres text[] enforces no duplicates at the
  -- SQL level; uniqueness is validated at the application boundary
  -- (practitioner-access.ts) before insert.
  granted_scopes    text[] not null,
  expires_at        timestamptz null,
  -- The verifiable token the subject confirmed when consenting.
  -- Only the hash is stored here; the raw token lives in the subject's
  -- browser (same pattern as attachment_challenges.credential_hash).
  consent_token     text not null,
  granted_at        timestamptz not null default now(),

  constraint practitioner_grants_scopes_nonempty check (array_length(granted_scopes, 1) > 0),
  -- Prevent scopes that are explicitly prohibited by design.
  constraint practitioner_grants_no_raw_stories check (
    not ('raw_stories' = any(granted_scopes))
  ),
  constraint practitioner_grants_no_email check (
    not ('email' = any(granted_scopes))
  ),
  constraint practitioner_grants_no_payment check (
    not ('payment' = any(granted_scopes))
  )
);

create index if not exists practitioner_grants_practitioner_id_idx
  on practitioner_grants (practitioner_id);
create index if not exists practitioner_grants_subject_user_id_idx
  on practitioner_grants (subject_user_id);
-- A practitioner may hold at most one live grant per subject (multiple
-- grants are possible historically after revocation + re-consent, but
-- only one may be un-revoked at a time; that invariant is enforced at
-- the service layer, not here, because the check requires a join to
-- practitioner_grant_revocations).

-- ----------------------------------------------------------------
-- 3. practitioner_grant_revocations
-- ----------------------------------------------------------------

create table if not exists practitioner_grant_revocations (
  id          uuid primary key default gen_random_uuid(),
  grant_id    uuid not null references practitioner_grants(id),
  revoked_at  timestamptz not null default now(),
  -- Who initiated the revocation: the subject, the practitioner, or
  -- a system/admin action. See PractitionerGrantRevocation in domain.ts.
  revoked_by  text not null,

  constraint practitioner_grant_revocations_revoked_by_chk
    check (revoked_by in ('subject','practitioner','system'))
);

create index if not exists practitioner_grant_revocations_grant_id_idx
  on practitioner_grant_revocations (grant_id);

-- ----------------------------------------------------------------
-- 4. Row level security
-- ----------------------------------------------------------------

alter table practitioner_grants enable row level security;
alter table practitioner_grant_revocations enable row level security;

-- Subject can see every grant that names them.
create policy practitioner_grants_subject_read on practitioner_grants
  for select using (subject_user_id = auth.uid());

-- Practitioner can see every grant they hold.
create policy practitioner_grants_practitioner_read on practitioner_grants
  for select using (practitioner_id = auth.uid());

-- Subject can see revocations on grants that name them.
create policy practitioner_grant_revocations_subject_read
  on practitioner_grant_revocations
  for select using (
    exists (
      select 1 from practitioner_grants g
      where g.id = grant_id
        and g.subject_user_id = auth.uid()
    )
  );

-- Practitioner can see revocations on grants they hold.
create policy practitioner_grant_revocations_practitioner_read
  on practitioner_grant_revocations
  for select using (
    exists (
      select 1 from practitioner_grants g
      where g.id = grant_id
        and g.practitioner_id = auth.uid()
    )
  );

-- Writes to both tables go through the service role only. No
-- insert/update/delete policy is granted to anon or authenticated
-- roles here: grant creation and revocation are trust-boundary
-- operations that must never depend on a client asserting its own
-- practitioner_id or subject_user_id.
