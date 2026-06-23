'use client';

import { useMemo, useState } from 'react';
import type { Vehicle } from '@/types/database';
import {
  countActiveFilters,
  defaultFilters,
  filterVehicles,
  getFilterOptions,
  type CatalogFilters,
} from '@/lib/filters';
import { VehicleCard } from '@/components/catalog/vehicle-card';
import { CatalogFiltersPanel } from '@/components/catalog/catalog-filters';
import { Container } from '@/components/layout/container';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type CatalogViewProps = {
  vehicles: Vehicle[];
};

export function CatalogView({ vehicles }: CatalogViewProps) {
  const [filters, setFilters] = useState<CatalogFilters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { brands, years } = useMemo(() => getFilterOptions(vehicles), [vehicles]);
  const filtered = useMemo(
    () => filterVehicles(vehicles, filters),
    [vehicles, filters]
  );
  const activeCount = countActiveFilters(filters);

  return (
    <Container className="py-10 md:py-section">
      <header className="fade-in mb-8 max-w-2xl md:mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
          Inventario
        </p>
        <h1 className="page-title mt-3">Catálogo</h1>
        <p className="mt-4 text-muted">
          {vehicles.length} vehículos disponibles. Filtra por marca, precio, año
          o características técnicas.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Buscar"
            placeholder="Marca, modelo, color..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
        </div>
        <button
          type="button"
          className="h-11 rounded-sm border border-border px-4 text-sm text-foreground transition-colors duration-200 ease-out hover:border-foreground lg:hidden"
          onClick={() => setMobileFiltersOpen((open) => !open)}
        >
          Filtros {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-10">
        <CatalogFiltersPanel
          filters={filters}
          brands={brands}
          years={years}
          activeCount={activeCount}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
          className={cn(
            'rounded-md border border-border bg-surface p-4 min-[375px]:p-6',
            mobileFiltersOpen ? 'block' : 'hidden lg:block'
          )}
        />

        <div>
          <p className="mb-6 text-sm text-muted">
            {filtered.length === vehicles.length
              ? `${filtered.length} resultados`
              : `${filtered.length} de ${vehicles.length} resultados`}
          </p>

          {filtered.length > 0 ? (
            <div className="grid gap-6 min-[425px]:grid-cols-2 min-[425px]:gap-8 xl:grid-cols-3">
              {filtered.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-border bg-surface p-8 text-center min-[375px]:p-12">
              <p className="font-serif text-xl text-foreground">
                Sin resultados
              </p>
              <p className="mt-2 text-sm text-muted">
                Prueba ajustando los filtros o el término de búsqueda.
              </p>
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className="mt-6 text-sm text-accent transition-colors duration-200 ease-out hover:text-accent-hover"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
