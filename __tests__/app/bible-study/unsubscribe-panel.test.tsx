// Copyright 2026 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UnsubscribePanel from '@/app/bible-study/unsubscribe/unsubscribe-panel';

describe('Bible Study unsubscribe', () => {
  it('does not call the server until the person confirms', async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn();
    global.fetch = fetchMock;

    render(<UnsubscribePanel token={'a'.repeat(43)} />);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Unsubscribe' }),
    ).toBeInTheDocument();

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ removed: true }),
    });

    await user.click(screen.getByRole('button', { name: 'Unsubscribe' }));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/bible-study/unsubscribe',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(
      await screen.findByText(/removed from the Bible Study email list/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });

  it('shows an invalid link without a token and without calling the server', () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock;

    render(<UnsubscribePanel token={null} />);

    expect(screen.getByText(/no longer valid/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
