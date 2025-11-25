-- Add due_date to section_quizzes table
ALTER TABLE public.section_quizzes 
ADD COLUMN due_date timestamp with time zone;

-- Add index for better query performance on due_date
CREATE INDEX idx_section_quizzes_due_date ON public.section_quizzes(due_date);

-- Add index on assignments due_date for better performance
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);