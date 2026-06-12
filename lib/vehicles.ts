export function generateSlug(brand: string, model: string, year: number): string {
  return `${brand}-${model}-${year}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function resolveImageUrl(storagePath: string, supabaseUrl?: string): string {
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }

  if (!supabaseUrl) {
    return storagePath;
  }

  return `${supabaseUrl}/storage/v1/object/public/vehicle-images/${storagePath}`;
}

export function formatPriceCop(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(km: number): string {
  return new Intl.NumberFormat('es-CO').format(km) + ' km';
}
