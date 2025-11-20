-- Allow 'material' as a valid item_type in progress_tracking
ALTER TABLE public.progress_tracking 
DROP CONSTRAINT IF EXISTS progress_tracking_item_type_check;

ALTER TABLE public.progress_tracking 
ADD CONSTRAINT progress_tracking_item_type_check 
CHECK (item_type = ANY (ARRAY['assignment'::text, 'quiz'::text, 'module'::text, 'material'::text]));