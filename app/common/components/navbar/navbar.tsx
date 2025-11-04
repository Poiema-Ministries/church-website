'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Core Values', href: '/core-values' },
    { name: 'Theology', href: '/theology' },
  ];

  return (
    <nav className='sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto flex justify-between items-center p-4'>
        <Link href='/' className='text-xl font-bold'>
          Grace Fellowship
        </Link>
        <button
          className='md:hidden'
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <ul className={`md:flex gap-6 ${open ? 'block' : 'hidden'} md:block`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block py-2 ${
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
