// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { groq } from 'next-sanity';

export const coreValuesQuery = groq`
  *[_type == "coreValue"] | order(order asc) {
    _id,
    title,
    description,
    order
  }
`;

export const sermonsQuery = groq`
  *[_type == "sermon"] | order(date desc) {
    _id,
    title,
    bibleVerse,
    preacher,
    date,
    url
  }
`;

export const bulletinsQuery = groq`
  *[_type == "bulletin"] | order(order asc) {
    _id,
    title,
    description
  }
`;

export const announcementsQuery = groq`
  *[_type == "announcement"] | order(order asc) {
    _id,
    title,
    description,
    order,
    announcementImage {
      image {
        asset
      },
      width,
      height
    }
  }
`;

export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(name asc) {
    _id,
    name,
    image {
      asset,
      alt
    },
    team
  }
`;

export const upcomingEventsQuery = groq`
  *[_type == "upcomingEvent" && registrationDeadline >= now()] | order(order asc) {
    _id,
    title,
    slug,
    bannerImage {
      asset,
      hotspot
    },
    description,
    eventDate,
    registrationDeadline,
    fields[] {
      _key,
      label,
      inputType,
      dropdownOptions
    },
    order
  }
`;

export const upcomingEventBySlugQuery = groq`
  *[_type == "upcomingEvent" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    bannerImage {
      asset,
      hotspot
    },
    description,
    eventDate,
    registrationDeadline,
    fields[] {
      _key,
      label,
      inputType,
      dropdownOptions
    },
    order
  }
`;
