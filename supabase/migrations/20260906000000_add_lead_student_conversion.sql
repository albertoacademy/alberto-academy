create or replace function public.convert_lead_to_student(p_lead_record_id text)
returns setof public.students
language plpgsql
security definer
set search_path = public
as $$
declare
  source_lead public.leads%rowtype;
  converted_student public.students%rowtype;
  student_program text;
  student_goals text;
  student_notes text;
begin
  if not public.is_admin() then
    raise exception 'Only Alberto Academy administrators can convert leads.';
  end if;

  select *
  into source_lead
  from public.leads
  where record_id = trim(p_lead_record_id)
  for update;

  if not found then
    raise exception 'This lead no longer exists.';
  end if;

  if exists (
    select 1
    from public.students
    where lower(email) = lower(source_lead.email)
  ) then
    raise exception 'A student with this email address already exists.';
  end if;

  student_program := case source_lead.interest
    when 'Programa de inglés por niveles' then 'Programa por niveles'
    when 'Spanish program by level' then 'Programa por niveles'
    when 'Clases individuales' then 'Clases privadas'
    when 'Clases privadas de inglés' then 'Clases privadas'
    when 'Private Spanish lessons' then 'Clases privadas'
    when 'Clases grupales de inglés' then 'Clases grupales'
    when 'Group Spanish lessons' then 'Clases grupales'
    when 'Tutoría personalizada' then 'Tutorías personalizadas'
    when 'Personalized tutoring' then 'Tutorías personalizadas'
    when 'Personalized Spanish tutoring' then 'Tutorías personalizadas'
    when 'Preparación para entrevistas o exámenes' then 'Coaching especializado'
    when 'Spanish for work, travel, or relocation' then 'Coaching especializado'
    when 'Specialized Spanish coaching' then 'Coaching especializado'
    when 'English instruction' then 'Español para extranjeros / English instruction'
    when 'Español para extranjeros' then 'Español para extranjeros / English instruction'
    else source_lead.interest
  end;

  student_goals := case
    when source_lead.level = 'Not sure'
      then format('Confirm the starting level for %s.', student_program)
    else format('Begin %s at the %s level.', student_program, source_lead.level)
  end;

  student_notes := concat_ws(
    E'\n\n',
    nullif(trim(source_lead.notes), ''),
    format(
      'Converted from lead %s. Original source: %s. Lead submitted: %s. Initial level: %s.',
      source_lead.record_id,
      source_lead.source,
      source_lead.submitted_at,
      source_lead.level
    )
  );

  insert into public.students (
    full_name,
    email,
    phone,
    program,
    level,
    status,
    payment_status,
    goals,
    notes
  )
  values (
    source_lead.full_name,
    source_lead.email,
    source_lead.phone,
    student_program,
    case
      when source_lead.level in ('Beginner', 'Intermediate', 'Advanced') then source_lead.level
      else 'Beginner'
    end,
    'Active',
    'Not required',
    student_goals,
    student_notes
  )
  returning * into converted_student;

  delete from public.leads
  where id = source_lead.id;

  return next converted_student;
end;
$$;

revoke all on function public.convert_lead_to_student(text) from public;
grant execute on function public.convert_lead_to_student(text) to authenticated;
