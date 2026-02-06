// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { Sermon } from '../common/types/models';

interface SermonItemProps {
  sermon: Sermon;
  isLast?: boolean;
}

export default function SermonItem({
  sermon,
  isLast = false,
}: SermonItemProps) {
  const formatDate = (date: Date | string) => {
    let dateObj: Date;
    if (typeof date === 'string') {
      // Sanity date-only strings (YYYY-MM-DD) are parsed as UTC midnight,
      // which shifts to previous day in western timezones. Parse as local date.
      const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const [, y, m, d] = match;
        dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSermonOnClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={() => handleSermonOnClick(sermon.url)}
      className='flex flex-col w-full cursor-pointer'
    >
      <div className='flex flex-col w-full py-2 space-y-1'>
        <div className='flex w-full font-bold'>
          <span>
            {`${sermon.title} | ${sermon.bibleVerse} | ${sermon.preacher}`}
          </span>
        </div>
        <div className='flex w-full font-semibold'>
          <span>{formatDate(sermon.date)}</span>
        </div>
      </div>
      {!isLast && (
        <div className='border-t-[0.5px] border-primary-black w-full'></div>
      )}
    </div>
  );
}
