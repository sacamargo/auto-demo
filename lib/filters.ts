import type { FuelType, TransmissionType, Vehicle } from '@/types/database';

export type CatalogFilters = {
  query: string;
  brand: string;
  fuelType: FuelType | '';
  transmission: TransmissionType | '';
  yearMin: string;
  yearMax: string;
  priceRange: string;
};

export const defaultFilters: CatalogFilters = {
  query: '',
  brand: '',
  fuelType: '',
  transmission: '',
  yearMin: '',
  yearMax: '',
  priceRange: '',
};

const priceRanges: Record<string, { min?: number; max?: number }> = {
  'under-200': { max: 200_000_000 },
  '200-300': { min: 200_000_000, max: 300_000_000 },
  'over-300': { min: 300_000_000 },
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filterVehicles(
  vehicles: Vehicle[],
  filters: CatalogFilters
): Vehicle[] {
  const query = normalize(filters.query.trim());
  const yearMin = filters.yearMin ? Number(filters.yearMin) : undefined;
  const yearMax = filters.yearMax ? Number(filters.yearMax) : undefined;
  const priceBounds = filters.priceRange
    ? priceRanges[filters.priceRange]
    : undefined;

  return vehicles.filter((vehicle) => {
    if (filters.brand && vehicle.brand !== filters.brand) return false;
    if (filters.fuelType && vehicle.fuel_type !== filters.fuelType) return false;
    if (filters.transmission && vehicle.transmission !== filters.transmission)
      return false;
    if (yearMin && vehicle.year < yearMin) return false;
    if (yearMax && vehicle.year > yearMax) return false;
    if (priceBounds?.min && vehicle.price_cop < priceBounds.min) return false;
    if (priceBounds?.max && vehicle.price_cop > priceBounds.max) return false;

    if (query) {
      const haystack = normalize(
        `${vehicle.brand} ${vehicle.model} ${vehicle.description} ${vehicle.color} ${vehicle.year}`
      );
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

export function getFilterOptions(vehicles: Vehicle[]) {
  const brands = Array.from(new Set(vehicles.map((v) => v.brand))).sort();
  const years = Array.from(new Set(vehicles.map((v) => v.year))).sort(
    (a, b) => b - a
  );

  return { brands, years };
}

export function countActiveFilters(filters: CatalogFilters) {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === 'query') return value.trim().length > 0;
    return value !== '';
  }).length;
}
