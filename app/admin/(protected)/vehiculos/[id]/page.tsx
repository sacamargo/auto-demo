import { notFound } from 'next/navigation';
import { getVehicleAdmin } from '@/lib/admin/vehicles';
import { VehicleForm } from '@/components/admin/vehicle-form';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Editar vehículo',
};

export const dynamic = 'force-dynamic';

type PageProps = {
  params: { id: string };
};

export default async function EditVehiclePage({ params }: PageProps) {
  const vehicle = await getVehicleAdmin(params.id);

  if (!vehicle) {
    notFound();
  }

  return (
    <Container narrow className="max-w-3xl py-10">
      <h1 className="text-3xl">
        Editar {vehicle.brand} {vehicle.model}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Modifica los datos y guarda para actualizar el catálogo público.
      </p>
      <div className="mt-8">
        <VehicleForm vehicle={vehicle} />
      </div>
    </Container>
  );
}
