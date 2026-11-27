-- Recoverable idempotency claims.
-- A process can die after claiming and before completing. A permanent
-- in_progress row would turn a retry into a false duplicate forever.
-- Claims therefore carry a lease and can be reclaimed atomically by the
-- same request hash after the lease expires.

alter table public.idempotency_claims
  add column if not exists claimed_at timestamptz not null default pg_catalog.now();

alter table public.idempotency_claims
  add column if not exists lease_expires_at timestamptz null;

update public.idempotency_claims
   set lease_expires_at = claimed_at + interval '5 minutes'
 where status = 'in_progress'
   and lease_expires_at is null;

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
begin
  if p_lease_seconds < 30 or p_lease_seconds > 3600 then
    raise exception 'invalid idempotency lease';
  end if;

  insert into public.idempotency_claims(
    scope_key,operation,idempotency_key,request_hash,status,
    result_reference,created_at,completed_at,claimed_at,lease_expires_at
  )
  values(
    p_scope_key,p_operation,p_idempotency_key,p_request_hash,'in_progress',
    null,p_now,null,p_now,p_now + make_interval(secs => p_lease_seconds)
  )
  on conflict (scope_key,idempotency_key) do nothing;

  if found then
    return jsonb_build_object('claimed',true);
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

    update public.idempotency_claims
       set operation = p_operation,
           claimed_at = p_now,
           lease_expires_at = v_lease
     where scope_key = p_scope_key
       and idempotency_key = p_idempotency_key;

    return jsonb_build_object('claimed',true);
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

revoke all on function public.funnel_claim_idempotency(text,text,text,text,timestamptz,integer)
  from public, anon, authenticated;
grant execute on function public.funnel_claim_idempotency(text,text,text,text,timestamptz,integer)
  to service_role;
