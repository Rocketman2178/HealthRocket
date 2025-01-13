-- Add email tracking columns to support_messages
ALTER TABLE public.support_messages
ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_sent_at timestamptz,
ADD COLUMN IF NOT EXISTS email_id text;