-- Create assignment_deadlines table for per-user deadlines
CREATE TABLE IF NOT EXISTS public.assignment_deadlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(assignment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.assignment_deadlines ENABLE ROW LEVEL SECURITY;

-- Policies for assignment_deadlines
CREATE POLICY "Users can view their own deadlines"
  ON public.assignment_deadlines
  FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage deadlines"
  ON public.assignment_deadlines
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_assignment_deadlines_updated_at
  BEFORE UPDATE ON public.assignment_deadlines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();