// Copyright 2026 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isBibleStudyPublic } from '@/lib/bible-study/visibility';

import BibleStudyForm from './bible-study-form';

export const metadata: Metadata = {
  title: 'Bible Study',
  description:
    'Sign up for Bible Study at Poiema Ministries. Join us in person in Bayside or online, and we will email you the study details.',
  openGraph: {
    title: 'Bible Study | Poiema Ministries',
    description:
      'Sign up for Bible Study at Poiema Ministries. Join us in person in Bayside or online.',
  },
};

export default async function BibleStudyPage() {
  if (!(await isBibleStudyPublic())) notFound();
  return <BibleStudyForm />;
}
