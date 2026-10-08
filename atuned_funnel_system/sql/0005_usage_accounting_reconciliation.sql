-- Usage accounting reconciliation.
-- The funnel journey requires the first release to be usable before account
-- creation. Usage therefore needs a session identity as well as an optional
-- account identity. Starter-gift consumption is debited from the gift row
-- atomically; the ledger records the durable accounting trace.

alter table public.usage_ledger
  alter column user_id drop not null;

alter table public.usage_ledger
  add column if not exists funnel_session_id uuid null
    references public.funnel_sessions(id);

alter table public.usage_ledger
  add constraint usage_ledger_identity_chk
  check (user_id is not null or funnel_session_id is not null);

drop index if exists public.usage_ledger_idempotency_uq;
create unique index usage_ledger_identity_idempotency_uq
  on public.usage_ledger (
    coalesce(user_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(funnel_session_id, '00000000-0000-0000-0000-000000000000'::uuid),
    idempotency_key
  );

create index if not exists usage_ledger_funnel_session_id_idx
  on public.usage_ledger (funnel_session_id);

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
