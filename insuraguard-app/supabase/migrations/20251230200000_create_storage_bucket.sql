-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'insuraguard-documents',
  'insuraguard-documents',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admins have full access" ON storage.objects;

-- Storage policies for proof-of-purchase uploads
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'insuraguard-documents' AND
  (storage.foldername(name))[1] = 'proof-of-purchase' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Users can view their own uploaded documents
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'insuraguard-documents' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Users can update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'insuraguard-documents' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Users can delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'insuraguard-documents' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Admins have full access to all documents
CREATE POLICY "Admins have full access"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'insuraguard-documents' AND
  (auth.jwt()->>'role' = 'admin' OR 
   (auth.jwt()->'user_metadata'->>'role') = 'admin')
)
WITH CHECK (
  bucket_id = 'insuraguard-documents' AND
  (auth.jwt()->>'role' = 'admin' OR 
   (auth.jwt()->'user_metadata'->>'role') = 'admin')
);
