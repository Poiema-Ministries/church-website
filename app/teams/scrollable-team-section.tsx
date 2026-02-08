'use client';

// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { useEffect, useRef, useState } from 'react';

interface ScrollableTeamSectionProps {
  children: React.ReactNode;
}

export default function ScrollableTeamSection({
  children,
}: ScrollableTeamSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  const scrollAmount = 320; // Roughly one team member card width

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const checkScrollPosition = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const canScroll = scrollWidth > clientWidth;
      const isAtStart = scrollLeft <= 1; // Small threshold for rounding
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1; // -1 for rounding errors

      setShowLeftGradient(!isAtStart && canScroll);
      setShowRightGradient(!isAtEnd && canScroll);
    };

    // Check initial scroll position
    // Use a small delay to ensure layout is complete
    const timeoutId = setTimeout(checkScrollPosition, 100);

    // Add scroll event listener
    scrollContainer.addEventListener('scroll', checkScrollPosition, {
      passive: true,
    });

    // Check on resize (content might change)
    const resizeObserver = new ResizeObserver(() => {
      // Delay to ensure layout is stable
      setTimeout(checkScrollPosition, 50);
    });
    resizeObserver.observe(scrollContainer);

    // Also check when window resizes
    const handleWindowResize = () => {
      setTimeout(checkScrollPosition, 100);
    };
    window.addEventListener('resize', handleWindowResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      scrollContainer.removeEventListener('scroll', checkScrollPosition);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [children]);

  return (
    <div className='relative w-full'>
      {/* Left gradient overlay - subtle and natural */}
      {showLeftGradient && (
        <div
          className='absolute left-0 top-0 bottom-2 w-12 sm:w-16 md:w-20 lg:w-24 z-10 pointer-events-none bg-gradient-to-r from-background via-background/95 to-transparent transition-opacity duration-300'
          aria-hidden='true'
        />
      )}

      {/* Left scroll button */}
      {showLeftGradient && (
        <button
          type='button'
          onClick={scrollLeft}
          className='absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-primary-black/70 bg-background/90 backdrop-blur-sm rounded-full border border-primary-black/15 shadow-md hover:bg-background hover:text-primary-black hover:border-primary-black/25 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-black/20 focus:ring-offset-2'
          aria-label='Scroll left'
        >
          <svg
            className='w-4 h-4 sm:w-5 sm:h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2.5}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>
      )}

      {/* Right gradient overlay - subtle, shows more content is available */}
      {showRightGradient && (
        <div
          className='absolute right-0 top-0 bottom-2 w-16 sm:w-20 md:w-24 lg:w-28 z-10 pointer-events-none bg-gradient-to-l from-background via-background/95 to-transparent transition-opacity duration-300 opacity-90'
          aria-hidden='true'
        />
      )}

      {/* Right scroll button */}
      {showRightGradient && (
        <button
          type='button'
          onClick={scrollRight}
          className='absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-primary-black/70 bg-background/90 backdrop-blur-sm rounded-full border border-primary-black/15 shadow-md hover:bg-background hover:text-primary-black hover:border-primary-black/25 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-black/20 focus:ring-offset-2'
          aria-label='Scroll right'
        >
          <svg
            className='w-4 h-4 sm:w-5 sm:h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2.5}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      )}

      {/* Scrollable container with touch-optimized scrolling */}
      <div
        ref={scrollContainerRef}
        className='w-full overflow-x-auto overflow-y-hidden scrollbar-hide pb-2 scroll-smooth snap-x snap-mandatory'
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          touchAction: 'pan-x', // Optimize for horizontal scrolling on touch devices
        }}
        role='region'
        aria-label='Team members scrollable list'
      >
        <div className='flex gap-4 sm:gap-5 md:gap-6 lg:gap-8 w-max pr-4 sm:pr-6 md:pr-0'>
          {children}
        </div>
      </div>
    </div>
  );
}
