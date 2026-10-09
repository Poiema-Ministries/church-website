// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { SANITY_TAGS } from '@/sanity/lib/cache';
import { offeringPageQuery } from '@/sanity/lib/queries';
import { toOfferingContent, type OfferingPageDocument } from './content';

// Offering copy is edited in Sanity and must not be cached.
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Online Offering',
  description:
    'Support Poiema Ministries through online giving. Your generosity helps us continue our mission of sharing the Gospel and serving our community. God loves a cheerful giver.',
  openGraph: {
    title: 'Online Offering | Poiema Ministries',
    description:
      'Support Poiema Ministries through online giving. Your generosity helps us continue our mission of sharing the Gospel and serving our community. God loves a cheerful giver.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Offering() {
  let document: OfferingPageDocument | null = null;

  try {
    document = await client
      .withConfig({ useCdn: false })
      .fetch<OfferingPageDocument | null>(
        offeringPageQuery,
        {},
        {
          cache: 'no-store',
          next: {
            revalidate: 0,
            tags: [SANITY_TAGS.offeringPage, SANITY_TAGS.all],
          },
        },
      );
  } catch (error) {
    console.error('Unable to load the online offering page', error);
  }

  const { label, giveNowUrl, whyWeGive } = toOfferingContent(document);

  return (
    <div className='flex flex-col w-full gap-4 sm:gap-5 md:gap-7'>
      <div className='relative flex flex-col items-center md:items-start w-full h-48 overflow-hidden'>
        <Image
          src='/imgs/offering-banner.png'
          alt='Offering'
          fill
          className='object-cover'
          sizes='100vw'
          priority
          quality={90}
        />
        <h1 className='relative z-10 text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-7 px-4 md:px-0 md:ml-5 text-white'>
          Online Offering
        </h1>
        <span className='relative z-10 text-base sm:text-lg md:text-2xl text-center mt-2 px-4 md:px-0 md:ml-5 text-white'>
          {label}
        </span>
        <Link
          href={giveNowUrl}
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
          <p className='text-sm sm:text-base md:text-lg leading-relaxed font-bold text-primary-black whitespace-pre-line'>
            {whyWeGive}
          </p>
        </div>
      </div>
    </div>
  );
}
