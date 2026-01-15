// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CoreValue } from './common/types/models';

const GALLERY_IMAGES: string[] = [
  '/imgs/gallery-1.webp',
  '/imgs/gallery-2.webp',
  '/imgs/gallery-3.webp',
  '/imgs/gallery-4.webp',
  '/imgs/gallery-5.webp',
];

interface HomeClientProps {
  coreValues: CoreValue[];
}

export default function HomeClient({ coreValues }: HomeClientProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className='relative w-full'>
      {/* Hero Section - starts at absolute top */}
      <div className='relative w-full h-screen min-h-[600px] flex items-center overflow-hidden -mt-[140px] pt-[140px]'>
        {/* Background Image */}
        <Image
          src='/imgs/home-banner.jpg'
          alt='Poiema Ministries'
          loading='eager'
          fill
          className='object-cover'
          style={{ filter: 'grayscale(100%)' }}
          priority
        />

        {/* Black Overlay */}
        <div className='absolute inset-0 bg-black/40 z-0'></div>

        {/* Content - positioned on the top left, centered on mobile */}
        <div className='relative z-20 w-full h-full flex items-start justify-center md:justify-start pt-10 sm:pt-16 md:pt-20 lg:pt-10'>
          <div className='w-full max-w-7xl md:max-w-none mx-auto md:mx-0 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
            <div
              className={`flex flex-col items-center md:items-start text-white transition-opacity duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Definition */}
              <div className='flex flex-col gap-1 text-sm sm:text-base md:text-lg max-w-2xl leading-normal text-center md:text-left'>
                <p className='font-semibold text-lg sm:text-xl md:text-2xl leading-normal'>
                  poiema
                </p>
                <p className='italic leading-normal'>poy'-ah-meh</p>
                <p className='font-semibold leading-normal'>
                  Greek word for workmanship or masterpiece
                </p>
                <div className='mt-1.5 space-y-0.5 leading-normal'>
                  <p className='leading-normal'>I. that which has been made</p>
                  <p className='leading-normal'>II. a work</p>
                  <p className='md:ml-4 leading-normal'>
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

        {/* Images Section - Infinite sliding carousel */}
        <div className='w-full overflow-hidden pb-8 sm:pb-12 md:pb-16'>
          <div className='relative w-full overflow-hidden'>
            {/* Container for infinite sliding animation */}
            <div className='flex animate-infinite-slide gap-4 sm:gap-6 md:gap-8'>
              {/* First set of images */}
              {GALLERY_IMAGES.map((imageSrc, idx) => (
                <div
                  key={`gallery-1-${idx}`}
                  className='relative flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[calc((100vw-6rem)/3)] md:w-[calc((100vw-8rem)/3)] lg:w-[calc((100vw-12rem)/3)]'
                >
                  <div className='relative w-full h-64 sm:h-auto sm:aspect-square md:h-96 overflow-hidden'>
                    <Image
                      src={imageSrc}
                      alt={`Poiema Ministries Gallery ${idx + 1}`}
                      fill
                      className='object-cover'
                      priority={idx < 3}
                    />
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {GALLERY_IMAGES.map((imageSrc, idx) => (
                <div
                  key={`gallery-2-${idx}`}
                  className='relative flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[calc((100vw-6rem)/3)] md:w-[calc((100vw-8rem)/3)] lg:w-[calc((100vw-12rem)/3)]'
                >
                  <div className='relative w-full h-64 sm:h-auto sm:aspect-square md:h-96 overflow-hidden'>
                    <Image
                      src={imageSrc}
                      alt={`Poiema Ministries Gallery ${idx + 1}`}
                      fill
                      className='object-cover'
                    />
                  </div>
                </div>
              ))}
            </div>
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
                <h3 className='text-xl sm:text-2xl md:text-3xl font-bold text-primary-black text-center md:text-left'>
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

        {/* Service Times Section */}
        <div className='relative w-full bg-white mt-6 sm:mt-8 lg:mt-12'>
          <div className='flex flex-col md:flex-row lg:flex-row w-full'>
            {/* Left Image - summer-2022.jpg - only shown on desktop (lg+) */}
            <div className='hidden lg:block relative w-full lg:w-[300px] h-[549px] flex-shrink-0'>
              <Image
                src='/imgs/summer-2022.jpg'
                alt='Summer service'
                fill
                className='object-cover'
                loading='eager'
              />
            </div>

            {/* Center Schedule Section */}
            <div className='relative w-full md:w-1/2 lg:w-[482px] h-auto md:h-[500px] lg:h-[549px] bg-[#FFF3E9] flex-shrink-0 flex flex-col justify-start px-6 sm:px-8 md:px-10 py-8 sm:py-10 lg:py-12'>
              {/* Service Times Title */}
              <div className='flex flex-col mb-4 sm:mb-6 lg:mb-8'>
                <h3 className='text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-medium text-primary-black leading-tight sm:leading-[40px] lg:leading-[52px] mb-2'>
                  Service Times
                </h3>
                <div className='w-full max-w-[255.59px] h-[1px] border-t border-primary-black'></div>
              </div>

              {/* Schedule Content */}
              <div className='flex flex-col gap-4 sm:gap-6 lg:gap-8'>
                {/* Morning Schedule */}
                <div className='flex flex-col gap-2'>
                  <h4 className='text-lg sm:text-xl md:text-2xl lg:text-[24px] font-bold text-primary-black leading-tight sm:leading-[30px] lg:leading-[35px]'>
                    1st Service
                  </h4>
                  <p className='text-base sm:text-lg md:text-xl lg:text-[24px] font-normal text-primary-black leading-relaxed sm:leading-[28px] lg:leading-[35px]'>
                    9:30AM - Poiema Ministries Main Sanctuary
                  </p>
                </div>

                {/* Afternoon Schedule */}
                <div className='flex flex-col gap-2'>
                  <h4 className='text-lg sm:text-xl md:text-2xl lg:text-[24px] font-bold text-primary-black leading-tight sm:leading-[30px] lg:leading-[35px]'>
                    2nd Service
                  </h4>
                  <p className='text-base sm:text-lg md:text-xl lg:text-[24px] font-normal text-primary-black leading-relaxed sm:leading-[28px] lg:leading-[35px]'>
                    11:30AM - Poiema Ministries Main Sanctuary
                  </p>
                </div>

                {/* Address */}
                <p className='text-base sm:text-lg md:text-xl lg:text-[24px] font-bold text-primary-black leading-tight sm:leading-[28px] lg:leading-[35px] mt-2 sm:mt-4'>
                  45-60 211th Street Bayside, NY 11361
                </p>
              </div>
            </div>

            {/* Right Image - winter-2024.jpg - shown on all sizes */}
            <div className='relative w-full md:w-1/2 lg:flex-1 h-[300px] sm:h-[350px] md:h-[500px] lg:h-[549px]'>
              <Image
                src='/imgs/winter-2024.jpg'
                alt='Winter service'
                fill
                className='object-cover'
                loading='eager'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
