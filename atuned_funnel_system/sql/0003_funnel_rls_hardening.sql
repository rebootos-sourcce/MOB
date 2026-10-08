-- Funnel production RLS hardening.
--
-- The funnel repository is server-only and uses the Supabase service role.
-- Client roles must not have table privileges on funnel-owned tables.
-- RLS remains enabled as defense in depth.
--
-- This is intentionally a new migration. 0001_funnel is already applied
-- and must not be edited.

do $$
declare t text;
begin
  foreach t in array array[
    'funnel_sessions',
    'starter_gifts',
    'starter_gift_items',
    'tutorial_progress',
    'usage_ledger',
    'referrals',
    'funnel_events',
    'idempotency_claims',
    'attachment_challenges'
  ] loop
    execute format('revoke all on table public.%I from anon, authenticated, public', t);
  end loop;
end $$;

drop policy if exists funnel_sessions_owner_read on public.funnel_sessions;
drop policy if exists usage_ledger_owner_read on public.usage_ledger;
drop policy if exists referrals_owner_read on public.referrals;

revoke all on function public.funnel_next_event_sequence(uuid) from public, anon, authenticated;
revoke all on function public.funnel_save_starter_gift(jsonb, jsonb) from public, anon, authenticated;

grant execute on function public.funnel_next_event_sequence(uuid) to service_role;
grant execute on function public.funnel_save_starter_gift(jsonb, jsonb) to service_role;
