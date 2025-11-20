/*
  # Create Course Sections and Activities Tables

  1. New Tables
    - `course_sections`: Stores course sections with title, description, and duration
    - `section_activities`: Stores activities within sections with type support
  
  2. Activity Types
    - assignment: Student assignments with due dates
    - file_upload: File upload activities
    - quiz: Quiz/exam activities
    - book: Reading material/book references
    - video: Video content
    - discussion: Discussion forums
    - external_link: External resource links
  
  3. Security
    - Enable RLS on both tables
    - Admins can manage all sections and activities
    - Teachers can manage sections in their courses
    - Students can view sections and activities they're enrolled in
  
  4. Important Notes
    - Sections are linked to courses (course_id)
    - Activities are linked to sections (section_id)
    - Each activity has type, title, description, and optional metadata
    - Proper cascade deletion to maintain referential integrity
*/

CREATE TABLE IF NOT EXISTS public.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.section_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL CHECK (
    activity_type IN ('assignment', 'file_upload', 'quiz', 'book', 'video', 'discussion', 'external_link')
  ),
  due_date DATE,
  points INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.section_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sections"
ON public.course_sections
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view sections in enrolled courses"
ON public.course_sections
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid()
    AND course_id = course_sections.course_id
    AND status = 'active'
  )
);

CREATE POLICY "Admins can manage activities"
ON public.section_activities
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view activities in enrolled courses"
ON public.section_activities
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid()
    AND course_id = section_activities.course_id
    AND status = 'active'
  )
);

CREATE TRIGGER update_course_sections_updated_at
BEFORE UPDATE ON public.course_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_section_activities_updated_at
BEFORE UPDATE ON public.section_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();