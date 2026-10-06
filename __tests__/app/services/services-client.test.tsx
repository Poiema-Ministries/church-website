// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import ServicesClient from '@/app/services/services-client';
import type { ServicesContent } from '@/app/common/types/models';

const content: ServicesContent = {
  services: [
    {
      _id: 'service-first',
      title: 'First Service - 9:30AM',
      order: 1,
      imageUrl: 'https://cdn.sanity.io/images/first.jpg',
      imageAlt: 'First Service',
      description: [
        {
          _key: 'a',
          _type: 'block',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _key: 'a1',
              _type: 'span',
              text: 'For those who can not make our 11:30AM service, you can come join us at our first service at 9:30 AM.',
              marks: [],
            },
          ],
        },
        {
          _key: 'b',
          _type: 'block',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _key: 'b1',
              _type: 'span',
              text: 'that all who approach the throne of God may find His grace!',
              marks: ['underline'],
            },
          ],
        },
      ],
    },
    {
      _id: 'service-second',
      title: 'Second Service - 11:30AM',
      order: 2,
      imageUrl: 'https://cdn.sanity.io/images/second.jpg',
      imageAlt: 'Second Service',
      description: [
        {
          _key: 'c',
          _type: 'block',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _key: 'c1',
              _type: 'span',
              text: 'Our Sunday services are a reflection of the daily offerings we give God.',
              marks: [],
            },
          ],
        },
      ],
    },
  ],
  joinUs: {
    description: "Come worship with us\nand experience God's presence.",
    address: '45-60 211th Street\nBayside, NY 11358',
  },
};

describe('ServicesClient', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => content,
    });
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads services from the uncached API and alternates their layout', async () => {
    render(<ServicesClient />);

    expect(screen.getByText('Loading services...')).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'First Service - 9:30AM' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Second Service - 11:30AM' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/For those who can not make our 11:30AM service/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'that all who approach the throne of God may find His grace!',
        { selector: 'span' },
      ),
    ).toHaveClass('underline');

    const rows = document.querySelectorAll('[data-layout]');
    expect(rows[0]).toHaveAttribute('data-layout', 'text-first');
    expect(rows[1]).toHaveAttribute('data-layout', 'image-first');
    expect(rows[1]).toHaveClass('bg-secondary');

    expect(screen.getByAltText('First Service')).toBeInTheDocument();
    expect(screen.getByAltText('Second Service')).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith('/api/services', {
      cache: 'no-store',
      signal: expect.any(AbortSignal),
    });
  });

  it('shows the Join Us description, address, and a map for that address', async () => {
    render(<ServicesClient />);

    expect(
      await screen.findByRole('heading', { name: 'Join Us' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Come worship with us/)).toBeInTheDocument();
    expect(screen.getByText('45-60 211th Street')).toBeInTheDocument();
    expect(screen.getByText('Bayside, NY 11358')).toBeInTheDocument();

    const iframe = screen.getByTitle('Map showing where to join us');
    const mapUrl = new URL(iframe.getAttribute('src') as string);
    expect(mapUrl.searchParams.get('q')).toBe(
      '45-60 211th Street, Bayside, NY 11358',
    );
    expect(mapUrl.searchParams.get('output')).toBe('embed');
  });

  it('shows an error when services cannot be loaded', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to fetch services' }),
    });

    render(<ServicesClient />);

    expect(
      await screen.findByText(
        'Services could not be loaded. Please refresh the page.',
      ),
    ).toBeInTheDocument();
  });

  it('shows an empty state when nothing has been published', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ services: [], joinUs: null }),
    });

    render(<ServicesClient />);

    expect(
      await screen.findByText('Service times will be posted here.'),
    ).toBeInTheDocument();
  });
});
