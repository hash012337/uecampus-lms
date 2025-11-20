-- Add passing_marks column to assignments table
ALTER TABLE public.assignments 
ADD COLUMN IF NOT EXISTS passing_marks INTEGER DEFAULT 50;

-- Add assessment_brief column to store detailed grading criteria
ALTER TABLE public.assignments 
ADD COLUMN IF NOT EXISTS assessment_brief TEXT;