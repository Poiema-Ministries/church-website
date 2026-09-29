// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { client } from '@/sanity/lib/client';

// Mock next-sanity
jest.mock('next-sanity', () => ({
  groq: (strings: TemplateStringsArray, ...values: unknown[]) => {
    return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  },
  createClient: jest.fn(),
}));

// Mock the Sanity client
jest.mock('@/sanity/lib/client', () => {
  const sanityClient = {
    fetch: jest.fn(),
    withConfig: jest.fn(),
  };
  sanityClient.withConfig.mockReturnValue(sanityClient);
  return { client: sanityClient };
});

jest.mock('@/sanity/lib/image', () => ({
  urlFor: jest.fn(() => ({
    width: () => ({
      quality: () => ({
        url: () => 'https://cdn.sanity.io/images/test/home-banner.jpg',
      }),
    }),
  })),
}));

// Mock the HomeClient component
jest.mock('@/app/home-client', () => {
  return function MockHomeClient({
    coreValues,
    heroImageSrc,
  }: {
    coreValues: unknown[];
    heroImageSrc?: string;
  }) {
    return (
      <div data-testid='home-client'>
        <h1>Poiema Ministries</h1>
        <div data-testid='core-values-count'>{coreValues.length}</div>
        <div data-testid='hero-image-src'>{heroImageSrc ?? 'default'}</div>
      </div>
    );
  };
});

const mockClient = client as unknown as {
  fetch: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>>;
  withConfig: jest.Mock;
};

function mockHomeFetches(coreValues: unknown, homePage: unknown = null) {
  mockClient.fetch.mockImplementation(async (query: unknown) => {
    if (String(query).includes('homePage')) {
      return homePage;
    }
    return coreValues;
  });
}

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.withConfig.mockReturnValue(mockClient);
  });

  it('should render the home page with core values', async () => {
    const mockCoreValues = [
      {
        _id: '1',
        title: 'Core Value 1',
        description: 'Description 1',
      },
      {
        _id: '2',
        title: 'Core Value 2',
        description: 'Description 2',
      },
    ];

    mockHomeFetches(mockCoreValues);

    const component = await Home();
    render(component);

    expect(screen.getByTestId('home-client')).toBeInTheDocument();
    expect(screen.getByText('Poiema Ministries')).toBeInTheDocument();
    expect(screen.getByTestId('core-values-count')).toHaveTextContent('2');
    expect(screen.getByTestId('hero-image-src')).toHaveTextContent('default');
  });

  it('should handle empty core values', async () => {
    mockHomeFetches([]);

    const component = await Home();
    render(component);

    expect(screen.getByTestId('core-values-count')).toHaveTextContent('0');
  });

  it('should fetch core values from Sanity', async () => {
    mockHomeFetches([]);

    await Home();

    expect(mockClient.fetch).toHaveBeenCalled();
  });

  it('should use a Sanity hero image when one is uploaded', async () => {
    mockHomeFetches([], {
      _id: 'homePage',
      heroImage: {
        asset: { _id: 'image-1', url: 'https://cdn.sanity.io/images/test.jpg' },
        hotspot: { x: 0.25, y: 0.75 },
      },
    });

    const component = await Home();
    render(component);

    expect(screen.getByTestId('hero-image-src')).toHaveTextContent(
      'https://cdn.sanity.io/images/test/home-banner.jpg',
    );
  });
});
