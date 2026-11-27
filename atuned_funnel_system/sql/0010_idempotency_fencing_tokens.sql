-- Fence idempotency claim completion.
-- A lease alone allows an old worker to finish late after another worker
-- reclaimed the claim. A per-claim token makes completion ownership explicit.

alter table public.idempotency_claims
  add column if not exists claim_token uuid;

update public.idempotency_claims
   set claim_token = gen_random_uuid()
 where claim_token is null;

alter table public.idempotency_claims
  alter column claim_token set default gen_random_uuid();

alter table public.idempotency_claims
  alter column claim_token set not null;

create or replace function public.funnel_claim_idempotency(
  p_scope_key text,
  p_operation text,
  p_idempotency_key text,
  p_request_hash text,
  p_now timestamptz,
  p_lease_seconds integer default 300
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_claim public.idempotency_claims%rowtype;
  v_lease timestamptz;
  v_token uuid := gen_random_uuid();
begin
  if p_lease_seconds < 30 or p_lease_seconds > 3600 then
    raise exception 'invalid idempotency lease';
  end if;

  insert into public.idempotency_claims(
    scope_key,operation,idempotency_key,request_hash,status,
    result_reference,created_at,completed_at,claimed_at,lease_expires_at,claim_token
  )
  values(
    p_scope_key,p_operation,p_idempotency_key,p_request_hash,'in_progress',
    null,p_now,null,p_now,p_now + make_interval(secs => p_lease_seconds),v_token
  )
  on conflict (scope_key,idempotency_key) do nothing;

  if found then
    return jsonb_build_object('claimed',true,'claimToken',v_token::text);
  end if;

  select *
    into v_claim
    from public.idempotency_claims
   where scope_key = p_scope_key
     and idempotency_key = p_idempotency_key
   for update;

  if v_claim.request_hash <> p_request_hash then
    raise exception 'IDEMPOTENCY_HASH_MISMATCH:%', p_idempotency_key;
  end if;

  if v_claim.status = 'completed' then
    return jsonb_build_object(
      'claimed',false,
      'scopeKey',v_claim.scope_key,
      'operation',v_claim.operation,
      'idempotencyKey',v_claim.idempotency_key,
      'requestHash',v_claim.request_hash,
      'status',v_claim.status,
      'resultReference',v_claim.result_reference,
      'createdAt',v_claim.created_at,
      'completedAt',v_claim.completed_at
    );
  end if;

  if v_claim.lease_expires_at is null or v_claim.lease_expires_at <= p_now then
    v_lease := p_now + make_interval(secs => p_lease_seconds);
    v_token := gen_random_uuid();

    update public.idempotency_claims
       set operation = p_operation,
           claimed_at = p_now,
           lease_expires_at = v_lease,
           claim_token = v_token
     where scope_key = p_scope_key
       and idempotency_key = p_idempotency_key;

    return jsonb_build_object('claimed',true,'claimToken',v_token::text);
  end if;

  return jsonb_build_object(
    'claimed',false,
    'scopeKey',v_claim.scope_key,
    'operation',v_claim.operation,
    'idempotencyKey',v_claim.idempotency_key,
    'requestHash',v_claim.request_hash,
    'status',v_claim.status,
    'resultReference',v_claim.result_reference,
    'createdAt',v_claim.created_at,
    'completedAt',v_claim.completed_at
  );
end;
$function$;

create or replace function public.funnel_complete_idempotency(
  p_scope_key text,
  p_idempotency_key text,
  p_claim_token uuid,
  p_result_reference text,
  p_completed_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
begin
  update public.idempotency_claims
     set status='completed',
         result_reference=p_result_reference,
         completed_at=p_completed_at,
         lease_expires_at=null
   where scope_key=p_scope_key
     and idempotency_key=p_idempotency_key
     and claim_token=p_claim_token
     and status='in_progress';

  return found;
end;
$function$;

revoke all on function public.funnel_claim_idempotency(text,text,text,text,timestamptz,integer)
  from public, anon, authenticated;
revoke all on function public.funnel_complete_idempotency(text,text,uuid,text,timestamptz)
  from public, anon, authenticated;
grant execute on function public.funnel_claim_idempotency(text,text,text,text,timestamptz,integer)
  to service_role;
grant execute on function public.funnel_complete_idempotency(text,text,uuid,text,timestamptz)
  to service_role;
