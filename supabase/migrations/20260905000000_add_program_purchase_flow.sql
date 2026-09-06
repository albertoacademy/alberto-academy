alter table public.students
  add column if not exists payment_status text not null default 'Not required',
  add column if not exists payment_bank text,
  add column if not exists payment_proof_path text,
  add column if not exists payment_proof_name text;

alter table public.students drop constraint if exists students_status_check;
alter table public.students
  add constraint students_status_check
  check (status in ('Pending', 'Active', 'Paused', 'Completed'));

alter table public.students drop constraint if exists students_payment_status_check;
alter table public.students
  add constraint students_payment_status_check
  check (payment_status in ('Not required', 'Awaiting proof', 'Proof submitted', 'Confirmed'));

create or replace function public.submit_program_purchase(
  p_record_id text,
  p_full_name text,
  p_email text,
  p_phone text,
  p_program text,
  p_payment_bank text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_record_id text;
begin
  if trim(p_record_id) !~ '^ST-[A-F0-9]{8}$' then
    raise exception 'A valid enrollment reference is required.';
  end if;

  if char_length(trim(p_full_name)) < 3 or char_length(trim(p_full_name)) > 160 then
    raise exception 'A valid full name is required.';
  end if;

  if char_length(trim(p_email)) < 5 or char_length(trim(p_email)) > 254 or position('@' in p_email) = 0 then
    raise exception 'A valid email address is required.';
  end if;

  if char_length(trim(p_phone)) < 7 or char_length(trim(p_phone)) > 40 then
    raise exception 'A valid WhatsApp number is required.';
  end if;

  if char_length(trim(p_program)) < 2 or char_length(trim(p_program)) > 160 then
    raise exception 'A valid program is required.';
  end if;

  if p_payment_bank is null or p_payment_bank not in ('Banreservas', 'Popular', 'BHD') then
    raise exception 'A valid payment bank is required.';
  end if;

  insert into public.students (
    record_id,
    full_name,
    email,
    phone,
    program,
    status,
    payment_status,
    payment_bank,
    goals,
    notes
  )
  values (
    trim(p_record_id),
    trim(p_full_name),
    lower(trim(p_email)),
    trim(p_phone),
    trim(p_program),
    'Pending',
    'Awaiting proof',
    p_payment_bank,
    null,
    null
  )
  on conflict (record_id) do update set
    full_name = excluded.full_name,
    phone = excluded.phone,
    program = excluded.program,
    payment_bank = excluded.payment_bank,
    updated_at = now()
  where lower(public.students.email) = lower(excluded.email)
    and public.students.status = 'Pending'
    and public.students.payment_status = 'Awaiting proof'
  returning record_id into saved_record_id;

  if saved_record_id is null then
    raise exception 'This enrollment can no longer be changed.';
  end if;

  return saved_record_id;
end;
$$;

revoke all on function public.submit_program_purchase(text, text, text, text, text, text) from public;
grant execute on function public.submit_program_purchase(text, text, text, text, text, text) to anon;

create or replace function public.can_upload_payment_proof(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public, storage
as $$
  select exists (
    select 1
    from public.students
    where record_id = (storage.foldername(object_name))[1]
      and status = 'Pending'
      and payment_status = 'Awaiting proof'
      and payment_proof_path is null
  );
$$;

revoke all on function public.can_upload_payment_proof(text) from public;
grant execute on function public.can_upload_payment_proof(text) to anon;

create or replace function public.attach_payment_proof(
  p_record_id text,
  p_email text,
  p_path text,
  p_name text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_path is null
    or p_path not like trim(p_record_id) || '/%'
    or p_path like '%..%'
    or p_path !~ '^ST-[A-F0-9]{8}/[a-f0-9-]+\.(jpg|png|webp|pdf)$'
  then
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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can upload pending payment proofs" on storage.objects;
create policy "Public can upload pending payment proofs"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'payment-proofs'
  and public.can_upload_payment_proof(name)
);

drop policy if exists "Admins can read payment proofs" on storage.objects;
create policy "Admins can read payment proofs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and public.is_admin()
);
