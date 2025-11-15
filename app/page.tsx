// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
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
          <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12'>
            <div
              className={`flex flex-col items-center md:items-start text-white transition-opacity duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            > 
              {/* Definition */}
              <div className='flex flex-col gap-0.5 text-sm sm:text-base md:text-lg max-w-2xl leading-tight text-center md:text-left'>
                <p className='font-semibold text-lg sm:text-xl md:text-2xl leading-tight'>poiema</p>
                <p className='italic leading-tight'>poy'-ah-meh</p>
                <p className='font-semibold leading-tight'>Greek word for workmanship or masterpiece</p>
                <div className='mt-1 space-y-0.5 leading-tight'>
                  <p className='leading-tight'>I. that which has been made</p>
                  <p className='leading-tight'>II. a work</p>
                  <p className='md:ml-4 leading-tight'>A. of the works of God as a creator</p>
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
              We're all about loving God wholeheartedly and serving everyone as Jesus came to serve us. We trust Jesus without compromise and strive to continually awaken and equip disciples of Christ wherever we go.
            </p>
          </div>
        </div>
        
        {/* Images Section - Three images horizontally with spacing */}
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-12 md:pb-16'>
          <div className='relative w-full sm:flex-1 h-64 sm:h-80 md:h-96 overflow-hidden'>
            <Image
              src='/imgs/first-service.webp'
              alt='Poiema Ministries Community'
              fill
              className='object-cover'
            />
          </div>
          <div className='relative w-full sm:flex-1 h-64 sm:h-80 md:h-96 overflow-hidden'>
            <Image
              src='/imgs/second-service.webp'
              alt='Poiema Ministries Worship'
              fill
              className='object-cover'
            />
          </div>
          <div className='relative w-full sm:flex-1 h-64 sm:h-80 md:h-96 overflow-hidden'>
            <Image
              src='/imgs/offering-banner.png'
              alt='Poiema Ministries Community'
              fill
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
