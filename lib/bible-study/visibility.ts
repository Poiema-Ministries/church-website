// Copyright 2026 Poiema Ministries. All Rights Reserved.

import 'server-only';

import { client } from '@/sanity/lib/client';
import { SANITY_TAGS } from '@/sanity/lib/cache';
import { bibleStudyEnabledQuery } from '@/sanity/lib/queries';

/**
 * Public Bible Study stays hidden until an editor turns on
 * "Show Bible Study on the website" in Studio. A missing document or a
 * failed read stays hidden so the page cannot leak out by accident.
 */
export async function isBibleStudyPublic(): Promise<boolean> {
  try {
    const document = await client
      .withConfig({ useCdn: false })
      .fetch<{ isEnabled?: boolean } | null>(
        bibleStudyEnabledQuery,
        {},
        {
          next: {
            revalidate: 0,
            tags: [SANITY_TAGS.bibleStudy, SANITY_TAGS.all],
          },
        },
      );

    return document?.isEnabled === true;
  } catch {
    return false;
  }
}
