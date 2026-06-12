export const siteConfig = {
  name: 'AutoDemo',
  description: 'Concesionario premium de vehículos',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  contact: {
    email: 'demo@autodemo.co',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? '573028621190',
    whatsappDisplay: '+57 302 862 1190',
  },
} as const;

export const VEHICLES_CACHE_TAG = 'vehicles';
