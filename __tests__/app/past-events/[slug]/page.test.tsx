// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import EventPage from '@/app/past-events/[slug]/page';
import { getAssetsFromCollection } from '@/lib/cloudinary';

// Mock Cloudinary
jest.mock('@/lib/cloudinary', () => ({
  getAssetsFromCollection: jest.fn(),
}));

// Mock next/navigation
const mockNotFound = jest.fn(() => {
  const error = new Error('NEXT_NOT_FOUND');
  (error as Error & { digest?: string }).digest = 'NEXT_NOT_FOUND';
  throw error;
});

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}));

// Mock EventGallery component
jest.mock('@/app/past-events/[slug]/event-gallery', () => {
  return function MockEventGallery({ slug }: { slug: string }) {
    return <div data-testid='event-gallery'>Event Gallery for {slug}</div>;
  };
});

const mockGetAssetsFromCollection =
  getAssetsFromCollection as jest.MockedFunction<
    typeof getAssetsFromCollection
  >;

describe('Event Page (Dynamic)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render event page with formatted title', async () => {
    const mockAssets = [
      {
        public_id: 'covers/2025_july_bbq',
        secure_url: 'https://example.com/image.jpg',
        context: {
          caption: '2025_july_bbq',
        },
      },
    ];

    mockGetAssetsFromCollection.mockResolvedValue(mockAssets as never);

    const params = Promise.resolve({ slug: '2025_july_bbq' });
    const component = await EventPage({ params });

    render(component);

    expect(screen.getByText('2025 July Bbq')).toBeInTheDocument();
    expect(screen.getByTestId('event-gallery')).toBeInTheDocument();
  });

  it('should handle slug with URL encoding', async () => {
    const mockAssets = [
      {
        public_id: 'covers/2025_july_bbq',
        secure_url: 'https://example.com/image.jpg',
        context: {
          caption: '2025_july_bbq',
        },
      },
    ];

    mockGetAssetsFromCollection.mockResolvedValue(mockAssets as never);

    const params = Promise.resolve({ slug: '2025_july_bbq' });
    const component = await EventPage({ params });

    render(component);

    expect(screen.getByTestId('event-gallery')).toBeInTheDocument();
  });

  it('should render with slug as title when event is not found', async () => {
    mockGetAssetsFromCollection.mockResolvedValue([]);

    const params = Promise.resolve({ slug: 'non-existent-event' });
    const component = await EventPage({ params });
    render(component);

    // When event is not found, it should render with formatted slug as title
    expect(screen.getByText('Non-existent-event')).toBeInTheDocument();
  });

  it('should handle params as object (Next.js 14 compatibility)', async () => {
    const mockAssets = [
      {
        public_id: 'covers/test_event',
        secure_url: 'https://example.com/image.jpg',
        context: {
          caption: 'test_event',
        },
      },
    ];

    mockGetAssetsFromCollection.mockResolvedValue(mockAssets as never);

    const params = { slug: 'test_event' };
    const component = await EventPage({ params });

    render(component);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });
});
