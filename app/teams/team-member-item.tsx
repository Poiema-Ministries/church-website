// Copyright 2025 Poiema Ministries. All Rights Reserved.

import Image from 'next/image';
import { TeamMember } from '../common/types/models';
import { urlFor } from '../../sanity/lib/image';

interface TeamMemberItemProps {
  teamMember: TeamMember;
}

export default function TeamMemberItem({ teamMember }: TeamMemberItemProps) {
  const imageUrl = teamMember.image?.asset
    ? urlFor(teamMember.image).url()
    : undefined;

  return (
    <div className='flex flex-col items-center flex-shrink-0 w-full'>
      {/* Full-size image with original aspect ratio */}
      <div className='relative w-full bg-gray-100 overflow-hidden mb-4 sm:mb-5'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={teamMember.image?.alt || teamMember.name}
            width={0}
            height={0}
            className='w-full h-auto object-contain'
            sizes='(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 250px'
            unoptimized={false}
          />
        ) : (
          <div className='w-full aspect-square bg-gray-200 flex items-center justify-center'>
            <span className='text-primary-black/40 text-xs sm:text-sm'>No Image</span>
          </div>
        )}
      </div>
      {/* Name */}
      <span className='text-base sm:text-lg md:text-xl font-medium text-primary-black text-center'>
        {teamMember.name}
      </span>
    </div>
  );
}
