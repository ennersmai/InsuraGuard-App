-- Add policy for users to access their own certificates
-- Certificates are stored as certificates/{registration_id}/certificate.pdf
-- Users need to be able to read certificates for registrations they own

-- Policy for service role to upload certificates (bypasses RLS anyway, but explicit)
CREATE POLICY "Service role can manage certificates"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'insuraguard-documents')
WITH CHECK (bucket_id = 'insuraguard-documents');

-- Policy for authenticated users to read certificates folder
-- This allows users to read any file in the certificates folder
-- The actual authorization is handled by checking registration ownership in the app
CREATE POLICY "Users can read certificates"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'insuraguard-documents' AND
  (storage.foldername(name))[1] = 'certificates'
);
