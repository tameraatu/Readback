-- Readback: projects table (see CLAUDE.md)
-- Run in the Supabase SQL Editor or via `supabase db push`

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text not null,
  figma_url text,
  transcript text not null,
  synthesis jsonb,
  created_at timestamptz not null default now()
);

create index if not exists projects_created_at_idx
  on public.projects (created_at desc);

create index if not exists projects_user_id_idx
  on public.projects (user_id);

alter table public.projects enable row level security;

-- MVP: no auth yet — service role bypasses RLS for API routes.
-- When auth is added, replace with user-scoped policies and remove this policy.
create policy "Allow public read access"
  on public.projects
  for select
  using (true);

create policy "Allow public insert access"
  on public.projects
  for insert
  with check (true);
