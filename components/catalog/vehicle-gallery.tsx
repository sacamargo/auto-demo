'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { resolveImageUrl } from '@/lib/vehicles';
import type { VehicleImage } from '@/types/database';
import { cn } from '@/lib/utils';

type VehicleGalleryProps = {
  images: VehicleImage[];
  alt: string;
};

function toUrl(storagePath: string) {
  return resolveImageUrl(storagePath, process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const urls = images.map((img) => toUrl(img.storage_path));
  const activeUrl = urls[activeIndex];

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % urls.length);
  }, [urls.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + urls.length) % urls.length);
  }, [urls.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, closeLightbox, goNext, goPrev]);

  if (!activeUrl) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-border bg-background text-muted">
        Sin imágenes
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-background"
          aria-label="Abrir galería"
        >
          <Image
            src={activeUrl}
            alt={alt}
            fill
            className="image-hover object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </button>

        {urls.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {urls.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative h-16 w-24 shrink-0 overflow-hidden rounded-sm border transition-colors duration-200 ease-out',
                  index === activeIndex
                    ? 'border-foreground'
                    : 'border-border hover:border-muted'
                )}
              >
                <Image
                  src={url}
                  alt={`${alt} — foto ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotos"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 text-sm text-white/70 transition-colors duration-200 ease-out hover:text-white md:right-8 md:top-8"
          >
            Cerrar
          </button>

          {urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 px-3 py-2 text-2xl text-white/70 transition-colors duration-200 ease-out hover:text-white md:left-6"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 px-3 py-2 text-2xl text-white/70 transition-colors duration-200 ease-out hover:text-white md:right-6"
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative max-h-[85vh] w-full max-w-5xl animate-[fadeInUp_300ms_var(--ease-out)_forwards] opacity-0"
            style={{ animationFillMode: 'forwards' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={activeUrl}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            {urls.length > 1 && (
              <p className="mt-4 text-center text-sm text-white/60">
                {activeIndex + 1} / {urls.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
