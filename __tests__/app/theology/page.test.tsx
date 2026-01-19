// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { render, screen } from '@testing-library/react';
import Theology from '@/app/theology/page';

describe('Theology Page', () => {
  it('should render the theology page with heading', () => {
    render(<Theology />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Theology',
    );
  });

  it('should display the introduction text', () => {
    render(<Theology />);
    expect(
      screen.getByText(/We belong to the General Assembly of World Presbyterian Church denomination/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Westminster Confession of Faith and its 12 creeds/),
    ).toBeInTheDocument();
  });

  it('should display all 12 creeds as a numbered list', () => {
    render(<Theology />);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(12);
  });

  it('should display the first creed', () => {
    render(<Theology />);
    expect(
      screen.getByText(
        /The Holy Scriptures of the Old and New Testaments are the Word of God/,
      ),
    ).toBeInTheDocument();
  });

  it('should display the last creed', () => {
    render(<Theology />);
    expect(
      screen.getByText(
        /The dead shall receive the reward according to the good and evils done/,
      ),
    ).toBeInTheDocument();
  });
});
