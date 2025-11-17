// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { type SchemaTypeDefinition } from 'sanity';

export const upcomingEventType: SchemaTypeDefinition = {
  name: 'upcomingEventType',
  title: 'Upcoming Event Type',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'nameRequired', title: 'Name Required', type: 'boolean' },
    { name: 'emailRequired', title: 'Email Required', type: 'boolean' },
    { name: 'phoneRequired', title: 'Phone Required', type: 'boolean' },
    { name: 'order', title: 'Order', type: 'number' },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
};
