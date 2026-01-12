// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import { Kaisei_Decol } from 'next/font/google';
import LayoutWrapper from './common/components/layout-wrapper';
import './globals.css';

const kaiseiDecol = Kaisei_Decol({
  variable: '--font-kaisei-decol',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://poiemaministries.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Poiema Ministries | EM of Bayside Presbyterian Church',
    template: '%s | Poiema Ministries',
  },
  description:
    'Poiema Ministries is the English Ministry of the Korean Presbyterian Church of Bayside. We love sharing the gospel and love of Jesus Christ to all whether our local neighbors or brothers and sisters all around the world!',
  keywords: [
    'Poiema Ministries',
    'Bayside Presbyterian Church',
    'English Ministry',
    'Korean Presbyterian Church',
    'Christian ministry',
    'church community',
    'worship',
    'sermons',
    'fellowship',
    'Bayside',
  ],
  authors: [{ name: 'Poiema Ministries' }],
  creator: 'Poiema Ministries',
  publisher: 'Poiema Ministries',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Poiema Ministries',
    title: 'Poiema Ministries | EM of Bayside Presbyterian Church',
    description:
      'Poiema Ministries is the English Ministry of the Korean Presbyterian Church of Bayside. We love sharing the gospel and love of Jesus Christ to all.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poiema Ministries | EM of Bayside Presbyterian Church',
    description:
      'Poiema Ministries is the English Ministry of the Korean Presbyterian Church of Bayside.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification code here when available
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='overflow-x-hidden'>
      <body className={`${kaiseiDecol.variable} antialiased overflow-x-hidden`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
