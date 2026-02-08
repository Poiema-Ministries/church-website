// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateNewMemberEmail } from '@/app/common/utils/email-templates';
import {
  isHoneypotFilled,
  isSubmissionTooFast,
  isSuspiciousName,
  isSuspiciousMessage,
} from '@/lib/spam-validation';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }
    if (isSubmissionTooFast(requestData.formLoadedAt)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      ageGroup,
      occupation,
      attendedOtherChurches,
      otherChurches,
      howDidYouHearAboutUs,
      message,
    } = requestData;

    if (
      isSuspiciousName(firstName, lastName) ||
      isSuspiciousMessage(message || '')
    ) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const html = generateNewMemberEmail({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      ageGroup,
      occupation,
      attendedOtherChurches,
      otherChurches,
      howDidYouHearAboutUs,
      message,
    });

    await resend.emails.send({
      from: 'Poiema Ministries Website <onboarding@resend.dev>',
      to: 'info@poiemaministries.org',
      subject: `New Member Submission: ${firstName} ${lastName}`,
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
