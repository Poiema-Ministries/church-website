// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import NewMembersForm from './new-members-form';

export const metadata: Metadata = {
  title: 'New Members',
  description:
    'Welcome to Poiema Ministries! Join our community and become part of our church family. Fill out our new member form to get connected with our ministry.',
  openGraph: {
    title: 'New Members | Poiema Ministries',
    description:
      'Welcome to Poiema Ministries! Join our community and become part of our church family. Fill out our new member form to get connected with our ministry.',
  },
};

export default function NewMembers() {
  return <NewMembersForm />;
}
