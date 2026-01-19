// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import PastorClient from './pastor-client';

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
  return <PastorClient />;
}
