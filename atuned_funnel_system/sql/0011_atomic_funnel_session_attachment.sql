-- Atomic anonymous funnel session attachment.
-- Challenge consumption, starter-gift ownership, session ownership and
-- tutorial ownership must move together or not at all.

create or replace function public.funnel_attach_session(
  p_session_id uuid,
  p_user_id uuid,
  p_credential_hash text,
  p_now timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_challenge public.attachment_challenges%rowtype;
  v_session public.funnel_sessions%rowtype;
  v_gift public.starter_gifts%rowtype;
begin
  select *
    into v_challenge
    from public.attachment_challenges
   where session_id = p_session_id
     and used_at is null
     and expires_at > p_now
   order by created_at desc
   limit 1
   for update;

  if not found or v_challenge.credential_hash <> p_credential_hash then
    return jsonb_build_object('status','invalid_credential');
  end if;

  select *
    into v_session
    from public.funnel_sessions
   where id = p_session_id
   for update;

  if not found then
    return jsonb_build_object('status','session_not_found');
  end if;

  if v_session.user_id is not null and v_session.user_id <> p_user_id then
    return jsonb_build_object('status','session_owned_by_other');
  end if;

  if v_session.starter_gift_id is null then
    return jsonb_build_object('status','gift_not_found');
  end if;

  select *
    into v_gift
    from public.starter_gifts
   where id = v_session.starter_gift_id
   for update;

  if not found then
    return jsonb_build_object('status','gift_not_found');
  end if;

  if v_gift.transferred_at is not null and v_gift.user_id <> p_user_id then
    return jsonb_build_object('status','gift_owned_by_other');
  end if;

  update public.attachment_challenges
     set used_at = p_now
   where id = v_challenge.id;

  if v_gift.transferred_at is null then
    update public.starter_gifts
       set user_id = p_user_id,
           transferred_at = p_now,
           status = case when remaining = 0 then 'depleted' else 'active' end
     where id = v_gift.id;
  end if;

  update public.funnel_sessions
     set user_id = p_user_id,
         updated_at = p_now
   where id = p_session_id;

  insert into public.tutorial_progress(
    funnel_session_id,user_id,started_at,pattern_selected,
    first_release_started,first_release_completed,verification_completed,completed_at
  )
  values(
    p_session_id,p_user_id,null,false,false,false,false,null
  )
  on conflict (funnel_session_id) do update
    set user_id = excluded.user_id;

  select *
    into v_session
    from public.funnel_sessions
   where id = p_session_id;

  return jsonb_build_object(
    'status', case when v_gift.transferred_at is null then 'transferred' else 'already_owned' end,
    'session', jsonb_build_object(
      'id',v_session.id,
      'anonymousId',v_session.anonymous_id,
      'userId',v_session.user_id,
      'state',v_session.state,
      'status',v_session.status,
      'selectedGroundId',v_session.selected_ground_id,
      'starterGiftId',v_session.starter_gift_id,
      'tutorialCompleted',v_session.tutorial_completed,
      'firstReleaseId',v_session.first_release_id,
      'verificationId',v_session.verification_id,
      'version',v_session.version,
      'createdAt',v_session.created_at,
      'updatedAt',v_session.updated_at
    )
  );
end;
$function$;

revoke all on function public.funnel_attach_session(uuid,uuid,text,timestamptz)
  from public, anon, authenticated;
grant execute on function public.funnel_attach_session(uuid,uuid,text,timestamptz)
  to service_role;
