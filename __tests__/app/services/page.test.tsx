// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Services from '@/app/services/page';

jest.mock('@/app/services/services-client', () => {
  return function MockServicesClient() {
    return <div data-testid='services-client'>Services Client</div>;
  };
});

describe('Services Page', () => {
  it('should render the services page with heading', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Services',
    );
  });

  it('should render the services client', () => {
    render(<Services />);
    expect(screen.getByTestId('services-client')).toBeInTheDocument();
  });
});
