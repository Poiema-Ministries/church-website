// Copyright 2026 Poiema Ministries. All Rights Reserved.

'use client';

import { useSearchParams } from 'next/navigation';

import UnsubscribePanel from './unsubscribe-panel';

export default function UnsubscribeToken() {
  const params = useSearchParams();
  return <UnsubscribePanel token={params.get('token')} />;
}
