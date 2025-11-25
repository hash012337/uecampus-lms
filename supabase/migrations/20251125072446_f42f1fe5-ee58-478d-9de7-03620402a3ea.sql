-- Drop existing foreign key from enrollments.user_id to auth.users
ALTER TABLE public.enrollments
DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey;

-- Add new foreign key from enrollments.user_id to profiles.id
ALTER TABLE public.enrollments
ADD CONSTRAINT enrollments_user_id_profiles_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;