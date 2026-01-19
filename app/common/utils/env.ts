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
