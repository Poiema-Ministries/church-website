// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import ContactUsForm from './contact-us-form';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Poiema Ministries. We would love to hear from you! Reach out to us with any questions, prayer requests, or to learn more about our ministry.',
  openGraph: {
    title: 'Contact Us | Poiema Ministries',
    description:
      'Get in touch with Poiema Ministries. We would love to hear from you! Reach out to us with any questions, prayer requests, or to learn more about our ministry.',
  },
};

export default function ContactUs() {
  return <ContactUsForm />;
}
