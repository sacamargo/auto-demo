# Checklist de seguridad — pre-deploy

> Auditoría Fase 5 completada. Ver reporte detallado en [AUDITORIA-SEGURIDAD.md](./AUDITORIA-SEGURIDAD.md).

---

## Autenticación y autorización

- [x] Middleware Next.js en `/admin/*` (no solo guard client-side)
- [x] Sesión verificada server-side en layouts admin
- [x] Rol admin en `app_metadata` de Supabase (no `user_metadata`)
- [x] `/api/revalidate` protegida con `REVALIDATE_SECRET`
- [x] Login con rate limit (10 intentos/min por IP)

---

## Supabase RLS

- [x] RLS definido en migrations (`vehicles`, `vehicle_images`, `leads`)
- [ ] **Verificar en Dashboard** que RLS está enabled en las 3 tablas
- [x] Escritura en `vehicles` solo para `is_admin()`
- [x] Lectura pública solo vehículos `disponible` / `reservado`
- [x] `leads`: INSERT público con `privacy_accepted = true`; SELECT solo admin
- [x] Storage: upload/delete solo admin
- [x] `SUPABASE_SERVICE_ROLE_KEY` **nunca** expuesta al cliente

---

## Variables de entorno

- [x] `.env.local` en `.gitignore`
- [x] `.env.example` documentado sin valores reales
- [x] Solo `NEXT_PUBLIC_*` para URL Supabase, publishable key, site URL, WhatsApp
- [x] Service role y secrets solo en servidor
- [ ] Vercel: env vars configuradas en dashboard (al deploy)

---

## Formularios y API

- [x] Validación con Zod en server
- [x] Sanitización de HTML en campos de texto (XSS)
- [x] Rate limiting: máx 5 envíos/min por IP en `/api/contacto`
- [x] Respuestas de error genéricas
- [x] Verificación de origin en producción (`/api/contacto`)

---

## Headers de seguridad (`next.config.mjs`)

- [x] `X-Frame-Options: DENY`
- [x] `X-Content-Type-Options: nosniff`
- [x] `Referrer-Policy: strict-origin-when-cross-origin`
- [x] `Permissions-Policy`
- [x] `Content-Security-Policy`
- [x] `Strict-Transport-Security` (producción)

---

## Imágenes y storage

- [x] Upload valida MIME type server-side
- [x] Tamaño máximo 5MB por imagen
- [x] URLs con UUID en path (no secuenciales)
- [ ] Bucket público — aceptable; considerar signed URLs en v2

---

## Dependencias

- [ ] `npm audit` sin vulnerabilidades críticas — **0 críticas**; 5 upstream en Next/postcss (ver auditoría)

---

## Legal y datos personales (Colombia)

- [x] Checkbox obligatorio en formularios
- [x] Política de privacidad (Ley 1581/2012)
- [ ] Placeholders del responsable — **completar antes de producción**

---

## Reporte post-auditoría

| Ítem | Estado | Notas |
|------|--------|-------|
| Middleware admin | ✅ OK | Solo matcher `/admin/*` |
| RLS Supabase | ✅ OK | Verificar enabled en dashboard |
| Rate limit formularios | ✅ OK | |
| Rate limit login | ✅ OK | |
| Headers seguridad | ✅ OK | |
| Env vars | ✅ OK | |
| CSP | ✅ OK | |
| Deploy | ⬜ Pendiente | Cliente |

**Puntos pendientes para producción:** ver §8 en [AUDITORIA-SEGURIDAD.md](./AUDITORIA-SEGURIDAD.md)
