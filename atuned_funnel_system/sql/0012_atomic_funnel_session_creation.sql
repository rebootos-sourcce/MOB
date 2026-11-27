-- Atomic anonymous funnel session creation.
-- The session and its attachment credential are one inseparable unit.

create or replace function public.funnel_create_session(
  p_session_id uuid,
  p_anonymous_id text,
  p_credential_hash text,
  p_created_at timestamptz,
  p_expires_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.funnel_sessions(
    id,anonymous_id,user_id,state,status,selected_ground_id,starter_gift_id,
    tutorial_completed,first_release_id,verification_id,version,created_at,updated_at
  )
  values(
    p_session_id,p_anonymous_id,null,'ARRIVE','active',null,null,
    false,null,null,1,p_created_at,p_created_at
  );

  insert into public.attachment_challenges(
    id,session_id,credential_hash,expires_at,used_at,created_at
  )
  values(
    gen_random_uuid(),p_session_id,p_credential_hash,p_expires_at,null,p_created_at
  );

  return jsonb_build_object(
    'id',p_session_id,
    'anonymousId',p_anonymous_id,
    'userId',null,
    'state','ARRIVE',
    'status','active',
    'selectedGroundId',null,
    'starterGiftId',null,
    'tutorialCompleted',false,
    'firstReleaseId',null,
    'verificationId',null,
    'version',1,
    'createdAt',p_created_at,
    'updatedAt',p_created_at
  );
exception when unique_violation then
  raise exception 'FUNNEL_SESSION_ALREADY_EXISTS:%', p_session_id;
end;
$function$;

revoke all on function public.funnel_create_session(uuid,text,text,timestamptz,timestamptz)
  from public, anon, authenticated;
grant execute on function public.funnel_create_session(uuid,text,text,timestamptz,timestamptz)
  to service_role;
