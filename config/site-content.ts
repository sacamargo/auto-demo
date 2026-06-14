/**
 * Contenido editable del sitio (demo).
 * Reemplazar placeholders antes de producción con datos del cliente.
 */

export const financingContent = {
  hero: {
    eyebrow: 'Financiación',
    title: 'Tu vehículo, a tu ritmo',
    description:
      'Opciones de crédito vehicular con cuota inicial flexible, plazos adaptados y acompañamiento en todo el proceso. Sin letra pequeña imposible de leer.',
  },
  benefits: [
    {
      title: 'Cuota inicial flexible',
      description:
        'Desde 20% del valor del vehículo. Evaluamos tu perfil para proponer la mejor combinación cuota inicial + plazo.',
    },
    {
      title: 'Plazos hasta 72 meses',
      description:
        'Elige el plazo que se ajuste a tu flujo de caja. Simula distintos escenarios antes de decidir.',
    },
    {
      title: 'Trámite acompañado',
      description:
        'Te guiamos en documentación, estudio de crédito y desembolso. Un solo interlocutor de principio a fin.',
    },
    {
      title: 'Permuta y retoma',
      description:
        'Recibimos tu vehículo actual como parte de pago. Valoración transparente y aplicación directa a la cuota inicial.',
    },
  ],
  steps: [
    {
      step: '01',
      title: 'Elige tu vehículo',
      description: 'Explora el catálogo o cuéntanos qué buscas. Te orientamos sin presión.',
    },
    {
      step: '02',
      title: 'Simula tu cuota',
      description:
        'Usa la calculadora con el valor del vehículo, cuota inicial y plazo. Es una referencia, no una aprobación.',
    },
    {
      step: '03',
      title: 'Envía documentos',
      description:
        'Cédula, certificación laboral o ingresos, extractos bancarios recientes y formulario de solicitud.',
    },
    {
      step: '04',
      title: 'Aprobación y entrega',
      description:
        'Con crédito aprobado, firmamos, tramitamos matrícula si aplica y programamos la entrega.',
    },
  ],
  partners: [
    'Entidades financieras aliadas',
    'Fondeadores especializados en vehículos',
    'Opciones para independientes y pensionados',
  ],
  calculator: {
    /** Valor inicial en /financiacion (editable por el usuario) */
    defaultReferencePrice: 250_000_000,
    minPrice: 20_000_000,
    maxPrice: 2_000_000_000,
    defaultDownPaymentPercent: 30,
    defaultMonths: 48,
    /** Tasa nominal anual de referencia (decimal). Solo estimación demo. */
    defaultAnnualRate: 0.18,
    minDownPaymentPercent: 10,
    maxDownPaymentPercent: 70,
    monthOptions: [12, 24, 36, 48, 60, 72] as const,
    disclaimer:
      'La cuota mostrada es una estimación referencial. La tasa final, seguros, gastos de estudio y condiciones dependen del perfil crediticio y la entidad financiera. No constituye oferta vinculante.',
  },
  documents: [
    'Documento de identidad vigente',
    'Certificación laboral o soporte de ingresos (últimos 2 meses)',
    'Extractos bancarios o declaración de renta (según perfil)',
    'Referencia comercial o personal (si aplica)',
  ],
} as const;

export const faqContent = {
  hero: {
    eyebrow: 'Ayuda',
    title: 'Preguntas frecuentes',
    description:
      'Respuestas claras sobre compra, financiación, traspaso y garantías. Si no encuentras lo que buscas, escríbenos.',
  },
  categories: [
    {
      id: 'compra',
      title: 'Compra y financiación',
      items: [
        {
          question: '¿Puedo financiar cualquier vehículo del catálogo?',
          answer:
            'Sí, los vehículos disponibles y reservados pueden financiarse sujeto a estudio de crédito. Cada unidad tiene su propia simulación en la ficha de financiación.',
        },
        {
          question: '¿Cuál es la cuota inicial mínima?',
          answer:
            'Referencialmente desde el 20% del valor del vehículo, aunque puede variar según entidad financiera y perfil del solicitante.',
        },
        {
          question: '¿La simulación en la web es una aprobación?',
          answer:
            'No. La calculadora muestra una estimación con tasa de referencia. La cuota definitiva se confirma tras el estudio de crédito.',
        },
        {
          question: '¿Aceptan vehículo en permuta?',
          answer:
            'Sí. Valoramos tu vehículo actual y el monto se puede aplicar a la cuota inicial o al valor total de la operación.',
        },
      ],
    },
    {
      id: 'documentos',
      title: 'Documentación y trámite',
      items: [
        {
          question: '¿Qué documentos necesito para solicitar crédito?',
          answer:
            'Generalmente: cédula, soporte de ingresos, extractos bancarios y formulario de la entidad. Te enviamos la lista exacta según tu perfil (empleado, independiente o pensionado).',
        },
        {
          question: '¿Cuánto tarda la aprobación?',
          answer:
            'En promedio entre 1 y 3 días hábiles una vez recibida la documentación completa, dependiendo de la entidad financiera.',
        },
        {
          question: '¿El traspaso está incluido?',
          answer:
            'Las condiciones de traspaso, gastos notariales y SOAT varían por operación. Te entregamos un desglose antes de firmar.',
        },
      ],
    },
    {
      id: 'vehiculo',
      title: 'Vehículo y garantía',
      items: [
        {
          question: '¿Los vehículos usados tienen garantía?',
          answer:
            'Cada unidad se entrega con informe de estado y condiciones de garantía mecánica según antigüedad y kilometraje. Detallamos esto en la ficha del vehículo.',
        },
        {
          question: '¿Puedo ver el vehículo antes de comprar?',
          answer:
            'Sí. Agenda una visita o test drive por WhatsApp o formulario de contacto. Te confirmamos disponibilidad y horario.',
        },
        {
          question: '¿Qué significa el estado "Reservado"?',
          answer:
            'Hay un cliente en proceso de compra o crédito sobre esa unidad. Puedes expresar interés por si se libera.',
        },
      ],
    },
    {
      id: 'contacto',
      title: 'Contacto y visitas',
      items: [
        {
          question: '¿Cómo agendo una visita?',
          answer:
            'Escríbenos por WhatsApp, llama o usa el formulario de cotización. Indica el vehículo de interés y tu horario preferido.',
        },
        {
          question: '¿Entregan en otras ciudades?',
          answer:
            'Evaluamos logística de entrega fuera de la ciudad según el vehículo y destino. Consúltanos antes de cerrar la operación.',
        },
      ],
    },
  ],
} as const;

export const locationContent = {
  hero: {
    eyebrow: 'Visítanos',
    title: 'Ubicación y horarios',
    description:
      'Showroom en Riomar, Barranquilla. Te recomendamos agendar cita para asegurar disponibilidad del vehículo que te interesa.',
  },
  name: 'AutoDemo — Riomar',
  address: 'Cl. 98 #52-115, Riomar',
  city: 'Barranquilla, Atlántico',
  country: 'Colombia',
  fullAddress:
    'Cl. 98 #52-115, Riomar, Barranquilla, Atlántico, Colombia',
  /** Centro Comercial Buenavista — Cl. 98 #52-115 */
  coordinates: {
    lat: 11.013872,
    lng: -74.826721,
  },
  hours: [
    { days: 'Lunes a viernes', time: '9:00 a.m. – 6:00 p.m.' },
    { days: 'Sábados', time: '9:00 a.m. – 2:00 p.m.' },
    { days: 'Domingos y festivos', time: 'Cerrado' },
  ],
  parking: 'Parqueadero del centro comercial (Riomar).',
} as const;

export function getMapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=es&z=17&output=embed`;
}

export function getGoogleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getWazeUrl(lat: number, lng: number) {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}
