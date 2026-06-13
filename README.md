# AutoDemo — Concesionario Premium

Plataforma web para concesionario de vehículos. Catálogo público con diseño editorial premium + panel admin para gestionar inventario sin tocar código.

> **Estado:** Proyecto completo · Listo para GitHub y deploy  
> **Marca demo:** AutoDemo (reemplazar con find & replace global antes de producción)

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [Deploy — GitHub + Vercel](./docs/DEPLOY.md) | **Cómo subir a GitHub y desplegar** |
| [Auditoría de seguridad](./docs/AUDITORIA-SEGURIDAD.md) | Reporte Fase 5 |
| [Plan maestro](./docs/PLAN-MAESTRO.md) | Visión, alcance, fases |
| [Arquitectura](./docs/ARQUITECTURA.md) | Stack, carpetas, flujo de datos |
| [Seguridad](./docs/SEGURIDAD.md) | Checklist pre-deploy |
| [Git workflow](./docs/GIT-WORKFLOW.md) | Ramas, commits, releases |
| [Fase 6 — roadmap](./docs/FASE-6.md) | Features comerciales |
| [Costos Vercel](./docs/COSTOS-VERCEL.md) | SSG/ISR y monitoreo |

## Stack

- **Next.js 14** (App Router) + **Tailwind CSS**
- **Supabase** (PostgreSQL, Auth, Storage)
- **Vercel** (hosting con SSG/ISR)

## Inicio rápido (desarrollo)

```bash
npm install
cp .env.example .env.local   # Completar credenciales
npm run dev
```

- Sitio público: [http://localhost:3000](http://localhost:3000)
- Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Variables de entorno

| Variable | Dónde | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente + servidor | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Cliente + servidor | Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo servidor** | Nunca en GitHub |
| `REVALIDATE_SECRET` | **Solo servidor** | Protege `/api/revalidate` |
| `NEXT_PUBLIC_SITE_URL` | Cliente | URL del sitio (prod: `https://auto-demo-six.vercel.app` por defecto) |
| `NEXT_PUBLIC_WHATSAPP` | Cliente | Número sin + |

## Panel de administración

URL: `/admin` · Login: `/admin/login`

- Inventario completo (CRUD)
- Subida de fotos drag & drop
- Vista previa antes de publicar
- Catálogo se actualiza automáticamente al guardar

### Crear usuario admin

1. Supabase → **Authentication → Users** → crear usuario
2. Asignar rol vía API (el SQL directo no tiene permisos):

```bash
curl -X PUT 'https://TU_PROYECTO.supabase.co/auth/v1/admin/users/USER_ID' \
  -H "apikey: TU_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer TU_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"app_metadata":{"role":"admin"}}'
```

## Subir a GitHub

```bash
git add .
git status          # .env.local NO debe aparecer
git commit -m "AutoDemo: listo para producción"
git remote add origin https://github.com/TU_USUARIO/landing-carros.git
git push -u origin main
```

Guía completa: [docs/DEPLOY.md](./docs/DEPLOY.md)

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run start    # Servir build local
npm run lint     # ESLint
```

## Contacto demo

- WhatsApp: +57 302 862 1190
- Email: demo@autodemo.co

## Antes de producción

- [ ] Completar placeholders legales (NIT, dirección, reservas)
- [ ] Cambiar marca AutoDemo por nombre real
- [x] URL producción: `https://auto-demo-six.vercel.app` (en `config/site.ts`)
- [ ] Configurar Supabase Auth URLs (Site URL + redirects)
- [ ] Verificar RLS enabled en Supabase Dashboard
- [ ] Rotar service role key si se expuso
