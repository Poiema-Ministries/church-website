// Copyright 2025 Poiema Ministries. All Rights Reserved.

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { NextFont } from 'next/dist/compiled/@next/font';

// Mock Next.js font loader
jest.mock('next/font/google', () => ({
  Kaisei_Decol: () => ({
    className: 'font-kaisei-decol',
    variable: '--font-kaisei-decol',
    style: {},
  } as NextFont),
}));

// Custom render function that includes any providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
