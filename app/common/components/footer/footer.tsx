// Copyright 2025 Poiema Ministries. All Rights Reserved.

import Link from 'next/link';
import Image from 'next/image';
import { WebLink, FooterLink } from '../../types/models';

const FOOTER_LINKS: FooterLink[] = [
  {
    title: 'About Us',
    links: [
      {
        title: 'Meet Our Pastor',
        href: '/pastor',
      },
      {
        title: 'Meet Our Teams',
        href: '/teams',
      },
      {
        title: 'Core Values',
        href: '/core-values',
      },
      {
        title: 'Theology',
        href: '/theology',
      },
    ],
  },
  {
    title: 'Worship',
    links: [
      {
        title: 'Sermons',
        href: '/sermons',
      },
      {
        title: 'Online Offering',
        href: '/offering',
      },
      {
        title: 'Bulletins',
        href: '/bulletins',
      },
      {
        title: 'Services',
        href: '/services',
      },
    ],
  },
  {
    title: 'Events',
    links: [
      {
        title: 'Past Events',
        href: '/past-events',
      },
      {
        title: 'Upcoming Events',
        href: '/upcoming-events',
      },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      {
        title: 'New Members',
        href: '/new-members',
      },
      {
        title: 'Prayer Requests',
        href: '/prayer-requests',
      },
      {
        title: 'Contact Us',
        href: '/contact-us',
      },
    ],
  },
];

export default function Footer() {
  const renderFooterLinks = () => {
    return FOOTER_LINKS.map((footerLink: FooterLink) => {
      const { title, links } = footerLink;
      return (
        <div className='flex flex-col items-center md:items-start' key={title}>
          <span className='font-bold text-xs sm:text-sm md:text-base mb-3 md:mb-5'>
            {title}
          </span>
          <ul className='underline text-center md:text-left'>
            {links.map((link: WebLink) => (
              <li key={link.title} className='mb-1'>
                <Link
                  href={link.href}
                  className='text-xs sm:text-sm md:text-base'
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };
  return (
    <footer className='flex flex-col md:flex-row items-center md:items-center justify-center p-6 sm:p-8 md:p-10'>
      <div className='flex mb-6 sm:mb-8 md:mb-0 md:mr-15'>
        <Image
          src='./logo.svg'
          width={180}
          height={140}
          alt='Poiema Ministries'
          priority
          className='w-32 sm:w-40 md:w-[180px] h-auto'
        />
      </div>
      <div className='flex flex-col items-center md:items-start md:ml-5 gap-3 sm:gap-4 w-full md:w-auto'>
        <div className='grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap justify-center md:justify-start gap-3 sm:gap-4 md:gap-8'>
          {renderFooterLinks()}
        </div>
        <div className='flex justify-center md:justify-start'>
          <span className='font-bold text-xs sm:text-sm md:text-base text-center md:text-left'>
            Address: Address: 45-60 211th St Bayside, NY 11361
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Link href='https://www.instagram.com/poiema.ministries/'>
            <Image
              src='./instagram.svg'
              width={40}
              height={40}
              alt='@poiema.ministries '
              priority
              className='w-8 h-8 sm:w-10 sm:h-10'
            />
          </Link>
          <Link href='https://www.youtube.com/@poiemaministries8748'>
            <Image
              src='./youtube.svg'
              width={48}
              height={48}
              alt='Poiema Ministries'
              priority
              className='w-9 h-9 sm:w-12 sm:h-12'
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
