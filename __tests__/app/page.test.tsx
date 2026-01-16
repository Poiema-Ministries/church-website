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
jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}));

// Mock the HomeClient component
jest.mock('@/app/home-client', () => {
  return function MockHomeClient({ coreValues }: { coreValues: unknown[] }) {
    return (
      <div data-testid='home-client'>
        <h1>Poiema Ministries</h1>
        <div data-testid='core-values-count'>{coreValues.length}</div>
      </div>
    );
  };
});

const mockClient = client as unknown as { fetch: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>> };

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    mockClient.fetch.mockResolvedValue(mockCoreValues as never);

    const component = await Home();
    render(component);

    expect(screen.getByTestId('home-client')).toBeInTheDocument();
    expect(screen.getByText('Poiema Ministries')).toBeInTheDocument();
    expect(screen.getByTestId('core-values-count')).toHaveTextContent('2');
  });

  it('should handle empty core values', async () => {
    mockClient.fetch.mockResolvedValue([] as never);

    const component = await Home();
    render(component);

    expect(screen.getByTestId('core-values-count')).toHaveTextContent('0');
  });

  it('should fetch core values from Sanity', async () => {
    mockClient.fetch.mockResolvedValue([] as never);

    await Home();

    expect(mockClient.fetch).toHaveBeenCalled();
  });
});
