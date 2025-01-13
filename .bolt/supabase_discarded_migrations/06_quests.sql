-- Create quests table to track active and completed quests
create table if not exists public.quests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  quest_id text not null,
  status text not null,
  progress numeric(5,2) default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Enable RLS
alter table public.quests enable row level security;

-- Create new policies
create policy "Users can view own quests"
  on public.quests for select
  using ( auth.uid() = user_id );

create policy "Users can insert own quests"
  on public.quests for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own quests"
  on public.quests for update
  using ( auth.uid() = user_id );