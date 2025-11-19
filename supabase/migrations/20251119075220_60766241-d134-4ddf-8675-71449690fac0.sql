-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create RLS policies for avatar uploads
CREATE POLICY "Users can view all avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update profiles table RLS to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (id = auth.uid());

-- Create timetable table for scheduling
CREATE TABLE public.timetable (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  instructor TEXT,
  room TEXT,
  color TEXT DEFAULT '#8B5CF6',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on timetable
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for timetable
CREATE POLICY "Users can view their own timetable"
ON public.timetable
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own timetable entries"
ON public.timetable
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own timetable entries"
ON public.timetable
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own timetable entries"
ON public.timetable
FOR DELETE
USING (user_id = auth.uid());

-- Admins can manage all timetable entries
CREATE POLICY "Admins can view all timetable"
ON public.timetable
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert all timetable"
ON public.timetable
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all timetable"
ON public.timetable
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all timetable"
ON public.timetable
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at on timetable
CREATE TRIGGER update_timetable_updated_at
BEFORE UPDATE ON public.timetable
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();