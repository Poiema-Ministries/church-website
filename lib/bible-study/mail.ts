// Copyright 2026 Poiema Ministries. All Rights Reserved.

import 'server-only';

import { Resend } from 'resend';

import {
  generateBibleStudyEmail,
  generateBibleStudySignupEmail,
} from '@/app/common/utils/email-templates';
import { getResendFromAddress } from '@/app/common/utils/env';

import { unsubscribeApiUrl, unsubscribePageUrl } from './links';
import { ATTENDANCE_LABELS, type BibleStudySubscriber } from './types';

const REPLY_TO = 'info@poiemaministries.org';
const SEND_CONCURRENCY = 5;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function listUnsubscribeHeaders(token: string): Record<string, string> {
  return {
    'List-Unsubscribe': `<${unsubscribeApiUrl(token)}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

export async function sendSignupConfirmation(subscriber: {
  name: string;
  email: string;
  format: BibleStudySubscriber['format'];
  token: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.error(
      'Bible Study confirmation skipped: RESEND_API_KEY is not set.',
    );
    return;
  }

  const result = await resend.emails.send({
    from: getResendFromAddress(),
    to: subscriber.email,
    replyTo: REPLY_TO,
    subject: 'You are signed up for Bible Study',
    html: generateBibleStudySignupEmail({
      recipientName: subscriber.name,
      attendanceLabel: ATTENDANCE_LABELS[subscriber.format],
      unsubscribeUrl: unsubscribePageUrl(subscriber.token),
    }),
    headers: listUnsubscribeHeaders(subscriber.token),
  });

  if (result.error) {
    console.error(
      `Bible Study confirmation failed to send. ${result.error.message}`,
    );
  }
}

export async function sendBibleStudyEmails(input: {
  subject: string;
  message: string;
  meetingLink: string;
  subscribers: BibleStudySubscriber[];
}): Promise<{ sent: number; failed: string[]; reason?: string }> {
  const resend = getResend();
  if (!resend) {
    throw new Error('RESEND_API_KEY is not set.');
  }

  const from = getResendFromAddress();
  const reasons: string[] = [];
  let sent = 0;
  const failed: string[] = [];

  for (
    let index = 0;
    index < input.subscribers.length;
    index += SEND_CONCURRENCY
  ) {
    const chunk = input.subscribers.slice(index, index + SEND_CONCURRENCY);
    const results = await Promise.all(
      chunk.map(async (subscriber) => {
        const result = await resend.emails.send({
          from,
          to: subscriber.email,
          replyTo: REPLY_TO,
          subject: input.subject,
          html: generateBibleStudyEmail({
            recipientName: subscriber.name,
            message: input.message,
            meetingLink: input.meetingLink,
            unsubscribeUrl: unsubscribePageUrl(subscriber.token),
          }),
          headers: listUnsubscribeHeaders(subscriber.token),
        });
        return { email: subscriber.email, error: result.error?.message };
      }),
    );

    for (const result of results) {
      if (result.error) {
        failed.push(result.email);
        reasons.push(result.error);
      } else {
        sent += 1;
      }
    }
  }

  return {
    sent,
    failed,
    reason: sent === 0 ? deliveryReason(reasons) : undefined,
  };
}

function deliveryReason(messages: string[]): string | undefined {
  if (
    messages.some(
      (message) =>
        message.includes('testing emails') ||
        message.includes('verify a domain'),
    )
  ) {
    return 'Resend is still in test mode. Mail from onboarding@resend.dev only arrives at info@poiemaministries.org. Verify poiemaministries.org in Resend, then set RESEND_FROM_EMAIL to an address on that domain.';
  }

  return messages.find(Boolean);
}
