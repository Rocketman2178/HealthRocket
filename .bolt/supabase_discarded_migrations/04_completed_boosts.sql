-- Create completed boosts table
create table if not exists public.completed_boosts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  boost_id text not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_date date default current_date not null
);

-- Add unique constraint for one boost per user per day
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'unique_daily_boost'
  ) then
    alter table public.completed_boosts
      add constraint unique_daily_boost unique (user_id, boost_id, completed_date);
  end if;
end $$;

-- Enable RLS
alter table public.completed_boosts enable row level security;

-- Safely handle policies
do $$ 
begin
  -- Drop existing policies if they exist
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'completed_boosts'
  ) then
    drop policy if exists "Users can view own completed boosts" on public.completed_boosts;
    drop policy if exists "Users can insert own completed boosts" on public.completed_boosts;
  end if;
end $$;

-- Create new policies
create policy "Users can view own completed boosts"
  on public.completed_boosts for select
  using ( auth.uid() = user_id );

create policy "Users can insert own completed boosts"
  on public.completed_boosts for insert
  with check ( auth.uid() = user_id );