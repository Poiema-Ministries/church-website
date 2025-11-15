// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { CoreValue } from './common/types/models';
import { client } from '../sanity/lib/client';
import { coreValuesQuery } from '../sanity/lib/queries';
import HomeClient from './home-client';

export default async function Home() {
  const coreValues: CoreValue[] = await client.fetch(coreValuesQuery);

  return <HomeClient coreValues={coreValues} />;
}
