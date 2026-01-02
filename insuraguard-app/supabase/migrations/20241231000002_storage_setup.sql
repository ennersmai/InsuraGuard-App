-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('insuraguard-documents', 'insuraguard-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for proof-of-purchase
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'insuraguard-documents' AND
  (storage.foldername(name))[1] = 'proof-of-purchase' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'insuraguard-documents' AND
  (
    (storage.foldername(name))[2] = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  )
);

-- Storage policies for certificates
CREATE POLICY "Users can view their own certificates"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'insuraguard-documents' AND
  (storage.foldername(name))[1] = 'certificates' AND
  (
    EXISTS (
      SELECT 1 FROM registrations
      WHERE id::text = (storage.foldername(name))[2]
      AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  )
);

-- Admins can do everything
CREATE POLICY "Admins have full access"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'insuraguard-documents' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);
