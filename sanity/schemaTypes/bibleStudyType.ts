// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

import { BibleStudyInput } from '../components/bibleStudyInput';

export const bibleStudyType = defineType({
  name: 'bibleStudy',
  title: 'Bible Study',
  type: 'document',
  liveEdit: true,
  fields: [
    defineField({
      name: 'isEnabled',
      title: 'Show Bible Study on the website',
      type: 'boolean',
      initialValue: false,
      description:
        'Leave this off to keep Bible Study out of the menu and off its public page. Turn it on when the signup page should go live.',
    }),
    defineField({
      name: 'editor',
      title: 'Bible Study email',
      type: 'string',
      components: {
        input: BibleStudyInput,
      },
    }),
    defineField({
      name: 'sealed',
      title: 'Encrypted signups',
      type: 'text',
      readOnly: true,
      hidden: true,
      description:
        'Ciphertext for the signup list, meeting link, and email draft. Do not edit this field.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Bible Study',
        subtitle: 'Signups and email',
      };
    },
  },
});
