// Copyright 2026 Poiema Ministries. All Rights Reserved.

'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Flex,
  Label,
  Spinner,
  Stack,
  Text,
  TextArea,
  TextInput,
} from '@sanity/ui';
import { type StringInputProps, useClient } from 'sanity';

import { apiVersion } from '../env';
import {
  ATTENDANCE_LABELS,
  type BibleStudyEditorView,
} from '../../lib/bible-study/types';

type EditorState = BibleStudyEditorView;

const EMPTY: EditorState = {
  emailSubject: '',
  emailMessage: '',
  meetingLink: '',
  lastSentAt: null,
  subscribers: [],
};

export function BibleStudyInput(props: StringInputProps) {
  void props;
  const client = useClient({ apiVersion });
  const token = client.config().token ?? '';
  const [record, setRecord] = useState<EditorState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirmingSend, setConfirmingSend] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError(
        'Sign in to Studio again to manage Bible Study. This session did not include an editor token.',
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const next = await editorFetch<EditorState>(
        '/api/bible-study/admin',
        token,
      );
      setRecord(next);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Bible Study could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const save = async () => {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const next = await editorFetch<EditorState>(
        '/api/bible-study/admin',
        token,
        {
          method: 'PUT',
          body: JSON.stringify(settingsPayload(record)),
        },
      );
      setRecord(next);
      setStatus('Saved. The meeting link and message are ready to send.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  const send = async () => {
    setBusy(true);
    setError(null);
    setStatus(null);
    setConfirmingSend(false);
    try {
      const result = await editorFetch<{ sent: number; failed: string[] }>(
        '/api/bible-study/send',
        token,
        {
          method: 'POST',
          body: JSON.stringify(settingsPayload(record)),
        },
      );
      const failedNote =
        result.failed.length > 0
          ? ` ${result.failed.length} could not be sent (${result.failed.join(', ')}). Sending again emails the whole list, including people who already received it.`
          : '';
      setStatus(
        `Sent to ${result.sent} ${result.sent === 1 ? 'person' : 'people'}.${failedNote}`,
      );
      await load();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Send failed.');
    } finally {
      setBusy(false);
    }
  };

  const removeSubscriber = async (subscriberId: string) => {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const next = await editorFetch<EditorState>(
        `/api/bible-study/admin?subscriberId=${encodeURIComponent(subscriberId)}`,
        token,
        { method: 'DELETE' },
      );
      setRecord(next);
      setStatus('Removed from the email list.');
    } catch (removeError) {
      setError(
        removeError instanceof Error ? removeError.message : 'Remove failed.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Flex align='center' gap={3} padding={4}>
        <Spinner muted />
        <Text muted>Loading Bible Study…</Text>
      </Flex>
    );
  }

  return (
    <Stack space={5} padding={4}>
      <Stack space={3}>
        <Text size={2} weight='semibold'>
          Bible Study email
        </Text>
        <Text size={1} muted>
          Write the note and paste the virtual meeting link. Send delivers a
          separate email to each person who signed up, with a private
          unsubscribe link. Names, emails, and the meeting link are encrypted in
          Sanity.
        </Text>
      </Stack>

      {error && (
        <Card padding={3} radius={2} tone='critical'>
          <Text size={1}>{error}</Text>
        </Card>
      )}
      {status && (
        <Card padding={3} radius={2} tone='positive'>
          <Text size={1}>{status}</Text>
        </Card>
      )}

      <Stack space={3}>
        <Label>Email subject</Label>
        <TextInput
          value={record.emailSubject}
          placeholder='Bible Study this week'
          onChange={(event) => {
            const emailSubject = event.currentTarget.value;
            setRecord((current) => ({ ...current, emailSubject }));
          }}
        />
      </Stack>

      <Stack space={3}>
        <Label>Email message</Label>
        <TextArea
          rows={10}
          value={record.emailMessage}
          placeholder='Write the note everyone should receive. Line breaks are kept.'
          onChange={(event) => {
            const emailMessage = event.currentTarget.value;
            setRecord((current) => ({ ...current, emailMessage }));
          }}
        />
      </Stack>

      <Stack space={3}>
        <Label>Virtual meeting link</Label>
        <TextInput
          value={record.meetingLink}
          placeholder='https://'
          onChange={(event) => {
            const meetingLink = event.currentTarget.value;
            setRecord((current) => ({ ...current, meetingLink }));
          }}
        />
        <Text size={1} muted>
          Update this whenever the link changes. It is included only when you
          send, not on the public signup page.
        </Text>
      </Stack>

      <Flex gap={3}>
        <Button
          text='Save'
          tone='primary'
          disabled={busy || !token}
          onClick={() => void save()}
        />
        <Button
          text={`Send to ${record.subscribers.length} ${record.subscribers.length === 1 ? 'person' : 'people'}`}
          tone='positive'
          disabled={busy || !token || record.subscribers.length === 0}
          onClick={() => setConfirmingSend(true)}
        />
      </Flex>

      {confirmingSend && (
        <Card padding={3} radius={2} border>
          <Stack space={3}>
            <Text size={1}>
              Send this email to {record.subscribers.length}{' '}
              {record.subscribers.length === 1 ? 'person' : 'people'}? Each
              message includes the meeting link and a private unsubscribe link.
              People are not copied on one shared email.
            </Text>
            <Flex gap={3}>
              <Button
                text='Send now'
                tone='positive'
                disabled={busy}
                onClick={() => void send()}
              />
              <Button
                text='Cancel'
                mode='ghost'
                disabled={busy}
                onClick={() => setConfirmingSend(false)}
              />
            </Flex>
          </Stack>
        </Card>
      )}

      {record.lastSentAt && (
        <Text size={1} muted>
          Last sent {new Date(record.lastSentAt).toLocaleString()}.
        </Text>
      )}

      <Stack space={3}>
        <Text size={2} weight='semibold'>
          Signed up ({record.subscribers.length})
        </Text>
        {record.subscribers.length === 0 ? (
          <Text size={1} muted>
            No one has signed up yet.
          </Text>
        ) : (
          record.subscribers.map((subscriber) => (
            <Card key={subscriber.id} padding={3} radius={2} border>
              <Flex align='center' justify='space-between' gap={3}>
                <Stack space={2}>
                  <Text weight='semibold'>{subscriber.name}</Text>
                  <Text size={1} muted>
                    {subscriber.email}
                  </Text>
                  <Text size={1}>
                    {ATTENDANCE_LABELS[subscriber.format]} ·{' '}
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </Text>
                </Stack>
                <Button
                  text='Remove'
                  mode='bleed'
                  tone='critical'
                  disabled={busy}
                  onClick={() => void removeSubscriber(subscriber.id)}
                />
              </Flex>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
}

function settingsPayload(record: EditorState) {
  return {
    emailSubject: record.emailSubject,
    emailMessage: record.emailMessage,
    meetingLink: record.meetingLink,
  };
}

async function editorFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload &&
      typeof payload === 'object' &&
      'error' in payload &&
      typeof payload.error === 'string'
        ? payload.error
        : 'Request failed.';
    throw new Error(message);
  }
  return payload as T;
}
