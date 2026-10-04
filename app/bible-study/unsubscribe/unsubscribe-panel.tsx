// Copyright 2026 Poiema Ministries. All Rights Reserved.

'use client';

import { useRef, useState } from 'react';

import Button from '../../common/components/button/button';

type Status = 'idle' | 'working' | 'removed' | 'invalid' | 'error';

export default function UnsubscribePanel({ token }: { token: string | null }) {
  const [status, setStatus] = useState<Status>(token ? 'idle' : 'invalid');
  const [message, setMessage] = useState('');
  const workingRef = useRef(false);

  const unsubscribe = async () => {
    if (
      !token ||
      workingRef.current ||
      status === 'removed' ||
      status === 'invalid'
    ) {
      return;
    }
    workingRef.current = true;
    setStatus('working');
    try {
      const response = await fetch('/api/bible-study/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const removed =
        payload &&
        typeof payload === 'object' &&
        'removed' in payload &&
        payload.removed === true;

      if (!response.ok) {
        setStatus('error');
        setMessage(
          'We could not update your email preference. Please try again in a little while.',
        );
        return;
      }

      if (removed) {
        setStatus('removed');
        return;
      }

      setStatus('invalid');
    } catch {
      setStatus('error');
      setMessage(
        'We are having trouble connecting right now. Please try again.',
      );
    } finally {
      workingRef.current = false;
    }
  };

  return (
    <div className='flex flex-col items-center w-full max-w-xl mx-auto px-4 py-8 text-center'>
      <h1 className='text-2xl sm:text-3xl font-bold underline'>
        Bible Study emails
      </h1>
      {status === 'removed' ? (
        <p className='text-sm font-semibold mt-4 leading-relaxed'>
          You have been removed from the Bible Study email list. We will not
          email you about Bible Study again unless you sign up another time.
        </p>
      ) : status === 'invalid' ? (
        <p className='text-sm font-semibold mt-4 leading-relaxed'>
          This unsubscribe link is no longer valid.
        </p>
      ) : (
        <>
          <p className='text-sm font-semibold mt-4 leading-relaxed'>
            Confirm that you no longer want Bible Study emails from Poiema
            Ministries. This removes your address from the list.
          </p>
          <Button
            label={status === 'working' ? 'Removing…' : 'Unsubscribe'}
            type='button'
            disabled={status === 'working'}
            className='mt-6 cursor-pointer'
            onClick={() => void unsubscribe()}
          />
          {status === 'error' && (
            <p className='text-sm text-red-600 mt-4'>{message}</p>
          )}
        </>
      )}
    </div>
  );
}
