-- Run once in Supabase SQL Editor. Every app table is private to its owner.
create extension if not exists pgcrypto;

create table if not exists public.courses (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 code text not null, name text not null, color text not null default '#c9e4f7', created_at timestamptz not null default now(),
 unique(user_id,code)
);
create table if not exists public.organizer_settings (
 user_id uuid primary key references auth.users(id) on delete cascade,
 initialized boolean not null default false
);
create table if not exists public.class_sessions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 course_id uuid not null references public.courses(id) on delete cascade,
 day_of_week int not null check(day_of_week between 1 and 7),
 start_time time not null, end_time time not null, venue text not null default '', note text not null default '',
 created_at timestamptz not null default now(), check(end_time > start_time)
);
create table if not exists public.tasks (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 course_id uuid references public.courses(id) on delete set null,
 title text not null, kind text not null check(kind in ('task','assignment')),
 due_date date not null, notes text not null default '', completed boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.events (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 course_id uuid references public.courses(id) on delete set null,
 title text not null, kind text not null check(kind in ('meeting','exam')),
 starts_at timestamptz not null, venue text not null default '', notes text not null default '',
 completed boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.reminder_deliveries (
 id uuid primary key default gen_random_uuid(), event_id uuid not null references public.events(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 milestone_hours int not null, sent_at timestamptz,
 unique(event_id,milestone_hours)
);

-- Validate ownership of linked courses even if a client supplies another user's UUID.
create or replace function public.check_owned_course() returns trigger language plpgsql set search_path = public as $$
begin
 if new.course_id is not null and not exists
   (select 1 from public.courses where id = new.course_id and user_id = new.user_id) then
   raise exception 'Course does not belong to this account';
 end if;
 return new;
end $$;
drop trigger if exists class_course_owner on public.class_sessions;
create trigger class_course_owner before insert or update on public.class_sessions for each row execute function public.check_owned_course();
drop trigger if exists task_course_owner on public.tasks;
create trigger task_course_owner before insert or update on public.tasks for each row execute function public.check_owned_course();
drop trigger if exists event_course_owner on public.events;
create trigger event_course_owner before insert or update on public.events for each row execute function public.check_owned_course();

alter table public.courses enable row level security;
alter table public.organizer_settings enable row level security;
alter table public.class_sessions enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.reminder_deliveries enable row level security;
drop policy if exists own_courses on public.courses;
create policy own_courses on public.courses for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists own_settings on public.organizer_settings;
create policy own_settings on public.organizer_settings for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists own_classes on public.class_sessions;
create policy own_classes on public.class_sessions for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists own_tasks on public.tasks;
create policy own_tasks on public.tasks for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists own_events on public.events;
create policy own_events on public.events for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
-- Reminder delivery receipts are server-only (service role bypasses RLS).
create index if not exists tasks_user_due on public.tasks(user_id,due_date);
create index if not exists events_user_start on public.events(user_id,starts_at);
create index if not exists sessions_user_day on public.class_sessions(user_id,day_of_week);

create or replace function public.reset_event_reminders() returns trigger language plpgsql set search_path = public as $$
begin
 if new.starts_at is distinct from old.starts_at then
  delete from public.reminder_deliveries where event_id = new.id;
 end if;
 return new;
end $$;
drop trigger if exists event_rescheduled on public.events;
create trigger event_rescheduled after update on public.events for each row execute function public.reset_event_reminders();

-- Realtime reload after writes made on another device.
do $$ begin
 alter publication supabase_realtime add table public.courses,public.class_sessions,public.tasks,public.events;
exception when duplicate_object then null; end $$;
