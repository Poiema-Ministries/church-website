// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import ImageLightbox from './image-lightbox';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

interface EventGalleryProps {
  slug: string;
  originalCaption?: string;
}

export default function EventGallery({
  slug,
  originalCaption,
}: EventGalleryProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadImages = useCallback(
    async (cursor?: string | null) => {
      if (!slug) {
        console.error('Slug is undefined');
        return;
      }

      setLoading(true);
      try {
        const cursorParam = cursor ? `?cursor=${cursor}` : '';
        const response = await fetch(`/api/past-events/${slug}${cursorParam}`);

        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }

        const data = await response.json();

        if (cursor) {
          // Append new images
          setImages((prev) => [...prev, ...data.images]);
        } else {
          // Initial load
          setImages(data.images);
        }

        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    },
    [slug],
  );

  useEffect(() => {
    // Reset state and load initial images when slug changes
    if (!slug) return;

    setImages([]);
    setNextCursor(null);
    setHasMore(true);
    loadImages();
  }, [slug, loadImages]);

  useEffect(() => {
    // Intersection Observer for infinite scroll
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && nextCursor) {
          loadImages(nextCursor);
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
  }, [hasMore, loading, nextCursor, loadImages]);

  // Navigate to next image when new images are loaded and we were at the last image
  const previousImagesLengthRef = useRef(images.length);
  useEffect(() => {
    if (
      lightboxOpen &&
      images.length > previousImagesLengthRef.current &&
      lightboxIndex === previousImagesLengthRef.current - 1
    ) {
      // New images were loaded and we were at the last image, navigate to the next one
      setLightboxIndex(previousImagesLengthRef.current);
    }
    previousImagesLengthRef.current = images.length;
  }, [images.length, lightboxOpen, lightboxIndex]);

  if (images.length === 0 && !loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <p className='text-lg text-primary-black/70'>No images found.</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
        {images.map((image, index) => (
          <div
            key={image.public_id}
            className='relative w-full aspect-[4/3] overflow-hidden cursor-pointer group'
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.secure_url}
              alt={`Event image ${image.public_id}`}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              loading='lazy'
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
        hasMore={hasMore}
        onLoadMore={() => {
          if (nextCursor && !loading) {
            loadImages(nextCursor);
          }
        }}
      />

      {/* Observer target for infinite scroll */}
      <div ref={observerTarget} className='h-10 w-full' />

      {loading && (
        <div className='flex items-center justify-center py-8'>
          <p className='text-primary-black/70'>Loading more images...</p>
        </div>
      )}

      {!hasMore && images.length > 0 && (
        <div className='flex items-center justify-center py-8'>
          <p className='text-primary-black/70'>All images loaded</p>
        </div>
      )}
    </>
  );
}
