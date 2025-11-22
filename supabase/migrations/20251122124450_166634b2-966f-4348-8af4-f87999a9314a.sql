-- Add attempts column to assignments table
ALTER TABLE public.assignments 
ADD COLUMN attempts integer NOT NULL DEFAULT 2;

-- Create table for tracking extra attempts per user
CREATE TABLE public.assignment_extra_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  extra_attempts integer NOT NULL DEFAULT 0,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(assignment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.assignment_extra_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignment_extra_attempts
CREATE POLICY "Admins can manage extra attempts"
ON public.assignment_extra_attempts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own extra attempts"
ON public.assignment_extra_attempts
FOR SELECT
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_assignment_extra_attempts_updated_at
BEFORE UPDATE ON public.assignment_extra_attempts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.assignment_extra_attempts IS 'Tracks extra submission attempts granted to specific users for assignments';