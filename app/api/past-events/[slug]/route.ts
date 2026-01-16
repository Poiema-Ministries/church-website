// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { getImagesFromFolder } from '@/lib/cloudinary';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const nextCursor = searchParams.get('cursor') || undefined;

    const resolvedParams = 'then' in params ? await params : params;
    const slug = resolvedParams.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const folderName = decodeURIComponent(slug);
    const result = await getImagesFromFolder(folderName, 10, nextCursor);

    return NextResponse.json({
      images: result.images || [],
      nextCursor: result.nextCursor || null,
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch images';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
