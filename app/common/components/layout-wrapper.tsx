// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar/navbar';
import Footer from './footer/footer';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  return (
    <>
      {!isStudio && <Navbar />}
      {children}
      {!isStudio && <Footer />}
    </>
  );
}
