// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import ServicesClient from './services-client';

// Service times and the Join Us address are edited in Sanity and must not be cached.
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Services',
  description:
    "Join us for worship services at Poiema Ministries. We offer two Sunday services at 9:30 AM and 11:30 AM. Come worship with us and experience God's presence in Bayside, NY.",
  openGraph: {
    title: 'Services | Poiema Ministries',
    description:
      "Join us for worship services at Poiema Ministries. We offer two Sunday services at 9:30 AM and 11:30 AM. Come worship with us and experience God's presence in Bayside, NY.",
  },
};

export default function Services() {
  return (
    <div className='flex flex-col min-h-screen w-full gap-0'>
      <div className='flex flex-col items-center md:items-start w-full mb-1 px-4 md:ml-10'>
        <h1 className='text-4xl font-bold text-center md:text-left md:pl-4 md:pl-7'>
          Services
        </h1>
      </div>
      <ServicesClient />
    </div>
  );
}
