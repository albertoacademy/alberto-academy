-- Remove the original UI-preview records without touching real CRM data.
delete from public.leads
where record_id in (
  'LD-001',
  'LD-002',
  'LD-003',
  'LD-004',
  'LD-005',
  'LD-006',
  'LD-007',
  'LD-008',
  'LD-009',
  'LD-010'
);

delete from public.students
where record_id in (
  'ST-001',
  'ST-002',
  'ST-003',
  'ST-004',
  'ST-005',
  'ST-006',
  'ST-007',
  'ST-008',
  'ST-009',
  'ST-010'
);
