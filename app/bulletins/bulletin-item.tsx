// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { Bulletin } from '../common/types/models';

interface BulletinItemProps {
  bulletin: Bulletin;
}

export default function BulletinItem({ bulletin }: BulletinItemProps) {
  return (
    <div className='flex flex-col items-center justify-center'>
      <span className='font-semibold'>{bulletin.title}</span>
      <span className='font-medium whitespace-pre-line text-center'>
        {bulletin.description}
      </span>
    </div>
  );
}
