-- ============================================================
-- 100 DAY CHALLENGE — schema
-- Run once in the Supabase SQL editor.
--
-- Authorization model:
--   PUBLIC (anon key)  -> SELECT only, and only rows that are published
--   ADMIN  (service key, server-side only) -> full read/write
-- Row Level Security enforces this at the database layer, so a leaked
-- anon key still cannot write or read unpublished drafts.
-- ============================================================

-- ---------- daily entries ----------
create table if not exists challenge_days (
  id                  uuid primary key default gen_random_uuid(),
  day_number          int  not null unique check (day_number >= 1),
  date                date not null unique,

  weight_kg           numeric(5,2),          -- null = not recorded that day
  steps               int check (steps >= 0),

  steps_goal_met      boolean not null default false,
  workout_completed   boolean not null default false,
  cardio_completed    boolean not null default false,
  water_completed     boolean not null default false,
  food_completed      boolean not null default false,
  research_completed  boolean not null default false,

  applications_count  int not null default 0 check (applications_count >= 0),

  image1_url          text,
  image2_url          text,
  image3_url          text,
  progress_photo_url  text,                  -- optional, separate from the 3 daily images

  notes               text,

  published           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  published_at        timestamptz
);

create index if not exists challenge_days_day_number_idx on challenge_days (day_number);
create index if not exists challenge_days_date_idx on challenge_days (date);

-- ---------- challenge configuration (single row) ----------
create table if not exists challenge_config (
  id                 int primary key default 1 check (id = 1),
  challenge_length   int  not null default 100,
  steps_goal         int  not null default 10000,
  applications_goal  int  not null default 50,
  start_date         date,            -- null until the owner configures it
  starting_weight_kg numeric(5,2),
  goal_weight_kg     numeric(5,2),
  title              text not null default '100 Day Challenge',
  intro              text,
  updated_at         timestamptz not null default now()
);

insert into challenge_config (id) values (1) on conflict (id) do nothing;

-- ---------- updated_at trigger ----------
create or replace function challenge_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists challenge_days_touch on challenge_days;
create trigger challenge_days_touch before update on challenge_days
  for each row execute function challenge_touch_updated_at();

drop trigger if exists challenge_config_touch on challenge_config;
create trigger challenge_config_touch before update on challenge_config
  for each row execute function challenge_touch_updated_at();

-- ---------- Row Level Security ----------
alter table challenge_days   enable row level security;
alter table challenge_config enable row level security;

-- Public may read published days only.
drop policy if exists "public reads published days" on challenge_days;
create policy "public reads published days" on challenge_days
  for select using (published = true);

-- Public may read the config.
drop policy if exists "public reads config" on challenge_config;
create policy "public reads config" on challenge_config
  for select using (true);

-- No insert/update/delete policies exist for anon or authenticated roles,
-- so RLS denies every write from the client. Writes are performed only by
-- the service-role key from server route handlers, which bypasses RLS.

-- ---------- Storage bucket ----------
-- Create a PUBLIC bucket named "challenge" in the Supabase dashboard
-- (Storage -> New bucket -> name: challenge, Public: on).
-- Uploads happen server-side with the service-role key; public read is
-- what makes the images load without auth.
