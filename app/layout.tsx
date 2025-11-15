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

export const metadata: Metadata = {
  title: 'Poiema Ministries | EM of Bayside Presbyterian Church',
  description:
    'Poiema Ministries is the English Ministry of the Korean Presbyterian Church of Bayside. We love sharing the gospel and love of Jesus Christ to all whether our local neighbors or brothers and sisters all around the world!',
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
