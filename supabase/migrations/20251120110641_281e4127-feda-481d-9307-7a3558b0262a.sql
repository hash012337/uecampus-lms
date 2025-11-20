-- Add is_hidden column to course_materials, assignments, and section_quizzes
ALTER TABLE public.course_materials
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

ALTER TABLE public.assignments
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

ALTER TABLE public.section_quizzes
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;