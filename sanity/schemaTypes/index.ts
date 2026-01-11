// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { type SchemaTypeDefinition } from 'sanity';
import { coreValueType } from './coreValueType';
import { sermonType } from './sermonType';
import { bulletinType } from './bulletinType';
import { announcementType } from './announcementType';
import { upcomingEventType } from './upcomingEventType';
import { teamMemberType } from './teamMemberType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    coreValueType,
    sermonType,
    bulletinType,
    announcementType,
    upcomingEventType,
    teamMemberType,
  ],
};
