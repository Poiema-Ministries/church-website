// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    await resend.emails.send({
      from: 'Poiema MinistriesWebsite <onboarding@resend.dev>',
      to: 'info@poiemaministries.org',
      subject: `Contact Us Submission: ${requestData.firstName} ${requestData.lastName}`,
      html: `
        <p>A contact us submission has been submitted.</p>
        <p><strong>Name:</strong> ${requestData.firstName} ${requestData.lastName}</p>
        <p><strong>Email:</strong> ${requestData.email}</p>
        <p><strong>Age Group:</strong> ${requestData.ageGroup}</p>
        <p><strong>Message:</strong> ${requestData.message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? 'Failed to send email' },
      { status: 500 },
    );
  }
}
