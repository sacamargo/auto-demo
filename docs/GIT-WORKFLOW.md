# Flujo Git — AutoDemo

Estrategia **Git Flow simplificado** para features claras, preview en `develop` y producción en `main`.

---

## Ramas

| Rama | Propósito | Deploy Vercel |
|------|-----------|---------------|
| `main` | Producción estable | **Production** → auto-demo-six.vercel.app |
| `develop` | Integración y pruebas | **Preview** permanente (opcional) |
| `feature/*` | Una funcionalidad por rama | Preview automático por PR |

---

## Convención de nombres

```
feature/admin-leads-inbox
feature/admin-dashboard-alerts
feature/public-financing-faq-map
fix/contact-form-origin
chore/update-deps
```

- **feature/** — funcionalidad nueva
- **fix/** — corrección de bug
- **chore/** — mantenimiento (deps, docs, config)

---

## Ciclo por feature

```bash
# 1. Partir siempre de develop actualizado
git checkout develop
git pull origin develop

# 2. Crear rama de feature
git checkout -b feature/nombre-descriptivo

# 3. Trabajar, commitear con mensajes claros
git add .
git commit -m "feat(admin): descripción breve del cambio"

# 4. Subir y abrir PR hacia develop (recomendado)
git push -u origin feature/nombre-descriptivo
# GitHub → Pull Request: feature/... → develop

# 5. Probar en preview de Vercel (URL del PR o de develop)

# 6. Merge a develop
git checkout develop
git merge feature/nombre-descriptivo
git push origin develop

# 7. Cuando develop esté estable → release a producción
git checkout main
git merge develop
git push origin main

# 8. Tag de versión (opcional pero recomendado)
git tag -a v0.2.0 -m "Bandeja de leads + dashboard"
git push origin v0.2.0
```

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

Ejemplos:
```
feat(admin): bandeja de leads con filtros por estado
feat(public): página de financiación con FAQ
fix(api): validación origin en formulario contacto
docs: actualizar GIT-WORKFLOW
```

---

## Versionado (semver)

| Versión | Cuándo |
|---------|--------|
| **0.x.0** | Feature nueva (Fase 6) |
| **0.x.y** | Fixes y mejoras menores |
| **1.0.0** | Primer cliente real en producción |

Registrar cambios en [`CHANGELOG.md`](../CHANGELOG.md).

---

## Fase 6 — Roadmap de features

| # | Rama | Contenido | Versión |
|---|------|-----------|---------|
| 1 | `feature/admin-leads-inbox` | Bandeja leads, estados, notas | v0.2.0 |
| 2 | `feature/admin-dashboard-alerts` | Dashboard + alertas email | v0.3.0 |
| 3 | `feature/public-financing-faq-map` | Financiación, FAQ, mapa | v0.4.0 |

---

## Reglas

1. **Nunca** commitear `.env.local` ni secretos.
2. **Una feature = una rama** — no mezclar leads + financiación en la misma rama.
3. **Migration SQL** — numerar en orden (`004_...sql`); ejecutar en Supabase antes de probar en preview.
4. **Build local** antes de merge a `develop`: `npm run build`
5. **Producción solo desde `main`** — nunca push directo a main sin pasar por develop.

---

## Vercel — configuración recomendada

- **Production Branch:** `main`
- **Preview:** todas las demás ramas (incl. `develop`)
- Variables de entorno: duplicar en **Production** y **Preview**
