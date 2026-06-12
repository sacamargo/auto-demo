import { createAdminClient } from '@/lib/supabase/admin';
import type { Vehicle } from '@/types/database';

export async function getAllVehiclesAdmin(): Promise<Vehicle[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, vehicle_images(*)')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as Vehicle[]).map((vehicle) => ({
    ...vehicle,
    vehicle_images: (vehicle.vehicle_images ?? []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  }));
}

export async function getVehicleAdmin(id: string): Promise<Vehicle | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, vehicle_images(*)')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  const vehicle = data as Vehicle;
  return {
    ...vehicle,
    vehicle_images: (vehicle.vehicle_images ?? []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}
