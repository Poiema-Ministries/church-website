// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const pastorType = defineType({
  name: 'pastor',
  title: 'Pastor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Pastor display name (e.g., "Pastor Sam Jung")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Photo displayed on the Meet Our Pastor page',
      validation: (rule) => rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description:
        'Biography paragraphs shown next to the photo. Each item is a separate paragraph.',
      of: [{ type: 'text', rows: 4 }],
      validation: (rule) =>
        rule.required().min(1).error('Add at least one description paragraph'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Pastor',
        subtitle: 'Meet Our Pastor page',
        media,
      };
    },
  },
});
