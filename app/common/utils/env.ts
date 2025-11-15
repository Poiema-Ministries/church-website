// Copyright 2025 Poiema Ministries. All Rights Reserved.

/**
 * Environment variables utility
 *
 * To use RESEND_API_KEY:
 * 1. Create a .env.local file in the root directory
 * 2. Add: RESEND_API_KEY=your_api_key_here
 * 3. Access it using: getResendApiKey()
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
