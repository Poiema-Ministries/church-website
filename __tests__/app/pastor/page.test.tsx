// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import PastorPage from '@/app/pastor/page';
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
        url: () => 'https://cdn.example.com/pastor.jpg',
      }),
    }),
  }),
}));

const mockPastor = {
  _id: 'pastor',
  name: 'Pastor Sam Jung',
  image: {
    asset: { _id: 'img-1', url: 'https://cdn.example.com/pastor.jpg' },
  },
  description: [
    'Pastor Sam was born in Korea and came to the US in 2009 to study family counseling. He has been here at KPCB since August 2015. He is passionate to lead people to come to Jesus and follow him so that they can make Jesus known to others.',
    'This God-given passion led him to serve the young generation as a youth pastor for a decade at KPCB. As a youth pastor, he started youth discipleship training in 2018, emphasizing the importance of discipleship training for teenagers. He was ordained by the New York Presbytery of General Assembly of World Presbyterian Church Denomination in 2018.',
    'He loves mission and has joined KPCB DR (Dominican Republic) mission trips in 2019, 2023, 2024, and 2025 as a mission lead pastor. He is also passionate about counseling ministry as an effective tool of supporting churches. He and his wife Miyoung have two kids: Casey and Hanah.',
  ],
};

describe('Pastor Page', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(mockPastor);
    jest.mocked(notFound).mockClear();
  });

  it('should render the pastor page with heading', async () => {
    render(await PastorPage());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Meet Our Pastor',
    );
  });

  it('should display pastor name', async () => {
    render(await PastorPage());
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Pastor Sam Jung',
    );
  });

  it('should display pastor description paragraphs', async () => {
    render(await PastorPage());
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

  it('should display pastor image with correct alt text', async () => {
    render(await PastorPage());
    const image = screen.getByAltText('Pastor Sam Jung');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/pastor.jpg');
  });

  it('should call notFound when Sanity has no pastor document', async () => {
    mockFetch.mockResolvedValue(null);

    await expect(PastorPage()).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
