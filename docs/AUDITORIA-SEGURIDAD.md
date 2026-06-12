# Auditoría de seguridad — Reporte Fase 5

**Fecha:** 12 de junio de 2025  
**Proyecto:** AutoDemo / landing-carros  
**Alcance:** Código, credenciales, configuración web  
**Deploy:** Pendiente (realizado por el cliente)

---

## Resumen ejecutivo

| Área | Resultado |
|------|-----------|
| Autenticación admin | ✅ Aprobado |
| RLS Supabase | ✅ Aprobado (verificar en dashboard) |
| Variables de entorno | ✅ Aprobado |
| API y formularios | ✅ Aprobado |
| Headers HTTP | ✅ Implementados |
| Credenciales en repo | ✅ Sin fugas detectadas |
| Dependencias npm | ⚠️ 5 vulnerabilidades upstream (ver §7) |

**Veredicto:** Listo para subir a GitHub y deploy. Completar ítems pendientes de producción antes de lanzamiento público.

---

## 1. Autenticación y autorización

| Control | Estado | Detalle |
|---------|--------|---------|
| Middleware `/admin/*` | ✅ | `utils/supabase/middleware.ts` — redirige a login si no hay rol admin |
| Layout server-side | ✅ | `requireAdmin()` en `app/admin/(protected)/layout.tsx` |
| Rol en `app_metadata` | ✅ | Verificado en middleware y `signInAdmin` |
| `/api/revalidate` | ✅ | Protegida con header `x-revalidate-secret` |
| Rate limit login | ✅ | 10 intentos/min por IP en `signInAdmin` |
| Sign-out | ✅ | `signOutAdmin` limpia sesión |

**Nota:** El middleware solo corre en `/admin/*` (no en catálogo público) — reduce superficie y costos Edge.

---

## 2. Supabase y RLS

| Tabla / recurso | Política esperada | Estado |
|-----------------|-------------------|--------|
| `vehicles` | Lectura pública: disponible/reservado; escritura: admin | ✅ SQL en migrations |
| `vehicle_images` | Lectura pública ligada a vehículos públicos; escritura: admin | ✅ |
| `leads` | INSERT público con `privacy_accepted=true`; SELECT: admin | ✅ |
| Storage `vehicle-images` | Upload/delete: admin; lectura: pública | ⚠️ Ver §8 |

| Credencial | Exposición | Estado |
|------------|------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente | ✅ Esperado |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Cliente | ✅ Esperado (equivalente anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor | ✅ `import 'server-only'` en `lib/supabase/admin.ts` + queries en `lib/vehicles.server.ts` (separado de utilidades cliente en `lib/vehicles.ts`) |

**Acción manual:** En Supabase Dashboard → Database → verificar que RLS está **enabled** en las 3 tablas.

---

## 3. Variables de entorno

| Archivo | En git | Estado |
|---------|--------|--------|
| `.env.local` | ❌ Ignorado | ✅ |
| `.env.example` | ✅ Placeholders | ✅ |
| Secretos en código | No encontrados | ✅ |

`.gitignore` actualizado para bloquear `.env`, `.env.*` y `.env*.local`.

---

## 4. API y formularios

| Endpoint / acción | Controles |
|-----------------|-----------|
| `POST /api/contacto` | Zod, sanitize, rate limit 5/min, origin check en prod, límite 10KB body |
| `POST /api/contacto` | Usa cliente **anon** + RLS (no service role) |
| Server actions admin | `requireAdmin()` antes de mutaciones |
| Upload imágenes | MIME type, máx 5MB, paths UUID |
| Errores | Mensajes genéricos al cliente |

---

## 5. Headers HTTP de seguridad

Implementados en `next.config.mjs`:

| Header | Valor |
|--------|-------|
| `X-Frame-Options` | DENY |
| `X-Content-Type-Options` | nosniff |
| `Referrer-Policy` | strict-origin-when-cross-origin |
| `Permissions-Policy` | camera/mic/geo/payment deshabilitados |
| `Content-Security-Policy` | self + Supabase + Unsplash |
| `Strict-Transport-Security` | Solo en producción |
| `X-Powered-By` | Eliminado (`poweredByHeader: false`) |

---

## 6. Legal y datos (Colombia)

| Requisito | Estado |
|-----------|--------|
| Checkbox privacidad en formulario | ✅ |
| Política Ley 1581/2012 | ✅ (placeholders responsable) |
| Términos Ley 1480/2011 | ✅ (placeholders reservas) |
| Procedimiento eliminación datos | ✅ Documentado en política |

---

## 7. Dependencias (`npm audit`)

**5 vulnerabilidades** reportadas (0 críticas):

- 4 high en `next@14.2.35` (upstream — parches en Next 15/16)
- 1 moderate en `postcss` (dependencia de Next)

**Recomendación:** Mantener Next 14 por estabilidad del proyecto. Monitorear [Next.js security advisories](https://github.com/vercel/next.js/security/advisories). Actualizar a Next 15+ cuando sea conveniente.

---

## 8. Puntos pendientes para producción

| # | Ítem | Prioridad | Acción |
|---|------|-----------|--------|
| 1 | Placeholders legales (NIT, dirección, reservas) | Alta | Completar antes de lanzar |
| 2 | `NEXT_PUBLIC_SITE_URL` en Vercel | Alta | URL real post-deploy |
| 3 | Supabase Auth URLs | Alta | Site URL + redirects en dashboard |
| 4 | Storage bucket público | Media | Aceptable para demo; paths con UUID no adivinables |
| 5 | Rate limit in-memory | Baja | En serverless no es global; suficiente para demo/Hobby |
| 6 | Rotar service role si se expuso | Media | Si la key estuvo en chat/logs, regenerar en Supabase |
| 7 | Quitar fotos Unsplash del seed | Baja | Reemplazar con fotos reales del cliente |
| 8 | Marca AutoDemo → nombre real | Baja | Find & replace global |

---

## 9. Rotación de credenciales recomendada

Si la **service role key** se compartió en conversaciones o logs:

1. Supabase → **Settings → API** → **Regenerate** service_role key
2. Actualizar `.env.local` y variables en Vercel
3. No requiere cambios en código

---

## 10. Checklist final

```
[x] Middleware admin
[x] RLS definido en migrations
[x] Rate limit formularios
[x] Rate limit login
[x] Headers seguridad
[x] Env vars protegidas
[x] .gitignore reforzado
[x] Service role solo servidor
[x] CSP configurada
[x] Build pasa sin errores
[ ] Deploy Vercel (cliente)
[ ] URLs Supabase producción (cliente)
[ ] Placeholders legales (cliente)
```
