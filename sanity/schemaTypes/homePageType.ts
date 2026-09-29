// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Home Page Image',
      type: 'image',
      description:
        'Photo shown across the top of the home page. It is displayed in black and white. Leave empty to use the default banner.',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      media: 'heroImage',
    },
    prepare({ media }) {
      return {
        title: 'Home Page',
        subtitle: media ? 'Custom banner image' : 'Using the default banner',
        media,
      };
    },
  },
});
