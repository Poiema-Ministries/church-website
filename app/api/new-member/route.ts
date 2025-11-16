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
      subject: `New Member Submission: ${requestData.firstName} ${requestData.lastName}`,
      html: `
        <p>A new member has been submitted.</p>
        <p><strong>Name:</strong> ${requestData.firstName} ${requestData.lastName}</p>
        <p><strong>Email:</strong> ${requestData.email}</p>
        <p><strong>Phone:</strong> ${requestData.phoneNumber}</p>
        <p><strong>Address:</strong> ${requestData.address}</p>
        <p><strong>City:</strong> ${requestData.city}</p>
        <p><strong>State:</strong> ${requestData.state}</p>
        <p><strong>Zip Code:</strong> ${requestData.zipCode}</p>
        <p><strong>Age Group:</strong> ${requestData.ageGroup}</p>
        <p><strong>Occupation:</strong> ${requestData.occupation}</p>
        <p><strong>Have you attended other churches before our church?</strong> ${requestData.attendedOtherChurches}</p>
        <p><strong>If yes, where did you attend?</strong> ${requestData.otherChurches || 'N/A'}</p>
        <p><strong>How did you hear about our church?</strong> ${requestData.howDidYouHearAboutUs}</p>
        <p><strong>Message:</strong> ${requestData?.message || 'N/A'}</p>
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