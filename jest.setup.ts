// Copyright 2025 Poiema Ministries. All Rights Reserved.

// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function NextImage(props: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    quality?: number;
    sizes?: string;
    className?: string;
    [key: string]: unknown;
  }) {
    // Extract only valid HTML img attributes, ignoring Next.js specific props
    const validImgProps: Record<string, unknown> = {};
    const nextJsProps = ['fill', 'priority', 'quality', 'sizes'];
    
    for (const [key, value] of Object.entries(props)) {
      if (!nextJsProps.includes(key)) {
        validImgProps[key] = value;
      }
    }
    
    return React.createElement('img', validImgProps);
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
