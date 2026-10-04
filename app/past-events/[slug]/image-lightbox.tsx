// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import {
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Image from 'next/image';
import {
  type GalleryImage,
  markViewerLoaded,
  preloadViewer,
  probeViewerReady,
  nextStripScrollLeft,
  shouldLoadMoreFromStrip,
  shouldPrefetchNextPage,
  thumbnailUrl,
  viewerUrl,
} from './gallery-image';

interface ImageLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  hasMore: boolean;
  totalCount: number | null;
  isLoadingMore: boolean;
  onLoadMore?: (options?: { advance?: boolean }) => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  hasMore,
  totalCount,
  isLoadingMore,
  onLoadMore,
}: ImageLightboxProps) {
  const currentImage = images[currentIndex];
  const stripRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prefetchedIndexRef = useRef<number | null>(null);
  const didPositionOnOpenRef = useRef(false);
  const followSelectionRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [viewerPending, setViewerPending] = useState(false);
  const viewerSrc = currentImage ? viewerUrl(currentImage.secure_url) : '';
  const viewerSrcRef = useRef(viewerSrc);
  viewerSrcRef.current = viewerSrc;

  const totalLabel =
    typeof totalCount === 'number'
      ? String(totalCount)
      : hasMore
        ? `${images.length}+`
        : String(images.length);

  const handlePrevious = useCallback(() => {
    if (images.length === 0) return;
    followSelectionRef.current = true;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === images.length - 1 && hasMore && onLoadMore) {
      followSelectionRef.current = true;
      onLoadMore({ advance: true });
      return;
    }

    if (currentIndex < images.length - 1) {
      followSelectionRef.current = true;
      onNavigate(currentIndex + 1);
      return;
    }

    if (!hasMore && images.length > 0) {
      followSelectionRef.current = true;
      onNavigate(0);
    }
  }, [currentIndex, images.length, onNavigate, hasMore, onLoadMore]);

  const syncScrollHints = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(strip.scrollLeft > 8);
    setCanScrollRight(
      strip.scrollWidth - strip.scrollLeft - strip.clientWidth > 8,
    );
  }, []);

  const positionStrip = useCallback(
    (mode: 'center' | 'nearest') => {
      const strip = stripRef.current;
      const thumb = strip?.querySelector<HTMLElement>(
        `[data-thumb-index="${currentIndex}"]`,
      );
      if (!strip || !thumb) return;

      const left = nextStripScrollLeft({
        scrollLeft: strip.scrollLeft,
        clientWidth: strip.clientWidth,
        thumbLeft: thumb.offsetLeft,
        thumbWidth: thumb.offsetWidth,
        mode,
      });
      if (left === null || Math.abs(left - strip.scrollLeft) < 1) return;

      if (typeof strip.scrollTo === 'function') {
        strip.scrollTo({ left, behavior: 'auto' });
        return;
      }
      strip.scrollLeft = left;
    },
    [currentIndex],
  );

  const scrollStripBy = (direction: -1 | 1) => {
    const strip = stripRef.current;
    if (!strip) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    strip.scrollBy({
      left: direction * Math.max(strip.clientWidth * 0.75, 160),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const handleStripScroll = () => {
    // A manual skim cancels any pending jump toward the selected photo.
    followSelectionRef.current = false;
    const strip = stripRef.current;
    syncScrollHints();
    if (!strip || !hasMore || isLoadingMore) return;
    if (shouldLoadMoreFromStrip(strip)) {
      onLoadMore?.();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handlePrevious, handleNext, onClose]);

  useEffect(() => {
    if (!isOpen) {
      prefetchedIndexRef.current = null;
      return;
    }
    if (!hasMore || isLoadingMore) return;
    if (!shouldPrefetchNextPage(images.length, currentIndex)) return;
    // One look-ahead per photo. A short page must not chain-load the album.
    if (prefetchedIndexRef.current === currentIndex) return;
    prefetchedIndexRef.current = currentIndex;
    onLoadMore?.();
  }, [isOpen, hasMore, isLoadingMore, images.length, currentIndex, onLoadMore]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !isOpen) return;

    const onWheel = (event: WheelEvent) => {
      if (strip.scrollWidth <= strip.clientWidth + 8) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      strip.scrollLeft += event.deltaY;
      event.preventDefault();
    };

    strip.addEventListener('wheel', onWheel, { passive: false });
    return () => strip.removeEventListener('wheel', onWheel);
  }, [isOpen, images.length]);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !viewerSrc) {
      setViewerPending(false);
      return;
    }
    const ready = probeViewerReady(viewerSrc);
    setViewerPending((current) => (current === !ready ? current : !ready));
  }, [isOpen, viewerSrc]);

  useEffect(() => {
    if (!isOpen) return;
    [currentIndex - 1, currentIndex + 1, currentIndex + 2].forEach((index) => {
      const neighbor = images[index];
      if (neighbor) preloadViewer(neighbor.secure_url);
    });
  }, [isOpen, currentIndex, images]);

  useLayoutEffect(() => {
    if (!isOpen) {
      didPositionOnOpenRef.current = false;
      followSelectionRef.current = false;
      return;
    }

    // Once, when the lightbox opens. Later thumbnail clicks and manual
    // scrolling must not pull the strip back to the selected photo.
    if (!didPositionOnOpenRef.current) {
      didPositionOnOpenRef.current = true;
      followSelectionRef.current = false;
      positionStrip('center');
      return;
    }

    if (!followSelectionRef.current) return;
    followSelectionRef.current = false;
    positionStrip('nearest');
  }, [isOpen, currentIndex, positionStrip]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    syncScrollHints();
  }, [isOpen, images.length, syncScrollHints]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !isOpen) return;
    const observer = new ResizeObserver(() => syncScrollHints());
    observer.observe(strip);
    return () => observer.disconnect();
  }, [isOpen, images.length, syncScrollHints]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      ref={dialogRef}
      role='dialog'
      aria-modal='true'
      aria-label='Photo gallery'
      tabIndex={-1}
      className='fixed inset-0 z-50 flex flex-col bg-black/95 outline-none'
      onClick={onClose}
    >
      <button
        type='button'
        onClick={onClose}
        className='absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 cursor-pointer'
        aria-label='Close lightbox'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='18' y1='6' x2='6' y2='18'></line>
          <line x1='6' y1='6' x2='18' y2='18'></line>
        </svg>
      </button>

      <div className='relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-20 pt-16 pb-2'>
        {images.length > 1 && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2 cursor-pointer'
            aria-label='Previous image'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='m15 18-6-6 6-6' />
            </svg>
          </button>
        )}

        <div
          className='relative h-full w-full max-w-5xl'
          onClick={(e) => e.stopPropagation()}
          aria-busy={viewerPending}
        >
          <Image
            key={viewerSrc}
            src={viewerSrc}
            alt={`Photo ${currentIndex + 1} of ${totalLabel}`}
            fill
            unoptimized
            className={`object-contain ${viewerPending ? 'opacity-0' : 'opacity-100'}`}
            sizes='(max-width: 768px) 100vw, 80vw'
            priority
            onLoad={() => {
              markViewerLoaded(viewerSrc);
              if (viewerSrcRef.current === viewerSrc) setViewerPending(false);
            }}
            onError={() => {
              if (viewerSrcRef.current === viewerSrc) setViewerPending(false);
            }}
          />
          {viewerPending && (
            <div
              className='absolute inset-0 z-10 flex items-center justify-center'
              role='status'
              aria-label='Loading photo'
            >
              <span className='h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-white' />
            </div>
          )}
        </div>

        {images.length > 1 && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2 cursor-pointer'
            aria-label='Next image'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='m9 18 6-6-6-6' />
            </svg>
          </button>
        )}
      </div>

      <div
        className='shrink-0 border-t border-white/10 bg-black/70 px-3 pt-3 pb-4 sm:px-6'
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className='mb-3 text-center text-sm text-white/80'
          aria-live='polite'
        >
          {currentIndex + 1} of {totalLabel}
        </p>

        <div className='relative'>
          {canScrollLeft && (
            <button
              type='button'
              aria-label='Scroll thumbnails left'
              onClick={() => scrollStripBy(-1)}
              className='absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/80 p-1.5 text-white shadow cursor-pointer'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m15 18-6-6 6-6' />
              </svg>
            </button>
          )}

          <div
            ref={stripRef}
            data-testid='photo-strip'
            className='scrollbar-thin flex gap-2 overflow-x-auto px-1 py-1'
            onScroll={handleStripScroll}
          >
            {images.map((image, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={image.public_id}
                  type='button'
                  data-thumb-index={index}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => {
                    followSelectionRef.current = false;
                    onNavigate(index);
                  }}
                  className={`relative h-16 w-20 sm:h-[4.5rem] sm:w-24 shrink-0 overflow-hidden rounded-sm border-2 cursor-pointer transition ${
                    isActive
                      ? 'border-white opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={thumbnailUrl(image.secure_url)}
                    alt=''
                    width={192}
                    height={144}
                    unoptimized
                    loading={
                      Math.abs(index - currentIndex) <= 8 ? 'eager' : 'lazy'
                    }
                    className='h-full w-full object-cover'
                  />
                </button>
              );
            })}

            {hasMore && (
              <button
                type='button'
                onClick={() => onLoadMore?.()}
                disabled={isLoadingMore}
                aria-label='Load more photos'
                className='flex h-16 w-20 sm:h-[4.5rem] sm:w-24 shrink-0 items-center justify-center rounded-sm border border-white/20 text-xs text-white/80 cursor-pointer disabled:cursor-default'
              >
                {isLoadingMore ? (
                  <span
                    className='h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white'
                    aria-hidden='true'
                  />
                ) : (
                  'More'
                )}
              </button>
            )}
          </div>

          {canScrollRight && (
            <button
              type='button'
              aria-label='Scroll thumbnails right'
              onClick={() => scrollStripBy(1)}
              className='absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/80 p-1.5 text-white shadow cursor-pointer'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m9 18 6-6-6-6' />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
