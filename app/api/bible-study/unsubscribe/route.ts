// Copyright 2026 Poiema Ministries. All Rights Reserved.

import {
  bibleStudyJson,
  contentLengthIsReasonable,
} from '@/lib/bible-study/http';
import { clientIp, rateLimit } from '@/lib/bible-study/rate-limit';
import { removeByToken } from '@/lib/bible-study/record';
import { mutateBibleStudy, readBibleStudy } from '@/lib/bible-study/store';
import { isUnsubscribeTokenShape } from '@/lib/bible-study/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST only. Opening the link in a browser, or a mail scanner following it,
 * must not remove anyone. Mailbox one-click unsubscribe (RFC 8058) is a POST.
 */
export async function POST(req: Request) {
  if (
    !rateLimit(`bible-study-unsubscribe:${clientIp(req)}`, 30, 10 * 60 * 1000)
  ) {
    return bibleStudyJson(
      { error: 'Please wait a moment and try again.' },
      429,
    );
  }

  if (!contentLengthIsReasonable(req, 20_000)) {
    return bibleStudyJson({ removed: false });
  }

  const token = await readToken(req);
  if (!isUnsubscribeTokenShape(token)) {
    return bibleStudyJson({ removed: false });
  }

  try {
    const current = await readBibleStudy();
    if (!removeByToken(current, token).removed) {
      return bibleStudyJson({ removed: false });
    }

    let removed = false;
    await mutateBibleStudy((record) => {
      const outcome = removeByToken(record, token);
      removed = outcome.removed;
      return outcome.record;
    });
    return bibleStudyJson({ removed });
  } catch {
    console.error('Bible Study unsubscribe could not be completed.');
    return bibleStudyJson(
      { error: 'We could not update your email preference. Please try again.' },
      500,
    );
  }
}

async function readToken(req: Request): Promise<string> {
  const fromQuery = new URL(req.url).searchParams.get('token')?.trim() ?? '';
  if (fromQuery) return fromQuery;

  const contentType = req.headers.get('content-type') ?? '';
  try {
    if (contentType.includes('application/json')) {
      const body: unknown = await req.json();
      if (body && typeof body === 'object' && 'token' in body) {
        const token = (body as { token?: unknown }).token;
        return typeof token === 'string' ? token.trim() : '';
      }
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(await req.text());
      return params.get('token')?.trim() ?? '';
    }
  } catch {
    return '';
  }

  return '';
}
