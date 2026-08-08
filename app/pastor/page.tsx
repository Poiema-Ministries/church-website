// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Pastor } from '../common/types/models';
import { client } from '@/sanity/lib/client';
import { pastorQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { SANITY_TAGS } from '@/sanity/lib/cache';
import PastorClient from './pastor-client';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Meet Our Pastor',
  description:
    'Meet Pastor Sam Jung of Poiema Ministries. Learn about our pastor and his heart for serving the English Ministry of Bayside Presbyterian Church.',
  openGraph: {
    title: 'Meet Our Pastor | Poiema Ministries',
    description:
      'Meet Pastor Sam Jung of Poiema Ministries. Learn about our pastor and his heart for serving the English Ministry of Bayside Presbyterian Church.',
  },
};

export default async function PastorPage() {
  const pastor: Pastor | null = await client
    .withConfig({ useCdn: false })
    .fetch(pastorQuery, {}, {
      next: {
        revalidate: 0,
        tags: [SANITY_TAGS.pastor, SANITY_TAGS.all],
      },
    });

  const name = pastor?.name?.trim();
  const description =
    pastor?.description?.filter((paragraph) => paragraph?.trim()) ?? [];
  const imageSrc = pastor?.image?.asset
    ? urlFor(pastor.image).width(800).quality(85).url()
    : null;

  if (!name || !imageSrc || description.length === 0) {
    notFound();
  }

  return (
    <PastorClient name={name} imageSrc={imageSrc} description={description} />
  );
}
