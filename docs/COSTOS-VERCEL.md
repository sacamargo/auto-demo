# Control de costos — Vercel

## Principio

El catálogo público debe servirse desde **CDN estático**. Cada visita no debe invocar Serverless Functions.

---

## Estrategia por tipo de recurso

| Recurso | Estrategia | Costo |
|---------|------------|-------|
| Home, catálogo, fichas | **ISR** con `revalidate: false` + tag | CDN (gratis en hobby) |
| Imágenes | `next/image` → WebP, sizes definidos | Image Optimization (cuota plan) |
| Admin | Dynamic SSR | Solo uso interno, bajo tráfico |
| Formulario contacto | API Route | 1 invocation por envío |
| Revalidación | API Route | 1 invocation por edit admin |
| Middleware | Solo `/admin/*` | Edge, mínimo |

---

## ISR — implementación

```typescript
// app/catalogo/page.tsx
export const revalidate = false; // solo revalida por tag/path

// lib/revalidate.ts — llamar desde admin al guardar
import { revalidateTag, revalidatePath } from 'next/cache';

export async function revalidateCatalog() {
  revalidateTag('vehicles');
  revalidatePath('/');
  revalidatePath('/catalogo');
}
```

```typescript
// lib/vehicles.ts — fetch con tag
export async function getVehicles() {
  const supabase = createServerClient(); // service role en build
  const { data } = await supabase
    .from('vehicles')
    .select('*, vehicle_images(*)')
    .in('status', ['disponible', 'reservado']);
  return data;
}

// En page:
export default async function CatalogoPage() {
  const vehicles = await getVehicles();
  // ...
}
// Tag en fetch (Next.js 14):
// fetch(url, { next: { tags: ['vehicles'] } })
```

---

## Imágenes

```typescript
// next.config.js
images: {
  formats: ['image/webp'],
  remotePatterns: [
    { hostname: '*.supabase.co' },
    { hostname: 'images.unsplash.com' }, // solo demo
  ],
  deviceSizes: [640, 750, 1080, 1200],
  imageSizes: [256, 384],
}
```

```tsx
<Image
  src={url}
  alt={`${brand} ${model}`}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index === 0} // solo hero/primera imagen
/>
```

---

## Qué NO hacer

| Anti-patrón | Por qué cuesta |
|-------------|----------------|
| `export const dynamic = 'force-dynamic'` en catálogo | SSR por visita |
| `fetch()` sin cache en páginas públicas | Serverless cada request |
| Middleware en `matcher: '/(.*)'` | Edge invocation por visita |
| Cron jobs en Vercel | Usar Supabase Edge Functions |
| Imágenes sin `sizes` | Optimización oversized |
| API routes para datos del catálogo | Debe ser estático |

---

## Background tasks

| Tarea | Dónde |
|-------|-------|
| Limpieza imágenes huérfanas | Supabase Edge Function + pg_cron |
| Notificación email lead | Supabase Edge Function (trigger) |
| Backup DB | Supabase automático |

---

## Monitoreo

### Vercel Dashboard
- **Analytics → Functions:** invocations por ruta
- **Analytics → Bandwidth:** tráfico de imágenes
- **Usage:** % del plan consumido

### Alertas recomendadas
- Functions > 80% del límite mensual
- Bandwidth > 80% del límite

### Plan Hobby (referencia 2024–2025)
- 100 GB bandwidth
- 100 GB-hrs serverless
- ISR incluido en CDN

> Verificar límites actuales en [vercel.com/pricing](https://vercel.com/pricing)

---

## Estimación demo

| Métrica | Estimado mensual |
|---------|------------------|
| Visitas catálogo | ~5.000 (CDN, $0 extra) |
| Ediciones admin | ~50 revalidaciones |
| Formularios | ~100 API invocations |
| Image optimization | ~2.000 transforms |

**Conclusión demo:** Plan Hobby suficiente. Monitorear si tráfico crece.

---

## README — sección para el cliente

Incluir en README final:

```markdown
## Costos de hosting

Este sitio está optimizado para minimizar costos en Vercel:
- El catálogo se genera estáticamente y solo se actualiza cuando editas un vehículo.
- Las imágenes se optimizan automáticamente.

Monitorea tu uso en: Vercel Dashboard → Usage
Si superas el plan Hobby, considera Vercel Pro (~$20/mes).
```
