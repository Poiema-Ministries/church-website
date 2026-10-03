// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar/navbar';
import Footer from './footer/footer';

export default function LayoutWrapper({
  children,
  showRetreat = false,
  showBibleStudy = false,
}: {
  children: React.ReactNode;
  showRetreat?: boolean;
  showBibleStudy?: boolean;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  return (
    <>
      {!isStudio && (
        <Navbar showRetreat={showRetreat} showBibleStudy={showBibleStudy} />
      )}
      {children}
      {!isStudio && (
        <Footer showRetreat={showRetreat} showBibleStudy={showBibleStudy} />
      )}
    </>
  );
}
