'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteVehicle } from '@/lib/actions/vehicles';
import { Button } from '@/components/ui/button';

type DeleteVehicleButtonProps = {
  vehicleId: string;
  vehicleName: string;
};

export function DeleteVehicleButton({
  vehicleId,
  vehicleName,
}: DeleteVehicleButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `¿Eliminar ${vehicleName}? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteVehicle(vehicleId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error ?? 'No se pudo eliminar');
      }
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={pending}
      className="text-[var(--status-sold-text)] hover:text-[var(--status-sold-text)]"
    >
      {pending ? 'Eliminando...' : 'Eliminar'}
    </Button>
  );
}
