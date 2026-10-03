// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';

import { apiVersion, projectId } from '@/sanity/env';

import { readBearerToken, verifyBibleStudyEditor } from './auth';
import { BibleStudyAuthError } from './errors';

export function bibleStudyJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function requireBibleStudyEditor(req: Request): Promise<void> {
  try {
    await verifyBibleStudyEditor({
      token: readBearerToken(req.headers.get('authorization')),
      projectId,
      apiVersion,
    });
  } catch (error) {
    if (error instanceof BibleStudyAuthError) {
      throw error;
    }
    throw new BibleStudyAuthError();
  }
}

export function contentLengthIsReasonable(
  req: Request,
  maxBytes: number,
): boolean {
  const raw = req.headers.get('content-length');
  if (!raw) return true;
  const length = Number(raw);
  return Number.isFinite(length) && length >= 0 && length <= maxBytes;
}
