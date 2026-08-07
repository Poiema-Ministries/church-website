// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const retreatType = defineType({
  name: 'retreat',
  title: 'Retreat',
  type: 'document',
  fields: [
    defineField({
      name: 'isEnabled',
      title: 'Show Retreat Page',
      type: 'boolean',
      description:
        'When enabled, the Retreat page appears in the navigation and is accessible. Turn off to hide it from the site.',
      initialValue: false,
    }),
    defineField({
      name: 'themeTitle',
      title: 'Retreat Theme',
      type: 'string',
      description: 'Main theme title (e.g., "Comfort My People")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'e.g., "Winter Retreat 2026" or "Summer Retreat 2027"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'speaker',
      title: 'Speaker',
      type: 'string',
      description: 'Pastor or speaker leading the retreat',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'themeImage',
      title: 'Theme Image',
      type: 'image',
      description: 'Optional image displayed under the theme details',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'scheduleDays',
      title: 'Schedule',
      type: 'array',
      description: 'One column per day of the retreat',
      of: [
        {
          type: 'object',
          name: 'scheduleDay',
          title: 'Day',
          fields: [
            defineField({
              name: 'dayLabel',
              title: 'Day',
              type: 'string',
              description: 'e.g., Thursday, Friday, Saturday',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'date',
              title: 'Date',
              type: 'string',
              description: 'Optional display date (e.g., "Feb 12")',
            }),
            defineField({
              name: 'activities',
              title: 'Activities',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'activity',
                  title: 'Activity',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Activity Name',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'startTime',
                      title: 'Start Time',
                      type: 'string',
                      description: 'e.g., 8:30 AM',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'endTime',
                      title: 'End Time',
                      type: 'string',
                      description: 'e.g., 9:00 AM',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'note',
                      title: 'Note',
                      type: 'string',
                      description: 'Optional note shown under the time',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      startTime: 'startTime',
                      endTime: 'endTime',
                    },
                    prepare({ title, startTime, endTime }) {
                      return {
                        title: title || 'Untitled activity',
                        subtitle:
                          startTime && endTime
                            ? `${startTime} – ${endTime}`
                            : undefined,
                      };
                    },
                  },
                },
              ],
              validation: (rule) =>
                rule.min(1).error('Add at least one activity for this day'),
            }),
          ],
          preview: {
            select: {
              title: 'dayLabel',
              subtitle: 'date',
              activities: 'activities',
            },
            prepare({ title, subtitle, activities }) {
              const count = Array.isArray(activities) ? activities.length : 0;
              return {
                title: title || 'Untitled day',
                subtitle: [subtitle, `${count} activities`]
                  .filter(Boolean)
                  .join(' · '),
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'questionSections',
      title: 'Question Sections',
      type: 'array',
      description:
        'Sermon reflection sections. Use "Show on Retreat Page" to reveal each section after the sermon.',
      of: [
        {
          type: 'object',
          name: 'questionSection',
          title: 'Question Section',
          fields: [
            defineField({
              name: 'isVisible',
              title: 'Show on Retreat Page',
              type: 'boolean',
              description:
                'Turn on after the sermon so attendees can see these questions. Leave off to hide until ready.',
              initialValue: false,
            }),
            defineField({
              name: 'sermonTitle',
              title: 'Sermon Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'bibleVerse',
              title: 'Bible Verse',
              type: 'string',
              description: 'e.g., Isaiah 40:1–11',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'reflectionQuestions',
              title: 'Reflection Questions',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (rule) =>
                rule.min(1).error('Add at least one reflection question'),
            }),
          ],
          preview: {
            select: {
              title: 'sermonTitle',
              verse: 'bibleVerse',
              isVisible: 'isVisible',
            },
            prepare({ title, verse, isVisible }) {
              return {
                title: title || 'Untitled sermon',
                subtitle: `${isVisible ? 'Visible' : 'Hidden'}${verse ? ` · ${verse}` : ''}`,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'themeTitle',
      subtitle: 'subtitle',
      isEnabled: 'isEnabled',
      media: 'themeImage',
    },
    prepare({ title, subtitle, isEnabled, media }) {
      return {
        title: title || 'Retreat',
        subtitle: `${isEnabled ? 'Enabled' : 'Disabled'}${subtitle ? ` · ${subtitle}` : ''}`,
        media,
      };
    },
  },
});
