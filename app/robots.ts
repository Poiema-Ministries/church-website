// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { MetadataRoute } from 'next';

import { isBibleStudyPublic } from '@/lib/bible-study/visibility';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://poiemaministries.org';
  const disallow = ['/studio/', '/api/', '/bible-study/unsubscribe'];

  if (!(await isBibleStudyPublic())) {
    disallow.push('/bible-study');
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
