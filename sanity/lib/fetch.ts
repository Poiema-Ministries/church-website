// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { client } from './client';
import { SANITY_REVALIDATE_SECONDS, SANITY_TAGS } from './cache';

interface SanityFetchOptions {
  tags?: string[];
  revalidate?: number;
}

/**
 * Fetches from Sanity with Next.js Data Cache (ISR) and cache tags
 * for on-demand revalidation via /api/revalidate.
 */
export async function sanityCachedFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: SanityFetchOptions,
): Promise<T> {
  return client.fetch(query, params ?? {}, {
    next: {
      revalidate: options?.revalidate ?? SANITY_REVALIDATE_SECONDS,
      tags: options?.tags ?? [SANITY_TAGS.all],
    },
  });
}
