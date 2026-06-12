# Arquitectura técnica

## Stack y responsabilidades

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel (Edge/CDN)                   │
│  Next.js 14 App Router · SSG/ISR · next/image · Headers │
└──────────────────────────┬──────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   Páginas estáticas   Middleware        API Routes
   (catálogo, home)    (/admin only)     (contacto, revalidate)
         │                 │                 │
         └─────────────────┼─────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│                        Supabase                          │
│  PostgreSQL + RLS · Auth · Storage (bucket vehículos)   │
└─────────────────────────────────────────────────────────┘
```

| Capa | Tecnología | Rol |
|------|------------|-----|
| Frontend | Next.js 14 App Router | UI pública + admin |
| Estilos | Tailwind CSS | Tokens del design system |
| Datos | Supabase PostgreSQL | Inventario, leads |
| Auth | Supabase Auth | Solo admins |
| Archivos | Supabase Storage | Fotos de vehículos |
| Hosting | Vercel | CDN + ISR |

---

## Estructura de carpetas propuesta

```
landing-carros/
├── app/
│   ├── (public)/                 # Layout con Header + Footer
│   │   ├── page.tsx              # Home
│   │   ├── catalogo/
│   │   │   ├── page.tsx          # Listado + filtros
│   │   │   └── [slug]/page.tsx   # Ficha detalle
│   │   ├── comparar/page.tsx
│   │   ├── politica-de-privacidad/page.tsx
│   │   └── terminos-y-condiciones/page.tsx
│   ├── admin/
│   │   ├── layout.tsx            # Guard adicional
│   │   ├── login/page.tsx
│   │   └── vehiculos/
│   │       ├── page.tsx          # Lista
│   │       ├── nuevo/page.tsx
│   │       └── [id]/
│   │           ├── page.tsx      # Editar
│   │           └── preview/page.tsx
│   ├── api/
│   │   ├── contacto/route.ts     # POST + rate limit
│   │   └── revalidate/route.ts   # POST protegida
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Button, Input, Badge…
│   ├── layout/                   # Header, Footer, Logo
│   ├── catalog/                  # VehicleCard, Filters, Gallery
│   ├── compare/                  # CompareTable
│   ├── forms/                    # ContactForm, QuoteForm
│   └── admin/                    # VehicleForm, ImageUpload
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client (cookies)
│   │   └── admin.ts              # Service role (solo server)
│   ├── vehicles.ts               # Queries + tipos
│   ├── revalidate.ts             # Helpers ISR
│   ├── sanitize.ts               # Input sanitization
│   └── rate-limit.ts             # Rate limiting
├── middleware.ts                 # Protección /admin
├── public/
│   └── fonts/                    # Self-hosted (no Google Fonts genéricas)
├── supabase/
│   ├── migrations/               # SQL schema + RLS
│   └── seed.sql                  # 8 vehículos demo
├── types/
│   └── database.ts               # Tipos generados Supabase
└── next.config.js                # Headers seguridad + images
```

---

## Flujo de datos

### Catálogo público (lectura)

```
1. build time / revalidación
   └─► Supabase query (service role en build)
       └─► generateStaticParams + ISR tag "vehicles"

2. visita usuario
   └─► HTML estático desde CDN (sin serverless por visita)
```

### Admin escribe vehículo

```
1. Admin sube fotos → Supabase Storage (auth + RLS)
2. Admin guarda form → Supabase insert/update (RLS: role admin)
3. Server action o API → revalidateTag("vehicles")
4. Próxima visita al catálogo → página regenerada
```

### Formulario de contacto

```
1. Usuario envía → POST /api/contacto
2. Rate limit check (IP, 5 req/min)
3. Sanitize inputs (Zod + DOMPurify o similar)
4. Insert en tabla `leads` (RLS: insert público, read solo admin)
5. Opcional: notificación email vía Supabase Edge Function
```

---

## Variables de entorno

```bash
# .env.local — NUNCA commitear

# Públicas (seguras para el browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://auto-demo.vercel.app
NEXT_PUBLIC_WHATSAPP=573000000000

# Solo servidor — NUNCA NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=     # Build + revalidate
REVALIDATE_SECRET=             # Token para /api/revalidate
```

---

## Middleware

```typescript
// middleware.ts — matcher solo /admin/*
// 1. Verificar sesión Supabase (cookie)
// 2. Si no autenticado → redirect /admin/login
// 3. Rutas públicas: NO pasar por middleware pesado
```

---

## Estrategia de rendering por ruta

| Ruta | Estrategia | Motivo |
|------|------------|--------|
| `/` | ISR (tag: vehicles) | Destacados cambian al editar |
| `/catalogo` | ISR | Inventario estático entre edits |
| `/catalogo/[slug]` | ISR + generateStaticParams | Ficha por vehículo |
| `/comparar` | Client Component | Estado en URL/localStorage |
| `/admin/*` | Dynamic (SSR) | Requiere auth en tiempo real |
| Legal | Static | Contenido fijo |

---

## Dependencias principales

```json
{
  "@supabase/supabase-js": "latest",
  "@supabase/ssr": "latest",
  "zod": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

**No incluir:** shadcn/ui por defecto. Componentes custom desde cero siguiendo el design system.

---

## Comparador — implementación

- Estado en `localStorage` + query params `?ids=slug1,slug2,slug3`
- Botón "Comparar" en tarjetas añade al set (máx 3)
- Barra flotante cuando hay 1+ seleccionados
- Datos cargados desde props estáticos (no fetch en cliente)
