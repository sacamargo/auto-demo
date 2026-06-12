# Plan maestro — AutoDemo

## 1. Visión del producto

Un sitio que se sienta como **galería automotriz premium** (Tesla, Volvo, Genesis), no como marketplace genérico (TuCarro, OLX). El diferenciador es doble:

1. **Para el visitante:** catálogo filtrable, comparador, contacto directo por WhatsApp, experiencia visual editorial.
2. **Para el concesionario:** panel admin tan simple que no requiere capacitación técnica.

### Referencias visuales

| Sitio | Qué tomar | Qué evitar |
|-------|-----------|------------|
| [vendetunave.co](https://www.vendetunave.co/) | Jerarquía de información, CTAs claros | Layout genérico de clasificados |
| [autoland.com.co](https://www.autoland.com.co/) | Estructura de catálogo, filtros | Sobrecarga visual, muchos banners |
| [tucarro.com.co](https://www.tucarro.com.co/) | Utilidad de filtros y búsqueda | Estética de e-commerce masivo |

---

## 2. Mapa del sitio

```
/                          Home (destacados + hero editorial)
/catalogo                  Catálogo con filtros y búsqueda
/catalogo/[slug]           Ficha detallada del vehículo
/comparar                  Comparador (hasta 3 vehículos)
/politica-de-privacidad    Legal — Ley 1581/2012
/terminos-y-condiciones    Legal — Ley 1480/2011

/admin                     Login (Supabase Auth)
/admin/vehiculos           Lista de inventario
/admin/vehiculos/nuevo     Crear vehículo
/admin/vehiculos/[id]      Editar + vista previa
/admin/vehiculos/[id]/preview  Preview antes de publicar
```

### API Routes (mínimas, con rate limit)

```
POST /api/contacto         Formulario de interés/cotización
POST /api/revalidate       Revalidación ISR (protegida, solo admin)
```

---

## 3. Funcionalidades por actor

### Visitante (público)

- [ ] Catálogo con filtros: marca, precio, año, combustible, transmisión
- [ ] Buscador por texto libre (marca, modelo, descripción)
- [ ] Ficha con galería de fotos (lightbox)
- [ ] Botón WhatsApp por vehículo (+57 300 000 0000 demo)
- [ ] Comparador de hasta 3 vehículos (localStorage + URL params)
- [ ] Formulario cotización con checkbox legal obligatorio
- [ ] Home con vehículos destacados (`featured = true`)

### Admin (autenticado)

- [ ] CRUD vehículos: fotos, marca, modelo, año, precio, km, combustible, transmisión, color, descripción, estado
- [ ] Upload drag & drop de múltiples fotos
- [ ] Vista previa antes de publicar
- [ ] Estados: disponible / vendido / reservado
- [ ] Marcar vehículo como destacado

---

## 4. Fases de implementación

### Fase 0 — Fundamentos (1–2 días)
> Sin UI todavía. Base sólida.

- [ ] `create-next-app` con App Router + Tailwind + TypeScript
- [ ] Instalar skills de diseño:
  ```bash
  npx skills add Leonxlnx/taste-skill --skill "minimalist-skill"
  npx skills add emilkowalski/skill
  ```
- [ ] Proyecto Supabase: tablas, RLS, bucket storage
- [ ] Variables de entorno (`.env.example` documentado)
- [ ] Seed: 8+ vehículos demo con fotos Unsplash
- [ ] Git init + `.gitignore`

**Entregable:** App corre en local, DB poblada, sin pantallas públicas aún.

---

### Fase 1 — Sistema de diseño (1–2 días)
> Antes de cualquier componente de negocio.

- [ ] Definir tokens: colores, tipografía, espaciado (minimalist-skill)
- [ ] Fuentes self-hosted (serif headings + sans body) — **no** Inter/Roboto
- [ ] Logo SVG tipográfico "AutoDemo"
- [ ] Componentes base: `Header`, `Footer`, `Button`, `Input`, `Card`, `Badge`
- [ ] Layout raíz con header/footer en todas las páginas

**Entregable:** Storybook opcional o página `/design-system` interna para validar look & feel.

---

### Fase 2 — Catálogo público (2–3 días)
> SSG/ISR desde el inicio.

- [ ] Home con hero editorial + grid de destacados
- [ ] `/catalogo` con filtros client-side sobre datos estáticos
- [ ] `/catalogo/[slug]` con galería y WhatsApp CTA
- [ ] `/comparar` con selección de hasta 3
- [ ] `next/image` optimizado (WebP, sizes correctos)
- [ ] Animaciones hover en tarjetas (emilkowalski/skill)

**Entregable:** Sitio público navegable con datos demo, sin admin.

---

### Fase 3 — Formularios y legal (1 día)

- [ ] Formulario cotización con sanitización + rate limit
- [ ] Checkbox obligatorio de política de privacidad
- [ ] `/politica-de-privacidad` (Ley 1581/2012, placeholders responsable)
- [ ] `/terminos-y-condiciones` (Ley 1480/2011, placeholders reservas)
- [ ] Links legales en footer

**Entregable:** Flujo de contacto completo y páginas legales coherentes con el diseño.

---

### Fase 4 — Panel admin (2–3 días)
> UI simple, sin sidebar sobrecargado.

- [ ] Middleware Next.js protegiendo `/admin/*`
- [ ] Login Supabase Auth
- [ ] Lista de vehículos con acciones editar/eliminar
- [ ] Formulario crear/editar con drag & drop de fotos
- [ ] Vista previa antes de publicar
- [ ] Al guardar → `revalidatePath` / `revalidateTag`

**Entregable:** Cliente puede gestionar inventario sin tocar código.

---

### Fase 5 — Seguridad y deploy (1–2 días)

- [x] Auditoría completa ([reporte](./AUDITORIA-SEGURIDAD.md) · [checklist](./SEGURIDAD.md))
- [x] Headers de seguridad en `next.config.mjs`
- [ ] Deploy Vercel + Supabase producción *(lo hace el cliente — ver [DEPLOY.md](./DEPLOY.md))*
- [x] README para el cliente (cómo usar el panel)
- [x] Documentación de costos Vercel
- [x] Proyecto listo para GitHub (`.env.example`, `.gitignore`, build verificado)

**Entregable:** Proyecto listo para GitHub/deploy con checklist de seguridad reportado.

---

## 5. Criterios de "listo para producción"

| Área | Criterio |
|------|----------|
| Diseño | No parece template genérico; tipografía y paleta coherentes |
| Admin | CRUD completo sin terminal |
| Performance | Catálogo SSG/ISR, Lighthouse > 85 mobile |
| Seguridad | RLS activo, middleware admin, rate limit formularios |
| Legal | Páginas legales con placeholders marcados para completar |
| Demo | 8+ vehículos, contacto ficticio, marca AutoDemo |
| Costos | Sin SSR en catálogo; README documenta monitoreo |

---

## 6. Lo que NO hacer

- ❌ shadcn/ui sin customizar profundamente
- ❌ Sidebar admin con 20 opciones
- ❌ Google Fonts genéricas (Inter, Roboto)
- ❌ Sombras exageradas, gradientes, border-radius excesivo
- ❌ Stock photos de carros (solo Unsplash en demo)
- ❌ SSR en cada visita al catálogo
- ❌ Endpoints abiertos sin validación
- ❌ Auth solo client-side en admin

---

## 7. Estimación total

| Fase | Días |
|------|------|
| 0 Fundamentos | 1–2 |
| 1 Diseño | 1–2 |
| 2 Catálogo | 2–3 |
| 3 Legal + formularios | 1 |
| 4 Admin | 2–3 |
| 5 Seguridad + deploy | 1–2 |
| **Total** | **8–13 días** |

---

## 8. Próximo paso inmediato

Ejecutar **Fase 0**: scaffold Next.js + Supabase + seed demo.  
Las skills de diseño se instalan **antes** de escribir UI (Fase 1).
