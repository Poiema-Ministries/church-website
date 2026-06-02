// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { upcomingEventsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { UpcomingEvent } from '../common/types/models';
import { formatEventDateRange } from '../common/utils/format-event-date';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Upcoming Events',
  description:
    'View and register for upcoming events at Poiema Ministries. Join us for fellowship, worship, and community gatherings.',
  openGraph: {
    title: 'Upcoming Events | Poiema Ministries',
    description:
      'View and register for upcoming events at Poiema Ministries. Join us for fellowship, worship, and community gatherings.',
  },
};

export default async function UpcomingEvents() {
  const events: UpcomingEvent[] = await client.fetch(upcomingEventsQuery);

  return (
    <div className='flex flex-col w-full bg-background'>
      <div className='flex flex-col items-center md:items-start w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 sm:pt-10 md:pt-12'>
        <h1 className='text-4xl font-bold text-center mt-2'>
          Upcoming Events
        </h1>
      </div>

      {events.length > 0 ? (
        <div className='flex flex-col w-full mt-6 sm:mt-8 pb-8 sm:pb-10 md:pb-12'>
          {events.map((event) => (
            <Link
              key={event._id}
              href={`/upcoming-events/${event.slug.current}`}
              className='group relative block w-full overflow-hidden'
            >
              <div className='relative w-full aspect-[16/9] sm:aspect-[4/1]'>
                <Image
                  src={urlFor(event.bannerImage).width(1920).quality(85).url()}
                  alt={event.title}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                  sizes='100vw'
                  priority
                />
                {/* Black overlay */}
                <div className='absolute inset-0 bg-black/55' />
                {/* Title and date overlay */}
                <div className='absolute inset-0 flex flex-col items-center justify-center px-4 gap-2'>
                  <h2 className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center drop-shadow-lg group-hover:underline underline-offset-4'>
                    {event.title}
                  </h2>
                  <p className='text-white/90 text-sm sm:text-base md:text-lg font-medium drop-shadow-md'>
                    {formatEventDateRange(event.eventDate, event.eventEndDate)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center py-16 sm:py-24'>
          <p className='text-lg text-primary-black/70'>
            No upcoming events at this time. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
