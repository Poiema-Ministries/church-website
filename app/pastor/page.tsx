// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Meet Our Pastor',
  description:
    'Meet Pastor Sam Jung of Poiema Ministries. Learn about our pastor and his heart for serving the English Ministry of Bayside Presbyterian Church.',
  openGraph: {
    title: 'Meet Our Pastor | Poiema Ministries',
    description:
      'Meet Pastor Sam Jung of Poiema Ministries. Learn about our pastor and his heart for serving the English Ministry of Bayside Presbyterian Church.',
  },
};

export default function Pastor() {
  return (
    <div className='flex flex-col min-h-screen w-full gap-0'>
      <div className='flex flex-col items-center lg:items-start w-full mb-4 sm:mb-6 lg:mb-1 px-4 sm:px-5 lg:px-0 lg:ml-10'>
        <h1 className='text-3xl sm:text-4xl font-bold text-center lg:text-left w-full lg:pl-4 xl:pl-7'>
          Meet Our Pastor
        </h1>
      </div>
      <div className='flex flex-col lg:flex-row w-full px-4 sm:px-5 lg:px-0 lg:ml-10 lg:pl-4 xl:pl-7 gap-4 sm:gap-6 lg:gap-8 items-center lg:items-start mt-4 sm:mt-6'>
        <div className='flex w-full lg:w-auto justify-center lg:justify-start'>
          <Image
            src='/imgs/pastor.jpg'
            width={400}
            height={270}
            alt='Pastor Sam Jung'
            className='w-full max-w-full sm:max-w-[400px] h-auto'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 400px, 400px'
          />
        </div>
        <div className='flex flex-col w-full lg:max-w-2xl lg:pr-4 xl:pr-8'>
          <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center lg:text-left mb-3 sm:mb-4 lg:mb-6'>
            Pastor Sam Jung
          </h2>
          <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-center lg:text-left'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>
      </div>
    </div>
  );
}
