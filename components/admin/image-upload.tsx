'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { resolveImageUrl } from '@/lib/vehicles';
import type { VehicleImage } from '@/types/database';
import { cn } from '@/lib/utils';

type ImageUploadProps = {
  existingImages: VehicleImage[];
  onDeletedChange: (ids: string[]) => void;
  onNewFilesChange: (files: File[]) => void;
};

type PreviewFile = {
  id: string;
  file: File;
  url: string;
};

export function ImageUpload({
  existingImages,
  onDeletedChange,
  onNewFilesChange,
}: ImageUploadProps) {
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<PreviewFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const visibleExisting = existingImages.filter(
    (img) => !deletedIds.includes(img.id)
  );

  const syncNewFiles = useCallback(
    (previews: PreviewFile[]) => {
      onNewFilesChange(previews.map((p) => p.file));
    },
    [onNewFilesChange]
  );

  const updateDeleted = useCallback(
    (ids: string[]) => {
      setDeletedIds(ids);
      onDeletedChange(ids);
    },
    [onDeletedChange]
  );

  const addFiles = (files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const previews = valid.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));
    setNewFiles((prev) => {
      const next = [...prev, ...previews];
      syncNewFiles(next);
      return next;
    });
  };

  const removeNew = (id: string) => {
    setNewFiles((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.url);
      const next = prev.filter((p) => p.id !== id);
      syncNewFiles(next);
      return next;
    });
  };

  const removeExisting = (id: string) => {
    updateDeleted([...deletedIds, id]);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex min-h-[160px] flex-col items-center justify-center rounded-md border border-dashed px-6 py-10 text-center transition-colors duration-200 ease-out',
          dragOver
            ? 'border-foreground bg-background'
            : 'border-border bg-background hover:border-muted'
        )}
      >
        <p className="text-sm text-foreground">Arrastra las fotos aquí</p>
        <p className="mt-1 text-xs text-muted">o haz clic para seleccionar</p>
        <p className="mt-3 text-xs text-muted">JPG, PNG o WebP · máx. 5 MB c/u</p>
        <label className="mt-4 cursor-pointer rounded-sm border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors duration-200 ease-out hover:border-foreground">
          Elegir archivos
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      {(visibleExisting.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {visibleExisting.map((img) => {
            const url = resolveImageUrl(
              img.storage_path,
              process.env.NEXT_PUBLIC_SUPABASE_URL
            );
            return (
              <div
                key={img.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-border"
              >
                <Image src={url} alt="" fill className="object-cover" sizes="200px" />
                <button
                  type="button"
                  onClick={() => removeExisting(img.id)}
                  className="absolute right-2 top-2 bg-surface/90 px-2 py-1 text-xs text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  Quitar
                </button>
              </div>
            );
          })}
          {newFiles.map((preview) => (
            <div
              key={preview.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-foreground"
            >
              <Image src={preview.url} alt="" fill className="object-cover" sizes="200px" />
              <span className="absolute left-2 top-2 bg-foreground px-2 py-0.5 text-[10px] uppercase tracking-wider text-surface">
                Nueva
              </span>
              <button
                type="button"
                onClick={() => removeNew(preview.id)}
                className="absolute right-2 top-2 bg-surface/90 px-2 py-1 text-xs text-foreground"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
