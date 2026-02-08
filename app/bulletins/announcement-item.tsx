// Copyright 2025 Poiema Ministries. All Rights Reserved.

import Image from 'next/image';
import { Announcement } from '../common/types/models';
import { urlFor } from '../../sanity/lib/image';

interface AnnouncementItemProps {
  announcement: Announcement;
}

export default function AnnouncementItem({
  announcement,
}: AnnouncementItemProps) {
  const hasImage =
    announcement.announcementImage?.image?.asset &&
    announcement.announcementImage?.width &&
    announcement.announcementImage?.height;
  const imageUrl = hasImage
    ? urlFor(announcement.announcementImage!.image!).url()
    : undefined;

  return (
    <div className='flex flex-row gap-3 w-full md:w-auto'>
      <span className='font-semibold'>{announcement.order}.</span>
      <div className='flex flex-col flex-1'>
        <span className='font-semibold text-center md:text-left'>
          {announcement.title}
        </span>
        <span className='font-medium whitespace-pre-line text-center md:text-left mt-1'>
          {announcement.description}
        </span>
        {hasImage && imageUrl && (
          <div className='mt-2 flex justify-center md:justify-start'>
            <Image
              src={imageUrl}
              alt={announcement.title}
              width={announcement.announcementImage!.width}
              height={announcement.announcementImage!.height}
              className='object-contain'
              loading='lazy'
            />
          </div>
        )}
      </div>
    </div>
  );
}
