-- Create course_books table for course-specific books
CREATE TABLE IF NOT EXISTS public.course_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  cover_image_url TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_guides table for course-specific learning guides
CREATE TABLE IF NOT EXISTS public.course_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  guide_type TEXT NOT NULL CHECK (guide_type IN ('video', 'youtube', 'article')),
  file_path TEXT, -- for uploaded videos
  youtube_url TEXT, -- for YouTube links
  thumbnail_url TEXT,
  duration INTEGER, -- in minutes
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_guides ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_books
CREATE POLICY "Admins can manage course books"
ON public.course_books
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Enrolled users can view course books"
ON public.course_books
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE enrollments.user_id = auth.uid()
    AND enrollments.course_id = course_books.course_id
    AND enrollments.status = 'active'
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for course_guides
CREATE POLICY "Admins can manage course guides"
ON public.course_guides
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Enrolled users can view course guides"
ON public.course_guides
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE enrollments.user_id = auth.uid()
    AND enrollments.course_id = course_guides.course_id
    AND enrollments.status = 'active'
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create storage bucket for course books
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-books', 'course-books', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for course guides
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-guides', 'course-guides', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for course-books bucket
CREATE POLICY "Admins can upload course books"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-books'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update course books"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-books'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete course books"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-books'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Enrolled users can view course books"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'course-books');

-- RLS policies for course-guides bucket
CREATE POLICY "Admins can upload course guides"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-guides'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update course guides"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-guides'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete course guides"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-guides'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Enrolled users can view course guides"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'course-guides');

-- Add triggers for updated_at
CREATE TRIGGER update_course_books_updated_at
BEFORE UPDATE ON public.course_books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_guides_updated_at
BEFORE UPDATE ON public.course_guides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();