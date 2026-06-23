'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { resolveImageUrl } from '@/lib/vehicles';
import type { VehicleImage } from '@/types/database';
import { cn } from '@/lib/utils';

type VehicleGalleryProps = {
  images: VehicleImage[];
  alt: string;
};

type ZoomPan = {
  x: number;
  y: number;
};

const DESKTOP_ZOOM_SCALE = 1.85;
const MOBILE_ZOOM_SCALE = 1.55;
const CENTER_PAN: ZoomPan = { x: 0.5, y: 0.5 };
const SWIPE_THRESHOLD = 48;

function toUrl(storagePath: string) {
  return resolveImageUrl(storagePath, process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getZoomTransform(pan: ZoomPan, scale: number) {
  const panRange = ((scale - 1) / scale) * 100;
  const tx = (0.5 - pan.x) * 2 * panRange;
  const ty = (0.5 - pan.y) * 2 * panRange;
  return `scale(${scale}) translate(${tx}%, ${ty}%)`;
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      {direction === 'left' ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

type GalleryNavButtonProps = {
  direction: 'prev' | 'next';
  onClick: () => void;
  variant?: 'main' | 'lightbox' | 'thumb';
  disabled?: boolean;
  label: string;
};

function GalleryNavButton({
  direction,
  onClick,
  variant = 'main',
  disabled,
  label,
}: GalleryNavButtonProps) {
  const isPrev = direction === 'prev';

  if (variant === 'thumb') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="gallery-thumb-nav-btn pressable"
        aria-label={label}
      >
        <ChevronIcon direction={isPrev ? 'left' : 'right'} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={cn(
        'gallery-nav-btn pressable',
        isPrev ? 'gallery-nav-btn--prev' : 'gallery-nav-btn--next',
        variant === 'lightbox' && 'gallery-nav-btn--lightbox',
        disabled && 'pointer-events-none opacity-30'
      )}
      aria-label={label}
    >
      <ChevronIcon direction={isPrev ? 'left' : 'right'} />
    </button>
  );
}

type SwipeTrackProps = {
  urls: string[];
  activeIndex: number;
  alt: string;
  dragOffset: number;
  isDragging: boolean;
  onSlideClick?: () => void;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
  variant: 'main' | 'lightbox';
};

function SwipeTrack({
  urls,
  activeIndex,
  alt,
  dragOffset,
  isDragging,
  onSlideClick,
  imageClassName,
  sizes,
  priority,
  variant,
}: SwipeTrackProps) {
  return (
    <div
      className="gallery-swipe-track"
      style={{
        transform: `translate3d(calc(-${activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
        transition: isDragging ? 'none' : 'transform 320ms var(--ease-out)',
      }}
    >
      {urls.map((url, index) => (
        <div key={`${url}-${index}`} className="gallery-swipe-slide">
          {variant === 'main' ? (
            <button
              type="button"
              onClick={onSlideClick}
              className="gallery-main-image-btn"
              aria-label={`Ampliar foto ${index + 1} de ${urls.length}`}
            >
              <Image
                src={url}
                alt={`${alt} — foto ${index + 1}`}
                fill
                className={cn('gallery-main-image image-hover', imageClassName)}
                sizes={sizes}
                priority={priority && index === activeIndex}
              />
            </button>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={url}
              alt={`${alt} — foto ${index + 1}`}
              className="gallery-lightbox-image"
              draggable={false}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSwipeNav, setIsSwipeNav] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [zoomPan, setZoomPan] = useState<ZoomPan>(CENTER_PAN);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [mainDragOffset, setMainDragOffset] = useState(0);
  const [mainIsDragging, setMainIsDragging] = useState(false);
  const [lightboxDragOffset, setLightboxDragOffset] = useState(0);
  const [lightboxIsDragging, setLightboxIsDragging] = useState(false);

  const thumbsRef = useRef<HTMLDivElement>(null);
  const mainViewportRef = useRef<HTMLDivElement>(null);
  const lightboxViewportRef = useRef<HTMLDivElement>(null);
  const mainTouchStart = useRef<{ x: number; y: number } | null>(null);
  const lightboxTouchStart = useRef<{ x: number; y: number } | null>(null);
  const lightboxPanStart = useRef<{ x: number; y: number; pan: ZoomPan } | null>(null);
  const mainSwipeOccurred = useRef(false);
  const lightboxTouchMoved = useRef(0);

  const urls = images.map((img) => toUrl(img.storage_path));
  const activeUrl = urls[activeIndex];
  const hasMultiple = urls.length > 1;
  const zoomScale = isCoarsePointer ? MOBILE_ZOOM_SCALE : DESKTOP_ZOOM_SCALE;

  const resetZoomState = useCallback(() => {
    setZoomed(false);
    setZoomPan(CENTER_PAN);
  }, []);

  const resetDragState = useCallback(() => {
    setMainDragOffset(0);
    setMainIsDragging(false);
    setLightboxDragOffset(0);
    setLightboxIsDragging(false);
    mainTouchStart.current = null;
    lightboxTouchStart.current = null;
    lightboxPanStart.current = null;
    lightboxTouchMoved.current = 0;
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    resetZoomState();
    resetDragState();
  }, [resetDragState, resetZoomState]);

  const openLightbox = useCallback(() => {
    if (mainSwipeOccurred.current) {
      mainSwipeOccurred.current = false;
      return;
    }
    resetZoomState();
    resetDragState();
    setLightboxOpen(true);
  }, [resetDragState, resetZoomState]);

  const goToIndex = useCallback(
    (index: number) => {
      resetZoomState();
      resetDragState();
      setActiveIndex(index);
    },
    [resetDragState, resetZoomState]
  );

  const goNext = useCallback(() => {
    resetZoomState();
    resetDragState();
    setActiveIndex((i) => (i + 1) % urls.length);
  }, [resetDragState, resetZoomState, urls.length]);

  const goPrev = useCallback(() => {
    resetZoomState();
    resetDragState();
    setActiveIndex((i) => (i - 1 + urls.length) % urls.length);
  }, [resetDragState, resetZoomState, urls.length]);

  const completeSwipe = useCallback(
    (
      direction: 'next' | 'prev',
      viewportRef: React.RefObject<HTMLDivElement | null>,
      setOffset: (value: number) => void,
      setDragging: (value: boolean) => void
    ) => {
      const width = viewportRef.current?.clientWidth ?? 320;
      setDragging(false);
      setOffset(direction === 'next' ? -width : width);

      window.setTimeout(() => {
        if (direction === 'next') goNext();
        else goPrev();
        setOffset(0);
      }, 300);
    },
    [goNext, goPrev]
  );

  const handleMainTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwipeNav || !hasMultiple) return;
      const touch = e.touches[0];
      if (!touch) return;
      mainTouchStart.current = { x: touch.clientX, y: touch.clientY };
      setMainIsDragging(true);
      mainSwipeOccurred.current = false;
    },
    [hasMultiple, isSwipeNav]
  );

  const handleMainTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwipeNav || !hasMultiple || !mainTouchStart.current) return;
      const touch = e.touches[0];
      if (!touch) return;

      const deltaX = touch.clientX - mainTouchStart.current.x;
      const deltaY = touch.clientY - mainTouchStart.current.y;

      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
        setMainDragOffset(deltaX);
      }
    },
    [hasMultiple, isSwipeNav]
  );

  const handleMainTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwipeNav || !hasMultiple || !mainTouchStart.current) {
        setMainIsDragging(false);
        return;
      }

      const touch = e.changedTouches[0];
      if (!touch) {
        setMainIsDragging(false);
        return;
      }

      const deltaX = touch.clientX - mainTouchStart.current.x;
      const deltaY = touch.clientY - mainTouchStart.current.y;
      const isHorizontal =
        Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontal) {
        mainSwipeOccurred.current = true;
        completeSwipe(
          deltaX < 0 ? 'next' : 'prev',
          mainViewportRef,
          setMainDragOffset,
          setMainIsDragging
        );
      } else {
        setMainIsDragging(false);
        setMainDragOffset(0);
      }

      mainTouchStart.current = null;
    },
    [completeSwipe, hasMultiple, isSwipeNav]
  );

  const handleLightboxTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (!touch) return;
      e.stopPropagation();

      lightboxTouchMoved.current = 0;
      lightboxTouchStart.current = { x: touch.clientX, y: touch.clientY };

      if (zoomed && isSwipeNav) {
        lightboxPanStart.current = {
          x: touch.clientX,
          y: touch.clientY,
          pan: zoomPan,
        };
        return;
      }

      if (!zoomed && isSwipeNav && hasMultiple) {
        setLightboxIsDragging(true);
      }
    },
    [hasMultiple, isSwipeNav, zoomPan, zoomed]
  );

  const handleLightboxTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (!touch || !lightboxTouchStart.current) return;
      e.stopPropagation();

      const deltaX = touch.clientX - lightboxTouchStart.current.x;
      const deltaY = touch.clientY - lightboxTouchStart.current.y;
      lightboxTouchMoved.current += Math.abs(deltaX) + Math.abs(deltaY);

      if (zoomed && isSwipeNav && lightboxPanStart.current) {
        const viewport = lightboxViewportRef.current;
        if (!viewport) return;
        const { width, height } = viewport.getBoundingClientRect();
        const sensitivity = 1.35;

        setZoomPan({
          x: clamp(
            lightboxPanStart.current.pan.x -
              ((touch.clientX - lightboxPanStart.current.x) / width) * sensitivity,
            0,
            1
          ),
          y: clamp(
            lightboxPanStart.current.pan.y -
              ((touch.clientY - lightboxPanStart.current.y) / height) * sensitivity,
            0,
            1
          ),
        });
        return;
      }

      if (!zoomed && isSwipeNav && hasMultiple) {
        if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
          e.preventDefault();
          setLightboxDragOffset(deltaX);
        }
      }
    },
    [hasMultiple, isSwipeNav, zoomed]
  );

  const handleLightboxTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!lightboxTouchStart.current) return;

      const touch = e.changedTouches[0];
      if (!touch) {
        lightboxTouchStart.current = null;
        return;
      }

      const deltaX = touch.clientX - lightboxTouchStart.current.x;
      const deltaY = touch.clientY - lightboxTouchStart.current.y;
      const isHorizontal =
        Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY);

      if (!zoomed && isSwipeNav && hasMultiple && isHorizontal) {
        completeSwipe(
          deltaX < 0 ? 'next' : 'prev',
          lightboxViewportRef,
          setLightboxDragOffset,
          setLightboxIsDragging
        );
      } else if (!zoomed && isSwipeNav && lightboxTouchMoved.current < 12) {
        setZoomed(true);
        setZoomPan(CENTER_PAN);
        setLightboxIsDragging(false);
        setLightboxDragOffset(0);
      } else if (!zoomed) {
        setLightboxIsDragging(false);
        setLightboxDragOffset(0);
      } else if (zoomed && isSwipeNav && lightboxTouchMoved.current < 12) {
        setZoomed(false);
        setZoomPan(CENTER_PAN);
      }

      lightboxTouchStart.current = null;
      lightboxPanStart.current = null;
      lightboxTouchMoved.current = 0;
    },
    [completeSwipe, hasMultiple, isSwipeNav, zoomed]
  );

  const handleDesktopPan = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!zoomed || isSwipeNav) return;
      const el = lightboxViewportRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      setZoomPan({
        x: clamp((e.clientX - rect.left) / rect.width, 0, 1),
        y: clamp((e.clientY - rect.top) / rect.height, 0, 1),
      });
    },
    [isSwipeNav, zoomed]
  );

  const handleViewportClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setZoomed((value) => {
        const next = !value;
        if (next) setZoomPan(CENTER_PAN);
        else setZoomPan(CENTER_PAN);
        return next;
      });
    },
    []
  );

  const zoomTransform = useMemo(() => {
    if (!zoomed) return undefined;
    return getZoomTransform(zoomPan, zoomScale);
  }, [zoomPan, zoomScale, zoomed]);

  const updateThumbScrollState = useCallback(() => {
    const el = thumbsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollWidth - el.scrollLeft - el.clientWidth > 4);
  }, []);

  const scrollThumbs = useCallback((direction: 'left' | 'right') => {
    const el = thumbsRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setMounted(true);

    const updateDeviceMode = () => {
      const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
      const tablet = window.innerWidth < 1024;
      setIsCoarsePointer(coarse);
      setIsSwipeNav(coarse || tablet);
    };

    updateDeviceMode();
    window.addEventListener('resize', updateDeviceMode);
    const coarseMedia = window.matchMedia('(hover: none), (pointer: coarse)');
    coarseMedia.addEventListener('change', updateDeviceMode);

    return () => {
      window.removeEventListener('resize', updateDeviceMode);
      coarseMedia.removeEventListener('change', updateDeviceMode);
    };
  }, []);

  useEffect(() => {
    resetDragState();
  }, [activeIndex, resetDragState]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomed) {
          setZoomed(false);
          setZoomPan(CENTER_PAN);
        } else {
          closeLightbox();
        }
      }
      if (zoomed) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, zoomed, closeLightbox, goNext, goPrev]);

  useEffect(() => {
    updateThumbScrollState();
    const el = thumbsRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateThumbScrollState, { passive: true });
    window.addEventListener('resize', updateThumbScrollState);

    return () => {
      el.removeEventListener('scroll', updateThumbScrollState);
      window.removeEventListener('resize', updateThumbScrollState);
    };
  }, [urls.length, updateThumbScrollState]);

  useEffect(() => {
    const el = thumbsRef.current;
    const thumb = el?.children[activeIndex] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

  const lightboxHint = zoomed
    ? isSwipeNav
      ? 'Arrastra para mover · Toca para reducir'
      : 'Mueve el mouse para explorar · Clic para reducir'
    : isSwipeNav
      ? 'Desliza para cambiar foto · Toca para ampliar'
      : 'Clic para ampliar · Luego mueve el mouse';

  const lightbox =
    lightboxOpen && mounted
      ? createPortal(
          <div
            className={cn('gallery-lightbox', zoomed && 'is-image-zoomed')}
            role="dialog"
            aria-modal="true"
            aria-label="Galería ampliada"
            onClick={closeLightbox}
          >
            <div className="gallery-lightbox-toolbar">
              {hasMultiple ? (
                <span className="gallery-lightbox-counter">
                  {activeIndex + 1} / {urls.length}
                </span>
              ) : (
                <span aria-hidden />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="gallery-lightbox-close pressable"
              >
                Cerrar
              </button>
            </div>

            {hasMultiple && !zoomed && !isSwipeNav && (
              <>
                <GalleryNavButton
                  direction="prev"
                  variant="lightbox"
                  onClick={goPrev}
                  label="Foto anterior"
                />
                <GalleryNavButton
                  direction="next"
                  variant="lightbox"
                  onClick={goNext}
                  label="Foto siguiente"
                />
              </>
            )}

            <div
              className="gallery-lightbox-stage"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                ref={lightboxViewportRef}
                className={cn(
                  'gallery-lightbox-viewport',
                  zoomed && 'is-zoomed',
                  isSwipeNav ? 'is-touch' : 'is-pointer',
                  !zoomed && isSwipeNav && hasMultiple && 'has-swipe-track'
                )}
                onClick={!isSwipeNav ? handleViewportClick : undefined}
                onMouseMove={handleDesktopPan}
                onMouseLeave={() => {
                  if (!isSwipeNav && zoomed) setZoomPan(CENTER_PAN);
                }}
                onTouchStart={handleLightboxTouchStart}
                onTouchMove={handleLightboxTouchMove}
                onTouchEnd={handleLightboxTouchEnd}
                role="button"
                tabIndex={0}
                aria-label={zoomed ? 'Reducir imagen' : 'Ampliar imagen'}
                onKeyDown={(e) => {
                  if (!isSwipeNav && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleViewportClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                  }
                }}
              >
                {!zoomed && isSwipeNav && hasMultiple ? (
                  <SwipeTrack
                    urls={urls}
                    activeIndex={activeIndex}
                    alt={alt}
                    dragOffset={lightboxDragOffset}
                    isDragging={lightboxIsDragging}
                    sizes="100vw"
                    variant="lightbox"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeUrl}
                    alt={`${alt} — foto ${activeIndex + 1}`}
                    className={cn('gallery-lightbox-image', zoomed && 'is-active')}
                    style={zoomTransform ? { transform: zoomTransform } : undefined}
                    draggable={false}
                  />
                )}
              </div>
              <p className="gallery-lightbox-hint">{lightboxHint}</p>
            </div>
          </div>,
          document.body
        )
      : null;

  if (!activeUrl) {
    return (
      <div className="gallery-main">
        <div className="gallery-main-frame flex items-center justify-center text-muted">
          Sin imágenes
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="gallery-main space-y-3">
        <div className="gallery-main-frame group">
          {isSwipeNav && hasMultiple ? (
            <div
              ref={mainViewportRef}
              className="gallery-swipe-viewport"
              onTouchStart={handleMainTouchStart}
              onTouchMove={handleMainTouchMove}
              onTouchEnd={handleMainTouchEnd}
            >
              <SwipeTrack
                urls={urls}
                activeIndex={activeIndex}
                alt={alt}
                dragOffset={mainDragOffset}
                isDragging={mainIsDragging}
                onSlideClick={openLightbox}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 60vw"
                priority
                variant="main"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={openLightbox}
              className="gallery-main-image-btn"
              aria-label={`Ampliar foto ${activeIndex + 1} de ${urls.length}`}
            >
              <Image
                src={activeUrl}
                alt={`${alt} — foto ${activeIndex + 1}`}
                fill
                className="gallery-main-image image-hover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 60vw"
                priority
              />
            </button>
          )}

          <span className="gallery-expand-hint">Ampliar</span>

          {hasMultiple && (
            <>
              <GalleryNavButton
                direction="prev"
                onClick={goPrev}
                label="Foto anterior"
              />
              <GalleryNavButton
                direction="next"
                onClick={goNext}
                label="Foto siguiente"
              />
              <span className="gallery-counter" aria-live="polite">
                {activeIndex + 1} / {urls.length}
              </span>
            </>
          )}
        </div>

        {hasMultiple && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs text-muted">
              <span className="font-medium uppercase tracking-[0.08em]">Galería</span>
              <span className="font-mono tabular-nums lg:hidden">
                {activeIndex + 1} / {urls.length}
              </span>
            </div>

            <div className="gallery-thumbs-row">
              <GalleryNavButton
                direction="prev"
                variant="thumb"
                onClick={() => scrollThumbs('left')}
                disabled={!canScrollLeft}
                label="Desplazar miniaturas hacia la izquierda"
              />

              <div className="gallery-thumbs-wrap">
                <div
                  ref={thumbsRef}
                  className="gallery-thumbs-scroll -mx-[max(var(--page-gutter),env(safe-area-inset-left))] px-[max(var(--page-gutter),env(safe-area-inset-left))] min-[768px]:mx-0 min-[768px]:px-0"
                >
                  {urls.map((url, index) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => goToIndex(index)}
                      className={cn(
                        'relative h-[3.25rem] w-[4.75rem] shrink-0 snap-start overflow-hidden rounded-sm border bg-background transition-colors duration-200 ease-out min-[375px]:h-16 min-[375px]:w-24',
                        index === activeIndex
                          ? 'border-foreground ring-1 ring-foreground/20'
                          : 'border-border hover:border-muted'
                      )}
                      aria-label={`Ver foto ${index + 1} de ${urls.length}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                    >
                      <Image
                        src={url}
                        alt={`${alt} — miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </button>
                  ))}
                  <span className="w-3 shrink-0 lg:hidden" aria-hidden />
                </div>

              </div>

              <GalleryNavButton
                direction="next"
                variant="thumb"
                onClick={() => scrollThumbs('right')}
                disabled={!canScrollRight}
                label="Desplazar miniaturas hacia la derecha"
              />
            </div>
          </div>
        )}
      </div>

      {lightbox}
    </>
  );
}
