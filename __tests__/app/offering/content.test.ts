// Copyright 2026 Poiema Ministries. All Rights Reserved.

import {
  DEFAULT_GIVE_NOW_URL,
  DEFAULT_OFFERING_LABEL,
  DEFAULT_WHY_WE_GIVE,
  toOfferingContent,
} from '@/app/offering/content';

describe('toOfferingContent', () => {
  it('uses the published label, link, and description', () => {
    expect(
      toOfferingContent({
        label: '  Give with joy  ',
        giveNowUrl: '  https://example.org/give  ',
        whyWeGive: '  We give because God first gave.  ',
      }),
    ).toEqual({
      label: 'Give with joy',
      giveNowUrl: 'https://example.org/give',
      whyWeGive: 'We give because God first gave.',
    });
  });

  it('falls back to the current page copy when a field is missing', () => {
    expect(toOfferingContent(null)).toEqual({
      label: DEFAULT_OFFERING_LABEL,
      giveNowUrl: DEFAULT_GIVE_NOW_URL,
      whyWeGive: DEFAULT_WHY_WE_GIVE,
    });
  });

  it('ignores a Give Now link that is not an http address', () => {
    expect(
      toOfferingContent({
        giveNowUrl: 'javascript:alert(1)',
      }).giveNowUrl,
    ).toBe(DEFAULT_GIVE_NOW_URL);
  });
});
