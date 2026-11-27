-- Atomic starter-gift ownership transfer.

create or replace function public.funnel_transfer_starter_gift(
  p_gift_id uuid,
  p_user_id uuid,
  p_transferred_at timestamptz
)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid;
  v_transferred_at timestamptz;
begin
  select user_id, transferred_at
    into v_user_id, v_transferred_at
    from public.starter_gifts
   where id = p_gift_id
   for update;

  if not found then
    return 'not_found';
  end if;

  if v_transferred_at is null then
    update public.starter_gifts
       set user_id = p_user_id,
           transferred_at = p_transferred_at,
           status = case when remaining = 0 then 'depleted' else 'active' end
     where id = p_gift_id;
    return 'transferred';
  end if;

  if v_user_id = p_user_id then
    return 'already_owned';
  end if;

  return 'owned_by_other';
end;
$function$;

revoke all on function public.funnel_transfer_starter_gift(uuid, uuid, timestamptz)
  from public, anon, authenticated;
grant execute on function public.funnel_transfer_starter_gift(uuid, uuid, timestamptz)
  to service_role;
