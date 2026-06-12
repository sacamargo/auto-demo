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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type CompareTableProps = {
  vehicles: Vehicle[];
};

type SpecRow = {
  label: string;
  value: (vehicle: Vehicle) => React.ReactNode;
};

const specRows: SpecRow[] = [
  {
    label: 'Precio',
    value: (v) => (
      <span className="font-mono">{formatPriceCop(v.price_cop)}</span>
    ),
  },
  { label: 'Año', value: (v) => v.year },
  { label: 'Kilometraje', value: (v) => formatMileage(v.mileage_km) },
  { label: 'Combustible', value: (v) => getFuelLabel(v.fuel_type) },
  { label: 'Transmisión', value: (v) => getTransmissionLabel(v.transmission) },
  { label: 'Color', value: (v) => v.color },
  { label: 'Estado', value: (v) => <Badge status={v.status} /> },
];

function getWhatsAppUrl(vehicle: Vehicle) {
  const message = encodeURIComponent(
    `Hola, comparé el ${vehicle.brand} ${vehicle.model} ${vehicle.year} en ${siteConfig.name} y me interesa. ¿Podemos hablar?`
  );
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`;
}

function getImage(vehicle: Vehicle) {
  const img = vehicle.vehicle_images?.[0];
  if (!img) return null;
  return resolveImageUrl(img.storage_path, process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function CompareTable({ vehicles }: CompareTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-36 border-b border-border p-4 text-left text-xs font-medium uppercase tracking-[0.1em] text-muted">
              —
            </th>
            {vehicles.map((vehicle) => {
              const imageUrl = getImage(vehicle);
              return (
                <th
                  key={vehicle.id}
                  className="border-b border-border p-4 text-left align-top font-normal"
                >
                  <Link
                    href={`/catalogo/${vehicle.slug}`}
                    className="group block space-y-3"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-background">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          fill
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                          sizes="200px"
                        />
                      )}
                    </div>
                    <p className="font-serif text-lg text-foreground">
                      {vehicle.brand} {vehicle.model}
                    </p>
                  </Link>
                  <Button
                    href={getWhatsAppUrl(vehicle)}
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                  >
                    WhatsApp
                  </Button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {specRows.map((row) => (
            <tr key={row.label} className="border-b border-border">
              <td className="p-4 text-xs font-medium uppercase tracking-[0.05em] text-muted">
                {row.label}
              </td>
              {vehicles.map((vehicle) => (
                <td key={vehicle.id} className="p-4 text-foreground">
                  {row.value(vehicle)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
