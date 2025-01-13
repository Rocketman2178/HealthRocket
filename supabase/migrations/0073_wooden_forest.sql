-- Create user_message_reads table to track last read timestamps
CREATE TABLE IF NOT EXISTS public.user_message_reads (
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    challenge_id text NOT NULL,
    last_read_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.user_message_reads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own read status"
ON public.user_message_reads
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own read status"
ON public.user_message_reads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own read status"
ON public.user_message_reads
FOR UPDATE
USING (auth.uid() = user_id);