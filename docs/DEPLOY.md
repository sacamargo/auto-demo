# Guía de deploy — GitHub + Vercel

> El deploy lo haces tú. Esta guía deja el proyecto listo para subirlo a GitHub y desplegarlo en Vercel.

---

## 1. Antes de subir a GitHub

### Verificar que NO se suben secretos

```bash
# Estos archivos NO deben aparecer en git status:
git status

# Confirmar que .env.local está ignorado:
git check-ignore -v .env.local
```

**Nunca commitear:**
- `.env.local`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REVALIDATE_SECRET`
- Cualquier JWT o API key real

**Sí commitear:**
- `.env.example` (solo placeholders)
- Todo el código fuente
- `supabase/migrations/` y `supabase/seed.sql`

### Build local final

```bash
npm run build
npm run start   # opcional: probar en http://localhost:3000
```

---

## 2. Subir a GitHub

```bash
cd /Users/santiagocamargo/Documents/agencia/landing-carros

# Si es el primer commit:
git add .
git status    # revisar que .env.local NO esté listado
git commit -m "AutoDemo: sitio concesionario premium listo para producción"

# Crear repo en github.com (vacío, sin README)
git remote add origin https://github.com/TU_USUARIO/landing-carros.git
git branch -M main
git push -u origin main
```

---

## 3. Desplegar en Vercel

1. [vercel.com](https://vercel.com) → **Add New Project**
2. Importa el repo de GitHub
3. Framework: **Next.js** (detectado automáticamente)
4. **Environment Variables** — agregar todas:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://babdnxlifdxamwfukzxl.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Tu publishable key | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://auto-demo.vercel.app` (opcional — ya es el fallback en código) | Production |
| `NEXT_PUBLIC_WHATSAPP` | `573028621190` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (secreta) | Production |
| `REVALIDATE_SECRET` | String aleatorio largo | Production |

5. **Deploy**

### URL de producción

**`https://auto-demo.vercel.app`**

Definida en `config/site.ts` como fallback en producción. Opcionalmente puedes repetirla en Vercel como `NEXT_PUBLIC_SITE_URL`.

En **Supabase → Authentication → URL Configuration**:
- **Site URL:** `https://auto-demo.vercel.app`
- **Redirect URLs:** `https://auto-demo.vercel.app/**`

---

## 4. Supabase en producción

- [ ] Migrations ejecutadas (001, 002, 003)
- [ ] Seed ejecutado (o inventario real cargado desde admin)
- [ ] Usuario admin con `app_metadata: { "role": "admin" }`
- [ ] RLS activo en todas las tablas (verificar en Dashboard → Database → Policies)

---

## 5. Checklist post-deploy

- [ ] Home carga con vehículos
- [ ] `/catalogo` y fichas funcionan
- [ ] Formulario de contacto guarda en `leads`
- [ ] `/admin/login` accesible y protegido
- [ ] CRUD admin funciona
- [ ] Páginas legales cargan
- [ ] WhatsApp abre con número correcto
- [ ] Completar placeholders legales (NIT, dirección, reservas)

---

## 6. Monitoreo de costos

- Vercel Dashboard → **Usage**
- El catálogo es estático (ISR) — costo bajo en plan Hobby
- Ver [COSTOS-VERCEL.md](./COSTOS-VERCEL.md)

---

## 7. Dominio propio (opcional)

1. Vercel → Project → **Domains** → agregar dominio
2. Configurar DNS según instrucciones de Vercel
3. Si cambias de dominio, actualizar `PRODUCTION_SITE_URL` en `config/site.ts` y Supabase Auth URLs
4. Actualizar URLs en Supabase Auth
