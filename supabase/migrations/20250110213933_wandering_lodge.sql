-- Create support messages table
CREATE TABLE IF NOT EXISTS public.support_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    user_name text NOT NULL,
    user_email text NOT NULL,
    message text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    resolved boolean DEFAULT false,
    resolved_at timestamptz,
    resolved_by text,
    resolution_notes text,
    email_sent boolean DEFAULT false,
    email_sent_at timestamptz,
    email_id text
);

-- Enable RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own support messages"
ON public.support_messages
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create support messages"
ON public.support_messages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to submit support message
CREATE OR REPLACE FUNCTION submit_support_message(
    p_user_id uuid,
    p_message text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_name text;
    v_user_email text;
    v_message_id uuid;
BEGIN
    -- Get user details
    SELECT name, email INTO v_user_name, v_user_email
    FROM users
    WHERE id = p_user_id;

    -- Insert support message
    INSERT INTO support_messages (
        user_id,
        user_name,
        user_email,
        message
    ) VALUES (
        p_user_id,
        v_user_name,
        v_user_email,
        p_message
    )
    RETURNING id INTO v_message_id;

    -- Return success response with message ID
    -- Edge function will handle email sending
    RETURN jsonb_build_object(
        'success', true,
        'message_id', v_message_id
    );
END;
$$;