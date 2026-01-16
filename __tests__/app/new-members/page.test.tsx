// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import NewMembers from '@/app/new-members/page';

// Mock the NewMembersForm component
jest.mock('@/app/new-members/new-members-form', () => {
  return function MockNewMembersForm() {
    return <div data-testid='new-members-form'>New Members Form</div>;
  };
});

describe('New Members Page', () => {
  it('should render the new members form', () => {
    render(<NewMembers />);
    expect(screen.getByTestId('new-members-form')).toBeInTheDocument();
  });
});
