// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';

import BibleStudyPage from '@/app/bible-study/page';
import { isBibleStudyPublic } from '@/lib/bible-study/visibility';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

jest.mock('@/lib/bible-study/visibility', () => ({
  isBibleStudyPublic: jest.fn(),
}));

jest.mock('@/app/bible-study/bible-study-form', () => {
  return function MockBibleStudyForm() {
    return <div data-testid='bible-study-form'>Bible Study Form</div>;
  };
});

const mockIsBibleStudyPublic = jest.mocked(isBibleStudyPublic);

describe('Bible Study page', () => {
  it('should render the signup form when the page is public', async () => {
    mockIsBibleStudyPublic.mockResolvedValue(true);
    render(await BibleStudyPage());
    expect(screen.getByTestId('bible-study-form')).toBeInTheDocument();
  });

  it('hides the page when the Studio flag is off', async () => {
    mockIsBibleStudyPublic.mockResolvedValue(false);
    await expect(BibleStudyPage()).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
