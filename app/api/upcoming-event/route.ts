// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateUpcomingEventEmail } from '@/app/common/utils/email-templates';
import {
  isHoneypotFilled,
  isSubmissionTooFast,
  isSuspiciousMessage,
} from '@/lib/spam-validation';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Checks if the registration deadline has passed for the given event.
 * Returns true if the deadline is still open, false if it has passed.
 */
async function isRegistrationOpen(eventId: string): Promise<boolean> {
  const event = await client.fetch(
    groq`*[_type == "upcomingEvent" && _id == $eventId][0] { registrationDeadline }`,
    { eventId },
  );

  if (!event || !event.registrationDeadline) {
    return false;
  }

  const deadlineEnd = new Date(event.registrationDeadline + 'T23:59:59');
  return new Date() <= deadlineEnd;
}

export async function POST(req: Request) {
  try {
    const requestData = await req.json();

    if (!requestData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Spam checks
    if (isHoneypotFilled(requestData)) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 },
      );
    }
    if (isSubmissionTooFast(requestData.formLoadedAt)) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 },
      );
    }

    const { eventTitle, eventId, fields } = requestData;

    if (!eventTitle || !eventId || !fields || typeof fields !== 'object') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Server-side deadline verification - prevents submissions even if
    // client-side checks are bypassed
    const registrationOpen = await isRegistrationOpen(eventId);
    if (!registrationOpen) {
      return NextResponse.json(
        { error: 'Registration for this event has closed' },
        { status: 403 },
      );
    }

    // Validate that all fields have values
    const fieldEntries = Object.entries(fields) as [string, string][];
    if (fieldEntries.length === 0) {
      return NextResponse.json(
        { error: 'No form fields provided' },
        { status: 400 },
      );
    }

    for (const [label, value] of fieldEntries) {
      if (!value || String(value).trim().length === 0) {
        return NextResponse.json(
          { error: `${label} is required` },
          { status: 400 },
        );
      }
    }

    // Check field values for spam patterns
    for (const [, value] of fieldEntries) {
      if (isSuspiciousMessage(String(value))) {
        return NextResponse.json(
          { error: 'Invalid submission' },
          { status: 400 },
        );
      }
    }

    const html = generateUpcomingEventEmail({
      eventTitle,
      fields,
    });

    await resend.emails.send({
      from: 'Poiema Ministries Website <onboarding@resend.dev>',
      to: 'info@poiemaministries.org',
      subject: `Event Registration: ${eventTitle}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send email';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
