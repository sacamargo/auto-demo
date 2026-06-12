import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getFuelLabel, getTransmissionLabel } from '@/lib/labels';
import {
  formatMileage,
  formatPriceCop,
  resolveImageUrl,
} from '@/lib/vehicles';
import type { Vehicle } from '@/types/database';
import { CompareToggle } from '@/components/compare/compare-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type VehicleCardProps = {
  vehicle: Vehicle;
  index?: number;
  className?: string;
};

function getPrimaryImage(vehicle: Vehicle) {
  const image = vehicle.vehicle_images?.[0];
  if (!image) return null;
  return resolveImageUrl(
    image.storage_path,
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
}

function getWhatsAppUrl(vehicle: Vehicle) {
  const message = encodeURIComponent(
    `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.year} publicado en ${siteConfig.name}. ¿Está disponible?`
  );
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`;
}

export function VehicleCard({ vehicle, index = 0, className }: VehicleCardProps) {
  const imageUrl = getPrimaryImage(vehicle);
  const delayClass =
    index === 1 ? 'fade-in-delay-1' : index === 2 ? 'fade-in-delay-2' : index >= 3 ? 'fade-in-delay-3' : '';

  return (
    <article
      className={cn(
        'group fade-in flex flex-col overflow-hidden rounded-md border border-border bg-surface card-hover',
        delayClass,
        className
      )}
      style={{ animationDelay: index > 3 ? `${index * 80}ms` : undefined }}
    >
      <Link href={`/catalogo/${vehicle.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-background">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
            fill
            className="image-hover object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Sin imagen
          </div>
        )}
        {vehicle.status !== 'disponible' && (
          <div className="absolute left-4 top-4">
            <Badge status={vehicle.status} />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="space-y-2">
          <Link href={`/catalogo/${vehicle.slug}`}>
            <h3 className="font-serif text-xl text-foreground">
              {vehicle.brand} {vehicle.model}
            </h3>
          </Link>
          <p className="text-sm text-muted">
            {vehicle.year} · {getTransmissionLabel(vehicle.transmission)} ·{' '}
            {getFuelLabel(vehicle.fuel_type)}
          </p>
          <p className="text-xs text-muted">{formatMileage(vehicle.mileage_km)}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-lg text-foreground">
            {formatPriceCop(vehicle.price_cop)}
          </p>
          <CompareToggle slug={vehicle.slug} />
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <Button href={`/catalogo/${vehicle.slug}`} variant="outline" size="sm" className="flex-1">
            Ver detalle
          </Button>
          <Button
            href={getWhatsAppUrl(vehicle)}
            variant="ghost"
            size="sm"
            className="flex-1"
          >
            WhatsApp
          </Button>
        </div>
      </div>
    </article>
  );
}
