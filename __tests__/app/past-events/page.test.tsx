// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import PastEvents from '@/app/past-events/page';
import { getAssetsFromCollection } from '@/lib/cloudinary';

// Mock Cloudinary
jest.mock('@/lib/cloudinary', () => ({
  getAssetsFromCollection: jest.fn(),
}));

const mockGetAssetsFromCollection =
  getAssetsFromCollection as jest.MockedFunction<
    typeof getAssetsFromCollection
  >;

describe('Past Events Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the past events page with heading', async () => {
    mockGetAssetsFromCollection.mockResolvedValue([]);

    const component = await PastEvents();
    render(component);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Past Events',
    );
  });

  it('should display event cards when covers are available', async () => {
    const mockCovers = [
      {
        public_id: 'covers/2025_july_bbq',
        secure_url: 'https://example.com/image.jpg',
        width: 800,
        height: 600,
        format: 'jpg',
        context: {
          caption: '2025_july_bbq',
          alt: 'July BBQ event on July 15, 2025',
        },
      },
      {
        public_id: 'covers/2024_winter_retreat',
        secure_url: 'https://example.com/image2.jpg',
        width: 800,
        height: 600,
        format: 'jpg',
        context: {
          caption: '2024_winter_retreat',
          alt: 'Winter Retreat on December 20, 2024',
        },
      },
    ];

    mockGetAssetsFromCollection.mockResolvedValue(mockCovers);

    const component = await PastEvents();
    render(component);

    expect(screen.getByText('2025 July Bbq')).toBeInTheDocument();
    expect(screen.getByText('2024 Winter Retreat')).toBeInTheDocument();
  });

  it('should display "No past events found" when no covers are available', async () => {
    mockGetAssetsFromCollection.mockResolvedValue([]);

    const component = await PastEvents();
    render(component);

    expect(screen.getByText('No past events found.')).toBeInTheDocument();
  });

  it('should fetch covers from Cloudinary', async () => {
    mockGetAssetsFromCollection.mockResolvedValue([]);

    await PastEvents();

    expect(mockGetAssetsFromCollection).toHaveBeenCalledWith('covers', 100);
  });

  it('should create links to individual event pages', async () => {
    const mockCovers = [
      {
        public_id: 'covers/2025_july_bbq',
        secure_url: 'https://example.com/image.jpg',
        width: 800,
        height: 600,
        format: 'jpg',
        context: {
          caption: '2025_july_bbq',
          alt: 'July BBQ event on July 15, 2025',
        },
      },
    ];

    mockGetAssetsFromCollection.mockResolvedValue(mockCovers);

    const component = await PastEvents();
    render(component);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/past-events/2025_july_bbq');
  });
});
