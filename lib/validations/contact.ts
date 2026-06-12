import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  phone: z
    .string()
    .min(7, 'Ingresa un teléfono válido')
    .max(20, 'El teléfono es demasiado largo')
    .regex(/^[\d\s+\-()]+$/, 'Formato de teléfono no válido'),
  email: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .max(255, 'El correo es demasiado largo'),
  message: z.string().max(2000, 'El mensaje es demasiado largo').optional(),
  vehicle_id: z.string().uuid('ID de vehículo no válido').optional().nullable(),
  vehicle_interest: z.string().max(200).optional(),
  privacy_accepted: z.literal(true, {
    message: 'Debes aceptar la Política de privacidad',
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
