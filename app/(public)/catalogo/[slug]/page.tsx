import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import {
  getFuelLabel,
  getTransmissionLabel,
} from '@/lib/labels';
import { formatMileage, formatPriceCop } from '@/lib/vehicles';
import { getPublicVehicleSlugs, getVehicleBySlug } from '@/lib/vehicles.server';
import { CompareToggle } from '@/components/compare/compare-toggle';
import { QuoteForm } from '@/components/forms/quote-form';
import { VehicleGallery } from '@/components/catalog/vehicle-gallery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export const revalidate = false;

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getPublicVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return { title: 'Vehículo no encontrado' };
  }

  return {
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    description: vehicle.description.slice(0, 160),
  };
}

function getWhatsAppUrl(vehicle: {
  brand: string;
  model: string;
  year: number;
}) {
  const message = encodeURIComponent(
    `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.year} publicado en ${siteConfig.name}. ¿Está disponible?`
  );
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`;
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const images = vehicle.vehicle_images ?? [];

  return (
    <Container className="py-8 md:py-section">
      <div className="fade-in mb-3 md:mb-6">
        <Button href="/catalogo" variant="ghost" size="sm" className="-ms-2">
          ← Volver al catálogo
        </Button>
      </div>

      <div className="grid min-w-0 gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 laptop-l:gap-20">
        <div className="fade-in min-w-0">
          <VehicleGallery
            images={images}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
          />
        </div>

        <div className="fade-in fade-in-delay-1 min-w-0 space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4">
            {vehicle.status !== 'disponible' && (
              <Badge status={vehicle.status} />
            )}
            <h1 className="page-title">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-base text-muted min-[375px]:text-lg">
              {vehicle.year} · {getTransmissionLabel(vehicle.transmission)} ·{' '}
              {getFuelLabel(vehicle.fuel_type)}
            </p>
            <p className="price-display text-foreground">
              {formatPriceCop(vehicle.price_cop)}
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-4 border-y border-border py-5 text-sm min-[425px]:grid-cols-2 md:py-6">
            <SpecItem label="Kilometraje" value={formatMileage(vehicle.mileage_km)} />
            <SpecItem label="Color" value={vehicle.color} />
            <SpecItem label="Combustible" value={getFuelLabel(vehicle.fuel_type)} />
            <SpecItem
              label="Transmisión"
              value={getTransmissionLabel(vehicle.transmission)}
            />
          </dl>

          <div className="space-y-3">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
              Descripción
            </h2>
            <p className="text-muted leading-relaxed">{vehicle.description}</p>
          </div>

          <div className="action-stack">
            <Button href={getWhatsAppUrl(vehicle)} size="lg" className="action-btn">
              Contactar por WhatsApp
            </Button>
            <Button
              href={`/catalogo/${vehicle.slug}/financiacion`}
              variant="outline"
              size="lg"
              className="action-btn"
            >
              Simular financiación
            </Button>
            <Button href="#cotizacion" variant="ghost" size="lg" className="action-btn">
              Solicitar cotización
            </Button>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-5 min-[425px]:flex-row min-[425px]:items-center md:pt-6">
            <span className="text-sm text-muted">Comparar con otros:</span>
            <CompareToggle slug={vehicle.slug} />
          </div>
        </div>
      </div>

      <section
        id="cotizacion"
        className="mt-section border-t border-border pt-section"
      >
        <div className="grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
              Cotización
            </p>
            <h2 className="mt-3 font-serif text-2xl min-[375px]:text-3xl">
              ¿Te interesa este vehículo?
            </h2>
            <p className="mt-4 text-muted">
              Déjanos tus datos y te contactamos con disponibilidad, condiciones
              y próximos pasos.
            </p>
          </div>
          <QuoteForm
            vehicleId={vehicle.id}
            vehicleInterest={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
          />
        </div>
      </section>
    </Container>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
