// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Core Values', href: '/core-values' },
    { name: 'Theology', href: '/theology' },
  ];

  return (
    <nav className='sticky top-0 z-50'>
      <div className='pt-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center p-4'>
        <Link href='/' className='text-xl font-bold md:mr-15'>
          <Image
            src='./logo.svg'
            width={180}
            height={140}
            alt='Poiema Ministries'
            priority
          />
        </Link>
        <ul className={`md:flex gap-6 hidden md:block`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block py-2 text-sm ${
                  pathname === link.href && 'underline'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
