// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Services from '@/app/services/page';

describe('Services Page', () => {
  it('should render the services page with heading', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Services',
    );
  });

  it('should display first service information', () => {
    render(<Services />);
    expect(screen.getByText('First Service - 9:30AM')).toBeInTheDocument();
  });

  it('should display second service information', () => {
    render(<Services />);
    expect(screen.getByText('Second Service - 11:30AM')).toBeInTheDocument();
  });

  it('should display service descriptions', () => {
    render(<Services />);
    expect(
      screen.getByText(/For those who can not make our 11:30AM service/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Our Sunday services are a reflection of the daily offerings/,
      ),
    ).toBeInTheDocument();
  });

  it('should display "Join Us" section', () => {
    render(<Services />);
    expect(screen.getByText('Join Us')).toBeInTheDocument();
  });

  it('should display address information', () => {
    render(<Services />);
    expect(screen.getByText(/45-60 211th Street/)).toBeInTheDocument();
    expect(screen.getByText(/Bayside, NY 11358/)).toBeInTheDocument();
  });

  it('should have a map iframe', () => {
    render(<Services />);
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src');
  });
});
