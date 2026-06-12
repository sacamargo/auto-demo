import { formatPriceCop } from '@/lib/vehicles';
import type { Vehicle } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeleteVehicleButton } from '@/components/admin/delete-vehicle-button';

type VehicleListProps = {
  vehicles: Vehicle[];
};

export function VehicleList({ vehicles }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="rounded-md border border-border bg-surface p-12 text-center">
        <p className="font-serif text-xl">Sin vehículos todavía</p>
        <p className="mt-2 text-sm text-muted">
          Agrega el primer vehículo al inventario.
        </p>
        <Button href="/admin/vehiculos/nuevo" className="mt-6">
          Agregar vehículo
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-surface">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="p-4 text-xs font-medium uppercase tracking-[0.05em] text-muted">
              Vehículo
            </th>
            <th className="p-4 text-xs font-medium uppercase tracking-[0.05em] text-muted">
              Año
            </th>
            <th className="p-4 text-xs font-medium uppercase tracking-[0.05em] text-muted">
              Precio
            </th>
            <th className="p-4 text-xs font-medium uppercase tracking-[0.05em] text-muted">
              Estado
            </th>
            <th className="p-4 text-xs font-medium uppercase tracking-[0.05em] text-muted">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="border-b border-border last:border-0">
              <td className="p-4">
                <p className="font-medium text-foreground">
                  {vehicle.brand} {vehicle.model}
                </p>
                {vehicle.featured && (
                  <p className="mt-0.5 text-xs text-accent">Destacado</p>
                )}
              </td>
              <td className="p-4 text-muted">{vehicle.year}</td>
              <td className="p-4 font-mono text-foreground">
                {formatPriceCop(vehicle.price_cop)}
              </td>
              <td className="p-4">
                <Badge status={vehicle.status} />
              </td>
              <td className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    href={`/admin/vehiculos/${vehicle.id}`}
                    variant="outline"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    href={`/admin/vehiculos/${vehicle.id}/preview`}
                    variant="ghost"
                    size="sm"
                  >
                    Vista previa
                  </Button>
                  <DeleteVehicleButton
                    vehicleId={vehicle.id}
                    vehicleName={`${vehicle.brand} ${vehicle.model}`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
