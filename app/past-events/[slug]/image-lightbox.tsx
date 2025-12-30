// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

interface ImageLightboxProps {
  images: CloudinaryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  hasMore: boolean;
  onLoadMore?: () => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  hasMore,
  onLoadMore,
}: ImageLightboxProps) {
  const currentImage = images[currentIndex];

  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    // If we're at the last loaded image and there are more images to load, trigger loading
    if (currentIndex === images.length - 1 && hasMore && onLoadMore) {
      onLoadMore();
      // Stay on current image while loading - the new images will be added and we can navigate then
      return;
    }

    // If there's a next image, go to it
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
      return;
    }

    // Only loop back to the beginning if we've loaded all images
    if (!hasMore) {
      onNavigate(0);
    }
  }, [currentIndex, images.length, onNavigate, hasMore, onLoadMore]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
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

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4'
      onClick={onClose}
    >
      {/* Close Button */}
      <button
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

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className='absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2 cursor-pointer'
          aria-label='Previous image'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='48'
            height='48'
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

      {/* Image Container */}
      <div
        className='relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center mx-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='relative w-full h-full'>
          <Image
            src={currentImage.secure_url}
            alt={`Event image ${currentIndex + 1} of ${images.length}`}
            fill
            className='object-contain'
            sizes='80vw'
            priority
          />
        </div>
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className='absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2 cursor-pointer'
          aria-label='Next image'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='48'
            height='48'
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
  );
}
