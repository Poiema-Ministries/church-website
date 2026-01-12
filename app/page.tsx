// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import { CoreValue } from './common/types/models';
import { client } from '../sanity/lib/client';
import { coreValuesQuery } from '../sanity/lib/queries';
import HomeClient from './home-client';

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

export default async function Home() {
  const coreValues: CoreValue[] = await client.fetch(coreValuesQuery);
  return <HomeClient coreValues={coreValues} />;
}
