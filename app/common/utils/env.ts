// Copyright 2025 Poiema Ministries. All Rights Reserved.

/**
 * Environment variables utility
 *
 * To use environment variables:
 * 1. Create a .env.local file in the root directory
 * 2. Add the required variables (see .env.example for reference)
 * 3. Access them using the appropriate getter function
 *
 * Note: .env.local is gitignored and should not be committed
 */

export function getResendApiKey(): string {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set in environment variables');
  }

  return apiKey;
}

/**
 * Secret used to encrypt Bible Study signups and the virtual meeting link
 * before they are written to the public Sanity dataset. Must be at least 32
 * characters. Rotating it makes existing signups unreadable.
 */
export function getBibleStudyEncryptionKey(): string {
  const key = process.env.BIBLE_STUDY_ENCRYPTION_KEY?.trim();

  if (!key || key.length < 32) {
    throw new Error(
      'BIBLE_STUDY_ENCRYPTION_KEY must be set to a secret of at least 32 characters.',
    );
  }

  return key;
}

/**
 * Verified From address for Bible Study emails. Resend's onboarding address
 * can only deliver to the Resend account owner, so production should set this
 * to an address on a domain verified in Resend.
 */
export function getResendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    'Poiema Ministries Website <onboarding@resend.dev>'
  );
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  // Local sends must link back to this dev server. The live site does not
  // have these pages until the branch is deployed.
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000';
  return 'https://poiemaministries.org';
}
