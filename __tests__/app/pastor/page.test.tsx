// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Pastor from '@/app/pastor/page';

describe('Pastor Page', () => {
  it('should render the pastor page with heading', () => {
    render(<Pastor />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Meet Our Pastor',
    );
  });

  it('should display pastor name', () => {
    render(<Pastor />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Pastor Sam Jung',
    );
  });

  it('should display pastor description paragraphs', () => {
    render(<Pastor />);
    expect(
      screen.getByText(/Pastor Sam was born in Korea and came to the US/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /This God-given passion led him to serve the young generation/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/He loves mission and has joined KPCB DR/),
    ).toBeInTheDocument();
  });

  it('should display pastor image with correct alt text', () => {
    render(<Pastor />);
    const image = screen.getByAltText('Pastor Sam Jung');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });
});
