// Copyright 2026 Poiema Ministries. All Rights Reserved.

import {
  BibleStudyAuthError,
  BibleStudyCooldownError,
  BibleStudyValidationError,
} from '@/lib/bible-study/errors';
import {
  bibleStudyJson,
  contentLengthIsReasonable,
  requireBibleStudyEditor,
} from '@/lib/bible-study/http';
import { sendBibleStudyEmails } from '@/lib/bible-study/mail';
import { isSendCoolingDown } from '@/lib/bible-study/record';
import { mutateBibleStudy } from '@/lib/bible-study/store';
import { parseEditorSettings } from '@/lib/bible-study/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await requireBibleStudyEditor(req);
  } catch (error) {
    if (error instanceof BibleStudyAuthError) {
      return bibleStudyJson(
        { error: 'You do not have permission to send Bible Study emails.' },
        401,
      );
    }
    throw error;
  }

  if (!contentLengthIsReasonable(req, 40_000)) {
    return bibleStudyJson({ error: 'That email is too large.' }, 413);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bibleStudyJson({ error: 'The email form could not be read.' }, 400);
  }

  let settings;
  try {
    settings = parseEditorSettings(body, { requireReadyToSend: true });
  } catch (error) {
    if (error instanceof BibleStudyValidationError) {
      return bibleStudyJson({ error: error.message }, 400);
    }
    throw error;
  }

  let previousSentAt: string | null = null;

  try {
    const claimed = await mutateBibleStudy((record) => {
      if (record.subscribers.length === 0) {
        throw new BibleStudyValidationError('No one is signed up yet.');
      }
      if (isSendCoolingDown(record, Date.now())) {
        throw new BibleStudyCooldownError();
      }
      previousSentAt = record.lastSentAt;
      return {
        ...record,
        emailSubject: settings.emailSubject,
        emailMessage: settings.emailMessage,
        meetingLink: settings.meetingLink,
        lastSentAt: new Date().toISOString(),
      };
    });

    const result = await sendBibleStudyEmails({
      subject: settings.emailSubject,
      message: settings.emailMessage,
      meetingLink: settings.meetingLink,
      subscribers: claimed.subscribers,
    });

    if (result.sent === 0) {
      await restoreLastSent(previousSentAt);
      return bibleStudyJson(
        {
          error:
            result.reason ??
            'The email could not be sent. Confirm RESEND_API_KEY is set and RESEND_FROM_EMAIL uses a domain verified in Resend.',
          sent: 0,
          failed: result.failed,
        },
        502,
      );
    }

    return bibleStudyJson({
      sent: result.sent,
      failed: result.failed,
    });
  } catch (error) {
    if (error instanceof BibleStudyValidationError) {
      return bibleStudyJson({ error: error.message }, 400);
    }
    if (error instanceof BibleStudyCooldownError) {
      return bibleStudyJson({ error: error.message }, 429);
    }

    await restoreLastSent(previousSentAt);
    console.error('Bible Study email could not be sent.');
    const message = error instanceof Error ? error.message : '';
    if (message.includes('RESEND_API_KEY')) {
      return bibleStudyJson(
        {
          error:
            'Email sending is not configured yet. Add RESEND_API_KEY on the server.',
        },
        500,
      );
    }
    return bibleStudyJson(
      { error: 'The email could not be sent. Please try again.' },
      500,
    );
  }
}

async function restoreLastSent(previousSentAt: string | null) {
  try {
    await mutateBibleStudy((record) => ({
      ...record,
      lastSentAt: previousSentAt,
    }));
  } catch {
    console.error('Bible Study send lock could not be released.');
  }
}
