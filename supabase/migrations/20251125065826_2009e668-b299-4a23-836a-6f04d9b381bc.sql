-- Create storage bucket for user documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-documents', 'user-documents', false);

-- Create table for user documents
CREATE TABLE public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'application/pdf',
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_documents table
CREATE POLICY "Admins can manage all user documents"
ON public.user_documents
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own documents"
ON public.user_documents
FOR SELECT
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for user-documents bucket
CREATE POLICY "Admins can upload user documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'user-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update user documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'user-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete user documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'user-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can view their own user documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'user-documents' 
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR auth.uid()::text = (storage.foldername(name))[1]
  )
);