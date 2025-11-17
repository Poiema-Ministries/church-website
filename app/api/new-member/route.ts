// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateNewMemberEmail } from '@/app/common/utils/email-templates';

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
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: error.message ?? 'Failed to send email' },
      { status: 500 },
    );
  }
}
