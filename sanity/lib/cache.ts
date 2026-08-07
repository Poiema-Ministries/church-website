// Copyright 2025 Poiema Ministries. All Rights Reserved.

/**
 * Shared ISR and cache-tag settings for Sanity-backed pages.
 * Use sanityCachedFetch() so on-demand revalidation can target content types.
 */

export const SANITY_REVALIDATE_SECONDS = 300;
export const SANITY_EVENTS_REVALIDATE_SECONDS = 60;
/** Retreat content (esp. question visibility) can change during the event. */
export const SANITY_RETREAT_REVALIDATE_SECONDS = 0;
export const CLOUDINARY_REVALIDATE_SECONDS = 3600;

export const SANITY_TAGS = {
  all: 'sanity',
  bulletin: 'sanity:bulletin',
  announcement: 'sanity:announcement',
  upcomingEvent: 'sanity:upcomingEvent',
  teamMember: 'sanity:teamMember',
  coreValue: 'sanity:coreValue',
  sermon: 'sanity:sermon',
  retreat: 'sanity:retreat',
} as const;

export type SanityDocumentType =
  | 'bulletin'
  | 'announcement'
  | 'upcomingEvent'
  | 'teamMember'
  | 'coreValue'
  | 'sermon'
  | 'retreat';

export const SANITY_TYPE_TO_TAG: Record<SanityDocumentType, string> = {
  bulletin: SANITY_TAGS.bulletin,
  announcement: SANITY_TAGS.announcement,
  upcomingEvent: SANITY_TAGS.upcomingEvent,
  teamMember: SANITY_TAGS.teamMember,
  coreValue: SANITY_TAGS.coreValue,
  sermon: SANITY_TAGS.sermon,
  retreat: SANITY_TAGS.retreat,
};

export const SANITY_TYPE_TO_PATHS: Record<SanityDocumentType, string[]> = {
  bulletin: ['/bulletins'],
  announcement: ['/bulletins'],
  upcomingEvent: ['/upcoming-events'],
  teamMember: ['/teams'],
  coreValue: ['/core-values', '/'],
  sermon: ['/sermons'],
  retreat: ['/retreat'],
};
