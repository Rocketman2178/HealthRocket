-- Add healthspan gap column to users table
alter table public.users
  add column if not exists healthspan_gap integer 
  generated always as (healthspan - lifespan) stored;

-- Add healthspan tracking columns to health assessments
alter table public.health_assessments
  add column if not exists previous_healthspan integer,
  add column if not exists healthspan_change integer
  generated always as (expected_healthspan - previous_healthspan) stored;

-- Create function to update healthspan tracking
create or replace function public.update_healthspan_tracking()
returns trigger
security definer
set search_path = public
as $$
declare
  last_assessment record;
begin
  -- Get the previous assessment for this user
  select expected_healthspan
  into last_assessment
  from public.health_assessments
  where user_id = new.user_id
  order by created_at desc
  limit 1;

  -- Set previous healthspan
  if last_assessment is not null then
    new.previous_healthspan := last_assessment.expected_healthspan;
  end if;

  return new;
end;
$$ language plpgsql;

-- Create trigger for healthspan tracking
drop trigger if exists on_health_assessment_insert on public.health_assessments;
create trigger on_health_assessment_insert
  before insert on public.health_assessments
  for each row execute procedure public.update_healthspan_tracking();