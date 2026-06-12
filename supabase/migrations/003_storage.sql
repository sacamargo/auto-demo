-- AutoDemo: bucket de imágenes

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-images',
  'vehicle-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read vehicle images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-images');

CREATE POLICY "Admin upload vehicle images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicle-images'
    AND is_admin()
  );

CREATE POLICY "Admin update vehicle images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'vehicle-images'
    AND is_admin()
  );

CREATE POLICY "Admin delete vehicle images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vehicle-images'
    AND is_admin()
  );
