// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { servicesPageQuery } from '@/sanity/lib/queries';
import {
  toServicesContent,
  type ServicesQueryResult,
} from '@/app/services/content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const noStoreHeaders = {
  'Cache-Control': 'no-store, max-age=0, must-revalidate',
};

export async function GET() {
  try {
    const result = await client
      .withConfig({ useCdn: false })
      .fetch<ServicesQueryResult>(
        servicesPageQuery,
        {},
        {
          cache: 'no-store',
          next: { revalidate: 0 },
        },
      );

    return NextResponse.json(toServicesContent(result), {
      headers: noStoreHeaders,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      {
        status: 500,
        headers: noStoreHeaders,
      },
    );
  }
}
