// Copyright 2026 Poiema Ministries. All Rights Reserved.

export interface GalleryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

const UPLOAD_MARKER = '/image/upload/';

/** Main viewer cap. Keeps aspect ratio and does not upscale. */
export const VIEWER_TRANSFORM = 'c_limit,w_1600,q_auto,f_auto';

/** Filmstrip thumb. Small enough to scroll a page of them without pulling originals. */
export const THUMB_TRANSFORM = 'c_fill,g_auto,w_192,h_144,q_auto,f_auto';

/**
 * Insert a Cloudinary transformation. URLs that are not Cloudinary uploads,
 * or that already include a transform, are returned unchanged.
 */
export function withCloudinaryTransform(
  url: string,
  transform: string,
): string {
  const index = url.indexOf(UPLOAD_MARKER);
  if (index === -1) return url;

  const rest = url.slice(index + UPLOAD_MARKER.length);
  if (/^[a-z]{1,3}_/.test(rest)) return url;

  return `${url.slice(0, index + UPLOAD_MARKER.length)}${transform}/${rest}`;
}

export function thumbnailUrl(url: string): string {
  return withCloudinaryTransform(url, THUMB_TRANSFORM);
}

export function viewerUrl(url: string): string {
  return withCloudinaryTransform(url, VIEWER_TRANSFORM);
}

const loadedViewerUrls = new Set<string>();
const inflightViewerUrls = new Set<string>();

export function markViewerLoaded(url: string) {
  loadedViewerUrls.add(url);
  inflightViewerUrls.delete(url);
}

export function isViewerLoaded(url: string) {
  return loadedViewerUrls.has(url);
}

/** Test hook. The cache is session-scoped so revisiting a photo stays instant. */
export function resetViewerCache() {
  loadedViewerUrls.clear();
  inflightViewerUrls.clear();
}

/**
 * True when this viewer URL is already decoded. A completed image with no
 * pixels does not count — that is an empty or broken response.
 */
export function probeViewerReady(url: string): boolean {
  if (loadedViewerUrls.has(url)) return true;
  if (typeof window === 'undefined') return false;

  const probe = new window.Image();
  probe.src = url;
  if (probe.complete && probe.naturalWidth > 0) {
    loadedViewerUrls.add(url);
    return true;
  }
  return false;
}

/** Start the viewer download early so a later click can paint from cache. */
export function preloadViewer(secureUrl: string) {
  if (typeof window === 'undefined') return;
  const url = viewerUrl(secureUrl);
  if (loadedViewerUrls.has(url) || inflightViewerUrls.has(url)) return;

  inflightViewerUrls.add(url);
  const img = new window.Image();
  img.decoding = 'async';
  img.src = url;
  img.onload = () => {
    loadedViewerUrls.add(url);
    inflightViewerUrls.delete(url);
  };
  img.onerror = () => {
    inflightViewerUrls.delete(url);
  };
}

export interface StripMetrics {
  scrollWidth: number;
  scrollLeft: number;
  clientWidth: number;
}

/**
 * True when the filmstrip overflows and the user is within `threshold` px of
 * the right edge. A full page of thumbs is much wider than the threshold, so
 * appending one page does not immediately satisfy this again.
 */
export function shouldLoadMoreFromStrip(
  metrics: StripMetrics,
  threshold = 160,
): boolean {
  const overflow = metrics.scrollWidth - metrics.clientWidth;
  if (overflow <= 8) return false;
  const remaining =
    metrics.scrollWidth - metrics.scrollLeft - metrics.clientWidth;
  return remaining < threshold;
}

/**
 * Loaded photos still ahead of the current one. Prefetch the next page only
 * when the viewer is this close to the end of what is already in memory.
 */
export const PREFETCH_WHEN_REMAINING = 2;

export function shouldPrefetchNextPage(
  loadedCount: number,
  currentIndex: number,
): boolean {
  if (loadedCount <= 0 || currentIndex < 0) return false;
  return loadedCount - 1 - currentIndex <= PREFETCH_WHEN_REMAINING;
}

/**
 * Where to move the filmstrip, or null to leave it alone.
 * `center` is only for the moment the lightbox opens.
 * `nearest` reveals an off-screen selection without pulling a thumb the
 * user can already see back to the middle.
 */
export function nextStripScrollLeft({
  scrollLeft,
  clientWidth,
  thumbLeft,
  thumbWidth,
  mode,
  padding = 8,
}: {
  scrollLeft: number;
  clientWidth: number;
  thumbLeft: number;
  thumbWidth: number;
  mode: 'center' | 'nearest';
  padding?: number;
}): number | null {
  if (clientWidth <= 0 || thumbWidth <= 0) return null;

  const thumbRight = thumbLeft + thumbWidth;
  const viewRight = scrollLeft + clientWidth;

  if (mode === 'nearest') {
    if (
      thumbLeft >= scrollLeft + padding &&
      thumbRight <= viewRight - padding
    ) {
      return null;
    }
    if (thumbLeft < scrollLeft + padding) {
      return Math.max(0, thumbLeft - padding);
    }
    return Math.max(0, thumbRight - clientWidth + padding);
  }

  return Math.max(0, thumbLeft - clientWidth / 2 + thumbWidth / 2);
}
