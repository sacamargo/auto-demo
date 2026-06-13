# Flujo Git — AutoDemo

Estrategia **Git Flow simplificado**: una feature por rama, preview en la rama, integración en `develop`, producción en `main`.

---

## Ramas

| Rama | Propósito | Deploy Vercel |
|------|-----------|---------------|
| `main` | Producción estable | **Production** → auto-demo-six.vercel.app |
| `develop` | Integración previa a prod | **Preview** permanente |
| `feature/*` | Una funcionalidad por rama | Preview automático por rama/PR |

---

## Convención de nombres

```
feature/admin-leads-inbox
feature/admin-dashboard-alerts
feature/public-financing-faq-map
fix/contact-form-origin
chore/update-deps
```

---

## Ciclo por feature (flujo acordado)

```bash
# 1. Partir de main actualizado
git checkout main
git pull origin main

# 2. Crear rama de feature
git checkout -b feature/nombre-descriptivo

# 3. Desarrollar y commitear
git add .
git commit -m "feat(admin): descripción breve"
git push -u origin feature/nombre-descriptivo

# 4. PROBAR en preview de Vercel (URL de la rama feature)
#    npm run build local también recomendado

# 5. Merge a develop → probar de nuevo
git checkout develop
git pull origin develop
git merge feature/nombre-descriptivo
git push origin develop
# Probar preview de develop

# 6. Merge a main → deploy producción
git checkout main
git pull origin main
git merge develop
git push origin main

# 7. Tag de versión
git tag -a v0.3.0 -m "Dashboard admin + alertas de lead"
git push origin v0.3.0
```

**Orden:** `main` → `feature/*` → probar → `develop` → probar → `main`

---

## Mensajes de commit

Formato: `tipo(alcance): descripción`

| Tipo | Uso |
|------|-----|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `style` | UI/CSS sin cambio de lógica |
| `refactor` | Refactor sin cambiar comportamiento |
| `chore` | Config, deps, scripts |

---

## Versionado (semver)

| Versión | Cuándo |
|---------|--------|
| **0.x.0** | Feature nueva (Fase 6) |
| **0.x.y** | Fixes y mejoras menores |
| **1.0.0** | Primer cliente real en producción |

Registrar cambios en [`CHANGELOG.md`](../CHANGELOG.md).

---

## Fase 6 — Roadmap

| # | Rama | Contenido | Versión |
|---|------|-----------|---------|
| 1 | `feature/admin-leads-inbox` | Bandeja leads | v0.2.0 ✅ |
| 2 | `feature/admin-dashboard-alerts` | Dashboard + alertas email | v0.3.0 |
| 3 | `feature/public-financing-faq-map` | Financiación, FAQ, mapa | v0.4.0 |

---

## Reglas

1. **Nunca** commitear `.env.local` ni secretos.
2. **Una feature = una rama** — no mezclar funcionalidades.
3. **Migration SQL** — ejecutar en Supabase antes de probar preview.
4. **`npm run build`** antes de merge a `develop`.
5. **Producción solo desde `main`**, siempre después de probar en `develop`.

---

## Vercel

- **Production Branch:** `main`
- **Preview:** `develop`, `feature/*` y PRs
- Variables de entorno: duplicar en **Production** y **Preview**
