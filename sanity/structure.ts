// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pastor')
        .id('pastor')
        .child(
          S.document().schemaType('pastor').documentId('pastor').title('Pastor'),
        ),
      S.listItem()
        .title('Retreat')
        .id('retreat')
        .child(
          S.document().schemaType('retreat').documentId('retreat').title('Retreat'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          listItem.getId() !== 'retreat' && listItem.getId() !== 'pastor',
      ),
    ]);
