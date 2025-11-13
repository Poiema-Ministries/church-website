'use client';

import { Sermon } from '../common/types/models';

interface SermonItemProps {
  sermon: Sermon;
}

export default function SermonItem({ sermon }: SermonItemProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
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
      <div className='border-t-[0.5px] border-primary-black w-full'></div>
    </div>
  );
}
