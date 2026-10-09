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
  bibleStudy: 'sanity:bibleStudy',
  pastor: 'sanity:pastor',
  homePage: 'sanity:homePage',
  service: 'sanity:service',
  servicesPage: 'sanity:servicesPage',
  offeringPage: 'sanity:offeringPage',
} as const;

export type SanityDocumentType =
  | 'bulletin'
  | 'announcement'
  | 'upcomingEvent'
  | 'teamMember'
  | 'coreValue'
  | 'sermon'
  | 'retreat'
  | 'bibleStudy'
  | 'pastor'
  | 'homePage'
  | 'service'
  | 'servicesPage'
  | 'offeringPage';

export const SANITY_TYPE_TO_TAG: Record<SanityDocumentType, string> = {
  bulletin: SANITY_TAGS.bulletin,
  announcement: SANITY_TAGS.announcement,
  upcomingEvent: SANITY_TAGS.upcomingEvent,
  teamMember: SANITY_TAGS.teamMember,
  coreValue: SANITY_TAGS.coreValue,
  sermon: SANITY_TAGS.sermon,
  retreat: SANITY_TAGS.retreat,
  bibleStudy: SANITY_TAGS.bibleStudy,
  pastor: SANITY_TAGS.pastor,
  homePage: SANITY_TAGS.homePage,
  service: SANITY_TAGS.service,
  servicesPage: SANITY_TAGS.servicesPage,
  offeringPage: SANITY_TAGS.offeringPage,
};

export const SANITY_TYPE_TO_PATHS: Record<SanityDocumentType, string[]> = {
  bulletin: ['/bulletins'],
  announcement: ['/bulletins'],
  upcomingEvent: ['/upcoming-events'],
  teamMember: ['/teams'],
  coreValue: ['/core-values', '/'],
  sermon: ['/sermons'],
  retreat: ['/retreat'],
  bibleStudy: ['/bible-study'],
  pastor: ['/pastor'],
  homePage: ['/'],
  service: ['/services'],
  servicesPage: ['/services'],
  offeringPage: ['/offering'],
};
