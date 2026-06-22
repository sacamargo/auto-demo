const MAX_WIDTH = 2400;
const WEBP_QUALITY = 0.88;
const ALLOWED_INPUT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export type OptimizeProgress = {
  phase: 'reading' | 'processing' | 'done';
  ratio: number;
};

export type OptimizeImageOptions = {
  onProgress?: (progress: OptimizeProgress) => void;
};

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`No se pudo leer la imagen ${file.name}`));
    };

    img.src = url;
  });
}

function canvasToWebpBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo optimizar la imagen'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality
    );
  });
}

function buildOutputName(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, '') || 'foto';
  return `${base}.webp`;
}

/**
 * Redimensiona y convierte a WebP sin pérdida visible en pantalla.
 * Pensado para fotos de celular antes de subir a Supabase.
 */
export async function optimizeVehicleImage(
  file: File,
  options?: OptimizeImageOptions
): Promise<File> {
  if (!ALLOWED_INPUT_TYPES.includes(file.type)) {
    throw new Error(`Formato no permitido: ${file.name}`);
  }

  options?.onProgress?.({ phase: 'reading', ratio: 0.1 });

  const image = await loadImageFromFile(file);
  const scale = Math.min(1, MAX_WIDTH / image.width);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  options?.onProgress?.({ phase: 'processing', ratio: 0.45 });

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo procesar la imagen');
  }

  ctx.drawImage(image, 0, 0, width, height);

  options?.onProgress?.({ phase: 'processing', ratio: 0.75 });

  const blob = await canvasToWebpBlob(canvas, WEBP_QUALITY);
  options?.onProgress?.({ phase: 'done', ratio: 1 });

  return new File([blob], buildOutputName(file.name), {
    type: 'image/webp',
    lastModified: Date.now(),
  });
}

export async function optimizeVehicleImages(
  files: File[],
  options?: {
    onFileProgress?: (fileIndex: number, total: number, progress: OptimizeProgress) => void;
  }
): Promise<File[]> {
  const optimized: File[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;

    const result = await optimizeVehicleImage(file, {
      onProgress: (progress) => {
        options?.onFileProgress?.(i, files.length, progress);
      },
    });

    optimized.push(result);
  }

  return optimized;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
