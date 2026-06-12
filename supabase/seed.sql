-- AutoDemo: datos demo (ejecutar después de migrations)
-- storage_path con URL externa = imagen Unsplash (solo demo)

TRUNCATE vehicle_images, vehicles, leads RESTART IDENTITY CASCADE;

INSERT INTO vehicles (id, slug, brand, model, year, price_cop, mileage_km, fuel_type, transmission, color, description, status, featured) VALUES
  ('a1000001-0000-4000-8000-000000000001', 'bmw-x3-xdrive30i-2022', 'BMW', 'X3 xDrive30i', 2022, 245000000, 28000, 'gasolina', 'automatica', 'Blanco Alpino', 'SUV premium en excelente estado. Único dueño, historial de mantenimiento en concesionario oficial. Interior en cuero, techo panorámico y paquete M Sport.', 'disponible', true),
  ('a1000001-0000-4000-8000-000000000002', 'mercedes-benz-glc-300-2021', 'Mercedes-Benz', 'GLC 300', 2021, 268000000, 35000, 'gasolina', 'automatica', 'Negro Obsidiana', 'Elegancia y confort en cada detalle. Sistema MBUX, asientos eléctricos con memoria y asistencia activa de frenado.', 'disponible', false),
  ('a1000001-0000-4000-8000-000000000003', 'audi-q5-sportback-2023', 'Audi', 'Q5 Sportback', 2023, 289000000, 12000, 'gasolina', 'automatica', 'Gris Daytona', 'Diseño coupé SUV con bajo kilometraje. Virtual Cockpit, tracción quattro y acabados S line.', 'disponible', false),
  ('a1000001-0000-4000-8000-000000000004', 'volvo-xc60-t8-2022', 'Volvo', 'XC60 T8', 2022, 275000000, 22000, 'hibrido', 'automatica', 'Plata Brillante', 'Híbrido enchufable con autonomía eléctrica. Seguridad Volvo de serie, interior escandinavo en cuero Nappa.', 'reservado', false),
  ('a1000001-0000-4000-8000-000000000005', 'porsche-macan-s-2021', 'Porsche', 'Macan S', 2021, 385000000, 18000, 'gasolina', 'automatica', 'Rojo Carmín', 'Deportividad Porsche en formato SUV. Motor biturbo, suspensión neumática y paquete Sport Chrono.', 'disponible', true),
  ('a1000001-0000-4000-8000-000000000006', 'lexus-rx-350-2020', 'Lexus', 'RX 350', 2020, 198000000, 45000, 'gasolina', 'automatica', 'Blanco Perla', 'Confort japonés premium. Mark Levinson, asientos ventilados y sistema de seguridad Lexus Safety System+.', 'vendido', false),
  ('a1000001-0000-4000-8000-000000000007', 'genesis-gv70-2-5t-2023', 'Genesis', 'GV70 2.5T', 2023, 265000000, 8000, 'gasolina', 'automatica', 'Verde Tasman', 'SUV de lujo coreano casi nuevo. Pantalla curva de 14.5", sonido Lexicon y garantía vigente.', 'disponible', true),
  ('a1000001-0000-4000-8000-000000000008', 'land-rover-range-rover-evoque-2022', 'Land Rover', 'Range Rover Evoque', 2022, 310000000, 15000, 'gasolina', 'automatica', 'Azul Santorini', 'Compacto premium con capacidad todoterreno. Terrain Response, techo contrastante y llantas de 20".', 'disponible', false);

INSERT INTO vehicle_images (vehicle_id, storage_path, sort_order) VALUES
  ('a1000001-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80', 0),
  ('a1000001-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80', 1),
  ('a1000001-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80', 0),
  ('a1000001-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80', 1),
  ('a1000001-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80', 0),
  ('a1000001-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80', 1),
  ('a1000001-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1619767886555-eb8a788cd3e2?w=1200&q=80', 0),
  ('a1000001-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1583121274602-3e2820c08893?w=1200&q=80', 1),
  ('a1000001-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80', 0),
  ('a1000001-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80', 1),
  ('a1000001-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1549399542-7e2f9e288fb1?w=1200&q=80', 0),
  ('a1000001-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80', 0),
  ('a1000001-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80', 1),
  ('a1000001-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1519641471654-76ce01057ad1?w=1200&q=80', 0),
  ('a1000001-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80', 1);
