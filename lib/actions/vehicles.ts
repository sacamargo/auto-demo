'use server';

import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/admin';
import { revalidateCatalog } from '@/lib/revalidate';
import { sanitizeText } from '@/lib/sanitize';
import { generateSlug } from '@/lib/vehicles';
import { vehicleSchema } from '@/lib/validations/vehicle';
import { createAdminClient } from '@/lib/supabase/admin';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export type ActionResult = {
  success: boolean;
  error?: string;
  vehicleId?: string;
  slug?: string;
};

type RegisterImageInput = {
  vehicleId: string;
  storagePath: string;
  sortOrder: number;
};

function getAdminDb(): SupabaseClient {
  return createAdminClient() as SupabaseClient;
}

function parseVehicleForm(formData: FormData) {
  const raw = {
    brand: formData.get('brand'),
    model: formData.get('model'),
    year: formData.get('year'),
    price_cop: formData.get('price_cop'),
    mileage_km: formData.get('mileage_km'),
    fuel_type: formData.get('fuel_type'),
    transmission: formData.get('transmission'),
    color: formData.get('color'),
    description: formData.get('description') ?? '',
    status: formData.get('status'),
    featured: formData.get('featured') ?? 'false',
  };

  return vehicleSchema.safeParse(raw);
}

async function deleteImages(supabase: SupabaseClient, imageIds: string[]) {
  for (const imageId of imageIds) {
    const { data: image } = await supabase
      .from('vehicle_images')
      .select('storage_path')
      .eq('id', imageId)
      .single();

    if (image?.storage_path && !image.storage_path.startsWith('http')) {
      await supabase.storage
        .from('vehicle-images')
        .remove([image.storage_path]);
    }

    await supabase.from('vehicle_images').delete().eq('id', imageId);
  }
}

async function uploadImages(
  supabase: SupabaseClient,
  vehicleId: string,
  files: File[],
  startOrder: number
) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file || file.size === 0) continue;

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Formato no permitido: ${file.name}`);
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(`La imagen ${file.name} supera 5 MB`);
    }

    const ext = file.type.split('/')[1] ?? 'jpg';
    const path = `${vehicleId}/${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      throw new Error(`Error al subir ${file.name}`);
    }

    const { error: dbError } = await supabase.from('vehicle_images').insert({
      vehicle_id: vehicleId,
      storage_path: path,
      sort_order: startOrder + i,
    });

    if (dbError) {
      throw new Error('Error al guardar la imagen');
    }
  }
}

export async function revalidateVehiclePages(vehicleId: string, slug: string) {
  await revalidateCatalog();
  revalidatePath('/admin/vehiculos');
  revalidatePath(`/admin/vehiculos/${vehicleId}`);
  revalidatePath(`/admin/vehiculos/${vehicleId}/preview`);
  revalidatePath(`/catalogo/${slug}`);
}

/** Guarda datos del vehículo y borra fotos marcadas. Sin subir fotos nuevas. */
export async function saveVehicleMetadata(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = parseVehicleForm(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Datos inválidos',
      };
    }

    const data = parsed.data;
    const vehicleId = formData.get('vehicle_id')?.toString() || undefined;
    const slug = generateSlug(data.brand, data.model, data.year);

    const supabase = getAdminDb();

    const vehiclePayload = {
      slug,
      brand: sanitizeText(data.brand),
      model: sanitizeText(data.model),
      year: data.year,
      price_cop: data.price_cop,
      mileage_km: data.mileage_km,
      fuel_type: data.fuel_type,
      transmission: data.transmission,
      color: sanitizeText(data.color),
      description: sanitizeText(data.description),
      status: data.status,
      featured: data.featured,
    };

    let id = vehicleId;

    if (vehicleId) {
      const { error } = await supabase
        .from('vehicles')
        .update(vehiclePayload)
        .eq('id', vehicleId);

      if (error) {
        return { success: false, error: 'No se pudo actualizar el vehículo' };
      }
    } else {
      const { data: created, error } = await supabase
        .from('vehicles')
        .insert(vehiclePayload)
        .select('id')
        .single();

      if (error || !created) {
        return { success: false, error: 'No se pudo crear el vehículo' };
      }
      id = created.id as string;
    }

    if (!id) {
      return { success: false, error: 'Error interno' };
    }

    const deletedRaw = formData.get('deleted_images')?.toString();
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (deletedIds.length > 0) {
      await deleteImages(supabase, deletedIds);
    }

    revalidatePath('/admin/vehiculos');
    revalidatePath(`/admin/vehiculos/${id}`);

    return { success: true, vehicleId: id, slug };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error al guardar',
    };
  }
}

/** Registra en BD una foto ya subida a Storage (desde el cliente admin). */
export async function registerVehicleImage(
  input: RegisterImageInput
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const { vehicleId, storagePath, sortOrder } = input;

    if (!vehicleId || !storagePath) {
      return { success: false, error: 'Datos de imagen incompletos' };
    }

    const supabase = getAdminDb();

    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('slug')
      .eq('id', vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return { success: false, error: 'Vehículo no encontrado' };
    }

    const { error: dbError } = await supabase.from('vehicle_images').insert({
      vehicle_id: vehicleId,
      storage_path: storagePath,
      sort_order: sortOrder,
    });

    if (dbError) {
      return { success: false, error: 'Error al registrar la imagen' };
    }

    revalidatePath(`/admin/vehiculos/${vehicleId}`);
    revalidatePath(`/admin/vehiculos/${vehicleId}/preview`);

    return { success: true, vehicleId, slug: vehicle.slug as string };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error al registrar imagen',
    };
  }
}

/** Revalida catálogo cuando termina la cola de fotos de un vehículo. */
export async function finalizeVehicleUpload(vehicleId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = getAdminDb();

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('slug')
      .eq('id', vehicleId)
      .single();

    if (error || !vehicle) {
      return { success: false, error: 'Vehículo no encontrado' };
    }

    await revalidateVehiclePages(vehicleId, vehicle.slug as string);

    return { success: true, vehicleId, slug: vehicle.slug as string };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error al publicar',
    };
  }
}

/** Flujo legacy: datos + fotos en un solo request (será reemplazado por la cola). */
export async function saveVehicle(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const metadataResult = await saveVehicleMetadata(formData);
    if (!metadataResult.success || !metadataResult.vehicleId) {
      return metadataResult;
    }

    const id = metadataResult.vehicleId;
    const slug = metadataResult.slug ?? '';
    const supabase = getAdminDb();

    const existingCount = Number(formData.get('existing_image_count') ?? 0);
    const files = formData
      .getAll('images')
      .filter((f): f is File => f instanceof File && f.size > 0);

    if (files.length > 0) {
      await uploadImages(supabase, id, files, existingCount);
    }

    if (slug) {
      await revalidateVehiclePages(id, slug);
    }

    return { success: true, vehicleId: id, slug };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error al guardar',
    };
  }
}

export async function deleteVehicle(vehicleId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = getAdminDb();

    const { data: images } = await supabase
      .from('vehicle_images')
      .select('id, storage_path')
      .eq('vehicle_id', vehicleId);

    const storagePaths = (images ?? [])
      .map((img) => img.storage_path)
      .filter((path) => path && !path.startsWith('http'));

    if (storagePaths.length > 0) {
      await supabase.storage.from('vehicle-images').remove(storagePaths);
    }

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (error) {
      return { success: false, error: 'No se pudo eliminar el vehículo' };
    }

    await revalidateCatalog();
    revalidatePath('/admin/vehiculos');

    return { success: true };
  } catch {
    return { success: false, error: 'Error al eliminar' };
  }
}
