\set ON_ERROR_STOP off
\pset pager off
\echo '--- 1. functions the Worker calls (funnel.js:96,202,214) exist, with these signatures'
select p.proname, pg_get_function_identity_arguments(p.oid) as args from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('funnel_create_session','funnel_save_session','funnel_attach_session','funnel_save_starter_gift','funnel_delete_account') order by 1;
\echo '--- 2. column types the Worker validates as short strings'
select column_name, data_type from information_schema.columns where table_name='funnel_sessions' and column_name in ('selected_ground_id','first_release_id','verification_id','user_id','starter_gift_id') order by 1;
set role service_role;
\echo '--- 3. create (as the Worker does: funnel.js:96-102), 15 minute expiry'
select public.funnel_create_session('11111111-1111-1111-1111-111111111111','anon-probe-0001','hash-a', now(), now() + interval '15 minutes') ->> 'state' as created_state;
\echo '--- 4. checkpoint selectedGroundId (the only field the live smoke writes)'
select public.funnel_save_session('{"id":"11111111-1111-1111-1111-111111111111","anonymousId":"anon-probe-0001","userId":null,"state":"ARRIVE","status":"active","selectedGroundId":"anxiety","starterGiftId":null,"tutorialCompleted":false,"firstReleaseId":null,"verificationId":null,"version":2,"createdAt":"2026-10-09T00:00:00Z","updatedAt":"2026-10-09T00:01:00Z"}'::jsonb, 1) as saved_ground;
\echo '--- 5. checkpoint tutorialCompleted true'
select public.funnel_save_session('{"id":"11111111-1111-1111-1111-111111111111","anonymousId":"anon-probe-0001","userId":null,"state":"ARRIVE","status":"active","selectedGroundId":"anxiety","starterGiftId":null,"tutorialCompleted":true,"firstReleaseId":null,"verificationId":null,"version":3,"createdAt":"2026-10-09T00:00:00Z","updatedAt":"2026-10-09T00:02:00Z"}'::jsonb, 2) as saved_tutorial;
\echo '--- 6. checkpoint firstReleaseId exactly as the client builds it (ui/release.js:281: release_ + crypto.randomUUID())'
select public.funnel_save_session('{"id":"11111111-1111-1111-1111-111111111111","anonymousId":"anon-probe-0001","userId":null,"state":"ARRIVE","status":"active","selectedGroundId":"anxiety","starterGiftId":null,"tutorialCompleted":true,"firstReleaseId":"release_5b0c7a54-1c2f-4a58-9f4d-0a4e3b1d9e11","verificationId":null,"version":4,"createdAt":"2026-10-09T00:00:00Z","updatedAt":"2026-10-09T00:03:00Z"}'::jsonb, 3) as saved_release;
\echo '--- 7. checkpoint verificationId as the client builds it (ui/release.js:1146: an evidence record id)'
select public.funnel_save_session('{"id":"11111111-1111-1111-1111-111111111111","anonymousId":"anon-probe-0001","userId":null,"state":"ARRIVE","status":"active","selectedGroundId":"anxiety","starterGiftId":null,"tutorialCompleted":true,"firstReleaseId":null,"verificationId":"ev_1","version":4,"createdAt":"2026-10-09T00:00:00Z","updatedAt":"2026-10-09T00:03:00Z"}'::jsonb, 3) as saved_verification;
\echo '--- 8. attach as the Worker does (funnel.js:214), account id is text acc_...'
select public.funnel_attach_session('11111111-1111-1111-1111-111111111111','acc_abc123','hash-a', now()) ->> 'status' as attach_status;
\echo '--- 9. attach after the 15 minute pass has expired'
select public.funnel_create_session('22222222-2222-2222-2222-222222222222','anon-probe-0002','hash-b', now() - interval '20 minutes', now() - interval '5 minutes') ->> 'state' as created_old;
select public.funnel_attach_session('22222222-2222-2222-2222-222222222222','acc_abc123','hash-b', now()) ->> 'status' as attach_status_expired;
reset role;
\echo '--- 10. does anything in the database create a starter gift on its own (trigger, default, other function)?'
select count(*) as triggers_in_public from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and not t.tgisinternal;
select count(*) as starter_gifts_rows from public.starter_gifts;
select proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and pg_get_functiondef(p.oid) ilike '%insert into public.starter_gifts%' order by 1;
\echo '--- 11. with a gift present, attach works and is idempotent per account (so the RPC itself is sound)'
insert into public.starter_gifts(id, funnel_session_id, selected_ground_id, pattern_set_hash, granted, remaining) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','anxiety','h',100,100);
update public.funnel_sessions set starter_gift_id='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' where id='11111111-1111-1111-1111-111111111111';
set role service_role;
select public.funnel_attach_session('11111111-1111-1111-1111-111111111111','acc_abc123','hash-a', now()) ->> 'status' as attach_with_gift;
select public.funnel_attach_session('11111111-1111-1111-1111-111111111111','acc_abc123','hash-a', now()) ->> 'status' as attach_again_same_credential;
reset role;
\echo '--- 12. the foreign keys a delete RPC has to walk (children first)'
select conrelid::regclass as child, confrelid::regclass as parent, confdeltype as on_delete from pg_constraint where contype='f' and connamespace='public'::regnamespace order by 1;
