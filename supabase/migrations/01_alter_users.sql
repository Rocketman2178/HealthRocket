-- Safely add new columns to users table
do $$ 
begin
  begin
    alter table public.users 
      add column level integer default 1,
      add column fuel_points integer default 0,
      add column burn_streak integer default 0,
      add column health_score numeric(4,2) default 0,
      add column healthspan_years numeric(4,2) default 0,
      add column lifespan integer default 85,
      add column healthspan integer default 75,
      add column onboarding_completed boolean default false;
  exception 
    when duplicate_column then 
      null;
  end;
end $$;