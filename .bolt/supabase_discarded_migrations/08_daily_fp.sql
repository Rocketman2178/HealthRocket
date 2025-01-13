-- Create daily fuel points tracking table
create table if not exists public.daily_fp (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  date date not null,
  fp_earned integer not null default 0,
  boosts_completed integer not null default 0,
  challenges_completed integer not null default 0,
  quests_completed integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_daily_fp unique (user_id, date)
);

-- Enable RLS
alter table public.daily_fp enable row level security;

-- Safely handle policies
do $$ 
begin
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'daily_fp'
  ) then
    drop policy if exists "Users can view own daily fp" on public.daily_fp;
    drop policy if exists "Users can insert own daily fp" on public.daily_fp;
    drop policy if exists "Users can update own daily fp" on public.daily_fp;
  end if;
end $$;

-- Create new policies
create policy "Users can view own daily fp"
  on public.daily_fp for select
  using ( auth.uid() = user_id );

create policy "Users can insert own daily fp"
  on public.daily_fp for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own daily fp"
  on public.daily_fp for update
  using ( auth.uid() = user_id );