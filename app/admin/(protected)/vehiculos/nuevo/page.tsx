import { VehicleForm } from '@/components/admin/vehicle-form';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Agregar vehículo',
};

export default function NewVehiclePage() {
  return (
    <Container narrow className="max-w-3xl py-10">
      <h1 className="text-3xl">Agregar vehículo</h1>
      <p className="mt-2 text-sm text-muted">
        Completa la información y sube las fotos. Los cambios se publican al guardar.
      </p>
      <div className="mt-8">
        <VehicleForm />
      </div>
    </Container>
  );
}
