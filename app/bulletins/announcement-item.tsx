// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { Announcement } from '../common/types/models';

interface AnnouncementItemProps {
  announcement: Announcement;
}

export default function AnnouncementItem({ announcement }: AnnouncementItemProps) {
  return (
    <div className='flex flex-row gap-3 w-full md:w-auto'>
      <span className='font-semibold'>{announcement.order}.</span>
      <div className='flex flex-col flex-1'>
        <span className='font-semibold text-center md:text-left'>{announcement.title}</span>
        <span className='font-medium whitespace-pre-line text-center md:text-left mt-1'>
          {announcement.description}
        </span>
      </div>
    </div>
  );
}
