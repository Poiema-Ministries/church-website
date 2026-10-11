// Copyright 2025 Poiema Ministries. All Rights Reserved.

import Image from 'next/image';
import { Announcement } from '../common/types/models';
import { urlFor } from '../../sanity/lib/image';

interface AnnouncementItemProps {
  announcement: Announcement;
  displayNumber: number;
}

export default function AnnouncementItem({
  announcement,
  displayNumber,
}: AnnouncementItemProps) {
  const hasImage =
    announcement.announcementImage?.image?.asset &&
    announcement.announcementImage?.width &&
    announcement.announcementImage?.height;
  const imageUrl = hasImage
    ? urlFor(announcement.announcementImage!.image!).url()
    : undefined;

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-2xl'>
      <span className='font-semibold text-center'>
        {displayNumber}. {announcement.title}
      </span>
      <span className='font-medium whitespace-pre-line text-center mt-1'>
        {announcement.description}
      </span>
      {hasImage && imageUrl && (
        <div className='mt-2 flex justify-center'>
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
  );
}
