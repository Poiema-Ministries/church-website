// Copyright 2025 Poiema Ministries. All Rights Reserved.

/**
 * Email template utilities for Poiema Ministries
 */

// Constants
const LOGO_URL =
  'https://res.cloudinary.com/dsq4ghebf/image/upload/v1763399191/logo_k9pyno.png';

const EMAIL_STYLES = {
  body: 'margin:0; padding:0; background:#f9f4ee; font-family: Georgia, serif; color:#3a2f2a;',
  container: 'max-width:650px; margin:0 auto; padding:40px 24px;',
  logo: 'text-align:center; margin-bottom:32px;',
  logoImg: 'width:160px; opacity:0.95;',
  title:
    'font-size:32px; font-weight:600; text-align:center; margin-bottom:24px; color:#3b2f2a;',
  divider: 'border:none; border-top:1px solid #e4d8c9; margin:24px 0;',
  intro: 'font-size:18px; line-height:1.6;',
  card: 'background:white; border:1px solid #ecdcc7; border-radius:12px; padding:24px; margin-top:24px;',
  field: 'font-size:20px; margin:16px 0 12px;',
  fieldFirst: 'font-size:20px; margin:0 0 12px;',
  fieldLabel: 'font-size:20px; margin:24px 0 6px;',
  content: 'font-size:18px; line-height:1.6; white-space:pre-wrap;',
  footer:
    'font-size:14px; color:#6e625b; margin-top:32px; line-height:1.5; text-align:center;',
};

interface EmailTemplateData {
  title: string;
  introText: string;
  content: string;
  logoUrl?: string;
  footerHtml?: string;
}

/**
 * Base email template function
 */
function generateEmailTemplate({
  title,
  introText,
  content,
  logoUrl = LOGO_URL,
  footerHtml,
}: EmailTemplateData): string {
  const footer =
    footerHtml ??
    `<p style="${EMAIL_STYLES.footer}">
        This email was sent automatically from the Poiema Ministries website.
        If you believe this was a mistake, please contact your site administrator.
      </p>`;
  return `
<!DOCTYPE html>
<html>
  <body style="${EMAIL_STYLES.body}">
    <div style="${EMAIL_STYLES.container}">

      <!-- Logo -->
      <div style="${EMAIL_STYLES.logo}">
        <img src="${logoUrl}" alt="Poiema Ministries" style="${EMAIL_STYLES.logoImg}" />
      </div>

      <!-- Title -->
      <h1 style="${EMAIL_STYLES.title}">
        ${title}
      </h1>

      <hr style="${EMAIL_STYLES.divider}" />

      <!-- Intro text -->
      <p style="${EMAIL_STYLES.intro}">
        ${introText}
      </p>

      <!-- Card Box -->
      <div style="${EMAIL_STYLES.card}">
        ${content}
      </div>

      <!-- Footer -->
      ${footer}

    </div>
  </body>
</html>
`;
}

/**
 * Generate contact form submission email
 */
export function generateContactUsEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  ageGroup: string;
  message: string;
}): string {
  const content = `
        <p style="${EMAIL_STYLES.fieldFirst}">
          <strong>Name:</strong><br/>
          ${data.firstName} ${data.lastName}
        </p>

        <p style="${EMAIL_STYLES.field}">
          <strong>Email:</strong><br/>
          ${data.email}
        </p>

        <p style="${EMAIL_STYLES.field}">
          <strong>Age Group:</strong><br/>
          ${data.ageGroup}
        </p>

        <p style="${EMAIL_STYLES.field}">
          <strong>Message:</strong>
        </p>
        <p style="${EMAIL_STYLES.content}">
          ${data.message}
        </p>
  `;

  return generateEmailTemplate({
    title: 'New Contact Submission',
    introText:
      'A new contact form submission has been received through the Poiema Ministries website. Below are the details:',
    content,
  });
}

/**
 * Generate new member registration email
 */
export function generateNewMemberEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  ageGroup: string;
  occupation: string;
  attendedOtherChurches: string;
  otherChurches?: string;
  howDidYouHearAboutUs: string;
  message?: string;
}): string {
  const content = `
        <p style="${EMAIL_STYLES.fieldFirst}"><strong>Name:</strong><br/>${data.firstName} ${data.lastName}</p>

        <p style="${EMAIL_STYLES.field}"><strong>Email:</strong><br/>${data.email}</p>

        <p style="${EMAIL_STYLES.field}"><strong>Phone:</strong><br/>${data.phoneNumber}</p>

        <p style="${EMAIL_STYLES.field}"><strong>Address:</strong><br/>${data.address}</p>

        <p style="${EMAIL_STYLES.field}"><strong>City:</strong><br/>${data.city}</p>

        <p style="${EMAIL_STYLES.field}"><strong>State:</strong><br/>${data.state}</p>

        <p style="${EMAIL_STYLES.field}"><strong>Zip Code:</strong><br/>${data.zipCode}</p>

        <p style="${EMAIL_STYLES.field}"><strong>Age Group:</strong><br/>${data.ageGroup}</p>

        <p style="${EMAIL_STYLES.field}"><strong>Occupation:</strong><br/>${data.occupation}</p>

        <p style="${EMAIL_STYLES.field}">
          <strong>Attended Other Churches Before?</strong><br/>${data.attendedOtherChurches}
        </p>

        <p style="${EMAIL_STYLES.field}">
          <strong>If Yes, Where?</strong><br/>${data.otherChurches || 'N/A'}
        </p>

        <p style="${EMAIL_STYLES.field}">
          <strong>How Did You Hear About Us?</strong><br/>${data.howDidYouHearAboutUs}
        </p>

        <p style="${EMAIL_STYLES.field}">
          <strong>Message:</strong>
        </p>
        <p style="${EMAIL_STYLES.content}">
          ${data.message || 'N/A'}
        </p>
  `;

  return generateEmailTemplate({
    title: 'New Member Registration',
    introText:
      'A new member registration form has been submitted through the Poiema Ministries website. Below are the details:',
    content,
  });
}

/**
 * Generate upcoming event registration email
 */
export function generateUpcomingEventEmail(data: {
  eventTitle: string;
  fields: Record<string, string>;
}): string {
  const fieldEntries = Object.entries(data.fields);

  const fieldsHtml = fieldEntries
    .map(([label, value], index) => {
      const style = index === 0 ? EMAIL_STYLES.fieldFirst : EMAIL_STYLES.field;
      return `
        <p style="${style}">
          <strong>${label}:</strong><br/>
          <span style="${EMAIL_STYLES.content}">${value}</span>
        </p>
      `;
    })
    .join('');

  return generateEmailTemplate({
    title: `Event Registration: ${data.eventTitle}`,
    introText: `A new registration has been submitted for <strong>${data.eventTitle}</strong> through the Poiema Ministries website. Below are the details:`,
    content: fieldsHtml,
  });
}

/**
 * Generate prayer request email
 */
export function generatePrayerRequestEmail(data: {
  name: string;
  prayerRequest: string;
}): string {
  const content = `
        <p style="${EMAIL_STYLES.fieldFirst}"><strong>Name:</strong><br/>${data.name}</p>
        
        <p style="${EMAIL_STYLES.fieldLabel}"><strong>Prayer Request:</strong></p>
        <p style="${EMAIL_STYLES.content}">
          ${data.prayerRequest}
        </p>
  `;

  return generateEmailTemplate({
    title: 'New Prayer Request',
    introText:
      'A new prayer request has been submitted through the Poiema Ministries website. Below are the details:',
    content,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function bibleStudyFooter(unsubscribeUrl: string): string {
  const href = escapeHtml(unsubscribeUrl);
  return `
      <p style="${EMAIL_STYLES.footer}">
        You are receiving this because you signed up for Bible Study with Poiema Ministries.
        <br/><br/>
        <a href="${href}" style="color:#6e625b;">Unsubscribe from Bible Study emails</a>
      </p>
  `;
}

/**
 * Confirmation sent once, when someone first joins the list.
 * The meeting link is intentionally omitted — it is only included when an
 * editor sends the study email.
 */
export function generateBibleStudySignupEmail(data: {
  recipientName: string;
  attendanceLabel: string;
  unsubscribeUrl: string;
}): string {
  const content = `
        <p style="${EMAIL_STYLES.fieldFirst}">
          Hello ${escapeHtml(data.recipientName)},
        </p>
        <p style="${EMAIL_STYLES.content}">
          You are signed up for Bible Study with Poiema Ministries and plan to join ${escapeHtml(data.attendanceLabel)}.
          We will email you when there is a study, including how to join online.
        </p>
  `;

  return generateEmailTemplate({
    title: 'Bible Study signup',
    introText: 'Thank you for signing up.',
    content,
    footerHtml: bibleStudyFooter(data.unsubscribeUrl),
  });
}

/**
 * The editor's message, sent individually so each person gets their own
 * unsubscribe link and nobody sees the rest of the list.
 */
export function generateBibleStudyEmail(data: {
  recipientName: string;
  message: string;
  meetingLink: string;
  unsubscribeUrl: string;
}): string {
  const meetingHref = escapeHtml(data.meetingLink);
  const content = `
        <p style="${EMAIL_STYLES.fieldFirst}">
          Hello ${escapeHtml(data.recipientName)},
        </p>
        <p style="${EMAIL_STYLES.content}">
          ${escapeHtml(data.message)}
        </p>
        <p style="text-align:center; margin:28px 0 8px;">
          <a href="${meetingHref}" style="display:inline-block; background:#3b2f2a; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:8px; font-size:16px;">
            Join the virtual meeting
          </a>
        </p>
        <p style="font-size:14px; line-height:1.5; word-break:break-all; text-align:center;">
          <a href="${meetingHref}" style="color:#3b2f2a;">${meetingHref}</a>
        </p>
  `;

  return generateEmailTemplate({
    title: 'Bible Study',
    introText: 'A note from Poiema Ministries:',
    content,
    footerHtml: bibleStudyFooter(data.unsubscribeUrl),
  });
}
