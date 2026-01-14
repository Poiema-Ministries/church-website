// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import SermonsClient from './sermons-client';

// Disable caching for this page since sermons update frequently
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sermons',
  description:
    "Listen to sermons from Poiema Ministries. Join us as we explore God's Word and grow in our faith together through weekly messages from our pastors and guest speakers.",
  openGraph: {
    title: 'Sermons | Poiema Ministries',
    description:
      "Listen to sermons from Poiema Ministries. Join us as we explore God's Word and grow in our faith together through weekly messages from our pastors and guest speakers.",
  },
};

export default function Sermons() {
  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-col items-start w-full max-w-xl'>
        <h1 className='text-4xl font-bold text-center mt-10 ml-4 md:ml-8'>
          Sermons
        </h1>
      </div>
      <SermonsClient />
    </div>
  );
}
