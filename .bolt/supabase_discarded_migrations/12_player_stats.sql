-- Add player stats tracking
create table if not exists public.player_stats_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  level integer not null,
  fuel_points integer not null,
  burn_streak integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reason text not null -- e.g., 'boost_completion', 'challenge_completion', 'quest_completion'
);

-- Enable RLS
alter table public.player_stats_history enable row level security;

-- Create policies
create policy "Users can view own stats history"
  on public.player_stats_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert own stats history"
  on public.player_stats_history for insert
  with check ( auth.uid() = user_id );

-- Create function to update user stats
create or replace function public.update_player_stats(
  user_id uuid,
  fp_earned integer,
  reason text
) returns void as $$
declare
  current_fp integer;
  current_level integer;
  next_level_fp integer;
begin
  -- Get current stats
  select level, fuel_points
  into current_level, current_fp
  from public.users
  where id = user_id;

  -- Calculate next level FP requirement (20% increase per level)
  next_level_fp := 1000 * power(1.2, current_level - 1);

  -- Add earned FP
  current_fp := current_fp + fp_earned;

  -- Check for level up
  while current_fp >= next_level_fp loop
    current_level := current_level + 1;
    current_fp := current_fp - next_level_fp;
    next_level_fp := 1000 * power(1.2, current_level - 1);
  end loop;

  -- Update user stats
  update public.users
  set 
    level = current_level,
    fuel_points = current_fp
  where id = user_id;

  -- Record stats change
  insert into public.player_stats_history (
    user_id,
    level,
    fuel_points,
    burn_streak,
    reason
  )
  select 
    user_id,
    current_level,
    current_fp,
    burn_streak,
    reason
  from public.users
  where id = user_id;
end;
$$ language plpgsql security definer;