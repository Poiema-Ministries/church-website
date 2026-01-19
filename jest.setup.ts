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

// Polyfill for window.matchMedia (used in Pastor page)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Polyfill for ResizeObserver (used in ScrollableTeamSection)
global.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {
    // Mock implementation
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }

  callback: ResizeObserverCallback;
} as unknown as typeof ResizeObserver;

// Mock Mixpanel
jest.mock('mixpanel-browser', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    track: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
    register: jest.fn(),
    people: {
      set: jest.fn(),
      increment: jest.fn(),
    },
    opt_out_tracking: jest.fn(),
    opt_in_tracking: jest.fn(),
  },
}));
