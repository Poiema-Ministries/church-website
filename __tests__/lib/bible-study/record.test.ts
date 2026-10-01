// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { createUnsubscribeToken } from '@/lib/bible-study/crypto';
import { BibleStudyCapacityError } from '@/lib/bible-study/errors';
import {
  emptyRecord,
  isSendCoolingDown,
  removeById,
  removeByToken,
  subscribe,
  toEditorView,
} from '@/lib/bible-study/record';
import { MAX_SUBSCRIBERS } from '@/lib/bible-study/types';

describe('Bible Study roster', () => {
  const now = '2026-10-01T12:00:00.000Z';

  it('adds a person and keeps their unsubscribe token off the editor view', () => {
    const token = createUnsubscribeToken();
    const outcome = subscribe(emptyRecord(), {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      format: 'in-person',
      token,
      subscribedAt: now,
    });

    expect(outcome.created).toBe(true);
    expect(outcome.record.subscribers).toHaveLength(1);

    const editorView = toEditorView(outcome.record);
    expect(editorView.subscribers[0]).toEqual({
      id: outcome.record.subscribers[0].id,
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      format: 'in-person',
      subscribedAt: now,
    });
    expect(JSON.stringify(editorView)).not.toContain(token);
  });

  it('updates name and attendance for a duplicate email without a new token', () => {
    const token = createUnsubscribeToken();
    const first = subscribe(emptyRecord(), {
      name: 'Ada',
      email: 'ada@example.com',
      format: 'online',
      token,
      subscribedAt: now,
    }).record;

    const second = subscribe(first, {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      format: 'in-person',
      token: createUnsubscribeToken(),
      subscribedAt: '2026-10-02T12:00:00.000Z',
    });

    expect(second.created).toBe(false);
    expect(second.record.subscribers).toHaveLength(1);
    expect(second.record.subscribers[0]).toMatchObject({
      name: 'Ada Lovelace',
      format: 'in-person',
      token,
      subscribedAt: now,
    });
  });

  it('removes only the person whose token was presented', () => {
    const adaToken = createUnsubscribeToken();
    const graceToken = createUnsubscribeToken();
    let record = emptyRecord();
    record = subscribe(record, {
      name: 'Ada',
      email: 'ada@example.com',
      format: 'online',
      token: adaToken,
      subscribedAt: now,
    }).record;
    record = subscribe(record, {
      name: 'Grace',
      email: 'grace@example.com',
      format: 'in-person',
      token: graceToken,
      subscribedAt: now,
    }).record;

    const removed = removeByToken(record, adaToken);
    expect(removed.removed).toBe(true);
    expect(removed.record.subscribers.map((person) => person.email)).toEqual([
      'grace@example.com',
    ]);
    expect(removeByToken(removed.record, adaToken).removed).toBe(false);
    expect(
      removeByToken(record, 'not-a-real-token-with-enough-length-here').removed,
    ).toBe(false);
  });

  it('lets an editor remove one signup by id', () => {
    const first = subscribe(emptyRecord(), {
      name: 'Ada',
      email: 'ada@example.com',
      format: 'online',
      token: createUnsubscribeToken(),
      subscribedAt: now,
    }).record;
    const removed = removeById(first, first.subscribers[0].id);
    expect(removed.removed).toBe(true);
    expect(removed.record.subscribers).toHaveLength(0);
    expect(removeById(first, 'missing').removed).toBe(false);
  });

  it('stops accepting signups once the list is full', () => {
    const record = emptyRecord();
    record.subscribers = Array.from(
      { length: MAX_SUBSCRIBERS },
      (_, index) => ({
        id: `id-${index}`,
        name: `Person ${index}`,
        email: `person${index}@example.com`,
        format: 'online' as const,
        token: `token-${index}-${'x'.repeat(40)}`,
        subscribedAt: now,
      }),
    );

    expect(() =>
      subscribe(record, {
        name: 'One More',
        email: 'one-more@example.com',
        format: 'online',
        token: createUnsubscribeToken(),
        subscribedAt: now,
      }),
    ).toThrow(BibleStudyCapacityError);
  });

  it('cools down for a minute after a send', () => {
    const record = {
      ...emptyRecord(),
      lastSentAt: '2026-10-01T12:00:00.000Z',
    };
    expect(
      isSendCoolingDown(record, Date.parse('2026-10-01T12:00:30.000Z')),
    ).toBe(true);
    expect(
      isSendCoolingDown(record, Date.parse('2026-10-01T12:01:01.000Z')),
    ).toBe(false);
  });
});
