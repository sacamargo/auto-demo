import { siteConfig } from '@/config/site';
import {
  LegalDocument,
  LegalPlaceholder,
  LegalSection,
} from '@/components/legal/legal-document';

export const metadata = {
  title: 'Política de privacidad',
  description: 'Política de tratamiento de datos personales conforme a la Ley 1581 de 2012.',
};

export default function PoliticaPrivacidadPage() {
  return (
    <LegalDocument
      title="Política de privacidad"
      subtitle="Protección de datos personales"
      lastUpdated="11 de junio de 2025"
    >
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          {siteConfig.name} es responsable del tratamiento de los datos personales
          recopilados a través de este sitio web, de conformidad con la Ley 1581 de
          2012 y el Decreto 1377 de 2013 (Colombia).
        </p>
        <LegalPlaceholder>
          <ul className="list-inside list-disc space-y-1">
            <li>Nombre o razón social: [COMPLETAR]</li>
            <li>NIT: [COMPLETAR]</li>
            <li>Dirección: [COMPLETAR]</li>
            <li>Correo de contacto: [COMPLETAR]</li>
          </ul>
        </LegalPlaceholder>
      </LegalSection>

      <LegalSection title="2. Datos que recopilamos">
        <p>A través de los formularios de contacto y cotización recopilamos:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Nombre completo</li>
          <li>Número de teléfono</li>
          <li>Correo electrónico</li>
          <li>Mensaje o consulta (opcional)</li>
          <li>Vehículo de interés (cuando aplica)</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Finalidad del tratamiento">
        <p>Utilizamos tus datos personales para:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Responder solicitudes de información y cotización</li>
          <li>Gestionar tu interés en vehículos del inventario</li>
          <li>Contactarte por los medios que nos proporcionaste</li>
          <li>Cumplir obligaciones legales aplicables</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Derechos del titular (Habeas Data)">
        <p>
          Como titular de datos personales, tienes derecho a conocer, actualizar,
          rectificar y suprimir tu información, así como a revocar la autorización
          otorgada para su tratamiento.
        </p>
        <p>
          Para ejercer estos derechos, envía una solicitud al correo del responsable
          del tratamiento indicado arriba, incluyendo tu nombre completo, documento de
          identidad y descripción clara de la solicitud.
        </p>
      </LegalSection>

      <LegalSection title="5. Transferencia y venta de datos">
        <p>
          Tus datos personales no se venden ni se ceden a terceros con fines
          comerciales. Solo podrán compartirse cuando sea necesario para cumplir una
          obligación legal o con proveedores que nos ayudan a operar el sitio (por
          ejemplo, hosting), bajo acuerdos de confidencialidad.
        </p>
      </LegalSection>

      <LegalSection title="6. Seguridad">
        <p>
          Implementamos medidas técnicas y organizativas razonables para proteger tus
          datos contra acceso no autorizado, pérdida o alteración. Ningún sistema en
          internet es 100% seguro, pero trabajamos para mantener estándares adecuados.
        </p>
      </LegalSection>

      <LegalSection title="7. Vigencia">
        <p>
          Conservaremos tus datos mientras exista una relación comercial o de consulta
          activa, o mientras sea necesario para cumplir obligaciones legales. Una vez
          cumplida la finalidad, procederemos a su eliminación o anonimización.
        </p>
      </LegalSection>

      <LegalSection title="8. Contacto">
        <p>
          Para preguntas sobre esta política o el tratamiento de tus datos, escríbenos
          a{' '}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-foreground underline underline-offset-2 hover:text-accent"
          >
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
