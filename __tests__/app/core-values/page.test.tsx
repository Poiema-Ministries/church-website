// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import CoreValues from '@/app/core-values/page';
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

const mockClient = client as unknown as {
  fetch: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>>;
};

describe('Core Values Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the core values page with heading', async () => {
    mockClient.fetch.mockResolvedValue([] as never);

    const component = await CoreValues();
    render(component);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Core Values',
    );
  });

  it('should display core values when data is available', async () => {
    const mockCoreValues = [
      {
        _id: '1',
        title: 'Love God',
        description: 'We love God with all our heart',
      },
      {
        _id: '2',
        title: 'Serve Others',
        description: 'We serve others as Jesus served us',
      },
    ];

    mockClient.fetch.mockResolvedValue(mockCoreValues as never);

    const component = await CoreValues();
    render(component);

    expect(screen.getByText('Love God')).toBeInTheDocument();
    expect(screen.getByText('Serve Others')).toBeInTheDocument();
    expect(
      screen.getByText('We love God with all our heart'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('We serve others as Jesus served us'),
    ).toBeInTheDocument();
  });

  it('should handle empty core values', async () => {
    mockClient.fetch.mockResolvedValue([] as never);

    const component = await CoreValues();
    render(component);

    expect(screen.getByText('Core Values')).toBeInTheDocument();
  });

  it('should fetch core values from Sanity', async () => {
    mockClient.fetch.mockResolvedValue([] as never);

    await CoreValues();

    expect(mockClient.fetch).toHaveBeenCalled();
  });

  it('should display numbered core values', async () => {
    const mockCoreValues = [
      {
        _id: '1',
        title: 'First Value',
        description: 'First description',
      },
    ];

    mockClient.fetch.mockResolvedValue(mockCoreValues as never);

    const component = await CoreValues();
    render(component);

    // Should show "1" as the first number
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
