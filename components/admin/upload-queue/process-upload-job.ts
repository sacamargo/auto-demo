import { createClient } from '@/lib/supabase/client';
import {
  finalizeVehicleUpload,
  registerVehicleImage,
} from '@/lib/actions/vehicles';
import { optimizeVehicleImage } from '@/lib/image-optimize';
import type { UploadJob } from '@/components/admin/upload-queue/types';

export async function processUploadJobFile(
  job: UploadJob,
  fileIndex: number,
  onProgress: (progress: number) => void
): Promise<void> {
  const file = job.files[fileIndex];
  if (!file) {
    throw new Error('Archivo no encontrado');
  }

  onProgress(5);

  const optimized = await optimizeVehicleImage(file, {
    onProgress: ({ ratio }) => {
      onProgress(5 + ratio * 35);
    },
  });

  onProgress(45);

  const supabase = createClient();
  const storagePath = `${job.vehicleId}/${crypto.randomUUID()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from('vehicle-images')
    .upload(storagePath, optimized, {
      contentType: 'image/webp',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Error al subir la foto ${fileIndex + 1}`);
  }

  onProgress(80);

  const registerResult = await registerVehicleImage({
    vehicleId: job.vehicleId,
    storagePath,
    sortOrder: job.startSortOrder + fileIndex,
  });

  if (!registerResult.success) {
    await supabase.storage.from('vehicle-images').remove([storagePath]);
    throw new Error(registerResult.error ?? 'Error al registrar la foto');
  }

  onProgress(100);
}

export async function finalizeUploadJob(vehicleId: string): Promise<void> {
  const result = await finalizeVehicleUpload(vehicleId);
  if (!result.success) {
    throw new Error(result.error ?? 'Error al publicar el vehículo');
  }
}
