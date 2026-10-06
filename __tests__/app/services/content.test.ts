// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { toServicesContent } from '@/app/services/content';

jest.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    width: () => ({
      quality: () => ({
        url: () => 'https://cdn.sanity.io/images/service.jpg',
      }),
    }),
  }),
}));

describe('toServicesContent', () => {
  it('keeps titled services in order and builds image URLs', () => {
    const content = toServicesContent({
      services: [
        {
          _id: 'missing-title',
          title: '   ',
          order: 0,
        },
        {
          _id: 'service-first',
          title: ' First Service - 9:30AM ',
          order: 1,
          description: [],
          image: {
            alt: '  Congregation  ',
            asset: { _ref: 'image-1' },
          },
        },
      ],
      joinUs: {
        description: '  Come worship with us  ',
        address: '  45-60 211th Street\nBayside, NY 11358  ',
      },
    });

    expect(content.services).toEqual([
      {
        _id: 'service-first',
        title: 'First Service - 9:30AM',
        description: [],
        imageUrl: 'https://cdn.sanity.io/images/service.jpg',
        imageAlt: 'Congregation',
        order: 1,
      },
    ]);
    expect(content.joinUs).toEqual({
      description: 'Come worship with us',
      address: '45-60 211th Street\nBayside, NY 11358',
    });
  });

  it('omits Join Us when both fields are blank', () => {
    expect(
      toServicesContent({
        services: [],
        joinUs: { description: '  ', address: '' },
      }).joinUs,
    ).toBeNull();
  });

  it('falls back to the title when a photo has no description', () => {
    const content = toServicesContent({
      services: [
        {
          _id: 'service-first',
          title: 'First Service - 9:30AM',
          image: { asset: { _ref: 'image-1' } },
        },
      ],
    });

    expect(content.services[0]?.imageAlt).toBe('First Service - 9:30AM');
  });
});
