// Copyright 2025 Poiema Ministries. All Rights Reserved.

/**
 * Parses a Sanity date string (YYYY-MM-DD) into a local Date object.
 * Appending the time avoids timezone shifting the day backward.
 */
function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Formats a single date string into a readable format.
 * e.g. "2025-07-15" -> "July 15, 2025"
 */
export function formatEventDate(dateString: string): string {
  return parseDate(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats an event's date for display. When an end date is provided (and
 * differs from the start), it renders a range, collapsing the year when both
 * dates share it.
 *
 * Examples:
 *   ("2026-04-11")                -> "April 11, 2026"
 *   ("2026-04-11", "2026-04-20")  -> "April 11 – April 20, 2026"
 *   ("2025-12-30", "2026-01-02")  -> "December 30, 2025 – January 2, 2026"
 */
export function formatEventDateRange(
  startDateString: string,
  endDateString?: string,
): string {
  if (!endDateString || endDateString === startDateString) {
    return formatEventDate(startDateString);
  }

  const start = parseDate(startDateString);
  const end = parseDate(endDateString);
  const sameYear = start.getFullYear() === end.getFullYear();

  const startFormatted = start.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const endFormatted = end.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `${startFormatted} – ${endFormatted}`;
}
