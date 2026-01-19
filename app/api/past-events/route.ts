// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { getAssetsFromCollection } from '@/lib/cloudinary';

export interface CoverImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  title?: string;
  description?: string;
}

/**
 * Format title from Cloudinary format (e.g., "2025_july_bbq") to display format (e.g., "2025 July BBQ")
 */
function formatTitle(title: string): string {
  return title
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

/**
 * Parse date string into Date object for sorting
 */
function parseDate(dateString: string): Date | null {
  try {
    // Try parsing as-is (handles ISO format and most standard formats)
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  } catch {
    return null;
  }
}

interface CloudinaryAsset {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  context?: {
    alt?: string;
    caption?: string;
  };
  metadata?: {
    description?: string;
  };
}

export async function GET() {
  try {
    const assets = await getAssetsFromCollection('covers', 100);

    const covers: CoverImage[] = (assets as unknown as CloudinaryAsset[]).map(
      (asset) => {
        // Get title from public_id (format: covers/2025_july_bbq)
        const publicIdParts = asset.public_id.split('/');
        const fileName = publicIdParts[publicIdParts.length - 1];
        const title = formatTitle(fileName);

        // Get description from context or metadata
        const description =
          asset.context?.alt ||
          asset.context?.caption ||
          asset.metadata?.description ||
          '';

        return {
          public_id: asset.public_id,
          secure_url: asset.secure_url,
          width: asset.width,
          height: asset.height,
          format: asset.format,
          title,
          description,
        };
      },
    );

    // Sort by date (most recent first), with fallback to title sorting
    covers.sort((a, b) => {
      // Extract dates from descriptions
      const dateA = a.description ? extractDate(a.description) : null;
      const dateB = b.description ? extractDate(b.description) : null;

      // If both have dates, sort by date
      if (dateA && dateB) {
        const parsedDateA = parseDate(dateA);
        const parsedDateB = parseDate(dateB);

        if (parsedDateA && parsedDateB) {
          // Most recent first (descending order)
          return parsedDateB.getTime() - parsedDateA.getTime();
        }
      }

      // If only one has a date, prioritize the one with date (put it first)
      if (dateA && !dateB) return -1;
      if (!dateA && dateB) return 1;

      // If neither has a date, sort by title (fallback)
      if (!a.title || !b.title) return 0;
      return b.title.localeCompare(a.title);
    });

    return NextResponse.json({ covers });
  } catch (error) {
    console.error('Error fetching covers:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch covers';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
