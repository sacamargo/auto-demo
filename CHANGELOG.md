# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).
Versionado [SemVer](https://semver.org/lang/es/).

## [Unreleased]

### Feature 3 — `feature/public-financing-faq-map` (v0.4.0, en preview)

- `/financiacion` — página general con calculadora, beneficios y pasos
- `/catalogo/[slug]/financiacion` — simulación por vehículo
- `/preguntas-frecuentes` — FAQ por categorías con acordeón
- `/ubicacion` — mapa, horarios y links Waze/Google Maps
- Contenido editable en `config/site-content.ts`

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
