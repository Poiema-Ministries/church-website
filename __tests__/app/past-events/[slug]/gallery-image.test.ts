// Copyright 2026 Poiema Ministries. All Rights Reserved.

import {
  nextStripScrollLeft,
  shouldLoadMoreFromStrip,
  shouldPrefetchNextPage,
  thumbnailUrl,
  viewerUrl,
  withCloudinaryTransform,
} from '@/app/past-events/[slug]/gallery-image';

describe('cloudinary image urls', () => {
  const original =
    'https://res.cloudinary.com/demo/image/upload/v123/events/photo.jpg';

  it('builds a small thumbnail without changing the public id', () => {
    expect(thumbnailUrl(original)).toBe(
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_192,h_144,q_auto,f_auto/v123/events/photo.jpg',
    );
  });

  it('builds a capped viewer url', () => {
    expect(viewerUrl(original)).toBe(
      'https://res.cloudinary.com/demo/image/upload/c_limit,w_1600,q_auto,f_auto/v123/events/photo.jpg',
    );
  });

  it('leaves non-cloudinary and already transformed urls alone', () => {
    expect(
      withCloudinaryTransform('https://example.com/photo.jpg', 'w_10'),
    ).toBe('https://example.com/photo.jpg');
    expect(
      thumbnailUrl(
        'https://res.cloudinary.com/demo/image/upload/c_fill,w_100/v123/events/photo.jpg',
      ),
    ).toBe(
      'https://res.cloudinary.com/demo/image/upload/c_fill,w_100/v123/events/photo.jpg',
    );
  });
});

describe('filmstrip pagination', () => {
  it('does not ask for another page when every loaded thumb already fits', () => {
    expect(
      shouldLoadMoreFromStrip({
        scrollWidth: 400,
        scrollLeft: 0,
        clientWidth: 800,
      }),
    ).toBe(false);
  });

  it('asks for another page only when the strip is scrolled near the end', () => {
    expect(
      shouldLoadMoreFromStrip({
        scrollWidth: 2000,
        scrollLeft: 0,
        clientWidth: 800,
      }),
    ).toBe(false);

    expect(
      shouldLoadMoreFromStrip({
        scrollWidth: 2000,
        scrollLeft: 1100,
        clientWidth: 800,
      }),
    ).toBe(true);
  });

  it('prefetches only when the open photo is near the end of the loaded page', () => {
    expect(shouldPrefetchNextPage(10, 0)).toBe(false);
    expect(shouldPrefetchNextPage(10, 6)).toBe(false);
    expect(shouldPrefetchNextPage(10, 7)).toBe(true);
    expect(shouldPrefetchNextPage(10, 9)).toBe(true);
  });
});

describe('filmstrip scroll position', () => {
  it('leaves the strip where it is when the selected thumb is already visible', () => {
    expect(
      nextStripScrollLeft({
        scrollLeft: 400,
        clientWidth: 300,
        thumbLeft: 480,
        thumbWidth: 80,
        mode: 'nearest',
      }),
    ).toBeNull();
  });

  it('reveals an off-screen thumb without centering it', () => {
    expect(
      nextStripScrollLeft({
        scrollLeft: 0,
        clientWidth: 300,
        thumbLeft: 900,
        thumbWidth: 80,
        mode: 'nearest',
      }),
    ).toBe(688);
  });
});
