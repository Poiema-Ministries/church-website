'use client';

// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function PastorClient() {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const initialPrefersReduced = mediaQuery.matches;

    // Update state in next tick to avoid synchronous setState in effect
    const initTimer = setTimeout(() => {
      setPrefersReducedMotion(initialPrefersReduced);
    }, 0);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Small delay to ensure smooth entrance after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, initialPrefersReduced ? 0 : 100);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='flex flex-col w-full pb-8 sm:pb-10 lg:pb-12'
    >
      {/* Title with fade-in and slide-up */}
      <div className='flex flex-col items-center lg:items-start w-full mb-6 sm:mb-8 lg:mb-8 px-4 sm:px-5 lg:px-0 lg:ml-10'>
        <h1
              className={`text-3xl sm:text-4xl lg:text-3xl font-bold text-center lg:text-left w-full lg:pl-4 xl:pl-7 transition-all duration-700 ease-out ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: prefersReducedMotion ? '0ms' : '0ms',
          }}
        >
          Meet Our Pastor
        </h1>
      </div>

      {/* Main content area */}
      <div className='flex flex-col lg:flex-row w-full px-4 sm:px-5 lg:px-0 lg:ml-10 lg:pl-4 xl:pl-7 gap-6 sm:gap-8 lg:gap-8 items-center lg:items-start'>
        {/* Image with fade-in, scale, and subtle float animation */}
        <div className='flex w-full lg:w-auto justify-center lg:justify-start flex-shrink-0'>
            <div
              className={`relative w-full max-w-full sm:max-w-[400px] lg:max-w-[320px] transition-all duration-1000 ease-out ${
                isVisible
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-8'
              }`}
            style={{
              transitionDelay: prefersReducedMotion ? '0ms' : '200ms',
              animation:
                isVisible && !prefersReducedMotion
                  ? 'subtle-float 6s ease-in-out infinite'
                  : 'none',
            }}
            >
            <div className='relative overflow-hidden rounded-sm'>
              <Image
                src='/imgs/pastor.jpg'
                width={400}
                height={270}
                alt='Pastor Sam Jung'
                className='w-full h-auto transition-transform duration-700 ease-out hover:scale-105'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 400px, 320px'
              />
              {/* Subtle gradient overlay that appears on load */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none transition-opacity duration-1000 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transitionDelay: prefersReducedMotion ? '0ms' : '600ms',
                }}
              />
            </div>
          </div>
        </div>

        {/* Text content with staggered fade-in */}
        <div className='flex flex-col w-full lg:max-w-xl lg:pr-4 xl:pr-8'>
          <h2
            className={`text-xl sm:text-2xl md:text-3xl lg:text-2xl font-bold text-center lg:text-left mb-4 sm:mb-5 lg:mb-5 text-primary-black transition-all duration-700 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4'
            }`}
            style={{
              transitionDelay: prefersReducedMotion ? '0ms' : '300ms',
            }}
          >
            Pastor Sam Jung
          </h2>
          <div className='flex flex-col gap-4 sm:gap-4 lg:gap-4 text-primary-black'>
            {[
              `Pastor Sam was born in Korea and came to the US in 2009 to study
              family counseling. He has been here at KPCB since August 2015. He
              is passionate to lead people to come to Jesus and follow him so
              that they can make Jesus known to others.`,
              `This God-given passion led him to serve the young generation as a
              youth pastor for a decade at KPCB. As a youth pastor, he started
              youth discipleship training in 2018, emphasizing the importance of
              discipleship training for teenagers. He was ordained by the New
              York Presbytery of General Assembly of World Presbyterian Church
              Denomination in 2018.`,
              `He loves mission and has joined KPCB DR (Dominican Republic)
              mission trips in 2019, 2023, 2024, and 2025 as a mission lead
              pastor. He is also passionate about counseling ministry as an
              effective tool of supporting churches. He and his wife Miyoung
              have two kids: Casey and Hanah.`,
            ].map((paragraph, index) => (
              <p
                key={index}
                className={`text-sm sm:text-base md:text-lg lg:text-base leading-relaxed text-center lg:text-left transition-all duration-700 ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              style={{
                transitionDelay: prefersReducedMotion
                  ? '0ms'
                  : `${400 + index * 150}ms`,
              }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
