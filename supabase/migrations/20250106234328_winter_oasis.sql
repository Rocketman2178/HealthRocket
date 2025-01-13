-- Drop old chat-related tables
DROP TABLE IF EXISTS public.challenge_messages CASCADE;
DROP TABLE IF EXISTS public.user_message_reads CASCADE;
DROP TABLE IF EXISTS public.verification_posts CASCADE;

-- Drop old functions
DROP FUNCTION IF EXISTS get_unread_message_count(uuid, text, text);
DROP FUNCTION IF EXISTS handle_verification_post(text, uuid, uuid);
DROP FUNCTION IF EXISTS increment_verification_count();