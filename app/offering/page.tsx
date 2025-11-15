// Copyright 2025 Poiema Ministries. All Rights Reserved.
import Image from 'next/image';
import Link from 'next/link';

export default function Offering() {
  return (
    <div className='flex flex-col w-full gap-4 sm:gap-5 md:gap-7'>
      <div className='relative flex flex-col items-center md:items-start w-full h-48 overflow-hidden'>
        <Image
          src='/imgs/offering-banner.png'
          alt='Offering'
          width={1000}
          height={64}
          className='absolute inset-0 w-full h-full object-cover'
        />
        <h1 className='relative z-10 text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-7 px-4 md:px-0 md:ml-5 text-white'>
          Online Offering
        </h1>
        <span className='relative z-10 text-base sm:text-lg md:text-2xl text-center mt-2 px-4 md:px-0 md:ml-5 text-white'>
          Your generosity helps us serve our community.
        </span>
        <Link
          href='https://tithe.ly/give_new/www/#/tithely/give-one-time/1285769'
          target='_blank'
          rel='noopener noreferrer'
          className='relative z-10 inline-block text-white px-4 py-0.5 rounded-lg mt-3 md:px-5 md:ml-5 border-2 border-white'
        >
          Give Now
        </Link>
      </div>
      <div className='flex flex-col md:flex-row w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 gap-8 md:gap-12 bg-background'>
        <div className='flex-1 flex items-center justify-center md:justify-start'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl  md:text-left font-bold text-primary-black'>
            Why We Give?
          </h2>
        </div>
        <div className='flex-1 flex items-center'>
          <p className='text-sm sm:text-base md:text-lg leading-relaxed font-bold text-primary-black'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </div>
      </div>
    </div>
  );
}
