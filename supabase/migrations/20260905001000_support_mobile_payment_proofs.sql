update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf'
]
where id = 'payment-proofs';

create or replace function public.attach_payment_proof(
  p_record_id text,
  p_email text,
  p_path text,
  p_name text
)
returns boolean
language plpgsql
security definer
set search_path = public, storage
as $$
begin
  if p_path is null
    or p_path not like trim(p_record_id) || '/%'
    or p_path like '%..%'
    or p_path !~ '^ST-[A-F0-9]{8}/[a-f0-9-]+\.(jpg|png|webp|heic|heif|pdf)$'
  then
    return false;
  end if;

  if not exists (
    select 1
    from storage.objects
    where bucket_id = 'payment-proofs'
      and name = p_path
  ) then
    return false;
  end if;

  update public.students
  set
    payment_status = 'Proof submitted',
    payment_proof_path = p_path,
    payment_proof_name = left(trim(p_name), 255),
    updated_at = now()
  where record_id = trim(p_record_id)
    and lower(email) = lower(trim(p_email))
    and status = 'Pending'
    and payment_status = 'Awaiting proof'
    and payment_proof_path is null;

  return found;
end;
$$;

revoke all on function public.attach_payment_proof(text, text, text, text) from public;
grant execute on function public.attach_payment_proof(text, text, text, text) to anon;
