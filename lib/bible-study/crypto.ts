// Copyright 2026 Poiema Ministries. All Rights Reserved.

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'crypto';

import type { BibleStudyRecord } from './types';

const SALT = 'poiema-bible-study-v1';
const VERSION = 'v1';

let cachedKey: { secret: string; key: Buffer } | null = null;

function deriveKey(secret: string): Buffer {
  if (cachedKey?.secret === secret) return cachedKey.key;
  const key = scryptSync(secret, SALT, 32);
  cachedKey = { secret, key };
  return key;
}

export function createUnsubscribeToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Compares unsubscribe secrets without leaking the stored value through an
 * early length or byte mismatch return that a caller could time.
 */
export function unsubscribeTokensMatch(
  stored: string,
  provided: string,
): boolean {
  if (typeof stored !== 'string' || typeof provided !== 'string') return false;
  const left = Buffer.from(stored);
  const right = Buffer.from(provided);
  if (left.length === 0 || right.length === 0 || left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function sealRecord(record: BibleStudyRecord, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', deriveKey(secret), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(record), 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    VERSION,
    iv.toString('base64url'),
    tag.toString('base64url'),
    ciphertext.toString('base64url'),
  ].join('.');
}

export function openRecord(sealed: string, secret: string): BibleStudyRecord {
  const [version, ivPart, tagPart, cipherPart] = sealed.split('.');
  if (
    version !== VERSION ||
    !ivPart ||
    !tagPart ||
    !cipherPart ||
    sealed.split('.').length !== 4
  ) {
    throw new Error('Bible Study record could not be read.');
  }

  let plaintext: string;
  try {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      deriveKey(secret),
      Buffer.from(ivPart, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(tagPart, 'base64url'));
    plaintext = Buffer.concat([
      decipher.update(Buffer.from(cipherPart, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    throw new Error('Bible Study record could not be read.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(plaintext);
  } catch {
    throw new Error('Bible Study record could not be read.');
  }
  if (!isBibleStudyRecord(parsed)) {
    throw new Error('Bible Study record could not be read.');
  }
  return parsed;
}

function isBibleStudyRecord(value: unknown): value is BibleStudyRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as BibleStudyRecord;
  return (
    typeof record.emailSubject === 'string' &&
    typeof record.emailMessage === 'string' &&
    typeof record.meetingLink === 'string' &&
    (record.lastSentAt === null || typeof record.lastSentAt === 'string') &&
    Array.isArray(record.subscribers)
  );
}
