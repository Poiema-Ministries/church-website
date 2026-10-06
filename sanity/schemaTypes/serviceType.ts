// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { defineArrayMember, defineField, defineType } from 'sanity';

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        'The service name and time shown on the page (for example, "First Service - 9:30AM").',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description:
        'The text shown beside the photo. Press Enter to start a new paragraph. Highlight text to make it bold, italic, or underlined.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [],
          },
        }),
      ],
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!Array.isArray(value) || value.length === 0) {
            return 'Add a description';
          }

          const hasText = value.some((block) => {
            if (!block || typeof block !== 'object' || !('children' in block)) {
              return false;
            }

            const children = (block as { children?: { text?: string }[] })
              .children;
            return children?.some((child) => child.text?.trim());
          });

          return hasText || 'Add a description';
        }),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Photo shown beside this service.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Description of the photo',
          type: 'string',
          description:
            'A short description for visitors who cannot see the photo. If you leave this blank, the service title is used.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description:
        'Where this service appears. 1 is first, 2 is second, and so on. Odd numbers place the text on the left. Even numbers place the photo on the left.',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'isVisible',
      title: 'Show on Services Page',
      type: 'boolean',
      description:
        'Turn this off to hide the service without deleting it. Turn it on to show it again.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      media: 'image',
      isVisible: 'isVisible',
    },
    prepare({ title, order, media, isVisible }) {
      const hidden = isVisible === false ? ' · Hidden' : '';
      return {
        title: title || 'Untitled Service',
        subtitle: `Order ${order ?? 'not set'}${hidden}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
