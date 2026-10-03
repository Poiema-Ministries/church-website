// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { createUnsubscribeToken } from '@/lib/bible-study/crypto';
import {
  BibleStudyCapacityError,
  BibleStudyValidationError,
} from '@/lib/bible-study/errors';
import {
  bibleStudyJson,
  contentLengthIsReasonable,
} from '@/lib/bible-study/http';
import { sendSignupConfirmation } from '@/lib/bible-study/mail';
import { clientIp, rateLimit } from '@/lib/bible-study/rate-limit';
import { subscribe } from '@/lib/bible-study/record';
import { mutateBibleStudy } from '@/lib/bible-study/store';
import { parseSignup } from '@/lib/bible-study/validation';
import { isBibleStudyPublic } from '@/lib/bible-study/visibility';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!(await isBibleStudyPublic())) {
    return bibleStudyJson(
      { error: 'Bible Study signup is not open right now.' },
      404,
    );
  }

  if (!contentLengthIsReasonable(req, 20_000)) {
    return bibleStudyJson(
      { error: 'We could not submit that signup. Please try again.' },
      413,
    );
  }

  if (!rateLimit(`bible-study-signup:${clientIp(req)}`, 8, 10 * 60 * 1000)) {
    return bibleStudyJson(
      { error: 'Please wait a moment and try again.' },
      429,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bibleStudyJson(
      { error: 'Please check the form and try again.' },
      400,
    );
  }

  const parsed = parseSignup(body);
  if (!parsed.ok) {
    return bibleStudyJson({ error: parsed.error }, 400);
  }

  const token = createUnsubscribeToken();
  let created = false;

  try {
    await mutateBibleStudy((record) => {
      const outcome = subscribe(record, {
        ...parsed.value,
        token,
        subscribedAt: new Date().toISOString(),
      });
      created = outcome.created;
      return outcome.record;
    });
  } catch (error) {
    if (error instanceof BibleStudyCapacityError) {
      return bibleStudyJson({ error: error.message }, 503);
    }
    if (error instanceof BibleStudyValidationError) {
      return bibleStudyJson({ error: error.message }, 400);
    }
    console.error('Bible Study signup could not be saved.');
    return bibleStudyJson(
      {
        error:
          'We could not save your signup right now. Please try again in a little while.',
      },
      500,
    );
  }

  if (created) {
    try {
      await sendSignupConfirmation({ ...parsed.value, token });
    } catch {
      console.error('Bible Study confirmation could not be sent.');
    }
  }

  return bibleStudyJson({ success: true });
}
