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
    eventEndDate,
    registrationDeadline,
    fields[] {
      _key,
      label,
      inputType,
      dropdownOptions,
      checkboxOptions
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
    eventEndDate,
    registrationDeadline,
    fields[] {
      _key,
      label,
      inputType,
      dropdownOptions,
      checkboxOptions
    },
    order
  }
`;

export const pastorQuery = groq`
  *[_type == "pastor"] | order(_updatedAt desc)[0] {
    _id,
    name,
    image {
      asset,
      hotspot
    },
    description
  }
`;

export const retreatEnabledQuery = groq`
  *[_type == "retreat"] | order(_updatedAt desc)[0] {
    isEnabled
  }
`;

export const retreatQuery = groq`
  *[_type == "retreat"] | order(_updatedAt desc)[0] {
    _id,
    isEnabled,
    themeTitle,
    subtitle,
    speaker,
    themeImage {
      asset,
      hotspot
    },
    scheduleDays[] {
      _key,
      dayLabel,
      date,
      activities[] {
        _key,
        title,
        startTime,
        endTime,
        note
      }
    },
    questionSections[] {
      _key,
      isVisible,
      sermonTitle,
      bibleVerse,
      reflectionQuestions
    }
  }
`;
