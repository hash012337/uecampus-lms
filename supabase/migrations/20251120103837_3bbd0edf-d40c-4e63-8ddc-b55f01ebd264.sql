-- Create section_quizzes table for multiple quizzes per section
CREATE TABLE IF NOT EXISTS public.section_quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  quiz_url TEXT NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_quizzes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage section quizzes"
  ON public.section_quizzes
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Enrolled users can view section quizzes"
  ON public.section_quizzes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.user_id = auth.uid()
        AND enrollments.course_id = section_quizzes.course_id
        AND enrollments.status = 'active'
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Add trigger for updated_at
CREATE TRIGGER update_section_quizzes_updated_at
  BEFORE UPDATE ON public.section_quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();