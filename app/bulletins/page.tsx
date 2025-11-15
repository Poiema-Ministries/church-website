// Copyright 2025 Poiema Ministries. All Rights Reserved.

import BulletinItem from './bulletin-item';
import { Bulletin } from '../common/types/models';
import { client } from '../../sanity/lib/client';
import { bulletinsQuery } from '../../sanity/lib/queries';

export default async function Bulletins() {
  const bulletins: Bulletin[] = await client.fetch(bulletinsQuery);

  const renderBulletins = () => {
    console.log(bulletins);
    return bulletins.map(
      (bulletin: Bulletin & { _id?: string }, index: number) => {
        return <BulletinItem bulletin={bulletin} key={bulletin._id} />;
      },
    );
  };

  return (
    <div className='flex flex-col w-full gap-4 sm:gap-5 md:gap-7'>
      <div className='flex flex-col items-center md:items-start w-full max-w-xl mx-auto md:mx-0'>
        <h1 className='text-4xl font-bold text-center mt-10 px-4 md:px-0 md:ml-5'>
          Bulletins
        </h1>
      </div>
      <div className='flex flex-col items-center justify-center gap-4 px-4'>
        {renderBulletins()}
      </div>
      <div className='flex flex-col items-center md:items-start w-full max-w-xl mx-auto md:mx-0'>
        <h1 className='text-4xl font-bold text-center mt-10 px-4 md:px-0 md:ml-5'>
          Announcements
        </h1>
      </div>
      <div className='flex flex-col items-center justify-center gap-4 px-4'></div>
    </div>
  );
}
