// Copyright 2026 Poiema Ministries. All Rights Reserved.

import 'server-only';

import { getBibleStudyEncryptionKey } from '@/app/common/utils/env';
import { getServerSanityClient } from '@/sanity/lib/serverClient';

import { openRecord, sealRecord } from './crypto';
import {
  BibleStudyCapacityError,
  BibleStudyCooldownError,
  BibleStudyValidationError,
} from './errors';
import { emptyRecord } from './record';
import type { BibleStudyRecord } from './types';

const DOCUMENT_ID = 'bibleStudy';
const MAX_ATTEMPTS = 5;

function isConflict(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  if ('statusCode' in error && error.statusCode === 409) return true;
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  return message.includes('conflict') || message.includes('already exists');
}

/**
 * Read-modify-write with a revision check so two signups cannot drop each
 * other. Decrypt failures are not retried and never replaced with an empty list.
 */
export async function mutateBibleStudy(
  mutate: (record: BibleStudyRecord) => BibleStudyRecord,
): Promise<BibleStudyRecord> {
  const client = getServerSanityClient();
  const secret = getBibleStudyEncryptionKey();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const existing = await client.getDocument<{
      _rev: string;
      sealed?: string;
    }>(DOCUMENT_ID);

    const current = existing?.sealed
      ? openRecord(existing.sealed, secret)
      : emptyRecord();
    const next = mutate(current);
    const sealed = sealRecord(next, secret);

    try {
      if (!existing) {
        await client.create({
          _id: DOCUMENT_ID,
          _type: 'bibleStudy',
          sealed,
        });
      } else {
        await client
          .patch(DOCUMENT_ID)
          .ifRevisionId(existing._rev)
          .set({ sealed })
          .commit();
      }
      return next;
    } catch (error) {
      if (
        error instanceof BibleStudyValidationError ||
        error instanceof BibleStudyCooldownError ||
        error instanceof BibleStudyCapacityError
      ) {
        throw error;
      }
      if (!isConflict(error) || attempt === MAX_ATTEMPTS - 1) throw error;
    }
  }

  throw new Error('Failed to save the Bible Study record.');
}

export async function readBibleStudy(): Promise<BibleStudyRecord> {
  const client = getServerSanityClient();
  const existing = await client.getDocument<{ sealed?: string }>(DOCUMENT_ID);
  if (!existing?.sealed) return emptyRecord();
  return openRecord(existing.sealed, getBibleStudyEncryptionKey());
}
