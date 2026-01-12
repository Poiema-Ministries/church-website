// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import PrayerRequestsForm from './prayer-requests-form';

export const metadata: Metadata = {
  title: 'Prayer Requests',
  description:
    'Submit a prayer request to Poiema Ministries. Our community is here to pray with and for you. Share your needs, concerns, and praises with us.',
  openGraph: {
    title: 'Prayer Requests | Poiema Ministries',
    description:
      'Submit a prayer request to Poiema Ministries. Our community is here to pray with and for you. Share your needs, concerns, and praises with us.',
  },
};

export default function PrayerRequests() {
  return <PrayerRequestsForm />;
}
