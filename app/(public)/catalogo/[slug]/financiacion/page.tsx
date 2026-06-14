import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FinancingPageContent } from '@/components/content/financing-page-content';
import { Container } from '@/components/layout/container';
import {
  getPublicVehicleSlugs,
  getVehicleBySlug,
} from '@/lib/vehicles.server';
import { formatPriceCop } from '@/lib/vehicles';

export const revalidate = false;

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getPublicVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const vehicle = await getVehicleBySlug(params.slug);

  if (!vehicle) {
    return { title: 'Financiación' };
  }

  return {
    title: `Financiación — ${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    description: `Simula la cuota para el ${vehicle.brand} ${vehicle.model} ${vehicle.year} desde ${formatPriceCop(vehicle.price_cop)}.`,
  };
}

export default async function VehicleFinancingPage({ params }: PageProps) {
  const vehicle = await getVehicleBySlug(params.slug);

  if (!vehicle) {
    notFound();
  }

  return (
    <Container className="py-section">
      <FinancingPageContent
        vehicle={vehicle}
        backHref={`/catalogo/${vehicle.slug}`}
        backLabel="Volver a la ficha"
      />
    </Container>
  );
}
