// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('NotFound Page', () => {
  it('should render 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
  });

  it('should render "Page Not Found" heading', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Page Not Found',
    );
  });

  it('should display the Bible verse', () => {
    render(<NotFound />);
    expect(
      screen.getByText(
        /"I am the way, and the truth, and the life. No one comes to the Father except through me."/,
      ),
    ).toBeInTheDocument();
  });

  it('should display the verse reference', () => {
    render(<NotFound />);
    expect(screen.getByText('- John 14:6')).toBeInTheDocument();
  });

  it('should have a link to return home', () => {
    render(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /Return Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should display helpful message to users', () => {
    render(<NotFound />);
    expect(
      screen.getByText(
        /It looks like you've taken a wrong turn. But don't worry - even when we're lost, God knows exactly where we are./,
      ),
    ).toBeInTheDocument();
  });
});
