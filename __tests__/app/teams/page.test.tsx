// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Teams from '@/app/teams/page';
import { client } from '@/sanity/lib/client';

// Mock next-sanity
jest.mock('next-sanity', () => ({
  groq: (strings: TemplateStringsArray, ...values: unknown[]) => {
    return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  },
  createClient: jest.fn(),
}));

// Mock the Sanity client
jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}));

// Mock the TeamMemberItem component
jest.mock('@/app/teams/team-member-item', () => {
  return function MockTeamMemberItem({
    teamMember,
  }: {
    teamMember: { _id: string };
  }) {
    return <div data-testid={`team-member-${teamMember._id}`}>Team Member</div>;
  };
});

const mockClient = client as unknown as { fetch: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>> };

describe('Teams Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the teams page with heading', async () => {
    mockClient.fetch.mockResolvedValue([] as never);

    const component = await Teams();
    render(component);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Meet Our Teams',
    );
  });

  it('should display team sections when members are available', async () => {
    const mockTeamMembers = [
      {
        _id: '1',
        name: 'John Doe',
        team: ['Worship'],
      },
      {
        _id: '2',
        name: 'Jane Smith',
        team: ['Welcoming'],
      },
    ];

    mockClient.fetch.mockResolvedValue(mockTeamMembers as never);

    const component = await Teams();
    render(component);

    expect(screen.getByText('Worship Team')).toBeInTheDocument();
    expect(screen.getByText('Welcoming Team')).toBeInTheDocument();
  });

  it('should display team descriptions', async () => {
    const mockTeamMembers = [
      {
        _id: '1',
        name: 'John Doe',
        team: ['Worship'],
      },
    ];

    mockClient.fetch.mockResolvedValue(mockTeamMembers as never);

    const component = await Teams();
    render(component);

    expect(
      screen.getByText(
        /The Worship Team leads our congregation in musical praise/,
      ),
    ).toBeInTheDocument();
  });

  it('should handle empty team members', async () => {
    mockClient.fetch.mockResolvedValue([] as never);

    const component = await Teams();
    render(component);

    expect(screen.getByText('Meet Our Teams')).toBeInTheDocument();
  });

  it('should fetch team members from Sanity', async () => {
    mockClient.fetch.mockResolvedValue([] as never);

    await Teams();

    expect(mockClient.fetch).toHaveBeenCalled();
  });

  it('should filter members by team correctly', async () => {
    const mockTeamMembers = [
      {
        _id: '1',
        name: 'Worship Member',
        team: ['Worship'],
      },
      {
        _id: '2',
        name: 'Welcoming Member',
        team: ['Welcoming'],
      },
    ];

    mockClient.fetch.mockResolvedValue(mockTeamMembers as never);

    const component = await Teams();
    render(component);

    expect(screen.getByTestId('team-member-1')).toBeInTheDocument();
    expect(screen.getByTestId('team-member-2')).toBeInTheDocument();
  });
});
