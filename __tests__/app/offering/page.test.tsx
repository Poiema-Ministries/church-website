// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Offering from '@/app/offering/page';
import { client } from '@/sanity/lib/client';
import { SANITY_TAGS } from '@/sanity/lib/cache';
import {
  DEFAULT_GIVE_NOW_URL,
  DEFAULT_OFFERING_LABEL,
  DEFAULT_WHY_WE_GIVE,
} from '@/app/offering/content';

jest.mock('next-sanity', () => ({
  groq: (strings: TemplateStringsArray, ...values: unknown[]) => {
    return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  },
  createClient: jest.fn(),
}));

jest.mock('@/sanity/lib/client', () => {
  const sanityClient = {
    fetch: jest.fn(),
    withConfig: jest.fn(),
  };
  sanityClient.withConfig.mockReturnValue(sanityClient);
  return { client: sanityClient };
});

const mockClient = client as unknown as {
  fetch: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>>;
  withConfig: jest.Mock;
};

describe('Offering Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.withConfig.mockReturnValue(mockClient);
    mockClient.fetch.mockResolvedValue(null);
  });

  it('should render the offering page with heading', async () => {
    render(await Offering());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Online Offering',
    );
  });

  it('should display the subtitle', async () => {
    render(await Offering());
    expect(screen.getByText(DEFAULT_OFFERING_LABEL)).toBeInTheDocument();
  });

  it('should have a "Give Now" link', async () => {
    render(await Offering());
    const giveLink = screen.getByRole('link', { name: /Give Now/i });
    expect(giveLink).toBeInTheDocument();
    expect(giveLink).toHaveAttribute('href', DEFAULT_GIVE_NOW_URL);
    expect(giveLink).toHaveAttribute('target', '_blank');
  });

  it('should display "Why We Give?" section', async () => {
    render(await Offering());
    expect(screen.getByText('Why We Give?')).toBeInTheDocument();
  });

  it('should display the giving description with Bible verse', async () => {
    render(await Offering());
    expect(screen.getByText(DEFAULT_WHY_WE_GIVE)).toBeInTheDocument();
    expect(screen.getByText(/God loves a cheerful giver./)).toBeInTheDocument();
  });

  it('should display offering banner image', async () => {
    render(await Offering());
    const image = screen.getByAltText('Offering');
    expect(image).toBeInTheDocument();
  });

  it('should show published Sanity copy and request an uncached fetch', async () => {
    mockClient.fetch.mockResolvedValue({
      label: 'Support the ministry',
      giveNowUrl: 'https://give.example.org/poiema',
      whyWeGive: 'Every gift helps us share the Gospel.',
    });

    render(await Offering());

    expect(screen.getByText('Support the ministry')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Give Now/i })).toHaveAttribute(
      'href',
      'https://give.example.org/poiema',
    );
    expect(
      screen.getByText('Every gift helps us share the Gospel.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Online Offering',
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Why We Give?',
    );

    expect(mockClient.withConfig).toHaveBeenCalledWith({ useCdn: false });
    expect(mockClient.fetch).toHaveBeenCalledWith(
      expect.stringContaining('offeringPage'),
      {},
      expect.objectContaining({
        cache: 'no-store',
        next: expect.objectContaining({
          revalidate: 0,
          tags: [SANITY_TAGS.offeringPage, SANITY_TAGS.all],
        }),
      }),
    );
  });

  it('should keep the current page copy when Sanity cannot be reached', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockClient.fetch.mockRejectedValue(new Error('network'));

    render(await Offering());
    errorSpy.mockRestore();

    expect(screen.getByText(DEFAULT_OFFERING_LABEL)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Give Now/i })).toHaveAttribute(
      'href',
      DEFAULT_GIVE_NOW_URL,
    );
  });
});
