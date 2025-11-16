// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, prayerRequest } = await req.json();

    if (!name || !prayerRequest) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    await resend.emails.send({
      from: 'Poiema MinistriesWebsite <onboarding@resend.dev>',
      to: 'info@poiemaministries.org',
      subject: `New Prayer Request Submission: ${name}`,
      html: `
        <p>A new prayer request has been submitted.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Prayer Request:</strong></p>
        <p>${prayerRequest}</p>
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
