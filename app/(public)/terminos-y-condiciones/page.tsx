import { siteConfig } from '@/config/site';
import {
  LegalDocument,
  LegalPlaceholder,
  LegalSection,
} from '@/components/legal/legal-document';

export const metadata = {
  title: 'Términos y condiciones',
  description: 'Condiciones de uso del sitio web conforme al Estatuto del Consumidor (Ley 1480 de 2011).',
};

export default function TerminosCondicionesPage() {
  return (
    <LegalDocument
      title="Términos y condiciones"
      subtitle="Condiciones de uso"
      lastUpdated="11 de junio de 2025"
    >
      <LegalSection title="1. Naturaleza del sitio">
        <p>
          El sitio web de {siteConfig.name} tiene fines informativos sobre el
          inventario de vehículos disponibles. La información publicada no constituye
          una oferta vinculante ni un contrato de compraventa hasta que sea confirmada
          directamente con el concesionario.
        </p>
      </LegalSection>

      <LegalSection title="2. Precios">
        <p>
          Los precios mostrados son referenciales y están expresados en pesos
          colombianos (COP). Pueden variar sin previo aviso. El precio final, formas
          de pago y condiciones comerciales se confirman en el concesionario al
          momento de la negociación.
        </p>
      </LegalSection>

      <LegalSection title="3. Imágenes y descripciones">
        <p>
          Las fotografías y descripciones de los vehículos son referenciales. El
          vehículo real puede presentar diferencias en color, equipamiento o estado
          respecto a lo publicado. Te invitamos a verificar los detalles en persona
          o solicitar información adicional antes de tomar una decisión.
        </p>
      </LegalSection>

      <LegalSection title="4. Disponibilidad">
        <p>
          La publicación de un vehículo en el sitio no garantiza su disponibilidad.
          Un vehículo puede estar reservado o vendido antes de que actualicemos el
          inventario. La disponibilidad se confirma únicamente tras validación
          directa con nuestro equipo.
        </p>
      </LegalSection>

      <LegalSection title="5. Reservas y cancelaciones">
        <LegalPlaceholder>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Política de reservas: [COMPLETAR — plazo de reserva, depósito
              requerido, condiciones]
            </li>
            <li>
              Política de cancelación: [COMPLETAR — reembolsos, plazos, penalidades]
            </li>
          </ul>
        </LegalPlaceholder>
      </LegalSection>

      <LegalSection title="6. Propiedad intelectual">
        <p>
          El contenido de este sitio — textos, imágenes, diseño y código — es
          propiedad de {siteConfig.name} o de sus licenciantes. No está permitida su
          reproducción, distribución o uso comercial sin autorización previa por
          escrito.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitación de responsabilidad">
        <p>
          {siteConfig.name} no se hace responsable por errores tipográficos en
          precios o especificaciones publicadas, interrupciones temporales del
          sitio, ni por decisiones tomadas exclusivamente con base en la información
          del sitio sin confirmación directa.
        </p>
      </LegalSection>

      <LegalSection title="8. Protección al consumidor">
        <p>
          En lo no previsto en estos términos, aplican las disposiciones de la Ley
          1480 de 2011 (Estatuto del Consumidor) y las normas complementarias
          vigentes en Colombia.
        </p>
      </LegalSection>

      <LegalSection title="9. Jurisdicción">
        <p>
          Estos términos se rigen por las leyes de la República de Colombia.
        </p>
        <LegalPlaceholder>
          <p>Tribunales competentes: [COMPLETAR — ciudad, departamento]</p>
        </LegalPlaceholder>
      </LegalSection>

      <LegalSection title="10. Contacto">
        <p>
          Para consultas sobre estos términos, contáctanos en{' '}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-foreground underline underline-offset-2 hover:text-accent"
          >
            {siteConfig.contact.email}
          </a>{' '}
          o al {siteConfig.contact.whatsappDisplay}.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
