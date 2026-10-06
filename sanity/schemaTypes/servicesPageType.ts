// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const servicesPageType = defineType({
  name: 'servicesPage',
  title: 'Join Us',
  type: 'document',
  fields: [
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description:
        'The message shown next to the map. Press Enter to put the next words on a new line.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string' || !value.trim()) {
            return 'Add a description';
          }
          return true;
        }),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
      description:
        'The church address. Press Enter so each line appears on its own row. The map uses this address, so changing it here moves the pin.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string' || !value.trim()) {
            return 'Add an address';
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      address: 'address',
    },
    prepare({ address }) {
      const firstLine =
        typeof address === 'string' ? address.split('\n')[0]?.trim() : '';
      return {
        title: 'Join Us',
        subtitle: firstLine || 'Add an address',
      };
    },
  },
});
