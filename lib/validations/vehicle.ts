import { z } from 'zod';

const fuelTypes = ['gasolina', 'diesel', 'hibrido', 'electrico', 'gas'] as const;
const transmissionTypes = ['manual', 'automatica', 'cvt'] as const;
const statusTypes = ['disponible', 'vendido', 'reservado'] as const;

export const vehicleSchema = z.object({
  brand: z.string().min(1, 'La marca es obligatoria').max(80),
  model: z.string().min(1, 'El modelo es obligatorio').max(120),
  year: z.coerce.number().min(1990).max(2030),
  price_cop: z.coerce.number().positive('El precio debe ser mayor a 0'),
  mileage_km: z.coerce.number().min(0, 'El kilometraje no puede ser negativo'),
  fuel_type: z.enum(fuelTypes),
  transmission: z.enum(transmissionTypes),
  color: z.string().min(1, 'El color es obligatorio').max(60),
  description: z.string().max(5000),
  status: z.enum(statusTypes),
  featured: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .transform((v) => v === true || v === 'true'),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
