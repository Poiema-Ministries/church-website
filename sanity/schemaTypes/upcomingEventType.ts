// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const upcomingEventType = defineType({
  name: 'upcomingEvent',
  title: 'Upcoming Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the upcoming event',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'URL-friendly identifier for the event (click Generate to create from the title)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      description: 'The banner image displayed on the upcoming events page',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A description of the event (optional)',
      rows: 4,
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'date',
      description: 'The date the event is happening',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'registrationDeadline',
      title: 'Registration Deadline',
      type: 'date',
      description:
        'The last day to register for the event. After this date, the event will no longer appear on the website and the registration form will be closed.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      description:
        'The input fields that will appear on the event registration form. Each field requires a label and an input type.',
      of: [
        {
          type: 'object',
          name: 'formField',
          title: 'Form Field',
          fields: [
            defineField({
              name: 'label',
              title: 'Field Label',
              type: 'string',
              description:
                'The label displayed above the input (e.g., "First Name", "Phone Number")',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'inputType',
              title: 'Input Type',
              type: 'string',
              description: 'The type of input field',
              options: {
                list: [
                  { title: 'Text', value: 'text' },
                  { title: 'Textarea', value: 'textarea' },
                  { title: 'Dropdown', value: 'dropdown' },
                ],
                layout: 'radio',
              },
              initialValue: 'text',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'dropdownOptions',
              title: 'Dropdown Options',
              type: 'array',
              description:
                'The selectable options for the dropdown. Only used when Input Type is set to "Dropdown".',
              of: [{ type: 'string' }],
              hidden: ({ parent }) => parent?.inputType !== 'dropdown',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as
                    | { inputType?: string }
                    | undefined;
                  if (
                    parent?.inputType === 'dropdown' &&
                    (!Array.isArray(value) || value.length < 2)
                  ) {
                    return 'Dropdown fields require at least 2 options';
                  }
                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'inputType',
              options: 'dropdownOptions',
            },
            prepare({ title, subtitle, options }) {
              const typeLabel = subtitle || 'text';
              const optionCount =
                subtitle === 'dropdown' && Array.isArray(options)
                  ? ` (${options.length} options)`
                  : '';
              return {
                title: title || 'Untitled Field',
                subtitle: `Type: ${typeLabel}${optionCount}`,
              };
            },
          },
        },
      ],
      validation: (rule) =>
        rule.min(1).error('At least one form field is required'),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description:
        'Order in which this event should be displayed (lower numbers appear first)',
      validation: (rule) => rule.required().integer().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eventDate: 'eventDate',
      registrationDeadline: 'registrationDeadline',
      media: 'bannerImage',
    },
    prepare({ title, eventDate, registrationDeadline, media }) {
      const parts: string[] = [];
      if (eventDate) parts.push(`Event: ${eventDate}`);
      if (registrationDeadline) parts.push(`Deadline: ${registrationDeadline}`);
      return {
        title: title || 'Untitled Event',
        subtitle: parts.length > 0 ? parts.join(' | ') : 'No dates set',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Order, Ascending',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
