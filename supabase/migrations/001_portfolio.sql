-- Portfolio schema for Supabase
-- Run in: Supabase Dashboard → SQL Editor → New query → Run

create table if not exists public.cms_docs (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  name text not null default '',
  email text not null default '',
  note text not null default ''
);

create table if not exists public.submissions (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  type text not null,
  name text not null default '',
  email text not null default '',
  message text not null default ''
);

create table if not exists public.visitors (
  email text primary key,
  name text not null default '',
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  visits integer not null default 1
);

create table if not exists public.site_hits (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  day date not null,
  visitor_id text not null,
  path text not null default '/'
);

create index if not exists idx_site_hits_day on public.site_hits (day);
create index if not exists idx_site_hits_visitor on public.site_hits (visitor_id);
create index if not exists idx_leads_at on public.leads (at desc);
create index if not exists idx_submissions_at on public.submissions (at desc);

-- App uses the publishable key from Next.js API routes (admin password-gated).
-- Tighten these later if you move admin to Supabase Auth.
alter table public.cms_docs enable row level security;
alter table public.leads enable row level security;
alter table public.submissions enable row level security;
alter table public.visitors enable row level security;
alter table public.site_hits enable row level security;

drop policy if exists "cms_docs_all" on public.cms_docs;
create policy "cms_docs_all" on public.cms_docs for all using (true) with check (true);

drop policy if exists "leads_all" on public.leads;
create policy "leads_all" on public.leads for all using (true) with check (true);

drop policy if exists "submissions_all" on public.submissions;
create policy "submissions_all" on public.submissions for all using (true) with check (true);

drop policy if exists "visitors_all" on public.visitors;
create policy "visitors_all" on public.visitors for all using (true) with check (true);

drop policy if exists "site_hits_all" on public.site_hits;
create policy "site_hits_all" on public.site_hits for all using (true) with check (true);
