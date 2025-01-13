-- Update Clay Speakman's stats (90@gmail.com)
update public.users
set 
  level = 3,
  fuel_points = 820,
  burn_streak = 5
where email = '90@gmail.com';

-- Record stats update in history
insert into public.player_stats_history (
  user_id,
  level,
  fuel_points,
  burn_streak,
  reason
)
select 
  id,
  3,
  820,
  5,
  'manual_update'
from public.users
where email = '90@gmail.com';