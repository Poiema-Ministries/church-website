// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { timingSafeEqual } from 'node:crypto';

import { BibleStudyAuthError } from './errors';

export type StudioEditor = {
  id: string;
  email: string;
  role: string;
};

/**
 * Confirms the caller is signed in to this Sanity project.
 * Any project member can manage Bible Study. The website write token is
 * rejected so it cannot be reused to send the list.
 */
export async function verifyBibleStudyEditor(input: {
  token: string;
  projectId: string;
  apiVersion: string;
  fetchImpl?: typeof fetch;
}): Promise<StudioEditor> {
  const token = input.token.trim();
  if (
    !token ||
    token.length < 20 ||
    token.length > 8000 ||
    /\s/.test(token) ||
    isServerWriteToken(token)
  ) {
    throw new BibleStudyAuthError();
  }

  const fetchImpl = input.fetchImpl ?? fetch;
  const response = await fetchImpl(
    `https://${input.projectId}.api.sanity.io/v${input.apiVersion}/users/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );

  if (!response.ok) throw new BibleStudyAuthError();

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new BibleStudyAuthError();
  }

  const user = parseStudioUser(payload);
  if (!user) throw new BibleStudyAuthError();
  return user;
}

export function parseStudioUser(payload: unknown): StudioEditor | null {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  const id = typeof record.id === 'string' ? record.id.trim() : '';
  if (!id) return null;

  const email = typeof record.email === 'string' ? record.email.trim() : '';
  return { id, email, role: readRole(record) };
}

function readRole(record: Record<string, unknown>): string {
  if (typeof record.role === 'string' && record.role.trim()) {
    return record.role.trim().toLowerCase();
  }

  if (!Array.isArray(record.roles)) return 'member';
  for (const entry of record.roles) {
    if (typeof entry === 'string' && entry.trim()) {
      return entry.trim().toLowerCase();
    }
    if (entry && typeof entry === 'object') {
      const name = (entry as { name?: unknown }).name;
      if (typeof name === 'string' && name.trim()) {
        return name.trim().toLowerCase();
      }
    }
  }

  return 'member';
}

function isServerWriteToken(token: string): boolean {
  const writeToken = process.env.SANITY_WRITE_TOKEN?.trim();
  if (!writeToken || writeToken.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(writeToken));
}

export function readBearerToken(header: string | null): string {
  if (!header?.startsWith('Bearer ')) return '';
  return header.slice('Bearer '.length).trim();
}
