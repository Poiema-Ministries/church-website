// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageLightbox from '@/app/past-events/[slug]/image-lightbox';
import {
  resetViewerCache,
  viewerUrl,
  markViewerLoaded,
  type GalleryImage,
} from '@/app/past-events/[slug]/gallery-image';

function image(id: string): GalleryImage {
  return {
    public_id: id,
    secure_url: `https://res.cloudinary.com/demo/image/upload/v1/events/${id}.jpg`,
    width: 1200,
    height: 800,
    format: 'jpg',
    resource_type: 'image',
  };
}

const images = ['a', 'b', 'c', 'd', 'e', 'f'].map(image);

describe('ImageLightbox', () => {
  beforeEach(() => {
    resetViewerCache();
    Element.prototype.scrollTo = jest.fn();
    Element.prototype.scrollBy = jest.fn();
  });

  it('shows the selected photo and selects another from the filmstrip without loading more', async () => {
    const user = userEvent.setup();
    const onNavigate = jest.fn();
    const onLoadMore = jest.fn();

    render(
      <ImageLightbox
        images={images}
        currentIndex={0}
        isOpen
        onClose={jest.fn()}
        onNavigate={onNavigate}
        hasMore
        totalCount={37}
        isLoadingMore={false}
        onLoadMore={onLoadMore}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: 'Photo gallery' }),
    ).toBeInTheDocument();
    expect(screen.getByText('1 of 37')).toBeInTheDocument();
    expect(screen.getByAltText('Photo 1 of 37')).toHaveAttribute(
      'src',
      expect.stringContaining('c_limit,w_1600'),
    );
    expect(screen.getAllByRole('button', { name: /Show photo/ })).toHaveLength(
      6,
    );
    expect(
      screen.getByRole('button', { name: 'Show photo 1' }),
    ).toHaveAttribute('aria-current', 'true');
    expect(onLoadMore).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Show photo 3' }));

    expect(onNavigate).toHaveBeenCalledWith(2);
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('uses a resized thumbnail and does not fetch the next page until asked', async () => {
    const user = userEvent.setup();
    const onLoadMore = jest.fn();

    render(
      <ImageLightbox
        images={images}
        currentIndex={1}
        isOpen
        onClose={jest.fn()}
        onNavigate={jest.fn()}
        hasMore
        totalCount={12}
        isLoadingMore={false}
        onLoadMore={onLoadMore}
      />,
    );

    const thumb = screen.getByRole('button', { name: 'Show photo 2' });
    expect(thumb.querySelector('img')).toHaveAttribute(
      'src',
      expect.stringContaining('c_fill,g_auto,w_192,h_144'),
    );

    await user.click(screen.getByRole('button', { name: 'Load more photos' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('prefetches the next page once for the open photo', () => {
    const onLoadMore = jest.fn();
    const props = {
      currentIndex: 5,
      isOpen: true,
      onClose: jest.fn(),
      onNavigate: jest.fn(),
      hasMore: true,
      totalCount: 20,
      isLoadingMore: false,
      onLoadMore,
    };

    const { rerender } = render(<ImageLightbox {...props} images={images} />);
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    rerender(<ImageLightbox {...props} images={[...images, image('g')]} />);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('does not prefetch while a page is already loading or the lightbox is closed', () => {
    const onLoadMore = jest.fn();
    const props = {
      images,
      currentIndex: 5,
      onClose: jest.fn(),
      onNavigate: jest.fn(),
      hasMore: true,
      totalCount: 20,
      onLoadMore,
    };

    const { rerender } = render(
      <ImageLightbox {...props} isOpen isLoadingMore />,
    );
    expect(onLoadMore).not.toHaveBeenCalled();

    rerender(<ImageLightbox {...props} isOpen={false} isLoadingMore={false} />);
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('shows a loader until the photo decodes, and hides it when that photo is already ready', () => {
    const props = {
      images,
      isOpen: true,
      onClose: jest.fn(),
      onNavigate: jest.fn(),
      hasMore: false,
      totalCount: images.length,
      isLoadingMore: false,
    };

    const { rerender } = render(<ImageLightbox {...props} currentIndex={0} />);
    expect(
      screen.getByRole('status', { name: 'Loading photo' }),
    ).toBeInTheDocument();

    fireEvent.load(screen.getByAltText('Photo 1 of 6'));
    expect(
      screen.queryByRole('status', { name: 'Loading photo' }),
    ).not.toBeInTheDocument();

    rerender(<ImageLightbox {...props} currentIndex={1} />);
    expect(
      screen.getByRole('status', { name: 'Loading photo' }),
    ).toBeInTheDocument();

    rerender(<ImageLightbox {...props} currentIndex={0} />);
    expect(
      screen.queryByRole('status', { name: 'Loading photo' }),
    ).not.toBeInTheDocument();

    markViewerLoaded(viewerUrl(images[2].secure_url));
    rerender(<ImageLightbox {...props} currentIndex={2} />);
    expect(
      screen.queryByRole('status', { name: 'Loading photo' }),
    ).not.toBeInTheDocument();
  });

  it('does not move the filmstrip when a visible thumbnail is selected', async () => {
    const user = userEvent.setup();
    const scrollTo = jest.fn();
    Element.prototype.scrollTo = scrollTo;
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockReturnValue(240);
    const offsetWidth = jest
      .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
      .mockImplementation(function (this: HTMLElement) {
        return this.getAttribute('data-thumb-index') == null ? 0 : 96;
      });
    const offsetLeft = jest
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(function (this: HTMLElement) {
        const index = this.getAttribute('data-thumb-index');
        return index == null ? 0 : Number(index) * 100;
      });

    try {
      const onNavigate = jest.fn();
      const props = {
        images,
        isOpen: true,
        onClose: jest.fn(),
        onNavigate,
        hasMore: false,
        totalCount: images.length,
        isLoadingMore: false,
      };
      const { rerender } = render(
        <ImageLightbox {...props} currentIndex={0} />,
      );
      expect(scrollTo).not.toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: 'Show photo 4' }));
      rerender(<ImageLightbox {...props} currentIndex={3} />);
      expect(scrollTo).not.toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: 'Next image' }));
      rerender(<ImageLightbox {...props} currentIndex={4} />);
      expect(scrollTo).toHaveBeenCalledWith({ left: 264, behavior: 'auto' });
    } finally {
      clientWidth.mockRestore();
      offsetWidth.mockRestore();
      offsetLeft.mockRestore();
    }
  });
});
