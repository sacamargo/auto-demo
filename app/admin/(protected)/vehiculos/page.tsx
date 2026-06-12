import { getAllVehiclesAdmin } from '@/lib/admin/vehicles';
import { VehicleList } from '@/components/admin/vehicle-list';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Inventario',
};

export const dynamic = 'force-dynamic';

export default async function AdminVehiclesPage() {
  const vehicles = await getAllVehiclesAdmin();

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl">Inventario</h1>
          <p className="mt-2 text-sm text-muted">
            {vehicles.length} vehículos en total
          </p>
        </div>
        <Button href="/admin/vehiculos/nuevo">Agregar vehículo</Button>
      </div>

      <div className="mt-8">
        <VehicleList vehicles={vehicles} />
      </div>
    </Container>
  );
}
