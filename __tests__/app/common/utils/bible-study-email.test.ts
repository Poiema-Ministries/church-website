// Copyright 2026 Poiema Ministries. All Rights Reserved.

import {
  generateBibleStudyEmail,
  generateBibleStudySignupEmail,
} from '@/app/common/utils/email-templates';

describe('Bible Study emails', () => {
  it('escapes the message and includes a private unsubscribe link', () => {
    const html = generateBibleStudyEmail({
      recipientName: 'Ada <script>',
      message: 'Hello <img src=x onerror=alert(1)>',
      meetingLink: 'https://meet.example.com/room?guest=1&pwd=2',
      unsubscribeUrl:
        'https://poiemaministries.org/bible-study/unsubscribe?token=abc',
    });

    expect(html).toContain('Ada &lt;script&gt;');
    expect(html).toContain('Hello &lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain(
      'https://poiemaministries.org/bible-study/unsubscribe?token=abc',
    );
    expect(html).toContain('https://meet.example.com/room?guest=1&amp;pwd=2');
    expect(html).toContain('Unsubscribe from Bible Study emails');
  });

  it('does not include a meeting link in the signup confirmation', () => {
    const html = generateBibleStudySignupEmail({
      recipientName: 'Ada',
      attendanceLabel: 'In person',
      unsubscribeUrl:
        'https://poiemaministries.org/bible-study/unsubscribe?token=abc',
    });

    expect(html).toContain('In person');
    expect(html).not.toContain('Join the virtual meeting');
  });
});
