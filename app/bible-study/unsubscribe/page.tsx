// Copyright 2026 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import { Suspense } from 'react';

import UnsubscribeToken from './unsubscribe-token';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  referrer: 'no-referrer',
};

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <p className='text-center text-sm mt-10'>
          Loading your email preference…
        </p>
      }
    >
      <UnsubscribeToken />
    </Suspense>
  );
}
