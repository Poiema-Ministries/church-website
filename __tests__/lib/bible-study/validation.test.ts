// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { parseEditorSettings, parseSignup } from '@/lib/bible-study/validation';

const loadedAt = Date.now() - 10_000;

describe('Bible Study signup validation', () => {
  it('accepts a name, email, and attendance choice', () => {
    expect(
      parseSignup({
        name: '  Ada   Lovelace ',
        email: 'Ada@Example.com',
        format: 'in-person',
        formLoadedAt: loadedAt,
      }),
    ).toEqual({
      ok: true,
      value: {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        format: 'in-person',
      },
    });
  });

  it('rejects a honeypot, a rushed submit, and a missing attendance choice', () => {
    expect(
      parseSignup({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        format: 'online',
        website: 'https://spam.example',
        formLoadedAt: loadedAt,
      }).ok,
    ).toBe(false);

    expect(
      parseSignup({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        format: 'online',
        formLoadedAt: Date.now(),
      }).ok,
    ).toBe(false);

    const missingFormat = parseSignup({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      format: '',
      formLoadedAt: loadedAt,
    });
    expect(missingFormat).toEqual({
      ok: false,
      error: 'Please choose how you will join.',
    });
  });
});

describe('Bible Study editor settings', () => {
  it('requires a subject, message, and https link before sending', () => {
    expect(() =>
      parseEditorSettings(
        {
          emailSubject: 'This week',
          emailMessage: 'Join us.',
          meetingLink: 'http://example.com',
        },
        { requireReadyToSend: true },
      ),
    ).toThrow('https://');

    expect(
      parseEditorSettings(
        {
          emailSubject: 'This week\nBcc: someone',
          emailMessage: 'Join us.',
          meetingLink: 'https://meet.example.com/room',
        },
        { requireReadyToSend: true },
      ),
    ).toEqual({
      emailSubject: 'This week Bcc: someone',
      emailMessage: 'Join us.',
      meetingLink: 'https://meet.example.com/room',
    });
  });

  it('allows an empty meeting link while the draft is being saved', () => {
    expect(
      parseEditorSettings(
        { emailSubject: '', emailMessage: '', meetingLink: '' },
        { requireReadyToSend: false },
      ),
    ).toEqual({
      emailSubject: '',
      emailMessage: '',
      meetingLink: '',
    });
  });
});
