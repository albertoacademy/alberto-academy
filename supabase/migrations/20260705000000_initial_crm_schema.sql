-- Alberto Academy Supabase schema
-- Run this in Supabase SQL Editor for project rryggmugbpxweqqiceqo.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  record_id text not null unique default ('LD-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  full_name text not null,
  email text not null,
  phone text,
  interest text not null default 'Trial lesson',
  level text not null default 'Not sure' check (level in ('Beginner', 'Intermediate', 'Advanced', 'Not sure')),
  status text not null default 'New' check (status in ('New', 'Contacted', 'Trial booked', 'Won', 'Lost')),
  source text not null default 'Website form',
  submitted_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  record_id text not null unique default ('ST-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  full_name text not null,
  email text not null,
  phone text,
  program text not null default 'Conversation Fluency',
  level text not null default 'Beginner' check (level in ('Beginner', 'Intermediate', 'Advanced')),
  status text not null default 'Active' check (status in ('Active', 'Paused', 'Completed')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  last_session date,
  next_session date,
  goals text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at
before update on public.students
for each row execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.students enable row level security;

drop policy if exists "Public can submit leads" on public.leads;
create policy "Public can submit leads"
on public.leads
for insert
to anon
with check (
  status = 'New'
  and source = 'Website form'
);

drop policy if exists "Authenticated admin can manage leads" on public.leads;
create policy "Authenticated admin can manage leads"
on public.leads
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admin can manage students" on public.students;
create policy "Authenticated admin can manage students"
on public.students
for all
to authenticated
using (true)
with check (true);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists students_created_at_idx on public.students (created_at desc);
create index if not exists students_status_idx on public.students (status);
