'use client';

import type { CatalogFilters } from '@/lib/filters';
import { getFuelLabel, getTransmissionLabel } from '@/lib/labels';
import type { FuelType, TransmissionType } from '@/types/database';
import { cn } from '@/lib/utils';

type CatalogFiltersProps = {
  filters: CatalogFilters;
  brands: string[];
  years: number[];
  onChange: (filters: CatalogFilters) => void;
  onReset: () => void;
  activeCount: number;
  className?: string;
};

const fuelOptions: FuelType[] = ['gasolina', 'diesel', 'hibrido', 'electrico', 'gas'];
const transmissionOptions: TransmissionType[] = ['manual', 'automatica', 'cvt'];

const selectClass =
  'h-10 w-full appearance-none rounded-sm border border-border bg-surface px-3 text-sm text-foreground transition-colors duration-200 ease-out focus:border-foreground focus:outline-none';

export function CatalogFiltersPanel({
  filters,
  brands,
  years,
  onChange,
  onReset,
  activeCount,
  className,
}: CatalogFiltersProps) {
  const update = (patch: Partial<CatalogFilters>) =>
    onChange({ ...filters, ...patch });

  return (
    <aside className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
          Filtros
          {activeCount > 0 && (
            <span className="ml-2 text-foreground">({activeCount})</span>
          )}
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted transition-colors duration-200 ease-out hover:text-foreground"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-4">
        <FilterField label="Marca">
          <select
            value={filters.brand}
            onChange={(e) => update({ brand: e.target.value })}
            className={selectClass}
          >
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Precio">
          <select
            value={filters.priceRange}
            onChange={(e) => update({ priceRange: e.target.value })}
            className={selectClass}
          >
            <option value="">Cualquier precio</option>
            <option value="under-200">Menos de $200 millones</option>
            <option value="200-300">$200 – $300 millones</option>
            <option value="over-300">Más de $300 millones</option>
          </select>
        </FilterField>

        <div className="grid grid-cols-2 gap-3">
          <FilterField label="Año desde">
            <select
              value={filters.yearMin}
              onChange={(e) => update({ yearMin: e.target.value })}
              className={selectClass}
            >
              <option value="">—</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Año hasta">
            <select
              value={filters.yearMax}
              onChange={(e) => update({ yearMax: e.target.value })}
              className={selectClass}
            >
              <option value="">—</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </FilterField>
        </div>

        <FilterField label="Combustible">
          <select
            value={filters.fuelType}
            onChange={(e) =>
              update({ fuelType: e.target.value as FuelType | '' })
            }
            className={selectClass}
          >
            <option value="">Todos</option>
            {fuelOptions.map((fuel) => (
              <option key={fuel} value={fuel}>
                {getFuelLabel(fuel)}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Transmisión">
          <select
            value={filters.transmission}
            onChange={(e) =>
              update({ transmission: e.target.value as TransmissionType | '' })
            }
            className={selectClass}
          >
            <option value="">Todas</option>
            {transmissionOptions.map((t) => (
              <option key={t} value={t}>
                {getTransmissionLabel(t)}
              </option>
            ))}
          </select>
        </FilterField>
      </div>
    </aside>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs text-muted">{label}</label>
      {children}
    </div>
  );
}
