// Copyright 2026 Poiema Ministries. All Rights Reserved.

import {
  isHoneypotFilled,
  isSubmissionTooFast,
  isSuspiciousFullName,
} from '@/lib/spam-validation';

import { BibleStudyValidationError } from './errors';
import { isAttendanceFormat } from './record';
import type { AttendanceFormat } from './types';

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 8000;
const MAX_LINK_LENGTH = 2000;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupInput = {
  name: string;
  email: string;
  format: AttendanceFormat;
};

export type EditorSettings = {
  emailSubject: string;
  emailMessage: string;
  meetingLink: string;
};

export function parseSignup(
  body: unknown,
): { ok: true; value: SignupInput } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Please check the form and try again.' };
  }

  const data = body as Record<string, unknown>;

  if (
    isHoneypotFilled(data) ||
    isSubmissionTooFast(
      typeof data.formLoadedAt === 'number' ? data.formLoadedAt : undefined,
    ) ||
    !isFreshEnough(data.formLoadedAt)
  ) {
    return {
      ok: false,
      error: 'We could not submit that signup. Please try again.',
    };
  }

  const name = normalizeName(data.name);
  const email = normalizeEmail(data.email);
  const format = typeof data.format === 'string' ? data.format : '';

  if (!name || name.length < 2 || name.length > MAX_NAME_LENGTH) {
    return { ok: false, error: 'Please enter your name.' };
  }

  if (isSuspiciousFullName(name)) {
    return {
      ok: false,
      error: 'We could not submit that signup. Please try again.',
    };
  }

  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  if (!isAttendanceFormat(format)) {
    return { ok: false, error: 'Please choose how you will join.' };
  }

  return { ok: true, value: { name, email, format } };
}

export function parseEditorSettings(
  body: unknown,
  options: { requireReadyToSend: boolean },
): EditorSettings {
  if (!body || typeof body !== 'object') {
    throw new BibleStudyValidationError('The email form was empty.');
  }

  const data = body as Record<string, unknown>;
  const emailSubject = normalizeSingleLine(data.emailSubject);
  const emailMessage =
    typeof data.emailMessage === 'string' ? data.emailMessage.trim() : '';
  const meetingLink =
    typeof data.meetingLink === 'string' ? data.meetingLink.trim() : '';

  if (emailSubject.length > MAX_SUBJECT_LENGTH) {
    throw new BibleStudyValidationError('The subject is too long.');
  }

  if (emailMessage.length > MAX_MESSAGE_LENGTH) {
    throw new BibleStudyValidationError('The message is too long.');
  }

  if (meetingLink.length > MAX_LINK_LENGTH) {
    throw new BibleStudyValidationError('The meeting link is too long.');
  }

  if (meetingLink && !isHttpsUrl(meetingLink)) {
    throw new BibleStudyValidationError(
      'The meeting link must be a full https:// address.',
    );
  }

  if (options.requireReadyToSend) {
    if (!emailSubject) {
      throw new BibleStudyValidationError('Add a subject before sending.');
    }
    if (!emailMessage) {
      throw new BibleStudyValidationError(
        'Write the email message before sending.',
      );
    }
    if (!meetingLink) {
      throw new BibleStudyValidationError(
        'Add the virtual meeting link before sending.',
      );
    }
  }

  return { emailSubject, emailMessage, meetingLink };
}

export function isUnsubscribeTokenShape(token: string): boolean {
  return /^[A-Za-z0-9_-]{40,64}$/.test(token);
}

function isFreshEnough(formLoadedAt: unknown): boolean {
  if (typeof formLoadedAt !== 'number' || !Number.isFinite(formLoadedAt)) {
    return false;
  }
  const elapsed = Date.now() - formLoadedAt;
  return elapsed <= MAX_FORM_AGE_MS && formLoadedAt <= Date.now() + 60_000;
}

function normalizeName(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeEmail(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

function normalizeSingleLine(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
}
