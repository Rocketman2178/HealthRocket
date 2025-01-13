-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy to allow public access to profile images
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

-- Create storage policy to allow users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy to allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);