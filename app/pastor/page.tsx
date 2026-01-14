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
    <div className='flex flex-col w-full pb-8 sm:pb-10 lg:pb-12'>
      <div className='flex flex-col items-center lg:items-start w-full mb-6 sm:mb-8 lg:mb-8 px-4 sm:px-5 lg:px-0 lg:ml-10'>
        <h1 className='text-3xl sm:text-4xl lg:text-3xl font-bold text-center lg:text-left w-full lg:pl-4 xl:pl-7'>
          Meet Our Pastor
        </h1>
      </div>
      <div className='flex flex-col lg:flex-row w-full px-4 sm:px-5 lg:px-0 lg:ml-10 lg:pl-4 xl:pl-7 gap-6 sm:gap-8 lg:gap-8 items-center lg:items-start'>
        <div className='flex w-full lg:w-auto justify-center lg:justify-start flex-shrink-0'>
          <div className='relative w-full max-w-full sm:max-w-[400px] lg:max-w-[320px]'>
            <Image
              src='/imgs/pastor.jpg'
              width={400}
              height={270}
              alt='Pastor Sam Jung'
              className='w-full h-auto'
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 400px, 320px'
            />
          </div>
        </div>
        <div className='flex flex-col w-full lg:max-w-xl lg:pr-4 xl:pr-8'>
          <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-2xl font-bold text-center lg:text-left mb-4 sm:mb-5 lg:mb-5 text-primary-black'>
            Pastor Sam Jung
          </h2>
          <div className='flex flex-col gap-4 sm:gap-4 lg:gap-4 text-primary-black'>
            <p className='text-sm sm:text-base md:text-lg lg:text-base leading-relaxed text-center lg:text-left'>
              Pastor Sam was born in Korea and came to the US in 2009 to study
              family counseling. He has been here at KPCB since August 2015. He
              is passionate to lead people to come to Jesus and follow him so
              that they can make Jesus known to others.
            </p>
            <p className='text-sm sm:text-base md:text-lg lg:text-base leading-relaxed text-center lg:text-left'>
              This God-given passion led him to serve the young generation as a
              youth pastor for a decade at KPCB. As a youth pastor, he started
              youth discipleship training in 2018, emphasizing the importance of
              discipleship training for teenagers.
            </p>
            <p className='text-sm sm:text-base md:text-lg lg:text-base leading-relaxed text-center lg:text-left'>
              He loves mission and has joined KPCB DR (Dominican Republic)
              mission trips in 2019, 2023, 2024, and 2025 as a mission lead
              pastor. He is also passionate about counseling ministry as an
              effective tool of supporting churches. He and his wife Miyoung
              have two kids: Casey and Hanah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
