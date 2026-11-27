\pset pager off
\set ON_ERROR_STOP on
create or replace function public.funnel_delete_account(p_user_id text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_sessions uuid[]; v_n integer;
begin
  if p_user_id is null or p_user_id = '' then raise exception 'a user id is required'; end if;
  select coalesce(array_agg(id), '{}'::uuid[]) into v_sessions from public.funnel_sessions where user_id = p_user_id;
  delete from public.starter_gift_items where gift_id in (select id from public.starter_gifts where user_id = p_user_id or funnel_session_id = any(v_sessions));
  delete from public.usage_ledger        where user_id = p_user_id or funnel_session_id = any(v_sessions);
  delete from public.starter_gifts       where user_id = p_user_id or funnel_session_id = any(v_sessions);
  delete from public.tutorial_progress   where user_id = p_user_id or funnel_session_id = any(v_sessions);
  delete from public.funnel_events       where session_id = any(v_sessions);
  delete from public.attachment_challenges where session_id = any(v_sessions);
  delete from public.referrals           where inviter_user_id = p_user_id;
  update public.referrals set invitee_user_id = null where invitee_user_id = p_user_id;
  delete from public.funnel_sessions     where id = any(v_sessions);
  get diagnostics v_n = row_count;
  return jsonb_build_object('status','deleted','sessions',v_n);
end $$;
revoke all on function public.funnel_delete_account(text) from public, anon, authenticated;
grant execute on function public.funnel_delete_account(text) to service_role;

-- fixtures: one attached account with the full set of child rows, one bystander, one anonymous session
insert into public.funnel_sessions(id,anonymous_id,user_id,state,status) values
 ('31111111-1111-1111-1111-111111111111','a-mine','acc_mine','ARRIVE','active'),
 ('32222222-2222-2222-2222-222222222222','a-other','acc_other','ARRIVE','active'),
 ('33333333-3333-3333-3333-333333333333','a-anon',null,'ARRIVE','active');
insert into public.starter_gifts(id,funnel_session_id,user_id,selected_ground_id,pattern_set_hash,granted,remaining,status,transferred_at) values
 ('b1111111-1111-1111-1111-111111111111','31111111-1111-1111-1111-111111111111','acc_mine','x','h',100,99,'active',now()),
 ('b2222222-2222-2222-2222-222222222222','32222222-2222-2222-2222-222222222222','acc_other','x','h',100,100,'active',now());
insert into public.starter_gift_items(gift_id,pattern_id,position) values ('b1111111-1111-1111-1111-111111111111','p1',0),('b2222222-2222-2222-2222-222222222222','p1',0);
insert into public.tutorial_progress(funnel_session_id,user_id) values ('31111111-1111-1111-1111-111111111111','acc_mine'),('32222222-2222-2222-2222-222222222222','acc_other');
insert into public.funnel_events(session_id,type,sequence) values ('31111111-1111-1111-1111-111111111111','t',1),('32222222-2222-2222-2222-222222222222','t',1);
insert into public.attachment_challenges(session_id,credential_hash,expires_at) values ('31111111-1111-1111-1111-111111111111','h1',now()+interval '1 hour'),('32222222-2222-2222-2222-222222222222','h2',now()+interval '1 hour');
insert into public.referrals(inviter_user_id,invitee_user_id,token) values ('acc_mine','acc_other','tok1'),('acc_other','acc_mine','tok2');
\echo '--- before: rows per table for acc_mine / everyone'
select 'funnel_sessions' t, count(*) filter (where user_id='acc_mine') mine, count(*) total from public.funnel_sessions
union all select 'starter_gifts', count(*) filter (where user_id='acc_mine'), count(*) from public.starter_gifts
union all select 'tutorial_progress', count(*) filter (where user_id='acc_mine'), count(*) from public.tutorial_progress
union all select 'funnel_events', count(*) filter (where session_id='31111111-1111-1111-1111-111111111111'), count(*) from public.funnel_events
union all select 'referrals', count(*) filter (where inviter_user_id='acc_mine' or invitee_user_id='acc_mine'), count(*) from public.referrals;
\echo '--- a plain delete of the session fails on the foreign keys (why the RPC must go children first)'
\set ON_ERROR_STOP off
delete from public.funnel_sessions where user_id='acc_mine';
\set ON_ERROR_STOP on
set role service_role;
select public.funnel_delete_account('acc_mine') as first_call;
select public.funnel_delete_account('acc_mine') as second_call_idempotent;
reset role;
\echo '--- after'
select 'funnel_sessions' t, count(*) filter (where user_id='acc_mine') mine, count(*) total from public.funnel_sessions
union all select 'starter_gifts', count(*) filter (where user_id='acc_mine'), count(*) from public.starter_gifts
union all select 'starter_gift_items', count(*) filter (where gift_id='b1111111-1111-1111-1111-111111111111'), count(*) from public.starter_gift_items
union all select 'tutorial_progress', count(*) filter (where user_id='acc_mine'), count(*) from public.tutorial_progress
union all select 'funnel_events', count(*) filter (where session_id='31111111-1111-1111-1111-111111111111'), count(*) from public.funnel_events
union all select 'attachment_challenges', count(*) filter (where session_id='31111111-1111-1111-1111-111111111111'), count(*) from public.attachment_challenges
union all select 'referrals', count(*) filter (where inviter_user_id='acc_mine' or invitee_user_id='acc_mine'), count(*) from public.referrals;
