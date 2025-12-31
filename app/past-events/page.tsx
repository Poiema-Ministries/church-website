// Copyright 2025 Poiema Ministries. All Rights Reserved.

import Image from 'next/image';
import Link from 'next/link';
import { getAssetsFromCollection } from '@/lib/cloudinary';

interface CoverImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  title?: string;
  description?: string;
  originalCaption?: string;
}

/**
 * Format title from Cloudinary format (e.g., "2025_july_bbq") to display format (e.g., "2025 July BBQ")
 */
function formatTitle(title: string): string {
  // Remove file extension if present (e.g., ".jpg", ".png")
  const withoutExtension = title.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '');

  return withoutExtension
    .split('_')
    .map((word) => {
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Extract date from description field
 */
function extractDate(description: string): string | null {
  // Try to find date patterns in the description
  const datePatterns = [
    /([A-Za-z]+\s+\d{1,2},\s+\d{4})/, // "January 21, 2025"
    /(\d{4}-\d{2}-\d{2})/, // "2025-01-21"
    /(\d{1,2}\/\d{1,2}\/\d{4})/, // "01/21/2025"
  ];

  for (const pattern of datePatterns) {
    const match = description.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

async function getCovers(): Promise<CoverImage[]> {
  try {
    const assets = await getAssetsFromCollection('covers', 100);

    const covers: CoverImage[] = assets.map((asset: any) => {
      // Get title from caption in context or metadata
      const caption = asset.context?.caption || asset.metadata?.caption || '';

      // Store the original caption for use as folder name/slug
      const originalCaption = caption;

      // Format the caption if it's in underscore format (e.g., "2025_july_bbq")
      const title =
        caption && caption.includes('_') ? formatTitle(caption) : caption;

      // Get description from context alt or metadata description
      const description =
        asset.context?.alt || asset.metadata?.description || '';

      return {
        public_id: asset.public_id,
        secure_url: asset.secure_url,
        width: asset.width,
        height: asset.height,
        format: asset.format,
        title: title || 'Untitled Event',
        description,
        originalCaption: originalCaption || '', // Store original caption for slug
      };
    });

    // Sort by title (year first, then event name) - most recent first
    covers.sort((a, b) => {
      if (!a.title || !b.title) return 0;
      return b.title.localeCompare(a.title);
    });

    return covers;
  } catch (error) {
    console.error('Error fetching covers:', error);
    return [];
  }
}

export default async function PastEvents() {
  const covers = await getCovers();

  return (
    <div className='flex flex-col w-full gap-4 sm:gap-5 md:gap-7 bg-background'>
      <div className='flex flex-col items-center md:items-start w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 sm:pt-10 md:pt-12'>
        <h1 className='text-4xl font-bold text-center mt-2'>Past Events</h1>
      </div>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-10 md:pb-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12'>
          {covers.map((cover) => {
            const date = cover.description
              ? extractDate(cover.description)
              : null;

            // Convert caption to slug (use original caption with underscores)
            const slug =
              cover.originalCaption || cover.public_id.split('/').pop() || '';

            return (
              <Link
                key={cover.public_id}
                href={`/past-events/${slug}`}
                className='group flex flex-col cursor-pointer'
              >
                <div className='relative w-full aspect-[4/3] overflow-hidden mb-3'>
                  <Image
                    src={cover.secure_url}
                    alt={cover.title || 'Past Event'}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    loading='eager'
                  />
                </div>
                <div className='flex flex-col'>
                  <h3 className='text-xl sm:text-2xl font-bold text-primary-black mb-0.5 group-hover:underline'>
                    {cover.title || 'Untitled Event'}
                  </h3>
                  {date && (
                    <p className='text-sm sm:text-base text-primary-black/70'>
                      {date}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {covers.length === 0 && (
          <div className='flex items-center justify-center py-12'>
            <p className='text-lg text-primary-black/70'>
              No past events found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
