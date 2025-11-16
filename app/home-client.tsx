// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CoreValue } from './common/types/models';

interface HomeClientProps {
  coreValues: CoreValue[];
}

export default function HomeClient({ coreValues }: HomeClientProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className='relative w-full'>
      {/* Hero Section - starts at absolute top */}
      <div className='relative w-full h-screen min-h-[600px] flex items-center overflow-hidden -mt-[140px] pt-[140px]'>
        {/* Background Image */}
        <Image
          src='/imgs/home-banner.webp'
          alt='Poiema Ministries'
          fill
          className='object-cover'
          style={{ filter: 'grayscale(100%)' }}
          priority
        />

        {/* Black Overlay */}
        <div className='absolute inset-0 bg-black/40 z-0'></div>

        {/* Content - positioned on the top left, centered on mobile */}
        <div className='relative z-20 w-full h-full flex items-start pt-12 sm:pt-16 md:pt-20 lg:pt-24'>
          <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12'>
            <div
              className={`flex flex-col items-center md:items-start text-white transition-opacity duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Definition */}
              <div className='flex flex-col gap-0.5 text-sm sm:text-base md:text-lg max-w-2xl leading-tight text-center md:text-left'>
                <p className='font-semibold text-lg sm:text-xl md:text-2xl leading-tight'>
                  poiema
                </p>
                <p className='italic leading-tight'>poy'-ah-meh</p>
                <p className='font-semibold leading-tight'>
                  Greek word for workmanship or masterpiece
                </p>
                <div className='mt-1 space-y-0.5 leading-tight'>
                  <p className='leading-tight'>I. that which has been made</p>
                  <p className='leading-tight'>II. a work</p>
                  <p className='md:ml-4 leading-tight'>
                    A. of the works of God as a creator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className='flex flex-col w-full bg-background'>
        {/* Text Section - Top Right on Desktop */}
        <div className='w-full flex justify-end p-8 sm:p-12 md:p-16 lg:p-20'>
          <div className='w-full max-w-2xl text-center md:text-right'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary-black mb-6'>
              Welcome to Poiema Ministries
            </h2>
            <p className='text-xs sm:text-sm md:text-base text-primary-black leading-relaxed'>
              We're all about loving God wholeheartedly and serving everyone as
              Jesus came to serve us. We trust Jesus without compromise and
              strive to continually awaken and equip disciples of Christ
              wherever we go.
            </p>
          </div>
        </div>

        {/* Images Section - Three images horizontally with spacing */}
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-12 md:pb-16'>
          <div className='relative w-full sm:flex-1 h-64 sm:h-auto sm:aspect-square md:h-96 overflow-hidden'>
            <Image
              src='/imgs/first-service.webp'
              alt='Poiema Ministries Community'
              fill
              className='object-cover'
            />
          </div>
          <div className='relative w-full sm:flex-1 h-64 sm:h-auto sm:aspect-square md:h-96 overflow-hidden'>
            <Image
              src='/imgs/second-service.webp'
              alt='Poiema Ministries Worship'
              fill
              className='object-cover'
            />
          </div>
          <div className='relative w-full sm:flex-1 h-64 sm:h-auto sm:aspect-square md:h-96 overflow-hidden'>
            <Image
              src='/imgs/offering-banner.png'
              alt='Poiema Ministries Community'
              fill
              className='object-cover'
            />
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className='flex flex-col w-full bg-background'>
        <div className='flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-20 pt-4 sm:pt-6 md:pt-8 lg:pt-12 pb-4 sm:pb-6 md:pb-8 lg:pb-10 px-8 sm:px-12 md:px-16 lg:px-20'>
          <div className='flex flex-col lg:w-[40%] gap-8 items-center md:items-center lg:items-start'>
            <div className='flex flex-col w-fit'>
              <div className='flex flex-col text-center md:text-center lg:text-left'>
                <h2 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-primary-black leading-tight underline underline-offset-4'>
                  OUR
                </h2>
                <h2 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-primary-black leading-tight underline  underline-offset-4'>
                  CORE
                </h2>
                <h2 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-primary-black leading-tight underline  underline-offset-4'>
                  VALUES
                </h2>
              </div>
              <div className='relative w-full aspect-[4/3] overflow-hidden mt-8'>
                <Image
                  src='/imgs/core-values.webp'
                  alt='Poiema Ministries Core Values'
                  fill
                  className='object-contain'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw'
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col lg:w-[60%] gap-8 sm:gap-10 md:gap-12'>
            <div className='w-full border-t border-primary-black mt-10'></div>
            {coreValues.map((value: CoreValue & { _id?: string }) => (
              <div key={value._id} className='flex flex-col gap-3'>
                <h3 className='text-xl sm:text-2xl md:text-3xl font-bold text-primary-black'>
                  {value.title}
                </h3>
                <p className='text-sm sm:text-base md:text-lg text-primary-black leading-relaxed'>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visit Us Section */}
      <div className='flex flex-col w-full bg-background py-6 sm:py-8 md:py-10 lg:py-12'>
        <div className='relative flex items-center justify-center px-8 sm:px-12 md:px-16 lg:px-20 min-h-[200px]'>
          {/* Content Container with Borders */}
          <div className='relative flex flex-col items-center text-center max-w-2xl border-l border-r border-primary-black px-8 sm:px-12 md:px-16 lg:px-20 py-4'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-black mb-4 sm:mb-6'>
              Visit Us
            </h2>
            <p className='text-sm sm:text-base md:text-lg text-primary-black leading-tight mb-4 sm:mb-6 max-w-xs sm:max-w-sm font-semibold'>
              Come join us every Sunday either during our 9:30AM or 11:30AM
              Service
            </p>
            <Link
              href='/services'
              className='inline-block px-6 sm:px-8 py-1.5 border border-primary-black rounded-md text-sm sm:text-base md:text-lg text-primary-black'
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
