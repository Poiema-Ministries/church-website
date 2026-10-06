// Copyright 2026 Poiema Ministries. All Rights Reserved.

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type {
  ServiceItem,
  ServicesContent,
  ServicesJoinUs,
} from '@/app/common/types/models';
import { addressLines, googleMapsEmbedUrl } from './map-embed';

const descriptionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className='font-semibold'>{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className='underline'>{children}</span>,
  },
};

type LoadStatus = 'loading' | 'ready' | 'error';

function ServiceRow({
  service,
  index,
}: {
  service: ServiceItem;
  index: number;
}) {
  const imageOnLeft = index % 2 === 1;
  const rowClassName = [
    'flex flex-col md:flex-row w-full pl-4 sm:pl-5 md:pl-7 gap-3 sm:gap-4 md:gap-6 items-start',
    imageOnLeft ? 'bg-secondary' : '',
    index > 0 ? 'mt-5' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const text = (
    <div
      className={`flex flex-col md:items-start w-full p-10 ${
        imageOnLeft ? 'order-1 md:order-2' : ''
      }`}
    >
      <div className='flex flex-col w-full max-w-prose mx-auto md:max-w-xl md:mx-0'>
        <h2 className='text-lg sm:text-xl md:text-3xl font-bold text-center md:text-left'>
          {service.title}
        </h2>
        {service.description.length > 0 && (
          <div className='flex-1 md:text-left text-2xs sm:text-xs md:text-sm mt-2 md:mt-3 space-y-3'>
            <PortableText
              value={service.description}
              components={descriptionComponents}
            />
          </div>
        )}
      </div>
    </div>
  );

  const image = service.imageUrl ? (
    <div
      className={`flex w-full items-center justify-center p-5 ${
        imageOnLeft ? 'order-2 md:order-1' : ''
      }`}
    >
      <Image
        src={service.imageUrl}
        width={400}
        height={270}
        alt={service.imageAlt}
        quality={90}
        sizes='(max-width: 767px) 100vw, 400px'
        className='w-full h-auto md:w-auto md:h-full object-cover'
        priority={index === 0}
      />
    </div>
  ) : null;

  return (
    <div
      className={rowClassName}
      data-layout={imageOnLeft ? 'image-first' : 'text-first'}
    >
      {text}
      {image}
    </div>
  );
}

function JoinUs({ joinUs }: { joinUs: ServicesJoinUs }) {
  const lines = addressLines(joinUs.address);
  const mapSrc = googleMapsEmbedUrl(joinUs.address);

  return (
    <div className='flex flex-col justify-center items-center mt-10 mb-10 px-4'>
      <div className='flex justify-center items-center mb-6 sm:mb-10'>
        <h2 className='font-bold text-2xl'>Join Us</h2>
      </div>
      <div className='flex flex-col md:flex-row w-full max-w-4xl gap-6 md:gap-10 items-center md:items-start'>
        {mapSrc && (
          <div className='w-full md:w-[410px]'>
            <div className='relative w-full aspect-[410/335] overflow-hidden rounded'>
              <iframe
                key={mapSrc}
                title='Map showing where to join us'
                src={mapSrc}
                width='100%'
                height='100%'
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                loading='lazy'
                allowFullScreen
                className='w-full h-full'
              />
            </div>
          </div>
        )}
        <div className='flex flex-col md:pl-10 space-y-3 text-center md:text-left w-full md:w-auto'>
          {joinUs.description && (
            <p className='font-semibold whitespace-pre-line'>
              {joinUs.description}
            </p>
          )}
          {lines.length > 0 && (
            <div className='flex flex-col space-y-1'>
              <span className='underline'>Address</span>
              <span>
                {lines.map((line, lineIndex) => (
                  <span key={`${lineIndex}-${line}`} className='block'>
                    {line}
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicesClient() {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [joinUs, setJoinUs] = useState<ServicesJoinUs | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        const response = await fetch('/api/services', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load services');
        }

        const data = (await response.json()) as ServicesContent;
        setServices(data.services ?? []);
        setJoinUs(data.joinUs ?? null);
        setStatus('ready');
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Error loading services:', error);
        setStatus('error');
      }
    }

    void loadServices();

    return () => {
      controller.abort();
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center w-full px-4 py-12'>
        <p className='text-lg text-primary-black/70'>Loading services...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex justify-center items-center w-full px-4 py-12'>
        <p className='text-lg text-primary-black/70'>
          Services could not be loaded. Please refresh the page.
        </p>
      </div>
    );
  }

  if (services.length === 0 && !joinUs) {
    return (
      <div className='flex justify-center items-center w-full px-4 py-12'>
        <p className='text-lg text-primary-black/70'>
          Service times will be posted here.
        </p>
      </div>
    );
  }

  return (
    <>
      {services.map((service, index) => (
        <ServiceRow key={service._id} service={service} index={index} />
      ))}
      {joinUs && <JoinUs joinUs={joinUs} />}
    </>
  );
}
