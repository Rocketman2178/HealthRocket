-- Create health assessments table
create table if not exists public.health_assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expected_lifespan integer not null,
  expected_healthspan integer not null,
  health_score numeric(4,2) not null,
  healthspan_years numeric(4,2) not null,
  mindset_score numeric(4,2) not null,
  sleep_score numeric(4,2) not null,
  exercise_score numeric(4,2) not null,
  nutrition_score numeric(4,2) not null,
  biohacking_score numeric(4,2) not null
);

-- Enable RLS
alter table public.health_assessments enable row level security;

-- Safely handle policies
do $$ 
begin
  -- Drop existing policies if they exist
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'health_assessments'
  ) then
    drop policy if exists "Users can view own assessments" on public.health_assessments;
    drop policy if exists "Users can insert own assessments" on public.health_assessments;
  end if;
end $$;

-- Create new policies
create policy "Users can view own assessments"
  on public.health_assessments for select
  using ( auth.uid() = user_id );

create policy "Users can insert own assessments"
  on public.health_assessments for insert
  with check ( auth.uid() = user_id );