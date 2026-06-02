// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const attendanceRecordType = defineType({
  name: 'attendanceRecord',
  title: 'Attendance Record',
  type: 'document',
  description:
    'One record per (member, Sunday). The document id is deterministic: `attendance.<YYYY-MM-DD>.<memberId>`.',
  fields: [
    defineField({
      name: 'member',
      title: 'Member',
      type: 'reference',
      to: [{ type: 'member' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sundayDate',
      title: 'Sunday Date',
      type: 'date',
      description: 'Must fall on a Sunday in the local time zone.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true;
          const date = new Date(`${value}T12:00:00`);
          return date.getDay() === 0
            ? true
            : 'Attendance dates must be a Sunday';
        }),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description:
        'Denormalized for fast filtering. Should match sundayDate.getFullYear().',
      validation: (rule) => rule.required().min(2000).max(2100),
    }),
    defineField({
      name: 'checkedInAt',
      title: 'Checked In At',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'checkedInBy',
      title: 'Checked In By',
      type: 'string',
      description: 'Display name of the Sanity user who recorded the check-in.',
    }),
    defineField({
      name: 'wasNewcomerAtTime',
      title: 'Was Newcomer At Time',
      type: 'boolean',
      description:
        'Snapshot of newcomer status when the check-in was recorded.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      sundayDate: 'sundayDate',
      memberFirst: 'member.firstName',
      memberLast: 'member.lastName',
      wasNewcomer: 'wasNewcomerAtTime',
      media: 'member.image',
    },
    prepare({ sundayDate, memberFirst, memberLast, wasNewcomer, media }) {
      const name = [memberFirst, memberLast].filter(Boolean).join(' ').trim();
      return {
        title: name || 'Unknown Member',
        subtitle: [sundayDate, wasNewcomer && 'newcomer']
          .filter(Boolean)
          .join(' · '),
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Most Recent Sunday',
      name: 'sundayDesc',
      by: [{ field: 'sundayDate', direction: 'desc' }],
    },
    {
      title: 'Oldest Sunday',
      name: 'sundayAsc',
      by: [{ field: 'sundayDate', direction: 'asc' }],
    },
  ],
});
