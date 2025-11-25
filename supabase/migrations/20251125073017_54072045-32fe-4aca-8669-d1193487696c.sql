-- Create softwares table
CREATE TABLE public.softwares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  download_url TEXT,
  version TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.softwares ENABLE ROW LEVEL SECURITY;

-- Everyone can view softwares
CREATE POLICY "Anyone can view softwares"
ON public.softwares
FOR SELECT
USING (true);

-- Only admins can manage softwares
CREATE POLICY "Admins can manage softwares"
ON public.softwares
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for software covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('software-covers', 'software-covers', true);

-- Storage policies for software covers
CREATE POLICY "Anyone can view software covers"
ON storage.objects
FOR SELECT
USING (bucket_id = 'software-covers');

CREATE POLICY "Admins can upload software covers"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'software-covers' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update software covers"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'software-covers' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete software covers"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'software-covers' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Trigger for updated_at
CREATE TRIGGER update_softwares_updated_at
BEFORE UPDATE ON public.softwares
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();