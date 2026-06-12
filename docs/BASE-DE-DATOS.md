# Base de datos — Supabase

## Diagrama ER

```
┌──────────────────┐       ┌──────────────────┐
│    vehicles      │       │  vehicle_images  │
├──────────────────┤       ├──────────────────┤
│ id (uuid) PK     │──┐    │ id (uuid) PK     │
│ slug (unique)    │  └───►│ vehicle_id FK    │
│ brand            │       │ url              │
│ model            │       │ sort_order       │
│ year             │       │ created_at       │
│ price_cop        │       └──────────────────┘
│ mileage_km       │
│ fuel_type        │       ┌──────────────────┐
│ transmission     │       │      leads       │
│ color            │       ├──────────────────┤
│ description      │       │ id (uuid) PK     │
│ status           │       │ vehicle_id FK?   │
│ featured         │       │ name             │
│ created_at       │       │ phone            │
│ updated_at       │       │ email            │
└──────────────────┘       │ message          │
                           │ privacy_accepted │
                           │ created_at       │
                           └──────────────────┘
```

---

## Schema SQL

```sql
-- Enums
CREATE TYPE vehicle_status AS ENUM ('disponible', 'vendido', 'reservado');
CREATE TYPE fuel_type AS ENUM ('gasolina', 'diesel', 'hibrido', 'electrico', 'gas');
CREATE TYPE transmission_type AS ENUM ('manual', 'automatica', 'cvt');

-- Vehículos
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

-- Imágenes
CREATE TABLE vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Leads / cotizaciones
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

-- Trigger updated_at
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

-- Índices
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_featured ON vehicles(featured) WHERE featured = true;
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
```

---

## Row Level Security (RLS)

```sql
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Helper: verificar si el usuario es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- VEHICLES
-- Público: leer solo disponibles/reservados (no vendidos en catálogo)
CREATE POLICY "Public read available vehicles"
  ON vehicles FOR SELECT
  USING (status IN ('disponible', 'reservado'));

-- Admin: lectura total
CREATE POLICY "Admin read all vehicles"
  ON vehicles FOR SELECT
  USING (is_admin());

-- Admin: escritura
CREATE POLICY "Admin insert vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin update vehicles"
  ON vehicles FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admin delete vehicles"
  ON vehicles FOR DELETE
  USING (is_admin());

-- VEHICLE_IMAGES (misma lógica)
CREATE POLICY "Public read images of public vehicles"
  ON vehicle_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_id
      AND v.status IN ('disponible', 'reservado')
    )
  );

CREATE POLICY "Admin full access images"
  ON vehicle_images FOR ALL
  USING (is_admin());

-- LEADS
CREATE POLICY "Public insert leads"
  ON leads FOR INSERT
  WITH CHECK (privacy_accepted = true);

CREATE POLICY "Admin read leads"
  ON leads FOR SELECT
  USING (is_admin());
```

---

## Storage

```
Bucket: vehicle-images
├── Public read: NO (usar signed URLs o proxy next/image)
├── Upload: solo authenticated + is_admin()
└── Max file size: 5MB
└── Allowed types: image/jpeg, image/webp, image/png
```

```sql
-- Políticas storage (ejemplo)
CREATE POLICY "Admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicle-images'
    AND is_admin()
  );

CREATE POLICY "Admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vehicle-images'
    AND is_admin()
  );

-- Lectura pública de imágenes de vehículos publicados
-- Opción A: bucket público solo para paths conocidos
-- Opción B: signed URLs generadas en build (preferido para control)
```

---

## Auth — rol admin

1. Crear usuario admin en Supabase Dashboard
2. Asignar en `app_metadata`: `{ "role": "admin" }`
3. **Nunca** usar `user_metadata` para roles (editable por el usuario)

---

## Seed demo (8 vehículos)

| Marca | Modelo | Año | Precio COP | Km | Combustible |
|-------|--------|-----|------------|-----|-------------|
| BMW | X3 xDrive30i | 2022 | 245.000.000 | 28.000 | Gasolina |
| Mercedes-Benz | GLC 300 | 2021 | 268.000.000 | 35.000 | Gasolina |
| Audi | Q5 Sportback | 2023 | 289.000.000 | 12.000 | Gasolina |
| Volvo | XC60 T8 | 2022 | 275.000.000 | 22.000 | Híbrido |
| Porsche | Macan S | 2021 | 385.000.000 | 18.000 | Gasolina |
| Lexus | RX 350 | 2020 | 198.000.000 | 45.000 | Gasolina |
| Genesis | GV70 2.5T | 2023 | 265.000.000 | 8.000 | Gasolina |
| Land Rover | Range Rover Evoque | 2022 | 310.000.000 | 15.000 | Gasolina |

- 3 marcados como `featured = true`
- 1 con `status = 'reservado'`
- Fotos: URLs Unsplash (automóvil premium, sin watermark)
- Slug: `{marca}-{modelo}-{año}` en kebab-case

---

## Slug generation

```typescript
// lib/vehicles.ts
function generateSlug(brand: string, model: string, year: number): string {
  return `${brand}-${model}-${year}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
```
