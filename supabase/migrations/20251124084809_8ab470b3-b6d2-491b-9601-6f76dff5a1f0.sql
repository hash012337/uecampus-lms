-- Create lms_guides table for general learning guides (not course-specific)
CREATE TABLE IF NOT EXISTS public.lms_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  guide_type TEXT NOT NULL CHECK (guide_type IN ('video', 'youtube')),
  file_path TEXT,
  youtube_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lms_guides ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Everyone can view
CREATE POLICY "Anyone can view LMS guides"
ON public.lms_guides
FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage
CREATE POLICY "Admins can manage LMS guides"
ON public.lms_guides
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for lms guides
INSERT INTO storage.buckets (id, name, public)
VALUES ('lms-guides', 'lms-guides', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for lms-guides bucket
CREATE POLICY "Admins can upload LMS guides"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lms-guides'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update LMS guides"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'lms-guides'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete LMS guides"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'lms-guides'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Everyone can view LMS guides"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'lms-guides');

-- Add trigger for updated_at
CREATE TRIGGER update_lms_guides_updated_at
BEFORE UPDATE ON public.lms_guides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();