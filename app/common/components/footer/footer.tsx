// Copyright 2025 Poiema Ministries. All Rights Reserved.

import Link from 'next/link';
import Image from 'next/image';
import { WebLink, FooterLink } from '../../types/models';

const FOOTER_LINKS: FooterLink[] = [
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
    title: 'About Us',
    links: [
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
];

export default function Footer() {
  const renderFooterLinks = () => {
    return FOOTER_LINKS.map((footerLink: FooterLink) => {
      const { title, links } = footerLink;
      return (
        <div className='flex flex-col' key={title}>
          <span className='font-bold md:text-base mb-5'>{title}</span>
          <ul className='underline'>
            {links.map((link: WebLink) => (
              <li key={link.title}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };
  return (
    <footer className='flex flex-col md:flex-row items-center md:items-center justify-center p-10'>
      <div className='flex mb-8 md:mb-0 md:mr-15'>
        <Image
          src='./logo.svg'
          width={180}
          height={140}
          alt='Poiema Ministries'
          priority
        />
      </div>
      <div className='flex flex-col items-center md:items-start md:ml-5 gap-4'>
        <div className='flex gap-8'>{renderFooterLinks()}</div>
        <div className='flex'>
          <span className='font-bold text-xs md:text-base'>
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
            />
          </Link>
          <Link href='https://www.youtube.com/@poiemaministries8748'>
            <Image
              src='./youtube.svg'
              width={48}
              height={48}
              alt='Poiema Ministries'
              priority
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
