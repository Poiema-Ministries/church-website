// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  {
    name: 'Home',
    href: '/',
    hasDropdown: false,
  },
  {
    name: 'Worship',
    hasDropdown: true,
    links: [
      { title: 'Sermons', href: '/sermons' },
      { title: 'Online Offering', href: '/offering' },
      { title: 'Bulletins', href: '/bulletins' },
      { title: 'Services', href: '/services' },
    ],
  },
  {
    name: 'About Us',
    hasDropdown: true,
    links: [
      { title: 'Meet Our Teams', href: '/teams' },
      { title: 'Core Values', href: '/core-values' },
      { title: 'Theology', href: '/theology' },
    ],
  },
  {
    name: 'Events',
    hasDropdown: true,
    links: [
      { title: 'Past Events', href: '/past-events' },
      { title: 'Upcoming Events', href: '/upcoming-events' },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(
    null,
  );

  const handleDropdownOpen = (name: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setOpenDropdown(name);
  };

  const handleDropdownClose = (name: string) => {
    const timeout = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
    setCloseTimeout(timeout);
  };

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const isAnyDropdownLinkActive = (links: { href: string }[]) => {
    return links.some((link) => isActiveLink(link.href));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setMobileDropdownOpen(null);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  };

  const toggleMobileDropdown = (name: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === name ? null : name);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className='sticky top-0 z-50 bg-background'>
      <div className='pt-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center p-4 relative'>
        {/* Mobile: Hamburger button on the right */}
        <button
          className='md:hidden absolute right-4 top-14 flex flex-col justify-center items-center w-7 h-7 space-y-1 z-[60]'
          onClick={toggleMobileMenu}
          aria-label='Toggle menu'
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`block w-5 h-1 bg-gray-900 transition-all duration-300 origin-center ${
              isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-1 bg-gray-900 transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-1 bg-gray-900 transition-all duration-300 origin-center ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
        {/* Logo - centered on mobile, left on desktop */}
        <Link
          href='/'
          className='text-xl font-bold md:mr-15'
          onClick={closeMobileMenu}
        >
          <Image
            src='./logo.svg'
            width={180}
            height={140}
            alt='Poiema Ministries'
            priority
          />
        </Link>
        {/* Desktop navigation links */}
        <ul className='md:flex gap-6 hidden md:block relative'>
          {NAV_ITEMS.map((item) => (
            <li key={item.name} className='relative'>
              {item.hasDropdown ? (
                <div
                  className='relative'
                  onMouseEnter={() => handleDropdownOpen(item.name)}
                  onMouseLeave={() => handleDropdownClose(item.name)}
                >
                  <button
                    className={`block py-2 text-sm cursor-pointer ${
                      isAnyDropdownLinkActive(item.links || []) && 'underline'
                    }`}
                    onClick={() => handleDropdownToggle(item.name)}
                  >
                    {item.name}
                  </button>
                  {openDropdown === item.name && (
                    <ul className='absolute top-full left-0 pt-2 bg-transparent min-w-[180px]'>
                      <div className='bg-background border border-primary-black/20 shadow-lg rounded-md py-2'>
                        {item.links?.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className={`block px-4 py-2 text-sm hover:bg-secondary ${
                                isActiveLink(link.href) &&
                                'underline font-semibold'
                              }`}
                            >
                              {link.title}
                            </Link>
                          </li>
                        ))}
                      </div>
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href || '/'}
                  className={`block py-2 text-sm ${
                    item.href && isActiveLink(item.href) && 'underline'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {/* Backdrop overlay */}
        {isMobileMenuOpen && (
          <div
            className='fixed inset-0 bg-black/20 z-40 md:hidden'
            onClick={closeMobileMenu}
          />
        )}
        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 bg-background z-50 md:hidden transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='flex flex-col h-full pt-20 px-6 overflow-y-auto'>
            <ul className='flex flex-col gap-1'>
              {NAV_ITEMS.map((item) => (
                <li
                  key={item.name}
                  className='border-b border-primary-black/10 last:border-b-0'
                >
                  {item.hasDropdown ? (
                    <div>
                      <button
                        className={`flex items-center justify-between w-full py-4 text-lg font-semibold ${
                          isAnyDropdownLinkActive(item.links || []) &&
                          'text-primary-black'
                        }`}
                        onClick={() => toggleMobileDropdown(item.name)}
                      >
                        <span>{item.name}</span>
                        <span className='text-2xl transition-transform duration-200'>
                          {mobileDropdownOpen === item.name ? '−' : '+'}
                        </span>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          mobileDropdownOpen === item.name
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <ul className='pl-4 pb-2 space-y-1'>
                          {item.links?.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className={`block py-3 text-base ${
                                  isActiveLink(link.href)
                                    ? 'underline font-semibold text-primary-black'
                                    : 'text-primary-black/80'
                                }`}
                                onClick={closeMobileMenu}
                              >
                                {link.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href || '/'}
                      className={`block py-4 text-lg font-semibold ${
                        item.href && isActiveLink(item.href)
                          ? 'underline text-primary-black'
                          : 'text-primary-black'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
