-- Create 'avatars' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Fix for "null value in column id" error
-- Ensure onboarding_submissions table generates UUIDs automatically
ALTER TABLE public.onboarding_submissions 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Create 'documents' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Policy: Allow public read access to avatars
create policy "Public Access to Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy: Allow authenticated users to upload avatars
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Policy: Allow public read access to documents (Required for getPublicUrl in current implementation)
-- NOTE: In a production environment with sensitive data, you should use private buckets and createSignedUrl instead.
create policy "Public Access to Documents"
  on storage.objects for select
  using ( bucket_id = 'documents' );

-- Policy: Allow authenticated users to upload documents
create policy "Authenticated users can upload documents"
  on storage.objects for insert
  with check ( bucket_id = 'documents' and auth.role() = 'authenticated' );
