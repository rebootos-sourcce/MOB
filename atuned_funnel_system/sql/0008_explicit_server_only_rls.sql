-- Make the server-only RLS boundary explicit.
-- Client roles already have no table privileges. These restrictive policies
-- add defense in depth and make the intended deny boundary visible.

do $$
declare
  t text;
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
    execute format(
      'create policy %I on public.%I as restrictive for all to anon, authenticated using (false) with check (false)',
      'server_only_deny_' || t,
      t
    );
  end loop;
end $$;
