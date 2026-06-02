// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { upcomingEventBySlugQuery } from '@/sanity/lib/queries';
import { UpcomingEvent } from '@/app/common/types/models';
import {
  formatEventDate,
  formatEventDateRange,
} from '@/app/common/utils/format-event-date';
import EventRegistrationForm from './event-registration-form';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Checks if the registration deadline has passed.
 * Compares against the end of the deadline day (23:59:59) to allow
 * registrations for the entire final day.
 */
function isRegistrationClosed(registrationDeadline: string): boolean {
  const deadlineEnd = new Date(registrationDeadline + 'T23:59:59');
  return new Date() > deadlineEnd;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event: UpcomingEvent | null = await client.fetch(
    upcomingEventBySlugQuery,
    { slug },
  );

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: `${event.title} | Poiema Ministries`,
    description:
      event.description ||
      `Register for ${event.title} at Poiema Ministries.`,
    openGraph: {
      title: `${event.title} | Poiema Ministries`,
      description:
        event.description ||
        `Register for ${event.title} at Poiema Ministries.`,
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event: UpcomingEvent | null = await client.fetch(
    upcomingEventBySlugQuery,
    { slug },
  );

  if (!event) {
    notFound();
  }

  // Server-side deadline guard: if registration is closed, show a message
  if (isRegistrationClosed(event.registrationDeadline)) {
    return (
      <div className='flex flex-col w-full bg-background py-12 sm:py-16 md:py-20'>
        <div className='flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 text-center'>
          <h1 className='text-2xl sm:text-3xl font-bold text-primary-black'>
            {event.title}
          </h1>
          <p className='text-sm sm:text-base text-primary-black/70 mt-2'>
            {formatEventDateRange(event.eventDate, event.eventEndDate)}
          </p>
          <div className='mt-6 sm:mt-8 p-6 sm:p-8 border border-primary-black/15 rounded-md bg-secondary/50'>
            <p className='text-base sm:text-lg text-primary-black font-semibold'>
              Registration Closed
            </p>
            <p className='text-sm sm:text-base text-primary-black/70 mt-2 leading-relaxed'>
              We&apos;re sorry, but registration for this event closed on{' '}
              {formatEventDate(event.registrationDeadline)}. If you have any
              questions, please feel free to contact us directly.
            </p>
          </div>
          <Link
            href='/upcoming-events'
            className='mt-6 text-sm font-semibold text-primary-black underline underline-offset-2 hover:text-primary-black/70 transition-colors'
          >
            View Upcoming Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full bg-background py-8 sm:py-10 md:py-12'>
      <EventRegistrationForm event={event} />
    </div>
  );
}
