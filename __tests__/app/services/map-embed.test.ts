// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { addressLines, googleMapsEmbedUrl } from '@/app/services/map-embed';

describe('googleMapsEmbedUrl', () => {
  it('joins address lines into the map search', () => {
    const src = googleMapsEmbedUrl('45-60 211th Street\nBayside, NY 11358');

    expect(src).not.toBeNull();
    const url = new URL(src as string);
    expect(url.searchParams.get('q')).toBe(
      '45-60 211th Street, Bayside, NY 11358',
    );
    expect(url.searchParams.get('output')).toBe('embed');
  });

  it('returns null when the address is blank', () => {
    expect(googleMapsEmbedUrl('  \n  ')).toBeNull();
  });
});

describe('addressLines', () => {
  it('drops blank lines', () => {
    expect(addressLines('45-60 211th Street\n\nBayside, NY 11358')).toEqual([
      '45-60 211th Street',
      'Bayside, NY 11358',
    ]);
  });
});
