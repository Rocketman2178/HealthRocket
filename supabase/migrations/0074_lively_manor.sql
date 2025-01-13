-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own read status" ON public.user_message_reads;
DROP POLICY IF EXISTS "Users can update their own read status" ON public.user_message_reads;

-- Create policies with unique names
CREATE POLICY "message_reads_select_policy"
ON public.user_message_reads
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "message_reads_insert_policy"
ON public.user_message_reads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "message_reads_update_policy"
ON public.user_message_reads
FOR UPDATE
USING (auth.uid() = user_id);