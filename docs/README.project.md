# AutoDemo — Concesionario Premium

Plataforma web para concesionario de vehículos. Catálogo público con diseño editorial premium + panel admin para gestionar inventario sin tocar código.

> **Estado:** Planificación completada · Implementación pendiente  
> **Marca demo:** AutoDemo (reemplazar con find & replace global antes de producción)

## Documentación del proyecto

| Documento | Contenido |
|-----------|-----------|
| [Plan maestro](./docs/PLAN-MAESTRO.md) | Visión, alcance, fases y criterios de éxito |
| [Arquitectura](./docs/ARQUITECTURA.md) | Stack, estructura de carpetas, flujo de datos |
| [Base de datos](./docs/BASE-DE-DATOS.md) | Schema Supabase, RLS, storage |
| [Diseño](./docs/DISENO.md) | Sistema visual, tipografía, paleta, componentes |
| [Seguridad](./docs/SEGURIDAD.md) | Checklist pre-deploy |
| [Costos Vercel](./docs/COSTOS-VERCEL.md) | Estrategia SSG/ISR y monitoreo |

## Stack

- **Next.js 14** (App Router) + **Tailwind CSS**
- **Supabase** (PostgreSQL, Auth, Storage)
- **Vercel** (hosting con SSG/ISR)

## Inicio rápido (cuando esté implementado)

```bash
cp .env.example .env.local   # Completar credenciales Supabase
npm install
npm run dev
```

## Contacto demo

- WhatsApp: +57 300 000 0000
- Email: demo@autodemo.co
