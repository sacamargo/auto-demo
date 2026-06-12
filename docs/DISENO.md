# Sistema de diseño

> **Regla:** Instalar y seguir **minimalist-ui** (Taste Skill) y **emil-design-eng** antes de escribir UI.

```bash
npx skills add Leonxlnx/taste-skill --skill "minimalist-ui"
npx skills add emilkowalski/skill
```

Instaladas en `.agents/skills/` del proyecto.

---

## Dirección visual

**Estilo:** Minimalista editorial, premium automotriz.  
**Referencias de tono:** Tesla, Volvo, Genesis — no TuCarro ni OLX.

| Atributo | Sí | No |
|----------|----|----|
| Espacio | Mucho whitespace, grid asimétrico | Layout apretado tipo marketplace |
| Color | Blanco roto, negro profundo, 1 acento | Azul/verde default, gradientes |
| Forma | Bordes mínimos (0–4px) | Border-radius 16px+ everywhere |
| Sombra | Casi ninguna o muy sutil | drop-shadow-xl en tarjetas |
| Tipografía | Serif display + sans body | Inter, Roboto, system-ui genérico |
| Tarjetas | Galería de producto premium | Card e-commerce con badge "OFERTA" |

---

## Paleta propuesta (decisión del agente)

```css
/* tokens — ajustar en Fase 1 tras instalar minimalist-skill */

--color-background:     #F7F6F3;   /* blanco roto cálido */
--color-surface:        #FFFFFF;
--color-foreground:     #0A0A0A;   /* negro profundo */
--color-muted:          #6B6B6B;
--color-border:         #E5E4E0;
--color-accent:         #8B7355;   /* bronce/cobre sutil — acento único */
--color-accent-hover:   #6F5C44;
--color-success:        #2D5016;   /* vendido/reservado badges */
--color-error:          #7A1F1F;
```

**Modo oscuro:** opcional en v2. Priorizar light mode premium para demo.

---

## Tipografía propuesta

| Rol | Fuente sugerida | Fallback | Uso |
|-----|-----------------|----------|-----|
| Display / H1–H2 | **Instrument Serif** o **Fraunces** | Georgia, serif | Headlines, hero |
| Body / UI | **DM Sans** o **Satoshi** | system-ui | Párrafos, labels, nav |
| Mono / precios | **JetBrains Mono** | monospace | Precios COP tabulares |

- Self-hosted en `/public/fonts/` — sin depender de Google Fonts CDN en producción
- Escala tipográfica tight: H1 3.5rem → H2 2.25rem → body 1rem → small 0.875rem
- Letter-spacing negativo en headings (-0.02em)

---

## Espaciado y grid

```
Container max-width: 1280px
Padding horizontal: 24px mobile → 48px desktop
Grid catálogo: 1 col mobile → 2 col tablet → 3 col desktop
Gap entre tarjetas: 32px (no 16px apretado)
Section spacing: 80px–120px vertical
```

---

## Componentes clave

### VehicleCard (galería premium)

```
┌─────────────────────────────┐
│                             │
│      Imagen 4:3             │  ← aspect-ratio fijo, object-cover
│      (hover: scale 1.02)    │  ← emilkowalski: transform suave
│                             │
├─────────────────────────────┤
│ BMW X3                      │  ← serif, 1.125rem
│ 2022 · Automática           │  ← muted, 0.875rem
│                             │
│ $245.000.000                │  ← mono, foreground
│                             │
│ [ Comparar ]  [ WhatsApp ]  │  ← ghost buttons, sin fill agresivo
└─────────────────────────────┘
```

- Sin sombra por defecto; borde 1px `--color-border`
- Hover: borde → `--color-foreground`, imagen scale
- Badge estado (reservado): pill minimal, no banner rojo

### Header

- Logo SVG tipográfico "AutoDemo" (serif)
- Nav: Inicio · Catálogo · Comparar · Contacto
- Sticky con backdrop-blur sutil al scroll

### Admin panel

- **Sin sidebar.** Top nav simple: Inventario · Nuevo vehículo · Cerrar sesión
- Formularios en una columna, labels claros en español coloquial
- Drag & drop zone con borde punteado, feedback visual al arrastrar

---

## Animaciones (emilkowalski/skill)

| Elemento | Animación | Duración |
|----------|-----------|----------|
| VehicleCard hover | scale(1.02) + border-color | 200ms ease-out |
| Filtros toggle | height + opacity | 250ms |
| Galería lightbox | fade + scale from 0.95 | 300ms |
| Page transition | opacity fade | 150ms |
| Stagger en grid | delay 50ms por item | al mount |

**Evitar:** bounce, spring exagerado, parallax, animaciones en scroll infinito.

---

## Logo SVG

Tipográfico puro — sin icono de carro:

```svg
<!-- components/layout/Logo.tsx -->
<text font-family="Instrument Serif" font-size="24" fill="currentColor">
  AutoDemo
</text>
```

Variante: "Auto" en regular + "Demo" en italic o weight lighter.

---

## Responsive breakpoints

```css
sm: 640px   /* móvil landscape */
md: 768px   /* tablet */
lg: 1024px  /* desktop */
xl: 1280px  /* wide */
```

Mobile-first en todos los componentes.

---

## Checklist diseño pre-lanzamiento

- [x] Ningún componente usa colores Tailwind default (`blue-500`, `green-600`)
- [x] Headings usan serif; body usa sans
- [x] Tarjetas no tienen `rounded-2xl shadow-lg`
- [ ] Admin no parece dashboard genérico
- [ ] Páginas legales usan mismo header/footer
- [ ] Lighthouse Accessibility > 90
