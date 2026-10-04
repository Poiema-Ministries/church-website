// Copyright 2026 Poiema Ministries. All Rights Reserved.

import {
  createUnsubscribeToken,
  openRecord,
  sealRecord,
  unsubscribeTokensMatch,
} from '@/lib/bible-study/crypto';
import { emptyRecord } from '@/lib/bible-study/record';

const SECRET = 'test-secret-that-is-at-least-32-characters';

describe('Bible Study encryption', () => {
  it('round-trips a record without leaving the email in the stored payload', () => {
    const record = emptyRecord();
    record.subscribers.push({
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      format: 'online',
      token: createUnsubscribeToken(),
      subscribedAt: '2026-10-01T12:00:00.000Z',
    });
    record.meetingLink = 'https://meet.example.com/bible-study';

    const sealed = sealRecord(record, SECRET);

    expect(sealed.startsWith('v1.')).toBe(true);
    expect(sealed).not.toContain('ada@example.com');
    expect(sealed).not.toContain('meet.example.com');
    expect(sealed).not.toContain(record.subscribers[0].token);
    expect(openRecord(sealed, SECRET)).toEqual(record);
  });

  it('rejects a payload sealed with a different secret', () => {
    const sealed = sealRecord(emptyRecord(), SECRET);
    expect(() => openRecord(sealed, `${SECRET}-other-key-value`)).toThrow(
      'Bible Study record could not be read.',
    );
  });

  it('rejects a tampered payload', () => {
    const sealed = sealRecord(emptyRecord(), SECRET);
    const [version, iv, tag, cipher] = sealed.split('.');
    // Flip a decoded byte. Changing the last base64 character can land in
    // unused padding bits and leave the ciphertext unchanged.
    const bytes = Buffer.from(cipher, 'base64url');
    bytes[0] ^= 0xff;
    expect(() =>
      openRecord(
        [version, iv, tag, bytes.toString('base64url')].join('.'),
        SECRET,
      ),
    ).toThrow('Bible Study record could not be read.');
  });

  it('matches only the exact unsubscribe token', () => {
    const token = createUnsubscribeToken();
    const other = `${token.slice(0, -1)}${token.endsWith('a') ? 'b' : 'a'}`;
    expect(unsubscribeTokensMatch(token, token)).toBe(true);
    expect(unsubscribeTokensMatch(token, other)).toBe(false);
    expect(unsubscribeTokensMatch(token, '')).toBe(false);
  });
});
