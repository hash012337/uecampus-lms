-- Add RLS policy to allow users to delete their own submissions
-- This is needed for the resubmission feature where students can delete and reupload before deadline
CREATE POLICY "Users can delete their own submissions"
ON public.assignment_submissions
FOR DELETE
USING (user_id = auth.uid());