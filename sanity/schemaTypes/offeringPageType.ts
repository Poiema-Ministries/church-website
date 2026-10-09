// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';
import {
  DEFAULT_GIVE_NOW_URL,
  DEFAULT_OFFERING_LABEL,
  DEFAULT_WHY_WE_GIVE,
} from '../../app/offering/content';

export const offeringPageType = defineType({
  name: 'offeringPage',
  title: 'Online Offering',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description:
        'The line shown under the Online Offering title. The title itself stays “Online Offering.”',
      initialValue: DEFAULT_OFFERING_LABEL,
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string' || !value.trim()) {
            return 'Add a label';
          }
          return true;
        }),
    }),
    defineField({
      name: 'giveNowUrl',
      title: 'Give Now Link',
      type: 'url',
      description:
        'Where the Give Now button goes. The button text stays “Give Now.”',
      initialValue: DEFAULT_GIVE_NOW_URL,
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'whyWeGive',
      title: 'Why We Give',
      type: 'text',
      rows: 6,
      description:
        'The paragraph under “Why We Give?”. The heading stays the same. Press Enter to start a new line.',
      initialValue: DEFAULT_WHY_WE_GIVE,
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string' || !value.trim()) {
            return 'Add a description';
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      label: 'label',
    },
    prepare({ label }) {
      return {
        title: 'Online Offering',
        subtitle:
          typeof label === 'string' && label.trim()
            ? label.trim()
            : 'Add a label',
      };
    },
  },
});
