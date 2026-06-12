import { Suspense } from 'react';
import { getPublicVehicles } from '@/lib/vehicles.server';
import { CompareView } from '@/components/compare/compare-view';

export const revalidate = false;

export const metadata = {
  title: 'Comparar',
  description: 'Compara hasta 3 vehículos lado a lado.',
};

export default async function CompararPage() {
  const vehicles = await getPublicVehicles();

  return (
    <Suspense
      fallback={
        <div className="py-section text-center text-muted">Cargando...</div>
      }
    >
      <CompareView allVehicles={vehicles} />
    </Suspense>
  );
}
