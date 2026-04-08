-- Athlete profile completion: photo upload support

alter table public.profiles
  add column if not exists profile_photo_url text;

alter table public.profiles
  drop constraint if exists profiles_photo_url_http;

alter table public.profiles
  add constraint profiles_photo_url_http
  check (
    profile_photo_url is null
    or profile_photo_url like 'http%'
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'athlete-profile-photos',
  'athlete-profile-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "athlete_profile_photos_public_read" on storage.objects;
create policy "athlete_profile_photos_public_read"
on storage.objects
for select
to public
using (bucket_id = 'athlete-profile-photos');

drop policy if exists "athlete_profile_photos_insert_own" on storage.objects;
create policy "athlete_profile_photos_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'athlete-profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "athlete_profile_photos_update_own" on storage.objects;
create policy "athlete_profile_photos_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'athlete-profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'athlete-profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "athlete_profile_photos_delete_own" on storage.objects;
create policy "athlete_profile_photos_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'athlete-profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
