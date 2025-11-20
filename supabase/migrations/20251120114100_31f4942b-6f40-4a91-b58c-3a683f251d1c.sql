-- Drop the existing restrictive policy on section_quizzes
DROP POLICY "Enrolled users can view section quizzes" ON public.section_quizzes;

-- Create a new policy that allows anyone to view section quizzes
CREATE POLICY "Anyone can view section quizzes"
ON public.section_quizzes
FOR SELECT
USING (true);