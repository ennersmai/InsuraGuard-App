-- Create storage bucket for claim documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('claim-documents', 'claim-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own claim documents
CREATE POLICY "Users can upload claim documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'claim-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own claim documents
CREATE POLICY "Users can view their own claim documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'claim-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view all claim documents
CREATE POLICY "Admins can view all claim documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'claim-documents' AND
  (auth.jwt()->'user_metadata'->>'role') = 'admin'
);

-- Admins can delete claim documents
CREATE POLICY "Admins can delete claim documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'claim-documents' AND
  (auth.jwt()->'user_metadata'->>'role') = 'admin'
);
