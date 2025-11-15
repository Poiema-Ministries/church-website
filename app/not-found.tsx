// Copyright 2025 Poiema Ministries. All Rights Reserved.

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] w-full px-4 py-12'>
      <div className='flex flex-col items-center justify-center max-w-2xl mx-auto text-center'>
        {/* 404 Number */}
        <h1 className='text-8xl sm:text-9xl md:text-[12rem] font-bold text-primary-black mb-4'>
          404
        </h1>
        
        {/* Main Message */}
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-primary-black mb-6'>
          Page Not Found
        </h2>
        
        {/* Christ-centered Message */}
        <p className='text-base sm:text-lg md:text-xl text-primary-black mb-4 leading-relaxed max-w-xl'>
          "I am the way, and the truth, and the life. No one comes to the Father except through me."
        </p>
        <p className='text-sm sm:text-base text-primary-black/70 mb-2'>
          - John 14:6
        </p>
        
        {/* Encouraging Message */}
        <p className='text-sm sm:text-base md:text-lg text-primary-black/80 mt-6 mb-8 leading-relaxed max-w-lg'>
          It looks like you've taken a wrong turn. But don't worry - even when we're lost, 
          God knows exactly where we are. Let's get you back on the right path.
        </p>
        
        {/* Home Button */}
        <Link
          href='/'
          className='inline-block px-6 py-3 border-2 border-primary-black text-primary-black font-semibold hover:bg-primary-black hover:text-background transition-colors duration-200'
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

