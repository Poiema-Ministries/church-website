// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const bulletinType = defineType({
  name: 'bulletin',
  title: 'Bulletin',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the bulletin',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'The description of the bulletin',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description:
        'Order in which this bulletin should be displayed (lower numbers appear first)',
      validation: (rule) => rule.required().integer().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
    },
    prepare({ title, order }) {
      return { title, subtitle: `Order: ${order}` };
    },
  },
});
