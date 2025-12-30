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
    .map((word, index) => {
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
  // Common formats: "January 21, 2025", "2025-01-21", "01/21/2025", etc.
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

export async function GET() {
  try {
    const assets = await getAssetsFromCollection('covers', 100);

    const covers: CoverImage[] = assets.map((asset: any) => {
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
    });

    // Sort by title (year first, then event name) - most recent first
    covers.sort((a, b) => {
      if (!a.title || !b.title) return 0;
      return b.title.localeCompare(a.title);
    });

    return NextResponse.json({ covers });
  } catch (error: any) {
    console.error('Error fetching covers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch covers' },
      { status: 500 },
    );
  }
}
