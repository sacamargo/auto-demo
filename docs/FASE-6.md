# Fase 6 — Valor comercial

Mejoras orientadas a dolores del concesionario. Una feature por rama, merge a `develop`, luego `main`.

Ver [GIT-WORKFLOW.md](./GIT-WORKFLOW.md).

---

## Feature 1 — Bandeja de leads (`feature/admin-leads-inbox`) → v0.2.0

**Dolor:** leads perdidos, sin seguimiento.

| Entregable | Detalle |
|------------|---------|
| Migration `004_leads_admin.sql` | `status`, `admin_notes`, `updated_at` |
| `/admin/leads` | Lista con filtros por estado |
| Estados | nuevo · contactado · cerrado · descartado |
| Notas internas | Textarea editable por lead |
| Nav admin | Link "Leads" con contador de nuevos |

---

## Feature 2 — Dashboard + alertas (`feature/admin-dashboard-alerts`) → v0.3.0

**Dolor:** cero visibilidad, respuesta tardía.

| Entregable | Detalle |
|------------|---------|
| `/admin` dashboard | Stats: leads semana, nuevos, inventario |
| Alerta email | Al crear lead → email al admin |
| Env | `ADMIN_ALERT_EMAIL`, `RESEND_API_KEY` (o similar) |

---

## Feature 3 — Financiación + FAQ + Mapa (`feature/public-financing-faq-map`) → v0.4.0

**Dolor:** mismas preguntas, falta de confianza, no encuentran el lote.

| Entregable | Detalle |
|------------|---------|
| `/financiacion` | Cuotas, permuta, garantía |
| `/preguntas-frecuentes` | FAQ accordion reutilizable |
| `/ubicacion` | Mapa, horarios, Waze |
| Config | `config/site-content.ts` editable |
| Nav + footer | Links a nuevas páginas |

---

## Componentes compartidos (Fase 6)

| Componente | Uso |
|------------|-----|
| `FadeIn` | Animación scroll reveal |
| `AdminPageHeader` | Título + acciones admin |
| `StatCard` | Dashboard métricas |
| `ContentSection` | Páginas públicas editoriales |
| `FaqAccordion` | FAQ reutilizable |
