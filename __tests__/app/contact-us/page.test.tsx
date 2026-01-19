// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import ContactUs from '@/app/contact-us/page';

// Mock the ContactUsForm component
jest.mock('@/app/contact-us/contact-us-form', () => {
  return function MockContactUsForm() {
    return <div data-testid='contact-us-form'>Contact Us Form</div>;
  };
});

describe('Contact Us Page', () => {
  it('should render the contact us form', () => {
    render(<ContactUs />);
    expect(screen.getByTestId('contact-us-form')).toBeInTheDocument();
  });
});
