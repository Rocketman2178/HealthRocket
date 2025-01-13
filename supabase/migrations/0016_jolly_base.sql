/*
  # Create Activity Tables
  
  1. New Tables
    - completed_boosts: Track completed daily boosts
    - player_status_history: Track player status changes
    - storage_objects: Handle file uploads
  
  2. Security
    - Enable RLS on all tables
    - Add policies for user access
    - Add test user access
*/

-- Create completed_boosts table
CREATE TABLE IF NOT EXISTS public.completed_boosts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  boost_id text NOT NULL,
  completed_at timestamptz DEFAULT now() NOT NULL,
  completed_date date DEFAULT CURRENT_DATE NOT NULL,
  UNIQUE(user_id, boost_id, completed_date)
);

-- Create player_status_history table
CREATE TABLE IF NOT EXISTS public.player_status_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  started_at timestamptz DEFAULT now() NOT NULL,
  ended_at timestamptz,
  average_fp numeric(8,2) NOT NULL,
  percentile numeric(5,2) NOT NULL,
  rank integer NOT NULL
);

-- Create storage_objects table
CREATE TABLE IF NOT EXISTS public.storage_objects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  bucket text NOT NULL,
  path text NOT NULL,
  size integer NOT NULL,
  mime_type text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(bucket, path)
);

-- Enable RLS
ALTER TABLE public.completed_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_objects ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS completed_boosts_user_date_idx ON public.completed_boosts(user_id, completed_date);
CREATE INDEX IF NOT EXISTS player_status_user_idx ON public.player_status_history(user_id);
CREATE INDEX IF NOT EXISTS storage_objects_user_idx ON public.storage_objects(user_id);

-- Create RLS policies
DO $$ 
BEGIN
  -- Completed boosts policies
  CREATE POLICY "completed_boosts_select_policy" ON public.completed_boosts
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "completed_boosts_insert_policy" ON public.completed_boosts
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');

  -- Player status history policies  
  CREATE POLICY "player_status_select_policy" ON public.player_status_history
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "player_status_insert_policy" ON public.player_status_history
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');

  -- Storage objects policies
  CREATE POLICY "storage_objects_select_policy" ON public.storage_objects
    FOR SELECT USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "storage_objects_insert_policy" ON public.storage_objects
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "storage_objects_update_policy" ON public.storage_objects
    FOR UPDATE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
    
  CREATE POLICY "storage_objects_delete_policy" ON public.storage_objects
    FOR DELETE USING (auth.uid() = user_id OR user_id = '676c3382-1fef-404a-90aa-565da369995f');
END $$;