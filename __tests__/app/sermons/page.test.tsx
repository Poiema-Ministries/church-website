// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Sermons from '@/app/sermons/page';

// Mock the SermonsClient component
jest.mock('@/app/sermons/sermons-client', () => {
  return function MockSermonsClient() {
    return <div data-testid='sermons-client'>Sermons Client</div>;
  };
});

describe('Sermons Page', () => {
  it('should render the sermons page with heading', () => {
    render(<Sermons />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Sermons',
    );
  });

  it('should render the sermons client component', () => {
    render(<Sermons />);
    expect(screen.getByTestId('sermons-client')).toBeInTheDocument();
  });
});
