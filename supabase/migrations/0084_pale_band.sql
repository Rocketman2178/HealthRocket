-- Create challenge-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('challenge-media', 'challenge-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for challenge-media bucket
CREATE POLICY "Users can upload challenge media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'challenge-media' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Challenge media is publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'challenge-media');

CREATE POLICY "Users can update their challenge media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'challenge-media' AND 
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'challenge-media' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their challenge media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'challenge-media' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);