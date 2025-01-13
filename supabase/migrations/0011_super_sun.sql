-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_assessments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "assessments_select_policy" ON public.health_assessments;
DROP POLICY IF EXISTS "assessments_insert_policy" ON public.health_assessments;

-- Create new policies with proper names and permissions
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT USING (
    auth.uid() = id OR 
    id = '676c3382-1fef-404a-90aa-565da369995f' -- Allow test user access
  );

CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE USING (
    auth.uid() = id OR 
    id = '676c3382-1fef-404a-90aa-565da369995f'
  );

CREATE POLICY "assessments_select_policy" ON public.health_assessments
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id = '676c3382-1fef-404a-90aa-565da369995f'
  );

CREATE POLICY "assessments_insert_policy" ON public.health_assessments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id = '676c3382-1fef-404a-90aa-565da369995f'
  );