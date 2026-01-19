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
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const checkScrollPosition = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const canScroll = scrollWidth > clientWidth;
      const isAtStart = scrollLeft <= 1; // Small threshold for rounding
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1; // -1 for rounding errors

      setIsScrollable(canScroll);

      // Track if user has scrolled
      if (scrollLeft > 1) {
        setHasScrolled(true);
      }

      // Always show right gradient when scrollable and not at end (to hint there's more)
      // Show left gradient only when scrolled
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

      {/* Right gradient overlay - subtle, shows more content is available */}
      {showRightGradient && (
        <div
          className='absolute right-0 top-0 bottom-2 w-16 sm:w-20 md:w-24 lg:w-28 z-10 pointer-events-none bg-gradient-to-l from-background via-background/95 to-transparent transition-opacity duration-300 opacity-90'
          aria-hidden='true'
        />
      )}

      {/* Mobile scroll hint - smaller and more subtle */}
      {showRightGradient && !hasScrolled && isScrollable && (
        <div className='absolute bottom-3 right-3 z-20 pointer-events-none md:hidden transition-all duration-500 opacity-100'>
          <div className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-black/70 bg-background/90 backdrop-blur-sm rounded-full border border-primary-black/15 shadow-md animate-bounce-subtle'>
            <svg
              className='w-3.5 h-3.5'
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
            <span>Swipe</span>
          </div>
        </div>
      )}

      {/* Tablet scroll hint - visible on tablets too, disappears after scroll */}
      {showRightGradient && !hasScrolled && isScrollable && (
        <div className='absolute bottom-4 right-4 z-20 pointer-events-none hidden md:flex lg:hidden transition-all duration-500 opacity-100'>
          <div className='flex items-center justify-center w-11 h-11 text-sm text-primary-black/75 bg-background/90 backdrop-blur-md rounded-full border-2 border-primary-black/25 shadow-lg animate-bounce-subtle'>
            <svg
              className='w-5 h-5 animate-pulse'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={3}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </div>
        </div>
      )}

      {/* Desktop scroll hint - subtle arrow indicators */}
      {showRightGradient && (
        <div className='absolute bottom-3 right-4 z-10 pointer-events-none hidden lg:flex xl:bottom-4 xl:right-6 items-center gap-1'>
          <div className='flex items-center justify-center w-8 h-8 text-xs text-primary-black/50 bg-background/70 backdrop-blur-sm rounded-full border border-primary-black/10 shadow-sm'>
            <svg
              className='w-4 h-4 animate-pulse'
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
          </div>
        </div>
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
