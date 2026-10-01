// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { randomUUID } from 'crypto';

import { unsubscribeTokensMatch } from './crypto';
import { BibleStudyCapacityError } from './errors';
import {
  ATTENDANCE_FORMATS,
  MAX_SUBSCRIBERS,
  SEND_COOLDOWN_MS,
  type AttendanceFormat,
  type BibleStudyEditorView,
  type BibleStudyRecord,
} from './types';

export function emptyRecord(): BibleStudyRecord {
  return {
    emailSubject: '',
    emailMessage: '',
    meetingLink: '',
    lastSentAt: null,
    subscribers: [],
  };
}

export function subscribe(
  record: BibleStudyRecord,
  input: {
    name: string;
    email: string;
    format: AttendanceFormat;
    token: string;
    subscribedAt: string;
  },
): { record: BibleStudyRecord; created: boolean } {
  const existing = record.subscribers.find(
    (subscriber) => subscriber.email === input.email,
  );

  if (existing) {
    return {
      created: false,
      record: {
        ...record,
        subscribers: record.subscribers.map((subscriber) =>
          subscriber.email === input.email
            ? {
                ...subscriber,
                name: input.name,
                format: input.format,
              }
            : subscriber,
        ),
      },
    };
  }

  if (record.subscribers.length >= MAX_SUBSCRIBERS) {
    throw new BibleStudyCapacityError();
  }

  return {
    created: true,
    record: {
      ...record,
      subscribers: [
        ...record.subscribers,
        {
          id: randomUUID(),
          name: input.name,
          email: input.email,
          format: input.format,
          token: input.token,
          subscribedAt: input.subscribedAt,
        },
      ],
    },
  };
}

export function removeByToken(
  record: BibleStudyRecord,
  token: string,
): { record: BibleStudyRecord; removed: boolean } {
  let removed = false;
  const subscribers = record.subscribers.filter((subscriber) => {
    const match = unsubscribeTokensMatch(subscriber.token, token);
    if (match) removed = true;
    return !match;
  });

  return {
    removed,
    record: removed ? { ...record, subscribers } : record,
  };
}

export function removeById(
  record: BibleStudyRecord,
  subscriberId: string,
): { record: BibleStudyRecord; removed: boolean } {
  const subscribers = record.subscribers.filter(
    (subscriber) => subscriber.id !== subscriberId,
  );
  const removed = subscribers.length !== record.subscribers.length;
  return {
    removed,
    record: removed ? { ...record, subscribers } : record,
  };
}

export function isSendCoolingDown(
  record: BibleStudyRecord,
  nowMs: number,
): boolean {
  if (!record.lastSentAt) return false;
  const sentAt = Date.parse(record.lastSentAt);
  if (Number.isNaN(sentAt)) return false;
  return nowMs - sentAt < SEND_COOLDOWN_MS;
}

export function toEditorView(record: BibleStudyRecord): BibleStudyEditorView {
  return {
    emailSubject: record.emailSubject,
    emailMessage: record.emailMessage,
    meetingLink: record.meetingLink,
    lastSentAt: record.lastSentAt,
    subscribers: record.subscribers.map((subscriber) => ({
      id: subscriber.id,
      name: subscriber.name,
      email: subscriber.email,
      format: subscriber.format,
      subscribedAt: subscriber.subscribedAt,
    })),
  };
}

export function isAttendanceFormat(value: string): value is AttendanceFormat {
  return (ATTENDANCE_FORMATS as readonly string[]).includes(value);
}
