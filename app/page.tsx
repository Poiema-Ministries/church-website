// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import { CoreValue, HomePage } from './common/types/models';
import { client } from '../sanity/lib/client';
import { coreValuesQuery, homePageQuery } from '../sanity/lib/queries';
import { urlFor } from '../sanity/lib/image';
import { SANITY_TAGS } from '../sanity/lib/cache';
import HomeClient from './home-client';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Poiema Ministries is the English Ministry of the Korean Presbyterian Church of Bayside. We love sharing the gospel and love of Jesus Christ to all whether our local neighbors or brothers and sisters all around the world!',
  openGraph: {
    title: 'Poiema Ministries | EM of Bayside Presbyterian Church',
    description:
      'Poiema Ministries is the English Ministry of the Korean Presbyterian Church of Bayside. We love sharing the gospel and love of Jesus Christ to all whether our local neighbors or brothers and sisters all around the world!',
  },
};

function heroObjectPosition(hotspot?: { x: number; y: number }) {
  if (
    !hotspot ||
    typeof hotspot.x !== 'number' ||
    typeof hotspot.y !== 'number'
  ) {
    return undefined;
  }

  return `${hotspot.x * 100}% ${hotspot.y * 100}%`;
}

export default async function Home() {
  const sanity = client.withConfig({ useCdn: false });
  const fetchOptions = {
    next: {
      revalidate: 0,
      tags: [SANITY_TAGS.homePage, SANITY_TAGS.coreValue, SANITY_TAGS.all],
    },
  };

  const [coreValues, homePage] = await Promise.all([
    sanity.fetch<CoreValue[]>(coreValuesQuery, {}, fetchOptions),
    sanity.fetch<HomePage | null>(homePageQuery, {}, fetchOptions),
  ]);

  const heroImage = homePage?.heroImage;
  const heroImageSrc = heroImage?.asset
    ? urlFor(heroImage).width(2400).quality(85).url()
    : undefined;

  return (
    <HomeClient
      coreValues={coreValues}
      heroImageSrc={heroImageSrc}
      heroImagePosition={heroObjectPosition(heroImage?.hotspot)}
    />
  );
}
