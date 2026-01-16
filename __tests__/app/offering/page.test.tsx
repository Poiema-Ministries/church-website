// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Offering from '@/app/offering/page';

describe('Offering Page', () => {
  it('should render the offering page with heading', () => {
    render(<Offering />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Online Offering',
    );
  });

  it('should display the subtitle', () => {
    render(<Offering />);
    expect(
      screen.getByText('Your generosity helps us serve our community.'),
    ).toBeInTheDocument();
  });

  it('should have a "Give Now" link', () => {
    render(<Offering />);
    const giveLink = screen.getByRole('link', { name: /Give Now/i });
    expect(giveLink).toBeInTheDocument();
    expect(giveLink).toHaveAttribute('href');
    expect(giveLink).toHaveAttribute('target', '_blank');
  });

  it('should display "Why We Give?" section', () => {
    render(<Offering />);
    expect(screen.getByText('Why We Give?')).toBeInTheDocument();
  });

  it('should display the giving description with Bible verse', () => {
    render(<Offering />);
    expect(
      screen.getByText(/Tithing is an act of worship and an expression of our gratitude to God/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/God loves a cheerful giver./),
    ).toBeInTheDocument();
  });

  it('should display offering banner image', () => {
    render(<Offering />);
    const image = screen.getByAltText('Offering');
    expect(image).toBeInTheDocument();
  });
});
