-- Enable storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create storage bucket for profile images if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM storage.buckets WHERE id = 'profile-images'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('profile-images', 'profile-images', true);
    END IF;
END $$;

-- Ensure storage policies exist
DO $$
BEGIN
    -- Upload policy
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can upload their own avatar'
    ) THEN
        CREATE POLICY "Users can upload their own avatar"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'profile-images' AND 
            (storage.foldername(name))[1] = auth.uid()::text
        );
    END IF;

    -- Public access policy
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Profile images are publicly accessible'
    ) THEN
        CREATE POLICY "Profile images are publicly accessible"
        ON storage.objects
        FOR SELECT
        TO public
        USING (bucket_id = 'profile-images');
    END IF;

    -- Update policy
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can update their own images'
    ) THEN
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
    END IF;

    -- Delete policy
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can delete their own images'
    ) THEN
        CREATE POLICY "Users can delete their own images"
        ON storage.objects
        FOR DELETE
        TO authenticated
        USING (
            bucket_id = 'profile-images' AND 
            (storage.foldername(name))[1] = auth.uid()::text
        );
    END IF;
END $$;