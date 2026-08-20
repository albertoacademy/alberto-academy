# Alberto Academy Supabase Workflow

This project uses Supabase CLI migrations for the CRM backend.

## CLI

Use the official npm execution path:

```powershell
npx supabase@latest --version
```

Set a Supabase account access token only for the current PowerShell session:

```powershell
$env:SUPABASE_ACCESS_TOKEN="sbp_your_real_access_token"
```

## Remote Project

Project ref:

```text
rryggmugbpxweqqiceqo
```

Link this repo to the remote project:

```powershell
npx supabase@latest link --project-ref rryggmugbpxweqqiceqo
```

Push migrations:

```powershell
npx supabase@latest db push
```

If the CLI asks for the database password, use the database password from Supabase project settings.

## Vercel Environment

```text
NEXT_PUBLIC_SUPABASE_URL=https://rryggmugbpxweqqiceqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

## Migrations

The initial CRM schema lives in:

```text
supabase/migrations/20260705000000_initial_crm_schema.sql
```

The migration creates:

- `public.leads`
- `public.students`
- row-level security policies
