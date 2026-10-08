-- Close the same-key race inside funnel_consume_usage.
-- The idempotency check must be repeated after the transaction-level
-- advisory lock, not only before it.

create or replace function public.funnel_consume_usage(
  p_user_id uuid,
  p_funnel_session_id uuid,
  p_source text,
  p_operation text,
  p_pattern_id text,
  p_release_id uuid,
  p_amount integer,
  p_idempotency_key text,
  p_entry_id uuid,
  p_created_at timestamptz
)
returns integer
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_balance integer;
  v_gift_id uuid;
  v_existing_balance integer;
begin
  if p_amount <> 1 or p_operation <> 'OPEN_NEW_GROUND' then
    raise exception 'usage consumption must be one OPEN_NEW_GROUND unit';
  end if;

  select balance_after
    into v_existing_balance
    from public.usage_ledger
   where (user_id = p_user_id or (p_user_id is null and user_id is null))
     and (funnel_session_id = p_funnel_session_id or (p_funnel_session_id is null and funnel_session_id is null))
     and idempotency_key = p_idempotency_key
   limit 1;

  if found then
    return v_existing_balance;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      coalesce(p_user_id::text, '') || ':' ||
      coalesce(p_funnel_session_id::text, '') || ':' ||
      p_source,
      0
    )
  );

  select balance_after
    into v_existing_balance
    from public.usage_ledger
   where (user_id = p_user_id or (p_user_id is null and user_id is null))
     and (funnel_session_id = p_funnel_session_id or (p_funnel_session_id is null and funnel_session_id is null))
     and idempotency_key = p_idempotency_key
   limit 1;

  if found then
    return v_existing_balance;
  end if;

  if p_source = 'STARTER_GIFT' then
    select id, remaining
      into v_gift_id, v_balance
      from public.starter_gifts
     where funnel_session_id = p_funnel_session_id
       and (p_user_id is null or user_id = p_user_id)
       and status in ('pending','active')
       and remaining > 0
     order by issued_at asc
     limit 1
     for update;

    if not found then
      return null;
    end if;

    v_balance := v_balance - 1;

    update public.starter_gifts
       set remaining = v_balance,
           status = case when v_balance = 0 then 'depleted' else status end
     where id = v_gift_id;
  else
    select balance_after
      into v_balance
      from public.usage_ledger
     where user_id = p_user_id
       and source = p_source
     order by created_at desc, id desc
     limit 1
     for update;

    if not found or v_balance <= 0 then
      return null;
    end if;

    v_balance := v_balance - 1;
  end if;

  insert into public.usage_ledger
    (id,user_id,funnel_session_id,source,operation,pattern_id,release_id,
     amount,balance_after,idempotency_key,created_at)
  values
    (p_entry_id,p_user_id,p_funnel_session_id,p_source,p_operation,p_pattern_id,
     p_release_id,p_amount,v_balance,p_idempotency_key,p_created_at);

  return v_balance;
end;
$function$;

revoke all on function public.funnel_consume_usage(uuid, uuid, text, text, text, uuid, integer, text, uuid, timestamptz)
  from public, anon, authenticated;
grant execute on function public.funnel_consume_usage(uuid, uuid, text, text, text, uuid, integer, text, uuid, timestamptz)
  to service_role;
