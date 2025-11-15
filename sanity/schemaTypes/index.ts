// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { type SchemaTypeDefinition } from 'sanity';
import { coreValueType } from './coreValueType';
import { sermonType } from './sermonType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [coreValueType, sermonType],
};
