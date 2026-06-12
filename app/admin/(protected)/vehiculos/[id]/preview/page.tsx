import { notFound } from 'next/navigation';
import { getVehicleAdmin } from '@/lib/admin/vehicles';
import {
  getFuelLabel,
  getTransmissionLabel,
} from '@/lib/labels';
import {
  formatMileage,
  formatPriceCop,
} from '@/lib/vehicles';
import { VehicleGallery } from '@/components/catalog/vehicle-gallery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Vista previa',
};

export const dynamic = 'force-dynamic';

type PageProps = {
  params: { id: string };
};

export default async function PreviewVehiclePage({ params }: PageProps) {
  const vehicle = await getVehicleAdmin(params.id);

  if (!vehicle) {
    notFound();
  }

  const isPublic =
    vehicle.status === 'disponible' || vehicle.status === 'reservado';

  return (
    <>
      <div className="border-b border-border bg-[var(--status-reserved-bg)] py-3">
        <Container className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--status-reserved-text)]">
            Vista previa — así se verá en el catálogo
            {!isPublic && ' (este vehículo no es visible públicamente)'}
          </p>
          <div className="flex gap-2">
            <Button href={`/admin/vehiculos/${vehicle.id}`} variant="outline" size="sm">
              Volver a editar
            </Button>
            {isPublic && (
              <Button href={`/catalogo/${vehicle.slug}`} variant="ghost" size="sm">
                Ver en el sitio
              </Button>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-section">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <VehicleGallery
            images={vehicle.vehicle_images ?? []}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
          />

          <div className="space-y-8">
            <div className="space-y-4">
              {vehicle.status !== 'disponible' && (
                <Badge status={vehicle.status} />
              )}
              <h1 className="text-4xl md:text-5xl">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-lg text-muted">
                {vehicle.year} · {getTransmissionLabel(vehicle.transmission)} ·{' '}
                {getFuelLabel(vehicle.fuel_type)}
              </p>
              <p className="font-mono text-3xl text-foreground">
                {formatPriceCop(vehicle.price_cop)}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-4 border-y border-border py-6 text-sm">
              <div>
                <dt className="text-xs text-muted">Kilometraje</dt>
                <dd className="mt-1">{formatMileage(vehicle.mileage_km)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Color</dt>
                <dd className="mt-1">{vehicle.color}</dd>
              </div>
            </dl>

            <p className="text-muted leading-relaxed">{vehicle.description}</p>
          </div>
        </div>
      </Container>
    </>
  );
}
