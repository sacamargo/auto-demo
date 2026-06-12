# Contenido demo y placeholders

## Marca

| Campo | Valor demo | Cómo reemplazar |
|-------|------------|-----------------|
| Nombre | AutoDemo | Find & replace global `AutoDemo` |
| Email | demo@autodemo.co | `.env` + footer |
| WhatsApp | +57 300 000 0000 | `NEXT_PUBLIC_WHATSAPP=573000000000` |
| Dominio | autodemo.co | `NEXT_PUBLIC_SITE_URL` |

---

## Vehículos seed (8 unidades)

Ver tabla completa en [BASE-DE-DATOS.md](./BASE-DE-DATOS.md).

**Distribución de estados:**
- 6 disponibles
- 1 reservado (badge visible en catálogo)
- 1 vendido (solo visible en admin, no en catálogo público)

**Destacados (home):** BMW X3, Genesis GV70, Porsche Macan S

**Fotos Unsplash (ejemplos):**
```
https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200  # SUV blanco
https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200  # sedan premium
https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200  # interior
```
> Usar 2–4 fotos por vehículo. Atribución Unsplash no requerida pero recomendada en README.

---

## Páginas legales — estructura

### /politica-de-privacidad

Secciones obligatorias (Ley 1581/2012):

1. **Identificación del responsable**
   ```html
   <!-- PLACEHOLDER — Completar antes de producción -->
   <!-- Nombre/Razón social: [COMPLETAR] -->
   <!-- NIT: [COMPLETAR] -->
   <!-- Dirección: [COMPLETAR] -->
   <!-- Email: [COMPLETAR] -->
   ```

2. **Datos que recopilamos**
   - Nombre, teléfono, email (formularios de contacto/cotización)
   - Datos de navegación anónimos (analytics, si aplica)

3. **Finalidad del tratamiento**
   - Responder solicitudes de información
   - Gestionar cotizaciones e interés en vehículos
   - Mejorar el servicio

4. **Derechos del titular (Habeas Data)**
   - Conocer, actualizar, rectificar y suprimir datos
   - Revocar autorización
   - Procedimiento: email al responsable

5. **Transferencia a terceros**
   - Los datos NO se venden ni ceden a terceros con fines comerciales

6. **Seguridad**
   - Medidas técnicas para proteger la información

7. **Vigencia**
   - Datos conservados mientras exista relación comercial o obligación legal

---

### /terminos-y-condiciones

Secciones obligatorias (Ley 1480/2011):

1. **Naturaleza del sitio**
   - Sitio informativo; no constituye oferta vinculante

2. **Precios**
   - Referenciales, sujetos a cambio sin previo aviso
   - Precio final confirmado en concesionario

3. **Imágenes y descripciones**
   - Fotografías referenciales; el vehículo real puede variar

4. **Disponibilidad**
   - No se garantiza disponibilidad hasta confirmación de reserva

5. **Reservas y cancelaciones**
   ```html
   <!-- PLACEHOLDER — Completar antes de producción -->
   <!-- Política de reservas: [COMPLETAR — plazo, depósito, condiciones] -->
   <!-- Política de cancelación: [COMPLETAR — reembolsos, plazos] -->
   ```

6. **Propiedad intelectual**
   - Contenido del sitio propiedad de AutoDemo

7. **Limitación de responsabilidad**
   - El concesionario no responde por errores tipográficos en precios publicados

8. **Jurisdicción**
   - Leyes de la República de Colombia
   - Tribunales de [Ciudad, COMPLETAR]

---

## Formulario de cotización

Campos:
- Nombre (requerido)
- Teléfono (requerido)
- Email (requerido)
- Mensaje (opcional)
- Vehículo de interés (pre-llenado si viene de ficha)
- ☐ He leído y acepto la [Política de privacidad](/politica-de-privacidad) **(obligatorio)**

Mensaje de éxito: "Recibimos tu solicitud. Te contactaremos pronto."

---

## WhatsApp CTA

```typescript
const message = encodeURIComponent(
  `Hola, me interesa el ${brand} ${model} ${year} publicado en AutoDemo. ¿Está disponible?`
);
const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
```

---

## Textos UI admin (sin tecnicismos)

| Término técnico | Texto en panel |
|-----------------|----------------|
| CRUD | Agregar / Editar / Eliminar |
| Slug | (oculto, auto-generado) |
| Status | Estado: Disponible · Vendido · Reservado |
| Featured | ☑ Mostrar en página principal |
| Upload | Arrastra las fotos aquí o haz clic |
| Preview | Ver cómo se verá publicado |
| Save | Guardar y publicar |
