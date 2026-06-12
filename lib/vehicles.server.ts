import 'server-only';

import { unstable_cache } from 'next/cache';
import { VEHICLES_CACHE_TAG } from '@/config/site';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Vehicle, VehicleStatus } from '@/types/database';

const PUBLIC_STATUSES: VehicleStatus[] = ['disponible', 'reservado'];

async function fetchPublicVehicles(): Promise<Vehicle[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, vehicle_images(*)')
    .in('status', PUBLIC_STATUSES)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching vehicles: ${error.message}`);
  }

  const vehicles = (data ?? []) as Vehicle[];

  return vehicles.map((vehicle) => ({
    ...vehicle,
    vehicle_images: (vehicle.vehicle_images ?? []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  }));
}

export const getPublicVehicles = unstable_cache(
  fetchPublicVehicles,
  ['public-vehicles'],
  { tags: [VEHICLES_CACHE_TAG] }
);

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const vehicles = await getPublicVehicles();
  return vehicles.filter((vehicle) => vehicle.featured);
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const vehicles = await getPublicVehicles();
  return vehicles.find((vehicle) => vehicle.slug === slug) ?? null;
}

export async function getPublicVehicleSlugs(): Promise<string[]> {
  const vehicles = await getPublicVehicles();
  return vehicles.map((vehicle) => vehicle.slug);
}

export async function checkDatabaseConnection(): Promise<{
  ok: boolean;
  count: number | null;
  error?: string;
}> {
  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { ok: false, count: null, error: error.message };
    }

    return { ok: true, count: count ?? 0 };
  } catch (error) {
    return {
      ok: false,
      count: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
