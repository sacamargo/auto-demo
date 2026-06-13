# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).
Versionado [SemVer](https://semver.org/lang/es/).

## [Unreleased]

### Fase 6 — pendiente

- Dashboard + alertas de lead (`feature/admin-dashboard-alerts`)
- Páginas Financiación, FAQ y Mapa (`feature/public-financing-faq-map`)

---

## [0.2.0] — 2025-06-12

### Added

- Bandeja de leads en `/admin/leads` con filtros por estado
- Estados: nuevo, contactado, cerrado, descartado
- Notas internas por lead
- Migration `004_leads_admin.sql`
- Componentes reutilizables: `FadeIn`, `AdminPageHeader`, `StatCard`
- Flujo Git documentado en `docs/GIT-WORKFLOW.md`

### Changed

- Nav admin con link Leads y badge de nuevos

---

## [0.1.0] — 2025-06-12

Primera versión en producción.

### Added

- Catálogo público con filtros, comparador y fichas SSG
- Formulario de contacto con rate limit y RLS
- Panel admin CRUD vehículos + upload imágenes
- Páginas legales (privacidad, términos)
- Headers de seguridad, middleware admin, auditoría Fase 5

### Deploy

- Producción: https://auto-demo-six.vercel.app

[Unreleased]: https://github.com/sacamargo/auto-demo/compare/v0.1.0...develop
[0.1.0]: https://github.com/sacamargo/auto-demo/releases/tag/v0.1.0
