-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own read status" ON public.message_read_status;
DROP POLICY IF EXISTS "Users can update their own read status" ON public.message_read_status;

-- Create policies with unique names
CREATE POLICY "message_read_select_policy"
ON public.message_read_status
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "message_read_insert_policy"
ON public.message_read_status
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "message_read_update_policy"
ON public.message_read_status
FOR UPDATE
USING (auth.uid() = user_id);