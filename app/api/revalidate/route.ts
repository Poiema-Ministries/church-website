// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import {
  SANITY_TAGS,
  SANITY_TYPE_TO_PATHS,
  SANITY_TYPE_TO_TAG,
  type SanityDocumentType,
} from '@/sanity/lib/cache';

interface SanityWebhookPayload {
  _type?: string;
  slug?: {
    current?: string;
  };
}

function isSanityDocumentType(value: string): value is SanityDocumentType {
  return value in SANITY_TYPE_TO_TAG;
}

/**
 * On-demand revalidation for Sanity content updates.
 * Configure a Sanity webhook to POST here when documents are published.
 *
 * Required env: SANITY_REVALIDATE_SECRET
 * Header: x-sanity-revalidate-secret: <secret>
 */
export async function POST(req: Request) {
  const secret = req.headers.get('x-sanity-revalidate-secret');

  if (
    !process.env.SANITY_REVALIDATE_SECRET ||
    secret !== process.env.SANITY_REVALIDATE_SECRET
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let documentType: string | undefined;
  let slug: string | undefined;

  try {
    const body = (await req.json()) as SanityWebhookPayload;
    documentType = body._type;
    slug = body.slug?.current;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!documentType || !isSanityDocumentType(documentType)) {
    revalidateTag(SANITY_TAGS.all, 'max');
    return NextResponse.json({
      revalidated: true,
      scope: 'all',
    });
  }

  const tag = SANITY_TYPE_TO_TAG[documentType];
  revalidateTag(tag, 'max');
  revalidateTag(SANITY_TAGS.all, 'max');

  const paths = SANITY_TYPE_TO_PATHS[documentType];
  for (const path of paths) {
    revalidatePath(path);
  }

  if (documentType === 'upcomingEvent' && slug) {
    revalidatePath(`/upcoming-events/${slug}`);
  }

  return NextResponse.json({
    revalidated: true,
    type: documentType,
    tag,
    paths:
      documentType === 'upcomingEvent' && slug
        ? [...paths, `/upcoming-events/${slug}`]
        : paths,
  });
}
