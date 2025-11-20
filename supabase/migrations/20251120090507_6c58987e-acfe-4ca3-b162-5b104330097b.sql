-- Create course_sections table for organizing course content
CREATE TABLE IF NOT EXISTS public.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_materials table for uploaded files
CREATE TABLE IF NOT EXISTS public.course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assignment_submissions table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_path TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  marks_obtained NUMERIC,
  feedback TEXT,
  status TEXT DEFAULT 'submitted',
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID
);

-- Add quiz_url field to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS quiz_url TEXT;

-- Add unit_name to assignments table
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS unit_name TEXT;

-- Enable RLS
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_sections
CREATE POLICY "Everyone can view course sections"
ON public.course_sections FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage course sections"
ON public.course_sections FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for course_materials
CREATE POLICY "Enrolled users can view course materials"
ON public.course_materials FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE enrollments.user_id = auth.uid()
    AND enrollments.course_id = course_materials.course_id
    AND enrollments.status = 'active'
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage course materials"
ON public.course_materials FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for assignment_submissions
CREATE POLICY "Users can view their own submissions"
ON public.assignment_submissions FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own submissions"
ON public.assignment_submissions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all submissions"
ON public.assignment_submissions FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at triggers
CREATE TRIGGER update_course_sections_updated_at
BEFORE UPDATE ON public.course_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_materials_updated_at
BEFORE UPDATE ON public.course_materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-materials', 'course-materials', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for course materials
CREATE POLICY "Enrolled users can view course materials files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'course-materials' AND (
    EXISTS (
      SELECT 1 FROM public.course_materials cm
      JOIN public.enrollments e ON e.course_id = cm.course_id
      WHERE cm.file_path = name
      AND e.user_id = auth.uid()
      AND e.status = 'active'
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Admins can upload course materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-materials' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete course materials"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-materials' AND has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for assignment submissions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assignment-submissions', 'assignment-submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for assignment submissions
CREATE POLICY "Users can upload their own assignment submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assignment-submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users and admins can view assignment submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignment-submissions' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);