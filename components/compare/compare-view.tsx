'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Vehicle } from '@/types/database';
import { MAX_COMPARE, useCompare } from '@/components/compare/compare-context';
import { CompareTable } from '@/components/compare/compare-table';
import { VehicleCard } from '@/components/catalog/vehicle-card';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

type CompareViewProps = {
  allVehicles: Vehicle[];
};

export function CompareView({ allVehicles }: CompareViewProps) {
  const { slugs, clear } = useCompare();
  const searchParams = useSearchParams();

  const urlSlugs = useMemo(() => {
    const ids = searchParams.get('ids');
    return ids ? ids.split(',').filter(Boolean).slice(0, MAX_COMPARE) : [];
  }, [searchParams]);

  const activeSlugs = urlSlugs.length > 0 ? urlSlugs : slugs;

  const comparedVehicles = useMemo(
    () =>
      activeSlugs
        .map((slug) => allVehicles.find((v) => v.slug === slug))
        .filter((v): v is Vehicle => v !== undefined),
    [activeSlugs, allVehicles]
  );

  const availableToAdd = allVehicles.filter(
    (v) => !activeSlugs.includes(v.slug)
  );

  return (
    <Container className="py-section">
      <header className="fade-in mb-10 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
          Herramienta
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl">Comparar</h1>
        <p className="mt-4 text-muted">
          Selecciona hasta {MAX_COMPARE} vehículos para comparar especificaciones
          lado a lado.
        </p>
      </header>

      {comparedVehicles.length >= 2 ? (
        <div className="fade-in fade-in-delay-1">
          <CompareTable vehicles={comparedVehicles} />
          <div className="mt-8 flex justify-end">
            <Button variant="ghost" onClick={clear}>
              Limpiar comparación
            </Button>
          </div>
        </div>
      ) : comparedVehicles.length === 1 ? (
        <div className="fade-in rounded-md border border-border bg-surface p-8 text-center">
          <p className="font-serif text-xl">Agrega al menos un vehículo más</p>
          <p className="mt-2 text-sm text-muted">
            Selecciona otro vehículo desde el catálogo para comparar.
          </p>
          <Button href="/catalogo" className="mt-6">
            Ir al catálogo
          </Button>
        </div>
      ) : (
        <div className="fade-in rounded-md border border-border bg-surface p-8 text-center">
          <p className="font-serif text-xl">Ningún vehículo seleccionado</p>
          <p className="mt-2 text-sm text-muted">
            Usa el botón &ldquo;Comparar&rdquo; en las tarjetas del catálogo.
          </p>
          <Button href="/catalogo" className="mt-6">
            Explorar catálogo
          </Button>
        </div>
      )}

      {comparedVehicles.length > 0 && comparedVehicles.length < MAX_COMPARE && (
        <section className="mt-section border-t border-border pt-section">
          <h2 className="font-serif text-2xl">Agregar a la comparación</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {availableToAdd.slice(0, 3).map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
