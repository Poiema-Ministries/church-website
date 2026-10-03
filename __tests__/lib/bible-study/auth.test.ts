// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { verifyBibleStudyEditor } from '@/lib/bible-study/auth';
import { BibleStudyAuthError } from '@/lib/bible-study/errors';

function jsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe('Bible Study editor auth', () => {
  const sessionToken = 'a'.repeat(40);

  it('accepts any signed-in project member, including viewers', async () => {
    const fetchImpl = jest.fn(async () =>
      jsonResponse({
        id: 'p1',
        email: 'pastor@poiemaministries.org',
        role: 'Editor',
      }),
    );

    await expect(
      verifyBibleStudyEditor({
        token: sessionToken,
        projectId: 'project',
        apiVersion: '2025-11-15',
        fetchImpl,
      }),
    ).resolves.toEqual({
      id: 'p1',
      email: 'pastor@poiemaministries.org',
      role: 'editor',
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://project.api.sanity.io/v2025-11-15/users/me',
      expect.objectContaining({
        headers: { Authorization: `Bearer ${sessionToken}` },
      }),
    );

    await expect(
      verifyBibleStudyEditor({
        token: `sk${'b'.repeat(40)}`,
        projectId: 'project',
        apiVersion: '2025-11-15',
        fetchImpl: jest.fn(async () =>
          jsonResponse({ id: 'p2', role: 'viewer' }),
        ),
      }),
    ).resolves.toEqual({ id: 'p2', email: '', role: 'viewer' });

    await expect(
      verifyBibleStudyEditor({
        token: sessionToken,
        projectId: 'project',
        apiVersion: '2025-11-15',
        fetchImpl: jest.fn(async () => jsonResponse({}, false)),
      }),
    ).rejects.toBeInstanceOf(BibleStudyAuthError);
  });
});
