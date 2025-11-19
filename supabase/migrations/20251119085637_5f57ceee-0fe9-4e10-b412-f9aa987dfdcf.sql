-- Add unique user_id field to profiles table
ALTER TABLE public.profiles ADD COLUMN user_id TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Add comment explaining the field
COMMENT ON COLUMN public.profiles.user_id IS 'Unique identifier for each user (e.g., 001, 002). Once assigned, cannot be reused.';