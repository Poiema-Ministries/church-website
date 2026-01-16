// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import PrayerRequests from '@/app/prayer-requests/page';

// Mock the PrayerRequestsForm component
jest.mock('@/app/prayer-requests/prayer-requests-form', () => {
  return function MockPrayerRequestsForm() {
    return (
      <div data-testid='prayer-requests-form'>Prayer Requests Form</div>
    );
  };
});

describe('Prayer Requests Page', () => {
  it('should render the prayer requests form', () => {
    render(<PrayerRequests />);
    expect(screen.getByTestId('prayer-requests-form')).toBeInTheDocument();
  });
});
