-- Create challenges table
create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  challenge_id text not null,
  status text not null,
  progress numeric(5,2) default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Enable RLS
alter table public.challenges enable row level security;

-- Safely handle policies
do $$ 
begin
  -- Drop existing policies if they exist
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'challenges'
  ) then
    drop policy if exists "Users can view own challenges" on public.challenges;
    drop policy if exists "Users can insert own challenges" on public.challenges;
    drop policy if exists "Users can update own challenges" on public.challenges;
  end if;
end $$;

-- Create new policies
create policy "Users can view own challenges"
  on public.challenges for select
  using ( auth.uid() = user_id );

create policy "Users can insert own challenges"
  on public.challenges for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own challenges"
  on public.challenges for update
  using ( auth.uid() = user_id );