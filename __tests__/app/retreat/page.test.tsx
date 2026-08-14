// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import RetreatPage from '@/app/retreat/page';
import { notFound } from 'next/navigation';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} />
  ),
}));

jest.mock('next-sanity', () => ({
  groq: (strings: TemplateStringsArray, ...values: unknown[]) => {
    return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  },
  createClient: jest.fn(),
}));

const mockFetch = jest.fn();

jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: (...args: unknown[]) => mockFetch(...args),
    withConfig: () => ({
      fetch: (...args: unknown[]) => mockFetch(...args),
    }),
  },
}));

jest.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    width: () => ({
      quality: () => ({
        url: () => 'https://cdn.example.com/retreat.jpg',
      }),
    }),
  }),
}));

const mockRetreat = {
  _id: 'retreat',
  isEnabled: true,
  areGroupsVisible: true,
  areBuddyQuestionsVisible: true,
  areLinksVisible: true,
  themeTitle: 'Comfort My People',
  subtitle: 'Winter Retreat 2026',
  speaker: 'Pastor Samuel Jung',
  themeImage: {
    asset: { _id: 'img-1', url: 'https://cdn.example.com/retreat.jpg' },
  },
  scheduleDays: [
    {
      _key: 'day-1',
      dayLabel: 'Thursday',
      date: 'Feb 12',
      activities: [
        {
          _key: 'act-1',
          title: 'Departure',
          startTime: '8:30 AM',
          endTime: '9:00 AM',
        },
        {
          _key: 'act-2',
          title: 'Lunch',
          startTime: '12:00 PM',
          endTime: '1:00 PM',
        },
      ],
    },
    {
      _key: 'day-2',
      dayLabel: 'Friday',
      activities: [
        {
          _key: 'act-3',
          title: 'Breakfast',
          startTime: '8:00 AM',
          endTime: '9:00 AM',
        },
      ],
    },
  ],
  groups: [
    {
      _key: 'group-1',
      name: 'Group 1',
      leader: 'Grace Yuen',
      members: ['Kenneth Kim', 'Isaac Jeong', 'Samuel Lee'],
    },
    {
      _key: 'group-2',
      name: 'Group 2',
      leader: 'Paul Ball',
      members: ['Woojin Kim', 'Vincent Jeong'],
    },
  ],
  buddyQuestions: [
    'Introduce yourself and share some fun facts about yourself (hobbies, job, major, etc.)!',
    'Rank 3 Things: Chicken, Beef, Pork',
  ],
  questionSections: [
    {
      _key: 'q-1',
      isVisible: true,
      sermonTitle: 'Comfort My People',
      bibleVerse: 'Isaiah 40:1',
      bibleVerseText:
        '1 Comfort, comfort my people, says your God.\n2 Speak tenderly to Jerusalem.',
      reflectionQuestions: [
        "How have you experienced God's comfort?",
        'Who needs comfort this week?',
      ],
    },
    {
      _key: 'q-2',
      isVisible: false,
      sermonTitle: 'Hidden Sermon',
      bibleVerse: 'Isaiah 40:11',
      reflectionQuestions: ['Should not appear'],
    },
  ],
  links: [
    {
      _key: 'link-1',
      isVisible: true,
      title: 'Sign-up Form',
      url: 'https://example.com/signup',
    },
    {
      _key: 'link-2',
      isVisible: true,
      url: 'https://example.com/notes',
    },
    {
      _key: 'link-3',
      isVisible: false,
      title: 'Hidden Link',
      url: 'https://example.com/hidden',
    },
  ],
};

describe('Retreat Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls notFound when retreat is disabled', async () => {
    mockFetch.mockResolvedValue({
      ...mockRetreat,
      isEnabled: false,
    });

    await expect(RetreatPage()).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound when retreat document is missing', async () => {
    mockFetch.mockResolvedValue(null);

    await expect(RetreatPage()).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('renders theme, schedule, groups, buddy questions, visible questions, and links', async () => {
    mockFetch.mockResolvedValue(mockRetreat);

    const component = await RetreatPage();
    render(component);

    expect(
      screen.getAllByRole('heading', { name: 'Comfort My People' }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('Winter Retreat 2026').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(/Pastor Samuel Jung/).length).toBeGreaterThan(0);
    expect(screen.getByText('Thursday')).toBeInTheDocument();
    expect(screen.getByText('Friday')).toBeInTheDocument();
    expect(screen.getByText('Departure')).toBeInTheDocument();
    expect(screen.getByText('8:30 AM – 9:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Grace Yuen')).toBeInTheDocument();
    expect(screen.getByText('Kenneth Kim')).toBeInTheDocument();
    expect(screen.getByText('Paul Ball')).toBeInTheDocument();
    expect(screen.getByText('Buddy Questions')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Introduce yourself and share some fun facts about yourself (hobbies, job, major, etc.)!',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Rank 3 Things: Chicken, Beef, Pork'),
    ).toBeInTheDocument();
    expect(screen.getByText('Reflection Questions')).toBeInTheDocument();
    expect(screen.getByText('Isaiah 40:1')).toBeInTheDocument();
    expect(
      screen.getByText('Comfort, comfort my people, says your God.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Speak tenderly to Jerusalem.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText("How have you experienced God's comfort?"),
    ).toBeInTheDocument();
    expect(screen.queryByText('Hidden Sermon')).not.toBeInTheDocument();
    expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText(/Sign-up Form:/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://example.com/signup' }),
    ).toHaveAttribute('href', 'https://example.com/signup');
    expect(
      screen.getByRole('link', { name: 'https://example.com/notes' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Hidden Link:/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'https://example.com/hidden' }),
    ).not.toBeInTheDocument();
  });

  it('hides reflection section when no questions are visible', async () => {
    mockFetch.mockResolvedValue({
      ...mockRetreat,
      questionSections: mockRetreat.questionSections.map((section) => ({
        ...section,
        isVisible: false,
      })),
    });

    const component = await RetreatPage();
    render(component);

    expect(screen.queryByText('Reflection Questions')).not.toBeInTheDocument();
  });

  it('shows coming soon when schedule is empty', async () => {
    mockFetch.mockResolvedValue({
      ...mockRetreat,
      scheduleDays: [],
    });

    const component = await RetreatPage();
    render(component);

    expect(screen.getByText('Schedule coming soon.')).toBeInTheDocument();
  });

  it('hides groups section when no groups are configured', async () => {
    mockFetch.mockResolvedValue({
      ...mockRetreat,
      groups: [],
    });

    const component = await RetreatPage();
    render(component);

    expect(screen.queryByText('Groups')).not.toBeInTheDocument();
    expect(screen.queryByText('Grace Yuen')).not.toBeInTheDocument();
  });

  it('hides groups section when the groups toggle is off', async () => {
    mockFetch.mockResolvedValue({
      ...mockRetreat,
      areGroupsVisible: false,
    });

    const component = await RetreatPage();
    render(component);

    expect(screen.queryByText('Groups')).not.toBeInTheDocument();
    expect(screen.queryByText('Grace Yuen')).not.toBeInTheDocument();
  });

  it('hides buddy questions when the toggle is off', async () => {
    mockFetch.mockResolvedValue({
      ...mockRetreat,
      areBuddyQuestionsVisible: false,
    });

    const component = await RetreatPage();
    render(component);

    expect(screen.queryByText('Buddy Questions')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Rank 3 Things: Chicken, Beef, Pork'),
    ).not.toBeInTheDocument();
  });

  it('hides links section when the links toggle is off', async () => {
    mockFetch.mockResolvedValue({
      ...mockRetreat,
      areLinksVisible: false,
    });

    const component = await RetreatPage();
    render(component);

    expect(screen.queryByText('Links')).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign-up Form:/)).not.toBeInTheDocument();
  });
});
