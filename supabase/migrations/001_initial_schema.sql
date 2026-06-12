-- AutoDemo: schema inicial

CREATE TYPE vehicle_status AS ENUM ('disponible', 'vendido', 'reservado');
CREATE TYPE fuel_type AS ENUM ('gasolina', 'diesel', 'hibrido', 'electrico', 'gas');
CREATE TYPE transmission_type AS ENUM ('manual', 'automatica', 'cvt');

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1990 AND year <= 2030),
  price_cop BIGINT NOT NULL CHECK (price_cop > 0),
  mileage_km INTEGER NOT NULL CHECK (mileage_km >= 0),
  fuel_type fuel_type NOT NULL,
  transmission transmission_type NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status vehicle_status NOT NULL DEFAULT 'disponible',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  privacy_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_featured ON vehicles(featured) WHERE featured = true;
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
