// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { getSiteUrl } from '@/app/common/utils/env';

/** Human-facing page. GET does not unsubscribe. */
export function unsubscribePageUrl(token: string): string {
  return `${getSiteUrl()}/bible-study/unsubscribe?token=${encodeURIComponent(token)}`;
}

/**
 * One-click endpoint for mailbox providers (RFC 8058). Only POST removes
 * someone. The token is a capability, not an email address.
 */
export function unsubscribeApiUrl(token: string): string {
  return `${getSiteUrl()}/api/bible-study/unsubscribe?token=${encodeURIComponent(token)}`;
}
