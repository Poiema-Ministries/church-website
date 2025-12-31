// Copyright 2025 Poiema Ministries. All Rights Reserved.

import BulletinItem from './bulletin-item';
import AnnouncementItem from './announcement-item';
import { Announcement, Bulletin } from '../common/types/models';
import { client } from '../../sanity/lib/client';
import { bulletinsQuery, announcementsQuery } from '../../sanity/lib/queries';

// Disable caching for this page since bulletins update frequently
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Bulletins() {
  const bulletins: Bulletin[] = await client.fetch(bulletinsQuery);
  const announcements: Announcement[] = await client.fetch(announcementsQuery);

  const renderBulletins = () => {
    console.log(bulletins);
    return bulletins.map(
      (bulletin: Bulletin & { _id?: string }, index: number) => {
        return <BulletinItem bulletin={bulletin} key={bulletin._id} />;
      },
    );
  };

  const renderAnnouncements = () => {
    return announcements.map(
      (announcement: Announcement & { _id?: string }, index: number) => {
        return (
          <AnnouncementItem
            announcement={announcement}
            key={announcement._id}
          />
        );
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
      <div className='flex flex-col items-center md:items-start w-full px-4 md:px-0'>
        <h1 className='text-4xl font-bold text-center md:text-left mt-10 md:ml-5'>
          Announcements
        </h1>
      </div>
      <div className='flex flex-col items-center md:items-end justify-center gap-4 px-4 md:px-0 md:pr-8'>
        <div className='flex flex-col items-center md:items-start gap-4 w-full md:w-auto md:max-w-2xl'>
          {renderAnnouncements()}
        </div>
      </div>
    </div>
  );
}
