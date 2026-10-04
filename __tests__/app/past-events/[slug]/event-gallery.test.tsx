// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventGallery from '@/app/past-events/[slug]/event-gallery';
import type { GalleryImage } from '@/app/past-events/[slug]/gallery-image';

function image(id: string): GalleryImage {
  return {
    public_id: id,
    secure_url: `https://res.cloudinary.com/demo/image/upload/v1/events/${id}.jpg`,
    width: 1000,
    height: 800,
    format: 'jpg',
    resource_type: 'image',
  };
}

function page(ids: string[], nextCursor: string | null, totalCount: number) {
  return {
    ok: true,
    json: async () => ({
      images: ids.map(image),
      nextCursor,
      totalCount,
    }),
  };
}

describe('EventGallery', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    Element.prototype.scrollTo = jest.fn();
    Element.prototype.scrollBy = jest.fn();
    global.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  it('reuses loaded photos in the lightbox and does not repeat a page request', async () => {
    const user = userEvent.setup();
    let resolveNext: (value: unknown) => void = () => {};
    fetchMock.mockImplementation((url: string) => {
      if (String(url).includes('cursor=')) {
        return new Promise((resolve) => {
          resolveNext = resolve;
        });
      }
      return Promise.resolve(
        page(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], 'page+2', 20),
      );
    });

    render(<EventGallery slug='summer-bbq' />);

    expect(await screen.findByAltText('Event image a')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/past-events/summer-bbq', {
      signal: expect.any(AbortSignal),
    });

    await user.click(screen.getByAltText('Event image a'));

    expect(
      screen.getByRole('dialog', { name: 'Photo gallery' }),
    ).toBeInTheDocument();
    expect(screen.getByText('1 of 20')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Show photo 4' }));
    expect(screen.getByAltText('Photo 4 of 20')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const more = screen.getByRole('button', { name: 'Load more photos' });
    await user.click(more);
    await user.click(more);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/past-events/summer-bbq?cursor=page%2B2',
      { signal: expect.any(AbortSignal) },
    );

    resolveNext(page(['k', 'l'], null, 20));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Show photo 12' }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('button', { name: 'Load more photos' }),
    ).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('prefetches the following page once when opening a photo at the end of the loaded set', async () => {
    const user = userEvent.setup();
    fetchMock
      .mockResolvedValueOnce(page(['a', 'b', 'c', 'd', 'e', 'f'], 'next', 20))
      .mockResolvedValueOnce(page(['g'], 'later', 20));

    render(<EventGallery slug='summer-bbq' />);

    expect(await screen.findByAltText('Event image f')).toBeInTheDocument();
    await user.click(screen.getByAltText('Event image f'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
    expect(fetchMock.mock.calls[1][0]).toBe(
      '/api/past-events/summer-bbq?cursor=next',
    );
    expect(
      await screen.findByRole('button', { name: 'Show photo 7' }),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Photo 6 of 20')).toBeInTheDocument();
  });
});
