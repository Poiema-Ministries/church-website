// Copyright 2025 Poiema Ministries. All Rights Reserved.

import SermonsClient from './sermons-client';

// Disable caching for this page since sermons update frequently
export const revalidate = 0;
export const dynamic = 'force-dynamic';

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
