-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Profile images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images' AND
    auth.uid() = owner AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images' AND
    auth.uid() = owner AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images' AND
    auth.uid() = owner AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Add avatar_url column to users table if it doesn't exist
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS avatar_url text;