import { getPublicVehicles } from '@/lib/vehicles.server';
import { CatalogView } from '@/components/catalog/catalog-view';

export const revalidate = false;

export const metadata = {
  title: 'Catálogo',
  description: 'Explora el inventario de vehículos premium disponibles.',
};

export default async function CatalogoPage() {
  const vehicles = await getPublicVehicles();

  return <CatalogView vehicles={vehicles} />;
}
