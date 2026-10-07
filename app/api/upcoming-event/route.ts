// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateUpcomingEventEmail } from '@/app/common/utils/email-templates';
import {
  isHoneypotFilled,
  isSubmissionTooFast,
  isSuspiciousMessage,
} from '@/lib/spam-validation';
import {
  appendEventRegistration,
  isGoogleSheetsConfigured,
} from '@/lib/google-sheets';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EventFieldDefinition {
  label: string;
  inputType: 'text' | 'phone' | 'textarea' | 'dropdown' | 'checkbox';
  dropdownOptions?: string[];
  checkboxOptions?: string[];
}

interface EventValidationData {
  title?: string;
  registrationDeadline?: string;
  fields?: EventFieldDefinition[];
  googleSheetId?: string;
}

async function getEventForValidation(
  eventId: string,
): Promise<EventValidationData | null> {
  return client.fetch(
    groq`*[_type == "upcomingEvent" && _id == $eventId][0] {
      title,
      registrationDeadline,
      googleSheetId,
      fields[] {
        label,
        inputType,
        dropdownOptions,
        checkboxOptions
      }
    }`,
    { eventId },
  );
}

function isRegistrationOpen(registrationDeadline?: string): boolean {
  if (!registrationDeadline) {
    return false;
  }
  const deadlineEnd = new Date(registrationDeadline + 'T23:59:59');
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

    const event = await getEventForValidation(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (!isRegistrationOpen(event.registrationDeadline)) {
      return NextResponse.json(
        { error: 'Registration for this event has closed' },
        { status: 403 },
      );
    }

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

    const fieldDefsByLabel = new Map(
      (event.fields ?? []).map((field) => [field.label, field]),
    );

    for (const [label, value] of fieldEntries) {
      const stringValue = String(value);
      const definition = fieldDefsByLabel.get(label);

      if (definition?.inputType === 'dropdown') {
        const allowed = definition.dropdownOptions ?? [];
        if (!allowed.includes(stringValue.trim())) {
          return NextResponse.json(
            { error: 'Invalid submission' },
            { status: 400 },
          );
        }
        continue;
      }

      if (definition?.inputType === 'checkbox') {
        const allowed = definition.checkboxOptions ?? [];
        const selected = stringValue
          .split(',')
          .map((option) => option.trim())
          .filter(Boolean);
        const allValid =
          selected.length > 0 &&
          selected.every((option) => allowed.includes(option));
        if (!allValid) {
          return NextResponse.json(
            { error: 'Invalid submission' },
            { status: 400 },
          );
        }
        continue;
      }

      if (isSuspiciousMessage(stringValue)) {
        return NextResponse.json(
          { error: 'Invalid submission' },
          { status: 400 },
        );
      }
    }

    if (isGoogleSheetsConfigured()) {
      const fieldLabels = (event.fields ?? []).map((field) => field.label);
      await appendEventRegistration({
        eventId,
        eventTitle: event.title || eventTitle,
        googleSheetId: event.googleSheetId,
        fieldLabels,
        fields,
      });
    } else {
      console.warn(
        'Google Sheets credentials are not configured; skipping sheet write',
      );
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
    console.error('Upcoming event registration error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to process registration';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
