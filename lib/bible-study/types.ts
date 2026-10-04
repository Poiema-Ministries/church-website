// Copyright 2026 Poiema Ministries. All Rights Reserved.

export const ATTENDANCE_FORMATS = ['in-person', 'online'] as const;

export type AttendanceFormat = (typeof ATTENDANCE_FORMATS)[number];

export const ATTENDANCE_LABELS: Record<AttendanceFormat, string> = {
  'in-person': 'In person',
  online: 'Online',
};

export type BibleStudySubscriber = {
  id: string;
  name: string;
  email: string;
  format: AttendanceFormat;
  /** Unguessable secret. Lives only inside the encrypted Sanity payload. */
  token: string;
  subscribedAt: string;
};

export type BibleStudyRecord = {
  emailSubject: string;
  emailMessage: string;
  meetingLink: string;
  lastSentAt: string | null;
  subscribers: BibleStudySubscriber[];
};

export type BibleStudyEditorSubscriber = {
  id: string;
  name: string;
  email: string;
  format: AttendanceFormat;
  subscribedAt: string;
};

export type BibleStudyEditorView = {
  emailSubject: string;
  emailMessage: string;
  meetingLink: string;
  lastSentAt: string | null;
  subscribers: BibleStudyEditorSubscriber[];
};

export const MAX_SUBSCRIBERS = 1000;
export const SEND_COOLDOWN_MS = 60_000;
