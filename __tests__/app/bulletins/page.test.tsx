// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Bulletins from '@/app/bulletins/page';
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

// Mock the bulletin and announcement item components
jest.mock('@/app/bulletins/bulletin-item', () => {
  return function MockBulletinItem({ bulletin }: { bulletin: { _id: string } }) {
    return <div data-testid={`bulletin-${bulletin._id}`}>Bulletin Item</div>;
  };
});

jest.mock('@/app/bulletins/announcement-item', () => {
  return function MockAnnouncementItem({
    announcement,
  }: {
    announcement: { _id: string };
  }) {
    return (
      <div data-testid={`announcement-${announcement._id}`}>
        Announcement Item
      </div>
    );
  };
});

const mockClient = client as unknown as { fetch: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>> };

describe('Bulletins Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the bulletins page with heading', async () => {
    mockClient.fetch.mockResolvedValueOnce([] as never).mockResolvedValueOnce([] as never);

    const component = await Bulletins();
    render(component);

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings[0]).toHaveTextContent('Bulletins');
  });

  it('should render announcements heading', async () => {
    mockClient.fetch.mockResolvedValueOnce([] as never).mockResolvedValueOnce([] as never);

    const component = await Bulletins();
    render(component);

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings[1]).toHaveTextContent('Announcements');
  });

  it('should display bulletins when data is available', async () => {
    const mockBulletins = [
      { _id: '1', title: 'Bulletin 1' },
      { _id: '2', title: 'Bulletin 2' },
    ];
    const mockAnnouncements = [{ _id: '1', title: 'Announcement 1' }];

    mockClient.fetch
      .mockResolvedValueOnce(mockBulletins as never)
      .mockResolvedValueOnce(mockAnnouncements as never);

    const component = await Bulletins();
    render(component);

    expect(screen.getByTestId('bulletin-1')).toBeInTheDocument();
    expect(screen.getByTestId('bulletin-2')).toBeInTheDocument();
    expect(screen.getByTestId('announcement-1')).toBeInTheDocument();
  });

  it('should handle empty bulletins and announcements', async () => {
    mockClient.fetch.mockResolvedValueOnce([] as never).mockResolvedValueOnce([] as never);

    const component = await Bulletins();
    render(component);

    expect(screen.getByText('Bulletins')).toBeInTheDocument();
    expect(screen.getByText('Announcements')).toBeInTheDocument();
  });

  it('should fetch data from Sanity', async () => {
    mockClient.fetch.mockResolvedValueOnce([] as never).mockResolvedValueOnce([] as never);

    await Bulletins();

    expect(mockClient.fetch).toHaveBeenCalledTimes(2);
  });
});
