-- Create quiz_deadlines table for per-user quiz deadline overrides
CREATE TABLE IF NOT EXISTS public.quiz_deadlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.section_quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(quiz_id, user_id)
);

-- Enable RLS
ALTER TABLE public.quiz_deadlines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_deadlines
CREATE POLICY "Admins can manage quiz deadlines"
  ON public.quiz_deadlines
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own quiz deadlines"
  ON public.quiz_deadlines
  FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_quiz_deadlines_updated_at
  BEFORE UPDATE ON public.quiz_deadlines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_quiz_deadlines_user_id ON public.quiz_deadlines(user_id);
CREATE INDEX idx_quiz_deadlines_quiz_id ON public.quiz_deadlines(quiz_id);