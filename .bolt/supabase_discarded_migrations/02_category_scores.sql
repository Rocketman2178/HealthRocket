-- Create category scores table
create table if not exists public.category_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  mindset_score numeric(4,2) default 5,
  sleep_score numeric(4,2) default 5,
  exercise_score numeric(4,2) default 5,
  nutrition_score numeric(4,2) default 5,
  biohacking_score numeric(4,2) default 5
);

-- Enable RLS
alter table public.category_scores enable row level security;

-- Safely handle policies
do $$ 
begin
  -- Drop existing policies if they exist
  if exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'category_scores'
  ) then
    drop policy if exists "Users can view own scores" on public.category_scores;
    drop policy if exists "Users can insert own scores" on public.category_scores;
  end if;
end $$;

-- Create new policies
create policy "Users can view own scores"
  on public.category_scores for select
  using ( auth.uid() = user_id );

create policy "Users can insert own scores"
  on public.category_scores for insert
  with check ( auth.uid() = user_id );