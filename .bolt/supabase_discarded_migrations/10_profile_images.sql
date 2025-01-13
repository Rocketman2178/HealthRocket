-- Add profile image URL to users table
alter table public.users
  add column if not exists avatar_url text;

-- Enable storage bucket for profile images
insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

-- Create storage policy for authenticated users
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'profile-images' );

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-images' AND
    auth.uid() = owner
  );