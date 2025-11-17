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
}

/**
 * Base email template function
 */
function generateEmailTemplate({
  title,
  introText,
  content,
  logoUrl = LOGO_URL,
}: EmailTemplateData): string {
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
      <p style="${EMAIL_STYLES.footer}">
        This email was sent automatically from the Poiema Ministries website.
        If you believe this was a mistake, please contact your site administrator.
      </p>

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
