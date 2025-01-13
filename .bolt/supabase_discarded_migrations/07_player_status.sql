-- Create player status history table
create table if not exists public.player_status_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  status text not null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone,
  average_fp numeric(8,2) not null,
  percentile numeric(5,2) not null
);

-- Enable RLS
alter table public.player_status_history enable row level security;

-- Safely handle policies
do $$ 
begin
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'player_status_history'
  ) then
    drop policy if exists "Users can view own status history" on public.player_status_history;
    drop policy if exists "Users can insert own status history" on public.player_status_history;
  end if;
end $$;

-- Create new policies
create policy "Users can view own status history"
  on public.player_status_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert own status history"
  on public.player_status_history for insert
  with check ( auth.uid() = user_id );