-- Funnel persistence concurrency hardening.
-- 0001, 0002 and 0003 are already applied. This migration closes
-- repository-level races that cannot be solved by a read-before-write.

create or replace function public.funnel_save_session(
  p_session jsonb,
  p_expected_version integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_id uuid := (p_session->>'id')::uuid;
  v_version integer := (p_session->>'version')::integer;
begin
  if p_expected_version is null then
    if v_version <> 1 then
      raise exception 'new funnel session must start at version 1';
    end if;

    insert into public.funnel_sessions
      (id,anonymous_id,user_id,state,status,selected_ground_id,starter_gift_id,
       tutorial_completed,first_release_id,verification_id,version,created_at,updated_at)
    values
      (v_id,p_session->>'anonymousId',nullif(p_session->>'userId','')::uuid,
       p_session->>'state',p_session->>'status',p_session->>'selectedGroundId',
       nullif(p_session->>'starterGiftId','')::uuid,(p_session->>'tutorialCompleted')::boolean,
       nullif(p_session->>'firstReleaseId','')::uuid,nullif(p_session->>'verificationId','')::uuid,
       v_version,(p_session->>'createdAt')::timestamptz,(p_session->>'updatedAt')::timestamptz)
    on conflict (id) do nothing;

    return found;
  end if;

  if v_version <> p_expected_version + 1 then
    raise exception 'funnel session version must advance exactly one step';
  end if;

  update public.funnel_sessions
     set anonymous_id = p_session->>'anonymousId',
         user_id = nullif(p_session->>'userId','')::uuid,
         state = p_session->>'state',
         status = p_session->>'status',
         selected_ground_id = p_session->>'selectedGroundId',
         starter_gift_id = nullif(p_session->>'starterGiftId','')::uuid,
         tutorial_completed = (p_session->>'tutorialCompleted')::boolean,
         first_release_id = nullif(p_session->>'firstReleaseId','')::uuid,
         verification_id = nullif(p_session->>'verificationId','')::uuid,
         version = v_version,
         updated_at = (p_session->>'updatedAt')::timestamptz
   where id = v_id
     and version = p_expected_version;

  return found;
end;
$function$;

create or replace function public.funnel_claim_attachment_challenge(
  p_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
begin
  update public.attachment_challenges
     set used_at = pg_catalog.clock_timestamp()
   where id = p_id
     and used_at is null
     and expires_at > pg_catalog.clock_timestamp();

  return found;
end;
$function$;

alter table public.starter_gift_items
  add constraint starter_gift_items_pk primary key (gift_id, position);

drop index if exists public.starter_gift_items_position_uq;

revoke all on function public.funnel_save_session(jsonb, integer) from public, anon, authenticated;
revoke all on function public.funnel_claim_attachment_challenge(uuid) from public, anon, authenticated;
grant execute on function public.funnel_save_session(jsonb, integer) to service_role;
grant execute on function public.funnel_claim_attachment_challenge(uuid) to service_role;
