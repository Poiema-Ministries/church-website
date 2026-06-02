// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const memberType = defineType({
  name: 'member',
  title: 'Member',
  type: 'document',
  description:
    'A person known to the church. Members are the source of truth for attendance and newcomer status.',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(80),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(80),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      description: 'Used for quick recognition during Sunday check-in.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'joinedAt',
      title: 'Joined At',
      type: 'date',
      description:
        'The date this person first joined. Drives the "New" badge in the attendance app.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? true
            : 'Must be a valid email address';
        }),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
    }),
    defineField({
      name: 'zipCode',
      title: 'Zip Code',
      type: 'string',
    }),
    defineField({
      name: 'ageGroup',
      title: 'Age Group',
      type: 'string',
      options: {
        list: [
          { title: '18-24', value: '18-24' },
          { title: '25-29', value: '25-29' },
          { title: '30-35+', value: '30-35+' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'occupation',
      title: 'Occupation',
      type: 'string',
      options: {
        list: [
          { title: 'Student', value: 'Student' },
          { title: 'Employed', value: 'Employed' },
          { title: 'Other', value: 'Other' },
        ],
      },
    }),
    defineField({
      name: 'attendedOtherChurches',
      title: 'Attended Other Churches Before',
      type: 'string',
      options: {
        list: [
          { title: 'Yes', value: 'Yes' },
          { title: 'No', value: 'No' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'otherChurches',
      title: 'Other Churches',
      type: 'string',
      hidden: ({ parent }) => parent?.attendedOtherChurches !== 'Yes',
    }),
    defineField({
      name: 'howDidYouHearAboutUs',
      title: 'How Did You Hear About Us',
      type: 'string',
      options: {
        list: [
          { title: 'From a Friend', value: 'From a Friend' },
          { title: 'Online Search', value: 'Online Search' },
          { title: 'Physical Location', value: 'Physical Location' },
          { title: 'Other', value: 'Other' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Inactive', value: 'inactive' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      joinedAt: 'joinedAt',
      status: 'status',
      media: 'image',
    },
    prepare({ firstName, lastName, joinedAt, status, media }) {
      const name = [firstName, lastName].filter(Boolean).join(' ').trim();
      return {
        title: name || 'Unnamed Member',
        subtitle: [status, joinedAt && `joined ${joinedAt}`]
          .filter(Boolean)
          .join(' · '),
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Last Name, A-Z',
      name: 'lastNameAsc',
      by: [
        { field: 'lastName', direction: 'asc' },
        { field: 'firstName', direction: 'asc' },
      ],
    },
    {
      title: 'Recently Joined',
      name: 'joinedDesc',
      by: [{ field: 'joinedAt', direction: 'desc' }],
    },
  ],
});
