/*
  # Player Guide System Schema

  1. New Tables
    - `guide_conversations` - Store chat history and interactions
    - `guide_templates` - Store response templates and recommendations
    - `user_feedback` - Track user feedback and suggestions
    - `user_metrics` - Track detailed player progress metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for user-specific access
    - Secure feedback submissions
*/

-- Create guide_conversations table
CREATE TABLE IF NOT EXISTS public.guide_conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    message text NOT NULL,
    is_user_message boolean DEFAULT true,
    context jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    category text,
    resolved boolean DEFAULT false,
    resolved_at timestamptz
);

-- Create guide_templates table
CREATE TABLE IF NOT EXISTS public.guide_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category text NOT NULL,
    trigger_condition text NOT NULL,
    template text NOT NULL,
    context_required jsonb DEFAULT '[]'::jsonb,
    priority integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_feedback table
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    category text NOT NULL,
    feedback text NOT NULL,
    rating integer CHECK (rating BETWEEN 1 AND 5),
    context jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    resolved boolean DEFAULT false,
    resolved_at timestamptz,
    resolution_notes text
);

-- Create user_metrics table
CREATE TABLE IF NOT EXISTS public.user_metrics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    metric_type text NOT NULL,
    metric_value jsonb NOT NULL,
    recorded_at timestamptz DEFAULT now() NOT NULL,
    context jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.guide_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_guide_conversations_user ON public.guide_conversations(user_id);
CREATE INDEX idx_guide_templates_category ON public.guide_templates(category);
CREATE INDEX idx_user_feedback_user ON public.user_feedback(user_id);
CREATE INDEX idx_user_metrics_user_type ON public.user_metrics(user_id, metric_type);

-- Create RLS policies
CREATE POLICY "Users can view their own conversations"
ON public.guide_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
ON public.guide_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view guide templates"
ON public.guide_templates FOR SELECT
USING (true);

CREATE POLICY "Users can submit their own feedback"
ON public.user_feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
ON public.user_feedback FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own metrics"
ON public.user_metrics FOR SELECT
USING (auth.uid() = user_id);

-- Create function to get user's recent conversations
CREATE OR REPLACE FUNCTION get_recent_conversations(p_user_id uuid, p_limit integer DEFAULT 10)
RETURNS TABLE (
    id uuid,
    message text,
    is_user_message boolean,
    context jsonb,
    created_at timestamptz,
    category text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        id,
        message,
        is_user_message,
        context,
        created_at,
        category
    FROM guide_conversations
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT p_limit;
$$;

-- Create function to submit user feedback
CREATE OR REPLACE FUNCTION submit_user_feedback(
    p_user_id uuid,
    p_category text,
    p_feedback text,
    p_rating integer,
    p_context jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_feedback_id uuid;
BEGIN
    -- Verify user permissions
    IF auth.uid() != p_user_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
    END IF;

    -- Insert feedback
    INSERT INTO user_feedback (
        user_id,
        category,
        feedback,
        rating,
        context
    )
    VALUES (
        p_user_id,
        p_category,
        p_feedback,
        p_rating,
        p_context
    )
    RETURNING id INTO v_feedback_id;

    RETURN jsonb_build_object(
        'success', true,
        'feedback_id', v_feedback_id
    );
END;
$$;