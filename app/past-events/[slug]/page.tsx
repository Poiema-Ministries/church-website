// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { getAssetsFromCollection } from '@/lib/cloudinary';
import EventGallery from './event-gallery';

/**
 * Format title from underscore format (e.g., "2025_july_bbq") to display format (e.g., "2025 July BBQ")
 */
function formatTitle(title: string): string {
  if (!title) return '';

  // Remove file extension if present
  const withoutExtension = title.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '');

  return withoutExtension
    .split('_')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function EventPage({ params }: PageProps) {
  // Handle params as Promise (Next.js 15) or object (Next.js 14)
  const resolvedParams = 'then' in params ? await params : params;
  const { slug } = resolvedParams;

  // Get the cover image to get the formatted title and original caption
  let eventTitle = slug ? formatTitle(slug) : 'Event';
  let originalCaption: string | null = null;

interface CloudinaryAsset {
  context?: {
    caption?: string;
  };
  metadata?: {
    caption?: string;
  };
}

  try {
    const assets = await getAssetsFromCollection('covers', 100);
    const matchingAsset = (assets as unknown as CloudinaryAsset[]).find((asset) => {
      const caption = asset.context?.caption || asset.metadata?.caption || '';
      return caption === slug || caption === decodeURIComponent(slug);
    });

    if (matchingAsset) {
      const caption =
        matchingAsset.context?.caption || matchingAsset.metadata?.caption || '';
      if (caption) {
        originalCaption = caption;
        eventTitle = caption.includes('_') ? formatTitle(caption) : caption;
      }
    } else if (slug) {
      // If no matching asset found, format the slug as title
      eventTitle = formatTitle(slug);
      originalCaption = slug;
    }
  } catch (error) {
    console.error('Error fetching cover:', error);
    // Fallback to formatting the slug
    if (slug) {
      eventTitle = formatTitle(slug);
      originalCaption = slug;
    }
  }

  return (
    <div className='flex flex-col w-full gap-4 sm:gap-5 md:gap-7 bg-background'>
      <div className='flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 sm:pt-10 md:pt-12'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-center mt-2 underline underline-offset-4'>
          {eventTitle}
        </h1>
      </div>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-10 md:pb-12'>
        {slug && (
          <EventGallery
            slug={slug}
            originalCaption={originalCaption || undefined}
          />
        )}
      </div>
    </div>
  );
}
