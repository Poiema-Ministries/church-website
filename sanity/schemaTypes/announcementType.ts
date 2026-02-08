import { defineField, defineType } from 'sanity';

export const announcementType = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the announcement',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'The description of the announcement',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description:
        'Order in which this announcement should be displayed (lower numbers appear first)',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'announcementImage',
      title: 'Announcement Image',
      type: 'object',
      description:
        'Optional image to display at the bottom of the announcement. If added, width and height are required.',
      options: {
        collapsible: true,
        collapsed: true,
      },
      validation: (rule) =>
        rule.custom(
          (
            value:
              | { image?: unknown; width?: number; height?: number }
              | undefined,
          ) => {
            if (!value) return true;
            const hasImage = value.image != null;
            const hasWidth = value.width != null && value.width > 0;
            const hasHeight = value.height != null && value.height > 0;
            if (hasImage && (!hasWidth || !hasHeight)) {
              return 'Width and height are required when an image is added';
            }
            if (!hasImage && (value.width != null || value.height != null)) {
              return 'Width and height should only be set when an image is added';
            }
            return true;
          },
        ),
      fields: [
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        },
        {
          name: 'width',
          title: 'Width (px)',
          type: 'number',
          description: 'Display width of the image in pixels',
          validation: (rule) => rule.min(1).integer(),
        },
        {
          name: 'height',
          title: 'Height (px)',
          type: 'number',
          description: 'Display height of the image in pixels',
          validation: (rule) => rule.min(1).integer(),
        },
      ],
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
