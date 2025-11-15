// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const sermonType = defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the sermon',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bibleVerse',
      title: 'Bible Verse',
      type: 'string',
      description: 'The bible verse of the sermon',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'preacher',
      title: 'Preacher',
      type: 'string',
      description: 'The preacher of the sermon',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'The date of the sermon',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'The YouTubeURL of the sermon',
      validation: (rule) => rule.required(),
    }),
  ],
});