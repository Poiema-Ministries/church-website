// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';

import BibleStudyPage from '@/app/bible-study/page';

jest.mock('@/app/bible-study/bible-study-form', () => {
  return function MockBibleStudyForm() {
    return <div data-testid='bible-study-form'>Bible Study Form</div>;
  };
});

describe('Bible Study page', () => {
  it('should render the signup form', () => {
    render(<BibleStudyPage />);
    expect(screen.getByTestId('bible-study-form')).toBeInTheDocument();
  });
});
