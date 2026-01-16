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

    const covers: CoverImage[] = (
      assets as unknown as CloudinaryAsset[]
    ).map((asset) => {
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
  } catch (error) {
    console.error('Error fetching covers:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch covers';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
