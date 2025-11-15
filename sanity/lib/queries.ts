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
  *[_type == "announcement"] | order(date desc) {
    _id,
    title,
    description
  }
`;
