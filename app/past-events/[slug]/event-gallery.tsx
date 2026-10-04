// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import ImageLightbox from './image-lightbox';
import { preloadViewer, type GalleryImage } from './gallery-image';

interface EventGalleryProps {
  slug: string;
  originalCaption?: string;
}

interface AlbumPage {
  images?: GalleryImage[];
  nextCursor?: string | null;
  totalCount?: number | null;
}

export default function EventGallery({ slug }: EventGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchedCursorsRef = useRef<Set<string>>(new Set());
  const requestLockRef = useRef(false);
  const generationRef = useRef(0);
  const nextCursorRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pendingAdvanceRef = useRef(false);
  const preloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadImages = useCallback(
    async (cursor?: string | null) => {
      if (!slug) {
        console.error('Slug is undefined');
        return;
      }

      const cursorKey = cursor ?? '';
      if (fetchedCursorsRef.current.has(cursorKey) || requestLockRef.current) {
        return;
      }

      const generation = generationRef.current;
      requestLockRef.current = true;
      setLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const cursorParam = cursor
          ? `?cursor=${encodeURIComponent(cursor)}`
          : '';
        const response = await fetch(`/api/past-events/${slug}${cursorParam}`, {
          signal: controller.signal,
        });

        if (generation !== generationRef.current) return;

        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }

        const data = (await response.json()) as AlbumPage;
        if (generation !== generationRef.current) return;

        const incoming = Array.isArray(data.images) ? data.images : [];

        if (cursor && incoming.length === 0) {
          fetchedCursorsRef.current.add(cursorKey);
          pendingAdvanceRef.current = false;
          nextCursorRef.current = null;
          setNextCursor(null);
          setHasMore(false);
          return;
        }

        fetchedCursorsRef.current.add(cursorKey);

        setImages((prev) => {
          if (!cursor) return incoming;
          const seen = new Set(prev.map((image) => image.public_id));
          const appended = incoming.filter(
            (image) => !seen.has(image.public_id),
          );
          return [...prev, ...appended];
        });

        const next = data.nextCursor || null;
        nextCursorRef.current = next;
        setNextCursor(next);
        setHasMore(!!next);

        if (typeof data.totalCount === 'number') {
          setTotalCount(data.totalCount);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        if ((error as { name?: string })?.name === 'AbortError') return;
        if (generation !== generationRef.current) return;
        pendingAdvanceRef.current = false;
        console.error('Error loading images:', error);
      } finally {
        if (generation === generationRef.current) {
          requestLockRef.current = false;
          setLoading(false);
        }
      }
    },
    [slug],
  );

  const loadMore = useCallback(
    (options?: { advance?: boolean }) => {
      const cursor = nextCursorRef.current;
      if (!cursor) {
        pendingAdvanceRef.current = false;
        return;
      }
      if (options?.advance) pendingAdvanceRef.current = true;
      void loadImages(cursor);
    },
    [loadImages],
  );

  useEffect(() => {
    return () => {
      if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!slug) return;

    generationRef.current += 1;
    fetchedCursorsRef.current = new Set();
    requestLockRef.current = false;
    nextCursorRef.current = null;
    setImages([]);
    setNextCursor(null);
    setHasMore(true);
    setTotalCount(null);

    void loadImages();

    return () => {
      generationRef.current += 1;
      abortRef.current?.abort();
    };
  }, [slug, loadImages]);

  useEffect(() => {
    if (!hasMore || loading || lightboxOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && nextCursor) {
          void loadImages(nextCursor);
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, nextCursor, loadImages, lightboxOpen]);

  const previousImagesLengthRef = useRef(images.length);
  useEffect(() => {
    if (
      lightboxOpen &&
      pendingAdvanceRef.current &&
      images.length > previousImagesLengthRef.current
    ) {
      pendingAdvanceRef.current = false;
      setLightboxIndex(previousImagesLengthRef.current);
    }
    previousImagesLengthRef.current = images.length;
  }, [images.length, lightboxOpen]);

  if (images.length === 0 && !loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <p className='text-lg text-primary-black/70'>No images found.</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    const image = images[index];
    if (image) preloadViewer(image.secure_url);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const scheduleViewerPreload = (secureUrl: string) => {
    if (preloadTimerRef.current) clearTimeout(preloadTimerRef.current);
    preloadTimerRef.current = setTimeout(() => preloadViewer(secureUrl), 120);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
        {images.map((image, index) => (
          <div
            key={image.public_id}
            className='relative w-full aspect-square overflow-hidden cursor-pointer group'
            onPointerEnter={() => scheduleViewerPreload(image.secure_url)}
            onPointerDown={() => preloadViewer(image.secure_url)}
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.secure_url}
              alt={`Event image ${image.public_id}`}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='(max-width: 640px) 50vw, 25vw'
              loading='lazy'
              quality={75}
            />
          </div>
        ))}
      </div>

      <ImageLightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
        hasMore={hasMore}
        totalCount={totalCount}
        isLoadingMore={loading}
        onLoadMore={loadMore}
      />

      <div ref={observerTarget} className='h-10 w-full' />

      {loading && (
        <div className='flex items-center justify-center py-8'>
          <p className='text-primary-black/70'>
            {images.length === 0
              ? 'Loading images...'
              : 'Loading more images...'}
          </p>
        </div>
      )}
    </>
  );
}
