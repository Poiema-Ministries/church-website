import { type SchemaTypeDefinition } from 'sanity';
import { coreValueType } from './coreValueType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [coreValueType],
};
