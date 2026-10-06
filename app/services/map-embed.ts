// Copyright 2026 Poiema Ministries. All Rights Reserved.

/**
 * Builds a Google Maps embed from a postal address.
 * Line breaks are kept for display and joined for the map search.
 */
export function googleMapsEmbedUrl(address: string): string | null {
  const query = address
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(', ');

  if (!query) return null;

  const params = new URLSearchParams({
    q: query,
    hl: 'en',
    z: '17',
    output: 'embed',
  });

  return `https://maps.google.com/maps?${params.toString()}`;
}

export function addressLines(address: string): string[] {
  return address
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
