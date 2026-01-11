// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { defineField, defineType } from 'sanity';

export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The name of the team member',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Photo of the team member',
      validation: (rule) => rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'team',
      title: 'Teams',
      type: 'array',
      description: 'The teams this member serves on (e.g., "Worship", "Children", "Youth")',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required().min(1).error('At least one team is required'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      teams: 'team',
      media: 'image',
    },
    prepare({ title, teams, media }) {
      const teamsList = Array.isArray(teams) ? teams.join(', ') : (teams || 'No teams assigned');
      return {
        title: title || 'Unnamed Team Member',
        subtitle: teamsList,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Name, Z-A',
      name: 'nameDesc',
      by: [{ field: 'name', direction: 'desc' }],
    },
  ],
});
