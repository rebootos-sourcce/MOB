-- Align funnel identity columns with the existing Worker account authority.
-- Reboot-OS account ids are opaque text values such as acc_..., not UUIDs.
-- Supabase stores that existing identity verbatim.

drop function if exists public.funnel_attach_session(uuid,uuid,text,timestamptz);
drop function if exists public.funnel_transfer_starter_gift(uuid,uuid,timestamptz);
drop function if exists public.funnel_save_session(jsonb,integer);
drop function if exists public.funnel_save_starter_gift(jsonb,jsonb);
drop function if exists public.funnel_consume_usage(uuid,uuid,text,text,text,uuid,integer,text,uuid,timestamptz);

drop index if exists public.funnel_sessions_user_id_idx;
drop index if exists public.usage_ledger_user_id_idx;
drop index if exists public.usage_ledger_identity_idempotency_uq;
drop index if exists public.referrals_inviter_user_id_idx;

alter table public.funnel_sessions alter column user_id type text using user_id::text;
alter table public.starter_gifts alter column user_id type text using user_id::text;
alter table public.tutorial_progress alter column user_id type text using user_id::text;
alter table public.usage_ledger alter column user_id type text using user_id::text;
alter table public.referrals alter column inviter_user_id type text using inviter_user_id::text;
alter table public.referrals alter column invitee_user_id type text using invitee_user_id::text;

create index funnel_sessions_user_id_idx on public.funnel_sessions (user_id);
create index usage_ledger_user_id_idx on public.usage_ledger (user_id);
create unique index usage_ledger_identity_idempotency_uq
  on public.usage_ledger (coalesce(user_id,'__anonymous__'), coalesce(funnel_session_id::text,'__no_session__'), idempotency_key);
create index referrals_inviter_user_id_idx on public.referrals (inviter_user_id);

create or replace function public.funnel_transfer_starter_gift(p_gift_id uuid,p_user_id text,p_transferred_at timestamptz)
returns text language plpgsql security definer set search_path=''
as $$
declare v_user_id text; v_transferred_at timestamptz;
begin
 select user_id,transferred_at into v_user_id,v_transferred_at from public.starter_gifts where id=p_gift_id for update;
 if not found then return 'not_found'; end if;
 if v_transferred_at is null then
  update public.starter_gifts set user_id=p_user_id,transferred_at=p_transferred_at,status=case when remaining=0 then 'depleted' else 'active' end where id=p_gift_id;
  return 'transferred';
 end if;
 if v_user_id=p_user_id then return 'already_owned'; end if;
 return 'owned_by_other';
end $$;

create or replace function public.funnel_save_session(p_session jsonb,p_expected_version integer)
returns boolean language plpgsql security definer set search_path=''
as $$
declare v_id uuid:=(p_session->>'id')::uuid; v_version integer:=(p_session->>'version')::integer;
begin
 if p_expected_version is null then
  if v_version<>1 then raise exception 'new funnel session must start at version 1'; end if;
  insert into public.funnel_sessions(id,anonymous_id,user_id,state,status,selected_ground_id,starter_gift_id,tutorial_completed,first_release_id,verification_id,version,created_at,updated_at)
  values(v_id,p_session->>'anonymousId',nullif(p_session->>'userId',''),p_session->>'state',p_session->>'status',p_session->>'selectedGroundId',nullif(p_session->>'starterGiftId','')::uuid,(p_session->>'tutorialCompleted')::boolean,nullif(p_session->>'firstReleaseId','')::uuid,nullif(p_session->>'verificationId','')::uuid,v_version,(p_session->>'createdAt')::timestamptz,(p_session->>'updatedAt')::timestamptz)
  on conflict(id) do nothing;
  return found;
 end if;
 if v_version<>p_expected_version+1 then raise exception 'funnel session version must advance exactly one step'; end if;
 update public.funnel_sessions set anonymous_id=p_session->>'anonymousId',user_id=nullif(p_session->>'userId',''),state=p_session->>'state',status=p_session->>'status',selected_ground_id=p_session->>'selectedGroundId',starter_gift_id=nullif(p_session->>'starterGiftId','')::uuid,tutorial_completed=(p_session->>'tutorialCompleted')::boolean,first_release_id=nullif(p_session->>'firstReleaseId','')::uuid,verification_id=nullif(p_session->>'verificationId','')::uuid,version=v_version,updated_at=(p_session->>'updatedAt')::timestamptz where id=v_id and version=p_expected_version;
 return found;
end $$;

create or replace function public.funnel_save_starter_gift(p_gift jsonb,p_items jsonb)
returns void language plpgsql security definer set search_path='public'
as $$
begin
 if jsonb_array_length(p_items)<>(p_gift->>'patternIdsCount')::integer then raise exception 'starter gift item count does not match pattern count'; end if;
 insert into public.starter_gifts(id,funnel_session_id,user_id,source,selected_ground_id,pattern_set_hash,granted,remaining,issued_at,transferred_at,status)
 values((p_gift->>'id')::uuid,(p_gift->>'funnelSessionId')::uuid,nullif(p_gift->>'userId',''),'funnel',p_gift->>'selectedGroundId',p_gift->>'patternSetHash',(p_gift->>'granted')::integer,(p_gift->>'remaining')::integer,(p_gift->>'issuedAt')::timestamptz,nullif(p_gift->>'transferredAt','')::timestamptz,p_gift->>'status')
 on conflict(id) do update set user_id=excluded.user_id,remaining=excluded.remaining,transferred_at=excluded.transferred_at,status=excluded.status;
 if not exists(select 1 from public.starter_gift_items where gift_id=(p_gift->>'id')::uuid) then
  insert into public.starter_gift_items(gift_id,pattern_id,position,created_at)
  select (p_gift->>'id')::uuid,x->>'patternId',(x->>'position')::integer,(x->>'createdAt')::timestamptz from jsonb_array_elements(p_items) x;
 end if;
end $$;

create or replace function public.funnel_consume_usage(p_user_id text,p_funnel_session_id uuid,p_source text,p_operation text,p_pattern_id text,p_release_id uuid,p_amount integer,p_idempotency_key text,p_entry_id uuid,p_created_at timestamptz)
returns integer language plpgsql security definer set search_path=''
as $$
declare v_balance integer; v_gift_id uuid; v_existing_balance integer;
begin
 if p_amount<>1 or p_operation<>'OPEN_NEW_GROUND' then raise exception 'usage consumption must be one OPEN_NEW_GROUND unit'; end if;
 select balance_after into v_existing_balance from public.usage_ledger where (user_id=p_user_id or (p_user_id is null and user_id is null)) and (funnel_session_id=p_funnel_session_id or (p_funnel_session_id is null and funnel_session_id is null)) and idempotency_key=p_idempotency_key limit 1;
 if found then return v_existing_balance; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(coalesce(p_user_id,'')||':'||coalesce(p_funnel_session_id::text,'')||':'||p_source,0));
 select balance_after into v_existing_balance from public.usage_ledger where (user_id=p_user_id or (p_user_id is null and user_id is null)) and (funnel_session_id=p_funnel_session_id or (p_funnel_session_id is null and funnel_session_id is null)) and idempotency_key=p_idempotency_key limit 1;
 if found then return v_existing_balance; end if;
 if p_source='STARTER_GIFT' then
  select id,remaining into v_gift_id,v_balance from public.starter_gifts where funnel_session_id=p_funnel_session_id and (p_user_id is null or user_id=p_user_id) and status in ('pending','active') and remaining>0 order by issued_at asc limit 1 for update;
  if not found then return null; end if;
  v_balance:=v_balance-1;
  update public.starter_gifts set remaining=v_balance,status=case when v_balance=0 then 'depleted' else status end where id=v_gift_id;
 else
  select balance_after into v_balance from public.usage_ledger where user_id=p_user_id and source=p_source order by created_at desc,id desc limit 1 for update;
  if not found or v_balance<=0 then return null; end if;
  v_balance:=v_balance-1;
 end if;
 insert into public.usage_ledger(id,user_id,funnel_session_id,source,operation,pattern_id,release_id,amount,balance_after,idempotency_key,created_at)
 values(p_entry_id,p_user_id,p_funnel_session_id,p_source,p_operation,p_pattern_id,p_release_id,p_amount,v_balance,p_idempotency_key,p_created_at);
 return v_balance;
end $$;

create or replace function public.funnel_attach_session(p_session_id uuid,p_user_id text,p_credential_hash text,p_now timestamptz)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_challenge public.attachment_challenges%rowtype; v_session public.funnel_sessions%rowtype; v_gift public.starter_gifts%rowtype;
begin
 select * into v_challenge from public.attachment_challenges where session_id=p_session_id and used_at is null and expires_at>p_now order by created_at desc limit 1 for update;
 if not found or v_challenge.credential_hash<>p_credential_hash then return jsonb_build_object('status','invalid_credential'); end if;
 select * into v_session from public.funnel_sessions where id=p_session_id for update;
 if not found then return jsonb_build_object('status','session_not_found'); end if;
 if v_session.user_id is not null and v_session.user_id<>p_user_id then return jsonb_build_object('status','session_owned_by_other'); end if;
 if v_session.starter_gift_id is null then return jsonb_build_object('status','gift_not_found'); end if;
 select * into v_gift from public.starter_gifts where id=v_session.starter_gift_id for update;
 if not found then return jsonb_build_object('status','gift_not_found'); end if;
 if v_gift.transferred_at is not null and v_gift.user_id<>p_user_id then return jsonb_build_object('status','gift_owned_by_other'); end if;
 update public.attachment_challenges set used_at=p_now where id=v_challenge.id;
 if v_gift.transferred_at is null then
  update public.starter_gifts set user_id=p_user_id,transferred_at=p_now,status=case when remaining=0 then 'depleted' else 'active' end where id=v_gift.id;
 end if;
 update public.funnel_sessions set user_id=p_user_id,updated_at=p_now where id=p_session_id;
 insert into public.tutorial_progress(funnel_session_id,user_id,started_at,pattern_selected,first_release_started,first_release_completed,verification_completed,completed_at)
 values(p_session_id,p_user_id,null,false,false,false,false,null)
 on conflict(funnel_session_id) do update set user_id=excluded.user_id;
 select * into v_session from public.funnel_sessions where id=p_session_id;
 return jsonb_build_object('status',case when v_gift.transferred_at is null then 'transferred' else 'already_owned' end,'session',jsonb_build_object('id',v_session.id,'anonymousId',v_session.anonymous_id,'userId',v_session.user_id,'state',v_session.state,'status',v_session.status,'selectedGroundId',v_session.selected_ground_id,'starterGiftId',v_session.starter_gift_id,'tutorialCompleted',v_session.tutorial_completed,'firstReleaseId',v_session.first_release_id,'verificationId',v_session.verification_id,'version',v_session.version,'createdAt',v_session.created_at,'updatedAt',v_session.updated_at));
end $$;

revoke all on function public.funnel_transfer_starter_gift(uuid,text,timestamptz) from public,anon,authenticated;
grant execute on function public.funnel_transfer_starter_gift(uuid,text,timestamptz) to service_role;
revoke all on function public.funnel_save_session(jsonb,integer) from public,anon,authenticated;
grant execute on function public.funnel_save_session(jsonb,integer) to service_role;
revoke all on function public.funnel_save_starter_gift(jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.funnel_save_starter_gift(jsonb,jsonb) to service_role;
revoke all on function public.funnel_consume_usage(text,uuid,text,text,text,uuid,integer,text,uuid,timestamptz) from public,anon,authenticated;
grant execute on function public.funnel_consume_usage(text,uuid,text,text,text,uuid,integer,text,uuid,timestamptz) to service_role;
revoke all on function public.funnel_attach_session(uuid,text,text,timestamptz) from public,anon,authenticated;
grant execute on function public.funnel_attach_session(uuid,text,text,timestamptz) to service_role;