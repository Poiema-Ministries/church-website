// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://poiemaministries.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/bible-study/unsubscribe'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
