// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { type SchemaTypeDefinition } from 'sanity';
import { coreValueType } from './coreValueType';
import { sermonType } from './sermonType';
import { bulletinType } from './bulletinType';
import { announcementType } from './announcementType';
import { upcomingEventType } from './upcomingEventType';
import { teamMemberType } from './teamMemberType';
import { retreatType } from './retreatType';
import { pastorType } from './pastorType';
import { homePageType } from './homePageType';
import { bibleStudyType } from './bibleStudyType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homePageType,
    coreValueType,
    sermonType,
    bulletinType,
    announcementType,
    upcomingEventType,
    teamMemberType,
    retreatType,
    pastorType,
    bibleStudyType,
  ],
};
