-- Funnel concurrency helpers.
--
-- Applied as migration 0002 in the live Supabase project before the RLS
-- hardening migration. Keep this file append-only from this point forward.
--
-- The event sequence function serializes sequence allocation per session
-- inside the transaction that calls it.
create or replace function public.funnel_next_event_sequence(p_session_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $function$
declare
  n integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_session_id::text, 0));
  select coalesce(max(sequence), 0) + 1
    into n
    from public.funnel_events
   where session_id = p_session_id;
  return n;
end;
$function$;

-- Starter-gift persistence keeps the gift row and its item rows together
-- and refuses a count mismatch before the write.
create or replace function public.funnel_save_starter_gift(
  p_gift jsonb,
  p_items jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $function$
begin
  if jsonb_array_length(p_items) <> (p_gift->>'patternIdsCount')::integer then
    raise exception 'starter gift item count does not match pattern count';
  end if;

  insert into public.starter_gifts
    (
      id,
      funnel_session_id,
      user_id,
      source,
      selected_ground_id,
      pattern_set_hash,
      granted,
      remaining,
      issued_at,
      transferred_at,
      status
    )
  values
    (
      (p_gift->>'id')::uuid,
      (p_gift->>'funnelSessionId')::uuid,
      nullif(p_gift->>'userId','')::uuid,
      'funnel',
      p_gift->>'selectedGroundId',
      p_gift->>'patternSetHash',
      (p_gift->>'granted')::integer,
      (p_gift->>'remaining')::integer,
      (p_gift->>'issuedAt')::timestamptz,
      nullif(p_gift->>'transferredAt','')::timestamptz,
      p_gift->>'status'
    )
  on conflict (id) do update
    set user_id = excluded.user_id,
        remaining = excluded.remaining,
        transferred_at = excluded.transferred_at,
        status = excluded.status;

  if not exists (
    select 1
      from public.starter_gift_items
     where gift_id = (p_gift->>'id')::uuid
  ) then
    insert into public.starter_gift_items
      (gift_id, pattern_id, position, created_at)
    select
      (p_gift->>'id')::uuid,
      x->>'patternId',
      (x->>'position')::integer,
      (x->>'createdAt')::timestamptz
    from jsonb_array_elements(p_items) x;
  end if;
end;
$function$;

revoke all on function public.funnel_next_event_sequence(uuid) from public, anon, authenticated;
revoke all on function public.funnel_save_starter_gift(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.funnel_next_event_sequence(uuid) to service_role;
grant execute on function public.funnel_save_starter_gift(jsonb, jsonb) to service_role;
