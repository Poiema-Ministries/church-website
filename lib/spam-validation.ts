// Copyright 2025 Poiema Ministries. All Rights Reserved.
// Spam validation utilities - layered defense for form submissions.

const MIN_SUBMIT_DELAY_SEC = 4; // Humans need time to read and fill forms
const HONEYPOT_FIELD = 'website'; // Hidden field bots fill; humans leave empty

/**
 * Checks if honeypot field was filled (indicates bot).
 * Bots auto-fill visible and hidden fields; humans don't see honeypot.
 */
export function isHoneypotFilled(data: Record<string, unknown>): boolean {
  const value = data[HONEYPOT_FIELD];
  return value != null && String(value).trim().length > 0;
}

/**
 * Checks if form was submitted too quickly (likely automated).
 * Real users need time to read labels and type.
 */
export function isSubmissionTooFast(formLoadedAt?: number): boolean {
  if (!formLoadedAt || typeof formLoadedAt !== 'number') return false;
  const elapsedSec = (Date.now() - formLoadedAt) / 1000;
  return elapsedSec < MIN_SUBMIT_DELAY_SEC;
}

/**
 * Detects random/algorithmic string patterns common in bot spam.
 * Examples: "svVEJYezYLHgCWoIMOdsf", "bwFVIoWegLPWlfaTkSmYx"
 */
function hasSuspiciousPattern(text: string, minLength: number): boolean {
  if (!text || text.length < minLength) return false;

  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length < minLength) return false;

  // High uppercase ratio with scattered pattern (not Title Case) suggests random
  const upperCount = (letters.match(/[A-Z]/g) || []).length;
  const upperRatio = upperCount / letters.length;
  if (upperRatio > 0.35 && letters.length > 15) return true;

  // Long consecutive consonant sequences (e.g. "YezYLHgC", "WegLPWlf") - rare in real text
  const consonants = 'bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ';
  let maxConsecutive = 0;
  let current = 0;
  for (const c of letters) {
    if (consonants.includes(c)) {
      current++;
      maxConsecutive = Math.max(maxConsecutive, current);
    } else {
      current = 0;
    }
  }
  if (maxConsecutive >= 6) return true;

  return false;
}

/**
 * Validates name fields for spam patterns.
 */
export function isSuspiciousName(firstName: string, lastName: string): boolean {
  const fullName = `${String(firstName || '').trim()} ${String(lastName || '').trim()}`;
  return hasSuspiciousPattern(fullName, 20);
}

/**
 * Validates full name string (e.g. "First Last" from combined field).
 */
export function isSuspiciousFullName(fullName: string): boolean {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/);
  const first = parts[0] || '';
  const last = parts.slice(1).join(' ') || '';
  return isSuspiciousName(first, last);
}

/**
 * Validates message/textarea for spam patterns.
 */
export function isSuspiciousMessage(message: string): boolean {
  const msg = String(message || '').trim();
  // No spaces + moderate length + suspicious pattern = likely spam
  if (msg.length >= 15 && msg.length <= 100 && !/\s/.test(msg)) {
    return hasSuspiciousPattern(msg, 12);
  }
  return hasSuspiciousPattern(msg, 30);
}

export const HONEYPOT_FIELD_NAME = HONEYPOT_FIELD;
