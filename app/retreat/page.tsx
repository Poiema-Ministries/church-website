// Copyright 2026 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { retreatQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import {
  SANITY_RETREAT_REVALIDATE_SECONDS,
  SANITY_TAGS,
} from '@/sanity/lib/cache';
import {
  Retreat,
  RetreatQuestionSection,
  RetreatScheduleDay,
} from '../common/types/models';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Retreat',
  description:
    'View the schedule, theme, and reflection questions for the Poiema Ministries retreat.',
  openGraph: {
    title: 'Retreat | Poiema Ministries',
    description:
      'View the schedule, theme, and reflection questions for the Poiema Ministries retreat.',
  },
};

function formatTimeRange(startTime: string, endTime: string) {
  return `${startTime} – ${endTime}`;
}

function ThemePanel({
  retreat,
  className = '',
}: {
  retreat: Retreat;
  className?: string;
}) {
  const imageUrl = retreat.themeImage
    ? urlFor(retreat.themeImage).width(900).quality(85).url()
    : null;

  return (
    <section
      className={`flex flex-col items-center text-center md:items-start md:text-left ${className}`}
    >
      <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-primary-black leading-tight'>
        {retreat.themeTitle}
      </h1>
      <div className='mt-3 w-full border-t border-primary-black/30' />
      <p className='mt-4 text-sm sm:text-base tracking-wide uppercase text-primary-black'>
        {retreat.subtitle}
      </p>
      <p className='mt-2 text-sm sm:text-base text-primary-black'>
        <span className='font-bold'>Speaker:</span> {retreat.speaker}
      </p>
      {imageUrl && (
        <div className='relative mt-6 w-full aspect-[4/5] max-h-[420px] overflow-hidden'>
          <Image
            src={imageUrl}
            alt={retreat.themeTitle}
            fill
            className='object-contain'
            sizes='(max-width: 768px) 100vw, 40vw'
            priority
          />
        </div>
      )}
    </section>
  );
}

function ScheduleDay({ day }: { day: RetreatScheduleDay }) {
  return (
    <div className='flex flex-col items-center text-center md:items-start md:text-left min-w-0'>
      <div className='pb-3 w-full border-b border-primary-black/30'>
        <h2 className='text-2xl sm:text-3xl font-bold text-primary-black'>
          {day.dayLabel}
        </h2>
        {day.date && (
          <p className='mt-1 text-sm text-primary-black/70'>{day.date}</p>
        )}
      </div>
      <ul className='mt-5 space-y-6 w-full'>
        {day.activities?.map((activity) => (
          <li key={activity._key}>
            <p className='font-bold text-sm sm:text-base text-primary-black'>
              {activity.title}
            </p>
            <p className='mt-0.5 text-sm text-primary-black/80'>
              {formatTimeRange(activity.startTime, activity.endTime)}
            </p>
            {activity.note && (
              <p className='mt-0.5 text-xs italic text-primary-black/60'>
                {activity.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuestionSection({ section }: { section: RetreatQuestionSection }) {
  return (
    <article className='border-t border-primary-black/20 pt-8 first:border-t-0 first:pt-0'>
      <h3 className='text-xl sm:text-2xl font-bold text-primary-black'>
        {section.sermonTitle}
      </h3>
      <p className='mt-2 text-sm sm:text-base italic text-primary-black/80'>
        {section.bibleVerse}
      </p>
      <ol className='mt-5 list-decimal pl-5 space-y-3'>
        {section.reflectionQuestions?.map((question, index) => (
          <li
            key={`${section._key}-${index}`}
            className='text-sm sm:text-base text-primary-black leading-relaxed pl-1'
          >
            {question}
          </li>
        ))}
      </ol>
    </article>
  );
}

export default async function RetreatPage() {
  const retreat: Retreat | null = await client
    .withConfig({ useCdn: false })
    .fetch(retreatQuery, {}, {
      next: {
        revalidate: SANITY_RETREAT_REVALIDATE_SECONDS,
        tags: [SANITY_TAGS.retreat, SANITY_TAGS.all],
      },
    });

  if (!retreat?.isEnabled) {
    notFound();
  }

  const scheduleDays = retreat.scheduleDays ?? [];
  const visibleSections =
    retreat.questionSections?.filter((section) => section.isVisible) ?? [];

  return (
    <div className='flex flex-col w-full bg-background min-h-screen'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-20'>
        <ThemePanel retreat={retreat} className='md:hidden mb-10' />

        <div className='grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 lg:gap-14'>
          <section aria-label='Retreat schedule'>
            {scheduleDays.length > 0 ? (
              <div
                className={`grid gap-10 ${
                  scheduleDays.length === 1
                    ? 'grid-cols-1'
                    : scheduleDays.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {scheduleDays.map((day) => (
                  <ScheduleDay key={day._key} day={day} />
                ))}
              </div>
            ) : (
              <p className='text-primary-black/70 text-sm sm:text-base'>
                Schedule coming soon.
              </p>
            )}
          </section>

          <ThemePanel retreat={retreat} className='hidden md:flex' />
        </div>

        {visibleSections.length > 0 && (
          <section
            aria-label='Reflection questions'
            className='mt-14 sm:mt-16 md:mt-20 pt-10 border-t border-primary-black/20'
          >
            <h2 className='text-2xl sm:text-3xl font-bold text-primary-black mb-8'>
              Reflection Questions
            </h2>
            <div className='flex flex-col gap-10 max-w-3xl'>
              {visibleSections.map((section) => (
                <QuestionSection key={section._key} section={section} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
