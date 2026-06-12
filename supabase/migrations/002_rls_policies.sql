-- AutoDemo: Row Level Security

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
END;
$$;

-- vehicles
CREATE POLICY "Public read available vehicles"
  ON vehicles FOR SELECT
  USING (status IN ('disponible', 'reservado'));

CREATE POLICY "Admin read all vehicles"
  ON vehicles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin insert vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin update vehicles"
  ON vehicles FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admin delete vehicles"
  ON vehicles FOR DELETE
  USING (is_admin());

-- vehicle_images
CREATE POLICY "Public read images of public vehicles"
  ON vehicle_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_id
      AND v.status IN ('disponible', 'reservado')
    )
  );

CREATE POLICY "Admin read all images"
  ON vehicle_images FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin insert images"
  ON vehicle_images FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin update images"
  ON vehicle_images FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admin delete images"
  ON vehicle_images FOR DELETE
  USING (is_admin());

-- leads
CREATE POLICY "Public insert leads"
  ON leads FOR INSERT
  WITH CHECK (privacy_accepted = true);

CREATE POLICY "Admin read leads"
  ON leads FOR SELECT
  USING (is_admin());
