// Copyright 2026 Poiema Ministries. All Rights Reserved.

import {
  BibleStudyAuthError,
  BibleStudyValidationError,
} from '@/lib/bible-study/errors';
import {
  bibleStudyJson,
  contentLengthIsReasonable,
  requireBibleStudyEditor,
} from '@/lib/bible-study/http';
import { removeById, toEditorView } from '@/lib/bible-study/record';
import { mutateBibleStudy, readBibleStudy } from '@/lib/bible-study/store';
import { parseEditorSettings } from '@/lib/bible-study/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UNAUTHORIZED = 'You do not have permission to manage Bible Study.';

export async function GET(req: Request) {
  const denied = await denyUnlessEditor(req);
  if (denied) return denied;

  try {
    return bibleStudyJson(toEditorView(await readBibleStudy()));
  } catch (error) {
    console.error('Bible Study settings could not be loaded.');
    return bibleStudyJson({ error: loadError(error) }, 500);
  }
}

export async function PUT(req: Request) {
  const denied = await denyUnlessEditor(req);
  if (denied) return denied;

  if (!contentLengthIsReasonable(req, 40_000)) {
    return bibleStudyJson({ error: 'That update is too large.' }, 413);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bibleStudyJson({ error: 'The email form could not be read.' }, 400);
  }

  try {
    const settings = parseEditorSettings(body, { requireReadyToSend: false });
    const next = await mutateBibleStudy((record) => ({
      ...record,
      ...settings,
    }));
    return bibleStudyJson(toEditorView(next));
  } catch (error) {
    if (error instanceof BibleStudyValidationError) {
      return bibleStudyJson({ error: error.message }, 400);
    }
    console.error('Bible Study settings could not be saved.');
    return bibleStudyJson({ error: loadError(error) }, 500);
  }
}

export async function DELETE(req: Request) {
  const denied = await denyUnlessEditor(req);
  if (denied) return denied;

  const subscriberId = new URL(req.url).searchParams.get('subscriberId') ?? '';
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      subscriberId,
    )
  ) {
    return bibleStudyJson({ error: 'That signup could not be found.' }, 400);
  }

  try {
    let removed = false;
    const next = await mutateBibleStudy((record) => {
      const outcome = removeById(record, subscriberId);
      removed = outcome.removed;
      return outcome.record;
    });
    if (!removed) {
      return bibleStudyJson({ error: 'That signup could not be found.' }, 404);
    }
    return bibleStudyJson(toEditorView(next));
  } catch (error) {
    console.error('Bible Study signup could not be removed.');
    return bibleStudyJson({ error: loadError(error) }, 500);
  }
}

async function denyUnlessEditor(req: Request) {
  try {
    await requireBibleStudyEditor(req);
    return null;
  } catch (error) {
    if (error instanceof BibleStudyAuthError) {
      return bibleStudyJson({ error: UNAUTHORIZED }, 401);
    }
    throw error;
  }
}

function loadError(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('BIBLE_STUDY_ENCRYPTION_KEY')) {
    return 'Bible Study storage is not configured yet. Add BIBLE_STUDY_ENCRYPTION_KEY on the server.';
  }
  if (message.includes('SANITY_WRITE_TOKEN')) {
    return 'Bible Study storage is not configured yet. Add SANITY_WRITE_TOKEN on the server.';
  }
  return 'Bible Study could not be saved. Please try again.';
}
