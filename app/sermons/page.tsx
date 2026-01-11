// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { Sermon } from '../common/types/models';
import SermonItem from './sermon-item';
import { client } from '../../sanity/lib/client';
import { sermonsQuery } from '../../sanity/lib/queries';

// Disable caching for this page since sermons update frequently
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Sermons() {
  const renderSermons = async () => {
    const sermons: Sermon[] = await client.fetch(sermonsQuery);
    return sermons.map((sermon: Sermon & { _id?: string }, index: number) => {
      const isLast = index === sermons.length - 1;
      return <SermonItem sermon={sermon} key={sermon._id} isLast={isLast} />;
    });
  };

  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-col items-start w-full max-w-xl'>
        <h1 className='text-4xl font-bold text-center mt-10 ml-4 md:ml-8'>
          Sermons
        </h1>
      </div>
      <div className='flex flex-col items-start w-full px-4 sm:px-6 md:px-8'>
        {renderSermons()}
      </div>
    </div>
  );
}
